-- v27: (1) Plan teslim hatırlatması: ödenmiş ama teslim edilmemiş siparişin plan teslim zamanı yaklaşınca ve geçince
--      yöneticilere ve üyeye atanmış uzmana BİR KEZ bildirim + e-posta gider (sütunlar tekrar gönderimi önler).
--      (2) Gelişim paylaşımı: üye izin verirse kilo ve bel ölçüleri kendisine atanmış uzmana (ve yöneticiye) grafik olarak görünür.
--      Varsayılan KAPALI; üye istediği an kapatır, erişim anında kesilir.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS due_soon_notified_at timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS overdue_notified_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_orders_due_open ON orders (plans_due_at) WHERE status = 'paid' AND delivery_status <> 'delivered';
ALTER TABLE users ADD COLUMN IF NOT EXISTS journal_share_coach boolean NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS journal_shared_at timestamptz;
-- (3) Paket → satın alma hunisi: ölçüme izin veren oturumda "paket seçti" (sipariş penceresi açıldı) ve "sipariş oluşturdu" adımları.
--     Oturum başına her adım BİR kez; IP yok, oturum kimliği özetlenir; üye silinince anonimleşir; 90 gün sonra silinir.
CREATE TABLE IF NOT EXISTS site_events (
  id          bigserial PRIMARY KEY,
  sid         text NOT NULL CHECK (char_length(sid) = 32),
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  event       text NOT NULL CHECK (event IN ('pkg_select', 'order')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sid, event)
);
CREATE INDEX IF NOT EXISTS idx_site_events_created ON site_events (created_at);
