// M-08 (4. bağımsız denetim, v4) düzeltmesi: DB TLS sertifika doğrulaması
// artık production'da VARSAYILAN OLARAK ZORUNLU.
//
// ÖNCEDEN: DB_CA_CERT yoksa SESSİZCE rejectUnauthorized:false kullanılıyordu
// — trafik şifreli ama sunucu kimliği doğrulanmıyordu (MITM riski), ve bu
// durum hiçbir yerde görünür değildi.
//
// ARTIK production'da üç durum var:
//   1) DB_CA_CERT var  → rejectUnauthorized:true + CA sabitleme (önerilen).
//   2) DB_CA_CERT yok ama DB_SSL_ALLOW_UNVERIFIED=true → şifreli ama
//      doğrulamasız bağlantıya İZİN verilir; bu, operatörün riski BİLEREK
//      ve AÇIKÇA kabul ettiği anlamına gelir ve her açılışta uyarı loglanır.
//      (Sağlayıcının CA sertifikası henüz edinilmemişken geçici kullanım için.)
//   3) İkisi de yok → hata: sunucu/migration BAŞLAMAZ (fail-closed).
// Geliştirme ortamında (NODE_ENV != production) SSL kapalıdır.
//
// Saf bir fonksiyon olarak ayrıldı ki pg kurulu olmadan da gerçekten
// çalıştırılarak test edilebilsin.
export function resolveDbSslConfig(env) {
  const isProduction = env.NODE_ENV === "production";
  if (!isProduction) return { ssl: false, warning: null, error: null };

  if (env.DB_CA_CERT && env.DB_CA_CERT.trim()) {
    // v65: Railway PostgreSQL sertifikası kendi kök CA'sıyla imzalıdır ve SAN'ında YALNIZCA "localhost" bulunur
    // (postgres.railway.internal yok). Bu yüzden tam doğrulama (zincir + ana makine adı) bağlanamaz. Operatör
    // DB_SSL_SKIP_HOSTNAME_CHECK=true derse zincir YİNE kök CA'ya karşı doğrulanır (sabitlenmiş CA ≈ verify-ca),
    // yalnızca ana makine adı eşleşmesi atlanır. Varsayılan: tam doğrulama. CA yokken bu bayrak etkisizdir.
    if (env.DB_SSL_SKIP_HOSTNAME_CHECK === "true") {
      return {
        ssl: { rejectUnauthorized: true, ca: env.DB_CA_CERT, checkServerIdentity: () => undefined },
        warning: "[db] BİLGİ: veritabanı sertifika zinciri DB_CA_CERT'e karşı doğrulanıyor; ana makine adı eşleşmesi atlanıyor (DB_SSL_SKIP_HOSTNAME_CHECK=true).",
        error: null,
      };
    }
    return { ssl: { rejectUnauthorized: true, ca: env.DB_CA_CERT }, warning: null, error: null };
  }
  if (env.DB_SSL_ALLOW_UNVERIFIED === "true") {
    return {
      ssl: { rejectUnauthorized: false },
      warning: "[db] UYARI: DB_CA_CERT tanımlı değil ve DB_SSL_ALLOW_UNVERIFIED=true — veritabanı bağlantısı şifreli ama sunucu sertifikası DOĞRULANMIYOR (MITM riski). Sağlayıcının CA sertifikasını DB_CA_CERT olarak ekleyip bu bayrağı kaldırın.",
      error: null,
    };
  }
  return {
    ssl: null,
    warning: null,
    error: "[db] HATA: Production ortamında DB_CA_CERT tanımlı değil. Güvenli veritabanı bağlantısı için sağlayıcının CA sertifikasını DB_CA_CERT olarak ekleyin. (Riski bilerek kabul ediyorsanız ve CA henüz yoksa geçici olarak DB_SSL_ALLOW_UNVERIFIED=true ayarlayabilirsiniz.)",
  };
}
