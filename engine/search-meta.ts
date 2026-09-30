/**
 * The only place page metadata and JSON-LD are built.
 *
 * Next merges metadata shallowly (a page's openGraph replaces the layout's
 * outright), so `pageMeta()` always returns the complete object. Structured
 * data carries only confirmed facts: a placeholder phone or address is never
 * emitted, even though the page text shows it while the site is noindex.
 *
 * @id scheme: <origin>/the-firm#hss-firm, <origin>/the-firm#hss-owner,
 * <origin>/#hss-site, and <page url>#hss-service / #hss-faq / #hss-trail.
 */
import type { Metadata } from 'next';
import { absolute, known, origin, profile, trackingId } from '@/business/profile';
import { repairAreas } from '@/copy/repair-areas';
import type { QA, ServicePage } from '@/copy/services';
import { mayIndex } from '@/engine/route-plan';

export const FIRM_ID = `${origin}/the-firm#hss-firm`;
export const OWNER_ID = `${origin}/the-firm#hss-owner`;
export const SITE_ID = `${origin}/#hss-site`;

const DEFAULT_IMAGE = '/work/black-aluminium-shopfront-parade-obscured-glass.jpg';

export interface PageMetaInput {
  path: string;
  title: string;
  description: string;
  image?: string;
}

export function pageMeta({ path, title, description, image }: PageMetaInput): Metadata {
  const url = absolute(path);
  const index = mayIndex(path);
  return {
    title: path === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: profile.name,
      url,
      title,
      description,
      images: [{ url: absolute(image ?? DEFAULT_IMAGE) }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** Site-wide metadata for the root layout. */
export function rootMeta(): Metadata {
  const google = trackingId(profile.tracking.searchConsoleToken);
  const bing = trackingId(profile.tracking.bingToken);
  return {
    metadataBase: new URL(origin),
    title: { default: profile.name, template: `%s · ${profile.name}` },
    description: profile.oneLiner,
    applicationName: profile.name,
    formatDetection: { telephone: false },
    verification: {
      ...(google ? { google } : {}),
      ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
    },
  };
}

/* ── JSON-LD ─────────────────────────────────────────────────────────── */

type Node = Record<string, unknown>;

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

const drop = (n: Node): Node =>
  Object.fromEntries(Object.entries(n).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)));

const unitedKingdom = { '@type': 'Country', name: 'United Kingdom' };

export function repairAreaServed(): Node[] {
  return [
    { '@type': 'City', name: 'Birmingham' },
    ...repairAreas().map((a) => ({ '@type': 'Place', name: a.name })),
  ];
}

export function firmNode(): Node {
  const phone = known(profile.phone);
  const address = known(profile.address);
  const base = known(profile.base);
  const hours = known(profile.hours);
  const owner = known(profile.owner);
  return drop({
    '@type': 'HomeAndConstructionBusiness',
    '@id': FIRM_ID,
    name: profile.name,
    url: absolute('/'),
    description: profile.oneLiner,
    image: absolute(DEFAULT_IMAGE),
    telephone: phone?.e164,
    email: known(profile.email),
    address: address
      ? {
          '@type': 'PostalAddress',
          streetAddress: address.street,
          addressLocality: address.city,
          postalCode: address.postcode,
          addressCountry: 'GB',
        }
      : undefined,
    geo: base ? { '@type': 'GeoCoordinates', latitude: base.lat, longitude: base.lng } : undefined,
    openingHours: hours?.map((h) => `${h.days} ${h.open}-${h.close}`),
    knowsLanguage: known(profile.languages),
    areaServed: [unitedKingdom, ...repairAreaServed()],
    founder: owner ? { '@id': OWNER_ID } : undefined,
    sameAs: profile.sameAs,
  });
}

/** Only emitted once the owner's details are real. */
export function ownerNode(): Node | undefined {
  const owner = known(profile.owner);
  if (!owner) return undefined;
  return { '@type': 'Person', '@id': OWNER_ID, name: owner.name, jobTitle: owner.trade, worksFor: { '@id': FIRM_ID } };
}

export function siteNode(): Node {
  return { '@type': 'WebSite', '@id': SITE_ID, url: absolute('/'), name: profile.name, publisher: { '@id': FIRM_ID } };
}

const PRICE_KEY: Record<string, keyof typeof profile.prices.value> = {
  '/aluminium-shopfronts': 'shopfront',
  '/roller-shutters': 'shutterManual',
  '/automatic-doors': 'autoDoors',
  '/security-doors': 'steelDoor',
  '/aluminium-doors': 'aluminiumDoor',
  '/shutter-repairs': 'shutterRepair',
  '/shopfront-glass': 'glassPane',
  '/lock-and-door-repairs': 'lockRepair',
};

export function serviceNode(s: ServicePage): Node {
  const prices = known(profile.prices);
  const band = prices ? prices[PRICE_KEY[s.path]] : undefined;
  return drop({
    '@type': 'Service',
    '@id': `${absolute(s.path)}#hss-service`,
    name: s.name,
    serviceType: s.serviceType,
    description: s.answer,
    url: absolute(s.path),
    provider: { '@id': FIRM_ID },
    areaServed: s.kind === 'install' ? unitedKingdom : repairAreaServed(),
    offers: band
      ? {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: band.from,
            maxPrice: band.to,
            priceCurrency: 'GBP',
          },
        }
      : undefined,
  });
}

export function faqNode(path: string, questions: QA[]): Node | undefined {
  if (questions.length === 0) return undefined;
  return {
    '@type': 'FAQPage',
    '@id': `${absolute(path)}#hss-faq`,
    mainEntity: questions.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: plain([...qa.a, ...(qa.list ?? [])].join(' ')),
      },
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function trailNode(path: string, trail: Crumb[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absolute(path)}#hss-trail`,
    itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absolute(c.path) })),
  };
}

export function graph(...nodes: (Node | undefined)[]): Node {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
