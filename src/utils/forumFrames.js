// Profil fotoğrafı çerçeveleri: üyeler seviyeye göre açılan çerçevelerden birini seçer; yönetici, moderatör ve ekip hesabının
// kendine özel çerçevesi vardır (üyeler seçemez). Seçim forumda her avatarın çevresinde görünür.
// Seçilen çerçeve her gösterimde yeniden doğrulanır: seviye düşerse ya da yetki kalkarsa çerçeve kendiliğinden kalkar.
export const FRAMES = [
  { key: "kum",      name: "Kum",               min: 1 },
  { key: "gumus",    name: "Gümüş Halka",       min: 2 },
  { key: "komur",    name: "Kömür",             min: 2 },
  { key: "pump",     name: "Turuncu Pump",      min: 3 },
  { key: "okyanus",  name: "Okyanus",           min: 3 },
  { key: "orman",    name: "Orman",             min: 4 },
  { key: "demir",    name: "Demir",             min: 4 },
  { key: "bronz",    name: "Bronz",             min: 5 },
  { key: "ates",     name: "Ateş",              min: 5 },
  { key: "neon",     name: "Neon",              min: 6 },
  { key: "sahne",    name: "Sahne Işığı",       min: 6 },
  { key: "altin",    name: "Altın",             min: 7 },
  { key: "efsane",   name: "Efsane",            min: 7 },
  { key: "aura",     name: "Gökkuşağı Aura",    min: 8 },
  { key: "tanri",    name: "Ayna Tanrısı",      min: 8 },
  { key: "mod",      name: "Moderatör Kalkanı", role: "moderator" },
  { key: "admin",    name: "AlpveFit",          role: "admin" },
  { key: "ekip",     name: "AlpveFit Ekibi",    role: "official" },
];
const BY = Object.fromEntries(FRAMES.map((f) => [f.key, f]));

/** lv: forumLevel() sonucu. Yönetici ve moderatörler tüm üye çerçevelerini de seçebilir. */
export function frameAllowed(key, lv) {
  const f = BY[key];
  if (!f || !lv) return false;
  if (f.role === "official") return !!lv.official;
  if (f.role === "admin") return lv.n === 10;
  if (f.role === "moderator") return lv.n === 9 || lv.n === 10;
  if (lv.assigned) return true;
  return (lv.n || 1) >= f.min;
}
/** Gösterilecek çerçeve: seçim geçerliyse o; ekip / yönetici / moderatör seçmemişse kendi özel çerçevesi; aksi hâlde yok. */
export function effectiveFrame(chosen, lv) {
  if (chosen === "yok") return null;
  if (chosen && frameAllowed(chosen, lv)) return chosen;
  if (lv && lv.official) return "ekip";
  if (lv && lv.n === 10) return "admin";
  if (lv && lv.n === 9) return "mod";
  return null;
}
export function framesFor(lv) {
  return FRAMES.filter((f) => !f.role || frameAllowed(f.key, lv)).map((f) => ({ key: f.key, name: f.name, min: f.min || null, staff: !!f.role, unlocked: frameAllowed(f.key, lv) }));
}
