-- v3 — ÖDEME: yalnız sanal POS (kart). Doğrudan kripto ödeme ve zincir izleme yapıları kaldırılır.
-- Kart verisi (PAN/CVC) bu sistemde ASLA saklanmaz; ödeme sağlayıcıdaki işlem referansı (payment_ref) tutulur.
DROP TABLE IF EXISTS unmatched_transactions;
DROP TABLE IF EXISTS chain_scan_state;
DROP INDEX IF EXISTS idx_orders_pending_expected_amount;

-- Sağlayıcıya özgü ara durumlar (ağ onayı/inceleme) artık yok: açık sipariş yalnız 'pending'dir.
UPDATE orders SET status = 'pending' WHERE status IN ('payment_review','flagged');
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending','paid','expired','cancelled'));

ALTER TABLE orders
  DROP COLUMN IF EXISTS crypto_discount_rate,
  DROP COLUMN IF EXISTS expected_amount,
  DROP COLUMN IF EXISTS payment_address,
  DROP COLUMN IF EXISTS tx_hash,
  DROP COLUMN IF EXISTS confirmations,
  DROP COLUMN IF EXISTS from_address;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider TEXT NOT NULL DEFAULT 'mock' CHECK (payment_provider IN ('mock'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_ref TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_attempts INT NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_ref ON orders(payment_ref) WHERE payment_ref IS NOT NULL;
ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'USD';
UPDATE orders SET currency = 'USD' WHERE currency <> 'USD';
