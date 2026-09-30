'use client';

/**
 * Asks for an AI-drafted reply, shows it in an editable box, and hands it to
 * WhatsApp or the email app. It never sends anything by itself.
 */
import { useState } from 'react';

interface Props {
  enquiryId: string;
  preferred: 'whatsapp' | 'email';
  phone: string;
  email: string | null;
  earlier: { id: string; channel: string; body: string }[];
}

const waNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `44${digits.slice(1)}` : digits;
};

export function DraftReply({ enquiryId, preferred, phone, email, earlier }: Props) {
  const [channel, setChannel] = useState<'whatsapp' | 'email'>(preferred);
  const [text, setText] = useState(earlier[0]?.body ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function draft() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/hq/enquiries/${enquiryId}/draft`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ channel }),
      });
      const body = (await res.json()) as { ok: boolean; text?: string; error?: string };
      if (body.ok && body.text) setText(body.text);
      else setError(body.error ?? 'Could not draft a reply.');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="plate grid gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.2rem]">Reply</h2>
        <div className="flex gap-3">
          {(['whatsapp', 'email'] as const).map((c) => (
            <label key={c} className="flex items-center gap-1.5">
              <input type="radio" name="channel" checked={channel === c} onChange={() => setChannel(c)} />
              {c === 'whatsapp' ? 'WhatsApp' : 'Email'}
            </label>
          ))}
        </div>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="field" placeholder="Write a reply, or ask for a draft." />
      {error && <p className="font-bold text-signal">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={draft} disabled={busy} className="btn btn-plain">
          {busy ? 'Drafting…' : text ? 'Draft again' : 'Draft a reply'}
        </button>
        {text && channel === 'whatsapp' && (
          <a className="btn btn-wa" target="_blank" rel="noopener" href={`https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`}>
            Open in WhatsApp
          </a>
        )}
        {text && channel === 'email' && email && (
          <a className="btn btn-signal" href={`mailto:${email}?subject=${encodeURIComponent('Your enquiry')}&body=${encodeURIComponent(text)}`}>
            Open in email
          </a>
        )}
        {text && (
          <button type="button" className="btn btn-plain" onClick={() => navigator.clipboard?.writeText(text)}>
            Copy
          </button>
        )}
      </div>
      <p className="text-sm text-slate">Drafts are suggestions. Check every price and date before you send.</p>
    </section>
  );
}
