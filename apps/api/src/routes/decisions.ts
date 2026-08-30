import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { DecisionCreate, DecisionUpdate } from '@shared/models';

export async function decisionRoutes(fastify: FastifyInstance) {
  // List decisions for a project
  fastify.get('/:projectId/decisions', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { status } = request.query as { status?: string };
    try {
      const decisions = await repo.listDecisions(projectId, status);
      reply.send(decisions);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  // Create a decision
  fastify.post('/:projectId/decisions', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const data = request.body as Omit<DecisionCreate, 'projectId'>;
    try {
      const decision = await repo.createDecision({ ...data, projectId } as DecisionCreate);
      reply.code(201).send(decision);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  // Get a single decision
  fastify.get('/:projectId/decisions/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const decision = await repo.getDecision(id);
      if (!decision) return reply.code(404).send({ error: 'Decision not found' });
      reply.send(decision);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  // Update a decision
  fastify.patch('/:projectId/decisions/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as DecisionUpdate;
    try {
      const decision = await repo.updateDecision(id, data);
      if (!decision) return reply.code(404).send({ error: 'Decision not found' });
      reply.send(decision);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}
