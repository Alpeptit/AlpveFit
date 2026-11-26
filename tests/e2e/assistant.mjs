// Koç Asistanı: yalnız koçluk üyeleri, açık rıza, bağlam (yalnız üyenin kendi verisi; farmakoloji / sağlık notu / ad / e-posta yok),
// farmakoloji sorusu modele gitmez, güvensiz / hatalı yanıt sabit metne düşer, sınırlar, geçmiş silme, rıza geri çekme; arayüz (masaüstü + mobil).
//   PWPATH=$(npm root -g) node --import ./tools/authsim/register.mjs tests/e2e/assistant.mjs   (devserver açıkken, AI_MOCK açık)
process.env.SIM_DB ||= "avfsim";
import { createRequire } from "node:module";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";
const require = createRequire(process.env.PWPATH ? process.env.PWPATH + "/" : import.meta.url);
const { chromium, devices } = require(process.env.PWPATH ? process.env.PWPATH + "/playwright" : "playwright");
const SHOT = process.env.SHOT || "";
const reqs = async () => (await fetch(BASE + "/__ai")).json();

const M = await signup("Asistan Uye Deneme", "asm"), N = await signup("Kocluksuz Uye", "asn"), A = await signup("Asistan Yonetici", "asa");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
for (const k of ["nutrition", "training", "pharmacology", "supplement"]) sql(`INSERT INTO member_access (member_id, kind) VALUES ('${M.id}', '${k}') ON CONFLICT DO NOTHING`);
const post = (kind, data) => A.c.call("POST", "/admin/plans", { memberId: M.id, kind, title: "P " + kind, body: "", data });
await post("nutrition", { days: [{ title: "Pazartesi", meals: [{ items: [{ food: "chicken_breast", qty: 200 }, { food: "rice_basmati", qty: 100 }] }, { items: [{ food: "broccoli", qty: 150 }] }] }], note: "" });
await post("training", { days: [{ title: "Push", groups: ["chest"], exercises: [{ group: "chest", name: "Bench Press", sets: 4, reps: "10" }] }] });
await post("pharmacology", { items: [{ group: "protect", name: "Aspirin", freq: "daily", note: "gizli farmakoloji notu" }] });
sql(`INSERT INTO member_profiles (user_id, height_cm, birth_year, training_days, goal, health_notes, blood_type, health_consent_at) VALUES ('${M.id}', 178, 1995, 4, 'yağ oranımı düşürmek', 'GIZLI SAGLIK NOTU', 'A+', now())`);
sql(`INSERT INTO body_logs (user_id, logged_on, weight_kg, waist_cm) VALUES ('${M.id}', current_date - 14, 84.5, 90), ('${M.id}', current_date - 7, 83.6, 89), ('${M.id}', current_date, 82.9, 88)`);

let r = await N.c.call("GET", "/assistant"); chk("koçluk üyesi olmayan: uygun değil", r.status === 200 && r.body.eligible === false && !r.body.messages, r.body);
r = await N.c.call("POST", "/assistant/messages", { text: "Kaç kalori?" }); chk("koçluk üyesi olmayan soru soramaz", r.status === 403, r.body);
r = await N.c.call("GET", "/plans/overview"); chk("koçluk üyesi olmayana menüde asistan yok", r.body.assistant === false, r.body.assistant);
r = await M.c.call("GET", "/plans/overview"); chk("koçluk üyesine asistan açık", r.body.assistant === true, r.body.assistant);
r = await M.c.call("GET", "/assistant"); chk("rıza yokken durum: uygun, rıza yok", r.body.eligible && r.body.enabled && r.body.consent === false, r.body);
const n0 = (await reqs()).length;
r = await M.c.call("POST", "/assistant/messages", { text: "Kaç kalori?" }); chk("rıza olmadan soru gönderilemez, sağlayıcıya hiçbir şey gitmez", r.status === 403 && r.body.code === "consent_required" && (await reqs()).length === n0, r.body);
r = await M.c.call("POST", "/assistant/consent", { accept: true }); chk("rıza verilir", r.status === 200 && sql(`SELECT ai_consent_at IS NOT NULL FROM users WHERE id='${M.id}'`) === "t", r.body);

r = await M.c.call("POST", "/assistant/messages", { text: "Bugünkü toplam kalorim ne kadar?" });
chk("soru yanıtlanır (model)", r.status === 201 && r.body.messages.length === 2 && r.body.messages[1].fixed === false && /toplamın \d+ kcal/.test(r.body.messages[1].body) && !/\*\*/.test(r.body.messages[1].body), r.body);
const q = (await reqs()).slice(-1)[0], sys = q.body.messages[0].content, all = JSON.stringify(q.body);
chk("bağlam: plan toplamı, brokoli lif, bench press, kilo kayıtları, boy/yaş/hedef", /\[Pazartesi\] toplam \d+ kcal/.test(sys) && /Brokoli 150 g \[lif\]/.test(sys) && /Bench Press 4x10/.test(sys) && /82\.9 kg/.test(sys) && /boy 178 cm/.test(sys) && /yağ oranımı düşürmek/.test(sys), sys.slice(-900));
chk("bağlamda farmakoloji, sağlık notu, kan grubu, ad ve e-posta YOK", !/Aspirin|gizli farmakoloji|GIZLI SAGLIK|A\+|Asistan Uye Deneme|@example/.test(all), null);
chk("sağlayıcıya anahtar başlıkta gider, model adı doğru", q.auth === "Bearer mock-key-0123456789abcdef" && q.body.model === "mock-model", [q.auth, q.body.model]);
const n1 = (await reqs()).length;
r = await M.c.call("POST", "/assistant/messages", { text: "Testosteron kullanırsam daha hızlı kilo verir miyim?" });
chk("farmakoloji sorusu modele gitmez, sabit metin döner", r.status === 201 && r.body.messages[1].fixed === true && /yardımcı olamam/.test(r.body.messages[1].body) && (await reqs()).length === n1, r.body);
r = await M.c.call("POST", "/assistant/messages", { text: "DOZTEST protein tozu ne kadar?" });
chk("modelden doz içeren yanıt gelirse gönderilmez (sabit güvenli metin)", r.body.messages[1].fixed === true && !/mcg/.test(r.body.messages[1].body), r.body.messages[1]);
r = await M.c.call("POST", "/assistant/messages", { text: "HATATEST makrolarım" });
chk("sağlayıcı hatasında sabit hata metni", r.body.messages[1].fixed === true && /yanıt veremiyorum/.test(r.body.messages[1].body), r.body.messages[1]);
r = await M.c.call("POST", "/assistant/messages", { text: "BAGLANTITEST kaynak var mı" });
chk("dış bağlantı atılır, site bağlantısı kalır", !/kotu\.example/.test(r.body.messages[1].body) && /alpvefit\.com\/panel/.test(r.body.messages[1].body), r.body.messages[1].body);
r = await M.c.call("POST", "/assistant/messages", { text: "Koçumla görüşmek istiyorum" }); chk("koçla görüşme isteği → destek talebine yönlendirme", /Destek Taleplerim/.test(r.body.messages[1].body), r.body.messages[1].body);
r = await M.c.call("POST", "/assistant/messages", { text: "x".repeat(1001) }); chk("uzun soru reddedilir", r.status === 400, r.body);
r = await M.c.call("POST", "/assistant/messages", { text: "Bir soru daha kalori" }); chk("dakikalık sınır (6)", r.status === 429, r.status);
sql(`UPDATE ai_messages SET created_at = created_at - interval '2 minutes' WHERE user_id='${M.id}'`);
r = await M.c.call("POST", "/assistant/messages", { text: "<script>alert(1)</script> kalori" }); chk("HTML içeren soru metin olarak saklanır", r.status === 201 && r.body.messages[0].body.startsWith("<script>"), r.status);
sql(`INSERT INTO ai_messages (user_id, role, body, source, created_at) SELECT '${M.id}', 'user', 'eski', 'member', now() - interval '3 minutes' FROM generate_series(1, 40)`);
r = await M.c.call("POST", "/assistant/messages", { text: "Kalorim?" }); chk("günlük sınır (40)", r.status === 429 && r.body.code === "day_limit", r.body);
sql(`DELETE FROM ai_messages WHERE user_id='${M.id}' AND body='eski'`);
r = await A.c.call("GET", "/assistant"); chk("yönetici / uzman hesabı asistanı kullanamaz", r.body.eligible === false, r.body);
r = await N.c.call("DELETE", "/assistant/messages"); chk("başkasının geçmişi silinemez (yalnız kendi)", r.body.deleted === 0 && sql(`SELECT count(*) FROM ai_messages WHERE user_id='${M.id}'`) !== "0", r.body);

// arayüz
const b = await chromium.launch(); const errs = [];
async function ctxOf(p, o) {
  const c = await b.newContext(o || { viewport: { width: 1360, height: 900 } });
  await c.addCookies(Object.entries(p.c.jar).map(([k, v]) => ({ name: k, value: v, url: BASE })));
  await c.addInitScript(() => { try { localStorage.setItem("avf_lang", "tr"); localStorage.setItem("avf_cookie", JSON.stringify({ c: "ess", v: 2, t: 1 })); } catch (e) {} });
  const q2 = await c.newPage(); q2.on("pageerror", (e) => errs.push(e.message)); q2.on("dialog", (d) => d.accept()); return q2;
}
const confirmYes = async (pg) => { await pg.waitForTimeout(250); await pg.locator(".cdlg button.btn:not(.ghost)").last().click(); await pg.waitForTimeout(700); };
for (const [tag, o] of [["masaüstü", null], ["mobil", { ...devices["iPhone 13"] }]]) {
  const pg = await ctxOf(M, o);
  await pg.goto(BASE + "/panel"); await pg.waitForTimeout(1500);
  chk(`[${tag}] Planlarım'da Koç Asistanı kartı ve menü bağlantısı`, await pg.locator('a.ai-ov').count() === 1 && await pg.locator('a[href="/panel/asistan"]').count() >= 2, null);
  await pg.locator("a.ai-ov").click(); await pg.waitForTimeout(1300);
  chk(`[${tag}] geçmiş mesajlar görünür`, await pg.locator(".ai-m").count() >= 6, await pg.locator(".ai-m").count());
  await pg.locator(".ai-in").fill("Bugünkü kalorim?"); await pg.keyboard.press("Enter"); await pg.waitForTimeout(1500);
  const last = await pg.locator(".ai-m.bot").last().innerText();
  chk(`[${tag}] Enter ile soru gönderilir, yanıt balonda`, /toplamın \d+ kcal/.test(last), last);
  const xss = await pg.evaluate(() => [...document.querySelectorAll(".ai-m.me p")].some((p) => p.textContent.includes("<script>")) && !document.querySelector(".ai-m script"));
  chk(`[${tag}] HTML içerik metin olarak gösterilir (çalışmaz)`, xss, null);
  const ov = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  chk(`[${tag}] yatay taşma yok`, ov <= 1, ov);
  if (SHOT) await pg.screenshot({ path: SHOT + `/ai-${tag === "mobil" ? "m" : "d"}.png`, fullPage: tag !== "mobil" });
  await pg.close();
}
const pg = await ctxOf(M);
await pg.goto(BASE + "/panel/asistan"); await pg.waitForTimeout(1300);
await pg.locator(".ai-tools button:has-text('Geçmişi sil')").click(); await confirmYes(pg);
chk("geçmiş silinir", sql(`SELECT count(*) FROM ai_messages WHERE user_id='${M.id}'`) === "0" && await pg.locator(".ai-empty").count() === 1, null);
await pg.locator(".ai-tools button:has-text('Rızayı geri çek')").click(); await confirmYes(pg); await pg.waitForTimeout(800);
chk("rıza geri çekilir, onay ekranı döner", sql(`SELECT ai_consent_at IS NULL FROM users WHERE id='${M.id}'`) === "t" && await pg.locator(".ai-consent").count() === 1, null);
chk("onay kutusu işaretlenmeden başlanamaz", await pg.locator(".ai-consent button.btn:has-text('Onaylıyorum')").isDisabled(), null);
if (SHOT) await pg.screenshot({ path: SHOT + "/ai-consent-d.png", fullPage: true });
await pg.locator("#aic").check(); await pg.locator(".ai-consent button.btn:has-text('Onaylıyorum')").click(); await pg.waitForTimeout(1200);
chk("rıza arayüzden verilir, sohbet açılır", await pg.locator(".ai-in").count() === 1 && sql(`SELECT ai_consent_at IS NOT NULL FROM users WHERE id='${M.id}'`) === "t", null);
const pn = await ctxOf(N); await pn.goto(BASE + "/panel/asistan"); await pn.waitForTimeout(1300);
chk("koçluk üyesi olmayana kilitli ekran", /koçluk üyelerine özeldir/.test(await pn.locator("main").innerText()), null);
chk("sayfa hatası yok", errs.length === 0, errs.slice(0, 3));
await b.close();
finish();
