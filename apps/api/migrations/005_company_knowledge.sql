-- Company Knowledge Base (RAG) — FASE 4 (Hermes Integrated Implementation)
--
-- Purpose: give the diagnostic intelligence a verifiable, versioned source of
-- truth about Código Binário itself (identity, services, method, team, contact,
-- commercial boundaries), so that questions such as "Quem é o Código Binário?"
-- are answered from real stored knowledge instead of model improvisation.
--
-- Design notes:
--   * `memory_items` already exists but is PROJECT-scoped (project_id NOT NULL)
--     and therefore cannot hold company-level knowledge. A dedicated table is
--     required rather than overloading project memory.
--   * pgvector is already enabled (001_init.sql) — dimension 1536 matches the
--     existing convention in `memory_items.embedding VECTOR(1536)`.
--   * Additive and idempotent: safe to run on a live database. No existing
--     table, column or row is modified or dropped.
--   * The embedding provider is Gemini (`gemini-embedding-001`, dimension 1536).
--     Retrieval is best-effort: if embeddings are unavailable the diagnostic
--     pipeline MUST keep working (see services/knowledge-base.ts).

-- 1. Table
CREATE TABLE IF NOT EXISTS company_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,                    -- identity|services|capabilities|methodology|team|process|pricing|contact|technology|product|policy|faq
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,                           -- public page this fact is verifiable on
    tags JSONB DEFAULT '[]'::jsonb,
    embedding VECTOR(1536),                    -- gemini-embedding-001 @ 1536 dims
    content_hash TEXT NOT NULL UNIQUE,         -- idempotent re-seeding
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Keep updated_at correct (reuses the helper from 001_init.sql)
DROP TRIGGER IF EXISTS update_company_knowledge_updated_at ON company_knowledge;
CREATE TRIGGER update_company_knowledge_updated_at BEFORE UPDATE ON company_knowledge
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. Indexes
--    HNSW gives good recall/latency without a training step and supports
--    incremental inserts (unlike ivfflat, which needs data to build lists).
CREATE INDEX IF NOT EXISTS idx_company_knowledge_embedding
    ON company_knowledge USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_company_knowledge_category
    ON company_knowledge(category);

-- 4. Similarity search RPC (PostgREST-callable, service_role only)
--    Mirrors the existing acquire_discovery_lock / release_discovery_lock pattern.
CREATE OR REPLACE FUNCTION match_company_knowledge(
    query_embedding VECTOR(1536),
    match_threshold DOUBLE PRECISION DEFAULT 0.30,
    match_count INTEGER DEFAULT 4
) RETURNS TABLE (
    id UUID,
    category TEXT,
    title TEXT,
    content TEXT,
    source_url TEXT,
    tags JSONB,
    similarity DOUBLE PRECISION
) LANGUAGE sql STABLE AS $$
    SELECT
        ck.id,
        ck.category,
        ck.title,
        ck.content,
        ck.source_url,
        ck.tags,
        1 - (ck.embedding <=> query_embedding) AS similarity
    FROM company_knowledge ck
    WHERE ck.embedding IS NOT NULL
      AND 1 - (ck.embedding <=> query_embedding) >= match_threshold
    ORDER BY ck.embedding <=> query_embedding
    LIMIT GREATEST(1, LEAST(match_count, 20));
$$;

-- 5. RLS — deny-by-default, exactly like every other table in this schema.
--    The backend uses the service_role key, which bypasses RLS.
ALTER TABLE company_knowledge ENABLE ROW LEVEL SECURITY;
