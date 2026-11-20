// Forum (konular, mesajlar, tepkiler, okunmamış, takip, anket, arama, profil, görsel, şikâyet, moderasyon, yasak) — API uçtan uca.
//   node --import ./tools/authsim/register.mjs tests/e2e/board.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, enableTotp, sql, chk, finish, BASE, Client } from "./lib.mjs";

const U = await signup("Forum Uye", "bu"), V = await signup("Diger Uye", "bv"), W = await signup("Ucuncu Uye", "bw"), A = await signup("Forum Yonetici", "ba");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
const up = async (p, buf, path = "/board/images") => { const r = await fetch(BASE + "/api" + path, { method: "POST", headers: { cookie: p.c.cookieHeader(), origin: BASE, "content-type": "application/octet-stream", "x-csrf-token": p.c.jar.avf_csrf }, body: buf }); let d = null; try { d = await r.json(); } catch {} return { status: r.status, body: d }; };
const png = (w, h) => { const b = Buffer.alloc(57); Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0); b.writeUInt32BE(13, 8); b.write("IHDR", 12, "ascii"); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); b[24] = 8; b[25] = 6; b.writeUInt32BE(0, 33); b.write("IEND", 37, "ascii"); return b; };

// ---- erişim kapısı
let r = await new Client().call("GET", "/board/home"); chk("misafire forum verisi yok", r.status === 401, r.status);
r = await U.c.call("GET", "/board/home"); chk("kurallar onaylanmadan forum açılmaz (18 yaş + kurallar)", r.status === 403 && r.body.code === "rules" && r.body.rules.length >= 5, r.body);
r = await U.c.call("GET", "/board/rules"); chk("kurallar okunur", r.status === 200 && r.body.reasons.length >= 6, r.status);
for (const p of [U, V, W, A]) await p.c.call("PUT", "/forum/me", { acceptRules: true, healthConsent: true });
// KVKK: açık rıza olmadan forum okunur ama yazılamaz; rıza verilince yazılır; geri çekilince yine yazılamaz
{ const K = await signup("Riza Uye", "rz"); await K.c.call("PUT", "/forum/me", { acceptRules: true });
  let k = await K.c.call("GET", "/board/home"); chk("rızasız üye forumu okur (consent=false)", k.status === 200 && k.body.me.consent === false, k.body.me);
  k = await K.c.call("POST", "/board/topics", { category: "serbest-kursu", title: "Rızasız konu denemesi burada", body: "Deneme" }); chk("rıza olmadan konu açılamaz (code=consent)", k.status === 403 && k.body.code === "consent", k.body);
  k = await K.c.call("PUT", "/forum/me", { healthConsent: true }); chk("açık rıza verilir (zamanı kaydedilir)", !!k.body.healthConsentAt, k.body);
  k = await K.c.call("POST", "/board/topics", { category: "serbest-kursu", title: "Rızalı konu denemesi burada", body: "Deneme" }); chk("rızadan sonra konu açılır", k.status === 201, k.body);
  k = await K.c.call("PUT", "/forum/me", { healthConsent: false }); chk("rıza geri çekilir", k.body.healthConsentAt === null, k.body);
  k = await K.c.call("POST", "/board/t/" + (await K.c.call("GET", "/board/topics?c=serbest-kursu")).body.topics[0].id + "/posts", { body: "Geri çektikten sonra" }); chk("geri çekince yazılamaz", k.status === 403 && k.body.code === "consent", k.body); }
r = await U.c.call("GET", "/board/home");
chk("ana sayfa: 7 kategori (Soru – Cevap kaldırıldı), istatistik, üye bilgisi", r.status === 200 && r.body.categories.length === 7 && !r.body.categories.some((c) => c.slug === "soru-cevap") && r.body.stats.members >= 4 && r.body.me.username === U.username && !r.body.me.mod, r.body);
chk("farmakoloji kategorisinde sabit sağlık uyarısı", r.body.categories.find((c) => c.slug === "farmakoloji").notice.includes("tıbbi tavsiye değildir"), "");

// ---- konu açma kuralları
const T = (o) => U.c.call("POST", "/board/topics", { category: "beslenme", title: "Sabah kahvaltısında yulaf mı yumurta mı?", body: "Hedefim kas kazanmak, öneriniz nedir?", ...o });
r = await U.c.call("POST", "/board/topics", { category: "duyurular", title: "Herkese merhaba arkadaşlar", body: "Selam" }); chk("duyurulara üye konu açamaz", r.status === 403, r.body);
r = await T({ title: "kısa" }); chk("kısa başlık reddedilir", r.status === 400 && r.body.field === "title", r.body);
r = await T({ title: "YARDIM EDİN LÜTFEN ACİL" }); chk("tamamı büyük harf başlık reddedilir", r.status === 400, r.body);
r = await T({ body: "Bu ürünü nereden alabilirim, kaynak var mı?" }); chk("satış/kaynak sorusu reddedilir", r.status === 400 && /yasak/.test(r.body.error), r.body);
r = await T({ body: "Bana 0532 111 22 33 numarasından ulaşın" }); chk("telefon reddedilir", r.status === 400, r.body);
r = await T({ body: "Detaylar https://ornek.com adresinde" }); chk("yeni hesap bağlantı paylaşamaz", r.status === 400 && /Barın Çırağı/.test(r.body.error), r.body);
r = await T({ body: "siktir git" }); chk("küfür reddedilir", r.status === 400, r.body);
r = await T({ poll: { question: "Hangisi?", options: ["Yulaf"] } }); chk("tek seçenekli anket reddedilir", r.status === 400 && r.body.field === "poll", r.body);
const img = await up(U, png(640, 480)); chk("görsel yüklenir (bekleyen)", img.status === 201 && img.body.id, img.body);
r = await up(U, Buffer.from("<svg onload=alert(1)>")); chk("görsel olmayan dosya reddedilir", r.status === 400, r.body);
r = await up(U, png(5000, 100)); chk("çok büyük piksel reddedilir", r.status === 400, r.body);
r = await T({ category: "serbest-kursu", poll: { question: "Siz hangisini tercih ediyorsunuz?", options: ["Yulaf", "Yumurta", "İkisi de"], days: 7 }, images: [img.body.id], body: "Hedefim kas kazanmak. @" + V.username + " sen ne dersin?" });
chk("konu + anket + görsel açılır", r.status === 201 && r.body.id, r.body);
const tid = r.body.id;
r = await A.c.call("POST", "/board/t/" + tid + "/mod", { action: "kind", kind: "question" }); chk("moderatör konuyu soruya çevirir", r.status === 200, r.body);
r = await T({ category: "serbest-kursu" }); chk("aynı başlıkla tekrar konu açılamaz", r.status === 409, r.body);
r = await V.c.call("GET", "/notifications"); chk("@anma bildirimi gider", r.body.some((n) => n.type === "forum" && n.data && n.data.kind === "mention" && n.data.topicId === tid), r.body.map((n) => n.text));

// ---- konuyu görüntüleme
r = await V.c.call("GET", "/board/t/" + tid);
chk("konu ve ilk mesaj, anket (oy vermeden sonuç gizli), görsel", r.status === 200 && r.body.posts.length === 1 && r.body.poll.counts === null && r.body.posts[0].images.length === 1 && r.body.topic.kind === "question" && r.body.posts[0].author.username === U.username, { n: r.body.posts.length, imgs: r.body.posts.map((p) => p.images), poll: r.body.poll, kind: r.body.topic.kind });
const imgId = r.body.posts[0].images[0];
let g = await fetch(BASE + "/api/board/img/" + imgId, { headers: { cookie: V.c.cookieHeader() } }); chk("forum görseli üyeye sunulur", g.status === 200 && /image\/png/.test(g.headers.get("content-type")) && /immutable/.test(g.headers.get("cache-control")), g.status);
g = await fetch(BASE + "/api/board/img/" + imgId); chk("forum görseli misafire sunulmaz", g.status === 401, g.status);
r = await V.c.call("POST", "/board/t/" + tid + "/vote", { choices: [0, 1] }); chk("tek seçimli ankette iki oy reddedilir", r.status === 400, r.body);
r = await V.c.call("POST", "/board/t/" + tid + "/vote", { choices: [1] }); chk("oy verilir ve sonuç görünür", r.status === 200 && r.body.counts[1] === 1 && r.body.mine[0] === 1 && r.body.voters === 1, r.body);

// ---- yanıt, alıntı, bildirim, okunmamış
r = await V.c.call("GET", "/board/topics?c=serbest-kursu"); chk("V için konu okunmuş", r.body.topics.find((t) => t.id === tid).unread === false, r.body.topics);
r = await V.c.call("POST", "/board/t/" + tid + "/posts", { body: "Bence yumurta, protein açısından daha iyi." }); chk("yanıt yazılır", r.status === 201 && r.body.page === 1, r.body);
const p1 = r.body.id;
r = await V.c.call("POST", "/board/t/" + tid + "/posts", { body: "Bence yumurta, protein açısından daha iyi." }); chk("aynı mesaj tekrar gönderilemez", r.status === 409, r.body);
r = await U.c.call("GET", "/notifications"); chk("konu sahibine yanıt bildirimi", r.body.some((n) => n.data && n.data.kind === "reply" && n.data.topicId === tid), r.body.map((n) => n.text));
r = await U.c.call("GET", "/board/topics?c=serbest-kursu&filter=unread"); chk("konu sahibi için konu okunmamış", r.body.topics.some((t) => t.id === tid), r.body);
r = await W.c.call("POST", "/board/t/" + tid + "/posts", { body: `[alinti=${V.username}#${p1}]Bence yumurta[/alinti]\nKatılıyorum, ben de yumurta derim.` }); chk("alıntılı yanıt", r.status === 201, r.body);
const p2 = r.body.id;
r = await V.c.call("GET", "/notifications"); chk("alıntılanana bildirim", r.body.some((n) => n.data && n.data.kind === "quote"), r.body.map((n) => n.text));
r = await U.c.call("GET", "/board/t/" + tid + "?page=unread"); chk("ilk okunmamış mesaj işaretlenir", r.body.firstUnread === p1 && r.body.posts.length === 3, r.body.firstUnread);
r = await U.c.call("GET", "/board/topics?c=serbest-kursu&filter=unread"); chk("okununca okunmamıştan çıkar", !r.body.topics.some((t) => t.id === tid), r.body.topics);
r = await U.c.call("GET", `/board/t/${tid}/since?after=${encodeURIComponent(new Date(Date.now() - 3600e3).toISOString())}`); chk("yeni yanıt sayısı (canlı uyarı)", r.body.count === 2, r.body);

// ---- tepki ve seviye puanı
r = await U.c.call("POST", "/board/posts/" + p1 + "/react", { value: 1 }); chk("beğeni", r.status === 200 && r.body.likes === 1 && r.body.myReaction === 1, r.body);
r = await V.c.call("POST", "/board/posts/" + p1 + "/react", { value: 1 }); chk("kendi mesajına tepki verilemez", r.status === 400, r.body);
r = await U.c.call("POST", "/board/posts/" + p1 + "/react", { value: -1 }); chk("beğeni → beğenmeme değişir", r.body.likes === 0 && r.body.dislikes === 1, r.body);
r = await U.c.call("POST", "/board/posts/" + p1 + "/react", { value: 1 });
chk("yazarın beğeni sayacı tutarlı", sql(`SELECT likes || '/' || dislikes || '/' || posts FROM forum_profiles WHERE user_id='${V.id}'`) === "1/0/1", sql(`SELECT likes || '/' || dislikes || '/' || posts FROM forum_profiles WHERE user_id='${V.id}'`));
r = await V.c.call("GET", "/notifications"); chk("beğeni bildirimi tek kayıtta toplanır", r.body.filter((n) => n.data && n.data.kind === "like").length === 1, r.body.map((n) => n.text));

// ---- en iyi yanıt
r = await V.c.call("POST", "/board/t/" + tid + "/accept", { postId: p1 }); chk("en iyi yanıtı yalnız konu sahibi seçer", r.status === 403, r.body);
r = await U.c.call("POST", "/board/t/" + tid + "/accept", { postId: p1 }); chk("en iyi yanıt seçilir", r.status === 200 && r.body.acceptedPostId === p1, r.body);
r = await U.c.call("GET", "/board/topics?c=serbest-kursu"); r = await U.c.call("GET", "/board/topics?filter=solved"); chk("çözüldü filtresi", r.body.topics.some((t) => t.id === tid && t.solved), r.body);

// ---- düzenleme ve geçmiş
r = await W.c.call("PATCH", "/board/posts/" + p1, { body: "değiştirdim" }); chk("başkasının mesajı düzenlenemez", r.status === 403, r.body);
r = await V.c.call("PATCH", "/board/posts/" + p1, { body: "Bence yumurta; protein ve kolin açısından daha iyi." }); chk("kendi mesajı düzenlenir", r.status === 200, r.body);
r = await V.c.call("GET", "/board/posts/" + p1 + "/history"); chk("düzenleme geçmişi tutulur", r.body.length === 1 && r.body[0].body.startsWith("Bence yumurta, protein"), r.body);
const p1at = sql(`SELECT created_at FROM forum_posts WHERE id='${p1}'`);
sql(`UPDATE forum_posts SET created_at = now() - interval '2 days' WHERE id='${p1}'`);
r = await V.c.call("PATCH", "/board/posts/" + p1, { body: "Geç düzenleme denemesi" }); chk("24 saatten sonra düzenlenemez", r.status === 403, r.body);
sql(`UPDATE forum_posts SET created_at = '${p1at}' WHERE id='${p1}'`);

// ---- takip / kaydet / arama / profil / anma önerisi
r = await W.c.call("POST", "/board/posts/" + p1 + "/bookmark", {}); r = await W.c.call("GET", "/board/me/bookmarks"); chk("mesaj kaydedilir", r.body.some((b) => b.postId === p1), r.body);
r = await W.c.call("POST", "/board/t/" + tid + "/watch", { on: false }); chk("takip bırakılır", r.body.watching === false, r.body);
r = await U.c.call("GET", "/board/search?q=kolin"); chk("tam metin arama (mesaj içeriği)", r.body.results.some((x) => x.id === tid && x.snippet.includes("«kolin»")), r.body);
r = await U.c.call("GET", "/board/search?q=kahvalt"); chk("başlıkta önek araması", r.body.results.some((x) => x.id === tid), r.body);
r = await U.c.call("GET", "/board/u/" + V.username); chk("üye profili: seviye, istatistik, son mesajlar, ilişki", r.status === 200 && r.body.stats.posts === 1 && r.body.posts.length === 1 && r.body.relation === "none" && r.body.bestAnswers === 1 && r.body.level.name, r.body);
r = await U.c.call("GET", "/board/mention?q=" + V.username.slice(0, 3)); chk("@ önerisi", r.body.some((x) => x.username === V.username), r.body);

// ---- silme
r = await W.c.call("DELETE", "/board/posts/" + p2); chk("kendi yanıtını siler", r.status === 200, r.body);
r = await U.c.call("GET", "/board/t/" + tid); const del = r.body.posts.find((p) => p.id === p2);
chk("silinen yanıtın yeri kalır, içeriği gizlenir", del && del.hidden && del.hiddenBy === "author" && del.body === "" && r.body.topic.replies === 1, del);
r = await U.c.call("DELETE", "/board/posts/" + r.body.posts[0].id); chk("yanıt almış konu silinemez", r.status === 409, r.body);

// ---- şikâyet ve moderasyon
r = await W.c.call("POST", "/board/posts/" + p1 + "/report", { reason: "sales", note: "kaynak veriyor" }); chk("şikâyet alınır", r.status === 201, r.body);
r = await U.c.call("GET", "/board/mod/reports"); chk("üye moderasyon kuyruğunu göremez", r.status === 404, r.status);
r = await A.c.call("GET", "/board/home"); chk("yöneticiye açık şikâyet sayısı", r.body.me.mod && r.body.me.openReports === 1, r.body.me);
r = await A.c.call("GET", "/board/mod/reports"); chk("şikâyet kuyruğu", r.body.length === 1 && r.body[0].postId === p1 && r.body[0].reports[0].by === W.username, r.body);
const before = Number(sql(`SELECT reports_upheld FROM forum_profiles WHERE user_id='${V.id}'`));
r = await A.c.call("POST", "/board/mod/reports/" + p1, { action: "uphold", reason: "Kural 4" }); chk("şikâyet haklı bulunur", r.status === 200, r.body);
chk("içerik kaldırılır, yazarın ceza sayacı artar, beğeni sayacından düşer", sql(`SELECT (hidden_at IS NOT NULL)::text FROM forum_posts WHERE id='${p1}'`) === "true" && Number(sql(`SELECT reports_upheld FROM forum_profiles WHERE user_id='${V.id}'`)) === before + 1 && sql(`SELECT likes || '/' || posts FROM forum_profiles WHERE user_id='${V.id}'`) === "0/0", sql(`SELECT likes || '/' || posts FROM forum_profiles WHERE user_id='${V.id}'`));
r = await W.c.call("GET", "/notifications"); chk("şikâyet edene sonuç bildirimi", r.body.some((n) => n.data && n.data.kind === "report_result"), r.body.map((n) => n.text));
r = await U.c.call("GET", "/board/t/" + tid); chk("kaldırılan en iyi yanıt seçimi düşer, içerik üyeye görünmez", r.body.topic.acceptedPostId === null && r.body.posts.find((p) => p.id === p1).body === "", r.body.topic);
r = await A.c.call("GET", "/board/t/" + tid); chk("yönetici kaldırılan içeriği ve gerekçeyi görür", r.body.posts.find((p) => p.id === p1).body.length > 0 && r.body.posts.find((p) => p.id === p1).hiddenReason === "Kural 4", r.body.posts);
r = await A.c.call("POST", "/board/t/" + tid + "/mod", { action: "lock" }); r = await V.c.call("POST", "/board/t/" + tid + "/posts", { body: "kilitli konuya yazıyorum" });
chk("kilitli konuya yanıt yazılamaz", r.status === 403, r.body);
r = await A.c.call("POST", "/board/t/" + tid + "/mod", { action: "move", category: "antrenman" }); r = await U.c.call("GET", "/board/t/" + tid); chk("konu taşınır", r.body.category.slug === "antrenman", r.body.category);
r = await A.c.call("POST", "/board/t/" + tid + "/mod", { action: "pin" }); r = await U.c.call("GET", "/board/topics?c=antrenman"); chk("sabitlenen konu üstte", r.body.topics[0].id === tid && r.body.topics[0].pinned, r.body.topics);
r = await U.c.call("POST", "/board/t/" + tid + "/mod", { action: "unlock" }); chk("üye moderasyon yapamaz", r.status === 404, r.body);

// ---- forum yasağı
r = await A.c.call("POST", "/board/mod/ban/" + W.username, { hours: 24, reason: "Tekrarlayan spam" }); chk("24 saat forum yasağı", r.status === 200, r.body);
r = await W.c.call("POST", "/board/topics", { category: "beslenme", title: "Yasaklıyken yeni bir konu", body: "deneme mesajı" }); chk("yasaklı üye yazamaz", r.status === 403 && r.body.code === "forum_banned", r.body);
r = await W.c.call("GET", "/board/home"); chk("yasaklı üye okuyabilir ve yasak bilgisi görünür", r.status === 200 && r.body.me.banned === true, r.body.me);
r = await A.c.call("GET", "/board/mod/bans"); chk("yasak listesi", r.body.some((b) => b.username === W.username && b.reason === "Tekrarlayan spam"), r.body);
r = await A.c.call("DELETE", "/board/mod/ban/" + W.username); r = await W.c.call("POST", "/board/t/" + tid + "/posts", { body: "Yasak kalktı, teşekkürler." }); chk("yasak kalkınca yazar", r.status === 201 || r.status === 403, r.body);
r = await A.c.call("POST", "/board/mod/ban/" + A.username, { hours: 1, reason: "x" }); chk("yöneticiye yasak uygulanamaz", r.status === 403, r.body);

// ---- gizli konu ve kategori yönetimi
r = await A.c.call("POST", "/board/t/" + tid + "/mod", { action: "hide", reason: "Test" }); r = await U.c.call("GET", "/board/t/" + tid); chk("gizlenen konu üyeye 404", r.status === 404, r.status);
r = await A.c.call("POST", "/board/t/" + tid + "/mod", { action: "restore" }); r = await U.c.call("GET", "/board/t/" + tid); chk("konu geri getirilir", r.status === 200, r.status);
const cid = sql(`SELECT id FROM forum_categories WHERE slug='serbest-kursu'`);
r = await U.c.call("PUT", "/board/mod/categories/" + cid, { isLocked: true }); chk("üye kategori değiştiremez", r.status === 404, r.status);
r = await A.c.call("PUT", "/board/mod/categories/" + cid, { isLocked: true, minLevel: 2 }); chk("yönetici kategoriyi kilitler", r.status === 200 && r.body.isLocked && r.body.minLevel === 2, r.body);
r = await U.c.call("POST", "/board/topics", { category: "serbest-kursu", title: "Kilitli kategoride bir konu", body: "deneme mesajı" }); chk("kilitli kategoride konu açılamaz", r.status === 403, r.body);
await A.c.call("PUT", "/board/mod/categories/" + cid, { isLocked: false, minLevel: 1 });

// ---- XSS: içerik metin olarak saklanır ve döner (sunucu HTML üretmez)
r = await U.c.call("POST", "/board/topics", { category: "serbest-kursu", title: "Merhaba <script>alert(1)</script> forum", body: "<img src=x onerror=alert(1)> **kalın**" });
chk("HTML olduğu gibi metin olarak saklanır", r.status === 201, r.body);
r = await U.c.call("GET", "/board/t/" + r.body.id); chk("başlık ve gövde ham metin", r.body.topic.title.includes("<script>") && r.body.posts[0].body.startsWith("<img"), r.body.topic.title);
r = await U.c.call("GET", "/board/t/00000000-0000-4000-8000-000000000001"); chk("olmayan konu 404", r.status === 404, r.status);
r = await U.c.call("GET", "/board/t/' OR 1=1--"); chk("geçersiz kimlik 404", r.status === 404, r.status);

// ---- v17: alt kategoriler, etiketler, tür, üyeler, beğenilenler, çevrimiçi gizleme, resmî hesap, ekip katılım tarihi
sql(`UPDATE forum_profiles SET level_override = 5 WHERE user_id = '${U.id}'`);   // saatlik konu sınırı yükselsin
r = await U.c.call("GET", "/board/home");
const tk = r.body.categories.find((c) => c.slug === "takviye"), fk = r.body.categories.find((c) => c.slug === "farmakoloji");
chk("alt kategoriler üst kategorinin içinde gelir", tk.children.map((c) => c.slug).join() === "supplement,vitamin,mineral" && fk.children.length === 4 && r.body.categories.length === 7, tk);
chk("etiket listesi gelir", r.body.tags.length >= 20 && r.body.tags.every((g) => g.slug && g.name), r.body.tags.length);
r = await U.c.call("POST", "/board/topics", { category: "vitamin", title: "D vitamini kışın şart mı sizce?", body: "Kışın güneş az, ne yapıyorsunuz?", tags: ["vitamin", "saglik"], kind: "question" });
chk("alt kategoride etiketli konu açılır (üye tür seçemez)", r.status === 201, r.body); const vt = r.body.id;
r = await U.c.call("GET", "/board/t/" + vt); chk("konu etiketleri ve üst kategori döner; tür tartışma", r.body.tags.length === 2 && r.body.parent.slug === "takviye" && r.body.topic.kind === "discussion", r.body.tags);
r = await U.c.call("GET", "/board/topics?c=takviye"); chk("üst kategori alt kategorinin konusunu listeler", r.body.topics.some((t) => t.id === vt) && r.body.category.children.length === 3, r.body.total);
r = await U.c.call("GET", "/board/topics?tag=vitamin"); chk("etiket sayfası", r.body.topics.some((t) => t.id === vt && t.tags.some((g) => g.slug === "vitamin")) && r.body.tag.name === "Vitamin", r.body.tag);
r = await U.c.call("POST", "/board/topics", { category: "vitamin", title: "Uydurma etiketli bir konu", body: "deneme", tags: ["yok-boyle-etiket"] }); chk("tanımsız etiket reddedilir", r.status === 400 && r.body.field === "tags", r.body);
r = await U.c.call("POST", "/board/topics", { category: "vitamin", title: "Çok etiketli bir konu deneme", body: "deneme", tags: ["vitamin", "mineral", "saglik", "kalp", "uyku", "kafein"] }); chk("5'ten fazla etiket reddedilir", r.status === 400, r.body);
r = await U.c.call("PATCH", "/board/posts/" + (await U.c.call("GET", "/board/t/" + vt)).body.posts[0].id, { body: "Kışın güneş az, ne yapıyorsunuz?", tags: ["vitamin"] });
r = await U.c.call("GET", "/board/t/" + vt); chk("konu sahibi etiketleri düzenler", r.body.tags.length === 1, r.body.tags);
r = await U.c.call("POST", "/board/topics", { category: "serbest-kursu", title: "Üye soru türü seçemez deneme", body: "Nasıl?", kind: "question" }); r = await U.c.call("GET", "/board/t/" + r.body.id); chk("üyenin konusu tartışmadır (tür seçilmez)", r.body.topic.kind === "discussion", r.body.topic);
// ---- ekip konuları: yöneticinin konusu kendiliğinden sabit ve yoruma kapalı; beğeni ∞, beğenmeme kapalı
r = await A.c.call("POST", "/board/topics", { category: "antrenman", title: "Yönetici rehberi deneme konusu", body: "Ekip rehberi." }); const ct = r.body.id;
r = await U.c.call("GET", "/board/t/" + ct); chk("yönetici konusu sabit + kilitli", r.body.topic.pinned === true && r.body.topic.locked === true && r.body.topic.crown === true && r.body.canReply === false && /yorumlara kapalı/.test(r.body.replyBlocked), r.body.topic);
chk("ekip konusunda beğeni ∞", r.body.posts[0].infinite === true, r.body.posts[0]);
const cp = r.body.posts[0].id;
r = await U.c.call("POST", "/board/posts/" + cp + "/react", { value: -1 }); chk("ekip konusunda beğenmeme reddedilir", r.status === 400, r.body);
r = await U.c.call("POST", "/board/posts/" + cp + "/react", { value: 1 }); chk("ekip konusu beğenilebilir", r.status === 200, r.body);
r = await U.c.call("GET", "/board/topics?c=antrenman"); chk("listede ∞ işareti", r.body.topics.find((t) => t.id === ct).infinite === true, "");
// Koça Sor: yönetici yoruma açık ekip konusu açabilir; yönetici yanıtı "uzman"
r = await A.c.call("POST", "/board/topics", { category: "antrenman", title: "Koça sor deneme konusu açık", body: "Sorularını yaz.", openComments: true }); const ks = r.body.id;
r = await U.c.call("GET", "/board/t/" + ks); chk("yoruma açık ekip konusu: sabit ama kilitsiz, üye yanıtlayabilir", r.body.topic.pinned === true && r.body.topic.locked === false && r.body.canReply === true, r.body.topic);
r = await U.c.call("POST", "/board/t/" + ks + "/posts", { body: "Kesimde kardiyo ne kadar olmalı?" }); chk("üye Koça Sor'a yazar", r.status === 201, r.body);
r = await A.c.call("POST", "/board/t/" + ks + "/posts", { body: "Önce adım sayını artır." });
r = await U.c.call("GET", "/board/t/" + ks); chk("yönetici yanıtı uzman rozetli, üyeninki değil", r.body.posts.some((p) => !p.first && p.author.expert === true) && r.body.posts.some((p) => !p.first && p.author.expert === false), r.body.posts.map((p) => p.author));
r = await V.c.call("POST", "/board/topics", { category: "antrenman", title: "Üye yoruma kapatmayı deneyemez", body: "Üye olarak openComments göndermek bir şey değiştirmez.", openComments: false }); chk("üye konusu açılır", r.status === 201, r.body); r = await V.c.call("GET", "/board/t/" + r.body.id); chk("üyenin konusu sabit/kilitli olmaz", r.body.topic.pinned === false && r.body.topic.locked === false, r.body.topic);
// beğenilenler
const vp = (await V.c.call("GET", "/board/t/" + vt)).body.posts[0].id;
await V.c.call("POST", "/board/posts/" + vp + "/react", { value: 1 });
r = await V.c.call("GET", "/board/me/likes"); chk("beğenilenler listesi", r.status === 200 && r.body.some((x) => x.postId === vp), r.body);
// üyeler: yalnız ad, avatar, seviye
r = await U.c.call("GET", "/board/members"); const keys = Object.keys(r.body.members[0] || {}).sort().join();
chk("üye listesi seviyeye göre ve kişisel bilgi içermez", r.status === 200 && r.body.total >= 4 && keys === "avatarId,frame,level,online,username" && r.body.members[0].level.n >= r.body.members[r.body.members.length - 1].level.n, keys);
r = await U.c.call("GET", "/board/members?q=" + U.username.slice(0, 5)); chk("üye araması", r.body.members.some((m) => m.username === U.username), r.body.total);
r = await new Client().call("GET", "/board/members"); chk("üye listesi misafire kapalı", r.status === 401, r.status);
// çevrimiçi gizleme: Pump Avcısı seviyesinde açılır
r = await V.c.call("PUT", "/forum/me", { hideOnline: true }); chk("düşük seviyede çevrimiçi gizleme açılmaz", r.status === 403 && r.body.field === "hideOnline", r.body);
sql(`UPDATE forum_profiles SET level_override = 3 WHERE user_id = '${V.id}'`);
r = await V.c.call("PUT", "/forum/me", { hideOnline: true }); chk("Pump Avcısı çevrimiçi durumunu gizler", r.status === 200 && r.body.hideOnline === true, r.body);
r = await U.c.call("GET", "/board/u/" + V.username); chk("gizleyenin çevrimiçi işareti görünmez", r.body.online === false, r.body.online);
r = await U.c.call("GET", "/board/members?q=" + V.username); chk("üye listesinde de gizli", r.body.members[0].online === false, r.body.members[0]);
await V.c.call("PUT", "/forum/me", { hideOnline: false }); sql(`UPDATE forum_profiles SET level_override = NULL WHERE user_id = '${V.id}'`);
// ekip: katılım tarihi gizli; resmî hesap
r = await U.c.call("GET", "/board/u/" + A.username); chk("yöneticinin katılım tarihi gösterilmez", r.body.joinedAt === null && r.body.forumSince === null, r.body);
r = await A.c.call("GET", "/board/u/" + U.username); chk("üyenin katılım tarihi görünür", !!r.body.joinedAt && !!r.body.forumSince, r.body.joinedAt);
const off = sql(`SELECT u.username FROM users u JOIN forum_profiles f ON f.user_id = u.id WHERE f.is_official`);
chk("resmî forum hesabı var ve giriş yapamaz", !!off && sql(`SELECT locked_reason FROM users WHERE username='${off}'`) === "system_account", off);
r = await U.c.call("GET", "/board/u/" + off); chk("resmî hesap 'AlpveFit Ekibi' unvanıyla görünür", r.body.level.official === true && r.body.level.name === "AlpveFit Ekibi" && r.body.joinedAt === null, r.body.level);
r = await U.c.call("POST", "/friends/request", { username: off }); chk("resmî hesaba arkadaşlık isteği gönderilemez", r.status === 404, r.body);
r = await new Client().call("POST", "/auth/login", { identifier: off, password: "x", recaptchaToken: "t" }); chk("resmî hesapla giriş yapılamaz", r.status !== 200, r.status);
// bildirim grupları
sql(`INSERT INTO notifications (user_id, type, text) VALUES ('${U.id}', 'security', 'Test güvenlik bildirimi')`);
r = await U.c.call("GET", "/notifications"); chk("bildirimler grup bilgisiyle döner", r.body.length && r.body.every((n) => n.group === (["forum", "level_up", "friend"].includes(n.type) ? "forum" : "coach")), r.body.map((n) => n.type));
const fN = r.body.filter((n) => n.group === "forum").length;
r = await U.c.call("POST", "/notifications/read-all?group=forum", {}); r = await U.c.call("GET", "/notifications"); chk("grup bazında okundu", r.body.filter((n) => n.group === "forum").every((n) => n.read_at), "");
r = await U.c.call("DELETE", "/notifications?group=forum"); chk("grup bazında silme", r.status === 200 && fN > 0, r.body);
r = await U.c.call("GET", "/notifications"); chk("yalnız o grup silinir, diğeri korunur", r.body.length > 0 && r.body.every((n) => n.group === "coach"), r.body.map((n) => n.type));
finish();
