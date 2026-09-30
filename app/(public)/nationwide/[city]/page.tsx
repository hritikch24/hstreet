import Link from 'next/link';
import { notFound } from 'next/navigation';
import { priceRange, profile } from '@/business/profile';
import { confirmedJobs } from '@/copy/job-photos';
import { installCityBySlug } from '@/copy/install-cities';
import { faqNode, graph, pageMeta, trailNode } from '@/engine/search-meta';
import { publishedCitySlugs } from '@/engine/route-plan';
import { JsonLd, Opening, PhotoGrid, Questions, Section } from '@/ui/blocks';
import { PhotoForQuote } from '@/ui/reach';

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps<'/nationwide/[city]'>) {
  const city = installCityBySlug((await params).city);
  if (!city) return {};
  return pageMeta({ path: `/nationwide/${city.slug}`, title: city.title, description: city.description });
}

export default async function CityPage({ params }: PageProps<'/nationwide/[city]'>) {
  const city = installCityBySlug((await params).city);
  if (!city) notFound();
  const path = `/nationwide/${city.slug}`;
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'UK-wide installs', path: '/nationwide' },
    { name: city.name, path },
  ];
  // Only jobs whose town the owner has confirmed. Nothing is inferred.
  const jobs = confirmedJobs().filter((j) => j.town.toLowerCase() === city.name.toLowerCase());
  const answer = `Yes, we fit shopfronts, roller shutters and shop doors in ${city.name}. It is about ${city.miles} miles from Birmingham, ${city.drive} via ${city.route}; a typical shopfront costs ${priceRange('shopfront')} and is fitted ${profile.leadTimes.value.shopfront}. We install in ${city.name} but do not do repairs there.`;

  return (
    <>
      <JsonLd data={graph(faqNode(path, city.questions), trailNode(path, trail))} />
      <Opening
        trail={trail}
        kicker={`Installing in ${city.name}`}
        h1={`Shopfronts and shutters fitted in ${city.name}`}
        answer={answer}
        facts={[
          { label: 'From Birmingham', value: `About ${city.miles} miles` },
          { label: 'Drive', value: city.drive },
          { label: 'Shopfront', value: priceRange('shopfront') },
          { label: 'Repairs here', value: 'Not offered' },
        ]}
      />

      <Section heading={`How is a ${city.name} job surveyed?`} tone="deep">
        <p className="max-w-[68ch]">{city.survey}</p>
      </Section>

      <Section heading={`What changes the plan in ${city.name}?`}>
        <ul className="prose-shop max-w-[68ch]">
          {city.onTheGround.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Section>

      <Questions questions={city.questions} />

      {jobs.length > 0 && (
        <Section heading={`Jobs we have finished in ${city.name}`}>
          {jobs.map((j) => (
            <article key={j.job} className="mb-8">
              <p className="font-bold">
                {j.town}, {j.completed}
              </p>
              <p className="mt-1 max-w-[68ch]">{j.summary}</p>
              <div className="mt-3">
                <PhotoGrid photos={j.photos} />
              </div>
            </article>
          ))}
        </Section>
      )}

      <section className="shell py-8">
        <div className="max-w-2xl">
          <PhotoForQuote />
        </div>
        <p className="mt-4">
          <Link href="/nationwide" className="font-bold">
            How every UK-wide installation works
          </Link>
        </p>
      </section>
    </>
  );
}
