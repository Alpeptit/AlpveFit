// Arayüz: İngilizce sözlük kapsamı (yeni ekranlar), forum alanında dil kilidi ve plan PDF / yazdırma — tarayıcısız, statik denetim.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (f) => readFileSync(new URL("../" + f, import.meta.url), "utf8");
function dict() {
  const window = { AVF: {} };
  new Function("window", read("site/assets/avf-i18n-data.js"))(window);
  const A = window.AVF;
  const tr1 = (s) => { if (A.DICT[s] !== undefined) return A.DICT[s]; for (const p of A.PATTERNS) if (p[0].test(s)) return s.replace(p[0], p[1]); return s; };
  return { A, tr1 };
}

test("yeni ekran metinleri İngilizceye çevrilir", () => {
  const { tr1 } = dict();
  for (const s of ["PDF indir / Yazdır", "Bu plan size özel hazırlanmıştır; başkalarıyla paylaşmayın.", "Cinsiyet, doğum tarihi ve meslek", "Filtrelere uyan üye bulunamadı.", "Plan oluşturuldu", "Talebinizi kısaca özetleyin"]) assert.notEqual(tr1(s), s, s);
  assert.equal(tr1("3 kayıt"), "3 entries");
  assert.equal(tr1("Pazartesi başlangıç"), "Monday start");
  assert.equal(tr1("Ön görünüm ekle"), "Add front view");
  assert.equal(tr1("Örn. 82.5"), "E.g. 82.5");
  assert.equal(tr1("Plan oluşturuldu (5)"), "Plan created (5)");
});

test("forum alanı yalnız Türkçe: dil seçici gizlenir, tercih değiştirilmez", () => {
  const i18n = read("site/assets/avf-i18n.js"), app = read("site/assets/avf-app.js"), css = read("site/assets/avf.css");
  assert.match(i18n, /AVF\.langLock = function/);
  assert.match(i18n, /if \(locked\) return;/);                          // kilitliyken setLang çalışmaz
  assert.equal(/localStorage\.setItem/.test(i18n.slice(i18n.indexOf("AVF.langLock = "), i18n.indexOf("AVF.langLocked"))), false);   // tercih yazılmaz
  assert.match(app, /AVF\.langLock\(p === "\/forum" \|\| p\.indexOf\("\/forum\/"\) === 0\)/);
  assert.match(css, /html\.lang-locked \.lang,html\.lang-locked \.dlang\{display:none!important\}/);
});

test("plan PDF / yazdır: yalnız plan basılır, aydınlık renk, ek istek yok; üye ve uzman ekranında düğme", () => {
  const plans = read("site/assets/avf-plans.js"), css = read("site/assets/avf.css");
  const seg = plans.slice(plans.indexOf("AVF.printPlan = function"), plans.indexOf("AVF.printButton"));
  assert.match(seg, /setAttribute\("data-theme", "light"\)/);
  assert.match(seg, /window\.print\(\)/);
  assert.match(seg, /afterprint/);
  assert.equal(/AVF\.api\(|fetch\(/.test(seg), false);
  assert.match(css, /body\.avf-printing>\*:not\(#avf-print\)\{display:none!important\}/);
  assert.match(read("site/assets/avf-app.js"), /AVF\.printPlan\(\{ kind: kind, plan: p, ctx: ctx \}\)/);
  assert.match(read("site-uzman/assets/uzman.js"), /AVF\.printPlan\(\{ kind: p\.kind, plan: p, member: m\.full_name \}\)/);
});

test("uygulama (PWA): bildirim dosyası, çevrimdışı sayfa ve hizmet çalışanı kişisel veri saklamaz", () => {
  const sw = read("site/sw.js"), man = JSON.parse(read("site/manifest.webmanifest")), idx = read("site/index.html"), site = read("src/site.js");
  assert.equal(man.display, "standalone"); assert.ok(man.icons.some((i) => i.purpose === "maskable"));
  assert.match(sw, /var SKIP = \/\^\\\/\(api\|uzman\|admin\)/);
  assert.match(sw, /indexOf\("no-store"\) < 0 && cc\.indexOf\("private"\) < 0/);
  assert.match(sw, /req\.mode === "navigate"[\s\S]{0,120}fetch\(req\)\.catch/);   // sayfalar her zaman ağdan
  assert.match(idx, /<link rel="manifest" href="\/manifest\.webmanifest">/);
  assert.match(site, /app\.get\("\/sw\.js"[\s\S]{0,120}no-cache/);
  assert.equal(/<script>/.test(read("site/offline.html")), false);   // satır içi betik yok (CSP)
});
