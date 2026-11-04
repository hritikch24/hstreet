# High Street Shopfronts 

Website, enquiry handling and back office for High Street Shopfronts, a
Birmingham firm that fits aluminium shopfronts, roller shutters, automatic
doors and steel and aluminium doors anywhere in the UK, and repairs them in
the Birmingham area.

The site is **finished but hidden from search** (noindex) until the real
business details replace the placeholders. See the launch checklist below.

## Where things stand (paused 1 October 2026)

**Built and deployed, waiting for the owner's business details.** The site is live at https://hstreet.vercel.app but hidden from search engines and AI crawlers until every fact in `business/profile.ts` is real (see the launch checklist below). The owner is happy with the site; he asked for plain English and for prices to read as guides, both done.

Open items, in order:

1. **Rotate the Neon database password.** The connection string was shared in a chat. Reset it in Neon, then update `DATABASE_URL` in Vercel (Production, Sensitive) and in the local `.env.deploy-db`.
2. **Owner's details** for the launch checklist: phone, WhatsApp, address, hours, languages, prices, VAT, install cities, Google Business Profile, and town/month/summary for job photos.
3. **Upgrade the `team-rockstar` Vercel team to Pro** before launch. Hobby is for non-commercial use.
4. **Custom domain:** add `www.highstreetshopfronts.co.uk` in Vercel → Domains, with the bare domain redirecting to www.
5. **Optional keys:** `RESEND_API_KEY`, `ENQUIRY_EMAIL_FROM`, `ENQUIRY_EMAIL_TO` (enquiry emails) and `ANTHROPIC_API_KEY` (AI-drafted replies in `/hq`).
6. **Shopfront preview at `/see-it-on-your-shop`:** built, not linked anywhere, noindex. Before launching it, have the owner confirm the colours in `copy/front-options.ts`, then link to it and remove it from `NEVER_INDEX` in `engine/route-plan.ts`.
7. **Combined metrics dashboard:** High Street was added only in the local `~/Projects/shopfront-metrics` folder (not a git repo), so the deployed dashboard doesn't show it yet. It reads `https://www.highstreetshopfronts.co.uk`, so it also needs the domain from step 4.

Private local files, gitignored and readable only by your Mac user. Don't commit or share them:

- `.env.hq-secrets`: `HQ_KEY` (back-office login: open `/hq?key=<HQ_KEY>`), `HQ_STATS_TOKEN`, `INDEXNOW_KEY`
- `.env.deploy-db`: the production database URL

Problems noticed in the owner's other sites during this build are listed in `~/Projects/seo-plan/highstreet-handoff.md`, outside this repo, because this repo must never name them.

To pick this up again with Claude Code, open this folder and ask it to read `CLAUDE.md` and this README first.

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

## Hosting

- **Vercel:** project `hstreet` in the `team-rockstar` team, deployed from the private GitHub repo `hritikch24/hstreet`. Every push to `main` deploys to production. The team is on the Hobby plan, which is for non-commercial use: **upgrade to Pro before launch.**
- **Build:** the dashboard's Build Command is `npm run vercel-build`. Production builds run `prisma db push` (never with data loss); preview builds skip it and get no database, so test deploys can't touch real enquiries.
- **Database:** Neon Postgres, database `hstreet`, used by this site only.
- **Environment variables** are set in Vercel, Production only, as Sensitive: `DATABASE_URL`, `HQ_KEY`, `HQ_STATS_TOKEN`, `INDEXNOW_KEY`. Copies of the generated keys are in the gitignored `.env.hq-secrets` on the machine that set them up.

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
- [ ] Price ranges for every line of work. They are always shown as guide prices ("about £X to £Y", "This is a guide price; we confirm yours in writing"), so rough figures are fine, but they should be honest
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
- [ ] GA4, GTM, Google Ads conversion tag, only if wanted, and never one used by another site. For anything you don't use, write `confirmed('')`: the build accepts that as "none"
- [ ] If running Google Ads: the conversion actions for call taps, WhatsApp taps and enquiries (`tracking.adsConversions`), so Ads can see which clicks bring calls
- [ ] `googleReviewLink`: the "ask for a review" link from the Google Business Profile. It turns on the **Ask for a review** WhatsApp button in `/hq`
- [ ] IndexNow key, then `npm run indexnow` after launch

**Then**
- [ ] Update `copyReviewedOn` (and set `pricesCheckedOn`) in `business/profile.ts`
- [ ] Set `indexable: true`, build, run every check, deploy. This also opens robots.txt to AI answer engines, which are kept out until then.
- [ ] Submit the sitemap in Search Console; run `npm run indexnow`

## Getting calls after launch

The site can't bring traffic while it is hidden. In order of how quickly each one brings calls:

1. **Go live.** Fill in the launch checklist and set `indexable: true`. Until then Google won't show the site at all.
2. **Google Business Profile.** For "shutter repair near me" searches, the map results get most of the calls. Verify the profile with the same name, address and phone as the site, add the job photos, and post a job every week or two.
3. **Reviews.** After every finished job, use **Ask for a review** in `/hq`. Ten honest reviews make more difference to calls from the map than any page on the site.
4. **Google Ads for repairs** (optional, fastest). A small budget on "shutter repair Birmingham" and "shopfront glass Birmingham", limited to the repair radius, with call ads. Add the conversion actions above so you only pay for what brings calls.
5. **Directories, each with exactly the same name, address and phone:** Bing Places, Apple Business Connect, Yell, Thomson Local, and trade sites such as Checkatrade or TrustATrader if you join them.
6. **Real job write-ups.** For each job, give its town, month and a line on what was done (`copy/job-photos.ts`). They appear on `/our-work` and are what AI assistants and Google trust most.
7. **Local links:** suppliers' "find an installer" pages, local business groups and traders' associations on the shopping roads you cover.

Leads arrive by phone, WhatsApp, the quote form and the **Call me back** box. All of them show up in `/hq` (taps are counted; form leads are stored with the town and whether it's an install or a repair).

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
