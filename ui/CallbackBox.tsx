'use client';

/**
 * "Rather we called you?": the shortest way to become a lead. Name, phone
 * and town only; it lands in /hq as a callback request like any enquiry.
 */
import { useEffect, useId, useRef, useState } from 'react';
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
  const [problems, setProblems] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [focusTick, setFocusTick] = useState(0);
  useEffect(() => {
    if (focusTick > 0) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusTick]);
  const ink = tone === 'ink';
  const uid = useId();
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state === 'done') doneRef.current?.focus();
  }, [state]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set('jobType', job);
    data.set('service', service);
    data.set('wants', 'callback');
    data.set('contactBy', 'phone');
    data.set('visit', visitId());
    setProblems({});
    setState('sending');
    try {
      const res = await fetch('/api/enquiries', { method: 'POST', body: data });
      const body = (await res.json()) as { ok: boolean; problems?: Record<string, string>; message?: string };
      if (body.ok) {
        conversion('enquiry');
        setState('done');
        return;
      }
      setProblems(body.problems ?? {});
      setMessage(
        body.problems ? Object.values(body.problems)[0] : body.message ?? 'That didn’t send. Please try again or call us.',
      );
      setState('failed');
      setFocusTick((n) => n + 1);
    } catch {
      setMessage('That didn’t send. Please try again or call us.');
      setState('failed');
    }
  }

  const box = ink ? 'rounded-[2px] border border-stone/30 bg-ink-deep/60 p-4 text-stone' : 'panel p-4';

  if (state === 'done') {
    return (
      <div ref={doneRef} tabIndex={-1} className={`${box} outline-offset-4`} role="status">
        <p className={`font-bold ${ink ? 'text-stone' : 'text-ink'}`}>Thanks. We’ll call you back.</p>
        <p className={`mt-1 text-[0.95rem] ${ink ? 'text-stone/85' : 'text-slate'}`}>
          If it’s an emergency, please ring us now rather than wait.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className={box}>
      <p className={`font-bold ${ink ? 'text-stone' : 'text-ink'}`}>{heading}</p>
      <p className={`mt-0.5 text-[0.95rem] ${ink ? 'text-stone/85' : 'text-slate'}`}>
        Leave your number and we’ll ring you, usually the same working day.
      </p>
      <div className="mt-3 grid gap-3">
        {[
          { key: 'name', label: 'Your name', input: { name: 'name', required: true, minLength: 2, autoComplete: 'name' } },
          { key: 'phone', label: 'Phone number', input: { name: 'phone', type: 'tel', required: true, autoComplete: 'tel' } },
          {
            key: 'place',
            label: 'Town or postcode of the shop',
            input: { name: 'place', required: true, minLength: 2, autoComplete: 'postal-code', placeholder: 'e.g. B8 1AA' },
          },
        ].map((f) => (
          <div key={f.key}>
            <label htmlFor={`${uid}-${f.key}`} className={`mb-1 block text-[0.92rem] font-semibold ${ink ? 'text-stone' : 'text-ink'}`}>
              {f.label}
            </label>
            <input
              id={`${uid}-${f.key}`}
              {...f.input}
              className="field min-h-11"
              aria-invalid={problems[f.input.name] ? true : undefined}
              aria-describedby={problems[f.input.name] ? `${uid}-${f.key}-problem` : undefined}
            />
            {problems[f.input.name] && (
              <p id={`${uid}-${f.key}-problem`} className={`mt-1 text-[0.92rem] font-bold ${ink ? 'text-stone' : 'text-accent'}`}>
                {problems[f.input.name]}
              </p>
            )}
          </div>
        ))}
        <input name="shop_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={state === 'sending'} className="btn btn-accent w-full">
          {state === 'sending' ? 'Sending…' : 'Call me back'}
        </button>
      </div>
      {state === 'failed' && Object.keys(problems).length === 0 && (
        <p className={`mt-2 text-[0.95rem] font-bold ${ink ? 'text-stone' : 'text-accent'}`} role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
