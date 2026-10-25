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
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page">{c.name}</span>
            ) : (
              <Link href={c.path} className="text-slate no-underline hover:underline">
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
 * The opening of every service, hub and area page: a large heading, a short
 * answer in plain type, and the key figures as a ruled row.
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
  const body = (
    <div>
      <p className="max-w-[56ch] text-[1.15rem] leading-relaxed text-ink-soft sm:text-[1.25rem]">{answer}</p>
      {facts && facts.length > 0 && (
        <dl className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] border-t border-ink">
          {facts.map((f) => (
            <div key={f.label} className="border-b border-rule py-4 pr-4">
              <dt className="kicker text-slate">{f.label}</dt>
              <dd className="mt-1 font-serif text-[1.15rem] leading-snug text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
  return (
    <header className="shell pt-8 pb-10 sm:pt-12 sm:pb-14">
      {trail && <Trail trail={trail} />}
      {kicker && <p className="kicker mt-8 text-accent">{kicker}</p>}
      <h1 className={`${kicker ? 'mt-4' : 'mt-8'} max-w-[20ch] text-[2.4rem] sm:text-[3.6rem]`}>{h1}</h1>
      {side ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
          {body}
          <div>{side}</div>
        </div>
      ) : (
        <div className="mt-8">{body}</div>
      )}
      {children}
    </header>
  );
}

/** Question-shaped sections. The same array feeds the FAQPage JSON-LD. */
export function Questions({ questions, heading, bare = false }: { questions: QA[]; heading?: string; bare?: boolean }) {
  return (
    <section className={bare ? '' : 'shell py-10'}>
      {heading && <h2 className="mb-8 text-[1.9rem] sm:text-[2.4rem]">{heading}</h2>}
      <div className="grid gap-10">
        {questions.map((qa) => (
          <article key={qa.q} className="border-t border-ink pt-6">
            <h2 className="text-[1.5rem] sm:text-[1.85rem]">{qa.q}</h2>
            <div className="mt-4">
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
    <figure className={className}>
      <div className="zoom">
        <Image
          src={photo.file}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          preload={preload}
          className="aspect-[4/3] h-auto w-full object-cover"
        />
      </div>
      <figcaption className="pt-3 text-[0.85rem] text-slate">{photo.caption}</figcaption>
    </figure>
  );
}

export function PhotoGrid({ photos, limit }: { photos: JobPhoto[]; limit?: number }) {
  const shown = limit ? photos.slice(0, limit) : photos;
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((p) => (
        <WorkPhoto key={p.file} photo={p} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
      ))}
    </div>
  );
}

/** Install pages: the "we fit across the UK" section. */
export function UkWide({ what }: { what: string }) {
  return (
    <section className="bg-ink py-16 text-stone">
      <div className="shell grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <p className="kicker text-accent-soft">Installed UK-wide</p>
          <h2 className="mt-3 text-[1.9rem] !text-stone sm:text-[2.4rem]">We fit {what} across the UK</h2>
          <p className="mt-4 max-w-[58ch] text-stone/80">
            The team is based in Birmingham and drives out to the job, wherever it is. You send photos and
            measurements, we survey before anything is made, and the fit is usually one or two days on site.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/nationwide" className="btn bg-stone text-ink hover:bg-white">
            How a UK-wide job works
          </Link>
          <Link href="/get-a-quote" className="btn border border-stone/50 text-stone hover:bg-stone/10">
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
    <section className="shell py-10">
      <div className="border border-rule bg-paper p-6 sm:p-8">
        <h2 className="text-[1.5rem] sm:text-[1.85rem]">Birmingham and up to {radius()} miles</h2>
        <p className="mt-3 max-w-[66ch] text-ink-soft">
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
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      <div className="border-t border-ink pt-6">
        <p className="kicker text-accent">Installations</p>
        <h3 className="sign mt-3 text-[1.8rem] font-normal">Anywhere in the UK</h3>
        <p className="mt-3 text-ink-soft">
          New shopfronts, roller shutters, grilles, automatic and glass doors, canopies and curtain walling. The team
          travels to you.
        </p>
        <Link href="/nationwide" className="mt-4 inline-block font-semibold">
          How a UK-wide job works
        </Link>
      </div>
      <div className="border-t border-ink pt-6">
        <p className="kicker text-accent">Repairs and emergencies</p>
        <h3 className="sign mt-3 text-[1.8rem] font-normal">Birmingham, up to {radius()} miles</h3>
        <p className="mt-3 text-ink-soft">
          Shutters, doors, automatic doors, glass and locks, with planned servicing. The emergency line is answered
          day and night.
        </p>
        <Link href="/repairs" className="mt-4 inline-block font-semibold">
          Repairs and emergencies
        </Link>
      </div>
    </div>
  );
}

export function Section({
  heading,
  children,
  tone = 'stone',
}: {
  heading?: string;
  children: React.ReactNode;
  tone?: 'stone' | 'deep';
}) {
  return (
    <section className={tone === 'deep' ? 'bg-stone-deep py-14' : 'py-10'}>
      <div className="shell">
        {heading && (
          <div className="mb-8">
            <h2 className="text-[1.9rem] sm:text-[2.4rem]">{heading}</h2>
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
    <section className="min-w-0 border-t border-ink pt-6">
      <h2 className="text-[1.5rem] sm:text-[1.85rem]">{table.caption}</h2>
      {/* Phones: one card per option, so no column hides off-screen. */}
      <div className="mt-5 grid gap-4 sm:hidden">
        {table.head.slice(1).map((option, col) => (
          <div key={option} className="border border-rule bg-paper">
            <p className="border-b border-ink px-4 py-3 font-serif text-[1.2rem]">{option}</p>
            <dl className="divide-y divide-rule">
              {table.rows.map(([label, ...cells]) => (
                <div key={label} className="grid grid-cols-[42%_1fr] gap-2 px-4 py-3 text-[0.95rem]">
                  <dt className="font-semibold">{label}</dt>
                  <dd>{cells[col]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-5 hidden overflow-x-auto sm:block">
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
