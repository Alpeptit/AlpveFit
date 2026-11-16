import nodemailer from "nodemailer";
import axios from "axios";
import crypto from "crypto";
import { pool } from "../db/pool.js";

// Railway'in Free/Trial/Hobby planlarında dışarı SMTP kapalıdır; bu planlarda e-posta
// HTTPS tabanlı Resend API'si ile gönderilir (RESEND_API_KEY). Anahtar tanımlıysa o kullanılır,
// değilse SMTP (Pro plan veya kendi sunucu). İkisi de yoksa production'da gönderim fail-closed.
const resendKey = process.env.RESEND_API_KEY || "";
const smtpConfigured = Boolean(resendKey) || Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const useResend = Boolean(resendKey);
const isProduction = process.env.NODE_ENV === "production";

const transporter = (smtpConfigured && !useResend)
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      // v26: 465 → doğrudan TLS; 587 → STARTTLS ZORUNLU (sunucu TLS sunmazsa gönderim yapılmaz — şifresiz düşürme yok)
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      requireTLS: Number(process.env.SMTP_PORT || 587) !== 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

// v46: ikinci argüman şablon nesnesi olabilir — { subject, html, text, headers } (utils/emailTemplates.js).
// Düz metin sürümü (text) her iletide gönderilir; başlıklar yalnız beyaz listedeki adlarla (List-Unsubscribe…) geçer.
const HEADER_OK = /^(List-Unsubscribe|List-Unsubscribe-Post)$/;
export async function sendMail(to, subjectOrMsg, htmlArg) {
  const msg = subjectOrMsg && typeof subjectOrMsg === "object" ? subjectOrMsg : { subject: subjectOrMsg, html: htmlArg };
  const subject = String(msg.subject || "").replace(/[\r\n]+/g, " ").slice(0, 200);   // başlık enjeksiyonuna karşı tek satır
  const html = msg.html;
  const text = msg.text || String(html || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
  const headers = {};
  for (const [k, v] of Object.entries(msg.headers || {})) if (HEADER_OK.test(k) && typeof v === "string" && !/[\r\n]/.test(v)) headers[k] = v;
  if (!smtpConfigured) {
    // C-09 (final sertleştirme listesi) düzeltmesi: ÖNCEDEN, SMTP
    // yapılandırılmamışken (test/geliştirme İÇİN kasıtlı bir kolaylık),
    // GERÇEK doğrulama kodu (OTP) düz metin olarak konsola/loglara
    // yazılıyordu. Production'da (NODE_ENV=production) bu, Railway'in
    // Deploy Logs'una GERÇEK kullanıcı OTP'lerinin sızmasına yol açardı —
    // biri SMTP'yi ayarlamayı unutursa, HERKESİN doğrulama kodu düz metin
    // logda görünür.
    //
    // ÖNEMLİ DAVRANIŞ DEĞİŞİKLİĞİ: production'da artık kod ASLA loglanmaz
    // ve gönderim fail-closed olarak başarısız sayılır (sent:false) — bu,
    // production'da SMTP ayarlamadan kayıt/giriş akışlarının ÇALIŞMAYACAĞI
    // anlamına gelir (kasıtlı — sızıntıyı önlemek, sahte bir "başarı"
    // göstermekten daha güvenlidir). Geliştirme/test modunda (NODE_ENV
    // production değilken) eski, kolaylaştırıcı davranış (konsola yazma)
    // korunur.
    if (isProduction) {
      console.error(`[mail:HATA] SMTP yapılandırılmamış — production'da e-posta gönderilemiyor (alıcı: ${to}). Doğrulama kodu GÜVENLİK NEDENİYLE loglanmadı.`);
      return { sent: false, reason: "smtp_required_in_production" };
    }
    console.log(`\n[mail:henüz-yapılandırılmadı] Kime: ${to}\n[mail] Konu: ${subject}\n[mail] İçerik:\n${text}\n`);
    return { sent: false, reason: "not_configured" };
  }
  try {
    if (useResend) {
      await axios.post(
        "https://api.resend.com/emails",
        { from: process.env.MAIL_FROM, to: [to], subject, html, text, ...(Object.keys(headers).length ? { headers } : {}) },
        { headers: { Authorization: `Bearer ${resendKey}` }, timeout: 15000 }
      );
      return { sent: true };
    }
    await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html, text, headers });
    return { sent: true };
  } catch (err) {
    // K10 düzeltmesi: ÖNCEDEN burada hata sadece loglanıyordu, çağırana HİÇBİR
    // şey bildirilmiyordu — SMTP kesintisinde kullanıcı "kod gönderildi" yanıtı
    // alıp asla gelmeyen bir kodu bekleyerek kilitlenebiliyordu.
    //
    // ÖNEMLİ (mimari kısıtlama): Bu fonksiyon yine de hata FIRLATMIYOR — bu
    // projede express-async-errors gibi bir sarmalayıcı yok ve sendMail'in 14
    // çağrı noktasının HİÇBİRİ try/catch içinde değil. Burada throw etmek,
    // yakalanmamış bir promise reddine ve isteğin YANIT ALAMADAN sonsuza kadar
    // asılı kalmasına yol açardı — mevcut sessiz yutmadan DAHA KÖTÜ bir durum.
    // Bunun yerine {sent:false} döndürülüyor; kritik akışlar (kayıt, şifre
    // sıfırlama) bunu kontrol edip doğru bir hata yanıtı verir.
    console.error(`[mail:hata] "${to}" adresine gönderilemedi:`, (err.response && err.response.data && err.response.data.message) || err.message);
    return { sent: false, reason: "send_failed" };
  }
}

// M-08 (final sertleştirme listesi) düzeltmesi: dışa açık hale getirildi —
// twoFactor.js'deki AYNI (ve O11 ile aynı off-by-one hatasını taşıyan)
// kopya uygulama yerine artık bu TEK, merkezi üretici kullanılıyor.
export function genSixDigitCode() {
  // O11 düzeltmesi: crypto.randomInt(min, max)'ta max ÜST SINIR HARİÇTİR —
  // önceki (100000, 999999) hiçbir zaman 999999'u üretemezdi.
  return crypto.randomInt(100000, 1000000).toString();
}

// K9 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN 6 haneli kodlar bcrypt ile
// hash'leniyordu. Bcrypt PAROLALAR için tasarlanmıştır — çok büyük bir
// giriş uzayına (pratikte sonsuz) karşı, YAVAŞ olması işe yarar. Ama bir
// doğrulama kodunun giriş uzayı sadece 1.000.000 olasılıktır — bcrypt'in
// yavaşlığı burada hiçbir gerçek koruma SAĞLAMAZ: code_hash veritabanı
// sızarsa, saldırgan çevrimdışı, sınırsız denemeyle (GPU/çoklu çekirdekle)
// makul bir sürede TÜM olası kodları deneyip doğru olanı bulabilir.
//
// HMAC-SHA256 ile değiştirildi: sunucu secret'ı (aşağıda ENCRYPTION_KEY'den
// AYRI bir bağlamda türetilir, yeni bir ortam değişkeni gerektirmez)
// bilinmeden, hash'ten kodu geri çıkarmak veya bir tahmini doğrulamak
// KRİPTOGRAFİK OLARAK İMKANSIZDIR — DB dump'ı tek başına işe yaramaz.
const CODE_HMAC_SECRET = crypto.createHmac("sha256", process.env.ENCRYPTION_KEY || "").update("verification-code-secret-v1").digest();

function hashCode(code) {
  return crypto.createHmac("sha256", CODE_HMAC_SECRET).update(code).digest("hex");
}

/** v57: kod / bağlantı / bilet anahtarlarının saklanan özeti (şifre sıfırlama istekleri, bülten onayı aynı HMAC'i kullanır). */
export function hmacToken(value) { return hashCode(String(value ?? "")); }

/** Zamanlama saldırısına karşı sabit süreli karşılaştırma. */
function codeMatches(inputCode, storedHashHex) {
  const computed = Buffer.from(hashCode(inputCode || ""), "hex");
  const stored = Buffer.from(storedHashHex, "hex");
  // Buffer uzunlukları farklıysa timingSafeEqual hata fırlatır — ikisi de
  // her zaman SHA256 (32 bayt) çıktısı olduğu için bu normalde olmaz, ama
  // yine de güvenli tarafta kalmak için kontrol edilir.
  if (computed.length !== stored.length) return false;
  return crypto.timingSafeEqual(computed, stored);
}

/** Yeni bir doğrulama kodu üretir, hash'ini veritabanına kaydeder, düz kodu döner (mail için). */
export async function createVerificationCode(userId, purpose, target = null, ttlMinutes = 5) {
  const code = genSixDigitCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);
  await pool.query(
    `INSERT INTO verification_codes (user_id, purpose, code_hash, target, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, purpose, codeHash, target, expiresAt]
  );
  return code;
}

/**
 * v42: tek kullanımlık, tahmin edilemez bir "bilet" (32 bayt, base64url) üretir; yalnız HMAC'i saklanır.
 * Şifre sıfırlamada e-posta kodu doğrulandıktan sonraki adımlar (Authenticator / kurtarma kodu + yeni şifre) bu biletle sürer.
 */
export async function createTicket(userId, purpose, ttlMinutes = 15) {
  const ticket = crypto.randomBytes(32).toString("base64url");
  await pool.query(
    `INSERT INTO verification_codes (user_id, purpose, code_hash, target, expires_at) VALUES ($1, $2, $3, NULL, $4)`,
    [userId, purpose, hashCode(ticket), new Date(Date.now() + ttlMinutes * 60_000)]
  );
  return ticket;
}

/** Kodu/bileti TÜKETMEDEN doğrular (sonraki adım başarısız olursa kullanıcı baştan başlamak zorunda kalmasın). */
export async function peekCode(userId, purpose, input) {
  const { rows } = await pool.query(
    `SELECT id, code_hash FROM verification_codes
     WHERE user_id = $1 AND purpose = $2 AND consumed_at IS NULL AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [userId, purpose]
  );
  const ok = codeMatches(String(input || ""), rows[0]?.code_hash || "0".repeat(64));
  return rows[0] && ok ? { valid: true, id: rows[0].id } : { valid: false };
}

/** peekCode ile doğrulanmış kaydı atomik olarak tüketir (eşzamanlı ikinci kullanım false döner). */
export async function consumeCodeId(id) {
  const r = await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL RETURNING id`, [id]);
  return r.rows.length === 1;
}

// Gerçek bir HMAC-SHA256 çıktısıyla AYNI biçimde (64 hex karakter) sabit bir
// sahte değer — kayıt bulunamasa bile karşılaştırma yapılabilsin diye
// (yanıt süresinden "bekleyen bir kod var mı" bilgisinin sızmasını önler).
const DUMMY_HASH = "0".repeat(64);

/** Kullanıcının girdiği kodu doğrular. Başarılıysa kaydı tüketir ve true döner. */
export async function verifyCode(userId, purpose, inputCode) {
  const { rows } = await pool.query(
    `SELECT * FROM verification_codes
     WHERE user_id = $1 AND purpose = $2 AND consumed_at IS NULL AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [userId, purpose]
  );
  const record = rows[0];

  // Kayıt bulunamasa bile karşılaştırma yapılır — yanıt süresinden
  // "bekleyen bir kod var mı yok mu" bilgisinin sızmasını önlemek için.
  const matches = codeMatches(inputCode, record?.code_hash || DUMMY_HASH);
  if (!record || !matches) return { valid: false, reason: !record ? "expired_or_missing" : "wrong_code" };

  // Bulgu 9 (2. bağımsız denetim) düzeltmesi: ÖNCEDEN "tüket" adımı ayrı,
  // koşulsuz bir UPDATE'ti — aynı kodu kullanan İKİ eşzamanlı istek, ikisi
  // de yukarıdaki kontrolü GEÇEBİLİR, ikisi de "geçerli" dönebilirdi (K2'deki
  // kupon yarış durumuyla aynı sınıf hata). Artık tüketim TEK bir atomik,
  // koşullu UPDATE — sadece HALA tüketilmemişse başarılı olur. İkinci
  // eşzamanlı istek sıfır satır bulur ve doğru şekilde reddedilir.
  const consumed = await pool.query(
    `UPDATE verification_codes SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL RETURNING id`,
    [record.id]
  );
  if (consumed.rows.length === 0) {
    // Başka bir eşzamanlı istek tam bu sırada tüketti.
    return { valid: false, reason: "wrong_code" };
  }
  return { valid: true, target: record.target };
}
