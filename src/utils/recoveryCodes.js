// v67 — Kurtarma kodları: 6 haneli sayı (8 adet) yerine 12 karakterlik rastgele kod (XXXX-XXXX-XXXX).
//
// NEDEN: 6 haneli kodun tahmin uzayı yalnızca 1.000.000'du; hesap kilidi (6 hatalı denemede 30 dk) çevrimiçi tahmini sınırlar
// ama sızan bir veritabanında bcrypt özetleri çevrimdışı kırılabilirdi. 12 karakter × 32 simge = 2^60 olasılık: çevrimdışı
// kırma pratik değildir. Alfabede karışan karakterler (0 O 1 I) yoktur; kod elle yazılırken büyük/küçük harf, boşluk ve
// tire önemsizdir.
//
// ESKİ KODLAR: yeni biçimin özetleri "v2:" önekiyle saklanır. Önek taşımayan eski (6 haneli) özetler yalnızca
// LEGACY_RECOVERY_CODES !== "false" iken kabul edilir. Kullanıcılar kodlarını yeniledikten sonra "false" yapılarak eski biçim
// tamamen kapatılabilir; yeni kodlar bu ayardan etkilenmez.
import crypto from "node:crypto";

export const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";   // 32 simge; 0, O, 1, I yok
export const RECOVERY_LENGTH = 12;
export const RECOVERY_PREFIX = "v2:";
export const RECOVERY_NEW_RE = /^[A-HJ-NP-Z2-9]{12}$/;
export const RECOVERY_LEGACY_RE = /^\d{6}$/;

/** Boşluk ve tireleri atar, büyük harfe çevirir. */
export function normalizeRecovery(input) {
  return String(input ?? "").replace(/[\s-]+/g, "").toUpperCase();
}

/** Girdi (normalleştirilince) yeni ya da eski kurtarma kodu biçimindeyse true. */
export function looksLikeRecovery(input) {
  const n = normalizeRecovery(input);
  return RECOVERY_NEW_RE.test(n) || RECOVERY_LEGACY_RE.test(n);
}

/** Tek kod: "ABCD-EFGH-JKLM" (kullanıcıya gösterilen biçim). */
export function genRecoveryCode() {
  let s = "";
  for (let i = 0; i < RECOVERY_LENGTH; i++) s += RECOVERY_ALPHABET[crypto.randomInt(RECOVERY_ALPHABET.length)];
  return s.replace(/(.{4})(?=.)/g, "$1-");
}

export function genRecoveryCodes(count = 8) {
  const set = new Set();
  while (set.size < count) set.add(genRecoveryCode());   // çakışma ihtimali ihmal edilebilir; yine de benzersizlik garanti
  return [...set];
}

let _bcrypt = null;
async function bcryptLib() { return (_bcrypt ||= (await import("bcrypt")).default); }

/** Saklanacak özet: "v2:" + bcrypt(normalleştirilmiş kod). */
export async function hashRecoveryCode(code, { hash } = {}) {
  const h = hash || (await bcryptLib()).hash;
  return RECOVERY_PREFIX + (await h(normalizeRecovery(code), 10));
}

/**
 * Girdiyle eşleşen saklı özeti döner (yoksa null). Yeni biçim yalnız "v2:" özetlerle, eski 6 haneli biçim yalnız
 * öneksiz özetlerle ve yalnız LEGACY_RECOVERY_CODES !== "false" iken karşılaştırılır.
 */
export async function matchRecoveryCode(input, hashes, { compare, env = process.env } = {}) {
  const n = normalizeRecovery(input);
  const list = Array.isArray(hashes) ? hashes : [];
  const isNew = RECOVERY_NEW_RE.test(n);
  const isLegacy = RECOVERY_LEGACY_RE.test(n) && env.LEGACY_RECOVERY_CODES !== "false";
  if (!isNew && !isLegacy) return null;
  const cmp = compare || (await bcryptLib()).compare;
  for (const h of list) {
    const s = String(h || "");
    const v2 = s.startsWith(RECOVERY_PREFIX);
    if (isNew !== v2) continue;                 // yeni girdi yalnız v2 özetlerle, eski girdi yalnız öneksizlerle
    if (await cmp(n, v2 ? s.slice(RECOVERY_PREFIX.length) : s)) return h;
  }
  return null;
}
