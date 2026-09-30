/**
 * Every fact the site states about the business, in one place.
 *
 * Page copy, JSON-LD, llms.txt, the sitemap, robots and the enquiry router all
 * read from here. Anything the owner has not yet confirmed is wrapped in
 * `unconfirmed(...)`, which marks it `isPlaceholder: true`.
 *
 * While any placeholder remains, `indexable` must stay false. The go-live
 * guard (engine/go-live.ts) fails the build otherwise.
 *
 * The placeholder phone numbers sit in Ofcom's ranges reserved for drama and
 * examples (0121 496 0xxx and 07700 900xxx), so they can never ring a real
 * person or collide with another business.
 */

export interface Fact<T> {
  value: T;
  isPlaceholder: boolean;
  /** What the owner needs to supply or confirm. */
  ask?: string;
}

export const confirmed = <T,>(value: T): Fact<T> => ({ value, isPlaceholder: false });
export const unconfirmed = <T,>(value: T, ask: string): Fact<T> => ({ value, isPlaceholder: true, ask });

export interface PriceBand {
  from: number;
  to: number;
  /** How the band is worded after the figures, e.g. "for a single-door frontage". */
  basis: string;
}

export interface Profile {
  name: string;
  domain: string;
  host: string;
  /** The one-line description repeated word for word in copy, JSON-LD, llms.txt and the GBP draft. */
  oneLiner: string;
  /** Search engines may index the site. Leave false until every placeholder is gone. */
  indexable: boolean;

  owner: Fact<{ name: string; trade: string }>;
  team: Fact<string[]>;
  phone: Fact<{ display: string; e164: string }>;
  whatsapp: Fact<{ display: string; e164: string }>;
  email: Fact<string>;
  address: Fact<{ street: string; locality: string; city: string; postcode: string }>;
  /** Where repair distances are measured from. Placeholder: Birmingham city centre. */
  base: Fact<{ lat: number; lng: number }>;
  hours: Fact<{ days: string; open: string; close: string }[]>;
  emergencyHours: Fact<string>;
  languages: Fact<string[]>;
  googleBusinessProfile: Fact<string>;
  companyNumber: Fact<string>;
  vatRegistered: Fact<boolean>;

  repairRadiusMiles: Fact<number>;
  response: Fact<{ emergency: string; standard: string }>;

  prices: Fact<Record<PriceKey, PriceBand>>;
  leadTimes: Fact<Record<LeadKey, string>>;

  /** Slugs from copy/install-cities.ts. At most six until real jobs justify more. */
  installCities: Fact<string[]>;

  tracking: {
    ga4: Fact<string>;
    gtm: Fact<string>;
    googleAdsTag: Fact<string>;
    searchConsoleToken: Fact<string>;
    bingToken: Fact<string>;
  };

  /** Profile URLs that have been fetched and checked live. Empty until they exist. */
  sameAs: string[];

  /** When the page copy was last read through (ISO date). Shown on pages and in dateModified. */
  copyReviewedOn: string;
  /** When the owner last confirmed the price ranges (ISO date). Shown only once confirmed. */
  pricesCheckedOn: Fact<string>;
}

export type PriceKey =
  | 'shopfront'
  | 'shutterManual'
  | 'shutterElectric'
  | 'autoDoors'
  | 'steelDoor'
  | 'fireExitPair'
  | 'aluminiumDoor'
  | 'shutterRepair'
  | 'emergencyCallout'
  | 'glassPane'
  | 'lockRepair';

export type LeadKey =
  | 'shopfront'
  | 'shutter'
  | 'autoDoors'
  | 'steelDoor'
  | 'aluminiumDoor'
  | 'glass';

export const profile: Profile = {
  name: 'High Street Shopfronts',
  domain: 'highstreetshopfronts.co.uk',
  host: 'www.highstreetshopfronts.co.uk',
  oneLiner:
    'Birmingham fitters of aluminium shopfronts, roller shutters and shop doors: new installations anywhere in the UK, repairs across Birmingham.',
  indexable: false,

  owner: unconfirmed(
    { name: 'The owner', trade: 'Shopfront and shutter fitter' },
    'Full name, years on the tools and what they did before starting the firm',
  ),
  team: unconfirmed([], 'Names and roles of the fitters, if they are happy to be named'),

  phone: unconfirmed({ display: '0121 496 0730', e164: '+441214960730' }, 'Main business phone'),
  whatsapp: unconfirmed({ display: '07700 900418', e164: '447700900418' }, 'WhatsApp business number'),
  email: unconfirmed('quotes@highstreetshopfronts.co.uk', 'Confirm this mailbox exists, or give the real address'),
  address: unconfirmed(
    { street: '', locality: '', city: 'Birmingham', postcode: '' },
    'Full Birmingham address, exactly as it will appear on the Google Business Profile',
  ),
  base: unconfirmed({ lat: 52.4797, lng: -1.9026 }, 'Measured from the yard or unit once the address is known'),
  hours: unconfirmed(
    [
      { days: 'Monday to Friday', open: '08:00', close: '18:00' },
      { days: 'Saturday', open: '09:00', close: '14:00' },
    ],
    'Office and phone hours',
  ),
  emergencyHours: unconfirmed('Every day, 7am to 11pm', 'When the emergency repair line is answered'),
  languages: unconfirmed(['English'], 'Every language the team speaks with customers, e.g. Urdu, Punjabi, Bengali'),
  googleBusinessProfile: unconfirmed('', 'Link to the Google Business Profile once it is verified'),
  companyNumber: unconfirmed('', 'Companies House number, if trading as a limited company'),
  vatRegistered: unconfirmed(false, 'Whether prices are quoted plus VAT'),

  repairRadiusMiles: unconfirmed(18, 'How far from the base the repair van will go'),
  response: unconfirmed(
    { emergency: 'within 2 hours', standard: 'the same or next working day' },
    'Honest response times for repair callouts',
  ),

  prices: unconfirmed(
    {
      shopfront: { from: 3500, to: 7500, basis: 'for a typical single-door frontage up to about 5 metres wide' },
      shutterManual: { from: 900, to: 1600, basis: 'over a standard shop window' },
      shutterElectric: { from: 1400, to: 3000, basis: 'with a manual override' },
      autoDoors: { from: 3500, to: 6500, basis: 'for a bi-parting sliding pair with sensors' },
      steelDoor: { from: 900, to: 1800, basis: 'including the frame and locks' },
      fireExitPair: { from: 1400, to: 2600, basis: 'fitted, push bars included' },
      aluminiumDoor: { from: 900, to: 2200, basis: 'including the frame' },
      shutterRepair: { from: 120, to: 350, basis: 'with parts' },
      emergencyCallout: { from: 150, to: 180, basis: 'before parts' },
      glassPane: { from: 250, to: 700, basis: 'toughened or laminated, fitted' },
      lockRepair: { from: 90, to: 300, basis: 'depending on the part' },
    },
    'Real price ranges for each line of work',
  ),
  leadTimes: unconfirmed(
    {
      shopfront: '3 to 5 weeks from signed drawings',
      shutter: '7 to 14 working days',
      autoDoors: '3 to 4 weeks',
      steelDoor: '2 to 3 weeks',
      aluminiumDoor: '2 to 4 weeks',
      glass: '2 to 5 working days for made-to-measure glass',
    },
    'Typical lead times, order to fitted',
  ),

  installCities: unconfirmed(
    ['london', 'manchester', 'bristol', 'leicester', 'nottingham', 'sheffield'],
    'Which cities the fitting team actually travels to; add a city when a job there is done',
  ),

  tracking: {
    ga4: unconfirmed('', 'A GA4 measurement ID created for this site only'),
    gtm: unconfirmed('', 'A GTM container for this site only'),
    googleAdsTag: unconfirmed('', 'This site’s own Google Ads conversion tag (never one used elsewhere)'),
    searchConsoleToken: unconfirmed('', 'Search Console verification token for this domain'),
    bingToken: unconfirmed('', 'Bing Webmaster verification token'),
  },

  sameAs: [],

  copyReviewedOn: '2026-10-01',
  pricesCheckedOn: unconfirmed('', 'The date you last checked the price ranges are right'),
};

/** Canonical origin, no trailing slash. */
export const origin = `https://${profile.host}`;

/** Absolute URL for a path. The home page is the bare origin, as Next renders its canonical. */
export function absolute(path: string): string {
  return path === '/' ? origin : `${origin}${path}`;
}

/** A fact's value only when the owner has confirmed it. */
export function known<T>(fact: Fact<T>): T | undefined {
  return fact.isPlaceholder ? undefined : fact.value;
}

/** Tracking and verification IDs are only emitted when real and non-empty. */
export function trackingId(fact: Fact<string>): string | undefined {
  const v = known(fact);
  return v && v.trim() ? v.trim() : undefined;
}

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
export const pounds = (n: number) => gbp.format(n);

export function priceRange(key: PriceKey): string {
  const band = profile.prices.value[key];
  return `${pounds(band.from)} to ${pounds(band.to)}`;
}

export function priceBasis(key: PriceKey): string {
  return profile.prices.value[key].basis;
}

export const vatNote = () =>
  profile.vatRegistered.value ? 'Prices are plus VAT.' : 'Prices are the full amount you pay.';

export const radius = () => profile.repairRadiusMiles.value;

/** Every placeholder still in the profile, with what the owner needs to supply. */
export function outstandingFacts(): { path: string; ask: string }[] {
  const found: { path: string; ask: string }[] = [];
  const visit = (node: unknown, path: string) => {
    if (!node || typeof node !== 'object') return;
    const rec = node as Record<string, unknown>;
    if ('isPlaceholder' in rec && 'value' in rec) {
      if (rec.isPlaceholder === true) found.push({ path, ask: String(rec.ask ?? '') });
      return;
    }
    for (const [k, v] of Object.entries(rec)) visit(v, path ? `${path}.${k}` : k);
  };
  visit(profile, '');
  return found;
}
