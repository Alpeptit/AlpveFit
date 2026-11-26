// Yönetim paneli (tarayıcı): Koçluk Üyeleri / Forum Üyeleri ayrımı, üyenin forum içerikleri (kaldır / geri getir),
// forum yasağı ve hesap engeli/yasağı her iki tarafta, Forum Yönetimi sayfasında satır içi şikâyet kuyruğu, yasaklar, kategoriler,
// moderasyon kaydı; duyurularda yalnız yönetim/moderatör yazar. Masaüstü + mobil. Playwright gerekir.
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/admin_forum_ui.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium, devices } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");
const SHOT = process.env.SHOT || "";

const A = await signup("Forum Panel Yonetici", "fpa"), K = await signup("Kocluk Uyesi Deneme", "fpk"), F = await signup("Forum Uyesi Deneme", "fpf"), R = await signup("Sikayet Eden Uye", "fpr"), D = await signup("Moderator Deneme", "fpd");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
sql(`INSERT INTO member_access (member_id, kind) VALUES ('${K.id}', 'nutrition') ON CONFLICT DO NOTHING`);
for (const p of [F, R, D]) await p.c.call("PUT", "/forum/me", { acceptRules: true, healthConsent: true });
sql(`UPDATE forum_profiles SET forum_role='moderator' WHERE user_id='${D.id}'`);
const un = (p) => sql(`SELECT username FROM users WHERE id='${p.id}'`);
const fu = un(F), ku = un(K);
chk("yönetici foruma hiç girmedi (kural onayı yok)", sql(`SELECT count(*) FROM forum_profiles WHERE user_id='${A.id}' AND rules_accepted_at IS NOT NULL`) === "0", null);
let r = await F.c.call("POST", "/board/topics", { category: "beslenme", title: "Panel testi için örnek konu başlığı", body: "Kahvaltıda ne yiyorsunuz arkadaşlar?" });
const tid = r.body.id; chk("forum üyesi konu açar", r.status === 201, r.body);
r = await F.c.call("POST", "/board/t/" + tid + "/posts", { body: "Ben yulaf ve yumurta yiyorum, gayet iyi gidiyor." }); const pid = r.body.id;
r = await F.c.call("POST", "/board/t/" + tid + "/posts", { body: "Şikâyet edilecek örnek yanıt metni buraya yazıldı." }); const rpid = r.body.id;
r = await R.c.call("POST", "/board/posts/" + rpid + "/report", { reason: "spam", note: "alakasız" }); chk("şikâyet alınır", r.status === 201, r.body);

// duyurular: moderatörün açtığı duyuruya üye yazamaz, moderatör yazabilir
r = await D.c.call("POST", "/board/topics", { category: "duyurular", title: "Moderatör duyurusu deneme başlığı", body: "Duyuru metni" });
const aid = r.body.id; chk("moderatör duyuru açar", r.status === 201, r.body);
r = await F.c.call("POST", "/board/t/" + aid + "/posts", { body: "Üye olarak duyuruya yazmaya çalışıyorum." }); chk("üye duyuruya yanıt yazamaz", r.status === 403, r.body);
r = await F.c.call("GET", "/board/t/" + aid); chk("üyeye duyuruda yanıt kutusu kapalı", r.body.canReply === false && /yalnız okunur/.test(r.body.replyBlocked || ""), [r.body.canReply, r.body.replyBlocked]);
r = await D.c.call("POST", "/board/t/" + aid + "/posts", { body: "Moderatör ek bilgi yazıyor duyuruya." }); chk("moderatör duyuruya yazabilir", r.status === 201, r.body);
r = await F.c.call("POST", "/board/topics", { category: "duyurular", title: "Üye duyuru açmayı deniyor burada", body: "x" }); chk("üye duyuru açamaz", r.status === 403, r.body);

const b = await chromium.launch(); const errs = [];
async function ctxOf(p, o) {
  const c = await b.newContext(o || { viewport: { width: 1360, height: 900 } });
  await c.addCookies(Object.entries(p.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
  await c.addInitScript(() => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", JSON.stringify({ c: "ess", v: 2, t: 1 })); } catch (e) {} });
  const q = await c.newPage(); q.on("pageerror", (e) => errs.push(e.message)); q.on("dialog", (d) => d.accept()); return q;
}
const confirmYes = async (q) => { await q.waitForTimeout(250); const y = q.locator(".cdlg button.btn:not(.ghost), [role=dialog] button.btn:not(.ghost)").last(); if (await y.count()) await y.click(); await q.waitForTimeout(700); };
const tabTo = async (q, name) => { await q.locator(`.menu a:has-text("${name}")`).first().click(); await q.waitForTimeout(1100); };
const search = async (q, text) => { await q.locator('.fbar input[type="search"]').first().fill(text); await q.waitForTimeout(1000); };

const q = await ctxOf(A);
await q.goto(BASE + "/uzman"); await q.waitForTimeout(1500);
const menu = await q.locator(".menu a").allInnerTexts();
chk("menüde Koçluk Üyeleri / Forum Üyeleri / Forum Yönetimi ayrı", ["Koçluk Üyeleri", "Forum Üyeleri", "Forum Yönetimi"].every((x) => menu.some((m) => m.includes(x))), menu);
// ---- koçluk üyeleri
await search(q, "Deneme");
let names = await q.locator("tbody tr:not(.mdet) td:first-child b").allInnerTexts();
chk("Koçluk Üyeleri yalnız koçluk üyelerini listeler", names.includes("Kocluk Uyesi Deneme") && !names.includes("Forum Uyesi Deneme"), names);
await q.locator('.fbar select').first().selectOption(""); await q.waitForTimeout(900);
names = await q.locator("tbody tr:not(.mdet) td:first-child b").allInnerTexts();
chk("'Tüm hesaplar' kapsamı herkesi gösterir", names.includes("Forum Uyesi Deneme") && names.includes("Kocluk Uyesi Deneme"), names);
await q.locator('.fbar select').first().selectOption("coaching"); await q.waitForTimeout(900);
await q.locator(`tr:has-text("${ku}") button:has-text("Yönet")`).click(); await q.waitForTimeout(500);
let secs = await q.locator(".mdet:not([hidden]) .msec h4").allInnerTexts();
chk("koçluk tarafı Yönet: yetki, engel/süreli yasak, silme (forum bölümleri yok)", secs.some((x) => /Yetki/.test(x)) && secs.some((x) => /Engelleme/.test(x)) && !secs.some((x) => /Forum/.test(x)), secs);
await q.locator(".mdet:not([hidden]) input[placeholder^='Gerekçe (denetim']").fill("Koçluk tarafı deneme yasağı");
await q.locator(".mdet:not([hidden]) select[aria-label='Süre']").selectOption("12");
await q.locator(".mdet:not([hidden]) button:has-text('Süreli yasakla')").click(); await confirmYes(q);
chk("koçluk tarafında süreli hesap yasağı uygulanır", sql(`SELECT locked_reason FROM users WHERE id='${K.id}'`) === "admin_ban", sql(`SELECT locked_reason FROM users WHERE id='${K.id}'`));
await q.locator(`tr:has-text("${ku}") button.unban`).click(); await confirmYes(q);
chk("koçluk tarafında tek tıkla yasak kaldırılır", sql(`SELECT coalesce(locked_reason,'') FROM users WHERE id='${K.id}'`) === "", null);

// ---- forum üyeleri
await tabTo(q, "Forum Üyeleri"); await search(q, "Deneme");
names = await q.locator("tbody tr:not(.mdet) td:first-child b").allInnerTexts();
chk("Forum Üyeleri yalnız foruma girenleri listeler", names.includes("Forum Uyesi Deneme") && !names.includes("Kocluk Uyesi Deneme"), names);
chk("moderatör rozeti görünür", /Moderatör/.test(await q.locator(`tr:has-text("@${un(D)}")`).first().innerText()), null);
await q.locator(`tr:has-text("@${fu}") button:has-text("İçerikler")`).click(); await q.waitForTimeout(900);
let ct = await q.locator(".mdet:not([hidden]) .fcont").innerText();
chk("İçerikler: üyenin konusu ve mesajları satır içinde", /Panel testi için örnek konu/.test(ct) && /yulaf ve yumurta/.test(ct) && /1 açık şikâyet/.test(ct), ct.slice(0, 400));
await q.locator(".mdet:not([hidden]) li:has-text('yulaf ve yumurta') button:has-text('Kaldır')").click(); await q.waitForTimeout(500);
chk("gerekçesiz kaldırma engellenir", /gerekçesi yazın/.test(await q.locator(".mdet:not([hidden]) .fcont").innerText()) && sql(`SELECT hidden_at IS NULL FROM forum_posts WHERE id='${pid}'`) === "t", null);
await q.locator(".mdet:not([hidden]) input[aria-label='Kaldırma gerekçesi']").fill("Panelden deneme kaldırma");
await q.locator(".mdet:not([hidden]) li:has-text('yulaf ve yumurta') button:has-text('Kaldır')").click(); await q.waitForTimeout(900);
chk("mesaj panelden kaldırılır (üyeye bildirim)", sql(`SELECT hidden_at IS NOT NULL FROM forum_posts WHERE id='${pid}'`) === "t" && sql(`SELECT count(*) FROM notifications WHERE user_id='${F.id}' AND text LIKE 'Mesajınız kurallara aykırı%'`) !== "0", null);
await q.locator(".mdet:not([hidden]) li:has-text('yulaf ve yumurta') button:has-text('Geri getir')").click(); await q.waitForTimeout(900);
chk("mesaj geri getirilir", sql(`SELECT hidden_at IS NULL FROM forum_posts WHERE id='${pid}'`) === "t", null);
if (SHOT) await q.screenshot({ path: SHOT + "/afu-content-d.png", fullPage: true });
await q.locator(`tr:has-text("@${fu}") button:has-text("Yönet")`).click(); await q.waitForTimeout(600);
secs = await q.locator(".mdet:not([hidden]) .msec h4").allInnerTexts();
chk("forum tarafı Yönet: seviye, forum yasağı, forum kimliği, hesap engeli", secs.some((x) => /Forum seviyesi/.test(x)) && secs.some((x) => /Forum yasağı/.test(x)) && secs.some((x) => /Forum kimliği/.test(x)) && secs.some((x) => /Engelleme/.test(x)) && !secs.some((x) => /Yetki/.test(x)), secs);
await q.locator(".mdet:not([hidden]) input[aria-label='Forum yasağı gerekçesi']").fill("Kurallara aykırı paylaşım");
await q.locator(".mdet:not([hidden]) select[aria-label='Forum yasağı süresi']").selectOption("24");
await q.locator(".mdet:not([hidden]) button:has-text('Forumdan uzaklaştır')").click(); await confirmYes(q);
const bu = sql(`SELECT extract(epoch FROM banned_until - now())::int FROM forum_profiles WHERE user_id='${F.id}'`);
chk("forum yasağı (1 gün) uygulanır", Number(bu) > 23 * 3600 && Number(bu) <= 24 * 3600, bu);
chk("listede forum durumu 'Süreli uzaklaştırıldı'", /Süreli uzaklaştırıldı/.test(await q.locator(`tr:has-text("@${fu}")`).first().innerText()), null);
r = await F.c.call("POST", "/board/t/" + tid + "/posts", { body: "Yasaklıyken yazmayı deniyorum burada." }); chk("forum yasaklı üye yazamaz ama giriş yapabilir", r.status === 403 && r.body.code === "forum_banned" && (await F.c.call("GET", "/auth/me")).status === 200, r.body);
await q.locator(`tr:has-text("@${fu}") button:has-text("Yönet")`).click(); await q.waitForTimeout(600);
await q.locator(".mdet:not([hidden]) input[placeholder^='Gerekçe (denetim']").fill("Forum tarafı hesap engeli deneme");
await q.locator(".mdet:not([hidden]) button:has-text('Engelle')").first().click(); await confirmYes(q);
chk("forum tarafında hesap engeli uygulanır", sql(`SELECT locked_reason FROM users WHERE id='${F.id}'`) === "admin_block", null);
await q.locator(`tr:has-text("@${fu}") button.unban`).click().catch(() => {}); await confirmYes(q);
chk("forum tarafında hesap engeli kaldırılır", sql(`SELECT coalesce(locked_reason,'') FROM users WHERE id='${F.id}'`) === "", sql(`SELECT locked_reason FROM users WHERE id='${F.id}'`));

// ---- forum yönetimi (satır içi; sayfadan çıkılmaz)
await tabTo(q, "Forum Yönetimi");
chk("Forum Yönetimi: sekmeler (şikâyet, yasak, kategori, kayıt, ölçüm)", (await q.locator(".ftab").count()) === 5, await q.locator(".ftab").allInnerTexts());
let rq = await q.locator(".frep").first().innerText().catch(() => "");
chk("şikâyet kuyruğu panelde satır içi (yönlendirme yok)", new URL(q.url()).pathname === "/uzman" && /Şikâyet edilecek örnek yanıt/.test(rq) && /Spam veya alakasız/.test(rq), rq.slice(0, 300));
if (SHOT) await q.screenshot({ path: SHOT + "/afu-reports-d.png", fullPage: true });
await q.locator(".frep input[aria-label='Gerekçe']").first().fill("Konu dışı içerik");
await q.locator(".frep button:has-text('Haklı bul')").first().click(); await confirmYes(q);
chk("şikâyet haklı bulunur, içerik kaldırılır", sql(`SELECT status FROM forum_reports WHERE post_id='${rpid}'`) === "upheld" && sql(`SELECT hidden_at IS NOT NULL FROM forum_posts WHERE id='${rpid}'`) === "t", null);
chk("açık şikâyet kalmadı", /Açık şikâyet yok/.test(await q.locator(".fseg + div").innerText()), null);
await q.locator(".ftab:has-text('Forum yasakları')").click(); await q.waitForTimeout(900);
chk("yasaklar sekmesi yürürlükteki yasağı listeler", /@/.test(await q.locator("table").last().innerText()) && (await q.locator("table").last().innerText()).includes("@" + fu), null);
await q.locator(`tr:has-text("@${fu}") button:has-text("Yasağı kaldır")`).click(); await confirmYes(q);
chk("forum yasağı panelden kaldırılır", sql(`SELECT banned_until IS NULL AND NOT ban_permanent FROM forum_profiles WHERE user_id='${F.id}'`) === "t", null);
await q.locator(".ftab:has-text('Kategoriler')").click(); await q.waitForTimeout(1000);
const cat = q.locator(".acc:has-text('Beslenme')").first();
await cat.locator("button").first().click(); await q.waitForTimeout(300);
await cat.locator("textarea[aria-label='Kategori duyurusu']").fill("Panelden eklenen kategori notu");
await cat.locator("button:has-text('Kaydet')").click(); await q.waitForTimeout(900);
chk("kategori ayarı panelden kaydedilir", sql(`SELECT notice FROM forum_categories WHERE slug='beslenme'`) === "Panelden eklenen kategori notu", sql(`SELECT notice FROM forum_categories WHERE slug='beslenme'`));
sql(`UPDATE forum_categories SET notice=NULL WHERE slug='beslenme'`);
await q.locator(".ftab:has-text('Moderasyon kaydı')").click(); await q.waitForTimeout(900);
const lg = await q.locator(".mlog").innerText();
chk("moderasyon kaydı: haklı bulma, yasak ve kaldırma görünür", /Şikâyet haklı bulundu/.test(lg) && /Forumdan uzaklaştırma/.test(lg) && /Mesaj kaldırıldı/.test(lg), lg.slice(0, 300));
await q.locator(".ftab:has-text('Ölçümler')").click(); await q.waitForTimeout(900);
chk("ölçümler sekmesi", /Forum ölçümleri/.test(await q.locator("main").innerText()), null);
chk("tüm işlemlerde adres /uzman olarak kaldı", new URL(q.url()).pathname === "/uzman", q.url());

// ---- mobil
const m = await ctxOf(A, { ...devices["iPhone 13"] });
await m.goto(BASE + "/uzman"); await m.waitForTimeout(1400);
for (const t of ["Forum Üyeleri", "Forum Yönetimi"]) {
  await m.locator(`.menu a:has-text("${t}")`).first().click(); await m.waitForTimeout(1200);
  if (t === "Forum Üyeleri") { await m.locator('.fbar input[type="search"]').first().fill(fu); await m.waitForTimeout(900); await m.locator(`tr:has-text("@${fu}") button:has-text("İçerikler")`).click(); await m.waitForTimeout(900); }
  const ov = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  chk(`[mobil] ${t}: yatay taşma yok`, ov <= 1, ov);
  if (SHOT) await m.screenshot({ path: SHOT + `/afu-${t === "Forum Üyeleri" ? "members" : "mgmt"}-m.png`, fullPage: true });
}
chk("sayfa hatası yok", errs.length === 0, errs.slice(0, 3));
await b.close();
finish();
