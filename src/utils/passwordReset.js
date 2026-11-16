// v57 — ŞİFRE SIFIRLAMA İSTEKLERİ (kimliği doğrulanmamış akış)
//
// İlkeler (pazardaki yerleşik uygulama):
//   • Hesap olsun ya da olmasın istemciye AYNI genel yanıt verilir; istemci kullanıcı kimliği (userId) değil, her istekte yeni
//     üretilen tahmin edilemez bir istek anahtarı (resetId) alır. Hesap yoksa da istek satırı oluşturulur (user_id NULL) ve
//     sonraki tüm adımlar (kod denemesi, yeniden gönderme, sınırlar) birebir aynı davranır — hiçbir şey gönderilmez.
//   • E-postada iki yol vardır: tek kullanımlık sıfırlama BAĞLANTISI ve aynı istek için 6 haneli KOD. İkisi de 15 dakika geçerlidir.
//     Şifre YALNIZ bağlantı veya kod doğrulandıktan sonra verilen bilet (15 dk) ile değiştirilir.
//   • Kimliği doğrulanmamış bir istek HESABI KİLİTLEMEZ: hatalı kod denemeleri yalnız o İSTEĞE yazılır; 6 hatalı denemede istek
//     iptal edilir, kullanıcı yeni istek başlatabilir. Sıfırlama e-postaları IP, yazılan kimlik ve hesap başına saatlik sınırlıdır.
//   • Kod, bağlantı anahtarı ve bilet yalnız HMAC özetiyle saklanır (veritabanı dökümü tek başına işe yaramaz).
import crypto from "crypto";
import { pool } from "../db/pool.js";
import { hmacToken, genSixDigitCode } from "./mailer.js";

export const RESET_TTL_MIN = 15;          // kod + bağlantı geçerliliği
export const RESET_TICKET_MIN = 15;       // doğrulamadan sonra yeni şifre için süre
export const RESET_MAX_ATTEMPTS = 6;      // istek başına hatalı kod hakkı (hesabı kilitlemez)
export const RESET_MAX_RESENDS = 3;       // istek başına yeniden gönderme
export const RESET_PER_IP_HOUR = 10;      // IP başına saatlik sıfırlama isteği
export const RESET_PER_ID_HOUR = 3;       // yazılan kullanıcı adı / e-posta başına saatlik istek (hesap var/yok fark etmez)
export const RESET_PER_USER_HOUR = 5;     // gerçek hesap başına saatlik e-posta (aşılırsa sessizce gönderilmez)

const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;   // 32 bayt base64url
export const isResetToken = (s) => typeof s === "string" && TOKEN_RE.test(s);
const token = () => crypto.randomBytes(32).toString("base64url");
const expiry = (min) => new Date(Date.now() + min * 60_000);

/** Yeni istek: aynı hesabın açık istekleri geçersiz olur (yalnız en son e-posta çalışır). userId null → sahte istek. */
export async function createResetRequest(userId) {
  const rid = token(), link = token(), code = genSixDigitCode();
  if (userId) await pool.query(`UPDATE password_reset_requests SET consumed_at = now() WHERE user_id = $1 AND consumed_at IS NULL`, [userId]);
  await pool.query(
    `INSERT INTO password_reset_requests (rid_hash, user_id, code_hash, link_hash, expires_at) VALUES ($1, $2, $3, $4, $5)`,
    [hmacToken(rid), userId || null, hmacToken(code), hmacToken(link), expiry(RESET_TTL_MIN)]
  );
  return { rid, code, link };
}

/**
 * Aynı istek için yeni kod + bağlantı (eskileri geçersiz). Dönüş: { ok, userId, code, link } | { error: "reset_expired" | "too_many_resends" }.
 * Hatalı deneme sayısı SIFIRLANMAZ (yeniden göndermek yeni deneme hakkı kazandırmaz).
 */
export async function refreshResetRequest(rid) {
  if (!isResetToken(rid)) return { error: "reset_expired" };
  const link = token(), code = genSixDigitCode();
  const { rows } = await pool.query(
    `UPDATE password_reset_requests SET code_hash = $2, link_hash = $3, expires_at = $4, resends = resends + 1
      WHERE rid_hash = $1 AND consumed_at IS NULL AND expires_at > now() AND attempts < $5 AND resends < $6
      RETURNING user_id`,
    [hmacToken(rid), hmacToken(code), hmacToken(link), expiry(RESET_TTL_MIN), RESET_MAX_ATTEMPTS, RESET_MAX_RESENDS]
  );
  if (rows.length) return { ok: true, userId: rows[0].user_id, code, link };
  const { rows: cur } = await pool.query(
    `SELECT resends FROM password_reset_requests WHERE rid_hash = $1 AND consumed_at IS NULL AND expires_at > now() AND attempts < $2`,
    [hmacToken(rid), RESET_MAX_ATTEMPTS]);
  return { error: cur.length ? "too_many_resends" : "reset_expired" };
}

async function issueTicket(id) {
  const ticket = token();
  await pool.query(`UPDATE password_reset_requests SET ticket_hash = $2, ticket_expires_at = $3 WHERE id = $1`, [id, hmacToken(ticket), expiry(RESET_TICKET_MIN)]);
  return ticket;
}

/**
 * 6 haneli kodu doğrular. Dönüş: { ok, ticket } | { error: "wrong_code" | "reset_too_many" | "reset_expired" }.
 * Deneme sayacı atomik olarak artar (eşzamanlı isteklerle 6 hak aşılamaz); 6. hatalı denemede istek iptal edilir.
 */
export async function verifyResetCode(rid, code) {
  if (!isResetToken(rid) || !/^\d{6}$/.test(String(code || ""))) return { error: "wrong_code" };
  const { rows } = await pool.query(
    `UPDATE password_reset_requests SET attempts = attempts + 1
      WHERE rid_hash = $1 AND consumed_at IS NULL AND expires_at > now() AND attempts < $2
      RETURNING id, user_id, code_hash, attempts`,
    [hmacToken(rid), RESET_MAX_ATTEMPTS]
  );
  const r = rows[0];
  if (!r) {
    const { rows: cur } = await pool.query(`SELECT attempts, consumed_at, expires_at > now() AS live FROM password_reset_requests WHERE rid_hash = $1`, [hmacToken(rid)]);
    return { error: cur[0] && cur[0].live && cur[0].attempts >= RESET_MAX_ATTEMPTS ? "reset_too_many" : "reset_expired" };
  }
  const a = Buffer.from(hmacToken(code), "hex"), b = Buffer.from(r.code_hash, "hex");
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b) && !!r.user_id;   // sahte istekte (user_id NULL) kod hiç eşleşmez
  if (!ok) {
    if (r.attempts >= RESET_MAX_ATTEMPTS) {
      await pool.query(`UPDATE password_reset_requests SET consumed_at = now() WHERE id = $1`, [r.id]);
      return { error: "reset_too_many" };
    }
    return { error: "wrong_code" };
  }
  return { ok: true, ticket: await issueTicket(r.id) };
}

/** E-postadaki bağlantının anahtarını doğrular (bağlantı tüketilmez; şifre belirlenince istek kapanır). */
export async function verifyResetLink(linkToken) {
  if (!isResetToken(linkToken)) return { error: "reset_expired" };
  const { rows } = await pool.query(
    `SELECT id FROM password_reset_requests WHERE link_hash = $1 AND consumed_at IS NULL AND expires_at > now() AND user_id IS NOT NULL`,
    [hmacToken(linkToken)]);
  if (!rows.length) return { error: "reset_expired" };
  return { ok: true, ticket: await issueTicket(rows[0].id) };
}

/** Bilete bağlı (doğrulanmış) isteği bulur — tüketmez. Dönüş: { id, userId } | null */
export async function findTicket(ticket) {
  if (!isResetToken(ticket)) return null;
  const { rows } = await pool.query(
    `SELECT id, user_id FROM password_reset_requests
      WHERE ticket_hash = $1 AND ticket_expires_at > now() AND consumed_at IS NULL AND user_id IS NOT NULL`, [hmacToken(ticket)]);
  return rows[0] ? { id: rows[0].id, userId: rows[0].user_id } : null;
}

/** Bileti atomik olarak tüketir (eşzamanlı ikinci kullanım false). Aynı hesabın diğer açık istekleri de kapanır. */
export async function consumeTicket(id, userId) {
  const r = await pool.query(`UPDATE password_reset_requests SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL RETURNING id`, [id]);
  if (r.rows.length !== 1) return false;
  await pool.query(`UPDATE password_reset_requests SET consumed_at = now() WHERE user_id = $1 AND consumed_at IS NULL`, [userId]);
  return true;
}

/** Yazılan kimliğin (kullanıcı adı / e-posta) saklanmadan sayaç anahtarı olarak kullanılan özeti. */
export const identifierKey = (s) => hmacToken("reset-id:" + String(s || "").trim().toLowerCase()).slice(0, 32);
