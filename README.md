# myfirstbusiness.com

A free diagnostic that turns 15 honest answers into a personalised PDF business playbook. No account, no email, no cost.

---

## What's in the repo

```
index.html                    the entire website — landing page, questionnaire, engine, PDF builder
parts/                        the seven sources index.html is assembled from
worker/                       the optional AI writer (a single Cloudflare Worker)
vendor/pdfmake.min.js         PDF library (vendored, loaded lazily)
vendor/vfs_fonts.js           PDF fonts
fonts/*.woff2                 self-hosted web fonts (latin subsets)
docs/                         setup, testing and distribution guides
```

## Deploy it

Push to the repo. A GitHub Action rebuilds `index.html` from `parts/` on every push that touches `parts/**`, and GitHub Pages serves it. There is no other build step.

To preview locally:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(It must be served over HTTP rather than opened as a `file://` — the fonts and the lazy-loaded PDF library won't resolve otherwise.)

## How it's built

`index.html` is assembled from seven sources in `parts/`, concatenated in this order:

| Part | What it holds |
|---|---|
| `01-head.html` | Design tokens, full CSS, font loading |
| `02-body.html` | Landing page markup and quiz shell |
| `03-data.js` | The 15 questions and all 10 business models with their playbook content |
| `03b-context.js` | Industry and career context tables, text sanitising, the writer client |
| `04-scoring.js` | Weight tables, scoring, normalisation, personalised reasoning |
| `05-pdf.js` | Blocker responses and the pdfmake document builder |
| `06-app.js` | Quiz UI, consent screen, lazy PDF loading, results screen |

Rebuild after editing a part:

```bash
cat parts/01-head.html parts/02-body.html parts/03-data.js parts/03b-context.js \
    parts/04-scoring.js parts/05-pdf.js parts/06-app.js > index.html
```

You can also edit `index.html` directly — it's a normal file, the parts only exist to keep things navigable — but the Action will overwrite it on the next push to `parts/`.

## The two paths

The site produces the same playbook two different ways, and the user picks which on a screen shown after the last question.

**Offline.** Everything runs in the browser. No backend, no database, no analytics, no request of any kind. Answers live in a JavaScript object and are gone when the tab closes. 15 pages, written for their field and work history.

**Written.** The 15 answers are sent once to a Cloudflare Worker, which asks a language model to write the sections that should be about their specific idea rather than about their category. 15–19 pages. Nothing is stored.

**The recommendation is deterministic in both cases.** `scoreModels()` runs before any request goes out and its result is never revisited. Same answers, same verdict, whether the writer ran or not — the writer only rewrites prose inside a decision the engine already made.

The writer is off unless `WRITER_URL` in `parts/03b-context.js` has a value. With it empty there is no consent screen, no network request, and no mention of AI anywhere on the page. Setup is in `docs/SETUP-THE-WRITER.md`.

## Changing the content

Most of what you'd want to change lives in `03-data.js`:

- **Questions** — the `QUESTIONS` array. Add or remove one and the progress bar, keyboard shortcuts and counter all adapt automatically. `showIf` makes a question conditional.
- **Business models** — the `MODELS` array. Each entry carries its own pricing tiers, outreach script, 90-day timeline, unit economics, traps, books and tools, and that content flows straight into the PDF.

Industry and career context tables are in `03b-context.js`. The writer's prompt — which is where nearly all of the AI output quality lives — is in `worker/src/index.js`.

Tuning which model wins is done in `04-scoring.js` via the `W` weight tables. **If you change weights meaningfully, recompute the `NORM` table** — it holds the per-model mean and standard deviation used to standardise scores, and stale values will skew every recommendation. The method is in `BRAND-AND-STRATEGY.md` §5.

## Known issues

- **`retail` leans toward reselling.** The "Products & retail" option covers both making things and reselling them, but its weights point at The Flip (18) ahead of Ecommerce (14). Someone who wants to *make* a physical product tends to get a resell recommendation. Fixing it means editing weights and recomputing `NORM`.
- **English only.** The original target audience was Spanish-speaking.
- **No analytics, by choice**, so completion and download rates are unknown. The feedback form (`FEEDBACK_URL` in `03b-context.js`) is the only signal available and is currently off.

## Verified

- End-to-end runs in Chromium on both paths: questionnaire → consent → scoring → results → PDF, zero console errors
- Deterministic PDFs across all 14 industries: 15 pages each, no sparse or orphan pages
- Written PDFs at full, partial and near-empty AI payloads: 16–19 pages, no sparse pages, every missing field falls back individually
- The verdict is identical with the writer off, on, and failing — proven by test, not by inspection
- The offline path makes zero outbound requests, asserted by intercepting every request the page makes
- Worker unit tests cover origin locking, rate limiting, model fallback, quota vs outage, prompt injection stripping, and malformed upstream responses
- Scoring balance checked over 20,000 random profiles — no model wins less than 6.8% or more than 16.7%
- Every colour pair audited against WCAG — all pass AA, body text passes AAA
- Mobile (390×844) and desktop (1440×1000) layouts checked, including the consent screen

## Licence & disclaimer

Educational content. Not financial, legal or tax advice. Business registration, tax and contract law vary by country, and age restrictions apply to minors in most jurisdictions. Where the writer is used, parts of the document are AI-generated and figures should be checked before being relied on.
