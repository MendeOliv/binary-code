-- Company Knowledge — Hybrid Retrieval (Dense + Lexical)
--
-- WHY (root cause, measured):
--   Migration 005 shipped a purely dense search. A ranking measurement over the
--   seeded corpus showed 1 of 10 real questions could not retrieve its correct
--   entry at all ("Quem constrói os sistemas?" → 'Equipa de engenharia' ABSENT)
--   and 2 more were ranked below noise, because short curated documents sit in
--   a narrow cosine band and the curated `tags` column — which exists precisely
--   to carry intent vocabulary such as 'quem constroi' — was never consulted.
--
-- FIX:
--   Score each candidate with cosine similarity AND a lexical overlap term over
--   `title + tags` (strong) and `content` (weak). The cosine still gates
--   relevance (>= match_threshold); the lexical term only re-orders candidates
--   that are already semantically relevant. Tags therefore become functional.
--
-- SAFETY:
--   * Ranking change only. No table, column or row is modified; no data loss.
--   * Additive migration: 005 remains valid and untouched.
--   * The previous 3-argument function is dropped on purpose — keeping both
--     overloads would make PostgREST unable to choose a candidate (PGRST203)
--     for the same named-argument call.
--   * Accent folding uses translate() instead of the `unaccent` extension, so
--     no new extension is required on the database.

-- 1. Accent-insensitive normalizer (mirrors normalize() in lib/company-knowledge.ts).
CREATE OR REPLACE FUNCTION ck_normalize(p_text TEXT) RETURNS TEXT
LANGUAGE sql IMMUTABLE AS $$
    SELECT btrim(
        regexp_replace(
            translate(
                lower(coalesce(p_text, '')),
                'áàâãäéèêëíìîïóòôõöúùûüçñ',
                'aaaaaeeeeiiiiooooouuuucn'
            ),
            '[^a-z0-9]+', ' ', 'g'
        )
    );
$$;

-- 2. Replace the dense-only function with the hybrid one.
DROP FUNCTION IF EXISTS match_company_knowledge(VECTOR(1536), DOUBLE PRECISION, INTEGER);

CREATE OR REPLACE FUNCTION match_company_knowledge(
    query_embedding VECTOR(1536),
    query_text TEXT DEFAULT '',
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
WITH q AS (
    SELECT
        COALESCE(
            ARRAY(
                SELECT w
                FROM unnest(string_to_array(ck_normalize(query_text), ' ')) AS w
                WHERE length(w) >= 4
                  AND w <> ALL (ARRAY[
                        'quem','quais','qual','vossos','vossas','voces','vcs',
                        'sobre','como','para','seus','suas','dos','das','com',
                        'uma','esta','este','que','tem','mais','pode','podem',
                        'fazer','existe','sao','ser','nos','vos','fala'
                  ])
            ),
            ARRAY[]::text[]
        ) AS tokens,
        btrim(ck_normalize(query_text)) = '' AS empty_query
),
scored AS (
    SELECT
        ck.id, ck.category, ck.title, ck.content, ck.source_url, ck.tags,
        (1 - (ck.embedding <=> query_embedding)) AS cosine,
        -- Strong zone: curated intent vocabulary (title + tags).
        CASE WHEN q.empty_query THEN 0.0 ELSE (
            SELECT count(*)::float
            FROM unnest(q.tokens) AS t
            WHERE ck_normalize(ck.title || ' ' || COALESCE(ck.tags::text, '')) LIKE '%' || t || '%'
        ) END AS strong_hits,
        -- Weak zone: full prose content.
        CASE WHEN q.empty_query THEN 0.0 ELSE (
            SELECT count(*)::float
            FROM unnest(q.tokens) AS t
            WHERE ck_normalize(ck.content) LIKE '%' || t || '%'
        ) END AS body_hits,
        q.empty_query
    FROM company_knowledge ck
    CROSS JOIN q
    WHERE ck.embedding IS NOT NULL
      -- Relevance gate stays semantic: the lexical term only re-orders.
      AND 1 - (ck.embedding <=> query_embedding) >= match_threshold
)
SELECT
    s.id, s.category, s.title, s.content, s.source_url, s.tags,
    CASE
        WHEN s.empty_query THEN s.cosine
        ELSE 0.5 * s.cosine
           + 0.5 * LEAST(1.0, (3 * s.strong_hits + s.body_hits) / 3.0)
    END AS similarity
FROM scored s
ORDER BY similarity DESC
LIMIT GREATEST(1, LEAST(match_count, 20));
$$;

COMMENT ON FUNCTION match_company_knowledge(VECTOR, TEXT, DOUBLE PRECISION, INTEGER) IS
    'Hybrid (dense + lexical) company knowledge retrieval. Cosine gates relevance; title/tags overlap re-orders.';
