# Launching myfirstbusiness.com for $0

**An honest evaluation of what this costs to build, run and grow at zero — and exactly where zero stops being true.**

---

## The headline

**Running the site costs $0/month, permanently, at any traffic level you will realistically reach.** It is a single HTML file plus two vendored scripts and three font files. There is no server, no database, no API call, and nothing that scales with visitors. Free static hosting covers this forever.

**The only genuine cost is the domain.** `myfirstbusiness.com` is not free, and there is no honest way to pretend otherwise. Everything else on this page is genuinely, sustainably $0.

---

## 1. Hosting — $0 forever

The site is fully static, which means every free tier is wildly over-specified for it.

| Host | Bandwidth (free) | Custom domain + HTTPS | Commercial use | Verdict |
|---|---|---|---|---|
| **Cloudflare Pages** | Unlimited | Yes, up to 100 domains | Allowed | **Recommended.** Unlimited bandwidth removes the only ceiling that could ever bite. |
| **GitHub Pages** | 100 GB/month | Yes, auto HTTPS | Allowed | Excellent fallback. Simplest possible deploy: drag files into a repo. |
| **Netlify** | 100 GB/month | Yes | Allowed | Fine. 300 build minutes/month is irrelevant for a static file. |
| **Vercel** | 100 GB/month | Yes | **Hobby tier restricts commercial use** | Avoid. Not a problem while the site is free, but it's a trap if that ever changes. |

**What 100 GB/month actually means here.** The landing page is **246 KB** on first paint. The 2.1 MB PDF library is loaded lazily — only when someone actually opens the questionnaire — so a visitor who reads and leaves costs you almost nothing. On a 100 GB tier that's roughly **420,000 landing-page visits**, or around **44,000 people who complete a questionnaire and download a playbook**. At a realistic mix of the two you'd be looking at well over 100,000 visitors a month before you hit any ceiling at all, and browser caching pushes that higher still. Cloudflare Pages removes the ceiling entirely.

**Recommended setup:** Cloudflare Pages, connected to a free GitHub repo. Push a change, it's live in seconds. Free SSL, free global CDN, free DDoS protection, zero configuration.

---

## 2. The domain — the one real cost

This is where "$0" becomes "$10.44".

| Option | Cost | Honest assessment |
|---|---|---|
| `myfirstbusiness.com` via **Cloudflare Registrar** | **$10.44/year**, at cost, no markup, WHOIS privacy and DNSSEC included | The cheapest legitimate route to the domain you actually want. Caveat: you must use Cloudflare's nameservers, which you would be doing anyway. **Check availability first — it may be taken or held at a premium price.** |
| `myfirstbusiness.pages.dev` (Cloudflare) | **$0 forever** | Free subdomain, real HTTPS, works perfectly. Looks less credible in a link, but the site's credibility comes from its content, not its TLD. |
| `myfirstbusiness.github.io` | **$0 forever** | Same trade-off. |
| A cheaper TLD (`.xyz`, `.site`, `.online`) | ~$1–3 first year, then $10–20 | The first-year discount is bait; renewal is often *more* than a `.com`. Not actually cheaper over three years. |

**The recommendation:** launch on the free `.pages.dev` subdomain today. Get the first hundred people through the questionnaire and find out whether anyone wants this. If they do, $10.44 is a trivially easy decision to justify — and you'll have earned it with evidence instead of guessing. **Do not spend money to find out whether people want something you can find out for free.**

That is Law 12 applied to your own project: ship, measure, then commit.

---

## 3. Everything else — genuinely $0

| Need | Free solution | Ceiling |
|---|---|---|
| **Code hosting / version control** | GitHub free | Unlimited public repos |
| **Analytics** | Cloudflare Web Analytics | Free, unlimited, privacy-first, **no cookies and no personal data** — which matters, because the site promises exactly that. GA4 would contradict the privacy claim on your own homepage. |
| **Fonts** | Self-hosted (already done) | ~105 KB, no third-party request |
| **PDF generation** | pdfmake, vendored in the repo | Runs in the visitor's browser. Zero server cost regardless of volume. |
| **Design assets** | Canva free / Figma free | Ample |
| **Email (if ever needed)** | Cloudflare Email Routing → your Gmail | Free `hola@myfirstbusiness.com` forwarding |
| **Error monitoring** | Browser console + your own testing | A static page has almost no runtime surface to monitor |
| **SSL certificate** | Included by every host above | — |

**Total recurring cost: $0.00/month.** Optionally $10.44/year for the domain.

---

## 4. Distribution at $0 — the actual hard part

Hosting was never the constraint. **Distribution is.** Law 4: distribution beats product more often than founders admit. A perfect free tool nobody sees is worth exactly nothing.

Your audience is 16–28 year olds, and the research is clear on where they are: **YouTube 59%, TikTok 58%, Instagram 54%**. But the same research shows a critical disconnect — while they *spend time* on social, what actually drives their trust is **data, peer recommendation, and genuinely useful content**, not influencer polish. That tells you exactly what to make.

### The 90-day distribution plan

**Days 1–14 — Prove it works on humans**
Ten people you know, in the target age range. Watch them take the questionnaire without helping. Write down every place they hesitate, every question they misread, and every reaction to the result. This is the highest-value thing you can do all quarter and it costs nothing. Fix what they trip on.

**Days 15–45 — Communities first, algorithms second**
Go where the question is already being asked, and answer it properly *before* mentioning the tool.
- **Reddit**: r/Entrepreneur, r/smallbusiness, r/SideProject, r/Teenagers, r/EntrepreneurRideAlong, plus the Spanish-language equivalents. Read each sub's self-promotion rules first — getting banned in week two costs you the channel permanently.
- **Discord servers** for young entrepreneurs and creators.
- **Indie Hackers** — build in public. The audience there rewards free tools and honest write-ups.
- **Hacker News Show HN** — one shot, so make it count, and lead with the engineering honesty (one HTML file, no backend, no email capture, deterministic scoring).

The pattern that works: give the complete answer for free in the comment. Mention the tool as a footnote. The people who take the free answer were never going to click anyway; the ones who click are the ones who wanted more.

**Days 46–75 — Content that carries the tool**
One short-form video a day is the model here — you are effectively running the Audience Engine model on your own project. The format that suits this content and this audience:
- "The business you should start if you have $0 and 5 hours a week"
- "Why 'follow your passion' is bad business advice, in 40 seconds"
- "I built a free tool that tells you what business to start — here's how it decides"
- Screen-record the questionnaire and read out the result. The personalisation *is* the hook.

Lead with the useful thing, not the link. 70% of this audience finds a brand more credible when it shares genuine insight — so the content has to stand alone even if nobody ever visits the site.

**Days 76–90 — SEO groundwork**
Slow-burning and free. Target the long-tail questions your audience actually types: *"what business can I start with no money at 17"*, *"how to start a business with $0"*, *"business ideas for teenagers"*. One genuinely excellent page per question, each ending at the questionnaire. This compounds for years; expect nothing from it for six months.

### The one metric to track

Not visits. Not signups — there are none. **The number of completed questionnaires and downloaded PDFs.** Cloudflare Web Analytics gives you page views for free; add a simple client-side counter for downloads only if you can do it without collecting anything personal. Everything else is vanity.

---

## 5. Where $0 stops being true — the honest limits

A plan that only lists the upside is marketing, not evaluation. Here is what free actually costs you:

| Limit | Reality | When it matters |
|---|---|---|
| **No email list** | You cannot contact anyone who used the site. Ever. | This is a real strategic cost. It's also the entire differentiator, and for a community project it's the right trade. Revisit only if the project's purpose changes. |
| **No data on outcomes** | You will never know if anyone acted on their playbook. | Painful. The honest workaround is a visible "tell me what happened" link to a free Google Form — opt-in, no tracking. |
| **No A/B testing** | Every design decision in this build is reasoned from published research, not measured on your audience. | Acceptable at launch. Becomes the main limiting factor once you have real traffic. |
| **Your time is not free** | The distribution plan above is 90 days of real work. That is the actual price of this project. | This is the only cost that can genuinely sink it. |
| **Bandwidth ceiling on GitHub/Netlify** | 100 GB/month ≈ 100,000+ visitors at a realistic mix | Only if this succeeds beyond expectation. Cloudflare Pages removes it entirely — which is why it's the recommendation. |
| **Legal** | Free doesn't mean unregulated. You are publishing educational content to minors, internationally. | The site already carries an educational-content disclaimer and collects no data, which is the correct posture. If you ever add analytics that identify people, or an email field, GDPR obligations attach immediately. |

---

## 6. Deploy it today — the literal steps

1. Create a free GitHub account and a new **public** repository called `myfirstbusiness`.
2. Upload the contents of the site folder — `index.html`, `vendor/`, `fonts/` — keeping the folder structure.
3. Go to **Cloudflare Pages** → Create a project → Connect to Git → pick the repo.
4. Build settings: **framework preset = None**, **build command = empty**, **output directory = `/`**. There is no build step; it's a static file.
5. Deploy. You are live at `something.pages.dev` with HTTPS, globally, in under two minutes.
6. *(Optional, $10.44/yr)* Buy `myfirstbusiness.com` at Cloudflare Registrar and attach it in one click from the same dashboard.

Total elapsed time: about fifteen minutes. Total cost: $0.

---

## The honest summary

**Building and running this at $0 is not a compromise — it is genuinely the correct architecture.** A static file with client-side generation has no running costs, no security surface, no downtime risk, and no vendor who can change their pricing on you. It will still work in ten years, and it will work offline.

The $0 constraint also produced the strongest strategic decision in the whole project: **no email capture.** A version of this site with a paid backend would almost certainly have gated the PDF behind an email, because that's what the business model would demand. Being broke forced the design that makes it trustworthy.

What is *not* free is your attention for ninety days. That is the real budget line, and it's the one that decides whether this becomes a thing people use or a well-built page nobody visits.

---

## Sources

- [Cloudflare Registrar Review 2026 — .com domains at $10.44](https://startupowl.com/reviews/cloudflare-registrar)
- [Best Free Static Site Hosting: 8 Options Compared (2026) — HTML Pub](https://htmlpub.com/blog/static-site-hosting-comparison-2026)
- [Low-Cost Domain Names — Cloudflare](https://www.cloudflare.com/application-services/solutions/low-cost-domain-names/)
- [Where Gen Z spends their time, and what actually earns their trust — Talker Research](https://talkerresearch.com/where-gen-z-spends-their-time-and-what-actually-earns-their-trust/)
- [Quiz Conversion Rate Report 2026 — Interact](https://www.tryinteract.com/blog/quiz-conversion-rate-report/)
