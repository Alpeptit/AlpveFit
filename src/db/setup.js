// `npm run db:setup` — bekleyen migration'ları uygular (sunucu açılışında da otomatik çalışır).
import "dotenv/config";
import { runMigrations } from "./runMigrations.js";
import { pool } from "./pool.js";

try {
  const r = await runMigrations();
  console.log(r.applied.length ? `Uygulandı: ${r.applied.join(", ")}` : "Veritabanı güncel.");
  await pool.end();
} catch (err) {
  console.error("[db:setup] Hata:", err.message);
  process.exit(1);
}
