// Gelişim Günlüğüm: kilo ve vücut ölçüleri, gelişim fotoğrafları, haftalık seri.
// Gizlilik: ölçüler varsayılan olarak YALNIZ üyenin kendisine görünür; üye isterse kilo ve bel ölçüsünü kendisine atanmış uzmanla
// (ve yöneticiyle) paylaşır — varsayılan kapalı, istediği an kapatır (erişim anında kesilir). Fotoğraflar ve notlar paylaşılmaz. Fotoğrafların görünürlüğünü üye seçer: yalnız ben (varsayılan),
// arkadaşlarım ya da forum üyeleri (kuralları onaylamış, uzaklaştırılmamış üyeler). Fotoğraflardan konum ve cihaz bilgisi silinir.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";
import { imageInfo } from "../utils/forumRules.js";
import { stripImageMetadata } from "../utils/imageClean.js";
import { raw, sendAttachment } from "./uploads.js";
import { logAudit } from "../utils/auditLog.js";

export const journalRouter = withAsyncErrors(express.Router());
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const PHOTO_MAX = 120;
const POSES = ["on", "yan", "arka", "diger"], VIS = ["private", "friends", "members"];
const MEASURES = { weight: ["weight_kg", 25, 350], waist: ["waist_cm", 30, 250], hip: ["hip_cm", 30, 250], chest: ["chest_cm", 30, 250], arm: ["arm_cm", 10, 90], thigh: ["thigh_cm", 20, 120] };
const LABEL = { weight: "Kilo", waist: "Bel", hip: "Kalça", chest: "Göğüs", arm: "Kol", thigh: "Uyluk" };

/** "YYYY-MM-DD": geçerli, 2000'den sonra ve gelecekte değil (Türkiye saatine göre bugün dahil). */
function dayOk(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || "")); if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;
  const today = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);
  return s >= "2000-01-01" && s <= today ? s : null;
}
/** Hafta anahtarı: o haftanın Pazartesi günü ("YYYY-MM-DD"). */
function weekKey(day) { const d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); }
/** Üst üste kayıt girilen hafta sayısı (bu hafta ya da geçen hafta kayıt yoksa seri 0). */
export function streakWeeks(days, today = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10)) {
  const set = new Set(days.map(weekKey));
  let d = new Date(today + "T00:00:00Z"), n = 0;
  if (!set.has(weekKey(today))) d.setUTCDate(d.getUTCDate() - 7);
  while (set.has(weekKey(d.toISOString().slice(0, 10)))) { n++; d.setUTCDate(d.getUTCDate() - 7); }
  return n;
}
function avg(list) { return list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : null; }

async function loadAll(userId) {
  const entries = (await pool.query(
    `SELECT id, to_char(logged_on, 'YYYY-MM-DD') AS date, weight_kg::float AS weight, waist_cm::float AS waist, hip_cm::float AS hip, chest_cm::float AS chest,
            arm_cm::float AS arm, thigh_cm::float AS thigh, coalesce(note, '') AS note
       FROM body_logs WHERE user_id = $1 ORDER BY logged_on DESC LIMIT 730`, [userId])).rows;
  const photos = (await pool.query(
    `SELECT id, to_char(taken_on, 'YYYY-MM-DD') AS date, pose, visibility FROM progress_photos WHERE user_id = $1 ORDER BY taken_on DESC, created_at DESC`, [userId])).rows;
  const today = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);
  const back = (n) => { const d = new Date(today + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
  const w = (from, to) => entries.filter((e) => e.weight != null && e.date > back(from) && e.date <= back(to)).map((e) => e.weight);
  const ws = entries.filter((e) => e.weight != null);
  const sh = (await pool.query(
    `SELECT u.journal_share_coach AS on, u.journal_shared_at AS since,
            (SELECT coalesce(json_agg(cu.full_name ORDER BY cu.full_name), '[]') FROM coach_clients c JOIN users cu ON cu.id = c.coach_id WHERE c.member_id = u.id) AS coaches
       FROM users u WHERE u.id = $1`, [userId])).rows[0] || {};
  const diary = (await pool.query(
    `SELECT t.id FROM forum_topics t JOIN forum_categories c ON c.id = t.category_id WHERE t.author_id = $1 AND c.slug = 'gelisim-gunlukleri' AND t.hidden_at IS NULL ORDER BY t.created_at DESC LIMIT 1`, [userId])).rows[0];
  return {
    entries, photos: photos.map((p) => ({ ...p, url: "/api/journal/photos/" + p.id })),
    stats: { streakWeeks: streakWeeks([...entries.map((e) => e.date), ...photos.map((p) => p.date)]), thisWeek: avg(w(7, 0)), lastWeek: avg(w(14, 7)),
      start: ws.length ? ws[ws.length - 1].weight : null, latest: ws.length ? ws[0].weight : null, count: entries.length },
    diaryTopicId: diary ? diary.id : null, photoMax: PHOTO_MAX, labels: LABEL,
    share: { coach: !!sh.on, since: sh.since || null, coaches: sh.coaches || [] },
  };
}

journalRouter.get("/journal", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json(await loadAll(req.user.sub));
});

// Aynı güne ikinci kayıt öncekinin üzerine yazılır (gönderilmeyen ölçü silinmez; boş gönderilen silinir).
journalRouter.put("/journal/entries", requireAuth, async (req, res) => {
  const b = req.body || {}, day = dayOk(b.date);
  if (!day) return res.status(400).json({ error: "Geçerli bir tarih seç (gelecek tarih olamaz).", field: "date" });
  if (!(await checkHourlyActionLimit(`journal:${req.user.sub}`, "journal_entry", 120))) return res.status(429).json({ error: "Kısa sürede çok fazla kayıt girildi. Biraz sonra tekrar dene." });
  const cols = [], vals = [req.user.sub, day];
  for (const [k, [col, min, max]] of Object.entries(MEASURES)) {
    if (b[k] === undefined) continue;
    if (b[k] === null || b[k] === "") { cols.push([col, null]); continue; }
    const v = Number(String(b[k]).replace(",", "."));
    if (!Number.isFinite(v) || v < min || v > max) return res.status(400).json({ error: `${LABEL[k]} ${min}–${max} arasında olmalı.`, field: k });
    cols.push([col, Math.round(v * 10) / 10]);
  }
  let note;
  if (b.note !== undefined) { note = String(b.note || "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, 280); cols.push(["note", note || null]); }
  if (!cols.length) return res.status(400).json({ error: "En az bir ölçü gir (kilo ya da çevre ölçüsü)." });
  const names = cols.map((c) => c[0]);
  cols.forEach((c) => vals.push(c[1]));
  const ins = names.map((n, i) => `$${i + 3}`).join(", ");
  try {
    await pool.query(`INSERT INTO body_logs (user_id, logged_on, ${names.join(", ")}) VALUES ($1, $2, ${ins})
      ON CONFLICT (user_id, logged_on) DO UPDATE SET ${names.map((n) => `${n} = EXCLUDED.${n}`).join(", ")}, updated_at = now()`, vals);
  } catch (e) {
    if (e && e.code === "23514") return res.status(400).json({ error: "Kayıtta en az bir ölçü kalmalı. Günü tamamen silmek için kaydı sil." });
    throw e;
  }
  res.json(await loadAll(req.user.sub));
});

journalRouter.delete("/journal/entries/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Kayıt bulunamadı." });
  await pool.query(`DELETE FROM body_logs WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
  res.json(await loadAll(req.user.sub));
});

// Kilo ve bel ölçüsünü uzmanla paylaşma izni (yalnız üyenin kendisi değiştirir; denetim kaydına yazılır).
journalRouter.put("/journal/share", requireAuth, async (req, res) => {
  const on = (req.body || {}).coach;
  if (typeof on !== "boolean") return res.status(400).json({ error: "Geçersiz seçim." });
  const r = await pool.query(
    `UPDATE users SET journal_share_coach = $2, journal_shared_at = CASE WHEN $2 THEN coalesce(CASE WHEN journal_share_coach THEN journal_shared_at END, now()) ELSE NULL END
      WHERE id = $1 RETURNING id`, [req.user.sub, on]);
  if (!r.rows.length) return res.status(404).json({ error: "Hesap bulunamadı." });
  await logAudit(req.user.sub, on ? "journal_share_on" : "journal_share_off", "user", req.user.sub, {}, String(req.ip || "").slice(0, 64));
  res.json(await loadAll(req.user.sub));
});

/** Uzman görünümü: üye izin verdiyse son 365 günün kilo ve bel ölçüleri (fotoğraf ve not yok). İzin yoksa veri dönmez. */
export async function sharedTrend(memberId) {
  const u = (await pool.query(`SELECT journal_share_coach, journal_shared_at FROM users WHERE id = $1`, [memberId])).rows[0];
  if (!u || !u.journal_share_coach) return { shared: false };
  const entries = (await pool.query(
    `SELECT to_char(logged_on, 'YYYY-MM-DD') AS date, weight_kg::float AS weight, waist_cm::float AS waist
       FROM body_logs WHERE user_id = $1 AND logged_on >= (now() AT TIME ZONE 'Europe/Istanbul')::date - 365 AND (weight_kg IS NOT NULL OR waist_cm IS NOT NULL)
      ORDER BY logged_on ASC LIMIT 400`, [memberId])).rows;
  return { shared: true, since: u.journal_shared_at, entries };
}

// Fotoğraf: PNG / JPG, en fazla 4 MB, en az 240 piksel; konum ve cihaz bilgisi silinerek saklanır.
journalRouter.post("/journal/photos", requireAuth, raw, async (req, res) => {
  const q = req.query || {}, day = dayOk(q.date), pose = POSES.includes(q.pose) ? q.pose : "on", vis = VIS.includes(q.visibility) ? q.visibility : "private";
  if (!day) return res.status(400).json({ error: "Geçerli bir tarih seç.", field: "date" });
  if (vis !== "private" && !(await hasConsent(req.user.sub))) return res.status(403).json(CONSENT_ERR);
  if (!(await checkHourlyActionLimit(`jphoto:${req.user.sub}`, "journal_photo", 30))) return res.status(429).json({ error: "Kısa sürede çok fazla fotoğraf yüklendi. Biraz sonra tekrar dene." });
  const n = (await pool.query(`SELECT count(*)::int AS n FROM progress_photos WHERE user_id = $1`, [req.user.sub])).rows[0].n;
  if (n >= PHOTO_MAX) return res.status(400).json({ error: `En fazla ${PHOTO_MAX} gelişim fotoğrafı saklanabilir. Yenisini eklemek için eskilerden birini sil.` });
  const buf = req.body, info = Buffer.isBuffer(buf) ? imageInfo(buf) : null;
  if (!info || !["image/png", "image/jpeg"].includes(info.mime)) return res.status(400).json({ error: "Yalnız PNG ya da JPG fotoğraf yüklenebilir." });
  if (Math.min(info.w, info.h) < 240) return res.status(400).json({ error: "Fotoğraf en az 240 piksel olmalı." });
  const data = stripImageMetadata(buf, info.mime);
  const a = (await pool.query(`INSERT INTO attachments (user_id, scope, filename, mime, size_bytes, data) VALUES ($1, 'progress', $2, $3, $4, $5) RETURNING id`,
    [req.user.sub, "gelisim." + (info.mime === "image/png" ? "png" : "jpg"), info.mime, data.length, data])).rows[0];
  await pool.query(`INSERT INTO progress_photos (user_id, attachment_id, taken_on, pose, visibility) VALUES ($1, $2, $3, $4, $5)`, [req.user.sub, a.id, day, pose, vis]);
  res.status(201).json(await loadAll(req.user.sub));
});

journalRouter.patch("/journal/photos/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Fotoğraf bulunamadı." });
  const b = req.body || {}, sets = [], vals = [req.params.id, req.user.sub];
  if (b.visibility !== undefined) { if (!VIS.includes(b.visibility)) return res.status(400).json({ error: "Geçersiz görünürlük." }); if (b.visibility !== "private" && !(await hasConsent(req.user.sub))) return res.status(403).json(CONSENT_ERR); vals.push(b.visibility); sets.push(`visibility = $${vals.length}`); }
  if (b.pose !== undefined) { if (!POSES.includes(b.pose)) return res.status(400).json({ error: "Geçersiz poz." }); vals.push(b.pose); sets.push(`pose = $${vals.length}`); }
  if (b.date !== undefined) { const d = dayOk(b.date); if (!d) return res.status(400).json({ error: "Geçerli bir tarih seç." }); vals.push(d); sets.push(`taken_on = $${vals.length}`); }
  if (!sets.length) return res.status(400).json({ error: "Değişiklik yok." });
  const r = await pool.query(`UPDATE progress_photos SET ${sets.join(", ")} WHERE id = $1 AND user_id = $2 RETURNING id`, vals);
  if (!r.rows.length) return res.status(404).json({ error: "Fotoğraf bulunamadı." });
  res.json(await loadAll(req.user.sub));
});

journalRouter.delete("/journal/photos/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Fotoğraf bulunamadı." });
  const r = await pool.query(`DELETE FROM progress_photos WHERE id = $1 AND user_id = $2 RETURNING attachment_id`, [req.params.id, req.user.sub]);
  if (r.rows.length) await pool.query(`DELETE FROM attachments WHERE id = $1 AND user_id = $2 AND scope = 'progress'`, [r.rows[0].attachment_id, req.user.sub]);
  res.json(await loadAll(req.user.sub));
});

/** Fotoğrafı başkalarına açmak (arkadaşlarım / forum üyeleri) KVKK açık rızası gerektirir. */
async function hasConsent(userId) { return !!(await pool.query(`SELECT 1 FROM forum_profiles WHERE user_id = $1 AND health_consent_at IS NOT NULL`, [userId])).rows.length; }
const CONSENT_ERR = { error: "Fotoğrafı başkalarıyla paylaşmak için sağlık verilerinin işlenmesine açık rıza vermen gerekiyor (Forum Ayarları → Bildirim ve Gizlilik).", code: "consent" };

/** Bakan kişi bu fotoğrafı görebilir mi? Sahibi her zaman; "members": forum üyesi (kuralları onaylamış, uzaklaştırılmamış); "friends": kabul edilmiş arkadaş. */
async function canSee(viewerId, ownerId, visibility) {
  if (viewerId === ownerId) return true;
  if (visibility === "private") return false;
  if (!(await hasConsent(ownerId))) return false;   // sahibi rızasını geri çektiyse fotoğraf yalnız kendisine görünür
  const me = (await pool.query(`SELECT rules_accepted_at, banned_until, ban_permanent FROM forum_profiles WHERE user_id = $1`, [viewerId])).rows[0];
  if (!me || !me.rules_accepted_at || me.ban_permanent || (me.banned_until && new Date(me.banned_until) > new Date())) return false;
  if (visibility === "members") return true;
  return (await pool.query(`SELECT 1 FROM friendships WHERE ((user_a = $1 AND user_b = $2) OR (user_a = $2 AND user_b = $1)) AND status = 'accepted'`, [viewerId, ownerId])).rows.length > 0;
}

journalRouter.get("/journal/photos/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Fotoğraf bulunamadı." });
  const p = (await pool.query(`SELECT p.user_id, p.visibility, a.mime, a.data, a.filename FROM progress_photos p JOIN attachments a ON a.id = p.attachment_id WHERE p.id = $1`, [req.params.id])).rows[0];
  if (!p || !(await canSee(req.user.sub, p.user_id, p.visibility))) return res.status(404).json({ error: "Fotoğraf bulunamadı." });
  sendAttachment(res, p, "private, max-age=600");
});

// Forum profilinde: üyenin seri sayısı ve bakan kişinin görmesine izin verilen gelişim fotoğrafları (ölçüler gösterilmez).
journalRouter.get("/journal/u/:username", requireAuth, async (req, res) => {
  const u = (await pool.query(`SELECT u.id FROM users u WHERE u.username = $1 AND NOT (u.locked_at IS NOT NULL AND u.locked_reason LIKE 'admin\\_%' AND (u.locked_until IS NULL OR u.locked_until > now()))`, [String(req.params.username || "").toLowerCase().slice(0, 20)])).rows[0];
  if (!u) return res.status(404).json({ error: "Üye bulunamadı." });
  const days = (await pool.query(`SELECT to_char(logged_on, 'YYYY-MM-DD') AS d FROM body_logs WHERE user_id = $1 UNION SELECT to_char(taken_on, 'YYYY-MM-DD') FROM progress_photos WHERE user_id = $1`, [u.id])).rows.map((r) => r.d);
  const all = (await pool.query(`SELECT id, to_char(taken_on, 'YYYY-MM-DD') AS date, pose, visibility FROM progress_photos WHERE user_id = $1 ORDER BY taken_on DESC, created_at DESC LIMIT 60`, [u.id])).rows;
  const photos = [];
  for (const p of all) if (await canSee(req.user.sub, u.id, p.visibility)) photos.push({ id: p.id, date: p.date, pose: p.pose, url: "/api/journal/photos/" + p.id });
  res.json({ streakWeeks: streakWeeks(days), photos });
});
