/* AlpveFit — uygulama (PWA): hizmet çalışanı kaydı ve "Uygulamayı yükle".
   Android / masaüstü Chrome-Edge: tarayıcının yükleme penceresi açılır. iPhone / iPad (Safari): kısa bir yönerge gösterilir
   (Paylaş → Ana Ekrana Ekle). Uygulama olarak açıkken ya da desteklenmeyen tarayıcıda düğme görünmez. */
(function () {
  "use strict";
  var AVF = (window.AVF = window.AVF || {});
  var deferred = null, listeners = [];
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  function standalone() { try { return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch (e) { return false; } }
  function changed() { listeners.forEach(function (f) { try { f(); } catch (e) { /* yok say */ } }); }

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () { /* site çalışmaya devam eder */ }); });
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; changed(); });
  window.addEventListener("appinstalled", function () { deferred = null; changed(); if (AVF.toast) AVF.toast("AlpveFit uygulaması yüklendi."); });

  AVF.pwa = {
    available: function () { return !standalone() && (!!deferred || (isIOS && "serviceWorker" in navigator)); },
    onChange: function (f) { listeners.push(f); },
    install: function () {
      if (deferred) { var d = deferred; deferred = null; d.prompt(); d.userChoice.then(changed, changed); return; }
      if (isIOS && AVF.confirmDialog) {
        AVF.confirmDialog({ icon: "phone", title: "AlpveFit'i ana ekrana ekleyin",
          text: "Safari'de alttaki Paylaş düğmesine dokunun, ardından “Ana Ekrana Ekle”yi seçin. AlpveFit, simgesiyle bir uygulama gibi tam ekran açılır.",
          confirm: "Anladım", cancel: "Kapat" });
      }
    },
  };
})();
