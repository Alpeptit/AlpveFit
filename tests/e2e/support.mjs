// Destek talebi (ticket) ve yönetici yanıtları; kaldırılan canlı destek uçlarının kapalı olduğu — gerçek rota kodu + gerçek PostgreSQL.
//   node --import ./tools/authsim/register.mjs tests/e2e/support.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { Client, signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";

const M1 = await signup("Deniz Destek", "sup1"), M2 = await signup("Ece Başka", "sup2"), C1 = await signup("Koç Destek", "supc"), A = await signup("Destek Yonetici", "supa");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
await A.c.call("PUT", `/admin/users/${C1.id}/role`, { role: "coach", planKinds: ["nutrition"] });
// ---- canlı destek kaldırıldı: eski uçlar artık yok ----
let r = await new Client().call("GET", "/live-chat/status"); chk("canlı destek durumu ucu yok (404)", r.status === 404, r);
r = await M1.c.call("POST", "/live-chat/start", {}); chk("canlı destek başlatma ucu yok (404)", r.status === 404, r);
r = await A.c.call("GET", "/admin/live-chats"); chk("yönetici canlı destek listesi ucu yok (404)", r.status === 404, r);
r = await A.c.call("GET", "/admin/support/summary"); chk("özet yalnız açık talepleri sayar", r.status === 200 && typeof r.body.tickets === "number" && !("chats" in r.body), r.body);
const page = (c, path) => fetch(BASE + path, { redirect: "manual", headers: c ? { cookie: c.cookieHeader() } : {} });
let pr = await page(null, "/admin"); chk("/admin misafire genel 404", pr.status === 404, pr.status);
pr = await page(M1.c, "/admin"); chk("/admin üyeye genel 404", pr.status === 404, pr.status);
pr = await page(A.c, "/admin"); chk("/admin yöneticiyi /uzman'a yönlendirir", pr.status === 302 && pr.headers.get("location") === "/uzman", pr.status);
r = await C1.c.call("GET", "/admin/tickets"); chk("uzman (koç) destek taleplerine erişemez", r.status === 403 || r.status === 404, r);

// ---- destek talebi ----
r = await new Client().call("POST", "/tickets", { title: "Yardım", subject: "Diğer", message: "x" }); chk("ticket için giriş gerekir", r.status === 401, r);
r = await M1.c.call("POST", "/tickets", { title: "Ödeme sorusu", subject: "Bilinmeyen", message: "Merhaba" }); chk("geçersiz konu reddedilir", r.status === 400, r);
r = await M1.c.call("POST", "/tickets", { title: "Ödeme sorusu", subject: "Ödeme Sorunları", message: "Kartla ödeme yapabilir miyim?" });
chk("üye destek talebi oluşturur (T-######)", r.status === 201 && /^T-\d{6}$/.test(r.body.ticket_number), r);
const tid = r.body.id, tnum = r.body.ticket_number;
r = await M2.c.call("GET", `/tickets/${tid}`); chk("başka üye talebi göremez", r.status === 404, r);
r = await M1.c.call("POST", `/tickets/${tid}/messages`, { message: "Ek bilgi" }); chk("art arda mesajda kısa bekleme", r.status === 429, r);
r = await A.c.call("GET", "/admin/tickets"); chk("yönetici talepleri görür", r.status === 200 && r.body.some((t) => t.id === tid), r);
r = await A.c.call("POST", `/admin/tickets/${tid}/reply`, { message: "Evet, kredi ve banka kartı kabul edilir." }); chk("yönetici yanıtlar", r.status === 201, r);
r = await M1.c.call("GET", `/tickets/${tid}`); chk("üye yanıtı görür, durum: yanıtlandı", r.status === 200 && r.body.status === "answered" && r.body.messages.length === 2, r.body);
r = await M1.c.call("GET", "/notifications"); chk("üyeye 'yanıt verildi' bildirimi", r.body.some((n) => n.type === "ticket" && n.text.includes(tnum)), r.body);
r = await M1.c.call("POST", `/tickets/${tid}/resolve`, {}); chk("üye talebi çözüldü olarak kapatır", r.status === 200 && r.body.status === "closed", r);
r = await M1.c.call("POST", `/tickets/${tid}/messages`, { message: "Bir şey daha" }); chk("kapalı talebe mesaj eklenemez", r.status === 409, r);
r = await A.c.call("POST", `/admin/tickets/${tid}/reply`, { message: "x" }); chk("kapalı talebe yönetici yanıtı verilemez", r.status === 409, r);
chk("denetim kaydı: ticket yanıtı", Number(sql(`SELECT count(*) FROM audit_log WHERE action = 'ticket_reply'`)) >= 1, null);
finish();
