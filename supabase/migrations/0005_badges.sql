-- 0005_badges.sql
-- Itqan Badge Levels, Awards, Criteria Results, and Publisher Claims

-- 1. Badge Levels Table
CREATE TABLE IF NOT EXISTS badge_levels (
  code text PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text NOT NULL,
  min_score numeric(5,2) NOT NULL DEFAULT 85.00,
  weight jsonb NOT NULL DEFAULT '{}'::jsonb,
  requires_human_review boolean NOT NULL DEFAULT false,
  can_be_auto boolean NOT NULL DEFAULT false,
  color_token text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

-- 2. Badge Awards Table
CREATE TABLE IF NOT EXISTS badge_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  level text NOT NULL REFERENCES badge_levels(code),
  awarded_by_profile_id uuid REFERENCES profiles(id),
  standard_version text NOT NULL DEFAULT '1.0',
  score numeric(5,2) NOT NULL DEFAULT 100.00,
  evidence jsonb DEFAULT '{}'::jsonb,
  public_note_ar text,
  internal_note_ar text,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  revoked_at timestamptz,
  revoked_reason_ar text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_badge_awards_resource ON badge_awards(resource_id);
CREATE INDEX idx_badge_awards_status ON badge_awards(status);

-- 3. Badge Criteria Results Table
CREATE TABLE IF NOT EXISTS badge_criteria_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  award_id uuid NOT NULL REFERENCES badge_awards(id) ON DELETE CASCADE,
  criterion_code text NOT NULL,
  result text NOT NULL CHECK (result IN ('pass', 'fail', 'na')),
  weight numeric(4,2) NOT NULL DEFAULT 1.00,
  evidence_note text,
  evidence_url text
);

CREATE INDEX idx_criteria_award ON badge_criteria_results(award_id);

-- 4. Publisher Claims Table
CREATE TABLE IF NOT EXISTS publisher_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  claimant_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  method text NOT NULL CHECK (method IN ('domain_file', 'corporate_email', 'github_oauth', 'document', 'manual')),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
  reviewer_profile_id uuid REFERENCES profiles(id),
  decision_note_ar text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_claims_status ON publisher_claims(status);
CREATE INDEX idx_claims_resource ON publisher_claims(resource_id);
