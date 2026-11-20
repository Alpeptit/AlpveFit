// Haftanın meydan okuması: her hafta (Pazartesi–Pazar) havuzdan sırayla biri seçilir. Üye her gün kendi işaretler
// (dürüstlük esaslı); haftada en az 5 gün tamamlayan rozet kazanır. Sağlıklı, herkesin yapabileceği hedefler seçilmiştir.
export const POOL = [
  { key: "adim", title: "Günde 8.000 adım", icon: "steps", text: "Her gün en az 8.000 adım at. Asansör yerine merdiven, kısa yollarda yürüyüş: hepsi sayılır." },
  { key: "uyku", title: "Her gece 7 saat uyku", icon: "moon", text: "Her gece en az 7 saat uyu. Aynı saatte yat, ekranı yatmadan bir saat önce bırak." },
  { key: "protein", title: "Protein hedefini tuttur", icon: "egg", text: "Her gün protein hedefine ulaş (çoğu kişi için kilogram başına 1,6 g civarı)." },
  { key: "sebze", title: "Günde 3 porsiyon sebze ve meyve", icon: "leaf", text: "Her gün en az 3 porsiyon sebze ya da meyve ye. Renk ne kadar çoksa o kadar iyi." },
  { key: "mobilite", title: "Günde 10 dakika esneme", icon: "body", text: "Her gün 10 dakika esneme ya da mobilite çalışması yap. Kalça ve omuzlar sana teşekkür edecek." },
  { key: "su", title: "Yeterli su", icon: "drop", text: "Gün boyu düzenli su iç; idrar rengin açık sarı olsun. Antrenman günlerinde biraz daha fazla." },
  { key: "sekersiz", title: "Şekerli içecek yok", icon: "x", text: "Bir hafta boyunca gazlı ve şekerli içecek, hazır meyve suyu yok. Su, maden suyu, şekersiz çay ve kahve serbest." },
  { key: "gunluk", title: "Her gün tartıl, kaydet", icon: "pulse", text: "Her sabah aç karnına tartıl ve Gelişim Günlüğüm'e kaydet. Haftalık ortalaman gerçeği söyleyecek." },
];
export const GOAL_DAYS = 5;

/** Türkiye saatine göre bugün ("YYYY-MM-DD") ve bu haftanın Pazartesi'si. */
export function todayTR(now = Date.now()) { return new Date(now + 3 * 3600e3).toISOString().slice(0, 10); }
export function weekStart(day) { const d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); }
export function addDays(day, n) { const d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
/** Haftanın meydan okuması: 2026-01-05 (Pazartesi) başlangıçlı hafta sayısına göre havuzdan sırayla. */
export function challengeFor(ws) {
  const n = Math.round((Date.parse(ws + "T00:00:00Z") - Date.parse("2026-01-05T00:00:00Z")) / (7 * 864e5));
  return POOL[((n % POOL.length) + POOL.length) % POOL.length];
}
