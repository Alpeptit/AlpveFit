-- v12 — Yönetim paneli: üye engelleme / süreli yasak / kalıcı yasak, forum profili (seviye, rol, sayaçlar), sipariş teslim durumu.

-- Kalıcı yasak: silinen hesabın e-postası (yalnız SHA-256 özeti) yeniden kayıt olamaz. E-postanın kendisi saklanmaz.
CREATE TABLE IF NOT EXISTS banned_emails (
  email_hash  text PRIMARY KEY,
  reason      text,
  banned_by   uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Forum profili: seviye puanı için sayaçlar (forum açıldığında dolar), yönetici tarafından elle seviye ve moderatör ataması.
CREATE TABLE IF NOT EXISTS forum_profiles (
  user_id          uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  level_override   smallint CHECK (level_override IS NULL OR level_override BETWEEN 1 AND 8),
  forum_role       text NOT NULL DEFAULT 'member' CHECK (forum_role IN ('member', 'moderator')),
  topics           integer NOT NULL DEFAULT 0 CHECK (topics >= 0),
  posts            integer NOT NULL DEFAULT 0 CHECK (posts >= 0),
  likes            integer NOT NULL DEFAULT 0 CHECK (likes >= 0),
  dislikes         integer NOT NULL DEFAULT 0 CHECK (dislikes >= 0),
  reports_received integer NOT NULL DEFAULT 0 CHECK (reports_received >= 0),
  reports_upheld   integer NOT NULL DEFAULT 0 CHECK (reports_upheld >= 0),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Sipariş teslim durumu (planların hazırlanıp teslim edilmesi).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status text NOT NULL DEFAULT 'waiting';
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_delivery_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_delivery_status_check CHECK (delivery_status IN ('waiting', 'preparing', 'delivered'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_users_created ON users (created_at DESC);
