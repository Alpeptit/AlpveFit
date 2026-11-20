-- v23: Forumda sağlık verisi içeren paylaşım için KVKK açık rızası (m.6). NULL: rıza yok → forum yalnız okunur.
ALTER TABLE forum_profiles ADD COLUMN IF NOT EXISTS health_consent_at timestamptz;
