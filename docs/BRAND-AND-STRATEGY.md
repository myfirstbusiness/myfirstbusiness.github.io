# myfirstbusiness.com — Brand & Design Rationale

**Every choice below is a decision with a reason attached. Where the evidence is thin, this document says so rather than dressing opinion up as science.**

---

## 0. The honest framing on "100% effective"

You asked for a design researched to 100% effectiveness. Here is the truthful version, because a document that flatters you is worthless:

**No design is 100% effective, and anyone who tells you otherwise is selling something.** What genuinely exists is a set of design decisions with real evidence behind them, and a much larger set of decisions that are conventions dressed up as science. Colour psychology is mostly the second kind. The claim that "orange buttons convert 32% better" traces back to a handful of single-site A/B tests with tiny samples and no replication.

What the evidence actually supports is narrower and more useful:

1. **Contrast beats hue.** The mechanism behind every famous "button colour" result is the **Von Restorff effect** — the isolated element gets attention. Any colour that stands apart from its surroundings outperforms one that blends in. The specific hue is close to irrelevant. This is the single most robust finding in the area, and it is the one this design is built on.
2. **Colour carries reliable personality associations.** Labrecque & Milne's *Exciting red and competent blue* (Journal of the Academy of Marketing Science) established that hue shifts perceived brand personality along measurable dimensions — red toward excitement, blue toward competence. This affects how a brand *feels*, not directly how many people click.
3. **Copy outperforms colour by a wide margin.** Identity- and value-framed button labels ("Build my playbook") consistently beat action framing ("Submit"). This is a first-order effect; colour is second-order.
4. **Fewer questions means more completions — but relevance beats brevity.** Lead-capture forms with 10 questions complete about 28% less often than 3-question forms. But quizzes whose questions the audience genuinely wants answered for themselves complete at ~65% and convert to lead at ~40% (Interact's 2026 report across coaching, e-commerce and services).
5. **For this audience, credibility comes from data and usefulness — not polish.** 67% of Gen Z say data and statistics build their confidence in a brand; 70% find a brand more credible when it shares genuinely useful content. What actively destroys trust is over-polished, promotional, inauthentic messaging.

So the design brief became: **one isolated action colour, maximum contrast, plain-spoken copy, visible numbers, and zero sales pressure.**

---

## 1. Positioning

| | |
|---|---|
| **Category** | Free diagnostic tool, not a course, newsletter, or community |
| **For** | 16–28 year olds who want to start something and have no idea what step one is |
| **Against** | The infinite supply of generic business advice optimised for everyone and therefore for nobody |
| **Promise** | A specific business, a specific price, a specific channel, and a specific 90-day plan — in four minutes |
| **Proof** | Twelve documented universal laws, ten scored models, a transparent engine, and no email gate |
| **Enemy** | The free-thing-as-bait economy that taught this audience to distrust anything free |

**Positioning statement:** *For young people who want to start a business but don't know where to begin, myfirstbusiness.com is a free diagnostic that turns twelve honest answers about your money, time and skills into one specific, sequenced plan — because the bottleneck was never a lack of information, it was not knowing which part applies to you.*

The strategic move is **counter-positioning**. Every competitor's free tool exists to capture an email and sell something later. This one cannot do that — there is no email field and no product behind it. Competitors cannot copy that without destroying their own business model. That is a real, if unusual, moat: *7 Powers* would call it counter-positioning, and it is the only defensible advantage a free tool can have.

---

## 2. The palette

The rule that generates the whole system: **exactly one colour means "act". It appears nowhere else.**

| Token | Hex | Role | Why |
|---|---|---|---|
| `--ink` | `#05070C` | Page base | Near-black gives the maximum contrast headroom for a single accent to dominate. A light base would force the accent to fight the whole page. |
| `--ink-2/3/4` | `#0A0E16` → `#182033` | Surfaces | Blue-shifted neutrals; keeps the dark from reading as muddy brown. |
| `--volt` | `#C8FF3C` | **Primary action only** | 17:1 contrast on the base — the highest-signal element on any screen by a wide margin (Von Restorff). Green also carries go / growth / money associations, which fit "make actual money", and it is deliberately *not* the fintech blue-and-orange everyone else uses. |
| `--ember` | `#FF6B2C` | Emphasis, sparing | Warm urgency for the problem section only. Used on four elements total. |
| `--text` | `#EAEEF5` | Body | 17.3:1. |
| `--text-2` | `#98A4B8` | Secondary | 8.0:1 — comfortably above AA for body text. |

**Where's the trust blue?** Deliberately absent. Blue would push the brand toward "competent institution", which is the wrong register for 17-year-olds who distrust polish. The Gen Z research is explicit that credibility here comes from data, useful content and transparency — so trust is built with a visible stats strip, named frameworks, a published method, and blunt copy about what the site is *not*. Adding a third hue would also dilute the isolation effect, which is the one thing actually doing work.

**Contrast audit:** every foreground/background pair in the site and the PDF was computed against WCAG. All pass AA; body text passes AAA. The audit is reproducible — the ratios are in the build notes.

---

## 3. Typography

- **Archivo** (variable, 600–900) for display. A grotesque with heavy weights and tight tracking — reads as confident and modern rather than corporate.
- **Inter** for body. The most legible screen sans available, and free.
- **JetBrains Mono** for numbers, labels and metrics. Monospace signals *data*, which is exactly the credibility lever the Gen Z research identifies. Every statistic on the page is set in it.

All three are **self-hosted** (latin subsets, ~105KB total). No Google Fonts request. This matters: the site claims nothing leaves your device, and that claim should be literally true, not true-with-an-asterisk.

---

## 4. Conversion architecture

Applied deliberately, and each one traceable:

| Decision | Reason |
|---|---|
| **No email gate** | The single largest drop-off point in any lead magnet, removed entirely. Also the entire differentiator — it's what makes "free" believable to an audience trained to expect bait. |
| **12 questions, one per screen** | Completion falls sharply with question count, but relevance matters more. Every question changes the output, and one-per-screen with auto-advance keeps *perceived* effort near zero. |
| **Auto-advance on single-select** | Removes a click per question — 12 fewer actions across the flow. The Continue button is hidden where it does nothing, so it never sits greyed-out looking broken. |
| **Progress bar + "05 / 12"** | Reduces the uncertainty that causes mid-form abandonment. |
| **Identity-framed CTA** | "Build my playbook" over "Start" or "Submit". Value/identity framing consistently beats action framing. |
| **Visible stats strip** | 67% of Gen Z cite data and statistics as what builds confidence. Four numbers, above the fold. |
| **"What this isn't" section** | Voluntarily stating limits is the highest-credibility move available to a free product, and it directly answers the "what's the catch" instinct. |
| **A build sequence before the result** | Seven visible steps. Makes the personalisation legible instead of instant-and-suspicious. |
| **The result is shown before the download** | The user sees the recommendation and the reasoning on screen first. The PDF is depth, not the reveal. |

---

## 5. The recommendation engine

Ten models, each startable at $0–$300 with a realistic first customer inside 90 days: skill service, local operation, productized service, audience/creator, digital product, print-on-demand store, flipping, micro-SaaS, teaching, community & events.

**How scoring works.** Each model carries a weight table across six dimensions (working style, sales comfort, urgency, risk tolerance, market reach, ambition) plus capped skill and interest matching, hard capital and time constraints, and small nudges based on the user's stage and stated blocker.

**The important detail:** raw weight sums are *not* comparable across models — a model with larger weights would win on magnitude rather than on fit. So each model's raw score is standardised against its own distribution over the whole answer space, using means and standard deviations computed by Monte Carlo over 120,000 simulated profiles. The displayed score answers the right question: *how unusually well does this person fit this model, compared to everyone else?*

**Validation.** Over 20,000 randomly generated profiles, no model wins less than 7.5% or more than 15% of the time — so the recommendation genuinely responds to the answers instead of funnelling everyone to one default. Hand-built archetype profiles (broke 16-year-old with no skills; coder with patience and ambition; natural teacher; video-native who hates selling) each return the obviously correct model. Winning scores land between 81 and 95, and the gap to second place is usually 3–8 points — which is honest: for most people two or three models are genuinely viable, and the document says so.

**Determinism.** Same answers in, same document out, every time. No randomness, no model call, no drift. That is a real advantage over "ask a chatbot" and it's stated on the page.

---

## 6. What would make this better, in order

1. **Real conversion data.** Everything above is reasoning from published research; none of it is measured on *this* site with *this* audience. Add a privacy-respecting counter (question reached, PDF generated — no personal data) and the guesses become facts.
2. **Spanish.** The original brief targets Spanish speakers; the site currently ships English-only by decision. The content layer is fully separable, so this is a translation job, not a rebuild.
3. **A "what happened" follow-up.** The one metric that matters is offers made to real humans. A simple returning-visitor flow that asks "how many have you made?" would produce the only genuinely valuable data this project could collect.
4. **More models, or deeper ones.** Ten covers most beginners. Sub-variants by industry would make the recommendation sharper.

---

## Sources

- [CTA Button Psychology: Size, Color, Copy, and the Research Behind What Actually Matters — Atticus Li](https://atticusli.com/blog/posts/cta-button-psychology-size-color-copy-research/) — Von Restorff / isolation effect, copy framing, the case against the button-colour myth
- [Exciting red and competent blue: the importance of color in marketing — Labrecque & Milne, Journal of the Academy of Marketing Science](https://link.springer.com/article/10.1007/s11747-010-0245-y) — colour and brand personality
- [Quiz Conversion Rate Report 2026 — Interact](https://www.tryinteract.com/blog/quiz-conversion-rate-report/) — 65% start-to-finish, 40.1% start-to-lead, relevance over execution
- [75+ Online Form Statistics: Completion, Abandonment, and Design — Crazy Egg](https://www.crazyegg.com/blog/form-statistics/) — field count vs completion, abandonment rates, progressive disclosure
- [Where Gen Z spends their time, and what actually earns their trust — Talker Research](https://talkerresearch.com/where-gen-z-spends-their-time-and-what-actually-earns-their-trust/) — 67% data/statistics, 70% useful content, distrust of polish
- [How color psychology in UX design impacts conversion rates — UserTesting](https://www.usertesting.com/blog/color-ux-conversion-rates)
- Business frameworks throughout: Hormozi (Value Equation, Core Four), Goldratt (Theory of Constraints), Porter (Five Forces), Helmer (7 Powers), Christensen (Jobs To Be Done), Cialdini (Influence), Sharp (*How Brands Grow*), Abraham (three ways to grow) — via the Business Mastery Curriculum supplied as the project brief.
