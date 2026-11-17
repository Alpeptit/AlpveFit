// Yüklenebilir dosya türleri (tek kaynak) — Alpeptit'teki kurallarla aynı: PNG, JPG, JPEG, PDF, XLSX, DOCX; dosya başına 4 MB.
// İKİ KATMANLI DOĞRULAMA:
//   1) İstemcinin BEYAN ettiği tür ve dosya uzantısı — ön eleme.
//   2) Dosyanın GERÇEK baytları (dosya imzası) — asıl güvenlik kontrolü. Beyan ile içerik uyuşmazsa dosya reddedilir.
// Eski .doc/.xls (makro içerebilen kap), SVG, HTML ve diğer tüm türler kabul edilmez.
export const UPLOAD_MAX_BYTES = 4 * 1024 * 1024;
export const UPLOAD_MAX_TEXT = "4 MB";
export const ATTACH_MAX = 4;   // bir destek mesajına veya kişisel bilgilere en fazla 4 dosya
export const COUNT_ERROR = `En fazla ${ATTACH_MAX} dosya eklenebilir.`;

const OOXML_SHEET = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const OOXML_DOC = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const UPLOAD_KINDS = [
  { ext: "png", label: "PNG", mime: "image/png", sniff: "png" },
  { ext: "jpg", label: "JPG", mime: "image/jpeg", sniff: "jpeg" },
  { ext: "jpeg", label: "JPEG", mime: "image/jpeg", sniff: "jpeg" },
  { ext: "pdf", label: "PDF", mime: "application/pdf", sniff: "pdf" },
  { ext: "xlsx", label: "XLSX", mime: OOXML_SHEET, sniff: "xlsx" },
  { ext: "docx", label: "DOCX", mime: OOXML_DOC, sniff: "docx" },
];
export const TYPES_TEXT = [...new Set(UPLOAD_KINDS.map((k) => k.label))].join(", ");
export const TYPE_ERROR = `Bu dosya türü desteklenmiyor. Yalnızca ${TYPES_TEXT} dosyaları eklenebilir.`;
export const SIZE_ERROR = `Dosya en fazla ${UPLOAD_MAX_TEXT} olabilir.`;
export const CONTENT_ERROR = `Dosyanın içeriği uzantısıyla uyuşmuyor. Yalnızca ${TYPES_TEXT} dosyaları eklenebilir.`;

export function extOf(filename) {
  const m = /\.([a-z0-9]+)$/i.exec(String(filename || "").trim());
  return m ? m[1].toLowerCase() : "";
}
export function kindOf(filename) { return UPLOAD_KINDS.find((k) => k.ext === extOf(filename)) || null; }

/** Beyan edilen tür/uzantı kabul ediliyor mu? Geçerliyse null, değilse ileti. */
export function declaredTypeError(mimetype, filename) {
  const kind = kindOf(filename);
  if (!kind) return TYPE_ERROR;
  if (mimetype && mimetype !== kind.mime) return TYPE_ERROR;
  return null;
}

/** Dosya imzasından gerçek tür: "png" | "jpeg" | "pdf" | "docx" | "xlsx" | null */
export function sniff(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 8) return null;
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return "pdf";
  if (buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
    // OOXML belgesi bir ZIP'tir; yerel dosya başlıklarındaki adlar sıkıştırılmadan yazılır.
    const s = buf.toString("latin1");
    if (s.indexOf("[Content_Types].xml") < 0) return null;
    if (/\bvbaProject\.bin/.test(s)) return null;   // makro içeren belge reddedilir
    if (s.indexOf("word/") >= 0) return "docx";
    if (s.indexOf("xl/") >= 0) return "xlsx";
  }
  return null;
}

/** Dosyanın GERÇEK içeriği uzantıyla uyuşuyor mu? Geçerliyse null. */
export function contentTypeError(buf, filename) {
  const kind = kindOf(filename);
  if (!kind) return TYPE_ERROR;
  return sniff(buf) === kind.sniff ? null : CONTENT_ERROR;
}

/** Görüntülenecek dosya adı: denetim karakterleri ve yol ayraçları atılır, 120 karakterle sınırlanır (uzantı korunur). */
export function cleanFilename(name) {
  let n = String(name || "").normalize("NFC").replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, "").replace(/\s+/g, " ").trim();
  if (n.length > 120) { const e = "." + extOf(n); n = n.slice(0, 120 - e.length) + e; }
  return n;
}
