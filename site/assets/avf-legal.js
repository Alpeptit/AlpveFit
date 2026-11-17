/* AlpveFit — hukuki metinler (TR/EN). İçerik düz metindir; yalnız **kalın** işareti tanınır ve textContent ile yazılır.
   Yayın öncesinde bir avukat tarafından gözden geçirilmelidir. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var MAIL = "destek@alpvefit.com";

  var DOCS = {
    "kullanim-kosullari": {
      tr: { title: "Hizmet Şartları ve Mesafeli Satış Sözleşmesi", sections: [
        ["Taraflar ve kapsam", [
          "Bu sözleşme, alpvefit.com üzerinden hizmet satın alan kişi (**“Üye”**) ile **AlpveFit** arasında kurulur. Siteye üye olarak veya bir paket satın alarak bu şartları kabul etmiş olursunuz.",
          "AlpveFit, **uzaktan eğitim ve koçluk** hizmeti sunan bir platformdur. Sitede fiziksel ürün satılmaz ve gönderim yapılmaz; hizmet yalnızca dijital olarak sunulur.",
          "İletişim: **" + MAIL + "**"]],
        ["Hizmetin kapsamı", [
          "Uzaktan Eğitim Sistemi üç paketten oluşur: **Başlangıç Paketi** (12 veya 24 hafta), **İleri Seviye Program** (16 veya 24 hafta, farmakoloji desteği dahil) ve **Yarışmacı Paketi** (12 hafta, farmakoloji desteği dahil). İleri Seviye Program ve Yarışmacı Paketi’nde **kan tahlili kontrolü** de yer alır: Üye’nin paylaştığı tahlil sonuçları, programın planlanması ve takibi amacıyla uzman tarafından incelenir; bu inceleme tıbbi değerlendirme veya teşhis yerine geçmez. Güncel fiyat ve süreler Paketler sayfasında yer alır.",
          "Ödemenin onaylanmasından sonra beslenme, antrenman ve takviye programlarınız **en geç 24 saat içinde** yetkili uzmanlarımızca hazırlanır ve hesabınızdaki panelde yayınlanır. Planlar **yalnızca sizin hesabınızda** görünür.",
          "Programlar kişiye özel hazırlanır. Profilinizde paylaştığınız bilgiler (boy, kilo, meslek, günlük adım sayısı vb.) yalnızca programınızın hazırlanması amacıyla uzmanlarca kullanılır; bu bilgileri paylaşmak isteğe bağlıdır."]],
        ["Üyelik ve hesap güvenliği", [
          "Üye, **18 yaşını doldurduğunu** ve doğru, güncel bilgi verdiğini beyan eder. Hesap bilgilerinin ve iki aşamalı doğrulama kodlarının gizliliğinden Üye sorumludur; hesabın devredilmesi veya paylaşılması yasaktır.",
          "AlpveFit, hesabın kötüye kullanıldığına dair makul şüphe hâlinde hesabı geçici olarak kısıtlayabilir veya askıya alabilir."]],
        ["Fiyat ve ödeme", [
          "Fiyatlar **Türk lirası (TRY)** cinsinden liste fiyatıdır. Ödeme, **kredi / banka kartı** ile sanal POS (ödeme kuruluşu) üzerinden alınır. Kart bilgileri AlpveFit sunucularına iletilmez ve **AlpveFit tarafından saklanmaz**.",
          "Ödeme penceresi, sipariş oluşturulduktan sonra **2 saattir**; süre dolduğunda sipariş geçersiz olur. Test aşamasında ödeme sahte (deneme) sanal POS ile yapılabilir; bu aşamada gerçek tahsilat yapılmaz.",
          "Kartın banka tarafından reddedilmesi veya 3D Secure doğrulamasının tamamlanmaması gibi nedenlerle ödeme alınamazsa sipariş ödenmemiş sayılır ve plan hazırlama süreci başlamaz."]],
        ["Cayma hakkı ve iade", [
          "Hizmet, kişiye özel hazırlanan ve **ödeme onayından hemen sonra ifasına başlanan** bir hizmettir. 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca bu tür hizmetlerde **cayma hakkı kullanılamaz**; Üye, siparişi onaylayarak bu konuda bilgilendirildiğini kabul eder.",
          "İlk plan hazırlanmaya başlanmadan önce " + MAIL + " adresine iletilen yazılı iptal talepleri değerlendirilir. Onaylanan iadeler, ödemenin yapıldığı karta ödeme kuruluşunun işlem süreleri içinde yapılır.",
          "AlpveFit’in hizmeti sunamaması hâlinde, ödenen tutarın **ifa edilmeyen kısmı iade edilir**."]],
        ["Sağlık, egzersiz ve farmakoloji", [
          "Sunulan tüm içerik **eğitim ve bilgilendirme amaçlıdır**; tıbbi tanı, tedavi veya hekim görüşünün yerine geçmez. Üye, programa başlamadan önce **bir hekime danışmakla** ve sağlık durumunu uzmanlara doğru bildirmekle yükümlüdür.",
          "Farmakoloji içeriği **tamamen isteğe bağlıdır**; hiçbir Üye kullanmaya zorlanmaz veya yönlendirilmez. Kullanıp kullanmama, zamanı ve ölçüsü konusundaki karar ile bu kararın sonuçları **Üye’ye aittir**. Bazı maddeler reçeteye tabi veya yasak olabilir; mevzuata uymak Üye’nin sorumluluğundadır.",
          "Yarışmalara katılan Üye, ilgili federasyonların **doping kurallarına** uymakla yükümlüdür.",
          "AlpveFit **hiçbir madde, ilaç veya takviye satmaz**, tedarik etmez ve aracılık etmez."]],
        ["Sorumluluğun sınırı", [
          "AlpveFit **sonuç garantisi vermez**; gelişim ve performans sonuçları kişiden kişiye değişir ve Üye’nin uyumuna bağlıdır.",
          "Kanunun izin verdiği ölçüde ve kasıt veya ağır kusur bulunmadıkça; programın Üye tarafından değiştirilmesinden, eksik veya yanlış bilgi verilmesinden ya da hekim önerisine aykırı davranılmasından doğan zararlardan AlpveFit sorumlu tutulamaz. Toplam sorumluluk, **ilgili siparişte ödenen tutarla** sınırlıdır.",
          "Bu hüküm, tüketici mevzuatının emredici olarak tanıdığı hakları ortadan kaldırmaz."]],
        ["Fikri mülkiyet ve kullanım kuralları", [
          "Planlar, içerikler ve site tasarımı AlpveFit’e veya uzmanlarına aittir. Programlar **yalnızca kişisel kullanım** içindir; çoğaltılamaz, paylaşılamaz, satılamaz veya yayınlanamaz.",
          "Siteye yetkisiz erişim, güvenlik önlemlerini aşma ve otomatik veri çekme yasaktır."]],
        ["Kişisel veriler", [
          "Kişisel veriler, KVKK Aydınlatma Metni ile Gizlilik ve Çerez Politikası’nda açıklandığı şekilde işlenir. Saklama süresi **180 gündür**; yasal olarak daha uzun saklanması gereken mali kayıtlar hariçtir."]],
        ["Değişiklikler ve uyuşmazlıklar", [
          "AlpveFit bu şartları ve fiyatları **gelecekteki siparişler için** değiştirebilir; mevcut siparişin fiyatı ve kapsamı değişmez.",
          "Bu sözleşmeye **Türk hukuku** uygulanır. Uyuşmazlıklarda, parasal sınırlar dâhilinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir."]],
      ] },
      en: { title: "Terms of Service and Distance Sales Agreement", sections: [
        ["Parties and scope", [
          "This agreement is made between the person who purchases a service through alpvefit.com (**“Member”**) and **AlpveFit**. By registering or buying a package you accept these terms.",
          "AlpveFit is a **remote education and coaching** platform. No physical products are sold or shipped; the service is delivered digitally only.",
          "Contact: **" + MAIL + "**"]],
        ["Scope of the service", [
          "The Remote Education System consists of three packages: **Starter Package** (12 or 24 weeks), **Advanced Program** (16 or 24 weeks, pharmacology support included) and **Competitor Package** (12 weeks, pharmacology support included). The Advanced Program and Competitor Package also include a **blood test review**: the test results shared by the Member are reviewed by the expert to plan and track the program; this review does not replace a medical assessment or diagnosis. Current prices and durations are shown on the Packages page.",
          "After your payment is confirmed, your nutrition, training and supplement programs are prepared by our authorised experts **within 24 hours at the latest** and published in your panel. Plans are visible **only in your own account**.",
          "Programs are prepared individually. The details you share in your profile (height, weight, occupation, daily steps, etc.) are used by experts only to prepare your program; sharing them is optional."]],
        ["Membership and account security", [
          "The Member declares to be **at least 18 years old** and to provide accurate, up-to-date information. The Member is responsible for keeping credentials and two-step verification codes confidential; transferring or sharing an account is prohibited.",
          "AlpveFit may temporarily restrict or suspend an account where there is reasonable suspicion of misuse."]],
        ["Price and payment", [
          "Prices are list prices in **Turkish lira (TRY)**. Payment is taken by **credit / debit card** through a virtual POS (payment institution). Card details are not transmitted to AlpveFit servers and are **not stored by AlpveFit**.",
          "The payment window is **2 hours** after the order is created; once it expires the order becomes void. During the testing phase payment may be made through a fake (trial) virtual POS; no real charge is made at this stage.",
          "If the payment cannot be taken — for example because the bank declines the card or 3D Secure is not completed — the order is deemed unpaid and plan preparation does not start."]],
        ["Right of withdrawal and refunds", [
          "The service is prepared individually and **performance starts immediately after payment confirmation**. Under Law No. 6502 and the Distance Contracts Regulation, **the right of withdrawal does not apply** to such services; by confirming the order the Member acknowledges having been informed of this.",
          "Written cancellation requests sent to " + MAIL + " before preparation of the first plan has started will be considered. Approved refunds are made to the card used, within the processing times of the payment institution.",
          "If AlpveFit is unable to provide the service, **the unperformed part of the amount paid is refunded**."]],
        ["Health, exercise and pharmacology", [
          "All content is **for education and information only** and does not replace medical diagnosis, treatment or a physician’s opinion. The Member must **consult a physician** before starting and inform the experts accurately about their health.",
          "Pharmacology content is **entirely optional**; no Member is forced or steered to use it. The decision on whether, when and to what extent to use it, and its consequences, **belong to the Member**. Some substances may require a prescription or be prohibited; complying with the law is the Member’s responsibility.",
          "A Member who competes must follow the **anti-doping rules** of the relevant federations.",
          "AlpveFit **does not sell, supply or broker any substance, drug or supplement**."]],
        ["Limitation of liability", [
          "AlpveFit **gives no guarantee of results**; development and performance vary between individuals and depend on the Member’s compliance.",
          "To the extent permitted by law and unless there is intent or gross negligence, AlpveFit is not liable for damage arising from the Member changing the program, giving incomplete or wrong information or acting against a physician’s advice. Total liability is limited to **the amount paid for the relevant order**.",
          "This clause does not remove rights granted by mandatory consumer legislation."]],
        ["Intellectual property and acceptable use", [
          "Plans, content and the site design belong to AlpveFit or its experts. Programs are for **personal use only** and may not be copied, shared, sold or published.",
          "Unauthorised access, circumventing security measures and automated scraping are prohibited."]],
        ["Personal data", [
          "Personal data is processed as described in the KVKK Notice and the Privacy and Cookie Policy. The retention period is **180 days**, except financial records that must be kept longer by law."]],
        ["Changes and disputes", [
          "AlpveFit may change these terms and prices **for future orders**; the price and scope of an existing order do not change.",
          "**Turkish law** applies. Within the monetary limits, Consumer Arbitration Committees and Consumer Courts have jurisdiction."]],
      ] },
    },

    "kvkk": {
      tr: { title: "KVKK Aydınlatma Metni ve Açık Rıza", sections: [
        ["Veri sorumlusu", [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu (**“KVKK”**) uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla **AlpveFit** (alpvefit.com) tarafından aşağıda açıklanan kapsamda işlenir. İletişim: **" + MAIL + "**"]],
        ["İşlenen veriler", [
          "• **Kimlik ve iletişim:** ad soyad, kullanıcı adı, e-posta adresi.",
          "• **Hesap ve güvenlik:** şifre özeti (şifreniz düz metin saklanmaz), şifreli iki aşamalı doğrulama bilgileri, giriş kayıtları (IP adresi, cihaz bilgisi, zaman).",
          "• **İşlem:** sipariş, paket, tutar ve ödeme kuruluşundaki işlem referansı. **Kart numarası ve güvenlik kodu işlenmez.**",
          "• **Destek:** canlı destek ve destek talebi yazışmaları.",
          "• **Sağlık ve koçluk bilgileri (özel nitelikli veri):** boy, kilo, doğum yılı, kan grubu, günlük adım sayısı, hedef, sağlık notları ve size hazırlanan planlar. Bu bilgileri paylaşmak **isteğe bağlıdır**."]],
        ["İşleme amaçları ve hukuki sebepler", [
          "• Üyelik, hesap güvenliği ve hizmetin sunulması — **sözleşmenin ifası** (m.5/2-c) ve **meşru menfaat** (m.5/2-f).",
          "• Sipariş, ödeme ve mali yükümlülükler — **hukuki yükümlülük** (m.5/2-ç).",
          "• Kişiye özel program için sağlık ve koçluk bilgilerinin işlenmesi — **açık rızanız** (m.6/2). Rızanızı dilediğiniz zaman geri alabilirsiniz.",
          "• Kötüye kullanımın önlenmesi ve bilgi güvenliği — **meşru menfaat**."]],
        ["Verilerin aktarılması", [
          "Verileriniz yalnızca hizmetin gerektirdiği ölçüde; size atanan uzmanlara ve yetkili yöneticilere, barındırma, e-posta ve güvenlik (reCAPTCHA) hizmet sağlayıcılarına ve kanunen yetkili kamu kurumlarına aktarılabilir. Yurt dışındaki sağlayıcılara aktarım **KVKK m.9** kapsamında yapılır.",
          "Sağlık bilgileriniz ve planlarınız **başka üyelere gösterilmez**. Verileriniz **satılmaz ve reklam amacıyla kullanılmaz**."]],
        ["Saklama süresi", [
          "Giriş kayıtları, bildirimler, destek yazışmaları ve süresi dolmuş siparişler **180 gün** sonra silinir. Ödenmiş sipariş kayıtları mali mevzuatın öngördüğü süre boyunca saklanır. Hesabınızı sildiğinizde profil ve plan verileriniz silinir."]],
        ["Haklarınız (KVKK m.11)", [
          "Verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme, aktarıldığı kişileri bilme, itiraz etme ve zararın giderilmesini isteme haklarına sahipsiniz.",
          "Başvurularınızı **" + MAIL + "** adresine iletebilirsiniz; en geç **30 gün** içinde yanıtlanır."]],
        ["Açık rıza", [
          "Sağlık ve koçluk bilgilerinizi kaydederken, bu bilgilerin yukarıdaki amaçla ve belirtilen kişilerce işlenmesine **açık rıza** verdiğinizi ayrıca onaylarsınız. Rıza vermemeniz hâlinde hizmetin diğer bölümlerinden yararlanmaya devam edebilirsiniz."]],
      ] },
      en: { title: "KVKK Notice and Explicit Consent", sections: [
        ["Data controller", [
          "Under Turkish Personal Data Protection Law No. 6698 (**“KVKK”**), your personal data is processed by **AlpveFit** (alpvefit.com) as data controller within the scope below. Contact: **" + MAIL + "**"]],
        ["Data processed", [
          "• **Identity and contact:** full name, username, e-mail address.",
          "• **Account and security:** password hash (never stored in plain text), encrypted two-step verification data, login records (IP address, device, time).",
          "• **Transaction:** order, package, amount and the payment institution’s transaction reference. **Card number and security code are not processed.**",
          "• **Support:** live support and support ticket conversations.",
          "• **Health and coaching information (special category data):** height, weight, year of birth, blood type, daily steps, goal, health notes and the plans prepared for you. Sharing this information is **optional**."]],
        ["Purposes and legal bases", [
          "• Membership, account security and delivering the service — **performance of a contract** (Art. 5/2-c) and **legitimate interest** (Art. 5/2-f).",
          "• Orders, payments and financial obligations — **legal obligation** (Art. 5/2-ç).",
          "• Processing health and coaching information for a personalised program — **your explicit consent** (Art. 6/2). You can withdraw it at any time.",
          "• Preventing abuse and information security — **legitimate interest**."]],
        ["Transfers", [
          "Your data may be shared only as far as the service requires with the experts assigned to you and authorised administrators, hosting, e-mail and security (reCAPTCHA) providers, and competent public authorities. Transfers to providers abroad are made under **KVKK Art. 9**.",
          "Your health information and plans are **never shown to other members**. Your data is **not sold or used for advertising**."]],
        ["Retention", [
          "Login records, notifications, support conversations and expired orders are deleted after **180 days**. Paid order records are kept for the period required by financial legislation. When you delete your account, your profile and plan data are deleted."]],
        ["Your rights (KVKK Art. 11)", [
          "You may learn whether your data is processed, request information, correction or deletion, know the recipients, object and claim compensation.",
          "Send requests to **" + MAIL + "**; they are answered within **30 days** at most."]],
        ["Explicit consent", [
          "When you save health and coaching information you separately confirm your **explicit consent** to its processing for the purposes and by the persons stated above. Without consent you can keep using the other parts of the service."]],
      ] },
    },

    "gizlilik-cerez": {
      tr: { title: "Gizlilik ve Çerez Politikası", sections: [
        ["Genel", [
          "Gizliliğiniz bizim için önceliklidir. Kişisel verilerinizin nasıl işlendiği **KVKK Aydınlatma Metni**’nde ayrıntılı olarak açıklanmıştır. Verileriniz **satılmaz**, reklam veya profilleme amacıyla kullanılmaz."]],
        ["Çerezler", [
          "Yalnızca **zorunlu çerezler** kullanılır: oturumunuzu açık tutan **avf_session** ve istek sahteciliğine karşı koruyan **avf_csrf**. Reklam, analiz veya izleme çerezi **kullanılmaz**. Dil ve çerez bildirimi tercihiniz tarayıcınızın yerel depolamasında tutulur.",
          "Yazı tipleri AlpveFit sunucularından yüklenir; bu amaçla üçüncü taraf bir hizmete istek gönderilmez.",
          "Kayıt ve giriş sırasında kötüye kullanımı önlemek için **Google reCAPTCHA** kullanılır; Google bu kapsamda cihaz ve tarayıcı bilgisi işleyebilir."]],
        ["Güvenlik", [
          "Şifreler **tek yönlü özetlenerek** saklanır; iki aşamalı doğrulama etkinleştirilebilir ve uzman ile yönetici hesaplarında **zorunludur**. Plan ve profil bilgilerinize yalnızca siz ve size atanan yetkili kişiler erişebilir."]],
        ["Saklama", [
          "Giriş kayıtları, bildirimler, destek yazışmaları ve süresi dolmuş siparişler **180 gün** sonra silinir."]],
        ["İletişim", [
          "Gizlilikle ilgili sorularınız için: **" + MAIL + "**"]],
      ] },
      en: { title: "Privacy and Cookie Policy", sections: [
        ["General", [
          "Your privacy is our priority. How your personal data is processed is explained in detail in the **KVKK Notice**. Your data is **not sold** or used for advertising or profiling."]],
        ["Cookies", [
          "Only **strictly necessary cookies** are used: **avf_session**, which keeps you signed in, and **avf_csrf**, which protects against request forgery. **No** advertising, analytics or tracking cookies are used. Your language and cookie-notice preferences are kept in your browser’s local storage.",
          "Fonts are served from AlpveFit’s own servers; no request is sent to a third-party service for this.",
          "**Google reCAPTCHA** is used during registration and sign-in to prevent abuse; Google may process device and browser information for this purpose."]],
        ["Security", [
          "Passwords are stored as **one-way hashes**; two-step verification can be enabled and is **mandatory** for expert and administrator accounts. Only you and the authorised persons assigned to you can access your plan and profile information."]],
        ["Retention", [
          "Login records, notifications, support conversations and expired orders are deleted after **180 days**."]],
        ["Contact", [
          "For privacy questions: **" + MAIL + "**"]],
      ] },
    },
  };

  AVF.LEGAL_LINKS = [["kvkk", "KVKK Aydınlatma Metni"], ["kullanim-kosullari", "Hizmet Şartları ve Mesafeli Satış Sözleşmesi"], ["gizlilik-cerez", "Gizlilik ve Çerez Politikası"]];
  var ALIAS = { "sorumluluk-reddi": "kullanim-kosullari" };   // kaldırılan belge: sağlık hükümleri Hizmet Şartları’na taşındı
  AVF.legalDoc = function (slug) { slug = ALIAS[slug] || slug; return DOCS[slug] ? (DOCS[slug][AVF.lang] || DOCS[slug].tr) : null; };
  var ICONS = { kvkk: "shield", "kullanim-kosullari": "file", "gizlilik-cerez": "lock" };

  // Belge sayfası: metin zaten seçili dilde olduğundan çeviri gözleyicisi atlanır (data-notr).
  AVF.legalPage = function (view, slug) {
    var d = AVF.legalDoc(slug);
    if (!d) return false;
    slug = ALIAS[slug] || slug;
    document.title = d.title + " — AlpveFit";
    function body(lines) {
      var out = [], ul = null;
      lines.forEach(function (t) {
        if (t.indexOf("• ") === 0) { if (!ul) { ul = h("ul"); out.push(ul); } ul.appendChild(AVF.rich("li", t.slice(2))); }
        else { ul = null; out.push(AVF.rich("p", t)); }
      });
      return out;
    }
    AVF.mount(view,
      h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("span", { class: "eyebrow" }, AVF.icon("scale"), "Yasal"), h("h1", { text: d.title, "data-notr": "" }))),
      h("div", { class: "wrap section" }, h("article", { class: "card legal", "data-notr": "" },
        h("div", { class: "legal-head" }, h("span", { class: "tile" }, AVF.icon(ICONS[slug] || "file")), h("b", { text: d.title })),
        d.sections.map(function (s, i) {
          return h("section", null, h("h2", {}, h("span", { class: "num", text: String(i + 1).padStart(2, "0") }), h("span", { text: s[0] })), body(s[1]));
        }))));
    return true;
  };
})();
