'use client';

/**
 * "See it on your shop": the customer's own photo, a new shopfront or
 * shutter fitted into the opening they mark, and a button to send the result
 * with an enquiry.
 *
 * Everything happens in the browser. The photo is never uploaded unless the
 * customer chooses to send it.
 */
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  describe,
  EXAMPLE,
  FRAME_COLOURS,
  SHUTTER_COLOURS,
  START_DESIGN,
  type Design,
  type Swatch,
} from '@/copy/front-options';
import { drawFront } from '@/ui/visualiser/draw-front';
import { aspectOf, isSensible, lightFor, Warp, type Pt, type Quad } from '@/ui/visualiser/warp';

export const PREVIEW_KEY = 'hss.preview';
const MAX_EDGE = 1600;
const noSubscribe = () => () => {};

function toCanvas(source: CanvasImageSource, w: number, h: number): HTMLCanvasElement {
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  c.getContext('2d')!.drawImage(source, 0, 0, c.width, c.height);
  return c;
}

const blobOf = (c: HTMLCanvasElement, q = 0.85) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('export failed'))), 'image/jpeg', q));

const dataUrlOf = (b: Blob) =>
  new Promise<string>((res) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.readAsDataURL(b);
  });

const LABELS = ['Top left', 'Top right', 'Bottom right', 'Bottom left'];

export function Visualiser({ phoneDisplay }: { phoneDisplay: string }) {
  const router = useRouter();
  const supported = useSyncExternalStore(noSubscribe, Warp.supported, () => true);
  const [photo, setPhoto] = useState<HTMLCanvasElement | null>(null);
  const [quad, setQuad] = useState<Quad | null>(null);
  const [design, setDesign] = useState<Design>(START_DESIGN);
  const [editing, setEditing] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [dragging, setDragging] = useState<{ i: number; at: Pt } | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const stage = useRef<HTMLCanvasElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const loupe = useRef<HTMLCanvasElement>(null);
  const warp = useRef<Warp | null>(null);
  const shownPhoto = useRef<HTMLCanvasElement | null>(null);
  const front = useRef<HTMLCanvasElement | null>(null);
  const frontKey = useRef('');

  const sensible = quad ? isSensible(quad) : false;

  // Draw whenever the photo, corners, design or compare state change.
  useEffect(() => {
    if (!photo || !quad || !stage.current) return;
    try {
      // The canvas is recreated when the customer starts again with another
      // photo, so the renderer must follow it.
      if (warp.current && warp.current.canvas !== stage.current) {
        warp.current.dispose();
        warp.current = null;
      }
      if (!warp.current) {
        warp.current = new Warp(stage.current);
        shownPhoto.current = null;
        frontKey.current = '';
      }
      if (shownPhoto.current !== photo) {
        warp.current.setPhoto(photo);
        shownPhoto.current = photo;
      }
      const aspect = aspectOf(quad);
      const key = `${JSON.stringify(design)}|${aspect.toFixed(2)}`;
      if (key !== frontKey.current) {
        front.current ??= document.createElement('canvas');
        const long = 1400;
        const w = aspect >= 1 ? long : long * aspect;
        const h = aspect >= 1 ? long / aspect : long;
        drawFront(front.current, w, h, design);
        warp.current.setFront(front.current);
        frontKey.current = key;
      }
      warp.current.draw(quad, { show: !comparing && isSensible(quad), light: lightFor(photo, quad) });
    } catch (err) {
      console.error('[visualiser]', err);
    }
  }, [photo, quad, design, comparing]);

  // A magnified view under the finger while a corner is being dragged.
  useEffect(() => {
    const c = loupe.current;
    if (!c || !photo || !dragging) return;
    const ctx = c.getContext('2d')!;
    const zoom = 3;
    const size = c.width / zoom;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(photo, dragging.at[0] - size / 2, dragging.at[1] - size / 2, size, size, 0, 0, c.width, c.height);
    ctx.strokeStyle = '#c1272d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(c.width / 2, 0);
    ctx.lineTo(c.width / 2, c.height);
    ctx.moveTo(0, c.height / 2);
    ctx.lineTo(c.width, c.height / 2);
    ctx.stroke();
  }, [dragging, photo]);

  async function openFile(file: File) {
    setStatus('');
    try {
      const bitmap = await createImageBitmap(file);
      const c = toCanvas(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
      setPhoto(c);
      setQuad([
        [c.width * 0.15, c.height * 0.25],
        [c.width * 0.85, c.height * 0.25],
        [c.width * 0.85, c.height * 0.82],
        [c.width * 0.15, c.height * 0.82],
      ]);
      setEditing(true);
    } catch {
      setStatus('That photo could not be opened. Try a JPEG or PNG taken on your phone.');
    }
  }

  function openExample() {
    setStatus('');
    const img = new Image();
    img.onload = () => {
      const c = toCanvas(img, img.naturalWidth, img.naturalHeight);
      setPhoto(c);
      setQuad(EXAMPLE.corners.map(([x, y]) => [x * c.width, y * c.height]) as Quad);
      setEditing(false);
    };
    img.src = EXAMPLE.file;
  }

  function toPhotoPoint(clientX: number, clientY: number): Pt | null {
    const el = svg.current;
    const m = el?.getScreenCTM();
    if (!el || !m || !photo) return null;
    const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
    return [Math.max(0, Math.min(photo.width, p.x)), Math.max(0, Math.min(photo.height, p.y))];
  }

  function moveCorner(i: number, to: Pt) {
    setQuad((q) => (q ? (q.map((p, j) => (j === i ? to : p)) as Quad) : q));
  }

  const set = <K extends keyof Design>(k: K, v: Design[K]) => setDesign((d) => ({ ...d, [k]: v }));

  async function exportPreview(): Promise<{ preview: Blob; original: Blob }> {
    warp.current!.draw(quad!, { show: true, light: lightFor(photo!, quad!) });
    return { preview: await blobOf(stage.current!), original: await blobOf(photo!, 0.82) };
  }

  async function sendForPrice() {
    setBusy(true);
    try {
      const { preview, original } = await exportPreview();
      const payload = JSON.stringify({
        summary: describe(design),
        image: await dataUrlOf(preview),
        original: await dataUrlOf(original),
      });
      sessionStorage.setItem(PREVIEW_KEY, payload);
      const service = design.mode === 'shutter' ? 'roller-shutter' : 'aluminium-shopfront';
      router.push(`/get-a-quote?job=install&service=${service}&preview=1`);
    } catch {
      setStatus(`Your preview couldn’t be passed to the quote form. Save the image and WhatsApp it to us, or call ${phoneDisplay}.`);
      setBusy(false);
    }
  }

  async function save() {
    const { preview } = await exportPreview();
    const url = URL.createObjectURL(preview);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-new-shopfront.jpg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function share() {
    const { preview } = await exportPreview();
    const file = new File([preview], 'my-new-shopfront.jpg', { type: 'image/jpeg' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: describe(design) }).catch(() => {});
    } else {
      await save();
    }
  }

  if (!supported) {
    return (
      <div className="plate p-5">
        <p className="font-bold text-navy">This browser can’t draw the preview.</p>
        <p className="mt-1">Send us a photo of your shop on WhatsApp instead and we’ll talk you through the options.</p>
      </div>
    );
  }

  if (!photo || !quad) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="lift flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-navy bg-plate p-8 text-center">
          <span className="sign text-[1.35rem]">Use a photo of your shop</span>
          <span className="text-[0.95rem] text-slate">Stand across the road and take it straight on. It stays on your phone.</span>
          <span className="btn btn-signal mt-2">Choose or take a photo</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void openFile(f);
            }}
          />
        </label>
        <button
          type="button"
          onClick={openExample}
          className="lift flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-navy bg-navy p-8 text-center text-cream"
        >
          <span className="sign text-[1.35rem] !text-cream">Try it on our example</span>
          <span className="text-[0.95rem] text-cream/85">A shopfront we fitted, with the opening already marked.</span>
          <span className="btn mt-2 border-2 border-cream/60">Show me</span>
        </button>
        {status && (
          <p className="font-bold text-signal sm:col-span-2" role="alert">
            {status}
          </p>
        )}
      </div>
    );
  }

  const r = photo.width * 0.02;
  const summary = describe(design);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
      <div className="min-w-0">
        <div
          className="relative overflow-hidden rounded-[10px] border-2 border-navy bg-navy-deep"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <canvas
            ref={stage}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={comparing ? 'Your shop as it is now' : summary}
          />
          {editing && (
            <svg
              ref={svg}
              viewBox={`0 0 ${photo.width} ${photo.height}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <polygon
                points={quad.map((p) => p.join(',')).join(' ')}
                fill="rgba(193,39,45,0.12)"
                stroke="#c1272d"
                strokeWidth={2}
                strokeDasharray="8 6"
                vectorEffect="non-scaling-stroke"
              />
              {quad.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p[0]}
                    cy={p[1]}
                    r={r * 2.4}
                    fill="transparent"
                    style={{ touchAction: 'none', cursor: 'grab' }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${LABELS[i]} corner of the opening. Drag, or use the arrow keys.`}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDragging({ i, at: p });
                    }}
                    onPointerMove={(e) => {
                      if (!dragging || dragging.i !== i) return;
                      const to = toPhotoPoint(e.clientX, e.clientY);
                      if (!to) return;
                      moveCorner(i, to);
                      setDragging({ i, at: to });
                    }}
                    onPointerUp={() => setDragging(null)}
                    onPointerCancel={() => setDragging(null)}
                    onKeyDown={(e) => {
                      const step = (photo.width / 400) * (e.shiftKey ? 6 : 1);
                      const d: Record<string, Pt> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
                      const m = d[e.key];
                      if (!m) return;
                      e.preventDefault();
                      moveCorner(i, [Math.max(0, Math.min(photo.width, p[0] + m[0])), Math.max(0, Math.min(photo.height, p[1] + m[1]))]);
                    }}
                  />
                  <circle cx={p[0]} cy={p[1]} r={r} fill="#fffcf4" stroke="#c1272d" strokeWidth={3} vectorEffect="non-scaling-stroke" pointerEvents="none" />
                  <circle cx={p[0]} cy={p[1]} r={r * 0.28} fill="#c1272d" pointerEvents="none" />
                </g>
              ))}
            </svg>
          )}
          {dragging && (
            <canvas
              ref={loupe}
              width={140}
              height={140}
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 h-[120px] w-[120px] rounded-full border-4 border-plate shadow-lg"
            />
          )}
        </div>

        {editing ? (
          <div className="mt-3 rounded-[8px] bg-cream-deep p-3 text-[0.98rem]">
            <p>
              <strong>Drag the four red corners</strong> onto the corners of your shop’s opening: where the new front
              would go, from the underside of the sign to the pavement.
            </p>
            {!sensible && (
              <p className="mt-1 font-bold text-signal" role="alert">
                The corners have crossed over. Put them back in order: top left, top right, bottom right, bottom left.
              </p>
            )}
            <button type="button" className="btn btn-signal mt-3" disabled={!sensible} onClick={() => setEditing(false)}>
              Corners look right
            </button>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-plain"
              onPointerDown={() => setComparing(true)}
              onPointerUp={() => setComparing(false)}
              onPointerLeave={() => setComparing(false)}
              onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setComparing(true)}
              onKeyUp={() => setComparing(false)}
            >
              Hold to see before
            </button>
            <button type="button" className="btn btn-plain" onClick={() => setEditing(true)}>
              Move the corners
            </button>
            <button
              type="button"
              className="btn btn-plain"
              onClick={() => {
                setPhoto(null);
                setQuad(null);
              }}
            >
              Use another photo
            </button>
          </div>
        )}
        <p className="mt-3 text-sm text-slate">
          A preview to help you choose, not a drawing. Sizes, bays and the door position are confirmed at the survey.
        </p>
      </div>

      <div className="grid gap-5">
        <Designer design={design} set={set} />
        <div className="plate grid gap-2 p-4">
          <p className="text-[0.95rem]">{summary}</p>
          <button type="button" className="btn btn-signal w-full" disabled={busy || editing || !sensible} onClick={sendForPrice}>
            {busy ? 'Preparing…' : 'Send me a price for this'}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="btn btn-plain" disabled={editing || !sensible} onClick={share}>
              Share
            </button>
            <button type="button" className="btn btn-plain" disabled={editing || !sensible} onClick={save}>
              Save image
            </button>
          </div>
          {status && (
            <p className="text-[0.95rem] font-bold text-signal" role="alert">
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Choice<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <label
            key={o.value}
            className={`cursor-pointer rounded-full border-2 px-3 py-1.5 text-[0.95rem] font-bold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-signal ${
              value === o.value ? 'border-navy bg-navy text-cream' : 'border-navy/35 bg-white text-navy'
            }`}
          >
            <input type="radio" className="sr-only" checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Swatches({ legend, list, value, onChange }: { legend: string; list: Swatch[]; value: string; onChange: (id: string) => void }) {
  const current = list.find((s) => s.id === value) ?? list[0];
  return (
    <fieldset>
      <legend className="label">
        {legend}: <span className="font-normal text-ink">{current.name}{current.ral ? `, ${current.ral}` : ''}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {list.map((s) => (
          <label
            key={s.id}
            title={s.ral ? `${s.name} (${s.ral})` : s.name}
            className={`grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-signal ${
              value === s.id ? 'border-signal' : 'border-navy/30'
            }`}
          >
            <input type="radio" className="sr-only" checked={value === s.id} onChange={() => onChange(s.id)} aria-label={s.name} />
            <span className="h-8 w-8 rounded-full border border-black/20" style={{ background: s.hex }} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[var(--color-signal)]" />
      {label}
    </label>
  );
}

function Designer({ design, set }: { design: Design; set: <K extends keyof Design>(k: K, v: Design[K]) => void }) {
  return (
    <div className="plate grid gap-4 p-4">
      <Choice
        legend="What do you want to see?"
        value={design.mode}
        options={[
          { value: 'shopfront', label: 'New shopfront' },
          { value: 'shutter', label: 'Roller shutter' },
        ]}
        onChange={(v) => set('mode', v)}
      />
      {design.mode === 'shopfront' ? (
        <>
          <Swatches legend="Frame colour" list={FRAME_COLOURS} value={design.frame} onChange={(v) => set('frame', v)} />
          <fieldset>
            <legend className="label">Window bays: {design.bays}</legend>
            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-plain h-11 min-h-0 w-11 p-0" onClick={() => set('bays', Math.max(1, design.bays - 1))} aria-label="Fewer bays">
                −
              </button>
              <input
                type="range"
                min={1}
                max={7}
                value={design.bays}
                onChange={(e) => set('bays', Number(e.target.value))}
                className="flex-1 accent-[var(--color-signal)]"
                aria-label="Number of window bays"
              />
              <button type="button" className="btn btn-plain h-11 min-h-0 w-11 p-0" onClick={() => set('bays', Math.min(7, design.bays + 1))} aria-label="More bays">
                +
              </button>
            </div>
          </fieldset>
          <Choice
            legend="Door"
            value={design.door}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'centre', label: 'Centre' },
              { value: 'right', label: 'Right' },
              { value: 'none', label: 'None' },
            ]}
            onChange={(v) => set('door', v)}
          />
          <Choice
            legend="Glass"
            value={design.glass}
            options={[
              { value: 'clear', label: 'Clear' },
              { value: 'obscured', label: 'Obscured' },
              { value: 'tinted', label: 'Tinted' },
            ]}
            onChange={(v) => set('glass', v)}
          />
          <div className="grid gap-2">
            {design.door !== 'none' && <Toggle label="Double door" checked={design.doubleDoor} onChange={(v) => set('doubleDoor', v)} />}
            <Toggle label="Top lights (glass above the door)" checked={design.topLight} onChange={(v) => set('topLight', v)} />
            <Toggle label="Stallriser (solid panel under the glass)" checked={design.stallriser} onChange={(v) => set('stallriser', v)} />
          </div>
        </>
      ) : (
        <>
          <Swatches legend="Shutter colour" list={SHUTTER_COLOURS} value={design.shutter} onChange={(v) => set('shutter', v)} />
          <Choice
            legend="Laths"
            value={design.lath}
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'perforated', label: 'Perforated' },
              { value: 'insulated', label: 'Insulated' },
            ]}
            onChange={(v) => set('lath', v)}
          />
          <Toggle label="Show the shutter box" checked={design.box} onChange={(v) => set('box', v)} />
        </>
      )}
    </div>
  );
}
