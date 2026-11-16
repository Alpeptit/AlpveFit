import { pool } from "../db/pool.js";
import { logAuditTx } from "../utils/auditLog.js";
import { kindsForPackage, PLAN_DELIVERY_DAYS } from "../utils/packages.js";
import { sendMail } from "../utils/mailer.js";
import { orderPaidMail } from "../utils/emailTemplates.js";

/**
 * Siparişi 'ödendi' yapar (zincir izleyicisi VEYA yönetici onayı). TEK transaction'da:
 *  - kilitli satır yalnız pending/payment_review/flagged ise güncellenir (çift onay yok)
 *  - paketin plan türleri üyeye açılır (farmakoloji yalnız farmakolojili paketlerde) — var olan izin silinmez
 *  - plans_due_at = ödeme + 7 gün; bildirim + denetim kaydı aynı işlemde
 * Dönüş: true = bu çağrı onayladı.
 */
export async function markOrderPaid(orderId, { txHash = null, confirmations = null, fromAddress = null, actorId = null, note = null, source }) {
  const client = await pool.connect();
  let done = null;
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(`SELECT * FROM orders WHERE id = $1 FOR UPDATE`, [orderId]);
    const o = rows[0];
    if (o && ["pending", "payment_review", "flagged"].includes(o.status)) {
      await client.query(
        `UPDATE orders SET status = 'paid', paid_at = now(), plans_due_at = now() + make_interval(days => $2),
                tx_hash = COALESCE($3, tx_hash), confirmations = COALESCE($4, confirmations), from_address = COALESCE($5, from_address),
                approved_by = $6, approval_note = $7, updated_at = now()
         WHERE id = $1`,
        [o.id, PLAN_DELIVERY_DAYS, txHash, confirmations, fromAddress, actorId, note]
      );
      if (o.user_id) {
        for (const kind of kindsForPackage(o.package_key)) {
          await client.query(`INSERT INTO member_access (member_id, kind) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [o.user_id, kind]);
        }
        await client.query(`DELETE FROM notifications WHERE user_id = $1 AND order_id = $2 AND type = 'order_payment'`, [o.user_id, o.id]);
        await client.query(
          `INSERT INTO notifications (user_id, type, text, order_id, data) VALUES ($1, 'order_paid', $2, $3, $4)`,
          [o.user_id, `${o.order_number} numaralı siparişinizin ödemesi onaylandı.`, o.id, JSON.stringify({ orderNumber: o.order_number })]
        );
      }
      await logAuditTx(client, actorId, "order_paid", "order", o.id, { orderNumber: o.order_number, source, txHash, previous: o.status });
      done = o;
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally { client.release(); }
  if (done) {
    try {
      const { rows } = await pool.query(`SELECT preferred_lang, plans_due_at FROM users u RIGHT JOIN orders o ON o.user_id = u.id WHERE o.id = $1`, [done.id]);
      const mail = orderPaidMail(rows[0]?.preferred_lang === "en" ? "en" : "tr", { orderNumber: done.order_number, dueAt: rows[0]?.plans_due_at });
      await sendMail(done.buyer_email, mail);
    } catch (e) { console.error("[order] ödeme e-postası gönderilemedi:", e.message); }
  }
  return !!done;
}

/** Süresi dolan açık siparişleri 'expired' yapar (ödeme bildirimi de kaldırılır). */
export async function expireDueOrders(extraWhere = "", params = []) {
  const { rows } = await pool.query(
    `UPDATE orders SET status = 'expired', updated_at = now()
     WHERE status = 'pending' AND payment_expires_at IS NOT NULL AND payment_expires_at < now() ${extraWhere}
     RETURNING id, user_id, order_number`, params);
  for (const r of rows) {
    if (!r.user_id) continue;
    await pool.query(`DELETE FROM notifications WHERE user_id = $1 AND order_id = $2 AND type = 'order_payment'`, [r.user_id, r.id]).catch(() => {});
  }
  return rows.length;
}
