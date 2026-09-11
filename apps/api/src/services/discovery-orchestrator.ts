import { randomUUID } from 'node:crypto';
import { repo } from '@db/repository';
import { aiProvider } from './ai-provider';
import { notificationService } from './notification';
import { diagnosticEngine } from './diagnostic-engine';
import {
  DISCOVERY_SYSTEM_PROMPT,
  DIAGNOSIS_GENERATION_PROMPT,
  buildDiscoveryUserPrompt,
  buildDiagnosisPrompt,
} from './prompts';
import type {
  DiscoverySessionResponse,
  DiagnosticResponse,
  DiscoveryChatResponse,
} from '@shared/models';
import type { DiagnosticAI } from '../lib/validation';
import { parseDiagnostic } from '../lib/validation';

/** Raised when another request is already processing this session. */
export class SessionBusyError extends Error {
  constructor(sessionId: string) {
    super(`processing_in_progress:${sessionId}`);
    this.name = 'SessionBusyError';
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

  async handleMessage(
    userMessage: string,
    sessionId?: string
  ): Promise<DiscoveryChatResponse> {
    // 1. Get or create session
    let session: DiscoverySessionResponse;
    if (sessionId) {
      const existing = await repo.getDiscoverySession(sessionId);
      if (!existing) {
        throw new Error(`Session ${sessionId} not found`);
      }
      session = existing;
    } else {
      session = await repo.createDiscoverySession({ initialProblem: userMessage });
    }

    // 2. Acquire per-session lock (DB-backed, memory fallback).
    const owner = randomUUID();
    const lockAcquired = await this.acquireLock(session.id, owner);
    if (!lockAcquired) {
      throw new SessionBusyError(session.id);
    }
    try {
      return await this.processLocked(userMessage, session);
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

    // Load conversation history
    const messages = await repo.listDiscoveryMessages(session.id);
    const conversationHistory: Array<{ role: string; content: string }> = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

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
    const ai = await aiProvider.generateSmart(
      DISCOVERY_SYSTEM_PROMPT,
      buildDiscoveryUserPrompt(userMessage, conversationHistory, session.extractedFacts),
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

    // Notify the team (never blocks the flow; email failure is non-fatal).
    notificationService
      .notifyNewDiagnostic({
        diagnosticId: diagnostic.id,
        sessionId: session.id,
        problemIdentified: diagnostic.problemIdentified,
        processAffected: diagnostic.processAffected,
        impactEstimated: diagnostic.impactEstimated,
        solutionRecommended: diagnostic.solutionRecommended,
        technologiesNeeded: diagnostic.technologiesNeeded || [],
        complexity: diagnostic.complexity,
        nextStep: diagnostic.nextStep,
        confidence: diagnostic.confidence,
        createdAt: diagnostic.createdAt,
        score: diagnostic.score,
        classification: diagnostic.classification,
        priority: diagnostic.priority,
        requiresHumanReview: diagnostic.requiresHumanReview,
        onSiteRequired: diagnostic.onSiteRequired,
        fallbackUsed: exhausted,
      })
      .catch((err) => console.error('[Diagnostic] notification error:', (err as Error).message));

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
}

// Single global instance
export const discoveryOrchestrator = new DiscoveryOrchestrator();