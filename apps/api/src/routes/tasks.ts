import { FastifyInstance } from 'fastify';
import { repo } from '@db/repository';
import type { TaskCreate, TaskUpdate } from '@shared/models';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.get('/:projectId/tasks', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    try {
      const tasks = await repo.listTasks(projectId);
      reply.send(tasks);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.post('/:projectId/tasks', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const data = request.body as Omit<TaskCreate, 'projectId'>;
    try {
      const task = await repo.createTask({ ...data, projectId } as TaskCreate);
      reply.code(201).send(task);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.get('/:projectId/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const task = await repo.getTask(id);
      if (!task) return reply.code(404).send({ error: 'Task not found' });
      reply.send(task);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });

  fastify.patch('/:projectId/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as TaskUpdate;
    try {
      const task = await repo.updateTask(id, data);
      if (!task) return reply.code(404).send({ error: 'Task not found' });
      reply.send(task);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: (error as Error).message });
    }
  });
}
