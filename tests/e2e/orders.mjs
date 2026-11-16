// Paket siparişi, sahte sanal POS (kart) ödemesi, profil ve 180 gün saklama — gerçek rota kodu + gerçek PostgreSQL.
//   node --import ./tools/authsim/register.mjs tools/devserver.mjs &      (PORT=8902)
//   node --import ./tools/authsim/register.mjs tests/e2e/orders.mjs
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { Client, signup, login, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";

const M1 = await signup("Ayşe Deneme", "ord1"), M2 = await signup("Mehmet Kaya", "ord2"), M3 = await signup("Can Yılmaz", "ord3");
const C1 = await signup("Selin Uzman", "ocoach"), C2 = await signup("Burak Koç", "ocoach2"), A = await signup("Yonetici Hesap", "oadm");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
await A.c.call("PUT", `/admin/users/${C1.id}/role`, { role: "coach", planKinds: ["nutrition"] }); await login(C1); await enableTotp(C1);
await A.c.call("PUT", `/admin/users/${C2.id}/role`, { role: "coach", planKinds: ["nutrition"] }); await login(C2); await enableTotp(C2);

// ---- katalog ve sipariş kuralları ----
let r = await new Client().call("GET", "/packages");
chk("paketler herkese açık; kart (sahte POS) etkin ve TEST olarak işaretli; kripto alanı YOK; 7 gün teslim", r.status === 200 && r.body.payment.enabled === true && r.body.payment.test === true && r.body.cryptoDiscountRate === undefined && r.body.planDeliveryDays === 7 && r.body.packages.length === 3, r.body);
const adv = r.body.packages.find((p) => p.key === "advanced"), st = r.body.packages.find((p) => p.key === "starter"), cp = r.body.packages.find((p) => p.key === "competitor");
chk("paket süreleri: Başlangıç 12/24, İleri 16/24, Yarışmacı 12; farmakoloji yalnız ileri ve yarışmacıda",
  st.options.map((o) => o.weeks).join() === "12,24" && adv.options.map((o) => o.weeks).join() === "16,24" && cp.options.map((o) => o.weeks).join() === "12" && !st.pharmacology && adv.pharmacology && cp.pharmacology, r.body);
chk("indirim yok: fiyatlar liste fiyatı", st.options[0].price === 4990 && st.options[0].cryptoPrice === undefined, st.options[0]);
r = await new Client().call("POST", "/orders", { packageKey: "starter", weeks: 12, consent: true }); chk("misafir sipariş veremez", r.status === 401, r);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 12 }); chk("sözleşme onayı olmadan sipariş olmaz", r.status === 400 && r.body.code === "consent_required", r);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 16, consent: true }); chk("pakette olmayan süre reddedilir", r.status === 400, r);
r = await M1.c.call("POST", "/orders", { packageKey: "hack", weeks: 12, consent: true }); chk("geçersiz paket reddedilir", r.status === 400, r);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 12, consent: true, price: 1, subtotal: 1, method: "crypto" });
const o1 = r.body.order;
chk("sipariş: tutar SUNUCU kataloğundan (istemci fiyatı yok sayılır), ödeme sağlayıcısı mock", r.status === 201 && Number(o1.subtotal) === 4990 && Number(o1.list_price) === 4990 && o1.currency === "TRY" && o1.payment_provider === "mock" && o1.status === "pending" && /^AVF-\d{6}$/.test(o1.order_number), r.body);
r = await M1.c.call("GET", "/orders/" + o1.id); chk("sipariş detayı: ödeme sağlayıcısı TEST; cüzdan/kripto alanı yok", r.body.payment && r.body.payment.test === true && r.body.paymentInstructions === undefined, r.body);
r = await M2.c.call("GET", "/orders/" + o1.id); chk("başka üye siparişi göremez (404)", r.status === 404, r);
r = await M2.c.call("POST", `/orders/${o1.id}/cancel`, {}); chk("başka üye siparişi iptal edemez", r.status === 404, r);
r = await M2.c.call("POST", `/orders/${o1.id}/pay/mock`, { outcome: "success" }); chk("başka üye siparişi ödenmiş yapamaz (404)", r.status === 404 && sql(`SELECT status FROM orders WHERE id='${o1.id}'`) === "pending", r);
r = await new Client().call("POST", `/orders/${o1.id}/pay/mock`, { outcome: "success" }); chk("misafir ödeme yapamaz", r.status === 401, r);
r = await M1.c.call("GET", "/orders"); chk("üye yalnız kendi siparişlerini listeler", r.body.length === 1 && r.body[0].id === o1.id, r.body);
r = await M1.c.call("GET", "/notifications"); chk("ödeme bekleniyor bildirimi", r.body.some((n) => n.type === "order_payment" && n.order_id === o1.id), r.body);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 24, consent: true }); const o1b = r.body.order;
r = await M1.c.call("POST", "/orders", { packageKey: "advanced", weeks: 16, consent: true }); chk("en fazla 2 ödenmemiş sipariş", r.status === 429 && r.body.code === "too_many_open", r);
r = await M1.c.call("POST", `/orders/${o1b.id}/cancel`, {}); chk("ödenmemiş sipariş iptal edilir", r.status === 200, r);

// ---- sahte sanal POS ----
r = await M1.c.call("POST", `/orders/${o1.id}/pay/mock`, { outcome: "bogus" }); chk("geçersiz test sonucu reddedilir", r.status === 400, r);
r = await M1.c.call("POST", `/orders/${o1.id}/pay/mock`, { outcome: "decline" }); chk("reddedilen test kartı: 402, sipariş ÖDENMEZ, erişim açılmaz", r.status === 402 && r.body.code === "card_declined" && sql(`SELECT status FROM orders WHERE id='${o1.id}'`) === "pending" && sql(`SELECT count(*) FROM member_access WHERE member_id='${M1.id}'`) === "0" && sql(`SELECT payment_attempts FROM orders WHERE id='${o1.id}'`) === "1", r);
r = await M1.c.call("POST", `/orders/${o1.id}/pay/mock`, { outcome: "success", amount: 0.01, status: "paid" }); chk("başarılı test ödemesi: sipariş 'paid' (istemcinin tutar/durum alanları yok sayılır)", r.status === 200 && sql(`SELECT status FROM orders WHERE id='${o1.id}'`) === "paid" && Number(sql(`SELECT subtotal FROM orders WHERE id='${o1.id}'`)) === 4990, r);
chk("ödeme: plans_due_at = ödeme + 7 gün; payment_ref MOCK-…", sql(`SELECT (plans_due_at - paid_at) = interval '7 days' FROM orders WHERE id='${o1.id}'`) === "t" && /^MOCK-/.test(sql(`SELECT payment_ref FROM orders WHERE id='${o1.id}'`)), null);
chk("Başlangıç paketi: beslenme+antrenman+takviye açılır, FARMAKOLOJİ AÇILMAZ", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M1.id}'`) === "nutrition,supplement,training", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M1.id}'`));
r = await M1.c.call("GET", "/notifications"); chk("ödeme bildirimi 'order_paid'; bekleme bildirimi kalktı", r.body.some((n) => n.type === "order_paid") && !r.body.some((n) => n.type === "order_payment" && n.order_id === o1.id), r.body);
const mm = await (await fetch(`${BASE}/__mails?to=${encodeURIComponent(M1.email)}`)).json(); chk("ödeme onay e-postası (7 gün bilgisi)", /7 gün/.test(mm.text) && /AVF-/.test(mm.text), mm && mm.text.slice(0, 200));
r = await M1.c.call("POST", `/orders/${o1.id}/pay/mock`, { outcome: "success" }); chk("ödenmiş sipariş ikinci kez ödenemez (409), çift bildirim yok", r.status === 409 && sql(`SELECT count(*) FROM notifications WHERE type='order_paid' AND user_id='${M1.id}'`) === "1", r);
r = await M1.c.call("POST", `/orders/${o1.id}/cancel`, {}); chk("ödenmiş sipariş iptal edilemez", r.status === 409, r);
r = await M1.c.call("GET", "/plans/overview"); chk("üye paneli: erişim açılan 3 tür görünür", r.body.kinds.map((k) => k.kind).join() === "nutrition,training,supplement", r.body);
r = await M2.c.call("POST", "/orders", { packageKey: "advanced", weeks: 16, consent: true }); const o2 = r.body.order;
chk("ileri seviye 16 hafta: 7490, farmakolojili", Number(o2.subtotal) === 7490 && o2.pharmacology === true, o2);
for (let i = 0; i < 10; i++) await M2.c.call("POST", `/orders/${o2.id}/pay/mock`, { outcome: "decline" });
r = await M2.c.call("POST", `/orders/${o2.id}/pay/mock`, { outcome: "success" }); chk("çok sayıda deneme sonrası ödeme engellenir (429)", r.status === 429 && r.body.code === "too_many_attempts" && sql(`SELECT status FROM orders WHERE id='${o2.id}'`) === "pending", r);
r = await M2.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "deneme gerekçesi uzun" }); chk("üye elle onay veremez (admin API gizli 404)", r.status === 404, r);
r = await C1.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "deneme gerekçesi uzun" }); chk("uzman ödeme onaylayamaz (403)", r.status === 403, r);
r = await A.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "kısa" }); chk("elle onay: gerekçe zorunlu", r.status === 400, r);
r = await A.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "Havale ile ödeme doğrulandı, dekont kontrol edildi" }); chk("yönetici siparişi gerekçeyle onaylar", r.status === 200, r);
r = await A.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "Havale ile ödeme doğrulandı, dekont kontrol edildi" }); chk("ikinci onay reddedilir (409)", r.status === 409, r);
chk("İleri paket: FARMAKOLOJİ da açılır", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M2.id}'`) === "nutrition,pharmacology,supplement,training", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M2.id}'`));
chk("elle onay denetim kaydında (admin_manual + gerekçe)", sql(`SELECT count(*) FROM audit_log WHERE action='order_paid' AND details->>'source'='admin_manual'`) === "1", null);
r = await A.c.call("GET", "/admin/orders"); chk("yönetici sipariş listesi: ödenmiş siparişler + yayınlanan plan sayısı", r.status === 200 && r.body.some((o) => o.id === o2.id && o.status === "paid" && o.plans_published === 0), r.body.slice(0, 1));
r = await C1.c.call("GET", "/admin/orders"); chk("uzman sipariş listesini göremez", r.status === 403, r);
r = await A.c.call("GET", "/admin/unmatched"); chk("eşleşmeyen işlem uç noktası kaldırıldı", r.status === 404, r);

// süre dolumu
r = await M3.c.call("POST", "/orders", { packageKey: "competitor", weeks: 12, consent: true }); const o3 = r.body.order;
chk("yarışmacı 12 hafta: 13990", Number(o3.subtotal) === 13990, o3);
sql(`UPDATE orders SET payment_expires_at = now() - interval '1 minute' WHERE id='${o3.id}'`);
r = await M3.c.call("GET", "/orders/" + o3.id); chk("süresi dolan sipariş 'expired' olur ve ödeme kapanır", r.body.order.status === "expired" && r.body.payment === null, r.body);
r = await M3.c.call("POST", `/orders/${o3.id}/pay/mock`, { outcome: "success" }); chk("süresi dolan sipariş ödenemez (409)", r.status === 409, r);

// ---- plan teslimi: yalnız atanmış uzman, yalnız ödemeyle açılan türde ----
await A.c.call("PUT", "/admin/assignments", { coachId: C1.id, memberId: M1.id, delivery: "online" });
r = await C1.c.call("GET", "/admin/clients"); chk("uzman: atanmış üyenin paketini ve teslim tarihini görür", r.body[0].package && r.body[0].package.package_key === "starter" && r.body[0].package.plans_due_at, r.body);
r = await C1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "nutrition", title: "Beslenme", body: "Sabah: yulaf" }); const pl = r.body.id;
r = await C1.c.call("POST", `/admin/plans/${pl}/publish`, {}); chk("uzman ödeme sonrası açılan türde plan yayınlar", r.status === 200, r);
r = await C1.c.call("POST", "/admin/plans", { memberId: M1.id, kind: "supplement", title: "x" }); chk("uzman atama yapamaz ama yetkisiz türde de yazamaz (403)", r.status === 403, r);
r = await C1.c.call("PUT", "/admin/assignments", { coachId: C1.id, memberId: M2.id, delivery: "online" }); chk("uzman üye ataması yapamaz (yalnız yönetici)", r.status === 403, r);

// ---- profil ----
r = await M1.c.call("GET", "/profile"); chk("profil başta boş", r.status === 200 && r.body === null, r);
r = await M1.c.call("PUT", "/profile", { heightCm: 180, weightKg: 82.5 }); chk("profil: açık rıza olmadan kaydedilmez", r.status === 400 && r.body.code === "consent_required", r);
r = await M1.c.call("PUT", "/profile", { heightCm: 50, healthConsent: true }); chk("profil: boy aralığı doğrulanır", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { heightCm: 180, weightKg: 82.5, occupation: "Yazılımcı", dailySteps: 7000, bloodType: "A+", trainingDays: 4, birthYear: 1994, goal: "Kas kazanımı", healthNotes: "Sağ dizde eski sakatlık", healthConsent: true });
chk("profil: rıza ile kaydedilir", r.status === 200 && r.body.height_cm === 180 && r.body.blood_type === "A+" && r.body.health_consent_at, r);
r = await M1.c.call("PUT", "/profile", { heightCm: 181, bloodType: "X" }); chk("profil: geçersiz kan grubu reddedilir", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { heightCm: 181, weightKg: 82.5, bloodType: "A+" }); chk("profil: sonraki güncellemede rıza yeniden istenmez", r.status === 200 && r.body.height_cm === 181, r);
r = await C1.c.call("GET", `/admin/clients/${M1.id}/profile`); chk("atanmış uzman üyenin profilini görür", r.status === 200 && r.body.height_cm === 181, r);
r = await C2.c.call("GET", `/admin/clients/${M1.id}/profile`); chk("atanmamış uzman profili GÖREMEZ (404)", r.status === 404, r);
r = await M2.c.call("GET", `/admin/clients/${M1.id}/profile`); chk("başka üye profili göremez (404)", r.status === 404, r);
r = await M1.c.call("DELETE", "/profile"); r = await M1.c.call("GET", "/profile"); chk("rıza geri alınınca profil silinir", r.body === null, r);
r = await new Client().call("POST", "/auth/register", { fullName: "Kayıt Testi", username: "kyt" + Date.now(), email: `k${Date.now()}@example.test`, password: "Kirmizi.Elma7", recaptchaToken: "t", kvkkAccepted: true, aboutAccepted: true, heightCm: 180 });
chk("kayıt sırasında boy/kilo gibi bilgiler SORULMAZ ve kaydedilmez", r.status === 200 && sql(`SELECT count(*) FROM member_profiles`) === "0", r);

// ---- 180 gün saklama ----
const { cleanup, RETENTION_DAYS } = await import("../../src/services/dataRetention.js");
sql(`INSERT INTO login_history (user_id, ip_address, user_agent, created_at) SELECT id, '1.1.1.1', 'x', now() - interval '181 days' FROM users LIMIT 1`);
sql(`INSERT INTO login_history (user_id, ip_address, user_agent, created_at) SELECT id, '1.1.1.2', 'x', now() - interval '179 days' FROM users LIMIT 1`);
sql(`UPDATE orders SET created_at = now() - interval '181 days' WHERE id='${o3.id}'`);
const res = await cleanup();
chk("saklama süresi 180 gün", RETENTION_DAYS === 180, RETENTION_DAYS);
chk("180 günden eski giriş kaydı silinir, 179 günlük kalır", sql(`SELECT count(*) FROM login_history WHERE ip_address='1.1.1.1'`) === "0" && sql(`SELECT count(*) FROM login_history WHERE ip_address='1.1.1.2'`) === "1", res);
chk("180 günden eski süresi dolmuş sipariş silinir; ÖDENMİŞ sipariş (mali kayıt) korunur", sql(`SELECT count(*) FROM orders WHERE id='${o3.id}'`) === "0" && sql(`SELECT count(*) FROM orders WHERE id='${o1.id}'`) === "1", res);

// ---- blog: yalnız yönetici yazar; herkese açık yalnız YAYINDAKİ yazılar okunur ----
r = await new Client().call("GET", "/blog"); chk("blog listesi herkese açık ve başlangıçta boş", r.status === 200 && Array.isArray(r.body) && r.body.length === 0, r);
r = await M2.c.call("POST", "/admin/blog", { title: "Deneme", slug: "deneme", body: "x" }); chk("üye blog yazısı oluşturamaz (admin API gizli 404)", r.status === 404, r);
r = await C1.c.call("POST", "/admin/blog", { title: "Deneme", slug: "deneme", body: "x" }); chk("uzman blog yazısı oluşturamaz", r.status === 403 || r.status === 404, r);
r = await A.c.call("POST", "/admin/blog", { title: "Su içmek", slug: "Gecersiz Adres", body: "x" }); chk("geçersiz slug reddedilir", r.status === 400, r);
r = await A.c.call("POST", "/admin/blog", { title: "Su içmek önemli", slug: "su-icmek-onemli", excerpt: "Kısa özet", body: "İlk paragraf.\n\n## Alt başlık\n\nİkinci paragraf <b>düz metin</b>.", status: "draft" });
const bp = r.body.id; chk("yönetici taslak yazı oluşturur", r.status === 201 && !!bp, r);
r = await new Client().call("GET", "/blog/su-icmek-onemli"); chk("taslak herkese açık okunamaz (404)", r.status === 404, r);
r = await A.c.call("PUT", `/admin/blog/${bp}`, { status: "published" }); chk("yönetici yazıyı yayınlar", r.status === 200, r);
r = await new Client().call("GET", "/blog"); chk("yayınlanan yazı listede görünür", r.body.length === 1 && r.body[0].slug === "su-icmek-onemli" && r.body[0].body === undefined, r.body);
r = await new Client().call("GET", "/blog/su-icmek-onemli"); chk("yazı içeriği düz metin olarak okunur", r.status === 200 && r.body.body.includes("<b>düz metin</b>") && r.body.author_name === "Yonetici Hesap", r.body);
r = await A.c.call("POST", "/admin/blog", { title: "Aynı adres", slug: "su-icmek-onemli", body: "x" }); chk("yinelenen slug reddedilir", r.status === 400, r);
r = await A.c.call("DELETE", `/admin/blog/${bp}`); chk("yönetici yazıyı siler", r.status === 200 && (await new Client().call("GET", "/blog")).body.length === 0, r);

// üye hesabı silinince ödenmiş sipariş mali kayıt olarak kalır, kişisel veriler gider
let q = await M1.c.call("POST", "/me/request-delete", { password: "Kirmizi.Elma7" }); const code = (await (await fetch(`${BASE}/__mails?to=${encodeURIComponent(M1.email)}`)).json()).text.match(/\b\d{6}\b/)[0];
q = await M1.c.call("POST", "/me/confirm-delete", { code });
chk("hesap silinince sipariş mali kayıt olarak kalır (kullanıcı bağı kopar)", q.status === 200 && sql(`SELECT count(*) FROM orders WHERE id='${o1.id}' AND user_id IS NULL`) === "1", q);
finish();
