/**
 * Install city pages: how a job in that city actually runs when the fitting
 * team drives out from Birmingham.
 *
 * UK-wide installation ranks through the service pages and /nationwide, not
 * through city pages. There are at most six here, each written by hand. A new
 * city is added only when a job there is finished, together with its case
 * study. Which cities are published is `profile.installCities`; while that is
 * a placeholder, every city page is noindex.
 *
 * Distances and drive times are approximate, by road, from central Birmingham.
 */
import type { QA } from '@/copy/services';

export interface InstallCity {
  slug: string;
  name: string;
  title: string;
  description: string;
  miles: number;
  drive: string;
  route: string;
  /** How the survey is handled for this city. */
  survey: string;
  /** Local rules and street conditions that change how the job is planned. */
  onTheGround: string[];
  questions: QA[];
}

export const installCities = (): InstallCity[] => [
  {
    slug: 'london',
    name: 'London',
    title: 'Shopfront & Shutter Fitting in London',
    description: 'How a Birmingham fitting team installs aluminium shopfronts, shutters and shop doors in London: survey, borough rules, ULEZ, parking suspensions and lead times.',
    miles: 120,
    drive: 'two and a half to three hours',
    route: 'the M40 or the M1',
    survey:
      'We price from your photos and measurements first, then survey in person before anything is made. For London we often book the survey on the same trip as another job, which keeps the cost down.',
    onTheGround: [
      'The whole of Greater London is inside the Ultra Low Emission Zone, and the central zone has the Congestion Charge on top. Both are part of our travel cost, not an extra.',
      'On a red route there is no stopping outside most shops, so we book a parking bay suspension with the borough where one is needed. Boroughs want notice for this, so it goes in the plan from the start.',
      'Many London high streets are in conservation areas and several boroughs publish their own shopfront design guides. Solid external shutters are often refused in them; internal or open-grille shutters are the usual answer.',
      'Most shopfront jobs in London are done in one visit of one or two days, with the team staying nearby overnight.',
    ],
    questions: [
      {
        q: 'Can a Birmingham firm fit a shopfront in London?',
        a: [
          'Yes. The frames and glass are made to your drawings and brought down on the van, and the team stays until the front is in and locked. What you get is the same as a local fitter; the difference is that we plan the travel and parking properly before the day.',
        ],
      },
      {
        q: 'Will you handle the parking suspension?',
        a: [
          'We tell you what is needed and when, and apply where the borough lets a contractor do it. Some boroughs only accept the application from the business or the landlord, in which case we give you the details to send.',
        ],
      },
    ],
  },
  {
    slug: 'manchester',
    name: 'Manchester',
    title: 'Shopfront Installation in Manchester',
    description: 'How our Birmingham team fits aluminium shopfronts, roller shutters and shop doors in Manchester: survey, travel, timings and working on busy roads.',
    miles: 85,
    drive: 'about two hours',
    route: 'the M6',
    survey:
      'You send photos and measurements on WhatsApp for a ballpark price, then we survey before anything is ordered. Manchester is close enough that the survey is usually a day trip.',
    onTheGround: [
      'Wilmslow Road through Rusholme is a heavy bus corridor, so we plan unloading and the fit around the bus lane hours and use side streets for the van.',
      'Parts of the city centre, including much of the Northern Quarter, are conservation areas, so check with the council before changing the look of a front there.',
      'Most jobs are done in one visit; a two-day fit means one night nearby.',
    ],
    questions: [
      {
        q: 'How long does a shopfront in Manchester take from first message to fitted?',
        a: [
          'The same as anywhere else we fit: a ballpark price within a couple of days of your photos, a survey visit, drawings to sign, then the lead time for manufacture before the fit. The drive does not add to the lead time; it only adds a day to the calendar if the fit runs over.',
        ],
      },
      {
        q: 'Can you repair shutters in Manchester?',
        a: [
          'No. Repairs are Birmingham-only, because we cannot get to a stuck shutter two hours away quickly enough. We fit new shutters in Manchester, and we will tell you honestly if a repair makes more sense than a new one.',
        ],
      },
    ],
  },
  {
    slug: 'bristol',
    name: 'Bristol',
    title: 'Shopfronts & Shutters Fitted in Bristol',
    description: 'How our Birmingham fitters install shopfronts, roller shutters and shop doors in Bristol: the Clean Air Zone, survey, travel and what to plan for.',
    miles: 90,
    drive: 'about an hour and three quarters',
    route: 'the M5',
    survey:
      'We price from your photos and measurements, then survey in person. Bristol surveys are a day trip down the M5.',
    onTheGround: [
      'Central Bristol has a charging Clean Air Zone for older vans. It is part of our travel cost if the job is inside it.',
      'Gloucester Road and the streets off Stokes Croft are mostly independent shops in older terraces: narrow pavements, small frontages and parking on side streets. We bring shorter lengths and a smaller van where access is tight.',
      'Many older frontages in Bristol are in conservation areas, where the council will have a view on materials and shutters.',
    ],
    questions: [
      {
        q: 'Do you fit roller shutters in Bristol?',
        a: [
          'Yes, manual and electric, fitted the same way as our other shutter jobs. For an electric shutter, have a fused spur fitted near the box before we arrive, or ask us to arrange one.',
        ],
      },
    ],
  },
  {
    slug: 'leicester',
    name: 'Leicester',
    title: 'Shopfront & Shutter Fitters for Leicester',
    description: 'Aluminium shopfronts, roller shutters and shop doors fitted in Leicester by our Birmingham team, an hour away: Belgrave Road, Narborough Road and beyond.',
    miles: 43,
    drive: 'about an hour',
    route: 'the M6 and M69',
    survey:
      'Leicester is close enough that we can usually survey within days of your first message, and sometimes on the same day as another job nearby.',
    onTheGround: [
      'Belgrave Road is a long run of jewellers, sari and suit shops and sweet centres, with wide display windows and heavy solid shutters. It is busy from late morning, so we start early.',
      'Narborough Road has a mix of small independent shops and takeaways, with parking on side streets.',
      'An hour each way means most Leicester fits are done as day trips with no overnight stay.',
    ],
    questions: [
      {
        q: 'Can you fit a shopfront on Belgrave Road without closing the shop for days?',
        a: [
          'Usually it is one day, sometimes two, and we keep the doorway usable for as long as we can. A shutter fitted at the same time goes in on the same visit.',
        ],
      },
    ],
  },
  {
    slug: 'nottingham',
    name: 'Nottingham',
    title: 'Shopfront Installation in Nottingham',
    description: 'How our Birmingham team fits aluminium shopfronts, roller shutters and shop doors in Nottingham: tram streets, the Lace Market, travel and lead times.',
    miles: 52,
    drive: 'about an hour and a quarter',
    route: 'the M42, A42 and M1',
    survey:
      'You send photos and measurements first, then we survey. Nottingham is close enough for a survey in the same week in most cases.',
    onTheGround: [
      'On streets with tram lines you cannot stop on the track, so we plan where the van goes before the day.',
      'The Lace Market and Hockley are conservation areas with a lot of converted older buildings, so the council may have a view on frontages there.',
      'Alfreton Road and Mansfield Road have long parades of independents and takeaways, most with side-street parking nearby.',
    ],
    questions: [
      {
        q: 'Do you charge more for Nottingham than for Birmingham?',
        a: [
          'The travel is priced into the quote as a line you can see. For a job an hour away it is a small part of the total.',
        ],
      },
    ],
  },
  {
    slug: 'sheffield',
    name: 'Sheffield',
    title: 'Shopfronts & Shutters Fitted in Sheffield',
    description: 'How our Birmingham fitters install shopfronts, roller shutters and shop doors in Sheffield: the Clean Air Zone, survey, travel and what to expect.',
    miles: 85,
    drive: 'about an hour and three quarters',
    route: 'the M42 and M1',
    survey:
      'We price from photos and measurements, then survey in person before anything is made. The survey is a day trip.',
    onTheGround: [
      'Sheffield’s Clean Air Zone, inside and on the inner ring road, charges older vans. It is in our travel cost if your shop is inside it.',
      'London Road, Abbeydale Road and Ecclesall Road have long runs of independent shops, restaurants and takeaways. Some sections have bus lanes and loading limits, which we check before the day.',
      'Supertram streets have the same no-stopping rules as any tram route.',
    ],
    questions: [
      {
        q: 'How many days will you need in Sheffield?',
        a: [
          'Most single frontages are one day on site. Bigger jobs, or a front and shutter together, can run to two, in which case the team stays over.',
        ],
      },
    ],
  },
];

export const installCityBySlug = (slug: string) => installCities().find((c) => c.slug === slug);
