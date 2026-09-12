import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LeadService,
  isValidStatusTransition,
  deriveNextAction,
  LeadStatusTransitionError,
  LEAD_STATUSES,
} from '../src/services/lead-service';
import type {
  LeadRepositoryPort,
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
} from '../src/services/lead-service';
import type { DiagnosticResponse, LeadResponse, LeadUpdate } from '@shared/models';

function makeDiagnostic(overrides: Partial<DiagnosticResponse> = {}): DiagnosticResponse {
  return {
    id: 'diag-1',
    sessionId: 'sess-1',
    problemIdentified: 'Processo manual causa atrasos',
    processAffected: 'Facturação',
    impactEstimated: 'Perda de eficiência',
    solutionRecommended: 'Automatizar',
    technologiesNeeded: ['React'],
    complexity: 'medium',
    nextStep: 'consultation',
    reasoning: 'Análise',
    confidence: 0.9,
    createdAt: new Date().toISOString(),
    technicalDirection: 'API',
    architectureDirection: 'FE→API→DB',
    implementationConsiderations: null,
    risks: [],
    opportunities: [],
    score: 82,
    scoreReasons: ['Problema claro'],
    priority: 'high',
    classification: 'HOT',
    requiresHumanReview: true,
    onSiteRequired: true,
    ...overrides,
  };
}

function makeLead(overrides: Partial<LeadResponse> = {}): LeadResponse {
  return {
    id: 'lead-1',
    diagnosticId: 'diag-1',
    sessionId: 'sess-1',
    name: 'João',
    email: 'joao@mail.com',
    phone: '+2441',
    company: 'Empresa',
    status: 'new',
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    score: null,
    priority: null,
    classification: null,
    requiresHumanReview: null,
    assignedTo: null,
    nextAction: null,
    followUpAt: null,
    estimatedValue: null,
    onSiteRequired: null,
    ...overrides,
  };
}

/** In-memory fake repository implementing the lead service port. */
class FakeRepo implements LeadRepositoryPort {
  leads: LeadResponse[] = [];
  activities: any[] = [];
  diagnostics: DiagnosticResponse[] = [];

  async createLead(data: any): Promise<LeadResponse> {
    const lead = makeLead({ ...data, id: `lead-${this.leads.length + 1}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    this.leads.push(lead);
    return lead;
  }
  async getLead(id: string): Promise<LeadResponse | null> {
    return this.leads.find(l => l.id === id) ?? null;
  }
  async getLeadBySession(sessionId: string): Promise<LeadResponse | null> {
    return this.leads.find(l => l.sessionId === sessionId) ?? null;
  }
  async updateLead(id: string, data: LeadUpdate): Promise<LeadResponse | null> {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.leads[idx] = { ...this.leads[idx], ...data } as LeadResponse;
    return this.leads[idx];
  }
  async getDiagnosticBySession(sessionId: string): Promise<DiagnosticResponse | null> {
    return this.diagnostics.find(d => d.sessionId === sessionId) ?? null;
  }
  async createLeadActivity(data: any): Promise<any> {
    const a = { id: `act-${this.activities.length + 1}`, ...data, createdAt: new Date().toISOString() };
    this.activities.push(a);
    return a;
  }
  async listLeadActivities(leadId: string): Promise<any[]> {
    return this.activities.filter(a => a.leadId === leadId);
  }
}

// ── FASE 4 — Status transitions ───────────────────────────────────────────

test('Lead statuses — canonical set preserved', () => {
  assert.deepEqual([...LEAD_STATUSES], ['new', 'contacted', 'consultation', 'proposal', 'won', 'lost']);
});

test('isValidStatusTransition — happy path + forbidden', () => {
  assert.equal(isValidStatusTransition('new', 'contacted'), true);
  assert.equal(isValidStatusTransition('contacted', 'consultation'), true);
  assert.equal(isValidStatusTransition('consultation', 'proposal'), true);
  assert.equal(isValidStatusTransition('contacted', 'won'), true);
  // illegal
  assert.equal(isValidStatusTransition('new', 'proposal'), false);
  assert.equal(isValidStatusTransition('won', 'contacted'), false);
  assert.equal(isValidStatusTransition('lost', 'new'), false);
  // no-op
  assert.equal(isValidStatusTransition('won', 'won'), true);
});

// ── FASE 6 — Next action ──────────────────────────────────────────────────

test('deriveNextAction — on-site overrides, budget/consultation/analysis map', () => {
  assert.equal(deriveNextAction(makeDiagnostic({ onSiteRequired: true })), 'Fazer visita técnica');
  assert.ok(deriveNextAction(makeDiagnostic({ onSiteRequired: false, nextStep: 'budget' })).includes('orçamento'));
  assert.ok(deriveNextAction(makeDiagnostic({ onSiteRequired: false, nextStep: 'consultation' })).includes('consulta'));
  assert.ok(deriveNextAction(makeDiagnostic({ onSiteRequired: false, nextStep: 'analysis' })).includes('Análise humana'));
});

// ── FASE 4/5/6 — createLeadFromDiscovery ──────────────────────────────────

test('createLeadFromDiscovery — creates, enriches from diagnostic, records activities', async () => {
  const fake = new FakeRepo();
  fake.diagnostics.push(makeDiagnostic());
  const svc = new LeadService(fake);

  const result = await svc.createLeadFromDiscovery({
    name: 'João',
    sessionId: 'sess-1',
    email: 'joao@mail.com',
  });

  assert.equal(result.created, true);
  assert.equal(result.lead.sessionId, 'sess-1');
  // Enriched from diagnostic
  assert.equal(result.lead.score, 82);
  assert.equal(result.lead.classification, 'HOT');
  assert.equal(result.lead.requiresHumanReview, true);
  assert.equal(result.lead.onSiteRequired, true);
  assert.equal(result.lead.nextAction, 'Fazer visita técnica');
  // Audit trail
  const types = fake.activities.map(a => a.type);
  assert.ok(types.includes('lead_created'));
  assert.ok(types.includes('diagnostic_review')); // review requested
  assert.ok(types.includes('follow_up'));          // on-site visit
});

test('createLeadFromDiscovery — idempotent: second submit returns existing lead', async () => {
  const fake = new FakeRepo();
  fake.diagnostics.push(makeDiagnostic());
  const svc = new LeadService(fake);

  const first = await svc.createLeadFromDiscovery({ name: 'João', sessionId: 'sess-1' });
  const second = await svc.createLeadFromDiscovery({ name: 'João', sessionId: 'sess-1' });

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(second.lead.id, first.lead.id);
  assert.equal(fake.leads.length, 1, 'only one lead created');
});

test('createLeadFromDiscovery — no diagnostic: still creates lead without score', async () => {
  const fake = new FakeRepo();
  const svc = new LeadService(fake);
  const result = await svc.createLeadFromDiscovery({ name: 'Maria', sessionId: 'sess-9' });
  assert.equal(result.created, true);
  assert.equal(result.diagnostic, null);
  assert.equal(result.lead.score, null);
});

// ── FASE 5 — updateLeadWithAudit ──────────────────────────────────────────

test('updateLeadWithAudit — valid status change records status_change activity', async () => {
  const fake = new FakeRepo();
  fake.leads.push(makeLead());
  const svc = new LeadService(fake);

  const updated = await svc.updateLeadWithAudit('lead-1', { status: 'contacted' });
  assert.equal(updated?.status, 'contacted');
  const types = fake.activities.map(a => a.type);
  assert.ok(types.includes('status_change'));
});

test('updateLeadWithAudit — invalid transition throws LeadStatusTransitionError', async () => {
  const fake = new FakeRepo();
  fake.leads.push(makeLead({ status: 'new' }));
  const svc = new LeadService(fake);

  await assert.rejects(
    () => svc.updateLeadWithAudit('lead-1', { status: 'proposal' }),
    LeadStatusTransitionError
  );
});

test('updateLeadWithAudit — assignment records assignment activity', async () => {
  const fake = new FakeRepo();
  fake.leads.push(makeLead());
  const svc = new LeadService(fake);

  await svc.updateLeadWithAudit('lead-1', { assignedTo: 'fabio@codigobinario.io' });
  const types = fake.activities.map(a => a.type);
  assert.ok(types.includes('assignment'));
});

test('updateLeadWithAudit — missing lead returns null', async () => {
  const fake = new FakeRepo();
  const svc = new LeadService(fake);
  assert.equal(await svc.updateLeadWithAudit('nope', { status: 'contacted' }), null);
});