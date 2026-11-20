// Sağlık rehberleri: sabit ve yoruma kapalı ekip yazıları. Tanı ya da tedavi önerisi içermez; yorum hekimindir.
export const SAGLIK = [
  {
    key: "saglik-kan-tahlili-okuma", icon: "pulse", rev: 1, category: "farmakoloji", locked: true, tags: ["kan-tahlili", "saglik", "karaciger", "kalp", "hormon"],
    gifs: ["blood test lab", "doctor thumbs up"],
    title: "Kan Tahlili Nasıl Okunur? Hormon, karaciğer, böbrek, kalp — sporcunun rehberi",
    body: `## Önce üç altın kural
1. **Referans aralıkları laboratuvara göre değişir.** Raporundaki aralık, o laboratuvarın yöntemine göredir; başka bir yerin tablosuyla karşılaştırma.
2. **Tek değer değil, eğilim önemlidir.** Hafif yüksek tek bir sonuç çoğu zaman tekrar ölçümle netleşir.
3. **Yorum hekiminindir.** Bu rehber raporu **anlamana** ve hekimine doğru soruları sormana yardım eder; tanı koymaz, ilaç önermez.

[gif=1]

## [ikon=list] Tahlilden önce: sporcuya özel hazırlık
Yanlış hazırlık, sağlıklı birini "hasta" gösterebilir.
[tablo]
Yapman gereken | Neden?
Son **48–72 saat** ağır ya da yeni bir antrenman yapma (özellikle bacak, eksantrik çalışma) | Kas hasarı **CK, AST ve ALT**'yi günlerce yükseltebilir; karaciğer sorunu sanılabilir
**8–12 saat** aç kal, yalnız su iç | Glukoz ve trigliserit yemekten etkilenir
Bol su iç, susuz gitme | Susuzluk hemoglobin, hematokrit ve kreatinini yapay olarak yükseltir
Hormon tahlili ise **sabah erken** saatte ver | Testosteron gün içinde düşer; sabah değeri esas alınır
Kullandığın **her şeyi** hekimine yaz: takviye, ilaç, hormon | Kreatin, kreatinini yükseltebilir [kaynak=33557850|Antonio 2021]; yüksek doz biotin bazı hormon ölçümlerini yanıltabilir
[/tablo]

[kutu=uyari]
Hekimine hiçbir şeyi saklama. "Kullandığım bir şey var" demek, yanlış teşhisi ve gereksiz tetkiki önler. Hekimin seni yargılamak için değil, doğru yorumlamak için sorar.
[/kutu]

## [ikon=drop] 1. Tam kan sayımı (hemogram)
[tablo]
Değer | Ne anlatır? | Sporcuda dikkat
Hemoglobin (Hb) | Kanın oksijen taşıma kapasitesi | Düşükse demir, B12 ya da folat eksikliği araştırılır
Hematokrit (Hct) | Kanın ne kadarının alyuvar olduğu | Yüksekliği kanı **koyulaştırır**, pıhtı riskini artırır. Nedenleri arasında susuzluk, sigara, uyku apnesi, yüksek rakım ve androjen kullanımı var [kaynak=24423981|Pope 2014]
Lökosit (WBC) | Bağışıklık hücreleri | Ağır antrenmandan hemen sonra geçici yükselebilir
Trombosit (PLT) | Pıhtılaşma | Çok yüksek ya da düşükse mutlaka hekime
[/tablo]

## [ikon=flask] 2. Karaciğer
[tablo]
Değer | Ne anlatır? | Sporcuda dikkat
ALT | Karaciğer hücresi hasarına daha özgü | Ağır antrenman sonrası da yükselebilir
AST | Karaciğer **ve kas** hasarı | AST ALT'den belirgin yüksek ve **CK** de yüksekse kaynak çoğu zaman kastır
GGT | Safra yolları, alkol, bazı ilaçlar | Antrenmandan etkilenmez; karaciğeri değerlendirmede yol gösterir
ALP | Safra yolları ve kemik | Gençlerde kemik gelişimine bağlı yüksek olabilir
Bilirubin | Safra ve kırmızı hücre yıkımı | Sarılık ve koyu idrarla birlikteyse **beklemeden** hekime
Albümin | Karaciğerin protein yapımı | Uzun süreli düşüklük beslenme ve karaciğer açısından değerlendirilir
[/tablo]

[kutu=bilim]
Ağızdan alınan bazı anabolik steroidler karaciğerde **kolestaz** (safra akışının bozulması) ve enzim yükselmesiyle ilişkilendirilmiştir; tabloda GGT ve bilirubin yükselmesi öne çıkar [kaynak=29521706|Niedfeldt 2018]. Bu yüzden hekim, karaciğer enzimlerini yorumlarken kullandığın her şeyi bilmelidir.
[/kutu]

## [ikon=layers] 3. Böbrek
[tablo]
Değer | Ne anlatır? | Sporcuda dikkat
Kreatinin | Kas yıkım ürünü; böbrek süzme gücünü dolaylı gösterir | **Kas kütlesi fazla** olanlarda ve **kreatin kullananlarda** böbrek sağlıklıyken bile yüksek çıkabilir [kaynak=28615996|Kreider 2017]
eGFR | Kreatininden hesaplanan süzme hızı | Kreatinin yüksekse yapay olarak düşük görünebilir
Sistatin C | Kas kütlesinden pek etkilenmeyen böbrek göstergesi | Kreatinin şüpheliyse hekimin isteyebilir
Üre / BUN | Protein yıkım ürünü | Yüksek proteinli beslenme ve susuzlukta yükselir
İdrarda albümin / protein | Böbrek süzgecindeki hasar | Ağır antrenmandan hemen sonra geçici çıkabilir; tekrarı istenir
[/tablo]

## [ikon=heart] 4. Kalp-damar ve metabolizma
[tablo]
Değer | Ne anlatır? | Sporcuda dikkat
LDL kolesterol | Damar plağının ana yakıtı | Uzun süreli yüksekliği risk; hedef kişiye göre değişir
HDL kolesterol | "İyi" kolesterol | Anabolik steroidlerle belirgin düşebilir [kaynak=15248788|Hartgens ve Kuipers 2004]
Trigliserit | Kandaki yağ | Açlıkta ölçülür; alkol ve fazla şeker yükseltir
Açlık glukozu, HbA1c | Kan şekeri; HbA1c son 2–3 ayın ortalaması | HbA1c %5,7–6,4 prediyabet, %6,5 ve üzeri diyabet aralığıdır
Tansiyon | Kalbin yükü | Evde, dinlenmişken, iki koldan ve birkaç gün ölç; tek ölçüm yetmez
EKG / ekokardiyografi | Ritim ve kalp kası yapısı | Hekim gerekli görürse; uzun süreli steroid kullananlarda kalp kasında güç kaybı ve koroner plak bildirilmiştir [kaynak=28533317|Baggish 2017]
[/tablo]

## [ikon=pulse] 5. Hormonlar
[tablo]
Değer | Ne anlatır?
Total testosteron | Kandaki toplam testosteron (sabah, aç ölç)
Serbest testosteron, SHBG | SHBG testosteronu bağlayan proteindir; serbest değer, kullanılabilir kısmı gösterir
LH, FSH | Beynin (hipofiz) testislere/yumurtalıklara verdiği "üret" sinyali
Estradiol (E2) | Ana östrojen; erkekte de bulunur ve gereklidir
Prolaktin | Hipofiz hormonu; stres, bazı ilaçlar ve hipofiz sorunlarında yükselir
TSH, serbest T4 | Tiroit işlevi; enerji, kilo ve ısı dengesini etkiler
[/tablo]

**Hekimin bu değerleri birlikte okur.** Genel olarak:
- **Düşük testosteron + yüksek LH/FSH:** sorun daha çok testis düzeyinde olabilir.
- **Düşük testosteron + düşük ya da "normal" LH/FSH:** sinyal beyin-hipofiz düzeyinde azalmış olabilir. Dışarıdan alınan androjenler bu sinyali baskılar; bırakıldıktan sonra toparlanma **aylar sürebilir** ya da bazı kişilerde tam düzelmeyebilir [kaynak=25598171|Kanayama 2015] [kaynak=27532478|Rasmussen 2016].
- **Kadınlarda** hormon sonuçları adet döngüsünün gününe göre değişir; tahlil günü hekimle planlanmalı.

[kutu=tehlike]
**Hormon değerlerini "düzeltmek" için kendi başına ilaç kullanma.** Bu ilaçların ciddi yan etkileri vardır; gerekip gerekmediğine ve nasıl kullanılacağına yalnız muayene eden hekim karar verir. Forumda bu konuda doz ya da protokol paylaşılmaz.
[/kutu]

## [ikon=sun] 6. Vitamin ve mineraller
- **25(OH) D vitamini:** Eksiklik çoğu kılavuzda 20 ng/mL'nin altıdır [kaynak=21646368|Holick 2011]; 75 yaş altı sağlıklı yetişkinlerde rutin tarama önerilmez, risk grubundaysan hekimine sor [kaynak=38828931|Demay 2024].
- **B12:** Vegan beslenme, metformin ve mide ilacı kullanımı riski artırır [kaynak=28925645|Langan ve Goodbred 2017].
- **Ferritin ve demir:** Özellikle kadın sporcularda ve dayanıklılık sporcularında önemlidir. Demiri tahlilsiz takviye etme.

## [ikon=alert] Beklemeden başvur: acil belirtiler
[tablo]
Belirti | Olası anlamı
Göğüs ağrısı, nefes darlığı, çarpıntıyla bayılma | Kalp — **112**
Tek taraflı bacak şişliği ve ağrısı | Pıhtı — **112**
Ani konuşma bozukluğu, yüzde kayma, tek tarafta güçsüzlük | İnme — **112**
Çok ağır antrenman sonrası **koyu çay renginde idrar** ve şiddetli kas ağrısı | Kas yıkımı (rabdomiyoliz) — acile
Gözlerde ya da ciltte sararma, koyu idrar | Karaciğer — aynı gün hekime
[/tablo]

## [ikon=calendar] Ne sıklıkla?
- Sağlıklı, ilaç kullanmayan sporcu: hekiminin önerisiyle genellikle **yılda bir** check-up.
- Kronik hastalığın, düzenli ilaç ya da hormon kullanımın varsa veya geçmişte kullandıysan: takip sıklığını **hekimin** belirler.

[kutu=mizah]
Tahlilden bir gün önce "son bir bacak günü" yapanların AST'si, hekiminin kaşlarıyla birlikte yükselir. Bacak günü kaçmaz; tahlili bir gün sonraya alırsın. 🦵📈
[/kutu]

— **AlpveFit Ekibi**`,
  },
];
