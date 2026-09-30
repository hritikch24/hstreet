/**
 * What the "see it on your shop" preview can show. Every option should be
 * something the firm actually supplies, so the preview never promises a
 * product that can't be made.
 *
 * TODO(owner): confirm the colour lists. Aluminium and steel can be
 * powder-coated to almost any RAL colour; these are the common ones.
 */
export interface Swatch {
  id: string;
  name: string;
  ral?: string;
  hex: string;
}

export const FRAME_COLOURS: Swatch[] = [
  { id: 'black', name: 'Jet black', ral: 'RAL 9005', hex: '#111214' },
  { id: 'anthracite', name: 'Anthracite grey', ral: 'RAL 7016', hex: '#383e42' },
  { id: 'white', name: 'Traffic white', ral: 'RAL 9016', hex: '#eeeee8' },
  { id: 'silver', name: 'White aluminium', ral: 'RAL 9006', hex: '#a5a8a6' },
  { id: 'bronze', name: 'Bronze effect', hex: '#86683f' },
  { id: 'paleblue', name: 'Pastel blue', ral: 'RAL 5024', hex: '#5d9b9b' },
];

export const SHUTTER_COLOURS: Swatch[] = [
  { id: 'silver', name: 'White aluminium', ral: 'RAL 9006', hex: '#a5a8a6' },
  { id: 'anthracite', name: 'Anthracite grey', ral: 'RAL 7016', hex: '#383e42' },
  { id: 'black', name: 'Jet black', ral: 'RAL 9005', hex: '#1a1b1d' },
  { id: 'white', name: 'Pure white', ral: 'RAL 9010', hex: '#f0ede4' },
  { id: 'wine', name: 'Wine red', ral: 'RAL 3005', hex: '#5e2129' },
  { id: 'violet', name: 'Purple violet', ral: 'RAL 4007', hex: '#4a203b' },
];

export type Mode = 'shopfront' | 'shutter';
export type DoorPlace = 'left' | 'centre' | 'right' | 'none';
export type Glass = 'clear' | 'obscured' | 'tinted';
export type Lath = 'solid' | 'perforated' | 'insulated';

export interface Design {
  mode: Mode;
  frame: string;
  bays: number;
  door: DoorPlace;
  doubleDoor: boolean;
  topLight: boolean;
  stallriser: boolean;
  glass: Glass;
  shutter: string;
  lath: Lath;
  box: boolean;
}

export const START_DESIGN: Design = {
  mode: 'shopfront',
  frame: 'anthracite',
  bays: 4,
  door: 'centre',
  doubleDoor: false,
  topLight: true,
  stallriser: true,
  glass: 'clear',
  shutter: 'silver',
  lath: 'solid',
  box: true,
};

export const swatch = (list: Swatch[], id: string) => list.find((s) => s.id === id) ?? list[0];

const colourName = (s: Swatch) => (s.ral ? `${s.name} (${s.ral})` : s.name);

/** One line describing the design, sent with the enquiry. */
export function describe(d: Design): string {
  if (d.mode === 'shutter') {
    const lath = { solid: 'solid steel laths', perforated: 'perforated steel laths', insulated: 'insulated aluminium laths' }[d.lath];
    return `Preview: roller shutter, ${lath}, ${colourName(swatch(SHUTTER_COLOURS, d.shutter))}${d.box ? ', box on show' : ''}.`;
  }
  const door =
    d.door === 'none'
      ? 'no door'
      : `${d.doubleDoor ? 'double' : 'single'} door ${d.door === 'centre' ? 'in the centre' : `on the ${d.door}`}`;
  const glass = { clear: 'clear glass', obscured: 'obscured glass', tinted: 'tinted glass' }[d.glass];
  return `Preview: aluminium shopfront, ${colourName(swatch(FRAME_COLOURS, d.frame))}, ${d.bays} window bay${d.bays === 1 ? '' : 's'}, ${door}${
    d.topLight ? ', top lights' : ''
  }${d.stallriser ? ', stallriser' : ''}, ${glass}.`;
}

/** The worked example: our own photo, with its opening already marked. */
export const EXAMPLE = {
  file: '/work/black-aluminium-shopfront-parade-obscured-glass.jpg',
  /** Top-left, top-right, bottom-right, bottom-left, as fractions of the photo. */
  corners: [
    [0.085, 0.203],
    [0.968, 0.197],
    [0.968, 0.778],
    [0.086, 0.728],
  ] as [number, number][],
};
