/**
 * Diagnostic Engine (FASE 3) + Lead Qualification (FASE 3).
 *
 * The AI recommends. The backend decides. This module is deterministic and
 * testable: it converts a validated AI diagnostic + the facts the client
 * actually provided into a lead score (0-100), a classification, a priority,
 * and backend-controlled flags (requires_human_review, on_site_required).
 *
 * The 25.000 Kz technical-visit price is NEVER surfaced as a default diagnosis
 * cost or an obligation. It appears only at the END of the final report, and
 * only when on_site_required is true. This is gated here, never via AI free
 * text.
 */
import type {
  DiagnosticAI,
} from '../lib/validation';
import { classifyScore } from '../lib/validation';

export interface DiagnosticContext {
  /** Facts actually provided by the client during the interview. */
  extractedFacts: Record<string, any>;
}

export interface ScoreResult {
  score: number;
  scoreReasons: string[];
  classification: string;
  priority: string;
}

export const VISIT_PRICE_KZ = '25.000 Kz';

export class DiagnosticEngine {
  /**
   * Deterministic lead score from real signals. Facts only count when the
   * client actually supplied them (never invented). Weights sum to 100.
   */
  computeScore(diag: DiagnosticAI, ctx: DiagnosticContext): ScoreResult {
    const facts = ctx.extractedFacts || {};
    const reasons: string[] = [];
    let score = 0;

    // Problem clarity (max 20)
    const problem = (diag.problem_identified || '').trim();
    if (problem.length >= 120) { score += 20; reasons.push('Problema descrito com elevado detalhe (+20)'); }
    else if (problem.length >= 40) { score += 15; reasons.push('Problema claramente descrito (+15)'); }
    else { score += 8; reasons.push('Problema descrito de forma parcial (+8)'); }

    // Confidence (max 15)
    if (diag.confidence >= 0.8) { score += 15; reasons.push('Alta confiança na análise (+15)'); }
    else if (diag.confidence >= 0.5) { score += 9; reasons.push('Confiança média na análise (+9)'); }
    else reasons.push('Confiança baixa — requer confirmação humana');

    // Process affected (max 6)
    if ((diag.process_affected || '').trim()) { score += 6; reasons.push('Processo afectado identificado (+6)'); }

    // Impact (max 8)
    if ((diag.impact_estimated || '').trim()) { score += 8; reasons.push('Impacto estimado (+8)'); }

    // Recommended solution (max 10)
    if ((diag.solution_recommended || '').trim()) { score += 10; reasons.push('Solução recomendada definida (+10)'); }

    // Technologies (max 7)
    if ((diag.technologies_needed || []).length > 0) { score += 7; reasons.push('Tecnologias sugeridas (+7)'); }

    // Next step (max 10)
    if (diag.next_step === 'budget' || diag.next_step === 'consultation') { score += 10; reasons.push(`Próximo passo decisório: ${diag.next_step} (+10)`); }
    else { score += 4; reasons.push('Próximo passo ainda requer análise (+4)'); }

    // Urgency — only if explicitly provided by the client.
    if (facts.urgency) { score += 7; reasons.push('Urgência declarada pelo cliente (+7)'); }

    // Budget — NEVER assumed; only counts if the client mentioned it.
    if (facts.budget) { score += 5; reasons.push('Orçamento indicado pelo cliente (+5)'); }

    // Technical direction adds confidence that the case is actionable.
    if ((diag.technical_direction || '').trim()) { score += 4; reasons.push('Direcção técnica definida (+4)'); }

    score = Math.max(0, Math.min(100, score));

    const classification = classifyScore(score);
    let priority = 'low';
    if (classification === 'HOT') priority = 'high';
    else if (classification === 'WARM') priority = 'medium';
    else if (classification === 'QUALIFIED') priority = 'medium';

    return { score, scoreReasons: reasons, classification, priority };
  }

  /**
   * Backend-controlled human review decision. The AI may *recommend*
   * requires_human_review, but the final answer is deterministic here.
   */
  decideHumanReview(diag: DiagnosticAI, ctx: DiagnosticContext): boolean {
    const insufficientFacts = (diag.client_stated_facts || []).length === 0;
    return (
      diag.complexity === 'high' ||
      diag.confidence < 0.5 ||
      diag.next_step === 'analysis' ||
      diag.requires_human_review === true ||
      insufficientFacts
    );
  }

  /**
   * Backend-controlled on-site decision. defaulted to the AI's recommendation
   * but only for meaningful (non-trivial) cases; presentation of the cost is
   * gated separately in the report formatter.
   */
  computeOnSite(diag: DiagnosticAI): boolean {
    return diag.on_site_required === true && diag.complexity !== 'low';
  }

  /**
   * Final diagnostic report for the client. The 25.000 Kz visit price only
   * appears when on_site_required === true, at the very end.
   */
  formatReport(diag: DiagnosticAI, score: ScoreResult, onSite: boolean, humanReview?: boolean): string {
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
    const techList = diag.technologies_needed?.length
      ? diag.technologies_needed.map((t) => `  • ${t}`).join('\n')
      : '  A ser definido pela equipa técnica';

    const hasHumanReview = humanReview !== undefined
      ? humanReview
      : this.decideHumanReview(diag, { extractedFacts: {} });

    const lines: string[] = [
      `## DIAGNÓSTICO CÓDIGO BINÁRIO`,
      ``,
      `**Problema identificado:**`,
      `${diag.problem_identified}`,
      ``,
      `**Processo afectado:**`,
      `${diag.process_affected || 'Não especificado'}`,
      ``,
      `**Impacto estimado:**`,
      `${diag.impact_estimated || 'A ser avaliado'}`,
      ``,
      `**Solução recomendada:**`,
      `${diag.solution_recommended || 'A definir em consultoria'}`,
      ``,
      `**Tecnologias necessárias:**`,
      techList,
      ``,
      `**Complexidade:** ${complexityMap[diag.complexity] || diag.complexity}`,
      ``,
      `**Confiança da análise:** ${Math.round((diag.confidence || 0) * 100)}%`,
      ``,
      `**Próximo passo:** ${nextStepMap[diag.next_step] || diag.next_step}`,
    ];

    if ((diag.technical_direction || '').trim()) {
      lines.push(``, `**Direcção técnica:**`, `${diag.technical_direction}`);
    }
    if ((diag.architecture_direction || '').trim()) {
      lines.push(``, `**Direcção arquitectural (alto nível):**`, `${diag.architecture_direction}`);
    }

    // AI VS FACTS transparency (spec §10): never present inference as fact.
    if ((diag.client_stated_facts || []).length) {
      lines.push(``, `**Factos fornecidos pelo cliente:**`);
      for (const f of diag.client_stated_facts) lines.push(`  • ${f}`);
    } else {
      lines.push(``, `**Factos fornecidos pelo cliente:** insuficientes para conclusão definitiva`);
    }
    if ((diag.technical_inferences || []).length) {
      lines.push(``, `**Inferências técnicas (a validar pela equipa):**`);
      for (const f of diag.technical_inferences) lines.push(`  • ${f}`);
    }

    lines.push(
      ``,
      `**Prioridade:** ${score.priority.toUpperCase()} — **Score:** ${score.score}/100 (${score.classification})`,
      `**Requer revisão humana:** ${hasHumanReview ? 'SIM' : 'Não'}`
    );

    lines.push(``, `---`, ``);
    lines.push(`Se deseja avançar, a nossa equipa entrará em contacto.`);
    lines.push(`Deixe os seus dados de contacto ou mencione que deseja agendar.`);

    // On-site visit: cost appears ONLY here, ONLY when on_site_required.
    if (onSite) {
      lines.push(
        ``,
        `---`,
        ``,
        `**Visita técnica presencial recomendada**`,
        `Dada a natureza do caso, recomenda-se que um engenheiro da Código Binário efectue uma visita técnica presencial para validação dos requisitos.`,
        ``,
        `Custo da visita técnica: **${VISIT_PRICE_KZ}**`
      );
    }

    return lines.join('\n');
  }
}

export const diagnosticEngine = new DiagnosticEngine();