// Ağırlık takibi (üye): yalnız koçunun yayınladığı antrenman planlarındaki hareketler için tarih, ağırlık, set, tekrar ve zorlanma (RPE).
// Hareket listesi her istekte üyenin GÖRÜNÜR antrenman planlarından türetilir; başka hareket girilemez. Yönetici / atanmış uzman görüntüler.
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { checkHourlyActionLimit } from "../utils/rateLimit.js";

export const progressRouter = withAsyncErrors(express.Router());
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const LOG_MAX_PER_MEMBER = 5000;

/** Üyenin görünür antrenman planlarındaki (kardiyo hariç) hareketler: [{ name, group }] — ada göre tekil. */
export async function allowedExercises(memberId) {
  const { rows } = await pool.query(
    `SELECT p.data FROM plans p WHERE p.member_id = $1 AND p.kind = 'training' AND p.status = 'published' AND p.data IS NOT NULL
        AND EXISTS (SELECT 1 FROM member_access a WHERE a.member_id = p.member_id AND a.kind = 'training')`, [memberId]);
  const out = new Map();
  for (const r of rows) for (const d of (r.data && r.data.days) || []) for (const e of d.exercises || []) if (e.group !== "cardio" && e.name && !out.has(e.name)) out.set(e.name, { name: e.name, group: e.group });
  return [...out.values()];
}
export async function memberLogs(memberId, exercise) {
  const { rows } = await pool.query(
    `SELECT id, exercise, muscle, to_char(logged_on, 'YYYY-MM-DD') AS logged_on, weight_kg::float AS weight_kg, reps, sets, rpe, note, created_at
       FROM weight_logs WHERE member_id = $1 AND ($2::text IS NULL OR exercise = $2) ORDER BY logged_on DESC, created_at DESC LIMIT 1000`, [memberId, exercise || null]);
  return rows;
}

progressRouter.get("/progress", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const [exercises, logs] = await Promise.all([allowedExercises(req.user.sub), memberLogs(req.user.sub, null)]);
  res.json({ exercises, logs });
});

progressRouter.post("/progress", requireAuth, async (req, res) => {
  const b = req.body || {};
  if (!(await checkHourlyActionLimit(`wlog:${req.user.sub}`, "weight_log", 120))) return res.status(429).json({ error: "Kısa sürede çok fazla kayıt girildi. Lütfen biraz sonra tekrar deneyin." });
  const ex = (await allowedExercises(req.user.sub)).find((x) => x.name === b.exercise);
  if (!ex) return res.status(400).json({ error: "Yalnız koçunuzun antrenman planındaki hareketler için kayıt girebilirsiniz.", field: "exercise" });
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(b.date || ""));
  const dt = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
  const today = new Date(); const lim = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
  if (!dt || dt.getUTCDate() !== +m[3] || dt > lim || dt < new Date(Date.UTC(2020, 0, 1))) return res.status(400).json({ error: "Tarih geçersiz (ileri bir tarih girilemez).", field: "date" });
  const w = Number(b.weightKg), reps = Number(b.reps), sets = b.sets === undefined || b.sets === "" ? 1 : Number(b.sets), rpe = b.rpe === undefined || b.rpe === "" || b.rpe === null ? null : Number(b.rpe);
  if (!Number.isFinite(w) || w < 0 || w > 600) return res.status(400).json({ error: "Ağırlık 0–600 kg olmalıdır.", field: "weight" });
  if (!Number.isInteger(reps) || reps < 1 || reps > 100) return res.status(400).json({ error: "Tekrar 1–100 olmalıdır.", field: "reps" });
  if (!Number.isInteger(sets) || sets < 1 || sets > 20) return res.status(400).json({ error: "Set 1–20 olmalıdır.", field: "sets" });
  if (rpe !== null && (!Number.isInteger(rpe) || rpe < 1 || rpe > 10)) return res.status(400).json({ error: "Zorlanma düzeyi 1–10 olmalıdır.", field: "rpe" });
  const note = String(b.note ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, 200);
  const cnt = await pool.query(`SELECT count(*)::int AS n FROM weight_logs WHERE member_id = $1`, [req.user.sub]);
  if (cnt.rows[0].n >= LOG_MAX_PER_MEMBER) return res.status(409).json({ error: "Kayıt sınırına ulaşıldı. Eski kayıtları silerek yer açabilirsiniz." });
  const { rows } = await pool.query(
    `INSERT INTO weight_logs (member_id, exercise, muscle, logged_on, weight_kg, reps, sets, rpe, note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [req.user.sub, ex.name, ex.group, m[0], Math.round(w * 10) / 10, reps, sets, rpe, note]);
  res.status(201).json({ id: rows[0].id });
});

progressRouter.delete("/progress/:id", requireAuth, async (req, res) => {
  if (!ID_RE.test(req.params.id)) return res.status(404).json({ error: "Kayıt bulunamadı." });
  const { rows } = await pool.query(`DELETE FROM weight_logs WHERE id = $1 AND member_id = $2 RETURNING id`, [req.params.id, req.user.sub]);
  if (!rows.length) return res.status(404).json({ error: "Kayıt bulunamadı." });
  res.json({ ok: true });
});
