// Plan değişikliği bildirimi: her kayıtta ayrı e-posta GÖNDERİLMEZ (çoklu e-posta istenmeyen posta klasörüne düşürür).
// Panel bildirimi: üyenin okunmamış "planlarınız güncellendi" bildirimi varsa o güncellenir, yoksa bir tane eklenir.
// E-posta: son değişiklikten PLAN_MAIL_DELAY_MIN dakika sonra, o aralıktaki tüm değişiklikler için TEK e-posta.
import { pool } from "../db/pool.js";
import { sendMail } from "./mailer.js";
import { planUpdatedMail } from "./emailTemplates.js";
import { KIND_LABELS } from "./permissions.js";
import { emit } from "./live.js";

const DELAY_MIN = Math.max(1, Number(process.env.PLAN_MAIL_DELAY_MIN || 15));

export async function notePlanChange(memberId, kind) {
  const label = KIND_LABELS[kind] || kind;
  const upd = await pool.query(
    `UPDATE notifications SET created_at = now(),
            data = jsonb_build_object('kinds', (SELECT to_jsonb(array_agg(DISTINCT k)) FROM jsonb_array_elements_text(coalesce(data->'kinds', '[]'::jsonb) || to_jsonb($2::text)) k)),
            text = 'Planlarınız güncellendi.'
      WHERE id = (SELECT id FROM notifications WHERE user_id = $1 AND type = 'plan_updated' AND read_at IS NULL ORDER BY created_at DESC LIMIT 1)
      RETURNING id`, [memberId, kind]);
  emit(memberId, "notif", { kind: "plan" });
  if (!upd.rows.length) await pool.query(`INSERT INTO notifications (user_id, type, text, data) VALUES ($1, 'plan_updated', 'Planlarınız güncellendi.', $2)`, [memberId, JSON.stringify({ kinds: [kind] })]);
  await pool.query(
    `UPDATE users SET plan_mail_due_at = now() + make_interval(mins => $2::int),
            plan_mail_kinds = (SELECT array_agg(DISTINCT k) FROM unnest(array_append(plan_mail_kinds, $3::text)) k)
      WHERE id = $1`, [memberId, DELAY_MIN, kind]);
  return label;
}

/** Zamanı gelen birleştirilmiş e-postaları gönderir. Satır atomik olarak alındığından çoklu sunucuda tekrar gönderilmez. */
export async function flushPlanMails() {
  const { rows } = await pool.query(
    `UPDATE users u SET plan_mail_due_at = NULL, plan_mail_kinds = '{}'
       FROM (SELECT id, plan_mail_kinds FROM users WHERE plan_mail_due_at IS NOT NULL AND plan_mail_due_at <= now() ORDER BY plan_mail_due_at LIMIT 50 FOR UPDATE SKIP LOCKED) d
      WHERE u.id = d.id
      RETURNING u.email, u.preferred_lang, d.plan_mail_kinds AS kinds`);
  for (const r of rows) {
    if (!r.email) continue;
    await sendMail(r.email, planUpdatedMail(r.preferred_lang, { kinds: (r.kinds || []).map((k) => ({ kind: k, label: KIND_LABELS[k] || k })) })).catch(() => {});
  }
  return rows.length;
}

let timer = null;
export function startPlanMailJob() {
  if (timer) return;
  timer = setInterval(() => { flushPlanMails().catch((e) => console.error("[plan-mail]", e.message)); }, 60 * 1000);
  timer.unref?.();
}
