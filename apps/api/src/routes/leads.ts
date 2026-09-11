import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import { requireAdminKey } from '../lib/auth';
import { leadLimiter, makeRateLimitHook } from '../lib/rate-limit';
import { notificationService } from '../services/notification';
import { LeadCreateInputSchema, validateInput, type LeadCreateInput } from '../lib/validation';

export async function leadRoutes(fastify: FastifyInstance) {
  fastify.post('/', { onRequest: makeRateLimitHook(leadLimiter) }, async (request, reply) => {
    const input = validateInput(LeadCreateInputSchema, request.body as unknown);
    if (!input.ok) {
      return reply.code(400).send({ error: input.error });
    }

    try {
      const lead = await repo.createLead({
        diagnosticId: input.data.diagnosticId || undefined,
        sessionId: input.data.sessionId || undefined,
        name: input.data.name,
        email: input.data.email ? input.data.email.trim() : undefined,
        phone: input.data.phone ? input.data.phone.trim() : undefined,
        company: input.data.company ? input.data.company.trim() : undefined,
        notes: input.data.notes ? input.data.notes.trim() : undefined,
      });

      // Propagate the deterministic lead score from the session's diagnostic.
      // Score/priority are computed by the backend (Diagnostic Engine), never
      // trusted from the client payload.
      if (lead.sessionId) {
        const diagnostic = await repo.getDiagnosticBySession(lead.sessionId);
        if (diagnostic) {
          const enriched = await repo.updateLead(lead.id, {
            score: diagnostic.score,
            priority: diagnostic.priority,
            classification: diagnostic.classification,
            requiresHumanReview: diagnostic.requiresHumanReview,
          });
          if (enriched) {
            lead.score = enriched.score;
            lead.priority = enriched.priority;
            lead.classification = enriched.classification;
            lead.requiresHumanReview = enriched.requiresHumanReview;
          }
        }
      }

      // Best-effort team notification for the new lead (never throws).
      notificationService
        .notifyNewDiagnostic({
          diagnosticId: lead.diagnosticId || '',
          sessionId: lead.sessionId || '',
          problemIdentified: input.data.notes?.trim() || 'Lead submetido após diagnóstico',
          technologiesNeeded: [],
          complexity: 'low',
          nextStep: 'budget',
          confidence: 0,
          score: lead.score ?? undefined,
          classification: lead.classification ?? undefined,
          priority: lead.priority ?? undefined,
          requiresHumanReview: lead.requiresHumanReview ?? undefined,
          createdAt: lead.createdAt,
          lead: {
            name: lead.name,
            email: lead.email ?? undefined,
            phone: lead.phone ?? undefined,
            company: lead.company ?? undefined,
          },
        })
        .catch(() => undefined);

      return reply.code(201).send(lead);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/', { onRequest: requireAdminKey }, async (request, reply) => {
    const { status } = request.query as { status?: string };
    try {
      const leads = await repo.listLeads(status);
      return reply.send(leads);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  fastify.patch('/:id', { onRequest: requireAdminKey }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const payload = request.body as Partial<LeadCreateInput & { status: string }>;

    try {
      const lead = await repo.updateLead(id, payload);
      if (!lead) {
        return reply.code(404).send({ error: 'Lead not found' });
      }
      return reply.send(lead);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}