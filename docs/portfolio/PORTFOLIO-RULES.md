# Portfolio rules: running many client sites without them hurting each other

These rules apply to every site in `portfolio-registry.json` and to every new site. They exist because Google delisted Sigma's 574 city × service pages on 21 Aug 2026. Three sites shared about 84% of their phrasing and the same URL pattern (see `Urban-shopfronts-limited/CLAUDE.md`).

## 1. The golden rule: new work never touches existing sites
- Building a new site means **reading** the existing repos, never editing them.
- The only shared things a new build may change are **additive**:
  - adding its own entry to `portfolio-registry.json`
  - adding its own entry to `~/Projects/shopfront-metrics`, with defaults that keep the existing sites working exactly as before
  - adding its repo to the portfolio checks
- Any fix to an existing site is a separate, deliberate job for that site. Never do it on the side of a new build.

## 2. Each site must look like a genuinely separate business
Google and AI assistants both group sites that share fingerprints. None of the following may be shared between two sites:

| Area | What must be unique per site |
|---|---|
| Business facts | Phone, WhatsApp, email, address, owner name, company number |
| Code | Components, CSS, layout, file and folder structure. Write fresh; never copy and rename |
| URLs | Public URL scheme and page patterns, private admin paths, API paths, DB table names |
| Content | Wording (8-gram overlap near zero), blog and guide topics and slugs, FAQ questions |
| Media | Photos and videos (check with the photo-duplicate tool), logos, favicons |
| Design | Palette, fonts, section patterns (see the registry for what's taken) |
| Tracking | GA4 property, GTM container, Google Ads conversion tag, Search Console property, IndexNow key |
| Profiles | Google Business Profile, directory listings (each with its own real address) |
| Structured data | Its own `@id` scheme and only its own facts. `sameAs` lists only its own verified profiles |

**Never link sites to each other**: no footer links, no "partner" links, and no shared "website by …" credit linking to every site. If you want a credit, put it only on your own portfolio site, not on client sites.

## 3. SEO rules for every site
- **No programmatic matrices.** Never publish `services × locations`. Every location page is hand-written with real local detail, or it isn't published.
- **Launch hidden.** A site stays `noindex` until every business fact is real. The build must fail if indexing is on while placeholders remain.
- **Build SEO in one place.** Metadata and JSON-LD come from one module. Use one canonical per page. The sitemap lists only indexable pages.
- **Never fabricate.** No fake ratings, review counts, years trading, accreditations, project counts or clients. Every `sameAs` link is checked as live.
- **Keep private areas locked.** Admin and dashboard paths return 404 without a key, send `X-Robots-Tag: noindex, nofollow`, and are disallowed in robots.
- **Change carefully.** Make small, verifiable changes on live sites, and judge from daily Search Console data, not 28-day averages.
- **Backlinks are the real constraint** once content is unique. Build them per site: directories, trade bodies, local press, supplier and contractor case studies. Never build them across the portfolio.

## 4. GEO rules (showing up in ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews)
- **Clear, consistent business facts.** The name, address, phone, service area and one-line description are identical on the site, in the JSON-LD, on the Google Business Profile and in directories, and **different from every other site**. Shared facts make AI tools merge two businesses into one.
- **Answer first.** Each service page opens with a 2–3 sentence plain answer: what it is, who it's for, typical price range, typical lead time, and area covered. Follow with detail. AI tools quote concrete, specific sentences.
- **Real numbers.** Price ranges, lead times, response times, sizes and specs, all as true as the owner can confirm. Vague copy doesn't get cited.
- **Question-shaped sections.** Headings match how people ask, e.g. "How much does a roller shutter repair cost in Birmingham?", with a direct answer underneath. Add `FAQPage` markup only where the Q&A is visible on the page.
- **Named people and proof.** The owner's name and trade background, and real job write-ups with location, problem, fix and photos. These make the business a verifiable entity.
- **Crawler access.** Allow `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-SearchBot` and `Google-Extended` on public pages, and block them from private paths. Publish an `llms.txt` that summarises only this site's own facts and key pages.
- **Structured data:** `LocalBusiness` or `HomeAndConstructionBusiness`, a `Service` per service with an accurate `areaServed`, and `BreadcrumbList`. Use `Person` for the owner once the details are real.

## 5. Checks every site runs before launch and after every change
Keep the build tools per site, but run them against **every** repo in the registry:
1. **Contamination:** no other site's brand, domain, phone or address appears, including in comments.
2. **Overlap:** 8-gram phrase overlap of built pages against every other site, target near zero.
3. **Photo duplicates** against every other site.
4. **Sanity:** dead links, canonicals, duplicate titles and descriptions, sitemap matching the routes.

## 6. Known existing ties (don't fix during a new build)
Fix these as separate jobs when the owner decides:
- **Urban, Grewal and Sigma** share a code template, URL scheme, 11 identical blog slugs, and about 20 identical photos.
- **Urban and Sigma** use the same Google Ads conversion tag, `AW-16801337867`.
- **Grewal and Safe & Secure** share the address CV7 9FB. Safe & Secure also uses Grewal's phone as a placeholder, which is fine only while it stays noindex.

## 7. Starting a new site
1. Check the domain and name (WHOIS, Companies House, trademark search).
2. Agree the territory with the owner, to avoid head-to-head clashes with existing clients.
3. Copy `highstreet-agent-prompt.md` as a template and change the business section.
4. The build agent reads this file and the registry, builds, runs the checks against all sites, and adds its registry entry.
