-- Discovery Pipeline Schema for Código Binário
-- Adds: discovery_sessions, discovery_messages, diagnostics, leads

-- 1. Discovery Sessions (each conversation with a potential client)
CREATE TABLE IF NOT EXISTS discovery_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT DEFAULT 'active' NOT NULL, -- active, diagnosis_ready, completed, abandoned
    initial_problem TEXT NOT NULL,
    extracted_facts JSONB DEFAULT '{}'::jsonb, -- structured facts extracted during conversation
    complexity TEXT, -- simple, medium, complex, uncertain
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_discovery_sessions_updated_at BEFORE UPDATE ON discovery_sessions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. Discovery Messages (chat history for each session)
CREATE TABLE IF NOT EXISTS discovery_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES discovery_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Diagnostics (generated project briefs)
CREATE TABLE IF NOT EXISTS diagnostics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES discovery_sessions(id) ON DELETE CASCADE,
    problem_identified TEXT NOT NULL,
    process_affected TEXT,
    impact_estimated TEXT,
    solution_recommended TEXT,
    technologies_needed JSONB DEFAULT '[]'::jsonb,
    complexity TEXT NOT NULL, -- low, medium, high
    next_step TEXT NOT NULL, -- budget, consultation, analysis
    reasoning TEXT,
    confidence NUMERIC DEFAULT 0.8,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Leads (captured after diagnostic acceptance)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagnostic_id UUID REFERENCES diagnostics(id) ON DELETE SET NULL,
    session_id UUID REFERENCES discovery_sessions(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'new' NOT NULL, -- new, contacted, consultation, proposal, won, lost
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- --- INDEXES ---
CREATE INDEX IF NOT EXISTS idx_discovery_messages_session_id ON discovery_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_session_id ON diagnostics(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_diagnostic_id ON leads(diagnostic_id);
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_discovery_sessions_status ON discovery_sessions(status);

-- --- RLS ---
ALTER TABLE discovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
