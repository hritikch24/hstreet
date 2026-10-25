/**
 * Page building blocks shared by the public pages.
 */
import Image from 'next/image';
import Link from 'next/link';
import { profile, radius } from '@/business/profile';
import type { JobPhoto } from '@/copy/job-photos';
import type { Compare, QA } from '@/copy/services';
import type { Crumb } from '@/engine/search-meta';
import { Paras } from '@/ui/Prose';

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function Trail({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="You are here" className="text-sm text-slate">
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        {trail.map((c, i) => (
          <li key={c.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page">{c.name}</span>
            ) : (
              <Link href={c.path} className="no-underline hover:underline">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The opening of every service, hub and area page: the heading and a two or
 * three sentence answer on an enamel plate, with the key figures beside it.
 */
export function Opening({
  trail,
  kicker,
  h1,
  answer,
  facts,
  side,
  children,
}: {
  trail?: Crumb[];
  kicker?: string;
  h1: string;
  answer: string;
  facts?: { label: string; value: string }[];
  /** Shown beside the answer on wide screens (usually the main photo). */
  side?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const plate = (
    <div className="plate p-5 sm:p-6">
        <p className="text-[1.125rem] leading-relaxed sm:text-[1.2rem]">{answer}</p>
        {facts && facts.length > 0 && (
          <dl className={`mt-5 grid grid-cols-2 gap-3 border-t border-rule pt-4 ${side ? 'sm:grid-cols-4 lg:grid-cols-2' : 'sm:grid-cols-4'}`}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate">{f.label}</dt>
                <dd className="mt-0.5 font-bold text-navy">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
  );
  return (
    <header className="shell pt-6 pb-8 sm:pt-8">
      {trail && <Trail trail={trail} />}
      {kicker && <p className="kicker mt-5 text-signal">{kicker}</p>}
      <h1 className="mt-3 max-w-[22ch] text-[2rem] sm:text-[2.75rem]">{h1}</h1>
      {side ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          {plate}
          <div>{side}</div>
        </div>
      ) : (
        <div className="mt-5">{plate}</div>
      )}
      {children}
    </header>
  );
}

/** Question-shaped sections. The same array feeds the FAQPage JSON-LD. */
export function Questions({ questions, heading, bare = false }: { questions: QA[]; heading?: string; bare?: boolean }) {
  return (
    <section className={bare ? '' : 'shell py-8'}>
      {heading && <h2 className="mb-6 text-[1.6rem] sm:text-[2rem]">{heading}</h2>}
      <div className="grid gap-9">
        {questions.map((qa) => (
          <article key={qa.q} className="border-l-4 border-signal pl-4 sm:pl-6">
            <h2 className="text-[1.35rem] sm:text-[1.6rem]">{qa.q}</h2>
            <div className="mt-3">
              <Paras paras={qa.a} list={qa.list} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WorkPhoto({
  photo,
  sizes,
  preload = false,
  className = '',
}: {
  photo: JobPhoto;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <figure className={`overflow-hidden border-2 border-navy bg-navy ${className}`}>
      <Image
        src={photo.file}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        preload={preload}
        className="aspect-[4/3] h-auto w-full object-cover"
      />
      <figcaption className="bg-navy px-3 py-2 text-[0.85rem] text-cream">{photo.caption}</figcaption>
    </figure>
  );
}

export function PhotoGrid({ photos, limit }: { photos: JobPhoto[]; limit?: number }) {
  const shown = limit ? photos.slice(0, limit) : photos;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {shown.map((p) => (
        <WorkPhoto key={p.file} photo={p} sizes="(min-width: 1024px) 380px, 50vw" />
      ))}
    </div>
  );
}

/** Install pages: the "we fit across the UK" section. */
export function UkWide({ what }: { what: string }) {
  return (
    <section className="bg-navy py-10 text-cream">
      <div className="shell grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="kicker text-cream/70">Installed UK-wide</p>
          <h2 className="mt-2 text-[1.6rem] !text-cream sm:text-[2rem]">We fit {what} across the UK</h2>
          <p className="mt-3 max-w-[60ch] text-cream/90">
            The team is based in Birmingham and drives out to the job, wherever it is. You send photos and
            measurements, we survey before anything is made, and the fit is usually one or two days on site.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/nationwide" className="btn btn-signal">
            How a UK-wide job works
          </Link>
          <Link href="/get-a-quote" className="btn border-2 border-cream/60 text-cream hover:bg-navy-soft">
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Repair pages: say plainly where repairs stop. */
export function RepairReach() {
  return (
    <section className="shell py-8">
      <div className="rounded-[10px] border-2 border-dashed border-navy-soft p-5">
        <h2 className="text-[1.35rem] sm:text-[1.6rem]">Birmingham and up to {radius()} miles</h2>
        <p className="mt-2 max-w-[68ch]">
          Repairs and emergency callouts are for shops in Birmingham and up to {radius()} miles from it. Further out
          we don’t take repairs. New installations are different: those we{' '}
          <Link href="/nationwide">fit anywhere in the UK</Link>.
        </p>
      </div>
    </section>
  );
}

/** The two service areas, side by side. Used on the home page and /the-firm. */
export function TwoAreas() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="plate p-5">
        <p className="kicker text-signal">Installations</p>
        <h3 className="sign mt-1 text-[1.5rem]">Anywhere in the UK</h3>
        <p className="mt-2">
          New shopfronts, roller shutters, automatic doors, steel and aluminium doors. The team travels to you.
        </p>
        <Link href="/nationwide" className="mt-3 inline-block font-bold">
          How a UK-wide job works
        </Link>
      </div>
      <div className="plate p-5">
        <p className="kicker text-signal">Repairs and emergencies</p>
        <h3 className="sign mt-1 text-[1.5rem]">Birmingham, up to {radius()} miles</h3>
        <p className="mt-2">
          Shutters, doors, locks and broken glass. The emergency line is answered day and night.
        </p>
        <Link href="/repairs" className="mt-3 inline-block font-bold">
          Repairs in Birmingham
        </Link>
      </div>
    </div>
  );
}

export function Section({
  heading,
  children,
  tone = 'cream',
}: {
  heading?: string;
  children: React.ReactNode;
  tone?: 'cream' | 'deep';
}) {
  return (
    <section className={tone === 'deep' ? 'bg-cream-deep py-10' : 'py-8'}>
      <div className="shell">
        {heading && (
          <div className="mb-6">
            <h2 className="text-[1.6rem] sm:text-[2rem]">{heading}</h2>
            <div className="signrule" aria-hidden="true" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** A side-by-side comparison, with its question as the heading. */
export function CompareTable({ table }: { table: Compare }) {
  return (
    <section className="min-w-0 border-l-4 border-signal pl-4 sm:pl-6">
      <h2 className="text-[1.35rem] sm:text-[1.6rem]">{table.caption}</h2>
      {/* Phones: one card per option, so no column hides off-screen. */}
      <div className="mt-4 grid gap-3 sm:hidden">
        {table.head.slice(1).map((option, col) => (
          <div key={option} className="overflow-hidden rounded-[8px] border-2 border-navy bg-plate">
            <p className="bg-navy px-3 py-2 font-bold text-cream">{option}</p>
            <dl className="divide-y divide-rule">
              {table.rows.map(([label, ...cells]) => (
                <div key={label} className="grid grid-cols-[42%_1fr] gap-2 px-3 py-2 text-[0.95rem]">
                  <dt className="font-bold text-navy">{label}</dt>
                  <dd>{cells[col]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto rounded-[8px] border-2 border-navy sm:block">
        <table className="compare min-w-[32rem]">
          <thead>
            <tr>
              {table.head.map((h, i) => (
                <th key={i} scope="col">
                  {h || <span className="sr-only">Compared</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([label, ...cells]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {cells.map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** When the page was last read through, and when prices were last checked (only once real). */
export function Reviewed() {
  const prices = profile.pricesCheckedOn.isPlaceholder ? null : profile.pricesCheckedOn.value;
  return (
    <p className="text-sm text-slate">
      Page reviewed <time dateTime={profile.copyReviewedOn}>{longDate(profile.copyReviewedOn)}</time>
      {prices && (
        <>
          {' '}
          · prices checked <time dateTime={prices}>{longDate(prices)}</time>
        </>
      )}
    </p>
  );
}
