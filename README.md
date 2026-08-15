# myfirstbusiness.com

A free diagnostic that turns 15 honest answers into a personalised 15-page PDF business playbook, written for your field and your work history. No account, no email, no cost, no server.

**Live:** https://myfirstbusiness.github.io

---

## What's in here

```
index.html                     the whole website — built automatically, do not edit by hand
myfirstbusiness-preview.html   standalone single-file copy (fonts inlined, works offline)
parts/                         the real source files — edit these
vendor/                        PDF library, loaded lazily
fonts/                         self-hosted web fonts (latin subsets)
docs/                          strategy, research and a sample output
.github/workflows/build.yml    rebuilds index.html whenever parts/ changes
```

## How to change the site

**Edit files in `parts/`. Never edit `index.html` directly.**

`index.html` is assembled from the six files in `parts/`, in numeric order, by the GitHub Action in `.github/workflows/build.yml`. Commit a change to any part and the Action rebuilds and commits `index.html` within a minute or two, which redeploys the site automatically.

| To change | Edit |
|---|---|
| Questions, business models, prices, outreach scripts, 90-day plans | `parts/03-data.js` |
| Industry specifics (who pays, where they are, price anchors, regulation) and career advantages | `parts/03b-context.js` |
| Which model gets recommended to whom | `parts/04-scoring.js` |
| The contents and layout of the PDF | `parts/05-pdf.js` |
| Landing page copy and structure | `parts/02-body.html` |
| Colours, fonts, spacing, all CSS | `parts/01-head.html` |
| Quiz behaviour and results screen | `parts/06-app.js` |

Press `.` on any page of this repo to open a full VS Code editor in the browser — much better than GitHub's plain file editor for the JS files.

If you ever need to rebuild by hand:

```bash
cat parts/01-head.html parts/02-body.html parts/03-data.js parts/03b-context.js \
    parts/04-scoring.js parts/05-pdf.js parts/06-app.js > index.html
```

### One rule about the scoring engine

`parts/04-scoring.js` holds a `NORM` table — the mean and standard deviation of each model's raw score, precomputed by Monte Carlo over 150,000 simulated profiles. It exists so that models with larger weight values don't win on magnitude instead of on fit.

**If you meaningfully change the `W` weight tables, that `NORM` table becomes stale and the recommendations will skew.** The method for recomputing it is in `docs/BRAND-AND-STRATEGY.md` §5.

## Deploying

Already deployed via GitHub Pages from `main` / root. Nothing to build, no dependencies to install.

To preview locally, serve the folder over HTTP rather than opening the file directly — the fonts and lazily-loaded PDF library won't resolve from a `file://` URL:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `myfirstbusiness-preview.html`, which is self-contained and works offline.

## How it works

Everything runs in the visitor's browser. No backend, no database, no analytics, no third-party requests. Answers live in a JavaScript object and are gone when the tab closes — which is why the site can honestly claim that nothing leaves your device.

Fifteen answers are scored against ten business models, each carrying its own pricing tiers, acquisition channel, 90-day timeline, unit economics and reading path. The winning model's content is assembled into a PDF client-side with pdfmake. Same answers in, same document out, every time — no randomness and no model call.

## Docs

- `docs/BRAND-AND-STRATEGY.md` — positioning, the colour and conversion research behind every design decision, and how the recommendation engine was validated
- `docs/ZERO-BUDGET-LAUNCH-PLAN.md` — running and growing this for $0, the 90-day distribution plan, and where $0 stops being true
- `docs/sample-playbook.pdf` — an example of what a user downloads

## Verified

- End-to-end run in Chromium: questionnaire → scoring → results → PDF download, zero console errors
- PDFs generated across all 14 industries: 15 pages each, no sparse or orphan pages
- Scoring balance checked over 20,000 random profiles — no model wins less than 6.8% or more than 16.7%
- Industry sensitivity verified: holding every other answer fixed and changing only the industry changes the recommendation
- Eight hand-built archetype profiles each return the obviously correct model
- Every colour pair audited against WCAG — all pass AA, body text passes AAA
- Mobile (390×844) and desktop (1440×1000) layouts checked
- First paint 246 KB; the 2.1 MB PDF library loads only when the questionnaire opens

## Licence & disclaimer

MIT. Educational content only — not financial, legal or tax advice. Business registration, tax and contract law vary by country, and age restrictions apply to minors in most jurisdictions.
