// utils/lockSql.js — SAF (veritabanına bağlanmaz): hesap kilidinin "şu an etkin" kuralı SQL'de. rateLimit.js buradan yeniden dışa aktarır.
/** v57: aynı kural SQL'de (ör. arka plan işleri): `${LOCK_ACTIVE_SQL("u.")}` */
export const LOCK_ACTIVE_SQL = (a = "") => `(${a}locked_at IS NOT NULL AND (${a}locked_until IS NULL OR ${a}locked_until > now()))`;
