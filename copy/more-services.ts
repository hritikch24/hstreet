/**
 * Copy for the seven service pages added on top of the original eight:
 * four installs (glass doors, curtain walling, security grilles, canopies)
 * and three repair lines (automatic door repairs, planned servicing,
 * emergency board-up). Same rules as copy/services.ts: every figure comes
 * from business/profile.ts, and every `questions` entry is a visible heading
 * that also feeds the page's FAQPage JSON-LD.
 *
 * No photograph is used unless it genuinely shows the work on the page.
 */
import { guidePrice, priceBasis, priceRange, profile, radius, vatNote } from '@/business/profile';
import type { ServicePage } from '@/copy/services';

const lead = () => profile.leadTimes.value;
const resp = () => profile.response.value;
const ukWide = 'Fitted anywhere in the UK';
const repairReach = () => `Birmingham and within ${radius()} miles`;

export const moreServices = (): ServicePage[] => [
  {
    path: '/glass-doors',
    kind: 'install',
    name: 'Frameless glass doors',
    serviceType: 'Frameless glass shop door installation',
    title: 'Frameless Glass Shop Doors, Fitted UK-Wide',
    description: `Frameless toughened glass doors for shops and showrooms, made to measure and fitted anywhere in the UK. Typically ${guidePrice('glassDoor')}.`,
    h1: 'Frameless glass doors for shops',
    answer: `We supply and fit frameless toughened glass doors for shops, salons and showrooms where you want the frontage to look as open as possible. A single door with fittings and a lock costs ${guidePrice('glassDoor')} and is fitted ${lead().glass} after you order. We fit them anywhere in the UK, into a new front or an existing opening.`,
    keyFacts: [
      { label: 'Guide price', value: priceRange('glassDoor') },
      { label: 'Order to fitted', value: lead().glass },
      { label: 'Where', value: ukWide },
    ],
    photos: { line: 'shopfronts', hero: 'wide-glass-frontage-ornate-high-street', gallery: false },
    summary: 'Toughened glass leaves with patch fittings, a floor spring or pivot, and a lock.',
    quoteService: 'glass-door',
    compare: [
      {
        caption: 'Frameless glass door or framed aluminium door?',
        head: ['', 'Frameless glass', 'Framed aluminium'],
        rows: [
          ['Look', 'Clear glass edge to edge, almost no metal', 'A slim frame around each leaf'],
          ['Strength at the edge', 'Edges and corners are the weak point', 'The frame protects the glass edge'],
          ['Locking', 'Floor lock or patch lock in the glass', 'Multipoint lock in the frame'],
          ['Weather sealing', 'Brush or gasket, not airtight', 'Better sealed against draughts'],
          ['Best for', 'Shop and salon fronts that want to be seen through', 'Busy entrances and exposed sites'],
        ],
      },
    ],
    questions: [
      {
        q: 'How much does a frameless glass shop door cost?',
        a: [
          `A single frameless door ${priceBasis('glassDoor')} costs ${guidePrice('glassDoor')}. ${vatNote()} A pair of doors, a side panel or an over-panel above the door each add to it, and so does glass thicker than the usual 10 or 12mm.`,
        ],
      },
      {
        q: 'Does a glass door need marks on it?',
        a: [
          'Yes. A clear glass door has to be easy to see, so a band or logo at eye level is normal and, in a workplace, expected under the workplace safety regulations. We can fit a frosted band or cut vinyl, or you can supply your own graphics.',
        ],
      },
      {
        q: 'Is a frameless door secure enough for a shop?',
        a: [
          `It can be, with the right glass and lock, but it is the least forgiving option. Toughened glass is strong flat-on and weak at its edges, so for a door that is shut at night we usually pair it with a roller shutter or a security grille outside the glass. Laminated glass is the stronger choice if you cannot have a shutter.`,
        ],
      },
      {
        q: 'Can you put a glass door into the frontage I already have?',
        a: [
          'Often, yes. We need to see the opening and the frame it sits in. A frameless leaf hangs from fittings fixed to the top and bottom of the opening, so those have to be sound. If they are not, we say so and price the fix, or fit a new front around the door.',
        ],
      },
    ],
  },
  {
    path: '/curtain-walling',
    kind: 'install',
    name: 'Curtain walling and glazed screens',
    serviceType: 'Aluminium curtain walling and glazed screen installation',
    title: 'Curtain Walling & Glazed Screens for Shops',
    description: `Aluminium curtain walling and large glazed screens for shops and units, made to measure and fitted UK-wide. Around ${guidePrice('curtainWalling')} per square metre.`,
    h1: 'Curtain walling and glazed screens for shops',
    answer: `We make and fit aluminium curtain walling and large glazed screens for shops and units: full-height frontages, upper-floor glazing and long runs that a standard shopfront system does not suit. A guide is ${guidePrice('curtainWalling')} for each square metre of glazing, fitted, and we usually fit ${lead().shopfront}. Fitted anywhere in the UK.`,
    keyFacts: [
      { label: 'Per m², guide', value: priceRange('curtainWalling') },
      { label: 'Order to fitted', value: lead().shopfront },
      { label: 'Where', value: ukWide },
    ],
    photos: { line: 'shopfronts', hero: 'aluminium-glazed-screen-new-unit-night', gallery: false },
    summary: 'Tall aluminium-framed glazing and long glazed screens, made to the opening.',
    quoteService: 'curtain-walling',
    questions: [
      {
        q: 'Curtain walling or a shopfront: which does my building need?',
        a: [
          'For a door and a window or two in a ground-floor opening, a shopfront system is the right choice, and the cheaper one. Curtain walling is hung on the face of the building, so it can run taller and wider, take glazing above the ground floor and be fixed back to the structure instead of sitting inside the opening. If the glass is taller than a door, or the screen runs up past the first floor, ask for curtain walling.',
        ],
      },
      {
        q: 'How much does curtain walling cost per square metre?',
        a: [
          `A guide is ${guidePrice('curtainWalling')}, ${priceBasis('curtainWalling')}. ${vatNote()} Double-glazed units with a solar or thermal coating, opening vents, doors set into the screen and work above head height all raise it. Scaffold or a lifting platform for upper floors is shown as its own line.`,
        ],
      },
      {
        q: 'Do building regulations apply to new glazing on a shop?',
        a: [
          'They can. New or replacement glazing is usually expected to meet the energy-efficiency rules, and safety glass is needed in doors and low panes. A listed building or a conservation area may need consent before anything changes on the front. We tell you what we think applies when we survey; your building control office or the council has the final say.',
        ],
      },
      {
        q: 'Can you match the glazing to the rest of the building?',
        a: [
          'We can match the frame colour from a sample or reference, and the sightlines (how wide the frame looks from outside) from a drawing. Matching old glass exactly is harder, so we agree it on a sample before anything is ordered.',
        ],
      },
    ],
  },
  {
    path: '/security-grilles',
    kind: 'install',
    name: 'Security grilles',
    serviceType: 'Security grille installation',
    title: 'Security Grilles for Shops, Fitted UK-Wide',
    description: `Open security grilles for shop windows and doors, in lattice or rolling form, supplied and fitted UK-wide. Typically ${guidePrice('securityGrille')}.`,
    h1: 'Security grilles for shop windows and doors',
    answer: `We supply and fit security grilles that let people see in at night while keeping the opening secure: rolling grilles in a box above the opening, and lattice grilles that fold back to the side. A standard opening costs ${guidePrice('securityGrille')}, fitted ${lead().shutter} after you order. We fit them anywhere in the UK.`,
    keyFacts: [
      { label: 'Guide price', value: priceRange('securityGrille') },
      { label: 'Order to fitted', value: lead().shutter },
      { label: 'Where', value: ukWide },
    ],
    summary: 'See-through rolling and lattice grilles for windows, doors and arcades.',
    quoteService: 'security-grille',
    compare: [
      {
        caption: 'Solid shutter, perforated shutter or open grille?',
        head: ['', 'Solid shutter', 'Perforated shutter', 'Open grille'],
        rows: [
          ['Seen into at night', 'No', 'A little, through the holes', 'Yes, you see the whole window'],
          ['Air and light', 'None', 'Some', 'Most'],
          ['Graffiti', 'Gives a flat face to paint on', 'Less', 'Hardly any'],
          ['Planning and conservation areas', 'Often refused on the front', 'Sometimes', 'Often accepted'],
          ['Insurer', 'Usually accepted', 'Usually accepted', 'Check first: some want a rated product'],
        ],
      },
    ],
    questions: [
      {
        q: 'How much does a security grille cost for a shop?',
        a: [
          `A grille over an opening ${priceBasis('securityGrille')} costs ${guidePrice('securityGrille')}, fitted. ${vatNote()} Wide arcade frontages, electric operation and unusual colours cost more; a manual lattice grille is usually the cheapest.`,
        ],
      },
      {
        q: 'Will my insurer accept a security grille?',
        a: [
          'Many do, but some policies ask for a shutter or grille that has been tested to a recognised security rating, and they do not all accept every type. Ask your insurer for the wording before you order. We can tell you what we are quoting and give you the specification to send them.',
        ],
      },
      {
        q: 'Rolling grille or lattice grille: which suits my shop?',
        a: [
          'A rolling grille sits in a box over the opening and lifts and drops, so it takes no floor or wall space and can be electric. A lattice grille is a folding trellis that stacks to the side, which suits a narrow arcade unit with room on one side. A rolling grille is the neater look for most high-street fronts.',
        ],
      },
      {
        q: 'Can a grille go behind the glass instead of outside it?',
        a: [
          'Yes. An internal grille is protected from the weather and from graffiti and does not change the outside of the building, which matters in a conservation area. It does not stop the glass being broken, so for a shop with stock in the window the external one is the stronger deterrent.',
        ],
      },
    ],
  },
  {
    path: '/canopies-and-awnings',
    kind: 'install',
    name: 'Canopies and awnings',
    serviceType: 'Shop canopy and awning installation',
    title: 'Shop Canopies & Awnings, Fitted UK-Wide',
    description: `Fixed canopies and folding-arm awnings for shopfronts, supplied and fitted UK-wide. A canopy over one frontage is typically ${guidePrice('canopy')}.`,
    h1: 'Canopies and awnings for shopfronts',
    answer: `We supply and fit fixed canopies and folding-arm awnings over shopfronts, to shade the window, keep the pavement dry and give the front some presence. One frontage costs ${guidePrice('canopy')} and is fitted ${lead().shutter} after you order. We fit them anywhere in the UK, and tell you early if the council needs to be asked.`,
    keyFacts: [
      { label: 'Guide price', value: priceRange('canopy') },
      { label: 'Order to fitted', value: lead().shutter },
      { label: 'Where', value: ukWide },
    ],
    summary: 'Fixed canopies and folding-arm awnings, made to your frontage and fixed to the wall.',
    quoteService: 'canopy',
    questions: [
      {
        q: 'How much does a shop canopy or awning cost?',
        a: [
          `A canopy or awning ${priceBasis('canopy')} costs ${guidePrice('canopy')}. ${vatNote()} Width, how far it projects, motorised operation, printed fabric and a wall that needs extra fixing all move the figure.`,
        ],
      },
      {
        q: 'Do I need permission to put an awning over the pavement?',
        a: [
          'Often, yes. A canopy that projects over a public pavement usually needs the highway authority’s consent, and councils normally want the lowest edge at a minimum clear height above the pavement, commonly around 2.4 metres. Planning permission can also be needed in a conservation area or on a listed building. We tell you what we think applies when we survey, but the council decides.',
        ],
      },
      {
        q: 'Fixed canopy or folding-arm awning?',
        a: [
          'A fixed canopy is a frame and a covering that stays put, so it is the lower-maintenance choice and works as a sign band. A folding-arm awning winds back against the wall when you do not want it, so the front is clear in winter and the awning is protected from the weather. Folding awnings suit south-facing shops that need the shade at certain hours.',
        ],
      },
      {
        q: 'Will the wall take an awning?',
        a: [
          'It has to. A folding awning puts a pull on its fixings, so we check what the wall is made of and fix to the structure, not just the render or cladding. If the wall is not up to it, we say so before you pay, and price a bracket or a different fixing.',
        ],
      },
    ],
  },
  {
    path: '/automatic-door-repairs',
    kind: 'repair',
    name: 'Automatic door repairs',
    serviceType: 'Automatic door repair',
    title: 'Automatic Door Repairs, Birmingham',
    description: `Automatic sliding and swing doors that won’t open, stay open or stop mid-way, repaired across Birmingham and ${radius()} miles. Callouts ${guidePrice('autoDoorRepair')}.`,
    h1: 'Automatic door repairs in Birmingham',
    answer: `We repair automatic sliding and swing doors that will not open, will not close, stay open or stop part-way: sensors, belts, rollers, drive units, controllers and battery backups. A callout costs ${guidePrice('autoDoorRepair')} with common parts, and we aim to reach an emergency ${resp().emergency}. We cover Birmingham and up to ${radius()} miles from it.`,
    keyFacts: [
      { label: 'Callout, guide', value: priceRange('autoDoorRepair') },
      { label: 'Emergency response', value: resp().emergency },
      { label: 'Where', value: repairReach() },
    ],
    summary: 'Sensors, belts, rollers, drive units and controllers on sliding and swing doors.',
    quoteService: 'automatic-door-repair',
    questions: [
      {
        q: 'My automatic door is stuck open and I need to lock up. What do I do?',
        a: [
          'Most automatic doors have a mode switch or key on the operator that puts them into manual or locked mode. If the door will slide by hand once it is in that mode, you can usually close and lock it for the night. If it will not move, or the leaf is damaged, call us and board or guard the opening until we arrive.',
        ],
      },
      {
        q: 'Why will my automatic door not open when someone walks up?',
        a: [
          'It is usually the sensor: a dirty or knocked lens, a sensor that has been aimed wrongly or a cable that has come loose. A worn belt, a seized roller or something stuck in the track also does it. A lens wipe is worth trying first; if it still will not open, the safe thing is to leave it alone and have it looked at.',
        ],
      },
      {
        q: 'Can you repair any make of automatic door?',
        a: [
          'We repair most common sliding and swing door operators. Send a photo of the operator housing and its label and we tell you whether we can fix it and which parts we need. If a part has to be ordered, we secure the opening before we leave.',
        ],
      },
      {
        q: 'How much does an automatic door repair cost?',
        a: [
          `A callout costs ${guidePrice('autoDoorRepair')}, ${priceBasis('autoDoorRepair')}. ${vatNote()} A drive unit or controller that has to be replaced costs more, and we give you the figure before we order it.`,
        ],
      },
    ],
  },
  {
    path: '/shopfront-servicing',
    kind: 'repair',
    name: 'Planned shopfront servicing',
    serviceType: 'Shutter, door and shopfront maintenance',
    title: 'Shutter & Shopfront Servicing, Birmingham',
    description: `Planned servicing for roller shutters, automatic doors, closers and locks across Birmingham and ${radius()} miles, so faults get found before they close you.`,
    h1: 'Planned shutter, door and shopfront servicing',
    answer: `We service roller shutters, automatic doors, door closers, locks and glazing seals on a schedule you agree, so a worn spring or sensor is found on a quiet morning and not on a Saturday. A planned visit costs ${guidePrice('servicingVisit')}, before parts. We cover Birmingham and up to ${radius()} miles from it.`,
    keyFacts: [
      { label: 'Per visit, guide', value: priceRange('servicingVisit') },
      { label: 'Visits', value: 'On a schedule you agree' },
      { label: 'Where', value: repairReach() },
    ],
    summary: 'Checked, adjusted and lubricated on a schedule, with a written note after each visit.',
    quoteService: 'servicing',
    compare: [
      {
        caption: 'What do we check on a planned visit?',
        head: ['', 'Roller shutter', 'Automatic door'],
        rows: [
          ['Moving parts', 'Springs, tension, guides, curtain and bottom rail', 'Belt, rollers, track and drive unit'],
          ['Safety', 'Safety edge, limit switches, manual override', 'Sensors, safety beams, signage, stop and hold-open functions'],
          ['Locking', 'Locks, key switches and remotes', 'Night lock and battery backup'],
          ['Cleaning and lubrication', 'Guides and box cleared and lubricated', 'Track cleared, sensor lenses wiped'],
          ['What you get after', 'A written note of what we found and did', 'A written note of what we found and did'],
        ],
      },
    ],
    questions: [
      {
        q: 'How often should shutters and automatic doors be serviced?',
        a: [
          'At least once a year for each. A very busy automatic door, or a shutter that goes up and down several times a day, is better looked at twice. We agree the interval with you from how the equipment is used.',
        ],
      },
      {
        q: 'Is there a contract to sign?',
        a: [
          'We agree the schedule and the price per visit in writing before the first one. Parts and repairs are quoted separately and need your agreement first, so a service visit never turns into an unapproved bill.',
        ],
      },
      {
        q: 'What do I get after a service?',
        a: [
          'A written note of what we checked, what we found, what we adjusted and anything that is wearing out. You can keep it with your records, and it is useful if an insurer or a landlord asks when the equipment was last looked at.',
        ],
      },
      {
        q: 'Can you service equipment you did not fit?',
        a: [
          'Yes, on most common makes. Send a photo of the unit and its label and we tell you whether we can look after it. If it is past saving, we say so and quote for a replacement.',
        ],
      },
    ],
  },
  {
    path: '/emergency-board-up',
    kind: 'repair',
    name: 'Emergency board-up',
    serviceType: 'Emergency boarding up and make-safe',
    title: 'Emergency Board-Up After a Break-In, Birmingham',
    description: `Shop broken into or window smashed? We board up and make it secure day or night across Birmingham and ${radius()} miles, usually from ${guidePrice('boardUp')}.`,
    h1: 'Emergency board-up after a break-in',
    answer: `If your shop has been broken into, hit by a vehicle or had a window smashed, we come out, make it safe and board up the opening so you can lock up. The emergency line is answered ${profile.emergencyHours.value.toLowerCase()}, and we aim to reach you ${resp().emergency}. Boarding a standard front costs ${guidePrice('boardUp')}.`,
    keyFacts: [
      { label: 'Board-up, guide', value: priceRange('boardUp') },
      { label: 'Emergency line', value: profile.emergencyHours.value },
      { label: 'Where', value: repairReach() },
    ],
    summary: 'We make the shop safe and secure tonight, then repair it properly.',
    quoteService: 'board-up',
    questions: [
      {
        q: 'What should I do before the board-up team arrives?',
        a: [
          'Keep people away from broken glass and out of the shop. If there has been a break-in, ring the police and ask for a crime number, because your insurer will want it. Photograph the damage before anything is moved, and do not sweep up until you have. Then call us.',
        ],
      },
      {
        q: 'What does an emergency board-up involve?',
        a: [
          'We clear loose glass from the opening, make anything hanging or unstable safe, and fix boards over the damaged panes and door so the shop is closed and secure. If the shutter or lock was forced, we secure those too. You get photographs and a written note of what we did, for your claim.',
        ],
      },
      {
        q: 'How much does boarding up a shop cost?',
        a: [
          `A board-up ${priceBasis('boardUp')} costs ${guidePrice('boardUp')}. ${vatNote()} A large frontage, work at height and a second visit to remove the boards when the glass is ready cost more, and we tell you before we start.`,
        ],
      },
      {
        q: 'What happens after the board-up?',
        a: [
          'We measure for new toughened or laminated glass, repair or replace any forced locks and shutters, and take the boards down when the replacement goes in. Boarding is meant to last days, not months: it keeps the shop closed, but it is not a repair.',
        ],
      },
    ],
  },
];
