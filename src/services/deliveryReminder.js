// Plan teslim hatırlatması: ödemesi onaylanmış ama "Teslim edildi" işaretlenmemiş siparişlerde plan teslim zamanı
//   - yaklaşınca (DELIVERY_REMIND_HOURS, varsayılan 6 saat kala) ve
//   - geçince
// yöneticilere ve üyeye atanmış uzmanlara BİRER KEZ panel bildirimi + e-posta gönderilir.
// Sipariş satırı atomik olarak işaretlendiğinden (FOR UPDATE SKIP LOCKED) çoklu sunucuda tekrar gönderilmez.
// Bir alıcıya aynı turdaki tüm siparişler için TEK e-posta gider. E-postada üye adı yer almaz (yalnız sipariş no ve zaman).
// 7 günden eski gecikmeler hatırlatılmaz (ilk yayında eski kayıtlar yığın bildirim üretmesin); panelde yine listelenir.
import { pool } from "../db/pool.js";
import { sendMail } from "../utils/mailer.js";
import { planDueMail } from "../utils/emailTemplates.js";
import { emit } from "../utils/live.js";

export const REMIND_HOURS = Math.min(48, Math.max(1, Number(process.env.DELIVERY_REMIND_HOURS || 6)));
const STALE_DAYS = 7;

/** Bildirim metni (TR; ön yüz data alanından dile göre üretir). */
export function dueText(stage, orderNumber, memberName) {
  const who = memberName ? ` (${memberName})` : "";
  return stage === "overdue"
    ? `${orderNumber}${who} siparişinin plan teslim zamanı geçti.`
    : `${orderNumber}${who} siparişinin plan teslim zamanı yaklaşıyor.`;
}

/** Zamanı gelen hatırlatmaları gönderir; gönderilen sipariş sayısını döndürür. */
export async function runDeliveryReminders(now = null) {
  const client = await pool.connect();
  let claimed = [];
  try {
    await client.query("BEGIN");
    const t = now ? `$2::timestamptz` : `now()`;
    const { rows } = await client.query(
      `UPDATE orders o SET overdue_notified_at = CASE WHEN o.plans_due_at <= ${t} THEN ${t} ELSE o.overdue_notified_at END,
                           due_soon_notified_at = coalesce(o.due_soon_notified_at, ${t})
         FROM (SELECT id FROM orders
                WHERE status = 'paid' AND delivery_status <> 'delivered' AND plans_due_at IS NOT NULL
                  AND plans_due_at > ${t} - make_interval(days => ${STALE_DAYS})
                  AND ((plans_due_at <= ${t} AND overdue_notified_at IS NULL)
                    OR (plans_due_at > ${t} AND plans_due_at <= ${t} + make_interval(hours => $1::int) AND due_soon_notified_at IS NULL))
                ORDER BY plans_due_at LIMIT 100 FOR UPDATE SKIP LOCKED) due
        WHERE o.id = due.id
       RETURNING o.id, o.order_number, o.user_id, o.plans_due_at, (o.plans_due_at <= ${t}) AS overdue`,
      now ? [REMIND_HOURS, now] : [REMIND_HOURS]);
    claimed = rows;
    if (!claimed.length) { await client.query("COMMIT"); return 0; }
    // alıcılar: tüm yöneticiler + üyeye atanmış uzmanlar
    const { rows: rcpt } = await client.query(
      `SELECT o.id AS order_id, u.id, u.email, u.preferred_lang, m.full_name AS member_name
         FROM orders o LEFT JOIN users m ON m.id = o.user_id
         JOIN users u ON (u.role = 'admin' OR (u.role = 'coach' AND EXISTS (SELECT 1 FROM coach_clients c WHERE c.coach_id = u.id AND c.member_id = o.user_id)))
        WHERE o.id = ANY($1::uuid[])`, [claimed.map((r) => r.id)]);
    const byOrder = new Map(claimed.map((r) => [r.id, r]));
    const perUser = new Map();
    for (const r of rcpt) {
      const o = byOrder.get(r.order_id), stage = o.overdue ? "overdue" : "soon";
      await client.query(
        `INSERT INTO notifications (user_id, type, text, order_id, data) VALUES ($1, 'plan_due', $2, $3, $4)`,
        [r.id, dueText(stage, o.order_number, r.member_name), o.id,
         JSON.stringify({ stage, orderNumber: o.order_number, memberId: o.user_id, memberName: r.member_name || null, dueAt: o.plans_due_at })]);
      if (!perUser.has(r.id)) perUser.set(r.id, { email: r.email, lang: r.preferred_lang, items: [] });
      perUser.get(r.id).items.push({ orderNumber: o.order_number, dueAt: o.plans_due_at, overdue: !!o.overdue });
    }
    await client.query("COMMIT");
    for (const [id, u] of perUser) {
      emit(id, "notif", { kind: "plan_due" });
      if (u.email) await sendMail(u.email, planDueMail(u.lang, { items: u.items })).catch(() => {});
    }
    return claimed.length;
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

/** Panel listesi: teslim bekleyen planlar (yönetici: tümü; uzman: yalnız kendisine atanmış üyeler). */
export async function openDeliveries(role, userId) {
  const admin = role === "admin";
  const { rows } = await pool.query(
    `SELECT o.id, o.order_number, o.user_id AS member_id, m.full_name AS member_name, m.user_code, o.package_key, o.weeks,
            o.delivery_status, o.paid_at, o.plans_due_at,
            (SELECT count(*)::int FROM plans p WHERE p.member_id = o.user_id AND p.status = 'published' AND p.published_at >= o.paid_at) AS plans_published
       FROM orders o LEFT JOIN users m ON m.id = o.user_id
      WHERE o.status = 'paid' AND o.delivery_status <> 'delivered' AND o.plans_due_at IS NOT NULL
        AND ($1::boolean OR EXISTS (SELECT 1 FROM coach_clients c WHERE c.coach_id = $2 AND c.member_id = o.user_id))
      ORDER BY o.plans_due_at ASC LIMIT 100`, [admin, userId]);
  return rows;
}

let timer = null;
export function startDeliveryReminderJob() {
  if (timer) return;
  const tick = () => runDeliveryReminders().catch((e) => console.error("[delivery-reminder]", e.message));
  timer = setInterval(tick, 5 * 60 * 1000);
  timer.unref?.();
  setTimeout(tick, 30 * 1000).unref?.();
}
