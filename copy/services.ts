/**
 * Copy for the eight service pages. Install lines are fitted UK-wide; repair
 * lines are Birmingham-only. Every price, lead time, radius and response time
 * comes from business/profile.ts, so the owner changes a number once.
 *
 * Each `questions` entry is rendered as a visible heading and answer, and the
 * same array feeds the FAQPage JSON-LD for that page. Nothing goes in the
 * markup that isn't on the page.
 */
import { priceBasis, guidePrice, priceRange, profile, radius, vatNote } from '@/business/profile';
import type { WorkLine } from '@/copy/job-photos';

export interface QA {
  q: string;
  a: string[];
  list?: string[];
}

/** A comparison table. The caption is a question, shown as the heading. */
export interface Compare {
  caption: string;
  head: string[];
  rows: string[][];
}

export interface ServicePage {
  path: string;
  kind: 'install' | 'repair';
  /** Short name for menus and lists. */
  name: string;
  /** Name used for the schema.org Service. */
  serviceType: string;
  title: string;
  description: string;
  h1: string;
  /** Two or three sentences: what, who for, price, lead or response time, where. */
  answer: string;
  keyFacts: { label: string; value: string }[];
  photos?: { line: WorkLine; hero: string };
  questions: QA[];
  /** Plain one-line pitch for lists on other pages. */
  summary: string;
  /** Side-by-side comparisons, where a customer is choosing between options. */
  compare?: Compare[];
  /** The quote form's service value, so "Get a price" arrives prefilled. */
  quoteService: string;
  /** The guide that goes deeper on this page's commonest question. */
  guide?: { href: string; label: string };
}

const lead = () => profile.leadTimes.value;
const resp = () => profile.response.value;

const ukWide = 'Fitted anywhere in the UK';
const brumOnly = () => `Birmingham and within ${radius()} miles`;

export const services = (): ServicePage[] => [
  {
    path: '/aluminium-shopfronts',
    kind: 'install',
    name: 'Aluminium shopfronts',
    serviceType: 'Aluminium shopfront installation',
    title: 'Aluminium Shopfronts Fitted UK-Wide',
    description: `Aluminium and glass shopfronts made to measure and fitted anywhere in the UK by a Birmingham team. Typically ${guidePrice('shopfront')}.`,
    h1: 'Aluminium shopfronts, made to measure and fitted UK-wide',
    answer: `We make and fit powder-coated aluminium shopfronts with safety glass for takeaways, corner shops, salons and other high-street units. A typical single-door frontage costs ${guidePrice('shopfront')} and takes ${lead().shopfront}, with one or two days on site. Our fitters are based in Birmingham and travel to jobs anywhere in the UK.`,
    keyFacts: [
      { label: 'Guide price', value: priceRange('shopfront') },
      { label: 'Order to fitted', value: lead().shopfront },
      { label: 'Where', value: ukWide },
    ],
    photos: { line: 'shopfronts', hero: 'black-aluminium-shopfront-parade-obscured-glass' },
    summary: 'Framed aluminium and safety glass, any colour, with a door that locks properly.',
    quoteService: 'aluminium-shopfront',
    guide: { href: '/guides/photograph-and-measure-your-shopfront', label: 'What to photograph and measure for a price' },
    compare: [
      {
        caption: 'Which glass should my shopfront have?',
        head: ['', 'Toughened', 'Laminated', 'Obscured (film or patterned)'],
        rows: [
          ['What it does when broken', 'Breaks into small blunt pieces', 'Cracks but stays in the frame', 'As the glass underneath'],
          ['Keeps a thief out', 'Not once broken', 'Much better: holds together', 'No difference'],
          ['Good for', 'Doors and most panes', 'Front windows that get hit', 'Privacy, e.g. salons and treatment rooms'],
          ['Cost', 'Lowest', 'Higher', 'Film is a small extra'],
        ],
      },
    ],
    questions: [
      {
        q: 'How much is a new aluminium shopfront?',
        a: [
          `A new front costs ${guidePrice('shopfront')} ${priceBasis('shopfront')}. ${vatNote()}`,
          'What moves the price: the width and height of the opening, whether the door is single or double, the glass (toughened, laminated or obscured), a colour other than black or white, and how much of the old front has to come out. A shutter fitted at the same time usually costs less than adding one later, because the box can sit in the new fascia line.',
        ],
      },
      {
        q: 'What do I actually get?',
        a: ['A complete frontage, drawn for your opening:'],
        list: [
          'Aluminium frames powder-coated to any RAL colour, with black, anthracite grey and white the most asked for',
          'Toughened or laminated safety glass in the door and low-level panes, which Building Regulations require near a door or floor',
          'A solid stallriser panel under the glass if you want one, to stop kicks and trolleys cracking the bottom pane',
          'A shop door on a floor spring or heavy hinges, with a closer, a proper deadlock and a pull handle',
          'A level or low threshold where the pavement allows, so wheelchairs and pushchairs get in',
        ],
      },
      {
        q: 'How long does it take from order to fitted?',
        a: [
          `Allow ${lead().shopfront}. The frames are cut and coated to your drawing, and the glass is made to size after that, so nothing is off the shelf.`,
          'On site it is usually one or two days. We take the old front out and put the new one in the same day wherever we can. If the glass cannot go in that day, the opening is boarded and locked before we leave.',
        ],
      },
      {
        q: 'Can I keep trading while you fit it?',
        a: [
          'Mostly, yes. We start early, keep the doorway usable for as long as possible and tell you the night before when the door will be out. If you run a takeaway, tell us and we will plan the day to finish before your evening rush.',
        ],
      },
      {
        q: 'Can you fit a shopfront outside Birmingham?',
        a: [
          'Yes. Installations are UK-wide: the fitting team drives out with the frames and glass, and for longer jobs stays nearby until the front is finished. The price covers travel, so there are no surprises on the invoice.',
        ],
      },
      {
        q: 'Will the council have a say in my new shopfront?',
        a: [
          'Changing how a shopfront looks usually needs planning permission; replacing it like for like often does not. In a conservation area or on a listed building the council will look harder at materials and colour. Ask your landlord too, since most commercial leases need their consent for the frontage.',
          'We supply elevation drawings you can send with an application. The decision is the council’s, so we don’t order anything until you have it in writing.',
        ],
      },
    ],
  },
  {
    path: '/roller-shutters',
    kind: 'install',
    name: 'Roller shutters',
    serviceType: 'Roller shutter installation',
    title: 'Roller Shutters for Shops, Fitted UK-Wide',
    description: `Manual and electric roller shutters for shops, fitted UK-wide. Manual from ${guidePrice('shutterManual')}, electric ${guidePrice('shutterElectric')}; ${lead().shutter}.`,
    h1: 'Roller shutters for shops, fitted anywhere in the UK',
    answer: `We supply and fit steel and aluminium roller shutters over shop windows, doors and back entrances. A manual shutter over a standard window costs ${guidePrice('shutterManual')}; an electric one with a manual override costs ${guidePrice('shutterElectric')}, and most are fitted ${lead().shutter} after you order. Installation is UK-wide; repairs are Birmingham-only.`,
    keyFacts: [
      { label: 'Manual, guide', value: priceRange('shutterManual') },
      { label: 'Electric, guide', value: priceRange('shutterElectric') },
      { label: 'Order to fitted', value: lead().shutter },
      { label: 'Where', value: ukWide },
    ],
    photos: { line: 'shutters', hero: 'grey-roller-shutter-full-shop-frontage' },
    summary: 'Solid or perforated laths, manual or electric, colour-matched to your sign.',
    quoteService: 'roller-shutter',
    guide: { href: '/guides/manual-or-electric-shutter', label: 'Manual or electric shutter for a small shop?' },
    compare: [
      {
        caption: 'Manual or electric shutter: how do they compare?',
        head: ['', 'Manual', 'Electric'],
        rows: [
          ['Guide price', priceRange('shutterManual'), priceRange('shutterElectric')],
          ['Best for', 'Openings up to about 3 m, lifted twice a day', 'Wider openings, or up and down several times a day'],
          ['Effort', 'Pushed up with a spring helping', 'Key switch or remote'],
          ['What wears', 'The spring and the bottom-rail lock', 'The motor, limits and switch'],
          ['In a power cut', 'No difference', 'Wound up or down by hand with the override'],
        ],
      },
      {
        caption: 'Solid, perforated or insulated laths?',
        head: ['', 'Solid steel', 'Perforated steel', 'Insulated aluminium'],
        rows: [
          ['Security', 'Highest', 'High', 'Good'],
          ['See the window at night', 'No', 'Yes, through small holes', 'No'],
          ['Noise when running', 'Loudest', 'Loud', 'Quietest'],
          ['Conservation areas', 'Often refused', 'More often accepted', 'Often refused'],
          ['Best for', 'Back doors, stock rooms, jewellers', 'High-street windows with displays', 'Flats above the shop, late closing'],
        ],
      },
    ],
    questions: [
      {
        q: 'How much does a roller shutter cost to fit?',
        a: [
          `A manual shutter ${priceBasis('shutterManual')} is ${guidePrice('shutterManual')}. An electric shutter ${priceBasis('shutterElectric')} is ${guidePrice('shutterElectric')}. ${vatNote()}`,
          'Width matters more than height: past about four metres the barrel and guides get heavier and the motor bigger. A colour other than white, grey or black adds a little, and so does a box that has to be built into an awkward fascia.',
        ],
      },
      {
        q: 'Manual or electric: which should a small shop have?',
        a: [
          'If the shutter is under about three metres wide and goes up and down twice a day, a spring-balanced manual shutter is cheaper and has less to go wrong. For anything wider, or if lifting it at the end of a long day is hard work, choose electric.',
          'Every electric shutter we fit has a manual override, so a power cut or a dead motor never locks you in or out.',
        ],
      },
      {
        q: 'Solid or perforated laths?',
        a: [
          'Solid laths block the view and the light: the most protection, and the right choice for a back door or a stock room. Perforated laths have small punched holes, so passers-by can see your window display at night and street lighting gets in. Many councils prefer perforated or internal shutters on a traditional high street, so check before you choose solid.',
        ],
      },
      {
        q: 'Can you fit a shutter to the shopfront I already have?',
        a: [
          'Usually. We need about 300mm of height above the opening for the box, or room to fit it inside behind the glass. If there is no room either way, we can fit a shutter with a slim box that sits proud of the fascia and paint it to match.',
        ],
      },
      {
        q: 'Do you fit shutters outside Birmingham?',
        a: [
          'Yes, new shutters are fitted UK-wide. What we don’t do is repair shutters outside the Birmingham area, because we cannot get to a stuck shutter in another city fast enough to be useful.',
        ],
      },
      {
        q: 'What does an electric shutter need on site?',
        a: [
          'A fused spur near the shutter box. Your own electrician can put it in before we arrive, or we can arrange one. We connect the motor, set the top and bottom limits and show you the override before we leave.',
        ],
      },
    ],
  },
  {
    path: '/automatic-doors',
    kind: 'install',
    name: 'Automatic doors',
    serviceType: 'Automatic sliding door installation',
    title: 'Automatic Sliding Doors for Shops, UK-Wide',
    description: `Automatic sliding doors for convenience stores and shops, supplied and fitted UK-wide. Typical price ${guidePrice('autoDoors')}; ${lead().autoDoors}.`,
    h1: 'Automatic sliding doors for shops',
    answer: `We fit automatic sliding doors, mostly bi-parting pairs, for convenience stores, pharmacies and other shops where customers come in with their hands full. A typical pair with sensors costs ${guidePrice('autoDoors')} and is fitted ${lead().autoDoors} after you order. We install them anywhere in the UK.`,
    keyFacts: [
      { label: 'Guide price', value: priceRange('autoDoors') },
      { label: 'Order to fitted', value: lead().autoDoors },
      { label: 'Where', value: ukWide },
    ],
    photos: { line: 'automatic-doors', hero: 'automatic-sliding-doors-convenience-store-aisles' },
    summary: 'Bi-parting sliding pairs with sensors, a night lock and battery backup.',
    quoteService: 'automatic-doors',
    compare: [
      {
        caption: 'Bi-parting or single sliding door?',
        head: ['', 'Bi-parting pair', 'Single slide'],
        rows: [
          ['How it opens', 'Two leaves part from the middle', 'One leaf slides to one side'],
          ['Wall space needed', 'Half the door width each side', 'A full door width on one side'],
          ['Speed through', 'Faster: opens half the distance', 'Slower for the same opening'],
          ['Best for', 'Busy convenience stores and entrances', 'Narrow frontages with room on one side'],
        ],
      },
    ],
    questions: [
      {
        q: 'How much do automatic doors cost for a shop?',
        a: [
          `A sliding pair costs ${guidePrice('autoDoors')} ${priceBasis('autoDoors')}. ${vatNote()} A single sliding leaf is cheaper; a pair set into a new aluminium shopfront costs less than retrofitting one into an old frame.`,
        ],
      },
      {
        q: 'What comes with them?',
        a: ['Every set we fit includes:'],
        list: [
          'An operator unit across the head of the doors, hidden in a cover',
          'A motion sensor on each side to open the doors, and presence sensors so they don’t close on someone standing in the way',
          'A program switch: automatic, exit only, fully open, or locked',
          'A night lock, so the doors are properly locked, not only switched off',
          'A battery backup that opens or closes the doors when the power goes',
        ],
      },
      {
        q: 'Can you make my existing doors automatic?',
        a: [
          'Sometimes. If the frame is square and strong enough, an operator can go above it. Old or bowed frames usually cost more to patch than to replace, and we will tell you which after the survey rather than fit something that sticks by the winter.',
        ],
      },
      {
        q: 'Will the doors still work if the electric goes off?',
        a: [
          'The battery backup runs the doors for a short time, then leaves them in the position you choose, open or shut. They can also be pushed open by hand once unlocked.',
        ],
      },
      {
        q: 'Do automatic doors need servicing?',
        a: [
          'Yes. Powered doors should be checked by someone competent, at least once a year and more often on a busy store. The sensors and the safety settings are what matter. We can service the doors we fit if you are in the Birmingham area; further afield we will point you to a local engineer.',
        ],
      },
    ],
  },
  {
    path: '/security-doors',
    kind: 'install',
    name: 'Steel security and fire-exit doors',
    serviceType: 'Steel security door and fire exit door installation',
    title: 'Steel Security & Fire Exit Doors for Shops',
    description: `Steel back doors and fire-exit doors with push bars for shops and takeaways, fitted UK-wide. Single steel door ${guidePrice('steelDoor')}; ${lead().steelDoor}.`,
    h1: 'Steel security doors and fire exits',
    answer: `We fit steel doors on rear entrances, stockrooms and the flat above the shop, plus double fire-exit sets with push bars. A single steel door with its frame and locks costs ${guidePrice('steelDoor')} and a double fire-exit set ${guidePrice('fireExitPair')}; both are usually fitted ${lead().steelDoor} after you order, anywhere in the UK.`,
    keyFacts: [
      { label: 'Single door, guide', value: priceRange('steelDoor') },
      { label: 'Fire-exit pair, guide', value: priceRange('fireExitPair') },
      { label: 'Order to fitted', value: lead().steelDoor },
      { label: 'Where', value: ukWide },
    ],
    photos: { line: 'security-doors', hero: 'black-steel-double-fire-exit-doors' },
    summary: 'Steel back doors and fire exits that open from inside without a key.',
    quoteService: 'security-door',
    compare: [
      {
        caption: 'Push bar or push pad on a fire exit?',
        head: ['', 'Push bar (panic exit)', 'Push pad (emergency exit)'],
        rows: [
          ['Who uses the exit', 'Anyone, including the public', 'Staff who know the building'],
          ['Standard to ask for', 'BS EN 1125', 'BS EN 179'],
          ['How it opens', 'Pushing anywhere along the bar', 'Pushing the pad'],
          ['Typical place', 'Shop floor exits, takeaways with seating', 'Stock rooms, back offices'],
        ],
      },
    ],
    questions: [
      {
        q: 'How much is a steel back door for a shop?',
        a: [
          `A single steel door costs ${guidePrice('steelDoor')}, ${priceBasis('steelDoor')}. A double fire-exit set costs ${guidePrice('fireExitPair')}, ${priceBasis('fireExitPair')}. ${vatNote()}`,
        ],
      },
      {
        q: 'Can a fire exit also be secure?',
        a: [
          'Yes, and it has to be both. A fire exit must open outwards from inside, in one movement, without a key. Security comes from the steel leaf, hinge bolts that stop the door being lifted off, and a frame fixed deep into the wall, not from extra locks on the inside.',
        ],
      },
      {
        q: 'Push bar or push pad?',
        a: [
          'Where the public might use the exit, fit a push bar across the full width: anyone can open it in a panic. A push pad suits staff-only doors, where everyone using it knows how it works. If you are unsure, the fire risk assessment for the premises should say.',
        ],
      },
      {
        q: 'Can you fit it into an old opening?',
        a: [
          'Almost always. Steel doors are made to the size of the opening, so we measure after taking out any old frame if we can. Where the brickwork is soft or broken, we make good around the new frame before we leave.',
        ],
      },
    ],
  },
  {
    path: '/aluminium-doors',
    kind: 'install',
    name: 'Aluminium doors',
    serviceType: 'Aluminium door installation',
    title: 'Aluminium Shop Doors: Panel & Glazed',
    description: `Aluminium panel and glazed doors for shops, side entrances and flats above shops, fitted UK-wide. From ${guidePrice('aluminiumDoor')}; ${lead().aluminiumDoor}.`,
    h1: 'Aluminium doors: panel, glazed and bronze-effect',
    answer: `We make and fit aluminium doors: solid panel doors for side and back entrances or the flat above the shop, and glazed doors and screens for inside a shop or a shopping-centre unit. A single door with its frame costs ${guidePrice('aluminiumDoor')} and takes ${lead().aluminiumDoor}. We fit them anywhere in the UK.`,
    keyFacts: [
      { label: 'Single door, guide', value: priceRange('aluminiumDoor') },
      { label: 'Order to fitted', value: lead().aluminiumDoor },
      { label: 'Where', value: ukWide },
    ],
    photos: { line: 'aluminium-doors', hero: 'white-aluminium-double-panel-doors' },
    summary: 'Panel doors for side entrances, glazed doors and screens for inside.',
    quoteService: 'aluminium-door',
    questions: [
      {
        q: 'How much is an aluminium door?',
        a: [
          `A single door, ${priceBasis('aluminiumDoor')}, costs ${guidePrice('aluminiumDoor')}. ${vatNote()} Double doors, full glazing, a special finish or an electric strike for an intercom add to it.`,
        ],
      },
      {
        q: 'Panel or glazed?',
        a: [
          'For a side entrance or the door to a flat above the shop, a solid insulated panel door is warmer, quieter and harder to break. Inside a shop, or where you want people to see in, a glazed door with toughened glass makes more sense.',
        ],
      },
      {
        q: 'What finishes can I have?',
        a: [
          'Any RAL powder-coat colour. White and anthracite grey are the most common for panel doors. For glazed doors in a shopping centre, a bronze or anodised-effect finish is popular because it matches most centre design guides.',
        ],
      },
      {
        q: 'Do you fit doors inside shopping centres?',
        a: [
          'Yes. Centre management usually wants a method statement and risk assessment before we start, and often wants noisy work done before opening. We send the paperwork in advance and book the work around their rules.',
        ],
      },
    ],
  },
  {
    path: '/shutter-repairs',
    kind: 'repair',
    name: 'Shutter repairs',
    serviceType: 'Roller shutter repair',
    title: 'Roller Shutter Repairs in Birmingham',
    description: `Stuck, jammed or damaged roller shutters repaired across Birmingham, Sutton Coldfield, Solihull, Tamworth and Lichfield. Most repairs ${guidePrice('shutterRepair')}.`,
    h1: 'Roller shutter repairs in Birmingham',
    answer: `We repair stuck, noisy and damaged roller shutters on shops in Birmingham and up to ${radius()} miles out, including Sutton Coldfield, Solihull, Tamworth and Lichfield. Most repairs cost ${guidePrice('shutterRepair')} with parts; we aim to reach emergencies ${resp().emergency} and other repairs ${resp().standard}. We do not repair shutters outside the Birmingham area.`,
    keyFacts: [
      { label: 'Most repairs, guide', value: priceRange('shutterRepair') },
      { label: 'Emergency response', value: resp().emergency },
      { label: 'Where', value: brumOnly() },
    ],
    summary: 'Stuck, dropped, noisy or bent shutters, any make, Birmingham area only.',
    quoteService: 'shutter-repair',
    guide: { href: '/guides/shutter-stuck-what-to-check', label: 'Shutter stuck? What to check safely' },
    questions: [
      {
        q: 'How much does a shutter repair cost in Birmingham?',
        a: [
          `Most repairs cost ${guidePrice('shutterRepair')} ${priceBasis('shutterRepair')}. An emergency callout is ${guidePrice('emergencyCallout')} ${priceBasis('emergencyCallout')}. ${vatNote()} We tell you the price before we start work, not after.`,
        ],
      },
      {
        q: 'My shutter is stuck halfway. What usually causes it?',
        a: ['The common causes, roughly in the order we find them:'],
        list: [
          'A lath has come out of the guide after a knock, often from a van or a trolley',
          'The bottom rail has bent, so the shutter jams as it reaches the ground',
          'On an electric shutter, the limit setting has drifted, or the motor has overheated and cut out',
          'On a manual shutter, the spring has lost tension or snapped',
          'Dirt, rust or a dry guide making it bind at one spot every time',
        ],
      },
      {
        q: 'Can I fix it myself?',
        a: [
          'Check the obvious things: is anything in the guides, has the fuse gone, does the key switch or remote have power? Don’t force it with a pole, and never touch the spring on a manual shutter. Springs hold a lot of stored force and can injure you. [Our guide to a stuck shutter](/guides/shutter-stuck-what-to-check) walks through what is safe to check.',
        ],
      },
      {
        q: 'Do you repair shutters you didn’t fit?',
        a: [
          'Yes, any make. We carry common laths, guides, bottom rails, locks, key switches and remotes in the van. If a motor or spring has to be ordered, we make the shop secure before we leave.',
        ],
      },
      {
        q: 'Is my shop inside your repair area?',
        a: [
          `Repairs are Birmingham only: anywhere within about ${radius()} miles, which takes in Erdington, Sutton Coldfield, Alum Rock, Sparkhill, Small Heath, Handsworth, Solihull, Tamworth and Lichfield. If you are further out, we are not the right firm for a repair, but we can still quote for a new shutter.`,
        ],
      },
    ],
  },
  {
    path: '/shopfront-glass',
    kind: 'repair',
    name: 'Shopfront glass replacement',
    serviceType: 'Shopfront glass replacement',
    title: 'Shopfront Glass Replacement, Birmingham',
    description: `Broken shop window or door glass boarded up the same visit and replaced with toughened or laminated glass across Birmingham. ${guidePrice('glassPane')} per pane.`,
    h1: 'Shopfront glass replacement in Birmingham',
    answer: `When a shop window or door pane is broken, we board it up on the same visit, measure it and fit new toughened or laminated glass, usually ${lead().glass} later. A replacement pane costs ${guidePrice('glassPane')}, fitted. This is a Birmingham-area service, up to ${radius()} miles out.`,
    keyFacts: [
      { label: 'Per pane, guide', value: priceRange('glassPane') },
      { label: 'New glass in', value: lead().glass },
      { label: 'Where', value: brumOnly() },
    ],
    summary: 'Boarded up on the same visit, then new safety glass made to measure.',
    quoteService: 'glass',
    questions: [
      {
        q: 'How much does it cost to replace a shop window?',
        a: [
          `A single ${priceBasis('glassPane')} pane costs ${guidePrice('glassPane')}, fitted. ${vatNote()} Large panes, laminated security glass and panes above head height that need a tower cost more. Boarding up is priced separately and is paid even if your insurer then uses someone else for the glass.`,
        ],
      },
      {
        q: 'Why can’t you fit new glass the same day?',
        a: [
          'Shopfront glass is toughened or laminated for safety, and toughened glass cannot be cut once it is made. Each pane is made to the size we measure, which takes a few working days. Until then the opening is boarded and secure.',
        ],
      },
      {
        q: 'Will you deal with my insurer?',
        a: [
          'We can give you a written note of the damage, what we boarded and what the replacement costs, with photos, for your claim. The claim itself stays between you and your insurer.',
        ],
      },
      {
        q: 'Which glass should go back in: toughened or laminated?',
        a: [
          'Toughened glass breaks into small blunt pieces, which is the safety requirement. Laminated glass holds together when it breaks, so a thief cannot simply climb through. For a front window that has been hit once, laminated is usually worth the extra.',
        ],
      },
    ],
  },
  {
    path: '/lock-and-door-repairs',
    kind: 'repair',
    name: 'Lock and door repairs',
    serviceType: 'Shop door and lock repair',
    title: 'Shop Door & Lock Repairs, Birmingham',
    description: `Shop doors that drag, won’t lock or slam: closers, floor springs, locks and push bars repaired across Birmingham. Most repairs ${guidePrice('lockRepair')}.`,
    h1: 'Shop door and lock repairs in Birmingham',
    answer: `We fix shop doors that drag, won’t lock, slam or swing open: locks, closers, floor springs, hinges and fire-exit push bars. Most repairs cost ${guidePrice('lockRepair')}, and we aim to be with you ${resp().standard}, or ${resp().emergency} if the shop cannot be locked. This is Birmingham-area only, up to ${radius()} miles out.`,
    keyFacts: [
      { label: 'Most repairs, guide', value: priceRange('lockRepair') },
      { label: 'Can’t lock up', value: resp().emergency },
      { label: 'Where', value: brumOnly() },
    ],
    summary: 'Locks, closers, floor springs and push bars, sorted before closing time.',
    quoteService: 'door-or-lock',
    questions: [
      {
        q: 'My shop door won’t lock. Can you come tonight?',
        a: [
          `If the shop cannot be secured, treat it as an emergency: call or WhatsApp and we aim to be there ${resp().emergency}. The emergency line is answered ${profile.emergencyHours.value.toLowerCase()}.`,
        ],
      },
      {
        q: 'Why does my shop door drag or slam?',
        a: [
          'On an aluminium shop door it is nearly always the floor spring or the overhead closer. When the oil leaks out, the door stops closing gently and either slams or hangs open. A dragging door usually means the pivot has worn or the frame has dropped. Both are repairable without a new door.',
        ],
      },
      {
        q: 'A member of staff has left with the keys. What now?',
        a: [
          'We change the lock cylinder, usually in one visit, and give you new keys. If the shutter lock uses the same key, we do that at the same time.',
        ],
      },
      {
        q: 'How much is a door or lock repair?',
        a: [`Most jobs come to ${guidePrice('lockRepair')}, ${priceBasis('lockRepair')}. ${vatNote()}`],
      },
    ],
  },
];

export const installServices = () => services().filter((s) => s.kind === 'install');
export const repairServices = () => services().filter((s) => s.kind === 'repair');
export const serviceAt = (path: string) => {
  const s = services().find((x) => x.path === path);
  if (!s) throw new Error(`No service page at ${path}`);
  return s;
};
