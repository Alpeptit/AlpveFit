-- v5 — BLOG: yalnız yönetici yazar/yayınlar; herkese açık okunur. Düz metin (HTML yok).
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 80),
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  excerpt      TEXT NOT NULL DEFAULT '' CHECK (char_length(excerpt) <= 300),
  body         TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 40000),
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name  TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_posts_pub_idx ON blog_posts (published_at DESC) WHERE status = 'published';
