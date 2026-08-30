import { FastifyInstance } from 'fastify';
import { discoveryOrchestrator } from '../services/discovery-orchestrator';
import { repo } from '@db/repository';
import type { DiscoveryChatRequest } from '@shared/models';

export async function discoveryRoutes(fastify: FastifyInstance) {
  fastify.post('/chat', async (request, reply) => {
    const payload = request.body as DiscoveryChatRequest;

    if (!payload.message || payload.message.trim().length === 0) {
      return reply.code(400).send({ error: 'Message is required' });
    }

    try {
      const result = await discoveryOrchestrator.handleMessage(
        payload.message.trim(),
        payload.sessionId
      );
      reply.send(result);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.get('/session/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };

    try {
      const session = await repo.getDiscoverySession(sessionId);
      if (!session) {
        return reply.code(404).send({ error: 'Session not found' });
      }

      const messages = await repo.listDiscoveryMessages(sessionId);
      const diagnostic = await repo.getDiagnosticBySession(sessionId);

      reply.send({ session, messages, diagnostic });
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}
