// Dosya ekleri (destek talebi + kişisel bilgiler), boş profil kaydı ve çalışma saati — gerçek rota kodu + gerçek PostgreSQL.
//   node --import ./tools/authsim/register.mjs tests/e2e/uploads.mjs   (devserver açıkken)
process.env.SIM_DB ||= "avfsim"; process.env.DATABASE_URL ||= "postgres://local/avfsim";
import { signup, enableTotp, sql, chk, finish, BASE } from "./lib.mjs";

const M1 = await signup("Dosya Uye", "upl1"), M2 = await signup("Baska Uye", "upl2"), A = await signup("Dosya Yonetici", "upla");
sql(`UPDATE users SET role='admin' WHERE id='${A.id}'`); await enableTotp(A);

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64, 1)]);
const PDF = Buffer.from("%PDF-1.4\n%test\n" + "x".repeat(50));
const DOCX = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from("....[Content_Types].xml....word/document.xml....")]);
const DOCM = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from("....[Content_Types].xml....word/vbaProject.bin....")]);
const EXE = Buffer.concat([Buffer.from("MZ"), Buffer.alloc(80, 0)]);
async function up(p, scope, name, buf, type = "") {
  const headers = { cookie: p.c.cookieHeader(), origin: BASE, "content-type": "application/octet-stream", "x-file-name": encodeURIComponent(name), "x-file-type": type };
  if (p.c.jar.avf_csrf) headers["x-csrf-token"] = p.c.jar.avf_csrf;
  const r = await fetch(BASE + "/api/uploads/" + scope, { method: "POST", headers, body: buf });
  let body = null; try { body = await r.json(); } catch { /* boş */ }
  return { status: r.status, body };
}
const get = (p, path) => fetch(BASE + path, { headers: { cookie: p.c.cookieHeader() } });

// ---- boş profil kaydedilmez; çalışma saati ----
let r = await M1.c.call("PUT", "/profile", { healthConsent: true }); chk("boş kişisel bilgi formu kaydedilmez (400)", r.status === 400 && r.body.code === "empty", r);
r = await M1.c.call("PUT", "/profile", { heightCm: "", weightKg: "", occupation: "  ", healthConsent: true }); chk("yalnız boşluk/boş değerler de kaydedilmez", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { workHours: "09:00-09:00", healthConsent: true }); chk("çalışma saati: başlangıç = bitiş reddedilir", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { workHours: "25:00-18:00", healthConsent: true }); chk("çalışma saati: geçersiz saat reddedilir", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { workHours: "gece", healthConsent: true }); chk("çalışma saati: bilinmeyen düzen reddedilir", r.status === 400, r);

// ---- kişisel bilgi eki: rıza olmadan yüklenemez ----
r = await up(M1, "profile", "tahlil.png", PNG, "image/png"); chk("rıza yokken kişisel bilgi eki reddedilir", r.status === 400 && r.body.code === "consent_required", r);
r = await M1.c.call("PUT", "/profile", { workHours: "09:00-18:00", heightCm: 180, healthConsent: true }); chk("çalışma saati kaydedilir", r.status === 200 && r.body.work_hours === "09:00-18:00", r);
r = await M1.c.call("PUT", "/profile", { workHours: "shift", heightCm: 180 }); chk("vardiyalı düzen kaydedilir", r.status === 200 && r.body.work_hours === "shift", r);
r = await M1.c.call("PUT", "/profile", { workHours: "shift", workSchedule: { mon: "08:00-16:00", sat: "22:00-06:00" }, workNote: "İki hafta gece vardiyası", heightCm: 180 });
chk("vardiyalıda gün gün saat ve not kaydedilir", r.status === 200 && r.body.work_schedule.sat === "22:00-06:00" && r.body.work_note === "İki hafta gece vardiyası", r.body);
r = await M1.c.call("PUT", "/profile", { workHours: "shift", workSchedule: { xyz: "08:00-16:00" }, heightCm: 180 }); chk("bilinmeyen gün anahtarı reddedilir", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { workHours: "flexible", workSchedule: { mon: "08:00-08:00" }, heightCm: 180 }); chk("gün içinde başlangıç = bitiş reddedilir", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { workHours: "flexible", workSchedule: ["x"], heightCm: 180 }); chk("dizi biçimli çizelge reddedilir", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { workHours: "none", workNote: "x".repeat(301), heightCm: 180 }); chk("300 karakteri aşan not reddedilir", r.status === 400, r);
r = await M1.c.call("PUT", "/profile", { workHours: "09:00-18:00", workSchedule: { mon: "08:00-16:00" }, workNote: "yok sayılır", heightCm: 180 }); chk("sabit saatte çizelge/not saklanmaz", r.status === 200 && r.body.work_schedule === null && r.body.work_note === null, r.body);

// ---- tür / içerik / boyut doğrulaması ----
r = await up(M1, "profile", "virus.exe", EXE); chk("izin verilmeyen uzantı reddedilir", r.status === 400, r);
r = await up(M1, "profile", "resim.png", EXE, "image/png"); chk("içerik uzantıyla uyuşmazsa reddedilir (sahte PNG)", r.status === 400 && /uyuşmuyor/.test(r.body.error), r);
r = await up(M1, "profile", "rapor.svg", Buffer.from("<svg></svg>"), "image/svg+xml"); chk("SVG kabul edilmez", r.status === 400, r);
r = await up(M1, "profile", "makro.docx", DOCM); chk("makro içeren belge reddedilir", r.status === 400, r);
r = await up(M1, "profile", "buyuk.png", Buffer.concat([PNG, Buffer.alloc(4 * 1024 * 1024)]), "image/png"); chk("4 MB üstü reddedilir", r.status === 400 && /4 MB/.test(r.body.error), r);
r = await up(M1, "profile", "png.jpg", PNG, "image/jpeg"); chk("PNG içeriği .jpg adıyla reddedilir", r.status === 400, r);

// ---- en fazla 4 ----
const ids = [];
for (const [n, b, t] of [["a.png", PNG, "image/png"], ["b.pdf", PDF, "application/pdf"], ["c.docx", DOCX, ""], ["d.png", PNG, "image/png"]]) { r = await up(M1, "profile", n, b, t); if (r.status === 201) ids.push(r.body.id); }
chk("PNG, PDF, DOCX kabul edilir (4 dosya)", ids.length === 4, ids);
r = await up(M1, "profile", "e.png", PNG, "image/png"); chk("kişisel bilgilerde 5. dosya reddedilir", r.status === 400 && /4/.test(r.body.error), r);
r = await M1.c.call("GET", "/uploads/profile"); chk("üye kendi dosya listesini görür", r.status === 200 && r.body.length === 4 && !("data" in r.body[0]), r.body);

// ---- erişim ----
let g = await get(M1, "/api/attachments/" + ids[0]);
const gb = Buffer.from(await g.clone().arrayBuffer()); chk("indirilen dosya yüklenenle bayt bayt aynı", gb.equals(PNG), gb.length);
chk("sahibi dosyayı görür (güvenli başlıklarla)", g.status === 200 && g.headers.get("content-type") === "image/png" && g.headers.get("x-content-type-options") === "nosniff" && /sandbox/.test(g.headers.get("content-security-policy") || ""), g.status);
g = await get(M1, "/api/attachments/" + ids[1]); chk("görsel dışı dosya indirme olarak sunulur", /^attachment/.test(g.headers.get("content-disposition") || ""), g.headers.get("content-disposition"));
g = await get(M2, "/api/attachments/" + ids[0]); chk("başka üye dosyayı GÖREMEZ (404)", g.status === 404, g.status);
g = await get(M2, "/api/admin/attachments/" + ids[0]); chk("üye yönetim ucundan da göremez (404)", g.status === 404, g.status);
g = await get(A, "/api/admin/attachments/" + ids[0]); chk("yönetici kişisel bilgi ekini görür", g.status === 200, g.status);
r = await A.c.call("GET", `/admin/clients/${M1.id}/files`); chk("yönetici üyenin dosya listesini görür", r.status === 200 && r.body.length === 4, r.body);
r = await M2.c.call("DELETE", "/attachments/" + ids[0]); chk("başka üye dosyayı silemez", r.status === 404, r);
r = await M1.c.call("DELETE", "/attachments/" + ids[3]); chk("sahibi dosyasını siler", r.status === 200, r);

// ---- destek talebi ekleri ----
const t1 = await up(M1, "ticket", "ekran.png", PNG, "image/png"), t2 = await up(M1, "ticket", "dekont.pdf", PDF, "application/pdf");
chk("destek eki yüklenir", t1.status === 201 && t2.status === 201, [t1, t2]);
const o1 = await up(M2, "ticket", "x.png", PNG, "image/png");
r = await M1.c.call("POST", "/tickets", { title: "Ekli talep", subject: "Teknik Sorunlar", message: "Ekte görsel var", attachments: [o1.body.id] }); chk("başkasının eki talebe eklenemez", r.status === 400, r);
r = await M1.c.call("POST", "/tickets", { title: "Ekli talep", subject: "Teknik Sorunlar", message: "Ekte görsel var", attachments: ["a", "b", "c", "d", "e"] }); chk("geçersiz/5 ek reddedilir", r.status === 400, r);
r = await M1.c.call("POST", "/tickets", { title: "Ekli talep", subject: "Teknik Sorunlar", message: "Ekte görsel var", attachments: [t1.body.id, t2.body.id] });
chk("ekli destek talebi oluşturulur", r.status === 201, r); const tid = r.body.id;
r = await M1.c.call("GET", "/tickets/" + tid); chk("talep mesajında 2 ek görünür", r.body.messages[0].attachments.length === 2, r.body.messages[0]);
r = await M1.c.call("DELETE", "/attachments/" + t1.body.id); chk("gönderilmiş mesajın eki silinemez", r.status === 404, r);
r = await M1.c.call("POST", "/tickets", { title: "Tekrar", subject: "Diğer", message: "aynı ek", attachments: [t1.body.id] }); chk("kullanılmış ek ikinci kez eklenemez", r.status === 400, r);
g = await get(A, "/api/admin/attachments/" + t1.body.id); chk("yönetici destek ekini görür", g.status === 200, g.status);
r = await A.c.call("GET", "/admin/tickets/" + tid); chk("yönetici talepte ekleri görür", r.body.messages[0].attachments.length === 2, r.body);
r = await M1.c.call("DELETE", "/profile"); r = await M1.c.call("GET", "/uploads/profile"); chk("bilgiler silinince kişisel bilgi ekleri de silinir", r.body.length === 0, r.body);
finish();
