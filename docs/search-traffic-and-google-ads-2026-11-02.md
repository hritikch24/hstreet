# Search traffic investigation and future Google Ads handoff

Reviewed 2 November 2026. User asked why clicks are absent, whether misspelled searches are covered, and for the code context to be retained for a future Google Ads request. No campaign launch, budget or account changes were requested. This review changed documentation only; existing worktree edits belong to earlier work and were preserved.

## Authenticated browser follow-up — 2 November

The user asked to try their existing logged-in browser. macOS AppleScript/JXA can read and operate Chrome tabs without a CDP connection. This worked; the earlier statement that browser access was unavailable was too broad. Use Chrome's scripting interface first in a future session if browser tools/CDP are absent. The original user tab was preserved; review used separate tabs. API credentials are still absent, but are not required for this manual browser review.

Authenticated property: `sc-domain:highstreetshopfronts.co.uk`. Read-only findings supersede the earlier access limitations below:

- Unfiltered Web performance report, selected range **3 months**, displayed chart data from **11 October to 31 October 2026**, last updated **3.5 hours ago**: **0 clicks, 3 impressions, 0% CTR, average position 49.3**. Only the homepage appears in the page breakdown (3 impressions). The only disclosed query is `shop front door repairs birmingham` (2 impressions, 0 clicks); its filtered position is 73.5. The third impression has no disclosed query in the table; do not invent its term or count it as a typo search.
- The original open user tab was filtered to that query and the homepage. Its two impressions were not whole-property totals. The audit used a separate report with those filters removed.
- Sitemaps: the canonical sitemap was submitted **29 October**, last read **29 October**, status **Success**, **41 discovered pages**. The live sitemap now lists 42 URLs. Successful sitemap processing is confirmed; submission is no longer an open task.
- Page indexing summary: **0 indexed, 4 excluded by noindex**, but last updated **23 October**, before the 26 October launch. This is stale and must not be presented as the current index count.
- Homepage URL Inspection: **URL is on Google**, **Page is indexed**, last crawl **29 October 2026 at 22:47:50**, Googlebot smartphone, crawl allowed, successful fetch, indexing allowed. User canonical is the homepage and Google-selected canonical is the inspected URL. The timezone was not identified by the UI and is not assumed here.
- `/aluminium-shopfronts` URL Inspection: **URL is on Google**, **Page is indexed**, HTTPS and one valid breadcrumb item.
- `/shutter-repairs` URL Inspection: **URL is not on Google**, **Discovered – currently not indexed**. Sitemap discovery is recorded, no referring page is reported, last crawl is **N/A**. This is not a current noindex finding: Google has discovered it but has no reported crawl. Live HTTP checks already confirm it returns 200 with indexing allowed.
- `/repairs/solihull` URL Inspection: also **Discovered – currently not indexed**, discovered through the sitemap, last crawl **N/A**.

The better-supported diagnosis is **incomplete indexing plus extremely low visibility for the pages already indexed**, rather than missing typo keywords. The important repair landing page cannot currently earn Google search clicks while unindexed. Three property impressions are too few to diagnose a bad title or meaningful CTR issue. Do not call this a penalty or claim that every service page has the same inspection status.

Keep the canonical sitemap and useful internal links. Prioritise the discovered-but-unindexed repair page for a live inspection and an indexing request as appropriate in the next SEO action, then monitor crawl/index changes and query impressions. A request would not guarantee indexing. No Request Indexing, sitemap resubmission, validation workflow or other search-engine write was performed during this browser review. Structured browser evidence is retained in `search-console-browser-2026-11-02.json`.

## Measured traffic

Read-only production `/api/hq/stats` responses, fetched at approximately 06:22 UTC using the existing Project Hub adapter and its server-side Bearer credential. No credentials or individual visitor/enquiry records are reproduced here.

| Metric | Last 7 days (since 26 Oct, about 06:22 UTC) | Last 30 days (since 3 Oct, about 06:22 UTC) |
| --- | ---: | ---: |
| Recorded page views | 27 | 186 |
| Recorded tab sessions | 26 | 170 |
| Direct page views | 20 | 173 |
| Facebook / Instagram page views | 7 | 7 |
| Google-search-attributed page views | 0 | 4 |
| Enquiries | 0 | 0 |
| Call-link taps | 0 | 1 |
| WhatsApp-link taps | 0 | 0 |

The four Google-attributed views in the 30-day report represent one Google-attributed landing session. They are not four verified Search Console clicks. In the seven-day report 26 views are on `/` and one is on `/get-a-quote`; no recorded service-page traffic in that window. Sessions are tab identifiers, not independently identified people. Direct traffic can include the owner, tests, stripped referrers or automation; it cannot all be labelled prospective customers. These are first-party measurements, not Search Console impressions, positions or CTR.

`4097316` (26 October) made confirmed business details indexable. This provides only about a week of search eligibility at review time; the exact first Google crawl/index date is unknown. The previous README/handoff still describe pre-launch noindex state and must not override the live evidence or current profile.

## Live technical evidence

- Homepage, `/aluminium-shopfronts`, `/shutter-repairs` and `/guides` return HTTP 200 with `index, follow`, one canonical using the intended HTTPS www host, and one H1. The homepage has no blocking X-Robots-Tag.
- `/robots.txt` allows public crawling and declares the canonical sitemap; `/hq` and `/api/` are disallowed.
- `/sitemap.xml` returns 200 and lists 42 URLs. An accessible sitemap does not establish submission, indexing or ranking.
- Full read-only crawl: all 42 sitemap pages returned 200, allowed indexing, had one H1 and exactly one expected self-canonical. `/nationwide/sheffield` initially timed out and passed on retry. Initial results and the retry are retained in `search-crawl-2026-11-02.json`. Shared navigation/footer vocabulary is included in the raw term counts, so those counts are not a measure of main-content relevance or keyword demand.
- An invented URL returns 404.
- Current live `/guides` exists, so the earlier 29 October report's pending guide-index deployment has happened. Do not repeat that stale recommendation.
- Google Business Profile URL, `sameAs` and review link are empty in `business/profile.ts`. No live Business Profile ownership/status check was possible; an empty config does not prove no profile exists externally.
- Main service content already covers aluminium shopfronts, roller shutters, automatic doors, doors/locks, shopfront glass, emergency board-up and servicing. Dedicated repair pages and repair-area pages exist. The untracked `copy/more-guides.ts` is not imported by `copy/guides.ts`; those drafts are not evidence of live keyword coverage.

## What can and cannot explain the missing clicks

Confirmed: almost no measured Google search acquisition, and none in the last seven days. This makes acquisition the first thing to investigate; the sample does not establish that the form or sales copy causes the lack of enquiries. Recent indexing eligibility and no configured Business Profile are plausible constraints. Backlinks, actual indexed-page counts and current rankings were not measured; do not assert a penalty, suppression or an authority problem as proven.

The existing read-only CLI is `~/Projects/marketing/tools/gsc.py`. Running `sites` failed because `~/.config/marketing-mcp/google-search-console.json` does not exist. The project's DNS verification comment is not authenticated Search Console access. Historical `docs/portfolio/gsc-review.md` does not contain current data for this site.

Next evidence required from this site's Search Console property:

1. Identify the exact returned property ID; do not assume an account has access merely because the code says DNS-verified.
2. Read sitemap status and URL Inspection for the homepage, aluminium page, shutter-repairs page and a repair-area page. Check crawl date, indexing verdict, robots state and Google-selected canonical.
3. Read clicks, impressions, CTR and average position by date, query, page, UK country and device from launch onward. Record the actual data interval and reporting lag.
4. If URLs are unindexed, investigate the specific exclusion reason before changing copy. If impressions exist at low positions, prioritise relevant business evidence and visibility. If strong positions have impressions without clicks, inspect the actual search snippet and intent. Do not change all titles without those distinctions.
5. Confirm whether a genuine service-area Business Profile exists. If one is created later, use truthful details and the actual service area; do not present the registered office as a customer-facing location. Real job records and reviews can support trust; never invent them.

## Misspellings and longer search phrases

No deliberate typo keyword bank or meta-keywords system was found. That is not a technical SEO defect. Google Search recognises spelling corrections and synonyms; adding every typo does not guarantee first position. Google ignores the keywords meta tag. Keep correct, natural British English and cover the customer's need, including longer phrases, on the relevant existing page.

Examples to map and check against actual Search Console queries, not measured volumes:

| Search need / natural variants | Existing destination |
| --- | --- |
| aluminium shopfront fitters, shop front installation, new shopfront quote | `/aluminium-shopfronts` |
| shop roller shutters, electric shutters, roller shutter installation | `/roller-shutters` |
| emergency roller shutter repair, jammed shutter, shutter repairs Birmingham | `/shutter-repairs` |
| broken shop window, shopfront glass replacement | `/shopfront-glass` |
| emergency shop boarding up | `/emergency-board-up` |
| automatic shop door repairs | `/automatic-door-repairs` |
| shopfront cost, shutter fitting prices | `/prices` and the corresponding service page |

Potential spelling variants include `shopfron`, `shopfrunts`, `shop fronts`, `alumnium`, `aluminum`, `roler shutters` and `shuter repairs`. These are examples only, not proven demand or proposed visible copy. Google Ads keyword close variants include misspellings by default, including for exact and phrase match. A large hand-written typo list is usually unnecessary. Review actual search terms when a campaign exists, and distinguish legitimate alternate wording from errors. No service-by-city or typo-page matrix should be created.

Official references:

- [Google Search query meaning, spelling and synonyms](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/)
- [Google-supported meta tags: keywords has no indexing/ranking effect](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [Google Ads close variants](https://support.google.com/google-ads/answer/9342105?hl=en)

## Code map for the future Google Ads implementation

Stack: Next.js 16.3.8 App Router, React 19, TypeScript, Tailwind 4, Prisma 6/Postgres, Vercel. Follow `AGENTS.md`, installed Next.js docs, `CLAUDE.md` and the portfolio rules before implementation. Hosting project `hstreet`; private source repository is recorded in `CLAUDE.md`. Pushing main deploys production. No push or deployment was performed for this investigation.

| Responsibility | Implementation |
| --- | --- |
| Confirmed business details and tracking configuration | `business/profile.ts` |
| Public layout mounting tracking | `app/(public)/layout.tsx` renders `Beacon` and `Tags` |
| Conditional Google tag / GA4 / GTM loading | `ui/Tags.tsx`, `next/script` afterInteractive |
| Call, WhatsApp and enquiry conversion dispatcher | `ui/Beacon.tsx`, `conversion(kind)` |
| Call/WhatsApp detection | Delegated click listener on `a[data-tap]`; `ui/reach.tsx` supplies links |
| Successful quote conversion | `ui/QuoteForm.tsx`, after API returns `body.ok` |
| Successful callback conversion | `ui/CallbackBox.tsx`, after the same API returns `body.ok` |
| Saved enquiries and source lookup | `app/api/enquiries/route.ts`, first stored visit for the tab identifier |
| Form rules / area eligibility | `engine/enquiry-shape.ts`, `engine/coverage.ts` |
| Visit and tap storage | `/api/beacon`, `/api/beacon/tap`, `prisma/schema.prisma` |
| Reporting and attribution categories | `engine/stats.ts`, `engine/visit-source.ts` |
| Canonicals, metadata and JSON-LD | `engine/search-meta.ts` only |

Current `profile.tracking.ga4`, `gtm`, `googleAdsTag` and all three `adsConversions` values are empty. This means the configured source emits no Google Ads tag or conversion calls today; it does not prove whether a separate Ads account/campaign exists. Ads implementation is partly scaffolded, not tested or launch-ready.

Confirmed business constraints: Birmingham base, new installations UK-wide, repairs within 70 miles. Phone/WhatsApp `07376 440039`; hours 24/7. No guaranteed arrival time. Never advertise unconfirmed garage-door services. No budget, maximum CPC, target account, conversion IDs or campaign approval for this site was supplied in this request. Do not inherit these from historical notes about other businesses.

### Work to finish when Ads is requested

1. Confirm this site's own account and conversion actions, budget, geography and campaign intent. Fill its own `AW-...` ID and `AW-.../label` conversion destinations; do not copy another property's tags.
2. Implement the chosen consent behaviour before activating advertising storage. `CountingSwitch` is an analytics opt-out, not an Ads consent manager. Current `Tags` would load configured Google scripts immediately; privacy copy explicitly says advertising cookies will be added only after asking. Review consent defaults, updates and the applicable Google Ads requirements at implementation time.
3. Choose direct gtag or GTM ownership to avoid duplicate tags and conversion fires. Current code permits both and does not enforce a single owner.
4. Validate the tag loading race: `window.__hssAds` is initialised afterInteractive and the dispatcher drops events if mapping/gtag is unavailable. Test early clicks and navigation.
5. Use a durable enquiry reference for conversion deduplication. The main API returns `ref`; callback code currently ignores it. Both forms fire on any `ok` response, including the honeypot fake-success response (`HS-000000-OK`). Avoid counting spam as a lead.
6. Treat call/WhatsApp taps as contact-intent signals; a tap does not prove a connected call, WhatsApp conversation or qualified lead. Configure primary/secondary actions deliberately. Validate actual call reporting separately if requested.
7. Preserve paid attribution across navigation and conversion. `Beacon.campaign()` reads only the current URL. Visit rows store `gclid`; tap rows and enquiry rows do not directly store it. Enquiries derive a source/landing page from the first visit and store a tab identifier. There is no `gbraid`/`wbraid` support, dedicated persistent click-ID capture or offline qualified-lead import. Assess the needed scope before extending the schema.
8. Verify a real enquiry save, callback save, failed validation, area rejection, opt-out/consent choices and conversion deduplication using safe test arrangements. This review sent no forms, call taps, WhatsApp taps or test beacons to production.
9. Separate installation and repair targeting. Map each ad group to its matching service page, particularly urgent repairs to `/shutter-repairs`; do not send every keyword to the homepage. Repairs must respect the 70-mile limit. Use correct ad text and close variants; use search-term evidence for negatives.
10. Read current release instructions and inspect existing uncommitted changes before release. Run relevant lint/build/checks and desktop/mobile validation once implementation exists. The earlier audit records existing contamination-check failures; do not claim those passed or suppress evidence to hide them.

No live website, database schema, account, campaign, tag ID or spend was changed by this review.
