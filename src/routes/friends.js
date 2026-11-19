// Arkadaşlar ve özel mesajlar (üye paneli).
// Kurallar: istek herkese (engellenmemiş, yasaklı olmayan) gönderilebilir; mesaj YALNIZ kabul edilmiş arkadaşlar arasında ve iki tarafın da
// forumda mesajlaşma seviyesine (Pump Avcısı) ulaşmış olması gerekir (moderatör / yönetici / uzman hariç).
// Mesajlar şikâyet edilebilir; yönetici yalnız ŞİKÂYET EDİLEN mesajı ve bağlamını görür (taraflara görüldüğü bildirilmez).
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";
import { forumLevel, publicLevel, MESSAGING_LEVEL, LEVELS } from "../utils/forumLevels.js";
import { imageInfo } from "../utils/forumRules.js";
import { raw, sendAttachment } from "./uploads.js";

export const friendsRouter = withAsyncErrors(express.Router());
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const pair = (a, b) => (a < b ? [a, b] : [b, a]);
const clean = (v, max) => String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "").trim().slice(0, max);
export const DM_MAX = 2000, DM_IMAGE_MAX = 4 * 1024 * 1024;
const REPORT_REASONS = ["spam", "abuse", "obscene", "political", "scam", "other"];
// Engellenmiş / yasaklı (yönetici) hesaplar listelerde ve aramada görünmez.
const ACTIVE = `NOT (u.locked_at IS NOT NULL AND u.locked_reason LIKE 'admin\\_%' AND (u.locked_until IS NULL OR u.locked_until > now()))`;
// resmî forum hesabı (sistem hesabı) arkadaş eklenemez ve mesaj almaz
const NOT_SYSTEM = `coalesce(u.locked_reason, '') <> 'system_account'`;
const PUB = `u.id, u.username, u.role, (SELECT id FROM attachments WHERE user_id = u.id AND scope = 'avatar') AS avatar_id,
  f.level_override, f.forum_role, f.topics, f.posts, f.likes, f.dislikes, f.reports_upheld`;
function pub(r) { return { id: r.id, username: r.username, avatarId: r.avatar_id, level: publicLevel(forumLevel(r, r.role)) }; }
export function canMessage(r) { const l = forumLevel(r, r.role); return !!l.assigned || r.role === "coach" || l.n >= MESSAGING_LEVEL; }
async function profileOf(id) {
  const { rows } = await pool.query(`SELECT ${PUB} FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id WHERE u.id = $1 AND ${ACTIVE}`, [id]);
  return rows[0] || null;
}
async function relation(me, other) {
  const [a, b] = pair(me, other);
  const { rows } = await pool.query(`SELECT * FROM friendships WHERE user_a = $1 AND user_b = $2`, [a, b]);
  return rows[0] || null;
}
async function notify(userId, text, data) { await pool.query(`INSERT INTO notifications (user_id, type, text, data) VALUES ($1, 'friend', $2, $3)`, [userId, text, JSON.stringify(data || {})]).catch(() => {}); }

friendsRouter.get("/friends/summary", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { rows } = await pool.query(
    `SELECT (SELECT count(*) FROM dm_messages WHERE recipient_id = $1 AND read_at IS NULL AND NOT hidden_for_recipient AND NOT removed_by_mod)::int AS dm_unread,
            (SELECT count(*) FROM friendships WHERE (user_a = $1 OR user_b = $1) AND status = 'pending' AND requester <> $1)::int AS pending`, [req.user.sub]);
  res.json({ dmUnread: rows[0].dm_unread, pending: rows[0].pending });
});

friendsRouter.get("/friends", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const me = req.user.sub;
  const { rows } = await pool.query(
    `SELECT fr.status, fr.requester, fr.blocked_by, fr.updated_at, ${PUB},
            (SELECT max(created_at) FROM dm_messages d WHERE (d.sender_id = $1 AND d.recipient_id = u.id) OR (d.sender_id = u.id AND d.recipient_id = $1)) AS last_at,
            (SELECT count(*) FROM dm_messages d WHERE d.sender_id = u.id AND d.recipient_id = $1 AND d.read_at IS NULL AND NOT d.hidden_for_recipient AND NOT d.removed_by_mod)::int AS unread
       FROM friendships fr JOIN users u ON u.id = CASE WHEN fr.user_a = $1 THEN fr.user_b ELSE fr.user_a END
       LEFT JOIN forum_profiles f ON f.user_id = u.id
      WHERE (fr.user_a = $1 OR fr.user_b = $1) AND ${ACTIVE}
      ORDER BY last_at DESC NULLS LAST, fr.updated_at DESC LIMIT 500`, [me]);
  const meRow = await profileOf(me);
  const out = { friends: [], incoming: [], outgoing: [], blocked: [], canMessage: meRow ? canMessage(meRow) : false, messagingLevel: LEVELS[MESSAGING_LEVEL - 1].name };
  for (const r of rows) {
    const p = { ...pub(r), lastAt: r.last_at, unread: r.unread, canMessage: canMessage(r) };
    if (r.status === "accepted") out.friends.push(p);
    else if (r.status === "pending") (r.requester === me ? out.outgoing : out.incoming).push(p);
    else if (r.status === "blocked" && r.blocked_by === me) out.blocked.push(p);
  }
  res.json(out);
});

// Kullanıcı adına göre arama (en az 3 karakter, başlangıç eşleşmesi). Engelleyen / engellenen ve yasaklı hesaplar listelenmez.
friendsRouter.get("/friends/search", requireAuth, async (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase().replace(/^@/, "");
  if (!/^[a-z0-9._]{3,20}$/.test(q)) return res.json([]);
  if (!(await checkHourlyActionLimit(`fsearch:${req.user.sub}`, "friend_search", 300))) return res.status(429).json({ error: "Çok fazla arama yapıldı. Lütfen biraz sonra tekrar deneyin." });
  const { rows } = await pool.query(
    `SELECT ${PUB}, fr.status, fr.requester, fr.blocked_by FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id
       LEFT JOIN friendships fr ON fr.user_a = least(u.id, $1::uuid) AND fr.user_b = greatest(u.id, $1::uuid)
      WHERE u.id <> $1 AND u.username LIKE $2 || '%' AND u.email_verified_at IS NOT NULL AND ${ACTIVE} AND coalesce(fr.status, '') <> 'blocked'
      ORDER BY length(u.username), u.username LIMIT 10`, [req.user.sub, q.replace(/[%_\\]/g, (c) => "\\" + c)]);
  res.json(rows.map((r) => ({ ...pub(r), relation: !r.status ? "none" : r.status === "accepted" ? "friend" : r.requester === req.user.sub ? "outgoing" : "incoming" })));
});

friendsRouter.post("/friends/request", requireAuth, async (req, res) => {
  const me = req.user.sub, uname = String((req.body || {}).username || "").trim().toLowerCase().replace(/^@/, "");
  if (!(await checkHourlyActionLimit(`freq:${me}`, "friend_request", 30))) return res.status(429).json({ error: "Kısa sürede çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." });
  const t = await pool.query(`SELECT u.id FROM users u WHERE u.username = $1 AND u.email_verified_at IS NOT NULL AND ${ACTIVE} AND ${NOT_SYSTEM}`, [uname]);
  const other = t.rows[0] && t.rows[0].id;
  if (!other || other === me) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  const rel = await relation(me, other), [a, b] = pair(me, other);
  if (rel && rel.status === "blocked") return res.status(404).json({ error: "Kullanıcı bulunamadı." });   // engel bilgisi sızdırılmaz
  if (rel && rel.status === "accepted") return res.json({ status: "friend" });
  if (rel && rel.status === "pending") {
    if (rel.requester === me) return res.json({ status: "outgoing" });
    await pool.query(`UPDATE friendships SET status = 'accepted', updated_at = now() WHERE user_a = $1 AND user_b = $2`, [a, b]);
    await notify(other, "Arkadaşlık isteğiniz kabul edildi.", { from: me });
    return res.json({ status: "friend" });
  }
  await pool.query(`INSERT INTO friendships (user_a, user_b, requester, status) VALUES ($1, $2, $3, 'pending') ON CONFLICT DO NOTHING`, [a, b, me]);
  await notify(other, "Yeni bir arkadaşlık isteğiniz var.", { from: me });
  res.status(201).json({ status: "outgoing" });
});

async function pendingFor(me, other) {
  if (!ID_RE.test(other)) return null;
  const rel = await relation(me, other);
  return rel && rel.status === "pending" ? rel : null;
}
friendsRouter.post("/friends/:id/accept", requireAuth, async (req, res) => {
  const rel = await pendingFor(req.user.sub, req.params.id);
  if (!rel || rel.requester === req.user.sub) return res.status(404).json({ error: "İstek bulunamadı." });
  await pool.query(`UPDATE friendships SET status = 'accepted', updated_at = now() WHERE user_a = $1 AND user_b = $2`, [rel.user_a, rel.user_b]);
  await notify(req.params.id, "Arkadaşlık isteğiniz kabul edildi.", { from: req.user.sub });
  res.json({ ok: true });
});
// Reddet / iptal / arkadaşlıktan çıkar: satır silinir (karşı tarafa bildirim gitmez).
friendsRouter.delete("/friends/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Bulunamadı." });
  const [a, b] = pair(req.user.sub, req.params.id);
  await pool.query(`DELETE FROM friendships WHERE user_a = $1 AND user_b = $2 AND (status <> 'blocked' OR blocked_by = $3) RETURNING user_a`, [a, b, req.user.sub]);
  res.json({ ok: true });
});
friendsRouter.post("/friends/:id/block", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id) || req.params.id === req.user.sub) return res.status(404).json({ error: "Bulunamadı." });
  const u = await pool.query(`SELECT 1 FROM users WHERE id = $1`, [req.params.id]);
  if (!u.rows.length) return res.status(404).json({ error: "Bulunamadı." });
  const [a, b] = pair(req.user.sub, req.params.id);
  await pool.query(`INSERT INTO friendships (user_a, user_b, requester, status, blocked_by) VALUES ($1, $2, $3, 'blocked', $3)
    ON CONFLICT (user_a, user_b) DO UPDATE SET status = 'blocked', blocked_by = $3, updated_at = now()
    WHERE friendships.status <> 'blocked'`, [a, b, req.user.sub]);   // karşı tarafın koyduğu engel devralınamaz (sonra silinip kaldırılamasın)
  res.json({ ok: true });
});

// ---------------- mesajlar ----------------
async function chatGuard(req, res) {
  const me = req.user.sub, other = req.params.id;
  if (!ID_RE.test(other) || other === me) { res.status(404).json({ error: "Sohbet bulunamadı." }); return null; }
  const rel = await relation(me, other);
  if (!rel || rel.status !== "accepted") { res.status(403).json({ error: "Yalnız arkadaşlarınızla mesajlaşabilirsiniz.", code: "not_friends" }); return null; }
  const [mine, theirs] = await Promise.all([profileOf(me), profileOf(other)]);
  if (!mine || !theirs) { res.status(404).json({ error: "Sohbet bulunamadı." }); return null; }
  return { mine, theirs };
}
const MSG_COLS = `m.id, m.sender_id, m.body, m.created_at, m.read_at, m.removed_by_mod, m.attachment_id`;
friendsRouter.get("/messages/:id", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const g = await chatGuard(req, res); if (!g) return;
  const me = req.user.sub, other = req.params.id;
  const before = req.query.before && !Number.isNaN(Date.parse(req.query.before)) ? new Date(req.query.before) : null;
  const { rows } = await pool.query(
    `SELECT ${MSG_COLS} FROM dm_messages m
      WHERE ((m.sender_id = $1 AND m.recipient_id = $2 AND NOT m.hidden_for_sender) OR (m.sender_id = $2 AND m.recipient_id = $1 AND NOT m.hidden_for_recipient))
        AND ($3::timestamptz IS NULL OR m.created_at < $3) ORDER BY m.created_at DESC LIMIT 50`, [me, other, before]);
  await pool.query(`UPDATE dm_messages SET read_at = now() WHERE sender_id = $1 AND recipient_id = $2 AND read_at IS NULL RETURNING id`, [other, me]);
  res.json({ peer: { ...pub(g.theirs), canMessage: canMessage(g.theirs) }, canMessage: canMessage(g.mine) && canMessage(g.theirs), meCanMessage: canMessage(g.mine),
    messagingLevel: LEVELS[MESSAGING_LEVEL - 1].name,
    messages: rows.reverse().map((m) => ({ id: m.id, mine: m.sender_id === me, body: m.removed_by_mod ? "" : m.body, removed: m.removed_by_mod, imageId: m.removed_by_mod ? null : m.attachment_id, at: m.created_at, read: !!m.read_at })) });
});
async function sendGuard(req, res) {
  const g = await chatGuard(req, res); if (!g) return null;
  if (!canMessage(g.mine)) { res.status(403).json({ error: `Özel mesajlaşma ${LEVELS[MESSAGING_LEVEL - 1].name} seviyesinde açılır.`, code: "level" }); return null; }
  if (!canMessage(g.theirs)) { res.status(403).json({ error: "Bu kullanıcı henüz mesaj alabilecek seviyede değil.", code: "peer_level" }); return null; }
  if (!(await checkHourlyActionLimit(`dm:${req.user.sub}`, "dm_send", 300))) { res.status(429).json({ error: "Kısa sürede çok fazla mesaj gönderildi. Lütfen biraz bekleyin." }); return null; }
  return g;
}
friendsRouter.post("/messages/:id", requireAuth, async (req, res) => {
  const body = clean((req.body || {}).body, DM_MAX + 1);
  if (!body) return res.status(400).json({ error: "Mesaj boş olamaz." });
  if (body.length > DM_MAX) return res.status(400).json({ error: `Mesaj en fazla ${DM_MAX} karakter olabilir.` });
  const g = await sendGuard(req, res); if (!g) return;
  const { rows } = await pool.query(`INSERT INTO dm_messages (sender_id, recipient_id, body) VALUES ($1, $2, $3) RETURNING id, created_at`, [req.user.sub, req.params.id, body]);
  res.status(201).json({ id: rows[0].id, at: rows[0].created_at });
});
// Görsel mesaj: PNG / JPG / GIF, en fazla 4 MB ve 4096 piksel; tür dosya içeriğinden okunur.
friendsRouter.post("/messages/:id/image", requireAuth, async (req, res, next) => {
  if (Number(req.headers["content-length"] || 0) > DM_IMAGE_MAX) return res.status(400).json({ error: "Görsel en fazla 4 MB olabilir." });
  next();
}, raw, async (req, res) => {
  const buf = req.body, info = Buffer.isBuffer(buf) ? imageInfo(buf) : null;
  if (!info || !["image/png", "image/jpeg", "image/gif"].includes(info.mime)) return res.status(400).json({ error: "Yalnız PNG, JPG veya GIF gönderilebilir." });
  if (buf.length > DM_IMAGE_MAX) return res.status(400).json({ error: "Görsel en fazla 4 MB olabilir." });
  if (info.w > 4096 || info.h > 4096) return res.status(400).json({ error: "Görsel en fazla 4096×4096 piksel olabilir." });
  const g = await sendGuard(req, res); if (!g) return;
  const ext = info.mime === "image/png" ? "png" : info.mime === "image/gif" ? "gif" : "jpg";
  const a = await pool.query(`INSERT INTO attachments (user_id, scope, filename, mime, size_bytes, data) VALUES ($1, 'dm', $2, $3, $4, $5) RETURNING id`, [req.user.sub, `gorsel.${ext}`, info.mime, buf.length, buf]);
  const { rows } = await pool.query(`INSERT INTO dm_messages (sender_id, recipient_id, body, attachment_id) VALUES ($1, $2, '', $3) RETURNING id, created_at`, [req.user.sub, req.params.id, a.rows[0].id]);
  res.status(201).json({ id: rows[0].id, at: rows[0].created_at, imageId: a.rows[0].id });
});
// Mesaj görseli: yalnız gönderen ve alıcı (moderatörce kaldırılmadıysa); yönetici şikâyet incelemesinde ayrı yoldan görür.
friendsRouter.get("/dm-media/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Bulunamadı." });
  const { rows } = await pool.query(
    `SELECT a.filename, a.mime, a.data FROM attachments a JOIN dm_messages m ON m.attachment_id = a.id
      WHERE a.id = $1 AND a.scope = 'dm' AND NOT m.removed_by_mod AND (m.sender_id = $2 OR m.recipient_id = $2)`, [req.params.id, req.user.sub]);
  if (!rows[0]) return res.status(404).json({ error: "Bulunamadı." });
  sendAttachment(res, rows[0]);
});
// Mesajı kendinden sil (karşı tarafın kopyası kalır).
friendsRouter.delete("/messages/m/:mid", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.mid)) return res.status(404).json({ error: "Mesaj bulunamadı." });
  const { rows } = await pool.query(
    `UPDATE dm_messages SET hidden_for_sender = hidden_for_sender OR sender_id = $2, hidden_for_recipient = hidden_for_recipient OR recipient_id = $2
      WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2) RETURNING id`, [req.params.mid, req.user.sub]);
  if (!rows.length) return res.status(404).json({ error: "Mesaj bulunamadı." });
  res.json({ ok: true });
});
friendsRouter.post("/messages/m/:mid/report", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.mid)) return res.status(404).json({ error: "Mesaj bulunamadı." });
  const reason = String((req.body || {}).reason || ""), note = clean((req.body || {}).note, 300);
  if (!REPORT_REASONS.includes(reason)) return res.status(400).json({ error: "Şikâyet nedeni seçin." });
  if (!(await checkHourlyActionLimit(`dmrep:${req.user.sub}`, "dm_report", 30))) return res.status(429).json({ error: "Çok fazla şikâyet gönderildi. Lütfen daha sonra tekrar deneyin." });
  const m = await pool.query(`SELECT id FROM dm_messages WHERE id = $1 AND recipient_id = $2`, [req.params.mid, req.user.sub]);   // yalnız ALINAN mesaj şikâyet edilir
  if (!m.rows.length) return res.status(404).json({ error: "Mesaj bulunamadı." });
  await pool.query(`INSERT INTO dm_reports (message_id, reporter_id, reason, note) VALUES ($1, $2, $3, $4) ON CONFLICT (message_id, reporter_id) DO NOTHING`, [req.params.mid, req.user.sub, reason, note]);
  res.status(201).json({ ok: true });
});
