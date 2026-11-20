// Forum hesap kuralları — kullanıcı adı, imza, sosyal bağlantılar, avatar/imza görseli ve forum bildirim tercihleri (TEK kaynak).
// Metin denetimi: müstehcen/küfürlü, siyasi veya ideolojik ifadeler ve (imzada) reklam reddedilir. Görseller otomatik olarak
// "içerik" bakımından denetlenemez; kurallar onaylatılır, şikâyet edilebilir ve yönetici kaldırabilir.
import { validateUsername } from "./passwordRules.js";
import { isBannedUsername } from "./validate.js";

const FOLD = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u" };
const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s", "!": "i" };
export const fold = (v) => String(v ?? "").toLocaleLowerCase("tr-TR").replace(/i̇/g, "i").replace(/[çğıöşüâîû]/g, (c) => FOLD[c]);
const squeeze = (w) => w.replace(/(.)\1+/g, "$1");

// Kelime olarak (tam eşleşme) reddedilenler — kısa olduğu için başka kelimelerin içinde aranmaz.
const WORDS = [
  // müstehcen / küfür (TR + EN)
  "amk", "aq", "mk", "oc", "pic", "sik", "sikik", "yarak", "yarrak", "ibne", "gavat", "kaltak", "kahpe", "orospu", "amcik", "porno", "porn", "seks", "sex", "xxx",
  "fuck", "fck", "shit", "bitch", "dick", "cock", "pussy", "cunt", "whore", "slut", "nude", "nudes", "fag", "nigga", "nigger", "anal", "milf", "hentai", "onlyfans",
  // siyasi parti kısaltmaları ve ideolojik örgüt adları
  "akp", "chp", "mhp", "hdp", "hdk", "bbp", "dsp", "pkk", "ypg", "pyd", "isid", "isis", "deas", "daes", "feto", "fetocu", "kck", "dhkpc", "nazi", "kkk", "apo", "apocu",
];
// Kelimenin içinde (alt dize) aranan, gerçek bir kelimenin parçası olamayacak kadar özgül kökler.
const STEMS = [
  "orospu", "siktir", "sikis", "sikey", "siker", "yarrak", "amcik", "amina", "pezeven", "gotver", "serefsiz", "porno", "pornhub", "fuck", "motherf", "onlyfans", "sexy", "seksi", "escort",
  "hitler", "fasist", "fasizm", "komunist", "komunizm", "nazizm", "seriatci", "halifelik", "erdogan", "kilicdaroglu", "imamoglu", "bahceli", "ataturk", "ocalan", "gulenist",
  "akparti", "iyiparti", "zaferparti", "demparti", "ulkuocak", "bozkurtlar", "terorist", "teror", "cihat", "jihad",
];
/** Metinde yasaklı (müstehcen / siyasi / ideolojik) ifade var mı? Büyük harf, Türkçe harf, harf tekrarı, rakamla harf yerine yazım ve araya konan noktalama yok sayılır. */
export function hasBannedTerm(text) {
  const f = fold(text);
  const tokens = f.split(/[^a-z0-9@$!]+/).filter(Boolean).map((w) => w.replace(/[0134578@$!]/g, (c) => LEET[c] || c)).map((w) => w.replace(/[^a-z]/g, ""));
  for (const w of tokens) { const s = squeeze(w); if (WORDS.includes(w) || WORDS.includes(s)) return true; }
  const compact = squeeze(tokens.join(""));
  return STEMS.some((s) => compact.includes(s));
}

// ---------------- kullanıcı adı (herkese açık; giriş için de kullanılır) ----------------
export const USERNAME_RULES = [
  "3–20 karakter; yalnız küçük harf (a–z), rakam, nokta ve alt çizgi.",
  "Harfle başlar; nokta veya alt çizgi ile bitemez, art arda kullanılamaz.",
  "Müstehcen, küfürlü, siyasi veya ideolojik ifade, kişi/kurum taklidi ve reklam içeremez.",
  "Herkese açıktır ve forumda adınızın yerine görünür. 14 günde bir değiştirilebilir.",
];
export const USERNAME_COOLDOWN_DAYS = 14;
const RESERVED = ["admin", "administrator", "moderator", "mod", "yonetici", "destek", "support", "alpvefit", "alpeptit", "sistem", "system", "root", "official", "resmi", "forum", "uzman", "coach", "koc"];
export function forumUsernameError(raw) {
  const u = String(raw ?? "").trim();
  if (!/^[a-z][a-z0-9._]{1,18}[a-z0-9]$/.test(u)) return "Kullanıcı adı 3–20 karakter olmalı; küçük harfle başlamalı ve yalnız küçük harf, rakam, nokta, alt çizgi içermelidir.";
  if (/[._]{2}/.test(u)) return "Nokta ve alt çizgi art arda kullanılamaz.";
  const base = validateUsername(u); if (base) return base;
  const plain = u.replace(/[._\d]/g, "");
  if (RESERVED.some((r) => plain === r || plain.startsWith(r) || plain.endsWith(r))) return "Bu kullanıcı adı ayrılmıştır; resmî hesapları taklit eden adlar kullanılamaz.";
  if (isBannedUsername(u) || hasBannedTerm(u)) return "Bu kullanıcı adı kullanılamaz (müstehcen, siyasi veya ideolojik ifade içeremez).";
  return null;
}

// ---------------- imza ----------------
export const SIGNATURE_MAX = 200;
export const SIGNATURE_RULES = [
  `En fazla ${SIGNATURE_MAX} karakter düz metin; isteğe bağlı tek bir görsel veya GIF (en fazla 600×150 piksel, 1 MB).`,
  "Reklam yasaktır: bağlantı, alan adı, e-posta, telefon, kullanıcı adı (@) ve satış/indirim/kupon ifadeleri kullanılamaz.",
  "Müstehcen, küfürlü, siyasi veya ideolojik içerik kullanılamaz.",
];
const AD_WORDS = ["indirim", "kupon", "kampanya", "satilik", "satis", "siparis", "fiyat", "ucretsiz", "bedava", "whatsapp", "telegram", "dmden", "dm at", "iletisim icin", "link bio", "linkte",
  "promo", "discount", "coupon", "sale", "buy now", "order now", "free shipping", "affiliate", "referral", "referans kodu", "promosyon", "kargo bedava", "toptan", "bayilik"];
export function signatureError(raw) {
  const s = String(raw ?? "");
  if (s.length > SIGNATURE_MAX) return `İmza en fazla ${SIGNATURE_MAX} karakter olabilir.`;
  if ((s.match(/\n/g) || []).length > 2) return "İmza en fazla 3 satır olabilir.";
  const f = fold(s);
  if (/(https?:\/\/|www\.|\b[a-z0-9-]{2,}\s?(\.|\(dot\)|\[nokta\]|nokta)\s?(com|net|org|tr|io|co|me|app|shop|store|xyz|info|biz|link|ly|gg|tv)\b)/.test(f)) return "İmzada bağlantı veya alan adı kullanılamaz (reklam yasağı).";
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/.test(f)) return "İmzada e-posta adresi kullanılamaz (reklam yasağı).";
  if ((s.replace(/[^\d]/g, "").length >= 10) && /\d[\d\s().-]{8,}\d/.test(s)) return "İmzada telefon numarası kullanılamaz (reklam yasağı).";
  if (/(^|\s)@[a-z0-9._]{2,}/.test(f)) return "İmzada kullanıcı adı (@…) paylaşılamaz (reklam yasağı).";
  if (AD_WORDS.some((w) => new RegExp("(^|[^a-z])" + w + "([^a-z]|$)").test(f))) return "İmzada satış, indirim veya iletişim çağrısı gibi reklam ifadeleri kullanılamaz.";
  if (hasBannedTerm(s)) return "İmza müstehcen, küfürlü, siyasi veya ideolojik ifade içeremez.";
  return null;
}

// ---------------- sosyal bağlantılar (yalnız kullanıcı adı saklanır; bağlantı resmî alan adından kurulur) ----------------
export const SOCIALS = {
  instagram: { label: "Instagram", re: /^(?!.*\.\.)(?!\.)[a-z0-9._]{1,30}(?<!\.)$/, url: "https://www.instagram.com/" },
  tiktok: { label: "TikTok", re: /^(?!.*\.$)[a-z0-9._]{2,24}$/, url: "https://www.tiktok.com/@" },
  facebook: { label: "Facebook", re: /^[a-z0-9.]{5,50}$/, url: "https://www.facebook.com/" },
  twitter: { label: "X (Twitter)", re: /^[a-z0-9_]{1,15}$/, url: "https://x.com/" },
};
/** "https://instagram.com/ad", "@ad" veya "ad" → "ad"; geçersizse hata. */
export function socialsIn(raw) {
  const out = {};
  if (raw === null || raw === undefined) return { v: out };
  if (typeof raw !== "object" || Array.isArray(raw)) return { err: "Sosyal bağlantılar geçersiz." };
  for (const [k, v] of Object.entries(raw)) {
    const def = SOCIALS[k]; if (!def) continue;
    let h = String(v ?? "").trim().toLowerCase();
    if (!h) continue;
    h = h.replace(/^https?:\/\/(www\.|m\.)?(instagram\.com|tiktok\.com|facebook\.com|fb\.com|twitter\.com|x\.com)\//, "").replace(/^@/, "").replace(/[/?#].*$/, "");
    if (!def.re.test(h)) return { err: `${def.label} kullanıcı adı geçersiz.` };
    if (hasBannedTerm(h)) return { err: `${def.label} kullanıcı adı uygun değil.` };
    out[k] = h;
  }
  return { v: out };
}

// ---------------- forum bildirim tercihleri ----------------
export const NOTIFY = [
  ["own_topic_reply", "Açtığım konulara gelen yanıtlar", true],
  ["participated_reply", "Yazdığım konulara gelen yeni yanıtlar", true],
  ["favorite_topic", "Favorilerime eklediğim konulardaki gelişmeler", true],
  ["mention", "Benden bahsedilmesi (@kullanıcıadı)", true],
  ["report_result", "Şikâyetlerimin inceleme sonuçları", true],
  ["liked", "İçeriklerimin beğenilmesi", true],
  ["disliked", "İçeriklerimin beğenilmemesi", false],
  ["quoted", "İçeriğimin alıntılanması", true],
  ["message", "Özel mesajlar (Pump Avcısı seviyesinde açılır)", true],
  ["moderation", "Moderasyon işlemleri (içeriğimin düzenlenmesi, kaldırılması, konunun kilitlenmesi)", true],
  ["digest", "Haftalık forum özeti e-postası (Pazartesi sabahı: haftanın öne çıkan konuları ve meydan okuması)", false],
];
export function notifyIn(raw) {
  const out = {};
  for (const [k, , def] of NOTIFY) out[k] = raw && typeof raw[k] === "boolean" ? raw[k] : def;
  out.moderation = true;   // moderasyon bildirimleri kapatılamaz (kullanıcı hakkındaki işlemlerden haberdar olması gerekir)
  return out;
}

// ---------------- görseller ----------------
export const AVATAR_RULES = [
  "PNG veya JPG; en fazla 1 MB; en az 128×128, en fazla 1024×1024 piksel; kareye yakın (en/boy oranı en fazla 1,25).",
  "Müstehcen, şiddet içeren, siyasi veya ideolojik simge/kişi içeren, başkasını taklit eden ya da reklam amaçlı görseller yasaktır.",
  "Kurala aykırı görseller uyarı yapılmadan kaldırılır; tekrarında hesap kısıtlanabilir.",
];
export const MEDIA = {
  avatar: { types: ["image/png", "image/jpeg"], max: 1024 * 1024, check: (w, h) => w >= 128 && h >= 128 && w <= 1024 && h <= 1024 && Math.max(w, h) / Math.min(w, h) <= 1.25, dimErr: "Avatar en az 128×128, en fazla 1024×1024 piksel ve kareye yakın olmalıdır.", typeErr: "Avatar için yalnız PNG veya JPG yüklenebilir." },
  sig: { types: ["image/png", "image/jpeg", "image/gif"], max: 1024 * 1024, check: (w, h) => w >= 16 && h >= 16 && w <= 600 && h <= 150, dimErr: "İmza görseli en fazla 600×150 piksel olabilir.", typeErr: "İmza görseli için yalnız PNG, JPG veya GIF yüklenebilir." },
};
/** Görselin gerçek imzasından türünü ve boyutlarını okur (PNG / JPEG / GIF). */
export function imageInfo(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 24) return null;
  if (buf.readUInt32BE(0) === 0x89504e47 && buf.toString("ascii", 12, 16) === "IHDR") return { mime: "image/png", w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a") return { mime: "image/gif", w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      if ((m >= 0xc0 && m <= 0xc3) || (m >= 0xc5 && m <= 0xc7) || (m >= 0xc9 && m <= 0xcb) || (m >= 0xcd && m <= 0xcf)) return { mime: "image/jpeg", w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
    return null;
  }
  return null;
}
