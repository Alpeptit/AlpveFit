// Paket kataloğu — TEK KAYNAK. Fiyat/süre/farmakoloji bilgisi yalnız buradan gelir; istemcinin gönderdiği fiyat HİÇBİR ZAMAN kullanılmaz.
// Fiyatlar tek para biriminde (CURRENCY) liste fiyatıdır; ödeme sanal POS (kart) ile alınır.
export const CURRENCY = "TRY";
export const PACKAGES = {
  starter:    { pharmacology: false, options: [{ weeks: 12, price: 4990 }, { weeks: 24, price: 8490 }] },
  advanced:   { pharmacology: true,  options: [{ weeks: 16, price: 7490 }, { weeks: 24, price: 10990 }] },
  competitor: { pharmacology: true,  options: [{ weeks: 12, price: 13990 }] },
};
export const PACKAGE_KEYS = Object.keys(PACKAGES);
export const PACKAGE_LABELS = { starter: "Başlangıç Paketi", advanced: "İleri Seviye Program", competitor: "Yarışmacı Paketi" };
export const PACKAGE_LABELS_EN = { starter: "Starter Package", advanced: "Advanced Program", competitor: "Competitor Package" };
/** Ödemeden sonra planların hazırlanma süresi (saat). */
export const PLAN_DELIVERY_HOURS = 24;
/** Üyeye ödemeyle açılan plan türleri. Farmakoloji yalnız farmakolojili paketlerde. */
export function kindsForPackage(key) {
  const p = PACKAGES[key];
  return p ? ["nutrition", "training", "supplement", ...(p.pharmacology ? ["pharmacology"] : []), "notes"] : [];
}
export function findOption(key, weeks) {
  const p = PACKAGES[key];
  return p ? p.options.find((o) => o.weeks === weeks) || null : null;
}
export const OPEN_STATUSES = ["pending"];
export const MAX_OPEN_UNPAID_ORDERS = 2;
export function paymentWindowHours() {
  const n = Number(process.env.PAYMENT_WINDOW_HOURS);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, 1), 168) : 2;
}
