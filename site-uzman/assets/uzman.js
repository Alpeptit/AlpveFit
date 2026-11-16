/* Alpvefit — Uzman / Yönetici paneli. Bu dosya yalnız oturumu açık uzman veya yöneticiye sunulur (sunucu denetler).
   Uzman: kendisine atanmış üyeler + yetkili olduğu plan türleri. Yönetici: tüm üyeler/türler + kullanıcı, erişim ve atama yönetimi.
   Plan içeriğini YALNIZ buradan insanlar girer; sistem hiçbir içerik üretmez veya önermez. Her yetki sunucuda ayrıca denetlenir. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var me = null, view, tab = "uyeler", sel = null;
  var KINDS = Object.keys(AVF.KIND);
  var STATUS = { draft: ["Taslak", "chip lime"], published: ["Yayında", "chip"], archived: ["Arşiv", "chip lime"] };

  function shell() {
    view = h("main");
    AVF.mount(document.getElementById("app"),
      h("header", { class: "top" }, h("div", { class: "wrap" }, h("a", { class: "logo", href: "/" }, h("i"), "ALPVEFIT"), h("div", { class: "nav" }, h("a", { href: "/panel" }, AVF.icon("user"), "Üye paneli")),
        h("div", { class: "tools" }, h("button", { class: "ibtn", type: "button", "aria-label": "Çıkış yap", onclick: function () { AVF.api("POST", "/account/logout", {}).then(null, function () {}).then(function () { location.href = "/"; }); } }, AVF.icon("out"))))), view,
      h("footer", { class: "foot" }, h("div", { class: "wrap" }, h("span", null, "© " + new Date().getFullYear() + " Alpvefit"), h("span", null, "Uzman paneli"))));
  }
  function api(m, p, b) { return AVF.api(m, "/admin" + p, b); }
  function err(box, e) { AVF.mount(box, h("div", { class: "note err", role: "alert", text: AVF.errText(e) })); }

  function frame(content) {
    var tabs = [["uyeler", "users", "Üyeler"]]; if (me.role === "admin") tabs.push(["kullanicilar", "cog", "Kullanıcılar"], ["denetim", "list", "Denetim kaydı"]);
    var menu = h("nav", { class: "card menu", "aria-label": "Uzman menüsü" }, tabs.map(function (t) {
      var b = h("a", { href: "#", onclick: function (e) { e.preventDefault(); tab = t[0]; sel = null; render(); } }, AVF.icon(t[1]), t[2]); if (t[0] === tab) b.setAttribute("aria-current", "page"); return b;
    }));
    AVF.mount(view, h("section", { class: "hero", style: "padding:56px 0 60px" }, h("div", { class: "wrap" }, h("div", { class: "eyebrow", text: "Çalışma alanı" }), h("h1", { text: me.role === "admin" ? "Yönetici Paneli" : "Uzman Paneli" }),
      h("p", { text: me.name + " · " + (me.role === "admin" ? "Tam yetki" : "Yetkili olduğunuz türler: " + (me.kinds.length ? me.kinds.map(function (k) { return AVF.KIND[k].label; }).join(", ") : "henüz tanımlı değil")) }))),
      h("div", { class: "wrap pbody" }, h("aside", { class: "side" }, menu), content));
  }

  function render() {
    var c = h("div");
    frame(c);
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
        var sub = [r.user_code, r.delivery ? AVF.DELIVERY[r.delivery] : null, "Erişim: " + (r.access.length ? r.access.map(function (k) { return AVF.KIND[k].label; }).join(", ") : "yok")].filter(Boolean).join(" · ");
        return h("button", { class: "card", type: "button", style: "display:flex;align-items:center;gap:14px;padding:16px 18px;text-align:left;width:100%", onclick: function () { sel = r; render(); } },
          h("span", { class: "tile" }, AVF.icon("user")), h("span", { style: "flex:1;min-width:0" }, h("b", { style: "display:block", text: r.full_name }), h("small", { style: "color:var(--muted)", text: sub })), AVF.icon("chev", "chev"));
      })));
    }, function (e) { AVF.mount(c, h("h2", { class: "ptitle", text: "Üyeler" }), AVF.state("alert", "Üyeler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: render }, "Tekrar dene"))); });
  }

  function memberView(c, m) {
    var head = h("div", { class: "row between", style: "margin-bottom:14px" }, h("div", null, h("h2", { class: "ptitle", style: "margin:0", text: m.full_name }), h("small", { style: "color:var(--muted)", text: m.user_code })),
      h("button", { class: "btn ghost sm", type: "button", onclick: function () { sel = null; render(); } }, "← Üyelere dön"));
    var adminBox = h("div"), list = h("div", { class: "stack" }, AVF.skeleton(2)), box = h("div");
    AVF.mount(c, head, adminBox, box, h("div", { class: "row between", style: "margin:18px 0 10px" }, h("h3", { text: "Planlar" }), newPlanBtn()), list);
    if (me.role === "admin") adminTools(adminBox, m);

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
    var coachSel = h("select", { class: "inp", id: "cs" }, h("option", { value: "", text: "Uzman seçin…" })), dsel = h("select", { class: "inp", id: "ds" }, Object.keys(AVF.DELIVERY).map(function (k) { return h("option", { value: k, text: AVF.DELIVERY[k] }); }));
    api("GET", "/users?role=coach").then(function (rows) { rows.forEach(function (r) { coachSel.appendChild(h("option", { value: r.id, text: r.full_name + " (" + r.user_code + ")" })); }); });
    var current = (m.coaches || []).map(function (c) { return c.coachName + " — " + AVF.DELIVERY[c.delivery]; }).join(" · ") || "Atanmış uzman yok";
    AVF.mount(box, h("div", { class: "card", style: "padding:18px;margin-bottom:14px" }, h("h3", { style: "margin-bottom:8px", text: "Yönetim" }),
      h("p", { class: "hint", text: "Üyenin panelinde hangi plan bölümlerinin görüneceğini siz belirlersiniz." }), h("div", null, chks), h("div", { class: "row", style: "margin:8px 0 16px" }, sb), eb,
      h("p", { class: "hint", text: "Uzman ataması: " + current }), h("div", { class: "row" }, h("div", { style: "flex:1;min-width:180px" }, coachSel), h("div", { style: "flex:1;min-width:180px" }, dsel),
        h("button", { class: "btn sm", type: "button", onclick: function () {
          if (!coachSel.value) return err(eb, { data: { error: "Önce bir uzman seçin." } });
          api("PUT", "/assignments", { coachId: coachSel.value, memberId: m.id, delivery: dsel.value }).then(function () { AVF.toast("Atama kaydedildi."); clientsRefresh(); }, function (e) { err(eb, e); });
        } }, "Ata"))));
    function clientsRefresh() { api("GET", "/clients").then(function (rows) { var r = rows.filter(function (x) { return x.id === m.id; })[0]; if (r) { sel = r; render(); } }); }
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
