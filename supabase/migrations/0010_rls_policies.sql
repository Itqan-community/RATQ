-- 0010_rls_policies.sql
-- Complete Row Level Security (RLS) Policies

-- 1. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_criteria_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmca_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_jobs ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
CREATE POLICY profiles_public_read ON profiles
  FOR SELECT TO anon, authenticated
  USING (is_public = true AND deleted_at IS NULL);

CREATE POLICY profiles_self_manage ON profiles
  FOR ALL TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 3. Publishers Policies
CREATE POLICY publishers_public_read ON publishers
  FOR SELECT TO anon, authenticated
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY publishers_owner_write ON publishers
  FOR ALL TO authenticated
  USING (owner_profile_id = auth.uid() OR auth_role() IN ('admin', 'moderator'))
  WITH CHECK (owner_profile_id = auth.uid() OR auth_role() IN ('admin', 'moderator'));

-- 4. Resources Policies
CREATE POLICY resources_public_read ON resources
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY resources_publisher_read ON resources
  FOR SELECT TO authenticated
  USING (publisher_id IN (SELECT id FROM publishers WHERE owner_profile_id = auth.uid()) OR auth_role() IN ('admin', 'moderator', 'reviewer'));

CREATE POLICY resources_publisher_write ON resources
  FOR ALL TO authenticated
  USING (
    publisher_id IN (SELECT id FROM publishers WHERE owner_profile_id = auth.uid())
    OR auth_role() IN ('admin', 'moderator')
  )
  WITH CHECK (
    publisher_id IN (SELECT id FROM publishers WHERE owner_profile_id = auth.uid())
    OR auth_role() IN ('admin', 'moderator')
  );

-- 5. Versions and Files Policies
CREATE POLICY versions_public_read ON resource_versions
  FOR SELECT TO anon, authenticated
  USING (status IN ('published', 'deprecated'));

CREATE POLICY versions_publisher_write ON resource_versions
  FOR ALL TO authenticated
  USING (
    resource_id IN (SELECT id FROM resources WHERE publisher_id IN (SELECT id FROM publishers WHERE owner_profile_id = auth.uid()))
    OR auth_role() IN ('admin', 'moderator')
  );

CREATE POLICY files_public_read ON resource_files
  FOR SELECT TO anon, authenticated
  USING (
    version_id IN (SELECT id FROM resource_versions WHERE status = 'published')
  );

-- 6. Access Requests Policies
CREATE POLICY requests_requester_read ON access_requests
  FOR SELECT TO authenticated
  USING (requester_profile_id = auth.uid() OR auth_role() IN ('admin', 'moderator'));

CREATE POLICY requests_publisher_read ON access_requests
  FOR SELECT TO authenticated
  USING (
    resource_id IN (SELECT id FROM resources WHERE publisher_id IN (SELECT id FROM publishers WHERE owner_profile_id = auth.uid()))
    OR auth_role() IN ('admin', 'moderator')
  );

CREATE POLICY requests_requester_insert ON access_requests
  FOR INSERT TO authenticated
  WITH CHECK (requester_profile_id = auth.uid());

CREATE POLICY requests_update_decision ON access_requests
  FOR UPDATE TO authenticated
  USING (
    requester_profile_id = auth.uid()
    OR resource_id IN (SELECT id FROM resources WHERE publisher_id IN (SELECT id FROM publishers WHERE owner_profile_id = auth.uid()))
    OR auth_role() IN ('admin', 'moderator')
  );

-- 7. API Keys Policies (Safe view is preferred, direct query restricted)
CREATE POLICY api_keys_owner_read ON api_keys
  FOR SELECT TO authenticated
  USING (owner_profile_id = auth.uid() OR auth_role() IN ('admin'));

CREATE POLICY api_keys_owner_manage ON api_keys
  FOR UPDATE TO authenticated
  USING (owner_profile_id = auth.uid() OR auth_role() IN ('admin'));

-- 8. Reviews and Comments Policies
CREATE POLICY reviews_public_read ON reviews
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY reviews_user_write ON reviews
  FOR ALL TO authenticated
  USING (profile_id = auth.uid() OR auth_role() IN ('admin', 'moderator'))
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY comments_public_read ON comments
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY comments_user_write ON comments
  FOR ALL TO authenticated
  USING (profile_id = auth.uid() OR auth_role() IN ('admin', 'moderator'))
  WITH CHECK (profile_id = auth.uid());

-- 9. Notifications Policies
CREATE POLICY notifications_owner_all ON notifications
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 10. Audit Log Policies (APPEND-ONLY — STRICT IMMUTABILITY)
CREATE POLICY audit_insert_authenticated ON audit_log
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY audit_select_authorized ON audit_log
  FOR SELECT TO authenticated
  USING (auth_role() IN ('admin', 'compliance'));

-- Note: NO UPDATE and NO DELETE policies exist on audit_log for anyone.
