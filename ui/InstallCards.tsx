import Image from 'next/image';
import Link from 'next/link';
import { photoByName } from '@/copy/job-photos';
import { installServices, repairServices, type ServicePage } from '@/copy/services';

function Card({ s, n }: { s: ServicePage; n: number }) {
  const p = s.photos ? photoByName(s.photos.hero) : null;
  const num = String(n).padStart(2, '0');
  return (
    <Link href={s.path} className="group block h-full no-underline">
      {p && (
        <div className="zoom">
          <Image
            src={p.file}
            alt={p.alt}
            width={p.width}
            height={p.height}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="aspect-[4/5] h-auto w-full object-cover"
          />
        </div>
      )}
      <span className="kicker mt-5 block text-slate">{num}</span>
      <span className="sign mt-2 block text-[1.6rem] group-hover:underline">{s.name}</span>
      <span className="mt-2 block max-w-[34ch] text-slate">{s.summary}</span>
      <span className="mt-4 flex justify-between border-t border-rule pt-3 text-[0.92rem] font-semibold">
        <span>About {s.keyFacts[0].value}</span>
        <span className="font-normal text-slate">guide</span>
      </span>
    </Link>
  );
}

/**
 * The install lines: the ones we have real photographs of as photo cards, the
 * rest as a ruled list below, so nothing is shown with a stand-in picture.
 */
export function InstallCards() {
  const all = installServices();
  const withPhoto = all.filter((s) => s.photos);
  const without = all.filter((s) => !s.photos);
  return (
    <div>
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {withPhoto.map((s) => (
          <li key={s.path}>
            <Card s={s} n={all.indexOf(s) + 1} />
          </li>
        ))}
      </ul>
      {without.length > 0 && (
        <div className="mt-16">
          <p className="kicker text-slate">Also fitted</p>
          <ul className="mt-4 border-t border-ink">
            {without.map((s) => (
              <li key={s.path} className="border-b border-rule">
                <Link href={s.path} className="group grid gap-x-8 gap-y-1 py-5 no-underline md:grid-cols-[1fr_1.4fr_auto] md:items-baseline">
                  <span className="sign text-[1.5rem] group-hover:underline">{s.name}</span>
                  <span className="text-slate">{s.summary}</span>
                  <span className="text-[0.92rem] font-semibold">About {s.keyFacts[0].value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Repair and servicing lines as a ruled list with the guide price on the right. */
export function RepairList() {
  return (
    <ul className="border-t border-stone/25">
      {repairServices().map((s) => (
        <li key={s.path} className="border-b border-stone/25">
          <Link href={s.path} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 no-underline">
            <span className="font-serif text-[1.45rem] text-stone group-hover:underline sm:text-[1.7rem]">{s.name}</span>
            <span className="text-[0.92rem] text-stone/65">
              {s.keyFacts[0].label.replace(', guide', '')} · about {s.keyFacts[0].value}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
