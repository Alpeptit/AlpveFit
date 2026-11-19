// Gerçek PostgreSQL'e psql üzerinden sorgu gönderen küçük "pg" yerine-geçeni (yalnız test düzeneği için)
import { spawnSync, spawn } from "node:child_process";
const PSQL = "/usr/lib/postgresql/16/bin/psql";
const ARGS = ["-h", process.env.PGSOCK || "/home/alpeptit/.pgtest", "-p", "55432", "-U", "postgres", "-d", process.env.SIM_DB || "authsim", "-At", "-v", "ON_ERROR_STOP=1", "-q"];
function lit(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  if (typeof v === "bigint") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (v instanceof Date) return "'" + v.toISOString() + "'::timestamptz";
  if (Buffer.isBuffer(v)) return "'\\x" + v.toString("hex") + "'::bytea";
  if (Array.isArray(v)) return v.length ? "ARRAY[" + v.map(lit).join(",") + "]" : "'{}'";
  if (typeof v === "object") return dq(JSON.stringify(v));
  return dq(String(v));
}
function dq(s) { let tag = "q"; while (s.includes("$" + tag + "$")) tag += "x"; return "$" + tag + "$" + s + "$" + tag + "$"; }
// Gerçek sürücü gibi parametre türü denetimi: node-pg parametreleri türsüz gönderir; PostgreSQL her $n'in türünü sorgudan
// çıkaramazsa (42P18) ya da değer sayısı tutmazsa üretimde hata verir. Metinle yerine koyma bunu gizlediği için aynı SQL bir kez
// PREPARE edilerek denetlenir (sonuç önbellekte; işlem dışı, şema yeterli).
const CHECKED = new Set();
function typecheck(sql, params = []) {
  const src = String(sql).trim().replace(/;\s*$/, "");
  const nums = [...src.matchAll(/\$(\d+)(?!\d)/g)].map((m) => Number(m[1]));
  const max = nums.length ? Math.max(...nums) : 0;
  if ((params || []).length !== max) { const e = new Error(`bind message supplies ${(params || []).length} parameters, but prepared statement requires ${max}\nSQL: ${src.slice(0, 400)}`); e.code = "08P01"; throw e; }
  if (!max || !/^(select|with|insert|update|delete)\b/i.test(src) || CHECKED.has(src)) return;
  const r = spawnSync(PSQL, [...ARGS, "-c", "PREPARE __tc AS " + src], { encoding: "utf8" });
  if (r.status !== 0) { const e = new Error((r.stderr || "psql hata").trim() + "\nSQL: " + src.slice(0, 400)); const m = /could not determine data type/.test(r.stderr) ? "42P18" : null; if (m) e.code = m; throw e; }
  CHECKED.add(src);
}
function run(sql, params = []) {
  typecheck(sql, params);
  const text = String(sql).trim().replace(/;\s*$/, "").replace(/\$(\d+)(?!\d)/g, (_, n) => lit(params[Number(n) - 1]));
  const isSel = /^(select|with)\b/i.test(text), hasRet = /\breturning\b/i.test(text);
  const q = isSel ? `SELECT coalesce(json_agg(q), '[]'::json) FROM (${text}) q` : hasRet ? `WITH q AS (${text}) SELECT coalesce(json_agg(q), '[]'::json) FROM q` : text;
  const r = spawnSync(PSQL, [...ARGS, "-c", q], { encoding: "utf8" });
  if (r.status !== 0) { const e = new Error((r.stderr || "psql hata").trim() + "\nSQL: " + text.slice(0, 400)); throw e; }
  const rows = isSel || hasRet ? JSON.parse(r.stdout.trim() || "[]") : [];
  return { rows, rowCount: rows.length };
}
// v62: pool.connect() artık KALICI bir psql oturumu verir — BEGIN / SAVEPOINT / FOR UPDATE / ROLLBACK gerçek işlem olarak çalışır
// (önceden her sorgu ayrı oturumdu; işlem içi kod yolları — sipariş oluşturma, ödeme onayı — denenemiyordu).
function prep(sql, params = []) {
  const text = String(sql).trim().replace(/;\s*$/, "").replace(/\$(\d+)(?!\d)/g, (_, n) => lit(params[Number(n) - 1]));
  const isSel = /^(select|with)\b/i.test(text), hasRet = /\breturning\b/i.test(text);
  const q = isSel ? `SELECT coalesce(json_agg(q), '[]'::json) FROM (${text}) q` : hasRet ? `WITH q AS (${text}) SELECT coalesce(json_agg(q), '[]'::json) FROM q` : text;
  return { text, q, json: isSel || hasRet };
}
class Client {
  constructor() {
    this.p = spawn(PSQL, ARGS.filter((a) => a !== "-v" && a !== "ON_ERROR_STOP=1"), { stdio: ["pipe", "pipe", "pipe"] });
    this.buf = ""; this.waiters = []; this.n = 0;
    this.p.stdout.setEncoding("utf8"); this.p.stderr.on("data", () => {});
    this.p.stdout.on("data", (d) => { this.buf += d; this.pump(); });
  }
  pump() {
    for (;;) {
      const w = this.waiters[0]; if (!w) return;
      const i = this.buf.indexOf(w.mark); if (i < 0) return;
      const j = this.buf.indexOf("\n", i); if (j < 0) return;
      const out = this.buf.slice(0, i), tail = this.buf.slice(i + w.mark.length, j).trim(); this.buf = this.buf.slice(j + 1);
      this.waiters.shift();
      const sp = tail.indexOf(" "), isErr = (sp < 0 ? tail : tail.slice(0, sp)) === "true";
      if (isErr) { const e = new Error(tail.slice(sp + 1) + "\nSQL: " + w.text.slice(0, 400)); const m = tail.match(/^true (\w{5}) /); if (m) e.code = m[1]; w.reject(e); continue; }
      const s = out.trim();
      w.resolve(w.json ? { rows: JSON.parse(s.split("\n").filter(Boolean).join("\n") || "[]"), rowCount: 0 } : { rows: [], rowCount: 0 });
    }
  }
  query(sql, params) {
    try { typecheck(sql, params); } catch (e) { return Promise.reject(e); }
    const { text, q, json } = prep(sql, params);
    const mark = "__ALP_END_" + (++this.n) + "__";
    return new Promise((resolve, reject) => {
      this.waiters.push({ mark, text, json, resolve: (r) => { r.rowCount = r.rows.length; resolve(r); }, reject });
      this.p.stdin.write(q + ";\n\\echo " + mark + " :ERROR :LAST_ERROR_SQLSTATE :LAST_ERROR_MESSAGE\n");
    });
  }
  release() { try { this.p.stdin.end(); } catch (e) {} }
}
export class Pool { constructor() {} on() {} async query(sql, params) { return run(sql, params); } async connect() { return new Client(); } async end() {} }
export default { Pool, types: { setTypeParser() {} } };
