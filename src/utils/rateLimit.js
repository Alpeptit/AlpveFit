import { pool } from "../db/pool.js";

import { logAudit } from "./auditLog.js";

// Genel merdiven (giriş şifresi DIŞINDAKİ eski çağrılar için): 1-3. hata → ban yok, 4. hata → 5 dk, 5. hata → 30 dk, 6. hata → kurtarma.
const BAN_LADDER_MS = [0, 0, 0, 5 * 60_000, 30 * 60_000];

// v58 — GİRİŞ ŞİFRESİ kuralı (kimliği doğrulanmamış deneme olduğu için HİÇBİR ZAMAN süresiz kilit konmaz):
//   • Hesap (yazılan kullanıcı adı / e-posta) başına: 1–3. art arda hata serbest, 4. hata → 5 dk, 5. hata → 30 dk, 6. ve sonraki her
//     hata → 1 saat bekleme. Hesap var / yok ayrımı yapılmaz (yanıtlar aynı).
//   • IP başına (çok hesaba yayılan denemeler): 1–9 serbest, 10–14 → 5 dk, 15–19 → 30 dk, 20+ → 1 saat. Paylaşılan IP'deki masum
//     kullanıcılar süresiz engellenmez.
//   • 24 saat boyunca hatalı deneme olmazsa sayaç sıfırlanır; doğru giriş sayacı hemen sıfırlar.
//   • Hesap sahibi beklemeden "Şifremi unuttum" ile şifresini yenileyince hesabın sayaçları silinir (clearLoginPasswordFailures).
//   • 30 dk ve üstü bekleme başlayınca hesap sahibine site bildirimi + e-posta gider (saatte en fazla bir kez).
// ÖNCEDEN (v28–v57): 6. hatada hem hesap kimliği hem IP SÜRESİZ kilitleniyordu; yalnız yönetici açabiliyordu, şifre sıfırlama
// kilidi kaldırmıyordu (kullanıcı adını bilen herkes başkasının hesabını süresiz kilitleyebiliyordu).
export const LOGIN_ACCOUNT_LADDER = [[4, 5 * 60_000], [5, 30 * 60_000], [6, 60 * 60_000]];
export const LOGIN_IP_LADDER = [[10, 5 * 60_000], [15, 30 * 60_000], [20, 60 * 60_000]];
export const LOGIN_FAIL_WINDOW_HOURS = 24;
export const LOGIN_NOTIFY_MS = 30 * 60_000;
/** n. art arda hatadaki bekleme süresi (ms); merdiven [eşik, süre] çiftleri, son basamak sonrası için de geçerlidir. */
export function loginBanMs(n, ladder = LOGIN_ACCOUNT_LADDER) {
  let ms = 0;
  for (const [from, dur] of ladder) if (n >= from) ms = dur;
  return ms;
}

// DOĞRULAMA KODU kuralı (v57) — e-posta kodu, Google Authenticator kodu ve kurtarma kodu: kayıt doğrulaması, girişteki
// Authenticator / kurtarma kodu adımı ve kullanıcı panelindeki tüm onaylı işlemler (ad, e-posta, şifre, hesap silme, Authenticator
// açma/kapama/yenileme, kurtarma kodu yenileme, veri silme).
//   • 6 kez ART ARDA hatalı kod girilirse hesap 30 DAKİKA kilitlenir (locked_until). Başarılı bir doğrulama sayacı sıfırlar.
//   • Sayaç işlem türüne göre değil KULLANICI başınadır (işlem değiştirerek yeni hak kazanılamaz). Kilitlenince oturumlar kapanır.
//   • Kilit süre dolunca kendiliğinden kalkar ve sayaç sıfırlanır. Kullanıcı beklemeden "Şifremi unuttum" ile (e-postasına gelen
//     bağlantı veya kodla) şifresini yenileyerek kilidi kendisi kaldırabilir. Hesap sahibine kilit bildirimi (site + e-posta) gider.
//   • v58: yönetim panelindeki geri alınamaz işlemlerin (ve manuel ödeme onayının) Authenticator kodu da bu sayaca yazılır
//     (utils/adminTotp.js).
//   • BU KURALIN DIŞINDA: giriş ŞİFRESİ denemeleri (ayrı, yalnız geçici bekleme — LOGIN_*_LADDER) ve şifre sıfırlama kodu (istek
//     başına sınır; kimliği doğrulanmamış bir istek hesabı KİLİTLEMEZ — utils/passwordReset.js).
// ÖNCEDEN (v28–v56): 6. hatada kalıcı kilit; yalnız yönetici açıyordu, şifremi unuttum kodu da kilitliyordu (başkasının hesabını
// kilitletme riski). locked_until NULL olan eski kalıcı kilitler değiştirilmez (yalnız yönetici açar).
const VERIFY_ACTION = "verification_code";
export const VERIFY_MAX_FAILS = 6;
export const LOCK_MINUTES = 30;
const UUID_TAIL = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
export const SUPPORT_EMAIL = "destek@alpvefit.com";
export const ACCOUNT_LOCKED_BODY = Object.freeze({ error: "account_locked", support: SUPPORT_EMAIL });
function verifyUserId(identifier, action) {
  if (action !== VERIFY_ACTION) return null;
  const m = UUID_TAIL.exec(String(identifier || ""));
  return m ? m[1].toLowerCase() : null;
}

/** v57: kilit ŞU AN etkin mi? (geçici kilidin süresi dolduysa etkin değildir) — users satırı { locked_at, locked_until }. */
export function isLockActive(row, now = Date.now()) {
  return !!(row && row.locked_at && (!row.locked_until || new Date(row.locked_until).getTime() > now));
}
/** v57: aynı kural SQL'de (ör. arka plan işleri): `${LOCK_ACTIVE_SQL("u.")}` — v62: saf modülde (utils/lockSql.js) */
import { LOCK_ACTIVE_SQL } from "./lockSql.js";
export { LOCK_ACTIVE_SQL };

/** Kilit yanıtının gövdesi: geçici kilitte bitiş zamanı ve süre de bildirilir (istemci "ne zaman açılır" yazar). */
export function lockBody(row) {
  const until = row && row.locked_until ? new Date(row.locked_until) : null;
  return until && !Number.isNaN(until.getTime())
    ? { ...ACCOUNT_LOCKED_BODY, temporary: true, lockMinutes: LOCK_MINUTES, lockedUntil: until.toISOString() }
    : { ...ACCOUNT_LOCKED_BODY };
}
/** Kilitli hesap yanıtı (istemci kilit penceresini gösterir: süre, şifre sıfırlama ile açma, destek@alpvefit.com). */
export function sendLocked(res, row) {
  return res.status(403).json(lockBody(row));
}
/** Hatalı kod yanıtı — kalan hak sayısı İÇERMEZ (kural metinde yazılıdır); 6. art arda hatada hesap kilitlidir. */
export function sendCodeFailure(res, outcome, extra = {}) {
  if (outcome && outcome.requiresRecovery) return sendLocked(res, outcome.lockRow);
  return res.status(400).json({ ...extra, error: "wrong_code" });
}

/**
 * Hesabı 30 dakika kilitler: açık oturumlar sonlanır, giriş ve doğrulama uçları süre boyunca reddeder. Hesap sahibine site
 * bildirimi ve güvenlik e-postası gider (kimin denediği bilinmediği için). Dönüş: { locked_at, locked_until } veya null.
 */
export async function lockAccount(userId, reason = "verification_failures") {
  const { rows } = await pool.query(
    `UPDATE users SET locked_at = now(), locked_until = $3, locked_reason = $2, token_version = token_version + 1
      WHERE id = $1 AND NOT ${LOCK_ACTIVE_SQL()} RETURNING locked_at, locked_until, email, preferred_lang`,
    [userId, reason, new Date(Date.now() + LOCK_MINUTES * 60_000)]   // bitiş uygulama saatiyle (diğer süreler gibi); kontrol isLockActive
  );
  if (!rows.length) {
    const { rows: cur } = await pool.query(`SELECT locked_at, locked_until FROM users WHERE id = $1`, [userId]);
    return cur[0] || null;
  }
  const r = rows[0];
  await logAudit(null, "account_locked", "user", userId, { reason, minutes: LOCK_MINUTES }, null).catch(() => {});
  await pool.query(`INSERT INTO notifications (user_id, type, text) VALUES ($1, 'security', $2)`,
    [userId, `Art arda 6 hatalı doğrulama kodu girildiği için hesabınız güvenliğiniz için ${LOCK_MINUTES} dakika kilitlendi. Bu denemeleri siz yapmadıysanız "Şifremi unuttum" ile şifrenizi yenileyin.`]).catch(() => {});
  try {
    const [{ sendMail }, { noticeMail }] = await Promise.all([import("./mailer.js"), import("./emailTemplates.js")]);
    sendMail(r.email, noticeMail("account_locked", r.preferred_lang, { minutes: LOCK_MINUTES, until: r.locked_until })).catch(() => {});
  } catch { /* bildirim e-postası kilidi engellemez */ }
  return { locked_at: r.locked_at, locked_until: r.locked_until };
}

/** v57: süresi dolmuş GEÇİCİ kilidi kaldırır ve doğrulama sayacını sıfırlar (kalıcı eski kilitlere dokunmaz). */
export async function expireLock(userId) {
  const { rows } = await pool.query(
    `UPDATE users SET locked_at = NULL, locked_until = NULL, locked_reason = NULL
      WHERE id = $1 AND locked_until IS NOT NULL AND locked_until <= $2 RETURNING id`, [userId, new Date()]);
  if (rows.length) await pool.query(`DELETE FROM rate_limit_state WHERE identifier = $1 AND action = $2`, [`verify:${userId}`, VERIFY_ACTION]);
  return rows.length > 0;
}

/** v57: kullanıcının kendi kurtarması (şifre sıfırlama tamamlandı) — GEÇİCİ kilit ve doğrulama sayacı sıfırlanır. */
export async function clearTemporaryLock(userId) {
  await pool.query(`UPDATE users SET locked_at = NULL, locked_until = NULL, locked_reason = NULL WHERE id = $1 AND locked_until IS NOT NULL`, [userId]);
  await pool.query(`DELETE FROM rate_limit_state WHERE identifier = $1 AND action = $2`, [`verify:${userId}`, VERIFY_ACTION]);
}

/** Yönetici kilit açma: kilit + tüm hatalı-deneme sayaçları sıfırlanır. */
export async function unlockAccount(userId) {
  const { rows } = await pool.query(
    `UPDATE users SET locked_at = NULL, locked_until = NULL, locked_reason = NULL WHERE id = $1 RETURNING email, username`, [userId]);
  if (!rows.length) return false;
  await pool.query(
    `DELETE FROM rate_limit_state WHERE identifier = $1 OR identifier LIKE $2 OR identifier IN ($3, $4)`,
    [`verify:${userId}`, `%:${userId}`, `account:${String(rows[0].email).toLowerCase()}`, `account:${String(rows[0].username).toLowerCase()}`]
  );
  return true;
}

/**
 * Bir eylemin (giriş şifresi denemesi veya doğrulama kodu denemesi) şu an
 * yasaklı olup olmadığını kontrol eder. `identifier` genelde IP veya user_id'dir.
 */
export async function checkBan(identifier, action) {
  const uid = verifyUserId(identifier, action);
  if (uid) {
    const { rows: u } = await pool.query(`SELECT locked_at, locked_until FROM users WHERE id = $1`, [uid]);
    if (isLockActive(u[0])) return { banned: true, requiresRecovery: true, locked: true, lockRow: u[0] };
    if (u[0]?.locked_at && u[0].locked_until) await expireLock(uid);   // süresi dolan geçici kilit: kalkar, 6 yeni hak
    identifier = `verify:${uid}`;
    // doğrulama kodlarında bekleme merdiveni yoktur: kilit dışında engel uygulanmaz
    return { banned: false, requiresRecovery: false };
  }
  const { rows } = await pool.query(
    `SELECT * FROM rate_limit_state WHERE identifier = $1 AND action = $2`,
    [identifier, action]
  );
  const state = rows[0];
  if (!state) return { banned: false, requiresRecovery: false };

  if (action === "login_password") {
    // v58: giriş şifresinde süresiz kilit yoktur. Eski (v57 ve öncesi) "kurtarma gerekli" satırları son denemeden 1 saat sonra
    // biten geçici bekleme sayılır.
    const until = state.requires_recovery
      ? new Date(new Date(state.updated_at).getTime() + 60 * 60_000)
      : state.banned_until ? new Date(state.banned_until) : null;
    return until && until > new Date() ? { banned: true, requiresRecovery: false, bannedUntil: until } : { banned: false, requiresRecovery: false };
  }
  if (state.requires_recovery) return { banned: true, requiresRecovery: true };
  if (state.banned_until && new Date(state.banned_until) > new Date()) {
    return { banned: true, requiresRecovery: false, bannedUntil: state.banned_until };
  }
  return { banned: false, requiresRecovery: false };
}

/** Başarısız bir denemeyi kaydeder ve gerekiyorsa ban/kurtarma uygular. Her yerde AYNI merdiven kullanılır. */
export async function recordFailure(identifier, action, ladder = BAN_LADDER_MS) {
  const uid = verifyUserId(identifier, action);
  if (uid) return recordVerifyFailure(uid);
  const { rows } = await pool.query(
    `INSERT INTO rate_limit_state (identifier, action, fail_count, updated_at)
     VALUES ($1, $2, 1, now())
     ON CONFLICT (identifier, action)
     DO UPDATE SET fail_count = rate_limit_state.fail_count + 1, updated_at = now()
     RETURNING fail_count`,
    [identifier, action]
  );
  const failCount = rows[0].fail_count;

  if (failCount >= ladder.length + 1) {
    await pool.query(
      `UPDATE rate_limit_state SET requires_recovery = true WHERE identifier = $1 AND action = $2`,
      [identifier, action]
    );
    if (uid) await lockAccount(uid);
    return { requiresRecovery: true, failCount, locked: Boolean(uid) };
  }

  const banMs = ladder[failCount - 1];
  const bannedUntil = new Date(Date.now() + banMs);
  await pool.query(
    `UPDATE rate_limit_state SET banned_until = $3 WHERE identifier = $1 AND action = $2`,
    [identifier, action, bannedUntil]
  );
  return { bannedUntil: banMs > 0 ? bannedUntil : undefined, failCount };
}

/** v57: art arda hatalı doğrulama kodu (kullanıcı başına). 6. hatada hesap 30 dk kilitlenir ve sayaç sıfırlanır. */
async function recordVerifyFailure(uid) {
  const identifier = `verify:${uid}`;
  const { rows } = await pool.query(
    `INSERT INTO rate_limit_state (identifier, action, fail_count, updated_at) VALUES ($1, $2, 1, now())
     ON CONFLICT (identifier, action) DO UPDATE SET fail_count = rate_limit_state.fail_count + 1, updated_at = now()
     RETURNING fail_count`,
    [identifier, VERIFY_ACTION]
  );
  const failCount = rows[0].fail_count;
  if (failCount < VERIFY_MAX_FAILS) return { failCount };
  const lockRow = await lockAccount(uid);
  await pool.query(`DELETE FROM rate_limit_state WHERE identifier = $1 AND action = $2`, [identifier, VERIFY_ACTION]);
  return { requiresRecovery: true, locked: true, failCount, lockRow };
}

/**
 * v58: hatalı giriş şifresi. identifier "account:<kimlik>" ise hesap merdiveni, değilse (IP) IP merdiveni uygulanır.
 * 24 saattir hata yoksa sayaç 1'den başlar. Dönüş: { failCount, bannedUntil?, banMs } — süresiz kilit (requiresRecovery) DÖNMEZ.
 */
export async function recordLoginPasswordFailure(identifier) {
  const ladder = String(identifier).startsWith("account:") ? LOGIN_ACCOUNT_LADDER : LOGIN_IP_LADDER;
  const { rows } = await pool.query(
    `INSERT INTO rate_limit_state (identifier, action, fail_count, updated_at) VALUES ($1, 'login_password', 1, now())
     ON CONFLICT (identifier, action) DO UPDATE SET
       fail_count = CASE WHEN rate_limit_state.updated_at < now() - make_interval(hours => $2::int) THEN 1 ELSE rate_limit_state.fail_count + 1 END,
       requires_recovery = false, updated_at = now()
     RETURNING fail_count`,
    [identifier, LOGIN_FAIL_WINDOW_HOURS]
  );
  const failCount = rows[0].fail_count;
  const banMs = loginBanMs(failCount, ladder);
  const bannedUntil = banMs > 0 ? new Date(Date.now() + banMs) : null;
  await pool.query(`UPDATE rate_limit_state SET banned_until = $2 WHERE identifier = $1 AND action = 'login_password'`, [identifier, bannedUntil]);
  return { failCount, banMs, bannedUntil: bannedUntil || undefined };
}

/** v58: hesap sahibinin kendi kurtarması (şifre sıfırlama) — bu hesabın giriş şifresi sayaçları silinir (IP sayaçları kalır). */
export async function clearLoginPasswordFailures(email, username) {
  const ids = [email, username].filter(Boolean).map((x) => `account:${String(x).trim().toLowerCase()}`);
  if (ids.length) await pool.query(`DELETE FROM rate_limit_state WHERE action = 'login_password' AND identifier = ANY($1::text[])`, [ids]);
}

export async function clearFailures(identifier, action) {
  const uid = verifyUserId(identifier, action);
  if (uid) identifier = `verify:${uid}`;
  await pool.query(`DELETE FROM rate_limit_state WHERE identifier = $1 AND action = $2`, [identifier, action]);
}

/**
 * Kod yeniden gönderme hakkını sınırlar (varsayılan: en fazla 3 kez).
 * `rate_limit_state` tablosunu, ban yerine sadece bir SAYAÇ olarak kullanır.
 * İstemci tarafındaki limit tek başına yeterli değildir — biri isteği doğrudan
 * API'ye gönderirse o limiti atlatabilir, bu yüzden burada da zorunlu kılınır.
 */
export async function checkAndIncrementResendCount(identifier, action, maxResends = 3) {
  const { rows } = await pool.query(
    `INSERT INTO rate_limit_state (identifier, action, fail_count, updated_at)
     VALUES ($1, $2, 1, now())
     ON CONFLICT (identifier, action)
     DO UPDATE SET fail_count = rate_limit_state.fail_count + 1, updated_at = now()
     RETURNING fail_count`,
    [identifier, action]
  );
  return rows[0].fail_count <= maxResends;
}

// K8 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN sipariş oluşturmada HİÇ
// rate limit yoktu — onaylı bir üye saniyede yüzlerce sipariş oluşturup
// her birinde stok rezerve edebilirdi. orderExpiryJob bunları 24 saat
// sonra temizler, ama o süre boyunca stok gereksiz yere kilitli kalırdı
// (envanter tabanlı bir DoS). Bu fonksiyon, checkAndIncrementResendCount'tan
// FARKLI olarak bir ZAMAN PENCERESİ uygular: pencere (1 saat) dolmuşsa
// sayaç sıfırlanır, dolmamışsa artırılır — hepsi TEK bir atomik UPSERT'te,
// eşzamanlı isteklerde yarış durumu riski olmadan.
export async function checkHourlyActionLimit(identifier, action, maxPerHour) {
  const { rows } = await pool.query(
    `INSERT INTO rate_limit_state (identifier, action, fail_count, updated_at)
     VALUES ($1, $2, 1, now())
     ON CONFLICT (identifier, action) DO UPDATE SET
       fail_count = CASE WHEN rate_limit_state.updated_at < now() - interval '1 hour' THEN 1 ELSE rate_limit_state.fail_count + 1 END,
       updated_at = CASE WHEN rate_limit_state.updated_at < now() - interval '1 hour' THEN now() ELSE rate_limit_state.updated_at END
     RETURNING fail_count`,
    [identifier, action]
  );
  return rows[0].fail_count <= maxPerHour;
}
