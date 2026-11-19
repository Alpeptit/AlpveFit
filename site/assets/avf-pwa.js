/* AlpveFit — uygulama (PWA): hizmet çalışanı kaydı ve "Uygulamayı yükle".
   Chrome / Edge / Samsung Internet / Opera: tarayıcının yükleme penceresi tek dokunuşla DOĞRUDAN açılır.
   Diğer tarayıcılarda (iPhone / iPad'deki tüm tarayıcılar, Firefox, Mac Safari) kullanılan tarayıcıya özel, adım adım
   küçük bir rehber alttan yumuşakça açılır. Misafir ve üye için aynıdır; uygulama olarak açıkken seçenek görünmez. */
(function () {
  "use strict";
  var AVF = (window.AVF = window.AVF || {});
  var deferred = null, listeners = [];
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  function standalone() { try { return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch (e) { return false; } }
  function changed() { listeners.forEach(function (f) { try { f(); } catch (e) { /* yok say */ } }); }

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () { /* site çalışmaya devam eder */ }); });
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; changed(); });
  window.addEventListener("appinstalled", function () { deferred = null; closeSheet(); changed(); if (AVF.toast) AVF.toast("AlpveFit uygulaması yüklendi. 🎉"); });

  // Tarayıcı tanıma: rehber adımları buna göre seçilir. [ad, yön (ok nereyi göstersin), adımlar [simge, metin]]
  function browser() {
    var dev = isIOS ? "ios" : isAndroid ? "android" : "desktop";
    var name = /EdgiOS|EdgA|Edg\//.test(ua) ? "edge" : /CriOS/.test(ua) ? "chrome" : /FxiOS|Firefox/.test(ua) ? "firefox" : /SamsungBrowser/.test(ua) ? "samsung" : /OPR|OPiOS|Opera/.test(ua) ? "opera"
      : /YaBrowser/.test(ua) ? "yandex" : isIOS || (/Safari/.test(ua) && !/Chrome|Chromium/.test(ua)) ? "safari" : /Chrome|Chromium/.test(ua) ? "chrome" : "other";
    return { dev: dev, name: name };
  }
  var NAMES = { safari: "Safari", chrome: "Chrome", edge: "Edge", firefox: "Firefox", samsung: "Samsung Internet", opera: "Opera", yandex: "Yandex", other: "Tarayıcı" };
  function steps() {
    var b = browser(), S = "share", P = "plus", M = "more";
    if (b.dev === "ios") {
      if (b.name === "safari") return { dir: "down", list: [[S, "Alttaki **Paylaş** düğmesine dokun (kare ve yukarı ok)."], [P, "Listeyi kaydır, **Ana Ekrana Ekle**'yi seç."], ["check", "Sağ üstte **Ekle**'ye dokun. Bitti!"]] };
      if (b.name === "chrome") return { dir: "up", list: [[S, "Adres çubuğunun sağındaki **Paylaş** simgesine dokun."], [P, "**Ana Ekrana Ekle**'yi seç."], ["check", "**Ekle**'ye dokun. Bitti!"]] };
      if (b.name === "edge" || b.name === "firefox") return { dir: "down", list: [[M, "Alttaki **≡ / ⋯ menüsüne** dokun."], [S, "**Paylaş**'ı seç."], [P, "**Ana Ekrana Ekle** → **Ekle**. Bitti!"]] };
      return { dir: "down", list: [[S, "Tarayıcının **Paylaş** düğmesine dokun."], [P, "**Ana Ekrana Ekle**'yi seç."], ["check", "**Ekle**'ye dokun."]] };
    }
    if (b.dev === "android") {
      if (b.name === "samsung") return { dir: "down", list: [[M, "Alttaki **≡ menüsüne** dokun."], [P, "**Sayfayı ekle** → **Ana ekran**'ı seç."], ["check", "**Ekle**'ye dokun. Bitti!"]] };
      if (b.name === "firefox") return { dir: "up", list: [[M, "Sağ üstteki **⋮ menüsüne** dokun."], [P, "**Yükle** ya da **Ana ekrana ekle**'yi seç."], ["check", "**Ekle**'ye dokun. Bitti!"]] };
      return { dir: "up", list: [[M, "Sağ üstteki **⋮ menüsüne** dokun."], [P, "**Uygulamayı yükle** ya da **Ana ekrana ekle**'yi seç."], ["check", "**Yükle**'ye dokun. Bitti!"]] };
    }
    if (b.name === "safari") return { dir: "up", list: [["file", "Üstteki menüden **Dosya**'yı aç."], [P, "**Dock'a Ekle**'yi seç."], ["check", "**Ekle**'ye tıkla; AlpveFit Dock'ta ayrı bir uygulama olur."]] };
    if (b.name === "firefox") return { dir: "", list: [["globe", "Firefox bilgisayarda siteleri uygulama olarak yüklemiyor."], ["phone", "**Chrome**, **Edge** ya da telefonundan aç; yükleme tek dokunuş."], ["check", "Ya da siteyi yer imlerine ekle (Ctrl+D)."]] };
    return { dir: "up", list: [[P, "Adres çubuğunun sağındaki **yükle** simgesine tıkla."], [M, "Görmüyorsan **⋮ menüsü** → **Uygulamayı yükle**."], ["check", "**Yükle**'ye tıkla. Bitti!"]] };
  }

  // ---- rehber: alttan açılan küçük, yumuşak kart (telefonda ok, düğmenin bulunduğu yeri gösterir)
  var sheet = null;
  function closeSheet() { if (!sheet) return; var s = sheet; sheet = null; s.classList.add("out"); setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 220); document.removeEventListener("keydown", esc, true); }
  function esc(e) { if (e.key === "Escape") closeSheet(); }
  function rich(t) { var out = [], re = /\*\*([^*]+)\*\*/g, last = 0, m; while ((m = re.exec(t))) { if (m.index > last) out.push(document.createTextNode(t.slice(last, m.index))); out.push(AVF.h("b", { text: m[1] })); last = re.lastIndex; } if (last < t.length) out.push(document.createTextNode(t.slice(last))); return out; }
  function openSheet() {
    closeSheet();
    var h = AVF.h, b = browser(), st = steps();
    var ico = function (n) { return n === "share" ? h("span", { class: "pw-share" }, AVF.icon("up")) : n === "more" ? AVF.icon("more") : AVF.icon(n); };
    sheet = h("div", { class: "pw-sheet" + (st.dir ? " d-" + st.dir : "") + " " + b.dev, role: "dialog", "aria-modal": "false", "aria-labelledby": "pw-t" },
      h("div", { class: "pw-card" },
        h("button", { class: "pw-x", type: "button", "aria-label": "Kapat", onclick: closeSheet }, AVF.icon("x")),
        h("div", { class: "pw-head" }, h("img", { class: "pw-app", src: "/assets/icons/icon-192.png", alt: "", width: "44", height: "44" }),
          h("div", null, h("b", { id: "pw-t", text: "AlpveFit'i yükle" }), h("small", null, h("span", { class: "pw-br", text: NAMES[b.name] + (b.dev === "ios" ? " · iPhone/iPad" : b.dev === "android" ? " · Android" : " · Bilgisayar") }), h("span", { text: " için 3 kısa adım" })))),
        h("ol", { class: "pw-steps" }, st.list.map(function (x, i) { return h("li", { style: "animation-delay:" + (80 + i * 90) + "ms" }, h("span", { class: "pw-n", text: String(i + 1) }), h("span", { class: "pw-i" }, ico(x[0])), h("span", { class: "pw-tx" }, rich(x[1]))); })),
        h("p", { class: "pw-why" }, AVF.icon("bolt"), h("span", { text: "Tam ekran açılır, daha hızlı yüklenir; planların ve mesajların bir dokunuş uzağında." })),
        h("button", { class: "btn block", type: "button", onclick: closeSheet }, "Anladım")),
      st.dir && b.dev !== "desktop" ? h("span", { class: "pw-arrow", "aria-hidden": "true" }, AVF.icon(st.dir === "down" ? "chev" : "up")) : null);
    document.body.appendChild(sheet);
    document.addEventListener("keydown", esc, true);
    setTimeout(function () { var f = sheet && sheet.querySelector(".btn"); if (f) f.focus({ preventScroll: true }); }, 60);
  }

  AVF.pwa = {
    // misafir dahil herkes: uygulama olarak açık değilse seçenek görünür (Chrome ailesinde doğrudan, diğerlerinde rehberle)
    available: function () { return !standalone(); },
    direct: function () { return !!deferred; },
    onChange: function (f) { listeners.push(f); },
    install: function () {
      if (deferred) { var d = deferred; deferred = null; try { d.prompt(); d.userChoice.then(function (c) { if (c && c.outcome !== "accepted") deferred = null; changed(); }, changed); } catch (e) { changed(); openSheet(); } return; }
      openSheet();
    },
    guide: openSheet,
  };
})();
