import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { ProjectCreate } from '@shared/models';

export async function projectRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_request, reply) => {
    const projects = await repo.listProjects();
    reply.send(projects);
  });

  fastify.post('/', async (request, reply) => {
    const projectData = request.body as ProjectCreate;
    const project = await repo.createProject(projectData);
    reply.code(201).send(project);
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = await repo.getProject(id);
    if (!project) {
      return reply.code(404).send({ error: 'Project not found' });
    }
    reply.send(project);
  });
}
