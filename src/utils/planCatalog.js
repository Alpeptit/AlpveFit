// Plan oluşturucu katalogları — beslenme, antrenman, supplement, farmakoloji ve değerli notlar.
// TEK KAYNAK: sunucu doğrulaması ve arayüz (GET /api/plan-catalog) bu dosyayı kullanır.
// Sistem plan İÇERİĞİ üretmez veya önermez: yalnız seçilebilecek kalemleri ve hesap (makro, hacim, mL) kurallarını tanımlar.

// ------------------------------------------------------------------ BESLENME
// Değerler 100 g ÇİĞ (pişirilmemiş) ağırlık içindir. Kaynak: USDA FoodData Central (SR Legacy / Foundation Foods).
// Yalnız yumurtalar ADET ile, diğer tüm besinler GRAM ile planlanır (üyeye gram ve lbs olarak gösterilir).
// Yumurta boyları Türk Gıda Kodeksi / AB sınıflarına göredir (M: 53–63 g, L: 63–73 g kabuklu); yenilebilir kısım ≈ %88 kabul edilmiştir.
//   M bütün ≈ 51 g (beyaz ≈ 34 g) · L bütün ≈ 60 g (beyaz ≈ 40 g).
export const FOOD_GROUPS = [["protein", "Protein kaynakları", "egg"], ["carb", "Karbonhidrat kaynakları", "utensils"], ["fruit", "Meyveler ve bal", "apple"], ["fat", "Yağ kaynakları", "drop"]];
export const FOODS = [
  // key, ad, grup, birim ("g" | "adet"), adet başına gram, 100 g için [kcal, protein, karbonhidrat, yağ], kaynak notu
  ["egg_white_m", "Yumurta Beyazı (M)", "protein", "adet", 34, [52, 10.9, 0.73, 0.17], "USDA SR Legacy: Egg, white, raw, fresh (FDC 172183)"],
  ["egg_whole_m", "Yumurta Bütün (M)", "protein", "adet", 51, [143, 12.56, 0.72, 9.51], "USDA SR Legacy: Egg, whole, raw, fresh"],
  ["egg_white_l", "Yumurta Beyazı (L)", "protein", "adet", 40, [52, 10.9, 0.73, 0.17], "USDA SR Legacy: Egg, white, raw, fresh (FDC 172183)"],
  ["egg_whole_l", "Yumurta Bütün (L)", "protein", "adet", 60, [143, 12.56, 0.72, 9.51], "USDA SR Legacy: Egg, whole, raw, fresh"],
  ["chicken_breast", "Tavuk Göğüs", "protein", "g", 0, [112, 22.5, 0, 1.93], "USDA Foundation: Chicken, breast, boneless, skinless, raw (FDC 2646170)"],
  ["beef_lean", "Yağsız Kıyma", "protein", "g", 0, [137, 21.41, 0, 5.0], "USDA SR Legacy: Beef, ground, 95% lean / 5% fat, raw"],
  ["beef_low", "Az Yağlı Kıyma (%10–15)", "protein", "g", 0, [196, 19.3, 0, 12.5], "USDA SR Legacy: Beef, ground, 90/10 ve 85/15, raw — ortalama"],
  ["salmon", "Norveç Somonu", "protein", "g", 0, [208, 20.42, 0, 13.42], "USDA SR Legacy: Fish, salmon, Atlantic, farmed, raw"],
  ["tuna", "Ton Balığı", "protein", "g", 0, [109, 24.4, 0, 0.49], "USDA SR Legacy: Fish, tuna, fresh, yellowfin, raw (FDC 175159)"],
  ["tilapia", "Tilapya Balık", "protein", "g", 0, [96, 20.08, 0, 1.7], "USDA SR Legacy: Fish, tilapia, raw (FDC 175176)"],
  ["whiting", "Mezgit Balık", "protein", "g", 0, [90, 18.31, 0, 1.31], "USDA SR Legacy: Fish, whiting, mixed species, raw"],
  ["greek_yogurt", "Süzme Yoğurt", "protein", "g", 0, [73, 9.95, 3.94, 1.92], "USDA SR Legacy: Yogurt, Greek, plain, lowfat (az yağlı süzme yoğurt)"],
  ["lor", "Lor Peyniri", "protein", "g", 0, [72, 12.39, 2.72, 1.02], "USDA SR Legacy: Cheese, cottage, lowfat, 1% milkfat — az yağlı lor için en yakın karşılık"],
  ["sweet_potato", "Tatlı Patates", "carb", "g", 0, [86, 1.57, 20.12, 0.05], "USDA SR Legacy: Sweet potato, raw, unprepared"],
  ["potato", "Sarı Patates", "carb", "g", 0, [77, 2.05, 17.49, 0.09], "USDA SR Legacy: Potatoes, flesh and skin, raw"],
  ["oats", "Yulaf Ezmesi", "carb", "g", 0, [379, 13.15, 67.7, 6.52], "USDA Foundation: Oats, whole grain, rolled, old fashioned"],
  ["rice_basmati", "Basmati Pirinç", "carb", "g", 0, [365, 7.13, 79.95, 0.66], "USDA SR Legacy: Rice, white, long-grain, regular, raw"],
  ["rice_jasmine", "Yasemin Pirinç", "carb", "g", 0, [365, 7.13, 79.95, 0.66], "USDA SR Legacy: Rice, white, long-grain, regular, raw"],
  ["rice_baldo", "Baldo Pirinç", "carb", "g", 0, [360, 6.61, 79.34, 0.58], "USDA SR Legacy: Rice, white, medium-grain, raw"],
  ["rye_bread", "Çavdar Ekmek", "carb", "g", 0, [259, 8.5, 48.3, 3.3], "USDA SR Legacy: Bread, rye"],
  ["ww_bread", "Tam Buğday Ekmek", "carb", "g", 0, [252, 12.45, 42.71, 3.5], "USDA SR Legacy: Bread, whole-wheat, commercially prepared"],
  ["banana", "Muz", "fruit", "g", 0, [89, 1.09, 22.84, 0.33], "USDA SR Legacy: Bananas, raw"],
  ["pineapple", "Ananas", "fruit", "g", 0, [50, 0.54, 13.12, 0.12], "USDA SR Legacy: Pineapple, raw, all varieties"],
  ["apple_green", "Yeşil Elma", "fruit", "g", 0, [58, 0.44, 13.61, 0.19], "USDA SR Legacy: Apples, raw, granny smith, with skin"],
  ["apple_red", "Kırmızı Elma", "fruit", "g", 0, [59, 0.27, 14.06, 0.2], "USDA SR Legacy: Apples, raw, red delicious, with skin"],
  ["blueberry", "Yaban Mersini", "fruit", "g", 0, [57, 0.74, 14.49, 0.33], "USDA SR Legacy: Blueberries, raw"],
  ["raspberry", "Ahududu", "fruit", "g", 0, [52, 1.2, 11.94, 0.65], "USDA SR Legacy: Raspberries, raw"],
  ["blackberry", "Böğürtlen", "fruit", "g", 0, [43, 1.39, 9.61, 0.49], "USDA SR Legacy: Blackberries, raw"],
  ["honey", "Bal", "fruit", "g", 0, [304, 0.3, 82.4, 0], "USDA SR Legacy: Honey"],
  ["olive_oil", "Zeytinyağı (Soğuk Sıkım)", "fat", "g", 0, [884, 0, 0, 100], "USDA SR Legacy: Oil, olive, salad or cooking"],
  ["coconut_oil", "Hindistancevizi Yağı (Soğuk Sıkım)", "fat", "g", 0, [892, 0, 0, 99.06], "USDA SR Legacy: Oil, coconut"],
  ["avocado", "Avokado", "fat", "g", 0, [160, 2.0, 8.53, 14.66], "USDA SR Legacy: Avocados, raw, all commercial varieties"],
].map(([key, name, group, unit, pieceG, m, src]) => ({ key, name, group, unit, pieceG, kcal: m[0], protein: m[1], carb: m[2], fat: m[3], source: src }));
export const FOOD_BY_KEY = Object.fromEntries(FOODS.map((f) => [f.key, f]));
export const MEALS_MAX = 8, FIRST_MEAL = "Sabah Kahvaltısı", LAST_MEAL = "Son Öğün";

// ------------------------------------------------------------------ ANTRENMAN
export const MUSCLE_GROUPS = [
  ["chest", "Göğüs Antrenmanı", "muscle", ["Bench Press", "Incline Bench Press", "Decline Bench Press", "Dumbbell Press", "Incline Dumbbell Press", "Decline Dumbbell Press", "Dumbbell Fly", "Incline Dumbbell Fly",
    "Cable Crossover", "Low Cable Fly", "High Cable Fly", "Pec Deck (Butterfly)", "Machine Chest Press", "Incline Machine Press", "Smith Machine Bench Press", "Incline Smith Press", "Hammer Strength Chest Press", "Dips (Göğüs)", "Push-up (Şınav)", "Svend Press", "Pullover"]],
  ["shoulder", "Omuz Antrenmanı", "target", ["Overhead Press (Barbell)", "Seated Dumbbell Press", "Arnold Press", "Machine Shoulder Press", "Smith Machine Shoulder Press", "Lateral Raise (Dumbbell)", "Cable Lateral Raise",
    "Machine Lateral Raise", "Front Raise", "Cable Front Raise", "Reverse Pec Deck", "Rear Delt Fly (Dumbbell)", "Face Pull", "Upright Row", "Lu Raise", "Landmine Press", "Barbell Shrug", "Dumbbell Shrug"]],
  ["back", "Sırt Antrenmanı", "layers", ["Deadlift", "Rack Pull", "Pull-up (Barfiks)", "Chin-up", "Lat Pulldown (Geniş)", "Lat Pulldown (Dar / V-Bar)", "Barbell Row", "Pendlay Row", "Dumbbell Row (Tek kol)",
    "T-Bar Row", "Seated Cable Row", "Chest Supported Row", "Machine Row", "Meadows Row", "Straight Arm Pulldown", "Cable Pullover", "Hyperextension", "Good Morning"]],
  ["legs", "Bacak Antrenmanı", "steps", ["Back Squat", "Front Squat", "Hack Squat", "Leg Press", "Smith Machine Squat", "Bulgarian Split Squat", "Walking Lunge", "Reverse Lunge", "Goblet Squat", "Leg Extension",
    "Romanian Deadlift", "Stiff-Leg Deadlift", "Lying Leg Curl", "Seated Leg Curl", "Hip Thrust", "Glute Bridge", "Cable Kickback", "Hip Abduction", "Hip Adduction", "Standing Calf Raise", "Seated Calf Raise", "Leg Press Calf Raise", "Step-up", "Sissy Squat"]],
  ["abs", "Karın Antrenmanı", "body", ["Crunch", "Cable Crunch", "Machine Crunch", "Reverse Crunch", "Hanging Leg Raise", "Lying Leg Raise", "Captain's Chair Knee Raise", "Plank", "Side Plank", "Russian Twist",
    "Ab Wheel Rollout", "Bicycle Crunch", "Dead Bug", "Pallof Press", "Wood Chop (Cable)", "Vacuum (Karın içe çekme)", "Mountain Climber", "V-up"]],
  ["biceps", "Ön Kol Antrenmanı", "muscle", ["Barbell Curl", "EZ Bar Curl", "Dumbbell Curl", "Alternating Dumbbell Curl", "Hammer Curl", "Incline Dumbbell Curl", "Preacher Curl", "Machine Preacher Curl", "Concentration Curl",
    "Cable Curl", "Bayesian Cable Curl", "Spider Curl", "Reverse Curl", "Zottman Curl", "Wrist Curl", "Reverse Wrist Curl", "Farmer's Walk"]],
  ["triceps", "Arka Kol Antrenmanı", "muscle", ["Close Grip Bench Press", "Dips (Arka kol)", "Bench Dip", "Skull Crusher (EZ Bar)", "Dumbbell Skull Crusher", "Overhead Dumbbell Extension", "Overhead Cable Extension",
    "Rope Pushdown", "Straight Bar Pushdown", "V-Bar Pushdown", "Single Arm Cable Pushdown", "Dumbbell Kickback", "Cable Kickback (Arka kol)", "JM Press", "Machine Dip", "Diamond Push-up"]],
  ["cardio", "Kardiyo Egzersizi", "pulse", ["Koşu bandı (yürüyüş)", "Koşu bandı (eğimli yürüyüş)", "Koşu bandı (koşu)", "Eliptik", "Sabit bisiklet", "Spin bisiklet", "Kürek (Rowing)", "Merdiven (Stair climber)",
    "Açık hava yürüyüşü", "Açık hava koşusu", "HIIT", "İp atlama", "Yüzme", "Assault bike", "Sled push"]],
].map(([key, name, icon, exercises]) => ({ key, name, icon, exercises }));
export const GROUP_BY_KEY = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g.key, g]));
export const DAYS_MAX = 7, EXERCISES_PER_DAY_MAX = 20;

// ------------------------------------------------------------------ SUPPLEMENT
export const SUPP_GROUPS = [
  ["protein", "Protein", "egg", ["Whey Protein", "Whey Protein İzolat", "Hidrolize Whey", "Kazein", "Yumurta Proteini", "Vegan Protein (Bezelye / Pirinç)", "Sığır Proteini"]],
  ["amino", "Amino Asitler", "flask", ["BCAA", "EAA", "L-Glutamin", "L-Karnitin", "Asetil L-Karnitin", "Beta-Alanin", "L-Sitrülin Malat", "L-Arjinin", "Taurin", "Glisin", "L-Tirozin", "HMB"]],
  ["creatine", "Kreatin", "bolt", ["Kreatin Monohidrat", "Kreatin HCl", "Kre-Alkalyn"]],
  ["perf", "Performans ve Enerji", "flame", ["Kafein", "Pre-Workout", "Nitrat (Pancar Kökü)", "Elektrolit"]],
  ["carb", "Karbonhidrat ve Kilo Alımı", "utensils", ["Maltodekstrin", "Dekstroz", "Cyclic Dextrin", "Waxy Maize", "Gainer (Kilo alımı)"]],
  ["fat", "Yağ Asitleri", "drop", ["Omega-3 (Balık Yağı)", "Krill Yağı", "CLA", "MCT Yağı"]],
  ["vitamin", "Vitaminler", "pill", ["Multivitamin", "Vitamin A", "Vitamin B1 (Tiamin)", "Vitamin B2 (Riboflavin)", "Vitamin B3 (Niasin)", "Vitamin B5 (Pantotenik asit)", "Vitamin B6", "Vitamin B7 (Biotin)",
    "Vitamin B9 (Folat)", "Vitamin B12", "B Kompleks", "Vitamin C", "Vitamin D3", "Vitamin D3 + K2", "Vitamin E", "Vitamin K2"]],
  ["mineral", "Mineraller", "shield", ["Magnezyum (Sitrat / Bisglisinat)", "Çinko", "ZMA", "Kalsiyum", "Demir", "Potasyum", "Selenyum", "İyot", "Krom", "Bakır", "Manganez", "Sodyum (Tuz tableti)"]],
  ["other", "Diğer", "spark", ["Kolajen", "Glukozamin + Kondroitin", "MSM", "Ashwagandha", "Rhodiola", "Melatonin", "Probiyotik", "Koenzim Q10", "Psyllium (Lif)", "Yeşil Çay Ekstresi", "Zerdeçal (Kurkumin)",
    "Alfa Lipoik Asit", "NAC", "Elektrolit Tozu", "Sindirim Enzimi"]],
].map(([key, name, icon, items]) => ({ key, name, icon, items }));
// Her kalemin görsel kimliği: [biçim, kısa kod]. Biçim çizimi arayüzde (avf-glyphs.js) yapılır; kod rozet olarak yazılır.
// Biçimler: tub (toz kutu), capsule, softgel, tablet, bottle (sıvı), leaf (bitkisel), element (mineral), vial, ampoule, blister.
export const SUPP_GLYPH = {
  "Whey Protein": ["tub", "WP"], "Whey Protein İzolat": ["tub", "ISO"], "Hidrolize Whey": ["tub", "HYD"], "Kazein": ["tub", "CAS"], "Yumurta Proteini": ["tub", "EGG"], "Vegan Protein (Bezelye / Pirinç)": ["tub", "VEG"], "Sığır Proteini": ["tub", "BEEF"],
  "BCAA": ["tub", "BCAA"], "EAA": ["tub", "EAA"], "L-Glutamin": ["tub", "GLN"], "L-Karnitin": ["bottle", "CAR"], "Asetil L-Karnitin": ["capsule", "ALC"], "Beta-Alanin": ["tub", "βA"], "L-Sitrülin Malat": ["tub", "CIT"], "L-Arjinin": ["capsule", "ARG"],
  "Taurin": ["tub", "TAU"], "Glisin": ["tub", "GLY"], "L-Tirozin": ["capsule", "TYR"], "HMB": ["capsule", "HMB"],
  "Kreatin Monohidrat": ["tub", "CM"], "Kreatin HCl": ["capsule", "HCL"], "Kre-Alkalyn": ["capsule", "KRE"],
  "Kafein": ["tablet", "CAF"], "Pre-Workout": ["tub", "PRE"], "Nitrat (Pancar Kökü)": ["tub", "NO3"], "Elektrolit": ["tub", "ELK"],
  "Maltodekstrin": ["tub", "MAL"], "Dekstroz": ["tub", "DEX"], "Cyclic Dextrin": ["tub", "HBC"], "Waxy Maize": ["tub", "WXM"], "Gainer (Kilo alımı)": ["tub", "GNR"],
  "Omega-3 (Balık Yağı)": ["softgel", "Ω3"], "Krill Yağı": ["softgel", "KRL"], "CLA": ["softgel", "CLA"], "MCT Yağı": ["bottle", "MCT"],
  "Multivitamin": ["tablet", "MV"], "Vitamin A": ["capsule", "A"], "Vitamin B1 (Tiamin)": ["tablet", "B1"], "Vitamin B2 (Riboflavin)": ["tablet", "B2"], "Vitamin B3 (Niasin)": ["tablet", "B3"], "Vitamin B5 (Pantotenik asit)": ["tablet", "B5"],
  "Vitamin B6": ["tablet", "B6"], "Vitamin B7 (Biotin)": ["tablet", "B7"], "Vitamin B9 (Folat)": ["tablet", "B9"], "Vitamin B12": ["tablet", "B12"], "B Kompleks": ["tablet", "B+"], "Vitamin C": ["tablet", "C"],
  "Vitamin D3": ["softgel", "D3"], "Vitamin D3 + K2": ["softgel", "D3K2"], "Vitamin E": ["softgel", "E"], "Vitamin K2": ["softgel", "K2"],
  "Magnezyum (Sitrat / Bisglisinat)": ["element", "Mg"], "Çinko": ["element", "Zn"], "ZMA": ["element", "ZMA"], "Kalsiyum": ["element", "Ca"], "Demir": ["element", "Fe"], "Potasyum": ["element", "K"], "Selenyum": ["element", "Se"],
  "İyot": ["element", "I"], "Krom": ["element", "Cr"], "Bakır": ["element", "Cu"], "Manganez": ["element", "Mn"], "Sodyum (Tuz tableti)": ["element", "Na"],
  "Kolajen": ["tub", "COL"], "Glukozamin + Kondroitin": ["tablet", "G+C"], "MSM": ["capsule", "MSM"], "Ashwagandha": ["leaf", "ASH"], "Rhodiola": ["leaf", "RHO"], "Melatonin": ["tablet", "MEL"], "Probiyotik": ["capsule", "PRO"],
  "Koenzim Q10": ["softgel", "Q10"], "Psyllium (Lif)": ["leaf", "PSY"], "Yeşil Çay Ekstresi": ["leaf", "EGCG"], "Zerdeçal (Kurkumin)": ["leaf", "CUR"], "Alfa Lipoik Asit": ["capsule", "ALA"], "NAC": ["capsule", "NAC"],
  "Elektrolit Tozu": ["tub", "ELK"], "Sindirim Enzimi": ["capsule", "ENZ"],
};
// Kalori içeren supplementlerin tipik besin değeri (100 g için [kcal, protein, karbonhidrat, yağ]) ve birim başına gram.
// Ürüne göre değişir; planda "tipik değer" olarak gösterilir. unitG: ölçek / kapsül / mL için gram karşılığı.
export const SUPP_MACROS = {
  "Whey Protein": { m: [400, 78, 8, 6], unitG: { "ölçek": 30 } }, "Whey Protein İzolat": { m: [370, 90, 2, 1], unitG: { "ölçek": 30 } }, "Hidrolize Whey": { m: [380, 85, 4, 2], unitG: { "ölçek": 30 } },
  "Kazein": { m: [360, 80, 6, 2], unitG: { "ölçek": 33 } }, "Yumurta Proteini": { m: [375, 80, 5, 1], unitG: { "ölçek": 30 } }, "Vegan Protein (Bezelye / Pirinç)": { m: [390, 76, 7, 7], unitG: { "ölçek": 30 } },
  "Sığır Proteini": { m: [380, 90, 1, 1], unitG: { "ölçek": 30 } }, "Kolajen": { m: [360, 90, 0, 0], unitG: { "ölçek": 10 } },
  "Maltodekstrin": { m: [380, 0, 95, 0], unitG: { "ölçek": 50 } }, "Dekstroz": { m: [365, 0, 91, 0], unitG: { "ölçek": 50 } }, "Cyclic Dextrin": { m: [380, 0, 95, 0], unitG: { "ölçek": 50 } },
  "Waxy Maize": { m: [380, 0, 95, 0], unitG: { "ölçek": 50 } }, "Gainer (Kilo alımı)": { m: [380, 20, 75, 2], unitG: { "ölçek": 100 } },
  "Omega-3 (Balık Yağı)": { m: [900, 0, 0, 100], unitG: { "kapsül": 1, "mL": 0.92 } }, "Krill Yağı": { m: [900, 0, 0, 100], unitG: { "kapsül": 0.5 } }, "CLA": { m: [900, 0, 0, 100], unitG: { "kapsül": 1 } },
  "MCT Yağı": { m: [830, 0, 0, 100], unitG: { "mL": 0.94, "ölçek": 15 } },
};
export const SUPP_UNITS = ["g", "mg", "mcg", "IU", "kapsül", "tablet", "ölçek", "mL", "damla"];
export const SUPP_STATE = [["fasted", "Açlık"], ["fed", "Tokluk"], ["any", "Farketmez"]];
export const SUPP_WHEN = [["morning", "Sabah"], ["pre", "Antrenman öncesi"], ["intra", "Antrenman sırasında"], ["post", "Antrenman sonrası"], ["meal", "Öğünle"], ["night", "Yatmadan önce"]];
export const ITEMS_MAX = 40;

// ------------------------------------------------------------------ FARMAKOLOJİ
// Yalnız madde LİSTESİ ve hesap kuralı. Doz, sıklık, süre ve konsantrasyon (mg/mL) değerlerini planı hazırlayan uzman girer;
// sistem doz önermez. Enjeksiyonda çekilecek hacim = uygulama dozu (mg) ÷ konsantrasyon (mg/mL).
export const PHARMA_GROUPS = [
  ["inj", "Enjektabl Steroidler", "syringe", "inj", ["Testosteron Enantat", "Testosteron Sipionat", "Testosteron Propiyonat", "Sustanon 250", "Testosteron Undekanoat", "Nandrolon Dekanoat", "Nandrolon Fenilpropiyonat (NPP)",
    "Trenbolon Asetat", "Trenbolon Enantat", "Trenbolon Hexahidrobenzilkarbonat", "Drostanolon Propiyonat (Masteron P)", "Drostanolon Enantat (Masteron E)", "Metenolon Enantat (Primobolan Depot)", "Boldenon Undesilenat", "Stanozolol (Enjektabl)"]],
  ["oral", "Oral Steroidler", "pill", "oral", ["Oksandrolon (Anavar)", "Metandrostenolon (Dianabol)", "Stanozolol (Oral)", "Oksimetolon (Anadrol)", "Klorodehidrometiltestosteron (Turinabol)", "Metiltestosteron", "Fluoksimesteron (Halotestin)", "Mesterolon (Proviron)"]],
  ["peptide", "Peptitler", "flask", "pep", ["BPC-157", "TB-500", "BPC-157 + TB-500", "Ipamorelin", "CJC-1295 (DAC'sız)", "CJC-1295 + Ipamorelin", "GHRP-6", "Hexarelin", "Tesamorelin", "Sermorelin", "HGH (Somatropin)",
    "Semaglutide", "Tirzepatide", "Retatrutide", "AOD-9604", "MOTS-c", "GHK-Cu", "Epitalon", "Melanotan II", "PT-141", "Selank", "Semax", "Thymosin Alpha-1", "KPV", "SS-31", "NAD+", "IGF-1 LR3", "HCG"]],
  ["protect", "Koruyucular", "shield", "oral", ["Arimidex (Anastrozol)", "Tamoxifen (Nolvadex)", "Klomen (Klomifen)", "Proviron (Mesterolon)", "Dostinex (Kabergolin)", "Cialis (Tadalafil)", "Aspirin"]],
].map(([key, name, icon, mode, items]) => ({ key, name, icon, mode, items }));
// Görsel kimlik ve klasik piyasa sunumu (etiket bilgisi — doz değildir):
//   inj: [kod, mg/mL]  · oral/koruyucu: [kod, tablet başına mg]  · peptit: [kod, şişe seçenekleri (Alpeptit kataloğu), birim]
export const PHARMA_INFO = {
  "Testosteron Enantat": ["TE", 250], "Testosteron Sipionat": ["TC", 250], "Testosteron Propiyonat": ["TP", 100], "Sustanon 250": ["S250", 250], "Testosteron Undekanoat": ["TU", 250],
  "Nandrolon Dekanoat": ["ND", 250], "Nandrolon Fenilpropiyonat (NPP)": ["NPP", 100], "Trenbolon Asetat": ["TA", 100], "Trenbolon Enantat": ["TRE", 200], "Trenbolon Hexahidrobenzilkarbonat": ["THX", 76.5],
  "Drostanolon Propiyonat (Masteron P)": ["MP", 100], "Drostanolon Enantat (Masteron E)": ["ME", 200], "Metenolon Enantat (Primobolan Depot)": ["PRI", 100], "Boldenon Undesilenat": ["EQ", 250], "Stanozolol (Enjektabl)": ["WI", 50],
  "Oksandrolon (Anavar)": ["VAR", 10], "Metandrostenolon (Dianabol)": ["DBL", 10], "Stanozolol (Oral)": ["WO", 10], "Oksimetolon (Anadrol)": ["ADR", 50], "Klorodehidrometiltestosteron (Turinabol)": ["TBL", 10],
  "Metiltestosteron": ["MT", 25], "Fluoksimesteron (Halotestin)": ["HAL", 10], "Mesterolon (Proviron)": ["PRV", 25],
  "Arimidex (Anastrozol)": ["ARI", 1], "Tamoxifen (Nolvadex)": ["NOL", 20], "Klomen (Klomifen)": ["CLO", 50], "Proviron (Mesterolon)": ["PRV", 25], "Dostinex (Kabergolin)": ["CAB", 0.5], "Cialis (Tadalafil)": ["CIA", 5], "Aspirin": ["ASP", 100],
  "AOD-9604": ["AOD", [2, 5]], "BPC-157": ["BPC", [5, 10]], "BPC-157 + TB-500": ["B+T", [10, 20]], "CJC-1295 (DAC'sız)": ["CJC", [2, 5]], "CJC-1295 + Ipamorelin": ["C+I", [10]], "Epitalon": ["EPI", [10, 50]],
  "GHK-Cu": ["GHK", [50, 100]], "GHRP-6": ["GH6", [5, 10]], "Hexarelin": ["HEX", [2, 5]], "HGH (Somatropin)": ["HGH", [10, 15, 24], "IU"], "Ipamorelin": ["IPA", [5, 10]], "KPV": ["KPV", [5, 10]],
  "Melanotan II": ["MT2", [10]], "MOTS-c": ["MOT", [10, 40]], "NAD+": ["NAD", [100, 500]], "PT-141": ["PT", [10]], "Retatrutide": ["RET", [5, 10, 20]], "Selank": ["SEL", [5, 10]],
  "Semaglutide": ["SEM", [2, 5, 10]], "Semax": ["SMX", [5, 10]], "Sermorelin": ["SER", [2, 5]], "SS-31": ["SS31", [10, 50]], "TB-500": ["TB", [5, 10]], "Tesamorelin": ["TES", [2, 5, 10]],
  "Thymosin Alpha-1": ["TA1", [5, 10]], "Tirzepatide": ["TIR", [5, 10, 15, 20, 30]], "IGF-1 LR3": ["IGF", [1]], "HCG": ["HCG", [5000], "IU"],
};
export const PHARMA_FREQ = [["daily", "Her gün"], ["eod", "Gün aşırı"], ["e3d", "3 günde bir"], ["w1", "Haftada 1"], ["w2", "Haftada 2"], ["w3", "Haftada 3"], ["custom", "Özel (notta belirtin)"]];
// haftalık uygulama sayısı (haftalık toplam mg hesabı için)
export const FREQ_PER_WEEK = { daily: 7, eod: 3.5, e3d: 7 / 3, w1: 1, w2: 2, w3: 3, custom: null };
export const DOSE_UNITS = ["mg", "mcg", "IU"];

// ------------------------------------------------------------------ DEĞERLİ NOTLAR
export const NOTE_FIELDS = {
  rest: { label: "Set arası dinlenme", icon: "timer", options: ["30 sn", "45 sn", "60 sn", "75 sn", "90 sn", "2 dk", "2,5 dk", "3 dk", "4 dk", "5 dk"] },
  water: { label: "Günlük su", icon: "drop", options: ["1,5 L", "2 L", "2,5 L", "3 L", "3,5 L", "4 L", "4,5 L", "5 L", "5,5 L", "6 L"] },
  salt: { label: "Günlük Himalaya tuzu", icon: "flask", options: ["Tuzsuz", "1 g", "2 g", "3 g", "4 g", "5 g", "6 g", "7 g", "8 g", "10 g", "12 g", "15 g"] },
  sleep: { label: "Uyku süresi", icon: "clock", options: ["6 saat", "6,5 saat", "7 saat", "7,5 saat", "8 saat", "8,5 saat", "9 saat", "9,5 saat", "10 saat"] },
  bedtime: { label: "Yatış saati", icon: "clock", options: ["21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00"] },
};

export const NOTE_MAX = 500;
export function catalog() {
  return { foods: FOODS, foodGroups: FOOD_GROUPS, mealsMax: MEALS_MAX, firstMeal: FIRST_MEAL, lastMeal: LAST_MEAL, groups: MUSCLE_GROUPS, daysMax: DAYS_MAX, exercisesMax: EXERCISES_PER_DAY_MAX,
    supps: SUPP_GROUPS, suppUnits: SUPP_UNITS, suppState: SUPP_STATE, suppWhen: SUPP_WHEN, itemsMax: ITEMS_MAX,
    suppGlyph: SUPP_GLYPH, suppMacros: SUPP_MACROS, pharmaInfo: PHARMA_INFO,
    pharma: PHARMA_GROUPS, pharmaFreq: PHARMA_FREQ, freqPerWeek: FREQ_PER_WEEK, doseUnits: DOSE_UNITS, notes: NOTE_FIELDS, noteMax: NOTE_MAX };
}
