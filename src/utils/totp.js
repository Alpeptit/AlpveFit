// v53 — Google Authenticator (TOTP, RFC 6238) doğrulaması — bağımlılıksız, Node'un yerleşik crypto modülüyle.
//
// NEDEN: önceden otplib kullanılıyordu ve doğrulama kodunun yorumu "pencere içi sapma (-1/0/+1)" diyordu; ancak otplib'in
// varsayılan penceresi 0'dır — yalnız O ANKİ 30 saniyelik kod kabul ediliyordu. Kod ekranda değişmek üzereyken girildiğinde,
// telefon/sunucu saati birkaç saniye farklı olduğunda ya da kod alındıktan sonra başka bir alan doldurulduğunda (ör. şifre
// sıfırlamada yeni şifre yazılırken) DOĞRU kod "hatalı" sayılıyor; birkaç denemede hesap geçici olarak kilitleniyordu.
// ŞİMDİ: RFC 6238'in önerdiği gibi bir önceki ve bir sonraki 30 sn'lik adım da kabul edilir (±30 sn tolerans). Aynı kodun
// tekrar kullanımı totpOnce.js'teki "son kullanılan adım" kaydıyla yine engellenir. Biçim Google Authenticator ile aynıdır:
// SHA-1, 6 hane, 30 sn, Base32 anahtar (otplib ile üretilmiş mevcut anahtarlar da aynı biçimdedir, değişiklik gerekmez).
import crypto from "crypto";

export const TOTP_STEP_SECONDS = 30;
export const TOTP_DIGITS = 6;
export const TOTP_WINDOW = 1;            // ±1 adım (önceki / şimdiki / sonraki kod)

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf) {
  let bits = 0, value = 0, out = "";
  for (const byte of buf) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(str) {
  const s = String(str || "").toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0, value = 0;
  const out = [];
  for (const ch of s) {
    const idx = B32.indexOf(ch);
    if (idx < 0) throw new Error("Geçersiz Base32 anahtar.");
    value = (value << 5) | idx; bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(out);
}

/** Yeni anahtar: 20 bayt (160 bit) rastgele → 32 karakter Base32 (RFC 4226 önerisi). */
export function generateSecret(bytes = 20) {
  return base32Encode(crypto.randomBytes(bytes));
}

export function hotp(key, counter, digits = TOTP_DIGITS) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac("sha1", key).update(msg).digest();
  const o = h[h.length - 1] & 0x0f;
  const bin = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(bin % 10 ** digits).padStart(digits, "0");
}

export function stepAt(nowMs = Date.now()) {
  return Math.floor(nowMs / 1000 / TOTP_STEP_SECONDS);
}

/** Verilen andaki kod (testler ve kurulum kontrolü için). */
export function totpCode(secret, nowMs = Date.now()) {
  return hotp(base32Decode(secret), stepAt(nowMs));
}

/** Kullanıcı girdisini sadeleştirir: boşluklar atılır ("123 456" → "123456"); 6 hane değilse null. */
export function normalizeToken(token) {
  const t = String(token ?? "").replace(/\s+/g, "");
  return /^\d{6}$/.test(t) ? t : null;
}

/**
 * Kod geçerliyse eşleşen adım sapmasını (0, -1 veya +1) döner; değilse null. Karşılaştırma sabit sürelidir.
 * Önce şimdiki adım, sonra önceki, sonra sonraki adım denenir.
 */
export function checkDelta(token, secret, { window = TOTP_WINDOW, nowMs = Date.now() } = {}) {
  const t = normalizeToken(token);
  if (!t || !secret) return null;
  let key;
  try { key = base32Decode(secret); } catch { return null; }
  if (key.length === 0) return null;
  const now = stepAt(nowMs);
  const order = [0];
  for (let d = 1; d <= window; d++) order.push(-d, d);
  const a = Buffer.from(t);
  for (const d of order) {
    const b = Buffer.from(hotp(key, now + d));
    if (crypto.timingSafeEqual(a, b)) return d;
  }
  return null;
}

/** Authenticator uygulamasına eklenecek otpauth:// adresi (QR kodun içeriği). */
export function keyuri(account, issuer, secret) {
  const label = encodeURIComponent(issuer) + ":" + encodeURIComponent(account);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_STEP_SECONDS}`;
}
