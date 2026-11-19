import express from "express";
import crypto from "crypto";
import { pool } from "../db/pool.js";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { requireAuth } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLog.js";
import { expireDueOrders, markOrderPaid } from "../services/orderFulfilment.js";
import { activeProvider, isTestProvider } from "../services/payments.js";
import {
  PACKAGES, PACKAGE_KEYS, PACKAGE_LABELS, PLAN_DELIVERY_HOURS, CURRENCY, DISCOUNTS, salePrice,
  findOption, OPEN_STATUSES, MAX_OPEN_UNPAID_ORDERS, paymentWindowHours,
} from "../utils/packages.js";

export const ordersRouter = withAsyncErrors(express.Router());
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ip = (req) => req.ip || null;
const MAX_ATTEMPTS = 10;   // bir siparişte en fazla bu kadar ödeme denemesi

// Herkese açık paket listesi (giriş gerekmez). Fiyatlar yalnız sunucu kataloğundan gelir.
ordersRouter.get("/packages", (req, res) => {
  const provider = activeProvider();
  res.setHeader("Cache-Control", "no-store");
  res.json({
    planDeliveryHours: PLAN_DELIVERY_HOURS, currency: CURRENCY,
    payment: { enabled: !!provider, test: isTestProvider(provider) },
    packages: PACKAGE_KEYS.map((key) => ({
      key, label: PACKAGE_LABELS[key], pharmacology: PACKAGES[key].pharmacology,
      discountPct: DISCOUNTS[key] || 0,
      options: PACKAGES[key].options.map((o) => ({ weeks: o.weeks, listPrice: o.price, price: salePrice(key, o.price) })),   // price: ödenecek (indirimli) tutar
    })),
  });
});

const COLS = `id, order_number, package_key, weeks, pharmacology, list_price, subtotal, currency, status, payment_expires_at, payment_provider, paid_at, plans_due_at, created_at`;

ordersRouter.post("/orders", requireAuth, async (req, res) => {
  const { packageKey, weeks, consent } = req.body || {};
  if (consent !== true) return res.status(400).json({ error: "Devam etmek için sözleşme ve bilgilendirmeleri onaylamanız gerekir.", code: "consent_required" });
  const opt = findOption(packageKey, Number(weeks));
  if (!opt) return res.status(400).json({ error: "Geçersiz paket veya süre." });
  const provider = activeProvider();
  if (!provider) return res.status(503).json({ error: "Ödeme altyapısı şu anda hazır değil. Lütfen daha sonra tekrar deneyin.", code: "payments_unavailable" });

  await expireDueOrders("AND user_id = $1", [req.user.sub]).catch(() => {});
  const u = await pool.query(`SELECT full_name, email FROM users WHERE id = $1`, [req.user.sub]);
  if (!u.rows[0]) return res.status(401).json({ error: "Oturum geçersiz." });
  const open = await pool.query(`SELECT count(*)::int AS n FROM orders WHERE user_id = $1 AND status = ANY($2)`, [req.user.sub, OPEN_STATUSES]);
  if (open.rows[0].n >= MAX_OPEN_UNPAID_ORDERS) return res.status(429).json({ error: `En fazla ${MAX_OPEN_UNPAID_ORDERS} ödenmemiş siparişiniz olabilir. Mevcut siparişlerinizi tamamlayın veya iptal edin.`, code: "too_many_open" });

  let order = null;
  for (let attempt = 0; attempt < 12 && !order; attempt++) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO orders (order_number, user_id, buyer_name, buyer_email, package_key, weeks, pharmacology, list_price, subtotal,
                             currency, status, payment_provider, payment_expires_at, consent_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$12,$9,'pending',$10, now() + interval '1 hour' * $11, now())
         RETURNING ${COLS}`,
        [`AVF-${crypto.randomInt(100000, 1000000)}`, req.user.sub, u.rows[0].full_name, u.rows[0].email, packageKey, opt.weeks, PACKAGES[packageKey].pharmacology,
         opt.price, CURRENCY, provider, paymentWindowHours(), salePrice(packageKey, opt.price)]   // tutar SUNUCU kataloğundan (liste + indirimli); istemci fiyatı kullanılmaz
      );
      order = rows[0];
    } catch (e) {
      if (!(e.code === "23505" && /order_number_key/.test(e.constraint || ""))) throw e;
    }
  }
  if (!order) return res.status(503).json({ error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin." });
  await pool.query(`INSERT INTO notifications (user_id, type, text, order_id, data) VALUES ($1,'order_payment',$2,$3,$4)`,
    [req.user.sub, `${order.order_number} numaralı siparişiniz için ödeme bekleniyor.`, order.id, JSON.stringify({ orderNumber: order.order_number })]);
  await logAudit(req.user.sub, "order_create", "order", order.id, { packageKey, weeks: opt.weeks }, ip(req));
  res.status(201).json({ order });
});

ordersRouter.get("/orders", requireAuth, async (req, res) => {
  await expireDueOrders("AND user_id = $1", [req.user.sub]).catch(() => {});
  res.setHeader("Cache-Control", "no-store");
  const { rows } = await pool.query(`SELECT ${COLS} FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`, [req.user.sub]);
  res.json(rows);
});

ordersRouter.get("/orders/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Sipariş bulunamadı." });
  await expireDueOrders("AND user_id = $1 AND id = $2", [req.user.sub, req.params.id]).catch(() => {});
  const { rows } = await pool.query(`SELECT ${COLS} FROM orders WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
  const order = rows[0];
  if (!order) return res.status(404).json({ error: "Sipariş bulunamadı." });   // başkasının siparişi de "bulunamadı"
  const provider = activeProvider();
  res.setHeader("Cache-Control", "no-store");
  res.json({
    order, serverNow: new Date().toISOString(),
    payment: OPEN_STATUSES.includes(order.status) && provider && provider === order.payment_provider ? { provider, test: isTestProvider(provider) } : null,
  });
});

// SAHTE sanal POS (test): gerçek para çekmez, kart verisi almaz. Yalnız sipariş sahibi, yalnız açık siparişte ve yalnız mock sağlayıcı etkinken.
// Ödeme sonucu SUNUCUDA işlenir; istemci "ödendi" diyemez, yalnız test sonucunu seçer.
ordersRouter.post("/orders/:id/pay/mock", requireAuth, async (req, res) => {
  if (activeProvider() !== "mock") return res.status(404).json({ error: "Bulunamadı." });
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Sipariş bulunamadı." });
  const outcome = req.body && req.body.outcome;
  if (outcome !== "success" && outcome !== "decline") return res.status(400).json({ error: "Geçersiz işlem." });
  await expireDueOrders("AND user_id = $1 AND id = $2", [req.user.sub, req.params.id]).catch(() => {});
  const { rows } = await pool.query(
    `UPDATE orders SET payment_attempts = payment_attempts + 1, updated_at = now()
      WHERE id = $1 AND user_id = $2 AND status = 'pending' AND payment_provider = 'mock' AND payment_attempts < $3 RETURNING id, payment_attempts`,
    [req.params.id, req.user.sub, MAX_ATTEMPTS]);
  if (!rows[0]) {
    const ex = await pool.query(`SELECT status, payment_attempts FROM orders WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
    if (!ex.rows[0]) return res.status(404).json({ error: "Sipariş bulunamadı." });
    if (ex.rows[0].status === "pending") return res.status(429).json({ error: "Çok fazla ödeme denemesi yapıldı. Lütfen yeni bir sipariş oluşturun.", code: "too_many_attempts" });
    return res.status(409).json({ error: "Bu sipariş ödemeye uygun değil.", code: "not_payable" });
  }
  if (outcome === "decline") {
    await logAudit(req.user.sub, "order_payment_declined", "order", req.params.id, { provider: "mock" }, ip(req));
    return res.status(402).json({ error: "Ödeme reddedildi (test). Lütfen tekrar deneyin.", code: "card_declined" });
  }
  const ok = await markOrderPaid(req.params.id, { paymentRef: "MOCK-" + crypto.randomBytes(8).toString("hex"), actorId: null, note: "Sahte sanal POS (test)", source: "mock_pos" });
  if (!ok) return res.status(409).json({ error: "Bu sipariş ödemeye uygun değil.", code: "not_payable" });
  res.json({ ok: true });
});

// Yalnız ödemesi tamamlanmamış (pending) sipariş iptal edilebilir.
ordersRouter.post("/orders/:id/cancel", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Sipariş bulunamadı." });
  const { rows } = await pool.query(
    `UPDATE orders SET status = 'cancelled', updated_at = now() WHERE id = $1 AND user_id = $2 AND status = 'pending' RETURNING id`,
    [req.params.id, req.user.sub]);
  if (!rows[0]) {
    const ex = await pool.query(`SELECT status FROM orders WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
    if (!ex.rows[0]) return res.status(404).json({ error: "Sipariş bulunamadı." });
    return res.status(409).json({ error: "Bu sipariş artık iptal edilemez.", code: "not_cancellable" });
  }
  await pool.query(`DELETE FROM notifications WHERE user_id = $1 AND order_id = $2 AND type = 'order_payment'`, [req.user.sub, req.params.id]);
  await logAudit(req.user.sub, "order_cancel", "order", req.params.id, {}, ip(req));
  res.json({ ok: true });
});
