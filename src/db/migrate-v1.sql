-- Alpvefit — ilk şema (v1). Bağımsız veritabanı: Alpeptit tablolarıyla/verisiyle hiçbir ilişkisi yoktur.
-- Kimlik doğrulama tabloları Alpeptit'in kurallarıyla aynı yapıdadır; mağaza tabloları YOKTUR; yerine plan sistemi gelir.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS user_code_seq START WITH 1000;

CREATE TABLE users (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           text NOT NULL,
  username            text NOT NULL UNIQUE,
  email               text NOT NULL UNIQUE,
  password_hash       text NOT NULL,
  email_verified_at   timestamptz,
  last_name_change_at timestamptz,
  role                text NOT NULL DEFAULT 'user',
  member_status       text NOT NULL DEFAULT 'pending',
  user_code           text UNIQUE,
  token_version       integer NOT NULL DEFAULT 0,
  totp_secret         text,
  totp_last_step      bigint,
  totp_enabled        boolean NOT NULL DEFAULT false,
  totp_setup_required boolean NOT NULL DEFAULT false,
  two_factor_method   text,
  preferred_lang      text NOT NULL DEFAULT 'tr',
  totp_pending_secret text,
  totp_pending_at     timestamptz,
  backup_codes        text[],
  locked_at           timestamptz,
  locked_reason       text,
  locked_until        timestamptz,
  -- Uzmanın plan hazırlayabildiği türler (yalnız role = 'coach' için anlamlıdır; admin tüm türlere yetkilidir).
  plan_kinds          text[] NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_preferred_lang_valid CHECK (preferred_lang IN ('tr','en')),
  CONSTRAINT users_role_valid CHECK (role IN ('user','coach','admin')),
  CONSTRAINT users_two_factor_method_chk CHECK (two_factor_method IS NULL OR two_factor_method IN ('email','totp')),
  CONSTRAINT users_plan_kinds_valid CHECK (plan_kinds <@ ARRAY['nutrition','training','supplement','pharmacology']::text[])
);

CREATE TABLE verification_codes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  purpose     text NOT NULL,
  code_hash   text NOT NULL,
  target      text,
  expires_at  timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_verification_codes_lookup ON verification_codes (user_id, purpose, consumed_at, expires_at);

CREATE TABLE password_reset_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rid_hash          text NOT NULL UNIQUE,
  user_id           uuid REFERENCES users(id) ON DELETE CASCADE,
  code_hash         text NOT NULL,
  link_hash         text NOT NULL UNIQUE,
  ticket_hash       text UNIQUE,
  ticket_expires_at timestamptz,
  attempts          integer NOT NULL DEFAULT 0,
  resends           integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  expires_at        timestamptz NOT NULL,
  consumed_at       timestamptz
);
CREATE INDEX idx_pw_reset_user_open ON password_reset_requests (user_id) WHERE consumed_at IS NULL;

CREATE TABLE rate_limit_state (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier        text NOT NULL,
  action            text NOT NULL,
  fail_count        integer NOT NULL DEFAULT 0,
  banned_until      timestamptz,
  requires_recovery boolean NOT NULL DEFAULT false,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (identifier, action)
);

CREATE TABLE login_history (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_login_history_user ON login_history (user_id);

CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  action      text NOT NULL,
  target_type text,
  target_id   text,
  details     jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_log_created_id ON audit_log (created_at DESC, id DESC);
CREATE INDEX idx_audit_log_actor_created ON audit_log (actor_id, created_at DESC);
CREATE INDEX idx_audit_log_action_created ON audit_log (action, created_at DESC);

-- ---------------------------------------------------------------- koçluk
-- Uzman–üye ataması. delivery: online | in_person | hybrid. Yalnız yönetici oluşturur.
CREATE TABLE coach_clients (
  coach_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delivery   text NOT NULL DEFAULT 'online' CHECK (delivery IN ('online','in_person','hybrid')),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (coach_id, member_id),
  CHECK (coach_id <> member_id)
);
CREATE INDEX idx_coach_clients_member ON coach_clients (member_id);

-- Üyenin görebileceği plan türleri (erişim izni). Kayıt yoksa o tür üyenin panelinde görünmez.
CREATE TABLE member_access (
  member_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       text NOT NULL CHECK (kind IN ('nutrition','training','supplement','pharmacology')),
  granted_by uuid REFERENCES users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (member_id, kind)
);

-- Planlar: İÇERİĞİ YALNIZ yetkili uzman/yönetici girer; sistem hiçbir içerik üretmez.
CREATE TABLE plans (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         text NOT NULL CHECK (kind IN ('nutrition','training','supplement','pharmacology')),
  title        text NOT NULL,
  body         text NOT NULL DEFAULT '',
  starts_on    date,
  ends_on      date,
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  author_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  author_name  text NOT NULL,                       -- hazırlayanın adı (hesap silinse de plan üzerinde kalır)
  published_by uuid REFERENCES users(id) ON DELETE SET NULL,
  published_by_name text,
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on IS NULL OR starts_on IS NULL OR ends_on >= starts_on),
  CHECK (status = 'draft' OR published_at IS NOT NULL)
);
CREATE INDEX idx_plans_member_kind ON plans (member_id, kind, status);
CREATE INDEX idx_plans_author ON plans (author_id);

CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       text NOT NULL,
  text       text NOT NULL,
  plan_id    uuid REFERENCES plans(id) ON DELETE SET NULL,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);
