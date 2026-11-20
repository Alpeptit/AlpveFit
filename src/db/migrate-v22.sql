-- v22: Haftanın meydan okuması (günlük işaretleme, 7 günde 5 gün → rozet) ve haftalık forum özeti e-postası.
CREATE TABLE IF NOT EXISTS challenge_checkins (
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day           date NOT NULL,
  week_start    date NOT NULL,
  challenge_key text NOT NULL CHECK (challenge_key ~ '^[a-z0-9]{2,20}$'),
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day),
  CHECK (day >= week_start AND day < week_start + 7)
);
CREATE INDEX IF NOT EXISTS idx_challenge_week ON challenge_checkins (week_start, challenge_key);

CREATE TABLE IF NOT EXISTS forum_badges (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key        text NOT NULL CHECK (key ~ '^[a-z0-9]{2,20}$'),
  week_start date NOT NULL,
  label      text NOT NULL CHECK (char_length(label) <= 80),
  icon       text NOT NULL CHECK (icon ~ '^[a-z0-9]{1,20}$'),
  earned_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, key, week_start)
);
CREATE INDEX IF NOT EXISTS idx_forum_badges_user ON forum_badges (user_id, earned_at DESC);

CREATE TABLE IF NOT EXISTS digest_runs (
  week_start date PRIMARY KEY,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  sent       integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS digest_sent (
  week_start date NOT NULL,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sent_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (week_start, user_id)
);
