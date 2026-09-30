import Link from 'next/link';
import { nationwide } from '@/copy/pages';
import { installCityBySlug } from '@/copy/install-cities';
import { installServices } from '@/copy/services';
import { faqNode, firmNode, graph, pageMeta, trailNode } from '@/engine/search-meta';
import { publishedCitySlugs } from '@/engine/route-plan';
import { JsonLd, Opening, Questions, Section } from '@/ui/blocks';
import { PhotoForQuote } from '@/ui/reach';

const c = nationwide();
export const metadata = pageMeta({ path: '/nationwide', title: c.title, description: c.description });

export default function NationwidePage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'UK-wide installs', path: '/nationwide' },
  ];
  const cities = publishedCitySlugs().map((s) => installCityBySlug(s)!);
  return (
    <>
      <JsonLd data={graph(firmNode(), faqNode('/nationwide', c.questions), trailNode('/nationwide', trail))} />
      <Opening trail={trail} kicker="Installed anywhere in the UK" h1={c.h1} answer={c.answer}>
        <div className="mt-5 max-w-2xl">
          <PhotoForQuote />
        </div>
      </Opening>

      <Section heading={c.stepsHeading} tone="deep">
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.steps.map((s, i) => (
            <li key={s.title} className="plate p-5">
              <span className="sign text-[1.8rem] text-signal">{i + 1}</span>
              <h3 className="mt-1 text-[1.1rem]">{s.title}</h3>
              <p className="mt-1">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section heading={c.youHeading}>
        <ul className="prose-shop max-w-[68ch]">
          {c.you.map((y) => (
            <li key={y}>{y}</li>
          ))}
        </ul>
      </Section>

      <Section heading="What we install">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {installServices().map((s) => (
            <li key={s.path} className="plate p-4">
              <Link href={s.path} className="sign text-[1.2rem] no-underline hover:underline">
                {s.name}
              </Link>
              <p className="mt-1 text-[0.98rem]">{s.summary}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Questions questions={c.questions} />

      {cities.length > 0 && (
        <Section heading="Working in cities we travel to often">
          <p className="max-w-[68ch]">
            Notes on how a job runs in a few cities: the drive, the survey, and the local rules that change the plan.
          </p>
          <p className="mt-3 max-w-[68ch]">
            {cities.map((city, i) => (
              <span key={city.slug}>
                {i > 0 && (i === cities.length - 1 ? ' and ' : ', ')}
                <Link href={`/nationwide/${city.slug}`}>{city.name}</Link>
              </span>
            ))}
            .
          </p>
        </Section>
      )}
    </>
  );
}
