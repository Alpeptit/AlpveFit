// utils/panelSession.js — v71: OTURUMU SUNUCUDA ÇÖZEN ORTAK YARDIMCI (sayfa ve varlık istekleri için).
// requireAuth API uçları için yazılmıştır (JSON 401/403 döner, CSRF denetler). Sayfa/varlık isteklerinde ise yanıt
// "yetkisiz" değil GENEL bir bulunamadı (404) olmalı ve hata ayrıntısı sızmamalıdır; bu yüzden aynı kurallar
// (JWT imzası + süresi, token_version, geçici kilit) burada SESSİZCE uygulanır ve sonuç yalnız kullanıcı ya da null'dır.
//   • Yönetim alanı (/admin, yönetim varlıkları, /api/admin/*): panelUser() — rol admin VEYA coach (veritabanından o anki rol)
// Veritabanı hatası da null döner (fail-closed): yetkisi doğrulanamayan istek hiçbir zaman içeri alınmaz.
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { parseCookies, AUTH_COOKIE_NAME } from "./cookies.js";
import { isLockActive } from "./rateLimit.js";
import { PANEL_ROLES } from "./permissions.js";

/** İstekteki oturumun kullanıcısı: { id, role, member_status } — geçersiz/eksik/kilitli oturumda null. */
export async function sessionUser(req) {
  const token = parseCookies(req.headers.cookie)[AUTH_COOKIE_NAME];
  if (!token) return null;
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] }); } catch { return null; }
  try {
    const { rows } = await pool.query(
      `SELECT id, role, member_status, token_version, locked_at, locked_until FROM users WHERE id = $1`, [payload.sub]);
    const u = rows[0];
    if (!u || u.token_version !== payload.tv || isLockActive(u)) return null;
    return { id: u.id, role: u.role, member_status: u.member_status };
  } catch {
    return null;
  }
}

/** Yönetim paneli kullanıcısı (Tam veya Yarım yetki) — değilse null. */
export async function panelUser(req) {
  const u = await sessionUser(req);
  return u && PANEL_ROLES.includes(u.role) ? u : null;
}


/** /api/admin/* için: yönetim rolü olmayan HERKESE (misafir dahil) genel API 404'ü — alanın varlığı belli olmaz. */
export async function hideAdminApi(req, res, next) {
  if (await panelUser(req)) return next();
  res.status(404).json({ error: "Bulunamadı." });
}
