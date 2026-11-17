/* AlpveFit — blog: kategorili liste (sayfa başına 6 yazı), tarihsiz yazı sayfası, bilimsel kaynak listesi ve özgün kapak çizimleri.
   Yazı metni yalnız textContent ile yazılır; tek "biçim" işaretleri: ## / ### başlık, "- " madde, **kalın**, [n] atıf,
   "!uyari|…" ve "!bilgi|…" kutuları, "[n] … PMID: 123" kaynak satırı (bağlantı yalnız rakamlardan kurulur). */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  function link(href, kids, attrs) { attrs = attrs || {}; attrs.href = href; attrs["data-link"] = ""; return h("a", attrs, kids); }
  var PER_PAGE = 6;
  var CATS = [["all", "Tümü", "layers"], ["beslenme", "Beslenme", "utensils"], ["antrenman", "Antrenman", "dumb"], ["farmakoloji", "Farmakoloji", "flask"]];
  var CATNAME = { beslenme: "Beslenme", antrenman: "Antrenman", farmakoloji: "Farmakoloji" };
  var state = { cat: "all", page: 1 };

  // ---------- kapak çizimleri (sabit, güvenilir SVG; kullanıcı verisi içermez) ----------
  var INK = "#111113";
  var BG = { beslenme: ["#F5F0E7", "#E9E0CF", "#D9CBB2"], antrenman: ["#EFF2F5", "#DFE5EC", "#C9D3DE"], farmakoloji: ["#EFF3EF", "#DEE8E0", "#C7D7CB"] };
  function st(w) { return 'fill="none" stroke="' + INK + '" stroke-width="' + (w || 3.2) + '" stroke-linecap="round" stroke-linejoin="round"'; }
  var W = 'fill="#fff" stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round"';
  var MOTIF = {
    karbonhidrat: function () {
      var g = '<path d="M200 196V62" ' + st() + '/>';
      for (var i = 0; i < 5; i++) { var y = 74 + i * 22; g += '<ellipse cx="186" cy="' + y + '" rx="9" ry="15" transform="rotate(-32 186 ' + y + ')" ' + W + '/><ellipse cx="214" cy="' + y + '" rx="9" ry="15" transform="rotate(32 214 ' + y + ')" ' + W + '/>'; }
      return g + '<ellipse cx="200" cy="54" rx="7" ry="13" ' + W + '/><path d="M200 172q-26-10-40-34M200 184q24-8 36-30" ' + st(2.6) + '/>';
    },
    yag: function () {
      return '<path d="M200 50C176 92 158 116 158 146a42 42 0 0 0 84 0c0-30-18-54-42-96z" ' + W + '/><path d="M180 150a22 22 0 0 0 16 22" ' + st(3) + '/>' +
        '<ellipse cx="262" cy="170" rx="16" ry="22" transform="rotate(25 262 170)" fill="' + INK + '"/><path d="M270 150q10-14 22-16" ' + st(2.6) + '/>';
    },
    protein: function () {
      return '<path d="M200 48c-34 0-58 52-58 88a58 58 0 0 0 116 0c0-36-24-88-58-88z" ' + W + '/><path d="M172 150c0-16 12-26 28-26s28 10 28 26-12 24-28 24-28-8-28-24z" fill="' + INK + '"/>';
    },
    supplement: function () {
      return '<g transform="rotate(-35 170 124)"><rect x="128" y="104" width="84" height="40" rx="20" ' + W + '/><path d="M170 104v40" ' + st() + '/><path d="M148 104h22v40h-22a20 20 0 0 1 0-40z" fill="' + INK + '"/></g>' +
        '<circle cx="258" cy="118" r="34" ' + W + '/><path d="M258 98v20l13 9" ' + st() + '/>';
    },
    vitamin: function () {
      var g = '<circle cx="200" cy="122" r="62" ' + W + '/><circle cx="200" cy="122" r="50" ' + st(2.4) + '/>';
      for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; g += '<path d="M200 122L' + (200 + 50 * Math.cos(a)).toFixed(1) + ' ' + (122 + 50 * Math.sin(a)).toFixed(1) + '" ' + st(2.4) + '/>'; }
      return g + '<circle cx="200" cy="122" r="6" fill="' + INK + '"/>';
    },
    mineral: function () {
      return '<path d="M160 92h80l24 30-64 76-64-76z" ' + W + '/><path d="M136 122h128M176 92l-12 30 36 76 36-76-12-30M200 92l-24 30M200 92l24 30" ' + st(2.6) + '/>' +
        '<path d="M262 64l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="' + INK + '"/>';
    },
    hipertrofi: function () {
      var g = ""; for (var i = 0; i < 5; i++) { var hgt = 46 + i * 24; g += '<rect x="' + (128 + i * 30) + '" y="' + (190 - hgt) + '" width="20" height="' + hgt + '" rx="10" ' + (i === 4 ? 'fill="' + INK + '"' : W) + '/>'; }
      return g + '<path d="M126 84l40-22 34 14 50-30" ' + st(2.8) + '/><path d="M240 46h12v12" ' + st(2.8) + '/>';
    },
    atrofi: function () {
      var g = ""; for (var i = 0; i < 5; i++) { var hgt = 142 - i * 24; g += '<rect x="' + (128 + i * 30) + '" y="' + (190 - hgt) + '" width="20" height="' + hgt + '" rx="10" ' + (i === 0 ? 'fill="' + INK + '"' : W) + '/>'; }
      return g + '<path d="M150 40l40 20 34-8 44 28" ' + st(2.8) + '/><path d="M258 80h12v-12" ' + st(2.8) + '/>';
    },
    "iki-set": function () {
      return '<path d="M120 122h160" ' + st(4) + '/><rect x="138" y="82" width="22" height="80" rx="8" fill="' + INK + '"/><rect x="164" y="94" width="14" height="56" rx="6" ' + W + '/>' +
        '<rect x="240" y="82" width="22" height="80" rx="8" fill="' + INK + '"/><rect x="222" y="94" width="14" height="56" rx="6" ' + W + '/>';
    },
    ppl: function () {
      return '<circle cx="200" cy="122" r="16" fill="' + INK + '"/>' +
        '<path d="M228 122h52M266 108l14 14-14 14" ' + st(3.4) + '/><path d="M172 122h-52M134 108l-14 14 14 14" ' + st(3.4) + '/><path d="M200 150v44M186 180l14 14 14-14" ' + st(3.4) + '/>';
    },
    "upper-lower": function () {
      return '<path d="M128 122h144" ' + st(2.4) + ' stroke-dasharray="2 9"/><rect x="176" y="52" width="48" height="48" rx="16" ' + W + '/><path d="M200 88V64M190 74l10-10 10 10" ' + st() + '/>' +
        '<rect x="176" y="144" width="48" height="48" rx="16" fill="' + INK + '"/><path d="M200 156v24M190 170l10 10 10-10" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>';
    },
    split: function () {
      var g = ""; for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) { var on = (r * 4 + c) % 3 === 0; g += '<rect x="' + (128 + c * 38) + '" y="' + (78 + r * 46) + '" width="30" height="36" rx="9" ' + (on ? 'fill="' + INK + '"' : W) + '/>'; }
      return '<rect x="116" y="60" width="168" height="126" rx="20" fill="none" stroke="' + INK + '" stroke-width="2.4" opacity=".35"/>' + g;
    },
    steroid: function () {
      function hex(cx, cy) { var p = []; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; p.push((cx + 24 * Math.cos(a)).toFixed(1) + " " + (cy + 24 * Math.sin(a)).toFixed(1)); } return '<path d="M' + p.join("L") + 'z" ' + W + '/>'; }
      return hex(150, 140) + hex(191.6, 116) + hex(233.2, 140) + '<path d="M253.4 128l26 -8 14 22-18 20-22-8" ' + W + '/><circle cx="150" cy="140" r="6" fill="' + INK + '"/>';
    },
    peptit: function () {
      var pts = [[120, 150], [150, 112], [186, 136], [218, 98], [252, 124], [282, 92]], g = '<path d="M' + pts.map(function (p) { return p.join(" "); }).join("L") + '" ' + st(3) + '/>';
      pts.forEach(function (p, i) { g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" ' + (i % 2 ? 'fill="' + INK + '"' : W) + '/>'; });
      return g;
    },
    sarm: function () {
      return '<path d="M150 70v54a50 50 0 0 0 100 0V70h-26v54a24 24 0 0 1-48 0V70z" ' + W + '/><path d="M200 46v52" ' + st(3.2) + '/><circle cx="200" cy="112" r="14" fill="' + INK + '"/><path d="M160 196h80" ' + st(2.4) + ' opacity=".5"/>';
    },
    pct: function () {
      return '<path d="M112 160h176" ' + st(2.2) + ' opacity=".35"/><path d="M112 96c30 0 34 70 64 70s30-48 52-48 30 30 60 30" ' + st(3.4) + '/>' +
        '<circle cx="176" cy="166" r="8" ' + W + '/><circle cx="288" cy="148" r="9" fill="' + INK + '"/><path d="M112 70h40M112 70v10" ' + st(2.4) + ' opacity=".5"/>';
    },
  };
  var gid = 0;
  function coverSvg(key, cat, big) {
    var bg = BG[cat] || BG.beslenme, m = MOTIF[key], id = "bcg" + (++gid);
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" class="bcover-svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + bg[0] + '"/><stop offset="1" stop-color="' + bg[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="240" fill="url(#' + id + ')"/>' +
      '<circle cx="330" cy="40" r="90" fill="' + bg[2] + '" opacity=".35"/><circle cx="60" cy="230" r="70" fill="#fff" opacity=".35"/>' +
      '<g opacity=".14" fill="' + INK + '"><circle cx="40" cy="40" r="2"/><circle cx="60" cy="40" r="2"/><circle cx="40" cy="60" r="2"/><circle cx="60" cy="60" r="2"/><circle cx="350" cy="200" r="2"/><circle cx="370" cy="200" r="2"/><circle cx="350" cy="220" r="2"/><circle cx="370" cy="220" r="2"/></g>' +
      '<ellipse cx="200" cy="206" rx="' + (big ? 96 : 90) + '" ry="8" fill="' + INK + '" opacity=".06"/>' + (m ? m() : "") + "</svg>";
    var doc = new DOMParser().parseFromString(s, "image/svg+xml");
    return document.importNode(doc.documentElement, true);
  }
  AVF.blogCover = function (key, cat, big) { return h("div", { class: "bcover" + (big ? " big" : "") }, coverSvg(key, cat, big)); };

  // ---------- metin ----------
  function inline(tag, text, attrs) {
    var el = h(tag, attrs || null);
    String(text).split(/(\*\*[^*]+\*\*|\[\d+(?:,\d+)*\])/).forEach(function (part) {
      if (!part) return;
      if (/^\*\*[^*]+\*\*$/.test(part)) el.appendChild(h("strong", { text: part.slice(2, -2) }));
      else if (/^\[\d+(?:,\d+)*\]$/.test(part)) el.appendChild(h("sup", { class: "cite", text: part }));
      else el.appendChild(document.createTextNode(part));
    });
    return el;
  }
  function refLine(line) {
    var m = /^\[(\d+)\]\s+(.*)$/.exec(line); if (!m) return h("li", { text: line });
    var rest = m[2], pm = /PMID:\s*(\d{1,9})\s*$/.exec(rest);
    var li = h("li", {}, h("span", { class: "rn", text: m[1] }));
    var txt = h("span", { class: "rt" }, pm ? rest.slice(0, pm.index).trim() : rest);
    if (pm) txt.appendChild(h("a", { class: "pmid", href: "https://pubmed.ncbi.nlm.nih.gov/" + pm[1] + "/", target: "_blank", rel: "noopener noreferrer" }, "PMID: " + pm[1], AVF.icon("ext")));
    li.appendChild(txt);
    return li;
  }
  function renderBody(text) {
    var out = [], inRefs = false;
    String(text).split(/\n{2,}/).forEach(function (blk) {
      blk = blk.trim(); if (!blk) return;
      if (/^## /.test(blk)) { inRefs = /^## Kaynaklar\s*$/.test(blk); out.push(h("h2", { class: inRefs ? "refs-h" : "" }, inRefs ? AVF.icon("book") : null, h("span", { text: blk.slice(3) }))); return; }
      if (/^### /.test(blk)) { out.push(h("h3", { text: blk.slice(4) })); return; }
      var m = /^!(uyari|bilgi)\|([\s\S]+)$/.exec(blk);
      if (m) { out.push(h("div", { class: "bcall " + m[1] }, h("span", { class: "bcall-ic" }, AVF.icon(m[1] === "uyari" ? "alert" : "info")), inline("p", m[2]))); return; }
      var lines = blk.split("\n");
      if (inRefs && lines.every(function (l) { return /^\[\d+\]\s/.test(l); })) { out.push(h("ol", { class: "refs" }, lines.map(refLine))); return; }
      if (lines.every(function (l) { return /^- /.test(l); })) { out.push(h("ul", { class: "blist" }, lines.map(function (l) { return inline("li", l.slice(2)); }))); return; }
      out.push(inline("p", blk, { style: "white-space:pre-wrap" }));
    });
    return out;
  }

  // ---------- liste ----------
  function card(p, i) {
    return link("/blog/" + p.slug, [AVF.blogCover(p.cover, p.category),
      h("div", { class: "bcard-b" }, h("span", { class: "bchip c-" + p.category }, h("i"), h("span", { text: CATNAME[p.category] || "Blog" })),
        h("h3", { "data-notr": "", text: p.title }), p.excerpt ? h("p", { "data-notr": "", text: p.excerpt }) : null,
        h("span", { class: "bmore" }, h("span", { text: "Devamını oku" }), AVF.icon("arrow")))], { class: "bcard fx", style: "animation-delay:" + i * 50 + "ms" });
  }
  AVF.pages.blog = function (view) {
    document.title = "Blog — AlpveFit";
    var tabs = h("div", { class: "tfilter", role: "tablist", "aria-label": "Blog kategorileri" }), grid = h("div", { class: "bgrid" }), pager = h("nav", { class: "bpager", "aria-label": "Sayfalar" });
    var top = h("div", { class: "wrap section blog-sec" }, tabs, grid, pager);
    AVF.mount(view, h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("span", { class: "eyebrow" }, AVF.icon("book"), "Blog"), h("h1", { text: "Bilimsel temelli yazılar" }),
      h("p", { text: "Beslenme, antrenman ve farmakoloji üzerine; güncel bilimsel kaynaklarla desteklenen, sade ve anlaşılır içerikler." }))), top);
    AVF.mount(grid, h("div", { class: "bskel" }, AVF.skeleton(3)));
    AVF.api("GET", "/blog").then(function (rows) {
      if (!rows.length) { AVF.mount(grid, AVF.state("book", "Henüz yazı yok", "Yeni yazılar yayınlandığında burada görünecek.")); return; }
      function paint(scroll) {
        var list = rows.filter(function (p) { return state.cat === "all" || p.category === state.cat; });
        var pages = Math.max(1, Math.ceil(list.length / PER_PAGE)); if (state.page > pages) state.page = pages;
        AVF.mount(tabs, CATS.map(function (c) {
          var n = c[0] === "all" ? rows.length : rows.filter(function (p) { return p.category === c[0]; }).length;
          if (!n && c[0] !== "all") return null;
          return h("button", { type: "button", role: "tab", "aria-selected": String(state.cat === c[0]), onclick: function () { if (state.cat === c[0]) return; state.cat = c[0]; state.page = 1; paint(false); } },
            AVF.icon(c[2]), h("span", { text: c[1] }), h("em", { "data-notr": "", text: String(n) }));
        }));
        var slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
        AVF.mount(grid, slice.length ? slice.map(card) : AVF.state("book", "Bu kategoride yazı yok", ""));
        AVF.mount(pager, pages < 2 ? null : [
          h("button", { type: "button", class: "pg pgn", disabled: state.page === 1, "aria-label": "Önceki sayfa", onclick: function () { state.page--; paint(true); } }, AVF.icon("back")),
          Array.apply(null, Array(pages)).map(function (_, i) {
            return h("button", { type: "button", class: "pg" + (state.page === i + 1 ? " on" : ""), "aria-current": state.page === i + 1 ? "page" : null, "data-notr": "", onclick: function () { state.page = i + 1; paint(true); } }, String(i + 1));
          }),
          h("button", { type: "button", class: "pg pgn", disabled: state.page === pages, "aria-label": "Sonraki sayfa", onclick: function () { state.page++; paint(true); } }, AVF.icon("arrow"))]);
        if (scroll && top.scrollIntoView) top.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      paint(false);
    }, function (e) { AVF.mount(grid, AVF.state("alert", "Yazılar yüklenemedi", AVF.errText(e))); });
  };

  // ---------- yazı ----------
  AVF.pages.post = function (view, slug) {
    var box = h("article", { class: "bpost" }, AVF.skeleton(3));
    AVF.mount(view, h("div", { class: "wrap section blog-sec" }, h("div", { class: "bpost-col" },
      link("/blog", [AVF.icon("back"), h("span", { text: "Tüm yazılar" })], { class: "tcrumb" }), box)));
    AVF.api("GET", "/blog/" + encodeURIComponent(slug)).then(function (p) {
      document.title = p.title + " — AlpveFit";
      AVF.mount(box,
        h("header", { class: "bpost-h" }, h("span", { class: "bchip c-" + p.category }, h("i"), h("span", { text: CATNAME[p.category] || "Blog" })),
          h("h1", { "data-notr": "", text: p.title }), p.excerpt ? h("p", { class: "lead", "data-notr": "", text: p.excerpt }) : null),
        AVF.blogCover(p.cover, p.category, true),
        h("div", { class: "bpost-body", "data-notr": "" }, renderBody(p.body)),
        h("div", { class: "bpost-end" }, link("/blog", [AVF.icon("back"), h("span", { text: "Tüm yazılar" })], { class: "btn ghost" }), link("/paketler", "Paketleri incele", { class: "btn" })));
    }, function () { AVF.mount(box, AVF.state("alert", "Yazı bulunamadı", "Aradığınız yazı yayında değil veya kaldırılmış olabilir.")); });
  };
})();
