-- v11 — Kişisel bilgiler: günlük öğün sayısı, isteğe bağlı vücut çevre ölçüleri; vücut formu görselleri (ön / arka / sağ / sol).
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS meals_per_day SMALLINT;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS arm_cm NUMERIC(4,1);
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS shoulder_cm NUMERIC(4,1);
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS waist_cm NUMERIC(4,1);
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS neck_cm NUMERIC(4,1);
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_meals_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_meals_check CHECK (meals_per_day IS NULL OR meals_per_day BETWEEN 1 AND 6);
ALTER TABLE member_profiles DROP CONSTRAINT IF EXISTS member_profiles_measure_check;
ALTER TABLE member_profiles ADD CONSTRAINT member_profiles_measure_check CHECK (
  (arm_cm IS NULL OR arm_cm BETWEEN 15 AND 70) AND (shoulder_cm IS NULL OR shoulder_cm BETWEEN 25 AND 80) AND
  (waist_cm IS NULL OR waist_cm BETWEEN 45 AND 200) AND (neck_cm IS NULL OR neck_cm BETWEEN 20 AND 70));

-- Vücut formu görselleri: kapsam 'body', her yön için en fazla bir görsel (yeni yükleme eskisinin yerini alır).
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS slot TEXT;
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_scope_check;
ALTER TABLE attachments ADD CONSTRAINT attachments_scope_check CHECK (scope IN ('ticket', 'profile', 'body'));
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_slot_check;
ALTER TABLE attachments ADD CONSTRAINT attachments_slot_check CHECK ((scope = 'body') = (slot IS NOT NULL) AND (slot IS NULL OR slot IN ('front', 'back', 'right', 'left')));
CREATE UNIQUE INDEX IF NOT EXISTS uq_attachments_body_slot ON attachments(user_id, slot) WHERE scope = 'body';
