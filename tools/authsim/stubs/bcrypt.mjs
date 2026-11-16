import crypto from "node:crypto";
const H = (s) => "$2b$10$" + crypto.createHash("sha256").update(String(s)).digest("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 53).padEnd(53, "a");
export async function hash(s) { return H(s); } export async function compare(s, h) { return H(s) === h; }
export function hashSync(s) { return H(s); } export function compareSync(s, h) { return H(s) === h; } export function getRounds() { return 10; }
export default { hash, compare, hashSync, compareSync, getRounds };
