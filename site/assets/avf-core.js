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
  };
  AVF.icon = function (n, cls) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "ico" + (cls ? " " + cls : "")); s.setAttribute("aria-hidden", "true");
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", P[n] || P.alert); s.appendChild(p); return s;
  };


  // Marka: tek kaynak. Yuvarlatılmış kare içinde iki zirve (Alp) ve güneş noktası; yanında "AlpveFit" yazısı.
  // light = açık zemin (siyah kare). Koyu zeminde (light=false) beyaz kare + siyah çizgi.
  AVF.mark = function (size) {
    var NS = "http://www.w3.org/2000/svg", s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 64 64"); s.setAttribute("class", "lmk"); s.setAttribute("aria-hidden", "true");
    if (size) { s.setAttribute("width", size); s.setAttribute("height", size); }
    [["rect", { width: "64", height: "64", rx: "18", class: "lmk-bg" }],
     ["path", { d: "M13 45L27 21l8 13 5-7 11 18", fill: "none", class: "lmk-fg", "stroke-width": "5", "stroke-linecap": "round", "stroke-linejoin": "round" }],
     ["circle", { cx: "45", cy: "18", r: "3.4", class: "lmk-dot" }]].forEach(function (e) { var n = document.createElementNS(NS, e[0]); Object.keys(e[1]).forEach(function (k) { n.setAttribute(k, e[1][k]); }); s.appendChild(n); });
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
  AVF.fmtDateTime = function (iso) { try { return new Date(iso).toLocaleString(AVF.locale ? AVF.locale() : "tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  AVF.fmtTime = function (iso) { try { return new Date(iso).toLocaleTimeString(AVF.locale ? AVF.locale() : "tr-TR", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  AVF.maskName = function (n) {
    var p = String(n || "").trim().split(/\s+/).filter(Boolean); if (!p.length) return "";
    return [p[0]].concat(p.slice(1).map(function (x) { return x.charAt(0).toLocaleUpperCase("tr-TR") + "*****"; })).join(" ");
  };
  AVF.KIND = {
    nutrition: { label: "Beslenme Programı", icon: "apple", slug: "beslenme" },
    training: { label: "Antrenman Programı", icon: "dumb", slug: "antrenman" },
    supplement: { label: "Takviye / Vitamin / Mineral", icon: "pill", slug: "takviye" },
    pharmacology: { label: "Farmakoloji Planı", icon: "flask", slug: "farmakoloji" },
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
  AVF.accordion = function (opts) {
    var wrap = AVF.h("div", { class: "card acc" + (opts.open ? " open" : "") });
    var id = "acc" + Math.random().toString(36).slice(2, 8);
    // Yumuşak açılış: dış kap (grid 0fr → 1fr) yüksekliği, iç dolgu (pad) saydamlığı canlandırır. İçerik "panel"e yazılır.
    var panel = AVF.h("div", { class: "pad" }), outer = AVF.h("div", { class: "panel-o", id: id, role: "region" }, AVF.h("div", { class: "panel" }, panel));
    var btn = AVF.h("button", { type: "button", "aria-expanded": opts.open ? "true" : "false", "aria-controls": id, onclick: function () {
      var o = wrap.classList.toggle("open"); btn.setAttribute("aria-expanded", o ? "true" : "false"); if (o && opts.onOpen) opts.onOpen(panel);
      // Grup (ör. SSS): bir öğe açılınca diğerleri kapanır.
      if (o && opts.group) opts.group.forEach(function (w) { if (w !== wrap && w.classList.contains("open")) { w.classList.remove("open"); var b = w.querySelector("button[aria-expanded]"); if (b) b.setAttribute("aria-expanded", "false"); } });
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
    return AVF.h("div", { class: "field" }, AVF.h("label", { for: input.id }, opts.icon ? AVF.h("span", { class: "tile" }, AVF.icon(opts.icon)) : null, label, opts.optional ? null : AVF.h("span", { class: "req", text: "Zorunlu" })), input, opts.hint ? AVF.h("p", { class: "hint", text: opts.hint }) : null);
  };
  var uid = 0;
  AVF.input = function (type, attrs) {
    attrs = attrs || {}; attrs.id = attrs.id || "f" + ++uid; attrs.class = "inp" + (attrs.class ? " " + attrs.class : ""); attrs.type = type;
    return AVF.h("input", attrs);
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
  AVF.lockScroll = function (on) {
    var b = document.body, de = document.documentElement;
    if (on) {
      if (lockN++ > 0) return;
      lockY = window.scrollY || 0; var sw = window.innerWidth - de.clientWidth;
      b.style.position = "fixed"; b.style.top = -lockY + "px"; b.style.left = "0"; b.style.right = "0"; b.style.width = "100%";
      if (sw > 0) b.style.paddingRight = sw + "px";
      de.classList.add("locked");
    } else {
      if (lockN === 0 || --lockN > 0) return;
      b.style.position = b.style.top = b.style.left = b.style.right = b.style.width = b.style.paddingRight = "";
      de.classList.remove("locked"); de.style.scrollBehavior = "auto"; window.scrollTo(0, lockY); de.style.scrollBehavior = "";
    }
  };
  AVF.busy = function (btn, on, label) {
    btn.disabled = !!on;
    if (label === undefined) return;
    if (on) { btn._kids = Array.prototype.slice.call(btn.childNodes); AVF.clear(btn); btn.appendChild(document.createTextNode(label)); }
    else if (btn._kids) { AVF.clear(btn); btn._kids.forEach(function (k) { btn.appendChild(k); }); btn._kids = null; }
  };
})();
