// Forum Ayarları (üye): herkese açık kullanıcı adı, avatar, imza (+ tek görsel/GIF), sosyal bağlantılar, forum bildirim tercihleri, seviye.
// Forum içeriği (konu, mesaj, moderasyon) henüz yok; bu uç noktalar yalnız üyenin forum kimliğini yönetir.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLog.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";
import { verifyPassword } from "../utils/password.js";
import { LEVELS, MESSAGING_LEVEL, HIDE_ONLINE_LEVEL, forumLevel, publicLevel } from "../utils/forumLevels.js";
import { FRAMES, framesFor, effectiveFrame } from "../utils/forumFrames.js";
import { syncLevel } from "../utils/levelSync.js";
import { forumUsernameError, USERNAME_RULES, USERNAME_COOLDOWN_DAYS, signatureError, SIGNATURE_RULES, SIGNATURE_MAX, SOCIALS, socialsIn, NOTIFY, notifyIn, AVATAR_RULES, MEDIA, imageInfo } from "../utils/forumRules.js";
import { raw, sendAttachment } from "./uploads.js";
import { giphyEnabled, giphySearch, giphyDownload } from "../utils/giphy.js";

export const forumRouter = withAsyncErrors(express.Router());
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ip = (req) => req.ip || null;
const clean = (v) => String(v ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "").trim();

async function ensureProfile(userId) {
  await pool.query(`INSERT INTO forum_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`, [userId]);
}
async function state(userId) {
  const { rows } = await pool.query(
    `SELECT u.username, u.role, u.username_changed_at, f.level_override, f.forum_role, f.topics, f.posts, f.likes, f.dislikes, f.reports_received, f.reports_upheld,
            coalesce(f.signature, '') AS signature, coalesce(f.socials, '{}'::jsonb) AS socials, coalesce(f.notify, '{}'::jsonb) AS notify, f.rules_accepted_at, coalesce(f.hide_online, false) AS hide_online, f.is_official, f.frame, f.health_consent_at,
            (SELECT id FROM attachments WHERE user_id = u.id AND scope = 'avatar') AS avatar_id,
            (SELECT id FROM attachments WHERE user_id = u.id AND scope = 'sig') AS sig_image_id
       FROM users u LEFT JOIN forum_profiles f ON f.user_id = u.id WHERE u.id = $1`, [userId]);
  const r = rows[0];
  const lv = forumLevel(r, r.role), level = publicLevel(lv);
  const nextChange = r.username_changed_at ? new Date(new Date(r.username_changed_at).getTime() + USERNAME_COOLDOWN_DAYS * 864e5) : null;
  return {
    username: r.username, usernameNextChangeAt: nextChange && nextChange > new Date() ? nextChange.toISOString() : null,
    level, levels: LEVELS.map((l) => ({ n: l.n, name: l.name })), messagingLevel: MESSAGING_LEVEL, messagingUnlocked: level.assigned || level.n >= MESSAGING_LEVEL,
    stats: { topics: r.topics || 0, posts: r.posts || 0, likes: r.likes || 0, dislikes: r.dislikes || 0, reports: r.reports_received || 0 },
    signature: r.signature, socials: r.socials || {}, notify: notifyIn(r.notify), rulesAcceptedAt: r.rules_accepted_at,
    avatarId: r.avatar_id, sigImageId: r.sig_image_id,
    frame: effectiveFrame(r.frame, lv), frameChoice: r.frame || null, frames: framesFor(lv), healthConsentAt: r.health_consent_at || null,
    hideOnline: !!r.hide_online, hideOnlineLevel: HIDE_ONLINE_LEVEL, hideOnlineUnlocked: level.assigned || level.n >= HIDE_ONLINE_LEVEL,
  };
}

forumRouter.get("/forum/me", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  await syncLevel(req.user.sub);
  res.json(await state(req.user.sub));
});
forumRouter.get("/forum/rules", (req, res) => {
  res.json({ username: USERNAME_RULES, usernameCooldownDays: USERNAME_COOLDOWN_DAYS, signature: SIGNATURE_RULES, signatureMax: SIGNATURE_MAX, avatar: AVATAR_RULES,
    socials: Object.fromEntries(Object.entries(SOCIALS).map(([k, v]) => [k, { label: v.label, url: v.url }])), notify: NOTIFY.map(([k, label, def]) => ({ key: k, label, default: def, locked: k === "moderation" })),
    levels: LEVELS.map((l) => ({ n: l.n, name: l.name })), messagingLevel: MESSAGING_LEVEL });
});

// İmza, sosyal bağlantılar ve bildirim tercihleri (gönderilmeyen alan değişmez). Kurallar kabul edilmeden imza ve bağlantı kaydedilmez.
forumRouter.put("/forum/me", requireAuth, async (req, res) => {
  const b = req.body || {};
  const sets = [], vals = [req.user.sub];
  if (b.signature !== undefined) {
    const sig = clean(b.signature), e = signatureError(sig);
    if (e) return res.status(400).json({ error: e, field: "signature" });
    vals.push(sig); sets.push(`signature = $${vals.length}`);
  }
  if (b.socials !== undefined) {
    const s = socialsIn(b.socials); if (s.err) return res.status(400).json({ error: s.err, field: "socials" });
    vals.push(JSON.stringify(s.v)); sets.push(`socials = $${vals.length}`);
  }
  if (b.notify !== undefined) {
    if (typeof b.notify !== "object" || b.notify === null || Array.isArray(b.notify)) return res.status(400).json({ error: "Bildirim tercihleri geçersiz." });
    vals.push(JSON.stringify(notifyIn(b.notify))); sets.push(`notify = $${vals.length}`);
  }
  if (b.acceptRules === true) sets.push(`rules_accepted_at = coalesce(rules_accepted_at, now())`);
  // KVKK açık rızası (forumda sağlık verisi içerebilen paylaşım): verilir ya da her an geri çekilir
  if (b.healthConsent === true) sets.push(`health_consent_at = coalesce(health_consent_at, now())`);
  if (b.healthConsent === false) sets.push(`health_consent_at = NULL`);
  if (b.hideOnline !== undefined) {
    // Çevrimiçi durumunu gizleme Pump Avcısı seviyesinde açılır (kapatmak her zaman serbest)
    if (b.hideOnline === true) {
      const st = await state(req.user.sub);
      if (!st.hideOnlineUnlocked) return res.status(403).json({ error: `Çevrimiçi durumunu gizleme ${LEVELS[HIDE_ONLINE_LEVEL - 1].name} seviyesinde açılır.`, field: "hideOnline" });
    }
    sets.push(`hide_online = ${b.hideOnline === true ? "true" : "false"}`);
  }
  if (b.frame !== undefined) {
    // Profil çerçevesi: seviyeye göre açılanlardan biri, "yok" (çerçevesiz) ya da null (varsayılan). Ekip çerçevelerini üyeler seçemez.
    const key = b.frame === null ? null : String(b.frame);
    if (key !== null && key !== "yok") {
      const st = await state(req.user.sub), f = FRAMES.find((x) => x.key === key);
      if (!f) return res.status(400).json({ error: "Böyle bir çerçeve yok.", field: "frame" });
      if (!st.frames.some((x) => x.key === key && x.unlocked)) return res.status(403).json({ error: f.min ? `Bu çerçeve ${LEVELS[f.min - 1].name} seviyesinde açılır.` : "Bu çerçeve ekibe özeldir.", field: "frame" });
    }
    vals.push(key); sets.push(`frame = $${vals.length}`);
  }
  if (!sets.length) return res.status(400).json({ error: "Değişiklik yok." });
  await ensureProfile(req.user.sub);
  const cur = await pool.query(`SELECT rules_accepted_at FROM forum_profiles WHERE user_id = $1`, [req.user.sub]);
  if (!cur.rows[0].rules_accepted_at && b.acceptRules !== true && (b.signature || (b.socials && Object.values(b.socials).some(Boolean))))
    return res.status(400).json({ error: "İmza ve bağlantı eklemek için forum kurallarını onaylayın.", code: "rules_required" });
  await pool.query(`UPDATE forum_profiles SET ${sets.join(", ")}, updated_at = now() WHERE user_id = $1`, vals);
  await logAudit(req.user.sub, "forum_settings_update", "user", req.user.sub, { fields: Object.keys(b).filter((k) => ["signature", "socials", "notify", "hideOnline", "frame", "healthConsent", "acceptRules"].includes(k)) }, ip(req));
  res.json(await state(req.user.sub));
});

// Kullanıcı adı değişikliği: herkese açık ad; mevcut şifre ile onaylanır, 14 günde bir. Giriş kullanıcı adı da değişir.
forumRouter.put("/forum/me/username", requireAuth, async (req, res) => {
  const { username, password } = req.body || {};
  const u = String(username ?? "").trim().toLowerCase();
  const e = forumUsernameError(u); if (e) return res.status(400).json({ error: e, field: "username" });
  const { rows } = await pool.query(`SELECT username, password_hash, username_changed_at FROM users WHERE id = $1`, [req.user.sub]);
  const me = rows[0];
  if (u === me.username) return res.status(400).json({ error: "Yeni kullanıcı adı mevcut adınızla aynı.", field: "username" });
  if (me.username_changed_at && Date.now() - new Date(me.username_changed_at).getTime() < USERNAME_COOLDOWN_DAYS * 864e5)
    return res.status(429).json({ error: `Kullanıcı adı ${USERNAME_COOLDOWN_DAYS} günde bir değiştirilebilir.`, code: "cooldown" });
  // Şifre denemeleri sınırlıdır (kurala uymayan adlar sayılmaz; şifre tahminine karşı).
  if (!(await checkHourlyActionLimit(`uname:${req.user.sub}`, "username_change_attempt", 10))) return res.status(429).json({ error: "Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin." });
  if (typeof password !== "string" || !password || !(await verifyPassword(password, me.password_hash))) return res.status(400).json({ error: "Mevcut şifreniz yanlış.", field: "password" });
  const taken = await pool.query(`SELECT 1 FROM users WHERE (username = $1 OR email = $1) AND id <> $2`, [u, req.user.sub]);
  if (taken.rows.length) return res.status(409).json({ error: "Bu kullanıcı adı kullanılıyor.", field: "username" });
  try {
    await pool.query(`UPDATE users SET username = $2, username_changed_at = now() WHERE id = $1`, [req.user.sub, u]);
  } catch (err) { if (err && err.code === "23505") return res.status(409).json({ error: "Bu kullanıcı adı kullanılıyor.", field: "username" }); throw err; }
  await logAudit(req.user.sub, "username_change", "user", req.user.sub, { from: me.username, to: u }, ip(req));
  res.json(await state(req.user.sub));
});

// Avatar ve imza görseli: tek dosya, yenisi eskisinin yerini alır. Tür ve boyut dosyanın gerçek içeriğinden okunur.
/** Doğrulanmış görseli kaydeder (avatar / imza görseli tek dosyadır, yenisi eskisinin yerini alır). */
async function storeMedia(req, res, kind, buf, accept, via) {
  const M = MEDIA[kind];
  if (!Buffer.isBuffer(buf) || !buf.length) return res.status(400).json({ error: "Dosya bulunamadı." });
  if (buf.length > M.max) return res.status(400).json({ error: "Görsel en fazla 1 MB olabilir." });
  const info = imageInfo(buf);
  if (!info || !M.types.includes(info.mime)) return res.status(400).json({ error: M.typeErr });
  if (!M.check(info.w, info.h)) return res.status(400).json({ error: M.dimErr + ` (yüklenen: ${info.w}×${info.h})` });
  await ensureProfile(req.user.sub);
  const ok = await pool.query(`SELECT rules_accepted_at FROM forum_profiles WHERE user_id = $1`, [req.user.sub]);
  if (!ok.rows[0].rules_accepted_at && !accept) return res.status(400).json({ error: "Görsel eklemek için forum kurallarını onaylayın.", code: "rules_required" });
  if (accept) await pool.query(`UPDATE forum_profiles SET rules_accepted_at = coalesce(rules_accepted_at, now()) WHERE user_id = $1`, [req.user.sub]);
  const ext = info.mime === "image/png" ? "png" : info.mime === "image/gif" ? "gif" : "jpg";
  await pool.query(`DELETE FROM attachments WHERE user_id = $1 AND scope = $2 RETURNING id`, [req.user.sub, kind]);
  const { rows } = await pool.query(`INSERT INTO attachments (user_id, scope, filename, mime, size_bytes, data) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [req.user.sub, kind, `${kind}.${ext}`, info.mime, buf.length, buf]);
  await logAudit(req.user.sub, kind === "avatar" ? "forum_avatar_set" : "forum_sig_image_set", "attachment", rows[0].id, { w: info.w, h: info.h, mime: info.mime, via: via || "upload" }, ip(req));
  res.status(201).json(await state(req.user.sub));
}
forumRouter.post("/forum/me/media/:media", requireAuth, async (req, res, next) => {
  if (!["avatar", "sig"].includes(req.params.media)) return res.status(404).json({ error: "Bulunamadı." });
  if (!(await checkHourlyActionLimit(`fmedia:${req.user.sub}`, "forum_media_upload", 20))) return res.status(429).json({ error: "Kısa sürede çok fazla görsel yüklendi. Lütfen bir süre sonra tekrar deneyin." });
  if (Number(req.headers["content-length"] || 0) > MEDIA[req.params.media].max) return res.status(400).json({ error: "Görsel en fazla 1 MB olabilir." });
  next();
}, raw, (req, res) => storeMedia(req, res, req.params.media, req.body, req.query.acceptRules === "1"));

// GIPHY'den imza GIF'i: arama sunucu üzerinden yapılır (API anahtarı tarayıcıya gitmez); seçilen GIF sunucuya indirilir ve
// kendi alan adımızdan sunulur (forumu okuyanlar üçüncü tarafa bağlanmaz). GIPHY_API_KEY yoksa özellik kapalıdır.
forumRouter.get("/giphy/status", requireAuth, (req, res) => res.json({ enabled: giphyEnabled() }));
forumRouter.get("/giphy/search", requireAuth, async (req, res) => {
  if (!giphyEnabled()) return res.status(404).json({ error: "GIF araması şu an kullanılamıyor." });
  if (!(await checkHourlyActionLimit(`giphy:${req.user.sub}`, "giphy_search", 120))) return res.status(429).json({ error: "Çok fazla arama yapıldı. Lütfen biraz sonra tekrar deneyin." });
  try { res.json(await giphySearch(String(req.query.q || ""), Number(req.query.offset) || 0, req.query.lang === "en" ? "en" : "tr")); }
  catch (e) { res.status(502).json({ error: "GIF araması şu an yanıt vermiyor. Lütfen biraz sonra tekrar deneyin." }); }
});
forumRouter.post("/forum/me/media/sig/giphy", requireAuth, async (req, res) => {
  if (!giphyEnabled()) return res.status(404).json({ error: "GIF araması şu an kullanılamıyor." });
  const id = String((req.body || {}).id || "");
  if (!/^[A-Za-z0-9]{5,40}$/.test(id)) return res.status(400).json({ error: "Geçersiz GIF." });
  if (!(await checkHourlyActionLimit(`fmedia:${req.user.sub}`, "forum_media_upload", 20))) return res.status(429).json({ error: "Kısa sürede çok fazla görsel yüklendi. Lütfen bir süre sonra tekrar deneyin." });
  let buf;
  try { buf = await giphyDownload(id, MEDIA.sig.max); }
  catch (e) { return res.status(400).json({ error: e.userMessage || "GIF indirilemedi. Lütfen başka bir GIF seçin." }); }
  return storeMedia(req, res, "sig", buf, (req.body || {}).acceptRules === true, "giphy");
});
forumRouter.delete("/forum/me/media/:media", requireAuth, async (req, res) => {
  if (!["avatar", "sig"].includes(req.params.media)) return res.status(404).json({ error: "Bulunamadı." });
  await pool.query(`DELETE FROM attachments WHERE user_id = $1 AND scope = $2 RETURNING id`, [req.user.sub, req.params.media]);
  res.json(await state(req.user.sub));
});

// Avatar ve imza görselleri forumda herkese açıktır (yalnız bu iki tür; diğer ekler bu yoldan sunulmaz).
forumRouter.get("/forum/media/:id", async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: "Bulunamadı." });
  const { rows } = await pool.query(`SELECT filename, mime, data FROM attachments WHERE id = $1 AND scope IN ('avatar', 'sig')`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Bulunamadı." });
  sendAttachment(res, rows[0], "immutable");
});
