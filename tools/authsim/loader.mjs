const H = new URL("./stubs/", import.meta.url);
const MAP = { pg: "pg.mjs", dotenv: "dotenv.mjs", "dotenv/config": "dotenv.mjs", express: "express.mjs", bcrypt: "bcrypt.mjs", jsonwebtoken: "jsonwebtoken.mjs", nodemailer: "nodemailer.mjs", axios: "axios.mjs", qrcode: "qrcode.mjs", "sanitize-html": "sanitize-html.mjs", "node-cron": "node-cron.mjs", cloudinary: "cloudinary.mjs" };
export async function resolve(spec, ctx, next) { if (MAP[spec]) return { url: new URL(MAP[spec], H).href, shortCircuit: true }; return next(spec, ctx); }
