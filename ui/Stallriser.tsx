import Link from 'next/link';
import { addressLine, hoursText, profile, radius } from '@/business/profile';
import { guides } from '@/copy/guides';
import { installServices, publishedGaragePages, repairServices } from '@/copy/services';
import { CallLink, WhatsAppLink } from '@/ui/reach';

/** The footer: the business facts, stated once, the same way everywhere. */
export function Stallriser() {
  return (
    <footer className="stallriser no-print mt-12">
      <div className="stallriser-tiles" aria-hidden="true" />
      <div className="shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="sign text-[1.4rem] !text-cream">{profile.name}</p>
          <p className="mt-2 text-[0.95rem] text-cream/85">{profile.oneLiner}</p>
          <p className="mt-3 text-[0.95rem] text-cream/85">{addressLine()}</p>
        </div>
        <div>
          <p className="kicker text-cream/60">Fitted UK-wide</p>
          <ul className="mt-2 grid gap-1.5">
            {[...installServices(), ...publishedGaragePages().filter((g) => g.kind === 'install' && !g.local)].map((s) => (
              <li key={s.path}>
                <Link href={s.path} className="text-cream no-underline hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/nationwide" className="text-cream no-underline hover:underline">
                How UK-wide installs work
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker text-cream/60">Repairs, Birmingham + {radius()} miles</p>
          <ul className="mt-2 grid gap-1.5">
            {[...repairServices(), ...publishedGaragePages().filter((g) => g.kind === 'repair' || g.local)].map((s) => (
              <li key={s.path}>
                <Link href={s.path} className="text-cream no-underline hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/repairs" className="text-cream no-underline hover:underline">
                Emergencies and repair areas
              </Link>
            </li>
          </ul>
          <p className="kicker mt-5 text-cream/60">Guides</p>
          <ul className="mt-2 grid gap-1.5">
            {guides().map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-cream no-underline hover:underline">
                  {g.h1}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker text-cream/60">Talk to us</p>
          <ul className="mt-2 grid gap-1.5">
            <li>
              Phone: <CallLink className="font-bold text-cream" />
            </li>
            <li>
              WhatsApp: <WhatsAppLink className="font-bold text-cream" />
            </li>
            <li>
              <a href={`mailto:${profile.email.value}`} className="text-cream">
                {profile.email.value}
              </a>
            </li>
            {profile.hours.value.map((h) => (
              <li key={h.days} className="text-cream/85">
                {h.days}: {hoursText(h)}
              </li>
            ))}
          </ul>
          <ul className="mt-5 grid gap-1.5 text-[0.95rem]">
            <li>
              <Link href="/the-firm" className="text-cream/85 no-underline hover:underline">
                The firm
              </Link>
            </li>
            <li>
              <Link href="/talk-to-us" className="text-cream/85 no-underline hover:underline">
                Contact details and hours
              </Link>
            </li>
            <li>
              <Link href="/privacy-notice" className="text-cream/85 no-underline hover:underline">
                Privacy notice
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="shell py-4 text-[0.85rem] text-cream/60">
          © {new Date().getFullYear()} {profile.name}
          {profile.companyNumber.isPlaceholder
            ? ''
            : ` · ${profile.legalName}, registered in England and Wales, company no. ${profile.companyNumber.value}. Registered office: ${profile.registeredOffice}`}
        </p>
      </div>
    </footer>
  );
}
