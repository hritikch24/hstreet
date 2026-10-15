/**
 * Copy for the two garage door pages. DRAFT: built only when `garageLive()`
 * (business/profile.ts). Same shape as copy/services.ts, so the [service]
 * route renders them like any other line of work.
 *
 * House rules for this copy:
 *  - No prices or lead times until the owner gives them. Nothing typed here.
 *  - Never walk a customer through springs, cables or motor internals. Safe
 *    checks only, then a fitter.
 *  - No maker named until the owner confirms the firm buys from them.
 */
import { garageDoors, radius, type GarageDoorKind } from '@/business/profile';
import type { QA, ServicePage } from '@/copy/services';

const label: Record<GarageDoorKind, string> = {
  roller: 'roller',
  sectional: 'sectional',
  'up-and-over': 'up-and-over',
  'side-hinged': 'side-hinged',
};

const joined = (kinds: GarageDoorKind[]) =>
  kinds.length < 2 ? kinds.map((k) => label[k]).join('') : `${kinds.slice(0, -1).map((k) => label[k]).join(', ')} and ${label[kinds.at(-1)!]}`;

const brumOnly = () => `Birmingham and within ${radius()} miles`;

const repairNotes: Record<GarageDoorKind, string> = {
  roller: 'Roller: bent or dented laths, a door that winds up crooked, a worn guide channel, a dead motor or a lost remote.',
  sectional: 'Sectional: a snapped torsion spring over the opening, a lifting cable off its drum, tired rollers, or hinges working loose between panels.',
  'up-and-over': 'Up-and-over: tension springs or counterweight cables gone, a bent lifting arm, a handle or lock that has seized.',
  'side-hinged': 'Side-hinged: leaves that have dropped and scrape the drive, worn hinges, a shoot bolt that no longer finds its keep.',
};

const installNotes: Record<GarageDoorKind, string[]> = {
  roller: ['Roller', 'Coils into a box above the opening', 'Short drives, cars parked close', 'Needs a power supply; box must fit inside or outside the lintel'],
  sectional: ['Sectional', 'Lifts straight up, then runs back under the roof', 'Attached garages, good insulation', 'Needs clear headroom and ceiling depth for the tracks'],
  'up-and-over': ['Up-and-over', 'One leaf tilts out and slides up', 'Simple, works well by hand', 'Swings out about a metre as it opens'],
  'side-hinged': ['Side-hinged', 'Two leaves open outwards like gates', 'Workshops, walking in without opening fully', 'Needs space on the drive for both leaves'],
};

function repairs(kinds: GarageDoorKind[]): ServicePage {
  const questions: QA[] = [
    {
      q: 'What sort of garage door faults do you fix?',
      a: [`We work on ${joined(kinds)} doors, manual or electric. Typical faults by type:`],
      list: kinds.map((k) => repairNotes[k]),
    },
    {
      q: 'The door went bang and now it won’t lift. What’s happened?',
      a: [
        'Almost always a spring has snapped. The spring was carrying most of the door’s weight, so now the door is far heavier than it looks and the motor can’t lift it. Leave it shut, unplug the motor if it is electric, and don’t try to lift it by hand or with the car. Send us a photo and we’ll tell you what we need to bring.',
      ],
    },
    {
      q: 'Can I change a garage door spring or cable myself?',
      a: [
        'Please don’t. Springs on garage doors are wound under serious tension, and the cables carry the full weight of the door. When one lets go during a DIY repair it can break bones. We don’t give step-by-step instructions for this, and we would rather talk you through a safe stopgap on the phone.',
      ],
    },
    {
      q: 'My electric garage door has stopped working. What can I check?',
      a: ['These are safe to check before you call us:'],
      list: [
        'Is the motor plugged in, and has a fuse or trip gone?',
        'Does the remote work with a fresh battery, or does the wall button work when the remote doesn’t?',
        'Has the red manual-release cord been pulled? If so, the motor is running but not connected to the door.',
        'Is anything blocking or dirtying the two photo-eye sensors near the floor?',
      ],
    },
    {
      q: 'Why does my garage door make so much noise?',
      a: [
        'Squealing and grinding are usually dry or worn rollers and hinges. A clunk at the same spot every time points to a dented track or a loose bracket. A door that has got louder and heavier at the same time may have a weak or broken spring, so stop using it until it has been looked at.',
      ],
    },
    {
      q: 'The door has jumped off its track. Can you put it back?',
      a: [
        'Usually, if the panels and track aren’t badly bent. A door hanging out of its track is loaded unevenly and could drop, so keep clear of it, keep the car out of the way, and leave it for us.',
      ],
    },
    {
      q: 'Do you service garage doors as well?',
      a: [
        'If we are already there for a repair, ask and we will go over the whole door: balance, springs, cables, rollers, hinges and tracks, plus a test that an electric door stops and reverses when it meets something. A door used every day is worth checking about once a year.',
      ],
    },
    {
      q: 'How much is a garage door repair?',
      a: [
        'We haven’t published guide prices for garage doors yet. The price depends on which part has failed, the size of the door and whether a part has to be ordered for that make of motor. Send a photo and we’ll give you a price before anyone comes out.',
      ],
    },
    {
      q: 'Is my house inside your repair area?',
      a: [
        `Garage door repairs are ${brumOnly()}, the same as our shutter repairs. If you are further out, a local firm will reach you sooner.`,
      ],
    },
  ];
  return {
    path: '/garage-door-repairs',
    kind: 'repair',
    name: 'Garage door repairs',
    serviceType: 'Garage door repair',
    title: 'Garage Door Repairs in Birmingham',
    description: `Garage doors that won’t open, won’t close or have come off track, repaired across Birmingham: springs, cables, motors and remotes.`,
    h1: 'Garage door repairs in Birmingham',
    answer: `We repair ${joined(kinds)} garage doors at homes and businesses in Birmingham and up to ${radius()} miles out: broken springs and cables, doors off their tracks, noisy doors, and electric doors with a failed motor or remote. Send a photo first and we’ll price it before anyone comes out. We don’t do garage door repairs outside the Birmingham area.`,
    keyFacts: [
      { label: 'Doors', value: kinds.map((k) => label[k]).join(', ') },
      { label: 'Price', value: 'Given before we start' },
      { label: 'Where', value: brumOnly() },
    ],
    summary: 'Springs, cables, motors, remotes and doors off track, Birmingham area only.',
    quoteService: 'garage-door-repair',
    questions,
  };
}

function installation(kinds: GarageDoorKind[], uk: boolean, motorises: boolean): ServicePage {
  const where = uk ? 'anywhere in the UK' : `in Birmingham and up to ${radius()} miles out`;
  const questions: QA[] = [
    {
      q: 'Can you replace my old garage door?',
      a: [
        'Yes. Out comes the old door, we check the opening, and the new one goes in its place. If the reveals or the old wooden frame need repairing before the new door can go in, you hear about it when we measure, so the price doesn’t change on the day. Your quote says whether disposal of the old door is included.',
      ],
    },
    {
      q: 'Electric or manual: which garage door should I go for?',
      a: [
        'Electric if you use the garage every day, if anyone in the house struggles to lift a door, or if you want to open it from the car. It needs a socket near the top of the opening. Manual if the garage is mainly storage and you would rather have fewer parts to go wrong.',
      ],
    },
    ...(motorises
      ? [
          {
            q: 'Can you put a motor on the door I already have?',
            a: [
              'Often. Most sectional doors and plenty of up-and-over doors can take a ceiling-mounted opener. The door has to be balanced and running freely first, or the motor works too hard and fails early, so we check that before we quote.',
            ],
          },
        ]
      : []),
    {
      q: 'Is an insulated garage door worth it?',
      a: [
        'Worth it for an integral garage, one with a bedroom above, or one that doubles as a home gym, office or workshop. Insulated panels or laths keep the cold and the road noise out. For a detached garage that only holds a car or the bikes, most people don’t need it.',
      ],
    },
    {
      q: 'My opening isn’t a standard size. Is that a problem?',
      a: [
        'No. Plenty of garages, especially older ones, are a few centimetres off standard or out of square. We take the width, height, headroom and side room, and the door is built to those figures. For a double garage you can have one wide door across the whole opening, or two narrower doors where the brickwork has a centre pier.',
      ],
    },
    {
      q: 'Will I need planning permission for a new garage door?',
      a: [
        'For a house, normally not when one garage door replaces another. Listed buildings need consent, and some estates and conservation areas have conditions that cover doors. Widening the opening is building work and needs building regulations sign-off for the new lintel. Flats and leasehold houses usually need the freeholder’s say-so.',
      ],
    },
    {
      q: 'What’s the price of a new garage door?',
      a: [
        'We haven’t published guide prices for garage doors yet. The type, the size, insulation, a motor, the colour and any glazed panels all move the price. Send a photo of the opening and rough sizes, and we’ll give you a guide figure before we come to measure.',
      ],
    },
    {
      q: 'Is a garage door just a roller shutter for a house?',
      a: [
        'They are cousins, not twins. A shop shutter is there to secure a window or door overnight, and is built to take knocks from the street. A household garage door gets opened by the family several times a day, so it is designed around ease, warmth and appearance as well as security. For a shop or a commercial unit, see [roller shutters](/roller-shutters).',
      ],
    },
  ];
  return {
    path: '/garage-door-installation',
    kind: 'install',
    local: !uk,
    name: uk ? 'Garage doors' : 'New garage doors',
    serviceType: 'Garage door installation',
    title: uk ? 'New Garage Doors Supplied and Fitted' : 'New Garage Doors Fitted in Birmingham',
    description: `New and replacement ${joined(kinds)} garage doors, made to measure and fitted ${uk ? 'UK-wide' : 'across Birmingham'}, electric or manual.`,
    h1: uk ? 'New garage doors, made to measure' : 'New garage doors fitted in Birmingham',
    answer: `We supply and fit new ${joined(kinds)} garage doors ${where}, electric or manual, single or double. Each door is made to the size of your opening, so we measure first and put the price in writing. Replacing a door that has failed is the same job.`,
    keyFacts: [
      { label: 'Doors', value: kinds.map((k) => label[k]).join(', ') },
      { label: 'Price', value: 'In writing after we measure' },
      { label: 'Where', value: uk ? 'Fitted anywhere in the UK' : brumOnly() },
    ],
    summary: 'Made-to-measure garage doors, electric or manual, old door out and new door in.',
    quoteService: 'garage-door-install',
    compare: [
      {
        caption: 'Which garage door suits my garage?',
        head: ['', 'How it opens', 'Good for', 'Check first'],
        rows: kinds.map((k) => installNotes[k]),
      },
    ],
    questions,
  };
}

/** The pages, built from what the owner has confirmed (or the draft, on a preview). */
export function garageServices(): ServicePage[] {
  const g = garageDoors.value;
  return [repairs(g.repairs), installation(g.installs, g.installArea === 'uk', g.motorises)];
}

/** Paths that exist only while `garageLive()`. */
export const GARAGE_PATHS = new Set(['/garage-door-repairs', '/garage-door-installation']);

/** For llms.txt and the hubs: whether these pages are public, not just drafted. */
export const garagePublished = () => !garageDoors.isPlaceholder;

export const garageAsk = () => (garageDoors.isPlaceholder ? garageDoors.ask : undefined);
