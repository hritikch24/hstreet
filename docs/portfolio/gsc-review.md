# Search Console review — three shopfront sites

Read-only. 27 September 2026. Nothing was changed on any site.

## Summary

**No city page on any of the three sites is being filtered as a duplicate of
another site.** Zero pages sit in a duplicate bucket on Sigma or Urban.
Grewal's 41 "Duplicate without user-selected canonical" pages are legacy
`.php` URLs from the old website, not city pages.

Sigma and Urban both earn impressions for the *same* cities — Cardiff returns
592 impressions on Sigma and 1,417 on Urban in the same window. If Google were
folding one brand into the other, the losing side would show near zero.

The problem is **position, not suppression**: 26.2 / 32 / 52.2. These pages
rank where nothing gets clicked. That is a links-and-authority problem.

The URL restructure would move ~615 URLs on Grewal to solve a filtering
problem the data does not show.

## 1. Traffic

Each property holds a different amount of history — this is not a like-for-like
comparison.

| Site | Data from | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|---|
| Urban | 30 Sep 2025 | 647 | 113,000 | 0.6% | 26.2 |
| Sigma | 1 May 2026 | 216 | 47,800 | 0.5% | 32.0 |
| Grewal | **13 Aug 2026** | 56 | 13,900 | 0.4% | 52.2 |

**21 Aug (delisting).** Visible on Sigma as a step down around 23–26 Aug after
a peak on ~13 Aug; impressions fall from the 1.5k–2.3k band to the 250–750
band and stay there. Not assessable on Grewal — its property only has data
from 13 Aug, eight days before the event. Urban shows no comparable step.

**11 Sep (Sigma retirement).** No second cliff. Sigma's impressions continue
in the post-August band through 21 Sep with recovery spikes on ~8 Sep and
~18 Sep. The retirement did not cause further loss.

## 2. Index status — the decisive table

| | Indexed | Not indexed | **Duplicate w/o user canonical** | Excluded by noindex |
|---|---|---|---|---|
| Grewal | 680 | 86 | **41** (all legacy `.php`) | 0 |
| Sigma | 462 | 215 | **0** | 190 |
| Urban | 627 | 60 | **0** | 19 |

Neither "Duplicate, Google chose different canonical than user" nor any other
cross-site duplicate category appears on any property.

**Grewal's 41, actual examples:**

```
/service-detail.php?slug=toughened-glass-shopfront   (http, https, www, non-www)
/service-detail.php?slug=electric-roller-shutter
/service-detail.php?slug=wicket-doors
/service-detail.php?slug=sectional-overhead-doors
/service-detail.php?slug=pedestrian-access-doors
/contact.php   /terms.php   /blog-single.php?id=3
```

Old-site URLs, counted separately per host variant. First detected 15 Aug
2026; last crawled 18 Jul – 1 Aug 2026. All four now return **308** to the
correct new page — verified by request. This is stale data awaiting recrawl,
not a live defect, and Grewal's crawl rate is slow.

**Sigma's 190 under noindex** is the 11 Sep retirement working as designed,
up from 90 at the time of the change.

## 3. City pages do earn

Top city pages in each property's window:

| Site | Page | Clicks | Impressions |
|---|---|---|---|
| Sigma | /areas/glasgow | 9 | 603 |
| Sigma | /areas/bristol | 4 | 779 |
| Sigma | /areas/nottingham | 4 | 489 |
| Sigma | /areas/cardiff | 3 | 592 |
| Urban | /areas/liverpool | 8 | 1,444 |
| Urban | /areas/cardiff | 8 | 1,417 |
| Grewal | /services/aluminium-windows/birmingham | 1 | 482 |
| Grewal | /areas/wolverhampton | 1 | 364 |
| Grewal | /areas/sheffield | 1 | 202 |

Overlapping cities where two brands both surface: **Cardiff** (Sigma 592 /
Urban 1,417), **Glasgow** (Sigma 603 / Grewal 102). Both present. Neither
suppressed.

## 4. Recommendation

**Winning the duplicate group:** nobody, because there is no duplicate group
in the index data. Urban leads on every metric, but it is not winning *at the
expense of* the others.

**Rewrite first:** Grewal, on position (52.2) — but for content quality and
differentiation, not because it is being filtered.

**Sigma's recovery:** stable in the post-August band, no further decline after
11 Sep. A content rewrite now would be readable — there is no ongoing
migration to confuse it. A *URL* migration now would not be.

**Suggested order**

1. Clear Grewal's 41 legacy `.php` entries — submit for validation in GSC.
   Redirects are already correct; this just asks Google to recheck. Zero risk.
2. Rewrite Sigma's city page content **in place**. No URL changes.
3. Measure from **26 October 2026** (4 weeks).
4. If Sigma's city impressions rise, repeat on Grewal. If flat, the constraint
   is links and no amount of copy will move it.

## Not collected

28-day vs previous-28 comparison; top-20 city URLs per site (top 10 captured);
full per-city cross-site matrix; top-30 non-brand queries per site; URL
Inspection canonicals.

The URL Inspection sample was dropped deliberately: the index report already
shows zero pages in any duplicate bucket on Sigma and Urban, so per-URL
inspection would confirm the same result one page at a time. Available on
request if you want it confirmed directly.

**One limitation worth stating.** GSC's duplicate buckets only cover pages
Google declined to index. If Google indexed two sites' pages but consistently
ranked only one, that would not appear here. The evidence against that is
section 3: both brands surface for the same cities.

---

# Addendum — 28 September 2026

Three follow-up checks, plus the Grewal validation.

## (a) It was a spam update, and it matches the date exactly

| Update | Type | Rolled | Status |
|---|---|---|---|
| May 2026 | **Core** | 21 May – 2 Jun | complete |
| June 2026 | Spam | 24–26 Jun | complete |
| **August 2026** | **Spam** | **18 Aug 09:27 PT → 21 Aug 04:51 ET** | complete |
| **September 2026** | **Spam** | **24 Sep 09:15 PDT → ~2 weeks** | **ROLLING NOW** |

The August 2026 spam update **completed on 21 August 2026** — the same day
Sigma's cross-product was delisted. It targeted **scaled content abuse**
specifically: programmatic pages, AI-generated pages at scale, pages created
mainly to rank. A SpamBrain enforcement pass on policies Google already
publishes, applied globally to all languages.

574 templated city×service pages with 84% phrasing shared across three
domains is a textbook match for that policy. The diagnosis is no longer
inference from the traffic shape — the date and the target both line up.

**Two consequences.**

**1. Grewal and Urban each still carry 574 of the same pages.** They were not
hit in August. They are the same pattern on the same template, so the exposure
is real, not theoretical. Urban carries it on the site that produces more
clicks than the other two combined.

**2. A spam update is rolling right now.** It started 24 September — four days
ago — and Google says roughly two weeks, so it lands around **8 October**.
Google has not said what it targets, only that it is not link spam and not
site reputation abuse. Scaled content is not ruled out.

## (b) There is no earlier Grewal property

Searched the full property list: exactly one Grewal property,
`grewalshopfrontandshutters.co.uk`, a **Domain property**. A Domain property
already covers http, https, www, non-www and subdomains, so there is no
separate variant holding older data.

Data starts 13 Aug 2026 because that is when the property was verified — GSC
does not backfill before verification. **Grewal's pre-August history is not
recoverable from this account.** If it exists at all it sits under whoever
owned the old PHP site.

Practical effect: the August drop cannot be assessed on Grewal, and "Grewal
gets good traffic" is not measurable here. 56 clicks in six weeks is what the
property holds. If the good traffic is phone calls, it is most likely coming
from the Google Business Profile rather than the website.

## (c) Query overlap is far smaller than assumed

Top 10 queries per site, same 16-month window:

| Sigma | Urban | Grewal |
|---|---|---|
| shopfront manufacturers (282) | **shopfronts** (5,036) | industrial roller shutter doors wolverhampton (180) |
| **shopfronts** (181) | shopfronts london (242) | commercial fire door installation birmingham (147) |
| shop front nottingham (33) | shop front fitters birmingham (104) | shopfront roller shutter doors birmingham (147) |
| automatic doors in nottingham (26) | london shopfronts (102) | fire door installation acocks green (133) |
| fire doors bradford (19) | shopfront installation (487) | roller shutter doors quinton (123) |
| glasgow aluminium shop fronts (13) | shop front cost (374) | high speed industrial doors wolverhampton (119) |
| aluminium shop fronts liverpool (12) | aluminium shopfronts london (336) | automatic door installation birmingham (118) |
| aluminium shopfronts (756, 0 clicks) | shutter repair (245) | automatic doors wolverhampton (114) |

**Exactly one term appears on more than one site: "shopfronts".** Nothing else
in any top 10 is shared. The three sites are surfacing for different city
clusters — Sigma scattered UK (Nottingham, Bradford, Glasgow, Liverpool),
Urban London-weighted, Grewal West Midlands (Wolverhampton, Acocks Green,
Quinton).

This contradicts the earlier portfolio review's claim that Grewal's top
non-brand queries are "almost a subset of Sigma's". In current data they
barely intersect.

**Grewal's city queries return zero clicks** across 180, 147, 147, 133, 123,
119, 118 and 114 impressions. Its pages are relevant enough to surface for
genuinely local terms; they rank too deep to be clicked. Position 52.2.

Caveat: top 10 per site, not an exhaustive comparison. Position per query
could not be extracted — the metric toggle would not persist through the UI.

## Grewal validation — done

**Validation started 28/09/2026** on the 41 legacy `.php` URLs. Google will
recheck; the 308s are already correct.

## Revised timing

**Hold every site change until roughly 8 October**, when the September spam
update finishes. Changing content mid-rollout means any movement is
unattributable — you would not know whether the rewrite helped or the update
moved you.

Revised order:

1. ~~Grewal validation~~ — done 28 Sep.
2. **Wait for the September update to finish (~8 Oct).** Watch all three for
   movement; Grewal and Urban carry the August-hit pattern.
3. Sigma city-page rewrite in place. Measure 4 weeks after deploy.
4. Decide on Grewal and Urban's 574 city×service pages. Given August was
   confirmed scaled-content enforcement, doing nothing is now an active
   choice, not a neutral one.
