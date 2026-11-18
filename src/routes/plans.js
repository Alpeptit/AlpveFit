// Üye tarafı: yalnız KENDİSİNE bağlı, YAYINLANMIŞ ve erişim izni verilmiş türdeki planlar.
// Sahiplik her sorguda member_id = oturum kullanıcısı ile zorunlu tutulur; başkasının planı için "bulunamadı" döner.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { PLAN_KINDS, KIND_LABELS, isPlanKind } from "../utils/permissions.js";
import { catalog as planCatalog } from "../utils/planCatalog.js";

export const plansRouter = withAsyncErrors(express.Router());
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PUBLIC_COLS = `p.id, p.kind, p.title, p.body, p.data, p.starts_on, p.ends_on, p.author_name, p.published_by_name, p.published_at, p.created_at, p.updated_at`;
// Üyenin görebileceği satırlar: kendi planı + yayınlanmış + o tür için erişim izni var.
const VISIBLE = `p.member_id = $1 AND p.status = 'published'
  AND EXISTS (SELECT 1 FROM member_access a WHERE a.member_id = p.member_id AND a.kind = p.kind)`;

// Panelin açılış verisi: hangi türler açık, kaç yayınlanmış plan var, koçluk biçimi.
// Plan kataloğu (besin değerleri, kas grupları, supplement / madde listeleri) — planın gösterimi ve hesapları için.
plansRouter.get("/plan-catalog", requireAuth, (req, res) => { res.setHeader("Cache-Control", "private, max-age=300"); res.json(planCatalog()); });

plansRouter.get("/plans/overview", requireAuth, async (req, res) => {
  const uid = req.user.sub;
  const [acc, cnt, svc] = await Promise.all([
    pool.query(`SELECT kind FROM member_access WHERE member_id = $1`, [uid]),
    pool.query(`SELECT p.kind, count(*)::int AS n, max(p.published_at) AS last_at FROM plans p WHERE ${VISIBLE} GROUP BY p.kind`, [uid]),
    pool.query(`SELECT c.delivery, u.full_name AS coach_name FROM coach_clients c JOIN users u ON u.id = c.coach_id WHERE c.member_id = $1 ORDER BY c.created_at`, [uid]),
  ]);
  const granted = new Set(acc.rows.map((r) => r.kind));
  const counts = Object.fromEntries(cnt.rows.map((r) => [r.kind, r]));
  res.json({
    kinds: PLAN_KINDS.filter((k) => granted.has(k)).map((k) => ({ kind: k, label: KIND_LABELS[k], count: counts[k]?.n || 0, lastPublishedAt: counts[k]?.last_at || null })),
    coaches: svc.rows.map((r) => ({ name: r.coach_name, delivery: r.delivery })),
  });
});

plansRouter.get("/plans", requireAuth, async (req, res) => {
  const kind = req.query.kind;
  if (kind !== undefined && !isPlanKind(kind)) return res.status(400).json({ error: "Geçersiz plan türü." });
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_COLS} FROM plans p WHERE ${VISIBLE} ${kind ? "AND p.kind = $2" : ""} ORDER BY p.published_at DESC LIMIT 100`,
    kind ? [req.user.sub, kind] : [req.user.sub]
  );
  res.json(rows);
});

plansRouter.get("/plans/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Plan bulunamadı." });
  const { rows } = await pool.query(`SELECT ${PUBLIC_COLS} FROM plans p WHERE ${VISIBLE} AND p.id = $2`, [req.user.sub, req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Plan bulunamadı." });
  res.json(rows[0]);
});
