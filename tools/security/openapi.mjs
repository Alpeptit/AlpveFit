// Güvenlik taraması (OWASP ZAP) için API tanımı üretir: src/server.js'teki bağlama noktaları (app.use("/api", xRouter)) ve
// src/routes/*.js içindeki rota tanımlarından (router.get("/yol/:id", …)) OpenAPI 3 belgesi çıkarır. Gövde alanları
// işleyicideki req.body kullanımından tahmin edilir. Yalnız tarama içindir; üretimde kullanılmaz ve hiçbir yere yayımlanmaz.
//   node tools/security/openapi.mjs http://localhost:3000 > openapi.json
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const server = process.argv[2] || "http://localhost:3000";
// Oturumu sonlandıran uçlar taramada atlanır (aksi hâlde ilk dakikada çıkış yapılır ve kalan uçlar kimliksiz denenir)
const SKIP = /logout|confirm-delete|request-delete|delete-account|change-password|confirm-password|password\/confirm/;
const srv = readFileSync(join(root, "src/server.js"), "utf8");

// import { aRouter, bRouter } from "./routes/x.js"  /  import aRouter from "./routes/x.js"
const fileOf = {};
for (const m of srv.matchAll(/import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+["']\.\/routes\/([\w.-]+)["']/g)) {
  for (const n of (m[1] || m[2]).split(",").map((x) => x.trim().split(/\s+as\s+/).pop()).filter(Boolean)) fileOf[n] = m[3];
}
const mounts = {};   // dosya → [önek, …]
for (const m of srv.matchAll(/app\.use\(\s*["']([^"']+)["']\s*,\s*(?:[\w.]+\s*,\s*)*(\w+Router)\s*\)/g)) {
  const f = fileOf[m[2]]; if (!f) continue; (mounts[f] = mounts[f] || []).push(m[1]);
}
const paths = {};
const files = readdirSync(join(root, "src/routes")).filter((f) => f.endsWith(".js"));
for (const f of files) {
  const prefixes = mounts[f]; if (!prefixes) continue;
  const src = readFileSync(join(root, "src/routes", f), "utf8");
  const defs = [...src.matchAll(/\b\w+\.(get|post|put|patch|delete)\(\s*["'`](\/[^"'`]*)["'`]/g)];
  defs.forEach((m, i) => {
    const method = m[1], path = m[2], body = src.slice(m.index, i + 1 < defs.length ? defs[i + 1].index : src.length);
    const fields = new Set();
    for (const b of body.matchAll(/req\.body\??\.(\w+)/g)) fields.add(b[1]);
    for (const b of body.matchAll(/const\s*\{([^}]+)\}\s*=\s*req\.body/g)) b[1].split(",").forEach((x) => { const n = x.trim().split(/[:=\s]/)[0]; if (/^\w+$/.test(n)) fields.add(n); });
    for (const p of prefixes) {
      const full = (p + path).replace(/\/+$/, "") || "/";
      if (SKIP.test(full)) continue;
      const oas = full.replace(/:(\w+)/g, "{$1}");
      const params = [...full.matchAll(/:(\w+)/g)].map((x) => ({ name: x[1], in: "path", required: true, schema: { type: "string", example: /id$/i.test(x[1]) ? "00000000-0000-4000-8000-000000000001" : "test" } }));
      const op = { operationId: method + oas.replace(/[^\w]+/g, "_"), parameters: params, responses: { default: { description: "yanıt" } } };
      if (method !== "get" && method !== "delete") {
        const props = {}; for (const n of fields) props[n] = { type: "string", example: "test" };
        op.requestBody = { content: { "application/json": { schema: { type: "object", properties: props } } } };
      }
      (paths[oas] = paths[oas] || {})[method] = op;
    }
  });
}
const doc = { openapi: "3.0.3", info: { title: "API (güvenlik taraması)", version: "1" }, servers: [{ url: server }], paths };
process.stdout.write(JSON.stringify(doc, null, 1));
console.error(`[openapi] ${Object.keys(paths).length} yol, ${Object.values(paths).reduce((a, p) => a + Object.keys(p).length, 0)} işlem`);
