/**
 * Canonical site identity.
 *
 * The official, definitive production domain is https://codigobinario.it.ao.
 * Nothing else (deployment hostnames such as *.vercel.app, preview URLs, custom
 * aliases) may be used as the public identity of this site.
 */

/** Official production origin. Single source of truth for every absolute URL. */
export const OFFICIAL_SITE_URL = 'https://codigobinario.it.ao';

/** Public brand name (used by Open Graph / JSON-LD). */
export const SITE_NAME = 'Código Binário';

/** Default Open Graph / Twitter image — official square logo. */
export const DEFAULT_OG_IMAGE = '/logo/codigo-binario-square.png';

/**
 * Absolute origin used by every SEO tag (canonical, og:url, og:image, Twitter,
 * JSON-LD).
 *
 * Production ALWAYS resolves to the official domain, so a deployment hostname
 * can never leak into canonical/Open Graph tags — even when a build runs on a
 * preview alias. `NEXT_PUBLIC_SITE_URL` is honoured for LOCAL development only
 * (it is public, never a secret) and defaults to the local dev server.
 */
export const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? OFFICIAL_SITE_URL
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Builds the absolute canonical URL for a public page path.
 *
 * `canonicalUrl('/')` → `https://codigobinario.it.ao/`
 * `canonicalUrl('/solutions')` → `https://codigobinario.it.ao/solutions`
 *
 * Should NOT be used for non-indexable routes (/api/*, admin-only or internal
 * session pages) — those must not declare a canonical.

 */
export function canonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${normalized.replace(/\/+$/, '')}`;
}
