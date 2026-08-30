import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { RequirementCreate } from '@shared/models';

export async function requirementRoutes(fastify: FastifyInstance) {
  fastify.get('/:projectId/requirements', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const requirements = await repo.listRequirements(projectId);
      reply.send(requirements);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.post('/:projectId/requirements', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const data = request.body as Omit<RequirementCreate, 'projectId'>;
    try {
      const requirement = await repo.createRequirement({ ...data, projectId } as RequirementCreate);
      reply.code(201).send(requirement);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.get('/:projectId/requirements/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const requirement = await repo.getRequirement(id);
      if (!requirement) return reply.code(404).send({ error: 'Requirement not found' });
      reply.send(requirement);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}
