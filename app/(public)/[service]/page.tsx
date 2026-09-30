import Link from 'next/link';
import { notFound } from 'next/navigation';
import { photoByName, photosFor } from '@/copy/job-photos';
import { services } from '@/copy/services';
import { faqNode, graph, pageMeta, serviceNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, PhotoGrid, Questions, RepairReach, UkWide, WorkPhoto } from '@/ui/blocks';
import { PhotoForQuote } from '@/ui/reach';

/** The eight service pages live at the top level: /roller-shutters, /shutter-repairs … */
export const dynamicParams = false;

export function generateStaticParams() {
  return services().map((s) => ({ service: s.path.slice(1) }));
}

const find = (slug: string) => services().find((s) => s.path === `/${slug}`);

export async function generateMetadata({ params }: PageProps<'/[service]'>) {
  const s = find((await params).service);
  if (!s) return {};
  return pageMeta({
    path: s.path,
    title: s.title,
    description: s.description,
    image: s.photos ? photoByName(s.photos.hero).file : undefined,
  });
}

export default async function ServicePage({ params }: PageProps<'/[service]'>) {
  const s = find((await params).service);
  if (!s) notFound();
  const hub = s.kind === 'install' ? { name: 'UK-wide installs', path: '/nationwide' } : { name: 'Birmingham repairs', path: '/repairs' };
  const trail = [{ name: 'Home', path: '/' }, hub, { name: s.name, path: s.path }];
  const photos = s.photos ? photosFor(s.photos.line).filter((p) => !p.file.endsWith(`/${s.photos!.hero}.jpg`)) : [];
  const others = services().filter((x) => x.kind === s.kind && x.path !== s.path);

  return (
    <>
      <JsonLd data={graph(serviceNode(s), faqNode(s.path, s.questions), trailNode(s.path, trail))} />
      <Opening
        trail={trail}
        kicker={s.kind === 'install' ? 'Fitted anywhere in the UK' : 'Birmingham repairs'}
        h1={s.h1}
        answer={s.answer}
        facts={s.keyFacts}
      >
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <PhotoForQuote repair={s.kind === 'repair'} />
          {s.photos && (
            <WorkPhoto photo={photoByName(s.photos.hero)} preload sizes="(min-width: 1024px) 560px, 100vw" />
          )}
        </div>
      </Opening>

      <Questions questions={s.questions} />

      {s.kind === 'install' ? <UkWide what={s.name.toLowerCase()} /> : <RepairReach />}

      {photos.length > 0 && (
        <section className="shell py-10">
          <h2 className="text-[1.6rem] sm:text-[2rem]">{s.name} we have fitted</h2>
          <div className="mt-5">
            <PhotoGrid photos={photos} limit={6} />
          </div>
          <p className="mt-4">
            <Link href="/our-work" className="font-bold">
              See all our work
            </Link>
          </p>
        </section>
      )}

      <section className="shell py-6">
        <h2 className="text-[1.35rem]">{s.kind === 'install' ? 'We also fit' : 'We also repair'}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.path}>
              <Link href={o.path} className="btn btn-plain min-h-0 py-2 text-[0.95rem]">
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
