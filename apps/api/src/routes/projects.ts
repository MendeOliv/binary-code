import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { 
  ProjectCreate, 
  ProjectResponse,
  DecisionCreate,
  RequirementCreate,
  TaskCreate,
  MemoryItemCreate,
  StateUpdate,
  ConflictCreate,
  RequestLogResponse
} from '@shared/models';

export async function projectRoutes(fastify: FastifyInstance) {
  // Get all projects
  fastify.get('/', async (request, reply) => {
    const projects = await repo.listProjects();
    reply.send(projects);
  });

  // Create a new project
  fastify.post('/', async (request, reply) => {
    const projectData = request.body as ProjectCreate;
    const project = await repo.createProject(projectData);
    reply.code(201).send(project);
  });

  // Get a specific project by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = await repo.getProject(id);
    if (!project) {
      return reply.code(404).send({ error: 'Project not found' });
    }
    reply.send(project);
  });
}