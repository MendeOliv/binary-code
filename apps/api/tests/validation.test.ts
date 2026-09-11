import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DiscoveryChatInputSchema,
  LeadCreateInputSchema,
  DiagnosticAISchema,
  extractJsonObject,
  parseDiagnostic,
  validateInput,
  classifyScore,
} from '../src/lib/validation';

test('DiscoveryChatInputSchema — valid payload', () => {
  const r = DiscoveryChatInputSchema.safeParse({ message: '  Como automatizar o processo?  ' });
  assert.equal(r.success, true);
  if (r.success) assert.equal(r.data.message, 'Como automatizar o processo?');
});

test('DiscoveryChatInputSchema — rejects empty/whitespace message', () => {
  assert.equal(DiscoveryChatInputSchema.safeParse({ message: '   ' }).success, false);
  assert.equal(DiscoveryChatInputSchema.safeParse({ message: '' }).success, false);
});

test('DiscoveryChatInputSchema — rejects missing message and unknown keys', () => {
  assert.equal(DiscoveryChatInputSchema.safeParse({}).success, false);
  assert.equal(DiscoveryChatInputSchema.safeParse({ message: 'x', extra: 1 }).success, false);
});

test('DiscoveryChatInputSchema — rejects oversized message', () => {
  const huge = 'a'.repeat(4001);
  assert.equal(DiscoveryChatInputSchema.safeParse({ message: huge }).success, false);
});

test('DiscoveryChatInputSchema — accepts optional sessionId', () => {
  const r = DiscoveryChatInputSchema.safeParse({ message: 'hi', sessionId: 'abc-123' });
  assert.equal(r.success, true);
});

test('LeadCreateInputSchema — valid lead', () => {
  const r = LeadCreateInputSchema.safeParse({ name: '  João  ', email: 'joao@mail.com' });
  assert.equal(r.success, true);
  if (r.success) assert.equal(r.data.name, 'João');
});

test('LeadCreateInputSchema — rejects missing name / bad email', () => {
  assert.equal(LeadCreateInputSchema.safeParse({}).success, false);
  const bad = LeadCreateInputSchema.safeParse({ name: 'x', email: 'nope' });
  assert.equal(bad.success, false);
});

test('DiagnosticAISchema — validates full structured diagnostic', () => {
  const payload = {
    problem_identified: 'Processo manual causa atrasos',
    process_affected: 'Logística',
    impact_estimated: '2h/dia perdidas',
    solution_recommended: 'Automatizar com app web',
    technologies_needed: ['React', 'Supabase'],
    complexity: 'high',
    next_step: 'consultation',
    reasoning: 'Causa raiz identificada',
    confidence: 0.9,
    technical_direction: 'Backend + API',
    architecture_direction: 'Frontend → API → DB',
    risks: ['Risco A'],
    opportunities: ['Oportunidade B'],
    client_stated_facts: ['O cliente disse X'],
    technical_inferences: ['Inferência Y'],
    on_site_required: true,
    requires_human_review: false,
  };
  const r = DiagnosticAISchema.safeParse(payload);
  assert.equal(r.success, true);
  if (r.success) {
    assert.equal(r.data.complexity, 'high');
    assert.equal(r.data.on_site_required, true);
    assert.equal(r.data.technologies_needed.length, 2);
  }
});

test('DiagnosticAISchema — rejects invalid complexity/confidence', () => {
  assert.equal(
    DiagnosticAISchema.safeParse({ problem_identified: 'p', complexity: 'huge' }).success,
    false
  );
  assert.equal(
    DiagnosticAISchema.safeParse({ problem_identified: 'p', confidence: 2 }).success,
    false
  );
});

test('extractJsonObject — strips markdown fences and parses', () => {
  const raw = '```json\n{ "problem_identified": "x" }\n```';
  const obj = extractJsonObject(raw);
  assert.ok(obj);
  if (obj) assert.equal(JSON.parse(obj).problem_identified, 'x');
});

test('extractJsonObject — returns null for no JSON', () => {
  assert.equal(extractJsonObject('sem json aqui'), null);
  assert.equal(extractJsonObject(''), null);
});

test('parseDiagnostic — recovers object embedded in prose', () => {
  const d = parseDiagnostic('Aqui está: {"problem_identified":"ok","confidence":0.7} fim');
  assert.ok(d);
  if (d) assert.equal(d.problem_identified, 'ok');
});

test('validateInput — returns safe error string on failure', () => {
  const v = validateInput(DiscoveryChatInputSchema, { message: '' });
  assert.equal(v.ok, false);
  if (!v.ok) assert.equal(typeof v.error, 'string');
});

test('classifyScore — thresholds', () => {
  assert.equal(classifyScore(95), 'HOT');
  assert.equal(classifyScore(80), 'HOT');
  assert.equal(classifyScore(79), 'WARM');
  assert.equal(classifyScore(60), 'WARM');
  assert.equal(classifyScore(59), 'QUALIFIED');
  assert.equal(classifyScore(40), 'QUALIFIED');
  assert.equal(classifyScore(39), 'LOW');
});

test('Digestive default — missing optional fields get safe defaults', () => {
  const d = DiagnosticAISchema.safeParse({ problem_identified: 'p' });
  assert.equal(d.success, true);
  if (d.success) {
    assert.equal(d.data.complexity, 'medium');
    assert.equal(d.data.next_step, 'analysis');
    assert.equal(d.data.confidence, 0.5);
  }
});