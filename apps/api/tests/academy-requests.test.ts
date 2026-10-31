/**
 * POST /api/academy-requests — regression suite (Academy persistence contract).
 *
 * Why this file exists
 * --------------------
 * The Academy form returned HTTP 500 in production with
 *   PGRST204 — Could not find the 'academy_course_id' column of 'leads'
 * and the route had NO test coverage at all: nothing asserted which columns the
 * Academy persistence writes, so the drift between the payload and the deployed
 * schema went unnoticed until a real client hit the form.
 *
 * These tests drive the REAL Fastify route and the REAL Supabase repository and
 * interrupt only the outbound HTTP at the `fetch` boundary, so they are
 * hermetic (no network, no database) yet exercise the true code path:
 *   1. the exact write contract against `leads`;
 *   2. a database failure is a 500 and sends NO notification (never a
 *      misleading confirmation of a request that was not persisted);
 *   3. an idempotent retry is a 200 and sends nothing (no duplicate lead,
 *      no duplicate email);
 *   4. an email failure never creates a second lead;
 *   5. every column the code writes is declared by a versioned migration.
 *
 * The complementary *live-schema* guard (does the deployed database actually
 * have those columns?) lives in `academy-schema-guard.test.ts`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Fastify from 'fastify';

// ─────────────────────────────────────────────────────────────────────────────
// Environment MUST be set before the modules under test are imported: the
// Supabase client is built and the notification transport is resolved at module
// load time. `dotenv/config` (loaded by src/lib/db/supabase.ts) never overrides
// variables that are already present, so these values win.
// ─────────────────────────────────────────────────────────────────────────────
process.env.SUPABASE_URL = 'https://supabase.invalid';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.NOTIFICATION_PROVIDER = 'resend';
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.NOTIFICATION_EMAIL_FROM = 'Test <no-reply@example.invalid>';
process.env.NOTIFICATION_EMAIL_TO = 'team@example.invalid';
process.env.RATE_LIMIT_DISABLED = '1';
process.env.NODE_ENV = 'test';

const REQUEST_ID = '3f1a1e6e-6a1c-4f4c-9f3e-6f1e4a9d2b71';

/** Columns the Academy persistence writes to `leads` (the write contract). */
const ACADEMY_LEAD_COLUMNS = ['request_id', 'source', 'academy_course_id'] as const;
/** Columns shared with the diagnostic lead flow that the same insert writes. */
const SHARED_LEAD_COLUMNS = ['name', 'email', 'phone', 'notes'] as const;

const LEAD_ROW = {
  id: 'lead-1',
  diagnostic_id: null,
  session_id: null,
  name: 'Ana Silva',
  email: 'ana.silva@example.com',
  phone: '923000000',
  company: null,
  status: 'new',
  notes: 'Quero inscrever-me no curso de Forex Trading.',
  created_at: '2026-10-26T10:00:00.000Z',
  updated_at: '2026-10-26T10:00:00.000Z',
  score: null,
  priority: null,
  classification: null,
  requires_human_review: null,
  assigned_to: null,
  next_action: null,
  follow_up_at: null,
  estimated_value: null,
  on_site_required: null,
  source: 'academy',
  academy_course_id: 'forex-trading',
  request_id: REQUEST_ID,
};

const ACTIVITY_ROW = {
  id: 'activity-1',
  lead_id: 'lead-1',
  type: 'lead_created',
  description: 'Pedido de formação criado na Código Binário Academy',
  created_by: 'academy',
  created_at: '2026-10-26T10:00:00.000Z',
};

type Mode = 'ok' | 'missing-column' | 'duplicate' | 'email-fails';

interface RecordedCall {
  url: string;
  method: string;
  body: any;
  headers: Record<string, string>;
}

let mode: Mode = 'ok';
let calls: RecordedCall[] = [];

const LEADS_URL = '/rest/v1/leads';
const ACTIVITIES_URL = '/rest/v1/lead_activities';
const RESEND_URL = 'https://api.resend.com/emails';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** The exact error PostgREST returned in production. */
function pgrst204(column = 'academy_course_id'): Response {
  return json(
    {
      code: 'PGRST204',
      details: null,
      hint: null,
      message: `Could not find the '${column}' column of 'leads' in the schema cache`,
    },
    400
  );
}

function installFetchStub(): void {
  globalThis.fetch = (async (input: any, init: any = {}): Promise<Response> => {
    const url: string = typeof input === 'string' ? input : String(input?.url ?? input);
    const method: string = String(init?.method ?? 'GET').toUpperCase();
    let body: any = null;
    if (typeof init?.body === 'string') {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = init.body;
      }
    }
    // supabase-js passes a `Headers` instance, not a plain object: normalise it
    // (lower-cased keys) so the assertions can read Prefer/Accept reliably.
    const headerRecord: Record<string, string> = {};
    const rawHeaders = init?.headers;
    if (rawHeaders) {
      if (typeof (rawHeaders as Headers).forEach === 'function') {
        (rawHeaders as Headers).forEach((value, key) => {
          headerRecord[String(key).toLowerCase()] = String(value);
        });
      } else {
        for (const [key, value] of Object.entries(rawHeaders as Record<string, unknown>)) {
          headerRecord[key.toLowerCase()] = String(value);
        }
      }
    }
    calls.push({ url, method, body, headers: headerRecord });

    if (url.startsWith(RESEND_URL)) {
      return mode === 'email-fails' ? json({ message: 'provider down' }, 500) : json({ id: 'email-1' }, 200);
    }
    if (url.includes(LEADS_URL)) {
      if (method === 'POST') {
        if (mode === 'missing-column') return pgrst204();
        // `ignoreDuplicates` on an existing request_id → 201 with no row.
        if (mode === 'duplicate') return json([], 201);
        return json([LEAD_ROW], 201);
      }
      return json([LEAD_ROW], 200);
    }
    if (url.includes(ACTIVITIES_URL)) return json([ACTIVITY_ROW], 201);

    throw new Error(`unexpected outbound request in test: ${method} ${url}`);
  }) as typeof fetch;
}

function reset(next: Mode): void {
  mode = next;
  calls = [];
  installFetchStub();
}

const callsTo = (fragment: string): RecordedCall[] => calls.filter((c) => c.url.includes(fragment));
const leadInserts = (): RecordedCall[] => calls.filter((c) => c.method === 'POST' && c.url.includes(LEADS_URL));
const emailCalls = (): RecordedCall[] => calls.filter((c) => c.url.startsWith(RESEND_URL));

async function buildApp() {
  // Dynamic imports: the modules below read the environment and build the
  // Supabase client at load time, so the stub and env must be in place first.
  const { academyRequestRoutes } = await import('../src/routes/academy-requests');
  const app = Fastify();
  await app.register(academyRequestRoutes, { prefix: '/api/academy-requests' });
  await app.ready();
  return app;
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    requestId: REQUEST_ID,
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '923000000',
    courseId: 'forex-trading',
    message: 'Quero inscrever-me no curso de Forex Trading.',
    privacyAccepted: true,
    ...overrides,
  };
}

async function postAcademy(payload: unknown) {
  const app = await buildApp();
  const response = await app.inject({ method: 'POST', url: '/api/academy-requests', payload: payload as any });
  await app.close();
  return { status: response.statusCode, body: response.json() as any };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Happy path + write contract
// ─────────────────────────────────────────────────────────────────────────────

test('POST /api/academy-requests — persists the request and returns 201', async () => {
  reset('ok');
  const { status, body } = await postAcademy(validPayload());

  assert.equal(status, 201, 'a new academy request must be created');
  assert.equal(body.id, LEAD_ROW.id);
  assert.equal(body.source, 'academy');
  assert.equal(body.academyCourseId, 'forex-trading');
  assert.equal(body.requestId, REQUEST_ID);

  const inserts = leadInserts();
  assert.equal(inserts.length, 1, 'exactly one insert/upsert against leads');
  assert.deepEqual(
    inserts[0].body[0],
    {
      request_id: REQUEST_ID,
      source: 'academy',
      academy_course_id: 'forex-trading',
      name: 'Ana Silva',
      email: 'ana.silva@example.com',
      phone: '923000000',
      notes: 'Quero inscrever-me no curso de Forex Trading.',
    },
    'the exact columns written to leads — a rename here must be a conscious change'
  );
});

test('POST /api/academy-requests — idempotency is delegated to the request_id conflict target', async () => {
  reset('ok');
  await postAcademy(validPayload());

  const insert = leadInserts()[0];
  assert.equal(insert.url.includes('on_conflict=request_id'), true, 'upsert must conflict on request_id');
  assert.equal(
    String(insert.headers.prefer ?? '').includes('resolution=ignore-duplicates'),
    true,
    'duplicates must be ignored, never updated (an existing lead is preserved)'
  );
});

test('POST /api/academy-requests — records the lead_created activity only for a new request', async () => {
  reset('ok');
  await postAcademy(validPayload());

  const activities = callsTo(ACTIVITIES_URL);
  assert.equal(activities.length, 1);
  assert.equal(activities[0].method, 'POST');
  // PostgREST insert payloads are arrays.
  assert.equal(activities[0].body[0].type, 'lead_created');
  assert.equal(activities[0].body[0].created_by, 'academy');
});

test('POST /api/academy-requests — notifies the team and the client after persistence', async () => {
  reset('ok');
  await postAcademy(validPayload());

  const emails = emailCalls();
  assert.equal(emails.length, 2, 'one internal notification + one client confirmation');
  const recipients = emails.flatMap((c) => c.body.to as string[]);
  assert.equal(recipients.includes('ana.silva@example.com'), true, 'client confirmation goes to the client');
  assert.equal(recipients.includes('team@example.invalid'), true, 'internal notification goes to the team');
  assert.equal(
    emails.some((c) => String(c.body.subject).includes('Academy')),
    true,
    'the internal subject identifies an Academy request'
  );
});

test('POST /api/academy-requests — an omitted course is persisted without academy_course_id', async () => {
  reset('ok');
  const { status } = await postAcademy(validPayload({ courseId: undefined }));

  assert.equal(status, 201);
  const payload = leadInserts()[0].body[0];
  assert.equal('academy_course_id' in payload, false, 'an undefined course must not be sent');
  assert.equal(payload.source, 'academy');
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Database failure → 500, no misleading confirmation, no data written
//    (this is the production PGRST204 scenario)
// ─────────────────────────────────────────────────────────────────────────────

test('POST /api/academy-requests — a missing academy_course_id column is a 500, not a fake success', async () => {
  reset('missing-column');
  const { status, body } = await postAcademy(validPayload());

  assert.equal(status, 500, 'the PGRST204 schema error must surface as a server error');
  assert.deepEqual(body, { error: 'Internal server error' });
  assert.equal(body.id, undefined, 'no lead payload is returned when nothing was persisted');
});

test('POST /api/academy-requests — a failed persistence sends NO notification at all', async () => {
  reset('missing-column');
  await postAcademy(validPayload());

  assert.equal(emailCalls().length, 0, 'never confirm a request that was not stored');
  assert.equal(callsTo(ACTIVITIES_URL).length, 0, 'no audit trail for a lead that does not exist');
  assert.equal(leadInserts().length, 1, 'exactly one attempt, no retry loop');
});

test('POST /api/academy-requests — an email failure never creates a second lead', async () => {
  reset('email-fails');
  const { status } = await postAcademy(validPayload());

  assert.equal(status, 201, 'email is best-effort and must not change the API result');
  assert.equal(leadInserts().length, 1, 'exactly one lead, even when notifications fail');
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Idempotent retry → 200, nothing sent twice
// ─────────────────────────────────────────────────────────────────────────────

test('POST /api/academy-requests — a retried request returns 200 and sends nothing', async () => {
  reset('duplicate');
  const { status, body } = await postAcademy(validPayload());

  assert.equal(status, 200, 'an already-persisted request is not created twice');
  assert.equal(body.id, LEAD_ROW.id, 'the existing lead is returned');

  const lookups = callsTo(LEADS_URL).filter((c) => c.method === 'GET');
  assert.equal(lookups.length, 1, 'the existing row is looked up by request_id');
  assert.equal(lookups[0].url.includes(`request_id=eq.${REQUEST_ID}`), true);
  assert.equal(emailCalls().length, 0, 'a retry must not send duplicate emails');
  assert.equal(callsTo(ACTIVITIES_URL).length, 0, 'a retry must not duplicate the audit trail');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Validation — nothing reaches the database or the mail provider
// ─────────────────────────────────────────────────────────────────────────────

test('POST /api/academy-requests — an unknown course is rejected before any write', async () => {
  reset('ok');
  const { status, body } = await postAcademy(validPayload({ courseId: 'curso-inexistente' }));

  assert.equal(status, 400);
  assert.deepEqual(body, { error: 'Invalid academy course' });
  assert.equal(calls.length, 0, 'no database or email traffic for a rejected course');
});

test('POST /api/academy-requests — privacy consent and payload shape are enforced', async () => {
  reset('ok');
  const noConsent = await postAcademy(validPayload({ privacyAccepted: false }));
  assert.equal(noConsent.status, 400);
  assert.equal(noConsent.body.error, 'Privacy policy must be accepted');

  const badRequestId = await postAcademy(validPayload({ requestId: 'not-a-uuid' }));
  assert.equal(badRequestId.status, 400);
  assert.equal(badRequestId.body.error, 'Invalid requestId');

  const shortMessage = await postAcademy(validPayload({ message: 'curto' }));
  assert.equal(shortMessage.status, 400);

  assert.equal(calls.length, 0, 'invalid payloads never reach the database');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Hermetic drift guard: every column the code writes must be declared by a
//    versioned migration. (Whether the migration was APPLIED to the deployed
//    database is checked by academy-schema-guard.test.ts.)
// ─────────────────────────────────────────────────────────────────────────────

function declaredLeadColumns(): Set<string> {
  const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
  const columns = new Set<string>();
  for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8');

    const create = sql.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+leads\s*\(([\s\S]*?)\n\);/i);
    if (create) {
      for (const line of create[1].split('\n')) {
        const match = line.trim().match(/^([a-z_][a-z0-9_]*)\s+[a-z]/i);
        if (match) columns.add(match[1].toLowerCase());
      }
    }

    for (const alter of sql.matchAll(/ALTER TABLE\s+leads\b([\s\S]*?);/gi)) {
      for (const add of alter[1].matchAll(/ADD COLUMN(?:\s+IF NOT EXISTS)?\s+([a-z_][a-z0-9_]*)/gi)) {
        columns.add(add[1].toLowerCase());
      }
    }
  }
  return columns;
}

test('academy persistence — every written column is declared by a migration', () => {
  const declared = declaredLeadColumns();
  const written = [...ACADEMY_LEAD_COLUMNS, ...SHARED_LEAD_COLUMNS];
  const undeclared = written.filter((column) => !declared.has(column));

  assert.deepEqual(
    undeclared,
    [],
    `the code writes columns that no migration declares: ${undeclared.join(', ')}. ` +
      'Add a versioned migration before writing to them.'
  );
});

test('academy persistence — migration 009 declares the Academy columns and a NON-PARTIAL idempotency index', () => {
  const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
  const sql = readFileSync(join(migrationsDir, '009_academy_requests.sql'), 'utf8');

  for (const column of ACADEMY_LEAD_COLUMNS) {
    assert.equal(
      new RegExp(`ADD COLUMN IF NOT EXISTS\\s+${column}\\b`).test(sql),
      true,
      `009_academy_requests.sql must add ${column} idempotently`
    );
  }

  // The upsert uses `onConflict: 'request_id'`, so the arbiter index must be a
  // PLAIN unique index. A partial one (`WHERE request_id IS NOT NULL`) is not
  // inferrable by `ON CONFLICT (request_id) DO NOTHING` and PostgreSQL answers
  // 42P10 — reproduced on the live project with the existing partial index
  // uq_leads_session_id. This assertion is the guard against reintroducing it.
  const uniqueIndex = sql.match(/CREATE UNIQUE INDEX[^;]*;/i)?.[0] ?? '';
  assert.match(
    uniqueIndex,
    /ON\s+leads\s*\(\s*request_id\s*\)/i,
    'migration 009 must create a unique index on leads(request_id)'
  );
  assert.equal(
    /WHERE/i.test(uniqueIndex),
    false,
    'the request_id unique index must NOT be partial, or ON CONFLICT (request_id) fails with 42P10'
  );

  assert.equal(
    /DROP\s+(TABLE|COLUMN)\b|\bDELETE\b|\bTRUNCATE\b/i.test(sql),
    false,
    'the migration must never touch existing lead data'
  );
  assert.equal(
    /DROP INDEX IF EXISTS\s+uq_leads_request_id/i.test(sql),
    true,
    'the index is re-created unconditionally so an environment that ran the earlier partial definition is repaired'
  );
});
