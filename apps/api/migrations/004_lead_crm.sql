-- Mini CRM + Human Handoff — FASE 4/5/6 (Hermes)
-- Extends leads with CRM/handoff fields and adds lead_activities audit trail.
-- Backward compatible (additive). Preserves all existing data.

-- 1. Extend leads (Mini CRM / Human Handoff)
ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS assigned_to TEXT,
    ADD COLUMN IF NOT EXISTS next_action TEXT,
    ADD COLUMN IF NOT EXISTS follow_up_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS estimated_value NUMERIC,
    ADD COLUMN IF NOT EXISTS on_site_required BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. Lead Activities (audit trail / history)
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- note, call, email, meeting, status_change, assignment, follow_up, diagnostic_review, lead_created
    description TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Idempotency: one lead per session (multiple NULL sessions are fine).
CREATE UNIQUE INDEX IF NOT EXISTS uq_leads_session_id ON leads(session_id)
    WHERE session_id IS NOT NULL;

-- 4. CRM indexes
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_at ON leads(follow_up_at);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_on_site_required ON leads(on_site_required);

-- 5. RLS (backend uses service_role which bypasses; still never assume public)
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;