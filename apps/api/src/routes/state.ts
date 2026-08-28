import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { 
  StateResponse,
  StateUpdate
} from '@shared/models';

export async function stateRoutes(fastify: FastifyInstance) {
  // Get the current state snapshot for a project
  fastify.get('/:projectId/state', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const state = await repo.getProjectState(projectId);
    if (!state) {
      // If no state exists, create an initial one
      const initialState = await repo.createInitialState(projectId);
      reply.send(initialState);
    } else {
      reply.send(state);
    }
  });

  // Update the state snapshot for a project (upsert)
  fastify.put('/:projectId/state', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const stateData = request.body as StateUpdate;
    const updatedState = await repo.updateProjectState(projectId, stateData);
    reply.send(updatedState);
  });
}