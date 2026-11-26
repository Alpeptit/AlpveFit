// v25 — site kullanım ölçümü (birinci taraf): gelen kaydı doğrula ve sadeleştir (saf, test edilir).
// Sorgu dizesi ve # parçası ATILIR (sıfırlama bağlantıları gibi gizli değerler saklanmasın). Yönetim alanı ölçülmez.
// Kişiye özel kimlikler (destek talebi, sipariş, özel mesaj karşı tarafı) saklanmaz: yalnız bölüm adı kalır.
export const ANALYTICS_DAYS = [1, 7, 30, 90];
export const MAX_MS = 30 * 60 * 1000;
export const KEEP_DAYS = 90;
const REFS = ["direct", "internal", "search", "social", "other"];

export function normalizePath(raw) {
  let p = String(raw == null ? "" : raw).split("#")[0].split("?")[0].trim();
  if (!p.startsWith("/") || p.startsWith("//")) return null;
  try { p = decodeURIComponent(p); } catch { return null; }
  p = p.replace(/\/{2,}/g, "/");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  if (/^\/(admin|uzman|api|assets|__)/i.test(p)) return null;
  if (!/^\/[\p{L}\p{N}\-_/.]*$/u.test(p)) return null;
  p = p.replace(/^\/panel\/(destek|siparis|arkadaslar)\/.+$/i, "/panel/$1/…");
  return p.slice(0, 120) || "/";
}

export function normalizeHit(b) {
  if (!b || typeof b !== "object") return null;
  if (typeof b.sid !== "string" || !/^[a-f0-9]{32}$/.test(b.sid)) return null;
  const path = normalizePath(b.path);
  if (!path) return null;
  const ms = Math.round(Number(b.ms));
  if (!Number.isFinite(ms) || ms < 300) return null;
  return { sid: b.sid, path, ms: Math.min(ms, MAX_MS), device: b.device === "mobile" ? "mobile" : "desktop", ref: REFS.includes(b.ref) ? b.ref : "other", lang: b.lang === "en" ? "en" : "tr" };
}

// v27 — paket → satın alma hunisi adımları (oturum başına her biri bir kez)
export const FUNNEL_EVENTS = ["pkg_select", "order"];
export function normalizeEvent(b) {
  if (!b || typeof b !== "object") return null;
  if (typeof b.sid !== "string" || !/^[a-f0-9]{32}$/.test(b.sid)) return null;
  return FUNNEL_EVENTS.includes(b.event) ? { sid: b.sid, event: b.event } : null;
}
