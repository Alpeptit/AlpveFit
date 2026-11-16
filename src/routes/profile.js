import express from "express";
import { pool } from "../db/pool.js";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { requireAuth } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLog.js";

export const profileRouter = withAsyncErrors(express.Router());
const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];
export const PROFILE_COLS = `height_cm, weight_kg, birth_year, occupation, daily_steps, blood_type, training_days, goal, health_notes, health_consent_at, updated_at`;

const clean = (v, max) => {
  const s = String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim();
  return s.length > max ? null : s;
};
function intIn(v, lo, hi, label) {
  if (v === "" || v === null || v === undefined) return { v: null };
  const n = Number(v);
  if (!Number.isInteger(n) || n < lo || n > hi) return { err: `${label} ${lo}–${hi} arasında olmalıdır.` };
  return { v: n };
}

// Üye kaydında bu bilgiler SORULMAZ; üye panelden kendisi ekler. Yalnız üyenin kendisi ve atanmış uzmanı/yönetici görür.
profileRouter.get("/profile", requireAuth, async (req, res) => {
  const { rows } = await pool.query(`SELECT ${PROFILE_COLS} FROM member_profiles WHERE user_id = $1`, [req.user.sub]);
  res.setHeader("Cache-Control", "no-store");
  res.json(rows[0] || null);
});

profileRouter.put("/profile", requireAuth, async (req, res) => {
  const b = req.body || {};
  const h = intIn(b.heightCm, 100, 250, "Boy"), by = intIn(b.birthYear, 1930, new Date().getFullYear() - 14, "Doğum yılı");
  const st = intIn(b.dailySteps, 0, 100000, "Günlük adım sayısı"), td = intIn(b.trainingDays, 0, 7, "Haftalık antrenman günü");
  for (const x of [h, by, st, td]) if (x.err) return res.status(400).json({ error: x.err });
  let w = null;
  if (b.weightKg !== "" && b.weightKg !== null && b.weightKg !== undefined) {
    w = Number(b.weightKg);
    if (!Number.isFinite(w) || w < 30 || w > 300) return res.status(400).json({ error: "Kilo 30–300 kg arasında olmalıdır." });
    w = Math.round(w * 10) / 10;
  }
  const blood = b.bloodType === "" || b.bloodType == null ? null : String(b.bloodType);
  if (blood !== null && !BLOOD.includes(blood)) return res.status(400).json({ error: "Geçersiz kan grubu." });
  const occupation = b.occupation ? clean(b.occupation, 80) : null, goal = b.goal ? clean(b.goal, 500) : null, notes = b.healthNotes ? clean(b.healthNotes, 1000) : null;
  if (b.occupation && occupation === null) return res.status(400).json({ error: "Meslek en fazla 80 karakter olabilir." });
  if (b.goal && goal === null) return res.status(400).json({ error: "Hedef en fazla 500 karakter olabilir." });
  if (b.healthNotes && notes === null) return res.status(400).json({ error: "Sağlık notları en fazla 1000 karakter olabilir." });

  // Sağlık verisi (KVKK m.6 özel nitelikli): kan grubu, kilo/boy dahil bu bölüm için AÇIK RIZA zorunlu. Rıza zamanı saklanır; geri alınabilir.
  const hasAny = [h.v, w, by.v, st.v, td.v, blood, occupation, goal, notes].some((x) => x !== null && x !== "");
  const prior = await pool.query(`SELECT health_consent_at FROM member_profiles WHERE user_id = $1`, [req.user.sub]);
  const consentAt = prior.rows[0]?.health_consent_at || null;
  if (hasAny && !consentAt && b.healthConsent !== true) return res.status(400).json({ error: "Bu bilgileri kaydedebilmemiz için açık rızanızı onaylamanız gerekir.", code: "consent_required" });
  const { rows } = await pool.query(
    `INSERT INTO member_profiles (user_id, height_cm, weight_kg, birth_year, occupation, daily_steps, blood_type, training_days, goal, health_notes, health_consent_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, CASE WHEN $11 THEN now() END, now())
     ON CONFLICT (user_id) DO UPDATE SET height_cm=$2, weight_kg=$3, birth_year=$4, occupation=$5, daily_steps=$6, blood_type=$7, training_days=$8, goal=$9, health_notes=$10,
       health_consent_at = COALESCE(member_profiles.health_consent_at, CASE WHEN $11 THEN now() END), updated_at = now()
     RETURNING ${PROFILE_COLS}`,
    [req.user.sub, h.v, w, by.v, occupation || null, st.v, blood, td.v, goal || null, notes || null, hasAny && b.healthConsent === true]);
  await logAudit(req.user.sub, "profile_update", "user", req.user.sub, {}, req.ip || null);
  res.json(rows[0]);
});

// Rıza geri alma: profil bilgileri silinir.
profileRouter.delete("/profile", requireAuth, async (req, res) => {
  await pool.query(`DELETE FROM member_profiles WHERE user_id = $1`, [req.user.sub]);
  await logAudit(req.user.sub, "profile_delete", "user", req.user.sub, {}, req.ip || null);
  res.json({ ok: true });
});
