// Y2: JWT artık localStorage yerine httpOnly bir çerezde tutulur — bir XSS
// açığı olsa bile JavaScript bu çerezi OKUYAMAZ. Ayrıca çift-gönderim
// (double-submit) deseniyle bir CSRF token'ı da (httpOnly OLMAYAN, JS'in
// okuyup özel bir başlıkta geri gönderebileceği) ayrı bir çerezde tutulur.
//
// Kasıtlı olarak `cookie-parser` gibi bir pakete ihtiyaç duymuyor — sadece
// iki spesifik çerezi okuyup yazmamız gerekiyor, bunun için küçük, test
// edilmiş, bağımlılıksız yardımcı fonksiyonlar yeterli ve daha güvenli
// (yeni, bu ortamda kurulumu doğrulanamamış bir pakete güvenmek yerine).
import crypto from "crypto";

const isProduction = process.env.NODE_ENV === "production";
const CSRF_VALUE_RE = /^[0-9a-f]{64}$/;   // issueAuthCookies'in ürettiği biçim; başka bir şeyi geri yazmayız

export const AUTH_COOKIE_NAME = "avf_session";
export const CSRF_COOKIE_NAME = "avf_csrf";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/** Bir Cookie başlığını basit bir { isim: değer } nesnesine ayrıştırır. */
export function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (!name) continue;
    // M-09 (final sertleştirme listesi) düzeltmesi: ÖNCEDEN decodeURIComponent
    // try/catch içinde değildi — bozuk bir % kodlaması (örn. "%zz") içeren
    // bir çerez değeri URIError fırlatırdı. Bu, requireAuth üzerinden HER
    // istekte tetiklenebilirdi ve bir SUNUCU hatası (500) gibi görünürdü —
    // ama bu aslında bir İSTEMCİ veri hatasıdır. Artık sadece o tek çerez
    // sessizce atlanır, diğer çerezler doğru şekilde ayrıştırılmaya devam
    // eder.
    try {
      out[name] = decodeURIComponent(value);
    } catch {
      // Bozuk kodlama — bu çerezi yok say, isteğin tamamını çökertme.
    }
  }
  return out;
}

// K11 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN SameSite=Lax sabitti.
// Frontend (Vercel) ve backend (Railway) FARKLI kayıtlı domain'lerdeyse,
// tarayıcılar SameSite=Lax çerezini fetch()/XHR ile yapılan cross-site
// isteklerde (login, checkout — TÜM API çağrıları) GÖNDERMEYEBİLİR — bu,
// tüm httpOnly çerez tabanlı oturum sistemini işlevsiz kılabilirdi.
//
// COOKIE_CROSS_SITE=true ayarlandığında SameSite=None kullanılır (frontend
// ve backend farklı domain'lerdeyse GEREKLİ). SameSite=None, tarayıcılar
// tarafından HER ZAMAN Secure ile birlikte zorunlu tutulur — bu yüzden bu
// modda NODE_ENV'den BAĞIMSIZ olarak Secure eklenir (aksi halde tarayıcı
// çerezi tamamen reddeder, sessizce hiç ayarlanmamış gibi davranır).
//
// ÖNEMLİ: SameSite=None, Lax'ın sağladığı örtük CSRF korumasını KALDIRIR —
// bu yüzden bu mod açıkken requireAuth'ta Origin/Referer kontrolü
// (aşağıda auth.js'de) ek bir savunma katmanı olarak ZORUNLU hale gelir.
const crossSite = process.env.COOKIE_CROSS_SITE === "true";

function cookieString(name, value, { httpOnly, maxAgeMs }) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push("Path=/");
  parts.push(`Max-Age=${Math.floor(maxAgeMs / 1000)}`);
  parts.push(crossSite ? "SameSite=None" : "SameSite=Lax");
  if (httpOnly) parts.push("HttpOnly");
  if (isProduction || crossSite) parts.push("Secure"); // SameSite=None tarayıcılarca Secure'suz kabul edilmez
  return parts.join("; ");
}

/** Girişten sonra hem oturum (httpOnly) hem CSRF (JS'in okuyabildiği) çerezini ayarlar. */
export function issueAuthCookies(res, token) {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  res.setHeader("Set-Cookie", [
    cookieString(AUTH_COOKIE_NAME, token, { httpOnly: true, maxAgeMs: SEVEN_DAYS_MS }),
    cookieString(CSRF_COOKIE_NAME, csrfToken, { httpOnly: false, maxAgeMs: SEVEN_DAYS_MS }),
  ]);
}

/**
 * v32/v34: kayan oturum — oturum çerezini yeniler.
 *
 * v34 DÜZELTMESİ (kritik): ÖNCEDEN yalnız oturum çerezi tazeleniyordu. İki çerez de girişte 7 günlük
 * yazıldığı için, 7. günde avf_csrf TARAYICIDAN SİLİNİYOR, avf_session ise yenilenmeye devam ediyordu.
 * Sonuç: kullanıcı "giriş yapmış" görünüyor ama CSRF başlığı üretilemediğinden sepete ekleme, sipariş,
 * ayar değiştirme gibi TÜM yazma istekleri 403 ("Güvenlik doğrulaması başarısız") alıyordu ve sayfayı
 * yenilemek de çözmüyordu. Artık CSRF çerezi de AYNI DEĞERLE tazelenir — değer değişmediği için o sırada
 * uçuşta olan isteklerin başlığı geçerli kalır (değer değiştirmek onları kırardı).
 *
 * currentCsrf: isteğin kendi CSRF çerezi. Yoksa (süresi dolmuş/silinmiş) yenisi üretilir; bu durumda zaten
 * hiçbir yazma isteği çalışmıyordur, dolayısıyla yeni değer bir şeyi bozmaz, tam tersine onarır.
 */
export function refreshAuthCookie(res, token, currentCsrf) {
  const csrf = CSRF_VALUE_RE.test(String(currentCsrf ?? "")) ? String(currentCsrf) : crypto.randomBytes(32).toString("hex");
  res.append("Set-Cookie", cookieString(AUTH_COOKIE_NAME, token, { httpOnly: true, maxAgeMs: SEVEN_DAYS_MS }));
  res.append("Set-Cookie", cookieString(CSRF_COOKIE_NAME, csrf, { httpOnly: false, maxAgeMs: SEVEN_DAYS_MS }));
}

/** Çıkışta her iki çerezi de temizler (Max-Age=0 ile hemen sona erdirir). */
export function clearAuthCookies(res) {
  res.setHeader("Set-Cookie", [
    cookieString(AUTH_COOKIE_NAME, "", { httpOnly: true, maxAgeMs: 0 }),
    cookieString(CSRF_COOKIE_NAME, "", { httpOnly: false, maxAgeMs: 0 }),
  ]);
}
