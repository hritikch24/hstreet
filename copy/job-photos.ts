/**
 * The firm's own job photographs, received from the owner on 30 Sep 2026 and
 * prepared by tools/prepare-photos.py. No stock images, nothing from any
 * other site.
 *
 * `town`, `completed` and `jobSummary` are unknown for every photo. They stay
 * placeholders until the owner fills them in: never guess a location from
 * signage or scenery. A job only becomes a case study on /our-work (and can
 * justify a /nationwide/[city] page) once all three are confirmed.
 *
 * Client names are visible on some signage. They are not named in alt text,
 * captions, copy or structured data unless the owner confirms the client
 * agreed (`clientMayBeNamed`).
 */
import type { Fact } from '@/business/profile';

export type WorkLine = 'shopfronts' | 'shutters' | 'automatic-doors' | 'security-doors' | 'aluminium-doors';

export interface JobPhoto {
  file: string;
  width: number;
  height: number;
  line: WorkLine;
  /** Groups photos of the same job. */
  job: string;
  /** Alt text: what is actually in the frame. */
  alt: string;
  /** Short caption shown under the photo. */
  caption: string;
  town: Fact<string>;
  completed: Fact<string>;
  jobSummary: Fact<string>;
  clientMayBeNamed: boolean;
}

const pending = {
  town: { value: '', isPlaceholder: true, ask: 'Town or area where this job was fitted' },
  completed: { value: '', isPlaceholder: true, ask: 'Month and year the job was finished' },
  jobSummary: {
    value: '',
    isPlaceholder: true,
    ask: 'What the customer needed, what was fitted and anything awkward about the job',
  },
} satisfies Pick<JobPhoto, 'town' | 'completed' | 'jobSummary'>;

type Row = [file: string, w: number, h: number, line: WorkLine, job: string, alt: string, caption: string];

const rows: Row[] = [
  // Aluminium and glass shopfronts
  ['aluminium-glazing-sliding-doors-new-unit-night', 1600, 1200, 'shopfronts', 'j01',
    'A long run of pale aluminium-framed glazing with a sliding door pair in the middle, under a lit canopy on a new commercial unit, photographed after dark.',
    'New unit, full-width glazing with sliding doors'],
  ['black-aluminium-shopfront-sliding-doors-daylight', 1600, 1200, 'shopfronts', 'j02',
    'A finished black aluminium shopfront on a single-storey unit: three full-height glazed bays with an automatic sliding pair on the left, dark grey cladding either side and a white fascia above.',
    'Black aluminium frontage with an automatic door, finished'],
  ['black-aluminium-shopfront-during-fit', 1600, 1200, 'shopfronts', 'j02',
    'The same black aluminium frontage seen from the other side while the fit was still going on, with packing and offcuts on the forecourt and a van parked inside the empty unit.',
    'Same frontage mid-fit'],
  ['black-aluminium-shopfront-parade-obscured-glass', 2000, 1500, 'shopfronts', 'j03',
    'A black aluminium shopfront on a brick parade: five tall glazed panels with frosted, patterned film and a single glazed door, below a plain white fascia board.',
    'Black frame, obscured glass, parade unit'],
  ['aluminium-glazed-screen-new-unit-night', 1600, 1200, 'shopfronts', 'j04',
    'A wide three-panel aluminium glazed screen set into dark brickwork at night, with the empty lit unit visible behind the glass.',
    'Three-panel screen on a new unit'],
  ['tall-aluminium-glazed-screen-night', 1200, 1600, 'shopfronts', 'j04',
    'A tall two-panel aluminium glazed screen in dark brick, lit from inside at night, with a stepladder and tools on the unit floor behind.',
    'Tall screen on the same building'],
  ['pale-blue-aluminium-door-with-side-screen', 1200, 1600, 'shopfronts', 'j05',
    'A pale blue aluminium frame in red brick holding a solid panelled door beside a fixed glazed side screen with a transom light above.',
    'Pale blue door and side screen'],
  ['black-shopfront-convenience-store-ramp', 1600, 1200, 'shopfronts', 'j06',
    'A black aluminium convenience-store frontage with a central glazed door between two large windows, a solid black stallriser below and a galvanised handrail on the access ramp in front.',
    'Corner-shop frontage with a level-access ramp'],
  ['glass-frontage-stone-building-awning', 1600, 1200, 'shopfronts', 'j07',
    'Full-height glazing and a glass door under a striped awning on a stone-faced building, with the shop being fitted out inside.',
    'Full-height glazing under an awning'],
  ['glass-frontage-under-pull-out-awning', 1600, 1200, 'shopfronts', 'j08',
    'A shop frontage of large clear glass panels and a glazed door beneath a pull-out awning, with the counter visible through the glass.',
    'Clear glazing and door beneath an awning'],
  ['wide-glass-frontage-ornate-high-street', 1600, 1200, 'shopfronts', 'j09',
    'A wide, low-framed glass frontage with a single glass door set in a dark surround on a busy high-street building with ornate upper floors.',
    'Wide glass frontage on a high street'],
  ['black-aluminium-entrance-door-dark-cladding', 1500, 2000, 'shopfronts', 'j10',
    'A narrow black aluminium glazed entrance door set into dark grey cladding above a patterned tiled step, with building work visible through the glass.',
    'Black glazed door in dark cladding'],

  // Automatic and sliding doors
  ['black-automatic-sliding-doors-shop-interior', 1600, 1200, 'automatic-doors', 'j11',
    'Black-framed automatic sliding doors seen from inside a shop being fitted out, with empty shelving and an operator housing across the head of the doors.',
    'Automatic doors inside a new shop'],
  ['automatic-sliding-doors-convenience-store-aisles', 1200, 1600, 'automatic-doors', 'j12',
    'A black automatic sliding door pair in a convenience store, stocked shelves on both sides and the operator box above the doors.',
    'Sliding pair in a trading shop'],
  ['automatic-sliding-doors-under-exit-sign', 900, 1600, 'automatic-doors', 'j13',
    'A narrow pair of automatic sliding doors under a green running-man exit sign, closed, with orange floor tape marking the sweep area.',
    'Sliding doors under an exit sign'],
  ['automatic-sliding-doors-mid-installation', 960, 720, 'automatic-doors', 'j11',
    'Close view of automatic sliding doors during installation, with an "automatic door" notice on the glass and cables and tools on the floor inside.',
    'The same doors during installation'],
  ['black-frontage-sliding-doors-shutter-box', 1600, 1200, 'automatic-doors', 'j14',
    'A black frontage with a two-panel sliding door beneath a roller-shutter box, set in black cladding, with bare shelving inside.',
    'Sliding doors with a shutter box above'],

  // Roller shutters
  ['black-roller-shutter-closed-corner-shop', 1600, 1200, 'shutters', 'j15',
    'A black roller shutter pulled right down over a corner-shop frontage, below a black fascia with gold lettering and a teal awning.',
    'Black shutter over a full frontage'],
  ['cream-roller-shutter-brick-frontage', 1600, 1200, 'shutters', 'j16',
    'A cream roller shutter closed over a shop opening in a red brick frontage, beneath an illuminated sign.',
    'Cream shutter on a brick frontage'],
  ['grey-roller-shutter-full-shop-frontage', 2000, 1500, 'shutters', 'j17',
    'A dark grey roller shutter covering the whole window of a terraced corner shop, next to a white side door to the flat above.',
    'Grey shutter on a terraced corner shop'],
  ['roller-shutter-curtain-against-sky', 2000, 1500, 'shutters', 'j18',
    'Close view of a dark roller-shutter curtain and its box against a clear blue sky.',
    'Shutter curtain close up'],
  ['purple-roller-shutter-closed', 2000, 1500, 'shutters', 'j19',
    'A purple roller shutter, colour-matched to the shop signage, pulled down over the frontage at dusk.',
    'Colour-matched shutter, closed'],
  ['purple-shutter-frontage-open', 2000, 1500, 'shutters', 'j19',
    'The same frontage in daylight with the shutter rolled up into its box, showing the glazing and door beneath.',
    'Same shutter, open'],
  ['silver-roller-shutter-standalone-opening', 1500, 2000, 'shutters', 'j20',
    'A tall silver roller shutter closed over a wide opening on a standalone building, photographed from low down against the sky.',
    'Tall silver shutter'],
  ['black-roller-shutter-narrow-opening', 1500, 2000, 'shutters', 'j21',
    'A black roller shutter with its box and guides on a narrow shop opening between a rendered wall and a lit sign.',
    'Black shutter on a narrow opening'],
  ['grey-roller-shutter-blockwork-side-door', 1500, 2000, 'shutters', 'j22',
    'A grey roller shutter over a side doorway in rough blockwork, next to wall-mounted refrigeration units.',
    'Side-door shutter in blockwork'],
  ['black-roller-shutter-brick-building', 1500, 2000, 'shutters', 'j23',
    'A black roller shutter closed over an opening in a brick building, with timber edging and fresh ground in front.',
    'Black shutter on a brick building'],
  ['maroon-roller-shutter-close', 1600, 1200, 'shutters', 'j24',
    'A maroon roller shutter and matching box over an opening in a white rendered wall.',
    'Maroon shutter, close view'],
  ['maroon-roller-shutter-white-render', 2000, 1500, 'shutters', 'j24',
    'The same maroon shutter from further back, on a white rendered single-storey building with a block-paved forecourt and fence.',
    'Maroon shutter with its forecourt'],
  ['white-roller-shutter-rear-door-brick', 912, 1600, 'shutters', 'j25',
    'A small white roller shutter and box over a rear door in red brick, with temporary fencing to one side.',
    'Rear-door shutter'],
  ['white-roller-shutter-shop-front', 1832, 1444, 'shutters', 'j26',
    'A wide white roller shutter closed over a shop front, with a deep white box and guides to both sides.',
    'White shutter on a shop front'],

  // Steel security doors and fire exits
  ['black-steel-double-fire-exit-doors', 1200, 1600, 'security-doors', 'j27',
    'Black steel double fire-exit doors with two push bars and green "push bar to open" signs, seen from inside.',
    'Double fire exit, push bars'],
  ['white-fire-exit-door-push-bar', 1500, 2000, 'security-doors', 'j28',
    'A white single fire-exit door with a horizontal push bar and sign, fitted into a narrow corridor.',
    'Single fire exit'],
  ['dark-grey-steel-double-doors-cladding', 1200, 1600, 'security-doors', 'j29',
    'Dark grey steel double doors with a lever handle, set into green profiled cladding on a yard building.',
    'Steel double doors in cladding'],
  ['dark-grey-steel-doors-yard', 1500, 2000, 'security-doors', 'j29',
    'The same steel doors from further back across the yard, with a fire-exit sign on the door and painted lines on the ground.',
    'Same doors, yard view'],
  ['white-steel-door-single', 1200, 1600, 'security-doors', 'j30',
    'A white single steel door with a lever handle, newly fitted into a freshly plastered opening.',
    'Single steel door, new opening'],
  ['dark-blue-steel-door-single', 1200, 1600, 'security-doors', 'j31',
    'A dark navy single steel door with a raised panel design, fitted in a narrow back-of-house opening.',
    'Navy steel door'],
  ['white-double-exit-doors-panel-above', 1200, 1600, 'security-doors', 'j32',
    'White double doors with panic bars and a fixed panel above, fitted in a white-clad opening.',
    'White double doors with panic bars'],

  // Aluminium doors
  ['white-aluminium-panel-door-passage', 1200, 1600, 'aluminium-doors', 'j33',
    'A white aluminium panel door in a cream-painted passage, with a lever handle and key lock.',
    'White panel door, back passage'],
  ['white-aluminium-panel-door-rendered-wall', 1500, 2000, 'aluminium-doors', 'j34',
    'A white aluminium panel door with black edge detailing, set into a grey rendered wall.',
    'White panel door, rendered wall'],
  ['white-aluminium-double-panel-doors', 1500, 2000, 'aluminium-doors', 'j35',
    'A pair of white aluminium panel doors with black edge detailing in a brick opening.',
    'White double panel doors'],
  ['black-aluminium-glazed-double-doors-lobby', 1600, 1200, 'aluminium-doors', 'j36',
    'Black aluminium glazed double doors with long bar handles in a lobby still being finished, with the street visible through the glass.',
    'Glazed double doors, lobby'],
  ['black-framed-glazed-double-doors-interior', 1200, 1600, 'aluminium-doors', 'j37',
    'Black-framed glazed double doors with bar handles inside a shop, grey tiled floor in front.',
    'Black glazed double doors'],
  ['bronze-effect-aluminium-door-shopping-centre', 864, 1200, 'aluminium-doors', 'j38',
    'A bronze-effect aluminium door and side panel with a long pull handle and letter plate, fitted in a shopping-centre unit.',
    'Bronze-effect door in a shopping centre'],
  ['glazed-screen-slatted-timber-ceiling', 1500, 2000, 'aluminium-doors', 'j39',
    'A black-framed glazed screen enclosing a shop counter, under a slatted timber ceiling, with printed film on the lower glass.',
    'Glazed counter screen'],
];

export const jobPhotos: JobPhoto[] = rows.map(([file, width, height, line, job, alt, caption]) => ({
  file: `/work/${file}.jpg`,
  width,
  height,
  line,
  job,
  alt,
  caption,
  ...pending,
  clientMayBeNamed: false,
}));

export const photosFor = (line: WorkLine) => jobPhotos.filter((p) => p.line === line);

export const photoByName = (name: string): JobPhoto => {
  const p = jobPhotos.find((x) => x.file === `/work/${name}.jpg`);
  if (!p) throw new Error(`No job photo named ${name}`);
  return p;
};

/** A job is a case study only when town, date and summary are all confirmed. */
export interface ConfirmedJob {
  job: string;
  line: WorkLine;
  town: string;
  completed: string;
  summary: string;
  photos: JobPhoto[];
}

export function confirmedJobs(): ConfirmedJob[] {
  const byJob = new Map<string, JobPhoto[]>();
  for (const p of jobPhotos) byJob.set(p.job, [...(byJob.get(p.job) ?? []), p]);
  const out: ConfirmedJob[] = [];
  for (const [job, photos] of byJob) {
    const lead = photos.find((p) => !p.town.isPlaceholder && !p.completed.isPlaceholder && !p.jobSummary.isPlaceholder);
    if (!lead) continue;
    out.push({
      job,
      line: lead.line,
      town: lead.town.value,
      completed: lead.completed.value,
      summary: lead.jobSummary.value,
      photos,
    });
  }
  return out;
}
