import type { Metadata } from 'next';
import Link from 'next/link';
import { profile } from '@/business/profile';
import { requireHqPage } from '@/engine/hq-session';

export const metadata: Metadata = {
  title: { absolute: `HQ · ${profile.name}` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const nav = [
  { href: '/hq', label: 'Dashboard' },
  { href: '/hq/enquiries', label: 'Enquiries' },
  { href: '/hq/clients', label: 'Clients' },
  { href: '/hq/paperwork', label: 'Quotes & invoices' },
];

export default async function HqLayout({ children }: LayoutProps<'/hq'>) {
  await requireHqPage();
  return (
    <div className="min-h-dvh bg-cream">
      <header className="no-print bg-navy text-cream">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="sign text-[1.15rem] !text-cream">HQ · {profile.name}</p>
          <nav aria-label="Back office">
            <ul className="flex flex-wrap gap-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="rounded px-3 py-1.5 text-cream no-underline hover:bg-navy-soft">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="shell py-6">{children}</main>
    </div>
  );
}
