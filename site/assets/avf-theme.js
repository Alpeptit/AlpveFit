/* AlpveFit — aydınlık / karanlık tema. <head> içinde, stil dosyasından önce yüklenir (ilk çizimde yanıp sönme olmaz).
   Tercih: "light" | "dark" | "system" (varsayılan: cihazın ayarı). Yalnız bu cihazda saklanır. */
(function () {
  "use strict";
  var KEY = "avf_theme", root = document.documentElement;
  function pref() { try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : "system"; } catch (e) { return "system"; } }
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function effective(p) { return p === "system" ? (mq && mq.matches ? "dark" : "light") : p; }
  function apply(p) {
    var t = effective(p);
    root.setAttribute("data-theme", t);
    root.style.colorScheme = t;
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t === "dark" ? "#0B0B0D" : "#F7F7F5");
  }
  apply(pref());
  if (mq) { var on = function () { if (pref() === "system") { apply("system"); if (window.AVF && AVF.onTheme) AVF.onTheme(); } }; if (mq.addEventListener) mq.addEventListener("change", on); else if (mq.addListener) mq.addListener(on); }
  window.AVF_THEME = {
    get: pref, current: function () { return effective(pref()); },
    set: function (p) { try { if (p === "system") localStorage.removeItem(KEY); else localStorage.setItem(KEY, p); } catch (e) { /* depolama yok */ } apply(p); if (window.AVF && AVF.onTheme) AVF.onTheme(); },
  };
})();
