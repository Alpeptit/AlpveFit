import { isPanelRole } from "./../utils/permissions.js";
import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import bcrypt from "bcrypt";
import { generateSecret, keyuri } from "../utils/totp.js";
import { verifyTotpOnce, matchNewTotpStep } from "../utils/totpOnce.js";
import QRCode from "qrcode";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { genRecoveryCodes, hashRecoveryCode, matchRecoveryCode, normalizeRecovery, RECOVERY_NEW_RE } from "../utils/recoveryCodes.js";
import { createVerificationCode, verifyCode, sendMail, genSixDigitCode, createTicket, peekCode, consumeCodeId } from "../utils/mailer.js";
import { refreshAuthCookie, parseCookies, CSRF_COOKIE_NAME } from "../utils/cookies.js";
import { reissuedToken } from "../utils/sessionRenew.js";
import { codeMail, noticeMail, mailLang } from "../utils/emailTemplates.js";
import { checkBan, recordFailure, clearFailures, checkHourlyActionLimit, sendLocked, sendCodeFailure } from "../utils/rateLimit.js";
import { issueFactor, verifyFactor, respondFactorFailure } from "../utils/secondFactor.js";
import { logAudit } from "../utils/auditLog.js";
import { encrypt } from "../utils/crypto.js";

export const twoFactorRouter = withAsyncErrors(express.Router()); // M-05 (v4): merkezi async hata yakalama

// M-08 (final sertleştirme listesi) düzeltmesi: ÖNCEDEN bu dosyada
// crypto.randomInt(100000, 999999) ile AYRI bir kod üreticisi vardı — bu,
// mailer.js'deki (O11'de düzeltilen) AYNI off-by-one hatasını (max
// exclusive olduğu için 999999 asla üretilmiyordu) taşıyan, gereksiz bir
// kopyaydı. Artık tek, merkezi genSixDigitCode kullanılıyor.
function genBackupCodes(count = 8) {
  return genRecoveryCodes(count);   // v67: 12 karakterlik rastgele kod (XXXX-XXXX-XXXX); özetler "v2:" önekiyle saklanır
}

// ---------- adım 1: onay yöntemi ----------
// v55: iki adımlı GİRİŞ doğrulaması yalnız Google Authenticator'dır ve isteğe bağlıdır (varsayılan kapalı). E-posta, giriş MFA
// yöntemi olarak KULLANILMAZ.
// v56: • AÇMA: hesaba kayıtlı e-postaya gelen tek kullanımlık, 5 dakika geçerli kodla onaylanır (ardından QR + uygulama kodu).
//      • KAPATMA: YALNIZ Google Authenticator uygulamasındaki geçerli 6 haneli kodla onaylanır — e-posta kodu istenmez ve
//        e-postayla onay kodu GÖNDERİLMEZ. Kod tekrar kullanım korumalıdır (verifyTotpOnce) ve hatalı denemeler ortak kilit
//        merdivenine yazılır.
twoFactorRouter.post("/2fa/request-toggle", requireAuth, async (req, res) => {
  const { rows } = await pool.query(`SELECT email, totp_enabled, role FROM users WHERE id = $1`, [req.user.sub]);
  const user = rows[0];
  const enabled = !!user.totp_enabled;
  // Yönetici işlemleri Google Authenticator'ı ZORUNLU kılar (requireAdmin); kapatmak yöneticiyi paneline kilitlerdi.
  if (enabled && isPanelRole(user.role)) return res.status(403).json({ error: "Yönetici hesaplarında iki adımlı doğrulama zorunludur ve kapatılamaz." });
  if (enabled) return res.json({ method: "totp", message: "Google Authenticator uygulamanızdaki 6 haneli kodu girin." });
  if (req.body?.method != null && req.body.method !== "totp") {
    return res.status(400).json({ error: "İki adımlı giriş doğrulaması yalnız Google Authenticator ile yapılabilir." });
  }

  const code = await createVerificationCode(req.user.sub, "2fa_toggle", null, 5);
  const mailResult = await sendMail(user.email, codeMail("2fa_enable", code, mailLang(req)));
  if (mailResult.reason === "send_failed" || mailResult.reason === "smtp_required_in_production") {
    return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  }
  res.json({ method: "email", message: "Onay kodu e-posta adresinize gönderildi." });
});

// ---------- adım 2: kodu doğrula, Google Authenticator'ı aç (kurulumu başlat) / kapat ----------
// Kapatınca hesaba bağlı Google Authenticator verisi (anahtar, bekleyen anahtar, yedek kodlar, son kullanılan adım) TAMAMEN silinir.
twoFactorRouter.post("/2fa/confirm-toggle", requireAuth, async (req, res) => {
  const { code } = req.body;
  const identifier = `2fa-toggle:${req.user.sub}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const { rows: pre } = await pool.query(`SELECT totp_enabled, totp_secret, role FROM users WHERE id = $1`, [req.user.sub]);
  const disabling = !!pre[0]?.totp_enabled;
  if (disabling && isPanelRole(pre[0].role)) return res.status(403).json({ error: "Yönetici hesaplarında iki adımlı doğrulama zorunludur ve kapatılamaz." });

  // v56: kapatma = Authenticator kodu (tekrar kullanım korumalı); açma = e-posta kodu. Yanlış kod ortak kilit merdivenine yazılır.
  const ok = disabling
    ? await verifyTotpOnce(req.user.sub, String(code ?? ""), pre[0].totp_secret)
    : (await verifyCode(req.user.sub, "2fa_toggle", code)).valid;
  if (!ok) {
    return sendCodeFailure(res, await recordFailure(identifier, "verification_code"));
  }
  await clearFailures(identifier, "verification_code");

  const { rows } = await pool.query(`SELECT email, totp_enabled, role FROM users WHERE id = $1`, [req.user.sub]);
  if (rows[0].totp_enabled) {
    const upd = await pool.query(
      `UPDATE users SET two_factor_method = NULL, totp_enabled = false, totp_secret = NULL, backup_codes = NULL, totp_pending_secret = NULL, totp_pending_at = NULL, totp_last_step = NULL
        WHERE id = $1 AND totp_enabled = true RETURNING id`,
      [req.user.sub]
    );
    if (!upd.rows.length) return res.status(409).json({ error: "İki adımlı doğrulama zaten kapalı." });
    // bekleyen (henüz kullanılmamış) eski e-posta onay kodları ve giriş biletleri geçersiz kılınır
    await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose IN ('2fa_toggle', 'login_totp_ticket') AND consumed_at IS NULL`, [req.user.sub]);
    await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
      [req.user.sub, "Google Authenticator ile iki adımlı doğrulama kapatıldı."]);
    await logAudit(req.user.sub, "totp_disabled", "user", req.user.sub, { via: "totp_code" }, req.ip);
    // güvenlik bilgilendirmesi (onay kodu DEĞİL; işlem zaten tamamlandı): hesap sahibinin habersiz kapatmayı fark edebilmesi için
    sendMail(rows[0].email, noticeMail("totp_disabled", mailLang(req))).catch(() => {});
    return res.json({ enabled: false, message: "İki adımlı doğrulama kapatıldı." });
  }

  // Google Authenticator: gizli anahtar + QR kod. v27: etkinleştirme İKİ AŞAMALI — burada yalnız BEKLEYEN anahtar üretilir ve QR döner;
  // yöntem, kullanıcı uygulamadaki kodu /2fa/activate ile doğruladığında etkinleşir (QR'ı okutmadan yarıda bırakan kullanıcı kilitlenmez).
  const secret = generateSecret();
  await pool.query(`UPDATE users SET totp_pending_secret = $2, totp_pending_at = now() WHERE id = $1`, [req.user.sub, encrypt(secret)]);
  const otpUrl = keyuri(rows[0].email || "hesap", "Alpvefit", secret);
  const qrDataUrl = await QRCode.toDataURL(otpUrl, { errorCorrectionLevel: "M", margin: 1, width: 240 });
  res.json({ enabled: false, pending: true, qrDataUrl, secret }); // secret: QR okutulamazsa elle girmek için (yalnız bu an)
});

// ---------- v27: kurulumu tamamla — uygulamadaki 6 haneli kod bekleyen anahtarla doğrulanınca 2FA etkinleşir ----------
twoFactorRouter.post("/2fa/activate", requireAuth, async (req, res) => {
  const token = String(req.body?.token ?? "");
  const identifier = `2fa-activate:${req.user.sub}`;
  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const { rows } = await pool.query(
    `SELECT totp_enabled, totp_pending_secret, totp_pending_at > now() - interval '15 minutes' AS fresh FROM users WHERE id = $1`, [req.user.sub]);
  const u = rows[0];
  if (!u || u.totp_enabled) return res.status(409).json({ error: "İki adımlı doğrulama zaten etkin." });
  if (!u.totp_pending_secret || !u.fresh) return res.status(400).json({ error: "Kurulum süresi doldu. Lütfen işlemi yeniden başlatın." });

  // tekrar kullanım korumalı doğrulama (bekleyen anahtarla); kullanılan zaman adımı kaydedilir
  const ok = await verifyTotpOnce(req.user.sub, token, u.totp_pending_secret);
  if (!ok) {
    return sendCodeFailure(res, await recordFailure(identifier, "verification_code"));
  }
  await clearFailures(identifier, "verification_code");

  const backupCodes = genBackupCodes();
  const hashedBackupCodes = await Promise.all(backupCodes.map((c) => hashRecoveryCode(c)));
  const upd = await pool.query(
    `UPDATE users SET totp_enabled = true, two_factor_method = 'totp', totp_secret = totp_pending_secret, totp_pending_secret = NULL, totp_pending_at = NULL,
       backup_codes = $2
     WHERE id = $1 AND totp_enabled = false AND totp_pending_secret = $3 RETURNING email`,
    [req.user.sub, hashedBackupCodes, u.totp_pending_secret]   // arada yeni QR üretildiyse doğrulanmamış anahtar etkinleşmez
  );
  if (upd.rows.length === 0) return res.status(409).json({ error: "İki adımlı doğrulama zaten etkin." });
  sendMail(upd.rows[0].email, noticeMail("totp_enabled", mailLang(req))).catch(() => {});
  res.json({ enabled: true, backupCodes }); // yedek kodlar YALNIZ bu an gösterilir, bir daha geri getirilemez
});

twoFactorRouter.post("/2fa/verify-totp", requireAuth, async (req, res) => {
  const { token } = req.body;
  const identifier = `2fa-verify:${req.user.sub}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const { rows } = await pool.query(`SELECT totp_secret FROM users WHERE id = $1`, [req.user.sub]);
  if (!rows[0]?.totp_secret) return res.status(400).json({ error: "2FA etkin değil." });

  const isValid = await verifyTotpOnce(req.user.sub, token, rows[0].totp_secret);   // v22: tekrar kullanım koruması
  if (!isValid) {
    return sendCodeFailure(res, await recordFailure(identifier, "verification_code"), { valid: false });
  }

  await clearFailures(identifier, "verification_code");
  res.json({ valid: true });
});

// ---------- v43: KURTARMA KODLARINI YENİLE (oturum açıkken) ----------
// Kodlar kaybolduysa / azaldıysa: hesaba kayıtlı e-postaya gelen onay koduyla (v55: Authenticator kodu istenmez) yeni 8 kod üretilir;
// eski kodların TAMAMI geçersiz olur. Kullanıcıya site bildirimi + e-posta gider, işlem denetim kaydına yazılır.
// Kodlar yalnız bu yanıtta bir kez gösterilir; sunucuda yalnız bcrypt özetleri saklanır.
twoFactorRouter.post("/2fa/recovery/request", requireAuth, async (req, res) => {
  const { rows } = await pool.query(`SELECT email, totp_enabled FROM users WHERE id = $1`, [req.user.sub]);
  const u = rows[0];
  if (!u?.totp_enabled) return res.status(400).json({ error: "Kurtarma kodları yalnız Google Authenticator etkinken kullanılır." });
  if (!(await checkHourlyActionLimit(`recovery-regen-send:${req.user.sub}`, "recovery_regen_send", 5))) {
    return res.status(429).json({ error: "Çok fazla kod istendi. Lütfen bir süre sonra tekrar deneyin." });
  }
  const issued = await issueFactor(req.user.sub, "recovery_regen", null, {
    to: u.email, build: (c) => codeMail("recovery_regen", c, mailLang(req)),
  });
  if (issued.mailFailed) return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  res.json({ method: "email", message: "Onay kodu e-posta adresinize gönderildi." });
});

twoFactorRouter.post("/2fa/recovery/confirm", requireAuth, async (req, res) => {
  const identifier = `recovery-regen:${req.user.sub}`;
  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });
  const { rows: pre } = await pool.query(`SELECT totp_enabled FROM users WHERE id = $1`, [req.user.sub]);
  if (!pre[0]?.totp_enabled) return res.status(400).json({ error: "Kurtarma kodları yalnız Google Authenticator etkinken kullanılır." });

  const result = await verifyFactor(req.user.sub, "recovery_regen", req.body.code);
  if (!result.valid) return respondFactorFailure(res, identifier, result);
  await clearFailures(identifier, "verification_code");

  const backupCodes = genBackupCodes();
  const hashed = await Promise.all(backupCodes.map((c) => hashRecoveryCode(c)));
  const upd = await pool.query(`UPDATE users SET backup_codes = $2 WHERE id = $1 AND totp_enabled = true RETURNING email`, [req.user.sub, hashed]);
  if (!upd.rows.length) return res.status(409).json({ error: "Kurtarma kodları şu anda yenilenemedi." });
  await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
    [req.user.sub, "Kurtarma kodlarınız yenilendi. Eski kurtarma kodlarınız artık geçersiz."]);
  await logAudit(req.user.sub, "recovery_codes_regenerated", "user", req.user.sub, {}, req.ip);
  sendMail(upd.rows[0].email, noticeMail("recovery_regenerated", mailLang(req))).catch(() => {});
  res.json({ ok: true, backupCodes });   // yalnız bu an gösterilir
});

// ---------- v57: GOOGLE AUTHENTICATOR'I YENİLE (telefon değişti / kayboldu) ----------
// Telefonunu kaybeden kullanıcı girişte kurtarma koduyla (tek kullanımlık; kullanılınca site bildirimi + e-posta) oturum açar,
// ardından burada Authenticator'ını kendisi yeniler — destek ekibine bağımlı kalmaz:
//   1) /2fa/renew/request  → hesaba kayıtlı e-postaya onay kodu (5 dk)
//   2) /2fa/renew/confirm  → e-posta kodu doğrulanınca YENİ anahtar + QR üretilir (bekleyen kurulum, 15 dk) ve tek kullanımlık
//                             yenileme bileti verilir. ESKİ kurulum bu aşamada hâlâ geçerlidir.
//   3) /2fa/renew/activate → yeni uygulamadaki kod doğrulanınca eski anahtar YENİSİYLE değiştirilir, yeni 8 kurtarma kodu üretilir
//                             (eskilerin tamamı geçersiz), diğer oturumlar kapanır; bu oturum sürer. Site bildirimi + e-posta gider.
// Hatalı kodlar ortak 6 art arda hata kuralına yazılır. E-postasına da erişemeyen kullanıcı destek@alpvefit.com'a yönlendirilir.
// v58 — YÖNETİCİ HESAPLARI (Tam / Yarım yetki): yönetici faktörü YALNIZ e-postayla değiştirilemez (e-postası ele geçirilen biri
// yönetici hesabını alamasın). 2. adımda e-posta koduna EK olarak "adminFactor" istenir: mevcut Google Authenticator kodu (telefon
// değişiyorsa) VEYA kullanılmamış bir kurtarma kodu (telefon kaybolduysa; kod tüketilir ve bildirimi gider). Hatalı ek kod da ortak
// 6 hata kuralına yazılır. İkisi de yoksa sunucu erişimi olan kişi acil durum komutunu çalıştırır: npm run admin:reset-totp
// (src/db/reset-admin-totp.js — Authenticator sıfırlanır, bir sonraki girişte yeniden kurulum zorunludur).
const ADMIN_FACTOR_REQUIRED = { error: "admin_factor_required", message: "Yönetici hesabında yenileme için e-posta koduna ek olarak mevcut Google Authenticator kodunuzu veya kullanılmamış bir kurtarma kodunu girin." };
const ADMIN_FACTOR_WRONG = { error: "wrong_admin_factor", message: "Google Authenticator kodu veya kurtarma kodu doğrulanamadı. Uygulamadaki güncel kodu ya da kullanılmamış bir kurtarma kodunu girin." };
const SIX = /^\d{6}$/;
/** v58: yöneticinin ek faktörü. Dönüş: { ok, recoveryHash? } — kurtarma kodu burada TÜKETİLMEZ (e-posta kodu da doğrulanınca tüketilir). */
async function checkAdminFactor(userId, input) {
  const v = normalizeRecovery(input);   // boşluk/tire/büyük-küçük harf önemsiz
  const six = SIX.test(v);
  if (!six && !RECOVERY_NEW_RE.test(v)) return { ok: false };
  const { rows } = await pool.query(`SELECT totp_secret, backup_codes FROM users WHERE id = $1`, [userId]);
  const u = rows[0];
  if (!u) return { ok: false };
  const hash = await matchRecoveryCode(v, u.backup_codes);
  if (hash) return { ok: true, recoveryHash: hash };
  return { ok: six && !!u.totp_secret && (await verifyTotpOnce(userId, v, u.totp_secret)) };
}
const RENEW_EXPIRED = { error: "renew_expired", message: "Yenileme süresi doldu. Lütfen işlemi yeniden başlatın." };

twoFactorRouter.post("/2fa/renew/request", requireAuth, async (req, res) => {
  const { rows } = await pool.query(`SELECT email, totp_enabled, role FROM users WHERE id = $1`, [req.user.sub]);
  const u = rows[0];
  if (!u?.totp_enabled) return res.status(400).json({ error: "Google Authenticator hesabınızda etkin değil." });
  if (!(await checkHourlyActionLimit(`totp-renew-send:${req.user.sub}`, "totp_renew_send", 5))) {
    return res.status(429).json({ error: "Çok fazla kod istendi. Lütfen bir süre sonra tekrar deneyin." });
  }
  const issued = await issueFactor(req.user.sub, "totp_renew", null, { to: u.email, build: (c) => codeMail("totp_renew", c, mailLang(req)) });
  if (issued.mailFailed) return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  res.json({ method: "email", message: "Onay kodu e-posta adresinize gönderildi." });
});

twoFactorRouter.post("/2fa/renew/confirm", requireAuth, async (req, res) => {
  const identifier = `totp-renew:${req.user.sub}`;
  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  const { rows: pre } = await pool.query(`SELECT email, totp_enabled, role FROM users WHERE id = $1`, [req.user.sub]);
  if (!pre[0]?.totp_enabled) return res.status(400).json({ error: "Google Authenticator hesabınızda etkin değil." });
  // v58: yönetici — önce ek faktör (mevcut Authenticator kodu / kurtarma kodu), sonra e-posta kodu
  const isAdmin = isPanelRole(pre[0].role);
  let adminRecovery = null;
  if (isAdmin) {
    if (req.body?.adminFactor == null || req.body.adminFactor === "") return res.status(400).json(ADMIN_FACTOR_REQUIRED);
    const af = await checkAdminFactor(req.user.sub, req.body.adminFactor);
    if (!af.ok) {
      const outcome = await recordFailure(identifier, "verification_code");
      await logAudit(req.user.sub, "totp_renew_failed", "user", req.user.sub, { reason: "wrong_admin_factor" }, req.ip).catch(() => {});
      if (outcome && outcome.requiresRecovery) return sendLocked(res, outcome.lockRow);
      return res.status(400).json(ADMIN_FACTOR_WRONG);
    }
    adminRecovery = af.recoveryHash || null;
  }

  const result = await verifyFactor(req.user.sub, "totp_renew", req.body.code);
  if (!result.valid) return respondFactorFailure(res, identifier, result);
  await clearFailures(identifier, "verification_code");
  if (adminRecovery) {
    // kurtarma kodu tek kullanımlıktır: atomik olarak listeden çıkarılır; kullanım bildirilir (site + e-posta)
    const upd = await pool.query(
      `UPDATE users SET backup_codes = array_remove(backup_codes, $2) WHERE id = $1 AND $2 = ANY(backup_codes)
       RETURNING COALESCE(array_length(backup_codes, 1), 0) AS left`, [req.user.sub, adminRecovery]);
    if (upd.rows.length !== 1) return res.status(400).json(ADMIN_FACTOR_WRONG);
    const left = Number(upd.rows[0].left || 0);
    await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
      [req.user.sub, `Google Authenticator yenilemesi için bir kurtarma kodu kullanıldı. Kalan kurtarma kodu: ${left}.`]).catch(() => {});
    await logAudit(req.user.sub, "recovery_code_used", "user", req.user.sub, { context: "totp_renew", left }, req.ip).catch(() => {});
    sendMail(pre[0].email, noticeMail("recovery_used", mailLang(req), { ip: String(req.ip || "").slice(0, 64), left: String(left) })).catch(() => {});
  }

  const secret = generateSecret();
  await pool.query(`UPDATE users SET totp_pending_secret = $2, totp_pending_at = now() WHERE id = $1 AND totp_enabled = true`, [req.user.sub, encrypt(secret)]);
  await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose = 'totp_renew_ticket' AND consumed_at IS NULL`, [req.user.sub]);
  const renewTicket = await createTicket(req.user.sub, "totp_renew_ticket", 15);
  const qrDataUrl = await QRCode.toDataURL(keyuri(pre[0].email || "hesap", "Alpvefit", secret), { errorCorrectionLevel: "M", margin: 1, width: 240 });
  res.json({ pending: true, renew: true, qrDataUrl, secret, renewTicket });   // secret yalnız bu an (QR okutulamazsa elle girmek için)
});

twoFactorRouter.post("/2fa/renew/activate", requireAuth, async (req, res) => {
  const token = String(req.body?.token ?? ""), renewTicket = String(req.body?.renewTicket ?? "");
  const identifier = `totp-renew-activate:${req.user.sub}`;
  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);

  const tk = await peekCode(req.user.sub, "totp_renew_ticket", renewTicket);
  if (!tk.valid) return res.status(400).json(RENEW_EXPIRED);
  const { rows } = await pool.query(
    `SELECT totp_enabled, role, totp_pending_secret, totp_pending_at > now() - interval '15 minutes' AS fresh FROM users WHERE id = $1`, [req.user.sub]);
  const u = rows[0];
  if (!u?.totp_enabled) return res.status(400).json({ error: "Google Authenticator hesabınızda etkin değil." });
  if (!u.totp_pending_secret || !u.fresh) return res.status(400).json(RENEW_EXPIRED);

  // yeni anahtarla doğrulama; kullanılan zaman adımı etkinleştirmeyle birlikte kaydedilir (yeni anahtarın tekrar kullanım koruması)
  const step = matchNewTotpStep(token, u.totp_pending_secret);
  if (step === null) {
    return sendCodeFailure(res, await recordFailure(identifier, "verification_code"));
  }
  await clearFailures(identifier, "verification_code");
  if (!(await consumeCodeId(tk.id))) return res.status(400).json(RENEW_EXPIRED);

  const backupCodes = genBackupCodes();
  const hashed = await Promise.all(backupCodes.map((c) => hashRecoveryCode(c)));
  const upd = await pool.query(
    `UPDATE users SET totp_secret = totp_pending_secret, totp_pending_secret = NULL, totp_pending_at = NULL, backup_codes = $2,
            totp_last_step = $4, token_version = token_version + 1
      WHERE id = $1 AND totp_enabled = true AND totp_pending_secret = $3 RETURNING email, token_version`,
    [req.user.sub, hashed, u.totp_pending_secret, step]);   // arada yeni QR üretildiyse doğrulanmamış anahtar etkinleşmez
  if (!upd.rows.length) return res.status(409).json(RENEW_EXPIRED);
  // eski anahtarla şifre adımı geçilmiş, bekleyen giriş biletleri artık geçersiz
  await pool.query(`UPDATE verification_codes SET consumed_at = now() WHERE user_id = $1 AND purpose = 'login_totp_ticket' AND consumed_at IS NULL`, [req.user.sub]);
  // diğer oturumlar kapandı (token_version); bu oturum yeni sürümle sürer
  try { refreshAuthCookie(res, reissuedToken(req.user, upd.rows[0].token_version), parseCookies(req.headers.cookie || "")[CSRF_COOKIE_NAME]); } catch { /* oturum yenilenemezse kullanıcı yeniden giriş yapar */ }
  await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
    [req.user.sub, "Google Authenticator yeni uygulamaya taşındı. Önceki kurulum ve önceki kurtarma kodları artık geçersiz; diğer oturumlar kapatıldı."]);
  await logAudit(req.user.sub, "totp_renewed", "user", req.user.sub, { via: isPanelRole(u.role) ? "email_code+admin_factor" : "email_code" }, req.ip);
  sendMail(upd.rows[0].email, noticeMail("totp_renewed", mailLang(req))).catch(() => {});
  res.json({ ok: true, enabled: true, backupCodes });   // yeni kurtarma kodları yalnız bu an gösterilir
});
