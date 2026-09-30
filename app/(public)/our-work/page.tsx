import { confirmedJobs, photosFor, type WorkLine } from '@/copy/job-photos';
import { workPage } from '@/copy/pages';
import { graph, pageMeta, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, PhotoGrid, Section } from '@/ui/blocks';

const c = workPage();
export const metadata = pageMeta({ path: '/our-work', title: c.title, description: c.description });

const lines: { line: WorkLine; heading: string }[] = [
  { line: 'shopfronts', heading: 'Aluminium and glass shopfronts' },
  { line: 'automatic-doors', heading: 'Automatic and sliding doors' },
  { line: 'shutters', heading: 'Roller shutters' },
  { line: 'security-doors', heading: 'Steel security doors and fire exits' },
  { line: 'aluminium-doors', heading: 'Aluminium and glazed doors' },
];

export default function OurWorkPage() {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Our work', path: '/our-work' },
  ];
  const jobs = confirmedJobs();
  return (
    <>
      <JsonLd data={graph(trailNode('/our-work', trail))} />
      <Opening trail={trail} h1={c.h1} answer={c.answer} />

      {jobs.length > 0 && (
        <Section heading={c.jobsHeading}>
          {jobs.map((j) => (
            <article key={j.job} id={j.job} className="mb-10">
              <h3 className="text-[1.2rem]">
                {j.town}, {j.completed}
              </h3>
              <p className="mt-2 max-w-[68ch]">{j.summary}</p>
              <div className="mt-3">
                <PhotoGrid photos={j.photos} />
              </div>
            </article>
          ))}
        </Section>
      )}

      {lines.map((l, i) => (
        <Section key={l.line} heading={l.heading} tone={i % 2 ? 'deep' : 'cream'}>
          <PhotoGrid photos={photosFor(l.line)} />
        </Section>
      ))}

      <p className="shell py-6 text-sm text-slate">{c.namesNote}</p>
    </>
  );
}
