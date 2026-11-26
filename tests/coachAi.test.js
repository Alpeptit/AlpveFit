// Koçluk asistanı: saf yardımcıların birim testleri (yapılandırma, farmakoloji süzgeci, yanıt temizleme, bağlam özeti).
import test from "node:test";
import assert from "node:assert/strict";
import { aiConfig, mentionsPharma, unsafeReply, cleanReply, buildPrompt, nutritionSummary, trainingSummary, detectLang, toModelMessages, AI_MAX_REPLY } from "../src/utils/coachAi.js";
import { catalog } from "../src/utils/planCatalog.js";

test("yapılandırma eksik ya da hatalıysa asistan kapalı", () => {
  assert.equal(aiConfig({}).enabled, false);
  assert.equal(aiConfig({ AI_API_URL: "http://x.com/v1", AI_API_KEY: "k".repeat(20), AI_MODEL: "m1" }).enabled, false, "https zorunlu");
  assert.equal(aiConfig({ AI_API_URL: "https://api.example.com/v1", AI_API_KEY: "kısa", AI_MODEL: "m1" }).enabled, false);
  const ok = aiConfig({ AI_API_URL: "https://api.example.com/v1/", AI_API_KEY: "k".repeat(20), AI_MODEL: "model-1", AI_DAILY_LIMIT: "50" });
  assert.equal(ok.enabled, true); assert.equal(ok.url, "https://api.example.com/v1"); assert.equal(ok.daily, 50);
  assert.equal(aiConfig({ AI_API_URL: "https://api.example.com/v1", AI_API_KEY: "k".repeat(20), AI_MODEL: "m1", AI_ENABLED: "0" }).enabled, false);
});
test("farmakoloji sorusu tanınır (Türkçe harfler ve ekler dahil), sıradan sorular geçer", () => {
  for (const t of ["İlaç kullanabilir miyim?", "testosteronum düşük", "BPC-157 işe yarar mı", "kürde ne yemeli", "Ozempic kilo verdirir mi", "HGH", "sarms"]) assert.equal(mentionsPharma(t), true, t);
  for (const t of ["Bugünkü kalorim ne kadar?", "Bench press tekniği", "Kilom neden durdu?", "hapşırık", "antrenman sonrası ne yemeli", "3 litre su içiyorum"]) assert.equal(mentionsPharma(t), false, t);
});
test("yanıtta doz birimi ya da farmakoloji geçerse gönderilmez; su miktarı serbest", () => {
  assert.equal(unsafeReply("Günde 250 mcg"), true); assert.equal(unsafeReply("400 mg magnezyum"), true); assert.equal(unsafeReply("Günde 3 litre, 500 ml su"), false);
  assert.equal(cleanReply("Günde 250 mcg kullan."), null);
  assert.equal(cleanReply(""), null);
});
test("yanıt temizleme: HTML ve dış bağlantı atılır, site bağlantısı kalır, uzunluk sınırlı", () => {
  const r = cleanReply("<b>Merhaba</b> **kalın** bak: https://kotu.example/x ve https://alpvefit.com/panel");
  assert.equal(r.includes("<"), false); assert.equal(r.includes("kotu.example"), false); assert.equal(r.includes("https://alpvefit.com/panel"), true); assert.equal(r.includes("**"), false);
  assert.ok(cleanReply("Kısa cümle. ".repeat(300)).length <= AI_MAX_REPLY + 1);
});
test("bağlam: beslenme özeti gün toplamı ve sebze lifi; antrenman özeti", () => {
  const cat = catalog();
  const n = nutritionSummary({ days: [{ title: "Pazartesi", meals: [{ items: [{ food: "chicken_breast", qty: 200 }, { food: "broccoli", qty: 100 }] }, { items: [{ food: "egg_white_m", qty: 3 }] }] }] }, cat);
  assert.match(n, /\[Pazartesi\] toplam \d+ kcal/); assert.match(n, /Brokoli 100 g \[lif\]/); assert.match(n, /3 adet/);
  const legacy = nutritionSummary({ meals: [{ items: [{ food: "oats", qty: 80 }] }] }, cat); assert.match(legacy, /\[Her gün\]/);
  assert.equal(trainingSummary({ days: [{ title: "Push", exercises: [{ group: "chest", name: "Bench Press", sets: 4, reps: "10" }, { group: "cardio", name: "Eliptik", minutes: 20 }] }] }), "[Push] Bench Press 4x10, Eliptik 20 dk");
});
test("talimat: kapsam, farmakoloji yasağı ve bağlam; ad / e-posta alanı yok", () => {
  const p = buildPrompt({ profile: { age: 30, height_cm: 180, goal: "yağ yakmak" }, nutrition: "[Gün] toplam 2000 kcal", training: "", body: [{ day: "2026-11-01", weight: 80 }], lifts: [], lang: "en" });
  assert.match(p, /YALNIZ üç konuda/); assert.match(p, /ASLA yorum yapma/); assert.match(p, /2000 kcal/); assert.match(p, /2026-11-01: 80 kg/); assert.match(p, /answer in English/);
  assert.doesNotMatch(p, /e-posta:|ad soyad:/i);
});
test("dil ve geçmiş", () => {
  assert.equal(detectLang("How many calories should I eat?"), "en"); assert.equal(detectLang("Kaç kalori yemeliyim?"), "tr");
  const m = toModelMessages(Array.from({ length: 20 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", body: "m" + i })));
  assert.equal(m.length, 12); assert.equal(m[0].role, "user");
});
