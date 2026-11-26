-- v26: Site kullanım ölçümü (birinci taraf, yalnız çerez bildiriminde izin verilince): hangi sayfada ne kadar süre geçirildi.
--   IP, sorgu dizesi ve tarayıcı parmak izi saklanmaz; oturum kimliği özetlenir; üye silinince kayıtlar anonimleşir; 90 gün sonra silinir.
CREATE TABLE IF NOT EXISTS page_views (
  id          bigserial PRIMARY KEY,
  sid         text NOT NULL CHECK (char_length(sid) = 32),
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  path        text NOT NULL CHECK (char_length(path) BETWEEN 1 AND 120),
  ms          integer NOT NULL CHECK (ms BETWEEN 300 AND 1800000),
  device      text NOT NULL CHECK (device IN ('mobile', 'desktop')),
  ref         text NOT NULL CHECK (ref IN ('direct', 'internal', 'search', 'social', 'other')),
  lang        text NOT NULL DEFAULT 'tr' CHECK (lang IN ('tr', 'en')),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views (created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views (user_id, created_at) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_page_views_sid ON page_views (sid, created_at);
