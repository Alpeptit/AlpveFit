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
  var STATUS = { draft: ["Taslak", "chip lime"], published: ["Yayında", "chip"], archived: ["Arşiv", "chip lime"] };

  function langSwitch() {
    var wrap = h("div", { class: "lang", role: "group", "aria-label": "Dil seçimi", "data-notr": "", "data-on": AVF.lang }, h("span", { class: "lang-pill", "aria-hidden": "true" }));
    ["tr", "en"].forEach(function (l) { wrap.appendChild(h("button", { type: "button", lang: l, "aria-pressed": String(AVF.lang === l), onclick: function () { wrap.setAttribute("data-on", l); setTimeout(function () { AVF.setLang(l); }, 140); } }, l.toUpperCase())); });
    return wrap;
  }
  AVF.onLangChange = AVF.onLangChange || [];
  AVF.onLangChange.push(function () { if (me) { var keep = sel; shell(); sel = keep; render(); } });
  function shell() {
    view = h("main");
    AVF.mount(document.getElementById("app"),
      h("header", { class: "top" }, h("div", { class: "wrap" }, h("a", { class: "logolink", href: "/", "aria-label": "AlpveFit ana sayfa" }, AVF.logo(false)), h("div", { class: "nav" }, h("a", { href: "/panel" }, AVF.icon("user"), "Üye paneli")),
        h("div", { class: "tools" }, langSwitch(), h("button", { class: "ibtn", type: "button", "aria-label": "Çıkış yap", onclick: function () { AVF.api("POST", "/account/logout", {}).then(null, function () {}).then(function () { location.href = "/"; }); } }, AVF.icon("out"))))), view,
      h("footer", { class: "foot" }, h("div", { class: "wrap" }, h("span", null, "© " + new Date().getFullYear() + " AlpveFit"), h("span", null, "Uzman paneli"))));
  }
  function money(n) { return Number(n).toLocaleString(AVF.lang === "en" ? "en-US" : "tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function api(m, p, b) { return AVF.api(m, "/admin" + p, b); }
  function attList(list) {
    if (!list || !list.length) return null;
    return h("div", { class: "batt" }, list.map(function (a) {
      var img = a.mime === "image/png" || a.mime === "image/jpeg", url = "/api/admin/attachments/" + a.id;
      return h("a", { class: "batt-i" + (img ? " img" : ""), href: url, target: "_blank", rel: "noopener", title: a.filename }, img ? h("img", { src: url, alt: "", loading: "lazy" }) : [AVF.icon("file"), h("span", { "data-notr": "", text: a.filename })]);
    }));
  }
  function err(box, e) { AVF.mount(box, h("div", { class: "note err", role: "alert", text: AVF.errText(e) })); }

  function frame(content) {
    var tabs = [["uyeler", "users", "Üyeler"]]; if (me.role === "admin") tabs.push(["siparisler", "tag", "Siparişler"], ["destek", "headset", "Destek"], ["blog", "book", "Blog"], ["kullanicilar", "cog", "Kullanıcılar"], ["denetim", "list", "Denetim kaydı"]);
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
    if (tab === "blog") return blogView(c);
    if (tab === "destek") return supportView(c);
    if (tab === "kullanicilar") return usersView(c);
    if (tab === "denetim") return auditView(c);
    if (sel) return memberView(c, sel); return clientsView(c);
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

  // ---------- DESTEK TALEPLERİ (yalnız yönetici) ----------
  var supSel = null;
  function supportView(c) {
    var body = h("div"), summary = h("p", { class: "hint", style: "margin:-6px 0 14px" });
    AVF.mount(c, h("h2", { class: "ptitle", text: "Destek talepleri" }), summary, body);
    api("GET", "/support/summary").then(function (s) { summary.textContent = "Yanıt bekleyen talep: " + s.tickets; }, function () {});
    return ticketsPane(body);
  }
  function thread(msgs, mineRole) {
    return h("div", { class: "tthread" }, msgs.map(function (m) {
      var mine = m.sender ? m.sender === "admin" : m.from_role === "support";
      return h("div", { class: "msg" + (mine ? " mine" : " theirs") }, h("div", { class: "bub-w" }, h("div", { class: "bub", "data-notr": "", text: m.body }), attList(m.attachments), h("span", { class: "t", text: AVF.fmtDateTime(m.created_at) })));
    }));
  }
  function replyForm(onSend) {
    var ta = h("textarea", { class: "inp", rows: "3", maxlength: "1444", placeholder: "Yanıtınızı yazın…", "aria-label": "Yanıt" }), eb = h("div"), b = h("button", { class: "btn sm", type: "submit" }, "Gönder");
    return h("form", { novalidate: true, style: "margin-top:12px", onsubmit: function (e) { e.preventDefault(); if (!ta.value.trim()) return; AVF.busy(b, true); onSend(ta.value.trim()).then(null, function (er) { AVF.busy(b, false); err(eb, er); }); } }, ta, eb, h("div", { class: "row", style: "margin-top:8px" }, b));
  }
  function ticketsPane(box) {
    if (supSel && supSel.ticket_number) {
      var t0 = supSel, tb = h("div", { class: "card", style: "padding:16px" }, AVF.skeleton(2));
      AVF.mount(box, h("button", { class: "btn ghost sm", type: "button", style: "margin-bottom:12px", onclick: function () { supSel = null; ticketsPane(box); } }, "← Taleplere dön"), tb);
      var load = function () {
        api("GET", "/tickets/" + t0.id).then(function (t) {
          AVF.mount(tb, h("div", { class: "row between" }, h("b", { "data-notr": "", text: t.ticket_number + " · " + t.title }), h("span", { class: "chip", text: t.subject })),
            h("p", { class: "hint", "data-notr": "", text: t.full_name + " · " + t.email + " · " + t.user_code }), thread(t.messages),
            t.status !== "closed" ? [replyForm(function (v) { return api("POST", "/tickets/" + t.id + "/reply", { message: v }).then(load); }),
              h("button", { class: "btn ghost sm danger-t", type: "button", style: "margin-top:10px", onclick: function () { if (!confirm("Destek talebi kapatılsın mı?")) return; api("PATCH", "/tickets/" + t.id + "/close", { confirmed: true }).then(load, function (e) { AVF.toast(AVF.errText(e), "err"); }); } }, "Talebi kapat")]
              : h("div", { class: "note", style: "margin-top:12px" }, "Bu destek talebi kapatıldı."));
        }, function (e) { err(tb, e); });
      };
      return load();
    }
    var list = h("div", { class: "stack" }, AVF.skeleton(2)); AVF.mount(box, list);
    var ST = { open: "Yanıt bekliyor", answered: "Yanıtlandı", closed: "Kapatıldı" };
    api("GET", "/tickets").then(function (rows) {
      if (!rows.length) return AVF.mount(list, AVF.state("list", "Destek talebi yok", "Üyeler panellerinden destek talebi oluşturduğunda burada görünür."));
      AVF.mount(list, rows.map(function (t) {
        return h("button", { class: "card ordrow", type: "button", style: "width:100%;text-align:left;border:1px solid var(--line)", onclick: function () { supSel = t; ticketsPane(box); } },
          h("span", { class: "tile" }, AVF.icon("list")), h("span", { class: "t" }, h("b", { "data-notr": "", text: t.ticket_number + " · " + t.title }), h("small", { "data-notr": "", text: t.full_name + " · " + t.subject + " · " + AVF.fmtDateTime(t.updated_at) })),
          h("span", { class: "chip" + (t.status === "open" ? " dk" : ""), text: ST[t.status] }), AVF.icon("chev", "chev"));
      }));
    }, function (e) { err(list, e); });
  }
  function memberView(c, m) {
    var head = h("div", { class: "row between", style: "margin-bottom:14px" }, h("div", null, h("h2", { class: "ptitle", style: "margin:0", text: m.full_name }), h("small", { style: "color:var(--muted)", text: m.user_code })),
      h("button", { class: "btn ghost sm", type: "button", onclick: function () { sel = null; render(); } }, "← Üyelere dön"));
    var infoBox = h("div"), adminBox = h("div"), list = h("div", { class: "stack" }, AVF.skeleton(2)), box = h("div");
    AVF.mount(c, head, infoBox, adminBox, box, h("div", { class: "row between", style: "margin:18px 0 10px" }, h("h3", { text: "Planlar" }), newPlanBtn()), list);
    if (me.role === "admin") adminTools(adminBox, m);
    memberInfo(infoBox, m);

    function newPlanBtn() {
      var avail = KINDS.filter(function (k) { return me.role === "admin" || me.kinds.indexOf(k) >= 0; });
      return h("button", { class: "btn sm", type: "button", onclick: function () { editor(null, avail); } }, AVF.icon("plus"), "Yeni plan");
    }
    function load() {
      api("GET", "/clients/" + m.id + "/plans").then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state("list", "Bu üye için plan yok", "“Yeni plan” ile bir plan hazırlayabilirsiniz."));
        AVF.mount(list, rows.map(function (p) {
          var st = STATUS[p.status];
          return AVF.accordion({ icon: AVF.KIND[p.kind].icon, title: p.title, sub: AVF.KIND[p.kind].label + " · " + st[0] + " · Hazırlayan: " + p.author_name, content: [
            h("div", { class: "meta" }, h("span", { class: st[1], text: st[0] }), h("span", null, "Oluşturma: " + AVF.fmtDateTime(p.created_at)), h("span", null, "Güncelleme: " + AVF.fmtDateTime(p.updated_at)), p.published_at ? h("span", null, "Yayın: " + AVF.fmtDateTime(p.published_at) + " (" + (p.published_by_name || "—") + ")") : null),
            h("div", { class: "plan-body", text: p.body || "(içerik yok)" }),
            h("div", { class: "row", style: "margin-top:14px" },
              p.status !== "archived" ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { editor(p, [p.kind]); } }, "Düzenle") : null,
              p.status === "draft" ? h("button", { class: "btn sm", type: "button", onclick: function () { act(p, "publish", "Plan üyenin panelinde yayınlanacak ve üyeye bildirim gidecek. Onaylıyor musunuz?"); } }, "Yayınla") : null,
              p.status === "published" ? h("button", { class: "btn ghost sm", type: "button", onclick: function () { act(p, "unpublish", "Plan üyenin panelinden hemen kalkacak ve taslağa dönecek. Onaylıyor musunuz?"); } }, "Yayından kaldır") : null,
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
      var kind = h("select", { class: "inp", id: "k" + Date.now(), disabled: !!p }, avail.map(function (k) { return h("option", { value: k, text: AVF.KIND[k].label, selected: p && p.kind === k }); }));
      var title = AVF.input("text", { maxlength: "140", value: p ? p.title : "", placeholder: "Plan başlığı" });
      var s = AVF.input("date", { value: p && p.starts_on ? String(p.starts_on).slice(0, 10) : "" }), e2 = AVF.input("date", { value: p && p.ends_on ? String(p.ends_on).slice(0, 10) : "" });
      var body = h("textarea", { class: "inp", id: "b" + Date.now(), maxlength: "20000", placeholder: "Plan içeriği (siz yazarsınız; sistem içerik üretmez)" }); body.value = p ? p.body : "";
      var ebox = h("div"), btn = h("button", { class: "btn", type: "submit" }, "Taslağı kaydet");
      AVF.mount(box, h("form", { class: "card", style: "padding:20px;margin-bottom:14px", novalidate: true, onsubmit: function (ev) {
        ev.preventDefault(); AVF.mount(ebox, null);
        if (!title.value.trim()) return err(ebox, { data: { error: "Plan başlığı gerekli." } });
        AVF.busy(btn, true, "Kaydediliyor…");
        var pl = { title: title.value.trim(), body: body.value, startsOn: s.value || null, endsOn: e2.value || null };
        var rq = p ? api("PATCH", "/plans/" + p.id, pl) : api("POST", "/plans", Object.assign({ memberId: m.id, kind: kind.value }, pl));
        rq.then(function () { AVF.mount(box, null); AVF.toast("Kaydedildi."); load(); }, function (er) { AVF.busy(btn, false); err(ebox, er); });
      } }, h("h3", { style: "margin-bottom:12px", text: p ? "Planı düzenle" : "Yeni plan" }),
        AVF.field("Tür", kind, { optional: true }), AVF.field("Başlık", title, { optional: true }),
        h("div", { class: "row" }, h("div", { style: "flex:1;min-width:150px" }, AVF.field("Başlangıç", s, { optional: true })), h("div", { style: "flex:1;min-width:150px" }, AVF.field("Bitiş", e2, { optional: true }))),
        AVF.field("İçerik", body, { optional: true }), ebox, h("div", { class: "row" }, btn, h("button", { class: "btn ghost", type: "button", onclick: function () { AVF.mount(box, null); } }, "Vazgeç"))));
      title.focus();
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
    var coachSel = h("select", { class: "inp", id: "cs" }, h("option", { value: "", text: "Uzman seçin…" }));
    api("GET", "/users?role=coach").then(function (rows) { rows.forEach(function (r) { coachSel.appendChild(h("option", { value: r.id, text: r.full_name + " (" + r.user_code + ")" })); }); });
    var current = (m.coaches || []).map(function (c) { return c.coachName; }).join(" · ") || "Atanmış uzman yok";
    AVF.mount(box, h("div", { class: "card", style: "padding:18px;margin-bottom:14px" }, h("h3", { style: "margin-bottom:8px", text: "Yönetim" }),
      h("p", { class: "hint", text: "Üyenin panelinde hangi plan bölümlerinin görüneceğini siz belirlersiniz." }), h("div", null, chks), h("div", { class: "row", style: "margin:8px 0 16px" }, sb), eb,
      h("p", { class: "hint", text: "Uzman ataması: " + current }), h("div", { class: "row" }, h("div", { style: "flex:1;min-width:180px" }, coachSel),
        h("button", { class: "btn sm", type: "button", onclick: function () {
          if (!coachSel.value) return err(eb, { data: { error: "Önce bir uzman seçin." } });
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
      var items = [["Boy (cm)", P.height_cm], ["Kilo (kg)", P.weight_kg], ["Cinsiyet", P.gender === "female" ? "Kadın" : P.gender === "male" ? "Erkek" : ""], ["Doğum tarihi", P.birth_date ? P.birth_date.split("-").reverse().join(".") : P.birth_year], ["Çalışma saati", AVF.workText ? AVF.workText(P.work_hours) : P.work_hours], ["Günlük adım aralığı", String(P.steps_range || "").replace("-", "–")], ["Meslek", P.occupation], ["Günlük adım", P.daily_steps], ["Haftalık antrenman günü", P.training_days], ["Kan grubu", P.blood_type]].filter(function (x) { return x[1] !== null && x[1] !== undefined && x[1] !== ""; });
      AVF.mount(slot, h("ul", { class: "ticks" }, items.map(function (x) { return h("li", null, h("b", { text: x[0] + ": " }), h("span", { "data-notr": "", text: String(x[1]) })); })),
        P.goal ? h("p", null, h("b", { text: "Hedef: " }), h("span", { "data-notr": "", text: P.goal })) : null,
        P.health_notes ? h("p", null, h("b", { text: "Sağlık / sakatlık notları: " }), h("span", { "data-notr": "", text: P.health_notes })) : null,
        h("div", { class: "pfiles" }),
        h("p", { class: "hint", text: "Bu bilgiler üyenin açık rızasıyla paylaşılmıştır; yalnızca program hazırlama amacıyla kullanın." }));
      var fs = slot.querySelector(".pfiles");
      api("GET", "/clients/" + m.id + "/files").then(function (list) {
        if (list.length) AVF.mount(fs, h("p", null, h("b", { text: "Sağlık / sakatlık dosyaları:" })), AVF.fileBox({ files: list, readOnly: true, max: 4, base: "/api/admin/attachments/" }));
      }, function () { /* sessiz */ });
    }, function () { AVF.mount(slot, h("p", { class: "hint", text: "Kişisel bilgiler yüklenemedi." })); });
  }

  // ---------- yönetici: blog ----------
  function slugify(t) { return String(t).toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80); }
  var BLOG_CATS = [["beslenme", "Beslenme"], ["antrenman", "Antrenman"], ["farmakoloji", "Farmakoloji"]];
  var BLOG_COVERS = ["karbonhidrat", "yag", "protein", "supplement", "vitamin", "mineral", "hipertrofi", "atrofi", "iki-set", "ppl", "upper-lower", "split", "steroid", "peptit", "sarm", "pct"];
  function blogView(c) {
    var list = h("div", { class: "stack" });
    function load() {
      AVF.mount(list, AVF.skeleton(2));
      api("GET", "/blog").then(function (rows) { AVF.mount(list, rows.length ? rows.map(postRow) : AVF.state("book", "Henüz yazı yok", "")); }, function (e) { err(list, e); });
    }
    function form(p, done) {
      var t = AVF.input("text", { maxlength: "160", value: p ? p.title : "" }), sl = AVF.input("text", { maxlength: "80", value: p ? p.slug : "", placeholder: "ornek-yazi-adresi" });
      var ex = h("textarea", { class: "inp", maxlength: "300", rows: "2", id: "bx" + Math.random().toString(36).slice(2, 7) }); ex.value = p ? p.excerpt : "";
      var bd = h("textarea", { class: "inp", maxlength: "40000", rows: "14", id: "bb" + Math.random().toString(36).slice(2, 7) }); bd.value = p ? p.body : "";
      var st = h("select", { class: "inp", id: "bs" + Math.random().toString(36).slice(2, 7) }, h("option", { value: "draft", text: "Taslak" }), h("option", { value: "published", text: "Yayında" })); st.value = p ? p.status : "draft";
      var cat = h("select", { class: "inp", id: "bc" + Math.random().toString(36).slice(2, 7) }, BLOG_CATS.map(function (c) { return h("option", { value: c[0], text: c[1] }); })); cat.value = p ? p.category : "beslenme";
      var cov = h("select", { class: "inp", id: "bv" + Math.random().toString(36).slice(2, 7) }, h("option", { value: "", text: "Kapak yok (yalnız renk)" }), BLOG_COVERS.map(function (c) { return h("option", { value: c, text: c }); })); cov.value = p ? p.cover : "";
      var msg = h("div", { "aria-live": "polite" });
      if (!p) t.addEventListener("input", function () { if (!sl.dataset.touched) sl.value = slugify(t.value); });
      sl.addEventListener("input", function () { sl.dataset.touched = "1"; });
      var save = h("button", { class: "btn", type: "button", onclick: function () {
        var body = { title: t.value, slug: sl.value, excerpt: ex.value, body: bd.value, status: st.value, category: cat.value, cover: cov.value };
        AVF.busy(save, true, "Kaydediliyor…");
        api(p ? "PUT" : "POST", p ? "/blog/" + p.id : "/blog", body).then(function () { AVF.toast("Yazı kaydedildi."); done(); }, function (e) { AVF.busy(save, false, ""); err(msg, e); });
      } }, "Kaydet");
      var del = p ? h("button", { class: "btn ghost danger-t", type: "button", onclick: function () {
        if (!del.dataset.sure) { del.dataset.sure = "1"; del.lastChild.textContent = "Silmek için tekrar tıklayın"; return; }
        api("DELETE", "/blog/" + p.id).then(function () { AVF.toast("Yazı silindi."); done(); }, function (e) { err(msg, e); });
      } }, "Sil") : null;
      return h("div", {}, AVF.field("Başlık", t), AVF.field("Adres (slug)", sl), AVF.field("Özet", ex, { optional: true }), AVF.field("Kategori", cat), AVF.field("Kapak çizimi", cov), AVF.field("İçerik (paragraflar arasında boş satır; ## alt başlık, ### ara başlık, - madde, **kalın**, [1] atıf, !uyari|… ve !bilgi|… kutuları; ## Kaynaklar altında [1] … PMID: 12345678)", bd), AVF.field("Durum", st), msg, h("div", { class: "row" }, save, del));
    }
    function postRow(p) {
      return AVF.accordion({ icon: "book", title: p.title, sub: (p.status === "published" ? "Yayında" : "Taslak") + " · " + (({ beslenme: "Beslenme", antrenman: "Antrenman", farmakoloji: "Farmakoloji" })[p.category] || "") + " · /blog/" + p.slug, content: form(p, load) });
    }
    var addBox = h("div", { class: "card", style: "padding:20px;display:none" });
    var add = h("button", { class: "btn", type: "button", onclick: function () {
      addBox.style.display = addBox.style.display === "none" ? "block" : "none";
      AVF.mount(addBox, h("h3", { style: "margin-bottom:14px" }, "Yeni yazı"), form(null, function () { addBox.style.display = "none"; load(); }));
    } }, "Yeni yazı ekle");
    AVF.mount(c, h("div", { class: "row between", style: "margin-bottom:14px" }, h("h2", { class: "ptitle", style: "margin:0", text: "Blog" }), add), addBox, list);
    load();
  }

  // ---------- yönetici: siparişler ----------
  function ordersView(c) {
    var list = h("div", { class: "stack" });
    AVF.mount(c, h("h2", { class: "ptitle", text: "Siparişler" }), list);
    function load() {
      AVF.mount(list, AVF.skeleton(3));
      api("GET", "/orders").then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state("tag", "Henüz sipariş yok", ""));
        AVF.mount(list, rows.map(orderRow));
      }, function (e) { AVF.mount(list, AVF.state("alert", "Yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: load }, "Tekrar dene"))); });
    }
    function orderRow(o) {
      var eb = h("div"), reason = AVF.input("text", { maxlength: "300", placeholder: "Gerekçe (en az 10 karakter)" }), tx = AVF.input("text", { maxlength: "80", placeholder: "Ödeme referansı (isteğe bağlı)" });
      var canApprove = o.status !== "paid" && o.status !== "cancelled";
      return AVF.accordion({ icon: "tag", title: o.order_number + " · " + (OSTATUS[o.status] || o.status), sub: [o.buyer_name, pkgText(o), (AVF.moneyC ? AVF.moneyC(o.subtotal, o.currency) : money(o.subtotal) + " " + o.currency)].join(" · "), content: [
        h("div", { class: "meta" }, h("span", null, "Alıcı: " + o.buyer_email), h("span", null, "Oluşturma: " + AVF.fmtDateTime(o.created_at)), o.paid_at ? h("span", null, "Ödeme: " + AVF.fmtDateTime(o.paid_at)) : null,
          o.plans_due_at ? h("span", null, "Plan teslim: " + AVF.fmtDate(o.plans_due_at)) : null, o.status === "paid" ? h("span", null, "Yayınlanan plan: " + o.plans_published) : null, o.payment_provider ? h("span", null, "Ödeme: " + (o.payment_provider === "mock" ? "sahte POS (test)" : "sanal POS")) : null),
        o.payment_ref ? h("p", { class: "hint", "data-notr": "", text: "Ref: " + o.payment_ref }) : null,
        canApprove ? h("div", null, h("p", { class: "hint", text: "Normalde ödeme sanal POS tarafından otomatik onaylanır. Elle onay yalnız doğrulanmış ödemeler (ör. havale) için kullanılmalıdır; gerekçe denetim kaydına yazılır." }), AVF.field("Gerekçe", reason, { optional: true }), AVF.field("Ödeme referansı", tx, { optional: true }), eb,
          h("button", { class: "btn sm", type: "button", onclick: function () {
            if (!window.confirm("Bu sipariş ödenmiş olarak işaretlenecek ve üyeye erişim açılacak. Onaylıyor musunuz?")) return;
            api("POST", "/orders/" + o.id + "/approve", { reason: reason.value, paymentRef: tx.value.trim() || undefined }).then(function () { AVF.toast("Sipariş onaylandı."); load(); }, function (e) { err(eb, e); });
          } }, "Elle onayla")) : null] });
    }
    load();
  }

  // ---------- yönetici: kullanıcılar ----------
  function usersView(c) {
    var q = AVF.input("search", { placeholder: "Ad, e-posta, kullanıcı adı veya kod ara", maxlength: "80", "aria-label": "Ara" }), list = h("div", { class: "stack" });
    AVF.mount(c, h("h2", { class: "ptitle", text: "Kullanıcılar" }), h("form", { onsubmit: function (e) { e.preventDefault(); load(); }, style: "margin-bottom:14px" }, q), list);
    function load() {
      AVF.mount(list, AVF.skeleton(3));
      api("GET", "/users?q=" + encodeURIComponent(q.value.trim())).then(function (rows) {
        if (!rows.length) return AVF.mount(list, AVF.state("users", "Sonuç yok", ""));
        AVF.mount(list, rows.map(function (u) { return userRow(u); }));
      }, function (e) { AVF.mount(list, AVF.state("alert", "Yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: load }, "Tekrar dene"))); });
    }
    function userRow(u) {
      var role = h("select", { class: "inp", id: "r" + u.id }, [["user", "Üye"], ["coach", "Uzman"], ["admin", "Yönetici"]].map(function (o) { return h("option", { value: o[0], text: o[1], selected: u.role === o[0] }); }));
      var chks = KINDS.map(function (k) { return h("label", { class: "check", style: "margin:2px 0" }, h("input", { type: "checkbox", checked: (u.plan_kinds || []).indexOf(k) >= 0, "data-k": k }), AVF.KIND[k].label); });
      var kbox = h("div", { style: u.role === "coach" ? "" : "display:none" }, h("p", { class: "hint", text: "Uzmanın plan hazırlayabileceği türler:" }), chks), eb = h("div");
      role.addEventListener("change", function () { kbox.style.display = role.value === "coach" ? "" : "none"; });
      return AVF.accordion({ icon: "user", title: u.full_name, sub: [u.user_code, u.email, u.verified ? "" : "e-posta doğrulanmamış", (u.role === "coach" || u.role === "admin") && !u.totp_enabled ? "Authenticator kapalı" : ""].filter(Boolean).join(" · "), content: [
        AVF.field("Rol", role, { optional: true, hint: "Rol değişince kullanıcının tüm oturumları kapanır. Uzman ve yönetici hesaplarında Authenticator zorunludur." }), kbox, eb,
        h("button", { class: "btn sm", type: "button", onclick: function () {
          var kinds = chks.map(function (l) { return l.firstChild; }).filter(function (i) { return i.checked; }).map(function (i) { return i.getAttribute("data-k"); });
          if (!window.confirm("Bu kullanıcının rolü değiştirilecek. Onaylıyor musunuz?")) return;
          api("PUT", "/users/" + u.id + "/role", { role: role.value, planKinds: kinds }).then(function () { AVF.toast("Rol güncellendi."); load(); }, function (e) { err(eb, e); });
        } }, "Rolü kaydet")] });
    }
    load();
  }

  function auditView(c) {
    AVF.mount(c, h("h2", { class: "ptitle", text: "Denetim kaydı" }), AVF.skeleton(3));
    api("GET", "/audit").then(function (rows) {
      AVF.mount(c, h("h2", { class: "ptitle", text: "Denetim kaydı" }), h("div", { class: "card", style: "padding:6px 12px;overflow:auto" }, h("table", { class: "t stackm" }, h("thead", null, h("tr", null, h("th", { text: "Tarih" }), h("th", { text: "Kim" }), h("th", { text: "İşlem" }), h("th", { text: "Hedef" }))),
        h("tbody", null, rows.map(function (r) { return h("tr", null, h("td", { text: AVF.fmtDateTime(r.created_at) }), h("td", { text: r.actor_name || "—" }), h("td", { text: r.action }), h("td", { text: (r.target_type || "") + " " + String(r.target_id || "").slice(0, 8) })); })))));
    }, function (e) { AVF.mount(c, AVF.state("alert", "Yüklenemedi", AVF.errText(e))); });
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
