import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import { requireAdminKey } from '../lib/auth';
import { leadLimiter, makeRateLimitHook } from '../lib/rate-limit';
import { dispatchLeadNotifications } from '../services/notification-dispatch';
import {
  LeadCreateInputSchema,
  LeadUpdateSchema,
  ActivityCreateSchema,
  ResourceIdSchema,
  validateInput,
} from '../lib/validation';
import {
  leadService,
  LeadStatusTransitionError,
} from '../services/lead-service';


export async function leadRoutes(fastify: FastifyInstance) {
  // Public: accept a qualified lead from the Discovery flow.
  fastify.post('/', { onRequest: makeRateLimitHook(leadLimiter) }, async (request, reply) => {
    const input = validateInput(LeadCreateInputSchema, request.body as unknown);
    if (!input.ok) {
      return reply.code(400).send({ error: input.error });
    }

    try {
      const result = await leadService.createLeadFromDiscovery({
        diagnosticId: input.data.diagnosticId || undefined,
        sessionId: input.data.sessionId || undefined,
        name: input.data.name,
        email: input.data.email ? input.data.email.trim() : undefined,
        phone: input.data.phone ? input.data.phone.trim() : undefined,
        company: input.data.company ? input.data.company.trim() : undefined,
        notes: input.data.notes ? input.data.notes.trim() : undefined,
      });

      // Best-effort notification dispatch (internal + client confirmation).
      // Fires ONLY on new leads (result.created === true); idempotent retries
      // send nothing — preventing duplicated emails. Never throws.
      dispatchLeadNotifications(result);

      return reply.code(result.created ? 201 : 200).send(result.lead);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // ── Admin / CRM ─────────────────────────────────────────────────────────

  // GET /api/leads
  fastify.get('/', { onRequest: requireAdminKey }, async (request, reply) => {
    const { status } = request.query as { status?: string };
    try {
      if (status !== undefined && status !== null && status !== '' && !(['new','contacted','consultation','proposal','won','lost'] as string[]).includes(status)) {
        return reply.code(400).send({ error: 'Invalid status filter' });
      }
      const leads = await repo.listLeads(status || undefined);
      return reply.send(leads);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/leads/:id
  fastify.get('/:id', { onRequest: requireAdminKey }, async (request, reply) => {
    const params = validateInput(ResourceIdSchema, request.params as unknown);
    if (!params.ok) return reply.code(400).send({ error: params.error });

    try {
      const lead = await repo.getLead(params.data.id);
      if (!lead) return reply.code(404).send({ error: 'Lead not found' });
      return reply.send(lead);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // PATCH /api/leads/:id — admin update with status-transition + audit trail.
  fastify.patch('/:id', { onRequest: requireAdminKey }, async (request, reply) => {
    const params = validateInput(ResourceIdSchema, request.params as unknown);
    if (!params.ok) return reply.code(400).send({ error: params.error });
    const input = validateInput(LeadUpdateSchema, request.body as unknown);
    if (!input.ok) return reply.code(400).send({ error: input.error });

    try {
      const lead = await leadService.updateLeadWithAudit(params.data.id, input.data);
      if (!lead) return reply.code(404).send({ error: 'Lead not found' });
      return reply.send(lead);
    } catch (error) {
      if (error instanceof LeadStatusTransitionError) {
        return reply.code(409).send({ error: error.message });
      }
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/leads/:id/activities
  fastify.get('/:id/activities', { onRequest: requireAdminKey }, async (request, reply) => {
    const params = validateInput(ResourceIdSchema, request.params as unknown);
    if (!params.ok) return reply.code(400).send({ error: params.error });

    try {
      const lead = await repo.getLead(params.data.id);
      if (!lead) return reply.code(404).send({ error: 'Lead not found' });
      const activities = await repo.listLeadActivities(params.data.id);
      return reply.send(activities);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // POST /api/leads/:id/activities
  fastify.post('/:id/activities', { onRequest: requireAdminKey }, async (request, reply) => {
    const params = validateInput(ResourceIdSchema, request.params as unknown);
    if (!params.ok) return reply.code(400).send({ error: params.error });
    const input = validateInput(ActivityCreateSchema, request.body as unknown);
    if (!input.ok) return reply.code(400).send({ error: input.error });

    try {
      const lead = await repo.getLead(params.data.id);
      if (!lead) return reply.code(404).send({ error: 'Lead not found' });

      const activity = await repo.createLeadActivity({
        leadId: params.data.id,
        type: input.data.type,
        description: input.data.description,
        createdBy: input.data.createdBy,
      });
      console.log(`[Lead] activity created lead=${params.data.id} type=${input.data.type}`);
      return reply.code(201).send(activity);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}