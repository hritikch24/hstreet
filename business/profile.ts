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

  /** A named person, or null when the firm is presented as a company only. */
  owner: Fact<{ name: string; trade: string } | null>;
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
  /** Registered name, exactly as on Companies House. */
  legalName: string;
  /** The registered office, as on Companies House. Shown as a legal line only, never as a place of business. */
  registeredOffice: string;
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
    /** Google Ads conversion actions, as "AW-123/AbC" send_to values. */
    adsConversions: Fact<{ call: string; whatsapp: string; enquiry: string }>;
    searchConsoleToken: Fact<string>;
    bingToken: Fact<string>;
  };

  /** Profile URLs that have been fetched and checked live. Empty until they exist. */
  sameAs: string[];
  /** The "ask for a review" link from the Google Business Profile. Optional. */
  googleReviewLink: string;

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
  | 'lockRepair'
  | 'securityGrille'
  | 'curtainWalling'
  | 'glassDoor'
  | 'canopy'
  | 'autoDoorRepair'
  | 'servicingVisit'
  | 'boardUp';

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
    'Birmingham fitters of aluminium shopfronts, roller shutters and shop doors: new installs anywhere in the UK, repairs within 70 miles.',
  indexable: true,

  // The firm is presented as a company, not a named person.
  owner: confirmed(null),
  team: confirmed([]),

  // One mobile number serves calls and WhatsApp.
  phone: confirmed({ display: '07376 440039', e164: '+447376440039' }),
  whatsapp: confirmed({ display: '07376 440039', e164: '447376440039' }),
  email: confirmed('support@highstreetshopfronts.co.uk'),
  // A service-area business: no street address is published. Only the city is
  // stated, and JSON-LD leaves the street, postcode and geo point out.
  address: confirmed({ street: '', locality: '', city: 'Birmingham', postcode: '' }),
  // Repair distances are measured straight-line from Birmingham city centre.
  base: confirmed({ lat: 52.4797, lng: -1.9026 }),
  hours: confirmed([{ days: 'Every day', open: '00:00', close: '24:00' }]),
  emergencyHours: confirmed('24 hours a day, every day'),
  languages: confirmed(['English']),
  // None yet: the profile is created after launch, as a service-area business with the address hidden.
  googleBusinessProfile: confirmed(''),
  legalName: 'HIGHSTREETSHOPFRONTS LIMITED',
  registeredOffice: '18 Sydney Close, West Bromwich, England, B70 0SR',
  // Checked on Companies House on 26 Oct 2026: active, incorporated 19 Oct 2026.
  companyNumber: confirmed('17529805'),
  vatRegistered: confirmed(false),

  repairRadiusMiles: confirmed(70), // keep in step with oneLiner above
  // No promised arrival time: the owner has not given one, and none is invented.
  response: confirmed({ emergency: 'as soon as we can', standard: 'on a day we agree with you' }),

  // Mid-market guide prices, set by the owner's instruction on 26 Oct 2026: an idea of cost only.
  // Every price is shown as a guide and confirmed in writing by the firm.
  prices: confirmed(
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
      glassPane: { from: 250, to: 700, basis: 'toughened or laminated' },
      lockRepair: { from: 90, to: 300, basis: 'depending on the part' },
      securityGrille: { from: 800, to: 1800, basis: 'for a standard shop window or door opening' },
      curtainWalling: { from: 400, to: 800, basis: 'per square metre of glazed screen, glass and fitting included' },
      glassDoor: { from: 1200, to: 2800, basis: 'for a single frameless door with fittings and lock' },
      canopy: { from: 900, to: 2600, basis: 'for a fixed or folding-arm canopy over one shopfront' },
      autoDoorRepair: { from: 150, to: 450, basis: 'per callout, with common parts' },
      servicingVisit: { from: 90, to: 220, basis: 'per planned visit to one shutter or door set, before parts' },
      boardUp: { from: 180, to: 450, basis: 'including the callout and boards for a standard shopfront' },
    },
  ),
  leadTimes: confirmed({
    shopfront: 'about a week from signed drawings',
    shutter: 'about a week',
    autoDoors: 'about a week',
    steelDoor: 'about a week',
    aluminiumDoor: 'about a week',
    glass: 'about a week',
  }),

  installCities: confirmed(
    ['london', 'manchester', 'bristol', 'leicester', 'nottingham', 'sheffield'],
  ),

  tracking: {
    ga4: confirmed(''),
    gtm: confirmed(''),
    // Google Ads IDs are added in the next deploy, once the conversion actions exist.
    googleAdsTag: confirmed(''),
    adsConversions: confirmed({ call: '', whatsapp: '', enquiry: '' }),
    // Search Console is verified as a Domain property through DNS, so no tag is needed.
    searchConsoleToken: confirmed(''),
    bingToken: confirmed(''),
  },

  sameAs: [],
  googleReviewLink: '',

  copyReviewedOn: '2026-10-26',
  pricesCheckedOn: confirmed('2026-10-26'),
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

/** A price band for chips and tables, shown under a "Guide price" label. */
export function priceRange(key: PriceKey): string {
  const band = profile.prices.value[key];
  return `${pounds(band.from)} to ${pounds(band.to)}`;
}

/**
 * A price band for sentences. Every price on the site is a guide: the owner
 * wants them read as tentative, and each job is priced after photos or a
 * survey.
 */
export function guidePrice(key: PriceKey): string {
  return `about ${priceRange(key)}`;
}

export function priceBasis(key: PriceKey): string {
  return profile.prices.value[key].basis;
}

/** Said wherever a price is given: it is a guide, and whether VAT is extra once that is known. */
export const vatNote = () => {
  const vat = profile.vatRegistered.isPlaceholder ? '' : profile.vatRegistered.value ? ' Prices are plus VAT.' : ' There is no VAT to add.';
  return `This is a guide price; we confirm yours in writing before any work starts.${vat}`;
};

export const radius = () => profile.repairRadiusMiles.value;

/** True once a street address is published. Until then only the city is shown. */
export const hasStreetAddress = () => Boolean(profile.address.value.street);

/** The address as a line of text: the full address if there is one, otherwise just the city. */
export function addressLine(): string {
  const a = profile.address.value;
  return [a.street, a.locality, a.city, a.postcode].filter(Boolean).join(', ');
}

/** "Open 24 hours" for round-the-clock days, otherwise "08:00 to 18:00". */
export const hoursText = (h: { open: string; close: string }) =>
  h.open === '00:00' && h.close === '24:00' ? 'Open 24 hours' : `${h.open} to ${h.close}`;

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

/**
 * Garage doors: two pages drafted 15 Oct 2026 (/garage-door-repairs,
 * /garage-door-installation) that are NOT built until the owner confirms
 * this line of work. Kept outside `profile` on purpose: an unanswered garage
 * question must not hold back the launch of the rest of the site.
 *
 * To publish: get every answer in `asks`, strike door types the firm does not
 * handle, set `installArea`, then swap `unconfirmed(` for `confirmed(`.
 */
export type GarageDoorKind = 'roller' | 'sectional' | 'up-and-over' | 'side-hinged';

export const garageDoors = unconfirmed(
  {
    repairs: ['roller', 'sectional', 'up-and-over', 'side-hinged'] as GarageDoorKind[],
    installs: ['roller', 'sectional', 'up-and-over', 'side-hinged'] as GarageDoorKind[],
    /** 'radius' = new garage doors fitted only within the repair radius; 'uk' = anywhere. */
    installArea: 'radius' as 'radius' | 'uk',
    /** Fitting a motor to a door that is opened by hand today. */
    motorises: true,
  },
  [
    'Does the firm repair garage doors, fit new ones, or both?',
    'Which door types: roller, sectional, up-and-over, side-hinged?',
    'Who does the work: the firm’s own fitters, or another firm it passes the job to?',
    'Garage door installs: Birmingham area only, or anywhere in the UK?',
    'Do the repair response times on the shutter page also apply to garage doors?',
    'Does the firm fit motors to existing manual garage doors?',
    'Guide prices: spring, cable, motor repairs; a new single and a new double door fitted',
    'Who makes the doors you fit (name a maker only if you buy from them direct)?',
    'Is servicing a separate paid job? What is checked, and the price?',
    'Photos of garage doors the firm has repaired or fitted, with town and month',
  ].join(' | '),
);

/** Garage pages exist when confirmed, or as a draft on a preview deployment (never production). */
export function garageLive(): boolean {
  if (!garageDoors.isPlaceholder) return true;
  return process.env.HSS_GARAGE_DRAFT === 'on' && process.env.VERCEL_ENV !== 'production';
}
