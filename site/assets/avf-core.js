/* AlpveFit — ortak çekirdek: DOM yardımcıları, API istemcisi (CSRF), bildirimler, reCAPTCHA. Kullanıcı verisi HİÇBİR ZAMAN innerHTML ile yazılmaz. */
(function () {
  "use strict";
  var AVF = (window.AVF = window.AVF || {});

  // ---------- simgeler (yalnız sabit, güvenilir SVG yolları) ----------
  var P = {
    ruler: "M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2", utensils: "M7 3v8a2 2 0 002 2v8M5 3v5a2 2 0 004 0V3M17 21V3c-2 1-3 4-3 8h3",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z", percent: "M19 5L5 19M7 9a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z",
    drop: "M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z", heart: "M12 20s-7-4.4-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.6-9 9-9 9z",
    timer: "M12 21a8 8 0 100-16 8 8 0 000 16zM12 9v4l2 2M9 2h6", body: "M12 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM5 10l7-1 7 1M12 9v6M9 22l3-7 3 7",
    egg: "M12 3c3.5 0 6 6 6 10a6 6 0 01-12 0c0-4 2.5-10 6-10z", play: "M7 4l13 8-13 8z", pause: "M7 4h4v16H7zM13 4h4v16h-4z",
    userplus: "M10 12a4 4 0 100-8 4 4 0 000 8zM3 21a7 7 0 0114 0M19 8v6M16 11h6",
    wrench: "M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z", clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
    building: "M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M16 9h2a2 2 0 012 2v10M3 21h18M8 7h4M8 11h4M8 15h4", compass: "M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z",
    scale: "M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0zM12 3l-2 2h4z", headset: "M4 15v-3a8 8 0 0116 0v3M4 15a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 15a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM17 17v1a3 3 0 01-3 3h-2",
    ticket: "M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4zM14 6v12", chat: "M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12zM8.5 12h.01M12 12h.01M15.5 12h.01",
    spark: "M12 3l2 5.5L19.5 10 14 12l-2 6-2-6-5.5-2L10 8.5zM19 3v4M21 5h-4", target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 17a5 5 0 100-10 5 5 0 000 10zM12 13a1 1 0 100-2 1 1 0 000 2z",
    layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5", award: "M12 15a6 6 0 100-12 6 6 0 000 12zM8.5 13.5L7 21l5-3 5 3-1.5-7.5", mission: "M4 21V4M4 4h12l-2 4 2 4H4",
    help: "M9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01M3 12a9 9 0 1018 0 9 9 0 10-18 0", file: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6", pulse: "M3 12h4l2-6 4 12 2-6h6", up: "M12 19V5M6 11l6-6 6 6",
    arrow: "M5 12h14M13 6l6 6-6 6", back: "M19 12H5M11 6l-6 6 6 6", send: "M22 2L11 13M22 2l-7 20-4-9-9-4z", book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5M9 7h6", calc: "M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01", msg: "M4 5h16v11H9l-5 4z", save: "M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7",
    home: "M3 11l9-8 9 8M5 10v10h14V10", user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0", bell: "M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0",
    lock: "M6 11h12v10H6zM8 11V8a4 4 0 118 0v3", shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", check: "M5 12l5 5 9-10", x: "M6 6l12 12M18 6L6 18",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z", eyeoff: "M3 3l18 18M10 6.2A9.7 9.7 0 0112 6c6 0 10 6 10 6a17 17 0 01-3 3.5M6.5 7.5A17 17 0 002 12s4 7 10 7c1.6 0 3-.4 4.3-1",
    menu: "M4 6h16M4 12h16M4 18h16", chev: "M6 9l6 6 6-6", mail: "M3 6h18v12H3zM3 7l9 6 9-6", id: "M3 5h18v14H3zM7 10h4M7 14h6M15 10h2",
    apple: "M12 7c-1-2-4-2-5 0-2 3 0 9 3 9 1 0 1.5-.5 2-.5s1 .5 2 .5c3 0 5-6 3-9-1-2-4-2-5 0zM12 7c0-2 1-3 3-4", dumb: "M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12",
    pill: "M10.5 3.5a4.5 4.5 0 016.4 6.4l-7 7a4.5 4.5 0 01-6.4-6.4zM8 8l8 8", flask: "M9 3h6M10 3v6L4.5 19a1.5 1.5 0 001.3 2.2h12.4a1.5 1.5 0 001.3-2.2L14 9V3M7.5 15h9",
    pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z", globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01", cog: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-1.5-3-2.2.6a7 7 0 00-1.3-.8L15.5 5h-3l-.5 2.8-1.3.8L8.5 8 7 11l2 1v1l-2 1 1.5 3 2.2-.6c.4.3.8.6 1.3.8l.5 2.8h3l.5-2.8c.5-.2.9-.5 1.3-.8l2.2.6 1.5-3-2-1z",
    alert: "M12 8v5M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z", users: "M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-1a4 4 0 00-3-3.9M16 4.1a3.5 3.5 0 010 6.8",
    cookie: "M12 3a9 9 0 109 9 4 4 0 01-4-4 4 4 0 01-5-5zM8.5 11h.01M12 16h.01M15.5 13h.01", out: "M9 21H5V3h4M16 17l5-5-5-5M21 12H9", refresh: "M20 11a8 8 0 00-14-4L4 9M4 4v5h5M4 13a8 8 0 0014 4l2-2M20 20v-5h-5", plus: "M12 5v14M5 12h14", card: "M2 6h20v12H2zM2 10h20M6 15h4", coin: "M12 21a9 9 0 100-18 9 9 0 000 18zM9 9h5a1.8 1.8 0 010 3.6H9m0 0h5.4a1.8 1.8 0 010 3.6H9M12 7v2M12 16v2", copy: "M8 8h12v12H8zM4 16V4h12", clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2", clipboard: "M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4", tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01", trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
    female: "M12 13a5 5 0 100-10 5 5 0 000 10zM12 13v8M8.5 18h7", male: "M10 20a6 6 0 100-12 6 6 0 000 12zM14.3 9.7L21 3M15 3h6v6",
    drop: "M12 3C9 8 6 11 6 15a6 6 0 0012 0c0-4-3-7-6-12z", briefcase: "M3 8h18v12H3zM9 8V5h6v3M3 13h18", calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
    ruler: "M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2", weight: "M6 8h12l2 12H4zM9 8a3 3 0 016 0M10 14h4", flame: "M12 21a6 6 0 006-6c0-3-2-5-3-8-1.5 1.5-2 2.5-3 2.5C11 7 10 5 9 3 8 8 6 10 6 15a6 6 0 006 6z",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z", steps: "M3 16l6-9h3l1 4 7 2v4H3zM3 20h18", image: "M3 5h18v14H3zM8 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 16l-5-5-8 8",
    notes: "M5 3h14v18H5zM9 8h6M9 12h6M9 16h3", syringe: "M18 2l4 4M17 7l3-3M19 9L9 19l-4 1 1-4L16 6zM14 8l2 2M11 11l2 2M8 14l2 2M3 21l3-3", device: "M3 5h18v11H3zM8 20h8M12 16v4", clip: "M20 12l-8 8a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8",
    key: "M14 10a4 4 0 11-3.9 5H7l-2 2H3v-2l6.3-6.3A4 4 0 0114 10zM15.5 9.5h.01", muscle: "M4 15c0-3 2-4 4-4l2-3c1-2 4-2 5 0l1 3c2 0 4 1 4 4s-2 4-5 4H9c-3 0-5-1-5-4z",
    ext: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6", reply: "M5 4v7a4 4 0 004 4h10M15 11l4 4-4 4", info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01",
    youtube: "M3 8.5a3 3 0 013-3h12a3 3 0 013 3v7a3 3 0 01-3 3H6a3 3 0 01-3-3zM10 9.5v5l4.5-2.5z",
    instagram: "M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4zM12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM17 7h.01",
    tiktok: "M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3a5 5 0 005 5",
  };
  AVF.icon = function (n, cls) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "ico" + (cls ? " " + cls : "")); s.setAttribute("aria-hidden", "true");
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", P[n] || P.alert); s.appendChild(p); return s;
  };


  // Marka: tek kaynak. Yuvarlatılmış kare içinde yumuşak köşeli bir "A"; yanında "AlpveFit" yazısı.
  // light = açık zemin (siyah kare). Koyu zeminde (light=false) beyaz kare + siyah çizgi.
  AVF.mark = function (size) {
    var NS = "http://www.w3.org/2000/svg", s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 64 64"); s.setAttribute("class", "lmk"); s.setAttribute("aria-hidden", "true");
    if (size) { s.setAttribute("width", size); s.setAttribute("height", size); }
    [["rect", { width: "64", height: "64", rx: "18", class: "lmk-bg" }],
     ["path", { d: "M19.5 46.5L30 20.5q2-4.5 4 0l10.5 26", fill: "none", class: "lmk-fg", "stroke-width": "6", "stroke-linecap": "round", "stroke-linejoin": "round" }],
     ["path", { d: "M24.5 37.5h15", fill: "none", class: "lmk-fg", "stroke-width": "5.5", "stroke-linecap": "round" }]].forEach(function (e) { var n = document.createElementNS(NS, e[0]); Object.keys(e[1]).forEach(function (k) { n.setAttribute(k, e[1][k]); }); s.appendChild(n); });
    return s;
  };
  AVF.logo = function (onDark) {
    return AVF.h("span", { class: "logo" + (onDark ? " ondark" : "") }, AVF.mark(), AVF.h("span", { class: "wm", "data-notr": "" }, "AlpveFit"));
  };
  // Zengin metin: yalnız **kalın** işaretini tanır; tüm parçalar textContent ile yazılır (HTML yorumlanmaz).
  AVF.rich = function (tag, text, attrs) {
    var el = AVF.h(tag, attrs || null);
    String(text).split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
      if (!part) return;
      if (/^\*\*[^*]+\*\*$/.test(part)) el.appendChild(AVF.h("strong", { text: part.slice(2, -2) }));
      else el.appendChild(document.createTextNode(part));
    });
    return el;
  };

  // ---------- DOM ----------
  AVF.h = function (tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k]; if (v == null || v === false) return;
      if (k === "class") el.className = v;
      else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (k === "text") el.textContent = v;
      else if (v === true) el.setAttribute(k, "");
      else el.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    if ((tag === "a" || tag === "button") && /(^|\s)btn(\s|$)/.test(el.className)) decorate(el);
    return el;
  };
  // Tüm düğmeler simge taşır: etiketten anlamlı bir simge seçilir (yalnız simgesi olmayan, metinli düğmelerde).
  var BTN_ICONS = [
    [/giriş|login|sign in/i, "user"], [/kayıt ol|üye ol|sign up|register/i, "userplus"], [/çıkış/i, "out"], [/kopyala/i, "copy"],
    [/sil\b|silin|kaldır|hesabı sil/i, "trash"], [/iptal|kapat|vazgeç|reddet/i, "x"], [/geri\b|önceki|ana sayfa/i, "back"],
    [/öde|satın|kart/i, "card"], [/gönder|yayınla|ilet/i, "send"], [/yeni|ekle|oluştur/i, "plus"], [/yenile|tekrar|dene/i, "refresh"],
    [/kaydet|onayla|doğrula|tamam|evet|etkinleştir|aktif/i, "check"], [/şifre|güvenlik/i, "lock"], [/e-posta|mail/i, "mail"]
  ];
  function decorate(el) {
    if (el.classList.contains("noico") || el.querySelector("svg") || !el.textContent.trim()) return;
    var txt = el.textContent, name = "arrow", lead = false;
    for (var i = 0; i < BTN_ICONS.length; i++) if (BTN_ICONS[i][0].test(txt)) { name = BTN_ICONS[i][1]; lead = name !== "arrow"; break; }
    var ic = AVF.icon(name, "bico");
    if (name === "back" || lead) el.insertBefore(ic, el.firstChild); else el.appendChild(ic);
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) return c.forEach(function (x) { add(el, x); });
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  AVF.clear = function (el) { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  AVF.mount = function (el) { AVF.clear(el); for (var i = 1; i < arguments.length; i++) add(el, arguments[i]); };

  // ---------- çerez / API ----------
  AVF.cookie = function (name) {
    var m = document.cookie.split("; ").filter(function (x) { return x.indexOf(name + "=") === 0; })[0];
    return m ? decodeURIComponent(m.slice(name.length + 1)) : "";
  };
  AVF.session = { user: null };
  AVF.onSessionEnd = null;   // uygulama tarafından atanır (oturum süresi doldu / kilitlendi)

  // Hata nesnesi: { status, data }. 401 sessionExpired → oturum kapatılır (altyapı hatası 503 oturumu SONLANDIRMAZ).
  AVF.api = function (method, path, body, extra) {
    var headers = { Accept: "application/json" };
    if (extra) Object.keys(extra).forEach(function (k) { headers[k] = extra[k]; });
    var opt = { method: method, credentials: "same-origin", headers: headers };
    if (body !== undefined) { headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
    if (method !== "GET") { var c = AVF.cookie("avf_csrf"); if (c) headers["x-csrf-token"] = c; }
    headers["x-avf-lang"] = AVF.lang || "tr";
    return fetch("/api" + path, opt).then(function (r) {
      return r.text().then(function (t) {
        var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; }
        if (r.ok) return d;
        var err = { status: r.status, data: d || {} };
        if (r.status === 401 && err.data.sessionExpired && AVF.session.user && AVF.onSessionEnd) AVF.onSessionEnd("expired");   // ziyaretçinin ilk /auth/me yoklaması oturum sonu sayılmaz
        if (r.status === 403 && err.data.error === "account_locked" && AVF.onSessionEnd && AVF.session.user) AVF.onSessionEnd("locked", err.data);
        throw err;
      });
    }, function () { throw { status: 0, data: { error: "network" } }; });
  };
  AVF.errText = function (e) {
    var d = (e && e.data) || {};
    if (e && e.status === 0) return "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.";
    if (e && e.status === 503) return d.error || "Sunucu geçici olarak yanıt veremiyor. Lütfen birazdan tekrar deneyin.";
    if (d.error === "banned") return "Çok fazla hatalı deneme yapıldı. Lütfen " + AVF.until(d.bannedUntil) + " sonra tekrar deneyin.";
    if (d.error === "account_locked") return d.temporary ? "Hesabınız güvenlik nedeniyle " + (d.lockMinutes || 30) + " dakika kilitlendi (" + AVF.fmtTime(d.lockedUntil) + " saatine kadar). Şifrenizi sıfırlayarak kilidi hemen kaldırabilirsiniz." : "Hesabınız kilitlendi. Yardım için " + (d.support || "destek@alpvefit.com") + " adresine yazın.";
    if (d.error === "wrong_code") return "Kod hatalı. Lütfen tekrar deneyin.";
    if (d.error === "invalid_credentials") return "Kullanıcı adı/e-posta veya şifre hatalı.";
    if (d.message && !d.error) return d.message;
    if (d.error === "reset_expired" || d.error === "reset_too_many") return d.message || "İstek geçersiz.";
    return d.error || "Bir sorun oluştu. Lütfen tekrar deneyin.";
  };
  AVF.until = function (iso) {
    var s = Math.max(1, Math.round((new Date(iso).getTime() - Date.now()) / 1000));
    var en = AVF.lang === "en";
    return s >= 3600 ? Math.round(s / 3600) + (en ? " hours" : " saat") : s >= 60 ? Math.ceil(s / 60) + (en ? " minutes" : " dakika") : s + (en ? " seconds" : " saniye");
  };

  // ---------- biçim ----------
  AVF.fmtDate = function (iso) { try { return new Date(iso).toLocaleDateString(AVF.locale ? AVF.locale() : "tr-TR", { day: "2-digit", month: "long", year: "numeric" }); } catch (e) { return ""; } };
  // Gün.Ay.Yıl Saat:Dakika:Saniye (sipariş listesi)
  AVF.fmtFull = function (iso) { try { var d = new Date(iso), z = function (n) { return String(n).padStart(2, "0"); }; return z(d.getDate()) + "." + z(d.getMonth() + 1) + "." + d.getFullYear() + " " + z(d.getHours()) + ":" + z(d.getMinutes()) + ":" + z(d.getSeconds()); } catch (e) { return ""; } };
  AVF.fmtDateTime = function (iso) { try { return new Date(iso).toLocaleString(AVF.locale ? AVF.locale() : "tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  AVF.fmtTime = function (iso) { try { return new Date(iso).toLocaleTimeString(AVF.locale ? AVF.locale() : "tr-TR", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  AVF.maskName = function (n) {
    var p = String(n || "").trim().split(/\s+/).filter(Boolean); if (!p.length) return "";
    return [p[0]].concat(p.slice(1).map(function (x) { return x.charAt(0).toLocaleUpperCase("tr-TR") + "*****"; })).join(" ");
  };
  AVF.KIND = {
    nutrition: { label: "Beslenme Programı", icon: "apple", slug: "beslenme" },
    training: { label: "Antrenman Programı", icon: "dumb", slug: "antrenman" },
    supplement: { label: "Supplement Planlaması", icon: "pill", slug: "takviye" },
    pharmacology: { label: "Farmakolojik Planlama", icon: "flask", slug: "farmakoloji" },
    notes: { label: "Değerli Notlar", icon: "notes", slug: "notlar" },
  };
  AVF.DELIVERY = { online: "Uzaktan (online)", in_person: "Yüz yüze", hybrid: "Uzaktan + yüz yüze" };

  // ---------- bildirim (toast) ----------
  AVF.toast = function (msg, kind) {
    var box = document.getElementById("toasts");
    if (!box) { box = AVF.h("div", { id: "toasts", class: "toasts", role: "status", "aria-live": "polite" }); document.body.appendChild(box); }
    var t = AVF.h("div", { class: "toast" + (kind === "err" ? " err" : "") }, msg); box.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 4200);
  };

  // ---------- reCAPTCHA v3 (anahtar yoksa boş jeton; sunucu üretimde reddeder) ----------
  var cfg = null, cfgP = null, capLoaded = null;
  AVF.config = function () { return cfgP || (cfgP = fetch("/api/config").then(function (r) { return r.json(); }).then(function (c) { cfg = c; return c; }, function () { cfg = {}; return cfg; })); };
  AVF.captcha = function (action) {
    return AVF.config().then(function (c) {
      var key = c.recaptchaSiteKey; if (!key) return "";
      if (!capLoaded) capLoaded = new Promise(function (ok, no) {
        var s = document.createElement("script"); s.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(key); s.async = true; s.onload = ok; s.onerror = no; document.head.appendChild(s);
      });
      return capLoaded.then(function () { return new Promise(function (ok) { window.grecaptcha.ready(function () { window.grecaptcha.execute(key, { action: action }).then(ok, function () { ok(""); }); }); }); }, function () { return ""; });
    });
  };

  // ---------- ortak bileşenler ----------
  AVF.state = function (icon, title, text, action) {
    return AVF.h("div", { class: "card state" }, AVF.h("span", { class: "tile" }, AVF.icon(icon)), AVF.h("h3", { text: title }), text ? AVF.h("p", { text: text }) : null, action || null);
  };
  AVF.skeleton = function (n) { var a = []; for (var i = 0; i < (n || 3); i++) a.push(AVF.h("div", { class: "skel" })); return AVF.h("div", { class: "stack", "aria-busy": "true", "aria-label": "Yükleniyor" }, a); };
  // İmleç efekti (yalnız fareli masaüstü, hareket azaltma kapalıyken): ".fx" kart yükselir; imlecin altında yumuşak bir ışık
  // ve kenarda imleci izleyen ince bir çizgi dolaşır. Olay yetkilendirmesiyle çalışır; kartlar yeniden çizilse de ek bağlama gerekmez.
  (function () {
    if (!window.matchMedia || !matchMedia("(hover:hover) and (pointer:fine)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    var cur = null, last = null, raf = 0;
    function off(el) { el.classList.remove("fx-on"); }
    function paint() {
      raf = 0; if (!cur || !last) return;
      var r = cur.getBoundingClientRect(); if (!r.width || !r.height) return;
      var x = Math.min(1, Math.max(0, (last.clientX - r.left) / r.width)), y = Math.min(1, Math.max(0, (last.clientY - r.top) / r.height));
      cur.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); cur.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var el = e.target && e.target.closest ? e.target.closest(".fx") : null;
      if (el !== cur) { if (cur) off(cur); cur = el; if (cur) cur.classList.add("fx-on"); }
      if (!cur) return; last = e; if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
    document.addEventListener("pointerleave", function () { if (cur) off(cur); cur = null; });
    window.addEventListener("blur", function () { if (cur) off(cur); cur = null; });
  })();

  // Akordeon: yükseklik JavaScript ile ölçülerek yumuşak (ease-in-out) açılır/kapanır; içerik aynı anda hafifçe belirir.
  // Tarayıcıdan bağımsız, her cihazda aynı akıcılıkta çalışır. İçerik "panel"e yazılır.
  var ACC_MS = 420;
  function accSet(wrap, open) {
    var outer = wrap._outer; if (!outer) return;
    clearTimeout(outer._t);
    var from = outer.getBoundingClientRect().height;
    wrap.classList.toggle("open", open);
    var b = wrap.querySelector("button[aria-expanded]"); if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
    var to = open ? outer.scrollHeight : 0;
    outer.style.height = from + "px"; void outer.offsetHeight;
    outer.style.height = to + "px";
    outer._t = setTimeout(function () { outer.style.height = wrap.classList.contains("open") ? "auto" : "0px"; }, ACC_MS + 30);
  }
  AVF.accordion = function (opts) {
    var wrap = AVF.h("div", { class: "card acc" + (opts.open ? " open" : "") });
    var id = "acc" + Math.random().toString(36).slice(2, 8);
    var panel = AVF.h("div", { class: "pad" }), outer = AVF.h("div", { class: "panel-o", id: id, role: "region", style: "height:" + (opts.open ? "auto" : "0px") }, AVF.h("div", { class: "panel" }, panel));
    wrap._outer = outer;
    var btn = AVF.h("button", { type: "button", "aria-expanded": opts.open ? "true" : "false", "aria-controls": id, onclick: function () {
      var o = !wrap.classList.contains("open");
      if (o && opts.onOpen) opts.onOpen(panel);
      // Grup (ör. SSS): bir öğe açılınca diğerleri aynı anda yumuşakça kapanır.
      if (o && opts.group) opts.group.forEach(function (w) { if (w !== wrap && w.classList.contains("open")) accSet(w, false); });
      accSet(wrap, o);
    } }, AVF.h("span", { class: "tile" + (opts.teal ? " teal" : "") }, AVF.icon(opts.icon || "list")),
      AVF.h("span", { class: "t" }, AVF.h("b", { text: opts.title }), opts.sub ? AVF.h("small", { text: opts.sub }) : null), AVF.icon("chev", "chev"));
    wrap.appendChild(btn); wrap.appendChild(outer);
    if (opts.group) opts.group.push(wrap);
    if (opts.content) AVF.mount(panel, opts.content);
    wrap.setTitleSub = function (s) { var sm = btn.querySelector("small"); if (sm) sm.textContent = s; };
    return wrap;
  };
  AVF.field = function (label, input, opts) {
    opts = opts || {};
    return AVF.h("div", { class: "field" }, AVF.h("label", { for: (input.input || input).id }, opts.icon ? AVF.h("span", { class: "tile" }, AVF.icon(opts.icon)) : null, label, opts.optional ? null : AVF.h("span", { class: "req", text: "Zorunlu" })), input, opts.hint ? AVF.h("p", { class: "hint", text: opts.hint }) : null);
  };
  var uid = 0;
  AVF.input = function (type, attrs) {
    attrs = attrs || {}; attrs.id = attrs.id || "f" + ++uid; attrs.class = "inp" + (attrs.class ? " " + attrs.class : ""); attrs.type = type;
    return AVF.h("input", attrs);
  };
  // Doğrulama kodu alanı: yalnız rakam; boşluklu/tireli/metin içinde gelen kod yapıştırılınca ilk 6 rakam alınır (maxlength
  // yapıştırılan metni ÖNCEDEN kırpıp kodu bozmasın diye kullanılmaz). Yanında "Panodan yapıştır" düğmesi vardır (tarayıcı izin verirse).
  function codeDigits(t) { t = String(t || ""); var m = /(^|\D)(\d{6})(?!\d)/.exec(t); return m ? m[2] : t.replace(/\D/g, "").slice(0, 6); }
  AVF.codeInput = function (attrs) {
    attrs = attrs || {}; attrs.class = "codeinp" + (attrs.class ? " " + attrs.class : ""); attrs.inputmode = "numeric"; attrs.autocomplete = "one-time-code";
    attrs.placeholder = attrs.placeholder || "••••••"; attrs.spellcheck = "false"; attrs.autocapitalize = "off";
    var inp = AVF.input("text", attrs);
    function set(v) { inp.value = codeDigits(v); inp.dispatchEvent(new Event("change")); }
    inp.addEventListener("paste", function (e) { var t = e.clipboardData && e.clipboardData.getData("text"); if (t) { e.preventDefault(); set(t); } });
    inp.addEventListener("input", function () { var c = inp.value.replace(/\D/g, ""); if (c.length > 6) c = codeDigits(inp.value); if (c !== inp.value) inp.value = c; });
    var canRead = !!(navigator.clipboard && navigator.clipboard.readText);
    var pb = canRead ? AVF.h("button", { class: "code-paste", type: "button", onclick: function () {
      navigator.clipboard.readText().then(function (t) {
        var c = codeDigits(t);
        if (c.length !== 6) return AVF.toast("Panoda 6 haneli bir kod bulunamadı.", "err");
        set(c); AVF.toast("Kod yapıştırıldı.");
      }, function () { AVF.toast("Tarayıcı panoya erişim izni vermedi; kodu alana uzun basıp yapıştırabilirsiniz.", "err"); });
    } }, AVF.icon("clipboard"), AVF.h("span", { text: "Panodan yapıştır" })) : null;
    var w = AVF.h("div", { class: "codewrap" }, inp, pb); w.input = inp;
    Object.defineProperty(w, "value", { get: function () { return inp.value; }, set: function (v) { inp.value = v; } });
    w.focus = function () { inp.focus(); };
    return w;
  };
  AVF.passwordInput = function (attrs) {
    var inp = AVF.input("password", attrs); var shown = false;
    var b = AVF.h("button", { type: "button", "aria-label": "Şifreyi göster", onclick: function () { shown = !shown; inp.type = shown ? "text" : "password"; AVF.mount(b, AVF.icon(shown ? "eyeoff" : "eye")); b.setAttribute("aria-label", shown ? "Şifreyi gizle" : "Şifreyi göster"); } }, AVF.icon("eye"));
    var w = AVF.h("div", { class: "pw" }, inp, b); w.input = inp; return w;
  };
  // İstemci tarafı şifre kuralları sunucudakiyle AYNIDIR (utils/passwordRules.js); sunucu yine de her zaman denetler.
  AVF.passwordError = function (pw, fullName, username) {
    if (/\s/.test(pw)) return "Şifre boşluk içeremez.";
    if (pw.length < 8) return "Şifreniz en az 8 karakter olmalıdır.";
    if (!/[a-zA-Z]/.test(pw)) return "Şifreniz en az 1 harf içermelidir.";
    if (!/[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/.test(pw)) return "Şifreniz en az 1 noktalama işareti içermelidir.";
    var d = (pw.match(/\d+/g) || []).join("");
    for (var i = 0; i + 2 < d.length; i++) { var a = +d[i], b = +d[i + 1], c = +d[i + 2]; if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1)) return "Şifrenizde ardışık sayılar kullanılamaz."; }
    var low = pw.trim().toLowerCase();
    var parts = [username].concat(String(fullName || "").split(" ")).filter(function (p) { return p && p.trim().length >= 3; });
    if (parts.some(function (p) { p = p.trim().toLowerCase(); return low.indexOf(p) >= 0 || p.indexOf(low) >= 0; })) return "Şifreniz kullanıcı adınız veya adınızla bağlantılı olamaz.";
    return "";
  };
  // Açılır pencerelerde arka plan kaymaz: sayfa konumu sabitlenir (iOS dahil), masaüstünde kaydırma çubuğu genişliği korunur.
  var lockN = 0, lockY = 0;
  // Mobil klavye açıkken görünen alan (visual viewport) küçülür ve kayar; pencere örtüsü bu alana oturtulur ki başlık/düğme
  // ekran dışına taşmasın ve arkadaki sayfa (ör. siyah alt bilgi) pencerenin altından görünüp "karışmasın".
  var vvH = null;
  function vvSync() {
    var v = window.visualViewport, de = document.documentElement; if (!v) return;
    de.style.setProperty("--vvh", v.height + "px"); de.style.setProperty("--vvt", v.offsetTop + "px");
  }
  function vvOn(on) {
    var v = window.visualViewport; if (!v) return;
    if (on) { if (vvH) return; vvH = vvSync; v.addEventListener("resize", vvH); v.addEventListener("scroll", vvH); vvSync(); }
    else { if (!vvH) return; v.removeEventListener("resize", vvH); v.removeEventListener("scroll", vvH); vvH = null; document.documentElement.style.removeProperty("--vvh"); document.documentElement.style.removeProperty("--vvt"); }
  }
  // Pencere içindeki bir alana odaklanınca (klavye açılınca) alan pencerenin içinde görünür konuma kaydırılır.
  document.addEventListener("focusin", function (e) {
    var t = e.target; if (!t || !t.closest || !t.closest(".dlg") || !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    setTimeout(function () { vvSync(); try { t.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (x) { /* eski tarayıcı */ } }, 320);
  });
  AVF.lockScroll = function (on) {
    var b = document.body, de = document.documentElement;
    if (on) {
      if (lockN++ > 0) return;
      lockY = window.scrollY || 0; var sw = window.innerWidth - de.clientWidth;
      b.style.position = "fixed"; b.style.top = -lockY + "px"; b.style.left = "0"; b.style.right = "0"; b.style.width = "100%";
      if (sw > 0) b.style.paddingRight = sw + "px";
      de.classList.add("locked"); vvOn(true);
    } else {
      if (lockN === 0 || --lockN > 0) return;
      b.style.position = b.style.top = b.style.left = b.style.right = b.style.width = b.style.paddingRight = "";
      de.classList.remove("locked"); vvOn(false); de.style.scrollBehavior = "auto"; window.scrollTo(0, lockY); de.style.scrollBehavior = "";
    }
  };
  // Düğme meşgul durumu. Kapatılırken (on=false) etiket verilmese de ÖNCEKİ İÇERİK HER ZAMAN geri yüklenir — aksi hâlde hata
  // sonrası düğme "Kaydediliyor…/Doğrulanıyor…" yazısında takılı kalıyordu.
  AVF.busy = function (btn, on, label) {
    btn.disabled = !!on;
    if (!on && btn._kids) { AVF.clear(btn); btn._kids.forEach(function (k) { btn.appendChild(k); }); btn._kids = null; return; }
    if (label === undefined) return;
    if (on) { if (btn._kids) return; btn._kids = Array.prototype.slice.call(btn.childNodes); AVF.clear(btn); btn.appendChild(document.createTextNode(label)); }
    else if (btn._kids) { AVF.clear(btn); btn._kids.forEach(function (k) { btn.appendChild(k); }); btn._kids = null; }
  };

  // ---------- ortak bileşenler: logolu seçim, tarih seçici, şifre ilerlemesi, onay penceresi ----------
  // Logolu seçim kartları (radyo grubu). items: [{ value, label, icon }]; onChange(value) isteğe bağlı.
  AVF.choice = function (o) {
    var val = o.value == null ? "" : o.value, h = AVF.h;
    var el = h("div", { class: "choice c" + (o.cols || o.items.length), role: "radiogroup", "aria-label": o.label || "" });
    var btns = o.items.map(function (it) {
      var b = h("button", { type: "button", class: "ch", role: "radio", "data-v": it.value, "aria-checked": "false", onclick: function () { set(val === it.value && o.clearable ? "" : it.value, true); } },
        h("span", { class: "chi" }, AVF.icon(it.icon || "check")), h("span", { class: "chl", text: it.label }));
      el.appendChild(b); return b;
    });
    function set(v, fire) { val = v; btns.forEach(function (b) { var on = b.getAttribute("data-v") === v; b.classList.toggle("on", on); b.setAttribute("aria-checked", on ? "true" : "false"); }); if (fire && o.onChange) o.onChange(v); }
    el.addEventListener("keydown", function (e) { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return; e.preventDefault(); var i = btns.indexOf(document.activeElement); if (i < 0) return; var n = btns[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : btns.length - 1)) % btns.length]; n.focus(); n.click(); });
    set(val, false); el.get = function () { return val; }; el.set = function (v) { set(v, false); };
    return el;
  };
  // Doğum tarihi: tek çerçevede GÜN / AY / YIL bölümleri; ay ve yıla göre gün sayısı ayarlanır; tamamlanınca okunaklı tarih ve yaş gösterilir.
  // value: "YYYY-MM-DD" veya "". get() → "YYYY-MM-DD" veya "" (eksik/geçersizse ""), partial(): bir kısmı seçili mi, set(v).
  var MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  AVF.dateSelect = function (value, minAge, onChange) {
    var h = AVF.h, now = new Date(), maxY = now.getFullYear() - (minAge || 14);
    function seg(label, sel) { return h("label", { class: "ds-seg" }, h("span", { class: "ds-l", text: label }), sel, AVF.icon("chev", "ds-c")); }
    var sd = h("select", { "aria-label": "Gün" }), sm = h("select", { "aria-label": "Ay" }), sy = h("select", { "aria-label": "Yıl" });
    sm.appendChild(h("option", { value: "" }, "Ay")); MONTHS.forEach(function (n, i) { sm.appendChild(h("option", { value: String(i + 1) }, n)); });
    sy.appendChild(h("option", { value: "" }, "Yıl")); for (var y = maxY; y >= 1930; y--) sy.appendChild(h("option", { value: String(y) }, String(y)));
    function days() { var y2 = +sy.value || 2000, mo = +sm.value || 1; return new Date(Date.UTC(y2, mo, 0)).getUTCDate(); }
    function fillDays() {
      var cur = sd.value, n = sm.value ? days() : 31; AVF.mount(sd, h("option", { value: "" }, "Gün"));
      for (var d = 1; d <= n; d++) sd.appendChild(h("option", { value: String(d) }, String(d)));
      if (cur && +cur <= n) sd.value = cur;
    }
    var out = h("small", { class: "ds-out", "aria-live": "polite" });
    var el = h("div", { class: "dsel-wrap" }, h("div", { class: "dsel" }, h("span", { class: "ds-ic" }, AVF.icon("calendar")), seg("Gün", sd), seg("Ay", sm), seg("Yıl", sy)), out);
    function show() {
      var v = el.get(); el.classList.toggle("done", !!v);
      if (!v) { out.textContent = el.partial() ? "Gün, ay ve yıl seçimini tamamlayın." : ""; return; }
      var p = v.split("-"), b = new Date(+p[0], +p[1] - 1, +p[2]), age = now.getFullYear() - b.getFullYear() - (now < new Date(now.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0);
      out.textContent = (+p[2]) + " " + MONTHS[+p[1] - 1] + " " + p[0] + " · " + age + " yaş";
    }
    el.get = function () {
      if (!sd.value || !sm.value || !sy.value) return ""; var y2 = +sy.value, mo = +sm.value, d2 = +sd.value, dt = new Date(Date.UTC(y2, mo - 1, d2));
      if (dt.getUTCMonth() !== mo - 1) return ""; return y2 + "-" + String(mo).padStart(2, "0") + "-" + String(d2).padStart(2, "0");
    };
    el.partial = function () { return !!(sd.value || sm.value || sy.value) && !el.get(); };
    el.raw = function () { return [sd.value, sm.value, sy.value].join("|"); };
    el.set = function (v) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ""), r = m ? [String(+m[3]), String(+m[2]), String(+m[1])] : String(v || "").split("|");
      sm.value = r[1] || ""; sy.value = r[2] || ""; fillDays(); sd.value = r[0] || ""; show();
    };
    [sd, sm, sy].forEach(function (x) { x.addEventListener("change", function () { if (x !== sd) fillDays(); show(); if (onChange) onChange(); }); });
    fillDays(); el.set(value || ""); return el;
  };
  // Şifre kuralları: yazdıkça her kural işaretlenir ve çubuk dolar. ctx() → { fullName, username }.
  AVF.passwordMeter = function (input, ctx) {
    var h = AVF.h;
    var RULES = [["En az 8 karakter", function (p) { return p.length >= 8; }], ["En az 1 harf", function (p) { return /[a-zA-Z]/.test(p); }],
      ["En az 1 noktalama işareti", function (p) { return /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/.test(p); }], ["Boşluk yok", function (p) { return p.length > 0 && !/\s/.test(p); }],
      ["Ardışık sayı yok", function (p) { var d = (p.match(/\d+/g) || []).join(""); for (var i = 0; i + 2 < d.length; i++) { var a = +d[i], b = +d[i + 1], c = +d[i + 2]; if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1)) return false; } return p.length > 0; }],
      ["Ad / kullanıcı adınızla ilgisiz", function (p) { if (!p) return false; var c = ctx ? ctx() : {}, low = p.trim().toLowerCase(), parts = [c.username].concat(String(c.fullName || "").split(" ")).filter(function (x) { return x && x.trim().length >= 3; }); return !parts.some(function (x) { x = x.trim().toLowerCase(); return low.indexOf(x) >= 0 || x.indexOf(low) >= 0; }); }]];
    var bar = h("span", { class: "pmb-f" }), lis = RULES.map(function (r) { return h("li", null, AVF.icon("check", "ico"), h("span", { text: r[0] })); });
    var el = h("div", { class: "pmeter", "aria-live": "polite" }, h("div", { class: "pmb" }, bar), h("ul", null, lis));
    function upd() { var p = input.value, ok = 0; RULES.forEach(function (r, i) { var y = r[1](p); lis[i].classList.toggle("ok", y); if (y) ok++; }); bar.style.width = Math.round(ok / RULES.length * 100) + "%"; el.setAttribute("data-s", ok === RULES.length ? "full" : ok >= 4 ? "mid" : "low"); }
    input.addEventListener("input", upd); upd(); el.done = function () { return el.getAttribute("data-s") === "full"; };
    return el;
  };
  // Onay penceresi (tarayıcının confirm'ü değil). Promise<boolean>.
  AVF.confirmDialog = function (o) {
    return new Promise(function (resolve) {
      var h = AVF.h, prev = document.activeElement, done = false;
      var ok = h("button", { class: "btn" + (o.danger ? " danger" : ""), type: "button" }, o.confirm || "Evet"), no = h("button", { class: "btn ghost", type: "button" }, o.cancel || "Vazgeç");
      var box = h("div", { class: "cdlg", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "cdt" }, h("span", { class: "tile" }, AVF.icon(o.icon || "alert")), h("h3", { id: "cdt", text: o.title }), o.text ? h("p", { text: o.text }) : null, h("div", { class: "row" }, ok, no));
      var ov = h("div", { class: "cov" }, box);
      function close(v) { if (done) return; done = true; ov.classList.add("out"); document.removeEventListener("keydown", key); setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); AVF.lockScroll(false); if (prev && prev.focus) try { prev.focus(); } catch (e) { /* yok */ } resolve(v); }, 180); }
      function key(e) { if (e.key === "Escape") close(false); else if (e.key === "Tab") { var f = [no, ok]; var i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? 1 : 1)) % 2].focus(); } }
      ok.addEventListener("click", function () { close(true); }); no.addEventListener("click", function () { close(false); });
      ov.addEventListener("mousedown", function (e) { if (e.target === ov) close(false); });
      document.addEventListener("keydown", key); AVF.lockScroll(true); document.body.appendChild(ov); setTimeout(function () { no.focus(); }, 30);
    });
  };
  // ---------- panel formları: taslak koruma, yalnız sayı girişi, ölçü birimi, çalışma saati, dosya ekleri ----------
  // Taslak: giriş/kayıt ekranındaki mantıkla aynı — sekme oturumu boyunca (sessionStorage) kullanıcıya özel saklanır; kaydedilince,
  // çıkışta ya da 24 saat sonra silinir. Şifre gibi gizli alanlar ASLA taslağa yazılmaz.
  AVF.draft = function (name) {
    var u = AVF.session && AVF.session.user, key = "avf_d_" + (u ? u.id : "x") + "_" + name;
    return {
      get: function () { try { var d = JSON.parse(sessionStorage.getItem(key) || "null"); if (d && Date.now() - d.t < 86400000) return d.v; sessionStorage.removeItem(key); } catch (e) { /* depolama yok */ } return null; },
      set: function (v) { try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v: v })); } catch (e) { /* depolama yok */ } },
      clear: function () { try { sessionStorage.removeItem(key); } catch (e) { /* depolama yok */ } },
    };
  };
  AVF.clearDrafts = function () { try { Object.keys(sessionStorage).forEach(function (k) { if (k.indexOf("avf_d_") === 0) sessionStorage.removeItem(k); }); } catch (e) { /* depolama yok */ } };

  // Yalnız sayı: harf ve diğer karakterler yazılamaz/yapıştırılamaz; virgül noktaya çevrilir; en fazla `decimals` ondalık.
  AVF.numInput = function (attrs, decimals) {
    attrs = attrs || {}; attrs.inputmode = decimals ? "decimal" : "numeric"; attrs.autocomplete = "off";
    var inp = AVF.input("text", attrs);
    function clean(v) {
      v = String(v || "").replace(/,/g, ".").replace(decimals ? /[^0-9.]/g : /[^0-9]/g, "");
      if (decimals) { var i = v.indexOf("."); if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, "").slice(0, decimals); if (i === 0) v = "0" + v; }
      return v.slice(0, 6);
    }
    inp.addEventListener("beforeinput", function (e) { if (e.data && e.data.length === 1 && /[^0-9.,]/.test(e.data)) e.preventDefault(); });   // tek tuş: harf hiç yazılmaz; yapıştırma/çoklu girişte temizlenir
    inp.addEventListener("input", function () { var c = clean(inp.value); if (c !== inp.value) inp.value = c; });
    inp.value = clean(inp.value); return inp;
  };

  // Boy (cm ⇄ inç) ve kilo (kg ⇄ lbs): değer sunucuya HER ZAMAN cm / kg olarak gider; birim tercihi bu cihazda hatırlanır.
  var UNITS = {
    height: { m: "cm", i: "inç", f: 2.54, dec: [0, 1], min: 100, max: 250, ph: ["Örn. 178", "Örn. 70"], label: "Boy" },
    weight: { m: "kg", i: "lbs", f: 0.45359237, dec: [1, 1], min: 30, max: 300, ph: ["Örn. 82.5", "Örn. 182"], label: "Kilo" },
    // isteğe bağlı çevre ölçüleri (sunucuyla aynı aralıklar: routes/profile.js MEASURES)
    arm: { m: "cm", i: "inç", f: 2.54, dec: [1, 1], min: 15, max: 70, ph: ["Örn. 38", "Örn. 15"], label: "Kol çevresi", len: true },
    shoulder: { m: "cm", i: "inç", f: 2.54, dec: [1, 1], min: 25, max: 80, ph: ["Örn. 46", "Örn. 18"], label: "Omuz genişliği", len: true },
    waist: { m: "cm", i: "inç", f: 2.54, dec: [1, 1], min: 45, max: 200, ph: ["Örn. 84", "Örn. 33"], label: "Bel çevresi", len: true },
    neck: { m: "cm", i: "inç", f: 2.54, dec: [1, 1], min: 20, max: 70, ph: ["Örn. 39", "Örn. 15"], label: "Boyun çevresi", len: true },
  };
  AVF.measure = function (kind, metricValue, onChange) {
    var h = AVF.h, U = UNITS[kind], unit = "m";
    try { if (localStorage.getItem("avf_u_" + kind) === "i") unit = "i"; } catch (e) { /* yok */ }
    var inp = AVF.numInput({ placeholder: U.ph[unit === "m" ? 0 : 1], "aria-label": U.label }, 1);
    var hint = h("small", { class: "ms-h", "aria-live": "polite" });
    var bm = h("button", { type: "button", "data-u": "m", text: U.m }), bi = h("button", { type: "button", "data-u": "i", text: U.i });
    var seg = h("div", { class: "useg", role: "group", "aria-label": "Birim" }, bm, bi);
    function round(v, d) { var p = Math.pow(10, d); return Math.round(v * p) / p; }
    function toMetric(v) { return unit === "m" ? v : v * U.f; }
    function fromMetric(v) { return unit === "m" ? v : v / U.f; }
    var el = h("div", { class: "measure" }, h("div", { class: "ms-row" }, inp, seg), hint);
    el.getMetric = function () { var v = parseFloat(inp.value); if (!isFinite(v)) return ""; var m = toMetric(v); return kind === "height" ? Math.round(m) : round(m, 1); };
    el.error = function () {
      if (!inp.value) return ""; var m = toMetric(parseFloat(inp.value));
      if (!(m >= U.min && m <= U.max)) return U.label + " " + (unit === "m" ? U.min + "–" + U.max + " " + U.m : round(U.min / U.f, 0) + "–" + round(U.max / U.f, 0) + " " + U.i) + " arasında olmalıdır.";
      return "";
    };
    function paint() {
      bm.setAttribute("aria-pressed", unit === "m" ? "true" : "false"); bi.setAttribute("aria-pressed", unit === "i" ? "true" : "false"); seg.setAttribute("data-on", unit);
      inp.placeholder = AVF.t(U.ph[unit === "m" ? 0 : 1]);
      var m = el.getMetric(), err = el.error();
      if (err) { hint.textContent = err; hint.className = "ms-h bad"; return; }
      hint.className = "ms-h";
      if (m === "") { hint.textContent = ""; return; }
      if (kind === "height") { var tin = m / 2.54, ft = Math.floor(tin / 12), inch = Math.round(tin - ft * 12); if (inch === 12) { ft++; inch = 0; } hint.textContent = unit === "m" ? "≈ " + ft + " ft " + inch + " in" : "≈ " + m + " cm"; }
      else if (U.len) hint.textContent = unit === "m" ? "≈ " + round(m / U.f, 1) + " in" : "≈ " + m + " cm";
      else hint.textContent = unit === "m" ? "≈ " + round(m / U.f, 1) + " lbs" : "≈ " + m + " kg";
    }
    function setUnit(nu) {
      if (nu === unit) return; var m = el.getMetric(); unit = nu;
      try { localStorage.setItem("avf_u_" + kind, nu); } catch (e) { /* yok */ }
      if (m !== "") inp.value = String(round(fromMetric(m), U.dec[nu === "m" ? 0 : 1]));
      paint(); if (onChange) onChange();
    }
    bm.addEventListener("click", function () { setUnit("m"); }); bi.addEventListener("click", function () { setUnit("i"); });
    inp.addEventListener("input", function () { paint(); if (onChange) onChange(); });
    el.raw = function () { return { v: inp.value, u: unit }; };
    el.setRaw = function (r) { if (!r) return; unit = r.u === "i" ? "i" : "m"; inp.value = r.v || ""; paint(); };
    el.input = inp;
    if (metricValue !== null && metricValue !== undefined && metricValue !== "") inp.value = String(round(fromMetric(Number(metricValue)), U.dec[unit === "m" ? 0 : 1]));
    paint(); return el;
  };

  // Logolu açılır liste (tek seçim). Yerel <select> seçeneklerinde ikon gösterilemediği için erişilebilir bir liste kutusu:
  // ok tuşları, Enter/Boşluk, Esc, Home/End; dışarı tıklayınca kapanır. items: [{ value, label, icon, level (0–1, isteğe bağlı) }]
  var ddN = 0;
  AVF.iconSelect = function (o) {
    var h = AVF.h, id = "dd" + ++ddN, val = o.value || "", open = false, act = -1;
    var items = [{ value: "", label: o.placeholder || "Seçiniz", icon: o.icon || "list", empty: true }].concat(o.items);
    function lvl(it) { if (it.level === undefined) return null; var n = Math.round(it.level * 5) + 1; return h("span", { class: "dd-lvl", "aria-hidden": "true" }, [1, 2, 3, 4, 5, 6].map(function (i) { return h("i", { class: i <= n ? "on" : "" }); })); }
    function face(it) { return [h("span", { class: "dd-ic" + (it.empty ? " empty" : "") }, AVF.icon(it.icon)), h("span", { class: "dd-t", text: it.label }), lvl(it)]; }
    var btn = h("button", { class: "dd-btn inp", type: "button", "aria-haspopup": "listbox", "aria-expanded": "false", "aria-controls": id + "l", id: id, "aria-label": o.label });
    var list = h("ul", { class: "dd-list", role: "listbox", id: id + "l", tabindex: "-1", "aria-label": o.label, hidden: "" });
    var el = h("div", { class: "dd" }, btn, list);
    function cur() { for (var i = 0; i < items.length; i++) if (items[i].value === val) return items[i]; return items[0]; }
    function paintBtn() { var it = cur(); AVF.mount(btn, face(it), AVF.icon("chev", "dd-c")); btn.classList.toggle("empty", !val); }
    function paintList() {
      AVF.mount(list, items.map(function (it, i) {
        var li = h("li", { role: "option", id: id + "o" + i, class: "dd-o" + (i === act ? " act" : "") + (it.empty ? " clear" : ""), "aria-selected": it.value === val ? "true" : "false" }, face(it), it.value === val && !it.empty ? AVF.icon("check", "dd-ok") : null);
        li.addEventListener("mousedown", function (e) { e.preventDefault(); });
        li.addEventListener("click", function () { choose(i); });
        return li;
      }));
      if (act >= 0) { list.setAttribute("aria-activedescendant", id + "o" + act); var a = list.children[act]; if (a && a.scrollIntoView) a.scrollIntoView({ block: "nearest" }); }
    }
    function away(e) { if (!el.contains(e.target)) close(); }
    function show() {
      if (open) return; open = true; act = Math.max(0, items.indexOf(cur())); list.hidden = false; btn.setAttribute("aria-expanded", "true"); el.classList.add("open");
      // aşağıda yer yoksa yukarı açılır
      var r = btn.getBoundingClientRect(), vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      el.classList.toggle("up", vh - r.bottom < 300 && r.top > vh - r.bottom);
      paintList(); document.addEventListener("pointerdown", away, true);
    }
    function close() { if (!open) return; open = false; list.hidden = true; btn.setAttribute("aria-expanded", "false"); el.classList.remove("open"); document.removeEventListener("pointerdown", away, true); }
    function choose(i) { var nv = items[i].value; var ch = nv !== val; val = nv; paintBtn(); close(); btn.focus(); if (ch && o.onChange) o.onChange(val); }
    btn.addEventListener("click", function () { if (open) close(); else show(); });
    btn.addEventListener("keydown", function (e) {
      var k = e.key;
      if (!open && (k === "ArrowDown" || k === "ArrowUp" || k === "Enter" || k === " ")) { e.preventDefault(); show(); return; }
      if (!open) return;
      if (k === "Escape") { e.preventDefault(); close(); }
      else if (k === "ArrowDown") { e.preventDefault(); act = Math.min(items.length - 1, act + 1); paintList(); }
      else if (k === "ArrowUp") { e.preventDefault(); act = Math.max(0, act - 1); paintList(); }
      else if (k === "Home") { e.preventDefault(); act = 0; paintList(); }
      else if (k === "End") { e.preventDefault(); act = items.length - 1; paintList(); }
      else if (k === "Enter" || k === " ") { e.preventDefault(); choose(act); }
      else if (k === "Tab") close();
    });
    el.get = function () { return val; };
    el.set = function (v) { val = v || ""; if (!items.some(function (it) { return it.value === val; })) val = ""; paintBtn(); };
    paintBtn(); return el;
  };

  // Çalışma saati: düzen (sabit / vardiyalı / esnek / çalışmıyorum).
  //   • Sabit → başlangıç ve bitiş saati (30 dakikalık).
  //   • Diğerleri → isteğe bağlı gün gün saat (Pazartesi–Pazar) ve kısa not.
  var DAYS = [["mon", "Pazartesi"], ["tue", "Salı"], ["wed", "Çarşamba"], ["thu", "Perşembe"], ["fri", "Cuma"], ["sat", "Cumartesi"], ["sun", "Pazar"]];
  AVF.WORK_DAYS = DAYS;
  AVF.workHours = function (value, onChange, schedule, note) {
    var h = AVF.h, times = []; for (var i = 0; i < 48; i++) times.push(String(Math.floor(i / 2)).padStart(2, "0") + ":" + (i % 2 ? "30" : "00"));
    function sel(label) { var s = h("select", { class: "inp", "aria-label": label }, h("option", { value: "" }, "--:--")); times.forEach(function (t) { s.appendChild(h("option", { value: t }, t)); }); return s; }
    function fire() { if (onChange) onChange(); }
    var st = sel("Başlangıç"), en = sel("Bitiş"), msg = h("small", { class: "ms-h" });
    var range = h("div", { class: "wh-range" },
      h("label", { class: "wh-t" }, h("span", { class: "wh-l" }, AVF.icon("clock"), "Başlangıç"), st),
      h("label", { class: "wh-t" }, h("span", { class: "wh-l" }, AVF.icon("clock"), "Bitiş"), en));
    // gün gün
    var rows = DAYS.map(function (d) {
      var cb = h("input", { type: "checkbox", "aria-label": d[1] }), a = sel(d[1] + " başlangıç"), b = sel(d[1] + " bitiş");
      var r = h("div", { class: "wd" }, h("label", { class: "wd-d" }, cb, h("span", { text: d[1] })), h("div", { class: "wd-t" }, a, h("span", { class: "wh-dash", text: "–" }), b));
      function sync() { r.classList.toggle("on", cb.checked); a.disabled = b.disabled = !cb.checked; }
      cb.addEventListener("change", function () { if (cb.checked && !a.value) { a.value = "09:00"; b.value = "17:00"; } sync(); paint(); fire(); });
      [a, b].forEach(function (x) { x.addEventListener("change", function () { paint(); fire(); }); });
      return { key: d[0], name: d[1], cb: cb, a: a, b: b, el: r, sync: sync };
    });
    var noteIn = h("textarea", { class: "inp", rows: "3", maxlength: "300", placeholder: "Örn. İki hafta gece, iki hafta gündüz vardiyası; hafta sonları değişken…" });
    var noteCnt = h("span", { class: "cnt", text: "0/300" });
    noteIn.addEventListener("input", function () { noteCnt.textContent = noteIn.value.length + "/300"; fire(); });
    var days = h("div", { class: "wh-days" },
      h("p", { class: "wh-sub" }, AVF.icon("calendar"), h("span", { text: "Gün gün saat belirtin (isteğe bağlı)" })),
      h("div", { class: "wd-list" }, rows.map(function (r) { return r.el; })),
      h("p", { class: "wh-sub" }, AVF.icon("notes"), h("span", { text: "Not (isteğe bağlı)" })), noteIn, noteCnt);
    var mode = AVF.choice({ label: "Çalışma düzeni", cols: 4, clearable: true, items: [{ value: "fixed", label: "Sabit saatler", icon: "clock" }, { value: "shift", label: "Vardiyalı", icon: "refresh" }, { value: "flexible", label: "Esnek", icon: "timer" }, { value: "none", label: "Çalışmıyorum", icon: "pause" }],
      onChange: function () { paint(); fire(); } });
    var rw = h("div", { class: "wh-wrap" }, h("div", { class: "wh-in" }, range)), dw = h("div", { class: "wh-wrap" }, h("div", { class: "wh-in" }, days));
    var el = h("div", { class: "wh" }, mode, rw, dw, msg);
    function badDay() { for (var i = 0; i < rows.length; i++) { var r = rows[i]; if (r.cb.checked && (!r.a.value || !r.b.value || r.a.value === r.b.value)) return r.name; } return ""; }
    function paint() {
      var m = mode.get();
      rw.classList.toggle("open", m === "fixed"); dw.classList.toggle("open", m === "shift" || m === "flexible");   // "çalışmıyorum"da ek alan yok
      var t = "";
      if (m === "fixed" && st.value && en.value && st.value === en.value) t = "Başlangıç ve bitiş saati aynı olamaz.";
      else if ((m === "shift" || m === "flexible") && badDay()) t = badDay() + " için başlangıç ve bitiş saatini seçin (aynı olamaz).";
      msg.textContent = t; msg.className = "ms-h" + (t ? " bad" : "");
    }
    el.get = function () { var m = mode.get(); if (m !== "fixed") return m || ""; return st.value && en.value && st.value !== en.value ? st.value + "-" + en.value : ""; };
    el.schedule = function () {
      var m = mode.get(); if (m !== "shift" && m !== "flexible") return null;
      var o2 = {}, any = false; rows.forEach(function (r) { if (r.cb.checked && r.a.value && r.b.value && r.a.value !== r.b.value) { o2[r.key] = r.a.value + "-" + r.b.value; any = true; } });
      return any ? o2 : null;
    };
    el.note = function () { var m = mode.get(); return m === "shift" || m === "flexible" ? noteIn.value.trim() : ""; };
    el.incomplete = function () { var m = mode.get(); return (m === "fixed" && !el.get()) ? "Çalışma saatiniz için başlangıç ve bitiş saatini seçin." : ((m === "shift" || m === "flexible") && badDay()) ? badDay() + " için başlangıç ve bitiş saatini seçin (aynı olamaz)." : ""; };
    function setSchedule(sc) {
      rows.forEach(function (r) { var v = sc && sc[r.key]; var q = /^(\d\d:\d\d)-(\d\d:\d\d)$/.exec(v || ""); r.cb.checked = !!q; r.a.value = q ? q[1] : ""; r.b.value = q ? q[2] : ""; r.sync(); });
    }
    el.set = function (v, sc, nt) {
      v = v || ""; var r = /^(\d\d:\d\d)-(\d\d:\d\d)$/.exec(v);
      if (r) { mode.set("fixed"); st.value = r[1]; en.value = r[2]; } else if (v.indexOf("fixed|") === 0) { var q = v.split("|"); mode.set("fixed"); st.value = q[1] || ""; en.value = q[2] || ""; } else { mode.set(v); st.value = ""; en.value = ""; }
      setSchedule(sc || null); noteIn.value = nt || ""; noteCnt.textContent = noteIn.value.length + "/300";
      paint();
    };
    el.raw = function () {
      var sc = {}; rows.forEach(function (r) { if (r.cb.checked) sc[r.key] = r.a.value + "-" + r.b.value; });
      return { v: mode.get() === "fixed" ? "fixed|" + st.value + "|" + en.value : mode.get(), sc: sc, n: noteIn.value };
    };
    el.setRaw = function (o2) { if (!o2) return; if (typeof o2 === "string") return el.set(o2); el.set(o2.v || "", o2.sc, o2.n); };
    [st, en].forEach(function (x) { x.addEventListener("change", function () { paint(); fire(); }); });
    el.set(value, schedule, note); return el;
  };
  AVF.workText = function (v, sc, nt) {
    if (!v) return ""; var t = v === "shift" ? "Vardiyalı" : v === "flexible" ? "Esnek" : v === "none" ? "Çalışmıyor" : v.replace("-", " – ");
    if (sc) { var parts = DAYS.filter(function (d) { return sc[d[0]]; }).map(function (d) { return d[1] + " " + sc[d[0]].replace("-", "–"); }); if (parts.length) t += " · " + parts.join(", "); }
    if (nt) t += " · Not: " + nt;
    return t;
  };

  // Dosya ekleri — kurallar sunucuyla aynı: PNG, JPG, JPEG, PDF, XLSX, DOCX; dosya başına 4 MB; en fazla 4 dosya.
  AVF.UPLOAD = { exts: ["png", "jpg", "jpeg", "pdf", "xlsx", "docx"], max: 4, bytes: 4 * 1024 * 1024,
    mime: { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", pdf: "application/pdf", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" } };
  AVF.UPLOAD.accept = AVF.UPLOAD.exts.map(function (e) { return "." + e; }).join(",") + ",image/png,image/jpeg,application/pdf," + AVF.UPLOAD.mime.xlsx + "," + AVF.UPLOAD.mime.docx;
  AVF.fileSize = function (n) { return n >= 1048576 ? (Math.round(n / 104857.6) / 10) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; };
  AVF.uploadFile = function (scope, file) {
    var headers = { "Content-Type": "application/octet-stream", "x-file-name": encodeURIComponent(file.name), "x-file-type": file.type || "", "x-avf-lang": AVF.lang || "tr", Accept: "application/json" };
    var c = AVF.cookie("avf_csrf"); if (c) headers["x-csrf-token"] = c;
    return fetch("/api/uploads/" + scope, { method: "POST", credentials: "same-origin", headers: headers, body: file }).then(function (r) {
      return r.text().then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; } if (r.ok) return d; throw { status: r.status, data: d || {} }; });
    }, function () { throw { status: 0, data: { error: "network" } }; });
  };
  // o: { scope, files: [mevcut], max, base ("/api/attachments/" | "/api/admin/attachments/"), readOnly, locked (metin), onChange }
  AVF.fileBox = function (o) {
    var h = AVF.h, U = AVF.UPLOAD, max = o.max || U.max, files = (o.files || []).slice(), base = o.base || "/api/attachments/";
    var list = h("ul", { class: "fb-list" }), msg = h("div", { class: "fb-msg", role: "alert" });
    var pick = h("input", { type: "file", accept: U.accept, multiple: "", hidden: "", tabindex: "-1" });
    var count = h("span", { class: "fb-n" });
    var addBtn = h("button", { class: "fb-add", type: "button" }, h("span", { class: "tile" }, AVF.icon("image")),
      h("span", { class: "t" }, h("b", { text: "Görsel / dosya ekle" }), h("small", { text: "PNG, JPG, JPEG, PDF, XLSX, DOCX · en fazla 4 MB · en fazla " + max + " dosya" })), count);
    var el = h("div", { class: "fbox" + (o.locked ? " off" : "") }, o.readOnly ? null : addBtn, o.readOnly ? null : pick, msg, list);
    if (o.locked) addBtn.setAttribute("aria-disabled", "true");
    function isImg(f) { return f.mime === "image/png" || f.mime === "image/jpeg"; }
    function err(t) { msg.textContent = t || ""; msg.style.display = t ? "" : "none"; }
    function paint() {
      count.textContent = files.length + "/" + max;
      addBtn.disabled = !!o.locked || files.length >= max;
      AVF.mount(list, files.map(function (f) {
        var thumb = f.pending ? h("span", { class: "fb-th load" }, h("span", { class: "spin" })) : isImg(f) ? h("img", { class: "fb-th", src: base + f.id, alt: "", loading: "lazy" }) : h("span", { class: "fb-th doc" }, AVF.icon("file"), h("em", { text: (f.filename.split(".").pop() || "").toUpperCase() }));
        var name = f.pending ? h("span", { class: "fb-name", "data-notr": "", text: f.filename }) : h("a", { class: "fb-name", href: base + f.id, target: "_blank", rel: "noopener", "data-notr": "", text: f.filename });
        return h("li", { class: "fb-item" + (f.pending ? " pending" : "") }, thumb, h("span", { class: "fb-t" }, name, h("small", { text: f.pending ? "Yükleniyor…" : AVF.fileSize(f.size_bytes) })),
          o.readOnly || f.pending ? null : h("button", { class: "fb-x", type: "button", "aria-label": "Dosyayı kaldır", onclick: function () { remove(f); } }, AVF.icon("x")));
      }));
      if (o.onChange) o.onChange();
    }
    function remove(f) {
      AVF.api("DELETE", "/attachments/" + f.id).then(function () { files = files.filter(function (x) { return x !== f; }); err(""); paint(); },
        function (e) { if (e.status === 404) { files = files.filter(function (x) { return x !== f; }); paint(); } else err(AVF.errText(e)); });
    }
    function add(fileList) {
      err(""); var arr = Array.prototype.slice.call(fileList || []);
      if (!arr.length) return;
      if (files.length + arr.length > max) { err("En fazla " + max + " dosya eklenebilir."); arr = arr.slice(0, Math.max(0, max - files.length)); }
      arr.forEach(function (file) {
        var ext = (/\.([a-z0-9]+)$/i.exec(file.name) || [])[1]; ext = ext ? ext.toLowerCase() : "";
        if (U.exts.indexOf(ext) < 0) return err("Bu dosya türü desteklenmiyor. Yalnızca PNG, JPG, JPEG, PDF, XLSX, DOCX dosyaları eklenebilir.");
        if (file.size > U.bytes) return err("Dosya en fazla 4 MB olabilir.");
        var tmp = { pending: true, filename: file.name }; files.push(tmp); paint();
        AVF.uploadFile(o.scope, file).then(function (r) { files[files.indexOf(tmp)] = r; paint(); }, function (e) { files = files.filter(function (x) { return x !== tmp; }); paint(); err(AVF.errText(e)); });
      });
    }
    addBtn.addEventListener("click", function () { if (o.locked) { err(o.locked); return; } pick.click(); });
    pick.addEventListener("change", function () { add(pick.files); pick.value = ""; });
    if (!o.readOnly) {
      el.addEventListener("dragover", function (e) { if (!o.locked) { e.preventDefault(); el.classList.add("drag"); } });
      el.addEventListener("dragleave", function () { el.classList.remove("drag"); });
      el.addEventListener("drop", function (e) { el.classList.remove("drag"); if (o.locked) return; e.preventDefault(); add(e.dataTransfer && e.dataTransfer.files); });
    }
    el.ids = function () { return files.filter(function (f) { return !f.pending; }).map(function (f) { return f.id; }); };
    el.list = function () { return files.filter(function (f) { return !f.pending; }); };
    el.busy = function () { return files.some(function (f) { return f.pending; }); };
    el.reset = function () { files = []; err(""); paint(); };
    err(""); paint(); return el;
  };
  // Vücut formu: ön / arka / sağ / sol — her yön için tek görsel (PNG/JPG/JPEG, en fazla 4 MB). Yeni görsel eskisinin yerini alır.
  var BODY_SVG = {
    front: '<svg viewBox="0 0 64 96" aria-hidden="true"><circle cx="32" cy="12" r="8"/><path d="M20 26h24l6 30-6 2-3-18v54h-8V64h-2v30h-8V40l-3 18-6-2z"/></svg>',
    back: '<svg viewBox="0 0 64 96" aria-hidden="true"><circle cx="32" cy="12" r="8"/><path d="M20 26h24l6 30-6 2-3-18v54h-8V64h-2v30h-8V40l-3 18-6-2z"/><path class="ln" d="M32 28v32"/></svg>',
    right: '<svg viewBox="0 0 64 96" aria-hidden="true"><circle cx="33" cy="12" r="8"/><path d="M27 26h12l3 14 4 18-5 1-3-12v47h-8V68l-2 26h-6l2-40-2-14z"/><path class="ln" d="M40 12h5"/></svg>',
    left: '<svg viewBox="0 0 64 96" aria-hidden="true"><g transform="translate(64 0) scale(-1 1)"><circle cx="33" cy="12" r="8"/><path d="M27 26h12l3 14 4 18-5 1-3-12v47h-8V68l-2 26h-6l2-40-2-14z"/><path class="ln" d="M40 12h5"/></g></svg>'
  };
  AVF.BODY_SLOTS = [["front", "Ön"], ["back", "Arka"], ["right", "Sağ"], ["left", "Sol"]];
  AVF.bodyForm = function (o) {
    var h = AVF.h, base = o.base || "/api/attachments/", files = {}, msg = h("div", { class: "fb-msg", role: "alert", style: "display:none" });
    (o.files || []).forEach(function (f) { if (f.slot) files[f.slot] = f; });
    var grid = h("div", { class: "bform" }), el = h("div", { class: "bform-wrap" + (o.locked ? " off" : "") }, grid, msg);
    function err(t) { msg.textContent = t || ""; msg.style.display = t ? "" : "none"; }
    function paint() {
      AVF.mount(grid, AVF.BODY_SLOTS.map(function (sl) {
        var f = files[sl[0]], pick = h("input", { type: "file", accept: ".png,.jpg,.jpeg,image/png,image/jpeg", hidden: "", tabindex: "-1" });
        var fig = h("div", { class: "bf-fig" });
        if (f && f.pending) fig.appendChild(h("span", { class: "spin" }));
        else if (f) fig.appendChild(h("img", { src: base + f.id, alt: sl[1] + " görünüm", loading: "lazy" }));
        else { var sv = h("span", { class: "bf-sil" }); sv.innerHTML = BODY_SVG[sl[0]]; fig.appendChild(sv); }   // sabit, güvenli SVG (kullanıcı verisi değil)
        var add = o.readOnly ? null : h("button", { class: "bf-btn", type: "button", "aria-label": sl[1] + " görünüm ekle", onclick: function () { if (o.locked) return err(o.locked); pick.click(); } }, AVF.icon(f ? "refresh" : "plus"), h("span", { text: f ? "Değiştir" : "Ekle" }));
        var rm = !o.readOnly && f && !f.pending ? h("button", { class: "bf-x", type: "button", "aria-label": sl[1] + " görseli kaldır", onclick: function () {
          AVF.api("DELETE", "/attachments/" + f.id).then(function () { delete files[sl[0]]; paint(); }, function (e) { err(AVF.errText(e)); });
        } }, AVF.icon("x")) : null;
        pick.addEventListener("change", function () {
          var file = pick.files && pick.files[0]; pick.value = ""; if (!file) return; err("");
          var ext = (/\.([a-z0-9]+)$/i.exec(file.name) || [])[1]; ext = ext ? ext.toLowerCase() : "";
          if (["png", "jpg", "jpeg"].indexOf(ext) < 0) return err("Vücut formu için yalnızca PNG, JPG veya JPEG görsel eklenebilir.");
          if (file.size > AVF.UPLOAD.bytes) return err("Dosya en fazla 4 MB olabilir.");
          var prev = files[sl[0]]; files[sl[0]] = { pending: true }; paint();
          AVF.uploadFile("body?slot=" + sl[0], file).then(function (r) { files[sl[0]] = r; paint(); }, function (e) { if (prev) files[sl[0]] = prev; else delete files[sl[0]]; paint(); err(AVF.errText(e)); });
        });
        return h("div", { class: "bf-card" + (f && !f.pending ? " has" : "") }, fig, h("div", { class: "bf-foot" }, h("b", { text: sl[1] }), add, rm), pick);
      }));
    }
    err(""); paint(); return el;
  };
})();
