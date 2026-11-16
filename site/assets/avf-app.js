/* Alpvefit — site kabuğu, yönlendirme, ana sayfa ve üye paneli.
   Panel düzeni Alpeptit "Kullanıcı Paneli" ile aynıdır (koyu üst çubuk + kahraman bandı + sol menü/kullanıcı kartı + akordeyon kartlar;
   mobilde yatay kaydırmalı sekme menüsü). İçerik Alpvefit hizmetlerine uyarlanmıştır: yalnız kullanıcının KENDİ, YAYINLANMIŞ planları. */
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
  function buildShell() {
    var root = document.getElementById("app");
    nav = h("nav", { class: "nav", "aria-label": "Ana menü" });
    tools = h("div", { class: "tools" });
    drawer = h("div", { class: "drawer", onclick: function (e) { if (e.target === drawer) drawer.classList.remove("open"); } });
    view = h("main", { id: "main", tabindex: "-1" });
    AVF.mount(root,
      h("a", { class: "sr", href: "#main" }, "İçeriğe geç"),
      h("header", { class: "top" }, h("div", { class: "wrap" },
        h("button", { class: "ibtn burger", type: "button", "aria-label": "Menüyü aç", onclick: function () { drawer.classList.add("open"); } }, AVF.icon("menu")),
        link("/", [h("i"), "ALPVEFIT"], { class: "logo", "aria-label": "Alpvefit ana sayfa" }), nav, tools)),
      drawer, view,
      h("footer", { class: "foot" }, h("div", { class: "wrap" }, h("span", null, "© " + new Date().getFullYear() + " Alpvefit"),
        h("nav", { class: "flinks", "aria-label": "Yasal" }, AVF.LEGAL_LINKS.map(function (l) { return link("/yasal/" + l[0], l[1]); })), h("span", null, "Eğitim ve koçluk platformu"))));
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-link]"); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault(); drawer.classList.remove("open"); go(a.getAttribute("href"));
    });
    window.addEventListener("popstate", route);
  }
  function renderChrome() {
    var u = AVF.session.user, path = location.pathname;
    var items = [["/", "home", "Ana Sayfa"], ["/paketler", "tag", "Paketler"]]; if (u) items.push(["/panel", "user", "Panelim"]);
    if (u && (u.role === "coach" || u.role === "admin")) items.push(["/uzman", "users", "Uzman Paneli"]);
    AVF.mount(nav, items.map(function (i) { var a = i[0] === "/uzman" ? h("a", { href: i[0] }, AVF.icon(i[1]), i[2]) : link(i[0], [AVF.icon(i[1]), i[2]]); if (i[0] === "/" ? path === "/" : path.indexOf(i[0]) === 0) a.setAttribute("aria-current", "page"); return a; }));
    AVF.mount(drawer, h("nav", null, h("span", { class: "logo", style: "margin-bottom:12px" }, h("i"), "ALPVEFIT"), items.map(function (i) { return i[0] === "/uzman" ? h("a", { href: i[0] }, i[2]) : link(i[0], i[2]); }),
      u ? h("a", { href: "#", onclick: function (e) { e.preventDefault(); logout(); } }, "Çıkış yap") : h("a", { href: "#", onclick: function (e) { e.preventDefault(); drawer.classList.remove("open"); AVF.auth.open("login"); } }, "Giriş yap / Kayıt ol")));
    AVF.mount(tools,
      h("button", { class: "ibtn lang", type: "button", "aria-label": AVF.lang === "en" ? "Türkçe’ye geç" : "Switch to English", title: AVF.lang === "en" ? "Türkçe" : "English", onclick: function () { AVF.setLang(AVF.lang === "en" ? "tr" : "en"); } }, h("span", { "data-notr": "" }, AVF.lang === "en" ? "TR" : "EN")),
      u ? link("/panel/bildirimler", [AVF.icon("bell"), unread ? h("span", { class: "badge", "aria-label": unread + " okunmamış bildirim", text: String(unread > 99 ? "99+" : unread) }) : null], { class: "ibtn", "aria-label": "Bildirimler" }) : null,
      h("button", { class: "ibtn", type: "button", "aria-label": u ? "Panelim" : "Giriş yap veya kayıt ol", onclick: function () { if (u) go("/panel"); else AVF.auth.open("login"); } }, AVF.icon("user"), u ? h("i", { class: "dot" }) : null),
      u ? h("button", { class: "ibtn", type: "button", "aria-label": "Çıkış yap", onclick: logout }, AVF.icon("out")) : null);
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
    if (why === "locked") { go("/"); AVF.auth.locked(data); return; }
    if (why === "expired") AVF.toast("Oturumunuz sona erdi. Lütfen yeniden giriş yapın.", "err");
    if (location.pathname.indexOf("/panel") === 0) go("/"); else route();
  }
  AVF.onSessionEnd = sessionGone;
  AVF.onLogin = function () { kinds = null; renderChrome(); refreshUnread(); if (location.pathname === "/" || location.pathname === "/giris" || location.pathname === "/kayit") go("/panel", true); else route(); };

  // ---------- yönlendirme ----------
  function route() {
    var p = location.pathname.replace(/\/+$/, "") || "/";
    renderChrome(); document.title = "Alpvefit";
    if (p === "/giris" || p === "/kayit" || p === "/sifremi-unuttum") { if (AVF.session.user) return go("/panel", true); homePage(); return AVF.auth.open(p === "/kayit" ? "register" : "login"); }
    if (p === "/") return homePage();
    if (p === "/paketler") return AVF.packagesPage(view);
    if (p.indexOf("/yasal/") === 0 && AVF.legalPage(view, p.slice(7))) return;
    if (p === "/panel" || p.indexOf("/panel/") === 0) return panelPage(p.slice(7));
    notFound();
  }
  function notFound() {
    document.title = "Sayfa bulunamadı — Alpvefit";
    AVF.mount(view, h("div", { class: "wrap section" }, AVF.state("alert", "Sayfa bulunamadı", "Aradığınız sayfa mevcut değil veya taşınmış olabilir.", link("/", "Ana sayfaya dön", { class: "btn" }))));
  }

  // ---------- ana sayfa ----------
  function pic(name, alt, cls) {
    return h("picture", null, h("source", { type: "image/webp", srcset: "/assets/img/" + name + ".webp" }), h("img", { class: cls || "", src: "/assets/img/" + name + ".jpg", alt: alt, loading: "lazy", decoding: "async" }));
  }
  function homePage() {
    var u = AVF.session.user;
    AVF.mount(view,
      h("section", { class: "hero hero-split" }, h("div", { class: "wrap" },
        h("div", { class: "hero-copy" },
          h("div", { class: "eyebrow" }, "Uzaktan eğitim ve koçluk"),
          h("h1", { text: "Alpvefit" }),
          h("p", { text: "Beslenme, antrenman ve takviye programlarınız uzman koçlar tarafından size özel hazırlanır; tek bir yerde, yalnızca sizin hesabınızda yayınlanır." }),
          h("div", { class: "cta" }, link("/paketler", "Paketleri incele", { class: "btn" }), u ? link("/panel", "Panelime git", { class: "btn ghost" }) : h("button", { class: "btn ghost", type: "button", onclick: function () { AVF.auth.open("register"); } }, "Kayıt ol")),
          h("ul", { class: "heroTicks" }, h("li", {}, "Ödemeden sonra 7 gün içinde programınız hazır"), h("li", {}, "Kredi / banka kartı ile güvenli ödeme"), h("li", {}, "Planlarınızı yalnızca siz görürsünüz"))),
        h("div", { class: "hero-photo" }, pic("coach-1", "Alpvefit koçu", "")))),
      h("section", { class: "section" }, h("div", { class: "wrap" }, h("h2", { class: "sec" }, "Nasıl çalışır?"),
        h("div", { class: "grid3" },
          step("1", "card", "Paketini seç ve öde", "Size uygun paketi ve süreyi seçin. Kredi / banka kartı ile sanal POS üzerinden ödeyin; ödeme otomatik onaylanır."),
          step("2", "id", "Bilgilerini ekle", "Boy, kilo, günlük adım sayınız gibi bilgileri panelinizden isteğe bağlı olarak ekleyin; kayıt sırasında istenmez."),
          step("3", "list", "7 gün içinde programın hazır", "Beslenme, antrenman ve takviye programlarınız uzmanlarımızca hazırlanıp panelinizde yayınlanır, size bildirim gelir.")))),
      h("section", { class: "section alt" }, h("div", { class: "wrap grid3" },
        feat("globe", "Uzaktan eğitim", "Nerede olursanız olun uzmanınızla çalışın. Başlangıç, İleri Seviye ve Yarışmacı paketleri.", "Online", true),
        feat("pin", "Yüz yüze eğitim", "Yüz yüze eğitim paketi için bizimle iletişime geçin: destek@alpvefit.com", "Yüz yüze", false),
        feat("list", "Kişiye özel planlar", "Planlarınız yetkili uzman tarafından hazırlanır; kimin hazırladığı ve ne zaman yayınlandığı her planda görünür.", "Planlarım", false))),
      h("section", { class: "section" }, h("div", { class: "wrap about" },
        h("div", { class: "about-photo" }, pic("coach-2", "Alpvefit koçu", "")),
        h("div", {}, h("h2", { class: "sec" }, "Programınız size özel"),
          h("p", { class: "lead" }, "Her program kişinin hedefine, yaşam düzenine ve sağlık durumuna göre uzmanlar tarafından elle hazırlanır. Otomatik üretilmiş şablon kullanılmaz."),
          h("ul", { class: "ticks" }, h("li", {}, "Programı hazırlayan uzmanın adı ve yayın tarihi her planda yer alır"), h("li", {}, "Farmakoloji içeriği isteğe bağlıdır; yalnızca yetkili uzmanlarca ve ilgili paketlerde eklenir"), h("li", {}, "Alpvefit herhangi bir ürün veya madde satmaz")),
          h("div", { style: "margin-top:18px" }, link("/paketler", "Paketleri incele", { class: "btn" }))))),
      h("section", { class: "section alt" }, h("div", { class: "wrap narrow" }, h("h2", { class: "sec" }, "Sık sorulanlar"),
        h("div", { class: "stack" },
          faq("Ödeme nasıl yapılıyor?", "Kredi / banka kartı ile sanal POS üzerinden ödenir. Kart bilgileriniz Alpvefit sunucularında saklanmaz. Şu an test aşamasındayız; ödeme sahte (deneme) sanal POS ile yapılır ve gerçek tahsilat olmaz."),
          faq("Programım ne zaman hazır olur?", "Ödemeniz onaylandıktan sonra 7 gün içinde. Her plan yayınlandığında panelinizde görünür ve bildirim alırsınız."),
          faq("Kişisel bilgilerimi vermek zorunda mıyım?", "Hayır, isteğe bağlıdır. Boy, kilo, meslek gibi bilgiler programın size uygun hazırlanmasına yardımcı olur; açık rızanızla kaydedilir ve istediğiniz zaman silebilirsiniz."),
          faq("Farmakoloji desteği zorunlu mu?", "Hayır. İleri Seviye ve Yarışmacı paketlerinde yer alır ancak tamamen isteğe bağlıdır; hiçbir üyeye zorunlu kılınmaz. Karar ve sorumluluk üyeye aittir."))))
    );
  }
  function step(n, icon, title, text) {
    return h("div", { class: "card feat" }, h("div", { class: "stepn" }, h("span", { class: "tile" }, AVF.icon(icon)), h("i", { "data-notr": "", text: n })), h("h3", { text: title }), h("p", { text: text }));
  }
  function faq(q, a) { return AVF.accordion({ icon: "list", title: q, content: h("p", { style: "margin:0;color:var(--muted)", text: a }) }); }
  function feat(icon, title, text, chip, teal) {
    return h("div", { class: "card feat" }, h("span", { class: "tile" + (teal ? " teal" : "") }, AVF.icon(icon)), h("h3", { text: title }), h("p", { text: text }), h("div", { style: "margin-top:14px" }, h("span", { class: "chip" + (teal ? "" : " lime"), text: chip })));
  }

  // ---------- panel ----------
  function panelHero(title, sub) {
    return h("section", { class: "hero", style: "padding:56px 0 60px" }, h("div", { class: "wrap" }, h("div", { class: "eyebrow", text: "Hesabım" }), h("h1", { text: title }), h("p", { text: sub })));
  }
  function panelPage(sub) {
    var u = AVF.session.user;
    if (!u) {
      AVF.mount(view, panelHero("Kullanıcı Paneli", "Hesabınızla ilgili işlemleri buradan yönetebilirsiniz."), h("div", { class: "wrap section" }, AVF.state("lock", "Giriş yapmanız gerekiyor", "Planlarınızı görmek için hesabınıza giriş yapın.", h("button", { class: "btn", type: "button", onclick: function () { AVF.auth.open("login"); } }, "Giriş yap"))));
      return AVF.auth.open("login");
    }
    document.title = "Kullanıcı Paneli — Alpvefit";
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
      items.push(["siparisler", "card", "Siparişlerim"], ["profil", "id", "Kişisel Bilgilerim"], ["bildirimler", "bell", "Bildirimler"], ["hesap", "cog", "Hesap Ayarları"]);
      AVF.mount(menuEl, items.map(function (i) {
        var a = link("/panel" + (i[0] ? "/" + i[0] : ""), [AVF.icon(i[1]), i[2], i[0] === "bildirimler" && unread ? h("span", { class: "badge", text: String(unread) }) : null]);
        if (i[0] === sub || (i[0] === "siparisler" && sub.indexOf("siparis/") === 0)) a.setAttribute("aria-current", "page"); return a;
      }));
    }
    function draw() {
      paintMenu();
      if (sub === "hesap") return accountView(content, u);
      if (sub === "bildirimler") return notificationsView(content);
      if (sub === "siparisler") return AVF.ordersView(content);
      if (sub === "profil") return AVF.profileView(content);
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
    if (o.coaches.length) el.appendChild(h("div", { class: "note" }, "Koçluk biçimi: ", o.coaches.map(function (c) { return c.name + " — " + AVF.DELIVERY[c.delivery]; }).join(" · ")));
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
    if (!ok) return el.appendChild(AVF.state("lock", "Bu bölüm hesabınız için etkin değil", "Erişim izni uzmanınız veya yönetici tarafından tanımlanır.", link("/panel", "Planlarıma dön", { class: "btn" })));
    var list = h("div", { class: "stack" }, AVF.skeleton(2)); el.appendChild(list);
    if (kind === "supplement" || kind === "pharmacology") el.insertBefore(h("div", { class: "note" }, "Bu bölümde yalnızca yetkili uzmanınızın girdiği içerik gösterilir."), list);
    function load() {
      AVF.mount(list, AVF.skeleton(2));
      AVF.api("GET", "/plans?kind=" + kind).then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state(m.icon, "Henüz yayınlanmış plan yok", "Uzmanınız bir plan yayınladığında burada görünür ve size bildirim gelir."));
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
      route(); refreshUnread(); AVF.auth.checkResetLink(); cookieBanner();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
