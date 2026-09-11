import { FastifyInstance } from 'fastify';
import { discoveryOrchestrator, SessionBusyError } from '../services/discovery-orchestrator';
import { requireAdminKey } from '../lib/auth';
import { repo } from '@db/repository';
import { DiscoveryChatInputSchema, validateInput } from '../lib/validation';

export async function discoveryRoutes(fastify: FastifyInstance) {
  fastify.post('/chat', async (request, reply) => {
    const payload = request.body as unknown;
    const input = validateInput(DiscoveryChatInputSchema, payload);

    if (!input.ok) {
      return reply.code(400).send({ error: input.error });
    }

    try {
      const result = await discoveryOrchestrator.handleMessage(
        input.data.message,
        input.data.sessionId || undefined
      );
      return reply.send(result);
    } catch (error) {
      if (error instanceof SessionBusyError) {
        // Another request is already processing this session — ask to retry.
        return reply.code(409).send({
          error: 'Já existe um processamento em curso para esta sessão. Tenta novamente em instantes.',
        });
      }
      const message = error instanceof Error ? error.message : 'unknown';
      // Failures after the AI error-classification are logged, but never
      // reveal internal stack traces / secrets to the client.
      request.log.error({ err: error, sessionId: input.data.sessionId }, 'discovery_chat_failed');
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/session/:sessionId', { onRequest: requireAdminKey }, async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };

    try {
      const session = await repo.getDiscoverySession(sessionId);
      if (!session) {
        return reply.code(404).send({ error: 'Session not found' });
      }

      const messages = await repo.listDiscoveryMessages(sessionId);
      const diagnostic = await repo.getDiagnosticBySession(sessionId);

      return reply.send({ session, messages, diagnostic });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}