// v37 — TRON JSON-RPC sağlayıcısı (DRPC, TronGrid /jsonrpc veya kendi düğümünüz — TRON_RPC_URL ile seçilir).
//
// NEDEN: TronGrid'in "adrese gelen TRC20 transferleri" uç noktası (/v1/accounts/.../transactions/trc20) TronGrid'e ÖZELDİR;
// standart TRON düğümlerinde (ve DRPC gibi genel RPC sağlayıcılarda) yoktur. Aynı bilgi standart JSON-RPC ile `eth_getLogs`
// (USDT kontratının Transfer olayı, alıcı = bizim adres) üzerinden okunur. Bu modül yalnız standart `eth_*` yöntemlerini kullanır:
//   eth_blockNumber, eth_getLogs, eth_getBlockByNumber, eth_getTransactionReceipt.
//
// SAF mantık (adres dönüşümü, log ayrıştırma, parça parça tarama) ağ ve veritabanından BAĞIMSIZDIR: istek göndericisi (transport)
// ve imleç (cursor) dışarıdan verilir → testlerde sahte verilerle çalıştırılır. API anahtarı URL içinde olabilir; ASLA günlüğe yazılmaz.
import crypto from "crypto";

export const USDT_TRC20_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
// keccak256("Transfer(address,address,uint256)") — ERC-20/TRC-20 Transfer olayının imzası
export const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const sha256 = (b) => crypto.createHash("sha256").update(b).digest();

/** Base58Check çöz → 21 baytlık TRON adresi (0x41 + 20 bayt). Geçersizse null. */
export function decodeTronAddress(addr) {
  if (typeof addr !== "string" || addr.length !== 34 || addr[0] !== "T") return null;
  let n = 0n;
  for (const ch of addr) { const i = B58.indexOf(ch); if (i < 0) return null; n = n * 58n + BigInt(i); }
  const hex = n.toString(16).padStart(50, "0");
  if (hex.length !== 50) return null;
  const buf = Buffer.from(hex, "hex");
  const payload = buf.subarray(0, 21), check = buf.subarray(21);
  if (payload[0] !== 0x41) return null;
  if (!sha256(sha256(payload)).subarray(0, 4).equals(check)) return null;
  return payload;
}
export const isValidTronAddress = (addr) => decodeTronAddress(addr) !== null;

/** 20 baytlık hex (0x'li/0x'siz) → TRON base58 adresi. */
export function hex20ToTronAddress(hex20) {
  const h = String(hex20).replace(/^0x/i, "").toLowerCase().slice(-40);
  if (!/^[0-9a-f]{40}$/.test(h)) return null;
  const payload = Buffer.concat([Buffer.from([0x41]), Buffer.from(h, "hex")]);
  const full = Buffer.concat([payload, sha256(sha256(payload)).subarray(0, 4)]);
  let n = BigInt("0x" + full.toString("hex")), out = "";
  while (n > 0n) { out = B58[Number(n % 58n)] + out; n /= 58n; }
  return out.padStart(1, "1");
}
/** TRON adresi → 20 baytlık küçük harf hex (0x'li) — eth_getLogs "address" alanı. */
export function tronAddressToHex20(addr) {
  const p = decodeTronAddress(addr);
  return p ? "0x" + p.subarray(1).toString("hex") : null;
}
/** TRON adresi → 32 baytlık konu (topic) değeri — olay kaydındaki indekslenmiş alıcı/gönderen. */
export function tronAddressToTopic(addr) {
  const h = tronAddressToHex20(addr);
  return h ? "0x" + "0".repeat(24) + h.slice(2) : null;
}

const toHex = (n) => "0x" + BigInt(n).toString(16);
const fromHex = (h) => Number(BigInt(h));
const stripHash = (h) => String(h).replace(/^0x/i, "").toLowerCase();

/**
 * Bir olay kaydını (log) TronGrid biçimindeki işleme çevirir; böylece cryptoWatcher'ın geri kalanı (isGenuineUsdtTransfer,
 * processTransaction) HİÇ değişmeden çalışır. Resmi USDT kontratı + Transfer imzası + izlenen alıcı değilse null döner.
 */
export function logToTransfer(log, trackedByTopic, blockTimestampMs) {
  if (!log || log.removed) return null;
  const topics = log.topics || [];
  if (topics.length < 3 || String(topics[0]).toLowerCase() !== TRANSFER_TOPIC) return null;
  if (String(log.address || "").toLowerCase().replace(/^0x/, "") !== tronAddressToHex20(USDT_TRC20_CONTRACT).slice(2)) return null;
  const to = trackedByTopic.get(String(topics[2]).toLowerCase());
  if (!to) return null;
  const txid = stripHash(log.transactionHash);
  if (!/^[0-9a-f]{64}$/.test(txid)) return null;
  let value;
  try { value = BigInt(log.data && log.data !== "0x" ? log.data : "0x0"); } catch { return null; }
  if (value <= 0n) return null;
  return {
    transaction_id: txid, value: value.toString(), type: "Transfer",
    from: hex20ToTronAddress(topics[1]), to,
    token_info: { address: USDT_TRC20_CONTRACT, decimals: 6 },
    block_timestamp: blockTimestampMs, _block: fromHex(log.blockNumber),
  };
}
const topicMap = (addresses) => new Map(addresses.map((a) => [tronAddressToTopic(a), a]).filter(([t]) => t));

/** Düğüm "blok aralığı çok geniş" derse aralığı yarıya indirmek için ipucu. */
const RANGE_ERR = /range|limit|exceed|too (many|large|big)|maximum|10000|5000|query returned more/i;

/**
 * İstemci. transport(method, params) → JSON-RPC "result" değeri (hata fırlatır).
 * Hata iletileri URL/anahtar içermez (sanitize transport'ta yapılır).
 */
export function createTronRpc(transport, { maxRange = 1000, minRange = 50 } = {}) {
  let range = maxRange;
  const blockTsCache = new Map();

  async function latestBlock() { return fromHex(await transport("eth_blockNumber", [])); }

  async function blockTimestampMs(blockNumber) {
    if (blockTsCache.has(blockNumber)) return blockTsCache.get(blockNumber);
    const b = await transport("eth_getBlockByNumber", [toHex(blockNumber), false]);
    let t = b && b.timestamp != null ? fromHex(b.timestamp) : null;
    if (t === null) throw new Error("blok zaman damgası alınamadı");
    if (t < 1e12) t *= 1000;                 // saniye → ms (düğüm sürümüne göre ikisi de görülebilir)
    if (blockTsCache.size > 500) blockTsCache.clear();
    blockTsCache.set(blockNumber, t);
    return t;
  }

  async function getLogs(from, to, addresses) {
    const topics = [TRANSFER_TOPIC, null, addresses.map(tronAddressToTopic)];
    return transport("eth_getLogs", [{ fromBlock: toHex(from), toBlock: toHex(to), address: tronAddressToHex20(USDT_TRC20_CONTRACT), topics }]);
  }

  /**
   * (cursor+1 … en son blok) aralığını parça parça tarar; her parçanın işlemleri onBatch(txs) ile işlenir ve
   * onBatch BAŞARILI olursa imleç ilerler (hata olursa aynı parça bir sonraki turda yeniden taranır — kayıp yok).
   * cursor yoksa lookbackBlocks kadar geriden başlanır. maxChunks tur başına sınır koyar (ilk açılışta yük dağılsın).
   */
  async function scanIncoming({ addresses, getCursor, setCursor, onBatch, lookbackBlocks = 60000, maxChunks = 80 }) {
    const tracked = addresses.filter(isValidTronAddress);
    if (!tracked.length) return { scanned: 0, found: 0 };
    const map = topicMap(tracked);
    const latest = await latestBlock();
    const cur = await getCursor();
    let from = cur === null || cur === undefined ? Math.max(0, latest - lookbackBlocks) : Number(cur) + 1;
    if (latest - from > lookbackBlocks) from = latest - lookbackBlocks;   // çok uzun kesinti: ödeme penceresinden eskiyi tarama
    let scanned = 0, found = 0, chunks = 0;
    while (from <= latest && chunks < maxChunks) {
      const to = Math.min(latest, from + range - 1);
      let logs;
      try { logs = await getLogs(from, to, tracked); }
      catch (err) {
        if (RANGE_ERR.test(String(err && err.message)) && range > minRange) { range = Math.max(minRange, Math.floor(range / 2)); continue; }
        throw err;
      }
      const txs = [];
      for (const lg of logs || []) {
        const ts = await blockTimestampMs(fromHex(lg.blockNumber));
        const tx = logToTransfer(lg, map, ts);
        if (tx) txs.push(tx);
      }
      if (txs.length) await onBatch(txs);
      await setCursor(to);
      found += txs.length; scanned += to - from + 1; chunks++;
      from = to + 1;
    }
    return { scanned, found, latest };
  }

  /** İşlemin onay sayısı: başarılı + (en son blok − işlem bloğu + 1). Başarısız/bulunamayan işlem 0. */
  async function confirmationCount(txHash) {
    const rc = await transport("eth_getTransactionReceipt", ["0x" + stripHash(txHash)]);
    if (!rc || rc.status !== "0x1" || !rc.blockNumber) return 0;
    const latest = await latestBlock();
    return Math.max(0, latest - fromHex(rc.blockNumber) + 1);
  }

  /** Makbuzdan, bu işlemin `address` adresine giden gerçek USDT transferi olduğunu doğrular (yönetici elle onayı için). */
  async function transferFromReceipt(txHash, address) {
    const rc = await transport("eth_getTransactionReceipt", ["0x" + stripHash(txHash)]);
    if (!rc) return { found: false };
    if (rc.status !== "0x1") return { found: true, failed: true };
    const map = topicMap([address]);
    for (const lg of rc.logs || []) {
      const tx = logToTransfer({ ...lg, transactionHash: lg.transactionHash || rc.transactionHash, blockNumber: lg.blockNumber || rc.blockNumber }, map, null);
      if (tx) return { found: true, amount: Number(tx.value) / 1e6, from: tx.from, to: tx.to };
    }
    return { found: true, noTransfer: true };
  }

  return { latestBlock, scanIncoming, confirmationCount, transferFromReceipt, get range() { return range; } };
}

/** Gerçek ağ iletişimi: JSON-RPC 2.0 (axios, yavaş yüklenir — saf testler axios gerektirmez). URL/anahtar hatalara SIZMAZ. */
export function httpTransport(url, { timeoutMs = 10000 } = {}) {
  let id = 0;
  const clean = (s) => String(s || "").split(url).join("[RPC_URL]");
  return async function call(method, params) {
    const { default: axios } = await import("axios");
    let data;
    try {
      ({ data } = await axios.post(url, { jsonrpc: "2.0", id: ++id, method, params }, { timeout: timeoutMs, headers: { "Content-Type": "application/json" } }));
    } catch (err) {
      const st = err && err.response && err.response.status;
      const msg = err && err.response && err.response.data && err.response.data.error && err.response.data.error.message;
      throw new Error(`RPC ${method} başarısız${st ? " (HTTP " + st + ")" : ""}: ${clean(msg || err.code || err.message)}`.slice(0, 300));
    }
    if (data && data.error) throw new Error(`RPC ${method} hata: ${clean(data.error.message || data.error.code)}`.slice(0, 300));
    return data ? data.result : null;
  };
}
