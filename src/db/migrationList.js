import { readdirSync, readFileSync } from "fs";
import { join } from "path";

/** Dizindeki migrate-vN.sql dosyalarını sürüm numarasına göre sıralı döndürür (elle bakımlanan liste yok). */
export function discoverMigrationFiles(dirPath) {
  return readdirSync(dirPath)
    .filter((f) => /^migrate-v\d+\.sql$/.test(f))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
}
export function readMigrationSql(dir, file) {
  return readFileSync(join(dir, file), "utf8");
}
