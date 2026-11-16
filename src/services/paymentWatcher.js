import axios from "axios";
import { pool } from "../db/pool.js";
import { DEFAULT_MIN_CONFIRMATIONS, USDT_TRC20_CONTRACT, isGenuineUsdtTransfer, pickMismatchCandidate, confirmationsFromInfo } from "./paymentDecision.js";
import { createTronRpc, httpTransport, isValidTronAddress } from "./tronRpc.js";
import { markOrderPaid, expireDueOrders } from "./orderFulfilment.js";
import { logAudit } from "../utils/auditLog.js";

// Zincir izleme — Alpeptit ile AYNI yöntem: gelen USDT-TRC20 transferleri tutara (benzersiz kuruş ekiyle) göre siparişe eşlenir,
// KESİNLEŞMİŞ (solidified) onay sayısı ≥ MIN_CONFIRMATIONS olunca sipariş 'paid' olur. TRON_RPC_URL varsa JSON-RPC, yoksa TronGrid.
// Eksik/fazla tutar otomatik onaylanmaz: 'flagged' (yönetici incelemesi). Eşleşmeyen transfer kayda alınır.
const rpcEnabled = () => !!process.env.TRON_RPC_URL;
let rpcClient = null, rpcUrl = null;
const getRpc = () => {
  if (!rpcClient || rpcUrl !== process.env.TRON_RPC_URL) {
    rpcClient = createTronRpc(httpTransport(process.env.TRON_RPC_URL), { maxRange: Number(process.env.TRON_RPC_MAX_BLOCK_RANGE || 1000) });
    rpcUrl = process.env.TRON_RPC_URL;
  }
  return rpcClient;
};
const CURSOR_KEY = "tron_rpc_cursor", TOL = 0.000005, TIMEOUT = 10000, MAX_PAGES = 5, LOOKBACK_MS = 24 * 3600 * 1000;
const LOCK = "774410259014";
const hdr = () => ({ "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY });

async function getCursor() { const { rows } = await pool.query(`SELECT value FROM chain_scan_state WHERE key = $1`, [CURSOR_KEY]); return rows.length ? Number(rows[0].value) : null; }
async function setCursor(block) {
  await pool.query(`INSERT INTO chain_scan_state (key, value, updated_at) VALUES ($1,$2,now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now() WHERE chain_scan_state.value::bigint < EXCLUDED.value::bigint`, [CURSOR_KEY, String(block)]);
}
async function trackedAddresses() {
  const out = new Set(); if (process.env.TRON_WALLET_ADDRESS) out.add(process.env.TRON_WALLET_ADDRESS);
  const { rows } = await pool.query(`SELECT DISTINCT payment_address FROM orders WHERE payment_address IS NOT NULL AND status IN ('pending','payment_review','flagged')`);
  rows.forEach((r) => out.add(r.payment_address));
  return [...out].filter(isValidTronAddress);
}
async function fetchIncoming(wallet) {
  const out = []; let fp;
  for (let i = 0; i < MAX_PAGES; i++) {
    const { data } = await axios.get(`https://api.trongrid.io/v1/accounts/${wallet}/transactions/trc20`, {
      params: { limit: 50, contract_address: USDT_TRC20_CONTRACT, only_to: true, min_timestamp: Date.now() - LOOKBACK_MS, ...(fp ? { fingerprint: fp } : {}) }, headers: hdr(), timeout: TIMEOUT });
    out.push(...(data.data || [])); fp = data.meta && data.meta.fingerprint;
    if (!fp || !(data.data || []).length) break;
  }
  return out.filter((t) => isGenuineUsdtTransfer(t, wallet));
}
let confirmationProvider = null;
/** YALNIZ test: zincir çağrısı yerine verilen işlevi kullanır. */
export function _setConfirmationProvider(fn) { confirmationProvider = fn; }
async function confirmationCount(txHash) {
  if (confirmationProvider) return confirmationProvider(txHash);
  if (rpcEnabled()) return getRpc().confirmationCount(txHash);
  const { data } = await axios.post("https://api.trongrid.io/walletsolidity/gettransactioninfobyid", { value: txHash }, { headers: hdr(), timeout: TIMEOUT });
  if (!data?.blockNumber) return 0;
  const { data: now } = await axios.post("https://api.trongrid.io/wallet/getnowblock", {}, { headers: hdr(), timeout: TIMEOUT });
  return confirmationsFromInfo(data, now?.block_header?.raw_data?.number || 0);
}

export async function processTransaction(tx) {
  const amount = Number(tx.value) / 1e6, txHash = tx.transaction_id;
  if ((await pool.query(`SELECT 1 FROM orders WHERE tx_hash = $1`, [txHash])).rows.length) return;
  const at = tx.block_timestamp ? new Date(Number(tx.block_timestamp)) : new Date();
  const dflt = process.env.TRON_WALLET_ADDRESS || "";
  const { rows } = await pool.query(
    `SELECT id, order_number FROM orders WHERE status = 'pending' AND ABS(expected_amount - $1) < $2 AND created_at <= $3 AND COALESCE(payment_address, $4) = $5 ORDER BY created_at LIMIT 1`,
    [amount, TOL, at, dflt, tx.to]);
  const order = rows[0];
  if (!order) {
    const near = await pool.query(
      `SELECT id, order_number, expected_amount FROM orders WHERE status = 'pending' AND tx_hash IS NULL AND created_at <= $2
         AND ABS(expected_amount - $1) <= GREATEST(1, expected_amount * 0.05) AND COALESCE(payment_address, $3) = $4 ORDER BY ABS(expected_amount - $1) LIMIT 5`,
      [amount, at, dflt, tx.to]);
    const pick = pickMismatchCandidate(amount, near.rows);
    if (pick.candidate) {
      await pool.query(`INSERT INTO unmatched_transactions (tx_hash, amount, from_address, possible_order_id, reason) VALUES ($1,$2,$3,$4,'amount_mismatch_flagged') ON CONFLICT (tx_hash) DO NOTHING`, [txHash, amount, tx.from || null, pick.candidate.id]);
      await pool.query(`UPDATE orders SET status = 'flagged', tx_hash = $2, from_address = $3, updated_at = now() WHERE id = $1 AND status = 'pending' AND tx_hash IS NULL`, [pick.candidate.id, txHash, tx.from || null]);
    } else {
      await pool.query(`INSERT INTO unmatched_transactions (tx_hash, amount, from_address, reason) VALUES ($1,$2,$3,$4) ON CONFLICT (tx_hash) DO NOTHING`, [txHash, amount, tx.from || null, pick.ambiguous ? "ambiguous_amount" : "no_matching_order"]);
    }
    return;
  }
  const conf = await confirmationCount(txHash);
  if (conf < DEFAULT_MIN_CONFIRMATIONS) {
    await pool.query(`UPDATE orders SET status = 'payment_review', tx_hash = $2, confirmations = $3, from_address = $4, updated_at = now() WHERE id = $1 AND status = 'pending'`, [order.id, txHash, conf, tx.from || null]);
    return;
  }
  await markOrderPaid(order.id, { txHash, confirmations: conf, fromAddress: tx.from || null, source: "chain_watcher" });
}

/** payment_review'daki siparişlerin onay sayısını yeniden sorgular; yeterliyse onaylar. */
export async function recheckReviewOrders() {
  const { rows } = await pool.query(`SELECT id, tx_hash FROM orders WHERE status = 'payment_review' AND tx_hash IS NOT NULL`);
  for (const o of rows) {
    const conf = await confirmationCount(o.tx_hash);
    if (conf >= DEFAULT_MIN_CONFIRMATIONS) await markOrderPaid(o.id, { confirmations: conf, source: "chain_watcher_recheck" });
    else await pool.query(`UPDATE orders SET confirmations = $2, updated_at = now() WHERE id = $1`, [o.id, conf]);
  }
}

export async function runPaymentCheck() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT pg_try_advisory_lock($1) AS ok`, [LOCK]);
    if (!rows[0].ok) return;
    try {
      await expireDueOrders().catch(() => {});
      if (!process.env.TRON_WALLET_ADDRESS) return;
      const addresses = await trackedAddresses();
      if (rpcEnabled()) await getRpc().scanIncoming({ addresses, getCursor, setCursor, onBatch: async (txs) => { for (const tx of txs) await processTransaction(tx); } });
      else for (const w of addresses) for (const tx of await fetchIncoming(w)) await processTransaction(tx);
      await recheckReviewOrders();
    } catch (e) { console.error("[payment-watcher] kontrol hatası:", e.message); }
  } finally { await client.query(`SELECT pg_advisory_unlock($1)`, [LOCK]).catch(() => {}); client.release(); }
}

export function startPaymentWatcher() {
  const minutes = Math.max(1, Number(process.env.PAYMENT_CHECK_INTERVAL_MINUTES || 2));
  console.log(`[payment-watcher] başlatıldı — her ${minutes} dk (${rpcEnabled() ? "JSON-RPC" : "TronGrid"}).`);
  setInterval(runPaymentCheck, minutes * 60 * 1000).unref();
  setTimeout(runPaymentCheck, 5000).unref();
}
