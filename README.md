# myfirstbusiness.com

A free diagnostic that turns 12 honest answers into a personalised 12-page PDF business playbook. No account, no email, no cost, no server.

---

## What's in this folder

```
index.html                    the entire website — landing page, questionnaire, engine, PDF builder
vendor/pdfmake.min.js         PDF library (vendored, loaded lazily)
vendor/vfs_fonts.js           PDF fonts
fonts/*.woff2                 self-hosted web fonts (latin subsets)

BRAND-AND-STRATEGY.md         design rationale, colour research, engine validation
ZERO-BUDGET-LAUNCH-PLAN.md    how to run and grow this for $0, with the honest limits
sample-playbook.pdf           an example of what a user downloads
```

## Deploy it

Drop the whole folder into a GitHub repo, point Cloudflare Pages or GitHub Pages at it, done. There is **no build step** — framework preset `None`, build command empty, output directory `/`. Full steps are in `ZERO-BUDGET-LAUNCH-PLAN.md`.

To preview locally:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(It needs to be served over HTTP rather than opened as a `file://` — the fonts and the lazy-loaded PDF library won't resolve otherwise.)

## How it's built

Everything runs in the visitor's browser. No backend, no database, no analytics, no third-party requests at all. Answers live in a JavaScript object and are gone when the tab closes — which is why the site can honestly say nothing leaves your device.

`index.html` is assembled from six source parts in `parts/`, in order:

| Part | What it holds |
|---|---|
| `01-head.html` | Design tokens, full CSS, font loading |
| `02-body.html` | Landing page markup and quiz shell |
| `03-data.js` | The 12 questions and all 10 business models with their playbook content |
| `04-scoring.js` | Weight tables, scoring, normalisation, personalised reasoning |
| `05-pdf.js` | Blocker responses and the pdfmake document builder |
| `06-app.js` | Quiz UI, lazy PDF loading, results screen |

Rebuild after editing a part:

```bash
cat parts/01-head.html parts/02-body.html parts/03-data.js \
    parts/04-scoring.js parts/05-pdf.js parts/06-app.js > index.html
```

You can also just edit `index.html` directly — it's a normal file, the parts are only there to keep things navigable.

## Changing the content

Almost everything you'd want to change lives in `03-data.js`:

- **Questions** — the `QUESTIONS` array. Add or remove one and the progress bar, keyboard shortcuts and counter all adapt automatically.
- **Business models** — the `MODELS` array. Each entry carries its own pricing tiers, outreach script, 90-day timeline, unit economics, traps, books and tools. That content flows straight into the PDF.

Tuning which model wins is done in `04-scoring.js` via the `W` weight tables. **If you change weights meaningfully, recompute the `NORM` table** — it holds the per-model mean and standard deviation used to standardise scores, and stale values will skew the recommendations. The method is described in `BRAND-AND-STRATEGY.md` §5.

## Verified

- End-to-end run in Chromium: questionnaire → scoring → results → PDF download, zero console errors
- PDFs generated for all 10 models: 12 pages each, no sparse or orphan pages
- Scoring balance checked over 20,000 random profiles — no model wins less than 7.5% or more than 15%
- Eight hand-built archetype profiles each return the obviously correct model
- Every colour pair audited against WCAG — all pass AA, body text passes AAA
- Mobile (390×844) and desktop (1440×1000) layouts checked
- First paint 246 KB; the 2.1 MB PDF library loads only when the questionnaire opens

## Licence & disclaimer

Educational content. Not financial, legal or tax advice. Business registration, tax and contract law vary by country, and age restrictions apply to minors in most jurisdictions.
