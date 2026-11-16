import { pool } from "../db/pool.js";

// Veri saklama: 180 gün. Bu süreyi aşan kayıtlar günlük olarak silinir (gizlilik politikasındaki süre ile aynıdır).
// KAPSAM: giriş geçmişi, bildirimler, denetim kaydı, süresi dolmuş/iptal siparişler, arşivlenmiş planlar, eşleşmemiş zincir kayıtları (çözülmüş).
// KAPSAM DIŞI (yasal saklama yükümlülüğü): ödenmiş sipariş ve ödeme kayıtları (mali mevzuat) — kişisel bilgileri anonimleşmeden korunur ve hukuki süre sonunda silinir.
export const RETENTION_DAYS = 180;
const LOCK = "593817264060";

export async function cleanup() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT pg_try_advisory_lock($1) AS ok`, [LOCK]);
    if (!rows[0].ok) return null;
    const d = `now() - interval '${RETENTION_DAYS} days'`;
    const r = {};
    r.codes = (await pool.query(`DELETE FROM verification_codes WHERE expires_at < now() - interval '1 day'`)).rowCount;
    r.resets = (await pool.query(`DELETE FROM password_reset_requests WHERE expires_at < now() - interval '1 day'`)).rowCount;
    r.rate = (await pool.query(`DELETE FROM rate_limit_state WHERE updated_at < now() - interval '30 days' AND (banned_until IS NULL OR banned_until < now())`)).rowCount;
    r.logins = (await pool.query(`DELETE FROM login_history WHERE created_at < ${d}`)).rowCount;
    r.notifications = (await pool.query(`DELETE FROM notifications WHERE created_at < ${d}`)).rowCount;
    r.audit = (await pool.query(`DELETE FROM audit_log WHERE created_at < ${d}`)).rowCount;
    r.orders = (await pool.query(`DELETE FROM orders WHERE status IN ('expired','cancelled') AND created_at < ${d}`)).rowCount;
    r.plans = (await pool.query(`DELETE FROM plans WHERE status = 'archived' AND updated_at < ${d}`)).rowCount;
    r.unmatched = (await pool.query(`DELETE FROM unmatched_transactions WHERE resolved = true AND created_at < ${d}`)).rowCount;
    return r;
  } finally { await client.query(`SELECT pg_advisory_unlock($1)`, [LOCK]).catch(() => {}); client.release(); }
}

export function startDataRetentionJob() {
  const run = () => cleanup().then((r) => r && console.log("[retention]", JSON.stringify(r))).catch((e) => console.error("[retention] hata:", e.message));
  setInterval(run, 24 * 3600 * 1000).unref();
  setTimeout(run, 60 * 1000).unref();
}
