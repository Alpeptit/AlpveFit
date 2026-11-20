-- v21: Gelişim günlüğü aracı — vücut ölçüleri ve gelişim fotoğrafları (görünürlük üyenin elinde: yalnız ben / arkadaşlarım / forum üyeleri).
ALTER TABLE attachments DROP CONSTRAINT IF EXISTS attachments_scope_check;
ALTER TABLE attachments ADD CONSTRAINT attachments_scope_check CHECK (scope IN ('ticket', 'profile', 'body', 'avatar', 'sig', 'blood', 'dm', 'forum', 'progress'));

CREATE TABLE IF NOT EXISTS body_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_on  date NOT NULL,
  weight_kg  numeric(5,2) CHECK (weight_kg BETWEEN 25 AND 350),
  waist_cm   numeric(5,1) CHECK (waist_cm BETWEEN 30 AND 250),
  hip_cm     numeric(5,1) CHECK (hip_cm BETWEEN 30 AND 250),
  chest_cm   numeric(5,1) CHECK (chest_cm BETWEEN 30 AND 250),
  arm_cm     numeric(5,1) CHECK (arm_cm BETWEEN 10 AND 90),
  thigh_cm   numeric(5,1) CHECK (thigh_cm BETWEEN 20 AND 120),
  note       text CHECK (char_length(note) <= 280),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, logged_on),
  CHECK (coalesce(weight_kg, waist_cm, hip_cm, chest_cm, arm_cm, thigh_cm) IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS progress_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attachment_id uuid NOT NULL UNIQUE REFERENCES attachments(id) ON DELETE CASCADE,
  taken_on      date NOT NULL,
  pose          text NOT NULL DEFAULT 'on' CHECK (pose IN ('on', 'yan', 'arka', 'diger')),
  visibility    text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'friends', 'members')),
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user ON progress_photos (user_id, taken_on DESC);
