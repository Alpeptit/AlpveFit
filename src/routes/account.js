import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { createVerificationCode, verifyCode, sendMail } from "../utils/mailer.js";
import { codeMail, noticeMail, mailLang, resetMail, siteBase } from "../utils/emailTemplates.js";
import { createResetRequest, RESET_TTL_MIN } from "../utils/passwordReset.js";
import { issueFactor, verifyFactor, respondFactorFailure } from "../utils/secondFactor.js";
import { checkBan, recordFailure, clearFailures, checkHourlyActionLimit, sendLocked } from "../utils/rateLimit.js";
import { isValidEmail, isNonEmptyString, fullNameError, normalizeFullName } from "../utils/validate.js";
import { sanitizeText } from "../utils/sanitize.js";
import { hashPassword, verifyPassword, validatePassword, isSameAsCurrentPassword, SAME_PASSWORD_ERROR } from "../utils/password.js";
import { clearAuthCookies, refreshAuthCookie, parseCookies, CSRF_COOKIE_NAME } from "../utils/cookies.js";
import { reissuedToken } from "../utils/sessionRenew.js";

export const accountRouter = withAsyncErrors(express.Router()); // M-05 (v4): merkezi async hata yakalama

const NAME_CHANGE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;   // v55: ad soyad değişikliği ayda en fazla bir kez (önceden 3 ay)

// Hesap işlemleri (ad, e-posta, şifre, hesap silme) için e-posta kodu gönderim hakkı:
// ilk gönderim + en fazla 3 yeniden gönderim (kayıt ve girişteki kuralla aynı: "3 kez").
// Saatlik pencere kullanılır; böylece işlemi baştan başlatmak sınırı sıfırlamaz.
const MAX_CODE_SENDS_PER_HOUR = 4;
const TOO_MANY_SENDS = "En fazla 3 kez kod isteyebilirsiniz. Lütfen mevcut kodunuzu kontrol edin.";
async function allowCodeSend(userId, purpose) {
  return checkHourlyActionLimit(`${purpose}-send:${userId}`, "account_code_send", MAX_CODE_SENDS_PER_HOUR);
}


// ---------- GÜVENLİ ÇIKIŞ — token_version'ı artırır, eski token'lar anında ölür ----------
accountRouter.post("/account/logout", requireAuth, async (req, res) => {
  await pool.query(`UPDATE users SET token_version = token_version + 1 WHERE id = $1`, [req.user.sub]);
  clearAuthCookies(res);
  res.json({ ok: true });
});

// ---------- ŞİFRE DEĞİŞTİR (oturum açıkken) — eski şifreyi doğrular ----------
// ---------- ŞİFRE: adım 1 — mevcut şifre + kurallar, ardından e-posta onay kodu ----------
// Yeni şifrenin yalnızca HASH'i, 5 dakika geçerli onay kaydında bekletilir; düz şifre hiçbir yerde saklanmaz.
accountRouter.post("/account/request-password-change", requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!isNonEmptyString(oldPassword, 200)) return res.status(400).json({ error: "Lütfen mevcut şifrenizi giriniz." });
  if (!isNonEmptyString(newPassword, 200)) return res.status(400).json({ error: "Lütfen yeni şifrenizi giriniz." });

  const { rows } = await pool.query(`SELECT full_name, username, email, password_hash FROM users WHERE id = $1`, [req.user.sub]);
  const user = rows[0];
  if (!(await verifyPassword(oldPassword, user.password_hash))) {
    return res.status(400).json({ error: "Mevcut şifreniz yanlış." }); // v27: 401 değil — oturum geçerli; istemci oturumu kapatmasın
  }
  const passwordError = validatePassword(newPassword, user.full_name, user.username);
  if (passwordError) return res.status(400).json({ error: passwordError });
  // v43: mevcut şifre yeni şifre olarak yeniden kullanılamaz (sunucu kuralı; bcrypt ile güvenli karşılaştırma)
  if (await isSameAsCurrentPassword(newPassword, user.password_hash)) return res.status(400).json({ error: SAME_PASSWORD_ERROR, code: "same_password" });

  if (!(await allowCodeSend(req.user.sub, "password_change"))) return res.status(429).json({ error: TOO_MANY_SENDS });
  const newHash = await hashPassword(newPassword);
  const issued = await issueFactor(req.user.sub, "password_change", newHash, { to: user.email, build: (c) => codeMail("password_change", c, mailLang(req)) });
  if (issued.mailFailed) return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  res.json({ method: "email", message: "Onay kodu e-posta adresinize gönderildi." });
});

// ---------- ŞİFRE: adım 2 — kodu doğrula, uygula ----------
// v59: BEKLENMEDİK ÇIKIŞ DÜZELTMESİ — önceden başarılı değişiklikten sonra BU oturumun çerezleri de silinip kullanıcı ana sayfaya
// atılıyordu. Artık token_version artırılarak DİĞER tüm oturumlar (başka cihazlar, çalınmış olabilecek çerezler) anında kapanır;
// değişikliği yapan oturum yeni sürümlü belirteçle sürer (v57 Authenticator yenilemesiyle aynı desen). Kullanıcıya ve e-postada
// açıkça söylenir. Oturum yenilenemezse (ör. belirteç imzalanamazsa) güvenli tarafta kalınır: çerez silinir ve yeniden giriş istenir.
accountRouter.post("/account/confirm-password-change", requireAuth, async (req, res) => {
  const { code } = req.body;
  const identifier = `password-change:${req.user.sub}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const result = await verifyFactor(req.user.sub, "password_change", code);
  if (!result.valid) return respondFactorFailure(res, identifier, result);
  await clearFailures(identifier, "verification_code");

  const { rows } = await pool.query(
    `UPDATE users SET password_hash = $2, token_version = token_version + 1 WHERE id = $1 RETURNING email, token_version`,
    [req.user.sub, result.target]
  );
  // v55: eski şifreyle başlatılmış, Authenticator adımında bekleyen giriş biletleri de geçersiz olur
  await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose = 'login_totp_ticket' AND consumed_at IS NULL`, [req.user.sub]);
  let kept = false;
  try {
    refreshAuthCookie(res, reissuedToken(req.user, rows[0].token_version), parseCookies(req.headers.cookie || "")[CSRF_COOKIE_NAME]);
    kept = true;
  } catch { clearAuthCookies(res); }
  const mailResult = await sendMail(rows[0].email, noticeMail(kept ? "password_changed_kept" : "password_changed", mailLang(req)));
  if (mailResult.reason === "send_failed") {
    console.warn(`[account] Şifre değişikliği güvenlik bildirimi ${rows[0].email} adresine gönderilemedi.`);
  }
  if (!kept) return res.json({ ok: true, keptSession: false, message: "Şifreniz değiştirildi. Güvenlik nedeniyle yeniden giriş yapmanız gerekiyor." });
  res.json({ ok: true, keptSession: true, message: "Şifreniz değiştirildi. Bu cihazda oturumunuz açık kaldı; diğer tüm cihazlardaki oturumlar güvenliğiniz için kapatıldı." });
});

// ---------- ORTAK: bekleyen onay kodunu yeniden gönder (en fazla 3 kez) ----------
// Yeni kod, bekleyen işlemin HEDEFİYLE (yeni ad / yeni e-posta / yeni şifre hash'i) üretilir;
// eski bekleyen kodlar geçersiz kılınır, böylece yalnızca en son gönderilen kod çalışır.
const RESENDABLE = ["name_change", "email_change_old", "email_change", "password_change", "delete_account"];
accountRouter.post("/account/resend-code", requireAuth, async (req, res) => {
  const purpose = String(req.body.purpose || "");
  if (!RESENDABLE.includes(purpose)) return res.status(400).json({ error: "Geçersiz işlem." });

  const { rows: pending } = await pool.query(
    `SELECT target FROM verification_codes
     WHERE user_id = $1 AND purpose = $2 AND consumed_at IS NULL AND created_at > now() - interval '1 hour'
     ORDER BY created_at DESC LIMIT 1`,
    [req.user.sub, purpose]
  );
  if (pending.length === 0) return res.status(400).json({ error: "Bekleyen bir onay işlemi bulunamadı. Lütfen işlemi yeniden başlatın." });
  if (!(await allowCodeSend(req.user.sub, purpose))) return res.status(429).json({ error: TOO_MANY_SENDS });

  await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose = $2 AND consumed_at IS NULL`, [req.user.sub, purpose]);
  const target = pending[0].target;
  const code = await createVerificationCode(req.user.sub, purpose, target, 5);
  const { rows: u } = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.sub]);
  const to = purpose === "email_change" ? target : u[0].email;   // e-posta değişiminde kod YENİ adrese gider
  const mailResult = await sendMail(to, codeMail(purpose, code, mailLang(req), { newName: purpose === "name_change" ? target : undefined, newEmail: purpose === "email_change_old" ? target : undefined }));
  if (mailResult.reason === "send_failed" || mailResult.reason === "smtp_required_in_production") {
    return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  }
  res.json({ message: "Yeni kod e-posta adresinize gönderildi." });
});

// ---------- AD SOYAD: adım 1 — uygunluk + onay kodu ----------
accountRouter.post("/account/request-name-change", requireAuth, async (req, res) => {
  const nameError = fullNameError(req.body.newName);
  if (nameError) return res.status(400).json({ error: nameError });
  const newName = sanitizeText(normalizeFullName(req.body.newName));

  const { rows } = await pool.query(`SELECT email, last_name_change_at FROM users WHERE id = $1`, [req.user.sub]);
  const user = rows[0];
  if (user.last_name_change_at && Date.now() - new Date(user.last_name_change_at).getTime() < NAME_CHANGE_COOLDOWN_MS) {
    const daysLeft = Math.ceil((NAME_CHANGE_COOLDOWN_MS - (Date.now() - new Date(user.last_name_change_at).getTime())) / 86400000);
    return res.status(429).json({ error: `Ad soyad değişikliği ayda en fazla bir kez yapılabilir. Tekrar değiştirebilmeniz için ${daysLeft} gün beklemeniz gerekiyor.` });
  }

  if (!(await allowCodeSend(req.user.sub, "name_change"))) return res.status(429).json({ error: TOO_MANY_SENDS });
  const issued = await issueFactor(req.user.sub, "name_change", newName, { to: user.email, build: (c) => codeMail("name_change", c, mailLang(req), { newName }) });
  if (issued.mailFailed) return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  res.json({ method: "email", message: "Onay kodu e-posta adresinize gönderildi." });
});

// ---------- AD SOYAD: adım 2 — kodu doğrula, uygula ----------
accountRouter.post("/account/confirm-name-change", requireAuth, async (req, res) => {
  const { code } = req.body;
  const identifier = `name-change:${req.user.sub}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const result = await verifyFactor(req.user.sub, "name_change", code);
  if (!result.valid) return respondFactorFailure(res, identifier, result);
  await clearFailures(identifier, "verification_code");

  await pool.query(
    `UPDATE users SET full_name = $2, last_name_change_at = now() WHERE id = $1`,
    [req.user.sub, result.target]
  );
  res.json({ ok: true, fullName: result.target });
});

// ---------- E-POSTA DEĞİŞİKLİĞİ (v37): İKİ AŞAMALI — önce ESKİ, sonra YENİ adres onaylanır ----------
//   1) request-email-change      → kod ESKİ (mevcut) adrese gider      (purpose: email_change_old, hedef: yeni adres)
//   2) confirm-email-change-old  → eski adres doğrulanınca kod YENİ adrese gider (purpose: email_change)
//   3) confirm-email-change      → yeni adres doğrulanınca e-posta değişir
// Hesabın e-postası yalnız ikisini de kanıtlayan kişi tarafından değiştirilebilir (eski adrese erişimi olmayan biri
// oturumu ele geçirse bile adresi değiştiremez). v55: Google Authenticator etkin olsa da bu işlemde uygulama kodu İSTENMEZ;
// onay ve bildirim yalnız e-posta üzerinden yürür.
accountRouter.post("/account/request-email-change", requireAuth, async (req, res) => {
  const newEmail = (req.body.newEmail || "").trim().toLowerCase();
  if (!isValidEmail(newEmail)) return res.status(400).json({ error: "Lütfen geçerli bir e-posta adresi giriniz." });

  const { rows } = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.sub]);
  const currentEmail = rows[0].email;
  if (newEmail === currentEmail) return res.status(400).json({ error: "Bu zaten mevcut e-posta adresiniz." });

  // L-02 (v67 güvenlik denetimi): saatlik gönderim sınırı, "bu e-posta başka bir hesapta mı" 409 yanıtından ÖNCE denetlenir.
  // Eskiden 409 bu sınırdan önce dönüyordu; giriş yapmış biri bu uç noktayı hız sınırına takılmadan bir e-posta adresinin
  // kayıtlı olup olmadığını ölçmek için (hesap sayımı) kullanabiliyordu. Artık her deneme (çakışanlar dahil) sınıra sayılır.
  if (!(await allowCodeSend(req.user.sub, "email_change_old"))) return res.status(429).json({ error: TOO_MANY_SENDS });

  const taken = await pool.query(`SELECT id FROM users WHERE email = $1`, [newEmail]);
  if (taken.rows.length > 0) return res.status(409).json({ error: "Bu e-posta adresi başka bir hesap tarafından kullanılıyor." });
  // yeniden başlatma: önceki yarım kalmış işlem (eski/yeni aşama) geçersiz olur
  await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose IN ('email_change_old','email_change') AND consumed_at IS NULL`, [req.user.sub]);
  const code = await createVerificationCode(req.user.sub, "email_change_old", newEmail, 5);
  const oldMailResult = await sendMail(currentEmail, codeMail("email_change_old", code, mailLang(req), { newEmail }));
  if (oldMailResult.reason === "send_failed" || oldMailResult.reason === "smtp_required_in_production") {
    return res.status(503).json({ error: "Mevcut e-posta adresinize kod gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  }
  res.json({ step: "old", method: "email", message: "Onay kodu mevcut e-posta adresinize gönderildi." });
});

// ---------- E-POSTA: adım 2 — ESKİ adres doğrulandı → kod YENİ adrese gider ----------
accountRouter.post("/account/confirm-email-change-old", requireAuth, async (req, res) => {
  const { code } = req.body;
  const identifier = `email-change:${req.user.sub}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const result = await verifyFactor(req.user.sub, "email_change_old", code); // v55: yalnız mevcut adrese giden e-posta kodu
  if (!result.valid) return respondFactorFailure(res, identifier, result);
  await clearFailures(identifier, "verification_code");

  const newEmail = result.target;
  const taken = await pool.query(`SELECT id FROM users WHERE email = $1`, [newEmail]);
  if (taken.rows.length > 0) return res.status(409).json({ error: "Bu e-posta adresi başka bir hesap tarafından kullanılıyor." });
  if (!(await allowCodeSend(req.user.sub, "email_change"))) return res.status(429).json({ error: TOO_MANY_SENDS });

  const newCode = await createVerificationCode(req.user.sub, "email_change", newEmail, 5);
  const newMailResult = await sendMail(newEmail, codeMail("email_change", newCode, mailLang(req)));
  if (newMailResult.reason === "send_failed" || newMailResult.reason === "smtp_required_in_production") {
    return res.status(503).json({ error: "Yeni e-posta adresinize doğrulama kodu gönderilemedi, lütfen işlemi yeniden başlatın.", mailFailed: true });
  }
  const [u, d] = newEmail.split("@");
  res.json({ step: "new", method: "email", maskedEmail: `${u.slice(0, 1)}${"*".repeat(Math.max(2, u.length - 1))}@${d}`, message: "Doğrulama kodu yeni e-posta adresinize gönderildi." });
});

// ---------- E-POSTA: adım 3 — YENİ adres doğrulandı, e-posta değişir ----------
accountRouter.post("/account/confirm-email-change", requireAuth, async (req, res) => {
  const { code } = req.body;
  const identifier = `email-change:${req.user.sub}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const result = await verifyCode(req.user.sub, "email_change", code); // yeni adresin sahipliği e-posta koduyla kanıtlanır
  if (!result.valid) return respondFactorFailure(res, identifier, result);
  await clearFailures(identifier, "verification_code");

  const { rows: before } = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.sub]);
  let upd;
  try {
    // v66 (güvenlik denetimi): e-posta (hesabın kurtarma adresi) değişince DİĞER cihazlardaki oturumlar kapanır (şifre değişimiyle
    // aynı kural). ÖNCEDEN eski oturumlar açık kalıyordu: ele geçirilmiş bir oturum, hesap sahibi adresini değiştirse de sürüyordu.
    // Bu cihazdaki oturum yeni sürüm numarasıyla yeniden imzalanır; kullanıcı burada çıkış yapmış olmaz.
    ({ rows: upd } = await pool.query(`UPDATE users SET email = $2, token_version = token_version + 1 WHERE id = $1 RETURNING token_version`, [req.user.sub, result.target]));
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Bu e-posta adresi başka bir hesap tarafından kullanılıyor." }); // aradaki yarış
    throw err;
  }
  await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose = 'login_totp_ticket' AND consumed_at IS NULL`, [req.user.sub]);
  try { refreshAuthCookie(res, reissuedToken(req.user, upd[0].token_version), parseCookies(req.headers.cookie || "")[CSRF_COOKIE_NAME]); } catch { /* yenilenemezse kullanıcı yeniden giriş yapar */ }
  // güvenlik bildirimi: eski adrese "değişti" bilgisi (kod değil)
  if (before[0]?.email) sendMail(before[0].email, noticeMail("email_changed", mailLang(req))).catch(() => {});
  res.json({ ok: true, email: result.target });
});

// ---------- SON GİRİŞLER — hesap güvenliği için son 20 girişi listeler ----------
accountRouter.get("/account/login-history", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ip_address, user_agent, created_at FROM login_history
     WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
    [req.user.sub]
  );
  res.json(rows);
});

// ---------- v21: PANEL İÇİNDEN "Şifremi unuttum" — yalnız OTURUMDAKİ hesap ----------
// Kullanıcı panelde (giriş yapmış) iken e-posta/kullanıcı adı SORULMAZ: bağlantı + kod, oturumdaki hesabın kayıtlı e-postasına
// gönderilir. Hesap istekten değil oturumdan (req.user.sub) alınır → panelden BAŞKA bir hesabın sıfırlaması başlatılamaz.
// v57: aynı istek modeli (utils/passwordReset.js): istemci yalnız istek anahtarını (resetId) alır; doğrulama ve yeni şifre
// POST /api/auth/reset-password/verify ve /api/auth/reset-password ile (şifre değişince tüm oturumlar kapanır).
accountRouter.post("/account/password-reset/request", requireAuth, async (req, res) => {
  if (!(await allowCodeSend(req.user.sub, "password_reset"))) return res.status(429).json({ error: TOO_MANY_SENDS });
  const { rows } = await pool.query(`SELECT id, email FROM users WHERE id = $1`, [req.user.sub]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  const { rid, code, link } = await createResetRequest(user.id);
  const base = siteBase();
  const resetMailResult = await sendMail(user.email, resetMail(mailLang(req), { code, url: base ? `${base}/#sifre-sifirla=${link}` : "", minutes: RESET_TTL_MIN }));
  if (resetMailResult.sent === false && resetMailResult.reason !== "not_configured") return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  // e-posta maskelenmiş gösterilir
  const [u, d] = user.email.split("@");
  res.json({ result: "sent", resetId: rid, maskedEmail: `${u.slice(0, 1)}${"*".repeat(Math.max(2, u.length - 1))}@${d}` });
});
