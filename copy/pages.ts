/**
 * Copy for the hub and standing pages: home, /nationwide, /repairs, /prices,
 * /our-work, /the-firm, /talk-to-us, /get-a-quote and /privacy-notice.
 */
import { priceRange, profile, radius } from '@/business/profile';
import type { QA } from '@/copy/services';

const lead = () => profile.leadTimes.value;
const resp = () => profile.response.value;

export const home = () => ({
  title: 'Shopfronts, Shutters & Shop Doors | High Street Shopfronts',
  description: profile.oneLiner,
  kicker: 'Birmingham fitters',
  h1: 'New shopfronts, shutters and doors, fitted across the UK',
  answer: `We make and fit aluminium shopfronts, roller shutters, automatic doors and steel and aluminium doors for independent shops, and we fit them anywhere in the UK. Repairs are different: we only do those in Birmingham and up to ${radius()} miles out, because a stuck shutter needs someone there within hours.`,
  ask: 'Send us a photo of your shopfront on WhatsApp and we will come back with a price.',
  linesHeading: 'What we fit',
  proofHeading: 'Recent work',
  proofNote: 'Photographs of our own finished jobs. The shop names you can see belong to the customers.',
  howHeading: 'How a price works when you are not in Birmingham',
  how: [
    { step: 'Send photos', text: 'Five photos and four measurements on WhatsApp. Our guide shows exactly which.' },
    { step: 'Ballpark price', text: 'Usually within a couple of working days, with anything in the photos that changes it.' },
    { step: 'Survey and drawings', text: 'We check every measurement on site and send drawings for you to sign.' },
    { step: 'Made and fitted', text: 'Made to the drawings, then the team drives out and fits it, usually in one or two days.' },
  ],
  questions: [
    {
      q: 'Can you fit a shopfront outside Birmingham?',
      a: [
        'Yes. New shopfronts, shutters and doors are fitted anywhere in the UK. The team travels to you, and the travel is shown in the quote.',
      ],
    },
    {
      q: 'Do you do shutter repairs outside Birmingham?',
      a: [
        `No. Repairs and emergency callouts are only for Birmingham and up to ${radius()} miles out. Further away, a local repairer will reach you faster than we could.`,
      ],
    },
    {
      q: 'How quickly can I get a price?',
      a: ['Send photos and rough measurements on WhatsApp and we usually reply with a ballpark price within a couple of working days.'],
    },
  ] satisfies QA[],
});

export const nationwide = () => ({
  title: 'UK-Wide Shopfront Installation: How It Works',
  description: `How our Birmingham team prices, surveys, makes and fits shopfronts, shutters and doors anywhere in the UK. Shopfronts typically ${priceRange('shopfront')}.`,
  h1: 'Installing anywhere in the UK: how it works',
  answer: `We fit new shopfronts, roller shutters, automatic doors and shop doors anywhere in the UK. You send photos and measurements, we give you a price, survey, draw, make it and then drive out to fit it; a typical shopfront costs ${priceRange('shopfront')} and is fitted ${lead().shopfront}. Repairs are not part of this: they are Birmingham-only.`,
  stepsHeading: 'From first message to fitted',
  steps: [
    {
      title: 'Photos and measurements',
      text: 'You send five photos and four measurements on WhatsApp or through the quote form. Nobody visits yet, so this costs you nothing.',
    },
    {
      title: 'A ballpark price',
      text: 'We reply with a price range and anything in the photos that could change it. Most people know within a couple of working days whether the job is affordable.',
    },
    {
      title: 'Survey',
      text: 'Before anything is made, we measure on site and look at the fixings, the lintel, the threshold and where power will come from. Far-off surveys are grouped with other jobs to keep the cost down.',
    },
    {
      title: 'Drawings you sign',
      text: 'You get an elevation drawing with sizes, colours, glass and door hardware. That is what gets made, and what you can send to your landlord or the council.',
    },
    {
      title: 'Manufacture',
      text: `Frames are cut and powder-coated, shutters built and glass made to size. Typical lead times: shopfronts ${lead().shopfront}, shutters ${lead().shutter}, automatic doors ${lead().autoDoors}.`,
    },
    {
      title: 'The fitting team travels',
      text: 'The team drives out with everything on the van. Most single frontages take one or two days on site; for a two-day job further away they stay nearby overnight.',
    },
  ],
  youHeading: 'What you sort out before the fit',
  you: [
    'Your landlord’s consent for the frontage, if you rent',
    'Planning permission where the look of the front changes, and in conservation areas',
    'A fused spur near the box for an electric shutter or automatic doors, or ask us to arrange one',
    'A parking bay suspension where you can’t stop outside, which we will tell you about during the survey',
  ],
  questions: [
    {
      q: 'Can you fit a shopfront outside Birmingham?',
      a: [
        'Yes, anywhere in the UK. The frames, glass and fixings travel with the team, and the travel is a line on the quote.',
      ],
    },
    {
      q: 'Is it more expensive than using a local firm?',
      a: [
        'The travel adds something, and the further away, the more. For a whole shopfront it is a small part of the total. Get a local quote as well and compare like for like: the glass, the door hardware and what is included for making good.',
      ],
    },
    {
      q: 'What if something goes wrong after you have fitted it and gone home?',
      a: [
        'Tell us straight away with photos. If it is a fault in what we made or fitted, we come back and put it right. Everyday wear and repairs away from Birmingham are best done by a local repairer, and we will say so honestly.',
      ],
    },
    {
      q: 'Do you have city pages for everywhere you fit?',
      a: [
        'No, and on purpose. We only write a page about a city when we have something useful to say about working there. Wherever your shop is, the process above is the same.',
      ],
    },
  ] satisfies QA[],
});

export const repairsHub = () => ({
  title: 'Shopfront & Shutter Repairs in Birmingham',
  description: `Shutter, door, lock and shop glass repairs and emergency callouts across Birmingham, up to ${radius()} miles out. Emergencies ${resp().emergency}. Birmingham area only.`,
  h1: 'Repairs and emergency callouts in Birmingham',
  answer: `We repair shop shutters, doors, locks and broken shopfront glass in Birmingham and up to ${radius()} miles from it. We aim to reach an emergency ${resp().emergency} and other repairs ${resp().standard}; most shutter repairs cost ${priceRange('shutterRepair')}. We do not do repairs or emergency callouts anywhere else.`,
  emergencyHeading: 'What counts as an emergency?',
  emergency: [
    'Your shop can’t be locked: a shutter stuck up, a door that won’t lock, a broken pane.',
    'Your shutter is stuck down and you can’t open to trade.',
    'Something is hanging or loose and could fall on someone.',
  ],
  emergencyNote: () =>
    `The emergency line is answered ${profile.emergencyHours.value.toLowerCase()}. An emergency callout is ${priceRange('emergencyCallout')} before parts, and you are told that before we set off.`,
  areasHeading: 'Where the repair van goes',
  areasIntro: `Anywhere within about ${radius()} miles of Birmingham. We have written up the areas we are called to most, with the roads and the details that change how we get to you:`,
  outsideHeading: 'Outside the Birmingham area?',
  outside:
    'We won’t send a repair van further than we can reach quickly, so outside our area a local repairer is the better call. New installations are different: those we fit anywhere in the UK.',
});

export const pricesPage = () => ({
  title: 'Shopfront & Shutter Prices',
  description: `Price ranges for aluminium shopfronts (${priceRange('shopfront')}), roller shutters, automatic doors, steel doors and Birmingham repairs, with what changes them.`,
  h1: 'Prices',
  answer:
    'These are the ranges most of our jobs fall into. Your price depends on the size of the opening and what you choose, and we confirm it in writing before anything is ordered or started.',
  installHeading: 'New installations, anywhere in the UK',
  repairHeading: `Repairs, Birmingham and up to ${radius()} miles`,
  movesHeading: 'What moves a price up or down?',
  moves: [
    'Width and height of the opening; width costs more than height',
    'Glass: toughened, laminated or obscured',
    'Colours outside the usual black, white and grey',
    'Taking out an old front that is fixed in badly or hiding damage',
    'Access: tight streets, high-level work, work out of hours for a shopping centre',
    'Travel, for installations outside the West Midlands, shown as its own line',
  ],
});

export const workPage = () => ({
  title: 'Shopfronts & Shutters We’ve Fitted',
  description:
    'Photographs of shopfronts, roller shutters, automatic doors and steel and aluminium doors fitted by High Street Shopfronts.',
  h1: 'Our work',
  answer:
    'Every photo here is a job our team fitted. We add a full write-up (where it was, what the customer needed and what we did) once the details are confirmed; until then the photos are grouped by the kind of work.',
  jobsHeading: 'Job write-ups',
  photosHeading: 'Photos by type of work',
  namesNote:
    'Some photos show the customer’s own shop name. That is their signage, not an endorsement of us.',
});

export const firmPage = () => ({
  title: 'The Firm: Birmingham Shopfront Fitters',
  description: 'Who runs High Street Shopfronts, how we price and fit, where the Birmingham repair area stops, and what we don’t do.',
  h1: 'The firm',
  answer: profile.oneLiner,
  ownerHeading: 'Who you deal with',
  ownerPending: 'Introductions to the owner and the fitting team will go here.',
  howHeading: 'How we work',
  how: [
    'You get a price in writing before anything is ordered, and a repair price before the work starts.',
    'We fit what we draw. If the survey changes something, you see the new drawing before it is made.',
    'We clean up and take away the old front, packaging and offcuts.',
    'Installations go anywhere in the UK. Repairs stay in the Birmingham area, because that is where we can get to quickly.',
  ],
  notHeading: 'What we don’t do',
  not: [
    'Repairs or emergency callouts outside the Birmingham area',
    'Timber heritage shopfronts: we will say so if that is what your building needs',
    'Signage and electrics beyond connecting shutters and doors to a supply that is already there',
  ],
});

export const contactPage = () => ({
  title: 'Contact: Phone, WhatsApp & Hours',
  description: `Call, WhatsApp or email High Street Shopfronts in Birmingham. Installations UK-wide; repairs and emergencies within ${radius()} miles of Birmingham.`,
  h1: 'Talk to us',
  answer: `The quickest way to a price is a WhatsApp message with a photo of your shopfront. For a repair in Birmingham, call. For anything that can wait, the quote form reaches the same people.`,
});

export const quotePage = () => ({
  title: 'Get a Shopfront or Shutter Quote',
  description: `Get a price for a new shopfront, shutter or shop door anywhere in the UK, or a repair in Birmingham. WhatsApp a photo or fill in the form.`,
  h1: 'Get a quote',
  answer: `Tell us whether it is a new installation (anywhere in the UK) or a repair (Birmingham and up to ${radius()} miles), where the shop is and what you need. A photo helps more than anything.`,
});

export const privacyPage = () => ({
  title: 'Privacy Notice',
  description: 'What High Street Shopfronts records when you visit the site or send an enquiry, why, and how to ask for it to be deleted.',
  h1: 'Privacy notice',
});
