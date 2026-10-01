# Session handoff — state as of 1 October 2026

Written for whoever picks this up next, agent or human. Read this before
touching any shopfront repo. The per-repo `CLAUDE.md` files carry site
specifics; this is the cross-cutting state, the open actions, and the things
already ruled out so they are not re-proposed.

---

## 1. BLOCKING — a spam update is rolling

**September 2026 spam update: began 24 September, roughly two weeks.**

**Do not deploy any shopfront site until the Google Search Status Dashboard
(https://status.search.google.com/) marks it complete.** Not a fixed date —
the dashboard. Changing content mid-rollout makes any movement
unattributable.

Drafting on a branch is fine. Pushing to `main` auto-deploys on Vercel, so
do not push.

Held behind this: Sigma's `site-url-config` branch, the Sigma city-page
rewrite, and the CLAUDE.md commits on all three original repos.

---

## 2. Urgent — Google Ads, Grewal

**The daily budget is at ₹250. The owner wants ₹550 and set it there himself;
an agent overrode it by mistake and could not restore it before the browser
failed.** Fix first:

Campaigns → `Grewal Shopfronts - Search Leads` → click the budget → `550` → Save.

Account 495-972-2943 (RajKumar), `er.hritik.24@gmail.com`.

### What was changed on 1 Oct

| Change | State |
|---|---|
| Max CPC bid limit ₹80 → ₹100 | done, verified |
| Daily budget | **wrong — ₹250, should be ₹550** |
| Pause 21 zero-impression keywords | **1 of 21 done**, 20 remain |
| Emergency repair ad group | **not built** |

### Why the max CPC was raised

₹80 was set earlier at the owner's explicit request after a single click cost
₹600 and returned nothing. It worked — avg CPC settled at ₹61 and nothing
approached ₹600 again. But Google's bid strategy report then read **"100% of
spend is limited by your max. bid limit"**, and the campaign was spending
₹104/day against a ₹500 budget. The cap had become the constraint on volume,
not on waste. Raising it to ₹100 took impressions from ~17/day to **86 in one
day**.

**Keep the bid strategy on "Maximise clicks".** Google actively recommends
switching to Maximise conversions — that strategy does not support a max CPC
cap at all, so switching silently removes the ceiling. The owner's hard
requirement is never to pay more than ₹100 for a click.

### The actual reason there are no leads

**One responsive search ad, Final URL = the bare domain (the homepage), serving
all 42 keywords** — including "emergency shutter repair near me". Someone
whose shutter has just failed lands on a general company page and bounces.

The competitor ranking for those terms, sandkshopfronts.co.uk, runs a
dedicated `/emergency-roller-shutter-repairs.html`.

"emergency shutter repair near me" converted at **₹154** — five times cheaper
than anything else in the account — on **8 impressions in a month**.

### The ad group to build (fully specced, never saved)

Ad groups → `+` → Standard.

```
Name:       Emergency Shutter Repair
Final URL:  https://www.grewalshopfrontandshutters.co.uk/services/shutter-repair

Keywords (phrase match):
  "emergency shutter repair near me"
  "emergency roller shutter repair"
  "roller shutter repairs"
  "roller shutter door repairs"
  "roller shutters repairs near me"
  "shutter repair near me"
  "24 hour shutter repair"

Headlines — Google auto-fills generic shopfront ones
("Motorised Shutters Made Easy", "Need a Glass Shop Front?").
DELETE THOSE or the ad is useless for emergency intent:
  Emergency Shutter Repair
  Shutter Stuck? Call Us Now
  24/7 Roller Shutter Repair
  Roller Shutter Door Repair
  Same Day Shutter Repairs
  Birmingham & West Midlands
  Shutter Repairs Near You
  Call Us — Day Or Night
  Trading Since 2004
  Free Quote, Fast Response

Descriptions:
  Shutter jammed or won't close? We cover Birmingham and the West Midlands,
  day or night. Call now for a free quote.
  Roller shutter repairs by CSCS-carded engineers. Trading since 2004. We
  secure your premises fast.
```

Every claim is already on the site — "24/7 … day or night" is lifted from the
emergency callout service copy, 2004 is the `foundingDate` in schema. **Nothing
invented.** If the owner supplies a real response time ("within 2 hours"), that
converts far harder than "24/7" — he was asked three times and has not given
one, so do not put a number on it.

The phone asset `07597 630000` is attached at campaign level, so the call
button appears automatically. For emergency intent most conversions are calls,
not form fills.

### After building it

The repair keywords also sit in Ad group 1. Pause them there or the two ad
groups compete in the same auction.

### Practical warning

**The Google Ads web UI hung or disconnected roughly fifteen times during this
session** — screenshots timing out, the Edit menu not opening, the rows-per-page
control not persisting, a wizard lost to a browser restart. A fresh tab buys
about five to ten actions before it wedges again.

**Use Google Ads Editor (free desktop app) for anything bulk.** Paste keywords
and headlines offline, build the ad group, then Post. Ten minutes versus an
evening.

---

## 3. What has been ruled out — do not re-propose

### The city URL restructure

A detailed plan existed to move Grewal and Sigma's city URLs
(`/areas/{city}` → `/locations/{city}` etc.), ~615 URLs on Grewal. **Dropped.**

Evidence (`gsc-review.md`):

- **Zero pages in any duplicate bucket** on Urban, Sigma or Grewal. Grewal's
  41 "Duplicate without user-selected canonical" are legacy `.php` URLs from
  the old site, not city pages.
- The three sites' **top-10 queries share exactly one term** ("shopfronts").
  Grewal surfaces for Wolverhampton/Acocks Green/Quinton, Urban for London.
  They are not cannibalising each other.
- Sigma and Urban both surface for the same cities simultaneously (Cardiff:
  592 impressions vs 1,417). If Google were folding one into the other, one
  would be near zero.
- **A 301 carries the algorithmic assessment with it.** Moving a URL does not
  reset Google's view; only changing the content does.

The problem is position (26 / 32 / 52), not suppression.

### Changing the URL shape to avoid "copying" competitors

Competitor check:

| Site | Pattern |
|---|---|
| shopfrontsbirmingham.co.uk | `/services/{service}` — identical to ours |
| sandkshopfronts.co.uk | flat `.html`, keyword-in-filename |
| shopfrontcompany.co.uk | `/near-me/{county}/` — ~48 counties |

`/services/{service}` is the industry-standard pattern. Nothing to change.
What no competitor does is a 574-page city x service cross-product.

### Blanket-noindexing Urban's city x service pages

They produce **239 clicks, 37% of Urban's total**. Only 19 of 574 have never
had an impression. Copying Sigma's retirement here would cost a third of the
portfolio's best site. See `city-service-buckets.md`.

---

## 4. The August delisting — cause confirmed

**Google's August 2026 spam update completed 21 August 2026**, the same day
Sigma's cross-product was delisted. It targeted **scaled content abuse**:
programmatic pages, AI-generated pages at scale, pages built mainly to rank.

574 templated city x service pages with 84% shared phrasing across three
domains is a textbook match. This is no longer inference from a traffic shape.

**Grewal and Urban each still carry 574 of the same pages.** They were not hit
in August. The exposure is real, not theoretical — and Urban carries it on the
site producing more clicks than the other two combined.

---

## 5. Per-site state

### Sigma — `~/Projects/sigmashopfronts`

- **Branch `site-url-config`, committed, NOT pushed.** 151 hardcoded origins
  across 37 files replaced with `SITE_URL` from `lib/site.ts`.
- Planned move to **sigmashopfrontshutters.co.uk** (same paths). See section 6.
- `INDEX_SERVICE_CITY_PAGES = false` — the retirement, working. 190 pages
  correctly under "Excluded by noindex", up from 90. **Do not flip it back.**
- City-page content rewrite is the next real work, held behind the spam update.
- **Still needed from the owner before that rewrite:** typical local repair
  response time, repair radius from Oldbury, three or four real completed jobs
  (town, shop type, what was installed, month/year), and the Google Business
  Profile URL. Asked repeatedly, never supplied. **Do not invent these.**
- **Boots framework (H&J Martin Fit Out, Belfast):** SOR draft at
  `~/Desktop/Sigma-Boots-SOR-Rates.csv`, 42 line items, awaiting Sigma
  commercial sign-off. Open question is whether the framework's PI £10m /
  PL £20m / EL £10m limits flow down to subcontractors or bind only the primary
  contractor. EL £10m is standard; PI £10m is far above normal for an installer
  and is the real gate.

### Grewal — `~/Projects/grewal-shopfronts`

- GSC property holds **no data before 13 August 2026** (verification date; GSC
  never backfills). The August drop cannot be assessed and that history is
  unrecoverable. 56 clicks in six weeks is genuinely all the property holds.
- If the owner reports better traffic than that, it is most likely **Google
  Business Profile calls**, not the website. Worth checking GBP → Performance.
- 41 legacy `.php` URLs: all already 308 to the right pages. Validation
  submitted in GSC 28 September.
- **Do not retire Grewal's 574 city x service pages without being asked.**
  Owner: *"I am getting good traffic on grewal so I won't mind leaving it as it
  is rather than getting it fucked up."*

### Urban — `~/Projects/Urban-shopfronts-limited`

- Best performer (position 26.2, 647 clicks / 113k impressions over 12 months).
  Treat as the survivor; change conservatively.
- `aluminium-partitions` and `glass-partitions` added as **hub-only** services
  via the `cityPages: false` flag. Every consumer of the service x city matrix
  must read `cityPageServices`, not `services`.
- 37% of clicks come from city x service pages. Do not prune.

### Safe & Secure — `~/Projects/safe-and-secure-shopfront-shutters`

Fourth site, built clean of the shared template. Live with placeholder
contacts, kept `noindex`. See its own CLAUDE.md.

### High Street — `~/Projects/highstreet-shopfronts`

Fifth site, `highstreetshopfronts.co.uk`. Installs UK-wide, repairs
Birmingham-only. See its own CLAUDE.md and `highstreet-handoff.md`.

---

## 6. Sigma's domain move — the strategy, not just the mechanism

The owner intends to consolidate onto **sigmashopfrontshutters.co.uk** and
sunset `sigmashopfronts.com`. His reasoning, in his words: `.co.uk` is native
to the UK, and the current `.co.uk` runs on a template that will not help SEO,
so the Next.js build should move onto it.

The `.co.uk` is controlled by a different team, and part of the point of the
analysis was to give him a concrete argument for taking it over.

**Running both domains in parallel is the thing to avoid.** Two domains serving
the same business, same content, same contact email is the clearest possible
duplicate signal — and this portfolio has already lost 574 pages to a
duplicate-content enforcement pass. One domain, with a path-preserving 301 from
the other. Not both.

**To execute, once the spam update has finished:**

1. Push the `site-url-config` branch.
2. Set `NEXT_PUBLIC_SITE_URL=https://sigmashopfrontshutters.co.uk` in Vercel.
3. Add the domain in Vercel and point DNS.
4. Add a **path-preserving 301** from every `sigmashopfronts.com` path to the
   same path on the new domain. Never redirect everything to the homepage.
5. Add the new domain as a GSC property and use the Change of Address tool.
6. Keep the 301s permanently. Do not let the `.com` serve content again.

Expect a few weeks of fluctuation. If the city-page rewrite is also planned,
consider doing both in one move rather than two separate disruptions.

---

## 7. Standing rules from the owner

Verbatim where it matters:

- *"Make sure to work one by one on things and not to mix things in one site
  for other all three are different"*
- *"make sure you don't mess logos for sites"*
- *"Make sure not to mix anything anywhere, be strict on this while acting as
  SEO expert"*
- *"I don't want to compete among mines, i wanna compete with others"*
- *"For now i am getting good trffic on grewal so i won't mind leaving it as it
  is rather then getting it fucked up"*
- *"If you think we shouldn't make changes daily don't make them."*
- Never discuss funding.

Enforced in code by `tests/contamination.test.mjs` in each repo. A sibling
brand name in a **code comment** has failed this test before and required a
follow-up push.

Standing refusals to maintain: no race-based pricing (Equality Act 2010), no
image re-encoding to defeat hash matching, no fabricated `aggregateRating`, no
blanket `X-Robots-Tag`, no header-level canonical, never submit a Google Ads
appeal unilaterally, never enter credentials.

---

## 8. Running ads across several sites — policy risk

The owner wants ads on all the shopfront sites. **Google's unfair-advantage
policy treats affiliated advertisers competing in the same auction as double
serving, and suspends accounts for it.** Several sites owned by one operator,
bidding the same keywords in the same geography, is exactly the pattern.

Mitigation, which the owner already instinctively asked for: genuinely
different keyword sets, different service focus, different geographic targeting
per site. Not three variations of one campaign.

Planned split: Grewal = England-wide installs plus repairs within 100 miles of
Birmingham; Sigma = repairs within 50 miles of Birmingham, jobs UK-wide.

---

## 9. The real constraint, unchanged

**Six external backlinks across eight domains, none editorial.** GitHub
references and SEO-tool scan pages are artefacts; Yell and Ezilon are
directories.

No amount of template work, URL restructuring or page generation moves this.
It is business development: trade directories, supplier and manufacturer sites,
local press, accreditation bodies, chambers of commerce, and main contractors
linking from project case studies. The Boots framework, if it lands, is exactly
that kind of opportunity.

Social profiles do not help here — Instagram, X and Pinterest all `nofollow`
outbound profile links. They were added to each site's `sameAs` for **entity
consolidation**, not link equity.

---

## 10. Supporting documents

| File | What it holds |
|---|---|
| `gsc-review.md` | Full Search Console review, all three properties |
| `city-service-buckets.md` | Urban/Grewal city x service traffic bucketing |
| `grewal-ads-review.md` | Google Ads audit and every change made |
| `portfolio-registry.json` | Fingerprint of every site — the authority |
| `PORTFOLIO-RULES.md` | Rules governing additions to the portfolio |
| `check-portfolio.mjs` | Cross-portfolio consistency checker |
| `highstreet-handoff.md` | High Street site handoff |
