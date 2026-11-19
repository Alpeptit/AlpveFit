import express from "express";
import { pool } from "../db/pool.js";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { requireAuth } from "../middleware/auth.js";
import { logAudit } from "../utils/auditLog.js";

export const profileRouter = withAsyncErrors(express.Router());
const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];
export const PROFILE_COLS = `height_cm, weight_kg, birth_year, to_char(birth_date, 'YYYY-MM-DD') AS birth_date, gender, steps_range, work_hours, work_schedule, work_note, meals_per_day, arm_cm::float AS arm_cm, shoulder_cm::float AS shoulder_cm, waist_cm::float AS waist_cm, neck_cm::float AS neck_cm, occupation, daily_steps, blood_type, training_days, goal, health_notes, health_consent_at, updated_at`;
const GENDERS = ["female", "male"];
const STEPS = ["0-2000", "2000-4000", "4000-6000", "6000-8000", "8000-10000", "10000+"];
const GOALS = ["Yağ Yakımı", "Kas Kazanımı", "Güç Artışı"];
const WORK_MODES = ["shift", "flexible", "none"];
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const RANGE_RE = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;
/** Gün gün çalışma saati: { mon: "09:00-17:00", … } — yalnız bilinen gün anahtarları ve geçerli aralıklar; boşsa null. */
function scheduleIn(v) {
  if (v === null || v === undefined || v === "") return { v: null };
  if (typeof v !== "object" || Array.isArray(v)) return { err: "Gün gün çalışma saati geçersiz." };
  const out = {};
  for (const [k, r] of Object.entries(v)) {
    if (!DAY_KEYS.includes(k) || typeof r !== "string" || !RANGE_RE.test(r) || r.slice(0, 5) === r.slice(6)) return { err: "Gün gün çalışma saati geçersiz; her gün için başlangıç ve bitiş saatini seçin." };
    out[k] = r;
  }
  return { v: Object.keys(out).length ? out : null };
}
const WORK_RE = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;
/** Çalışma saati: "HH:MM-HH:MM" (başlangıç ≠ bitiş) veya "shift" / "flexible" / "none". */
function workIn(v) {
  if (v === "" || v === null || v === undefined) return { v: null };
  const s = String(v);
  if (WORK_MODES.includes(s)) return { v: s };
  if (!WORK_RE.test(s) || s.slice(0, 5) === s.slice(6)) return { err: "Çalışma saati geçersiz; başlangıç ve bitiş saatini seçin." };
  return { v: s };
}
/** "YYYY-MM-DD" → geçerli, gelecekte olmayan ve en az 14 yaşında bir takvim tarihi mi? */
function dateIn(v) {
  if (v === "" || v === null || v === undefined) return { v: null };
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v));
  if (!m) return { err: "Doğum tarihi geçersiz." };
  const y = +m[1], mo = +m[2], d = +m[3], dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return { err: "Doğum tarihi geçersiz." };
  const now = new Date(), limit = new Date(Date.UTC(now.getUTCFullYear() - 14, now.getUTCMonth(), now.getUTCDate()));
  if (y < 1930 || dt > limit) return { err: "Doğum tarihi geçersiz (en az 14 yaşında olmalısınız)." };
  return { v: String(v), year: y };
}

const clean = (v, max) => {
  const s = String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim();
  return s.length > max ? null : s;
};
/** İsteğe bağlı çevre ölçüsü (cm, bir ondalık): boşsa null, aralık dışıysa hata. */
function cmIn(v, lo, hi, label) {
  if (v === "" || v === null || v === undefined) return { v: null };
  const n = Number(v);
  if (!Number.isFinite(n) || n < lo || n > hi) return { err: `${label} ${lo}–${hi} cm arasında olmalıdır.` };
  return { v: Math.round(n * 10) / 10 };
}
// İnsan için anlamlı en küçük / en büyük değerler (yetişkin): üst kol çevresi, omuz genişliği (omuz uçları arası), bel çevresi, boyun çevresi.
export const MEASURES = { arm: [15, 70, "Kol çevresi"], shoulder: [25, 80, "Omuz genişliği"], waist: [45, 200, "Bel çevresi"], neck: [20, 70, "Boyun çevresi"] };
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
  const h = intIn(b.heightCm, 100, 250, "Boy"), bd = dateIn(b.birthDate), td = intIn(b.trainingDays, 1, 6, "Haftalık antrenman günü"), meals = intIn(b.mealsPerDay, 1, 6, "Günlük öğün sayısı");
  const ms = {}; for (const k of Object.keys(MEASURES)) ms[k] = cmIn(b[k + "Cm"], ...MEASURES[k]);
  const wh = workIn(b.workHours);
  // Gün gün saat ve not yalnız vardiyalı / esnek / çalışmıyorum düzeninde saklanır.
  const flexMode = wh.v === "shift" || wh.v === "flexible";   // "çalışmıyorum"da ek bilgi alınmaz
  const ws = flexMode ? scheduleIn(b.workSchedule) : { v: null };
  let workNote = null;
  if (flexMode && b.workNote) { workNote = clean(b.workNote, 300); if (workNote === null) return res.status(400).json({ error: "Çalışma notu en fazla 300 karakter olabilir." }); }
  for (const x of [h, bd, td, meals, wh, ws, ...Object.values(ms)]) if (x.err) return res.status(400).json({ error: x.err });
  // Yaş: doğum tarihi yerine yalnız yaş istenir (14–90); doğum yılı olarak saklanır. Eski istemciler doğum tarihi gönderebilir.
  const ag = intIn(b.age, 14, 90, "Yaş"); if (ag.err) return res.status(400).json({ error: ag.err });
  const by = { v: ag.v ? new Date().getFullYear() - ag.v : bd.v ? bd.year : null };
  if (ag.v) bd.v = null;
  const gender = b.gender === "" || b.gender == null ? null : String(b.gender);
  if (gender !== null && !GENDERS.includes(gender)) return res.status(400).json({ error: "Geçersiz cinsiyet seçimi." });
  const stepsRange = b.stepsRange === "" || b.stepsRange == null ? null : String(b.stepsRange);
  if (stepsRange !== null && !STEPS.includes(stepsRange)) return res.status(400).json({ error: "Geçersiz günlük adım aralığı." });
  const st = { v: null };
  let w = null;
  if (b.weightKg !== "" && b.weightKg !== null && b.weightKg !== undefined) {
    w = Number(b.weightKg);
    if (!Number.isFinite(w) || w < 30 || w > 300) return res.status(400).json({ error: "Kilo 30–300 kg arasında olmalıdır." });
    w = Math.round(w * 10) / 10;
  }
  const blood = b.bloodType === "" || b.bloodType == null ? null : String(b.bloodType);
  if (blood !== null && !BLOOD.includes(blood)) return res.status(400).json({ error: "Geçersiz kan grubu." });
  const occupation = b.occupation ? clean(b.occupation, 80) : null, goal = b.goal ? String(b.goal) : null, notes = b.healthNotes ? clean(b.healthNotes, 1000) : null;
  if (b.occupation && occupation === null) return res.status(400).json({ error: "Meslek en fazla 80 karakter olabilir." });
  if (goal !== null && !GOALS.includes(goal)) return res.status(400).json({ error: "Lütfen hedefinizi listeden seçin." });
  if (b.healthNotes && notes === null) return res.status(400).json({ error: "Sağlık notları en fazla 1000 karakter olabilir." });

  // Sağlık verisi (KVKK m.6 özel nitelikli): kan grubu, kilo/boy dahil bu bölüm için AÇIK RIZA zorunlu. Rıza zamanı saklanır; geri alınabilir.
  const hasAny = [h.v, w, by.v, bd.v, gender, stepsRange, wh.v, td.v, meals.v, ms.arm.v, ms.shoulder.v, ms.waist.v, ms.neck.v, blood, occupation, goal, notes].some((x) => x !== null && x !== "");
  // Boş form kaydedilmez: hiçbir bilgi girilmeden "kaydedildi" denmez. Tüm bilgileri kaldırmak için ayrı silme işlemi vardır.
  if (!hasAny) return res.status(400).json({ error: "Kaydetmek için en az bir bilgi girin.", code: "empty" });
  const prior = await pool.query(`SELECT health_consent_at FROM member_profiles WHERE user_id = $1`, [req.user.sub]);
  const consentAt = prior.rows[0]?.health_consent_at || null;
  if (hasAny && !consentAt && b.healthConsent !== true) return res.status(400).json({ error: "Bu bilgileri kaydedebilmemiz için açık rızanızı onaylamanız gerekir.", code: "consent_required" });
  const { rows } = await pool.query(
    `INSERT INTO member_profiles (user_id, height_cm, weight_kg, birth_year, occupation, daily_steps, blood_type, training_days, goal, health_notes, health_consent_at, birth_date, gender, steps_range, work_hours, work_schedule, work_note, meals_per_day, arm_cm, shoulder_cm, waist_cm, neck_cm, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, CASE WHEN $11 THEN now() END, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, now())
     ON CONFLICT (user_id) DO UPDATE SET height_cm=$2, weight_kg=$3, birth_year=$4, occupation=$5, daily_steps=$6, blood_type=$7, training_days=$8, goal=$9, health_notes=$10,
       health_consent_at = COALESCE(member_profiles.health_consent_at, CASE WHEN $11 THEN now() END), birth_date=$12, gender=$13, steps_range=$14, work_hours=$15, work_schedule=$16, work_note=$17, meals_per_day=$18, arm_cm=$19, shoulder_cm=$20, waist_cm=$21, neck_cm=$22, updated_at = now()
     RETURNING ${PROFILE_COLS}`,
    [req.user.sub, h.v, w, by.v, occupation || null, st.v, blood, td.v, goal || null, notes || null, hasAny && b.healthConsent === true, bd.v, gender, stepsRange, wh.v, ws.v ? JSON.stringify(ws.v) : null, workNote, meals.v, ms.arm.v, ms.shoulder.v, ms.waist.v, ms.neck.v]);
  await logAudit(req.user.sub, "profile_update", "user", req.user.sub, {}, req.ip || null);
  res.json(rows[0]);
});

// Rıza geri alma: profil bilgileri silinir.
profileRouter.delete("/profile", requireAuth, async (req, res) => {
  await pool.query(`DELETE FROM member_profiles WHERE user_id = $1`, [req.user.sub]);
  await pool.query(`DELETE FROM attachments WHERE user_id = $1 AND scope IN ('profile', 'body', 'blood')`, [req.user.sub]);   // sağlık, vücut formu ve kan tahlili dosyaları da silinir
  await logAudit(req.user.sub, "profile_delete", "user", req.user.sub, {}, req.ip || null);
  res.json({ ok: true });
});
