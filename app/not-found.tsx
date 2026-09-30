import Link from 'next/link';
import { Fascia } from '@/ui/Fascia';
import { Stallriser } from '@/ui/Stallriser';

export default function NotFound() {
  return (
    <>
      <Fascia />
      <main className="shell py-16">
        <p className="kicker text-signal">Page not found</p>
        <h1 className="mt-3 text-[2rem] sm:text-[2.6rem]">That page isn’t here</h1>
        <p className="mt-4 max-w-[60ch]">
          The link may be old or mistyped. Everything we do is on the pages below.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          <li>
            <Link href="/" className="btn btn-plain">Home</Link>
          </li>
          <li>
            <Link href="/repairs" className="btn btn-plain">Repairs in Birmingham</Link>
          </li>
          <li>
            <Link href="/get-a-quote" className="btn btn-signal">Get a quote</Link>
          </li>
        </ul>
      </main>
      <Stallriser />
    </>
  );
}
