/* AlpveFit — Forum (yalnız üyeler, yalnız Türkçe).
   Adresler: /forum · /forum/k/<kategori> · /forum/konu/<id> · /forum/yeni · /forum/ara · /forum/uye/<ad> · /forum/kaydedilenler ·
   /forum/takip · /forum/konularim · /forum/moderasyon
   Güvenlik: kullanıcı içeriği HİÇBİR ZAMAN innerHTML ile yazılmaz; biçim dili (kalın, italik, alıntı, liste, bağlantı, @anma)
   metin düğümleriyle kurulur. Bağlantılar rel="nofollow ugc noopener noreferrer" ile yeni sekmede açılır. Erişim ve tüm kurallar
   sunucuda ayrıca denetlenir (routes/board.js). */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var LV_ICON = ["spark", "dumb", "target", "shield", "layers", "award", "flame", "eye"];
  var FKEY = "avf_forum_18";
  var S = { me: null, cats: null, stats: null, reasons: null, rules: null };
  var VIEW = null, poll = null;

  // ------------------------------------------------------------------ küçük yardımcılar
  function api(m, p, b) { return AVF.api(m, "/board" + p, b); }
  function go(p) { AVF.go(p); }
  function lk(href, kids, attrs) {
    var a = h("a", Object.assign({ href: href }, attrs || {}), kids);
    a.addEventListener("click", function (e) { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; e.preventDefault(); go(href); });
    return a;
  }
  function ago(iso) {
    var t = new Date(iso).getTime(), d = (Date.now() - t) / 1000;
    if (!isFinite(d)) return "";
    if (d < 45) return "az önce";
    if (d < 3600) return Math.max(1, Math.round(d / 60)) + " dk önce";
    if (d < 86400) return Math.round(d / 3600) + " sa önce";
    if (d < 86400 * 7) return Math.round(d / 86400) + " gün önce";
    return AVF.fmtDate(iso);
  }
  function timeEl(iso) { return h("time", { datetime: iso, title: AVF.fmtDateTime(iso), text: ago(iso) }); }
  function num(n) { try { return new Intl.NumberFormat("tr-TR", { notation: n >= 10000 ? "compact" : "standard" }).format(n || 0); } catch (e) { return String(n || 0); } }
  function hue(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 360; return x; }
  function avatar(a, size) {
    var cls = "fo-av" + (size ? " " + size : "");
    if (!a || !a.username) return h("span", { class: cls + " none", "aria-hidden": "true" }, AVF.icon("user"));
    if (a.avatarId) return h("img", { class: cls, src: "/api/forum/media/" + a.avatarId, alt: "", loading: "lazy", decoding: "async" });
    return h("span", { class: cls + " ini", "aria-hidden": "true", style: "--h:" + hue(a.username), text: a.username.charAt(0).toUpperCase() });
  }
  function lvl(l, big) {
    if (!l) return null;
    return h("span", { class: "fo-lv" + (l.assigned ? " as" : "") + (big ? " big" : ""), title: l.name }, AVF.icon(l.assigned ? "shield" : LV_ICON[Math.max(0, Math.min(7, l.n - 1))]), h("span", { text: l.name }));
  }
  function uname(a, cls) { return a && a.username ? lk("/forum/uye/" + a.username, "@" + a.username, { class: cls || "fo-un", "data-notr": "" }) : h("span", { class: "fo-un del", text: "silinmiş üye" }); }
  function chip(icon, text, cls) { return h("span", { class: "fo-chip" + (cls ? " " + cls : "") }, icon ? AVF.icon(icon) : null, h("span", { text: text })); }
  function errBox(e, retry) { return AVF.state("alert", "Yüklenemedi", AVF.errText(e), retry ? h("button", { class: "btn", type: "button", onclick: retry }, AVF.icon("refresh", "bico"), "Tekrar dene") : null); }
  function qs() { var o = {}; (location.search || "").replace(/^\?/, "").split("&").forEach(function (kv) { if (!kv) return; var i = kv.indexOf("="); o[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = decodeURIComponent(i < 0 ? "" : kv.slice(i + 1).replace(/\+/g, " ")); }); return o; }
  function copy(text) {
    var done = function () { AVF.toast("Bağlantı kopyalandı."); };
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(done, function () { AVF.toast(text); });
    AVF.toast(text);
  }
  function title(t) { document.title = t + " — Forum — AlpveFit"; }

  // ------------------------------------------------------------------ biçim dili → DOM (güvenli)
  var URL_RE = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)/;
  function inline(text, out) {
    // sırasıyla: bağlantı, @anma, `kod`, **kalın**, ~~üstü çizili~~, *italik* / _italik_
    var re = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)|(^|[\s(])@([a-z][a-z0-9._]{1,18}[a-z0-9])\b|`([^`\n]{1,200})`|\*\*([^*\n]{1,300})\*\*|~~([^~\n]{1,300})~~|(^|[\s(])[*_]([^*_\n]{1,300})[*_](?=[\s.,!?;:)]|$)/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      var start = m.index;
      if (m[2] !== undefined || m[7] !== undefined) start += (m[2] || m[7] || "").length;
      if (start > last) out.push(document.createTextNode(text.slice(last, start)));
      if (m[1]) {
        var url = m[1].replace(/[.,!?;:]+$/, ""), trail = m[1].slice(url.length), href = /^https?:/i.test(url) ? url : "https://" + url;
        var shown = url.replace(/^https?:\/\/(www\.)?/i, ""); if (shown.length > 48) shown = shown.slice(0, 45) + "…";
        out.push(h("a", { href: href, target: "_blank", rel: "nofollow ugc noopener noreferrer", class: "fo-ext", text: shown }));
        if (trail) out.push(document.createTextNode(trail));
      } else if (m[3]) out.push(lk("/forum/uye/" + m[3], "@" + m[3], { class: "fo-men" }));
      else if (m[4]) out.push(h("code", { text: m[4] }));
      else if (m[5]) { var b = h("strong"); inline(m[5], []).forEach(function (n) { b.appendChild(n); }); out.push(b); }
      else if (m[6]) out.push(h("s", { text: m[6] }));
      else if (m[8]) out.push(h("em", { text: m[8] }));
      last = re.lastIndex;
    }
    if (last < text.length) out.push(document.createTextNode(text.slice(last)));
    return out;
  }
  function block(text, el) {
    var lines = text.split("\n"), i = 0;
    while (i < lines.length) {
      var ln = lines[i];
      if (!ln.trim()) { i++; continue; }
      if (/^\s*[-*•]\s+/.test(ln)) {
        var ul = h("ul"); while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) { var li = h("li"); inline(lines[i].replace(/^\s*[-*•]\s+/, ""), []).forEach(function (n) { li.appendChild(n); }); ul.appendChild(li); i++; }
        el.appendChild(ul); continue;
      }
      if (/^\s*\d{1,2}[.)]\s+/.test(ln)) {
        var ol = h("ol"); while (i < lines.length && /^\s*\d{1,2}[.)]\s+/.test(lines[i])) { var li2 = h("li"); inline(lines[i].replace(/^\s*\d{1,2}[.)]\s+/, ""), []).forEach(function (n) { li2.appendChild(n); }); ol.appendChild(li2); i++; }
        el.appendChild(ol); continue;
      }
      if (/^>\s?/.test(ln)) {
        var bq = h("blockquote", { class: "fo-bq" }), buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
        block(buf.join("\n"), bq); el.appendChild(bq); continue;
      }
      var p = h("p"), first = true;
      while (i < lines.length && lines[i].trim() && !/^\s*([-*•]|\d{1,2}[.)])\s+/.test(lines[i]) && !/^>\s?/.test(lines[i])) {
        if (!first) p.appendChild(h("br"));
        inline(lines[i], []).forEach(function (n) { p.appendChild(n); }); first = false; i++;
      }
      el.appendChild(p);
    }
  }
  AVF.forumFormat = function (body, onQuoteJump) {
    var el = h("div", { class: "fo-body", "data-notr": "" }), re = /\[alinti=([a-z0-9._]{3,20})#([0-9a-f-]{36})\]([\s\S]*?)\[\/alinti\]/gi, last = 0, m;
    while ((m = re.exec(body))) {
      if (m.index > last) block(body.slice(last, m.index), el);
      var who = m[1], pid = m[2];
      var q = h("blockquote", { class: "fo-quote" }, h("div", { class: "fo-qh" }, AVF.icon("quote"), lk("/forum/uye/" + who, "@" + who, { class: "fo-men" }), h("span", { text: " yazdı:" }),
        onQuoteJump ? h("button", { type: "button", class: "fo-qj", "aria-label": "Alıntılanan mesaja git", title: "Alıntılanan mesaja git", onclick: function () { onQuoteJump(pid); } }, AVF.icon("arrow")) : null));
      var inner = h("div"); block(m[3].trim(), inner); q.appendChild(inner); el.appendChild(q);
      last = re.lastIndex;
    }
    if (last < body.length) block(body.slice(last), el);
    return el;
  };

  // ------------------------------------------------------------------ iletişim kutusu (form içeren)
  function dialog(o) {
    // o: { icon, title, text, body (düğüm), confirm, danger, onConfirm(): Promise|false }
    var prev = document.activeElement, ok = h("button", { class: "btn" + (o.danger ? " danger" : ""), type: "button" }, o.confirm || "Tamam"), no = h("button", { class: "btn ghost", type: "button" }, o.cancel || "Vazgeç");
    var msg = h("div", { class: "fo-dmsg", role: "alert" });
    var box = h("div", { class: "cdlg fo-dlg", role: "dialog", "aria-modal": "true", "aria-labelledby": "frdt" }, h("span", { class: "tile" }, AVF.icon(o.icon || "alert")), h("h3", { id: "frdt", text: o.title }), o.text ? h("p", { text: o.text }) : null, o.body || null, msg, h("div", { class: "row" }, ok, no));
    var ov = h("div", { class: "cov" }, box);
    function close() { ov.classList.add("out"); document.removeEventListener("keydown", key); setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); AVF.lockScroll(false); try { prev && prev.focus && prev.focus(); } catch (e) { /* yok */ } }, 180); }
    function key(e) { if (e.key === "Escape") close(); }
    no.addEventListener("click", close);
    ok.addEventListener("click", function () {
      msg.textContent = "";
      var r = o.onConfirm ? o.onConfirm() : null;
      if (r === false) return;
      if (r && r.then) { AVF.busy(ok, true); r.then(function () { close(); }, function (e) { AVF.busy(ok, false); msg.textContent = AVF.errText(e); }); } else close();
    });
    ov.addEventListener("mousedown", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", key); AVF.lockScroll(true); document.body.appendChild(ov);
    setTimeout(function () { var f = box.querySelector("input,select,textarea"); (f || no).focus(); }, 40);
    return { close: close, msg: msg };
  }
  function lightbox(ids, start) {
    var i = start || 0, img = h("img", { alt: "" }), cnt = h("span", { class: "fo-lbn" });
    var prevB = h("button", { type: "button", class: "fo-lbb p", "aria-label": "Önceki görsel" }, AVF.icon("back")), nextB = h("button", { type: "button", class: "fo-lbb n", "aria-label": "Sonraki görsel" }, AVF.icon("arrow"));
    var x = h("button", { type: "button", class: "fo-lbx", "aria-label": "Kapat" }, AVF.icon("x"));
    var ov = h("div", { class: "fo-lb", role: "dialog", "aria-modal": "true", "aria-label": "Görsel" }, img, x, ids.length > 1 ? prevB : null, ids.length > 1 ? nextB : null, ids.length > 1 ? cnt : null);
    function show() { img.src = "/api/board/img/" + ids[i]; cnt.textContent = (i + 1) + " / " + ids.length; }
    function close() { document.removeEventListener("keydown", key); ov.remove(); AVF.lockScroll(false); }
    function key(e) { if (e.key === "Escape") close(); else if (e.key === "ArrowRight") { i = (i + 1) % ids.length; show(); } else if (e.key === "ArrowLeft") { i = (i - 1 + ids.length) % ids.length; show(); } }
    x.onclick = close; prevB.onclick = function () { i = (i - 1 + ids.length) % ids.length; show(); }; nextB.onclick = function () { i = (i + 1) % ids.length; show(); };
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    var sx = null; ov.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    ov.addEventListener("touchend", function (e) { if (sx === null || ids.length < 2) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { i = (i + (dx < 0 ? 1 : -1) + ids.length) % ids.length; show(); } sx = null; });
    document.addEventListener("keydown", key); AVF.lockScroll(true); document.body.appendChild(ov); show(); x.focus();
  }

  // ------------------------------------------------------------------ yazma alanı (konu / yanıt / düzenleme)
  function uploadImage(file) {
    var hd = { "Content-Type": "application/octet-stream", Accept: "application/json", "x-avf-lang": "tr" }, c = AVF.cookie("avf_csrf"); if (c) hd["x-csrf-token"] = c;
    return fetch("/api/board/images", { method: "POST", credentials: "same-origin", headers: hd, body: file }).then(function (r) {
      return r.text().then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; } if (r.ok) return d; throw { status: r.status, data: d || {} }; });
    }, function () { throw { status: 0, data: { error: "network" } }; });
  }
  function giphyPicker(onPick) {
    var q = AVF.input("search", { placeholder: "GIF ara…", "aria-label": "GIF ara" }), grid = h("div", { class: "gp-grid" }), t = null, busy = false;
    function run() {
      AVF.mount(grid, AVF.skeleton(1));
      AVF.api("GET", "/giphy/search?q=" + encodeURIComponent(q.value) + "&lang=tr").then(function (r) {
        AVF.mount(grid, r.items.length ? r.items.map(function (g) {
          return h("button", { type: "button", class: "gp-i", title: g.title, onclick: function (e) {
            if (busy) return; busy = true; var b = e.currentTarget; b.classList.add("load");
            onPick(g.id, function () { busy = false; b.classList.remove("load"); });
          } }, h("img", { src: g.preview || g.anim, alt: g.title || "GIF", loading: "lazy", referrerpolicy: "no-referrer" }));
        }) : h("p", { class: "hint", text: "Sonuç yok." }));
      }, function (e) { AVF.mount(grid, h("p", { class: "note err", text: AVF.errText(e) })); });
    }
    q.addEventListener("input", function () { clearTimeout(t); t = setTimeout(run, 350); });
    run();
    return h("div", { class: "gp card fo-gp" }, q, grid, h("small", { class: "gp-attr", "data-notr": "", text: "Powered by GIPHY" }));
  }
  // o: { value, images[], draftKey, placeholder, submitText, onSubmit(body, images) → Promise, onCancel, compact, autofocus }
  function composer(o) {
    var KEY = o.draftKey ? "avf_fd_" + (AVF.session.user ? AVF.session.user.id : "x") + "_" + o.draftKey : null;
    var saved = null; try { saved = KEY ? JSON.parse(localStorage.getItem(KEY) || "null") : null; } catch (e) { saved = null; }
    if (saved && Date.now() - saved.t > 7 * 864e5) saved = null;
    var ta = h("textarea", { class: "inp fo-ta", rows: o.compact ? "4" : "8", maxlength: "10000", placeholder: o.placeholder || "Mesajınızı yazın…", "aria-label": "Mesaj", spellcheck: "true" });
    ta.value = o.value || (saved && saved.v) || "";
    var images = (o.images || []).slice(), imgBox = h("div", { class: "fo-imgs" }), cnt = h("small", { class: "fo-cnt" }), msg = h("div", { class: "fo-cmsg", role: "alert" });
    var prev = h("div", { class: "fo-prev", hidden: "" }), tabW = h("button", { type: "button", role: "tab", class: "on", "aria-selected": "true" }, "Yaz"), tabP = h("button", { type: "button", role: "tab", "aria-selected": "false" }, "Önizleme");
    var pick = h("input", { type: "file", accept: "image/png,image/jpeg,image/gif", multiple: "", hidden: "", tabindex: "-1" });
    var gifBox = h("div"), sugg = h("div", { class: "fo-sugg", role: "listbox", hidden: "" });
    var send = h("button", { class: "btn", type: "button" }, AVF.icon("send", "bico"), o.submitText || "Gönder");
    function save() { if (!KEY) return; try { if (ta.value.trim()) localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), v: ta.value })); else localStorage.removeItem(KEY); } catch (e) { /* depolama yok */ } }
    function paintCount() { var n = ta.value.length; cnt.textContent = n > 8000 ? num(n) + " / 10.000" : ""; cnt.classList.toggle("warn", n > 9500); }
    function wrap(a, b, ph) {
      var s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || ph || "";
      ta.value = ta.value.slice(0, s) + a + sel + b + ta.value.slice(e); ta.focus();
      try { ta.setSelectionRange(s + a.length, s + a.length + sel.length); } catch (x) { /* yok */ }
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
    function linePrefix(p) {
      var s = ta.selectionStart, e = ta.selectionEnd, st = ta.value.lastIndexOf("\n", s - 1) + 1, seg = ta.value.slice(st, e) || "";
      var rep = (seg || "").split("\n").map(function (l, i) { return (p === "1. " ? (i + 1) + ". " : p) + l; }).join("\n");
      ta.value = ta.value.slice(0, st) + rep + ta.value.slice(e); ta.focus(); ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
    function tb(label, title, fn, icon) { return h("button", { type: "button", class: "fo-tb", title: title, "aria-label": title, onmousedown: function (e) { e.preventDefault(); }, onclick: fn }, icon ? AVF.icon(icon) : h("span", { text: label })); }
    function paintImages() {
      AVF.mount(imgBox, images.map(function (id) {
        return h("div", { class: "fo-it" }, h("img", { src: "/api/board/img/" + id, alt: "" }), h("button", { type: "button", class: "fo-itx", "aria-label": "Görseli kaldır", title: "Görseli kaldır", onclick: function () {
          images = images.filter(function (x) { return x !== id; }); paintImages();
          if (!(o.images || []).includes(id)) api("DELETE", "/images/" + id).then(null, function () {});
        } }, AVF.icon("x")));
      }));
      imgBox.hidden = !images.length;
    }
    function addFiles(files) {
      msg.textContent = "";
      [].slice.call(files).forEach(function (f) {
        if (images.length >= 4) { msg.textContent = "Bir mesaja en fazla 4 görsel eklenebilir."; return; }
        if (["image/png", "image/jpeg", "image/gif"].indexOf(f.type) < 0) { msg.textContent = "Yalnız PNG, JPG veya GIF yüklenebilir."; return; }
        if (f.size > 4 * 1024 * 1024) { msg.textContent = "Görsel en fazla 4 MB olabilir."; return; }
        var ph = h("div", { class: "fo-it load" }, h("span", { class: "fo-spin" })); imgBox.hidden = false; imgBox.appendChild(ph);
        images.push("__p" + Math.random());
        var tmp = images[images.length - 1];
        uploadImage(f).then(function (r) { images[images.indexOf(tmp)] = r.id; paintImages(); }, function (e) { images = images.filter(function (x) { return x !== tmp; }); paintImages(); msg.textContent = AVF.errText(e); });
      });
    }
    pick.addEventListener("change", function () { addFiles(pick.files); pick.value = ""; });
    ta.addEventListener("paste", function (e) { var f = e.clipboardData && e.clipboardData.files; if (f && f.length) { e.preventDefault(); addFiles(f); } });
    ta.addEventListener("dragover", function (e) { e.preventDefault(); ta.classList.add("drag"); });
    ta.addEventListener("dragleave", function () { ta.classList.remove("drag"); });
    ta.addEventListener("drop", function (e) { e.preventDefault(); ta.classList.remove("drag"); if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files); });
    // @anma önerisi
    var st = null, sel = 0, items = [];
    function closeSugg() { sugg.hidden = true; items = []; }
    function mentionAt() { var c = ta.selectionStart, before = ta.value.slice(0, c), m = /(^|[\s(])@([a-z0-9._]{1,20})$/.exec(before); return m ? { q: m[2], at: c - m[2].length } : null; }
    function pickSugg(i) {
      var m = mentionAt(); if (!m || !items[i]) return closeSugg();
      ta.value = ta.value.slice(0, m.at) + items[i].username + " " + ta.value.slice(ta.selectionStart); var c = m.at + items[i].username.length + 1;
      ta.focus(); try { ta.setSelectionRange(c, c); } catch (x) { /* yok */ } closeSugg(); ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
    function paintSugg() { AVF.mount(sugg, items.map(function (u, i) { return h("button", { type: "button", role: "option", class: i === sel ? "on" : "", "aria-selected": String(i === sel), onmousedown: function (e) { e.preventDefault(); pickSugg(i); } }, avatar(u, "xs"), h("span", { "data-notr": "", text: "@" + u.username })); })); sugg.hidden = !items.length; }
    ta.addEventListener("input", function () {
      save(); paintCount();
      var m = mentionAt(); clearTimeout(st);
      if (!m) return closeSugg();
      st = setTimeout(function () { api("GET", "/mention?q=" + encodeURIComponent(m.q)).then(function (r) { items = r; sel = 0; paintSugg(); }, closeSugg); }, 180);
    });
    ta.addEventListener("keydown", function (e) {
      if (!sugg.hidden && items.length) {
        if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % items.length; return paintSugg(); }
        if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + items.length) % items.length; return paintSugg(); }
        if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); return pickSugg(sel); }
        if (e.key === "Escape") return closeSugg();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); send.click(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) { e.preventDefault(); wrap("**", "**", "kalın"); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "i" || e.key === "I")) { e.preventDefault(); wrap("*", "*", "italik"); }
    });
    ta.addEventListener("blur", function () { setTimeout(closeSugg, 150); });
    function setTab(p) {
      tabW.classList.toggle("on", !p); tabP.classList.toggle("on", p); tabW.setAttribute("aria-selected", String(!p)); tabP.setAttribute("aria-selected", String(p));
      ta.hidden = p; prev.hidden = !p;
      if (p) AVF.mount(prev, ta.value.trim() ? AVF.forumFormat(ta.value) : h("p", { class: "hint", text: "Önizlenecek bir şey yok." }));
    }
    tabW.onclick = function () { setTab(false); ta.focus(); }; tabP.onclick = function () { setTab(true); };
    var gifBtn = null;
    AVF.api("GET", "/giphy/status").then(function (r) { if (r && r.enabled && gifBtn) gifBtn.hidden = false; }, function () {});
    gifBtn = tb("GIF", "GIF ekle", function () {
      if (gifBox.firstChild) return AVF.mount(gifBox, null);
      AVF.mount(gifBox, giphyPicker(function (id, done) {
        if (images.length >= 4) { done(); msg.textContent = "Bir mesaja en fazla 4 görsel eklenebilir."; return; }
        api("POST", "/images/giphy", { id: id }).then(function (r) { done(); images.push(r.id); paintImages(); AVF.mount(gifBox, null); }, function (e) { done(); msg.textContent = AVF.errText(e); });
      }));
    });
    gifBtn.hidden = true; gifBtn.classList.add("gif");
    var tools = h("div", { class: "fo-tools", role: "toolbar", "aria-label": "Biçim" },
      tb("B", "Kalın (Ctrl+B)", function () { wrap("**", "**", "kalın"); }), tb("I", "İtalik (Ctrl+I)", function () { wrap("*", "*", "italik"); }), tb("S", "Üstü çizili", function () { wrap("~~", "~~", "metin"); }),
      h("span", { class: "fo-sep" }), tb("", "Alıntı", function () { linePrefix("> "); }, "quote"), tb("", "Madde listesi", function () { linePrefix("- "); }, "list"), tb("", "Bağlantı", function () { wrap("", "", "https://"); }, "link"),
      tb("", "Kullanıcı an", function () { wrap("@", "", ""); ta.dispatchEvent(new Event("input", { bubbles: true })); }, "atsign"),
      h("span", { class: "fo-sep" }), tb("", "Görsel ekle", function () { pick.click(); }, "image"), gifBtn, AVF.emojiPicker ? AVF.emojiPicker(ta) : null,
      h("span", { class: "fo-tabs", role: "tablist" }, tabW, tabP));
    var cancel = o.onCancel ? h("button", { class: "btn ghost", type: "button", onclick: o.onCancel }, "Vazgeç") : null;
    send.addEventListener("click", function () {
      msg.textContent = "";
      if (images.some(function (x) { return x.indexOf("__p") === 0; })) { msg.textContent = "Görseller yükleniyor, lütfen bekleyin."; return; }
      var v = ta.value.trim();
      if (v.length < 2) { msg.textContent = "Mesaj boş olamaz."; ta.focus(); return; }
      AVF.busy(send, true, "Gönderiliyor…");
      Promise.resolve(o.onSubmit(v, images.slice())).then(function () {
        AVF.busy(send, false);
        if (KEY) try { localStorage.removeItem(KEY); } catch (e) { /* yok */ }
        if (o.reset !== false) { ta.value = ""; images = []; paintImages(); setTab(false); paintCount(); }
      }, function (e) { AVF.busy(send, false); msg.textContent = AVF.errText(e); });
    });
    paintImages(); paintCount();
    var el = h("div", { class: "fo-comp" + (o.compact ? " compact" : "") }, tools, h("div", { class: "fo-taw" }, ta, sugg), prev, imgBox, gifBox, pick,
      o.extra || null,
      saved && !o.value ? h("small", { class: "fo-draft" }, AVF.icon("save"), h("span", { text: "Kaydedilmemiş taslağınız geri yüklendi." })) : null,
      msg, h("div", { class: "fo-cfoot" }, h("small", { class: "fo-help", text: "**kalın**  *italik*  > alıntı  - liste  @kullanıcıadı  ·  Ctrl+Enter ile gönder" }), cnt, h("span", { class: "fo-cbtn" }, cancel, send)));
    el.textarea = ta;
    el.insert = function (t) { var s = ta.value; ta.value = (s && !/\n$/.test(s) ? s + "\n" : s) + t; ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (x) { /* yok */ } ta.dispatchEvent(new Event("input", { bubbles: true })); };
    el.getImages = function () { return images.slice(); };
    if (o.autofocus) setTimeout(function () { ta.focus(); }, 60);
    return el;
  }

  // ------------------------------------------------------------------ iskelet (başlık bandı + yan panel)
  function shell(opts, mainKids) {
    var me = S.me, st = S.stats;
    var q = AVF.input("search", { placeholder: "Forumda ara…", "aria-label": "Forumda ara", value: opts.q || "" });
    var sf = h("form", { class: "fo-search", role: "search" }, AVF.icon("search"), q, h("button", { class: "btn sm", type: "submit" }, "Ara"));
    sf.addEventListener("submit", function (e) { e.preventDefault(); var v = q.value.trim(); if (v.length >= 2) go("/forum/ara?q=" + encodeURIComponent(v)); });
    var crumbs = h("nav", { class: "fo-crumbs", "aria-label": "Konum" }, lk("/forum", [AVF.icon("msg"), h("span", { text: "Forum" })]),
      (opts.crumbs || []).map(function (c) { return [h("span", { class: "sep", "aria-hidden": "true", text: "›" }), c[1] ? lk(c[1], c[0]) : h("span", { "data-notr": "", text: c[0] })]; }));
    var newBtn = opts.noNew ? null : lk("/forum/yeni" + (opts.cat ? "?k=" + opts.cat : ""), [AVF.icon("plus", "bico"), h("span", { text: "Yeni konu" })], { class: "btn fo-new" + (me && me.banned ? " off" : "") });
    var band = h("section", { class: "fo-band", "data-norv": "" }, h("div", { class: "wrap" }, h("div", { class: "fo-bt" }, crumbs, h("div", { class: "fo-bact" }, newBtn)), h("div", { class: "fo-bh" }, h("h1", { "data-notr": "", text: opts.h1 || "Forum" }), opts.sub ? h("p", { text: opts.sub }) : null), sf));
    var side = h("aside", { class: "fo-side" },
      me ? h("section", { class: "card fo-me" }, h("div", { class: "fo-meh" }, avatar({ username: me.username, avatarId: AVF.session.user && AVF.session.user.avatar_id }, "md"), h("div", null, lk("/forum/uye/" + me.username, "@" + me.username, { class: "fo-un b", "data-notr": "" }), lvl(me.level))),
        me.banned ? h("p", { class: "note err fo-ban" }, AVF.icon("lock", "bico"), h("span", { text: me.banUntil ? "Forumdan " + AVF.fmtDateTime(me.banUntil) + " tarihine kadar uzaklaştırıldınız." : "Forumdan uzaklaştırıldınız." }), me.banReason ? h("small", { text: "Gerekçe: " + me.banReason }) : null) : null,
        h("nav", { class: "fo-mel" }, [["/forum/konularim", "file", "Konularım"], ["/forum/takip", "bell", "Takip ettiklerim"], ["/forum/kaydedilenler", "bookmark", "Kaydedilenler"], ["/panel/forum-ayarlari", "cog", "Forum ayarları"]].map(function (x) {
          return lk(x[0], [AVF.icon(x[1]), h("span", { text: x[2] })], { "aria-current": location.pathname === x[0] ? "page" : null });
        }), me.mod ? lk("/forum/moderasyon", [AVF.icon("shield"), h("span", { text: "Moderasyon" }), me.openReports ? h("span", { class: "fo-cnt-b", text: String(me.openReports) }) : null], { class: "mod", "aria-current": location.pathname === "/forum/moderasyon" ? "page" : null }) : null)) : null,
      st ? h("section", { class: "card fo-stats" }, h("h3", { text: "Forum istatistikleri" }),
        h("dl", null, [["Konu", st.topics], ["Mesaj", st.posts], ["Üye", st.members]].map(function (x) { return h("div", null, h("dt", { text: x[0] }), h("dd", { text: num(x[1]) })); })),
        h("p", { class: "fo-on" }, h("i", { "aria-hidden": "true" }), h("span", { text: num(st.online) + " üye çevrimiçi" })), st.newest ? h("p", { class: "hint" }, h("span", { text: "En yeni üye: " }), lk("/forum/uye/" + st.newest, "@" + st.newest, { class: "fo-men" })) : null) : null,
      h("section", { class: "card fo-rul" }, h("h3", null, AVF.icon("shield"), h("span", { text: "Forum kuralları" })), h("ul", null, (S.rules || []).slice(1, 5).map(function (r) { return h("li", { text: r }); })),
        h("button", { class: "fo-lnk", type: "button", onclick: showRules }, "Tüm kurallar")));
    AVF.mount(VIEW, band, h("div", { class: "wrap fo-wrap", "data-norv": "" }, h("div", { class: "fo-grid" }, h("div", { class: "fo-main" }, mainKids), side)));
    return VIEW.querySelector(".fo-main");
  }
  function showRules() {
    dialog({ icon: "shield", title: "Forum kuralları", body: h("ol", { class: "fo-rlist" }, (S.rules || []).map(function (r) { return h("li", { text: r }); })), confirm: "Anladım", cancel: "Kapat" });
  }
  function pager(page, pages, hrefOf) {
    if (pages <= 1) return null;
    var items = [], add = function (p) { items.push(p === page ? h("span", { class: "on", "aria-current": "page", text: String(p) }) : lk(hrefOf(p), String(p), { "aria-label": p + ". sayfa" })); };
    var set = {}; [1, 2, page - 1, page, page + 1, pages - 1, pages].forEach(function (p) { if (p >= 1 && p <= pages) set[p] = 1; });
    var list = Object.keys(set).map(Number).sort(function (a, b) { return a - b; }), lastP = 0;
    list.forEach(function (p) { if (p - lastP > 1) items.push(h("span", { class: "gap", text: "…" })); add(p); lastP = p; });
    return h("nav", { class: "fo-pg", "aria-label": "Sayfalar" }, page > 1 ? lk(hrefOf(page - 1), AVF.icon("back"), { "aria-label": "Önceki sayfa", class: "ar" }) : null, items,
      page < pages ? lk(hrefOf(page + 1), AVF.icon("arrow"), { "aria-label": "Sonraki sayfa", class: "ar" }) : null);
  }

  // ------------------------------------------------------------------ konu satırı
  function topicRow(t, showCat) {
    var href = "/forum/konu/" + t.id + (t.unread && t.seen ? "?s=unread" : "");
    var badges = [t.pinned ? chip("pushpin", "Sabit", "pin") : null, t.locked ? chip("lock", "Kilitli", "lock") : null, t.hidden ? chip("eyeoff", "Gizli", "err") : null,
      t.kind === "question" ? (t.solved ? chip("check", "Çözüldü", "ok") : chip("help", "Soru", "q")) : null, t.hasPoll ? chip("chart", "Anket") : null, t.hasImages ? h("span", { class: "fo-ic", title: "Görsel içeriyor" }, AVF.icon("image")) : null];
    return h("li", { class: "fo-t" + (t.unread ? " unread" : "") + (t.pinned ? " pinned" : "") },
      avatar(t.author, "sm"),
      h("div", { class: "fo-tm" },
        h("div", { class: "fo-tt" }, t.unread ? h("i", { class: "fo-dot", title: "Okunmamış" }) : null, lk(href, t.title, { class: "fo-tl", "data-notr": "" }), badges),
        t.excerpt ? h("p", { class: "fo-ex", "data-notr": "", text: t.excerpt.replace(/\s+/g, " ").replace(/\*\*|~~|`/g, "") }) : null,
        h("div", { class: "fo-meta" }, showCat ? lk("/forum/k/" + t.category.slug, [AVF.icon(t.category.icon), h("span", { text: t.category.name })], { class: "fo-cat" }) : null,
          t.author ? uname(t.author) : h("span", { class: "fo-un del", text: "silinmiş üye" }), t.author ? lvl(t.author.level) : null, timeEl(t.createdAt))),
      h("div", { class: "fo-ts" }, h("span", { title: "Yanıt" }, AVF.icon("chat"), h("b", { text: num(t.replies) })), h("span", { title: "Görüntülenme" }, AVF.icon("eye"), h("b", { text: num(t.views) })), t.likes ? h("span", { title: "Beğeni" }, AVF.icon("like"), h("b", { text: num(t.likes) })) : null),
      h("div", { class: "fo-tlst" }, h("small", { text: t.replies ? "Son yanıt" : "Açıldı" }), lk("/forum/konu/" + t.id + "?page=last", [t.lastUser ? h("span", { "data-notr": "", text: "@" + t.lastUser }) : null, timeEl(t.lastAt)], { class: "fo-last" })));
  }
  function topicList(rows, showCat, empty) {
    if (!rows.length) return AVF.state(empty ? empty[0] : "msg", empty ? empty[1] : "Henüz konu yok", empty ? empty[2] : "İlk konuyu siz açın.");
    return h("ul", { class: "fo-tlist card" }, rows.map(function (t) { return topicRow(t, showCat); }));
  }

  // ------------------------------------------------------------------ ana sayfa
  function home() {
    title("Ana sayfa");
    var tabs = [["", "Son hareketler"], ["new", "Yeni konular"], ["unread", "Okunmamış"], ["unsolved", "Yanıt bekleyen sorular"]], cur = qs().l || "";
    var listBox = h("div", { class: "fo-latest" });
    var main = shell({ h1: "Forum", sub: "Antrenman, beslenme ve gelişim üzerine soru sorun, deneyim paylaşın." }, [
      h("section", { class: "fo-cats" }, S.cats.map(function (c) {
        return h("article", { class: "fo-c card" + (c.kind === "announce" ? " ann" : "") + (c.unread ? " unread" : "") },
          h("span", { class: "tile" }, AVF.icon(c.icon)),
          h("div", { class: "fo-cm" }, h("h2", null, lk("/forum/k/" + c.slug, c.name), c.isLocked ? h("span", { class: "fo-ic", title: "Yeni konulara kapalı" }, AVF.icon("lock")) : null, c.unread ? h("span", { class: "fo-new-b", text: c.unread + " yeni" }) : null),
            h("p", { text: c.description })),
          h("div", { class: "fo-cs" }, h("div", null, h("b", { text: num(c.topics) }), h("small", { text: "konu" })), h("div", null, h("b", { text: num(c.posts) }), h("small", { text: "mesaj" }))),
          h("div", { class: "fo-cl" }, c.last ? [lk("/forum/konu/" + c.last.id + "?page=last", c.last.title, { class: "fo-cll", "data-notr": "" }), h("small", null, c.last.user ? h("span", { "data-notr": "", text: "@" + c.last.user + " · " }) : null, timeEl(c.last.at))]
            : h("small", { class: "hint", text: "Henüz konu yok" })));
      })),
      h("section", { class: "fo-sec" }, h("div", { class: "fo-sh" }, h("div", { class: "fo-tabs2", role: "tablist" }, tabs.map(function (x) {
        return h("button", { type: "button", role: "tab", class: x[0] === cur ? "on" : "", "aria-selected": String(x[0] === cur), onclick: function () { history.replaceState(null, "", "/forum" + (x[0] ? "?l=" + x[0] : "")); home(); } }, x[1]);
      })), h("button", { class: "fo-lnk", type: "button", onclick: function () { api("POST", "/read-all", {}).then(function () { AVF.toast("Tüm konular okundu olarak işaretlendi."); load(); }); } }, AVF.icon("checks"), h("span", { text: "Tümünü okundu say" }))), listBox)]);
    void main;
    AVF.mount(listBox, AVF.skeleton(3));
    var q = cur === "new" ? "?sort=new" : cur === "unread" ? "?filter=unread" : cur === "unsolved" ? "?filter=unsolved" : "";
    api("GET", "/topics" + q).then(function (r) {
      AVF.mount(listBox, topicList(r.topics.slice(0, 15), true, cur === "unread" ? ["checks", "Okunmamış konu yok", "Her şeye yetiştiniz."] : null));
    }, function (e) { AVF.mount(listBox, errBox(e, home)); });
  }

  // ------------------------------------------------------------------ kategori / listeler
  function listPage(o) {
    // o: { title, crumbs, cat, filter, sub, empty }
    var Q = qs(), page = Number(Q.page) || 1, sort = Q.sort || "activity", filter = o.filter || Q.filter || "";
    var listBox = h("div"), top = h("div");
    var main = shell({ h1: o.title, sub: o.sub, crumbs: o.crumbs, cat: o.cat }, [top, listBox]);
    void main;
    AVF.mount(listBox, AVF.skeleton(4));
    var base = location.pathname, qsOf = function (p, s, f) { var a = []; if (p > 1) a.push("page=" + p); if (s && s !== "activity") a.push("sort=" + s); if (f && !o.filter) a.push("filter=" + f); return base + (a.length ? "?" + a.join("&") : ""); };
    var url = "/topics?page=" + page + "&sort=" + sort + (o.cat ? "&c=" + o.cat : "") + (filter ? "&filter=" + filter : "");
    api("GET", url).then(function (r) {
      if (r.category) { title(r.category.name); }
      var c = r.category;
      var srt = h("select", { class: "inp sm", "aria-label": "Sıralama" }, [["activity", "Son hareket"], ["new", "En yeni"], ["replies", "En çok yanıt"], ["likes", "En çok beğeni"], ["views", "En çok görüntülenen"]].map(function (x) { var op = h("option", { value: x[0], text: x[1] }); if (x[0] === sort) op.selected = true; return op; }));
      srt.addEventListener("change", function () { go(qsOf(1, srt.value, filter)); });
      var flt = o.filter ? null : h("div", { class: "fo-fl", role: "group", "aria-label": "Süzgeç" }, [["", "Tümü"], ["unread", "Okunmamış"], ["unanswered", "Yanıtsız"], ["questions", "Sorular"], ["unsolved", "Çözülmemiş"]].map(function (x) {
        return lk(qsOf(1, sort, x[0]), x[1], { class: x[0] === filter ? "on" : "", "aria-current": x[0] === filter ? "true" : null });
      }));
      AVF.mount(top, c && c.notice ? h("p", { class: "note warn fo-notice" }, AVF.icon("alert", "bico"), h("span", { text: c.notice })) : null,
        c && c.kind === "announce" && !(S.me && S.me.mod) ? h("p", { class: "note fo-notice" }, AVF.icon("info", "bico"), h("span", { text: "Bu bölümde yalnız yönetim konu açar; konulara yanıt yazabilirsiniz." })) : null,
        h("div", { class: "fo-tbar" }, flt, h("div", { class: "fo-tbr" }, h("span", { class: "hint", text: num(r.total) + " konu" }), srt)));
      if (!r.canTopic) { var nb = VIEW.querySelector(".fo-new"); if (nb && c) nb.remove(); }
      AVF.mount(listBox, topicList(r.topics, !o.cat, o.empty), pager(r.page, r.pages, function (p) { return qsOf(p, sort, filter); }));
    }, function (e) { AVF.mount(listBox, errBox(e, function () { listPage(o); })); });
  }
  function catPage(slug) {
    var c = (S.cats || []).filter(function (x) { return x.slug === slug; })[0];
    if (!c) return notFound();
    listPage({ title: c.name, sub: c.description, crumbs: [[c.name]], cat: c.slug });
  }

  // ------------------------------------------------------------------ konu
  function topicPage(id) {
    var Q = qs(), page = Q.page || (Q.s === "unread" ? "unread" : 1), target = Q.m || null;
    shell({ h1: "…", crumbs: [], noNew: true }, AVF.skeleton(4));
    api("GET", "/t/" + id + "?page=" + encodeURIComponent(page) + (target ? "&post=" + target : "")).then(function (r) { renderTopic(r, target); }, function (e) {
      shell({ h1: "Konu", crumbs: [] }, e && e.status === 404 ? AVF.state("msg", "Konu bulunamadı", "Bu konu kaldırılmış ya da hiç var olmamış olabilir.", lk("/forum", "Foruma dön", { class: "btn" })) : errBox(e, function () { topicPage(id); }));
    });
  }
  function renderTopic(r, target) {
    var t = r.topic, c = r.category, me = r.me;
    title(t.title);
    var watching = r.watching;
    var watchBtn = h("button", { class: "btn ghost sm" + (watching ? " on" : ""), type: "button", "aria-pressed": String(watching) }, AVF.icon("bell", "bico"), h("span", { text: watching ? "Takip ediliyor" : "Takip et" }));
    watchBtn.onclick = function () { api("POST", "/t/" + t.id + "/watch", { on: !watching }).then(function (x) { watching = x.watching; watchBtn.classList.toggle("on", watching); watchBtn.setAttribute("aria-pressed", String(watching)); watchBtn.lastChild.textContent = watching ? "Takip ediliyor" : "Takip et"; AVF.toast(watching ? "Konu takibe alındı; yeni yanıtlar bildirilecek." : "Konu takibi bırakıldı."); }, function (e) { AVF.toast(AVF.errText(e), "err"); }); };
    var share = h("button", { class: "btn ghost sm", type: "button", onclick: function () { copy(location.origin + "/forum/konu/" + t.id); } }, AVF.icon("link", "bico"), h("span", { text: "Bağlantıyı kopyala" }));
    var modBtn = me.mod ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { topicModMenu(r); } }, AVF.icon("shield", "bico"), h("span", { text: "Moderasyon" })) : null;
    var head = h("header", { class: "fo-th card" },
      h("div", { class: "fo-thc" }, t.pinned ? chip("pushpin", "Sabit", "pin") : null, t.locked ? chip("lock", "Kilitli", "lock") : null, t.hidden ? chip("eyeoff", "Gizli" + (t.hiddenReason ? ": " + t.hiddenReason : ""), "err") : null,
        t.kind === "question" ? (t.acceptedPostId ? chip("check", "Çözüldü", "ok") : chip("help", "Soru", "q")) : null),
      h("h1", { "data-notr": "", text: t.title }),
      h("div", { class: "fo-thm" }, lk("/forum/k/" + c.slug, [AVF.icon(c.icon), h("span", { text: c.name })], { class: "fo-cat" }), h("span", null, AVF.icon("clock"), timeEl(t.createdAt)),
        h("span", null, AVF.icon("chat"), h("b", { text: num(t.replies) }), h("span", { text: " yanıt" })), h("span", null, AVF.icon("eye"), h("b", { text: num(t.views) }), h("span", { text: " görüntülenme" }))),
      h("div", { class: "fo-tha" }, watchBtn, share, modBtn));
    var main = shell({ h1: c.name, crumbs: [[c.name, "/forum/k/" + c.slug], [t.title]], cat: c.slug, noNew: true }, []);
    var posts = h("div", { class: "fo-posts" }), compBox = h("div", { id: "yanit", class: "fo-reply" }), live = h("div", { class: "fo-live", hidden: "" });
    var hrefOf = function (p) { return "/forum/konu/" + t.id + (p > 1 ? "?page=" + p : ""); };
    AVF.mount(main, head, c.notice ? h("p", { class: "note warn fo-notice" }, AVF.icon("alert", "bico"), h("span", { text: c.notice })) : null,
      r.poll ? pollCard(t, r.poll) : null, pager(r.page, r.pages, hrefOf), posts, live, pager(r.page, r.pages, hrefOf), compBox);
    var firstUnreadShown = false;
    var ctx = { r: r, jump: function (pid) { var el = document.getElementById("m-" + pid); if (el) { el.scrollIntoView({ block: "center", behavior: "smooth" }); el.classList.add("flash"); setTimeout(function () { el.classList.remove("flash"); }, 1600); } else go("/forum/konu/" + t.id + "?m=" + pid); }, reload: function (p) { var url = "/forum/konu/" + t.id + (p ? "?page=" + p : location.search); history.replaceState(null, "", url); topicPage(t.id); } };
    r.posts.forEach(function (p, i) {
      if (r.firstUnread === p.id && !firstUnreadShown && i > 0) { posts.appendChild(h("div", { class: "fo-unl", role: "separator" }, h("span", { text: "Okunmamış mesajlar" }))); firstUnreadShown = true; }
      posts.appendChild(postCard(p, (r.page - 1) * 20 + i + 1, ctx));
    });
    // yanıt alanı
    var comp = null;
    if (r.canReply) {
      comp = composer({ draftKey: "t_" + t.id, placeholder: "Yanıtınızı yazın… (@kullanıcıadı ile birini anabilirsiniz)", submitText: "Yanıtı gönder", compact: true,
        onSubmit: function (body, images) { return api("POST", "/t/" + t.id + "/posts", { body: body, images: images }).then(function (x) { AVF.toast("Yanıtınız gönderildi."); history.replaceState(null, "", "/forum/konu/" + t.id + "?page=" + x.page + "&m=" + x.id); topicPage(t.id); }); } });
      AVF.mount(compBox, h("section", { class: "card fo-rc" }, h("h2", null, AVF.icon("reply"), h("span", { text: "Yanıt yaz" })), comp));
    } else AVF.mount(compBox, h("p", { class: "note fo-notice" }, AVF.icon("lock", "bico"), h("span", { text: r.replyBlocked || "Bu konuya yanıt yazılamaz." })));
    ctx.composer = comp;
    // kaydırma: hedef mesaj > ilk okunmamış
    setTimeout(function () {
      var el = target ? document.getElementById("m-" + target) : r.firstUnread && r.page > 0 && qs().s === "unread" ? document.getElementById("m-" + r.firstUnread) : null;
      if (el) { el.scrollIntoView({ block: "start" }); window.scrollBy(0, -80); el.classList.add("flash"); setTimeout(function () { el.classList.remove("flash"); }, 1800); }
    }, 60);
    // canlı: açık konuda yeni yanıt uyarısı (sekme görünürken 25 sn'de bir)
    clearInterval(poll);
    var since = t.lastAt;
    poll = setInterval(function () {
      if (document.hidden || !document.body.contains(live)) { if (!document.body.contains(live)) clearInterval(poll); return; }
      api("GET", "/t/" + t.id + "/since?after=" + encodeURIComponent(since)).then(function (x) {
        if (!x.count) return;
        AVF.mount(live, h("button", { class: "fo-livb", type: "button", onclick: function () { ctx.reload("last"); } }, AVF.icon("refresh"), h("span", { text: x.count + " yeni yanıt — göster" })));
        live.hidden = false;
      }, function () {});
    }, 25000);
  }
  function pollCard(t, pl) {
    var box = h("section", { class: "card fo-poll" });
    function paint(pl) {
      var total = pl.counts ? pl.counts.reduce(function (a, b) { return a + b; }, 0) : 0;
      var head = h("div", { class: "fo-ph" }, h("span", { class: "tile" }, AVF.icon("chart")), h("div", null, h("small", { text: pl.multi ? "Anket · birden fazla seçilebilir" : "Anket" }), h("h3", { "data-notr": "", text: pl.question })));
      var foot = h("small", { class: "hint", text: (pl.counts ? num(pl.voters) + " kişi oy verdi" : "Sonuçlar oy verdikten sonra görünür") + (pl.closesAt ? " · " + (pl.closed ? "Sona erdi" : AVF.fmtDateTime(pl.closesAt) + " tarihinde sona erer") : "") });
      if (pl.counts && (pl.mine || pl.closed)) {
        AVF.mount(box, head, h("ul", { class: "fo-pr" }, pl.options.map(function (o, i) {
          var pct = total ? Math.round(pl.counts[i] / total * 100) : 0, mine = pl.mine && pl.mine.indexOf(i) >= 0;
          return h("li", { class: mine ? "mine" : "" }, h("div", { class: "fo-prb", style: "--w:" + pct + "%" }), h("span", { class: "fo-prt", "data-notr": "" }, mine ? AVF.icon("check") : null, h("span", { text: o })), h("b", { text: "%" + pct }), h("small", { text: num(pl.counts[i]) + " oy" }));
        })), foot, !pl.closed && pl.mine ? h("button", { class: "fo-lnk", type: "button", onclick: function () { pl.mine = null; pl.counts = null; paintVote(pl); } }, "Oyumu değiştir") : null);
      } else paintVote(pl);
      function paintVote(pl) {
        var picks = [];
        var form = h("div", { class: "fo-pv" }, pl.options.map(function (o, i) {
          var inp = h("input", { type: pl.multi ? "checkbox" : "radio", name: "pv-" + t.id, value: String(i) });
          inp.addEventListener("change", function () { picks = [].slice.call(form.querySelectorAll("input:checked")).map(function (x) { return Number(x.value); }); });
          return h("label", { class: "fo-po" }, inp, h("span", { "data-notr": "", text: o }));
        }));
        var vb = h("button", { class: "btn sm", type: "button" }, AVF.icon("check", "bico"), "Oy ver"), m = h("small", { class: "fo-cmsg" });
        vb.onclick = function () { if (!picks.length) { m.textContent = "Bir seçenek işaretleyin."; return; } AVF.busy(vb, true); api("POST", "/t/" + t.id + "/vote", { choices: picks }).then(function (x) { paint(x); }, function (e) { AVF.busy(vb, false); m.textContent = AVF.errText(e); }); };
        AVF.mount(box, head, form, h("div", { class: "row" }, vb, m), foot);
      }
    }
    paint(pl);
    return box;
  }
  function postCard(p, n, ctx) {
    var r = ctx.r, t = r.topic, a = p.author || {}, accepted = t.acceptedPostId === p.id;
    var el = h("article", { class: "fo-p card" + (p.hidden ? " hid" : "") + (accepted ? " best" : "") + (p.own ? " own" : ""), id: "m-" + p.id });
    var aside = h("div", { class: "fo-pa" }, avatar(a, "lg"), h("div", { class: "fo-pai" }, uname(a, "fo-un b"), lvl(a.level),
      a.username ? h("small", { class: "fo-pas" }, h("span", { text: num(a.stats && a.stats.posts || 0) + " mesaj" }), h("span", { text: num(a.stats && a.stats.likes || 0) + " beğeni" })) : null,
      a.online ? h("small", { class: "fo-onl" }, h("i", { "aria-hidden": "true" }), h("span", { text: "Çevrimiçi" })) : null));
    var headR = h("div", { class: "fo-phr" }, p.first ? chip(null, "Konu sahibi", "op") : null, accepted ? chip("check", "En iyi yanıt", "ok") : null,
      p.editedAt ? h("small", { class: "fo-ed", title: AVF.fmtDateTime(p.editedAt) }, AVF.icon("pen"), h("span", { text: p.editedByMod ? "Moderatör düzenledi" : "Düzenlendi" })) : null,
      h("a", { class: "fo-pn", href: "/forum/konu/" + t.id + "?m=" + p.id, title: "Bu mesajın bağlantısı", onclick: function (e) { e.preventDefault(); copy(location.origin + "/forum/konu/" + t.id + "?m=" + p.id); } }, "#" + n));
    var head = h("div", { class: "fo-ph2" }, h("div", { class: "fo-pmob" }, avatar(a, "sm"), h("div", null, uname(a, "fo-un b"), lvl(a.level))), timeEl(p.createdAt), headR);
    var body;
    if (p.hidden && !p.body) body = h("p", { class: "fo-hidn" }, AVF.icon(p.hiddenBy === "author" ? "trash" : "shield"), h("span", { text: p.hiddenBy === "author" ? "Bu mesaj yazarı tarafından silindi." : "Bu mesaj kurallara aykırı bulunduğu için moderatör tarafından kaldırıldı." }));
    else body = h("div", null, p.hidden ? h("p", { class: "note err fo-modn" }, AVF.icon("eyeoff", "bico"), h("span", { text: (p.hiddenBy === "author" ? "Yazarı sildi" : "Kaldırıldı") + (p.hiddenReason ? " · Gerekçe: " + p.hiddenReason : "") + " — yalnız moderatörler görüyor." })) : null,
      AVF.forumFormat(p.body, ctx.jump),
      p.images.length ? h("div", { class: "fo-gal n" + Math.min(p.images.length, 4) }, p.images.map(function (id, i) { return h("button", { type: "button", class: "fo-gi", "aria-label": "Görseli büyüt", onclick: function () { lightbox(p.images, i); } }, h("img", { src: "/api/board/img/" + id, alt: "", loading: "lazy", decoding: "async" })); })) : null,
      !p.hidden && (a.signature || a.sigImageId) ? h("div", { class: "fo-sig" }, a.signature ? h("p", { "data-notr": "", text: a.signature }) : null, a.sigImageId ? h("img", { src: "/api/forum/media/" + a.sigImageId, alt: "", loading: "lazy" }) : null) : null);
    // eylemler
    var acts = h("div", { class: "fo-acts" });
    function paintActs() {
      if (p.hidden && !r.me.mod) return AVF.mount(acts, null);
      var like = h("button", { type: "button", class: "fo-ab rx" + (p.myReaction === 1 ? " on" : ""), "aria-pressed": String(p.myReaction === 1), title: p.own ? "Kendi mesajınız" : "Beğen", disabled: p.own || p.hidden ? "" : null }, AVF.icon("like"), h("b", { text: num(p.likes) }));
      var dis = h("button", { type: "button", class: "fo-ab rx neg" + (p.myReaction === -1 ? " on" : ""), "aria-pressed": String(p.myReaction === -1), title: p.own ? "Kendi mesajınız" : "Beğenme", disabled: p.own || p.hidden ? "" : null }, AVF.icon("dislike"), h("b", { text: num(p.dislikes) }));
      function react(v) { var nv = p.myReaction === v ? 0 : v; api("POST", "/posts/" + p.id + "/react", { value: nv }).then(function (x) { p.likes = x.likes; p.dislikes = x.dislikes; p.myReaction = x.myReaction; paintActs(); }, function (e) { AVF.toast(AVF.errText(e), "err"); }); }
      like.onclick = function () { react(1); }; dis.onclick = function () { react(-1); };
      var quote = r.canReply && !p.hidden ? h("button", { type: "button", class: "fo-ab", onclick: function () {
        if (!ctx.composer) return;
        var sel = String(window.getSelection ? window.getSelection() : "").trim(), txt = sel && el.contains(window.getSelection().anchorNode) ? sel : p.body.replace(/\[alinti=[^\]]*\][\s\S]*?\[\/alinti\]/g, "").trim();
        if (txt.length > 600) txt = txt.slice(0, 600) + "…";
        ctx.composer.insert("[alinti=" + a.username + "#" + p.id + "]" + txt + "[/alinti]\n");
        document.getElementById("yanit").scrollIntoView({ behavior: "smooth", block: "center" });
      } }, AVF.icon("quote"), h("span", { text: "Alıntıla" })) : null;
      var reply = r.canReply && !p.hidden && a.username && !p.own ? h("button", { type: "button", class: "fo-ab", onclick: function () { ctx.composer.insert("@" + a.username + " "); document.getElementById("yanit").scrollIntoView({ behavior: "smooth", block: "center" }); } }, AVF.icon("reply"), h("span", { text: "Yanıtla" })) : null;
      var best = r.canAccept && !p.first && !p.hidden ? h("button", { type: "button", class: "fo-ab" + (t.acceptedPostId === p.id ? " on ok" : ""), onclick: function () {
        api("POST", "/t/" + t.id + "/accept", { postId: t.acceptedPostId === p.id ? null : p.id }).then(function () { ctx.reload(); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
      } }, AVF.icon("check"), h("span", { text: t.acceptedPostId === p.id ? "En iyi yanıt seçimini kaldır" : "En iyi yanıt seç" })) : null;
      var mark = !p.hidden ? h("button", { type: "button", class: "fo-ab ic" + (p.bookmarked ? " on" : ""), title: p.bookmarked ? "Kaydedildi" : "Kaydet", "aria-label": p.bookmarked ? "Kaydedildi" : "Kaydet", "aria-pressed": String(!!p.bookmarked), onclick: function () {
        api("POST", "/posts/" + p.id + "/bookmark", { on: !p.bookmarked }).then(function () { p.bookmarked = !p.bookmarked; AVF.toast(p.bookmarked ? "Mesaj kaydedildi." : "Kayıt kaldırıldı."); paintActs(); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
      } }, AVF.icon("bookmark")) : null;
      var more = h("button", { type: "button", class: "fo-ab ic", title: "Diğer", "aria-label": "Diğer işlemler", "aria-haspopup": "true", onclick: function (e) { postMenu(e.currentTarget, p, ctx); } }, AVF.icon("more"));
      AVF.mount(acts, h("div", { class: "fo-rx" }, like, dis), h("div", { class: "fo-ax" }, best, quote, reply, mark, more));
    }
    paintActs();
    el.appendChild(aside); el.appendChild(h("div", { class: "fo-pc" }, head, body, acts));
    return el;
  }
  function menu(anchor, items) {
    var old = document.querySelector(".fo-menu"); if (old) old.remove();
    var m = h("div", { class: "fo-menu", role: "menu" }, items.filter(Boolean).map(function (x) {
      return h("button", { type: "button", role: "menuitem", class: x[3] || "", onclick: function () { close(); x[2](); } }, AVF.icon(x[0]), h("span", { text: x[1] }));
    }));
    function close() { m.remove(); document.removeEventListener("pointerdown", away, true); document.removeEventListener("keydown", esc, true); }
    function away(e) { if (!m.contains(e.target) && e.target !== anchor) close(); }
    function esc(e) { if (e.key === "Escape") { close(); anchor.focus(); } }
    document.body.appendChild(m);
    var b = anchor.getBoundingClientRect(), w = m.offsetWidth, x = Math.min(window.innerWidth - w - 10, Math.max(10, b.right - w)), y = b.bottom + 6;
    if (y + m.offsetHeight > window.innerHeight - 10) y = Math.max(10, b.top - m.offsetHeight - 6);
    m.style.left = x + "px"; m.style.top = y + "px";
    setTimeout(function () { document.addEventListener("pointerdown", away, true); document.addEventListener("keydown", esc, true); var f = m.querySelector("button"); if (f) f.focus(); }, 0);
  }
  function postMenu(anchor, p, ctx) {
    var r = ctx.r, t = r.topic, me = r.me, a = p.author || {};
    menu(anchor, [
      p.canEdit ? ["pen", "Düzenle", function () { editPost(p, ctx); }] : null,
      (p.own || me.mod) && p.editedAt ? ["clock", "Düzenleme geçmişi", function () { history_(p); }] : null,
      p.own && !p.hidden ? ["trash", p.first ? "Konuyu sil" : "Mesajı sil", function () {
        AVF.confirmDialog({ icon: "trash", danger: true, title: p.first ? "Konu silinsin mi?" : "Mesaj silinsin mi?", text: p.first ? "Konunuz forumdan kaldırılır. Bu işlem geri alınamaz." : "Mesajınız kaldırılır; yerinde “silindi” yazar.", confirm: "Evet, sil", cancel: "Vazgeç" }).then(function (y) {
          if (!y) return; api("DELETE", "/posts/" + p.id).then(function (x) { AVF.toast("Silindi."); if (x.topicDeleted) go("/forum/k/" + r.category.slug); else ctx.reload(); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
        });
      }, "danger"] : null,
      !p.own && !p.hidden ? ["flag", "Şikâyet et", function () { report(p); }] : null,
      ["link", "Bağlantıyı kopyala", function () { copy(location.origin + "/forum/konu/" + t.id + "?m=" + p.id); }],
      me.mod ? (p.hidden ? ["eye", "Geri getir", function () { modPost(p, "restore", ctx); }] : ["eyeoff", "Kaldır (moderasyon)", function () { modPost(p, "hide", ctx); }, "danger"]) : null,
      me.mod && a.username && !p.own ? ["lock", "Forumdan uzaklaştır", function () { banDialog(a.username); }, "danger"] : null,
    ]);
  }
  function editPost(p, ctx) {
    var el = document.getElementById("m-" + p.id), pc = el.querySelector(".fo-pc"), old = [].slice.call(pc.childNodes);
    var tIn = p.first ? AVF.input("text", { maxlength: "120", value: ctx.r.topic.title, "aria-label": "Başlık" }) : null;
    var reason = ctx.r.me.mod && !p.own ? AVF.input("text", { maxlength: "200", placeholder: "Düzenleme gerekçesi (üyeye bildirilir)", "aria-label": "Gerekçe" }) : null;
    var c = composer({ value: p.body, images: p.images, submitText: "Kaydet", reset: false,
      onCancel: function () { AVF.mount(pc, old); },
      onSubmit: function (body, images) { return api("PATCH", "/posts/" + p.id, { body: body, images: images, title: tIn ? tIn.value.trim() : undefined, reason: reason ? reason.value.trim() : undefined }).then(function () { AVF.toast("Mesaj güncellendi."); ctx.reload(); }); } });
    AVF.mount(pc, h("div", { class: "fo-edit" }, h("h3", null, AVF.icon("pen"), h("span", { text: p.first ? "Konuyu düzenle" : "Mesajı düzenle" })), tIn ? h("label", { class: "fld" }, h("span", { text: "Başlık" }), tIn) : null, reason, c));
    c.textarea.focus();
  }
  function history_(p) {
    api("GET", "/posts/" + p.id + "/history").then(function (rows) {
      dialog({ icon: "clock", title: "Düzenleme geçmişi", confirm: "Kapat", cancel: "Geri", body: h("ol", { class: "fo-hist" }, rows.map(function (x) {
        return h("li", null, h("small", null, h("span", { text: AVF.fmtDateTime(x.at) + (x.editor ? " · @" + x.editor : "") }), x.reason ? h("span", { text: " · Gerekçe: " + x.reason }) : null), x.title ? h("b", { "data-notr": "", text: "Eski başlık: " + x.title }) : null, h("pre", { "data-notr": "", text: x.body }));
      })) });
    }, function (e) { AVF.toast(AVF.errText(e), "err"); });
  }
  function report(p) {
    var sel = h("div", { class: "fo-rr" }, (S.reasons || []).map(function (x, i) { return h("label", { class: "fo-po" }, h("input", { type: "radio", name: "rr", value: x[0], checked: i === 0 ? "" : null }), h("span", { text: x[1] })); }));
    var nt = h("textarea", { class: "inp", rows: "2", maxlength: "300", placeholder: "Ek açıklama (isteğe bağlı)", "aria-label": "Açıklama" });
    dialog({ icon: "flag", title: "Mesajı şikâyet et", text: "Şikâyetiniz moderatörlere iletilir; kim olduğunuz mesajın yazarına gösterilmez.", body: h("div", { class: "fo-dfrm" }, sel, nt), confirm: "Şikâyet et",
      onConfirm: function () { var v = sel.querySelector("input:checked"); return api("POST", "/posts/" + p.id + "/report", { reason: v ? v.value : "", note: nt.value }).then(function (x) { AVF.toast(x.already ? "Bu mesajı zaten şikâyet ettiniz." : "Şikâyetiniz alındı. Teşekkür ederiz."); }); } });
  }
  function modPost(p, action, ctx) {
    if (action === "restore") return api("POST", "/posts/" + p.id + "/mod", { action: "restore" }).then(function () { AVF.toast("Mesaj geri getirildi."); ctx.reload(); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
    var rs = AVF.input("text", { maxlength: "200", placeholder: "Gerekçe (üyeye bildirilir)", "aria-label": "Gerekçe" });
    dialog({ icon: "eyeoff", danger: true, title: "Mesaj kaldırılsın mı?", text: "Mesaj üyelerden gizlenir; yazarın sayaçlarından düşülür ve yazar bilgilendirilir.", body: rs, confirm: "Kaldır",
      onConfirm: function () { if (!rs.value.trim()) { rs.focus(); return false; } return api("POST", "/posts/" + p.id + "/mod", { action: "hide", reason: rs.value.trim() }).then(function () { AVF.toast("Mesaj kaldırıldı."); ctx.reload(); }); } });
  }
  function topicModMenu(r) {
    var t = r.topic, act = function (a, extra, msg) { return api("POST", "/t/" + t.id + "/mod", Object.assign({ action: a }, extra || {})).then(function () { AVF.toast(msg || "İşlem tamamlandı."); topicPage(t.id); }, function (e) { AVF.toast(AVF.errText(e), "err"); }); };
    var anchor = document.querySelector(".fo-tha .btn:last-child");
    menu(anchor, [
      [t.pinned ? "x" : "pushpin", t.pinned ? "Sabitlemeyi kaldır" : "Sabitle", function () { act(t.pinned ? "unpin" : "pin", null, t.pinned ? "Sabitleme kaldırıldı." : "Konu sabitlendi."); }],
      [t.locked ? "unlock" : "lock", t.locked ? "Kilidi aç" : "Kilitle", function () { act(t.locked ? "unlock" : "lock", null, t.locked ? "Konu yanıtlara açıldı." : "Konu kilitlendi."); }],
      ["compass", "Başka kategoriye taşı", function () {
        var s = h("select", { class: "inp", "aria-label": "Kategori" }, S.cats.map(function (c) { var o = h("option", { value: c.slug, text: c.name }); if (c.slug === r.category.slug) o.selected = true; return o; }));
        dialog({ icon: "compass", title: "Konuyu taşı", body: s, confirm: "Taşı", onConfirm: function () { return api("POST", "/t/" + t.id + "/mod", { action: "move", category: s.value }).then(function () { AVF.toast("Konu taşındı."); topicPage(t.id); }); } });
      }],
      [t.kind === "question" ? "msg" : "help", t.kind === "question" ? "Tartışmaya çevir" : "Soruya çevir", function () { act("kind", { kind: t.kind === "question" ? "discussion" : "question" }); }],
      t.hidden ? ["eye", "Konuyu geri getir", function () { act("restore", null, "Konu yeniden yayında."); }] : ["eyeoff", "Konuyu kaldır", function () {
        var rs = AVF.input("text", { maxlength: "200", placeholder: "Gerekçe (üyeye bildirilir)", "aria-label": "Gerekçe" });
        dialog({ icon: "eyeoff", danger: true, title: "Konu kaldırılsın mı?", body: rs, confirm: "Kaldır", onConfirm: function () { if (!rs.value.trim()) { rs.focus(); return false; } return api("POST", "/t/" + t.id + "/mod", { action: "hide", reason: rs.value.trim() }).then(function () { AVF.toast("Konu kaldırıldı."); topicPage(t.id); }); } });
      }, "danger"],
    ]);
  }
  function banDialog(username, after) {
    var hrs = h("select", { class: "inp", "aria-label": "Süre" }, [["1", "1 saat"], ["24", "1 gün"], ["72", "3 gün"], ["168", "1 hafta"], ["720", "30 gün"], ["2160", "90 gün"]].concat(S.me && S.me.admin ? [["perm", "Kalıcı"]] : []).map(function (x) { return h("option", { value: x[0], text: x[1] }); }));
    hrs.value = "24";
    var rs = AVF.input("text", { maxlength: "200", placeholder: "Gerekçe (üyeye bildirilir)", "aria-label": "Gerekçe" });
    dialog({ icon: "lock", danger: true, title: "@" + username + " forumdan uzaklaştırılsın mı?", text: "Üye forumu okumaya devam eder ama yazamaz, tepki veremez. Siteye girişi etkilenmez.", body: h("div", { class: "fo-dfrm" }, hrs, rs), confirm: "Uzaklaştır",
      onConfirm: function () { if (!rs.value.trim()) { rs.focus(); return false; } return api("POST", "/mod/ban/" + username, hrs.value === "perm" ? { permanent: true, reason: rs.value.trim() } : { hours: Number(hrs.value), reason: rs.value.trim() }).then(function () { AVF.toast("@" + username + " forumdan uzaklaştırıldı."); if (after) after(); }); } });
  }

  // ------------------------------------------------------------------ yeni konu
  function newTopic() {
    title("Yeni konu");
    var Q = qs(), allowed = (S.cats || []).filter(function (c) { return S.me.mod || (c.kind !== "announce" && !c.isLocked); });
    var cat = h("select", { class: "inp", "aria-label": "Kategori" }, [h("option", { value: "", text: "Kategori seçin" })].concat(allowed.map(function (c) { var o = h("option", { value: c.slug, text: c.name }); if (c.slug === Q.k) o.selected = true; return o; })));
    var kind = "discussion", kq = h("div", { class: "fo-kind", role: "radiogroup", "aria-label": "Konu türü" });
    function paintKind() { AVF.mount(kq, [["discussion", "msg", "Tartışma", "Fikir, deneyim veya günlük paylaşın"], ["question", "help", "Soru", "Yanıtlar arasından en iyisini seçersiniz"]].map(function (x) { return h("button", { type: "button", role: "radio", "aria-checked": String(kind === x[0]), class: kind === x[0] ? "on" : "", onclick: function () { kind = x[0]; paintKind(); } }, AVF.icon(x[1]), h("b", { text: x[2] }), h("small", { text: x[3] })); })); }
    paintKind();
    var tIn = AVF.input("text", { maxlength: "120", placeholder: "Konuyu özetleyen açık bir başlık", "aria-label": "Başlık" }), tc = h("small", { class: "fo-cnt" });
    var DKEY = "avf_fd_" + (AVF.session.user ? AVF.session.user.id : "x") + "_newtitle";
    try { tIn.value = localStorage.getItem(DKEY) || ""; } catch (e) { /* yok */ }
    tIn.addEventListener("input", function () { tc.textContent = tIn.value.length + " / 120"; try { localStorage.setItem(DKEY, tIn.value); } catch (e) { /* yok */ } });
    tc.textContent = tIn.value.length + " / 120";
    // anket
    var pollOn = false, pq = AVF.input("text", { maxlength: "140", placeholder: "Anket sorusu", "aria-label": "Anket sorusu" }), opts = h("div", { class: "fo-popts" }), multi = h("input", { type: "checkbox" }), days = h("select", { class: "inp sm", "aria-label": "Süre" }, [["0", "Süresiz"], ["1", "1 gün"], ["3", "3 gün"], ["7", "1 hafta"], ["14", "2 hafta"], ["30", "30 gün"]].map(function (x) { return h("option", { value: x[0], text: x[1] }); }));
    function addOpt(v) { if (opts.children.length >= 6) return; var i = AVF.input("text", { maxlength: "80", placeholder: "Seçenek " + (opts.children.length + 1), "aria-label": "Seçenek" }); i.value = v || ""; opts.appendChild(h("div", { class: "fo-popt" }, i, h("button", { type: "button", class: "fb-x", "aria-label": "Seçeneği kaldır", onclick: function (e) { if (opts.children.length > 2) e.currentTarget.parentNode.remove(); } }, AVF.icon("x")))); }
    addOpt(); addOpt();
    var pollBox = h("div", { class: "fo-pollb", hidden: "" }, pq, opts, h("div", { class: "row" }, h("button", { type: "button", class: "btn ghost sm", onclick: function () { addOpt(); } }, AVF.icon("plus", "bico"), "Seçenek ekle"), h("label", { class: "fo-chk" }, multi, h("span", { text: "Birden fazla seçilebilir" })), days));
    var pollT = h("button", { type: "button", class: "btn ghost sm", onclick: function () { pollOn = !pollOn; pollBox.hidden = !pollOn; pollT.lastChild.textContent = pollOn ? "Anketi kaldır" : "Anket ekle"; } }, AVF.icon("chart", "bico"), h("span", { text: "Anket ekle" }));
    var comp = composer({ draftKey: "new", placeholder: "Ayrıntıları yazın: hedefiniz, denediğiniz şeyler, sorunuz…", submitText: "Konuyu yayınla", reset: false,
      extra: h("div", { class: "fo-pollw" }, h("div", { class: "fo-ntx" }, pollT), pollBox),
      onSubmit: function (body, images) {
        var poll = pollOn ? { question: pq.value.trim(), options: [].slice.call(opts.querySelectorAll("input")).map(function (i) { return i.value.trim(); }).filter(Boolean), multi: multi.checked, days: Number(days.value) } : undefined;
        return api("POST", "/topics", { category: cat.value, title: tIn.value.trim(), body: body, kind: kind, poll: poll, images: images }).then(function (x) {
          try { localStorage.removeItem(DKEY); } catch (e) { /* yok */ }
          AVF.toast("Konunuz yayınlandı."); go("/forum/konu/" + x.id);
        });
      } });
    var main = shell({ h1: "Yeni konu", crumbs: [["Yeni konu"]], noNew: true }, []);
    if (S.me.banned) return AVF.mount(main, AVF.state("lock", "Şu an konu açamazsınız", "Forumdan uzaklaştırıldınız; süre dolunca yeniden yazabilirsiniz."));
    AVF.mount(main, h("section", { class: "card fo-nt" },
      h("div", { class: "fo-ntg" }, h("label", { class: "fld" }, h("span", { text: "Kategori" }), cat), h("div", { class: "fld" }, h("span", { text: "Tür" }), kq)),
      h("label", { class: "fld" }, h("span", null, h("span", { text: "Başlık" }), tc), tIn),
      h("div", { class: "fld" }, h("span", { text: "Mesaj" }), comp),
      h("p", { class: "hint fo-ntr" }, AVF.icon("shield"), h("span", { text: "Satış, kaynak / tedarik ve iletişim bilgisi paylaşımı yasaktır. Paylaşımlar tıbbi tavsiye değildir." }), h("button", { class: "fo-lnk", type: "button", onclick: showRules }, "Kurallar"))));
    if (!Q.k) cat.focus(); else tIn.focus();
  }

  // ------------------------------------------------------------------ arama
  function searchPage() {
    var Q = qs(), q = Q.q || "", page = Number(Q.page) || 1;
    title("Arama");
    var main = shell({ h1: "Arama", sub: q ? "“" + q + "” için sonuçlar" : "", crumbs: [["Arama"]], q: q }, AVF.skeleton(3));
    if (q.trim().length < 2) return AVF.mount(main, AVF.state("search", "Ne aramak istersiniz?", "En az 2 karakterlik bir kelime yazın."));
    api("GET", "/search?q=" + encodeURIComponent(q) + "&page=" + page).then(function (r) {
      if (!r.results.length) return AVF.mount(main, AVF.state("search", "Sonuç bulunamadı", "Farklı kelimelerle yeniden deneyin."));
      AVF.mount(main, h("p", { class: "hint", text: num(r.total) + " konu bulundu" }), h("ul", { class: "fo-sr card" }, r.results.map(function (x) {
        var sn = h("p", { class: "fo-sn", "data-notr": "" }); String(x.snippet).split(/(«[^»]*»)/).forEach(function (part) { if (/^«[^»]*»$/.test(part)) sn.appendChild(h("mark", { text: part.slice(1, -1) })); else sn.appendChild(document.createTextNode(part.replace(/\[\/?alinti[^\]]*\]/g, ""))); });
        return h("li", null, h("div", { class: "fo-tt" }, lk("/forum/konu/" + x.id + "?m=" + x.postId, x.title, { class: "fo-tl", "data-notr": "" }), x.kind === "question" ? (x.solved ? chip("check", "Çözüldü", "ok") : chip("help", "Soru", "q")) : null), sn,
          h("div", { class: "fo-meta" }, lk("/forum/k/" + x.category.slug, [AVF.icon(x.category.icon), h("span", { text: x.category.name })], { class: "fo-cat" }), h("span", { text: num(x.replies) + " yanıt" }), timeEl(x.lastAt)));
      })), pager(r.page, Math.ceil(r.total / 20), function (p) { return "/forum/ara?q=" + encodeURIComponent(q) + (p > 1 ? "&page=" + p : ""); }));
    }, function (e) { AVF.mount(main, errBox(e, searchPage)); });
  }

  // ------------------------------------------------------------------ üye profili
  var SOC = { instagram: ["instagram", "https://www.instagram.com/"], tiktok: ["tiktok", "https://www.tiktok.com/@"], facebook: ["facebook", "https://www.facebook.com/"], twitter: ["xlogo", "https://x.com/"] };
  function profilePage(un) {
    title("@" + un);
    var main = shell({ h1: "@" + un, crumbs: [["Üyeler"], ["@" + un]] }, AVF.skeleton(3));
    api("GET", "/u/" + encodeURIComponent(un)).then(function (u) {
      var rel = u.relation, actions = h("div", { class: "row fo-pact" });
      function paintRel() {
        AVF.mount(actions,
          rel === "self" ? lk("/panel/forum-ayarlari", [AVF.icon("cog", "bico"), h("span", { text: "Profilimi düzenle" })], { class: "btn ghost sm" }) : null,
          rel === "none" ? h("button", { class: "btn sm", type: "button", onclick: function (e) { var b = e.currentTarget; AVF.busy(b, true); AVF.api("POST", "/friends/request", { username: u.username }).then(function (x) { rel = x.status === "friend" ? "friend" : "outgoing"; AVF.toast(rel === "friend" ? "Artık arkadaşsınız." : "Arkadaşlık isteği gönderildi."); paintRel(); }, function (er) { AVF.busy(b, false); AVF.toast(AVF.errText(er), "err"); }); } }, AVF.icon("userplus", "bico"), "Arkadaş ekle") : null,
          rel === "outgoing" ? chip("clock", "İstek gönderildi") : null,
          rel === "incoming" ? lk("/panel/arkadaslar", [AVF.icon("users", "bico"), h("span", { text: "İsteği yanıtla" })], { class: "btn sm" }) : null,
          rel === "friend" ? lk("/panel/arkadaslar/" + u.id, [AVF.icon("chat", "bico"), h("span", { text: "Mesaj gönder" })], { class: "btn sm" }) : null,
          S.me.mod && rel !== "self" ? (u.banned ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { api("DELETE", "/mod/ban/" + u.username).then(function () { AVF.toast("Forum yasağı kaldırıldı."); profilePage(un); }); } }, AVF.icon("unlock", "bico"), "Forum yasağını kaldır")
            : h("button", { class: "btn ghost sm", type: "button", onclick: function () { banDialog(u.username, function () { profilePage(un); }); } }, AVF.icon("lock", "bico"), "Forumdan uzaklaştır")) : null);
      }
      paintRel();
      var socs = Object.keys(u.socials || {}).filter(function (k) { return SOC[k]; });
      AVF.mount(main,
        h("section", { class: "card fo-prof" }, avatar(u, "xl"), h("div", { class: "fo-pi" }, h("h2", { "data-notr": "", text: "@" + u.username }), lvl(u.level, true),
          h("p", { class: "hint" }, u.online ? h("span", { class: "fo-onl" }, h("i"), h("span", { text: "Çevrimiçi" })) : null, h("span", { text: "Forumda " + AVF.fmtDate(u.forumSince) + " tarihinden beri" })),
          u.signature || u.sigImageId ? h("div", { class: "fo-sig" }, u.signature ? h("p", { "data-notr": "", text: u.signature }) : null, u.sigImageId ? h("img", { src: "/api/forum/media/" + u.sigImageId, alt: "" }) : null) : null,
          socs.length ? h("div", { class: "fo-socs" }, socs.map(function (k) { return h("a", { href: SOC[k][1] + u.socials[k], target: "_blank", rel: "noopener noreferrer nofollow", class: "fo-soc", title: k, "aria-label": k }, AVF.icon(SOC[k][0])); })) : null, actions),
          h("dl", { class: "fo-pst" }, [["Konu", u.stats.topics, "file"], ["Mesaj", u.stats.posts, "chat"], ["Beğeni", u.stats.likes, "like"], ["En iyi yanıt", u.bestAnswers, "check"]].map(function (x) { return h("div", null, AVF.icon(x[2]), h("dd", { text: num(x[1]) }), h("dt", { text: x[0] })); }))),
        h("div", { class: "fo-pcols" },
          h("section", null, h("h3", { class: "fo-h3", text: "Son konuları" }), u.topics.length ? h("ul", { class: "fo-mini card" }, u.topics.map(function (t) { return h("li", null, lk("/forum/konu/" + t.id, t.title, { "data-notr": "" }), h("small", null, h("span", { text: t.category.name + " · " + num(t.replies) + " yanıt · " }), timeEl(t.lastAt))); })) : h("p", { class: "hint", text: "Henüz konu açmadı." })),
          h("section", null, h("h3", { class: "fo-h3", text: "Son yanıtları" }), u.posts.length ? h("ul", { class: "fo-mini card" }, u.posts.map(function (p) { return h("li", null, lk("/forum/konu/" + p.topicId + "?m=" + p.id, p.title, { "data-notr": "" }), h("p", { "data-notr": "", text: p.excerpt }), h("small", null, timeEl(p.at))); })) : h("p", { class: "hint", text: "Henüz yanıt yazmadı." }))));
    }, function (e) { AVF.mount(main, e && e.status === 404 ? AVF.state("user", "Üye bulunamadı", "Bu kullanıcı adıyla bir forum üyesi yok.") : errBox(e)); });
  }

  // ------------------------------------------------------------------ kaydedilenler
  function bookmarks() {
    title("Kaydedilenler");
    var main = shell({ h1: "Kaydedilenler", sub: "Sonra okumak için kaydettiğiniz mesajlar", crumbs: [["Kaydedilenler"]] }, AVF.skeleton(3));
    api("GET", "/me/bookmarks").then(function (rows) {
      if (!rows.length) return AVF.mount(main, AVF.state("bookmark", "Kaydedilen mesaj yok", "Bir mesajın altındaki kaydet simgesine dokunarak buraya ekleyebilirsiniz."));
      AVF.mount(main, h("ul", { class: "fo-mini card" }, rows.map(function (b) {
        var li = h("li", null, lk("/forum/konu/" + b.topicId + "?m=" + b.postId, b.title, { "data-notr": "" }), h("p", { "data-notr": "", text: (b.excerpt || "").replace(/\[alinti=[^\]]*\][\s\S]*?\[\/alinti\]/g, "") }),
          h("small", null, b.author ? h("span", { "data-notr": "", text: "@" + b.author + " · " }) : null, timeEl(b.at)),
          h("button", { class: "fo-lnk", type: "button", onclick: function () { api("POST", "/posts/" + b.postId + "/bookmark", { on: false }).then(function () { li.remove(); AVF.toast("Kayıt kaldırıldı."); }); } }, "Kaldır"));
        return li;
      })));
    }, function (e) { AVF.mount(main, errBox(e, bookmarks)); });
  }

  // ------------------------------------------------------------------ moderasyon
  var RS = { spam: "Spam", abuse: "Hakaret / taciz", obscene: "Müstehcen", political: "Siyasi / ideolojik", sales: "Satış / kaynak", medical: "Tehlikeli sağlık yönlendirmesi", scam: "Dolandırıcılık", other: "Diğer" };
  function modPage() {
    if (!S.me.mod) return notFound();
    title("Moderasyon");
    var tab = qs().t || "open";
    var tabs = [["open", "Açık şikâyetler"], ["upheld", "Haklı bulunanlar"], ["dismissed", "Reddedilenler"], ["bans", "Forum yasakları"]].concat(S.me.admin ? [["cats", "Kategoriler"]] : []);
    var box = h("div");
    var main = shell({ h1: "Moderasyon", crumbs: [["Moderasyon"]], noNew: true }, [h("div", { class: "fo-tabs2", role: "tablist" }, tabs.map(function (x) {
      return h("button", { type: "button", role: "tab", class: x[0] === tab ? "on" : "", "aria-selected": String(x[0] === tab), onclick: function () { history.replaceState(null, "", "/forum/moderasyon?t=" + x[0]); modPage(); } }, x[1]);
    })), box]);
    void main;
    AVF.mount(box, AVF.skeleton(3));
    if (tab === "bans") return api("GET", "/mod/bans").then(function (rows) {
      AVF.mount(box, rows.length ? h("ul", { class: "fo-mini card" }, rows.map(function (b) {
        return h("li", null, lk("/forum/uye/" + b.username, "@" + b.username, { "data-notr": "" }), h("p", { text: "Gerekçe: " + (b.reason || "—") }), h("small", { text: b.permanent ? "Kalıcı" : AVF.fmtDateTime(b.until) + " tarihine kadar" }),
          h("button", { class: "btn ghost sm", type: "button", onclick: function () { api("DELETE", "/mod/ban/" + b.username).then(function () { AVF.toast("Yasak kaldırıldı."); modPage(); }); } }, AVF.icon("unlock", "bico"), "Yasağı kaldır"));
      })) : AVF.state("checks", "Aktif forum yasağı yok", ""));
    }, function (e) { AVF.mount(box, errBox(e, modPage)); });
    if (tab === "cats") return catsAdmin(box);
    api("GET", "/mod/reports?status=" + tab).then(function (rows) {
      if (!rows.length) return AVF.mount(box, AVF.state("checks", tab === "open" ? "Açık şikâyet yok" : "Kayıt yok", tab === "open" ? "Her şey yolunda görünüyor." : ""));
      AVF.mount(box, h("div", { class: "fo-mq" }, rows.map(function (x) {
        var rs = AVF.input("text", { maxlength: "200", placeholder: "Gerekçe (yazara bildirilir)", "aria-label": "Gerekçe" });
        var act = function (a, b) { AVF.busy(b, true); api("POST", "/mod/reports/" + x.postId, { action: a, reason: rs.value.trim() }).then(function () { AVF.toast(a === "uphold" ? "İçerik kaldırıldı; şikâyet edenler bilgilendirildi." : "Şikâyet reddedildi."); modPage(); }, function (e) { AVF.busy(b, false); AVF.toast(AVF.errText(e), "err"); }); };
        return h("article", { class: "card fo-mi" },
          h("div", { class: "fo-mih" }, lk("/forum/konu/" + x.topicId + "?m=" + x.postId, [AVF.icon("msg"), h("span", { "data-notr": "", text: x.title })], { class: "fo-tl" }), x.hidden ? chip("eyeoff", "Kaldırıldı", "err") : null),
          h("div", { class: "fo-meta" }, h("span", null, h("span", { text: "Yazar: " }), x.author ? lk("/forum/uye/" + x.author, "@" + x.author, { class: "fo-men" }) : h("span", { text: "silinmiş üye" })), timeEl(x.postAt), x.first ? chip(null, "Konunun ilk mesajı") : null),
          h("div", { class: "fo-mib" }, AVF.forumFormat(x.body)),
          h("ul", { class: "fo-mir" }, x.reports.map(function (rp) { return h("li", null, chip("flag", RS[rp.reason] || rp.reason, "err"), h("span", { "data-notr": "", text: (rp.by ? "@" + rp.by : "silinmiş üye") + (rp.note ? " — " + rp.note : "") }), timeEl(rp.at), rp.handledBy ? h("small", { text: "İnceleyen: @" + rp.handledBy }) : null); })),
          tab === "open" ? h("div", { class: "fo-mia" }, rs, h("div", { class: "row" },
            h("button", { class: "btn danger sm", type: "button", onclick: function (e) { act("uphold", e.currentTarget); } }, AVF.icon("eyeoff", "bico"), "Haklı bul ve kaldır"),
            h("button", { class: "btn ghost sm", type: "button", onclick: function (e) { act("dismiss", e.currentTarget); } }, AVF.icon("x", "bico"), "Reddet"),
            x.author ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { banDialog(x.author); } }, AVF.icon("lock", "bico"), "Yazarı uzaklaştır") : null)) : null);
      })));
    }, function (e) { AVF.mount(box, errBox(e, modPage)); });
  }
  function catsAdmin(box) {
    AVF.mount(box, h("div", { class: "fo-mq" }, S.cats.map(function (c) {
      var nm = AVF.input("text", { maxlength: "60", value: c.name, "aria-label": "Ad" }), ds = AVF.input("text", { maxlength: "240", value: c.description, "aria-label": "Açıklama" });
      var nt = h("textarea", { class: "inp", rows: "2", maxlength: "400", placeholder: "Kategori başında sabit uyarı (isteğe bağlı)", "aria-label": "Uyarı" }); nt.value = c.notice || "";
      var ml = h("select", { class: "inp sm", "aria-label": "Konu açma seviyesi" }, [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { var o = h("option", { value: String(n), text: n === 1 ? "Herkes konu açabilir" : n + ". seviye ve üstü" }); if (n === c.minLevel) o.selected = true; return o; }));
      var lc = h("input", { type: "checkbox" }); lc.checked = !!c.isLocked;
      var sv = h("button", { class: "btn sm", type: "button" }, AVF.icon("save", "bico"), "Kaydet");
      sv.onclick = function () { AVF.busy(sv, true); api("PUT", "/mod/categories/" + c.id, { name: nm.value, description: ds.value, notice: nt.value, minLevel: Number(ml.value), isLocked: lc.checked }).then(function (x) { Object.assign(c, x); AVF.busy(sv, false); AVF.toast("Kategori kaydedildi."); }, function (e) { AVF.busy(sv, false); AVF.toast(AVF.errText(e), "err"); }); };
      return h("article", { class: "card fo-mi" }, h("div", { class: "fo-mih" }, h("span", { class: "tile" }, AVF.icon(c.icon)), h("b", { text: c.slug })), h("label", { class: "fld" }, h("span", { text: "Ad" }), nm), h("label", { class: "fld" }, h("span", { text: "Açıklama" }), ds), h("label", { class: "fld" }, h("span", { text: "Sabit uyarı" }), nt),
        h("div", { class: "row" }, ml, h("label", { class: "fo-chk" }, lc, h("span", { text: "Yeni konu ve yanıtlara kapalı" })), sv));
    })));
  }

  function notFound() { shell({ h1: "Bulunamadı", crumbs: [] }, AVF.state("msg", "Sayfa bulunamadı", "Aradığınız forum sayfası yok.", lk("/forum", "Foruma dön", { class: "btn" }))); }

  // ------------------------------------------------------------------ giriş kapısı ve yönlendirme
  function gateRules(view, rules, again) {
    AVF.mount(view, h("section", { class: "fo-band", "data-norv": "" }, h("div", { class: "wrap" }, h("div", { class: "fo-bh" }, h("h1", { text: "Forum" }), h("p", { text: "Foruma ilk girişinizde kuralları onaylamanız gerekir." })))),
      h("div", { class: "wrap fo-wrap", "data-norv": "" }, (function () {
        var cb = h("input", { type: "checkbox" }), ok = h("button", { class: "btn", type: "button", disabled: "" }, AVF.icon("arrow", "bico"), "Foruma gir"), m = h("div", { class: "fo-cmsg", role: "alert" });
        cb.addEventListener("change", function () { ok.disabled = !cb.checked; });
        ok.onclick = function () { AVF.busy(ok, true); AVF.api("PUT", "/forum/me", { acceptRules: true }).then(function () { try { sessionStorage.setItem(FKEY, "1"); } catch (e) { /* yok */ } again(); }, function (e) { AVF.busy(ok, false); m.textContent = AVF.errText(e); }); };
        return h("section", { class: "card fo-gate" }, h("span", { class: "tile" }, AVF.icon("shield")), h("h2", { text: "Forum kuralları" }),
          h("ol", { class: "fo-rlist" }, rules.map(function (r) { return h("li", { text: r }); })),
          h("label", { class: "fo-chk big" }, cb, h("span", { text: "18 yaşından büyüğüm; forum kurallarını okudum ve kabul ediyorum." })), m, h("div", { class: "row" }, ok, lk("/", "Ana sayfaya dön", { class: "btn ghost" })));
      })()));
  }
  function boot(view, sub, done) {
    api("GET", "/home").then(function (r) {
      S.me = r.me; S.cats = r.categories; S.stats = r.stats;
      if (!S.rules) api("GET", "/rules").then(function (x) { S.rules = x.rules; S.reasons = x.reasons; var rl = VIEW && VIEW.querySelector(".fo-rul ul"); if (rl) AVF.mount(rl, S.rules.slice(1, 5).map(function (t) { return h("li", { text: t }); })); }, function () {});
      done(r);
    }, function (e) {
      if (e && e.data && e.data.code === "rules") return gateRules(view, e.data.rules || [], function () { AVF.pages.forum(view, sub); });
      if (e && e.data && e.data.code === "verify") return AVF.mount(view, h("div", { class: "wrap section" }, AVF.state("mail", "E-posta doğrulaması gerekli", AVF.errText(e))));
      AVF.mount(view, h("div", { class: "wrap section" }, errBox(e, function () { AVF.pages.forum(view, sub); })));
    });
  }
  AVF.forumBoard = function (view, sub) {
    VIEW = view; clearInterval(poll);
    var parts = (sub || "").split("/").filter(Boolean), first = parts[0] || "";
    var run = function (r) {
      if (r && r.categories && first === "") return home();
      if (first === "k" && parts[1]) return catPage(parts[1]);
      if (first === "konu" && parts[1]) return topicPage(parts[1]);
      if (first === "yeni") return newTopic();
      if (first === "ara") return searchPage();
      if (first === "uye" && parts[1]) return profilePage(parts[1]);
      if (first === "kaydedilenler") return bookmarks();
      if (first === "takip") { title("Takip ettiklerim"); return listPage({ title: "Takip ettiklerim", sub: "Yeni yanıtlarından haberdar olduğunuz konular", crumbs: [["Takip ettiklerim"]], filter: "watching", empty: ["bell", "Takip ettiğiniz konu yok", "Bir konunun üstündeki “Takip et” düğmesiyle ekleyebilirsiniz."] }); }
      if (first === "konularim") { title("Konularım"); return listPage({ title: "Konularım", crumbs: [["Konularım"]], filter: "mine", empty: ["file", "Henüz konu açmadınız", "“Yeni konu” ile ilk konunuzu açabilirsiniz."] }); }
      if (first === "moderasyon") return modPage();
      notFound();
    };
    // ana sayfa dışındaki sayfalarda da yan panel ve kategoriler için özet bir kez alınır (sonra bellekte)
    if (S.cats && first !== "") { run({}); boot(view, sub, function () { /* özet tazelendi */ }); return; }
    VIEW.innerHTML = ""; AVF.mount(VIEW, h("div", { class: "wrap section" }, AVF.skeleton(4)));
    boot(view, sub, run);
  };
})();
