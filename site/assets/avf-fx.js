/* AlpveFit — dokunsal etkileşim ve hareket: basma dalgası, titreşim geri bildirimi, kaydırınca beliren öğeler. */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PRESS = ".btn,.ibtn,.menu a,.pm button,.seg button,.nav a,.dlg .x";

  // Basma: dalga efekti + (destekleyen cihazlarda) kısa titreşim
  document.addEventListener("pointerdown", function (e) {
    var t = e.target.closest ? e.target.closest(PRESS) : null;
    if (!t || t.disabled) return;
    if (!reduce && navigator.vibrate) { try { navigator.vibrate(8); } catch (x) { /* desteklenmiyor */ } }
    if (reduce || !t.classList.contains("btn")) return;
    var r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
    var s = document.createElement("span"); s.className = "rip";
    s.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px";
    t.appendChild(s); setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 600);
  }, { passive: true });

  // Spot ışığı: kartların üzerinde imleci izleyen parıltı (yalnız fare/kalem; dokunmatikte kapalı)
  document.addEventListener("pointermove", function (e) {
    if (reduce || e.pointerType === "touch") return;
    var c = e.target.closest ? e.target.closest(".feat,a.postcard") : null; if (!c) return;
    var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  // Dokunmatikte odak vurgusu: başlığa veya karta dokununca simge ve başlık rengi değişir (masaüstündeki hover karşılığı).
  var TAP = ".shead,.feat,.astep", tapEl = null, tapT = 0;
  function untap() { if (tapEl) tapEl.classList.remove("tap"); tapEl = null; }
  document.addEventListener("touchstart", function (e) {
    var t = e.target.closest ? e.target.closest(TAP) : null; if (!t) return;
    if (tapEl !== t) untap(); clearTimeout(tapT); tapEl = t; t.classList.add("tap");
  }, { passive: true });
  document.addEventListener("touchend", function () { clearTimeout(tapT); tapT = setTimeout(untap, 1200); }, { passive: true });
  document.addEventListener("touchcancel", function () { clearTimeout(tapT); tapT = setTimeout(untap, 600); }, { passive: true });

  // Kaydırınca beliren kartlar
  var io = null;
  if (!reduce && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  }
  var SEL = "main .feat,main .pkg,main .sec,main .about>*,main .stack>.card,main .legal,main .state";
  function scan(root) {
    if (!io) return;
    var list = (root.querySelectorAll ? root.querySelectorAll(SEL) : []), i = 0;
    Array.prototype.forEach.call(list, function (el) {
      if (el.classList.contains("rv")) return;
      el.classList.add("rv"); el.style.transitionDelay = Math.min(i++ % 4, 3) * 70 + "ms"; io.observe(el);
    });
  }
  function start() {
    var main = document.getElementById("main") || document.body, q = false;
    scan(document);
    new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; scan(document); }); }).observe(document.getElementById("app") || document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
