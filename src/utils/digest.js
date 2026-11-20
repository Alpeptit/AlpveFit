// Haftalık forum özeti e-postası: Pazartesi 09.00'dan (Türkiye saati) sonra, haftada bir kez; yalnız Forum Ayarları'nda
// "Haftalık forum özeti" tercihini AÇAN, e-postası doğrulanmış ve forumdan uzaklaştırılmamış üyelere.
// Aynı hafta iki kez gönderilmez (digest_runs + kişi başına digest_sent); yarıda kalan gönderim kaldığı yerden sürer.
import { pool } from "../db/pool.js";
import { sendMail } from "./mailer.js";
import { digestMail, siteBase } from "./emailTemplates.js";
import { challengeFor, weekStart, todayTR } from "./challenges.js";

let timer = null, running = false;

export async function buildDigest() {
  const base = siteBase() || "https://www.alpvefit.com";
  const topics = (await pool.query(
    `SELECT t.id, t.title, t.reply_count, fp.like_count, c.name AS cat
       FROM forum_topics t JOIN forum_categories c ON c.id = t.category_id JOIN forum_posts fp ON fp.topic_id = t.id AND fp.is_first
      WHERE t.hidden_at IS NULL AND t.official_key IS NULL AND t.last_post_at > now() - interval '7 days' AND c.slug NOT LIKE '%steroid%' AND c.slug NOT IN ('farmakoloji', 'sarms', 'peptit')
      ORDER BY (fp.like_count * 2 + t.reply_count) DESC, t.last_post_at DESC LIMIT 5`)).rows
    .map((t) => ({ title: t.title, url: `${base}/forum/konu/${t.id}`, meta: `${t.cat} · ${t.reply_count} yanıt · ${t.like_count} beğeni` }));
  const guides = (await pool.query(
    `SELECT t.id, t.title FROM forum_topics t WHERE t.official_key IS NOT NULL AND t.hidden_at IS NULL AND t.created_at > now() - interval '7 days' ORDER BY t.created_at DESC LIMIT 5`)).rows
    .map((t) => ({ title: t.title, url: `${base}/forum/konu/${t.id}` }));
  return { topics, guides, challenge: challengeFor(weekStart(todayTR())), settingsUrl: `${base}/panel/forum-ayarlari/bildirimler` };
}

export async function runDigest(now = Date.now(), { force = false } = {}) {
  if (running) return { skipped: "running" };
  const today = todayTR(now), ws = weekStart(today), hourTR = new Date(now + 3 * 3600e3).getUTCHours();
  if (!force && (today !== ws || hourTR < 9)) return { skipped: "not_time" };
  running = true;
  try {
    const run = (await pool.query(`INSERT INTO digest_runs (week_start) VALUES ($1) ON CONFLICT (week_start) DO UPDATE SET week_start = EXCLUDED.week_start RETURNING finished_at`, [ws])).rows[0];
    if (run.finished_at && !force) return { skipped: "done" };
    const content = await buildDigest();
    if (!content.topics.length && !content.guides.length) { await pool.query(`UPDATE digest_runs SET finished_at = now() WHERE week_start = $1`, [ws]); return { sent: 0, empty: true }; }
    const users = (await pool.query(
      `SELECT u.id, u.email FROM users u JOIN forum_profiles f ON f.user_id = u.id
        WHERE (f.notify->>'digest') = 'true' AND f.rules_accepted_at IS NOT NULL AND NOT f.ban_permanent AND (f.banned_until IS NULL OR f.banned_until < now())
          AND u.email_verified_at IS NOT NULL AND u.locked_at IS NULL
          AND NOT EXISTS (SELECT 1 FROM digest_sent d WHERE d.week_start = $1 AND d.user_id = u.id) LIMIT 2000`, [ws])).rows;
    const mail = digestMail("tr", content);
    let sent = 0;
    for (const u of users) {
      try { await sendMail(u.email, mail); await pool.query(`INSERT INTO digest_sent (week_start, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [ws, u.id]); sent++; }
      catch (e) { console.error("[digest] gönderilemedi:", e.message); }
    }
    await pool.query(`UPDATE digest_runs SET sent = sent + $2, finished_at = CASE WHEN $3 THEN now() ELSE finished_at END WHERE week_start = $1`, [ws, sent, users.length < 2000]);
    return { sent };
  } finally { running = false; }
}

export function startDigestJob() {
  if (timer) return;
  timer = setInterval(() => { runDigest().catch((e) => console.error("[digest]", e.message)); }, 30 * 60 * 1000);
  timer.unref?.();
}
