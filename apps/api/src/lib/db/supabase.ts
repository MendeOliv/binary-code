import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Lightweight, READ-ONLY liveness probe for the Supabase connection.
 *
 * Used by the public `GET /health` heartbeat: an external cron (e.g. UptimeRobot
 * every ~14 min) hits `/health`, which in turn performs this single read so the
 * free-tier Supabase project stays warm and does not pause from inactivity.
 *
 * Guarantees:
 *   - READ ONLY: selects a single `id` with `limit(1)`; never inserts, updates
 *     or deletes, and never issues a COUNT.
 *   - No data leaves the process: the row (if any) is discarded here; only a
 *     boolean is returned, so nothing is exposed to the client.
 *   - Bounded: a short abort timeout caps the probe, so `/health` can never hang.
 *   - Fail-safe: any error or timeout resolves to `false` instead of throwing.
 *
 * `projects` is the base table created by the initial migration
 * (001_init.sql), so it is guaranteed to exist in every deployed schema, and
 * the app already uses it as its connectivity probe in `GET /test-db`.
 */
export async function pingSupabase(timeoutMs = 1500): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .select('id')
      .limit(1)
      .abortSignal(AbortSignal.timeout(timeoutMs));
    return !error;
  } catch {
    return false;
  }
}

export default supabase;