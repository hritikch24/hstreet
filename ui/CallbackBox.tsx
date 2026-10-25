'use client';

/**
 * "Rather we called you?": the shortest way to become a lead. Name, phone
 * and town only; it lands in /hq as a callback request like any enquiry.
 */
import { useState } from 'react';
import { conversion } from '@/ui/Beacon';

interface Props {
  job: 'install' | 'repair';
  service: string;
  tone?: 'panel' | 'ink';
  heading?: string;
}

function visitId(): string {
  try {
    return sessionStorage.getItem('hss.visit') ?? '';
  } catch {
    return '';
  }
}

export function CallbackBox({ job, service, tone = 'panel', heading = 'Rather we called you?' }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [message, setMessage] = useState('');
  const ink = tone === 'ink';

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set('jobType', job);
    data.set('service', service);
    data.set('wants', 'callback');
    data.set('contactBy', 'phone');
    data.set('visit', visitId());
    setState('sending');
    try {
      const res = await fetch('/api/enquiries', { method: 'POST', body: data });
      const body = (await res.json()) as { ok: boolean; problems?: Record<string, string>; message?: string };
      if (body.ok) {
        conversion('enquiry');
        setState('done');
        return;
      }
      setMessage(
        body.problems ? Object.values(body.problems)[0] : body.message ?? 'That didn’t send. Please try again or call us.',
      );
      setState('failed');
    } catch {
      setMessage('That didn’t send. Please try again or call us.');
      setState('failed');
    }
  }

  const box = ink ? 'rounded-[2px] border border-stone/30 bg-ink-deep/60 p-4 text-stone' : 'panel p-4';

  if (state === 'done') {
    return (
      <div className={box} role="status">
        <p className={`font-bold ${ink ? 'text-stone' : 'text-ink'}`}>Thanks. We’ll call you back.</p>
        <p className={`mt-1 text-[0.95rem] ${ink ? 'text-stone/85' : 'text-slate'}`}>
          If it’s an emergency, please ring us now rather than wait.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={box}>
      <p className={`font-bold ${ink ? 'text-stone' : 'text-ink'}`}>{heading}</p>
      <p className={`mt-0.5 text-[0.95rem] ${ink ? 'text-stone/85' : 'text-slate'}`}>
        Leave your number and we’ll ring you, usually the same working day.
      </p>
      <div className="mt-3 grid gap-2">
        <label className="sr-only" htmlFor={`cb-name-${service}`}>
          Your name
        </label>
        <input id={`cb-name-${service}`} name="name" required minLength={2} placeholder="Your name" autoComplete="name" className="field min-h-11" />
        <label className="sr-only" htmlFor={`cb-phone-${service}`}>
          Phone number
        </label>
        <input id={`cb-phone-${service}`} name="phone" type="tel" required placeholder="Phone number" autoComplete="tel" className="field min-h-11" />
        <label className="sr-only" htmlFor={`cb-place-${service}`}>
          Town or postcode of the shop
        </label>
        <input id={`cb-place-${service}`} name="place" required minLength={2} placeholder="Town or postcode of the shop" autoComplete="postal-code" className="field min-h-11" />
        <input name="shop_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={state === 'sending'} className="btn btn-accent w-full">
          {state === 'sending' ? 'Sending…' : 'Call me back'}
        </button>
      </div>
      {state === 'failed' && (
        <p className={`mt-2 text-[0.95rem] font-bold ${ink ? 'text-stone' : 'text-accent'}`} role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
