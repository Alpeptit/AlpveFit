// Duyurular: sabit ve yoruma kapalı ekip yazıları (sıra: üstten alta).
export const DUYURULAR = [
  {
    key: "duyuru-forum-kurallari", icon: "shield", rev: 2, category: "duyurular", locked: true, tags: ["duyuru", "baslangic"],
    gifs: ["welcome team high five"],
    title: "Forum Kuralları — önce bunu oku, sonra sahne senin",
    body: `## Hoş geldin, demir kardeşi! 👋
Burası AlpveFit'in üye forumu: antrenman, beslenme, takviye ve gelişim üzerine konuşan, birbirine destek olan insanların yeri. Kurallarımız az ama nettir; herkesin rahat ettiği bir salon gibi düşün.

[gif=1]

## [ikon=shield] Temel kurallar
- [ikon=shield] Forum yalnız **18 yaşından büyük** üyelere açıktır.
- [ikon=smile] **Saygılı ol.** Hakaret, taciz, nefret söylemi, kışkırtma yok. Tartış, ama insanı değil fikri eleştir.
- [ikon=flag] **Siyaset, ideoloji ve din** tartışmaları ile **müstehcen içerik** yasaktır. Burada konu demir ve tabak.
- [ikon=coin] **Satış, kaynak / tedarik, iletişim bilgisi** (telefon, e-posta, mesajlaşma uygulaması) ve **reklam kesinlikle yasaktır.** "Nereden bulurum?" sorusunun yanıtı bu forumda yok, olmayacak.
- [ikon=heart] Paylaşımlar **bilgi amaçlıdır, tıbbi tavsiye değildir.** Sağlıkla ilgili her durumda **hekimine danış.**
- [ikon=eyeoff] Başkasının **kişisel bilgisini** ya da **izinsiz fotoğrafını** paylaşma.
- [ikon=compass] Konunu **doğru kategoride** aç. Konu dışı içerik taşınır; tekrarında ihtar gelir.
- [ikon=alert] Kurala aykırı içerik kaldırılır; tekrarında forumdan **süreli veya kalıcı** uzaklaştırma uygulanır.

[kutu=uyari]
**Farmakoloji bölümü özel kurallara tabidir:** doz, kür, protokol, kaynak ve satış paylaşımı yasaktır. Burada yalnız bilimsel bilgi, riskler ve sağlık kontrolleri konuşulur.
[/kutu]

## [ikon=award] Seviye sistemi kısaca
Forumda yazdıkça, beğeni aldıkça seviyen kendiliğinden yükselir: **Yeni Başlayan → Barın Çırağı → Pump Avcısı → Demir Eri → Hacim Ustası → Sahne Savaşçısı → Demir Efsanesi → Ayna Tanrısı.**
- **Barın Çırağı** olunca bağlantı paylaşabilirsin.
- **Pump Avcısı** olunca özel mesajlaşma ve "çevrimiçi durumumu gizle" seçeneği açılır.
- Haklı bulunan bir şikâyet puanını düşürür; kurallara uymak en hızlı seviye atlama yoludur. 😉

## [ikon=flag] Bir sorun mu gördün?
Mesajın altındaki **⋯ → Şikâyet et** ile moderatörlere bildir. Kim olduğun mesajın yazarına gösterilmez. Kendi başına tartışmaya girme; biz ilgileniriz.

[kutu=mizah]
Tek istisnasız kural: bacak gününü atlayan, "bacak gününü atlıyorum" diye itiraf etmek zorunda. Şaka şaka… ama yine de atlama. 🦵
[/kutu]

İyi antrenmanlar, bol pump! 💪
— **AlpveFit Ekibi**`,
  },
  {
    key: "duyuru-icerik-bilgilendirmesi", icon: "microscope", rev: 2, category: "duyurular", locked: true, tags: ["duyuru", "saglik", "arastirma"],
    gifs: ["science reading glasses"],
    title: "Forum İçerik Bilgilendirmesi — okuduğun bilgiye nasıl bakmalısın?",
    body: `## Bu forum bir bilgi kütüphanesi, bir reçete defteri değil
Rehber yazılarımızı (sabitlenmiş konular) bilimsel kaynaklara dayanarak hazırlıyoruz; her iddianın yanında tıklanabilir bir **PubMed** bağlantısı göreceksin. Üye mesajları ise kişisel deneyimdir: kıymetlidir ama genelleştirilemez.

[gif=1]

## [ikon=book] Kaynak rozetleri ne anlama geliyor?
Yazılarda şu biçimde rozetler göreceksin: [kaynak=28698222|Morton 2018]. Dokununca makalenin PubMed sayfası açılır. Biz bir bilgiyi yazıyorsak, arkasındaki çalışmayı da gösteririz; sen de kendi gözünle kontrol edebilirsin.

[tablo]
Kanıt türü | Ne kadar güvenilir? | Örnek
Meta-analiz / sistematik derleme | ⭐⭐⭐⭐⭐ Çok sayıda çalışmanın birleşimi | Protein takviyesi meta-analizi
Randomize kontrollü çalışma | ⭐⭐⭐⭐ Neden-sonuç ilişkisine en yakın | Kreatin yükleme çalışmaları
Gözlemsel çalışma | ⭐⭐⭐ İlişki gösterir, nedeni kanıtlamaz | Diyet ve hastalık ilişkisi
Hayvan / hücre çalışması | ⭐⭐ Fikir verir, insana birebir uymaz | Birçok peptit araştırması
Kişisel deneyim / forum | ⭐ Değerli ama tek kişilik | "Bende işe yaradı"
[/tablo]

[kutu=bilim]
Bir şeyin **farelerde** işe yaraması, **sende** işe yarayacağı anlamına gelmez. Özellikle peptit ve SARMs konularında insan çalışması çok azdır; bunu yazılarımızda açıkça belirtiriz.
[/kutu]

## [ikon=heart] Tıbbi uyarı
- Buradaki hiçbir içerik tanı, tedavi ya da ilaç önerisi değildir.
- Kronik bir hastalığın, düzenli kullandığın bir ilaç ya da hamilelik / emzirme durumun varsa her değişiklikten önce **hekimine danış.**
- Reçeteli ilaçlar ve hormonlar yalnız hekim kontrolünde kullanılır. Farmakoloji yazılarımız **zarar azaltma ve farkındalık** amaçlıdır; kullanımı teşvik etmez, doz veya kür bilgisi içermez.

## [ikon=flag] Yanlış bir bilgi mi gördün?
Bilim güncellenir, biz de güncelleriz. Rehber yazılarımızda hatalı ya da eskimiş bir bilgi görürsen **Destek Taleplerim** üzerinden kaynağıyla birlikte bize yaz; kontrol edip düzeltiriz.

— **AlpveFit Ekibi**`,
  },
  {
    key: "duyuru-biz-kimiz", icon: "users", rev: 2, category: "duyurular", locked: true, tags: ["duyuru"],
    gifs: ["gym team celebration"],
    title: "Biz Kimiz? — AlpveFit'in arkasındaki ekip ve forumun amacı",
    body: `## Merhaba, biz AlpveFit! 🙌
AlpveFit, kişiye özel **beslenme, antrenman ve takviye programları** hazırlayan bir **uzaktan eğitim ve koçluk** platformudur. Programlarını koçun hazırlar, sen panelinden takip edersin; aklına takılanı da bu forumda toplulukla konuşursun.

[gif=1]

## [ikon=target] Bu forumu neden açtık?
- **Doğru bilgi, anlaşılır dille.** İnternet "bunu iç, 10 kilo kas al" vaatleriyle dolu. Biz kaynaklı, sade ve dürüst bilgi istiyoruz.
- **Yalnız değilsin.** Diyetin üçüncü haftasında moral bozulur, plato gelir, motivasyon düşer. Burada aynı yoldan geçen insanlar var.
- **Deneyim paylaşımı.** Gelişim günlüğünü tut, konu aç, başkasının konusuna yanıt ver. Herkes bir şey bilir, kimse her şeyi bilmez.

## [ikon=shield] Değerlerimiz
[tablo]
Değer | Pratikte ne demek?
Dürüstlük | Bilmediğimizi "bilmiyoruz" diye yazarız; mucize vaat etmeyiz.
Bilim | İddialarımızın arkasında yayımlanmış araştırma vardır.
Güvenlik | Satış, kaynak ve tehlikeli yönlendirme bu forumda yer almaz.
Saygı | Yeni başlayan da yarışmacı da aynı saygıyı hak eder.
[/tablo]

[kutu=ipucu]
Kişiye özel bir program istiyorsan forumda rastgele tavsiye toplamak yerine **Paketler** sayfasına göz at. Forum genel bilgi içindir; senin vücudun, geçmişin ve hedefin için en doğrusu koçunla yapılan plandır.
[/kutu]

## [ikon=users] Ekibe nasıl ulaşırsın?
- Forumla ilgili öneri ve sorunlar: **Destek Taleplerim → Yeni talep**
- Kurallara aykırı içerik: mesajın altındaki **Şikâyet et**

Aramıza hoş geldin. Şimdi git, bir konu aç ya da bir üyenin konusuna yanıt ver! 💪
— **AlpveFit Ekibi**`,
  },
  {
    key: "duyuru-icerik-olusturma-kurallari", icon: "pen", rev: 2, category: "duyurular", locked: true, tags: ["duyuru", "baslangic"],
    gifs: ["typing keyboard fast"],
    title: "İçerik Oluşturma Kuralları — iyi bir konu nasıl açılır?",
    body: `## İyi bir konu = hızlı ve doğru yanıt
"Kilo veremiyorum, ne yapayım?" diye soran konu genelde 3 cevap alır: "kaloriye bak", "sabret", "🙂". Aynı soruyu ayrıntılı soran konu ise gerçekten işe yarayan yanıtlar toplar.

[gif=1]

## [ikon=check] Konu açmadan önce
1. **Ara.** Üstteki arama kutusuna yazmaya başla; sorun büyük ihtimalle konuşulmuştur.
2. **Sabitlenmiş rehberlere bak.** Protein, makro, TDEE, kreatin gibi temel konuların hepsinin kaynaklı rehberi var.
3. **Doğru kategoriyi seç.** Beslenme sorusu **Beslenme**'ye, antrenman sorusu **Antrenman**'a, takviye sorusu **Takviye**'deki ilgili alt kategoriye (Supplement, Vitamin, Mineral), kendi sürecin **Gelişim Günlükleri**'ne. Hiçbirine uymuyorsa **Serbest Kürsü**.
4. **Ekip rehberleri yoruma kapalıdır.** Sabitlenmiş bir rehberle ilgili sorunu, o rehberin kategorisinde yeni bir konu açarak sor; başlığa rehberin adını yazman yeterli.

## [ikon=file] Başlık nasıl yazılır?
[tablo]
❌ Kötü başlık | ✅ İyi başlık
Yardım!!! | Kesimde 3 haftadır kilo değişmiyor, TDEE'yi yanlış mı hesapladım?
Kreatin? | Kreatin yükleme yapmadan 5 g ile başlamak sorun olur mu?
ACİL | Squat sonrası diz arkasında ağrı: teknik mi, yük mü?
[/tablo]

## [ikon=pen] Mesajında neler olsun?
- **Hedefin:** yağ yakımı mı, kas kazanımı mı, güç mü?
- **Bilgilerin (paylaşmak istediğin kadar):** yaş aralığı, kilo, haftalık antrenman sayısı, deneyim süresi.
- **Ne denedin, ne oldu:** "3 haftadır 2.100 kcal, haftada 4 gün antrenman, kilo sabit."
- **Net soru:** sonunda tek cümlelik bir soru sor.

[kutu=uyari]
**Yasak içerik:** satış, kaynak arama, iletişim bilgisi, doz / kür / protokol isteme, başkasının fotoğrafı, siyaset ve müstehcenlik. Bu tür konular uyarısız kaldırılır.
[/kutu]

## [ikon=spark] Biçimlendirme ipuçları
- **kalın**, *italik*, ==vurgu==, ## başlık, - liste, > alıntı kullanabilirsin.
- Yazı araçlarındaki **Ω** düğmesiyle sembol, **ⓘ** ile bilgi kutusu, **tablo** düğmesiyle tablo ekleyebilirsin.
- Bir araştırmaya atıf yapacaksan **kitap** simgesiyle PubMed numarasını ekle; rozet olarak görünür.
- Etiket seçmeyi unutma: doğru etiket = konunu bulan doğru insanlar.

[kutu=mizah]
Gelişim fotoğrafı paylaşacaksan ışık önemli. Yukarıdan gelen spot ışık herkesi 6 pack gösterir; biz de biliyoruz. 😄
[/kutu]

Hadi bakalım, ilk konunu aç! ✍️
— **AlpveFit Ekibi**`,
  },
];
