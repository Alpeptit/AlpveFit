// Telefona / masaüstüne bildirim (Web Push): abonelik, son bildirimin kısa metni (hizmet çalışanı çeker) ve deneme bildirimi.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { vapidKeys, endpointAllowed, pushUser } from "../utils/webpush.js";
import { onOffline } from "../utils/live.js";

export const pushRouter = withAsyncErrors(express.Router());
const MAX_SUBS = 10;   // kullanıcı başına cihaz / tarayıcı

// Açık sekmesi olmayan kullanıcıya yeni bildirim ya da mesaj geldiğinde itme gönderilir.
onOffline((userId) => { pushUser(userId).catch(() => {}); });

pushRouter.get("/push/key", async (req, res) => {
  const { pub } = await vapidKeys();
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json({ key: pub });
});

pushRouter.post("/push/subscribe", requireAuth, async (req, res) => {
  const b = req.body || {}, endpoint = String(b.endpoint || "");
  if (!endpointAllowed(endpoint) || endpoint.length > 800) return res.status(400).json({ error: "Bu tarayıcının bildirim adresi desteklenmiyor." });
  const ua = String((req.headers && req.headers["user-agent"]) || "").slice(0, 120);
  // Aynı cihaz başka hesaba geçtiyse abonelik yeni hesaba taşınır (bildirimler önceki hesaba gitmez).
  await pool.query(`INSERT INTO push_subscriptions (user_id, endpoint, ua) VALUES ($1, $2, $3)
    ON CONFLICT (endpoint) DO UPDATE SET user_id = EXCLUDED.user_id, ua = EXCLUDED.ua, fails = 0`, [req.user.sub, endpoint, ua]);
  await pool.query(`DELETE FROM push_subscriptions WHERE id IN (SELECT id FROM push_subscriptions WHERE user_id = $1 ORDER BY created_at DESC OFFSET $2)`, [req.user.sub, MAX_SUBS]);
  res.status(201).json({ ok: true });
});

pushRouter.post("/push/unsubscribe", requireAuth, async (req, res) => {
  await pool.query(`DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2`, [req.user.sub, String((req.body || {}).endpoint || "")]);
  res.json({ ok: true });
});

pushRouter.get("/push/status", requireAuth, async (req, res) => {
  const n = (await pool.query(`SELECT count(*)::int AS n FROM push_subscriptions WHERE user_id = $1`, [req.user.sub])).rows[0].n;
  res.json({ devices: n });
});

pushRouter.post("/push/test", requireAuth, async (req, res) => {
  const sent = await pushUser(req.user.sub, { force: true });
  if (!sent) return res.status(400).json({ error: "Bu hesapta bildirime açık bir cihaz bulunamadı. Önce bildirimleri aç." });
  res.json({ ok: true, sent });
});

function notifUrl(n) {
  const d = n.data || {};
  if (n.type === "forum" && d.topicId && /^[0-9a-f-]{36}$/.test(d.topicId)) return "/forum/konu/" + d.topicId + (d.postId && /^[0-9a-f-]{36}$/.test(d.postId) ? "?m=" + d.postId : "");
  if (n.type === "friend") return "/panel/arkadaslar";
  if (n.type === "ticket" && d.ticketId && /^[0-9a-f-]{36}$/.test(d.ticketId)) return "/panel/destek/" + d.ticketId;
  if (n.type === "level_up") return "/panel/forum-ayarlari/seviye";
  return "/panel/bildirimler";
}

// Hizmet çalışanı itmeyi aldığında çağırır: en yeni okunmamış mesaj ya da bildirimin kısa metni. Mesaj içeriği gösterilmez.
pushRouter.get("/push/latest", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const n = (await pool.query(`SELECT type, text, data, created_at FROM notifications WHERE user_id = $1 AND read_at IS NULL ORDER BY created_at DESC LIMIT 1`, [req.user.sub])).rows[0];
  const dm = (await pool.query(
    `SELECT u.username, d.created_at, (SELECT count(*)::int FROM dm_messages x WHERE x.recipient_id = $1 AND x.read_at IS NULL AND NOT x.hidden_for_recipient AND NOT x.removed_by_mod) AS n
       FROM dm_messages d JOIN users u ON u.id = d.sender_id
      WHERE d.recipient_id = $1 AND d.read_at IS NULL AND NOT d.hidden_for_recipient AND NOT d.removed_by_mod ORDER BY d.created_at DESC LIMIT 1`, [req.user.sub])).rows[0];
  if (dm && (!n || new Date(dm.created_at) >= new Date(n.created_at)))
    return res.json({ title: "Yeni mesaj", body: dm.n > 1 ? `@${dm.username} ve diğerlerinden ${dm.n} okunmamış mesajın var.` : `@${dm.username} sana mesaj gönderdi.`, url: "/panel/arkadaslar", tag: "dm" });
  if (n) return res.json({ title: "AlpveFit", body: String(n.text).slice(0, 180), url: notifUrl(n), tag: "n-" + n.type });
  res.json({ title: "AlpveFit", body: "Yeni bir bildirimin var.", url: "/panel/bildirimler", tag: "n" });
});
