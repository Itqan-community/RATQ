-- 0006_reports_moderation.sql
-- User Reports, Moderation Actions, DMCA Notices, and GDPR Requests

-- 1. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_kind text NOT NULL CHECK (target_kind IN ('resource', 'review', 'comment', 'publisher', 'profile', 'api_key')),
  target_id uuid NOT NULL,
  reason text NOT NULL CHECK (reason IN ('inappropriate', 'inaccurate', 'copyright', 'misleading', 'abuse', 'broken', 'other')),
  details_ar text NOT NULL CHECK (char_length(details_ar) BETWEEN 10 AND 2000),
  evidence_urls text[] DEFAULT '{}',
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'triaged', 'resolved', 'dismissed')),
  resolved_by uuid REFERENCES profiles(id),
  resolution_note_ar text,
  resolved_at timestamptz,
  sla_due_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_status_priority ON reports(status, priority);
CREATE INDEX idx_reports_target ON reports(target_kind, target_id);
CREATE INDEX idx_reports_sla ON reports(sla_due_at) WHERE status IN ('open', 'triaged');

-- 2. Moderation Actions Table
CREATE TABLE IF NOT EXISTS moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE SET NULL,
  actor_profile_id uuid NOT NULL REFERENCES profiles(id),
  action text NOT NULL CHECK (action IN ('dismiss', 'warn', 'hide', 'suspend', 'ban', 'refer_review', 'refer_legal', 'restore')),
  reason_ar text NOT NULL CHECK (char_length(reason_ar) >= 5),
  meta jsonb DEFAULT '{}'::jsonb,
  ts timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_mod_actions_actor ON moderation_actions(actor_profile_id);

-- 3. DMCA Notices Table
CREATE TABLE IF NOT EXISTS dmca_notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  received_at timestamptz NOT NULL DEFAULT now(),
  complainant_name text NOT NULL,
  complainant_email_hash text NOT NULL,
  claimant_org text,
  target_resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  claim_summary_ar text NOT NULL,
  original_work_url text NOT NULL,
  good_faith boolean NOT NULL DEFAULT true,
  accuracy boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'under_review', 'notice_sent', 'counter_received', 'removed', 'restored', 'rejected')),
  notice_sent_at timestamptz,
  counter_deadline_at timestamptz,
  resolution_note_ar text,
  documents jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_dmca_status ON dmca_notices(status);
CREATE INDEX idx_dmca_resource ON dmca_notices(target_resource_id);

-- 4. GDPR Requests Table
CREATE TABLE IF NOT EXISTS gdpr_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('export', 'delete', 'rectify', 'restrict')),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'completed', 'rejected')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz NOT NULL,
  completed_at timestamptz,
  artifact_path text,
  note_ar text
);

CREATE INDEX idx_gdpr_status ON gdpr_requests(status);
