import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DiagnosticEngine, VISIT_PRICE_KZ } from '../src/services/diagnostic-engine';
import type { DiagnosticAI } from '../src/lib/validation';

const engine = new DiagnosticEngine();

function makeDiag(overrides: Partial<DiagnosticAI> = {}): DiagnosticAI {
  return {
    problem_identified: 'Processo manual de faturação causa atrasos de dias na emissão',
    process_affected: 'Facturação',
    impact_estimated: 'Perda de eficiência no fecho mensal',
    solution_recommended: 'Automatizar com app web + API',
    technologies_needed: ['React', 'Supabase'],
    complexity: 'medium',
    next_step: 'consultation',
    reasoning: 'Análise técnica',
    confidence: 0.85,
    technical_direction: 'Backend + API',
    architecture_direction: 'Frontend → API → DB',
    implementation_considerations: undefined,
    risks: [],
    opportunities: [],
    client_stated_facts: ['O cliente disse: faturação manual'],
    technical_inferences: ['Sistema legado assume-se'],
    on_site_required: false,
    requires_human_review: false,
    ...overrides,
  };
}

test('computeScore — rich case scores HOT', () => {
  const facts = { urgency: 'alta', budget: 'tem orçamento' };
  const r = engine.computeScore(makeDiag(), { extractedFacts: facts });
  assert.equal(r.classification, 'HOT');
  assert.ok(r.score >= 80);
  assert.ok(r.score <= 100);
  assert.ok(r.scoreReasons.length > 0);
});

test('computeScore — minimal/missing context scores LOW/QUALIFIED not HOT', () => {
  const r = engine.computeScore(
    makeDiag({
      problem_identified: 'crash',
      complexity: 'low',
      next_step: 'analysis',
      confidence: 0.2,
      solution_recommended: undefined,
      technologies_needed: [],
      technical_direction: undefined,
    }),
    { extractedFacts: {} }
  );
  assert.notEqual(r.classification, 'HOT');
  assert.ok(r.score < 60);
});

test('computeScore — budget never assumed when not client-provided', () => {
  const noBudget = engine.computeScore(makeDiag(), { extractedFacts: {} });
  const withBudget = engine.computeScore(makeDiag(), { extractedFacts: { budget: 'disponível' } });
  assert.ok(withBudget.score > noBudget.score, 'budget should only add points when client provided');
});

test('decideHumanReview — true for high complexity / low confidence / analysis / no facts', () => {
  assert.equal(engine.decideHumanReview(makeDiag({ complexity: 'high' }), { extractedFacts: {} }), true);
  assert.equal(engine.decideHumanReview(makeDiag({ confidence: 0.3 }), { extractedFacts: {} }), true);
  assert.equal(engine.decideHumanReview(makeDiag({ next_step: 'analysis' }), { extractedFacts: {} }), true);
  assert.equal(
    engine.decideHumanReview(makeDiag({ client_stated_facts: [] }), { extractedFacts: {} }),
    true
  );
  // AI-flagged review is honored (AI recommends, backend decides).
  assert.equal(
    engine.decideHumanReview(makeDiag({ requires_human_review: true }), { extractedFacts: {} }),
    true
  );
});

test('decideHumanReview — false for clean case', () => {
  const d = makeDiag({ client_stated_facts: ['fact'] });
  assert.equal(engine.decideHumanReview(d, { extractedFacts: {} }), false);
});

test('computeOnSite — only when AI recommends AND complexity not low', () => {
  assert.equal(engine.computeOnSite(makeDiag({ on_site_required: true, complexity: 'high' })), true);
  assert.equal(engine.computeOnSite(makeDiag({ on_site_required: true, complexity: 'low' })), false);
  assert.equal(engine.computeOnSite(makeDiag({ on_site_required: false })), false);
});

test('formatReport — no visit price when on-site not required', () => {
  const report = engine.formatReport(makeDiag(), engine.computeScore(makeDiag(), { extractedFacts: {} }), false);
  assert.ok(report.includes('DIAGNÓSTICO'));
  assert.ok(!report.includes(VISIT_PRICE_KZ), 'visit price must NOT appear without on-site');
});

test('formatReport — visit price only at the end when on-site required', () => {
  const diag = makeDiag({ on_site_required: true, complexity: 'high' });
  const report = engine.formatReport(diag, engine.computeScore(diag, { extractedFacts: {} }), true);
  assert.ok(report.includes(VISIT_PRICE_KZ), 'visit price should appear when on-site required');
  assert.ok(report.indexOf(VISIT_PRICE_KZ) > report.indexOf('visita técnica presencial recomendada'.toLowerCase()) - 200);
});

test('formatReport — separates client facts from technical inferences', () => {
  const report = engine.formatReport(makeDiag(), engine.computeScore(makeDiag(), { extractedFacts: {} }), false);
  assert.ok(report.includes('Factos fornecidos pelo cliente'));
  assert.ok(report.includes('Inferências técnicas'));
});