import Link from 'next/link';
import { nationwide } from '@/copy/pages';
import { installCityBySlug } from '@/copy/install-cities';
import { faqNode, firmNode, graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { publishedCitySlugs } from '@/engine/route-plan';
import { JsonLd, Opening, Questions, Reviewed, Section } from '@/ui/blocks';
import { InstallCards } from '@/ui/InstallCards';
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
      <JsonLd data={graph(pageNode({ path: '/nationwide', name: c.h1, description: c.description }), firmNode(), faqNode('/nationwide', c.questions), trailNode('/nationwide', trail))} />
      <Opening trail={trail} kicker="Installed anywhere in the UK" h1={c.h1} answer={c.answer}>
        <div className="mt-5 max-w-2xl">
          <PhotoForQuote />
        </div>
      </Opening>

      <Section heading={c.stepsHeading} tone="deep">
        <ol className="grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {c.steps.map((s, i) => (
            <li key={s.title} className="border-t-4 border-navy pt-4">
              <span className="sign text-[2.2rem] leading-none text-signal">{i + 1}</span>
              <h3 className="mt-2 text-[1.15rem]">{s.title}</h3>
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
        <InstallCards />
      </Section>

      <Questions questions={c.questions} />
      <div className="shell">
        <Reviewed />
      </div>

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
