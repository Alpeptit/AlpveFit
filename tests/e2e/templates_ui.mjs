// Konu şablonları (tarayıcı): üye şablonları (soru, önce/sonra, haftalık güncelleme, program, tarif, supplement deneyimi),
// ekip şablonları yalnız ekibe; önce/sonra iki fotoğrafı filigranlı tek görselde birleştirir ve konuya [gif=N] olarak ekler.
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/templates_ui.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium, devices } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");
const SHOT = process.env.SHOT || "";

const U = await signup("Sablon Uye", "tpu"), A = await signup("Sablon Yonetici", "tpa"), D = await signup("Sablon Moderator", "tpd");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
for (const p of [U, D]) await p.c.call("PUT", "/forum/me", { acceptRules: true, healthConsent: true });
sql(`UPDATE forum_profiles SET forum_role='moderator' WHERE user_id='${D.id}'`);
const b = await chromium.launch(); const errs = [];
async function ctxOf(p, o) {
  const c = await b.newContext(o || { viewport: { width: 1360, height: 900 } });
  await c.addCookies(Object.entries(p.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
  await c.addInitScript(() => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", "1"); sessionStorage.setItem("avf_forum_18", "1"); } catch (e) {} });
  const q = await c.newPage(); q.on("pageerror", (e) => errs.push(e.message)); return q;
}
// test fotoğrafları: tarayıcıda çizilen iki PNG (dikey ve yatay; kırpma/yerleşim sınanır)
async function pngs(q) {
  const out = await q.evaluate(async () => {
    const mk = (w, hh, col) => new Promise((res) => { const c = document.createElement("canvas"); c.width = w; c.height = hh; const x = c.getContext("2d"); x.fillStyle = col; x.fillRect(0, 0, w, hh); x.fillStyle = "#fff"; x.fillRect(w / 3, hh / 4, w / 3, hh / 2); c.toBlob((b) => b.arrayBuffer().then((a) => res(Array.from(new Uint8Array(a)))), "image/png"); });
    return [await mk(600, 900, "#3b82f6"), await mk(1200, 800, "#16a34a")];
  });
  return out.map((a, i) => ({ name: i ? "sonra.png" : "once.png", mimeType: "image/png", buffer: Buffer.from(a) }));
}

const q = await ctxOf(U);
await q.goto(BASE + "/forum/yeni"); await q.waitForTimeout(1500);
let labels = await q.locator(".fo-tplb").allInnerTexts();
chk("üyeye 6 şablon (ekip şablonları yok)", labels.length === 6 && labels.includes("Önce / Sonra") && !labels.includes("Duyuru") && !labels.includes("Farmakoloji"), labels);
await q.locator(".fo-tplb:has-text('Tarif')").click(); await q.waitForTimeout(300);
let v = await q.locator(".fo-comp textarea").inputValue();
chk("tarif şablonu yalnız iskeleti ekler (çiğ ağırlık, besin tablosu)", /Malzemeler \(çiğ ağırlık\)/.test(v) && /\[tablo\]/.test(v), v.slice(0, 200));
chk("şablon kategoriyi önerir (Beslenme)", /Beslenme/.test(await q.locator(".fo-nt .dd-btn").first().innerText()), await q.locator(".fo-nt .dd-btn").first().innerText());
await q.locator(".fo-comp textarea").fill("");
// önce / sonra
await q.locator(".fo-tplb:has-text('Önce / Sonra')").click(); await q.waitForTimeout(400);
chk("önce/sonra penceresi açılır", await q.locator(".ba-frm").count() === 1, null);
await q.locator(".fo-dlg button.btn:not(.ghost)").click(); await q.waitForTimeout(300);
chk("fotoğraf seçilmeden görsel oluşturulmaz", await q.locator(".ba-frm").count() === 1, null);
const [p1, p2] = await pngs(q);
await q.locator(".ba-slot input").nth(0).setInputFiles(p1); await q.locator(".ba-slot input").nth(1).setInputFiles(p2);
await q.locator("input[aria-label='Önce tarihi']").fill("Ocak 2026"); await q.locator("input[aria-label='Sonra tarihi']").fill("Nisan 2026"); await q.locator("input[aria-label='Süre']").fill("12 hafta");
if (SHOT) await q.screenshot({ path: SHOT + "/tpl-dialog-d.png" });
await q.locator(".fo-dlg button.btn:not(.ghost)").click(); await q.waitForTimeout(2500);
v = await q.locator(".fo-comp textarea").inputValue();
chk("önce/sonra iskeleti ve [oncesonra=1] eklendi", /Önce \/ Sonra — 12 hafta/.test(v) && /\[oncesonra=1\]/.test(v), v.slice(0, 160));
const imgs = await q.locator(".fo-imgs img").count();
chk("birleşik görsel yüklendi (tek görsel)", imgs === 1, [imgs, await q.locator(".fo-cmsg").innerText()]);
const att = sql(`SELECT mime FROM attachments WHERE user_id='${U.id}' AND scope='forum' ORDER BY created_at DESC LIMIT 1`);
chk("birleşik görsel JPEG olarak saklandı", /jpeg/.test(att), att);
await q.locator(".fo-nt input[aria-label='Başlık']").fill("12 haftalık değişimim önce ve sonra");
await q.locator("button.btn:has-text('Konuyu yayınla')").click(); await q.waitForTimeout(2000);
chk("konu yayınlandı ve görsel konuda gösteriliyor", /\/forum\/konu\//.test(q.url()) && await q.locator(".fo-fig.ba img").count() === 1, q.url());
if (SHOT) await q.screenshot({ path: SHOT + "/tpl-topic-d.png", fullPage: true });
// birleşik görselin içeriği: sunucudan alınıp boyut ve filigran bandı (alt koyu bant) kontrol edilir
const px = await q.evaluate(async () => {
  const im = document.querySelector(".fo-fig.ba img"); await im.decode();
  const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext("2d"); x.drawImage(im, 0, 0);
  const foot = x.getImageData(Math.round(c.width * 0.6), c.height - 20, 1, 1).data, mid = x.getImageData(Math.round(c.width * 0.25), Math.round(c.height * 0.1), 1, 1).data;
  return { w: c.width, h: c.height, foot: [foot[0], foot[1], foot[2]], mid: [mid[0], mid[1], mid[2]] };
});
chk("görsel: iki fotoğraf + koyu filigran bandı", px.w === 1584 && px.h === 1133 && px.foot.every((n) => n < 40) && px.mid[2] > 150, px);

// ekip şablonları
const d = await ctxOf(D); await d.goto(BASE + "/forum/yeni"); await d.waitForTimeout(1300);
labels = await d.locator(".fo-tplb").allInnerTexts();
chk("moderatöre duyuru ve rehber şablonu (farmakoloji yok)", labels.includes("Duyuru") && labels.includes("Rehber / makale") && !labels.includes("Farmakoloji"), labels);
const a = await ctxOf(A); await a.goto(BASE + "/forum/yeni"); await a.waitForTimeout(1300);
labels = await a.locator(".fo-tplb").allInnerTexts();
chk("yöneticiye tüm şablonlar (farmakoloji dahil)", labels.length === 9 && labels.includes("Farmakoloji"), labels);
await a.locator(".fo-tplb:has-text('Farmakoloji')").click(); await a.waitForTimeout(200);
chk("farmakoloji şablonu değiştirilemeyen uyarı kutusuyla", /\[kutu=tehlike\]/.test(await a.locator(".fo-comp textarea").inputValue()), null);
// mobil
const m = await ctxOf(U, { ...devices["iPhone 13"] }); await m.goto(BASE + "/forum/yeni"); await m.waitForTimeout(1300);
await m.locator(".fo-tplb:has-text('Önce / Sonra')").click(); await m.waitForTimeout(400);
const ov = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
chk("[mobil] şablonlar ve önce/sonra penceresi taşmıyor", ov <= 1, ov);
if (SHOT) await m.screenshot({ path: SHOT + "/tpl-dialog-m.png" });
chk("sayfa hatası yok", errs.length === 0, errs.slice(0, 3));
await b.close();
finish();
