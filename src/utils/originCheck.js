// M-17 (4. bağımsız denetim, v4): Origin/Referer doğrulaması saf bir
// fonksiyona çıkarıldı — böylece requireAuth'un bağımlılıkları (jsonwebtoken,
// pg) olmadan GERÇEKTEN çalıştırılarak test edilebilir.
//
// Kurallar (M-02 + K11 ile aynı, davranış değişmedi):
//   - Origin başlığı varsa: origin'i FRONTEND_URL'in origin'iyle birebir eşit olmalı.
//   - Origin yok ama Referer varsa: new URL(referer).origin eşit olmalı
//     (ham startsWith DEĞİL — "site.app.attacker.com" önek saldırısı engellenir).
//   - İkisi de yoksa izin verilir (mobil/native istemciler bu başlıkları
//     göndermez; bu durumda korumayı CSRF double-submit token sağlar).
//
// v4 turunda eklenen sağlamlık: FRONTEND_URL de new URL(...).origin ile
// normalize edilir — sonunda "/" veya bir yol ile girilmişse ham karşılaştırma
// HER meşru isteği 403 ile reddederdi.
export function normalizeOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function isRequestOriginAllowed({ origin, referer, frontendUrl }) {
  if (!frontendUrl) return true; // yapılandırılmamışsa bu katman devre dışı (CSRF token yine zorunlu)
  const expected = normalizeOrigin(frontendUrl);
  if (!expected) return false; // bozuk yapılandırma → güvenli taraf: reddet
  if (origin) return origin === expected;
  if (referer) return normalizeOrigin(referer) === expected;
  return true;
}
