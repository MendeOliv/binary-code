/**
 * Lead Service (FASE 4 Lead Engine + FASE 5 Mini CRM + FASE 6 Human Handoff).
 *
 * Routes → Service → Repository → Database. This module owns the commercial
 * rules of the lead:
 *   - deterministic score/priority enrichment from the session diagnostic
 *   - idempotent lead creation (one lead per session)
 *   - status-transition validation
 *   - audit trail through lead_activities (status_change / assignment /
 *     follow_up / diagnostic_review)
 *
 * The AI never decides commercial rules here: score/priority are computed by
 * the backend and status/assignment are admin operations.
 */
import { repo } from '@db/repository';
import { diagnosticEngine } from './diagnostic-engine';
import type {
  DiagnosticResponse,
  LeadActivityResponse,
  LeadCreate,
  LeadResponse,
  LeadUpdate,
} from '@shared/models';

/** A subset of the repository the lead service needs (injectable for tests). */
export interface LeadRepositoryPort {
  createLead(data: LeadCreate): Promise<LeadResponse>;
  getLead(id: string): Promise<LeadResponse | null>;
  getLeadBySession(sessionId: string): Promise<LeadResponse | null>;
  updateLead(id: string, data: LeadUpdate): Promise<LeadResponse | null>;
  getDiagnosticBySession(sessionId: string): Promise<DiagnosticResponse | null>;
  createLeadActivity(data: {
    leadId: string;
    type: string;
    description: string;
    createdBy?: string;
  }): Promise<LeadActivityResponse>;
  listLeadActivities(leadId: string): Promise<LeadActivityResponse[]>;
}

/** Canonical statuses — preserved from the existing schema (spec §4.5). */
export const LEAD_STATUSES = ['new', 'contacted', 'consultation', 'proposal', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

const TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ['contacted', 'won', 'lost'],
  contacted: ['consultation', 'proposal', 'won', 'lost'],
  consultation: ['proposal', 'contacted', 'won', 'lost'],
  proposal: ['won', 'lost', 'consultation'],
  won: [],
  lost: [],
};

export class LeadStatusTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Transition not allowed: ${from} → ${to}`);
    this.name = 'LeadStatusTransitionError';
  }
}

export function isValidStatusTransition(from: string, to: string): boolean {
  if (from === to) return true;
  const allowed = TRANSITIONS[from as LeadStatus] ?? [];
  return allowed.includes(to as LeadStatus);
}

/** Backend-derived next action from the diagnostic (FASE 6). */
export function deriveNextAction(diag: DiagnosticResponse): string {
  if (diag.onSiteRequired) return 'Fazer visita técnica';
  switch (diag.nextStep) {
    case 'budget': return 'Contactar cliente / apresentar orçamento';
    case 'consultation': return 'Agendar consulta técnica';
    case 'analysis': return 'Análise humana / revisão técnica';
    default: return 'Contactar cliente';
  }
}

export interface CreateLeadResult {
  lead: LeadResponse;
  diagnostic: DiagnosticResponse | null;
  created: boolean;
}

export class LeadService {
  constructor(private readonly repository: LeadRepositoryPort = repo) {}

  /**
   * Idempotent lead creation. A session produces at most one lead: a repeated
   * submit returns the existing lead instead of duplicating (spec §4.6/§7).
   */
  async createLeadFromDiscovery(contact: LeadCreate): Promise<CreateLeadResult> {
    const r = this.repository;

    if (contact.sessionId) {
      const existing = await r.getLeadBySession(contact.sessionId);
      if (existing) {
        console.log(`[Lead] existing lead ${existing.id} for session ${contact.sessionId} (idempotent no-op)`);
        return { lead: existing, diagnostic: null, created: false };
      }
    }

    const lead = await r.createLead({
      diagnosticId: contact.diagnosticId || undefined,
      sessionId: contact.sessionId || undefined,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      notes: contact.notes,
    });
    console.log(
      `[Lead] created id=${lead.id} session=${lead.sessionId || 'none'} name=${lead.name}`
    );

    let diagnostic: DiagnosticResponse | null = null;
    if (lead.sessionId) {
      diagnostic = await r.getDiagnosticBySession(lead.sessionId);
    }

    if (diagnostic) {
      const priority = diagnosticEngine.computePriority(diagnostic.classification, {
        complexity: diagnostic.complexity,
        requiresHumanReview: diagnostic.requiresHumanReview,
      });
      const enriched = await r.updateLead(lead.id, {
        score: diagnostic.score,
        classification: diagnostic.classification,
        requiresHumanReview: diagnostic.requiresHumanReview,
        onSiteRequired: diagnostic.onSiteRequired,
        priority,
        nextAction: deriveNextAction(diagnostic),
      });

      console.log(
        `[Lead] enriched id=${lead.id} score=${diagnostic.score} class=${diagnostic.classification} priority=${priority} review=${diagnostic.requiresHumanReview} on_site=${diagnostic.onSiteRequired}`
      );

      // Audit trail.
      await r.createLeadActivity({
        leadId: lead.id,
        type: 'lead_created',
        description: 'Lead criado a partir do diagnóstico Discovery',
        createdBy: 'system',
      });
      if (diagnostic.requiresHumanReview) {
        await r.createLeadActivity({
          leadId: lead.id,
          type: 'diagnostic_review',
          description: 'Diagnóstico requer revisão humana',
          createdBy: 'system',
        });
      }
      if (diagnostic.onSiteRequired) {
        await r.createLeadActivity({
          leadId: lead.id,
          type: 'follow_up',
          description: 'Visita técnica presencial a concretizar (25.000 Kz quando confirmada)',
          createdBy: 'system',
        });
      }

      if (enriched) return { lead: enriched, diagnostic, created: true };
    }
    return { lead, diagnostic, created: true };
  }

  /**
   * Admin update with validation + audit trail. Never trusts the AI: only the
   * admin key can reach this. Records status_change / assignment / follow_up.
   */
  async updateLeadWithAudit(
    id: string,
    update: LeadUpdate,
    actor = 'admin'
  ): Promise<LeadResponse | null> {
    const r = this.repository;
    const existing = await r.getLead(id);
    if (!existing) return null;

    if (update.status !== undefined && update.status !== existing.status) {
      if (!isValidStatusTransition(existing.status, update.status)) {
        throw new LeadStatusTransitionError(existing.status, update.status);
      }
    }

    const lead = await r.updateLead(id, update);
    if (!lead) return null;

    if (update.status !== undefined && update.status !== existing.status) {
      await r.createLeadActivity({
        leadId: id,
        type: 'status_change',
        description: `Status: ${existing.status} → ${update.status}`,
        createdBy: actor,
      });
      console.log(`[Lead] status_change id=${id} ${existing.status} → ${update.status}`);
    }
    if (update.assignedTo !== undefined && update.assignedTo !== existing.assignedTo && update.assignedTo) {
      await r.createLeadActivity({
        leadId: id,
        type: 'assignment',
        description: `Lead atribuído a ${update.assignedTo}`,
        createdBy: actor,
      });
      console.log(`[Lead] assignment id=${id} → ${update.assignedTo}`);
    }
    if (
      (update.nextAction !== undefined && update.nextAction !== existing.nextAction) ||
      (update.followUpAt !== undefined && update.followUpAt !== existing.followUpAt)
    ) {
      const nextAction = update.nextAction ?? existing.nextAction ?? '—';
      const followAt = update.followUpAt ?? existing.followUpAt;
      await r.createLeadActivity({
        leadId: id,
        type: 'follow_up',
        description: `Próximo passo: ${nextAction}${followAt ? ` (em ${followAt})` : ''}`,
        createdBy: actor,
      });
      console.log(`[Lead] follow_up id=${id} action=${nextAction}`);
    }

    return lead;
  }
}

export const leadService = new LeadService();