# Distribution Kit

**Ready-to-post copy for every free channel. Fire it only after the ten-person test — each of these is a one-shot with that community.**

Replace `[URL]` with `https://myfirstbusiness.github.io` (or your domain if you buy it).

---

## The rule that governs all of this

**Give the complete answer for free. Mention the tool as a footnote.**

The people who take the free answer and leave were never going to click. The people who click are the ones who wanted more. Every post below is built this way, and every one of them would fail if you inverted it.

Second rule: **never post the same thing twice.** Each community has different norms and detects copy-paste instantly. That's why these are all written differently.

---

## 1. Hacker News — Show HN

**You get one shot.** Post Tuesday–Thursday, 8–10am US Eastern. HN rewards technical honesty and punishes marketing language harder than any other community you'll touch.

**Title** (HN titles are strict — no hype, no emoji):
```
Show HN: A free business-plan generator with no backend, no email, and no upsell
```

**First comment** — post this yourself immediately after submitting:

> I'm 20 and I kept noticing that every "free" business guide is bait for a $997 course. So I built the version that isn't.
>
> You answer 15 questions about your money, time, work history and what you actually have in mind. It scores you against 10 business models that can be started with $0–$300, and generates a 15-page personalised PDF: which business to start and why, who pays for it in your specific industry, what to charge, one acquisition channel with a script, a 90-day plan scaled to the hours you said you have, your unit economics, and the regulation you need to check before taking money.
>
> Technical bits that might interest people here:
>
> - It's one HTML file. No backend, no database, no analytics, no third-party requests at all. Fonts are self-hosted, the PDF library is vendored. Answers live in a JS object and are gone when you close the tab — which is why it can honestly say nothing leaves your device.
> - Scoring is deterministic, not an LLM. Each model has a weight table across working style, sales comfort, urgency, risk, reach and ambition, plus capped skill matching and hard capital/time constraints. Same inputs always produce the same document.
> - The bit I found interesting: raw weight sums aren't comparable across models — a model with bigger numbers wins on magnitude rather than fit. So each model's score is standardised against its own distribution, computed by Monte Carlo over 150k simulated profiles. Over 20k random profiles no model wins less than 6.8% or more than 16.7%.
> - PDF is generated client-side with pdfmake, lazily loaded so the landing page is 246KB.
>
> Honest limitations: the design decisions are reasoned from published research, not A/B tested on my own audience — I have no analytics, by choice. It's English-only right now, which is a real gap since the audience I originally had in mind was Spanish-speaking. And no document makes anyone money; reps do.
>
> Source is public, MIT: [repo URL]

**When people comment:** reply to everyone, quickly, without defensiveness. If someone finds a bug, thank them and fix it that day — visibly shipping a fix mid-thread does more for you than the post did.

---

## 2. Reddit

Read each sub's rules before posting. Getting banned in week two costs you that channel permanently, and there is no appeal worth the effort.

**Space these out over two to three weeks.** Posting to five subs in one day is the single most detectable spam pattern on Reddit.

### r/Entrepreneur — lead with the insight, not the tool

**Title:** `The reason most people never start isn't laziness — it's that all advice is written for people who already have customers`

> I've watched a lot of business content and noticed something that took me a while to name.
>
> Almost all of it is written for people who already have something. "Improve your conversion rate" — you have no traffic. "Raise your prices" — you have no customers. "Niche down" — you have no niche. The entire internet skipped step zero.
>
> The other problem is that everything contradicts everything, and both sides are right. One person says start with content, the next says content is a trap and you should cold call. Both are correct — for different businesses, with different margins, at different stages. Neither tells you which one you are. So generic advice is generic because it has to work for everyone, which means it's optimised for nobody.
>
> The thing I think actually helps is filtering rather than more information:
>
> **Your available capital and your available hours eliminate most business models before you start.** If you have $0 and five hours a week, print-on-demand and micro-SaaS are already out — not because they're bad, but because one needs ad budget to survive and the other needs sustained deep work. That's most of the decision made, before any question of passion.
>
> **Your industry decides who your customer is and what you can charge, and that's more actionable than any general advice.** Food is 30% ingredient cost and a hygiene registration you legally need. Beauty is entirely about rebooking, not first bookings. Local services live or die on route density — two jobs on one street beat three across town. None of that is transferable, and all of it matters more than "provide value."
>
> **Whatever you did for work is an asset you're probably discounting.** Retail is the best sales training there is, because you did it live at volume with no script. Hospitality builds real speed under pressure, and delivery is where most first businesses quietly fail.
>
> I built a free tool that does this filtering — 15 questions, spits out a personalised PDF. No email, no account, nothing to buy, and the source is public. [URL]. Mostly posting for the reasoning above though; take that and ignore the link if you want.

### r/smallbusiness — shorter, more practical, less philosophy

**Title:** `Made a free tool that tells you which business to start based on your actual constraints (no email required)`

> Built this because every free business resource I found wanted an email address and turned out to be a funnel.
>
> 15 questions — money you can afford to lose, hours you can protect, what you've done for work, what you have in mind. It scores you against 10 models that start at $0–$300 and generates a PDF with the specifics: who buys in your industry, real price anchors, one acquisition channel with a script, a 90-day plan, and the licensing to check before you take money (food hygiene, beauty licensing, trades insurance — the stuff nobody mentions).
>
> No signup, no email, no paid tier, nothing behind it. Runs entirely in your browser, source is public.
>
> [URL]
>
> Genuinely want to know if the recommendation feels wrong for anyone — that's a scoring weight and I can fix it.

### r/SideProject — build-in-public framing, technical honesty

**Title:** `Built a personalised business-plan generator with no backend at all — one HTML file, $0/month forever`

> The constraint I set myself: it has to cost me nothing to run, forever, and it has to collect nothing.
>
> Result is a single HTML file. Quiz runs in the browser, scoring is a deterministic weight model (not an LLM — same inputs always give the same document), and the 15-page PDF is generated client-side with pdfmake. Fonts self-hosted, PDF library vendored, no third-party requests anywhere. Hosted on GitHub Pages, so genuinely $0/month at any traffic I'll realistically get.
>
> The $0 constraint produced the best decision in the whole thing: **no email capture.** A version with a backend would almost certainly have gated the PDF behind an email, because the business model would have demanded it. Being broke forced the design that makes it trustworthy.
>
> [URL] — source public, MIT.
>
> Happy to answer anything about the scoring, that was the interesting part.

### r/EntrepreneurRideAlong

Lurk for a week first. This sub rewards ongoing progress updates more than launches — post here *after* your ten-person test, framed as "here's what I learned watching ten people use the thing I built", with the actual findings. That post will outperform a launch post substantially.

---

## 3. Indie Hackers

Long-form, build-in-public, honest about numbers. This audience genuinely rewards free tools and transparent write-ups.

**Title:** `I built a free tool with no backend, no email capture, and no business model — on purpose`

Structure:
1. **The problem** — every free business guide is bait; the audience has learned to distrust free
2. **The counter-positioning** — competitors can't remove their email gate without breaking their own funnel; that's a real moat for a free tool, and it's the only one available
3. **The build** — one HTML file, deterministic scoring, client-side PDF, $0 hosting
4. **The interesting technical problem** — normalising scores across models so weight magnitude doesn't decide the winner
5. **What I don't know** — no analytics by choice, so no conversion data; English-only; unproven whether anyone acts on it
6. **What's next** — ten-person test, then Spanish

End with the link and a specific ask: *"If you take it, tell me whether the recommendation felt right — that's the one thing I can't find out any other way."*

---

## 4. Ten short-form video scripts

One a day, 30–45 seconds each, one platform. Screen-record the questionnaire for the ones that call for it — **the personalisation is the hook**, so show the result appearing.

Lead with the useful thing. Say the link once at the end, or not at all for the first ten posts.

1. **"The business you should start if you have $0 and 5 hours a week."** Rule out everything that needs capital or deep work, land on service or local. Show the result screen.
2. **"'Follow your passion' is bad business advice."** Passion is an input, not a business model. Plenty of people love things nobody pays for. Here's how to check first.
3. **"Everything you've heard about business contradicts itself — here's why both sides are right."** Cold email vs content, for different margins.
4. **"I built a free tool that tells you what business to start. Here's how it decides."** Show the scoring logic — the data is the hook for this audience.
5. **"The one number that predicts whether you'll actually start a business."** Offers made to real humans. Nothing else.
6. **"Your job is worth more than you think."** Retail → sales training. Hospitality → speed under pressure. Trades → you can charge in week one.
7. **"Why your business idea doesn't need to be original."** Distribution beats product. The better mousetrap doesn't win.
8. **"Three businesses you can start today with literally zero dollars."** Name them, name the first action for each.
9. **"The reason you can't think of a business idea."** It's a contact problem, not a knowledge problem. Twenty conversations beats two hundred hours of videos.
10. **"I asked people what stopped them from starting. Here's the most common answer."** Then answer it properly.

---

## 5. SEO — the slow compounding one

Free, and worth nothing for six months, then worth a lot. One genuinely excellent page per question, each ending at the questionnaire:

- "what business can I start with no money at 17"
- "how to start a business with $0"
- "business ideas for teenagers"
- "how much does it cost to start a business"
- "what business should I start quiz"

These are pages on your site, not blog posts elsewhere. Add them as separate HTML files in the repo. Do this last — it's the lowest-urgency, highest-patience item on the list.

---

## Sequencing

| When | Do |
|---|---|
| Week 0 | Ten-person test. Fix what three or more people hit. |
| Week 1 | r/SideProject and Indie Hackers — friendliest audiences, lowest stakes, good practice |
| Week 2 | r/smallbusiness and r/Entrepreneur, spaced apart |
| Week 3 | Show HN — by now you've had feedback and fixed the obvious things |
| Weeks 3–12 | One short-form video a day, one platform |
| Month 3+ | SEO pages, and r/EntrepreneurRideAlong with your ten-person findings |

**Track only one number: completed questionnaires and downloaded playbooks.** You don't have analytics, so this comes from the feedback form and from asking. That's a real limitation and it's the price of the privacy promise — worth paying, but be honest with yourself that you're flying partly blind.
