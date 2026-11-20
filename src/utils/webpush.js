// Web Push (telefona / masaüstüne bildirim) — dış kütüphane olmadan, RFC 8292 (VAPID) ile.
// Gizlilik: bildirim İÇERİK TAŞIMAZ (boş gövdeli itme). Hizmet çalışanı itmeyi alınca oturumla /api/push/latest'ten kısa
// metni kendisi çeker; böylece mesaj metni hiçbir zaman Google / Apple / Mozilla sunucularından geçmez.
// Güvenlik: yalnız bilinen itme hizmetlerinin adreslerine istek gönderilir (SSRF'e karşı izinli alan listesi).
import crypto from "node:crypto";
import { pool } from "../db/pool.js";
import { endpointAllowed, vapidJwt, b64u } from "./vapid.js";
export { endpointAllowed };

let keysP = null;
/** VAPID anahtarları: yoksa üretilir (aynı anda iki süreç üretirse ilk yazılan kalır). */
export function vapidKeys() {
  if (!keysP) keysP = (async () => {
    let r = (await pool.query(`SELECT public_key, private_pem FROM push_vapid WHERE id = 1`)).rows[0];
    if (!r) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
      const jwk = publicKey.export({ format: "jwk" });
      const raw = Buffer.concat([Buffer.from([4]), Buffer.from(jwk.x, "base64url"), Buffer.from(jwk.y, "base64url")]);
      await pool.query(`INSERT INTO push_vapid (id, public_key, private_pem) VALUES (1, $1, $2) ON CONFLICT (id) DO NOTHING`, [b64u(raw), privateKey.export({ format: "pem", type: "pkcs8" })]);
      r = (await pool.query(`SELECT public_key, private_pem FROM push_vapid WHERE id = 1`)).rows[0];
    }
    return { pub: r.public_key, key: crypto.createPrivateKey(r.private_pem) };
  })().catch((e) => { keysP = null; throw e; });
  return keysP;
}

const lastSent = new Map();   // userId → zaman: art arda olaylarda en çok 20 saniyede bir itme
const GAP_MS = 20000;

/** Kullanıcının tüm cihazlarına içeriksiz itme gönderir; geçersizleşen abonelikleri siler. */
export async function pushUser(userId, { force = false } = {}) {
  const now = Date.now();
  if (!force && now - (lastSent.get(String(userId)) || 0) < GAP_MS) return 0;
  lastSent.set(String(userId), now);
  if (lastSent.size > 5000) for (const [k, t] of lastSent) if (now - t > GAP_MS) lastSent.delete(k);
  const subs = (await pool.query(`SELECT id, endpoint FROM push_subscriptions WHERE user_id = $1`, [userId])).rows;
  if (!subs.length) return 0;
  const { pub, key } = await vapidKeys();
  let ok = 0;
  await Promise.all(subs.map(async (s) => {
    if (!endpointAllowed(s.endpoint)) { await pool.query(`DELETE FROM push_subscriptions WHERE id = $1`, [s.id]); return; }
    const aud = new URL(s.endpoint).origin;
    try {
      const r = await fetch(s.endpoint, { method: "POST", redirect: "error", signal: AbortSignal.timeout(8000),
        headers: { Authorization: `vapid t=${vapidJwt(aud, key)}, k=${pub}`, TTL: "86400", Urgency: "normal", "Content-Length": "0" } });
      if (r.status === 404 || r.status === 410) await pool.query(`DELETE FROM push_subscriptions WHERE id = $1`, [s.id]);
      else if (r.ok) { ok++; await pool.query(`UPDATE push_subscriptions SET last_ok_at = now(), fails = 0 WHERE id = $1`, [s.id]); }
      else await pool.query(`UPDATE push_subscriptions SET fails = fails + 1 WHERE id = $1`, [s.id]);
    } catch { await pool.query(`UPDATE push_subscriptions SET fails = fails + 1 WHERE id = $1`, [s.id]).catch(() => {}); }
  }));
  await pool.query(`DELETE FROM push_subscriptions WHERE user_id = $1 AND fails >= 10`, [userId]).catch(() => {});
  return ok;
}
