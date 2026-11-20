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
process.env.PAYMENT_PROVIDER ||= "mock";   // sahte sanal POS (yalnız test)
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
async function load(file, prefix) {
  const s = ROUTES.length; await import(join(root, "src/routes", file)); const e = ROUTES.length;
  // router.use(fn, fn2) → bu aralıktaki TÜM yollara önden uygulanır (Express router katmanı davranışı)
  const pre = []; const routes = [];
  for (let i = s; i < e; i++) { const r = ROUTES[i]; if (r.method === "USE" && typeof r.path === "function") pre.push(r.path, ...r.handlers); else routes.push(r); }
  routes.forEach((r) => { r.handlers = [...pre, ...r.handlers]; });
  prefixes.push([routes, prefix]);
}
await load("auth.js", "/api/auth"); await load("twoFactor.js", "/api"); await load("account.js", "/api"); await load("notifications.js", "/api"); await load("push.js", "/api"); await load("journal.js", "/api");
await load("privacy.js", "/api"); await load("plans.js", "/api"); await load("orders.js", "/api"); await load("profile.js", "/api"); await load("blog.js", "/api"); await load("uploads.js", "/api"); await load("support.js", "/api"); await load("forum.js", "/api"); await load("board.js", "/api"); await load("progress.js", "/api"); await load("friends.js", "/api"); await load("admin.js", "/api/admin");
const { hideAdminApi, panelUser, sessionUser } = await import(join(root, "src/utils/panelSession.js"));
// ekip içerikleri (forum) — sunucudaki gibi açılışta; FORUM_SEED=false ile kapatılır
if (process.env.FORUM_SEED !== "false") { const { seedOfficialContent } = await import(join(root, "src/forum/official.js")); await seedOfficialContent().catch((e) => console.error("[forum] seed:", e.message)); }

function findRoute(method, full) {
  for (const [routes, p] of prefixes) for (const r of routes) {
    if (r.method !== method || typeof r.path !== "string") continue;
    const names = []; const rx = new RegExp("^" + (p + r.path).replace(/:([a-zA-Z]+)/g, (_, n) => { names.push(n); return "([^/]+)"; }) + "$");
    const m = rx.exec(full); if (m) { const params = {}; names.forEach((n, k) => { params[n] = m[k + 1]; }); return { handlers: r.handlers, params }; }
  }
  return null;
}
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".webmanifest": "application/manifest+json" };
function sendFile(res, file, status = 200) { res.writeHead(status, { "content-type": MIME[extname(file)] || "application/octet-stream", "cache-control": "no-store" }); res.end(readFileSync(file)); }
const rawBody = (req) => new Promise((ok) => { const c = []; let n = 0; req.on("data", (d) => { n += d.length; if (n <= 4 * 1024 * 1024 + 1) c.push(d); }); req.on("end", () => ok(Buffer.concat(c))); });
const body = (req) => new Promise((ok) => { const c = []; req.on("data", (d) => c.push(d)); req.on("end", () => { try { ok(JSON.parse(Buffer.concat(c).toString() || "{}")); } catch { ok({}); } }); });

http.createServer(async (rq, rs) => {
  const url = new URL(rq.url, "http://x"); const path = url.pathname.replace(/\/+$/, "") || "/";
  try {
    if (path === "/__mails") { const to = url.searchParams.get("to"); const m = [...mails].reverse().find((x) => !to || x.to === to); rs.writeHead(200, { "content-type": "application/json" }); return rs.end(JSON.stringify(m || null)); }
    if (path === "/__digest") { const { runDigest } = await import("../src/utils/digest.js"); const r = await runDigest(Date.now(), { force: true }); rs.writeHead(200, { "content-type": "application/json" }); return rs.end(JSON.stringify(r)); }
    if (path === "/__flush-plan-mails") { const { flushPlanMails } = await import("../src/utils/planNotify.js"); const n = await flushPlanMails(); rs.writeHead(200, { "content-type": "application/json" }); return rs.end(JSON.stringify({ n })); }
    if (path === "/api/health") { rs.writeHead(200, { "content-type": "application/json" }); return rs.end('{"ok":true}'); }
    if (path === "/api/config") { rs.writeHead(200, { "content-type": "application/json" }); return rs.end('{"recaptchaSiteKey":""}'); }
    if (path.startsWith("/api/")) {
      const method = rq.method; const r = findRoute(method, path); const data = method === "GET" ? {} : /^application\/octet-stream/.test(rq.headers["content-type"] || "") ? await rawBody(rq) : await body(rq);
      if (!r) { rs.writeHead(404, { "content-type": "application/json" }); return rs.end('{"error":"Bulunamadı."}'); }
      const query = Object.fromEntries(url.searchParams);
      const req = { method, body: data, ip: "127.0.0.1", baseIp: "127.0.0.1", headers: rq.headers, originalUrl: rq.url, url: rq.url, path, query, params: r.params };
      const sent = { done: false }; const setCookies = [];
      const res = { statusCode: 200, headersSent: false,
        status(c) { this.statusCode = c; return this; },
        hdr: {}, setHeader(k, v) { if (k.toLowerCase() === "set-cookie") setCookies.push(...[].concat(v)); else this.hdr[k.toLowerCase()] = v; },
        append(k, v) { if (k.toLowerCase() === "set-cookie") setCookies.push(...[].concat(v)); },
        getHeader() { return undefined; }, set() { return this; },
        json(o) { if (sent.done) return this; sent.done = true; const h = { "content-type": "application/json", "cache-control": "no-store" }; if (setCookies.length) h["set-cookie"] = setCookies; rs.writeHead(this.statusCode, h); rs.end(JSON.stringify(o)); return this; },
        end(d) { if (!sent.done) { sent.done = true; rs.writeHead(this.statusCode, this.hdr); rs.end(d); } else if (!rs.writableEnded) rs.end(d); }, send(b) { return this.json(b); },
        // akış (SSE) desteği
        flushHeaders() { if (!sent.done) { sent.done = true; rs.writeHead(this.statusCode, this.hdr); } }, write(d) { if (!sent.done) this.flushHeaders(); return rs.write(d); }, on(ev, fn) { rs.on(ev, fn); return this; } };
      req.on = (ev, fn) => { rq.on(ev, fn); return req; };
      const chain = path.startsWith("/api/admin") ? [hideAdminApi, ...r.handlers] : r.handlers;
      let i = 0; const next = async (err) => {
        if (err) { console.error("[hata]", err.message); return res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." }); }
        const hnd = chain[i++]; if (!hnd) return res.status(404).json({ error: "Bulunamadı." });
        try { await hnd(req, res, next); } catch (e) { next(e); }
      };
      return next();
    }
    // ---- site ----
    if (path === "/admin" || path === "/admin/") { const u = await panelUser({ headers: rq.headers }); if (!u) return (await sessionUser({ headers: rq.headers })) ? sendFile(rs, join(root, "site/404.html"), 404) : sendFile(rs, join(root, "site/index.html")); rs.writeHead(302, { location: "/uzman", "cache-control": "private, no-store" }); return rs.end(); }
    if (path === "/uzman" || path.startsWith("/uzman/")) { const u = await panelUser({ headers: rq.headers }); if (!u) return sendFile(rs, join(root, "site/404.html"), 404); return sendFile(rs, join(root, "site-uzman/index.html")); }
    if (path.startsWith("/assets/uzman/")) { const u = await panelUser({ headers: rq.headers }); const f = join(root, "site-uzman/assets", path.slice(14)); if (!u || !existsSync(f)) { rs.writeHead(404); return rs.end("Not found"); } return sendFile(rs, f); }
    if (["/sw.js", "/manifest.webmanifest", "/offline.html"].includes(path)) return sendFile(rs, join(root, "site", path.slice(1)));
    if (path.startsWith("/assets/")) { const f = join(root, "site", path); if (!f.startsWith(join(root, "site/assets")) || !existsSync(f) || !statSync(f).isFile()) { rs.writeHead(404); return rs.end("Not found"); } return sendFile(rs, f); }
    if (["/", "/giris", "/kayit", "/sifremi-unuttum", "/panel", "/paketler", "/sss", "/hakkimizda", "/blog", "/araclar", "/forum"].includes(path) || path.startsWith("/blog/") || path.startsWith("/araclar/") || path.startsWith("/panel/") || path.startsWith("/yasal/") || path.startsWith("/forum/")) return sendFile(rs, join(root, "site/index.html"));
    return sendFile(rs, join(root, "site/404.html"), 404);
  } catch (e) { console.error("[sunucu]", e); rs.writeHead(500); rs.end("hata"); }
}).listen(PORT, "127.0.0.1", () => origLog("devserver http://127.0.0.1:" + PORT));
