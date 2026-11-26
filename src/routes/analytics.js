// v25 — SİTE KULLANIM ÖLÇÜMÜ (birinci taraf). Ziyaretçi çerez bildiriminde ölçüme izin verdiyse tarayıcı, sayfadan ayrılırken
// o sayfada GÖRÜNÜR olarak geçen süreyi bildirir. Üçüncü taraf yok; IP ve sorgu dizesi saklanmaz; oturum kimliği özetlenir.
// Yönetim tablosu yalnız Tam yetkili yöneticiye açıktır (admin.js → GET /api/admin/analytics); üye bazında gezinti kişisel veridir.
import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { parseCookies, AUTH_COOKIE_NAME } from "../utils/cookies.js";
import { isRequestOriginAllowed } from "../utils/originCheck.js";
import { normalizeHit, normalizeEvent, ANALYTICS_DAYS } from "../utils/analyticsRules.js";

export const analyticsRouter = withAsyncErrors(express.Router());
// CSRF başlığı taşıyamayan ölçüm ucu için KATI köken denetimi: Origin ya da Referer BULUNMALI ve site köküyle eşleşmeli.
const originOk = (req) => !!(req.headers.origin || req.headers.referer) && isRequestOriginAllowed({ origin: req.headers.origin, referer: req.headers.referer, frontendUrl: process.env.FRONTEND_URL });

// Beacon özel başlık taşıyamaz: (1) yalnız aynı site kökenli istek, (2) oturum çerezinden yalnız KİMLİK okunur (JWT + token_version;
// geçersizse misafir), (3) uç hiçbir hesap verisini değiştirmez, yalnız ölçüm satırı ekler.
async function beaconUser(req) {
  try {
    const t = parseCookies(req.headers.cookie)[AUTH_COOKIE_NAME];
    if (!t) return null;
    const p = jwt.verify(t, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    const { rows } = await pool.query(`SELECT token_version FROM users WHERE id = $1`, [p.sub]);
    return rows[0] && rows[0].token_version === p.tv ? p.sub : null;
  } catch { return null; }
}

analyticsRouter.post("/analytics/hit", express.text({ type: "text/plain", limit: "2kb" }), async (req, res) => {
  if (!originOk(req)) return res.status(403).json({ error: "Güvenlik doğrulaması başarısız oldu." });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  const hit = normalizeHit(body);
  if (!hit) return res.status(204).end();
  const sid = crypto.createHash("sha256").update("pv:" + hit.sid).digest("hex").slice(0, 32);
  await pool.query(`INSERT INTO page_views (sid, user_id, path, ms, device, ref, lang) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [sid, await beaconUser(req), hit.path, hit.ms, hit.device, hit.ref, hit.lang]);
  res.status(204).end();
});

// Huni adımı: aynı katı köken denetimi; oturum özeti aynı yöntemle (page_views ile eşleşir); tanımsız adım sessizce yok sayılır.
analyticsRouter.post("/analytics/event", express.text({ type: "text/plain", limit: "1kb" }), async (req, res) => {
  if (!originOk(req)) return res.status(403).json({ error: "Güvenlik doğrulaması başarısız oldu." });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  const ev = normalizeEvent(body);
  if (!ev) return res.status(204).end();
  const sid = crypto.createHash("sha256").update("pv:" + ev.sid).digest("hex").slice(0, 32);
  await pool.query(`INSERT INTO site_events (sid, user_id, event) VALUES ($1, $2, $3) ON CONFLICT (sid, event) DO NOTHING`, [sid, await beaconUser(req), ev.event]);
  res.status(204).end();
});

/** Yönetim özeti: sayfalar, üyeler (kim nerede ne kadar), saatler, kaynaklar ve son oturumların gezinti yolu. */
export async function analyticsSummary(daysIn) {
  const days = ANALYTICS_DAYS.includes(Number(daysIn)) ? Number(daysIn) : 7;
  const since = `now() - make_interval(days => ${days})`;   // days yalnız izinli listeden gelir
  const sum = (await pool.query(
    `SELECT count(*)::int AS views, count(DISTINCT sid)::int AS sessions, count(DISTINCT user_id)::int AS members,
            coalesce(sum(ms), 0)::bigint AS total_ms, coalesce(round(avg(ms)), 0)::int AS avg_ms,
            count(*) FILTER (WHERE device = 'mobile')::int AS mobile, count(*) FILTER (WHERE device = 'desktop')::int AS desktop
       FROM page_views WHERE created_at > ${since}`)).rows[0];
  const refs = (await pool.query(`SELECT ref, count(DISTINCT sid)::int AS sessions FROM page_views WHERE created_at > ${since} GROUP BY ref ORDER BY 2 DESC`)).rows;
  const pages = (await pool.query(
    `SELECT path, count(*)::int AS views, count(DISTINCT sid)::int AS sessions, coalesce(sum(ms), 0)::bigint AS total_ms, round(avg(ms))::int AS avg_ms
       FROM page_views WHERE created_at > ${since} GROUP BY path ORDER BY total_ms DESC, views DESC LIMIT 40`)).rows;
  const members = (await pool.query(
    `SELECT u.id, u.username, u.full_name, EXISTS (SELECT 1 FROM member_access a WHERE a.member_id = u.id) AS coaching,
            count(*)::int AS views, count(DISTINCT p.sid)::int AS sessions, coalesce(sum(p.ms), 0)::bigint AS total_ms, max(p.created_at) AS last_seen,
            (SELECT p2.path FROM page_views p2 WHERE p2.user_id = u.id AND p2.created_at > ${since} GROUP BY p2.path ORDER BY sum(p2.ms) DESC LIMIT 1) AS top_path,
            mode() WITHIN GROUP (ORDER BY p.device) AS device
       FROM page_views p JOIN users u ON u.id = p.user_id
      WHERE p.created_at > ${since} GROUP BY u.id ORDER BY total_ms DESC LIMIT 50`)).rows;
  const hours = (await pool.query(`SELECT extract(hour FROM created_at AT TIME ZONE 'Europe/Istanbul')::int AS h, count(*)::int AS views FROM page_views WHERE created_at > ${since} GROUP BY 1 ORDER BY 1`)).rows;
  const sess = (await pool.query(
    `SELECT s.sid, min(s.created_at) AS started, max(s.created_at) AS ended, coalesce(sum(s.ms), 0)::bigint AS total_ms, count(*)::int AS views,
            max(u.username) AS username, max(s.device) AS device, max(s.ref) FILTER (WHERE s.ref <> 'internal') AS ref,
            (array_agg(s.path ORDER BY s.created_at))[1:12] AS paths, (array_agg(s.ms ORDER BY s.created_at))[1:12] AS durations
       FROM page_views s LEFT JOIN users u ON u.id = s.user_id
      WHERE s.created_at > ${since} GROUP BY s.sid ORDER BY max(s.created_at) DESC LIMIT 30`)).rows;
  // Paket → satın alma hunisi (yalnız ölçüme izin veren oturumlar). "Ödendi": siparişi oluşturan oturumdaki üyenin o sırada oluşturduğu sipariş ödenmiş.
  const funnel = (await pool.query(
    `WITH s AS (SELECT DISTINCT sid FROM page_views WHERE created_at > ${since}),
          pk AS (SELECT DISTINCT sid FROM page_views WHERE created_at > ${since} AND path = '/paketler'),
          ev AS (SELECT sid, user_id, event, created_at FROM site_events WHERE created_at > ${since})
     SELECT (SELECT count(*) FROM s)::int AS sessions, (SELECT count(*) FROM pk)::int AS packages,
            (SELECT count(*) FROM ev WHERE event = 'pkg_select')::int AS selected,
            (SELECT count(*) FROM ev WHERE event = 'order')::int AS ordered,
            (SELECT count(*) FROM ev WHERE event = 'order' AND user_id IS NOT NULL AND EXISTS (
               SELECT 1 FROM orders o WHERE o.user_id = ev.user_id AND o.status = 'paid'
                 AND o.created_at BETWEEN ev.created_at - interval '15 minutes' AND ev.created_at + interval '1 minute'))::int AS paid`)).rows[0];
  // Tüm siparişlerin sonucu (ölçüm izninden bağımsız; dönem içinde oluşturulanlar)
  const orders = (await pool.query(
    `SELECT count(*)::int AS created, count(*) FILTER (WHERE status = 'paid')::int AS paid, count(*) FILTER (WHERE status IN ('pending', 'payment_review', 'flagged'))::int AS waiting,
            count(*) FILTER (WHERE status IN ('expired', 'cancelled'))::int AS lost
       FROM orders WHERE created_at > ${since}`)).rows[0];
  return { days, summary: { ...sum, total_ms: Number(sum.total_ms) }, funnel, orders, refs, pages: pages.map((p) => ({ ...p, total_ms: Number(p.total_ms) })),
    members: members.map((m) => ({ ...m, total_ms: Number(m.total_ms) })), hours,
    sessions: sess.map((s) => ({ ...s, sid: undefined, id: s.sid.slice(0, 8), total_ms: Number(s.total_ms) })) };
}
export { ANALYTICS_DAYS };
