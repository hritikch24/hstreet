'use client';

/**
 * First-party visit counting. Sends one small POST per page view to
 * /api/beacon, and one per call or WhatsApp tap to /api/beacon/tap.
 *
 * The visit id lives in sessionStorage, so it ends when the tab closes. A
 * visitor can switch counting off on /privacy-notice, which sets a flag in
 * localStorage that this component respects.
 */
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const VISIT_KEY = 'hss.visit';
export const OPT_OUT_KEY = 'hss.count-me-not';

function optedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

function visitId(): string {
  try {
    let id = sessionStorage.getItem(VISIT_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(VISIT_KEY, id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
}

function device(): string {
  const ua = navigator.userAgent;
  if (/iPad|Tablet|(Android(?!.*Mobile))/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|Android/i.test(ua)) return 'mobile';
  return 'desktop';
}

function browser(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Other';
}

function send(url: string, body: object) {
  const json = JSON.stringify(body);
  if (navigator.sendBeacon && navigator.sendBeacon(url, new Blob([json], { type: 'application/json' }))) return;
  fetch(url, { method: 'POST', body: json, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(
    () => {},
  );
}

function campaign() {
  const q = new URLSearchParams(location.search);
  return {
    utmSource: q.get('utm_source'),
    utmMedium: q.get('utm_medium'),
    utmCampaign: q.get('utm_campaign'),
    gclid: q.get('gclid'),
  };
}

/**
 * Reports a Google Ads conversion (call tap, WhatsApp tap or enquiry) when
 * this site's own Ads tag and conversion actions are configured. Does
 * nothing otherwise.
 */
export function conversion(kind: 'call' | 'whatsapp' | 'enquiry') {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; __hssAds?: Record<string, string> };
  const sendTo = w.__hssAds?.[kind];
  if (sendTo && typeof w.gtag === 'function' && !optedOut()) w.gtag('event', 'conversion', { send_to: sendTo });
}

export function Beacon() {
  const path = usePathname();

  useEffect(() => {
    if (optedOut()) return;
    send('/api/beacon', {
      path,
      referrer: document.referrer || null,
      ...campaign(),
      device: device(),
      browser: browser(),
      visit: visitId(),
    });
  }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[data-tap]') as HTMLAnchorElement | null;
      if (!a || optedOut()) return;
      if (a.dataset.tap === 'call' || a.dataset.tap === 'whatsapp') conversion(a.dataset.tap);
      send('/api/beacon/tap', {
        kind: a.dataset.tap,
        target: a.href,
        path: location.pathname,
        referrer: document.referrer || null,
        ...campaign(),
        device: device(),
        browser: browser(),
        visit: visitId(),
      });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
