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
  function go(path, replace) { if (location.pathname === path) { route(); return; } history[replace ? "replaceState" : "pushState"](null, "", path); route(); window.scrollTo(0, 0); }
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
    renderFooter(); route(true);
    document.body.classList.remove("lang-in"); void document.body.offsetWidth; document.body.classList.add("lang-in");
    setTimeout(function () { document.body.classList.remove("lang-in"); }, 600);
  });
  var footEl;
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
        h("button", { class: "ibtn burger", type: "button", "aria-label": "Menüyü aç", onclick: function () { drawer.classList.add("open"); } }, AVF.icon("menu")),
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
  var NAV = [["/", "home", "Ana Sayfa"], ["/hakkimizda", "users", "Hakkımızda"], ["/sss", "help", "SSS"], ["/paketler", "tag", "Paketler"], ["/araclar", "wrench", "Araçlar"], ["/forum", "msg", "Forum"], ["/panel", "user", "Hesap"]];
  var LEGAL_ICONS = { kvkk: "shield", "kullanim-kosullari": "file", "gizlilik-cerez": "lock" };
  AVF.openTicket = function () {
    if (AVF.session.user) return go("/panel/destek/yeni");
    AVF.toast("Destek talebi oluşturmak için giriş yapın.");
    AVF.afterLogin = { path: "/panel/destek/yeni", at: Date.now() }; AVF.auth.open("login");
  };
  function renderFooter() {
    function col(icon, title, rows) {
      return h("div", { class: "fcol" }, h("h4", {}, AVF.icon(icon), h("span", { text: title })), h("ul", {}, rows.map(function (r) { return h("li", {}, r); })));
    }
    function fl(href, icon, text) { return link(href, [AVF.icon(icon), h("span", { text: text })]); }
    AVF.mount(footEl, h("div", { class: "wrap" },
      h("div", { class: "ftgrid" },
        h("div", { class: "fbrand" }, AVF.logo(true), h("p", { text: "Uzaktan eğitim ve birebir koçluk platformu. Programlarınız koçunuz tarafından, yalnızca size özel hazırlanır." }),
          null),
        col("building", "Kurumsal", [fl("/", "home", "Ana Sayfa"), fl("/hakkimizda", "users", "Hakkımızda"), fl("/sss", "help", "SSS")]),
        col("compass", "Keşfet", [fl("/paketler", "tag", "Paketler"), fl("/blog", "book", "Blog"), fl("/forum", "msg", "Forum"), fl("/araclar", "wrench", "Araçlar")]),
        col("scale", "Yasal", AVF.LEGAL_LINKS.map(function (l) { return fl("/yasal/" + l[0], LEGAL_ICONS[l[0]] || "file", l[1]); })),
        col("headset", "İletişim", [h("a", { href: "mailto:destek@alpvefit.com" }, AVF.icon("mail"), h("span", { text: "destek@alpvefit.com" })),
          h("a", { href: "/panel/destek/yeni", onclick: function (e) { e.preventDefault(); AVF.openTicket(); } }, AVF.icon("ticket"), h("span", { text: "Ticket gönder" })),
          h("a", { href: "#", onclick: function (e) { e.preventDefault(); if (AVF.chat) AVF.chat.open(); } }, AVF.icon("chat"), h("span", { text: "Canlı destek" }))])),
      h("div", { class: "fbottom" }, h("span", { "data-notr": "" }, "© " + new Date().getFullYear() + " AlpveFit"), h("span", { text: "Uzaktan eğitim ve koçluk platformu" }))));
  }
  function renderChrome() {
    var u = AVF.session.user, path = location.pathname;
    function active(href) { return href === "/" ? path === "/" : path === href || path.indexOf(href + "/") === 0; }
    function item(i) {
      if (i[0] === "/panel" && !u) {
        return h("a", { href: "/giris", onclick: function (e) { e.preventDefault(); drawer.classList.remove("open"); AVF.auth.open("login"); } }, AVF.icon(i[1]), h("span", { text: i[2] }));
      }
      var a = link(i[0], [AVF.icon(i[1]), h("span", { text: i[2] }), i[0] === "/forum" ? h("em", { class: "soon", text: "Yakında" }) : null]);
      if (active(i[0])) a.setAttribute("aria-current", "page"); return a;
    }
    AVF.mount(nav, NAV.map(item));
    AVF.mount(drawer, h("nav", null, h("div", { class: "dhead" }, AVF.logo(false), h("button", { class: "ibtn", type: "button", "aria-label": "Menüyü kapat", onclick: function () { drawer.classList.remove("open"); } }, AVF.icon("x"))),
      NAV.filter(function (i) { return i[0] !== "/forum"; }).map(item),
      h("div", { class: "dsep" }),
      link("/blog", [AVF.icon("book"), h("span", { text: "Blog" })]),
      item(NAV.filter(function (i) { return i[0] === "/forum"; })[0]),
      u && (u.role === "coach" || u.role === "admin") ? [h("div", { class: "dsep" }), h("a", { href: "/uzman" }, AVF.icon("users"), h("span", { text: "Uzman Paneli" }))] : null,
      u ? h("a", { href: "#", onclick: function (e) { e.preventDefault(); logout(); } }, AVF.icon("out"), h("span", { text: "Çıkış yap" })) : null,
      h("div", { class: "dlang" }, langSwitch())));
    AVF.mount(tools,
      langSwitch(),
      u ? link("/panel/bildirimler", [AVF.icon("bell"), unread ? h("span", { class: "badge", "aria-label": unread + " okunmamış bildirim", text: String(unread > 99 ? "99+" : unread) }) : null], { class: "ibtn", "aria-label": "Bildirimler", title: "Bildirimler" }) : null,
      u && (u.role === "coach" || u.role === "admin") ? h("a", { class: "ibtn desk-only", href: "/uzman", "aria-label": "Uzman paneli", title: "Uzman paneli" }, AVF.icon("users")) : null,
      u ? link("/panel", [AVF.icon("user"), h("span", { text: "Panelim" })], { class: "ubtn" }) : h("button", { class: "ubtn", type: "button", onclick: function () { AVF.auth.open("login"); } }, AVF.icon("user"), h("span", { text: "Giriş yap" })),
      u ? h("button", { class: "ibtn desk-only", type: "button", "aria-label": "Çıkış yap", title: "Çıkış yap", onclick: logout }, AVF.icon("out")) : null,
      // mobil üst çubuk: Menü | Logo | Forum (giriş / kayıt menüde ve ana sayfada)
      link("/forum", AVF.icon("msg"), { class: "ibtn mob-only", "aria-label": "Forum", title: "Forum" }));
  }
  function refreshUnread() {
    if (!AVF.session.user) { unread = 0; return renderChrome(); }
    AVF.api("GET", "/notifications").then(function (rows) { unread = rows.filter(function (r) { return !r.read_at; }).length; renderChrome(); }, function () { /* sessiz */ });
  }
  function logout() {
    AVF.api("POST", "/account/logout", {}).then(null, function () { /* oturum zaten kapalı olabilir */ }).then(function () { sessionGone(); AVF.toast("Çıkış yapıldı."); });
  }
  function sessionGone(why, data) {
    AVF.session.user = null; kinds = null; unread = 0; renderChrome();
    if (AVF.chat) AVF.chat.sessionChanged();
    if (why === "locked") { go("/"); AVF.auth.locked(data); return; }
    if (why === "expired") AVF.toast("Oturumunuz sona erdi. Lütfen yeniden giriş yapın.", "err");
    if (location.pathname.indexOf("/panel") === 0) go("/"); else route();
  }
  AVF.onSessionEnd = sessionGone;
  AVF.onLogin = function () {
    kinds = null; renderChrome(); refreshUnread(); if (AVF.chat) AVF.chat.sessionChanged();
    var next = AVF.afterLogin; AVF.afterLogin = null;
    if (next && Date.now() - next.at < 10 * 60000) return go(next.path, true);
    if (location.pathname === "/" || location.pathname === "/giris" || location.pathname === "/kayit") go("/panel", true); else route();
  };

  // ---------- yönlendirme ----------
  function route(rerender) {
    var p = location.pathname.replace(/\/+$/, "") || "/";
    renderChrome(); document.title = "AlpveFit";
    if (!rerender) document.body.classList.remove("lang-swap");
    if (p === "/giris" || p === "/kayit" || p === "/sifremi-unuttum") { if (AVF.session.user) return go("/panel", true); homePage(); return AVF.auth.open(p === "/kayit" ? "register" : "login"); }
    if (p === "/") return homePage();
    if (p === "/paketler") return AVF.packagesPage(view);
    if (p === "/sss") return AVF.pages.faq(view);
    if (p === "/hakkimizda") return AVF.pages.about(view);
    if (p === "/forum") return AVF.pages.forum(view);
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
    AVF.mount(view, h("div", { class: "wrap section" }, AVF.state("alert", "Sayfa bulunamadı", "Aradığınız sayfa mevcut değil veya taşınmış olabilir.", link("/", "Ana sayfaya dön", { class: "btn" }))));
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
          h("span", { class: "eyebrow" }, AVF.icon("globe"), "Uzaktan eğitim ve koçluk"),
          h("div", { class: "titlerow" }, h("h1", { text: "Size özel program, uzman koçluk." }), mslot),
          h("p", { text: "Beslenme, antrenman ve takviye programlarınız uzman koçunuz tarafından size özel hazırlanır; tek bir yerde, yalnızca sizin hesabınızda yayınlanır." }),
          h("div", { class: "cta" }, link("/paketler", "Paketleri incele", { class: "btn" }), u ? link("/panel", "Panelime git", { class: "btn ghost" }) : h("button", { class: "btn ghost", type: "button", onclick: function () { AVF.auth.open("register"); } }, "Kayıt ol")),
          h("ul", { class: "heroTicks" },
            h("li", {}, h("span", { class: "tk" }, AVF.icon("clock")), h("span", { text: "Ödemeden sonra 24 saat içinde programınız hazır!" })),
            h("li", {}, h("span", { class: "tk" }, AVF.icon("card")), h("span", { text: "Kredi / banka kartı ile güvenli ödeme" })),
            h("li", {}, h("span", { class: "tk" }, AVF.icon("lock")), h("span", { text: "Planlarınız kişisel ve yalnızca size aittir" })))),
        h("div", { class: "stagewrap" }, stage))),
      h("section", { class: "section" }, h("div", { class: "wrap" },
        h("div", { class: "shead center" }, h("span", { class: "kicker" }, AVF.icon("help"), h("span", { text: "Neden AlpveFit?" })), h("h2", { class: "sec", text: "Eğitim sürecinizin tamamı tek hesapta" }), h("p", { text: "Size özel hazırlanan, yalnızca sizin görebileceğiniz ve 24 saat içinde teslim edilen planlar." })),
        h("div", { class: "grid3" },
          feat("globe", "Uzaktan eğitim ve koçluk", "Nerede olursanız olun koçunuzla birebir çalışın. Başlangıç, İleri Seviye ve Yarışmacı paketleri."),
          feat("target", "Kişiye özel planlar", "Her plan hedefinize ve yaşam düzeninize göre koçunuz tarafından bizzat hazırlanır; hazır şablon kullanılmaz."),
          feat("clock", "24 saatte teslim", "Ödemeniz onaylandıktan sonra programlarınız 24 saat içinde panelinizde yayınlanır ve bildirim alırsınız.")))),
      h("section", { class: "section dark pkgband" }, h("div", { class: "wrap" },
        h("div", { class: "shead center" }, h("span", { class: "kicker" }, AVF.icon("layers"), "Paketler"), h("h2", { class: "sec", text: "Programınız size özel" }),
          h("p", { text: "Her program kişinin hedefine, yaşam düzenine ve sağlık durumuna göre koçunuz tarafından elle hazırlanır. Otomatik üretilmiş şablon kullanılmaz." })),
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
    var content = h("div", { "aria-live": "polite" });
    var menuEl = h("nav", { class: "card menu", "aria-label": "Panel menüsü" });
    AVF.mount(view, panelHero("Kullanıcı Paneli", "Planlarınızı ve hesabınızı buradan yönetebilirsiniz."),
      h("div", { class: "wrap pbody" },
        h("aside", { class: "side" },
          h("div", { class: "card ucard" }, h("span", { class: "tile" }, AVF.icon("shield")), h("div", null, h("b", { text: AVF.maskName(u.full_name) }), h("small", { text: u.email }), h("span", { class: "ok" }, "✓ E-posta doğrulandı"))), menuEl),
        content));
    function paintMenu() {
      var items = [["", "list", "Planlarım"]];
      (kinds || []).forEach(function (k) { items.push([AVF.KIND[k.kind].slug, AVF.KIND[k.kind].icon, AVF.KIND[k.kind].label]); });
      items.push(["siparisler", "card", "Siparişlerim"], ["profil", "id", "Kişisel Bilgilerim"], ["destek", "ticket", "Destek Taleplerim"], ["bildirimler", "bell", "Bildirimler"], ["hesap", "cog", "Hesap Ayarları"]);
      AVF.mount(menuEl, items.map(function (i) {
        var a = link("/panel" + (i[0] ? "/" + i[0] : ""), [AVF.icon(i[1]), i[2], i[0] === "bildirimler" && unread ? h("span", { class: "badge", text: String(unread) }) : null]);
        if (i[0] === sub || (i[0] === "siparisler" && sub.indexOf("siparis/") === 0) || (i[0] === "destek" && sub.indexOf("destek/") === 0)) a.setAttribute("aria-current", "page"); return a;
      }));
    }
    function draw() {
      paintMenu();
      if (sub === "hesap") return accountView(content, u);
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
    AVF.api("GET", "/plans/overview").then(function (o) { kinds = o.kinds; AVF.overview = o; draw(); }, function (e) {
      AVF.mount(content, AVF.state("alert", "Planlar yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { panelPage(sub); } }, "Tekrar dene")));
    });
  }

  function overviewView(el) {
    var o = AVF.overview || { kinds: [], coaches: [] };
    AVF.mount(el, h("h2", { class: "ptitle", text: "Planlarım" }), AVF.packageStatusCard());
    if (o.coaches.length) el.appendChild(h("div", { class: "note" }, "Koçunuz: ", h("span", { "data-notr": "", text: o.coaches.map(function (c) { return c.name; }).join(", ") })));
    if (!o.kinds.length) return el.appendChild(AVF.state("list", "Henüz erişiminiz açık bir plan bölümü yok", "Bir paket satın aldığınızda ve ödemeniz onaylandığında plan bölümleriniz burada açılır.", link("/paketler", "Paketleri incele", { class: "btn" })));
    el.appendChild(h("div", { class: "stack" }, o.kinds.map(function (k) {
      var m = AVF.KIND[k.kind];
      return link("/panel/" + m.slug, [h("span", { class: "tile" }, AVF.icon(m.icon)),
        h("span", { class: "t", style: "flex:1;min-width:0" }, h("b", { style: "display:block;font-size:16px", text: m.label }), h("small", { style: "color:var(--muted)", text: k.count ? k.count + " yayınlanmış plan" + (k.lastPublishedAt ? " · son: " + AVF.fmtDate(k.lastPublishedAt) : "") : "Henüz yayınlanmış plan yok" })), AVF.icon("chev", "chev")],
        { class: "card", style: "display:flex;align-items:center;gap:14px;padding:16px 18px;text-decoration:none" });
    })));
  }

  function planKindView(el, kind) {
    var m = AVF.KIND[kind], ok = (kinds || []).some(function (k) { return k.kind === kind; });
    AVF.mount(el, h("h2", { class: "ptitle", text: m.label }));
    if (!ok) return el.appendChild(AVF.state("lock", "Bu bölüm hesabınız için etkin değil", "Erişim izni koçunuz tarafından tanımlanır.", link("/panel", "Planlarıma dön", { class: "btn" })));
    var list = h("div", { class: "stack" }, AVF.skeleton(2)); el.appendChild(list);
    if (kind === "supplement" || kind === "pharmacology") el.insertBefore(h("div", { class: "note" }, "Bu bölümde yalnızca koçunuzun bizzat girdiği içerik gösterilir."), list);
    function load() {
      AVF.mount(list, AVF.skeleton(2));
      AVF.api("GET", "/plans?kind=" + kind).then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state(m.icon, "Henüz yayınlanmış plan yok", "Koçunuz bir plan yayınladığında burada görünür ve size bildirim gelir."));
        AVF.mount(list, rows.map(function (p, i) {
          var when = p.starts_on || p.ends_on ? [p.starts_on ? AVF.fmtDate(p.starts_on) : "…", p.ends_on ? AVF.fmtDate(p.ends_on) : "…"].join(" – ") : "";
          return AVF.accordion({ icon: m.icon, open: i === 0, title: p.title, sub: "Hazırlayan: " + p.author_name + " · " + AVF.fmtDate(p.published_at),
            content: [h("div", { class: "meta" }, h("span", null, "Hazırlayan: ", h("b", { text: p.author_name })), h("span", null, "Hazırlanma: " + AVF.fmtDate(p.created_at)), h("span", null, "Yayın: " + AVF.fmtDate(p.published_at) + (p.published_by_name && p.published_by_name !== p.author_name ? " (" + p.published_by_name + ")" : "")),
              p.updated_at && new Date(p.updated_at) - new Date(p.published_at) > 60000 ? h("span", null, "Son güncelleme: " + AVF.fmtDate(p.updated_at)) : null, when ? h("span", null, "Dönem: " + when) : null), h("div", { class: "plan-body", text: p.body })] });
        }));
      }, function (e) { AVF.mount(list, AVF.state("alert", "Planlar yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: load }, "Tekrar dene"))); });
    }
    load();
  }

  function notifText(n) {
    var d = n.data || {};
    if (n.type === "ticket") return h("div", { text: n.text });
    if (n.type === "plan_published" && d.kind && AVF.KIND[d.kind]) return h("div", {}, h("span", {}, "Yeni plan yayınlandı: "), h("span", {}, AVF.KIND[d.kind].label), h("span", {}, " — "), h("span", { "data-notr": "", text: d.title || "" }));
    return h("div", { text: n.text });
  }
  function notificationsView(el) {
    AVF.mount(el, h("div", { class: "row between", style: "margin-bottom:18px" }, h("h2", { class: "ptitle", style: "margin:0", text: "Bildirimler" }), h("button", { class: "btn ghost sm", type: "button", onclick: function () { AVF.api("POST", "/notifications/read-all", {}).then(function () { refreshUnread(); unread = 0; notificationsView(el); }); } }, "Tümünü okundu işaretle")));
    var list = h("div", { class: "stack" }, AVF.skeleton(3)); el.appendChild(list);
    AVF.api("GET", "/notifications").then(function (rows) {
      unread = rows.filter(function (r) { return !r.read_at; }).length; renderChrome();
      if (!rows.length) return AVF.mount(list, AVF.state("bell", "Bildirim yok", "Yeni planlar ve güvenlik uyarıları burada görünür."));
      AVF.mount(list, rows.map(function (n) {
        return h("div", { class: "card", style: "padding:14px 16px;display:flex;gap:12px;align-items:center" + (n.read_at ? ";opacity:.7" : "") }, h("span", { class: "tile" + (n.type === "security" ? " teal" : "") }, AVF.icon(n.type === "security" ? "shield" : "list")),
          h("div", { style: "flex:1;min-width:0" }, notifText(n), h("small", { style: "color:var(--muted)", text: AVF.fmtDateTime(n.created_at) })),
          h("button", { class: "ibtn", style: "color:var(--ink);border-color:var(--line);background:#fff", type: "button", "aria-label": "Bildirimi sil", onclick: function () { AVF.api("DELETE", "/notifications/" + n.id).then(function () { notificationsView(el); }); } }, AVF.icon("trash")));
      }));
      var unreadRows = rows.filter(function (r) { return !r.read_at; }); if (unreadRows.length) setTimeout(function () { /* görüntülenince okundu */ AVF.api("POST", "/notifications/read-all", {}).then(function () { unread = 0; renderChrome(); }, function () {}); }, 2500);
    }, function (e) { AVF.mount(list, AVF.state("alert", "Bildirimler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { notificationsView(el); } }, "Tekrar dene"))); });
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
  function boot() {
    buildShell();
    AVF.api("GET", "/auth/me").then(function (u) { AVF.session.user = u; }, function () { AVF.session.user = null; }).then(function () {
      route(); refreshUnread(); AVF.auth.checkResetLink(); cookieBanner(); if (AVF.chat) AVF.chat.init();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
