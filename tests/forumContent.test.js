// Resmî forum içeriği: yapı ve güvenlik denetimleri (tohumlama öncesi).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { CONTENT } from "../src/forum/content/index.js";

const SQL = readFileSync(new URL("../src/db/migrate-v17.sql", import.meta.url), "utf8");
const CORE = readFileSync(new URL("../site/assets/avf-core.js", import.meta.url), "utf8");
const TOOLS = readFileSync(new URL("../site/assets/avf-tools.js", import.meta.url), "utf8");
const ICONS = new Set([...CORE.slice(CORE.indexOf("var P = {"), CORE.indexOf("};", CORE.indexOf("var P = {"))).matchAll(/(?:^|[\s,{])"?([a-z0-9]+)"?\s*:/g)].map((m) => m[1]));
const CATS = ["duyurular", "beslenme", "antrenman", "supplement", "vitamin", "mineral", "gelisim-gunlukleri", "serbest-kursu"];

test("her konunun anahtarı tekil, alanları geçerli", () => {
  const keys = new Set();
  for (const c of CONTENT) {
    assert.ok(/^[a-z0-9-]{3,80}$/.test(c.key), c.key);
    assert.ok(!keys.has(c.key), "tekrar: " + c.key); keys.add(c.key);
    assert.ok(Number.isInteger(c.rev) && c.rev >= 1, c.key);
    assert.ok(CATS.includes(c.category), c.key + " kategori " + c.category);
    assert.ok(c.title.length >= 8 && c.title.length <= 140, c.key + " başlık");
    assert.ok(c.body.length > 400 && c.body.length <= 40000, c.key + " gövde");
    assert.ok(c.tags.length >= 1 && c.tags.length <= 5, c.key + " etiket");
    for (const t of c.tags) assert.ok(SQL.includes("'" + t + "'"), c.key + " etiket yok: " + t);
  }
  assert.equal(CONTENT.length, 26);
});

test("ekip konularının tümü yoruma kapalı ve sabit; kimse yoruma davet edilmez", () => {
  for (const c of CONTENT) {
    assert.equal(c.locked, true, c.key);
    assert.notEqual(c.pinned, false, c.key);
    assert.ok(!/aşağıya yaz|yorumlara yaz|Soru – Cevap/i.test(c.body), c.key + " yorum daveti / kaldırılan kategori");
  }
});

test("antrenman sistemleri Antrenman'da; bölgesel program (bro split) önerilmez", () => {
  for (const c of CONTENT.filter((x) => x.key.startsWith("gelisim-") && !["gelisim-gunlugu-nasil-tutulur", "gelisim-fotograf-kurallari"].includes(x.key))) assert.equal(c.category, "antrenman", c.key);
  const o = CONTENT.find((x) => x.key === "gelisim-antrenman-sistemleri");
  assert.ok(!/\| Klasik bölgesel \(Bro Split\) \|/.test(o.body) && /önermiyoruz/.test(o.body));
  assert.ok(CONTENT.some((x) => x.category === "gelisim-gunlukleri" && /Gelişim Günlüğü Nasıl Tutulur/.test(x.title)));
  assert.ok(CONTENT.some((x) => x.category === "serbest-kursu" && /Kuralları/.test(x.title)));
});

test("biçim etiketleri geçerli: simge, araç, görsel, GIF, kaynak", () => {
  for (const c of CONTENT) {
    for (const m of c.body.matchAll(/\[ikon=([a-z0-9]+)\]/g)) assert.ok(ICONS.has(m[1]), c.key + " simge: " + m[1]);
    for (const m of c.body.matchAll(/^\[arac=([a-z0-9-]+)\]$/gm)) assert.ok(TOOLS.includes('key: "' + m[1] + '"'), c.key + " araç: " + m[1]);
    for (const m of c.body.matchAll(/^\[gorsel=([a-z0-9-]+)/gm)) assert.ok(existsSync(new URL("../site/assets/forum/" + m[1] + ".svg", import.meta.url)), c.key + " görsel: " + m[1]);
    const gifs = [...c.body.matchAll(/^\[gif=(\d+)\]$/gm)].map((m) => +m[1]);
    for (const n of gifs) assert.ok(n >= 1 && n <= c.gifs.length, c.key + " gif=" + n);
    for (const m of c.body.matchAll(/\[kaynak=([^\]|]*)/g)) assert.ok(/^\d{6,9}$/.test(m[1]), c.key + " PMID: " + m[1]);
    assert.equal((c.body.match(/\[kutu=/g) || []).length, (c.body.match(/\[\/kutu\]/g) || []).length, c.key + " kutu");
    assert.equal((c.body.match(/^\[tablo\]$/gm) || []).length, (c.body.match(/^\[\/tablo\]$/gm) || []).length, c.key + " tablo");
  }
});

test("yasak içerik yok: iletişim, bağlantı, satış yönlendirmesi", () => {
  for (const c of CONTENT) {
    const t = c.title + "\n" + c.body;
    assert.ok(!/https?:\/\/|www\./i.test(t), c.key + " bağlantı");
    assert.ok(!/@[a-z0-9-]+\.[a-z]{2,}/i.test(t), c.key + " e-posta");
    assert.ok(!/(\+90|\b0)\s?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/.test(t), c.key + " telefon");
  }
});
