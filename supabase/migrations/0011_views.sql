-- 0011_views.sql
-- Optimized Safe Views for Frontend and Public Exposure

-- 1. Safe API Keys View (Excludes key_hash completely!)
CREATE OR REPLACE VIEW api_keys_safe AS
  SELECT
    k.id,
    k.resource_id,
    r.title_ar AS resource_title_ar,
    k.access_request_id,
    k.org_id,
    k.owner_profile_id,
    k.name_ar,
    k.key_prefix,
    k.scopes,
    k.rate_limit_per_hour,
    k.rate_limit_per_day,
    k.status,
    k.expires_at,
    k.last_used_at,
    k.rotated_from_id,
    k.revoked_at,
    k.usage_count,
    k.created_at
  FROM api_keys k
  JOIN resources r ON r.id = k.resource_id;

-- 2. Public Safe Profiles View
CREATE OR REPLACE VIEW public_profiles AS
  SELECT
    p.id,
    p.handle,
    p.display_name,
    p.locale,
    p.avatar_url,
    p.bio,
    p.website,
    p.github_login,
    p.skills,
    p.created_at
  FROM profiles p
  WHERE p.is_public = true AND p.is_blocked = false AND p.deleted_at IS NULL;

-- 3. Optimized Catalog Resources List View
CREATE OR REPLACE VIEW resources_list_view AS
  SELECT
    r.id,
    r.slug,
    r.title_ar,
    r.title_en,
    r.summary_ar,
    r.resource_type,
    r.itqan_level,
    r.access_level,
    r.license_id,
    r.rating_avg,
    r.rating_count,
    r.downloads_count,
    r.views_count,
    r.latest_version,
    r.latest_released_at,
    r.tech_stack,
    r.tags,
    r.is_featured,
    r.featured_rank,
    p.name_ar AS publisher_name_ar,
    p.slug AS publisher_slug,
    p.verification_status AS publisher_verification_status
  FROM resources r
  JOIN publishers p ON p.id = r.publisher_id
  WHERE r.status = 'published' AND r.deleted_at IS NULL;
