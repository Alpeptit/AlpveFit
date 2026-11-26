// GÜVENLİK SENARYOLARI (son sürümlerde eklenen uçlar): yetki matrisi (oturumsuz / üye / atanmamış uzman / uzman / yönetici),
// başka üyenin verisine erişim (IDOR), CSRF (belirteçsiz ve yabancı kökenli istek), geçersiz kimlik / gövde, ölçüm uçlarına sahte kayıt,
// forum içeriğindeki HTML'in yönetim panelinde çalıştırılamaması (şikâyet listesi), yanıtlarda gizli alan sızmaması.
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/security.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE, Client } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");

const A = await signup("Guvenlik Yonetici", "sga"), C = await signup("Guvenlik Uzman", "sgc"), C2 = await signup("Guvenlik Uzman Iki", "sgd");
const M = await signup("Guvenlik Uye", "sgm"), X = await signup("Guvenlik Yabanci", "sgx");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
for (const p of [C, C2]) { sql(`UPDATE users SET role='coach', plan_kinds='{nutrition}' WHERE id='${p.id}'`); await enableTotp(p); }
sql(`INSERT INTO coach_clients (coach_id, member_id, delivery) VALUES ('${C.id}', '${M.id}', 'online')`);
sql(`INSERT INTO member_access (member_id, kind) VALUES ('${M.id}', 'nutrition') ON CONFLICT DO NOTHING`);
await M.c.call("PUT", "/journal/entries", { date: new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10), weight: 80, note: "gizli not" });
await M.c.call("PUT", "/journal/share", { coach: true });
const anon = new Client();

// ---- 1) yetki matrisi: yeni yönetim uçları
const matrix = [
  ["GET", "/admin/due-plans", { anon: 401, member: 403, coach: 200, admin: 200 }],
  ["GET", `/admin/clients/${M.id}/journal`, { anon: 401, member: 403, coach: 200, coach2: 404, admin: 200 }],
  ["GET", "/admin/analytics?days=7", { anon: 401, member: 403, coach: 403, admin: 200 }],
  ["PATCH", `/admin/orders/00000000-0000-0000-0000-000000000000/delivery`, { anon: 401, member: 403, coach: 403 }],
];
const who = { anon, member: M.c, coach: C.c, coach2: C2.c, admin: A.c };
for (const [m, p, exp] of matrix) for (const [k, code] of Object.entries(exp)) {
  const r = await who[k].call(m, p, m === "PATCH" ? { status: "delivered" } : undefined);
  // oturumsuz ve yetkisiz isteklerde yönetim API'si varlığını da gizler (404) — 401/403/404 kabul
  const okc = code === 403 || code === 401 ? [401, 403, 404].includes(r.status) : r.status === code;
  chk(`yetki: ${m} ${p.replace(/[0-9a-f-]{36}/, ":id")} → ${k} ${code}`, okc, r.status);
}
// ---- 2) IDOR / gizli alan sızıntısı
let r = await C.c.call("GET", `/admin/clients/${M.id}/journal`);
chk("uzman yanıtında not, e-posta, fotoğraf yok", r.body.shared && !JSON.stringify(r.body).match(/gizli not|@example|photo|note/), r.body);
r = await C.c.call("GET", "/admin/clients/not-a-uuid/journal"); chk("geçersiz kimlik 404 (hata ayrıntısı yok)", r.status === 404 && !/stack|SQL|syntax/i.test(JSON.stringify(r.body)), r);
r = await C.c.call("GET", `/admin/clients/${X.id}/journal`); chk("uzman atanmamış üyenin verisini göremez (404)", r.status === 404, r.status);
r = await X.c.call("GET", "/journal"); chk("üye başkasının ölçülerini görmez", r.body.entries.length === 0, r.body.entries.length);
r = await C.c.call("GET", "/admin/due-plans"); chk("uzman teslim listesi yalnız kendi üyeleri", r.body.every((o) => o.member_id === M.id), r.body.map((o) => o.member_id));
// ---- 3) CSRF ve köken
r = await M.c.call("PUT", "/journal/share", { coach: false }, { csrf: false });
chk("CSRF belirteci olmadan paylaşım değiştirilemez", r.status === 403 && sql(`SELECT journal_share_coach FROM users WHERE id='${M.id}'`) === "t", r);
let f = await fetch(BASE + "/api/journal/share", { method: "PUT", headers: { "content-type": "application/json", cookie: M.c.cookieHeader(), origin: "https://kotu.example", "x-csrf-token": M.c.jar.avf_csrf }, body: JSON.stringify({ coach: false }) });
chk("yabancı kökenden paylaşım değiştirilemez", f.status === 403 && sql(`SELECT journal_share_coach FROM users WHERE id='${M.id}'`) === "t", f.status);
r = await M.c.call("PUT", "/journal/share", { coach: "true" }); chk("tür denetimi: metin 'true' kabul edilmez", r.status === 400, r.status);
// ---- 4) ölçüm uçları: sahte / bozuk kayıt
sql(`DELETE FROM site_events`);
const post = (path, body, h = {}) => fetch(BASE + "/api/analytics/" + path, { method: "POST", headers: { "content-type": "text/plain", origin: BASE, ...h }, body });
for (const [name, body] of [["bozuk JSON", "{x"], ["SQL denemesi", JSON.stringify({ sid: "a".repeat(31) + "'", event: "order" })], ["büyük harf sid", JSON.stringify({ sid: "A".repeat(32), event: "order" })],
  ["tanımsız adım", JSON.stringify({ sid: "a".repeat(32), event: "order'; DROP TABLE site_events;--" })], ["dizi gövde", "[1,2]"]]) {
  f = await post("event", body); chk("huni adımı reddedilir: " + name, f.status === 204, f.status);
}
// gövde boyutu sınırı (1 KB) üretim sunucusunun gövde ayrıştırıcısındadır; birim testi: tests/security.test.js
f = await fetch(BASE + "/api/analytics/event", { method: "POST", headers: { "content-type": "text/plain" }, body: JSON.stringify({ sid: "a".repeat(32), event: "order" }) });
chk("köken başlığı olmayan adım reddedilir", f.status === 403, f.status);
chk("hiçbir sahte adım kaydedilmedi; tablo yerinde", sql(`SELECT count(*) FROM site_events`) === "0", null);
f = await post("hit", JSON.stringify({ sid: "a".repeat(32), path: "/uzman/x", ms: 5000 })); chk("yönetim yolu ölçülmez", f.status === 204 && sql(`SELECT count(*) FROM page_views WHERE path LIKE '/uzman%'`) === "0", f.status);
// ---- 5) koç asistanı: yetkisiz kullanım
r = await anon.call("POST", "/assistant/messages", { text: "merhaba nasılsın" }); chk("asistan: oturumsuz kullanılamaz", [401, 403].includes(r.status), r.status);
r = await X.c.call("POST", "/assistant/messages", { text: "kalori hesabı nasıl yapılır" }); chk("asistan: koçluk üyesi olmayan kullanamaz", [403, 503].includes(r.status), r.status);
// ---- 6) forum içeriğindeki HTML yönetim panelinde çalışmaz (şikâyet listesi)
for (const p of [M, X]) await p.c.call("PUT", "/forum/me", { acceptRules: true, healthConsent: true });
const payload = `Merhaba arkadaşlar <img src="/xss-probe.png" onerror="window.__xss=1"> deneme mesajı`;
r = await M.c.call("POST", "/board/topics", { category: "beslenme", title: "Güvenlik deneme konusu başlığı", body: payload });
const tid = r.body && (r.body.id || (r.body.topic && r.body.topic.id));
const pid = tid ? sql(`SELECT id FROM forum_posts WHERE topic_id = '${tid}' AND is_first`) : null;
if (pid) await X.c.call("POST", `/board/posts/${pid}/report`, { reason: "spam", note: "deneme" });
chk("deneme konusu açıldı ve şikâyet edildi", !!pid && sql(`SELECT count(*) FROM forum_reports WHERE post_id = '${pid}'`) !== "0", r);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1360, height: 900 } });
await ctx.addCookies(Object.entries(A.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
await ctx.addInitScript(() => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", JSON.stringify({ c: "ess", v: 2, t: 1 })); } catch (e) {} });
const q = await ctx.newPage(); const probes = []; const errs = [];
q.on("request", (rq) => { if (rq.url().includes("xss-probe")) probes.push(rq.url()); }); q.on("pageerror", (e) => errs.push(e.message));
await q.goto(BASE + "/uzman"); await q.waitForTimeout(1400);
await q.locator('.menu a:has-text("Forum Yönetimi")').click(); await q.waitForTimeout(1200);
await q.locator('button:has-text("Şikâyet kuyruğu")').first().click().catch(() => {}); await q.waitForTimeout(1600);
const quote = await q.locator(".frep-b").first().innerText().catch(() => "");
chk("şikâyet listesinde içerik düz metin olarak görünür", quote.includes("deneme mesajı"), quote);
chk("içerikteki HTML çalışmaz: görsel isteği yok, betik çalışmadı", probes.length === 0 && (await q.evaluate(() => window.__xss)) === undefined, probes);
// sayfa CSP'si (satır içi betik kapalı) üretim sunucusunda: tests/security.test.js
chk("sayfa hatası yok", errs.length === 0, errs.slice(0, 3));
await b.close();
finish();
