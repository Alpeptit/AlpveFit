import pg from "pg";
import dotenv from "dotenv";
import { resolveDbSslConfig } from "./sslConfig.js";

dotenv.config();


// M-08 (4. bağımsız denetim, v4): production'da sertifika doğrulaması
// varsayılan olarak zorunlu — detaylar sslConfig.js içinde.
const sslResolution = resolveDbSslConfig(process.env);
if (sslResolution.error) {
  console.error(sslResolution.error);
  process.exit(1);
}
// v66: "[db] BİLGİ" satırı bir uyarı değil, bilgi notudur → stdout (Railway'de kırmızı "error" satırı olarak görünüp gerçek hataları
// gizlemesin). Doğrulamasız bağlantı gibi gerçek uyarılar stderr'e yazılmaya devam eder.
if (sslResolution.warning) (String(sslResolution.warning).startsWith("[db] BİLGİ") ? console.log : console.warn)(sslResolution.warning);

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,

  // M-08 (v4): SSL yapılandırması sslConfig.js'teki fail-closed mantıkla belirlenir.
  ssl: sslResolution.ssl,

  // Havuzdaki maksimum bağlantı sayısı — sınırsız bağlantı açılması,
  // veritabanını kolayca tüketebilecek bir kaynak-bitirme (DoS) vektörüdür.
  max: 20,

  // Bir bağlantı bu kadar süre boşta kalırsa kapatılır — kaynakları gereksiz
  // yere tutmaz.
  idleTimeoutMillis: 30_000,

  // Bir sorgu bu süreden uzun sürerse otomatik iptal edilir — yavaş/kötü
  // niyetli bir sorgunun bağlantıyı sonsuza kadar kilitlemesini engeller.
  statement_timeout: 10_000,

  // Yeni bir bağlantı kurmak bu süreden uzun sürerse hata verir, sonsuza
  // kadar beklemez.
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  console.error("[db] Beklenmeyen havuz hatası:", err);
});
