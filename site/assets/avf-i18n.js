/* Alpvefit — dil desteği (TR/EN). Kaynak metinler Türkçedir; İngilizce seçiliyse arayüz metinleri, sunucu hata iletileri ve bildirimler
   sözlükten (avf-i18n-data.js) çevrilir. Çeviri, DOM'a yazılan metin düğümleri ve erişilebilirlik öznitelikleri üzerinde çalışır;
   data-notr işaretli alanlar (kullanıcı/uzman içeriği, hukuki metinler) çevrilmez. Seçim localStorage'da saklanır; e-postalar da bu dile göre gelir. */
(function () {
  "use strict";
  var AVF = (window.AVF = window.AVF || {});
  var stored = null; try { stored = localStorage.getItem("avf_lang"); } catch (e) { /* depolama yok */ }
  AVF.lang = stored === "en" || stored === "tr" ? stored : (String(navigator.language || "tr").toLowerCase().indexOf("tr") === 0 ? "tr" : "en");
  document.documentElement.lang = AVF.lang;
  AVF.locale = function () { return AVF.lang === "en" ? "en-GB" : "tr-TR"; };
  AVF.setLang = function (l) { try { localStorage.setItem("avf_lang", l); } catch (e) { /* yok say */ } location.reload(); };

  AVF.DICT = AVF.DICT || {};      // tam eşleşme: { "Türkçe": "English" }
  AVF.PATTERNS = AVF.PATTERNS || []; // değişkenli: [ /regex/, "English $1" ]

  function tr1(s) {
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s), core = m[2];
    if (!core) return s;
    var d = AVF.DICT[core];
    if (d !== undefined) return m[1] + d + m[3];
    for (var i = 0; i < AVF.PATTERNS.length; i++) { var p = AVF.PATTERNS[i]; if (p[0].test(core)) return m[1] + core.replace(p[0], p[1]) + m[3]; }
    // bileşik metinler: "A · B · C" parçaları ve "Etiket: değer" önekleri ayrı çevrilir (değerler kullanıcı verisi olabilir, olduğu gibi kalır)
    if (core.indexOf(" · ") > 0) {
      var parts = core.split(" · "), ch = false, out = parts.map(function (x) { var y = tr1(x); if (y !== x) ch = true; return y; });
      if (ch) return m[1] + out.join(" · ") + m[3];
    }
    if (core.indexOf(" — ") > 0) {
      var p2 = core.split(" — "), c2 = false, o2 = p2.map(function (x) { var y = tr1(x); if (y !== x) c2 = true; return y; });
      if (c2) return m[1] + o2.join(" — ") + m[3];
    }
    var ci = core.indexOf(": ");
    if (ci > 0) { var lab = AVF.DICT[core.slice(0, ci + 1)]; if (lab !== undefined) return m[1] + lab + " " + tr1(core.slice(ci + 2)) + m[3]; }
    if (core.indexOf(", ") > 0) {
      var p3 = core.split(", "), c3 = false, o3 = p3.map(function (x) { var y = tr1(x); if (y !== x) c3 = true; return y; });
      if (c3) return m[1] + o3.join(", ") + m[3];
    }
    return s;
  }
  AVF.t = function (s) { return AVF.lang === "en" && typeof s === "string" ? tr1(s) : s; };
  if (AVF.lang !== "en") return;

  var ATTRS = ["placeholder", "aria-label", "title", "alt", "aria-description"], busy = false;
  function skip(n) { for (var e = n.nodeType === 1 ? n : n.parentNode; e && e.nodeType === 1; e = e.parentNode) { if (e.hasAttribute("data-notr") || e.tagName === "SCRIPT" || e.tagName === "STYLE") return true; } return false; }
  function node(n) {
    if (n.nodeType === 3) { if (skip(n)) return; var v = tr1(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; return; }
    if (n.nodeType !== 1 || skip(n)) return;
    for (var i = 0; i < ATTRS.length; i++) { var a = n.getAttribute(ATTRS[i]); if (a) { var t = tr1(a); if (t !== a) n.setAttribute(ATTRS[i], t); } }
    if (n.tagName === "INPUT" && /^(button|submit)$/.test(n.type) && n.value) { var tv = tr1(n.value); if (tv !== n.value) n.value = tv; }
    for (var c = n.firstChild; c; c = c.nextSibling) node(c);
  }
  function title() { var t = tr1(document.title); if (t !== document.title) document.title = t; }
  function start() {
    var mo = new MutationObserver(function (list) {
      if (busy) return; busy = true;
      try {
        list.forEach(function (m) {
          if (m.type === "childList") m.addedNodes.forEach(node);
          else if (m.type === "characterData") node(m.target);
          else if (m.type === "attributes") node(m.target);
        });
        title();
      } finally { busy = false; }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    node(document.body); title();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
