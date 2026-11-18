// Destek talebi (ticket) — yalnız üye. Yanıtları yalnız yönetici verir (/api/admin/*).
import express from "express";
import crypto from "node:crypto";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { sanitizeText } from "../utils/sanitize.js";
import { messageError } from "../utils/validate.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";
import { checkTicketAttachments, linkAttachments, withAttachments } from "./uploads.js";

export const supportRouter = withAsyncErrors(express.Router());
export const TICKETS_PER_HOUR = 5;
export const TICKET_SUBJECTS = ["Hesap ve Güvenlik Ayarları", "Teknik Sorunlar", "Ödeme Sorunları", "Plan ve Programım", "Revizasyon Ayı", "Diğer"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Destek talebi başlığı: 3–244 karakter, denetim karakteri yok. Geçerliyse null. */
export function ticketTitleError(title) {
  const t = typeof title === "string" ? title.trim() : "";
  if (t.length < 3) return "Lütfen en az 3 karakterlik bir başlık girin.";
  if (t.length > 244) return "Başlık en fazla 244 karakter olabilir.";
  if (/[\u0000-\u001F\u007F]/.test(t)) return "Başlık geçersiz karakter içeriyor.";
  return null;
}

// ---------- destek talebi (ticket) — yalnız üye ----------
const TICKET_COLS = `id, ticket_number, title, subject, plan_kind, status, closed_at, closed_by, created_at, updated_at`;
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
  res.json({ ...t.rows[0], messages: await withAttachments(m.rows) });
});

supportRouter.post("/tickets", requireAuth, async (req, res) => {
  const { title, subject, message } = req.body || {};
  const te = ticketTitleError(title);
  if (te) return res.status(400).json({ error: te });
  if (!TICKET_SUBJECTS.includes(subject)) return res.status(400).json({ error: "Lütfen listeden bir konu seçin." });
  // "Plan ve Programım" konusunda hangi plan bölümüyle ilgili olduğu seçilir (yalnız üyenin erişimi olan bölümler).
  let planKind = null;
  if (subject === "Plan ve Programım") {
    planKind = String(req.body.planKind || "");
    const acc = await pool.query(`SELECT 1 FROM member_access WHERE member_id = $1 AND kind = $2`, [req.user.sub, planKind]);
    if (!acc.rows.length) return res.status(400).json({ error: "Talebinizin ilgili olduğu planı seçin.", field: "planKind" });
  }
  const me = messageError(message, "Mesaj zorunludur.");
  if (me) return res.status(400).json({ error: me });
  const att = await checkTicketAttachments(req.user.sub, req.body.attachments);
  if (att.error) return res.status(400).json({ error: att.error });
  if (!(await checkHourlyActionLimit(`ticket:${req.user.sub}`, "ticket_create", TICKETS_PER_HOUR))) {
    return res.status(429).json({ error: "Kısa sürede çok fazla destek talebi oluşturdunuz. Lütfen biraz sonra tekrar deneyin." });
  }
  let ticket = null;
  for (let attempt = 0; attempt < 5 && !ticket; attempt++) {
    const num = "T-" + crypto.randomInt(100000, 1000000);
    const dup = await pool.query(`SELECT 1 FROM tickets WHERE ticket_number = $1`, [num]);
    if (dup.rows.length) continue;
    const { rows } = await pool.query(
      `INSERT INTO tickets (ticket_number, user_id, title, subject, plan_kind) VALUES ($1, $2, $3, $4, $5) RETURNING ${TICKET_COLS}`,
      [num, req.user.sub, sanitizeText(title.trim()), subject, planKind]);
    ticket = rows[0];
  }
  if (!ticket) return res.status(500).json({ error: "Destek talebi oluşturulamadı, lütfen tekrar deneyin." });
  const first = await pool.query(`INSERT INTO ticket_messages (ticket_id, from_role, body) VALUES ($1, 'user', $2) RETURNING id`, [ticket.id, sanitizeText(message.trim())]);
  await linkAttachments(pool, req.user.sub, first.rows[0].id, att.ids);
  res.status(201).json(ticket);
});

supportRouter.post("/tickets/:id/messages", requireAuth, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const me = messageError(req.body && req.body.message, "Mesaj boş olamaz.");
  if (me) return res.status(400).json({ error: me });
  const t = await pool.query(`SELECT id, status FROM tickets WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
  if (!t.rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  if (t.rows[0].status === "closed") return res.status(409).json({ error: "Bu destek talebi kapatılmış; yeni mesaj eklenemez. Gerekirse yeni bir talep oluşturabilirsiniz." });
  const att = await checkTicketAttachments(req.user.sub, req.body.attachments);
  if (att.error) return res.status(400).json({ error: att.error });
  const last = await pool.query(
    `SELECT 1 FROM ticket_messages WHERE ticket_id = $1 AND from_role = 'user' AND created_at > now() - interval '5 seconds'`, [req.params.id]);
  if (last.rows.length) { res.set("Retry-After", "5"); return res.status(429).json({ error: "Lütfen yeni mesaj göndermeden önce birkaç saniye bekleyin." }); }
  const { rows } = await pool.query(
    `INSERT INTO ticket_messages (ticket_id, from_role, body) VALUES ($1, 'user', $2) RETURNING id, from_role, body, created_at`, [req.params.id, sanitizeText(req.body.message.trim())]);
  await linkAttachments(pool, req.user.sub, rows[0].id, att.ids);
  await pool.query(`UPDATE tickets SET status = 'open', updated_at = now() WHERE id = $1 RETURNING id`, [req.params.id]);
  res.status(201).json((await withAttachments(rows))[0]);
});

supportRouter.post("/tickets/:id/resolve", requireAuth, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  const { rows } = await pool.query(
    `UPDATE tickets SET status = 'closed', closed_at = COALESCE(closed_at, now()), closed_by = COALESCE(closed_by, 'user'), updated_at = now()
      WHERE id = $1 AND user_id = $2 RETURNING ${TICKET_COLS}`, [req.params.id, req.user.sub]);
  if (!rows[0]) return res.status(404).json({ error: "Destek talebi bulunamadı." });
  res.json(rows[0]);
});
