/* AlpveFit — uygulama (PWA): hizmet çalışanı kaydı ve "Uygulamayı yükle".
   Chrome / Edge / Samsung Internet / Opera: tarayıcının yükleme penceresi tek dokunuşla açılır. iPhone / iPad (her tarayıcı),
   Android Firefox ve Mac Safari: kısa yönerge. Uygulama olarak açıkken ya da desteklenmeyen tarayıcıda düğme görünmez. */
(function () {
  "use strict";
  var AVF = (window.AVF = window.AVF || {});
  var deferred = null, listeners = [];
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua), isFirefox = /Firefox|FxiOS/i.test(ua);
  var isMacSafari = !isIOS && /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox|OPR/.test(ua);
  var isChromium = !isIOS && /Chrome|Chromium|Edg|SamsungBrowser|OPR/.test(ua);
  function standalone() { try { return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch (e) { return false; } }
  function changed() { listeners.forEach(function (f) { try { f(); } catch (e) { /* yok say */ } }); }

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () { /* site çalışmaya devam eder */ }); });
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; changed(); });
  window.addEventListener("appinstalled", function () { deferred = null; changed(); if (AVF.toast) AVF.toast("AlpveFit uygulaması yüklendi."); });

  // Tarayıcıya göre yükleme yolu: Chrome / Edge / Samsung Internet / Opera (Android ve bilgisayar) → tarayıcının kendi yükleme
  // penceresi DOĞRUDAN açılır (tek dokunuş). Apple cihazları ve Firefox yükleme penceresini sitelere açmaz; orada kısa yönerge gösterilir.
  function guide() {
    if (isIOS) return /CriOS|EdgiOS|FxiOS/.test(ua)
      ? "Adres çubuğundaki Paylaş düğmesine dokunun, ardından “Ana Ekrana Ekle”yi seçin. AlpveFit, simgesiyle bir uygulama gibi tam ekran açılır."
      : "Safari'de alttaki Paylaş düğmesine dokunun, ardından “Ana Ekrana Ekle”yi seçin. AlpveFit, simgesiyle bir uygulama gibi tam ekran açılır.";
    if (isAndroid && isFirefox) return "Sağ üstteki ⋮ menüsüne dokunun, ardından “Yükle” ya da “Ana ekrana ekle”yi seçin.";
    if (isMacSafari) return "Safari menüsünde Dosya → “Dock'a Ekle”yi seçin. AlpveFit, Dock'tan ayrı bir uygulama gibi açılır.";
    if (isChromium) return isAndroid ? "Sağ üstteki ⋮ menüsüne dokunun, ardından “Uygulamayı yükle”yi seçin." : "Adres çubuğunun sağındaki yükleme simgesine ya da ⋮ menüsündeki “Uygulamayı yükle”ye tıklayın.";
    return "";
  }
  AVF.pwa = {
    available: function () { return !standalone() && "serviceWorker" in navigator && (!!deferred || !!guide()); },
    onChange: function (f) { listeners.push(f); },
    install: function () {
      if (deferred) { var d = deferred; deferred = null; try { d.prompt(); d.userChoice.then(changed, changed); } catch (e) { changed(); } return; }
      var g = guide();
      if (g && AVF.confirmDialog) AVF.confirmDialog({ icon: "phone", title: isMacSafari || (!isIOS && !isAndroid) ? "AlpveFit'i uygulama olarak yükleyin" : "AlpveFit'i ana ekrana ekleyin", text: g, confirm: "Anladım", cancel: "Kapat" });
    },
  };
})();
