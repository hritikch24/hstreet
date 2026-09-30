/**
 * Draws a shopfront or roller shutter, flat and face-on, onto a canvas. The
 * warp step then fits this drawing into the opening marked on the photo.
 *
 * Proportions assume an opening about 2.8 m tall, so frame members, door
 * widths and lath heights come out at believable sizes whatever the width.
 */
import { FRAME_COLOURS, SHUTTER_COLOURS, swatch, type Design } from '@/copy/front-options';

type Ctx = CanvasRenderingContext2D;

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `rgb(${r},${g},${b})`;
}

/** A frame member with a light top-left edge and a dark bottom-right edge. */
function member(ctx: Ctx, x: number, y: number, w: number, h: number, hex: string) {
  ctx.fillStyle = hex;
  ctx.fillRect(x, y, w, h);
  const edge = Math.max(1, Math.min(w, h) * 0.12);
  ctx.fillStyle = shade(hex, 0.22);
  ctx.fillRect(x, y, w, edge);
  ctx.fillRect(x, y, edge, h);
  ctx.fillStyle = shade(hex, -0.35);
  ctx.fillRect(x, y + h - edge, w, edge);
  ctx.fillRect(x + w - edge, y, edge, h);
}

function glassPane(ctx: Ctx, x: number, y: number, w: number, h: number, kind: Design['glass']) {
  const fill = {
    clear: 'rgba(28, 38, 48, 0.42)',
    tinted: 'rgba(14, 18, 22, 0.78)',
    obscured: 'rgba(226, 231, 234, 0.9)',
  }[kind];
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  // A diagonal sheen, the way glass catches the sky.
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  const a = kind === 'obscured' ? 0.1 : 0.2;
  g.addColorStop(0, `rgba(255,255,255,${a})`);
  g.addColorStop(0.35, 'rgba(255,255,255,0)');
  g.addColorStop(0.62, 'rgba(255,255,255,0)');
  g.addColorStop(0.8, `rgba(255,255,255,${a * 0.6})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  if (kind === 'obscured') {
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = Math.max(1, h * 0.004);
    for (let i = 1; i < 14; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + (h * i) / 14);
      ctx.bezierCurveTo(x + w * 0.3, y + (h * i) / 14 - h * 0.03, x + w * 0.7, y + (h * i) / 14 + h * 0.03, x + w, y + (h * i) / 14);
      ctx.stroke();
    }
  }
}

function drawShopfront(ctx: Ctx, W: number, H: number, d: Design) {
  const frame = swatch(FRAME_COLOURS, d.frame).hex;
  const t = Math.max(3, H * 0.022); // frame member
  const outer = t * 1.5;
  const top = d.topLight ? H * 0.16 : 0;
  const riser = d.stallriser ? H * 0.15 : 0;
  const doorW = d.door === 'none' ? 0 : Math.min(W * 0.45, H * (d.doubleDoor ? 0.62 : 0.35));

  // Horizontal layout: window bays, with the door taking its own slot.
  type Slot = { kind: 'bay' | 'door'; w: number };
  const inner = W - outer * 2;
  const bayW = (inner - doorW) / Math.max(1, d.bays);
  const bays: Slot[] = Array.from({ length: d.bays }, () => ({ kind: 'bay' as const, w: bayW }));
  const door: Slot = { kind: 'door', w: doorW };
  let slots: Slot[] = bays;
  if (d.door === 'left') slots = [door, ...bays];
  if (d.door === 'right') slots = [...bays, door];
  if (d.door === 'centre') slots = [...bays.slice(0, Math.floor(d.bays / 2)), door, ...bays.slice(Math.floor(d.bays / 2))];

  const bodyTop = outer + top;
  const bodyBottom = H - outer;

  // Top lights run the full width above everything.
  if (top) glassPane(ctx, outer, outer, inner, top - t / 2, d.glass === 'obscured' ? 'clear' : d.glass);

  let x = outer;
  for (const s of slots) {
    if (s.kind === 'bay') {
      glassPane(ctx, x, bodyTop, s.w, bodyBottom - bodyTop - riser, d.glass);
      if (riser) {
        member(ctx, x, bodyBottom - riser, s.w, riser, shade(frame, -0.08));
        ctx.fillStyle = shade(frame, -0.3);
        ctx.fillRect(x + s.w * 0.06, bodyBottom - riser * 0.55, s.w * 0.88, Math.max(1, t * 0.2));
      }
    } else {
      drawDoor(ctx, x, bodyTop, s.w, bodyBottom - bodyTop, frame, d, t);
    }
    x += s.w;
  }

  // Frame members on top of the glass.
  member(ctx, 0, 0, W, outer, frame);
  member(ctx, 0, H - outer, W, outer, frame);
  member(ctx, 0, 0, outer, H, frame);
  member(ctx, W - outer, 0, outer, H, frame);
  if (top) member(ctx, outer, outer + top - t, inner, t, frame);
  x = outer;
  for (let i = 0; i < slots.length - 1; i++) {
    x += slots[i].w;
    member(ctx, x - t / 2, bodyTop, t, bodyBottom - bodyTop, frame);
  }
  x = outer;
  for (const s of slots) {
    if (s.kind === 'bay' && riser) member(ctx, x, bodyBottom - riser - t / 2, s.w, t, frame);
    x += s.w;
  }
}

function drawDoor(ctx: Ctx, x: number, y: number, w: number, h: number, frame: string, d: Design, t: number) {
  const leaves = d.doubleDoor ? 2 : 1;
  const lw = w / leaves;
  const stile = t * 1.6;
  for (let i = 0; i < leaves; i++) {
    const lx = x + i * lw;
    glassPane(ctx, lx + stile, y + stile, lw - stile * 2, h - stile * 2.6, d.glass === 'obscured' ? 'clear' : d.glass);
    member(ctx, lx, y, lw, stile, frame);
    member(ctx, lx, y + h - stile * 1.6, lw, stile * 1.6, frame);
    member(ctx, lx, y, stile, h, frame);
    member(ctx, lx + lw - stile, y, stile, h, frame);
    // Long pull handle on the meeting side, in brushed steel.
    const handleX = leaves === 2 ? (i === 0 ? lx + lw - stile * 2.4 : lx + stile * 1.4) : lx + lw - stile * 2.4;
    const hw = Math.max(2, t * 0.55);
    const g = ctx.createLinearGradient(handleX, 0, handleX + hw, 0);
    g.addColorStop(0, '#e8eaeb');
    g.addColorStop(0.5, '#b9bdc0');
    g.addColorStop(1, '#8d9296');
    ctx.fillStyle = g;
    ctx.fillRect(handleX, y + h * 0.3, hw, h * 0.38);
  }
}

function drawShutter(ctx: Ctx, W: number, H: number, d: Design) {
  const colour = swatch(SHUTTER_COLOURS, d.shutter).hex;
  const box = d.box ? H * 0.11 : 0;
  const guide = Math.max(3, W * 0.022);
  const rail = H * 0.035;
  const count = d.lath === 'insulated' ? 50 : 36;
  const curtainTop = box;
  const curtainBottom = H - rail;
  const lathH = (curtainBottom - curtainTop) / count;

  for (let i = 0; i < count; i++) {
    const y = curtainTop + i * lathH;
    const g = ctx.createLinearGradient(0, y, 0, y + lathH);
    const soft = d.lath === 'insulated';
    g.addColorStop(0, shade(colour, soft ? 0.12 : 0.28));
    g.addColorStop(0.45, colour);
    g.addColorStop(0.85, shade(colour, soft ? -0.12 : -0.3));
    g.addColorStop(1, shade(colour, -0.5));
    ctx.fillStyle = g;
    ctx.fillRect(guide, y, W - guide * 2, lathH + 0.5);
    if (d.lath === 'perforated') {
      ctx.fillStyle = 'rgba(8, 10, 12, 0.85)';
      const hole = Math.max(1, lathH * 0.16);
      const step = hole * 3.2;
      for (let hx = guide + step; hx < W - guide - hole; hx += step) {
        ctx.fillRect(hx, y + lathH * 0.42, hole * 1.4, hole);
      }
    }
  }

  // Bottom rail with its lock slots.
  const r = shade(colour, -0.25);
  member(ctx, guide, curtainBottom, W - guide * 2, rail, r);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  for (const fx of [0.12, 0.88]) ctx.fillRect(W * fx, curtainBottom + rail * 0.35, W * 0.025, rail * 0.3);

  // Side guides.
  member(ctx, 0, box, guide, H - box, shade(colour, -0.15));
  member(ctx, W - guide, box, guide, H - box, shade(colour, -0.15));

  if (box) {
    const g = ctx.createLinearGradient(0, 0, 0, box);
    g.addColorStop(0, shade(colour, 0.18));
    g.addColorStop(0.8, colour);
    g.addColorStop(1, shade(colour, -0.35));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, box);
    // The box throws a soft shadow onto the top laths.
    const s = ctx.createLinearGradient(0, box, 0, box + H * 0.035);
    s.addColorStop(0, 'rgba(0,0,0,0.38)');
    s.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = s;
    ctx.fillRect(guide, box, W - guide * 2, H * 0.035);
  }
}

/** Draws the design at the given size. The canvas is cleared first. */
export function drawFront(canvas: HTMLCanvasElement, width: number, height: number, d: Design) {
  canvas.width = Math.max(2, Math.round(width));
  canvas.height = Math.max(2, Math.round(height));
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (d.mode === 'shutter') drawShutter(ctx, canvas.width, canvas.height, d);
  else drawShopfront(ctx, canvas.width, canvas.height, d);
}
