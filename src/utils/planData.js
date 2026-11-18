// Plan yapılandırılmış verisi (plans.data, JSONB) — türe göre doğrulama ve temizleme.
// Kural: yalnız katalogdaki (utils/planCatalog.js) kalemler, sınırlı sayılar ve kısa düz metin notlar kabul edilir; bilinmeyen alanlar atılır.
import { FOOD_BY_KEY, MEALS_MAX, GROUP_BY_KEY, DAYS_MAX, EXERCISES_PER_DAY_MAX, SUPP_GROUPS, SUPP_UNITS, SUPP_STATE, SUPP_WHEN, ITEMS_MAX,
  PHARMA_GROUPS, PHARMA_FREQ, DOSE_UNITS, NOTE_FIELDS, NOTE_MAX } from "./planCatalog.js";

const text = (v, max = NOTE_MAX) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "");
const num = (v, lo, hi, dec = 2) => { const n = Number(v); if (!Number.isFinite(n) || n < lo || n > hi) return null; const f = 10 ** dec; return Math.round(n * f) / f; };
const int = (v, lo, hi) => { const n = Number(v); return Number.isInteger(n) && n >= lo && n <= hi ? n : null; };
const arr = (v) => (Array.isArray(v) ? v : []);
class PlanDataError extends Error {}
const fail = (m) => { throw new PlanDataError(m); };

function nutrition(d) {
  const meals = arr(d.meals);
  if (meals.length > MEALS_MAX) fail(`En fazla ${MEALS_MAX} öğün eklenebilir.`);
  return {
    meals: meals.map((m, i) => {
      const items = arr(m && m.items);
      if (items.length > 30) fail("Bir öğüne en fazla 30 besin eklenebilir.");
      return {
        items: items.map((it) => {
          const f = FOOD_BY_KEY[it && it.food]; if (!f) fail("Listede olmayan bir besin seçildi.");
          const qty = f.unit === "adet" ? int(it.qty, 1, 30) : num(it.qty, 1, 2000, 1);
          if (qty === null) fail(f.unit === "adet" ? `${f.name}: adet 1–30 arasında olmalıdır.` : `${f.name}: miktar 1–2000 g arasında olmalıdır.`);
          return { food: f.key, qty, note: text(it.note, 200) };
        }),
        note: text(m && m.note),
      };
    }),
    note: text(d.note),
  };
}

function training(d) {
  const days = arr(d.days);
  if (days.length > DAYS_MAX) fail(`En fazla ${DAYS_MAX} antrenman günü eklenebilir.`);
  return {
    days: days.map((dy, i) => {
      const groups = [...new Set(arr(dy && dy.groups).filter((g) => GROUP_BY_KEY[g]))];
      const ex = arr(dy && dy.exercises);
      if (ex.length > EXERCISES_PER_DAY_MAX) fail(`Bir güne en fazla ${EXERCISES_PER_DAY_MAX} hareket eklenebilir.`);
      return {
        title: text(dy && dy.title, 60) || `${i + 1}. Gün`,
        groups,
        exercises: ex.map((e) => {
          const g = GROUP_BY_KEY[e && e.group]; if (!g) fail("Geçersiz kas grubu.");
          const name = text(e.name, 60);
          if (!name) fail("Hareket adı gerekli.");
          if (!e.custom && !g.exercises.includes(name)) fail(`"${name}" bu grubun listesinde yok.`);
          if (g.key === "cardio") {
            const minutes = int(e.minutes, 1, 300); if (minutes === null) fail(`${name}: süre 1–300 dakika olmalıdır.`);
            return { group: g.key, name, custom: !!e.custom, minutes, note: text(e.note, 200) };
          }
          const sets = int(e.sets, 1, 20); if (sets === null) fail(`${name}: set sayısı 1–20 olmalıdır.`);
          const reps = String(e.reps ?? "").trim();
          if (!/^(\d{1,3}(-\d{1,3})?|MAX|TÜKENİŞ)$/i.test(reps)) fail(`${name}: tekrar sayısı (ör. 10 veya 8-12) geçersiz.`);
          const weight = e.weight === "" || e.weight == null ? null : num(e.weight, 0, 1000, 1);
          if (e.weight !== "" && e.weight != null && weight === null) fail(`${name}: ağırlık 0–1000 kg olmalıdır.`);
          return { group: g.key, name, custom: !!e.custom, sets, reps: reps.toUpperCase(), weight, note: text(e.note, 200) };
        }),
        note: text(dy && dy.note),
      };
    }),
    note: text(d.note),
  };
}

const SUPP_BY = Object.fromEntries(SUPP_GROUPS.map((g) => [g.key, g]));
function supplement(d) {
  const items = arr(d.items); if (items.length > ITEMS_MAX) fail(`En fazla ${ITEMS_MAX} kalem eklenebilir.`);
  const states = SUPP_STATE.map((x) => x[0]), whens = SUPP_WHEN.map((x) => x[0]);
  return {
    items: items.map((it) => {
      const g = SUPP_BY[it && it.group]; if (!g || !g.items.includes(it.name)) fail("Listede olmayan bir supplement seçildi.");
      const amount = it.amount === "" || it.amount == null ? null : num(it.amount, 0.001, 100000, 3);
      if (it.amount !== "" && it.amount != null && amount === null) fail(`${it.name}: miktar geçersiz.`);
      const unit = SUPP_UNITS.includes(it.unit) ? it.unit : SUPP_UNITS[0];
      const times = int(it.times, 1, 6); if (times === null) fail(`${it.name}: günde kullanım 1–6 olmalıdır.`);
      const state = states.includes(it.state) ? it.state : "any";
      return { group: g.key, name: it.name, amount, unit, times, state, when: [...new Set(arr(it.when).filter((w) => whens.includes(w)))], note: text(it.note, 200) };
    }),
    note: text(d.note),
  };
}

const PH_BY = Object.fromEntries(PHARMA_GROUPS.map((g) => [g.key, g]));
function pharmacology(d) {
  const items = arr(d.items); if (items.length > ITEMS_MAX) fail(`En fazla ${ITEMS_MAX} kalem eklenebilir.`);
  const freqs = PHARMA_FREQ.map((x) => x[0]);
  return {
    items: items.map((it) => {
      const g = PH_BY[it && it.group]; if (!g || !g.items.includes(it.name)) fail("Listede olmayan bir madde seçildi.");
      const dose = it.dose === "" || it.dose == null ? null : num(it.dose, 0.0001, 100000, 4);
      if (it.dose !== "" && it.dose != null && dose === null) fail(`${it.name}: doz geçersiz.`);
      const unit = DOSE_UNITS.includes(it.unit) ? it.unit : "mg";
      const freq = freqs.includes(it.freq) ? it.freq : "custom";
      const weeks = it.weeks === "" || it.weeks == null ? null : int(it.weeks, 1, 52);
      if (it.weeks !== "" && it.weeks != null && weeks === null) fail(`${it.name}: süre 1–52 hafta olmalıdır.`);
      const out = { group: g.key, name: it.name, dose, unit, freq, weeks, note: text(it.note, 200) };
      if (g.mode === "inj") { out.conc = it.conc === "" || it.conc == null ? null : num(it.conc, 0.1, 1000, 2); if (it.conc !== "" && it.conc != null && out.conc === null) fail(`${it.name}: konsantrasyon (mg/mL) geçersiz.`); }
      if (g.mode === "pep") {
        out.vialMg = it.vialMg === "" || it.vialMg == null ? null : num(it.vialMg, 0.01, 10000, 2);
        out.bacMl = it.bacMl === "" || it.bacMl == null ? null : num(it.bacMl, 0.1, 10, 2);
        if ((it.vialMg !== "" && it.vialMg != null && out.vialMg === null) || (it.bacMl !== "" && it.bacMl != null && out.bacMl === null)) fail(`${it.name}: şişe miktarı veya BAC hacmi geçersiz.`);
      }
      return out;
    }),
    note: text(d.note),
  };
}

function notes(d) {
  const out = { values: {}, notes: {}, note: text(d.note) };
  for (const [k, f] of Object.entries(NOTE_FIELDS)) {
    const v = d.values && d.values[k];
    if (v !== undefined && v !== "" && v !== null) { if (!f.options.includes(v)) fail(`${f.label}: listeden bir seçenek seçin.`); out.values[k] = v; }
    const t = text(d.notes && d.notes[k]); if (t) out.notes[k] = t;
  }
  return out;
}

const BY_KIND = { nutrition, training, supplement, pharmacology, notes };
/** @returns {{ data } | { error }} — data null ise yapılandırılmış veri yok (yalnız metin plan). */
export function validatePlanData(kind, raw) {
  if (raw === undefined || raw === null) return { data: null };
  if (typeof raw !== "object" || Array.isArray(raw)) return { error: "Plan verisi geçersiz." };
  if (JSON.stringify(raw).length > 200000) return { error: "Plan verisi çok büyük." };
  try { return { data: BY_KIND[kind](raw) }; } catch (e) { if (e instanceof PlanDataError) return { error: e.message }; throw e; }
}

/** Kaydedilmiş veride üyeye gösterilecek en az bir kalem/değer/not var mı? (boş plan yayınlanmaz) */
export function planDataHasContent(kind, d) {
  if (!d || typeof d !== "object") return false;
  if (d.note) return true;
  if (kind === "nutrition") return (d.meals || []).some((m) => (m.items || []).length || m.note);
  if (kind === "training") return (d.days || []).some((dy) => (dy.exercises || []).length || dy.note);
  if (kind === "supplement" || kind === "pharmacology") return (d.items || []).length > 0;
  if (kind === "notes") return Object.keys(d.values || {}).length > 0 || Object.keys(d.notes || {}).length > 0;
  return false;
}
