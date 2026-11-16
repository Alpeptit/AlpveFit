export function sign(p, s, o = {}) { const now = Math.floor(Date.now() / 1000); return Buffer.from(JSON.stringify({ ...p, iat: now, exp: now + 7 * 86400 })).toString("base64url"); }
export function verify(t) { const p = JSON.parse(Buffer.from(String(t), "base64url").toString()); if (p.exp && p.exp < Date.now() / 1000) throw new Error("expired"); return p; }
export function decode(t) { try { return verify(t); } catch { return null; } }
export default { sign, verify, decode };
