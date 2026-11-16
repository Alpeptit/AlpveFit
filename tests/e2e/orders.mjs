// Paket siparişi, USDT TRC20 ödeme eşleştirme, %5 kripto indirimi, profil ve 180 gün saklama — gerçek rota kodu + gerçek PostgreSQL.
//   node --import ./tools/authsim/register.mjs tools/devserver.mjs &      (PORT=8902)
//   node --import ./tools/authsim/register.mjs tests/e2e/orders.mjs
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { Client, signup, login, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";

const chain = (hash, amount, conf = 25, recheck = false) => fetch(`${BASE}/__chain?hash=${hash}&amount=${amount}&conf=${conf}${recheck ? "&recheck=1" : ""}`);
const H = () => [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, "0")).join("");
const M1 = await signup("Ayşe Deneme", "ord1"), M2 = await signup("Mehmet Kaya", "ord2"), M3 = await signup("Can Yılmaz", "ord3");
const C1 = await signup("Selin Uzman", "ocoach"), C2 = await signup("Burak Koç", "ocoach2"), A = await signup("Yonetici Hesap", "oadm");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);
await A.c.call("PUT", `/admin/users/${C1.id}/role`, { role: "coach", planKinds: ["nutrition"] }); await login(C1); await enableTotp(C1);
await A.c.call("PUT", `/admin/users/${C2.id}/role`, { role: "coach", planKinds: ["nutrition"] }); await login(C2); await enableTotp(C2);

// ---- katalog ve sipariş kuralları ----
let r = await new Client().call("GET", "/packages");
chk("paketler herkese açık; kart pasif; %5 kripto indirimi ve 7 gün teslim", r.status === 200 && r.body.cardEnabled === false && r.body.cryptoDiscountRate === 0.05 && r.body.planDeliveryDays === 7 && r.body.packages.length === 3, r.body);
const adv = r.body.packages.find((p) => p.key === "advanced"), st = r.body.packages.find((p) => p.key === "starter"), cp = r.body.packages.find((p) => p.key === "competitor");
chk("paket süreleri: Başlangıç 12/24, İleri 16/24, Yarışmacı 12; farmakoloji yalnız ileri ve yarışmacıda",
  st.options.map((o) => o.weeks).join() === "12,24" && adv.options.map((o) => o.weeks).join() === "16,24" && cp.options.map((o) => o.weeks).join() === "12" && !st.pharmacology && adv.pharmacology && cp.pharmacology, r.body);
chk("kripto fiyatı = liste fiyatı × 0,95", st.options[0].price === 149 && st.options[0].cryptoPrice === 141.55, st.options[0]);
r = await new Client().call("POST", "/orders", { packageKey: "starter", weeks: 12, method: "crypto", consent: true }); chk("misafir sipariş veremez", r.status === 401, r);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 12, method: "card", consent: true }); chk("kredi kartı ile sipariş reddedilir (pasif)", r.status === 409 && r.body.code === "card_disabled", r);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 12, method: "crypto" }); chk("sözleşme onayı olmadan sipariş olmaz", r.status === 400 && r.body.code === "consent_required", r);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 16, method: "crypto", consent: true }); chk("pakette olmayan süre reddedilir", r.status === 400, r);
r = await M1.c.call("POST", "/orders", { packageKey: "hack", weeks: 12, method: "crypto", consent: true }); chk("geçersiz paket reddedilir", r.status === 400, r);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 12, method: "crypto", consent: true, price: 1, subtotal: 1, cryptoDiscount: 0.9 });
const o1 = r.body.order;
chk("sipariş: fiyat ve %5 indirim SUNUCUDA hesaplanır (istemci fiyatı yok sayılır)", r.status === 201 && Number(o1.subtotal) === 141.55 && Number(o1.list_price) === 149 && Number(o1.crypto_discount_rate) === 0.05, r.body);
chk("sipariş: benzersiz ödeme tutarı kuruş kovasında (141,55–141,56)", Number(o1.expected_amount) > 141.55 && Number(o1.expected_amount) < 141.56 && o1.status === "pending" && /^AVF-\d{6}$/.test(o1.order_number), o1);
r = await M1.c.call("GET", "/orders/" + o1.id); chk("ödeme bilgisi: cüzdan adresi, tam tutar, QR", r.body.paymentInstructions && r.body.paymentInstructions.walletAddress && r.body.paymentInstructions.exactAmount === o1.expected_amount && /^data:image/.test(r.body.paymentInstructions.qr || ""), r.body);
r = await M2.c.call("GET", "/orders/" + o1.id); chk("başka üye siparişi göremez (404)", r.status === 404, r);
r = await M2.c.call("POST", `/orders/${o1.id}/cancel`, {}); chk("başka üye siparişi iptal edemez", r.status === 404, r);
r = await M1.c.call("GET", "/orders"); chk("üye yalnız kendi siparişlerini listeler", r.body.length === 1 && r.body[0].id === o1.id, r.body);
r = await M1.c.call("GET", "/notifications"); chk("ödeme bekleniyor bildirimi", r.body.some((n) => n.type === "order_payment" && n.order_id === o1.id), r.body);
r = await M1.c.call("POST", "/orders", { packageKey: "starter", weeks: 24, method: "crypto", consent: true }); const o1b = r.body.order;
r = await M1.c.call("POST", "/orders", { packageKey: "advanced", weeks: 16, method: "crypto", consent: true }); chk("en fazla 2 ödenmemiş sipariş", r.status === 429 && r.body.code === "too_many_open", r);
r = await M1.c.call("POST", `/orders/${o1b.id}/cancel`, {}); chk("ödenmemiş sipariş iptal edilir", r.status === 200, r);

// ---- zincir eşleştirme ----
await chain(H(), 12.34);
chk("eşleşmeyen transfer kayda alınır, sipariş değişmez", sql(`SELECT count(*) FROM unmatched_transactions WHERE reason='no_matching_order'`) === "1" && sql(`SELECT status FROM orders WHERE id='${o1.id}'`) === "pending", null);
const tx1 = H(); await chain(tx1, o1.expected_amount, 5);
chk("yetersiz onay: sipariş 'payment_review'a geçer, erişim AÇILMAZ", sql(`SELECT status FROM orders WHERE id='${o1.id}'`) === "payment_review" && sql(`SELECT count(*) FROM member_access WHERE member_id='${M1.id}'`) === "0", null);
await chain(H(), 0.5, 25, true);
chk("19+ onay sonrası yeniden kontrol: sipariş 'paid'", sql(`SELECT status FROM orders WHERE id='${o1.id}'`) === "paid", sql(`SELECT status FROM orders WHERE id='${o1.id}'`));
chk("ödeme: plans_due_at = ödeme + 7 gün", sql(`SELECT (plans_due_at - paid_at) = interval '7 days' FROM orders WHERE id='${o1.id}'`) === "t", null);
chk("Başlangıç paketi: beslenme+antrenman+takviye açılır, FARMAKOLOJİ AÇILMAZ", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M1.id}'`) === "nutrition,supplement,training", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M1.id}'`));
r = await M1.c.call("GET", "/notifications"); chk("ödeme bildirimi 'order_paid'; bekleme bildirimi kalktı", r.body.some((n) => n.type === "order_paid") && !r.body.some((n) => n.type === "order_payment" && n.order_id === o1.id), r.body);
const mm = await (await fetch(`${BASE}/__mails?to=${encodeURIComponent(M1.email)}`)).json(); chk("ödeme onay e-postası (7 gün bilgisi)", /7 gün/.test(mm.text) && /AVF-/.test(mm.text), mm && mm.text.slice(0, 200));
await chain(tx1, o1.expected_amount, 25); chk("aynı işlem ikinci kez işlenmez", sql(`SELECT count(*) FROM orders WHERE tx_hash='${tx1}'`) === "1" && sql(`SELECT count(*) FROM notifications WHERE type='order_paid' AND user_id='${M1.id}'`) === "1", null);
r = await M1.c.call("POST", `/orders/${o1.id}/cancel`, {}); chk("ödenmiş sipariş iptal edilemez", r.status === 409, r);
r = await M1.c.call("GET", "/plans/overview"); chk("üye paneli: erişim açılan 3 tür görünür", r.body.kinds.map((k) => k.kind).join() === "nutrition,training,supplement", r.body);

// İleri seviye → farmakoloji açılır; hatalı tutar → incelemeye
r = await M2.c.call("POST", "/orders", { packageKey: "advanced", weeks: 16, method: "crypto", consent: true }); const o2 = r.body.order;
chk("ileri seviye 16 hafta: 229 × 0,95 = 217,55", Number(o2.subtotal) === 217.55 && o2.pharmacology === true, o2);
await chain(H(), Number(o2.expected_amount) + 3, 25);
chk("fazla tutar otomatik ONAYLANMAZ: 'flagged' + eşleşmeyen kaydı", sql(`SELECT status FROM orders WHERE id='${o2.id}'`) === "flagged" && sql(`SELECT count(*) FROM unmatched_transactions WHERE reason='amount_mismatch_flagged'`) === "1", sql(`SELECT status FROM orders WHERE id='${o2.id}'`));
r = await M2.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "deneme gerekçesi uzun" }); chk("üye elle onay veremez (admin API gizli 404)", r.status === 404, r);
r = await C1.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "deneme gerekçesi uzun" }); chk("uzman ödeme onaylayamaz (403)", r.status === 403, r);
r = await A.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "kısa" }); chk("elle onay: gerekçe zorunlu", r.status === 400, r);
r = await A.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "Müşteri fazla gönderdi, fark iade edilecek", txHash: "xyz" }); chk("elle onay: geçersiz hash reddedilir", r.status === 400, r);
r = await A.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "Müşteri fazla gönderdi, fark iade edilecek" }); chk("yönetici incelemedeki siparişi gerekçeyle onaylar", r.status === 200, r);
r = await A.c.call("POST", `/admin/orders/${o2.id}/approve`, { reason: "Müşteri fazla gönderdi, fark iade edilecek" }); chk("ikinci onay reddedilir (409)", r.status === 409, r);
chk("İleri paket: FARMAKOLOJİ da açılır", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M2.id}'`) === "nutrition,pharmacology,supplement,training", sql(`SELECT string_agg(kind, ',' ORDER BY kind) FROM member_access WHERE member_id='${M2.id}'`));
chk("elle onay denetim kaydında (admin_manual + gerekçe)", sql(`SELECT count(*) FROM audit_log WHERE action='order_paid' AND details->>'source'='admin_manual'`) === "1", null);
r = await A.c.call("GET", "/admin/orders"); chk("yönetici sipariş listesi: ödenmiş siparişler + yayınlanan plan sayısı", r.status === 200 && r.body.some((o) => o.id === o2.id && o.status === "paid" && o.plans_published === 0), r.body.slice(0, 1));
r = await C1.c.call("GET", "/admin/orders"); chk("uzman sipariş listesini göremez", r.status === 403, r);
r = await A.c.call("GET", "/admin/unmatched"); chk("yönetici eşleşmeyen transferleri görür", r.status === 200 && r.body.length >= 2, r.body.length);

// süre dolumu
r = await M3.c.call("POST", "/orders", { packageKey: "competitor", weeks: 12, method: "crypto", consent: true }); const o3 = r.body.order;
chk("yarışmacı 12 hafta: 399 × 0,95 = 379,05", Number(o3.subtotal) === 379.05, o3);
sql(`UPDATE orders SET payment_expires_at = now() - interval '1 minute' WHERE id='${o3.id}'`);
r = await M3.c.call("GET", "/orders/" + o3.id); chk("süresi dolan sipariş 'expired' olur ve ödeme bilgisi kapanır", r.body.order.status === "expired" && r.body.paymentInstructions === null, r.body);

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

// üye hesabı silinince ödenmiş sipariş mali kayıt olarak kalır, kişisel veriler gider
let q = await M1.c.call("POST", "/me/request-delete", { password: "Kirmizi.Elma7" }); const code = (await (await fetch(`${BASE}/__mails?to=${encodeURIComponent(M1.email)}`)).json()).text.match(/\b\d{6}\b/)[0];
q = await M1.c.call("POST", "/me/confirm-delete", { code });
chk("hesap silinince sipariş mali kayıt olarak kalır (kullanıcı bağı kopar)", q.status === 200 && sql(`SELECT count(*) FROM orders WHERE id='${o1.id}' AND user_id IS NULL`) === "1", q);
finish();
