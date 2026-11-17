-- v8 — Kullanıcı paneli revizyonu: "Değerli Notlar" plan türü, kişisel bilgilerde cinsiyet / doğum tarihi / adım aralığı,
-- destek başlığı sınırı 244 karakter. Tüm değişiklikler idempotenttir (yeniden çalıştırmak zararsızdır).

-- 1) Plan türlerine "notes" (Değerli Notlar) eklenir.
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_kinds_valid;
ALTER TABLE users ADD CONSTRAINT users_plan_kinds_valid CHECK (plan_kinds <@ ARRAY['nutrition','training','supplement','pharmacology','notes']::text[]);
ALTER TABLE plans DROP CONSTRAINT IF EXISTS plans_kind_check;
ALTER TABLE plans ADD CONSTRAINT plans_kind_check CHECK (kind IN ('nutrition','training','supplement','pharmacology','notes'));
ALTER TABLE member_access DROP CONSTRAINT IF EXISTS member_access_kind_check;
ALTER TABLE member_access ADD CONSTRAINT member_access_kind_check CHECK (kind IN ('nutrition','training','supplement','pharmacology','notes'));
-- Mevcut erişimi olan üyelere "Değerli Notlar" bölümü de açılır (yeni siparişlerde sunucu kodu ekler).
INSERT INTO member_access (member_id, kind)
  SELECT DISTINCT member_id, 'notes' FROM member_access WHERE kind <> 'notes'
  ON CONFLICT DO NOTHING;

-- 2) Kişisel bilgiler: cinsiyet, doğum tarihi (gün/ay/yıl), günlük adım aralığı.
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS gender      TEXT;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS birth_date  DATE;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS steps_range TEXT;
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_gender_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_gender_check CHECK (gender IS NULL OR gender IN ('female','male'));
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_steps_range_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_steps_range_check CHECK (steps_range IS NULL OR steps_range IN ('0-2000','2000-4000','4000-6000','6000-8000','8000-10000','10000+'));
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_birth_date_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_birth_date_check CHECK (birth_date IS NULL OR (birth_date >= DATE '1930-01-01' AND birth_date <= DATE '2100-01-01'));

-- 3) Destek talebi başlığı: 3–244 karakter.
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_title_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_title_check CHECK (char_length(title) BETWEEN 3 AND 244);
