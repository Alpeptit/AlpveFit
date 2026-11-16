import { pool } from "../db/pool.js";

// Basit bir "web application firewall" katmanı. Parametrize sorgular SQL
// enjeksiyonunu, sanitizeText() ise saklı XSS'i zaten engelliyor — bu katman
// EK bir güvenlik önlemi: belirgin saldırı imzalarını erken fark edip
// isteği hiç route'a ulaştırmadan reddeder, loglar VE tekrar edilirse o
// IP'yi kalıcı olarak banlar.
//
// ÖNEMLİ: Bu filtre SADECE query/path parametrelerine uygulanır, istek
// GÖVDESİNE (body) uygulanmaz. Çünkü şifre alanları kuralımız gereği
// noktalama işareti İÇERMEK ZORUNDA (örn. "--", "#" içeren bir şifre
// tamamen geçerlidir) — body'yi taramak, geçerli şifreleri/mesajları
// yanlışlıkla reddedebilir. Body zaten parametrize sorgular ve
// sanitizeText() ile ayrıca korunuyor.

const SQLI_PATTERNS = [
  /(\bunion\b.{0,20}\bselect\b)/i,
  /(\bor\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+)/i, // OR 1=1
  /(;\s*drop\s+table)/i,
];

const XSS_PATTERNS = [
  /<script[\s>]/i,
  /on\w+\s*=\s*["'].*["']/i, // onerror="...", onclick="..." vb.
  /javascript:/i,
];

const PATH_TRAVERSAL_PATTERNS = [/\.\.\//, /\.\.\\/];

// Bir IP, kısa sürede kaç kez saldırı imzası tetiklerse kalıcı olarak banlanır
const WAF_STRIKE_LIMIT = 5;
const WAF_BAN_MS = 60 * 60 * 1000; // v67: 1 saat (eskiden 24 saat) — paylaşılan NAT/operatör adreslerinde yan etkiyi sınırlar

// v67 GÜVENLİK (M2): Bir strike (IP yasağına sayılan ihlal) YALNIZCA isteğin, saldırganın KENDİ
// doğrudan isteği olduğu durumlarda sayılır. Tarayıcının başka bir sitede/e-postada yüklediği
// çapraz-köken bir GET (ör. <img src="https://alpvefit.com/api/health?x=javascript:">) ya da aynı
// kökenli bir kaynak yüklemesi (img/script/style), KURBANIN tarayıcısı tarafından tetiklenir —
// bunlar "saldırganın API'yi zorlaması" değildir ve eskiden kurbanın gerçek IP'sini (hatta paylaşılan
// bir NAT adresini) 24 saat banlayabiliyordu. Artık böyle istekler yine ENGELLENİR (400) ama IP'ye
// strike YAZILMAZ. Doğrudan saldırgan istekleri (Sec-Fetch-* başlıkları olmayan curl/tarayıcı dışı
// araçlar, veya same-origin XHR) strike almaya devam eder.
function shouldCountStrike(req) {
  const site = String(req.headers["sec-fetch-site"] || "").toLowerCase();
  if (site === "cross-site" || site === "same-site") return false;   // tarayıcı: başka köken tetikledi
  const dest = String(req.headers["sec-fetch-dest"] || "").toLowerCase();
  if (dest && dest !== "empty" && dest !== "document") return false;  // kaynak yüklemesi (img/script/style/...)
  return true;
}

// C-07 (final sertleştirme listesi) düzeltmesi: ÖNCEDEN kod hem
// req.query'yi hem req.params'ı taradığını İDDİA EDİYORDU. Ama bu
// middleware, TÜM route router'larından ÖNCE (app.use ile, global olarak)
// mount edildiği için — Express'in mimarisinde req.params, bir route
// PATTERN'i (örn. "/orders/:id") eşleşene KADAR hiç doldurulmaz. Bu
// noktada henüz hiçbir router çalışmadığı için req.params HER ZAMAN {}
// idi — yani bu kontrol hiçbir zaman hiçbir şey yakalamıyordu, sahte bir
// güvenlik hissi veriyordu.
//
// GERÇEK ÇÖZÜM: path parametrelerini bu global middleware seviyesinde
// taramak, her route'a özel middleware eklemeyi gerektirir (büyük bir
// refactor). Bunun yerine, path parametrelerinin güvenliği zaten İKİ
// BAĞIMSIZ, GERÇEKTEN ÇALIŞAN katmanla sağlanıyor: (1) SQL enjeksiyonu —
// tüm sorgular parametrize ($1, $2...), path parametresi hiçbir zaman ham
// string olarak SQL'e eklenmiyor; (2) her route, kendi path parametresini
// (genelde bir UUID) açıkça doğruluyor (örn. UUID_RE.test(req.params.id)) —
// saldırı imzası biçimindeki bir değer bu doğrulamadan zaten geçemez.
// req.query TARANMAYA devam ediyor — bu, middleware sırasından bağımsız
// çalışır (Express query string'i router eşleşmesinden ÖNCE ayrıştırır).
function containsAttackSignature(value) {
  if (typeof value !== "string") return false;
  const allPatterns = [...SQLI_PATTERNS, ...XSS_PATTERNS, ...PATH_TRAVERSAL_PATTERNS];
  return allPatterns.some((pattern) => pattern.test(value));
}

function scanObject(obj, depth = 0) {
  if (depth > 5 || obj == null) return false; // çok derin nesnelerle DoS denemesine karşı sınır
  if (typeof obj === "string") return containsAttackSignature(obj);
  if (Array.isArray(obj)) return obj.some((item) => scanObject(item, depth + 1));
  if (typeof obj === "object") return Object.values(obj).some((v) => scanObject(v, depth + 1));
  return false;
}

// C-08 (final sertleştirme listesi) düzeltmesi: ÖNCEDEN bu middleware HER
// TEK istekte bir veritabanı SELECT'i yapıyordu — bir saldırı akınında bu,
// DoS'u web sunucusundan veritabanına TAŞIYIP BÜYÜTÜR (veritabanı, web
// sunucusundan çok daha kısıtlı/ölçeklendirilmesi zor bir kaynaktır). Bir
// ban 24 saat sürdüğü ve saniyede binlerce kez değişmediği için, kısa
// ömürlü (30 saniye) bir bellek içi önbellek DoS direncini önemli ölçüde
// artırır — yeni bir Redis/harici önbellek altyapısı gerektirmeden.
const banCache = new Map(); // ip -> { bannedUntil: Date|null, cachedAt: number }
const BAN_CACHE_TTL_MS = 30 * 1000;

async function isIpCurrentlyBanned(ip) {
  const cached = banCache.get(ip);
  if (cached && Date.now() - cached.cachedAt < BAN_CACHE_TTL_MS) {
    return cached.bannedUntil && new Date(cached.bannedUntil) > new Date();
  }
  const { rows } = await pool.query(
    `SELECT banned_until FROM rate_limit_state WHERE identifier = $1 AND action = 'waf_violation'`,
    [ip]
  );
  const bannedUntil = rows[0]?.banned_until || null;
  banCache.set(ip, { bannedUntil, cachedAt: Date.now() });
  return bannedUntil && new Date(bannedUntil) > new Date();
}

export async function attackSignatureFilter(req, res, next) {
  try {
    // Önce: bu IP zaten WAF ihlalleri yüzünden banlı mı? (C-08: artık önbellekli)
    if (await isIpCurrentlyBanned(req.ip)) {
      return res.status(403).json({ error: "Bu IP adresi güvenlik ihlalleri nedeniyle geçici olarak engellendi." });
    }

    const suspicious = scanObject(req.query);
    if (!suspicious) return next();

    console.warn(`[waf] Şüpheli istek engellendi: ${req.method} ${req.path} — IP: ${req.ip}`);

    // v67 (M2): çapraz-köken / kaynak yüklemesi olan istekler engellenir ama IP'ye strike yazılmaz (kurbanı banlama vektörü kapatıldı).
    if (!shouldCountStrike(req)) {
      return res.status(400).json({ error: "Geçersiz istek içeriği." });
    }

    const { rows: strikeRows } = await pool.query(
      `INSERT INTO rate_limit_state (identifier, action, fail_count, updated_at)
       VALUES ($1, 'waf_violation', 1, now())
       ON CONFLICT (identifier, action)
       DO UPDATE SET fail_count = rate_limit_state.fail_count + 1, updated_at = now()
       RETURNING fail_count`,
      [req.ip]
    );
    if (strikeRows[0].fail_count >= WAF_STRIKE_LIMIT) {
      const bannedUntil = new Date(Date.now() + WAF_BAN_MS);
      await pool.query(
        `UPDATE rate_limit_state SET banned_until = $2 WHERE identifier = $1 AND action = 'waf_violation'`,
        [req.ip, bannedUntil]
      );
      banCache.set(req.ip, { bannedUntil, cachedAt: Date.now() }); // C-08: önbelleği hemen güncelle, 30sn beklemeye gerek yok
      console.warn(`[waf] IP kalıcı olarak banlandı (24 saat): ${req.ip}`);
    }

    return res.status(400).json({ error: "Geçersiz istek içeriği." });
  } catch (err) {
    // Veritabanı bu kontrol sırasında ulaşılamaz olursa, isteği tamamen
    // reddetmek yerine (kullanılabilirliği bozmamak için) devam ettiriyoruz —
    // ama durumu logluyoruz ki fark edilsin.
    console.error("[waf] Kontrol sırasında hata, istek engellenmeden devam ediyor:", err.message);
    next();
  }
}
