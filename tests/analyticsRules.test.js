// Site kullanım ölçümü: yol ve kayıt sadeleştirme (sorgu dizesi, gizli kimlikler, yönetim alanı, sınırlar).
import test from "node:test";
import assert from "node:assert/strict";
import { normalizePath, normalizeHit, MAX_MS } from "../src/utils/analyticsRules.js";

test("yol: sorgu dizesi ve # atılır, kişiye özel kimlikler gizlenir, yönetim alanı ölçülmez", () => {
  assert.equal(normalizePath("/paketler?ref=x#a"), "/paketler");
  assert.equal(normalizePath("/forum/konu/abc/"), "/forum/konu/abc");
  assert.equal(normalizePath("/panel/destek/123e4567-e89b-12d3-a456-426614174000"), "/panel/destek/…");
  assert.equal(normalizePath("/panel/arkadaslar/ayse"), "/panel/arkadaslar/…");
  assert.equal(normalizePath("/panel/siparis/AVF-1"), "/panel/siparis/…");
  for (const p of ["/uzman", "/admin/x", "/api/x", "/assets/a.js", "//evil.com", "http://x", "/<script>", "/__mails"]) assert.equal(normalizePath(p), null, p);
  assert.equal(normalizePath("/" + "a".repeat(300)).length, 120);
  assert.equal(normalizePath("/araçlar"), "/araçlar");
});
test("kayıt: oturum kimliği biçimi, en kısa / en uzun süre, bilinmeyen alanlar", () => {
  const sid = "a".repeat(32);
  assert.equal(normalizeHit({ sid: "x", path: "/", ms: 5000 }), null);
  assert.equal(normalizeHit({ sid, path: "/", ms: 100 }), null);
  assert.equal(normalizeHit({ sid, path: "/", ms: 99999999 }).ms, MAX_MS);
  const h = normalizeHit({ sid, path: "/sss", ms: 4200.7, device: "tablet", ref: "evil", lang: "de", extra: 1 });
  assert.deepEqual(h, { sid, path: "/sss", ms: 4201, device: "desktop", ref: "other", lang: "tr" });
  assert.equal(normalizeHit(null), null); assert.equal(normalizeHit("str"), null);
});
