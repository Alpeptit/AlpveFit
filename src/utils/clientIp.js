// v26 — Cloudflare arkasında gerçek ziyaretçi IP'si.
//
// SORUN: Site Cloudflare (turuncu bulut) arkasına alındığında zincir şöyle olur:
//   ziyaretçi → Cloudflare kenar sunucusu → Railway kenar sunucusu → uygulama
// Express'in "trust proxy" ayarı yalnız özel ağ adreslerini (Railway iç ağı) güvenilir sayar; bu yüzden
// req.ip, ziyaretçinin değil CLOUDFLARE KENAR SUNUCUSUNUN adresi olur. Sonuç: tüm ziyaretçiler birkaç
// Cloudflare adresini paylaşır → hız sınırları herkesi birlikte kilitler, WAF yasağı bir Cloudflare
// adresine düşerse SİTE HERKESE KAPANIR.
//
// ÇÖZÜM: TRUST_CLOUDFLARE=true iken, isteği uygulamaya ileten adres Cloudflare'in YAYIMLANMIŞ adres
// aralıklarındaysa, Cloudflare'in yazdığı CF-Connecting-IP başlığı kullanılır. Adres Cloudflare'e ait
// değilse (ör. biri Cloudflare'i atlayıp doğrudan *.up.railway.app adresine istek atarsa) başlık YOK
// SAYILIR — sahte CF-Connecting-IP ile hız sınırı atlatılamaz.
//
// Cloudflare adres listesi: https://www.cloudflare.com/ips/ (nadiren değişir). Değişirse kod
// değiştirmeden CLOUDFLARE_IPS ile (virgülle ayrılmış CIDR listesi) güncellenebilir.
// v27 — Vercel ön yüzü (test/yayın): site Vercel'de, /api/* istekleri Vercel "external rewrite" ile Railway'e iletilir.
//   ziyaretçi → Vercel kenar sunucusu → Railway → uygulama
// Vercel her yönlendirilen isteğe ziyaretçinin adresini x-real-ip olarak yazar; ayrıca vercel.json'daki dönüşüm
// (transforms) ile GİZLİ bir x-origin-secret başlığı ekler. Uygulama:
//   • ORIGIN_SECRET tanımlıysa /api isteklerinde bu başlığı zamanlamaya dayanıklı karşılaştırmayla doğrular;
//     başlığı olmayan/yanlış olan (Vercel'i atlayıp doğrudan Railway adresine gelen) istek 403 alır.
//   • TRUST_VERCEL=true iken ve gizli başlık DOĞRUYSA x-real-ip ziyaretçi adresi kabul edilir.
//     Gizli başlık yoksa x-real-ip YOK SAYILIR (sahte başlıkla hız sınırı atlatılamaz).
import net from "node:net";
import crypto from "node:crypto";

export const CLOUDFLARE_DEFAULT_RANGES = [
  // IPv4
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22", "141.101.64.0/18",
  "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20", "197.234.240.0/22", "198.41.128.0/17",
  "162.158.0.0/15", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
  // IPv6
  "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32",
  "2a06:98c0::/29", "2c0f:f248::/32",
];

/** "::ffff:1.2.3.4" → "1.2.3.4"; boşlukları atar; geçersizse null. */
export function normalizeIp(v) {
  if (typeof v !== "string") return null;
  let s = v.trim();
  if (s.toLowerCase().startsWith("::ffff:") && net.isIPv4(s.slice(7))) s = s.slice(7);
  return net.isIP(s) ? s : null;
}

export function buildRangeList(ranges) {
  const bl = new net.BlockList();
  let n = 0;
  for (const r of ranges) {
    const [addr, bits] = String(r).trim().split("/");
    const type = net.isIPv6(addr) ? "ipv6" : net.isIPv4(addr) ? "ipv4" : null;
    const prefix = Number(bits);
    if (!type || !Number.isInteger(prefix) || prefix < 0 || prefix > (type === "ipv4" ? 32 : 128)) continue;
    bl.addSubnet(addr, prefix, type);
    n++;
  }
  return { list: bl, count: n };
}

let cached = null;
function cloudflareList(env) {
  const key = env.CLOUDFLARE_IPS || "";
  if (cached && cached.key === key) return cached.list;
  const custom = key.split(",").map((x) => x.trim()).filter(Boolean);
  const { list, count } = buildRangeList(custom.length ? custom : CLOUDFLARE_DEFAULT_RANGES);
  // geçersiz bir özel liste Cloudflare desteğini sessizce kapatmasın: varsayılana dön
  cached = { key, list: count ? list : buildRangeList(CLOUDFLARE_DEFAULT_RANGES).list };
  return cached.list;
}

export function isCloudflareIp(ip, env = process.env) {
  const a = normalizeIp(ip);
  if (!a) return false;
  return cloudflareList(env).check(a, net.isIPv6(a) ? "ipv6" : "ipv4");
}

/** ORIGIN_SECRET (virgülle birden çok değer: anahtar değişimi sırasında eski+yeni) ile x-origin-secret karşılaştırması. */
export function originSecretOk(headers, env = process.env) {
  const secrets = String(env.ORIGIN_SECRET || "").split(",").map((x) => x.trim()).filter((x) => x.length >= 32);
  if (!secrets.length) return false;
  const raw = headers && headers["x-origin-secret"];
  const got = Buffer.from(String(Array.isArray(raw) ? raw[0] : raw || ""));
  let ok = false;
  for (const sec of secrets) {
    const want = Buffer.from(sec);
    if (got.length === want.length && crypto.timingSafeEqual(got, want)) ok = true;
  }
  return ok;
}

/**
 * Saf fonksiyon (test edilir). baseIp: Express'in trust proxy ile bulduğu adres (req.ip).
 * Cloudflare desteği kapalıysa ya da istek Cloudflare'den gelmiyorsa baseIp aynen döner.
 */
// v67 — Railway kenarı (CANLIDA ölçüldü, 30 Ekim 2026): Railway, X-Forwarded-For ve X-Real-IP'yi kendisi YAZAR (ziyaretçinin
// gönderdiği kopyaları ezer). Cloudflare arkasında zincir şöyle görüldü:
//   X-Forwarded-For: "<Cloudflare kenar adresi>, <Railway'in kendi ara adresi>"   X-Real-IP: <ziyaretçi>
// Express'in req.ip'si en sağdaki güvenilmeyen adresi, yani Railway'in ara adresini verir: TÜM ziyaretçiler tek adres paylaşır
// (IP başına hız sınırları ve giriş bekleme merdiveni herkesi birlikte etkiler). Çözüm: Railway'de (RAILWAY_ENVIRONMENT
// tanımlıyken) ziyaretçi adresi X-Real-IP'den alınır; "Cloudflare'den mi geldi" kararı X-Forwarded-For'un EN SOLDAKİ
// (Railway'in gördüğü bağlanan adres) değerine bakar. Kapatmak için TRUST_RAILWAY_REAL_IP=false.
export function edgePeerIp(headers) {
  const raw = headers && headers["x-forwarded-for"];
  return normalizeIp(String(Array.isArray(raw) ? raw[0] : raw || "").split(",")[0]);
}
function onRailway(env) { return Boolean(env.RAILWAY_ENVIRONMENT) && env.TRUST_RAILWAY_REAL_IP !== "false"; }

// L-01 (v67 güvenlik denetimi) — Railway'in yazdığı X-Real-IP YALNIZCA istek gerçekten Railway'in iç ağ
// vekili üzerinden geldiğinde (bağlanan soket adresi ÖZEL/iç aralıktaysa) güvenilir sayılır. Normal Railway
// işletiminde bağlanan adres her zaman özeldir; bu denetim, Node süreci ileride (platform değişikliği/yanlış
// yapılandırma) doğrudan internete açılırsa herhangi birinin "X-Real-IP: <istediği>" ile kaynak adresini taklit
// edip IP başına tüm sınırları (giriş merdiveni, misafir sohbet, sıfırlama, WAF) atlamasını engeller.
const PRIVATE_RANGES = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.0/8", "100.64.0.0/10", "169.254.0.0/16", "::1/128", "fc00::/7", "fe80::/10"];
const privateList = buildRangeList(PRIVATE_RANGES).list;
export function isPrivateIp(ip) {
  const a = normalizeIp(ip);
  if (!a) return false;
  return privateList.check(a, net.isIPv6(a) ? "ipv6" : "ipv4");
}

/** İstek Cloudflare'den mi geldi? baseIp Cloudflare adresiyse ya da (Railway'de) Railway'in yazdığı en soldaki adres Cloudflare'inse. */
export function viaCloudflare(baseIp, headers, env = process.env) {
  if (isCloudflareIp(baseIp, env)) return true;
  return onRailway(env) && isCloudflareIp(edgePeerIp(headers), env);
}

export function resolveClientIp(baseIp, headers, env = process.env, peerIp = undefined) {
  const base = normalizeIp(baseIp) || baseIp;
  if (env.TRUST_VERCEL === "true" && originSecretOk(headers, env)) {
    const rv = headers["x-real-ip"];
    const v = normalizeIp(Array.isArray(rv) ? rv[0] : rv);
    if (v) return v;
  }
  if (env.TRUST_CLOUDFLARE === "true" && viaCloudflare(base, headers, env)) {
    const raw = headers && headers["cf-connecting-ip"];
    const cf = normalizeIp(Array.isArray(raw) ? raw[0] : raw);
    if (cf) return cf;
  }
  // L-01 (v67): X-Real-IP yalnız bağlanan adres (peerIp) iç/özel aralıktaysa — yani istek gerçekten Railway'in
  // iç vekilinden geldiyse — kabul edilir. peerIp verilmemişse (eski çağrı / test) eski davranış korunur.
  if (onRailway(env) && (peerIp === undefined || isPrivateIp(peerIp))) {
    const rr = headers && headers["x-real-ip"];
    const v = normalizeIp(Array.isArray(rr) ? rr[0] : rr);
    if (v) return v;
  }
  return base;
}

/** Express ara katmanı: req.ip'yi gerçek ziyaretçi adresiyle değiştirir (hız sınırı, WAF, denetim kaydı). */
export function clientIpMiddleware(req, res, next) {
  req.baseIp = req.ip;   // v66: çeviriden ÖNCEKİ adres (uygulamaya bağlanan kenar sunucu) — kurulum doğrulaması için
  const ip = resolveClientIp(req.ip, req.headers, process.env, req.socket && req.socket.remoteAddress);
  if (ip && ip !== req.ip) Object.defineProperty(req, "ip", { value: ip, configurable: true, enumerable: true });
  next();
}

/** v27: ORIGIN_SECRET tanımlıysa /api isteklerinin Vercel üzerinden geldiğini doğrular (sağlık denetimi hariç). */
// v27 düzeltmesi (bağımsız inceleme): Express yolları büyük/küçük harfe duyarsızdır ("/API/auth/login" da API'ye
// ulaşır) → koruma yol önekine bakmaz; sağlık denetimi DIŞINDAKİ HER istek gizli başlığı taşımalıdır.
// (ORIGIN_SECRET tanımlıyken site de yalnız Vercel üzerinden sunulur; Railway adresi doğrudan kullanılmaz.)
export function originGuardMiddleware(req, res, next) {
  if (!process.env.ORIGIN_SECRET) return next();
  if (req.path.toLowerCase().replace(/\/+$/, "") === "/api/health") return next();
  if (originSecretOk(req.headers, process.env)) return next();
  res.status(403).json({ error: "Erişim reddedildi." });
}

/**
 * v66 (güvenlik denetimi) — İSTEĞE BAĞLI "yalnız Cloudflare üzerinden" kuralı. REQUIRE_CLOUDFLARE=true (ve TRUST_CLOUDFLARE=true)
 * iken, uygulamaya Cloudflare'in yayımlanmış adreslerinden GELMEYEN her istek 403 alır. Neden: site Cloudflare arkasında olsa da
 * Railway'in kendi adresi (*.up.railway.app) ve Railway kenar sunucusu doğrudan da erişilebilir; doğrudan gelen biri Cloudflare'in
 * WAF / bot / hız kurallarını atlar. Sağlık denetimi (/api/health) muaftır (Railway iç denetimi). VARSAYILAN KAPALI.
 * Saf karar fonksiyonu test edilir; baseIp, Express'in trust proxy ile bulduğu (Cloudflare'e çevrilmeden ÖNCEKİ) adrestir.
 */
export function cloudflareOnlyBlocked(baseIp, path, env = process.env, headers = undefined) {
  if (env.REQUIRE_CLOUDFLARE !== "true" || env.TRUST_CLOUDFLARE !== "true") return false;
  if (String(path || "").toLowerCase().replace(/\/+$/, "") === "/api/health") return false;
  return !viaCloudflare(baseIp, headers, env);
}

/** clientIpMiddleware'den ÖNCE bağlanmalı (o, req.ip'yi ziyaretçi adresiyle değiştirir). */
export function cloudflareOnlyMiddleware(req, res, next) {
  if (!cloudflareOnlyBlocked(req.ip, req.path, process.env, req.headers)) return next();
  res.status(403).type("text/plain").send("Forbidden");
}
