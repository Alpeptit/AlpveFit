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
    var tabs = [["uyeler", "users", "Üyeler"]]; if (me.role === "admin") tabs.push(["siparisler", "tag", "Siparişler"], ["destek", "headset", "Destek Talepleri"], ["forum", "msg", "Forum"], ["denetim", "list", "Denetim Kaydı"]);
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
      h("button", { class: "btn ghost sm", type: "button", onclick: function () { sel = null; render(); } }, "← Üyelere dön"));
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
      var items = [["Boy (cm)", P.height_cm], ["Kilo (kg)", P.weight_kg], ["Kol çevresi (cm)", P.arm_cm], ["Omuz genişliği (cm)", P.shoulder_cm], ["Bel çevresi (cm)", P.waist_cm], ["Boyun çevresi (cm)", P.neck_cm], ["Günlük öğün", P.meals_per_day], ["Cinsiyet", P.gender === "female" ? "Kadın" : P.gender === "male" ? "Erkek" : ""], ["Doğum tarihi", P.birth_date ? P.birth_date.split("-").reverse().join(".") : P.birth_year], ["Çalışma saati", AVF.workText ? AVF.workText(P.work_hours, P.work_schedule, P.work_note) : P.work_hours], ["Günlük adım aralığı", String(P.steps_range || "").replace("-", "–")], ["Meslek", P.occupation], ["Günlük adım", P.daily_steps], ["Haftalık antrenman günü", P.training_days], ["Kan grubu", P.blood_type]].filter(function (x) { return x[1] !== null && x[1] !== undefined && x[1] !== ""; });
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
      { key: "state", type: "select", label: "Durum", icon: "shield", options: [["", "Tümü"], ["active", "Aktif"], ["blocked", "Engelli"], ["banned", "Süreli yasaklı"], ["locked", "Kilitli"]] },
      { key: "verified", type: "select", label: "Doğrulama", icon: "mail", options: [["", "Tümü"], ["yes", "Doğrulanmış"], ["no", "Doğrulanmamış"]] },
      { key: "totp", type: "select", label: "Google Auth", icon: "key", options: [["", "Tümü"], ["on", "Açık"], ["off", "Kapalı"]] },
      { key: "role", type: "select", label: "Yetki", icon: "cog", options: [["", "Tümü"], ["user", "Üye"], ["coach", "Uzman"], ["admin", "Yönetici"]] },
      { key: "sort", type: "select", label: "Sırala", icon: "list", options: [["new", "En yeni kayıt"], ["old", "En eski kayıt"], ["name", "Ada göre"], ["reports", "En çok şikâyet"]] }], load);
    AVF.mount(c, h("div", { class: "row between", style: "margin-bottom:12px" }, h("h2", { class: "ptitle", style: "margin:0" }, AVF.icon("users"), " Üyeler"), count), bar, list);
    if (!forumLevels) api("GET", "/forum/levels").then(function (l) { forumLevels = l; }, function () {});
    function load(v) {
      v = v || bar.values; AVF.mount(list, AVF.skeleton(3));
      var qs = Object.keys(v).filter(function (k) { return v[k]; }).map(function (k) { return k + "=" + encodeURIComponent(v[k]); }).join("&");
      api("GET", "/members" + (qs ? "?" + qs : "")).then(function (rows) {
        count.textContent = rows.length + " kayıt";
        if (!rows.length) return AVF.mount(list, AVF.state("users", "Sonuç yok", "Filtrelere uyan üye bulunamadı."));
        AVF.mount(list, h("div", { class: "card tbl-w" }, h("table", { class: "t stackm mtab" },
          h("thead", null, h("tr", null, ["Ad Soyad · Kullanıcı adı", "E-posta", "Kayıt", "Doğrulama · Google Auth", "Forum", "Durum", ""].map(function (x) { return h("th", { text: x }); }))),
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
        h("td", { "data-l": "Forum" }, h("span", { class: "lvl" }, AVF.icon("award"), h("span", { text: m.forumLevel.name })), m.forumLevel.manual ? h("small", { class: "sub", text: "elle verildi" }) : null,
          h("span", { class: "fstats" }, h("span", { title: "Şikâyet" }, AVF.icon("flag"), String(m.reports_received)), h("span", { title: "Beğeni" }, AVF.icon("like"), String(m.likes)), h("span", { title: "Beğenmeme" }, AVF.icon("dislike"), String(m.dislikes)))),
        h("td", { "data-l": "Durum" }, h("span", { class: st[1] }, AVF.icon(st[2]), st[0]), m.state === "banned" && m.locked_until ? h("small", { class: "sub", text: "Bitiş: " + AVF.fmtDateTime(m.locked_until) }) : null,
          m.state !== "active" ? h("button", { class: "btn ghost sm unban", type: "button", onclick: function (e) {
            // tek tıkla engel / yasak kaldırma (onay penceresiyle)
            var b = e.currentTarget;
            AVF.confirmDialog({ icon: "unlock", title: (m.state === "banned" ? "Süreli yasak" : m.state === "blocked" ? "Engel" : "Kilit") + " kaldırılsın mı?", text: "@" + m.username + " hesabına hemen yeniden giriş yapabilir. İşlem denetim kaydına yazılır.", confirm: "Evet, kaldır", cancel: "Vazgeç" }).then(function (y) {
              if (!y) return; AVF.busy(b, true, "Kaldırılıyor…");
              api("POST", "/members/" + m.id + "/unblock", {}).then(function () { AVF.toast(AVF.t("Engel / yasak kaldırıldı.")); load(); }, function (er) { AVF.busy(b, false); AVF.toast(AVF.errText(er)); });
            });
          } }, AVF.icon("unlock", "bico"), m.state === "banned" ? "Yasağı kaldır" : m.state === "blocked" ? "Engeli kaldır" : "Kilidi aç") : null),
        h("td", { class: "mact" }, m.role === "user" ? h("button", { class: "btn sm", type: "button", onclick: function (e) {
          var b = e.currentTarget; AVF.busy(b, true, "Açılıyor…");
          api("GET", "/clients?id=" + m.id).then(function (rows) { var r = rows.filter(function (x) { return x.id === m.id; })[0]; AVF.busy(b, false); if (r) { sel = r; render(); window.scrollTo(0, 0); } else AVF.toast("Üye bulunamadı."); }, function (er) { AVF.busy(b, false); AVF.toast(AVF.errText(er)); });
        } }, AVF.icon("notes", "bico"), "Planlar") : null, h("button", { class: "btn ghost sm", type: "button", "aria-expanded": "false", onclick: function (e) {
          var open = detail.hidden; detail.hidden = !open; e.currentTarget.setAttribute("aria-expanded", String(open));
          if (open) manage(detail.firstChild, m);
        } }, AVF.icon("cog", "bico"), "Yönet")));
      return [row, detail];
    }
    function manage(cell, m) {
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
      AVF.mount(cell, h("div", { class: "mman" }, eb, h("div", { class: "mgrid" }, roleSec, forumSec, fidSec, stateSec, permaSec)));
    }
    load();
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

  // ---------- yönetici: FORUM (forum açıldığında moderasyon araçları burada olacak) ----------
  function forumView(c) {
    AVF.mount(c, h("h2", { class: "ptitle" }, AVF.icon("msg"), " Forum"), AVF.skeleton(1));
    api("GET", "/forum/levels").then(function (L) {
      AVF.mount(c, h("h2", { class: "ptitle" }, AVF.icon("msg"), " Forum"),
        h("div", { class: "note" }, "Forum yönetimi (genel konular, kilitleme, şikâyetler, içerik düzenleme, kullanıcı engelleme) forum aşamasında bu sekmeye eklenecek. Üyelerin forum seviyesi ve moderatör ataması şimdiden Üyeler › Yönet bölümünden yapılabilir."),
        h("div", { class: "card", style: "padding:18px;margin-top:14px" }, h("h3", { style: "margin-bottom:6px" }, "Seviye kuralları"),
          h("p", { class: "hint", text: "Puan = konu × 5 + mesaj × 2 + alınan beğeni × 3 − alınan beğenmeme × 2 − haklı bulunan şikâyet × 25 (en düşük 0). Kullanıcılar arası mesajlaşma Pump Avcısı seviyesinde açılır. Moderatör ve Admin yalnız atamayla verilir." }),
          h("ol", { class: "lvl-list" }, L.map(function (l) { return h("li", null, h("span", { class: "tile" }, AVF.icon("award")), h("b", { text: l.name }), h("small", { text: l.min + "+ puan" })); }),
            h("li", null, h("span", { class: "tile" }, AVF.icon("shield")), h("b", { text: "Moderatör" }), h("small", { text: "atama ile" })),
            h("li", null, h("span", { class: "tile" }, AVF.icon("key")), h("b", { text: "Admin" }), h("small", { text: "atama ile" })))));
    }, function (e) { err(c, e); });
  }

  // ---------- yönetici: DENETİM KAYDI (arama, filtre, her kaydın ayrıntısı) ----------
  var ACTION_TR = { member_block: "Üye engellendi", member_ban: "Süreli yasak", member_unblock: "Engel kaldırıldı", member_perma_ban: "Kalıcı yasak (üye silindi)", member_forum_set: "Forum seviyesi / rolü",
    user_role_set: "Yetki değişikliği", member_access_set: "Plan bölümü erişimi", assignment_set: "Uzman ataması", assignment_remove: "Uzman ataması kaldırıldı", order_delivery_set: "Teslim durumu",
    ticket_reply: "Destek yanıtı", ticket_close: "Destek talebi çözüldü", profile_update: "Kişisel bilgi güncellendi", profile_delete: "Kişisel bilgi silindi", password_reset: "Şifre sıfırlandı", account_locked: "Hesap kilitlendi",
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
