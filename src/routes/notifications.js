import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

export const notificationsRouter = withAsyncErrors(express.Router());

// Bildirimler yalnız oturumdaki kullanıcının satırlarıdır (user_id = $1 her sorguda zorunlu).
// İki grup vardır: "forum" (forum, seviye, arkadaşlık) ve "coach" (koçluk ve sistem: planlar, sipariş, destek, güvenlik).
// Bir grubun yoğunluğu diğerini listeden itmesin diye her gruptan en yeni 40 kayıt döner.
const FORUM_TYPES = ["forum", "level_up", "friend"];
const groupOf = (type) => (FORUM_TYPES.includes(type) ? "forum" : "coach");
const groupSql = (g) => (g === "forum" ? "type = ANY($2::text[])" : g === "coach" ? "NOT (type = ANY($2::text[]))" : null);
notificationsRouter.get("/notifications", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM (
       (SELECT id, type, text, plan_id, order_id, data, read_at, created_at FROM notifications WHERE user_id = $1 AND type = ANY($2::text[]) ORDER BY created_at DESC LIMIT 40)
       UNION ALL
       (SELECT id, type, text, plan_id, order_id, data, read_at, created_at FROM notifications WHERE user_id = $1 AND NOT (type = ANY($2::text[])) ORDER BY created_at DESC LIMIT 40)
     ) n ORDER BY created_at DESC`,
    [req.user.sub, FORUM_TYPES]
  );
  res.json(rows.map((r) => ({ id: r.id, type: r.type, group: groupOf(r.type), plan_id: r.plan_id, text: r.text, order_id: r.order_id, data: r.data, read_at: r.read_at, created_at: r.created_at })));
});

notificationsRouter.post("/notifications/read-all", requireAuth, async (req, res) => {
  const g = groupSql(String(req.query.group || ""));
  if (g) await pool.query(`UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL AND ${g}`, [req.user.sub, FORUM_TYPES]);
  else await pool.query(`UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL`, [req.user.sub]);
  res.json({ ok: true });
});

const NOTIF_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Sahiplik sorgunun kendisinde zorunlu: başkasının bildirimi için de "yok" yanıtı döner (varlık sızdırılmaz).
notificationsRouter.post("/notifications/:id/read", requireAuth, async (req, res) => {
  if (!NOTIF_ID_RE.test(req.params.id)) return res.status(400).json({ error: "Geçersiz bildirim." });
  const { rowCount } = await pool.query(
    `UPDATE notifications SET read_at = COALESCE(read_at, now()) WHERE id = $2 AND user_id = $1`,
    [req.user.sub, req.params.id]
  );
  if (rowCount === 0) return res.status(404).json({ error: "Bildirim bulunamadı." });
  res.json({ ok: true });
});

notificationsRouter.delete("/notifications/:id", requireAuth, async (req, res) => {
  if (!NOTIF_ID_RE.test(req.params.id)) return res.status(400).json({ error: "Geçersiz bildirim." });
  const { rowCount } = await pool.query(`DELETE FROM notifications WHERE id = $2 AND user_id = $1`, [req.user.sub, req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: "Bildirim bulunamadı." });
  res.json({ ok: true });
});

notificationsRouter.delete("/notifications", requireAuth, async (req, res) => {
  const g = groupSql(String(req.query.group || ""));
  const { rowCount } = g ? await pool.query(`DELETE FROM notifications WHERE user_id = $1 AND ${g}`, [req.user.sub, FORUM_TYPES])
    : await pool.query(`DELETE FROM notifications WHERE user_id = $1`, [req.user.sub]);
  res.json({ ok: true, deleted: rowCount });
});
