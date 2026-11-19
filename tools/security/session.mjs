// Güvenlik taraması (OWASP ZAP) için YALNIZ geçici CI veritabanında test hesabı açar ve oturum çerezi üretir.
// Üretim veritabanında ÇALIŞTIRILMAZ: TEST_DB_ONLY=1 ve DATABASE_URL'nin localhost olması zorunludur.
//   TEST_DB_ONLY=1 node tools/security/session.mjs <rol: user|admin> <kullanıcıadı>   → {"cookie":"…","csrf":"…","id":"…"}
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { pool } from "../../src/db/pool.js";
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME } from "../../src/utils/cookies.js";

const [role = "user", username = "zapuser"] = process.argv.slice(2);
const host = (() => { try { return new URL(process.env.DATABASE_URL).hostname; } catch { return ""; } })();
if (process.env.TEST_DB_ONLY !== "1" || !["localhost", "127.0.0.1"].includes(host)) { console.error("Yalnız yerel test veritabanında çalışır."); process.exit(2); }
if (!["user", "admin"].includes(role) || !/^[a-z0-9]{3,20}$/.test(username)) { console.error("geçersiz argüman"); process.exit(2); }

const cols = new Set((await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`)).rows.map((r) => r.column_name));
const hash = "$2b$12$" + crypto.randomBytes(40).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 53);   // hiçbir şifreyle eşleşmez
const { rows } = await pool.query(
  `INSERT INTO users (full_name, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)
   ON CONFLICT (username) DO UPDATE SET role = EXCLUDED.role RETURNING id, role, token_version`,
  [role === "admin" ? "Tarama Yonetici" : "Tarama Uye", username, username + "@example.test", hash, role]);
const u = rows[0];
// projeye göre değişen sütunlar: her biri ayrı denenir (olmayan sütun / izin verilmeyen değer diğerlerini etkilemez)
const tries = [];
if (cols.has("member_status")) tries.push(`member_status = 'active'`, `member_status = 'approved'`);
if (cols.has("email_verified")) tries.push(`email_verified = true`);
if (cols.has("email_verified_at")) tries.push(`email_verified_at = now()`);
if (role === "admin" && cols.has("totp_enabled")) tries.push(`totp_enabled = true`);
for (const t of tries) { try { await pool.query(`UPDATE users SET ${t} WHERE id = $1`, [u.id]); } catch { /* bu projede geçerli değil */ } }
const token = jwt.sign({ sub: u.id, role: u.role, tv: u.token_version }, process.env.JWT_SECRET, { expiresIn: "6h", algorithm: "HS256" });
const csrf = crypto.randomBytes(32).toString("hex");
process.stdout.write(JSON.stringify({ id: u.id, cookie: `${AUTH_COOKIE_NAME}=${token}; ${CSRF_COOKIE_NAME}=${csrf}`, csrf }));
await pool.end();
