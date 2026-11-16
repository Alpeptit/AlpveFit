// v32/v34 — KAYAN OTURUM: etkin kullanıcının oturumu, belirteç ölmeden sessizce yenilenir.
//
// ÇÖZÜLEN SORUN: oturum, girişten tam JWT_EXPIRES_IN kadar sonra, kullanıcı o sırada sitede
// gezinirken bile aniden bitiyordu ("beklenmedik çıkış").
//
// SINIRLAR (karar kuralları sessionRenewRules.js'te, bağımlılıksız ve test edilebilir):
//   • Yenileme eşiği belirtecin kendi ömrüne göredir (ömrün yarısı, 60 sn – 24 saat arası).
//   • Mutlak tavan: ilk girişten 30 gün sonra yenileme durur (çalınan bir çerez sonsuza dek tazelenemesin).
//   • Yenileme token_version'ı DEĞİŞTİRMEZ: güvenli çıkış, şifre değişimi ve hesap kilidi tüm
//     belirteçleri eskisi gibi ANINDA geçersiz kılar.
import jwt from "jsonwebtoken";
import { shouldRenew, originSeconds } from "./sessionRenewRules.js";

export { MAX_RENEW_AFTER_MS, MIN_RENEW_AFTER_MS, ABSOLUTE_MAX_MS, renewAfterMs, shouldRenew } from "./sessionRenewRules.js";

/** payload: jwt.verify ile DOĞRULANMIŞ yük. Yenileme gerekiyorsa yeni JWT metnini, gerekmiyorsa null döner. */
export function renewedToken(payload, secret, now = Date.now()) {
  if (!secret || !shouldRenew(payload, now)) return null;
  return jwt.sign(
    { sub: payload.sub, role: payload.role, tv: payload.tv, ot: originSeconds(payload) },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d", algorithm: "HS256" }
  );
}

/** v57: güvenlik işleminden sonra (diğer oturumlar token_version artışıyla kapatıldığında) BU oturumu yeni sürümle sürdürür. */
export function reissuedToken(payload, tokenVersion, secret = process.env.JWT_SECRET) {
  return jwt.sign(
    { sub: payload.sub, role: payload.role, tv: tokenVersion, ot: originSeconds(payload) },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d", algorithm: "HS256" }
  );
}
