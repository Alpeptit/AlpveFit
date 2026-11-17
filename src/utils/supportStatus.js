// utils/supportStatus.js — Canlı destek çevrimiçi/çevrimdışı kararı (SAF; veritabanına dokunmaz, test edilebilir).
// Saatler Türkiye saatine göredir (Europe/Istanbul, UTC+3, yaz saati uygulaması yok).
export const SUPPORT_TZ = "Europe/Istanbul";
export const SUPPORT_OFFLINE = "Canlı destek şu anda çevrimdışı. Mesajınızı bırakın; en kısa sürede e-posta ile dönüş yapalım.";
const MODES = ["auto", "online", "offline"];

/** Verilen andaki İstanbul saati (0–23) ve dakikası. */
export function istanbulClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: SUPPORT_TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === "hour").value), m = Number(parts.find((p) => p.type === "minute").value);
  return { hour: h, minute: m };
}

/** Durum kaydından (mode, open_hour, close_hour) çevrimiçi kararı. Bozuk kayıt → güvenli taraf: çevrimdışı. */
export function computeSupportStatus(row, date = new Date()) {
  const mode = row && MODES.includes(row.mode) ? row.mode : "offline";
  const open = Number.isInteger(row?.open_hour) ? row.open_hour : 9;
  const close = Number.isInteger(row?.close_hour) ? row.close_hour : 22;
  const { hour } = istanbulClock(date);
  const inHours = hour >= open && hour < close;
  const online = mode === "online" ? true : mode === "offline" ? false : inHours;
  return { online, mode, hours: { open, close }, timezone: SUPPORT_TZ };
}

/** Admin güncellemesi doğrulaması. */
export function supportStatusPatchError(body) {
  const b = body || {};
  if (b.mode !== undefined && !MODES.includes(b.mode)) return { status: 400, error: "Geçersiz durum." };
  const oh = b.openHour, ch = b.closeHour;
  if (oh !== undefined && !(Number.isInteger(oh) && oh >= 0 && oh <= 23)) return { status: 400, error: "Açılış saati 0–23 arası olmalıdır." };
  if (ch !== undefined && !(Number.isInteger(ch) && ch >= 1 && ch <= 24)) return { status: 400, error: "Kapanış saati 1–24 arası olmalıdır." };
  if (oh !== undefined && ch !== undefined && ch <= oh) return { status: 400, error: "Kapanış saati açılış saatinden sonra olmalıdır." };
  if (b.mode === undefined && oh === undefined && ch === undefined) return { status: 400, error: "Güncellenecek bir alan yok." };
  return null;
}
