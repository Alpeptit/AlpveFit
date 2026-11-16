// v22 — TOTP tekrar kullanım koruması (OWASP MFA önerisi).
// ÖNCEDEN: kod doğrulanıyordu ama kullanılmış kodlar kaydedilmiyordu → aynı 6 haneli kod
// geçerlilik süresi (~30 sn) içinde İKİNCİ KEZ kullanılabiliyordu (oltalama/omuz üstünden bakma ile çalınan kod).
// ŞİMDİ: kodun ait olduğu 30 sn'lik zaman adımı bulunur ve kullanıcının "son kullanılan adımı" olarak TEK BİR koşullu
// güncellemeyle yazılır (yeni adım > kayıtlı adım). Aynı ya da daha eski kod tekrar gelirse güncelleme 0 satır etkiler →
// reddedilir. Sorgu atomik olduğu için aynı kodla gelen EŞZAMANLI iki istekten yalnız biri geçer.
import { checkDelta, normalizeToken, stepAt } from "./totp.js";
import { pool } from "../db/pool.js";
import { decrypt } from "./crypto.js";

// v53: doğrulama totp.js ile (±1 adım tolerans, boşluklu girdi kabul); kullanılan adım yine atomik olarak kaydedilir.
function matchStep(token, encryptedSecret) {
  const code = normalizeToken(token);
  if (!code || !encryptedSecret) return null;
  let secret;
  try { secret = decrypt(encryptedSecret); } catch { return null; }   // anahtar çözülemezse 500 değil "hatalı kod"
  const now = Date.now();
  const delta = checkDelta(code, secret, { nowMs: now });   // geçersizse null; geçerliyse sapma (0 / -1 / +1)
  return delta === null ? null : stepAt(now) + delta;
}

export async function verifyTotpOnce(userId, token, encryptedSecret, db = pool) {
  if (!userId) return false;
  const step = matchStep(token, encryptedSecret);
  if (step === null) return false;
  const { rows } = await db.query(
    `UPDATE users SET totp_last_step = $2 WHERE id = $1 AND (totp_last_step IS NULL OR totp_last_step < $2) RETURNING id`,
    [userId, step]
  );
  return rows.length === 1;
}

/**
 * v37: kodu TÜKETMEDEN geçerliliğine bakar (yalnız "bu kod şu an kabul edilir mi?").
 * İki kodlu işlemlerde (e-posta + Authenticator) önce bu çağrılır; e-posta kodu da doğruysa kod gerçekten tüketilir.
 * Böylece biri yanlışken diğeri boşuna yanmaz. Tüketim yine atomik verifyTotpOnce ile yapılır (yarışta tek istek geçer).
 */
export async function peekTotp(userId, token, encryptedSecret, db = pool) {
  if (!userId) return false;
  const step = matchStep(token, encryptedSecret);
  if (step === null) return false;
  const { rows } = await db.query(`SELECT totp_last_step FROM users WHERE id = $1`, [userId]);
  return rows.length === 1 && (rows[0].totp_last_step === null || Number(rows[0].totp_last_step) < step);
}

/**
 * v57: YENİ (henüz etkin olmayan) bir anahtarın kodunu doğrular ve eşleşen zaman adımını döner (geçersizse null).
 * Authenticator yenilemede kullanılır: totp_last_step ESKİ anahtara aittir; yeni anahtarın ilk kodu, eski uygulamayla aynı
 * 30 sn içinde girilmiş olsa bile reddedilmemeli. Etkinleştiren sorgu totp_last_step'i bu adıma yazar (yeni anahtar için
 * tekrar kullanım koruması o andan itibaren işler).
 */
export function matchNewTotpStep(token, encryptedSecret) {
  return matchStep(token, encryptedSecret);
}
