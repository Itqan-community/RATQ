-- 0012_vector.sql
-- pgvector Semantic Search Embeddings and Similarity RPC

CREATE TABLE IF NOT EXISTS resource_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  chunk_index int NOT NULL DEFAULT 0,
  chunk_text text NOT NULL,
  embedding vector(1536) NOT NULL,
  model text NOT NULL DEFAULT 'text-embedding-3-small',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resource_embeddings_vec
  ON resource_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_resource_embeddings_resource ON resource_embeddings(resource_id);

-- Match Resources RPC via Cosine Similarity
CREATE OR REPLACE FUNCTION match_resources (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  resource_id uuid,
  similarity float,
  chunk_text text
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    re.resource_id,
    1 - (re.embedding <=> query_embedding) AS similarity,
    re.chunk_text
  FROM resource_embeddings re
  JOIN resources r ON r.id = re.resource_id
  WHERE r.status = 'published' AND r.deleted_at IS NULL
    AND 1 - (re.embedding <=> query_embedding) > match_threshold
  ORDER BY re.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
