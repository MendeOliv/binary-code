-- CB-SEC-C (Session Security): Discovery session ownership secret.
--
-- A sessionId alone must not be enough to resume someone else's Discovery
-- session. We store ONLY the SHA-256 hash of a 256-bit random secret that is
-- returned to the client once at creation; the raw secret is never persisted.
--
-- Nullable on purpose: existing rows keep NULL and are then rejected on resume
-- (fail closed) until a fresh session is started.

ALTER TABLE discovery_sessions
    ADD COLUMN IF NOT EXISTS secret_hash TEXT;
