import type { GetServerSideProps } from 'next';
import { developers } from '../lib/developers';
import { SITE_URL } from '../lib/site';

/**
 * /sitemap.xml — generated from the real route list so it can never drift from
 * the public pages. Every URL is absolute and uses the official domain
 * (lib/site.ts).
 *
 * Deliberately excluded: /api/* (not content), admin-only and internal session
 * routes (none are reachable in the web app), and any non-indexable route.
 */
const PUBLIC_PAGES = [
  '/',
  '/solutions',
  '/projects',
  '/developers',
  '/diagnostic',
  '/privacidade',
  '/termos',
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildSitemap(): string {
  const paths = [...PUBLIC_PAGES, ...developers.map((dev) => `/developers/${dev.slug}`)];

  const entries = paths
    .map((path) => {
      const loc = escapeXml(path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);
      const priority = path === '/' ? '1.0' : path === '/diagnostic' ? '0.9' : '0.7';
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        '    <changefreq>monthly</changefreq>',
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.write(buildSitemap());
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
