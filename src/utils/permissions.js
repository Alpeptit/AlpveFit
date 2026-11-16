// utils/permissions.js — Alpvefit roller ve yetkiler (TEK KAYNAK, SAF: veritabanına dokunmaz).
//
//   user   → Üye: yalnız KENDİSİNE bağlı ve YAYINLANMIŞ planları görür.
//   coach  → Uzman: yalnız kendisine tanımlanan plan türlerinde (beslenme, antrenman, takviye, farmakoloji) plan hazırlar ve yayınlar.
//            Hangi türlere yetkili olduğu users.plan_kinds sütununda tutulur ve her istekte veritabanından okunur.
//   admin  → Tam yetki: uzman ve üye yönetimi, tüm plan türleri, denetim kaydı.
// Arayüz yalnız kolaylık için gizler; her kural SUNUCUDA, her istekte denetlenir.

export const PANEL_ROLES = ["admin", "coach"];
export const ROLE_LABELS = { admin: "Tam yetki", coach: "Uzman", user: "Üye" };
export const PLAN_KINDS = ["nutrition", "training", "supplement", "pharmacology"];
export const KIND_LABELS = { nutrition: "Beslenme programı", training: "Antrenman programı", supplement: "Takviye / vitamin / mineral planı", pharmacology: "Farmakoloji planı" };

export const isPanelRole = (role) => PANEL_ROLES.includes(role);
export const isPlanKind = (k) => PLAN_KINDS.includes(k);
export const FORBIDDEN = "Bu işlem için yetkiniz yok.";

/** Rol bu genel işlemi yapabilir mi? Bilinmeyen rol / yetki → HAYIR (varsayılan kapalı). */
const COACH = new Set(["plans.write", "members.view", "clients.view"]);
export function can(role, perm) {
  if (role === "admin") return true;
  if (role === "coach") return COACH.has(perm);
  return false;
}

/** Uzman bu plan türünde plan hazırlayabilir mi? kinds: veritabanındaki plan_kinds dizisi. */
export function canAuthorKind(role, kinds, kind) {
  if (!isPlanKind(kind)) return false;
  if (role === "admin") return true;
  return role === "coach" && Array.isArray(kinds) && kinds.includes(kind);
}

/** Geçerli plan türü listesini süzer (yinelenenleri ve bilinmeyenleri atar). */
export function normalizeKinds(list) {
  return [...new Set((Array.isArray(list) ? list : []).filter(isPlanKind))];
}

/** Rolün izin listesi (arayüzün düğme gizlemesi için /auth/me ile gönderilir; asıl denetim sunucuda). */
export function permissionsOf(role) {
  if (role === "admin") return ["*"];
  if (role === "coach") return [...COACH];
  return [];
}
