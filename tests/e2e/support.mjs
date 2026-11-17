// Canlı destek (misafir + üye), çevrimdışı mesaj, destek talebi (ticket) ve yönetici yanıtları — gerçek rota kodu + gerçek PostgreSQL.
//   node --import ./tools/authsim/register.mjs tests/e2e/support.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { Client, signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";

const guest = async (method, path, body, token, origin = BASE) => {
  const headers = { "content-type": "application/json" }; if (origin) headers.origin = origin; if (token) headers["x-chat-token"] = token;
  const r = await fetch(BASE + "/api" + path, { method, headers, body: method === "GET" ? undefined : JSON.stringify(body || {}) });
  let data = null; try { data = await r.json(); } catch { /* boş */ } return { status: r.status, body: data };
};
const M1 = await signup("Deniz Destek", "sup1"), M2 = await signup("Ece Başka", "sup2"), C1 = await signup("Koç Destek", "supc"), A = await signup("Destek Yonetici", "supa");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
await A.c.call("PUT", `/admin/users/${C1.id}/role`, { role: "coach", planKinds: ["nutrition"] });
sql(`UPDATE support_status SET mode='online' WHERE id=1`);

// ---- canlı destek: misafir ----
let r = await guest("GET", "/live-chat/status"); chk("durum herkese açık (çevrimiçi)", r.status === 200 && r.body.online === true, r);
r = await guest("POST", "/live-chat/start", { name: "Ali Veli", email: "ali@example.test" }, null, null); chk("misafir başlatma Origin olmadan reddedilir", r.status === 403, r);
r = await guest("POST", "/live-chat/start", { name: "Ali 123", email: "ali@example.test" }); chk("misafir adı sayı içeremez", r.status === 400, r);
r = await guest("POST", "/live-chat/start", { name: "Ali Veli", email: "ali@example.test" });
chk("misafir görüşme başlatır, anahtar bir kez döner", r.status === 201 && r.body.guestToken && r.body.member === false, r);
const gid = r.body.chatId, gtok = r.body.guestToken;
chk("anahtar veritabanında düz metin tutulmaz (SHA-256 özeti)", sql(`SELECT guest_token_hash FROM live_chats WHERE id='${gid}'`).length === 64 && !sql(`SELECT guest_token_hash FROM live_chats WHERE id='${gid}'`).includes(gtok), null);
r = await guest("POST", `/live-chat/${gid}/messages`, { message: "Merhaba, bilgi almak istiyorum." }, gtok); chk("misafir mesaj gönderir", r.status === 201, r);
r = await guest("GET", `/live-chat/${gid}/messages`, null, "yanlis-anahtar"); chk("yanlış anahtarla görüşme okunamaz (404)", r.status === 404, r);
r = await M2.c.call("GET", `/live-chat/${gid}/messages`); chk("başka üye misafir görüşmesini okuyamaz", r.status === 404, r);

// ---- yönetici ----
r = await C1.c.call("GET", "/admin/live-chats"); chk("uzman (koç) canlı destek listesine erişemez", r.status === 403 || r.status === 404, r);
r = await A.c.call("GET", "/admin/live-chats"); chk("yönetici açık görüşmeleri ve okunmamış sayısını görür", r.status === 200 && r.body.some((c) => c.id === gid && c.unread === 1), r.body);
r = await A.c.call("POST", `/admin/live-chats/${gid}/messages`, { message: "Merhaba, nasıl yardımcı olabilirim?" }); chk("yönetici yanıtlar (AlpveFit Destek adıyla)", r.status === 201 && r.body.agent_name === "AlpveFit Destek", r);
r = await guest("GET", `/live-chat/${gid}/messages`, null, gtok); chk("misafir yanıtı görür", r.status === 200 && r.body.messages.length === 2 && r.body.messages[1].sender === "admin", r.body);
r = await A.c.call("PATCH", `/admin/live-chats/${gid}/close`, {}); chk("kapatma açık onay ister", r.status === 400, r);
r = await A.c.call("PATCH", `/admin/live-chats/${gid}/close`, { confirmed: true }); chk("yönetici görüşmeyi kapatır", r.status === 200, r);
r = await guest("POST", `/live-chat/${gid}/messages`, { message: "tekrar" }, gtok); chk("kapalı görüşmeye mesaj gönderilemez (409)", r.status === 409, r);

// ---- canlı destek: üye ----
r = await M1.c.call("POST", "/live-chat/start", {}); chk("üye görüşme başlatır (anahtarsız)", r.status === 201 && r.body.member === true && !r.body.guestToken, r);
const mid = r.body.chatId;
r = await M1.c.call("POST", "/live-chat/start", {}); chk("üyenin tek açık görüşmesi olur", r.status === 200 && r.body.chatId === mid, r);
r = await M1.c.call("POST", `/live-chat/${mid}/messages`, { message: "Üye mesajı" }, { csrf: false }); chk("üye isteği CSRF belirteci olmadan reddedilir", r.status === 403, r);
r = await guest("GET", `/live-chat/${mid}/messages`, null, gtok); chk("üye görüşmesine misafir anahtarıyla erişilemez", r.status === 404, r);

// ---- çevrimdışı ----
r = await A.c.call("PATCH", "/admin/support-status", { mode: "offline" }); chk("yönetici durumu çevrimdışı yapar", r.status === 200 && r.body.online === false, r);
r = await guest("POST", "/live-chat/start", { name: "Zeynep Ak", email: "z@example.test" }); chk("çevrimdışıyken yeni görüşme açılmaz", r.status === 409 && r.body.code === "SUPPORT_OFFLINE", r);
r = await guest("POST", "/live-chat/offline-message", { name: "Zeynep Ak", email: "z@example.test", message: "Dönüş bekliyorum." }); chk("çevrimdışı mesaj bırakılır", r.status === 201, r);
for (let i = 0; i < 2; i++) await guest("POST", "/live-chat/offline-message", { name: "Zeynep Ak", email: "z@example.test", message: "Tekrar " + i });
r = await guest("POST", "/live-chat/offline-message", { name: "Zeynep Ak", email: "z@example.test", message: "Fazla" }); chk("çevrimdışı mesaj saatlik sınırı (3)", r.status === 429, r);
r = await A.c.call("GET", "/admin/offline-messages"); const off = r.body.find((o) => o.email === "z@example.test"); chk("yönetici çevrimdışı mesajları görür", r.status === 200 && !!off, r);
r = await A.c.call("PATCH", `/admin/offline-messages/${off.id}`, { status: "answered" }); chk("yönetici mesajı yanıtlandı işaretler", r.status === 200 && r.body.status === "answered", r);
r = await A.c.call("PATCH", "/admin/support-status", { openHour: 22, closeHour: 9 }); chk("geçersiz çalışma saatleri reddedilir", r.status === 400, r);
await A.c.call("PATCH", "/admin/support-status", { mode: "auto" });

// ---- destek talebi ----
r = await new Client().call("POST", "/tickets", { title: "Yardım", subject: "Diğer", message: "x" }); chk("ticket için giriş gerekir", r.status === 401, r);
r = await M1.c.call("POST", "/tickets", { title: "Ödeme sorusu", subject: "Bilinmeyen", message: "Merhaba" }); chk("geçersiz konu reddedilir", r.status === 400, r);
r = await M1.c.call("POST", "/tickets", { title: "Ödeme sorusu", subject: "Paketler ve ödeme", message: "Kartla ödeme yapabilir miyim?" });
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
chk("denetim kaydı: canlı destek ve ticket yanıtları", Number(sql(`SELECT count(*) FROM audit_log WHERE action IN ('live_chat_reply','ticket_reply','live_chat_close')`)) >= 3, null);
finish();
