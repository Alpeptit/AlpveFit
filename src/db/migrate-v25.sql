-- v25: Koçluk asistanı (yalnız koçluk üyeleri; kalori / makro, antrenman programı, kilo ve ölçü takibi).
--   • Üyenin açık rızası olmadan hiçbir verisi yapay zekâ sağlayıcısına gönderilmez (ai_consent_at).
--   • Görüşme geçmişi yalnız üyeye görünür; üye istediği an siler; 90 günden eski mesajlar otomatik silinir.
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_consent_at timestamptz;

CREATE TABLE IF NOT EXISTS ai_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('user', 'assistant')),
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  source      text NOT NULL DEFAULT 'model' CHECK (source IN ('member', 'model', 'fixed')),   -- yanıt modelden mi, sabit güvenli metin mi
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user ON ai_messages (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created ON ai_messages (created_at);
