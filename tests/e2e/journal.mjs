// Gelişim Günlüğüm: ölçü kayıtları (doğrulama, aynı gün güncelleme, silme), seri, fotoğraflar (tür, meta veri, görünürlük:
// yalnız ben / arkadaşlarım / forum üyeleri), forum profilinde görünenler.
//   node --import ./tools/authsim/register.mjs tests/e2e/journal.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, sql, chk, finish, BASE } from "./lib.mjs";
import zlib from "node:zlib";

const U = await signup("Gunluk Uye", "jru"), F = await signup("Gunluk Arkadas", "jrf"), M = await signup("Gunluk Forumcu", "jrm"), X = await signup("Gunluk Yabanci", "jrx");
for (const p of [U, F, M]) await p.c.call("PUT", "/forum/me", { acceptRules: true });
const day = (n) => { const d = new Date(Date.now() + 3 * 3600e3); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
let r = await U.c.call("GET", "/journal"); chk("boş günlük", r.status === 200 && r.body.entries.length === 0 && r.body.stats.streakWeeks === 0, r.body.stats);
r = await U.c.call("PUT", "/journal/entries", { date: day(-1), weight: 80 }); chk("gelecek tarih reddedilir", r.status === 400 && r.body.field === "date", r.body);
r = await U.c.call("PUT", "/journal/entries", { date: day(0), weight: 500 }); chk("aralık dışı kilo reddedilir", r.status === 400 && r.body.field === "weight", r.body);
r = await U.c.call("PUT", "/journal/entries", { date: day(0) }); chk("ölçüsüz kayıt reddedilir", r.status === 400, r.body);
r = await U.c.call("PUT", "/journal/entries", { date: day(0), weight: "82,4", waist: 88, note: "İyi uyudum" }); chk("kayıt eklenir (virgüllü sayı)", r.status === 200 && r.body.entries[0].weight === 82.4 && r.body.entries[0].waist === 88, r.body.entries);
r = await U.c.call("PUT", "/journal/entries", { date: day(0), weight: 82.1 }); chk("aynı gün güncellenir, gönderilmeyen ölçü korunur", r.body.entries.length === 1 && r.body.entries[0].weight === 82.1 && r.body.entries[0].waist === 88, r.body.entries);
for (const n of [7, 14, 21]) await U.c.call("PUT", "/journal/entries", { date: day(n), weight: 83 + n / 7 });
r = await U.c.call("GET", "/journal"); chk("seri: 4 hafta üst üste", r.body.stats.streakWeeks === 4, r.body.stats);
chk("başlangıç ve son kilo", r.body.stats.start === 86 && r.body.stats.latest === 82.1, r.body.stats);
const eid = r.body.entries.find((e) => e.date === day(21)).id;
r = await X.c.call("DELETE", "/journal/entries/" + eid); r = await U.c.call("GET", "/journal"); chk("başkasının kaydı silinemez", r.body.entries.length === 4, r.body.entries.length);
r = await U.c.call("DELETE", "/journal/entries/" + eid); chk("kendi kaydı silinir", r.body.entries.length === 3, r.body.entries.length);
r = await X.c.call("GET", "/journal"); chk("ölçüler yalnız sahibine görünür", r.body.entries.length === 0, "");

// fotoğraflar
const crc = (b) => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); } return ~c >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const png = (w, h) => { const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2; const raw = Buffer.alloc((w * 3 + 1) * h);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ih), chunk("tEXt", Buffer.from("GPS\u000041.0,29.0")), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]); };
const up = (p, buf, q) => fetch(BASE + "/api/journal/photos?" + q, { method: "POST", headers: { cookie: p.c.cookieHeader(), origin: BASE, "content-type": "application/octet-stream", "x-csrf-token": p.c.jar.avf_csrf }, body: buf }).then(async (x) => ({ status: x.status, body: await x.json() }));
r = await up(U, Buffer.from("GIF89a....."), "date=" + day(0)); chk("yalnız PNG / JPG", r.status === 400, r.body);
r = await up(U, png(100, 100), "date=" + day(0)); chk("çok küçük fotoğraf reddedilir", r.status === 400 && /240/.test(r.body.error), r.body);
r = await up(U, png(300, 400), "date=" + day(0) + "&pose=yan"); chk("fotoğraf yüklenir (varsayılan: yalnız ben)", r.status === 201 && r.body.photos.length === 1 && r.body.photos[0].visibility === "private" && r.body.photos[0].pose === "yan", r.body);
const ph = r.body.photos[0];
const get = (p, url) => fetch(BASE + url, { headers: { cookie: p.c.cookieHeader() } });
let g = await get(U, ph.url); const b = Buffer.from(await g.arrayBuffer()); chk("sahibi görür; konum bilgisi silinmiş", g.status === 200 && !b.includes(Buffer.from("GPS")), g.status);
for (const [who, n] of [[F, "arkadaş"], [M, "forum üyesi"], [X, "forumda olmayan"]]) { g = await get(who, ph.url); chk("yalnız ben: " + n + " göremez", g.status === 404, g.status); }
sql(`INSERT INTO friendships (user_a, user_b, requester, status) VALUES (least('${U.id}'::uuid, '${F.id}'::uuid), greatest('${U.id}'::uuid, '${F.id}'::uuid), '${U.id}', 'accepted')`);
r = await U.c.call("PATCH", "/journal/photos/" + ph.id, { visibility: "friends" });
g = await get(F, ph.url); chk("arkadaşlarım: arkadaş görür", g.status === 200, g.status);
g = await get(M, ph.url); chk("arkadaşlarım: diğer forum üyesi göremez", g.status === 404, g.status);
r = await U.c.call("PATCH", "/journal/photos/" + ph.id, { visibility: "members" });
g = await get(M, ph.url); chk("forum üyeleri: forum üyesi görür", g.status === 200, g.status);
g = await get(X, ph.url); chk("forum üyeleri: kuralları onaylamamış üye göremez", g.status === 404, g.status);
r = await M.c.call("GET", "/journal/u/" + U.username); chk("forum profilinde seri ve görünür fotoğraf; ölçü yok", r.body.streakWeeks >= 3 && r.body.photos.length === 1 && !("entries" in r.body), r.body);
r = await X.c.call("PATCH", "/journal/photos/" + ph.id, { visibility: "private" }); chk("başkasının fotoğrafı değiştirilemez", r.status === 404, r.body);
r = await U.c.call("DELETE", "/journal/photos/" + ph.id); chk("fotoğraf silinir", r.body.photos.length === 0, "");
g = await get(U, ph.url); chk("silinen fotoğraf açılmaz", g.status === 404, g.status);
finish("journal");
