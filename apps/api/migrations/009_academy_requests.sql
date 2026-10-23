-- Código Binário Academy — additive extension of the existing lead CRM.
-- No existing diagnostic lead semantics are changed.
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'diagnostic',
  ADD COLUMN IF NOT EXISTS academy_course_id TEXT,
  ADD COLUMN IF NOT EXISTS request_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS uq_leads_request_id ON leads(request_id)
  WHERE request_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_academy_course_id ON leads(academy_course_id);
