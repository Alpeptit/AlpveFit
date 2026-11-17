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
  // Cevaplarda **kalın** işaretli kısımlar vurgulanır; her iki dil ayrı yazılır (parçalı çeviri yerine bütünlüklü metin).
  var FAQ = [
    ["card", "Ödeme nasıl yapılıyor?", "How is payment made?",
      "Ödeme, **kredi veya banka kartınızla sanal POS** üzerinden güvenle alınır. Kart bilgileriniz **AlpveFit sunucularına iletilmez ve saklanmaz**; işlem ödeme kuruluşunun güvenli sayfasında tamamlanır.",
      "Payment is taken securely **by credit or debit card via virtual POS**. Your card details are **never sent to or stored on AlpveFit servers**; the transaction is completed on the payment institution's secure page."],
    ["clock", "Programım ne zaman hazır olur?", "When will my program be ready?",
      "Ödemeniz onaylandıktan sonra **24 saat içinde**. Beslenme, antrenman ve takviye planlarınız **tarafımızca bizzat** hazırlanır; her plan panelinizde yayınlandığında **bildirim alırsınız**.",
      "**Within 24 hours** of your payment being confirmed. Your nutrition, training and supplement plans are prepared **personally by us**; you **get a notification** as each plan is published in your panel."],
    ["lock", "Planlarımı kimler görebilir?", "Who can see my plans?",
      "Planlarınızı **yalnızca siz ve koçunuz** görebilir. Her planda hazırlanma ve yayın tarihi yer alır; planlar **başka üyelerle asla paylaşılmaz**.",
      "**Only you and your coach** can see your plans. Each plan shows when it was prepared and published; plans are **never shared with other members**."],
    ["target", "Programlar nasıl hazırlanıyor?", "How are programs prepared?",
      "Her program; hedefiniz, yaşam düzeniniz ve paylaştığınız bilgiler dikkate alınarak **tarafımızca elle** hazırlanır. Sistem hiçbir beslenme, antrenman, takviye veya farmakoloji içeriğini **otomatik olarak üretmez**.",
      "Every program is prepared **by hand by us**, taking your goal, lifestyle and the details you share into account. The system **never generates** nutrition, training, supplement or pharmacology content automatically."],
    ["pulse", "Kan tahlili kontrolü nedir?", "What is the blood test review?",
      "**İleri Seviye Program** ve **Yarışmacı Paketi**’nde, paylaştığınız kan tahlili sonuçları programınızın planlanması ve takibi amacıyla tarafımızca incelenir. Bu inceleme **tıbbi değerlendirme veya teşhis yerine geçmez**.",
      "In the **Advanced Program** and **Competitor Package**, the blood test results you share are reviewed by us to plan and track your program. This review **does not replace a medical assessment or diagnosis**."],
    ["id", "Kişisel bilgilerimi vermek zorunda mıyım?", "Do I have to share my personal information?",
      "Hayır, **tamamen isteğe bağlıdır**. Boy, kilo, meslek gibi bilgiler programınızın size daha uygun hazırlanmasına yardımcı olur; **açık rızanızla** kaydedilir ve panelinizden **dilediğiniz an silebilirsiniz**.",
      "No, it is **entirely optional**. Details such as height, weight and occupation help tailor your program; they are saved **with your explicit consent** and you can **delete them at any time** from your panel."],
    ["chat", "Size nasıl ulaşabilirim?", "How can I reach you?",
      "Herhangi bir sorunuzda veya destek ihtiyacınızda **destek@alpvefit.com** üzerinden bizimle iletişime geçebilirsiniz.",
      "For any question or support need, you can contact us at **destek@alpvefit.com**."],
    ["shield", "Verilerim ne kadar süre saklanır?", "How long is my data kept?",
      "Kişisel verileriniz **180 gün** süreyle saklanır; ardından silinir veya anonim hâle getirilir. Yasal olarak daha uzun saklanması gereken **mali kayıtlar** bu sürenin dışındadır. Ayrıntılar **KVKK Aydınlatma Metni**’ndedir.",
      "Your personal data is kept for **180 days** and then deleted or anonymised. **Financial records** that must legally be kept longer are excluded. Details are in the **KVKK Notice**."]
  ];
  AVF.pages = {};
  AVF.pages.faq = function (view) {
    var group = [], en = AVF.lang === "en";
    page(view, "Sık sorulan sorular", "Sık sorulan sorular", "Herhangi bir sorunuzda veya destek ihtiyacınızda destek@alpvefit.com üzerinden bizimle iletişime geçebilirsiniz.",
      h("div", { class: "faq" }, FAQ.map(function (q) {
        var acc = AVF.accordion({ icon: q[0], title: q[1], group: group, content: AVF.rich("p", en ? q[4] : q[3], { class: "faq-a", "data-notr": "" }) });
        return acc;
      })), "help");
  };

  // ---------- Hakkımızda ----------
  AVF.pages.about = function (view) {
    function pillar(icon, t, s) { return h("div", { class: "card feat" }, h("span", { class: "tile" }, AVF.icon(icon)), h("h3", { text: t }), h("p", { text: s })); }
    function step(n, icon, t, s) { return h("div", { class: "astep" }, h("span", { class: "astep-n", "data-notr": "", text: n }), h("span", { class: "tile" }, AVF.icon(icon)), h("h3", { text: t }), h("p", { text: s })); }
    page(view, "Hakkımızda", "Hakkımızda", "AlpveFit; hedeflerinize ulaşmanız için doğrudan bizimle birebir çalıştığınız, bağımsız bir uzaktan eğitim ve koçluk platformudur.",
      h("div", { class: "stack lg" },
        h("div", { class: "card prose mission" },
          h("span", { class: "tile" }, AVF.icon("mission")),
          h("div", {}, h("h2", { text: "Misyon" }),
            h("p", { text: "AlpveFit’te her program; hedefinize, yaşam düzeninize, sağlık durumunuza ve bütçenize göre tarafımızca titizlikle hazırlanır. Otomatik üretilmiş şablonlar kesinlikle kullanılmaz; planlar tarafımızca oluşturulur ve kullanıcı panelinizde yalnızca sizin görebileceğiniz şekilde yayınlanır." }))),
        h("div", {}, h("div", { class: "shead" }, h("span", { class: "kicker" }, AVF.icon("layers"), "Süreç"), h("h2", { class: "sec", text: "Nasıl Çalışıyoruz?" })),
          h("div", { class: "asteps" },
            step("01", "userplus", "Kayıt Olun", "Modern ve sade arayüzümüz üzerinden saniyeler içinde sisteme kayıt olun."),
            step("02", "id", "Bilgilerinizi Paylaşın", "Boy, kilo, yaş, günlük rutininiz, sağlık durumunuz, alerjileriniz ve bütçeniz gibi detayları bize bildirin."),
            step("03", "tag", "Paketinizi Seçin", "Hedeflerinize en uygun olan Başlangıç, İleri Seviye veya Yarışmacı paketinden birini seçin."),
            step("04", "clock", "Programınız Hazır!", "Ödemenizin ardından yapılan detaylı analizle tamamen size özel hazırlanan programınız, en geç 24 saat içinde hazır!"))),
        h("div", {}, h("div", { class: "shead" }, h("span", { class: "kicker" }, AVF.icon("shield"), "Değerlerimiz"), h("h2", { class: "sec", text: "İlkelerimiz" })),
          h("div", { class: "grid3" },
            pillar("target", "Değişim Odaklılık", "Hedeflerinize ulaşmanız için gereken tüm özeni gösteriyor, fiziksel ve mental dönüşümünüzü en temel önceliğimiz olarak görüyoruz."),
            pillar("heart", "Önce Sağlık", "Tüm planlamalarımızda sağlığınızı her şeyin önünde tutuyor, sürdürülebilir ve güvenli bir gelişim süreci sunuyoruz."),
            pillar("spark", "Kusursuz Deneyim", "Kullanıcı dostu modern arayüzümüz ve kesintisiz, hızlı iletişim desteğimizle süreci sizin için en pratik hale getiriyoruz."))),
        h("div", { class: "card prose mission" },
          h("span", { class: "tile" }, AVF.icon("mail")),
          h("div", {}, h("h2", { text: "İletişim" }),
            AVF.lang === "en"
              ? h("p", { "data-notr": "" }, "For any questions, feedback or suggestions, you can reach us at ", h("a", { href: "mailto:destek@alpvefit.com" }, "destek@alpvefit.com"), ".")
              : h("p", { "data-notr": "" }, "Her türlü soru, görüş ve öneriniz için bizimle ", h("a", { href: "mailto:destek@alpvefit.com" }, "destek@alpvefit.com"), " adresi üzerinden iletişime geçebilirsiniz."),
            h("div", { class: "row" }, h("a", { class: "btn", href: "mailto:destek@alpvefit.com" }, AVF.icon("mail", "bico"), "E-posta gönder"), link("/sss", "Sık sorulan sorular", { class: "btn ghost" }))))), "users");
  };

  // ---------- Forum (yapım aşamasında) ----------
  AVF.pages.forum = function (view) {
    page(view, "Forum", "Forum", "",
      AVF.state("msg", "Forum yapım aşamasında", "Üyelerimizin soru sorabileceği ve deneyim paylaşabileceği forum alanı üzerinde çalışıyoruz. Çok yakında burada olacak.",
        h("div", { class: "row", style: "justify-content:center;margin-top:8px" }, link("/blog", "Blog'u incele", { class: "btn" }), link("/araclar", "Araçlara git", { class: "btn ghost" }))));
  };

  // Blog: avf-blog.js (AVF.pages.blog / AVF.pages.post orada tanımlanır).
  // Araçlar: avf-tools.js (AVF.pages.tools orada tanımlanır).
})();
