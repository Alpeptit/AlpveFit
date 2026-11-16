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
import { planPublishedMail } from "../utils/emailTemplates.js";
import { markOrderPaid } from "../services/orderFulfilment.js";
import { PROFILE_COLS } from "./profile.js";

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
           FROM users u WHERE u.role = 'user' ORDER BY u.created_at DESC LIMIT 500`
      : `SELECT u.id, u.full_name, u.user_code, u.email_verified_at IS NOT NULL AS verified, c.delivery,
                (SELECT coalesce(json_agg(kind ORDER BY kind), '[]') FROM member_access a WHERE a.member_id = u.id) AS access,
                (SELECT row_to_json(o) FROM (SELECT package_key, weeks, pharmacology, paid_at, plans_due_at FROM orders WHERE user_id = u.id AND status = 'paid' ORDER BY paid_at DESC LIMIT 1) o) AS package
           FROM coach_clients c JOIN users u ON u.id = c.member_id WHERE c.coach_id = $1 AND u.role = 'user' ORDER BY u.full_name LIMIT 500`,
    admin ? [] : [req.user.sub]
  );
  res.json(rows);
});

// ---------- planlar ----------
adminRouter.get("/clients/:id/plans", async (req, res) => {
  if (!ID_RE.test(req.params.id) || !(await canAccessMember(req, req.params.id))) return res.status(404).json({ error: "Üye bulunamadı." });
  const kinds = req.adminRole === "admin" ? PLAN_KINDS : req.panelKinds;
  const { rows } = await pool.query(
    `SELECT id, kind, title, body, starts_on, ends_on, status, author_name, published_by_name, published_at, created_at, updated_at
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
  const { rows } = await pool.query(
    `INSERT INTO plans (member_id, kind, title, body, starts_on, ends_on, author_id, author_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [memberId, kind, v.out.title, v.out.body, v.out.starts_on, v.out.ends_on, req.user.sub, req.panelName]
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
  if (!plan.body.trim()) return bad(res, "İçeriği boş plan yayınlanamaz.");
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
  const { coachId, memberId, delivery } = req.body || {};
  if (!ID_RE.test(String(coachId || "")) || !ID_RE.test(String(memberId || ""))) return bad(res, "Uzman ve üye gerekli.");
  if (!["online", "in_person", "hybrid"].includes(delivery)) return bad(res, "Koçluk biçimi: online, in_person veya hybrid.");
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

adminRouter.get("/audit", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT a.id, a.action, a.target_type, a.target_id, a.details, a.created_at, u.full_name AS actor_name
       FROM audit_log a LEFT JOIN users u ON u.id = a.actor_id ORDER BY a.created_at DESC, a.id DESC LIMIT 200`
  );
  res.json(rows);
});


// ---------- blog (yalnız yönetici) ----------
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
function blogFields(b, partial) {
  const out = {};
  const need = (k) => !partial || b[k] !== undefined;
  if (need("title")) { if (!isNonEmptyString(b.title) || cleanText(b.title).length < 3 || cleanText(b.title).length > 160) return { error: "Başlık 3–160 karakter olmalı." }; out.title = cleanText(b.title); }
  if (need("slug")) { const sl = String(b.slug || "").trim().toLowerCase(); if (!SLUG_RE.test(sl) || sl.length > 80) return { error: "Adres (slug) yalnız küçük harf, rakam ve tire içerebilir." }; out.slug = sl; }
  if (need("body")) { if (!isNonEmptyString(b.body) || cleanText(b.body).length > 40000) return { error: "İçerik boş olamaz (en çok 40.000 karakter)." }; out.body = cleanText(b.body); }
  if (b.excerpt !== undefined) { const ex = cleanText(b.excerpt); if (ex.length > 300) return { error: "Özet en çok 300 karakter olmalı." }; out.excerpt = ex; }
  if (b.status !== undefined) { if (b.status !== "draft" && b.status !== "published") return { error: "Geçersiz durum." }; out.status = b.status; }
  return { out };
}
adminRouter.get("/blog", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT id, slug, title, excerpt, body, status, author_name, published_at, updated_at FROM blog_posts ORDER BY updated_at DESC LIMIT 200`);
  res.json(rows);
});
adminRouter.post("/blog", requireAdmin, async (req, res) => {
  const { out, error } = blogFields(req.body || {}, false); if (error) return bad(res, error);
  const { rows: me } = await pool.query(`SELECT full_name FROM users WHERE id = $1`, [req.user.sub]);
  const { rows: dup } = await pool.query(`SELECT 1 FROM blog_posts WHERE slug = $1`, [out.slug]); if (dup.length) return bad(res, "Bu adres (slug) zaten kullanılıyor.");
  try {
    const { rows } = await pool.query(
      `INSERT INTO blog_posts (slug, title, excerpt, body, status, author_id, author_name, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, CASE WHEN $5 = 'published' THEN now() END) RETURNING id`,
      [out.slug, out.title, out.excerpt || "", out.body, out.status || "draft", req.user.sub, me[0]?.full_name || ""]);
    await logAudit(req.user.sub, "blog.create", "blog_post", rows[0].id, { slug: out.slug, status: out.status || "draft" }, ip(req));
    res.status(201).json({ id: rows[0].id });
  } catch (e) { if (e.code === "23505") return bad(res, "Bu adres (slug) zaten kullanılıyor."); throw e; }
});
adminRouter.put("/blog/:id", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Yazı bulunamadı." });
  const { out, error } = blogFields(req.body || {}, true); if (error) return bad(res, error);
  const keys = Object.keys(out); if (!keys.length) return bad(res, "Değişiklik yok.");
  const sets = keys.map((k, i) => `${k} = $${i + 2}`);
  if (out.status === "published") sets.push("published_at = COALESCE(published_at, now())");
  try {
    if (out.slug) { const { rows: dup } = await pool.query(`SELECT 1 FROM blog_posts WHERE slug = $1 AND id <> $2`, [out.slug, req.params.id]); if (dup.length) return bad(res, "Bu adres (slug) zaten kullanılıyor."); }
    const { rows: upd } = await pool.query(`UPDATE blog_posts SET ${sets.join(", ")}, updated_at = now() WHERE id = $1 RETURNING id`, [req.params.id, ...keys.map((k) => out[k])]);
    if (!upd.length) return res.status(404).json({ error: "Yazı bulunamadı." });
    await logAudit(req.user.sub, "blog.update", "blog_post", req.params.id, { fields: keys }, ip(req));
    res.json({ ok: true });
  } catch (e) { if (e.code === "23505") return bad(res, "Bu adres (slug) zaten kullanılıyor."); throw e; }
});
adminRouter.delete("/blog/:id", requireAdmin, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Yazı bulunamadı." });
  const { rows: del } = await pool.query(`DELETE FROM blog_posts WHERE id = $1 RETURNING id`, [req.params.id]);
  if (!del.length) return res.status(404).json({ error: "Yazı bulunamadı." });
  await logAudit(req.user.sub, "blog.delete", "blog_post", req.params.id, {}, ip(req));
  res.json({ ok: true });
});

// ---------- üye profili (üyenin kendi girdiği koçluk bilgileri) ----------
// Yalnız yönetici veya üyeye ATANMIŞ uzman görür. Rıza verilmemişse/boşsa null döner.
adminRouter.get("/clients/:id/profile", async (req, res) => {
  if (!ID_RE.test(req.params.id) || !(await canAccessMember(req, req.params.id))) return res.status(404).json({ error: "Üye bulunamadı." });
  const { rows } = await pool.query(`SELECT ${PROFILE_COLS} FROM member_profiles WHERE user_id = $1`, [req.params.id]);
  res.setHeader("Cache-Control", "no-store");
  res.json(rows[0] || null);
});

// ---------- siparişler (yalnız yönetici) ----------
adminRouter.get("/orders", requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT o.id, o.order_number, o.buyer_name, o.buyer_email, o.user_id, o.package_key, o.weeks, o.pharmacology, o.subtotal, o.currency, o.status,
            o.payment_provider, o.payment_ref, o.payment_attempts, o.paid_at, o.plans_due_at, o.created_at, o.payment_expires_at,
            (SELECT count(*)::int FROM plans p WHERE p.member_id = o.user_id AND p.status = 'published' AND p.published_at >= o.paid_at) AS plans_published
       FROM orders o ORDER BY o.created_at DESC LIMIT 200`);
  res.json(rows);
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
  res.json({ ok: true });
});
