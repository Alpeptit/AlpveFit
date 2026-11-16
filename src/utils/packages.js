// Paket kataloğu — TEK KAYNAK. Fiyat/süre/farmakoloji bilgisi yalnız buradan gelir; istemcinin gönderdiği fiyat HİÇBİR ZAMAN kullanılmaz.
// Fiyatlar USD cinsindendir ve USDT (TRC20) ile birebir ödenir (1 USD = 1 USDT).
export const PACKAGES = {
  starter:    { pharmacology: false, options: [{ weeks: 12, price: 149 }, { weeks: 24, price: 249 }] },
  advanced:   { pharmacology: true,  options: [{ weeks: 16, price: 229 }, { weeks: 24, price: 329 }] },
  competitor: { pharmacology: true,  options: [{ weeks: 12, price: 399 }] },
};
export const PACKAGE_KEYS = Object.keys(PACKAGES);
export const PACKAGE_LABELS = { starter: "Başlangıç Paketi", advanced: "İleri Seviye Program", competitor: "Yarışmacı Paketi" };
export const PACKAGE_LABELS_EN = { starter: "Starter Package", advanced: "Advanced Program", competitor: "Competitor Package" };
/** Yüz yüze eğitim paketi satılmaz; yalnız bu adrese yönlendirilir. */
export const IN_PERSON_CONTACT = "destek@alpvefit.com";
/** Kripto ödemede sabit indirim — SUNUCUDA uygulanır. */
export const CRYPTO_DISCOUNT_RATE = 0.05;
/** Ödemeden sonra planların hazırlanma süresi (gün). */
export const PLAN_DELIVERY_DAYS = 7;
/** Üyeye ödemeyle açılan plan türleri. Farmakoloji yalnız farmakolojili paketlerde. */
export function kindsForPackage(key) {
  const p = PACKAGES[key];
  return p ? ["nutrition", "training", "supplement", ...(p.pharmacology ? ["pharmacology"] : [])] : [];
}
export function findOption(key, weeks) {
  const p = PACKAGES[key];
  return p ? p.options.find((o) => o.weeks === weeks) || null : null;
}
export function cryptoPrice(listPrice) { return Math.round(Number(listPrice) * (1 - CRYPTO_DISCOUNT_RATE) * 100) / 100; }
export const OPEN_STATUSES = ["pending", "payment_review", "flagged"];
export const MAX_OPEN_UNPAID_ORDERS = 2;
export function paymentWindowHours() {
  const n = Number(process.env.PAYMENT_WINDOW_HOURS);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, 1), 168) : 24;
}
