// Uzman ve yönetici paneli API'si (/api/admin/*). Rota katmanına girmeden önce hideAdminApi panel rolü olmayanlara genel 404 döner.
// Tüm uçlarda: requireAuth → requirePanel (rol VERİTABANINDAN, Authenticator ZORUNLU) → kapsam denetimi.
//   • Uzman (coach): yalnız KENDİSİNE atanmış üyeler ve yalnız yetkili olduğu plan türleri.
//   • Yönetici (admin): tüm üyeler ve türler; ayrıca kullanıcı rolü, uzman–üye ataması ve erişim izni yönetimi.
// Plan İÇERİĞİNİ yalnız bu uçlardan insanlar girer; sistem hiçbir plan/farmakoloji/takviye içeriği üretmez.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth, requirePanel, requireAdmin } from "../middleware/auth.js";
import { PLAN_KINDS, KIND_LABELS, isPlanKind, canAuthorKind, normalizeKinds, FORBIDDEN } from "../utils/permissions.js";
import { isNonEmptyString } from "../utils/validate.js";
import { logAudit } from "../utils/auditLog.js";
import { sendMail } from "../utils/mailer.js";
import { planPublishedMail, ticketReplyMail, mailLang } from "../utils/emailTemplates.js";
import { markOrderPaid } from "../services/orderFulfilment.js";
import { PROFILE_COLS } from "./profile.js";
import { FILE_COLS, sendAttachment, withAttachments, checkTicketAttachments, linkAttachments } from "./uploads.js";
import { forumLevel, LEVELS } from "../utils/forumLevels.js";
import { verifyTotpOnce } from "../utils/totpOnce.js";
import { validatePlanData, planDataHasContent } from "../utils/planData.js";
import { catalog as planCatalog } from "../utils/planCatalog.js";

export const adminRouter = withAsyncErrors(express.Router());
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TITLE_MAX = 140, BODY_MAX = 20000;
// Plan metni DÜZ METİNDİR: arayüz yalnız textContent ile yazar ve e-postaya hiç konmaz; bu yüzden HTML kaçışlanıp bozulmaz ("&", "<" olduğu gibi kalır).
// Yalnız denetim karakterleri (NUL vb.) atılır, satır sonları normalleştirilir.
const cleanText = (s) => String(s).replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
const ip = (req) => String(req.ip || "").slice(0, 64);
const bad = (res, msg, code) => res.status(400).json({ error: msg, ...(code ? { code } : {}) });

adminRouter.use(requireAuth, requirePanel);

/** Uzmanın bu üyeyle ilgilenme yetkisi var mı? Yönetici: her üye. Uzman: yalnız atanmış üye. */
async function canAccessMember(req, memberId) {
  if (req.adminRole === "admin") {
    const { rows } = await pool.query(`SELECT 1 FROM users WHERE id = $1 AND role = 'user'`, [memberId]);
    return rows.length > 0;
  }
  const { rows } = await pool.query(`SELECT 1 FROM coach_clients WHERE coach_id = $1 AND member_id = $2`, [req.user.sub, memberId]);
  return rows.length > 0;
}

function validatePlanFields(b, { partial = false } = {}) {
  const out = {};
  if (!partial || b.title !== undefined) {
    if (!isNonEmptyString(b.title, TITLE_MAX)) return { error: `Plan başlığı gerekli (en fazla ${TITLE_MAX} karakter).` };
    out.title = cleanText(b.title);
  }
  if (!partial || b.body !== undefined) {
    const body = typeof b.body === "string" ? b.body : "";
    if (body.length > BODY_MAX) return { error: `Plan içeriği en fazla ${BODY_MAX} karakter olabilir.` };
    out.body = cleanText(body);
  }
  for (const [k, col] of [["startsOn", "starts_on"], ["endsOn", "ends_on"]]) {
    if (b[k] === undefined && partial) continue;
    if (b[k] === null || b[k] === "" || b[k] === undefined) { out[col] = null; continue; }
    if (typeof b[k] !== "string" || !DATE_RE.test(b[k]) || Number.isNaN(Date.parse(b[k]))) return { error: "Tarih biçimi YYYY-AA-GG olmalı." };
    out[col] = b[k];
  }
  if (out.starts_on && out.ends_on && out.ends_on < out.starts_on) return { error: "Bitiş tarihi başlangıç tarihinden önce olamaz." };
  return { out };
}

// ---------- panel bilgisi ----------
adminRouter.get("/plan-catalog", (req, res) => { res.setHeader("Cache-Control", "private, max-age=300"); res.json(planCatalog()); });
adminRouter.get("/me", async (req, res) => {
  res.json({ role: req.adminRole, name: req.panelName, kinds: req.adminRole === "admin" ? PLAN_KINDS : req.panelKinds, kindLabels: KIND_LABELS });
});

// ---------- üyeler ----------
adminRouter.get("/clients", async (req, res) => {
  const admin = req.adminRole === "admin";
  const { rows } = await pool.query(
    admin
      ? `SELECT u.id, u.full_name, u.user_code, u.email_verified_at IS NOT NULL AS verified,
                (SELECT coalesce(json_agg(kind ORDER BY kind), '[]') FROM member_access a WHERE a.member_id = u.id) AS access,
                (SELECT row_to_json(o) FROM (SELECT package_key, weeks, pharmacology, paid_at, plans_due_at FROM orders WHERE user_id = u.id AND status = 'paid' ORDER BY paid_at DESC LIMIT 1) o) AS package,
                (SELECT coalesce(json_agg(json_build_object('coachId', c.coach_id, 'coachName', cu.full_name, 'delivery', c.delivery)), '[]')
                   FROM coach_clients c JOIN users cu ON cu.id = c.coach_id WHERE c.member_id = u.id) AS coaches
           FROM users u WHERE u.role = 'user' AND ($1::text = '' OR u.id::text = $1) ORDER BY u.created_at DESC LIMIT 500`
      : `SELECT u.id, u.full_name, u.user_code, u.email_verified_at IS NOT NULL AS verified, c.delivery,
                (SELECT coalesce(json_agg(kind ORDER BY kind), '[]') FROM member_access a WHERE a.member_id = u.id) AS access,
                (SELECT row_to_json(o) FROM (SELECT package_key, weeks, pharmacology, paid_at, plans_due_at FROM orders WHERE user_id = u.id AND status = 'paid' ORDER BY paid_at DESC LIMIT 1) o) AS package
           FROM coach_clients c JOIN users u ON u.id = c.member_id WHERE c.coach_id = $1 AND u.role = 'user' ORDER BY u.full_name LIMIT 500`,
    admin ? [ID_RE.test(String(req.query.id || "")) ? String(req.query.id) : ""] : [req.user.sub]   // ?id= : tek üye (yönetim listesinden açılır)
  );
  res.json(rows);
});

// ---------- planlar ----------
adminRouter.get("/clients/:id/plans", async (req, res) => {
  if (!ID_RE.test(req.params.id) || !(await canAccessMember(req, req.params.id))) return res.status(404).json({ error: "Üye bulunamadı." });
  const kinds = req.adminRole === "admin" ? PLAN_KINDS : req.panelKinds;
  const { rows } = await pool.query(
    `SELECT id, kind, title, body, data, starts_on, ends_on, status, author_name, published_by_name, published_at, created_at, updated_at
       FROM plans WHERE member_id = $1 AND kind = ANY($2::text[]) ORDER BY updated_at DESC LIMIT 200`,
    [req.params.id, kinds]
  );
  res.json(rows);
});

adminRouter.post("/plans", async (req, res) => {
  const { memberId, kind } = req.body || {};
  if (!ID_RE.test(String(memberId || "")) || !isPlanKind(kind)) return bad(res, "Üye ve plan türü gerekli.");
  if (!canAuthorKind(req.adminRole, req.panelKinds, kind)) return res.status(403).json({ error: FORBIDDEN, code: "forbidden_kind" });
  if (!(await canAccessMember(req, memberId))) return res.status(404).json({ error: "Üye bulunamadı." });
  const acc = await pool.query(`SELECT 1 FROM member_access WHERE member_id = $1 AND kind = $2`, [memberId, kind]);
  if (!acc.rows.length) return res.status(409).json({ error: `Üyenin "${KIND_LABELS[kind]}" için erişim izni yok. Önce yönetici erişim izni vermelidir.`, code: "no_access" });
  const v = validatePlanFields(req.body);
  if (v.error) return bad(res, v.error);
  const pd = validatePlanData(kind, req.body.data);
  if (pd.error) return bad(res, pd.error);
  const { rows } = await pool.query(
    `INSERT INTO plans (member_id, kind, title, body, starts_on, ends_on, author_id, author_name, data)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [memberId, kind, v.out.title, v.out.body, v.out.starts_on, v.out.ends_on, req.user.sub, req.panelName, pd.data ? JSON.stringify(pd.data) : null]
  );
  await logAudit(req.user.sub, "plan_create", "plan", rows[0].id, { kind, memberId }, ip(req));
  res.status(201).json({ id: rows[0].id });
});

/** Düzenlenecek/işlem yapılacak plan: kapsam (üye + tür) denetlenir; yetkisizse "bulunamadı". */
async function loadPlan(req, res) {
  if (!ID_RE.test(req.params.id)) { res.status(404).json({ error: "Plan bulunamadı." }); return null; }
  const { rows } = await pool.query(`SELECT * FROM plans WHERE id = $1`, [req.params.id]);
  const plan = rows[0];
  if (!plan || !(await canAccessMember(req, plan.member_id))) { res.status(404).json({ error: "Plan bulunamadı." }); return null; }
  if (!canAuthorKind(req.adminRole, req.panelKinds, plan.kind)) { res.status(403).json({ error: FORBIDDEN, code: "forbidden_kind" }); return null; }
  return plan;
}

adminRouter.patch("/plans/:id", async (req, res) => {
  const plan = await loadPlan(req, res); if (!plan) return;
  if (plan.status === "archived") return res.status(409).json({ error: "Arşivlenmiş plan düzenlenemez." });
  const v = validatePlanFields(req.body || {}, { partial: true });
  if (v.error) return bad(res, v.error);
  if (req.body && req.body.data !== undefined) {
    const pd = validatePlanData(plan.kind, req.body.data);
    if (pd.error) return bad(res, pd.error);
    v.out.data = pd.data ? JSON.stringify(pd.data) : null;
  }
  const cols = Object.keys(v.out);
  if (!cols.length) return bad(res, "Değiştirilecek alan yok.");
  const set = cols.map((c, i) => `${c} = $${i + 2}`).join(", ");
  await pool.query(`UPDATE plans SET ${set}, updated_at = now() WHERE id = $1`, [plan.id, ...cols.map((c) => v.out[c])]);
  await logAudit(req.user.sub, "plan_update", "plan", plan.id, { fields: cols }, ip(req));
  res.json({ ok: true });
});

adminRouter.post("/plans/:id/publish", async (req, res) => {
  const plan = await loadPlan(req, res); if (!plan) return;
  if (plan.status === "published") return res.json({ ok: true, already: true });
  if (plan.status === "archived") return res.status(409).json({ error: "Arşivlenmiş plan yayınlanamaz." });
  if (!plan.body.trim() && !planDataHasContent(plan.kind, plan.data)) return bad(res, "İçeriği boş plan yayınlanamaz.");
  const acc = await pool.query(`SELECT 1 FROM member_access WHERE member_id = $1 AND kind = $2`, [plan.member_id, plan.kind]);
  if (!acc.rows.length) return res.status(409).json({ error: "Üyenin bu tür için erişim izni yok.", code: "no_access" });
  await pool.query(
    `UPDATE plans SET status = 'published', published_at = now(), published_by = $2, published_by_name = $3, updated_at = now() WHERE id = $1`,
    [plan.id, req.user.sub, req.panelName]
  );
  await pool.query(`INSERT INTO notifications (user_id, type, text, plan_id, data) VALUES ($1, 'plan_published', $2, $3, $4)`,
    [plan.member_id, `Yeni plan yayınlandı: ${KIND_LABELS[plan.kind]} — ${plan.title}`, plan.id, JSON.stringify({ kind: plan.kind, title: plan.title })]);
  await logAudit(req.user.sub, "plan_publish", "plan", plan.id, { kind: plan.kind, memberId: plan.member_id }, ip(req));
  const { rows } = await pool.query(`SELECT email, preferred_lang FROM users WHERE id = $1`, [plan.member_id]);
  if (rows[0]) sendMail(rows[0].email, planPublishedMail(rows[0].preferred_lang, { kindLabel: KIND_LABELS[plan.kind], authorName: plan.author_name })).catch(() => {});
  res.json({ ok: true });
});

// Yayından kaldır: plan taslağa döner ve üyenin panelinden hemen kaybolur.
adminRouter.post("/plans/:id/unpublish", async (req, res) => {
  const plan = await loadPlan(req, res); if (!plan) return;
  if (plan.status !== "published") return res.status(409).json({ error: "Plan yayında değil." });
  await pool.query(`UPDATE plans SET status = 'draft', published_at = NULL, published_by = NULL, published_by_name = NULL, updated_at = now() WHERE id = $1`, [plan.id]);
  await logAudit(req.user.sub, "plan_unpublish", "plan", plan.id, { kind: plan.kind }, ip(req));
  res.json({ ok: true });
});

adminRouter.post("/plans/:id/archive", async (req, res) => {
  const plan = await loadPlan(req, res); if (!plan) return;
  if (plan.status !== "published") return res.status(409).json({ error: "Yalnız yayınlanmış plan arşivlenir." });
  await pool.query(`UPDATE plans SET status = 'archived', updated_at = now() WHERE id = $1`, [plan.id]);
  await logAudit(req.user.sub, "plan_archive", "plan", plan.id, { kind: plan.kind }, ip(req));
  res.json({ ok: true });
});

adminRouter.delete("/plans/:id", async (req, res) => {
  const plan = await loadPlan(req, res); if (!plan) return;
  if (plan.status !== "draft" && req.adminRole !== "admin") return res.status(409).json({ error: "Yayınlanmış plan silinemez; önce yayından kaldırın.", code: "not_draft" });
  await pool.query(`DELETE FROM plans WHERE id = $1`, [plan.id]);
  await logAudit(req.user.sub, "plan_delete", "plan", plan.id, { kind: plan.kind, status: plan.status }, ip(req));
  res.json({ ok: true });
});

// ================= YALNIZ YÖNETİCİ =================
adminRouter.get("/users", requireAdmin, async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 80);
  const role = ["user", "coach", "admin"].includes(req.query.role) ? req.query.role : null;
  const { rows } = await pool.query(
    `SELECT id, full_name, username, email, role, plan_kinds, user_code, totp_enabled, email_verified_at IS NOT NULL AS verified, created_at
       FROM users WHERE ($1::text IS NULL OR role = $1)
        AND ($2 = '' OR full_name ILIKE '%' || $2 || '%' OR email ILIKE '%' || $2 || '%' OR username ILIKE '%' || $2 || '%' OR user_code ILIKE '%' || $2 || '%')
       ORDER BY created_at DESC LIMIT 200`,
    [role, q.replace(/[%_\\]/g, "")]
  );
  res.json(rows);
});

// Rol ve uzman yetkileri. Oturumlar kapanır (token_version) — yetki değişikliği anında geçerli olur. Kendi rolünü değiştiremez.
adminRouter.put("/users/:id/role", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  if (req.params.id === req.user.sub) return res.status(409).json({ error: "Kendi rolünüzü değiştiremezsiniz.", code: "self" });
  const { role } = req.body || {};
  if (!["user", "coach", "admin"].includes(role)) return bad(res, "Geçersiz rol.");
  const kinds = role === "coach" ? normalizeKinds(req.body.planKinds) : [];
  const { rows } = await pool.query(
    `UPDATE users SET role = $2, plan_kinds = $3, token_version = token_version + 1 WHERE id = $1 AND email_verified_at IS NOT NULL RETURNING id`,
    [req.params.id, role, kinds]
  );
  if (!rows[0]) return res.status(404).json({ error: "Kullanıcı bulunamadı veya e-postası doğrulanmamış." });
  if (role !== "user") await pool.query(`DELETE FROM member_access WHERE member_id = $1`, [req.params.id]);
  if (role !== "coach") await pool.query(`DELETE FROM coach_clients WHERE coach_id = $1`, [req.params.id]);
  if (role !== "user") await pool.query(`DELETE FROM coach_clients WHERE member_id = $1`, [req.params.id]);
  await logAudit(req.user.sub, "user_role_set", "user", req.params.id, { role, planKinds: kinds }, ip(req));
  res.json({ ok: true });
});

// Üyenin erişebileceği plan türleri (tamamını değiştirir).
adminRouter.put("/members/:id/access", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Üye bulunamadı." });
  const kinds = normalizeKinds(req.body && req.body.kinds);
  const m = await pool.query(`SELECT 1 FROM users WHERE id = $1 AND role = 'user'`, [req.params.id]);
  if (!m.rows.length) return res.status(404).json({ error: "Üye bulunamadı." });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM member_access WHERE member_id = $1 AND NOT (kind = ANY($2::text[]))`, [req.params.id, kinds]);
    for (const k of kinds) {
      await client.query(`INSERT INTO member_access (member_id, kind, granted_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`, [req.params.id, k, req.user.sub]);
    }
    await client.query("COMMIT");
  } catch (err) { await client.query("ROLLBACK").catch(() => {}); throw err; } finally { client.release(); }
  await logAudit(req.user.sub, "member_access_set", "user", req.params.id, { kinds }, ip(req));
  res.json({ ok: true, kinds });
});

// Uzman–üye ataması.
adminRouter.put("/assignments", requireAdmin, async (req, res) => {
  const { coachId, memberId } = req.body || {};
  const delivery = req.body?.delivery === undefined ? "online" : req.body.delivery;   // yalnız uzaktan eğitim (yüz yüze hizmet verilmez)
  if (!ID_RE.test(String(coachId || "")) || !ID_RE.test(String(memberId || ""))) return bad(res, "Uzman ve üye gerekli.");
  if (delivery !== "online") return bad(res, "Koçluk yalnız uzaktan (online) verilir.");
  const chk = await pool.query(`SELECT (SELECT count(*) FROM users WHERE id = $1 AND role = 'coach')::int AS c, (SELECT count(*) FROM users WHERE id = $2 AND role = 'user')::int AS m`, [coachId, memberId]);
  if (!chk.rows[0].c || !chk.rows[0].m) return res.status(404).json({ error: "Uzman veya üye bulunamadı." });
  await pool.query(
    `INSERT INTO coach_clients (coach_id, member_id, delivery, created_by) VALUES ($1,$2,$3,$4)
     ON CONFLICT (coach_id, member_id) DO UPDATE SET delivery = EXCLUDED.delivery`,
    [coachId, memberId, delivery, req.user.sub]
  );
  await logAudit(req.user.sub, "assignment_set", "user", memberId, { coachId, delivery }, ip(req));
  res.json({ ok: true });
});

adminRouter.delete("/assignments", requireAdmin, async (req, res) => {
  const { coachId, memberId } = req.body || {};
  if (!ID_RE.test(String(coachId || "")) || !ID_RE.test(String(memberId || ""))) return bad(res, "Uzman ve üye gerekli.");
  await pool.query(`DELETE FROM coach_clients WHERE coach_id = $1 AND member_id = $2`, [coachId, memberId]);
  await logAudit(req.user.sub, "assignment_remove", "user", memberId, { coachId }, ip(req));
  res.json({ ok: true });
});

// Denetim kaydı: arama ve filtre (işlem, kim, tarih aralığı), sayfalama (önceki kayda göre), her kaydın tüm ayrıntıları.
adminRouter.get("/audit", requireAdmin, async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 80).replace(/[%_\\]/g, "");
  const action = /^[a-z0-9_]{1,60}$/.test(String(req.query.action || "")) ? String(req.query.action) : null;
  const from = DATE_RE.test(String(req.query.from || "")) ? req.query.from : null, to = DATE_RE.test(String(req.query.to || "")) ? req.query.to : null;
  const before = req.query.before && !Number.isNaN(Date.parse(req.query.before)) ? new Date(req.query.before).toISOString() : null;
  const { rows } = await pool.query(
    `SELECT a.id, a.action, a.target_type, a.target_id, a.details, a.ip_address, a.created_at, u.full_name AS actor_name, u.username AS actor_username, u.role AS actor_role,
            tu.full_name AS target_name, tu.username AS target_username
       FROM audit_log a LEFT JOIN users u ON u.id = a.actor_id
       LEFT JOIN users tu ON a.target_type = 'user' AND tu.id::text = a.target_id
      WHERE ($1::text IS NULL OR a.action = $1)
        AND ($2::date IS NULL OR a.created_at >= $2::date) AND ($3::date IS NULL OR a.created_at < $3::date + 1)
        AND ($4::timestamptz IS NULL OR a.created_at < $4)
        AND ($5 = '' OR u.full_name ILIKE '%' || $5 || '%' OR u.username ILIKE '%' || $5 || '%' OR tu.full_name ILIKE '%' || $5 || '%' OR tu.username ILIKE '%' || $5 || '%'
             OR a.target_id ILIKE '%' || $5 || '%' OR a.ip_address ILIKE '%' || $5 || '%' OR a.details::text ILIKE '%' || $5 || '%')
      ORDER BY a.created_at DESC, a.id DESC LIMIT 100`, [action, from, to, before, q]);
  res.json(rows);
});
adminRouter.get("/audit/actions", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT action, count(*)::int AS n FROM audit_log GROUP BY action ORDER BY action`);
  res.json(rows);
});

// ============ ÜYE YÖNETİMİ (YALNIZ YÖNETİCİ): arama/filtre, engelleme, süreli yasak (≤ 48 sa), kalıcı yasak, forum seviyesi ============
const MEMBER_ROW = `u.id, u.full_name, u.username, u.email, u.role, u.user_code, u.created_at, u.email_verified_at IS NOT NULL AS verified, u.totp_enabled,
  u.locked_at, u.locked_until, u.locked_reason, u.plan_kinds,
  coalesce(f.level_override, NULL) AS level_override, coalesce(f.forum_role, 'member') AS forum_role, coalesce(f.topics, 0) AS topics, coalesce(f.posts, 0) AS posts,
  coalesce(f.likes, 0) AS likes, coalesce(f.dislikes, 0) AS dislikes, coalesce(f.reports_received, 0) AS reports_received, coalesce(f.reports_upheld, 0) AS reports_upheld`;
function memberOut(r) {
  const now = Date.now(), active = r.locked_at && (!r.locked_until || new Date(r.locked_until).getTime() > now);
  const admin = String(r.locked_reason || "").startsWith("admin_");
  const state = !active ? "active" : r.locked_reason === "admin_block" ? "blocked" : r.locked_reason === "admin_ban" ? "banned" : "locked";
  const { locked_reason, ...rest } = r;
  return { ...rest, state, adminLock: active && admin, forumLevel: forumLevel(r, r.role) };
}
adminRouter.get("/members", requireAdmin, async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 80).replace(/[%_\\]/g, "");
  const st = String(req.query.state || ""), verified = String(req.query.verified || ""), totp = String(req.query.totp || ""), role = String(req.query.role || "");
  const sort = { new: "u.created_at DESC", old: "u.created_at ASC", name: "u.full_name ASC", reports: "coalesce(f.reports_received,0) DESC, u.created_at DESC" }[req.query.sort] || "u.created_at DESC";
  const { rows } = await pool.query(
    `SELECT ${MEMBER_ROW} FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id
      WHERE ($1 = '' OR u.full_name ILIKE '%' || $1 || '%' OR u.username ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%' OR u.user_code ILIKE '%' || $1 || '%')
        AND ($2 = '' OR ($2 = 'yes') = (u.email_verified_at IS NOT NULL))
        AND ($3 = '' OR ($3 = 'on') = u.totp_enabled)
        AND ($4 = '' OR u.role = $4)
      ORDER BY ${sort} LIMIT 300`, [q, ["yes", "no"].includes(verified) ? verified : "", ["on", "off"].includes(totp) ? totp : "", ["user", "coach", "admin"].includes(role) ? role : ""]);
  let out = rows.map(memberOut);
  if (["active", "blocked", "banned", "locked"].includes(st)) out = out.filter((m) => m.state === st);
  res.json(out);
});
async function targetMember(req, res) {
  if (!ID_RE.test(req.params.id)) { res.status(404).json({ error: "Üye bulunamadı." }); return null; }
  if (req.params.id === req.user.sub) { res.status(409).json({ error: "Bu işlemi kendi hesabınıza uygulayamazsınız.", code: "self" }); return null; }
  const { rows } = await pool.query(`SELECT id, role, email, username, full_name FROM users WHERE id = $1`, [req.params.id]);
  if (!rows[0]) { res.status(404).json({ error: "Üye bulunamadı." }); return null; }
  if (rows[0].role === "admin") { res.status(409).json({ error: "Yönetici hesaplarına bu işlem uygulanamaz; önce rolünü değiştirin.", code: "admin_target" }); return null; }
  return rows[0];
}
const reasonOf = (b) => cleanText((b && b.reason) ?? "").slice(0, 300);
async function lockNotice(userId, text) { await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`, [userId, text]).catch(() => {}); }
// Engelle: süresiz; üye giriş yapamaz, açık oturumları kapanır. Kaldırılana kadar sürer.
adminRouter.post("/members/:id/block", requireAdmin, async (req, res) => {
  const t = await targetMember(req, res); if (!t) return;
  const reason = reasonOf(req.body); if (reason.length < 5) return bad(res, "Gerekçe en az 5 karakter olmalıdır.");
  await pool.query(`UPDATE users SET locked_at = now(), locked_until = NULL, locked_reason = 'admin_block', token_version = token_version + 1 WHERE id = $1`, [t.id]);
  await logAudit(req.user.sub, "member_block", "user", t.id, { reason }, ip(req));
  res.json({ ok: true });
});
// Süreli yasak: en fazla 48 saat; süre dolunca kendiliğinden kalkar. Şifre sıfırlamayla kaldırılamaz.
adminRouter.post("/members/:id/ban", requireAdmin, async (req, res) => {
  const t = await targetMember(req, res); if (!t) return;
  const hours = Number(req.body && req.body.hours);
  if (!Number.isInteger(hours) || hours < 1 || hours > 48) return bad(res, "Süreli yasak 1–48 saat arasında olmalıdır.");
  const reason = reasonOf(req.body); if (reason.length < 5) return bad(res, "Gerekçe en az 5 karakter olmalıdır.");
  const { rows } = await pool.query(`UPDATE users SET locked_at = now(), locked_until = now() + make_interval(hours => $2), locked_reason = 'admin_ban', token_version = token_version + 1 WHERE id = $1 RETURNING locked_until`, [t.id, hours]);
  await logAudit(req.user.sub, "member_ban", "user", t.id, { hours, reason, until: rows[0].locked_until }, ip(req));
  res.json({ ok: true, until: rows[0].locked_until });
});
// Engeli / yasağı / kilidi kaldır.
adminRouter.post("/members/:id/unblock", requireAdmin, async (req, res) => {
  const t = await targetMember(req, res); if (!t) return;
  await pool.query(`UPDATE users SET locked_at = NULL, locked_until = NULL, locked_reason = NULL WHERE id = $1`, [t.id]);
  await pool.query(`DELETE FROM rate_limit_state WHERE identifier = $1 OR identifier LIKE $2`, [`verify:${t.id}`, `%:${t.id}`]).catch(() => {});
  await logAudit(req.user.sub, "member_unblock", "user", t.id, {}, ip(req));
  res.json({ ok: true });
});
// Kalıcı yasak (üye silme): hesap ve tüm verileri silinir, e-postası (özet olarak) yeniden kayıt olamaz.
// Geri alınamaz — yöneticinin Google Authenticator kodu ve gerekçe zorunludur.
adminRouter.delete("/members/:id", requireAdmin, async (req, res) => {
  const t = await targetMember(req, res); if (!t) return;
  const reason = reasonOf(req.body); if (reason.length < 10) return bad(res, "Kalıcı yasak için gerekçe en az 10 karakter olmalıdır.");
  const token = String((req.body && req.body.token) || "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(token)) return bad(res, "Google Authenticator kodunuzu girin.", "totp_required");
  const me = await pool.query(`SELECT totp_secret FROM users WHERE id = $1`, [req.user.sub]);
  if (!me.rows[0] || !(await verifyTotpOnce(req.user.sub, token, me.rows[0].totp_secret))) return bad(res, "Google Authenticator kodu doğrulanamadı.", "wrong_code");
  await pool.query(`INSERT INTO banned_emails (email_hash, reason, banned_by) VALUES (encode(digest(lower($1), 'sha256'), 'hex'), $2, $3) ON CONFLICT (email_hash) DO NOTHING`, [t.email, reason, req.user.sub]);
  await logAudit(req.user.sub, "member_perma_ban", "user", t.id, { reason, username: t.username, name: t.full_name }, ip(req));
  await pool.query(`DELETE FROM users WHERE id = $1`, [t.id]);
  res.json({ ok: true });
});
// Forum: elle seviye (otomatik sistemden bağımsız; null → otomatik) ve moderatör ataması.
adminRouter.put("/members/:id/forum", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Üye bulunamadı." });
  const b = req.body || {};
  const lv = b.levelOverride === null || b.levelOverride === "" || b.levelOverride === undefined ? null : Number(b.levelOverride);
  if (lv !== null && !(Number.isInteger(lv) && lv >= 1 && lv <= LEVELS.length)) return bad(res, "Geçersiz forum seviyesi.");
  const fr = b.forumRole === "moderator" ? "moderator" : "member";
  const u = await pool.query(`SELECT 1 FROM users WHERE id = $1`, [req.params.id]);
  if (!u.rows.length) return res.status(404).json({ error: "Üye bulunamadı." });
  await pool.query(`INSERT INTO forum_profiles (user_id, level_override, forum_role, updated_at) VALUES ($1, $2, $3, now())
    ON CONFLICT (user_id) DO UPDATE SET level_override = $2, forum_role = $3, updated_at = now()`, [req.params.id, lv, fr]);
  await logAudit(req.user.sub, "member_forum_set", "user", req.params.id, { levelOverride: lv, forumRole: fr }, ip(req));
  res.json({ ok: true });
});
adminRouter.get("/forum/levels", requireAdmin, (req, res) => res.json(LEVELS));


// Blog yönetimi panelden kaldırıldı (yönetim forum alanına taşınacak). Herkese açık blog yazıları yerinde durur.

adminRouter.get("/clients/:id/profile", async (req, res) => {
  if (!ID_RE.test(req.params.id) || !(await canAccessMember(req, req.params.id))) return res.status(404).json({ error: "Üye bulunamadı." });
  const { rows } = await pool.query(`SELECT ${PROFILE_COLS} FROM member_profiles WHERE user_id = $1`, [req.params.id]);
  res.setHeader("Cache-Control", "no-store");
  res.json(rows[0] || null);
});
adminRouter.get("/clients/:id/files", async (req, res) => {
  if (!ID_RE.test(req.params.id) || !(await canAccessMember(req, req.params.id))) return res.status(404).json({ error: "Üye bulunamadı." });
  const { rows } = await pool.query(`SELECT ${FILE_COLS} FROM attachments WHERE user_id = $1 AND scope IN ('profile', 'body') ORDER BY created_at`, [req.params.id]);
  res.json(rows);
});
// Ek görüntüleme: kişisel bilgi eki → yönetici veya üyeye atanmış uzman; destek talebi eki → yalnız yönetici (talepleri yalnız yönetici görür).
adminRouter.get("/attachments/:id", async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Dosya bulunamadı." });
  const { rows } = await pool.query(`SELECT user_id, scope, message_id, filename, mime, data FROM attachments WHERE id = $1`, [req.params.id]);
  const a = rows[0];
  const ok = a && (a.scope === "profile" || a.scope === "body" ? await canAccessMember(req, a.user_id) : req.adminRole === "admin" && (a.message_id || a.user_id === req.user.sub));
  if (!ok) return res.status(404).json({ error: "Dosya bulunamadı." });
  sendAttachment(res, a);
});

// ---------- siparişler (yalnız yönetici) ----------
adminRouter.get("/orders", requireAdmin, async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 80).replace(/[%_\\]/g, "");
  const status = ["pending", "paid", "expired", "cancelled"].includes(req.query.status) ? req.query.status : null;
  const delivery = ["waiting", "preparing", "delivered"].includes(req.query.delivery) ? req.query.delivery : null;
  const from = DATE_RE.test(String(req.query.from || "")) ? req.query.from : null, to = DATE_RE.test(String(req.query.to || "")) ? req.query.to : null;
  const { rows } = await pool.query(
    `SELECT o.id, o.order_number, o.buyer_name, o.buyer_email, o.user_id, u.username, u.full_name AS member_name, o.package_key, o.weeks, o.pharmacology, o.subtotal, o.currency, o.status,
            o.payment_provider, o.payment_ref, o.payment_attempts, o.paid_at, o.plans_due_at, o.created_at, o.payment_expires_at, o.delivery_status, o.delivered_at,
            (SELECT count(*)::int FROM plans p WHERE p.member_id = o.user_id AND p.status = 'published' AND p.published_at >= o.paid_at) AS plans_published
       FROM orders o LEFT JOIN users u ON u.id = o.user_id
      WHERE ($1 = '' OR o.order_number ILIKE '%' || $1 || '%' OR o.buyer_name ILIKE '%' || $1 || '%' OR o.buyer_email ILIKE '%' || $1 || '%' OR u.username ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR o.status = $2) AND ($3::text IS NULL OR o.delivery_status = $3)
        AND ($4::date IS NULL OR o.created_at >= $4::date) AND ($5::date IS NULL OR o.created_at < $5::date + 1)
      ORDER BY o.created_at DESC LIMIT 300`, [q, status, delivery, from, to]);
  res.json(rows);
});
// Teslim durumu: bekliyor → hazırlanıyor → teslim edildi (yalnız ödenmiş siparişte). "Teslim edildi"de üyeye bildirim gider.
const DELIVERY_TEXT = { waiting: "Bekliyor", preparing: "Hazırlanıyor", delivered: "Teslim edildi" };
adminRouter.patch("/orders/:id/delivery", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Sipariş bulunamadı." });
  const st = req.body && req.body.status;
  if (!DELIVERY_TEXT[st]) return bad(res, "Geçersiz teslim durumu.");
  const { rows } = await pool.query(
    `UPDATE orders SET delivery_status = $2, delivered_at = CASE WHEN $2 = 'delivered' THEN now() ELSE NULL END WHERE id = $1 AND status = 'paid' RETURNING id, user_id, order_number`, [req.params.id, st]);
  if (!rows[0]) return res.status(409).json({ error: "Teslim durumu yalnız ödenmiş siparişlerde değiştirilebilir." });
  if (st === "delivered" && rows[0].user_id) await pool.query(`INSERT INTO notifications (user_id, type, text, order_id) VALUES ($1, 'order_paid', $2, $3)`,
    [rows[0].user_id, `${rows[0].order_number} numaralı siparişinizin planları teslim edildi.`, rows[0].id]).catch(() => {});
  await logAudit(req.user.sub, "order_delivery_set", "order", req.params.id, { status: st }, ip(req));
  res.json({ ok: true });
});
// Elle ödeme onayı: gerekçe ZORUNLU; denetim kaydına yazılır. (Normalde sanal POS ödemeyi otomatik onaylar; elle onay istisnadır, ör. havale ile ödeme doğrulandığında.)
adminRouter.post("/orders/:id/approve", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Sipariş bulunamadı." });
  const reason = cleanText((req.body && req.body.reason) ?? "").slice(0, 300);
  if (!reason || reason.length < 10) return bad(res, "Gerekçe en az 10 karakter olmalıdır.");
  const ref = req.body && req.body.paymentRef ? cleanText(req.body.paymentRef).slice(0, 80) : null;
  const ex = await pool.query(`SELECT status FROM orders WHERE id = $1`, [req.params.id]);
  if (!ex.rows[0]) return res.status(404).json({ error: "Sipariş bulunamadı." });
  const ok = await markOrderPaid(req.params.id, { paymentRef: ref, actorId: req.user.sub, note: reason, source: "admin_manual" }).catch((e) => {
    if (e.code === "23505") return "dup"; throw e; });
  if (ok === "dup") return res.status(409).json({ error: "Bu ödeme referansı başka bir siparişte kayıtlı." });
  if (!ok) return res.status(409).json({ error: "Bu sipariş onaylanabilir durumda değil.", code: "not_approvable" });
  // Onayda hangi plan bölümlerinin açılacağı seçildiyse üyenin erişimi tam olarak bu seçime ayarlanır (aksi hâlde paketin varsayılanı).
  if (Array.isArray(req.body && req.body.kinds)) {
    const kinds = normalizeKinds(req.body.kinds);
    const o = await pool.query(`SELECT user_id FROM orders WHERE id = $1`, [req.params.id]);
    if (o.rows[0] && o.rows[0].user_id) {
      await pool.query(`DELETE FROM member_access WHERE member_id = $1 AND NOT (kind = ANY($2::text[]))`, [o.rows[0].user_id, kinds]);
      for (const k of kinds) await pool.query(`INSERT INTO member_access (member_id, kind, granted_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`, [o.rows[0].user_id, k, req.user.sub]);
      await logAudit(req.user.sub, "member_access_set", "user", o.rows[0].user_id, { kinds, via: "order_approve" }, ip(req));
    }
  }
  res.json({ ok: true });
});

// ============ DESTEK TALEPLERİ (YALNIZ YÖNETİCİ) ============
adminRouter.get("/support/summary", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT (SELECT count(*) FROM tickets WHERE status = 'open')::int AS tickets`);
  res.json(rows[0]);
});
adminRouter.get("/tickets", requireAdmin, async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 80).replace(/[%_\\]/g, "");
  const status = ["open", "answered", "closed"].includes(req.query.status) ? req.query.status : null;
  const subject = typeof req.query.subject === "string" && req.query.subject.length <= 60 ? req.query.subject : "";
  const from = DATE_RE.test(String(req.query.from || "")) ? req.query.from : null, to = DATE_RE.test(String(req.query.to || "")) ? req.query.to : null;
  const { rows } = await pool.query(
    `SELECT t.id, t.ticket_number, t.title, t.subject, t.status, t.created_at, t.updated_at, t.closed_by, u.full_name, u.username, u.email, u.user_code
       FROM tickets t JOIN users u ON u.id = t.user_id
      WHERE ($1 = '' OR t.ticket_number ILIKE '%' || $1 || '%' OR t.title ILIKE '%' || $1 || '%' OR u.full_name ILIKE '%' || $1 || '%' OR u.username ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR t.status = $2) AND ($3 = '' OR t.subject = $3)
        AND ($4::date IS NULL OR t.created_at >= $4::date) AND ($5::date IS NULL OR t.created_at < $5::date + 1)
      ORDER BY (t.status = 'open') DESC, t.updated_at DESC LIMIT 300`, [q, status, subject, from, to]);
  res.json(rows);
});
adminRouter.get("/tickets/:id", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const t = await pool.query(
    `SELECT t.id, t.ticket_number, t.title, t.subject, t.status, t.created_at, t.updated_at, t.closed_by, u.full_name, u.username, u.email, u.user_code
       FROM tickets t JOIN users u ON u.id = t.user_id WHERE t.id = $1`, [req.params.id]);
  if (!t.rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const m = await pool.query(`SELECT id, from_role, body, created_at FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC, id ASC`, [req.params.id]);
  res.json({ ...t.rows[0], messages: await withAttachments(m.rows) });
});
adminRouter.post("/tickets/:id/reply", requireAdmin, async (req, res) => {
  const m = req.body && req.body.message;
  if (typeof m !== "string" || !m.trim()) return bad(res, "Mesaj boş olamaz.");
  if (m.length > 1444) return bad(res, "Mesaj en fazla 1444 karakter olabilir.");
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const t = await pool.query(`SELECT id, user_id, ticket_number, status FROM tickets WHERE id = $1`, [req.params.id]);
  if (!t.rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  if (t.rows[0].status === "closed") return res.status(409).json({ error: "Bu destek talebi kapatılmış; yanıt verilemez." });
  const att = await checkTicketAttachments(req.user.sub, req.body.attachments);
  if (att.error) return bad(res, att.error);
  const { rows } = await pool.query(
    `INSERT INTO ticket_messages (ticket_id, from_role, admin_id, body) VALUES ($1, 'support', $2, $3) RETURNING id, from_role, body, created_at`, [req.params.id, req.user.sub, cleanText(m)]);
  await linkAttachments(pool, req.user.sub, rows[0].id, att.ids);
  await pool.query(`UPDATE tickets SET status = 'answered', updated_at = now() WHERE id = $1 RETURNING id`, [req.params.id]);
  await pool.query(`INSERT INTO notifications (user_id, type, text, data) VALUES ($1, 'ticket', $2, $3) RETURNING id`, [t.rows[0].user_id, `${t.rows[0].ticket_number} numaralı destek talebinize yanıt verildi.`, JSON.stringify({ ticketId: req.params.id, ticketNumber: t.rows[0].ticket_number })]);
  pool.query(`SELECT email, preferred_lang FROM users WHERE id = $1`, [t.rows[0].user_id])
    .then(({ rows: u }) => u[0] && sendMail(u[0].email, ticketReplyMail(u[0].preferred_lang || mailLang(req), { ticketNumber: t.rows[0].ticket_number })))
    .catch(() => {});   // bildirim e-postası gönderilemezse yanıt yine kaydedilmiş olur
  await logAudit(req.user.sub, "ticket_reply", "ticket", req.params.id, { ticketNumber: t.rows[0].ticket_number, attachments: att.ids.length }, ip(req));
  res.status(201).json(rows[0]);
});
adminRouter.patch("/tickets/:id/close", requireAdmin, async (req, res) => {
  if (!req.body || req.body.confirmed !== true) return bad(res, "Destek talebini kapatmak için onay gerekir.", "confirm_required");
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const { rows } = await pool.query(
    `UPDATE tickets SET status = 'closed', closed_at = now(), closed_by = 'admin', updated_at = now() WHERE id = $1 AND status <> 'closed' RETURNING id, user_id, ticket_number`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı veya zaten kapatılmış." });
  await pool.query(`INSERT INTO notifications (user_id, type, text, data) VALUES ($1, 'ticket', $2, $3) RETURNING id`, [rows[0].user_id, `${rows[0].ticket_number} numaralı destek talebiniz sonuçlandırılarak kapatıldı.`, JSON.stringify({ ticketId: rows[0].id, ticketNumber: rows[0].ticket_number })]);
  await logAudit(req.user.sub, "ticket_close", "ticket", req.params.id, {}, ip(req));
  res.json({ ok: true });
});
