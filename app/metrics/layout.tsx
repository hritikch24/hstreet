import type { Metadata } from 'next';

/**
 * No chrome here on purpose: the page draws its own header only after the key
 * has been checked, so a wrong or missing key shows the ordinary 404 page.
 */
export const metadata: Metadata = {
  title: { absolute: 'Metrics' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function MetricsLayout({ children }: LayoutProps<'/metrics'>) {
  return children;
}
