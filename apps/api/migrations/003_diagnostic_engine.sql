-- Diagnostic Engine / Lead Engine — FASE 3 (Hermes Integrated Implementation)
-- Adds deterministic lead-scoring, human-review, on-site flags and technical
-- direction to the discovery pipeline, plus a DB-backed per-session lock for
-- concurrency control. Preserves all existing data and columns.

-- 1. Extend diagnostics with Diagnostic Engine + Lead Engine fields
ALTER TABLE diagnostics
    ADD COLUMN IF NOT EXISTS technical_direction TEXT,
    ADD COLUMN IF NOT EXISTS architecture_direction TEXT,
    ADD COLUMN IF NOT EXISTS implementation_considerations TEXT,
    ADD COLUMN IF NOT EXISTS risks JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS opportunities JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0 NOT NULL,
    ADD COLUMN IF NOT EXISTS score_reasons JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'low' NOT NULL,
    ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'LOW' NOT NULL,
    ADD COLUMN IF NOT EXISTS requires_human_review BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN IF NOT EXISTS on_site_required BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. Extend leads (score propagated deterministically by the backend)
ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS score INTEGER,
    ADD COLUMN IF NOT EXISTS priority TEXT,
    ADD COLUMN IF NOT EXISTS classification TEXT,
    ADD COLUMN IF NOT EXISTS requires_human_review BOOLEAN;

-- 3. DB-backed per-session concurrency lock
--    A single row per session. acquire is atomic (ON CONFLICT DO NOTHING) so
--    two concurrent messages for the same session cannot both acquire it.
CREATE TABLE IF NOT EXISTS discovery_locks (
    session_id UUID PRIMARY KEY REFERENCES discovery_sessions(id) ON DELETE CASCADE,
    owner TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE OR REPLACE FUNCTION acquire_discovery_lock(
    p_session UUID,
    p_owner TEXT,
    p_ttl_seconds INTEGER
) RETURNS BOOLEAN LANGUAGE plpgsql AS $$
DECLARE
    v_expires timestamptz;
BEGIN
    -- Clean stale leases.
    DELETE FROM discovery_locks
    WHERE session_id = p_session AND expires_at < now();

    INSERT INTO discovery_locks (session_id, owner, expires_at)
    VALUES (p_session, p_owner, now() + make_interval(secs => p_ttl_seconds))
    ON CONFLICT (session_id) DO NOTHING
    RETURNING expires_at INTO v_expires;

    RETURN v_expires IS NOT NULL;
END;
$$;

CREATE OR REPLACE FUNCTION release_discovery_lock(
    p_session UUID,
    p_owner TEXT
) RETURNS BOOLEAN LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM discovery_locks
    WHERE session_id = p_session AND owner = p_owner;
    RETURN FOUND;
END;
$$;

-- 4. Indexes for lead scoring / review workstreams.
CREATE INDEX IF NOT EXISTS idx_diagnostics_classification ON diagnostics(classification);
CREATE INDEX IF NOT EXISTS idx_diagnostics_requires_human_review ON diagnostics(requires_human_review);
CREATE INDEX IF NOT EXISTS idx_leads_classification ON leads(classification);

-- 5. RLS on the new lock table (service_role bypasses, matching existing pattern).
ALTER TABLE discovery_locks ENABLE ROW LEVEL SECURITY;