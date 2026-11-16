// utils/auditRedact.js — SAF yardımcı (veritabanına dokunmaz; testler doğrudan içe aktarır).
/** v44: denetim kaydına ve denetim kaydı ekranına ASLA hassas değer girmez. Ayrıntı nesnesindeki parola, token,
 * gizli anahtar, doğrulama/Authenticator/kurtarma kodu, çerez ve yetkilendirme başlığı benzeri alanlar — hangi
 * derinlikte olursa olsun — yazılmadan önce "[gizlendi]" ile değiştirilir. Aynı işlev okurken de uygulanır
 * (eski kayıtlarda böyle bir alan kalmışsa ekranda görünmez). */
const SENSITIVE_KEY = /pass(word)?|pwd|secret|token|totp|otp|recovery|backup|cookie|authori[sz]ation|api[-_]?key|private|session|csrf|hash_?pw|password_hash|(^|_)code$|Code$/i;
const ALLOWED_CODE_KEYS = new Set(["code", "couponCode", "orderNumber", "ticketNumber"]);   // kupon/parti kodu ve numaralar gizli değildir
export function redactAuditDetails(value, depth = 0) {
  if (value === null || value === undefined) return value;
  if (depth > 6) return "[…]";
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redactAuditDetails(v, depth + 1));
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value).slice(0, 60)) {
      out[k] = SENSITIVE_KEY.test(k) && !ALLOWED_CODE_KEYS.has(k) ? "[gizlendi]" : redactAuditDetails(v, depth + 1);
    }
    return out;
  }
  if (typeof value === "string") return value.length > 500 ? value.slice(0, 500) + "…" : value;
  return value;
}
