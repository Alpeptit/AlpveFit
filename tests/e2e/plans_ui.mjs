// Plan arayüzü (tarayıcı): yazıyla giriş (çözümle → hata/uyarı → önizleme → plana aktar), günlere bölünmüş beslenme,
// sebze lifi, sabit not, üye panelinde gün sekmeleri (bugün seçili) ve tek sütun görünüm. Masaüstü + mobil. Playwright gerekir.
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/plans_ui.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium, devices } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");
const SHOT = process.env.SHOT || "";

const A = await signup("Plan Arayuz Yonetici", "pua"), M = await signup("Plan Arayuz Uye", "pum");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
for (const k of ["nutrition", "training", "supplement", "pharmacology", "notes"]) sql(`INSERT INTO member_access (member_id, kind) VALUES ('${M.id}', '${k}') ON CONFLICT DO NOTHING`);
const uname = sql(`SELECT username FROM users WHERE id='${M.id}'`);
const WD = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], today = WD[new Date().getDay()], other = WD[(new Date().getDay() + 2) % 7];

const b = await chromium.launch(); const errs = [];
async function ctxOf(p, o) {
  const c = await b.newContext(o || { viewport: { width: 1360, height: 900 } });
  await c.addCookies(Object.entries(p.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
  await c.addInitScript(() => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", "1"); } catch (e) {} });
  const q = await c.newPage(); q.on("pageerror", (e) => errs.push(e.message)); q.on("dialog", (d) => d.accept()); return q;
}
async function openPlans(q) {
  await q.goto(BASE + "/uzman"); await q.waitForTimeout(1300);
  const s = q.locator('input[type="search"]').first(); if (await s.count()) { await s.fill(uname); await q.waitForTimeout(900); }
  await q.locator(`tr:has-text("${uname}") button:has-text("Planlar")`).first().click(); await q.waitForTimeout(1200);
}
async function newPlan(q, kind, title) {
  await q.locator('button:has-text("Yeni plan")').first().click(); await q.waitForTimeout(700);
  await q.locator(".pl-form select").first().selectOption(kind); await q.waitForTimeout(700);
  await q.locator('.pl-form input[placeholder="Plan başlığı"]').fill(title);
}
const txt = (q, sel) => q.locator(sel).first().innerText().catch(() => "");

// ================= 1) beslenme: yazıyla giriş
const q = await ctxOf(A);
await openPlans(q);
await newPlan(q, "nutrition", "Haftalık beslenme");
chk("beslenme oluşturucusunda 'Yazıyla gir' paneli var (kapalı)", await q.locator(".pl-txt-h").count() === 1 && await q.locator(".pl-txt-h").getAttribute("aria-expanded") === "false", null);
chk("oluşturucuda sabit not görünür", /çiğ olarak tartılmıştır/.test(await txt(q, ".pl-form .pl-fixed")), await txt(q, ".pl-form .pl-fixed"));
await q.locator(".pl-txt-h").click(); await q.waitForTimeout(300);
const ta = q.locator(".pl-txt textarea");
await ta.fill(["Kahvaltı", "4 yumurta beyazı", "80 g yulaf", "1 elma 150", "Öğle", "200 g tavuk göğsü", "pizza 100 g"].join("\n"));
await q.locator('.pl-txt button:has-text("Çözümle")').click(); await q.waitForTimeout(400);
let o = await txt(q, ".pl-txt-o");
chk("hatalı satırlar satır numarasıyla listelenir", /2 satır düzeltilmeli/.test(o) && /Satır 4/.test(o) && /Satır 7/.test(o), o);
chk("hata varken 'Plana aktar' kapalı", await q.locator('.pl-txt button:has-text("Plana aktar")').isDisabled(), null);
chk("varsayılan yumurta boyu uyarısı gösterilir", await q.locator(".pl-txt-l.warn li").count() >= 1, o);
await ta.fill([`${today}`, "Kahvaltı", "4 yumurta beyazı", "2 bütün yumurta L", "80 g yulaf", "Öğle", "200 g tavuk göğsü", "150 g basmati pirinç", "200 g brokoli", "Son öğün", "30 g fıstık ezmesi", "",
  `${other}`, "Kahvaltı", "100 g yulaf", "Öğle", "200 g somon", "100 g ıspanak", "Not: Bol su için"].join("\n"));
await q.locator('.pl-txt button:has-text("Çözümle")').click(); await q.waitForTimeout(500);
o = await txt(q, ".pl-txt-o");
chk("düzgün metin: kalemler tanınır, önizleme gün sekmeli", /kalem tanındı/.test(o) && await q.locator(".pl-txt-p .pl-day").count() === 2, o.slice(0, 300));
chk("önizlemede sebze yalnız lif olarak görünür", /Lif .* g · makroya eklenmez/.test(o) && /Sebzelerden lif/.test(o), o.slice(0, 600));
chk("aktar düğmesi açıldı", !(await q.locator('.pl-txt button:has-text("Plana aktar")').isDisabled()), null);
await q.locator('.pl-txt button:has-text("Plana aktar")').click(); await q.waitForTimeout(700);
chk("aktarım sonrası panel kapanır, editörde 2 gün sekmesi", await q.locator(".pl-txt-h").getAttribute("aria-expanded") === "false" && await q.locator(".pl-dayed .pl-day").count() === 2, await q.locator(".pl-dayed .pl-day").count());
chk("editörde birinci gün öğünleri dolu", await q.locator(".pl-ed .pl-card[data-meal] .pl-row").count() === 7, await q.locator(".pl-ed .pl-card[data-meal] .pl-row").count());
// gün kopyala + kaldır
await q.locator('.pl-dayed button:has-text("Günü kopyala")').click(); await q.waitForTimeout(300);
chk("gün kopyalanır (3 gün, kopya seçili, içerik aynı)", await q.locator(".pl-dayed .pl-day").count() === 3 && await q.locator(".pl-ed .pl-card[data-meal] .pl-row").count() === 7, null);
await q.locator('.pl-dayed button:has-text("Günü kaldır")').click(); await q.waitForTimeout(300);
chk("gün kaldırılır", await q.locator(".pl-dayed .pl-day").count() === 2, null);
if (SHOT) await q.screenshot({ path: SHOT + "/pui-ed-d.png", fullPage: true });
await q.locator('.pl-form button[type="submit"]').click(); await q.waitForTimeout(1200);
const nd = JSON.parse(sql(`SELECT data::text FROM plans WHERE member_id='${M.id}' AND kind='nutrition' ORDER BY created_at DESC LIMIT 1`) || "null");
chk("kaydedilen plan gün yapısında (2 gün, başlıklar, lif kalemi)", nd && nd.days.length === 2 && nd.days[0].title === today && nd.days[1].title === other && nd.days[0].meals.some((m) => m.items.some((i) => i.food === "broccoli")) && nd.days[1].note === "" , nd);
chk("not satırı genel nota eklendi", nd && /Bol su/.test(JSON.stringify(nd)), nd && nd.note);

// ================= 2) antrenman + supplement metinden
await newPlan(q, "training", "Antrenman");
await q.locator(".pl-txt-h").click();
await q.locator(".pl-txt textarea").fill(["Pazartesi — Göğüs + Arka kol", "Bench Press 4x10", "Incline Dumbbell Press 3 x 8-12", "Koşu bandı 20 dk", "", "Çarşamba — Sırt", "Lat Pulldown 4x12"].join("\n"));
await q.locator('.pl-txt button:has-text("Çözümle")').click(); await q.waitForTimeout(400);
o = await txt(q, ".pl-txt-o");
chk("antrenman metni çözümlenir (hatasız)", /kalem tanındı/.test(o) && !/düzeltilmeli/.test(o), o.slice(0, 300));
await q.locator('.pl-txt button:has-text("Plana aktar")').click(); await q.waitForTimeout(600);
chk("antrenman editörüne 2 gün aktarıldı", await q.locator(".pl-ed .pl-card[data-day]").count() === 2, await q.locator(".pl-ed .pl-card[data-day]").count());
await q.locator('.pl-form button[type="submit"]').click(); await q.waitForTimeout(1200);
const td = JSON.parse(sql(`SELECT data::text FROM plans WHERE member_id='${M.id}' AND kind='training' ORDER BY created_at DESC LIMIT 1`) || "null");
chk("antrenman kaydedildi", td && td.days.length === 2 && td.days[0].exercises.length === 3, td);
await newPlan(q, "supplement", "Supplement");
await q.locator(".pl-txt-h").click();
await q.locator(".pl-txt textarea").fill(["Kreatin 5 g günde 1", "Omega 3 1000 mg sabah ve akşam", "Magnezyum 400 mg yatmadan önce"].join("\n"));
await q.locator('.pl-txt button:has-text("Çözümle")').click(); await q.waitForTimeout(400);
await q.locator('.pl-txt button:has-text("Plana aktar")').click(); await q.waitForTimeout(600);
await q.locator('.pl-form button[type="submit"]').click(); await q.waitForTimeout(1200);
const sd = JSON.parse(sql(`SELECT data::text FROM plans WHERE member_id='${M.id}' AND kind='supplement' ORDER BY created_at DESC LIMIT 1`) || "null");
chk("supplement metinden kaydedildi (3 kalem)", sd && sd.items.length === 3, sd);
await newPlan(q, "pharmacology", "Farmakoloji");
chk("farmakolojide yazıyla giriş yok (yalnız elle)", await q.locator(".pl-txt").count() === 0, null);
await q.locator('.pl-form button:has-text("Vazgeç")').click();
// mevcut planı metinle değiştirirken onay istenir (dialog kabul edilir) — düzenleme
await q.locator('.acc:has-text("Haftalık beslenme") button').first().click(); await q.waitForTimeout(300);
await q.locator('.acc:has-text("Haftalık beslenme") button:has-text("Düzenle")').click(); await q.waitForTimeout(900);
chk("kayıtlı günlü plan editörde gün sekmeleriyle açılır", await q.locator(".pl-dayed .pl-day").count() === 2, null);
await q.locator('.pl-form button:has-text("Vazgeç")').click();
// tüm planları yayınla
for (const id of sql(`SELECT id FROM plans WHERE member_id='${M.id}'`).split("\n").filter(Boolean)) await A.c.call("POST", `/admin/plans/${id}/publish`, {});

// ================= 3) üye paneli
for (const [tag, o2] of [["masaüstü", null], ["mobil", { ...devices["iPhone 13"] }]]) {
  const u = await ctxOf(M, o2);
  await u.goto(BASE + "/panel/beslenme"); await u.waitForTimeout(1500);
  const on = await txt(u, ".pl-view .pl-day.on");
  chk(`[${tag}] üye: beslenmede bugünün günü seçili ('Bugün' etiketli)`, on.includes(today) && /Bugün/i.test(on), on);
  chk(`[${tag}] üye: sabit not görünür`, /çiğ olarak tartılmıştır/.test(await txt(u, ".pl-view .pl-fixed")), null);
  chk(`[${tag}] üye: brokoli lif olarak gösterilir`, /Brokoli/.test(await txt(u, ".pl-view")) && /Sebzelerden lif/.test(await txt(u, ".pl-view")), null);
  await u.locator(".pl-view .pl-day").nth(1).click(); await u.waitForTimeout(300);
  chk(`[${tag}] üye: diğer gün sekmesi açılır`, /Somon/.test(await txt(u, ".pl-view")) && !/Fıstık Ezmesi/.test(await txt(u, ".pl-view")), (await txt(u, ".pl-view")).slice(0, 300));
  const ov = await u.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  chk(`[${tag}] üye: yatay taşma yok`, ov <= 1, ov);
  if (SHOT) await u.screenshot({ path: SHOT + `/pui-mb-${tag === "mobil" ? "m" : "d"}.png`, fullPage: true });
  // tek sütun: Planlarım sayfasında tüm güncel planlar alt alta
  await u.goto(BASE + "/panel"); await u.waitForTimeout(1600);
  const secs = await u.locator(".ovc-s").evaluateAll((els) => els.map((e) => e.id));
  chk(`[${tag}] üye: Planlarım'da güncel planlar tek sütunda (beslenme, antrenman, supplement sırasıyla)`, secs.join() === "plan-beslenme,plan-antrenman,plan-takviye", secs);
  chk(`[${tag}] üye: tek sütunda beslenme günleri ve sabit not var`, await u.locator("#plan-beslenme .pl-day").count() === 2 && await u.locator("#plan-beslenme .pl-fixed").count() === 1, null);
  await u.locator('.ovc-j a[href="#plan-takviye"]').click(); await u.waitForTimeout(900);
  const top = await u.locator("#plan-takviye").evaluate((e) => Math.round(e.getBoundingClientRect().top));
  chk(`[${tag}] üye: bölüm atlama bağlantısı ilgili plana kaydırır`, top >= 0 && top < 260, top);
  const ov3 = await u.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  chk(`[${tag}] üye: Planlarım yatay taşma yok`, ov3 <= 1, ov3);
  if (SHOT) await u.screenshot({ path: SHOT + `/pui-ov-${tag === "mobil" ? "m" : "d"}.png`, fullPage: true });
  await u.close();
}
const q2 = await ctxOf(A, { ...devices["iPhone 13"] });
await openPlans(q2); await newPlan(q2, "nutrition", "Mobil");
await q2.locator(".pl-txt-h").click(); await q2.waitForTimeout(200);
const ov2 = await q2.evaluate(() => document.documentElement.scrollWidth - innerWidth);
chk("[mobil] yönetim: yazıyla giriş açıkken yatay taşma yok", ov2 <= 1, ov2);
if (SHOT) await q2.screenshot({ path: SHOT + "/pui-ed-m.png", fullPage: true });
chk("sayfa hatası yok", errs.length === 0, errs.slice(0, 3));
await b.close();
finish();
