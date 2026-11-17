/* AlpveFit — bilgi sayfaları: SSS, Hakkımızda, Blog, Araçlar (hesaplayıcılar), Forum (yapım aşamasında).
   Hesaplayıcılar tamamen tarayıcıda çalışır: girilen değerler sunucuya GÖNDERİLMEZ ve saklanmaz. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;

  function link(href, children, attrs) { attrs = attrs || {}; attrs.href = href; attrs["data-link"] = ""; return h("a", attrs, children); }
  function page(view, title, doc, sub, body, icon) {
    document.title = doc + " — AlpveFit";
    AVF.mount(view,
      h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, icon ? h("span", { class: "eyebrow" }, AVF.icon(icon), doc) : null, h("h1", { text: title }), sub ? h("p", { text: sub }) : null)),
      h("div", { class: "wrap section" }, body));
  }

  // ---------- SSS ----------
  var FAQ = [
    ["card", "Ödeme nasıl yapılıyor?", "Ödeme, kredi veya banka kartınızla sanal POS üzerinden güvenli olarak alınır. Kart bilgileriniz AlpveFit sunucularına iletilmez ve saklanmaz; işlem ödeme kuruluşunun güvenli sayfasında tamamlanır. Şu an test aşamasındayız; ödeme sahte (deneme) sanal POS ile yapılır ve gerçek tahsilat olmaz."],
    ["clock", "Programım ne zaman hazır olur?", "Ödemeniz onaylandıktan sonra 24 saat içinde. Beslenme, antrenman ve takviye planlarınız uzmanınız tarafından hazırlanır; her plan panelinizde yayınlandığında bildirim alırsınız."],
    ["lock", "Planlarımı kimler görebilir?", "Planlarınızı yalnızca siz ve size atanmış yetkili uzman görebilir. Her planda hazırlayan uzmanın adı ve yayın tarihi yer alır; planlar başka üyelerle paylaşılmaz."],
    ["target", "Programlar nasıl hazırlanıyor?", "Her program, hedefiniz ve yaşam düzeniniz dikkate alınarak yetkili uzmanlarca elle hazırlanır. Sistem hiçbir beslenme, antrenman, takviye veya farmakoloji içeriğini otomatik olarak üretmez."],
    ["id", "Kişisel bilgilerimi vermek zorunda mıyım?", "Hayır, tamamen isteğe bağlıdır. Boy, kilo, meslek gibi bilgiler programınızın size daha uygun hazırlanmasına yardımcı olur; açık rızanızla kaydedilir ve panelinizden dilediğiniz an silebilirsiniz."],
    ["flask", "Farmakoloji desteği zorunlu mu?", "Hayır. İleri Seviye ve Yarışmacı paketlerinde yer alır ancak tamamen isteğe bağlıdır; hiçbir üyeye zorunlu kılınmaz. Kullanıp kullanmama kararı ve sorumluluğu üyeye aittir."],
    ["chat", "Size nasıl ulaşabilirim?", "Sağ alttaki canlı destek penceresinden bize yazabilir, üye panelinizden destek talebi (ticket) oluşturabilir veya destek@alpvefit.com adresine e-posta gönderebilirsiniz."],
    ["shield", "Verilerim ne kadar süre saklanır?", "Kişisel verileriniz 180 gün süreyle saklanır; ardından silinir veya anonim hâle getirilir. Yasal olarak daha uzun saklanması gereken mali kayıtlar bu sürenin dışındadır. Ayrıntılar KVKK Aydınlatma Metni’ndedir."]
  ];
  AVF.pages = {};
  AVF.pages.faq = function (view) {
    var group = [];
    page(view, "Sık sorulan sorular", "Sık sorulan sorular", "Aradığınızı bulamazsanız canlı destekten veya destek@alpvefit.com adresinden bize ulaşın.",
      h("div", { class: "faq" }, FAQ.map(function (q) { return AVF.accordion({ icon: q[0], title: q[1], group: group, content: h("p", { class: "faq-a", text: q[2] }) }); })), "help");
  };

  // ---------- Hakkımızda ----------
  AVF.pages.about = function (view) {
    function pillar(icon, t, s) { return h("div", { class: "card feat" }, h("span", { class: "tile" }, AVF.icon(icon)), h("h3", { text: t }), h("p", { text: s })); }
    page(view, "Hakkımızda", "Hakkımızda", "AlpveFit, uzaktan eğitim ve koçluk hizmeti sunan bağımsız bir platformdur.",
      h("div", { class: "stack lg" },
        h("div", { class: "card prose mission" },
          h("span", { class: "tile" }, AVF.icon("mission")),
          h("div", {}, h("h2", { text: "Misyonumuz" }),
            h("p", { text: "AlpveFit’te her program, kişinin hedefine, yaşam düzenine, sağlık durumuna ve maddi durumuna göre uzmanlar tarafından titizlikle hazırlanır. Otomatik üretilmiş şablon kullanılmaz; planlar yalnızca yetkili kişilerce oluşturulur ve kullanıcı panelinizde yalnızca sizin görebileceğiniz şekilde yayınlanır." }))),
        h("div", { class: "grid3" },
          pillar("award", "Uzman kadro", "Programlarınız yalnızca yetkili ve deneyimli uzmanlar tarafından hazırlanır ve güncellenir."),
          pillar("clock", "Hızlı teslim", "Ödemenizin onaylanmasından sonra programlarınız 24 saat içinde panelinizde yayınlanır."),
          pillar("lock", "Gizlilik", "Verileriniz ayrı bir sistemde tutulur; açık rızanız olmadan kimseyle paylaşılmaz.")),
        h("div", { class: "card prose" },
          h("h2", {}, AVF.icon("headset"), h("span", { text: "İletişim" })),
          h("p", {}, "Soru ve önerileriniz için ", h("a", { href: "mailto:destek@alpvefit.com" }, "destek@alpvefit.com"), " adresine yazabilirsiniz."),
          h("div", { class: "row" }, h("a", { class: "btn", href: "mailto:destek@alpvefit.com" }, AVF.icon("mail", "bico"), "E-posta gönder"), link("/sss", "Sık sorulan sorular", { class: "btn ghost" })))), "users");
  };

  // ---------- Forum (yapım aşamasında) ----------
  AVF.pages.forum = function (view) {
    page(view, "Forum", "Forum", "",
      AVF.state("msg", "Forum yapım aşamasında", "Üyelerimizin soru sorabileceği ve deneyim paylaşabileceği forum alanı üzerinde çalışıyoruz. Çok yakında burada olacak.",
        h("div", { class: "row", style: "justify-content:center;margin-top:8px" }, link("/blog", "Blog'u incele", { class: "btn" }), link("/araclar", "Araçlara git", { class: "btn ghost" }))));
  };

  // ---------- Blog ----------
  function renderBody(text) {
    var out = [];
    String(text).split(/\n{2,}/).forEach(function (blk) {
      blk = blk.trim(); if (!blk) return;
      if (/^## /.test(blk)) out.push(h("h2", { "data-notr": "", text: blk.slice(3) }));
      else out.push(h("p", { "data-notr": "", style: "white-space:pre-wrap", text: blk }));
    });
    return out;
  }
  AVF.pages.blog = function (view) {
    var box = h("div", { class: "stack" }, AVF.skeleton(3));
    page(view, "Blog", "Blog", "Beslenme, antrenman ve sağlıklı yaşam üzerine yazılar.", box, "book");
    AVF.api("GET", "/blog").then(function (rows) {
      if (!rows.length) return AVF.mount(box, AVF.state("book", "Henüz yazı yok", "Yeni yazılar yayınlandığında burada görünecek."));
      AVF.mount(box, h("div", { class: "grid3" }, rows.map(function (p) {
        return link("/blog/" + p.slug, [h("span", { class: "tile" }, AVF.icon("book")), h("h3", { "data-notr": "", text: p.title }), p.excerpt ? h("p", { "data-notr": "", text: p.excerpt }) : null,
          h("small", {}, (p.author_name ? p.author_name + " · " : "") + AVF.fmtDate(p.published_at))], { class: "card feat postcard" });
      })));
    }, function (e) { AVF.mount(box, AVF.state("alert", "Yazılar yüklenemedi", AVF.errText(e))); });
  };
  AVF.pages.post = function (view, slug) {
    var box = h("div", { class: "card prose" }, AVF.skeleton(2));
    page(view, "Blog", "Blog", "", h("div", { class: "narrow-col" }, box, h("div", { style: "margin-top:16px" }, link("/blog", "Tüm yazılar", { class: "btn ghost" }))));
    AVF.api("GET", "/blog/" + encodeURIComponent(slug)).then(function (p) {
      document.title = p.title + " — AlpveFit";
      AVF.mount(box, h("h1", { "data-notr": "", text: p.title }), h("p", { class: "meta" }, (p.author_name ? p.author_name + " · " : "") + AVF.fmtDate(p.published_at)), renderBody(p.body));
    }, function () { AVF.mount(box, AVF.state("alert", "Yazı bulunamadı", "Aradığınız yazı yayında değil veya kaldırılmış olabilir.")); });
  };

  // ---------- Araçlar ----------
  function num(v) { var n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : NaN; }
  function f1(n) { return n.toLocaleString(AVF.lang === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: 1 }); }
  var TOOLS = [
    { key: "vki", icon: "user", title: "Vücut kitle indeksi", desc: "Boy ve kilonuza göre VKİ değerinizi ve aralığını görün.",
      fields: [["h", "Boy (cm)", 100, 250], ["w", "Kilo (kg)", 30, 300]],
      calc: function (v) { var m = v.h / 100, b = v.w / (m * m), c = b < 18.5 ? "Zayıf" : b < 25 ? "Normal" : b < 30 ? "Fazla kilolu" : "Obez";
        return [["VKİ", f1(b)], ["Aralık (DSÖ)", c]]; },
      note: "VKİ kas kütlesini ve vücut bileşimini dikkate almaz; sporcular için yanıltıcı olabilir." },
    { key: "kalori", icon: "calc", title: "Günlük kalori ihtiyacı", desc: "Mifflin-St Jeor denklemiyle bazal metabolizma ve günlük enerji ihtiyacınızı hesaplayın.",
      fields: [["a", "Yaş", 14, 100], ["h", "Boy (cm)", 100, 250], ["w", "Kilo (kg)", 30, 300]],
      selects: [["s", "Cinsiyet", [["m", "Erkek"], ["f", "Kadın"]]], ["act", "Aktivite düzeyi", [["1.2", "Hareketsiz"], ["1.375", "Hafif aktif (haftada 1–3 gün)"], ["1.55", "Orta aktif (haftada 3–5 gün)"], ["1.725", "Çok aktif (haftada 6–7 gün)"]]]],
      calc: function (v) { var bmr = 10 * v.w + 6.25 * v.h - 5 * v.a + (v.s === "m" ? 5 : -161), t = bmr * parseFloat(v.act);
        return [["Bazal metabolizma", Math.round(bmr) + " kcal"], ["Günlük ihtiyaç", Math.round(t) + " kcal"]]; },
      note: "Sonuç bir tahmindir; kişiden kişiye değişir." },
    { key: "makro", icon: "list", title: "Makro dağılımı", desc: "Günlük kalori hedefinizi protein, karbonhidrat ve yağ gramlarına bölün.",
      fields: [["k", "Günlük kalori (kcal)", 800, 8000]],
      selects: [["d", "Dağılım", [["30,40,30", "Dengeli (P30 / K40 / Y30)"], ["40,30,30", "Yüksek protein (P40 / K30 / Y30)"], ["35,25,40", "Düşük karbonhidrat (P35 / K25 / Y40)"]]]],
      calc: function (v) { var r = v.d.split(",").map(Number);
        return [["Protein", Math.round(v.k * r[0] / 100 / 4) + " g"], ["Karbonhidrat", Math.round(v.k * r[1] / 100 / 4) + " g"], ["Yağ", Math.round(v.k * r[2] / 100 / 9) + " g"]]; },
      note: "Dağılımlar genel örneklerdir; kişiye özel plan için uzmanınıza danışın." },
    { key: "su", icon: "clock", title: "Günlük su ihtiyacı", desc: "Kilonuza ve egzersiz sürenize göre yaklaşık su ihtiyacınızı görün.",
      fields: [["w", "Kilo (kg)", 30, 300], ["m", "Günlük egzersiz süresi (dk)", 0, 600]],
      calc: function (v) { var l = (v.w * 33 + v.m / 30 * 350) / 1000; return [["Yaklaşık su ihtiyacı", f1(l) + " L"]]; },
      note: "Sıcak hava, hastalık ve bazı sağlık durumları ihtiyacı değiştirir." },
    { key: "1tm", icon: "dumb", title: "1 tekrar maksimum (1TM)", desc: "Kaldırdığınız ağırlık ve tekrar sayısından tahmini 1TM değerinizi hesaplayın (Epley).",
      fields: [["w", "Ağırlık (kg)", 1, 600], ["r", "Tekrar sayısı", 1, 20]],
      calc: function (v) { var m = v.r === 1 ? v.w : v.w * (1 + v.r / 30); return [["Tahmini 1TM", f1(m) + " kg"], ["%80'i", f1(m * .8) + " kg"], ["%60'ı", f1(m * .6) + " kg"]]; },
      note: "Maksimum denemeleri güvenli bir ortamda ve gerekirse yardımcı ile yapın." }
  ];
  function toolForm(t, out) {
    var inputs = {};
    var form = h("form", { class: "toolform", novalidate: "" });
    t.fields.forEach(function (f) {
      var inp = AVF.input("number", { inputmode: "decimal", step: "any", min: String(f[2]), max: String(f[3]), autocomplete: "off" });
      inputs[f[0]] = inp; form.appendChild(AVF.field(f[1], inp, { optional: true }));
    });
    (t.selects || []).forEach(function (s) {
      var sel = h("select", { class: "inp", id: "sel" + s[0] + t.key }, s[2].map(function (o) { return h("option", { value: o[0], text: o[1] }); }));
      inputs[s[0]] = sel; form.appendChild(AVF.field(s[1], sel, { optional: true }));
    });
    form.appendChild(h("button", { class: "btn block", type: "submit" }, "Hesapla"));
    form.addEventListener("submit", function (e) {
      e.preventDefault(); var v = {}, bad = null;
      t.fields.forEach(function (f) { var n = num(inputs[f[0]].value); if (!(n >= f[2] && n <= f[3])) bad = bad || (f[1] + ": " + f[2] + " – " + f[3] + " arasında bir değer girin."); v[f[0]] = n; });
      (t.selects || []).forEach(function (s) { v[s[0]] = inputs[s[0]].value; });
      if (bad) return AVF.mount(out, h("p", { class: "err", role: "alert", text: bad }));
      AVF.mount(out, h("div", { class: "kv res" }, t.calc(v).map(function (r) { return h("div", {}, h("span", { text: r[0] }), h("b", { text: r[1] })); })), h("p", { class: "hint", text: t.note }));
    });
    return form;
  }
  AVF.pages.tools = function (view, key) {
    var t = TOOLS.filter(function (x) { return x.key === key; })[0];
    if (!t) {
      page(view, "Araçlar", "Araçlar", "Hesaplayıcılar tarayıcınızda çalışır; girdiğiniz değerler hiçbir yere gönderilmez.",
        h("div", { class: "grid3" }, TOOLS.map(function (x) {
          return link("/araclar/" + x.key, [h("span", { class: "tile" }, AVF.icon(x.icon)), h("h3", { text: x.title }), h("p", { text: x.desc }), h("span", { class: "chip" }, AVF.icon("wrench"), "Hesapla")], { class: "card feat postcard" });
        })), "wrench");
      return;
    }
    var out = h("div", { "aria-live": "polite" });
    page(view, t.title, t.title, t.desc,
      h("div", { class: "narrow-col" }, h("div", { class: "note" }, "Bilgilendirme amaçlıdır; tıbbi tavsiye değildir. Değerler yalnızca tarayıcınızda hesaplanır, sunucuya gönderilmez."),
        h("div", { class: "card", style: "padding:22px" }, toolForm(t, out), h("div", { style: "margin-top:16px" }, out)),
        h("div", { style: "margin-top:16px" }, link("/araclar", "Tüm araçlar", { class: "btn ghost" }))));
  };
})();
