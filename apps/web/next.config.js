/**
 * Security headers applied to every response.
 *
 * Content-Security-Policy is intentionally NOT set here. A policy strict enough
 * to be worth having still needs (a) a verified inventory of Next.js inline
 * bootstrap scripts and (b) the runtime API origin from NEXT_PUBLIC_API_BASE;
 * a wrong policy breaks the app silently instead of failing the build. See the
 * hardening report — CSP is tracked as a separate task.
 */
const securityHeaders = [
  // HTTPS only for this host and its subdomains. `preload` is intentionally
  // omitted: submitting the domain to the preload list is an irreversible,
  // human decision.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // Never let the browser MIME-sniff a response into something executable.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // No feature on this site uses camera/microphone/geolocation/payment/USB.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  // Frame protection (not embeddable anywhere).
  { key: 'X-Frame-Options', value: 'DENY' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Transpile monorepo shared packages
  transpilePackages: ['@shared/*', '@db/*', '@core/*', 'shared', 'db', 'core'],

  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },

  // API proxy — uses env var in production, localhost in dev
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE;
    if (apiBase) {
      // Production: no rewrite needed, frontend calls API directly
      return [];
    }
    // Development: proxy to local backend
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/api/:path*',
          },
        ];
  },

  images: {
    domains: ['lh3.googleusercontent.com', 'cdn.tailwindcss.com', 'fonts.googleapis.com'],
  },
};

module.exports = nextConfig;
