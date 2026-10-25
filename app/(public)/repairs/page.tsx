import Link from 'next/link';
import { radius } from '@/business/profile';
import { repairsHub } from '@/copy/pages';
import { repairAreas } from '@/copy/repair-areas';
import { repairServices } from '@/copy/services';
import { firmNode, graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, Reviewed, Section } from '@/ui/blocks';
import { CallbackBox } from '@/ui/CallbackBox';
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
      <JsonLd data={graph(pageNode({ path: '/repairs', name: c.h1, description: c.description }), firmNode(), trailNode('/repairs', trail))} />
      <Opening trail={trail} kicker={`Birmingham and up to ${radius()} miles`} h1={c.h1} answer={c.answer}>
        <div className="mt-5 grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <PhotoForQuote repair />
          <CallbackBox job="repair" service="shutter-repair" />
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
        <dl className="mt-6 grid border-t-2 border-navy md:grid-cols-2 md:gap-x-10">
          {areas.map((a) => (
            <div key={a.slug} className="border-b border-rule py-4">
              <dt className="text-[1.15rem] font-bold">
                <Link href={`/repairs/${a.slug}`}>{a.name}</Link>{' '}
                <span className="text-sm font-normal text-slate">{a.postcodes}</span>
              </dt>
              <dd className="mt-1 text-[0.98rem]">
                {a.roads[0].name}: {a.roads[0].note}.
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section heading={c.outsideHeading}>
        <p className="max-w-[68ch]">
          {c.outside} <Link href="/nationwide">How UK-wide installs work</Link>.
        </p>
        <div className="mt-6">
          <Reviewed />
        </div>
      </Section>
    </>
  );
}
