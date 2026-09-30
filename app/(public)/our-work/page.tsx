import { confirmedJobs, jobPhotos, photosFor, type WorkLine } from '@/copy/job-photos';
import { workPage } from '@/copy/pages';
import { galleryNode, graph, pageMeta, pageNode, trailNode } from '@/engine/search-meta';
import { JsonLd, Opening, PhotoGrid, Reviewed, Section } from '@/ui/blocks';
import { WorkGallery } from '@/ui/WorkGallery';

const c = workPage();
export const metadata = pageMeta({ path: '/our-work', title: c.title, description: c.description });

const lines: { line: WorkLine; heading: string }[] = [
  { line: 'shopfronts', heading: 'Shopfronts' },
  { line: 'shutters', heading: 'Roller shutters' },
  { line: 'automatic-doors', heading: 'Automatic doors' },
  { line: 'security-doors', heading: 'Security and fire-exit doors' },
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
      <JsonLd
        data={graph(
          pageNode({ path: '/our-work', name: c.h1, description: c.description, image: jobPhotos[0].file, type: 'CollectionPage' }),
          galleryNode('/our-work', jobPhotos),
          trailNode('/our-work', trail),
        )}
      />
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

      <div className="shell pb-8">
        <WorkGallery groups={lines.map((l) => ({ id: l.line, heading: l.heading, photos: photosFor(l.line) }))} />
        <p className="mt-8 text-sm text-slate">{c.namesNote}</p>
        <div className="mt-2">
          <Reviewed />
        </div>
      </div>
    </>
  );
}
