import { Beacon } from '@/ui/Beacon';
import { SiteHeader } from '@/ui/SiteHeader';
import { SiteFooter } from '@/ui/SiteFooter';
import { Tags } from '@/ui/Tags';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#page" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-paper focus:p-2">
        Skip to the page
      </a>
      <SiteHeader />
      <main id="page">{children}</main>
      <SiteFooter />
      <Beacon />
      <Tags />
    </>
  );
}
