/* AlpveFit — YAZIYLA PLAN GİRİŞİ (v25). Uzman / yönetici planı serbest metin olarak yazar; bu modül satırları katalogdaki
   kalemlere çevirir (beslenme, antrenman, supplement). Sonuç her zaman ÖNİZLENİR ve manuel düzenleme ekranına aktarılır;
   tanınmayan satırlar satır numarasıyla hata olarak gösterilir, hiçbir şey sessizce atılmaz. Sunucu doğrulaması (utils/planData.js)
   aynen geçerlidir. Farmakoloji ve değerli notlar yazıyla çözümlenmez (yalnız manuel giriş).
   Tarayıcıda AVF.planParse, Node testlerinde module.exports olarak kullanılır. */
(function (root, factory) {
  var P = factory();
  if (typeof module === "object" && module.exports) module.exports = P;
  if (root && root.AVF) root.AVF.planParse = P;
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";
  var TR = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u" };
  function fold(s) {
    return String(s || "").replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase().replace(/[çğıöşüâîû]/g, function (c) { return TR[c]; })
      .replace(/[“”"'’`]/g, "").replace(/[()\[\]{},;:!?]/g, " ").replace(/\s+/g, " ").trim();
  }
  function has(hay, needle) { return (" " + hay + " ").indexOf(" " + needle + " ") >= 0; }
  function numOf(s) { return Number(String(s).replace(",", ".")); }
  var NUM = "(\\d+(?:[.,]\\d+)?)";

  // ------------------------------------------------------------------ ortak: gün başlıkları
  var DAY_RX = /^(pazartesi|sali|carsamba|persembe|cuma|cumartesi|pazar|hafta ici|hafta sonu|her gun|antrenman gunu|antrenmansiz gun|dinlenme gunu|off gun|off|monday|tuesday|wednesday|thursday|friday|saturday|sunday|rest day|training day|\d{1,2}\s*\.?\s*gun|gun\s*\d{1,2}|day\s*\d{1,2})\b/;
  function isDay(fl) { return DAY_RX.test(fl); }
  function cleanTitle(line) { return line.replace(/[:\-–—]+\s*$/, "").trim().slice(0, 60); }
  function lines(text) { return String(text || "").replace(/\r\n?/g, "\n").split("\n"); }

  // ------------------------------------------------------------------ BESLENME
  var FOOD_ALIAS = {
    chicken_breast: ["tavuk gogus", "tavuk gogsu", "tavuk gogus eti", "tavuk", "chicken breast", "chicken"],
    beef_lean: ["yagsiz kiyma", "yagsiz dana kiyma", "kiyma %5", "%5 kiyma", "kiyma", "lean beef"],
    beef_low: ["az yagli kiyma", "kiyma %10", "kiyma %15", "%10 kiyma", "%15 kiyma"],
    salmon: ["somon", "norvec somonu", "somon baligi", "salmon"], tuna: ["ton baligi", "ton", "tuna"], tilapia: ["tilapya", "tilapya baligi", "tilapia"],
    whiting: ["mezgit", "mezgit baligi", "whiting"], greek_yogurt: ["suzme yogurt", "suzme", "yogurt", "greek yogurt"], lor: ["lor peyniri", "lor", "cottage cheese"],
    sweet_potato: ["tatli patates", "sweet potato"], potato: ["sari patates", "patates", "potato"], oats: ["yulaf ezmesi", "yulaf", "oats", "oat"],
    rice_basmati: ["basmati pirinc", "basmati pirinci", "basmati"], rice_jasmine: ["yasemin pirinci", "yasemin pirinc", "yasemin", "jasmine"], rice_baldo: ["baldo pirinc", "baldo pirinci", "baldo"],
    rye_bread: ["cavdar ekmegi", "cavdar ekmek", "cavdar"], ww_bread: ["tam bugday ekmegi", "tam bugday ekmek", "tam bugday"],
    banana: ["muz", "banana"], pineapple: ["ananas", "pineapple"], apple_green: ["yesil elma", "green apple"], apple_red: ["kirmizi elma", "red apple"],
    blueberry: ["yaban mersini", "yabanmersini", "blueberry"], raspberry: ["ahududu", "frambuaz", "raspberry"], blackberry: ["bogurtlen", "blackberry"], honey: ["bal", "honey"],
    olive_oil: ["zeytinyagi", "zeytin yagi", "sizma zeytinyagi", "olive oil"], coconut_oil: ["hindistan cevizi yagi", "hindistancevizi yagi", "coconut oil"], avocado: ["avokado", "avocado"],
    peanut_butter: ["fistik ezmesi", "yer fistigi ezmesi", "yerfistigi ezmesi", "peanut butter"], almond_butter: ["badem ezmesi", "almond butter"],
    watercress: ["tere"], arugula: ["roka"], parsley: ["maydanoz"], dill: ["dereotu", "dere otu"], artichoke: ["enginar"], asparagus: ["kuskonmaz"], broccoli: ["brokoli"],
    cauliflower: ["karnibahar"], zucchini: ["sakiz kabagi", "sakiz kabak", "kabak", "sakiz"], spinach: ["ispanak"], lettuce: ["marul"], cucumber: ["salatalik", "hiyar"],
    green_beans: ["taze fasulye", "yesil fasulye"], brussels: ["bruksel lahanasi"], cabbage: ["lahana"], mushroom: ["mantar"], green_pepper: ["yesil biber", "biber"],
    celery: ["kereviz sapi", "kereviz"], leek: ["pirasa"]
  };
  // tür belirtilmeden yazılınca varsayılan + uyarı
  var FOOD_DEFAULT = [["pirinc", "rice_basmati", "Pirinç türü yazılmadı; Basmati seçildi."], ["ekmek", "ww_bread", "Ekmek türü yazılmadı; Tam Buğday seçildi."], ["elma", "apple_green", "Elma türü yazılmadı; Yeşil Elma seçildi."]];
  var MEAL_RX = /^(sabah kahvaltisi|kahvalti|sabah|ogle yemegi|ogle|aksam yemegi|aksam|ara ogun|son ogun|yatmadan once|gece|antrenman oncesi|antrenman sonrasi|pre ?workout|post ?workout|\d{1,2}\s*\.?\s*ogun|ogun\s*\d{1,2}|meal\s*\d{1,2}|breakfast|lunch|dinner|snack)\b/;
  var STD_MEAL = /^(sabah kahvaltisi|kahvalti|\d{1,2}\s*\.?\s*ogun|ogun\s*\d{1,2}|ara ogun|son ogun|meal\s*\d{1,2}|breakfast)$/;

  function matchFood(name, foods) {
    var n = fold(name), best = null, bestLen = 0;
    if (/\byumurta\b|\begg\b/.test(n)) {
      var white = /\bbeyaz/.test(n) || /\bwhite\b/.test(n);
      var size = /(^| )(l|large|buyuk)( |$)/.test(n) ? "l" : /(^| )(m|medium|orta)( |$)/.test(n) ? "m" : null;
      return { key: (white ? "egg_white_" : "egg_whole_") + (size || "m"), warn: size ? null : "Yumurta boyu yazılmadı; M seçildi." };
    }
    Object.keys(FOOD_ALIAS).forEach(function (k) {
      FOOD_ALIAS[k].forEach(function (a) { if (a.length > bestLen && has(n, a)) { best = k; bestLen = a.length; } });
    });
    if (best && foods[best]) return { key: best };
    for (var i = 0; i < FOOD_DEFAULT.length; i++) if (has(n, FOOD_DEFAULT[i][0])) return { key: FOOD_DEFAULT[i][1], warn: FOOD_DEFAULT[i][2] };
    // katalog adının kendisi (parantezsiz) — yeni eklenen besinler için
    for (var key in foods) { var nm = fold(foods[key].name.replace(/\(.*?\)/g, "")); if (nm && has(n, nm)) return { key: key }; }
    return null;
  }
  // "75 gram yulaf ezmesi" · "yulaf ezmesi 75 g" · "5 yumurta beyazı m" · "yumurta beyazı (L) x5" · "200g tavuk göğsü"
  function itemOf(raw) {
    var t = raw.replace(/^[\s•\-*–]+/, "").trim();
    var m = new RegExp("^" + NUM + "\\s*(kg|gr|gram|gramm|g|adet|tane|ad|ml|x)?\\.?\\s+(.+)$", "i").exec(t)
      || new RegExp("^(.+?)\\s*[:=\\-–]?\\s*(?:x\\s*)?" + NUM + "\\s*(kg|gr|gram|gramm|g|adet|tane|ad|ml)?\\.?$", "i").exec(t);
    if (!m) return null;
    var qty, unit, name;
    if (/^\d/.test(t)) { qty = numOf(m[1]); unit = (m[2] || "").toLowerCase(); name = m[3]; }
    else { name = m[1]; qty = numOf(m[2]); unit = (m[3] || "").toLowerCase(); }
    if (unit === "x") unit = "adet";
    if (/\d/.test(name)) return null;   // "1 elma 150" gibi iki sayılı satır belirsizdir
    return { qty: qty, unit: unit, name: name.trim() };
  }

  function nutrition(text, cat) {
    var foods = {}; (cat.foods || []).forEach(function (f) { foods[f.key] = f; });
    var mealsMax = cat.mealsMax || 8, daysMax = cat.nutritionDaysMax || 7;
    var days = [], day = null, meal = null, general = [], errors = [], warnings = [], count = 0;
    function newDay(title) { day = { title: title, meals: [], note: "" }; days.push(day); meal = null; }
    function newMeal(header) { if (!day) newDay(null); meal = { items: [], note: header && !STD_MEAL.test(fold(header)) ? cleanTitle(header) : "" }; day.meals.push(meal); }
    lines(text).forEach(function (line, i) {
      var ln = i + 1, t = line.trim(); if (!t) return;
      var fl = fold(t);
      var nm = /^(not|note)\s*[:\-]\s*(.+)$/i.exec(t);
      if (nm) { var note = nm[2].trim().slice(0, 500); if (meal) meal.note = (meal.note ? meal.note + " · " : "") + note; else if (day) day.note = (day.note ? day.note + " · " : "") + note; else general.push(note); return; }
      var maybe = itemOf(t), food = maybe && matchFood(maybe.name, foods);
      if (isDay(fl) && !food) { newDay(cleanTitle(t)); return; }
      if (!/\d/.test(t)) {
        if (!MEAL_RX.test(fl) && !/:\s*$/.test(t) && matchFood(t, foods)) { errors.push({ line: ln, text: t, msg: "Miktar yazılmadı (ör. “100 g " + t.toLowerCase() + "”)." }); return; }
        newMeal(t); return;
      }
      if (MEAL_RX.test(fl) && !food && !fl.replace(MEAL_RX, "").trim()) { newMeal(t); return; }
      var it = itemOf(t);
      if (!it) { errors.push({ line: ln, text: t, msg: "Miktar ve besin anlaşılamadı (ör. “75 g yulaf ezmesi” ya da “5 yumurta beyazı M”)." }); return; }
      var fm = matchFood(it.name, foods);
      if (!fm) { errors.push({ line: ln, text: t, msg: "Besin listede bulunamadı: “" + it.name + "”." }); return; }
      var f = foods[fm.key], qty = it.qty;
      if (f.unit === "adet") {
        if (it.unit && it.unit !== "adet") { errors.push({ line: ln, text: t, msg: f.name + " adet ile yazılır (ör. “3 " + f.name.toLowerCase() + "”)." }); return; }
        if (!(qty >= 1 && qty <= 30 && Math.round(qty) === qty)) { errors.push({ line: ln, text: t, msg: f.name + ": adet 1–30 arasında tam sayı olmalıdır." }); return; }
      } else {
        if (it.unit === "adet") { errors.push({ line: ln, text: t, msg: f.name + " gram ile yazılır (ör. “100 g " + f.name.toLowerCase() + "”)." }); return; }
        if (it.unit === "kg") qty = qty * 1000;
        if (it.unit === "ml") { if (f.key === "olive_oil" || f.key === "coconut_oil") { qty = Math.round(qty * 0.92 * 10) / 10; warnings.push({ line: ln, text: t, msg: "mL, grama çevrildi (" + qty + " g)." }); } else { errors.push({ line: ln, text: t, msg: f.name + " gram ile yazılır." }); return; } }
        if (!it.unit && it.unit !== "ml") warnings.push({ line: ln, text: t, msg: "Birim yazılmadı; gram kabul edildi." });
        if (!(qty >= 1 && qty <= 2000)) { errors.push({ line: ln, text: t, msg: f.name + ": miktar 1–2000 g arasında olmalıdır." }); return; }
        qty = Math.round(qty * 10) / 10;
      }
      if (fm.warn) warnings.push({ line: ln, text: t, msg: fm.warn });
      if (!meal) newMeal(null);
      if (meal.items.length >= 30) { errors.push({ line: ln, text: t, msg: "Bir öğüne en fazla 30 besin eklenebilir." }); return; }
      meal.items.push({ food: f.key, qty: qty, note: "" }); count++;
    });
    days.forEach(function (d, i) { if (d.meals.length > mealsMax) errors.push({ line: 0, text: d.title || "", msg: (d.title ? d.title + ": " : "") + "En fazla " + mealsMax + " öğün yazılabilir." }); if (!d.title) d.title = days.length > 1 ? (i + 1) + ". Gün" : ""; });
    if (days.length > daysMax) errors.push({ line: 0, text: "", msg: "En fazla " + daysMax + " gün yazılabilir." });
    days = days.filter(function (d) { return d.meals.some(function (m) { return m.items.length; }) || d.note; });
    days.forEach(function (d) { d.meals = d.meals.filter(function (m) { return m.items.length || m.note; }); });
    var data = days.length > 1 || (days[0] && days[0].title && isDay(fold(days[0].title)))
      ? { days: days.map(function (d) { return { title: d.title, meals: d.meals, note: d.note }; }), note: general.join(" · ") }
      : { meals: days[0] ? days[0].meals : [], note: [general.join(" · "), days[0] ? days[0].note : ""].filter(Boolean).join(" · ") };
    return { data: data, errors: errors, warnings: warnings, count: count };
  }

  // ------------------------------------------------------------------ ANTRENMAN
  var GROUP_WORDS = [["chest", /\b(gogus|chest|pec)/], ["shoulder", /\b(omuz|shoulder|delt)/], ["back", /\b(sirt|back|lat)\b/], ["legs", /\b(bacak|leg|kalca|glute|baldir|calf)/], ["abs", /\b(karin|abs|core)\b/],
    ["biceps", /\b(on kol|onkol|biceps|bicep)\b/], ["triceps", /\b(arka kol|arkakol|triceps|tricep)\b/], ["cardio", /\b(kardiyo|cardio)\b/]];
  function groupsIn(fl) { return GROUP_WORDS.filter(function (g) { return g[1].test(fl); }).map(function (g) { return g[0]; }); }
  function exIndex(cat) {
    var idx = [];
    (cat.groups || []).forEach(function (g) { g.exercises.forEach(function (x) {
      var base = fold(x), plain = fold(x.replace(/\(.*?\)/g, ""));
      idx.push({ group: g.key, name: x, keys: base === plain ? [base] : [base, plain] });
    }); });
    return idx;
  }
  function matchEx(name, idx, ctxGroups) {
    var n = fold(name), best = null, bestLen = 0, exact = null;
    idx.forEach(function (e) { e.keys.forEach(function (k) {
      if (k === n && (!exact || ctxGroups.indexOf(e.group) >= 0)) exact = e;
      if (k.length > bestLen && has(n, k)) { best = e; bestLen = k.length; }
      else if (k.length === bestLen && best && has(n, k) && ctxGroups.indexOf(e.group) >= 0) best = e;
    }); });
    return exact || best;
  }
  function training(text, cat) {
    var idx = exIndex(cat), daysMax = cat.daysMax || 7, exMax = cat.exercisesMax || 20;
    var days = [], day = null, general = [], errors = [], warnings = [], count = 0;
    function newDay(title) { day = { title: title, groups: groupsIn(fold(title)), exercises: [], note: "", hint: groupsIn(fold(title)) }; days.push(day); }
    lines(text).forEach(function (line, i) {
      var ln = i + 1, t = line.trim().replace(/^[\s•\-*–]+/, ""); if (!t) return;
      var fl = fold(t), nm = /^(not|note)\s*[:\-]\s*(.+)$/i.exec(t);
      if (nm) { if (day && day.exercises.length) day.exercises[day.exercises.length - 1].note = nm[2].trim().slice(0, 200); else if (day) day.note = nm[2].trim().slice(0, 500); else general.push(nm[2].trim()); return; }
      var sr = /(\d{1,2})\s*(?:set)?\s*[x×*]\s*(\d{1,3}(?:\s*-\s*\d{1,3})?|max|tukenis|tükeniş)\b/i.exec(t)
        || /(\d{1,2})\s*set\b[^\d]*(\d{1,3}(?:\s*-\s*\d{1,3})?)\s*(?:tekrar|rep|reps)?\b/i.exec(t);
      var cm = /(\d{1,3})\s*(dk|dakika|min|minute|minutes)\b/i.exec(t);
      if (!sr && !cm) {
        var exact = idx.some(function (e) { return e.keys.indexOf(fl) >= 0; });
        if (exact && !isDay(fl)) { errors.push({ line: ln, text: t, msg: "Set × tekrar yazın (ör. “" + t + " 4x10”)." }); return; }
        if (isDay(fl) || !/\d/.test(t) || /:\s*$/.test(t)) { newDay(cleanTitle(t)); return; }
        errors.push({ line: ln, text: t, msg: "Set × tekrar (ör. “Bench Press 4x10”) ya da süre (ör. “Eliptik 20 dk”) yazın." }); return;
      }
      if (!day) newDay("1. Gün");
      var rest = (sr ? t.replace(sr[0], " ") : t.replace(cm[0], " ")).replace(/\b(set|tekrar|reps?)\b/gi, " ").replace(/[:=\-–,]+/g, " ").replace(/\s+/g, " ").trim();
      var ctx = day.hint.concat(groupsIn(fold(rest)));
      var e = matchEx(rest, idx, ctx), group, name, custom = false;
      if (e) { group = e.group; name = e.name; }
      else {
        var gs = groupsIn(fold(rest)); if (!gs.length) gs = day.hint;
        if (cm && !sr) gs = ["cardio"];
        if (gs.length !== 1 || !rest) { errors.push({ line: ln, text: t, msg: "Hareket listede bulunamadı: “" + rest + "”. Gün başlığına kas grubunu yazın (ör. “Pazartesi — Göğüs”) ya da listedeki adı kullanın." }); return; }
        group = gs[0]; name = rest.slice(0, 60); custom = true;
        warnings.push({ line: ln, text: t, msg: "“" + name + "” listede yok; " + group + " grubunda özel hareket olarak eklendi." });
      }
      if (day.exercises.length >= exMax) { errors.push({ line: ln, text: t, msg: "Bir güne en fazla " + exMax + " hareket eklenebilir." }); return; }
      if (group === "cardio") {
        var min = cm ? Number(cm[1]) : null;
        if (!(min >= 1 && min <= 300)) { errors.push({ line: ln, text: t, msg: "Kardiyo için süre yazın (ör. “20 dk”)." }); return; }
        day.exercises.push({ group: group, name: name, custom: custom, minutes: min, note: "" });
      } else {
        if (!sr) { errors.push({ line: ln, text: t, msg: "Set × tekrar yazın (ör. 4x10 ya da 3 set 8-12)." }); return; }
        var sets = Number(sr[1]), reps = fold(sr[2]).replace(/\s+/g, "");
        if (!(sets >= 1 && sets <= 20)) { errors.push({ line: ln, text: t, msg: "Set sayısı 1–20 olmalıdır." }); return; }
        reps = reps === "max" ? "MAX" : /^tukenis$/.test(reps) ? "TÜKENİŞ" : reps;
        day.exercises.push({ group: group, name: name, custom: custom, sets: sets, reps: reps, note: "" });
      }
      if (day.groups.indexOf(group) < 0) day.groups.push(group);
      count++;
    });
    if (days.length > daysMax) errors.push({ line: 0, text: "", msg: "En fazla " + daysMax + " antrenman günü yazılabilir." });
    var out = days.filter(function (d) { return d.exercises.length || d.note; }).map(function (d, i) { return { title: d.title || (i + 1) + ". Gün", groups: d.groups, exercises: d.exercises, note: d.note }; });
    return { data: { days: out, note: general.join(" · ") }, errors: errors, warnings: warnings, count: count };
  }

  // ------------------------------------------------------------------ SUPPLEMENT
  var SUPP_ALIAS = { "omega 3": "Omega-3 (Balık Yağı)", "omega3": "Omega-3 (Balık Yağı)", "balik yagi": "Omega-3 (Balık Yağı)", "fish oil": "Omega-3 (Balık Yağı)",
    "whey": "Whey Protein", "whey protein": "Whey Protein", "izolat": "Whey Protein İzolat", "whey izolat": "Whey Protein İzolat", "kazein": "Kazein",
    "kreatin": "Kreatin Monohidrat", "creatine": "Kreatin Monohidrat", "magnezyum": "Magnezyum (Sitrat / Bisglisinat)", "magnesium": "Magnezyum (Sitrat / Bisglisinat)",
    "d3": "Vitamin D3", "d vitamini": "Vitamin D3", "vitamin d": "Vitamin D3", "d3 k2": "Vitamin D3 + K2", "d3+k2": "Vitamin D3 + K2", "c vitamini": "Vitamin C", "vitamin c": "Vitamin C",
    "b12": "Vitamin B12", "b kompleks": "B Kompleks", "multi vitamin": "Multivitamin", "cinko": "Çinko", "zinc": "Çinko", "demir": "Demir", "potasyum": "Potasyum",
    "glutamin": "L-Glutamin", "karnitin": "L-Karnitin", "l karnitin": "L-Karnitin", "sitrulin": "L-Sitrülin Malat", "arjinin": "L-Arjinin", "kafein": "Kafein", "pre workout": "Pre-Workout",
    "elektrolit": "Elektrolit", "kolajen": "Kolajen", "collagen": "Kolajen", "probiyotik": "Probiyotik", "q10": "Koenzim Q10", "coq10": "Koenzim Q10", "zerdecal": "Zerdeçal (Kurkumin)", "kurkumin": "Zerdeçal (Kurkumin)",
    "psyllium": "Psyllium (Lif)", "melatonin": "Melatonin", "ashwagandha": "Ashwagandha", "nac": "NAC", "ala": "Alfa Lipoik Asit", "beta alanin": "Beta-Alanin", "taurin": "Taurin", "bcaa": "BCAA", "eaa": "EAA" };
  var UNIT_RX = /^(g|gr|gram|mg|mcg|µg|μg|iu|iu|ui|kapsul|kapsül|softgel|tablet|tb|olcek|ölçek|scoop|ml|damla)$/i;
  function unitOf(u) {
    var f = fold(u);
    if (/^(g|gr|gram)$/.test(f)) return "g"; if (f === "mg") return "mg"; if (/^(mcg|µg|μg)$/.test(f)) return "mcg"; if (/^(iu|ui)$/.test(f)) return "IU";
    if (/^(kapsul|softgel)$/.test(f)) return "kapsül"; if (/^(tablet|tb)$/.test(f)) return "tablet"; if (/^(olcek|scoop)$/.test(f)) return "ölçek"; if (f === "ml") return "mL"; if (f === "damla") return "damla";
    return null;
  }
  var WHEN = [["pre", /\b(antrenman oncesi|antrenmandan once|pre ?workout|pre)\b/], ["intra", /\b(antrenman sirasinda|antrenman esnasinda|intra)\b/], ["post", /\b(antrenman sonrasi|antrenmandan sonra|post ?workout|post)\b/],
    ["night", /\b(yatmadan once|yatarken|gece|aksam|night|bedtime)\b/], ["meal", /\b(ogunle|yemekle|yemekten sonra|with meal)\b/], ["morning", /\b(sabah|morning)\b/]];
  function suppIndex(cat) {
    var idx = [];
    (cat.supps || []).forEach(function (g) { g.items.forEach(function (x) { idx.push({ group: g.key, name: x, keys: [fold(x), fold(x.replace(/\(.*?\)/g, ""))] }); }); });
    return idx;
  }
  function supplement(text, cat) {
    var idx = suppIndex(cat), byName = {}; idx.forEach(function (e) { byName[e.name] = e; });
    var items = [], errors = [], warnings = [], general = [], count = 0, max = cat.itemsMax || 40;
    lines(text).forEach(function (line, i) {
      var ln = i + 1, t = line.trim().replace(/^[\s•\-*–]+/, ""); if (!t) return;
      var nm = /^(not|note)\s*[:\-]\s*(.+)$/i.exec(t);
      if (nm) { if (items.length) items[items.length - 1].note = nm[2].trim().slice(0, 200); else general.push(nm[2].trim()); return; }
      var fl = fold(t);
      if (!/\d/.test(t) && /:\s*$/.test(t)) return;   // başlık satırı (ör. "Supplement programı:")
      var when = WHEN.filter(function (w) { return w[1].test(fl); }).map(function (w) { return w[0]; });
      var state = /\b(ac karnina|ac karna|aclik|fasted)\b/.test(fl) ? "fasted" : /\b(tok karnina|tokluk|yemekle|ogunle|fed)\b/.test(fl) ? "fed" : "any";
      var tm = /\bgunde\s*(\d)\b/.exec(fl) || /\b(\d)\s*(kez|defa|kere|times)\b/.exec(fl) || /\bx\s*(\d)\b/.exec(fl);
      var am = new RegExp(NUM + "\\s*(mg|mcg|µg|μg|iu|ui|g|gr|gram|kapsul|kapsül|softgel|tablet|tb|olcek|ölçek|scoop|ml|damla)\\b", "i").exec(t);
      // ad: zaman / durum / miktar / sıklık ifadeleri çıkarılır
      var rest = fl.replace(/\bgunde\s*\d\b|\b\d\s*(kez|defa|kere|times)\b|\bx\s*\d\b/g, " ");
      WHEN.forEach(function (w) { rest = rest.replace(w[1], " "); });
      rest = rest.replace(/\b(ac karnina|ac karna|aclik|fasted|tok karnina|tokluk|yemekle|ogunle|fed|once|sonra|ile)\b/g, " ");
      if (am) rest = rest.replace(fold(am[0]), " ");
      rest = rest.replace(/\s+/g, " ").trim();
      var e = null, bestLen = 0;
      Object.keys(SUPP_ALIAS).forEach(function (a) { if (a.length > bestLen && has(rest, a) && byName[SUPP_ALIAS[a]]) { e = byName[SUPP_ALIAS[a]]; bestLen = a.length; } });
      idx.forEach(function (x) { x.keys.forEach(function (k) { if (k && k.length > bestLen && has(rest, k)) { e = x; bestLen = k.length; } }); });
      if (!e) { errors.push({ line: ln, text: t, msg: "Supplement listede bulunamadı: “" + (rest || t) + "”." }); return; }
      var amount = am ? numOf(am[1]) : null, unit = am ? unitOf(am[2]) : null;
      if (am && !(amount > 0 && amount <= 100000)) { errors.push({ line: ln, text: t, msg: "Miktar geçersiz." }); return; }
      var times = tm ? Number(tm[1]) : null;
      if (times !== null && !(times >= 1 && times <= 6)) { errors.push({ line: ln, text: t, msg: "Günde kullanım 1–6 olmalıdır." }); return; }
      // aynı supplement yeniden yazıldıysa (ör. sabah ve akşam): tek kalemde birleştirilir
      var prev = items.filter(function (x) { return x.name === e.name && x.amount === amount && x.unit === (unit || x.unit); })[0];
      if (prev && !tm) {
        prev.times = Math.min(6, prev.times + 1);
        when.forEach(function (w) { if (prev.when.indexOf(w) < 0) prev.when.push(w); });
        warnings.push({ line: ln, text: t, msg: e.name + " önceki satırla birleştirildi (günde " + prev.times + " kez)." });
        return;
      }
      if (items.length >= max) { errors.push({ line: ln, text: t, msg: "En fazla " + max + " kalem eklenebilir." }); return; }
      if (!am) warnings.push({ line: ln, text: t, msg: "Miktar yazılmadı; yalnız kullanım zamanı eklendi." });
      items.push({ group: e.group, name: e.name, amount: amount, unit: unit || (cat.suppUnits || ["g"])[0], times: times || Math.max(1, when.filter(function (w) { return w !== "meal"; }).length) || 1, state: state, when: when, note: "" });
      count++;
    });
    return { data: { items: items, note: general.join(" · ") }, errors: errors, warnings: warnings, count: count };
  }

  return { nutrition: nutrition, training: training, supplement: supplement, fold: fold, kinds: ["nutrition", "training", "supplement"] };
});
