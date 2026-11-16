// v26 — İlk yönetici hesabını oluşturur (tek seferlik kurulum komutu).
//
// Kullanım (Railway, API servisinin içinde):  railway ssh  →  npm run admin:create -- <e-posta> <kullanıcı_adı> "<Ad Soyad>"
//
// - Güçlü, rastgele bir GEÇİCİ şifre üretir ve YALNIZ BİR KEZ ekrana yazar (hiçbir yere kaydedilmez).
// - Hesap e-postası doğrulanmış, üyeliği onaylı ve rolü "admin" olarak oluşturulur.
// - Admin paneli 2FA (Google Authenticator) kurulmadan AÇILMAZ: ilk girişte Kullanıcı Paneli →
//   Hesap Ayarları'ndan 2FA'yı kurun, ardından geçici şifreyi değiştirin.
// - Bu e-posta veya kullanıcı adıyla bir hesap zaten varsa HİÇBİR ŞEY değiştirmez (mevcut hesabı yönetici
//   yapmak için bilinçli olarak SQL kullanın; komut başka bir hesabı sessizce yükseltmez).
import crypto from "node:crypto";
import { pool } from "./pool.js";
import { hashPassword, validatePassword, validateUsername } from "../utils/password.js";

const [email, username, ...nameParts] = process.argv.slice(2);
const fullName = nameParts.join(" ").trim();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(msg) { console.error("[admin:create] " + msg); process.exit(1); }

if (!email || !username || !fullName) fail('Kullanım: npm run admin:create -- <e-posta> <kullanıcı_adı> "<Ad Soyad>"');
if (!EMAIL_RE.test(email)) fail("Geçerli bir e-posta adresi girin.");
const uErr = validateUsername(username); if (uErr) fail(uErr);

function makePassword() {
  for (let i = 0; i < 50; i++) {
    const p = crypto.randomBytes(15).toString("base64url") + "!";
    if (/[a-zA-Z]/.test(p) && !validatePassword(p, fullName, username)) return p;
  }
  fail("Şifre üretilemedi, tekrar deneyin.");
}

async function main() {
  const e = email.trim().toLowerCase(), u = username.trim().toLowerCase();
  const exists = await pool.query("SELECT 1 FROM users WHERE email = $1 OR username = $2", [e, u]);
  if (exists.rowCount) fail("Bu e-posta veya kullanıcı adıyla bir hesap zaten var — hiçbir şey değiştirilmedi.");
  const password = makePassword();
  const hash = await hashPassword(password);
  const { rows } = await pool.query(
    `INSERT INTO users (full_name, username, email, password_hash, email_verified_at, role, member_status, user_code)
     VALUES ($1, $2, $3, $4, now(), 'admin', 'approved', 'AVF-' || lpad(nextval('user_code_seq')::text, 6, '0'))
     RETURNING id, user_code`,
    [fullName, u, e, hash]
  );
  await pool.query(
    `INSERT INTO audit_log (actor_id, action, target_type, target_id, details) VALUES ($1, 'admin_bootstrap', 'user', $3, $2)`,
    [rows[0].id, JSON.stringify({ via: "cli", userCode: rows[0].user_code }), String(rows[0].id)]
  ).catch((err) => console.warn("[admin:create] Denetim kaydı yazılamadı:", err.message));
  console.log("\n[admin:create] Yönetici hesabı oluşturuldu: " + e + " (" + rows[0].user_code + ")");
  console.log("[admin:create] GEÇİCİ ŞİFRE (yalnız bir kez gösterilir): " + password);
  console.log("[admin:create] İlk girişte: 2FA'yı kurun, sonra şifreyi değiştirin. Bu terminal çıktısını kapatın.\n");
  await pool.end();
}
main().catch((err) => { console.error("[admin:create] Hata:", err.message); process.exit(1); });
