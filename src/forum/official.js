// AlpveFit Ekibi'nin sabit forum içerikleri: açılışta (migration sonrası) eksik olanlar eklenir, sürümü artanlar güncellenir.
// İçerik kaynakları src/forum/content/*.js içindedir. Bir moderatörün kaldırdığı içerik geri getirilmez.
//
// Resmî hesap: giriş yapamaz (kalıcı kilit + kullanılamaz şifre, ".invalid" e-posta), yetkisi yoktur; forumda "AlpveFit Ekibi" unvanıyla görünür.
// GIF'ler GIPHY'den (anahtar varsa) "g" derecesiyle aranır, sunucuya indirilip mesaja bağlanır (ziyaretçi GIPHY'ye bağlanmaz).
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import axios from "axios";
import bcrypt from "bcrypt";
import { pool } from "../db/pool.js";
import { imageInfo } from "../utils/forumRules.js";
import { stripImageMetadata } from "../utils/imageClean.js";
import { CONTENT } from "./content/index.js";

const OFFICIAL_EMAIL = "forum-ekibi@alpvefit.invalid";
const NAMES = ["alpvefit", "alpvefit.ekip", "alpvefit.ekibi"];

async function officialAccount() {
  const have = await pool.query(`SELECT u.id FROM users u JOIN forum_profiles f ON f.user_id = u.id WHERE f.is_official LIMIT 1`);
  if (have.rows.length) return have.rows[0].id;
  const byMail = await pool.query(`SELECT id FROM users WHERE email = $1`, [OFFICIAL_EMAIL]);
  let id = byMail.rows[0] && byMail.rows[0].id;
  if (!id) {
    let username = null;
    for (const n of NAMES) if (!(await pool.query(`SELECT 1 FROM users WHERE username = $1`, [n])).rows.length) { username = n; break; }
    if (!username) throw new Error("resmî forum hesabı için kullanıcı adı bulunamadı");
    const hash = await bcrypt.hash(crypto.randomBytes(48).toString("base64"), 12);   // kimsenin bilmediği şifre
    id = (await pool.query(
      `INSERT INTO users (full_name, username, email, password_hash, email_verified_at, role, member_status, locked_at, locked_reason)
       VALUES ('AlpveFit Ekibi', $1, $2, $3, now(), 'user', 'active', now(), 'system_account') RETURNING id`, [username, OFFICIAL_EMAIL, hash])).rows[0].id;
  }
  await pool.query(`INSERT INTO forum_profiles (user_id, is_official, rules_accepted_at) VALUES ($1, true, now())
      ON CONFLICT (user_id) DO UPDATE SET is_official = true, rules_accepted_at = coalesce(forum_profiles.rules_accepted_at, now())`, [id]);
  return id;
}

/** GIPHY'de arar, ilk uygun GIF'i (≈200 px yükseklik, en fazla 2,5 MB) indirir. Anahtar yoksa ya da hata olursa null. */
async function fetchGif(query) {
  const key = process.env.GIPHY_API_KEY; if (!key) return null;
  try {
    const { data } = await axios.get("https://api.giphy.com/v1/gifs/search", { params: { api_key: key, q: query, limit: 8, rating: "g", lang: "en" }, timeout: 8000 });
    for (const g of (data && data.data) || []) {
      const im = (g.images && (g.images.fixed_height || g.images.downsized)) || null;
      if (!im || !im.url) continue;
      const u = new URL(im.url); if (u.protocol !== "https:" || !/(^|\.)giphy\.com$/.test(u.hostname)) continue;
      if (Number(im.size) > 2.5 * 1024 * 1024) continue;
      const r = await axios.get(im.url, { responseType: "arraybuffer", timeout: 12000, maxContentLength: 2.5 * 1024 * 1024, maxRedirects: 2, validateStatus: (s) => s === 200 });
      const buf = Buffer.from(r.data), info = imageInfo(buf);
      if (info && info.mime === "image/gif") return stripImageMetadata(buf, "image/gif");
    }
  } catch { /* GIF olmadan devam */ }
  return null;
}

async function attachGifs(userId, postId, queries) {
  if (!queries || !queries.length) return 0;
  const have = (await pool.query(`SELECT count(*)::int AS n FROM attachments WHERE forum_post_id = $1`, [postId])).rows[0].n;
  if (have >= queries.length) return 0;
  let added = 0;
  for (const q of queries.slice(have)) {
    const buf = await fetchGif(q); if (!buf) return added;   // sıra bozulmasın: biri inmezse kalanlar sonraki açılışa kalır
    await pool.query(`INSERT INTO attachments (user_id, scope, filename, mime, size_bytes, data, forum_post_id, created_at) VALUES ($1, 'forum', 'gif.gif', 'image/gif', $2, $3, $4, clock_timestamp())`,
      [userId, buf.length, buf, postId]);
    added++;
  }
  return added;
}

async function setTags(topicId, slugs) {
  await pool.query(`DELETE FROM forum_topic_tags WHERE topic_id = $1`, [topicId]);
  if (slugs && slugs.length) await pool.query(`INSERT INTO forum_topic_tags (topic_id, tag_id) SELECT $1, id FROM forum_tags WHERE slug = ANY($2::text[]) ON CONFLICT DO NOTHING`, [topicId, slugs]);
}

/** Ekip hesabının profil fotoğrafı: yoksa uygulama simgesi (AlpveFit "A") konur; yöneticinin sonradan yüklediği görsel korunur. */
async function officialAvatar(uid) {
  if ((await pool.query(`SELECT 1 FROM attachments WHERE user_id = $1 AND scope = 'avatar'`, [uid])).rows.length) return;
  const buf = await readFile(new URL("../../site/assets/icons/icon-512.png", import.meta.url));
  await pool.query(`INSERT INTO attachments (user_id, scope, filename, mime, size_bytes, data) VALUES ($1, 'avatar', 'avatar.png', 'image/png', $2, $3)`, [uid, buf.length, buf]);
}

export async function seedOfficialContent(log = console) {
  const uid = await officialAccount();
  try { await officialAvatar(uid); } catch (e) { log.warn && log.warn("[forum] ekip profil fotoğrafı konamadı: " + e.message); }
  let created = 0, updated = 0, gifs = 0;
  // Sıra: listede sonra gelen, sabit konular arasında üstte görünsün diye zaman damgası ters sırayla verilir.
  const base = Date.now();
  for (let i = 0; i < CONTENT.length; i++) {
    const it = CONTENT[i];
    const cat = (await pool.query(`SELECT id FROM forum_categories WHERE slug = $1`, [it.category])).rows[0];
    if (!cat) { log.warn && log.warn(`[forum] içerik atlandı (kategori yok): ${it.key}`); continue; }
    const ex = (await pool.query(`SELECT t.id, t.official_rev, t.hidden_at, p.id AS post_id FROM forum_topics t JOIN forum_posts p ON p.topic_id = t.id AND p.is_first WHERE t.official_key = $1`, [it.key])).rows[0];
    let postId;
    if (!ex) {
      const at = new Date(base - i * 60000);
      const t = (await pool.query(
        `INSERT INTO forum_topics (category_id, author_id, title, kind, is_pinned, is_locked, last_poster_id, created_at, last_post_at, official_key, official_rev, icon)
         VALUES ($1, $2, $3, 'discussion', $4, $5, $2, $6, $6, $7, $8, $9) RETURNING id`, [cat.id, uid, it.title, it.pinned !== false, !!it.locked, at, it.key, it.rev || 1, it.icon || null])).rows[0];
      postId = (await pool.query(`INSERT INTO forum_posts (topic_id, author_id, body, is_first, created_at) VALUES ($1, $2, $3, true, $4) RETURNING id`, [t.id, uid, it.body, at])).rows[0].id;
      await pool.query(`UPDATE forum_topics SET last_post_id = $2 WHERE id = $1`, [t.id, postId]);
      await setTags(t.id, it.tags);
      created++;
    } else {
      if (ex.hidden_at) continue;   // ekipten biri kaldırdıysa geri getirilmez
      postId = ex.post_id;
      if ((ex.official_rev || 0) < (it.rev || 1)) {
        await pool.query(`UPDATE forum_topics SET title = $2, category_id = $3, is_pinned = $4, is_locked = $5, official_rev = $6, icon = $7, updated_at = now() WHERE id = $1`, [ex.id, it.title, cat.id, it.pinned !== false, !!it.locked, it.rev || 1, it.icon || null]);
        await pool.query(`UPDATE forum_posts SET body = $2 WHERE id = $1`, [postId, it.body]);
        await setTags(ex.id, it.tags);
        updated++;
      }
    }
    gifs += await attachGifs(uid, postId, it.gifs);
  }
  const posts = (await pool.query(`SELECT count(*)::int AS n FROM forum_topics WHERE author_id = $1 AND hidden_at IS NULL`, [uid])).rows[0].n;
  await pool.query(`UPDATE forum_profiles SET topics = $2 WHERE user_id = $1`, [uid, posts]);
  if (created || updated || gifs) log.log(`[forum] ekip içerikleri: ${created} yeni, ${updated} güncellendi, ${gifs} GIF`);
  return { created, updated, gifs };
}
