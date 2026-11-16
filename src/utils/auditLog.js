import { pool } from "../db/pool.js";
import { redactAuditDetails } from "./auditRedact.js";
export { redactAuditDetails };

/** Paylaşılan denetim kaydı yardımcı fonksiyonu — daha önce admin.js içinde
 * yerel olarak tanımlıydı; artık paylaşılan servislerin de (örn. ödeme
 * onaylama) aynı, tutarlı denetim kaydını kullanabilmesi için buraya taşındı.
 *
 * K12 (3. bağımsız denetim) düzeltmesi: ÖNCEDEN bu fonksiyon hata
 * fırlatabiliyordu. Birçok admin endpoint'i logAudit'i işlem ZATEN COMMIT
 * edildikten SONRA çağırıyor — logAudit hata verirse, admin gerçekte
 * BAŞARILI olmuş bir işlem için "işlem başarısız" yanıtı görüyordu. Denetim
 * kaydı best-effort bir gözlemlenebilirlik aracıdır; artık kendi hatasını
 * yutuyor ve loglayıp çağırana ASLA fırlatmıyor. */
export async function logAudit(actorId, action, targetType, targetId, details = {}, ip = null) {
  try {
    await pool.query(
      `INSERT INTO audit_log (actor_id, action, target_type, target_id, details, ip_address)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [actorId, action, targetType, targetId, JSON.stringify(redactAuditDetails(details || {})), ip]
    );
  } catch (err) {
    console.error(`[auditLog] Denetim kaydı yazılamadı (action=${action}, target=${targetType}:${targetId}):`, err.message);
  }
}

/**
 * M-16 (4. bağımsız denetim, v4) düzeltmesi: KRİTİK olaylar (ödeme onayı,
 * admin silme) için DAYANIKLI denetim kaydı. logAudit'in aksine hatayı
 * YUTMAZ ve çağıranın transaction client'ını kullanır — böylece denetim kaydı
 * iş işlemiyle AYNI transaction'da yazılır: kayıt yazılamazsa işlem de geri
 * alınır. "Ödeme onaylandı ama kimin onayladığının kaydı yok" durumu artık
 * yapısal olarak imkansız (ikisi birlikte COMMIT olur ya da hiçbiri).
 */
export async function logAuditTx(client, actorId, action, targetType, targetId, details = {}, ip = null) {
  await client.query(
    `INSERT INTO audit_log (actor_id, action, target_type, target_id, details, ip_address)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [actorId, action, targetType, targetId, JSON.stringify(redactAuditDetails(details || {})), ip]
  );
}
