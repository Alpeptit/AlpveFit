import express from "express";
import { withAsyncErrors } from "../utils/asyncRoutes.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { verifyPassword } from "../utils/password.js";
import { issueFactor, verifyFactor, respondFactorFailure } from "../utils/secondFactor.js";
import { checkBan, clearFailures, checkHourlyActionLimit, sendLocked } from "../utils/rateLimit.js";
import { isNonEmptyString } from "../utils/validate.js";
import { clearAuthCookies } from "../utils/cookies.js";
import { sendMail } from "../utils/mailer.js";
import { codeMail, noticeMail, mailLang } from "../utils/emailTemplates.js";

export const privacyRouter = withAsyncErrors(express.Router());

// Hesabı sil — adım 1: şifre doğrula, e-posta koduyla onay iste (Alpeptit ile aynı akış).
privacyRouter.post("/me/request-delete", requireAuth, async (req, res) => {
  const { password } = req.body;
  if (!isNonEmptyString(password, 200)) return res.status(400).json({ error: "Lütfen şifrenizi giriniz." });

  const { rows } = await pool.query(`SELECT email, password_hash FROM users WHERE id = $1`, [req.user.sub]);
  const user = rows[0];
  if (!(await verifyPassword(password, user.password_hash))) {
    return res.status(400).json({ error: "Şifre yanlış." }); // 401 değil — oturum geçerli; istemci oturumu kapatmasın
  }
  if (!(await checkHourlyActionLimit(`delete_account-send:${req.user.sub}`, "account_code_send", 4))) {
    return res.status(429).json({ error: "En fazla 3 kez kod isteyebilirsiniz. Lütfen mevcut kodunuzu kontrol edin." });
  }
  const issued = await issueFactor(req.user.sub, "delete_account", null, { to: user.email, build: (c) => codeMail("delete_account", c, mailLang(req)) });
  if (issued.mailFailed) return res.status(503).json({ error: "E-posta gönderilemedi, lütfen birazdan tekrar deneyin.", mailFailed: true });
  res.json({ method: "email", message: "Onay kodu e-posta adresinize gönderildi." });
});

// Hesabı sil — adım 2: kodu doğrula, KALICI olarak sil.
// Üyenin kendisine bağlı planlar silinir (ON DELETE CASCADE). Uzmanın hazırladığı planlarda hazırlayan adı plan kaydında kalır
// (author_name) ve author_id boşalır; böylece üyenin planında "kim hazırladı" bilgisi korunur.
privacyRouter.post("/me/confirm-delete", requireAuth, async (req, res) => {
  const { code } = req.body;
  const identifier = `delete-account:${req.user.sub}`;

  const ban = await checkBan(identifier, "verification_code");
  if (ban.requiresRecovery) return sendLocked(res, ban.lockRow);
  if (ban.banned) return res.status(429).json({ error: "banned", bannedUntil: ban.bannedUntil });

  const result = await verifyFactor(req.user.sub, "delete_account", code);
  if (!result.valid) return respondFactorFailure(res, identifier, result);
  await clearFailures(identifier, "verification_code");

  const { rows: who } = await pool.query(`SELECT email, role FROM users WHERE id = $1`, [req.user.sub]);
  const email = who[0]?.email || null;
  if (who[0]?.role === "admin") {
    const { rows: cnt } = await pool.query(`SELECT count(*)::int AS n FROM users WHERE role = 'admin'`);
    if (cnt[0].n <= 1) return res.status(409).json({ error: "Son yönetici hesabı silinemez.", code: "last_admin" });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const del = await client.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [req.user.sub]);
    if (del.rows.length !== 1) throw new Error("kullanıcı satırı silinemedi");
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[privacy] Hesap silinemedi:", err.message);
    return res.status(500).json({ error: "Hesabınız şu anda silinemedi; hiçbir veri değiştirilmedi. Lütfen birazdan tekrar deneyin.", code: "delete_failed" });
  } finally {
    client.release();
  }
  if (email) sendMail(email, noticeMail("account_deleted", mailLang(req))).catch(() => {});
  clearAuthCookies(res);
  res.json({ ok: true, message: "Hesabınız kalıcı olarak silindi. Bu e-posta adresiyle dilediğiniz zaman yeniden kayıt olabilirsiniz." });
});
