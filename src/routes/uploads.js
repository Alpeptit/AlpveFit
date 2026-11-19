// Dosya ekleri — destek talepleri ve kişisel bilgiler (sağlık/sakatlık) için. Kurallar Alpeptit ile aynı (bkz. utils/uploadTypes.js).
//   • Yalnız giriş yapmış üye yükler (requireAuth: oturum + CSRF). Her istek TEK dosya taşır; gövde ham ikili veridir (en fazla 4 MB).
//   • Tür iki katmanda doğrulanır: beyan edilen tür/uzantı + dosyanın gerçek imzası.
//   • Üye başına saatlik yükleme sınırı vardır; kişisel bilgilerde toplam en fazla 4 dosya, bir destek mesajında en fazla 4 dosya.
//   • Kişisel bilgilere (sağlık verisi) dosya eklemek için açık rıza önceden alınmış olmalıdır.
//   • Dosyalar yalnız sahibine (ve /api/admin altında yetkili panel kullanıcısına) sunulur; tarayıcıda çalıştırılamaz biçimde
//     (nosniff, sandbox CSP, görsel dışı türler indirme olarak) gönderilir.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";
import { UPLOAD_MAX_BYTES, ATTACH_MAX, COUNT_ERROR, SIZE_ERROR, TYPE_ERROR, TYPES_TEXT, TICKET_TYPES_TEXT, declaredTypeError, contentTypeError, cleanFilename, kindOf } from "../utils/uploadTypes.js";

export const uploadsRouter = withAsyncErrors(express.Router());
export const UPLOADS_PER_HOUR = 30;
export const PENDING_MAX = 8;   // henüz bir mesaja bağlanmamış (bekleyen) ticket eki sınırı
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const FILE_COLS = `id, scope, slot, filename, mime, size_bytes, created_at`;
export const BODY_SLOTS = ["front", "back", "right", "left"];
export const BLOOD_MAX = 2;

// Ham gövde okuyucu: yalnız application/octet-stream; sınır aşılırsa okuma hemen kesilir (bellek şişmez).
export function raw(req, res, next) {
  if (Buffer.isBuffer(req.body)) return req.body.length > UPLOAD_MAX_BYTES ? res.status(400).json({ error: SIZE_ERROR }) : next();   // (yerel test sunucusu gövdeyi önceden okur)
  if (!/^application\/octet-stream\b/i.test(String(req.headers["content-type"] || ""))) return res.status(400).json({ error: "Dosya bulunamadı." });
  const chunks = []; let size = 0, done = false;
  const finish = (fn) => { if (!done) { done = true; fn(); } };
  req.on("data", (c) => {
    size += c.length;
    if (size > UPLOAD_MAX_BYTES) { finish(() => { res.status(400).json({ error: SIZE_ERROR }); req.pause(); }); return; }
    if (!done) chunks.push(c);
  });
  req.on("end", () => finish(() => { req.body = Buffer.concat(chunks); next(); }));
  req.on("error", () => finish(() => res.status(400).json({ error: "Dosya alınamadı." })));
}

uploadsRouter.post("/uploads/:scope", requireAuth, async (req, res, next) => {
  if (!["ticket", "profile", "body", "blood"].includes(req.params.scope)) return res.status(404).json({ error: "Bulunamadı." });
  if (req.params.scope === "body" && !BODY_SLOTS.includes(String(req.query.slot || ""))) return res.status(400).json({ error: "Geçersiz vücut formu yönü." });
  // Sınır, gövde belleğe alınmadan ÖNCE uygulanır.
  if (!(await checkHourlyActionLimit(`upload:${req.user.sub}`, "attachment_upload", UPLOADS_PER_HOUR))) {
    return res.status(429).json({ error: "Kısa sürede çok fazla dosya yüklendi. Lütfen bir süre sonra tekrar deneyin." });
  }
  const declaredLen = Number(req.headers["content-length"] || 0);
  if (declaredLen > UPLOAD_MAX_BYTES) return res.status(400).json({ error: SIZE_ERROR });
  next();
}, raw, async (req, res) => {
  const scope = req.params.scope;
  let name = ""; try { name = decodeURIComponent(String(req.headers["x-file-name"] || "")); } catch { name = ""; }
  const filename = cleanFilename(name);
  const te = declaredTypeError(String(req.headers["x-file-type"] || ""), filename);
  if (te) return res.status(400).json({ error: scope === "ticket" ? te.replace(TYPES_TEXT, TICKET_TYPES_TEXT) : te });
  if (kindOf(filename).ticketOnly && scope !== "ticket") return res.status(400).json({ error: TYPE_ERROR });
  const buf = req.body;
  if (!Buffer.isBuffer(buf) || !buf.length) return res.status(400).json({ error: "Dosya bulunamadı." });
  if (buf.length > UPLOAD_MAX_BYTES) return res.status(400).json({ error: SIZE_ERROR });
  const ce = contentTypeError(buf, filename);
  if (ce) return res.status(400).json({ error: ce });

  // Vücut formu: yalnız görsel (PNG/JPG/JPEG); her yön için tek görsel — yenisi eskisinin yerini alır.
  if (scope === "body" && !/^image\//.test(kindOf(filename).mime)) return res.status(400).json({ error: "Vücut formu için yalnızca PNG, JPG veya JPEG görsel eklenebilir." });
  // Kan tahlili: en fazla 2 dosya; yalnız PNG / JPG / JPEG görsel veya PDF (sağlık verisi — açık rıza gerekir).
  if (scope === "blood" && !/^image\/(png|jpeg)$|^application\/pdf$/.test(kindOf(filename).mime)) return res.status(400).json({ error: "Kan tahlili için yalnızca PNG, JPG, JPEG veya PDF eklenebilir." });
  if (scope === "profile" || scope === "body" || scope === "blood") {
    const c = await pool.query(`SELECT health_consent_at FROM member_profiles WHERE user_id = $1`, [req.user.sub]);
    if (!c.rows[0] || !c.rows[0].health_consent_at) return res.status(400).json({ error: "Dosya eklemeden önce açık rızanızı onaylayıp bilgilerinizi kaydedin.", code: "consent_required" });
    if (scope === "profile") {
      const n = await pool.query(`SELECT count(*)::int AS n FROM attachments WHERE user_id = $1 AND scope = 'profile'`, [req.user.sub]);
      if (n.rows[0].n >= ATTACH_MAX) return res.status(400).json({ error: COUNT_ERROR });
    }
    if (scope === "blood") {
      const n = await pool.query(`SELECT count(*)::int AS n FROM attachments WHERE user_id = $1 AND scope = 'blood'`, [req.user.sub]);
      if (n.rows[0].n >= BLOOD_MAX) return res.status(400).json({ error: `Kan tahlili için en fazla ${BLOOD_MAX} dosya eklenebilir.` });
    }
  } else {
    // Bir günden eski, hiçbir mesaja bağlanmamış ekler temizlenir; bekleyen ek sayısı sınırlıdır.
    await pool.query(`DELETE FROM attachments WHERE user_id = $1 AND scope = 'ticket' AND message_id IS NULL AND created_at < now() - interval '1 day'`, [req.user.sub]);
    const n = await pool.query(`SELECT count(*)::int AS n FROM attachments WHERE user_id = $1 AND scope = 'ticket' AND message_id IS NULL`, [req.user.sub]);
    if (n.rows[0].n >= PENDING_MAX) return res.status(400).json({ error: "Gönderilmemiş çok fazla dosya var. Lütfen önce mesajınızı gönderin veya dosyaları kaldırın." });
  }
  const slot = scope === "body" ? String(req.query.slot) : null;
  if (slot) await pool.query(`DELETE FROM attachments WHERE user_id = $1 AND scope = 'body' AND slot = $2 RETURNING id`, [req.user.sub, slot]);
  const { rows } = await pool.query(
    `INSERT INTO attachments (user_id, scope, slot, filename, mime, size_bytes, data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${FILE_COLS}`,
    [req.user.sub, scope, slot, filename, kindOf(filename).mime, buf.length, buf]);
  res.status(201).json(rows[0]);
});

uploadsRouter.get("/uploads/:scope", requireAuth, async (req, res) => {
  if (!["profile", "body", "blood"].includes(req.params.scope)) return res.status(404).json({ error: "Bulunamadı." });
  const { rows } = await pool.query(`SELECT ${FILE_COLS} FROM attachments WHERE user_id = $1 AND scope = $2 ORDER BY created_at`, [req.user.sub, req.params.scope]);
  res.json(rows);
});

/** Dosyayı güvenli başlıklarla gönderir (sahiplik/yetki çağıran tarafından doğrulanmış olmalı). */
export function sendAttachment(res, a, cache) {
  // pg, bytea'yı Buffer olarak döndürür; başka bir sürücü onaltılık metin ("\\x…") döndürürse çevrilir.
  const data = Buffer.isBuffer(a.data) ? a.data : Buffer.from(String(a.data || "").replace(/^\\x/, ""), "hex");
  const image = a.mime === "image/png" || a.mime === "image/jpeg" || a.mime === "image/gif";
  res.setHeader("Content-Type", a.mime);
  res.setHeader("Content-Length", String(data.length));
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  // değişmeyen görseller (her yeni yükleme yeni kimlik alır): tarayıcı bir hafta saklar, ara katman (CDN) saklamaz
  res.setHeader("Cache-Control", cache === "immutable" ? "private, max-age=604800, immutable" : "private, no-store");
  res.setHeader("Content-Disposition", `${image ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(a.filename)}`);
  res.end(data);
}

uploadsRouter.get("/attachments/:id", requireAuth, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Dosya bulunamadı." });
  // Sahibi görür; ayrıca üye, KENDİ destek talebindeki mesajlara (ör. destek ekibinin yanıtına) eklenmiş dosyaları görür.
  const { rows } = await pool.query(
    `SELECT a.filename, a.mime, a.data FROM attachments a
      WHERE a.id = $1 AND (a.user_id = $2 OR EXISTS (SELECT 1 FROM ticket_messages m JOIN tickets t ON t.id = m.ticket_id WHERE m.id = a.message_id AND t.user_id = $2))`, [req.params.id, req.user.sub]);
  if (!rows[0]) return res.status(404).json({ error: "Dosya bulunamadı." });
  sendAttachment(res, rows[0]);
});

// Yalnız henüz bir mesaja bağlanmamış ticket eki veya kişisel bilgi eki silinebilir (gönderilmiş mesajın eki değişmez).
uploadsRouter.delete("/attachments/:id", requireAuth, async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Dosya bulunamadı." });
  const { rowCount } = await pool.query(`DELETE FROM attachments WHERE id = $1 AND user_id = $2 AND message_id IS NULL AND scope IN ('ticket', 'profile', 'body', 'blood') RETURNING id`, [req.params.id, req.user.sub]);
  if (!rowCount) return res.status(404).json({ error: "Dosya bulunamadı." });
  res.json({ ok: true });
});

/** Mesaja eklenecek dosya kimliklerini doğrular: dizi, en fazla 4, hepsi bu üyenin bekleyen ticket eki. @returns {{ids}|{error}} */
export async function checkTicketAttachments(userId, raw) {
  if (raw === undefined || raw === null) return { ids: [] };
  if (!Array.isArray(raw) || raw.some((x) => typeof x !== "string" || !UUID_RE.test(x))) return { error: "Geçersiz dosya eki." };
  const ids = [...new Set(raw)];
  if (ids.length > ATTACH_MAX) return { error: COUNT_ERROR };
  if (!ids.length) return { ids };
  const { rows } = await pool.query(
    `SELECT count(*)::int AS n FROM attachments WHERE id = ANY($1::uuid[]) AND user_id = $2 AND scope = 'ticket' AND message_id IS NULL`, [ids, userId]);
  if (rows[0].n !== ids.length) return { error: "Dosya eki bulunamadı; lütfen dosyayı yeniden ekleyin." };
  return { ids };
}
export async function linkAttachments(db, userId, messageId, ids) {
  if (!ids.length) return;
  await db.query(`UPDATE attachments SET message_id = $1 WHERE id = ANY($2::uuid[]) AND user_id = $3 AND scope = 'ticket' AND message_id IS NULL`, [messageId, ids, userId]);
}
/** Mesaj listesine ekleri iliştirir (dosya verisi olmadan). */
export async function withAttachments(messages) {
  if (!messages.length) return messages;
  const { rows } = await pool.query(`SELECT ${FILE_COLS}, message_id FROM attachments WHERE message_id = ANY($1::uuid[]) ORDER BY created_at`, [messages.map((m) => m.id)]);
  return messages.map((m) => ({ ...m, attachments: rows.filter((a) => a.message_id === m.id).map(({ message_id, ...a }) => a) }));
}
