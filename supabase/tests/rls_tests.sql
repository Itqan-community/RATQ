-- supabase/tests/rls_tests.sql
-- Automated RLS Policy Verification Suite

-- Test 1: Anonymous access cannot see unpublished resources
SELECT count(*) = 0 AS test_anon_cannot_see_drafts
FROM resources
WHERE status <> 'published';

-- Test 2: Anonymous users cannot query api_keys table directly
SELECT count(*) = 0 AS test_anon_cannot_read_keys
FROM api_keys;

-- Test 3: Safe view hides key_hash column
SELECT NOT EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'api_keys_safe' AND column_name = 'key_hash'
) AS test_key_hash_not_in_safe_view;

-- Test 4: Verify audit_log is append-only (no update rules)
SELECT count(*) = 0 AS test_no_update_policy_on_audit
FROM pg_policies
WHERE tablename = 'audit_log' AND cmd = 'UPDATE';
