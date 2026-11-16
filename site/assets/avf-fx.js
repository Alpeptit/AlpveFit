/* Alpvefit — dokunsal etkileşim ve hareket: basma dalgası, titreşim geri bildirimi, kaydırınca beliren öğeler. */
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
