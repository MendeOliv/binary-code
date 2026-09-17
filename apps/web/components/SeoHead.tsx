import Head from 'next/head';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, canonicalUrl } from '../lib/site';

interface SeoHeadProps {
  /** Page title (also used as og:title / twitter:title). */
  title: string;
  /** Page description (also used as og:description / twitter:description). */
  description: string;
  /** Public page path, e.g. '/' or '/solutions'. Used for canonical + og:url. */
  path: string;
  /** Open Graph object type (default `website`; person profiles use `profile`). */
  type?: string;
  /** Site-relative or absolute Open Graph image. */
  image?: string;
  /** Optional JSON-LD structured data rendered in the document head. */
  jsonLd?: Record<string, unknown>;
}

/**
 * Single source of truth for the `<head>` of every PUBLIC page: canonical URL,
 * Open Graph and Twitter Card. Keeping it here avoids drift and duplicate
 * declarations between `_app`, `_document` and individual pages, and guarantees
 * all absolute URLs use the official domain (see `lib/site.ts`).
 *
 * Reserved for indexable public pages — do not use on internal/admin routes.
 */
export default function SeoHead({
  title,
  description,
  path,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  jsonLd,
}: SeoHeadProps) {
  const url = canonicalUrl(path);
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
