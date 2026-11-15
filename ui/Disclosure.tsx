'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * A native <details> menu that also closes when you follow a link, press
 * Escape or click elsewhere. The header persists across navigations, so a
 * plain <details> would otherwise stay open on the next page. Works without
 * script as an ordinary click-to-open disclosure.
 */
export function Disclosure({
  label,
  summaryClassName,
  className = '',
  children,
}: {
  label: React.ReactNode;
  summaryClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && el.open) {
        el.open = false;
        el.querySelector('summary')?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false;
    };
    // Following a link to the page you are already on does not change the
    // path, so close on the activation itself.
    const onInside = (e: MouseEvent) => {
      if (el.open && (e.target as Element).closest('a')) el.open = false;
    };
    const onFocusOut = (e: FocusEvent) => {
      const to = e.relatedTarget as Node | null;
      if (el.open && to && !el.contains(to)) el.open = false;
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    el.addEventListener('click', onInside);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      el.removeEventListener('click', onInside);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <details ref={ref} className={className}>
      <summary className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${summaryClassName ?? ''}`}>
        {label}
      </summary>
      {children}
    </details>
  );
}
