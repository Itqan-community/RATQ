-- 0004_requests_keys.sql
-- Access Requests, API Keys, and API Usage

-- 1. Access Requests Table
CREATE TABLE IF NOT EXISTS access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  requester_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  purpose_ar text NOT NULL CHECK (char_length(purpose_ar) BETWEEN 10 AND 1200),
  intended_use text NOT NULL CHECK (intended_use IN ('personal', 'education', 'research', 'commercial', 'nonprofit', 'government')),
  requested_scope jsonb NOT NULL DEFAULT '{"scopes": ["resources:read", "resources:download"]}'::jsonb,
  requested_days int NOT NULL DEFAULT 90 CHECK (requested_days BETWEEN 7 AND 365),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'needs_info', 'approved', 'rejected', 'cancelled', 'expired', 'suspended', 'appealed')),
  decided_by_profile_id uuid REFERENCES profiles(id),
  decision_note_ar text,
  info_request_ar text,
  submitted_at timestamptz,
  sla_due_at timestamptz,
  decided_at timestamptz,
  expires_at timestamptz,
  renewal_of_request_id uuid REFERENCES access_requests(id),
  idempotency_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_requests_resource ON access_requests(resource_id);
CREATE INDEX idx_requests_requester ON access_requests(requester_profile_id);
CREATE INDEX idx_requests_status ON access_requests(status);
CREATE INDEX idx_requests_sla ON access_requests(sla_due_at) WHERE status IN ('submitted', 'under_review');

-- 2. API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  access_request_id uuid NOT NULL REFERENCES access_requests(id) ON DELETE CASCADE,
  org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  owner_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name_ar text NOT NULL CHECK (char_length(name_ar) BETWEEN 2 AND 80),
  key_prefix text NOT NULL CHECK (char_length(key_prefix) = 8),
  key_hash text UNIQUE NOT NULL,
  scopes text[] NOT NULL DEFAULT '{resources:read}',
  rate_limit_per_hour int NOT NULL DEFAULT 1000,
  rate_limit_per_day int NOT NULL DEFAULT 10000,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'rotating')),
  expires_at timestamptz NOT NULL,
  last_used_at timestamptz,
  last_used_ip_hash text,
  rotated_from_id uuid REFERENCES api_keys(id),
  revoked_at timestamptz,
  revoked_reason_ar text,
  usage_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_owner ON api_keys(owner_profile_id);
CREATE INDEX idx_api_keys_resource ON api_keys(resource_id);
CREATE INDEX idx_api_keys_active ON api_keys(status, expires_at) WHERE status = 'active';

-- 3. API Key Usage Table
CREATE TABLE IF NOT EXISTS api_key_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id uuid NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  ts timestamptz NOT NULL DEFAULT now(),
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code int NOT NULL,
  latency_ms int NOT NULL,
  bytes_out bigint NOT NULL DEFAULT 0,
  ip_hash text NOT NULL,
  user_agent_hash text,
  error_code text
);

CREATE INDEX idx_key_usage_key_ts ON api_key_usage(key_id, ts DESC);
