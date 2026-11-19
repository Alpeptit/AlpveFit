// Görsel üst verisi temizleme (gizlilik): telefon fotoğraflarındaki EXIF / XMP / IPTC bilgileri — konum (GPS), cihaz, tarih,
// sahip adı — herkese açık alana (forum, mesaj) yüklenmeden ÖNCE silinir. Yalnız fotoğrafın doğru yönde görünmesi için gereken
// "yön" (Orientation) bilgisi, tek alanlık küçük bir EXIF bloğu olarak korunur. Piksel verisine dokunulmaz (yeniden sıkıştırma yok).
// PNG: eXIf ve metin parçaları (tEXt / iTXt / zTXt) çıkarılır. GIF: yorum ve uygulama blokları (XMP) çıkarılır.

function jpegOrientation(app1) {
  // app1: "Exif\0\0" + TIFF
  if (app1.length < 14 || app1.toString("ascii", 0, 4) !== "Exif") return 0;
  const t = app1.subarray(6), le = t.toString("ascii", 0, 2) === "II";
  if (!le && t.toString("ascii", 0, 2) !== "MM") return 0;
  const u16 = (o) => (o + 2 <= t.length ? (le ? t.readUInt16LE(o) : t.readUInt16BE(o)) : 0);
  const u32 = (o) => (o + 4 <= t.length ? (le ? t.readUInt32LE(o) : t.readUInt32BE(o)) : 0);
  const ifd = u32(4); if (!ifd || ifd + 2 > t.length) return 0;
  const n = u16(ifd);
  for (let i = 0; i < n && i < 400; i++) {
    const e = ifd + 2 + i * 12; if (e + 12 > t.length) break;
    if (u16(e) === 0x0112) { const v = u16(e + 8); return v >= 1 && v <= 8 ? v : 0; }
  }
  return 0;
}
function orientationSegment(v) {
  // APP1: FFE1 + uzunluk + "Exif\0\0" + TIFF(II, 42, IFD@8) + 1 alan (0x0112 SHORT 1 v) + sonraki IFD = 0
  const tiff = Buffer.alloc(26);
  tiff.write("II", 0, "ascii"); tiff.writeUInt16LE(42, 2); tiff.writeUInt32LE(8, 4);
  tiff.writeUInt16LE(1, 8); tiff.writeUInt16LE(0x0112, 10); tiff.writeUInt16LE(3, 12); tiff.writeUInt32LE(1, 14); tiff.writeUInt16LE(v, 18); tiff.writeUInt32LE(0, 22);
  const body = Buffer.concat([Buffer.from("Exif\0\0", "binary"), tiff]);
  const head = Buffer.from([0xff, 0xe1, 0, 0]); head.writeUInt16BE(body.length + 2, 2);
  return Buffer.concat([head, body]);
}
function cleanJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return buf;
  const out = [buf.subarray(0, 2)]; let i = 2, orient = 0;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) return buf;   // beklenmeyen yapı: dokunma
    const m = buf[i + 1];
    if (m === 0xff) { i++; continue; }
    if (m === 0xda) { out.push(buf.subarray(i)); break; }   // görüntü verisi başladı: kalanı olduğu gibi
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { out.push(buf.subarray(i, i + 2)); i += 2; continue; }
    const len = buf.readUInt16BE(i + 2); if (len < 2 || i + 2 + len > buf.length) return buf;
    const seg = buf.subarray(i, i + 2 + len);
    const drop = m === 0xe1 || m === 0xed || m === 0xfe || (m >= 0xe3 && m <= 0xef && m !== 0xee);   // EXIF/XMP, IPTC, yorum, üretici blokları (Adobe APP14 kalır)
    if (m === 0xe1 && !orient) orient = jpegOrientation(seg.subarray(4));
    if (!drop) out.push(seg);
    i += 2 + len;
  }
  const res = Buffer.concat(out);
  return orient > 1 ? Buffer.concat([res.subarray(0, 2), orientationSegment(orient), res.subarray(2)]) : res;
}
function cleanPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return buf;
  const out = [buf.subarray(0, 8)]; let i = 8;
  while (i + 12 <= buf.length) {
    const len = buf.readUInt32BE(i), type = buf.toString("ascii", i + 4, i + 8), end = i + 12 + len;
    if (end > buf.length) return buf;
    if (!["eXIf", "tEXt", "iTXt", "zTXt", "tIME"].includes(type)) out.push(buf.subarray(i, end));
    i = end; if (type === "IEND") break;
  }
  return Buffer.concat(out);
}
function cleanGif(buf) {
  // Başlık + mantıksal ekran + (varsa) genel renk tablosu, ardından bloklar; yorum (0xFE) ve uygulama blokları çıkarılır,
  // NETSCAPE (döngü) uygulama bloğu korunur — aksi hâlde animasyon bir kez oynayıp durur.
  if (buf.length < 13) return buf;
  let i = 13; const flags = buf[10]; if (flags & 0x80) i += 3 * (1 << ((flags & 7) + 1));
  const out = [buf.subarray(0, i)];
  const skipSubBlocks = (j) => { while (j < buf.length) { const n = buf[j]; j += 1 + n; if (n === 0) break; } return j; };
  while (i < buf.length) {
    const b = buf[i];
    if (b === 0x3b) { out.push(buf.subarray(i, i + 1)); return Buffer.concat(out); }
    if (b === 0x21) {
      const label = buf[i + 1], start = i, end = skipSubBlocks(i + 2);
      if (end > buf.length) return buf;
      const isNetscape = label === 0xff && buf.toString("ascii", i + 3, i + 14) === "NETSCAPE2.0";
      if (label === 0xfe || (label === 0xff && !isNetscape)) { i = end; continue; }
      out.push(buf.subarray(start, end)); i = end; continue;
    }
    if (b === 0x2c) {
      let j = i + 10; const f = buf[i + 9]; if (f & 0x80) j += 3 * (1 << ((f & 7) + 1));
      j = skipSubBlocks(j + 1);   // LZW en küçük kod boyutu + veri alt blokları
      if (j > buf.length) return buf;
      out.push(buf.subarray(i, j)); i = j; continue;
    }
    return buf;   // tanınmayan yapı: dokunma
  }
  return buf;
}
/** Görselin üst verisini temizler; yapı tanınmazsa görseli olduğu gibi döndürür (asla bozmaz). */
export function stripImageMetadata(buf, mime) {
  try {
    if (mime === "image/jpeg") return cleanJpeg(buf);
    if (mime === "image/png") return cleanPng(buf);
    if (mime === "image/gif") return cleanGif(buf);
  } catch { /* dokunma */ }
  return buf;
}
