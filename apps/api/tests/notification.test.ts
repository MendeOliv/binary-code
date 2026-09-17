import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  NotificationService,
  isValidEmail,
  escapeHtml,
  buildInternalText,
  buildClientConfirmationText,
  buildClientConfirmationHtml,
  buildPublicNextStep,
  type DiagnosticNotificationPayload,
  type ClientConfirmationPayload,
} from '../src/services/notification';
import { dispatchLeadNotifications } from '../src/services/notification-dispatch';

// ── Fixtures ──────────────────────────────────────────────────────────────

function makeInternalPayload(): DiagnosticNotificationPayload {
  return {
    diagnosticId: 'diag-abc',
    sessionId: 'sess-1',
    leadId: 'lead-9',
    problemIdentified: 'Processo manual causa atrasos',
    processAffected: 'Facturação',
    impactEstimated: 'Perda de eficiência',
    solutionRecommended: 'Automatizar',
    technologiesNeeded: ['React', 'Node'],
    complexity: 'medium',
    nextStep: 'consultation',
    confidence: 0.9,
    createdAt: '2026-01-01T10:00:00.000Z',
    score: 82,
    classification: 'HOT',
    priority: 'high',
    requiresHumanReview: true,
    onSiteRequired: true,
    assignedTo: 'fabio@codigobinario.it.ao',
    nextAction: 'Agendar consulta técnica',
    followUpAt: '2026-01-05T10:00:00.000Z',
    lead: { name: 'João Silva', email: 'joao@mail.com', phone: '+244923', company: 'AngoCorp' },
  };
}

function makeClientPayload(): ClientConfirmationPayload {
  return {
    name: 'João Silva',
    company: 'AngoCorp',
    problemSummary: 'Processo manual causa atrasos',
    nextStep: 'A nossa equipa irá contactá-lo para agendar uma consulta técnica.',
    email: 'joao@mail.com',
  };
}

/** Minimal valid LeadResponse-shaped object for the dispatch helper. */
function makeResultLead(overrides: Record<string, unknown> = {}): any {
  return {
    id: 'lead-9',
    diagnosticId: 'diag-abc',
    sessionId: 'sess-1',
    name: 'João Silva',
    email: 'joao@mail.com',
    phone: '+244923',
    company: 'AngoCorp',
    status: 'new',
    notes: null,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
    score: 82,
    priority: 'high',
    classification: 'HOT',
    requiresHumanReview: true,
    assignedTo: null,
    nextAction: 'Agendar consulta técnica',
    followUpAt: null,
    estimatedValue: null,
    onSiteRequired: true,
    ...overrides,
  };
}

function makeResultDiagnostic(): any {
  return {
    id: 'diag-abc',
    sessionId: 'sess-1',
    problemIdentified: 'Processo manual causa atrasos',
    processAffected: 'Facturação',
    impactEstimated: 'Perda de eficiência',
    solutionRecommended: 'Automatizar',
    technologiesNeeded: ['React'],
    complexity: 'medium',
    nextStep: 'consultation',
    confidence: 0.9,
    score: 82,
    classification: 'HOT',
    priority: 'high',
    requiresHumanReview: true,
    onSiteRequired: true,
  };
}

// ── A) Diagnóstico sem Lead NÃO dispara email comercial parcial ──────────

test('A — discovery orchestrator no longer fires a partial internal notification', () => {
  // Tests run from apps/api; fall back to repo-relative in case cwd differs.
  const candidates = [
    join(process.cwd(), 'src/services/discovery-orchestrator.ts'),
    join(process.cwd(), 'apps/api/src/services/discovery-orchestrator.ts'),
  ];
  const found = candidates.find((p) => {
    try { readFileSync(p); return true; } catch { return false; }
  });
  assert.ok(found, 'discovery-orchestrator source not found');
  const src = readFileSync(found!, 'utf-8');
  assert.ok(
    !src.includes('notifyNewDiagnostic'),
    'discovery-orchestrator must not call notifyNewDiagnostic before a lead exists'
  );
  assert.ok(!src.includes("notificationService'"), 'notificationService import removed');
});

test('A2 — internal email without a lead is never dispatched by the lead handler (created gate)', () => {
  const calls: string[] = [];
  const buses = {
    notifyNewDiagnostic: async () => { calls.push('internal'); },
    sendClientConfirmation: async () => { calls.push('client'); },
  };
  dispatchLeadNotifications({ lead: makeResultLead(), diagnostic: null, created: false }, buses as any);
  assert.deepEqual(calls, [], 'no notification when lead was not newly created');
});

// ── B) Lead criado → EXACTLY ONE internal notification + one client conf. ─

test('B — new lead fires exactly one internal target notification + one client confirmation', () => {
  const internalCalls: DiagnosticNotificationPayload[] = [];
  const clientCalls: ClientConfirmationPayload[] = [];
  const buses = {
    notifyNewDiagnostic: async (p: DiagnosticNotificationPayload) => { internalCalls.push(p); },
    sendClientConfirmation: async (p: ClientConfirmationPayload) => { clientCalls.push(p); },
  };

  dispatchLeadNotifications(
    { lead: makeResultLead(), diagnostic: makeResultDiagnostic(), created: true },
    buses as any
  );

  assert.equal(internalCalls.length, 1, 'exactly one internal notification');
  assert.equal(clientCalls.length, 1, 'exactly one client confirmation');
  assert.equal(internalCalls[0].leadId, 'lead-9');
});

// ── H) Retries não produzem duplicação ───────────────────────────────────

test('H — idempotent retry (created=false) sends nothing as well', () => {
  let internal = 0;
  let client = 0;
  const buses = {
    notifyNewDiagnostic: async () => { internal++; },
    sendClientConfirmation: async () => { client++; },
  };
  // Same lead returned on retry, created=false — no new emails.
  dispatchLeadNotifications({ lead: makeResultLead(), diagnostic: makeResultDiagnostic(), created: false }, buses as any);
  dispatchLeadNotifications({ lead: makeResultLead(), diagnostic: makeResultDiagnostic(), created: false }, buses as any);
  assert.equal(internal, 0);
  assert.equal(client, 0);
});

// ── E) Email interno contém Nome + Email + Telefone + Empresa ─────────────

test('E — internal email includes lead name/email/phone/company and Lead ID', () => {
  const text = buildInternalText(makeInternalPayload());
  assert.match(text, /Nome: João Silva/);
  assert.match(text, /Email: joao@mail\.com/);
  assert.match(text, /Telefone: \+244923/);
  assert.match(text, /Empresa: AngoCorp/);
  assert.match(text, /Lead ID: lead-9/);
});

test('E2 — 25.000 Kz price only appears when on_site_required=true', () => {
  const on = buildInternalText(makeInternalPayload()); // onSiteRequired true
  assert.match(on, /25\.000 Kz/);
  const off = buildInternalText({ ...makeInternalPayload(), onSiteRequired: false });
  assert.ok(!off.includes('25.000 Kz'), 'price must not appear without on-site');
});

// ── F) Email do cliente NÃO expõe dados internos ─────────────────────────

test('F — client email never contains score/classification/priority/human-review', () => {
  for (const body of [buildClientConfirmationText(makeClientPayload()), buildClientConfirmationHtml(makeClientPayload())]) {
    assert.ok(!/SCORE|PRIORIDADE/i.test(body), 'no score/priority');
    assert.ok(!/WARM|HOT|COLD|QUALIFIED/i.test(body), 'no classification');
    assert.ok(!/REVISÃO|REVISAO/i.test(body), 'no human review');
    assert.ok(!/assignedTo|seguimento|follow-?up/i.test(body), 'no CRM internal fields');
  }
});

test('F2 — client email contains the public summary + company + name', () => {
  const text = buildClientConfirmationText(makeClientPayload());
  assert.match(text, /João Silva/);
  assert.match(text, /Empresa: AngoCorp/);
  assert.match(text, /Solicitação: Processo manual causa atrasos/);
  assert.match(text, /Próximo passo: A nossa equipa irá contactá-lo/);
});

// ── C) Lead com email válido → confirmação ao cliente ────────────────────

test('C — client confirmation transports email to the client address with HTML', async () => {
  const original = { p: process.env.NOTIFICATION_PROVIDER, k: process.env.RESEND_API_KEY, f: process.env.NOTIFICATION_EMAIL_FROM };
  process.env.NOTIFICATION_PROVIDER = 'resend';
  process.env.RESEND_API_KEY = 're_test';
  process.env.NOTIFICATION_EMAIL_FROM = 'Código Binário <no-reply@codigobinario.it.ao>';
  try {
    const sent: any[] = [];
    const svc = new NotificationService(async (opts) => { sent.push(opts); return { delivered: true, provider: 'resend' }; });
    const res = await svc.sendClientConfirmation(makeClientPayload());
    assert.equal(res.delivered, true);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to[0], 'joao@mail.com');
    assert.ok(sent[0].html.includes('<!DOCTYPE html>'), 'HTML body present');
    assert.ok(sent[0].text.includes('Recebemos a sua requisição'));
  } finally {
    process.env.NOTIFICATION_PROVIDER = original.p;
    process.env.RESEND_API_KEY = original.k;
    process.env.NOTIFICATION_EMAIL_FROM = original.f;
  }
});

// ── D) Lead sem email → NÃO dispara confirmação ao cliente ───────────────

test('D — missing client email does not send a confirmation', async () => {
  const original = { p: process.env.NOTIFICATION_PROVIDER, k: process.env.RESEND_API_KEY, f: process.env.NOTIFICATION_EMAIL_FROM };
  process.env.NOTIFICATION_PROVIDER = 'resend';
  process.env.RESEND_API_KEY = 're_test';
  process.env.NOTIFICATION_EMAIL_FROM = 'Código Binário <no-reply@codigobinario.it.ao>';
  try {
    let sent = false;
    const svc = new NotificationService(async () => { sent = true; return { delivered: true, provider: 'resend' }; });
    const res = await svc.sendClientConfirmation({ ...makeClientPayload(), email: undefined });
    assert.equal(sent, false, 'transport not called');
    assert.equal(res.delivered, false);
    const bad = await svc.sendClientConfirmation({ ...makeClientPayload(), email: 'not-an-email' });
    assert.equal(bad.delivered, false);
    assert.equal(isValidEmail('not-an-email'), false);
  } finally {
    process.env.NOTIFICATION_PROVIDER = original.p;
    process.env.RESEND_API_KEY = original.k;
    process.env.NOTIFICATION_EMAIL_FROM = original.f;
  }
});

// ── G) Falha do Resend NÃO quebra POST /api/leads ────────────────────────

test('G — transport failure returns delivered=false and never throws', async () => {
  const original = { p: process.env.NOTIFICATION_PROVIDER, k: process.env.RESEND_API_KEY, f: process.env.NOTIFICATION_EMAIL_FROM };
  process.env.NOTIFICATION_PROVIDER = 'resend';
  process.env.RESEND_API_KEY = 're_test';
  process.env.NOTIFICATION_EMAIL_FROM = 'Código Binário <no-reply@codigobinario.it.ao>';
  try {
    const failing = new NotificationService(async () => { throw new Error('Resend API 500'); });
    const client = await failing.sendClientConfirmation(makeClientPayload());
    assert.equal(client.delivered, false);
    const internal = await failing.notifyNewDiagnostic(makeInternalPayload());
    assert.equal(internal.delivered, false);
    // dispatchLeadNotifications also swallows rejections (buses are .catch()'d)
    let outerError: unknown = null;
    const buses = {
      notifyNewDiagnostic: async () => { throw new Error('boom'); },
      sendClientConfirmation: async () => { throw new Error('boom'); },
    };
    try {
      dispatchLeadNotifications({ lead: makeResultLead(), diagnostic: makeResultDiagnostic(), created: true }, buses as any);
    } catch (e) { outerError = e; }
    assert.equal(outerError, null, 'dispatch must not throw on send failure');
  } finally {
    process.env.NOTIFICATION_PROVIDER = original.p;
    process.env.RESEND_API_KEY = original.k;
    process.env.NOTIFICATION_EMAIL_FROM = original.f;
  }
});

// ── Tarefa 4 — Sanitização / HTML injection ──────────────────────────────

test('T4 — escapeHtml neutralises HTML injection from client content', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script> \'onclick\''),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &#39;onclick&#39;'
  );
  const malware = { name: '<img src=x onerror=alert(1)>', company: '"></table><script>x</script>', problemSummary: '<b>', nextStep: '<i>', email: 'joao@mail.com' };
  const html = buildClientConfirmationHtml(malware);
  assert.ok(!html.includes('<script>'), 'no raw <script> tag');
  assert.ok(!html.includes('<img src=x'), 'no raw onerror img');
  assert.ok(html.includes('&lt;script&gt;'), 'script escaped');
});

// ── Validação simples de email ───────────────────────────────────────────

test('isValidEmail — accepts valid, rejects obvious malformed', () => {
  assert.equal(isValidEmail('joao@mail.com'), true);
  assert.equal(isValidEmail(' a@b.co '), true);
  assert.equal(isValidEmail(''), false);
  assert.equal(isValidEmail('joao'), false);
  assert.equal(isValidEmail('joao@'), false);
  assert.equal(isValidEmail(null), false);
});

// ── buildPublicNextStep — amigável e sem jargão interno ──────────────────

test('buildPublicNextStep — public wording, on-site maps to contact', () => {
  assert.match(buildPublicNextStep('budget'), /apresentar a proposta/);
  assert.match(buildPublicNextStep('consultation'), /agendar uma consulta técnica/);
  assert.match(buildPublicNextStep('analysis'), /analisar/);
  assert.match(buildPublicNextStep(null, true), /contactá-lo/i);
  assert.ok(!/score|classifica|prioridade/i.test(buildPublicNextStep('budget', false)));
});