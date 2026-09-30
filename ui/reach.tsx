/**
 * Phone and WhatsApp links. Every one carries `data-tap`, which the beacon
 * listens for, so call and WhatsApp taps are counted wherever they appear.
 */
import { profile } from '@/business/profile';

export function PhoneGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1l-2.2 2.2Z" />
    </svg>
  );
}

export function ChatGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.66 15l-1.3 4.76a.5.5 0 0 0 .62.61l4.86-1.33A10 10 0 1 0 12 2Zm5.3 13.9c-.22.63-1.3 1.2-1.8 1.25-.47.05-.9.22-3.05-.63-2.57-1.02-4.2-3.65-4.33-3.82-.13-.17-1.03-1.37-1.03-2.62s.65-1.86.89-2.12a.93.93 0 0 1 .67-.31h.48c.16 0 .37-.06.57.43.22.52.73 1.8.8 1.93.06.13.1.28.02.45-.08.17-.13.28-.25.43-.13.15-.27.33-.38.45-.13.12-.26.26-.11.5.15.26.66 1.09 1.42 1.77.98.87 1.8 1.14 2.06 1.27.26.13.41.11.56-.06.15-.18.64-.75.82-1 .17-.26.34-.22.57-.13.24.08 1.5.7 1.76.83.26.13.43.2.5.3.06.12.06.66-.16 1.3Z" />
    </svg>
  );
}

const waHref = (text: string) =>
  `https://wa.me/${profile.whatsapp.value.e164}?text=${encodeURIComponent(text)}`;

export const QUOTE_MESSAGE = 'Hello, I would like a price. Here is a photo of my shopfront:';
export const REPAIR_MESSAGE = 'Hello, I need a repair in Birmingham. The problem is:';

export function CallLink({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return (
    <a href={`tel:${profile.phone.value.e164}`} data-tap="call" className={className}>
      {children ?? profile.phone.value.display}
    </a>
  );
}

export function WhatsAppLink({
  text = QUOTE_MESSAGE,
  className = '',
  children,
}: {
  text?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a href={waHref(text)} data-tap="whatsapp" className={className} rel="noopener" target="_blank">
      {children ?? profile.whatsapp.value.display}
    </a>
  );
}

/**
 * The inline "send us a photo" ask. Used in the home hero, on every service
 * page and on the quote page. Deliberately not a floating button.
 */
export function PhotoForQuote({ tone = 'plate', repair = false }: { tone?: 'plate' | 'navy'; repair?: boolean }) {
  const navy = tone === 'navy';
  return (
    <div
      className={
        navy
          ? 'rounded-[10px] border border-cream/30 bg-navy-deep/60 p-4 sm:p-5'
          : 'plate p-4 sm:p-5'
      }
    >
      <p className={`font-bold ${navy ? 'text-cream' : 'text-navy'}`}>
        {repair ? 'WhatsApp us a photo of the problem' : 'WhatsApp us a photo of your shopfront for a quote'}
      </p>
      <p className={`mt-1 text-[0.95rem] ${navy ? 'text-cream/85' : 'text-slate'}`}>
        {repair
          ? 'A photo of the shutter, door or glass tells us which parts to bring.'
          : 'One photo from across the road and the rough width of the opening is enough for a first price.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <WhatsAppLink text={repair ? REPAIR_MESSAGE : QUOTE_MESSAGE} className="btn btn-wa">
          <ChatGlyph /> WhatsApp {profile.whatsapp.value.display}
        </WhatsAppLink>
        <CallLink className={navy ? 'btn border-2 border-cream/60 text-cream hover:bg-navy-soft' : 'btn btn-plain'}>
          <PhoneGlyph /> {profile.phone.value.display}
        </CallLink>
      </div>
    </div>
  );
}
