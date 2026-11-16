import { PANEL_ROLES, can, FORBIDDEN } from "../utils/permissions.js";
import jwt from "jsonwebtoken";
import { isRequestOriginAllowed } from "../utils/originCheck.js";
import { pool } from "../db/pool.js";
import { parseCookies, AUTH_COOKIE_NAME, CSRF_COOKIE_NAME, refreshAuthCookie } from "../utils/cookies.js";
import { renewedToken } from "../utils/sessionRenew.js";
import { isLockActive, lockBody } from "../utils/rateLimit.js";

// v34: oturumun NEDEN kapandığı sunucu günlüğüne tek satır yazılır. "Beklenmedik çıkış" şikâyetlerinde
// Railway kayıtlarından gerçek sebep (belirteç süresi doldu / çıkış-şifre değişimi / kilit) okunur.
// Kişisel veri yazılmaz: kullanıcı kimliğinin yalnız ilk 8 hanesi ve isteğin yolu.
// v37 (Railway günlük gürültüsü): bu satırlar HATA DEĞİL, olağan oturum olaylarıdır —
//   • "cerez_yok": giriş yapmamış ziyaretçinin her sayfa açılışındaki /auth/me yoklaması; artık HİÇ yazılmaz
//     (Railway'de her ziyaretçi kırmızı hata satırı üretiyordu ve gerçek hataları gizliyordu),
//   • diğer sebepler console.warn (stderr → Railway'de kırmızı) yerine console.log ile yazılır,
//   • aynı kullanıcı + sebep için en fazla 60 sn'de bir satır (eski sekmelerin art arda yoklaması günlüğü doldurmasın).
const AUTH_LOG_EVERY_MS = 60_000;
const authLogSeen = new Map();
function logAuthStop(req, reason, sub) {
  if (reason === "cerez_yok") return;
  try {
    const key = `${reason}:${sub || ""}`;
    const now = Date.now();
    if (now - (authLogSeen.get(key) || 0) < AUTH_LOG_EVERY_MS) return;
    authLogSeen.set(key, now);
    if (authLogSeen.size > 500) for (const [k, t] of authLogSeen) if (now - t > AUTH_LOG_EVERY_MS) authLogSeen.delete(k);
    console.log(`[auth] oturum reddedildi reason=${reason} path=${req.method} ${req.originalUrl || req.url}${sub ? " user=" + String(sub).slice(0, 8) : ""}`);
  } catch { /* günlük yazılamazsa akış bozulmaz */ }
}

export async function requireAuth(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[AUTH_COOKIE_NAME];
  if (!token) {
    logAuthStop(req, "cerez_yok");
    return res.status(401).json({ error: "Giriş yapmanız gerekiyor.", sessionExpired: true });
  }

  // Y2: CSRF koruması (çift-gönderim deseni). Sadece durum değiştiren
  // istekler için gerekli — bir GET isteği yan etki yaratmamalı, bu yüzden
  // CSRF riski taşımaz. Çerez tarayıcı tarafından otomatik gönderilir (bu
  // yüzden saldırgan bunu tetikleyebilir), ama saldırganın sitesi
  // `avf_csrf` çerezinin DEĞERİNİ okuyamaz (same-origin policy) — bu yüzden
  // eşleşen başlığı asla oluşturamaz.
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const csrfCookie = cookies[CSRF_COOKIE_NAME];
    const csrfHeader = req.headers["x-csrf-token"];
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({ error: "Güvenlik doğrulaması başarısız oldu. Lütfen sayfayı yenileyip tekrar deneyin." });
    }

    // K11 (3. bağımsız denetim) düzeltmesi: Origin/Referer kontrolü, ek bir
    // savunma katmanı. Özellikle COOKIE_CROSS_SITE=true (SameSite=None)
    // kullanıldığında ÖNEMLİ hale gelir, çünkü SameSite'ın örtük CSRF
    // korumasını kaldırır. Mobil uygulama istemcileri (Android/iOS) tarayıcı
    // olmadığı için Origin/Referer HİÇ göndermeyebilir — bu yüzden sadece bu
    // başlıklar MEVCUTSA doğrulanır, yokluğu tek başına reddedilmez.
    // M-02 / K11 / M-17 (v4): Origin/Referer doğrulaması — mantık ve
    // gerekçeler src/utils/originCheck.js içinde (saf, gerçekten test edilen).
    if (!isRequestOriginAllowed({ origin: req.headers.origin, referer: req.headers.referer, frontendUrl: process.env.FRONTEND_URL })) {
      return res.status(403).json({ error: "Güvenlik doğrulaması başarısız oldu." });
    }
  }

  // v28: ÖNCEDEN veritabanı hatası (kısa kesinti, bağlantı havuzu dolu) da "oturum süresi doldu" (401) sayılıyordu;
  // istemci bunu "çıkış yapıldı" diye yorumlayıp kullanıcıyı sebepsiz yere oturumdan atıyordu. Artık yalnızca
  // JWT/token_version geçersizliği 401'dir; altyapı hatası 503'tür ve oturumu SONLANDIRMAZ.
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch (err) {
    logAuthStop(req, err?.name === "TokenExpiredError" ? "belirtec_suresi_doldu" : "belirtec_gecersiz");
    return res.status(401).json({ error: "Oturum geçersiz veya süresi dolmuş.", sessionExpired: true });
  }

  let row;
  try {
    // Token'ın kendisi geçerli olsa bile, kullanıcı çıkış yaptıysa veya şifresini değiştirdiyse token_version artmış olur
    // ve bu eski token artık İŞE YARAMAZ hale gelir — JWT'lerin normalde sahip olmadığı "iptal edilebilirlik".
    const { rows } = await pool.query(`SELECT token_version, locked_at, locked_until FROM users WHERE id = $1`, [payload.sub]);
    row = rows[0];
  } catch (err) {
    console.error("[requireAuth] veritabanı hatası:", err.message);
    return res.status(503).json({ error: "Sunucu geçici olarak yanıt veremiyor. Lütfen birazdan tekrar deneyin." });
  }
  if (!row || row.token_version !== payload.tv) {
    // token_version artışı: çıkış yapıldı, şifre değişti/sıfırlandı veya hesap kilitlendi
    logAuthStop(req, row ? "baska_yerde_cikis_veya_sifre_degisti" : "kullanici_yok", payload.sub);
    return res.status(401).json({ error: "Oturum geçersiz veya süresi dolmuş.", sessionExpired: true });
  }
  if (isLockActive(row)) {   // v57: geçici kilit (30 dk) süresi dolunca oturum açılabilir; kilitlenirken oturumlar zaten kapanır
    logAuthStop(req, "hesap_kilitli", payload.sub);
    return res.status(403).json({ ...lockBody(row), sessionExpired: true });
  }
  // v32: kayan oturum — çerez, kullanıcı etkinken sessizce yenilenir (tavan: ilk girişten 30 gün).
  // v34: CSRF çerezi de aynı değerle tazelenir — yoksa o çerez oturumdan önce ölür ve tüm yazma istekleri 403 alır.
  // v55: v42'deki "kurtarma kodundan sonra zorunlu Authenticator kurulumu" kısıtı kaldırıldı — şifre sıfırlama artık Authenticator'a
  // dokunmaz, kurtarma kodu girişte tek kullanımlık olarak tüketilir ve Authenticator açık kalır.
  try { const fresh = renewedToken(payload, process.env.JWT_SECRET); if (fresh) refreshAuthCookie(res, fresh, cookies[CSRF_COOKIE_NAME]); } catch { /* yenileme başarısızsa mevcut oturum sürer */ }
  req.user = payload;
  next();
}

/**
 * Admin yetkisi çok hassas bir işlem olduğu için, JWT içindeki (login anında
 * damgalanmış, en fazla JWT_EXPIRES_IN kadar bayatlayabilen) role bilgisine
 * güvenmek yerine veritabanından O ANKİ rolü tekrar okuyoruz. Bu sayede bir
 * admin yetkisi geri alındığında, eski token hâlâ geçerli olsa bile etki
 * anında sona erer.
 *
 * O3 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN sadece role kontrol
 * ediliyordu — TOTP (2FA) etkin olmayan bir admin hesabının parolası tek
 * başına ele geçirilirse, saldırgan HİÇBİR ikinci faktöre ihtiyaç duymadan
 * tam admin yetkisi kazanıyordu. Artık admin işlemleri için TOTP etkin
 * olması ZORUNLU.
 *
 * ÖNEMLİ (geriye dönük uyumluluk): bu değişiklik, 2FA kurmamış MEVCUT admin
 * hesaplarını admin panelinden KİLİTLER. Deploy etmeden önce admin
 * hesabınızda 2FA'yı kurun (Hesap Ayarları → Google Authenticator).
 */
/**
 * Girişi İSTEĞE BAĞLI uçlar için (canlı destek). Oturum çerezi YOKSA istek misafir sayılır
 * (req.user = null). Çerez VARSA requireAuth'un tüm kontrolleri (JWT, token_version, CSRF, köken)
 * AYNEN uygulanır ve geçersizse istek REDDEDİLİR — sessizce misafire düşürülmez (fail-closed).
 */
export async function optionalAuth(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  if (!cookies[AUTH_COOKIE_NAME]) { req.user = null; return next(); }
  return requireAuth(req, res, next);
}

export async function requireAdmin(req, res, next) {
  // "Tam yetki" (role = 'admin') — yönetici atama, ödeme onayı, silme vb. yalnız bu rolde.
  return requirePanelRole(req, res, next, ["admin"]);
}

/**
 * v45: yönetim paneline giriş — "Tam yetki" (admin) VEYA "Yarım yetki" (staff). Her iki rolde de Google Authenticator
 * ZORUNLU. Rol her istekte VERİTABANINDAN okunur (JWT'deki eski role güvenilmez: yetki alınınca anında geçerli olur).
 * req.adminRole sonraki yetki denetimlerinde (requirePerm, maskeleme) kullanılır.
 */
export async function requirePanel(req, res, next) {
  return requirePanelRole(req, res, next, PANEL_ROLES);
}

/** v45: belirli bir yetki gerektirir (requirePanel'den SONRA kullanılır). Bkz. utils/permissions.js */
export function requirePerm(perm) {
  return (req, res, next) => (can(req.adminRole, perm) ? next() : res.status(403).json({ error: FORBIDDEN, code: "forbidden_role" }));
}

async function requirePanelRole(req, res, next, roles) {
  try {
    const { rows } = await pool.query(`SELECT role, totp_enabled, username, full_name, plan_kinds FROM users WHERE id = $1`, [req.user?.sub]);
    if (!rows[0] || !roles.includes(rows[0].role)) {
      return res.status(403).json({ error: FORBIDDEN });
    }
    if (!rows[0].totp_enabled) {
      return res.status(403).json({ error: "Uzman ve yönetici işlemleri için Google Authenticator (2FA) kurulumu zorunludur. Lütfen hesap ayarlarınızdan etkinleştirin.", requiresTotpSetup: true });
    }
    req.adminRole = rows[0].role;
    req.adminUsername = rows[0].username;
    req.panelName = rows[0].full_name;
    req.panelKinds = rows[0].plan_kinds || [];
    next();
  } catch (err) {
    console.error("[requireAdmin]", err);
    res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
  }
}
