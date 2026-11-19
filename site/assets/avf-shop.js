/* AlpveFit — paketler, sipariş/ödeme (sanal POS / kart), siparişlerim ve profil. Fiyatlar ve ödeme sonucu yalnız sunucudan gelir. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var cat = null;

  function money(n) { return Number(n).toLocaleString(AVF.lang === "en" ? "en-US" : "tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  AVF.money = money;
  function moneyC(n, cur) { try { return new Intl.NumberFormat(AVF.lang === "en" ? "en-US" : "tr-TR", { style: "currency", currency: cur || "TRY", maximumFractionDigits: 0 }).format(Number(n)); } catch (e) { return money(n) + " " + cur; } }
  AVF.moneyC = moneyC;
  function catalog() { return cat ? Promise.resolve(cat) : AVF.api("GET", "/packages").then(function (c) { cat = c; return c; }); }
  // Paket kartları: üç pakette de AYNI kategoriler ve AYNI satırlar aynı sırada yer alır (simetrik karşılaştırma).
  var PKG_COPY = {
    starter: { tag: "Temelden başlayanlar için", level: "Başlangıç", icon: "dumb" },
    advanced: { tag: "Deneyimli sporcular için", level: "İleri Seviye", icon: "flask" },
    competitor: { tag: "Sahneye ve yarışmaya hazırlık", level: "Yarışma Hazırlığı", icon: "award" },
  };
  var PKG_CATS = [
    ["list", "Program", [["Kişiye özel beslenme programı", function () { return true; }], ["Kişiye özel antrenman programı", function () { return true; }], ["Vitamin / mineral / takviye planı", function () { return true; }]]],
    ["users", "Uzman desteği", [["Kan tahlili kontrolü", function (p) { return p.key === "advanced" || p.key === "competitor"; }], ["Farmakoloji desteği (isteğe bağlı)", function (p) { return !!p.pharmacology; }], ["Yarışma ve sahne hazırlığı", function (p) { return p.key === "competitor"; }]]],
    ["shield", "Teslim ve gizlilik", [["Ödemeden sonra 24 saat içinde teslim", function () { return true; }], ["Planlar yalnızca sizin panelinizde", function () { return true; }]]],
  ];
  var STATUS = { pending: ["Ödeme bekleniyor", "chip"], paid: ["Ödendi", "chip lime"], expired: ["Süresi doldu", "chip mute"], cancelled: ["İptal edildi", "chip mute"] };
  function statusChip(s) { var m = STATUS[s] || [s, "chip"]; return h("span", { class: m[1], text: m[0] }); }
  function weeksText(w) { return w + " hafta"; }

  // ---------- paketler sayfası ----------
  AVF.pkgGrid = function (opts) {
    var box = h("div", { class: "pkggrid" + (opts && opts.compact ? " compact" : "") }, AVF.skeleton(3));
    catalog().then(function (c) { AVF.mount(box, c.packages.map(function (p) { return pkgCard(p, c); })); },
      function (e) { AVF.mount(box, AVF.state("alert", "Paketler yüklenemedi", AVF.errText(e))); });
    return box;
  };
  AVF.packagesPage = function (view) {
    document.title = "Paketler — AlpveFit";
    var box = h("div", { class: "wrap section" }, AVF.skeleton(3));
    AVF.mount(view,
      h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("span", { class: "eyebrow" }, AVF.icon("layers"), "Uzaktan Eğitim Sistemi"), h("h1", {}, "Paketler"),
        h("p", {}, "Ödemeden sonra programlarınız 24 saat içinde tarafımızca hazırlanır ve kullanıcı panelinizde yayınlanır."))), box);
    catalog().then(function (c) {
      AVF.mount(box, h("div", { class: "pkggrid" }, c.packages.map(function (p) { return pkgCard(p, c); })),
        h("div", { class: "pkgnotes" },
          h("div", { class: "pnote" },
            h("div", { class: "pn-row" }, h("span", { class: "pn-ic" }, AVF.icon("card")), h("span", { class: "pn-t" }, "Ödeme kredi / banka kartı ile sanal POS üzerinden alınır. Kart bilgileriniz AlpveFit sunucularında saklanmaz.")),
            h("div", { class: "pn-row ok" }, h("span", { class: "pn-ic" }, AVF.icon("lock")), h("span", { class: "pn-t" }, "256-bit SSL sertifikası ile korunan güvenli bağlantı"))),
          null));
    }, function (e) { AVF.mount(box, AVF.state("alert", "Paketler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.packagesPage(view); } }, "Tekrar dene"))); });
  };
  function pkgCard(p, c) {
    var copy = PKG_COPY[p.key] || { tag: "", level: "", icon: "list" }, sel = p.options[0];
    var price = h("div", { class: "price" }), listP = h("div", { class: "listp" }), buy = h("button", { class: "btn block", type: "button" }, "Satın al");
    var opts = h("div", { class: "seg dur n" + p.options.length, role: "radiogroup", "aria-label": "Süre seçin" });
    function paint() {
      AVF.mount(price, h("b", {}, moneyC(sel.price, cat && cat.currency)));
      AVF.mount(listP, weeksText(sel.weeks) + " · tek ödeme");
      Array.prototype.forEach.call(opts.children, function (b, i) { b.setAttribute("aria-checked", p.options[i] === sel ? "true" : "false"); });
    }
    p.options.forEach(function (o) { opts.appendChild(h("button", { type: "button", role: "radio", onclick: function () { sel = o; paint(); } }, weeksText(o.weeks))); });
    buy.addEventListener("click", function () { AVF.checkout(p, sel, c); });
    paint();
    return h("article", { class: "card pkg fx" },
      h("div", { class: "pkg-head" }, h("span", { class: "tile" }, AVF.icon(copy.icon)), h("span", { class: "chip" }, copy.level)),
      h("h3", { text: p.label }), h("p", { class: "tagline" }, copy.tag),
      h("div", { class: "pkg-price" }, price, listP), opts,
      h("div", { class: "pkg-cats" }, PKG_CATS.map(function (cg) {
        return h("div", { class: "pcat" }, h("div", { class: "pcat-t" }, AVF.icon(cg[0]), h("span", { text: cg[1] })),
          h("ul", {}, cg[2].map(function (row) { var on = row[1](p); return h("li", { class: on ? "on" : "off" }, AVF.icon(on ? "check" : "x"), h("span", { text: row[0] })); })));
      })),
      h("div", { class: "pkg-foot" }, buy));
  }

  // ---------- sipariş penceresi ----------
  AVF.checkout = function (p, opt, c) {
    if (!AVF.session.user) { AVF.toast("Satın almak için giriş yapın veya kayıt olun."); return AVF.auth.open("login"); }
    var ov, prev = document.activeElement;
    function close() { document.removeEventListener("keydown", key, true); if (ov && ov.parentNode) { ov.parentNode.removeChild(ov); AVF.lockScroll(false); } try { prev && prev.focus(); } catch (e) { /* yok say */ } }
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
      lbl(chk1, ["", lnk("kullanim-kosullari", "Hizmet Şartları ve Mesafeli Satış Sözleşmesi"), "’ni okudum, kabul ediyorum. Hizmetin ödeme onayından hemen sonra ifasına başlanmasını talep ediyor ve cayma hakkının bulunmadığı konusunda bilgilendirildiğimi kabul ediyorum."]),
      p.pharmacology ? lbl(chk2, ["", lnk("kullanim-kosullari", "Hizmet Şartları"), "’ndaki sağlık ve farmakoloji hükümlerini okudum. Farmakoloji içeriğinin isteğe bağlı olduğunu, bana zorunlu kılınmadığını; kullanıp kullanmayacağıma kendi irademle karar vereceğimi ve sonuçlarının bana ait olduğunu kabul ediyorum."]) : null,
      lbl(chk3, [lnk("kvkk", "KVKK Aydınlatma Metni"), "’ni okudum."]), err, go);
    ov = h("div", { class: "ov", onmousedown: function (e) { if (e.target === ov) close(); } }, dlg);
    document.body.appendChild(ov); AVF.lockScroll(true); document.addEventListener("keydown", key, true);
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
        body.push(h("div", { class: "note" }, h("b", {}, "Ödemeniz onaylandı. "), "Planlarınız " + AVF.fmtDate(o.plans_due_at) + " tarihine kadar tarafımızca hazırlanır; her plan yayınlandığında bildirim alırsınız."),
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
          h("span", { class: "t" }, h("b", {}, (labels[o.package_key] || o.package_key) + " · " + weeksText(o.weeks)),
            h("small", { class: "ometa" }, h("span", { class: "m" }, AVF.icon("tag"), h("span", { "data-notr": "", text: o.order_number })), h("span", { class: "m" }, AVF.icon("clock"), AVF.fmtFull(o.created_at)), h("span", { class: "m" }, AVF.icon("coin"), moneyC(o.subtotal, o.currency)))), statusChip(o.status), AVF.icon("chev", "chev"));
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
  // isteğe bağlı çevre ölçüleri: [anahtar, etiket, ikon, nasıl ölçülür]
  var MEAS = [["arm", "Kol çevresi", "ruler", "Üst kolun en geniş yerinden, kol gevşekken."], ["shoulder", "Omuz genişliği", "ruler", "Omuz uçları arası düz ölçü."],
    ["waist", "Bel çevresi", "ruler", "Göbek hizasından, nefes verilmişken."], ["neck", "Boyun çevresi", "ruler", "Gırtlağın hemen altından."]];
  var STEPS = [["0-2000", "0 – 2.000"], ["2000-4000", "2.000 – 4.000"], ["4000-6000", "4.000 – 6.000"], ["6000-8000", "6.000 – 8.000"], ["8000-10000", "8.000 – 10.000"], ["10000+", "10.000+"]];
  var GOALS = [["Yağ Yakımı", "flame"], ["Kas Kazanımı", "muscle"], ["Güç Artışı", "bolt"]];
  function psec(icon, title, sub, kids) { return h("section", { class: "card psec" }, h("div", { class: "psh" }, h("span", { class: "tile" }, AVF.icon(icon)), h("span", { class: "t" }, h("b", { text: title }), sub ? h("small", { text: sub }) : null)), h("div", { class: "psb" }, kids)); }
  AVF.profileView = function (el) {
    AVF.mount(el, h("h2", { class: "ptitle", text: "Kişisel Bilgiler" }), AVF.skeleton(2));
    Promise.all([AVF.api("GET", "/profile"), AVF.api("GET", "/uploads/profile").then(null, function () { return []; }), AVF.api("GET", "/uploads/body").then(null, function () { return []; }), AVF.api("GET", "/uploads/blood").then(null, function () { return []; })]).then(function (res) {
      var pr = res[0], P = pr || {}, f = {}, D = AVF.draft("profile"), restoring = false;
      function changed() { if (!restoring) D.set(snapshot()); }
      f.gender = AVF.choice({ label: "Cinsiyet", value: P.gender || "", clearable: true, onChange: changed, items: [{ value: "female", label: "Kadın", icon: "female" }, { value: "male", label: "Erkek", icon: "male" }] });
      // Yaş (doğum tarihi sorulmaz): kayıtlı doğum tarihi / yılından bugünkü yaş hesaplanır
      var age0 = P.birth_date ? (function (d) { var n = new Date(), a = n.getFullYear() - d[0]; if (n.getMonth() + 1 < d[1] || (n.getMonth() + 1 === d[1] && n.getDate() < d[2])) a--; return a; })(P.birth_date.split("-").map(Number)) : P.birth_year ? new Date().getFullYear() - P.birth_year : "";
      f.age = AVF.input("number", { value: age0 ? String(age0) : "", min: "14", max: "90", step: "1", inputmode: "numeric", placeholder: "Örn. 28", "aria-label": "Yaş" });
      f.age.addEventListener("input", changed);
      var ageBox = h("div", { class: "unitin" }, f.age, h("span", { class: "unit-s", text: "yaş" }));
      f.work = AVF.workHours(P.work_hours || "", changed, P.work_schedule || null, P.work_note || "");
      f.height = AVF.measure("height", P.height_cm, changed);
      f.weight = AVF.measure("weight", P.weight_kg, changed);
      MEAS.forEach(function (m) { f[m[0]] = AVF.measure(m[0], P[m[0] + "_cm"], changed); });
      // Haftalık antrenman günü ve günlük öğün: kan grubu gibi simgeli açılır liste (mobilde seçenekler sıkışıp iç içe girmez)
      f.tdays = AVF.iconSelect({ label: "Haftada kaç gün antrenmana gidebilirsiniz", icon: "dumb", placeholder: "Gün sayısını seçin", value: P.training_days ? String(P.training_days) : "", onChange: changed,
        items: [1, 2, 3, 4, 5, 6].map(function (n) { return { value: String(n), label: n + " gün", icon: "dumb", level: (n - 1) / 5 }; }) });
      f.meals = AVF.iconSelect({ label: "Günde kaç öğün tüketebilirsiniz", icon: "apple", placeholder: "Öğün sayısını seçin", value: P.meals_per_day ? String(P.meals_per_day) : "", onChange: changed,
        items: [1, 2, 3, 4, 5, 6].map(function (n) { return { value: String(n), label: n + " öğün", icon: "apple", level: (n - 1) / 5 }; }) });
      f.blood = AVF.iconSelect({ label: "Kan grubu", icon: "drop", placeholder: "Kan grubunuzu seçin", value: P.blood_type || "", onChange: changed, items: BLOOD.map(function (x) { return { value: x, label: x + (x.slice(-1) === "+" ? " · Rh pozitif" : " · Rh negatif"), icon: "drop" }; }) });
      f.goal = AVF.choice({ label: "Hedefiniz", value: P.goal || "", clearable: true, onChange: changed, items: GOALS.map(function (g) { return { value: g[0], label: g[0], icon: g[1] }; }) });
      f.steps = AVF.iconSelect({ label: "Günlük ortalama adım sayısı", icon: "steps", placeholder: "Adım aralığınızı seçin", value: P.steps_range || "", onChange: changed, items: STEPS.map(function (x, i) { return { value: x[0], label: x[1] + " adım", icon: "steps", level: i / (STEPS.length - 1) }; }) });
      f.occupation = AVF.input("text", { value: P.occupation || "", maxlength: "80", autocomplete: "organization-title", placeholder: "Mesleğiniz" });
      f.notes = h("textarea", { class: "inp", id: "pf-notes", maxlength: "1000", rows: "4", placeholder: "Kronik hastalık, yaralanma, kullandığınız ilaçlar gibi koçunuzun bilmesi gereken bilgiler" }, P.health_notes || "");
      var cnt = h("span", { class: "cnt", text: "0/1000" });
      function count() { cnt.textContent = f.notes.value.length + "/1000"; }
      f.occupation.addEventListener("input", changed); f.notes.addEventListener("input", function () { count(); changed(); });
      var consented = !!P.health_consent_at;
      f.files = AVF.fileBox({ scope: "profile", files: res[1] || [], locked: consented ? "" : "Dosya eklemek için önce açık rızanızı onaylayıp bilgilerinizi kaydedin." });
      f.body = AVF.bodyForm({ files: res[2] || [], locked: consented ? "" : "Görsel eklemek için önce açık rızanızı onaylayıp bilgilerinizi kaydedin." });
      f.bloodFiles = AVF.fileBox({ scope: "blood", max: 2, icon: "drop", label: "Kan tahlili ekle", files: res[3] || [], locked: consented ? "" : "Kan tahlili eklemek için önce açık rızanızı onaylayıp bilgilerinizi kaydedin." });

      function snapshot() {
        return { gender: f.gender.get(), age: f.age.value, work: f.work.raw(), height: f.height.raw(), weight: f.weight.raw(), arm: f.arm.raw(), shoulder: f.shoulder.raw(), waist: f.waist.raw(), neck: f.neck.raw(), tdays: f.tdays.get(), meals: f.meals.get(), blood: f.blood.get(), goal: f.goal.get(), steps: f.steps.get(), occupation: f.occupation.value, notes: f.notes.value, consent: consent.checked };
      }
      function apply(d) {
        restoring = true;
        f.gender.set(d.gender || ""); f.age.value = d.age || ""; f.work.setRaw(d.work || ""); f.height.setRaw(d.height); f.weight.setRaw(d.weight); MEAS.forEach(function (m) { f[m[0]].setRaw(d[m[0]]); }); f.tdays.set(d.tdays || ""); f.meals.set(d.meals || "");
        f.blood.set(d.blood || ""); f.goal.set(d.goal || ""); f.steps.set(d.steps || ""); f.occupation.value = d.occupation || ""; f.notes.value = d.notes || ""; consent.checked = !!d.consent; count();
        restoring = false;
      }
      function payload() {
        return { heightCm: f.height.getMetric(), weightKg: f.weight.getMetric(), armCm: f.arm.getMetric(), shoulderCm: f.shoulder.getMetric(), waistCm: f.waist.getMetric(), neckCm: f.neck.getMetric(),
          trainingDays: f.tdays.get() ? Number(f.tdays.get()) : "", mealsPerDay: f.meals.get() ? Number(f.meals.get()) : "", age: f.age.value.trim() ? Number(f.age.value) : "", gender: f.gender.get(), stepsRange: f.steps.get(), workHours: f.work.get(), workSchedule: f.work.schedule(), workNote: f.work.note(), bloodType: f.blood.get(),
          occupation: f.occupation.value.trim(), goal: f.goal.get(), healthNotes: f.notes.value.trim() };
      }
      var consent = h("input", { type: "checkbox", id: "pf-consent" }); consent.addEventListener("change", changed);
      var msg = h("div", { class: "note err", role: "alert", style: "display:none" }), save = h("button", { class: "btn", type: "button" }, AVF.icon("save", "bico"), "Kaydet");
      var restoredNote = h("div", { class: "note draftnote", style: "display:none" }, AVF.icon("refresh", "ico"), h("span", { text: "Kaydedilmemiş değişiklikleriniz geri yüklendi." }),
        h("button", { class: "lnk", type: "button", onclick: function () { D.clear(); AVF.profileView(el); } }, "Değişiklikleri at"));
      var form = h("div", { class: "pgrid" },
        h("div", { class: "note" }, "Bu bilgileri paylaşmak isteğe bağlıdır; size uygun program hazırlanmasına yardımcı olur. Yalnızca siz ve koçunuz görebilirsiniz. Dilediğiniz zaman silebilirsiniz."),
        restoredNote,
        psec("id", "Genel Bilgiler", "Cinsiyet, yaş ve meslek", [
          h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon("users")), "Cinsiyet"), f.gender),
          h("div", { class: "field" }, h("label", { for: f.age.id }, h("span", { class: "tile" }, AVF.icon("calendar")), "Yaş"), ageBox),
          AVF.field("Meslek", f.occupation, { optional: true, icon: "briefcase" })]),
        psec("clock", "Çalışma Saati", "Programınız iş düzeninize göre planlanır", [f.work]),
        psec("pulse", "Vücut Ölçüleri", "Boy, kilo ve kan grubu — birimi dilediğiniz gibi seçin", [
          h("div", { class: "fgrid" },
            h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon("ruler")), "Boy"), f.height),
            h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon("weight")), "Kilo"), f.weight)),
          h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon("drop")), "Kan grubu"), f.blood),
          h("p", { class: "wh-sub" }, AVF.icon("ruler"), h("span", { text: "Çevre ölçüleri (isteğe bağlı)" })),
          h("div", { class: "fgrid" }, MEAS.map(function (m) { return h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon(m[2])), m[1], h("span", { class: "opt", text: "İsteğe bağlı" })), f[m[0]], h("small", { class: "hint", text: m[3] })); }))]),
        psec("users", "Vücut Formu", "Ön, arka, sağ ve sol görünüm — koçunuz gelişiminizi bu görsellerle takip eder", [
          h("p", { class: "hint", text: "Sade bir arka planda, iyi ışıkta ve aynı mesafeden çekilmiş görseller önerilir. Görselleri yalnızca siz ve koçunuz görebilirsiniz." }), f.body]),
        psec("dumb", "Antrenman ve Beslenme Düzeni", "Programınız bu düzene göre hazırlanır", [
          h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon("dumb")), "Haftada kaç gün antrenmana gidebilirsiniz?"), f.tdays),
          h("div", { class: "field" }, h("label", null, h("span", { class: "tile" }, AVF.icon("apple")), "Günde kaç öğün tüketebilirsiniz?"), f.meals)]),
        psec("target", "Hedefiniz", "Şu an için öncelikli hedefiniz", [f.goal]),
        psec("steps", "Günlük Ortalama Adım", "Bir günde yaklaşık kaç adım attığınız", [f.steps]),
        psec("alert", "Sağlık ve Sakatlık Durumu", "Koçunuzun bilmesi gereken sağlık bilgileri ve görselleri", [f.notes, h("div", { class: "row between", style: "margin-top:6px" }, cnt), f.files]),
        psec("drop", "Kan Tahlili", "Son kan tahlili sonuçlarınız (en fazla 2 dosya) — koçunuz programınızı buna göre düzenler", [
          h("p", { class: "hint", text: "Sonuç sayfasının net, okunaklı ve tam görünen bir fotoğrafını veya PDF'ini ekleyin. Kimlik numarası gibi gereksiz kişisel bilgileri kapatabilirsiniz." }), f.bloodFiles]),
        consented ? h("p", { class: "hint", text: "Açık rızanız " + AVF.fmtDate(P.health_consent_at) + " tarihinde alındı." }) :
          h("label", { class: "chk", for: "pf-consent" }, consent, h("span", {}, ["Sağlık ve koçluk bilgilerimin, program hazırlanması amacıyla koçum tarafından işlenmesine ", h("a", { href: "/yasal/kvkk", target: "_blank", rel: "noopener" }, "KVKK Aydınlatma Metni"), " kapsamında açık rıza veriyorum."])),
        msg, h("div", { class: "row", style: "gap:10px;flex-wrap:wrap;margin-top:6px" }, save, pr ? h("button", { class: "btn ghost", type: "button", onclick: function () {
          AVF.confirmDialog({ icon: "trash", danger: true, title: "Bilgileriniz silinsin mi?", text: "Tüm kişisel bilgileriniz ve eklediğiniz dosyalar silinecek, açık rızanız geri alınacak.", confirm: "Evet, sil", cancel: "Vazgeç" }).then(function (y) {
            if (!y) return; AVF.api("DELETE", "/profile").then(function () { D.clear(); AVF.toast("Bilgileriniz silindi."); AVF.profileView(el); }, function (e) { AVF.toast(AVF.errText(e), "err"); });
          });
        } }, AVF.icon("trash", "bico"), "Bilgilerimi sil ve rızamı geri al") : null));
      var base = JSON.stringify(payload());   // sunucudaki hâl (taslak uygulanmadan önce)
      var d = D.get(); if (d) { apply(d); if (JSON.stringify(payload()) !== base) restoredNote.style.display = ""; else D.clear(); }
      count();
      AVF.mount(el, h("h2", { class: "ptitle", text: "Kişisel Bilgiler" }), form);
      function fail(t) { msg.textContent = t; msg.style.display = ""; msg.scrollIntoView({ block: "center", behavior: "smooth" }); }
      save.addEventListener("click", function () {
        msg.style.display = "none";
        var av = f.age.value.trim(); if (av && (!/^\d+$/.test(av) || +av < 14 || +av > 90)) return fail("Yaş 14–90 arasında olmalıdır.");
        var me = f.height.error() || f.weight.error(); if (me) return fail(me);
        var wi = f.work.incomplete(); if (wi) return fail(wi);
        if (f.files.busy() || f.bloodFiles.busy()) return fail("Dosyalar yükleniyor; lütfen yükleme bitince kaydedin.");
        var body = payload();
        var any = Object.keys(body).some(function (k) { return body[k] !== "" && body[k] !== null; });
        if (!any) return fail(pr ? "Kaydedilecek bilgi yok. Tüm bilgilerinizi kaldırmak için “Bilgilerimi sil” seçeneğini kullanın." : "Kaydetmek için en az bir bilgi girin.");
        if (JSON.stringify(body) === base && consented) { D.clear(); restoredNote.style.display = "none"; return AVF.toast("Kaydedilecek bir değişiklik yok."); }
        if (!consented && !consent.checked) return fail("Bu bilgileri kaydedebilmemiz için açık rızanızı onaylamanız gerekir.");
        body.healthConsent = consented || consent.checked;
        AVF.busy(save, true, "Kaydediliyor…");
        AVF.api("PUT", "/profile", body).then(function () { D.clear(); AVF.toast("Bilgileriniz kaydedildi."); AVF.profileView(el); },
          function (e) { AVF.busy(save, false); fail(AVF.errText(e)); });
      });
    }, function (e) { AVF.mount(el, h("h2", { class: "ptitle", text: "Kişisel Bilgiler" }), AVF.state("alert", "Bilgiler yüklenemedi", AVF.errText(e), h("button", { class: "btn", type: "button", onclick: function () { AVF.profileView(el); } }, "Tekrar dene"))); });
  };
})();
