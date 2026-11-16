-- v2 — PAKET SİPARİŞLERİ (USDT TRC20), ÜYE PROFİLİ, ZİNCİR İZLEME DURUMU
-- Siparişler üye silinse de mali kayıt olarak kalır (user_id SET NULL + ad/e-posta anlık kopyası); diğer kişisel veriler silinir.
CREATE TABLE orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         TEXT UNIQUE NOT NULL,
  user_id              UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_name           TEXT NOT NULL,
  buyer_email          TEXT NOT NULL,
  package_key          TEXT NOT NULL CHECK (package_key IN ('starter','advanced','competitor')),
  weeks                INT  NOT NULL CHECK (weeks BETWEEN 1 AND 52),
  pharmacology         BOOLEAN NOT NULL,
  list_price           NUMERIC(10,2) NOT NULL CHECK (list_price > 0),
  crypto_discount_rate NUMERIC(5,4) NOT NULL DEFAULT 0 CHECK (crypto_discount_rate >= 0 AND crypto_discount_rate <= 0.5),
  subtotal             NUMERIC(10,2) NOT NULL CHECK (subtotal > 0),
  expected_amount      NUMERIC(14,6) NOT NULL,
  currency             TEXT NOT NULL DEFAULT 'USDT-TRC20',
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','payment_review','flagged','paid','expired','cancelled')),
  payment_address      TEXT,
  payment_expires_at   TIMESTAMPTZ,
  tx_hash              TEXT UNIQUE,
  confirmations        INT,
  from_address         TEXT,
  paid_at              TIMESTAMPTZ,
  plans_due_at         TIMESTAMPTZ,
  approved_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  approval_note        TEXT,
  consent_at           TIMESTAMPTZ NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT orders_paid_has_dates CHECK (status <> 'paid' OR (paid_at IS NOT NULL AND plans_due_at IS NOT NULL))
);
CREATE UNIQUE INDEX idx_orders_pending_expected_amount ON orders(expected_amount) WHERE status = 'pending';
CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

ALTER TABLE notifications ADD COLUMN order_id UUID REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD COLUMN data JSONB;   -- bildirim metni ön yüzde seçilen dilde (TR/EN) bu alandan üretilir

CREATE TABLE unmatched_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash           TEXT UNIQUE NOT NULL,
  amount            NUMERIC(18,6) NOT NULL,
  from_address      TEXT,
  possible_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  reason            TEXT NOT NULL,
  resolved          BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE chain_scan_state (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Üye profili: koçlar için faydalı bilgiler. Kayıtta SORULMAZ; üye panelden kendisi ekler. Sağlık bilgisi için açık rıza gerekir.
CREATE TABLE member_profiles (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  height_cm         INT  CHECK (height_cm BETWEEN 100 AND 250),
  weight_kg         NUMERIC(5,1) CHECK (weight_kg BETWEEN 30 AND 300),
  birth_year        INT  CHECK (birth_year BETWEEN 1930 AND 2020),
  occupation        TEXT CHECK (char_length(occupation) <= 80),
  daily_steps       INT  CHECK (daily_steps BETWEEN 0 AND 100000),
  blood_type        TEXT CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','0+','0-')),
  training_days     INT  CHECK (training_days BETWEEN 0 AND 7),
  goal              TEXT CHECK (char_length(goal) <= 500),
  health_notes      TEXT CHECK (char_length(health_notes) <= 1000),
  health_consent_at TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
