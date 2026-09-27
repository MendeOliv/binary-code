-- Company Knowledge — Hybrid Retrieval, corrected scoring
--
-- WHY (both defects found by measurement, not by inspection):
--
--   1. SUBSTRING FALSE POSITIVES. 006 matched tokens with `LIKE '%tok%'`, which
--      is not word-aware: the query token `fazem` ("O que vocês fazem?") matched
--      the tag `fazemos` of an unrelated entry, manufacturing a strong hit and
--      pushing it to rank 1. Fix: match whole words by padding both sides and
--      requiring ' tok ' inside ' text ', with both sides from ck_normalize().
--
--   2. NON-ADDITIVE SCORING. 006 computed `0.5*cosine + 0.5*lexical`, so a row
--      with a perfectly good cosine and zero lexical hits had its score HALVED
--      (e.g. 0.60 -> 0.28). That made the similarity column unreadable and let a
--      single strong tag hit (+0.5) outweigh any cosine difference. Fix: keep
--      cosine as the base and add a BOUNDED lexical bonus of at most +0.25
--      (fraction of query tokens matched, weighted toward title+tags). Zero-hit
--      rows now keep their true cosine; ranking is a strict refinement.
--
-- SAFETY: ranking/scoring only. No table, column or row is touched. 005 and 006
-- remain applied and valid; this migration supersedes the function body.

-- Whole-word lexical overlap, weighted toward curated intent vocabulary.
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
        ) AS tokens
),
candidates AS (
    SELECT
        ck.id, ck.category, ck.title, ck.content, ck.source_url, ck.tags,
        (1 - (ck.embedding <=> query_embedding)) AS cosine,
        -- Normalized ONCE per row (was recomputed per token in 006).
        ck_normalize(ck.title || ' ' || COALESCE(ck.tags::text, '')) AS strong_text,
        ck_normalize(ck.content) AS body_text
    FROM company_knowledge ck
    WHERE ck.embedding IS NOT NULL
      -- Relevance is gated semantically; the lexical term only re-orders.
      AND 1 - (ck.embedding <=> query_embedding) >= match_threshold
),
hits AS (
    SELECT
        c.id, c.category, c.title, c.content, c.source_url, c.tags, c.cosine,
        COALESCE((
            SELECT count(*)::float
            FROM unnest(q.tokens) AS t
            -- Whole-word match: ' tok ' inside ' text '.
            WHERE (' ' || c.strong_text || ' ') LIKE ('% ' || t || ' %')
        ), 0) AS strong_hits,
        COALESCE((
            SELECT count(*)::float
            FROM unnest(q.tokens) AS t
            WHERE (' ' || c.body_text || ' ') LIKE ('% ' || t || ' %')
        ), 0) AS body_hits,
        COALESCE(array_length(q.tokens, 1), 0) AS n_tokens
    FROM candidates c
    CROSS JOIN q
)
SELECT
    h.id, h.category, h.title, h.content, h.source_url, h.tags,
    -- Base = true cosine. Bonus is strictly additive and capped at +0.25.
    h.cosine + CASE
        WHEN h.n_tokens = 0 THEN 0.0
        ELSE 0.25 * LEAST(1.0, (2 * h.strong_hits + h.body_hits) / (2.0 * h.n_tokens))
    END AS similarity
FROM hits h
ORDER BY similarity DESC
LIMIT GREATEST(1, LEAST(match_count, 20));
$$;

COMMENT ON FUNCTION match_company_knowledge(VECTOR, TEXT, DOUBLE PRECISION, INTEGER) IS
    'Company knowledge retrieval: cosine similarity gated by match_threshold, plus a bounded (<=+0.25) whole-word lexical bonus over title/tags.';

-- columns of the RETURNS TABLE were selected before; the CTE keeps the same shape.
