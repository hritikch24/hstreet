# High Street Shopfronts

Website, enquiry handling and back office for High Street Shopfronts, a
Birmingham firm that fits aluminium shopfronts, roller shutters, automatic
doors and steel and aluminium doors anywhere in the UK, and repairs them in
the Birmingham area.

The site is **finished but hidden from search** (noindex) until the real
business details replace the placeholders. See the launch checklist below.

## Run it locally

```bash
npm install
cp .env.example .env         # fill in what you have
npm run dev                  # http://localhost:3000
```

Without a database, the public pages still build and run:

```bash
DATABASE_URL="postgresql://u:p@localhost:5432/noop" npm run build
npx next start
```

With a database, create the tables once: `npm run db:push`.

## Environment variables

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Postgres for this site only (a new Neon or Vercel Postgres database). Never another site's. |
| `HQ_KEY` | Back-office key, 16+ random characters. Open `/hq?key=<HQ_KEY>` once per browser; after that a cookie keeps you in for 30 days. Without it `/hq` is a plain 404. |
| `HQ_STATS_TOKEN` | Token the combined metrics dashboard sends to `/api/hq/stats`. Different from `HQ_KEY`. |
| `RESEND_API_KEY`, `ENQUIRY_EMAIL_TO`, `ENQUIRY_EMAIL_FROM` | Email to the owner for each enquiry, via Resend. Optional: enquiries are always saved and shown in `/hq`. The sender must be a verified address on this domain. |
| `ANTHROPIC_API_KEY` | Turns on "Draft a reply" in `/hq`. Optional. |
| `INDEXNOW_KEY` | This site's own IndexNow key (32 hex characters), served at `/indexnow-key.txt`. |

## The back office (`/hq`)

- **Dashboard:** visitors, page views, enquiries (install and repair), call
  taps, WhatsApp taps, conversion, install and repair enquiries by region,
  top pages, where visits started, cities, recent enquiries.
- **Enquiries:** filter installs (UK-wide) from repairs (Birmingham), and by
  region. Each enquiry shows where it was located, the distance from base,
  any photos, and whether a repair fell outside the radius. Set a status,
  keep notes, add the customer to the client list, or ask for a drafted
  WhatsApp or email reply to edit and send yourself.
- **Clients**, and **quotes and invoices** you can print or save as PDF.

The combined dashboard in `~/Projects/shopfront-metrics` reads this site too:
put `HQ_STATS_TOKEN` in its `.env` as `HIGHSTREET_HQ_STATS_TOKEN`.

## Checks

Run these after any change, with the other shopfront repos beside this one in
`~/Projects`:

```bash
npm run lint
DATABASE_URL="postgresql://u:p@localhost:5432/noop" npm run build
npm run check                              # contamination, overlap, photos, sanity
node ~/Projects/seo-plan/check-portfolio.mjs
```

`check:photos` needs Pillow (`pip3 install pillow`).

## Launch checklist

Everything below lives in `business/profile.ts` unless it says otherwise.
Each placeholder is marked `unconfirmed(...)` with a note of what's needed.
The build refuses `indexable: true` until all of them are real.

**Business facts (must be unique to this business)**
- [ ] Owner's name and trade background; team names if they are happy to be named
- [ ] Phone number and WhatsApp number (the current ones are Ofcom example numbers)
- [ ] Email address (confirm `quotes@highstreetshopfronts.co.uk` exists, or give the real one)
- [ ] Full Birmingham address, exactly as it will be on Google
- [ ] Base location for the repair radius (the yard or unit), and the radius in miles
- [ ] Opening hours, emergency line hours, languages spoken
- [ ] Companies House number, and whether prices are plus VAT
- [ ] Google Business Profile link, once verified; any other profiles for `sameAs`, each opened and checked live

**Numbers the site quotes**
- [ ] Price ranges for every line of work
- [ ] Lead times, order to fitted
- [ ] Emergency and standard repair response times
- [ ] Which cities the fitting team really travels to (at most six to start)
- [ ] Read the process copy on `/nationwide` and each city page and correct anything that isn't how the firm works

**Photos and proof** (`copy/job-photos.ts`)
- [ ] For each job: town, month finished, and a line on what was done. That unlocks the case studies on `/our-work` and on city pages.
- [ ] If a customer agrees to be named, set `clientMayBeNamed: true` for their photos
- [ ] Confirm the photo of the pharmacy (it has a place name on its sign) can be used

**Accounts, each new and for this site only**
- [ ] Domain, Vercel project, Postgres database (ask before creating)
- [ ] Search Console and Bing Webmaster tokens
- [ ] GA4, GTM, Google Ads conversion tag, only if wanted, and never one used by another site
- [ ] IndexNow key, then `npm run indexnow` after launch

**Then**
- [ ] Update `copyReviewedOn` (and set `pricesCheckedOn`) in `business/profile.ts`
- [ ] Set `indexable: true`, build, run every check, deploy. This also opens robots.txt to AI answer engines, which are kept out until then.
- [ ] Submit the sitemap in Search Console; run `npm run indexnow`

## Google Business Profile: draft

Keep every detail identical to the website and to every directory listing,
and different from every other business the owner runs.

- **Name:** High Street Shopfronts
- **Primary category:** the closest to "shopfitter" or "shutter installer" in Google's list; add "door supplier" and "glazier" as secondary categories if they fit
- **Address:** the confirmed Birmingham address (hide it if customers don't visit, and set service areas instead)
- **Service areas:** Birmingham, Erdington, Sutton Coldfield, Alum Rock, Sparkhill, Small Heath, Handsworth, Solihull, Tamworth, Lichfield
- **Phone and website:** the confirmed number; `https://www.highstreetshopfronts.co.uk`
- **Description:**

  > Birmingham fitters of aluminium shopfronts, roller shutters and shop doors: new installations anywhere in the UK, repairs across Birmingham. We make and fit powder-coated aluminium shopfronts, manual and electric roller shutters, automatic sliding doors, steel security and fire-exit doors and aluminium doors for takeaways, corner shops, salons and other independent shops. For a price, WhatsApp us a photo of your shopfront. Shutter, door, lock and glass repairs and emergency callouts are for shops in Birmingham and nearby only.

- **Services:** aluminium shopfronts, roller shutters, automatic doors, steel security doors, fire-exit doors, aluminium doors, shutter repairs, shopfront glass replacement, lock and door repairs, emergency callouts
- **Photos:** the same job photos as the site, never ones used by another business
