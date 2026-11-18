/* AlpveFit — Ağırlık takibi: üye koçunun belirlediği hareketler için tarih, ağırlık, set, tekrar ve zorlanma (RPE) girer.
   Tablo + istatistik (en iyi, tahmini 1TM, değişim) + basit grafik. Yönetici / uzman aynı görünümü salt okunur görür. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var NS = "http://www.w3.org/2000/svg";
  function EN() { return AVF.lang === "en"; }
  function nf(x, d) { if (x === null || x === undefined || !isFinite(x)) return "—"; try { return new Intl.NumberFormat(EN() ? "en-US" : "tr-TR", { maximumFractionDigits: d === undefined ? 1 : d }).format(x); } catch (e) { return String(x); } }
  function today() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function e1rm(w, r) { return r === 1 ? w : w * (1 + r / 30); }   // Epley
  var RPE = [[6, "Rahat"], [7, "Orta"], [8, "Zorlayıcı"], [9, "Çok zor"], [10, "Tükeniş"]];
  var MUSCLE_ICON = { chest: "muscle", shoulder: "target", back: "layers", legs: "steps", abs: "body", biceps: "muscle", triceps: "muscle" };

  function chart(points) {
    // points: [{ x: "YYYY-MM-DD", y }] — tarih sırasına göre (eski → yeni)
    var W = 320, H = 120, P = 18, svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("class", "pg-ch"); svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", AVF.t("Ağırlık değişim grafiği"));
    if (points.length < 2) return null;
    var ys = points.map(function (p) { return p.y; }), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys); if (hi === lo) { hi += 1; lo -= 1; }
    var t0 = Date.parse(points[0].x), t1 = Date.parse(points[points.length - 1].x) || t0 + 1; if (t1 === t0) t1 = t0 + 1;
    function X(p) { return P + (Date.parse(p.x) - t0) / (t1 - t0) * (W - 2 * P); }
    function Y(p) { return H - P - (p.y - lo) / (hi - lo) * (H - 2 * P); }
    [0, .5, 1].forEach(function (f) { var l = document.createElementNS(NS, "line"); l.setAttribute("x1", P); l.setAttribute("x2", W - P); l.setAttribute("y1", P + f * (H - 2 * P)); l.setAttribute("y2", P + f * (H - 2 * P)); l.setAttribute("class", "pg-gl"); svg.appendChild(l); });
    var d = points.map(function (p, i) { return (i ? "L" : "M") + X(p).toFixed(1) + " " + Y(p).toFixed(1); }).join(" ");
    var area = document.createElementNS(NS, "path"); area.setAttribute("d", d + " L" + X(points[points.length - 1]).toFixed(1) + " " + (H - P) + " L" + X(points[0]).toFixed(1) + " " + (H - P) + " Z"); area.setAttribute("class", "pg-ar"); svg.appendChild(area);
    var line = document.createElementNS(NS, "path"); line.setAttribute("d", d); line.setAttribute("class", "pg-ln"); svg.appendChild(line);
    points.forEach(function (p) { var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", X(p)); c.setAttribute("cy", Y(p)); c.setAttribute("r", "3.2"); c.setAttribute("class", "pg-pt"); var t = document.createElementNS(NS, "title"); t.textContent = p.x + " · " + nf(p.y) + " kg"; c.appendChild(t); svg.appendChild(c); });
    [[hi, P], [lo, H - P]].forEach(function (v) { var t = document.createElementNS(NS, "text"); t.setAttribute("x", 2); t.setAttribute("y", v[1] + 4); t.setAttribute("class", "pg-tx"); t.textContent = nf(v[0], 0); svg.appendChild(t); });
    return svg;
  }

  /** opts: { admin: bool, memberId } */
  AVF.progressView = function (el, opts) {
    opts = opts || {};
    var api = opts.admin ? function () { return AVF.api("GET", "/admin/clients/" + opts.memberId + "/progress"); } : function () { return AVF.api("GET", "/progress"); };
    var box = h("div", { class: "stack" }, AVF.skeleton(2)), state = { ex: null };
    AVF.mount(el, opts.admin ? null : [AVF.kindTabs ? AVF.kindTabs("progress") : null, h("h2", { class: "ptitle", text: "Ağırlık Takibi" }), h("p", { class: "hint pg-lead", text: "Koçunuzun programındaki hareketler için çalıştığınız ağırlığı, set ve tekrarı ve zorlanma düzeyini kaydedin; gelişiminiz tablo ve grafikte görünür. Koçunuz da bu kayıtları görür." })], box);
    function load() {
      api().then(draw, function (e) { AVF.mount(box, AVF.state("alert", "Ağırlık takibi yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: load }, "Tekrar dene"))); });
    }
    function draw(r) {
      var ex = r.exercises || [], logs = r.logs || [];
      var names = ex.map(function (x) { return x.name; });
      logs.forEach(function (l) { if (names.indexOf(l.exercise) < 0) { names.push(l.exercise); ex.push({ name: l.exercise, group: l.muscle, old: true }); } });
      if (!ex.length) return AVF.mount(box, AVF.state("dumb", "Henüz takip edilecek hareket yok", opts.admin ? "Üyenin yayındaki antrenman planında hareket bulunmuyor." : "Koçunuz antrenman programınızı eklediğinde, programdaki hareketler için ağırlıklarınızı buradan kaydedebilirsiniz."));
      if (!state.ex || names.indexOf(state.ex) < 0) state.ex = (logs[0] && logs[0].exercise) || ex[0].name;
      var parts = [];
      if (!opts.admin) parts.push(form(ex.filter(function (x) { return !x.old; })));
      // hareket seçici (logolu)
      parts.push(h("div", { class: "pg-ex", role: "tablist", "aria-label": AVF.t("Hareket") }, ex.map(function (x) {
        var n = logs.filter(function (l) { return l.exercise === x.name; }).length, on = state.ex === x.name;
        return h("button", { type: "button", role: "tab", "aria-selected": String(on), class: "ch" + (on ? " on" : ""), onclick: function () { state.ex = x.name; draw(r); } },
          h("span", { class: "chi" }, AVF.icon(MUSCLE_ICON[x.group] || "dumb")), h("span", { "data-notr": "", text: x.name }), n ? h("small", { "data-notr": "", text: String(n) }) : null);
      })));
      var L = logs.filter(function (l) { return l.exercise === state.ex; });
      if (!L.length) parts.push(AVF.state("chart", "Bu hareket için kayıt yok", opts.admin ? "" : "İlk kaydınızı yukarıdan ekleyin."));
      else {
        var asc = L.slice().reverse(), best = L.reduce(function (a, l) { return l.weight_kg > a.weight_kg ? l : a; }, L[0]);
        var rm = L.reduce(function (a, l) { return Math.max(a, e1rm(l.weight_kg, l.reps)); }, 0);
        var first = asc[0], last = asc[asc.length - 1], diff = last.weight_kg - first.weight_kg;
        var vol = L.reduce(function (a, l) { return a + l.weight_kg * l.reps * l.sets; }, 0);
        // grafik: gün başına en yüksek ağırlık
        var byDay = {}; asc.forEach(function (l) { byDay[l.logged_on] = Math.max(byDay[l.logged_on] || 0, l.weight_kg); });
        var pts = Object.keys(byDay).sort().map(function (k) { return { x: k, y: byDay[k] }; });
        parts.push(h("div", { class: "pg-stats" },
          h("div", { class: "pg-s" }, h("small", { text: "En yüksek" }), h("b", { "data-notr": "", text: nf(best.weight_kg) + " kg" }), h("span", { "data-notr": "", text: best.reps + (EN() ? " reps · " : " tekrar · ") + AVF.fmtDate(best.logged_on) })),
          h("div", { class: "pg-s" }, h("small", { text: "Tahmini 1 tekrar maks." }), h("b", { "data-notr": "", text: nf(rm, 1) + " kg" }), h("span", { text: "Epley formülü" })),
          h("div", { class: "pg-s" + (diff > 0 ? " up" : diff < 0 ? " down" : "") }, h("small", { text: "Değişim" }), h("b", { "data-notr": "", text: (diff > 0 ? "+" : "") + nf(diff) + " kg" }), h("span", { "data-notr": "", text: AVF.fmtDate(first.logged_on) + " → " + AVF.fmtDate(last.logged_on) })),
          h("div", { class: "pg-s" }, h("small", { text: "Toplam hacim" }), h("b", { "data-notr": "", text: nf(vol, 0) + " kg" }), h("span", { "data-notr": "", text: L.length + (EN() ? " entries" : " kayıt") }))),
          pts.length > 1 ? h("div", { class: "card pg-chw" }, h("small", { class: "hint", text: "Günlük en yüksek ağırlık (kg)" }), chart(pts)) : null);
        parts.push(h("div", { class: "card tbl-w" }, h("table", { class: "t pg-t" },
          h("thead", null, h("tr", null, ["Tarih", "Ağırlık", "Set × Tekrar", "Zorlanma", "Not", ""].map(function (x) { return h("th", { text: x }); }))),
          h("tbody", null, L.map(function (l) {
            return h("tr", null, h("td", { text: AVF.fmtDate(l.logged_on) }), h("td", null, h("b", { "data-notr": "", text: nf(l.weight_kg) + " kg" })), h("td", { "data-notr": "", text: l.sets + " × " + l.reps }),
              h("td", null, l.rpe ? h("span", { class: "rpe r" + Math.min(10, Math.max(6, l.rpe)), "data-notr": "", text: "RPE " + l.rpe }) : "—"), h("td", { "data-notr": "", text: l.note || "" }),
              h("td", null, opts.admin ? null : h("button", { class: "ibtn sm", type: "button", "aria-label": AVF.t("Kaydı sil"), onclick: function () {
                AVF.confirmDialog({ icon: "trash", danger: true, title: "Kayıt silinsin mi?", text: "Bu işlem geri alınamaz.", confirm: "Sil", cancel: "Vazgeç" }).then(function (y) { if (y) AVF.api("DELETE", "/progress/" + l.id).then(load, function (e) { AVF.toast(AVF.errText(e)); }); });
              } }, AVF.icon("trash"))));
          })))));
      }
      AVF.mount(box, parts);
    }
    function form(ex) {
      if (!ex.length) return null;
      var exSel = h("select", { class: "inp", "aria-label": AVF.t("Hareket") }, ex.map(function (x) { return h("option", { value: x.name, "data-notr": "", text: x.name, selected: x.name === state.ex }); }));
      var dt = AVF.input("date", { value: today(), max: today(), "aria-label": AVF.t("Tarih") }), w = AVF.numInput({ placeholder: "kg", "aria-label": AVF.t("Ağırlık (kg)") }, 1), reps = AVF.numInput({ placeholder: AVF.t("tekrar"), "aria-label": AVF.t("Tekrar") }, 0), sets = AVF.numInput({ placeholder: "set", "aria-label": "Set" }, 0);
      sets.value = "1";
      var rpe = h("div", { class: "useg rpe-s", role: "radiogroup", "aria-label": AVF.t("Zorlanma düzeyi (RPE)") }), cur = null;
      function paintR() { AVF.mount(rpe, RPE.map(function (x) { return h("button", { type: "button", role: "radio", "aria-checked": String(cur === x[0]), "aria-pressed": String(cur === x[0]), class: "r" + x[0], onclick: function () { cur = cur === x[0] ? null : x[0]; paintR(); } }, h("b", { "data-notr": "", text: String(x[0]) }), h("small", { text: x[1] })); })); }
      paintR();
      var note = AVF.input("text", { maxlength: "200", placeholder: AVF.t("Not (isteğe bağlı)") });
      var eb = h("div"), btn = h("button", { class: "btn", type: "submit" }, AVF.icon("plus", "bico"), "Kaydı ekle");
      return h("form", { class: "card pg-f", novalidate: true, onsubmit: function (e) {
        e.preventDefault(); AVF.mount(eb, null);
        AVF.busy(btn, true, "Kaydediliyor…");
        AVF.api("POST", "/progress", { exercise: exSel.value, date: dt.value, weightKg: w.value, reps: Number(reps.value), sets: Number(sets.value || 1), rpe: cur, note: note.value }).then(function () {
          AVF.busy(btn, false); state.ex = exSel.value; AVF.toast(AVF.t("Kayıt eklendi.")); load();
        }, function (er) { AVF.busy(btn, false); AVF.mount(eb, h("div", { class: "note err", role: "alert", text: AVF.errText(er) })); });
      } }, h("h3", null, AVF.icon("plus", "bico"), h("span", { text: "Yeni kayıt" })),
        h("div", { class: "pg-g" }, AVF.field("Hareket", exSel, { icon: "dumb", optional: true }), AVF.field("Tarih", dt, { icon: "calendar", optional: true }),
          AVF.field("Ağırlık (kg)", w, { icon: "weight", optional: true }), AVF.field("Set", sets, { icon: "layers", optional: true }), AVF.field("Tekrar", reps, { icon: "refresh", optional: true })),
        AVF.field("Zorlanma düzeyi (RPE, isteğe bağlı)", rpe, { icon: "flame", optional: true }), AVF.field("Not", note, { icon: "notes", optional: true }), eb, h("div", { class: "row" }, btn));
    }
    load();
  };
})();
