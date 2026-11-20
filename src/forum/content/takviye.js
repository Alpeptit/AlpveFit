// Takviye rehberleri (Supplement / Vitamin / Mineral alt kategorileri): sabit, yoruma açık ekip yazıları.
export const TAKVIYE = [
  {
    key: "takviye-supplement-rehberi", rev: 1, category: "supplement", tags: ["arastirma", "kreatin", "kafein", "aminoasit", "efsane"],
    gifs: ["shopping cart supplements", "money flying away"],
    title: "💊 Supplement Rehberi — Hangisi işe yarıyor, hangisi para israfı?",
    body: `## Raflar dolu, kanıt az
Spor takviyesi piyasası "bunu iç, uçarsın" vaadiyle dolu. Uluslararası Olimpiyat Komitesi'nin (IOC) uzlaşı raporu ise net: performansı gerçekten destekleyen takviye **bir avuç**tur [kaynak=29540367|Maughan 2018].

[gif=1]

## [ikon=award] Kanıt karnesi
[tablo]
Takviye | Kanıt | Ne işe yarar? | Not
Kreatin monohidrat | ⭐⭐⭐⭐⭐ | Güç, kısa süreli yüksek şiddet, kas kütlesi | En çok çalışılan takviye
Kafein | ⭐⭐⭐⭐⭐ | Güç, dayanıklılık, odak | 3–6 mg/kg, antrenmandan ~60 dk önce
Beta-alanin | ⭐⭐⭐⭐ | 1–4 dakikalık yüksek şiddetli efor | Karıncalanma zararsızdır
Nitrat (pancar suyu) | ⭐⭐⭐ | Dayanıklılık, verim | Etkisi antrenmanlılık arttıkça azalabilir
Sodyum bikarbonat | ⭐⭐⭐ | Yüksek şiddette asit tamponu | Mide sorunu sık
Protein tozu | ⭐⭐⭐⭐ (yiyecek olarak) | Günlük proteini tamamlamak | Yemeğin yerine geçmez, kolaylıktır
Omega-3 | ⭐⭐⭐ (genel sağlık) | Balık yemeyenler için | Performans etkisi sınırlı
D vitamini | ⭐⭐⭐ (eksiklikte) | Eksikliği gidermek | Vitamin rehberine bak
HMB | ⭐⭐ | Yeni başlayanlarda toparlanma | Antrenmanlılarda etkisi tartışmalı
BCAA | ⭐ | Yeterli protein varsa ek fayda yok | Ayrı yazımıza bak
Glutamin | ⭐ | Sağlıklı sporcuda performans etkisi yok | Para israfı
"Testosteron artırıcı" bitkisel karışımlar | ✖ | Kanıt yok | Kontaminasyon riski var
"Yağ yakıcılar" | ✖ | Etkisi çok küçük | Çoğu yüksek dozda kafein + risk
[/tablo]

## [ikon=bolt] Kısa notlar
- **Kafein:** vücut ağırlığının kg'ı başına **3–6 mg**, antrenmandan yaklaşık 60 dakika önce performansı tutarlı biçimde artırır; daha yüksek miktarlar ek fayda sağlamadan yan etkiyi artırır [kaynak=33388079|Guest 2021]. Uyku kalitesi bozuluyorsa öğleden sonra kes.
- **Beta-alanin:** günde **4–6 g**, bölünmüş dozlarla, en az 2–4 hafta alındığında kas karnozinini artırır ve 1–4 dakikalık eforlarda performansı destekler [kaynak=26175657|Trexler 2015]. Ciltte karıncalanma (parestezi) zararsızdır; dozu bölmek azaltır.
- **HMB:** günde ~3 g; etkisi en çok yeni başlayanlarda ve yoğun yüklenme dönemlerinde görülmüş, antrenmanlı kişilerde sonuçlar karışık [kaynak=23374455|Wilson 2013].
- **Glutamin:** sağlıklı ve iyi beslenen sporcularda performans ya da bağışıklık üzerinde anlamlı bir etkisi gösterilmedi [kaynak=18806122|Gleeson 2008].

[gif=2]

[kutu=tehlike]
**Kontaminasyon gerçek bir risk.** Bazı takviyelerde etikette yazmayan uyarıcılar ya da yasaklı maddeler bulunabildiği bildirilmiştir [kaynak=29540367|Maughan 2018]. Lisanslı sporcuysan yalnız **bağımsız test sertifikalı** (ör. Informed Sport) ürünler kullan. "Doğal" yazması güvenli olduğu anlamına gelmez.
[/kutu]

[kutu=uyari]
Kronik hastalığın, düzenli kullandığın bir ilaç, hamilelik ya da emzirme durumun varsa takviyeye başlamadan önce **hekimine danış.** Kafein; kalp ritim sorunu, yüksek tansiyon ve kaygı bozukluğu olanlarda dikkat ister.
[/kutu]

## [ikon=target] Önce temel, sonra takviye
1. Kalori ve protein doğru mu?
2. Haftada en az 3 gün düzenli antrenman var mı?
3. Uyku 7 saatin üstünde mi?
Bu üçü yerinde değilse, en pahalı takviye bile fark yaratmaz.

[kutu=mizah]
Takviye piramidi: en altta uyku, üstünde yemek, onun üstünde antrenman, en tepede minicik bir kreatin. Piramidi ters çevirirsen yıkılır, ilk fizik dersi. 🔺😄
[/kutu]`,
  },
  {
    key: "takviye-kreatin-yuklemesi", rev: 1, category: "supplement", tags: ["kreatin", "guc", "kas-kazanimi", "arastirma", "efsane"],
    gifs: ["loading bar", "strong man lifting"],
    title: "⚡ Kreatin Yüklemesi — Şart mı? Ne kadar, nasıl, güvenli mi?",
    body: `## Kreatin: en çok araştırılan, en çok yanlış anlaşılan takviye
Kreatin; kaslarda **fosfokreatin** olarak depolanır ve kısa, şiddetli eforlarda (ağır set, sprint) enerjinin hızla yenilenmesine yardım eder. Takviye ile kas kreatin deposu doldurulur; bu da daha fazla tekrar, daha iyi antrenman ve zamanla daha fazla kas demektir [kaynak=28615996|Kreider 2017].

[gif=1]

## [ikon=layers] İki yol, aynı varış noktası
[tablo]
Yöntem | Nasıl? | Depo ne zaman dolar?
Klasik yükleme | Günde **~20 g** (ya da 0,3 g/kg), **4 eşit doza** bölünmüş, **5–7 gün**; sonra günde **3–5 g** | ~1 hafta
Yüklemesiz | Her gün **3–5 g** | ~3–4 hafta
Ara yol | Kiloya göre 0,3 g/kg (ör. 50 kg → 15 g/gün) ya da mide hassasiyetinde **10–15 g/gün**, 2–3 doza bölünmüş, biraz daha uzun süre | 1–2 hafta (doz düştükçe süre uzar)
[/tablo]

Bu bilginin kökü klasik bir çalışma: günde **20 g × 6 gün** kas kreatinini yaklaşık %20 artırdı ve günde 2 g ile korundu; günde **3 g × 28 gün** ise yavaşça **aynı seviyeye** ulaştı [kaynak=8828669|Hultman 1996]. ISSN de 0,3 g/kg/gün × 5–7 gün yüklemeyi, ardından 3–5 g/gün idameyi ya da doğrudan 3–5 g/gün kullanımı tanımlar [kaynak=28615996|Kreider 2017].

[kutu=ozet]
**Yükleme şart değil; sadece hızlandırır.** Acelen yoksa her gün 3–5 g yeterli. Bir yarışmaya ya da teste 1–2 hafta kaldıysa yükleme mantıklı.
[/kutu]

## [ikon=drop] Mide neden bozuluyor?
Sporcularda yapılan bir çalışmada **tek seferde 10 g** alındığında ishal, **5 g'lık iki doza** bölündüğünde olduğundan belirgin şekilde daha sıktı [kaynak=18373286|Ostojic ve Ahmetovic 2008]. Çözüm basit: yüksek miktarları **böl**, yemekle birlikte al, bol su iç.

[gif=2]

## [ikon=help] Sık sorulan efsaneler
Bilimsel literatürdeki yaygın soruların derlendiği incelemeye göre [kaynak=33557850|Antonio 2021]:
- **"Böbreğe zarar verir"** → Sağlıklı bireylerde önerilen miktarlarda böbrek hasarı gösterilmedi. Böbrek hastalığın varsa kullanmadan önce hekimine danış. Kreatin, kan tahlilindeki **kreatinin** değerini hafifçe yükseltebilir; tahlil öncesi doktoruna kreatin kullandığını söyle.
- **"Saç döker"** → Bu iddia tek bir küçük çalışmadaki hormon değişikliğine dayanır; saç dökülmesi ölçülmemiş ve sonuç tekrarlanmamıştır.
- **"Kramp ve susuzluk yapar"** → Kanıt yok.
- **"Steroid gibi bir şey"** → Hayır. Kreatin; et ve balıkta doğal olarak bulunan, vücudun kendisinin de ürettiği bir bileşiktir.
- **"Su tutar, şişirir"** → İlk haftalarda **kas içine** 1–2 kg su çekebilir. Bu bir "şişkinlik" değil, kasın dolgunlaşmasıdır.

## [ikon=check] Hangi kreatin?
**Monohidrat.** En ucuzu, en çok çalışılanı ve etkinliği kanıtlanmış olanı. "Gelişmiş formüller" (HCl, etil ester, sıvı kreatin) monohidrattan daha etkili değil, daha pahalı.

[kutu=uyari]
18 yaş altı, hamile / emziren veya böbrek hastalığı olan kişiler takviyeye başlamadan önce hekimine danışmalı.
[/kutu]

[kutu=mizah]
Kreatinin "ne zaman" alınacağı tartışması forumların en uzun savaşıdır. Kısa yanıt: hatırladığın zaman. Her gün almak, saatinden çok daha önemli. ⏰🤷‍♂️
[/kutu]`,
  },
  {
    key: "takviye-gercek-mi-bcaa-eaa", rev: 1, category: "supplement", tags: ["aminoasit", "efsane", "protein", "arastirma"],
    gifs: ["boxing match"],
    title: "🥊 Gerçek mi? BCAA vs EAA — Renkli tozlar gerçekten kas yapar mı?",
    body: `## Önce terimler
- **EAA (esansiyel amino asitler):** vücudun üretemediği **9 amino asit.** Kas yapmak için hepsi gerekir.
- **BCAA (dallı zincirli amino asitler):** bu 9'un içindeki **3'ü**: lösin, izolösin, valin. Lösin, kas protein sentezini "başlatan" sinyaldir.

[gif=1]

## [ikon=microscope] Araştırma ne diyor?
**BCAA tek başına:** Bir tuğla ustasına sadece 3 çeşit tuğla verip ev yapmasını beklemek gibi. BCAA sinyali verir ama diğer 6 esansiyel amino asit olmadan sentez uzun süremez. Bu nedenle tek başına BCAA'nın kas yapımını en üst düzeye çıkaramayacağı vurgulanmıştır [kaynak=28852372|Wolfe 2017].

İnsan çalışmasında, antrenman sonrası **5,6 g BCAA** kas protein sentezini plaseboya göre **%22** artırdı; ancak bu artış, benzer miktarda BCAA içeren **whey proteinle** görülenin yaklaşık **yarısı** kadardı [kaynak=28638350|Jackman 2017].

[tablo]
Soru | BCAA | EAA | Tam protein (whey, yemek)
Kas protein sentezini başlatır mı? | Evet | Evet | Evet
Sentezi sürdürür mü? | Sınırlı | Evet | Evet
Günlük protein yeterliyse ek fayda? | Gösterilmedi | Gösterilmedi | -
Fiyat / gram protein | Pahalı | Pahalı | En ucuz
[/tablo]

## [ikon=check] Kararımız
- **"BCAA kas yapar":** **EFSANE ❌** Günlük proteinin yeterliyse ek fayda göstermedi.
- **"EAA, BCAA'dan iyidir":** **GERÇEK ✅** Ama asıl soru: neden tam protein almıyorsun?
- **"Aç karnına antrenmanda işe yarar":** **KISMEN ⚖️** Saatlerce aç antrenman yapıyorsan EAA ya da bir ölçek whey daha mantıklı.

[kutu=ozet]
Günlük **1,6–2,2 g/kg** proteini yemekle ve gerekirse whey ile tamamlıyorsan, BCAA ve EAA tozlarına **ihtiyacın yok.** Paranı yemeğe yatır.
[/kutu]

[kutu=mizah]
BCAA'nın en kanıtlanmış faydası: suyuna güzel bir renk ve meyve tadı katması. Mavi ahududu aroması kas yapmıyor, maalesef. 🫐😅
[/kutu]`,
  },
  {
    key: "takviye-vitamin-rehberi", rev: 1, category: "vitamin", tags: ["vitamin", "saglik", "kan-tahlili", "arastirma"],
    gifs: ["fruits vegetables colorful", "sun shining"],
    title: "🍊 Vitamin Rehberi — A'dan K'ya tüm vitaminler (ne işe yarar, nereden alınır, ne zaman takviye?)",
    body: `## Vitaminler: az miktarda, büyük görevler
Vitaminler enerji üretiminden kemik sağlığına kadar yüzlerce tepkimede görev alır. Çoğunu **çeşitli bir beslenmeyle** yeterince alırız. Takviye, **eksiklik** varsa ya da beslenme biçimin (vegan, çok düşük kalori, emilim sorunu) riski artırıyorsa anlam kazanır.

[gif=1]

## [ikon=list] Tüm vitaminler bir bakışta
Değerler, sağlıklı yetişkinler için ABD Ulusal Sağlık Enstitüleri (NIH ODS) günlük referans değerleridir (E: erkek, K: kadın). **Üst sınır**, uzun süreli alımda aşılmaması önerilen miktardır.
[tablo]
Vitamin | Görevi | İyi kaynaklar | Günlük ihtiyaç | Üst sınır
A | Görme, bağışıklık, cilt | Karaciğer, yumurta, havuç, tatlı patates | E 900 / K 700 mcg | 3.000 mcg (hazır A)
D | Kalsiyum emilimi, kemik, kas | Güneş, yağlı balık, yumurta sarısı | 600 IU (70 yaş üstü 800) | 4.000 IU
E | Antioksidan, hücre zarı | Fındık, badem, ayçiçeği, zeytinyağı | 15 mg | 1.000 mg (takviye)
K | Kan pıhtılaşması, kemik | Yeşil yapraklılar, brokoli | E 120 / K 90 mcg | Belirlenmedi
C | Kolajen, bağışıklık, demir emilimi | Biber, kivi, narenciye, maydanoz | E 90 / K 75 mg | 2.000 mg
B1 (tiamin) | Karbonhidrat metabolizması | Tam tahıl, baklagil, et | E 1,2 / K 1,1 mg | Belirlenmedi
B2 (riboflavin) | Enerji üretimi | Süt ürünleri, yumurta, et | E 1,3 / K 1,1 mg | Belirlenmedi
B3 (niasin) | Enerji üretimi | Tavuk, ton balığı, yer fıstığı | E 16 / K 14 mg | 35 mg (takviye)
B5 (pantotenik asit) | Yağ ve enerji metabolizması | Hemen her besinde | 5 mg | Belirlenmedi
B6 | Protein metabolizması | Tavuk, balık, patates, muz | 1,3 mg (50 yaş altı) | 100 mg
B7 (biotin) | Yağ ve şeker metabolizması | Yumurta, kuruyemiş | 30 mcg | Belirlenmedi
B9 (folat) | Hücre bölünmesi, DNA | Yeşil yapraklılar, baklagil | 400 mcg | 1.000 mcg (folik asit)
B12 | Sinir sistemi, kan yapımı | Et, balık, yumurta, süt | 2,4 mcg | Belirlenmedi
[/tablo]

## [ikon=sun] D vitamini: en çok konuşulan
D vitamini eksikliği, çoğu kılavuzda kanda **25(OH)D < 20 ng/mL** olarak tanımlanır [kaynak=21646368|Holick 2011]. 2024 Endocrine Society kılavuzu ise **75 yaş altı sağlıklı yetişkinlerde** referans değerin üzerinde rutin takviyeyi ve rutin tahlili önermez; **75 yaş üstü, hamileler, çocuklar ve prediyabeti olanlar** için takviyeyi önerir [kaynak=38828931|Demay 2024].

[kutu=ipucu]
Kışın az güneş alıyorsan, cildin koyu tenliyse ya da hep kapalı ortamdaysan, **hekiminle konuşup** bir kan tahlili yaptırmak mantıklı. Sonuca göre takviyeye hekimin karar versin.
[/kutu]

## [ikon=leaf] B12: veganların ve bazı ilaçları kullananların dikkatine
B12 neredeyse yalnız hayvansal besinlerde bulunur. **Vegan / vejetaryenler, ileri yaştakiler** ve **metformin ya da mide asidi baskılayıcı (PPI) ilaç** kullananlarda eksiklik riski artar [kaynak=28925645|Langan ve Goodbred 2017]. Vegansan B12 takviyesi **pazarlık konusu değildir.**

[gif=2]

## [ikon=alert] "Fazlası daha iyi" mi? Hayır.
- **Yüksek doz C ve E vitamini** antrenmanın kazandırdığı bazı hücresel uyumları **köreltebilir.** Günde 1.000 mg C + 235 mg E alan dayanıklılık sporcularında mitokondri yapımıyla ilgili sinyaller zayıfladı [kaynak=24492839|Paulsen 2014]. Başka bir çalışmada antioksidan takviyesi egzersizin insülin duyarlılığı üzerindeki olumlu etkisini engelledi [kaynak=19433800|Ristow 2009].
- **Yağda çözünen vitaminler (A, D, E, K)** vücutta birikir; yüksek dozlar zehirlenme yapabilir.
- **Multivitaminler** sağlıklı yetişkinlerde kalp hastalığı ve kanseri önlemede yeterli kanıta sahip değil; **beta-karoten** ve **E vitamini** takviyeleri bu amaçla önerilmiyor [kaynak=35727271|USPSTF 2022].

[kutu=uyari]
Kan sulandırıcı (ör. varfarin) kullanıyorsan K vitamini alımını değiştirmeden önce mutlaka hekimine danış. Takviyeler ilaçlarla etkileşebilir.
[/kutu]

[kutu=mizah]
Vitamin takviyesinin en garantili etkisi: idrarını parlak sarıya boyamak (teşekkürler B2). Pahalı idrar, bedava renk. 🟡😄
[/kutu]

## Kısaca
- Önce tabak: renkli sebze-meyve, yeterli protein, tam tahıl.
- Takviye: **eksiklik** varsa ve tercihen **tahlille.**
- Megadoz yok; antrenman uyumunu bile bozabilir.`,
  },
  {
    key: "takviye-mineral-rehberi", rev: 1, category: "mineral", tags: ["mineral", "saglik", "kan-tahlili", "hormon"],
    gifs: ["sweating workout", "salt shaker"],
    title: "🧂 Mineral Rehberi — Demir, magnezyum, çinko ve diğerleri: kimin neye ihtiyacı var?",
    body: `## Mineraller: kemikten kas kasılmasına
Mineraller kemik yapısı, kas kasılması, sinir iletimi, oksijen taşınması ve hormon üretiminde görev alır. Sporcular terle bir kısmını kaybeder; ama çoğu kişi için çözüm yine **yeterli ve çeşitli beslenme**dir.

[gif=1]

## [ikon=list] Tüm temel mineraller
Değerler, sağlıklı yetişkinler için NIH ODS günlük referans değerleridir (E: erkek, K: kadın).
[tablo]
Mineral | Görevi | İyi kaynaklar | Günlük ihtiyaç | Üst sınır
Kalsiyum | Kemik, kas kasılması | Süt, yoğurt, peynir, sardalya, susam | 1.000 mg (19–50 yaş) | 2.500 mg
Demir | Oksijen taşınması | Kırmızı et, karaciğer, mercimek, ıspanak | E 8 / K 18 mg | 45 mg
Magnezyum | Kas ve sinir işlevi, enerji | Kuruyemiş, tohumlar, tam tahıl, kakao | E 400–420 / K 310–320 mg | 350 mg (yalnız takviye)
Çinko | Bağışıklık, hormonlar, yara iyileşmesi | Kırmızı et, kabak çekirdeği, nohut | E 11 / K 8 mg | 40 mg
Potasyum | Sıvı dengesi, kas kasılması | Patates, muz, baklagil, yoğurt | E 3.400 / K 2.600 mg | Belirlenmedi
Sodyum | Sıvı dengesi, sinir iletimi | Tuz, işlenmiş besinler | 1.500 mg yeterli | 2.300 mg'ın altında kalmak önerilir
Fosfor | Kemik, enerji (ATP) | Et, süt, baklagil | 700 mg | 4.000 mg
Selenyum | Antioksidan enzimler, tiroit | Brezilya cevizi, balık, yumurta | 55 mcg | 400 mcg
İyot | Tiroit hormonları | İyotlu tuz, balık, süt | 150 mcg | 1.100 mcg
Bakır | Demir metabolizması | Kuruyemiş, karaciğer, kakao | 900 mcg | 10 mg
Krom | Şeker metabolizması | Brokoli, tam tahıl | E 35 / K 25 mcg | Belirlenmedi
Manganez | Kemik, metabolizma | Tam tahıl, çay, kuruyemiş | E 2,3 / K 1,8 mg | 11 mg
[/tablo]

## [ikon=drop] Ter, sodyum ve kramp
Uzun ve terletici antrenmanda vücut ağırlığının **%2'sinden fazlasını** sıvı olarak kaybetmek performansı düşürebilir; terle özellikle **sodyum** kaybedilir. Antrenman öncesi ve sonrası tartılmak, ne kadar sıvı kaybettiğini anlamanın pratik yoludur [kaynak=17277604|Sawka 2007].

[kutu=ipucu]
Antrenman sonrası tartıda 1 kg eksiksen, sonraki saatlerde yaklaşık **1,25–1,5 litre** sıvı ile tamamla. Çok uzun (ör. 2 saati aşan) ve terletici seanslarda sıvıya biraz tuz eklemek ya da tuzlu bir atıştırmalık yemek işe yarar.
[/kutu]

## [ikon=female] Demir: özellikle kadın sporcuların konusu
Adet kanaması, vejetaryen beslenme ve yoğun dayanıklılık antrenmanı demir eksikliği riskini artırır. Halsizlik, nefes darlığı ve performans düşüşü belirti olabilir. **Demiri tahlilsiz, kafana göre takviye etme:** fazlası birikir ve zarar verebilir. Hekimin ferritin ve hemoglobin değerlerine bakarak karar versin.

[kutu=bilim]
C vitamini (ör. biber, narenciye) bitkisel demirin emilimini artırır; çay ve kahve ise yemekle birlikte içildiğinde azaltır. Mercimek çorbasına limon sıkmak boşuna değil. 🍋
[/kutu]

## [ikon=pulse] Çinko ve testosteron: "ZMA iç, testosteron fırlasın" mı?
Çinko **eksikliği** testosteronu düşürebilir: çinko kısıtlanan genç erkeklerde testosteron azaldı, **hafif eksikliği olan** yaşlılarda takviye testosteronu artırdı [kaynak=8875519|Prasad 1996]. Ama çinkon **yeterliyse** daha fazlası testosteronu artırmaz. Uzun süre yüksek doz çinko ise bakır eksikliğine yol açabilir.

[gif=2]

## [ikon=moon] Magnezyum
Kuruyemiş, tohum, tam tahıl ve yeşil yapraklılardan zengin beslenen çoğu kişi yeterli magnezyum alır. Takviye kullanacaksan yalnız takviyeden gelen miktar için üst sınır **350 mg**'dır; fazlası ishal yapabilir. Böbrek hastalığında hekim onayı olmadan kullanılmamalı.

[kutu=uyari]
Mineral takviyeleri bazı ilaçların (ör. tiroit ilaçları, bazı antibiyotikler) emilimini azaltabilir. Düzenli ilaç kullanıyorsan takviyeye başlamadan önce **hekimine ya da eczacına danış.**
[/kutu]

[kutu=mizah]
Antrenman sonrası kramp giren baldırın "potasyum eksikliği" diye bağırmıyor; çoğu zaman sadece yorgun. Muz yine de güzel, ye. 🍌
[/kutu]`,
  },
];
