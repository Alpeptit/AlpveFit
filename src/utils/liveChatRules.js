// utils/liveChatRules.js — Canlı destek için SAF kurallar (TEK KAYNAK). Veritabanına dokunmaz.
import crypto from "node:crypto";
import { isValidEmail, messageError } from "./validate.js";

const fail = (status, error) => ({ status, error });
const LETTERS = /^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû\s]+$/;

/** Misafir adı: zorunlu, sayı içeremez, yalnızca harf ve boşluk, 2–60 karakter. */
export function guestNameError(name) {
  const n = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  if (!n) return fail(400, "Ad zorunludur.");
  if (/\d/.test(n)) return fail(400, "Ad alanında sayı kullanılamaz.");
  if (!LETTERS.test(n) || n.length < 2 || n.length > 60) return fail(400, "Ad yalnızca harflerden oluşmalıdır (2–60 karakter).");
  return null;
}
/** Misafir e-postası: zorunlu, @ zorunlu, geçerli biçim. */
export function guestEmailError(email) {
  const e = typeof email === "string" ? email.trim() : "";
  if (!e) return fail(400, "E-posta adresi zorunludur.");
  if (!e.includes("@")) return fail(400, "E-posta adresinde @ işareti bulunmalıdır.");
  if (!isValidEmail(e)) return fail(400, "Lütfen geçerli bir e-posta adresi giriniz.");
  return null;
}
/** Sohbet mesajı: boş olamaz, en fazla 1444 karakter (ortak kural). */
export function chatMessageError(body) {
  const m = messageError(body, "Mesaj boş olamaz.");
  return m ? fail(400, m) : null;
}
export const CHAT_NOT_FOUND = "Görüşme bulunamadı.";
export const CHAT_CLOSED = "Bu görüşme kapatıldı. Yeni bir görüşme başlatabilirsiniz.";

// ---- Misafir anahtarı: 256 bit rastgele; veritabanında YALNIZCA SHA-256 özeti tutulur.
export function newGuestToken() { return crypto.randomBytes(32).toString("base64url"); }
export function hashToken(token) { return crypto.createHash("sha256").update(String(token)).digest("hex"); }
/** Sabit zamanlı karşılaştırma (zamanlama saldırısına kapalı). */
export function tokenMatches(token, storedHash) {
  if (typeof token !== "string" || !token || typeof storedHash !== "string" || storedHash.length !== 64) return false;
  const a = Buffer.from(hashToken(token), "hex"), b = Buffer.from(storedHash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
/** Erişim kararı (saf): üye kendi görüşmesine, misafir yalnızca doğru anahtarla erişir. */
export function canAccessChat(chat, { userId, guestToken }) {
  if (!chat) return false;
  if (chat.user_id) return !!userId && chat.user_id === userId;   // üye görüşmesine misafir anahtarıyla erişilemez
  return tokenMatches(guestToken, chat.guest_token_hash);
}
