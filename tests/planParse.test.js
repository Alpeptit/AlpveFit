// v25 — yazıyla plan girişi: serbest metin → katalog kalemleri. Her çıktı sunucu doğrulamasından (validatePlanData) da geçirilir.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { catalog, FOODS, FIXED_NOTE } from "../src/utils/planCatalog.js";
import { validatePlanData, planDataHasContent } from "../src/utils/planData.js";
const box = { module: { exports: {} } };
vm.runInNewContext(readFileSync(new URL("../site/assets/avf-planparse.js", import.meta.url), "utf8"), box);
// vm bağlamındaki nesneler farklı prototiptedir; karşılaştırma için düz JSON'a çevrilir
const RAW = box.module.exports, CAT = catalog();
const J = (x) => JSON.parse(JSON.stringify(x));
const P = { nutrition: (t, c) => J(RAW.nutrition(t, c)), training: (t, c) => J(RAW.training(t, c)), supplement: (t, c) => J(RAW.supplement(t, c)), kinds: J(RAW.kinds), pharmacology: RAW.pharmacology };
const ok = (kind, r) => { const v = validatePlanData(kind, r.data); assert.equal(v.error, undefined, v.error); assert.ok(planDataHasContent(kind, v.data)); return v.data; };

const USER_EXAMPLE = `Sabah Kahvaltısı
5 yumurta beyazı m
1 yumurta bütün m
75 gram yulaf ezmesi
50 gram yaban mersini
5 gram bal

Öğün 1
50 gram basmati pirinç
200 gram tavuk göğsü
10 gram zeytinyağı

Öğün 2
50 gram basmati pirinç
200 gram tavuk göğsü
10 gram zeytinyağı
100 gram brokoli

Son Öğün
50 gram basmati pirinç
200 gram tavuk göğsü
10 gram zeytinyağı
50 gram kabak`;

test("beslenme: kullanıcının örnek programı birebir — 4 öğün, 16 kalem, hata/uyarı yok", () => {
  const r = P.nutrition(USER_EXAMPLE, CAT);
  assert.deepEqual(r.errors, []); assert.deepEqual(r.warnings, []); assert.equal(r.count, 16);
  const d = ok("nutrition", r);
  assert.equal(d.meals.length, 4);
  assert.deepEqual(d.meals[0].items.map((x) => [x.food, x.qty]), [["egg_white_m", 5], ["egg_whole_m", 1], ["oats", 75], ["blueberry", 50], ["honey", 5]]);
  assert.deepEqual(d.meals[2].items.map((x) => x.food), ["rice_basmati", "chicken_breast", "olive_oil", "broccoli"]);
  assert.deepEqual(d.meals[3].items.at(-1), { food: "zucchini", qty: 50, note: "" });
});

test("beslenme: yazım biçimleri — birim önde/sonda, kg, gr, g bitişik, L yumurta, x adet, iki nokta", () => {
  const r = P.nutrition(`Kahvaltı:
yulaf ezmesi 80 g
200g tavuk göğsü
0,25 kg somon
yumurta beyazı (L) x4
3 yumurta L
fıstık ezmesi: 15 gr
badem ezmesi 10 gram
150 g sakız kabağı
tere 20 g`, CAT);
  assert.deepEqual(r.errors, []);
  const d = ok("nutrition", r);
  assert.deepEqual(d.meals[0].items.map((x) => [x.food, x.qty]), [["oats", 80], ["chicken_breast", 200], ["salmon", 250], ["egg_white_l", 4], ["egg_whole_l", 3], ["peanut_butter", 15], ["almond_butter", 10], ["zucchini", 150], ["watercress", 20]]);
});

test("beslenme: varsayılanlar uyarıyla — boy yazılmayan yumurta M, tür yazılmayan pirinç/ekmek/elma, birimsiz gram, mL yağ", () => {
  const r = P.nutrition(`2 yumurta
60 g pirinç
40 g ekmek
1 elma 150
100 brokoli
10 ml zeytinyağı`, CAT);
  assert.deepEqual(r.errors.map((e) => e.line), [4], "“1 elma 150” anlaşılamaz (iki sayı)");
  const msgs = r.warnings.map((w) => w.msg).join(" | ");
  for (const k of ["Yumurta boyu yazılmadı", "Pirinç türü yazılmadı", "Ekmek türü yazılmadı", "Birim yazılmadı", "mL, grama çevrildi (9.2 g)"]) assert.ok(msgs.includes(k), k);
  const d = ok("nutrition", r);
  assert.deepEqual(d.meals[0].items.map((x) => [x.food, x.qty]), [["egg_whole_m", 2], ["rice_basmati", 60], ["ww_bread", 40], ["broccoli", 100], ["olive_oil", 9.2]]);
});

test("beslenme: hatalar satır numarasıyla, hiçbiri sessizce atılmaz", () => {
  const r = P.nutrition(`Sabah Kahvaltısı
100 g kinoa
5 g yumurta beyazı m
2 adet tavuk göğsü
3000 g yulaf
40 yumurta beyazı m
maydanoz
abc`, CAT);
  assert.deepEqual(r.errors.map((e) => e.line), [2, 3, 4, 5, 6, 7]);
  assert.match(r.errors[0].msg, /listede bulunamadı: “kinoa”/);
  assert.match(r.errors[1].msg, /adet ile yazılır/); assert.match(r.errors[2].msg, /gram ile yazılır/);
  assert.match(r.errors[3].msg, /1–2000 g/); assert.match(r.errors[4].msg, /1–30/); assert.match(r.errors[5].msg, /Miktar yazılmadı/);
  assert.equal(r.count, 0);
});

test("beslenme: günlere göre program (Pazartesi / Salı …) ve notlar", () => {
  const r = P.nutrition(`Not: Hafta boyunca su 4 L
Pazartesi
Sabah Kahvaltısı
75 g yulaf
Not: Kahveyi şekersiz için
Öğün 1
200 g tavuk göğsü
Salı:
Kahvaltı
4 yumurta bütün m
Antrenman sonrası
1 muz 120 g`, CAT);
  assert.equal(r.errors.length, 1, JSON.stringify(r.errors));   // “1 muz 120 g” iki sayı
  const r2 = P.nutrition(`Not: Hafta boyunca su 4 L
Pazartesi
Sabah Kahvaltısı
75 g yulaf
Not: Kahveyi şekersiz için
Öğün 1
200 g tavuk göğsü
Salı:
Kahvaltı
4 yumurta bütün m
Antrenman sonrası
120 g muz`, CAT);
  assert.deepEqual(r2.errors, []);
  const d = ok("nutrition", r2);
  assert.deepEqual(d.days.map((x) => x.title), ["Pazartesi", "Salı"]);
  assert.equal(d.note, "Hafta boyunca su 4 L");
  assert.equal(d.days[0].meals[0].note, "Kahveyi şekersiz için");
  assert.equal(d.days[1].meals[1].note, "Antrenman sonrası", "standart olmayan öğün adı öğün notu olarak korunur");
  assert.deepEqual(d.days[1].meals[1].items, [{ food: "banana", qty: 120, note: "" }]);
});

test("beslenme: sınırlar — 8'den fazla öğün, 7'den fazla gün hata verir", () => {
  const many = Array.from({ length: 9 }, (_, i) => `Öğün ${i + 1}\n100 g yulaf`).join("\n");
  assert.ok(P.nutrition(many, CAT).errors.some((e) => /En fazla 8 öğün/.test(e.msg)));
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Hafta sonu"].map((d) => d + "\n100 g yulaf").join("\n");
  assert.ok(P.nutrition(days, CAT).errors.some((e) => /En fazla 7 gün/.test(e.msg)));
});

test("sebzeler yalnız lif: makro toplamını değiştirmez; fıstık / badem ezmesi yağ kaynağı", () => {
  const veg = FOODS.filter((f) => f.group === "veg");
  assert.ok(veg.length >= 10);
  for (const k of ["watercress", "arugula", "parsley", "dill", "artichoke", "asparagus", "broccoli", "cauliflower", "zucchini"]) assert.ok(veg.some((f) => f.key === k), k);
  for (const f of veg) { assert.deepEqual([f.kcal, f.protein, f.carb, f.fat], [0, 0, 0, 0], f.key); assert.ok(f.fiber > 0 && f.fiberOnly); }
  const pb = FOODS.find((f) => f.key === "peanut_butter"), ab = FOODS.find((f) => f.key === "almond_butter");
  assert.equal(pb.group, "fat"); assert.equal(ab.group, "fat"); assert.ok(pb.kcal > 500 && ab.kcal > 500);
  assert.match(FIXED_NOTE, /çiğ olarak tartılmıştır/); assert.match(FIXED_NOTE, /hindistan cevizi yağı/);
});

test("antrenman: günler, set × tekrar biçimleri, kardiyo, özel hareket, notlar", () => {
  const r = P.training(`Pazartesi — Göğüs / Triceps
Bench Press 4x10
Incline Dumbbell Press 3 x 8-12
4 set 12 tekrar Pec Deck
Rope Pushdown 3x15
Not: son sette tükenişe git
Kablo ile özel göğüs itişi 3x12
Salı: Bacak
Back Squat 5x5
Leg Extension 3xmax
Koşu bandı (eğimli yürüyüş) 20 dk`, CAT);
  assert.deepEqual(r.errors, []);
  const d = ok("training", r);
  assert.deepEqual(d.days.map((x) => x.title), ["Pazartesi — Göğüs / Triceps", "Salı: Bacak"]);
  const mon = d.days[0];
  assert.deepEqual(mon.exercises.map((e) => [e.group, e.name, e.sets, e.reps]).slice(0, 4), [["chest", "Bench Press", 4, "10"], ["chest", "Incline Dumbbell Press", 3, "8-12"], ["chest", "Pec Deck (Butterfly)", 4, "12"], ["triceps", "Rope Pushdown", 3, "15"]]);
  assert.equal(mon.exercises[3].note, "son sette tükenişe git");
  assert.equal(mon.exercises[4].custom, true);
  assert.ok(r.warnings.some((w) => /özel hareket/.test(w.msg)));
  const tue = d.days[1];
  assert.deepEqual(tue.groups.sort(), ["cardio", "legs"]);
  assert.equal(tue.exercises[1].reps, "MAX");
  assert.deepEqual(tue.exercises[2], { group: "cardio", name: "Koşu bandı (eğimli yürüyüş)", custom: false, minutes: 20, note: "" });
});

test("antrenman: hatalar — set/tekrar yok, grubu belirsiz bilinmeyen hareket, 20 setten fazla", () => {
  const r = P.training(`1. Gün
Bench Press
Garip Hareket 3x10
Bench Press 25x10`, CAT);
  assert.deepEqual(r.errors.map((e) => e.line), [2, 3, 4]);
});

test("supplement: “sabah 1000 mg omega 3” ve benzerleri; aynı kalem birleşir", () => {
  const r = P.supplement(`Supplement programı:
sabah 1000 mg omega 3
akşam 1000 mg omega 3
antrenman sonrası 1 ölçek whey
5 g kreatin günde 1
yatmadan önce 400 mg magnezyum
sabah aç karnına 2000 IU d3
c vitamini 1000 mg günde 2 kez
zma 3 kapsül yatmadan önce`, CAT);
  assert.deepEqual(r.errors, []);
  const d = ok("supplement", r);
  const by = Object.fromEntries(d.items.map((x) => [x.name, x]));
  assert.deepEqual([by["Omega-3 (Balık Yağı)"].amount, by["Omega-3 (Balık Yağı)"].unit, by["Omega-3 (Balık Yağı)"].times, by["Omega-3 (Balık Yağı)"].when.sort()], [1000, "mg", 2, ["morning", "night"]]);
  assert.deepEqual([by["Whey Protein"].amount, by["Whey Protein"].unit, by["Whey Protein"].when], [1, "ölçek", ["post"]]);
  assert.deepEqual([by["Kreatin Monohidrat"].amount, by["Kreatin Monohidrat"].unit, by["Kreatin Monohidrat"].times], [5, "g", 1]);
  assert.equal(by["Magnezyum (Sitrat / Bisglisinat)"].amount, 400);
  assert.deepEqual([by["Vitamin D3"].unit, by["Vitamin D3"].state], ["IU", "fasted"]);
  assert.equal(by["Vitamin C"].times, 2);
  assert.deepEqual([by["ZMA"].amount, by["ZMA"].unit, by["ZMA"].when], [3, "kapsül", ["night"]]);
});

test("supplement: tanınmayan kalem ve geçersiz sıklık hata verir", () => {
  const r = P.supplement(`sabah 5 g bilinmeyenmadde
kreatin 5 g günde 9 kez`, CAT);
  assert.deepEqual(r.errors.map((e) => e.line), [1, 2]);
});

test("farmakoloji ve değerli notlar yazıyla çözümlenmez (yalnız manuel)", () => {
  assert.deepEqual(P.kinds, ["nutrition", "training", "supplement"]);
  assert.equal(P.pharmacology, undefined);
});

test("sunucu: günlere bölünmüş beslenme doğrulanır; eski tek günlük biçim aynen geçerli", () => {
  const two = validatePlanData("nutrition", { days: [{ title: "Antrenman günü", meals: [{ items: [{ food: "oats", qty: 80 }] }] }, { title: "Dinlenme günü", meals: [{ items: [{ food: "broccoli", qty: 200 }] }] }] });
  assert.equal(two.error, undefined); assert.equal(two.data.days.length, 2);
  assert.equal(validatePlanData("nutrition", { meals: [{ items: [{ food: "oats", qty: 80 }] }] }).error, undefined);
  assert.match(validatePlanData("nutrition", { days: [] }).error, /En az bir gün/);
  assert.match(validatePlanData("nutrition", { days: Array.from({ length: 8 }, () => ({ meals: [] })) }).error, /En fazla 7/);
  assert.equal(planDataHasContent("nutrition", { days: [{ meals: [] }] }), false);
});
