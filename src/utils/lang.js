// Arayüz dili: tarayıcı X-Avf-Lang başlığıyla bildirir; üyenin tercihi e-postaların dilini belirler.
import { pool } from "../db/pool.js";

export async function rememberLang(userId, req) {
  const h = String((req && req.headers && req.headers["x-avf-lang"]) || "").toLowerCase();
  if (!userId || (h !== "en" && h !== "tr")) return;
  await pool.query(`UPDATE users SET preferred_lang = $2 WHERE id = $1 AND preferred_lang IS DISTINCT FROM $2`, [userId, h]).catch(() => {});
}
