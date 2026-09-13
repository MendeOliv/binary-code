/**
 * Lead-creation notification dispatch.
 *
 * Centralises the decision of WHICH emails are sent when a Lead is created,
 * making the "exactly one internal + one client confirmation, only on NEW
 * leads, never on idempotent retries" rule testable and reusable by both the
 * route and the test-suite.
 *
 * Flow: Lead created (created === true) → 1 internal notification + 1 client
 * confirmation. When the lead already existed (created === false, i.e. retry),
 * NOTHING is sent — prevents duplicated emails (idempotency).
 */
import { notificationService, buildPublicNextStep, type DiagnosticNotificationPayload } from './notification';
import type { CreateLeadResult } from './lead-service';
import type { DiagnosticResponse, LeadResponse } from '@shared/models';

/** Full internal payload built from the freshly-created (enriched) lead. */
export function buildHandoffPayload(
  lead: LeadResponse,
  diagnostic: DiagnosticResponse | null
): DiagnosticNotificationPayload {
  return {
    diagnosticId: lead.diagnosticId || '',
    sessionId: lead.sessionId || '',
    leadId: lead.id,
    assignedTo: lead.assignedTo ?? null,
    nextAction: lead.nextAction ?? null,
    followUpAt: lead.followUpAt ?? null,
    problemIdentified: diagnostic?.problemIdentified || lead.notes || 'Lead submetido após diagnóstico',
    processAffected: diagnostic?.processAffected ?? undefined,
    impactEstimated: diagnostic?.impactEstimated ?? undefined,
    solutionRecommended: diagnostic?.solutionRecommended ?? undefined,
    technologiesNeeded: diagnostic?.technologiesNeeded || [],
    complexity: diagnostic?.complexity || 'low',
    nextStep: diagnostic?.nextStep || 'budget',
    confidence: diagnostic?.confidence ?? 0,
    createdAt: lead.createdAt,
    score: lead.score ?? diagnostic?.score ?? undefined,
    classification: lead.classification ?? diagnostic?.classification ?? undefined,
    priority: lead.priority ?? diagnostic?.priority ?? undefined,
    requiresHumanReview: lead.requiresHumanReview ?? diagnostic?.requiresHumanReview ?? undefined,
    onSiteRequired: lead.onSiteRequired ?? diagnostic?.onSiteRequired ?? undefined,
    lead: {
      name: lead.name,
      email: lead.email ?? undefined,
      phone: lead.phone ?? undefined,
      company: lead.company ?? undefined,
    },
  };
}

export interface NotificationBuses {
  notifyNewDiagnostic: (payload: DiagnosticNotificationPayload) => Promise<unknown>;
  sendClientConfirmation: (payload: {
    name: string;
    company?: string | null;
    problemSummary?: string | null;
    nextStep?: string | null;
    email: string | null | undefined;
  }) => Promise<unknown>;
}

const defaultBuses: NotificationBuses = {
  notifyNewDiagnostic: (p) => notificationService.notifyNewDiagnostic(p),
  sendClientConfirmation: (p) => notificationService.sendClientConfirmation(p),
};

/**
 * Fire the notification side-effects of a successful lead creation.
 * Best-effort: both sends are fire-and-forget with a catch — failures never
 * affect the lead creation, CRM, or the API response.
 *
 * Idempotency: only runs when `result.created === true`. A retry that returns
 * the existing lead (created === false) triggers no notification at all.
 */
export function dispatchLeadNotifications(
  result: CreateLeadResult,
  buses: NotificationBuses = defaultBuses
): void {
  if (!result.created) {
    return;
  }

  buses
    .notifyNewDiagnostic(buildHandoffPayload(result.lead, result.diagnostic))
    .catch((err) => console.error('[Lead] notification error:', (err as Error).message));

  buses
    .sendClientConfirmation({
      name: result.lead.name,
      company: result.lead.company,
      problemSummary: result.diagnostic?.problemIdentified ?? result.lead.notes ?? undefined,
      nextStep: buildPublicNextStep(result.diagnostic?.nextStep, result.lead.onSiteRequired),
      email: result.lead.email,
    })
    .catch((err) => console.error('[Lead] client confirmation error:', (err as Error).message));
}