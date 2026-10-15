'use client';

/**
 * The quote and repair form.
 *
 * Every enquiry records whether it is an install or a repair and where the
 * shop is. For a repair, the place is checked against the repair radius as
 * soon as it is typed; outside it, the form says so and offers an install
 * quote or a callback instead. The server repeats the check.
 *
 * Photos are optional. They are shrunk in the browser to about 1600px before
 * upload, so a phone photo fits comfortably within the request limit.
 */
import Link from 'next/link';
import { conversion } from '@/ui/Beacon';
import { useRef, useState, useSyncExternalStore } from 'react';
import {
  checkEnquiry,
  DOOR_KINDS,
  isGarageService,
  MAX_PHOTOS,
  SERVICE_CHOICES,
  TIMINGS,
  type JobType,
  type Problems,
} from '@/engine/enquiry-shape';

interface Props {
  radiusMiles: number;
  phoneDisplay: string;
  /** Offer the garage door choices. The page passes `garageLive()`. */
  garage?: boolean;
}

type Reach = { status: 'inside' | 'outside' | 'unknown'; miles?: number; town?: string };

async function shrink(file: Blob): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.8, 0.65, 0.5]) {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality));
      if (blob && blob.size < 1_300_000) return blob;
    }
  } catch {
    // Fall through and send the original; the server enforces the limit.
  }
  return file;
}

const noSubscribe = () => () => {};

/** Set by the "see it on your shop" preview when the customer asks for a price. */
const PREVIEW_KEY = 'hss.preview';
interface Preview {
  summary: string;
  image: string;
  original: string;
}
function readPreview(): string | null {
  try {
    return sessionStorage.getItem(PREVIEW_KEY);
  } catch {
    return null;
  }
}
const blobFromDataUrl = (url: string) => fetch(url).then((r) => r.blob());

function prefill(search: string): { job: JobType; service: string } {
  const q = new URLSearchParams(search);
  const job: JobType = q.get('job') === 'repair' ? 'repair' : 'install';
  const svc = q.get('service') ?? '';
  return { job, service: SERVICE_CHOICES[job].some((c) => c.value === svc) ? svc : '' };
}

function visitId(): string {
  try {
    return sessionStorage.getItem('hss.visit') ?? '';
  } catch {
    return '';
  }
}

export function QuoteForm({ radiusMiles, phoneDisplay, garage = false }: Props) {
  // Arriving from a service page's "Get a quote" button (?job=…&service=…):
  // open with that job and service chosen. Empty on the server, so the form
  // is still in the static HTML; the customer's own choice always wins.
  const query = useSyncExternalStore(noSubscribe, () => window.location.search, () => '');
  const fromLink = prefill(query);
  const [chosenJob, setChosenJob] = useState<JobType | null>(null);
  const [chosenService, setChosenService] = useState<string | null>(null);
  const jobType = chosenJob ?? fromLink.job;
  const service = chosenService ?? (jobType === fromLink.job ? fromLink.service : '');
  const setService = setChosenService;
  const [wants, setWants] = useState<'quote' | 'callback'>('quote');
  const [reach, setReach] = useState<Reach | null>(null);
  const [problems, setProblems] = useState<Problems>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [message, setMessage] = useState('');
  const [ref, setRef] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const previewRaw = useSyncExternalStore(noSubscribe, readPreview, () => null);
  const [dropPreview, setDropPreview] = useState(false);
  let preview: Preview | null = null;
  if (!dropPreview && previewRaw && query.includes('preview=1')) {
    try {
      preview = JSON.parse(previewRaw) as Preview;
    } catch {
      preview = null;
    }
  }
  const placeRef = useRef<HTMLInputElement>(null);


  const checkPlace = async (value: string) => {
    if (jobType !== 'repair' || value.trim().length < 2) return setReach(null);
    try {
      const res = await fetch(`/api/enquiries/reach?where=${encodeURIComponent(value.trim())}`);
      setReach((await res.json()) as Reach);
    } catch {
      setReach(null);
    }
  };

  const switchTo = (next: JobType) => {
    setChosenJob(next);
    setChosenService('');
    setWants('quote');
    setProblems({});
    if (next === 'install') setReach(null);
    else if (placeRef.current?.value) void checkPlace(placeRef.current.value);
  };

  const outside = jobType === 'repair' && reach?.status === 'outside' && wants !== 'callback';

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    data.set('jobType', jobType);
    data.set('wants', wants);
    data.set('visit', visitId());
    data.delete('photos');

    const local = checkEnquiry(Object.fromEntries([...data.entries()].filter(([, v]) => typeof v === 'string')));
    if (!local.ok) {
      setProblems(local.problems);
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    if (outside) return;

    setProblems({});
    setState('sending');
    let room = MAX_PHOTOS;
    if (preview) {
      data.set('message', [preview.summary, String(data.get('message') ?? '')].filter(Boolean).join('\n\n'));
      for (const [name, url] of [['preview.jpg', preview.image], ['my-shop.jpg', preview.original]] as const) {
        if (room-- > 0) data.append('photos', await shrink(await blobFromDataUrl(url)), name);
      }
    }
    for (const p of photos.slice(0, Math.max(0, room))) data.append('photos', await shrink(p), p.name.replace(/\.\w+$/, '.jpg'));

    try {
      const res = await fetch('/api/enquiries', { method: 'POST', body: data });
      const body = (await res.json()) as { ok: boolean; ref?: string; problems?: Problems; outside?: boolean; message?: string; miles?: number };
      if (body.ok) {
        conversion('enquiry');
        try {
          sessionStorage.removeItem(PREVIEW_KEY);
        } catch {
          // Nothing to tidy up if storage is blocked.
        }
        setRef(body.ref ?? '');
        setState('done');
        return;
      }
      if (body.outside) {
        setReach({ status: 'outside', miles: body.miles });
        setState('idle');
        return;
      }
      if (body.problems) setProblems(body.problems);
      setMessage(body.message ?? 'Please check the highlighted answers.');
      setState('failed');
    } catch {
      setMessage(`That didn’t send. Please try again, or call ${phoneDisplay}.`);
      setState('failed');
    }
  }

  if (state === 'done') {
    return (
      <div className="plate p-6" role="status">
        <p className="sign text-[1.5rem]">Thank you, that’s with us</p>
        <p className="mt-2">
          Your reference is <strong>{ref}</strong>. We’ll get back to you by the method you chose. If it’s urgent,
          call {phoneDisplay}.
        </p>
      </div>
    );
  }

  const err = (k: keyof Problems) =>
    problems[k] ? (
      <p id={`${k}-problem`} className="mt-1 text-[0.95rem] font-bold text-signal">
        {problems[k]}
      </p>
    ) : null;
  const aria = (k: keyof Problems) => ({
    'aria-invalid': problems[k] ? true : undefined,
    'aria-describedby': problems[k] ? `${k}-problem` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <fieldset>
        <legend className="label">Is this a new installation or a repair?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ['install', 'New installation', 'Anywhere in the UK'],
              ['repair', 'Repair', `Birmingham and up to ${radiusMiles} miles`],
            ] as const
          ).map(([value, label, hint]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-start gap-3 rounded-[8px] border-2 p-3 ${
                jobType === value ? 'border-navy bg-plate' : 'border-rule bg-white'
              }`}
            >
              <input
                type="radio"
                name="jobTypeChoice"
                value={value}
                checked={jobType === value}
                onChange={() => switchTo(value)}
                className="mt-1 h-5 w-5 accent-[var(--color-signal)]"
              />
              <span>
                <span className="block font-bold text-navy">{label}</span>
                <span className="block text-[0.95rem] text-slate">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="service" className="label">
          What do you need?
        </label>
        <select
          id="service"
          name="service"
          className="field"
          value={service}
          onChange={(e) => setService(e.target.value)}
          {...aria('service')}
        >
          <option value="" disabled>
            Choose one
          </option>
          {SERVICE_CHOICES[jobType].filter((c) => garage || !c.garage || c.value === service).map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {err('service')}
      </div>

      {isGarageService(service) && (
        <div>
          <label htmlFor="doorType" className="label">
            Which kind of garage door? <span className="font-normal text-slate">(optional)</span>
          </label>
          <select id="doorType" name="doorType" className="field" defaultValue="">
            <option value="">Choose one</option>
            {DOOR_KINDS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="place" className="label">
          Town or postcode of the shop
        </label>
        <input
          ref={placeRef}
          id="place"
          name="place"
          className="field"
          autoComplete="postal-code"
          placeholder="e.g. B8 1AA or Erdington"
          onBlur={(e) => checkPlace(e.target.value)}
          {...aria('place')}
        />
        {err('place')}
        {jobType === 'repair' && reach?.status === 'inside' && (
          <p className="mt-1 text-[0.95rem] text-wa">
            {reach.town ? `${reach.town} is` : 'That is'} inside our repair area.
          </p>
        )}
        {jobType === 'repair' && reach?.status === 'outside' && (
          <div className="mt-3 rounded-[8px] border-2 border-signal bg-white p-4" role="alert">
            <p className="font-bold text-navy">
              Sorry, {reach.town ?? 'that'} is outside our repair area
              {reach.miles ? ` (about ${Math.round(reach.miles)} miles away)` : ''}.
            </p>
            <p className="mt-1">
              We only do repairs within {radiusMiles} miles of Birmingham, because we couldn’t get to you quickly
              enough. A local repairer will be faster. We can still help in two ways:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-plain" onClick={() => switchTo('install')}>
                Get a quote for a new installation
              </button>
              <button
                type="button"
                className={`btn ${wants === 'callback' ? 'btn-signal' : 'btn-plain'}`}
                onClick={() => setWants('callback')}
              >
                {wants === 'callback' ? 'Callback chosen' : 'Ask for a callback'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">
            Your name
          </label>
          <input id="name" name="name" className="field" autoComplete="name" {...aria('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone number
          </label>
          <input id="phone" name="phone" type="tel" className="field" autoComplete="tel" {...aria('phone')} />
          {err('phone')}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email <span className="font-normal text-slate">(optional)</span>
        </label>
        <input id="email" name="email" type="email" className="field" autoComplete="email" {...aria('email')} />
        {err('email')}
      </div>

      <fieldset>
        <legend className="label">How should we get back to you?</legend>
        <div className="flex flex-wrap gap-4">
          {(
            [
              ['phone', 'Phone call'],
              ['whatsapp', 'WhatsApp'],
              ['email', 'Email'],
            ] as const
          ).map(([value, label], i) => (
            <label key={value} className="flex items-center gap-2">
              <input type="radio" name="contactBy" value={value} defaultChecked={i === 0} className="h-5 w-5 accent-[var(--color-signal)]" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="timing" className="label">
          How soon? <span className="font-normal text-slate">(optional)</span>
        </label>
        <select id="timing" name="timing" className="field" defaultValue="">
          <option value="">Choose one</option>
          {TIMINGS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="label">
          Anything else? <span className="font-normal text-slate">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="field"
          placeholder={jobType === 'repair' ? 'What has happened, and is the shop secure?' : 'Rough size of the opening, colour, when you need it'}
          {...aria('message')}
        />
        {err('message')}
      </div>

      <div>
        {preview && (
          <div className="mb-4 flex gap-3 rounded-[8px] border-2 border-navy bg-white p-3">
            {/* A local preview image held in the browser; next/image can't optimise it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.image} alt="Your preview of the new front" className="h-20 w-28 flex-none rounded object-cover" />
            <div className="min-w-0 text-[0.95rem]">
              <p className="font-bold text-navy">Your preview is attached, with your original photo</p>
              <p className="mt-0.5 text-slate">{preview.summary}</p>
              <button type="button" className="mt-1 font-bold text-signal underline" onClick={() => setDropPreview(true)}>
                Don’t send the preview
              </button>
            </div>
          </div>
        )}
        <label htmlFor="photos" className="label">
          {preview ? 'More photos' : 'Photos'} <span className="font-normal text-slate">(optional, up to {preview ? MAX_PHOTOS - 2 : MAX_PHOTOS})</span>
        </label>
        <input
          id="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="field py-2"
          onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS))}
          {...aria('photos')}
        />
        {err('photos')}
        {photos.length > 0 && <p className="mt-1 text-[0.95rem] text-slate">{photos.length} photo(s) ready to send.</p>}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="shop_website">Leave this empty</label>
        <input id="shop_website" name="shop_website" tabIndex={-1} autoComplete="off" />
      </div>

      {state === 'failed' && message && (
        <p className="font-bold text-signal" role="alert">
          {message}
        </p>
      )}

      <div>
        <button type="submit" className="btn btn-signal w-full sm:w-auto" disabled={state === 'sending' || outside}>
          {state === 'sending'
            ? 'Sending…'
            : wants === 'callback'
              ? 'Ask for a callback'
              : jobType === 'repair'
                ? 'Send repair request'
                : 'Send for a quote'}
        </button>
        <p className="mt-2 text-[0.9rem] text-slate">
          We use these details to reply and price the job. See the{' '}
          <Link href="/privacy-notice">privacy notice</Link>.
        </p>
      </div>
    </form>
  );
}
