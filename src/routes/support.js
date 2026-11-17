// Destek: canlı destek (ziyaretçi tarafı), çevrimdışı mesaj ve destek talebi (ticket — yalnız üye).
// Canlı destek: üye oturum çereziyle (CSRF denetimli) bağlanır; misafir ad + e-posta ile başlatır ve sonraki isteklerde
// X-Chat-Token başlığıyla doğrulanır (çerez değil → CSRF'ye kapalı; ayrıca Origin/Referer denetlenir).
// Misafir anahtarı yalnız bir kez döner; veritabanında SHA-256 özeti tutulur. Yanıtları yalnız yönetici verir (/api/admin/*).
import express from "express";
import crypto from "node:crypto";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { isRequestOriginAllowed } from "../utils/originCheck.js";
import { sanitizeText } from "../utils/sanitize.js";
import { messageError } from "../utils/validate.js";
import { guestNameError, guestEmailError, chatMessageError, newGuestToken, hashToken, canAccessChat, CHAT_NOT_FOUND, CHAT_CLOSED } from "../utils/liveChatRules.js";
import { computeSupportStatus, SUPPORT_OFFLINE } from "../utils/supportStatus.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";

export const supportRouter = withAsyncErrors(express.Router());
export const GUEST_CHATS_PER_HOUR = 6;
export const TICKETS_PER_HOUR = 5;
export const TICKET_SUBJECTS = ["Paketler ve ödeme", "Programım", "Hesap ve güvenlik", "Teknik sorun", "Diğer"];
export const AGENT_NAME = "AlpveFit Destek";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Misafir istekleri çerez taşımaz; yine de yalnız sitenin kendi sayfasından gelenler kabul edilir: Origin veya Referer ZORUNLU ve eşleşmeli
// (tarayıcılar POST isteklerinde Origin gönderir; başlıksız istek reddedilir).
const originOk = (req) => !!(req.headers.origin || req.headers.referer) && isRequestOriginAllowed({ origin: req.headers.origin, referer: req.headers.referer, frontendUrl: process.env.FRONTEND_URL });
const ipHash = (req) => hashToken("ip:" + (req.ip || ""));

/** Destek talebi başlığı: 3–144 karakter, denetim karakteri yok. Geçerliyse null. */
export function ticketTitleError(title) {
  const t = typeof title === "string" ? title.trim() : "";
  if (t.length < 3) return "Lütfen en az 3 karakterlik bir başlık girin.";
  if (t.length > 144) return "Başlık en fazla 144 karakter olabilir.";
  if (/[\u0000-\u001F\u007F]/.test(t)) return "Başlık geçersiz karakter içeriyor.";
  return null;
}

async function supportStatusNow() {
  const { rows } = await pool.query(`SELECT mode, open_hour, close_hour FROM support_status WHERE id = 1`);
  return computeSupportStatus(rows[0] || null);
}
async function loadAuthorizedChat(req) {
  if (!UUID_RE.test(req.params.id || "")) return null;
  const { rows } = await pool.query(`SELECT id, user_id, is_member, guest_token_hash, status FROM live_chats WHERE id = $1`, [req.params.id]);
  const chat = rows[0];
  return canAccessChat(chat, { userId: req.user ? req.user.sub : null, guestToken: req.headers["x-chat-token"] }) ? chat : null;
}

// ---------- canlı destek ----------
supportRouter.get("/live-chat/status", async (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(await supportStatusNow());
});

supportRouter.post("/live-chat/offline-message", optionalAuth, async (req, res) => {
  if (!req.user && !originOk(req)) return res.status(403).json({ error: "Güvenlik doğrulaması başarısız oldu." });
  const body = req.body || {};
  const me = chatMessageError(body.message);
  if (me) return res.status(me.status).json({ error: me.error });
  let name, email, userId = null;
  if (req.user) {
    const u = await pool.query(`SELECT full_name, email FROM users WHERE id = $1`, [req.user.sub]);
    if (!u.rows[0]) return res.status(401).json({ error: "Oturum geçersiz veya süresi dolmuş.", sessionExpired: true });
    name = String(u.rows[0].full_name || "Üye").slice(0, 60); email = u.rows[0].email; userId = req.user.sub;
  } else {
    const e = guestNameError(body.name) || guestEmailError(body.email);
    if (e) return res.status(e.status).json({ error: e.error });
    name = sanitizeText(body.name.trim().replace(/\s+/g, " ")); email = body.email.trim().toLowerCase();
  }
  const ih = ipHash(req);
  const recent = await pool.query(
    `SELECT count(*)::int AS n FROM support_offline_messages WHERE (email = $1 OR ip_hash = $2) AND created_at > now() - interval '1 hour'`, [email, ih]);
  if (recent.rows[0].n >= 3) return res.status(429).json({ error: "Kısa süre içinde çok fazla mesaj gönderdiniz. Lütfen daha sonra tekrar deneyin." });
  const { rows } = await pool.query(
    `INSERT INTO support_offline_messages (user_id, name, email, body, ip_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
    [userId, name.length >= 2 ? name : "Üye", email, sanitizeText(body.message.trim()), ih]);
  res.status(201).json({ id: rows[0].id, message: "Mesajınız alındı. En kısa sürede e-posta ile size dönüş yapılacak." });
});

// Görüşme başlat: üyenin açık görüşmesi varsa o döner (üye başına tek açık görüşme). Çevrimdışıyken yeni görüşme açılmaz.
supportRouter.post("/live-chat/start", optionalAuth, async (req, res) => {
  if (req.user) {
    const found = await pool.query(`SELECT id FROM live_chats WHERE user_id = $1 AND status = 'open'`, [req.user.sub]);
    if (found.rows[0]) return res.json({ chatId: found.rows[0].id, member: true });
    if (!(await supportStatusNow()).online) return res.status(409).json({ error: SUPPORT_OFFLINE, code: "SUPPORT_OFFLINE" });
    const ins = await pool.query(`INSERT INTO live_chats (user_id, is_member) VALUES ($1, true) ON CONFLICT DO NOTHING RETURNING id`, [req.user.sub]);
    const id = ins.rows[0] ? ins.rows[0].id : (await pool.query(`SELECT id FROM live_chats WHERE user_id = $1 AND status = 'open'`, [req.user.sub])).rows[0].id;
    return res.status(201).json({ chatId: id, member: true });
  }
  if (!originOk(req)) return res.status(403).json({ error: "Güvenlik doğrulaması başarısız oldu." });
  if (!(await supportStatusNow()).online) return res.status(409).json({ error: SUPPORT_OFFLINE, code: "SUPPORT_OFFLINE" });
  const { name, email } = req.body || {};
  const e = guestNameError(name) || guestEmailError(email);
  if (e) return res.status(e.status).json({ error: e.error });
  if (!(await checkHourlyActionLimit(`guest-chat:${ipHash(req)}`, "guest_chat_start", GUEST_CHATS_PER_HOUR))) {
    return res.status(429).json({ error: "Kısa sürede çok fazla görüşme başlatıldı. Lütfen biraz sonra tekrar deneyin veya üye girişi yapın." });
  }
  const token = newGuestToken();
  const { rows } = await pool.query(
    `INSERT INTO live_chats (is_member, guest_name, guest_email, guest_token_hash) VALUES (false, $1, $2, $3) RETURNING id`,
    [sanitizeText(name.trim().replace(/\s+/g, " ")), email.trim().toLowerCase(), hashToken(token)]);
  res.status(201).json({ chatId: rows[0].id, member: false, guestToken: token });
});

supportRouter.get("/live-chat/:id/messages", optionalAuth, async (req, res) => {
  const chat = await loadAuthorizedChat(req);
  if (!chat) return res.status(404).json({ error: CHAT_NOT_FOUND });
  const { rows } = await pool.query(
    `SELECT id, sender, CASE WHEN sender = 'admin' THEN COALESCE(agent_name, $2) END AS agent_name, body, created_at
       FROM live_chat_messages WHERE chat_id = $1 ORDER BY created_at ASC, id ASC LIMIT 300`, [chat.id, AGENT_NAME]);
  await pool.query(`UPDATE live_chat_messages SET read_at = now() WHERE chat_id = $1 AND sender = 'admin' AND read_at IS NULL RETURNING id`, [chat.id]);
  res.json({ status: chat.status, messages: rows });
});

supportRouter.post("/live-chat/:id/messages", optionalAuth, async (req, res) => {
  if (!req.user && !originOk(req)) return res.status(403).json({ error: "Güvenlik doğrulaması başarısız oldu." });
  const chat = await loadAuthorizedChat(req);
  if (!chat) return res.status(404).json({ error: CHAT_NOT_FOUND });
  if (chat.status !== "open") return res.status(409).json({ error: CHAT_CLOSED });
  const me = chatMessageError(req.body && req.body.message);
  if (me) return res.status(me.status).json({ error: me.error });
  const { rows } = await pool.query(
    `INSERT INTO live_chat_messages (chat_id, sender, body) VALUES ($1, 'visitor', $2) RETURNING id, sender, body, created_at`,
    [chat.id, sanitizeText(req.body.message.trim())]);
  await pool.query(`UPDATE live_chats SET last_message_at = now() WHERE id = $1 RETURNING id`, [chat.id]);
  res.status(201).json(rows[0]);
});

// ---------- destek talebi (ticket) — yalnız üye ----------
const TICKET_COLS = `id, ticket_number, title, subject, status, closed_at, closed_by, created_at, updated_at`;
supportRouter.get("/tickets/subjects", (req, res) => res.json(TICKET_SUBJECTS));

supportRouter.get("/tickets", requireAuth, async (req, res) => {
  const { rows } = await pool.query(`SELECT ${TICKET_COLS} FROM tickets WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 100`, [req.user.sub]);
  res.json(rows);
});

supportRouter.get("/tickets/:id", requireAuth, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const t = await pool.query(`SELECT ${TICKET_COLS} FROM tickets WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
  if (!t.rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const m = await pool.query(`SELECT id, from_role, body, created_at FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC, id ASC`, [req.params.id]);
  res.json({ ...t.rows[0], messages: m.rows });
});

supportRouter.post("/tickets", requireAuth, async (req, res) => {
  const { title, subject, message } = req.body || {};
  const te = ticketTitleError(title);
  if (te) return res.status(400).json({ error: te });
  if (!TICKET_SUBJECTS.includes(subject)) return res.status(400).json({ error: "Lütfen listeden bir konu seçin." });
  const me = messageError(message, "Mesaj zorunludur.");
  if (me) return res.status(400).json({ error: me });
  if (!(await checkHourlyActionLimit(`ticket:${req.user.sub}`, "ticket_create", TICKETS_PER_HOUR))) {
    return res.status(429).json({ error: "Kısa sürede çok fazla destek talebi oluşturdunuz. Lütfen biraz sonra tekrar deneyin." });
  }
  let ticket = null;
  for (let attempt = 0; attempt < 5 && !ticket; attempt++) {
    const num = "T-" + crypto.randomInt(100000, 1000000);
    const dup = await pool.query(`SELECT 1 FROM tickets WHERE ticket_number = $1`, [num]);
    if (dup.rows.length) continue;
    const { rows } = await pool.query(
      `INSERT INTO tickets (ticket_number, user_id, title, subject) VALUES ($1, $2, $3, $4) RETURNING ${TICKET_COLS}`,
      [num, req.user.sub, sanitizeText(title.trim()), subject]);
    ticket = rows[0];
  }
  if (!ticket) return res.status(500).json({ error: "Destek talebi oluşturulamadı, lütfen tekrar deneyin." });
  await pool.query(`INSERT INTO ticket_messages (ticket_id, from_role, body) VALUES ($1, 'user', $2) RETURNING id`, [ticket.id, sanitizeText(message.trim())]);
  res.status(201).json(ticket);
});

supportRouter.post("/tickets/:id/messages", requireAuth, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const me = messageError(req.body && req.body.message, "Mesaj boş olamaz.");
  if (me) return res.status(400).json({ error: me });
  const t = await pool.query(`SELECT id, status FROM tickets WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
  if (!t.rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  if (t.rows[0].status === "closed") return res.status(409).json({ error: "Bu destek talebi kapatılmış; yeni mesaj eklenemez. Gerekirse yeni bir talep oluşturabilirsiniz." });
  const last = await pool.query(
    `SELECT 1 FROM ticket_messages WHERE ticket_id = $1 AND from_role = 'user' AND created_at > now() - interval '5 seconds'`, [req.params.id]);
  if (last.rows.length) { res.set("Retry-After", "5"); return res.status(429).json({ error: "Lütfen yeni mesaj göndermeden önce birkaç saniye bekleyin." }); }
  const { rows } = await pool.query(
    `INSERT INTO ticket_messages (ticket_id, from_role, body) VALUES ($1, 'user', $2) RETURNING id, from_role, body, created_at`, [req.params.id, sanitizeText(req.body.message.trim())]);
  await pool.query(`UPDATE tickets SET status = 'open', updated_at = now() WHERE id = $1 RETURNING id`, [req.params.id]);
  res.status(201).json(rows[0]);
});

supportRouter.post("/tickets/:id/resolve", requireAuth, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const { rows } = await pool.query(
    `UPDATE tickets SET status = 'closed', closed_at = COALESCE(closed_at, now()), closed_by = COALESCE(closed_by, 'user'), updated_at = now()
      WHERE id = $1 AND user_id = $2 RETURNING ${TICKET_COLS}`, [req.params.id, req.user.sub]);
  if (!rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  res.json(rows[0]);
});
