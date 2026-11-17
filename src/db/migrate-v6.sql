-- v6 — CANLI DESTEK, ÇEVRİMDIŞI MESAJ ve DESTEK TALEBİ (ticket). Uzaktan eğitim dışındaki koçluk biçimleri kaldırıldı.
-- Ham IP ve misafir anahtarı saklanmaz: yalnız SHA-256 özetleri. Kayıtlar 180 günlük saklama işine dahildir.

-- Koçluk yalnız uzaktan (online) verilir.
UPDATE coach_clients SET delivery = 'online' WHERE delivery <> 'online';
ALTER TABLE coach_clients DROP CONSTRAINT IF EXISTS coach_clients_delivery_check;
ALTER TABLE coach_clients ADD CONSTRAINT coach_clients_delivery_check CHECK (delivery = 'online');

CREATE TABLE IF NOT EXISTS live_chats (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  is_member        BOOLEAN NOT NULL,
  guest_name       TEXT CHECK (guest_name IS NULL OR char_length(guest_name) BETWEEN 2 AND 60),
  guest_email      TEXT CHECK (guest_email IS NULL OR char_length(guest_email) <= 254),
  guest_token_hash TEXT CHECK (guest_token_hash IS NULL OR char_length(guest_token_hash) = 64),
  status           TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  closed_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  last_message_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((is_member AND guest_token_hash IS NULL) OR (NOT is_member AND guest_name IS NOT NULL AND guest_email IS NOT NULL AND guest_token_hash IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_live_chats_status ON live_chats(status, last_message_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_live_chats_one_open_per_member ON live_chats(user_id) WHERE status = 'open' AND user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS live_chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id     UUID NOT NULL REFERENCES live_chats(id) ON DELETE CASCADE,
  sender      TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
  admin_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_name  TEXT CHECK (agent_name IS NULL OR char_length(agent_name) BETWEEN 1 AND 40),
  body        TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1444),
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_live_chat_messages_chat ON live_chat_messages(chat_id, created_at);

CREATE TABLE IF NOT EXISTS support_status (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  mode        TEXT NOT NULL DEFAULT 'auto' CHECK (mode IN ('auto', 'online', 'offline')),
  open_hour   SMALLINT NOT NULL DEFAULT 9  CHECK (open_hour BETWEEN 0 AND 23),
  close_hour  SMALLINT NOT NULL DEFAULT 22 CHECK (close_hour BETWEEN 1 AND 24),
  updated_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (close_hour > open_hour)
);
INSERT INTO support_status (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS support_offline_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 60),
  email       TEXT NOT NULL CHECK (char_length(email) <= 254),
  body        TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1444),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'answered', 'archived')),
  ip_hash     TEXT CHECK (ip_hash IS NULL OR char_length(ip_hash) = 64),
  handled_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  handled_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_support_offline_status ON support_offline_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_offline_email ON support_offline_messages(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_offline_ip ON support_offline_messages(ip_hash, created_at DESC);

-- Destek talebi (ticket): yalnız üye açar; yalnız yönetici yanıtlar.
CREATE TABLE IF NOT EXISTS tickets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number  TEXT UNIQUE NOT NULL CHECK (ticket_number ~ '^T-[0-9]{6}$'),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 144),
  subject        TEXT NOT NULL CHECK (char_length(subject) <= 60),
  status         TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  closed_at      TIMESTAMPTZ,
  closed_by      TEXT CHECK (closed_by IS NULL OR closed_by IN ('user', 'admin')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status, updated_at DESC);
CREATE TABLE IF NOT EXISTS ticket_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  from_role   TEXT NOT NULL CHECK (from_role IN ('user', 'support')),
  admin_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  body        TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1444),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id, created_at);
