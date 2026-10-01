import Link from 'next/link';
import { notFound } from 'next/navigation';
import { photoByName, photosFor } from '@/copy/job-photos';
import { services } from '@/copy/services';
import { faqNode, graph, pageMeta, pageNode, serviceNode, trailNode } from '@/engine/search-meta';
import {
  CompareTable,
  JsonLd,
  Opening,
  PhotoGrid,
  Questions,
  RepairReach,
  Reviewed,
  UkWide,
  WorkPhoto,
} from '@/ui/blocks';
import { CallbackBox } from '@/ui/CallbackBox';
import { PhotoForQuote, PriceCard } from '@/ui/reach';

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
  const hub =
    s.kind === 'install'
      ? { name: 'UK-wide installs', path: '/nationwide' }
      : { name: 'Birmingham repairs', path: '/repairs' };
  const trail = [{ name: 'Home', path: '/' }, hub, { name: s.name, path: s.path }];
  const hero = s.photos ? photoByName(s.photos.hero) : null;
  const photos = s.photos ? photosFor(s.photos.line).filter((p) => p.file !== hero?.file) : [];
  const others = services().filter((x) => x.kind === s.kind && x.path !== s.path);
  const first = s.questions.slice(0, 2);
  const rest = s.questions.slice(2);

  return (
    <>
      <JsonLd
        data={graph(
          pageNode({ path: s.path, name: s.h1, description: s.description, image: hero?.file, about: `${s.path}#hss-service` }),
          serviceNode(s),
          faqNode(s.path, s.questions),
          trailNode(s.path, trail),
        )}
      />
      <Opening
        trail={trail}
        kicker={s.kind === 'install' ? 'Fitted anywhere in the UK' : 'Birmingham repairs'}
        h1={s.h1}
        answer={s.answer}
        facts={s.keyFacts}
        side={hero ? <WorkPhoto photo={hero} preload sizes="(min-width: 1024px) 500px, 100vw" /> : undefined}
      >
        <div className="mt-5 lg:hidden">
          <PhotoForQuote repair={s.kind === 'repair'} />
        </div>
      </Opening>

      <div className="shell grid grid-cols-1 gap-10 pb-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
        <div className="grid min-w-0 grid-cols-1 content-start gap-10">
          <Questions bare questions={first} />
          {s.compare?.map((t) => <CompareTable key={t.caption} table={t} />)}
          {rest.length > 0 && <Questions bare questions={rest} />}
          {s.guide && (
            <p className="rounded-[8px] bg-cream-deep p-4">
              <span className="kicker block text-signal">Guide</span>
              <Link href={s.guide.href} className="mt-1 inline-block text-[1.1rem] font-bold">
                {s.guide.label}
              </Link>
            </p>
          )}
          <div className="max-w-md lg:hidden">
            <CallbackBox job={s.kind} service={s.quoteService} />
          </div>
          <Reviewed />
        </div>
        <aside className="hidden content-start gap-4 lg:sticky lg:top-4 lg:grid lg:self-start">
          <PriceCard what={s.name} job={s.kind} service={s.quoteService} />
          <CallbackBox job={s.kind} service={s.quoteService} />
          <nav aria-label={s.kind === 'install' ? 'Other installations' : 'Other repairs'} className="px-1">
            <p className="kicker text-slate">{s.kind === 'install' ? 'We also fit' : 'We also repair'}</p>
            <ul className="mt-2 grid gap-1.5">
              {others.map((o) => (
                <li key={o.path}>
                  <Link href={o.path}>{o.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      {s.kind === 'install' ? <UkWide what={s.name.toLowerCase()} /> : <RepairReach />}

      {photos.length > 0 && (
        <section className="shell py-10">
          <h2 className="text-[1.6rem] sm:text-[2rem]">{s.name} we have fitted</h2>
          <div className="signrule" aria-hidden="true" />
          <div className="mt-6">
            <PhotoGrid photos={photos} limit={6} />
          </div>
          <p className="mt-4">
            <Link href={`/our-work#${s.photos!.line}`} className="font-bold">
              See all our {s.name.toLowerCase()}
            </Link>
          </p>
        </section>
      )}

      <section className="shell py-6 lg:hidden">
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
