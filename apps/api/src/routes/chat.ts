import { FastifyInstance } from 'fastify';
import { orchestrator } from '../services/orchestrator';
import type { ChatRequest, ChatResponse } from '@shared/models';

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/:projectId/chat', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const payload = request.body as ChatRequest;

    try {
      // Run orchestrator pipeline
      const result = await orchestrator.runPipeline(projectId, payload.message, payload.provider);
      reply.send(result);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}