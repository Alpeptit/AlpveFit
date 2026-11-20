// Profil fotoğrafı çerçeveleri: seviyeye göre açılır, ekip çerçevelerini üyeler seçemez, seçim forumda görünür ve seviye düşünce kendiliğinden kalkar.
//   node --import ./tools/authsim/register.mjs tests/e2e/frames.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, sql, chk, finish } from "./lib.mjs";

const U = await signup("Cerceve Uye", "cfu"), A = await signup("Cerceve Yonetici", "cfa");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`);
let r = await U.c.call("PUT", "/forum/me", { acceptRules: true, healthConsent: true });
r = await U.c.call("GET", "/forum/me");
chk("üye: 15 üye çerçevesi listelenir, ekip çerçeveleri görünmez", r.body.frames.length === 15 && !r.body.frames.some((f) => f.staff), r.body.frames.map((f) => f.key));
chk("yeni üye: yalnız Kum açık, varsayılan çerçevesiz", r.body.frames.filter((f) => f.unlocked).map((f) => f.key).join() === "kum" && r.body.frame === null, r.body.frame);
r = await U.c.call("PUT", "/forum/me", { frame: "gumus" }); chk("kilitli çerçeve seçilemez (403, seviye adı)", r.status === 403 && /Barın Çırağı/.test(r.body.error), r.body);
r = await U.c.call("PUT", "/forum/me", { frame: "admin" }); chk("yönetici çerçevesini üye seçemez", r.status === 403, r.body);
r = await U.c.call("PUT", "/forum/me", { frame: "uydurma" }); chk("olmayan çerçeve reddedilir", r.status === 400, r.body);
r = await U.c.call("PUT", "/forum/me", { frame: "kum" }); chk("açık çerçeve seçilir", r.status === 200 && r.body.frame === "kum", r.body.frame);
sql(`UPDATE forum_profiles SET level_override = 8 WHERE user_id='${U.id}'`);
r = await U.c.call("PUT", "/forum/me", { frame: "tanri" }); chk("Ayna Tanrısı seviyesinde en üst çerçeve açılır", r.status === 200 && r.body.frame === "tanri", r.body);
r = await U.c.call("POST", "/board/topics", { category: "serbest-kursu", title: "Çerçeve deneme konusu burada", body: "Çerçevem görünüyor mu bakalım." }); const tid = r.body.id;
r = await A.c.call("PUT", "/forum/me", { acceptRules: true, healthConsent: true });
r = await A.c.call("GET", "/board/t/" + tid); chk("forumda yazarın çerçevesi görünür", r.body.posts[0].author.frame === "tanri", r.body.posts[0].author);
r = await A.c.call("GET", "/board/topics?c=serbest-kursu"); chk("konu listesinde de çerçeve", r.body.topics.find((t) => t.id === tid).author.frame === "tanri", "");
sql(`UPDATE forum_profiles SET level_override = 2 WHERE user_id='${U.id}'`);
r = await A.c.call("GET", "/board/t/" + tid); chk("seviye düşünce kazanılmamış çerçeve kendiliğinden kalkar", r.body.posts[0].author.frame === null, r.body.posts[0].author);
r = await A.c.call("GET", "/forum/me"); chk("yönetici: varsayılan Yönetici çerçevesi; Moderatör ve Yönetici çerçeveleri açık", r.body.frame === "admin" && r.body.frames.some((f) => f.key === "mod" && f.unlocked) && !r.body.frames.some((f) => f.key === "ekip"), r.body.frame);
r = await A.c.call("PUT", "/forum/me", { frame: "yok" }); chk("yönetici çerçevesiz olmayı seçebilir", r.status === 200 && r.body.frame === null, r.body.frame);
r = await A.c.call("PUT", "/forum/me", { frame: "ekip" }); chk("ekip hesabı çerçevesi yöneticiye de kapalı", r.status === 403, r.body);
finish("frames");
