// Güvenlik denetimleri (kaynak düzeyi): sayfa CSP'si, ölçüm uçlarının sınırları, yönetim panelinde HTML'in canlı sayfaya yazılmaması.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");

test("CSP: satır içi betik ve olay işleyicisi çalışmaz; uzman sayfası da aynı başlıklarla sunulur", () => {
  const site = read("src/site.js"), SITE_CSP = site.slice(site.indexOf("export const SITE_CSP"), site.indexOf('].join("; ")'));
  const script = SITE_CSP.split("\n").find((d) => d.includes('"script-src'));
  assert.ok(script); assert.doesNotMatch(script, /unsafe-inline|unsafe-eval|\*/);
  assert.match(SITE_CSP, /object-src 'none'/); assert.match(SITE_CSP, /frame-ancestors 'none'/); assert.match(SITE_CSP, /base-uri 'self'/);
  const ux = site.slice(site.indexOf('app.get(["/uzman", "/uzman/*"]'), site.indexOf("res.sendFile(expertPage)"));
  assert.match(ux, /panelUser\(req\)/); assert.match(ux, /htmlHeaders\(res\)/);   // uzman sayfası: yalnız panel rolü, aynı CSP
});

test("ölçüm uçları: gövde 1-2 KB ile sınırlı, düz metin, kendi hız sınırı var", () => {
  const a = read("src/routes/analytics.js"), s = read("src/server.js");
  assert.match(a, /"\/analytics\/hit", express\.text\(\{ type: "text\/plain", limit: "2kb" \}\)/);
  assert.match(a, /"\/analytics\/event", express\.text\(\{ type: "text\/plain", limit: "1kb" \}\)/);
  assert.match(s, /app\.use\("\/api\/analytics\/event", rateLimit\(/);
  assert.match(s, /app\.use\("\/api\/analytics\/hit", rateLimit\(/);
  assert.ok(s.indexOf('app.use("/api/analytics/event", rateLimit(') < s.indexOf('app.use("/api", analyticsRouter)'));
});

test("uzman paneli: kullanıcı içeriği canlı sayfaya HTML olarak yazılmaz", () => {
  const u = read("site-uzman/assets/uzman.js");
  assert.doesNotMatch(u, /\.innerHTML\s*=/);
  assert.match(u, /new DOMParser\(\)\.parseFromString/);
});
