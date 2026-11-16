// Alpvefit uçtan uca API testi — devserver.mjs (GERÇEK rota kodu + GERÇEK PostgreSQL) üzerinden HTTP ile.
//   bash tools/pgstart.sh   # yerel PG (Alpeptit deposundaki betik) — veya CI'da servis konteyneri
//   node --import ./tools/authsim/register.mjs tools/devserver.mjs &   (PORT=8902, SIM_DB=avfsim)
//   node tests/e2e/avfsim.mjs
// Denetlenenler: kayıt/giriş kuralları, Authenticator, rol ve yetki sınırları, plan yayın akışı, "kullanıcı yalnız kendi yayınlanmış
// planını görür", üye erişim izni, hazırlayan adı korunumu, CSRF, bağımsızlık (ayrı çerez adları).
import { spawnSync } from "node:child_process";
import { totpCode } from "../../src/utils/totp.js";

const BASE = process.env.BASE || "http://127.0.0.1:8902";
const PSQL = ["-h", process.env.PGSOCK || "/home/alpeptit/.pgtest", "-p", "55432", "-U", "postgres", "-d", process.env.SIM_DB || "avfsim", "-At", "-q"];
const sql = (q) => spawnSync("/usr/lib/postgresql/16/bin/psql", [...PSQL, "-c", q], { encoding: "utf8" }).stdout.trim();

let pass = 0, fail = 0;
const chk = (name, ok, info) => { if (ok) { pass++; console.log("PASS " + name); } else { fail++; console.log("FAIL " + name + " → " + JSON.stringify(info).slice(0, 400)); } };

class Client {
  constructor() { this.jar = {}; }
  cookieHeader() { return Object.entries(this.jar).map(([k, v]) => k + "=" + encodeURIComponent(v)).join("; "); }
  async call(method, path, body, { csrf = true } = {}) {
    const headers = { "content-type": "application/json", cookie: this.cookieHeader(), origin: BASE };
    if (csrf && this.jar.avf_csrf) headers["x-csrf-token"] = this.jar.avf_csrf;
    const r = await fetch(BASE + "/api" + path, { method, headers, body: method === "GET" ? undefined : JSON.stringify(body || {}) });
    for (const c of r.headers.getSetCookie?.() || []) { const [nv] = c.split(";"); const i = nv.indexOf("="); const n = nv.slice(0, i), v = decodeURIComponent(nv.slice(i + 1)); if (/Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c) || v === "") delete this.jar[n]; else this.jar[n] = v; }
    let data = null; try { data = await r.json(); } catch { /* boş */ }
    return { status: r.status, body: data };
  }
}
const mailCode = async (to) => { const m = await (await fetch(BASE + "/__mails?to=" + encodeURIComponent(to))).json(); const x = m && m.text.match(/\b\d{6}\b/); return x ? x[0] : null; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stamp = String(Date.now()).slice(-7), PW = "Kirmizi.Elma7";
async function signup(fullName, tag) {
  const c = new Client(), username = tag + stamp, email = `${username}@example.test`;
  let r = await c.call("POST", "/auth/register", { fullName, username, email, password: PW, recaptchaToken: "t", kvkkAccepted: true, aboutAccepted: true });
  if (r.status !== 200) throw new Error("kayıt: " + JSON.stringify(r));
  const code = await mailCode(email);
  r = await c.call("POST", "/auth/register/verify", { userId: r.body.userId, code, recaptchaToken: "t" });
  if (r.status !== 200) throw new Error("doğrulama: " + JSON.stringify(r));
  return { c, id: r.body.user.id, email, username, fullName, user: r.body.user };
}
async function login(p) { const c = new Client(); let r = await c.call("POST", "/auth/login", { identifier: p.username, password: PW, recaptchaToken: "t" }); if (r.body.secondFactor === "totp") { const code = p.backup.shift(); r = await c.call("POST", "/auth/login/verify-totp", { userId: r.body.userId, loginTicket: r.body.loginTicket, recoveryCode: code }); } if (!r.body.user) throw new Error("giriş: " + JSON.stringify(r)); p.c = c; return r; }
// Authenticator'ı hesap ayarlarındaki gerçek akışla etkinleştirir (e-posta kodu → QR/anahtar → uygulama kodu)
async function enableTotp(p) {
  let r = await p.c.call("POST", "/2fa/request-toggle", { method: "totp" }); if (r.status !== 200) throw new Error(JSON.stringify(r));
  r = await p.c.call("POST", "/2fa/confirm-toggle", { code: await mailCode(p.email) }); if (!r.body.secret) throw new Error(JSON.stringify(r));
  const secret = r.body.secret; r = await p.c.call("POST", "/2fa/activate", { token: totpCode(secret) });
  if (!r.body.enabled) throw new Error(JSON.stringify(r)); p.secret = secret; p.backup = r.body.backupCodes; return r;
}

// ================= HAZIRLIK =================
const M1 = await signup("Ayşe Deneme", "uye1"), M2 = await signup("Mehmet Kaya", "uye2");
const C1 = await signup("Selin Uzman", "kos1"), C2 = await signup("Burak Koç", "kos2"), A = await signup("Yonetici Hesap", "adm");
chk("kayıt: avf_session ve avf_csrf çerezleri (Alpeptit'in alp_* çerezlerinden ayrı)", M1.c.jar.avf_session && M1.c.jar.avf_csrf && !M1.c.jar.alp_session, Object.keys(M1.c.jar));
chk("kayıt: user_code AVF- önekiyle", /^AVF-\d{6}$/.test(M1.user.user_code), M1.user);

// Alpeptit ile aynı kurallar
let r = await new Client().call("POST", "/auth/register", { fullName: "Ayşe Deneme", username: "x" + stamp, email: `x${stamp}@example.test`, password: "Kirmizi Elma.7", recaptchaToken: "t", kvkkAccepted: true, aboutAccepted: true });
chk("kayıt: boşluklu şifre reddedilir", r.status === 400 && r.body.error === "Şifre boşluk içeremez.", r);
r = await new Client().call("POST", "/auth/register", { fullName: "Ayşe Deneme", username: "y" + stamp, email: `y${stamp}@example.test`, password: "Abc123.xyz", recaptchaToken: "t", kvkkAccepted: true, aboutAccepted: true });
chk("kayıt: ardışık sayılı şifre reddedilir", r.status === 400 && /ardışık/.test(r.body.error), r);
r = await new Client().call("POST", "/auth/register", { fullName: "Ayşe Deneme", username: "z" + stamp, email: `z${stamp}@example.test`, password: PW, recaptchaToken: "t", kvkkAccepted: false, aboutAccepted: true });
chk("kayıt: KVKK onayı olmadan kayıt olmaz", r.status === 400, r);
r = await new Client().call("POST", "/auth/login", { identifier: M1.username, password: "Yanlis.Sifre9", recaptchaToken: "t" });
chk("giriş: yanlış şifre → invalid_credentials", r.status === 401 && r.body.error === "invalid_credentials", r);

// yönetici: SQL ile yükselt (ilk yönetici için `npm run admin:create` ile aynı sonuç), Authenticator zorunlu
sql(`UPDATE users SET role='admin', member_status='approved' WHERE id='${A.id}'`);
r = await A.c.call("GET", "/admin/me");
chk("yönetici: Authenticator kurulmadan panel API reddedilir (requiresTotpSetup)", r.status === 403 && r.body.requiresTotpSetup, r);
await enableTotp(A);
r = await A.c.call("GET", "/admin/me"); chk("yönetici: Authenticator sonrası panel açılır", r.status === 200 && r.body.role === "admin", r);

// ================= YETKİ SINIRLARI =================
r = await M1.c.call("GET", "/admin/clients"); chk("üye: /api/admin/* genel 404 alır (alanın varlığı belli olmaz)", r.status === 404 && r.body.error === "Bulunamadı.", r);
r = await new Client().call("GET", "/admin/clients"); chk("misafir: /api/admin/* genel 404", r.status === 404, r);
r = await M1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "nutrition", title: "x" }); chk("üye: plan oluşturamaz", r.status === 404, r);

// roller: yönetici atar (oturumlar kapanır → uzmanlar yeniden giriş yapar)
r = await A.c.call("PUT", `/admin/users/${C1.id}/role`, { role: "coach", planKinds: ["nutrition", "training"] }); chk("yönetici: uzman rolü + plan türleri atandı", r.status === 200, r);
r = await A.c.call("PUT", `/admin/users/${C2.id}/role`, { role: "coach", planKinds: ["nutrition"] }); chk("yönetici: ikinci uzman (yalnız beslenme)", r.status === 200, r);
r = await C1.c.call("GET", "/auth/me"); chk("rol değişince eski oturum kapanır (token_version)", r.status === 401, r);
await login(C1); await login(C2);
r = await C1.c.call("GET", "/admin/clients"); chk("uzman: Authenticator olmadan panel reddedilir", r.status === 403 && r.body.requiresTotpSetup, r);
await enableTotp(C1); await enableTotp(C2);
r = await C1.c.call("PUT", `/admin/users/${M1.id}/role`, { role: "admin" }); chk("uzman: rol atayamaz (yalnız yönetici)", r.status === 403, r);
r = await C1.c.call("PUT", `/admin/members/${M1.id}/access`, { kinds: ["nutrition"] }); chk("uzman: erişim izni veremez (yalnız yönetici)", r.status === 403, r);
r = await A.c.call("PUT", `/admin/users/${A.id}/role`, { role: "user" }); chk("yönetici: kendi rolünü değiştiremez", r.status === 409, r);

// erişim izinleri ve atamalar
r = await A.c.call("PUT", `/admin/members/${M1.id}/access`, { kinds: ["nutrition", "supplement"] }); chk("yönetici: M1 erişimi = beslenme + takviye", r.status === 200, r);
r = await A.c.call("PUT", `/admin/members/${M2.id}/access`, { kinds: ["nutrition", "pharmacology"] }); chk("yönetici: M2 erişimi = beslenme + farmakoloji", r.status === 200, r);
r = await A.c.call("PUT", "/admin/assignments", { coachId: C1.id, memberId: M1.id, delivery: "online" }); chk("yönetici: C1 → M1 (online)", r.status === 200, r);
r = await A.c.call("PUT", "/admin/assignments", { coachId: C2.id, memberId: M2.id, delivery: "in_person" }); chk("yönetici: C2 → M2 (yüz yüze)", r.status === 200, r);

r = await M1.c.call("GET", "/plans/overview");
chk("üye: panel yalnız erişimi açık türleri gösterir, koçluk biçimi görünür", r.status === 200 && r.body.kinds.map((k) => k.kind).join() === "nutrition,supplement" && r.body.coaches[0]?.delivery === "online", r.body);

// ================= PLAN AKIŞI =================
r = await C1.c.call("GET", "/admin/clients"); chk("uzman: yalnız kendisine atanmış üyeyi görür", r.status === 200 && r.body.length === 1 && r.body[0].id === M1.id, r.body);
r = await C1.c.call("POST", "/admin/plans", { memberId: M2.id, kind: "nutrition", title: "Başkasının üyesi" }); chk("uzman: atanmamış üyeye plan yazamaz", r.status === 404, r);
r = await C1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "supplement", title: "Yetkisiz tür" }); chk("uzman: yetkisi olmayan türde plan yazamaz (403 forbidden_kind)", r.status === 403 && r.body.code === "forbidden_kind", r);
r = await C1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "training", title: "Erişimsiz tür" }); chk("uzman: üyenin erişimi olmayan türde plan açamaz (409 no_access)", r.status === 409 && r.body.code === "no_access", r);
r = await C1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "nutrition", title: "   " }); chk("plan: boş başlık reddedilir", r.status === 400, r);
r = await C1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "nutrition", title: "t", startsOn: "2026-12-10", endsOn: "2026-12-01" }); chk("plan: bitiş başlangıçtan önce olamaz", r.status === 400, r);
r = await C1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "nutrition", title: "Haftalık beslenme", body: "Kahvaltı: yulaf & süt <b>1</b>\nAkşam: ızgara tavuk", startsOn: "2026-11-17", endsOn: "2026-12-14" });
chk("uzman: taslak plan oluşturdu", r.status === 201 && r.body.id, r); const P1 = r.body.id;
r = await M1.c.call("GET", "/plans?kind=nutrition"); chk("üye: TASLAK plan görünmez", r.status === 200 && r.body.length === 0, r);
r = await M1.c.call("GET", "/plans/" + P1); chk("üye: taslak planı kimlikle de açamaz (404)", r.status === 404, r);
r = await C2.c.call("POST", `/admin/plans/${P1}/publish`, {}); chk("başka uzman: planı yayınlayamaz (üye ona atanmamış → 404)", r.status === 404, r);
r = await C1.c.call("POST", `/admin/plans/${P1}/publish`, {}); chk("uzman: planı yayınladı", r.status === 200, r);
r = await M1.c.call("GET", "/plans?kind=nutrition");
chk("üye: yayınlanan planı görür; hazırlayan adı ve tarihleri gösterilir", r.status === 200 && r.body.length === 1 && r.body[0].author_name === "Selin Uzman" && r.body[0].published_at && r.body[0].created_at && r.body[0].body.includes("&") && r.body[0].body.includes("<b>1</b>"), r.body);
r = await M2.c.call("GET", "/plans?kind=nutrition"); chk("başka üye: M1'in planını GÖRMEZ", r.status === 200 && r.body.length === 0, r.body);
r = await M2.c.call("GET", "/plans/" + P1); chk("başka üye: M1'in planını kimlikle de açamaz (404)", r.status === 404, r);
r = await new Client().call("GET", "/plans/" + P1); chk("misafir: plan açamaz", r.status === 401, r);
r = await M1.c.call("GET", "/notifications"); chk("üye: yayın bildirimi geldi", r.body.some((n) => n.type === "plan_published" && n.plan_id === P1), r.body);
const pubMail = await (await fetch(BASE + "/__mails?to=" + encodeURIComponent(M1.email))).json();
chk("yayın e-postası plan İÇERİĞİNİ taşımaz (gizlilik)", pubMail && !/yulaf|tavuk/.test(pubMail.text) && /Selin Uzman/.test(pubMail.text), pubMail && pubMail.text.slice(0, 200));
r = await M1.c.call("GET", "/plans?kind=supplement"); chk("üye: erişimi açık ama planı olmayan tür boş döner", r.status === 200 && r.body.length === 0, r);
r = await M1.c.call("GET", "/plans?kind=training"); chk("üye: erişimi olmayan türde plan görmez", r.status === 200 && r.body.length === 0, r);
r = await M1.c.call("GET", "/plans?kind=hack"); chk("plan türü doğrulanır (400)", r.status === 400, r);

// yönetici erişimi kaldırınca yayınlı plan da üyeden gizlenir
await A.c.call("PUT", `/admin/members/${M1.id}/access`, { kinds: ["supplement"] });
r = await M1.c.call("GET", "/plans?kind=nutrition"); chk("erişim izni kalkınca yayınlanmış plan da görünmez", r.status === 200 && r.body.length === 0, r);
await A.c.call("PUT", `/admin/members/${M1.id}/access`, { kinds: ["nutrition", "supplement"] });
r = await M1.c.call("GET", "/plans?kind=nutrition"); chk("erişim yeniden verilince plan tekrar görünür", r.body.length === 1, r);

// düzenleme / yayından kaldırma / arşiv
r = await C1.c.call("PATCH", `/admin/plans/${P1}`, { title: "Haftalık beslenme (v2)" }); chk("uzman: yayındaki planı düzenledi", r.status === 200, r);
r = await M1.c.call("GET", "/plans/" + P1); chk("üye: güncel başlığı görür", r.body.title === "Haftalık beslenme (v2)" && r.body.author_name === "Selin Uzman", r);
r = await C1.c.call("DELETE", `/admin/plans/${P1}`); chk("uzman: yayındaki planı silemez (önce yayından kaldırılmalı)", r.status === 409, r);
r = await C1.c.call("POST", `/admin/plans/${P1}/unpublish`, {}); chk("uzman: yayından kaldırdı", r.status === 200, r);
r = await M1.c.call("GET", "/plans?kind=nutrition"); chk("üye: yayından kalkan plan hemen kaybolur", r.body.length === 0, r);
r = await C1.c.call("POST", `/admin/plans/${P1}/publish`, {}); await C1.c.call("POST", `/admin/plans/${P1}/archive`, {});
r = await M1.c.call("GET", "/plans?kind=nutrition"); chk("üye: arşivlenen plan görünmez", r.body.length === 0, r);

// farmakoloji / takviye: sistem içerik üretmez; yalnız yetkili uzman girer
r = await C2.c.call("POST", "/admin/plans", { memberId: M2.id, kind: "pharmacology", title: "Yetkisiz" }); chk("farmakoloji: yetkisiz uzman plan yazamaz", r.status === 403, r);
r = await A.c.call("PUT", `/admin/users/${C2.id}/role`, { role: "coach", planKinds: ["nutrition", "pharmacology"] }); await login(C2);
r = await C2.c.call("POST", "/admin/plans", { memberId: M2.id, kind: "pharmacology", title: "Uzman girişi", body: "Yalnız uzmanın yazdığı içerik" }); chk("farmakoloji: yetki verilince uzman yazabilir (taslak)", r.status === 201, r); const P2 = r.body.id;
r = await M2.c.call("GET", "/plans?kind=pharmacology"); chk("farmakoloji: yayınlanmadan üye görmez", r.body.length === 0, r);
await C2.c.call("POST", `/admin/plans/${P2}/publish`, {});
r = await M2.c.call("GET", "/plans?kind=pharmacology"); chk("farmakoloji: yayından sonra yalnız uzmanın girdiği içerik görünür", r.body.length === 1 && r.body[0].body === "Yalnız uzmanın yazdığı içerik", r.body);
const noAuto = sql(`SELECT count(*) FROM plans WHERE author_id IS NULL AND status <> 'draft'`);
chk("sistem otomatik plan üretmez (hazırlayanı olmayan plan yok)", noAuto === "0", noAuto);

// CSRF
r = await M1.c.call("POST", "/account/logout", {}, { csrf: false }); chk("CSRF: başlıksız yazma isteği reddedilir (403)", r.status === 403, r);

// Authenticator giriş akışı + kurtarma kodu (Alpeptit ile aynı)
const T = await signup("Tuna Test", "tfa"); await enableTotp(T);
let l = await new Client().call("POST", "/auth/login", { identifier: T.username, password: PW, recaptchaToken: "t" });
chk("giriş: Authenticator açıkken ikinci adım istenir", l.status === 200 && l.body.secondFactor === "totp" && l.body.loginTicket, l);
const tc = new Client(); l = await tc.call("POST", "/auth/login", { identifier: T.username, password: PW, recaptchaToken: "t" });
let v = await tc.call("POST", "/auth/login/verify-totp", { userId: l.body.userId, loginTicket: l.body.loginTicket, token: "000000" }); chk("giriş: hatalı uygulama kodu reddedilir", v.status === 400 && v.body.error === "wrong_code", v);
v = await tc.call("POST", "/auth/login/verify-totp", { userId: l.body.userId, loginTicket: l.body.loginTicket, recoveryCode: T.backup[0] }); chk("giriş: kurtarma koduyla oturum açılır", v.status === 200 && v.body.user && v.body.recoveryUsed, v);
const tc2 = new Client(); l = await tc2.call("POST", "/auth/login", { identifier: T.username, password: PW, recaptchaToken: "t" });
v = await tc2.call("POST", "/auth/login/verify-totp", { userId: l.body.userId, loginTicket: l.body.loginTicket, recoveryCode: T.backup[0] }); chk("giriş: kurtarma kodu TEK kullanımlık", v.status === 400, v);

// 6 hatalı kod → 30 dk kilit
const L = await signup("Lale Kilit", "lck"); await enableTotp(L); let last;
for (let i = 0; i < 6; i++) { const c = new Client(); const a = await c.call("POST", "/auth/login", { identifier: L.username, password: PW, recaptchaToken: "t" }); last = await c.call("POST", "/auth/login/verify-totp", { userId: a.body.userId, loginTicket: a.body.loginTicket, token: "00000" + i }); }
chk("6 art arda hatalı kod → hesap geçici kilitlenir (30 dk)", last.status === 403 && last.body.error === "account_locked" && last.body.temporary && last.body.lockMinutes === 30, last);

// şifre sıfırlama
const R = await signup("Rana Reset", "rst"); const rc = new Client();
r = await rc.call("POST", "/auth/forgot-password", { identifier: R.username, recaptchaToken: "t" }); chk("şifre sıfırlama: istek alındı", r.status === 200 && r.body.resetId, r);
const rcode = await mailCode(R.email); const rm = await (await fetch(BASE + "/__mails?to=" + encodeURIComponent(R.email))).json();
chk("şifre sıfırlama e-postası Alpvefit bağlantısı içerir", /#sifre-sifirla=[A-Za-z0-9_-]{43}/.test(rm.text) && rm.text.includes("127.0.0.1"), rm.text.slice(0, 300));
v = await rc.call("POST", "/auth/reset-password/verify", { resetId: r.body.resetId, code: rcode }); chk("şifre sıfırlama: kod doğrulandı", v.status === 200 && v.body.ticket, v);
v = await rc.call("POST", "/auth/reset-password", { ticket: v.body.ticket, newPassword: "Kirmizi.Elma7" }); chk("şifre sıfırlama: eski şifreyle aynı olamaz", v.status === 400 && v.body.code === "same_password", v);
v = await rc.call("POST", "/auth/reset-password/verify", { resetId: r.body.resetId, code: rcode }); v = await rc.call("POST", "/auth/reset-password", { ticket: v.body.ticket, newPassword: "Mavi.Deniz82" }); chk("şifre sıfırlama: yeni şifre kaydedildi", v.status === 200 && v.body.ok, v);
r = await new Client().call("POST", "/auth/login", { identifier: R.username, password: "Mavi.Deniz82", recaptchaToken: "t" }); chk("şifre sıfırlama: yeni şifreyle giriş", r.status === 200 && r.body.user, r);

// hazırlayan adı, uzman hesabı silinse de planda kalır; üye hesabı silinince planlar da silinir
const delC = async (p) => { let q = await p.c.call("POST", "/me/request-delete", { password: PW }); const code = await mailCode(p.email); q = await p.c.call("POST", "/me/confirm-delete", { code }); return q; };
r = await delC(C2); chk("uzman hesabı silindi", r.status === 200, r);
r = await M2.c.call("GET", "/plans?kind=pharmacology"); chk("uzman silinse de üyenin planında hazırlayan adı korunur", r.body.length === 1 && r.body[0].author_name === "Burak Koç", r.body);
r = await delC(M2); chk("üye hesabı silindi", r.status === 200, r);
chk("üye silinince planları da silinir (CASCADE)", sql(`SELECT count(*) FROM plans WHERE id='${P2}'`) === "0", null);
r = await delC(A); chk("son yönetici hesabı silinemez", r.status === 409 && r.body.code === "last_admin", r);

console.log(`\n${pass} geçti, ${fail} başarısız`); process.exit(fail ? 1 : 0);
