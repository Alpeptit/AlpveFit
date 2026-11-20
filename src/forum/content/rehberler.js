// Ek rehberler (onaylı liste): uyku, ağrı ve sakatlık, kadın sporcu, alkol ve sigara, yeni başlayan programı, kardiyo,
// kesim ve bulk yönetimi, yarışma hazırlığının riskleri. Sabit ve yoruma kapalı ekip yazıları.
export const REHBERLER = [
  {
    key: "rehber-uyku-toparlanma", icon: "moon", rev: 1, category: "antrenman", locked: true, tags: ["uyku", "toparlanma", "kas-kazanimi", "arastirma"],
    gifs: ["sleeping cat", "alarm clock snooze"],
    title: "Uyku ve Toparlanma — Kas salonda yıkılır, yatakta yapılır",
    body: `## Antrenman uyarandır, gelişim toparlanmada olur
Salonda kası zorlarsın; onarım ve büyüme ise **dinlenirken** olur. Uyku bu sürecin en ucuz, en güçlü aracı.

[gif=1]

## [ikon=moon] Ne kadar uyku?
Amerikan Uyku Tıbbı Akademisi, yetişkinlerin düzenli olarak gecede **en az 7 saat** uyumasını önerir [kaynak=25979105|Watson 2015]. Yoğun antrenman yapanlar için 8 saate yaklaşmak mantıklı bir hedef.

## [ikon=microscope] Araştırmalar ne gösteriyor?
- **Tek gecelik uykusuzluk**, ertesi gün yemek sonrası kas protein sentezini yaklaşık **%18** düşürdü; kortizol arttı, testosteron azaldı [kaynak=33400856|Lamon 2021].
- Üniversite basketbolcularında uykuyu uzatmak (yatakta ~10 saat) **sprint süresini ve şut isabetini** iyileştirdi [kaynak=21731144|Mah 2011].
- Uyku eksikliğinin hormonal dengeyi bozarak kas onarımını zorlaştırabileceği öne sürülmüştür [kaynak=21550729|Dattilo 2011].

[gif=2]

## [ikon=check] Uyku hijyeni: 8 pratik adım
1. Her gün **aynı saatte** yat ve kalk (hafta sonu da).
2. Yatak odası **serin, karanlık ve sessiz** olsun.
3. Kafeini öğleden sonra (yatmadan ~8 saat önce) kes.
4. Yatmadan 1 saat önce ekran ışığını azalt.
5. Ağır yemeği yatmadan 2–3 saat önce bitir.
6. Alkol uykuyu böler; "uyutur" sanılır ama derin uykuyu bozar.
7. Gün içinde gün ışığı al, hareket et.
8. 20 dakikada uyuyamıyorsan kalk, loş ışıkta sakin bir şey yap, sonra tekrar dene.

## [ikon=refresh] Deload: planlı hafif hafta
4–8 haftada bir, setleri ya da ağırlıkları yaklaşık yarıya indirdiğin **hafif bir hafta** eklemek yorgunluğu atmana yardım eder. Bunu bir "geri adım" olarak değil, sonraki atılım için hazırlık olarak düşün.

[kutu=uyari]
**Aşırı yüklenme işaretleri:** haftalarca süren performans düşüşü, dinlenme nabzında belirgin artış, sürekli yorgunluk, uyku bozukluğu, sık hastalanma, motivasyon kaybı. Bunlar varsa yükü azalt; düzelmiyorsa hekime görün. Horlama ve gün içi uyuklama **uyku apnesi** belirtisi olabilir, hekime danış.
[/kutu]

[kutu=mizah]
"Uyuyunca kas yapılıyorsa ben neden hâlâ zayıfım?" — Çünkü önce salona gitmek gerekiyor. Sıralama önemli. 😴💪
[/kutu]

— **AlpveFit Ekibi**`,
  },
  {
    key: "rehber-agri-sakatlik", icon: "shield", rev: 1, category: "antrenman", locked: true, tags: ["toparlanma", "teknik", "saglik"],
    gifs: ["ouch pain funny", "stretching warm up"],
    title: "Ağrı mı, Sakatlık mı? Ne zaman dinlenmeli, ne zaman hekime gitmeli",
    body: `## Her ağrı aynı değildir
Antrenmandan 1–2 gün sonra kaslarda hissedilen yaygın, "tatlı" sızı ile bir eklemde aniden başlayan keskin ağrı çok farklı şeylerdir.

[gif=1]

## [ikon=layers] Gecikmiş kas ağrısı (DOMS) mı, sakatlık mı?
[tablo]
Özellik | Kas ağrısı (DOMS) | Sakatlık şüphesi
Başlangıç | 12–24 saat sonra; zirvesi 24–72 saat | Antrenman sırasında, aniden
His | Yaygın, kasın tamamında, gerginlik | Keskin, noktasal, batıcı
Hareketle | Isındıkça azalır | Hareketle artar, belli açıda kesilir
Eklem | Etkilenmez | Şişlik, kilitlenme, boşalma hissi olabilir
Süre | 3–5 günde geçer | Bir haftayı aşar ya da kötüleşir
[/tablo]
Gecikmiş kas ağrısı genellikle **24–72 saatte** zirve yapar ve kendiliğinden geçer; yeni ya da eksantrik ağırlıklı egzersizler daha fazla ağrı yapar [kaynak=12617692|Cheung 2003].

## [ikon=alert] Beklemeden hekime ya da fizyoterapiste
- Antrenman sırasında **"pat" diye bir ses** ve ardından ani ağrı, güç kaybı
- Eklemde **belirgin şişlik**, morarma, şekil bozukluğu
- Uyuşma, karıncalanma, kola ya da bacağa **yayılan** ağrı
- Geceleri uyutmayan, dinlenmeyle geçmeyen ağrı
- 1–2 haftada düzelmeyen ya da kötüleşen ağrı
- Ağır antrenman sonrası **koyu çay renginde idrar** ve şiddetli kas ağrısı: **acile**

[gif=2]

## [ikon=shield] Sakatlığı önlemek
- **Kuvvet antrenmanı sakatlığı önler.** Randomize çalışmaların meta-analizinde kuvvet antrenmanı, spor sakatlıklarını **üçte birin altına** indirdi [kaynak=24100287|Lauersen 2014].
- **Isınma:** 5–10 dakika hafif kardiyo + çalışacağın hareketin hafif ağırlıkla 2–3 ısınma seti.
- **Kademeli artış:** Haftalık yükü bir anda büyük oranda artırma.
- **Teknik önce gelir:** Formun bozuluyorsa set bitmiştir.
- **Toparlanma:** Uyku ve yeterli kalori sakatlık riskini azaltır.

[kutu=ipucu]
Hafif bir zorlanmada tamamen hareketsiz kalmak yerine, ağrı yapmayan hareketlerle çalışmaya devam etmek çoğu zaman toparlanmayı hızlandırır. Ağrılı bölgeyi zorlamadan diğer bölgeleri çalıştır; emin değilsen fizyoterapiste danış.
[/kutu]

[kutu=mizah]
"Ağrı yoksa kazanç yok" sözü yarı doğru. Kas ağrısı normal; diz ağrısı ise salondan değil, hekimden yanıt bekler. 🦵🩺
[/kutu]

— **AlpveFit Ekibi**`,
  },
  {
    key: "rehber-kadin-sporcu", icon: "female", rev: 1, category: "antrenman", locked: true, tags: ["kadin", "saglik", "program", "mineral"],
    gifs: ["woman lifting weights", "strong woman"],
    title: "Kadın Sporcu Rehberi — Adet döngüsü, demir, hamilelik ve ağırlık antrenmanı",
    body: `## Ağırlık kaldırmak kadını "iri" yapmaz, güçlü yapar
Kadınlarda testosteron düzeyi doğal olarak erkeklerden çok daha düşüktür; bu yüzden ağırlık antrenmanı "aşırı iri" bir görünüm yaratmaz. Sonuç daha **sıkı, güçlü ve dirençli** bir vücut, daha sağlam kemikler ve daha iyi metabolik sağlıktır.

[gif=1]

## [ikon=calendar] Adet döngüsüne göre antrenman şart mı?
Sistematik derleme ve meta-analiz, döngünün erken (folliküler) evresinde performansın **çok küçük ve kişiden kişiye değişen** bir düşüş gösterebileceğini buldu; genel bir "döngüye göre programla" önerisi yapmak için kanıt yetersiz [kaynak=32661839|McNulty 2020].
- **Pratik öneri:** Döngünü ve nasıl hissettiğini 2–3 ay kaydet. Kendinde belirgin bir desen görürsen, o günlerde yükü hafifçe azaltmak mantıklı.
- Ağrılı günlerde hafif hareket çoğu zaman iyi gelir.

[kutu=uyari]
**Adetin düzensizleştiyse ya da kesildiyse** bunu "antrenmanın yan etkisi" sayma. Yetersiz enerji alımı (çok düşük kalori + yüksek antrenman) adet düzenini bozabilir ve kemik sağlığını tehdit eder. **Hekime görün.**
[/kutu]

## [ikon=drop] Demir: kadın sporcunun gizli düşmanı
Adet kanaması, vejetaryen beslenme ve dayanıklılık antrenmanı demir eksikliği riskini artırır. Halsizlik, nefes darlığı ve performans düşüşü belirti olabilir. **Ferritin ve hemoglobin** tahlili hekiminle konuşulmalı; demiri tahlilsiz takviye etme (Mineral Rehberi'ne bak).

[gif=2]

## [ikon=heart] Hamilelikte egzersiz
Kanada kılavuzu, **sağlık açısından engeli olmayan** hamilelerin haftada en az **150 dakika orta yoğunlukta** fiziksel aktivite yapmasını önerir; aktivite hamilelik boyunca birçok komplikasyon riskini azaltmakla ilişkilidir [kaynak=30337460|Mottola 2018].
- Başlamadan ya da devam etmeden önce **mutlaka hekimine danış.**
- Karın üstüne düşme ya da darbe riski olan sporlardan kaçın.
- Baş dönmesi, kanama, göğüs ağrısı, sıvı gelmesi gibi durumlarda egzersizi bırak, hekime başvur.

## [ikon=check] Kadınlar için hızlı ipuçları
- Protein ihtiyacın da **1,6–2,2 g/kg** civarında; "kadınlar daha az protein almalı" diye bir kural yok.
- Alt vücut kadar **üst vücudu** da çalış; omuz ve sırt duruşu destekler.
- Pelvik taban sorunların (öksürünce idrar kaçırma gibi) varsa ağır kaldırışlardan önce bir fizyoterapiste görün.

[kutu=mizah]
Squat'ta erkek arkadaşını geçtiğin gün, salonun resmî olmayan bayramıdır. Kutla! 🏋️‍♀️🎉
[/kutu]

— **AlpveFit Ekibi**`,
  },
  {
    key: "rehber-alkol-sigara", icon: "alert", rev: 1, category: "beslenme", locked: true, tags: ["saglik", "toparlanma", "kas-kazanimi", "arastirma"],
    gifs: ["beer cheers", "no smoking"],
    title: "Alkol, Sigara ve Performans — Bir kadeh neye mal olur?",
    body: `## Alkol: kalorisi var, faydası yok
Alkol gram başına **7 kcal** verir ve vücut onu öncelikle yakar; bu sırada yağ yakımı yavaşlar. Kalorisinin yanında uyku kalitesini ve toparlanmayı da bozar.

[gif=1]

## [ikon=microscope] Antrenman sonrası alkol
Antrenmandan sonra yüksek miktarda alkol (vücut ağırlığının kg'ı başına ~1,5 g; birçok kişi için bir gecelik ağır içme) alındığında, **protein ile birlikte alınsa bile** kas protein sentezi yaklaşık **%24** düştü; protein yerine yalnız karbonhidratla birlikte alındığında düşüş **%37** oldu [kaynak=24533082|Parr 2014].

[tablo]
İçki | Yaklaşık kalori
Bira (500 mL, %5) | ~215 kcal
Şarap (150 mL kadeh) | ~125 kcal
Rakı (50 mL tek) | ~120 kcal + meze
Kokteyl | 200–400 kcal (şuruplarla)
[/tablo]

## [ikon=check] İçeceksen zararı azalt
- Antrenman günü değil, **dinlenme günü** tercih et.
- Önce **protein ve yemek**, sonra içki; aç karnına içme.
- Her içkinin arasına bir bardak **su**.
- Miktarı önceden belirle; "bir tane" gerçekten bir tane olsun.
- Ertesi gün ağır antrenman planlama.

[gif=2]

## [ikon=pulse] Sigara: performansın sessiz hırsızı
- Kandaki **karbonmonoksit** oksijen taşıma kapasitesini düşürür; kondisyon ve toparlanma zayıflar.
- Damar sağlığını bozar; kalp-damar hastalığı riskini artırır.
- Yara ve sakatlık iyileşmesini yavaşlatır.
- Elektronik sigara ve nargile de **zararsız değildir.**

[kutu=ipucu]
Bırakmak için yalnız değilsin: **ALO 171 Sigara Bırakma Danışma Hattı**'nı arayabilir, aile hekiminden ücretsiz sigara bırakma polikliniklerine yönlendirme isteyebilirsin. Spor, bırakma sürecinin en güçlü destekçilerinden biridir.
[/kutu]

[kutu=mizah]
Cumartesi gecesi 6 bira = yaklaşık 1.300 kcal = 1 haftalık kalori açığının büyük kısmı. Bira göbeği adını boşuna almamış. 🍺😅
[/kutu]

— **AlpveFit Ekibi**`,
  },
  {
    key: "rehber-yeni-baslayan-12-hafta", icon: "steps", rev: 1, category: "antrenman", locked: true, tags: ["baslangic", "program", "teknik", "guc"],
    gifs: ["first day gym", "baby steps"],
    title: "Yeni Başlayanlar İçin 12 Hafta — Sıfırdan adım adım ilk program",
    body: `## Hoş geldin! İlk 12 hafta temeli atar
Yeni başlayanın en büyük avantajı: neredeyse her düzenli program işe yarar. Asıl hedef **alışkanlığı oturtmak**, **hareketleri doğru öğrenmek** ve **sakatlanmadan** ilerlemek.

[gif=1]

## [ikon=calendar] Plan: haftada 3 gün, tüm vücut
Yeni başlayanlar için haftada 2–3 gün tüm vücut çalışması önerilir [kaynak=19204579|ACSM 2009]. Pazartesi · Çarşamba · Cuma gibi aralı günler seç.

[tablo]
Dönem | Odak | Set × tekrar | Not
Hafta 1–4 | Teknik ve alışma | 2 × 10–12 | Ağırlık hafif; her seti 2–3 tekrar "yedek" bırakarak bitir
Hafta 5–8 | Hacim | 3 × 8–12 | Her hafta ya tekrar ya ağırlık artır
Hafta 9–12 | Güç ve hacim | 3–4 × 6–10 | Ana hareketlerde ağırlığı yavaşça artır
[/tablo]

## [ikon=list] Antrenman A / B (dönüşümlü)
[tablo]
A günü | B günü
Goblet Squat ya da Leg Press | Romanian Deadlift (dambıl)
Dambıl Bench Press | Dambıl Omuz Press
Lat Pulldown | Kablo ya da Dambıl Row
Plank (3 × 20–40 sn) | Hip Thrust ya da Glute Bridge
Biceps Curl (isteğe bağlı) | Triceps Pushdown (isteğe bağlı)
[/tablo]
Hafta 1: A · B · A, Hafta 2: B · A · B … diye devam et.

## [ikon=bolt] İlerleme kuralı: çift aralık
Bir harekette tüm setlerde aralığın **üst sınırına** ulaştığında (ör. 3 × 12), bir sonraki antrenmanda ağırlığı küçük bir adımla artır ve aralığın alt ucundan (3 × 8) tekrar başla. Haftalık set sayısını zamanla artırmak kas kazanımını destekler [kaynak=27433992|Schoenfeld 2017].

[gif=2]

## [ikon=check] Yeni başlayanın 7 altın kuralı
1. **Isın:** 5 dk hafif kardiyo + her hareketin 1–2 hafif seti.
2. **Teknik > ağırlık.** Videoya çek, formunu kontrol et.
3. **Defter tut:** ağırlık × tekrar. Ölçmediğini geliştiremezsin.
4. **Protein:** günde 1,6 g/kg civarı (Beslenme rehberine bak).
5. **Uyku:** en az 7 saat.
6. **Kas ağrısı normal**, eklem ağrısı değil (Ağrı ve Sakatlık rehberi).
7. **Sabır:** ilk 4 haftadaki güç artışının çoğu sinir sisteminin öğrenmesidir; görüntü sonra gelir.

[kutu=ipucu]
12 hafta bitince Antrenman Sistemleri rehberine dön: haftada 4 gün gelebiliyorsan **Upper/Lower**'a geçmek doğal bir sonraki adım.
[/kutu]

[kutu=mizah]
İlk hafta: "Bu ağırlık çok hafif." İkinci gün: merdivenleri yan yan inmek. Hoş geldin, artık resmen salon üyesisin. 🪜😄
[/kutu]

— **AlpveFit Ekibi**`,
  },
  {
    key: "rehber-kardiyo", icon: "heart", rev: 1, category: "antrenman", locked: true, tags: ["kardiyo", "yag-yakimi", "saglik", "arastirma"],
    gifs: ["treadmill running funny", "walking city"],
    title: "Kardiyo Rehberi — LISS mi, HIIT mi, adım mı? Kası korurken yağ yakmak",
    body: `## Kardiyo yağ yakmanın "şartı" değil, güçlü bir yardımcısı
Yağ kaybını belirleyen **kalori açığı**dır. Kardiyo bu açığı kolaylaştırır ve kalp sağlığını destekler; ama doğru dozda.

[gif=1]

## [ikon=layers] Türler
[tablo]
Tür | Ne? | Artı | Eksi
Günlük adım (NEAT) | Gün boyu yürüme | En az yorgunluk, sürdürülebilir | Zaman ister
LISS | 30–60 dk tempolu yürüyüş, bisiklet | Toparlanmayı az etkiler | Uzun sürer
HIIT | Kısa yüklenme + dinlenme aralıkları | Az zaman | Yorucu, toparlanmayı zorlar
[/tablo]

## [ikon=microscope] Bilim ne diyor?
- **HIIT ve sürekli orta tempo kardiyo**, fazla kilolu yetişkinlerde benzer yağ kaybı sağladı; HIIT bunu **yaklaşık %40 daha az zamanla** yaptı [kaynak=28401638|Wewege 2017].
- **Günlük adım** sayısı arttıkça tüm nedenlere bağlı ölüm riski azalıyor; fayda 60 yaş altında yaklaşık **8.000–10.000**, 60 yaş üstünde **6.000–8.000** adımda düzleşiyor [kaynak=35247352|Paluch 2022].
- Kardiyo ile ağırlık antrenmanını birlikte yapmak, özellikle **koşu** ve **uzun/sık** kardiyo seanslarında kas ve güç kazanımını bir miktar azaltabiliyor (girişim etkisi); bisiklet daha az etkiliyor [kaynak=22002517|Wilson 2012].

[gif=2]

## [ikon=target] Kası koruyarak kardiyo: pratik plan
1. Önce **adım:** günlük ortalamanı 1.000–2.000 adım artırarak başla.
2. Haftada **2–3 seans** LISS (30–45 dk) ya da **1–2 seans** HIIT.
3. Kardiyoyu ağırlıktan **sonra** ya da **ayrı günde** yap; bacak gününden hemen önce HIIT yapma.
4. Kas için ağırlık antrenmanını ve proteini **asla bırakma.**

[kutu=uyari]
Kalp hastalığın, yüksek tansiyonun ya da göğüs ağrısı, çarpıntı, bayılma öykün varsa HIIT'e başlamadan önce **hekime danış.**
[/kutu]

[kutu=mizah]
Koşu bandında 30 dakikada yakılan ~300 kcal, 1,5 dilim pizzayla geri gelir. Kardiyo güzel; ama tabak hâlâ patron. 🍕🏃
[/kutu]

— **AlpveFit Ekibi**`,
  },
  {
    key: "rehber-kesim-bulk", icon: "target", rev: 1, category: "beslenme", locked: true, tags: ["yag-yakimi", "kas-kazanimi", "kalori", "makro"],
    gifs: ["plateau stuck", "scale weighing"],
    title: "Kesim ve Bulk Yönetimi — Hız, plato, diyet arası ve refeed",
    body: `## İki dönem, tek hedef: daha fazla kas, daha az yağ
**Kesim** (kalori açığı) yağ kaybettirir, **bulk** (kalori fazlası) kas kazanımını destekler. Sanat, ikisini de **yavaş ve kontrollü** yapmakta.

[gif=1]

## [ikon=scale] Hız: ne kadar hızlı olmalı?
[tablo]
Dönem | Hedef hız | Neden?
Kesim | Haftada vücut ağırlığının **%0,5–1**'i | Daha hızlısı kas kaybını artırır [kaynak=24864135|Helms 2014]
Bulk | **Ilımlı** bir fazla; kilo artışı yavaş | Fazlası çoğunlukla yağ olarak birikir [kaynak=31247944|Iraki 2019]
[/tablo]

## [ikon=pulse] Plato neden gelir?
Kilo verdikçe vücudun harcadığı enerji de azalır: daha küçük bir vücut, daha az hareket (farkında olmadan), daha verimli metabolizma. Buna **metabolik adaptasyon** denir [kaynak=24571926|Trexler 2014].

**Plato kırma kontrol listesi** (2–3 haftadır haftalık ortalama kilo değişmiyorsa):
1. Gerçekten tartıyor musun? Göz kararı yağ ve sos sık kaçar.
2. Günlük adımın düştü mü? Önce adımı geri getir.
3. Kaloriyi **100–200 kcal** azalt ya da kardiyoyu biraz artır.
4. Uyku ve stres yerinde mi?

[gif=2]

## [ikon=refresh] Diyet arası ve refeed
- **Diyet arası:** Kesimin ortasında 1–2 hafta **bakım kalorisine** çıkmak. Obez erkeklerde yapılan MATADOR çalışmasında, iki hafta diyet + iki hafta bakım şeklinde aralıklı kısıtlama, sürekli diyete göre **daha fazla yağ kaybı** sağladı [kaynak=28925405|Byrne 2018]. Uzun kesimlerde psikolojik olarak da rahatlatır.
- **Refeed:** 1–2 gün karbonhidratı artırıp kaloriyi bakıma çekmek. Antrenman performansına ve motivasyona iyi gelebilir; "metabolizmayı hızlandırma" etkisi abartılmıştır.

## [ikon=target] Bulk'tan kesime, kesimden bakıma
- Kesim bittiğinde kaloriyi **kademeli** olarak bakıma çıkar; birkaç hafta bakımda kal.
- Bulk'a, bel ölçün belirgin artmaya başladığında son ver.
- Döngüleri gelişim günlüğünde takip et (Gelişim Günlükleri'ndeki rehbere bak).

[kutu=uyari]
Yemekle ilişkin sana sıkıntı veriyorsa (sürekli suçluluk, kontrol kaybı hissi, telafi için aşırı egzersiz), bunu kendi başına taşımak zorunda değilsin; bir hekim ya da uzmanla konuş.
[/kutu]

[kutu=mizah]
"Kirli bulk" sözlükte şöyle geçer: 12 haftada 4 kilo kas hedefi, 9 kilo yağla birlikte teslim edilir. 🍔📦
[/kutu]

— **AlpveFit Ekibi**`,
  },
  {
    key: "rehber-yarisma-riskleri", icon: "flag", rev: 1, category: "antrenman", locked: true, tags: ["yarisma", "saglik", "yag-yakimi", "arastirma"],
    gifs: ["bodybuilding stage pose", "water bottle drinking"],
    title: "Yarışma Hazırlığının Riskleri — Sahneye sağlıklı çıkmak, sağlıklı inmek",
    body: `## Sahne bir gün, sağlık bir ömür
Vücut geliştirme yarışmasına hazırlık, insan vücudunun en zorlandığı süreçlerden biridir: aylarca kalori açığı, çok düşük yağ oranı ve son haftadaki manipülasyonlar. Bu yazı **sağlık riskleri** hakkındadır; peak week protokolü içermez.

[gif=1]

## [ikon=layers] Uzun kesimin vücuttaki etkileri
Doğal sporcular için yarışma hazırlığı derlemesi şunlara dikkat çeker [kaynak=24864135|Helms 2014]:
- **Hormonal baskılanma:** testosteronda düşüş, adet düzensizliği ya da kesilmesi
- **Kas kaybı riski:** özellikle çok hızlı kesimde
- **Ruh hâli:** sinirlilik, uyku bozukluğu, odaklanma güçlüğü
- **Yarışma sonrası:** hızlı kilo geri alımı, kontrolsüz yeme atakları ve beden algısı sorunları sık görülür

## [ikon=drop] Su ve tuz oyunları: neden tehlikeli?
Son haftada suyu ve sodyumu sert biçimde kısıtlamak ya da aşırı su yüklemek, kanıta dayalı peak week derlemesinde **belirsiz faydalı ve riskli** stratejiler olarak değerlendirilir; kas dolgunluğunu bozabilir ve sahne görüntüsünü kötüleştirebilir [kaynak=34120635|Escalante 2021].
- **İdrar söktürücüler (diüretikler):** kandaki potasyum ve sodyum dengesini bozar; **kramp, bayılma ve ölümcül ritim bozukluklarına** yol açabilir. Sporda da yasaklıdır.
- **Aşırı su içip tuzu kesmek:** kandaki sodyumu tehlikeli düzeyde düşürebilir (baş ağrısı, kusma, bilinç bulanıklığı).

[gif=2]

## [ikon=check] Sağlıklı hazırlık için
1. **Erken başla:** kesimi hızlı değil uzun yap (haftada %0,5–1).
2. **Koçla çalış**, kendi başına deneme yapma.
3. **Kan tahlilini** hazırlık başında ve sonunda hekiminle değerlendir (Kan Tahlili rehberine bak).
4. **Yarışma sonrası planı** önceden yap: kaloriyi kademeli artır, kilo geri dönüşünü normal karşıla.
5. **Ruh sağlığını** takip et; zorlanıyorsan destek al.

[kutu=tehlike]
Sahne öncesi ya da sırasında **çarpıntı, bayılma, şiddetli kramp, kafa karışıklığı ya da göğüs ağrısı** yaşarsan yarışmayı bırak ve **112**'yi ara. Hiçbir kupa bunlara değmez.
[/kutu]

[kutu=mizah]
Sahnede 10 saniyelik poz için 16 haftalık tavuk-brokoli. Sonrasında ilk baklava, hayatının en güzel 10 saniyesi olacak; ama bir tepsi değil, bir dilim. 🍰🏆
[/kutu]

— **AlpveFit Ekibi**`,
  },
];
