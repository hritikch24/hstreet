/**
 * Birmingham-area repair pages, one per area, each written by hand.
 *
 * These are the only local pages for repairs. Areas already covered by other
 * businesses in the owner's portfolio are deliberately absent, and must stay
 * absent: see CLAUDE.md, "Areas we never publish".
 *
 * Response times and prices come from business/profile.ts.
 */
import { priceRange, profile, radius } from '@/business/profile';
import type { QA } from '@/copy/services';

export interface RepairArea {
  slug: string;
  name: string;
  postcodes: string;
  council: string;
  title: string;
  description: string;
  answer: string;
  /** The shopping streets we are called to most, with what matters about each. */
  roads: { name: string; note: string }[];
  shops: string;
  access: string;
  questions: QA[];
}

const r = () => profile.response.value;

const opening = (name: string) =>
  `We repair roller shutters, shop doors, locks and broken shopfront glass in ${name}. We aim to reach an emergency ${r().emergency} and other repairs ${r().standard}; most shutter repairs cost ${priceRange('shutterRepair')}.`;

export const repairAreas = (): RepairArea[] => [
  {
    slug: 'erdington',
    name: 'Erdington',
    postcodes: 'B23 and B24',
    council: 'Birmingham City Council',
    title: 'Shutter & Shopfront Repairs in Erdington',
    description: `Stuck shutters, jammed shop doors and broken shop glass repaired in Erdington, B23 and B24. Emergency response ${profile.response.value.emergency}.`,
    answer: `${opening('Erdington')} Erdington is well inside our Birmingham repair area.`,
    roads: [
      { name: 'Erdington High Street', note: 'the main run of shops, from Six Ways towards the station end; busy with buses all day' },
      { name: 'Sutton New Road', note: 'the dual carriageway behind the High Street, with car parks that make unloading easier' },
      { name: 'Slade Road and Kingstanding Road', note: 'long parades of takeaways and convenience stores that trade late' },
    ],
    shops:
      'Bakers, barbers, phone repair, charity shops and bookmakers on the High Street; takeaways and off-licences on the parades further out. A lot of the shutters here are older manual ones that have been lifted twice a day for years.',
    access:
      'On the High Street itself there is little room to stop, so we park behind on the Sutton New Road side or on a side street and walk the tools in. On the outer parades there is usually a lay-by or service road.',
    questions: [
      {
        q: 'How fast can you fix a stuck shutter in Erdington?',
        a: [
          `If the shutter is stuck open and the shop cannot be locked, we aim to be there ${r().emergency}. A shutter stuck shut on a morning is also urgent for you, so tell us that when you call. Other repairs are ${r().standard}.`,
        ],
      },
      {
        q: 'My old manual shutter is getting heavy to lift. Is it the spring?',
        a: [
          'Usually. The spring inside the barrel loses tension over the years, so you end up lifting more of the weight yourself. We re-tension or replace it. Please don’t try: the spring is under a lot of force.',
        ],
      },
    ],
  },
  {
    slug: 'sutton-coldfield',
    name: 'Sutton Coldfield',
    postcodes: 'B72 to B76',
    council: 'Birmingham City Council (Royal Sutton Coldfield Town Council for local matters)',
    title: 'Shop Door & Shutter Repairs, Sutton Coldfield',
    description: 'Shop door, lock, glass and shutter repairs in Sutton Coldfield town centre, Boldmere and Mere Green, with response times and prices stated up front.',
    answer: `${opening('Sutton Coldfield')} That covers the town centre, Boldmere, Mere Green and Wylde Green.`,
    roads: [
      { name: 'The Parade and the town-centre shopping streets', note: 'chain stores and the shopping centre; many units have centre or landlord rules for contractors' },
      { name: 'Boldmere Road', note: 'independent cafés, salons and delis, with short-stay parking out front' },
      { name: 'Mere Green (Lichfield Road)', note: 'a mix of independents and newer units' },
    ],
    shops:
      'More salons, cafés, estate agents and independent boutiques than takeaways. Doors and glass come up more than heavy security work here: closers that slam, locks that stick in the cold, a window hit overnight.',
    access:
      'Boldmere and Mere Green usually have somewhere to stop close by. For units in the shopping centre we check the centre’s contractor rules before we come, since some want work done before opening.',
    questions: [
      {
        q: 'Can you repair a shop door in the Sutton Coldfield town-centre conservation area?',
        a: [
          'Yes. A repair that keeps the door and frame looking the same does not normally need consent. If a door or front needs replacing rather than repairing, the conservation area can affect what the council will accept, so we would talk that through with you before quoting.',
        ],
      },
      {
        q: 'How quickly can you board up a broken window in Sutton Coldfield?',
        a: [
          `We treat a broken window as an emergency and aim to be there ${r().emergency}. We board it the same visit and measure for the new glass while we are there.`,
        ],
      },
    ],
  },
  {
    slug: 'alum-rock',
    name: 'Alum Rock',
    postcodes: 'B8',
    council: 'Birmingham City Council',
    title: 'Shutter Repairs on Alum Rock Road, B8',
    description: `Shutter, lock and shopfront glass repairs for shops on Alum Rock Road and around B8. Emergencies ${profile.response.value.emergency}; prices given before we start.`,
    answer: `${opening('Alum Rock')} Most of our calls here are to shops on Alum Rock Road itself.`,
    roads: [
      { name: 'Alum Rock Road', note: 'a long, busy road of jewellers, clothes and fabric shops, sweet centres, restaurants and grocers' },
      { name: 'Washwood Heath Road and Belchers Lane', note: 'smaller parades, takeaways and convenience stores' },
    ],
    shops:
      'Shops here open early and close late, and a lot of shutters go up and down more than twice a day. Wide shutters over jewellers and clothes shops are common, and so are older manual shutters with worn springs. Jewellers usually want a solid shutter and a steel back door, and ask about insurance wording.',
    access:
      'Traffic on Alum Rock Road is heavy most of the day and stopping is tight. Where we can, we come first thing, before the road fills up, and park on a side street.',
    questions: [
      {
        q: 'Can you come before the shop opens?',
        a: [
          'For planned repairs, yes: an early start suits most shops on Alum Rock Road and it suits us, because the road is quieter. For an emergency we come as soon as we can, whatever the time.',
        ],
      },
      {
        q: 'My jeweller’s shutter keeps catching at one side. Is it dangerous?',
        a: [
          'It can be. A shutter that catches on one side is usually running out of its guide, and if it keeps being forced the lath edges tear. Stop using the motor and call us. Leave it where it is, and don’t try to wind it down by hand.',
        ],
      },
    ],
  },
  {
    slug: 'sparkhill',
    name: 'Sparkhill',
    postcodes: 'B11',
    council: 'Birmingham City Council',
    title: 'Shutter & Glass Repairs, Stratford Road B11',
    description: 'Shutters, shop doors, locks and glass repaired for shops on Stratford Road and around Sparkhill, B11. Birmingham repair team; response times and prices stated.',
    answer: `${opening('Sparkhill')} Most calls are to shops along the Stratford Road.`,
    roads: [
      { name: 'Stratford Road (A34)', note: 'clothes, bridal and fabric shops, jewellers, restaurants and grocers, with bus lanes along much of it' },
      { name: 'Warwick Road and the side streets', note: 'smaller shops, takeaways and cash and carry units' },
    ],
    shops:
      'Clothes and bridal shops with big display windows, restaurants that trade late, and grocers with wide openings. Glass and wide shutters are the main calls; restaurants often want work done before lunch.',
    access:
      'We plan around the bus lane hours on the Stratford Road and use side streets for the van. Large panes of glass need two people and somewhere to set them down, so we agree where before we come.',
    questions: [
      {
        q: 'How much is it to fix a shutter on Stratford Road?',
        a: [
          `Most shutter repairs cost ${priceRange('shutterRepair')}, parts included. A wide shutter over a clothes shop can need a heavier spring or motor, and we tell you the price before starting.`,
        ],
      },
      {
        q: 'Someone has cracked my display window. Do I need to close?',
        a: [
          `Not usually. If the glass is cracked but still in the frame, we tape and board it so you can keep trading, then fit new glass once it is made. If it is broken through, treat it as an emergency: we aim to be there ${r().emergency}.`,
        ],
      },
    ],
  },
  {
    slug: 'small-heath',
    name: 'Small Heath',
    postcodes: 'B10',
    council: 'Birmingham City Council',
    title: 'Shutter & Door Repairs in Small Heath, B10',
    description: 'Roller shutter, shop door and glass repairs for shops on Coventry Road and around Small Heath, B10. Birmingham-based repair team.',
    answer: `${opening('Small Heath')} Most of our work here is on the Coventry Road.`,
    roads: [
      { name: 'Coventry Road (A45)', note: 'restaurants, grocers, butchers, travel agents and barbers' },
      { name: 'Green Lane and Charles Road', note: 'smaller parades and corner shops' },
    ],
    shops:
      'Butchers and grocers with steel back doors, restaurants trading late, barbers with glazed fronts. Back doors and yard shutters come up often, because deliveries go through them.',
    access:
      'On a Birmingham City home match day the roads around the ground are slow, so if a repair can wait we book it for another day. On other days we can usually stop behind the Coventry Road parades.',
    questions: [
      {
        q: 'My back door won’t shut properly since a delivery. Can you fix it?',
        a: [
          'Usually, yes. Doors hit by a cage or pallet truck tend to drop on their hinges or bend at the bottom. We realign or replace the hinges and closer, and if the door itself is bent past saving we quote for a new steel one.',
        ],
      },
      {
        q: 'Do you cover Bordesley Green and Tyseley too?',
        a: [`Yes. Anywhere within about ${radius()} miles of Birmingham is in our repair area.`],
      },
    ],
  },
  {
    slug: 'handsworth',
    name: 'Handsworth',
    postcodes: 'B20 and B21',
    council: 'Birmingham City Council',
    title: 'Shutter Repairs on Soho Road, Handsworth',
    description: 'Shutter, lock, door and shop glass repairs for Soho Road and Handsworth, B21. Response times and prices stated before we come out.',
    answer: `${opening('Handsworth')} Most calls here are to shops on and around the Soho Road.`,
    roads: [
      { name: 'Soho Road', note: 'sweet centres, jewellers, suit and sari shops, grocers and restaurants' },
      { name: 'Villa Road and Holyhead Road', note: 'takeaways, barbers and convenience stores' },
    ],
    shops:
      'Jewellers and clothes shops with wide display windows and solid shutters; sweet centres and restaurants with long opening hours. Locks and shutter motors see heavy use here.',
    access:
      'Soho Road is busy from mid-morning, so we like to start early. Around Vaisakhi in April the procession closes roads in Handsworth; book planned work for another week if you can.',
    questions: [
      {
        q: 'The motor on my shutter hums but nothing moves. What is it?',
        a: [
          'Often a failed capacitor or a brake that has stuck, sometimes a motor that has burnt out after being run too often in a short time. Stop pressing the switch: running it more can finish the motor off. Use the manual override if you have one, and call us.',
        ],
      },
      {
        q: 'Can you repair on a Sunday?',
        a: [
          `Emergencies, yes: the emergency line is answered ${profile.emergencyHours.value.toLowerCase()}. Planned repairs are booked in our normal hours.`,
        ],
      },
    ],
  },
  {
    slug: 'solihull',
    name: 'Solihull',
    postcodes: 'B90 to B94',
    council: 'Solihull Metropolitan Borough Council',
    title: 'Shop Door, Glass & Shutter Repairs, Solihull',
    description: 'Shop door, lock, glass and roller shutter repairs in Solihull town centre, Shirley and Olton. Birmingham-based repair team.',
    answer: `${opening('Solihull')} That includes the town centre, Shirley and Olton.`,
    roads: [
      { name: 'Solihull High Street and the shopping centres', note: 'chain and independent shops; centre units have their own contractor rules' },
      { name: 'Stratford Road, Shirley', note: 'a long run of independents, takeaways and salons' },
      { name: 'Warwick Road, Olton', note: 'a local parade of cafés and convenience stores' },
    ],
    shops:
      'Salons, cafés, estate agents and chains in the town centre; takeaways and convenience stores along the Shirley stretch. Door closers, locks and glass are the usual calls; shutter work is mostly on the Shirley side.',
    access:
      'Solihull is its own council, not Birmingham, but that makes no difference to a repair. Shopping-centre units usually need a method statement and an out-of-hours slot, which we arrange with centre management.',
    questions: [
      {
        q: 'Can you work in a Solihull shopping-centre unit before opening?',
        a: [
          'Yes. Send us the centre’s contractor rules or the management contact and we sort the paperwork and a slot with them.',
        ],
      },
      {
        q: 'How much is a new closer for my shop door?',
        a: [
          `Most closer and floor-spring repairs sit within ${priceRange('lockRepair')}, depending on the part. We tell you the price before fitting.`,
        ],
      },
    ],
  },
  {
    slug: 'tamworth',
    name: 'Tamworth',
    postcodes: 'B77 to B79',
    council: 'Tamworth Borough Council',
    title: 'Shopfront & Shutter Repairs in Tamworth',
    description: `Roller shutter, shop door and glass repairs in Tamworth town centre and retail parks, within our ${profile.repairRadiusMiles.value}-mile Birmingham repair area.`,
    answer: `${opening('Tamworth')} Tamworth is towards the edge of our repair area, so tell us where you are when you call and we will give you an honest arrival time.`,
    roads: [
      { name: 'George Street, Church Street and Market Street', note: 'the older town-centre shopping streets, with many independents' },
      { name: 'Ankerside and the town-centre units', note: 'managed centre units with their own rules' },
      { name: 'Ventura Park', note: 'large retail-park units with wide openings and high-level shutters' },
    ],
    shops:
      'Independent shops, cafés and takeaways in the old town centre; bigger units on the retail park with wide, tall shutters and automatic doors.',
    access:
      'We come up the A38 or M42 and usually park in a town-centre car park and walk in. On the retail park there is plenty of room but units often want work done before opening.',
    questions: [
      {
        q: 'Is Tamworth inside your repair area?',
        a: [
          `Yes. Our repairs cover about ${radius()} miles from Birmingham, and Tamworth is inside that. If you are further out, towards Atherstone or Polesworth, check with us first.`,
        ],
      },
      {
        q: 'Can you repair a big retail-park shutter?',
        a: [
          'We repair most shop and unit shutters, including taller electric ones. Very large industrial doors on warehouses are a different trade, and we would tell you if yours is one of those.',
        ],
      },
    ],
  },
  {
    slug: 'lichfield',
    name: 'Lichfield',
    postcodes: 'WS13 and WS14',
    council: 'Lichfield District Council',
    title: 'Shopfront & Shutter Repairs in Lichfield',
    description: 'Shop door, lock, glass and shutter repairs in Lichfield city centre, including advice for shops in the conservation area and the heritage shopfront grant.',
    answer: `${opening('Lichfield')} Lichfield is at the edge of our repair area, and most of the city centre is a conservation area, which changes what can be replaced like for like.`,
    roads: [
      { name: 'Market Street, Bore Street and Tamworth Street', note: 'the historic shopping streets, many listed or in the conservation area' },
      { name: 'Bird Street and Dam Street', note: 'cafés and independents towards the cathedral' },
      { name: 'Three Spires', note: 'the shopping centre, with its own contractor rules' },
    ],
    shops:
      'Independent shops, cafés and restaurants in old buildings, many with timber shopfronts. Repairs to locks, doors and glass are straightforward. Replacing a whole front in the city centre is a planning question first.',
    access:
      'Parts of the centre are pedestrianised, with loading limited to set hours. We use a city-centre car park and carry the tools in, and plan glass deliveries for the loading window.',
    questions: [
      {
        q: 'What is the Lichfield heritage shopfront grant?',
        a: [
          'Lichfield Live reported on 3 August 2026 that Lichfield District Council is offering heritage shopfront grants of up to £30,000 per business for shops in the city-centre conservation area. The council sets the rules, so check eligibility with them directly.',
          'Two things from experience of schemes like this. Don’t start or order anything before the grant is approved in writing, because work already done is rarely funded. And heritage schemes usually favour traditional timber fronts or restoration over new aluminium, so we will tell you straight if the front itself is not a job for us. Doors, locks, glass and internal shutters often still are.',
        ],
      },
      {
        q: 'Can I put an external shutter on a shop in Lichfield city centre?',
        a: [
          'In a conservation area, solid external shutters are often refused. Internal shutters behind the glass, or open grilles, are the usual compromise. We can price either, and supply drawings for a planning application.',
        ],
      },
    ],
  },
];

export const repairAreaSlugs = () => repairAreas().map((a) => a.slug);
