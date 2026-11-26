// Ziyaret analizi + sayfa geçişleri (tarayıcı): çerez bildirimi 2. sürüm (Yalnız gerekli / Kabul et), ölçüm yalnız izinle,
// görünür süre + gezinti yolu, üye bağlantısı, gizli kimlik ve yönetim alanı ölçülmez, başka köken reddedilir, yönetim tablosu (yalnız Tam yetki);
// panelde yeni erişim yenilemeden görünür, yeni sürüm yayınlanınca sonraki geçiş tam yüklemedir, geri tuşunda (bfcache) oturum tazelenir.
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/analytics.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium, devices } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");
const SHOT = process.env.SHOT || "";

sql(`DELETE FROM page_views`);
const M = await signup("Analiz Uye Deneme", "anm"), A = await signup("Analiz Yonetici", "ana"), C = await signup("Analiz Uzman", "anc");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
sql(`UPDATE users SET role='coach' WHERE id='${C.id}'`); await enableTotp(C);
const hits = () => JSON.parse(sql(`SELECT coalesce(json_agg(p ORDER BY id), '[]') FROM page_views p`));
const b = await chromium.launch(); const errs = [];
async function ctxOf(p, o, consent) {
  const c = await b.newContext(o || { viewport: { width: 1360, height: 900 } });
  if (p) await c.addCookies(Object.entries(p.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
  await c.addInitScript((cs) => { try { localStorage.setItem("avf_lang", "tr"); if (cs) localStorage.setItem("avf_cookie", cs); } catch (e) {} }, consent || null);
  const q = await c.newPage(); q.on("pageerror", (e) => errs.push(e.message)); q.on("dialog", (d) => d.accept()); return q;
}
const clickTo = async (q, href, wait = 1300) => { await q.evaluate((hr) => { const a = [...document.querySelectorAll(`a[href="${hr}"]`)][0]; if (a) a.click(); else window.AVF.go(hr); }, href); await q.waitForTimeout(wait); };

// 1) eski (1. sürüm) onay → bildirim yeniden; Yalnız gerekli → ölçüm yok
let q = await ctxOf(null, null, "1700000000000");
await q.goto(BASE + "/"); await q.waitForTimeout(1500);
const bt = await q.locator(".ck button").allInnerTexts();
chk("eski onayla bildirim yeniden çıkar: 'Yalnız gerekli' + 'Kabul et'", bt.join("|") === "Yalnız gerekli|Kabul et", bt);
chk("bildirim ölçümü açıklar (kendi sunucumuz, IP yok)", /kendi sunucumuzda ölçeriz/.test(await q.locator(".ck").innerText()) && /IP kaydı tutulmaz/.test(await q.locator(".ck").innerText()), null);
await q.locator(".ck-ess").click(); await q.waitForTimeout(300);
await clickTo(q, "/paketler"); await clickTo(q, "/sss"); await clickTo(q, "/"); await q.evaluate(() => document.dispatchEvent(new Event("visibilitychange"))); await q.close(); await new Promise((r) => setTimeout(r, 600));
chk("'Yalnız gerekli' → hiç ölçüm kaydı yok", hits().length === 0, hits());

// 2) Kabul et → sırayla sayfalar ve süreler
q = await ctxOf(null, null, null);
await q.goto(BASE + "/"); await q.waitForTimeout(1500);
await q.locator(".ck-yes").click(); await q.waitForTimeout(1300);
await clickTo(q, "/paketler?x=gizli", 1500); await clickTo(q, "/sss", 1400); await clickTo(q, "/forum", 1200);
let h = hits(); let paths = h.map((x) => x.path);
chk("'Kabul et' → ziyaret edilen sayfalar sırayla, sorgu dizesi yok", paths.slice(0, 3).join() === "/,/paketler,/sss", paths);
chk("süreler ölçüldü (≥ 1 sn), tek oturum, ilk kaynak doğrudan sonra site içi", h.slice(0, 3).every((x) => x.ms >= 1000) && new Set(h.map((x) => x.sid)).size === 1 && h[0].ref === "direct" && h.slice(1, 3).every((x) => x.ref === "internal"), h.slice(0, 3));
const n1 = hits().length;
await q.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); document.dispatchEvent(new Event("visibilitychange")); });
await q.waitForTimeout(400); const n2 = hits().length; await q.waitForTimeout(2200);
await q.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" }); document.dispatchEvent(new Event("visibilitychange")); });
await q.waitForTimeout(500);
await q.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }); document.dispatchEvent(new Event("visibilitychange")); }); await q.waitForTimeout(400);
h = hits();
chk("sekme gizlenince süre gönderilir; arka planda geçen süre sayılmaz", n2 === n1 + 1 && h.length === n2 + 1 && h[h.length - 1].ms < 1500, h.slice(-2).map((x) => x.ms));
await q.close();

// 3) üye: kayıt hesaba bağlanır; özel mesaj karşı tarafı gizli; başka köken reddedilir
q = await ctxOf(M, null, JSON.stringify({ c: "all", v: 2, t: 1 }));
await q.goto(BASE + "/panel"); await q.waitForTimeout(1500);
await clickTo(q, "/panel/arkadaslar/ayse.k", 1300); await clickTo(q, "/panel/hesap", 1200); await clickTo(q, "/", 600);
h = hits().filter((x) => x.user_id === M.id).map((x) => x.path);
chk("üye girişliyken kayıtlar üyeye bağlı; özel mesaj karşı tarafı saklanmaz", h.includes("/panel") && h.includes("/panel/arkadaslar/…") && !JSON.stringify(hits()).includes("ayse.k"), h);
await q.close();
let r = await fetch(BASE + "/api/analytics/hit", { method: "POST", headers: { "content-type": "text/plain", origin: "https://kotu.example" }, body: JSON.stringify({ sid: "b".repeat(32), path: "/", ms: 5000 }) });
chk("başka siteden gelen ölçüm reddedilir (403)", r.status === 403, r.status);
r = await fetch(BASE + "/api/analytics/hit", { method: "POST", headers: { "content-type": "text/plain" }, body: JSON.stringify({ sid: "b".repeat(32), path: "/", ms: 5000 }) });
chk("köken başlığı olmayan ölçüm reddedilir", r.status === 403, r.status);
r = await fetch(BASE + "/api/analytics/hit", { method: "POST", headers: { "content-type": "text/plain", origin: BASE }, body: JSON.stringify({ sid: "b".repeat(32), path: "/uzman/gizli", ms: 5000 }) });
chk("yönetim yolu kaydedilmez", r.status === 204 && !hits().some((x) => x.path.startsWith("/uzman")), r.status);

// 4) yönetim tablosu
const ad = await ctxOf(A);
await ad.goto(BASE + "/uzman"); await ad.waitForTimeout(1400);
await ad.locator('.menu a:has-text("Ziyaret Analizi")').click(); await ad.waitForTimeout(1500);
const t = await ad.locator("main").innerText();
chk("Ziyaret Analizi: özet, sayfalar, üyeler, gezinti yolu", ["Görüntülenme", "Sayfalar — nerede ne kadar vakit geçirildi", "Üyeler — kim ne kadar vakit geçirdi", "Son oturumlar — nasıl gezindi", "Analiz Uye Deneme", "/paketler"].every((k) => t.includes(k)), t.slice(0, 600));
await ad.locator('.fseg [data-days="30"]').click(); await ad.waitForTimeout(900);
chk("dönem değişimi (30 gün)", await ad.locator('.fseg [data-days="30"]').getAttribute("aria-pressed") === "true", null);
chk("yönetim sayfası ölçülmez", !hits().some((x) => /^\/(uzman|admin)/.test(x.path)), null);
if (SHOT) await ad.screenshot({ path: SHOT + "/an-d.png", fullPage: true });
const md = await ctxOf(A, { ...devices["iPhone 13"] }); await md.goto(BASE + "/uzman"); await md.waitForTimeout(1300);
await md.locator('.menu a:has-text("Ziyaret Analizi")').click(); await md.waitForTimeout(1400);
const ov = await md.evaluate(() => document.documentElement.scrollWidth - innerWidth);
chk("[mobil] Ziyaret Analizi yatay taşma yok", ov <= 1, ov);
if (SHOT) await md.screenshot({ path: SHOT + "/an-m.png", fullPage: true });
r = await C.c.call("GET", "/admin/analytics"); chk("uzman (Tam yetki değil) analiz API'sine erişemez", r.status === 403 || r.status === 404, r.status);
r = await M.c.call("GET", "/admin/analytics"); chk("üye analiz API'sine erişemez", r.status === 404 || r.status === 403, r.status);

// 5) sayfa geçişleri: yeni erişim yenilemeden görünür; yeni sürümde tam yükleme; bfcache dönüşü
q = await ctxOf(M, null, JSON.stringify({ c: "ess", v: 2, t: 1 }));
await q.goto(BASE + "/panel"); await q.waitForTimeout(1500);
chk("erişim yokken plan bölümleri kilitli", await q.locator(".ovk.off").count() === 5, await q.locator(".ovk.off").count());
sql(`INSERT INTO member_access (member_id, kind) VALUES ('${M.id}', 'nutrition') ON CONFLICT DO NOTHING`);
await q.evaluate(() => { window.__keep = 1; });
await clickTo(q, "/panel/hesap", 900); await q.evaluate(() => {}); await q.waitForTimeout(31000);
await clickTo(q, "/panel", 2200);
chk("yeni verilen erişim sayfa yenilemeden görünür (SPA içinde)", await q.locator(".ovk.off").count() === 4 && await q.evaluate(() => window.__keep === 1), await q.locator(".ovk.off").count());
// yeni sürüm: index.html'deki sürüm farklı görünürse sonraki geçiş tam yükleme
await q.route(BASE + "/", (route) => route.fulfill({ status: 200, contentType: "text/html", body: '<script src="/assets/avf-app.js?v=yenisurum123"></script>' }));
await q.evaluate(() => window.AVF._checkBuild()); await q.waitForTimeout(800); await q.unroute(BASE + "/");
await clickTo(q, "/sss", 1800);
chk("yeni sürüm yayınlanınca sonraki geçiş tam sayfa yüklemesi (eski kod kalmaz)", new URL(q.url()).pathname === "/sss" && await q.evaluate(() => window.__keep) === undefined, await q.evaluate(() => window.__keep));
await q.close();

const g = await ctxOf(null, null, JSON.stringify({ c: "ess", v: 2, t: 1 }));
await g.goto(BASE + "/sss"); await g.waitForTimeout(1200);
await g.goto(BASE + "/paketler"); await g.waitForTimeout(800);
await g.context().addCookies(Object.entries(M.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
await g.goBack(); await g.waitForTimeout(2200);
const st = await g.evaluate(() => ({ p: location.pathname, u: !!(window.AVF.session && window.AVF.session.user) }));
chk("geri tuşuyla dönülen sayfa oturumu güncel gösterir", st.p === "/sss" && st.u, st);
chk("sayfa hatası yok", errs.length === 0, errs.slice(0, 3));
await b.close();
finish();
