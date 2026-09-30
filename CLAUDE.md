@AGENTS.md

# High Street Shopfronts: agent notes

Site for `highstreetshopfronts.co.uk`, a Birmingham shopfront and shutter
installer. **Installs are UK-wide; repairs are Birmingham-only.** Next.js 16
(App Router), TypeScript, Tailwind v4, Prisma 6 + Postgres, Vercel.

Human setup, env vars and the launch checklist are in `README.md`.

## Why this site exists and why it is built this way

The same owner runs four other shopfront sites, listed with their full
fingerprints in `~/Projects/seo-plan/portfolio-registry.json`. Three of them
came from one template, shared most of their wording and the same
`services × cities` URL matrix, and on 21 Aug 2026 Google delisted one of
them's 574 programmatic pages. Google grouped them on shared content,
templates and page patterns, not URL names alone.

This site was written from scratch to be a genuinely separate business in
code, copy, URLs, design, photos, tracking and structured data. The standing
rules are in `~/Projects/seo-plan/PORTFOLIO-RULES.md`; they win over anything
here.

## Hard rules

1. **Other sites are read-only.** Never edit, build or deploy another repo.
   Report problems instead. The only shared files this repo may touch are its
   own entries in `seo-plan/portfolio-registry.json` and
   `shopfront-metrics/sites.mjs`, and `seo-plan/check-portfolio.mjs`.
2. **Name no other site anywhere in this repo**, comments and docs included.
   `npm run check:contamination` pulls every other site's markers from the
   registry and their repos at run time and fails on any hit.
3. **Business facts live only in `business/profile.ts`.** Anything unconfirmed
   is wrapped in `unconfirmed(...)` (`isPlaceholder: true`). While any
   placeholder remains, `indexable` must stay `false`; `engine/go-live.ts`
   fails the build otherwise. JSON-LD and `llms.txt` only ever emit confirmed
   facts (`known()`).
4. **Metadata and JSON-LD only in `engine/search-meta.ts`.** Never hand-write
   `<meta>` or canonical tags. `pageMeta()` returns the full object because
   Next merges metadata shallowly, and adds the brand to a title only when
   the result fits in 60 characters. Keep page titles keyword-first and
   descriptions 70 to 160 characters; `check:sanity` enforces both. Every
   page gets a `pageNode()` (WebPage with `dateModified` from
   `profile.copyReviewedOn`: update that date when you revise copy).
5. **Never fabricate.** No ratings, review counts, years trading,
   accreditations, guarantees, project counts or named clients. `sameAs`
   holds only profiles someone has fetched and seen live.
6. **Photos are the firm's own, from `public/work` only.** Never stock, never
   from another repo. Never guess a job's town from signage. `town`,
   `completed` and `jobSummary` in `copy/job-photos.ts` stay placeholders until
   the owner fills them in; only then does a job become a case study.
   Don't name clients (visible shop signs) in copy, alt text or schema.
7. **No services × locations matrix.** Location pages are hand-written:
   - `/repairs/[area]`: the nine areas in `copy/repair-areas.ts`.
     **Areas we never publish:** Smethwick, the Black Country, Coventry. Other
     businesses in the portfolio are based there.
   - `/nationwide/[city]`: at most six, from `profile.installCities`, noindex
     while that list is unconfirmed. Add a city only with a finished job there.
   - UK-wide installs rank through the service pages and `/nationwide`.
8. **Repairs never outside the radius.** Copy, the form and the API all say
   so. `profile.repairRadiusMiles` is the one number.
9. **Keep it separate:** own URL scheme, API paths, table names, storage keys
   (`hss.*`), JSON-LD `@id`s (`#hss-*`), tracking IDs, IndexNow key, database.
   No links to or from other sites. No "website by" credit.
10. **Ask the owner before** adding any dependency beyond Next, React,
    Tailwind and Prisma; creating a GitHub repo or Vercel project; pushing;
    deploying.
11. British English, in the voice of someone who fits shutters. No filler.
    FAQ headings phrased the way a shop owner asks.

## Before saying anything works

```bash
npm run lint
DATABASE_URL="postgresql://u:p@localhost:5432/noop" npm run build
npm run check        # contamination, overlap, photos, sanity
node ~/Projects/seo-plan/check-portfolio.mjs
```

Then review pages at 1440×800 and 390×844 (`npx next start -p 3240`).
The checks need the other repos beside this one in `~/Projects` and Pillow for
the photo check. They are dev tools; they don't run on Vercel.

| Check | Fails when |
|---|---|
| `check:contamination` | any other site's brand, domain, phone, postcode, address, email, ads tag, asset path, storage key or IndexNow key appears in this repo |
| `check:overlap` | built pages share over 0.5% of 8-word sequences with any other repo, or any question heading appears elsewhere (currently 0.00%, 0 headings) |
| `check:photos` | a `public/work` photo is within 40 bits (dHash) of any image in another repo, or of another photo here |
| `check:sanity` | dead internal links, not exactly one self-canonical, duplicate or over-long titles and descriptions, sitemap ≠ indexable pages, robots.txt letting a crawler into `/hq` or `/api` (or letting AI crawlers in before launch), placeholder phone in JSON-LD |

## Map

| Area | Files |
|---|---|
| Business facts, prices, lead times, radius, tracking IDs | `business/profile.ts` |
| Page copy | `copy/services.ts` (8 service pages), `copy/repair-areas.ts`, `copy/install-cities.ts`, `copy/guides.ts`, `copy/pages.ts` (hubs and standing pages) |
| Job photos and their data | `public/work/*.jpg`, `copy/job-photos.ts`, prepared by `tools/prepare-photos.py` |
| SEO / GEO | `engine/search-meta.ts` (metadata, title fitting, every JSON-LD node), `engine/route-plan.ts` (every public path + `mayIndex`), `engine/go-live.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` |
| Public pages | `app/(public)/…`: `/`, `[service]` (the 8 flat service URLs), `nationwide`, `nationwide/[city]`, `repairs`, `repairs/[area]`, `our-work`, `prices`, `get-a-quote`, `guides/[slug]`, `the-firm`, `talk-to-us`, `privacy-notice` |
| Analytics | `ui/Beacon.tsx` → `/api/beacon`, `/api/beacon/tap`; `engine/visit-source.ts`, `engine/request-bits.ts` |
| Enquiries | `ui/QuoteForm.tsx` → `/api/enquiries` (+ `/api/enquiries/reach`); `engine/enquiry-shape.ts` (shared validation), `engine/coverage.ts` (postcodes.io + radius), `engine/mailer.ts` (Resend over fetch) |
| Back office | `app/hq/*`, `app/api/hq/*`; `proxy.ts` + `engine/hq-gate.ts` (key → cookie, 404 otherwise), `engine/hq-session.ts` (second check in every handler), `engine/stats.ts` (metrics JSON), `engine/reply-writer.ts` (Claude over fetch), `engine/paperwork.ts` |
| Database | `prisma/schema.prisma`: `visits`, `phone_taps`, `enquiries`, `enquiry_photos`, `reply_drafts`, `clients`, `paperwork` |
| Shopfront preview (`/see-it-on-your-shop`) | `ui/visualiser/Visualiser.tsx` (photo, corner handles, loupe, controls, send), `ui/visualiser/draw-front.ts` (draws the shopfront or shutter flat), `ui/visualiser/warp.ts` (homography + WebGL2 shader), `copy/front-options.ts` (colours and options the firm supplies; TODO owner confirms). Hands off to the quote form through `sessionStorage['hss.preview']`. |
| Checks and tools | `tools/check-*.{mjs,py}`, `tools/portfolio.mjs` (reads the registry), `tools/indexnow.mjs`, `tools/prepare-photos.py` |

## Design system: British shop signage

- **Type:** Alfa Slab One for headings and the fascia wordmark (a
  signwriter's slab); Public Sans for everything else: sturdy, very legible,
  and with a plain zero, so phone numbers and prices read cleanly. Loaded with
  `next/font` in `app/layout.tsx`.
- **Colour** (`app/shop.css`, `@theme`): enamel `navy` / `navy-deep` /
  `navy-soft`, `cream` / `cream-deep`, `plate` (off-white), `ink`, `slate`,
  `rule`; `signal` red for actions and emphasis; `wa` green only on WhatsApp
  buttons. Taken by other sites and never used here: dark with gold, cyan,
  violet, amber, bottle green with brick.
- **Pieces:** `Fascia` (header painted like a fascia board with lining, native
  `<details>` menu on mobile), `Stallriser` (footer on a tiled plinth),
  `.plate` (enamel-sign panel with inner line) used by `Opening` for the
  answer-first block and key figures, `Questions` (question headings with a
  red rule), `PhotoForQuote` (inline WhatsApp-a-photo ask in heroes, service
  pages and the quote page), `UkWide` / `RepairReach` (coverage bands),
  `WorkPhoto` (photo with a navy caption bar), `InstallCards` (photo cards
  with typical price), `CompareTable` (a table on wide screens, one card per
  option on phones), `PriceCard` (sticky "get a price" panel on service
  pages; its quote link prefills the form), `WorkGallery` (filter chips and a
  `<dialog>` viewer; every photo stays in the server HTML), `.signrule` under
  section headings, `Reviewed` (visible "page reviewed" date).
- **Home hero:** full-bleed job photo (unbranded) behind a navy gradient on
  desktop, photo above the text on phones.
- **Not used, on purpose:** floating WhatsApp or chat bubble, exit-intent
  popup, icon-grid "why choose us", "areas we cover" link walls, sticky
  mobile CTA bar.

## Next.js 16 notes (checked in `node_modules/next/dist/docs`)

- `proxy.ts` replaces `middleware.ts`; runs on Node.
- `params` and `searchParams` are Promises; use `PageProps<'/route'>`.
  Run `npx next typegen` after adding routes.
- `next/image`: `preload`, not `priority`.
- Pages that read the database call `connection()` or use request data, so
  they aren't prerendered at build time.
- Next renders the home canonical without a trailing slash, so
  `absolute('/')` is the bare origin.

## Decision log

- **2026-10-01 (shopfront preview):** `/see-it-on-your-shop` lets a customer
  mark the four corners of their opening on their own photo and see a new
  shopfront or shutter fitted into it, then send it with a quote request
  (preview + original photo + a one-line design summary). No AI, no
  dependencies, nothing uploaded unless they send it: a homography maps the
  flat drawing into the quad and a WebGL2 shader applies it. Deliberately a
  preview, not a drawing, and only shows options the firm supplies. Not
  linked from the site yet and noindex (`NEVER_INDEX` in
  `engine/route-plan.ts`) until the owner decides where it goes; to launch it,
  link it and remove it from that set.

- **2026-10-01 (second pass, SEO/GEO and UX):**
  - Body font changed to Public Sans: the previous face slashed its zeros,
    which made phone numbers look like "Ø121".
  - Before launch, robots.txt keeps the named AI crawlers out entirely. The
    noindex tag stops search engines, but answer-engine crawlers may not honour
    it and would learn placeholder phone numbers and prices. At launch they
    switch automatically to "public pages allowed, /hq and /api blocked".
  - Titles rewritten keyword-first to fit 60 characters; brand suffix only when
    it fits. WebPage, ImageGallery and logo structured data added;
    `llms-full.txt` publishes every answer as plain text; sitemap has
    `lastmod`; images served as AVIF/WebP.
  - Comparison tables (manual/electric, lath types, glass, exit devices,
    door types) because customers choose between options and answer engines
    quote tables.
  - Fewer bordered boxes; numbered runs and ruled lists instead.

- **2026-10-01:** Built from scratch.
  - URL scheme as suggested, plus `/aluminium-doors` (the photos show it) and
    `/lock-and-door-repairs`. Emergency callouts live on `/repairs#emergency`
    rather than a thin page of their own. One dynamic `[service]` route serves
    the eight flat URLs, with `dynamicParams = false`.
  - No new dependencies: email via Resend's HTTP API and AI drafts via the
    Claude Messages API, both with `fetch`; enquiry photos stored in Postgres
    (shrunk to ~1600px in the browser) instead of a storage service; Prisma 6
    because Prisma 7+ needs extra driver-adapter packages.
  - Repair radius measured straight-line from the base with postcodes.io (no
    key). Unknown places are accepted and flagged, not refused.
  - IPs stored as prefixes only (last IPv4 octet zeroed).
  - Sitemap is empty while the site is noindex; verified in a temporary
    launch-mode build that it lists 28 pages (35 minus 6 unconfirmed cities
    and the privacy notice) and passes the sanity check.
  - Photos: 45 of about 55 unique published. Left out: repeats; 23.18.10
    (same doors as 23.18.05, badly tilted); 23.18.14, 23.18.26 (4),
    23.18.27 (7), 23.18.27 (10), 23.18.28 (2) (faces or reflections of
    people); 23.18.27 (8) (near-repeat of (9)); 23.18.26 (6), 23.18.26 (8),
    23.18.29 (6) (repeat views of the same frontages). Cropped out: the phone
    number on 23.18.28 (3), a bin company's number on 23.17.53, bystanders on
    23.18.18. Blurred: an alarm company's number on 23.18.24 and 23.18.27.
    23.18.05 straightened.
