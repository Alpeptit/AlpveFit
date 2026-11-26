// Forum arayüzü (tarayıcı): giriş kapısı (kurallar + 18 yaş), yeni konu (anket + görsel), yanıt, alıntı, @anma önerisi, tepki,
// düzenleme, şikâyet, moderatör menüsü, mobil görünüm ve yatay taşma. Playwright gerekir.
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/board_ui.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium, devices } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");

const U = await signup("Arayuz Uye", "ui"), V = await signup("Arayuz Iki", "uv"), A = await signup("Arayuz Yonetici", "ua");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
for (const p of [V, A]) await p.c.call("PUT", "/forum/me", { acceptRules: true, healthConsent: true });
const png = Buffer.from("89504e470d0a1a0a0000000d4948445200000040000000300806000000" + "0".repeat(10) + "0000000049454e44ae426082", "hex");
const b = await chromium.launch(); const errs = [];
async function ctxOf(p, o) {
  const c = await b.newContext(o || { viewport: { width: 1360, height: 900 } });
  await c.addCookies(Object.entries(p.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
  await c.addInitScript(() => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", JSON.stringify({ c: "ess", v: 2, t: 1 })); } catch (e) {} });
  const q = await c.newPage(); q.on("pageerror", (e) => errs.push(e.message)); return q;
}
const q = await ctxOf(U);
await q.goto(BASE + "/forum"); await q.waitForTimeout(800);
chk("18 yaş onayı istenir", await q.locator("text=18 yaşından büyüğüm, devam et").count() === 1, "");
await q.click("text=18 yaşından büyüğüm, devam et"); await q.waitForTimeout(900);
chk("kurallar ekranı (ilk giriş)", await q.locator(".fo-gate").count() === 1 && await q.locator(".fo-gate button.btn").isDisabled(), "");
chk("kapıda isteğe bağlı KVKK açık rızası", await q.locator(".fo-gate input[type=checkbox]").count() === 2 && /açık rıza/.test(await q.locator(".fo-gate").innerText()), ""); for (const c of await q.locator(".fo-gate input[type=checkbox]").all()) await c.check(); await q.click(".fo-gate button.btn"); await q.waitForTimeout(1200);
chk("forum ana sayfası açılır", await q.locator(".fo-c").count() === 7 && await q.locator(".fo-band h1").textContent() === "Forum", "");
chk("dil seçici forumda yok", await q.evaluate(() => [...document.querySelectorAll(".lang")].every((e) => getComputedStyle(e).display === "none")), "");
// yeni konu
await q.click(".fo-new"); await q.waitForTimeout(800);
// kategori: simgeli açılır liste; tür alanı yok (Soru – Cevap kategorisi kaldırıldı)
chk("yeni konuda tür seçimi yok, kategori uyarısı var", await q.locator(".fo-kind").count() === 0 && await q.locator(".fo-warn").count() === 1, "");
await q.click(".fo-nt .dd-btn"); chk("kategori listesinde Soru – Cevap yok", await q.locator(".fo-nt .dd-o:has-text('Soru – Cevap')").count() === 0, ""); await q.click(".fo-nt .dd-o:has-text('Antrenman')");
await q.click(".fo-tagpick .fo-tag:has-text('Teknik')");
chk("etiket seçilir", await q.locator(".fo-tagpick .fo-tag.on").count() === 1, "");
await q.fill(".fo-nt input[maxlength='120']", "Deadlift sırasında bel ağrısı neden olur?");
await q.fill(".fo-ta", "Son iki haftadır **deadlift** sonrası belimde ağrı var. Formumu nasıl kontrol edebilirim?\n- 3x5 çalışıyorum\n- 120 kg");
await q.setInputFiles(".fo-comp input[type=file]", { name: "a.png", mimeType: "image/png", buffer: png }); await q.waitForTimeout(800);
chk("görsel yüklenir ve önizlenir", await q.locator(".fo-it img").count() === 1, await q.locator(".fo-cmsg").textContent());
await q.click("text=Anket ekle"); await q.fill(".fo-pollb input[placeholder='Anket sorusu']", "Siz kemer kullanıyor musunuz?");
await q.fill(".fo-popt >> nth=0 >> input", "Evet"); await q.fill(".fo-popt >> nth=1 >> input", "Hayır");
await q.click(".fo-tabs button:nth-child(2)"); await q.waitForTimeout(200);
chk("önizleme biçimi uygular", await q.locator(".fo-prev strong").textContent() === "deadlift" && await q.locator(".fo-prev li").count() === 2, "");
await q.click("text=Konuyu yayınla"); await q.waitForTimeout(1500);
chk("konu açılır ve konu sayfasına gidilir", /\/forum\/konu\//.test(q.url()) && await q.locator(".fo-th h1").textContent() === "Deadlift sırasında bel ağrısı neden olur?", q.url());
chk("anket ve görsel görünür", await q.locator(".fo-poll").count() === 1 && await q.locator(".fo-gi img").count() === 1, "");
const tUrl = q.url();
// ikinci üye: yanıt, @anma önerisi, alıntı, tepki
const r = await ctxOf(V);
await r.addInitScript(() => sessionStorage.setItem("avf_forum_18", "1"));
await r.goto(tUrl); await r.waitForTimeout(1200);
await r.click(".fo-ab.rx:not(.neg)"); await r.waitForTimeout(600);
chk("beğeni tıklanınca sayaç artar", await r.locator(".fo-ab.rx.on b").first().textContent() === "1", "");
await r.click(".fo-p .fo-ab:has-text('Alıntıla')"); await r.waitForTimeout(300);
chk("alıntı yazma alanına eklenir", /^\[alinti=/.test(await r.inputValue(".fo-reply .fo-ta")), await r.inputValue(".fo-reply .fo-ta"));
await r.locator(".fo-reply .fo-ta").press("End"); await r.type(".fo-reply .fo-ta", "Kalçadan menteşelenmeye dikkat et @" + U.username.slice(0, 4), { delay: 20 }); await r.waitForTimeout(700);
chk("@anma önerisi çıkar", await r.locator(".fo-sugg button").count() >= 1, "");
await r.keyboard.press("Enter"); await r.waitForTimeout(200);
chk("öneri seçilince kullanıcı adı tamamlanır", (await r.inputValue(".fo-reply .fo-ta")).includes("@" + U.username + " "), await r.inputValue(".fo-reply .fo-ta"));
await r.click("text=Yanıtı gönder"); await r.waitForTimeout(1500);
chk("yanıt görünür, alıntı kutusu çizilir", await r.locator(".fo-p").count() === 2 && await r.locator(".fo-quote").count() === 1 && await r.locator(".fo-men").count() >= 1, "");
// sahibi: canlı yeni yanıt uyarısı yerine bildirim; en iyi yanıt (soru türünü moderatör verir — Soru – Cevap kategorisi kaldırıldı)
sql(`UPDATE forum_topics SET kind = 'question' WHERE title = 'Deadlift sırasında bel ağrısı neden olur?'`);
await q.reload(); await q.waitForTimeout(1200);
await q.click("text=En iyi yanıt seç"); await q.waitForTimeout(1200);
chk("en iyi yanıt seçilir", await q.locator(".fo-p.best").count() === 1 && await q.locator(".fo-chip.ok").count() >= 1, "");
// düzenleme
await q.locator(".fo-p").first().locator("[aria-label='Diğer işlemler']").click(); await q.click(".fo-menu >> text=Düzenle"); await q.waitForTimeout(300);
await q.fill(".fo-edit .fo-ta", "Güncelledim: deadlift sonrası bel ağrısı var."); await q.click(".fo-edit >> text=Kaydet"); await q.waitForTimeout(1200);
chk("düzenleme kaydedilir ve işaretlenir", (await q.locator(".fo-p").first().locator(".fo-body").textContent()).startsWith("Güncelledim") && await q.locator(".fo-ed").count() === 1, "");
// şikâyet
await r.reload(); await r.waitForTimeout(1000);
await r.locator(".fo-p").first().locator("[aria-label='Diğer işlemler']").click(); await r.click(".fo-menu >> text=Şikâyet et"); await r.waitForTimeout(300);
await r.check(".fo-rr input[value='spam']"); await r.click(".fo-dlg .btn:not(.ghost)"); await r.waitForTimeout(900);
chk("şikâyet gönderilir", sql(`SELECT count(*) FROM forum_reports WHERE reporter_id='${V.id}'`) === "1", "");
// moderatör
const m = await ctxOf(A); await m.addInitScript(() => sessionStorage.setItem("avf_forum_18", "1"));
await m.goto(BASE + "/forum/moderasyon"); await m.waitForTimeout(1200);
const card = m.locator(".fo-mi", { hasText: "Güncelledim" });
chk("moderasyon kuyruğunda şikâyet", await card.count() === 1, "");
await card.locator("text=Reddet").click(); await m.waitForTimeout(1000);
chk("şikâyet reddedilir", await m.locator(".fo-mi", { hasText: "Güncelledim" }).count() === 0, "");
await m.goto(tUrl); await m.waitForTimeout(1000);
await m.click(".fo-tha >> text=Moderasyon"); chk("üye konusunda kilit seçeneği yok (her zaman yoruma açık)", await m.locator(".fo-menu >> text=Kilitle").count() === 0 && await m.locator(".fo-menu >> text=Sabitle").count() === 1, ""); await m.keyboard.press("Escape");
await r.reload(); await r.waitForTimeout(1000); chk("üye konusunda yanıt alanı var", await r.locator(".fo-reply .fo-ta").count() === 1, "");
// mobil: yatay taşma yok
const mob = await ctxOf(U, { ...devices["iPhone 13"] }); await mob.addInitScript(() => sessionStorage.setItem("avf_forum_18", "1"));
for (const path of ["/forum", "/forum/k/antrenman", new URL(tUrl).pathname, "/forum/yeni", "/forum/uye/" + V.username, "/forum/ara?q=deadlift"]) {
  await mob.goto(BASE + path); await mob.waitForTimeout(1000);
  chk("mobilde yatay taşma yok: " + path, await mob.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), await mob.evaluate(() => document.documentElement.scrollWidth));
}
// meydan okuma: telefonda görünen kart tıklamayla anında güncellenir (sayfa yenilemeden)
await mob.goto(BASE + "/forum"); await mob.waitForTimeout(1200);
const vis = () => mob.evaluate(() => { const x = [...document.querySelectorAll(".fo-ch")].find((e) => e.offsetParent); return x ? x.querySelector(".fo-chp").textContent : "yok"; });
const before = await vis(); await mob.locator(".fo-ch .fo-chday.today").filter({ visible: true }).first().click(); await mob.waitForTimeout(900);
chk("meydan okuma kartı anında güncellenir (mobil)", /\d \/ 5 gün/.test(before) && before !== await vis(), [before, await vis()]);
// misafir: ekip rehberleri açık, üye konusu kapalı, yazma ve arama yok
const gc = await b.newContext({ viewport: { width: 1360, height: 900 } }); await gc.addInitScript(() => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", JSON.stringify({ c: "ess", v: 2, t: 1 })); sessionStorage.setItem("avf_forum_18", "1"); } catch (e) {} });
const g = await gc.newPage(); g.on("pageerror", (e) => errs.push("misafir: " + e.message));
await g.goto(BASE + "/forum"); await g.waitForTimeout(1500);
chk("misafir forum ana sayfasını görür (ekip rehberleri + katıl kartı)", await g.locator(".fo-join").count() >= 1 && await g.locator(".fo-tlist .fo-t").count() > 0 && await g.locator(".fo-search").count() === 0 && await g.locator(".fo-new").count() === 0, "");
await g.goto(tUrl); await g.waitForTimeout(1200);
chk("misafir üye konusunu göremez", await g.locator("text=Bu bölüm üyelere özel").count() === 1, "");
await gc.close();
chk("tarayıcı hatası yok", !errs.length, errs);
await b.close(); finish();
