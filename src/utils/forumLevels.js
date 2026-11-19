// Forum seviyeleri — etkinlik puanına göre otomatik; yönetici elle seviye verebilir (otomatik sistemden bağımsızdır).
// Moderatör ve Admin seviye değildir, yalnız ATAMA ile verilir (forum_role = moderator, users.role = admin).
//
// Puan = konu × 5 + mesaj × 2 + alınan beğeni × 3 − alınan beğenmeme × 2 − haklı bulunan şikâyet × 25
// (alt sınır 0). Şikâyet yalnız inceleme sonunda HAKLI bulunursa düşer; yapılan her şikâyet puanı etkilemez.
export const LEVELS = [
  { n: 1, name: "Yeni Başlayan", min: 0 },
  { n: 2, name: "Barın Çırağı", min: 50 },
  { n: 3, name: "Pump Avcısı", min: 150 },     // kullanıcılar arası mesajlaşma bu seviyede açılır
  { n: 4, name: "Demir Eri", min: 400 },
  { n: 5, name: "Hacim Ustası", min: 900 },
  { n: 6, name: "Sahne Savaşçısı", min: 1800 },
  { n: 7, name: "Demir Efsanesi", min: 3500 },
  { n: 8, name: "Ayna Tanrısı", min: 6000 },
];
export const MESSAGING_LEVEL = 3;

export function forumScore(p) {
  if (!p) return 0;
  const s = (p.topics || 0) * 5 + (p.posts || 0) * 2 + (p.likes || 0) * 3 - (p.dislikes || 0) * 2 - (p.reports_upheld || 0) * 25;
  return Math.max(0, s);
}
/** Kullanıcının forum unvanı: admin → "Admin", moderatör → "Moderatör", aksi hâlde elle verilen ya da puana göre seviye. */
export const HIDE_ONLINE_LEVEL = 3;   // çevrimiçi durumunu gizleme: Pump Avcısı ve üstü
export function forumLevel(p, role) {
  if (p && p.is_official) return { n: 11, name: "AlpveFit Ekibi", assigned: true, official: true };
  if (role === "admin") return { n: 10, name: "Admin", assigned: true };
  if (p && p.forum_role === "moderator") return { n: 9, name: "Moderatör", assigned: true };
  const score = forumScore(p);
  if (p && p.level_override) { const l = LEVELS[p.level_override - 1]; return { n: l.n, name: l.name, manual: true, score }; }
  let cur = LEVELS[0];
  for (const l of LEVELS) if (score >= l.min) cur = l;
  return { n: cur.n, name: cur.name, score };
}

/** Üyeye gösterilecek seviye bilgisi: yalnız ad ve sıra. Puan, eşik ve seviyenin elle mi verildiği DIŞARI verilmez
 *  (seviye atlama mantığı görünmez; elle verilen seviye yalnız denetim kaydında görülür). */
export function publicLevel(l) { return { n: l.n, name: l.name, assigned: !!l.assigned, official: !!l.official }; }
