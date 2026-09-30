import { Beacon } from '@/ui/Beacon';
import { Fascia } from '@/ui/Fascia';
import { Stallriser } from '@/ui/Stallriser';
import { Tags } from '@/ui/Tags';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#page" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-plate focus:p-2">
        Skip to the page
      </a>
      <Fascia />
      <main id="page">{children}</main>
      <Stallriser />
      <Beacon />
      <Tags />
    </>
  );
}
