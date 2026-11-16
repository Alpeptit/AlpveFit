import express from "express";
import crypto from "crypto";
import QRCode from "qrcode";
import { pool } from "../db/pool.js";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { requireAuth } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLog.js";
import { isValidTronAddress } from "../services/tronRpc.js";
import { expireDueOrders } from "../services/orderFulfilment.js";
import {
  PACKAGES, PACKAGE_KEYS, PACKAGE_LABELS, IN_PERSON_CONTACT, CRYPTO_DISCOUNT_RATE, PLAN_DELIVERY_DAYS,
  findOption, cryptoPrice, OPEN_STATUSES, MAX_OPEN_UNPAID_ORDERS, paymentWindowHours,
} from "../utils/packages.js";

export const ordersRouter = withAsyncErrors(express.Router());
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ip = (req) => req.ip || null;

// Herkese açık paket listesi (giriş gerekmez). Fiyatlar yalnız sunucu kataloğundan gelir.
ordersRouter.get("/packages", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({
    cryptoDiscountRate: CRYPTO_DISCOUNT_RATE, planDeliveryDays: PLAN_DELIVERY_DAYS, inPersonContact: IN_PERSON_CONTACT,
    cardEnabled: false,
    packages: PACKAGE_KEYS.map((key) => ({
      key, label: PACKAGE_LABELS[key], pharmacology: PACKAGES[key].pharmacology,
      options: PACKAGES[key].options.map((o) => ({ weeks: o.weeks, price: o.price, cryptoPrice: cryptoPrice(o.price) })),
    })),
  });
});

/** Aynı kuruş kovasında çakışmayı önlemek için tutarın sonuna 4 haneli rastgele ek (Alpeptit ile aynı yöntem): ödeme, tutara göre eşleşir. */
function makeUniqueAmount(base) {
  const cents = Math.round(Number(base) * 100);
  return Number(((cents * 10000 + crypto.randomInt(1, 10000)) / 1e6).toFixed(6));
}

const COLS = `id, order_number, package_key, weeks, pharmacology, list_price, crypto_discount_rate, subtotal, expected_amount, currency, status, payment_expires_at, tx_hash, confirmations, paid_at, plans_due_at, created_at`;

ordersRouter.post("/orders", requireAuth, async (req, res) => {
  const { packageKey, weeks, method, consent } = req.body || {};
  if (method === "card") return res.status(409).json({ error: "Kredi kartı ile ödeme şu anda aktif değildir.", code: "card_disabled" });
  if (method !== "crypto") return res.status(400).json({ error: "Geçersiz ödeme yöntemi." });
  if (consent !== true) return res.status(400).json({ error: "Devam etmek için sözleşme ve bilgilendirmeleri onaylamanız gerekir.", code: "consent_required" });
  const opt = findOption(packageKey, Number(weeks));
  if (!opt) return res.status(400).json({ error: "Geçersiz paket veya süre." });
  const wallet = process.env.TRON_WALLET_ADDRESS;
  if (!wallet || !isValidTronAddress(wallet)) return res.status(503).json({ error: "Ödeme altyapısı şu anda hazır değil. Lütfen daha sonra tekrar deneyin." });

  await expireDueOrders("AND user_id = $1", [req.user.sub]).catch(() => {});
  const u = await pool.query(`SELECT full_name, email FROM users WHERE id = $1`, [req.user.sub]);
  if (!u.rows[0]) return res.status(401).json({ error: "Oturum geçersiz." });
  const open = await pool.query(`SELECT count(*)::int AS n FROM orders WHERE user_id = $1 AND status = ANY($2)`, [req.user.sub, OPEN_STATUSES]);
  if (open.rows[0].n >= MAX_OPEN_UNPAID_ORDERS) return res.status(429).json({ error: `En fazla ${MAX_OPEN_UNPAID_ORDERS} ödenmemiş siparişiniz olabilir. Mevcut siparişlerinizi tamamlayın veya iptal edin.`, code: "too_many_open" });

  const subtotal = cryptoPrice(opt.price);                              // indirim SUNUCUDA hesaplanır
  const usdt = Math.ceil(Number((subtotal * 100).toFixed(6))) / 100;
  let order = null;
  for (let attempt = 0; attempt < 12 && !order; attempt++) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO orders (order_number, user_id, buyer_name, buyer_email, package_key, weeks, pharmacology, list_price, crypto_discount_rate, subtotal,
                             expected_amount, status, payment_address, payment_expires_at, consent_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending',$12, now() + interval '1 hour' * $13, now())
         RETURNING ${COLS}, payment_address`,
        [`AVF-${crypto.randomInt(100000, 1000000)}`, req.user.sub, u.rows[0].full_name, u.rows[0].email, packageKey, opt.weeks, PACKAGES[packageKey].pharmacology,
         opt.price, CRYPTO_DISCOUNT_RATE, subtotal, makeUniqueAmount(usdt.toFixed(2)), wallet, paymentWindowHours()]
      );
      order = rows[0];
    } catch (e) {
      if (!(e.code === "23505" && /order_number_key|pending_expected_amount/.test(e.constraint || ""))) throw e;
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
  const { rows } = await pool.query(`SELECT ${COLS}, payment_address FROM orders WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.sub]);
  const order = rows[0];
  if (!order) return res.status(404).json({ error: "Sipariş bulunamadı." });   // başkasının siparişi de "bulunamadı"
  const payable = OPEN_STATUSES.includes(order.status);
  const qr = payable && order.payment_address ? await QRCode.toDataURL(order.payment_address, { errorCorrectionLevel: "H", margin: 0, width: 232 }).catch(() => null) : null;
  const { payment_address, ...pub } = order;
  res.setHeader("Cache-Control", "no-store");
  res.json({
    order: pub, serverNow: new Date().toISOString(),
    paymentInstructions: payable ? { walletAddress: payment_address, exactAmount: order.expected_amount, currency: "USDT (TRC20)", qr } : null,
  });
});

// Yalnız ödemesi HENÜZ ALGILANMAMIŞ (pending) sipariş iptal edilebilir.
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
