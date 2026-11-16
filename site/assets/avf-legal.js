/* Alpvefit — hukuki metinler (TR/EN). İçerik düz metindir; textContent ile yazılır. Yayın öncesinde bir avukat tarafından gözden geçirilmelidir. */
(function () {
  "use strict";
  var AVF = window.AVF, h = AVF.h;
  var MAIL = "destek@alpvefit.com", UPDATED = "17.11.2026";

  var DOCS = {
    "kullanim-kosullari": {
      tr: { title: "Hizmet Şartları ve Mesafeli Satış Sözleşmesi", sections: [
        ["1. Taraflar ve kapsam", [
          "Bu sözleşme, alpvefit.com (“Alpvefit”) üzerinden hizmet satın alan kişi (“Üye”) ile Alpvefit arasında kurulur. Siteye üye olarak veya bir paketi satın alarak bu şartları kabul etmiş olursunuz.",
          "Alpvefit; uzaktan eğitim ve koçluk hizmeti sunan bir platformdur. Sitede fiziksel ürün satılmaz, kargo yapılmaz; yalnızca dijital olarak sunulan eğitim ve program hizmeti vardır.",
          "İletişim: " + MAIL]],
        ["2. Hizmetin kapsamı", [
          "Uzaktan Eğitim Sistemi şu paketlerden oluşur: Başlangıç Paketi (12 veya 24 hafta, farmakoloji desteği yoktur), İleri Seviye Program (16 veya 24 hafta, farmakoloji desteği vardır) ve Yarışmacı Paketi (12 hafta, farmakoloji desteği vardır). Güncel fiyatlar ve süreler Paketler sayfasında yer alır.",
          "Ödemenin onaylanmasından sonra beslenme, antrenman ve takviye programlarınız en geç 7 gün içinde yetkili uzmanlarımızca hazırlanır ve hesabınızdaki panelde yayınlanır. Planlar yalnızca sizin hesabınızda görünür.",
          "Yüz yüze eğitim paketi siteden satılmaz; bilgi için " + MAIL + " adresine yazabilirsiniz.",
          "Programlar kişiye özel hazırlanır; hazırlanma süresi Üye’nin sağladığı bilgilerin eksiksizliğine bağlıdır. Üye, profilinde (boy, kilo, meslek, günlük adım sayısı, kan grubu vb.) paylaştığı bilgilerin uzmanlarca programın hazırlanması amacıyla kullanılacağını kabul eder; bu bilgileri paylaşmak isteğe bağlıdır."]],
        ["3. Üyelik ve hesap güvenliği", [
          "Üye, 18 yaşını doldurduğunu, doğru ve güncel bilgi verdiğini beyan eder. Hesap bilgilerinin ve iki aşamalı doğrulama (Authenticator) kodlarının gizliliğinden Üye sorumludur. Hesabın üçüncü kişilere devredilmesi veya paylaşılması yasaktır.",
          "Alpvefit, hesabın kötüye kullanıldığına dair makul şüphe halinde hesabı geçici olarak kısıtlayabilir veya askıya alabilir."]],
        ["4. Fiyat ve ödeme", [
          "Fiyatlar ABD doları cinsinden liste fiyatıdır. Ödeme, kredi / banka kartı ile sanal POS (ödeme kuruluşu) üzerinden alınır. Kart bilgileri Alpvefit sunucularına iletilmez ve Alpvefit tarafından saklanmaz; kart işlemi ödeme kuruluşunun güvenli ödeme sayfasında gerçekleştirilir. Üye, ödeme kuruluşunun kendi şartlarına tabidir.",
          "Ödeme penceresi sipariş oluşturulduktan sonra 2 saattir; süre dolduğunda sipariş geçersiz olur ve yeni sipariş oluşturulması gerekir. Hizmetin test aşamasında ödeme sahte (deneme) sanal POS ile yapılabilir; bu aşamada gerçek tahsilat yapılmaz ve hizmet bedeli talep edilmez.",
          "Kart işleminin banka tarafından reddedilmesi, limit yetersizliği veya 3D Secure doğrulamasının tamamlanmaması gibi nedenlerle ödemenin alınamaması hâlinde sipariş ödenmemiş sayılır ve plan hazırlama süreci başlamaz.",
          "Ödeme başarıyla alındığında sipariş otomatik olarak onaylanır; Alpvefit gerekli gördüğünde ödemeyi elle inceleyebilir."]],
        ["5. Cayma hakkı ve iade", [
          "Hizmet, kişiye özel hazırlanan ve ödemenin onaylanmasından itibaren ifasına başlanan bir hizmettir. 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, tüketicinin onayı ile cayma süresi içinde ifasına başlanan hizmetlerde ve kişisel ihtiyaçlara göre hazırlanan hizmetlerde cayma hakkı kullanılamaz. Üye, siparişi onaylayarak hizmetin ödeme onayından hemen sonra ifasına başlanmasını talep ettiğini ve bu nedenle cayma hakkının bulunmadığı hususunda bilgilendirildiğini kabul eder.",
          "Buna rağmen, ilk plan hazırlanmaya başlanmadan önce iletilen yazılı iptal talepleri (" + MAIL + ") Alpvefit tarafından değerlendirilir. Onaylanan iadeler, ödemenin yapıldığı karta ve ödeme kuruluşunun işlem süreleri dahilinde iade edilir. Hizmetin ifasına başlandıktan sonra iade yapılmaz.",
          "Alpvefit’in hizmeti sunamaması hâlinde Üye’nin ödediği tutarın ifa edilmeyen kısmı iade edilir."]],
        ["6. Sağlık, egzersiz ve farmakoloji", [
          "Sunulan tüm içerik eğitim ve bilgilendirme amaçlıdır; tıbbi tanı, tedavi veya hekim görüşü yerine geçmez. Üye, programa başlamadan önce bir hekime danışmakla yükümlüdür; sağlık durumunu ve kullandığı ilaçları uzmanlara doğru bildirmekle yükümlüdür.",
          "Farmakoloji desteği içeren paketlerde farmakoloji içeriği isteğe bağlıdır; hiçbir Üye farmakolojik bir uygulamayı kullanmaya zorlanmaz, yönlendirilmez veya ikna edilmeye çalışılmaz. Bu içeriğin kullanılıp kullanılmayacağına, ne zaman ve ne ölçüde kullanılacağına yalnızca Üye karar verir ve bunun bütün sonuçlarından kendisi sorumludur. Ayrıntılar “Sağlık ve Farmakoloji Sorumluluk Beyanı”nda yer alır ve bu beyan sözleşmenin ayrılmaz parçasıdır.",
          "Alpvefit herhangi bir madde, ilaç veya takviye satmaz, tedarik etmez, aracılık etmez ve göndermez."]],
        ["7. Sorumluluğun sınırı", [
          "Alpvefit; sonuç garantisi vermez. Fiziksel gelişim, kilo, performans veya yarışma sonuçları kişiden kişiye değişir ve Üye’nin uyumuna, sağlık durumuna ve yaşam tarzına bağlıdır.",
          "Kanunun izin verdiği azami ölçüde; Alpvefit ve uzmanları, kasıt veya ağır kusur bulunmadıkça, Üye’nin programları kendi inisiyatifiyle değiştirmesinden, uzmanlara eksik veya yanlış bilgi vermesinden, hekim önerisine aykırı hareket etmesinden veya programı uygulamamasından doğan zararlardan, dolaylı ve sonuç olarak ortaya çıkan zararlardan sorumlu tutulamaz. Her hâlde Alpvefit’in toplam sorumluluğu, ilgili siparişte ödenen tutarla sınırlıdır.",
          "Bu madde, tüketici mevzuatının ve emredici hükümlerin tanıdığı hakları ortadan kaldırmaz."]],
        ["8. Fikri mülkiyet ve kullanım sınırları", [
          "Planlar, içerikler ve site tasarımı Alpvefit’e veya uzmanlarına aittir. Üye, kendisine hazırlanan programları yalnızca kişisel kullanımı için kullanabilir; çoğaltamaz, paylaşamaz, satamaz veya yayınlayamaz.",
          "Siteye yetkisiz erişim, güvenlik önlemlerini aşma, otomatik veri çekme ve hizmeti aksatacak davranışlar yasaktır."]],
        ["9. Kişisel veriler", [
          "Kişisel veriler KVKK Aydınlatma Metni ve Gizlilik ve Çerez Politikası’nda açıklandığı şekilde işlenir. Veri saklama süresi 180 gündür (yasal olarak daha uzun saklanması gereken mali kayıtlar hariç)."]],
        ["10. Değişiklik, fesih ve uyuşmazlıklar", [
          "Alpvefit, bu şartları ve fiyatları gelecekteki siparişler için değiştirebilir; değişiklikler sitede yayımlandığı tarihte yürürlüğe girer. Yürürlükteki siparişin fiyatı ve kapsamı değişmez.",
          "Bu sözleşmeye Türk hukuku uygulanır. Uyuşmazlıklarda, parasal sınırlar dâhilinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.",
          "Son güncelleme: " + UPDATED]],
      ] },
      en: { title: "Terms of Service and Distance Sales Agreement", sections: [
        ["1. Parties and scope", [
          "This agreement is made between the person who purchases a service through alpvefit.com (“Member”) and Alpvefit. By registering or buying a package you accept these terms.",
          "Alpvefit is a platform providing remote education and coaching. No physical products are sold and nothing is shipped; only digital education and programme services are offered.",
          "Contact: " + MAIL]],
        ["2. Scope of the service", [
          "The Remote Education System consists of: Starter Package (12 or 24 weeks, no pharmacology support), Advanced Programme (16 or 24 weeks, with pharmacology support) and Competitor Package (12 weeks, with pharmacology support). Current prices and durations are shown on the Packages page.",
          "After your payment is confirmed, your nutrition, training and supplement programmes are prepared by our authorised experts within 7 days at the latest and published in your panel. Plans are visible only in your own account.",
          "The in-person education package is not sold on the site; write to " + MAIL + " for information.",
          "Programmes are prepared individually; preparation time depends on the completeness of the information you provide. You agree that the details you share in your profile (height, weight, occupation, daily steps, blood type, etc.) will be used by experts to prepare your programme; sharing them is optional."]],
        ["3. Membership and account security", [
          "The Member declares to be at least 18 years old and to provide accurate and up-to-date information. The Member is responsible for keeping account credentials and two-step verification (Authenticator) codes confidential. Transferring or sharing an account is prohibited.",
          "Alpvefit may temporarily restrict or suspend an account where there is reasonable suspicion of misuse."]],
        ["4. Price and payment", [
          "Prices are list prices in US dollars. Payment is taken by credit / debit card through a virtual POS (payment institution). Card details are not transmitted to or stored by Alpvefit servers; the card transaction is carried out on the payment institution’s secure payment page. The Member is subject to the payment institution’s own terms.",
          "The payment window is 2 hours after the order is created; once it expires the order becomes void and a new order must be created. During the testing phase of the service, payment may be made through a fake (trial) virtual POS; no real charge is made at this stage and no service fee is requested.",
          "If the payment cannot be taken — for example because the bank declines the card, the limit is insufficient or 3D Secure verification is not completed — the order is deemed unpaid and preparation of the plans does not start.",
          "When the payment is successfully received the order is confirmed automatically; Alpvefit may review a payment manually when it deems necessary."]],
        ["5. Right of withdrawal and refunds", [
          "The service is prepared individually and performance starts as soon as the payment is confirmed. Under Law No. 6502 and the Distance Contracts Regulation, the right of withdrawal cannot be exercised for services whose performance has started with the consumer’s approval within the withdrawal period, or for services prepared according to personal needs. By confirming the order, the Member requests that performance begin immediately after payment confirmation and acknowledges having been informed that no right of withdrawal applies.",
          "Nevertheless, written cancellation requests (" + MAIL + ") received before preparation of the first plan has started will be considered by Alpvefit. Approved refunds are made to the card used for payment, within the processing times of the payment institution. No refund is made once performance has started.",
          "If Alpvefit is unable to provide the service, the unperformed part of the amount paid is refunded."]],
        ["6. Health, exercise and pharmacology", [
          "All content is for education and information only and does not replace medical diagnosis, treatment or a physician’s opinion. The Member must consult a physician before starting a programme and must accurately inform the experts about their health condition and any medication.",
          "In packages that include pharmacology support, pharmacology content is optional; no Member is forced, steered or pressured to use any pharmacological practice. Whether, when and to what extent such content is used is decided solely by the Member, who is responsible for all consequences. Details are set out in the “Health and Pharmacology Responsibility Statement”, which forms an integral part of this agreement.",
          "Alpvefit does not sell, supply, broker or ship any substance, drug or supplement."]],
        ["7. Limitation of liability", [
          "Alpvefit gives no guarantee of results. Physical development, weight, performance or competition results vary from person to person and depend on the Member’s compliance, health condition and lifestyle.",
          "To the maximum extent permitted by law, and unless there is intent or gross negligence, Alpvefit and its experts cannot be held liable for damage arising from the Member changing programmes on their own initiative, giving incomplete or wrong information to the experts, acting against a physician’s advice or not following the programme, nor for indirect or consequential damage. In any case Alpvefit’s total liability is limited to the amount paid for the relevant order.",
          "This clause does not remove rights granted by consumer legislation and mandatory provisions."]],
        ["8. Intellectual property and use restrictions", [
          "Plans, content and the site design belong to Alpvefit or its experts. The Member may use the programmes prepared for them for personal use only and may not copy, share, sell or publish them.",
          "Unauthorised access, circumventing security measures, automated scraping and conduct that disrupts the service are prohibited."]],
        ["9. Personal data", [
          "Personal data is processed as described in the KVKK Notice and the Privacy and Cookie Policy. The retention period is 180 days (except financial records that must be kept longer by law)."]],
        ["10. Changes, termination and disputes", [
          "Alpvefit may change these terms and prices for future orders; changes take effect on the date they are published on the site. The price and scope of an existing order do not change.",
          "Turkish law applies to this agreement. Within the monetary limits, Consumer Arbitration Committees and Consumer Courts have jurisdiction over disputes.",
          "Last updated: " + UPDATED]],
      ] },
    },

    "sorumluluk-reddi": {
      tr: { title: "Sağlık ve Farmakoloji Sorumluluk Beyanı", sections: [
        ["1. Amaç", [
          "Bu beyan, Alpvefit’te sunulan beslenme, antrenman, takviye ve farmakoloji içeriklerinin niteliğini ve Üye’nin sorumluluklarını açıklar. Bir paketi satın alarak veya farmakoloji bölümüne erişerek bu beyanı okuduğunuzu ve kabul ettiğinizi onaylarsınız."]],
        ["2. Tıbbi hizmet değildir", [
          "Alpvefit uzmanları eğitmen ve koçtur; sağlık hizmeti sunmaz, hastalık teşhisi koymaz ve tedavi yürütmez. İçerikler tıbbi tavsiye değildir ve hekim muayenesinin yerine geçmez.",
          "Programa başlamadan önce bir hekime danışmanız, kronik hastalık, yaralanma, gebelik, ilaç kullanımı gibi durumlarınızı uzmanlara eksiksiz bildirmeniz gerekir. Programı sürdürürken bir rahatsızlık yaşarsanız uygulamayı durdurup derhâl hekime başvurmalısınız."]],
        ["3. Farmakoloji içeriği isteğe bağlıdır", [
          "Farmakoloji desteği içeren paketlerde bile farmakoloji içeriği zorunlu değildir. Hiçbir Üye farmakolojik uygulamayı kullanmaya zorlanmaz, yönlendirilmez veya ikna edilmeye çalışılmaz; bu bölümü hiç kullanmamak, kısmen kullanmak veya istediğiniz zaman bırakmak tamamen sizin kararınızdır. Farmakoloji içeriğini kullanmamanız, programın beslenme ve antrenman bölümlerini etkilemez.",
          "Farmakoloji bölümünde yalnızca yetkili uzmanların bizzat girdiği bilgiler yer alır; sistem otomatik içerik üretmez."]],
        ["4. Karar ve sorumluluk Üye’ye aittir", [
          "Farmakoloji içeriğinin kullanılıp kullanılmayacağına, kullanılacaksa ne zaman, hangi ölçüde ve hangi denetim altında kullanılacağına yalnızca Üye karar verir. Bu içeriğin kullanımından doğabilecek sağlık, hukuki, sportif ve diğer her türlü sonuç, kanunun izin verdiği ölçüde Üye’nin kendi sorumluluğundadır.",
          "Üye; farmakolojik bir uygulamaya başlamadan önce bir hekime danışacağını, gerekli sağlık kontrollerini yaptıracağını ve hekim denetimi dışında hareket etmesinin riskli olabileceğini bildiğini kabul eder.",
          "Bazı maddelerin kullanımı, bulundurulması veya temini bulunduğunuz ülkede reçeteye tabi veya yasak olabilir. Yürürlükteki mevzuata uymak Üye’nin sorumluluğundadır. Alpvefit hiçbir madde satmaz, tedarik etmez, aracılık etmez ve göndermez."]],
        ["5. Riskler", [
          "Egzersiz ve beslenme değişiklikleri; kas-iskelet yaralanmaları, kalp-damar olayları, hormonal ve metabolik değişiklikler gibi riskler taşıyabilir. Farmakolojik uygulamaların ciddi, kalıcı veya yaşamı tehdit eden yan etkileri olabilir; etkileşimler ve bireysel yanıt tahmin edilemeyebilir.",
          "Bu riskleri anladığınızı, sonuç garantisi verilmediğini ve sonuçların kişiden kişiye değiştiğini kabul edersiniz."]],
        ["6. Sporcular ve yarışmacılar", [
          "Yarışmalara katılan Üye; ilgili federasyon ve organizasyonların doping kurallarını öğrenmekle ve bunlara uymakla yükümlüdür. Doping testi, diskalifiye, yaptırım ve benzeri sonuçlardan Alpvefit sorumlu değildir."]],
        ["7. Beyanlarınız", [
          "• 18 yaşını doldurduğumu, verdiğim sağlık bilgilerinin doğru olduğunu beyan ederim.",
          "• Programı uygulamadan önce hekime danışacağımı kabul ederim.",
          "• Farmakoloji içeriğinin isteğe bağlı olduğunu, bana zorunlu kılınmadığını ve kullanma kararını kendi özgür irademle vereceğimi kabul ederim.",
          "• Bu kararın sonuçlarının kanunun izin verdiği ölçüde bana ait olduğunu kabul ederim.",
          "Son güncelleme: " + UPDATED + " · İletişim: " + MAIL]],
      ] },
      en: { title: "Health and Pharmacology Responsibility Statement", sections: [
        ["1. Purpose", [
          "This statement explains the nature of the nutrition, training, supplement and pharmacology content offered on Alpvefit and the Member’s responsibilities. By buying a package or accessing the pharmacology section you confirm that you have read and accepted it."]],
        ["2. Not a medical service", [
          "Alpvefit experts are instructors and coaches; they do not provide healthcare, diagnose illness or conduct treatment. Content is not medical advice and does not replace a medical examination.",
          "Before starting you should consult a physician and fully inform the experts of any chronic illness, injury, pregnancy, medication, etc. If you feel unwell while following a programme you must stop and seek medical help immediately."]],
        ["3. Pharmacology content is optional", [
          "Even in packages that include pharmacology support, pharmacology content is not mandatory. No Member is forced, steered or pressured to use any pharmacological practice; not using this section at all, using it partially or stopping at any time is entirely your decision. Not using pharmacology content does not affect the nutrition and training parts of your programme.",
          "The pharmacology section contains only information entered personally by authorised experts; the system does not generate content automatically."]],
        ["4. The decision and responsibility belong to the Member", [
          "Only the Member decides whether pharmacology content will be used and, if so, when, to what extent and under what supervision. To the extent permitted by law, all health, legal, sporting and other consequences of using this content are the Member’s own responsibility.",
          "Before starting any pharmacological practice, the Member agrees to consult a physician, to have the necessary health checks and acknowledges that acting without medical supervision may be risky.",
          "Use, possession or supply of some substances may require a prescription or be prohibited in your country. Complying with applicable law is the Member’s responsibility. Alpvefit does not sell, supply, broker or ship any substance."]],
        ["5. Risks", [
          "Exercise and dietary changes carry risks such as musculoskeletal injury, cardiovascular events and hormonal and metabolic changes. Pharmacological practices can have serious, permanent or life-threatening side effects; interactions and individual response may be unpredictable.",
          "You acknowledge that you understand these risks, that no result is guaranteed and that results vary between individuals."]],
        ["6. Athletes and competitors", [
          "A Member who competes is responsible for learning and following the anti-doping rules of the relevant federations and organisers. Alpvefit is not responsible for doping tests, disqualification, sanctions or similar consequences."]],
        ["7. Your declarations", [
          "• I declare that I am at least 18 years old and that the health information I provide is accurate.",
          "• I agree to consult a physician before following the programme.",
          "• I acknowledge that pharmacology content is optional, is not imposed on me, and that I will decide whether to use it of my own free will.",
          "• I accept that, to the extent permitted by law, the consequences of this decision are mine.",
          "Last updated: " + UPDATED + " · Contact: " + MAIL]],
      ] },
    },

    "kvkk": {
      tr: { title: "KVKK Aydınlatma Metni ve Açık Rıza", sections: [
        ["1. Veri sorumlusu", [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla Alpvefit (alpvefit.com) tarafından aşağıda açıklanan kapsamda işlenir. İletişim: " + MAIL]],
        ["2. İşlenen veriler", [
          "• Kimlik ve iletişim: ad soyad, kullanıcı adı, e-posta adresi.",
          "• Hesap ve güvenlik: şifre özeti (şifreniz düz metin saklanmaz), iki aşamalı doğrulama bilgileri (şifreli), giriş kayıtları (IP adresi, cihaz bilgisi, zaman).",
          "• İşlem: sipariş, paket, ödeme tutarı ve ödeme kuruluşundaki işlem referansı. Kart numarası ve güvenlik kodu işlenmez ve saklanmaz.",
          "• Sağlık ve koçluk bilgileri (özel nitelikli kişisel veri): boy, kilo, doğum yılı, kan grubu, günlük adım sayısı, haftalık antrenman günü, hedef, sağlık/sakatlık notları; ayrıca size hazırlanan beslenme, antrenman, takviye ve farmakoloji planları. Bu bilgileri paylaşmak isteğe bağlıdır ve kayıt sırasında istenmez."]],
        ["3. İşleme amaçları ve hukuki sebepler", [
          "• Üyelik oluşturma, hesabın güvenliği ve hizmetin sunulması — sözleşmenin kurulması/ifası (KVKK m.5/2-c) ve meşru menfaat (m.5/2-f).",
          "• Sipariş ve ödeme süreçleri, mali ve hukuki yükümlülükler — hukuki yükümlülük (m.5/2-ç).",
          "• Kişiye özel program hazırlanması için sağlık ve koçluk bilgilerinin işlenmesi — açık rızanız (m.6/2). Bu rıza profil bilgilerinizi kaydederken ayrıca alınır ve istediğiniz zaman geri alabilirsiniz.",
          "• Dolandırıcılık ve kötüye kullanımın önlenmesi, bilgi güvenliği — meşru menfaat."]],
        ["4. Verilerin aktarılması", [
          "Verileriniz; yalnızca hizmetin gereği ölçüde, size atanan uzmanlara ve yetkili yöneticilere; barındırma, e-posta gönderimi ve güvenlik (reCAPTCHA) hizmet sağlayıcılarına; kanunen yetkili kamu kurumlarına aktarılabilir. Hizmet sağlayıcılarımızın sunucuları yurt dışında bulunabilir; bu durumda aktarım KVKK m.9 kapsamında, açık rızanız veya kanunda öngörülen diğer şartlarla yapılır.",
          "Sağlık ve koçluk bilgileriniz ile planlarınız başka üyelere gösterilmez; yalnızca size atanan uzman ve yöneticiler tarafından görülebilir. Verileriniz satılmaz ve reklam amacıyla kullanılmaz."]],
        ["5. Saklama süresi", [
          "Kişisel verileriniz amacın gerektirdiği süre boyunca saklanır. Giriş kayıtları, bildirimler, denetim kayıtları ve süresi dolmuş/iptal siparişler 180 gün sonra silinir. Ödenmiş sipariş ve ödeme kayıtları, mali mevzuatın öngördüğü süre boyunca saklanır. Hesabınızı sildiğinizde profil ve plan verileriniz silinir; yasal saklama yükümlülüğü olan mali kayıtlar kimlik bağlantısı koparılarak tutulur."]],
        ["6. Haklarınız (KVKK m.11)", [
          "Verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı kişileri bilme, düzeltme, silme/yok etme, işlemenin üçüncü kişilere bildirilmesini isteme, otomatik analiz sonucunu itiraz etme ve zararın giderilmesini talep etme haklarına sahipsiniz.",
          "Başvurularınızı " + MAIL + " adresine iletebilirsiniz; en geç 30 gün içinde yanıtlanır. Profil bilgilerinizi panelinizden istediğiniz an silebilir ve açık rızanızı geri alabilirsiniz."]],
        ["7. Açık rıza", [
          "Sağlık ve koçluk bilgilerinizi (profil) kaydederken, bu bilgilerin yukarıda belirtilen amaçla ve belirtilen kişilerce işlenmesine açık rıza verdiğinizi ayrıca onaylarsınız. Rıza vermemeniz hâlinde hizmetin diğer bölümlerinden yararlanmaya devam edebilirsiniz; ancak programınızın kişiselleştirilmesi sınırlı olabilir.",
          "Son güncelleme: " + UPDATED]],
      ] },
      en: { title: "KVKK Notice and Explicit Consent", sections: [
        ["1. Data controller", [
          "Under Turkish Personal Data Protection Law No. 6698 (“KVKK”), your personal data is processed by Alpvefit (alpvefit.com) as data controller within the scope described below. Contact: " + MAIL]],
        ["2. Data processed", [
          "• Identity and contact: full name, username, e-mail address.",
          "• Account and security: password hash (your password is never stored in plain text), two-step verification data (encrypted), login records (IP address, device information, time).",
          "• Transaction: order, package, payment amount and the transaction reference at the payment institution. Card number and security code are not processed or stored.",
          "• Health and coaching information (special category data): height, weight, year of birth, blood type, daily steps, weekly training days, goal, health/injury notes; and the nutrition, training, supplement and pharmacology plans prepared for you. Sharing this information is optional and it is not requested at registration."]],
        ["3. Purposes and legal bases", [
          "• Creating the membership, account security and delivering the service — performance of a contract (KVKK Art. 5/2-c) and legitimate interest (Art. 5/2-f).",
          "• Order and payment processes, financial and legal obligations — legal obligation (Art. 5/2-ç).",
          "• Processing health and coaching information to prepare a personalised programme — your explicit consent (Art. 6/2). This consent is collected separately when you save profile information and you can withdraw it at any time.",
          "• Preventing fraud and abuse, information security — legitimate interest."]],
        ["4. Transfers", [
          "Your data may be shared, only as far as the service requires, with the experts assigned to you and authorised administrators; hosting, e-mail delivery and security (reCAPTCHA) service providers; and competent public authorities. Our providers’ servers may be located abroad; in that case the transfer is made under KVKK Art. 9 with your explicit consent or other conditions provided by law.",
          "Your health and coaching information and plans are not shown to other members; they can only be seen by the experts and administrators assigned to you. Your data is not sold or used for advertising."]],
        ["5. Retention", [
          "Personal data is kept for as long as the purpose requires. Login records, notifications, audit records and expired/cancelled orders are deleted after 180 days. Paid orders and payment records are kept for the period required by financial legislation. When you delete your account, your profile and plan data are deleted; financial records subject to a legal retention duty are kept with the link to your identity removed."]],
        ["6. Your rights (KVKK Art. 11)", [
          "You may learn whether your data is processed, request information, learn whether it is used for its purpose, know the recipients, request correction, deletion/destruction, request notification to third parties, object to results of automated analysis and claim compensation for damage.",
          "Send requests to " + MAIL + "; they are answered within 30 days at most. You can delete your profile information and withdraw your explicit consent at any time from your panel."]],
        ["7. Explicit consent", [
          "When you save health and coaching information (profile) you separately confirm that you give explicit consent to its processing for the purposes and by the persons stated above. If you do not consent you can keep using the other parts of the service, but personalisation of your programme may be limited.",
          "Last updated: " + UPDATED]],
      ] },
    },

    "gizlilik-cerez": {
      tr: { title: "Gizlilik ve Çerez Politikası", sections: [
        ["1. Genel", [
          "Gizliliğinize önem veriyoruz. Kişisel verilerinizin nasıl işlendiği KVKK Aydınlatma Metni’nde ayrıntılı olarak açıklanmıştır. Verileriniz satılmaz, reklam veya profilleme amacıyla kullanılmaz."]],
        ["2. Çerezler", [
          "Yalnızca zorunlu çerezler kullanılır: oturumunuzu açık tutan avf_session ve istek sahteciliğine karşı koruyan avf_csrf. Reklam, analiz veya izleme çerezi kullanılmaz. Dil ve çerez bildirimi tercihiniz tarayıcınızın yerel depolamasında tutulur.",
          "Kayıt ve giriş sırasında kötüye kullanımı engellemek için Google reCAPTCHA kullanılır; Google bu kapsamda cihaz/tarayıcı bilgisi işleyebilir ve kendi gizlilik koşullarına tabidir."]],
        ["3. Güvenlik", [
          "Şifreler tek yönlü özetlenerek saklanır; iki aşamalı doğrulama etkinleştirilebilir. Uzman ve yönetici hesapları için iki aşamalı doğrulama zorunludur. Plan ve profil bilgilerinize yalnızca siz ve size atanan yetkili kişiler erişebilir."]],
        ["4. Saklama", [
          "Giriş kayıtları, bildirimler ve süresi dolmuş siparişler 180 gün sonra silinir. Ayrıntılar KVKK Aydınlatma Metni’ndedir."]],
        ["5. İletişim", [MAIL + " · Son güncelleme: " + UPDATED]],
      ] },
      en: { title: "Privacy and Cookie Policy", sections: [
        ["1. General", [
          "We care about your privacy. How your personal data is processed is explained in detail in the KVKK Notice. Your data is not sold or used for advertising or profiling."]],
        ["2. Cookies", [
          "Only strictly necessary cookies are used: avf_session, which keeps you signed in, and avf_csrf, which protects against request forgery. No advertising, analytics or tracking cookies are used. Your language and cookie-notice preferences are kept in your browser’s local storage.",
          "Google reCAPTCHA is used during registration and sign-in to prevent abuse; Google may process device/browser information for this purpose and is subject to its own privacy terms."]],
        ["3. Security", [
          "Passwords are stored as one-way hashes; two-step verification can be enabled. Two-step verification is mandatory for expert and administrator accounts. Only you and the authorised persons assigned to you can access your plan and profile information."]],
        ["4. Retention", [
          "Login records, notifications and expired orders are deleted after 180 days. Details are in the KVKK Notice."]],
        ["5. Contact", [MAIL + " · Last updated: " + UPDATED]],
      ] },
    },
  };

  AVF.LEGAL_LINKS = [["kvkk", "KVKK Aydınlatma Metni"], ["kullanim-kosullari", "Hizmet Şartları ve Mesafeli Satış Sözleşmesi"], ["sorumluluk-reddi", "Sağlık ve Farmakoloji Sorumluluk Beyanı"], ["gizlilik-cerez", "Gizlilik ve Çerez Politikası"]];
  AVF.legalDoc = function (slug) { return DOCS[slug] ? (DOCS[slug][AVF.lang] || DOCS[slug].tr) : null; };

  // Belge sayfası: metin zaten seçili dilde olduğundan çeviri gözleyicisi atlanır (data-notr).
  AVF.legalPage = function (view, slug) {
    var d = AVF.legalDoc(slug);
    if (!d) return false;
    document.title = d.title + " — Alpvefit";
    AVF.mount(view,
      h("section", { class: "hero pagehero" }, h("div", { class: "wrap" }, h("div", { class: "eyebrow" }, "Yasal"), h("h1", { text: d.title, "data-notr": "" }))),
      h("div", { class: "wrap section" }, h("article", { class: "card legal", "data-notr": "" }, d.sections.map(function (s) {
        return h("section", null, h("h2", { text: s[0] }), s[1].map(function (t) { return h("p", { text: t }); }));
      })), h("div", { class: "legal-links" }, AVF.LEGAL_LINKS.map(function (l) { return h("a", { href: "/yasal/" + l[0], "data-link": "", class: slug === l[0] ? "on" : "" }, l[1]); }))));
    return true;
  };
})();
