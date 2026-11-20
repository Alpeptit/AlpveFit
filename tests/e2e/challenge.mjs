// Haftanın meydan okuması (günlük işaretleme, 5/7 → rozet, bildirim, profilde rozet) ve haftalık forum özeti e-postası (yalnız isteyene).
//   node --import ./tools/authsim/register.mjs tests/e2e/challenge.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, sql, chk, finish, BASE } from "./lib.mjs";

const U = await signup("Meydan Uye", "chu"), V = await signup("Ozet Uye", "chv"), W = await signup("Ozetsiz Uye", "chw");
for (const p of [U, V, W]) await p.c.call("PUT", "/forum/me", { acceptRules: true });
let r = await U.c.call("GET", "/board/challenge");
chk("meydan okuma: 7 gün, hedef 5, başlık ve açıklama", r.status === 200 && r.body.days.length === 7 && r.body.goal === 5 && r.body.title && r.body.text, r.body);
const c = r.body, today = c.days.find((d) => d.today), fut = c.days.find((d) => d.future);
if (fut) { r = await U.c.call("POST", "/board/challenge/checkin", { day: fut.date }); chk("gelecek gün işaretlenemez", r.status === 400, r.body); }
r = await U.c.call("POST", "/board/challenge/checkin", { day: "2020-01-01" }); chk("geçmiş hafta işaretlenemez", r.status === 400, r.body);
r = await U.c.call("POST", "/board/challenge/checkin", { day: today.date }); chk("bugün işaretlenir", r.body.doneCount === 1 && r.body.days.find((d) => d.today).done, r.body);
r = await U.c.call("POST", "/board/challenge/checkin", { day: today.date, done: false }); chk("işaret kaldırılır", r.body.doneCount === 0, r.body);
// hedefin 4 günü önceden (aynı hafta) işaretlenmiş olsun; bugünle 5 olur
const others = c.days.filter((d) => !d.today).slice(0, 4);
for (const d of others) sql(`INSERT INTO challenge_checkins (user_id, day, week_start, challenge_key) VALUES ('${U.id}', '${d.date}', '${c.weekStart}', '${c.key}') ON CONFLICT DO NOTHING`);
r = await U.c.call("POST", "/board/challenge/checkin", { day: today.date }); chk("5. gün: rozet kazanılır", r.body.doneCount === 5 && r.body.earned === true && r.body.finishers >= 1, r.body);
r = await U.c.call("POST", "/board/challenge/checkin", { day: today.date, done: false }); r = await U.c.call("POST", "/board/challenge/checkin", { day: today.date });
r = await U.c.call("GET", "/notifications"); const nb = (r.body.items || r.body).filter((n) => n.data && n.data.kind === "badge");
chk("rozet bildirimi bir kez gelir", nb.length === 1 && /Rozet kazandın/.test(nb[0].text), nb);
r = await V.c.call("GET", "/board/u/" + U.username); chk("profilde rozet", r.body.badgeTotal === 1 && r.body.badges[0].key === c.key, r.body.badges);

// haftalık özet: konu olsun; yalnız tercihi açan üyeye gider
r = await V.c.call("POST", "/board/topics", { category: "serbest-kursu", title: "Bu haftanın öne çıkan deneme konusu", body: "Haftalık özet için deneme." });
r = await V.c.call("GET", "/forum/me"); chk("haftalık özet varsayılan kapalı", r.body.notify.digest === false, r.body.notify);
const nv = { ...r.body.notify, digest: true }; delete nv.moderation;
r = await V.c.call("PUT", "/forum/me", { notify: nv }); chk("haftalık özet açılır", r.body.notify.digest === true, r.body.notify);
const em = (p) => sql(`SELECT email FROM users WHERE id='${p.id}'`).trim();
r = await fetch(BASE + "/__digest").then((x) => x.json()); chk("özet gönderildi", r.sent >= 1, r);
let m = await fetch(BASE + "/__mails?to=" + encodeURIComponent(em(V))).then((x) => x.json());
chk("tercihi açan üyeye özet gelir (konu ve meydan okuma içinde)", m && /Forumda bu hafta/.test(m.text) && /öne çıkan deneme konusu/.test(m.text) && /Haftanın meydan okuması/.test(m.text), m && m.text ? m.text.slice(0, 200) : m);
m = await fetch(BASE + "/__mails?to=" + encodeURIComponent(em(W))).then((x) => x.json());
chk("tercihi kapalı üyeye özet gitmez", !m || !/Forumda bu hafta/.test(m.text || ""), m ? (m.text || "").slice(0, 80) : "yok");
r = await fetch(BASE + "/__digest").then((x) => x.json()); chk("aynı hafta ikinci kez gönderilmez", r.sent === 0, r);
finish("challenge");
