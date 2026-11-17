// Alpvefit API sunucusu. Alpeptit'ten BAĞIMSIZDIR: kendi veritabanı (DATABASE_URL), kendi gizli anahtarları (JWT_SECRET, ENCRYPTION_KEY),
// kendi oturum çerezleri (avf_*) ve kendi adresleri vardır. Alpeptit'in hiçbir verisine veya anahtarına erişmez.
// "dotenv/config" EN İLK import olmalı: .env, diğer modüller (mailer → ENCRYPTION_KEY) yüklenmeden önce okunur.
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { runMigrations } from "./db/runMigrations.js";
import { authRouter } from "./routes/auth.js";
import { twoFactorRouter } from "./routes/twoFactor.js";
import { adminRouter } from "./routes/admin.js";
import { plansRouter } from "./routes/plans.js";
import { privacyRouter } from "./routes/privacy.js";
import { accountRouter } from "./routes/account.js";
import { notificationsRouter } from "./routes/notifications.js";
import { ordersRouter } from "./routes/orders.js";
import { profileRouter } from "./routes/profile.js";
import { blogRouter } from "./routes/blog.js";
import { supportRouter } from "./routes/support.js";
import { startDataRetentionJob } from "./services/dataRetention.js";
import { normalizeOrigin } from "./utils/originCheck.js";
import { clientIpMiddleware, originGuardMiddleware, cloudflareOnlyMiddleware, isCloudflareIp, viaCloudflare, edgePeerIp } from "./utils/clientIp.js";
import { mountSite } from "./site.js";
import { hideAdminApi } from "./utils/panelSession.js";
import { toErrorResponse } from "./utils/errorResponse.js";
import { attackSignatureFilter } from "./middleware/waf.js";

// ---------- Açılışta kritik ortam değişkenlerini kontrol et ----------
// Bunlardan biri eksikse sunucu YANLIŞLIKLA güvensiz bir şekilde ayağa
// kalkmasın diye hemen durduruyoruz — geç fark etmek yerine hemen görelim.
const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET", "ENCRYPTION_KEY", "FRONTEND_URL"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[startup] Kritik ortam değişkeni eksik: ${key}. Sunucu başlatılamıyor.`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.error("[startup] JWT_SECRET çok kısa/zayıf (en az 32 karakter olmalı). Sunucu başlatılamıyor.");
  process.exit(1);
}
if (process.env.ENCRYPTION_KEY.length < 32) {
  console.error("[startup] ENCRYPTION_KEY çok kısa/zayıf (en az 32 karakter olmalı). Sunucu başlatılamıyor.");
  process.exit(1);
}
// Vercel ön yüzü (isteğe bağlı) — ORIGIN_SECRET tanımlıysa güçlü olmalı; TRUST_VERCEL onsuz açılamaz (sahte x-real-ip riski).
if (process.env.ORIGIN_SECRET && process.env.ORIGIN_SECRET.split(",").some((x) => x.trim().length < 32)) {
  console.error("[startup] ORIGIN_SECRET çok kısa (her değer en az 32 karakter olmalı). Sunucu başlatılamıyor.");
  process.exit(1);
}
if (process.env.TRUST_VERCEL === "true" && !process.env.ORIGIN_SECRET) {
  console.error("[startup] TRUST_VERCEL=true iken ORIGIN_SECRET zorunludur. Sunucu başlatılamıyor.");
  process.exit(1);
}
if (process.env.REQUIRE_CLOUDFLARE === "true" && process.env.TRUST_CLOUDFLARE !== "true") {
  console.error("[startup] REQUIRE_CLOUDFLARE=true iken TRUST_CLOUDFLARE=true da olmalıdır. Sunucu başlatılamıyor.");
  process.exit(1);
}
if (process.env.ENCRYPTION_KEY === process.env.JWT_SECRET) {
  console.error("[startup] ENCRYPTION_KEY, JWT_SECRET ile aynı olamaz — ayrı, bağımsız bir anahtar kullanın.");
  process.exit(1);
}

const app = express();

// K6 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN sayısal bir hop sayısı
// ("1") kullanılıyordu — bu, Railway'in TAM proxy topolojisini (kaç ara
// katman olduğunu) doğru bilmeyi gerektirir. Yanlışsa iki riskten biri
// gerçekleşir: (a) gerçek hop sayısı daha fazlaysa, bir saldırgan
// X-Forwarded-For başlığını sahteleyerek ban sistemini atlatabilir, veya
// (b) daha azsa, aynı görünür IP'nin arkasındaki masum kullanıcılar
// birbirine karışıp toplu banlanabilir.
//
// Artık Express'in kendi önerdiği, hop SAYISINI bilmeyi gerektirmeyen
// yaklaşım kullanılıyor: sadece private/rezerve IP aralıklarından (bilinen
// altyapı katmanları) gelen X-Forwarded-For güvenilir sayılır, zincirde
// geriye doğru ilerlenip İLK gerçek public IP bulunur. req.ip bunu otomatik
// yansıtır (req.ips[0] ile aynıdır, ayrıca değiştirmeye gerek yok).
// v26: 100.64.0.0/10 (paylaşımlı/CGNAT aralığı) de altyapı sayılır — bazı platformların (Railway dahil)
// iç vekil sunucuları bu aralıktan bağlanabilir; internetten doğrudan bu adreslerle gelinemez.
app.set("trust proxy", "loopback, linklocal, uniquelocal, 100.64.0.0/10");
// v26: Cloudflare arkasında gerçek ziyaretçi adresi (TRUST_CLOUDFLARE=true) — hız sınırı ve WAF'tan ÖNCE.
app.use(originGuardMiddleware); // Vercel ön yüzü (isteğe bağlı) kullanılıyorsa API yalnız Vercel üzerinden
app.use(cloudflareOnlyMiddleware); // v66: REQUIRE_CLOUDFLARE=true iken Cloudflare'i atlayan doğrudan istekler 403 (varsayılan kapalı)
app.use(clientIpMiddleware);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"], // bu bir API sunucusu — hiçbir içerik render etmez
        frameAncestors: ["'none'"],
      },
    },
    // Tarayıcıya "bu siteye bir daha ASLA http:// ile bağlanma" der —
    // bir saldırganın araya girip trafiği şifresiz http'ye düşürmesini
    // (downgrade saldırısı) engeller.
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  })
);
// M-17 (v4): FRONTEND_URL origin olarak normalize edilir ("https://x.app/" → "https://x.app");
// aksi halde sonda "/" olan bir değer tüm tarayıcı isteklerini CORS'ta reddettirirdi.
app.use(cors({ origin: normalizeOrigin(process.env.FRONTEND_URL) || process.env.FRONTEND_URL, credentials: true }));
app.use(compression());
// v26: site (ön yüz) aynı alan adından — hız sınırlarından ÖNCE (sayfa varlıkları API kotasını tüketmez)
mountSite(app);
app.use(express.json({ limit: "100kb" })); // aşırı büyük istek gövdelerine karşı
app.use(attackSignatureFilter); // query/path parametrelerinde açık saldırı imzalarını erkenden reddeder

// Genel bir istek sınırlaması — tüm rotalar için taban seviye koruma
// v28: oturum yoklaması (/auth/me, her sayfa açılışında) ve canlı destek yoklaması (3 sn'de bir; kendi dakikalık sınırı var)
// bu ortak kotayı tüketip kullanıcıları SEBEPSİZ oturumdan atıyordu (429 → "çıkış yapıldı" sanılıyordu); kota dışındadırlar.
const SESSION_POLL_PATHS = new Set(["/api/auth/me", "/api/health", "/api/config"]);
const exemptFromBaseLimit = (req) => SESSION_POLL_PATHS.has(req.path);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    skip: exemptFromBaseLimit,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Sert bir "limit aşıldı, reddet" yerine, tekrarlayan isteklerde yanıtı kademeli olarak yavaşlatır —
// otomatik saldırı script'lerini pahalı hale getirir.
//
// v34 DÜZELTMESİ (sitedeki genel yavaşlığın asıl sebebi): bu katman ÜÇ yönden hatalıydı.
//   1) `skip` YOKTU: taban kotadan muaf tutulan oturum yoklaması (/auth/me — her sayfa açılışında) ve
//      canlı destek yoklaması (açıkken 3 saniyede bir, kendi dakikalık sınırı var) bu sayacı dolduruyordu.
//   2) Gecikme TOPLAM istek sayısıyla çarpılıyordu (delayAfter'ı AŞAN kısımla değil): 101. istekte
//      101 × 100 ms = 10 sn hesaplanıyor, tavana takılıp 5 saniyeye iniyordu.
//   3) Eşik (100 istek / 15 dk) gerçek bir kullanıcı için çok düşüktü: canlı destek penceresi açık
//      duran bir ziyaretçi tek başına 15 dakikada 300 istek yapar.
// Sonuç: ~5 dakika sonra HER istek 5 saniye gecikiyordu — canlı destek mesajı, "Değiştir", "Devam et"
// düğmeleri ve her sayfa geçişindeki oturum doğrulaması dahil.
app.use(
  slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 300,                                                  // normal gezinti bu sınırın altında kalır
    delayMs: (used) => Math.min((used - 300) * 100, 1500),            // yalnız AŞAN kısım kadar, en çok 1,5 sn
    maxDelayMs: 1500,
    skip: exemptFromBaseLimit,                                        // oturum yoklaması ve canlı destek hariç
  })
);

// Kimlik doğrulama uçları çok daha hassas — kaba kuvvet denemelerini
// veritabanına ulaşmadan, ağ seviyesinde de yavaşlatıyoruz.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  // v28: ÖNCEDEN GET /auth/me (her sayfa açılışı) da bu 20'lik kotayı tüketiyordu → 20. sayfa gezintisinden sonra 429 →
  // istemci oturumu kapalı sandı ("beklenmedik çıkış", sonra kota dolunca "kendiliğinden giriş"). Salt-okunur oturum
  // yoklaması kota dışıdır; kaba kuvvet korunması giriş/doğrulama uçlarında (hesap/IP sayaçları) sürer.
  skip: (req) => req.method === "GET" && req.path === "/me",
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin." },
});
// v27: API yanıtları varsayılan olarak hiçbir ara katmanda (Vercel CDN, tarayıcı) saklanmaz; herkese açık ve
// kişiye özel olmayan uçlar (ürün listesi, /api/config) kendi Cache-Control değerini ayrıca yazar.
app.use("/api", (req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });
// v71: yönetim API'leri yönetim rolü olmayan HERKESE (misafir, üye) genel 404 döner — hız sınırlayıcılardan ve rotalardan ÖNCE,
// böylece 401/403/429 farkından yönetim alanının varlığı anlaşılmaz. Yetkili yöneticide istek olduğu gibi devam eder
// (requireAuth + requirePanel + requirePerm denetimleri aynen çalışır).
app.use("/api/admin", hideAdminApi);
app.use("/api/auth", authLimiter);

// Admin uçları da ayrı ve daha sıkı bir sınırlamaya tabi — bir admin
// hesabının ele geçirilmiş bir token'la kitlesel işlem yapması zorlaşır.
//
// v44 DÜZELTMESİ ("Çok fazla istek gönderildi" — sayfalar arasında normal kullanım engelleniyordu): tek bir
// 100 istek / 15 dk kotası hem OKUMAYI hem YAZMAYI sayıyordu; panel ise her 30 sn'de ~12 liste isteği + canlı destek
// için 5 sn'de bir yoklama yapıyordu → kota 3–4 dakikada doluyordu. İki düzeltme birlikte yapıldı:
//   1) İstemci: rozetler tek bir /admin/summary isteğinden, listeler yalnız açık sekme için ve önbellekli yüklenir;
//      aynı anda giden aynı GET birleştirilir; 429 alınınca otomatik yenileme kalan süre boyunca durur.
//   2) Sunucu: okuma ve yazma AYRI kotalarda. Yazma (durum değiştiren her işlem) için sınırlı bir kota sürer;
//      okuma kotası normal panel kullanımının rahatça altında, kötüye kullanımın ise üstündedir. Koruma kaldırılmadı.
// Kota aşıldığında yanıt, ne kadar beklenmesi gerektiğini söyler (Retry-After başlığı + retryAfterSec).
const limitHandler = (msg) => (req, res, next, options) => {
  const reset = req.rateLimit && req.rateLimit.resetTime ? Math.max(1, Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)) : Math.ceil(options.windowMs / 1000);
  res.setHeader("Retry-After", String(reset));
  res.status(options.statusCode).json({ error: msg, code: "rate_limited", retryAfterSec: reset });
};
const ADMIN_LIMIT_MSG = "Kısa sürede çok fazla istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.";
const adminReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 900,                 // ~1 istek/sn ortalama — panel artık 15 dakikada ~150–300 okuma yapar
  skip: (req) => req.method !== "GET" && req.method !== "HEAD",
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler(ADMIN_LIMIT_MSG),
});
const adminWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,                 // durum değiştiren yönetici işlemleri (onay, iptal, silme, kupon, stok…): yoğun bir mesaide bile yeter
  skip: (req) => req.method === "GET" || req.method === "HEAD",
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler("Kısa sürede çok fazla yönetici işlemi yapıldı. Güvenlik nedeniyle lütfen birkaç dakika bekleyin."),
});
const adminLimiter = [adminReadLimiter, adminWriteLimiter];
app.use("/api/admin", adminLimiter);

app.use("/api/auth", authRouter);
app.use("/api", twoFactorRouter);
app.use("/api/admin", adminRouter);   // uzman/yönetici paneli (hideAdminApi yukarıda)
app.use("/api", plansRouter);         // /api/plans/* — üyenin kendi yayınlanmış planları
app.use("/api", privacyRouter);       // /api/me/request-delete, /api/me/confirm-delete
app.use("/api", accountRouter);       // /api/account/* (ad/e-posta/şifre değişikliği)
app.use("/api", notificationsRouter); // /api/notifications
app.use("/api", ordersRouter);        // /api/packages, /api/orders/* — paket siparişi (USDT TRC20)
// Canlı destek ve destek talepleri: ayrı ve dar bir hız sınırı (yoklama + mesaj gönderimi). Genel sınırlar da geçerlidir.
app.use("/api/tickets", rateLimit({ windowMs: 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false, message: { error: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin." } }));
app.use("/api", supportRouter);       // /api/tickets/* — destek talepleri
app.use("/api", blogRouter);          // /api/blog — herkese açık blog (yazma: /api/admin/blog)
app.use("/api", profileRouter);       // /api/profile — üyenin koçluk bilgileri

app.get("/api/health", (req, res) => res.json({ ok: true, ...(dbMigrations.state === "ok" ? {} : { db: dbMigrations.state }) }));

// Ön yüzün ihtiyaç duyduğu herkese açık ayarlar (gizli değer İÇERMEZ — reCAPTCHA site anahtarı zaten herkese açıktır)
app.get("/api/config", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json({ recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || "" });
});

// v26: kurulum doğrulaması — yalnız DEBUG_CLIENT_IP=true iken açık (varsayılan KAPALI, 404).
// Uygulamanın sizi hangi adresle gördüğünü gösterir; doğrulama bitince değişkeni silin.
if (process.env.DEBUG_CLIENT_IP === "true") {
  // v66: baseIp + viaCloudflare — REQUIRE_CLOUDFLARE açılmadan önce isteklerin gerçekten Cloudflare'den geldiğini doğrulamak için
  app.get("/api/debug/client-ip", (req, res) => res.json({
    ip: req.ip, baseIp: req.baseIp || null, viaCloudflare: viaCloudflare(req.baseIp || req.ip, req.headers, process.env), edgePeer: edgePeerIp(req.headers), socket: req.socket && req.socket.remoteAddress,
    xForwardedFor: req.headers["x-forwarded-for"] || null, xRealIp: req.headers["x-real-ip"] || null,
    cfConnectingIp: req.headers["cf-connecting-ip"] || null,
  }));
}

// 404 — tanımsız rotalar için
app.use((req, res) => res.status(404).json({ error: "Bulunamadı." }));

// Genel hata yakalayıcı — HİÇBİR ZAMAN ham hata/stack trace istemciye
// sızdırılmaz, sadece sunucu loguna yazılır.
app.use((err, req, res, next) => {
  console.error("[unhandled]", err);
  // M-05 (v4): yanıt ZATEN gönderildikten sonra oluşan bir hata için ikinci
  // bir yanıt göndermeye çalışmak "headers already sent" hatasına yol açar —
  // bu durumda Express'in kendi varsayılan işleyicisine devredilir.
  if (res.headersSent) return next(err);
  // L-13 (v4): istemci hataları (bozuk JSON, çok büyük gövde) doğru 4xx ile,
  // diğer her şey jenerik 500 ile — ham hata mesajı ASLA istemciye gitmez.
  const { status, body } = toErrorResponse(err);
  res.status(status).json(body);
});

// Son bir güvenlik ağı: kodun herhangi bir yerinde yakalanmamış bir hata/reddedilen
// promise olursa, sunucunun TAMAMEN çökmesi yerine bu loglanır ve sunucu ayakta kalır.
// (Bu satırlar olmadan, örneğin mail gönteriminde yakalanmayan tek bir hata bile
// tüm API'yi anlık olarak çökertip 502 hatasına yol açabilirdi — tam da öyle oldu.)
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection] Yakalanmamış promise hatası:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException] Yakalanmamış hata — süreç GÜVENLİ olmadığı için kapatılıyor:", err);
  // Node.js'in kendi dokümantasyonu: uncaughtException sonrası süreç
  // TANIMSIZ, potansiyel olarak bozulmuş bir durumdadır. Loglamadan sonra
  // process.exit(1) ile kontrollü şekilde kapatılır — Railway (veya benzeri
  // platform) bunu algılayıp süreci TEMİZ bir durumda yeniden başlatır.
  // Bozuk bir durumda sonsuza kadar yaşamaya devam etmek (önceki davranış),
  // sessiz veri tutarsızlıklarına yol açabilirdi.
  process.exit(1);
});

// v34 — AÇILIŞTA MİGRATION. Üretimde "npm run db:setup" elle çalıştırılmadığı için veritabanında eksik
// sütun kalabiliyordu; oturum doğrulayıcı her istekte hata alıp 503 dönüyor, kullanıcı sitede gezinirken
// kendiliğinden çıkış yapmış gibi görünüyordu. Artık süreç başlarken bekleyen migration'lar uygulanır.
//   • DB_AUTO_MIGRATE=false  → kapatılır (migration elle yönetilir).
//   • RUN_BACKGROUND_JOBS=false olan api süreci de uygular; worker ile aynı anda çalışsa bile
//     advisory lock sırayı korur, ikincisi bekler.
//   • Hata hâlinde süreç ÇÖKMEZ: site ve herkese açık uçlar ayakta kalır, durum /api/health'te görünür.
let jobsStarted = false;
function startBackgroundJobs() {   // 180 gün veri saklama — migration bittikten sonra, bir kez
  if (jobsStarted || process.env.RUN_BACKGROUND_JOBS === "false") return;
  jobsStarted = true; startDataRetentionJob();
}
export const dbMigrations = { state: "pending", detail: "açılışta uygulanacak" };
async function applyMigrationsOnBoot() {
  if (process.env.DB_AUTO_MIGRATE === "false") {
    dbMigrations.state = "ok"; dbMigrations.detail = "DB_AUTO_MIGRATE=false — elle yönetiliyor";
    console.log("[server] DB_AUTO_MIGRATE=false — açılışta migration çalıştırılmıyor.");
    startBackgroundJobs();
    return;
  }
  try {
    const r = await runMigrations();
    if (r.lockBusy) { dbMigrations.state = "ok"; dbMigrations.detail = "başka bir süreç uyguluyor"; startBackgroundJobs(); return; }
    dbMigrations.state = "ok";
    dbMigrations.detail = r.applied.length ? `${r.applied.length} migration uygulandı` : "güncel";
    if (r.applied.length) console.log(`[server] Veritabanı güncellendi: ${r.applied.join(", ")}`);
    startBackgroundJobs();
  } catch (err) {
    dbMigrations.state = "migration_failed";
    dbMigrations.detail = err.message;
    console.error("[server] MIGRATION BAŞARISIZ — veritabanı güncel değil, oturum ve plan uçları hata verebilir:", err.message);
    console.error("[server] Düzeltmek için: Railway → web servisi → `npm run db:setup` çıktısındaki hatayı giderin.");
  }
}

const PORT = process.env.PORT || 4000;
applyMigrationsOnBoot();
app.listen(PORT, () => {
  console.log(`[server] Alpvefit backend http://localhost:${PORT} üzerinde çalışıyor`);
});
