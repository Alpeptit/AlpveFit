// Forum (üye alanı): kategoriler, konular, mesajlar, tepkiler, okunmamış izi, takip, kaydedilenler, anket, arama, profil,
// görseller, şikâyet ve moderasyon. Forum Ayarları (kullanıcı adı, avatar, imza…) routes/forum.js'tedir.
//
// Erişim (her uçta, sunucuda): oturum açık + e-posta doğrulanmış + forum kuralları (18 yaş beyanı dahil) onaylanmış +
// forumdan uzaklaştırılmamış. Misafire hiçbir forum verisi verilmez. Gizlenen içerik yalnız moderatöre görünür.
// Sayaçlar (forum_profiles.topics/posts/likes/dislikes) yalnız GÖRÜNÜR içeriği sayar; seviye bu sayaçlardan hesaplanır.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLog.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";
import { forumLevel, publicLevel, forumScore, LEVELS } from "../utils/forumLevels.js";
import { syncLevel } from "../utils/levelSync.js";
import { notifyIn, imageInfo } from "../utils/forumRules.js";
import { stripImageMetadata } from "../utils/imageClean.js";
import { giphyEnabled, giphyDownload } from "../utils/giphy.js";
import { raw, sendAttachment } from "./uploads.js";
import { emit } from "../utils/live.js";
import {
  clean, contentError, quotedPostIds, mentions, pollIn, REPORT_REASONS, RULES, RULE_ICONS,
  IMAGES_PER_POST, IMAGE_MAX, IMAGE_PX, PENDING_MAX, PAGE_POSTS, PAGE_TOPICS, TAGS_PER_TOPIC,
} from "../utils/forumContent.js";
// Özet metni: alıntı blokları, biçim etiketleri ([kutu=…], [gif=1] …) ve başlık işaretleri olmadan düz metin (kaynak rozeti → etiketi).
const plainSql = (col) => `regexp_replace(regexp_replace(regexp_replace(regexp_replace(${col}, '\\[alinti=[^\\]]*\\][\\s\\S]*?\\[/alinti\\]', '', 'g'), '\\[kaynak=\\d+\\|([^\\]]*)\\]', '\\1', 'g'), '\\[/?[a-z]+(=[^\\]]*)?\\]', '', 'g'), '(^|\\n)\\s*(#{2,3}|>)\\s*', '\\1', 'g')`;

export const boardRouter = withAsyncErrors(express.Router());
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ip = (req) => req.ip || null;
const int = (v, d, min, max) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d; };

// ------------------------------------------------------------------ erişim kapısı
const AUTHOR = `u.id AS uid, u.username, u.role, u.created_at AS joined_at,
  (SELECT id FROM attachments WHERE user_id = u.id AND scope = 'avatar') AS avatar_id,
  f.level_override, f.forum_role, f.topics, f.posts, f.likes, f.dislikes, f.reports_upheld, coalesce(f.signature, '') AS signature,
  (SELECT id FROM attachments WHERE user_id = u.id AND scope = 'sig') AS sig_image_id, f.last_seen_at, f.hide_online, f.is_official`;
function authorOut(r) {
  if (!r || !r.username) return { username: null, deleted: true };
  const lv = forumLevel(r, r.role);
  // Yönetici ve moderatörlerin katılım tarihi gösterilmez (ekip bilgisi); üyelerinki görünür.
  return { id: r.uid, username: r.username, avatarId: r.avatar_id, level: publicLevel(lv), joinedAt: lv.assigned ? null : r.joined_at,
    stats: { topics: r.topics || 0, posts: r.posts || 0, likes: r.likes || 0 }, signature: r.signature || "", sigImageId: r.sig_image_id || null,
    online: !r.hide_online && !!(r.last_seen_at && Date.now() - new Date(r.last_seen_at).getTime() < 15 * 60000) };
}

async function gate(req, res, next) {
  const { rows } = await pool.query(
    `SELECT u.id, u.username, u.role, u.email_verified_at, f.level_override, f.forum_role, f.topics, f.posts, f.likes, f.dislikes, f.reports_upheld,
            f.rules_accepted_at, f.banned_until, f.ban_permanent, f.ban_reason, f.last_seen_at, coalesce(f.notify, '{}'::jsonb) AS notify, f.is_official, f.hide_online
       FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id WHERE u.id = $1`, [req.user.sub]);
  const me = rows[0];
  if (!me || !me.email_verified_at) return res.status(403).json({ error: "Foruma katılmak için e-posta adresinizi doğrulayın.", code: "verify" });
  if (!me.rules_accepted_at) return res.status(403).json({ error: "Foruma girmek için forum kurallarını ve 18 yaş beyanını onaylayın.", code: "rules", rules: RULES, icons: RULE_ICONS });
  const banned = me.ban_permanent || (me.banned_until && new Date(me.banned_until) > new Date());
  const lv = forumLevel(me, me.role);
  req.fm = { id: me.id, username: me.username, role: me.role, level: lv, mod: me.role === "admin" || me.forum_role === "moderator", admin: me.role === "admin", hideOnline: !!me.hide_online,
    banned, banUntil: me.ban_permanent ? null : me.banned_until, banReason: me.ban_reason || "", since: me.rules_accepted_at, notify: notifyIn(me.notify) };
  if (!me.last_seen_at || Date.now() - new Date(me.last_seen_at).getTime() > 120000)
    pool.query(`UPDATE forum_profiles SET last_seen_at = now() WHERE user_id = $1`, [me.id]).catch(() => {});
  next();
}
// oturum + forum kapısı tek ara katmanda (dizi yerine) — tüm uçlarda aynı sıra
function member(req, res, next) {
  requireAuth(req, res, (err) => { if (err) return next(err); Promise.resolve(gate(req, res, next)).catch(next); });
}
function canWrite(req, res) {
  if (!req.fm.banned) return true;
  res.status(403).json({ error: req.fm.banUntil ? "Forumdan süreli olarak uzaklaştırıldınız; bu süre içinde yazamazsınız." : "Forumdan uzaklaştırıldınız; yazamazsınız.",
    code: "forum_banned", until: req.fm.banUntil, reason: req.fm.banReason });
  return false;
}
function modOnly(req, res) { if (req.fm.mod) return true; res.status(404).json({ error: "Bulunamadı." }); return false; }
const LIMITS = { topic: [3, 6, 12], post: [20, 40, 90], react: [120, 120, 200] };
function limitFor(req, kind) { if (req.fm.mod) return 600; const L = LIMITS[kind]; return req.fm.level.n <= 1 ? L[0] : req.fm.level.n === 2 ? L[1] : L[2]; }
async function limited(req, res, kind, label) {
  if (await checkHourlyActionLimit(`f${kind}:${req.fm.id}`, "forum_" + kind, limitFor(req, kind))) return false;
  res.status(429).json({ error: label || "Kısa sürede çok fazla işlem yaptınız. Lütfen biraz sonra tekrar deneyin." }); return true;
}

// ------------------------------------------------------------------ sayaçlar ve bildirimler
async function bump(client, userId, d) {
  if (!userId) return;
  await client.query(`INSERT INTO forum_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`, [userId]);
  await client.query(`UPDATE forum_profiles SET topics = greatest(0, topics + $2), posts = greatest(0, posts + $3), likes = greatest(0, likes + $4),
      dislikes = greatest(0, dislikes + $5), updated_at = now() WHERE user_id = $1`, [userId, d.topics || 0, d.posts || 0, d.likes || 0, d.dislikes || 0]);
}
async function tx(fn) {
  const c = await pool.connect();
  try { await c.query("BEGIN"); const r = await fn(c); await c.query("COMMIT"); return r; }
  catch (e) { try { await c.query("ROLLBACK"); } catch { /* yok say */ } throw e; }
  finally { if (c.release) c.release(); }
}
async function prefsOf(ids) {
  if (!ids.length) return {};
  const { rows } = await pool.query(`SELECT u.id, coalesce(f.notify, '{}'::jsonb) AS notify FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id
     WHERE u.id = ANY(SELECT jsonb_array_elements_text($1::jsonb)::uuid)`, [JSON.stringify(ids)]);
  return Object.fromEntries(rows.map((r) => [r.id, notifyIn(r.notify)]));
}
async function note(userId, text, data) {
  await pool.query(`INSERT INTO notifications (user_id, type, text, data) VALUES ($1, 'forum', $2, $3)`, [userId, text, JSON.stringify(data)]).catch(() => {});
  emit(userId, "notif", { kind: "forum" });   // açık sekmede zil sayacı anında güncellenir
}
const short = (t) => (t.length > 60 ? t.slice(0, 57) + "…" : t);

// ------------------------------------------------------------------ yardımcılar
async function category(slugOrId) {
  const q = typeof slugOrId === "number" ? `id = $1` : `slug = $1`;
  const { rows } = await pool.query(`SELECT * FROM forum_categories WHERE ${q}`, [slugOrId]);
  return rows[0] || null;
}
function catOut(c) { return { id: c.id, slug: c.slug, name: c.name, description: c.description, icon: c.icon, color: c.color || "slate", kind: c.kind, isLocked: c.is_locked, notice: c.notice, minLevel: c.min_level_topic, parentId: c.parent_id || null }; }
/** Kategori + alt kategorileri (üst kategori sayfası alt kategorilerin konularını da listeler). */
async function familyOf(cat) {
  const kids = (await pool.query(`SELECT * FROM forum_categories WHERE parent_id = $1 ORDER BY sort, id`, [cat.id])).rows;
  const parent = cat.parent_id ? await category(cat.parent_id) : null;
  return { ids: [cat.id, ...kids.map((k) => k.id)], kids, parent };
}
async function tagsOf(topicIds) {
  if (!topicIds.length) return {};
  const { rows } = await pool.query(`SELECT tt.topic_id, g.slug, g.name, g.icon FROM forum_topic_tags tt JOIN forum_tags g ON g.id = tt.tag_id
      WHERE tt.topic_id = ANY(SELECT jsonb_array_elements_text($1::jsonb)::uuid) ORDER BY g.name`, [JSON.stringify(topicIds)]);
  const out = {}; for (const r of rows) (out[r.topic_id] = out[r.topic_id] || []).push({ slug: r.slug, name: r.name, icon: r.icon });
  return out;
}
/** Konu etiketleri: tanımlı listeden en fazla 5 tane (bilinmeyen etiket reddedilir). */
async function tagsIn(v) {
  if (v === undefined || v === null) return { ids: [] };
  if (!Array.isArray(v) || v.length > TAGS_PER_TOPIC || v.some((x) => typeof x !== "string" || !/^[a-z0-9-]{2,40}$/.test(x))) return { err: `En fazla ${TAGS_PER_TOPIC} etiket seçebilirsiniz.` };
  const uniq = [...new Set(v)]; if (!uniq.length) return { ids: [] };
  const { rows } = await pool.query(`SELECT id FROM forum_tags WHERE slug = ANY($1::text[])`, [uniq]);
  if (rows.length !== uniq.length) return { err: "Etiketlerden biri geçersiz." };
  return { ids: rows.map((r) => r.id) };
}
async function topicRow(id, req) {
  if (!ID.test(id)) return null;
  const { rows } = await pool.query(`SELECT t.*, c.slug AS cat_slug, c.is_locked AS cat_locked, c.kind AS cat_kind FROM forum_topics t JOIN forum_categories c ON c.id = t.category_id WHERE t.id = $1`, [id]);
  const t = rows[0];
  if (!t || (t.hidden_at && !req.fm.mod)) return null;
  return t;
}
// Ekip konusu: resmî hesabın ya da yöneticinin açtığı konu. Her zaman sabit ve yoruma kapalıdır; ilk mesajın beğenisi "∞" görünür, beğenmeme kapalıdır.
async function isCrown(uid) {
  if (!uid) return false;
  const r = (await pool.query(`SELECT u.role = 'admin' OR coalesce(f.is_official, false) AS s FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id WHERE u.id = $1`, [uid])).rows[0];
  return !!(r && r.s);
}
function canPostIn(req, t, c) {
  if (req.fm.mod) return { ok: true };
  if (c.is_locked) return { ok: false, why: "Bu kategori yeni mesajlara kapalı." };
  if (t && t.is_locked) return { ok: false, why: t.official_key || t.crown ? "Bu ekip konusu yorumlara kapalıdır." : "Bu konu kilitlendi; yeni yanıt yazılamaz." };
  return { ok: true };
}
/** Bekleyen görselleri mesaja bağlar (yalnız sahibinin, forum türündeki ve henüz bağlanmamış görselleri). */
async function attachImages(client, userId, postId, ids) {
  if (!ids || !ids.length) return 0;
  const { rows } = await client.query(
    `UPDATE attachments SET forum_post_id = $3 WHERE user_id = $1 AND scope = 'forum' AND forum_post_id IS NULL
        AND id = ANY(SELECT jsonb_array_elements_text($2::jsonb)::uuid) RETURNING id`, [userId, JSON.stringify(ids), postId]);
  return rows.length;
}
function imagesIn(v) {
  if (v === undefined || v === null) return { ids: [] };
  if (!Array.isArray(v) || v.length > IMAGES_PER_POST || v.some((x) => typeof x !== "string" || !ID.test(x))) return { err: `Bir mesaja en fazla ${IMAGES_PER_POST} görsel eklenebilir.` };
  return { ids: [...new Set(v.map((x) => x.toLowerCase()))] };
}

// ------------------------------------------------------------------ kurallar / ana sayfa
boardRouter.get("/board/rules", requireAuth, (req, res) => res.json({ rules: RULES, icons: RULE_ICONS, reasons: REPORT_REASONS }));

boardRouter.get("/board/home", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const me = req.fm.id, since = req.fm.since;
  const cats = await pool.query(
    `SELECT c.*, coalesce(s.topics, 0)::int AS topic_count, coalesce(s.posts, 0)::int AS post_count, coalesce(s.unread, 0)::int AS unread,
            lt.id AS last_id, lt.title AS last_title, lt.last_post_at AS last_at, lu.username AS last_user
       FROM forum_categories c
       LEFT JOIN LATERAL (SELECT count(*) AS topics, sum(t.reply_count + 1) AS posts,
                                 count(*) FILTER (WHERE t.last_post_at > greatest($2::timestamptz, coalesce(r.last_read_at, '-infinity'))) AS unread
                            FROM forum_topics t LEFT JOIN forum_reads r ON r.topic_id = t.id AND r.user_id = $1
                           WHERE t.category_id = c.id AND t.hidden_at IS NULL) s ON true
       LEFT JOIN LATERAL (SELECT t.id, t.title, t.last_post_at, t.last_poster_id FROM forum_topics t WHERE t.category_id = c.id AND t.hidden_at IS NULL ORDER BY t.last_post_at DESC LIMIT 1) lt ON true
       LEFT JOIN users lu ON lu.id = lt.last_poster_id
      ORDER BY c.sort, c.id`, [me, since]);
  const stats = await pool.query(
    `SELECT (SELECT count(*) FROM forum_topics WHERE hidden_at IS NULL)::int AS topics,
            (SELECT count(*) FROM forum_posts p JOIN forum_topics t ON t.id = p.topic_id WHERE p.hidden_at IS NULL AND t.hidden_at IS NULL)::int AS posts,
            (SELECT count(*) FROM forum_profiles WHERE rules_accepted_at IS NOT NULL)::int AS members,
            (SELECT count(*) FROM forum_profiles WHERE last_seen_at > now() - interval '15 minutes' AND NOT hide_online)::int AS online,
            (SELECT u.username FROM forum_profiles f JOIN users u ON u.id = f.user_id WHERE f.rules_accepted_at IS NOT NULL ORDER BY f.rules_accepted_at DESC LIMIT 1) AS newest`);
  const reports = req.fm.mod ? (await pool.query(`SELECT count(DISTINCT post_id)::int AS n FROM forum_reports WHERE status = 'open'`)).rows[0].n : 0;
  // alt kategoriler üst kategorinin içinde döner; üstün sayaçları ve son konusu alt kategorileri de kapsar
  const all = cats.rows.map((c) => ({ ...catOut(c), topics: c.topic_count, posts: c.post_count, unread: c.unread,
    last: c.last_id ? { id: c.last_id, title: c.last_title, at: c.last_at, user: c.last_user } : null }));
  const top = all.filter((c) => !c.parentId);
  for (const c of top) {
    c.children = all.filter((k) => k.parentId === c.id);
    for (const k of c.children) {
      c.topics += k.topics; c.posts += k.posts; c.unread += k.unread;
      if (k.last && (!c.last || new Date(k.last.at) > new Date(c.last.at))) c.last = k.last;
    }
  }
  const tags = (await pool.query(`SELECT g.slug, g.name, g.icon, count(tt.topic_id)::int AS n FROM forum_tags g LEFT JOIN forum_topic_tags tt ON tt.tag_id = g.id
      LEFT JOIN forum_topics t ON t.id = tt.topic_id AND t.hidden_at IS NULL GROUP BY g.id ORDER BY g.name`)).rows;
  res.json({
    categories: top, tags, stats: stats.rows[0],
    me: { username: req.fm.username, level: publicLevel(req.fm.level), mod: req.fm.mod, admin: req.fm.admin, banned: req.fm.banned, banUntil: req.fm.banUntil, banReason: req.fm.banReason, openReports: reports, hideOnline: req.fm.hideOnline },
  });
});

// ------------------------------------------------------------------ konu listesi
const SORTS = { activity: "t.is_pinned DESC, t.last_post_at DESC", new: "t.created_at DESC", replies: "t.reply_count DESC, t.last_post_at DESC", likes: "fp.like_count DESC, t.last_post_at DESC", views: "t.view_count DESC, t.last_post_at DESC" };
boardRouter.get("/board/topics", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const me = req.fm.id, page = int(req.query.page, 1, 1, 1000), sort = SORTS[req.query.sort] ? req.query.sort : "activity";
  const where = ["(t.hidden_at IS NULL OR $3::boolean)"], vals = [me, req.fm.since, req.fm.mod && req.query.hidden === "1"];
  let cat = null;
  let fam = null, tag = null;
  if (req.query.c) {
    cat = await category(String(req.query.c)); if (!cat) return res.status(404).json({ error: "Kategori bulunamadı." });
    fam = await familyOf(cat); vals.push(fam.ids); where.push(`t.category_id = ANY($${vals.length}::int[])`);
  }
  if (req.query.tag) {
    tag = (await pool.query(`SELECT slug, name, icon FROM forum_tags WHERE slug = $1`, [String(req.query.tag)])).rows[0];
    if (!tag) return res.status(404).json({ error: "Etiket bulunamadı." });
    vals.push(tag.slug); where.push(`EXISTS (SELECT 1 FROM forum_topic_tags tt JOIN forum_tags g ON g.id = tt.tag_id WHERE tt.topic_id = t.id AND g.slug = $${vals.length})`);
  }
  const f = String(req.query.filter || "");
  if (f === "unanswered") where.push("t.reply_count = 0 AND NOT t.is_locked");   // yoruma kapalı konular yanıt beklemez
  if (f === "questions") where.push("t.kind = 'question'");
  if (f === "solved") where.push("t.accepted_post_id IS NOT NULL");
  if (f === "unsolved") where.push("t.kind = 'question' AND t.accepted_post_id IS NULL");
  if (f === "unread") where.push("t.last_post_at > greatest($2::timestamptz, coalesce(r.last_read_at, '-infinity'))");
  if (f === "mine") where.push("t.author_id = $1");
  if (f === "watching") where.push("EXISTS (SELECT 1 FROM forum_watches w WHERE w.topic_id = t.id AND w.user_id = $1)");
  if (f === "participated") where.push("EXISTS (SELECT 1 FROM forum_posts p WHERE p.topic_id = t.id AND p.author_id = $1 AND p.hidden_at IS NULL)");
  const order = !cat && sort === "activity" ? "t.last_post_at DESC" : SORTS[sort];
  const base = `FROM forum_topics t JOIN forum_categories c ON c.id = t.category_id
      JOIN forum_posts fp ON fp.topic_id = t.id AND fp.is_first
      LEFT JOIN forum_reads r ON r.topic_id = t.id AND r.user_id = $1
     WHERE ${where.join(" AND ")}`;
  // $2 yalnız "okunmamış" süzgecinde kullanılır; türü her durumda belli olsun diye sorguda da anılır (PostgreSQL 42P18)
  const total = (await pool.query(`SELECT count(*)::int AS n, $2::timestamptz AS since ${base}`, vals)).rows[0].n;
  const pages = Math.max(1, Math.ceil(total / PAGE_TOPICS));
  const { rows } = await pool.query(
    `SELECT t.id, t.title, t.icon, t.kind, t.is_pinned, t.is_locked, t.hidden_at, t.accepted_post_id, t.reply_count, t.view_count, t.last_post_at, t.created_at,
            c.slug AS cat_slug, c.name AS cat_name, c.icon AS cat_icon, c.color AS cat_color, fp.like_count, left(${plainSql("fp.body")}, 180) AS excerpt,
            (t.last_post_at > greatest($2::timestamptz, coalesce(r.last_read_at, '-infinity'))) AS unread, r.last_read_at IS NOT NULL AS seen,
            EXISTS (SELECT 1 FROM forum_polls pl WHERE pl.topic_id = t.id) AS has_poll,
            EXISTS (SELECT 1 FROM attachments a WHERE a.forum_post_id = fp.id) AS has_images,
            au.username AS author, au.role AS author_role, (SELECT id FROM attachments WHERE user_id = au.id AND scope = 'avatar') AS author_avatar,
            af.level_override, af.forum_role, af.topics, af.posts, af.likes, af.dislikes, af.reports_upheld, af.is_official,
            lu.username AS last_user
       ${base.replace("LEFT JOIN forum_reads", "LEFT JOIN users au ON au.id = t.author_id LEFT JOIN forum_profiles af ON af.user_id = au.id LEFT JOIN users lu ON lu.id = t.last_poster_id LEFT JOIN forum_reads")}
      ORDER BY ${order} LIMIT ${PAGE_TOPICS} OFFSET ${(page - 1) * PAGE_TOPICS}`, vals);
  const TG = await tagsOf(rows.map((t) => t.id));
  res.json({
    category: cat ? { ...catOut(cat), children: fam.kids.map(catOut), parent: fam.parent ? catOut(fam.parent) : null } : null, tag: tag || null, page, pages, total,
    canTopic: !req.fm.banned && (!cat || req.fm.mod || (!cat.is_locked && cat.kind !== "announce" && req.fm.level.n >= cat.min_level_topic)),
    topics: rows.map((t) => ({ tags: TG[t.id] || [], official: !!t.is_official, icon: t.icon || null,
      id: t.id, title: t.title, kind: t.kind, pinned: t.is_pinned, locked: t.is_locked, hidden: !!t.hidden_at, solved: !!t.accepted_post_id,
      replies: t.reply_count, views: t.view_count, likes: t.like_count, infinite: !!(t.is_official || t.author_role === "admin"), lastAt: t.last_post_at, createdAt: t.created_at, unread: !!t.unread, seen: !!t.seen,
      hasPoll: t.has_poll, hasImages: t.has_images, excerpt: t.excerpt,
      category: { slug: t.cat_slug, name: t.cat_name, icon: t.cat_icon, color: t.cat_color || "slate" },
      author: t.author ? { username: t.author, avatarId: t.author_avatar, level: publicLevel(forumLevel(t, t.author_role)) } : null, lastUser: t.last_user,
    })),
  });
});

// ------------------------------------------------------------------ konu aç
boardRouter.post("/board/topics", member, async (req, res) => {
  if (!canWrite(req, res)) return;
  const b = req.body || {};
  const cat = await category(String(b.category || ""));
  if (!cat) return res.status(400).json({ error: "Kategori seçin.", field: "category" });
  if (!req.fm.mod) {
    if (cat.kind === "announce") return res.status(403).json({ error: "Bu kategoride yalnız yönetim konu açabilir." });
    if (cat.is_locked) return res.status(403).json({ error: "Bu kategori yeni konulara kapalı." });
    if (req.fm.level.n < cat.min_level_topic) return res.status(403).json({ error: `Bu kategoride konu açmak için ${LEVELS[cat.min_level_topic - 1].name} seviyesi gerekir.` });
  }
  // Konu türü seçilmez: Soru – Cevap kategorisinde açılan konu sorudur (en iyi yanıt seçilebilir); diğerleri tartışmadır.
  const title = clean(b.title).replace(/\s+/g, " ").slice(0, 200), body = clean(b.body), kind = cat.slug === "soru-cevap" || (req.fm.mod && b.kind === "question") ? "question" : "discussion";
  const tg = await tagsIn(b.tags); if (tg.err) return res.status(400).json({ error: tg.err, field: "tags" });
  const e = contentError({ title, body, level: req.fm.level.n, mod: req.fm.mod });
  if (e) return res.status(400).json({ error: e, field: /Başlık/.test(e) ? "title" : "body" });
  const poll = pollIn(b.poll); if (poll.err) return res.status(400).json({ error: poll.err, field: "poll" });
  const imgs = imagesIn(b.images); if (imgs.err) return res.status(400).json({ error: imgs.err });
  if (await limited(req, res, "topic", "Kısa sürede çok fazla konu açtınız. Lütfen biraz sonra tekrar deneyin.")) return;
  const dup = await pool.query(`SELECT id FROM forum_topics WHERE author_id = $1 AND lower(title) = lower($2) AND created_at > now() - interval '1 day' AND hidden_at IS NULL`, [req.fm.id, title]);
  if (dup.rows.length) return res.status(409).json({ error: "Aynı başlıkla kısa süre önce bir konu açtınız.", topicId: dup.rows[0].id });
  const out = await tx(async (c) => {
    const t = (await c.query(`INSERT INTO forum_topics (category_id, author_id, title, kind, last_poster_id, created_at, last_post_at, is_pinned, is_locked) VALUES ($1, $2, $3, $4, $2, clock_timestamp(), clock_timestamp(), $5, $5) RETURNING id, created_at`, [cat.id, req.fm.id, title, kind, !!req.fm.admin])).rows[0];
    const p = (await c.query(`INSERT INTO forum_posts (topic_id, author_id, body, is_first, created_at) VALUES ($1, $2, $3, true, $4) RETURNING id`, [t.id, req.fm.id, body, t.created_at])).rows[0];
    await c.query(`UPDATE forum_topics SET last_post_id = $2, last_post_at = $3 WHERE id = $1`, [t.id, p.id, t.created_at]);
    if (poll.v) await c.query(`INSERT INTO forum_polls (topic_id, question, options, multi, closes_at) VALUES ($1, $2, $3, $4, CASE WHEN $5::int > 0 THEN now() + make_interval(days => $5::int) END)`,
      [t.id, poll.v.question, JSON.stringify(poll.v.options), poll.v.multi, poll.v.days]);
    await attachImages(c, req.fm.id, p.id, imgs.ids);
    if (tg.ids.length) await c.query(`INSERT INTO forum_topic_tags (topic_id, tag_id) SELECT $1, x::int FROM jsonb_array_elements_text($2::jsonb) x ON CONFLICT DO NOTHING`, [t.id, JSON.stringify(tg.ids)]);
    await c.query(`INSERT INTO forum_watches (topic_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [t.id, req.fm.id]);
    await c.query(`INSERT INTO forum_reads (topic_id, user_id, last_read_at) VALUES ($1, $2, $3) ON CONFLICT (topic_id, user_id) DO UPDATE SET last_read_at = EXCLUDED.last_read_at`, [t.id, req.fm.id, t.created_at]);
    await bump(c, req.fm.id, { topics: 1 });
    return { id: t.id, postId: p.id };
  });
  await syncLevel(req.fm.id);
  await notifyMentions(req, body, out.id, out.postId, title);
  await logAudit(req.fm.id, "forum_topic_create", "forum_topic", out.id, { category: cat.slug }, ip(req));
  res.status(201).json(out);
});

// ------------------------------------------------------------------ konu görüntüle
async function postsOut(req, rows, crown = false) {
  const ids = rows.map((p) => p.id);
  const imgs = ids.length ? (await pool.query(`SELECT id, forum_post_id FROM attachments WHERE forum_post_id = ANY(SELECT jsonb_array_elements_text($1::jsonb)::uuid) ORDER BY created_at`, [JSON.stringify(ids)])).rows : [];
  const mine = ids.length ? (await pool.query(`SELECT post_id, value FROM forum_reactions WHERE user_id = $1 AND post_id = ANY(SELECT jsonb_array_elements_text($2::jsonb)::uuid)`, [req.fm.id, JSON.stringify(ids)])).rows : [];
  const marks = ids.length ? (await pool.query(`SELECT post_id FROM forum_bookmarks WHERE user_id = $1 AND post_id = ANY(SELECT jsonb_array_elements_text($2::jsonb)::uuid)`, [req.fm.id, JSON.stringify(ids)])).rows : [];
  const R = Object.fromEntries(mine.map((m) => [m.post_id, m.value])), B = new Set(marks.map((m) => m.post_id));
  return rows.map((p) => {
    const hidden = !!p.hidden_at, show = !hidden || req.fm.mod, own = p.author_id === req.fm.id;
    return {
      id: p.id, first: p.is_first, createdAt: p.created_at, editedAt: p.edited_at, editedByMod: !!(p.edited_by && p.edited_by !== p.author_id),
      hidden, hiddenBy: hidden ? (p.deleted_by_author ? "author" : "mod") : null, hiddenReason: hidden && req.fm.mod ? p.hidden_reason : null,
      body: show ? p.body : "", images: show ? imgs.filter((i) => i.forum_post_id === p.id).map((i) => i.id) : [],
      likes: p.like_count, dislikes: p.dislike_count, myReaction: R[p.id] || 0, infinite: !!(crown && p.is_first), bookmarked: B.has(p.id), own,
      canEdit: !hidden && (req.fm.mod || (own && !req.fm.banned && Date.now() - new Date(p.created_at).getTime() < 24 * 3600e3)),
      author: authorOut(p.username ? p : null),
    };
  });
}
async function pollOut(req, topicId) {
  const { rows } = await pool.query(`SELECT * FROM forum_polls WHERE topic_id = $1`, [topicId]);
  const p = rows[0]; if (!p) return null;
  const mine = (await pool.query(`SELECT choices FROM forum_poll_votes WHERE topic_id = $1 AND user_id = $2`, [topicId, req.fm.id])).rows[0];
  const closed = !!(p.closes_at && new Date(p.closes_at) <= new Date());
  const showResults = !!mine || closed || req.fm.mod;
  let counts = null, voters = 0;
  if (showResults) {
    const v = (await pool.query(`SELECT c::int AS i, count(*)::int AS n FROM forum_poll_votes, unnest(choices) c WHERE topic_id = $1 GROUP BY c`, [topicId])).rows;
    voters = (await pool.query(`SELECT count(*)::int AS n FROM forum_poll_votes WHERE topic_id = $1`, [topicId])).rows[0].n;
    counts = p.options.map((_, i) => (v.find((x) => x.i === i) || { n: 0 }).n);
  }
  return { question: p.question, options: p.options, multi: p.multi, closesAt: p.closes_at, closed, mine: mine ? mine.choices.map(Number) : null, counts, voters };
}
boardRouter.get("/board/t/:id", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const t = await topicRow(req.params.id, req); if (!t) return res.status(404).json({ error: "Konu bulunamadı." });
  const cat = await category(t.category_id);
  const vis = "true";   // gizlenen mesajın yeri korunur; içeriği yalnız moderatöre gönderilir (postsOut)
  const total = (await pool.query(`SELECT count(*)::int AS n FROM forum_posts p WHERE p.topic_id = $1 AND ${vis}`, [t.id])).rows[0].n;
  const pages = Math.max(1, Math.ceil(total / PAGE_POSTS));
  const read = (await pool.query(`SELECT last_read_at FROM forum_reads WHERE topic_id = $1 AND user_id = $2`, [t.id, req.fm.id])).rows[0];
  const lastRead = read ? read.last_read_at : null;
  let page;
  if (req.query.post && ID.test(String(req.query.post))) {
    const pos = (await pool.query(`SELECT count(*)::int AS n FROM forum_posts p WHERE p.topic_id = $1 AND p.created_at < (SELECT created_at FROM forum_posts WHERE id = $2 AND topic_id = $1)`, [t.id, req.query.post])).rows[0].n;
    page = Math.floor(pos / PAGE_POSTS) + 1;
  } else if (req.query.page === "last") page = pages;
  else if (req.query.page === "unread") {
    const pos = lastRead ? (await pool.query(`SELECT count(*)::int AS n FROM forum_posts p WHERE p.topic_id = $1 AND p.created_at <= $2`, [t.id, lastRead])).rows[0].n : 0;
    page = Math.min(pages, Math.floor(pos / PAGE_POSTS) + 1);
  } else page = int(req.query.page, 1, 1, pages);
  const { rows } = await pool.query(
    `SELECT p.*, ${AUTHOR} FROM forum_posts p LEFT JOIN users u ON u.id = p.author_id LEFT JOIN forum_profiles f ON f.user_id = u.id
      WHERE p.topic_id = $1 AND ${vis} ORDER BY p.created_at, p.id LIMIT ${PAGE_POSTS} OFFSET ${(page - 1) * PAGE_POSTS}`, [t.id]);
  const firstUnread = lastRead ? (rows.find((p) => new Date(p.created_at) > new Date(lastRead)) || {}).id || null : null;
  // okundu izi: görüntülenen sayfanın son mesajına kadar; görüntülenme sayısı kişi başına yarım saatte bir artar
  if (rows.length) {
    const upto = rows[rows.length - 1].created_at;
    const r = await pool.query(`INSERT INTO forum_reads (topic_id, user_id, last_read_at) VALUES ($1, $2, $3)
        ON CONFLICT (topic_id, user_id) DO UPDATE SET last_read_at = greatest(forum_reads.last_read_at, EXCLUDED.last_read_at)
        RETURNING (xmax = 0) AS fresh`, [t.id, req.fm.id, upto]);
    if ((r.rows[0] && r.rows[0].fresh) || !lastRead || Date.now() - new Date(lastRead).getTime() > 30 * 60000) await pool.query(`UPDATE forum_topics SET view_count = view_count + 1 WHERE id = $1`, [t.id]);
  }
  const watching = (await pool.query(`SELECT 1 FROM forum_watches WHERE topic_id = $1 AND user_id = $2`, [t.id, req.fm.id])).rows.length > 0;
  t.crown = await isCrown(t.author_id);
  const can = canPostIn(req, t, cat);
  const parent = cat.parent_id ? await category(cat.parent_id) : null;
  const TG = await tagsOf([t.id]);
  res.json({ tags: TG[t.id] || [], parent: parent ? catOut(parent) : null,
    topic: { id: t.id, title: t.title, icon: t.icon || null, kind: t.kind, pinned: t.is_pinned, locked: t.is_locked, hidden: !!t.hidden_at, hiddenReason: req.fm.mod ? t.hidden_reason : null,
      acceptedPostId: t.accepted_post_id, replies: t.reply_count, views: t.view_count, createdAt: t.created_at, lastAt: t.last_post_at, own: t.author_id === req.fm.id, crown: t.crown },
    category: catOut(cat), poll: await pollOut(req, t.id), page, pages, total, firstUnread, watching,
    canReply: !req.fm.banned && can.ok, replyBlocked: req.fm.banned ? "Forumdan uzaklaştırıldınız; yanıt yazamazsınız." : can.why || null,
    canAccept: t.kind === "question" && (t.author_id === req.fm.id || req.fm.mod),
    posts: await postsOut(req, rows, t.crown), me: { username: req.fm.username, mod: req.fm.mod, admin: req.fm.admin },
  });
});
// Konu açıkken yeni yanıt var mı? (sayfa yenilenmeden "N yeni yanıt" uyarısı)
boardRouter.get("/board/t/:id/since", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const t = await topicRow(req.params.id, req); if (!t) return res.status(404).json({ error: "Konu bulunamadı." });
  const after = Date.parse(String(req.query.after || "")); if (!Number.isFinite(after)) return res.json({ count: 0 });
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM forum_posts WHERE topic_id = $1 AND created_at > $2 AND hidden_at IS NULL AND author_id IS DISTINCT FROM $3`, [t.id, new Date(after), req.fm.id]);
  res.json({ count: rows[0].n, lastAt: t.last_post_at });
});

// ------------------------------------------------------------------ yanıt yaz
async function notifyMentions(req, body, topicId, postId, title, skip = new Set()) {
  const names = mentions(body).filter((n) => n !== req.fm.username);
  if (!names.length) return skip;
  const { rows } = await pool.query(`SELECT u.id FROM users u JOIN forum_profiles f ON f.user_id = u.id WHERE f.rules_accepted_at IS NOT NULL AND u.username = ANY(SELECT jsonb_array_elements_text($1::jsonb))`, [JSON.stringify(names)]);
  const P = await prefsOf(rows.map((r) => r.id));
  for (const r of rows) if (!skip.has(r.id) && r.id !== req.fm.id && P[r.id] && P[r.id].mention) { skip.add(r.id); await note(r.id, `@${req.fm.username} sizden bahsetti: “${short(title)}”`, { topicId, postId, kind: "mention" }); }
  return skip;
}
boardRouter.post("/board/t/:id/posts", member, async (req, res) => {
  if (!canWrite(req, res)) return;
  const t = await topicRow(req.params.id, req); if (!t || t.hidden_at) return res.status(404).json({ error: "Konu bulunamadı." });
  const cat = await category(t.category_id), can = canPostIn(req, t, cat);
  if (!can.ok) return res.status(403).json({ error: can.why });
  const body = clean((req.body || {}).body);
  const e = contentError({ body, level: req.fm.level.n, mod: req.fm.mod }); if (e) return res.status(400).json({ error: e, field: "body" });
  const imgs = imagesIn((req.body || {}).images); if (imgs.err) return res.status(400).json({ error: imgs.err });
  if (await limited(req, res, "post", "Kısa sürede çok fazla mesaj gönderdiniz. Lütfen biraz bekleyin.")) return;
  const dup = await pool.query(`SELECT 1 FROM forum_posts WHERE topic_id = $1 AND author_id = $2 AND body = $3 AND created_at > now() - interval '10 minutes'`, [t.id, req.fm.id, body]);
  if (dup.rows.length) return res.status(409).json({ error: "Bu mesajı az önce gönderdiniz." });
  const out = await tx(async (c) => {
    const p = (await c.query(`INSERT INTO forum_posts (topic_id, author_id, body, created_at) VALUES ($1, $2, $3, clock_timestamp()) RETURNING id, created_at`, [t.id, req.fm.id, body])).rows[0];
    await c.query(`UPDATE forum_topics SET reply_count = reply_count + 1, last_post_at = $2, last_post_id = $3, last_poster_id = $4, updated_at = now() WHERE id = $1`, [t.id, p.created_at, p.id, req.fm.id]);
    await attachImages(c, req.fm.id, p.id, imgs.ids);
    await c.query(`INSERT INTO forum_reads (topic_id, user_id, last_read_at) VALUES ($1, $2, $3) ON CONFLICT (topic_id, user_id) DO UPDATE SET last_read_at = greatest(forum_reads.last_read_at, EXCLUDED.last_read_at)`, [t.id, req.fm.id, p.created_at]);
    if (req.fm.notify.participated_reply) await c.query(`INSERT INTO forum_watches (topic_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [t.id, req.fm.id]);
    await bump(c, req.fm.id, { posts: 1 });
    const pos = (await c.query(`SELECT count(*)::int AS n FROM forum_posts WHERE topic_id = $1`, [t.id])).rows[0].n;
    return { id: p.id, page: Math.max(1, Math.ceil(pos / PAGE_POSTS)) };
  });
  await syncLevel(req.fm.id);
  // bildirimler: kişi başına tek bildirim (öncelik: alıntı > anma > konu sahibi > takip / katılım)
  const sent = new Set([req.fm.id]);
  const qids = quotedPostIds(body);
  if (qids.length) {
    const q = await pool.query(`SELECT DISTINCT author_id FROM forum_posts WHERE topic_id = $1 AND id = ANY(SELECT jsonb_array_elements_text($2::jsonb)::uuid) AND author_id IS NOT NULL`, [t.id, JSON.stringify(qids)]);
    const P = await prefsOf(q.rows.map((r) => r.author_id));
    for (const r of q.rows) if (!sent.has(r.author_id) && P[r.author_id] && P[r.author_id].quoted) { sent.add(r.author_id); await note(r.author_id, `@${req.fm.username} mesajınızı alıntıladı: “${short(t.title)}”`, { topicId: t.id, postId: out.id, kind: "quote" }); }
  }
  await notifyMentions(req, body, t.id, out.id, t.title, sent);
  const w = await pool.query(`SELECT user_id FROM forum_watches WHERE topic_id = $1 LIMIT 500`, [t.id]);
  const ids = [...new Set([t.author_id, ...w.rows.map((r) => r.user_id)].filter(Boolean))].filter((x) => !sent.has(x));
  const P = await prefsOf(ids);
  for (const uid of ids) {
    const pr = P[uid]; if (!pr) continue;
    const own = uid === t.author_id;
    if (own ? pr.own_topic_reply : (pr.favorite_topic || pr.participated_reply)) {
      // aynı konu için okunmamış bildirim varsa yenisi eklenmez, sayısı güncellenir (bildirim seli olmaz)
      const ex = await pool.query(`UPDATE notifications SET data = jsonb_set(data, '{count}', to_jsonb(coalesce((data->>'count')::int, 1) + 1)), text = $3, created_at = now()
          WHERE user_id = $1 AND type = 'forum' AND read_at IS NULL AND data->>'topicId' = $2 AND data->>'kind' = 'reply' RETURNING id`,
        [uid, t.id, `“${short(t.title)}” konusunda yeni yanıtlar var`]);
      if (!ex.rows.length) await note(uid, own ? `@${req.fm.username} konunuza yanıt yazdı: “${short(t.title)}”` : `@${req.fm.username} takip ettiğiniz konuya yazdı: “${short(t.title)}”`, { topicId: t.id, postId: out.id, kind: "reply", count: 1 });
    }
  }
  res.status(201).json(out);
});

// ------------------------------------------------------------------ düzenle / sil
async function postRow(id) {
  if (!ID.test(id)) return null;
  const { rows } = await pool.query(`SELECT p.*, t.title, t.is_locked, t.hidden_at AS topic_hidden, t.author_id AS topic_author, t.category_id, t.reply_count, t.accepted_post_id
     FROM forum_posts p JOIN forum_topics t ON t.id = p.topic_id WHERE p.id = $1`, [id]);
  return rows[0] || null;
}
boardRouter.patch("/board/posts/:id", member, async (req, res) => {
  if (!canWrite(req, res)) return;
  const p = await postRow(req.params.id); if (!p || ((p.hidden_at || p.topic_hidden) && !req.fm.mod)) return res.status(404).json({ error: "Mesaj bulunamadı." });
  const own = p.author_id === req.fm.id;
  if (!req.fm.mod) {
    if (!own) return res.status(403).json({ error: "Yalnız kendi mesajınızı düzenleyebilirsiniz." });
    if (p.hidden_at) return res.status(403).json({ error: "Kaldırılan mesaj düzenlenemez." });
    if (p.is_locked) return res.status(403).json({ error: "Kilitli konudaki mesaj düzenlenemez." });
    if (Date.now() - new Date(p.created_at).getTime() > 24 * 3600e3) return res.status(403).json({ error: "Mesajlar yazıldıktan sonraki 24 saat içinde düzenlenebilir." });
  }
  const b = req.body || {}, body = clean(b.body), title = p.is_first && b.title !== undefined ? clean(b.title).replace(/\s+/g, " ").slice(0, 200) : undefined;
  const e = contentError({ title, body, level: req.fm.level.n, mod: req.fm.mod }); if (e) return res.status(400).json({ error: e, field: /Başlık/.test(e) ? "title" : "body" });
  const imgs = b.images !== undefined ? imagesIn(b.images) : null; if (imgs && imgs.err) return res.status(400).json({ error: imgs.err });
  const reason = clean(b.reason).slice(0, 200);
  const tg = p.is_first && b.tags !== undefined ? await tagsIn(b.tags) : null; if (tg && tg.err) return res.status(400).json({ error: tg.err, field: "tags" });
  if (tg) {
    await pool.query(`DELETE FROM forum_topic_tags WHERE topic_id = $1`, [p.topic_id]);
    if (tg.ids.length) await pool.query(`INSERT INTO forum_topic_tags (topic_id, tag_id) SELECT $1, x::int FROM jsonb_array_elements_text($2::jsonb) x ON CONFLICT DO NOTHING`, [p.topic_id, JSON.stringify(tg.ids)]);
  }
  if (body === p.body && (title === undefined || title === p.title) && !imgs) return res.json({ ok: true, unchanged: !tg });
  await tx(async (c) => {
    await c.query(`INSERT INTO forum_post_edits (post_id, editor_id, old_body, old_title, reason) VALUES ($1, $2, $3, $4, $5)`, [p.id, req.fm.id, p.body, title !== undefined && title !== p.title ? p.title : null, reason || null]);
    await c.query(`UPDATE forum_posts SET body = $2, edited_at = now(), edited_by = $3 WHERE id = $1`, [p.id, body, req.fm.id]);
    if (title !== undefined && title !== p.title) await c.query(`UPDATE forum_topics SET title = $2, updated_at = now() WHERE id = $1`, [p.topic_id, title]);
    if (imgs) {
      // yalnız bu mesaja ait görseller kaldırılabilir; yeni görseller yazarın bekleyenlerinden eklenir (toplam en fazla 4)
      await c.query(`DELETE FROM attachments WHERE forum_post_id = $1 AND id <> ALL(SELECT jsonb_array_elements_text($2::jsonb)::uuid)`, [p.id, JSON.stringify(imgs.ids)]);
      const have = (await c.query(`SELECT count(*)::int AS n FROM attachments WHERE forum_post_id = $1`, [p.id])).rows[0].n;
      const fresh = imgs.ids.slice(0, Math.max(0, IMAGES_PER_POST - have));
      await attachImages(c, p.author_id || req.fm.id, p.id, fresh);
    }
  });
  if (!own) {
    await logAudit(req.fm.id, "forum_post_edit_mod", "forum_post", p.id, { topic: p.topic_id, reason: reason || null }, ip(req));
    if (p.author_id) await note(p.author_id, `Bir moderatör mesajınızı düzenledi: “${short(p.title)}”`, { topicId: p.topic_id, postId: p.id, kind: "moderation", reason: reason || null });
  }
  res.json({ ok: true });
});
boardRouter.get("/board/posts/:id/history", member, async (req, res) => {
  const p = await postRow(req.params.id); if (!p || (!req.fm.mod && (p.hidden_at || p.topic_hidden))) return res.status(404).json({ error: "Mesaj bulunamadı." });
  if (!req.fm.mod && p.author_id !== req.fm.id) return res.status(404).json({ error: "Mesaj bulunamadı." });
  const { rows } = await pool.query(`SELECT e.old_body, e.old_title, e.reason, e.created_at, u.username FROM forum_post_edits e LEFT JOIN users u ON u.id = e.editor_id WHERE e.post_id = $1 ORDER BY e.created_at DESC LIMIT 50`, [p.id]);
  res.json(rows.map((r) => ({ body: r.old_body, title: r.old_title, reason: req.fm.mod ? r.reason : null, at: r.created_at, editor: r.username })));
});

/** Mesajı gizler/geri getirir ve sayaçları buna göre düzeltir. who: "author" | "mod" */
async function setHidden(c, p, hide, who, actorId, reason) {
  if (!!p.hidden_at === hide) return false;
  await c.query(`UPDATE forum_posts SET hidden_at = ${hide ? "now()" : "NULL"}, hidden_by = $2, hidden_reason = $3, deleted_by_author = $4 WHERE id = $1`,
    [p.id, hide ? actorId : null, hide ? reason || null : null, hide && who === "author"]);
  const s = hide ? -1 : 1;
  if (p.is_first) await c.query(`UPDATE forum_topics SET hidden_at = ${hide ? "now()" : "NULL"}, hidden_by = $2, hidden_reason = $3 WHERE id = $1`, [p.topic_id, hide ? actorId : null, hide ? reason || null : null]);
  else {
    await c.query(`UPDATE forum_topics SET reply_count = greatest(0, reply_count + $2) WHERE id = $1`, [p.topic_id, s]);
    if (hide && p.accepted_post_id === p.id) await c.query(`UPDATE forum_topics SET accepted_post_id = NULL WHERE id = $1`, [p.topic_id]);
    // son mesaj bilgisi (konu listesi) görünür son mesaja göre düzeltilir
    await c.query(`UPDATE forum_topics t SET last_post_at = coalesce(x.created_at, t.created_at), last_post_id = x.id, last_poster_id = x.author_id
        FROM (SELECT id, created_at, author_id FROM forum_posts WHERE topic_id = $1 AND hidden_at IS NULL ORDER BY created_at DESC LIMIT 1) x WHERE t.id = $1`, [p.topic_id]);
  }
  await bump(c, p.author_id, p.is_first ? { topics: s, likes: s * p.like_count, dislikes: s * p.dislike_count } : { posts: s, likes: s * p.like_count, dislikes: s * p.dislike_count });
  return true;
}
boardRouter.delete("/board/posts/:id", member, async (req, res) => {
  const p = await postRow(req.params.id); if (!p || p.hidden_at || p.topic_hidden) return res.status(404).json({ error: "Mesaj bulunamadı." });
  if (p.author_id !== req.fm.id) return res.status(403).json({ error: "Yalnız kendi mesajınızı silebilirsiniz." });
  if (p.is_first && p.reply_count > 0) return res.status(409).json({ error: "Yanıt almış bir konu silinemez. Konuyu düzenleyebilir ya da bir moderatörden kaldırılmasını isteyebilirsiniz." });
  await tx((c) => setHidden(c, p, true, "author", req.fm.id, null));
  await syncLevel(req.fm.id);
  res.json({ ok: true, topicDeleted: p.is_first });
});

// ------------------------------------------------------------------ tepki / kaydet / takip / en iyi yanıt / anket
boardRouter.post("/board/posts/:id/react", member, async (req, res) => {
  if (!canWrite(req, res)) return;
  const v = Number((req.body || {}).value);
  if (![1, -1, 0].includes(v)) return res.status(400).json({ error: "Geçersiz tepki." });
  const p = await postRow(req.params.id); if (!p || p.hidden_at || p.topic_hidden) return res.status(404).json({ error: "Mesaj bulunamadı." });
  if (p.author_id === req.fm.id) return res.status(400).json({ error: "Kendi mesajınıza tepki veremezsiniz." });
  if (v === -1 && p.is_first && await isCrown(p.topic_author)) return res.status(400).json({ error: "Ekip konularında beğenmeme kapalıdır." });
  if (await limited(req, res, "react")) return;
  const r = await tx(async (c) => {
    const old = (await c.query(`SELECT value FROM forum_reactions WHERE post_id = $1 AND user_id = $2 FOR UPDATE`, [p.id, req.fm.id])).rows[0];
    const was = old ? old.value : 0; if (was === v) return { changed: false, was };
    if (v === 0) await c.query(`DELETE FROM forum_reactions WHERE post_id = $1 AND user_id = $2`, [p.id, req.fm.id]);
    else await c.query(`INSERT INTO forum_reactions (post_id, user_id, value) VALUES ($1, $2, $3) ON CONFLICT (post_id, user_id) DO UPDATE SET value = $3, created_at = now()`, [p.id, req.fm.id, v]);
    const dl = (v === 1 ? 1 : 0) - (was === 1 ? 1 : 0), dd = (v === -1 ? 1 : 0) - (was === -1 ? 1 : 0);
    await c.query(`UPDATE forum_posts SET like_count = greatest(0, like_count + $2), dislike_count = greatest(0, dislike_count + $3) WHERE id = $1`, [p.id, dl, dd]);
    await bump(c, p.author_id, { likes: dl, dislikes: dd });
    return { changed: true, was };
  });
  if (r.changed && p.author_id) {
    await syncLevel(p.author_id);
    if (v !== 0 && r.was === 0) {
      const P = await prefsOf([p.author_id]);
      if (P[p.author_id] && (v === 1 ? P[p.author_id].liked : P[p.author_id].disliked)) {
        const kind = v === 1 ? "like" : "dislike";
        const ex = await pool.query(`UPDATE notifications SET data = jsonb_set(data, '{count}', to_jsonb(coalesce((data->>'count')::int, 1) + 1)), created_at = now(),
            text = $4 WHERE user_id = $1 AND type = 'forum' AND read_at IS NULL AND data->>'postId' = $2 AND data->>'kind' = $3 RETURNING id`,
          [p.author_id, p.id, kind, v === 1 ? `Mesajınız beğeniliyor: “${short(p.title)}”` : `Mesajınız beğenilmedi: “${short(p.title)}”`]);
        if (!ex.rows.length) await note(p.author_id, v === 1 ? `@${req.fm.username} mesajınızı beğendi: “${short(p.title)}”` : `Mesajınız beğenilmedi: “${short(p.title)}”`, { topicId: p.topic_id, postId: p.id, kind, count: 1 });
      }
    }
  }
  const cur = (await pool.query(`SELECT like_count, dislike_count FROM forum_posts WHERE id = $1`, [p.id])).rows[0];
  res.json({ likes: cur.like_count, dislikes: cur.dislike_count, myReaction: v });
});
boardRouter.post("/board/posts/:id/bookmark", member, async (req, res) => {
  const p = await postRow(req.params.id); if (!p || p.hidden_at || p.topic_hidden) return res.status(404).json({ error: "Mesaj bulunamadı." });
  if ((req.body || {}).on === false) await pool.query(`DELETE FROM forum_bookmarks WHERE post_id = $1 AND user_id = $2`, [p.id, req.fm.id]);
  else {
    const n = (await pool.query(`SELECT count(*)::int AS n FROM forum_bookmarks WHERE user_id = $1`, [req.fm.id])).rows[0].n;
    if (n >= 500) return res.status(400).json({ error: "En fazla 500 mesaj kaydedebilirsiniz." });
    await pool.query(`INSERT INTO forum_bookmarks (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [p.id, req.fm.id]);
  }
  res.json({ ok: true });
});
boardRouter.get("/board/me/bookmarks", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { rows } = await pool.query(
    `SELECT b.created_at AS saved_at, p.id, p.topic_id, left(${plainSql("p.body")}, 220) AS excerpt, p.created_at, t.title, u.username
       FROM forum_bookmarks b JOIN forum_posts p ON p.id = b.post_id JOIN forum_topics t ON t.id = p.topic_id LEFT JOIN users u ON u.id = p.author_id
      WHERE b.user_id = $1 AND p.hidden_at IS NULL AND t.hidden_at IS NULL ORDER BY b.created_at DESC LIMIT 200`, [req.fm.id]);
  res.json(rows.map((r) => ({ postId: r.id, topicId: r.topic_id, title: r.title, excerpt: r.excerpt, author: r.username, at: r.created_at, savedAt: r.saved_at })));
});
// Beğendiklerim: üyenin beğendiği (görünür) mesajlar
boardRouter.get("/board/me/likes", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const { rows } = await pool.query(
    `SELECT r.created_at AS liked_at, p.id, p.topic_id, left(${plainSql("p.body")}, 220) AS excerpt, p.created_at, t.title, u.username
       FROM forum_reactions r JOIN forum_posts p ON p.id = r.post_id JOIN forum_topics t ON t.id = p.topic_id LEFT JOIN users u ON u.id = p.author_id
      WHERE r.user_id = $1 AND r.value = 1 AND p.hidden_at IS NULL AND t.hidden_at IS NULL ORDER BY r.created_at DESC LIMIT 200`, [req.fm.id]);
  res.json(rows.map((r) => ({ postId: r.id, topicId: r.topic_id, title: r.title, excerpt: r.excerpt, author: r.username, at: r.created_at, likedAt: r.liked_at })));
});
// Üye listesi: yalnız kullanıcı adı, avatar ve seviye (kişisel bilgi yok); seviyeye göre sıralı. Ekip en üstte.
boardRouter.get("/board/members", member, async (req, res) => {
  res.setHeader("Cache-Control", "private, max-age=30");
  const q = String(req.query.q || "").toLowerCase().replace(/^@/, "").slice(0, 20);
  if (q && !/^[a-z0-9._]{1,20}$/.test(q)) return res.json({ members: [], total: 0, page: 1, pages: 1 });
  const { rows } = await pool.query(
    `SELECT u.username, u.role, f.level_override, f.forum_role, f.topics, f.posts, f.likes, f.dislikes, f.reports_upheld, f.is_official, f.hide_online, f.last_seen_at,
            (SELECT id FROM attachments WHERE user_id = u.id AND scope = 'avatar') AS avatar_id
       FROM forum_profiles f JOIN users u ON u.id = f.user_id
      WHERE f.rules_accepted_at IS NOT NULL AND NOT f.ban_permanent AND ($1 = '' OR u.username LIKE $1 || '%') LIMIT 5000`, [q.replace(/[%_\\]/g, (c) => "\\" + c)]);
  const list = rows.map((r) => { const l = forumLevel(r, r.role); return { username: r.username, avatarId: r.avatar_id, level: publicLevel(l), score: l.assigned ? 1e9 + l.n : forumScore(r),
    online: !r.hide_online && !!(r.last_seen_at && Date.now() - new Date(r.last_seen_at).getTime() < 15 * 60000) }; });
  list.sort((a, b) => b.level.n - a.level.n || b.score - a.score || a.username.localeCompare(b.username));
  const per = 60, pages = Math.max(1, Math.ceil(list.length / per)), page = int(req.query.page, 1, 1, pages);
  res.json({ total: list.length, page, pages, members: list.slice((page - 1) * per, page * per).map(({ score, ...m }) => m) });
});
boardRouter.post("/board/t/:id/watch", member, async (req, res) => {
  const t = await topicRow(req.params.id, req); if (!t) return res.status(404).json({ error: "Konu bulunamadı." });
  if ((req.body || {}).on === false) await pool.query(`DELETE FROM forum_watches WHERE topic_id = $1 AND user_id = $2`, [t.id, req.fm.id]);
  else await pool.query(`INSERT INTO forum_watches (topic_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [t.id, req.fm.id]);
  res.json({ watching: (req.body || {}).on !== false });
});
boardRouter.post("/board/t/:id/read-all", member, async (req, res) => {
  const t = await topicRow(req.params.id, req); if (!t) return res.status(404).json({ error: "Konu bulunamadı." });
  await pool.query(`INSERT INTO forum_reads (topic_id, user_id, last_read_at) VALUES ($1, $2, now()) ON CONFLICT (topic_id, user_id) DO UPDATE SET last_read_at = now()`, [t.id, req.fm.id]);
  res.json({ ok: true });
});
boardRouter.post("/board/read-all", member, async (req, res) => {
  const cat = req.body && req.body.category ? await category(String(req.body.category)) : null;
  await pool.query(`INSERT INTO forum_reads (topic_id, user_id, last_read_at) SELECT t.id, $1, now() FROM forum_topics t WHERE t.hidden_at IS NULL AND ($2::int IS NULL OR t.category_id = $2)
      ON CONFLICT (topic_id, user_id) DO UPDATE SET last_read_at = now()`, [req.fm.id, cat ? cat.id : null]);
  res.json({ ok: true });
});
boardRouter.post("/board/t/:id/accept", member, async (req, res) => {
  if (!canWrite(req, res)) return;
  const t = await topicRow(req.params.id, req); if (!t || t.hidden_at) return res.status(404).json({ error: "Konu bulunamadı." });
  if (t.kind !== "question") return res.status(400).json({ error: "En iyi yanıt yalnız soru konularında seçilir." });
  if (t.author_id !== req.fm.id && !req.fm.mod) return res.status(403).json({ error: "En iyi yanıtı konunun sahibi seçer." });
  const pid = (req.body || {}).postId;
  if (pid === null) { await pool.query(`UPDATE forum_topics SET accepted_post_id = NULL WHERE id = $1`, [t.id]); return res.json({ acceptedPostId: null }); }
  const p = await postRow(String(pid || ""));
  if (!p || p.topic_id !== t.id || p.is_first || p.hidden_at) return res.status(400).json({ error: "Geçerli bir yanıt seçin." });
  await pool.query(`UPDATE forum_topics SET accepted_post_id = $2 WHERE id = $1`, [t.id, p.id]);
  if (p.author_id && p.author_id !== req.fm.id && t.accepted_post_id !== p.id) await note(p.author_id, `Yanıtınız en iyi yanıt seçildi: “${short(t.title)}”`, { topicId: t.id, postId: p.id, kind: "accepted" });
  res.json({ acceptedPostId: p.id });
});
boardRouter.post("/board/t/:id/vote", member, async (req, res) => {
  if (!canWrite(req, res)) return;
  const t = await topicRow(req.params.id, req); if (!t || t.hidden_at) return res.status(404).json({ error: "Konu bulunamadı." });
  const poll = (await pool.query(`SELECT * FROM forum_polls WHERE topic_id = $1`, [t.id])).rows[0];
  if (!poll) return res.status(404).json({ error: "Anket bulunamadı." });
  if (poll.closes_at && new Date(poll.closes_at) <= new Date()) return res.status(400).json({ error: "Anket sona erdi." });
  const ch = (req.body || {}).choices;
  if (!Array.isArray(ch) || !ch.length || ch.some((i) => !Number.isInteger(i) || i < 0 || i >= poll.options.length) || new Set(ch).size !== ch.length || (!poll.multi && ch.length > 1))
    return res.status(400).json({ error: poll.multi ? "En az bir seçenek işaretleyin." : "Bir seçenek işaretleyin." });
  await pool.query(`INSERT INTO forum_poll_votes (topic_id, user_id, choices) VALUES ($1, $2, (SELECT array_agg(x::smallint) FROM jsonb_array_elements_text($3::jsonb) x))
      ON CONFLICT (topic_id, user_id) DO UPDATE SET choices = EXCLUDED.choices, created_at = now()`, [t.id, req.fm.id, JSON.stringify(ch)]);
  res.json(await pollOut(req, t.id));
});

// ------------------------------------------------------------------ şikâyet
boardRouter.post("/board/posts/:id/report", member, async (req, res) => {
  const p = await postRow(req.params.id); if (!p || p.hidden_at || p.topic_hidden) return res.status(404).json({ error: "Mesaj bulunamadı." });
  if (p.author_id === req.fm.id) return res.status(400).json({ error: "Kendi mesajınızı şikâyet edemezsiniz." });
  const reason = String((req.body || {}).reason || ""), noteText = clean((req.body || {}).note).slice(0, 300);
  if (!REPORT_REASONS.some((r) => r[0] === reason)) return res.status(400).json({ error: "Şikâyet nedeni seçin." });
  if (!(await checkHourlyActionLimit(`freport:${req.fm.id}`, "forum_report", 20))) return res.status(429).json({ error: "Çok fazla şikâyet gönderildi. Lütfen daha sonra tekrar deneyin." });
  const r = await pool.query(`INSERT INTO forum_reports (post_id, reporter_id, reason, note) VALUES ($1, $2, $3, $4) ON CONFLICT (post_id, reporter_id) DO NOTHING RETURNING id`, [p.id, req.fm.id, reason, noteText]);
  if (r.rows.length && p.author_id) await pool.query(`UPDATE forum_profiles SET reports_received = reports_received + 1 WHERE user_id = $1`, [p.author_id]);
  res.status(201).json({ ok: true, already: !r.rows.length });
});

// ------------------------------------------------------------------ arama / anma / profil
function tsQuery(q) {
  const toks = String(q).toLocaleLowerCase("tr-TR").match(/[\p{L}\p{N}]{2,}/gu) || [];
  return toks.slice(0, 8).map((t) => t.replace(/'/g, "") + ":*").join(" & ");
}
boardRouter.get("/board/search", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const q = clean(req.query.q).slice(0, 80), tq = tsQuery(q);
  if (!tq) return res.json({ q, results: [], total: 0 });
  if (!(await checkHourlyActionLimit(`fsearch:${req.fm.id}`, "forum_search", 300))) return res.status(429).json({ error: "Çok fazla arama yapıldı. Lütfen biraz sonra tekrar deneyin." });
  const cat = req.query.c ? await category(String(req.query.c)) : null;
  const page = int(req.query.page, 1, 1, 50);
  const { rows } = await pool.query(
    `WITH hits AS (
       SELECT DISTINCT ON (t.id) t.id, t.title, t.kind, t.accepted_post_id, t.reply_count, t.last_post_at, c.slug, c.name AS cat_name, c.icon,
              p.id AS post_id, p.body, ts_rank(p.search, to_tsquery('simple', $1)) + 2 * ts_rank(t.search, to_tsquery('simple', $1)) AS rank
         FROM forum_topics t JOIN forum_categories c ON c.id = t.category_id JOIN forum_posts p ON p.topic_id = t.id AND p.hidden_at IS NULL
        WHERE t.hidden_at IS NULL AND ($2::int IS NULL OR t.category_id = $2) AND (t.search @@ to_tsquery('simple', $1) OR p.search @@ to_tsquery('simple', $1))
        ORDER BY t.id, (p.search @@ to_tsquery('simple', $1)) DESC, p.created_at)
     SELECT *, count(*) OVER ()::int AS total,
            ts_headline('simple', regexp_replace(body, '\\[alinti=[^\\]]*\\][\\s\\S]*?\\[/alinti\\]', ' ', 'g'), to_tsquery('simple', $1), 'StartSel=«,StopSel=»,MaxWords=30,MinWords=12,ShortWord=2') AS snip
       FROM hits ORDER BY rank DESC, last_post_at DESC LIMIT 20 OFFSET ${(page - 1) * 20}`, [tq, cat ? cat.id : null]);
  res.json({ q, page, total: rows.length ? rows[0].total : 0, results: rows.map((r) => ({ id: r.id, title: r.title, kind: r.kind, solved: !!r.accepted_post_id, replies: r.reply_count, lastAt: r.last_post_at,
    category: { slug: r.slug, name: r.cat_name, icon: r.icon }, postId: r.post_id, snippet: String(r.snip || "").slice(0, 400) })) });
});
boardRouter.get("/board/mention", member, async (req, res) => {
  const q = String(req.query.q || "").toLowerCase().replace(/^@/, "");
  if (!/^[a-z0-9._]{1,20}$/.test(q)) return res.json([]);
  const { rows } = await pool.query(
    `SELECT u.username, (SELECT id FROM attachments WHERE user_id = u.id AND scope = 'avatar') AS avatar_id FROM users u JOIN forum_profiles f ON f.user_id = u.id
      WHERE f.rules_accepted_at IS NOT NULL AND u.username LIKE $1 || '%' AND u.id <> $2 ORDER BY f.last_seen_at DESC NULLS LAST LIMIT 6`, [q.replace(/[%_\\]/g, (c) => "\\" + c), req.fm.id]);
  res.json(rows.map((r) => ({ username: r.username, avatarId: r.avatar_id })));
});
boardRouter.get("/board/u/:username", member, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const un = String(req.params.username || "").toLowerCase();
  if (!/^[a-z0-9._]{3,20}$/.test(un)) return res.status(404).json({ error: "Üye bulunamadı." });
  const { rows } = await pool.query(`SELECT ${AUTHOR}, coalesce(f.socials, '{}'::jsonb) AS socials, f.rules_accepted_at, f.banned_until, f.ban_permanent
      FROM users u JOIN forum_profiles f ON f.user_id = u.id WHERE u.username = $1 AND f.rules_accepted_at IS NOT NULL`, [un]);
  const u = rows[0]; if (!u) return res.status(404).json({ error: "Üye bulunamadı." });
  u.id = u.uid;
  const topics = await pool.query(`SELECT t.id, t.title, t.reply_count, t.last_post_at, t.kind, t.accepted_post_id, c.name AS cat_name, c.icon FROM forum_topics t JOIN forum_categories c ON c.id = t.category_id
      WHERE t.author_id = $1 AND t.hidden_at IS NULL ORDER BY t.created_at DESC LIMIT 8`, [u.id]);
  const posts = await pool.query(`SELECT p.id, p.topic_id, left(${plainSql("p.body")}, 160) AS excerpt, p.created_at, t.title
      FROM forum_posts p JOIN forum_topics t ON t.id = p.topic_id WHERE p.author_id = $1 AND NOT p.is_first AND p.hidden_at IS NULL AND t.hidden_at IS NULL ORDER BY p.created_at DESC LIMIT 8`, [u.id]);
  const best = (await pool.query(`SELECT count(*)::int AS n FROM forum_topics t JOIN forum_posts p ON p.id = t.accepted_post_id WHERE p.author_id = $1 AND t.hidden_at IS NULL`, [u.id])).rows[0].n;
  const rel = u.id === req.fm.id ? "self" : ((await pool.query(`SELECT status, requester FROM friendships WHERE user_a = least($1::uuid, $2::uuid) AND user_b = greatest($1::uuid, $2::uuid)`, [req.fm.id, u.id])).rows[0] || {});
  const socials = Object.fromEntries(Object.entries(u.socials || {}).filter(([, v]) => typeof v === "string" && v));
  const out = authorOut(u);
  res.json({ ...out, socials, forumSince: out.level.assigned ? null : u.rules_accepted_at, bestAnswers: best,
    banned: req.fm.mod ? !!(u.ban_permanent || (u.banned_until && new Date(u.banned_until) > new Date())) : undefined,
    relation: rel === "self" ? "self" : !rel.status ? "none" : rel.status === "accepted" ? "friend" : rel.status === "blocked" ? "none" : rel.requester === req.fm.id ? "outgoing" : "incoming",
    topics: topics.rows.map((t) => ({ id: t.id, title: t.title, replies: t.reply_count, lastAt: t.last_post_at, solved: !!t.accepted_post_id, kind: t.kind, category: { name: t.cat_name, icon: t.icon } })),
    posts: posts.rows.map((p) => ({ id: p.id, topicId: p.topic_id, title: p.title, excerpt: p.excerpt, at: p.created_at })) });
});

// ------------------------------------------------------------------ görseller
boardRouter.post("/board/images", member, async (req, res, next) => {
  if (!canWrite(req, res)) return;
  if (Number(req.headers["content-length"] || 0) > IMAGE_MAX) return res.status(400).json({ error: "Görsel en fazla 4 MB olabilir." });
  if (!(await checkHourlyActionLimit(`fimg:${req.fm.id}`, "forum_image_upload", req.fm.mod ? 200 : 40))) return res.status(429).json({ error: "Kısa sürede çok fazla görsel yüklendi. Lütfen biraz sonra tekrar deneyin." });
  next();
}, raw, async (req, res) => storeImage(req, res, req.body, "upload"));
async function storeImage(req, res, buf, via) {
  const info = Buffer.isBuffer(buf) ? imageInfo(buf) : null;
  if (!info || !["image/png", "image/jpeg", "image/gif"].includes(info.mime)) return res.status(400).json({ error: "Yalnız PNG, JPG veya GIF yüklenebilir." });
  if (buf.length > IMAGE_MAX) return res.status(400).json({ error: "Görsel en fazla 4 MB olabilir." });
  if (info.w > IMAGE_PX || info.h > IMAGE_PX || info.w < 8 || info.h < 8) return res.status(400).json({ error: `Görsel en fazla ${IMAGE_PX}×${IMAGE_PX} piksel olabilir.` });
  await pool.query(`DELETE FROM attachments WHERE user_id = $1 AND scope = 'forum' AND forum_post_id IS NULL AND created_at < now() - interval '1 day' RETURNING id`, [req.fm.id]);
  const pending = (await pool.query(`SELECT count(*)::int AS n FROM attachments WHERE user_id = $1 AND scope = 'forum' AND forum_post_id IS NULL`, [req.fm.id])).rows[0].n;
  if (pending >= PENDING_MAX) return res.status(400).json({ error: "Gönderilmemiş çok fazla görseliniz var. Önce mesajınızı gönderin ya da görselleri kaldırın." });
  const data = stripImageMetadata(buf, info.mime);   // konum (GPS) ve cihaz bilgisi silinir
  const ext = info.mime === "image/png" ? "png" : info.mime === "image/gif" ? "gif" : "jpg";
  const { rows } = await pool.query(`INSERT INTO attachments (user_id, scope, filename, mime, size_bytes, data) VALUES ($1, 'forum', $2, $3, $4, $5) RETURNING id`,
    [req.fm.id, `gorsel.${ext}`, info.mime, data.length, data]);
  res.status(201).json({ id: rows[0].id, w: info.w, h: info.h, via });
}
boardRouter.post("/board/images/giphy", member, async (req, res) => {
  if (!canWrite(req, res)) return;
  if (!giphyEnabled()) return res.status(404).json({ error: "GIF araması şu an kullanılamıyor." });
  const id = String((req.body || {}).id || "");
  if (!/^[A-Za-z0-9]{5,40}$/.test(id)) return res.status(400).json({ error: "Geçersiz GIF." });
  if (!(await checkHourlyActionLimit(`fimg:${req.fm.id}`, "forum_image_upload", req.fm.mod ? 200 : 40))) return res.status(429).json({ error: "Kısa sürede çok fazla görsel yüklendi. Lütfen biraz sonra tekrar deneyin." });
  let buf; try { buf = await giphyDownload(id, 2 * 1024 * 1024); } catch (e) { return res.status(400).json({ error: e.userMessage || "GIF indirilemedi. Lütfen başka bir GIF seçin." }); }
  return storeImage(req, res, buf, "giphy");
});
boardRouter.delete("/board/images/:id", member, async (req, res) => {
  if (!ID.test(req.params.id)) return res.status(404).json({ error: "Bulunamadı." });
  await pool.query(`DELETE FROM attachments WHERE id = $1 AND user_id = $2 AND scope = 'forum' AND forum_post_id IS NULL RETURNING id`, [req.params.id, req.fm.id]);
  res.json({ ok: true });
});
// Forum görseli: yalnız forum üyeleri; gizlenen mesajın görseli yalnız moderatöre; bekleyen görsel yalnız sahibine.
boardRouter.get("/board/img/:id", member, async (req, res) => {
  if (!ID.test(req.params.id)) return res.status(404).json({ error: "Bulunamadı." });
  const { rows } = await pool.query(
    `SELECT a.filename, a.mime, a.data, a.user_id, a.forum_post_id, p.hidden_at, t.hidden_at AS topic_hidden FROM attachments a
       LEFT JOIN forum_posts p ON p.id = a.forum_post_id LEFT JOIN forum_topics t ON t.id = p.topic_id WHERE a.id = $1 AND a.scope = 'forum'`, [req.params.id]);
  const a = rows[0];
  if (!a) return res.status(404).json({ error: "Bulunamadı." });
  const ok = a.forum_post_id ? (!(a.hidden_at || a.topic_hidden) || req.fm.mod) : a.user_id === req.fm.id;
  if (!ok) return res.status(404).json({ error: "Bulunamadı." });
  sendAttachment(res, a, a.forum_post_id ? "immutable" : undefined);
});

// ------------------------------------------------------------------ moderasyon
boardRouter.post("/board/t/:id/mod", member, async (req, res) => {
  if (!modOnly(req, res)) return;
  const t = await topicRow(req.params.id, req); if (!t) return res.status(404).json({ error: "Konu bulunamadı." });
  const b = req.body || {}, a = String(b.action || ""), reason = clean(b.reason).slice(0, 200);
  const notifyAuthor = async (text) => { if (t.author_id && t.author_id !== req.fm.id) await note(t.author_id, text, { topicId: t.id, kind: "moderation", reason: reason || null }); };
  if (a === "pin" || a === "unpin") await pool.query(`UPDATE forum_topics SET is_pinned = $2 WHERE id = $1`, [t.id, a === "pin"]);
  else if (a === "lock" || a === "unlock") { await pool.query(`UPDATE forum_topics SET is_locked = $2 WHERE id = $1`, [t.id, a === "lock"]); await notifyAuthor(a === "lock" ? `Konunuz kilitlendi: “${short(t.title)}”` : `Konunuz yeniden yanıtlara açıldı: “${short(t.title)}”`); }
  else if (a === "move") {
    const c = await category(String(b.category || "")); if (!c) return res.status(400).json({ error: "Hedef kategori seçin." });
    if (c.id === t.category_id) return res.json({ ok: true });
    await pool.query(`UPDATE forum_topics SET category_id = $2 WHERE id = $1`, [t.id, c.id]);
    await notifyAuthor(`Konunuz “${c.name}” kategorisine taşındı: “${short(t.title)}”`);
  } else if (a === "kind") {
    const k = b.kind === "question" ? "question" : "discussion";
    await pool.query(`UPDATE forum_topics SET kind = $2, accepted_post_id = CASE WHEN $2 = 'question' THEN accepted_post_id END WHERE id = $1`, [t.id, k]);
  } else if (a === "hide" || a === "restore") {
    if (a === "hide" && !reason) return res.status(400).json({ error: "Kaldırma gerekçesi yazın." });
    const first = await postRow((await pool.query(`SELECT id FROM forum_posts WHERE topic_id = $1 AND is_first`, [t.id])).rows[0].id);
    await tx((c) => setHidden(c, first, a === "hide", "mod", req.fm.id, reason));
    if (first.author_id) await syncLevel(first.author_id);
    await notifyAuthor(a === "hide" ? `Konunuz kurallara aykırı bulunduğu için kaldırıldı: “${short(t.title)}”` : `Konunuz yeniden yayında: “${short(t.title)}”`);
  } else return res.status(400).json({ error: "Geçersiz işlem." });
  await logAudit(req.fm.id, "forum_topic_" + a, "forum_topic", t.id, { reason: reason || null, category: b.category || null }, ip(req));
  res.json({ ok: true });
});
boardRouter.post("/board/posts/:id/mod", member, async (req, res) => {
  if (!modOnly(req, res)) return;
  const p = await postRow(req.params.id); if (!p) return res.status(404).json({ error: "Mesaj bulunamadı." });
  const a = String((req.body || {}).action || ""), reason = clean((req.body || {}).reason).slice(0, 200);
  if (!["hide", "restore"].includes(a)) return res.status(400).json({ error: "Geçersiz işlem." });
  if (a === "hide" && !reason) return res.status(400).json({ error: "Kaldırma gerekçesi yazın." });
  const changed = await tx((c) => setHidden(c, p, a === "hide", "mod", req.fm.id, reason));
  if (changed && p.author_id) {
    await syncLevel(p.author_id);
    if (p.author_id !== req.fm.id) await note(p.author_id, a === "hide" ? `Mesajınız kurallara aykırı bulunduğu için kaldırıldı: “${short(p.title)}”` : `Mesajınız yeniden yayında: “${short(p.title)}”`, { topicId: p.topic_id, postId: p.id, kind: "moderation", reason: reason || null });
  }
  await logAudit(req.fm.id, "forum_post_" + a, "forum_post", p.id, { topic: p.topic_id, reason: reason || null }, ip(req));
  res.json({ ok: true });
});
boardRouter.get("/board/mod/reports", member, async (req, res) => {
  if (!modOnly(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  const st = ["open", "upheld", "dismissed"].includes(req.query.status) ? req.query.status : "open";
  const { rows } = await pool.query(
    `SELECT p.id AS post_id, p.body, p.created_at AS post_at, p.hidden_at, p.is_first, t.id AS topic_id, t.title, au.username AS author,
            json_agg(json_build_object('id', r.id, 'reason', r.reason, 'note', r.note, 'at', r.created_at, 'by', ru.username, 'status', r.status, 'handledBy', hu.username, 'handledAt', r.handled_at) ORDER BY r.created_at) AS reports,
            max(r.created_at) AS last_at
       FROM forum_reports r JOIN forum_posts p ON p.id = r.post_id JOIN forum_topics t ON t.id = p.topic_id
       LEFT JOIN users au ON au.id = p.author_id LEFT JOIN users ru ON ru.id = r.reporter_id LEFT JOIN users hu ON hu.id = r.handled_by
      WHERE r.status = $1 GROUP BY p.id, t.id, au.username ORDER BY max(r.created_at) DESC LIMIT 100`, [st]);
  res.json(rows.map((r) => ({ postId: r.post_id, topicId: r.topic_id, title: r.title, author: r.author, body: r.body, postAt: r.post_at, hidden: !!r.hidden_at, first: r.is_first, reports: r.reports })));
});
boardRouter.post("/board/mod/reports/:postId", member, async (req, res) => {
  if (!modOnly(req, res)) return;
  const p = await postRow(req.params.postId); if (!p) return res.status(404).json({ error: "Mesaj bulunamadı." });
  const a = String((req.body || {}).action || ""), reason = clean((req.body || {}).reason).slice(0, 200);
  if (!["uphold", "dismiss"].includes(a)) return res.status(400).json({ error: "Geçersiz işlem." });
  const open = await pool.query(`UPDATE forum_reports SET status = $2, handled_by = $3, handled_at = now() WHERE post_id = $1 AND status = 'open' RETURNING reporter_id`, [p.id, a === "uphold" ? "upheld" : "dismissed", req.fm.id]);
  if (!open.rows.length) return res.status(409).json({ error: "Bu mesaj için açık şikâyet yok." });
  if (a === "uphold") {
    await tx(async (c) => {
      await setHidden(c, p, true, "mod", req.fm.id, reason || "Şikâyet haklı bulundu");
      if (p.author_id) await c.query(`UPDATE forum_profiles SET reports_upheld = reports_upheld + 1 WHERE user_id = $1`, [p.author_id]);
    });
    if (p.author_id) { await syncLevel(p.author_id); await note(p.author_id, `Mesajınız kurallara aykırı bulunduğu için kaldırıldı: “${short(p.title)}”`, { topicId: p.topic_id, postId: p.id, kind: "moderation", reason: reason || null }); }
  }
  const reporters = [...new Set(open.rows.map((r) => r.reporter_id).filter(Boolean))];
  const P = await prefsOf(reporters);
  for (const uid of reporters) if (P[uid] && P[uid].report_result)
    await note(uid, a === "uphold" ? `Şikâyetiniz incelendi ve içerik kaldırıldı. Teşekkür ederiz.` : `Şikâyetiniz incelendi; içerik kurallara aykırı bulunmadı.`, { topicId: p.topic_id, kind: "report_result" });
  await logAudit(req.fm.id, "forum_report_" + a, "forum_post", p.id, { reports: open.rows.length, reason: reason || null }, ip(req));
  res.json({ ok: true });
});
boardRouter.post("/board/mod/ban/:username", member, async (req, res) => {
  if (!modOnly(req, res)) return;
  const un = String(req.params.username || "").toLowerCase();
  const u = (await pool.query(`SELECT u.id, u.role, f.forum_role FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id WHERE u.username = $1`, [un])).rows[0];
  if (!u) return res.status(404).json({ error: "Üye bulunamadı." });
  if (u.id === req.fm.id || u.role === "admin" || (u.forum_role === "moderator" && !req.fm.admin)) return res.status(403).json({ error: "Bu hesaba forum yasağı uygulanamaz." });
  const b = req.body || {}, reason = clean(b.reason).slice(0, 200), permanent = b.permanent === true, hours = Number(b.hours);
  if (!reason) return res.status(400).json({ error: "Gerekçe yazın." });
  if (!permanent && (!Number.isInteger(hours) || hours < 1 || hours > 24 * 90)) return res.status(400).json({ error: "Süre 1 saat ile 90 gün arasında olmalıdır." });
  if (permanent && !req.fm.admin) return res.status(403).json({ error: "Kalıcı forum yasağını yalnız yönetici verebilir." });
  await pool.query(`INSERT INTO forum_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`, [u.id]);
  const until = permanent ? null : new Date(Date.now() + hours * 3600e3);
  await pool.query(`UPDATE forum_profiles SET banned_until = $2, ban_permanent = $3, ban_reason = $4 WHERE user_id = $1`, [u.id, until, permanent, reason]);
  await note(u.id, permanent ? "Forumdan kalıcı olarak uzaklaştırıldınız." : `Forumdan ${hours < 48 ? hours + " saat" : Math.round(hours / 24) + " gün"} süreyle uzaklaştırıldınız.`, { kind: "moderation", reason, until });
  await logAudit(req.fm.id, "forum_ban", "user", u.id, { hours: permanent ? null : hours, permanent, reason }, ip(req));
  res.json({ ok: true, until, permanent });
});
boardRouter.delete("/board/mod/ban/:username", member, async (req, res) => {
  if (!modOnly(req, res)) return;
  const u = (await pool.query(`SELECT id FROM users WHERE username = $1`, [String(req.params.username || "").toLowerCase()])).rows[0];
  if (!u) return res.status(404).json({ error: "Üye bulunamadı." });
  await pool.query(`UPDATE forum_profiles SET banned_until = NULL, ban_permanent = false, ban_reason = NULL WHERE user_id = $1`, [u.id]);
  await note(u.id, "Forum yasağınız kaldırıldı.", { kind: "moderation" });
  await logAudit(req.fm.id, "forum_unban", "user", u.id, {}, ip(req));
  res.json({ ok: true });
});
boardRouter.get("/board/mod/bans", member, async (req, res) => {
  if (!modOnly(req, res)) return;
  const { rows } = await pool.query(`SELECT u.username, f.banned_until, f.ban_permanent, f.ban_reason FROM forum_profiles f JOIN users u ON u.id = f.user_id
      WHERE f.ban_permanent OR f.banned_until > now() ORDER BY f.ban_permanent DESC, f.banned_until DESC LIMIT 200`);
  res.json(rows.map((r) => ({ username: r.username, until: r.banned_until, permanent: r.ban_permanent, reason: r.ban_reason })));
});
boardRouter.put("/board/mod/categories/:id", member, async (req, res) => {
  if (!req.fm.admin) return res.status(404).json({ error: "Bulunamadı." });
  const c = await category(int(req.params.id, 0, 0, 1e6)); if (!c) return res.status(404).json({ error: "Kategori bulunamadı." });
  const b = req.body || {};
  const name = b.name !== undefined ? clean(b.name).slice(0, 60) : c.name, description = b.description !== undefined ? clean(b.description).slice(0, 240) : c.description;
  const notice = b.notice !== undefined ? clean(b.notice).slice(0, 400) : c.notice;
  const minLevel = b.minLevel !== undefined ? int(b.minLevel, 1, 1, 8) : c.min_level_topic, locked = b.isLocked !== undefined ? b.isLocked === true : c.is_locked;
  if (name.length < 2) return res.status(400).json({ error: "Kategori adı en az 2 karakter olmalıdır." });
  await pool.query(`UPDATE forum_categories SET name = $2, description = $3, notice = $4, min_level_topic = $5, is_locked = $6 WHERE id = $1`, [c.id, name, description, notice, minLevel, locked]);
  await logAudit(req.fm.id, "forum_category_update", "forum_category", String(c.id), { name, minLevel, locked }, ip(req));
  res.json(catOut(await category(c.id)));
});
