// v34 — kayan oturum KARARI (saf kurallar; hiçbir paket kullanmaz, bu yüzden doğrudan test edilebilir).
// İmzalama işi sessionRenew.js'tedir; burada yalnız "yenilensin mi" sorusu yanıtlanır.
export const MAX_RENEW_AFTER_MS = 24 * 60 * 60 * 1000;      // yenileme eşiğinin üst sınırı
export const MIN_RENEW_AFTER_MS = 60 * 1000;                // alt sınırı (her istekte yeniden imzalamayalım)
export const ABSOLUTE_MAX_MS = 30 * 24 * 60 * 60 * 1000;    // ilk girişten itibaren en çok 30 gün
const DEFAULT_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Yenileme eşiği, belirtecin KENDİ ömrüne göre: ömrün yarısı, [60 sn, 24 saat] arasına sıkıştırılır.
 * Sabit 24 saatlik eşik, JWT_EXPIRES_IN kısa tutulduğunda (ör. "1h") hiç yenileme yapmazdı:
 * belirteç 1 saatte ölür, yenileme 24 saat beklerdi — yani düzeltme o yapılandırmada çalışmazdı.
 */
export function renewAfterMs(payload) {
  const lifetime = payload && typeof payload.exp === "number" && typeof payload.iat === "number"
    ? (payload.exp - payload.iat) * 1000
    : DEFAULT_LIFETIME_MS;
  return Math.min(MAX_RENEW_AFTER_MS, Math.max(MIN_RENEW_AFTER_MS, Math.floor(lifetime / 2)));
}

/** İlk girişin zamanı (saniye). Yenilenen belirteçte ot alanıyla taşınır; mutlak tavan bundan ölçülür. */
export function originSeconds(payload) {
  return typeof payload?.ot === "number" ? payload.ot : payload?.iat;
}

/** Yenileme gerekli mi? (yük DOĞRULANMIŞ kabul edilir) */
export function shouldRenew(payload, now = Date.now()) {
  if (!payload || typeof payload.iat !== "number") return false;
  if (now - payload.iat * 1000 < renewAfterMs(payload)) return false;          // henüz taze
  if (now - originSeconds(payload) * 1000 >= ABSOLUTE_MAX_MS) return false;    // mutlak tavan doldu
  return true;
}
