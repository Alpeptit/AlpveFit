// VAPID (RFC 8292) yardımcıları: veritabanına bağlı olmayan saf işlevler (birim testleri için ayrı dosyada).
import crypto from "node:crypto";

const PUSH_HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /^[a-z0-9.-]*\.push\.apple\.com$/, /^[a-z0-9.-]*\.notify\.windows\.com$/, /^[a-z0-9.-]*\.push\.services\.mozilla\.com$/];
const SUBJECT = "mailto:destek@alpvefit.com";
export const b64u = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export function endpointAllowed(endpoint) {
  try { const u = new URL(endpoint); return u.protocol === "https:" && !u.port && PUSH_HOSTS.some((re) => re.test(u.hostname)); } catch { return false; }
}

export function vapidJwt(aud, key) {
  const head = b64u(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const body = b64u(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SUBJECT }));
  const sig = crypto.sign("sha256", Buffer.from(head + "." + body), { key, dsaEncoding: "ieee-p1363" });
  return head + "." + body + "." + b64u(sig);
}

