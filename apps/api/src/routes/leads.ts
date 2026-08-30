import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { LeadCreate } from '@shared/models';

export async function leadRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const payload = request.body as LeadCreate;

    if (!payload.name || payload.name.trim().length === 0) {
      return reply.code(400).send({ error: 'Name is required' });
    }

    try {
      const lead = await repo.createLead({
        diagnosticId: payload.diagnosticId,
        sessionId: payload.sessionId,
        name: payload.name.trim(),
        email: payload.email?.trim() || undefined,
        phone: payload.phone?.trim() || undefined,
        company: payload.company?.trim() || undefined,
        notes: payload.notes?.trim() || undefined,
      });
      reply.code(201).send(lead);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.get('/', async (request, reply) => {
    const { status } = request.query as { status?: string };
    try {
      const leads = await repo.listLeads(status);
      reply.send(leads);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const payload = request.body as Partial<LeadCreate & { status: string }>;

    try {
      const lead = await repo.updateLead(id, payload);
      if (!lead) {
        return reply.code(404).send({ error: 'Lead not found' });
      }
      reply.send(lead);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}
