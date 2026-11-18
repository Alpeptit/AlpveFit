-- Forum ayarları: imza, sosyal bağlantılar, bildirim tercihleri, avatar ve imza görseli; kullanıcı adı değişiklik zamanı.
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS signature text NOT NULL DEFAULT '' CHECK (char_length(signature) <= 200);
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS socials jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS notify jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS rules_accepted_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username_changed_at timestamptz;

ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_scope_check;
ALTER TABLE attachments ADD CONSTRAINT attachments_scope_check CHECK (scope IN ('ticket', 'profile', 'body', 'avatar', 'sig'));
CREATE UNIQUE INDEX IF NOT EXISTS uq_attachments_avatar ON attachments(user_id) WHERE scope = 'avatar';
CREATE UNIQUE INDEX IF NOT EXISTS uq_attachments_sig ON attachments(user_id) WHERE scope = 'sig';
