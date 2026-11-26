/* AlpveFit — Uzman / Yönetici paneli. Bu dosya yalnız oturumu açık uzman veya yöneticiye sunulur (sunucu denetler).
   Uzman: kendisine atanmış üyeler + yetkili olduğu plan türleri. Yönetici: tüm üyeler/türler + kullanıcı, erişim ve atama yönetimi.
   Plan içeriğini YALNIZ buradan insanlar girer; sistem hiçbir içerik üretmez veya önermez. Her yetki sunucuda ayrıca denetlenir. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var me = null, view, tab = "uyeler", sel = null;
  var KINDS = Object.keys(AVF.KIND);
  var PKG = { starter: "Başlangıç Paketi", advanced: "İleri Seviye Program", competitor: "Yarışmacı Paketi" };
  var OSTATUS = { pending: "Ödeme bekleniyor", paid: "Ödendi", expired: "Süresi doldu", cancelled: "İptal edildi" };
  function pkgText(o) { return o ? (PKG[o.package_key] || o.package_key) + " · " + o.weeks + " hafta" : ""; }
  var STATUS = { draft: ["Üyede görünmüyor", "chip lime"], published: ["Üyede görünüyor", "chip"], archived: ["Arşiv", "chip lime"] };

  function langSwitch() {
    var wrap = h("div", { class: "lang", role: "group", "aria-label": "Dil seçimi", "data-notr": "", "data-on": AVF.lang }, h("span", { class: "lang-pill", "aria-hidden": "true" }));
    ["tr", "en"].forEach(function (l) { wrap.appendChild(h("button", { type: "button", lang: l, "aria-pressed": String(AVF.lang === l), onclick: function () { wrap.setAttribute("data-on", l); setTimeout(function () { AVF.setLang(l); }, 140); } }, l.toUpperCase())); });
    return wrap;
  }
  AVF.onLangChange = AVF.onLangChange || [];
  AVF.onLangChange.push(function () { if (me) { var keep = sel; shell(); sel = keep; render(); } });
  // tema değişince yalnız üst çubuk düğmesi yenilenir (açık formlar kaybolmaz)
  AVF.renderChrome = function () { var t = document.querySelector("header.top .thm"); if (t && AVF.themeButton) t.parentNode.replaceChild(AVF.themeButton(), t); };
  function shell() {
    view = h("main");
    AVF.mount(document.getElementById("app"),
      h("header", { class: "top" }, h("div", { class: "wrap" }, h("a", { class: "logolink", href: "/", "aria-label": "AlpveFit ana sayfa" }, AVF.logo(false)), h("div", { class: "nav" }, h("a", { href: "/panel" }, AVF.icon("user"), "Üye paneli")),
        h("div", { class: "tools" }, langSwitch(), AVF.themeButton ? AVF.themeButton() : null, h("button", { class: "ibtn", type: "button", "aria-label": "Çıkış yap", onclick: function () { AVF.api("POST", "/account/logout", {}).then(null, function () {}).then(function () { location.href = "/"; }); } }, AVF.icon("out"))))), view,
      h("footer", { class: "foot" }, h("div", { class: "wrap" }, h("span", { "data-notr": "" }, "© " + new Date().getFullYear() + " AlpveFit"), h("span", null, " · "), h("span", null, "Uzman paneli"))));
  }
  function money(n) { return Number(n).toLocaleString(AVF.lang === "en" ? "en-US" : "tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function api(m, p, b) { return AVF.api(m, "/admin" + p, b); }
  function err(box, e) { AVF.mount(box, h("div", { class: "note err", role: "alert", text: AVF.errText(e) })); }

  function frame(content) {
    // v25: koçluk üyeleri ile forum üyeleri ayrı listelenir; forum yönetimi (şikâyet, yasak, kategori, kayıt) panelin içinde
    var tabs = [["uyeler", "users", me.role === "admin" ? "Koçluk Üyeleri" : "Üyeler"]];
    if (me.role === "admin") tabs.push(["forum-uyeler", "award", "Forum Üyeleri"], ["siparisler", "tag", "Siparişler"], ["destek", "headset", "Destek Talepleri"], ["forum", "msg", "Forum Yönetimi"], ["analiz", "chart", "Ziyaret Analizi"], ["denetim", "list", "Denetim Kaydı"]);
    var menu = h("nav", { class: "card menu", "aria-label": "Uzman menüsü" }, tabs.map(function (t) {
      var b = h("a", { href: "#", onclick: function (e) { e.preventDefault(); tab = t[0]; sel = null; render(); } }, AVF.icon(t[1]), t[2]); if (t[0] === tab) b.setAttribute("aria-current", "page"); return b;
    }));
    AVF.mount(view, h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("div", { class: "eyebrow", text: "Çalışma alanı" }), h("h1", { text: me.role === "admin" ? "Yönetici Paneli" : "Uzman Paneli" }),
      h("p", { text: me.name + " · " + (me.role === "admin" ? "Tam yetki" : "Yetkili olduğunuz türler: " + (me.kinds.length ? me.kinds.map(function (k) { return AVF.KIND[k].label; }).join(", ") : "henüz tanımlı değil")) }))),
      h("div", { class: "wrap pbody" }, h("aside", { class: "side" }, menu), content));
  }

  function render() {
    var c = h("div");
    frame(c);
    if (tab === "siparisler") return ordersView(c);
    if (tab === "destek") return supportView(c);
    if (tab === "forum") return forumView(c);
    if (tab === "forum-uyeler") return forumMembersView(c);
    if (tab === "analiz") return visitsView(c);
    if (tab === "denetim") return auditView(c);
    if (sel) return memberView(c, sel);
    return me.role === "admin" ? membersAdminView(c) : clientsView(c);
  }

  // ---------- üyeler ----------
  function clientsView(c) {
    AVF.mount(c, h("h2", { class: "ptitle", text: "Üyeler" }), AVF.skeleton(3));
    api("GET", "/clients").then(function (rows) {
      if (!rows.length) return AVF.mount(c, h("h2", { class: "ptitle", text: "Üyeler" }), AVF.state("users", me.role === "admin" ? "Henüz üye yok" : "Size atanmış üye yok", me.role === "admin" ? "" : "Yönetici size üye atadığında burada görünür."));
      AVF.mount(c, h("h2", { class: "ptitle", text: "Üyeler" }), h("div", { class: "stack" }, rows.map(function (r) {
        var sub = [r.user_code, r.package ? pkgText(r.package) + " · Teslim: " + AVF.fmtDate(r.package.plans_due_at) : "Paket yok", "Erişim: " + (r.access.length ? r.access.map(function (k) { return AVF.KIND[k].label; }).join(", ") : "yok")].filter(Boolean).join(" · ");
        return h("button", { class: "card", type: "button", style: "display:flex;align-items:center;gap:14px;padding:16px 18px;text-align:left;width:100%", onclick: function () { sel = r; render(); } },
          h("span", { class: "tile" }, AVF.icon("user")), h("span", { style: "flex:1;min-width:0" }, h("b", { style: "display:block", text: r.full_name }), h("small", { style: "color:var(--muted)", text: sub })), AVF.icon("chev", "chev"));
      })));
    }, function (e) { AVF.mount(c, h("h2", { class: "ptitle", text: "Üyeler" }), AVF.state("alert", "Üyeler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: render }, "Tekrar dene"))); });
  }

  // ---------- ortak: filtre çubuğu ----------
  // fields: [{ key, type: "search"|"select"|"date", label, icon, options: [[value, label]], placeholder }]; onChange(values)
  function filterBar(fields, onChange) {
    var vals = {}, t = null;
    var bar = h("form", { class: "fbar", role: "search", onsubmit: function (e) { e.preventDefault(); onChange(vals); } }, fields.map(function (f) {
      var inp;
      if (f.type === "select") { inp = h("select", { class: "inp", "aria-label": f.label }, f.options.map(function (o) { return h("option", { value: o[0], text: o[1] }); })); vals[f.key] = f.options[0][0]; }
      else { inp = AVF.input(f.type === "date" ? "date" : "search", { placeholder: f.placeholder || "", "aria-label": f.label, maxlength: "80" }); vals[f.key] = ""; }
      inp.addEventListener(f.type === "search" ? "input" : "change", function () {
        vals[f.key] = inp.value.trim(); clearTimeout(t); t = setTimeout(function () { onChange(vals); }, f.type === "search" ? 320 : 0);
      });
      return h("label", { class: "fb-f" + (f.type === "search" ? " grow" : "") }, h("span", { class: "fb-l" }, AVF.icon(f.icon || "list"), f.label), inp);
    }));
    bar.values = vals; return bar;
  }
  function yesNo(v, yes, no) { return h("span", { class: "yn " + (v ? "ok" : "no"), title: v ? yes : no }, AVF.icon(v ? "check" : "x"), h("span", { text: v ? yes : no })); }

  // ---------- DESTEK TALEPLERİ (yalnız yönetici) ----------
  var supSel = null;
  var TST = { open: ["Yanıt bekliyor", "chip dk", "clock"], answered: ["Yanıtlandı", "chip", "reply"], closed: ["Çözüldü", "chip mute", "check"] };
  var SUBJECTS = ["Hesap ve Güvenlik Ayarları", "Teknik Sorunlar", "Ödeme Sorunları", "Plan ve Programım", "Revizasyon Ayı", "Diğer"];
  function supportView(c) {
    var body = h("div"), summary = h("p", { class: "hint", style: "margin:-6px 0 14px" });
    AVF.mount(c, h("h2", { class: "ptitle" }, AVF.icon("headset"), " Destek talepleri"), summary, body);
    api("GET", "/support/summary").then(function (s) { summary.textContent = "Yanıt bekleyen talep: " + s.tickets; }, function () {});
    return ticketsPane(body);
  }
  function attList(list) {
    if (!list || !list.length) return null;
    return h("div", { class: "batt" }, list.map(function (a) {
      var img = /^image\//.test(a.mime), url = "/api/admin/attachments/" + a.id;
      return h("a", { class: "batt-i" + (img ? " img" : ""), href: url, target: "_blank", rel: "noopener", title: a.filename }, img ? h("img", { src: url, alt: "", loading: "lazy" }) : [AVF.icon("file"), h("span", { "data-notr": "", text: a.filename })]);
    }));
  }
  function thread(msgs) {
    return h("div", { class: "tthread" }, msgs.map(function (m) {
      var mine = m.from_role === "support";
      return h("div", { class: "msg" + (mine ? " mine" : " theirs") }, h("div", { class: "bub-w" }, h("div", { class: "bub", "data-notr": "", text: m.body }), attList(m.attachments), h("span", { class: "t", text: (mine ? "Destek · " : "Üye · ") + AVF.fmtDateTime(m.created_at) })));
    }));
  }
  function replyForm(onSend) {
    var ta = h("textarea", { class: "inp", rows: "3", maxlength: "1444", placeholder: "Yanıtınızı yazın…", "aria-label": "Yanıt" }), eb = h("div"), cnt = h("span", { class: "cnt", text: "0/1444" });
    var files = AVF.fileBox({ scope: "ticket", base: "/api/admin/attachments/" });
    ta.addEventListener("input", function () { cnt.textContent = ta.value.length + "/1444"; });
    var b = h("button", { class: "btn sm", type: "submit" }, AVF.icon("send", "bico"), "Gönder");
    return h("form", { novalidate: true, style: "margin-top:12px", onsubmit: function (e) {
      e.preventDefault(); AVF.mount(eb, null);
      if (!ta.value.trim()) return err(eb, { data: { error: "Mesaj boş olamaz." } });
      if (files.busy()) return err(eb, { data: { error: "Dosyalar yükleniyor; lütfen yükleme bitince gönderin." } });
      AVF.busy(b, true, "Gönderiliyor…");
      onSend(ta.value.trim(), files.ids()).then(null, function (er) { AVF.busy(b, false); err(eb, er); });
    } }, ta, h("div", { class: "row between", style: "margin:6px 0" }, AVF.emojiPicker(ta), cnt), files, eb, h("div", { class: "row", style: "margin-top:10px" }, b));
  }
  function ticketsPane(box) {
    if (supSel && supSel.ticket_number) {
      var t0 = supSel, tb = h("div", { class: "card", style: "padding:18px" }, AVF.skeleton(2));
      AVF.mount(box, h("button", { class: "btn ghost sm", type: "button", style: "margin-bottom:12px", onclick: function () { supSel = null; ticketsPane(box); } }, AVF.icon("back", "bico"), "Taleplere dön"), tb);
      var load = function () {
        api("GET", "/tickets/" + t0.id).then(function (t) {
          var st = TST[t.status] || TST.open;
          AVF.mount(tb, h("div", { class: "row between", style: "gap:10px;flex-wrap:wrap" }, h("b", { "data-notr": "", text: t.ticket_number + " · " + t.title }), h("span", { class: st[1] }, AVF.icon(st[2]), st[0])),
            h("div", { class: "kv" },
              kv("id", "Ad Soyad", t.full_name), kv("user", "Kullanıcı adı", "@" + t.username), kv("mail", "E-posta", t.email), kv("list", "Konu", t.subject), t.plan_kind && AVF.KIND[t.plan_kind] ? kv(AVF.KIND[t.plan_kind].icon, "İlgili plan", AVF.t(AVF.KIND[t.plan_kind].label)) : null,
              kv("clock", "Gönderilme", AVF.fmtFull ? AVF.fmtFull(t.created_at) : AVF.fmtDateTime(t.created_at)), t.status === "closed" ? kv("check", "Çözüldü olarak işaretleyen", t.closed_by === "admin" ? "Destek ekibi" : "Üye") : null),
            thread(t.messages),
            t.status !== "closed" ? [replyForm(function (v, ids) { return api("POST", "/tickets/" + t.id + "/reply", { message: v, attachments: ids }).then(load); }),
              h("button", { class: "btn ghost sm", type: "button", style: "margin-top:10px", onclick: function () {
                AVF.confirmDialog({ icon: "check", title: "Talep çözüldü olarak işaretlensin mi?", text: "Talep kapatılır ve üyeye bildirim gider. Üye yeni mesaj gönderemez; gerekirse yeni talep açar.", confirm: "Evet, çözüldü", cancel: "Vazgeç" }).then(function (y) {
                  if (y) api("PATCH", "/tickets/" + t.id + "/close", { confirmed: true }).then(function () { AVF.toast("Talep çözüldü olarak işaretlendi."); load(); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
                });
              } }, AVF.icon("check", "bico"), "Çözüldü olarak işaretle")]
              : h("div", { class: "note", style: "margin-top:12px" }, "Bu destek talebi çözüldü olarak kapatıldı."));
        }, function (e) { err(tb, e); });
      };
      return load();
    }
    var list = h("div", { class: "stack" }, AVF.skeleton(2));
    var bar = filterBar([
      { key: "q", type: "search", label: "Ara", icon: "list", placeholder: "Talep no, başlık, ad, kullanıcı adı, e-posta" },
      { key: "status", type: "select", label: "Durum", icon: "clock", options: [["", "Tümü"], ["open", "Yanıt bekliyor"], ["answered", "Yanıtlandı"], ["closed", "Çözüldü"]] },
      { key: "subject", type: "select", label: "Konu", icon: "tag", options: [["", "Tümü"]].concat(SUBJECTS.map(function (x) { return [x, x]; })) },
      { key: "from", type: "date", label: "Başlangıç", icon: "calendar" }, { key: "to", type: "date", label: "Bitiş", icon: "calendar" }], load);
    AVF.mount(box, bar, list);
    function load(v) {
      v = v || bar.values; AVF.mount(list, AVF.skeleton(2));
      var qs = Object.keys(v).filter(function (k) { return v[k]; }).map(function (k) { return k + "=" + encodeURIComponent(v[k]); }).join("&");
      api("GET", "/tickets" + (qs ? "?" + qs : "")).then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state("list", "Sonuç yok", "Filtrelere uyan destek talebi bulunamadı."));
        AVF.mount(list, h("div", { class: "card tbl-w" }, h("table", { class: "t stackm" },
          h("thead", null, h("tr", null, ["Talep", "Ad Soyad", "Kullanıcı adı", "E-posta", "Gönderilme", "Durum", ""].map(function (x) { return h("th", { text: x }); }))),
          h("tbody", null, rows.map(function (t) {
            var st = TST[t.status] || TST.open;
            return h("tr", { class: "rowlink", tabindex: "0", onclick: function () { supSel = t; ticketsPane(box); }, onkeydown: function (e) { if (e.key === "Enter") { supSel = t; ticketsPane(box); } } },
              h("td", null, h("b", { "data-notr": "", text: t.ticket_number }), h("small", { class: "sub", "data-notr": "", text: t.title }), h("small", { class: "sub", text: t.subject + (t.plan_kind && AVF.KIND[t.plan_kind] ? " · " + AVF.t(AVF.KIND[t.plan_kind].label) : "") })),
              h("td", { "data-notr": "", text: t.full_name }), h("td", { "data-notr": "", text: "@" + t.username }), h("td", { "data-notr": "", text: t.email }),
              h("td", { text: AVF.fmtDateTime(t.created_at) }), h("td", null, h("span", { class: st[1] }, AVF.icon(st[2]), st[0])), h("td", null, AVF.icon("chev", "chev")));
          })))));
      }, function (e) { err(list, e); });
    }
    load();
  }
  /** E-postayı iki satırda gösterir (kullanıcı adı / @alan adı); sütuna taşmadan oturur, tamamı başlıkta ve kopyalanabilir. */
  function emailCell(e) {
    var i = String(e || "").lastIndexOf("@");
    return h("span", { class: "em", "data-notr": "" }, h("span", { class: "em-u", text: i > 0 ? e.slice(0, i) : e }), i > 0 ? h("span", { class: "em-d", text: e.slice(i) }) : null);
  }
  function kv(icon, k, v) { return v === null || v === undefined || v === "" ? null : h("div", { class: "kv-i" }, AVF.icon(icon), h("span", { class: "k", text: k }), h("b", { "data-notr": "", text: String(v) })); }
  function memberView(c, m) {
    var head = h("div", { class: "row between", style: "margin-bottom:14px" }, h("div", null, h("h2", { class: "ptitle", style: "margin:0", text: m.full_name }), h("small", { style: "color:var(--muted)", text: m.user_code })),
      h("button", { class: "btn ghost sm", type: "button", onclick: function () { sel = null; render(); } }, AVF.icon("back", "bico"), "Üyelere dön"));
    var infoBox = h("div"), adminBox = h("div"), list = h("div", { class: "stack" }, AVF.skeleton(2)), box = h("div");
    AVF.mount(c, head, infoBox, adminBox, box, h("div", { class: "row between", style: "margin:18px 0 10px" }, h("h3", { text: "Planlar" }), newPlanBtn()), list);
    if (me.role === "admin") adminTools(adminBox, m);
    memberInfo(infoBox, m);
    // Ağırlık takibi (salt okunur): üyenin girdiği kayıtlar, tablo ve istatistik
    var pgBox = h("div");
    infoBox.parentNode.insertBefore(AVF.accordion({ icon: "chart", title: AVF.t("Ağırlık takibi"), sub: AVF.t("Üyenin koçun hareketleri için girdiği ağırlık kayıtları"), content: [pgBox] }), box);
    AVF.progressView(pgBox, { admin: true, memberId: m.id });

    function newPlanBtn() {
      var avail = KINDS.filter(function (k) { return me.role === "admin" || me.kinds.indexOf(k) >= 0; });
      return h("button", { class: "btn sm", type: "button", onclick: function () { editor(null, avail); } }, AVF.icon("plus"), "Yeni plan");
    }
    function load() {
      Promise.all([api("GET", "/clients/" + m.id + "/plans"), AVF.planCatalog(true).catch(function () { return null; })]).then(function (r) { var rows = r[0];
        if (!rows.length) return AVF.mount(list, AVF.state("list", "Bu üye için plan yok", "“Yeni plan” ile bir plan hazırlayabilirsiniz."));
        AVF.mount(list, rows.map(function (p) {
          var st = STATUS[p.status];
          return AVF.accordion({ icon: AVF.KIND[p.kind].icon, title: p.title, sub: AVF.KIND[p.kind].label + " · " + st[0] + " · Hazırlayan: " + p.author_name, content: [
            h("div", { class: "meta" }, h("span", { class: st[1], text: st[0] }), h("span", null, "Oluşturma: " + AVF.fmtDateTime(p.created_at)), h("span", null, "Güncelleme: " + AVF.fmtDateTime(p.updated_at)), p.published_at ? h("span", null, "Üyeye eklendi: " + AVF.fmtDateTime(p.published_at) + " (" + (p.published_by_name || "—") + ")") : null),
            p.data && AVF.planDataView ? AVF.planDataView(p.kind, p.data) : null, p.body || !p.data ? h("div", { class: "plan-body", text: p.body || "(içerik yok)" }) : null,
            h("div", { class: "row", style: "margin-top:14px" },
              p.status !== "archived" ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { editor(p, [p.kind]); } }, "Düzenle") : null,
              (p.data || p.body) && AVF.printPlan ? AVF.printButton(function () { AVF.printPlan({ kind: p.kind, plan: p, member: m.full_name }); }) : null,
              p.status === "draft" ? h("button", { class: "btn sm", type: "button", onclick: function () { act(p, "publish", "Plan üyenin paneline eklenecek. Onaylıyor musunuz?"); } }, "Üyeye göster") : null,
              p.status === "published" ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { act(p, "unpublish", "Plan üyenin panelinden hemen kalkacak (silinmez). Onaylıyor musunuz?"); } }, "Üyeden gizle") : null,
              p.status === "published" ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { act(p, "archive", "Plan arşivlenecek ve üyenin panelinden kalkacak. Onaylıyor musunuz?"); } }, "Arşivle") : null,
              p.status === "draft" || me.role === "admin" ? h("button", { class: "btn danger sm", type: "button", onclick: function () { act(p, null, "Plan kalıcı olarak silinecek. Onaylıyor musunuz?"); } }, "Sil") : null)] });
        }));
      }, function (e) { AVF.mount(list, AVF.state("alert", "Planlar yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: load }, "Tekrar dene"))); });
    }
    function act(p, verb, q) {
      if (!window.confirm(q)) return;
      (verb ? api("POST", "/plans/" + p.id + "/" + verb, {}) : api("DELETE", "/plans/" + p.id)).then(function () { AVF.toast("İşlem tamamlandı."); load(); }, function (e) { err(box, e); });
    }
    function editor(p, avail) {
      // Taslak koruma: her değişiklik bu cihazda saklanır; sayfa yanlışlıkla kapanırsa açılışta geri yükleme önerilir. Kaydedince silinir.
      var dkey = "avf_pdraft:" + m.id + ":" + (p ? p.id : "new");
      function readDraft() { try { var x = JSON.parse(localStorage.getItem(dkey) || "null"); return x && Date.now() - x.at < 14 * 864e5 ? x : null; } catch (e) { return null; } }
      function clearDraft() { try { localStorage.removeItem(dkey); } catch (e) {} dirty = false; }
      var dirty = false, saveT = null, restored = readDraft();
      var kind = h("select", { class: "inp", id: "k" + Date.now(), disabled: !!p }, avail.map(function (k) { return h("option", { value: k, text: AVF.KIND[k].label, selected: p && p.kind === k }); }));
      var title = AVF.input("text", { maxlength: "140", value: p ? p.title : "", placeholder: "Plan başlığı" });
      var s = AVF.input("date", { value: p && p.starts_on ? String(p.starts_on).slice(0, 10) : "" }), e2 = AVF.input("date", { value: p && p.ends_on ? String(p.ends_on).slice(0, 10) : "" });
      var body = h("textarea", { class: "inp", id: "b" + Date.now(), maxlength: "20000", placeholder: "Ek açıklama (isteğe bağlı; siz yazarsınız, sistem içerik üretmez)" }); body.value = p ? p.body : "";
      var ebox = h("div"), rbox = h("div"), btn = h("button", { class: "btn", type: "submit" }, AVF.icon("save", "bico"), "Kaydet"), bld = h("div", { class: "pl-bld" }, AVF.skeleton(2)), ed = null, initData = p ? p.data : null;
      function snapshot() { return { at: Date.now(), kind: kind.value, title: title.value, body: body.value, s: s.value, e: e2.value, data: ed ? ed.get() : null }; }
      function touch() {
        dirty = true; clearTimeout(saveT);
        saveT = setTimeout(function () { try { localStorage.setItem(dkey, JSON.stringify(snapshot())); } catch (e) {} }, 400);
      }
      function build(data) {
        AVF.planCatalog(true).then(function () {
          ed = AVF.planEditor(kind.value, data !== undefined ? data : (p && p.kind === kind.value ? initData : null), touch);
          AVF.mount(bld, h("h4", { class: "pl-bh" }, AVF.icon(AVF.KIND[kind.value].icon), AVF.KIND[kind.value].label + " oluşturucu"), ed);
        }, function (er) { ed = null; AVF.mount(bld, h("div", { class: "note err", role: "alert", text: "Plan kataloğu yüklenemedi: " + AVF.errText(er) })); });
      }
      kind.addEventListener("change", function () { if (!ed || window.confirm(AVF.t("Tür değişirse oluşturucudaki seçimler silinir. Devam edilsin mi?"))) { build(null); touch(); } });
      [title, s, e2, body].forEach(function (x) { x.addEventListener("input", touch); x.addEventListener("change", touch); });
      function onLeave(ev) { if (dirty) { ev.preventDefault(); ev.returnValue = ""; return ""; } }
      window.addEventListener("beforeunload", onLeave);
      function close() { window.removeEventListener("beforeunload", onLeave); clearTimeout(saveT); AVF.mount(box, null); }
      if (restored) {
        AVF.mount(rbox, h("div", { class: "note warn", role: "status" }, AVF.icon("refresh", "bico"), h("span", { text: "Bu plan için kaydedilmemiş bir çalışmanız var (" + AVF.fmtDateTime(new Date(restored.at).toISOString()) + ")." }),
          h("button", { class: "btn sm", type: "button", onclick: function () {
            kind.value = restored.kind || kind.value; title.value = restored.title || ""; body.value = restored.body || ""; s.value = restored.s || ""; e2.value = restored.e || "";
            build(restored.data); dirty = true; AVF.mount(rbox, null); AVF.toast(AVF.t("Kaydedilmemiş çalışma geri yüklendi."));
          } }, "Geri yükle"), h("button", { class: "btn ghost sm", type: "button", onclick: function () { clearDraft(); AVF.mount(rbox, null); } }, "Yok say")));
      }
      AVF.mount(box, h("form", { class: "card pl-form", novalidate: true, onsubmit: function (ev) {
        ev.preventDefault(); AVF.mount(ebox, null);
        if (!title.value.trim()) { title.focus(); return err(ebox, { data: { error: "Plan başlığı gerekli." } }); }
        AVF.busy(btn, true, "Kaydediliyor…");
        var pl = { title: title.value.trim(), body: body.value, startsOn: s.value || null, endsOn: e2.value || null };
        if (ed) pl.data = ed.get();
        var rq = p ? api("PATCH", "/plans/" + p.id, pl) : api("POST", "/plans", Object.assign({ memberId: m.id, kind: kind.value }, pl));
        rq.then(function (r) {
          clearDraft(); close();
          AVF.toast(r && r.status === "draft" ? AVF.t("Kaydedildi. Plan henüz boş olduğu için üyeye gösterilmiyor.") : AVF.t("Kaydedildi ve üyenin panelinde güncellendi. Üyeye tek bir bildirim gider."));
          load();
        }, function (er) { AVF.busy(btn, false); err(ebox, er); });
      } }, h("h3", { style: "margin-bottom:12px", text: p ? "Planı düzenle" : "Yeni plan" }), rbox,
        h("p", { class: "hint", text: "Kaydettiğinizde plan üyenin panelinde hemen güncellenir. Art arda yaptığınız değişiklikler için üyeye tek bir e-posta gider." }),
        AVF.field("Tür", kind, { optional: true }), AVF.field("Başlık", title, { optional: true }),
        h("div", { class: "row" }, h("div", { style: "flex:1;min-width:150px" }, AVF.field("Başlangıç", s, { optional: true })), h("div", { style: "flex:1;min-width:150px" }, AVF.field("Bitiş", e2, { optional: true }))),
        bld, AVF.field("Ek açıklama", body, { optional: true, icon: "notes" }), ebox,
        h("div", { class: "row pl-actions" }, btn, h("button", { class: "btn ghost", type: "button", onclick: function () { if (dirty && !window.confirm(AVF.t("Kaydedilmemiş değişiklikler silinsin mi?"))) return; clearDraft(); close(); } }, "Vazgeç"))));
      build(); box.scrollIntoView({ block: "start", behavior: "smooth" }); setTimeout(function () { title.focus({ preventScroll: true }); }, 250);
    }
    load();
  }

  // Yönetici: üyenin erişim izinleri + uzman ataması
  function adminTools(box, m) {
    var access = (m.access || []).slice();
    var chks = KINDS.map(function (k) { var i = h("input", { type: "checkbox", checked: access.indexOf(k) >= 0, "data-k": k }); return h("label", { class: "check", style: "margin:4px 0" }, i, AVF.KIND[k].label); });
    var eb = h("div"), sb = h("button", { class: "btn sm", type: "button", onclick: function () {
      var kinds = chks.map(function (l) { return l.firstChild; }).filter(function (i) { return i.checked; }).map(function (i) { return i.getAttribute("data-k"); });
      api("PUT", "/members/" + m.id + "/access", { kinds: kinds }).then(function () { m.access = kinds; AVF.toast("Erişim izinleri kaydedildi."); }, function (e) { err(eb, e); });
    } }, "Erişimi kaydet");
    // Uzman seçimi: önce "Siz" (yönetici de koçluk yapar), ardından varsa diğer uzmanlar.
    var coachSel = h("select", { class: "inp", id: "cs", "aria-label": "Uzman" }, h("option", { value: me.id, text: AVF.t("Siz") + " — " + me.name }));
    api("GET", "/users?role=coach").then(function (rows) { rows.forEach(function (r) { if (r.id !== me.id) coachSel.appendChild(h("option", { value: r.id, "data-notr": "", text: r.full_name + " (" + r.user_code + ")" })); }); });
    var current = (m.coaches || []).map(function (c) { return c.coachName; }).join(" · ") || "Atanmış uzman yok";
    AVF.mount(box, h("div", { class: "card", style: "padding:18px;margin-bottom:14px" }, h("h3", { style: "margin-bottom:8px", text: "Yönetim" }),
      h("p", { class: "hint", text: "Üyenin panelinde hangi plan bölümlerinin görüneceğini siz belirlersiniz." }), h("div", null, chks), h("div", { class: "row", style: "margin:8px 0 16px" }, sb), eb,
      h("p", { class: "hint", text: "Uzman ataması: " + current }), h("div", { class: "row" }, h("div", { style: "flex:1;min-width:180px" }, coachSel),
        h("button", { class: "btn sm", type: "button", onclick: function () {
          api("PUT", "/assignments", { coachId: coachSel.value, memberId: m.id }).then(function () { AVF.toast("Atama kaydedildi."); clientsRefresh(); }, function (e) { err(eb, e); });
        } }, "Ata"))));
    function clientsRefresh() { api("GET", "/clients").then(function (rows) { var r = rows.filter(function (x) { return x.id === m.id; })[0]; if (r) { sel = r; render(); } }); }
  }


  // Üyenin paketi ve (varsa) üyenin kendi girdiği kişisel bilgiler. Bilgiler üyenin açık rızasıyla paylaşılır; kullanıcı içeriği çevrilmez.
  function memberInfo(box, m) {
    var rows = [];
    if (m.package) rows.push(h("p", null, h("b", { text: "Paket: " }), pkgText(m.package), " · Ödeme: " + AVF.fmtDate(m.package.paid_at) + " · Planların teslim tarihi: " + AVF.fmtDate(m.package.plans_due_at) + " · " + (m.package.pharmacology ? "Farmakoloji desteği var" : "Farmakoloji desteği yok")));
    else rows.push(h("p", { class: "hint", text: "Bu üyenin ödenmiş paketi yok." }));
    var pf = h("div", { class: "card", style: "padding:18px;margin-bottom:14px" }, h("h3", { style: "margin-bottom:8px", text: "Paket ve kişisel bilgiler" }), rows, h("div", { class: "pinfo" }, AVF.skeleton(1)));
    AVF.mount(box, pf);
    var slot = pf.querySelector(".pinfo");
    api("GET", "/clients/" + m.id + "/profile").then(function (P) {
      if (!P) return AVF.mount(slot, h("p", { class: "hint", text: "Üye henüz kişisel bilgi paylaşmadı (isteğe bağlıdır)." }));
      var items = [["Boy (cm)", P.height_cm], ["Kilo (kg)", P.weight_kg], ["Kol çevresi (cm)", P.arm_cm], ["Omuz genişliği (cm)", P.shoulder_cm], ["Bel çevresi (cm)", P.waist_cm], ["Boyun çevresi (cm)", P.neck_cm], ["Günlük öğün", P.meals_per_day], ["Cinsiyet", P.gender === "female" ? "Kadın" : P.gender === "male" ? "Erkek" : ""], ["Yaş", P.birth_date ? (function (d) { var n = new Date(), a = n.getFullYear() - d[0]; if (n.getMonth() + 1 < d[1] || (n.getMonth() + 1 === d[1] && n.getDate() < d[2])) a--; return a; })(P.birth_date.split("-").map(Number)) : P.birth_year ? new Date().getFullYear() - P.birth_year : ""], ["Çalışma saati", AVF.workText ? AVF.workText(P.work_hours, P.work_schedule, P.work_note) : P.work_hours], ["Günlük adım aralığı", String(P.steps_range || "").replace("-", "–")], ["Meslek", P.occupation], ["Günlük adım", P.daily_steps], ["Haftalık antrenman günü", P.training_days], ["Kan grubu", P.blood_type]].filter(function (x) { return x[1] !== null && x[1] !== undefined && x[1] !== ""; });
      AVF.mount(slot, h("ul", { class: "ticks" }, items.map(function (x) { return h("li", null, h("b", { text: x[0] + ": " }), h("span", { "data-notr": "", text: String(x[1]) })); })),
        P.goal ? h("p", null, h("b", { text: "Hedef: " }), h("span", { "data-notr": "", text: P.goal })) : null,
        P.health_notes ? h("p", null, h("b", { text: "Sağlık / sakatlık notları: " }), h("span", { "data-notr": "", text: P.health_notes })) : null,
        h("div", { class: "pfiles" }),
        h("p", { class: "hint", text: "Bu bilgiler üyenin açık rızasıyla paylaşılmıştır; yalnızca program hazırlama amacıyla kullanın." }));
      var fs = slot.querySelector(".pfiles");
      api("GET", "/clients/" + m.id + "/files").then(function (list) {
        var docs = list.filter(function (x) { return x.scope === "profile"; }), body = list.filter(function (x) { return x.scope === "body"; }), blood = list.filter(function (x) { return x.scope === "blood"; });
        AVF.mount(fs, body.length ? [h("p", null, h("b", { text: "Vücut formu:" })), AVF.bodyForm({ files: body, readOnly: true, base: "/api/admin/attachments/" })] : null,
          blood.length ? [h("p", null, h("b", { text: "Kan tahlili:" })), AVF.fileBox({ scope: "blood", files: blood, readOnly: true, max: 2, base: "/api/admin/attachments/" })] : null,
          docs.length ? [h("p", null, h("b", { text: "Sağlık / sakatlık dosyaları:" })), AVF.fileBox({ files: docs, readOnly: true, max: 4, base: "/api/admin/attachments/" })] : null);
      }, function () { /* sessiz */ });
    }, function () { AVF.mount(slot, h("p", { class: "hint", text: "Kişisel bilgiler yüklenemedi." })); });
  }

  // ---------- yönetici: ÜYELER (arama, filtre, yönetim) ----------
  var STATE = { active: ["Aktif", "chip", "check"], blocked: ["Engelli", "chip warn", "lock"], banned: ["Süreli yasaklı", "chip warn", "clock"], locked: ["Kilitli", "chip mute", "lock"] };
  var ROLES = { user: "Üye", coach: "Uzman", admin: "Yönetici" };
  var forumLevels = null;
  function membersAdminView(c) {
    var list = h("div"), count = h("span", { class: "hint" });
    var bar = filterBar([
      { key: "q", type: "search", label: "Ara", icon: "users", placeholder: "Ad soyad, kullanıcı adı, e-posta, üye kodu" },
      { key: "segment", type: "select", label: "Kapsam", icon: "notes", options: [["coaching", "Koçluk üyeleri"], ["", "Tüm hesaplar"]] },
      { key: "state", type: "select", label: "Durum", icon: "shield", options: [["", "Tümü"], ["active", "Aktif"], ["blocked", "Engelli"], ["banned", "Süreli yasaklı"], ["locked", "Kilitli"]] },
      { key: "verified", type: "select", label: "Doğrulama", icon: "mail", options: [["", "Tümü"], ["yes", "Doğrulanmış"], ["no", "Doğrulanmamış"]] },
      { key: "totp", type: "select", label: "Google Auth", icon: "key", options: [["", "Tümü"], ["on", "Açık"], ["off", "Kapalı"]] },
      { key: "role", type: "select", label: "Yetki", icon: "cog", options: [["", "Tümü"], ["user", "Üye"], ["coach", "Uzman"], ["admin", "Yönetici"]] },
      { key: "sort", type: "select", label: "Sırala", icon: "list", options: [["new", "En yeni kayıt"], ["old", "En eski kayıt"], ["name", "Ada göre"], ["reports", "En çok şikâyet"]] }], load);
    AVF.mount(c, h("div", { class: "row between", style: "margin-bottom:12px" }, h("h2", { class: "ptitle", style: "margin:0" }, AVF.icon("users"), " Koçluk Üyeleri"), count),
      h("p", { class: "hint", style: "margin:-4px 0 12px", text: "Paketi, plan erişimi ya da koç ataması olan üyeler. Forumdaki etkinlik ve forum yasakları Forum Üyeleri bölümündedir." }), bar, list);
    if (!forumLevels) api("GET", "/forum/levels").then(function (l) { forumLevels = l; }, function () {});
    function load(v) {
      v = v || bar.values; AVF.mount(list, AVF.skeleton(3));
      var qs = Object.keys(v).filter(function (k) { return v[k]; }).map(function (k) { return k + "=" + encodeURIComponent(v[k]); }).join("&");
      api("GET", "/members" + (qs ? "?" + qs : "")).then(function (rows) {
        count.textContent = rows.length + " kayıt";
        if (!rows.length) return AVF.mount(list, AVF.state("users", "Sonuç yok", v.segment === "coaching" ? "Koçluk üyesi bulunamadı. Ödemesi onaylanan ya da plan erişimi verilen üyeler burada görünür." : "Filtrelere uyan üye bulunamadı."));
        AVF.mount(list, h("div", { class: "card tbl-w" }, h("table", { class: "t stackm mtab" },
          h("thead", null, h("tr", null, ["Ad Soyad · Kullanıcı adı", "E-posta", "Kayıt", "Doğrulama · Google Auth", "Koçluk", "Durum", ""].map(function (x) { return h("th", { text: x }); }))),
          h("tbody", null, rows.map(function (m) { return memberRow(m); })))));
      }, function (e) { err(list, e); });
    }
    function memberRow(m) {
      var st = STATE[m.state] || STATE.active, detail = h("tr", { class: "mdet", hidden: "" }, h("td", { colspan: "7" }));
      var row = h("tr", null,
        h("td", { "data-l": "Ad Soyad · Kullanıcı adı" }, h("b", { "data-notr": "", text: m.full_name }), h("small", { class: "sub", "data-notr": "", text: "@" + m.username + " · " + m.user_code }), m.role !== "user" ? h("span", { class: "chip lime", text: ROLES[m.role] }) : null),
        h("td", { "data-l": "E-posta", class: "emc", title: m.email }, emailCell(m.email)),
        h("td", { "data-l": "Kayıt" }, h("span", { class: "nw", text: AVF.fmtDate(m.created_at) }), h("small", { class: "sub", text: new Date(m.created_at).toLocaleTimeString(AVF.lang === "en" ? "en-GB" : "tr-TR", { hour: "2-digit", minute: "2-digit" }) })),
        h("td", { "data-l": "Doğrulama · Google Auth" }, yesNo(m.verified, "Doğrulandı", "Doğrulanmadı"), h("br"), yesNo(m.totp_enabled, "Google Auth açık", "Google Auth kapalı")),
        h("td", { "data-l": "Koçluk" }, m.coaching ? h("span", { class: "chip lime" }, AVF.icon("notes"), h("span", { text: "Koçluk üyesi" })) : h("span", { class: "sub", text: m.role === "user" ? "Paket yok" : "—" }),
          m.forum_joined ? h("small", { class: "sub", text: "Forumda da üye · " + m.forumLevel.name }) : null),
        h("td", { "data-l": "Durum" }, h("span", { class: st[1] }, AVF.icon(st[2]), st[0]), m.state === "banned" && m.locked_until ? h("small", { class: "sub", text: "Bitiş: " + AVF.fmtDateTime(m.locked_until) }) : null,
          unbanBtn(m, load)),
        h("td", { class: "mact" }, m.role === "user" ? h("button", { class: "btn sm", type: "button", onclick: function (e) {
          var b = e.currentTarget; AVF.busy(b, true, "Açılıyor…");
          api("GET", "/clients?id=" + m.id).then(function (rows) { var r = rows.filter(function (x) { return x.id === m.id; })[0]; AVF.busy(b, false); if (r) { sel = r; render(); window.scrollTo(0, 0); } else AVF.toast("Üye bulunamadı."); }, function (er) { AVF.busy(b, false); AVF.toast(AVF.errText(er)); });
        } }, AVF.icon("notes", "bico"), "Planlar") : null, h("button", { class: "btn ghost sm", type: "button", "aria-expanded": "false", onclick: function (e) {
          var open = detail.hidden; detail.hidden = !open; e.currentTarget.setAttribute("aria-expanded", String(open));
          if (open) manage(detail.firstChild, m, "coaching", load);
        } }, AVF.icon("cog", "bico"), "Yönet")));
      return [row, detail];
    }
    load();
  }
  /** Üye yönetimi — scope: "coaching" (yetki, hesap engeli/yasağı, silme) ya da "forum" (seviye, forum yasağı, forum kimliği, hesap engeli/yasağı). */
  function manage(cell, m, scope, load) {
      var eb = h("div");
      function done(msg) { AVF.toast(msg); load(); }
      function fail(e) { err(eb, e); }
      // yetki
      var KINDS2 = KINDS, role = h("select", { class: "inp", "aria-label": "Yetki" }, Object.keys(ROLES).map(function (r) { return h("option", { value: r, text: ROLES[r], selected: m.role === r }); }));
      var chks = KINDS2.map(function (k) { return h("label", { class: "check", style: "margin:2px 0" }, h("input", { type: "checkbox", checked: (m.plan_kinds || []).indexOf(k) >= 0, "data-k": k }), AVF.KIND[k].label); });
      var kbox = h("div", { style: m.role === "coach" ? "" : "display:none" }, h("p", { class: "hint", text: "Uzmanın plan hazırlayabileceği bölümler:" }), chks);
      role.addEventListener("change", function () { kbox.style.display = role.value === "coach" ? "" : "none"; });
      var roleSec = msec("cog", "Yetki değişikliği", "Rol değişince kullanıcının tüm oturumları kapanır. Uzman ve yöneticide Google Authenticator zorunludur.", [role, kbox,
        h("button", { class: "btn sm", type: "button", onclick: function () {
          var kinds = chks.map(function (l) { return l.firstChild; }).filter(function (i) { return i.checked; }).map(function (i) { return i.getAttribute("data-k"); });
          AVF.confirmDialog({ icon: "cog", title: "Yetki değiştirilsin mi?", text: m.full_name + " → " + ROLES[role.value], confirm: "Değiştir", cancel: "Vazgeç" }).then(function (y) {
            if (y) api("PUT", "/users/" + m.id + "/role", { role: role.value, planKinds: kinds }).then(function () { done("Yetki güncellendi."); }, fail);
          });
        } }, AVF.icon("save", "bico"), "Yetkiyi kaydet")]);
      // forum
      var lv = h("select", { class: "inp", "aria-label": "Forum seviyesi" }, h("option", { value: "", text: "Otomatik (etkinliğe göre)" }), (forumLevels || []).map(function (l) { return h("option", { value: String(l.n), text: l.n + " · " + l.name, selected: m.level_override === l.n }); }));
      var mod = h("input", { type: "checkbox", checked: m.forum_role === "moderator" });
      var forumSec = msec("award", "Forum seviyesi", "Elle verilen seviye, etkinliğe göre hesaplanan seviyeden bağımsızdır. Moderatörlük yalnız atamayla verilir.", [lv,
        h("label", { class: "check" }, mod, "Moderatör olarak ata"),
        h("p", { class: "hint", text: "Şu anki: " + m.forumLevel.name + (m.forumLevel.score !== undefined ? " · puan " + m.forumLevel.score : "") + " · konu " + m.topics + " · mesaj " + m.posts }),
        h("button", { class: "btn sm", type: "button", onclick: function () {
          api("PUT", "/members/" + m.id + "/forum", { levelOverride: lv.value || null, forumRole: mod.checked ? "moderator" : "member" }).then(function () { done("Forum ayarı kaydedildi."); }, fail);
        } }, AVF.icon("save", "bico"), "Forum ayarını kaydet")]);
      // durum: engelle / süreli yasak / kaldır
      var reason = AVF.input("text", { maxlength: "300", placeholder: "Gerekçe (denetim kaydına yazılır)" });
      var hours = h("select", { class: "inp", "aria-label": "Süre" }, [1, 2, 3, 6, 12, 24, 36, 48].map(function (x) { return h("option", { value: String(x), text: x + " saat" }); }));
      var isAdm = m.role === "admin";
      var stateSec = msec("shield", "Engelleme ve süreli yasak", "Engel süresizdir; süreli yasak en fazla 48 saattir ve süre dolunca kendiliğinden kalkar. Her ikisinde de üyenin açık oturumları kapanır ve şifre sıfırlamayla kaldırılamaz.", isAdm ? [h("p", { class: "hint", text: "Yönetici hesaplarına uygulanamaz." })] : [reason,
        h("div", { class: "row", style: "gap:8px;flex-wrap:wrap" },
          h("button", { class: "btn ghost sm", type: "button", onclick: function () {
            AVF.confirmDialog({ icon: "lock", danger: true, title: "Üye engellensin mi?", text: m.full_name + " siz kaldırana kadar giriş yapamaz.", confirm: "Engelle", cancel: "Vazgeç" }).then(function (y) {
              if (y) api("POST", "/members/" + m.id + "/block", { reason: reason.value }).then(function () { done("Üye engellendi."); }, fail);
            });
          } }, AVF.icon("lock", "bico"), "Engelle"),
          h("span", { class: "row", style: "gap:6px" }, hours, h("button", { class: "btn ghost sm", type: "button", onclick: function () {
            AVF.confirmDialog({ icon: "clock", danger: true, title: "Süreli yasak uygulansın mı?", text: m.full_name + " · " + hours.value + " saat", confirm: "Yasakla", cancel: "Vazgeç" }).then(function (y) {
              if (y) api("POST", "/members/" + m.id + "/ban", { hours: Number(hours.value), reason: reason.value }).then(function () { done("Süreli yasak uygulandı."); }, fail);
            });
          } }, AVF.icon("clock", "bico"), "Süreli yasakla")),
          m.state !== "active" ? h("button", { class: "btn sm", type: "button", onclick: function () {
            api("POST", "/members/" + m.id + "/unblock", {}).then(function () { done("Engel / yasak kaldırıldı."); }, fail);
          } }, AVF.icon("check", "bico"), "Engeli / yasağı kaldır") : null)]);
      // kalıcı yasak
      var preason = AVF.input("text", { maxlength: "300", placeholder: "Gerekçe (en az 10 karakter)" }), code = AVF.codeInput({ "aria-label": "Google Authenticator kodunuz" });
      var permaSec = msec("trash", "Üye silme (kalıcı yasak)", "Hesap ve tüm verileri kalıcı olarak silinir; bu e-posta adresiyle yeniden kayıt olunamaz. Geri alınamaz — Google Authenticator kodunuz gerekir.", isAdm ? [h("p", { class: "hint", text: "Yönetici hesaplarına uygulanamaz." })] : [preason, AVF.field("Google Authenticator kodunuz", code, { optional: true }),
        h("button", { class: "btn danger sm", type: "button", onclick: function () {
          AVF.confirmDialog({ icon: "trash", danger: true, title: "Üye kalıcı olarak silinsin mi?", text: m.full_name + " (@" + m.username + ") ve tüm verileri silinecek. Bu işlem geri alınamaz.", confirm: "Kalıcı olarak sil", cancel: "Vazgeç" }).then(function (y) {
            if (y) api("DELETE", "/members/" + m.id, { reason: preason.value, token: code.value }).then(function () { done("Üye kalıcı olarak silindi ve yasaklandı."); }, fail);
          });
        } }, AVF.icon("trash", "bico"), "Kalıcı olarak sil")]);
      // forum kimliği: avatar, imza, bağlantılar — kurala aykırıysa gerekçeyle kaldırılır (üyeye bildirim gider)
      var fidBox = h("div", { class: "fid" }, AVF.skeleton(1)), freason = AVF.input("text", { maxlength: "300", placeholder: "Kaldırma gerekçesi (üyeye iletilir)", "aria-label": "Kaldırma gerekçesi" });
      function rmItem(item, label) {
        return h("button", { class: "btn ghost sm", type: "button", onclick: function () {
          if (freason.value.trim().length < 5) return err(eb, { data: { error: "Kaldırma gerekçesi en az 5 karakter olmalıdır." } });
          AVF.confirmDialog({ icon: "trash", danger: true, title: label + " kaldırılsın mı?", text: "Üyeye gerekçeyle birlikte bildirim gönderilir.", confirm: "Kaldır", cancel: "Vazgeç" }).then(function (y) {
            if (y) api("DELETE", "/members/" + m.id + "/forum/" + item, { reason: freason.value.trim() }).then(function () { AVF.toast("Kaldırıldı."); paintFid(); }, fail);
          });
        } }, AVF.icon("x", "bico"), label + " kaldır");
      }
      function paintFid() {
        api("GET", "/members/" + m.id + "/forum").then(function (f) {
          var socs = Object.keys(f.socials || {});
          AVF.mount(fidBox, h("div", { class: "fid-row" }, f.avatar_id ? h("img", { class: "fid-av", src: "/api/forum/media/" + f.avatar_id, alt: "Avatar" }) : h("span", { class: "hint", text: "Avatar yok" }),
            h("div", { class: "fid-t" }, f.signature ? h("p", { "data-notr": "", text: f.signature }) : h("span", { class: "hint", text: "İmza yok" }), f.sig_image_id ? h("img", { class: "fid-sig", src: "/api/forum/media/" + f.sig_image_id, alt: "İmza görseli" }) : null,
              socs.length ? h("small", { "data-notr": "", text: socs.map(function (k) { return k + ": " + f.socials[k]; }).join(" · ") }) : null)),
            f.avatar_id || f.signature || f.sig_image_id || socs.length ? [freason, h("div", { class: "row" }, f.avatar_id ? rmItem("avatar", "Avatarı") : null, f.signature ? rmItem("signature", "İmzayı") : null, f.sig_image_id ? rmItem("sig", "İmza görselini") : null, socs.length ? rmItem("socials", "Bağlantıları") : null)] : null);
        }, function (e2) { err(fidBox, e2); });
      }
      paintFid();
      var fidSec = msec("image", "Forum kimliği", "Avatar, imza ve bağlantılar herkese açıktır. Müstehcen, siyasi/ideolojik veya reklam içerenleri gerekçe yazarak kaldırın.", [fidBox]);
      AVF.mount(cell, h("div", { class: "mman" }, eb, h("div", { class: "mgrid" }, scope === "forum" ? [forumSec, forumBanSec(m, load, eb), fidSec, stateSec] : [roleSec, stateSec, permaSec])));
    }
  /** Tek tıkla hesap engeli / süreli yasak / kilit kaldırma (onay penceresiyle) — koçluk ve forum listelerinde ortak. */
  function unbanBtn(m, load) {
    if (m.state === "active") return null;
    return h("button", { class: "btn ghost sm unban", type: "button", onclick: function (e) {
      var b = e.currentTarget;
      AVF.confirmDialog({ icon: "unlock", title: (m.state === "banned" ? "Süreli yasak" : m.state === "blocked" ? "Engel" : "Kilit") + " kaldırılsın mı?", text: "@" + m.username + " hesabına hemen yeniden giriş yapabilir. İşlem denetim kaydına yazılır.", confirm: "Evet, kaldır", cancel: "Vazgeç" }).then(function (y) {
        if (!y) return; AVF.busy(b, true, "Kaldırılıyor…");
        api("POST", "/members/" + m.id + "/unblock", {}).then(function () { AVF.toast(AVF.t("Engel / yasak kaldırıldı.")); load(); }, function (er) { AVF.busy(b, false); AVF.toast(AVF.errText(er)); });
      });
    } }, AVF.icon("unlock", "bico"), m.state === "banned" ? "Yasağı kaldır" : m.state === "blocked" ? "Engeli kaldır" : "Kilidi aç");
  }
  function msec(icon, title, hint, kids) { return h("section", { class: "msec" }, h("h4", null, h("span", { class: "tile" }, AVF.icon(icon)), title), hint ? h("p", { class: "hint", text: hint }) : null, h("div", { class: "msec-b" }, kids)); }

  // ---------- yönetici: SİPARİŞLER ----------
  var DST = { waiting: ["Bekliyor", "clock"], preparing: ["Hazırlanıyor", "refresh"], delivered: ["Teslim edildi", "check"] };
  function ordersView(c) {
    var list = h("div");
    var bar = filterBar([
      { key: "q", type: "search", label: "Ara", icon: "tag", placeholder: "Sipariş no, ad soyad, kullanıcı adı, e-posta" },
      { key: "status", type: "select", label: "Ödeme", icon: "card", options: [["", "Tümü"], ["pending", "Ödeme bekleniyor"], ["paid", "Ödendi"], ["expired", "Süresi doldu"], ["cancelled", "İptal"]] },
      { key: "delivery", type: "select", label: "Teslim", icon: "check", options: [["", "Tümü"], ["waiting", "Bekliyor"], ["preparing", "Hazırlanıyor"], ["delivered", "Teslim edildi"]] },
      { key: "from", type: "date", label: "Başlangıç", icon: "calendar" }, { key: "to", type: "date", label: "Bitiş", icon: "calendar" }], load);
    AVF.mount(c, h("h2", { class: "ptitle" }, AVF.icon("tag"), " Siparişler"), bar, list);
    function load(v) {
      v = v || bar.values; AVF.mount(list, AVF.skeleton(3));
      var qs = Object.keys(v).filter(function (k) { return v[k]; }).map(function (k) { return k + "=" + encodeURIComponent(v[k]); }).join("&");
      api("GET", "/orders" + (qs ? "?" + qs : "")).then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state("tag", "Sonuç yok", "Filtrelere uyan sipariş bulunamadı."));
        AVF.mount(list, h("div", { class: "stack" }, rows.map(orderRow)));
      }, function (e) { AVF.mount(list, AVF.state("alert", "Yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { load(); } }, "Tekrar dene"))); });
    }
    function orderRow(o) {
      var eb = h("div"), reason = AVF.input("text", { maxlength: "300", placeholder: "Gerekçe (en az 10 karakter)" }), tx = AVF.input("text", { maxlength: "80", placeholder: "Ödeme referansı (isteğe bağlı)" });
      var canApprove = o.status !== "paid" && o.status !== "cancelled";
      var defKinds = ["nutrition", "training", "supplement", "notes"].concat(o.pharmacology ? ["pharmacology"] : []);
      var kchk = KINDS.map(function (k) { return h("label", { class: "check", style: "margin:2px 0" }, h("input", { type: "checkbox", checked: defKinds.indexOf(k) >= 0, "data-k": k }), AVF.icon(AVF.KIND[k].icon), AVF.KIND[k].label); });
      var dsel = h("select", { class: "inp", "aria-label": "Teslim durumu", disabled: o.status !== "paid" }, Object.keys(DST).map(function (k) { return h("option", { value: k, text: DST[k][0], selected: o.delivery_status === k }); }));
      var ds = DST[o.delivery_status] || DST.waiting;
      return AVF.accordion({ icon: "tag", title: o.order_number + " · " + (OSTATUS[o.status] || o.status) + (o.status === "paid" ? " · " + ds[0] : ""), sub: [o.member_name || o.buyer_name, o.username ? "@" + o.username : "", AVF.fmtDateTime(o.created_at)].filter(Boolean).join(" · "), content: [
        h("div", { class: "kv" }, kv("id", "Ad Soyad", o.member_name || o.buyer_name), kv("user", "Kullanıcı adı", o.username ? "@" + o.username : "—"), kv("mail", "E-posta", o.buyer_email),
          kv("clock", "Sipariş zamanı", AVF.fmtFull ? AVF.fmtFull(o.created_at) : AVF.fmtDateTime(o.created_at)), kv("list", "Paket", pkgText(o)),
          kv("coin", "Tutar", AVF.moneyC ? AVF.moneyC(o.subtotal, o.currency) : money(o.subtotal) + " " + o.currency), o.paid_at ? kv("card", "Ödeme", AVF.fmtDateTime(o.paid_at)) : null,
          o.plans_due_at ? kv("calendar", "Plan teslim tarihi", AVF.fmtDate(o.plans_due_at)) : null, o.status === "paid" ? kv("check", "Yayınlanan plan", o.plans_published) : null,
          o.delivered_at ? kv("check", "Teslim edildi", AVF.fmtDateTime(o.delivered_at)) : null, o.payment_ref ? kv("tag", "Ödeme referansı", o.payment_ref) : null),
        o.status === "paid" ? msec("check", "Paketin teslim durumu", "“Teslim edildi” seçildiğinde üyeye bildirim gider.", [h("div", { class: "row", style: "gap:8px" }, dsel,
          h("button", { class: "btn sm", type: "button", onclick: function () { api("PATCH", "/orders/" + o.id + "/delivery", { status: dsel.value }).then(function () { AVF.toast("Teslim durumu güncellendi."); load(); }, function (e) { err(eb, e); }); } }, AVF.icon("save", "bico"), "Kaydet"))]) : null,
        canApprove ? msec("card", "Elle ödeme onayı", "Elle onay yalnız doğrulanmış ödemeler (ör. havale) için kullanılmalıdır; gerekçe denetim kaydına yazılır. Aşağıda üyenin panelinde açılacak plan bölümlerini seçin.", [
          h("div", { class: "kgrid" }, kchk), AVF.field("Gerekçe", reason), AVF.field("Ödeme referansı", tx, { optional: true }),
          h("button", { class: "btn sm", type: "button", onclick: function () {
            var kinds = kchk.map(function (l) { return l.firstChild; }).filter(function (i) { return i.checked; }).map(function (i) { return i.getAttribute("data-k"); });
            AVF.confirmDialog({ icon: "card", title: "Sipariş onaylansın mı?", text: "Sipariş ödenmiş olarak işaretlenecek ve seçilen plan bölümleri üyeye açılacak.", confirm: "Onayla", cancel: "Vazgeç" }).then(function (y) {
              if (y) api("POST", "/orders/" + o.id + "/approve", { reason: reason.value, paymentRef: tx.value.trim() || undefined, kinds: kinds }).then(function () { AVF.toast("Sipariş onaylandı."); load(); }, function (e) { err(eb, e); });
            });
          } }, AVF.icon("check", "bico"), "Elle onayla")]) : null, eb] });
    }
    load();
  }

  // ---------- yönetici: FORUM ÜYELERİ — her üyenin içerikleri, forum yasağı ve hesap engeli/yasağı aynı satırda ----------
  function bapi(m, p, b) { return AVF.api(m, "/board" + p, b); }
  var FBAN_H = [[1, "1 saat"], [6, "6 saat"], [24, "1 gün"], [72, "3 gün"], [168, "7 gün"], [720, "30 gün"], [2160, "90 gün"]];
  function fbanChip(m) {
    if (m.forum_ban === "permanent") return h("span", { class: "chip warn" }, AVF.icon("lock"), h("span", { text: "Kalıcı uzaklaştırıldı" }));
    if (m.forum_ban === "temp") return [h("span", { class: "chip warn" }, AVF.icon("clock"), h("span", { text: "Süreli uzaklaştırıldı" })), h("small", { class: "sub", text: "Bitiş: " + AVF.fmtDateTime(m.forum_ban_until) })];
    return h("span", { class: "chip" }, AVF.icon("check"), h("span", { text: "Yazabilir" }));
  }
  /** Forum yasağı (uzaklaştırma): süreli (1 saat – 90 gün) ya da kalıcı; giriş engeli değildir, üye forumu okuyabilir ama yazamaz. */
  function forumBanSec(m, load, eb) {
    var reason = AVF.input("text", { maxlength: "200", placeholder: "Gerekçe (üyeye bildirilir)", "aria-label": "Forum yasağı gerekçesi" });
    var dur = h("select", { class: "inp", "aria-label": "Forum yasağı süresi" }, FBAN_H.map(function (x) { return h("option", { value: String(x[0]), text: x[1] }); }).concat([h("option", { value: "perm", text: "Kalıcı" })]));
    var isAdm = m.role === "admin";
    return msec("lock", "Forum yasağı (uzaklaştırma)", "Üye giriş yapabilir ve forumu okuyabilir; yasak süresince konu açamaz, yazamaz, tepki veremez. Süre dolunca kendiliğinden kalkar. Üyeye gerekçeyle bildirim gider.", isAdm ? [h("p", { class: "hint", text: "Yönetici hesaplarına uygulanamaz." })] : [
      m.forum_ban ? h("p", { class: "note warn", text: (m.forum_ban === "permanent" ? "Kalıcı forum yasağı" : "Süreli forum yasağı · bitiş: " + AVF.fmtDateTime(m.forum_ban_until)) + (m.forum_ban_reason ? " · Gerekçe: " + m.forum_ban_reason : "") }) : null,
      reason, h("div", { class: "row", style: "gap:8px;flex-wrap:wrap" }, dur,
        h("button", { class: "btn ghost sm", type: "button", onclick: function () {
          if (reason.value.trim().length < 3) return err(eb, { data: { error: "Gerekçe yazın." } });
          var perm = dur.value === "perm";
          AVF.confirmDialog({ icon: "lock", danger: true, title: "Forumdan uzaklaştırılsın mı?", text: "@" + m.username + " · " + (perm ? "Kalıcı" : dur.options[dur.selectedIndex].text), confirm: "Uzaklaştır", cancel: "Vazgeç" }).then(function (y) {
            if (y) bapi("POST", "/mod/ban/" + m.username, perm ? { permanent: true, reason: reason.value.trim() } : { hours: Number(dur.value), reason: reason.value.trim() }).then(function () { AVF.toast(AVF.t("Forum yasağı uygulandı.")); load(); }, function (e) { err(eb, e); });
          });
        } }, AVF.icon("lock", "bico"), "Forumdan uzaklaştır"),
        m.forum_ban ? h("button", { class: "btn sm", type: "button", onclick: function () {
          bapi("DELETE", "/mod/ban/" + m.username).then(function () { AVF.toast(AVF.t("Forum yasağı kaldırıldı.")); load(); }, function (e) { err(eb, e); });
        } }, AVF.icon("unlock", "bico"), "Forum yasağını kaldır") : null)]);
  }
  /** Bir üyenin forum içerikleri (kaldırılanlar dahil): konu ve mesajlar; gerekçeyle kaldır / geri getir. */
  function forumContent(cell, m) {
    var eb = h("div"), why = AVF.input("text", { maxlength: "200", placeholder: "Kaldırma gerekçesi (üyeye iletilir)", "aria-label": "Kaldırma gerekçesi" }), box = h("div", null, AVF.skeleton(2));
    AVF.mount(cell, h("div", { class: "fcont" }, eb, box));
    function act(kind, id, hide) {
      if (hide && why.value.trim().length < 3) { why.focus(); return err(eb, { data: { error: "Kaldırma gerekçesi yazın." } }); }
      AVF.mount(eb, null);
      bapi("POST", (kind === "t" ? "/t/" : "/posts/") + id + "/mod", { action: hide ? "hide" : "restore", reason: hide ? why.value.trim() : "" }).then(function () { AVF.toast(AVF.t(hide ? "Kaldırıldı." : "Geri getirildi.")); paint(); }, function (e) { err(eb, e); });
    }
    function paint() {
      bapi("GET", "/mod/u/" + encodeURIComponent(m.username) + "/content").then(function (r) {
        var tl = r.topics.map(function (t) {
          return h("li", { class: t.hidden ? "off" : "" }, h("span", { class: "tile" }, AVF.icon(t.category.icon || "msg")),
            h("div", { class: "fc-t" }, h("a", { href: "/forum/konu/" + t.id, target: "_blank", rel: "noopener", "data-notr": "", text: t.title }),
              h("small", { text: t.category.name + " · " + AVF.fmtDateTime(t.at) + " · " + t.replies + " yanıt · " + t.likes + " beğeni · " + t.views + " görüntülenme" }), t.hidden ? h("span", { class: "chip", text: "Kaldırıldı" }) : null),
            h("button", { class: "btn ghost sm", type: "button", onclick: function () { act("t", t.id, !t.hidden); } }, AVF.icon(t.hidden ? "refresh" : "x", "bico"), t.hidden ? "Geri getir" : "Kaldır"));
        });
        var pl = r.posts.map(function (p) {
          return h("li", { class: p.hidden || p.topicHidden ? "off" : "" }, h("span", { class: "tile" }, AVF.icon("chat")),
            h("div", { class: "fc-t" }, h("p", { "data-notr": "", text: p.excerpt || "(görsel)" }), h("small", null, h("a", { href: "/forum/konu/" + p.topicId + "#m" + p.id, target: "_blank", rel: "noopener", "data-notr": "", text: p.title }), h("span", { text: " · " + AVF.fmtDateTime(p.at) + " · " + p.likes + " beğeni" })),
              p.openReports ? h("span", { class: "chip warn", text: p.openReports + " açık şikâyet" }) : null, p.hidden ? h("span", { class: "chip", text: "Kaldırıldı" }) : p.topicHidden ? h("span", { class: "chip", text: "Konusu kaldırıldı" }) : null),
            p.topicHidden ? null : h("button", { class: "btn ghost sm", type: "button", onclick: function () { act("p", p.id, !p.hidden); } }, AVF.icon(p.hidden ? "refresh" : "x", "bico"), p.hidden ? "Geri getir" : "Kaldır"));
        });
        AVF.mount(box, r.ban ? h("p", { class: "note warn", text: (r.ban.permanent ? "Kalıcı forum yasağı" : "Forum yasağı · bitiş: " + AVF.fmtDateTime(r.ban.until)) + (r.ban.reason ? " · " + r.ban.reason : "") }) : null,
          tl.length || pl.length ? AVF.field("Kaldırma gerekçesi", why, { optional: true }) : null,
          h("div", { class: "fc-g" },
            h("section", null, h("h4", null, AVF.icon("file"), h("span", { text: "Konular" }), h("small", { "data-notr": "", text: String(r.topics.length) })), tl.length ? h("ul", { class: "fc-l" }, tl) : h("p", { class: "hint", text: "Konu yok." })),
            h("section", null, h("h4", null, AVF.icon("chat"), h("span", { text: "Mesajlar" }), h("small", { "data-notr": "", text: String(r.posts.length) })), pl.length ? h("ul", { class: "fc-l" }, pl) : h("p", { class: "hint", text: "Mesaj yok." }))));
      }, function (e) { err(box, e); });
    }
    paint();
  }
  function forumMembersView(c) {
    var list = h("div"), count = h("span", { class: "hint" });
    var bar = filterBar([
      { key: "q", type: "search", label: "Ara", icon: "users", placeholder: "Ad soyad, kullanıcı adı, e-posta, üye kodu" },
      { key: "forumBan", type: "select", label: "Forum durumu", icon: "lock", options: [["", "Tümü"], ["any", "Uzaklaştırılmış"], ["temp", "Süreli uzaklaştırma"], ["permanent", "Kalıcı uzaklaştırma"]] },
      { key: "state", type: "select", label: "Hesap", icon: "shield", options: [["", "Tümü"], ["active", "Aktif"], ["blocked", "Engelli"], ["banned", "Süreli yasaklı"], ["locked", "Kilitli"]] },
      { key: "sort", type: "select", label: "Sırala", icon: "list", options: [["seen", "Son görülen"], ["posts", "En çok içerik"], ["reports", "En çok şikâyet"], ["new", "En yeni kayıt"], ["name", "Ada göre"]] }], load);
    AVF.mount(c, h("div", { class: "row between", style: "margin-bottom:12px" }, h("h2", { class: "ptitle", style: "margin:0" }, AVF.icon("award"), " Forum Üyeleri"), count),
      h("p", { class: "hint", style: "margin:-4px 0 12px", text: "Forum kurallarını onaylayıp foruma giren üyeler. “İçerikler” ile üyenin tüm konu ve mesajlarını burada görüp kaldırabilirsiniz; forum yasağı ve hesap engeli “Yönet” altındadır." }), bar, list);
    if (!forumLevels) api("GET", "/forum/levels").then(function (l) { forumLevels = l; }, function () {});
    function load(v) {
      v = v || bar.values; AVF.mount(list, AVF.skeleton(3));
      var o = Object.assign({ segment: "forum" }, v);
      var qs = Object.keys(o).filter(function (k) { return o[k]; }).map(function (k) { return k + "=" + encodeURIComponent(o[k]); }).join("&");
      api("GET", "/members?" + qs).then(function (rows) {
        count.textContent = rows.length + " kayıt";
        if (!rows.length) return AVF.mount(list, AVF.state("award", "Sonuç yok", "Filtrelere uyan forum üyesi bulunamadı."));
        AVF.mount(list, h("div", { class: "card tbl-w" }, h("table", { class: "t stackm mtab" },
          h("thead", null, h("tr", null, ["Üye", "Seviye", "İçerik", "Etkileşim", "Forum durumu", "Hesap", ""].map(function (x) { return h("th", { text: x }); }))),
          h("tbody", null, rows.map(row)))));
      }, function (e) { err(list, e); });
    }
    function row(m) {
      var st = STATE[m.state] || STATE.active, detail = h("tr", { class: "mdet", hidden: "" }, h("td", { colspan: "7" })), open = null, bC, bM;
      function toggle(which, btn) {
        var same = open === which && !detail.hidden;
        [bC, bM].forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
        if (same) { detail.hidden = true; open = null; return; }
        detail.hidden = false; open = which; btn.setAttribute("aria-expanded", "true");
        if (which === "c") forumContent(detail.firstChild, m); else manage(detail.firstChild, m, "forum", load);
      }
      bC = h("button", { class: "btn sm", type: "button", "aria-expanded": "false", onclick: function (e) { toggle("c", e.currentTarget); } }, AVF.icon("file", "bico"), "İçerikler");
      bM = h("button", { class: "btn ghost sm", type: "button", "aria-expanded": "false", onclick: function (e) { toggle("m", e.currentTarget); } }, AVF.icon("cog", "bico"), "Yönet");
      return [h("tr", null,
        h("td", { "data-l": "Üye" }, h("b", { "data-notr": "", text: m.full_name }), h("small", { class: "sub", "data-notr": "", text: "@" + m.username + " · " + m.user_code }), m.forum_role === "moderator" ? h("span", { class: "chip lime", text: "Moderatör" }) : m.role !== "user" ? h("span", { class: "chip lime", text: ROLES[m.role] }) : null),
        h("td", { "data-l": "Seviye" }, h("span", { class: "lvl" }, AVF.icon("award"), h("span", { text: m.forumLevel.name })), m.forumLevel.manual ? h("small", { class: "sub", text: "elle verildi" }) : null,
          h("small", { class: "sub", text: (m.forum_since ? "Katılım: " + AVF.fmtDate(m.forum_since) : "") + (m.forum_seen ? " · Son görülme: " + AVF.fmtDateTime(m.forum_seen) : "") })),
        h("td", { "data-l": "İçerik" }, h("span", { class: "fstats" }, h("span", { title: "Konu" }, AVF.icon("file"), String(m.topics)), h("span", { title: "Mesaj" }, AVF.icon("chat"), String(m.posts)))),
        h("td", { "data-l": "Etkileşim" }, h("span", { class: "fstats" }, h("span", { title: "Beğeni" }, AVF.icon("like"), String(m.likes)), h("span", { title: "Beğenmeme" }, AVF.icon("dislike"), String(m.dislikes)), h("span", { title: "Alınan şikâyet (haklı bulunan)" }, AVF.icon("flag"), m.reports_received + " (" + m.reports_upheld + ")"))),
        h("td", { "data-l": "Forum durumu" }, fbanChip(m)),
        h("td", { "data-l": "Hesap" }, h("span", { class: st[1] }, AVF.icon(st[2]), st[0]), m.state === "banned" && m.locked_until ? h("small", { class: "sub", text: "Bitiş: " + AVF.fmtDateTime(m.locked_until) }) : null, unbanBtn(m, load)),
        h("td", { class: "mact" }, bC, bM)), detail];
    }
    load();
  }

  // ---------- yönetici: FORUM YÖNETİMİ — şikâyet kuyruğu, yasaklar, kategoriler ve ayarlar, moderasyon kaydı, ölçümler (hepsi bu sayfada) ----------
  var FTABS = [["sikayet", "flag", "Şikâyet kuyruğu"], ["yasak", "lock", "Forum yasakları"], ["kategori", "cog", "Kategoriler ve ayarlar"], ["kayit", "list", "Moderasyon kaydı"], ["olcum", "chart", "Ölçümler"]], ftab = "sikayet", REASONS = null;
  function forumView(c) {
    var body = h("div"), head = h("div");
    AVF.mount(c, h("div", { class: "row between", style: "margin-bottom:12px;flex-wrap:wrap;gap:8px" }, h("h2", { class: "ptitle", style: "margin:0" }, AVF.icon("msg"), " Forum Yönetimi"),
      h("a", { class: "btn ghost sm", href: "/forum", target: "_blank", rel: "noopener" }, AVF.icon("msg", "bico"), "Forumu aç")), head, body);
    var tabsEl = h("div", { class: "ftabs", role: "tablist", "aria-label": "Forum yönetimi bölümleri" });
    function paintTabs(st) {
      AVF.mount(tabsEl, FTABS.map(function (t) {
        var on = t[0] === ftab, n = t[0] === "sikayet" && st ? st.openReports : null;
        return h("button", { type: "button", role: "tab", class: "ftab" + (on ? " on" : ""), "aria-selected": String(on), onclick: function () { ftab = t[0]; paintTabs(st); show(); } },
          AVF.icon(t[1]), h("span", { text: t[2] }), n ? h("b", { class: "badge", "data-notr": "", text: String(n) }) : null);
      }));
    }
    var stats = h("div");
    AVF.mount(head, stats, tabsEl);
    function refreshStats() {
      bapi("GET", "/home").then(function (H) {
        var st = H.stats, me2 = H.me, tile = function (icon, label, val) { return h("div", { class: "card ftile" }, h("span", { class: "tile" }, AVF.icon(icon)), h("div", null, h("small", { text: label }), h("b", { "data-notr": "", text: String(val) }))); };
        AVF.mount(stats, h("div", { class: "fstat-g" }, tile("flag", "Açık şikâyet", me2.openReports), tile("file", "Konu", st.topics), tile("chat", "Mesaj", st.posts), tile("users", "Forum üyesi", st.members), tile("pulse", "Şu an çevrimiçi", st.online)));
        paintTabs({ openReports: me2.openReports }); H.categories && (forumView.cats = H.categories);
      }, function (e) { err(stats, e); paintTabs(null); });
    }
    paintTabs(null); refreshStats();
    if (!REASONS) AVF.api("GET", "/board/rules").then(function (r) { REASONS = {}; (r.reasons || []).forEach(function (x) { REASONS[x[0]] = x[1]; }); }, function () {});
    function show() {
      AVF.mount(body, AVF.skeleton(2));
      if (ftab === "sikayet") return reportsPane(body, refreshStats);
      if (ftab === "yasak") return bansPane(body);
      if (ftab === "kategori") return catsPane(body);
      if (ftab === "kayit") return modLogPane(body);
      return metricsPane(body);
    }
    show();
  }
  function reportsPane(box, after) {
    var status = "open", list = h("div", { class: "stack" });
    var seg = h("div", { class: "fseg", role: "group", "aria-label": "Şikâyet durumu" });
    function paintSeg() { AVF.mount(seg, [["open", "Açık"], ["upheld", "Haklı bulunan"], ["dismissed", "Reddedilen"]].map(function (x) { return h("button", { type: "button", class: x[0] === status ? "on" : "", "aria-pressed": String(x[0] === status), onclick: function () { status = x[0]; paintSeg(); load(); } }, x[1]); })); }
    paintSeg();
    AVF.mount(box, seg, list);
    function load() {
      AVF.mount(list, AVF.skeleton(2));
      bapi("GET", "/mod/reports?status=" + status).then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state("flag", status === "open" ? "Açık şikâyet yok" : "Kayıt yok", status === "open" ? "Yeni şikâyetler burada görünür; üyeler bildirim alır." : ""));
        AVF.mount(list, rows.map(function (r) {
          var eb = h("div"), why = AVF.input("text", { maxlength: "200", placeholder: "Gerekçe (isteğe bağlı; içerik sahibine iletilir)", "aria-label": "Gerekçe" });
          function decide(a) {
            AVF.confirmDialog({ icon: a === "uphold" ? "trash" : "check", danger: a === "uphold", title: a === "uphold" ? "Şikâyet haklı bulunsun mu?" : "Şikâyet reddedilsin mi?", text: a === "uphold" ? "İçerik kaldırılır; içerik sahibine ve şikâyet edenlere bildirim gider." : "İçerik yayında kalır; şikâyet edenlere bildirim gider.", confirm: a === "uphold" ? "Haklı bul ve kaldır" : "Reddet", cancel: "Vazgeç" }).then(function (y) {
              if (y) bapi("POST", "/mod/reports/" + r.postId, { action: a, reason: why.value.trim() }).then(function () { AVF.toast(AVF.t(a === "uphold" ? "İçerik kaldırıldı." : "Şikâyet reddedildi.")); load(); after && after(); }, function (e) { err(eb, e); });
            });
          }
          return h("article", { class: "card frep" },
            h("div", { class: "frep-h" }, h("span", { class: "tile" }, AVF.icon(r.first ? "file" : "chat")), h("div", { style: "flex:1;min-width:0" },
              h("a", { href: "/forum/konu/" + r.topicId + "#m" + r.postId, target: "_blank", rel: "noopener", "data-notr": "", text: r.title }),
              h("small", { text: (r.first ? "Konunun ilk mesajı" : "Yanıt") + " · @" + (r.author || "silinmiş üye") + " · " + AVF.fmtDateTime(r.postAt) })),
              r.hidden ? h("span", { class: "chip", text: "Kaldırıldı" }) : null),
            h("blockquote", { class: "frep-b", "data-notr": "", text: plain(r.body).slice(0, 600) }),
            h("ul", { class: "frep-l" }, r.reports.map(function (x) {
              return h("li", null, AVF.icon("flag"), h("b", { text: (REASONS && REASONS[x.reason]) || x.reason }), x.note ? h("span", { "data-notr": "", text: " — " + x.note }) : null,
                h("small", { text: " · @" + (x.by || "—") + " · " + AVF.fmtDateTime(x.at) + (x.handledBy ? " · işlem: @" + x.handledBy : "") }));
            })),
            status === "open" ? [why, h("div", { class: "row", style: "gap:8px;flex-wrap:wrap;margin-top:8px" },
              h("button", { class: "btn danger sm", type: "button", onclick: function () { decide("uphold"); } }, AVF.icon("trash", "bico"), "Haklı bul ve kaldır"),
              h("button", { class: "btn ghost sm", type: "button", onclick: function () { decide("dismiss"); } }, AVF.icon("check", "bico"), "Reddet"),
              r.author ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { tab = "forum-uyeler"; sel = null; render(); setTimeout(function () { var q = document.querySelector('.fbar input[type="search"]'); if (q) { q.value = r.author; q.dispatchEvent(new Event("input")); } }, 50); } }, AVF.icon("user", "bico"), "Üyeyi aç") : null)] : null, eb);
        }));
      }, function (e) { err(list, e); });
    }
    load();
  }
  function plain(html) { var d = document.createElement("div"); d.innerHTML = String(html || "").replace(/<(script|style)[\s\S]*?<\/\1>/gi, ""); return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function bansPane(box) {
    var eb = h("div"), list = h("div");
    var un = AVF.input("text", { maxlength: "20", placeholder: "kullanici_adi", "aria-label": "Kullanıcı adı", autocomplete: "off" }), reason = AVF.input("text", { maxlength: "200", placeholder: "Gerekçe (üyeye bildirilir)", "aria-label": "Gerekçe" });
    var dur = h("select", { class: "inp", "aria-label": "Süre" }, FBAN_H.map(function (x) { return h("option", { value: String(x[0]), text: x[1] }); }).concat([h("option", { value: "perm", text: "Kalıcı" })]));
    AVF.mount(box, msec("lock", "Yeni forum yasağı", "Üye giriş yapabilir ve forumu okuyabilir; süre boyunca yazamaz. Hesap engeli için Forum Üyeleri › Yönet bölümünü kullanın.", [
      h("div", { class: "row", style: "gap:8px;flex-wrap:wrap" }, h("div", { style: "flex:1;min-width:160px" }, un), dur), reason,
      h("button", { class: "btn sm", type: "button", onclick: function () {
        var u = un.value.trim().replace(/^@/, "").toLowerCase(), perm = dur.value === "perm";
        if (!/^[a-z0-9._]{3,20}$/.test(u)) return err(eb, { data: { error: "Geçerli bir kullanıcı adı yazın." } });
        if (reason.value.trim().length < 3) return err(eb, { data: { error: "Gerekçe yazın." } });
        bapi("POST", "/mod/ban/" + u, perm ? { permanent: true, reason: reason.value.trim() } : { hours: Number(dur.value), reason: reason.value.trim() }).then(function () { AVF.toast(AVF.t("Forum yasağı uygulandı.")); un.value = ""; reason.value = ""; AVF.mount(eb, null); load(); }, function (e) { err(eb, e); });
      } }, AVF.icon("lock", "bico"), "Forumdan uzaklaştır"), eb]), h("h3", { style: "margin:18px 0 10px", text: "Yürürlükteki yasaklar" }), list);
    function load() {
      AVF.mount(list, AVF.skeleton(1));
      bapi("GET", "/mod/bans").then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state("lock", "Yürürlükte forum yasağı yok", ""));
        AVF.mount(list, h("div", { class: "card tbl-w" }, h("table", { class: "t stackm" }, h("thead", null, h("tr", null, ["Üye", "Süre", "Gerekçe", ""].map(function (x) { return h("th", { text: x }); }))),
          h("tbody", null, rows.map(function (b) {
            return h("tr", null, h("td", { "data-l": "Üye" }, h("b", { "data-notr": "", text: "@" + b.username })), h("td", { "data-l": "Süre", text: b.permanent ? "Kalıcı" : "Bitiş: " + AVF.fmtDateTime(b.until) }),
              h("td", { "data-l": "Gerekçe" }, h("span", { "data-notr": "", text: b.reason || "—" })),
              h("td", { class: "mact" }, h("button", { class: "btn ghost sm", type: "button", onclick: function () {
                AVF.confirmDialog({ icon: "unlock", title: "Forum yasağı kaldırılsın mı?", text: "@" + b.username + " yeniden yazabilir; üyeye bildirim gider.", confirm: "Kaldır", cancel: "Vazgeç" }).then(function (y) {
                  if (y) bapi("DELETE", "/mod/ban/" + b.username).then(function () { AVF.toast(AVF.t("Forum yasağı kaldırıldı.")); load(); }, function (e) { err(list, e); });
                });
              } }, AVF.icon("unlock", "bico"), "Yasağı kaldır")));
          })))));
      }, function (e) { err(list, e); });
    }
    load();
  }
  function catsPane(box) {
    Promise.all([bapi("GET", "/home"), forumLevels ? forumLevels : api("GET", "/forum/levels").then(function (l) { forumLevels = l; return l; })]).then(function (x) {
      var cats = []; x[0].categories.forEach(function (c) { cats.push(c); (c.children || []).forEach(function (k) { cats.push(k); }); });
      AVF.mount(box, h("p", { class: "hint", text: "Bu ayarlar forumun içindeki moderasyon sayfasıyla aynıdır; burada yapılan değişiklik anında foruma yansır ve denetim kaydına yazılır. Duyurular bölümünde yalnız yönetim ve moderatörler konu açar ve yazar." }),
        h("div", { class: "stack" }, cats.map(function (c) {
          var eb = h("div"), name = AVF.input("text", { maxlength: "60", value: c.name, "aria-label": "Kategori adı" }), desc = h("textarea", { class: "inp", maxlength: "240", rows: "2", "aria-label": "Açıklama" }), notice = h("textarea", { class: "inp", maxlength: "400", rows: "2", "aria-label": "Kategori duyurusu", placeholder: "Kategori sayfasının üstünde görünen not (isteğe bağlı)" });
          desc.value = c.description || ""; notice.value = c.notice || "";
          var lvl = h("select", { class: "inp", "aria-label": "Konu açmak için en düşük seviye", disabled: c.kind === "announce" }, x[1].map(function (l) { return h("option", { value: String(l.n), text: l.n + " · " + l.name, selected: c.minLevel === l.n }); }));
          var lock = h("input", { type: "checkbox", checked: !!c.isLocked });
          return AVF.accordion({ icon: c.icon || "msg", title: c.name + (c.parentId ? " (alt kategori)" : ""), sub: (c.kind === "announce" ? "Duyuru · yalnız yönetim yazar" : "En düşük seviye: " + ((x[1][c.minLevel - 1] || {}).name || c.minLevel)) + (c.isLocked ? " · Yeni konulara kapalı" : "") + " · " + (c.topics || 0) + " konu", content: [
            AVF.field("Ad", name), AVF.field("Açıklama", desc, { optional: true }), AVF.field("Kategori notu", notice, { optional: true }),
            c.kind === "announce" ? h("p", { class: "hint", text: "Duyurular: üyeler konu açamaz, yanıt yazamaz; yalnız okur." }) : AVF.field("Konu açmak için en düşük seviye", lvl),
            h("label", { class: "check" }, lock, "Yeni konu ve mesajlara kapat (moderatörler yazabilir)"), eb,
            h("button", { class: "btn sm", type: "button", onclick: function (e) {
              var b = e.currentTarget; AVF.busy(b, true, "Kaydediliyor…");
              bapi("PUT", "/mod/categories/" + c.id, { name: name.value.trim(), description: desc.value, notice: notice.value, minLevel: Number(lvl.value), isLocked: lock.checked }).then(function () { AVF.busy(b, false); AVF.toast(AVF.t("Kategori kaydedildi.")); AVF.mount(eb, null); }, function (er) { AVF.busy(b, false); err(eb, er); });
            } }, AVF.icon("save", "bico"), "Kaydet")] });
        })),
        h("div", { class: "card", style: "padding:18px;margin-top:14px" }, h("h3", { style: "margin-bottom:6px" }, "Seviye kuralları"),
          h("p", { class: "hint", text: "Kullanıcılar arası mesajlaşma Pump Avcısı seviyesinde açılır. Moderatör ve Admin yalnız atamayla verilir. Üyenin seviyesi ve moderatörlüğü Forum Üyeleri › Yönet bölümündedir." }),
          h("ol", { class: "lvl-list" }, x[1].map(function (l) { return h("li", null, h("span", { class: "tile" }, AVF.icon("award")), h("b", { text: l.name }), h("small", { text: l.min + "+ puan" })); }),
            h("li", null, h("span", { class: "tile" }, AVF.icon("shield")), h("b", { text: "Moderatör" }), h("small", { text: "atama ile" })),
            h("li", null, h("span", { class: "tile" }, AVF.icon("key")), h("b", { text: "AlpveFit" }), h("small", { text: "yönetici · atama ile" })))));
    }, function (e) { err(box, e); });
  }
  var MODLOG = { forum_topic_pin: "Konu sabitlendi", forum_topic_unpin: "Sabitleme kaldırıldı", forum_topic_move: "Konu taşındı", forum_topic_kind: "Konu türü değişti", forum_topic_hide: "Konu kaldırıldı", forum_topic_restore: "Konu geri getirildi",
    forum_post_hide: "Mesaj kaldırıldı", forum_post_restore: "Mesaj geri getirildi", forum_post_edit_mod: "Mesaj düzenlendi", forum_report_uphold: "Şikâyet haklı bulundu", forum_report_dismiss: "Şikâyet reddedildi",
    forum_ban: "Forumdan uzaklaştırma", forum_unban: "Uzaklaştırma kaldırıldı", forum_category_update: "Kategori güncellendi", forum_blocked_filter: "Filtre: gönderi engellendi", dm_blocked_filter: "Filtre: mesaj engellendi", member_forum_set: "Seviye / moderatörlük" };
  function modLogPane(box) {
    bapi("GET", "/mod/log").then(function (rows) {
      if (!rows.length) return AVF.mount(box, AVF.state("list", "Kayıt yok", ""));
      AVF.mount(box, h("ul", { class: "card fc-l mlog" }, rows.map(function (r) {
        return h("li", null, h("span", { class: "tile" }, AVF.icon(/ban/.test(r.action) ? "lock" : /report/.test(r.action) ? "flag" : /filter/.test(r.action) ? "shield" : "bolt")),
          h("div", { class: "fc-t" }, h("b", { text: MODLOG[r.action] || r.action }), h("small", { text: AVF.fmtDateTime(r.at) + " · " + (r.actor ? "@" + r.actor : "Sistem") }), r.reason ? h("small", { "data-notr": "", text: r.reason }) : null),
          r.topic ? h("a", { class: "btn ghost sm", href: "/forum/konu/" + r.topic, target: "_blank", rel: "noopener" }, AVF.icon("arrow", "bico"), "Konu") : null);
      })));
    }, function (e) { err(box, e); });
  }
  function metricsPane(box) {
    api("GET", "/forum/metrics").then(function (m) {
      function delta(a, b) { if (b == null || a == null) return ""; var d = a - b; return d === 0 ? " (=)" : " (" + (d > 0 ? "+" : "") + d + ")"; }
      function mt(icon, label, val, sub) { return h("div", { class: "card", style: "padding:12px;display:flex;gap:10px;align-items:flex-start" }, h("span", { class: "tile" }, AVF.icon(icon)), h("div", null, h("small", { style: "display:block;color:var(--muted);font-weight:600", text: label }), h("b", { style: "font-size:20px", text: val == null ? "—" : String(val) }), sub ? h("small", { style: "display:block;color:var(--muted)", text: sub }) : null)); }
      var fr = m.firstReply.medianMinutes, frt = fr == null ? null : fr < 60 ? fr + " dk" : Math.round(fr / 6) / 10 + " sa", u = m.usage;
      AVF.mount(box, h("h3", { style: "margin-bottom:10px" }, "Forum ölçümleri (son 7 gün)"),
        h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px" },
          mt("users", "Etkin üye", m.week.active, "önceki hafta " + m.prevWeek.active + delta(m.week.active, m.prevWeek.active)),
          mt("refresh", "Geri dönen üye", m.returning, m.returningRate == null ? "önceki hafta etkin üye yok" : "önceki haftanın %" + m.returningRate + "'i"),
          mt("file", "Yeni konu", m.week.topics, "önceki hafta " + m.prevWeek.topics + delta(m.week.topics, m.prevWeek.topics)),
          mt("chat", "Yanıt", m.week.replies, m.repliesPerTopic == null ? "" : "konu başına " + String(m.repliesPerTopic).replace(".", ",")),
          mt("clock", "İlk yanıt süresi (medyan)", frt, m.firstReply.answered + " / " + m.firstReply.total + " konu yanıt aldı"),
          mt("plus", "Foruma katılan", m.week.joined, "önceki hafta " + m.prevWeek.joined),
          mt("bell", "Cihaz bildirimi açık", u.push_users, u.members + " forum üyesinden"),
          mt("mail", "Haftalık özet açık", u.digest_users, ""),
          mt("shield", "KVKK açık rızası", u.consent_users, u.members + " forum üyesinden"),
          mt("pulse", "Gelişim günlüğü (7 gün)", u.journal_users, "kayıt giren üye"),
          mt("flame", "Meydan okuma (7 gün)", u.challenge_users, u.badges_week + " rozet kazanıldı"),
          mt("flag", "Açık şikâyet / filtre", u.open_reports, u.filtered_week + " gönderi filtreye takıldı")),
        m.top.length ? h("div", { class: "card", style: "padding:16px;margin-top:14px" }, h("b", { text: "Haftanın öne çıkan konuları" }), h("ol", { style: "margin:8px 0 0;padding-left:20px" }, m.top.map(function (t) {
          return h("li", { style: "margin:4px 0" }, h("a", { href: "/forum/konu/" + t.id, target: "_blank", rel: "noopener", "data-notr": "", text: t.title }), h("small", { style: "color:var(--muted)" }, " · ", h("span", { text: t.reply_count + " yanıt · " + t.like_count + " beğeni · " + t.view_count + " görüntülenme" })));
        }))) : null);
    }, function (e) { err(box, e); });
  }

  // ---------- yönetici: ZİYARET ANALİZİ — kim, hangi sayfada, ne kadar süre (yalnız ölçüme izin veren ziyaretçiler) ----------
  var vdays = 7;
  function dur(ms) {
    var sec = Math.round((ms || 0) / 1000), hh = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60, EN = AVF.lang === "en";
    if (hh) return hh + (EN ? " h " : " sa ") + mm + (EN ? " min" : " dk");
    if (mm) return mm + (EN ? " min " : " dk ") + ss + (EN ? " s" : " sn");
    return ss + (EN ? " s" : " sn");
  }
  var REF_TR = { direct: "Doğrudan", internal: "Site içi", search: "Arama motoru", social: "Sosyal medya", other: "Diğer siteler" };
  function visitsView(c) {
    var body = h("div", null, AVF.skeleton(3)), seg = h("div", { class: "fseg", role: "group", "aria-label": "Dönem" });
    function paintSeg() { AVF.mount(seg, [[1, "Bugün"], [7, "7 gün"], [30, "30 gün"], [90, "90 gün"]].map(function (x) { return h("button", { type: "button", "data-days": String(x[0]), class: x[0] === vdays ? "on" : "", "aria-pressed": String(x[0] === vdays), onclick: function () { vdays = x[0]; paintSeg(); load(); } }, x[1]); })); }
    paintSeg();
    AVF.mount(c, h("h2", { class: "ptitle" }, AVF.icon("chart"), " Ziyaret Analizi"),
      h("p", { class: "hint", style: "margin:-4px 0 12px", text: "Yalnız çerez bildiriminde ölçüme izin veren ziyaretçiler sayılır; sekme arka plandayken geçen süre sayılmaz. IP ve sorgu dizesi saklanmaz; kayıtlar 90 gün sonra silinir." }), seg, body);
    function load() {
      AVF.mount(body, AVF.skeleton(3));
      api("GET", "/analytics?days=" + vdays).then(function (d) {
        var sm = d.summary, tile = function (icon, label, val, sub) { return h("div", { class: "card ftile" }, h("span", { class: "tile" }, AVF.icon(icon)), h("div", null, h("small", { text: label }), h("b", { "data-notr": "", text: String(val) }), sub ? h("small", { "data-notr": "", text: sub }) : null)); };
        if (!sm.views) return AVF.mount(body, AVF.state("chart", "Bu dönemde ölçüm yok", "Ziyaretçiler ölçüme izin verdikçe veriler burada görünür."));
        var maxH = Math.max.apply(null, d.hours.map(function (x) { return x.views; }).concat([1])), H = {}; d.hours.forEach(function (x) { H[x.h] = x.views; });
        AVF.mount(body,
          h("div", { class: "fstat-g" }, tile("eye", "Görüntülenme", sm.views), tile("refresh", "Oturum", sm.sessions), tile("users", "Giriş yapmış üye", sm.members),
            tile("clock", "Toplam süre", dur(sm.total_ms)), tile("pulse", "Sayfa başına ort.", dur(sm.avg_ms)), tile("phone", "Mobil", Math.round(sm.mobile / Math.max(1, sm.views) * 100) + "%", (AVF.lang === "en" ? "desktop " : "masaüstü ") + sm.desktop + " · " + (AVF.lang === "en" ? "mobile " : "mobil ") + sm.mobile)),
          h("div", { class: "vgrid" },
            h("section", { class: "card vcard" }, h("h3", { text: "Ziyaret saatleri" }), h("div", { class: "vhours", role: "img", "aria-label": "Saatlere göre görüntülenme" }, Array.from({ length: 24 }, function (_, i) {
              var v = H[i] || 0; return h("div", { class: "vh", title: i + ":00 · " + v }, h("i", { style: "height:" + Math.round(v / maxH * 100) + "%" }), i % 3 === 0 ? h("small", { "data-notr": "", text: String(i) }) : h("small", { text: "" }));
            }))),
            h("section", { class: "card vcard" }, h("h3", { text: "Nereden geldiler" }), h("ul", { class: "vrefs" }, d.refs.filter(function (r) { return r.ref !== "internal"; }).map(function (r) { return h("li", null, h("span", { text: REF_TR[r.ref] || r.ref }), h("b", { "data-notr": "", text: String(r.sessions) })); })))),
          h("section", { class: "card vcard" }, h("h3", { text: "Sayfalar — nerede ne kadar vakit geçirildi" }), h("div", { class: "tbl-w" }, h("table", { class: "t stackm" },
            h("thead", null, h("tr", null, ["Sayfa", "Görüntülenme", "Oturum", "Toplam süre", "Ortalama"].map(function (x) { return h("th", { text: x }); }))),
            h("tbody", null, d.pages.map(function (p) { return h("tr", null, h("td", { "data-l": "Sayfa" }, h("code", { "data-notr": "", text: p.path })), h("td", { "data-l": "Görüntülenme", "data-notr": "", text: String(p.views) }), h("td", { "data-l": "Oturum", "data-notr": "", text: String(p.sessions) }), h("td", { "data-l": "Toplam süre", text: dur(p.total_ms) }), h("td", { "data-l": "Ortalama", text: dur(p.avg_ms) })); }))))),
          h("section", { class: "card vcard" }, h("h3", { text: "Üyeler — kim ne kadar vakit geçirdi" }), d.members.length ? h("div", { class: "tbl-w" }, h("table", { class: "t stackm" },
            h("thead", null, h("tr", null, ["Üye", "Oturum", "Toplam süre", "En çok vakit", "Son görülme", "Cihaz"].map(function (x) { return h("th", { text: x }); }))),
            h("tbody", null, d.members.map(function (m) { return h("tr", null, h("td", { "data-l": "Üye" }, h("b", { "data-notr": "", text: m.full_name }), h("small", { class: "sub", "data-notr": "", text: "@" + m.username }), m.coaching ? h("span", { class: "chip lime", text: "Koçluk üyesi" }) : null),
              h("td", { "data-l": "Oturum", "data-notr": "", text: String(m.sessions) }), h("td", { "data-l": "Toplam süre", text: dur(m.total_ms) }), h("td", { "data-l": "En çok vakit" }, h("code", { "data-notr": "", text: m.top_path || "—" })),
              h("td", { "data-l": "Son görülme", text: AVF.fmtDateTime(m.last_seen) }), h("td", { "data-l": "Cihaz", text: m.device === "mobile" ? "Mobil" : "Masaüstü" })); }))))
            : h("p", { class: "hint", text: "Bu dönemde giriş yapmış üye ölçümü yok." })),
          h("section", { class: "card vcard" }, h("h3", { text: "Son oturumlar — nasıl gezindi" }), h("ul", { class: "vsess" }, d.sessions.map(function (x) {
            return h("li", null, h("div", { class: "vs-h" }, h("b", { "data-notr": "", text: x.username ? "@" + x.username : "" }), x.username ? null : h("b", { text: "Misafir" }),
              h("small", { text: AVF.fmtDateTime(x.started) + " · " + (x.device === "mobile" ? "Mobil" : "Masaüstü") + " · " + (REF_TR[x.ref] || REF_TR.internal) + " · " + dur(x.total_ms) })),
              h("ol", { class: "vs-p" }, x.paths.map(function (pp, i) { return h("li", null, h("code", { "data-notr": "", text: pp }), h("small", { text: dur(x.durations[i]) })); })));
          }))));
      }, function (e) { err(body, e); });
    }
    load();
  }

  // ---------- yönetici: DENETİM KAYDI (arama, filtre, her kaydın ayrıntısı) ----------
  var ACTION_TR = { member_block: "Üye engellendi", member_ban: "Süreli yasak", member_unblock: "Engel kaldırıldı", member_perma_ban: "Kalıcı yasak (üye silindi)", member_forum_set: "Forum seviyesi / rolü",
    user_role_set: "Yetki değişikliği", member_access_set: "Plan bölümü erişimi", assignment_set: "Uzman ataması", assignment_remove: "Uzman ataması kaldırıldı", order_delivery_set: "Teslim durumu",
    ticket_reply: "Destek yanıtı", ticket_close: "Destek talebi çözüldü", profile_update: "Kişisel bilgi güncellendi", profile_delete: "Kişisel bilgi silindi", password_reset: "Şifre sıfırlandı", account_locked: "Hesap kilitlendi",
    forum_topic_create: "Forum: konu açıldı", forum_post_edit_mod: "Forum: mesaj düzenlendi (moderatör)", forum_post_hide: "Forum: mesaj kaldırıldı", forum_post_restore: "Forum: mesaj geri getirildi",
    forum_topic_pin: "Forum: konu sabitlendi", forum_topic_unpin: "Forum: sabitleme kaldırıldı", forum_topic_lock: "Forum: konu kilitlendi", forum_topic_unlock: "Forum: kilit açıldı", forum_topic_move: "Forum: konu taşındı",
    forum_topic_kind: "Forum: konu türü değişti", forum_topic_hide: "Forum: konu kaldırıldı", forum_topic_restore: "Forum: konu geri getirildi", forum_report_uphold: "Forum: şikâyet haklı bulundu", forum_report_dismiss: "Forum: şikâyet reddedildi",
    forum_ban: "Forum: üye uzaklaştırıldı", forum_unban: "Forum: uzaklaştırma kaldırıldı", forum_category_update: "Forum: kategori güncellendi",
    plan_create: "Plan oluşturuldu", plan_update: "Plan güncellendi", plan_publish: "Plan yayınlandı", plan_unpublish: "Plan yayından kaldırıldı", plan_archive: "Plan arşivlendi", plan_delete: "Plan silindi", order_paid: "Sipariş ödendi" };
  function auditView(c) {
    var list = h("div"), more = h("div", { style: "margin-top:12px" }), last = null, acts = [["", "Tümü"]];
    var bar = filterBar([
      { key: "q", type: "search", label: "Ara", icon: "list", placeholder: "Kişi, kullanıcı adı, hedef, IP veya ayrıntı" },
      { key: "action", type: "select", label: "İşlem", icon: "bolt", options: acts },
      { key: "from", type: "date", label: "Başlangıç", icon: "calendar" }, { key: "to", type: "date", label: "Bitiş", icon: "calendar" }], function () { load(false); });
    AVF.mount(c, h("h2", { class: "ptitle" }, AVF.icon("list"), " Denetim kaydı"), bar, list, more);
    api("GET", "/audit/actions").then(function (rows) {
      var sel2 = bar.querySelectorAll("select")[0];
      rows.forEach(function (r) { sel2.appendChild(h("option", { value: r.action, text: (ACTION_TR[r.action] || r.action) + " (" + r.n + ")" })); });
    }, function () {});
    function load(append) {
      var v = bar.values; if (!append) { AVF.mount(list, AVF.skeleton(3)); last = null; }
      var p = Object.keys(v).filter(function (k) { return v[k]; }).map(function (k) { return k + "=" + encodeURIComponent(v[k]); });
      if (append && last) p.push("before=" + encodeURIComponent(last));
      api("GET", "/audit" + (p.length ? "?" + p.join("&") : "")).then(function (rows) {
        if (!append) AVF.mount(list, rows.length ? h("div", { class: "stack" }) : AVF.state("list", "Kayıt yok", "Filtrelere uyan kayıt bulunamadı."));
        var box = list.firstChild; rows.forEach(function (r) { if (box && box.appendChild) box.appendChild(auditRow(r)); });
        last = rows.length ? rows[rows.length - 1].created_at : last;
        AVF.mount(more, rows.length === 100 ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { load(true); } }, AVF.icon("plus", "bico"), "Daha eski kayıtları yükle") : null);
      }, function (e) { err(list, e); });
    }
    function auditRow(r) {
      var d = r.details || {}, keys = Object.keys(d);
      return AVF.accordion({ icon: /member_|user_role/.test(r.action) ? "shield" : /ticket/.test(r.action) ? "headset" : /order/.test(r.action) ? "tag" : /plan/.test(r.action) ? "list" : "bolt",
        title: (ACTION_TR[r.action] || r.action), sub: AVF.fmtDateTime(r.created_at) + " · " + (r.actor_name ? r.actor_name + (r.actor_username ? " (@" + r.actor_username + ")" : "") : "Sistem") + (r.target_name ? " → " + r.target_name : ""),
        content: [h("div", { class: "kv" }, kv("clock", "Zaman", AVF.fmtFull ? AVF.fmtFull(r.created_at) : AVF.fmtDateTime(r.created_at)), kv("user", "İşlemi yapan", r.actor_name ? r.actor_name + (r.actor_username ? " (@" + r.actor_username + ")" : "") + (r.actor_role ? " · " + (ROLES[r.actor_role] || r.actor_role) : "") : "Sistem"),
          kv("bolt", "İşlem kodu", r.action), kv("tag", "Hedef türü", r.target_type), kv("id", "Hedef", r.target_name ? r.target_name + (r.target_username ? " (@" + r.target_username + ")" : "") : r.target_id), kv("globe", "IP adresi", r.ip_address)),
          keys.length ? h("div", { class: "card", style: "padding:12px;margin-top:10px;background:var(--paper)" }, h("b", { text: "Ayrıntılar" }), h("dl", { class: "adl" }, keys.map(function (k) {
            var val = d[k]; return [h("dt", { "data-notr": "", text: k }), h("dd", { "data-notr": "", text: typeof val === "object" ? JSON.stringify(val) : String(val) })];
          }))) : null] });
    }
    load(false);
  }
  // ---------- açılış ----------
  function boot() {
    shell();
    AVF.mount(view, h("div", { class: "wrap section" }, AVF.skeleton(3)));
    api("GET", "/me").then(function (r) { me = r; render(); }, function (e) {
      var d = e.data || {};
      AVF.mount(view, h("div", { class: "wrap section" }, d.requiresTotpSetup
        ? AVF.state("shield", "Google Authenticator kurulumu gerekli", "Uzman ve yönetici paneli için iki adımlı doğrulama zorunludur. Hesap ayarlarından etkinleştirip tekrar deneyin.", h("a", { class: "btn", href: "/panel/hesap" }, "Hesap ayarlarına git"))
        : AVF.state("lock", "Panele erişilemedi", AVF.errText(e), h("a", { class: "btn", href: "/" }, "Ana sayfa"))));
    });
  }
  AVF.onSessionEnd = function () { location.href = "/"; };
  boot();
})();
