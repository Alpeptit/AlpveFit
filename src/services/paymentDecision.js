// Ödeme durumu geçiş kararının SAF mantığı. Kasıtlı olarak hiçbir dış paket
// (axios, pg, node-cron) import etmez — bu sayede regresyon testleri hızlı,
// güvenilir ve hiçbir ağ/veritabanı bağlantısı gerektirmeden çalışır.

export const DEFAULT_MIN_CONFIRMATIONS = Number(process.env.MIN_CONFIRMATIONS || 19);

/**
 * K1 düzeltmesinin kalbi: bir siparişin şu anki onay sayısına göre hangi
 * duruma geçmesi gerektiğine karar verir. Eşik değerine ULAŞILDIĞINDA
 * (>=) onaylanmış sayılır — eşiğin altında kalırsa payment_review'da kalır.
 */
export function decideOrderStatusFromConfirmations(confirmations, minRequired = DEFAULT_MIN_CONFIRMATIONS) {
  return confirmations >= minRequired ? "payment_confirmed" : "payment_review";
}

// ---------------- v24 ödeme denetimi: saf yardımcılar (ağ/DB yok, doğrudan test edilir) ----------------
export const USDT_TRC20_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // resmi USDT (TRC20) kontratı

/**
 * Gelen kaydın GERÇEKTEN bizim cüzdanımıza gelen resmi USDT-TRC20 transferi olduğunu doğrular.
 * TronGrid sorgu parametreleri (contract_address, only_to) zaten filtreler — bu, sahte "USDT" adlı
 * token'lara ve API'nin bir parametreyi yok saydığı duruma karşı İKİNCİ savunma hattıdır.
 */
export function isGenuineUsdtTransfer(tx, wallet) {
  if (!tx || !wallet) return false;
  const contract = tx.token_info && tx.token_info.address;
  const decimals = tx.token_info && Number(tx.token_info.decimals);
  return contract === USDT_TRC20_CONTRACT && (Number.isNaN(decimals) || decimals === 6) && tx.to === wallet
    && typeof tx.transaction_id === "string" && /^[0-9a-f]{64}$/i.test(tx.transaction_id)
    && /^\d+$/.test(String(tx.value)) && Number(tx.value) > 0 && (!tx.type || tx.type === "Transfer");
}

/**
 * Tam eşleşme yoksa: eksik/fazla ödeme için OLASI siparişi seç.
 * ÖNCEDEN: tam sayı kısmı aynı olan EN ESKİ sipariş seçiliyordu → ~27 USDT'lik birçok bekleyen
 * siparişte ödeme yanlış siparişe "flagged" yazılabiliyordu.
 * ŞİMDİ: en yakın tutar; fark ≤ max(1 USDT, %5); en yakın iki aday eşit uzaklıktaysa (belirsiz) seçim YOK.
 * @param amount gelen tutar; @param candidates [{id, expected_amount}]
 * @returns {candidate|null, diff, ambiguous}
 */
export function pickMismatchCandidate(amount, candidates) {
  const a = Number(amount);
  const list = (candidates || []).map((c) => ({ c, d: Math.abs(Number(c.expected_amount) - a) }))
    .filter((x) => x.d <= Math.max(1, Number(x.c.expected_amount) * 0.05))
    .sort((x, y) => x.d - y.d);
  if (list.length === 0) return { candidate: null, diff: null, ambiguous: false };
  if (list.length > 1 && Math.abs(list[0].d - list[1].d) < 1e-6) return { candidate: null, diff: null, ambiguous: true };
  return { candidate: list[0].c, diff: Number((a - Number(list[0].c.expected_amount)).toFixed(6)), ambiguous: false };
}

/** İşlem makbuzu: yalnız başarılı (SUCCESS) yürütmeler sayılır; makbuz yoksa blok numarası esas alınır. */
export function confirmationsFromInfo(info, currentHeight) {
  if (!info || !info.blockNumber) return 0;
  const r = info.receipt && info.receipt.result;
  if (r && r !== "SUCCESS") return 0;
  if (info.result && info.result === "FAILED") return 0;
  return Math.max(0, Number(currentHeight || 0) - Number(info.blockNumber));
}
