/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Transpile monorepo shared packages
  transpilePackages: ['@shared/*', '@db/*', '@core/*', 'shared', 'db', 'core'],

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
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },

  images: {
    domains: ['lh3.googleusercontent.com', 'cdn.tailwindcss.com', 'fonts.googleapis.com'],
  },
};

module.exports = nextConfig;