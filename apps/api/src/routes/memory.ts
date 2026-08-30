import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { MemoryItemCreate, MemoryItemResponse } from '@shared/models';

export async function memoryRoutes(fastify: FastifyInstance) {
  fastify.get('/:projectId/memory', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const memories = await repo.getMemoryItems(projectId);
    reply.send(memories);
  });

  fastify.post('/:projectId/memory', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const memoryData = request.body as Omit<MemoryItemCreate, 'projectId'>;
    const memory = await repo.createMemoryItem({ ...memoryData, projectId } as MemoryItemCreate);
    reply.code(201).send(memory);
  });
}
