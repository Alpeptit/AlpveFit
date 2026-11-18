-- Plan güncelleme e-postası (birleştirilmiş, gecikmeli), kan tahlili görselleri, ağırlık takibi, destekte plan türü,
-- forum seviye bildirimi, arkadaşlık ve özel mesajlar.

-- Plan değişiklikleri tek e-postada toplanır: son değişiklikten belirli süre sonra bir kez gönderilir.
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_mail_due_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_mail_kinds text[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_users_plan_mail_due ON users(plan_mail_due_at) WHERE plan_mail_due_at IS NOT NULL;

-- Kan tahlili görselleri (en fazla 2; sağlık verisi — açık rıza gerekir) ve özel mesaj görselleri.
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_scope_check;
ALTER TABLE attachments ADD CONSTRAINT attachments_scope_check CHECK (scope IN ('ticket', 'profile', 'body', 'avatar', 'sig', 'blood', 'dm'));

-- Destek talebinde "Plan ve Programım" konusu için ilgili plan bölümü.
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS plan_kind text CHECK (plan_kind IS NULL OR plan_kind IN ('nutrition', 'training', 'supplement', 'pharmacology', 'notes'));

-- Ağırlık takibi: üye yalnız koçunun antrenman planındaki hareketler için kayıt girer.
CREATE TABLE IF NOT EXISTS weight_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise    text NOT NULL CHECK (char_length(exercise) BETWEEN 1 AND 60),
  muscle      text NOT NULL CHECK (char_length(muscle) <= 20),
  logged_on   date NOT NULL,
  weight_kg   numeric(5,1) NOT NULL CHECK (weight_kg >= 0 AND weight_kg <= 600),
  reps        smallint NOT NULL CHECK (reps BETWEEN 1 AND 100),
  sets        smallint NOT NULL DEFAULT 1 CHECK (sets BETWEEN 1 AND 20),
  rpe         smallint CHECK (rpe IS NULL OR rpe BETWEEN 1 AND 10),
  note        text NOT NULL DEFAULT '' CHECK (char_length(note) <= 200),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_weight_logs_member ON weight_logs(member_id, exercise, logged_on DESC);

-- Forum seviyesi: üyeye bildirilen son seviye (yükselince kutlama + bildirim + e-posta).
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS notified_level smallint NOT NULL DEFAULT 1;

-- Arkadaşlık: tek satır / çift (küçük id, büyük id). requester isteği gönderen; blocked_by engelleyen.
CREATE TABLE IF NOT EXISTS friendships (
  user_a       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requester    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status       text NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
  blocked_by   uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_a, user_b),
  CHECK (user_a < user_b)
);
CREATE INDEX IF NOT EXISTS idx_friendships_b ON friendships(user_b, status);

-- Özel mesajlar: yalnız arkadaşlar arasında. Silme kişiseldir (karşı tarafın kopyası kalır; şikâyet incelemesi için).
CREATE TABLE IF NOT EXISTS dm_messages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body          text NOT NULL DEFAULT '' CHECK (char_length(body) <= 2000),
  attachment_id uuid REFERENCES attachments(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  read_at       timestamptz,
  hidden_for_sender    boolean NOT NULL DEFAULT false,
  hidden_for_recipient boolean NOT NULL DEFAULT false,
  removed_by_mod       boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_dm_pair ON dm_messages(least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dm_unread ON dm_messages(recipient_id) WHERE read_at IS NULL;

CREATE TABLE IF NOT EXISTS dm_reports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id   uuid NOT NULL REFERENCES dm_messages(id) ON DELETE CASCADE,
  reporter_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason       text NOT NULL CHECK (reason IN ('spam', 'abuse', 'obscene', 'political', 'scam', 'other')),
  note         text NOT NULL DEFAULT '' CHECK (char_length(note) <= 300),
  status       text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'upheld', 'dismissed')),
  handled_by   uuid REFERENCES users(id) ON DELETE SET NULL,
  handled_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, reporter_id)
);
CREATE INDEX IF NOT EXISTS idx_dm_reports_open ON dm_reports(status, created_at DESC);
