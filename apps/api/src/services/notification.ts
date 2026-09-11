/**
 * Notification abstraction for the Diagnostic pipeline.
 *
 * Flow (per spec):
 *   DIAGNOSTIC → Supabase (persist) → Lead → Notification
 *
 * Responsibilities:
 *   - AI: analyse and generate the diagnosis (ai-provider.ts) — never sends email.
 *   - Backend: validate, structure, persist and distribute.
 *   - Supabase: storage (repository.ts).
 *   - Notification Service: notify the responsible person/team.
 *
 * The default transport is a no-op console logger so that the diagnostic flow
 * NEVER breaks when email is not configured. Set NOTIFICATION_PROVIDER=resend
 * plus RESEND_API_KEY and NOTIFICATION_EMAIL_FROM / NOTIFICATION_EMAIL_TO to
 * enable email delivery through Resend's HTTPS API (no extra SDK required).
 *
 * Required environment variables (production, Render dashboard):
 *   NOTIFICATION_PROVIDER=resend
 *   RESEND_API_KEY=re_...
 *   NOTIFICATION_EMAIL_FROM="Código Binário <diagnostics@yourdomain>"
 *   NOTIFICATION_EMAIL_TO="team@yourdomain"
 */

export interface DiagnosticNotificationPayload {
  diagnosticId: string;
  sessionId: string;
  problemIdentified: string;
  processAffected?: string | null;
  impactEstimated?: string | null;
  solutionRecommended?: string | null;
  technologiesNeeded: string[];
  complexity: string;
  nextStep: string;
  confidence: number;
  createdAt: string;
  lead?: { name: string; email?: string; phone?: string; company?: string } | null;
  // --- Lead Engine (FASE 3) ---
  score?: number;
  classification?: string;
  priority?: string;
  requiresHumanReview?: boolean;
  onSiteRequired?: boolean;
  fallbackUsed?: boolean;
}

/** Default team recipient (spec §15). Configure via NOTIFICATION_EMAIL_TO to override. */
export const DEFAULT_NOTIFICATION_EMAIL_TO = 'fabiobessadeoliveira2@gmail.com';

interface SendResult {
  delivered: boolean;
  provider: string;
  detail?: string;
}

export class NotificationService {
  private provider: string;

  constructor() {
    this.provider = (process.env.NOTIFICATION_PROVIDER || 'console').toLowerCase();
  }

  isEmailEnabled(): boolean {
    return this.provider === 'resend' && Boolean(process.env.RESEND_API_KEY);
  }

  /**
   * Notify the team that a new diagnostic is available.
   * Never throws: notification failures must not break the diagnostic flow.
   */
  async notifyNewDiagnostic(payload: DiagnosticNotificationPayload): Promise<SendResult> {
    const subject = `[Código Binário] Novo diagnóstico // ${payload.complexity.toUpperCase()} // ${payload.diagnosticId}`;
    const text = this.formatText(payload);

    try {
      if (this.isEmailEnabled()) {
        return await this.sendViaResend(subject, text);
      }
      // Safe default: log a structured summary (no PII beyond what ops needs).
      console.log(
        `[Notification] diagnostic_ready id=${payload.diagnosticId} session=${payload.sessionId} complexity=${payload.complexity} next_step=${payload.nextStep} email_configured=false`
      );
      return { delivered: false, provider: 'console', detail: 'Email not configured' };
    } catch (error) {
      console.error('[Notification] delivery failed:', (error as Error).message);
      return { delivered: false, provider: this.provider, detail: (error as Error).message };
    }
  }

  private async sendViaResend(subject: string, text: string): Promise<SendResult> {
    const apiKey = process.env.RESEND_API_KEY!;
        const from = process.env.NOTIFICATION_EMAIL_FROM;
        // Spec §15: default recipient is fabiobessadeoliveira2@gmail.com.
        const to = process.env.NOTIFICATION_EMAIL_TO || DEFAULT_NOTIFICATION_EMAIL_TO;

        if (!from) {
          console.warn('[Notification] RESEND configured but NOTIFICATION_EMAIL_FROM missing');
          return { delivered: false, provider: 'resend', detail: 'Missing sender env var' };
        }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend API ${response.status}: ${body.slice(0, 200)}`);
    }

    console.log(`[Notification] diagnostic notification emailed to team (resend)`);
    return { delivered: true, provider: 'resend' };
  }

  private formatText(p: DiagnosticNotificationPayload): string {
    const lines = [
      'NOVO DIAGNÓSTICO — CÓDIGO BINÁRIO',
      '',
      `ID: ${p.diagnosticId}`,
      `Sessão: ${p.sessionId}`,
      `Criado: ${p.createdAt}`,
      '',
      `PROBLEMA: ${p.problemIdentified}`,
      p.processAffected ? `PROCESSO: ${p.processAffected}` : null,
      p.impactEstimated ? `IMPACTO: ${p.impactEstimated}` : null,
      p.solutionRecommended ? `SOLUÇÃO: ${p.solutionRecommended}` : null,
      `TECNOLOGIAS: ${p.technologiesNeeded.join(', ') || '—'}`,
      `COMPLEXIDADE: ${p.complexity}`,
            `PRÓXIMO PASSO: ${p.nextStep}`,
            `CONFIANÇA: ${Math.round((p.confidence || 0) * 100)}%`,
            `SCORE: ${p.score ?? '—'}/100 (${p.classification ?? '—'})`,
            `PRIORIDADE: ${(p.priority || 'low').toUpperCase()}`,
            `REVISÃO HUMANA: ${p.requiresHumanReview ? 'SIM' : 'Não'}`,
            `VISITA PRESENCIAL: ${p.onSiteRequired ? 'SIM' : 'Não'}`,
            p.fallbackUsed ? `NOTA: diagnóstico gerado por fallback controlado — requer revisão` : null,
          ];
    if (p.lead) {
      lines.push(
        '',
        'LEAD ASSOCIADO:',
        `Nome: ${p.lead.name}`,
        p.lead.email ? `Email: ${p.lead.email}` : null,
        p.lead.phone ? `Telefone: ${p.lead.phone}` : null,
        p.lead.company ? `Empresa: ${p.lead.company}` : null
      );
    }
    return lines.filter(Boolean).join('\n');
  }
}

export const notificationService = new NotificationService();
