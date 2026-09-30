import Link from 'next/link';
import { repairsHub } from '@/copy/pages';
import { repairAreas } from '@/copy/repair-areas';
import { repairServices } from '@/copy/services';
import { firmNode, graph, pageMeta, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, Section } from '@/ui/blocks';
import { PhotoForQuote } from '@/ui/reach';

const c = repairsHub();
export const metadata = pageMeta({ path: '/repairs', title: c.title, description: c.description });

export default function RepairsPage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Birmingham repairs', path: '/repairs' },
  ];
  const areas = repairAreas();
  return (
    <>
      <JsonLd data={graph(firmNode(), trailNode('/repairs', trail))} />
      <Opening trail={trail} kicker="Birmingham area only" h1={c.h1} answer={c.answer}>
        <div className="mt-5 max-w-2xl">
          <PhotoForQuote repair />
        </div>
      </Opening>

      <section id="emergency" className="bg-signal py-10 text-white">
        <div className="shell">
          <h2 className="text-[1.6rem] !text-white sm:text-[2rem]">{c.emergencyHeading}</h2>
          <ul className="mt-4 grid gap-2 text-[1.05rem]">
            {c.emergency.map((e) => (
              <li key={e}>— {e}</li>
            ))}
          </ul>
          <p className="mt-4 max-w-[68ch] font-bold">{c.emergencyNote()}</p>
        </div>
      </section>

      <Section heading="What we repair">
        <ul className="grid gap-3 md:grid-cols-3">
          {repairServices().map((s) => (
            <li key={s.path} className="plate p-4">
              <Link href={s.path} className="sign text-[1.2rem] no-underline hover:underline">
                {s.name}
              </Link>
              <p className="mt-1 text-[0.98rem]">{s.summary}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={c.areasHeading} tone="deep">
        <p className="max-w-[68ch]">{c.areasIntro}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {areas.map((a) => (
            <article key={a.slug} className="plate p-4">
              <h3 className="text-[1.15rem]">
                <Link href={`/repairs/${a.slug}`}>{a.name}</Link>{' '}
                <span className="text-sm font-normal text-slate">{a.postcodes}</span>
              </h3>
              <p className="mt-1 text-[0.98rem]">{a.roads[0].name}: {a.roads[0].note}.</p>
            </article>
          ))}
        </div>
      </Section>

      <Section heading={c.outsideHeading}>
        <p className="max-w-[68ch]">
          {c.outside} <Link href="/nationwide">How UK-wide installs work</Link>.
        </p>
      </Section>
    </>
  );
}
