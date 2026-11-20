// Web Push (VAPID): yalnız bilinen itme hizmetlerine istek (SSRF koruması) ve geçerli ES256 imzalı JWT.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { endpointAllowed, vapidJwt } from "../src/utils/vapid.js";

test("yalnız bilinen itme hizmetlerinin https adresleri kabul edilir", () => {
  for (const ok of ["https://fcm.googleapis.com/fcm/send/abc", "https://web.push.apple.com/QGx", "https://updates.push.services.mozilla.com/wpush/v2/x", "https://wns2-par02p.notify.windows.com/w/?token=1"])
    assert.ok(endpointAllowed(ok), ok);
  for (const bad of ["http://fcm.googleapis.com/x", "https://fcm.googleapis.com:8443/x", "https://evil.com/fcm.googleapis.com", "https://fcm.googleapis.com.evil.com/x",
    "https://push.apple.com.evil.io/x", "https://127.0.0.1/x", "https://localhost/x", "https://169.254.169.254/latest", "javascript:alert(1)", "", "not a url"])
    assert.ok(!endpointAllowed(bad), bad);
});

test("VAPID JWT: ES256 imzası açık anahtarla doğrulanır; aud, exp ve sub doğru", () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const t = vapidJwt("https://fcm.googleapis.com", privateKey);
  const [h, b, s] = t.split(".");
  assert.deepEqual(JSON.parse(Buffer.from(h, "base64url")), { typ: "JWT", alg: "ES256" });
  const c = JSON.parse(Buffer.from(b, "base64url"));
  assert.equal(c.aud, "https://fcm.googleapis.com");
  assert.match(c.sub, /^mailto:/);
  assert.ok(c.exp > Date.now() / 1000 && c.exp <= Date.now() / 1000 + 24 * 3600);
  assert.ok(crypto.verify("sha256", Buffer.from(h + "." + b), { key: publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(s, "base64url")));
});
