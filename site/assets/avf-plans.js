/* AlpveFit — yapılandırılmış planlar: gösterim (üye paneli + uzman önizlemesi) ve oluşturucu (uzman / yönetici paneli).
   Katalog sunucudan gelir (GET /api/plan-catalog veya /api/admin/plan-catalog). Hesaplar (makro, hacim, mL, tablet) burada yalnız
   GÖSTERİM içindir; kaydedilen veri sunucuda ayrıca doğrulanır. Sistem doz önermez: tüm seçimleri ve değerleri planı hazırlayan uzman girer.
   Ön dolu gelen konsantrasyon / tablet mg / şişe mg değerleri ürün sunumudur (etiket bilgisi), uzman değiştirebilir. */
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
  function T(x) { return AVF.t ? AVF.t(x) : x; }
  var Z = { g: 0, kcal: 0, p: 0, c: 0, f: 0 };
  function foodOf(k) { return (CAT.foods || []).filter(function (f) { return f.key === k; })[0]; }
  function macro(f, qty) { var g = f.unit === "adet" ? qty * f.pieceG : qty, r = g / 100; return { g: g, kcal: f.kcal * r, p: f.protein * r, c: f.carb * r, f: f.fat * r }; }
  function sum(list) { return list.reduce(function (a, m) { return { g: a.g + m.g, kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }; }, Z); }
  function mealName(i, n) { return i === 0 ? CAT.firstMeal : i === n - 1 && n > 1 ? CAT.lastMeal : (EN() ? "Meal " + (i + 1) : (i + 1) + ". Öğün"); }
  function groupOf(k) { return (CAT.groups || []).filter(function (g) { return g.key === k; })[0]; }
  function suppGroup(k) { return (CAT.supps || []).filter(function (g) { return g.key === k; })[0]; }
  function phGroup(k) { return (CAT.pharma || []).filter(function (g) { return g.key === k; })[0]; }
  function label(list, k) { var x = (list || []).filter(function (a) { return a[0] === k; })[0]; return x ? x[1] : k; }
  function short(name) { return name.replace(" Antrenmanı", "").replace(" Egzersizi", ""); }
  function repsAvg(r) { var m = /^(\d+)(?:-(\d+))?$/.exec(String(r || "")); return m ? (m[2] ? (Number(m[1]) + Number(m[2])) / 2 : Number(m[1])) : 0; }

  /** Supplement kaleminin günlük makrosu (yalnız kalori içeren ve birimi grama çevrilebilen kalemler; tipik değer). */
  AVF.suppMacro = function (it) {
    var M = CAT.suppMacros && CAT.suppMacros[it.name]; if (!M || !it.amount) return null;
    var g = it.unit === "g" ? it.amount : it.unit === "mg" ? it.amount / 1000 : M.unitG && M.unitG[it.unit] ? it.amount * M.unitG[it.unit] : null;
    if (g === null) return null;
    var t = (it.times || 1) * g, r = t / 100;
    return { g: t, kcal: M.m[0] * r, p: M.m[1] * r, c: M.m[2] * r, f: M.m[3] * r };
  };
  function suppTotal(d) { return d && d.items ? sum(d.items.map(AVF.suppMacro).filter(Boolean)) : Z; }
  /** Farmakoloji hesabı: enjektablda uygulama başına mL; oralde tablet sayısı; peptitte konsantrasyon, mL ve U-100 ünite; haftalık toplam. */
  AVF.pharmaCalc = function (it) {
    var g = phGroup(it.group) || {}, out = {}, per = CAT.freqPerWeek[it.freq];
    if (it.dose && per) out.weekly = it.dose * per;
    var mg = it.dose ? (it.unit === "mcg" ? it.dose / 1000 : it.unit === "mg" ? it.dose : null) : null, conc = null;
    if (g.mode === "inj" && it.conc) conc = it.conc;
    if (g.mode === "pep" && it.vialMg && it.bacMl) {
      conc = it.vialMg / it.bacMl; out.conc = conc;
      var info = CAT.pharmaInfo[it.name]; if (info && info[2] === "IU" && it.unit === "IU") { out.ml = it.dose / conc; out.units = out.ml * 100; return out; }
    }
    if (conc && mg) { out.ml = mg / conc; out.units = out.ml * 100; }
    if (g.mode === "oral" && it.tabMg && mg) out.tabs = mg / it.tabMg;
    return out;
  };

  // ------------------------------------------------------------------ ortak parçalar
  function macroBar(t, big) {
    return h("div", { class: "mbar" + (big ? " big" : "") },
      h("span", { class: "mb-k" }, AVF.icon("flame"), h("b", { "data-notr": "", text: nf(t.kcal, 0) }), h("small", { text: "kcal" })),
      h("span", { class: "mb-p" }, h("i", { class: "dot p" }), h("small", { text: "Protein" }), h("b", { "data-notr": "", text: nf(t.p) + " g" })),
      h("span", { class: "mb-c" }, h("i", { class: "dot c" }), h("small", { text: "Karbonhidrat" }), h("b", { "data-notr": "", text: nf(t.c) + " g" })),
      h("span", { class: "mb-f" }, h("i", { class: "dot f" }), h("small", { text: "Yağ" }), h("b", { "data-notr": "", text: nf(t.f) + " g" })));
  }
  function qtyText(f, qty) {
    if (f.unit === "adet") return qty + (EN() ? " pcs" : " adet") + " · ≈ " + nf(qty * f.pieceG, 0) + " g";
    return nf(qty, 1) + " g · " + nf(qty / LB, 2) + " lbs";
  }
  function mtxt(mc) { return nf(mc.kcal, 0) + " kcal · P " + nf(mc.p) + (EN() ? " · C " : " · K ") + nf(mc.c) + (EN() ? " · F " : " · Y ") + nf(mc.f); }
  function noteBox(t) { return t ? h("p", { class: "pl-note" }, AVF.icon("notes"), h("span", { "data-notr": "", text: t })) : null; }
  function stat(icon, k, v) { return h("span", { class: "pl-st" }, AVF.icon(icon), h("small", { text: k }), h("b", { "data-notr": "", text: v })); }
  /** Yeniden çizimde sayfa kaymasın: kabın yüksekliği korunur, kaydırma konumu geri yüklenir. */
  function keepScroll(el, fn) {
    var y = window.scrollY, hgt = el.offsetHeight;
    el.style.minHeight = hgt + "px";
    try { fn(); } finally { el.style.minHeight = ""; if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y); }
  }
  function reveal(el) { if (!el) return; var r = el.getBoundingClientRect(); if (r.top < 70 || r.bottom > window.innerHeight) el.scrollIntoView({ block: "nearest", behavior: "smooth" }); }

  // ================================================================== GÖSTERİM
  /** ctx: { supp: supplement planı verisi } — beslenmede supplement makroları genel tabloya eklenir. */
  AVF.planDataView = function (kind, d, ctx) {
    if (!d || !CAT) return null;
    var V = { nutrition: nutritionView, training: trainingView, supplement: suppView, pharmacology: pharmaView, notes: notesView }[kind];
    return V ? h("div", { class: "pl-view" }, V(d, ctx || {}), noteBox(d.note)) : null;
  };
  function nutritionView(d, ctx) {
    var n = d.meals.length, all = [];
    var meals = d.meals.map(function (m, i) {
      var rows = m.items.map(function (it) { var f = foodOf(it.food); if (!f) return null; var mc = macro(f, it.qty); all.push(mc); return { f: f, it: it, mc: mc }; }).filter(Boolean);
      var t = sum(rows.map(function (r) { return r.mc; }));
      return h("section", { class: "pl-card" }, h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon(i === 0 ? "sun" : i === n - 1 && n > 1 ? "moon" : "utensils")), h("div", null, h("b", { text: mealName(i, n) }), h("small", { class: "pl-kc", "data-notr": "", text: nf(t.kcal, 0) + " kcal" }))),
        h("ul", { class: "pl-list" }, rows.map(function (r) {
          return h("li", null, h("span", { class: "pl-n" }, AVF.glyph("food", r.f.key), h("span", { text: r.f.name })),
            h("b", { class: "pl-q", "data-notr": "", text: qtyText(r.f, r.it.qty) }), h("small", { class: "pl-m", "data-notr": "", text: mtxt(r.mc) }), r.it.note ? h("small", { class: "pl-in", "data-notr": "", text: r.it.note }) : null);
        })), macroBar(t), noteBox(m.note));
    });
    var food = sum(all), st = suppTotal(ctx.supp), hasSupp = st.kcal > 0;
    return [h("div", { class: "pl-total" }, h("b", { class: "pl-tt", text: "Günlük toplam" }), macroBar(food, true),
      hasSupp ? h("div", { class: "pl-sup" }, h("small", { text: "Supplementler (tipik değer)" }), macroBar(st)) : null,
      hasSupp ? h("div", { class: "pl-sup all" }, h("small", { text: "Supplementler dahil genel toplam" }), macroBar(sum([food, st]), true)) : null,
      h("small", { class: "hint", text: "Tüm besinler çiğ (pişirilmeden önceki) ağırlıktır. Besin değerleri: USDA FoodData Central." })), meals];
  }
  function trainingView(d) {
    return d.days.map(function (dy) {
      var sets = 0, reps = 0, perG = {}, cardio = 0;
      dy.exercises.forEach(function (e) { if (e.group === "cardio") { cardio += e.minutes || 0; return; } sets += e.sets; reps += e.sets * repsAvg(e.reps); perG[e.group] = (perG[e.group] || 0) + e.sets; });
      return h("section", { class: "pl-card" },
        h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon("dumb")), h("div", null, h("b", { "data-notr": "", text: dy.title }), h("small", { text: dy.groups.map(function (k) { var g = groupOf(k); return g ? short(g.name) : k; }).join(" · ") }))),
        h("ul", { class: "pl-list" }, dy.exercises.map(function (e) {
          var g = groupOf(e.group);
          return h("li", null, h("span", { class: "pl-n" }, h("span", { class: "gly t-s" }, AVF.icon(g ? g.icon : "dumb", "gly-s")), h("span", { "data-notr": "", text: e.name })),
            h("b", { class: "pl-q big", "data-notr": "", text: e.group === "cardio" ? e.minutes + (EN() ? " min" : " dk") : e.sets + " × " + e.reps }),
            e.group !== "cardio" ? h("small", { class: "pl-m", text: e.sets + (EN() ? " sets · " : " set · ") + e.reps + (EN() ? " reps" : " tekrar") }) : null,
            e.note ? h("small", { class: "pl-in", "data-notr": "", text: e.note }) : null);
        })),
        h("div", { class: "pl-vol" }, stat("layers", "Toplam set", String(sets)), stat("refresh", "Toplam tekrar", nf(reps, 0)),
          Object.keys(perG).map(function (k) { var g = groupOf(k); return stat(g ? g.icon : "dumb", g ? short(g.name) : k, perG[k] + (EN() ? " sets" : " set")); }),
          cardio ? stat("pulse", "Kardiyo", cardio + (EN() ? " min" : " dk")) : null),
        noteBox(dy.note));
    });
  }
  function suppView(d) {
    var t = suppTotal(d);
    return h("div", { class: "stack" }, t.kcal > 0 ? h("div", { class: "pl-total" }, h("b", { class: "pl-tt", text: "Supplementlerin günlük makro değeri" }), macroBar(t, true), h("small", { class: "hint", text: "Tipik ürün değerleridir; kullandığınız ürünün etiketine göre değişebilir." })) : null,
      h("ul", { class: "pl-list pl-card" }, d.items.map(function (it) {
        var mc = AVF.suppMacro(it);
        return h("li", null, h("span", { class: "pl-n" }, AVF.suppGlyph(CAT, it.name), h("span", { text: it.name })),
          h("b", { class: "pl-q", "data-notr": "", text: (it.amount ? nf(it.amount, 3) + " " + T(it.unit) + " · " : "") + (EN() ? it.times + "× a day" : "günde " + it.times + " kez") }),
          h("small", { class: "pl-m", text: [label(CAT.suppState, it.state)].concat(it.when.map(function (w) { return label(CAT.suppWhen, w); })).join(" · ") }),
          mc ? h("small", { class: "pl-m", "data-notr": "", text: (EN() ? "Daily: " : "Günlük: ") + mtxt(mc) }) : null,
          it.note ? h("small", { class: "pl-in", "data-notr": "", text: it.note }) : null);
      })));
  }
  function pharmaView(d) {
    return h("div", null, h("p", { class: "note warn" }, AVF.icon("alert", "bico"), h("span", { text: "Bu bölüm koçunuz tarafından size özel hazırlanmıştır; değerleri değiştirmeyin ve sağlığınızla ilgili her durumda hekiminize danışın." })),
      h("ul", { class: "pl-list pl-card" }, d.items.map(function (it) {
        var g = phGroup(it.group) || {}, c = AVF.pharmaCalc(it), parts = [];
        if (it.dose) parts.push(nf(it.dose, 4) + " " + it.unit);
        parts.push(T(label(CAT.pharmaFreq, it.freq)));
        if (it.weeks) parts.push(it.weeks + (EN() ? " weeks" : " hafta"));
        return h("li", null, h("span", { class: "pl-n" }, AVF.pharmaGlyph(CAT, it.group, it.name), h("span", { text: it.name })), h("b", { class: "pl-q", "data-notr": "", text: parts.join(" · ") }),
          c.ml ? h("small", { class: "pl-m em", "data-notr": "", text: (EN() ? "Per application " : "Uygulama başına ") + nf(c.ml, 3) + " mL" + (g.mode === "pep" ? " (" + nf(c.units, 1) + (EN() ? " units, U-100 syringe)" : " ünite, U-100 şırınga)") : "") + (it.conc || c.conc ? " · " + nf(it.conc || c.conc, 3) + " mg/mL" : "") }) : null,
          c.tabs ? h("small", { class: "pl-m em", "data-notr": "", text: (EN() ? "Per application " : "Uygulama başına ") + nf(c.tabs, 2) + (EN() ? " tablet(s) of " : " tablet (") + nf(it.tabMg, 2) + (EN() ? " mg" : " mg'lık)") }) : null,
          c.weekly ? h("small", { class: "pl-m", "data-notr": "", text: (EN() ? "Weekly total: " : "Haftalık toplam: ") + nf(c.weekly, 3) + " " + it.unit }) : null,
          it.note ? h("small", { class: "pl-in", "data-notr": "", text: it.note }) : null);
      })));
  }
  function notesView(d) {
    return h("div", { class: "pl-grid" }, Object.keys(CAT.notes).map(function (k) {
      var f = CAT.notes[k], v = d.values && d.values[k], t = d.notes && d.notes[k];
      if (!v && !t) return null;
      return h("section", { class: "pl-card" }, h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon(f.icon)), h("div", null, h("small", { text: f.label }), h("b", { class: "pl-big", text: v || "—" }))), noteBox(t));
    }));
  }

  // ================================================================== PDF / YAZDIR
  // Plan, yazdırma penceresinde tek başına (site arayüzü olmadan), her zaman aydınlık renklerle A4'e dizilir. Kullanıcı yazıcıyı
  // ya da "PDF olarak kaydet"i seçer (masaüstü ve telefon tarayıcılarının hepsinde aynı pencere). Sunucuya ek istek yapılmaz.
  // o: { kind, plan, ctx, member } — member yalnız uzman ekranında (kimin planı olduğu baskıda görünsün).
  AVF.printPlan = function (o) {
    var p = o.plan || {}, m = AVF.KIND[o.kind] || {}, prev = document.getElementById("avf-print");
    if (prev) prev.remove();
    var when = p.starts_on || p.ends_on ? [p.starts_on ? AVF.fmtDate(p.starts_on) : "…", p.ends_on ? AVF.fmtDate(p.ends_on) : "…"].join(" – ") : "";
    var meta = [p.author_name ? T("Hazırlayan") + ": " + p.author_name : "", (p.updated_at || p.published_at) ? T("Güncelleme") + ": " + AVF.fmtDate(p.updated_at || p.published_at) : "", when ? T("Dönem") + ": " + when : ""].filter(Boolean);
    var box = h("div", { id: "avf-print", "data-norv": "", "aria-hidden": "true" },
      h("header", { class: "pr-head" }, h("div", { class: "pr-brand" }, h("span", { class: "pr-dia", "aria-hidden": "true" }), h("span", { "data-notr": "", text: "ALPVEFIT" })),
        h("div", { class: "pr-kind" }, AVF.icon(m.icon || "list"), h("span", { text: m.label || "" }))),
      h("h1", { class: "pr-title", "data-notr": "", text: p.title || "" }),
      o.member ? h("p", { class: "pr-member" }, h("span", { text: T("Üye") + ": " }), h("b", { "data-notr": "", text: o.member })) : null,
      meta.length ? h("p", { class: "pr-meta", "data-notr": "", text: meta.join("  ·  ") }) : null,
      p.data ? AVF.planDataView(o.kind, p.data, o.ctx) : null,
      p.body ? h("div", { class: "plan-body", "data-notr": "", text: p.body }) : null,
      h("footer", { class: "pr-foot" }, h("span", { text: T("Bu plan size özel hazırlanmıştır; başkalarıyla paylaşmayın.") }), h("span", { "data-notr": "", text: "alpvefit.com · " + AVF.fmtDateTime(new Date()) })));
    document.body.appendChild(box);
    var root = document.documentElement, theme = root.getAttribute("data-theme"), cs = root.style.colorScheme, title = document.title, cleaned = false;
    root.setAttribute("data-theme", "light"); root.style.colorScheme = "light";
    document.body.classList.add("avf-printing");
    document.title = String((p.title || "Plan") + " - AlpveFit").replace(/[\\/:*?"<>|]+/g, " ").slice(0, 120);   // kaydedilen PDF'in dosya adı
    function done() {
      if (cleaned) return; cleaned = true;
      window.removeEventListener("afterprint", done); document.removeEventListener("pointerdown", late, true);
      box.remove(); document.body.classList.remove("avf-printing");
      if (theme) root.setAttribute("data-theme", theme); else root.removeAttribute("data-theme");
      root.style.colorScheme = cs; document.title = title;
    }
    function late() { setTimeout(done, 0); }   // "afterprint" göndermeyen tarayıcılar: pencere kapandıktan sonraki ilk dokunuşta temizlenir
    window.addEventListener("afterprint", done);
    setTimeout(function () {
      try { window.print(); } catch (e) { done(); return; }
      setTimeout(function () { if (!cleaned) document.addEventListener("pointerdown", late, true); }, 400);
    }, 80);
  };
  AVF.printButton = function (fn) {
    return h("button", { class: "btn ghost sm pr-btn", type: "button", title: T("Yazdırma penceresinde “PDF olarak kaydet”i seçerek indirebilirsiniz."), onclick: fn }, AVF.icon("printer", "bico"), h("span", { text: T("PDF indir / Yazdır") }));
  };

  // ================================================================== OLUŞTURUCU (uzman / yönetici)
  function ta(val, ph, max) { var t = h("textarea", { class: "inp", rows: "2", maxlength: String(max || 500), placeholder: ph || "Not (isteğe bağlı)" }); t.value = val || ""; return t; }
  function numIn(val, ph, w, dec) { var i = AVF.numInput({ placeholder: ph || "", style: w ? "max-width:" + w : "", "aria-label": ph || "" }, dec === undefined ? 3 : dec); i.value = val === null || val === undefined ? "" : String(val); return i; }
  function sel(opts, val, lab) { var s = h("select", { class: "inp", "aria-label": lab || "" }, opts.map(function (o) { return h("option", { value: o[0], text: o[1] }); })); if (val !== undefined && val !== null) s.value = String(val); return s; }
  function xBtn(fn, lab) { return h("button", { class: "fb-x", type: "button", "aria-label": lab || "Kaldır", title: lab || "Kaldır", onclick: fn }, AVF.icon("x")); }
  function addBtn(text, fn, icon) { return h("button", { class: "btn ghost sm", type: "button", onclick: fn }, AVF.icon(icon || "plus", "bico"), text); }
  function num(v) { return v === "" || v === null || v === undefined ? "" : Number(v); }

  /** Logolu seçim paneli: gruplar (sekme) + arama + kutucuklar. Panel durumu (açık / grup / arama) yeniden çizimlerde korunur. */
  function picker(o) {
    var st = o.state, wrap = h("div", { class: "pk" + (st.open ? " open" : "") });
    var btn = h("button", { class: "btn ghost sm pk-btn", type: "button", "aria-expanded": String(!!st.open), onclick: function () { st.open = !st.open; draw(); if (st.open) setTimeout(function () { reveal(wrap); }, 30); } }, AVF.icon(st.open ? "x" : "plus", "bico"), st.open ? "Kapat" : o.label);
    var body = h("div", { class: "pk-b" });
    function draw() {
      wrap.className = "pk" + (st.open ? " open" : ""); btn.setAttribute("aria-expanded", String(!!st.open));
      AVF.mount(btn, AVF.icon(st.open ? "x" : "plus", "bico"), st.open ? "Kapat" : o.label);
      if (!st.open) return AVF.mount(body, null);
      var q = h("input", { class: "inp pk-q", type: "search", placeholder: "Ara…", "aria-label": "Listede ara", value: st.q || "" });
      var grid = h("div", { class: "pk-grid", role: "list" });
      function paintGrid() {
        var term = (st.q || "").toLocaleLowerCase("tr-TR").trim();
        var gs = term ? o.groups : o.groups.filter(function (g) { return g.key === (st.g || o.groups[0].key); });
        var items = [];
        gs.forEach(function (g) { g.items.forEach(function (it) { if (!term || (it.label + " " + T(it.label)).toLocaleLowerCase("tr-TR").indexOf(term) >= 0) items.push([g, it]); }); });
        AVF.mount(grid, items.length ? items.map(function (x) {
          return h("button", { type: "button", class: "pk-i", role: "listitem", onclick: function () { o.onPick(x[0].key, x[1].value); } }, x[1].glyph(), h("span", { class: "pk-l", text: x[1].label }), x[1].sub ? h("small", { "data-notr": "", text: x[1].sub }) : null);
        }) : h("p", { class: "hint", text: "Sonuç yok." }));
      }
      q.addEventListener("input", function () { st.q = q.value; paintGrid(); });
      var tabs = o.groups.length > 1 ? h("div", { class: "pk-tabs", role: "tablist" }, o.groups.map(function (g) {
        var on = (st.g || o.groups[0].key) === g.key;
        return h("button", { type: "button", role: "tab", "aria-selected": String(on), class: "ch" + (on ? " on" : ""), onclick: function () { st.g = g.key; st.q = ""; draw(); } }, h("span", { class: "chi" }, AVF.icon(g.icon)), h("span", { text: g.name }));
      })) : null;
      AVF.mount(body, h("div", { class: "pk-top" }, tabs, q), grid);
      paintGrid();
    }
    draw();
    wrap.appendChild(btn); wrap.appendChild(body);
    return wrap;
  }

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
    var total = h("div", { class: "pl-total" }), list = h("div", { class: "stack" }), gnote = ta(d.note, "Genel not (isteğe bağlı)"), pk = {};
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    var groups = CAT.foodGroups.map(function (gr) { return { key: gr[0], name: gr[1], icon: gr[2], items: CAT.foods.filter(function (f) { return f.group === gr[0]; }).map(function (f) {
      return { value: f.key, label: f.name, sub: f.unit === "adet" ? (EN() ? "by count" : "adet") : nf(f.kcal, 0) + " kcal/100 g", glyph: function () { return AVF.glyph("food", f.key); } }; }) }; });
    function paintTotal() {
      var all = []; d.meals.forEach(function (m) { m.items.forEach(function (it) { var f = foodOf(it.food); if (f && it.qty) all.push(macro(f, Number(it.qty) || 0)); }); });
      AVF.mount(total, h("b", { class: "pl-tt", text: "Günlük toplam" }), macroBar(sum(all), true), h("small", { class: "hint", text: "Tüm besinler çiğ ağırlıktır. Yumurta adet, diğerleri gram olarak girilir; üyeye gram ve lbs olarak gösterilir." }));
    }
    function paint(focusMeal) {
      keepScroll(list, function () {
        AVF.mount(list, d.meals.map(function (m, i) {
          var mm = h("div"), card;
          function paintMeal() { AVF.mount(mm, macroBar(sum(m.items.map(function (it) { var f = foodOf(it.food); return f && it.qty ? macro(f, Number(it.qty) || 0) : Z; })))); }
          pk[i] = pk[i] || {};
          var add = picker({ label: "Besin ekle", state: pk[i], groups: groups, onPick: function (g, key) {
            var f = foodOf(key); m.items.push({ food: f.key, qty: f.unit === "adet" ? 1 : 100, note: "" }); paint(); changed();
          } });
          var mn = ta(m.note, "Öğün notu (isteğe bağlı)"); mn.addEventListener("input", function () { m.note = mn.value; changed(); });
          card = h("section", { class: "pl-card", "data-meal": String(i) },
            h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon(i === 0 ? "sun" : i === d.meals.length - 1 && d.meals.length > 1 ? "moon" : "utensils")), h("div", null, h("b", { text: mealName(i, d.meals.length) }), h("small", { text: i === 0 || (i === d.meals.length - 1 && d.meals.length > 1) ? "Sabit ad" : "Ara öğün" })),
              d.meals.length > 1 ? xBtn(function () { if (m.items.length && !window.confirm(T("Bu öğün ve içindeki besinler kaldırılsın mı?"))) return; d.meals.splice(i, 1); pk = {}; paint(); changed(); }, "Öğünü kaldır") : null),
            h("div", { class: "pl-rows" }, m.items.map(function (it, j) {
              var f = foodOf(it.food), q = numIn(it.qty, f.unit === "adet" ? "adet" : "g", "96px", f.unit === "adet" ? 0 : 1), out = h("small", { class: "pl-m", "data-notr": "" }), nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: it.note || "", "aria-label": "Not" });
              function upd() { var v = Number(q.value) || 0, mc = macro(f, v); out.textContent = (f.unit === "adet" ? "≈ " + nf(mc.g, 0) + " g · " : nf(v / LB, 2) + " lbs · ") + mtxt(mc); }
              q.addEventListener("input", function () { it.qty = q.value === "" ? "" : Number(q.value); upd(); paintMeal(); paintTotal(); changed(); });
              nt.addEventListener("input", function () { it.note = nt.value; changed(); });
              upd();
              return h("div", { class: "pl-row" }, h("span", { class: "pl-n" }, AVF.glyph("food", f.key), h("span", { text: f.name })),
                h("label", { class: "pl-qi" }, q, h("span", { text: f.unit === "adet" ? "adet" : "g" })), nt, xBtn(function () { m.items.splice(j, 1); paint(); changed(); }), out);
            })), add, mm, mn);
          paintMeal();
          return card;
        }), h("div", { class: "row" }, d.meals.length < CAT.mealsMax ? addBtn("Öğün ekle", function () {
            var at = Math.max(1, d.meals.length - 1); d.meals.splice(at, 0, { items: [], note: "" }); if (d.meals.length === 1) d.meals.push({ items: [], note: "" });
            pk = {}; paint(at); changed();
          }) : null,
          h("small", { class: "hint", "data-notr": "", text: EN() ? d.meals.length + " / " + CAT.mealsMax + " meals · the first meal is always “" + T(CAT.firstMeal) + "”, the last “" + T(CAT.lastMeal) + "”." : d.meals.length + " / " + CAT.mealsMax + " öğün · İlk öğün “" + CAT.firstMeal + "”, son öğün “" + CAT.lastMeal + "” adını taşır." })));
      });
      paintTotal();
      if (focusMeal !== undefined) reveal(list.querySelector('[data-meal="' + focusMeal + '"]'));
    }
    paint();
    AVF.mount(root, total, list, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return { meals: d.meals.map(function (m) { return { items: m.items.filter(function (it) { return it.qty !== "" && it.qty !== null && Number(it.qty) > 0; }), note: m.note }; }), note: d.note }; } };
  }

  // ---- antrenman (ağırlık / kg girilmez: set ve tekrar)
  function trainingEd(root, d, changed) {
    d = d || { days: [{ title: "1. Gün", groups: [], exercises: [], note: "" }], note: "" };
    d.days.forEach(function (dy) { dy.exercises.forEach(function (e) { delete e.weight; }); });
    var list = h("div", { class: "stack" }), gnote = ta(d.note, "Genel not (isteğe bağlı)"), pk = {};
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    function paint(focusDay) {
      keepScroll(list, function () {
        AVF.mount(list, d.days.map(function (dy, i) {
          var title = AVF.input("text", { maxlength: "60", value: dy.title, placeholder: (i + 1) + ". Gün", "aria-label": "Gün adı" });
          title.addEventListener("input", function () { dy.title = title.value; changed(); });
          var chips = h("div", { class: "pl-gsel", role: "group", "aria-label": "Kas grupları" }, CAT.groups.map(function (g) {
            var on = dy.groups.indexOf(g.key) >= 0;
            return h("button", { type: "button", class: "ch" + (on ? " on" : ""), "aria-pressed": String(on), onclick: function () {
              if (on) { if (dy.exercises.some(function (e) { return e.group === g.key; }) && !window.confirm(T("Bu kas grubundaki hareketler de kaldırılsın mı?"))) return; dy.groups = dy.groups.filter(function (x) { return x !== g.key; }); dy.exercises = dy.exercises.filter(function (e) { return e.group !== g.key; }); } else dy.groups.push(g.key);
              paint(); changed();
            } }, h("span", { class: "chi" }, AVF.icon(g.icon)), h("span", { text: short(g.name) }));
          }));
          var vol = h("div", { class: "pl-vol" });
          function paintVol() {
            var sets = 0, reps = 0, perG = {};
            dy.exercises.forEach(function (e) { if (e.group === "cardio") return; var s = Number(e.sets) || 0, r = repsAvg(e.reps); sets += s; reps += s * r; perG[e.group] = (perG[e.group] || 0) + s; });
            AVF.mount(vol, stat("layers", "Toplam set", String(sets)), stat("refresh", "Toplam tekrar", nf(reps, 0)),
              Object.keys(perG).map(function (k) { var g = groupOf(k); return stat(g.icon, short(g.name), perG[k] + (EN() ? " sets" : " set")); }));
          }
          var secs = dy.groups.map(function (gk) {
            var g = groupOf(gk); pk[i + gk] = pk[i + gk] || {};
            var rows = dy.exercises.map(function (e, j) { return e.group === gk ? exRow(dy, e, j, paintVol) : null; }).filter(Boolean);
            var add = picker({ label: short(g.name) + " hareketi ekle", state: pk[i + gk], groups: [{ key: gk, name: g.name, icon: g.icon, items: g.exercises.map(function (x) { return { value: x, label: x, glyph: function () { return h("span", { class: "gly t-s" }, AVF.icon(g.icon, "gly-s")); } }; }).concat([{ value: "__custom", label: "Listede yok — özel hareket", glyph: function () { return h("span", { class: "gly t-y" }, AVF.icon("pen", "gly-s")); } }]) }],
              onPick: function (gk2, x) {
                if (dy.exercises.length >= CAT.exercisesMax) return AVF.toast(T("Bir günde en fazla 20 hareket olabilir."));
                var custom = x === "__custom";
                dy.exercises.push(gk === "cardio" ? { group: gk, name: custom ? "" : x, custom: custom, minutes: 20, note: "" } : { group: gk, name: custom ? "" : x, custom: custom, sets: 3, reps: "10", note: "" });
                paint(); changed();
              } });
            return h("div", { class: "pl-gsec" }, h("h5", null, h("span", { class: "gly t-s" }, AVF.icon(g.icon, "gly-s")), g.name), h("div", { class: "pl-rows" }, rows), add);
          });
          paintVol();
          var dn = ta(dy.note, "Gün notu (isteğe bağlı)"); dn.addEventListener("input", function () { dy.note = dn.value; changed(); });
          return h("section", { class: "pl-card", "data-day": String(i) }, h("div", { class: "pl-h" }, h("span", { class: "tile" }, AVF.icon("dumb")), title, d.days.length > 1 ? xBtn(function () { if (dy.exercises.length && !window.confirm(T("Bu gün ve içindeki hareketler kaldırılsın mı?"))) return; d.days.splice(i, 1); pk = {}; paint(); changed(); }, "Günü kaldır") : null),
            h("p", { class: "hint", text: "Kas gruplarını seçin (birden fazla seçilebilir):" }), chips, secs, vol, dn);
        }), h("div", { class: "row" }, d.days.length < CAT.daysMax ? addBtn("Gün ekle", function () { d.days.push({ title: (d.days.length + 1) + ". Gün", groups: [], exercises: [], note: "" }); paint(d.days.length - 1); changed(); }) : null,
          h("small", { class: "hint", "data-notr": "", text: d.days.length + " / " + CAT.daysMax })));
      });
      if (focusDay !== undefined) reveal(list.querySelector('[data-day="' + focusDay + '"]'));
    }
    function exRow(dy, e, j, paintVol) {
      var name = e.custom ? AVF.input("text", { maxlength: "60", value: e.name, placeholder: "Hareket adı", "aria-label": "Hareket adı" }) : h("span", { text: e.name });
      if (e.custom) name.addEventListener("input", function () { e.name = name.value; changed(); });
      var nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: e.note || "", "aria-label": "Not" }); nt.addEventListener("input", function () { e.note = nt.value; changed(); });
      var rm = xBtn(function () { dy.exercises.splice(j, 1); paint(); changed(); });
      var g = groupOf(e.group), ic = h("span", { class: "gly t-s" }, AVF.icon(g ? g.icon : "dumb", "gly-s"));
      if (e.group === "cardio") {
        var mi = numIn(e.minutes, "dk", "84px", 0); mi.addEventListener("input", function () { e.minutes = num(mi.value); changed(); });
        return h("div", { class: "pl-row" }, h("span", { class: "pl-n" }, ic, name), h("label", { class: "pl-qi" }, mi, h("span", { text: "dk" })), nt, rm);
      }
      var st = sel([1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(function (x) { return [String(x), x + " set"]; }), e.sets, "Set");
      var rp = AVF.input("text", { maxlength: "5", value: e.reps, placeholder: "10 / 8-12", "aria-label": "Tekrar", inputmode: "numeric", style: "max-width:96px" });
      rp.addEventListener("input", function () { var v = rp.value.replace(/[^0-9-]/g, "").replace(/-+/g, "-").replace(/^-/, ""); if (v !== rp.value) rp.value = v; e.reps = v; changed(); paintVol(); });
      st.addEventListener("change", function () { e.sets = Number(st.value); changed(); paintVol(); });
      return h("div", { class: "pl-row" }, h("span", { class: "pl-n" }, ic, name), st, h("label", { class: "pl-qi" }, rp, h("span", { text: "tekrar" })), nt, rm);
    }
    paint();
    AVF.mount(root, list, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return { days: d.days.map(function (dy) { return { title: dy.title, groups: dy.groups, exercises: dy.exercises.filter(function (e) { return e.name; }), note: dy.note }; }), note: d.note }; } };
  }

  // ---- supplement
  function suppEd(root, d, changed) {
    d = d || { items: [], note: "" };
    var list = h("div", { class: "pl-rows" }), gnote = ta(d.note, "Genel not (isteğe bağlı)"), pk = { open: true }, tot = h("div", { class: "pl-total" }), pkBox = h("div");
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    var groups = CAT.supps.map(function (g) { return { key: g.key, name: g.name, icon: g.icon, items: g.items.map(function (x) { return { value: x, label: x, glyph: function () { return AVF.suppGlyph(CAT, x); } }; }) }; });
    function paintTot() { var t = suppTotal(d); AVF.mount(tot, h("b", { class: "pl-tt", text: "Supplementlerin günlük makro değeri" }), macroBar(t, true), h("small", { class: "hint", text: "Kalori içeren supplementler (protein, karbonhidrat, yağ) tipik ürün değeriyle hesaplanır; beslenme programının genel tablosuna eklenir." })); }
    function paint() {
      keepScroll(list, function () {
        AVF.mount(list, d.items.length ? d.items.map(function (it, i) {
          var am = numIn(it.amount, "Miktar", "96px"), un = sel(CAT.suppUnits.map(function (u) { return [u, u]; }), it.unit, "Birim"), tm = sel([1, 2, 3, 4, 5, 6].map(function (x) { return [String(x), "Günde " + x]; }), it.times, "Günde kaç kez");
          var mo = h("small", { class: "pl-m", "data-notr": "" });
          function upd() { var mc = AVF.suppMacro(it); mo.textContent = mc ? (EN() ? "Daily: " : "Günlük: ") + mtxt(mc) : ""; paintTot(); }
          var stt = h("div", { class: "useg seg3", role: "radiogroup", "aria-label": "Açlık / tokluk" }, CAT.suppState.map(function (s) {
            return h("button", { type: "button", role: "radio", "aria-checked": String(it.state === s[0]), "aria-pressed": String(it.state === s[0]), onclick: function (ev) { it.state = s[0]; Array.prototype.forEach.call(ev.currentTarget.parentNode.children, function (b) { var on = b === ev.currentTarget; b.setAttribute("aria-pressed", String(on)); b.setAttribute("aria-checked", String(on)); }); changed(); } }, s[1]);
          }));
          var whens = h("div", { class: "pl-when" }, CAT.suppWhen.map(function (w) {
            var c = h("input", { type: "checkbox", checked: it.when.indexOf(w[0]) >= 0 });
            c.addEventListener("change", function () { it.when = c.checked ? it.when.concat([w[0]]) : it.when.filter(function (x) { return x !== w[0]; }); changed(); });
            return h("label", { class: "check" }, c, w[1]);
          }));
          var nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: it.note || "", "aria-label": "Not" });
          am.addEventListener("input", function () { it.amount = num(am.value); upd(); changed(); });
          un.addEventListener("change", function () { it.unit = un.value; upd(); changed(); });
          tm.addEventListener("change", function () { it.times = Number(tm.value); upd(); changed(); });
          nt.addEventListener("input", function () { it.note = nt.value; changed(); });
          upd();
          return h("div", { class: "pl-row pl-wide" }, h("span", { class: "pl-n" }, AVF.suppGlyph(CAT, it.name), h("span", { text: it.name })), xBtn(function () { d.items.splice(i, 1); paint(); changed(); }), am, un, tm, stt, whens, nt, mo);
        }) : h("p", { class: "hint", text: "Henüz kalem eklenmedi. Aşağıdaki listeden ekleyin." }));
      });
      paintTot();
    }
    function paintPk() { AVF.mount(pkBox, picker({ label: "Supplement / vitamin / mineral ekle", state: pk, groups: groups, onPick: function (g, x) {
      if (d.items.length >= CAT.itemsMax) return AVF.toast(T("En fazla 40 kalem eklenebilir."));
      var M = CAT.suppMacros[x]; d.items.push({ group: g, name: x, amount: "", unit: M && M.unitG && M.unitG["ölçek"] ? "ölçek" : "g", times: 1, state: "any", when: [], note: "" }); paint(); changed(); AVF.toast(T("Eklendi."));
    } })); }
    paint(); paintPk();
    AVF.mount(root, tot, list, pkBox, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
    return { get: function () { return { items: d.items, note: d.note }; } };
  }

  // ---- farmakoloji
  function pharmaEd(root, d, changed) {
    d = d || { items: [], note: "" };
    var list = h("div", { class: "pl-rows" }), gnote = ta(d.note, "Genel not (isteğe bağlı)"), pk = { open: true }, pkBox = h("div");
    gnote.addEventListener("input", function () { d.note = gnote.value; changed(); });
    var groups = CAT.pharma.map(function (g) { return { key: g.key, name: g.name, icon: g.icon, items: g.items.map(function (x) {
      var inf = CAT.pharmaInfo[x] || [], sub = g.mode === "inj" ? inf[1] + " mg/mL" : g.mode === "oral" ? inf[1] + " mg/tb" : Array.isArray(inf[1]) ? inf[1].join(" / ") + " " + (inf[2] || "mg") : "";
      return { value: x, label: x, sub: sub, glyph: function () { return AVF.pharmaGlyph(CAT, g.key, x); } }; }) }; });
    function paint() {
      keepScroll(list, function () {
        AVF.mount(list, d.items.length ? d.items.map(function (it, i) {
          var g = phGroup(it.group) || {}, info = CAT.pharmaInfo[it.name] || [], calc = h("small", { class: "pl-m em", "data-notr": "" });
          function upd() {
            var c = AVF.pharmaCalc(it), t = [];
            if (c.conc) t.push(nf(c.conc, 3) + (info[2] === "IU" ? " IU/mL" : " mg/mL"));
            if (c.ml) t.push((EN() ? "per application " : "uygulama başına ") + nf(c.ml, 3) + " mL" + (g.mode === "pep" ? " (" + nf(c.units, 1) + (EN() ? " units)" : " ünite)") : ""));
            if (c.tabs) t.push((EN() ? "per application " : "uygulama başına ") + nf(c.tabs, 2) + (EN() ? " tablet(s)" : " tablet"));
            if (c.weekly) t.push((EN() ? "weekly " : "haftalık ") + nf(c.weekly, 3) + " " + it.unit);
            calc.textContent = t.join(" · ") || T(g.mode === "inj" ? "mL hesabı için dozu girin." : g.mode === "pep" ? "mL hesabı için dozu girin." : "Tablet hesabı için dozu girin.");
          }
          var ds = numIn(it.dose, "Doz", "96px", 4), un = sel(CAT.doseUnits.map(function (u) { return [u, u]; }), it.unit, "Birim"), fq = sel(CAT.pharmaFreq, it.freq, "Sıklık"), wk = numIn(it.weeks, "hafta", "76px", 0);
          var extra = [];
          if (g.mode === "inj") { var cc = numIn(it.conc, "mg/mL", "90px", 2); cc.addEventListener("input", function () { it.conc = num(cc.value); upd(); changed(); }); extra.push(h("label", { class: "pl-qi" }, cc, h("span", { text: "mg/mL" }))); }
          if (g.mode === "oral") { var tb = numIn(it.tabMg, "mg/tb", "84px", 2); tb.addEventListener("input", function () { it.tabMg = num(tb.value); upd(); changed(); }); extra.push(h("label", { class: "pl-qi" }, tb, h("span", { text: "mg/tablet" }))); }
          if (g.mode === "pep") {
            var opts = Array.isArray(info[1]) ? info[1] : [];
            var vm = opts.length ? sel(opts.map(function (v) { return [String(v), v + " " + (info[2] || "mg")]; }).concat([["__", T("Diğer")]]), opts.indexOf(it.vialMg) >= 0 ? it.vialMg : (it.vialMg ? "__" : opts[0]), "Şişe") : null;
            var vmc = numIn(it.vialMg, "şişe", "84px", 2), bm = numIn(it.bacMl, "BAC mL", "84px", 2);
            if (vm) { vmc.hidden = opts.indexOf(it.vialMg) >= 0 || !it.vialMg ? true : false; vm.addEventListener("change", function () { if (vm.value === "__") { vmc.hidden = false; vmc.focus(); it.vialMg = num(vmc.value); } else { vmc.hidden = true; it.vialMg = Number(vm.value); } upd(); changed(); }); }
            vmc.addEventListener("input", function () { it.vialMg = num(vmc.value); upd(); changed(); });
            bm.addEventListener("input", function () { it.bacMl = num(bm.value); upd(); changed(); });
            extra.push(h("label", { class: "pl-qi" }, vm, vmc, h("span", { text: (info[2] || "mg") + " şişe" })), h("label", { class: "pl-qi" }, bm, h("span", { text: "mL BAC" })));
          }
          var nt = AVF.input("text", { maxlength: "200", placeholder: "Not", value: it.note || "", "aria-label": "Not" });
          ds.addEventListener("input", function () { it.dose = num(ds.value); upd(); changed(); });
          un.addEventListener("change", function () { it.unit = un.value; upd(); changed(); });
          fq.addEventListener("change", function () { it.freq = fq.value; upd(); changed(); });
          wk.addEventListener("input", function () { it.weeks = num(wk.value); changed(); });
          nt.addEventListener("input", function () { it.note = nt.value; changed(); });
          upd();
          return h("div", { class: "pl-row pl-wide" }, h("span", { class: "pl-n" }, AVF.pharmaGlyph(CAT, it.group, it.name), h("span", { text: it.name })), xBtn(function () { d.items.splice(i, 1); paint(); changed(); }),
            h("label", { class: "pl-qi" }, ds, un), fq, h("label", { class: "pl-qi" }, wk, h("span", { text: "hafta" })), extra, nt, calc);
        }) : h("p", { class: "hint", text: "Henüz madde eklenmedi. Aşağıdaki listeden ekleyin." }));
      });
    }
    function paintPk() { AVF.mount(pkBox, picker({ label: "Madde ekle", state: pk, groups: groups, onPick: function (gk, x) {
      if (d.items.length >= CAT.itemsMax) return AVF.toast(T("En fazla 40 kalem eklenebilir."));
      var g = phGroup(gk), info = CAT.pharmaInfo[x] || [], it = { group: gk, name: x, dose: "", unit: "mg", freq: g.mode === "inj" ? "w2" : "daily", weeks: "", note: "" };
      if (g.mode === "inj") it.conc = info[1] || "";
      if (g.mode === "oral") it.tabMg = info[1] || "";
      if (g.mode === "pep") { it.vialMg = Array.isArray(info[1]) ? info[1][0] : ""; it.bacMl = 2; it.unit = info[2] === "IU" ? "IU" : "mcg"; }
      d.items.push(it); paint(); changed(); AVF.toast(T("Eklendi."));
    } })); }
    paint(); paintPk();
    AVF.mount(root, h("p", { class: "note" }, AVF.icon("info", "bico"), h("span", { text: "Konsantrasyon (mg/mL), tablet mg ve şişe miktarı klasik piyasa sunumuyla ön dolu gelir; ürününüz farklıysa değiştirin. Doz, sıklık ve süreyi siz girersiniz; sistem doz önermez." })), list, pkBox, AVF.field("Genel not", gnote, { optional: true, icon: "notes" }));
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
