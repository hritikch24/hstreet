/**
 * More practical guides for shop owners, added 2026-10-29. Same rules as
 * copy/guides.ts: each answers a question a shop owner really asks, states
 * only what the firm has confirmed (prices come from the profile) or what is
 * generally true of the trade, and ends on the page where they can act.
 * Nothing here claims an accreditation, a rating or a guarantee.
 */
import { guidePrice, radius } from '@/business/profile';
import type { Guide } from '@/copy/guides';

export const moreGuides = (): Guide[] => [
  {
    slug: 'how-much-does-a-shopfront-cost',
    title: 'How Much Does a New Shopfront Cost in the UK?',
    h1: 'What should I budget for a new shopfront?',
    description:
      'Guide prices for a new aluminium shopfront with doors and glass, what moves the price up or down, and what a written quote should spell out.',
    answer: `A typical single-door aluminium shopfront up to about five metres wide costs ${guidePrice('shopfront')}, fitted. Width, the number of doors, the glass and any shutter move it more than anything else. Treat any figure before a survey as an idea of cost, and ask for the final price in writing.`,
    sections: [
      {
        heading: 'What is in the price of a shopfront?',
        paras: [
          'The frame, the glass, the door or doors with their locks and closers, the fitting, and taking away the old front. Those are the five things to look for in any quote, because a low price often leaves one of them out.',
        ],
      },
      {
        heading: 'What makes one shopfront dearer than another?',
        paras: ['Most of the spread between the low and high figure comes from a short list:'],
        steps: [
          'Width of the opening: more frame, more glass, more labour',
          'The number of doors, and whether any are automatic or glass',
          'The glass: toughened or laminated costs more than basic float, and double glazing more again',
          'The finish: standard colours are cheaper than a special match',
          'A shutter box built into the frontage',
          'A badly bowed lintel, damp or a broken-out wall behind the old front, which have to be put right first',
        ],
      },
      {
        heading: 'What does a shutter add to the cost?',
        paras: [
          `If you want a roller shutter behind or over the new front, a manual one is about ${guidePrice('shutterManual').replace('about ', '')} and an electric one about ${guidePrice('shutterElectric').replace('about ', '')}. Deciding on the shutter before the frontage is made is cheaper than adding the box afterwards.`,
        ],
      },
      {
        heading: 'What should a written quote say?',
        paras: ['Ask for these in writing before you agree to anything:'],
        steps: [
          'The size of the opening the price is for',
          'The glass type and thickness',
          'The door hardware: locks, closers, handles, push bars',
          'The colour and finish',
          'What is included and what is not, including removing the old front',
          'How long it takes from signed drawings to fitted',
        ],
      },
      {
        heading: 'Is a guide price the same as a quote?',
        paras: [
          'No. A guide price is a range to help you plan; it is built from typical jobs. We confirm a price in writing once we have measured, and nothing is ordered before you have seen it. Installation is UK-wide.',
        ],
      },
    ],
    next: { label: 'See guide prices for every job', href: '/prices' },
  },
  {
    slug: 'do-you-need-permission-to-change-a-shopfront',
    title: 'Do You Need Permission to Change a Shopfront?',
    h1: 'Do you need permission to change a shopfront?',
    description:
      'Landlord consent, planning permission, listed buildings, signs and Building Regulations: what to check before you order a new shopfront.',
    answer:
      'Often, yes, and from more than one person. Start with your landlord, then ask the council whether the new front needs planning permission, because changing how a building looks from the street usually does. Listed buildings, conservation areas and illuminated signs have extra rules. We fit shopfronts and do not advise on planning, so put the question to your council before you order.',
    sections: [
      {
        heading: 'Does your landlord have to agree?',
        paras: [
          'If you rent, almost certainly. A lease usually says the frontage belongs to the landlord, and changing it without written consent can put you in breach. Get the consent in writing and keep it with the drawings.',
        ],
      },
      {
        heading: 'Does a new shopfront need planning permission?',
        paras: [
          'Replacing a front with a different design, materials or proportions normally counts as a change to the appearance of the building, and that usually needs planning permission. Repairing or replacing like for like often does not. The rules differ between England, Scotland, Wales and Northern Ireland, and between councils, so the council’s planning team is the only reliable answer.',
        ],
      },
      {
        heading: 'What if my shop is a listed building or sits in a conservation area?',
        paras: [
          'A listed building needs listed building consent for almost any change to the front, and a conservation area often brings its own limits on materials and colours. Councils sometimes ask for timber on period buildings. We fit aluminium, and we will tell you plainly if your building needs something we do not make.',
        ],
      },
      {
        heading: 'Do signs and fascias need separate consent?',
        paras: [
          'They can. Illuminated signs, projecting signs and some fascias fall under advertisement rules that are separate from the shopfront itself. Ask the council about the sign at the same time as the front.',
        ],
      },
      {
        heading: 'What about Building Regulations?',
        paras: [
          'New glazing and doors must meet them: safety glass in doors and low panels, step-free access where it is reasonable, and fire exits that open easily from inside. A fitter should work to these as a matter of course. Ask for it to be stated on the drawing.',
        ],
      },
      {
        heading: 'What can we give the council or your landlord?',
        paras: [
          'The drawings we send before anything is made show the proposed front, and you are free to give them to the council or your landlord. We send them after the survey, so for a planning application it can help to ask for a drawing first.',
        ],
      },
    ],
    next: { label: 'Ask for a shopfront price', href: '/aluminium-shopfronts' },
  },
  {
    slug: 'repair-or-replace-a-roller-shutter',
    title: 'Repair or Replace a Roller Shutter? How to Decide',
    h1: 'Is it worth repairing my roller shutter, or should I replace it?',
    description:
      'When a roller shutter is worth repairing, when a new one is the better buy, and how the costs compare for a small shop.',
    answer: `If the fault is a part, such as a spring, lock, guide or a few laths, repair it: most repairs cost ${guidePrice('shutterRepair')}. If the curtain is badly bent or corroded, or you keep paying for callouts, a new manual shutter at ${guidePrice('shutterManual')} is usually the better buy.`,
    sections: [
      {
        heading: 'What can usually be repaired?',
        paras: [
          'Springs, locks, bottom rails, guide rails, a handful of damaged laths, a motor or its switch. These are parts that wear, and replacing them gives the shutter many more years.',
        ],
      },
      {
        heading: 'When is a new shutter the better buy?',
        paras: ['Replace rather than repair when:'],
        steps: [
          'The curtain is bent along much of its length, not just a few laths',
          'Rust has eaten through the laths or the guides',
          'The box or barrel is damaged or out of line',
          'You have paid for several repairs in a year',
          'You want to go from manual to electric',
        ],
      },
      {
        heading: 'How do the costs compare?',
        paras: [
          `A repair is ${guidePrice('shutterRepair')}, with parts. A new manual shutter is ${guidePrice('shutterManual')} and an electric one ${guidePrice('shutterElectric')}. One repair is nearly always cheaper. Three in a year is usually not.`,
        ],
      },
      {
        heading: 'Where can we repair, and where can we replace?',
        paras: [
          `We repair shutters in Birmingham and up to about ${radius()} miles from it. New shutters we fit anywhere in the UK, so if you are further out and your shutter needs replacing, that part we can do.`,
        ],
      },
    ],
    next: { label: 'Shutter repairs in Birmingham', href: '/shutter-repairs' },
  },
  {
    slug: 'shop-broken-into-first-steps',
    title: 'Shop Broken Into? What to Do in the First Hour',
    h1: 'My shop has been broken into. What do I do first?',
    description:
      'The first steps after a break-in: staying safe, the police, photographs, your insurer and making the shopfront secure for tonight.',
    answer: `Make sure no one is hurt and do not go in if the intruder may still be there. Call the police, photograph everything before you tidy, tell your insurer, then get the opening made secure for the night. Within about ${radius()} miles of Birmingham we board up day or night.`,
    sections: [
      {
        heading: 'What should you do first?',
        paras: ['In this order:'],
        steps: [
          'If someone may still be inside, stay out and call 999. Otherwise call 101',
          'Ask for a crime reference number and write it down',
          'Photograph the damage, the broken glass and anything missing, before cleaning up',
          'Tell your insurer as early as you can, and ask what they need before they pay for repairs',
          'Get the opening secured so the shop is safe overnight',
        ],
      },
      {
        heading: 'How do you secure the shopfront tonight?',
        paras: [
          `A board-up makes the opening safe and weather-tight until the glass is replaced. Within about ${radius()} miles of Birmingham we do this at any hour, and most boarding for a standard shopfront costs ${guidePrice('boardUp')}, callout included. Further out, a local glazier or board-up service will be faster than we can be.`,
        ],
      },
      {
        heading: 'What about the glass?',
        paras: [
          'Replacement glass is ordered to measure, so it usually comes a day or more after the board-up. Safety glass, either toughened or laminated, is the norm for doors and low panels.',
        ],
      },
      {
        heading: 'How do you make a second break-in less likely?',
        paras: [
          'Most break-ins come through the glass or the door. A roller shutter or security grille over the glass, and a better lock on the door, deal with both. Many shops add them after a break-in, once the immediate repair is done.',
        ],
      },
    ],
    next: { label: 'Emergency board-up', href: '/emergency-board-up' },
  },
  {
    slug: 'aluminium-steel-or-timber-shopfront',
    title: 'Aluminium, Steel or Timber Shopfront: Which to Choose?',
    h1: 'Aluminium, steel or timber: which material suits my shopfront?',
    description:
      'How aluminium, steel and timber shopfronts compare on upkeep, strength, look and cost, and which one suits a shop, takeaway or period building.',
    answer:
      'For most shops, aluminium: it does not rot, needs almost no upkeep and comes in many colours. Steel suits shutters and security doors where strength matters most. Timber suits period buildings and is sometimes required by the council, but needs repainting. We fit aluminium and steel, not timber.',
    sections: [
      {
        heading: 'Why is aluminium the usual choice?',
        paras: [
          'It does not rot or swell, a powder-coated finish lasts for years with an occasional wash, and the frames are slim, so there is more glass and less frame. It is also the cheapest of the three for most shopfronts.',
        ],
      },
      {
        heading: 'Where does steel make more sense?',
        paras: [
          'Doors and shutters. Steel is harder to force than aluminium, which is why security doors, fire exits and shutter laths are often steel. The one thing to watch is the finish: if it is scratched through, steel can rust, so touch-ups matter.',
        ],
      },
      {
        heading: 'When is timber the right answer?',
        paras: [
          'On a period building, in a conservation area, or on a listed one, where a council may ask for timber. Timber looks right on those buildings and can be repaired many times, but it needs regular repainting. If that is what your building needs, we will say so rather than sell you something that will not be accepted.',
        ],
      },
      {
        heading: 'Can you mix them?',
        paras: [
          'Very often. An aluminium frontage with a steel security door and a steel roller shutter is a common combination. Each material goes where it does the most good.',
        ],
      },
    ],
    next: { label: 'Aluminium shopfronts, fitted UK-wide', href: '/aluminium-shopfronts' },
  },
  {
    slug: 'getting-ready-for-a-shopfront-fitting',
    title: 'Getting Ready for a Shopfront Fitting: What We Need',
    h1: 'How do I get my shop ready for a new shopfront to be fitted?',
    description:
      'What to sort out before the fitters arrive: parking, power, access, stock and the old front, so a one or two day job stays on time.',
    answer:
      'Clear the space behind the front, tell us about parking and power, and plan to be shut or half-shut for a day or two. The team removes the old front and takes it away with the packaging and offcuts. Most of the preparation is a short conversation at the survey.',
    sections: [
      {
        heading: 'Where will the van park?',
        paras: [
          'The team needs to unload glass and frames close to the shop. If you are on a double yellow line, a pedestrian street or a market, tell us at the survey. A parking bay suspension is something the council has to arrange, and it can take time, so ask early.',
        ],
      },
      {
        heading: 'What should be moved inside the shop?',
        paras: [
          'Anything within about a metre and a half of the front: shelves, stock, freezers, displays and the till if it sits by the window. Take down any posters, signs or stickers you want to keep.',
        ],
      },
      {
        heading: 'Is there power, and where is it?',
        paras: [
          'A shutter motor or an automatic door needs a supply, and we connect to one that is already there. If you are not sure where it is or whether it works, show us at the survey. Signage and wider electrics are not something we do.',
        ],
      },
      {
        heading: 'Can the shop stay open while the front is fitted?',
        paras: [
          'Not through the front, since the opening is out while it is fitted. Many shops shut for the job, which usually takes one or two days, or trade from a side door. The fitters will secure the opening at the end of each day.',
        ],
      },
      {
        heading: 'What happens to the old front?',
        paras: ['We take it down and take it away, along with the packaging and offcuts, so you are not left with a skip to arrange.'],
      },
    ],
    next: { label: 'How a UK-wide job works', href: '/nationwide' },
  },
  {
    slug: 'automatic-door-wont-open',
    title: 'Automatic Door Won’t Open? What to Check First',
    h1: 'My automatic door won’t open. What can I check?',
    description:
      'Safe checks for an automatic shop door that will not open or close properly, and the signs that mean you should stop and call an engineer.',
    answer: `Check the mode switch, the power and anything blocking the sensor or the track. If none of that is it, or the door is noisy, slow or closing on people, stop using it and call an engineer. Within about ${radius()} miles of Birmingham, a repair is usually ${guidePrice('autoDoorRepair')}.`,
    sections: [
      {
        heading: 'Is it set to the wrong mode?',
        paras: [
          'Many automatic doors have a mode switch or keypad: open, automatic, exit only, locked. Someone changing it at closing time and not changing it back is the most common cause of a door that “won’t work”.',
        ],
      },
      {
        heading: 'What else can you safely check?',
        paras: ['Without opening any covers or touching the drive:'],
        steps: [
          'Is the power on? Check the switch and the fused spur near the door',
          'Are the sensors dusty, covered by a poster or blocked by a display?',
          'Is anything caught in the track at the floor, such as grit, a leaf or a dropped item?',
          'Does the door move freely if you push it by hand with the power off?',
        ],
      },
      {
        heading: 'When should you stop using it?',
        paras: [
          'If it closes on people, opens by itself at odd times, makes a grinding noise or hangs half open, put a notice up and use another door where you can. These are safety faults, and a door that closes on a customer is a worse problem than a door that stays shut.',
        ],
      },
      {
        heading: 'Who fixes it, and what does it cost?',
        paras: [
          `Within about ${radius()} miles of Birmingham we repair automatic doors: belts, rollers, drive units and sensors. A callout is ${guidePrice('autoDoorRepair')} with common parts. Further away, ask the company that installed or last serviced the door.`,
        ],
      },
    ],
    next: { label: 'Automatic door repairs', href: '/automatic-door-repairs' },
  },
  {
    slug: 'roller-shutters-and-shop-insurance',
    title: 'Roller Shutters and Shop Insurance: What to Ask First',
    h1: 'Will my insurer want a particular kind of roller shutter?',
    description:
      'What to ask your insurer before buying a roller shutter or security grille, and what to ask your fitter to put in writing.',
    answer:
      'Some policies set conditions on shutters, locks or security for certain premises, so ask your insurer before you buy, and ask in writing. Then ask your fitter to put the shutter’s construction and lock on the quote, so you can send it to the insurer.',
    sections: [
      {
        heading: 'Does insurance require a shutter?',
        paras: [
          'It depends on the insurer, the area and what the shop sells. Some policies require shutters, grilles or specific locks, and some lower the premium or excess if you have them. The only reliable answer is in your own policy, or from your broker.',
        ],
      },
      {
        heading: 'What should you ask the insurer?',
        paras: ['Four questions cover most of it:'],
        steps: [
          'Do I need a shutter or grille on the window, the door or both?',
          'Does the policy name a security standard or rating the shutter has to meet, and which?',
          'What do you need as proof once it is fitted?',
          'Will fitting one change the premium or the excess?',
        ],
      },
      {
        heading: 'What should the fitter put in writing?',
        paras: [
          'The material and thickness of the curtain, the type of lath, how it is locked, and whether it is manual or electric with an override. If your insurer names a rating, ask the fitter in writing whether the shutter in the quote meets it. A vague “yes” is not enough.',
        ],
      },
      {
        heading: 'Is a shutter or a grille better?',
        paras: [
          'A solid shutter hides stock and glass, while a see-through grille lets the display show at night. Which your insurer prefers, if either, is another question for them. We fit both.',
        ],
      },
    ],
    next: { label: 'Roller shutters, fitted UK-wide', href: '/roller-shutters' },
  },
  {
    slug: 'toughened-or-laminated-shopfront-glass',
    title: 'Toughened or Laminated Glass for a Shopfront?',
    h1: 'Toughened or laminated glass: which should my shopfront have?',
    description:
      'How toughened, laminated and double-glazed glass differ, which shop doors and low panels need safety glass, and what replacement glass costs.',
    answer: `Toughened glass crumbles into small blunt pieces when it breaks. Laminated glass cracks but stays in one sheet, which makes it harder to get through. Doors and low panels need safety glass of one type or the other. Replacement panes cost ${guidePrice('glassPane')}.`,
    sections: [
      {
        heading: 'What is toughened glass?',
        paras: [
          'Glass that has been heated and cooled so it is several times stronger than ordinary glass. When it does break, it breaks into small, blunt pieces rather than sharp shards. It has to be made to size: it cannot be cut afterwards.',
        ],
      },
      {
        heading: 'What is laminated glass?',
        paras: [
          'Two sheets of glass bonded to a clear layer between them. A hit cracks the glass but the layer holds it together, so it stays in the frame and is much harder to push through. That is why it is often chosen for security.',
        ],
      },
      {
        heading: 'Which panes need safety glass?',
        paras: [
          'In general, doors, panels beside doors and glass close to floor level, because that is where people fall or walk into it. Building Regulations call these critical locations, and safety glass is required in them. Your fitter should state the glass type on every pane of the drawing.',
        ],
      },
      {
        heading: 'What about double glazing?',
        paras: [
          'A sealed unit, two panes with a gap between, keeps heat in and noise out. A unit can have toughened or laminated panes in it. It costs more, and is worth it for a shop with a seating area or staff who work by the window.',
        ],
      },
      {
        heading: 'What does replacement glass cost?',
        paras: [
          `A replacement pane is ${guidePrice('glassPane')}, depending on size and type. Within about ${radius()} miles of Birmingham we replace shopfront glass, and board up first if it cannot be done the same day.`,
        ],
      },
    ],
    next: { label: 'Shopfront glass replacement', href: '/shopfront-glass' },
  },
];
