-- 0007_notifications_audit.sql
-- Notifications, Email Outbox, Append-Only Audit Log, Feature Flags, and System Jobs

-- 1. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title_ar text NOT NULL,
  body_ar text NOT NULL,
  link_url text,
  payload jsonb DEFAULT '{}'::jsonb,
  read_at timestamptz,
  seen_at timestamptz,
  channel text NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'both')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX idx_notifications_profile ON notifications(profile_id, read_at);
CREATE INDEX idx_notifications_created ON notifications(profile_id, created_at DESC);

-- 2. Email Outbox Table
CREATE TABLE IF NOT EXISTS email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  template text NOT NULL,
  locale text NOT NULL DEFAULT 'ar',
  vars jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'suppressed')),
  attempts int NOT NULL DEFAULT 0,
  last_error text,
  provider_message_id text,
  send_after timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_outbox_queue ON email_outbox(status, send_after) WHERE status = 'queued';

-- 3. Audit Log Table (Append-Only — Immutable)
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES profiles(id),
  actor_role text NOT NULL,
  action text NOT NULL,
  target_kind text NOT NULL,
  target_id uuid,
  before jsonb,
  after jsonb,
  reason_ar text,
  ip_hash text,
  user_agent_hash text,
  request_id text,
  ts timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_target ON audit_log(target_kind, target_id);
CREATE INDEX idx_audit_actor ON audit_log(actor_profile_id, ts DESC);
CREATE INDEX idx_audit_action ON audit_log(action, ts DESC);

-- 4. Feature Flags Table
CREATE TABLE IF NOT EXISTS feature_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  description_ar text NOT NULL,
  rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. System Jobs Table
CREATE TABLE IF NOT EXISTS system_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'failed', 'succeeded')),
  last_run_at timestamptz,
  next_run_at timestamptz,
  last_error text,
  duration_ms int,
  stats jsonb DEFAULT '{}'::jsonb
);
