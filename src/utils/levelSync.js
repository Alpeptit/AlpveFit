// Forum seviyesi yükseldiğinde (etkinlikle veya yönetici ataması / elle seviye ile) üye bilgilendirilir:
// panelde kutlama penceresi (bildirim verisinden), bildirim listesi ve e-posta. Seviye düşerse sessizce güncellenir.
import { pool } from "../db/pool.js";
import { forumLevel } from "./forumLevels.js";
import { sendMail } from "./mailer.js";
import { levelUpMail } from "./emailTemplates.js";
import { emit } from "./live.js";

export async function syncLevel(userId) {
  await pool.query(`INSERT INTO forum_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`, [userId]);
  const { rows } = await pool.query(
    `SELECT u.role, u.email, u.preferred_lang, f.* FROM users u JOIN forum_profiles f ON f.user_id = u.id WHERE u.id = $1`, [userId]);
  const r = rows[0]; if (!r) return null;
  const lv = forumLevel(r, r.role);
  const prev = Number(r.notified_level || 1);
  if (lv.n === prev) return lv;
  // Atomik: yalnız bir istek kutlamayı oluşturur.
  const upd = await pool.query(`UPDATE forum_profiles SET notified_level = $2 WHERE user_id = $1 AND notified_level = $3 RETURNING user_id`, [userId, lv.n, prev]);
  if (!upd.rows.length || lv.n < prev || r.role === "admin") return lv;   // yönetici hesabına kutlama gönderilmez
  await pool.query(`INSERT INTO notifications (user_id, type, text, data) VALUES ($1, 'level_up', $2, $3)`,
    [userId, `Tebrikler! Forum seviyeniz yükseldi: ${lv.name}`, JSON.stringify({ n: lv.n, name: lv.name, popup: true })]);
  emit(userId, "notif", { kind: "level" });
  if (r.email) sendMail(r.email, levelUpMail(r.preferred_lang, { name: lv.name })).catch(() => {});
  return lv;
}
