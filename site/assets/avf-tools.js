/* AlpveFit — Araçlar: 14 hesaplayıcı. Tüm hesaplar tarayıcıda yapılır; girilen değerler sunucuya GÖNDERİLMEZ ve saklanmaz.
   Sonuçlar animasyonla gösterilir (sayı sayacı, çubuk dolumu, gösterge imleci); hareket azaltma tercihinde animasyon atlanır.
   Bilgilendirme amaçlıdır; tıbbi tavsiye değildir. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function link(href, kids, attrs) { attrs = attrs || {}; attrs.href = href; attrs["data-link"] = ""; return h("a", attrs, kids); }
  function num(v) { var n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : NaN; }
  function fmt(n, d) { return Number(n).toLocaleString(AVF.lang === "en" ? "en-US" : "tr-TR", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function countUp(el, to, d, suffix) {
    suffix = suffix || "";
    if (REDUCE) { el.textContent = fmt(to, d) + suffix; return; }
    var t0 = null, dur = 750;
    requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(to * e, d) + suffix; if (p < 1) requestAnimationFrame(step); });
  }
  var MALE = [["m", "Erkek"], ["f", "Kadın"]];
  var ACT = [["1.2", "Hareketsiz (masa başı)"], ["1.375", "Hafif aktif (haftada 1–3 gün)"], ["1.55", "Orta aktif (haftada 3–5 gün)"], ["1.725", "Çok aktif (haftada 6–7 gün)"], ["1.9", "Ekstra aktif (günde 2 antrenman)"]];
  function bmr(v) { return 10 * v.w + 6.25 * v.h - 5 * v.a + (v.s === "m" ? 5 : -161); }

  // ---- sonuç bileşenleri ----
  function stat(label, value, dec, unit, big) {
    var n = h("b", { "data-notr": "" }, "0");
    var el = h("div", { class: "tstat" + (big ? " big" : "") }, h("span", { class: "tl", text: label }), h("div", { class: "tv" }, n, unit ? h("em", { text: unit }) : null));
    el._go = function () { countUp(n, value, dec); };
    return el;
  }
  function textStat(label, text, cls) { return h("div", { class: "tstat" + (cls ? " " + cls : "") }, h("span", { class: "tl", text: label }), h("div", { class: "tv" }, h("b", { text: text }))); }
  function bars(rows) {
    // rows: [label, pct(0-100), right text]
    var wrap = h("div", { class: "tbars" });
    rows.forEach(function (r) {
      var fill = h("i"); var row = h("div", { class: "tbar" }, h("div", { class: "tbar-h" }, h("span", { text: r[0] }), h("b", { "data-notr": "", text: r[2] })), h("div", { class: "tbar-t" }, fill));
      row._go = function () { requestAnimationFrame(function () { fill.style.width = Math.max(2, Math.min(100, r[1])) + "%"; }); };
      wrap.appendChild(row);
    });
    wrap._go = function () { Array.prototype.forEach.call(wrap.children, function (c, i) { setTimeout(c._go, REDUCE ? 0 : i * 90); }); };
    return wrap;
  }
  function gauge(min, max, value, zones) {
    // zones: [[upTo, color, label]]
    var track = h("div", { class: "tg-track" }), prev = min;
    zones.forEach(function (z) { var w = (Math.min(z[0], max) - prev) / (max - min) * 100; prev = z[0]; track.appendChild(h("span", { style: "width:" + w + "%;background:" + z[1] }, h("small", { text: z[2] }))); });
    var mark = h("i", { class: "tg-mark" }); track.appendChild(mark);
    var el = h("div", { class: "tgauge" }, track);
    el._go = function () { var p = (Math.max(min, Math.min(max, value)) - min) / (max - min) * 100; requestAnimationFrame(function () { mark.style.left = p + "%"; }); };
    return el;
  }

  // ---- alan tanımları: ["num", key, label, min, max, unit] | ["seg", key, label, opts] | ["sel", key, label, opts] ----
  var F = {
    sex: ["seg", "s", "Cinsiyet", MALE], age: ["num", "a", "Yaş", 14, 100, "yıl"], height: ["num", "h", "Boy", 100, 250, "cm"], weight: ["num", "w", "Kilo", 30, 300, "kg"],
    act: ["sel", "act", "Aktivite düzeyi", ACT],
  };

  var TOOLS = [
    { key: "boy-kilo", cat: "Sağlık", color: "#E4E4E7", icon: "ruler", title: "Boy Kilo Endeksi", desc: "Boyunuza göre ideal kilo aralığında olup olmadığınızı öğrenin.",
      fields: [F.height, F.weight],
      calc: function (v) {
        var m = v.h / 100, lo = 18.5 * m * m, hi = 24.9 * m * m, st = v.w < lo ? "Aralığın altında" : v.w > hi ? "Aralığın üstünde" : "İdeal aralıkta";
        var diff = v.w < lo ? lo - v.w : v.w > hi ? v.w - hi : 0;
        return [stat("İdeal aralık (alt)", lo, 1, "kg"), stat("İdeal aralık (üst)", hi, 1, "kg"), textStat("Durum", st, diff ? "warn" : "good"),
          diff ? stat("Aralığa uzaklık", diff, 1, "kg") : null, gauge(lo - 20, hi + 25, v.w, [[lo, "#60A5FA", "Düşük"], [hi, "#22C55E", "İdeal"], [hi + 25, "#F59E0B", "Yüksek"]])];
      }, note: "Aralık, Dünya Sağlık Örgütü’nün sağlıklı VKİ aralığına (18,5–24,9) göre hesaplanır." },
    { key: "vki", cat: "Sağlık", color: "#3B82F6", icon: "pulse", title: "Vücut Kitle İndeksi", desc: "Boy ve kilonuza göre VKİ değerinizi ve aralığınızı hesaplayın.",
      fields: [F.height, F.weight],
      calc: function (v) {
        var b = v.w / Math.pow(v.h / 100, 2), c = b < 18.5 ? "Zayıf" : b < 25 ? "Normal" : b < 30 ? "Fazla kilolu" : "Obez";
        return [stat("VKİ", b, 1, "", true), textStat("Kategori (DSÖ)", c, b >= 18.5 && b < 25 ? "good" : "warn"),
          gauge(14, 40, b, [[18.5, "#60A5FA", "Zayıf"], [25, "#22C55E", "Normal"], [30, "#F59E0B", "Fazla"], [40, "#EF4444", "Obez"]])];
      }, note: "VKİ kas kütlesini dikkate almaz; kaslı sporcularda yanıltıcı olabilir." },
    { key: "kalori", cat: "Beslenme", color: "#F97316", icon: "utensils", title: "Kalori Hesaplama", desc: "Hedefinize göre günlük almanız gereken kalori miktarını hesaplayın.",
      fields: [F.sex, F.age, F.height, F.weight, F.act, ["seg", "g", "Hedef", [["-500", "Kilo ver"], ["0", "Koru"], ["300", "Kilo al"]]]],
      calc: function (v) {
        var b = bmr(v), t = b * parseFloat(v.act), k = t + parseFloat(v.g);
        return [stat("Günlük hedef kalori", k, 0, "kcal", true), stat("Bazal metabolizma (BMR)", b, 0, "kcal"), stat("Günlük harcama (TDEE)", t, 0, "kcal"),
          bars([["Bazal metabolizma", b / k * 100, fmt(b) + " kcal"], ["Günlük harcama", Math.min(100, t / k * 100), fmt(t) + " kcal"], ["Hedef", 100, fmt(k) + " kcal"]])];
      }, note: "Mifflin-St Jeor denklemi kullanılır. Sonuç bir başlangıç tahminidir." },
    { key: "tdee", cat: "Enerji", color: "#EAB308", icon: "bolt", title: "TDEE Hesaplama", desc: "Total Daily Energy Expenditure — günlük toplam enerji harcamanızı öğrenin.",
      fields: [F.sex, F.age, F.height, F.weight, F.act],
      calc: function (v) {
        var b = bmr(v), t = b * parseFloat(v.act), mx = b * 1.9;
        return [stat("TDEE", t, 0, "kcal", true), stat("BMR", b, 0, "kcal"),
          bars(ACT.map(function (a) { var x = b * parseFloat(a[0]); return [a[1], x / mx * 100, fmt(x) + " kcal"]; }))];
      }, note: "Aktivite çarpanları: 1,2 – 1,9." },
    { key: "makro", cat: "Beslenme", color: "#A1A1AA", icon: "scale", title: "Makro Hesaplama", desc: "Protein, karbonhidrat ve yağ miktarlarınızı hesaplayın.",
      fields: [["num", "k", "Günlük kalori", 800, 8000, "kcal"], ["seg", "d", "Dağılım", [["30,40,30", "Dengeli"], ["40,30,30", "Yüksek protein"], ["35,25,40", "Düşük karb."]]]],
      calc: function (v) {
        var r = v.d.split(",").map(Number), p = v.k * r[0] / 400, c = v.k * r[1] / 400, f = v.k * r[2] / 900;
        return [stat("Protein", p, 0, "g"), stat("Karbonhidrat", c, 0, "g"), stat("Yağ", f, 0, "g"),
          bars([["Protein %" + r[0], r[0], fmt(p * 4) + " kcal"], ["Karbonhidrat %" + r[1], r[1], fmt(c * 4) + " kcal"], ["Yağ %" + r[2], r[2], fmt(f * 9) + " kcal"]])];
      }, note: "Protein ve karbonhidrat 4 kcal/g, yağ 9 kcal/g kabul edilir." },
    { key: "ideal-kilo", cat: "Hedef", color: "#A855F7", icon: "target", title: "İdeal Kilo", desc: "Boyunuza ve cinsiyetinize göre bilimsel formüllerle ideal kilonuzu hesaplayın.",
      fields: [F.sex, F.height],
      calc: function (v) {
        var inch = Math.max(0, v.h / 2.54 - 60), m = v.s === "m";
        var R = [["Devine", (m ? 50 : 45.5) + 2.3 * inch], ["Robinson", (m ? 52 : 49) + (m ? 1.9 : 1.7) * inch], ["Miller", (m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * inch], ["Hamwi", (m ? 48 : 45.5) + (m ? 2.7 : 2.2) * inch]];
        var avg = R.reduce(function (s, x) { return s + x[1]; }, 0) / R.length, mx = Math.max.apply(null, R.map(function (x) { return x[1]; }));
        return [stat("Ortalama ideal kilo", avg, 1, "kg", true), bars(R.map(function (x) { return [x[0], x[1] / mx * 100, fmt(x[1], 1) + " kg"]; }))];
      }, note: "Formüller 152 cm üzeri boylar için tasarlanmıştır; kas kütlesini dikkate almaz." },
    { key: "yag-orani", cat: "Analiz", color: "#EC4899", icon: "percent", title: "Yağ Oranı", desc: "US Navy formülüyle vücut yağ yüzdenizi ve yağsız kas kütlenizi hesaplayın.",
      fields: [F.sex, F.height, F.weight, ["num", "n", "Boyun çevresi", 20, 70, "cm"], ["num", "wa", "Bel çevresi", 40, 200, "cm"], ["num", "hi", "Kalça çevresi (kadınlar için)", 0, 200, "cm", true]],
      calc: function (v) {
        var L = Math.log10, bf;
        if (v.s === "m") { if (v.wa - v.n <= 0) return "Bel çevresi boyun çevresinden büyük olmalıdır."; bf = 495 / (1.0324 - 0.19077 * L(v.wa - v.n) + 0.15456 * L(v.h)) - 450; }
        else { if (!(v.hi > 0)) return "Kadınlar için kalça çevresi gereklidir."; bf = 495 / (1.29579 - 0.35004 * L(v.wa + v.hi - v.n) + 0.221 * L(v.h)) - 450; }
        bf = Math.max(2, Math.min(60, bf));
        var Z = v.s === "m" ? [[6, "#60A5FA", "Temel"], [14, "#22C55E", "Sporcu"], [18, "#84CC16", "Fit"], [25, "#F59E0B", "Ortalama"], [45, "#EF4444", "Yüksek"]] : [[14, "#60A5FA", "Temel"], [21, "#22C55E", "Sporcu"], [25, "#84CC16", "Fit"], [32, "#F59E0B", "Ortalama"], [50, "#EF4444", "Yüksek"]];
        return [stat("Vücut yağ oranı", bf, 1, "%", true), stat("Yağ kütlesi", v.w * bf / 100, 1, "kg"), stat("Yağsız kütle", v.w * (1 - bf / 100), 1, "kg"), gauge(2, Z[Z.length - 1][0], bf, Z)];
      }, note: "Ölçümleri sabah, mezura ile ve nefes verdikten sonra alın. Sonuç tahminidir." },
    { key: "1tm", cat: "Güç", color: "#EF4444", icon: "dumb", title: "One Rep Max (1RM)", desc: "Kaldırdığınız ağırlık ve tekrardan maksimum kaldırma kapasitenizi hesaplayın.",
      fields: [["num", "w", "Ağırlık", 1, 600, "kg"], ["num", "r", "Tekrar sayısı", 1, 15, "tekrar"]],
      calc: function (v) {
        var ep = v.r === 1 ? v.w : v.w * (1 + v.r / 30), br = v.r === 1 ? v.w : v.w * 36 / (37 - v.r), m = (ep + br) / 2;
        return [stat("Tahmini 1RM", m, 1, "kg", true), stat("Epley", ep, 1, "kg"), stat("Brzycki", br, 1, "kg"),
          bars([95, 90, 85, 80, 75, 70, 65, 60].map(function (p) { return ["%" + p, p, fmt(m * p / 100, 1) + " kg"]; }))];
      }, note: "Maksimum denemeleri ısındıktan sonra, güvenli bir ortamda ve gerekirse yardımcıyla yapın." },
    { key: "su", cat: "Sağlık", color: "#06B6D4", icon: "drop", title: "Su İhtiyacı", desc: "Kilonuza ve egzersiz sürenize göre günlük su ihtiyacınızı hesaplayın.",
      fields: [F.weight, ["num", "m", "Günlük egzersiz süresi", 0, 600, "dk"]],
      calc: function (v) {
        var l = (v.w * 33 + v.m / 30 * 350) / 1000, g = Math.round(l * 4);
        var glasses = h("div", { class: "tglasses" }); for (var i = 0; i < Math.min(g, 24); i++) glasses.appendChild(h("span", { style: "animation-delay:" + (i * 40) + "ms" }, AVF.icon("drop")));
        return [stat("Günlük su ihtiyacı", l, 1, "L", true), stat("Bardak (250 ml)", g, 0, "bardak"), glasses];
      }, note: "Sıcak hava, yoğun terleme ve bazı sağlık durumları ihtiyacı değiştirir." },
    { key: "kalp-hizi", cat: "Kardiyo", color: "#F43F5E", icon: "heart", title: "Kalp Hızı Bölgeleri", desc: "Yaşınıza göre maksimum nabzınızı ve antrenman bölgelerinizi öğrenin.",
      fields: [F.age, ["num", "r", "Dinlenik nabız (isteğe bağlı)", 0, 120, "bpm", true]],
      calc: function (v) {
        var mx = 208 - 0.7 * v.a, rest = v.r > 30 ? v.r : 0;
        function hr(p) { return rest ? rest + (mx - rest) * p : mx * p; }
        var Z = [["Bölge 1 · Toparlanma", .5, .6], ["Bölge 2 · Yağ yakımı", .6, .7], ["Bölge 3 · Aerobik", .7, .8], ["Bölge 4 · Eşik", .8, .9], ["Bölge 5 · Maksimum", .9, 1]];
        return [stat("Maksimum nabız", mx, 0, "bpm", true), textStat("Yöntem", rest ? "Karvonen (dinlenik nabızla)" : "Yüzde yöntemi"),
          bars(Z.map(function (z) { return [z[0], z[2] * 100, fmt(hr(z[1])) + "–" + fmt(hr(z[2])) + " bpm"]; }))];
      }, note: "Maksimum nabız Tanaka formülüyle (208 − 0,7 × yaş) hesaplanır." },
    { key: "protein", cat: "Beslenme", color: "#22C55E", icon: "egg", title: "Protein İhtiyacı", desc: "Kilonuza göre günlük protein ihtiyacınızı (kilo × 2 g) hesaplayın.",
      fields: [F.weight, ["seg", "n", "Günlük öğün sayısı", [["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]]]],
      calc: function (v) {
        var p = v.w * 2, per = p / parseInt(v.n, 10);
        return [stat("Günlük protein", p, 0, "g", true), stat("Öğün başına", per, 0, "g"), stat("Proteinden gelen enerji", p * 4, 0, "kcal")];
      }, note: "Hesap, kilogram başına 2 g protein üzerinden yapılır." },
    { key: "dinlenme", cat: "Zamanlayıcı", color: "#14B8A6", icon: "timer", title: "Dinlenme Süresi", desc: "Antrenman tipine göre ideal dinlenme süresini belirleyin ve sayacı başlatın.", custom: "rest" },
    { key: "bel-kalca", cat: "Analiz", color: "#6366F1", icon: "body", title: "Bel Kalça Oranı", desc: "Bel ve kalça çevrenize göre yağ dağılımınızı ve risk düzeyinizi öğrenin.",
      fields: [F.sex, ["num", "wa", "Bel çevresi", 40, 200, "cm"], ["num", "hi", "Kalça çevresi", 50, 220, "cm"]],
      calc: function (v) {
        var r = v.wa / v.hi, m = v.s === "m", lo = m ? .9 : .8, hi = m ? 1 : .85, c = r < lo ? "Düşük risk" : r < hi ? "Orta risk" : "Yüksek risk";
        return [stat("Bel / kalça oranı", r, 2, "", true), textStat("Risk düzeyi", c, r < lo ? "good" : "warn"),
          gauge(.6, 1.2, r, [[lo, "#22C55E", "Düşük"], [hi, "#F59E0B", "Orta"], [1.2, "#EF4444", "Yüksek"]])];
      }, note: "Eşikler Dünya Sağlık Örgütü önerilerine dayanır." },
    { key: "vucut-tipi", cat: "Analiz", color: "#84CC16", icon: "users", title: "Vücut Tipi Belirleme", desc: "Beş kısa soruyla baskın vücut tipinizi (ektomorf, mezomorf, endomorf) öğrenin.", custom: "body" },
  ];

  // ---- form ----
  function formFor(t, out) {
    var inputs = {}, form = h("form", { class: "tform", novalidate: true });
    t.fields.forEach(function (f) {
      if (f[0] === "num") {
        var inp = AVF.input("number", { inputmode: "decimal", step: "any", min: String(f[3]), max: String(f[4]), autocomplete: "off", placeholder: f[5] || "" });
        inputs[f[1]] = inp; form.appendChild(h("label", { class: "tfield", for: inp.id }, h("span", { class: "tfl" }, h("span", { text: f[2] }), f[6] ? h("em", { text: "İsteğe bağlı" }) : null), h("div", { class: "tin" }, inp, f[5] ? h("small", { text: f[5] }) : null)));
      } else if (f[0] === "seg") {
        var box = h("div", { class: "tseg", role: "radiogroup", "aria-label": f[2] }), val = f[3][0][0];
        f[3].forEach(function (o, i) { box.appendChild(h("button", { type: "button", role: "radio", "aria-checked": i === 0 ? "true" : "false", onclick: function () { val = o[0]; Array.prototype.forEach.call(box.children, function (b) { b.setAttribute("aria-checked", "false"); }); this.setAttribute("aria-checked", "true"); } }, o[1])); });
        inputs[f[1]] = { get value() { return val; } };
        form.appendChild(h("div", { class: "tfield" }, h("span", { class: "tfl" }, h("span", { text: f[2] })), box));
      } else {
        var sel = h("select", { class: "inp", id: "t" + f[1] + t.key }, f[3].map(function (o, i) { return h("option", { value: o[0], text: o[1], selected: i === 2 }); }));
        inputs[f[1]] = sel; form.appendChild(h("label", { class: "tfield", for: sel.id }, h("span", { class: "tfl" }, h("span", { text: f[2] })), sel));
      }
    });
    var err = h("p", { class: "terr", role: "alert" });
    form.appendChild(err);
    form.appendChild(h("button", { class: "btn block tbtn", type: "submit" }, AVF.icon("wrench", "bico"), "Hesapla"));
    form.addEventListener("submit", function (e) {
      e.preventDefault(); err.textContent = ""; var v = {}, bad = null;
      t.fields.forEach(function (f) {
        if (f[0] === "num") {
          var raw = inputs[f[1]].value, n = num(raw);
          if (f[6] && (raw === "" || isNaN(n))) { v[f[1]] = 0; return; }
          if (!(n >= f[3] && n <= f[4])) bad = bad || (AVF.t(f[2]) + ": " + f[3] + " – " + f[4] + " " + AVF.t("arasında bir değer girin."));
          v[f[1]] = n;
        } else v[f[1]] = inputs[f[1]].value;
      });
      if (bad) { err.textContent = bad; return; }
      var res = t.calc(v);
      if (typeof res === "string") { err.textContent = AVF.t(res); return; }
      showResult(out, t, res);
    });
    return form;
  }
  function showResult(out, t, parts) {
    parts = parts.filter(Boolean);
    var grid = h("div", { class: "tres" }, parts);
    AVF.mount(out, grid, t.note ? h("p", { class: "tnote" }, AVF.icon("alert"), h("span", { text: t.note })) : null);
    out.classList.remove("empty"); out.classList.remove("in"); void out.offsetWidth; out.classList.add("in");
    parts.forEach(function (p, i) { if (p._go) setTimeout(p._go, REDUCE ? 0 : 120 + i * 80); });
  }
  function emptyState(out, t) {
    out.classList.add("empty");
    AVF.mount(out, h("div", { class: "tempty" }, h("span", { class: "tempty-ic" }, AVF.icon(t.icon)), h("b", { text: t.custom === "rest" ? "Tip seçin" : "Değerleri girin" }),
      h("span", { text: t.custom === "rest" ? "Antrenman tipinizi seçerek başlayın." : "Sonuçlarınız burada görünecek." })));
  }

  // ---- dinlenme süresi + zamanlayıcı ----
  var REST = [["guc", "dumb", "Güç", "1–5 tekrar", 180, 300, "3–5 dakika"], ["hip", "target", "Hipertrofi", "6–12 tekrar", 60, 90, "60–90 saniye"], ["day", "heart", "Dayanıklılık", "15+ tekrar", 30, 60, "30–60 saniye"],
    ["hiit", "bolt", "HIIT", "Sprint", 20, 40, "20–40 saniye"], ["bil", "layers", "Bileşik", "Squat / Deadlift", 120, 180, "2–3 dakika"], ["izo", "pulse", "İzolasyon", "Biceps / Triceps", 60, 90, "60–90 saniye"]];
  var timer = null;
  function restTool(form, out, t) {
    var grid = h("div", { class: "trest" });
    REST.forEach(function (r) {
      grid.appendChild(h("button", { type: "button", "aria-pressed": "false", onclick: function () {
        Array.prototype.forEach.call(grid.children, function (b) { b.setAttribute("aria-pressed", "false"); }); this.setAttribute("aria-pressed", "true"); runTimer(out, t, r);
      } }, AVF.icon(r[1]), h("b", { text: r[2] }), h("small", { text: r[3] })));
    });
    AVF.mount(form, h("div", { class: "tfl head" }, AVF.icon("timer"), h("span", { text: "Antrenman tipi" })), grid);
  }
  function runTimer(out, t, r) {
    if (timer) { clearInterval(timer); timer = null; }
    var total = r[5], left = total, running = false;
    var R = 88, C = 2 * Math.PI * R, NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", "0 0 200 200"); svg.setAttribute("class", "tring");
    function circ(cls) { var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", "100"); c.setAttribute("cy", "100"); c.setAttribute("r", String(R)); c.setAttribute("class", cls); svg.appendChild(c); return c; }
    circ("bg"); var fg = circ("fg"); fg.style.strokeDasharray = String(C); fg.style.strokeDashoffset = "0";
    var tv = h("b", { class: "tclock", "data-notr": "" }), play = h("button", { class: "btn", type: "button" }), tsub = h("span", { text: r[6] });
    function paint() {
      tv.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
      fg.style.strokeDashoffset = String(C * (1 - left / total));
      AVF.mount(play, AVF.icon(running ? "pause" : "play", "bico"), running ? AVF.t("Duraklat") : AVF.t(left === total ? "Başlat" : "Devam et"));
    }
    function tick() { if (left <= 0) { clearInterval(timer); timer = null; running = false; out.classList.add("done"); try { navigator.vibrate && navigator.vibrate([120, 60, 120]); } catch (e) { /* yok */ } paint(); return; } left--; paint(); }
    play.addEventListener("click", function () { if (!document.body.contains(out)) return; out.classList.remove("done"); if (running) { clearInterval(timer); timer = null; running = false; } else { if (left <= 0) left = total; running = true; timer = setInterval(function () { if (!document.body.contains(out)) { clearInterval(timer); return; } tick(); }, 1000); } paint(); });
    function adj(d) { left = Math.max(5, Math.min(900, left + d)); total = Math.max(total, left); paint(); }
    AVF.mount(out, h("div", { class: "ttimer" }, h("div", { class: "tchip" }, h("b", { text: r[2] }), tsub),
      h("div", { class: "tring-w" }, svg, h("div", { class: "tring-c" }, tv, h("small", { text: "kalan süre" }))),
      h("div", { class: "row tctl" }, h("button", { class: "btn ghost sm noico", type: "button", onclick: function () { adj(-15); } }, "−15 sn"), play,
        h("button", { class: "btn ghost sm noico", type: "button", onclick: function () { adj(15); } }, "+15 sn")),
      h("button", { class: "lnk", type: "button", onclick: function () { if (timer) clearInterval(timer); timer = null; running = false; left = total; out.classList.remove("done"); paint(); } }, "Sıfırla")));
    out.classList.remove("empty"); out.classList.remove("in"); void out.offsetWidth; out.classList.add("in");
    paint();
  }

  // ---- vücut tipi ----
  var BODYQ = [["Bilek yapınız nasıl?", ["İnce", "Orta", "Kalın"]], ["Kilo alma eğiliminiz?", ["Zor alırım", "Dengeli", "Kolay alırım"]], ["Kas kazanımınız nasıl?", ["Yavaş", "Hızlı", "Kas ve yağ birlikte"]],
    ["Omuz ve bel yapınız?", ["Dar omuz, ince bel", "Geniş omuz, ince bel", "Bel omuza yakın"]], ["Metabolizma ve iştahınız?", ["Hızlı, çabuk acıkırım", "Dengeli", "Yavaş"]]];
  var BODYT = [["Ektomorf", "İnce yapılı, hızlı metabolizmalı. Kilo ve kas kazanımı için kalori fazlası ve ağırlık antrenmanı öne çıkar."],
    ["Mezomorf", "Atletik yapılı, kas kazanımı kolay. Dengeli beslenme ve çeşitli antrenmanlarla hızlı ilerler."],
    ["Endomorf", "Geniş yapılı, kilo almaya yatkın. Kalori kontrolü, kardiyo ve düzenli ağırlık antrenmanı öne çıkar."]];
  function bodyTool(form, out) {
    var ans = [];
    var qs = BODYQ.map(function (q, qi) {
      var box = h("div", { class: "tseg col" });
      q[1].forEach(function (o, oi) { box.appendChild(h("button", { type: "button", role: "radio", "aria-checked": "false", onclick: function () { ans[qi] = oi; Array.prototype.forEach.call(box.children, function (b) { b.setAttribute("aria-checked", "false"); }); this.setAttribute("aria-checked", "true"); } }, o)); });
      return h("div", { class: "tfield" }, h("span", { class: "tfl q" }, h("span", {}, h("b", { "data-notr": "", text: (qi + 1) + ". " }), h("span", { text: q[0] }))), box);
    });
    var err = h("p", { class: "terr", role: "alert" });
    AVF.mount(form, qs, err, h("button", { class: "btn block tbtn", type: "button", onclick: function () {
      err.textContent = "";
      for (var i = 0; i < BODYQ.length; i++) if (ans[i] === undefined) { err.textContent = AVF.t("Lütfen tüm soruları yanıtlayın."); return; }
      var c = [0, 0, 0]; ans.forEach(function (a) { c[a]++; }); var top = c.indexOf(Math.max.apply(null, c));
      showResult(out, { note: "Sonuç genel bir eğilimdir; çoğu kişi iki tipin karışımıdır." }, [textStat("Baskın vücut tipi", BODYT[top][0], "good"), h("p", { class: "tdesc", text: BODYT[top][1] }),
        bars(BODYT.map(function (b, i) { return [b[0], c[i] / BODYQ.length * 100, "%" + Math.round(c[i] / BODYQ.length * 100)]; }))]);
    } }, AVF.icon("wrench", "bico"), "Sonucu göster"));
  }

  // ---- sayfalar ----
  function accent(t) { return "--c:" + t.color; }
  AVF.pages.tools = function (view, key) {
    var t = TOOLS.filter(function (x) { return x.key === key; })[0];
    if (!t) {
      document.title = "Araçlar — AlpveFit";
      AVF.mount(view,
        h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("span", { class: "eyebrow" }, AVF.icon("wrench"), "Araçlar"), h("h1", { text: "Antrenman ve beslenme araçları" }),
          h("p", { text: "Hesaplayıcılar tarayıcınızda çalışır; girdiğiniz değerler hiçbir yere gönderilmez ve saklanmaz." }))),
        h("section", { class: "section dark tools-band" }, h("div", { class: "wrap" }, h("div", { class: "tgrid" }, TOOLS.map(function (x, i) {
          return link("/araclar/" + x.key, [h("div", { class: "tc-top" }, h("span", { class: "tc-ic" }, AVF.icon(x.icon)), h("span", { class: "tc-cat", text: x.cat })),
            h("h3", { text: x.title }), h("p", { text: x.desc }), h("span", { class: "tc-go" }, h("span", { text: "Hesapla" }), AVF.icon("arrow"))], { class: "tcard", style: accent(x) + ";animation-delay:" + (i * 45) + "ms" });
        })))));
      return;
    }
    document.title = t.title + " — AlpveFit";
    var words = AVF.t(t.title).split(" "), last = words.pop();
    var out = h("div", { class: "tout", "aria-live": "polite" }), form = h("div", { class: "tpanel tin-panel" });
    AVF.mount(view, h("section", { class: "section dark tools-band tdetail", style: accent(t) }, h("div", { class: "wrap" },
      h("div", { class: "thead" }, h("span", { class: "tc-cat big", text: t.cat }), h("h1", { "data-notr": "" }, words.length ? words.join(" ") + " " : "", h("span", { text: last })), h("p", { text: t.desc })),
      h("div", { class: "tlayout" }, form, h("div", { class: "tpanel" }, out)),
      h("div", { class: "tback" }, link("/araclar", "Tüm araçlar", { class: "btn ghost sm light-g" })))));
    emptyState(out, t);
    if (t.custom === "rest") restTool(form, out, t);
    else if (t.custom === "body") { bodyTool(form, out); form.insertBefore(h("div", { class: "tfl head" }, AVF.icon(t.icon), h("span", { text: "Sorular" })), form.firstChild); }
    else AVF.mount(form, h("div", { class: "tfl head" }, AVF.icon(t.icon), h("span", { text: "Bilgileriniz" })), formFor(t, out));
  };
})();
