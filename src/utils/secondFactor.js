// v55 — hesap işlemlerinin onayı (ad soyad, şifre, hesap silme, e-posta değişimi, kurtarma kodu yenileme) YALNIZ e-posta kodudur.
//   • Kod, işlem anında hesaba kayıtlı e-posta adresine gider; 5 dk geçerli, tek kullanımlık, yeniden gönderilebilir.
//   • Google Authenticator bu işlemlerde İSTENMEZ: Authenticator yalnız girişte (kullanıcı kendisi etkinleştirdiyse) sorulan
//     MFA yöntemidir. Böylece iki doğrulama türünün görevleri ayrıdır (e-posta = hesap işlemi onayı, Authenticator = giriş).
// ÖNCEDEN (v37–v54): Authenticator etkinse e-posta koduna EK olarak uygulama kodu da isteniyordu.
// İşlemin hedefi (yeni ad, yeni şifre hash'i…) verification_codes kaydında bekler; kod doğrulanırsa uygulanır.
import { createVerificationCode, verifyCode, sendMail } from "./mailer.js";
import { recordFailure, sendCodeFailure } from "./rateLimit.js";

/**
 * İşlem için e-posta kodunu gönderir. mail = { to, build(code) → { subject, html, text } } (utils/emailTemplates.js).
 * Dönüş: { method: "email" } veya e-posta gönderilemediyse { method: "email", mailFailed: true }.
 */
export async function issueFactor(userId, purpose, target, mail) {
  const code = await createVerificationCode(userId, purpose, target, 5);
  const sent = await sendMail(mail.to, mail.build(code));
  if (sent.reason === "send_failed" || sent.reason === "smtp_required_in_production") return { method: "email", mailFailed: true };
  return { method: "email" };
}

/** E-posta kodunu doğrular ve tüketir: dönüş verifyCode ile aynı biçimde { valid, target } (+ reason). */
export async function verifyFactor(userId, purpose, input) {
  return verifyCode(userId, purpose, input);
}

/** Başarısız doğrulamaya yanıt: ortak 6 hak sayacına yazılır (6. hatada hesap kilitlenir). */
export async function respondFactorFailure(res, identifier, result) {
  return sendCodeFailure(res, await recordFailure(identifier, "verification_code"));   // v56: sayaç / kalan hak bildirilmez
}
