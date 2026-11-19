// Forum Ayarları: kullanıcı adı (kurallar, şifre, 14 gün), imza (reklam/müstehcen/siyasi filtre), sosyal bağlantılar, bildirim tercihleri,
// avatar ve imza görseli (tür ve piksel sınırları), herkese açık görsel, yönetici kaldırması.
//   node --import ./tools/authsim/register.mjs tests/e2e/forum.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, enableTotp, sql, chk, finish, BASE, PW, Client } from "./lib.mjs";

const U = await signup("Forum Uye", "fru"), V = await signup("Diger Uye", "frv"), A = await signup("Forum Yonetici", "fra");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
const png = (w, h, extra = 0) => { const b = Buffer.alloc(33 + extra); Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0); b.writeUInt32BE(13, 8); b.write("IHDR", 12, "ascii"); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); b[24] = 8; b[25] = 6; return b; };
const gif = (w, h) => { const b = Buffer.alloc(40); b.write("GIF89a", 0, "ascii"); b.writeUInt16LE(w, 6); b.writeUInt16LE(h, 8); return b; };
const up = async (p, kind, buf, q = "") => { const r = await fetch(BASE + "/api/forum/me/media/" + kind + q, { method: "POST", headers: { cookie: p.c.cookieHeader(), origin: BASE, "content-type": "application/octet-stream", "x-csrf-token": p.c.jar.avf_csrf }, body: buf }); let d = null; try { d = await r.json(); } catch {} return { status: r.status, body: d }; };

let r = await U.c.call("GET", "/forum/me");
chk("forum ayarları okunur", r.status === 200 && r.body.username === U.username && r.body.level.name === "Yeni Başlayan" && r.body.messagingUnlocked === false, r.body);
chk("bildirim varsayılanları", r.body.notify.own_topic_reply === true && r.body.notify.disliked === false && r.body.notify.moderation === true, r.body.notify);
r = await new Client().call("GET", "/forum/rules"); chk("kurallar herkese açık", r.status === 200 && r.body.levels.length === 8 && r.body.notify.length >= 8, r.status);
r = await new Client().call("GET", "/forum/me"); chk("oturumsuz forum ayarı yok", r.status === 401, r.status);

// ---- kurallar onayı
r = await U.c.call("PUT", "/forum/me", { signature: "Disiplin her şeydir" }); chk("kurallar onaylanmadan imza kaydedilmez", r.status === 400 && r.body.code === "rules_required", r.body);
r = await up(U, "avatar", png(256, 256)); chk("kurallar onaylanmadan avatar yüklenmez", r.status === 400 && r.body.code === "rules_required", r.body);

// ---- imza
for (const [s, why] of [["www.ornek.com", "alan adı"], ["Bana yazın @demirci", "@kullanıcı"], ["%30 indirim kodu DEMIR", "indirim"], ["0532 111 22 33", "telefon"], ["Hitler haklıydı", "ideolojik"], ["s.i.k.t.i.r", "küfür"], ["a".repeat(201), "uzunluk"]]) {
  r = await U.c.call("PUT", "/forum/me", { signature: s, acceptRules: true }); chk("imza reddedilir: " + why, r.status === 400 && r.body.field === "signature", r.body);
}
r = await U.c.call("PUT", "/forum/me", { signature: "Disiplin her şeydir 💪\nHer gün biraz daha", acceptRules: true });
chk("geçerli imza kaydedilir, kurallar onaylanır", r.status === 200 && r.body.signature.startsWith("Disiplin") && r.body.rulesAcceptedAt, r.body);

// ---- sosyal bağlantılar
r = await U.c.call("PUT", "/forum/me", { socials: { instagram: "https://www.instagram.com/demir.adam/", twitter: "@demir_x", tiktok: "", facebook: "demir.adam.10", other: "x" } });
chk("bağlantılar kullanıcı adına indirgenir, bilinmeyen atılır", r.status === 200 && r.body.socials.instagram === "demir.adam" && r.body.socials.twitter === "demir_x" && !r.body.socials.tiktok && !r.body.socials.other, r.body.socials);
r = await U.c.call("PUT", "/forum/me", { socials: { twitter: "javascript:alert(1)" } }); chk("geçersiz bağlantı reddedilir", r.status === 400 && r.body.field === "socials", r.body);
r = await U.c.call("PUT", "/forum/me", { socials: { instagram: "fuck.you" } }); chk("uygunsuz bağlantı adı reddedilir", r.status === 400, r.body);

// ---- bildirimler
r = await U.c.call("PUT", "/forum/me", { notify: { liked: false, disliked: true, moderation: false, junk: true } });
chk("bildirim tercihi kaydedilir; moderasyon kapatılamaz", r.status === 200 && r.body.notify.liked === false && r.body.notify.disliked === true && r.body.notify.moderation === true && !("junk" in r.body.notify), r.body.notify);

// ---- kullanıcı adı
for (const [n, why] of [["ab", "kısa"], ["demir!", "geçersiz karakter"], ["1demir", "rakamla başlar"], ["demir..adam", "art arda nokta"], ["admin.demir", "ayrılmış"], ["akp.demir", "siyasi"], ["orospucocugu", "küfür"], ["ataturk1881", "siyasi kişi"]]) {
  r = await U.c.call("PUT", "/forum/me/username", { username: n, password: PW }); chk("kullanıcı adı reddedilir: " + why, r.status === 400 && r.body.field === "username", r.body);
}
r = await U.c.call("PUT", "/forum/me/username", { username: V.username, password: PW }); chk("alınmış kullanıcı adı reddedilir", r.status === 409, r.body);
r = await U.c.call("PUT", "/forum/me/username", { username: "demir.adam" + U.username.slice(-4), password: "yanlis" }); chk("yanlış şifreyle değişmez", r.status === 400 && r.body.field === "password", r.body);
const nu = "demir.adam" + U.username.slice(-4);
r = await U.c.call("PUT", "/forum/me/username", { username: nu, password: PW }); chk("kullanıcı adı değişir", r.status === 200 && r.body.username === nu && r.body.usernameNextChangeAt, r.body);
r = await new Client().call("POST", "/auth/login", { identifier: nu, password: PW, recaptchaToken: "t" }); chk("yeni kullanıcı adıyla giriş yapılır", r.status === 200, r.body);
r = await U.c.call("PUT", "/forum/me/username", { username: nu + "x", password: PW }); chk("14 gün dolmadan yeniden değişmez", r.status === 429 && r.body.code === "cooldown", r.body);

// ---- avatar / imza görseli
r = await up(U, "avatar", gif(256, 256)); chk("avatar GIF olamaz", r.status === 400, r.body);
r = await up(U, "avatar", png(64, 64)); chk("çok küçük avatar reddedilir", r.status === 400, r.body);
r = await up(U, "avatar", png(800, 300)); chk("kare olmayan avatar reddedilir", r.status === 400, r.body);
r = await up(U, "avatar", Buffer.from("<svg onload=alert(1)>")); chk("görsel olmayan dosya reddedilir", r.status === 400, r.body);
r = await up(U, "avatar", png(256, 256, 1024 * 1024)); chk("1 MB üstü reddedilir", r.status === 400, r.body);
r = await up(U, "avatar", png(256, 256)); chk("avatar yüklenir", r.status === 201 && r.body.avatarId, r.body);
const av1 = r.body.avatarId;
r = await up(U, "avatar", png(300, 300)); chk("yeni avatar eskisinin yerini alır", r.status === 201 && r.body.avatarId !== av1 && sql(`SELECT count(*) FROM attachments WHERE user_id='${U.id}' AND scope='avatar'`) === "1", r.body);
const av = r.body.avatarId;
r = await up(U, "sig", png(700, 100)); chk("büyük imza görseli reddedilir", r.status === 400, r.body);
r = await up(U, "sig", gif(468, 60)); chk("imza GIF'i yüklenir", r.status === 201 && r.body.sigImageId, r.body);
const sg = r.body.sigImageId;
let f = await fetch(BASE + "/api/forum/media/" + av); chk("avatar herkese açık ve güvenli başlıklı", f.status === 200 && f.headers.get("content-type") === "image/png" && f.headers.get("x-content-type-options") === "nosniff", f.status);
const other = sql(`INSERT INTO attachments (user_id, scope, filename, mime, size_bytes, data) VALUES ('${U.id}', 'profile', 'a.png', 'image/png', 3, '\\x010203') RETURNING id`).split("\n")[0];
f = await fetch(BASE + "/api/forum/media/" + other); chk("sağlık/destek ekleri bu yoldan sunulmaz", f.status === 404, f.status);

// ---- yönetici kaldırması
r = await A.c.call("GET", `/admin/members/${U.id}/forum`); chk("yönetici forum kimliğini görür", r.status === 200 && r.body.avatar_id === av && r.body.sig_image_id === sg && r.body.signature, r.body);
r = await U.c.call("GET", `/admin/members/${V.id}/forum`); chk("üye başkasının forum kimliğini panelden göremez", r.status === 404, r.status);
r = await A.c.call("DELETE", `/admin/members/${U.id}/forum/avatar`, { reason: "x" }); chk("gerekçesiz kaldırma reddedilir", r.status === 400, r.body);
r = await A.c.call("DELETE", `/admin/members/${U.id}/forum/avatar`, { reason: "Müstehcen görsel" }); chk("avatar kaldırılır", r.status === 200, r.body);
r = await A.c.call("DELETE", `/admin/members/${U.id}/forum/signature`, { reason: "Reklam içeriyor" }); chk("imza kaldırılır", r.status === 200, r.body);
r = await U.c.call("GET", "/forum/me"); chk("üyede avatar ve imza kalkar", !r.body.avatarId && r.body.signature === "" && r.body.sigImageId === sg, r.body);
r = await U.c.call("GET", "/notifications"); chk("üyeye gerekçeli bildirim gider", r.body.some((n) => /avatarınız kurallara aykırı/.test(n.text) && /Müstehcen görsel/.test(n.text)), r.body.map((n) => n.text));
chk("denetim kaydına yazılır", Number(sql(`SELECT count(*) FROM audit_log WHERE action='member_forum_item_remove' AND target_id='${U.id}'`)) === 2, null);
r = await U.c.call("DELETE", "/forum/me/media/sig"); chk("üye imza görselini kaldırır", r.status === 200 && !r.body.sigImageId, r.body);

// ---- seviye
sql(`UPDATE forum_profiles SET posts=40, likes=30 WHERE user_id='${U.id}'`);
r = await U.c.call("GET", "/forum/me"); chk("puan 170 → Pump Avcısı, mesajlaşma açılır", r.body.level.name === "Pump Avcısı" && r.body.messagingUnlocked, r.body.level);
chk("seviye mantığı üyeye açıklanmaz (puan / eşik / elle verildi yok)", r.body.level.score === undefined && r.body.level.manual === undefined && r.body.levels.every((l) => l.min === undefined) && r.body.nextLevel === undefined, r.body);
r = await U.c.call("GET", "/notifications"); const lu = r.body.find((n) => n.type === "level_up");
chk("seviye yükselince bildirim (kutlama verisiyle)", lu && lu.data.name === "Pump Avcısı" && lu.data.popup === true, r.body.map((n) => n.type));
const lm = await (await fetch(BASE + "/__mails?to=" + encodeURIComponent(U.email))).json(); chk("seviye yükselince e-posta", lm && /Pump Avcısı/.test(lm.text), lm && lm.text.slice(0, 120));
r = await U.c.call("GET", "/forum/me"); r = await U.c.call("GET", "/notifications"); chk("kutlama bir kez oluşur", r.body.filter((n) => n.type === "level_up").length === 1, null);
r = await A.c.call("PUT", `/admin/members/${U.id}/forum`, { levelOverride: 5 }); r = await U.c.call("GET", "/notifications");
chk("yönetici seviye verince de kutlama (elle verildiği yazmaz)", r.body.some((n) => n.type === "level_up" && n.data.name === "Hacim Ustası" && !/yönetici|elle/i.test(n.text)), r.body.map((n) => n.text));
chk("elle verilen seviye denetim kaydında", Number(sql(`SELECT count(*) FROM audit_log WHERE action='member_forum_set' AND target_id='${U.id}'`)) === 1, null);
finish();
