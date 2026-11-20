// Beslenme rehberleri: sabit ve yoruma kapalı ekip yazıları.
export const BESLENME = [
  {
    key: "beslenme-protein-nedir", icon: "egg", rev: 2, category: "beslenme", locked: true, tags: ["protein", "kas-kazanimi", "makro", "baslangic"],
    gifs: ["chicken breast cooking", "protein shake gym"],
    title: "Protein Nedir? Ne kadar, ne zaman, hangi kaynaktan?",
    body: `## Protein: kasın tuğlası, ama tek başına duvar örmez
Protein, amino asitlerden oluşan bir besin ögesidir. Antrenman kası "hasarlar", protein onarım malzemesini sağlar. **Gram başına 4 kcal** enerji verir.

[gif=1]

[gorsel=makro-kalori|Üç makronun gram başına enerjisi: protein ve karbonhidrat 4 kcal, yağ 9 kcal]

## [ikon=target] Günde ne kadar?
Direnç antrenmanı yapan sağlıklı yetişkinlerde kas kazanımı için faydanın büyük kısmı **kilogram başına yaklaşık 1,6 g** civarında toplanır; üst güven sınırı **2,2 g/kg**'a kadar uzanır [kaynak=28698222|Morton 2018]. ISSN de **1,4–2,0 g/kg/gün** aralığını önerir [kaynak=28642676|Jäger 2017].

[tablo]
Durum | Pratik hedef (g/kg/gün)
Genel sağlık, antrenman yok | 0,8–1,0
Düzenli direnç antrenmanı | 1,6–2,2
Kalori açığında (kesim) | 2,0–2,4 (kas korumak için üst uç)
[/tablo]

[kutu=ipucu]
Kesim döneminde protein ihtiyacı yükselir: kalori açığında yağsız kütleyi korumak için **yağsız kütlenin kg'ı başına 2,3–3,1 g** önerilmiştir [kaynak=24864135|Helms 2014].
[/kutu]

## [ikon=clock] Öğün başına ne kadar? "30 gramdan fazlası boşa gider" efsanesi
Öğün başına yaklaşık **0,4 g/kg** protein, günü **en az 4 öğüne** bölerek almak pratik bir hedef [kaynak=29497353|Schoenfeld ve Aragon 2018]. Peki tek öğünde 100 g yersen? 2023'te yapılan bir çalışma, antrenman sonrası **100 g** proteinin kas yapımını 25 g'dan **daha uzun süre ve daha fazla** desteklediğini gösterdi [kaynak=38118410|Trommelen 2023]. Yani "fazlası çöpe gider" doğru değil; sadece daha yavaş kullanılır.

[gif=2]

## [ikon=egg] Kaynaklar
- **Hayvansal:** tavuk, hindi, balık, yumurta, yoğurt, süzme peynir, kırmızı et. Tüm temel amino asitleri içerir, lösin oranı yüksektir.
- **Bitkisel:** mercimek, nohut, fasulye, soya, tofu, tempeh. Çeşitlendirildiğinde yeterlidir; biraz daha fazla toplam protein hedeflemek mantıklı.
- **Toz protein:** pratik bir **yiyecek**tir, sihir değildir. Günlük hedefini yemekle tutturuyorsan şart değil.

[kutu=bilim]
Protein takviyesinin kas kazanımına katkısı gerçek ama ölçülüdür; asıl farkı **antrenman** yaratır. Meta-analizde takviye, antrenmanla birlikte yağsız kütle artışını ortalama ~0,3 kg ek olarak artırdı [kaynak=28698222|Morton 2018].
[/kutu]

[kutu=uyari]
Böbrek hastalığı olanlar yüksek proteinli beslenmeye geçmeden önce mutlaka hekimine danışmalı.
[/kutu]

[kutu=mizah]
"Tavuk-pilav-brokoli" üçlüsünden sıkıldıysan yalnız değilsin. Baharat yasak değil, inan bana. 🌶️
[/kutu]

## Kısaca
- **1,6–2,2 g/kg/gün**, kesimde üst uca yakın.
- Günü 3–5 öğüne yay; her öğünde ~0,4 g/kg.
- Antrenman olmadan protein yalnız pahalı bir yemektir. 😄

Aklına takılan mı var? **Beslenme** kategorisinde yeni bir konu aç; topluluk ve ekip burada.`,
  },
  {
    key: "beslenme-karbonhidrat-nedir", icon: "wheat", rev: 2, category: "beslenme", locked: true, tags: ["karbonhidrat", "makro", "kalori", "baslangic"],
    gifs: ["pasta eating happy", "running energy"],
    title: "Karbonhidrat Nedir? Düşman mı, yakıt mı?",
    body: `## Karbonhidrat: antrenmanın benzini
Karbonhidrat vücudun en hızlı kullanılan enerji kaynağıdır. Kas ve karaciğerde **glikojen** olarak depolanır; ağır setlerde ve yüksek tempolu antrenmanda ana yakıttır. Gram başına **4 kcal** verir.

[gif=1]

## [ikon=layers] Türleri
- **Kompleks / yavaş:** yulaf, bulgur, tam tahıllı ekmek, patates, baklagiller. Lif ve mikro besin bakımından zengin.
- **Basit / hızlı:** meyve, bal, pirinç unu, spor içecekleri. Antrenman öncesi ve sonrası pratik.
- **Lif:** sindirilemeyen karbonhidrat; tokluk ve bağırsak sağlığı için kritik (ayrı rehberimize bak).

## [ikon=dumb] Ne kadar?
Sporcularda karbonhidrat ihtiyacı antrenman yüküne göre değişir [kaynak=21660838|Burke 2011]:
[tablo]
Antrenman yükü | Günlük karbonhidrat (g/kg)
Hafif (düşük yoğunluk) | 3–5
Orta (günde ~1 saat) | 5–7
Yüksek (günde 1–3 saat) | 6–10
[/tablo]
Vücut geliştirme için off-season'da genellikle **3–5 g/kg ve üstü**, protein ve yağ ihtiyacı karşılandıktan sonra kalan kalori karbonhidrata verilir [kaynak=31247944|Iraki 2019].

## [ikon=help] "Karbonhidrat şişmanlatır" mı?
Kısa yanıt: **hayır, fazla kalori şişmanlatır.** Kalori eşit tutulduğunda düşük yağlı ve düşük karbonhidratlı diyetler arasında yağ kaybı açısından anlamlı fark bulunmamıştır [kaynak=28193517|Hall ve Guo 2017]. 609 kişilik 12 aylık DIETFITS çalışmasında da iki diyet benzer kilo kaybı sağladı [kaynak=29466592|Gardner 2018].

[gif=2]

[kutu=bilim]
Kontrollü bir metabolizma çalışmasında, eşit kalori açığında **yağ kısıtlaması** karbonhidrat kısıtlamasından biraz daha fazla vücut yağı kaybettirdi [kaynak=26278052|Hall 2015]. Yani "insülin = yağ" denklemi bu kadar basit değil.
[/kutu]

## [ikon=clock] Zamanlama
Gün içindeki toplam miktar, zamanlamadan daha önemlidir. Yine de ağır antrenmandan 1–3 saat önce karbonhidratlı bir öğün performansı destekleyebilir; iki antrenman arası kısa toparlanma varsa antrenman sonrası karbonhidrat glikojeni hızla yeniler [kaynak=28919842|Kerksick 2017].

[kutu=mizah]
Gece 23.00'te yenen pilav, sabah 08.00'de yenenden daha "şişmanlatıcı" değildir. Pilav saati bilmez. 🍚⏰
[/kutu]

## Kısaca
- Karbonhidrat düşman değil; antrenman yakıtıdır.
- Miktarı antrenman yüküne göre ayarla.
- Kaynakların çoğu lifli ve az işlenmiş olsun.`,
  },
  {
    key: "beslenme-yag-nedir", icon: "drop", rev: 2, category: "beslenme", locked: true, tags: ["yag", "makro", "hormon", "saglik"],
    gifs: ["avocado", "olive oil pour"],
    title: "Yağ Nedir? Hormonlar, kalp ve doğru yağ seçimi",
    body: `## Yağ: yoğun enerji, hayati görevler
Yağ, gram başına **9 kcal** ile en yoğun enerji kaynağıdır. Hücre zarlarının yapısında, A-D-E-K vitaminlerinin emiliminde ve **hormon üretiminde** rol oynar.

[gif=1]

## [ikon=layers] Yağ türleri
[tablo]
Tür | Kaynaklar | Not
Tekli doymamış | Zeytinyağı, avokado, fındık, badem | Mutfağın yıldızı
Çoklu doymamış (omega-3) | Somon, sardalya, ceviz, keten tohumu | Haftada 2 porsiyon yağlı balık iyi bir hedef
Çoklu doymamış (omega-6) | Ayçiçek, mısır yağı, tohumlar | Yeterince alıyoruz zaten
Doymuş | Tereyağı, kırmızı et, peynir, hindistan cevizi | Sınırla, sıfırlama
Trans | Margarin, kızartmalar, paketli hamur işleri | Kaçın
[/tablo]

[kutu=bilim]
Doymuş yağ alımını azaltmak, Cochrane derlemesinde kardiyovasküler olay riskinde yaklaşık **%17'lik** azalmayla ilişkilendirildi [kaynak=32428300|Hooper 2020]. Endüstriyel trans yağ ise kalp hastalığı riskini belirgin şekilde artırır [kaynak=16611951|Mozaffarian 2006].
[/kutu]

## [ikon=pulse] Yağı çok kısınca testosteron düşer mi?
Erkeklerde yapılan müdahale çalışmalarının meta-analizi, **düşük yağlı diyetlerin** serbest ve total testosteronu ortalama olarak hafifçe düşürdüğünü gösterdi [kaynak=33741447|Whittaker ve Wu 2021]. Bu yüzden yağı sıfıra yakın çekmek iyi fikir değil.

[gif=2]

## [ikon=target] Ne kadar?
- Pratik alt sınır: günlük kalorinin **%20–30**'u ya da **~0,5–1,0 g/kg**.
- Kesimde kalori düşerken yağı %15–20'nin altına uzun süre indirme.
- Yağ yoğundur: bir yemek kaşığı zeytinyağı ~120 kcal. Göz kararı dökme, tart.

[kutu=mizah]
"Sağlıklı yağ" dendi diye bir kavanoz fıstık ezmesini kaşıkla bitirmek hâlâ ~5.000 kcal. Sağlıklı, ama kalori de. 🥜😅
[/kutu]

## Kısaca
- Yağ şart; hormonlar ve vitaminler ona muhtaç.
- Tercih: zeytinyağı, kuruyemiş, yağlı balık. Trans yağdan kaç.
- Kalori yoğun olduğu için ölç-tart.`,
  },
  {
    key: "beslenme-lif-nedir", icon: "leaf", rev: 2, category: "beslenme", locked: true, tags: ["lif", "karbonhidrat", "saglik"],
    gifs: ["broccoli dance"],
    title: "Lif Nedir ve Günde Ne Kadar Almalıyız?",
    body: `## Lif: sindirilmeyen ama çok iş yapan karbonhidrat
Lif, bitkisel besinlerde bulunan ve ince bağırsakta sindirilemeyen karbonhidrattır. Kalın bağırsaktaki bakterilerin besinidir, tokluk verir, kan şekeri dalgalanmalarını yumuşatır.

[gif=1]

## [ikon=layers] İki türü var
- **Çözünür lif:** yulaf (beta-glukan), baklagiller, elma, keten tohumu. Kolesterol ve kan şekeri dostu.
- **Çözünmez lif:** tam tahıllar, kepek, sebze kabukları. Bağırsak hareketlerini düzenler.

## [ikon=target] Ne kadar?
Lancet'te yayımlanan büyük derlemede, günde **25–29 g** lif alanlarda tüm nedenlere bağlı ölüm, koroner kalp hastalığı, inme, tip 2 diyabet ve kolorektal kanser riski, en az alanlara göre **%15–30 daha düşüktü**; daha fazlası ek fayda sağlayabiliyordu [kaynak=30638909|Reynolds 2019].

[tablo]
Besin | Porsiyon | Lif (yaklaşık)
Mercimek (pişmiş) | 1 su bardağı | 15 g
Nohut (pişmiş) | 1 su bardağı | 12 g
Yulaf | 50 g | 5 g
Armut (kabuklu) | 1 orta | 5–6 g
Brokoli | 1 su bardağı | 5 g
Tam buğday ekmeği | 2 dilim | 4 g
Chia tohumu | 1 yemek kaşığı | 4 g
[/tablo]

[kutu=ipucu]
Lifi bir anda 10 g'dan 35 g'a çıkarırsan bağırsakların sana küser (gaz, şişkinlik). **Her hafta 5 g artır** ve **suyu da artır.**
[/kutu]

## [ikon=dumb] Sporcu için neden önemli?
- Kesimde **tokluk** sağlar; açlıkla savaşın en sessiz kahramanıdır.
- Mikrobiyota ve genel sağlık için temel.
- Not: Antrenmandan hemen önce çok lifli öğün midede ağırlık yapabilir; lifi gün içine yay.

[kutu=mizah]
Lif alımını artırdığın ilk hafta tuvalet sıran sana "abone" olabilir. Sabır, vücudun alışır. 🚽😄
[/kutu]

## Kısaca
- Hedef: **en az 25–30 g/gün.**
- Baklagil, sebze, meyve, tam tahıl.
- Yavaş artır, bol su iç.`,
  },
  {
    key: "beslenme-makro-hesaplama", icon: "calc", rev: 2, category: "beslenme", locked: true, tags: ["makro", "kalori", "protein", "yag", "karbonhidrat"],
    gifs: ["calculator math"],
    title: "Makro Nasıl Hesaplanır? (İçinde hesaplayıcı var)",
    body: `## 4 adımda makro hesabı
Makro = **protein, karbonhidrat ve yağ.** Önce günlük kaloriyi bilmen gerekir (bkz. TDEE rehberi), sonra kaloriyi bu üçüne dağıtırsın.

[gif=1]

## [ikon=list] Adım adım
1. **Kaloriyi belirle.** TDEE'ni hesapla; hedefe göre ayarla (kesim −%10–20, bakım ±0, bulk +%5–10).
2. **Proteini koy.** 1,6–2,2 g/kg (kesimde üst uç) [kaynak=28698222|Morton 2018].
3. **Yağı koy.** ~0,6–1,0 g/kg ya da kalorinin %20–30'u.
4. **Kalan kaloriyi karbonhidrata ver.** (Kalan kcal ÷ 4)

[gorsel=makro-kalori|Hesabın anahtarı: protein 4, karbonhidrat 4, yağ 9 kcal/g]

## [ikon=calc] Örnek
80 kg, bakım kalorisi 2.600 kcal, hedef hafif bulk (+%5 ≈ 2.730 kcal):
[tablo]
Makro | Hesap | Sonuç
Protein | 80 × 2,0 g = 160 g | 640 kcal
Yağ | 80 × 0,9 g = 72 g | 648 kcal
Karbonhidrat | (2.730 − 640 − 648) ÷ 4 | ≈ 360 g
[/tablo]

## [ikon=bolt] Kendi makrolarını hesapla
Aşağıdaki hesaplayıcıya günlük kalorini yaz, dağılımı seç. Değerlerin hiçbir yere gönderilmez.

[arac=makro]

[kutu=ipucu]
Hazır dağılımlar (%30/40/30 gibi) başlangıç için iyidir; ama en doğrusu yukarıdaki gibi **proteini ve yağı kiloya göre** koyup kalanı karbonhidrata vermektir. Vücut geliştiriciler için bu yaklaşım literatürde önerilir [kaynak=31247944|Iraki 2019].
[/kutu]

[kutu=uyari]
Makrolar bir **başlangıç noktası**dır. 2–3 hafta kilonu ve ölçülerini takip et; değişmiyorsa kaloriyi 100–200 kcal oynat.
[/kutu]

[kutu=mizah]
Makrolarını tutturmak için gece yarısı 40 g yağ eksiğini tek kaşık fıstık ezmesiyle kapatan herkese selam olsun. 🫡
[/kutu]`,
  },
  {
    key: "beslenme-tdee-hesaplama", icon: "flame", rev: 2, category: "beslenme", locked: true, tags: ["tdee", "kalori", "yag-yakimi", "kas-kazanimi"],
    gifs: ["fire burning calories"],
    title: "TDEE Nasıl Hesaplanır? Günlük kalori harcamanı öğren (hesaplayıcı içinde)",
    body: `## TDEE nedir?
**TDEE (Total Daily Energy Expenditure)** = bir günde harcadığın toplam enerji. Kilonu korumak için bu kadar kalori almalısın; altına inersen kilo verirsin, üstüne çıkarsan alırsın.

[gif=1]

[gorsel=tdee-bilesen|TDEE'nin dört bileşeni: bazal metabolizma, günlük hareket, antrenman ve sindirim]

## [ikon=layers] Dört bileşen
[tablo]
Bileşen | Payı (yaklaşık) | Açıklama
BMR (bazal metabolizma) | %60–70 | Yatarken bile harcanan enerji
NEAT (günlük hareket) | %15–30 | Yürüme, ayakta durma, kıpırdanma
EAT (egzersiz) | %5–10 | Antrenman
TEF (sindirim) | ~%10 | Yemeği sindirmenin maliyeti; proteinde en yüksek
[/tablo]

## [ikon=calc] Hesap: Mifflin-St Jeor
Sağlıklı yetişkinlerde BMR tahmininde en tutarlı denklemlerden biri **Mifflin-St Jeor**'dur [kaynak=2305711|Mifflin 1990] [kaynak=15883556|Frankenfield 2005]:
- **Erkek:** 10 × kilo + 6,25 × boy − 5 × yaş + 5
- **Kadın:** 10 × kilo + 6,25 × boy − 5 × yaş − 161

Sonra BMR'yi aktivite çarpanıyla çarparsın: hareketsiz 1,2 · hafif 1,375 · orta 1,55 · çok aktif 1,725 · ekstra 1,9.

## [ikon=bolt] Kendi TDEE'ni hesapla
[arac=tdee]

[kutu=uyari]
Bu sonuç bir **tahmindir.** Denklemlerin bireysel hata payı ±%10'a ulaşabilir. Gerçek TDEE'ni bulmanın en iyi yolu: 2–3 hafta aynı kaloriyi ye, sabah aç karnına tartıl, haftalık ortalamaya bak.
[/kutu]

## [ikon=target] Hedefe göre ayar
[tablo]
Hedef | Kalori | Haftalık değişim hedefi
Yağ yakımı | TDEE − %10–20 | Vücut ağırlığının %0,5–1'i
Bakım | TDEE | ±0
Kas kazanımı | TDEE + %5–10 | Ayda vücut ağırlığının ~%0,5–1'i
[/tablo]
Doğal sporcularda kesim için haftada **%0,5–1** kilo kaybı, kas kaybını sınırlamak için önerilir [kaynak=24864135|Helms 2014].

[kutu=mizah]
Spor saatin "bugün 900 kcal yaktın" diyorsa, bunu "450" diye oku. Akıllı saatler cömerttir. ⌚😅
[/kutu]`,
  },
  {
    key: "beslenme-gercek-mi-sirayla-tuketme", icon: "help", rev: 2, category: "beslenme", locked: true, tags: ["efsane", "karbonhidrat", "arastirma", "saglik"],
    gifs: ["mind blown"],
    title: "Gerçek mi? Gıdaları sırasıyla tüketmek (önce sebze, sonra karbonhidrat)",
    body: `## İddia: "Önce salata ve proteini ye, ekmeği en sona bırak; kan şekerin daha az yükselir."
**Kararımız: KISMEN GERÇEK ✅** — etkisi ölçülmüş, ama asıl önemli olan yine ne ve ne kadar yediğin.

[gif=1]

## [ikon=microscope] Araştırma ne diyor?
Tip 2 diyabetli bireylerde yapılan bir çalışmada, **aynı öğün** iki farklı sırayla yendi. Önce sebze ve protein, en son karbonhidrat yenildiğinde yemek sonrası kan şekeri, karbonhidratın önce yenildiği güne göre **30. dakikada ~%29, 60. dakikada ~%37 daha düşüktü**; insülin de daha düşük seyretti [kaynak=26106234|Shukla 2015].

[kutu=bilim]
Muhtemel mekanizma: lif, protein ve yağ mide boşalmasını yavaşlatır ve bağırsak hormonlarını (ör. GLP-1) uyarır; karbonhidrat sonra geldiğinde kana daha yavaş karışır.
[/kutu]

## [ikon=help] Peki bu sana ne kazandırır?
- **Diyabet / insülin direnci** varsa: basit, ücretsiz ve denemeye değer bir alışkanlık (hekiminle konuş).
- **Sağlıklı sporcuysan:** kan şekeri tepesi biraz yumuşar, tokluk artabilir. Ama **yağ kaybı veya kas kazanımı** üzerinde tek başına belirleyici bir etkisi gösterilmedi. Belirleyici olan toplam kalori ve proteindir [kaynak=28193517|Hall ve Guo 2017].

[tablo]
Soru | Yanıt
Kan şekeri tepesini düşürür mü? | Evet, çalışmalarda gösterildi
Kilo verdirir mi? | Tek başına kanıtı zayıf
Zararı var mı? | Yok; uygulaması kolay
Antrenman öncesi öğünde? | Hızlı enerji istiyorsan karbonhidratı öne almak daha mantıklı olabilir
[/tablo]

[kutu=ipucu]
Pratik uygulama: tabağına önce salata/sebze, sonra tavuk/balık/yumurta, en son pilav/ekmek. Bonus: sona geldiğinde çoğu zaman daha az ekmek yersin. 😉
[/kutu]

[kutu=mizah]
Annenin "önce yemeğini ye, sonra tatlı" kuralı bilimsel çıktı. Anneler kazandı, yine. 👩‍🍳🏆
[/kutu]`,
  },
  {
    key: "beslenme-gercek-mi-protein-karbonhidrat", icon: "scale", rev: 2, category: "beslenme", locked: true, tags: ["efsane", "protein", "karbonhidrat", "kas-kazanimi"],
    gifs: ["versus fight"],
    title: "Gerçek mi? Protein vs Karbonhidrat — kas için hangisi, kilo için hangisi?",
    body: `## Üç popüler iddia, üç net yanıt
[gif=1]

## 1) "Antrenman sonrası proteinin yanına karbonhidrat şart; insülin kası büyütür."
**Kararımız: EFSANE ❌ (yeterli protein alıyorsan)**
Antrenman sonrası **25 g protein** alındığında, buna **50 g karbonhidrat** eklemek kas protein sentezini ya da yıkımını ek olarak iyileştirmedi [kaynak=21131864|Staples 2011]. Karbonhidrat yine değerli: glikojeni yeniler ve sonraki antrenmanın performansını destekler [kaynak=28919842|Kerksick 2017]. Ama kas yapımının "anahtarı" değil.

## 2) "Kilo vermek için karbonhidratı kes, proteini artır."
**Kararımız: YARI GERÇEK ⚖️**
- **Proteini artırmak:** kesimde kas korumaya ve tokluğa gerçekten yardım eder [kaynak=24864135|Helms 2014]. ✅
- **Karbonhidratı kesmek:** kalori eşit olduğunda düşük karbonhidratlı diyetin yağ kaybında üstünlüğü gösterilmedi [kaynak=29466592|Gardner 2018] [kaynak=26278052|Hall 2015]. Karbonhidratı kesince kilo hızlı düşüyorsa, bunun büyük kısmı ilk haftalardaki **su ve glikojen** kaybıdır. 💧

## 3) "Protein tozu kas yapar, yemekten üstündür."
**Kararımız: EFSANE ❌**
Protein tozu, gıda proteiniyle aynı amino asitlerden oluşur. Fark **pratiklik**tir. Kas kazanımını belirleyen günlük toplam protein ve antrenmandır [kaynak=28698222|Morton 2018].

[tablo]
Konu | Protein | Karbonhidrat
Kas onarımı ve büyümesi | Ana rol | Destekleyici
Antrenman performansı | Sınırlı | Ana yakıt
Tokluk (kalori başına) | Çok yüksek | Lifliyse yüksek
Kesimde kas koruma | Kritik | Performans için yararlı
Gram başına enerji | 4 kcal | 4 kcal
[/tablo]

[kutu=ozet]
Rakip değiller, takım arkadaşlar. **Protein inşaatı yapar, karbonhidrat işçilerin yemeğini getirir.** Önce proteini sabitle, sonra karbonhidratı antrenman yüküne göre ayarla.
[/kutu]

[kutu=mizah]
"Karbonhidratı kestim, 3 günde 2 kilo verdim!" — Tebrikler, 2 kilo suyu başarıyla buharlaştırdın. Pilavla geri gelirler, haberin olsun. 🍚💧
[/kutu]`,
  },
];
