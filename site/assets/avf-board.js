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
  var S = { me: null, cats: null, stats: null, reasons: null, rules: null, ruleIcons: null, tags: null };
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
  function avatar(a, size) { return AVF.framed(avatarEl(a, size), a && a.frame, size || "md"); }
  function avatarEl(a, size) {
    var cls = "fo-av" + (size ? " " + size : "");
    if (!a || !a.username) return h("span", { class: cls + " none", "aria-hidden": "true" }, AVF.icon("user"));
    if (a.avatarId) return h("img", { class: cls, src: "/api/forum/media/" + a.avatarId, alt: "", loading: "lazy", decoding: "async" });
    return h("span", { class: cls + " ini", "aria-hidden": "true", style: "--h:" + hue(a.username), text: a.username.charAt(0).toUpperCase() });
  }
  function lvl(l, big) {
    if (!l) return null;
    return h("span", { class: "fo-lv" + (l.official ? " off" : l.assigned ? " as" : " l" + l.n) + (big ? " big" : ""), title: l.name }, AVF.icon(l.official ? "star" : l.assigned ? "shield" : LV_ICON[Math.max(0, Math.min(7, l.n - 1))]), h("span", { text: l.name }));
  }
  // Kategori simgesi: her kategorinin kendi rengiyle canlı, degrade bir rozet
  function catTile(c, size) { return h("span", { class: "fo-ct " + (c && c.color || "slate") + (size ? " " + size : ""), "aria-hidden": "true" }, AVF.icon(c && c.icon || "msg")); }
  /** Kategori (alt kategoriler dahil) slug ile bulunur; { c, parent } */
  function findCat(slug) {
    var out = null;
    (S.cats || []).forEach(function (c) { if (c.slug === slug) out = { c: c, parent: null }; (c.children || []).forEach(function (k) { if (k.slug === slug) out = { c: k, parent: c }; }); });
    return out;
  }
  function allCats() { var a = []; (S.cats || []).forEach(function (c) { a.push(c); (c.children || []).forEach(function (k) { a.push(k); }); }); return a; }
  function tagChip(g) { return lk("/forum/etiket/" + g.slug, [AVF.icon(g.icon || "tag"), h("span", { text: g.name })], { class: "fo-tag" }); }
  /** Kurallar: madde numarası yerine simge, **kalın** vurgular korunur. */
  function ruleList(rules, icons, cls) {
    return h("ul", { class: "fo-rlist" + (cls ? " " + cls : "") }, (rules || []).map(function (r, i) {
      var t = h("span"); inline(r, []).forEach(function (n) { t.appendChild(n); });
      return h("li", null, h("span", { class: "fo-ri" }, AVF.icon((icons || S.ruleIcons || [])[i] || "check")), t);
    }));
  }
  function greet() { var hr = new Date().getHours(); return hr < 6 ? "İyi geceler" : hr < 12 ? "Günaydın" : hr < 18 ? "İyi günler" : "İyi akşamlar"; }
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
  // Herkes: **kalın** *italik* ~~çizili~~ `kod` ==vurgu== @anma bağlantı, ## başlık, ### alt başlık, - liste, 1. liste, > alıntı,
  //         [kutu=bilgi|ipucu|uyari|mizah|bilim|tehlike]…[/kutu], [tablo]a | b[/tablo], [kaynak=PMID] (PubMed), [ikon=ad], [gif=N] (mesajın N. görseli).
  // Yalnız ekip (ctx.rich): [arac=makro|tdee|…] gömülü hesaplayıcı, [gorsel=ad|açıklama] hazır infografik.
  // Hiçbir zaman HTML yorumlanmaz: her parça metin düğümü ya da bilinen bir öğe olarak kurulur.
  var URL_RE = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)/;
  var BOX = { bilgi: ["info", "Bilgi"], ipucu: ["spark", "İpucu"], uyari: ["alert", "Dikkat"], mizah: ["smile", "Mizah köşesi"], bilim: ["microscope", "Bilim ne diyor?"], tehlike: ["shield", "Önemli uyarı"], ozet: ["list", "Kısaca"] };
  var ART = /^[a-z0-9-]{2,40}$/;
  function inline(text, out) {
    // sırasıyla: bağlantı, @anma, `kod`, **kalın**, ~~üstü çizili~~, ==vurgu==, [kaynak=…], [ikon=…], *italik* / _italik_
    var re = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)|(^|[\s(])@([a-z][a-z0-9._]{1,18}[a-z0-9])\b|`([^`\n]{1,200})`|\*\*([^*\n]{1,300})\*\*|~~([^~\n]{1,300})~~|(^|[\s(])[*_]([^*_\n]{1,300})[*_](?=[\s.,!?;:)]|$)|==([^=\n]{1,300})==|\[kaynak=(\d{5,9})(?:\|([^\]\n]{1,80}))?\]|\[ikon=([a-z0-9]{1,20})\]/g;
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
      else if (m[9]) { var mk = h("mark", { class: "fo-mark" }); inline(m[9], []).forEach(function (n) { mk.appendChild(n); }); out.push(mk); }
      else if (m[10]) out.push(h("a", { href: "https://pubmed.ncbi.nlm.nih.gov/" + m[10] + "/", target: "_blank", rel: "noopener noreferrer nofollow", class: "fo-src", title: "PubMed: " + m[10] },
        AVF.icon("book"), h("span", { text: m[11] ? m[11] : "PubMed " + m[10] })));
      else if (m[12]) out.push(h("span", { class: "fo-ii" }, AVF.icon(m[12])));
      last = re.lastIndex;
    }
    if (last < text.length) out.push(document.createTextNode(text.slice(last)));
    return out;
  }
  function inl(text, el) { inline(text, []).forEach(function (n) { el.appendChild(n); }); return el; }
  var BLOCK_START = /^\s*([-*•]|\d{1,2}[.)])\s+|^>\s?|^#{2,3}\s+|^\[(kutu=[a-z]+|tablo|arac=[a-z0-9-]+|gorsel=[^\]]+|gif=\d{1,2})\]\s*$/;
  function block(text, el, ctx) {
    ctx = ctx || {};
    var lines = text.split("\n"), i = 0;
    while (i < lines.length) {
      var ln = lines[i], t = ln.trim(), mm;
      if (!t) { i++; continue; }
      if ((mm = /^(#{2,3})\s+(.{1,160})$/.exec(t))) { el.appendChild(inl(mm[2], h(mm[1].length === 2 ? "h3" : "h4", { class: "fo-h" }))); i++; continue; }
      if ((mm = /^\[kutu=([a-z]+)\]$/.exec(t)) && BOX[mm[1]]) {
        var buf0 = []; i++;
        while (i < lines.length && lines[i].trim() !== "[/kutu]") { buf0.push(lines[i]); i++; }
        i++;
        var inner0 = h("div", { class: "fo-box-b" }); block(buf0.join("\n"), inner0, ctx);
        el.appendChild(h("aside", { class: "fo-box " + mm[1] }, h("div", { class: "fo-box-h" }, h("span", { class: "fo-box-i" }, AVF.icon(BOX[mm[1]][0])), h("b", { text: BOX[mm[1]][1] })), inner0));
        continue;
      }
      if (t === "[tablo]") {
        var rows = []; i++;
        while (i < lines.length && lines[i].trim() !== "[/tablo]") { if (lines[i].trim()) rows.push(lines[i].split(/\|(?![^\[\]]*\])/).map(function (c) { return c.trim(); }));   /* köşeli parantez içindeki | ([kaynak=…|etiket]) hücre ayırıcı değildir */ i++; }
        i++;
        if (rows.length) {
          var tbl = h("table", { class: "fo-tbl" }), th = h("tr");
          rows[0].forEach(function (c) { th.appendChild(inl(c, h("th"))); });
          tbl.appendChild(h("thead", null, th));
          var tb2 = h("tbody"); rows.slice(1).forEach(function (r) { var tr = h("tr"); r.forEach(function (c, ci) { tr.appendChild(h("td", { "data-l": rows[0][ci] || "" }, inl(c, h("span", { class: "fo-td" })))); /* tek kapsayıcı: telefonda etiket | değer iki sütun kalır */ }); tb2.appendChild(tr); });
          tbl.appendChild(tb2); el.appendChild(h("div", { class: "fo-tblw" }, tbl));
        }
        continue;
      }
      if ((mm = /^\[gif=(\d{1,2})\]$/.exec(t))) {
        var gid = ctx.images && ctx.images[Number(mm[1]) - 1];
        if (gid) { if (ctx.used) ctx.used[gid] = true; el.appendChild(h("figure", { class: "fo-fig gif" }, h("img", { src: "/api/board/img/" + gid, alt: "", loading: "lazy", "data-img": gid }))); }
        i++; continue;
      }
      if ((mm = /^\[arac=([a-z0-9-]+)\]$/.exec(t))) {
        var tool = ctx.rich && AVF.toolEmbed ? AVF.toolEmbed(mm[1]) : null;
        if (tool) el.appendChild(tool); else el.appendChild(h("p", null, lk("/araclar/" + mm[1], [AVF.icon("calc", "bico"), h("span", { text: "Hesaplayıcıyı aç" })], { class: "btn ghost sm" })));
        i++; continue;
      }
      if ((mm = /^\[gorsel=([a-z0-9-]{2,40})(?:\|([^\]]{1,140}))?\]$/.exec(t))) {
        if (ctx.rich && ART.test(mm[1])) el.appendChild(h("figure", { class: "fo-fig art" }, h("img", { src: "/assets/forum/" + mm[1] + ".svg", alt: mm[2] || "", loading: "lazy" }), mm[2] ? h("figcaption", { text: mm[2] }) : null));
        i++; continue;
      }
      if (/^\s*[-*•]\s+/.test(ln)) {
        var ul = h("ul"); while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) { ul.appendChild(inl(lines[i].replace(/^\s*[-*•]\s+/, ""), h("li"))); i++; }
        el.appendChild(ul); continue;
      }
      if (/^\s*\d{1,2}[.)]\s+/.test(ln)) {
        var ol = h("ol"); while (i < lines.length && /^\s*\d{1,2}[.)]\s+/.test(lines[i])) { ol.appendChild(inl(lines[i].replace(/^\s*\d{1,2}[.)]\s+/, ""), h("li"))); i++; }
        el.appendChild(ol); continue;
      }
      if (/^>\s?/.test(ln)) {
        var bq = h("blockquote", { class: "fo-bq" }), buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
        block(buf.join("\n"), bq, ctx); el.appendChild(bq); continue;
      }
      var p = h("p"), first = true;
      while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i].trim()) && !/^\s*([-*•]|\d{1,2}[.)])\s+/.test(lines[i]) && !/^>\s?/.test(lines[i])) {
        if (!first) p.appendChild(h("br"));
        inl(lines[i], p); first = false; i++;
      }
      el.appendChild(p);
    }
  }
  /** ctx: { rich (ekip yazısı), images (mesajın görsel kimlikleri), used (satır içinde gösterilenler buraya işaretlenir) } */
  AVF.forumFormat = function (body, onQuoteJump, ctx) {
    ctx = ctx || {};
    var el = h("div", { class: "fo-body" + (ctx.rich ? " rich" : ""), "data-notr": "" }), re = /\[alinti=([a-z0-9._]{3,20})#([0-9a-f-]{36})\]([\s\S]*?)\[\/alinti\]/gi, last = 0, m;
    while ((m = re.exec(body))) {
      if (m.index > last) block(body.slice(last, m.index), el, ctx);
      var who = m[1], pid = m[2];
      var q = h("blockquote", { class: "fo-quote" }, h("div", { class: "fo-qh" }, AVF.icon("quote"), lk("/forum/uye/" + who, "@" + who, { class: "fo-men" }), h("span", { text: " yazdı:" }),
        onQuoteJump ? h("button", { type: "button", class: "fo-qj", "aria-label": "Alıntılanan mesaja git", title: "Alıntılanan mesaja git", onclick: function () { onQuoteJump(pid); } }, AVF.icon("arrow")) : null));
      var inner = h("div"); block(m[3].trim(), inner, { images: [] }); q.appendChild(inner); el.appendChild(q);
      last = re.lastIndex;
    }
    if (last < body.length) block(body.slice(last), el, ctx);
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
    var ta = h("textarea", { class: "inp fo-ta", rows: o.compact ? "4" : "8", maxlength: "10000", placeholder: o.placeholder || "Mesajını yaz…", "aria-label": "Mesaj", spellcheck: "true" });
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
    function insertAt(t) { var s0 = ta.selectionStart, e0 = ta.selectionEnd; ta.value = ta.value.slice(0, s0) + t + ta.value.slice(e0); ta.focus(); try { ta.setSelectionRange(s0 + t.length, s0 + t.length); } catch (x) { /* yok */ } ta.dispatchEvent(new Event("input", { bubbles: true })); }
    function blockIns(a, b, ph) { var s0 = ta.selectionStart, pre = s0 > 0 && ta.value.charAt(s0 - 1) !== "\n" ? "\n" : ""; wrap(pre + a, b, ph); }
    // yazı biçimi: başlık, alt başlık, vurgu, kod…
    var styleBtn = tb("", "Yazı biçimi", function () {
      menu(styleBtn, [["heading", "Başlık", function () { linePrefix("## "); }], ["type", "Alt başlık", function () { linePrefix("### "); }], ["marker", "Vurgulu (fosforlu)", function () { wrap("==", "==", "önemli"); }],
        ["pen", "Kalın", function () { wrap("**", "**", "kalın"); }], ["pen", "İtalik", function () { wrap("*", "*", "italik"); }], ["x", "Üstü çizili", function () { wrap("~~", "~~", "metin"); }], ["file", "Kod / terim", function () { wrap("`", "`", "terim"); }]], "fo-mstyle");
    }, "type");
    // semboller: tek dokunuşla imlecin olduğu yere
    var SYM = ["✓", "✗", "→", "←", "↑", "↓", "•", "★", "⚠", "♥", "±", "≈", "≠", "≤", "≥", "°", "×", "÷", "µ", "½", "¼", "¾", "∞", "…", "«", "»", "€", "₺", "💪", "🔥", "😂", "😅", "🙌", "👏", "🎯", "🏋️", "🥩", "🥦", "💊", "🧠", "😴", "📈"];
    var symBtn = tb("", "Sembol ekle", function () {
      menu(symBtn, function (close) { return h("div", { class: "fo-symg" }, SYM.map(function (c) { return h("button", { type: "button", "data-notr": "", text: c, onclick: function () { close(); insertAt(c); } }); })); }, "fo-msym");
    }, "omega");
    var boxBtn = tb("", "Bilgi kutusu", function () {
      menu(boxBtn, [["info", "Bilgi kutusu", function () { blockIns("[kutu=bilgi]\n", "\n[/kutu]\n", "Bilgi metni"); }], ["spark", "İpucu kutusu", function () { blockIns("[kutu=ipucu]\n", "\n[/kutu]\n", "İpucu"); }],
        ["alert", "Dikkat kutusu", function () { blockIns("[kutu=uyari]\n", "\n[/kutu]\n", "Dikkat edilmesi gereken"); }], ["smile", "Mizah köşesi", function () { blockIns("[kutu=mizah]\n", "\n[/kutu]\n", "Şaka bir yana…"); }]]);
    }, "info");
    var tblBtn = tb("", "Tablo", function () { blockIns("[tablo]\n", "\n[/tablo]\n", "Başlık 1 | Başlık 2\nhücre | hücre"); }, "table");
    var srcBtn = tb("", "PubMed kaynağı", function () {
      menu(srcBtn, function (close) {
        var inp = AVF.input("text", { inputmode: "numeric", placeholder: "PMID (ör. 28615996)", "aria-label": "PubMed numarası" }), lbl = AVF.input("text", { maxlength: "60", placeholder: "Görünen ad (isteğe bağlı)", "aria-label": "Görünen ad" });
        var ok = h("button", { type: "button", class: "btn sm", onclick: function () { var v = inp.value.replace(/\D/g, ""); if (v.length < 5) { inp.focus(); return; } close(); insertAt("[kaynak=" + v + (lbl.value.trim() ? "|" + lbl.value.trim().replace(/[\]|]/g, "") : "") + "]"); } }, "Ekle");
        setTimeout(function () { inp.focus(); }, 0);
        return h("div", { class: "fo-srcf" }, h("b", null, AVF.icon("book", "bico"), h("span", { text: "PubMed kaynağı ekle" })), inp, lbl, ok);
      }, "fo-msrc");
    }, "book");
    var tools = h("div", { class: "fo-tools", role: "toolbar", "aria-label": "Biçim" },
      tb("B", "Kalın (Ctrl+B)", function () { wrap("**", "**", "kalın"); }), tb("I", "İtalik (Ctrl+I)", function () { wrap("*", "*", "italik"); }), styleBtn, symBtn,
      h("span", { class: "fo-sep" }), tb("", "Alıntı", function () { linePrefix("> "); }, "quote"), tb("", "Madde listesi", function () { linePrefix("- "); }, "list"), boxBtn, tblBtn, srcBtn, tb("", "Bağlantı", function () { wrap("", "", "https://"); }, "link"),
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
      }, function (e) { AVF.busy(send, false); msg.textContent = AVF.errText(e); if (e && e.data && e.data.code === "consent" && AVF.forumConsent) AVF.forumConsent(); });
    });
    paintImages(); paintCount();
    var el = h("div", { class: "fo-comp" + (o.compact ? " compact" : "") }, tools, h("div", { class: "fo-taw" }, ta, sugg), prev, imgBox, gifBox, pick,
      o.extra || null,
      saved && !o.value ? h("small", { class: "fo-draft" }, AVF.icon("save"), h("span", { text: "Yarım kalan taslağın geri geldi, kaldığın yerden devam." })) : null,
      msg, h("div", { class: "fo-cfoot" }, h("small", { class: "fo-help", text: "**kalın**  *italik*  ==vurgu==  ## başlık  > alıntı  - liste  @kullanıcıadı  ·  Ctrl+Enter ile gönder" }), cnt, h("span", { class: "fo-cbtn" }, cancel, send)));
    el.textarea = ta;
    el.insert = function (t) { var s = ta.value; ta.value = (s && !/\n$/.test(s) ? s + "\n" : s) + t; ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (x) { /* yok */ } ta.dispatchEvent(new Event("input", { bubbles: true })); };
    el.getImages = function () { return images.slice(); };
    if (o.autofocus) setTimeout(function () { ta.focus(); }, 60);
    return el;
  }

  // ------------------------------------------------------------------ iskelet (başlık bandı + yan panel)
  // Haftanın meydan okuması: 7 gün; bugün ve bu haftanın geçmiş günleri işaretlenir; 5 gün → rozet.
  var CH_BOXES = [];   // aynı anda iki kart olabilir (masaüstü yan sütun + telefonda ana sütun): hepsi birlikte güncellenir
  function challengeCard(extra) {
    var box = h("section", { class: "card fo-ch" + (extra ? " " + extra : "") });
    CH_BOXES = CH_BOXES.filter(function (b) { return document.body.contains(b); }); CH_BOXES.push(box);
    function paint(c) { S.challenge = c; CH_BOXES.forEach(function (b) { if (b === box || document.body.contains(b)) draw(b, c); }); }
    function draw(box, c) {
      var pct = Math.min(100, Math.round(c.doneCount / c.goal * 100));
      AVF.mount(box, h("div", { class: "fo-chh" }, h("span", { class: "fo-chi" }, AVF.icon(c.icon)), h("div", null, h("small", { text: "Haftanın meydan okuması" }), h("b", { text: c.title }))),
        h("p", { class: "fo-cht", text: c.text }),
        h("div", { class: "fo-chd", role: "group", "aria-label": "Bu haftanın günleri" }, c.days.map(function (d) {
          return h("button", { type: "button", class: "fo-chday" + (d.done ? " on" : "") + (d.today ? " today" : ""), disabled: d.future || S.me.banned ? "" : null, "aria-pressed": d.done ? "true" : "false",
            title: d.future ? "Henüz gelmedi" : d.done ? "İşareti kaldır" : "Tamamladım", onclick: function () {
              AVF.api("POST", "/board/challenge/checkin", { day: d.date, done: !d.done }).then(function (n) { var had = c.earned; paint(n); if (n.earned && !had) AVF.toast("🏅 Rozet kazandın: " + n.title + "!"); }, function (er) { AVF.toast(AVF.errText(er), "err"); });
            } }, h("small", { text: d.label }), h("span", null, d.done ? AVF.icon("check") : null));
        })),
        h("div", { class: "fo-chp" }, h("span", { class: "fo-chbar" }, h("i", { style: "width:" + pct + "%" })), h("span", { text: c.earned ? "🏅 Rozet kazandın!" : c.doneCount + " / " + c.goal + " gün" })),
        h("p", { class: "hint", text: c.participants ? c.participants + " üye katıldı" + (c.finishers ? ", " + c.finishers + " üye rozeti kaptı" : "") + "." : "İlk katılan sen ol!" }));
    }
    if (S.challenge) paint(S.challenge);
    AVF.api("GET", "/board/challenge").then(paint, function () { box.remove(); });
    return box;
  }
  function shell(opts, mainKids) {
    var me = S.me, st = S.stats;
    var q = AVF.input("search", { placeholder: "Forumda ara… (yazdıkça sonuçlar gelir)", "aria-label": "Forumda ara", value: opts.q || "", autocomplete: "off" });
    var drop = h("div", { class: "fo-sdrop", role: "listbox", hidden: "" });
    var sf = h("form", { class: "fo-search", role: "search" }, AVF.icon("search"), q, h("button", { class: "btn sm", type: "submit" }, "Ara"), drop);
    sf.addEventListener("submit", function (e) { e.preventDefault(); var v = q.value.trim(); drop.hidden = true; if (v.length >= 2) go("/forum/ara?q=" + encodeURIComponent(v)); });
    // canlı arama: yazdıkça (300 ms bekleyerek) ilk sonuçlar açılır listede; arama sayfasındaysa liste yerinde güncellenir
    var lt = null, lastQ = "";
    q.addEventListener("input", function () {
      clearTimeout(lt); var v = q.value.trim();
      if (v.length < 2) { drop.hidden = true; lastQ = ""; return; }
      lt = setTimeout(function () {
        if (v === lastQ) return; lastQ = v;
        if (opts.onLive) { opts.onLive(v); return; }
        AVF.mount(drop, h("div", { class: "fo-sd-l" }, h("span", { class: "fo-spin" }), h("span", { text: "Aranıyor…" }))); drop.hidden = false;
        api("GET", "/search?q=" + encodeURIComponent(v)).then(function (r) {
          if (q.value.trim() !== v) return;
          AVF.mount(drop, r.results.length ? r.results.slice(0, 6).map(function (x) {
            return lk("/forum/konu/" + x.id + "?m=" + x.postId, [catTile(x.category, "xs"), h("span", { class: "fo-sd-t" }, h("b", { "data-notr": "", text: x.title }), h("small", { text: x.category.name + " · " + num(x.replies) + " yanıt" }))], { class: "fo-sd-i", role: "option" });
          }) : h("div", { class: "fo-sd-l" }, AVF.icon("search"), h("span", { text: "Bu kelimeyle bir şey bulamadık." })),
            r.total > 6 ? lk("/forum/ara?q=" + encodeURIComponent(v), [h("span", { text: "Tüm sonuçlar (" + num(r.total) + ")" }), AVF.icon("arrow")], { class: "fo-sd-all" }) : null);
          drop.hidden = false;
        }, function () { drop.hidden = true; });
      }, 300);
    });
    q.addEventListener("keydown", function (e) { if (e.key === "Escape") drop.hidden = true; });
    q.addEventListener("blur", function () { setTimeout(function () { if (!sf.contains(document.activeElement)) drop.hidden = true; }, 180); });
    // konum yolu: her parça tıklanabilir (son parça bulunduğun sayfa)
    var crumbs = h("nav", { class: "fo-crumbs", "aria-label": "Konum" }, lk("/forum", [AVF.icon("msg"), h("span", { text: "Forum" })]),
      (opts.crumbs || []).map(function (c, i, arr) {
        var last = i === arr.length - 1, href = c[1] || (last ? location.pathname + location.search : null);
        return [h("span", { class: "sep", "aria-hidden": "true", text: "›" }), href ? lk(href, c[0], { "data-notr": "", "aria-current": last ? "page" : null }) : h("span", { "data-notr": "", text: c[0] })];
      }));
    var newBtn = opts.noNew ? null : lk("/forum/yeni" + (opts.cat ? "?k=" + opts.cat : ""), [AVF.icon("plus", "bico"), h("span", { text: "Yeni konu aç" })], { class: "btn fo-new" + (me && me.banned ? " off" : "") });
    var band = h("section", { class: "fo-band" + (opts.color ? " c-" + opts.color : ""), "data-norv": "" }, h("div", { class: "wrap" }, h("div", { class: "fo-bt" }, crumbs, h("div", { class: "fo-bact" }, newBtn)),
      h("div", { class: "fo-bh" }, opts.icon ? catTile({ icon: opts.icon, color: opts.color }, "lg") : null, h("div", null, h("h1", { "data-notr": "", text: opts.h1 || "Forum" }), opts.sub ? h("p", { text: opts.sub }) : null)), sf));
    var nav = [["/forum/konularim", "file", "Konularım"], ["/forum/takip", "bell", "Takip ettiklerim"], ["/forum/kaydedilenler", "bookmark", "Kaydedilenler ve Beğenilenler"], ["/forum/uyeler", "users", "Üyeler"], ["/panel/forum-ayarlari", "cog", "Forum ayarları"]];
    var side = h("aside", { class: "fo-side" },
      me ? h("section", { class: "card fo-me" }, h("div", { class: "fo-meh" }, avatar({ username: me.username, avatarId: AVF.session.user && AVF.session.user.avatar_id }, "md"),
          h("div", null, h("small", { class: "fo-hi", text: greet() + " 👋" }), lk("/forum/uye/" + me.username, "@" + me.username, { class: "fo-un b", "data-notr": "" }), lvl(me.level))),
        me.banned ? h("p", { class: "note err fo-ban" }, AVF.icon("lock", "bico"), h("span", { text: me.banUntil ? "Forumdan " + AVF.fmtDateTime(me.banUntil) + " tarihine kadar uzaklaştırıldın." : "Forumdan uzaklaştırıldın." }), me.banReason ? h("small", { text: "Gerekçe: " + me.banReason }) : null) : null,
        h("nav", { class: "fo-mel" }, nav.map(function (x) {
          return lk(x[0], [AVF.icon(x[1]), h("span", { text: x[2] })], { "aria-current": location.pathname === x[0] ? "page" : null });
        }), me.mod ? lk("/forum/moderasyon", [AVF.icon("shield"), h("span", { text: "Moderasyon" }), me.openReports ? h("span", { class: "fo-cnt-b", text: String(me.openReports) }) : null], { class: "mod", "aria-current": location.pathname === "/forum/moderasyon" ? "page" : null }) : null)) : null,
      me ? challengeCard() : null,
      st ? h("section", { class: "card fo-stats" }, h("h3", null, AVF.icon("chart"), h("span", { text: "Forum nabzı" })),
        h("dl", null, [["Konu", st.topics, "file"], ["Mesaj", st.posts, "chat"], ["Üye", st.members, "users"]].map(function (x) { return h("div", null, AVF.icon(x[2]), h("dd", { text: num(x[1]) }), h("dt", { text: x[0] })); })),
        h("p", { class: "fo-on" }, h("i", { "aria-hidden": "true" }), h("span", { text: num(st.online) + " üye şu an burada" })), st.newest ? h("p", { class: "hint" }, h("span", { text: "Aramıza son katılan: " }), lk("/forum/uye/" + st.newest, "@" + st.newest, { class: "fo-men" }), h("span", { text: " — hoş geldin! 🎉" })) : null,
        lk("/forum/uyeler", [h("span", { text: "Tüm üyeleri gör" }), AVF.icon("arrow")], { class: "fo-lnk" })) : null,
      (S.tags || []).some(function (g) { return g.n > 0; }) ? h("section", { class: "card fo-tagc" }, h("h3", null, AVF.icon("hash"), h("span", { text: "Popüler etiketler" })),
        h("div", { class: "fo-tags" }, S.tags.filter(function (g) { return g.n > 0; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 14).map(tagChip))) : null,
      h("section", { class: "card fo-rul" }, h("h3", null, AVF.icon("shield"), h("span", { text: "Kısaca kurallar" })), S.rules ? ruleList(S.rules.slice(1, 5), (S.ruleIcons || []).slice(1, 5), "mini") : h("ul", { class: "fo-rlist mini" }),
        h("button", { class: "fo-lnk", type: "button", onclick: showRules }, "Tüm kurallar")));
    var consentBar = me && !me.consent ? h("div", { class: "fo-cbar", role: "note" }, AVF.icon("shield"), h("span", { text: "Forumu okuyabilirsin. Konu açmak ve yazmak için sağlık verisi açık rızası gerekir." }), h("button", { class: "btn sm", type: "button", onclick: function () { consentDialog(function () { consentBar.remove(); }); } }, "İncele ve onayla")) : null;
    AVF.mount(VIEW, band, h("div", { class: "wrap fo-wrap", "data-norv": "" }, consentBar, h("div", { class: "fo-grid" }, h("div", { class: "fo-main" }, mainKids), side)));
    return VIEW.querySelector(".fo-main");
  }
  function showRules() {
    dialog({ icon: "shield", title: "Forum kuralları", body: ruleList(S.rules || [], S.ruleIcons), confirm: "Anladım", cancel: "Kapat" });
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
    return h("li", { class: "fo-t" + (t.unread ? " unread" : "") + (t.pinned ? " pinned" : "") + (t.icon ? " has-ic" : "") },
      t.icon ? catTile({ icon: t.icon, color: t.category && t.category.color }, "sm") : avatar(t.author, "sm"),
      h("div", { class: "fo-tm" },
        h("div", { class: "fo-tt" }, t.unread ? h("i", { class: "fo-dot", title: "Okunmamış" }) : null, lk(href, t.title, { class: "fo-tl", "data-notr": "" }), t.official ? chip("star", "Ekip içeriği", "off") : null, badges),
        t.excerpt ? h("p", { class: "fo-ex", "data-notr": "", text: t.excerpt.replace(/\s+/g, " ").replace(/\*\*|~~|`|==/g, "") }) : null,
        h("div", { class: "fo-meta" }, showCat ? lk("/forum/k/" + t.category.slug, [catTile(t.category, "xs"), h("span", { text: t.category.name })], { class: "fo-cat" }) : null,
          t.author ? uname(t.author) : h("span", { class: "fo-un del", text: "silinmiş üye" }), t.author ? lvl(t.author.level) : null, timeEl(t.createdAt)),
        t.tags && t.tags.length ? h("div", { class: "fo-tags sm" }, t.tags.slice(0, 4).map(tagChip)) : null),
      h("div", { class: "fo-ts" }, h("span", { title: "Yanıt" }, AVF.icon("chat"), h("b", { text: num(t.replies) })), h("span", { title: "Görüntülenme" }, AVF.icon("eye"), h("b", { text: num(t.views) })), t.infinite ? h("span", { class: "fo-inf", title: "Ekip konusu: sınırsız beğeni" }, AVF.icon("like"), h("b", { text: "∞" })) : t.likes ? h("span", { title: "Beğeni" }, AVF.icon("like"), h("b", { text: num(t.likes) })) : null),
      h("div", { class: "fo-tlst" }, h("small", { text: t.replies ? "Son yanıt" : "Açıldı" }), lk("/forum/konu/" + t.id + "?page=last", [t.lastUser ? h("span", { "data-notr": "", text: "@" + t.lastUser }) : null, timeEl(t.lastAt)], { class: "fo-last" })));
  }
  function topicList(rows, showCat, empty) {
    if (!rows.length) return AVF.state(empty ? empty[0] : "msg", empty ? empty[1] : "Burası henüz sessiz", empty ? empty[2] : "İlk konuyu sen aç, sohbeti başlat. 💬");
    return h("ul", { class: "fo-tlist card" }, rows.map(function (t) { return topicRow(t, showCat); }));
  }

  // ------------------------------------------------------------------ ana sayfa
  function home() {
    title("Ana sayfa");
    var tabs = [["", "Son hareketler"], ["new", "Yeni konular"], ["unread", "Okunmamış"], ["unanswered", "Yanıt bekleyenler"]], cur = qs().l || "";
    var listBox = h("div", { class: "fo-latest" });
    var main = shell({ h1: "Forum", sub: "Demir, tabak ve gelişim üzerine konuşan, birbirine destek olan bir topluluk. Sor, paylaş, ilham ver." }, [
      S.me ? challengeCard("mob") : null,
      h("section", { class: "fo-cats" }, S.cats.map(function (c) {
        return h("article", { class: "fo-c card c-" + (c.color || "slate") + (c.kind === "announce" ? " ann" : "") + (c.unread ? " unread" : "") },
          catTile(c),
          h("div", { class: "fo-cm" }, h("h2", null, lk("/forum/k/" + c.slug, c.name), c.isLocked ? h("span", { class: "fo-ic", title: "Yeni konulara kapalı" }, AVF.icon("lock")) : null, c.unread ? h("span", { class: "fo-new-b", text: c.unread + " yeni" }) : null),
            h("p", { text: c.description }),
            c.children && c.children.length ? h("div", { class: "fo-subs" }, c.children.map(function (k) { return lk("/forum/k/" + k.slug, [AVF.icon(k.icon), h("span", { text: k.name }), k.unread ? h("i", { class: "fo-dot" }) : null], { class: "fo-sub" }); })) : null),
          h("div", { class: "fo-cs" }, h("div", null, h("b", { text: num(c.topics) }), h("small", { text: "konu" })), h("div", null, h("b", { text: num(c.posts) }), h("small", { text: "mesaj" }))),
          h("div", { class: "fo-cl" }, c.last ? [lk("/forum/konu/" + c.last.id + "?page=last", c.last.title, { class: "fo-cll", "data-notr": "" }), h("small", null, c.last.user ? h("span", { "data-notr": "", text: "@" + c.last.user + " · " }) : null, timeEl(c.last.at))]
            : h("small", { class: "hint", text: "Henüz konu yok" })));
      })),
      h("section", { class: "fo-sec" }, h("div", { class: "fo-sh" }, h("div", { class: "fo-tabs2", role: "tablist" }, tabs.map(function (x) {
        return h("button", { type: "button", role: "tab", class: x[0] === cur ? "on" : "", "aria-selected": String(x[0] === cur), onclick: function () { history.replaceState(history.state, "", "/forum" + (x[0] ? "?l=" + x[0] : "")); home(); } }, x[1]);
      })), h("button", { class: "fo-lnk", type: "button", onclick: function () { api("POST", "/read-all", {}).then(function () { AVF.toast("Tüm konular okundu olarak işaretlendi."); load(); }); } }, AVF.icon("checks"), h("span", { text: "Tümünü okundu say" }))), listBox)]);
    void main;
    AVF.mount(listBox, AVF.skeleton(3));
    var q = cur === "new" ? "?sort=new" : cur === "unread" ? "?filter=unread" : cur === "unanswered" ? "?filter=unanswered" : "";
    api("GET", "/topics" + q).then(function (r) {
      AVF.mount(listBox, topicList(r.topics.slice(0, 15), true, cur === "unread" ? ["checks", "Okunmamış konu yok", "Her şeye yetiştin, helal olsun! 🙌"] : null));
    }, function (e) { AVF.mount(listBox, errBox(e, home)); });
  }

  // ------------------------------------------------------------------ kategori / listeler
  function listPage(o) {
    // o: { title, crumbs, cat, filter, sub, empty }
    var Q = qs(), page = Number(Q.page) || 1, sort = Q.sort || "activity", filter = o.filter || Q.filter || "";
    var listBox = h("div"), top = h("div");
    var main = shell({ h1: o.title, sub: o.sub, crumbs: o.crumbs, cat: o.cat, icon: o.icon, color: o.color, noNew: o.noNew }, [top, listBox]);
    void main;
    AVF.mount(listBox, AVF.skeleton(4));
    var base = location.pathname, qsOf = function (p, s, f) { var a = []; if (p > 1) a.push("page=" + p); if (s && s !== "activity") a.push("sort=" + s); if (f && !o.filter) a.push("filter=" + f); return base + (a.length ? "?" + a.join("&") : ""); };
    var url = "/topics?page=" + page + "&sort=" + sort + (o.cat ? "&c=" + o.cat : "") + (o.tag ? "&tag=" + o.tag : "") + (filter ? "&filter=" + filter : "");
    api("GET", url).then(function (r) {
      if (r.category) { title(r.category.name); }
      var c = r.category;
      var srt = h("select", { class: "inp sm", "aria-label": "Sıralama" }, [["activity", "Son hareket"], ["new", "En yeni"], ["replies", "En çok yanıt"], ["likes", "En çok beğeni"], ["views", "En çok görüntülenen"]].map(function (x) { var op = h("option", { value: x[0], text: x[1] }); if (x[0] === sort) op.selected = true; return op; }));
      srt.addEventListener("change", function () { go(qsOf(1, srt.value, filter)); });
      var flt = o.filter ? null : h("div", { class: "fo-fl", role: "group", "aria-label": "Süzgeç" }, [["", "Tümü"], ["unread", "Okunmamış"], ["unanswered", "Yanıtsız"], ["questions", "Sorular"], ["unsolved", "Çözülmemiş"]].map(function (x) {
        return lk(qsOf(1, sort, x[0]), x[1], { class: x[0] === filter ? "on" : "", "aria-current": x[0] === filter ? "true" : null });
      }));
      // alt kategoriler: üst kategori sayfasında sekme (Tümü + alt başlıklar); alt kategorideyken de aynı sekmeler görünür
      var fam = c && (c.children && c.children.length ? { p: c, kids: c.children } : c.parent ? { p: c.parent, kids: (findCat(c.parent.slug) || { c: { children: [] } }).c.children || [] } : null);
      var subTabs = fam && fam.kids.length ? h("nav", { class: "fo-subt", "aria-label": "Alt başlıklar" }, lk("/forum/k/" + fam.p.slug, [AVF.icon("layers"), h("span", { text: "Tümü" })], { "aria-current": c.slug === fam.p.slug ? "page" : null }),
        fam.kids.map(function (k) { return lk("/forum/k/" + k.slug, [AVF.icon(k.icon), h("span", { text: k.name })], { "aria-current": c.slug === k.slug ? "page" : null }); })) : null;
      AVF.mount(top, subTabs, c && c.notice ? h("p", { class: "note warn fo-notice" }, AVF.icon("alert", "bico"), h("span", { text: c.notice })) : null,
        c && c.kind === "announce" && !(S.me && S.me.mod) ? h("p", { class: "note fo-notice" }, AVF.icon("info", "bico"), h("span", { text: "Bu bölümde yalnız AlpveFit ekibi konu açar; duyurular okunmak içindir." })) : null,
        h("div", { class: "fo-tbar" }, flt, h("div", { class: "fo-tbr" }, h("span", { class: "hint", text: num(r.total) + " konu" }), srt)));
      if (!r.canTopic) { var nb = VIEW.querySelector(".fo-new"); if (nb && c) nb.remove(); }
      AVF.mount(listBox, topicList(r.topics, !o.cat || (c && c.children && c.children.length), o.empty), pager(r.page, r.pages, function (p) { return qsOf(p, sort, filter); }));
      if (subTabs) AVF.stripCenter(subTabs, "fo-subt-" + (fam.p.slug));
    }, function (e) { AVF.mount(listBox, errBox(e, function () { listPage(o); })); });
  }
  function catPage(slug) {
    var f = findCat(slug); if (!f) return notFound();
    var c = f.c;
    listPage({ title: c.name, sub: c.description, crumbs: f.parent ? [[f.parent.name, "/forum/k/" + f.parent.slug], [c.name]] : [[c.name]], cat: c.slug, icon: c.icon, color: c.color });
  }
  function tagPage(slug) {
    var g = (S.tags || []).filter(function (x) { return x.slug === slug; })[0];
    if (!g) return notFound();
    title("#" + g.name);
    listPage({ title: "#" + g.name, sub: "“" + g.name + "” etiketli konular", crumbs: [["Etiketler", "/forum/etiketler"], ["#" + g.name]], tag: g.slug, icon: g.icon || "tag", color: "slate", noNew: true,
      empty: ["hash", "Bu etiketle konu yok", "Yeni bir konu açarken bu etiketi seçebilirsin."] });
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
      t.icon ? h("div", { class: "fo-th1" }, catTile({ icon: t.icon, color: c.color }, "lg"), h("h1", { "data-notr": "", text: t.title })) : h("h1", { "data-notr": "", text: t.title }),
      h("div", { class: "fo-thm" }, lk("/forum/k/" + c.slug, [catTile(c, "xs"), h("span", { text: c.name })], { class: "fo-cat" }), h("span", null, AVF.icon("clock"), timeEl(t.createdAt)),
        h("span", null, AVF.icon("chat"), h("b", { text: num(t.replies) }), h("span", { text: " yanıt" })), h("span", null, AVF.icon("eye"), h("b", { text: num(t.views) }), h("span", { text: " görüntülenme" }))),
      r.tags && r.tags.length ? h("div", { class: "fo-tags" }, r.tags.map(tagChip)) : null,
      h("div", { class: "fo-tha" }, watchBtn, share, modBtn));
    var crumbs = (r.parent ? [[r.parent.name, "/forum/k/" + r.parent.slug]] : []).concat([[c.name, "/forum/k/" + c.slug], [t.title]]);
    var main = shell({ h1: c.name, crumbs: crumbs, cat: c.slug, noNew: true, icon: c.icon, color: c.color }, []);
    var posts = h("div", { class: "fo-posts" }), compBox = h("div", { id: "yanit", class: "fo-reply" }), live = h("div", { class: "fo-live", hidden: "" });
    var hrefOf = function (p) { return "/forum/konu/" + t.id + (p > 1 ? "?page=" + p : ""); };
    AVF.mount(main, head, c.notice ? h("p", { class: "note warn fo-notice" }, AVF.icon("alert", "bico"), h("span", { text: c.notice })) : null,
      r.poll ? pollCard(t, r.poll) : null, pager(r.page, r.pages, hrefOf), posts, live, pager(r.page, r.pages, hrefOf), compBox);
    var firstUnreadShown = false;
    var ctx = { r: r, jump: function (pid) { var el = document.getElementById("m-" + pid); if (el) { el.scrollIntoView({ block: "center", behavior: "smooth" }); el.classList.add("flash"); setTimeout(function () { el.classList.remove("flash"); }, 1600); } else go("/forum/konu/" + t.id + "?m=" + pid); }, reload: function (p) { var url = "/forum/konu/" + t.id + (p ? "?page=" + p : location.search); history.replaceState(history.state, "", url); topicPage(t.id); } };
    r.posts.forEach(function (p, i) {
      if (r.firstUnread === p.id && !firstUnreadShown && i > 0) { posts.appendChild(h("div", { class: "fo-unl", role: "separator" }, h("span", { text: "Okunmamış mesajlar" }))); firstUnreadShown = true; }
      posts.appendChild(postCard(p, (r.page - 1) * 20 + i + 1, ctx));
    });
    // yanıt alanı
    var comp = null;
    if (r.canReply) {
      comp = composer({ draftKey: "t_" + t.id, placeholder: "Sen ne düşünüyorsun? Yaz bakalım… (@kullanıcıadı ile birini anabilirsin)", submitText: "Yanıtı gönder", compact: true,
        onSubmit: function (body, images) { return api("POST", "/t/" + t.id + "/posts", { body: body, images: images }).then(function (x) { AVF.toast("Yanıtın gönderildi. Eline sağlık! 💪"); history.replaceState(history.state, "", "/forum/konu/" + t.id + "?page=" + x.page + "&m=" + x.id); topicPage(t.id); }); } });
      AVF.mount(compBox, h("section", { class: "card fo-rc" }, h("h2", null, AVF.icon("reply"), h("span", { text: "Sohbete katıl" })), comp));
    } else AVF.mount(compBox, h("p", { class: "note fo-notice" }, AVF.icon("lock", "bico"), h("span", { text: r.replyBlocked || "Bu konu yorumlara kapalı." })));
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
        vb.onclick = function () { if (!picks.length) { m.textContent = "Bir seçenek işaretle."; return; } AVF.busy(vb, true); api("POST", "/t/" + t.id + "/vote", { choices: picks }).then(function (x) { paint(x); }, function (e) { AVF.busy(vb, false); m.textContent = AVF.errText(e); }); };
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
    var headR = h("div", { class: "fo-phr" }, p.first ? chip(null, "Konu sahibi", "op") : null, !p.first && p.author && p.author.expert ? chip("award", "Uzman yanıtı", "pro") : null, accepted ? chip("check", "En iyi yanıt", "ok") : null,
      p.editedAt ? h("small", { class: "fo-ed", title: AVF.fmtDateTime(p.editedAt) }, AVF.icon("pen"), h("span", { text: p.editedByMod ? "Moderatör düzenledi" : "Düzenlendi" })) : null,
      h("a", { class: "fo-pn", href: "/forum/konu/" + t.id + "?m=" + p.id, title: "Bu mesajın bağlantısı", onclick: function (e) { e.preventDefault(); copy(location.origin + "/forum/konu/" + t.id + "?m=" + p.id); } }, "#" + n));
    var head = h("div", { class: "fo-ph2" }, h("div", { class: "fo-pmob" }, avatar(a, "sm"), h("div", null, uname(a, "fo-un b"), lvl(a.level))), timeEl(p.createdAt), headR);
    var body;
    if (p.hidden && !p.body) body = h("p", { class: "fo-hidn" }, AVF.icon(p.hiddenBy === "author" ? "trash" : "shield"), h("span", { text: p.hiddenBy === "author" ? "Bu mesaj yazarı tarafından silindi." : "Bu mesaj kurallara aykırı bulunduğu için moderatör tarafından kaldırıldı." }));
    else body = h("div", null, p.hidden ? h("p", { class: "note err fo-modn" }, AVF.icon("eyeoff", "bico"), h("span", { text: (p.hiddenBy === "author" ? "Yazarı sildi" : "Kaldırıldı") + (p.hiddenReason ? " · Gerekçe: " + p.hiddenReason : "") + " — yalnız moderatörler görüyor." })) : null,
      (function () {
        // ekip yazıları zengin biçimde (gömülü araç, infografik); satır içinde gösterilen görseller altta tekrar edilmez
        var fctx = { rich: !!(a.level && (a.level.official || a.level.assigned)), images: p.images, used: {} };
        var f = AVF.forumFormat(p.body, ctx.jump, fctx);
        p.galleryImages = p.images.filter(function (id) { return !fctx.used[id]; });
        f.addEventListener("click", function (e) { var im = e.target.closest && e.target.closest("img[data-img]"); if (im) lightbox(p.images, p.images.indexOf(im.getAttribute("data-img"))); });
        return f;
      })(),
      p.galleryImages.length ? h("div", { class: "fo-gal n" + Math.min(p.galleryImages.length, 4) }, p.galleryImages.map(function (id, i) { return h("button", { type: "button", class: "fo-gi", "aria-label": "Görseli büyüt", onclick: function () { lightbox(p.galleryImages, i); } }, h("img", { src: "/api/board/img/" + id, alt: "", loading: "lazy", decoding: "async" })); })) : null,
      !p.hidden && (a.signature || a.sigImageId) ? h("div", { class: "fo-sig" }, a.signature ? h("p", { "data-notr": "", text: a.signature }) : null, a.sigImageId ? h("img", { src: "/api/forum/media/" + a.sigImageId, alt: "", loading: "lazy" }) : null) : null);
    // eylemler
    var acts = h("div", { class: "fo-acts" });
    function paintActs() {
      if (p.hidden && !r.me.mod) return AVF.mount(acts, null);
      var like = h("button", { type: "button", class: "fo-ab rx" + (p.myReaction === 1 ? " on" : ""), "aria-pressed": String(p.myReaction === 1), title: p.infinite ? "Ekip konusu: sınırsız beğeni" : p.own ? "Kendi mesajın" : "Beğen", disabled: p.own || p.hidden ? "" : null }, AVF.icon("like"), h("b", { text: p.infinite ? "∞" : num(p.likes) }));
      if (p.infinite) like.classList.add("inf");
      var dis = h("button", { type: "button", class: "fo-ab rx neg" + (p.myReaction === -1 ? " on" : ""), "aria-pressed": String(p.myReaction === -1), title: p.infinite ? "Ekip konularında beğenmeme kapalı" : p.own ? "Kendi mesajın" : "Beğenme", disabled: p.own || p.hidden || p.infinite ? "" : null }, AVF.icon("dislike"), p.infinite ? null : h("b", { text: num(p.dislikes) }));
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
  function menu(anchor, items, cls) {
    var old = document.querySelector(".fo-menu"); if (old) old.remove();
    // items: [[simge, etiket, işlev, sınıf]] ya da kapatma işlevi alıp düğüm döndüren fonksiyon (simge tablosu, kaynak ekleme…)
    var m = h("div", { class: "fo-menu" + (cls ? " " + cls : ""), role: "menu" }, typeof items === "function" ? items(function () { close(); }) : items.filter(Boolean).map(function (x) {
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
        AVF.confirmDialog({ icon: "trash", danger: true, title: p.first ? "Konu silinsin mi?" : "Mesaj silinsin mi?", text: p.first ? "Konun forumdan kaldırılır. Bu işlem geri alınamaz." : "Mesajın kaldırılır; yerinde “silindi” yazar.", confirm: "Evet, sil", cancel: "Vazgeç" }).then(function (y) {
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
    dialog({ icon: "flag", title: "Mesajı şikâyet et", text: "Şikâyetin moderatörlere iletilir; kim olduğun mesajın yazarına gösterilmez.", body: h("div", { class: "fo-dfrm" }, sel, nt), confirm: "Şikâyet et",
      onConfirm: function () { var v = sel.querySelector("input:checked"); return api("POST", "/posts/" + p.id + "/report", { reason: v ? v.value : "", note: nt.value }).then(function (x) { AVF.toast(x.already ? "Bu mesajı zaten şikâyet ettiniz." : "Şikâyetin alındı, teşekkürler! Ekibimiz bakacak."); }); } });
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
  // Yönetici şablonu (Farmakoloji ve benzeri bölümler): yalnız iskelet; metni yönetici yazar. Sonda değiştirilemeyen uyarı kutusu yer alır.
  var PHARMA_TEMPLATE = [
    "## [ikon=book] Genel bakış", "Bu bölüme kısa tanıtım yazısı gelecek.", "", "[gif=1]", "",
    "## [ikon=layers] Artılar ve eksiler", "[tablo]", "Artılar (+) | Eksiler (−)", " | ", " | ", " | ", "[/tablo]", "",
    "## [ikon=microscope] Araştırmalar ne diyor?", "- Bulgu [kaynak=PMID|Yazar Yıl]", "", "## [ikon=alert] Bilinen yan etkiler ve riskler", "- ", "",
    "## [ikon=check] Hangi kontroller yapılmalı?", "- ", "",
    "[kutu=tehlike]", "**Bu içerik bilgi amaçlıdır; kullanımı teşvik etmez ve tıbbi tavsiye değildir.** Reçeteli ilaçlar ve hormonlar yalnız hekim kontrolünde kullanılır; reçetesiz kullanım ciddi sağlık riskleri taşır ve sporda dopingtir. Satış, kaynak, doz ve kür paylaşımı bu forumda yasaktır.", "[/kutu]"
  ].join("\n");

  function newTopic() {
    title("Yeni konu");
    var Q = qs(), allowed = allCats().filter(function (c) { return S.me.mod || (c.kind !== "announce" && !c.isLocked && (S.me.level.n >= (c.minLevel || 1))); });
    // kategori: kan grubu seçicisi gibi simgeli açılır liste; alt kategoriler "Üst › Alt" olarak
    var nameOf = function (c) { var f = findCat(c.slug); return f && f.parent ? f.parent.name.split(" ")[0] + " › " + c.name : c.name; };
    var catSel = AVF.iconSelect({ label: "Kategori", icon: "layers", placeholder: "Konun hangi kategoriye ait?", value: allowed.some(function (c) { return c.slug === Q.k; }) ? Q.k : "",
      items: allowed.map(function (c) { return { value: c.slug, label: nameOf(c), icon: c.icon }; }), onChange: function () { paintCatInfo(); } });
    var catInfo = h("div", { class: "fo-catinfo" });
    function paintCatInfo() {
      var f = findCat(catSel.get()); if (!f) return AVF.mount(catInfo, null);
      AVF.mount(catInfo, h("div", { class: "fo-cati" }, catTile(f.c, "sm"), h("span", { text: f.c.description })),
        null);
    }
    var tIn = AVF.input("text", { maxlength: "120", placeholder: "Konunu tek cümlede anlat (ör. “Bulk döneminde akşam karbonhidratı sorun olur mu?”)", "aria-label": "Başlık" }), tc = h("small", { class: "fo-cnt" });
    var DKEY = "avf_fd_" + (AVF.session.user ? AVF.session.user.id : "x") + "_newtitle";
    try { tIn.value = localStorage.getItem(DKEY) || ""; } catch (e) { /* yok */ }
    tIn.addEventListener("input", function () { tc.textContent = tIn.value.length + " / 120"; try { localStorage.setItem(DKEY, tIn.value); } catch (e) { /* yok */ } });
    tc.textContent = tIn.value.length + " / 120";
    // etiketler: tanımlı listeden en fazla 5
    var picked = [], tagQ = AVF.input("search", { placeholder: "Etiket ara…", "aria-label": "Etiket ara" }), tagBox = h("div", { class: "fo-tagpick" }), tagN = h("small", { class: "fo-cnt" });
    function paintTags() {
      var qv = tagQ.value.trim().toLocaleLowerCase("tr-TR");
      AVF.mount(tagBox, (S.tags || []).filter(function (g) { return !qv || g.name.toLocaleLowerCase("tr-TR").indexOf(qv) >= 0 || picked.indexOf(g.slug) >= 0; }).map(function (g) {
        var on = picked.indexOf(g.slug) >= 0;
        return h("button", { type: "button", class: "fo-tag pick" + (on ? " on" : ""), "aria-pressed": String(on), onclick: function () {
          if (on) picked = picked.filter(function (x) { return x !== g.slug; }); else if (picked.length < 5) picked.push(g.slug); else return AVF.toast("En fazla 5 etiket seçebilirsin.");
          paintTags();
        } }, AVF.icon(g.icon || "tag"), h("span", { text: g.name }), on ? AVF.icon("check", "fo-tok") : null);
      }));
      tagN.textContent = picked.length + " / 5";
    }
    tagQ.addEventListener("input", paintTags); paintTags();
    // anket
    var pollOn = false, pq = AVF.input("text", { maxlength: "140", placeholder: "Anket sorusu", "aria-label": "Anket sorusu" }), opts = h("div", { class: "fo-popts" }), multi = h("input", { type: "checkbox" }), days = h("select", { class: "inp sm", "aria-label": "Süre" }, [["0", "Süresiz"], ["1", "1 gün"], ["3", "3 gün"], ["7", "1 hafta"], ["14", "2 hafta"], ["30", "30 gün"]].map(function (x) { return h("option", { value: x[0], text: x[1] }); }));
    function addOpt(v) { if (opts.children.length >= 6) return; var i = AVF.input("text", { maxlength: "80", placeholder: "Seçenek " + (opts.children.length + 1), "aria-label": "Seçenek" }); i.value = v || ""; opts.appendChild(h("div", { class: "fo-popt" }, i, h("button", { type: "button", class: "fb-x", "aria-label": "Seçeneği kaldır", onclick: function (e) { if (opts.children.length > 2) e.currentTarget.parentNode.remove(); } }, AVF.icon("x")))); }
    addOpt(); addOpt();
    var pollBox = h("div", { class: "fo-pollb", hidden: "" }, pq, opts, h("div", { class: "row" }, h("button", { type: "button", class: "btn ghost sm", onclick: function () { addOpt(); } }, AVF.icon("plus", "bico"), "Seçenek ekle"), h("label", { class: "fo-chk" }, multi, h("span", { text: "Birden fazla seçilebilir" })), days));
    var pollT = h("button", { type: "button", class: "btn ghost sm", onclick: function () { pollOn = !pollOn; pollBox.hidden = !pollOn; pollT.lastChild.textContent = pollOn ? "Anketi kaldır" : "Anket ekle"; } }, AVF.icon("chart", "bico"), h("span", { text: "Anket ekle" }));
    var comp = composer({ draftKey: "new", placeholder: "Ayrıntıları yaz: hedefin, denediklerin, sorunun… Ne kadar net yazarsan o kadar iyi yanıt gelir. 🙂", submitText: "Konuyu yayınla", reset: false,
      extra: h("div", { class: "fo-pollw" }, h("div", { class: "fo-ntx" }, pollT), pollBox),
      onSubmit: function (body, images) {
        if (!catSel.get()) { catSel.querySelector("button").focus(); return Promise.reject({ status: 400, data: { error: "Önce bir kategori seç." } }); }
        var poll = pollOn ? { question: pq.value.trim(), options: [].slice.call(opts.querySelectorAll("input")).map(function (i) { return i.value.trim(); }).filter(Boolean), multi: multi.checked, days: Number(days.value) } : undefined;
        return api("POST", "/topics", { category: catSel.get(), title: tIn.value.trim(), body: body, poll: poll, images: images, tags: picked, openComments: S.me.admin ? openC.checked : undefined }).then(function (x) {
          try { localStorage.removeItem(DKEY); } catch (e) { /* yok */ }
          AVF.toast("Konun yayında! Şimdi yanıtları bekle. 🚀"); go("/forum/konu/" + x.id);
        });
      } });
    // yönetici: ekip konuları sabit ve yoruma kapalı açılır; "Koça Sor" gibi konular için yoruma açık bırakılabilir. Farmakoloji için boş şablon.
    var openC = h("input", { type: "checkbox" });
    var adminBox = !S.me.admin ? null : h("div", { class: "fo-adm" },
      h("label", { class: "fo-chk" }, openC, h("span", null, h("b", { text: "Yoruma açık bırak" }), h("small", { text: "Ekip konuları sabit ve yoruma kapalı açılır. Koça Sor gibi soru-cevap konuları için işaretle." }))),
      h("button", { type: "button", class: "btn ghost sm", onclick: function () { insertTemplate(); } }, AVF.icon("table", "bico"), "Farmakoloji şablonu ekle"));
    function insertTemplate() {
      var ta = comp.querySelector("textarea"); if (!ta) return;
      ta.value = (ta.value.trim() ? ta.value.trim() + "\n\n" : "") + PHARMA_TEMPLATE; ta.dispatchEvent(new Event("input", { bubbles: true })); ta.focus();
    }
    var main = shell({ h1: "Yeni konu aç", sub: "Sorunu sor, deneyimini paylaş — topluluk burada.", crumbs: [["Yeni konu"]], noNew: true, icon: "pen", color: "lime" }, []);
    if (S.me.banned) return AVF.mount(main, AVF.state("lock", "Şu an konu açamazsın", "Forumdan uzaklaştırıldın; süre dolunca yeniden yazabilirsin."));
    function lab(icon, text, extra) { return h("span", { class: "fo-lab" }, h("span", { class: "fo-labi" }, AVF.icon(icon)), h("span", { text: text }), extra || null); }
    AVF.mount(main, h("section", { class: "card fo-nt" },
      h("div", { class: "fld" }, lab("layers", "Kategori"), catSel, catInfo,
        h("p", { class: "fo-warn" }, AVF.icon("alert"), h("span", null, h("b", { text: "Doğru kategoriyi seç: " }), h("span", { text: "kategorisiyle ilgisi olmayan konular taşınır; tekrarında hesabına ihtar verilir." })))),
      h("label", { class: "fld" }, lab("file", "Başlık", tc), tIn),
      adminBox,
      h("div", { class: "fld" }, lab("pen", "Mesaj"), comp),
      h("div", { class: "fld" }, lab("hash", "Etiketler", tagN), h("p", { class: "hint", text: "Konunu bulunur kılmak için en fazla 5 etiket seç (isteğe bağlı)." }), tagQ, tagBox),
      h("p", { class: "hint fo-ntr" }, AVF.icon("shield"), h("span", { text: "Satış, kaynak / tedarik ve iletişim bilgisi paylaşımı yasaktır. Paylaşımlar tıbbi tavsiye değildir." }), h("button", { class: "fo-lnk", type: "button", onclick: showRules }, "Kurallar"))));
    paintCatInfo();
    // etiket alanı mesajın altında: yayınla düğmesi en sonda kalsın diye kompozitörün altbilgisi en alta taşınır
    var foot = comp.querySelector(".fo-cfoot"); if (foot) main.querySelector(".fo-nt").insertBefore(foot, main.querySelector(".fo-ntr"));
    if (!Q.k) setTimeout(function () { var b = catSel.querySelector("button"); if (b) b.focus({ preventScroll: true }); }, 50); else tIn.focus({ preventScroll: true });
  }

  // ------------------------------------------------------------------ arama
  function searchPage() {
    var Q = qs(), q = Q.q || "", page = Number(Q.page) || 1, box = h("div");
    title("Arama");
    // arama sayfasında yazdıkça sonuçlar yerinde yenilenir (adres çubuğu da güncellenir)
    var main = shell({ h1: "Arama", sub: q ? "“" + q + "” için sonuçlar" : "Aklındaki kelimeyi yaz, sonuçlar yazdıkça gelsin.", crumbs: [["Arama"]], q: q, icon: "search", color: "slate",
      onLive: function (v) { history.replaceState(history.state, "", "/forum/ara?q=" + encodeURIComponent(v)); var sub = VIEW.querySelector(".fo-bh p"); if (sub) sub.textContent = "“" + v + "” için sonuçlar"; run(v, 1); } }, box);
    void main;
    var seq = 0;
    function run(qv, pg) {
      var my = ++seq;
      if (qv.trim().length < 2) return AVF.mount(box, AVF.state("search", "Ne arıyorsun?", "En az 2 harf yaz, gerisini biz bulalım."));
      AVF.mount(box, AVF.skeleton(3));
      api("GET", "/search?q=" + encodeURIComponent(qv) + "&page=" + pg).then(function (r) {
        if (my !== seq) return;
        if (!r.results.length) return AVF.mount(box, AVF.state("search", "Sonuç çıkmadı", "Farklı bir kelimeyle dene ya da yeni bir konu açıp sor. 🙂"));
        AVF.mount(box, h("p", { class: "hint", text: num(r.total) + " konu bulundu" }), h("ul", { class: "fo-sr card" }, r.results.map(function (x) {
          var sn = h("p", { class: "fo-sn", "data-notr": "" }); String(x.snippet).split(/(«[^»]*»)/).forEach(function (part) { if (/^«[^»]*»$/.test(part)) sn.appendChild(h("mark", { text: part.slice(1, -1) })); else sn.appendChild(document.createTextNode(part.replace(/\[\/?[a-z]+(=[^\]]*)?\]/g, ""))); });
          return h("li", null, h("div", { class: "fo-tt" }, lk("/forum/konu/" + x.id + "?m=" + x.postId, x.title, { class: "fo-tl", "data-notr": "" }), x.kind === "question" ? (x.solved ? chip("check", "Çözüldü", "ok") : chip("help", "Soru", "q")) : null), sn,
            h("div", { class: "fo-meta" }, lk("/forum/k/" + x.category.slug, [catTile(x.category, "xs"), h("span", { text: x.category.name })], { class: "fo-cat" }), h("span", { text: num(x.replies) + " yanıt" }), timeEl(x.lastAt)));
        })), pager(r.page, Math.ceil(r.total / 20), function (p) { return "/forum/ara?q=" + encodeURIComponent(qv) + (p > 1 ? "&page=" + p : ""); }));
      }, function (e) { if (my === seq) AVF.mount(box, errBox(e, function () { run(qv, pg); })); });
    }
    run(q, page);
    var inp = VIEW.querySelector(".fo-search input"); if (inp) { inp.focus({ preventScroll: true }); try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) { /* yok */ } }
  }

  // ------------------------------------------------------------------ üyeler (yalnız seviye, ad ve avatar)
  function membersPage() {
    title("Üyeler");
    var Q = qs(), page = Number(Q.page) || 1, qIn = AVF.input("search", { placeholder: "@kullanıcı adı ara", "aria-label": "Üye ara", value: Q.q || "", autocomplete: "off" }), box = h("div");
    var main = shell({ h1: "Üyeler", sub: "Topluluğumuz seviyelere göre — en tecrübeliler en üstte.", crumbs: [["Üyeler"]], icon: "users", color: "teal", noNew: true }, [h("div", { class: "fo-mq" }, AVF.icon("search"), qIn), box]);
    void main;
    var t0 = null, seq = 0;
    function load(q, pg) {
      var my = ++seq; AVF.mount(box, AVF.skeleton(3));
      api("GET", "/members?page=" + pg + (q ? "&q=" + encodeURIComponent(q) : "")).then(function (r) {
        if (my !== seq) return;
        if (!r.members.length) return AVF.mount(box, AVF.state("users", "Üye bulunamadı", "Kullanıcı adını kontrol edip yeniden dene."));
        // seviyelere göre gruplanır (ekip en üstte)
        var groups = [], cur = null;
        r.members.forEach(function (m) { if (!cur || cur.n !== m.level.n) { cur = { n: m.level.n, l: m.level, list: [] }; groups.push(cur); } cur.list.push(m); });
        AVF.mount(box, h("p", { class: "hint", text: num(r.total) + " üye" }), groups.map(function (g) {
          return h("section", { class: "fo-mg" }, h("h3", { class: "fo-mgh" }, lvl(g.l, true), h("small", { text: g.list.length + " üye" })),
            h("ul", { class: "fo-ml" }, g.list.map(function (m) {
              return h("li", null, lk("/forum/uye/" + m.username, [h("span", { class: "fo-mav" }, avatar(m, "md"), m.online ? h("i", { class: "fo-mon", title: "Çevrimiçi" }) : null), h("b", { "data-notr": "", text: "@" + m.username })], { class: "fo-mc card" }));
            })));
        }), pager(r.page, r.pages, function (p) { return "/forum/uyeler?" + (q ? "q=" + encodeURIComponent(q) + "&" : "") + "page=" + p; }));
      }, function (e) { if (my === seq) AVF.mount(box, errBox(e, function () { load(q, pg); })); });
    }
    qIn.addEventListener("input", function () { clearTimeout(t0); t0 = setTimeout(function () { var v = qIn.value.trim().replace(/^@/, ""); history.replaceState(history.state, "", "/forum/uyeler" + (v ? "?q=" + encodeURIComponent(v) : "")); load(v, 1); }, 250); });
    load((Q.q || "").replace(/^@/, ""), page);
  }

  // ------------------------------------------------------------------ etiketler
  function tagsIndex() {
    title("Etiketler");
    var list = (S.tags || []).slice().sort(function (a, b) { return b.n - a.n || a.name.localeCompare(b.name, "tr"); });
    shell({ h1: "Etiketler", sub: "Konuları konusuna göre keşfet.", crumbs: [["Etiketler"]], icon: "hash", color: "slate", noNew: true },
      h("div", { class: "fo-tags big card" }, list.map(function (g) { var c = tagChip(g); c.appendChild(h("em", { text: num(g.n) })); return c; })));
  }

  // ------------------------------------------------------------------ üye profili
  var SOC = { instagram: ["instagram", "https://www.instagram.com/"], tiktok: ["tiktok", "https://www.tiktok.com/@"], facebook: ["facebook", "https://www.facebook.com/"], twitter: ["xlogo", "https://x.com/"] };
  function profilePage(un) {
    title("@" + un);
    var main = shell({ h1: "@" + un, crumbs: [["Üyeler", "/forum/uyeler"], ["@" + un, "/forum/uye/" + un]], icon: "user", color: "slate", noNew: true }, AVF.skeleton(3));
    api("GET", "/u/" + encodeURIComponent(un)).then(function (u) {
      var rel = u.level && u.level.official && u.relation !== "self" ? "official" : u.relation, actions = h("div", { class: "row fo-pact" });
      function paintRel() {
        AVF.mount(actions,
          rel === "self" ? lk("/panel/forum-ayarlari", [AVF.icon("cog", "bico"), h("span", { text: "Profilimi düzenle" })], { class: "btn ghost sm" }) : null,
          rel === "official" ? h("p", { class: "hint fo-offn" }, AVF.icon("star", "bico"), h("span", { text: "AlpveFit'in resmî forum hesabı. Rehber içerikler ve duyurular buradan yayınlanır; soruların için Destek Taleplerim'i kullanabilirsin." })) : null,
          rel === "none" ? h("button", { class: "btn sm", type: "button", onclick: function (e) { var b = e.currentTarget; AVF.busy(b, true); AVF.api("POST", "/friends/request", { username: u.username }).then(function (x) { rel = x.status === "friend" ? "friend" : "outgoing"; AVF.toast(rel === "friend" ? "Artık arkadaşsınız." : "Arkadaşlık isteği gönderildi."); paintRel(); }, function (er) { AVF.busy(b, false); AVF.toast(AVF.errText(er), "err"); }); } }, AVF.icon("userplus", "bico"), "Arkadaş ekle") : null,
          rel === "outgoing" ? chip("clock", "İstek gönderildi") : null,
          rel === "incoming" ? lk("/panel/arkadaslar", [AVF.icon("users", "bico"), h("span", { text: "İsteği yanıtla" })], { class: "btn sm" }) : null,
          rel === "friend" ? lk("/panel/arkadaslar/" + u.id, [AVF.icon("chat", "bico"), h("span", { text: "Mesaj gönder" })], { class: "btn sm" }) : null,
          S.me.mod && rel !== "self" && rel !== "official" ? (u.banned ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { api("DELETE", "/mod/ban/" + u.username).then(function () { AVF.toast("Forum yasağı kaldırıldı."); profilePage(un); }); } }, AVF.icon("unlock", "bico"), "Forum yasağını kaldır")
            : h("button", { class: "btn ghost sm", type: "button", onclick: function () { banDialog(u.username, function () { profilePage(un); }); } }, AVF.icon("lock", "bico"), "Forumdan uzaklaştır")) : null);
      }
      paintRel();
      var socs = Object.keys(u.socials || {}).filter(function (k) { return SOC[k]; });
      AVF.mount(main,
        h("section", { class: "card fo-prof" }, avatar(u, "xl"), h("div", { class: "fo-pi" }, h("h2", { "data-notr": "", text: "@" + u.username }), lvl(u.level, true),
          h("p", { class: "hint" }, u.online ? h("span", { class: "fo-onl" }, h("i"), h("span", { text: "Çevrimiçi" })) : null, u.forumSince ? h("span", { text: "Forumda " + AVF.fmtDate(u.forumSince) + " tarihinden beri" }) : null),
          u.signature || u.sigImageId ? h("div", { class: "fo-sig" }, u.signature ? h("p", { "data-notr": "", text: u.signature }) : null, u.sigImageId ? h("img", { src: "/api/forum/media/" + u.sigImageId, alt: "" }) : null) : null,
          socs.length ? h("div", { class: "fo-socs" }, socs.map(function (k) { return h("a", { href: SOC[k][1] + u.socials[k], target: "_blank", rel: "noopener noreferrer nofollow", class: "fo-soc", title: k, "aria-label": k }, AVF.icon(SOC[k][0])); })) : null, actions),
          h("dl", { class: "fo-pst" }, [["Konu", u.stats.topics, "file"], ["Mesaj", u.stats.posts, "chat"], ["Beğeni", u.stats.likes, "like"], ["En iyi yanıt", u.bestAnswers, "check"]].map(function (x) { return h("div", null, AVF.icon(x[2]), h("dd", { text: num(x[1]) }), h("dt", { text: x[0] })); }))),
        h("div", { class: "fo-pcols" },
          h("section", null, h("h3", { class: "fo-h3", text: "Son konuları" }), u.topics.length ? h("ul", { class: "fo-mini card" }, u.topics.map(function (t) { return h("li", null, lk("/forum/konu/" + t.id, t.title, { "data-notr": "" }), h("small", null, h("span", { text: t.category.name + " · " + num(t.replies) + " yanıt · " }), timeEl(t.lastAt))); })) : h("p", { class: "hint", text: "Henüz konu açmadı." })),
          h("section", null, h("h3", { class: "fo-h3", text: "Son yanıtları" }), u.posts.length ? h("ul", { class: "fo-mini card" }, u.posts.map(function (p) { return h("li", null, lk("/forum/konu/" + p.topicId + "?m=" + p.id, p.title, { "data-notr": "" }), h("p", { "data-notr": "", text: p.excerpt }), h("small", null, timeEl(p.at))); })) : h("p", { class: "hint", text: "Henüz yanıt yazmadı." }))));
      if (u.badgeTotal) main.appendChild(h("section", { class: "fo-bdg" }, h("h3", { class: "fo-h3" }, AVF.icon("award", "bico"), h("span", { text: "Rozetler (" + u.badgeTotal + ")" })),
        h("div", { class: "card fo-bdgs" }, u.badges.map(function (b) { return h("div", { class: "fo-bd", title: b.label + " · " + AVF.fmtDate(b.week) + " haftası" }, h("span", { class: "fo-bdi" }, AVF.icon(b.icon)), h("b", { text: b.label }), h("small", { text: AVF.fmtDate(b.week) })); }))));
      // gelişim: seri ve üyenin bana açtığı gelişim fotoğrafları (ölçüler hiçbir zaman gösterilmez)
      var jb = h("section", { class: "fo-jr" }); main.appendChild(jb);
      AVF.api("GET", "/journal/u/" + encodeURIComponent(u.username)).then(function (j) {
        if (!j.streakWeeks && !j.photos.length) return;
        AVF.mount(jb, h("h3", { class: "fo-h3" }, AVF.icon("pulse", "bico"), h("span", { text: "Gelişim" })),
          h("div", { class: "card fo-jrc" },
            j.streakWeeks ? h("p", { class: "fo-jrs" }, AVF.icon("flame"), h("b", { text: j.streakWeeks + " hafta" }), h("span", { text: " üst üste gelişim günlüğü kaydı" })) : null,
            j.photos.length ? h("div", { class: "fo-jrp" }, j.photos.map(function (p) {
              return h("a", { href: p.url, target: "_blank", rel: "noopener", class: "fo-jri", title: AVF.fmtDate(p.date) }, h("img", { src: p.url, alt: "Gelişim fotoğrafı", loading: "lazy" }), h("small", { text: AVF.fmtDate(p.date) }));
            })) : h("p", { class: "hint", text: "Bu üye gelişim fotoğraflarını seninle paylaşmıyor." })));
      }, function () { /* gösterilecek bir şey yok */ });
    }, function (e) { AVF.mount(main, e && e.status === 404 ? AVF.state("user", "Üye bulunamadı", "Bu kullanıcı adıyla bir forum üyesi yok.") : errBox(e)); });
  }

  // ------------------------------------------------------------------ kaydedilenler
  function bookmarks() {
    var tab = qs().t === "begenilenler" ? "likes" : "saved";
    title(tab === "likes" ? "Beğenilenler" : "Kaydedilenler");
    var tabs = h("nav", { class: "fo-subt", "aria-label": "Kaydedilenler ve Beğenilenler" },
      lk("/forum/kaydedilenler", [AVF.icon("bookmark"), h("span", { text: "Kaydedilenler" })], { "aria-current": tab === "saved" ? "page" : null }),
      lk("/forum/kaydedilenler?t=begenilenler", [AVF.icon("like"), h("span", { text: "Beğenilenler" })], { "aria-current": tab === "likes" ? "page" : null }));
    var box = h("div", null, AVF.skeleton(3));
    shell({ h1: "Kaydedilenler ve Beğenilenler", sub: "Sonra okumak için sakladıkların ve beğendiğin mesajlar tek yerde.", crumbs: [["Kaydedilenler ve Beğenilenler", "/forum/kaydedilenler"], [tab === "likes" ? "Beğenilenler" : "Kaydedilenler"]], icon: tab === "likes" ? "like" : "bookmark", color: tab === "likes" ? "pink" : "violet", noNew: true }, [tabs, box]);
    api("GET", tab === "likes" ? "/me/likes" : "/me/bookmarks").then(function (rows) {
      if (!rows.length) return AVF.mount(box, tab === "likes" ? AVF.state("like", "Henüz beğendiğin mesaj yok", "Hoşuna giden mesajlarda başparmağa dokun; hepsi burada toplanır.")
        : AVF.state("bookmark", "Kaydedilen mesaj yok", "Bir mesajın altındaki kaydet simgesine dokunarak buraya ekleyebilirsin."));
      AVF.mount(box, h("ul", { class: "fo-mini card" }, rows.map(function (b) {
        var li = h("li", null, h("span", { class: "fo-mini-i " + (tab === "likes" ? "like" : "save") }, AVF.icon(tab === "likes" ? "like" : "bookmark")),
          h("div", null, lk("/forum/konu/" + b.topicId + "?m=" + b.postId, b.title, { "data-notr": "" }), h("p", { "data-notr": "", text: (b.excerpt || "").replace(/\[alinti=[^\]]*\][\s\S]*?\[\/alinti\]/g, "").replace(/\[\/?[a-z]+(=[^\]]*)?\]/g, "") }),
            h("small", null, b.author ? h("span", { "data-notr": "", text: "@" + b.author + " · " }) : null, timeEl(b.at))),
          tab === "saved" ? h("button", { class: "fo-lnk", type: "button", onclick: function () { api("POST", "/posts/" + b.postId + "/bookmark", { on: false }).then(function () { li.remove(); AVF.toast("Kayıt kaldırıldı."); }); } }, "Kaldır")
            : h("button", { class: "fo-lnk", type: "button", onclick: function () { api("POST", "/posts/" + b.postId + "/react", { value: 0 }).then(function () { li.remove(); AVF.toast("Beğeni geri alındı."); }); } }, "Beğeniyi geri al"));
        return li;
      })));
    }, function (e) { AVF.mount(box, errBox(e, bookmarks)); });
  }


  // ------------------------------------------------------------------ moderasyon
  var RS = { spam: "Spam", abuse: "Hakaret / taciz", obscene: "Müstehcen", political: "Siyasi / ideolojik", sales: "Satış / kaynak", medical: "Tehlikeli sağlık yönlendirmesi", scam: "Dolandırıcılık", other: "Diğer" };
  function modPage() {
    if (!S.me.mod) return notFound();
    title("Moderasyon");
    var tab = qs().t || "open";
    var tabs = [["open", "Açık şikâyetler"], ["upheld", "Haklı bulunanlar"], ["dismissed", "Reddedilenler"], ["bans", "Forum yasakları"], ["log", "İşlem kaydı"]].concat(S.me.admin ? [["cats", "Kategoriler"]] : []);
    var box = h("div");
    var main = shell({ h1: "Moderasyon", crumbs: [["Moderasyon"]], noNew: true }, [h("div", { class: "fo-tabs2", role: "tablist" }, tabs.map(function (x) {
      return h("button", { type: "button", role: "tab", class: x[0] === tab ? "on" : "", "aria-selected": String(x[0] === tab), onclick: function () { history.replaceState(history.state, "", "/forum/moderasyon?t=" + x[0]); modPage(); } }, x[1]);
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
    if (tab === "log") return api("GET", "/mod/log").then(function (rows) {
      var NAMES = { forum_blocked_filter: ["filter", "Otomatik filtre engelledi (forum)"], dm_blocked_filter: ["filter", "Otomatik filtre engelledi (özel mesaj)"], forum_ban: ["lock", "Forumdan uzaklaştırma"], forum_unban: ["unlock", "Uzaklaştırma kaldırıldı"],
        forum_post_edit_mod: ["pen", "Mesaj düzenlendi"], forum_category_update: ["layers", "Kategori güncellendi"], forum_report_uphold: ["flag", "Şikâyet haklı bulundu"], forum_report_dismiss: ["flag", "Şikâyet reddedildi"] };
      function name(a) { if (NAMES[a]) return NAMES[a]; var m = /^forum_(topic|post)_(.+)$/.exec(a); if (m) return ["shield", (m[1] === "topic" ? "Konu: " : "Mesaj: ") + m[2].replace(/_/g, " ")]; return ["shield", a.replace(/_/g, " ")]; }
      AVF.mount(box, rows.length ? h("ul", { class: "fo-mini card fo-mlog" }, rows.map(function (r) {
        var n = name(r.action), link = r.targetType === "forum_topic" ? "/forum/konu/" + r.targetId : r.topic ? "/forum/konu/" + r.topic : null;
        return h("li", null, h("div", { class: "fo-mlh" }, h("span", { class: "fo-mli" + (/filter/.test(r.action) ? " f" : "") }, AVF.icon(n[0] === "filter" ? "shield" : n[0])), h("b", { text: n[1] }), timeEl(r.at)),
          h("small", null, h("span", { text: r.actor ? "@" + r.actor : "sistem" }), r.reason ? h("span", { text: " · " + r.reason }) : null, link ? h("span", { text: " · " }) : null, link ? lk(link, "konuya git") : null));
      })) : AVF.state("checks", "Kayıt yok", "Moderasyon işlemleri ve otomatik filtrenin engelledikleri burada listelenir."));
    }, function (e) { AVF.mount(box, errBox(e, modPage)); });
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

  function notFound() { shell({ h1: "Bulunamadı", crumbs: [] }, AVF.state("msg", "Sayfa bulunamadı", "Aradığın forum sayfası burada değil. Belki taşındı, belki hiç yoktu. 🤷", lk("/forum", "Foruma dön", { class: "btn" }))); }

  // ------------------------------------------------------------------ giriş kapısı ve yönlendirme
  var CONSENT_TEXT = "Forumda kendi isteğimle paylaşacağım kilo, ölçü, tahlil ve sağlık durumu gibi sağlık verilerimin, topluluk desteği amacıyla yalnız forum üyelerine gösterilmek üzere işlenmesine açık rıza veriyorum.";
  function consentDialog(done) {
    var cb = h("input", { type: "checkbox" }), ok = h("button", { class: "btn", type: "button", disabled: "" }, AVF.icon("check", "bico"), "Onaylıyorum"), m = h("div", { class: "fo-cmsg", role: "alert" });
    var bg = h("div", { class: "fo-cdlg", role: "dialog", "aria-modal": "true", "aria-labelledby": "fo-cdt" });
    function close() { bg.remove(); document.removeEventListener("keydown", esc, true); }
    function esc(e) { if (e.key === "Escape") close(); }
    cb.addEventListener("change", function () { ok.disabled = !cb.checked; });
    ok.onclick = function () { AVF.busy(ok, true); AVF.api("PUT", "/forum/me", { healthConsent: true }).then(function () { S.me.consent = true; close(); AVF.toast("Teşekkürler! Artık forumda yazabilirsin. ✍️"); if (done) done(); }, function (e) { AVF.busy(ok, false); m.textContent = AVF.errText(e); }); };
    bg.appendChild(h("div", { class: "card fo-cdc" }, h("span", { class: "tile" }, AVF.icon("shield")), h("h2", { id: "fo-cdt", text: "Sağlık verisi için açık rıza" }),
      h("p", { text: "Forumda paylaşılan içerikler kilo, ölçü, tahlil ya da sağlık durumu gibi özel nitelikli kişisel veri içerebilir. KVKK gereği bu verilerin işlenmesi için açık rızan gerekir. Rızanı Forum Ayarları'ndan dilediğin an geri çekebilirsin." }),
      h("label", { class: "fo-chk big" }, cb, h("span", null, h("span", { text: CONSENT_TEXT + " " }), lk("/yasal/kvkk", "KVKK Aydınlatma Metni"))), m,
      h("div", { class: "row" }, ok, h("button", { class: "btn ghost", type: "button", onclick: close }, "Şimdilik okuyacağım"))));
    document.body.appendChild(bg); document.addEventListener("keydown", esc, true); setTimeout(function () { cb.focus(); }, 30);
  }
  AVF.forumConsent = consentDialog;
  function gateRules(view, rules, again) {
    AVF.mount(view, h("section", { class: "fo-band", "data-norv": "" }, h("div", { class: "wrap" }, h("div", { class: "fo-bh" }, h("h1", { text: "Forum" }), h("p", { text: "Hoş geldin! İçeri girmeden önce birkaç kısa kuralımız var." })))),
      h("div", { class: "wrap fo-wrap", "data-norv": "" }, (function () {
        var cb = h("input", { type: "checkbox" }), cb2 = h("input", { type: "checkbox" }), ok = h("button", { class: "btn", type: "button", disabled: "" }, AVF.icon("arrow", "bico"), "Foruma gir"), m = h("div", { class: "fo-cmsg", role: "alert" });
        cb.addEventListener("change", function () { ok.disabled = !cb.checked; });
        ok.onclick = function () { AVF.busy(ok, true); AVF.api("PUT", "/forum/me", { acceptRules: true, healthConsent: cb2.checked || undefined }).then(function () { try { sessionStorage.setItem(FKEY, "1"); } catch (e) { /* yok */ } again(); }, function (e) { AVF.busy(ok, false); m.textContent = AVF.errText(e); }); };
        return h("section", { class: "card fo-gate" }, h("span", { class: "tile" }, AVF.icon("shield")), h("h2", { text: "Forum kuralları" }),
          ruleList(rules, S.ruleIcons),
          h("label", { class: "fo-chk big" }, cb, h("span", { text: "18 yaşından büyüğüm; forum kurallarını okudum ve kabul ediyorum." })),
          h("label", { class: "fo-chk big" }, cb2, h("span", null, h("span", { text: CONSENT_TEXT + " " }), lk("/yasal/kvkk", "KVKK Aydınlatma Metni"), h("small", { class: "hint", text: " (İsteğe bağlı: onaylamazsan forumu okuyabilirsin; yazmak için gerekir.)" }))), m, h("div", { class: "row" }, ok, lk("/", "Ana sayfaya dön", { class: "btn ghost" })));
      })()));
  }
  function boot(view, sub, done) {
    (AVF.take ? AVF.take("/board/home") : api("GET", "/home")).then(function (r) {
      S.me = r.me; S.cats = r.categories; S.stats = r.stats;
      S.tags = r.tags || [];
      if (!S.rules) api("GET", "/rules").then(function (x) { S.rules = x.rules; S.ruleIcons = x.icons || []; S.reasons = x.reasons; var rl = VIEW && VIEW.querySelector(".fo-rul ul"); if (rl) rl.replaceWith(ruleList(S.rules.slice(1, 5), S.ruleIcons.slice(1, 5), "mini")); }, function () {});
      done(r);
    }, function (e) {
      if (e && e.data && e.data.code === "rules") { S.ruleIcons = e.data.icons || []; return gateRules(view, e.data.rules || [], function () { AVF.pages.forum(view, sub); }); }
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
      if (first === "uyeler") return membersPage();
      if (first === "etiketler") return tagsIndex();
      if (first === "etiket" && parts[1]) return tagPage(parts[1]);
      if (first === "takip") { title("Takip ettiklerim"); return listPage({ title: "Takip ettiklerim", sub: "Yeni yanıt gelince haber verdiğimiz konular", crumbs: [["Takip ettiklerim"]], filter: "watching", icon: "bell", color: "amber", empty: ["bell", "Takip ettiğin konu yok", "Bir konunun üstündeki “Takip et” düğmesiyle ekleyebilirsin."] }); }
      if (first === "konularim") { title("Konularım"); return listPage({ title: "Konularım", sub: "Açtığın tüm konular", crumbs: [["Konularım"]], filter: "mine", icon: "file", color: "blue", empty: ["file", "Henüz konu açmadın", "“Yeni konu aç” ile ilk konunu paylaş; topluluk seni bekliyor. 🙌"] }); }
      if (first === "moderasyon") return modPage();
      notFound();
    };
    // ana sayfa dışındaki sayfalarda da yan panel ve kategoriler için özet bir kez alınır (sonra bellekte)
    if (S.cats && first !== "") { run({}); boot(view, sub, function () { /* özet tazelendi */ }); return; }
    VIEW.innerHTML = ""; AVF.mount(VIEW, h("div", { class: "wrap section" }, AVF.skeleton(4)));
    boot(view, sub, run);
  };
})();
