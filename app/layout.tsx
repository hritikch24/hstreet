import { Hanken_Grotesk, Newsreader } from 'next/font/google';
import { rootMeta } from '@/engine/search-meta';
import { assertReadyForSearch } from '@/engine/go-live';
import './shop.css';

const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-serif-face',
  display: 'swap',
});
const body = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-body-face', display: 'swap' });

export const metadata = rootMeta();

export default function RootLayout({ children }: LayoutProps<'/'>) {
  // Fails the build if the site is set indexable while facts are placeholders.
  assertReadyForSearch();
  return (
    <html lang="en-GB" className={`${serif.variable} ${body.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
