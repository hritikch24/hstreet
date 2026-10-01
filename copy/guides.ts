/**
 * Practical guides for shop owners. Each one answers a question customers
 * actually send us, and links to the page where they can act on it.
 */
import { guidePrice, profile, radius } from '@/business/profile';

export interface GuideSection {
  heading: string;
  paras: string[];
  steps?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  h1: string;
  description: string;
  /** The answer in two or three sentences, shown first. */
  answer: string;
  sections: GuideSection[];
  next: { label: string; href: string };
}

export const guides = (): Guide[] => [
  {
    slug: 'photograph-and-measure-your-shopfront',
    title: 'How to Measure Your Shopfront for a Quote',
    h1: 'How to photograph and measure your shopfront for a quote',
    description:
      'The five photos and four measurements we need to price a new shopfront, shutter or shop door from WhatsApp, before anyone visits.',
    answer:
      'Send five photos and four measurements and we can give you a ballpark price without a visit: the whole front from across the road, each side close up, the top of the opening and the threshold, plus the width and height of the opening and the height above it. It takes about ten minutes with a tape measure and a phone.',
    sections: [
      {
        heading: 'Which photos do you need?',
        paras: ['Take them in daylight with the shutter up, if you have one:'],
        steps: [
          'The whole front, from across the road, so we see the fascia, both sides and the pavement',
          'The left edge of the opening, close up, where the frame meets the wall',
          'The right edge, the same',
          'The top of the opening and the fascia or sign board above it',
          'The threshold and the pavement in front of the door',
        ],
      },
      {
        heading: 'Which measurements do you need?',
        paras: ['Measure in millimetres if you can, and don’t worry about being exact to the last few. The survey confirms them before anything is made.'],
        steps: [
          'Width of the opening, wall to wall, at the top and at the bottom',
          'Height of the opening, from the pavement to the underside of the fascia',
          'Height from the top of the opening to the underside of the sign or gutter, for a shutter box',
          'Width of the door you have now, if you want to keep a similar door',
        ],
      },
      {
        heading: 'What happens after you send them?',
        paras: [
          'We reply with a ballpark price, usually within a couple of working days, and tell you if anything in the photos changes it: a bowed lintel, a step at the door, a sign in the way of a shutter box. If you want to go ahead, we book a survey and then send drawings for you to sign.',
          'Installations are UK-wide, so this works wherever your shop is.',
        ],
      },
    ],
    next: { label: 'WhatsApp your photos for a price', href: '/get-a-quote' },
  },
  {
    slug: 'shutter-stuck-what-to-check',
    title: 'Roller Shutter Stuck? What to Check Safely',
    h1: 'Shutter stuck? What to check safely, and what to leave alone',
    description:
      'Your shop shutter is stuck halfway, won’t open or won’t close. The checks that are safe to do yourself, the ones that aren’t, and when to call a repairer.',
    answer:
      'Check the power, the switch or remote, and the guides for anything caught in them. Don’t force the shutter with a pole, and never touch the spring on a manual shutter. If none of the safe checks fixes it, stop using it and call a repairer.',
    sections: [
      {
        heading: 'What is safe to check on an electric shutter?',
        paras: ['Work through these in order:'],
        steps: [
          'Is there power? Check the fused spur and the fuse board. A tripped circuit is the most common cause of a shutter that does nothing at all.',
          'Does the switch or remote work? Try the key switch if you normally use a remote, and put a new battery in the remote.',
          'Has the motor overheated? After several runs close together a motor cuts out to protect itself. Leave it for twenty minutes and try once.',
          'Is anything in the guides? Look up each side for a bag, a sign or a bent lath.',
        ],
      },
      {
        heading: 'What should I leave alone?',
        paras: [
          'The spring inside a manual shutter is wound tight and can release with enough force to break bones. Don’t loosen anything on the barrel or the end brackets. Don’t hammer bent laths back into the guides with the shutter half-open either: if it drops, it drops fast.',
          'On an electric shutter, if the motor hums but the shutter does not move, stop pressing the switch. Running a stuck motor again and again is how a repair turns into a new motor.',
        ],
      },
      {
        heading: 'How do I use the manual override?',
        paras: [
          'Most electric shutters have a winding handle that hooks into an eye on the motor end, or a pull chain. Wind slowly and stop if it gets suddenly stiff. If you can’t find it or it does not turn, leave it and call.',
        ],
      },
      {
        heading: 'Who can come out?',
        paras: [
          `In Birmingham and up to about ${radius()} miles out, we can: most repairs cost ${guidePrice('shutterRepair')}, and we aim to reach emergencies ${profile.response.value.emergency}. Further away, look for a local shutter engineer, since speed matters more than anything else with a stuck shutter.`,
        ],
      },
    ],
    next: { label: 'Shutter repairs in Birmingham', href: '/shutter-repairs' },
  },
  {
    slug: 'manual-or-electric-shutter',
    title: 'Manual or Electric Shutter for a Small Shop?',
    h1: 'Manual or electric shutter for a small shop?',
    description:
      'Choosing a manual or electric roller shutter for a takeaway, corner shop or salon: width, how often it opens, cost and what tends to go wrong.',
    answer: `Under about three metres wide, lifted twice a day by someone who can manage it, a manual shutter is cheaper and simpler: ${guidePrice('shutterManual')}. Wider than that, or if it goes up and down more often, an electric shutter at ${guidePrice('shutterElectric')} is worth it, and should always have a manual override.`,
    sections: [
      {
        heading: 'How wide is the opening?',
        paras: [
          'Width decides most of it. A narrow manual shutter lifts easily because a spring carries most of the weight. As the shutter gets wider, the curtain gets heavier and the spring bigger, and pushing it up at the end of a long day stops being pleasant.',
        ],
      },
      {
        heading: 'How often does it go up and down?',
        paras: [
          'A takeaway that opens at lunch, closes in the afternoon and opens again for the evening runs its shutter four or more times a day. That is when electric pays for itself: less strain on you and less wear on the spring.',
        ],
      },
      {
        heading: 'What goes wrong with each?',
        paras: [
          'Manual shutters wear their springs and their bottom-rail locks, and the lock is often the first thing to seize in winter. Electric shutters add a motor, limit settings and a switch or remote, so there is more that can fail, but a good one with an override never leaves you stuck.',
        ],
      },
      {
        heading: 'Can a manual shutter be made electric later?',
        paras: [
          'Often, if the barrel and box have room for a tubular motor. It is usually cheaper to decide at the start, since converting means taking the curtain down.',
        ],
      },
    ],
    next: { label: 'Roller shutters, fitted UK-wide', href: '/roller-shutters' },
  },
];

export const guideBySlug = (slug: string) => guides().find((g) => g.slug === slug);
