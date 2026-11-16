// Ödeme sağlayıcı katmanı. Alpvefit YALNIZ sanal POS (kart) ile ödeme alır; kart verisi bu sunucuya HİÇ uğramaz.
// Gerçek sağlayıcı (ör. iyzico, PayTR, Param) bağlanırken: sağlayıcının barındırdığı ödeme sayfasına yönlendirme + sunucudan sunucuya
// imzalı bildirim (webhook) ile markOrderPaid() çağrılır; bu dosyadaki arayüz o noktada genişletilir.
//
// Şimdilik: "mock" (SAHTE) sağlayıcı — test aşaması içindir. Gerçek para çekmez, kart bilgisi istemez; ödeme sayfasında yalnız
// "başarılı" / "reddedilen" test sonucu seçilir. Üretimde yalnız ALLOW_MOCK_PAYMENTS=true ile açılır (yanlışlıkla açık kalmasın diye).

/** Etkin sağlayıcı: "mock" | null (ödeme alınamaz). */
export function activeProvider(env = process.env) {
  const wanted = String(env.PAYMENT_PROVIDER || (env.NODE_ENV === "production" ? "" : "mock")).toLowerCase();
  if (wanted === "mock") return env.NODE_ENV === "production" && env.ALLOW_MOCK_PAYMENTS !== "true" ? null : "mock";
  return null;
}
export const isTestProvider = (p) => p === "mock";
