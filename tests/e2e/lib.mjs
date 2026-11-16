// Ortak test yardımcıları (e2e). Çalıştırma: bkz. avfsim.mjs başlığı.
import { spawnSync } from "node:child_process";
import { totpCode } from "../../src/utils/totp.js";
export const BASE = process.env.BASE || "http://127.0.0.1:8902";
const PSQL = ["-h", process.env.PGSOCK || "/home/alpeptit/.pgtest", "-p", "55432", "-U", "postgres", "-d", process.env.SIM_DB || "avfsim", "-At", "-q"];
export const sql = (q) => spawnSync("/usr/lib/postgresql/16/bin/psql", [...PSQL, "-c", q], { encoding: "utf8" }).stdout.trim();
let pass = 0, fail = 0;
export const chk = (name, ok, info) => { if (ok) { pass++; console.log("PASS " + name); } else { fail++; console.log("FAIL " + name + " → " + JSON.stringify(info).slice(0, 400)); } };
export const finish = () => { console.log(`\n${pass} geçti, ${fail} başarısız`); process.exit(fail ? 1 : 0); };
export const stamp = String(Date.now()).slice(-7), PW = "Kirmizi.Elma7";
export class Client {
  constructor() { this.jar = {}; }
  cookieHeader() { return Object.entries(this.jar).map(([k, v]) => k + "=" + encodeURIComponent(v)).join("; "); }
  async call(method, path, body, { csrf = true } = {}) {
    const headers = { "content-type": "application/json", cookie: this.cookieHeader(), origin: BASE };
    if (csrf && this.jar.avf_csrf) headers["x-csrf-token"] = this.jar.avf_csrf;
    const r = await fetch(BASE + "/api" + path, { method, headers, body: method === "GET" ? undefined : JSON.stringify(body || {}) });
    for (const c of r.headers.getSetCookie?.() || []) { const [nv] = c.split(";"); const i = nv.indexOf("="); const n = nv.slice(0, i), v = decodeURIComponent(nv.slice(i + 1)); if (/Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c) || v === "") delete this.jar[n]; else this.jar[n] = v; }
    let data = null; try { data = await r.json(); } catch { /* boş */ }
    return { status: r.status, body: data };
  }
}
export const mailCode = async (to) => { const m = await (await fetch(BASE + "/__mails?to=" + encodeURIComponent(to))).json(); const x = m && m.text.match(/\b\d{6}\b/); return x ? x[0] : null; };

export async function signup(fullName, tag) {
  const c = new Client(), username = tag + stamp, email = `${username}@example.test`;
  let r = await c.call("POST", "/auth/register", { fullName, username, email, password: PW, recaptchaToken: "t", kvkkAccepted: true, aboutAccepted: true });
  if (r.status !== 200) throw new Error("kayıt: " + JSON.stringify(r));
  const code = await mailCode(email);
  r = await c.call("POST", "/auth/register/verify", { userId: r.body.userId, code, recaptchaToken: "t" });
  if (r.status !== 200) throw new Error("doğrulama: " + JSON.stringify(r));
  return { c, id: r.body.user.id, email, username, fullName, user: r.body.user };
}
export async function login(p) { const c = new Client(); let r = await c.call("POST", "/auth/login", { identifier: p.username, password: PW, recaptchaToken: "t" }); if (r.body.secondFactor === "totp") { const code = p.backup.shift(); r = await c.call("POST", "/auth/login/verify-totp", { userId: r.body.userId, loginTicket: r.body.loginTicket, recoveryCode: code }); } if (!r.body.user) throw new Error("giriş: " + JSON.stringify(r)); p.c = c; return r; }
// Authenticator'ı hesap ayarlarındaki gerçek akışla etkinleştirir (e-posta kodu → QR/anahtar → uygulama kodu)
export async function enableTotp(p) {
  let r = await p.c.call("POST", "/2fa/request-toggle", { method: "totp" }); if (r.status !== 200) throw new Error(JSON.stringify(r));
  r = await p.c.call("POST", "/2fa/confirm-toggle", { code: await mailCode(p.email) }); if (!r.body.secret) throw new Error(JSON.stringify(r));
  const secret = r.body.secret; r = await p.c.call("POST", "/2fa/activate", { token: totpCode(secret) });
  if (!r.body.enabled) throw new Error(JSON.stringify(r)); p.secret = secret; p.backup = r.body.backupCodes; return r;
}

