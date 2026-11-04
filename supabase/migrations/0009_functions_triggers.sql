-- 0009_functions_triggers.sql
-- Functions, Triggers, Normalization, Security Guards and Search RPC

-- 1. Automatic updated_at Function
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_publishers_updated_at BEFORE UPDATE ON publishers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_access_requests_updated_at BEFORE UPDATE ON access_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2. Arabic Normalization Function (For search queries and non-sacred metadata ONLY)
CREATE OR REPLACE FUNCTION ratq_normalize_arabic(txt text) RETURNS text AS $$
  SELECT trim(regexp_replace(
    translate(
      regexp_replace(coalesce(txt,''), '[\u064B-\u0652\u0670\u0640]', '', 'g'),
      'أإآٱىئؤة',
      'ااااييوه'
    ), '\s+', ' ', 'g'));
$$ LANGUAGE sql IMMUTABLE;

-- 3. Search Vector Generation Trigger for Resources
CREATE OR REPLACE FUNCTION resources_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
      setweight(to_tsvector('simple', coalesce(NEW.title_ar, '')), 'A')
   || setweight(to_tsvector('simple', coalesce(NEW.title_en, '')), 'B')
   || setweight(to_tsvector('simple', coalesce(NEW.summary_ar, '')), 'C')
   || setweight(to_tsvector('simple', coalesce(array_to_string(NEW.tags, ' '), '')), 'B')
   || setweight(to_tsvector('simple', coalesce(array_to_string(NEW.tech_stack, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resources_search_vector
  BEFORE INSERT OR UPDATE OF title_ar, title_en, summary_ar, tags, tech_stack
  ON resources
  FOR EACH ROW
  EXECUTE FUNCTION resources_search_vector_update();

-- 4. Guard Function: Block Direct Modification of Sacred Text Content
CREATE OR REPLACE FUNCTION block_sacred_write() RETURNS trigger AS $$
BEGIN
  IF current_setting('ratq.context', true) <> 'import_pipeline' THEN
     RAISE EXCEPTION 'RATQ_SACRED_WRITE_BLOCKED: نص القرآن الكريم يُستورد فقط عبر مسار الاستيراد المعتمد';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Guard Function: Prevent Unauthorized Elevation to Certified/Gold Badge
CREATE OR REPLACE FUNCTION guard_itqan_level() RETURNS trigger AS $$
BEGIN
  IF NEW.itqan_level IN ('certified', 'gold')
     AND (NEW.itqan_awarded_at IS NULL OR NEW.itqan_awarded_at > now()) THEN
     RAISE EXCEPTION 'RATQ_ITQAN_GUARD: لا يمكن رفع المستوى إلى % بلا سجل منح صالح وتدقيق بشري', NEW.itqan_level;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_guard_itqan_level
  BEFORE INSERT OR UPDATE OF itqan_level
  ON resources
  FOR EACH ROW
  EXECUTE FUNCTION guard_itqan_level();

-- 6. Guard Function: Prevent Version Publishing Without Valid Files and SHA-256
CREATE OR REPLACE FUNCTION guard_version_publish() RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'published'
     AND NOT EXISTS (SELECT 1 FROM resource_files f WHERE f.version_id = NEW.id AND f.sha256 IS NOT NULL) THEN
     RAISE EXCEPTION 'RATQ_VERSION_GUARD: لا يمكن نشر إصدار بلا ملف ببصمة SHA-256 صالحة';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_guard_version_publish
  BEFORE INSERT OR UPDATE OF status
  ON resource_versions
  FOR EACH ROW
  EXECUTE FUNCTION guard_version_publish();

-- 7. Guard Function: Prevent Key Issuance for Unapproved Requests
CREATE OR REPLACE FUNCTION guard_key_issue() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM access_requests r WHERE r.id = NEW.access_request_id AND r.status = 'approved') THEN
     RAISE EXCEPTION 'RATQ_KEY_GUARD: لا يمكن إصدار مفتاح لطلب غير موافَق عليه';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_guard_key_issue
  BEFORE INSERT ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION guard_key_issue();

-- 8. Helper Function to Resolve Active User Role
CREATE OR REPLACE FUNCTION auth_role() RETURNS text AS $$
  SELECT coalesce(
    (SELECT role FROM user_roles WHERE profile_id = auth.uid() ORDER BY
       CASE role
         WHEN 'admin' THEN 1
         WHEN 'compliance' THEN 2
         WHEN 'moderator' THEN 3
         WHEN 'reviewer' THEN 4
         WHEN 'publisher_owner' THEN 5
         ELSE 9 END
       LIMIT 1),
    'member');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 9. Comprehensive Search RPC
CREATE OR REPLACE FUNCTION search_resources(
  q text DEFAULT NULL,
  types text[] DEFAULT NULL,
  cats uuid[] DEFAULT NULL,
  licenses text[] DEFAULT NULL,
  itqan text[] DEFAULT NULL,
  access text[] DEFAULT NULL,
  tech text[] DEFAULT NULL,
  langs text[] DEFAULT NULL,
  publisher uuid DEFAULT NULL,
  sort text DEFAULT 'relevance',
  page int DEFAULT 1,
  per_page int DEFAULT 24
) RETURNS TABLE (
  id uuid,
  slug text,
  title_ar text,
  summary_ar text,
  resource_type text,
  itqan_level text,
  access_level text,
  license_id text,
  rating_avg numeric,
  rating_count int,
  latest_version text,
  latest_released_at timestamptz,
  publisher_name text,
  publisher_slug text,
  total_count bigint
) AS $$
DECLARE
  nq text := ratq_normalize_arabic(q);
BEGIN
  RETURN QUERY
  WITH base AS (
    SELECT r.*,
      row_number() OVER (
        ORDER BY
          CASE WHEN sort = 'relevance' AND nq IS NOT NULL
               THEN ts_rank(r.search_vector, plainto_tsquery('simple', nq)) END DESC NULLS LAST,
          CASE WHEN sort = 'newest' THEN r.latest_released_at END DESC NULLS LAST,
          CASE WHEN sort = 'rating' THEN r.rating_avg END DESC NULLS LAST,
          CASE WHEN sort = 'usage'  THEN r.downloads_count END DESC NULLS LAST,
          CASE WHEN sort = 'alpha'  THEN r.title_ar END ASC NULLS LAST,
          r.downloads_count DESC
      ) AS rn,
      count(*) OVER() AS total
    FROM resources r
    WHERE r.status = 'published' AND r.deleted_at IS NULL
      AND (nq IS NULL OR r.search_vector @@ plainto_tsquery('simple', nq)
           OR r.title_ar % nq)
      AND (types IS NULL OR r.resource_type = ANY(types))
      AND (cats IS NULL OR r.categories && cats)
      AND (licenses IS NULL OR r.license_id = ANY(licenses))
      AND (itqan IS NULL OR r.itqan_level = ANY(itqan))
      AND (access IS NULL OR r.access_level = ANY(access))
      AND (tech IS NULL OR r.tech_stack && tech)
      AND (langs IS NULL OR r.languages && langs)
      AND (publisher IS NULL OR r.publisher_id = publisher)
  )
  SELECT b.id, b.slug, b.title_ar, b.summary_ar, b.resource_type, b.itqan_level,
         b.access_level, b.license_id, b.rating_avg, b.rating_count, b.latest_version,
         b.latest_released_at, p.name_ar, p.slug, b.total
  FROM base b JOIN publishers p ON p.id = b.publisher_id
  WHERE b.rn > (page - 1) * per_page AND b.rn <= page * per_page
  ORDER BY b.rn;
END;
$$ LANGUAGE plpgsql STABLE;
