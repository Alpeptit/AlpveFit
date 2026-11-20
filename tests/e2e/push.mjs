// Telefona bildirim (Web Push): anahtar, abonelik (yalnız bilinen itme hizmetleri), son bildirimin kısa metni, çıkış.
//   node --import ./tools/authsim/register.mjs tests/e2e/push.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, sql, chk, finish, BASE } from "./lib.mjs";

const U = await signup("Push Uye", "pu"), V = await signup("Push Diger", "pv");
let r = await fetch(BASE + "/api/push/key").then((x) => x.json());
chk("açık anahtar: 65 baytlık P-256 noktası (base64url)", /^[A-Za-z0-9_-]{86,88}$/.test(r.key) && Buffer.from(r.key, "base64url").length === 65 && Buffer.from(r.key, "base64url")[0] === 4, r.key);
const k2 = await fetch(BASE + "/api/push/key").then((x) => x.json());
chk("anahtar kalıcı (her istekte aynı)", k2.key === r.key, "");
r = await fetch(BASE + "/api/push/subscribe", { method: "POST", headers: { "content-type": "application/json", origin: BASE }, body: JSON.stringify({ endpoint: "https://fcm.googleapis.com/fcm/send/x" }) });
chk("girişsiz abonelik yok", r.status === 401, r.status);
for (const bad of ["https://evil.example/push", "http://fcm.googleapis.com/x", "https://169.254.169.254/latest/meta-data", "https://fcm.googleapis.com.evil.io/x"]) {
  r = await U.c.call("POST", "/push/subscribe", { endpoint: bad }); chk("bilinmeyen / güvensiz adres reddedilir: " + bad, r.status === 400, r.body);
}
const ep = "https://fcm.googleapis.com/fcm/send/test-" + Date.now();
r = await U.c.call("POST", "/push/subscribe", { endpoint: ep }); chk("geçerli abonelik kaydedilir", r.status === 201, r.body);
r = await U.c.call("GET", "/push/status"); chk("cihaz sayısı 1", r.body.devices === 1, r.body);
r = await V.c.call("POST", "/push/subscribe", { endpoint: ep }); chk("aynı cihaz başka hesaba geçince abonelik taşınır", r.status === 201, r.body);
r = await U.c.call("GET", "/push/status"); chk("önceki hesapta abonelik kalmaz", r.body.devices === 0, r.body);
r = await U.c.call("POST", "/push/subscribe", { endpoint: ep });
sql(`INSERT INTO notifications (user_id, type, text, data) VALUES ('${U.id}', 'forum', '@deneme konuna yanıt verdi.', '{"topicId":"00000000-0000-4000-8000-000000000001"}')`);
r = await U.c.call("GET", "/push/latest"); chk("son bildirim: kısa metin ve doğru bağlantı", r.body.body === "@deneme konuna yanıt verdi." && r.body.url === "/forum/konu/00000000-0000-4000-8000-000000000001", r.body);
sql(`INSERT INTO dm_messages (sender_id, recipient_id, body, created_at) VALUES ('${V.id}', '${U.id}', 'GİZLİ İÇERİK', now() + interval '1 second')`);
r = await U.c.call("GET", "/push/latest"); chk("yeni mesaj: gönderen görünür, mesaj içeriği bildirime girmez", r.body.tag === "dm" && /sana mesaj gönderdi/.test(r.body.body) && !/GİZLİ/.test(JSON.stringify(r.body)), r.body);
r = await V.c.call("GET", "/push/latest"); chk("başkasının bildirimi görünmez", !/deneme/.test(JSON.stringify(r.body)), r.body);
r = await U.c.call("POST", "/push/unsubscribe", { endpoint: ep }); r = await U.c.call("GET", "/push/status"); chk("abonelikten çıkılır", r.body.devices === 0, r.body);
r = await U.c.call("POST", "/push/test", {}); chk("abonelik yoksa deneme bildirimi açıklayıcı hata verir", r.status === 400 && /bildirime açık bir cihaz/.test(r.body.error), r.body);
finish("push");
