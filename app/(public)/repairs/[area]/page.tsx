import Link from 'next/link';
import { notFound } from 'next/navigation';
import { priceRange, profile } from '@/business/profile';
import { repairAreas } from '@/copy/repair-areas';
import { repairServices } from '@/copy/services';
import { faqNode, graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, Questions, Reviewed, Section } from '@/ui/blocks';
import { PhotoForQuote } from '@/ui/reach';

export const dynamicParams = false;

export function generateStaticParams() {
  return repairAreas().map((a) => ({ area: a.slug }));
}

const find = (slug: string) => repairAreas().find((a) => a.slug === slug);

export async function generateMetadata({ params }: PageProps<'/repairs/[area]'>) {
  const a = find((await params).area);
  if (!a) return {};
  return pageMeta({ path: `/repairs/${a.slug}`, title: a.title, description: a.description });
}

export default async function RepairAreaPage({ params }: PageProps<'/repairs/[area]'>) {
  const a = find((await params).area);
  if (!a) notFound();
  const path = `/repairs/${a.slug}`;
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Birmingham repairs', path: '/repairs' },
    { name: a.name, path },
  ];
  return (
    <>
      <JsonLd data={graph(pageNode({ path, name: `Shutter, door and glass repairs in ${a.name}`, description: a.description }), faqNode(path, a.questions), trailNode(path, trail))} />
      <Opening
        trail={trail}
        kicker={`Repairs in ${a.name}, ${a.postcodes}`}
        h1={`Shutter, door and glass repairs in ${a.name}`}
        answer={a.answer}
        facts={[
          { label: 'Emergency', value: profile.response.value.emergency },
          { label: 'Other repairs', value: profile.response.value.standard },
          { label: 'Shutter repair', value: priceRange('shutterRepair') },
          { label: 'Council', value: a.council.split(' (')[0] },
        ]}
      >
        <div className="mt-5 max-w-2xl">
          <PhotoForQuote repair />
        </div>
      </Opening>

      <Section heading={`Where in ${a.name} do we get called?`} tone="deep">
        <dl className="grid gap-4 md:grid-cols-2">
          {a.roads.map((r) => (
            <div key={r.name} className="plate p-4">
              <dt className="font-bold text-navy">{r.name}</dt>
              <dd className="mt-1">{r.note}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 max-w-[68ch]">{a.shops}</p>
      </Section>

      <Section heading="Parking and access">
        <p className="max-w-[68ch]">{a.access}</p>
      </Section>

      <Questions questions={a.questions} />

      <Section heading={`What we repair in ${a.name}`}>
        <ul className="flex flex-wrap gap-2">
          {repairServices().map((s) => (
            <li key={s.path}>
              <Link href={s.path} className="btn btn-plain min-h-0 py-2 text-[0.95rem]">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-[68ch]">
          Need something new rather than a repair? New shopfronts, shutters and doors are{' '}
          <Link href="/nationwide">fitted anywhere in the UK</Link>, {a.name} included.
        </p>
        <div className="mt-6">
          <Reviewed />
        </div>
      </Section>
    </>
  );
}
