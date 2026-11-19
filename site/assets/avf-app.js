/* AlpveFit — site kabuğu, yönlendirme, ana sayfa ve üye paneli.
   Panel düzeni Alpeptit "Kullanıcı Paneli" ile aynıdır (koyu üst çubuk + kahraman bandı + sol menü/kullanıcı kartı + akordeyon kartlar;
   mobilde yatay kaydırmalı sekme menüsü). İçerik AlpveFit hizmetlerine uyarlanmıştır: yalnız kullanıcının KENDİ, YAYINLANMIŞ planları. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var view, tools, drawer, nav, unread = 0, kinds = null;

  function link(href, children, attrs) {
    attrs = attrs || {}; attrs.href = href; attrs["data-link"] = "";
    return h("a", attrs, children);
  }
  // Aynı bölüm içindeki sekme geçişleri (üye paneli sekmeleri; forum listeleri, kategoriler, kaydedilenler…) sayfayı başa atmaz:
  // kaydırma yeri korunur, yalnız yeni içerik görünür alanın üstünde kaldıysa içeriğin başına gelinir. Konu sayfası ve yeni konu ise başta açılır.
  function area(p) {
    p = String(p || "").split("?")[0];
    if (p.indexOf("/panel") === 0) return "panel";
    if (p.indexOf("/forum") === 0 && !/^\/forum\/(konu|yeni)(\/|$)/.test(p)) return "forum";
    return null;
  }
  function go(path, replace) {
    var from = location.pathname, y = window.pageYOffset || 0;
    if (location.pathname === path) { route(); return; }
    history[replace ? "replaceState" : "pushState"](null, "", path); route();
    // Sayfa geçişinde yumuşak kaydırma kullanılmaz (mobilde dokunuşla çakışıp yenileme hareketini tetikleyebiliyordu).
    var de = document.documentElement, a = area(from), keep = a && a === area(path);
    de.style.scrollBehavior = "auto"; window.scrollTo(0, keep ? y : 0); de.style.scrollBehavior = "";
    if (keep) requestAnimationFrame(function () {
      var c = document.querySelector(".pcontent, .fo-main"), top = document.querySelector(".top");
      if (!c) return;
      var off = (top ? top.getBoundingClientRect().height : 0) + 12, r = c.getBoundingClientRect();
      if (r.top < off) { de.style.scrollBehavior = "auto"; window.scrollTo(0, Math.max(0, (window.pageYOffset || 0) + r.top - off)); de.style.scrollBehavior = ""; }
    });
  }
  AVF.go = go;

  // ---------- kabuk ----------
  function langSwitch() {
    // TR | EN yan yana; seçili dilin altında kayan bir kapsül. Sayfa yenilenmez (AVF.setLang).
    var wrap = h("div", { class: "lang", role: "group", "aria-label": "Dil seçimi", "data-notr": "", "data-on": AVF.lang });
    ["tr", "en"].forEach(function (l) {
      wrap.appendChild(h("button", { type: "button", lang: l, "aria-pressed": AVF.lang === l ? "true" : "false", title: l === "tr" ? "Türkçe" : "English",
        onclick: function () { if (AVF.lang === l) return; wrap.setAttribute("data-on", l); setTimeout(function () { AVF.setLang(l); }, 220); } }, l.toUpperCase()));
    });
    wrap.insertBefore(h("span", { class: "lang-pill", "aria-hidden": "true" }), wrap.firstChild);
    return wrap;
  }
  AVF.onLangChange = AVF.onLangChange || [];
  AVF.onLangChange.push(function () {
    // yeni dildeki içerik yumuşakça belirir (sayfa karartılmaz, yerleşim zıplamaz)
    // Kullanıcı panelinde görünüm yeniden çizilmez: metinler yerinde çevrilir, girilen veriler ve açık bölümler kaybolmaz.
    renderFooter();
    if (location.pathname.indexOf("/panel") === 0 && AVF.session.user) renderChrome(); else route(true);
    document.body.classList.remove("lang-in"); void document.body.offsetWidth; document.body.classList.add("lang-in");
    setTimeout(function () { document.body.classList.remove("lang-in"); }, 600);
  });
  var footEl;
  if (AVF.pwa) AVF.pwa.onChange(function () { if (footEl) renderFooter(); });
  function buildShell() {
    var root = document.getElementById("app");
    nav = h("nav", { class: "nav", "aria-label": "Ana menü" });
    tools = h("div", { class: "tools" });
    drawer = h("div", { class: "drawer", onclick: function (e) { if (e.target === drawer) drawer.classList.remove("open"); } });
    view = h("main", { id: "main", tabindex: "-1" });
    footEl = h("footer", { class: "foot" });
    AVF.mount(root,
      h("a", { class: "sr", href: "#main" }, "İçeriğe geç"),
      h("header", { class: "top" }, h("div", { class: "wrap" },
        h("button", { class: "ibtn plain burger", type: "button", "aria-label": "Menüyü aç", onclick: function () { drawer.classList.add("open"); } }, AVF.icon("menu")),
        link("/", AVF.logo(false), { class: "logolink", "aria-label": "AlpveFit ana sayfa" }), nav, tools)),
      drawer, view, footEl,
      h("button", { class: "totop", id: "totop", type: "button", "aria-label": "Yukarı çık", title: "Yukarı çık", onclick: function () { window.scrollTo({ top: 0, behavior: "smooth" }); } }, AVF.icon("up")));
    renderFooter();
    var topEl = document.querySelector(".top"), tt = document.getElementById("totop");
    function onScroll() { var y = window.scrollY || 0; topEl.classList.toggle("scrolled", y > 8); tt.classList.toggle("show", y > 600); }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-link]"); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault(); drawer.classList.remove("open"); go(a.getAttribute("href"));
    });
    window.addEventListener("popstate", function () { route(); });
  }
  var NAV = [["/", "home", "Ana Sayfa"], ["/hakkimizda", "users", "Hakkımızda"], ["/sss", "help", "SSS"], ["/paketler", "tag", "Paketler"], ["/araclar", "wrench", "Araçlar"], ["/forum", "msg", "Forum"]];
  var LEGAL_ICONS = { kvkk: "shield", "kullanim-kosullari": "file", "gizlilik-cerez": "lock" };
  AVF.openTicket = function () {
    if (AVF.session.user) return go("/panel/destek/yeni");
    AVF.toast("Destek talebi oluşturmak için giriş yapın.");
    AVF.afterLogin = { path: "/panel/destek/yeni", at: Date.now() }; AVF.auth.open("login");
  };
  var SOCIAL = [["youtube", "https://www.youtube.com/@alpvefit", "YouTube"], ["instagram", "https://www.instagram.com/alpvefit/", "Instagram"], ["tiktok", "https://www.tiktok.com/@alpvefit", "TikTok"]];
  function renderFooter() {
    function col(icon, title, rows) {
      return h("div", { class: "fcol" }, h("h4", {}, AVF.icon(icon), h("span", { text: title })), h("ul", {}, rows.map(function (r) { return h("li", {}, r); })));
    }
    function fl(href, icon, text) { return link(href, [AVF.icon(icon), h("span", { text: text })]); }
    AVF.mount(footEl, h("div", { class: "wrap" },
      h("div", { class: "ftgrid" },
        h("div", { class: "fbrand" }, AVF.logo(true), h("p", { text: "Uzaktan eğitim ve birebir koçluk platformumuzda, tüm programlar tarafımızca tamamen size özel olarak sıfırdan hazırlanmaktadır." }),
          h("div", { class: "fsocial" },
            h("div", { class: "fs-icons" }, SOCIAL.map(function (x) {
              return h("a", { class: "fs-i", href: x[1], target: "_blank", rel: "noopener noreferrer", "aria-label": x[2], title: x[2] }, AVF.icon(x[0]));
            })))),
        col("building", "Kurumsal", [fl("/", "home", "Ana Sayfa"), fl("/hakkimizda", "users", "Hakkımızda"), fl("/sss", "help", "SSS")]),
        col("compass", "Keşfet", [fl("/paketler", "tag", "Paketler"), fl("/blog", "book", "Blog"), fl("/forum", "msg", "Forum"), fl("/araclar", "wrench", "Araçlar")]),
        col("scale", "Yasal", AVF.LEGAL_LINKS.map(function (l) { return fl("/yasal/" + l[0], LEGAL_ICONS[l[0]] || "file", l[1]); })),
        col("headset", "İletişim", [h("a", { href: "mailto:destek@alpvefit.com" }, AVF.icon("mail"), h("span", { text: "destek@alpvefit.com" })),
          h("a", { href: "/panel/destek/yeni", onclick: function (e) { e.preventDefault(); AVF.openTicket(); } }, AVF.icon("ticket"), h("span", { text: "Ticket gönder" })),
          AVF.pwa && AVF.pwa.available() ? h("a", { href: "#", class: "f-app", onclick: function (e) { e.preventDefault(); AVF.pwa.install(); } }, AVF.icon("phone"), h("span", { text: "Uygulamayı indir" })) : null].filter(Boolean))),
      h("div", { class: "fbottom" }, h("span", { "data-notr": "" }, "© " + new Date().getFullYear() + " AlpveFit"), h("span", { text: "Uzaktan eğitim ve koçluk platformu" }))));
  }
  function renderChrome() {
    var u = AVF.session.user, path = location.pathname;
    function active(href) { return href === "/" ? path === "/" : path === href || path.indexOf(href + "/") === 0; }
    function item(i) {
      if (i[0] === "/panel" && !u) {
        return h("a", { href: "/giris", onclick: function (e) { e.preventDefault(); drawer.classList.remove("open"); AVF.auth.open("login"); } }, AVF.icon(i[1]), h("span", { text: i[2] }));
      }
      var a = link(i[0], [AVF.icon(i[1]), h("span", { text: i[2] })]);
      if (active(i[0])) a.setAttribute("aria-current", "page"); return a;
    }
    AVF.mount(nav, NAV.map(item));
    AVF.mount(drawer, h("nav", null, h("div", { class: "dhead" }, AVF.logo(false), h("button", { class: "ibtn", type: "button", "aria-label": "Menüyü kapat", onclick: function () { drawer.classList.remove("open"); } }, AVF.icon("x"))),
      NAV.filter(function (i) { return i[0] !== "/forum"; }).map(item),
      h("div", { class: "dsep" }),
      link("/blog", [AVF.icon("book"), h("span", { text: "Blog" })]),
      item(NAV.filter(function (i) { return i[0] === "/forum"; })[0]),
      AVF.pwa && AVF.pwa.available() ? h("a", { href: "#", class: "d-app", onclick: function (e) { e.preventDefault(); drawer.classList.remove("open"); AVF.pwa.install(); } },
        h("span", { class: "d-app-i" }, AVF.icon("phone")), h("span", { class: "d-app-t" }, h("b", { text: "Uygulamayı indir" }), h("small", { text: "Ana ekrana ekle, tam ekran ve hızlı aç" })), AVF.icon("arrow")) : null,
      u ? h("a", { href: "#", onclick: function (e) { e.preventDefault(); logout(); } }, AVF.icon("out"), h("span", { text: "Güvenli Çıkış Yap" })) : null,
      h("div", { class: "dlang" }, langSwitch())));
    // Sade üst çubuk: dil seçimi, (mobilde) forum, (üyeyse) bildirimler ve tek bir şeffaf hesap ikonu.
    AVF.mount(tools,
      langSwitch(),
      link("/forum", AVF.icon("msg"), { class: "ibtn plain mob-only", "aria-label": "Forum", title: "Forum" }),
      AVF.themeButton ? AVF.themeButton() : null,
      u ? bellMenu() : null,
      u ? userMenu(u)
        : h("button", { class: "ibtn plain acct", type: "button", "aria-label": "Giriş yap / Kayıt ol", title: "Giriş yap / Kayıt ol", onclick: function () { AVF.auth.open("login"); } }, AVF.icon("user")));
  }
  function notifTarget(n) {
    var d = n.data || {};
    if (n.type === "plan_published" && d.kind && AVF.KIND[d.kind]) return "/panel/" + AVF.KIND[d.kind].slug;
    if (n.type === "plan_updated") return d.kinds && d.kinds.length === 1 && AVF.KIND[d.kinds[0]] ? "/panel/" + AVF.KIND[d.kinds[0]].slug : "/panel";
    if (n.type === "forum" && d.topicId) return "/forum/konu/" + d.topicId + (d.postId ? "?m=" + d.postId : "");
    if (n.type === "level_up" || n.type === "forum") return n.type === "forum" && d.kind === "moderation" && !d.topicId ? "/forum" : "/panel/forum-ayarlari/seviye";
    if (n.type === "friend") return "/panel/arkadaslar";
    if (n.type === "ticket" && d.ticketId) return "/panel/destek/" + d.ticketId;
    if ((n.type === "order_paid" || n.type === "order_payment") && n.order_id) return "/panel/siparis/" + n.order_id;
    if (n.type === "security") return "/panel/hesap";
    return "/panel/bildirimler";
  }
  function notifIcon(n) { return n.type === "security" ? "shield" : n.type === "ticket" ? "ticket" : n.type.indexOf("order") === 0 ? "card" : n.type === "level_up" ? "award" : n.type === "friend" ? "users" : n.type === "forum" ? "msg" : "list"; }
  // Bildirimler iki gruptadır: "Koçluk ve Sistem" (plan, sipariş, destek, güvenlik) ve "Forum" (forum, seviye, arkadaşlık).
  var NGROUPS = [["coach", "Koçluk ve Sistem", "list"], ["forum", "Forum", "msg"]];
  function ngroup(n) { return n.group || (n.type === "forum" || n.type === "level_up" || n.type === "friend" ? "forum" : "coach"); }
  function nTab() { try { var t = localStorage.getItem("avf_ntab"); return t === "forum" ? "forum" : "coach"; } catch (e) { return "coach"; } }
  function setNTab(t) { try { localStorage.setItem("avf_ntab", t); } catch (e) { /* yok say */ } }
  /** Grup sekmeleri: her sekmede kendi okunmamış sayısı. */
  function nTabs(rows, cur, onPick, cls) {
    return h("div", { class: "ntabs " + (cls || ""), role: "tablist", "aria-label": "Bildirim türü" }, NGROUPS.map(function (g) {
      var n = rows.filter(function (r) { return ngroup(r) === g[0] && !r.read_at; }).length;
      return h("button", { type: "button", role: "tab", class: "ntab" + (cur === g[0] ? " on" : ""), "aria-selected": cur === g[0] ? "true" : "false", onclick: function () { onPick(g[0]); } },
        AVF.icon(g[2], "bico"), h("span", { text: g[1] }), n ? h("b", { class: "ntab-n", text: String(n > 99 ? "99+" : n) }) : null);
    }));
  }
  function bellMenu() {
    var wrap = h("div", { class: "bell" });
    var pop = h("div", { class: "bell-pop", role: "menu", hidden: "" });
    var btn = h("button", { class: "ibtn plain", type: "button", "aria-label": "Bildirimler", title: "Bildirimler", "aria-haspopup": "true", "aria-expanded": "false" },
      AVF.icon("bell"), unread ? h("span", { class: "badge", "aria-label": unread + " okunmamış bildirim", text: String(unread > 99 ? "99+" : unread) }) : null);
    function close() { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); document.removeEventListener("click", away, true); document.removeEventListener("keydown", esc, true); }
    function away(e) { if (!wrap.contains(e.target)) close(); }
    function esc(e) { if (e.key === "Escape") { close(); btn.focus(); } }
    function paint(rows, tab) {
      var mine = rows.filter(function (r) { return ngroup(r) === tab; }), top = mine.slice(0, 6), un = mine.filter(function (r) { return !r.read_at; }).length;
      AVF.mount(pop, h("div", { class: "bp-head" }, h("b", { text: "Bildirimler" }), un ? h("span", { class: "bp-n", text: un + " yeni" }) : null,
          mine.length ? h("button", { class: "bp-clr", type: "button", onclick: function () { close(); clearAllNotifs(tab); } }, AVF.icon("trash", "bico"), h("span", { text: "Temizle" })) : null),
        nTabs(rows, tab, function (t) { setNTab(t); paint(rows, t); }, "bp-tabs"),
        top.length ? h("div", { class: "bp-list" }, top.map(function (n) {
          return h("a", { class: "bp-item" + (n.read_at ? "" : " new"), href: notifTarget(n), role: "menuitem", onclick: function (e) {
            e.preventDefault(); close();
            if (!n.read_at) AVF.api("POST", "/notifications/" + n.id + "/read", {}).then(function () { refreshUnread(); }, function () {});
            go(notifTarget(n));
          } }, h("span", { class: "tile" + (n.type === "security" ? " teal" : "") }, AVF.icon(notifIcon(n))),
            h("span", { class: "bp-t" }, notifText(n), h("small", { text: AVF.fmtDateTime(n.created_at) })));
        })) : h("div", { class: "bp-empty" }, AVF.icon(tab === "forum" ? "msg" : "bell"), h("span", { text: tab === "forum" ? "Forumdan yeni bildirim yok." : "Koçluk ve sistemden yeni bildirim yok." })),
        h("a", { class: "bp-all", href: "/panel/bildirimler", onclick: function (e) { e.preventDefault(); close(); go("/panel/bildirimler"); } }, "Tüm bildirimleri gör"));
    }
    btn.addEventListener("click", function () {
      if (!pop.hidden) return close();
      pop.hidden = false; btn.setAttribute("aria-expanded", "true");
      document.addEventListener("click", away, true); document.addEventListener("keydown", esc, true);
      AVF.mount(pop, h("div", { class: "bp-head" }, h("b", { text: "Bildirimler" })), AVF.skeleton(2));
      AVF.api("GET", "/notifications").then(function (rows) {
        unread = rows.filter(function (r) { return !r.read_at; }).length;
        var tab = nTab();
        // seçili sekme boş, diğerinde okunmamış varsa oraya geçilir
        if (!rows.some(function (r) { return ngroup(r) === tab && !r.read_at; }) && rows.some(function (r) { return ngroup(r) !== tab && !r.read_at; })) tab = tab === "forum" ? "coach" : "forum";
        paint(rows, tab);
      }, function () { AVF.mount(pop, h("div", { class: "bp-empty" }, "Bildirimler yüklenemedi.")); });
    });
    wrap.appendChild(btn); wrap.appendChild(pop); return wrap;
  }
  /** Hesap simgesine tıklayınca açılan kısa menü: yalnız en çok kullanılanlar (tamamı panel menüsündedir). */
  function userMenu(u) {
    var wrap = h("div", { class: "umenu" });
    var btn = h("button", { class: "ibtn plain acct", type: "button", "aria-label": "Hesabım", title: "Hesabım", "aria-haspopup": "true", "aria-expanded": "false" },
      AVF.myAvatar ? AVF.myAvatar() : AVF.icon("user"), AVF.dmUnread ? h("span", { class: "badge dot", "aria-label": AVF.dmUnread + " okunmamış mesaj" }) : null);
    var pop = h("div", { class: "um-pop", role: "menu", hidden: "" });
    function close() { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); document.removeEventListener("click", away, true); document.removeEventListener("keydown", esc, true); }
    function away(e) { if (!wrap.contains(e.target)) close(); }
    function esc(e) { if (e.key === "Escape") { close(); btn.focus(); } }
    function it(href, icon, label, extra) { return h("a", { class: "um-i", href: href, role: "menuitem", onclick: function (e) { e.preventDefault(); close(); go(href); } }, AVF.icon(icon), h("span", { text: label }), extra || null); }
    btn.addEventListener("click", function () {
      if (!pop.hidden) return close();
      pop.hidden = false; btn.setAttribute("aria-expanded", "true");
      document.addEventListener("click", away, true); document.addEventListener("keydown", esc, true);
      AVF.mount(pop,
        h("div", { class: "um-h" }, h("b", { "data-notr": "", text: AVF.maskName(u.full_name) }), u.username ? h("small", { "data-notr": "", text: "@" + u.username }) : null),
        it("/panel", "list", "Planlarım"),
        it("/panel/arkadaslar", "users", "Arkadaşlar ve Mesajlar", AVF.dmUnread ? h("span", { class: "badge", text: String(AVF.dmUnread) }) : null),
        it("/forum", "chat", "Forum"),
        it("/panel/forum-ayarlari", "msg", "Forum Ayarları"),
        it("/panel/destek", "ticket", "Destek Taleplerim"),
        it("/panel/hesap", "cog", "Hesap Ayarları"),
        h("div", { class: "um-sep" }),
        AVF.themeRow ? AVF.themeRow() : null,
        AVF.pwa && AVF.pwa.available() ? h("button", { class: "um-i", type: "button", role: "menuitem", onclick: function () { close(); AVF.pwa.install(); } }, AVF.icon("phone"), h("span", { text: "Uygulamayı indir" })) : null,
        h("button", { class: "um-i out", type: "button", role: "menuitem", onclick: function () { close(); logout(); } }, AVF.icon("out"), h("span", { text: "Güvenli Çıkış Yap" })));
      var first = pop.querySelector(".um-i"); if (first) first.focus({ preventScroll: true });
    });
    wrap.appendChild(btn); wrap.appendChild(pop); return wrap;
  }
  function refreshUnread() {
    if (!AVF.session.user) { unread = 0; AVF.dmUnread = 0; return renderChrome(); }
    AVF.api("GET", "/notifications").then(function (rows) {
      unread = rows.filter(function (r) { return !r.read_at; }).length; renderChrome();
      // forum seviyesi yükseldiyse (etkinlikle veya atamayla) kısa bir kutlama gösterilir — bir kez
      var lv = rows.filter(function (r) { return r.type === "level_up" && !r.read_at && r.data && r.data.popup; })[0];
      if (lv && AVF.celebrateLevel) AVF.celebrateLevel(lv);
    }, function () { /* sessiz */ });
    AVF.api("GET", "/friends/summary").then(function (s) { if (AVF.dmUnread !== s.dmUnread) { AVF.dmUnread = s.dmUnread; renderChrome(); } }, function () {});
  }
  AVF.renderChrome = function () { renderChrome(); };
  AVF.refreshUnread = function () { refreshUnread(); };

  // ---------- anlık olaylar (SSE): yeni mesaj, okundu, yazıyor, bildirim ----------
  // Oturum açıkken tek bağlantı; sekme arka plandayken de açık kalır (tarayıcı kendiliğinden yeniden bağlanır).
  var live = { es: null, fns: {}, ok: false };
  AVF.live = {
    on: function (ev, fn) { (live.fns[ev] = live.fns[ev] || []).push(fn); return function () { live.fns[ev] = (live.fns[ev] || []).filter(function (f) { return f !== fn; }); }; },
    connected: function () { return live.ok; },
  };
  function liveFire(ev, d) { (live.fns[ev] || []).slice().forEach(function (f) { try { f(d); } catch (e) { /* yok say */ } }); }
  var refreshT = null;
  function refreshSoon() { clearTimeout(refreshT); refreshT = setTimeout(refreshUnread, 250); }
  function liveStart() {
    if (live.es || !AVF.session.user || !window.EventSource) return;
    var es = live.es = new EventSource("/api/live");
    es.addEventListener("hello", function () { live.ok = true; });
    es.addEventListener("notif", function (e) { refreshSoon(); liveFire("notif", JSON.parse(e.data || "{}")); });
    es.addEventListener("dm", function (e) {
      var d = JSON.parse(e.data || "{}"); liveFire("dm", d);
      if (!d.mine) {
        refreshSoon();
        // açık sohbet bu kişiyle değilse kısa bir uyarı
        if (location.pathname !== "/panel/arkadaslar/" + d.from) AVF.toast(AVF.t("Yeni bir mesajın var."), null, { href: "/panel/arkadaslar/" + d.from });
      }
    });
    es.addEventListener("read", function (e) { liveFire("read", JSON.parse(e.data || "{}")); });
    es.addEventListener("typing", function (e) { liveFire("typing", JSON.parse(e.data || "{}")); });
    es.onerror = function () { live.ok = false; if (!AVF.session.user) liveStop(); };
  }
  function liveStop() { if (live.es) { try { live.es.close(); } catch (e) { /* yok say */ } } live.es = null; live.ok = false; }
  AVF.liveStart = liveStart; AVF.liveStop = liveStop;
  function logout() {
    AVF.confirmDialog({ icon: "out", title: "Çıkış yapmak istediğinize emin misiniz?", text: "Güvenli çıkış yaptığınızda oturumunuz bu cihazda kapatılır.", confirm: "Evet, çıkış yap", cancel: "Vazgeç" }).then(function (ok) {
      if (!ok) return;
      AVF.api("POST", "/account/logout", {}).then(null, function () { /* oturum zaten kapalı olabilir */ }).then(function () { sessionGone(); AVF.toast("Çıkış yapıldı."); });
    });
  }
  function sessionGone(why, data) {
    liveStop(); hint(false); AVF.session.user = null; kinds = null; unread = 0; if (why !== "expired" && AVF.clearDrafts) AVF.clearDrafts(); renderChrome();
    if (why === "locked") { go("/"); AVF.auth.locked(data); return; }
    if (why === "expired") AVF.toast("Oturumunuz sona erdi. Lütfen yeniden giriş yapın.", "err");
    if (location.pathname.indexOf("/panel") === 0) go("/"); else route();
  }
  AVF.onSessionEnd = sessionGone;
  AVF.onLogin = function () {
    kinds = null; hint(true); renderChrome(); refreshUnread(); liveStart();
    var next = AVF.afterLogin; AVF.afterLogin = null;
    if (next && next.path === "/admin") { location.replace("/admin"); return; }   // yönetim alanı sunucuda ayrıca doğrulanır
    if (next && Date.now() - next.at < 10 * 60000) return go(next.path, true);
    if (location.pathname === "/" || location.pathname === "/giris" || location.pathname === "/kayit") go("/panel", true); else route();
  };

  // ---------- yönlendirme ----------
  function route(rerender) {
    var p = location.pathname.replace(/\/+$/, "") || "/";
    if (AVF.langLock && AVF.langLock(p === "/forum" || p.indexOf("/forum/") === 0)) renderFooter();   // forum: yalnız Türkçe, dil seçici yok
    renderChrome(); document.title = "AlpveFit";
    if (!rerender) document.body.classList.remove("lang-swap");
    if (p === "/giris" || p === "/kayit" || p === "/sifremi-unuttum") { if (AVF.session.user) return go("/panel", true); homePage(); return AVF.auth.open(p === "/kayit" ? "register" : "login"); }
    if (p === "/") return homePage();
    if (p === "/admin") { if (AVF.session.user) { location.replace("/admin"); return; } homePage(); AVF.afterLogin = { path: "/admin", at: Date.now() }; return AVF.auth.open("login"); }
    if (p === "/paketler") return AVF.packagesPage(view);
    if (p === "/sss") return AVF.pages.faq(view);
    if (p === "/hakkimizda") return AVF.pages.about(view);
    if (p === "/forum" || p.indexOf("/forum/") === 0) return AVF.pages.forum(view, p.slice(7));
    if (p === "/blog") return AVF.pages.blog(view);
    if (p.indexOf("/blog/") === 0) return AVF.pages.post(view, p.slice(6));
    if (p === "/araclar") return AVF.pages.tools(view);
    if (p.indexOf("/araclar/") === 0) return AVF.pages.tools(view, p.slice(9));
    if (p.indexOf("/yasal/") === 0 && AVF.legalPage(view, p.slice(7))) return;
    if (p === "/panel" || p.indexOf("/panel/") === 0) return panelPage(p.slice(7));
    notFound();
  }
  function notFound() {
    document.title = "Sayfa bulunamadı — AlpveFit";
    AVF.mount(view, h("section", { class: "nf" }, h("div", { class: "wrap nf-in" },
      h("div", { class: "nf-code", "aria-hidden": "true" }, h("span", { text: "4" }), h("span", { class: "nf-m" }, AVF.mascotLost ? AVF.mascotLost() : null), h("span", { text: "4" })),
      h("h1", { text: "Sayfa bulunamadı" }),
      h("p", { text: "Bu patika bir yere çıkmıyor. Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir; mantarımız bile haritayı ters tutuyor." }),
      h("div", { class: "nf-act" }, link("/", "Ana sayfaya dön", { class: "btn" }), link("/paketler", "Paketleri incele", { class: "btn ghost" })))));
  }

  // ---------- ana sayfa ----------
  function homePage() {
    var u = AVF.session.user;
    // Maskot tek örnektir: masaüstünde sağ sütundaki sahnede, mobilde başlığın yanındaki yuvada durur (metinle çakışmaz).
    var stage = h("div", { class: "stage" }), mslot = h("div", { class: "mslot", "aria-hidden": "true" }), m = AVF.mascot();
    var mq = window.matchMedia("(max-width: 900px)");
    function place() { var host = mq.matches ? mslot : stage; if (m.parentNode !== host) host.appendChild(m); }
    place(); if (mq.addEventListener) mq.addEventListener("change", place); else if (mq.addListener) mq.addListener(place);
    AVF.mount(view,
      h("section", { class: "hero hero-split home" }, h("div", { class: "wrap" },
        h("div", { class: "hero-copy" },
          h("div", { class: "titlerow" }, h("h1", { text: "Size özel program, uzman koçluk." }), mslot),
          h("p", { text: "Beslenme, antrenman ve takviye programlarınız tarafımızca size özel hazırlanır; tek bir yerde, yalnızca sizin hesabınızda yayınlanır." }),
          h("div", { class: "cta" }, link("/paketler", "Paketleri incele", { class: "btn" }), u ? link("/panel", "Panelime git", { class: "btn ghost" }) : h("button", { class: "btn ghost", type: "button", onclick: function () { AVF.auth.open("register"); } }, "Kayıt ol")),
          h("ul", { class: "heroTicks" },
            h("li", {}, h("span", { class: "tk" }, AVF.icon("clock")), h("span", { text: "Ödemeden sonra 24 saat içinde programınız hazır!" })),
            h("li", {}, h("span", { class: "tk" }, AVF.icon("card")), h("span", { text: "Kredi / banka kartı ile güvenli ödeme" })),
            h("li", {}, h("span", { class: "tk" }, AVF.icon("lock")), h("span", { text: "Planlarınız kişisel ve yalnızca size aittir" })))),
        h("div", { class: "stagewrap" }, stage))),
      h("section", { class: "section" }, h("div", { class: "wrap" },
        h("div", { class: "shead center" }, h("span", { class: "kicker" }, AVF.icon("help"), h("span", { text: "Neden AlpveFit" })), h("h2", { class: "sec", text: "Eğitim sürecinizin tamamı tek hesapta" }), h("p", { text: "Size özel hazırlanan, yalnızca sizin görebileceğiniz ve 24 saat içinde teslim edilen planlar." })),
        h("div", { class: "grid3" },
          feat("globe", "Uzaktan Eğitim ve Koçluk", "Dünyanın neresinde olursanız olun, değişimi birlikte yakalıyoruz. Size sıradan programlar değil, gerçek zaman ve birebir ilgi sunuyoruz."),
          feat("target", "Kişiye Özel Planlar", "Hedeflerinize, bütçenize ve yaşam tarzınıza göre tamamen sıfırdan tasarlanır. Otomatik şablonlara yer vermez, sürecinizi yakından takip ederiz."),
          feat("clock", "24 Saatte Teslim", "Ödemenizin ardından yapılan detaylı analizle, programınız en geç 24 saat içinde sadece size özel kullanıcı panelinize yüklenir.")))),
      h("section", { class: "section dark pkgband" }, h("div", { class: "wrap" },
        h("div", { class: "shead center" }, h("span", { class: "kicker" }, AVF.icon("layers"), "Paketler"), h("h2", { class: "sec", text: "Kişiye Özel Program" }),
          h("p", { text: "Hazırlanan tüm programlar; hedefleriniz, yaşam tarzınız ve sağlık durumunuz titizlikle analiz edilerek, tamamen size özel olarak tasarlanır. Süreçte hiçbir şekilde otomatik üretilen şablonlar veya standart şablonlar kullanılmaz." })),
        AVF.pkgGrid({ compact: true }),
        h("div", { class: "center", style: "margin-top:34px" }, link("/paketler", "Paketleri incele", { class: "btn light lg" }))))
    );
    AVF.mascotPlay(m);
  }
  function feat(icon, title, text) {
    return h("div", { class: "card feat" }, h("span", { class: "tile" }, AVF.icon(icon)), h("h3", { text: title }), h("p", { text: text }));
  }

  // ---------- panel ----------
  function panelHero(title, sub) {
    return h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("div", { class: "eyebrow", text: "Hesabım" }), h("h1", { text: title }), h("p", { text: sub })));
  }
  function panelPage(sub) {
    var u = AVF.session.user;
    if (!u) {
      AVF.mount(view, panelHero("Kullanıcı Paneli", "Hesabınızla ilgili işlemleri buradan yönetebilirsiniz."), h("div", { class: "wrap section" }, AVF.state("lock", "Giriş yapmanız gerekiyor", "Planlarınızı görmek için hesabınıza giriş yapın.", h("button", { class: "btn", type: "button", onclick: function () { AVF.auth.open("login"); } }, "Giriş yap"))));
      return AVF.auth.open("login");
    }
    document.title = "Kullanıcı Paneli — AlpveFit";
    var content = h("div", { class: "pcontent", "aria-live": "polite" });
    var menuEl = h("nav", { class: "card menu", "aria-label": "Panel menüsü" });
    AVF.mount(view, panelHero("Kullanıcı Paneli", "Planlarınızı ve hesabınızı buradan yönetebilirsiniz."),
      h("div", { class: "wrap pbody" },
        h("aside", { class: "side" },
          h("div", { class: "card ucard" }, h("span", { class: "tile" }, AVF.icon("shield")), h("div", null, h("b", { text: AVF.maskName(u.full_name) }), h("small", { text: u.email }), h("span", { class: "ok" }, "✓ E-posta doğrulandı"))), menuEl),
        content));
    // Menü sırası: Planlarım (açılır), Forum Ayarları, Siparişlerim, Destek Taleplerim, Kişisel Bilgiler, Bildirimler, Hesap Ayarları, Güvenli Çıkış Yap.
    // Planlarım varsayılan olarak KAPALIDIR; üye açarsa tercihi hatırlanır. Masaüstünde alt başlıklar kendi kartının içinde,
    // mobilde yatay kaydırılan menünün altında ikinci bir satır olarak açılır.
    var mqMob = window.matchMedia("(max-width: 900px)");
    function isOpen(k) { try { return localStorage.getItem("avf_pm_" + k) === "1"; } catch (e) { return false; } }
    function setOpen(k, v) { try { localStorage.setItem("avf_pm_" + k, v ? "1" : "0"); } catch (e) { /* depolama yok */ } }
    // Açılır menü grubu (Planlarım, Forum Ayarları): alt başlıklar masaüstünde kartın içinde, mobilde menünün altında ikinci satırda açılır.
    // Gruptaki bir sayfadayken açık ve sabit kalır; başka bir sekmeye geçince kendiliğinden kapanır.
    var groups = [];
    function collapsible(key, href, icon, label, items, onHere, onMain) {
      if (onHere) setOpen(key, true); else if (!onMain) setOpen(key, false);
      var open = onHere || (onMain && isOpen(key));
      var gid = "pm-" + key;
      var group = h("div", { class: "pm-group", id: gid, role: "group", "aria-label": label }, items.map(function (it) {
        var a = link(it.href, [AVF.icon(it.icon), h("span", { text: it.label }), it.locked ? AVF.icon("lock", "pm-lock") : null], { class: "pm-sub" });
        if (it.current) a.setAttribute("aria-current", "page"); return a;
      }));
      var chev = h("button", { class: "pm-chev", type: "button", "aria-controls": gid, "aria-expanded": open ? "true" : "false", "aria-label": AVF.t(label) + " — " + AVF.t("aç/kapat") }, AVF.icon("chev"));
      var main = link(href, [AVF.icon(icon), h("span", { text: label })], { class: "pm-main" });
      if (onMain) main.setAttribute("aria-current", "page");
      var head = h("div", { class: "pm-plans pm-k-" + key + (open ? " open" : "") + (onMain ? " cur" : "") }, main, chev);
      var wrapG = h("div", { class: "pm-gwrap still" + (open ? " open" : "") }, h("div", { class: "pm-gin" }, group));
      function toggle(v) {
        open = v; setOpen(key, v); head.classList.toggle("open", v); wrapG.classList.toggle("open", v); chev.setAttribute("aria-expanded", v ? "true" : "false");
        // aynı anda tek açılır grup: biri açılınca diğeri kapanır (alt alta iki uzun liste kalabalık yapmasın)
        if (v) groups.forEach(function (g) { if (g.key !== key && g.isOpen()) g.toggle(false); });
      }
      chev.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); toggle(!open); });
      main.addEventListener("click", function () { if (!open) toggle(true); });
      var api = { key: key, head: head, wrap: wrapG, group: group, toggle: toggle, isOpen: function () { return open; } };
      groups.push(api); return api;
    }
    function paintMenu() {
      groups = [];
      var granted = (kinds || []).map(function (k) { return k.kind; });
      var onKind = Object.keys(AVF.KIND).some(function (k) { return AVF.KIND[k].slug === sub; }) || sub === "agirlik-takibi";
      var planItems = Object.keys(AVF.KIND).map(function (k) { return { href: "/panel/" + AVF.KIND[k].slug, icon: AVF.KIND[k].icon, label: AVF.KIND[k].label, locked: kinds && granted.indexOf(k) < 0, current: sub === AVF.KIND[k].slug }; });
      planItems.push({ href: "/panel/agirlik-takibi", icon: "chart", label: "Ağırlık Takibi", locked: kinds && granted.indexOf("training") < 0, current: sub === "agirlik-takibi" });
      var P = collapsible("plans", "/panel", "list", "Planlarım", planItems, onKind, sub === "");
      var fsub = sub.indexOf("forum-ayarlari") === 0 ? sub.slice(15) || "profil" : null;
      var F = collapsible("forum", "/panel/forum-ayarlari", "msg", "Forum Ayarları", AVF.FORUM_TABS.map(function (t) {
        return { href: "/panel/forum-ayarlari/" + t[0], icon: t[1], label: t[2], current: fsub === t[0] };
      }), !!fsub, false);
      function item(i) {
        var a = link("/panel/" + i[0], [AVF.icon(i[1]), h("span", { text: i[2] }), i[0] === "bildirimler" && unread ? h("span", { class: "badge", text: String(unread) }) : null, i[0] === "arkadaslar" && AVF.dmUnread ? h("span", { class: "badge", text: String(AVF.dmUnread) }) : null]);
        if (i[0] === sub || sub.indexOf(i[0] + "/") === 0 || (i[0] === "siparisler" && sub.indexOf("siparis/") === 0)) a.setAttribute("aria-current", "page"); return a;
      }
      var row = h("div", { class: "pm-row" }, P.head, F.head, [["arkadaslar", "users", "Arkadaşlar ve Mesajlar"], ["siparisler", "card", "Siparişlerim"], ["destek", "ticket", "Destek Taleplerim"], ["profil", "id", "Kişisel Bilgiler"], ["bildirimler", "bell", "Bildirimler"], ["hesap", "cog", "Hesap Ayarları"]].map(item),
        h("button", { class: "pm-out", type: "button", onclick: logout }, AVF.icon("out"), h("span", { text: "Güvenli Çıkış Yap" })));
      function place() {
        if (mqMob.matches) { menuEl.appendChild(P.wrap); menuEl.appendChild(F.wrap); }
        else { row.insertBefore(P.wrap, P.head.nextSibling); row.insertBefore(F.wrap, F.head.nextSibling); }
      }
      AVF.mount(menuEl, row); place();
      requestAnimationFrame(function () { requestAnimationFrame(function () { P.wrap.classList.remove("still"); F.wrap.classList.remove("still"); }); });   // ilk çizimde açılma animasyonu oynamaz
      if (!menuEl._mq) { menuEl._mq = true; var pl = function () { paintMenu(); }; if (mqMob.addEventListener) mqMob.addEventListener("change", pl); else if (mqMob.addListener) mqMob.addListener(pl); }
      // mobilde etkin sekme görünür alana kaydırılır
      if (mqMob.matches) {
        var cur = row.querySelector(":scope > a[aria-current]") ? ":scope > a[aria-current]" : onKind || sub === "" ? ".pm-k-plans" : fsub ? ".pm-k-forum" : null;
        if (cur) AVF.stripCenter(row, "pm-row", cur);
        AVF.stripCenter(P.group, "pm-plans"); AVF.stripCenter(F.group, "pm-forum");
      }
    }
    function draw() {
      paintMenu();
      if (sub === "hesap") return accountView(content, u);
      if (sub.indexOf("forum-ayarlari") === 0) return AVF.forumSettingsView(content, sub.slice(15) || "profil");
      if (sub === "arkadaslar" || sub.indexOf("arkadaslar/") === 0) return AVF.friendsView(content, sub.slice(11));
      if (sub === "agirlik-takibi") return (kinds || []).some(function (k) { return k.kind === "training"; }) ? AVF.progressView(content, {}) : AVF.mount(content, h("h2", { class: "ptitle", text: "Ağırlık Takibi" }), AVF.state("lock", "Bu bölüm hesabınız için etkin değil", "Antrenman programınız tanımlandığında ağırlık takibi açılır.", link("/panel", "Planlarıma dön", { class: "btn" })));
      if (sub === "bildirimler") return notificationsView(content);
      if (sub === "siparisler") return AVF.ordersView(content);
      if (sub === "profil") return AVF.profileView(content);
      if (sub === "destek" || sub.indexOf("destek/") === 0) return AVF.ticketsView(content, sub.slice(7));
      if (sub.indexOf("siparis/") === 0) return AVF.orderView(content, sub.slice(8));
      var kind = Object.keys(AVF.KIND).filter(function (k) { return AVF.KIND[k].slug === sub; })[0];
      if (kind) return planKindView(content, kind);
      if (sub === "") return overviewView(content);
      AVF.mount(content, AVF.state("alert", "Sayfa bulunamadı", "", link("/panel", "Panele dön", { class: "btn" })));
    }
    if (kinds) return draw();
    paintMenu(); AVF.mount(content, AVF.skeleton(3));
    AVF.take("/plans/overview").then(function (o) { kinds = o.kinds; AVF.overview = o; draw(); }, function (e) {
      AVF.mount(content, AVF.state("alert", "Planlar yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { panelPage(sub); } }, "Tekrar dene")));
    });
  }

  function overviewView(el) {
    var o = AVF.overview || { kinds: [], coaches: [] };
    AVF.mount(el, h("h2", { class: "ptitle", text: "Planlarım" }), AVF.packageStatusCard());
    if (o.coaches.length) el.appendChild(h("div", { class: "note" }, "Koçunuz: ", h("span", { "data-notr": "", text: o.coaches.map(function (c) { return c.name; }).join(", ") })));
    if (!o.kinds.length) el.appendChild(h("div", { class: "note" }, "Bir paket satın aldığınızda ve ödemeniz onaylandığında plan bölümleriniz açılır. ", link("/paketler", "Paketleri incele", { style: "font-weight:700" })));
    el.appendChild(h("div", { class: "stack" }, Object.keys(AVF.KIND).map(function (key) {
      var m = AVF.KIND[key], k = o.kinds.filter(function (x) { return x.kind === key; })[0];
      return link("/panel/" + m.slug, [h("span", { class: "tile" }, AVF.icon(m.icon)),
        h("span", { class: "t", style: "flex:1;min-width:0" }, h("b", { style: "display:block;font-size:16px", text: m.label }), h("small", { style: "color:var(--muted)", text: !k ? "Hesabınız için henüz etkin değil" : k.count ? k.count + " yayınlanmış plan" + (k.lastPublishedAt ? " · son: " + AVF.fmtDate(k.lastPublishedAt) : "") : "Henüz yayınlanmış plan yok" })), AVF.icon(k ? "chev" : "lock", k ? "chev" : "pm-lock")],
        { class: "card ovk" + (k ? "" : " off"), style: "display:flex;align-items:center;gap:14px;padding:16px 18px;text-decoration:none" });
    })));
  }

  // Plan önbelleği: bölümler arası geçiş anında açılır (önbellekten çizilir, arka planda tazelenir).
  var planCache = {};
  function fetchPlans(kind) {
    var c = planCache[kind];
    if (c && c.p) return c.p;
    var p = AVF.api("GET", "/plans?kind=" + kind).then(function (rows) { planCache[kind] = { rows: rows, at: Date.now() }; return rows; }, function (e) { delete planCache[kind]; throw e; });
    planCache[kind] = { rows: c && c.rows, at: c && c.at, p: p };
    return p;
  }
  function prefetchPlans() { (kinds || []).forEach(function (k) { if (!planCache[k.kind]) fetchPlans(k.kind).catch(function () {}); }); if (AVF.planCatalog) AVF.planCatalog(false).catch(function () {}); }
  AVF.dropPlanCache = function () { planCache = {}; };
  function kindTabs(kind) {
    var granted = (kinds || []).map(function (k) { return k.kind; });
    var list = Object.keys(AVF.KIND).filter(function (k) { return granted.indexOf(k) >= 0; }).map(function (k) { return [AVF.KIND[k].slug, AVF.KIND[k].icon, AVF.KIND[k].label, k === kind]; });
    if (granted.indexOf("training") >= 0) list.push(["agirlik-takibi", "chart", "Ağırlık Takibi", kind === "progress"]);
    if (list.length < 2) return null;
    var nav = h("nav", { class: "ktabs", "aria-label": "Plan bölümleri arasında geçiş" }, list.map(function (x) {
      var a = link("/panel/" + x[0], [AVF.icon(x[1]), h("span", { text: x[2] })], { class: "ktab" });
      if (x[3]) a.setAttribute("aria-current", "page"); return a;
    }));
    setTimeout(function () { var c = nav.querySelector("[aria-current]"); if (c && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = Math.max(0, c.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft - 16); }, 0);
    return nav;
  }
  AVF.kindTabs = kindTabs;
  function planKindView(el, kind) {
    var m = AVF.KIND[kind], ok = (kinds || []).some(function (k) { return k.kind === kind; });
    AVF.mount(el, kindTabs(kind), h("h2", { class: "ptitle", text: m.label }));
    if (!ok) return el.appendChild(AVF.state("lock", "Bu bölüm hesabınız için etkin değil", "Erişim izni tarafımızca tanımlanır.", link("/panel", "Planlarıma dön", { class: "btn" })));
    var list = h("div", { class: "stack" }), hasSupp = kind === "nutrition" && (kinds || []).some(function (k) { return k.kind === "supplement"; });
    el.appendChild(list);
    function paint(rows, suppRows) {
      if (!rows.length) return AVF.mount(list, AVF.state(m.icon, "Henüz plan yok", "Koçunuz planınızı eklediğinde burada görünür ve size bildirim gelir."));
      var ctx = { supp: suppRows && suppRows[0] && suppRows[0].data };
      AVF.mount(list, rows.map(function (p, i) {
        var when = p.starts_on || p.ends_on ? [p.starts_on ? AVF.fmtDate(p.starts_on) : "…", p.ends_on ? AVF.fmtDate(p.ends_on) : "…"].join(" – ") : "";
        return AVF.accordion({ icon: m.icon, open: i === 0, title: p.title, sub: "Hazırlayan: " + p.author_name + " · " + AVF.fmtDate(p.updated_at || p.published_at),
          content: [h("div", { class: "meta" }, h("span", null, "Hazırlayan: ", h("b", { text: p.author_name })), h("span", null, "Eklenme: " + AVF.fmtDate(p.published_at)),
            p.updated_at && new Date(p.updated_at) - new Date(p.published_at) > 60000 ? h("span", null, "Son güncelleme: " + AVF.fmtDate(p.updated_at)) : null, when ? h("span", null, "Dönem: " + when) : null),
            p.data && AVF.planDataView ? AVF.planDataView(kind, p.data, ctx) : null, p.body ? h("div", { class: "plan-body", text: p.body }) : null,
            AVF.printPlan ? h("div", { class: "row pr-row" }, AVF.printButton(function () { AVF.printPlan({ kind: kind, plan: p, ctx: ctx }); })) : null] });
      }));
    }
    function load() {
      var c = planCache[kind], cs = planCache.supplement, cached = c && c.rows && AVF.planCatalog && window.AVF_CAT_READY;
      if (cached) paint(c.rows, cs && cs.rows); else AVF.mount(list, AVF.skeleton(2));
      if (c && c.p && Date.now() - (c.at || 0) > 20000) c.p = null;   // 20 sn'den eski önbellek arka planda tazelenir
      Promise.all([fetchPlans(kind), AVF.planCatalog ? AVF.planCatalog(false).then(function (x) { window.AVF_CAT_READY = true; return x; }, function () { return null; }) : null, hasSupp ? fetchPlans("supplement").catch(function () { return []; }) : null]).then(function (r) {
        if (!el.isConnected) return;
        paint(r[0], r[2]);
      }, function (e) { if (!cached) AVF.mount(list, AVF.state("alert", "Planlar yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { delete planCache[kind]; load(); } }, "Tekrar dene"))); });
    }
    load();
    setTimeout(prefetchPlans, 300);
  }

  function notifText(n) {
    var d = n.data || {};
    if (n.type === "ticket") return h("div", { text: n.text });
    if (n.type === "plan_published" && d.kind && AVF.KIND[d.kind]) return h("div", {}, h("span", {}, "Yeni plan yayınlandı: "), h("span", {}, AVF.KIND[d.kind].label), h("span", {}, " — "), h("span", { "data-notr": "", text: d.title || "" }));
    if (n.type === "plan_updated") return h("div", {}, h("span", { text: "Planlarınız güncellendi" }), d.kinds && d.kinds.length ? h("small", { class: "nk", text: d.kinds.filter(function (k) { return AVF.KIND[k]; }).map(function (k) { return AVF.t(AVF.KIND[k].label); }).join(" · ") }) : null);
    if (n.type === "level_up" && d.name) return h("div", {}, h("span", { text: "Tebrikler! Forum seviyeniz yükseldi: " }), h("b", { text: d.name }));
    if (n.type === "friend") return h("div", { text: n.text });
    // forum bildirimi: konu başlığı kullanıcı içeriğidir (çevrilmez); moderasyon gerekçesi ve toplu sayı ayrıca gösterilir
    if (n.type === "forum") return h("div", { "data-notr": "" }, h("span", { text: n.text }), d.count > 1 ? h("small", { class: "nk", text: d.count + " yeni" }) : null, d.reason ? h("small", { class: "nk", text: "Gerekçe: " + d.reason }) : null);
    return h("div", { text: n.text });
  }
  /** Bir gruptaki (ya da tüm) bildirimleri temizle — onay sorulur (okundu işaretlemede sorulmaz). */
  function clearAllNotifs(group, done) {
    var lbl = group === "forum" ? "Forum bildirimleri" : group === "coach" ? "Koçluk ve sistem bildirimleri" : "Tüm bildirimler";
    AVF.confirmDialog({ icon: "trash", danger: true, title: lbl + " silinsin mi?", text: "Bu işlem geri alınamaz.", confirm: "Evet, sil", cancel: "Vazgeç" }).then(function (y) {
      if (!y) return;
      AVF.api("DELETE", "/notifications" + (group ? "?group=" + group : "")).then(function () { refreshUnread(); if (done) done(); AVF.toast(AVF.t(lbl + " silindi.")); }, function (e) { AVF.toast(AVF.errText(e)); });
    });
  }
  function notificationsView(el, tabArg) {
    var tab = tabArg || nTab(), rows = [];
    var tools = h("div", { class: "row" }), tabsBox = h("div"), list = h("div", { class: "stack" }, AVF.skeleton(3));
    AVF.mount(el, h("div", { class: "row between nhead" }, h("h2", { class: "ptitle", style: "margin:0", text: "Bildirimler" }), tools), tabsBox, list);
    function mine() { return rows.filter(function (r) { return ngroup(r) === tab; }); }
    function empty() {
      AVF.mount(list, tab === "forum" ? AVF.state("msg", "Forum bildirimi yok", "Yanıtlar, alıntılar, @anmalar, seviye ve arkadaşlık bildirimleri burada görünür.")
        : AVF.state("bell", "Bildirim yok", "Yeni planlar, siparişler, destek yanıtları ve güvenlik uyarıları burada görünür."));
    }
    // Düğmeler yalnız bu sekmede bildirim varken görünür (boş listede silme/okundu işlemi sunulmaz).
    function paintTools() {
      var m = mine(), un = m.filter(function (r) { return !r.read_at; }).length;
      AVF.mount(tools, un ? h("button", { class: "btn ghost sm", type: "button", onclick: function () {
          AVF.api("POST", "/notifications/read-all?group=" + tab, {}).then(function () { m.forEach(function (r) { r.read_at = r.read_at || new Date().toISOString(); }); refreshUnread(); paintAll(); }); } }, AVF.icon("check", "bico"), "Tümünü okundu işaretle") : null,
        m.length ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { clearAllNotifs(tab, function () { rows = rows.filter(function (r) { return ngroup(r) !== tab; }); paintAll(); }); } }, AVF.icon("trash", "bico"), "Temizle") : null);
      AVF.mount(tabsBox, nTabs(rows, tab, function (t) { tab = t; setNTab(t); paintAll(); }, "np-tabs"));
    }
    function paintAll() {
      paintTools();
      var m = mine();
      if (!m.length) return empty();
      AVF.mount(list, m.map(function (n) {
        var card = h("div", { class: "card ncard" + (n.read_at ? "" : " new") }, h("span", { class: "tile" + (n.type === "security" ? " teal" : "") }, AVF.icon(notifIcon(n))),
          h("a", { class: "nbody", href: notifTarget(n), onclick: function (e) { e.preventDefault(); go(notifTarget(n)); } }, notifText(n), h("small", { text: AVF.fmtDateTime(n.created_at) })),
          h("button", { class: "ibtn", type: "button", "aria-label": AVF.t("Bildirimi sil"), title: AVF.t("Bildirimi sil"), onclick: function () {
            // anında kaldırılır (bekleme yok); sunucu hata verirse geri gelir
            card.classList.add("gone");
            rows = rows.filter(function (r) { return r !== n; });
            setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); if (!mine().length) empty(); paintTools(); }, 180);
            if (!n.read_at && unread) { unread--; renderChrome(); }
            AVF.api("DELETE", "/notifications/" + n.id).then(null, function (e) { AVF.toast(AVF.errText(e)); notificationsView(el, tab); });
          } }, AVF.icon("trash")));
        return card;
      }));
      if (m.some(function (r) { return !r.read_at; })) setTimeout(function () { /* görüntülenince okundu */
        if (!el.isConnected) return;
        AVF.api("POST", "/notifications/read-all?group=" + tab, {}).then(function () { refreshUnread(); }, function () {});
      }, 2500);
    }
    AVF.api("GET", "/notifications").then(function (r) {
      rows = r; unread = rows.filter(function (x) { return !x.read_at; }).length; renderChrome();
      if (!tabArg && !mine().some(function (x) { return !x.read_at; }) && rows.some(function (x) { return !x.read_at; })) tab = tab === "forum" ? "coach" : "forum";
      paintAll();
    }, function (e) { AVF.mount(tools, null); AVF.mount(list, AVF.state("alert", "Bildirimler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { notificationsView(el, tab); } }, "Tekrar dene"))); });
  }

  function accountView(el, u) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Hesap Ayarları" }), h("div", { class: "stack" }, AVF.skeleton(2)));
    AVF.api("GET", "/auth/me").then(function (me) {
      Object.keys(me).forEach(function (k) { u[k] = me[k]; });
      AVF.mount(el, h("h2", { class: "ptitle", text: "Hesap Ayarları" }), h("div", { class: "stack" }, AVF.accountSections(u, function () {}, function () { sessionGone(); })));
    }, function (e) { AVF.mount(el, AVF.state("alert", "Hesap bilgileri yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { accountView(el, u); } }, "Tekrar dene"))); });
  }

  // ---------- çerez bildirimi (yalnız gerekli çerezler; tek düğme) ----------
  function cookieBanner() {
    try { if (localStorage.getItem("avf_cookie")) return; } catch (e) { /* depolama yok: yine göster */ }
    var b = h("div", { class: "ck", role: "region", "aria-label": "Çerez bildirimi" }, h("b", null, h("span", { class: "tile" }, AVF.icon("cookie")), "Çerezler"),
      h("p", { text: "Oturumunuzu açık tutmak ve siteyi kötüye kullanıma karşı korumak için gerekli çerezleri kullanırız. Reklam veya izleme çerezi kullanmayız." }),
      h("button", { class: "btn block", type: "button", onclick: function () { try { localStorage.setItem("avf_cookie", String(Date.now())); } catch (e) { /* yok say */ } b.parentNode.removeChild(b); } }, "Kabul et"));
    document.body.appendChild(b);
  }

  // ---------- açılış ----------
  // Hız: oturum ipucu (yalnız "1", kişisel veri yok). Misafir genel sayfaları oturum yanıtını beklemeden hemen görür;
  // oturumu olan üyenin panel/forum verisi, oturum sorgusuyla AYNI ANDA istenir (bir gidiş-dönüş tasarrufu).
  function hint(v) { try { if (v === undefined) return localStorage.getItem("avf_s") === "1"; if (v) localStorage.setItem("avf_s", "1"); else localStorage.removeItem("avf_s"); } catch (e) { return false; } }
  AVF._pre = {};
  AVF.take = function (path) { var p = AVF._pre[path]; delete AVF._pre[path]; return p || AVF.api("GET", path); };
  function boot() {
    buildShell();
    var p0 = location.pathname, priv = /^\/(panel|forum|giris|kayit|sifremi-unuttum|admin)(\/|$)/.test(p0), had = hint(), early = !priv && !had;
    if (early) route();   // misafir: sayfa anında
    else if (had) {
      if (/^\/panel(\/|$)/.test(p0)) AVF._pre["/plans/overview"] = AVF.api("GET", "/plans/overview");
      if (/^\/forum(\/|$)/.test(p0)) AVF._pre["/board/home"] = AVF.api("GET", "/board/home");
      Object.keys(AVF._pre).forEach(function (k) { AVF._pre[k].catch(function () { /* asıl istek yeniden dener */ }); });
      AVF.mount(view, h("div", { class: "wrap section" }, AVF.skeleton(3)));
    }
    AVF.api("GET", "/auth/me").then(function (u) { AVF.session.user = u; hint(true); }, function () { AVF.session.user = null; hint(false); AVF._pre = {}; }).then(function () {
      if (!early || AVF.session.user) route(); else renderChrome();
      refreshUnread(); liveStart(); AVF.auth.checkResetLink();
      // Bildirim ve mesaj sayacı: sekme görünürken 60 sn'de bir, sekmeye dönünce hemen tazelenir.
      setInterval(function () { if (!document.hidden && AVF.session.user && !live.ok) refreshUnread(); }, 60000);   // anlık bağlantı varken yoklama gereksiz
      document.addEventListener("visibilitychange", function () { if (!document.hidden && AVF.session.user) refreshUnread(); }); if (AVF.auth.restore) AVF.auth.restore(); cookieBanner();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
