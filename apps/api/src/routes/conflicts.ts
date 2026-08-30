import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { ConflictCreate } from '@shared/models';

export async function conflictRoutes(fastify: FastifyInstance) {
  fastify.get('/:projectId/conflicts', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { resolved } = request.query as { resolved?: string };
    try {
      const resolvedBool = resolved !== undefined ? resolved === 'true' : undefined;
      const conflicts = await repo.listConflicts(projectId, resolvedBool);
      reply.send(conflicts);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.post('/:projectId/conflicts', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const data = request.body as Omit<ConflictCreate, 'projectId'>;
    try {
      const conflict = await repo.createConflict({ ...data, projectId } as ConflictCreate);
      reply.code(201).send(conflict);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.patch('/:projectId/conflicts/:id/resolve', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { resolution } = request.body as { resolution: string };
    try {
      const conflict = await repo.resolveConflict(id, resolution);
      if (!conflict) return reply.code(404).send({ error: 'Conflict not found' });
      reply.send(conflict);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}
