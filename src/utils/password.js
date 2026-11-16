import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * v43: yeni şifre MEVCUT şifreyle aynı mı? Karşılaştırma düz metinle değil, saklı bcrypt özetine karşı güvenli doğrulamayla yapılır.
 * Özet okunamıyor/bozuksa (bcrypt hata verirse) "aynı" kabul edilir — yani güvenli biçimde doğrulanamayan durumda değişiklik
 * REDDEDİLİR (fail-closed). Gerekçe: aynı şifrenin yeniden kullanılmasına izin vermek yerine işlemi durdurmak daha güvenlidir;
 * özeti bozuk bir hesap zaten normal girişte de doğrulanamaz ve yönetici incelemesi gerektirir.
 */
export async function isSameAsCurrentPassword(plain, hash) {
  if (!hash) return false;   // hiç şifresi olmayan hesap (olmamalı): karşılaştırılacak bir şey yok
  try { return await bcrypt.compare(String(plain), String(hash)); } catch { return true; }
}
export const SAME_PASSWORD_ERROR = "Yeni şifreniz mevcut şifrenizle aynı olamaz. Lütfen farklı bir şifre belirleyin.";

// v55: saf (bağımlılıksız) kurallar ayrı modülde — birim testlerle doğrudan sınanır; buradan da dışa verilir
export { PASSWORD_SPACE_ERROR, hasWhitespace, validatePassword, validateUsername } from "./passwordRules.js";
