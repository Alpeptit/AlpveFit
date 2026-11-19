// Forum içerik kuralları (TEK kaynak): başlık / mesaj sınırları, yasaklı ifade, satış-kaynak-iletişim yasağı, bağlantı seviyesi,
// @anma ve alıntı ayrıştırma, anket doğrulama. Mesajlar düz metin + küçük bir biçim dili olarak saklanır; HTML hiçbir zaman
// saklanmaz ve sunucu HTML üretmez (ön yüz metni düğüm düğüm kurar, satır içi HTML yorumlanmaz).
import { hasBannedTerm, fold } from "./forumRules.js";
import { LEVELS } from "./forumLevels.js";

export const TITLE_MIN = 8, TITLE_MAX = 120, BODY_MIN = 2, BODY_MAX = 10000, BODY_MAX_STAFF = 40000;
export const TAGS_PER_TOPIC = 5;
export const IMAGES_PER_POST = 4, IMAGE_MAX = 4 * 1024 * 1024, IMAGE_PX = 4096, PENDING_MAX = 12;
export const PAGE_POSTS = 20, PAGE_TOPICS = 25;
export const LINK_LEVEL = 2;   // bağlantı paylaşımı: Barın Çırağı ve üstü (yeni hesaplarla reklam/spam önlenir)
export const REPORT_REASONS = [
  ["spam", "Spam veya alakasız içerik"], ["abuse", "Hakaret, taciz veya zorbalık"], ["obscene", "Müstehcen içerik"],
  ["political", "Siyasi veya ideolojik içerik"], ["sales", "Satış, kaynak veya tedarik paylaşımı"], ["medical", "Tehlikeli sağlık yönlendirmesi"],
  ["scam", "Dolandırıcılık veya sahte bilgi"], ["other", "Diğer"],
];
// Kurallar: **kalın** vurgu içerir; ön yüz her kuralı kendi simgesiyle gösterir (RULE_ICONS aynı sırada).
export const RULES = [
  "Forum yalnız **18 yaşından büyük** üyelere açıktır.",
  "**Saygılı ol:** hakaret, taciz, nefret söylemi ve kışkırtmaya yer yok. Burada herkes aynı barın altında ter döküyor.",
  "**Siyaset, ideoloji ve din tartışmaları** ile **müstehcen içerik** yasaktır.",
  "**Satış, kaynak / tedarik, iletişim bilgisi** (telefon, e-posta, mesajlaşma uygulaması) ve **reklam** kesinlikle yasaktır.",
  "Paylaşımlar **bilgi amaçlıdır, tıbbi tavsiye değildir**; sağlıkla ilgili her durumda **hekimine danış**.",
  "Başkasının **kişisel bilgisini** veya **izinsiz fotoğrafını** paylaşma.",
  "Konunu doğru kategoride aç; konu dışı içerik taşınır, tekrarında **ihtar** alırsın.",
  "Kurala aykırı içerik kaldırılır; tekrarında forumdan **süreli veya kalıcı** olarak uzaklaştırılırsın.",
];
export const RULE_ICONS = ["shield", "smile", "flag", "coin", "heart", "eyeoff", "compass", "alert"];

export const clean = (v) => String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "").replace(/\n{4,}/g, "\n\n\n").trim();

// Satış / kaynak / iletişim: forumun en kritik kuralı (farmakoloji). Katlanmış (küçük harf, Türkçe harf sadeleştirilmiş) metinde aranır.
const SALES = [
  /\b(satilik|satiyorum|satiyoruz|satisi yapil|satis yapiyor|fiyat(i|lari)? (nedir|ne kadar|ver|icin)|kac (tl|lira|para)|fiyat listesi)\b/,
  /\b(kaynak (ver|lazim|ariyorum|oner|bul|paylas)|nereden (alabilirim|alinir|bulurum|bulabilirim|temin)|tedarik(ci)?|temin ed(er|iyorum|ebilirim))\b/,
  /\b(iban|kargo(lu|yla| ile gonder)|kapida odeme)\b/,
  /\b(whatsapp|whats app|telegram|wickr|wa\.me|t\.me\/)/,
];
export function salesError(text) {
  const f = fold(text);
  if (SALES.some((re) => re.test(f))) return "Satış, kaynak / tedarik ya da iletişim paylaşımı forumda yasaktır.";
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/.test(f)) return "E-posta adresi paylaşılamaz.";
  // telefon: uluslararası (+…) ya da Türkiye cep biçimi (5xx xxx xx xx); antrenman günlüklerindeki sayı dizileri yakalanmaz
  if (/(^|[^\d+])\+\d{1,3}[\s.-]?\(?\d{2,4}\)?([\s.-]?\d{2,4}){2,4}(?!\d)/.test(text) || /(^|\D)(\+?90[\s.-]?|0[\s.-]?)?\(?5\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}(?!\d)/.test(text)) return "Telefon numarası paylaşılamaz.";
  return null;
}
export const hasLink = (text) => /(https?:\/\/|www\.)\S+/i.test(text);

/** Başlık ve gövde denetimi; level: yazarın seviye sırası, mod: moderatör/yönetici. */
export function contentError({ title, body, level, mod }) {
  if (title !== undefined) {
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) return `Başlık ${TITLE_MIN}–${TITLE_MAX} karakter olmalıdır.`;
    if (/^[^a-zA-ZçğıöşüÇĞİÖŞÜ0-9]*$/.test(title)) return "Başlık anlamlı bir metin içermelidir.";
    if (title === title.toLocaleUpperCase("tr-TR") && /[A-ZÇĞİÖŞÜ]{6,}/.test(title)) return "Başlığı tamamen büyük harfle yazmayın.";
    if (hasBannedTerm(title)) return "Başlık müstehcen, küfürlü, siyasi veya ideolojik ifade içeremez.";
    if (!mod) { const s = salesError(title); if (s) return s; }
  }
  if (body !== undefined) {
    if (body.length < BODY_MIN) return "Mesaj boş olamaz.";
    const max = mod ? BODY_MAX_STAFF : BODY_MAX;
    if (body.length > max) return `Mesaj en fazla ${max.toLocaleString("tr-TR")} karakter olabilir.`;
    if (hasBannedTerm(stripQuotes(body))) return "Mesaj müstehcen, küfürlü, siyasi veya ideolojik ifade içeremez.";
    if (!mod) {
      const s = salesError(stripQuotes(body)); if (s) return s;
      if (hasLink(body) && level < LINK_LEVEL) return `Bağlantı paylaşımı ${LEVELS[LINK_LEVEL - 1].name} seviyesinde açılır.`;
    }
    if ((body.match(/\[alinti=/g) || []).length > 5) return "Bir mesajda en fazla 5 alıntı olabilir.";
  }
  return null;
}

// Alıntı biçimi: [alinti=kullaniciadi#<mesaj-id>]…[/alinti] — iç içe alıntı tutulmaz (en dıştaki korunur).
const QUOTE_RE = /\[alinti=([a-z0-9._]{3,20})#([0-9a-f-]{36})\]([\s\S]*?)\[\/alinti\]/gi;
export function stripQuotes(body) { return String(body).replace(QUOTE_RE, " "); }
export function quotedPostIds(body) { return [...String(body).matchAll(QUOTE_RE)].map((m) => m[2].toLowerCase()).slice(0, 5); }
export function mentions(body) {
  const out = new Set();
  for (const m of stripQuotes(body).matchAll(/(^|[\s(])@([a-z][a-z0-9._]{1,18}[a-z0-9])\b/g)) { out.add(m[2]); if (out.size >= 10) break; }
  return [...out];
}

/** Anket: { question, options[2–6], multi, days(0–30) } → temiz değer ya da { err }. */
export function pollIn(p) {
  if (p === undefined || p === null) return { v: null };
  if (typeof p !== "object") return { err: "Anket geçersiz." };
  const question = clean(p.question).slice(0, 200);
  const options = Array.isArray(p.options) ? p.options.map((o) => clean(o)).filter(Boolean) : [];
  if (question.length < 3 || question.length > 140) return { err: "Anket sorusu 3–140 karakter olmalıdır." };
  if (options.length < 2 || options.length > 6) return { err: "Ankette 2–6 seçenek olmalıdır." };
  if (options.some((o) => o.length > 80)) return { err: "Anket seçeneği en fazla 80 karakter olabilir." };
  if (new Set(options.map((o) => fold(o))).size !== options.length) return { err: "Anket seçenekleri birbirinden farklı olmalıdır." };
  if ([question, ...options].some((t) => hasBannedTerm(t) || salesError(t))) return { err: "Anket uygun olmayan ifade içeriyor." };
  const days = Number(p.days || 0);
  if (!Number.isInteger(days) || days < 0 || days > 30) return { err: "Anket süresi 0–30 gün olmalıdır." };
  return { v: { question, options, multi: p.multi === true, days } };
}
