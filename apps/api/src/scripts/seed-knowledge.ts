/**
 * Seeds `company_knowledge` — the RAG source of truth about Código Binário.
 *
 * The data itself lives in services/company-knowledge-seed.ts (pure, testable,
 * no DB dependency). This file is only the I/O: embed + upsert + verify.
 *
 * Idempotent: re-running re-embeds and upserts by content_hash, so editing an
 * entry refreshes its row instead of duplicating it.
 *
 * Usage:
 *   pnpm --filter=@binary-code/api exec tsx src/scripts/seed-knowledge.ts
 */

import 'dotenv/config';
import { supabase } from '@db/supabase';
import { embedText } from '../services/knowledge-base';
import { COMPANY_KNOWLEDGE_SEED, contentHash } from '../services/company-knowledge-seed';

async function main(): Promise<void> {
  const entries = COMPANY_KNOWLEDGE_SEED;
  console.log(`[Seed] Seeding ${entries.length} company_knowledge entries...`);

  // 1. Build rows with embeddings. A failed embedding does not abort the seed:
  //    the row is still inserted (visible to admins) but is not searchable, and
  //    the failure is reported in the final summary.
  const rows: Array<Record<string, unknown>> = [];
  let embeddingFailures = 0;

  for (const entry of entries) {
    const embedding = await embedText(entry.content);
    if (!embedding) {
      embeddingFailures++;
      console.warn(`[Seed] embedding FAILED for "${entry.title}" — inserting without vector (not searchable).`);
    }
    rows.push({
      category: entry.category,
      title: entry.title,
      content: entry.content,
      source_url: entry.sourceUrl,
      tags: entry.tags,
      embedding,
      content_hash: contentHash(entry),
    });
  }

  // 2. Upsert idempotently.
  const { error } = await supabase
    .from('company_knowledge')
    .upsert(rows, { onConflict: 'content_hash' });

  if (error) {
    console.error(`[Seed] FAILED: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  // 3. Prune rows that are no longer part of the seed.
  //    Editing an entry changes its content_hash, so the upsert INSERTS a new
  //    row while the old one survives with stale text (e.g. a retired email
  //    address). Retrieval would then be able to serve the outdated fact, which
  //    is exactly what this table exists to prevent.
  const currentHashes = rows.map((r) => r.content_hash as string);
  const { data: existing, error: listError } = await supabase
    .from('company_knowledge')
    .select('id, content_hash');

  if (listError) {
    console.error(`[Seed] could not list existing rows: ${listError.message}`);
    process.exitCode = 1;
    return;
  }

  const stale = (existing || []).filter((r: any) => !currentHashes.includes(r.content_hash));
  if (stale.length > 0) {
    const { error: deleteError } = await supabase
      .from('company_knowledge')
      .delete()
      .in('id', stale.map((s: any) => s.id));
    if (deleteError) {
      console.error(`[Seed] prune failed: ${deleteError.message}`);
      process.exitCode = 1;
      return;
    }
    console.log(`[Seed] pruned ${stale.length} stale row(s) superseded by newer content.`);
  }

  // 4. Verify against the database (never trust the write alone).
  const { count, error: countError } = await supabase
    .from('company_knowledge')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error(`[Seed] verification failed: ${countError.message}`);
    process.exitCode = 1;
    return;
  }

  const { count: withEmbedding } = await supabase
    .from('company_knowledge')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null);

  console.log(
    `[Seed] DONE. rows_in_table=${count} rows_with_embedding=${withEmbedding} embedding_failures=${embeddingFailures}`
  );

  if (embeddingFailures > 0) {
    console.warn('[Seed] Some rows are not searchable — re-run once the embedding provider is reachable.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[Seed] unexpected failure:', error);
  process.exitCode = 1;
});
