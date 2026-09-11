import dotenv from 'dotenv';

dotenv.config();

import fastify from 'fastify';
import cors from '@fastify/cors';
import { supabase } from '@db/supabase';
import { requireAdminKey } from './lib/auth';
import { discoveryLimiter } from './lib/rate-limit';

const server = fastify({
  logger: true,
  // Render sits behind a proxy — reflect the real client IP for rate limiting.
  trustProxy: process.env.APP_TRUST_PROXY === 'true',
});

// CORS — allow frontend origin
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

server.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
});

// Health check route
server.get('/health', async (_request, reply) => {
  return { status: 'ok', version: '1.0.0', name: 'Código Binário API' };
});

// Minimal service-identification root (spec §20). Healthcheck remains /health.
server.get('/', async (_request, reply) => {
  return { name: 'Código Binário API', status: 'ok', health: '/health' };
});

// Test Supabase connection (kept minimal; no sensitive data exposed)
server.get('/test-db', async (_request, reply) => {
  const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
  if (error) {
    return reply.status(500).send({ error: 'Database connection failed' });
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

// Discovery pipeline (Binary Diagnostic) — public write endpoints get rate limiting.
server.register(discoveryRoutes, { prefix: '/api/discovery' });

// Apply rate limiting to the public Discovery chat write endpoint.
server.addHook('onRequest', (req, reply, next) => {
  if (req.raw.url?.startsWith('/api/discovery/chat') && req.raw.method === 'POST') {
    if (!discoveryLimiter.allow(req)) {
      return reply.code(429).send({ error: 'Too many requests. Please try again later.' });
    }
  }
  return next();
});

server.register(leadRoutes, { prefix: '/api/leads' });

// Project-scoped routes: INTERNAL/ADMINISTRATIVE. Require the admin key so
// project data is never exposed through public endpoints (spec §5).
server.register(
  async (app) => {
    app.addHook('onRequest', requireAdminKey);
    app.register(projectRoutes);
    app.register(chatRoutes);
    app.register(memoryRoutes);
    app.register(stateRoutes);
    app.register(decisionRoutes);
    app.register(requirementRoutes);
    app.register(taskRoutes);
    app.register(conflictRoutes);
    app.register(logRoutes);
  },
  { prefix: '/api/projects' }
);

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