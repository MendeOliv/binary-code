/**
 * Academy persistence — LIVE schema guard (read-only).
 *
 * Why this file exists
 * --------------------
 * The Academy form failed in production with
 *   PGRST204 — Could not find the 'academy_course_id' column of 'leads'
 * even though `apps/api/migrations/009_academy_requests.sql` was already in the
 * repository. The repository and the *deployed database* can drift: a migration
 * file that is committed but never applied leaves the code writing columns that
 * do not exist, and no source-level test can detect that.
 *
 * This guard closes that gap. It probes the SAME PostgREST endpoint the backend
 * uses at runtime (`select=<column>&limit=1`, exactly what `supabase-js` issues)
 * and fails when a column the Academy persistence depends on is absent.
 *
 * Read-only: it only issues bounded SELECTs. It never writes.
 * It also never fails for environmental reasons:
 *   - no credentials            → skipped (schema NOT verified)
 *   - Supabase unreachable      → skipped (schema NOT verified)
 *   - credentials rejected      → skipped (schema NOT verified)
 * Only a definitive database verdict (HTTP 400 "column … does not exist" /
 * PGRST204) produces a FAIL.
 *
 * Run it alone with:
 *   cd apps/api && npx tsx --test tests/academy-schema-guard.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import 'dotenv/config';

/** Columns the Academy persistence writes to `leads`. */
const ACADEMY_COLUMNS = ['source', 'academy_course_id', 'request_id'] as const;

/** Known-good column, used to prove credentials work before judging the schema. */
const SANITY_COLUMN = 'id';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface Probe {
  status: number;
  body: string;
}

async function probeColumn(column: string): Promise<Probe> {
  const response = await fetch(`${supabaseUrl}/rest/v1/leads?select=${column}&limit=1`, {
    headers: {
      apikey: serviceRoleKey as string,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    signal: AbortSignal.timeout(10_000),
  });
  return { status: response.status, body: await response.text() };
}

test('academy persistence — the deployed leads schema has every column the code writes', async (t) => {
  if (!supabaseUrl || !serviceRoleKey) {
    t.skip('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured — deployed schema NOT verified');
    return;
  }

  let sanity: Probe;
  const probes: Probe[] = [];
  try {
    sanity = await probeColumn(SANITY_COLUMN);
    for (const column of ACADEMY_COLUMNS) probes.push(await probeColumn(column));
  } catch (error) {
    t.skip(`Supabase unreachable (${(error as Error).message}) — deployed schema NOT verified`);
    return;
  }

  if (sanity.status !== 200) {
    t.skip(
      `Supabase rejected the probe (HTTP ${sanity.status} on '${SANITY_COLUMN}') — ` +
        'credentials/environment issue, deployed schema NOT verified'
    );
    return;
  }

  const indeterminate = probes
    .map((probe, index) => ({ probe, column: ACADEMY_COLUMNS[index] }))
    .filter(({ probe }) => probe.status !== 200 && probe.status !== 400);
  if (indeterminate.length > 0) {
    t.skip(
      `inconclusive probe for ${indeterminate.map((i) => i.column).join(', ')} ` +
        `(HTTP ${indeterminate.map((i) => i.probe.status).join(', ')}) — deployed schema NOT verified`
    );
    return;
  }

  const missing = probes
    .map((probe, index) => ({ probe, column: ACADEMY_COLUMNS[index] }))
    .filter(({ probe }) => probe.status === 400);

  const projectRef = String(supabaseUrl).replace(/^https:\/\/([^.]+).*$/, '$1');

  assert.deepEqual(
    missing.map((m) => m.column),
    [],
    'SCHEMA DRIFT: the deployed database does not match the code. ' +
      `Project ${projectRef} is missing ${missing.map((m) => `${m.column} (${m.probe.body})`).join(', ')}. ` +
      'Apply apps/api/migrations/009_academy_requests.sql (Supabase Dashboard → SQL Editor) and reload the ' +
      'PostgREST schema cache. Until then POST /api/academy-requests returns HTTP 500 (PGRST204) for every ' +
      'Academy submission, and nothing is ever persisted.'
  );
});
