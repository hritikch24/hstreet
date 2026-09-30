import { Alfa_Slab_One, Atkinson_Hyperlegible_Next } from 'next/font/google';
import { rootMeta } from '@/engine/search-meta';
import { assertReadyForSearch } from '@/engine/go-live';
import './shop.css';

const alfa = Alfa_Slab_One({ weight: '400', subsets: ['latin'], variable: '--font-alfa', display: 'swap' });
const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  variable: '--font-atkinson',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata = rootMeta();

export default function RootLayout({ children }: LayoutProps<'/'>) {
  // Fails the build if the site is set indexable while facts are placeholders.
  assertReadyForSearch();
  return (
    <html lang="en-GB" className={`${alfa.variable} ${atkinson.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
