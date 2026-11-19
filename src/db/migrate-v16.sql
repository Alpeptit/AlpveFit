-- Forum: kategoriler, konular, mesajlar, tepkiler, okuma izi, takip, kaydedilenler, anket, şikâyet, düzenleme geçmişi, görseller,
-- forumdan süreli yasak. Sayaçlar (forum_profiles.topics/posts/likes/dislikes) uygulama tarafında aynı işlemde güncellenir.

CREATE TABLE IF NOT EXISTS forum_categories (
  id              serial PRIMARY KEY,
  slug            text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{2,40}$'),
  name            text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 60),
  description     text NOT NULL DEFAULT '' CHECK (char_length(description) <= 240),
  icon            text NOT NULL DEFAULT 'msg' CHECK (icon ~ '^[a-z0-9]{2,20}$'),
  sort            smallint NOT NULL DEFAULT 0,
  kind            text NOT NULL DEFAULT 'normal' CHECK (kind IN ('normal', 'announce')),   -- announce: yalnız yönetim konu açar
  min_level_topic smallint NOT NULL DEFAULT 1 CHECK (min_level_topic BETWEEN 1 AND 8),
  is_locked       boolean NOT NULL DEFAULT false,                                          -- kilitli kategoride yeni konu/yanıt yok
  notice          text NOT NULL DEFAULT '' CHECK (char_length(notice) <= 400),             -- kategori başında sabit uyarı
  created_at      timestamptz NOT NULL DEFAULT now()
);

INSERT INTO forum_categories (slug, name, description, icon, sort, kind, notice) VALUES
  ('duyurular', 'Duyurular', 'AlpveFit''ten haberler, güncellemeler ve forum duyuruları.', 'bell', 1, 'announce', ''),
  ('beslenme', 'Beslenme', 'Diyet, makrolar, öğün planlama ve tarifler.', 'apple', 2, 'normal', ''),
  ('antrenman', 'Antrenman', 'Program, teknik, hacim ve toparlanma.', 'dumb', 3, 'normal', ''),
  ('takviye', 'Takviye ve Supplement', 'Protein, kreatin, vitamin ve mineraller üzerine deneyimler.', 'pill', 4, 'normal', ''),
  ('farmakoloji', 'Farmakoloji', 'Bilimsel tartışma ve zarar azaltma. Satış, kaynak ve tedarik paylaşımı kesinlikle yasaktır.', 'flask', 5, 'normal',
   'Bu bölümdeki paylaşımlar bilgi amaçlıdır ve tıbbi tavsiye değildir. Her durumda hekiminize danışın. Ürün satışı, kaynak veya tedarik paylaşımı yasaktır; bu tür içerikler kaldırılır ve hesap kısıtlanır.'),
  ('gelisim-gunlukleri', 'Gelişim Günlükleri', 'Kendi sürecinizi günlük tutarak paylaşın, destek alın.', 'chart', 6, 'normal', ''),
  ('soru-cevap', 'Soru – Cevap', 'Aklınıza takılanı sorun; en iyi yanıt işaretlenir.', 'help', 7, 'normal', ''),
  ('serbest-kursu', 'Serbest Kürsü', 'Sporla ilgili sohbet, motivasyon ve tanışma.', 'users', 8, 'normal', '')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS forum_topics (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      integer NOT NULL REFERENCES forum_categories(id),
  author_id        uuid REFERENCES users(id) ON DELETE SET NULL,
  title            text NOT NULL CHECK (char_length(title) BETWEEN 8 AND 120),
  kind             text NOT NULL DEFAULT 'discussion' CHECK (kind IN ('discussion', 'question')),
  is_pinned        boolean NOT NULL DEFAULT false,
  is_locked        boolean NOT NULL DEFAULT false,
  hidden_at        timestamptz,
  hidden_by        uuid REFERENCES users(id) ON DELETE SET NULL,
  hidden_reason    text,
  accepted_post_id uuid,
  reply_count      integer NOT NULL DEFAULT 0 CHECK (reply_count >= 0),
  view_count       integer NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  last_post_at     timestamptz NOT NULL DEFAULT now(),
  last_post_id     uuid,
  last_poster_id   uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ftopics_cat ON forum_topics (category_id, is_pinned DESC, last_post_at DESC) WHERE hidden_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ftopics_last ON forum_topics (last_post_at DESC) WHERE hidden_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_ftopics_author ON forum_topics (author_id, created_at DESC);

CREATE TABLE IF NOT EXISTS forum_posts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id       uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  author_id      uuid REFERENCES users(id) ON DELETE SET NULL,
  body           text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  is_first       boolean NOT NULL DEFAULT false,
  like_count     integer NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  dislike_count  integer NOT NULL DEFAULT 0 CHECK (dislike_count >= 0),
  edited_at      timestamptz,
  edited_by      uuid REFERENCES users(id) ON DELETE SET NULL,
  hidden_at      timestamptz,
  hidden_by      uuid REFERENCES users(id) ON DELETE SET NULL,
  hidden_reason  text,
  deleted_by_author boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fposts_topic ON forum_posts (topic_id, created_at);
CREATE INDEX IF NOT EXISTS idx_fposts_author ON forum_posts (author_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_fposts_first ON forum_posts (topic_id) WHERE is_first;
-- tam metin arama (Türkçe kök bulma dil bağımsız "simple" ile; arama sorgusu da aynı biçimde katlanır)
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS search tsvector GENERATED ALWAYS AS (to_tsvector('simple', body)) STORED;
ALTER TABLE forum_topics ADD COLUMN IF NOT EXISTS search tsvector GENERATED ALWAYS AS (to_tsvector('simple', title)) STORED;
CREATE INDEX IF NOT EXISTS idx_fposts_search ON forum_posts USING GIN (search);
CREATE INDEX IF NOT EXISTS idx_ftopics_search ON forum_topics USING GIN (search);

CREATE TABLE IF NOT EXISTS forum_post_edits (
  id         bigserial PRIMARY KEY,
  post_id    uuid NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  editor_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  old_body   text NOT NULL,
  old_title  text,
  reason     text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fedits_post ON forum_post_edits (post_id, created_at DESC);

CREATE TABLE IF NOT EXISTS forum_reactions (
  post_id    uuid NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value      smallint NOT NULL CHECK (value IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS forum_reads (
  topic_id     uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (topic_id, user_id)
);
CREATE TABLE IF NOT EXISTS forum_watches (
  topic_id   uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (topic_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_fwatch_user ON forum_watches (user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS forum_bookmarks (
  post_id    uuid NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_fbook_user ON forum_bookmarks (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS forum_polls (
  topic_id   uuid PRIMARY KEY REFERENCES forum_topics(id) ON DELETE CASCADE,
  question   text NOT NULL CHECK (char_length(question) BETWEEN 3 AND 140),
  options    jsonb NOT NULL,           -- ["seçenek", …] (2–6)
  multi      boolean NOT NULL DEFAULT false,
  closes_at  timestamptz
);
CREATE TABLE IF NOT EXISTS forum_poll_votes (
  topic_id   uuid NOT NULL REFERENCES forum_polls(topic_id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  choices    smallint[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (topic_id, user_id)
);

CREATE TABLE IF NOT EXISTS forum_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reason      text NOT NULL CHECK (reason IN ('spam', 'abuse', 'obscene', 'political', 'scam', 'sales', 'medical', 'other')),
  note        text NOT NULL DEFAULT '' CHECK (char_length(note) <= 300),
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'upheld', 'dismissed')),
  handled_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  handled_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, reporter_id)
);
CREATE INDEX IF NOT EXISTS idx_freports_open ON forum_reports (created_at) WHERE status = 'open';

-- Forum görselleri: mesaja bağlanana kadar sahibinde bekler (post_id NULL); bağlandıktan sonra yalnız forum üyelerine sunulur.
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS forum_post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE;
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_scope_check;
ALTER TABLE attachments ADD CONSTRAINT attachments_scope_check CHECK (scope IN ('ticket', 'profile', 'body', 'avatar', 'sig', 'blood', 'dm', 'forum'));
CREATE INDEX IF NOT EXISTS idx_attachments_fpost ON attachments (forum_post_id) WHERE forum_post_id IS NOT NULL;

-- Forumdan süreli / süresiz yasak (siteye girişi etkilemez) ve son görülme (çevrimiçi sayısı)
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS banned_until timestamptz;
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS ban_reason text;
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS ban_permanent boolean NOT NULL DEFAULT false;
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_fprof_seen ON forum_profiles (last_seen_at DESC) WHERE last_seen_at IS NOT NULL;
