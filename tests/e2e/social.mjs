// Arkadaşlar ve özel mesajlar, mesaj şikâyeti, ağırlık takibi, kan tahlili, destekte plan seçimi, kolay yasak kaldırma, "Siz" uzman ataması.
//   node --import ./tools/authsim/register.mjs tests/e2e/social.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, enableTotp, sql, chk, finish, BASE, Client, PW } from "./lib.mjs";

const A = await signup("Sosyal Yonetici", "soa"), U = await signup("Ali Veli", "sou"), V = await signup("Ayse Kaya", "sov"), W = await signup("Can Demir", "sow");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
const raw = async (p, path, buf) => { const r = await fetch(BASE + path, { method: "POST", headers: { cookie: p.c.cookieHeader(), origin: BASE, "content-type": "application/octet-stream", "x-csrf-token": p.c.jar.avf_csrf }, body: buf }); let d = null; try { d = await r.json(); } catch {} return { status: r.status, body: d }; };
const png = (w, h) => { const b = Buffer.alloc(40); Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0); b.writeUInt32BE(13, 8); b.write("IHDR", 12, "ascii"); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); return b; };

// ---------------- arkadaşlık ----------------
let r = await U.c.call("GET", "/friends/search?q=" + V.username.slice(0, 5)); chk("kullanıcı adıyla arama", r.status === 200 && r.body.some((x) => x.username === V.username && x.relation === "none" && !("email" in x)), r.body);
r = await U.c.call("GET", "/friends/search?q=ab"); chk("en az 3 karakter", r.status === 200 && r.body.length === 0, r.body);
r = await U.c.call("POST", "/friends/request", { username: U.username }); chk("kendine istek gönderilemez", r.status === 404, r.body);
r = await U.c.call("POST", "/friends/request", { username: "@" + V.username }); chk("istek gönderilir", r.status === 201 && r.body.status === "outgoing", r.body);
r = await V.c.call("GET", "/friends"); chk("karşı taraf gelen isteği görür", r.body.incoming.length === 1 && r.body.incoming[0].username === U.username, r.body);
r = await V.c.call("GET", "/friends/summary"); chk("bekleyen istek sayacı", r.body.pending === 1, r.body);
r = await V.c.call("GET", "/notifications"); chk("istek bildirimi", r.body.some((n) => n.type === "friend"), r.body.map((n) => n.type));
r = await U.c.call("POST", `/friends/${V.id}/accept`, {}); chk("gönderen kendi isteğini kabul edemez", r.status === 404, r.body);
r = await V.c.call("POST", `/friends/${U.id}/accept`, {}); chk("istek kabul edilir", r.status === 200, r.body);
r = await U.c.call("GET", "/friends"); chk("arkadaş listesinde", r.body.friends.some((f) => f.id === V.id), r.body);

// ---------------- mesajlaşma seviyesi ----------------
r = await U.c.call("POST", `/messages/${V.id}`, { body: "Merhaba" }); chk("seviye düşükken mesaj gönderilemez", r.status === 403 && r.body.code === "level", r.body);
sql(`INSERT INTO forum_profiles (user_id, posts, likes) VALUES ('${U.id}', 40, 30), ('${V.id}', 40, 30) ON CONFLICT (user_id) DO UPDATE SET posts = 40, likes = 30`);
r = await U.c.call("POST", `/messages/${W.id}`, { body: "Selam" }); chk("arkadaş olmayana mesaj gönderilemez", r.status === 403 && r.body.code === "not_friends", r.body);
r = await U.c.call("POST", `/messages/${V.id}`, { body: "" }); chk("boş mesaj reddedilir", r.status === 400, r.body);
r = await U.c.call("POST", `/messages/${V.id}`, { body: "x".repeat(2001) }); chk("2000 karakter sınırı", r.status === 400, r.body);
r = await U.c.call("POST", `/messages/${V.id}`, { body: "Merhaba <script>alert(1)</script> 💪" }); chk("mesaj gönderilir", r.status === 201, r.body);
const m1 = r.body.id;
r = await V.c.call("GET", "/friends/summary"); chk("okunmamış mesaj sayacı", r.body.dmUnread === 1, r.body);
r = await V.c.call("GET", `/messages/${U.id}`); chk("alıcı mesajı görür (metin olarak)", r.body.messages.length === 1 && r.body.messages[0].body.includes("<script>") && !r.body.messages[0].mine && r.body.canMessage, r.body);
r = await V.c.call("GET", "/friends/summary"); chk("açınca okundu olur", r.body.dmUnread === 0, r.body);
r = await U.c.call("GET", `/messages/${V.id}`); chk("gönderen okundu bilgisini görür", r.body.messages[0].read === true && r.body.messages[0].mine, r.body.messages);
r = await raw(U, `/api/messages/${V.id}/image`, Buffer.from("<svg/>")); chk("görsel olmayan dosya mesajla gönderilemez", r.status === 400, r.body);
r = await raw(U, `/api/messages/${V.id}/image`, png(320, 240)); chk("görsel mesaj gönderilir", r.status === 201 && r.body.imageId, r.body);
const img = r.body.imageId;
let f = await fetch(BASE + "/api/dm-media/" + img, { headers: { cookie: V.c.cookieHeader() } }); chk("alıcı görseli görür", f.status === 200, f.status);
f = await fetch(BASE + "/api/dm-media/" + img, { headers: { cookie: W.c.cookieHeader() } }); chk("üçüncü kişi görseli göremez", f.status === 404, f.status);
f = await fetch(BASE + "/api/forum/media/" + img); chk("mesaj görseli herkese açık yoldan sunulmaz", f.status === 404, f.status);
r = await W.c.call("GET", `/messages/${U.id}`); chk("üçüncü kişi sohbeti okuyamaz", r.status === 403, r.body);

// ---------------- şikâyet ----------------
r = await U.c.call("POST", `/messages/m/${m1}/report`, { reason: "abuse" }); chk("kendi gönderdiği mesajı şikâyet edemez", r.status === 404, r.body);
r = await V.c.call("POST", `/messages/m/${m1}/report`, { reason: "xxx" }); chk("şikâyet nedeni doğrulanır", r.status === 400, r.body);
r = await V.c.call("POST", `/messages/m/${m1}/report`, { reason: "abuse", note: "Rahatsız edici" }); chk("alınan mesaj şikâyet edilir", r.status === 201, r.body);
r = await U.c.call("GET", "/admin/dm-reports"); chk("üye şikâyetleri göremez", r.status === 403 || r.status === 404, r.status);
r = await A.c.call("GET", "/admin/dm-reports"); chk("yönetici açık şikâyeti görür", r.body.length === 1 && r.body[0].sender === U.username && r.body[0].reporter === V.username, r.body);
const rep = r.body[0].id;
r = await A.c.call("GET", `/admin/dm-reports/${rep}/context`); chk("yönetici bağlamı görür", r.status === 200 && r.body.some((m) => m.id === m1), r.body);
f = await fetch(BASE + "/api/admin/dm-media/" + img, { headers: { cookie: A.c.cookieHeader() } }); chk("yönetici şikâyetli sohbetteki görseli görür", f.status === 200, f.status);
r = await U.c.call("GET", "/notifications"); chk("gönderene incelendiğine dair bildirim gitmez", !r.body.some((n) => /şikâyet|incelen/i.test(n.text)), r.body.map((n) => n.text));
r = await A.c.call("POST", `/admin/dm-reports/${rep}`, { action: "uphold", removeMessage: true }); chk("şikâyet haklı bulunur, mesaj kaldırılır", r.status === 200, r.body);
r = await A.c.call("POST", `/admin/dm-reports/${rep}`, { action: "dismiss" }); chk("sonuçlanan şikâyet tekrar işlenmez", r.status === 409, r.body);
r = await V.c.call("GET", `/messages/${U.id}`); chk("kaldırılan mesajın içeriği gösterilmez", r.body.messages.find((m) => m.id === m1).removed === true && r.body.messages.find((m) => m.id === m1).body === "", r.body.messages);
chk("haklı şikâyet gönderenin forum kaydına işlenir", sql(`SELECT reports_upheld FROM forum_profiles WHERE user_id='${U.id}'`) === "1", null);
r = await V.c.call("GET", "/notifications"); chk("şikâyet edene sonuç bildirimi", r.body.some((n) => /Şikâyetiniz incelendi/.test(n.text)), r.body.map((n) => n.text));
r = await V.c.call("DELETE", `/messages/m/${m1}`); r = await V.c.call("GET", `/messages/${U.id}`); chk("mesaj kendinden silinir", !r.body.messages.some((m) => m.id === m1), r.body.messages);
r = await U.c.call("GET", `/messages/${V.id}`); chk("karşı tarafta kalır", r.body.messages.some((m) => m.id === m1), null);

// ---------------- engelleme ----------------
r = await V.c.call("POST", `/friends/${U.id}/block`, {}); chk("engellenir", r.status === 200, r.body);
r = await U.c.call("POST", `/messages/${V.id}`, { body: "hey" }); chk("engellenen mesaj gönderemez", r.status === 403, r.body);
r = await U.c.call("POST", "/friends/request", { username: V.username }); chk("engellenen istek gönderemez (bilgi sızmaz)", r.status === 404, r.body);
r = await U.c.call("GET", "/friends/search?q=" + V.username); chk("engelleyen aramada görünmez", !r.body.some((x) => x.id === V.id), r.body);
r = await V.c.call("GET", "/friends"); chk("engellenenler listesinde", r.body.blocked.some((x) => x.id === U.id), r.body);
r = await U.c.call("DELETE", `/friends/${V.id}`); r = await V.c.call("GET", "/friends"); chk("engelleneni karşı taraf kaldıramaz", r.body.blocked.some((x) => x.id === U.id), r.body);
r = await U.c.call("POST", `/friends/${V.id}/block`, {}); r = await U.c.call("DELETE", `/friends/${V.id}`); r = await V.c.call("GET", "/friends");
chk("engellenen, kendisi de engelleyip silerek engeli devralıp kaldıramaz", r.body.blocked.some((x) => x.id === U.id), r.body);
r = await U.c.call("POST", "/friends/request", { username: V.username }); chk("engelleyene istek gönderilemez", r.status === 404, r);
r = await V.c.call("DELETE", `/friends/${U.id}`); r = await V.c.call("GET", "/friends"); chk("engel kaldırılır", !r.body.blocked.length, r.body);

// ---------------- ağırlık takibi ----------------
for (const k of ["training", "nutrition"]) sql(`INSERT INTO member_access (member_id, kind) VALUES ('${W.id}', '${k}') ON CONFLICT DO NOTHING`);
r = await W.c.call("GET", "/progress"); chk("antrenman planı yokken hareket listesi boş", r.status === 200 && r.body.exercises.length === 0, r.body);
r = await A.c.call("POST", "/admin/plans", { memberId: W.id, kind: "training", title: "Push", data: { days: [{ title: "Gün 1", groups: ["chest", "cardio"], exercises: [{ group: "chest", name: "Bench Press", sets: 4, reps: "8" }, { group: "cardio", name: "Eliptik", minutes: 20 }] }] } });
chk("antrenman planı kaydedilir", r.status === 201 && r.body.status === "published", r.body);
r = await W.c.call("GET", "/progress"); chk("koçun hareketleri (kardiyo hariç) listelenir", r.body.exercises.length === 1 && r.body.exercises[0].name === "Bench Press", r.body);
const today = new Date().toISOString().slice(0, 10);
r = await W.c.call("POST", "/progress", { exercise: "Squat", date: today, weightKg: 100, reps: 5 }); chk("koçun belirlemediği hareket girilemez", r.status === 400 && r.body.field === "exercise", r.body);
r = await W.c.call("POST", "/progress", { exercise: "Bench Press", date: "2099-01-01", weightKg: 100, reps: 5 }); chk("ileri tarih girilemez", r.status === 400, r.body);
r = await W.c.call("POST", "/progress", { exercise: "Bench Press", date: today, weightKg: 1000, reps: 5 }); chk("ağırlık sınırı", r.status === 400, r.body);
r = await W.c.call("POST", "/progress", { exercise: "Bench Press", date: today, weightKg: 80, reps: 8, sets: 4, rpe: 11 }); chk("zorlanma 1–10", r.status === 400, r.body);
r = await W.c.call("POST", "/progress", { exercise: "Bench Press", date: "2026-11-01", weightKg: 75, reps: 8, sets: 4, rpe: 8 }); chk("kayıt eklenir", r.status === 201, r.body);
r = await W.c.call("POST", "/progress", { exercise: "Bench Press", date: today, weightKg: 82.5, reps: 6, sets: 3, rpe: 9, note: "iyi gün" }); const lid = r.body.id;
r = await W.c.call("GET", "/progress"); chk("kayıtlar tarih sırasıyla döner", r.body.logs.length === 2 && r.body.logs[0].weight_kg === 82.5 && r.body.logs[0].note === "iyi gün", r.body.logs);
r = await A.c.call("GET", `/admin/clients/${W.id}/progress`); chk("yönetici üyenin kayıtlarını görür", r.status === 200 && r.body.logs.length === 2, r.body);
r = await U.c.call("GET", `/admin/clients/${W.id}/progress`); chk("üye başkasının kayıtlarını göremez", r.status === 403 || r.status === 404, r.status);
r = await U.c.call("DELETE", `/progress/${lid}`); chk("başkasının kaydı silinemez", r.status === 404, r.body);
r = await W.c.call("DELETE", `/progress/${lid}`); chk("kendi kaydı silinir", r.status === 200, r.body);

// ---------------- kan tahlili ----------------
r = await W.c.call("PUT", "/profile", { heightCm: 180, healthConsent: true }); chk("profil + rıza", r.status === 200, r.body);
const up = (p, name, type, buf) => fetch(BASE + "/api/uploads/blood", { method: "POST", headers: { cookie: p.c.cookieHeader(), origin: BASE, "content-type": "application/octet-stream", "x-csrf-token": p.c.jar.avf_csrf, "x-file-name": encodeURIComponent(name), "x-file-type": type }, body: buf }).then(async (x) => ({ status: x.status, body: await x.json() }));
const pdf = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF");
r = await up(U, "tahlil.png", "image/png", png(800, 1000)); chk("rıza olmadan kan tahlili eklenemez", r.status === 400, r.body);
r = await up(W, "tahlil.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", Buffer.from("PK\x03\x04xx")); chk("kan tahlilinde yalnız görsel / PDF", r.status === 400, r.body);
r = await up(W, "tahlil1.png", "image/png", png(800, 1000)); chk("kan tahlili görseli eklenir", r.status === 201 && r.body.scope === "blood", r.body);
r = await up(W, "tahlil2.pdf", "application/pdf", pdf); chk("ikinci dosya (PDF) eklenir", r.status === 201, r.body);
r = await up(W, "tahlil3.png", "image/png", png(800, 1000)); chk("en fazla 2 dosya", r.status === 400, r.body);
r = await W.c.call("GET", "/uploads/blood"); chk("liste", r.body.length === 2, r.body);
r = await A.c.call("GET", `/admin/clients/${W.id}/files`); chk("yönetici kan tahlilini görür", r.body.filter((x) => x.scope === "blood").length === 2, r.body);

// ---------------- destek: plan seçimi ----------------
r = await W.c.call("POST", "/tickets", { title: "Programım hakkında", subject: "Plan ve Programım", message: "Merhaba" }); chk("plan seçilmeden gönderilemez", r.status === 400 && r.body.field === "planKind", r.body);
r = await W.c.call("POST", "/tickets", { title: "Programım hakkında", subject: "Plan ve Programım", planKind: "pharmacology", message: "Merhaba" }); chk("erişimi olmayan plan seçilemez", r.status === 400, r.body);
r = await W.c.call("POST", "/tickets", { title: "Programım hakkında", subject: "Plan ve Programım", planKind: "training", message: "Merhaba" }); chk("plan seçilerek talep açılır", r.status === 201 && r.body.plan_kind === "training", r.body);
r = await A.c.call("GET", "/admin/tickets"); chk("yönetici listede ilgili planı görür", r.body.some((t) => t.plan_kind === "training"), null);

// ---------------- yasak kaldırma ve "Siz" ataması ----------------
r = await A.c.call("POST", `/admin/members/${W.id}/ban`, { hours: 2, reason: "Test amaçlı geçici yasak" }); chk("süreli yasak", r.status === 200, r.body);
r = await A.c.call("POST", `/admin/members/${W.id}/unblock`, {}); chk("yasak tek adımda kaldırılır", r.status === 200, r.body);
const W2 = new Client(); r = await W2.call("POST", "/auth/login", { identifier: W.username, password: PW, recaptchaToken: "t" }); chk("yasak kalkınca giriş yapılır", r.status === 200, r.body);
r = await A.c.call("PUT", "/admin/assignments", { coachId: A.id, memberId: W.id }); chk("yönetici kendini uzman olarak atar", r.status === 200, r.body);
r = await W2.call("GET", "/plans/overview"); chk("üye koçunu görür", r.body.coaches.some((c) => c.name === "Sosyal Yonetici"), r.body);
r = await A.c.call("GET", "/admin/me"); chk("panel kimliği döner", r.body.id === A.id, r.body);
finish();
