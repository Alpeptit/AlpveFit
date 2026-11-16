// Alpvefit migration çalıştırıcısı. Sunucu açılışında ve `npm run db:setup` ile çalışır.
//   • Her migration kendi transaction'ında çalışır; hata alan geri alınır, kaydedilmez, sonrakilere geçilmez.
//   • Eşzamanlı iki süreç advisory lock ile sıraya girer.
//   • Alpvefit'in kendi veritabanında çalışır (DATABASE_URL); başka hiçbir platformun verisine bağlanmaz.
import { fileURLToPath } from "url";
import { dirname } from "path";
import { pool } from "./pool.js";
import { discoverMigrationFiles, readMigrationSql } from "./migrationList.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const MIGRATION_LOCK_KEY = "774410259013";
const LOCK_WAIT_TRIES = 30;
const LOCK_WAIT_MS = 2000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function acquireLock(client, log) {
  for (let i = 0; i < LOCK_WAIT_TRIES; i++) {
    const { rows } = await client.query(`SELECT pg_try_advisory_lock($1) AS ok`, [MIGRATION_LOCK_KEY]);
    if (rows[0].ok) return true;
    if (i === 0) log.log("[migration] Başka bir süreç migration çalıştırıyor — bekleniyor…");
    await sleep(LOCK_WAIT_MS);
  }
  return false;
}

/** @returns {Promise<{applied:string[], pending:string[], lockBusy:boolean}>} Hata durumunda istisna fırlatır. */
export async function runMigrations({ log = console } = {}) {
  const client = await pool.connect();
  let locked = false;
  try {
    locked = await acquireLock(client, log);
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
    const { rows } = await client.query(`SELECT version FROM schema_migrations`);
    const done = new Set(rows.map((r) => r.version));
    const todo = discoverMigrationFiles(__dirname).filter((f) => !done.has(f));
    if (!locked) {
      log.warn(`[migration] Kilit alınamadı; bekleyen: ${todo.length}.`);
      return { applied: [], pending: todo, lockBusy: true };
    }
    const applied = [];
    for (const file of todo) {
      await client.query("BEGIN");
      try {
        await client.query(readMigrationSql(__dirname, file));
        await client.query(`INSERT INTO schema_migrations (version) VALUES ($1)`, [file]);
        await client.query("COMMIT");
        applied.push(file);
        log.log(`[migration] ${file} uygulandı.`);
      } catch (err) {
        await client.query("ROLLBACK");
        log.error(`[migration] ${file} BAŞARISIZ — geri alındı. Sonraki migration'lara geçilmiyor.`);
        throw err;
      }
    }
    if (!applied.length) log.log("[migration] Veritabanı zaten güncel.");
    return { applied, pending: [], lockBusy: false };
  } finally {
    if (locked) await client.query(`SELECT pg_advisory_unlock($1)`, [MIGRATION_LOCK_KEY]).catch(() => {});
    client.release();
  }
}
