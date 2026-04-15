-- Habitat 3RI — Deuxième Cerveau: pgvector migration
-- Run this AFTER schema.sql in the Supabase SQL Editor

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Article embeddings (auto-generated on publish)
CREATE TABLE IF NOT EXISTS article_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  chunk_text TEXT NOT NULL,
  embedding vector(3072),  -- text-embedding-3-large = 3072 dimensions
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(article_id, chunk_index)
);

-- 3. User saved articles (personal brain)
CREATE TABLE IF NOT EXISTS user_saved_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- 4. User personal notes
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Chat history per user
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes for vector similarity search (IVFFlat for performance)
CREATE INDEX IF NOT EXISTS idx_article_embeddings_vector
  ON article_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_user_notes_vector
  ON user_notes
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS idx_article_embeddings_article
  ON article_embeddings(article_id);

CREATE INDEX IF NOT EXISTS idx_user_saved_user
  ON user_saved_articles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_notes_user
  ON user_notes(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_history_session
  ON chat_history(session_id, created_at);

-- 7. Vector similarity search function
CREATE OR REPLACE FUNCTION match_articles(
  query_embedding vector(3072),
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 10,
  filter_locale TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  article_id UUID,
  chunk_text TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.id,
    ae.article_id,
    ae.chunk_text,
    ae.metadata,
    1 - (ae.embedding <=> query_embedding) AS similarity
  FROM article_embeddings ae
  JOIN articles a ON a.id = ae.article_id
  WHERE
    a.status = 'published'
    AND (filter_locale IS NULL OR a.locale = filter_locale)
    AND 1 - (ae.embedding <=> query_embedding) > match_threshold
  ORDER BY ae.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 8. Search user's personal notes
CREATE OR REPLACE FUNCTION match_user_notes(
  query_embedding vector(3072),
  p_user_id UUID,
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  article_id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    un.id,
    un.title,
    un.content,
    un.article_id,
    1 - (un.embedding <=> query_embedding) AS similarity
  FROM user_notes un
  WHERE
    un.user_id = p_user_id
    AND un.embedding IS NOT NULL
    AND 1 - (un.embedding <=> query_embedding) > match_threshold
  ORDER BY un.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 9. Hybrid search: text + vector (for search bar)
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text TEXT,
  query_embedding vector(3072),
  match_count INT DEFAULT 10,
  filter_locale TEXT DEFAULT NULL,
  text_weight FLOAT DEFAULT 0.3,
  vector_weight FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  article_id UUID,
  title TEXT,
  slug TEXT,
  locale TEXT,
  excerpt TEXT,
  category TEXT,
  chunk_text TEXT,
  similarity FLOAT,
  text_rank FLOAT,
  combined_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vector_results AS (
    SELECT
      ae.article_id,
      ae.chunk_text,
      1 - (ae.embedding <=> query_embedding) AS vec_sim
    FROM article_embeddings ae
    JOIN articles a ON a.id = ae.article_id
    WHERE
      a.status = 'published'
      AND (filter_locale IS NULL OR a.locale = filter_locale)
    ORDER BY ae.embedding <=> query_embedding
    LIMIT match_count * 3
  ),
  text_results AS (
    SELECT
      a.id AS art_id,
      ts_rank(
        to_tsvector('simple', COALESCE(a.title, '') || ' ' || COALESCE(a.excerpt, '') || ' ' || COALESCE(a.content, '')),
        plainto_tsquery('simple', query_text)
      ) AS txt_rank
    FROM articles a
    WHERE
      a.status = 'published'
      AND (filter_locale IS NULL OR a.locale = filter_locale)
      AND to_tsvector('simple', COALESCE(a.title, '') || ' ' || COALESCE(a.excerpt, '')) @@ plainto_tsquery('simple', query_text)
  ),
  combined AS (
    SELECT
      COALESCE(vr.article_id, tr.art_id) AS c_article_id,
      vr.chunk_text AS c_chunk_text,
      COALESCE(vr.vec_sim, 0) AS c_vec_sim,
      COALESCE(tr.txt_rank, 0) AS c_txt_rank,
      (vector_weight * COALESCE(vr.vec_sim, 0) + text_weight * LEAST(COALESCE(tr.txt_rank, 0), 1.0)) AS c_combined
    FROM vector_results vr
    FULL OUTER JOIN text_results tr ON vr.article_id = tr.art_id
  )
  SELECT
    c.c_article_id,
    a.title,
    a.slug,
    a.locale,
    a.excerpt,
    a.category,
    c.c_chunk_text,
    c.c_vec_sim,
    c.c_txt_rank,
    c.c_combined
  FROM combined c
  JOIN articles a ON a.id = c.c_article_id
  WHERE c.c_combined > 0.1
  ORDER BY c.c_combined DESC
  LIMIT match_count;
END;
$$;

-- 10. RLS policies for user tables
ALTER TABLE user_saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_embeddings ENABLE ROW LEVEL SECURITY;

-- Public read for article embeddings (search works without auth)
CREATE POLICY "Article embeddings readable by all"
  ON article_embeddings FOR SELECT USING (true);

-- Service role manages embeddings
CREATE POLICY "Service role manages embeddings"
  ON article_embeddings FOR ALL USING (auth.role() = 'service_role');

-- Users manage their own saves
CREATE POLICY "Users manage own saves"
  ON user_saved_articles FOR ALL
  USING (auth.uid() = user_id);

-- Users manage their own notes
CREATE POLICY "Users manage own notes"
  ON user_notes FOR ALL
  USING (auth.uid() = user_id);

-- Users see their own chat history
CREATE POLICY "Users see own chat history"
  ON chat_history FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Auto-update trigger for user_notes
CREATE TRIGGER user_notes_updated_at
  BEFORE UPDATE ON user_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
