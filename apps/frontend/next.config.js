/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Handle API proxying to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
      },
    ];
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'cdn.tailwindcss.com', 'fonts.googleapis.com'],
  },
};

module.exports = nextConfig;