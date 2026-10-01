import Script from 'next/script';
import { known, profile, trackingId } from '@/business/profile';

/**
 * Third-party tags, each emitted only once its ID in business/profile.ts is
 * real. Every ID belongs to this site alone: never reuse a GA4 property, GTM
 * container or Google Ads tag from another business.
 */
export function Tags() {
  const ga4 = trackingId(profile.tracking.ga4);
  const ads = trackingId(profile.tracking.googleAdsTag);
  const gtm = trackingId(profile.tracking.gtm);
  const gtagIds = [ga4, ads].filter(Boolean) as string[];
  const conversions = known(profile.tracking.adsConversions);
  const sendTo = ads && conversions ? Object.fromEntries(Object.entries(conversions).filter(([, v]) => v)) : {};
  return (
    <>
      {gtagIds.length > 0 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`} strategy="afterInteractive" />
          <Script id="hss-gtag" strategy="afterInteractive">
            {`window.__hssAds=${JSON.stringify(sendTo)};window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${gtagIds
              .map((id) => `gtag('config','${id}');`)
              .join('')}`}
          </Script>
        </>
      )}
      {gtm && (
        <Script id="hss-gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}
    </>
  );
}
