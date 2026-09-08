import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Minimal admin protection for internal/administrative API routes.
 *
 * There is no user/auth system in this codebase, and the frontend does NOT
 * consume the admin routes (leads list/patch, discovery session read). To keep
 * the smallest secure surface without introducing a full auth stack, these
 * routes require a shared secret admin key presented as:
 *   - Header `X-Admin-Key: <ADMIN_API_KEY>`, OR
 *   - `Authorization: Bearer <ADMIN_API_KEY>`
 *
 * The key is read from `ADMIN_API_KEY`. If it is not configured the route is
 * disabled (503) rather than opened — fail closed. Public routes (POST /api/leads,
 * POST /api/discovery/chat) are intentionally NOT protected.
 */
export async function requireAdminKey(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply | undefined> {
  const configured = process.env.ADMIN_API_KEY;

  if (!configured) {
    return reply.code(503).send({ error: 'Admin access is not configured on this deployment' });
  }

  const header = request.headers['x-admin-key'];
  const bearer = (request.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const provided: string = (typeof header === 'string' ? header : header?.[0] as string) || bearer;

  if (!provided || !safeEqual(provided, configured)) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  return undefined;
}

/** Constant-time string comparison to avoid timing side-channels. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}