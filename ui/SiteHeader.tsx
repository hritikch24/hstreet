import Link from 'next/link';
import { profile, radius } from '@/business/profile';
import { installServices, repairServices } from '@/copy/services';
import { Disclosure } from '@/ui/Disclosure';
import { CallLink, PhoneGlyph } from '@/ui/reach';

const links = [
  { href: '/repairs', label: 'Repairs' },
  { href: '/prices', label: 'Prices' },
  { href: '/our-work', label: 'Our work' },
  { href: '/the-firm', label: 'The firm' },
];

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m2 4.5 4 4 4-4" />
    </svg>
  );
}

/**
 * The site header: a quiet bar. Services open in a panel (native <details>,
 * closed again on navigation), and the mobile menu is the same disclosure, so
 * both work before any script loads.
 */
export function SiteHeader() {
  const installs = installServices();
  const repairs = repairServices();
  return (
    <header className="masthead no-print relative z-30">
      <div className="shell flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5.25rem]">
        <Link href="/" className="no-underline">
          <span className="wordmark block">High Street Shopfronts</span>
          <span className="wordmark-sub">Birmingham · UK-wide installs</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 text-[0.95rem] font-medium lg:flex">
          <Disclosure
            className="relative"
            summaryClassName="flex items-center gap-1.5 py-2 hover:underline"
            label={
              <>
                Services <Chevron />
              </>
            }
          >
            <div className="absolute top-full left-1/2 z-40 mt-3 grid w-[44rem] -translate-x-1/2 grid-cols-2 gap-10 border border-rule bg-paper p-8 shadow-[0_24px_48px_-24px_rgb(20_22_26/0.35)]">
              <div>
                <p className="kicker text-slate">Fitted anywhere in the UK</p>
                <ul className="mt-3 grid gap-0.5">
                  {installs.map((s) => (
                    <li key={s.path}>
                      <Link href={s.path} className="block py-1.5 no-underline hover:underline">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="kicker text-slate">Repairs and servicing, up to {radius()} miles</p>
                <ul className="mt-3 grid gap-0.5">
                  {repairs.map((s) => (
                    <li key={s.path}>
                      <Link href={s.path} className="block py-1.5 no-underline hover:underline">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/repairs" className="mt-4 inline-block font-semibold text-accent">
                  Emergency line, 24 hours
                </Link>
              </div>
            </div>
          </Disclosure>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 no-underline hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <CallLink className="hidden items-center gap-2 font-semibold no-underline xl:inline-flex">
            <PhoneGlyph className="h-4 w-4" /> {profile.phone.value.display}
          </CallLink>
          <CallLink className="btn btn-plain h-11 min-h-0 w-11 p-0 lg:hidden">
            <PhoneGlyph />
            <span className="sr-only">Call {profile.phone.value.display}</span>
          </CallLink>
          <Link href="/get-a-quote" className="btn btn-accent hidden min-h-0 py-3 sm:inline-flex">
            Get a quote
          </Link>

          <Disclosure
            className="relative lg:hidden"
            summaryClassName="btn btn-plain h-11 min-h-0 px-4 text-[0.95rem]"
            label="Menu"
          >
            <nav
              aria-label="Main"
              className="absolute right-0 z-40 mt-3 max-h-[80vh] w-[min(92vw,22rem)] overflow-y-auto border border-rule bg-paper p-5 shadow-[0_24px_48px_-24px_rgb(20_22_26/0.35)]"
            >
              <p className="kicker text-slate">Fitted anywhere in the UK</p>
              <ul className="mt-2">
                {installs.map((s) => (
                  <li key={s.path}>
                    <Link href={s.path} className="block py-2 font-medium no-underline">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="kicker mt-4 border-t border-rule pt-4 text-slate">Repairs and servicing</p>
              <ul className="mt-2">
                {repairs.map((s) => (
                  <li key={s.path}>
                    <Link href={s.path} className="block py-2 font-medium no-underline">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 border-t border-rule pt-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block py-2 no-underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/get-a-quote" className="btn btn-accent mt-3 w-full">
                Get a quote
              </Link>
            </nav>
          </Disclosure>
        </div>
      </div>
    </header>
  );
}
