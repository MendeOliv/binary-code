import dotenv from 'dotenv';

dotenv.config();

import fastify from 'fastify';
import cors from '@fastify/cors';
import { supabase, pingSupabase } from '@db/supabase';
import { requireAdminKey } from './lib/auth';
import { resolveAllowedOrigins } from './lib/cors';
import { discoveryLimiter, resolveTrustProxy } from './lib/rate-limit';

const server = fastify({
  logger: true,
  // Render sits behind a proxy. We trust a BOUNDED number of hops (see
  // resolveTrustProxy) instead of `true`, so a client cannot spoof its own
  // rate-limit identity by prepending X-Forwarded-For. A numeric hop count is
  // supported by Fastify/proxy-addr at runtime but missing from its TS types,
  // hence the assertion.
  trustProxy: resolveTrustProxy() as unknown as boolean,
});

// ── Security headers (defence in depth) ───────────────────────────────────
// Applied to every API response. `nosniff` stops MIME confusion, the frame
// headers block embedding, the CSP locks the API down to a non-renderable
// resource, and the Referrer-Policy avoids leaking URLs. HSTS is terminated by
// the Render edge (HTTPS-only in production) — it is intentionally not set
// here to avoid pinning a per-deployment subdomain.
server.addHook('onSend', async (_request, reply, payload) => {
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('Referrer-Policy', 'no-referrer');
  reply.header('Cross-Origin-Resource-Policy', 'same-site');
  reply.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  return payload;
});

// ── CORS ─────────────────────────────────────────────────────────────────
// Explicit browser allow-list (see lib/cors.ts): production only accepts the
// official website origin, a wildcard is never honoured.
const allowedOrigins = resolveAllowedOrigins();

server.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server). Browsers always
    // send Origin on cross-origin requests, so this is not a CORS bypass.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Disallowed origin: authorise nothing. Returning `false` (instead of an
      // Error) makes @fastify/cors simply omit the CORS headers, so the browser
      // blocks the response without the API turning a rejected preflight into a
      // noisy 500.
      callback(null, false);
    }
  },
  // Authentication is header-based (X-Admin-Key / Authorization: Bearer), never
  // cookie-based, so cross-origin credentials are not needed and stay off.
  credentials: false,
});

// Health check route.
//
// Public, fast and safe. Besides reporting liveness it performs one extremely
// light READ against Supabase (see pingSupabase) so a free external cron can
// keep the Render service and the Supabase connection warm. The response keeps
// the exact same shape as before; only `status` flips to 'degraded' when the
// probe fails. The endpoint NEVER fails because of Supabase: it always returns
// HTTP 200 and the failed probe is logged server-side instead of being thrown.
server.get('/health', async (request) => {
  const dbOk = await pingSupabase();
  if (!dbOk) {
    request.log.warn('health: supabase probe failed (degraded)');
  }
  return {
    status: dbOk ? 'ok' : 'degraded',
    version: '1.0.0',
    name: 'Código Binário API',
  };
});

// Minimal service-identification root (spec §20). Healthcheck remains /health.
server.get('/', async (_request, reply) => {
  return { name: 'Código Binário API', status: 'ok', health: '/health' };
});

// Test Supabase connection (kept minimal; no sensitive data exposed).
// ADMIN-ONLY: it must never be publicly reachable in production. Without
// ADMIN_API_KEY the route fails closed (503) — see lib/auth.ts.
server.get('/test-db', { onRequest: requireAdminKey }, async (_request, reply) => {
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