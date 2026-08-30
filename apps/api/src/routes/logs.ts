import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';

export async function logRoutes(fastify: FastifyInstance) {
  fastify.get('/:projectId/logs', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const logs = await repo.listRequestLogs(projectId);
      reply.send(logs);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}
