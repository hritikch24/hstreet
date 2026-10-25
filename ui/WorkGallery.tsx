'use client';

/**
 * The /our-work gallery. Every photo is in the server-rendered HTML; this
 * only adds a filter by type of work and a full-size viewer built on the
 * native <dialog> (Esc closes it, arrow keys move through photos).
 */
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { JobPhoto } from '@/copy/job-photos';

export interface GalleryGroup {
  id: string;
  heading: string;
  photos: JobPhoto[];
}

export function WorkGallery({ groups }: { groups: GalleryGroup[] }) {
  const [only, setOnly] = useState<string | null>(null);
  const [open, setOpen] = useState<JobPhoto | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = groups.filter((g) => !only || g.id === only);
  const flat = shown.flatMap((g) => g.photos);

  const view = (p: JobPhoto) => {
    setOpen(p);
    dialog.current?.showModal();
  };
  const step = (by: number) => {
    if (!open) return;
    const i = flat.findIndex((p) => p.file === open.file);
    setOpen(flat[(i + by + flat.length) % flat.length]);
  };

  return (
    <>
      <div role="group" aria-label="Show work by type" className="flex flex-wrap gap-2">
        {[{ id: null, heading: 'All work' }, ...groups].map((g) => {
          const active = only === g.id;
          return (
            <button
              key={g.id ?? 'all'}
              type="button"
              aria-pressed={active}
              onClick={() => setOnly(g.id)}
              className={`rounded-full border px-4 py-2 text-[0.95rem] font-bold ${
                active ? 'border-ink bg-ink text-stone' : 'border-ink/40 bg-paper text-ink hover:border-ink'
              }`}
            >
              {g.heading}
              {g.id && <span className="ml-1.5 font-normal opacity-75">{groups.find((x) => x.id === g.id)!.photos.length}</span>}
            </button>
          );
        })}
      </div>

      {shown.map((g) => (
        <section key={g.id} id={g.id} className="mt-10 scroll-mt-4">
          <h2 className="text-[1.6rem] sm:text-[2rem]">{g.heading}</h2>
          <div className="signrule" aria-hidden="true" />
          <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {g.photos.map((p) => (
              <li key={p.file}>
                <button
                  type="button"
                  onClick={() => view(p)}
                  className="group block w-full text-left"
                  aria-label={`View larger: ${p.caption}`}
                >
                  <span className="zoom block">
                    <Image
                      src={p.file}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      sizes="(min-width: 1024px) 380px, 50vw"
                      className="aspect-[4/3] h-auto w-full object-cover"
                    />
                  </span>
                  <span className="block pt-3 text-[0.85rem] text-slate">{p.caption}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <dialog
        ref={dialog}
        className="viewer"
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        aria-label={open?.caption ?? 'Photo'}
      >
        {open && (
          <figure className="overflow-hidden rounded-[2px] bg-ink-deep">
            <Image
              src={open.file}
              alt={open.alt}
              width={open.width}
              height={open.height}
              sizes="96vw"
              className="max-h-[78vh] w-auto object-contain"
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-3 p-3 text-stone">
              <span>
                <strong>{open.caption}.</strong> <span className="text-stone/80">{open.alt}</span>
              </span>
              <span className="flex gap-2">
                <button type="button" className="btn min-h-0 border border-stone/50 px-3 py-1.5" onClick={() => step(-1)}>
                  ‹ Previous
                </button>
                <button type="button" className="btn min-h-0 border border-stone/50 px-3 py-1.5" onClick={() => step(1)}>
                  Next ›
                </button>
                <button type="button" className="btn btn-accent min-h-0 px-3 py-1.5" onClick={() => dialog.current?.close()}>
                  Close
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
