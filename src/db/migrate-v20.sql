-- v20: telefona / masaüstüne bildirim (Web Push).
-- VAPID anahtar çifti sunucu tarafından ilk kullanımda üretilir ve burada saklanır (elle gizli anahtar girilmez; tek satır).
CREATE TABLE IF NOT EXISTS push_vapid (
  id          smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  public_key  text NOT NULL,          -- base64url, sıkıştırılmamış P-256 noktası (65 bayt)
  private_pem text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint    text NOT NULL UNIQUE CHECK (char_length(endpoint) <= 800),
  ua          text CHECK (char_length(ua) <= 120),
  created_at  timestamptz NOT NULL DEFAULT now(),
  last_ok_at  timestamptz,
  fails       integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions (user_id);
