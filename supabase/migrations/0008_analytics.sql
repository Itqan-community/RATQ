-- 0008_analytics.sql
-- Analytics Events (No PII), Search Queries, and Flarum Forum Threads Cache

-- 1. Resource Events Table (Aggregated daily, zero PII)
CREATE TABLE IF NOT EXISTS resource_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  day date NOT NULL DEFAULT CURRENT_DATE,
  event text NOT NULL CHECK (event IN ('view', 'download', 'request', 'install_copy', 'doc_view')),
  count int NOT NULL DEFAULT 1,
  country_code char(2) NOT NULL DEFAULT 'SA',
  channel text NOT NULL DEFAULT 'web' CHECK (channel IN ('web', 'api', 'seo', 'direct')),
  CONSTRAINT uq_resource_event_slice UNIQUE (resource_id, day, event, country_code, channel)
);

CREATE INDEX idx_resource_events_res_day ON resource_events(resource_id, day DESC);

-- 2. Search Queries Table (No PII)
CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day date NOT NULL DEFAULT CURRENT_DATE,
  normalized_query text NOT NULL,
  filters jsonb DEFAULT '{}'::jsonb,
  result_count int NOT NULL DEFAULT 0,
  clicked_resource_id uuid REFERENCES resources(id) ON DELETE SET NULL,
  locale text NOT NULL DEFAULT 'ar'
);

CREATE INDEX idx_search_queries_query ON search_queries(normalized_query);

-- 3. Forum Threads Cache Table (Phase 2 Flarum Read-Only Bridge — ADR-006)
CREATE TABLE IF NOT EXISTS forum_threads_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  flarum_discussion_id bigint NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  posts_count int NOT NULL DEFAULT 0,
  last_posted_at timestamptz,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_forum_cache_resource ON forum_threads_cache(resource_id);
