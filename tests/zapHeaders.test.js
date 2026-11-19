// OWASP ZAP bulguları (2026-11): API yanıtlarının CSP'si joker kaynak içermez; Permissions-Policy tüm yanıtlarda yazılır.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const srv = readFileSync(new URL("../src/server.js", import.meta.url), "utf8");
test("API CSP: helmet varsayılanları kullanılmaz, joker (https:) kaynak yok, betik kapalı", () => {
  const seg = srv.slice(srv.indexOf("contentSecurityPolicy: {"), srv.indexOf("hsts:"));
  assert.match(seg, /useDefaults: false/);
  assert.match(seg, /scriptSrc: \["'none'"\]/);
  assert.match(seg, /baseUri: \["'none'"\]/);
  assert.equal(/"https:"/.test(seg), false);
});
test("Permissions-Policy tüm yanıtlarda", () => {
  assert.match(srv, /app\.use\(\(req, res, next\) => \{ res\.setHeader\("Permissions-Policy", "camera=\(\), microphone=\(\), geolocation=\(\), payment=\(\)"\); next\(\); \}\);/);
});
