import Image from 'next/image';
import Link from 'next/link';
import { photoByName } from '@/copy/job-photos';
import { installServices } from '@/copy/services';

/** The five install lines as photo cards, each with its typical price. */
export function InstallCards({ extra }: { extra?: React.ReactNode }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {installServices().map((s) => {
        const p = s.photos ? photoByName(s.photos.hero) : null;
        return (
          <li key={s.path}>
            <Link href={s.path} className="lift group block h-full overflow-hidden rounded-[10px] border-2 border-navy bg-plate no-underline">
              {p && (
                <Image
                  src={p.file}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[3/2] h-auto w-full object-cover"
                />
              )}
              <span className="block p-4">
                <span className="sign block text-[1.3rem] group-hover:underline">{s.name}</span>
                <span className="mt-1 block text-ink">{s.summary}</span>
                <span className="mt-2 block text-sm font-bold text-signal">
                  {s.keyFacts[0].label.replace(', guide', '')}: {s.keyFacts[0].value} <span className="font-normal text-slate">(guide)</span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
      {extra && <li>{extra}</li>}
    </ul>
  );
}
