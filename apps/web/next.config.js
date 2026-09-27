/**
 * Security headers applied to every response.
 *
 * The Content-Security-Policy below is derived from a live inventory of the
 * production site (https://codigobinario.it.ao), not from guesswork:
 *
 *   - scripts:  self-hosted only (`/_next/static/chunks/*.js`). No third-party
 *               script is loaded. The two non-executable inline scripts are
 *               JSON documents (`__NEXT_DATA__` is application/json, JSON-LD is
 *               application/ld+json), so `script-src` needs neither
 *               'unsafe-inline' nor hashes.
 *   - styles:   one self-hosted stylesheet. Three style="" attributes exist in
 *               the markup, which requires `style-src-attr 'unsafe-inline'`
 *               (documented requirement of the existing JSX — changing it would
 *               alter components, which is out of scope).
 *   - fonts:    Google Fonts (Geist, Inter, JetBrains Mono, Material Symbols
 *               Outlined) via the CSS `@import` in globals.css →
 *               `font.googleapis.com` + `font.gstatic.com`.
 *   - images:   self (`/_next/image` optimiser, logos, public assets). No
 *               external image host is referenced.
 *   - connect:  the production API `https://binary-code-api.onrender.com`
 *               (NEXT_PUBLIC_API_BASE) and self (dev proxy + prefetches).
 *   - frames:   no iframe is used anywhere → object-src/frame-ancestors locked.
 *
 * If a new external dependency (analytics, CDN, payment widget…) is added, its
 * origin must be added here explicitly — never relax a directive to `*`.
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
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Self-hosted Next.js chunks. __NEXT_DATA__ / JSON-LD are non-executable
      // JSON script tags, so no 'unsafe-inline' is needed for scripts.
      "script-src 'self'",
      // Tailwind stylesheet is self-hosted; the three style="" attributes in
      // the markup require the attr-source 'unsafe-inline' (see file header).
      "style-src 'self' 'unsafe-inline'",
      // Google Fonts stylesheet (@import in globals.css) + font binaries.
      // style-src-elem REPLACES style-src for <link> stylesheets, so 'self'
      // (the Tailwind CSS bundle) must be listed here as well.
      "style-src-elem 'self' https://fonts.googleapis.com",
      // Font binaries served by Google Fonts (loaded via the @import above).
      'font-src https://fonts.gstatic.com',
      // Site images are all self-hosted (/_next/image optimiser + /logo, /images).
      "img-src 'self' data:",
      // Production API (NEXT_PUBLIC_API_BASE) + self (dev proxy, prefetch).
      "connect-src 'self' https://binary-code-api.onrender.com",
      // The site uses no forms with cross-origin targets, frames or plugins.
      "form-action 'self'",
      'frame-src \'self\'',
      "object-src 'none'",
      'base-uri \'self\'',
      // The site is never embedded; mirror X-Frame-Options: DENY.
      "frame-ancestors 'none'",
      // No flash of unstyled navigation to a non-HTTPS URL.
      'upgrade-insecure-requests',
    ].join('; '),
  },
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
