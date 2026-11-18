// Yönetim paneli: üye arama/filtre, engelleme, süreli yasak, kalıcı yasak, forum seviyesi; sipariş ve destek filtreleri, teslim durumu,
// destek yanıtında dosya (GIF) eki, denetim kaydı filtresi. Gerçek rota kodu + gerçek PostgreSQL.
//   node --import ./tools/authsim/register.mjs tests/e2e/admin.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, enableTotp, sql, chk, finish, BASE, PW, Client } from "./lib.mjs";
import { totpCode } from "../../src/utils/totp.js";

const A = await signup("Panel Yonetici", "adm"), M1 = await signup("Uye Bir", "mbr1"), M2 = await signup("Uye Iki", "mbr2"), M3 = await signup("Uye Uc", "mbr3");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
const loginAs = async (p) => (await new Client().call("POST", "/auth/login", { identifier: p.username, password: PW, recaptchaToken: "t" }));

// ---- üye listesi / filtre ----
let r = await A.c.call("GET", "/admin/members?q=" + M1.username); chk("üye arama (kullanıcı adı)", r.status === 200 && r.body.length === 1 && r.body[0].username === M1.username, r.body);
const m = r.body[0];
chk("listede istenen sütunlar var", ["full_name", "username", "email", "created_at", "verified", "totp_enabled", "forumLevel", "reports_received", "likes", "dislikes", "state"].every((k) => k in m), Object.keys(m));
chk("varsayılan forum seviyesi: Yeni Başlayan", m.forumLevel.name === "Yeni Başlayan", m.forumLevel);
r = await A.c.call("GET", "/admin/members?totp=on"); chk("Google Auth filtresi", r.body.every((x) => x.totp_enabled) && r.body.some((x) => x.id === A.id), r.body.length);
r = await M1.c.call("GET", "/admin/members"); chk("üye yönetim listesine erişemez (404)", r.status === 404, r.status);

// ---- engelleme ----
r = await A.c.call("POST", `/admin/members/${M1.id}/block`, { reason: "x" }); chk("gerekçesiz engel reddedilir", r.status === 400, r);
r = await A.c.call("POST", `/admin/members/${A.id}/block`, { reason: "kendini engelleme" }); chk("kendini engelleyemez", r.status === 409, r);
r = await A.c.call("POST", `/admin/members/${M1.id}/block`, { reason: "Kural ihlali testi" }); chk("üye engellenir", r.status === 200, r);
r = await M1.c.call("GET", "/profile"); chk("engellenen üyenin açık oturumu kapanır", r.status === 401 || r.status === 403, r.status);
r = await loginAs(M1); chk("engellenen üye giriş yapamaz", r.status === 403 && r.body.error === "account_locked", r);
r = await A.c.call("GET", "/admin/members?state=blocked"); chk("durum filtresi: engelli", r.body.some((x) => x.id === M1.id) && r.body.every((x) => x.state === "blocked"), r.body.map((x) => x.state));
sql(`UPDATE users SET locked_reason='admin_block' WHERE id='${M1.id}'`);
// şifre sıfırlama engeli kaldırmamalı
r = await new Client().call("POST", "/auth/forgot-password", { identifier: M1.username, recaptchaToken: "t" });
const rid = r.body.resetId; const code = await (await fetch(BASE + "/__mails?to=" + encodeURIComponent(M1.email))).json().then((x) => x.text.match(/\b\d{6}\b/)[0]);
r = await new Client().call("POST", "/auth/reset-password/verify", { resetId: rid, code });
r = await new Client().call("POST", "/auth/reset-password", { ticket: r.body.ticket, newPassword: "Yepyeni.Sifre8" });
chk("yönetici engeli şifre sıfırlamayla kalkmaz", r.status === 403, r);
r = await A.c.call("POST", `/admin/members/${M1.id}/unblock`, {}); chk("engel kaldırılır", r.status === 200, r);
r = await loginAs(M1); chk("engel kalkınca giriş yapılır", r.status === 200, r);

// ---- süreli yasak ----
r = await A.c.call("POST", `/admin/members/${M2.id}/ban`, { hours: 49, reason: "Uzun yasak denemesi" }); chk("48 saatten uzun yasak reddedilir", r.status === 400, r);
r = await A.c.call("POST", `/admin/members/${M2.id}/ban`, { hours: 0, reason: "Sıfır saat denemesi" }); chk("0 saat reddedilir", r.status === 400, r);
r = await A.c.call("POST", `/admin/members/${M2.id}/ban`, { hours: 24, reason: "Spam mesajlar" }); chk("24 saat süreli yasak", r.status === 200 && r.body.until, r);
r = await loginAs(M2); chk("süreli yasaklı giriş yapamaz (bitiş zamanı bildirilir)", r.status === 403 && r.body.lockedUntil, r);
r = await A.c.call("GET", "/admin/members?state=banned"); chk("durum filtresi: süreli yasaklı", r.body.some((x) => x.id === M2.id), r.body.length);
sql(`UPDATE users SET locked_until = now() - interval '1 minute' WHERE id='${M2.id}'`);
r = await loginAs(M2); chk("süre dolunca giriş yapılır", r.status === 200, r);

// ---- forum seviyesi ----
r = await A.c.call("PUT", `/admin/members/${M2.id}/forum`, { levelOverride: 9 }); chk("geçersiz seviye reddedilir", r.status === 400, r);
r = await A.c.call("PUT", `/admin/members/${M2.id}/forum`, { levelOverride: 5, forumRole: "member" }); chk("elle seviye verilir", r.status === 200, r);
r = await A.c.call("GET", "/admin/members?q=" + M2.username); chk("elle verilen seviye: Hacim Ustası", r.body[0].forumLevel.name === "Hacim Ustası" && r.body[0].forumLevel.manual, r.body[0].forumLevel);
r = await A.c.call("PUT", `/admin/members/${M2.id}/forum`, { levelOverride: null, forumRole: "moderator" });
r = await A.c.call("GET", "/admin/members?q=" + M2.username); chk("moderatör ataması", r.body[0].forumLevel.name === "Moderatör", r.body[0].forumLevel);
sql(`UPDATE forum_profiles SET forum_role='member', posts=40, likes=30 WHERE user_id='${M2.id}'`);
r = await A.c.call("GET", "/admin/members?q=" + M2.username); chk("puana göre seviye (40×2+30×3=170 → Pump Avcısı)", r.body[0].forumLevel.name === "Pump Avcısı" && r.body[0].forumLevel.score === 170, r.body[0].forumLevel);

// ---- kalıcı yasak ----
r = await A.c.call("DELETE", `/admin/members/${M3.id}`, { reason: "Ağır kural ihlali tekrarları" }); chk("kalıcı yasak Authenticator kodu olmadan reddedilir", r.status === 400 && r.body.code === "totp_required", r);
r = await A.c.call("DELETE", `/admin/members/${M3.id}`, { reason: "Ağır kural ihlali tekrarları", token: "000000" }); chk("yanlış Authenticator kodu reddedilir", r.status === 400, r);
r = await A.c.call("DELETE", `/admin/members/${M3.id}`, { reason: "Ağır kural ihlali tekrarları", token: totpCode(A.secret, Date.now() + 30000) }); chk("kalıcı yasak uygulanır", r.status === 200, r);
chk("üye silindi", sql(`SELECT count(*) FROM users WHERE id='${M3.id}'`) === "0", null);
r = await new Client().call("POST", "/auth/register", { fullName: "Uye Uc", username: "yeni" + M3.username.slice(-6), email: M3.email, password: PW, recaptchaToken: "t", kvkkAccepted: true, aboutAccepted: true });
chk("kalıcı yasaklı e-posta yeniden kayıt olamaz", r.status === 403 && r.body.code === "banned", r);
chk("e-postanın kendisi saklanmaz (yalnız özet)", sql(`SELECT count(*) FROM banned_emails WHERE email_hash = '${M3.email}'`) === "0" && sql(`SELECT count(*) FROM banned_emails`) !== "0", null);

// ---- siparişler: filtre + teslim durumu ----
const oid = sql(`INSERT INTO orders (user_id, order_number, buyer_name, buyer_email, package_key, weeks, pharmacology, list_price, subtotal, currency, status, paid_at, plans_due_at, consent_at) VALUES ('${M1.id}', 'AVF-T${Date.now() % 100000}', 'Uye Bir', '${M1.email}', 'starter', 4, false, 100, 100, 'TRY', 'paid', now(), now() + interval '1 day', now()) RETURNING id`).split("\n")[0];
r = await A.c.call("GET", "/admin/orders?q=" + M1.username); chk("sipariş arama (kullanıcı adı)", r.status === 200 && r.body.some((o) => o.id === oid && o.username === M1.username), r.body.length);
r = await A.c.call("GET", "/admin/orders?delivery=delivered"); chk("teslim filtresi (henüz yok)", !r.body.some((o) => o.id === oid), r.body.length);
r = await A.c.call("PATCH", `/admin/orders/${oid}/delivery`, { status: "uzayda" }); chk("geçersiz teslim durumu reddedilir", r.status === 400, r);
r = await A.c.call("PATCH", `/admin/orders/${oid}/delivery`, { status: "delivered" }); chk("teslim edildi olarak işaretlenir", r.status === 200, r);
r = await A.c.call("GET", "/admin/orders?delivery=delivered"); chk("teslim filtresi", r.body.some((o) => o.id === oid && o.delivered_at), r.body.length);

// ---- destek: filtre, GIF ekli yanıt, üye eki görür ----
const M1b = new Client(); await M1b.call("POST", "/auth/login", { identifier: M1.username, password: PW, recaptchaToken: "t" });
r = await M1b.call("POST", "/tickets", { title: "Filtre deneme", subject: "Teknik Sorunlar", message: "Merhaba" }); const tid = r.body.id;
r = await A.c.call("GET", "/admin/tickets?subject=" + encodeURIComponent("Teknik Sorunlar") + "&q=" + M1.username); chk("destek filtresi (konu + kullanıcı adı)", r.body.length === 1 && r.body[0].username === M1.username, r.body);
r = await A.c.call("GET", "/admin/tickets?status=closed&q=" + M1.username); chk("durum filtresi", r.body.length === 0, r.body);
const GIF = Buffer.concat([Buffer.from("GIF89a"), Buffer.alloc(40, 1)]);
const upl = async (p, scope, name, buf, type) => { const h = { cookie: p.c ? p.c.cookieHeader() : p.cookieHeader(), origin: BASE, "content-type": "application/octet-stream", "x-file-name": encodeURIComponent(name), "x-file-type": type }; const jar = p.c ? p.c.jar : p.jar; if (jar.avf_csrf) h["x-csrf-token"] = jar.avf_csrf; const x = await fetch(BASE + "/api/uploads/" + scope, { method: "POST", headers: h, body: buf }); return { status: x.status, body: await x.json() }; };
let u = await upl(M1b, "profile", "a.gif", GIF, "image/gif"); chk("GIF kişisel bilgide kabul edilmez", u.status === 400, u);
u = await upl(A, "ticket", "tamam.gif", GIF, "image/gif"); chk("GIF destek ekinde kabul edilir", u.status === 201 && u.body.mime === "image/gif", u);
r = await A.c.call("POST", `/admin/tickets/${tid}/reply`, { message: "Çözüm ektedir 👍", attachments: [u.body.id] }); chk("yönetici GIF ekli yanıt gönderir", r.status === 201, r);
r = await M1b.call("GET", "/tickets/" + tid); const am = r.body.messages.find((x) => x.from_role === "support");
chk("üye yanıttaki eki görür (liste)", am && am.attachments.length === 1, am);
let g = await fetch(BASE + "/api/attachments/" + u.body.id, { headers: { cookie: M1b.cookieHeader() } }); chk("üye destek ekibinin ekini açabilir", g.status === 200 && g.headers.get("content-type") === "image/gif", g.status);
g = await fetch(BASE + "/api/attachments/" + u.body.id, { headers: { cookie: M2.c.cookieHeader() } }); chk("başka üye o eki açamaz", g.status === 404 || g.status === 401, g.status);

// ---- denetim kaydı ----
r = await A.c.call("GET", "/admin/audit?action=member_ban"); chk("denetim: işlem filtresi", r.body.length >= 1 && r.body.every((x) => x.action === "member_ban") && r.body[0].details.hours === 24, r.body[0]);
r = await A.c.call("GET", "/admin/audit?q=" + M2.username); chk("denetim: kişi araması (hedef kullanıcı adı)", r.body.length >= 2, r.body.length);
r = await A.c.call("GET", "/admin/audit/actions"); chk("denetim: işlem listesi", r.body.some((x) => x.action === "member_perma_ban"), r.body);
r = await A.c.call("GET", "/admin/blog"); chk("blog yönetimi kaldırıldı", r.status === 404, r.status);
finish();
