// Yerel geliştirme/test sunucusu: GERÇEK rota kodu (routes/*.js) + GERÇEK PostgreSQL (psql üzerinden) + site dosyaları.
// npm paketleri kurulamayan ortamlarda (tools/authsim/stubs) çalışır; üretimde src/server.js kullanılır. YALNIZ test içindir.
//   node --import ./tools/authsim/register.mjs tools/devserver.mjs   (PORT=8902, SIM_DB=avfsim)
// E-postalar gönderilmez; GET /__mails?to=<adres> son iletinin metnini döndürür (arayüz testleri kodu buradan okur).
process.env.NODE_ENV = "development";
process.env.ENCRYPTION_KEY ||= "test-encryption-key-0123456789abcdef-xyz";
process.env.JWT_SECRET ||= "test-jwt-secret-0123456789abcdef0123456789";
process.env.DATABASE_URL ||= "postgres://local/avfsim";
const PORT = Number(process.env.PORT || 8902);
process.env.FRONTEND_URL = `http://127.0.0.1:${PORT}`;
process.env.SIM_DB ||= "avfsim";
process.env.TRON_WALLET_ADDRESS ||= "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";   // geçerli biçimli test adresi (gerçek değil)
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mails = [];
const origLog = console.log;
console.log = (...a) => {
  const s = a.join(" ");
  if (s.includes("[mail:henüz-yapılandırılmadı]")) { const m = s.match(/Kime: (\S+)[\s\S]*?İçerik:\n([\s\S]*)/); if (m) mails.push({ to: m[1], text: m[2], at: Date.now() }); return; }
  origLog(...a);
};
console.warn = () => {};

const { ROUTES } = await import("express");
const prefixes = [];
const watcher = await import(join(root, "src/services/paymentWatcher.js"));
let fakeConf = 25; watcher._setConfirmationProvider(async () => fakeConf);
async function load(file, prefix) {
  const s = ROUTES.length; await import(join(root, "src/routes", file)); const e = ROUTES.length;
  // router.use(fn, fn2) → bu aralıktaki TÜM yollara önden uygulanır (Express router katmanı davranışı)
  const pre = []; const routes = [];
  for (let i = s; i < e; i++) { const r = ROUTES[i]; if (r.method === "USE" && typeof r.path === "function") pre.push(r.path, ...r.handlers); else routes.push(r); }
  routes.forEach((r) => { r.handlers = [...pre, ...r.handlers]; });
  prefixes.push([routes, prefix]);
}
await load("auth.js", "/api/auth"); await load("twoFactor.js", "/api"); await load("account.js", "/api"); await load("notifications.js", "/api");
await load("privacy.js", "/api"); await load("plans.js", "/api"); await load("orders.js", "/api"); await load("profile.js", "/api"); await load("admin.js", "/api/admin");
const { hideAdminApi, panelUser } = await import(join(root, "src/utils/panelSession.js"));

function findRoute(method, full) {
  for (const [routes, p] of prefixes) for (const r of routes) {
    if (r.method !== method || typeof r.path !== "string") continue;
    const names = []; const rx = new RegExp("^" + (p + r.path).replace(/:([a-zA-Z]+)/g, (_, n) => { names.push(n); return "([^/]+)"; }) + "$");
    const m = rx.exec(full); if (m) { const params = {}; names.forEach((n, k) => { params[n] = m[k + 1]; }); return { handlers: r.handlers, params }; }
  }
  return null;
}
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };
function sendFile(res, file, status = 200) { res.writeHead(status, { "content-type": MIME[extname(file)] || "application/octet-stream", "cache-control": "no-store" }); res.end(readFileSync(file)); }
const body = (req) => new Promise((ok) => { const c = []; req.on("data", (d) => c.push(d)); req.on("end", () => { try { ok(JSON.parse(Buffer.concat(c).toString() || "{}")); } catch { ok({}); } }); });

http.createServer(async (rq, rs) => {
  const url = new URL(rq.url, "http://x"); const path = url.pathname.replace(/\/+$/, "") || "/";
  try {
    if (path === "/__mails") { const to = url.searchParams.get("to"); const m = [...mails].reverse().find((x) => !to || x.to === to); rs.writeHead(200, { "content-type": "application/json" }); return rs.end(JSON.stringify(m || null)); }
    // YALNIZ test: sahte zincir işlemi → gerçek processTransaction. /__chain?hash=<64hex>&amount=<usdt>&conf=<n>
    if (path === "/__chain") { fakeConf = Number(url.searchParams.get("conf") || 25); const amount = Number(url.searchParams.get("amount"));
      await watcher.processTransaction({ transaction_id: url.searchParams.get("hash"), value: String(Math.round(amount * 1e6)), to: process.env.TRON_WALLET_ADDRESS, from: "TFromTestAddr", block_timestamp: Date.now() });
      if (url.searchParams.get("recheck")) await watcher.recheckReviewOrders();
      rs.writeHead(200, { "content-type": "application/json" }); return rs.end("{}"); }
    if (path === "/api/health") { rs.writeHead(200, { "content-type": "application/json" }); return rs.end('{"ok":true}'); }
    if (path === "/api/config") { rs.writeHead(200, { "content-type": "application/json" }); return rs.end('{"recaptchaSiteKey":""}'); }
    if (path.startsWith("/api/")) {
      const method = rq.method; const r = findRoute(method, path); const data = method === "GET" ? {} : await body(rq);
      if (!r) { rs.writeHead(404, { "content-type": "application/json" }); return rs.end('{"error":"Bulunamadı."}'); }
      const query = Object.fromEntries(url.searchParams);
      const req = { method, body: data, ip: "127.0.0.1", baseIp: "127.0.0.1", headers: rq.headers, originalUrl: rq.url, url: rq.url, path, query, params: r.params };
      const sent = { done: false }; const setCookies = [];
      const res = { statusCode: 200, headersSent: false,
        status(c) { this.statusCode = c; return this; },
        setHeader(k, v) { if (k.toLowerCase() === "set-cookie") setCookies.push(...[].concat(v)); },
        append(k, v) { if (k.toLowerCase() === "set-cookie") setCookies.push(...[].concat(v)); },
        getHeader() { return undefined; }, set() { return this; },
        json(o) { if (sent.done) return this; sent.done = true; const h = { "content-type": "application/json", "cache-control": "no-store" }; if (setCookies.length) h["set-cookie"] = setCookies; rs.writeHead(this.statusCode, h); rs.end(JSON.stringify(o)); return this; },
        end() { if (!sent.done) { sent.done = true; rs.writeHead(this.statusCode); rs.end(); } }, send(b) { return this.json(b); } };
      const chain = path.startsWith("/api/admin") ? [hideAdminApi, ...r.handlers] : r.handlers;
      let i = 0; const next = async (err) => {
        if (err) { console.error("[hata]", err.message); return res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." }); }
        const hnd = chain[i++]; if (!hnd) return res.status(404).json({ error: "Bulunamadı." });
        try { await hnd(req, res, next); } catch (e) { next(e); }
      };
      return next();
    }
    // ---- site ----
    if (path === "/uzman" || path.startsWith("/uzman/")) { const u = await panelUser({ headers: rq.headers }); if (!u) return sendFile(rs, join(root, "site/404.html"), 404); return sendFile(rs, join(root, "site-uzman/index.html")); }
    if (path.startsWith("/assets/uzman/")) { const u = await panelUser({ headers: rq.headers }); const f = join(root, "site-uzman/assets", path.slice(14)); if (!u || !existsSync(f)) { rs.writeHead(404); return rs.end("Not found"); } return sendFile(rs, f); }
    if (path.startsWith("/assets/")) { const f = join(root, "site", path); if (!f.startsWith(join(root, "site/assets")) || !existsSync(f) || !statSync(f).isFile()) { rs.writeHead(404); return rs.end("Not found"); } return sendFile(rs, f); }
    if (["/", "/giris", "/kayit", "/sifremi-unuttum", "/panel"].includes(path) || path.startsWith("/panel/")) return sendFile(rs, join(root, "site/index.html"));
    return sendFile(rs, join(root, "site/404.html"), 404);
  } catch (e) { console.error("[sunucu]", e); rs.writeHead(500); rs.end("hata"); }
}).listen(PORT, "127.0.0.1", () => origLog("devserver http://127.0.0.1:" + PORT));
