/* AlpveFit — yapılandırılmış planlar: gösterim (üye paneli + uzman önizlemesi) ve oluşturucu (uzman / yönetici paneli).
   Katalog sunucudan gelir (GET /api/plan-catalog veya /api/admin/plan-catalog). Hesaplar (makro, hacim, mL) burada yalnız GÖSTERİM içindir;
   kaydedilen veri sunucuda ayrıca doğrulanır. Sistem içerik önermez: tüm seçimleri ve değerleri planı hazırlayan uzman girer. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var CAT = null, catP = null;
  AVF.planCatalog = function (admin) {
    if (CAT) return Promise.resolve(CAT);
    if (!catP) catP = AVF.api("GET", (admin ? "/admin" : "") + "/plan-catalog").then(function (c) { CAT = c; return c; }, function (e) { catP = null; throw e; });
    return catP;
  };
  function nf(x, d) { if (x === null || x === undefined || !isFinite(x)) return "—"; try { return new Intl.NumberFormat(AVF.lang === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: d === undefined ? 1 : d }).format(x); } catch (e) { return String(x); } }
  var LB = 453.59237;
  function EN() { return AVF.lang === "en"; }
  function T(x) { return AVF.t ? AVF.t(x) : x; }   // katalog adları: sözlükten (sayılı metinler data-notr olduğundan önceden çevrilir)
  function mtxt(mc) { return nf(mc.kcal, 0) + " kcal · P " + nf(mc.p) + (EN() ? " · C " : " · K ") + nf(mc.c) + (EN() ? " · F " : " · Y ") + nf(mc.f); }
  function foodOf(k) { return (CAT.foods || []).filter(function (f) { return f.key === k; })[0]; }
  function grams(f, qty) { return f.unit === "adet" ? qty * f.pieceG : qty; }
  function macro(f, qty) { var g = grams(f, qty), r = g / 100; return { g: g, kcal: f.kcal * r, p: f.protein * r, c: f.carb * r, f: f.fat * r }; }
  function sum(list) { return list.reduce(function (a, m) { return { g: a.g + m.g, kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }; }, { g: 0, kcal: 0, p: 0, c: 0, f: 0 }); }
  function mealName(i, n) { return i === 0 ? CAT.firstMeal : i === n - 1 ? CAT.lastMeal : (EN() ? "Meal " + (i + 1) : (i + 1) + ". Öğün"); }
  function macroBar(t, big) {
    return h("div", { class: "mbar" + (big ? " big" : "") },
      h("span", { class: "mb-k" }, AVF.icon("flame"), h("b", { "data-notr": "", text: nf(t.kcal, 0) }), h("small", { text: "kcal" })),
      h("span", null, h("i", { class: "dot p" }), h("small", { text: "Protein" }), h("b", { "data-notr": "", text: nf(t.p) + " g" })),
      h("span", null, h("i", { class: "dot c" }), h("small", { text: "Karbonhidrat" }), h("b", { "data-notr": "", text: nf(t.c) + " g" })),
      h("span", null, h("i", { class: "dot f" }), h("small", { text: "Yağ" }), h("b", { "data-notr": "", text: nf(t.f) + " g" })));
  }
  function qtyText(f, qty) {
    if (f.unit === "adet") return qty + (EN() ? " pcs (≈ " : " adet (≈ ") + nf(qty * f.pieceG, 0) + " g)";
    return nf(qty, 1) + " g · " + nf(qty / LB, 2) + " lbs";
  }
  function noteBox(t) { return t ? h("p", { class: "pl-note" }, AVF.icon("notes"), h("span", { "data-notr": "", text: t })) : null; }
  function repsAvg(r) { var m = /^(\d+)(?:-(\d+))?$/.exec(String(r || "")); return m ? (m[2] ? (Number(m[1]) + Number(m[2])) / 2 : Number(m[1])) : 0; }
  function groupOf(k) { return (CAT.groups || []).filter(function (g) { return g.key === k; })[0]; }
  function label(list, k) { var x = (list || []).filter(function (a) { return a[0] === k; })[0]; return x ? x[1] : k; }
  function phGroup(k) { return (CAT.pharma || []).filter(function (g) { return g.key === k; })[0]; }
  function mgOf(dose, unit) { return unit === "mcg" ? dose / 1000 : unit === "mg" ? dose : null; }
  /** Farmakoloji kalemi hesabı: uygulama başına mL, insülin şırıngası birimi, haftalık toplam. */
  AVF.pharmaCalc = function (it) {
    var g = phGroup(it.group) || {}, out = {}, per = CAT.freqPerWeek[it.freq];
    if (it.dose && per) out.weekly = it.dose * per;
    var mg = it.dose ? mgOf(it.dose, it.unit) : null, conc = null;
    if (g.mode === "inj" && it.conc) conc = it.conc;
    if (g.mode === "pep" && it.vialMg && it.bacMl) { conc = it.vialMg / it.bacMl; out.conc = conc; }
    if (conc && mg) { out.ml = mg / conc; out.units = out.ml * 100; }
    return out;
  };

  // ================================================================== GÖSTERİM
  AVF.planDataView = function (kind, d) {
    if (!d || !CAT) return null;
    var V = { nutrition: nutritionView, training: trainingView, supplement: suppView, pharmacology: pharmaView, notes: notesView }[kind];
    return V ? h("div", { class: "pl-view" }, V(d), noteBox(d.note)) : null;
  };
  function nutritionView(d) {
    var n = d.meals.length, all = [];
    var meals = d.meals.map(function (m, i) {
      var rows = m.items.map(function (it) { var f = foodOf(it.food); if (!f) return null; var mc = macro(f, it.qty); all.push(mc); return { f: f, it: it, mc: mc }; }).filter(Boolean);
      var t = sum(rows.map(function (r) { return r.mc; }));
      return h("section", { class: "pl-card" }, h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon(i === 0 ? "clock" : i === n - 1 ? "pause" : "utensils")), h("div", null, h("b", { text: mealName(i, n) }), h("small", { "data-notr": "", text: nf(t.kcal, 0) + " kcal" }))),
        h("ul", { class: "pl-list" }, rows.map(function (r) {
          return h("li", null, h("span", { class: "pl-n" }, AVF.icon(r.f.group === "protein" ? "egg" : r.f.group === "fat" ? "drop" : r.f.group === "fruit" ? "apple" : "utensils"), h("span", { text: r.f.name })),
            h("b", { "data-notr": "", text: qtyText(r.f, r.it.qty) }), h("small", { class: "pl-m", "data-notr": "", text: mtxt(r.mc) }), r.it.note ? h("small", { class: "pl-in", "data-notr": "", text: r.it.note }) : null);
        })), macroBar(t), noteBox(m.note));
    });
    return [h("div", { class: "pl-total" }, h("b", { text: "Günlük toplam" }), macroBar(sum(all), true), h("small", { class: "hint", text: "Tüm besinler çiğ (pişirilmeden önceki) ağırlıktır. Besin değerleri: USDA FoodData Central." })), meals];
  }
  function trainingView(d) {
    return d.days.map(function (dy) {
      var sets = 0, ton = 0, perG = {};
      dy.exercises.forEach(function (e) { if (e.group === "cardio") return; sets += e.sets; perG[e.group] = (perG[e.group] || 0) + e.sets; if (e.weight) ton += e.sets * repsAvg(e.reps) * e.weight; });
      return h("section", { class: "pl-card" },
        h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon("dumb")), h("div", null, h("b", { "data-notr": "", text: dy.title }), h("small", { text: dy.groups.map(function (k) { var g = groupOf(k); return g ? g.name.replace(" Antrenmanı", "").replace(" Egzersizi", "") : k; }).join(" · ") }))),
        h("div", { class: "pl-chips" }, dy.groups.map(function (k) { var g = groupOf(k); return g ? h("span", { class: "chip" }, AVF.icon(g.icon), g.name) : null; })),
        h("ul", { class: "pl-list" }, dy.exercises.map(function (e) {
          var g = groupOf(e.group);
          return h("li", null, h("span", { class: "pl-n" }, AVF.icon(g ? g.icon : "dumb"), h("span", { "data-notr": "", text: e.name })),
            h("b", { "data-notr": "", text: e.group === "cardio" ? e.minutes + (EN() ? " min" : " dk") : e.sets + (EN() ? " sets × " : " set × ") + e.reps + (e.weight ? " · " + nf(e.weight) + " kg" : "") }),
            e.note ? h("small", { class: "pl-in", "data-notr": "", text: e.note }) : null);
        })),
        h("div", { class: "pl-vol" }, h("span", null, AVF.icon("layers"), h("small", { text: "Toplam set" }), h("b", { "data-notr": "", text: String(sets) })),
          Object.keys(perG).map(function (k) { var g = groupOf(k); return h("span", null, AVF.icon(g ? g.icon : "dumb"), h("small", { text: g ? g.name.replace(" Antrenmanı", "") : k }), h("b", { "data-notr": "", text: perG[k] + (EN() ? " sets" : " set") })); }),
          ton ? h("span", null, AVF.icon("weight"), h("small", { text: "Hacim (tonaj)" }), h("b", { "data-notr": "", text: nf(ton, 0) + " kg" })) : null),
        noteBox(dy.note));
    });
  }
  function suppView(d) {
    return h("ul", { class: "pl-list pl-card" }, d.items.map(function (it) {
      var g = (CAT.supps || []).filter(function (x) { return x.key === it.group; })[0];
      return h("li", null, h("span", { class: "pl-n" }, AVF.icon(g ? g.icon : "pill"), h("span", { text: it.name })),
        h("b", { "data-notr": "", text: (it.amount ? nf(it.amount, 3) + " " + T(it.unit) + " · " : "") + (EN() ? it.times + "× a day" : "günde " + it.times + " kez") }),
        h("small", { class: "pl-m", text: [label(CAT.suppState, it.state)].concat(it.when.map(function (w) { return label(CAT.suppWhen, w); })).join(" · ") }),
        it.note ? h("small", { class: "pl-in", "data-notr": "", text: it.note }) : null);
    }));
  }
  function pharmaView(d) {
    return h("div", null, h("p", { class: "note" }, "Bu bölüm koçunuz tarafından size özel hazırlanmıştır; değerleri değiştirmeyin ve sağlığınızla ilgili her durumda hekiminize danışın."),
      h("ul", { class: "pl-list pl-card" }, d.items.map(function (it) {
        var g = phGroup(it.group) || {}, c = AVF.pharmaCalc(it);
        var parts = [];
        if (it.dose) parts.push(nf(it.dose, 4) + " " + it.unit);
        parts.push(T(label(CAT.pharmaFreq, it.freq)));
        if (it.weeks) parts.push(it.weeks + (EN() ? " weeks" : " hafta"));
        return h("li", null, h("span", { class: "pl-n" }, AVF.icon(g.icon || "pill"), h("span", { text: it.name })), h("b", { "data-notr": "", text: parts.join(" · ") }),
          c.ml ? h("small", { class: "pl-m", "data-notr": "", text: (EN() ? "Per application " : "Uygulama başına ") + nf(c.ml, 3) + " mL" + (g.mode === "pep" ? " (" + nf(c.units, 1) + (EN() ? " units, U-100 syringe)" : " ünite, U-100 şırınga)") : "") + (c.conc ? " · " + nf(c.conc, 3) + " mg/mL" : "") }) : null,
          c.weekly ? h("small", { class: "pl-m", "data-notr": "", text: (EN() ? "Weekly total: " : "Haftalık toplam: ") + nf(c.weekly, 3) + " " + it.unit }) : null,
          it.note ? h("small", { class: "pl-in", "data-notr": "", text: it.note }) : null);
      })));
  }
  function notesView(d) {
    return h("div", { class: "pl-grid" }, Object.keys(CAT.notes).map(function (k) {
      var f = CAT.notes[k], v = d.values && d.values[k], t = d.notes && d.notes[k];
      if (!v && !t) return null;
      return h("section", { class: "pl-card" }, h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon(f.icon)), h("div", null, h("small", { text: f.label }), h("b", { text: v || "—" }))), noteBox(t));
    }));
  }

  // ================================================================== OLUŞTURUCU (uzman / yönetici)
  function ta(val, ph, max) { var t = h("textarea", { class: "inp", rows: "2", maxlength: String(max || 500), placeholder: ph || "Not (isteğe bağlı)" }); t.value = val || ""; return t; }
  function numIn(val, ph, w) { var i = AVF.numInput({ placeholder: ph || "", style: w ? "max-width:" + w : "" }, 3); i.value = val === null || val === undefined ? "" : String(val); return i; }
  function sel(opts, val, lab) { var s = h("select", { class: "inp", "aria-label": lab || "" }, opts.map(function (o) { return h("option", { value: o[0], text: o[1] }); })); if (val !== undefined && val !== null) s.value = String(val); return s; }
  function xBtn(fn, lab) { return h("button", { class: "fb-x", type: "button", "aria-label": lab || "Kaldır", onclick: fn }, AVF.icon("x")); }
  function addBtn(text, fn, icon) { return h("button", { class: "btn ghost sm", type: "button", onclick: fn }, AVF.icon(icon || "plus", "bico"), text); }

  AVF.planEditor = function (kind, data, onChange) {
    var E = { nutrition: nutritionEd, training: trainingEd, supplement: suppEd, pharmacology: pharmaEd, notes: notesEd }[kind];
    var wrap = h("div", { class: "pl-ed" });
    if (!E) return null;
    var api = E(wrap, data ? JSON.parse(JSON.stringify(data)) : null, onChange || function () {});
    wrap.get = api.get; return wrap;
  };

  // ---- beslenme
  function nutritionEd(root, d, changed) {
    d = d || { meals: [{ items: [], note: "" }, { items: [], note: "" }], note: "" };
    var total = h("div", { class: "pl-total" }), list = h("div", { class: "stack" }), gnote = ta(d.note, "Genel not (isteğe bağlı)");
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    var foodOpts = CAT.foodGroups.map(function (gr) { return h("optgroup", { label: gr[1] }, CAT.foods.filter(function (f) { return f.group === gr[0]; }).map(function (f) { return h("option", { value: f.key, text: f.name + (f.unit === "adet" ? " (adet)" : " (g)") }); })); });
    function paint() {
      var all = [];
      AVF.mount(list, d.meals.map(function (m, i) {
        var mm = m.items.map(function (it) { var f = foodOf(it.food); return f && it.qty ? macro(f, Number(it.qty) || 0) : { g: 0, kcal: 0, p: 0, c: 0, f: 0 }; });
        all = all.concat(mm);
        var addSel = h("select", { class: "inp", "aria-label": "Besin seç" }, h("option", { value: "", text: "Besin ekle…" }), foodOpts.map(function (o) { return o.cloneNode(true); }));
        addSel.addEventListener("change", function () { if (!addSel.value) return; var f = foodOf(addSel.value); m.items.push({ food: f.key, qty: f.unit === "adet" ? 1 : 100, note: "" }); paint(); changed(); });
        var mn = ta(m.note, "Öğün notu (isteğe bağlı)"); mn.addEventListener("input", function () { m.note = mn.value; changed(); });
        return h("section", { class: "pl-card" },
          h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon("utensils")), h("div", null, h("b", { text: mealName(i, d.meals.length) }), h("small", { text: i === 0 || i === d.meals.length - 1 ? "Sabit ad" : "Ara öğün" })),
            d.meals.length > 1 ? xBtn(function () { d.meals.splice(i, 1); paint(); changed(); }, "Öğünü kaldır") : null),
          h("div", { class: "pl-rows" }, m.items.map(function (it, j) {
            var f = foodOf(it.food), q = numIn(it.qty, f.unit === "adet" ? "adet" : "g", "110px"), out = h("small", { class: "pl-m", "data-notr": "" }), nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: it.note || "" });
            function upd() { var v = Number(q.value) || 0, mc = macro(f, v); out.textContent = (f.unit === "adet" ? "≈ " + nf(mc.g, 0) + " g · " : nf(v / LB, 2) + " lbs · ") + mtxt(mc); }
            q.addEventListener("input", function () { it.qty = q.value === "" ? "" : Number(q.value); upd(); changed(); });
            q.addEventListener("change", paint);
            nt.addEventListener("input", function () { it.note = nt.value; changed(); });
            upd();
            return h("div", { class: "pl-row" }, h("span", { class: "pl-n" }, AVF.icon(f.group === "protein" ? "egg" : f.group === "fat" ? "drop" : f.group === "fruit" ? "apple" : "utensils"), h("span", { text: f.name })),
              h("label", { class: "pl-q" }, q, h("span", { text: f.unit === "adet" ? "adet" : "g" })), out, nt, xBtn(function () { m.items.splice(j, 1); paint(); changed(); }));
          })), addSel, macroBar(sum(mm)), mn);
      }), h("div", { class: "row" }, d.meals.length < CAT.mealsMax ? addBtn("Öğün ekle", function () { d.meals.splice(Math.max(1, d.meals.length - 1), 0, { items: [], note: "" }); if (d.meals.length === 1) d.meals.push({ items: [], note: "" }); paint(); changed(); }) : null,
        h("small", { class: "hint", "data-notr": "", text: EN() ? d.meals.length + " / " + CAT.mealsMax + " meals · the first meal is always “" + T(CAT.firstMeal) + "”, the last “" + T(CAT.lastMeal) + "”." : d.meals.length + " / " + CAT.mealsMax + " öğün · İlk öğün “" + CAT.firstMeal + "”, son öğün “" + CAT.lastMeal + "” adını taşır." })));
      AVF.mount(total, h("b", { text: "Günlük toplam" }), macroBar(sum(all), true), h("small", { class: "hint", text: "Tüm besinler çiğ ağırlıktır. Yumurta adet, diğerleri gram olarak girilir; üyeye gram ve lbs olarak gösterilir." }));
    }
    paint();
    AVF.mount(root, total, list, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return { meals: d.meals.map(function (m) { return { items: m.items.filter(function (it) { return it.qty !== "" && it.qty !== null; }), note: m.note }; }), note: d.note }; } };
  }

  // ---- antrenman
  function trainingEd(root, d, changed) {
    d = d || { days: [{ title: "1. Gün", groups: [], exercises: [], note: "" }], note: "" };
    var list = h("div", { class: "stack" }), gnote = ta(d.note, "Genel not (isteğe bağlı)");
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    function paint() {
      AVF.mount(list, d.days.map(function (dy, i) {
        var title = AVF.input("text", { maxlength: "60", value: dy.title, placeholder: (i + 1) + ". Gün" });
        title.addEventListener("input", function () { dy.title = title.value; changed(); });
        var chips = h("div", { class: "pl-gsel", role: "group", "aria-label": "Kas grupları" }, CAT.groups.map(function (g) {
          var on = dy.groups.indexOf(g.key) >= 0;
          return h("button", { type: "button", class: "ch" + (on ? " on" : ""), "aria-pressed": String(on), onclick: function () {
            if (on) { dy.groups = dy.groups.filter(function (x) { return x !== g.key; }); dy.exercises = dy.exercises.filter(function (e) { return e.group !== g.key; }); } else dy.groups.push(g.key);
            paint(); changed();
          } }, h("span", { class: "chi" }, AVF.icon(g.icon)), h("span", { text: g.name.replace(" Antrenmanı", "").replace(" Egzersizi", "") }));
        }));
        var secs = dy.groups.map(function (gk) {
          var g = groupOf(gk), rows = dy.exercises.map(function (e, j) { return e.group === gk ? exRow(dy, e, j) : null; }).filter(Boolean);
          var add = h("select", { class: "inp", "aria-label": g.name + " hareket ekle" }, h("option", { value: "", text: "Hareket ekle…" }), g.exercises.map(function (x) { return h("option", { value: x, text: x }); }), h("option", { value: "__custom", text: "Listede yok — özel hareket" }));
          add.addEventListener("change", function () {
            if (!add.value) return; var custom = add.value === "__custom";
            dy.exercises.push(gk === "cardio" ? { group: gk, name: custom ? "" : add.value, custom: custom, minutes: 20, note: "" } : { group: gk, name: custom ? "" : add.value, custom: custom, sets: 3, reps: "10", weight: "", note: "" });
            paint(); changed();
          });
          return h("div", { class: "pl-gsec" }, h("h5", null, AVF.icon(g.icon), g.name), h("div", { class: "pl-rows" }, rows), add);
        });
        var vol = h("div", { class: "pl-vol" });
        function paintVol() {
          var sets = 0, ton = 0, reps = 0, perG = {};
          dy.exercises.forEach(function (e) { if (e.group === "cardio") return; var s = Number(e.sets) || 0, r = repsAvg(e.reps); sets += s; reps += s * r; perG[e.group] = (perG[e.group] || 0) + s; if (e.weight) ton += s * r * Number(e.weight); });
          AVF.mount(vol, h("span", null, AVF.icon("layers"), h("small", { text: "Toplam set" }), h("b", { "data-notr": "", text: String(sets) })), h("span", null, AVF.icon("refresh"), h("small", { text: "Toplam tekrar" }), h("b", { "data-notr": "", text: nf(reps, 0) })),
            Object.keys(perG).map(function (k) { var g = groupOf(k); return h("span", null, AVF.icon(g.icon), h("small", { text: g.name.replace(" Antrenmanı", "") }), h("b", { "data-notr": "", text: perG[k] + (EN() ? " sets" : " set") })); }),
            h("span", null, AVF.icon("weight"), h("small", { text: "Hacim (tonaj)" }), h("b", { "data-notr": "", text: nf(ton, 0) + " kg" })));
        }
        dy._vol = paintVol; paintVol();
        var dn = ta(dy.note, "Gün notu (isteğe bağlı)"); dn.addEventListener("input", function () { dy.note = dn.value; changed(); });
        return h("section", { class: "pl-card" }, h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon("dumb")), title, d.days.length > 1 ? xBtn(function () { d.days.splice(i, 1); paint(); changed(); }, "Günü kaldır") : null),
          h("p", { class: "hint", text: "Kas gruplarını seçin (birden fazla seçilebilir):" }), chips, secs, vol, dn);
      }), h("div", { class: "row" }, d.days.length < CAT.daysMax ? addBtn("Gün ekle", function () { d.days.push({ title: (d.days.length + 1) + ". Gün", groups: [], exercises: [], note: "" }); paint(); changed(); }) : null));
    }
    function exRow(dy, e, j) {
      var name = e.custom ? AVF.input("text", { maxlength: "60", value: e.name, placeholder: "Hareket adı" }) : h("span", { text: e.name });
      if (e.custom) name.addEventListener("input", function () { e.name = name.value; changed(); });
      var nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: e.note || "" }); nt.addEventListener("input", function () { e.note = nt.value; changed(); });
      var rm = xBtn(function () { dy.exercises.splice(j, 1); paint(); changed(); });
      if (e.group === "cardio") {
        var mi = numIn(e.minutes, "dk", "90px"); mi.addEventListener("input", function () { e.minutes = Number(mi.value) || ""; changed(); });
        return h("div", { class: "pl-row" }, h("span", { class: "pl-n" }, AVF.icon("pulse"), name), h("label", { class: "pl-q" }, mi, h("span", { text: "dk" })), nt, rm);
      }
      var st = sel([1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(function (x) { return [String(x), x + " set"]; }), e.sets, "Set");
      var rp = AVF.input("text", { maxlength: "9", value: e.reps, placeholder: "10 / 8-12", "aria-label": "Tekrar", style: "max-width:110px" });
      var wt = numIn(e.weight, "kg", "90px");
      st.addEventListener("change", function () { e.sets = Number(st.value); changed(); if (dy._vol) dy._vol(); });
      rp.addEventListener("input", function () { e.reps = rp.value.trim(); changed(); if (dy._vol) dy._vol(); });
      wt.addEventListener("input", function () { e.weight = wt.value === "" ? "" : Number(wt.value); changed(); if (dy._vol) dy._vol(); });
      return h("div", { class: "pl-row" }, h("span", { class: "pl-n" }, AVF.icon("dumb"), name), st, h("label", { class: "pl-q" }, rp, h("span", { text: "tekrar" })), h("label", { class: "pl-q" }, wt, h("span", { text: "kg" })), nt, rm);
    }
    paint();
    AVF.mount(root, list, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return { days: d.days.map(function (dy) { return { title: dy.title, groups: dy.groups, exercises: dy.exercises, note: dy.note }; }), note: d.note }; } };
  }

  // ---- supplement
  function suppEd(root, d, changed) {
    d = d || { items: [], note: "" };
    var list = h("div", { class: "pl-rows" }), gnote = ta(d.note, "Genel not (isteğe bağlı)"), cur = CAT.supps[0].key;
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    var tabs = h("div", { class: "pl-gsel" }), add = h("select", { class: "inp", "aria-label": "Supplement ekle" });
    function paintTabs() {
      AVF.mount(tabs, CAT.supps.map(function (g) { return h("button", { type: "button", class: "ch" + (g.key === cur ? " on" : ""), onclick: function () { cur = g.key; paintTabs(); } }, h("span", { class: "chi" }, AVF.icon(g.icon)), h("span", { text: g.name })); }));
      var g = CAT.supps.filter(function (x) { return x.key === cur; })[0];
      AVF.mount(add, h("option", { value: "", text: g.name + " — ekle…" }), g.items.map(function (x) { return h("option", { value: x, text: x }); }));
    }
    add.addEventListener("change", function () { if (!add.value) return; d.items.push({ group: cur, name: add.value, amount: "", unit: "g", times: 1, state: "any", when: [], note: "" }); add.value = ""; paint(); changed(); });
    function paint() {
      AVF.mount(list, d.items.length ? d.items.map(function (it, i) {
        var g = CAT.supps.filter(function (x) { return x.key === it.group; })[0];
        var am = numIn(it.amount, "Miktar", "100px"), un = sel(CAT.suppUnits.map(function (u) { return [u, u]; }), it.unit, "Birim"), tm = sel([1, 2, 3, 4, 5, 6].map(function (x) { return [String(x), "Günde " + x]; }), it.times, "Günde kaç kez");
        var stt = h("div", { class: "useg seg3", role: "radiogroup", "aria-label": "Açlık / tokluk" }, CAT.suppState.map(function (s) {
          return h("button", { type: "button", "aria-pressed": String(it.state === s[0]), onclick: function () { it.state = s[0]; paint(); changed(); } }, s[1]);
        }));
        var whens = h("div", { class: "pl-when" }, CAT.suppWhen.map(function (w) {
          var c = h("input", { type: "checkbox", checked: it.when.indexOf(w[0]) >= 0 });
          c.addEventListener("change", function () { it.when = c.checked ? it.when.concat([w[0]]) : it.when.filter(function (x) { return x !== w[0]; }); changed(); });
          return h("label", { class: "check" }, c, w[1]);
        }));
        var nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: it.note || "" });
        am.addEventListener("input", function () { it.amount = am.value === "" ? "" : Number(am.value); changed(); });
        un.addEventListener("change", function () { it.unit = un.value; changed(); });
        tm.addEventListener("change", function () { it.times = Number(tm.value); changed(); });
        nt.addEventListener("input", function () { it.note = nt.value; changed(); });
        return h("div", { class: "pl-row pl-wide" }, h("span", { class: "pl-n" }, AVF.icon(g ? g.icon : "pill"), h("span", { text: it.name })), am, un, tm, stt, whens, nt, xBtn(function () { d.items.splice(i, 1); paint(); changed(); }));
      }) : h("p", { class: "hint", text: "Henüz kalem eklenmedi. Kategori seçip listeden ekleyin." }));
    }
    paintTabs(); paint();
    AVF.mount(root, tabs, add, list, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return { items: d.items, note: d.note }; } };
  }

  // ---- farmakoloji
  function pharmaEd(root, d, changed) {
    d = d || { items: [], note: "" };
    var list = h("div", { class: "pl-rows" }), gnote = ta(d.note, "Genel not (isteğe bağlı)"), cur = CAT.pharma[0].key;
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    var tabs = h("div", { class: "pl-gsel" }), add = h("select", { class: "inp", "aria-label": "Madde ekle" });
    function paintTabs() {
      AVF.mount(tabs, CAT.pharma.map(function (g) { return h("button", { type: "button", class: "ch" + (g.key === cur ? " on" : ""), onclick: function () { cur = g.key; paintTabs(); } }, h("span", { class: "chi" }, AVF.icon(g.icon)), h("span", { text: g.name })); }));
      var g = phGroup(cur);
      AVF.mount(add, h("option", { value: "", text: g.name + " — ekle…" }), g.items.map(function (x) { return h("option", { value: x, text: x }); }));
    }
    add.addEventListener("change", function () { if (!add.value) return; d.items.push({ group: cur, name: add.value, dose: "", unit: "mg", freq: "w1", weeks: "", conc: "", vialMg: "", bacMl: "", note: "" }); add.value = ""; paint(); changed(); });
    function paint() {
      AVF.mount(list, d.items.length ? d.items.map(function (it, i) {
        var g = phGroup(it.group) || {}, calc = h("small", { class: "pl-m", "data-notr": "" });
        function upd() {
          var c = AVF.pharmaCalc(it), t = [];
          if (c.conc) t.push(nf(c.conc, 3) + " mg/mL");
          if (c.ml) t.push((EN() ? "per application " : "uygulama başına ") + nf(c.ml, 3) + " mL" + (g.mode === "pep" ? " (" + nf(c.units, 1) + (EN() ? " units)" : " ünite)") : ""));
          if (c.weekly) t.push((EN() ? "weekly " : "haftalık ") + nf(c.weekly, 3) + " " + it.unit);
          calc.textContent = t.join(" · ") || T(g.mode === "inj" ? "mL hesabı için doz ve konsantrasyon girin." : g.mode === "pep" ? "mL hesabı için doz, şişe miktarı ve BAC girin." : "");
        }
        var ds = numIn(it.dose, "Doz", "100px"), un = sel(CAT.doseUnits.map(function (u) { return [u, u]; }), it.unit, "Birim"), fq = sel(CAT.pharmaFreq, it.freq, "Sıklık"), wk = numIn(it.weeks, "hafta", "80px");
        var extra = [];
        if (g.mode === "inj") { var cc = numIn(it.conc, "mg/mL", "100px"); cc.addEventListener("input", function () { it.conc = cc.value === "" ? "" : Number(cc.value); upd(); changed(); }); extra.push(h("label", { class: "pl-q" }, cc, h("span", { text: "mg/mL" }))); }
        if (g.mode === "pep") {
          var vm = numIn(it.vialMg, "şişe mg", "90px"), bm = numIn(it.bacMl, "BAC mL", "90px");
          vm.addEventListener("input", function () { it.vialMg = vm.value === "" ? "" : Number(vm.value); upd(); changed(); });
          bm.addEventListener("input", function () { it.bacMl = bm.value === "" ? "" : Number(bm.value); upd(); changed(); });
          extra.push(h("label", { class: "pl-q" }, vm, h("span", { text: "mg şişe" })), h("label", { class: "pl-q" }, bm, h("span", { text: "mL BAC" })));
        }
        var nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: it.note || "" });
        ds.addEventListener("input", function () { it.dose = ds.value === "" ? "" : Number(ds.value); upd(); changed(); });
        un.addEventListener("change", function () { it.unit = un.value; upd(); changed(); });
        fq.addEventListener("change", function () { it.freq = fq.value; upd(); changed(); });
        wk.addEventListener("input", function () { it.weeks = wk.value === "" ? "" : Number(wk.value); changed(); });
        nt.addEventListener("input", function () { it.note = nt.value; changed(); });
        upd();
        return h("div", { class: "pl-row pl-wide" }, h("span", { class: "pl-n" }, AVF.icon(g.icon || "pill"), h("span", { text: it.name })), h("label", { class: "pl-q" }, ds, un), fq, h("label", { class: "pl-q" }, wk, h("span", { text: "hafta" })), extra, calc, nt, xBtn(function () { d.items.splice(i, 1); paint(); changed(); }));
      }) : h("p", { class: "hint", text: "Henüz madde eklenmedi. Kategori seçip listeden ekleyin." }));
    }
    paintTabs(); paint();
    AVF.mount(root, h("p", { class: "note" }, "Doz, sıklık, süre ve konsantrasyon değerlerini siz girersiniz; sistem doz önermez. mL = doz (mg) ÷ konsantrasyon (mg/mL); peptitte konsantrasyon = şişedeki mg ÷ eklenen BAC (mL)."), tabs, add, list, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return { items: d.items, note: d.note }; } };
  }

  // ---- değerli notlar
  function notesEd(root, d, changed) {
    d = d || { values: {}, notes: {}, note: "" }; d.values = d.values || {}; d.notes = d.notes || {};
    var gnote = ta(d.note, "Genel not (isteğe bağlı)"); gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    AVF.mount(root, h("div", { class: "pl-grid" }, Object.keys(CAT.notes).map(function (k) {
      var f = CAT.notes[k], s2 = sel([["", "Seçilmedi"]].concat(f.options.map(function (o) { return [o, o]; })), d.values[k] || "", f.label), t = ta(d.notes[k], f.label + " için not");
      s2.addEventListener("change", function () { if (s2.value) d.values[k] = s2.value; else delete d.values[k]; changed(); });
      t.addEventListener("input", function () { d.notes[k] = t.value; changed(); });
      return h("section", { class: "pl-card" }, h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon(f.icon)), h("b", { text: f.label })), s2, t);
    })), AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return d; } };
  }
})();
