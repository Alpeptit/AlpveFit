const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email.trim());
}

export function isNonEmptyString(value, maxLen = 500) {
  if (typeof value !== "string") return false;
  // O14 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN "boş değil" kontrolü
  // trimlenmiş değer üzerinden, "uzunluk sınırı" kontrolü ise HAM (trim
  // edilmemiş) değer üzerinden yapılıyordu — tutarsızdı. Artık ikisi de
  // AYNI (trimlenmiş) değere bakıyor.
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLen;
}

/** İstek gövdesindeki alanları kontrol eder; eksik/hatalı olan ilk alanın adını döner, hepsi geçerliyse null. */
export function requireFields(body, fields) {
  for (const field of fields) {
    if (!isNonEmptyString(body[field])) return field;
  }
  return null;
}

/**
 * Bir URL'nin sadece http(s) şemasıyla başladığını doğrular. Bu olmadan,
 * biri "javascript:..." veya "data:..." gibi bir değeri attachmentUrl
 * olarak gönderip, bunu daha sonra tıklayan bir admin/kullanıcıya karşı
 * saklı (stored) bir XSS/link enjeksiyonu yapabilirdi.
 */
export function isSafeHttpUrl(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 2000) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// ---------- Ad soyad kuralı (kayıt, ad değişikliği ve adres alıcısı için TEK kaynak) ----------
// Yalnızca harf; ad ile soyad arasında boşluk; en az 1, en fazla 2 boşluk
// (yani 2–3 kelime); her kelime en az 2 harf. Fazla boşluklar tek boşluğa indirgenir.
const NAME_WORD = "[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]{2,}";
// Ad soyad en fazla 50 karakter (kayıt, profil ad değişikliği, adres alıcısı). Arayüz de 50'den fazlasının yazılmasına izin vermez.
export const FULL_NAME_MAX = 50;
const FULL_NAME_RE = new RegExp(`^${NAME_WORD}( ${NAME_WORD}){1,2}$`);
export function normalizeFullName(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}
/**
 * Geçerliyse null, değilse kullanıcıya gösterilecek (alan bazında, nedeni söyleyen) hata mesajını döner.
 * v43 — boşluk kuralı TEK biçimde: baş/son boşluklar ve art arda boşluklar (sekme, bölünmez boşluk dahil) önce temizlenir,
 * ardından EN FAZLA 2 boşluk (3 kelime) kuralı uygulanır. Ön yüzdeki ALP.nameError birebir aynı sırayı ve mesajları kullanır.
 */
// v51 — ad soyad alanında kullanılamayan BİRLEŞİMLER: tek tek kelimeler serbesttir ("Ahmet Kaş", "Yavuz Çav" geçerli),
// yalnızca aşağıdaki kelime dizisi ad soyadın içinde ARDIŞIK geçerse reddedilir. Karşılaştırma Türkçe küçük harf ve
// şapkasız/aksansız yapılır ("ATATÜRK" = "ataturk"); "Hazreti"/"Hz" aynı sayılır.
export const BANNED_NAME_SEQUENCES = [
  "recep tayyip erdogan", "hz muhammed", "hz muhammet", "hz isa", "hz musa", "fatih sultan mehmet", "yavuz sultan selim",
  "mustafa kemal ataturk", "sedat peker", "alaattin cakici", "alattin cakici", "mehmet agar",
].map((x) => x.split(" "));
// Allah'a / Tanrı'ya küfür ve hakaret: "Allah" ve "Tanrı" ad soyad olarak kullanılamaz ("Allahverdi", "Tanrıverdi" gibi
// gerçek adlar serbesttir); ayrıca küfür kelimeleri tek başına da reddedilir (kelime bazında; "Işık" gibi adlar etkilenmez).
const BANNED_NAME_WORDS = ["allah", "alah", "allahim", "tanri", "tanrim", "amk", "aq", "ibne", "gavat", "pic", "yarak", "yarrak",
  "sik", "sikik", "serefsiz", "kaltak", "kahpe", "pezevenk", "orospu", "got", "gotveren", "amcik", "amina", "siktir"];
const BANNED_NAME_PREFIXES = ["orospu", "siktir", "sikey", "siker", "sikis", "yarra", "amcik", "amina", "pezeven", "kahpe", "gotver", "serefsiz"];
export const BANNED_NAME_MSG = "Bu ad soyad kullanılamaz. Lütfen kendi adınızı ve soyadınızı girin.";
const NAME_FOLD = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u" };
/** Ad soyad kelimeleri: Türkçe küçük harf, Türkçe karakterler sadeleştirilmiş; "hazreti" → "hz". */
export function nameTokens(value) {
  return normalizeFullName(value).toLocaleLowerCase("tr-TR").replace(/i̇/g, "i").replace(/[çğıöşüâîû]/g, (c) => NAME_FOLD[c])
    .split(" ").filter(Boolean).map((w) => (w === "hazreti" || w === "hazret" ? "hz" : w));
}
// v55 — MERKEZİ yasaklı ifade denetimi: ad soyad VE kullanıcı adı aynı listeleri ve aynı normalleştirmeyi kullanır.
// Normalleştirme: Türkçe küçük harf, Türkçe/şapkalı harfler sadeleştirilir, tekrar eden harfler teke indirilir
// ("ATATÜRKK" = "ataturk"). Liste kapsamı GENİŞLETİLMEDİ; yalnız aşılma yolları (birleşik yazım, büyük harf, araya
// noktalama/rakam koyma) kapatıldı.
const squeeze = (w) => w.replace(/(.)\1+/g, "$1");   // "orospuuu" → "orospu", "allllah" → "alah"
const SEQ_JOINED = BANNED_NAME_SEQUENCES.map((seq) => seq.map(squeeze).join(""));
// Kelime içinde (alt dize olarak) aranan kökler: yalnız gerçek bir adın parçası olamayacak kadar uzun/özgül olanlar
const BANNED_LONG_STEMS = BANNED_NAME_PREFIXES.filter((p) => p.length >= 6);
function foldTr(value) {
  return String(value ?? "").toLocaleLowerCase("tr-TR").replace(/i̇/g, "i").replace(/[çğıöşüâîû]/g, (c) => NAME_FOLD[c]);
}
/** Kelime listesinde yasaklı birleşim (ayrı ya da birleşik yazılmış, ör. "Mustafakemal Atatürk") veya küfür var mı? */
function bannedInTokens(t) {
  const sq = t.map(squeeze);
  for (const joined of SEQ_JOINED)
    for (let i = 0; i < sq.length; i++) {
      let acc = "";
      for (let j = i; j < sq.length && acc.length < joined.length; j++) { acc += sq[j]; if (acc === joined) return true; }
    }
  for (const w of t.concat(sq)) {
    if (BANNED_NAME_WORDS.includes(w)) return true;
    if (BANNED_NAME_PREFIXES.some((p) => w.startsWith(p))) return true;
  }
  return false;
}
/** Yasaklı birleşim veya küfür varsa true. "Mustafa Kemal" serbesttir; "Mustafa Kemal Atatürk" reddedilir. */
export function isBannedFullName(value) {
  return bannedInTokens(nameTokens(value));
}
/**
 * v55 — kullanıcı adı için aynı denetim. Kullanıcı adı harf+rakamdan oluşur; rakam/noktalama ayraç sayılır
 * ("orospu123", "siktir_x" reddedilir) ve harfler arasına konan ayraçlar yok sayılarak birleşik hâl de taranır
 * ("o.r.o.s.p.u", "MustafaKemalAtaturk1881" reddedilir). "mustafakemal", "isik", "allahverdi" serbesttir.
 */
export function isBannedUsername(value) {
  const f = foldTr(value);
  const t = f.split(/[^a-z]+/).filter(Boolean).map((w) => (w === "hazreti" || w === "hazret" ? "hz" : w));
  if (bannedInTokens(t)) return true;
  const compact = squeeze(t.join(""));
  if (!compact) return false;
  if (SEQ_JOINED.some((j) => j.length >= 12 && compact.includes(j))) return true;   // uzun, özgül birleşimler (ör. "mustafakemalataturk")
  if (SEQ_JOINED.includes(compact) || BANNED_NAME_WORDS.includes(compact)) return true;
  return BANNED_LONG_STEMS.some((s) => compact.includes(s));
}
export const BANNED_USERNAME_MSG = "Bu kullanıcı adı kullanılamaz. Lütfen farklı bir kullanıcı adı seçin.";

export function fullNameError(value) {
  const n = normalizeFullName(value);
  if (!n) return "Ad soyad zorunludur.";
  if (/\d/.test(n)) return "Ad soyad alanı sayı içeremez.";
  if (/[^A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû ]/.test(n)) return "Ad soyad yalnızca harf içerebilir.";
  const words = n.split(" ");
  if (words.length > 3) return "Ad soyad en fazla 2 boşluk içerebilir (örn. Mustafa Kemal Atatürk).";
  if (words.length < 2) return "Lütfen ad ve soyadınızı aralarında boşluk bırakarak yazın.";
  if (n.length > FULL_NAME_MAX) return `Ad soyad en fazla ${FULL_NAME_MAX} karakter olabilir.`;
  if (words.some((w) => w.length < 2) || !FULL_NAME_RE.test(n)) return "Her kelime en az 2 harf olmalıdır.";
  if (isBannedFullName(n)) return BANNED_NAME_MSG;
  return null;
}

// ---------- Mesaj uzunluğu (TEK KAYNAK) ----------
// Ticket oluşturma, üye yanıtı, admin yanıtı ve canlı destek mesajları için ortak sınır (kullanıcı kuralı).
export const MAX_MESSAGE_LENGTH = 1444;
export const MESSAGE_TOO_LONG = `Mesaj en fazla ${MAX_MESSAGE_LENGTH} karakter olabilir.`;
/** Boş mesaj için emptyMsg, sınırı aşan mesaj için MESSAGE_TOO_LONG, geçerliyse null döner. */
export function messageError(value, emptyMsg) {
  if (typeof value !== "string" || value.trim().length === 0) return emptyMsg;
  if (value.length > MAX_MESSAGE_LENGTH) return MESSAGE_TOO_LONG;
  return null;
}

// ---------- Ticket başlığı (TEK KAYNAK) — her iki ticket türü (Soru Sor / Ödeme Bildir) ----------
export const MAX_TITLE_LENGTH = 144;
const TITLE_RE = /^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû\s]+$/;
/** Başlık: zorunlu, en fazla 144 karakter, yalnızca harf (eski arayüz kuralı). Geçerliyse null. */
export function ticketTitleError(title) {
  const t = typeof title === "string" ? title.trim() : "";
  if (!t) return "Lütfen bir başlık giriniz.";
  if (t.length > MAX_TITLE_LENGTH) return `Başlık en fazla ${MAX_TITLE_LENGTH} karakter olabilir.`;
  if (!TITLE_RE.test(t)) return "Başlık yalnızca harf içerebilir, sayı veya sembol kullanılamaz.";
  return null;
}

// ---------- v30: ürün görselleri (v47: en fazla 2 — kapak + değiştirilebilir ikinci görsel, ör. analiz raporu) ----------
// Kabul edilen biçim: https:// ile başlayan tam adres veya sitenin kendi içindeki /... yolu.
// "javascript:", "data:" ve şema atlatan "//sunucu/..." biçimleri REDDEDİLİR (XSS / dış içerik enjeksiyonu).
export const MAX_PRODUCT_IMAGES = 2;
const IMG_MAX_LEN = 500;
export function normalizeProductImages(value) {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v ?? "").trim()).filter((v) => v.length > 0);
}
/** Geçerliyse null, değilse hata mesajı. */
export function productImagesError(value) {
  if (value == null) return null;
  if (!Array.isArray(value)) return "Görseller bir liste olmalıdır.";
  const list = normalizeProductImages(value);
  if (list.length > MAX_PRODUCT_IMAGES) return `Bir ürüne en fazla ${MAX_PRODUCT_IMAGES} görsel eklenebilir.`;
  for (const url of list) {
    if (url.length > IMG_MAX_LEN) return "Görsel adresi çok uzun.";
    const relative = url.startsWith("/") && !url.startsWith("//");
    if (relative) continue;
    let parsed;
    try { parsed = new URL(url); } catch { return "Geçerli bir görsel adresi giriniz (https:// ile başlamalı)."; }
    if (parsed.protocol !== "https:") return "Görsel adresi https:// ile başlamalıdır.";
  }
  if (new Set(list).size !== list.length) return "Aynı görseli birden fazla kez ekleyemezsiniz.";
  return null;
}
