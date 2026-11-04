-- 0003_resources.sql
-- Resources, Categories, Licenses, Versions, Files, Reviews and Comments

-- 1. Resource Types Table
CREATE TABLE IF NOT EXISTS resource_types (
  code text PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  icon text NOT NULL,
  color_token text NOT NULL,
  requires_scientific_review boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  path text NOT NULL,
  depth int NOT NULL DEFAULT 1 CHECK (depth <= 3),
  icon text,
  description_ar text,
  resource_count int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- 3. Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
  id text PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  url text NOT NULL,
  allows_commercial boolean NOT NULL DEFAULT true,
  requires_attribution boolean NOT NULL DEFAULT true,
  requires_share_alike boolean NOT NULL DEFAULT false,
  allows_modification boolean NOT NULL DEFAULT true,
  is_osi_approved boolean NOT NULL DEFAULT true,
  notes_ar text,
  is_active boolean NOT NULL DEFAULT true
);

-- 4. Resources Table (Core Catalog Table)
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_ar text NOT NULL CHECK (char_length(title_ar) BETWEEN 3 AND 120),
  title_en text CHECK (title_en IS NULL OR char_length(title_en) <= 120),
  summary_ar text NOT NULL CHECK (char_length(summary_ar) BETWEEN 20 AND 200),
  description_ar text NOT NULL,
  resource_type text NOT NULL REFERENCES resource_types(code),
  publisher_id uuid NOT NULL REFERENCES publishers(id),
  created_by uuid NOT NULL REFERENCES profiles(id),
  license_id text REFERENCES licenses(id),
  license_custom_text text,
  access_level text NOT NULL DEFAULT 'open' CHECK (access_level IN ('open', 'request', 'institutional')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'suspended', 'archived', 'rejected')),
  itqan_level text NOT NULL DEFAULT 'none' CHECK (itqan_level IN ('none', 'basic', 'verified', 'certified', 'gold')),
  itqan_awarded_at timestamptz,
  itqan_expires_at timestamptz,
  itqan_suspended_reason text,
  neutral_slug_history text[] DEFAULT '{}',
  repo_url text,
  docs_url text,
  homepage_url text,
  demo_url text,
  install_instructions jsonb DEFAULT '{}'::jsonb,
  tech_stack text[] DEFAULT '{}',
  languages text[] DEFAULT '{ar}',
  categories uuid[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  contains_quranic_text boolean NOT NULL DEFAULT false,
  quran_source_authority text,
  quran_source_url text,
  quran_source_version text,
  quran_source_license_id text REFERENCES licenses(id),
  latest_version text,
  latest_released_at timestamptz,
  downloads_count bigint NOT NULL DEFAULT 0,
  views_count bigint NOT NULL DEFAULT 0,
  rating_avg numeric(3,2) NOT NULL DEFAULT 0.00,
  rating_count int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  featured_rank int NOT NULL DEFAULT 0,
  published_at timestamptz,
  search_vector tsvector,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,

  CONSTRAINT chk_quran_source CHECK (
    contains_quranic_text = false
    OR (quran_source_authority IS NOT NULL
        AND quran_source_url IS NOT NULL
        AND quran_source_license_id IS NOT NULL)
  ),
  CONSTRAINT chk_license_required CHECK (
    license_id IS NOT NULL
    OR (license_custom_text IS NOT NULL AND length(license_custom_text) >= 40)
  ),
  CONSTRAINT chk_published_has_version CHECK (
    status <> 'published' OR latest_version IS NOT NULL
  ),
  CONSTRAINT chk_itqan_needs_verified CHECK (
    itqan_level IN ('none','basic') OR itqan_awarded_at IS NOT NULL
  )
);

-- Search and filter indexes
CREATE INDEX idx_resources_status_type ON resources(status, resource_type);
CREATE INDEX idx_resources_publisher ON resources(publisher_id);
CREATE INDEX idx_resources_itqan ON resources(itqan_level) WHERE status='published';
CREATE INDEX idx_resources_tech_gin ON resources USING gin(tech_stack);
CREATE INDEX idx_resources_tags_gin ON resources USING gin(tags);
CREATE INDEX idx_resources_cats_gin ON resources USING gin(categories);
CREATE INDEX idx_resources_search_gin ON resources USING gin(search_vector);
CREATE INDEX idx_resources_featured ON resources(featured_rank) WHERE is_featured = true;
CREATE INDEX idx_resources_recent ON resources(latest_released_at DESC NULLS LAST);
CREATE UNIQUE INDEX uq_resources_slug ON resources(slug) WHERE deleted_at IS NULL;

-- 5. Resource Categories Bridge Table
CREATE TABLE IF NOT EXISTS resource_categories (
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false,
  PRIMARY KEY (resource_id, category_id)
);

-- 6. Resource Versions Table
CREATE TABLE IF NOT EXISTS resource_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  version text NOT NULL CHECK (version ~ '^\d+\.\d+\.\d+'),
  released_at timestamptz NOT NULL DEFAULT now(),
  changelog_ar text NOT NULL,
  change_kind text NOT NULL DEFAULT 'patch' CHECK (change_kind IN ('major', 'minor', 'patch')),
  breaking_change boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'deprecated', 'yanked')),
  file_count int NOT NULL DEFAULT 0,
  total_size_bytes bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(resource_id, version)
);

CREATE INDEX idx_versions_resource ON resource_versions(resource_id, released_at DESC);

-- 7. Resource Files Table
CREATE TABLE IF NOT EXISTS resource_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid NOT NULL REFERENCES resource_versions(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  size_bytes bigint NOT NULL,
  mime_type text NOT NULL,
  sha256 text NOT NULL,
  download_count bigint NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT true,
  scan_status text NOT NULL DEFAULT 'clean' CHECK (scan_status IN ('pending', 'clean', 'infected', 'skipped')),
  scan_engine text,
  scanned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_files_version ON resource_files(version_id);

-- 8. Dependencies and Relations
CREATE TABLE IF NOT EXISTS resource_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  depends_on_resource_id uuid REFERENCES resources(id) ON DELETE SET NULL,
  external_name text,
  external_version text,
  kind text NOT NULL DEFAULT 'runtime' CHECK (kind IN ('runtime', 'peer', 'dev', 'data'))
);

CREATE TABLE IF NOT EXISTS resource_relations (
  source_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  relation text NOT NULL CHECK (relation IN ('similar', 'alternative', 'successor', 'companion')),
  weight numeric(3,2) NOT NULL DEFAULT 1.00,
  PRIMARY KEY (source_id, target_id)
);

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body_ar text CHECK (char_length(body_ar) <= 1500),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'removed')),
  helpful_count int NOT NULL DEFAULT 0,
  publisher_reply text,
  publisher_replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(resource_id, profile_id)
);

CREATE INDEX idx_reviews_resource ON reviews(resource_id) WHERE status = 'published';

-- 10. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  body_ar text NOT NULL CHECK (char_length(body_ar) <= 2000),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'removed')),
  edited_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_resource ON comments(resource_id);
