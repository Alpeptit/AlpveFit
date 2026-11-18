import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyTotpOnce } from "../utils/totpOnce.js";
import { pool } from "../db/pool.js";
import { hashPassword, verifyPassword, validatePassword, validateUsername, isSameAsCurrentPassword, SAME_PASSWORD_ERROR, hasWhitespace, PASSWORD_SPACE_ERROR } from "../utils/password.js";
import { createVerificationCode, verifyCode, sendMail, createTicket, peekCode, consumeCodeId } from "../utils/mailer.js";
import { codeMail, noticeMail, mailLang, resetMail, siteBase, welcomeMail } from "../utils/emailTemplates.js";
import { rememberLang } from "../utils/lang.js";
import { verifyRecaptcha } from "../utils/recaptcha.js";
import { checkBan, recordFailure, clearFailures, recordLoginPasswordFailure, checkAndIncrementResendCount, checkHourlyActionLimit, sendLocked, sendCodeFailure, isLockActive, clearTemporaryLock, clearLoginPasswordFailures, LOGIN_NOTIFY_MS } from "../utils/rateLimit.js";
import { createResetRequest, refreshResetRequest, verifyResetCode, verifyResetLink, findTicket, consumeTicket, isResetToken, identifierKey, RESET_TTL_MIN, RESET_PER_IP_HOUR, RESET_PER_ID_HOUR, RESET_PER_USER_HOUR } from "../utils/passwordReset.js";
import { requireAuth } from "../middleware/auth.js";
import { permissionsOf } from "../utils/permissions.js";
import { isValidEmail, isNonEmptyString, requireFields, fullNameError, normalizeFullName } from "../utils/validate.js";
import { logAudit } from "../utils/auditLog.js";
import { issueAuthCookies, clearAuthCookies } from "../utils/cookies.js";
import { sanitizeText } from "../utils/sanitize.js";

export const authRouter = withAsyncErrors(express.Router()); // M-05 (v4): merkezi async hata yakalama

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SIX_DIGIT_RE = /^\d{6}$/;
import { matchRecoveryCode } from "../utils/recoveryCodes.js";

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, tv: user.token_version }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    algorithm: "HS256",
  });
}

// ---------- KAYIT: adım 1 — bilgileri doğrula, kod gönder ----------
authRouter.post("/register", async (req, res) => {
  const { fullName, username, email, password, recaptchaToken, kvkkAccepted, aboutAccepted } = req.body;
  const missing = requireFields(req.body, ["fullName", "username", "email", "password"]);
  if (missing) return res.status(400).json({ error: `Lütfen tüm alanları doldurun (${missing}).` });
  if (!isValidEmail(email)) return res.status(400).json({ error: "Lütfen geçerli bir e-posta adresi giriniz." });
  // Ad soyad kuralı tek kaynaktan (utils/validate.js): harf, 1–2 boşluk.
  const nameError = fullNameError(fullName);
  if (nameError) return res.status(400).json({ error: nameError });
  if (fullName.length > 100 || username.length > 40) {
    return res.status(400).json({ error: "Girilen alanlar çok uzun." });
  }
  if (!(await verifyRecaptcha(recaptchaToken))) {
    return res.status(400).json({ error: "Lütfen robot olmadığınızı doğrulayın." });
  }
  if (!kvkkAccepted || !aboutAccepted) {
    return res.status(400).json({ error: "KVKK metnini ve Hakkımızda kısmını onaylamanız gerekir." });
  }
  const usernameError = validateUsername(username);
  if (usernameError) return res.status(400).json({ error: usernameError });

  const passwordError = validatePassword(password, fullName, username);
  if (passwordError) return res.status(400).json({ error: passwordError });

  // v43: e-posta / kullanıcı adı çakışması.
  //  • DOĞRULANMIŞ bir hesap bu e-postayı kullanıyorsa kayıt yapılmaz (genel ama yol gösteren mesaj).
  //  • Aynı e-postayla başlatılıp DOĞRULANMAMIŞ (kodu hiç girilmemiş) ve 30 dakikadan eski bir kayıt varsa, e-posta sahipliği hiç
  //    kanıtlanmadığı için yeni kayıt onun ÜZERİNE yazılır ve yeni kod gönderilir. Önceden bu kayıt e-postayı süresiz "kullanımda" tutuyordu
  //    (yarıda kalan kayıt veya başkasının bu adresle başlattığı kayıt, gerçek sahibinin kayıt olmasını engelliyordu).
  //  • Kullanıcı adı, 24 saatten eski DOĞRULANMAMIŞ bir kayıtta kalmışsa serbest bırakılır.
  //  Not: kalıcı silinen hesap satırı tamamen silindiği için e-postası zaten serbesttir.
  const em = email.trim().toLowerCase(), un = username.trim().toLowerCase();
  // Kalıcı yasaklanan (yönetici tarafından silinen) hesabın e-postası yeniden kayıt olamaz (yalnız özeti saklanır).
  const banned = await pool.query(`SELECT 1 FROM banned_emails WHERE email_hash = encode(digest($1, 'sha256'), 'hex')`, [em]);
  if (banned.rows.length) return res.status(403).json({ error: "Bu e-posta adresiyle kayıt olunamaz. Bir yanlışlık olduğunu düşünüyorsanız destek@alpvefit.com adresine yazın.", code: "banned" });
  const existing = await pool.query(
    `SELECT id, email, username, email_verified_at, created_at < now() - interval '24 hours' AS stale,
            created_at < now() - interval '30 minutes' AS pending_old FROM users WHERE email = $1 OR username = $2`,
    [em, un]
  );
  let reuseId = null;
  for (const m of existing.rows) {
    if (m.email === em) {
      if (m.email_verified_at) {
        return res.status(409).json({ error: "Bu e-posta adresiyle yeni kayıt oluşturulamadı. Bu adrese ait etkin bir hesap varsa giriş yapabilir veya şifrenizi sıfırlayabilirsiniz. Hesap silme işlemi e-postadaki onay koduyla tamamlanmadıysa hesap hâlâ etkindir." });
      }
      // Son 30 dakikada başlatılmış doğrulama bekleyen kayıt EZİLMEZ: o kişi tam şu an kodu bekliyor olabilir; üzerine yazmak,
      // başkasının belirlediği şifreyi, gerçek sahibinin gireceği yeni kodla bağlama riskini doğururdu.
      if (!m.pending_old) {
        return res.status(409).json({ error: "Bu e-posta adresi için doğrulama bekleyen bir kayıt var. E-postanıza gönderilen kodu girerek tamamlayabilir veya 30 dakika sonra kaydı yeniden başlatabilirsiniz.", code: "pending_verification" });
      }
      reuseId = m.id;
    } else if (m.username === un) {
      if (!m.email_verified_at && m.stale) await pool.query(`DELETE FROM users WHERE id = $1 AND email_verified_at IS NULL`, [m.id]);
      else return res.status(409).json({ error: "Bu kullanıcı adı alınmış, lütfen başka bir kullanıcı adı deneyin." });
    }
  }

  const passwordHash = await hashPassword(password);
  let rows;
  try {
    ({ rows } = reuseId
      ? await pool.query(
          `UPDATE users SET full_name = $2, username = $3, password_hash = $4, created_at = now(), token_version = token_version + 1
           WHERE id = $1 AND email_verified_at IS NULL RETURNING id, email`,
          [reuseId, sanitizeText(normalizeFullName(fullName)), un, passwordHash])
      : await pool.query(
          `INSERT INTO users (full_name, username, email, password_hash, user_code)
           VALUES ($1, $2, $3, $4, 'AVF-' || lpad(nextval('user_code_seq')::text, 6, '0')) RETURNING id, email`,
          [sanitizeText(normalizeFullName(fullName)), un, em, passwordHash]));
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Bu kullanıcı adı alınmış, lütfen başka bir kullanıcı adı deneyin." });
    throw err;
  }
  if (!rows.length) return res.status(409).json({ error: "Kayıt şu anda tamamlanamadı. Lütfen tekrar deneyin." });
  const user = rows[0];
  await rememberLang(user.id, req);

  await clearFailures(`register-resend:${user.id}`, "resend_count");
  const code = await createVerificationCode(user.id, "register", null, 5);
  const mailResult = await sendMail(user.email, codeMail("register", code, mailLang(req)));

  if (mailResult.reason === "send_failed" || mailResult.reason === "smtp_required_in_production") {
    // K10 düzeltmesi: SMTP yapılandırılmıştı ama gönderim GERÇEKTEN
    // başarısız oldu (örn. sağlayıcı geçici olarak erişilemez). Kullanıcıya
    // "kod gönderildi" yanılgısı vermek yerine bunu açıkça bildiriyoruz —
    // hesap zaten oluşturuldu, kullanıcı /register/resend ile tekrar deneyebilir.
    return res.status(503).json({ userId: user.id, error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin veya kodu yeniden isteyin.", mailFailed: true });
  }

  res.json({ userId: user.id, message: "Doğrulama kodu e-posta adresinize gönderildi." });
});

// ---------- KAYIT: adım 2 — kodu doğrula, hesabı etkinleştir ----------
authRouter.post("/register/verify", async (req, res) => {
  const { userId, code, recaptchaToken } = req.body;
  if (!UUID_RE.test(userId || "") || !SIX_DIGIT_RE.test(code || "")) {
    return res.status(400).json({ error: "Geçersiz istek." });
  }
  if (!(await verifyRecaptcha(recaptchaToken))) {
    return res.status(400).json({ error: "Lütfen robot olmadığınızı doğrulayın." });
  }
  const identifier = `register:${userId}`;

  // v66 (güvenlik denetimi): bu uç YALNIZ doğrulama bekleyen kayıtlar içindir. ÖNCEDEN hesap zaten doğrulanmış olsa da her hatalı
  // kod ortak doğrulama sayacına yazılıyordu; bir hesabın kimliğini (userId) bilen biri 6 hatalı denemeyle o hesabı 30 dakika
  // kilitleyip tüm oturumlarını kapatabiliyordu (hizmet engelleme). Artık hesap yoksa veya doğrulanmışsa sayaç ARTMAZ ve yanıt,
  // var/yok bilgisini sızdırmayan genel "geçersiz istek"tir.
  const { rows: pending } = await pool.query(`SELECT email_verified_at FROM users WHERE id = $1`, [userId]);
  if (!pending[0] || pending[0].email_verified_at) return res.status(400).json({ error: "Geçersiz istek." });

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const result = await verifyCode(userId, "register", code);
  if (!result.valid) {
    return sendCodeFailure(res, await recordFailure(identifier, "verification_code"));
  }

  await clearFailures(identifier, "verification_code");
  const { rows } = await pool.query(
    `UPDATE users SET email_verified_at = now(), member_status = CASE WHEN member_status = 'rejected' THEN member_status ELSE 'approved' END WHERE id = $1 AND email_verified_at IS NULL RETURNING id, full_name, email, username, role, member_status, user_code, last_name_change_at, token_version`,
    [userId]
  );
  const user = rows[0];
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  const { token_version, ...publicUser } = user; // istemciye iç detay sızdırılmaz
  issueAuthCookies(res, signToken(user));
  sendMail(user.email, welcomeMail(mailLang(req), { name: String(user.full_name || "").split(" ")[0] })).catch(() => {});   // karşılama iletisi; gönderilemezse kayıt etkilenmez
  res.json({ user: publicUser });
});

/** v58: art arda hatalı şifre nedeniyle uzun bekleme başladı — hesap sahibine site bildirimi + e-posta (saatte en fazla bir kez). */
async function notifyPasswordLock(user, until, req) {
  if (!(await checkHourlyActionLimit(`pwlock-notice:${user.id}`, "password_lock_notice", 1))) return;
  const minutes = Math.max(1, Math.round((new Date(until).getTime() - Date.now()) / 60_000));
  await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
    [user.id, `Hesabınıza art arda hatalı şifreyle giriş denendiği için girişler ${minutes} dakika bekletiliyor. Bu denemeleri siz yapmadıysanız "Şifremi unuttum" ile şifrenizi yenileyin; yenileme beklemeyi hemen kaldırır.`]);
  await logAudit(user.id, "login_password_lock", "user", user.id, { minutes }, req.ip).catch(() => {});
  sendMail(user.email, noticeMail("password_lock", user.preferred_lang || mailLang(req), { minutes: String(minutes), until })).catch(() => {});
}

// ---------- GİRİŞ: adım 1 — kullanıcı adı/e-posta + şifre ----------
authRouter.post("/login", async (req, res) => {
  const { identifier: loginId, password, recaptchaToken } = req.body;
  const ip = req.ip;

  if (!isNonEmptyString(loginId, 254) || !isNonEmptyString(password, 200)) {
    return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
  }
  if (hasWhitespace(password)) return res.status(400).json({ error: PASSWORD_SPACE_ERROR });   // v55: şifrede boşluk kabul edilmez
  if (!(await verifyRecaptcha(recaptchaToken))) {
    return res.status(400).json({ error: "Lütfen robot olmadığınızı doğrulayın." });
  }

  const normalizedId = loginId.trim().toLowerCase();
  const accountIdentifier = `account:${normalizedId}`;

  // v58: giriş şifresinde yalnız GEÇİCİ bekleme vardır (hesap: 4. hata 5 dk, 5. hata 30 dk, 6+ 1 saat; IP: 10/15/20 hata);
  // süresiz kilit yoktur, hesap var/yok aynı yanıt. Ayrıntı: utils/rateLimit.js (LOGIN_*_LADDER).
  const pwBan = await checkBan(ip, "login_password");
  const accountBan = await checkBan(accountIdentifier, "login_password");
  if (pwBan.banned || accountBan.banned) {
    const candidates = [pwBan.bannedUntil, accountBan.bannedUntil].filter(Boolean).map((d) => new Date(d).getTime());
    const bannedUntil = new Date(Math.max(...candidates));
    return res.status(429).json({ error: "banned", bannedUntil });
  }

  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1 OR username = $1`,
    [normalizedId]
  );
  const user = rows[0];
  // Kullanıcı bulunamasa bile bcrypt.compare'e benzer bir gecikme yaşanması için
  // sahte bir hash ile karşılaştırma yapılır — bu, "kullanıcı var mı yok mu" bilgisinin
  // yanıt süresinden (timing) sızmasını önler.
  const passwordOk = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyPassword(password, "$2b$12$C6UzMDM.H6dfI/f/IKcEeO/dpv2C/JWNfBK/9NRIQY8LWc1JLIfoi");

  if (!passwordOk) {
    const outcomeIp = await recordLoginPasswordFailure(ip);
    const outcomeAccount = await recordLoginPasswordFailure(accountIdentifier);
    // O2 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN başarısız giriş
    // denemeleri hiçbir yerde durable olarak kaydedilmiyordu — sadece
    // rate-limit sayaçları tutuluyordu (banlamak için), ama admin/güvenlik
    // izleme için sorgulanabilir bir kayıt yoktu. Mevcut audit_log'u
    // yeniden kullanıyoruz — hesap gerçekten bulunduysa user.id, aksi
    // halde null (audit_log.actor_id NULL kabul ediyor).
    await logAudit(user?.id || null, "login_failed", "user", accountIdentifier, { reason: "wrong_password" }, ip);
    // v58: hesap için 30 dk ve üstü bekleme başladıysa hesap sahibine haber verilir (saatte en fazla bir kez). Bildirim yalnız
    // sunucu tarafındadır; istemci yanıtı hesap olsun olmasın aynıdır.
    if (user && outcomeAccount.banMs >= LOGIN_NOTIFY_MS) notifyPasswordLock(user, outcomeAccount.bannedUntil, req).catch(() => {});
    const candidates = [outcomeIp.bannedUntil, outcomeAccount.bannedUntil].filter(Boolean).map((d) => new Date(d).getTime());
    const bannedUntil = candidates.length ? new Date(Math.max(...candidates)) : undefined;
    return res.status(401).json({ error: "invalid_credentials", bannedUntil });
  }

  await pool.query(`DELETE FROM rate_limit_state WHERE identifier IN ($1, $2) AND action = 'login_password'`, [ip, accountIdentifier]);

  // v57: 6 art arda hatalı doğrulama kodunda hesap 30 dk kilitlenir (şifre doğru olsa bile süre boyunca giriş yok); süre dolunca
  // ya da "Şifremi unuttum" ile şifre yenilenince açılır. Eski kalıcı kilit (locked_until NULL) yalnız yönetici tarafından açılır.
  if (isLockActive(user)) return sendLocked(res, user);

  if (!user.email_verified_at) {
    // Hesap hiç doğrulanmamış — tam girişe İZİN VERİLMEZ. Bunun yerine
    // kullanıcıyı kayıt doğrulama akışına geri gönderiyoruz ve YENİ bir kod
    // veriyoruz. Bu, eski kodu süresi dolan bir kullanıcının sonsuza kadar
    // takılı kalmasını da otomatik olarak çözer — tekrar giriş denemesi,
    // doğrulamayı tamamlamanın yolu haline gelir.
    const registerCode = await createVerificationCode(user.id, "register", null, 5);
    const mailResult = await sendMail(user.email, codeMail("register", registerCode, mailLang(req)));
    if (mailResult.reason === "send_failed" || mailResult.reason === "smtp_required_in_production") {
      return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
    }
    return res.json({
      userId: user.id,
      secondFactor: "register_verify",
      message: "Hesabınız henüz e-posta ile doğrulanmamış. Yeni bir doğrulama kodu gönderildi.",
    });
  }

  // v55: e-posta tabanlı iki adımlı giriş doğrulaması KALDIRILDI. Girişte ek doğrulama yalnız kullanıcı Google Authenticator'ı
  // kendisi etkinleştirdiyse istenir; etkin değilse şifre doğrulaması girişi tamamlar (mevcut normal akış).
  if (user.totp_enabled) {
    // Şifre adımının geçildiği, tek kullanımlık ve 10 dakika geçerli bir GİRİŞ BİLETİYLE kanıtlanır: ikinci adım (Authenticator /
    // kurtarma kodu) bu bilet olmadan çalışmaz. Böylece hesap kimliğini (userId) bilen biri şifre adımını atlayıp yalnız uygulama
    // kodu ya da kurtarma koduyla oturum açamaz.
    const loginTicket = await createTicket(user.id, "login_totp_ticket", 10);
    return res.json({ userId: user.id, secondFactor: "totp", loginTicket });
  }
  res.json(await finishLogin(req, res, user.id));
});

// ---------- KAYIT: kodu yeniden gönder (süresi dolduysa, en fazla 3 kez) ----------
authRouter.post("/register/resend", async (req, res) => {
  const { userId } = req.body;
  if (!UUID_RE.test(userId || "")) return res.status(400).json({ error: "Geçersiz istek." });

  const { rows } = await pool.query(`SELECT email, email_verified_at, locked_at, locked_until FROM users WHERE id = $1`, [userId]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  if (isLockActive(user)) return sendLocked(res, user);
  if (user.email_verified_at) return res.status(400).json({ error: "Hesap zaten doğrulanmış." });

  const allowed = await checkAndIncrementResendCount(`register-resend:${userId}`, "resend_count");
  if (!allowed) return res.status(429).json({ error: "En fazla 3 kez kod isteyebilirsiniz. Lütfen mevcut kodunuzu kontrol edin." });

  const code = await createVerificationCode(userId, "register", null, 5);
  const mailResult = await sendMail(user.email, codeMail("register", code, mailLang(req)));
  if (mailResult.reason === "send_failed" || mailResult.reason === "smtp_required_in_production") {
    return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  }
  res.json({ message: "Yeni kod gönderildi." });
});

// ---------- GİRİŞ: adım 2 — Google Authenticator kodu VEYA kurtarma koduyla tamamla (Authenticator etkinse) ----------
// v55: kurtarma kodları GİRİŞTE kullanılır (telefonunu kaybeden kullanıcı için); şifre sıfırlama artık Authenticator'a dokunmaz.
// Kullanılan kurtarma kodu atomik olarak tüketilir, Authenticator AÇIK kalır; kullanıcıya site bildirimi + e-posta gider ve işlem
// denetim kaydına yazılır. Authenticator'ı kaldırmak / yeniden kurmak yalnız panelden, e-posta onayıyla yapılır.
authRouter.post("/login/verify-totp", async (req, res) => {
  const { userId, token, recoveryCode, loginTicket } = req.body || {};
  const wantsRecovery = recoveryCode != null && recoveryCode !== "";
  if (!UUID_RE.test(userId || "") || !isNonEmptyString(loginTicket, 100) || !isNonEmptyString(wantsRecovery ? recoveryCode : token, 20)) {
    return res.status(400).json({ error: "Geçersiz istek." });
  }
  const identifier = `login-totp:${userId}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const tk = await peekCode(userId, "login_totp_ticket", loginTicket);
  if (!tk.valid) return res.status(400).json({ error: "login_expired", message: "Giriş doğrulamasının süresi doldu. Lütfen yeniden giriş yapın." });

  const { rows } = await pool.query(`SELECT email, totp_enabled, totp_secret, backup_codes, locked_at, locked_until FROM users WHERE id = $1`, [userId]);
  const user = rows[0];
  if (!user || !user.totp_enabled || !user.totp_secret) return res.status(400).json({ error: "login_expired", message: "Giriş doğrulamasının süresi doldu. Lütfen yeniden giriş yapın." });
  if (isLockActive(user)) return sendLocked(res, user);

  const input = String(wantsRecovery ? recoveryCode : token).replace(/\s+/g, "");
  let usedRecovery = null, ok = false, left = 0;
  if (wantsRecovery) {
    // v67: yeni 12 karakterlik kodlar ("v2:" özet) ve (LEGACY_RECOVERY_CODES açıkken) eski 6 haneli kodlar
    const hit = await matchRecoveryCode(input, user.backup_codes);
    if (hit) { usedRecovery = hit; ok = true; }
  } else {
    ok = await verifyTotpOnce(userId, input, user.totp_secret);   // v22: aynı kod ikinci kez kullanılamaz
  }
  if (!ok) {
    const outcome = await recordFailure(identifier, "verification_code");
    await logAudit(userId, "login_failed", "user", userId, { reason: wantsRecovery ? "wrong_recovery_code" : "wrong_totp" }, req.ip);
    return sendCodeFailure(res, outcome);
  }

  if (!(await consumeCodeId(tk.id))) return res.status(400).json({ error: "login_expired", message: "Giriş doğrulamasının süresi doldu. Lütfen yeniden giriş yapın." });
  if (usedRecovery) {
    // atomik: kod hâlâ listedeyse çıkarılır (eşzamanlı ikinci kullanım başarısız olur)
    const upd = await pool.query(
      `UPDATE users SET backup_codes = array_remove(backup_codes, $2) WHERE id = $1 AND $2 = ANY(backup_codes)
       RETURNING COALESCE(array_length(backup_codes, 1), 0) AS left`, [userId, usedRecovery]);
    if (upd.rows.length !== 1) return res.status(400).json({ error: "wrong_code" });
    left = Number(upd.rows[0].left || 0);
  }
  await clearFailures(identifier, "verification_code");

  if (usedRecovery) {
    await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
      [userId, `Hesabınıza kurtarma koduyla giriş yapıldı. Kalan kurtarma kodu: ${left}. Telefonunuzu kaybettiyseniz Hesap Ayarları › İki Adımlı Doğrulama bölümünden "Authenticator'ı yenile" ile e-posta doğrulamasıyla yeni telefonunuza kurun.`]);
    await logAudit(userId, "recovery_code_used", "user", userId, { context: "login", left }, req.ip);
    sendMail(user.email, noticeMail("recovery_used", mailLang(req), { ip: String(req.ip || "").slice(0, 64), left: String(left) })).catch(() => {});
  }
  const out = await finishLogin(req, res, userId);
  res.json(usedRecovery ? { ...out, recoveryUsed: true } : out);
});

async function finishLogin(req, res, userId) {
  const { rows } = await pool.query(`SELECT id, full_name, email, username, role, member_status, user_code, last_name_change_at, totp_enabled, COALESCE(array_length(backup_codes, 1), 0) AS recovery_codes_left, token_version FROM users WHERE id = $1`, [userId]);
  const user = rows[0];
  await rememberLang(user.id, req);   // v46: arka plan e-postaları (sipariş) üyenin kullandığı dilde gider
  await pool.query(
    `INSERT INTO login_history (user_id, ip_address, user_agent) VALUES ($1, $2, $3)`,
    [user.id, req.ip, req.headers["user-agent"]]
  );
  const { token_version, ...publicUser } = user; // istemciye iç detay sızdırılmaz
  issueAuthCookies(res, signToken(user));
  return { user: publicUser };
}

// ---------- ŞİFREMİ UNUTTUM (v57) ----------
// Hesap olsun ya da olmasın AYNI genel yanıt; istemciye kullanıcı kimliği değil istek anahtarı (resetId) verilir. E-postada tek
// kullanımlık bağlantı + 6 haneli kod (15 dk). Hatalı kod denemeleri yalnız isteğe yazılır, hesabı KİLİTLEMEZ (bkz. utils/passwordReset.js).
const RESET_SENT_MSG = "Bu bilgilere ait bir hesap varsa, kayıtlı e-posta adresine şifre sıfırlama bağlantısı ve kodu gönderdik. Bağlantı ve kod 15 dakika geçerlidir.";
const RESET_TOO_MANY_REQ = "Çok fazla şifre sıfırlama isteği yapıldı. Lütfen bir saat sonra tekrar deneyin.";
const RESET_EXPIRED = { error: "reset_expired", message: "Sıfırlama isteğinin süresi doldu veya geçersiz. Lütfen şifre sıfırlamayı yeniden başlatın." };
const RESET_TOO_MANY = { error: "reset_too_many", message: "6 kez art arda hatalı kod girildiği için bu sıfırlama isteği iptal edildi. Hesabınız kilitlenmedi; yeni bir sıfırlama isteği başlatabilirsiniz." };

/** Sıfırlama e-postası. Yanıtı BEKLETMEDEN gönderilir: gönderim süresi ve sonucu, hesabın var olup olmadığını sızdırmaz. */
function sendResetMail(to, lang, code, link) {
  const base = siteBase();
  const url = base ? `${base}/#sifre-sifirla=${link}` : "";   // anahtar parça (#) içinde: sunucu günlüklerine / Referer'a gitmez
  sendMail(to, resetMail(lang, { code, url, minutes: RESET_TTL_MIN }))
    .then((r) => { if (r && r.sent === false && r.reason !== "not_configured") console.warn(`[auth] Şifre sıfırlama e-postası gönderilemedi (sebep: ${r.reason}).`); })
    .catch((err) => console.warn("[auth] Şifre sıfırlama e-postası gönderilemedi:", err && err.message));
}

authRouter.post("/forgot-password", async (req, res) => {
  const { identifier: loginId, recaptchaToken } = req.body;
  if (!isNonEmptyString(loginId, 254)) {
    return res.status(400).json({ error: "Lütfen kullanıcı adı veya e-posta adresinizi giriniz." });
  }
  if (!(await verifyRecaptcha(recaptchaToken))) {
    return res.status(400).json({ error: "Lütfen robot olmadığınızı doğrulayın." });
  }
  const normalizedId = loginId.trim().toLowerCase();
  // Sınırlar hesabın varlığından BAĞIMSIZ: IP ve yazılan kimlik başına (ikisi de var olmayan hesapta da aynı şekilde işler).
  if (!(await checkHourlyActionLimit(`forgot-ip:${req.ip}`, "password_reset_request", RESET_PER_IP_HOUR))
      || !(await checkHourlyActionLimit(`forgot-id:${identifierKey(normalizedId)}`, "password_reset_request", RESET_PER_ID_HOUR))) {
    return res.status(429).json({ error: RESET_TOO_MANY_REQ });
  }
  const { rows } = await pool.query(`SELECT id, email FROM users WHERE email = $1 OR username = $1`, [normalizedId]);
  let user = rows[0] || null;
  // Hesap başına saatlik e-posta sınırı (e-posta ve kullanıcı adı dönüşümlü yazılarak aşılamasın). Aşılırsa SESSİZCE gönderilmez.
  if (user && !(await checkHourlyActionLimit(`forgot-user:${user.id}`, "password_reset_mail", RESET_PER_USER_HOUR))) user = null;
  const { rid, code, link } = await createResetRequest(user ? user.id : null);
  if (user) sendResetMail(user.email, mailLang(req), code, link);
  res.json({ result: "sent", resetId: rid, message: RESET_SENT_MSG });
});

// ---------- ŞİFREMİ UNUTTUM: aynı istek için yeni bağlantı + kod (istek başına en fazla 3 kez) ----------
authRouter.post("/reset-password/resend", async (req, res) => {
  const { resetId } = req.body || {};
  const r = await refreshResetRequest(resetId);
  if (r.error === "too_many_resends") return res.status(429).json({ error: "En fazla 3 kez kod isteyebilirsiniz. Lütfen mevcut kodunuzu kontrol edin." });
  if (r.error) return res.status(400).json(RESET_EXPIRED);
  if (r.userId) {
    const { rows } = await pool.query(`SELECT email FROM users WHERE id = $1`, [r.userId]);
    if (rows[0] && (await checkHourlyActionLimit(`forgot-user:${r.userId}`, "password_reset_mail", RESET_PER_USER_HOUR))) sendResetMail(rows[0].email, mailLang(req), r.code, r.link);
  }
  res.json({ message: "Yeni bağlantı ve kod gönderildi." });   // hesap yoksa da aynı yanıt
});

// ---------- ŞİFREMİ UNUTTUM: adım 2a — e-postadaki 6 haneli kod ----------
authRouter.post("/reset-password/verify", async (req, res) => {
  const { resetId, code } = req.body || {};
  if (!isResetToken(resetId) || !SIX_DIGIT_RE.test(code || "")) return res.status(400).json({ error: "Geçersiz istek." });
  const r = await verifyResetCode(resetId, code);
  if (r.ok) return res.json({ ok: true, ticket: r.ticket });
  if (r.error === "reset_too_many") {
    await logAudit(null, "password_reset_failed", "password_reset", null, { reason: "too_many_codes" }, req.ip).catch(() => {});
    return res.status(429).json(RESET_TOO_MANY);
  }
  if (r.error === "reset_expired") return res.status(400).json(RESET_EXPIRED);
  return res.status(400).json({ error: "wrong_code" });
});

// ---------- ŞİFREMİ UNUTTUM: adım 2b — e-postadaki bağlantı (site /#sifre-sifirla=… parçasını okuyup buraya gönderir) ----------
authRouter.post("/reset-password/link", async (req, res) => {
  if (!(await checkHourlyActionLimit(`reset-link:${req.ip}`, "password_reset_link", 30))) return res.status(429).json({ error: RESET_TOO_MANY_REQ });
  const r = await verifyResetLink(String((req.body && req.body.token) || ""));
  if (!r.ok) return res.status(400).json(RESET_EXPIRED);
  res.json({ ok: true, ticket: r.ticket });
});

// ---------- ŞİFREMİ UNUTTUM: adım 3 — yeni şifre (yalnız doğrulanmış bilet ile) ----------
// Bilet ancak her şey doğrulandıktan sonra tüketilir. Şifre değişince tüm oturumlar kapanır; kullanıcı OTOMATİK GİRİŞ YAPMIŞ
// SAYILMAZ (Authenticator etkinse girişte yine sorulur). v57: 6 hatalı doğrulama koduyla konan GEÇİCİ kilit de kalkar —
// kullanıcının kendi hesabını beklemeden kurtarma yolu budur.
authRouter.post("/reset-password", async (req, res) => {
  const { ticket, newPassword } = req.body || {};
  if (!isNonEmptyString(ticket, 100) || !isNonEmptyString(newPassword, 200)) return res.status(400).json({ error: "Geçersiz istek." });
  const tk = await findTicket(ticket);
  if (!tk) return res.status(400).json(RESET_EXPIRED);

  const { rows } = await pool.query(`SELECT full_name, username, email, password_hash, locked_at, locked_until, locked_reason FROM users WHERE id = $1`, [tk.userId]);
  const user = rows[0];
  if (!user) return res.status(400).json(RESET_EXPIRED);
  if (user.locked_at && !user.locked_until) return sendLocked(res, user);   // eski kalıcı kilit: yalnız yönetici açar
  if (isLockActive(user) && String(user.locked_reason || '').startsWith('admin_')) return sendLocked(res, user);   // yönetici yasağı sıfırlamayla açılmaz

  if (hasWhitespace(newPassword)) return res.status(400).json({ error: PASSWORD_SPACE_ERROR });
  const passwordError = validatePassword(newPassword, user.full_name, user.username);
  if (passwordError) return res.status(400).json({ error: passwordError });
  // v43: sıfırlamada da mevcut şifre yeniden kullanılamaz (saklı bcrypt özetine karşı; doğrulanamazsa reddedilir).
  if (await isSameAsCurrentPassword(newPassword, user.password_hash)) return res.status(400).json({ error: SAME_PASSWORD_ERROR, code: "same_password" });

  if (!(await consumeTicket(tk.id, tk.userId))) return res.status(400).json(RESET_EXPIRED);
  const passwordHash = await hashPassword(newPassword);
  await pool.query(`UPDATE users SET password_hash = $2, token_version = token_version + 1 WHERE id = $1`, [tk.userId, passwordHash]);
  // yarım kalan bir Authenticator girişi (şifre adımı geçilmiş bilet) eski şifreyle tamamlanamasın
  await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose = 'login_totp_ticket' AND consumed_at IS NULL`, [tk.userId]);
  const wasLocked = isLockActive(user);
  await clearTemporaryLock(tk.userId);
  await clearLoginPasswordFailures(user.email, user.username);   // v58: hatalı şifre beklemesi de kalkar
  await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
    [tk.userId, "Şifreniz, e-posta adresinize gönderilen sıfırlama bağlantısı/koduyla değiştirildi. Tüm oturumlar kapatıldı."]).catch(() => {});
  await logAudit(tk.userId, "password_reset", "user", tk.userId, { unlocked: wasLocked }, req.ip).catch(() => {});
  sendMail(user.email, noticeMail("password_changed", mailLang(req))).then((m) => {
    if (m && m.reason === "send_failed") console.warn(`[auth] Şifre değişikliği güvenlik bildirimi gönderilemedi (kullanıcı ${String(tk.userId).slice(0, 8)}).`);
  }).catch(() => {});
  res.json({ ok: true, unlocked: wasLocked });
});

// ---------- Oturum gerektiren: profil bilgisi ----------
authRouter.get("/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, full_name, username, email, totp_enabled, COALESCE(array_length(backup_codes, 1), 0) AS recovery_codes_left, role, plan_kinds, member_status, user_code, last_name_change_at, created_at FROM users WHERE id = $1`,
    [req.user.sub]
  );
  if (!rows[0]) return res.status(401).json({ error: "Oturum geçersiz veya süresi dolmuş.", sessionExpired: true });
  res.json({ ...rows[0], permissions: permissionsOf(rows[0].role) });
});
