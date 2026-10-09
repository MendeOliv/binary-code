/**
 * Schema.org (JSON-LD) builders for the public pages.
 *
 * Every absolute URL is derived from `lib/site.ts`, so structured data can never
 * drift from the canonical domain. `Organization` / `WebSite` are defined once
 * on the home page with stable `@id`s; other pages reference those entities by
 * `@id` instead of re-declaring them.
 *
 * Only facts that are verifiable on the site are emitted here — no address,
 * phone number, ratings, awards, certifications, prices or client counts.
 */
import { OFFICIAL_SITE_URL, canonicalUrl } from './site';

export const ORGANIZATION_ID = `${OFFICIAL_SITE_URL}/#organization`;
export const WEBSITE_ID = `${OFFICIAL_SITE_URL}/#website`;

/** Reference to the Organization node declared on the home page. */
export const organizationRef = { '@id': ORGANIZATION_ID } as const;
/** Reference to the WebSite node declared on the home page. */
export const websiteRef = { '@id': WEBSITE_ID } as const;

/** Site language, matching <html lang> in pages/_document.tsx. */
export const LANGUAGE = 'pt-AO';

type WebPageType = 'WebPage' | 'CollectionPage' | 'ProfilePage' | 'FAQPage';

interface WebPageInput {
  /** Public page path, e.g. '/solutions'. */
  path: string;
  title: string;
  description: string;
  type?: WebPageType;
}

/** WebPage node: identifies the page itself and links it to the site/entity. */
export function webPage({ path, title, description, type = 'WebPage' }: WebPageInput) {
  const url = canonicalUrl(path);
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: LANGUAGE,
    isPartOf: websiteRef,
    about: organizationRef,
    publisher: organizationRef,
  };
}

/**
 * BreadcrumbList node. Only mark this up where a visible breadcrumb trail
 * exists (currently the developer profile pages) — a breadcrumb without a
 * visible equivalent is not a valid representation of the page.
 */
export function breadcrumb(path: string, trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl(path)}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

/**
 * ItemList of Service nodes — used where the page actually describes the
 * services offered (e.g. /solutions). Each service is attributed to the
 * Organization by `@id`.
 */
export function serviceList(
  path: string,
  services: { name: string; description: string }[]
) {
  const url = canonicalUrl(path);
  return {
    '@type': 'ItemList',
    '@id': `${url}#services`,
    name: 'Serviços da Código Binário',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        serviceType: service.name,
        provider: organizationRef,
        url,
      },
    })),
  };
}

/** Wraps nodes into a single `@graph` document for one <script> tag. */
export function graph(...nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
