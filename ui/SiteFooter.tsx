import Link from 'next/link';
import { addressLine, hoursText, profile, radius } from '@/business/profile';
import { guides } from '@/copy/guides';
import { installServices, repairServices } from '@/copy/services';
import { CallLink, WhatsAppLink } from '@/ui/reach';

const quiet = 'text-stone/80 no-underline hover:text-stone hover:underline';

/** The footer: the business facts, stated once, the same way everywhere. */
export function SiteFooter() {
  return (
    <footer className="footer-base no-print mt-20">
      <div className="shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="wordmark !text-stone">{profile.name}</p>
          <p className="mt-4 max-w-[34ch] text-[0.95rem] text-stone/75">{profile.oneLiner}</p>
          <p className="mt-4 text-[0.95rem] text-stone/75">{addressLine()}</p>
          <ul className="mt-6 grid gap-1.5 text-[0.95rem]">
            <li>
              <CallLink className="font-semibold text-stone no-underline hover:underline" />
            </li>
            <li>
              <WhatsAppLink className="text-stone/85 no-underline hover:underline">
                WhatsApp {profile.whatsapp.value.display}
              </WhatsAppLink>
            </li>
            <li>
              <a href={`mailto:${profile.email.value}`} className={quiet}>
                {profile.email.value}
              </a>
            </li>
            {profile.hours.value.map((h) => (
              <li key={h.days} className="text-stone/75">
                {h.days}: {hoursText(h)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker text-stone/55">Fitted UK-wide</p>
          <ul className="mt-4 grid gap-2 text-[0.95rem]">
            {installServices().map((s) => (
              <li key={s.path}>
                <Link href={s.path} className={quiet}>
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/nationwide" className="font-semibold text-stone no-underline hover:underline">
                How UK-wide installs work
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker text-stone/55">Repairs, up to {radius()} miles</p>
          <ul className="mt-4 grid gap-2 text-[0.95rem]">
            {repairServices().map((s) => (
              <li key={s.path}>
                <Link href={s.path} className={quiet}>
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/repairs" className="font-semibold text-stone no-underline hover:underline">
                Emergencies and repair areas
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker text-stone/55">Guides</p>
          <ul className="mt-4 grid gap-2 text-[0.95rem]">
            {guides().map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className={quiet}>
                  {g.h1}
                </Link>
              </li>
            ))}
          </ul>
          <p className="kicker mt-8 text-stone/55">The firm</p>
          <ul className="mt-4 grid gap-2 text-[0.95rem]">
            <li>
              <Link href="/the-firm" className={quiet}>
                About the firm
              </Link>
            </li>
            <li>
              <Link href="/talk-to-us" className={quiet}>
                Contact details and hours
              </Link>
            </li>
            <li>
              <Link href="/privacy-notice" className={quiet}>
                Privacy notice
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone/12">
        <p className="shell py-6 text-[0.85rem] text-stone/60">
          © {new Date().getFullYear()} {profile.name}
          {profile.companyNumber.isPlaceholder
            ? ''
            : ` · ${profile.legalName}, registered in England and Wales, company no. ${profile.companyNumber.value}. Registered office: ${profile.registeredOffice}`}
        </p>
      </div>
    </footer>
  );
}
