// Yapılandırılmış planlar: katalog, türe göre doğrulama (yalnız listedeki besin/hareket/supplement/madde), kayıt ve üyeye gösterim.
//   node --import ./tools/authsim/register.mjs tests/e2e/plans.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, enableTotp, sql, chk, finish } from "./lib.mjs";

const A = await signup("Plan Yonetici", "padm"), M = await signup("Plan Uye", "pmbr");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
for (const k of ["nutrition", "training", "supplement", "pharmacology", "notes"]) sql(`INSERT INTO member_access (member_id, kind) VALUES ('${M.id}', '${k}') ON CONFLICT DO NOTHING`);

let r = await M.c.call("GET", "/plan-catalog");
chk("üye kataloğu görür", r.status === 200 && r.body.foods.length === 32 && r.body.firstMeal === "Sabah Kahvaltısı" && r.body.lastMeal === "Son Öğün", r.status);
const C = r.body;
chk("yalnız yumurtalar adet", C.foods.filter((f) => f.unit === "adet").every((f) => /Yumurta/.test(f.name)) && C.foods.filter((f) => f.unit === "adet").length === 4, null);
chk("8 kas grubu (kardiyo dahil)", C.groups.map((g) => g.key).join() === "chest,shoulder,back,legs,abs,biceps,triceps,cardio", C.groups.map((g) => g.key));
chk("koruyucular listesi", ["Arimidex", "Tamoxifen", "Klomen", "Proviron", "Dostinex", "Cialis", "Aspirin"].every((n) => C.pharma.find((g) => g.key === "protect").items.some((x) => x.includes(n))), null);
r = await A.c.call("GET", "/admin/plan-catalog"); chk("panel kataloğu", r.status === 200 && r.body.notes.rest, r.status);

const post = (kind, data, extra = {}) => A.c.call("POST", "/admin/plans", { memberId: M.id, kind, title: "T " + kind, body: "", data, ...extra });

// ---- beslenme ----
r = await post("nutrition", { meals: [{ items: [{ food: "pizza", qty: 100 }] }] }); chk("listede olmayan besin reddedilir", r.status === 400, r.body);
r = await post("nutrition", { meals: [{ items: [{ food: "egg_white_m", qty: 2.5 }] }] }); chk("yumurta yalnız tam adet", r.status === 400, r.body);
r = await post("nutrition", { meals: Array.from({ length: 9 }, () => ({ items: [] })) }); chk("en fazla 8 öğün", r.status === 400, r.body);
r = await post("nutrition", { meals: [{ items: [{ food: "egg_whole_l", qty: 3, note: "haşlanmış" }, { food: "oats", qty: 80 }], note: "<b>x</b>" }, { items: [{ food: "chicken_breast", qty: 200 }] }], note: "Genel", evil: 1 });
const nid = r.body && r.body.id; chk("beslenme planı kaydedilir", r.status === 201, r.body);
const nd = JSON.parse(sql(`SELECT data::text FROM plans WHERE id='${nid}'`));
chk("bilinmeyen alanlar atılır, not metin olarak saklanır", !("evil" in nd) && nd.meals[0].note === "<b>x</b>" && nd.meals[0].items[0].qty === 3, nd);

// ---- antrenman ----
r = await post("training", { days: [{ title: "Push", groups: ["chest"], exercises: [{ group: "chest", name: "Uçan Halı", sets: 3, reps: "10" }] }] }); chk("listede olmayan hareket (özel değilse) reddedilir", r.status === 400, r.body);
r = await post("training", { days: [{ groups: ["chest"], exercises: [{ group: "chest", name: "Bench Press", sets: 3, reps: "on" }] }] }); chk("geçersiz tekrar reddedilir", r.status === 400, r.body);
r = await post("training", { days: [{ title: "Push", groups: ["chest", "triceps", "cardio", "yoga"], exercises: [
  { group: "chest", name: "Incline Dumbbell Press", sets: 4, reps: "8-12", weight: 30 }, { group: "triceps", name: "Kendi hareketim", custom: true, sets: 3, reps: "12" },
  { group: "cardio", name: "Eliptik", minutes: 20 }] }] });
chk("antrenman planı kaydedilir (özel hareket + kardiyo)", r.status === 201, r.body);
const td = JSON.parse(sql(`SELECT data::text FROM plans WHERE id='${r.body.id}'`));
chk("bilinmeyen kas grubu atılır", td.days[0].groups.join() === "chest,triceps,cardio" && td.days[0].exercises[2].minutes === 20, td.days[0]);

// ---- supplement ----
r = await post("supplement", { items: [{ group: "vitamin", name: "Kreatin Monohidrat", times: 1 }] }); chk("yanlış gruptaki supplement reddedilir", r.status === 400, r.body);
r = await post("supplement", { items: [{ group: "creatine", name: "Kreatin Monohidrat", amount: 5, unit: "g", times: 7 }] }); chk("günde 6'dan fazla reddedilir", r.status === 400, r.body);
r = await post("supplement", { items: [{ group: "creatine", name: "Kreatin Monohidrat", amount: 5, unit: "g", times: 1, state: "fed", when: ["post", "x"] }, { group: "mineral", name: "Çinko", times: 1, state: "fasted" }] });
chk("supplement planı kaydedilir", r.status === 201, r.body);
const sd = JSON.parse(sql(`SELECT data::text FROM plans WHERE id='${r.body.id}'`));
chk("açlık/tokluk ve zaman temizlenir", sd.items[0].state === "fed" && sd.items[0].when.join() === "post" && sd.items[1].amount === null, sd.items);

// ---- farmakoloji ----
r = await post("pharmacology", { items: [{ group: "inj", name: "Bilinmeyen", dose: 1 }] }); chk("listede olmayan madde reddedilir", r.status === 400, r.body);
r = await post("pharmacology", { items: [{ group: "inj", name: "Testosteron Enantat", dose: "abc" }] }); chk("geçersiz doz reddedilir", r.status === 400, r.body);
r = await post("pharmacology", { items: [{ group: "inj", name: "Testosteron Enantat", dose: "", conc: "", freq: "w2" }, { group: "peptide", name: "BPC-157", dose: 250, unit: "mcg", vialMg: 5, bacMl: 2, freq: "daily" }, { group: "protect", name: "Aspirin", freq: "daily", note: "uzman notu" }] });
chk("farmakoloji planı kaydedilir (doz boş bırakılabilir)", r.status === 201, r.body);
const pd = JSON.parse(sql(`SELECT data::text FROM plans WHERE id='${r.body.id}'`));
chk("peptit şişe/BAC saklanır, enjektabl doz boş", pd.items[0].dose === null && pd.items[1].vialMg === 5 && pd.items[1].bacMl === 2 && !("conc" in pd.items[2]), pd.items);

// ---- değerli notlar ----
r = await post("notes", { values: { rest: "17 sn" } }); chk("listede olmayan değer reddedilir", r.status === 400, r.body);
r = await post("notes", { values: { rest: "90 sn", water: "4 L", salt: "5 g", sleep: "8 saat", bedtime: "23:00" }, notes: { water: "Antrenmanda 1 L" }, note: "Genel" });
const xid = r.body.id; chk("değerli notlar kaydedilir", r.status === 201, r.body);

// ---- düzenleme ve gösterim ----
r = await A.c.call("PATCH", "/admin/plans/" + nid, { data: { meals: [{ items: [{ food: "banana", qty: 120 }] }] } }); chk("plan verisi güncellenir", r.status === 200, r.body);
r = await A.c.call("PATCH", "/admin/plans/" + nid, { data: { meals: [{ items: [{ food: "banana", qty: 0 }] }] } }); chk("güncellemede de doğrulanır", r.status === 400, r.body);
r = await A.c.call("PATCH", "/admin/plans/" + nid, { data: "x" }); chk("geçersiz veri tipi reddedilir", r.status === 400, r.body);
r = await A.c.call("GET", `/admin/clients/${M.id}/plans`); chk("panel listesinde veri döner", r.body.some((p) => p.id === nid && p.data && p.data.meals[0].items[0].food === "banana"), null);
r = await M.c.call("GET", "/plans?kind=nutrition"); chk("yayınlanmamış plan üyeye görünmez", r.status === 200 && r.body.length === 0, r.body);
await A.c.call("POST", `/admin/plans/${nid}/publish`, {}); await A.c.call("POST", `/admin/plans/${xid}/publish`, {});
r = await M.c.call("GET", "/plans?kind=nutrition"); chk("yayınlanan plan verisiyle üyeye döner", r.body.length === 1 && r.body[0].data.meals[0].items[0].qty === 120, r.body);
r = await M.c.call("GET", "/plans?kind=notes"); chk("değerli notlar üyeye döner", r.body[0].data.values.water === "4 L" && r.body[0].data.notes.water === "Antrenmanda 1 L", r.body);
r = await M.c.call("POST", "/admin/plans", { memberId: M.id, kind: "notes", title: "x" }); chk("üye plan oluşturamaz", r.status === 404 || r.status === 403, r.status);
r = await post("supplement", { items: [] }); r = await A.c.call("POST", `/admin/plans/${r.body.id}/publish`, {}); chk("boş plan yayınlanamaz", r.status === 400, r.body);
finish();
