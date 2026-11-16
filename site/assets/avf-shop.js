/* Alpvefit — paketler, sipariş/ödeme (sanal POS / kart), siparişlerim ve profil. Fiyatlar ve ödeme sonucu yalnız sunucudan gelir. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var cat = null;

  function money(n) { return Number(n).toLocaleString(AVF.lang === "en" ? "en-US" : "tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  AVF.money = money;
  function moneyC(n, cur) { try { return new Intl.NumberFormat(AVF.lang === "en" ? "en-US" : "tr-TR", { style: "currency", currency: cur || "TRY", maximumFractionDigits: 0 }).format(Number(n)); } catch (e) { return money(n) + " " + cur; } }
  AVF.moneyC = moneyC;
  function catalog() { return cat ? Promise.resolve(cat) : AVF.api("GET", "/packages").then(function (c) { cat = c; return c; }); }
  var PKG_COPY = {
    starter: { tag: "Temelden başlayanlar için", icon: "dumb", items: ["Kişiye özel beslenme programı", "Kişiye özel antrenman programı", "Vitamin / mineral / takviye planı"] },
    advanced: { tag: "Deneyimli sporcular için", icon: "flask", items: ["Kişiye özel beslenme programı", "Kişiye özel antrenman programı", "Vitamin / mineral / takviye planı", "Farmakoloji desteği (yetkili uzman tarafından, isteğe bağlı)"] },
    competitor: { tag: "Sahneye ve yarışmaya hazırlık", icon: "tag", items: ["Yarışma hazırlığına yönelik beslenme ve antrenman", "Vitamin / mineral / takviye planı", "Farmakoloji desteği (yetkili uzman tarafından, isteğe bağlı)"] },
  };
  var STATUS = { pending: ["Ödeme bekleniyor", "chip"], paid: ["Ödendi", "chip lime"], expired: ["Süresi doldu", "chip mute"], cancelled: ["İptal edildi", "chip mute"] };
  function statusChip(s) { var m = STATUS[s] || [s, "chip"]; return h("span", { class: m[1], text: m[0] }); }
  function weeksText(w) { return w + " hafta"; }

  // ---------- paketler sayfası ----------
  AVF.packagesPage = function (view) {
    document.title = "Paketler — Alpvefit";
    var box = h("div", { class: "wrap section" }, AVF.skeleton(3));
    AVF.mount(view,
      h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("div", { class: "eyebrow" }, "Uzaktan Eğitim Sistemi"), h("h1", {}, "Paketler"),
        h("p", {}, "Ödemeden sonra programlarınız 7 gün içinde uzmanlarımızca hazırlanır ve panelinizde yayınlanır."))), box);
    catalog().then(function (c) {
      var cards = c.packages.map(function (p) { return pkgCard(p, c); });
      cards.push(h("div", { class: "card pkg" }, h("span", { class: "tile teal" }, AVF.icon("pin")), h("h3", {}, "Yüz yüze eğitim paketi"), h("p", { class: "tagline" }, "Birebir, yüz yüze çalışma"),
        h("ul", { class: "ticks" }, h("li", {}, "Paket bilgisi ve fiyatı için bizimle iletişime geçin")),
        h("div", { class: "pkg-foot" }, h("a", { class: "btn ghost block", href: "mailto:" + c.inPersonContact + "?subject=" + encodeURIComponent("Yüz yüze eğitim paketi") }, AVF.icon("mail"), c.inPersonContact))));
      AVF.mount(box, h("div", { class: "grid4" }, cards),
        h("div", { class: "note", style: "margin-top:18px" }, "Ödeme: kredi / banka kartı ile sanal POS üzerinden alınır. Kart bilgileriniz Alpvefit sunucularında saklanmaz."),
        c.payment && c.payment.test ? h("div", { class: "note warn", style: "margin-top:10px" }, h("b", {}, "Test aşaması: "), "ödeme sistemi şu anda sahte (deneme) sanal POS ile çalışır; gerçek tahsilat yapılmaz.") : null,
        h("p", { class: "fine" }, "Programlar bilgilendirme ve eğitim amaçlıdır; tıbbi hizmet değildir. Farmakoloji içeriği isteğe bağlıdır ve hiçbir üyeye zorunlu kılınmaz. ",
          h("a", { href: "/yasal/sorumluluk-reddi", "data-link": "" }, "Sağlık ve Farmakoloji Sorumluluk Beyanı")));
    }, function (e) { AVF.mount(box, AVF.state("alert", "Paketler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.packagesPage(view); } }, "Tekrar dene"))); });
  };
  function pkgCard(p, c) {
    var copy = PKG_COPY[p.key] || { tag: "", icon: "list", items: [] }, sel = p.options[0];
    var price = h("div", { class: "price" }), listP = h("div", { class: "listp" }), buy = h("button", { class: "btn block", type: "button" }, "Satın al");
    var opts = h("div", { class: "seg", role: "radiogroup", "aria-label": "Süre seçin" });
    function paint() {
      AVF.mount(price, h("b", {}, moneyC(sel.price, cat && cat.currency)));
      AVF.mount(listP, weeksText(sel.weeks) + " · " + (p.pharmacology ? "farmakoloji dahil" : "farmakolojisiz"));
      Array.prototype.forEach.call(opts.children, function (b, i) { b.setAttribute("aria-checked", p.options[i] === sel ? "true" : "false"); });
    }
    p.options.forEach(function (o) { opts.appendChild(h("button", { type: "button", role: "radio", onclick: function () { sel = o; paint(); } }, weeksText(o.weeks))); });
    buy.addEventListener("click", function () { AVF.checkout(p, sel, c); });
    paint();
    return h("div", { class: "card pkg" }, h("span", { class: "tile" + (p.pharmacology ? " teal" : "") }, AVF.icon(copy.icon)), h("h3", { text: p.label }), h("p", { class: "tagline" }, copy.tag),
      h("div", { class: "chip " + (p.pharmacology ? "" : "lime") }, p.pharmacology ? "Farmakoloji desteği var" : "Farmakoloji desteği yok"),
      opts, price, listP,
      h("ul", { class: "ticks" }, copy.items.concat(["Planlar ödemeden sonra 7 gün içinde hazırlanır"]).map(function (t) { return h("li", {}, t); })),
      h("div", { class: "pkg-foot" }, buy));
  }

  // ---------- sipariş penceresi ----------
  AVF.checkout = function (p, opt, c) {
    if (!AVF.session.user) { AVF.toast("Satın almak için giriş yapın veya kayıt olun."); return AVF.auth.open("login"); }
    var ov, prev = document.activeElement;
    function close() { document.removeEventListener("keydown", key, true); if (ov && ov.parentNode) ov.parentNode.removeChild(ov); try { prev && prev.focus(); } catch (e) { /* yok say */ } }
    function key(e) { if (e.key === "Escape") close(); }
    var chk1 = h("input", { type: "checkbox", id: "ck1" }), chk2 = h("input", { type: "checkbox", id: "ck2" }), chk3 = h("input", { type: "checkbox", id: "ck3" });
    var payOn = !!(c && c.payment && c.payment.enabled);
    var err = h("div", { class: "note err", role: "alert", style: "display:none" }), go = h("button", { class: "btn block", type: "button", disabled: !payOn }, "Ödemeye geç");
    function lbl(input, parts) { return h("label", { class: "chk", for: input.id }, input, h("span", {}, parts)); }
    function lnk(slug, text) { return h("a", { href: "/yasal/" + slug, target: "_blank", rel: "noopener" }, text); }
    var dlg = h("div", { class: "dlg", role: "dialog", "aria-modal": "true", "aria-labelledby": "co-t" },
      h("button", { class: "x", type: "button", "aria-label": "Kapat", onclick: close }, AVF.icon("x")),
      h("h2", { id: "co-t" }, "Siparişi onayla"), h("p", { class: "sub" }, p.label + " · " + weeksText(opt.weeks)),
      h("div", { class: "sum" },
        h("div", { class: "tot" }, h("span", {}, "Ödenecek tutar"), h("b", {}, moneyC(opt.price, cat && cat.currency)))),
      h("div", { class: "pm" },
        payOn ? h("button", { type: "button", class: "on", "aria-pressed": "true" }, AVF.icon("card"), h("span", {}, h("b", {}, "Kredi / banka kartı"), h("small", {}, "Sanal POS ile güvenli ödeme")), AVF.icon("check"))
              : h("button", { type: "button", disabled: true, "aria-disabled": "true" }, AVF.icon("card"), h("span", {}, h("b", {}, "Kredi / banka kartı"), h("small", {}, "Şu anda aktif değildir")), h("em", {}, "Pasif"))),
      payOn && c.payment.test ? h("div", { class: "note warn", style: "margin:10px 0" }, h("b", {}, "Test aşaması: "), "ödeme sahte (deneme) sanal POS ile yapılır; gerçek tahsilat olmaz.") : null,
      lbl(chk1, ["", lnk("kullanim-kosullari", "Hizmet Şartları ve Mesafeli Satış Sözleşmesi"), "’ni okudum, kabul ediyorum. Hizmetin ödeme onayından hemen sonra ifasına başlanmasını talep ediyor ve cayma hakkının bulunmadığı konusunda bilgilendirildiğimi kabul ediyorum."]),
      p.pharmacology ? lbl(chk2, [lnk("sorumluluk-reddi", "Sağlık ve Farmakoloji Sorumluluk Beyanı"), "’nı okudum. Farmakoloji içeriğinin isteğe bağlı olduğunu, bana zorunlu kılınmadığını; kullanıp kullanmayacağıma kendi irademle karar vereceğimi ve sonuçlarının bana ait olduğunu kabul ediyorum."]) : null,
      lbl(chk3, [lnk("kvkk", "KVKK Aydınlatma Metni"), "’ni okudum."]), err, go);
    ov = h("div", { class: "ov", onmousedown: function (e) { if (e.target === ov) close(); } }, dlg);
    document.body.appendChild(ov); document.addEventListener("keydown", key, true); go.focus();
    go.addEventListener("click", function () {
      err.style.display = "none";
      if (!chk1.checked || (p.pharmacology && !chk2.checked) || !chk3.checked) { err.textContent = "Devam etmek için tüm onay kutularını işaretlemeniz gerekir."; err.style.display = ""; return; }
      AVF.busy(go, true, "Hazırlanıyor…");
      AVF.api("POST", "/orders", { packageKey: p.key, weeks: opt.weeks, consent: true }).then(function (r) { close(); AVF.go("/panel/siparis/" + r.order.id); },
        function (e) { AVF.busy(go, false); err.textContent = AVF.errText(e); err.style.display = ""; });
    });
  };

  // ---------- ödeme sayfası ----------
  var pollT = null;
  AVF.orderView = function (el, id) {
    clearTimeout(pollT);
    var offset = 0;
    function tick(box, o) {
      var left = Math.max(0, Math.floor((new Date(o.payment_expires_at).getTime() - (Date.now() + offset)) / 1000));
      var t = box.querySelector("[data-left]"); if (t) t.textContent = Math.floor(left / 3600) + ":" + String(Math.floor(left / 60) % 60).padStart(2, "0") + ":" + String(left % 60).padStart(2, "0");
    }
    function load(first) {
      if (first) AVF.mount(el, h("h2", { class: "ptitle", text: "Sipariş" }), AVF.skeleton(2));
      AVF.api("GET", "/orders/" + id).then(function (r) {
        offset = new Date(r.serverNow).getTime() - Date.now();
        if (!document.body.contains(el)) return;
        draw(r);
        if (r.order.status === "pending") pollT = setTimeout(function () { load(false); }, 15000);
      }, function (e) {
        if (e && e.status === 404) return AVF.mount(el, h("h2", { class: "ptitle", text: "Sipariş" }), AVF.state("alert", "Sipariş bulunamadı", "", h("a", { class: "btn", href: "/panel/siparisler", "data-link": "" }, "Siparişlerime dön")));
        if (first) AVF.mount(el, h("h2", { class: "ptitle", text: "Sipariş" }), AVF.state("alert", "Sipariş yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { load(true); } }, "Tekrar dene")));
      });
    }
    function draw(r) {
      var o = r.order, pay = r.payment, pk = (cat && cat.packages.filter(function (x) { return x.key === o.package_key; })[0]) || { label: o.package_key };
      var head = h("div", { class: "row between", style: "margin-bottom:14px;gap:10px;flex-wrap:wrap" }, h("h2", { class: "ptitle", style: "margin:0", text: o.order_number }), statusChip(o.status));
      var summary = h("div", { class: "card", style: "padding:18px;margin-bottom:14px" }, h("div", { class: "kv" },
        h("div", {}, h("span", {}, "Paket"), h("b", { text: pk.label })), h("div", {}, h("span", {}, "Süre"), h("b", { text: weeksText(o.weeks) })),
        h("div", {}, h("span", {}, "Tutar"), h("b", { text: moneyC(o.subtotal, o.currency) })),
        h("div", {}, h("span", {}, "Ödeme"), h("b", { text: "Kredi / banka kartı" }))));
      var body = [];
      if (o.status === "paid") {
        body.push(h("div", { class: "note" }, h("b", {}, "Ödemeniz onaylandı. "), "Planlarınız " + AVF.fmtDate(o.plans_due_at) + " tarihine kadar uzmanlarımızca hazırlanır; her plan yayınlandığında bildirim alırsınız."),
          h("a", { class: "btn", href: "/panel", "data-link": "" }, "Planlarıma git"));
      } else if (o.status === "expired" || o.status === "cancelled") {
        body.push(h("div", { class: "note warn" }, o.status === "expired" ? "Bu siparişin ödeme süresi doldu. Ödeme bilgileri artık geçerli değildir; bu adrese ödeme yapmayın." : "Bu sipariş iptal edildi. Ödeme bilgileri artık geçerli değildir."),
          h("a", { class: "btn", href: "/paketler", "data-link": "" }, "Paketlere dön"));
      } else if (pay && pay.test) {
        // SAHTE sanal POS (test): gerçek tahsilat yok, kart bilgisi istenmez. Sonucu sunucu işler; "ödendi" bilgisi istemciden gelmez.
        var perr = h("div", { class: "note err", role: "alert", style: "display:none" });
        function sim(outcome, btn) {
          perr.style.display = "none"; AVF.busy(btn, true, "İşleniyor…");
          AVF.api("POST", "/orders/" + o.id + "/pay/mock", { outcome: outcome }).then(function () { load(true); },
            function (e) { AVF.busy(btn, false); perr.textContent = AVF.errText(e); perr.style.display = ""; });
        }
        var okb = h("button", { class: "btn block", type: "button" }, "Başarılı test ödemesi yap"), nob = h("button", { class: "btn ghost block", type: "button" }, "Reddedilen test ödemesi yap");
        okb.addEventListener("click", function () { sim("success", okb); }); nob.addEventListener("click", function () { sim("decline", nob); });
        body.push(h("div", { class: "note warn" }, h("b", {}, "TEST ORTAMI — sahte sanal POS. "), "Gerçek kart bilgisi girmeyin; bu sayfada hiçbir tahsilat yapılmaz. Aşağıdaki düğmelerle ödemenin başarılı veya reddedilmiş olma durumunu deneyebilirsiniz."),
          h("div", { class: "card", style: "padding:20px" }, h("h3", { style: "margin-bottom:6px" }, "Kartla öde"),
            h("p", { class: "hint" }, "Ödenecek tutar: " + moneyC(o.subtotal, o.currency)), perr,
            h("div", { class: "stack", style: "margin-top:12px" }, okb, nob),
            h("div", { class: "left", style: "margin-top:14px" }, AVF.icon("clock"), h("span", {}, "Kalan süre: "), h("b", { "data-left": "" }, ""))),
          h("div", { style: "margin-top:14px" }, h("button", { class: "btn ghost sm", type: "button", onclick: function () {
            if (!confirm(AVF.t("Siparişi iptal etmek istiyor musunuz?"))) return;
            AVF.api("POST", "/orders/" + o.id + "/cancel", {}).then(function () { load(true); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
          } }, "Siparişi iptal et")));
      } else {
        body.push(h("div", { class: "note warn" }, "Ödeme altyapısı şu anda hazır değil. Lütfen daha sonra tekrar deneyin veya destek@alpvefit.com adresine yazın."));
      }
      AVF.mount(el, head, summary, body);
      if (o.status === "pending") { tick(el, o); var iv = setInterval(function () { if (!document.body.contains(el)) return clearInterval(iv); tick(el, o); }, 1000); }
    }
    catalog().then(function () { load(true); }, function () { load(true); });
  };

  // ---------- siparişlerim ----------
  AVF.ordersView = function (el) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Siparişlerim" }), AVF.skeleton(2));
    Promise.all([catalog().catch(function () { return null; }), AVF.api("GET", "/orders")]).then(function (res) {
      var rows = res[1], labels = {}; if (res[0]) res[0].packages.forEach(function (p) { labels[p.key] = p.label; });
      AVF.mount(el, h("div", { class: "row between", style: "margin-bottom:14px" }, h("h2", { class: "ptitle", style: "margin:0", text: "Siparişlerim" }), h("a", { class: "btn sm", href: "/paketler", "data-link": "" }, "Paketleri incele")));
      if (!rows.length) return el.appendChild(AVF.state("card", "Henüz siparişiniz yok", "Bir paket seçtiğinizde siparişleriniz burada görünür.", h("a", { class: "btn", href: "/paketler", "data-link": "" }, "Paketleri incele")));
      el.appendChild(h("div", { class: "stack" }, rows.map(function (o) {
        return h("a", { class: "card ordrow", href: "/panel/siparis/" + o.id, "data-link": "" }, h("span", { class: "tile" }, AVF.icon("card")),
          h("span", { class: "t" }, h("b", {}, (labels[o.package_key] || o.package_key) + " · " + weeksText(o.weeks)), h("small", {}, o.order_number + " · " + AVF.fmtDate(o.created_at) + " · " + moneyC(o.subtotal, o.currency))), statusChip(o.status), AVF.icon("chev", "chev"));
      })));
    }, function (e) { AVF.mount(el, h("h2", { class: "ptitle", text: "Siparişlerim" }), AVF.state("alert", "Siparişler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.ordersView(el); } }, "Tekrar dene"))); });
  };

  // Panel ana sayfasında paket durumu kartı
  AVF.packageStatusCard = function () {
    var box = h("div", {});
    Promise.all([catalog().catch(function () { return null; }), AVF.api("GET", "/orders")]).then(function (res) {
      var rows = res[1], labels = {}; if (res[0]) res[0].packages.forEach(function (p) { labels[p.key] = p.label; });
      var paid = rows.filter(function (o) { return o.status === "paid"; })[0], open = rows.filter(function (o) { return o.status === "pending"; })[0];
      if (open) AVF.mount(box, h("a", { class: "note", style: "display:block;text-decoration:none", href: "/panel/siparis/" + open.id, "data-link": "" }, h("b", {}, "Tamamlanmamış siparişiniz var: "), open.order_number + " — " + STATUS[open.status][0] + ". Görüntülemek için tıklayın."));
      if (paid) {
        var due = new Date(paid.plans_due_at), late = due.getTime() < Date.now();
        AVF.mount(box, box.firstChild, h("div", { class: "note" }, h("b", {}, "Aktif paketiniz: "), (labels[paid.package_key] || paid.package_key) + " · " + weeksText(paid.weeks) + ". ",
          late ? "Planlarınız hazırlandıkça burada yayınlanır; gecikme varsa destek@alpvefit.com adresine yazabilirsiniz." : "Planlarınız " + AVF.fmtDate(paid.plans_due_at) + " tarihine kadar hazırlanır."));
      }
    }, function () { /* sessiz */ });
    return box;
  };

  // ---------- profil ----------
  var BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];
  AVF.profileView = function (el) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Kişisel Bilgilerim" }), AVF.skeleton(2));
    AVF.api("GET", "/profile").then(function (pr) {
      var P = pr || {}, f = {};
      function num(id, label, val, attrs, hint) { f[id] = AVF.input("number", Object.assign({ value: val == null ? "" : val, inputmode: "decimal" }, attrs || {})); return AVF.field(label, f[id], { optional: true, hint: hint }); }
      f.blood = h("select", { class: "inp", id: "pf-blood" }, h("option", { value: "" }, "Seçiniz"), BLOOD.map(function (b) { return h("option", { value: b, selected: P.blood_type === b }, b); }));
      f.occupation = AVF.input("text", { value: P.occupation || "", maxlength: "80", autocomplete: "organization-title" });
      f.goal = h("textarea", { class: "inp", id: "pf-goal", maxlength: "500", rows: "3" }, P.goal || "");
      f.notes = h("textarea", { class: "inp", id: "pf-notes", maxlength: "1000", rows: "4" }, P.health_notes || "");
      var consent = h("input", { type: "checkbox", id: "pf-consent" }), msg = h("div", { class: "note err", role: "alert", style: "display:none" }), save = h("button", { class: "btn", type: "button" }, "Kaydet");
      var consented = !!P.health_consent_at;
      var form = h("div", { class: "card", style: "padding:20px" },
        h("div", { class: "note" }, "Bu bilgileri paylaşmak isteğe bağlıdır; size uygun program hazırlanmasına yardımcı olur. Yalnızca size atanan uzman(lar) ve yöneticiler görür. Dilediğiniz zaman silebilirsiniz."),
        h("div", { class: "fgrid" },
          num("height", "Boy (cm)", P.height_cm, { min: "100", max: "250", step: "1" }), num("weight", "Kilo (kg)", P.weight_kg, { min: "30", max: "300", step: "0.1" }),
          num("birth", "Doğum yılı", P.birth_year, { min: "1930", max: String(new Date().getFullYear() - 14), step: "1" }), num("steps", "Günlük ortalama adım sayısı", P.daily_steps, { min: "0", max: "100000", step: "100" }),
          num("days", "Haftalık antrenman günü", P.training_days, { min: "0", max: "7", step: "1" }),
          AVF.field("Kan grubu", f.blood, { optional: true }), AVF.field("Meslek", f.occupation, { optional: true })),
        AVF.field("Hedefiniz", f.goal, { optional: true }), AVF.field("Sağlık / sakatlık notları (varsa)", f.notes, { optional: true, hint: "Kronik hastalık, yaralanma, kullandığınız ilaçlar gibi uzmanın bilmesi gereken bilgiler." }),
        consented ? h("p", { class: "hint", text: "Açık rızanız " + AVF.fmtDate(P.health_consent_at) + " tarihinde alındı." }) :
          h("label", { class: "chk", for: "pf-consent" }, consent, h("span", {}, ["Sağlık ve koçluk bilgilerimin, program hazırlanması amacıyla atanan uzmanlar tarafından işlenmesine ", h("a", { href: "/yasal/kvkk", target: "_blank", rel: "noopener" }, "KVKK Aydınlatma Metni"), " kapsamında açık rıza veriyorum."])),
        msg, h("div", { class: "row", style: "gap:10px;flex-wrap:wrap;margin-top:6px" }, save, pr ? h("button", { class: "btn ghost", type: "button", onclick: function () {
          if (!confirm(AVF.t("Tüm kişisel bilgileriniz silinecek ve açık rızanız geri alınacak. Devam edilsin mi?"))) return;
          AVF.api("DELETE", "/profile").then(function () { AVF.toast("Bilgileriniz silindi."); AVF.profileView(el); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
        } }, "Bilgilerimi sil ve rızamı geri al") : null));
      AVF.mount(el, h("h2", { class: "ptitle", text: "Kişisel Bilgilerim" }), form);
      save.addEventListener("click", function () {
        msg.style.display = "none"; AVF.busy(save, true, "Kaydediliyor…");
        AVF.api("PUT", "/profile", { heightCm: f.height.value, weightKg: f.weight.value, birthYear: f.birth.value, dailySteps: f.steps.value, trainingDays: f.days.value, bloodType: f.blood.value,
          occupation: f.occupation.value, goal: f.goal.value, healthNotes: f.notes.value, healthConsent: consented || consent.checked }).then(function () { AVF.toast("Bilgileriniz kaydedildi."); AVF.profileView(el); },
          function (e) { AVF.busy(save, false); msg.textContent = AVF.errText(e); msg.style.display = ""; });
      });
    }, function (e) { AVF.mount(el, h("h2", { class: "ptitle", text: "Kişisel Bilgilerim" }), AVF.state("alert", "Bilgiler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.profileView(el); } }, "Tekrar dene"))); });
  };
})();
