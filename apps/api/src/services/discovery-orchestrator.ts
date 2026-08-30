import { repo } from '@db/repository';
import { aiProvider } from './ai-provider';
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

export class DiscoveryOrchestrator {
  /**
   * Minimum number of user messages before we attempt diagnosis.
   * With 3 messages the AI usually has: problem, context, and one follow-up.
   */
  private readonly MIN_MESSAGES_FOR_DIAGNOSIS = 3;

  /**
   * Maximum messages before we force a diagnosis (avoid infinite interview).
   */
  private readonly MAX_MESSAGES_BEFORE_DIAGNOSIS = 8;

  /**
   * Handle a discovery chat message.
   * Creates a session if none exists, generates AI response, and optionally
   * generates a diagnostic brief when enough information is gathered.
   */
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
      session = await repo.createDiscoverySession({
        initialProblem: userMessage,
      });
    }

    // 2. Save user message
    await repo.createDiscoveryMessage({
      sessionId: session.id,
      role: 'user',
      content: userMessage,
    });

    // 3. Load conversation history
    const messages = await repo.listDiscoveryMessages(session.id);
    const conversationHistory: Array<{ role: string; content: string }> = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // 4. Check if we should generate diagnosis
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    const shouldDiagnose =
      userMessageCount >= this.MAX_MESSAGES_BEFORE_DIAGNOSIS ||
      (userMessageCount >= this.MIN_MESSAGES_FOR_DIAGNOSIS &&
        this.maybeEnoughInfo(session.extractedFacts));

    if (shouldDiagnose && session.status !== 'diagnosis_ready') {
      return this.generateDiagnosis(session, conversationHistory);
    }

    // 5. Generate next interview response
    const aiResponse = await aiProvider.generateText(
      DISCOVERY_SYSTEM_PROMPT,
      buildDiscoveryUserPrompt(userMessage, conversationHistory, session.extractedFacts),
      undefined,
      false
    );

    // 6. Extract new facts from AI response
    const newFacts = this.extractFactsFromResponse(aiResponse);
    const updatedFacts = { ...session.extractedFacts, ...newFacts };

    // 7. Save AI message (strip fact markers)
    const cleanResponse = this.stripFactMarkers(aiResponse);
    await repo.createDiscoveryMessage({
      sessionId: session.id,
      role: 'assistant',
      content: cleanResponse,
    });

    // 8. Update session with new facts
    await repo.updateDiscoverySession(session.id, {
      extractedFacts: updatedFacts,
    });

    // 9. Detect DIAGNOSTIC_READY marker in response
    const hasDiagnosticReady = aiResponse.includes('[DIAGNOSTIC_READY]');

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
   * Generate a diagnostic brief from the conversation.
   */
  private async generateDiagnosis(
    session: DiscoverySessionResponse,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<DiscoveryChatResponse> {
    // Generate diagnosis via AI
    const diagnosisRaw = await aiProvider.generateText(
      DIAGNOSIS_GENERATION_PROMPT,
      buildDiagnosisPrompt(conversationHistory, session.extractedFacts),
      undefined,
      true // jsonMode
    );

    // Parse the diagnosis JSON
    let parsed: any;
    try {
      let jsonStr = diagnosisRaw.trim();
      // Strip markdown code block if present
      if (jsonStr.startsWith('```')) {
        const lines = jsonStr.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].startsWith('```')) lines.pop();
        jsonStr = lines.join('\n').trim();
      }
      parsed = JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse diagnosis JSON:', error);
      // Fallback diagnosis
      parsed = {
        problem_identified: 'Análise não conclusiva — contacto humano necessário',
        process_affected: 'Não determinado',
        impact_estimated: 'A ser avaliado',
        solution_recommended: 'Consultoria técnica recomendada',
        technologies_needed: [],
        complexity: 'high',
        next_step: 'analysis',
        reasoning: 'Falha na geração automática do diagnóstico',
        confidence: 0.3,
      };
    }

    // Persist the diagnostic
    const diagnostic = await repo.createDiagnostic({
      sessionId: session.id,
      problemIdentified: parsed.problem_identified,
      processAffected: parsed.process_affected,
      impactEstimated: parsed.impact_estimated,
      solutionRecommended: parsed.solution_recommended,
      technologiesNeeded: parsed.technologies_needed,
      complexity: parsed.complexity,
      nextStep: parsed.next_step,
      reasoning: parsed.reasoning,
      confidence: parsed.confidence,
    });

    // Update session status
    await repo.updateDiscoverySession(session.id, {
      status: 'diagnosis_ready',
      complexity: parsed.complexity,
    });

    // Build the diagnostic presentation message
    const presentationMessage = this.formatDiagnosticPresentation(diagnostic);

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

  /**
   * Format a diagnostic brief for presentation to the user.
   */
  private formatDiagnosticPresentation(diag: DiagnosticResponse): string {
    const complexityMap: Record<string, string> = {
      low: '🟢 BAIXA',
      medium: '🟡 MÉDIA',
      high: '🔴 ALTA',
    };

    const nextStepMap: Record<string, string> = {
      budget: 'Orçamento / Proposta',
      consultation: 'Consultoria Técnica',
      analysis: 'Análise Humana Necessária',
    };

    const techList = diag.technologiesNeeded?.length
      ? diag.technologiesNeeded.map((t: string) => `  • ${t}`).join('\n')
      : '  A ser definido pela equipa técnica';

    return [
      `## DIAGNÓSTICO CÓDIGO BINÁRIO`,
      ``,
      `**Problema identificado:**`,
      `${diag.problemIdentified}`,
      ``,
      `**Processo afectado:**`,
      `${diag.processAffected || 'Não especificado'}`,
      ``,
      `**Impacto estimado:**`,
      `${diag.impactEstimated || 'A ser avaliado'}`,
      ``,
      `**Solução recomendada:**`,
      `${diag.solutionRecommended || 'A definir em consultoria'}`,
      ``,
      `**Tecnologias necessárias:**`,
      techList,
      ``,
      `**Complexidade:** ${complexityMap[diag.complexity] || diag.complexity}`,
      ``,
      `**Próximo passo:** ${nextStepMap[diag.nextStep] || diag.nextStep}`,
      ``,
      `---`,
      ``,
      `Se deseja avançar, a nossa equipa entrará em contacto para discutir os detalhes.`,
      `Deixe os seus dados de contacto ou agende uma consultoria técnica.`,
    ].join('\n');
  }

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
    const requiredKeys = ['industry', 'painPoint'];
    return requiredKeys.some(k => facts[k] && facts[k] !== '');
  }
}

// Single global instance
export const discoveryOrchestrator = new DiscoveryOrchestrator();
