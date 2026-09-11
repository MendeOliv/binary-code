/**
 * Lightweight per-IP rate limiter (sliding window) for public endpoints.
 *
 * Intentionally simple and dependency-free (spec §4) — protects the AI budget
 * and prevents spam without adding a heavy solution. It is in-memory, which is
 * appropriate here: a single API instance on Render. Weaknesses of a purely
 * memory store (multi-instance) are acceptable for this stage and can be
 * swapped for a Redis store later without changing the HTTP contract.
 *
 * Tunable via env:
 *   RATE_LIMIT_WINDOW_SECONDS (default 60)
 *   RATE_LIMIT_MAX_REQUESTS   (default 20 requests per window per IP)
 *   RATE_LIMIT_DISABLED=1     (opt out)
 */
import { FastifyRequest, FastifyReply } from 'fastify';

interface Bucket {
  windowStart: number;
  count: number;
}

export class SlidingWindowLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly windowSeconds = Number(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60,
    private readonly maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 20
  ) {}

  private clientIp(request: FastifyRequest): string {
    // Render sits behind a proxy — trust X-Forwarded-For only when configured.
    if (process.env.APP_TRUST_PROXY === 'true') {
      const fwd = request.headers['x-forwarded-for'];
      if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
    }
    return request.ip || 'unknown';
  }

  /** Returns true when the request is allowed. */
  allow(request: FastifyRequest): boolean {
    if (process.env.RATE_LIMIT_DISABLED === '1') return true;
    if (this.maxRequests <= 0) return true;

    const key = this.clientIp(request);
    const now = Date.now();
    const windowMs = this.windowSeconds * 1000;

    let bucket = this.buckets.get(key);
    if (!bucket || now - bucket.windowStart >= windowMs) {
      bucket = { windowStart: now, count: 0 };
      this.buckets.set(key, bucket);
    }

    bucket.count += 1;
    if (bucket.count > this.maxRequests) {
      this.periodicCleanup(now);
      return false;
    }
    return true;
  }

  /** Best-effort memory hygiene so the map doesn't grow unboundedly. */
  private periodicCleanup(now: number): void {
    if (this.buckets.size < 10_000) return;
    const windowMs = this.windowSeconds * 1000;
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.windowStart >= windowMs) this.buckets.delete(key);
    }
  }

  reset(): void {
    this.buckets = new Map();
  }
}

export const discoveryLimiter = new SlidingWindowLimiter();
export const leadLimiter = new SlidingWindowLimiter();

/** Factory returning a Fastify onRequest hook bound to a limiter. */
export function makeRateLimitHook(limiter: SlidingWindowLimiter) {
  return async function rateLimitHook(request: FastifyRequest, reply: FastifyReply) {
    if (!limiter.allow(request)) {
      return reply.code(429).send({ error: 'Too many requests. Please try again later.' });
    }
    return undefined;
  };
}