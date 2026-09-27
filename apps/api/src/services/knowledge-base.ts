import { repo } from '@db/repository';
import {
  normalize,
  formatKnowledgeContext,
  shouldSearchKnowledge,
  DEFAULT_MATCH_COUNT,
  DEFAULT_MATCH_THRESHOLD,
  EMBEDDING_DIMENSION,
  type CompanyKnowledgeMatch,
  type KnowledgeContextResult,
} from '../lib/company-knowledge';

/**
 * Company Knowledge Base — retrieval I/O layer (RAG) for Código Binário.
 *
 * WHY THIS EXISTS
 * The diagnostic interview previously had NO stored knowledge about Código
 * Binário itself. Any question such as "Quem é o Código Binário?" was answered
 * by model improvisation, which risks inventing facts (clients, prices,
 * certifications). This service grounds such answers in rows of
 * `company_knowledge`, each traceable to a real source.
 *
 * DESIGN PRINCIPLES
 * 1. NEVER block the diagnostic. Embedding/retrieval failures degrade to "no
 *    knowledge context" — the interview keeps working.
 * 2. Precision over recall in the router (see lib/company-knowledge.ts).
 * 3. No invented facts: the prompt is told to use ONLY the retrieved block.
 *
 * The pure logic (router, formatting, constants) lives in lib/company-knowledge.ts
 * so it can be unit-tested without a database or network.
 */

/** Gemini embedding model. Verified reachable (embedContent returns 1536 dims). */
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

const EMBEDDING_TIMEOUT_MS = Number(process.env.EMBEDDING_TIMEOUT_MS) || 15_000;

/** Small query-result cache: avoids paying an embedding call for a repeated question. */
const CACHE_TTL_MS = 5 * 60_000;
const CACHE_MAX_ENTRIES = 100;
const cache = new Map<string, { at: number; value: KnowledgeContextResult }>();

/**
 * Embeds a single text with Gemini `gemini-embedding-001` at 1536 dimensions.
 *
 * Uses the REST endpoint directly (same approach as the NVIDIA provider call)
 * so no extra SDK dependency is required. Returns null on ANY failure — the
 * caller treats "no embedding" as "no knowledge context", never as an error.
 */
export async function embedText(text: string): Promise<number[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Knowledge] GEMINI_API_KEY absent — semantic retrieval disabled.');
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`;

  try {
    const response = await fetch(`${url}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        outputDimensionality: EMBEDDING_DIMENSION,
      }),
      signal: AbortSignal.timeout(EMBEDDING_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(`[Knowledge] embedding HTTP ${response.status} — semantic retrieval disabled for this turn.`);
      return null;
    }

    const data: any = await response.json();
    const values: unknown = data?.embedding?.values;
    if (!Array.isArray(values) || values.length !== EMBEDDING_DIMENSION) {
      console.warn(
        `[Knowledge] embedding dimension mismatch (got ${Array.isArray(values) ? values.length : 'none'}, expected ${EMBEDDING_DIMENSION}).`
      );
      return null;
    }
    return values as number[];
  } catch (error: any) {
    console.warn(`[Knowledge] embedding request failed (${error?.message}) — semantic retrieval disabled for this turn.`);
    return null;
  }
}

/**
 * Full retrieval entry point used by the orchestrator.
 *
 * Returns an empty context (never throws) when:
 *  - the router says the message is not a company question, or
 *  - embeddings are unavailable, or
 *  - no chunk clears the similarity threshold.
 */
export async function getKnowledgeContext(
  message: string,
  options: { matchCount?: number; threshold?: number; bypassRouter?: boolean } = {}
): Promise<KnowledgeContextResult> {
  const {
    matchCount = DEFAULT_MATCH_COUNT,
    threshold = DEFAULT_MATCH_THRESHOLD,
    bypassRouter = false,
  } = options;

  if (process.env.COMPANY_KNOWLEDGE_ENABLED === 'false') {
    return { context: '', matches: [], reason: 'disabled', query: message };
  }

  if (!bypassRouter && !shouldSearchKnowledge(message)) {
    return { context: '', matches: [], reason: 'not_company_question', query: message };
  }

  const cacheKey = `${normalize(message)}|${matchCount}|${threshold}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return { ...hit.value, reason: 'cached' };
  }

  const embedding = await embedText(message);
  if (!embedding) {
    return { context: '', matches: [], reason: 'embedding_failed', query: message };
  }

  let matches: CompanyKnowledgeMatch[] = [];
  try {
    matches = await repo.searchCompanyKnowledge(embedding, message, matchCount, threshold);
  } catch (error: any) {
    console.warn(`[Knowledge] retrieval failed (${error?.message}) — continuing without knowledge context.`);
    matches = [];
  }

  const result: KnowledgeContextResult = {
    context: formatKnowledgeContext(matches),
    matches,
    reason: matches.length > 0 ? 'ok' : 'no_matches',
    query: message,
  };

  if (cache.size >= CACHE_MAX_ENTRIES) cache.clear();
  cache.set(cacheKey, { at: Date.now(), value: result });

  return result;
}

/** Test/maintenance helper. */
export function clearKnowledgeCache(): void {
  cache.clear();
}

// Re-exported so consumers have a single knowledge entry point.
export {
  shouldSearchKnowledge,
  formatKnowledgeContext,
  normalize,
  EMBEDDING_DIMENSION,
} from '../lib/company-knowledge';
