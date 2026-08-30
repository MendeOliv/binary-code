import dotenv from 'dotenv';
import fastify from 'fastify';
import { supabase } from '@db/supabase';

// Load environment variables from .env file
dotenv.config();

const server = fastify({
  logger: true,
});

// Health check route
server.get('/health', async (_request, reply) => {
  return { status: 'ok', version: '1.0.0', name: 'Código Binário API' };
});

// Test Supabase connection
server.get('/test-db', async (_request, reply) => {
  const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
  if (error) {
    return reply.status(500).send({ error: error.message });
  }
  return { dbConnected: true, count: data };
});

// Import and register routes
import { projectRoutes } from './routes/projects';
import { chatRoutes } from './routes/chat';
import { memoryRoutes } from './routes/memory';
import { stateRoutes } from './routes/state';
import { decisionRoutes } from './routes/decisions';
import { requirementRoutes } from './routes/requirements';
import { taskRoutes } from './routes/tasks';
import { conflictRoutes } from './routes/conflicts';
import { logRoutes } from './routes/logs';
import { discoveryRoutes } from './routes/discovery';
import { leadRoutes } from './routes/leads';

// Discovery pipeline (Binary Diagnostic)
server.register(discoveryRoutes, { prefix: '/api/discovery' });
server.register(leadRoutes, { prefix: '/api/leads' });

// Project-scoped routes
server.register(projectRoutes, { prefix: '/api/projects' });
server.register(chatRoutes, { prefix: '/api/projects' });
server.register(memoryRoutes, { prefix: '/api/projects' });
server.register(stateRoutes, { prefix: '/api/projects' });
server.register(decisionRoutes, { prefix: '/api/projects' });
server.register(requirementRoutes, { prefix: '/api/projects' });
server.register(taskRoutes, { prefix: '/api/projects' });
server.register(conflictRoutes, { prefix: '/api/projects' });
server.register(logRoutes, { prefix: '/api/projects' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Server listening on ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
