import Link from 'next/link';
import { profile } from '@/business/profile';
import { CallLink, PhoneGlyph } from '@/ui/reach';

const installs = [
  { href: '/aluminium-shopfronts', label: 'Shopfronts' },
  { href: '/roller-shutters', label: 'Roller shutters' },
  { href: '/automatic-doors', label: 'Automatic doors' },
  { href: '/security-doors', label: 'Security doors' },
  { href: '/aluminium-doors', label: 'Aluminium doors' },
];

const rest = [
  { href: '/repairs', label: 'Repairs (Birmingham)' },
  { href: '/nationwide', label: 'UK-wide installs' },
  { href: '/prices', label: 'Prices' },
  { href: '/our-work', label: 'Our work' },
];

/**
 * The site header, painted like a shop fascia. The mobile menu is a native
 * <details>, so it works before any script loads.
 */
export function Fascia() {
  return (
    <header className="fascia no-print">
      <div className="shell flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link href="/" className="fascia-lining block rounded-[6px] px-3 py-1.5 text-cream no-underline sm:px-4 sm:py-2">
          <span className="sign block text-[1.2rem] leading-none !text-cream sm:text-[1.6rem]">HIGH STREET</span>
          <span className="block whitespace-nowrap text-[0.6rem] font-bold uppercase tracking-[0.18em] text-cream/80 sm:text-[0.7rem] sm:tracking-[0.32em]">
            Shopfronts · Birmingham
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <CallLink className="hidden items-center gap-2 font-bold text-cream no-underline md:inline-flex">
            <PhoneGlyph /> {profile.phone.value.display}
          </CallLink>
          <CallLink className="btn h-11 min-h-0 w-11 border-2 border-cream/50 p-0 text-cream md:hidden">
            <PhoneGlyph />
            <span className="sr-only">Call {profile.phone.value.display}</span>
          </CallLink>
          <Link href="/get-a-quote" className="btn btn-signal hidden sm:inline-flex">
            Get a quote
          </Link>
          <details className="group relative md:hidden">
            <summary className="btn h-11 min-h-0 cursor-pointer list-none border-2 border-cream/50 px-3 text-cream [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <nav
              aria-label="Main"
              className="absolute right-0 z-30 mt-2 w-[min(88vw,20rem)] rounded-[10px] border-2 border-navy bg-plate p-3 text-ink shadow-xl"
            >
              <p className="kicker px-2 pt-1 text-slate">Fitted UK-wide</p>
              <ul className="mt-1">
                {installs.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded px-2 py-2.5 font-bold no-underline hover:bg-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-2 border-t border-rule pt-2">
                {rest.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded px-2 py-2.5 no-underline hover:bg-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/get-a-quote" className="btn btn-signal mt-2 w-full">
                    Get a quote
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>

      <nav aria-label="Main" className="hidden border-t border-cream/15 md:block">
        <ul className="shell flex flex-wrap items-center gap-x-5 py-2.5 text-[0.95rem]">
          {[...installs, ...rest].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-cream/90 no-underline hover:text-cream hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
