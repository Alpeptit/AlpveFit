// v25 — KOÇLUK ASİSTANI: yalnız koçluk üyeleri (en az bir plan bölümü erişimi olan üye) kullanır.
// Konular: kalori / makro, antrenman programı, kilo ve ölçü takibi. Kurallar ve bağlam: src/utils/coachAi.js.
//   GET    /api/assistant           → durum (açık mı, üye uygun mu, rıza, son mesajlar, bugünkü kullanım)
//   POST   /api/assistant/consent   → { accept: true|false } açık rıza ver / geri çek
//   POST   /api/assistant/messages  → { text } soru sor
//   DELETE /api/assistant/messages  → geçmişi sil
import express from "express";
import axios from "axios";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { catalog as planCatalog } from "../utils/planCatalog.js";
import {
  aiConfig, mentionsPharma, wantsCoach, detectLang, TEXTS, cleanReply, buildPrompt, toModelMessages, nutritionSummary, trainingSummary,
  AI_MAX_INPUT, AI_PER_USER_DAY, AI_PER_USER_MIN, AI_KEEP_DAYS, AI_NAME,
} from "../utils/coachAi.js";

export const assistantRouter = withAsyncErrors(express.Router());
const busy = new Set();   // üye başına aynı anda tek soru

async function eligible(uid) {
  const { rows } = await pool.query(`SELECT u.role, u.ai_consent_at, EXISTS (SELECT 1 FROM member_access a WHERE a.member_id = u.id) AS coaching FROM users u WHERE u.id = $1`, [uid]);
  const u = rows[0];
  return { ok: !!(u && u.role === "user" && u.coaching), consent: !!(u && u.ai_consent_at), consentAt: u ? u.ai_consent_at : null };
}
const todayCount = async (uid) => (await pool.query(`SELECT count(*)::int AS n FROM ai_messages WHERE user_id = $1 AND role = 'user' AND created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Istanbul') AT TIME ZONE 'Europe/Istanbul'`, [uid])).rows[0].n;
const history = async (uid, n = 40) => (await pool.query(`SELECT id, role, body, source, created_at FROM ai_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`, [uid, n])).rows.reverse();
const out = (m) => ({ id: m.id, role: m.role, body: m.body, fixed: m.source === "fixed", at: m.created_at });

assistantRouter.get("/assistant", requireAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const cfg = aiConfig(), e = await eligible(req.user.sub);
  if (!e.ok) return res.json({ enabled: cfg.enabled, eligible: false });
  res.json({ enabled: cfg.enabled, eligible: true, name: AI_NAME, consent: e.consent, consentAt: e.consentAt, keepDays: AI_KEEP_DAYS,
    usage: { today: await todayCount(req.user.sub), limit: AI_PER_USER_DAY }, messages: e.consent ? (await history(req.user.sub)).map(out) : [] });
});

assistantRouter.post("/assistant/consent", requireAuth, async (req, res) => {
  const e = await eligible(req.user.sub); if (!e.ok) return res.status(403).json({ error: "Koçluk asistanı yalnız koçluk üyelerine açıktır." });
  const accept = (req.body || {}).accept === true;
  await pool.query(`UPDATE users SET ai_consent_at = ${accept ? "coalesce(ai_consent_at, now())" : "NULL"} WHERE id = $1`, [req.user.sub]);
  res.json({ ok: true, consent: accept });
});

assistantRouter.delete("/assistant/messages", requireAuth, async (req, res) => {
  const r = await pool.query(`DELETE FROM ai_messages WHERE user_id = $1`, [req.user.sub]);
  res.json({ ok: true, deleted: r.rowCount });
});

/** Üyenin kendi verisinden bağlam (yalnız rıza varken çağrılır). Farmakoloji / supplement planı, sağlık notu, kan grubu, ad ve e-posta girmez. */
async function contextOf(uid) {
  const cat = planCatalog();
  const plan = async (kind) => (await pool.query(`SELECT p.data FROM plans p WHERE p.member_id = $1 AND p.kind = $2 AND p.status = 'published'
      AND EXISTS (SELECT 1 FROM member_access a WHERE a.member_id = p.member_id AND a.kind = p.kind) ORDER BY p.published_at DESC LIMIT 1`, [uid, kind])).rows[0]?.data || null;
  const [nut, tr, prof, body, lifts] = await Promise.all([
    plan("nutrition"), plan("training"),
    pool.query(`SELECT height_cm, birth_year, training_days, daily_steps, goal FROM member_profiles WHERE user_id = $1 AND health_consent_at IS NOT NULL`, [uid]),
    pool.query(`SELECT to_char(logged_on, 'YYYY-MM-DD') AS day, weight_kg::float AS weight, waist_cm::float AS waist FROM body_logs WHERE user_id = $1 AND logged_on >= current_date - 120 ORDER BY logged_on DESC LIMIT 30`, [uid]),
    pool.query(`SELECT exercise, (array_agg(weight_kg::float || ' kg × ' || reps ORDER BY logged_on DESC, created_at DESC))[1] AS last, max(weight_kg)::float || ' kg' AS best
        FROM weight_logs WHERE member_id = $1 AND logged_on >= current_date - 120 GROUP BY exercise ORDER BY max(logged_on) DESC LIMIT 15`, [uid]),
  ]);
  const p = prof.rows[0] || {};
  return { profile: { ...p, age: p.birth_year ? new Date().getFullYear() - p.birth_year : null }, nutrition: nutritionSummary(nut, cat), training: trainingSummary(tr), body: body.rows.reverse(), lifts: lifts.rows };
}

async function askModel(cfg, system, messages) {
  const { data } = await axios.post(cfg.url + "/chat/completions", { model: cfg.model, messages: [{ role: "system", content: system }, ...messages], max_tokens: 600, temperature: 0.3 },
    { headers: { Authorization: "Bearer " + cfg.key, "Content-Type": "application/json" }, timeout: 25000, maxRedirects: 0 });
  return data && data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "";
}

assistantRouter.post("/assistant/messages", requireAuth, async (req, res) => {
  const uid = req.user.sub, cfg = aiConfig();
  if (!cfg.enabled) return res.status(503).json({ error: "Koçluk asistanı şu an kapalı.", code: "ai_off" });
  const e = await eligible(uid);
  if (!e.ok) return res.status(403).json({ error: "Koçluk asistanı yalnız koçluk üyelerine açıktır." });
  if (!e.consent) return res.status(403).json({ error: "Asistanı kullanmak için önce açık rızanızı onaylayın.", code: "consent_required" });
  const text = String((req.body || {}).text || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  if (text.length < 2) return res.status(400).json({ error: "Sorunuzu yazın." });
  if (text.length > AI_MAX_INPUT) return res.status(400).json({ error: `Soru en fazla ${AI_MAX_INPUT} karakter olabilir.` });
  if (busy.has(uid)) return res.status(429).json({ error: "Önceki sorunuz yanıtlanıyor; lütfen bekleyin." });
  const lim = (await pool.query(`SELECT count(*)::int AS m FROM ai_messages WHERE user_id = $1 AND role = 'user' AND created_at > now() - interval '1 minute'`, [uid])).rows[0];
  if (lim.m >= AI_PER_USER_MIN) return res.status(429).json({ error: "Kısa sürede çok fazla soru sordunuz. Lütfen bir dakika bekleyin." });
  if ((await todayCount(uid)) >= AI_PER_USER_DAY) return res.status(429).json({ error: `Bugünkü soru hakkınız doldu (${AI_PER_USER_DAY}). Yarın yeniden sorabilirsiniz.`, code: "day_limit" });
  const site = (await pool.query(`SELECT count(*)::int AS n FROM ai_messages WHERE source = 'model' AND created_at >= now() - interval '1 day'`)).rows[0].n;
  busy.add(uid);
  try {
    const lang = detectLang(text);
    const save = async (role, body, source) => (await pool.query(`INSERT INTO ai_messages (user_id, role, body, source, created_at) VALUES ($1, $2, $3, $4, clock_timestamp()) RETURNING id, role, body, source, created_at`, [uid, role, body, source])).rows[0];
    const q = await save("user", text, "member");
    let reply = null, source = "fixed";
    if (mentionsPharma(text)) reply = TEXTS.pharma[lang];                 // modele hiç gönderilmez
    else if (wantsCoach(text)) reply = TEXTS.coach[lang];
    else if (site >= cfg.daily) reply = TEXTS.error[lang];
    else {
      const ctx = await contextOf(uid);
      const hist = (await history(uid, 12)).filter((m) => m.id !== q.id && m.source !== "fixed");
      try {
        const raw = await askModel(cfg, buildPrompt({ ...ctx, lang }), toModelMessages([...hist, { role: "user", body: text }]));
        reply = cleanReply(raw);
        if (reply) source = "model"; else reply = TEXTS.safety[lang];
      } catch (err) {
        console.error("[asistan] model hatası:", err && (err.code || err.message));
        reply = TEXTS.error[lang];
      }
    }
    const a = await save("assistant", reply, source);
    res.status(201).json({ messages: [out(q), out(a)], usage: { today: await todayCount(uid), limit: AI_PER_USER_DAY } });
  } finally { busy.delete(uid); }
});
