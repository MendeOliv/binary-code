/**
 * Notification abstraction for the Diagnostic pipeline.
 *
 * Flow (per spec):
 *   DIAGNOSTIC → Supabase (persist) → Lead → Internal Notification + Client Confirmation
 *
 * Responsibilities:
 *   - AI: analyse and generate the diagnosis (ai-provider.ts) — never sends email.
 *   - Backend: validate, structure, persist and distribute.
 *   - Supabase: storage (repository.ts).
 *   - Notification Service: notify the responsible person/team AND confirm to the client.
 *
 * The notification service has TWO distinct purposes:
 *
 *   1. notifyNewDiagnostic(payload)      → INTERNAL commercial email to the team.
 *      Fired ONLY after a Lead exists with sufficient client info. Never partial.
 *      (The old per-diagnostic trigger was removed — see discovery-orchestrator.)
 *
 *   2. sendClientConfirmation(payload)   → PUBLIC confirmation email to the client.
 *      Only communicates that the request was received. NEVER exposes internal
 *      CRM data (score, classification, priority, human review, assignedTo…).
 *
 * The default transport is a no-op console logger so that the diagnostic flow
 * NEVER breaks when email is not configured. Set NOTIFICATION_PROVIDER=resend
 * plus RESEND_API_KEY and NOTIFICATION_EMAIL_FROM / NOTIFICATION_EMAIL_TO to
 * enable email delivery through Resend's HTTPS API (no extra SDK required).
 *
 * Required environment variables (production, Render dashboard):
 *   NOTIFICATION_PROVIDER=resend
 *   RESEND_API_KEY=re_...
 *   NOTIFICATION_EMAIL_FROM="Código Binário <contacto@codigobinario.it.ao>"
 *   NOTIFICATION_EMAIL_TO="team@codigobinario.it.ao"
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
  // --- CRM / Handoff (FASE 5/6) ---
  leadId?: string;
  assignedTo?: string | null;
  nextAction?: string | null;
  followUpAt?: string | null;
}

/**
 * Public client-confirmation payload. Contains ONLY data that the client
 * themselves provided plus a public-friendly next step. Nothing internal.
 */
export interface ClientConfirmationPayload {
  name: string;
  company?: string | null;
  /** Short client-side problem summary (from the diagnostic). */
  problemSummary?: string | null;
  /** Public, friendly next step (already localised, no CRM jargon). */
  nextStep?: string | null;
  /** Recipient address — the email the client supplied. May be absent/invalid. */
  email: string | null | undefined;
}

/** Default team recipient (spec §15). Configure via NOTIFICATION_EMAIL_TO to override. */
export const DEFAULT_NOTIFICATION_EMAIL_TO = 'fabiobessadeoliveira2@gmail.com';

interface SendResult {
  delivered: boolean;
  provider: string;
  detail?: string;
}

interface SendOptions {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

type Transporter = (opts: SendOptions) => Promise<SendResult>;

// ── Pure helpers (exported for unit tests) ───────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Basic RFC-ish sanity check. Rejects empties, missing dots, malformed. */
export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === 'string' &&
    email.trim().length > 0 &&
    email.trim().length <= 254 &&
    EMAIL_RE.test(email.trim())
  );
}

/** HTML-escape user-supplied content to prevent injection into email markup. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}

/** Public-friendly next step; never exposes internal classification/priority. */
export function buildPublicNextStep(nextStep?: string | null, onSite?: boolean | null): string {
  if (onSite) return 'A nossa equipa irá contactá-lo para validar os detalhes do seu caso.';
  switch (nextStep) {
    case 'budget': return 'A nossa equipa irá contactá-lo para apresentar a proposta adequada.';
    case 'consultation': return 'A nossa equipa irá contactá-lo para agendar uma consulta técnica.';
    case 'analysis': return 'A nossa equipa irá analisar o seu caso em detalhe.';
    default: return 'A nossa equipa irá analisar o seu caso e preparar o próximo passo.';
  }
}

/** Internal team email (plain text). Ordered LEAD → DIAGNÓSTICO → QUALIFICAÇÃO. */
export function buildInternalText(p: DiagnosticNotificationPayload): string {
  const lines: (string | null)[] = [
    '— CÓDIGO BINÁRIO — NOVO LEAD',
    '',
    'LEAD',
    p.lead?.name ? `Nome: ${p.lead.name}` : null,
    p.lead?.email ? `Email: ${p.lead.email}` : null,
    p.lead?.phone ? `Telefone: ${p.lead.phone}` : null,
    p.lead?.company ? `Empresa: ${p.lead.company}` : null,
    p.leadId ? `Lead ID: ${p.leadId}` : null,
    '',
    'DIAGNÓSTICO',
    '',
    `Diagnóstico ID: ${p.diagnosticId}`,
    `Sessão: ${p.sessionId}`,
    `Data/hora: ${p.createdAt}`,
    `Problema: ${p.problemIdentified}`,
    p.processAffected ? `Processo: ${p.processAffected}` : null,
    p.impactEstimated ? `Impacto: ${p.impactEstimated}` : null,
    p.solutionRecommended ? `Solução: ${p.solutionRecommended}` : null,
    `Tecnologias: ${p.technologiesNeeded.join(', ') || '—'}`,
    `Complexidade: ${p.complexity}`,
    `Próximo passo: ${p.nextStep}`,
    `Confiança: ${Math.round((p.confidence || 0) * 100)}%`,
    '',
    'QUALIFICAÇÃO',
    '',
    `Score: ${p.score ?? '—'}/100 (${p.classification ?? '—'})`,
    `Classificação: ${p.classification ?? '—'}`,
    `Prioridade: ${(p.priority || 'low').toUpperCase()}`,
    `Revisão humana: ${p.requiresHumanReview ? 'SIM' : 'Não'}`,
    `Próxima ação: ${p.nextAction || p.nextStep || '—'}`,
    `On-site required: ${p.onSiteRequired ? 'SIM' : 'Não'}`,
    p.assignedTo ? `AssignedTo: ${p.assignedTo}` : null,
    p.followUpAt ? `FollowUpAt: ${p.followUpAt}` : null,
    // 25.000 Kz visit price: ONLY when on_site_required (spec §15).
    p.onSiteRequired ? 'Custo visita técnica: 25.000 Kz' : null,
    p.fallbackUsed ? 'NOTA: diagnóstico gerado por fallback controlado — requer revisão' : null,
  ];
  return lines.filter(Boolean).join('\n');
}

/** Public client confirmation (plain-text fallback). */
export function buildClientConfirmationText(p: ClientConfirmationPayload): string {
  const lines: (string | null)[] = [
    'Recebemos a sua requisição',
    '',
    `Olá, ${p.name},`,
    '',
    'Recebemos a sua requisição com sucesso.',
    '',
    'A nossa equipa já recebeu as informações que partilhou e irá analisar o seu caso para preparar o próximo passo mais adequado.',
    '',
    'RESUMO DA REQUISIÇÃO',
    p.company ? `Empresa: ${p.company}` : null,
    p.problemSummary ? `Solicitação: ${p.problemSummary}` : null,
    p.nextStep ? `Próximo passo: ${p.nextStep}` : null,
    '',
    'Se for necessária alguma informação adicional, entraremos em contacto.',
    '',
    'Obrigado por confiar no Código Binário.',
    '',
    'Código Binário',
    'Engenharia de Software • IA • Automação',
  ];
  return lines.filter(Boolean).join('\n');
}

/** Public client confirmation (responsive HTML). Brand tokens from DESIGN.md. */
export function buildClientConfirmationHtml(p: ClientConfirmationPayload): string {
  // Brand palette (source of truth: docs/design/DESIGN.md → Binary Cybernetic Engine)
  const surface = '#051424';
  const card = '#0d1c2d';
  const onSurface = '#d4e4fa';
  const muted = '#bacbbe';
  const accent = '#00e297';
  const accentSoft = '#6dffba';
  const cyan = '#4cd6fb';

  const name = escapeHtml(p.name);
  const company = escapeHtml(p.company);
  const problem = escapeHtml(p.problemSummary);
  const next = escapeHtml(p.nextStep);

  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Recebemos a sua requisição — Código Binário</title>
</head>
<body style="margin:0;padding:0;background-color:${surface};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${surface};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${card};border-radius:14px;overflow:hidden;">
          <!-- Brand header -->
          <tr>
            <td align="center" style="padding:28px 24px 20px;">
              <!--
                Official logo (asset already shipped by the frontend at
                /logo/codigo-binario-transparent.png). Email clients cannot use
                relative paths, so reference the absolute production URL. The
                textual lockup below stays as the images-blocked fallback — this
                is the in-body brand image, NOT the Gmail sender avatar (BIMI).
              -->
              <img
                src="https://codigobinario.it.ao/logo/codigo-binario-transparent.png"
                width="120"
                alt="Código Binário"
                style="display:block;margin:0 auto 12px;width:120px;max-width:120px;height:auto;border:0;outline:none;text-decoration:none;"
              />
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:20px;font-weight:700;letter-spacing:2px;color:${accentSoft};">CÓDIGO&nbsp;BINÁRIO</div>
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:12px;letter-spacing:3px;color:${muted};margin-top:6px;">ENGENHARIA&nbsp;DE&nbsp;SOFTWARE&nbsp;•&nbsp;IA&nbsp;•&nbsp;AUTOMAÇÃO</div>
            </td>
          </tr>
          <!-- Accent rule -->
          <tr><td style="height:3px;background-color:${accent};"></td></tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 8px;">
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:22px;font-weight:700;color:${onSurface};">Recebemos a sua requisição</div>
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:15px;line-height:24px;color:${onSurface};margin-top:16px;">
                Olá, ${name},
              </div>
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:15px;line-height:24px;color:${muted};margin-top:8px;">
                Recebemos a sua requisição com sucesso. A nossa equipa já recebeu as informações que partilhou e irá analisar o seu caso para preparar o próximo passo mais adequado.
              </div>
            </td>
          </tr>
          <!-- Summary card -->
          <tr>
            <td style="padding:20px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${surface};border-left:3px solid ${accent};border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-family:Verdana,Geneva,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:${accent};margin-bottom:10px;">RESUMO DA REQUISIÇÃO</div>
                    ${
                      company
                        ? `<div style="font-family:Verdana,Geneva,sans-serif;font-size:14px;color:${onSurface};line-height:22px;"><span style="color:${muted};">Empresa:</span> ${company}</div>`
                        : ''
                    }
                    ${
                      problem
                        ? `<div style="font-family:Verdana,Geneva,sans-serif;font-size:14px;color:${onSurface};line-height:22px;margin-top:6px;"><span style="color:${muted};">Solicitação:</span> ${problem}</div>`
                        : ''
                    }
                    ${
                      next
                        ? `<div style="font-family:Verdana,Geneva,sans-serif;font-size:14px;color:${onSurface};line-height:22px;margin-top:6px;"><span style="color:${muted};">Próximo passo:</span> ${next}</div>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0;">
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:15px;line-height:24px;color:${muted};">
                Se for necessária alguma informação adicional, entraremos em contacto. Obrigado por confiar no Código Binário.
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:26px 24px 30px;">
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:13px;color:${cyan};">Código Binário</div>
              <div style="font-family:Verdana,Geneva,sans-serif;font-size:11px;color:${muted};margin-top:4px;">Engenharia de Software • IA • Automação</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export class NotificationService {
  private provider: string;
  private readonly RESEND_TIMEOUT_MS = 10_000;
  private readonly transport: Transporter;

  constructor(transport?: Transporter) {
    this.provider = (process.env.NOTIFICATION_PROVIDER || 'console').toLowerCase();
    this.transport = transport ?? ((opts) => this.resendTransport(opts));
  }

  isEmailEnabled(): boolean {
    return this.provider === 'resend' && Boolean(process.env.RESEND_API_KEY);
  }

  /**
   * Notify the team that a new LEAD with enough client info is available.
   * Only the caller decides when this is appropriate (after a lead is created —
   * never before). Never throws: notification failures must not break the flow.
   */
  async notifyNewDiagnostic(payload: DiagnosticNotificationPayload): Promise<SendResult> {
    const subject = `[Código Binário] Novo Lead // ${payload.complexity.toUpperCase()} // ${payload.diagnosticId}`;
    const text = buildInternalText(payload);
    return this.dispatch(subject, text, payload);
  }

  /**
   * Send a public confirmation to the CLIENT after a successful request.
   * Uses ONLY the client's own data; never exposes internal qualification.
   * If the client email is absent/invalid, it is a silent no-op (no send).
   * Best-effort: never throws, never breaks lead creation / response.
   */
  async sendClientConfirmation(payload: ClientConfirmationPayload): Promise<SendResult> {
    if (!isValidEmail(payload.email)) {
      console.log('[Notification] client confirmation skipped — client email missing/invalid');
      return { delivered: false, provider: this.provider, detail: 'Missing/invalid client email' };
    }

    const subject = 'Recebemos a sua requisição — Código Binário';
    const text = buildClientConfirmationText(payload);
    const html = buildClientConfirmationHtml(payload);

    try {
      if (this.isEmailEnabled()) {
        const from = process.env.NOTIFICATION_EMAIL_FROM!;
        return await this.transport({ from, to: [payload.email], subject, text, html });
      }
      console.log(`[Notification] client confirmation to=${payload.email} email_configured=false`);
      return { delivered: false, provider: 'console', detail: 'Email not configured' };
    } catch (error) {
      console.error('[Notification] client confirmation delivery failed:', (error as Error).message);
      return { delivered: false, provider: this.provider, detail: (error as Error).message };
    }
  }

  /**
   * Shared dispatch for envelope building + best-effort delivery.
   * Never throws.
   */
  private async dispatch(
    subject: string,
    text: string,
    payload: DiagnosticNotificationPayload
  ): Promise<SendResult> {
    try {
      if (this.isEmailEnabled()) {
        const from = process.env.NOTIFICATION_EMAIL_FROM!;
        const to = process.env.NOTIFICATION_EMAIL_TO || DEFAULT_NOTIFICATION_EMAIL_TO;
        return await this.transport({ from, to: [to], subject, text });
      }
      // Safe default: log a structured summary (no PII beyond what ops needs).
      console.log(
        `[Notification] lead_ready id=${payload.leadId || 'none'} session=${payload.sessionId} lead_name=${payload.lead?.name || '—'} lead_email=${payload.lead?.email || '—'} complexity=${payload.complexity} email_configured=false`
      );
      return { delivered: false, provider: 'console', detail: 'Email not configured' };
    } catch (error) {
      console.error('[Notification] delivery failed:', (error as Error).message);
      return { delivered: false, provider: this.provider, detail: (error as Error).message };
    }
  }

  /** Resend HTTPS transport (no external SDK). Used as the default transporter. */
  private async resendTransport(opts: SendOptions): Promise<SendResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.NOTIFICATION_EMAIL_FROM;

    if (!this.isEmailEnabled()) {
      return { delivered: false, provider: 'console', detail: 'Email not configured' };
    }
    if (!from) {
      console.warn('[Notification] RESEND configured but NOTIFICATION_EMAIL_FROM missing');
      return { delivered: false, provider: 'resend', detail: 'Missing sender env var' };
    }

    const body: Record<string, unknown> = { from, to: opts.to, subject: opts.subject, text: opts.text };
    if (opts.html) body.html = opts.html;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.RESEND_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API ${response.status}: ${errorBody.slice(0, 200)}`);
    }

    console.log(`[Notification] emailed to=${opts.to.join(',')} (resend)`);
    return { delivered: true, provider: 'resend' };
  }
}

export const notificationService = new NotificationService();