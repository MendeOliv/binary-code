/**
 * Discovery session ownership secret (CB-SEC-C).
 *
 * A `sessionId` is an opaque UUID — knowing it must NOT be enough to assume
 * someone else's Discovery session. Every session also carries a 256-bit
 * random secret, generated server-side and returned to the browser exactly
 * once (at session creation). Continuing the session requires BOTH the
 * sessionId AND the matching secret.
 *
 * Storage: only the SHA-256 hash of the secret is persisted (never the raw
 * value), so a database read cannot reveal a usable secret. Because the secret
 * is high-entropy and randomly generated, a plain SHA-256 comparison is
 * sufficient (no slow KDF is needed — that matters for low-entropy passwords,
 * not for 32 random bytes) and lets us use a constant-time comparison.
 *
 * The secret is never logged, never placed in a URL, and never sent anywhere
 * except back to the client that created the session.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** 32 random bytes → 256 bits of entropy, URL-safe (no padding). */
export function generateSessionSecret(): string {
  return randomBytes(32).toString('base64url');
}

/** SHA-256 hex digest of the secret — the only form persisted. */
export function hashSessionSecret(secret: string): string {
  return createHash('sha256').update(secret, 'utf8').digest('hex');
}

/**
 * Constant-time verification: hash the provided secret and compare its digest
 * with the stored one. A missing/blank provided secret, a missing stored hash
 * (e.g. a legacy session) or a length mismatch all fail closed.
 */
export function verifySessionSecret(provided: string | undefined | null, storedHash: string | null | undefined): boolean {
  if (!provided || !storedHash) return false;
  const providedHash = hashSessionSecret(provided);
  const a = Buffer.from(providedHash, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}
