import { randomUUID } from 'node:crypto';
import { repo } from '@db/repository';
import { aiProvider } from './ai-provider';
import { diagnosticEngine } from './diagnostic-engine';
import {
  DIAGNOSIS_GENERATION_PROMPT,
  buildDiscoveryUserPrompt,
  buildDiscoverySystemPrompt,
  buildDiagnosisPrompt,
} from './prompts';
import { getKnowledgeContext } from './knowledge-base';
import type {
  DiscoverySessionResponse,
  DiagnosticResponse,
  DiscoveryChatResponse,
} from '@shared/models';
import type { DiagnosticAI } from '../lib/validation';
import { parseDiagnostic } from '../lib/validation';
import { generateSessionSecret, hashSessionSecret, verifySessionSecret } from '../lib/session-secret';

/** Raised when another request is already processing this session. */
export class SessionBusyError extends Error {
  constructor(sessionId: string) {
    super(`processing_in_progress:${sessionId}`);
    this.name = 'SessionBusyError';
  }
}

/** Raised when a client references a discovery session that does not exist. */
export class SessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`Session ${sessionId} not found`);
    this.name = 'SessionNotFoundError';
  }
}

/**
 * Raised when a session is resumed without the correct ownership secret
 * (CB-SEC-C). Knowing/guessing the sessionId is deliberately not enough.
 */
export class SessionAccessDeniedError extends Error {
  constructor(sessionId: string) {
    super(`access_denied:${sessionId}`);
    this.name = 'SessionAccessDeniedError';
  }
}

// In-memory fallback lock (single instance / before migration RPC exists).
const memoryLocks = new Map<string, { owner: string; until: number }>();

export class DiscoveryOrchestrator {
  /** Minimum number of user messages before we attempt diagnosis. */
  private readonly MIN_MESSAGES_FOR_DIAGNOSIS = 3;

  /** Maximum messages before we force a diagnosis (avoid infinite interview). */
  private readonly MAX_MESSAGES_BEFORE_DIAGNOSIS = 8;

  /** Lock TTL — must comfortably exceed the longest AI call (seconds). */
  private readonly LOCK_TTL_SECONDS = 120;

  /** Max AI retries when the returned JSON cannot be validated. */
  private readonly MAX_DIAGNOSIS_RETRIES = 1;

  /**
   * Cost-abuse bounds (CB-SEC-E): the history sent to the provider is capped in
   * both message count and characters, so a long/flooded session cannot amplify
   * provider cost or blow up the context.
   */
  private readonly MAX_HISTORY_MESSAGES = 20;
  private readonly MAX_HISTORY_CHARS = 12000;

  async handleMessage(
    userMessage: string,
    sessionId?: string,
    sessionSecret?: string
  ): Promise<DiscoveryChatResponse> {
    // 1. Get or create session (with ownership-secret enforcement on resume).
    let session: DiscoverySessionResponse;
    let issuedSecret: string | undefined;
    if (sessionId) {
          const existing = await repo.getDiscoverySession(sessionId);
          if (!existing) {
            throw new SessionNotFoundError(sessionId);
          }
          // CB-SEC-C: a sessionId alone must not grant access. Require the
          // high-entropy secret issued at creation and verify it in constant
          // time against the stored hash (fail closed when either is absent).
          const storedHash = await repo.getDiscoverySessionSecretHash(sessionId);
          if (!verifySessionSecret(sessionSecret, storedHash)) {
            throw new SessionAccessDeniedError(sessionId);
          }
          session = existing;
    } else {
      issuedSecret = generateSessionSecret();
      session = await repo.createDiscoverySession({
        initialProblem: userMessage,
        secretHash: hashSessionSecret(issuedSecret),
      });
    }

    // 2. Acquire per-session lock (DB-backed, memory fallback).
    const owner = randomUUID();
    const lockAcquired = await this.acquireLock(session.id, owner);
    if (!lockAcquired) {
      throw new SessionBusyError(session.id);
    }
    try {
      const result = await this.processLocked(userMessage, session);
      // Return the ownership secret ONLY on the response that created the
      // session, and never again.
      if (issuedSecret) result.sessionSecret = issuedSecret;
      return result;
    } finally {
      await this.releaseLock(session.id, owner);
    }
  }

  private async processLocked(
    userMessage: string,
    session: DiscoverySessionResponse
  ): Promise<DiscoveryChatResponse> {
    // Save user message
    await repo.createDiscoveryMessage({
      sessionId: session.id,
      role: 'user',
      content: userMessage,
    });

    // Load conversation history (bounded before it reaches the provider).
    const messages = await repo.listDiscoveryMessages(session.id);
    const conversationHistory: Array<{ role: string; content: string }> = this.limitHistory(
      messages.map(m => ({
        role: m.role,
        content: m.content,
      }))
    );

    // Check if we should generate diagnosis
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    const shouldDiagnose =
      userMessageCount >= this.MAX_MESSAGES_BEFORE_DIAGNOSIS ||
      (userMessageCount >= this.MIN_MESSAGES_FOR_DIAGNOSIS &&
        this.maybeEnoughInfo(session.extractedFacts));

    if (shouldDiagnose && session.status !== 'diagnosis_ready') {
      return this.generateDiagnosis(session, conversationHistory);
    }

    // Generate next interview response
    const startedAt = Date.now();

    // Ground company-directed questions in stored knowledge. Best-effort: a
    // failure or a non-company question yields an empty context and the
    // interview proceeds exactly as before.
    const knowledge = await getKnowledgeContext(userMessage);
    if (knowledge.reason === 'ok' || knowledge.reason === 'cached') {
      console.log(
        `[Discovery] knowledge_retrieved session=${session.id} reason=${knowledge.reason} matches=${knowledge.matches.length} top_similarity=${
          knowledge.matches[0]?.similarity?.toFixed(3) ?? 'n/a'
        }`
      );
    } else if (knowledge.reason !== 'not_company_question') {
      console.warn(`[Discovery] knowledge_skipped session=${session.id} reason=${knowledge.reason}`);
    }

    const ai = await aiProvider.generateSmart(
      buildDiscoverySystemPrompt(),
      buildDiscoveryUserPrompt(userMessage, conversationHistory, session.extractedFacts, knowledge.context),
      { jsonMode: false }
    );
    console.log(
      `[Discovery] interview session=${session.id} provider=${ai.providerUsed} duration_ms=${Date.now() - startedAt}`
    );

    // Extract new facts from AI response
    const newFacts = this.extractFactsFromResponse(ai.text);
    const updatedFacts = { ...session.extractedFacts, ...newFacts };

    // Save AI message (strip fact markers)
    const cleanResponse = this.stripFactMarkers(ai.text);
    await repo.createDiscoveryMessage({
      sessionId: session.id,
      role: 'assistant',
      content: cleanResponse,
    });

    // Update session with new facts
    await repo.updateDiscoverySession(session.id, { extractedFacts: updatedFacts });

    // Detect DIAGNOSTIC_READY marker
    const hasDiagnosticReady = ai.text.includes('[DIAGNOSTIC_READY]');
    if (hasDiagnosticReady && userMessageCount >= this.MIN_MESSAGES_FOR_DIAGNOSIS) {
      return this.generateDiagnosis(
        { ...session, extractedFacts: updatedFacts },
        [...conversationHistory, { role: 'assistant', content: cleanResponse }]
      );
    }

    return {
      response: cleanResponse,
      sessionId: session.id,
      phase: 'interview',
      extractedFacts: updatedFacts,
    };
  }

  /**
   * Generate a structured diagnostic from the conversation. The output is
   * validated with Zod. Invalid JSON is never persisted: it triggers a retry
   * through the next provider, and only a controlled "needs human review"
   * diagnostic is emitted as a last resort.
   */
  private async generateDiagnosis(
    session: DiscoverySessionResponse,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<DiscoveryChatResponse> {
    const startedAt = Date.now();
    const prompt = buildDiagnosisPrompt(conversationHistory, session.extractedFacts);

    let diag: DiagnosticAI | null = null;
    let providerUsed = 'none';
    let exhausted = false;

    for (let attempt = 0; attempt <= this.MAX_DIAGNOSIS_RETRIES; attempt++) {
      const excluded = attempt === 0 ? [] : [providerUsed];
      const ai = await aiProvider.generateSmart(
        DIAGNOSIS_GENERATION_PROMPT,
        prompt,
        { jsonMode: true, excludeProviders: excluded }
      );
      providerUsed = ai.providerUsed;
      diag = parseDiagnostic(ai.text);
      if (diag) break;
      console.warn(
        `[Discovery] invalid diagnostic JSON from ${ai.providerUsed}; ${attempt < this.MAX_DIAGNOSIS_RETRIES ? 'retrying next provider' : 'falling back to controlled review'}`
      );
    }

    if (!diag) {
      // Controlled fallback: never persist raw AI junk. Emit a structured
      // diagnosis that explicitly requires human review.
      const facts = session.extractedFacts || {};
            diag = {
          problem_identified:
            (facts.painPoint as string) ||
            `Análise não conclusiva — a IA não devolveu um diagnóstico estruturado para esta sessão.`,
          process_affected: undefined,
          impact_estimated: undefined,
          solution_recommended: undefined,
          technologies_needed: [],
          complexity: 'medium',
          next_step: 'analysis',
          reasoning: 'A IA devolveu JSON inválido após a cadeia de fallbacks.',
          confidence: 0.3,
          technical_direction: undefined,
          architecture_direction: undefined,
          implementation_considerations: undefined,
          risks: [],
          opportunities: [],
          client_stated_facts: [],
          technical_inferences: [],
          on_site_required: false,
          requires_human_review: true,
        };
        exhausted = true;
            }

            // Engine decides (never trusts raw AI numbers blindly).
    const score = diagnosticEngine.computeScore(diag, { extractedFacts: session.extractedFacts });
    const requiresHumanReview = diagnosticEngine.decideHumanReview(diag, { extractedFacts: session.extractedFacts });
    const onSiteRequired = diagnosticEngine.computeOnSite(diag);

    const diagnostic = await repo.createDiagnostic({
      sessionId: session.id,
      problemIdentified: diag.problem_identified,
      processAffected: diag.process_affected,
      impactEstimated: diag.impact_estimated,
      solutionRecommended: diag.solution_recommended,
      technologiesNeeded: diag.technologies_needed,
      complexity: diag.complexity,
      nextStep: diag.next_step,
      reasoning: diag.reasoning,
      confidence: diag.confidence,
      technicalDirection: diag.technical_direction ?? null,
      architectureDirection: diag.architecture_direction ?? null,
      implementationConsiderations: diag.implementation_considerations ?? null,
      risks: diag.risks,
      opportunities: diag.opportunities,
      score: score.score,
      scoreReasons: score.scoreReasons,
      priority: score.priority,
      classification: score.classification,
      requiresHumanReview,
      onSiteRequired,
    });

    // Update session status
    await repo.updateDiscoverySession(session.id, {
      status: 'diagnosis_ready',
      complexity: diag.complexity,
    });

    console.log(
      `[Discovery] diagnostic_generated session=${session.id} provider=${providerUsed} score=${score.score} class=${score.classification} human_review=${requiresHumanReview} on_site=${onSiteRequired} duration_ms=${Date.now() - startedAt}`
    );

    // NOTE: no internal notification here. Diagnosis alone is NOT enough client
    // info. The single, complete internal commercial email is sent only after
    // the Lead is created (see routes/leads.ts) to avoid partial duplicates.

    // Backend-gated report (25.000 Kz visit only when on_site_required).
    const presentationMessage = diagnosticEngine.formatReport(diag, score, onSiteRequired, requiresHumanReview);

    // Save the presentation as an assistant message
    await repo.createDiscoveryMessage({
      sessionId: session.id,
      role: 'assistant',
      content: presentationMessage,
    });

    return {
      response: presentationMessage,
      sessionId: session.id,
      phase: 'diagnosis',
      diagnostic,
      extractedFacts: session.extractedFacts,
    };
  }

  // ── Concurrency ─────────────────────────────────────────────────────────

  private async acquireLock(sessionId: string, owner: string): Promise<boolean> {
    const dbResult = await repo.acquireDiscoveryLock(sessionId, owner, this.LOCK_TTL_SECONDS);
    if (dbResult !== null) return dbResult;
    // Fallback: in-memory lease.
    const existing = memoryLocks.get(sessionId);
    const now = Date.now();
    if (existing && existing.until > now) return false;
    memoryLocks.set(sessionId, { owner, until: now + this.LOCK_TTL_SECONDS * 1000 });
    return true;
  }

  private async releaseLock(sessionId: string, owner: string): Promise<void> {
    try {
      await repo.releaseDiscoveryLock(sessionId, owner);
    } catch {
      /* best effort */
    }
    const existing = memoryLocks.get(sessionId);
    if (existing && existing.owner === owner) memoryLocks.delete(sessionId);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  /**
   * Extract facts from the AI's [FACTS:{...}] marker.
   */
  private extractFactsFromResponse(response: string): Record<string, any> {
    const match = response.match(/\[FACTS:\{(.+?)\}\]/);
    if (!match) return {};
    try {
      return JSON.parse(`{${match[1]}}`);
    } catch {
      return {};
    }
  }

  /**
   * Strip [FACTS:...] and [DIAGNOSTIC_READY] markers from AI response.
   */
  private stripFactMarkers(response: string): string {
    return response
      .replace(/\[FACTS:\{.*?\}\]/g, '')
      .replace(/\[DIAGNOSTIC_READY\]/g, '')
      .trim();
  }

  /**
   * Heuristic: do we have enough basic facts to attempt a diagnosis?
   */
  private maybeEnoughInfo(facts: Record<string, any>): boolean {
    const hasProblem = Boolean(facts.painPoint);
    const hasContext = Boolean(facts.currentProcess || facts.industry || facts.techStack);
    return hasProblem && hasContext;
  }

  /**
   * Keeps only the most recent messages within both a message-count and a
   * character budget, preserving chronological order. Extracted pure helper so
   * the cost-abuse bound is unit-testable.
   */
  boundHistory(history: Array<{ role: string; content: string }>): Array<{ role: string; content: string }> {
    const recent = history.slice(-this.MAX_HISTORY_MESSAGES);
    const out: Array<{ role: string; content: string }> = [];
    let chars = 0;
    for (let i = recent.length - 1; i >= 0; i -= 1) {
      const msg = recent[i];
      const len = msg.content.length;
      if (chars + len > this.MAX_HISTORY_CHARS && out.length > 0) break;
      chars += len;
      out.unshift(msg);
    }
    return out;
  }

  private limitHistory(history: Array<{ role: string; content: string }>): Array<{ role: string; content: string }> {
    return this.boundHistory(history);
  }
}

// Single global instance
export const discoveryOrchestrator = new DiscoveryOrchestrator();