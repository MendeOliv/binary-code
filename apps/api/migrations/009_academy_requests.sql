-- Código Binário Academy — additive extension of the existing lead CRM.
-- No existing diagnostic lead semantics are changed.
--
-- This migration is the versioned DDL for the Academy persistence contract in
-- apps/api/src/lib/db/repository.ts -> createAcademyLead(), which writes
-- (request_id, source, academy_course_id, name, email, phone, notes) into
-- `leads` and relies on an upsert with
--     onConflict: 'request_id' + ignoreDuplicates: true
-- i.e. the SQL statement INSERT ... ON CONFLICT (request_id) DO NOTHING.
--
-- PostgreSQL — the request_id index must NOT be partial:
--   A PARTIAL unique index (… WHERE request_id IS NOT NULL) cannot serve as the
--   arbiter of `ON CONFLICT (request_id)`: an INSERT without a WHERE clause does
--   not imply the index predicate, so PostgreSQL raises
--     42P10 there is no unique or exclusion constraint matching the
--          ON CONFLICT specification
--   and every Academy submission still fails even though the columns now exist.
--   A plain UNIQUE index is the correct shape: PostgreSQL treats NULLs as
--   distinct, so legacy/diagnostic leads with request_id IS NULL keep coexisting
--   freely, while Academy retries (same non-null request_id) are deduplicated.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'diagnostic',
  ADD COLUMN IF NOT EXISTS academy_course_id TEXT,
  ADD COLUMN IF NOT EXISTS request_id UUID;

CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_academy_course_id ON leads(academy_course_id);

-- Academy idempotency: at most one lead per request_id.
-- Re-created unconditionally so that an environment which already ran the
-- earlier partial definition is repaired instead of left broken.
DROP INDEX IF EXISTS uq_leads_request_id;
CREATE UNIQUE INDEX uq_leads_request_id ON leads(request_id);
