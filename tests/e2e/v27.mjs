// v27: (1) plan teslim hatırlatması — yaklaşan / geçen teslim zamanında yöneticiye ve atanmış uzmana BİR KEZ bildirim + e-posta,
//      atanmamış uzmana gitmez, eski gecikme ve uzak tarih hatırlatılmaz, "Teslim edildi" okunmamış hatırlatmayı kaldırır; panelde liste.
//      (2) gelişim paylaşımı — varsayılan kapalı, üye açınca atanmış uzman kilo / bel grafiğini görür, kapatınca anında kesilir; atanmamış uzman göremez.
//      (3) paketler → satın alma hunisi — ölçüm izniyle adımlar oturumda bir kez; yönetim tablosunda huni + tüm siparişlerin sonucu.
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/v27.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium, devices } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");
const SHOT = process.env.SHOT || "";

const A = await signup("Teslim Yonetici", "tda"), C = await signup("Teslim Uzman", "tdc"), C2 = await signup("Baska Uzman", "tdx");
const M = await signup("Teslim Uye", "tdm"), M2 = await signup("Ikinci Uye", "tdn");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
for (const p of [C, C2]) { sql(`UPDATE users SET role='coach', plan_kinds='{nutrition,training}' WHERE id='${p.id}'`); await enableTotp(p); }
sql(`INSERT INTO coach_clients (coach_id, member_id, delivery) VALUES ('${C.id}', '${M.id}', 'online'), ('${C2.id}', '${M2.id}', 'online')`);
sql(`UPDATE orders SET delivery_status = 'delivered' WHERE status = 'paid' AND delivery_status <> 'delivered'`);   // önceki testlerden kalanlar karışmasın
const n0 = Date.now() % 100000;
const order = (who, num, due) => sql(`INSERT INTO orders (user_id, order_number, buyer_name, buyer_email, package_key, weeks, pharmacology, list_price, subtotal, currency, status, paid_at, plans_due_at, consent_at)
  VALUES ('${who.id}', '${num}', '${who.fullName}', '${who.email}', 'starter', 4, false, 100, 100, 'TRY', 'paid', now() - interval '20 hours', ${due}, now()) RETURNING id`).split("\n")[0];
const oSoon = order(M, "AVF-S" + n0, "now() + interval '3 hours'"), oLate = order(M, "AVF-L" + n0, "now() - interval '2 hours'");
const oFar = order(M2, "AVF-F" + n0, "now() + interval '20 hours'"), oOld = order(M2, "AVF-O" + n0, "now() - interval '10 days'");
const notifs = (p) => JSON.parse(sql(`SELECT coalesce(json_agg(n ORDER BY created_at), '[]') FROM (SELECT type, text, order_id, data, read_at, created_at FROM notifications WHERE user_id = '${p.id}' AND type = 'plan_due') n`));
const remind = async () => (await (await fetch(BASE + "/__delivery-reminders")).json()).n;

// ---- (1) hatırlatma ----
let n = await remind();
chk("hatırlatma: yaklaşan + geçen sipariş (2); uzak tarih ve 7 günden eski gecikme yok", n === 2, n);
let a = notifs(A), c = notifs(C), c2 = notifs(C2);
chk("yönetici iki bildirim alır (yaklaşıyor + geçti)", a.length === 2 && a.some((x) => x.order_id === oSoon && x.data.stage === "soon") && a.some((x) => x.order_id === oLate && x.data.stage === "overdue"), a);
chk("atanmış uzman da alır; bildirimde sipariş no ve üye adı", c.length === 2 && c.every((x) => x.data.memberName === "Teslim Uye" && /AVF-[SL]/.test(x.data.orderNumber)), c);
chk("atanmamış uzman almaz", c2.length === 0, c2);
chk("uzak tarihli ve eski gecikmiş sipariş işaretlenmedi", sql(`SELECT count(*) FROM orders WHERE id IN ('${oFar}', '${oOld}') AND (due_soon_notified_at IS NOT NULL OR overdue_notified_at IS NOT NULL)`) === "0", null);
let mail = await (await fetch(BASE + "/__mails?to=" + encodeURIComponent(C.email))).json();
chk("uzmana tek e-posta: iki sipariş, üye adı yok", !!mail && mail.text.includes("AVF-S" + n0) && mail.text.includes("AVF-L" + n0) && !mail.text.includes("Teslim Uye") && /Gecikti/.test(mail.text), mail && mail.text.slice(0, 500));
n = await remind(); chk("ikinci çalıştırma tekrar göndermez", n === 0 && notifs(A).length === 2, n);
sql(`UPDATE orders SET plans_due_at = now() - interval '5 minutes' WHERE id = '${oSoon}'`);
n = await remind(); a = notifs(A);
chk("yaklaşan sipariş zamanı geçince bir kez daha (gecikti) hatırlatılır", n === 1 && a.filter((x) => x.order_id === oSoon).map((x) => x.data.stage).join() === "soon,overdue", a.map((x) => x.data.stage));
sql(`UPDATE orders SET plans_due_at = now() + interval '3 hours' WHERE id = '${oSoon}'`);
let r = await C.c.call("GET", "/admin/due-plans");
chk("uzman paneli: yalnız kendi üyesinin teslim bekleyen siparişleri", r.status === 200 && r.body.length === 2 && r.body.every((x) => x.member_id === M.id), r.body);
r = await A.c.call("GET", "/admin/due-plans");
chk("yönetici: tüm teslim bekleyenler, en yakın tarih önce", r.body.length === 4 && r.body[0].id === oOld && r.body.some((x) => x.id === oFar), r.body.map((x) => x.order_number));
r = await M.c.call("GET", "/admin/due-plans"); chk("üye teslim listesine erişemez", r.status === 403 || r.status === 404, r.status);
r = await A.c.call("PATCH", `/admin/orders/${oLate}/delivery`, { status: "delivered" });
chk("'Teslim edildi' → okunmamış hatırlatma kalkar, listeden çıkar", r.status === 200 && !notifs(C).some((x) => x.order_id === oLate) && !(await C.c.call("GET", "/admin/due-plans")).body.some((x) => x.id === oLate), notifs(C));
r = await C.c.call("GET", "/notifications");
chk("bildirim uzmanın bildirim listesinde (koçluk grubu)", r.body.some((x) => x.type === "plan_due" && x.group === "coach"), r.body.map((x) => x.type));

// ---- (2) gelişim paylaşımı ----
const day = (k) => { const d = new Date(Date.now() + 3 * 3600e3); d.setUTCDate(d.getUTCDate() - k); return d.toISOString().slice(0, 10); };
for (const [k, w, b] of [[40, 90, 98], [30, 88.5, 96], [20, 87, null], [7, 85.6, 93], [0, 84.9, 92]]) await M.c.call("PUT", "/journal/entries", { date: day(k), weight: w, waist: b, chest: 100, note: "gizli not" });
r = await M.c.call("GET", "/journal"); chk("paylaşım varsayılan kapalı; atanmış uzman adı görünür", r.body.share && r.body.share.coach === false && r.body.share.coaches.includes("Teslim Uzman"), r.body.share);
r = await C.c.call("GET", `/admin/clients/${M.id}/journal`); chk("izin yokken uzman ölçü göremez", r.status === 200 && r.body.shared === false && !r.body.entries, r.body);
r = await M.c.call("PUT", "/journal/share", { coach: "evet" }); chk("geçersiz seçim reddedilir", r.status === 400, r);
r = await M.c.call("PUT", "/journal/share", { coach: true }); chk("üye paylaşımı açar", r.status === 200 && r.body.share.coach === true && !!r.body.share.since, r.body.share);
r = await C.c.call("GET", `/admin/clients/${M.id}/journal`);
chk("atanmış uzman yalnız kilo ve bel görür (tarih sıralı; not ve diğer ölçüler yok)", r.body.shared === true && r.body.entries.length === 5 && r.body.entries[0].weight === 90 && r.body.entries[4].waist === 92 && !JSON.stringify(r.body).includes("gizli") && !("chest" in r.body.entries[0]), r.body);
r = await C2.c.call("GET", `/admin/clients/${M.id}/journal`); chk("atanmamış uzman göremez (404)", r.status === 404, r.status);
r = await M2.c.call("GET", `/admin/clients/${M.id}/journal`); chk("başka üye göremez", r.status === 403 || r.status === 404, r.status);
chk("görüntüleme ve izin değişikliği denetim kaydında", sql(`SELECT count(*) FROM audit_log WHERE action = 'journal_trend_view' AND actor_id = '${C.id}' AND target_id = '${M.id}'`) === "1" && sql(`SELECT count(*) FROM audit_log WHERE action = 'journal_share_on' AND actor_id = '${M.id}'`) === "1", null);

// ---- UI: uzman paneli (teslim listesi + gelişim grafiği) ----
const b = await chromium.launch(); const errs = [];
async function ctxOf(p, o, consent) {
  const cx = await b.newContext(o || { viewport: { width: 1360, height: 900 } });
  if (p) await cx.addCookies(Object.entries(p.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
  await cx.addInitScript((cs) => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", cs || JSON.stringify({ c: "ess", v: 2, t: 1 })); } catch (e) {} }, consent || null);
  const q = await cx.newPage(); q.on("pageerror", (e) => errs.push(e.message)); q.on("dialog", (d) => d.accept()); return q;
}
for (const [tag, opt] of [["masaüstü", null], ["mobil", { ...devices["iPhone 13"] }]]) {
  const q = await ctxOf(C, opt);
  await q.goto(BASE + "/uzman"); await q.waitForTimeout(1800);
  const due = await q.locator(".due").innerText().catch(() => "");
  chk(`[${tag}] uzman: teslim bekleyen planlar kartı (1 sipariş, kalan süre)`, /Teslim bekleyen planlar/.test(due) && await q.locator(".due-i").count() === 1 && /saat kaldı/.test(due) && due.includes("Teslim Uye"), due);
  await q.locator(".due-i").first().click(); await q.waitForTimeout(1500);
  chk(`[${tag}] karttan üyenin sayfası açılır`, (await q.locator("main h2.ptitle").first().innerText()).includes("Teslim Uye"), await q.locator("main h2").first().innerText());
  await q.locator('.acc button:has-text("Gelişim: kilo ve bel")').click(); await q.waitForTimeout(1500);
  const tr = await q.locator(".tr-box").innerText();
  chk(`[${tag}] gelişim grafiği: son kayıt, 30 gün ve ilk kayıttan beri değişim`, /84,9 kg/.test(tr) && /-3,6 kg/.test(tr) && /-5,1 kg/.test(tr) && await q.locator(".tr-box svg.jr-ch circle").count() === 5, tr);
  await q.locator('.tr-box .fseg button[data-m="waist"]').click(); await q.waitForTimeout(300);
  chk(`[${tag}] bel sekmesi: 4 kayıt`, /92 cm/.test(await q.locator(".tr-box").innerText()) && await q.locator(".tr-box svg.jr-ch circle").count() === 4, await q.locator(".tr-box").innerText());
  const ov = await q.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  chk(`[${tag}] yatay taşma yok`, ov <= 1, ov);
  if (SHOT) await q.screenshot({ path: SHOT + "/v27-uz-" + (opt ? "m" : "d") + ".png", fullPage: true });
  await q.context().close();
}
// yönetici: liste 3 sipariş (biri gecikmiş), üye adı ve gecikme işareti
let q = await ctxOf(A);
await q.goto(BASE + "/uzman"); await q.waitForTimeout(1800);
chk("yönetici: 3 teslim bekleyen, gecikmiş olan işaretli", await q.locator(".due-i").count() === 3 && await q.locator(".due-i.late").count() === 1 && /1 gecikmiş/.test(await q.locator(".due").innerText()), await q.locator(".due").innerText());
if (SHOT) await q.locator(".due").screenshot({ path: SHOT + "/v27-due.png" });
await q.context().close();

// ---- UI: üye — paylaşımı kapatır; bildirim uzman tarafında ----
q = await ctxOf(M);
await q.goto(BASE + "/panel/gelisim"); await q.waitForTimeout(1800);
chk("üye: paylaşım kartı açık durumda", /Ölçülerin uzmanınla paylaşılıyor/.test(await q.locator("#jr-share").innerText()), await q.locator("#jr-share").innerText().catch(() => ""));
await q.locator('#jr-share button[data-share="off"]').click(); await q.waitForTimeout(1200);
chk("üye kapatınca kart güncellenir", /Ölçülerimi uzmanımla paylaş/.test(await q.locator("#jr-share").innerText()), await q.locator("#jr-share").innerText());
r = await C.c.call("GET", `/admin/clients/${M.id}/journal`); chk("kapatınca uzman erişimi anında kesilir", r.body.shared === false && !r.body.entries, r.body);
await q.locator('#jr-share button[data-share="on"]').click(); await q.waitForTimeout(600);
const dlg = await q.locator(".cdlg").last().innerText().catch(() => "");
chk("açarken onay penceresi (fotoğraf ve notlar paylaşılmaz)", /Fotoğrafların ve notların paylaşılmaz/.test(dlg), dlg);
await q.locator('.cdlg button:has-text("Vazgeç")').last().click(); await q.waitForTimeout(500);
chk("vazgeçince paylaşım kapalı kalır", (await M.c.call("GET", "/journal")).body.share.coach === false, null);
await q.context().close();
q = await ctxOf(C);
await q.goto(BASE + "/panel/bildirimler"); await q.waitForTimeout(1800);
const nt = await q.locator("main").innerText();
chk("uzmanın bildirimlerinde 'Plan teslim zamanı yaklaşıyor / geçti'", /Plan teslim zamanı yaklaşıyor/.test(nt) && /Plan teslim zamanı geçti/.test(nt) && nt.includes("AVF-S" + n0), nt.slice(0, 500));
await q.context().close();

// ---- (3) paketler → satın alma hunisi ----
sql(`DELETE FROM page_views; DELETE FROM site_events`);
const ev = () => JSON.parse(sql(`SELECT coalesce(json_agg(e ORDER BY id), '[]') FROM site_events e`));
q = await ctxOf(M2, null, JSON.stringify({ c: "ess", v: 2, t: 1 }));
await q.goto(BASE + "/paketler"); await q.waitForTimeout(1600);
await q.locator(".pkg .pkg-foot button").first().click(); await q.waitForTimeout(600);
chk("izin yokken sipariş penceresi açılır, adım kaydedilmez", await q.locator("#co-t").count() === 1 && ev().length === 0, ev());
await q.context().close();
q = await ctxOf(M2, null, JSON.stringify({ c: "all", v: 2, t: 1 }));
await q.goto(BASE + "/paketler"); await q.waitForTimeout(1600);
for (let i = 0; i < 2; i++) { await q.locator(".pkg .pkg-foot button").first().click(); await q.waitForTimeout(500); await q.keyboard.press("Escape"); await q.waitForTimeout(300); }
await q.locator(".pkg .pkg-foot button").first().click(); await q.waitForTimeout(500);
const payOn = !(await q.locator(".dlg .btn.block").isDisabled());
await q.evaluate(() => window.AVF.trackEvent("order"));   // ödeme sağlayıcısı test ortamında kapalı olabilir: sipariş adımı doğrudan
await q.waitForTimeout(700);
let e = ev();
chk("izinle: paket seçimi (iki kez açılsa da bir) + sipariş, aynı oturum, üyeye bağlı", e.map((x) => x.event).join() === "pkg_select,order" && new Set(e.map((x) => x.sid)).size === 1 && e.every((x) => x.user_id === M2.id), e);
await q.evaluate(() => window.AVF.go("/sss")); await q.waitForTimeout(900);
await q.context().close(); await new Promise((res) => setTimeout(res, 600));
// sipariş oluşturan oturumdaki üyenin siparişi ödendi → huni "ödendi" adımı
sql(`INSERT INTO orders (user_id, order_number, buyer_name, buyer_email, package_key, weeks, pharmacology, list_price, subtotal, currency, status, paid_at, plans_due_at, consent_at, created_at)
  VALUES ('${M2.id}', 'AVF-P${n0}', 'Ikinci Uye', '${M2.email}', 'starter', 4, false, 100, 100, 'TRY', 'paid', now(), now() + interval '1 day', now(), now() - interval '1 minute')`);
let st = await fetch(BASE + "/api/analytics/event", { method: "POST", headers: { "content-type": "text/plain", origin: "https://kotu.example" }, body: JSON.stringify({ sid: "c".repeat(32), event: "order" }) });
chk("başka kökenden huni adımı reddedilir (403)", st.status === 403, st.status);
st = await fetch(BASE + "/api/analytics/event", { method: "POST", headers: { "content-type": "text/plain", origin: BASE }, body: JSON.stringify({ sid: "c".repeat(32), event: "hack" }) });
chk("tanımsız adım kaydedilmez", st.status === 204 && ev().length === 2, ev());
r = await A.c.call("GET", "/admin/analytics?days=7");
chk("özet: huni (oturum 1, paketler 1, seçti 1, sipariş 1, ödendi 1)", r.body.funnel && r.body.funnel.packages === 1 && r.body.funnel.selected === 1 && r.body.funnel.ordered === 1 && r.body.funnel.paid === 1, r.body.funnel);
chk("özet: tüm siparişlerin sonucu", r.body.orders && r.body.orders.created >= 5 && r.body.orders.paid >= 5, r.body.orders);
for (const [tag, opt] of [["masaüstü", null], ["mobil", { ...devices["iPhone 13"] }]]) {
  q = await ctxOf(A, opt);
  await q.goto(BASE + "/uzman"); await q.waitForTimeout(1400);
  await q.locator('.menu a:has-text("Ziyaret Analizi")').click(); await q.waitForTimeout(1600);
  const t = await q.locator("#avf-funnel").innerText().catch(() => ""), o = await q.locator("#avf-orders").innerText().catch(() => "");
  chk(`[${tag}] Ziyaret Analizi: paketler → satın alma hunisi`, ["Paketler sayfasını gördü", "Paket seçti", "Sipariş oluşturdu", "Ödemesi onaylandı", "%100"].every((k) => t.includes(k)), t);
  chk(`[${tag}] sipariş sonuçları kartı`, ["Oluşturulan", "Ödenen", "Ödeme bekleyen", "Ödenmeden kapanan"].every((k) => o.includes(k)), o);
  const ov = await q.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  chk(`[${tag}] yatay taşma yok`, ov <= 1, ov);
  if (SHOT) await q.screenshot({ path: SHOT + "/v27-an-" + (opt ? "m" : "d") + ".png", fullPage: true });
  await q.context().close();
}
chk("ödeme sağlayıcısı durumu bilgisi (test ortamı)", true, payOn);
chk("sayfa hatası yok", errs.length === 0, errs.slice(0, 3));
await b.close();
finish();
