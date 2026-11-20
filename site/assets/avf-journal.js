/* AlpveFit — Gelişim Günlüğüm (panel): kilo ve çevre ölçüleri, grafik (7 günlük ortalamayla), gelişim fotoğrafları
   (görünürlük seçimi, iki fotoğrafı kaydırarak karşılaştırma), haftalık seri ve "haftalık özeti forumda paylaş".
   Ölçüler yalnız üyenin kendisine görünür; fotoğrafların görünürlüğünü üye seçer. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h, NS = "http://www.w3.org/2000/svg";
  var KEYS = [["weight", "Kilo", "kg"], ["waist", "Bel", "cm"], ["hip", "Kalça", "cm"], ["chest", "Göğüs", "cm"], ["arm", "Kol", "cm"], ["thigh", "Uyluk", "cm"]];
  var POSES = [["on", "Önden"], ["yan", "Yandan"], ["arka", "Arkadan"], ["diger", "Diğer"]];
  var VIS = [["private", "Yalnız ben", "lock"], ["friends", "Arkadaşlarım", "users"], ["members", "Forum üyeleri", "globe"]];
  function today() { return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function fmt(n, u) { return n == null ? "—" : String(Math.round(n * 10) / 10).replace(".", ",") + (u ? " " + u : ""); }
  function fdate(d) { var p = d.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function svg(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); return e; }

  /** Çizgi grafik: noktalar (gri) + 7 günlük hareketli ortalama (kalın). */
  function chart(points, unit) {
    var W = window.innerWidth < 600 ? 360 : 640, H = window.innerWidth < 600 ? 200 : 220, L = 44, R = 12, T = 14, B = 26,   /* telefonda dar görünüm: yazılar okunur boyutta kalır */ el = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "jr-ch", role: "img", "aria-label": "Gelişim grafiği" });
    if (points.length < 2) { var t = svg("text", { x: W / 2, y: H / 2, "text-anchor": "middle", class: "jr-chm" }); t.textContent = "Grafik için en az iki kayıt gir."; el.appendChild(t); return el; }
    var xs = points.map(function (p) { return Date.parse(p.date); }), ys = points.map(function (p) { return p.v; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var pad = Math.max(0.5, (y1 - y0) * 0.15); y0 -= pad; y1 += pad; if (x1 === x0) x1 = x0 + 864e5;
    function X(x) { return L + (x - x0) / (x1 - x0) * (W - L - R); } function Y(y) { return T + (1 - (y - y0) / (y1 - y0)) * (H - T - B); }
    for (var g = 0; g <= 3; g++) { var gy = y0 + (y1 - y0) * g / 3, yy = Y(gy); el.appendChild(svg("line", { x1: L, x2: W - R, y1: yy, y2: yy, class: "jr-grid" })); var lt = svg("text", { x: L - 8, y: yy + 4, "text-anchor": "end", class: "jr-ax" }); lt.textContent = fmt(gy); el.appendChild(lt); }
    [x0, x1].forEach(function (x, i) { var tt = svg("text", { x: i ? W - R : L, y: H - 6, "text-anchor": i ? "end" : "start", class: "jr-ax" }); tt.textContent = fdate(new Date(x).toISOString().slice(0, 10)); el.appendChild(tt); });
    // 7 günlük hareketli ortalama (o güne kadarki son 7 günün kayıtları)
    var avg = points.map(function (p, i) { var s = 0, n = 0; for (var j = i; j >= 0 && xs[i] - xs[j] < 7 * 864e5; j--) { s += ys[j]; n++; } return [xs[i], s / n]; });
    el.appendChild(svg("polyline", { points: points.map(function (p, i) { return X(xs[i]) + "," + Y(ys[i]); }).join(" "), class: "jr-raw" }));
    el.appendChild(svg("polyline", { points: avg.map(function (a) { return X(a[0]) + "," + Y(a[1]); }).join(" "), class: "jr-avg" }));
    points.forEach(function (p, i) { var c = svg("circle", { cx: X(xs[i]), cy: Y(ys[i]), r: 3.2, class: "jr-dot" }); var tl = svg("title", {}); tl.textContent = fdate(p.date) + ": " + fmt(p.v, unit); c.appendChild(tl); el.appendChild(c); });
    return el;
  }

  /** İki fotoğrafı üst üste koyup kaydırıcıyla karşılaştırma. */
  function compare(a, b) {
    var range = h("input", { type: "range", min: "0", max: "100", value: "50", class: "jr-rng", "aria-label": "Karşılaştırma kaydırıcısı" });
    var top = h("div", { class: "jr-cmp-top" }, h("img", { src: b.url, alt: "Sonraki fotoğraf" }));
    var box = h("div", { class: "jr-cmp" }, h("img", { src: a.url, alt: "Önceki fotoğraf" }), top, h("span", { class: "jr-cmp-l", text: fdate(a.date) }), h("span", { class: "jr-cmp-r", text: fdate(b.date) }));
    function paint() { top.style.clipPath = "inset(0 0 0 " + range.value + "%)"; }
    range.addEventListener("input", paint); paint();
    return h("div", { class: "jr-cmpw" }, box, range, h("p", { class: "hint", text: "Kaydırıcıyı sağa sola çekerek iki fotoğrafı karşılaştır." }));
  }

  AVF.journalView = function (content) {
    var D = null, metric = "weight", span = 90, cmpSel = [];
    var root = h("div", { class: "jr" });
    AVF.mount(content, h("h2", { class: "ptitle", text: "Gelişim Günlüğüm" }), h("p", { class: "psub", text: "Kilonu, ölçülerini ve fotoğraflarını tek yerde takip et. Ölçülerin yalnız sana görünür." }), root);
    AVF.mount(root, AVF.skeleton(3));
    function load() { return AVF.api("GET", "/journal").then(function (d) { D = d; paint(); }, function (e) { AVF.mount(root, AVF.state("alert", "Yüklenemedi", AVF.errText(e))); }); }
    function msg(box, t, bad) { AVF.mount(box, t ? h("div", { class: "note" + (bad ? " err" : " ok"), role: bad ? "alert" : "status", text: t }) : null); }

    function stats() {
      var s = D.stats, diff = s.thisWeek != null && s.lastWeek != null ? Math.round((s.thisWeek - s.lastWeek) * 10) / 10 : null, tot = s.start != null && s.latest != null ? Math.round((s.latest - s.start) * 10) / 10 : null;
      function card(icon, label, val, sub, cls) { return h("div", { class: "jr-st" + (cls ? " " + cls : "") }, h("span", { class: "tile" }, AVF.icon(icon)), h("div", null, h("small", { text: label }), h("b", { text: val }), sub ? h("span", { class: "jr-sub", text: sub }) : null)); }
      return h("div", { class: "jr-stats" },
        card("flame", "Seri", s.streakWeeks + " hafta", s.streakWeeks ? "Üst üste kayıt girdiğin hafta" : "Bu hafta bir kayıt gir, seri başlasın", s.streakWeeks >= 4 ? "hot" : ""),
        card("scale", "Bu haftanın ortalaması", fmt(s.thisWeek, "kg"), diff == null ? "Geçen haftayla karşılaştırma için kayıt gir" : (diff > 0 ? "+" : "") + fmt(diff, "kg") + " geçen haftaya göre"),
        card("chart", "Başlangıçtan beri", tot == null ? "—" : (tot > 0 ? "+" : "") + fmt(tot, "kg"), s.start != null ? "İlk kayıt: " + fmt(s.start, "kg") : "Henüz kilo kaydı yok"),
        card("image", "Gelişim fotoğrafı", String(D.photos.length), "En fazla " + D.photoMax));
    }

    function form() {
      var box = h("div"), date = h("input", { type: "date", class: "inp", value: today(), max: today(), "aria-label": "Tarih" });
      var ins = {}; KEYS.forEach(function (k) { ins[k[0]] = h("input", { type: "number", class: "inp", inputmode: "decimal", step: "0.1", placeholder: k[2], "aria-label": k[1] + " (" + k[2] + ")" }); });
      var note = h("input", { type: "text", class: "inp", maxlength: "280", placeholder: "Not (isteğe bağlı): enerji, uyku, antrenman…", "aria-label": "Not" });
      var more = h("details", { class: "jr-more" }, h("summary", null, AVF.icon("plus", "bico"), "Çevre ölçüleri (isteğe bağlı)"),
        h("div", { class: "jr-grid2" }, KEYS.slice(1).map(function (k) { return h("label", { class: "jr-f" }, h("span", { text: k[1] + " (cm)" }), ins[k[0]]); })),
        h("p", { class: "hint", text: "Mezurayı gergin değil, düz tut. Bel: göbek hizası. Kol ve uyluk: en kalın yer." }));
      function fill() { var e = D.entries.filter(function (x) { return x.date === date.value; })[0]; KEYS.forEach(function (k) { ins[k[0]].value = e && e[k[0]] != null ? e[k[0]] : ""; }); note.value = e ? e.note : ""; }
      date.addEventListener("change", fill); fill();
      var btn = h("button", { class: "btn", type: "submit" }, AVF.icon("save", "bico"), "Kaydet");
      return h("form", { class: "card jr-form", novalidate: true, onsubmit: function (e) {
        e.preventDefault(); msg(box, null);
        var body = { date: date.value, note: note.value }; KEYS.forEach(function (k) { body[k[0]] = ins[k[0]].value === "" ? null : ins[k[0]].value; });
        AVF.busy(btn, true, "Kaydediliyor…");
        AVF.api("PUT", "/journal/entries", body).then(function (d) { D = d; paint(); AVF.toast("Kaydedildi. 💪"); }, function (er) { AVF.busy(btn, false); msg(box, AVF.errText(er), true); });
      } }, h("div", { class: "jr-h" }, h("h3", { text: "Kayıt ekle" }), h("span", { class: "hint", text: "Aynı güne yeni kayıt öncekinin yerine geçer." })),
        h("div", { class: "jr-row" }, h("label", { class: "jr-f" }, h("span", { text: "Tarih" }), date), h("label", { class: "jr-f" }, h("span", { text: "Kilo (kg)" }), ins.weight)),
        more, h("label", { class: "jr-f" }, h("span", { text: "Not" }), note), box, h("div", { class: "row" }, btn));
    }

    function graph() {
      var k = KEYS.filter(function (x) { return x[0] === metric; })[0];
      var from = span ? new Date(Date.now() - span * 864e5).toISOString().slice(0, 10) : "0000";
      var pts = D.entries.filter(function (e) { return e[metric] != null && e.date >= from; }).map(function (e) { return { date: e.date, v: e[metric] }; }).reverse();
      var tabs = h("div", { class: "jr-chips", role: "tablist" }, KEYS.map(function (x) { return h("button", { type: "button", class: "jr-c" + (x[0] === metric ? " on" : ""), onclick: function () { metric = x[0]; paint(); } }, x[1]); }));
      var spans = h("div", { class: "jr-chips sm" }, [[30, "30 gün"], [90, "90 gün"], [365, "1 yıl"], [0, "Tümü"]].map(function (x) { return h("button", { type: "button", class: "jr-c" + (x[0] === span ? " on" : ""), onclick: function () { span = x[0]; paint(); } }, x[1]); }));
      return h("section", { class: "card jr-gr" }, h("div", { class: "jr-h" }, h("h3", { text: k[1] + " grafiği" }), spans), tabs, chart(pts, k[2]),
        h("p", { class: "jr-leg" }, h("span", { class: "a" }), h("span", { text: "7 günlük ortalama" }), h("span", { class: "r" }), h("span", { text: "Günlük kayıt" })));
    }

    function list() {
      var rows = D.entries.slice(0, 30);
      return h("section", { class: "card jr-ls" }, h("div", { class: "jr-h" }, h("h3", { text: "Son kayıtlar" })),
        rows.length ? h("div", { class: "jr-tbl" }, rows.map(function (e) {
          var parts = KEYS.filter(function (k) { return e[k[0]] != null; }).map(function (k) { return k[1] + " " + fmt(e[k[0]], k[2]); });
          return h("div", { class: "jr-tr" }, h("b", { text: fdate(e.date) }), h("span", { class: "jr-vals", text: parts.join(" · ") + (e.note ? " — " + e.note : "") }),
            h("button", { class: "ibtn plain sm", type: "button", "aria-label": "Kaydı sil", title: "Kaydı sil", onclick: function () {
              AVF.confirmDialog({ icon: "trash", title: fdate(e.date) + " kaydı silinsin mi?", text: "Bu günün tüm ölçüleri silinir.", confirm: "Sil", cancel: "Vazgeç" }).then(function (ok) {
                if (ok) AVF.api("DELETE", "/journal/entries/" + e.id).then(function (d) { D = d; paint(); }, function (er) { AVF.toast(AVF.errText(er), "err"); }); });
            } }, AVF.icon("trash")));
        })) : AVF.state("chart", "Henüz kayıt yok", "İlk kaydını yukarıdan ekle. Sabah, tuvaletten sonra, aç karnına tartılmak en tutarlı sonucu verir."));
    }

    function photos() {
      var box = h("div"), pick = h("input", { type: "file", accept: "image/png,image/jpeg", hidden: "", tabindex: "-1" });
      var pose = h("select", { class: "inp sm", "aria-label": "Poz" }, POSES.map(function (p) { return h("option", { value: p[0], text: p[1] }); }));
      var vis = h("select", { class: "inp sm", "aria-label": "Kimler görebilir" }, VIS.map(function (v) { return h("option", { value: v[0], text: v[1] }); }));
      var date = h("input", { type: "date", class: "inp sm", value: today(), max: today(), "aria-label": "Fotoğraf tarihi" });
      var up = h("button", { class: "btn sm", type: "button", onclick: function () { pick.click(); } }, AVF.icon("image", "bico"), "Fotoğraf ekle");
      pick.addEventListener("change", function () {
        var f = pick.files && pick.files[0]; pick.value = ""; if (!f) return; msg(box, null);
        if (f.size > 4 * 1024 * 1024) return msg(box, "Fotoğraf en fazla 4 MB olabilir.", true);
        AVF.busy(up, true, "Yükleniyor…");
        f.arrayBuffer().then(function (buf) {
          return fetch("/api/journal/photos?date=" + encodeURIComponent(date.value) + "&pose=" + pose.value + "&visibility=" + vis.value, { method: "POST", credentials: "include", headers: { "Content-Type": "application/octet-stream", "x-csrf-token": AVF.cookie("avf_csrf") || "" }, body: buf })
            .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw { data: j }; return j; }); });
        }).then(function (d) { D = d; paint(); AVF.toast("Fotoğraf eklendi. 📸"); }, function (er) { AVF.busy(up, false); msg(box, AVF.errText(er), true); });
      });
      var grid = h("div", { class: "jr-ph" }, D.photos.map(function (p) {
        var sel = cmpSel.indexOf(p.id) >= 0;
        var vsel = h("select", { class: "inp xs", "aria-label": "Kimler görebilir" }, VIS.map(function (v) { return h("option", { value: v[0], text: v[1], selected: v[0] === p.visibility ? "" : null }); }));
        vsel.addEventListener("change", function () { AVF.api("PATCH", "/journal/photos/" + p.id, { visibility: vsel.value }).then(function (d) { D = d; AVF.toast("Görünürlük güncellendi."); }, function (er) { AVF.toast(AVF.errText(er), "err"); }); });
        return h("figure", { class: "jr-pi" + (sel ? " sel" : "") },
          h("button", { type: "button", class: "jr-pimg", "aria-pressed": sel ? "true" : "false", title: "Karşılaştırma için seç", onclick: function () {
            var i = cmpSel.indexOf(p.id); if (i >= 0) cmpSel.splice(i, 1); else { cmpSel.push(p.id); if (cmpSel.length > 2) cmpSel.shift(); } paint(); } },
            h("img", { src: p.url, alt: "Gelişim fotoğrafı " + fdate(p.date), loading: "lazy" }), sel ? h("span", { class: "jr-pick", text: String(cmpSel.indexOf(p.id) + 1) }) : null),
          h("figcaption", null, h("b", { text: fdate(p.date) }), h("span", { text: (POSES.filter(function (x) { return x[0] === p.pose; })[0] || [0, ""])[1] }), vsel,
            h("button", { class: "lnk sm", type: "button", onclick: function () {
              AVF.confirmDialog({ icon: "trash", title: "Fotoğraf silinsin mi?", text: "Bu işlem geri alınamaz.", confirm: "Sil", cancel: "Vazgeç" }).then(function (ok) {
                if (ok) AVF.api("DELETE", "/journal/photos/" + p.id).then(function (d) { cmpSel = cmpSel.filter(function (x) { return x !== p.id; }); D = d; paint(); }, function (er) { AVF.toast(AVF.errText(er), "err"); }); });
            } }, "Sil")));
      }));
      var pair = cmpSel.map(function (id) { return D.photos.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      return h("section", { class: "card jr-phs" }, h("div", { class: "jr-h" }, h("h3", { text: "Gelişim fotoğrafları" }), h("span", { class: "hint", text: "Konum ve cihaz bilgisi otomatik silinir." })),
        h("div", { class: "jr-up" }, date, pose, vis, up, pick), box,
        h("p", { class: "hint jr-vh" }, AVF.icon("shield", "bico"), h("span", { text: "Yalnız ben: kimse göremez. Arkadaşlarım: yalnız kabul ettiğin arkadaşların. Forum üyeleri: forum profilinde görünür. Fotoğraf Kuralları her durumda geçerlidir." })),
        D.photos.length ? grid : AVF.state("image", "Henüz fotoğraf yok", "Önden, yandan ve arkadan; aynı ışıkta ve aynı saatte çekilmiş fotoğraflar en dürüst karşılaştırmayı verir."),
        pair.length === 2 ? compare(pair[0], pair[1]) : D.photos.length > 1 ? h("p", { class: "hint", text: "Karşılaştırmak için iki fotoğrafa dokun." }) : null);
    }

    function share() {
      var s = D.stats, last = D.entries.filter(function (e) { return e.weight != null; })[0];
      function summary() {
        var diff = s.thisWeek != null && s.lastWeek != null ? Math.round((s.thisWeek - s.lastWeek) * 10) / 10 : null, wk = D.entries[0];
        var lines = ["## [ikon=chart] Haftalık güncelleme", "[tablo]", "Başlık | Bu hafta",
          "Ortalama kilo | " + fmt(s.thisWeek, "kg") + (s.lastWeek != null ? " (geçen hafta " + fmt(s.lastWeek, "kg") + ")" : ""),
          "Değişim | " + (diff == null ? "—" : (diff > 0 ? "+" : "") + fmt(diff, "kg")),
          "Seri | " + s.streakWeeks + " hafta"];
        if (wk) KEYS.slice(1).forEach(function (k) { if (wk[k[0]] != null) lines.push(k[1] + " | " + fmt(wk[k[0]], "cm")); });
        lines.push("Antrenman | ", "Enerji (1–10) | ", "[/tablo]", "", "**Not:** ");
        return lines.join("\n");
      }
      function go(path, key, text) {
        var uid = AVF.session.user ? AVF.session.user.id : "x";
        try { localStorage.setItem("avf_fd_" + uid + "_" + key, JSON.stringify({ v: text, t: Date.now() })); if (key === "new") localStorage.setItem("avf_fd_" + uid + "_newtitle", "@" + (AVF.session.user.username || "") + " · Gelişim Günlüğü"); } catch (e) { /* yok */ }
        AVF.go(path);
      }
      return h("section", { class: "card jr-sh" }, h("span", { class: "tile" }, AVF.icon("msg")), h("div", null, h("h3", { text: "Haftalık özeti forumda paylaş" }),
        h("p", { class: "hint", text: "Bu haftanın ortalaması ve ölçülerin hazır bir tabloyla yazı alanına eklenir; göndermeden önce düzenleyebilirsin. Fotoğraflar kendiliğinden eklenmez." })),
        h("button", { class: "btn", type: "button", disabled: last ? null : "", onclick: function () {
          if (D.diaryTopicId) go("/forum/konu/" + D.diaryTopicId, "t_" + D.diaryTopicId, summary());
          else go("/forum/yeni?k=gelisim-gunlukleri", "new", "Merhaba! Bu benim gelişim günlüğüm.\n\n- **Hedef:** \n- **Sistem:** \n- **Haftada:**  gün\n\n" + summary());
        } }, AVF.icon("send", "bico"), D.diaryTopicId ? "Günlüğüme ekle" : "Günlüğümü başlat"));
    }

    function paint() { AVF.mount(root, stats(), h("div", { class: "jr-cols" }, form(), share()), graph(), photos(), list()); }
    load();
  };
})();
