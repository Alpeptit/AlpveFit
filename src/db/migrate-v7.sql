-- v7: blog kategorileri ve kapak görselleri; bilimsel temelli 16 başlangıç yazısı (yalnız yoksa eklenir).
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'beslenme';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover TEXT NOT NULL DEFAULT '';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_category_chk') THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_category_chk CHECK (category IN ('beslenme','antrenman','farmakoloji'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_cover_chk') THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_cover_chk CHECK (cover ~ '^[a-z0-9-]{0,40}$');
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS blog_posts_cat_idx ON blog_posts (category, published_at DESC) WHERE status = 'published';

INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'karbonhidrat-ve-vucut-gelistirme', $avf$Karbonhidrat ve Vücut Geliştirme$avf$, $avf$Karbonhidrat, ağırlık antrenmanında performansın ve toparlanmanın temel yakıtıdır. Ne kadar, ne zaman ve hangi kaynaklardan alınması gerektiğini bilimsel verilerle ele alıyoruz.$avf$, $avf$Karbonhidrat, vücut geliştirme beslenmesinde en çok tartışılan makro besindir. Oysa bilimsel tablo oldukça nettir: **karbonhidrat, yüksek yoğunluklu antrenmanın birincil yakıtıdır** ve kas glikojen depolarının dolu olması antrenman kalitesini doğrudan etkiler [1].

## Karbonhidrat vücutta ne işe yarar?

Yediğimiz karbonhidratlar glikoza parçalanır ve fazlası kas ile karaciğerde **glikojen** olarak depolanır. Ağırlık antrenmanı gibi kısa süreli ama yoğun eforlarda kasın tercih ettiği enerji kaynağı büyük ölçüde bu glikojendir. Depolar düşük olduğunda set kalitesi, tekrar sayısı ve antrenman hacmi düşebilir.

## Ne kadar karbonhidrat gerekir?

İhtiyaç; antrenman hacmine, vücut ağırlığına ve hedefe göre değişir. Amerikan Spor Hekimliği Koleji (ACSM) ortak bildirgesi, günlük ihtiyacı **antrenman yüküne göre kilogram başına** belirlemeyi önerir [2]:

- **Orta düzey antrenman (günde yaklaşık 1 saat):** 5–7 g/kg/gün
- **Hafif yoğunluk veya beceri odaklı çalışma:** 3–5 g/kg/gün
- **Uzun süreli dayanıklılık antrenmanı:** 6–10 g/kg/gün ve üzeri

Hacim dönemindeki vücut geliştiricilere yönelik derlemeler, toplam kalori ve protein ihtiyacı karşılandıktan sonra enerjinin önemli bir kısmının karbonhidrattan gelmesini ve genellikle **en az 3–5 g/kg/gün** düzeyinin hedeflenmesini önermektedir [3]. Yarışma hazırlığı (diyet) döneminde ise kalori açığı nedeniyle karbonhidrat düşer; burada amaç, antrenman performansını koruyacak düzeyi mümkün olduğunca sürdürmektir [4].

## Zamanlama önemli mi?

Günlük **toplam karbonhidrat miktarı**, zamanlamadan daha belirleyicidir. Bununla birlikte uluslararası sporcu beslenmesi derneğinin (ISSN) bildirgesine göre antrenman öncesi ve sonrası karbonhidrat alımı, özellikle **günde birden fazla antrenman** yapanlarda veya iki antrenman arasında kısa süre olduğunda glikojenin daha hızlı yenilenmesine yardımcı olur [5].

Pratikte:

- Antrenmandan **1–3 saat önce** karbonhidrat ve protein içeren bir öğün,
- Antrenman sonrası öğünde karbonhidrat + protein birlikteliği,
- Günün geri kalanında lifli, işlenmemiş kaynaklar

çoğu kişi için yeterli ve uygulanabilir bir düzendir.

## Hangi kaynaklar tercih edilmeli?

**Yulaf, bulgur, tam tahıllar, pirinç, patates, baklagiller, meyve ve sebzeler** temel kaynaklar olmalıdır. Bu besinler karbonhidratın yanında lif, vitamin ve mineral de sağlar. Basit şekerler ve sporcu içecekleri, uzun ve çok yoğun antrenmanlarda pratik bir araç olabilir; ancak günlük beslenmenin temelini oluşturmamalıdır.

## Düşük karbonhidrat kas kaybettirir mi?

Toplam kalori ve protein yeterliyse düşük karbonhidratlı beslenme tek başına kas kaybına yol açmaz; ancak **antrenman hacmini ve performansı düşürebilir**. Bu nedenle karbonhidrat miktarı, hedefe ve antrenman programına göre **kişiye özel** ayarlanmalıdır.

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır; tıbbi tanı, tedavi veya kişisel beslenme danışmanlığı yerine geçmez. Kronik bir hastalığınız, gebelik/emzirme döneminiz veya düzenli kullandığınız bir ilaç varsa değişiklik yapmadan önce **hekiminize danışın**.

!bilgi|**Diyabet, insülin direnci** veya kan şekeri düzenini etkileyen bir durumunuz varsa karbonhidrat miktarı ve zamanlaması mutlaka hekiminizle birlikte planlanmalıdır.

## Kaynaklar

[1] Burke LM, et al. Carbohydrates for training and competition. J Sports Sci. 2011;29(Suppl 1):S17-27. PMID: 21660838
[2] Thomas DT, et al. American College of Sports Medicine Joint Position Statement. Nutrition and Athletic Performance. Med Sci Sports Exerc. 2016;48(3):543-68. PMID: 26891166
[3] Iraki J, et al. Nutrition Recommendations for Bodybuilders in the Off-Season: A Narrative Review. Sports (Basel). 2019;7(7):154. PMID: 31247944
[4] Helms ER, et al. Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation. J Int Soc Sports Nutr. 2014;11:20. PMID: 24864135
[5] Kerksick CM, et al. International society of sports nutrition position stand: nutrient timing. J Int Soc Sports Nutr. 2017;14:33. PMID: 28919842$avf$, 'published', 'beslenme', 'karbonhidrat', 'AlpveFit', now() - interval '0 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'yag-ve-vucut-gelistirme', $avf$Yağ ve Vücut Geliştirme$avf$, $avf$Yağlar yalnızca kalori değildir; hormon üretiminden vitamin emilimine kadar pek çok işlevde rol alır. Vücut geliştirmede ne kadar yağ tüketmek gerektiğini kaynaklarıyla inceliyoruz.$avf$, $avf$Diyet yapan pek çok kişi ilk iş olarak yağı azaltır. Oysa yağlar **hücre zarlarının yapısında, yağda çözünen vitaminlerin (A, D, E, K) emiliminde ve steroid hormonların üretiminde** temel rol oynar. Vücut geliştirme beslenmesinde amaç yağı yok etmek değil, **doğru miktarda ve doğru kaynaklardan** almaktır.

## Ne kadar yağ gerekir?

Doğal vücut geliştirme yarışma hazırlığına yönelik kanıta dayalı öneriler, yağ alımının **toplam kalorinin yaklaşık %15–30'u** aralığında tutulmasını önerir [1]. Hacim dönemine yönelik derlemeler ise vücut ağırlığına göre yaklaşık **0,5–1,5 g/kg/gün** aralığını makul bir başlangıç noktası olarak gösterir [2].

Bu aralığın alt sınırına inmek, özellikle uzun süreli diyetlerde dikkatle yapılmalıdır; çünkü yağdan çok fazla kısıntı, karbonhidrat ve protein için yer açsa da başka sorunlara yol açabilir.

## Yağ ve testosteron ilişkisi

Erkeklerde yapılan müdahale çalışmalarını birleştiren bir meta-analiz, **düşük yağlı diyetlerin** yüksek yağlı diyetlere kıyasla serum testosteron düzeylerinde **yaklaşık %10–15 civarında düşüşle** ilişkili olduğunu göstermiştir [3]. Bu fark klinik olarak büyük olmasa da, uzun süre çok düşük yağlı beslenmenin hormon dengesi açısından ideal olmadığını düşündürür.

## Hangi yağlar tercih edilmeli?

- **Tekli doymamış yağlar:** zeytinyağı, avokado, fındık, badem
- **Çoklu doymamış yağlar ve omega-3:** somon, sardalya, uskumru gibi yağlı balıklar, ceviz, keten tohumu
- **Doymuş yağlar:** tereyağı, kırmızı et ve tam yağlı süt ürünlerinde bulunur; **ölçülü** tüketilmelidir
- **Trans yağlar:** endüstriyel kızartmalar ve bazı paketli ürünlerde bulunur; **mümkün olduğunca kaçınılmalıdır**

## Antrenman çevresinde yağ

Yağ, sindirimi yavaşlatır. Bu nedenle antrenmandan hemen önceki öğünde çok yağlı besinler bazı kişilerde ağırlık ve hazımsızlık hissine yol açabilir. Günün diğer öğünlerinde ise yağ, tokluk hissini artırır ve beslenme düzenine uyumu kolaylaştırır.

## Yağ ve kalori dengesi

Yağın gramı yaklaşık **9 kcal** enerji içerir; bu, protein ve karbonhidratın iki katından fazladır. Sağlıklı yağlar bile ölçüsüz tüketildiğinde kalori dengesini hızla bozabilir. Bu nedenle porsiyon kontrolü, yağ kaynağının kalitesi kadar önemlidir.

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır; tıbbi tanı, tedavi veya kişisel beslenme danışmanlığı yerine geçmez. Kronik bir hastalığınız, gebelik/emzirme döneminiz veya düzenli kullandığınız bir ilaç varsa değişiklik yapmadan önce **hekiminize danışın**.

!bilgi|**Kolesterol yüksekliği, kalp-damar hastalığı** veya safra kesesi sorunlarınız varsa yağ türü ve miktarı hekiminiz veya diyetisyeninizle birlikte belirlenmelidir.

## Kaynaklar

[1] Helms ER, et al. Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation. J Int Soc Sports Nutr. 2014;11:20. PMID: 24864135
[2] Iraki J, et al. Nutrition Recommendations for Bodybuilders in the Off-Season: A Narrative Review. Sports (Basel). 2019;7(7):154. PMID: 31247944
[3] Whittaker J, et al. Low-fat diets and testosterone in men: Systematic review and meta-analysis of intervention studies. J Steroid Biochem Mol Biol. 2021;210:105878. PMID: 33741447$avf$, 'published', 'beslenme', 'yag', 'AlpveFit', now() - interval '1 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'protein-ve-vucut-gelistirme', $avf$Protein ve Vücut Geliştirme$avf$, $avf$Kas gelişiminin yapı taşı olan proteinin günlük ihtiyacı, öğünlere dağılımı ve kaynakları; güncel meta-analizler ve pozisyon bildirgeleri ışığında.$avf$, $avf$Protein, kas dokusunun yapı taşıdır. Ağırlık antrenmanı kas protein sentezini uyarır; yeterli protein alımı ise bu uyarının **kas kütlesi artışına dönüşmesine** yardımcı olur.

## Günde ne kadar protein?

Direnç antrenmanı yapan sağlıklı yetişkinlerde 49 çalışmayı kapsayan kapsamlı bir meta-analiz, protein takviyesinin kas kütlesi ve kuvvet artışını desteklediğini; faydanın **yaklaşık 1,6 g/kg/gün** civarında plato yaptığını, bazı kişilerde **2,2 g/kg/gün**'e kadar çıkmanın makul olabileceğini göstermiştir [1].

ISSN pozisyon bildirgesi de egzersiz yapan bireylerin çoğu için **1,4–2,0 g/kg/gün** aralığını önermektedir [2]. Kalori açığı (diyet) dönemlerinde kas kütlesini korumak için ihtiyaç daha yüksek olabilir [3].

## Öğünlere nasıl dağıtılmalı?

Kas protein sentezini en iyi şekilde desteklemek için proteinin gün içine **dengeli dağıtılması** önerilir. Bilimsel bir değerlendirme, günlük hedefe ulaşmak için **öğün başına yaklaşık 0,4 g/kg** proteinin **en az dört öğüne** bölünmesini pratik bir strateji olarak sunar [4].

Örneğin 80 kg bir kişi için bu, öğün başına yaklaşık **32 g** protein ve günde dört öğün anlamına gelir.

## Uykudan önce protein

ISSN bildirgesine göre yatmadan önce alınan **yavaş sindirilen protein** (örneğin kazein içeren süt ürünleri), gece boyunca kas protein sentezini destekleyebilir [2].

## Hangi kaynaklar?

- **Hayvansal kaynaklar:** yumurta, tavuk, hindi, balık, kırmızı et, süt, yoğurt, peynir
- **Bitkisel kaynaklar:** mercimek, nohut, fasulye, soya ürünleri, tahıllar
- **Toz proteinler:** pratik bir tamamlayıcıdır; ancak **besinlerin yerini almamalıdır**

Bitkisel ağırlıklı beslenenler, farklı protein kaynaklarını gün içinde birleştirerek amino asit profilini tamamlayabilir.

## Fazlası zararlı mı?

Sağlıklı bireylerde önerilen aralıklardaki protein alımının olumsuz bir etkisi gösterilmemiştir [2]. Ancak **böbrek hastalığı** olan kişilerde protein alımı mutlaka hekim kontrolünde düzenlenmelidir.

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır; tıbbi tanı, tedavi veya kişisel beslenme danışmanlığı yerine geçmez. Kronik bir hastalığınız, gebelik/emzirme döneminiz veya düzenli kullandığınız bir ilaç varsa değişiklik yapmadan önce **hekiminize danışın**.

!uyari|**Böbrek hastalığı, karaciğer hastalığı** veya metabolik bir rahatsızlığınız varsa yüksek proteinli beslenmeye geçmeden önce mutlaka hekiminize danışın.

## Kaynaklar

[1] Morton RW, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. Br J Sports Med. 2018;52(6):376-384. PMID: 28698222
[2] Jäger R, et al. International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr. 2017;14:20. PMID: 28642676
[3] Helms ER, et al. Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation. J Int Soc Sports Nutr. 2014;11:20. PMID: 24864135
[4] Schoenfeld BJ, et al. How much protein can the body use in a single meal for muscle-building? Implications for daily protein distribution. J Int Soc Sports Nutr. 2018;15:10. PMID: 29497353$avf$, 'published', 'beslenme', 'protein', 'AlpveFit', now() - interval '2 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'supplementlerin-kullanim-zamanlari', $avf$Supplementlerin Kullanım Zamanları$avf$, $avf$Kreatin, kafein ve protein tozu gibi takviyeleri ne zaman kullanmak gerekir? Zamanlamanın gerçekten önemli olduğu durumları ve abartılan efsaneleri ayırıyoruz.$avf$, $avf$Takviye (supplement) dünyasında zamanlama çoğu zaman abartılır. Bilimsel veriler, çoğu takviyede **düzenli ve doğru miktarda kullanımın**, saatten daha önemli olduğunu gösterir. Yine de bazı takviyelerde zamanlama gerçekten fark yaratır.

## Önce temel kural: takviye, beslenmenin yerini almaz

Uluslararası Olimpiyat Komitesi (IOC) uzlaşı bildirgesi, takviyelerin ancak **dengeli bir beslenme** üzerine eklendiğinde anlamlı olabileceğini vurgular. Aynı bildirge, piyasadaki ürünlerde **kontaminasyon (bulaş) riskine** ve etikette yazmayan maddelere dikkat çeker; bu nedenle **bağımsız kuruluşlarca test edilmiş** ürünler tercih edilmelidir [1].

## Kreatin

Kreatin monohidrat, en çok araştırılmış ve etkinliği en iyi kanıtlanmış takviyelerden biridir. ISSN bildirgesine göre kas kreatin depolarını doldurmak için **günlük düzenli kullanım** esastır; yaygın kullanılan idame miktarı **günde 3–5 g**'dır [2].

**Zamanlama:** Kreatinin etkisi depoların dolmasıyla ortaya çıktığı için saat ikinci plandadır. Bazı veriler antrenman çevresinde (özellikle sonrasında) alımın küçük bir avantaj sağlayabileceğini düşündürse de, en önemli nokta **her gün alınmasıdır** [3].

## Kafein

ISSN bildirgesine göre kafein, birçok egzersiz türünde performansı artırabilir. Etkili miktar genellikle **3–6 mg/kg** aralığındadır ve en sık **egzersizden yaklaşık 60 dakika önce** alınır [4].

- Kafeine duyarlılık kişiden kişiye büyük farklılık gösterir; **düşük miktarla başlamak** daha güvenlidir.
- Akşam antrenmanı öncesi kafein **uyku kalitesini** bozabilir; uyku da toparlanmanın temelidir.

## Protein tozu

Protein tozu bir besindir; zamanlaması diğer protein kaynaklarıyla aynı mantığa dayanır. ISSN bildirgesine göre **günlük toplam protein miktarı** belirleyicidir; antrenman sonrası protein alımı faydalıdır ancak "30 dakikalık pencere" katı bir kural değildir [3].

## Özet: hangi takviye ne zaman?

- **Kreatin:** her gün, günün herhangi bir saatinde; antrenman günlerinde antrenman çevresinde olabilir
- **Kafein:** antrenmandan yaklaşık 60 dakika önce; akşam saatlerinde dikkatli
- **Protein tozu:** günlük protein hedefini tamamlamak için; genellikle antrenman sonrası veya öğün arası

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır; tıbbi tanı, tedavi veya kişisel beslenme danışmanlığı yerine geçmez. Kronik bir hastalığınız, gebelik/emzirme döneminiz veya düzenli kullandığınız bir ilaç varsa değişiklik yapmadan önce **hekiminize danışın**.

!uyari|**Kalp ritim bozukluğu, yüksek tansiyon, kaygı bozukluğu** veya gebelik durumunda kafein kullanımı hekim onayı olmadan yapılmamalıdır. **Böbrek hastalığı** olanlar kreatin kullanmadan önce hekimine danışmalıdır. Lisanslı sporcular, kullandıkları her ürünün **doping listesi** açısından güvenli olduğundan emin olmalıdır.

## Kaynaklar

[1] Maughan RJ, et al. IOC consensus statement: dietary supplements and the high-performance athlete. Br J Sports Med. 2018;52(7):439-455. PMID: 29540367
[2] Kreider RB, et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. J Int Soc Sports Nutr. 2017;14:18. PMID: 28615996
[3] Kerksick CM, et al. International society of sports nutrition position stand: nutrient timing. J Int Soc Sports Nutr. 2017;14:33. PMID: 28919842
[4] Guest NS, et al. International society of sports nutrition position stand: caffeine and exercise performance. J Int Soc Sports Nutr. 2021;18(1):1. PMID: 33388079$avf$, 'published', 'beslenme', 'supplement', 'AlpveFit', now() - interval '3 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'vitaminlerin-kullanim-zamanlari', $avf$Vitaminlerin Kullanım Zamanları$avf$, $avf$Yağda ve suda çözünen vitaminler farklı şekilde emilir. D vitamini neden yemekle alınmalı, yüksek doz antioksidanlar antrenman kazanımlarını etkiler mi?$avf$, $avf$Vitamin takviyelerinde zamanlamayı belirleyen en önemli etken, vitaminin **yağda mı yoksa suda mı** çözündüğüdür. Yanlış zamanda alınan bir vitamin, beklenenden çok daha az emilebilir.

## Yağda çözünen vitaminler: A, D, E, K

Bu vitaminlerin bağırsaktan emilimi için ortamda **yağ** bulunması gerekir. Bu nedenle **yağ içeren bir öğünle** alınmaları önerilir.

**D vitamini** bu konuda en iyi incelenen örnektir:

- Bir klinik çalışmada D vitamini takviyesini **günün en büyük öğünüyle** almaya başlayan kişilerde serum D vitamini düzeyleri ortalama **yaklaşık %50 artmıştır** [1].
- Kontrollü bir başka çalışmada D3 vitamini, **yağ içeren bir öğünle** alındığında yağsız öğüne kıyasla daha yüksek emilim göstermiştir [2].

Sporcular açısından D vitamini; kas fonksiyonu, kemik sağlığı ve bağışıklık için önemlidir. Özellikle güneş ışığını az alan, kapalı alanda antrenman yapan kişilerde eksiklik sık görülür; bu nedenle takviye öncesinde **kan düzeyinin ölçülmesi** önerilir [3].

## Suda çözünen vitaminler: B grubu ve C

Bu vitaminler vücutta sınırlı miktarda depolanır ve fazlası idrarla atılır. Genellikle **günün herhangi bir saatinde** alınabilirler.

- **B grubu vitaminler** enerji metabolizmasında rol aldığı için bazı kişiler sabah almayı tercih eder.
- Aç karnına alındığında **mide rahatsızlığı** yapan vitaminler yemekle birlikte alınabilir.

## Yüksek doz antioksidanlar ve antrenman

Antrenman sırasında oluşan serbest radikaller, kasın antrenmana **uyum sağlaması için gereken sinyallerin** bir parçasıdır. Çift kör, randomize kontrollü bir çalışmada **yüksek doz C ve E vitamini** takviyesi, antrenmana verilen hücresel uyum yanıtlarını **zayıflatmıştır** [4].

Bu nedenle, eksiklik olmadıkça **yüksek doz antioksidan takviyelerini antrenmana yakın saatlerde** kullanmak önerilmez. Meyve ve sebzelerden alınan antioksidanlar ise sorun oluşturmaz.

## Pratik özet

- **D, E, A, K:** yağ içeren ana öğünle
- **B grubu, C:** günün herhangi bir saatinde, mideyi rahatsız ediyorsa yemekle
- **Yüksek doz antioksidan:** gerekmedikçe kullanılmamalı, kullanılıyorsa antrenmandan uzak

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır; tıbbi tanı, tedavi veya kişisel beslenme danışmanlığı yerine geçmez. Kronik bir hastalığınız, gebelik/emzirme döneminiz veya düzenli kullandığınız bir ilaç varsa değişiklik yapmadan önce **hekiminize danışın**.

!uyari|Yağda çözünen vitaminler vücutta birikebilir; **yüksek dozda uzun süre kullanımı zehirlenmeye** yol açabilir. D vitamini ve diğer yüksek doz takviyeleri **kan tahlili ve hekim önerisi** olmadan kullanmayın. **Kan sulandırıcı** kullananlar K vitamini takviyesi için mutlaka hekime danışmalıdır.

## Kaynaklar

[1] Mulligan GB, et al. Taking vitamin D with the largest meal improves absorption and results in higher serum levels of 25-hydroxyvitamin D. J Bone Miner Res. 2010;25(4):928-30. PMID: 20200983
[2] Dawson-Hughes B, et al. Dietary fat increases vitamin D-3 absorption. J Acad Nutr Diet. 2015;115(2):225-230. PMID: 25441954
[3] Owens DJ, et al. Vitamin D and the Athlete: Current Perspectives and New Challenges. Sports Med. 2018;48(Suppl 1):3-16. PMID: 29368183
[4] Paulsen G, et al. Vitamin C and E supplementation hampers cellular adaptation to endurance training in humans: a double-blind, randomised, controlled trial. J Physiol. 2014;592(8):1887-901. PMID: 24492839$avf$, 'published', 'beslenme', 'vitamin', 'AlpveFit', now() - interval '4 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'minerallerin-kullanim-zamanlari', $avf$Minerallerin Kullanım Zamanları$avf$, $avf$Demir, kalsiyum, çinko ve magnezyum birbirinin emilimini etkileyebilir. Mineral takviyelerini ne zaman ve neyle almanız gerektiğini kaynaklarıyla açıklıyoruz.$avf$, $avf$Mineral takviyelerinde zamanlama, çoğu zaman **diğer besinlerle ve minerallerle etkileşim** nedeniyle önem kazanır. Aynı anda alınan bazı mineraller birbirinin emilimini azaltabilir.

## Demir

Demir eksikliği, özellikle **kadın sporcularda** ve yoğun dayanıklılık antrenmanı yapanlarda sık görülür. Egzersiz sonrası artan iltihabi sinyaller, demir emilimini düzenleyen **hepsidin** hormonunu yükseltebilir ve bu, egzersiz sonrası saatlerde demir emilimini azaltabilir [1].

Demir eksikliği olan kadınlarda yapılan randomize çalışmalarda, demir takviyesinin **sabah tek doz** olarak ve **gün aşırı** verilmesi, her gün veya günde iki kez verilmesine kıyasla **daha yüksek fraksiyonel emilim** sağlamıştır [2].

Ayrıca **kalsiyum**, aynı öğünde alındığında demir emilimini belirgin şekilde azaltır [3]. Bu nedenle:

- Demir takviyesi **kalsiyum takviyesi, süt ürünleri, çay ve kahveden ayrı** alınmalıdır.
- C vitamini içeren besinlerle birlikte alınması emilimi destekleyebilir.

## Kalsiyum

Kalsiyum takviyesi, demir ve çinko takviyelerinden **ayrı saatlerde** alınmalıdır [3]. Kalsiyum karbonat formu yemekle daha iyi emilirken, sitrat formu yemekten bağımsız alınabilir.

## Çinko

Tahıl ve baklagillerde bulunan **fitatlar**, çinko emilimini azaltan başlıca diyet bileşenidir; hayvansal protein ise çinko emilimini destekleyebilir [4]. Yüksek doz çinko, uzun vadede **bakır emilimini** de olumsuz etkileyebilir.

## Magnezyum

Magnezyum, kas kasılması ve enerji metabolizmasında rol oynar. Bir sistematik değerlendirme, magnezyum takviyesinin performansa faydasının özellikle **magnezyum düzeyi düşük olan** kişilerde belirgin olduğunu; düzeyi yeterli olanlarda ek fayda kanıtlarının sınırlı olduğunu göstermiştir [5]. Mide-bağırsak rahatsızlığını azaltmak için yemekle alınabilir.

## Pratik özet

- **Demir:** sabah, aç karnına veya hafif bir öğünle; kalsiyum, çay ve kahveden uzak; yalnızca **eksiklik tespit edildiyse**
- **Kalsiyum:** demir ve çinkodan ayrı saatte
- **Çinko:** fitattan zengin öğünlerden ayrı; uzun süre yüksek doz kullanılmamalı
- **Magnezyum:** yemekle, düzeyi düşükse

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır; tıbbi tanı, tedavi veya kişisel beslenme danışmanlığı yerine geçmez. Kronik bir hastalığınız, gebelik/emzirme döneminiz veya düzenli kullandığınız bir ilaç varsa değişiklik yapmadan önce **hekiminize danışın**.

!uyari|**Demir takviyesi yalnızca kan tahlilleriyle eksiklik doğrulandıktan sonra** ve hekim önerisiyle kullanılmalıdır; gereksiz demir kullanımı vücutta birikerek organlara zarar verebilir. **Böbrek hastalığı** olanlar magnezyum ve diğer mineral takviyelerini hekim kontrolü olmadan kullanmamalıdır.

## Kaynaklar

[1] Peeling P, et al. Athletic induced iron deficiency: new insights into the role of inflammation, cytokines and hormones. Eur J Appl Physiol. 2008;103(4):381-91. PMID: 18365240
[2] Stoffel NU, et al. Iron absorption from oral iron supplements given on consecutive versus alternate days and as single morning doses versus twice-daily split dosing in iron-depleted women: two open-label, randomised controlled trials. Lancet Haematol. 2017;4(11):e524-e533. PMID: 29032957
[3] Hallberg L, et al. Calcium: effect of different amounts on nonheme- and heme-iron absorption in humans. Am J Clin Nutr. 1991;53(1):112-9. PMID: 1984335
[4] Lönnerdal B. Dietary factors influencing zinc absorption. J Nutr. 2000;130(5S Suppl):1378S-83S. PMID: 10801947
[5] Zhang Y, et al. Can Magnesium Enhance Exercise Performance? Nutrients. 2017;9(9):946. PMID: 28846654$avf$, 'published', 'beslenme', 'mineral', 'AlpveFit', now() - interval '5 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'hipertrofi-nedir', $avf$Hipertrofi Nedir?$avf$, $avf$Kas hipertrofisi, kas liflerinin kesit alanının büyümesidir. Kas büyümesini tetikleyen mekanizmaları ve bunları antrenmana nasıl yansıtacağınızı bilimsel verilerle açıklıyoruz.$avf$, $avf$**Hipertrofi**, kas liflerinin kesit alanının artmasıyla kas kütlesinin büyümesidir. Vücut geliştirmenin temel hedefi olan bu süreç; antrenman uyarısı, yeterli beslenme ve toparlanmanın bir araya gelmesiyle gerçekleşir.

## Kas nasıl büyür?

Direnç antrenmanı, kas protein sentezini uyarır. Sentezin yıkımı aştığı dönemler yeterince sık ve uzun sürdüğünde kas proteini birikir ve kas büyür. Hipertrofiyi tetikleyen üç temel mekanizma tanımlanmıştır [1]:

- **Mekanik gerilim:** kasın yük altında gerilmesi; hipertrofinin en güçlü tetikleyicisi olarak kabul edilir
- **Metabolik stres:** yüksek tekrarlı, kısa dinlenmeli setlerde biriken metabolitler
- **Kas hasarı:** özellikle alışılmamış ve eksantrik yüklenmelerde oluşan mikro hasarlar

## Hacim: ne kadar set?

Haftalık antrenman hacmi ile kas büyümesi arasında **doz-yanıt ilişkisi** vardır. Bir meta-analiz, kas grubu başına **haftada 10 ve üzeri set** yapılmasının, daha düşük hacme kıyasla daha fazla hipertrofiyle ilişkili olduğunu göstermiştir [2].

Ancak hacim sınırsız artırılmamalıdır; toparlanma kapasitesini aşan hacim, ilerlemeyi durdurabilir. Hacim **kademeli** olarak artırılmalıdır.

## Yük ve tekrar aralığı

Uzun yıllar hipertrofi için "8–12 tekrar" kuralı kabul gördü. Güncel veriler ise setler **tükenişe yakın** yapıldığı sürece, **geniş bir tekrar aralığında** (yaklaşık 6 ila 30 tekrar) benzer kas büyümesi elde edilebildiğini göstermektedir [3]. Kuvvet hedefi için ise daha ağır yükler avantajlıdır.

## Pratik ilkeler

- **Progresif yüklenme:** zamanla ağırlığı, tekrarı veya seti artırmak
- **Tükenişe yakın çalışma:** setleri yedekte 0–3 tekrar kalacak şekilde bitirmek
- **Yeterli haftalık hacim:** kas grubu başına haftada yaklaşık 10+ set hedeflemek
- **Doğru teknik ve tam hareket açıklığı**
- **Yeterli protein, kalori ve uyku**

## Hipertrofi ne kadar sürede görülür?

Antrenmanın ilk haftalarındaki kuvvet artışının önemli bir kısmı sinir sisteminin uyumundan kaynaklanır. Ölçülebilir kas büyümesi genellikle **birkaç hafta** düzenli antrenmandan sonra belirginleşir; ilerleme hızı ise antrenman geçmişine, genetiğe ve beslenmeye göre kişiden kişiye değişir.

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır. Yeni bir antrenman programına başlamadan önce, özellikle **kalp-damar hastalığı, yüksek tansiyon, eklem veya bel-boyun sorunlarınız** varsa hekiminize danışın. Antrenman sırasında **göğüs ağrısı, baş dönmesi veya nefes darlığı** hissederseniz egzersizi hemen bırakın.

## Kaynaklar

[1] Schoenfeld BJ. The mechanisms of muscle hypertrophy and their application to resistance training. J Strength Cond Res. 2010;24(10):2857-72. PMID: 20847704
[2] Schoenfeld BJ, et al. Dose-response relationship between weekly resistance training volume and increases in muscle mass: A systematic review and meta-analysis. J Sports Sci. 2017;35(11):1073-1082. PMID: 27433992
[3] Schoenfeld BJ, et al. Loading Recommendations for Muscle Strength, Hypertrophy, and Local Endurance: A Re-Examination of the Repetition Continuum. Sports (Basel). 2021;9(2):32. PMID: 33671664$avf$, 'published', 'antrenman', 'hipertrofi', 'AlpveFit', now() - interval '6 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'atrofi-nedir', $avf$Atrofi Nedir?$avf$, $avf$Kas atrofisi, kas kütlesinin ve kuvvetinin azalmasıdır. Hareketsizlik, sakatlık ve yaşlanmayla ortaya çıkan kas kaybının nedenlerini ve korunma yollarını inceliyoruz.$avf$, $avf$**Atrofi**, kas liflerinin küçülmesiyle kas kütlesinin ve genellikle kuvvetin azalmasıdır. Hipertrofinin tersi olarak düşünülebilir; kas protein yıkımı uzun süre sentezi aştığında ortaya çıkar.

## Atrofinin başlıca nedenleri

- **Kullanmama (hareketsizlik):** alçı, yatak istirahati, sakatlık veya uzun antrenman araları
- **Yaşlanma (sarkopeni):** yaşa bağlı kas kütlesi ve kuvvet kaybı
- **Hastalıklar ve yetersiz beslenme:** kronik hastalıklar, uzun süreli ve yüksek kalori açığı

## Hareketsizlikte ne olur?

Kullanmamaya bağlı kas kaybında, kas protein sentezinin azalması ve yıkım yolaklarının aktive olması birlikte rol oynar [1]. Sağlıklı genç erkeklerde yapılan bir çalışmada yalnızca **5 günlük bacak immobilizasyonu** bile kas kütlesinde ölçülebilir azalmaya, kas protein sentezinde düşüşe ve **proteine karşı anabolik direnç** gelişmesine yol açmıştır [2].

Bu nedenle sakatlık dönemlerinde, hekimin izin verdiği ölçüde **hareketli kalmak** ve sağlam bölgeleri çalıştırmaya devam etmek önemlidir.

## Sarkopeni: yaşa bağlı kas kaybı

Avrupa Sarkopeni Çalışma Grubu (EWGSOP2), sarkopeniyi öncelikle **düşük kas kuvveti** üzerinden tanımlar; düşük kas miktarı veya kalitesiyle tanı doğrulanır [3]. Sarkopeni; düşme, kırık ve bağımsızlık kaybı riskini artırır. Direnç antrenmanı ve yeterli protein alımı, korunmanın temel taşlarıdır.

## Kazanımları korumak ne kadar antrenman gerektirir?

İyi haber şu: kazanılan kası korumak, kazanmaktan **çok daha az** antrenman gerektirir. Bir çalışmada genç yetişkinler, antrenman dozunu **önemli ölçüde azaltıp haftada tek seansa** indirdiklerinde bile kas kütlesi ve kuvvet kazanımlarını büyük ölçüde korumuştur; yaşlılarda ise korunma için daha yüksek doz gerekmiştir [4].

## Atrofiden korunmak için

- Uzun aralar vermek zorundaysanız **haftada en az bir kısa direnç antrenmanı** sürdürmek
- Sakatlıkta, hekim ve fizyoterapist önerisiyle **sağlam bölgeleri çalışmaya** devam etmek
- **Yeterli protein** almak ve aşırı kalori kısıtlamasından kaçınmak
- Yaş ilerledikçe direnç antrenmanını **hayatın kalıcı bir parçası** yapmak

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır. Yeni bir antrenman programına başlamadan önce, özellikle **kalp-damar hastalığı, yüksek tansiyon, eklem veya bel-boyun sorunlarınız** varsa hekiminize danışın. Antrenman sırasında **göğüs ağrısı, baş dönmesi veya nefes darlığı** hissederseniz egzersizi hemen bırakın.

!bilgi|**Açıklanamayan kas kaybı, kas güçsüzlüğü veya kilo kaybı** bir hastalığın belirtisi olabilir; bu durumda vakit kaybetmeden hekime başvurun.

## Kaynaklar

[1] Bodine SC. Disuse-induced muscle wasting. Int J Biochem Cell Biol. 2013;45(10):2200-8. PMID: 23800384
[2] Wall BT, et al. Short-term muscle disuse lowers myofibrillar protein synthesis rates and induces anabolic resistance to protein ingestion. Am J Physiol Endocrinol Metab. 2016;310(2):E137-47. PMID: 26578714
[3] Cruz-Jentoft AJ, et al. Sarcopenia: revised European consensus on definition and diagnosis. Age Ageing. 2019;48(1):16-31. PMID: 30312372
[4] Bickel CS, et al. Exercise dosing to retain resistance training adaptations in young and older adults. Med Sci Sports Exerc. 2011;43(7):1177-87. PMID: 21131862$avf$, 'published', 'antrenman', 'atrofi', 'AlpveFit', now() - interval '7 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'iki-set-antrenman-sistemi-verimli-midir', $avf$2 Set Antrenman Sistemi Verimli midir?$avf$, $avf$Egzersiz başına yalnızca 2 set yapmak yeterli mi? Set sayısı, haftalık hacim ve tükenişe yakınlık arasındaki ilişkiyi meta-analizlerle değerlendiriyoruz.$avf$, $avf$Son yıllarda "egzersiz başına 2 set, ama yüksek yoğunlukla" yaklaşımı oldukça popüler oldu. Peki bu sistem kas gelişimi için gerçekten yeterli mi? Cevap, **egzersiz başına set sayısına değil, kas grubu başına haftalık toplam hacme** bakmaktan geçer.

## Tek set mi, çok set mi?

Bir meta-analiz, egzersiz başına **çoklu setlerin**, tek sete kıyasla yaklaşık **%40 daha fazla hipertrofiyle** ilişkili olduğunu göstermiştir [1]. Yani tek set başlangıç için işe yarasa da, ilerlemeyi en üst düzeye çıkarmak için yeterli değildir. Egzersiz başına 2–3 set, bu meta-analizde etkili bulunan aralıkta yer alır.

## Asıl belirleyici: haftalık hacim

Haftalık hacim ile kas büyümesi arasında doz-yanıt ilişkisi vardır; kas grubu başına **haftada 10 ve üzeri set**, daha düşük hacimlere göre daha fazla hipertrofiyle ilişkilendirilmiştir [2]. Kuvvet gelişimi için de haftalık set sayısının artırılması daha büyük kazanımlarla ilişkilidir [3].

Bu nedenle 2 set sistemi şu şekilde değerlendirilmelidir:

- Bir kas grubu için **3 egzersiz × 2 set × haftada 2 kez** = haftada **12 set** → yeterli hacim
- Bir kas grubu için **1 egzersiz × 2 set × haftada 1 kez** = haftada **2 set** → çoğu kişi için yetersiz

## Yoğunluğun rolü

Az set yapılan sistemlerde her setin kalitesi daha da önem kazanır. Güncel veriler, setler **tükenişe yakın** yapıldığında geniş bir tekrar aralığında benzer hipertrofi elde edilebildiğini göstermektedir [4]. 2 set sisteminde setler, **yedekte 0–2 tekrar** kalacak yoğunlukta yapılmalıdır.

## Kimler için uygun?

- **Zamanı kısıtlı** olanlar için verimli bir seçenektir
- Toparlanma kapasitesi sınırlı olanlar için hacmi kontrollü tutar
- İleri seviye sporcularda ise toplam haftalık hacmi korumak için egzersiz sayısı veya antrenman sıklığı artırılmalıdır

## Sonuç

2 set sistemi, **haftalık hacim yeterli tutulduğu ve setler tükenişe yakın yapıldığı sürece** verimli bir yaklaşımdır. Tek başına "2 set" bir sihirli formül değildir; programın bütününe bakmak gerekir.

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır. Yeni bir antrenman programına başlamadan önce, özellikle **kalp-damar hastalığı, yüksek tansiyon, eklem veya bel-boyun sorunlarınız** varsa hekiminize danışın. Antrenman sırasında **göğüs ağrısı, baş dönmesi veya nefes darlığı** hissederseniz egzersizi hemen bırakın.

## Kaynaklar

[1] Krieger JW. Single vs. multiple sets of resistance exercise for muscle hypertrophy: a meta-analysis. J Strength Cond Res. 2010;24(4):1150-9. PMID: 20300012
[2] Schoenfeld BJ, et al. Dose-response relationship between weekly resistance training volume and increases in muscle mass: A systematic review and meta-analysis. J Sports Sci. 2017;35(11):1073-1082. PMID: 27433992
[3] Ralston GW, et al. The Effect of Weekly Set Volume on Strength Gain: A Meta-Analysis. Sports Med. 2017;47(12):2585-2601. PMID: 28755103
[4] Schoenfeld BJ, et al. Loading Recommendations for Muscle Strength, Hypertrophy, and Local Endurance: A Re-Examination of the Repetition Continuum. Sports (Basel). 2021;9(2):32. PMID: 33671664$avf$, 'published', 'antrenman', 'iki-set', 'AlpveFit', now() - interval '8 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'ppl-antrenman-sistemi', $avf$PPL Antrenman Sistemi$avf$, $avf$Push / Pull / Legs (İtiş / Çekiş / Bacak) sistemi nedir, kimler için uygundur ve haftalık planlama nasıl yapılır? Antrenman sıklığı araştırmalarıyla birlikte inceliyoruz.$avf$, $avf$**PPL (Push / Pull / Legs)**, kasları hareket desenlerine göre üç gruba ayıran popüler bir antrenman bölünmesidir:

- **Push (İtiş):** göğüs, omuz ön ve yan, triceps
- **Pull (Çekiş):** sırt, arka omuz, biceps
- **Legs (Bacak):** ön ve arka bacak, kalça, baldır; genellikle karın kasları da eklenir

## Haftalık düzen

PPL genellikle iki şekilde uygulanır:

- **3 gün:** Push – Pull – Legs; her kas grubu **haftada bir kez** çalışır
- **6 gün:** Push – Pull – Legs – Push – Pull – Legs – dinlenme; her kas grubu **haftada iki kez** çalışır

## Antrenman sıklığı ne kadar önemli?

Bir meta-analiz, her kas grubunu **haftada en az iki kez** çalışmanın, bir kez çalışmaya kıyasla daha fazla hipertrofiyle ilişkili olduğunu göstermiştir [1]. Daha güncel bir meta-analiz ise **haftalık hacim eşitlendiğinde** sıklığın kas büyümesi üzerindeki etkisinin küçük olduğunu; sıklığın asıl faydasının hacmi günlere **daha rahat dağıtmak** olduğunu ortaya koymuştur [2].

Bu da 6 günlük PPL'nin, yüksek haftalık hacmi kaliteli setlerle tamamlamak isteyen orta-ileri seviye sporcular için güçlü bir seçenek olduğunu gösterir.

## Avantajları

- Benzer hareket desenleri aynı günde toplandığı için **eklem ve kas yorgunluğu düzenli dağılır**
- Haftada iki kez çalışmaya uygun yapı, **yüksek haftalık hacmi** yönetmeyi kolaylaştırır
- Esnektir; 3, 4, 5 veya 6 güne uyarlanabilir

## Dikkat edilmesi gerekenler

- 6 günlük düzen **toparlanma, uyku ve beslenme** açısından yüksek talep yaratır
- Yeni başlayanlar için çoğu zaman gereğinden yoğundur; **tüm vücut** veya **upper/lower** bölünmesi daha uygun olabilir
- Bacak günü genellikle en yorucu gündür; programın geri kalanını etkilememesi için hacmi dikkatli ayarlanmalıdır

## Örnek bir Push günü yapısı

- 1 adet çok eklemli göğüs hareketi (ör. bench press)
- 1 adet çok eklemli omuz hareketi (ör. overhead press)
- 1 adet eğimli göğüs veya izolasyon hareketi
- 1 adet yan omuz izolasyonu
- 1 adet triceps hareketi

Set ve tekrar sayıları, kişinin seviyesi ve haftalık hacim hedefine göre **kişiye özel** belirlenmelidir.

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır. Yeni bir antrenman programına başlamadan önce, özellikle **kalp-damar hastalığı, yüksek tansiyon, eklem veya bel-boyun sorunlarınız** varsa hekiminize danışın. Antrenman sırasında **göğüs ağrısı, baş dönmesi veya nefes darlığı** hissederseniz egzersizi hemen bırakın.

## Kaynaklar

[1] Schoenfeld BJ, et al. Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis. Sports Med. 2016;46(11):1689-1697. PMID: 27102172
[2] Schoenfeld BJ, et al. How many times per week should a muscle be trained to maximize muscle hypertrophy? A systematic review and meta-analysis of studies examining the effects of resistance training frequency. J Sports Sci. 2019;37(11):1286-1295. PMID: 30558493$avf$, 'published', 'antrenman', 'ppl', 'AlpveFit', now() - interval '9 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'upper-lower-antrenman-sistemi', $avf$Upper Lower Antrenman Sistemi$avf$, $avf$Üst vücut / alt vücut bölünmesi, her kas grubunu haftada iki kez çalıştırmanın en dengeli yollarından biridir. Yapısını, avantajlarını ve kimlere uygun olduğunu anlatıyoruz.$avf$, $avf$**Upper / Lower (Üst / Alt)** sistemi, antrenman günlerini **üst vücut** ve **alt vücut** olarak ikiye ayırır. En yaygın uygulaması haftada **4 gündür**:

- Pazartesi: Üst vücut
- Salı: Alt vücut
- Perşembe: Üst vücut
- Cuma: Alt vücut

Bu düzende her kas grubu **haftada iki kez** çalışır.

## Bilim ne diyor?

Her kas grubunu haftada en az iki kez çalışmak, haftada bir kez çalışmaya kıyasla daha fazla hipertrofiyle ilişkilendirilmiştir [1]. Kuvvet açısından yapılan bir meta-analiz ise daha yüksek antrenman sıklığının kuvvet kazanımlarını artırdığını; ancak **hacim eşitlendiğinde** bu farkın belirgin şekilde azaldığını göstermiştir [2].

Upper/Lower sistemi, bu bulguları pratik bir haftalık plana dönüştürmenin en dengeli yollarından biridir.

## Avantajları

- Her kas grubunu haftada iki kez çalıştırır
- 4 günlük yapı **iş, okul ve toparlanma** ile dengelenebilir
- Ağır çok eklemli hareketler (squat, deadlift, bench press, row) için yeterli dinlenme sağlar
- Yeni başlayanlardan orta seviyeye kadar geniş bir kitleye uygundur

## Dikkat edilmesi gerekenler

- Üst vücut günleri çok sayıda kas grubunu kapsadığı için **uzayabilir**; egzersiz seçimi verimli yapılmalıdır
- Alt vücut günleri yorucudur; ağır squat ve deadlift aynı günde planlanıyorsa toplam hacim dikkatle ayarlanmalıdır

## Örnek yapı

**Üst vücut günü:**

- 1 itiş (ör. bench press) ve 1 çekiş (ör. barbell row) ana hareketi
- 1 dikey itiş (ör. omuz press) ve 1 dikey çekiş (ör. barfiks / lat pulldown)
- Kol ve omuz izolasyonları

**Alt vücut günü:**

- 1 squat varyasyonu
- 1 kalça menteşe hareketi (ör. Romanian deadlift)
- 1 tek bacak hareketi (ör. lunge)
- Bacak arkası, baldır ve karın

Set ve tekrar düzeni hedefe, seviyeye ve toparlanmaya göre **kişiye özel** belirlenmelidir.

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır. Yeni bir antrenman programına başlamadan önce, özellikle **kalp-damar hastalığı, yüksek tansiyon, eklem veya bel-boyun sorunlarınız** varsa hekiminize danışın. Antrenman sırasında **göğüs ağrısı, baş dönmesi veya nefes darlığı** hissederseniz egzersizi hemen bırakın.

## Kaynaklar

[1] Schoenfeld BJ, et al. Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis. Sports Med. 2016;46(11):1689-1697. PMID: 27102172
[2] Grgic J, et al. Effect of Resistance Training Frequency on Gains in Muscular Strength: A Systematic Review and Meta-Analysis. Sports Med. 2018;48(5):1207-1220. PMID: 29470825$avf$, 'published', 'antrenman', 'upper-lower', 'AlpveFit', now() - interval '10 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'split-calisma-sistemi', $avf$Split Çalışma Sistemi$avf$, $avf$Her güne bir veya iki kas grubunun düştüğü klasik split sistemi hâlâ etkili mi? Tüm vücut ve split programları karşılaştıran araştırmaların sonuçlarını özetliyoruz.$avf$, $avf$**Split (bölünmüş) çalışma sistemi**, her antrenman gününde bir veya iki kas grubunun çalışıldığı klasik vücut geliştirme yaklaşımıdır. Örneğin:

- Pazartesi: Göğüs
- Salı: Sırt
- Çarşamba: Omuz
- Perşembe: Bacak
- Cuma: Kol

Bu düzende her kas grubu genellikle **haftada yalnızca bir kez**, ancak o gün **yüksek hacimle** çalışılır.

## Split mi, tüm vücut mu?

Antrenmanlı erkeklerde yapılan bir çalışmada, haftalık hacim eşitken her kas grubunu haftada üç kez çalıştıran **tüm vücut** programı, her kas grubunu haftada bir kez çalıştıran split programına kıyasla bazı kas ölçümlerinde **daha fazla büyüme** sağlamıştır [1].

Ancak güncel bir sistematik derleme ve meta-analiz, **hacim eşitlendiğinde** split ve tüm vücut programlarının kuvvet ve kas büyümesi üzerinde **benzer** sonuçlar verdiğini göstermiştir [2]. Sıklık araştırmaları da hacim eşit olduğunda sıklığın etkisinin küçük olduğunu desteklemektedir [3].

Yani belirleyici olan bölünmenin adı değil, **haftalık toplam hacim, yoğunluk ve süreklilik**tir.

## Avantajları

- Her kas grubuna o gün **yoğun odak** sağlar
- Antrenmanlar kısa ve planlaması kolaydır
- Bir kas grubu yüksek hacimle çalıştıktan sonra **uzun toparlanma süresi** kalır

## Dezavantajları

- Her kas grubu haftada bir kez çalıştığı için tek seansta **çok yüksek hacim** gerekir; setlerin son kısmında kalite düşebilir
- Bir antrenman kaçırıldığında o kas grubu **iki hafta** çalışmamış olabilir
- Yeni başlayanlarda, sık tekrarla hareket öğrenme fırsatı azalır

## Kimler için uygun?

Split sistemi; antrenman alışkanlığı oturmuş, **haftada 5 gün** düzenli antrenmana zaman ayırabilen ve bu düzenden keyif alan kişiler için uygun olabilir. En iyi program, **sürdürebildiğiniz** programdır [2].

## Daha verimli bir split için

- Büyük kas gruplarına haftalık hacmin yeterli olduğundan emin olmak
- Mümkünse kas gruplarını **haftada iki kez** görecek hibrit bir split tercih etmek (ör. göğüs-sırt / bacak / omuz-kol tekrarı)
- Seans içindeki son setlerde kaliteyi korumak için hareket sırasını akıllıca planlamak

!uyari|Bu yazı **genel bilgilendirme** amaçlıdır. Yeni bir antrenman programına başlamadan önce, özellikle **kalp-damar hastalığı, yüksek tansiyon, eklem veya bel-boyun sorunlarınız** varsa hekiminize danışın. Antrenman sırasında **göğüs ağrısı, baş dönmesi veya nefes darlığı** hissederseniz egzersizi hemen bırakın.

## Kaynaklar

[1] Schoenfeld BJ, et al. Influence of Resistance Training Frequency on Muscular Adaptations in Well-Trained Men. J Strength Cond Res. 2015;29(7):1821-9. PMID: 25932981
[2] Ramos-Campo DJ, et al. Efficacy of Split Versus Full-Body Resistance Training on Strength and Muscle Growth: A Systematic Review With Meta-Analysis. J Strength Cond Res. 2024;38(7):1330-1340. PMID: 38595233
[3] Schoenfeld BJ, et al. How many times per week should a muscle be trained to maximize muscle hypertrophy? A systematic review and meta-analysis of studies examining the effects of resistance training frequency. J Sports Sci. 2019;37(11):1286-1295. PMID: 30558493$avf$, 'published', 'antrenman', 'split', 'AlpveFit', now() - interval '11 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'anabolik-steroidler-nedir', $avf$Anabolik Steroidler Nedir?$avf$, $avf$Anabolik-androjenik steroidler, testosteronun sentetik türevleridir. Tıbbi kullanım alanlarını, sporda kötüye kullanımını ve kanıtlanmış sağlık risklerini bilimsel kaynaklarla ele alıyoruz.$avf$, $avf$**Anabolik-androjenik steroidler (AAS)**, erkeklik hormonu **testosteronun** ve onun sentetik türevlerinin genel adıdır. "Anabolik" kas ve doku yapımını, "androjenik" ise erkek cinsiyet özelliklerinin gelişimini ifade eder.

## Tıpta ne için kullanılır?

Testosteron ve bazı türevleri; **testosteron eksikliği (hipogonadizm)**, belirli kas yıkımı durumları ve bazı nadir hastalıklar gibi **tıbbi endikasyonlarda**, yalnızca **hekim reçetesi ve takibiyle** kullanılır [1]. Bu kullanımda amaç fizyolojik düzeyleri yerine koymaktır; performans artırmak değildir.

## Sporda ve vücut geliştirmede kötüye kullanım

Tıbbi olmayan kullanımda AAS'ler genellikle **fizyolojik düzeylerin çok üzerinde** ve çoğu zaman birden fazla madde bir arada kullanılır. Endokrin Derneği'nin (Endocrine Society) bilimsel bildirgesi, performans artırıcı ilaçların yaygın kullanımının ciddi bir **halk sağlığı sorunu** olduğunu vurgular [2].

AAS'ler **Dünya Anti-Doping Ajansı (WADA)** yasaklı listesinde yer alır; lisanslı sporcularda kullanımı **doping ihlali** sayılır.

## Kanıtlanmış sağlık riskleri

Bilimsel literatür, AAS kötüye kullanımının pek çok organ sistemini etkileyebildiğini göstermektedir [2,3]:

- **Kalp-damar sistemi:** Uzun süreli kullanıcılarda yapılan çalışmalarda **sol ventrikül pompa fonksiyonunda azalma** ve **koroner damar plağında artış** saptanmıştır [4]. Kötü kolesterol (LDL) artışı ve iyi kolesterol (HDL) düşüşü sık görülür.
- **Hormonal sistem:** Vücudun kendi testosteron üretimi baskılanır. Bırakıldıktan sonra bu baskılanma uzun sürebilir; eski kullanıcılarda, kullanımı bırakmalarından **yıllar sonra bile** daha düşük testosteron düzeyleri ve hipogonadizm belirtileri bildirilmiştir [5].
- **Üreme sağlığı:** sperm üretiminde azalma, kısırlık, testislerde küçülme; erkeklerde meme dokusu büyümesi (jinekomasti)
- **Karaciğer:** özellikle ağızdan alınan bazı türevlerle karaciğer hasarı
- **Ruh sağlığı:** saldırganlık, duygu durum dalgalanmaları, bırakma döneminde depresyon ve **bağımlılık** gelişebilir [6]
- **Kadınlarda:** ses kalınlaşması, kıllanma, adet düzensizliği gibi **kalıcı olabilen** erkeksi değişiklikler

## Karaborsa ürünlerin ek riskleri

Reçetesiz temin edilen ürünlerde **içerik, miktar ve sterilite garantisi yoktur**. Etikette yazandan farklı madde veya miktar içerebilir; enjeksiyon yoluyla kullanımda **enfeksiyon** riski de eklenir.

## Doğal yaklaşımın gücü

Doğru planlanmış bir antrenman programı, yeterli protein ve kalori, kaliteli uyku ve sabır; **kalıcı ve sağlıklı** bir gelişim için temel yoldur. AlpveFit olarak tarafımızca hazırlanan programlar bu ilkeye dayanır.

!uyari|Bu yazı yalnızca **bilgilendirme ve farkındalık** amacı taşır; herhangi bir maddenin kullanımını **önermez, desteklemez** ve kullanım, doz veya kür bilgisi içermez. Bu maddelerin reçetesiz ve tıbbi olmayan amaçla kullanımı **ciddi ve kalıcı sağlık sorunlarına** yol açabilir, ülkemizde ve sporda **yasal ve disiplin yaptırımları** doğurabilir. Sağlığınızla ilgili her karar için **hekiminize** başvurun.

!bilgi|Geçmişte veya şu anda bu tür maddeler kullandıysanız ve **halsizlik, cinsel istek kaybı, depresif duygu durumu** gibi belirtiler yaşıyorsanız, yargılanma kaygısı duymadan bir **endokrinoloji veya üroloji uzmanına** başvurmanız önemlidir.

## Kaynaklar

[1] Bhasin S, et al. Testosterone Therapy in Men With Hypogonadism: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab. 2018;103(5):1715-1744. PMID: 29562364
[2] Pope HG Jr, et al. Adverse health consequences of performance-enhancing drugs: an Endocrine Society scientific statement. Endocr Rev. 2014;35(3):341-75. PMID: 24423981
[3] Horwitz H, et al. Health consequences of androgenic anabolic steroid use. J Intern Med. 2019;285(3):333-340. PMID: 30460728
[4] Baggish AL, et al. Cardiovascular Toxicity of Illicit Anabolic-Androgenic Steroid Use. Circulation. 2017;135(21):1991-2002. PMID: 28533317
[5] Rasmussen JJ, et al. Former Abusers of Anabolic Androgenic Steroids Exhibit Decreased Testosterone Levels and Hypogonadal Symptoms Years after Cessation: A Case-Control Study. PLoS One. 2016;11(8):e0161208. PMID: 27532478
[6] Kanayama G, et al. Treatment of anabolic-androgenic steroid dependence: Emerging evidence and its implications. Drug Alcohol Depend. 2010;109(1-3):6-13. PMID: 20188494$avf$, 'published', 'farmakoloji', 'steroid', 'AlpveFit', now() - interval '12 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'peptitler-nedir', $avf$Peptitler Nedir?$avf$, $avf$Peptitler, kısa amino asit zincirleridir. İnsülin gibi onaylı ilaçlardan, internette 'araştırma ürünü' olarak satılan maddelere uzanan geniş bir yelpazeyi bilimsel kanıtlarıyla değerlendiriyoruz.$avf$, $avf$**Peptitler**, amino asitlerin birbirine bağlanmasıyla oluşan **kısa protein zincirleridir**. Vücudumuzda pek çok hormon ve sinyal molekülü peptit yapısındadır. "Peptit" kelimesi bu nedenle çok geniş bir grubu kapsar.

## Onaylı peptit ilaçlar

Tıpta pek çok peptit, **etkinliği ve güvenliği klinik çalışmalarla kanıtlanmış** ilaç olarak kullanılır. **İnsülin** bunun en bilinen örneğidir. Bu ilaçlar yalnızca **hekim reçetesiyle**, belirli hastalıkların tedavisi için kullanılır.

## Sporda ve vücut geliştirmede gündeme gelen peptitler

Vücut geliştirme çevrelerinde konuşulan peptitler genellikle şu gruplara girer:

- **Büyüme hormonu ve onu salgılatan maddeler**
- **Doku onarımı** iddiasıyla pazarlanan peptitler (ör. BPC-157)

Bu maddelerin önemli bir kısmı **ilaç olarak onaylı değildir**; internette çoğu zaman "yalnızca araştırma amaçlıdır" ibaresiyle satılır.

## Büyüme hormonu: kanıtlar ne diyor?

Büyüme hormonunun sporda kötüye kullanımı, kapsamlı bilimsel incelemelere konu olmuştur [1]. Sağlıklı sporcularda yapılan çalışmaların sistematik derlemesi, büyüme hormonunun yağsız vücut kütlesini artırabildiğini ancak bunun **kuvvet veya egzersiz kapasitesinde belirgin bir artışa dönüştüğünü göstermediğini**; buna karşın **sıvı tutulması ve yorgunluk** gibi yan etkilerin daha sık görüldüğünü ortaya koymuştur [2]. Sağlıklı yaşlılarda yapılan çalışmalarda da benzer şekilde yan etkiler belirgin bulunmuştur [3].

## BPC-157 gibi "onarım peptitleri"

BPC-157 üzerine yapılan bir sistematik derleme, iyileşmeye katkı iddialarının **büyük ölçüde hayvan çalışmalarına** dayandığını; **insanda güvenlik ve etkinlik verilerinin yetersiz** olduğunu ve düzenlenmemiş ürünlerin ciddi riskler taşıdığını vurgulamıştır [4].

## Temel riskler

- **Kanıt eksikliği:** insanda yeterli klinik çalışma yoktur
- **Ürün güvenliği:** "araştırma ürünü" olarak satılan maddelerde **saflık, içerik ve sterilite garantisi** yoktur
- **Enjeksiyon riskleri:** enfeksiyon, apse ve alerjik reaksiyonlar
- **Doping:** büyüme hormonu ve pek çok peptit, **WADA yasaklı listesinde** yer alır

!uyari|Bu yazı yalnızca **bilgilendirme ve farkındalık** amacı taşır; herhangi bir maddenin kullanımını **önermez, desteklemez** ve kullanım, doz veya kür bilgisi içermez. Bu maddelerin reçetesiz ve tıbbi olmayan amaçla kullanımı **ciddi ve kalıcı sağlık sorunlarına** yol açabilir, ülkemizde ve sporda **yasal ve disiplin yaptırımları** doğurabilir. Sağlığınızla ilgili her karar için **hekiminize** başvurun.

## Kaynaklar

[1] Holt RIG, et al. The Use and Abuse of Growth Hormone in Sports. Endocr Rev. 2019;40(4):1163-1185. PMID: 31180479
[2] Liu H, et al. Systematic review: the effects of growth hormone on athletic performance. Ann Intern Med. 2008;148(10):747-58. PMID: 18347346
[3] Liu H, et al. Systematic review: the safety and efficacy of growth hormone in the healthy elderly. Ann Intern Med. 2007;146(2):104-15. PMID: 17227934
[4] Vasireddi N, et al. Emerging Use of BPC-157 in Orthopaedic Sports Medicine: A Systematic Review. HSS J. 2025;21(4):485-495. PMID: 40756949$avf$, 'published', 'farmakoloji', 'peptit', 'AlpveFit', now() - interval '13 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'sarmlar-nedir', $avf$SARM'lar Nedir?$avf$, $avf$Seçici androjen reseptör modülatörleri (SARM), 'yan etkisiz steroid' olarak pazarlanır. Bu iddianın neden doğru olmadığını ve bilinen riskleri bilimsel çalışmalarla açıklıyoruz.$avf$, $avf$**SARM (Selective Androgen Receptor Modulator – Seçici Androjen Reseptör Modülatörü)**, androjen reseptörüne bağlanarak kas ve kemik dokusunda testosterona benzer etki göstermesi amacıyla geliştirilmiş **deneysel** moleküllerdir.

## Neden geliştirildiler?

SARM'lar; kas erimesi, osteoporoz ve bazı kronik hastalıklarda kas kaybını önlemek amacıyla, testosteronun istenmeyen etkilerinden kaçınma hedefiyle araştırılmıştır [1]. Ancak bugüne kadar bu moleküllerin hiçbiri bu amaçlarla **ilaç olarak onay almamıştır**.

## "Yan etkisiz steroid" iddiası doğru mu?

Hayır. Sağlıklı genç erkeklerde yapılan kontrollü bir çalışmada, bir SARM olan LGD-4033, yalnızca birkaç haftalık kullanımda bile **testosteron düzeylerini ve iyi kolesterolü (HDL) baskılamıştır** [2].

Sağlıklı yetişkinlerde SARM güvenliğini inceleyen bir sistematik derleme ise **karaciğer hasarı, kas yıkımı (rabdomiyoliz) ve tendon kopması** gibi ciddi olumsuz olayları raporlamış ve rekreasyonel kullanımın önerilmemesi gerektiği sonucuna varmıştır [3].

## Ürünlerde ne var?

İnternetten satın alınan ve SARM olarak pazarlanan **44 ürünün** analiz edildiği bir çalışmada, ürünlerin yalnızca **yaklaşık yarısında** gerçekten SARM bulunmuş; önemli bir kısmında **etikette yazmayan başka onaysız maddeler** tespit edilmiş, birçoğunda içerik miktarı etiketle uyuşmamıştır [4].

Bu, kullanıcının **ne aldığını gerçekte bilmediği** anlamına gelir.

## Özetle riskler

- Klinik onay yoktur; **uzun vadeli güvenlik bilinmemektedir**
- Kendi hormon üretimini **baskılayabilir**
- Kolesterol profilini **olumsuz etkileyebilir**
- **Karaciğer hasarı** ve diğer ciddi olaylar bildirilmiştir
- Ürün içeriği **güvenilir değildir**
- **WADA yasaklı listesinde** yer alır

!uyari|Bu yazı yalnızca **bilgilendirme ve farkındalık** amacı taşır; herhangi bir maddenin kullanımını **önermez, desteklemez** ve kullanım, doz veya kür bilgisi içermez. Bu maddelerin reçetesiz ve tıbbi olmayan amaçla kullanımı **ciddi ve kalıcı sağlık sorunlarına** yol açabilir, ülkemizde ve sporda **yasal ve disiplin yaptırımları** doğurabilir. Sağlığınızla ilgili her karar için **hekiminize** başvurun.

## Kaynaklar

[1] Solomon ZJ, et al. Selective Androgen Receptor Modulators: Current Knowledge and Clinical Applications. Sex Med Rev. 2019;7(1):84-94. PMID: 30503797
[2] Basaria S, et al. The safety, pharmacokinetics, and effects of LGD-4033, a novel nonsteroidal oral, selective androgen receptor modulator, in healthy young men. J Gerontol A Biol Sci Med Sci. 2013;68(1):87-95. PMID: 22459616
[3] Vignali JD, et al. Systematic Review of Safety of Selective Androgen Receptor Modulators in Healthy Adults: Implications for Recreational Users. J Xenobiot. 2023;13(2):218-236. PMID: 37218811
[4] Van Wagoner RM, et al. Chemical Composition and Labeling of Substances Marketed as Selective Androgen Receptor Modulators and Sold via the Internet. JAMA. 2017;318(20):2004-2010. PMID: 29183075$avf$, 'published', 'farmakoloji', 'sarm', 'AlpveFit', now() - interval '14 minutes'
) ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts (slug, title, excerpt, body, status, category, cover, author_name, published_at) VALUES (
  'pct-icin-gerekli-prosedurler-nedir', $avf$PCT İçin Gerekli Prosedürler Nedir?$avf$, $avf$PCT (post-cycle therapy), hormon baskılayıcı madde kullanımının ardından vücudun kendi hormon üretiminin toparlanma sürecidir. Bu süreçte neden tıbbi takip şart olduğunu açıklıyoruz.$avf$, $avf$**PCT (Post Cycle Therapy)**, anabolik steroid veya SARM gibi hormon baskılayıcı maddelerin bırakılmasının ardından, vücudun **kendi testosteron üretiminin yeniden başlaması** sürecini destekleme yaklaşımına verilen addır.

Bu yazı **kür veya ilaç protokolü içermez**; çünkü bu süreç kişiye özel değerlendirme gerektiren **tıbbi bir durumdur**.

## Neden ihtiyaç duyulur?

Dışarıdan alınan androjenler, beyindeki hipotalamus ve hipofiz bezine "yeterli hormon var" sinyali verir. Sonuç olarak testislerin testosteron ve sperm üretimini yöneten hormonlar (LH ve FSH) baskılanır. Bu tabloya **anabolik steroide bağlı hipogonadizm** denir [1].

Kullanım bırakıldığında bu sistemin kendiliğinden toparlanması **haftalar ile aylar**, bazı kişilerde daha da uzun sürebilir. Eski kullanıcılarda yapılan bir çalışmada, kullanımı bırakmalarından **yıllar sonra bile** testosteron düzeylerinin daha düşük olduğu ve hipogonadizm belirtilerinin devam ettiği görülmüştür [2].

## Bu dönemde neler yaşanabilir?

- Halsizlik, enerji ve motivasyon düşüklüğü
- Cinsel istek kaybı ve sertleşme sorunları
- **Depresif duygu durumu**; bu dönem, maddeye yeniden başlama ve **bağımlılık** açısından da risklidir [3]
- Kas kütlesi ve kuvvette azalma

## Gerekli prosedürler: tıbbi değerlendirme

Bu süreçte doğru yaklaşım, internetteki "PCT protokolleri" değil, **hekim tarafından yürütülen bir değerlendirme ve takip** sürecidir. Bu süreç genellikle şunları içerir [1,4]:

- **Ayrıntılı öykü:** kullanılan maddeler, süreleri ve şikâyetler; hekiminize **dürüst bilgi** vermeniz doğru tedavi için şarttır
- **Kan tahlilleri:** toplam ve serbest testosteron, LH, FSH, östradiol, prolaktin; ayrıca **tam kan sayımı (hematokrit), lipid profili ve karaciğer enzimleri**
- **Üreme sağlığı değerlendirmesi:** çocuk sahibi olma planı varsa **sperm analizi**
- **Kalp-damar değerlendirmesi:** tansiyon ve gerekirse kardiyolojik inceleme
- **Ruh sağlığı desteği:** duygu durumu belirtileri varsa psikiyatri desteği

Hekim, bulgulara göre yalnızca izlem önerebilir veya hormon sisteminin toparlanmasını desteklemek amacıyla **belirli ilaç gruplarını** değerlendirebilir. **Hangi ilacın, hangi dozda ve ne kadar süre** kullanılacağı tamamen kişiye özeldir ve yalnızca hekim kararıdır [1].

## Kendi başına "PCT" neden tehlikeli?

- Kullanılan ilaçların **yan etkileri ve etkileşimleri** vardır
- Altta yatan başka bir hormon bozukluğu **gözden kaçabilir**
- Kalp, karaciğer ve kan değerlerindeki sorunlar **takip edilmeden** kalır
- Kalıcı kısırlık gibi riskler **zamanında fark edilmeyebilir**

## En güvenli PCT

Hormon sistemini korumanın en güvenli yolu, bu maddeleri **hiç kullanmamaktır**. Kullandıysanız, bırakma sürecini yalnız yönetmeye çalışmak yerine bir **endokrinoloji veya üroloji uzmanına** başvurun.

!uyari|Bu yazı yalnızca **bilgilendirme ve farkındalık** amacı taşır; herhangi bir maddenin kullanımını **önermez, desteklemez** ve kullanım, doz veya kür bilgisi içermez. Bu maddelerin reçetesiz ve tıbbi olmayan amaçla kullanımı **ciddi ve kalıcı sağlık sorunlarına** yol açabilir, ülkemizde ve sporda **yasal ve disiplin yaptırımları** doğurabilir. Sağlığınızla ilgili her karar için **hekiminize** başvurun.

## Kaynaklar

[1] Rahnema CD, et al. Anabolic steroid-induced hypogonadism: diagnosis and treatment. Fertil Steril. 2014;101(5):1271-9. PMID: 24636400
[2] Rasmussen JJ, et al. Former Abusers of Anabolic Androgenic Steroids Exhibit Decreased Testosterone Levels and Hypogonadal Symptoms Years after Cessation: A Case-Control Study. PLoS One. 2016;11(8):e0161208. PMID: 27532478
[3] Kanayama G, et al. Treatment of anabolic-androgenic steroid dependence: Emerging evidence and its implications. Drug Alcohol Depend. 2010;109(1-3):6-13. PMID: 20188494
[4] Bhasin S, et al. Testosterone Therapy in Men With Hypogonadism: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab. 2018;103(5):1715-1744. PMID: 29562364$avf$, 'published', 'farmakoloji', 'pct', 'AlpveFit', now() - interval '15 minutes'
) ON CONFLICT (slug) DO NOTHING;
