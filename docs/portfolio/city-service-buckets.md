# City×service page audit — Urban and Grewal

Read-only, 29 September 2026. No site changed. Pruning decision deferred
until the September spam update finishes rolling.

## Headline

**Urban's 574 city×service pages produce 37% of the site's clicks.** They are
not dead weight, and blanket-noindexing them the way Sigma's were would cost
roughly a third of your best site's traffic.

**Grewal's produce 23 clicks in six weeks**, every one of them a single click
on a different page.

## Where the traffic sits

**Urban** — 30 Sep 2025 to 25 Sep 2026 (~12 months)

| Page type | Pages | Clicks | % clicks | Impressions | % impr | Position |
|---|---|---|---|---|---|---|
| city×service `/services/{s}/{c}` | 574 | **239** | **37%** | 41,800 | 37% | 26.8 |
| city hubs `/areas/{c}` | 41 | 57 | 9% | 20,500 | 18% | 38.3 |
| everything else | — | 351 | 54% | 50,700 | 45% | — |
| **total** | | **647** | | **113,000** | | 26.2 |

**Grewal** — 13 Aug to 25 Sep 2026 (~6 weeks only)

| Page type | Pages | Clicks | % clicks | Impressions | % impr | Position |
|---|---|---|---|---|---|---|
| city×service | 574 | **23** | 41% | 9,820 | 71% | 51.0 |
| city hubs | 41 | 4 | 7% | 2,780 | 20% | 61.6 |
| everything else | — | 29 | 52% | 1,300 | 9% | — |
| **total** | | **56** | | **13,900** | | 52.2 |

The two windows are not comparable — Urban has twelve months, Grewal six
weeks. Read the percentages, not the absolute numbers.

## Buckets

| | Urban | Grewal |
|---|---|---|
| city×service pages built | 574 | 574 |
| have GSC data (≥1 impression) | **555** | **429** |
| **no impressions at all** | **19** | **145** |
| clicks across pages with data | 239 | 23 |

**Grewal's 145 is not a safe prune list.** Its property only holds data from
13 August, so "no impressions" means "none in six weeks", not "none ever".
Some of those pages may have performed before the property was verified, and
that history is unrecoverable. Urban's 19 rest on twelve months and are
genuinely dead.

## The pages that earn — Urban

Top 10 by clicks. One pattern dominates:

| Page | Clicks | Impressions |
|---|---|---|
| /services/security-doors/newcastle | 6 | 38 |
| /services/shutter-repair/edinburgh | 5 | 457 |
| /services/shutter-repair/reading | 5 | 96 |
| /services/shutter-repair/middlesbrough | 5 | 66 |
| /services/shutter-repair/bradford | 4 | 2,491 |
| /services/shutter-repair/london | 4 | 968 |
| /services/shutter-repair/birmingham | 4 | 441 |
| /services/shutter-repair/cardiff | 4 | 321 |
| /services/shutter-repair/manchester | 4 | 241 |
| /services/fire-doors/cardiff | 4 | 229 |

**Eight of the top ten are `shutter-repair`.** Repair intent converts where
installation intent does not — someone with a broken shutter clicks; someone
researching a new shopfront browses. That is the single most useful signal
here, and it should drive which pages get rewritten first.

## The pages that earn — Grewal

Every page in the top ten has exactly **1 click**. Since the maximum is 1 and
the total is 23, precisely **23 pages have a click and 406 do not**.

| Page | Clicks | Impressions |
|---|---|---|
| /services/aluminium-windows/birmingham | 1 | 482 |
| /services/aluminium-doors/birmingham | 1 | 182 |
| /services/aluminium-doors/newcastle | 1 | 152 |
| /services/glass-replacement/glasgow | 1 | 62 |
| /services/security-doors/sheffield | 1 | 46 |

## What this implies for pruning

**Urban — do not prune.** Only 19 pages are genuinely dead. Removing them
takes the footprint from 574 to 555, which does nothing to reduce scaled-content
exposure while the other 555 keep earning 37% of the site's clicks. If Urban
needs protection it has to come from rewriting, not removing.

**Grewal — a real candidate, but not on this data.** 429 pages produce 23
clicks in six weeks at position 51. The pages are nearly worthless as they
stand. But the 145 "no impression" list is an artefact of a six-week window,
so pruning on it now risks cutting pages that worked before August.

Better basis for Grewal: wait for a full quarter of data from the Domain
property (mid-November), then prune on twelve weeks of evidence rather than
six. Nothing about Grewal's current position argues for haste.

## Not extracted

The exact clicks>0 / impressions-only split for Urban. GSC's rows-per-page
control does not persist through automation, so the table could only be read
ten rows at a time against 555 rows. The aggregate totals and the zero-data
counts are solid; the middle bucket for Urban is not broken out.

Grewal's split is exact by inference — max clicks per page is 1, total is 23.
