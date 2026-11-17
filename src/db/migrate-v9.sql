-- v9 — Kişisel bilgilerde çalışma saati; destek talebi ve kişisel bilgiler için dosya ekleri (en fazla 4).
-- Dosyalar kendi veritabanımızda saklanır (dış servis yok); yalnız sahibi ve yetkili panel kullanıcısı görebilir.

ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS work_hours TEXT;
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_work_hours_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_work_hours_check CHECK (
  work_hours IS NULL OR work_hours IN ('shift', 'flexible', 'none')
  OR work_hours ~ '^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$');

CREATE TABLE IF NOT EXISTS attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope       TEXT NOT NULL CHECK (scope IN ('ticket', 'profile')),
  message_id  UUID REFERENCES ticket_messages(id) ON DELETE CASCADE,   -- ticket eki: mesaja bağlanana kadar NULL (bekleyen)
  filename    TEXT NOT NULL CHECK (char_length(filename) BETWEEN 1 AND 120),
  mime        TEXT NOT NULL,
  size_bytes  INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 4194304),
  data        BYTEA NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (scope = 'ticket' OR message_id IS NULL)
);
CREATE INDEX IF NOT EXISTS idx_attachments_user ON attachments(user_id, scope, created_at);
CREATE INDEX IF NOT EXISTS idx_attachments_message ON attachments(message_id);
