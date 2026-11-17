-- 0002_core_tables.sql
-- Profiles, Publishers, Organizations and Roles

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle text UNIQUE NOT NULL,
  display_name text NOT NULL,
  locale text NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar', 'en')),
  direction text NOT NULL DEFAULT 'rtl' CHECK (direction IN ('rtl', 'ltr')),
  numeral_system text NOT NULL DEFAULT 'western' CHECK (numeral_system IN ('western', 'arabic-indic')),
  timezone text NOT NULL DEFAULT 'Asia/Riyadh',
  avatar_url text,
  bio text,
  website text,
  github_login text,
  skills text[] DEFAULT '{}',
  is_public boolean NOT NULL DEFAULT true,
  is_blocked boolean NOT NULL DEFAULT false,
  blocked_reason text,
  email_notify jsonb DEFAULT '{"request_updates": true, "security_alerts": true, "version_releases": true}'::jsonb,
  onboarded_at timestamptz,
  deletion_requested_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_profiles_handle ON profiles(handle);
CREATE INDEX idx_profiles_is_public ON profiles(is_public) WHERE deleted_at IS NULL;

-- 2. User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('guest', 'member', 'developer', 'publisher_owner', 'publisher_member', 'reviewer', 'moderator', 'compliance', 'admin')),
  granted_by uuid REFERENCES profiles(id),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, role)
);

CREATE INDEX idx_user_roles_profile ON user_roles(profile_id);

-- 3. Publishers Table
CREATE TABLE IF NOT EXISTS publishers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_ar text NOT NULL,
  name_en text,
  kind text NOT NULL DEFAULT 'organization' CHECK (kind IN ('publisher', 'institute', 'individual', 'organization', 'university')),
  logo_url text,
  description_ar text,
  website text,
  country_code char(2),
  verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verification_method text CHECK (verification_method IN ('domain_file', 'corporate_email', 'github_oauth', 'document', 'manual')),
  verified_at timestamptz,
  public_contact_email text,
  owner_profile_id uuid NOT NULL REFERENCES profiles(id),
  access_policy text NOT NULL DEFAULT 'request' CHECK (access_policy IN ('open', 'request', 'institutional', 'mixed')),
  default_sla_days int NOT NULL DEFAULT 5 CHECK (default_sla_days BETWEEN 1 AND 30),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_publishers_slug ON publishers(slug);
CREATE INDEX idx_publishers_owner ON publishers(owner_profile_id);
CREATE INDEX idx_publishers_verification ON publishers(verification_status) WHERE is_active = true;

-- 4. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_ar text NOT NULL,
  kind text NOT NULL DEFAULT 'team' CHECK (kind IN ('team', 'enterprise', 'charity', 'university')),
  plan_tier text NOT NULL DEFAULT 'community' CHECK (plan_tier IN ('community', 'pro', 'enterprise')),
  verified_domain text,
  owner_profile_id uuid NOT NULL REFERENCES profiles(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Memberships Table
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by uuid REFERENCES profiles(id),
  accepted_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id, profile_id)
);

CREATE INDEX idx_memberships_org ON memberships(org_id);
CREATE INDEX idx_memberships_profile ON memberships(profile_id);
