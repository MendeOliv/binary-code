import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { 
  MemoryItemCreate,
  MemoryItemResponse
} from '@shared/models';

export async function memoryRoutes(fastify: FastifyInstance) {
  // Get all memory items for a project
  fastify.get('/:projectId/memory', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const memories = await repo.getMemoryItems(projectId);
    reply.send(memories);
  });

  // Create a new memory item
  fastify.post('/:projectId/memory', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const memoryData = request.body as MemoryItemCreate;
    // Ensure projectId is set
    memoryData.projectId = projectId;
    const memory = await repo.createMemoryItem(memoryData);
    reply.code(201).send(memory);
  });
}