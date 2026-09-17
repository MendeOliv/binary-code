/**
 * Browser CORS allow-list resolution.
 *
 * The allow-list is ALWAYS explicit — a wildcard ('*') is never honoured, in
 * any environment. So a browser origin is either listed or rejected, and
 * production can never be left accepting "*".
 *
 * Resolution order:
 *   1. `CORS_ORIGINS` (comma-separated) when it contains at least one real
 *      origin — the '*'-only or empty value falls through to (2).
 *   2. Environment defaults: the official website in production, the local
 *      Next.js dev servers otherwise.
 *
 * `https://www.codigobinario.it.ao` is deliberately NOT part of the default:
 * it must only be added once that hostname actually exists and is configured.
 */

/** Official website origin — the only default accepted in production. */
export const OFFICIAL_WEB_ORIGINS = ['https://codigobinario.it.ao'];

/** Local Next.js dev servers — the only default accepted outside production. */
export const DEV_WEB_ORIGINS = ['http://localhost:3000', 'http://localhost:3001'];

export function resolveAllowedOrigins(env: NodeJS.ProcessEnv = process.env): string[] {
  const configured = (env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured.includes('*')) {
    console.warn(
      '[CORS] Ignoring wildcard "*" in CORS_ORIGINS — an explicit origin allow-list is required.'
    );
  }

  const explicit = configured.filter((origin) => origin !== '*');
  if (explicit.length > 0) return explicit;

  return env.NODE_ENV === 'production' ? [...OFFICIAL_WEB_ORIGINS] : [...DEV_WEB_ORIGINS];
}
