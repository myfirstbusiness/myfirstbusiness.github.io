# Switching the writer on

**Time: about 20 minutes, all of it in a browser. Cost: $0, and structurally impossible to become anything else.**

Right now this is shipped **off**. The site behaves exactly as it does today — no consent screen, no AI mentioned anywhere, no network request of any kind. Nothing below is urgent, and if you never do it the site still works.

When you finish these six steps, the questionnaire ends with a choice between two playbooks, and the "written for my idea" one is the fix for the thing all three of your testers said.

---

## Why it can't cost you money

This is the part worth understanding before you touch anything, because "AI feature on a free site" is normally how a teenager wakes up to a $400 bill.

**There is no card anywhere in this.** Google's Gemini free tier does not ask for one, and a free-tier key that runs out of quota returns an error — it does not switch to paid and start charging. Cloudflare Workers' free plan does not ask for one either.

So the worst possible day looks like this: the site gets far more traffic than expected, the daily quota runs out, and everyone who arrives after that gets the offline playbook instead. Which is a complete 15-page document. **That is the failure mode. Not a bill.**

The one rule: **never add a payment method to either account.** The moment you do, the ceiling stops being a ceiling.

---

## Step 1 — Get a Gemini API key

1. Go to **https://aistudio.google.com/apikey**
2. Sign in with the Google account you made for this project (not your personal one).
3. **Create API key** → pick the default project when it offers.
4. Copy it. It starts with `AIza`.

**Do not paste this key into a chat, a commit, a screenshot, or the website.** It goes into exactly one place, in step 3. If it ever does leak, delete it on that page and make a new one — that costs you nothing and takes a minute.

> This is the same mistake that cost us the GitHub token a few weeks ago. Same rule, same fix. While you're thinking about it: check that old token is actually gone at **https://github.com/settings/personal-access-tokens** — it was posted in a chat, so it has to be treated as public forever.

---

## Step 2 — Make a Cloudflare account

1. **https://dash.cloudflare.com/sign-up** — email and password, no card.
2. Verify the email.

You need this because an API key cannot live in a public HTML file. Anyone could read it, and the whole site is one public HTML file. The Worker is a tiny server whose only job is to hold the key so the browser never sees it.

---

## Step 3 — Create the Worker and paste the code in

All of this is point-and-click in the browser. No terminal, nothing to install.

1. In the Cloudflare dashboard, left sidebar → **Compute (Workers)** → **Workers & Pages**.
2. **Create** → **Start with Hello World!** → **Get started**.
3. Name it **`mfb-writer`** → **Deploy**. It deploys a placeholder in a few seconds.
4. Click **Edit code** (top right of the Worker's page).
5. In another tab, open your repo file **`worker/src/index.js`** on GitHub, click the **Raw** button, then **Ctrl+A**, **Ctrl+C**.
6. Back in the Cloudflare editor: click in the code panel, **Ctrl+A**, **Ctrl+V** to replace everything with what you copied.
7. **Deploy** (top right) → confirm.

On the Worker's overview page there is a URL like `https://mfb-writer.something.workers.dev`. **Copy it somewhere** — you need it in step 5.

> Opening that URL in a browser shows an error. That is correct. It only answers POST requests from your site, and a browser address bar sends a GET from the wrong origin.

### Step 4 — Give the Worker the key

1. On the Worker's page → **Settings** → **Variables and Secrets**.
2. **Add** → type **Secret** → name it exactly **`GEMINI_API_KEY`** → paste the key from step 1 as the value.
3. **Deploy** / Save.

Secrets are write-only. Cloudflare will never show it back to you, and it is not in your repo — which is the entire reason this Worker exists.

### Optional, and skippable — the burst limiter

`worker/wrangler.toml` sets up a rate limiter that stops one person hammering the endpoint. Pasting the code in the dashboard does **not** create that binding, and that is fine: the Worker checks whether it exists and skips it if it doesn't. Gemini's daily cap is still the real ceiling, and it errors rather than bills. If the site ever gets enough traffic to care, add the binding then.

## Step 5 — Turn it on

One line, edited on GitHub in the browser:

1. Open `parts/03b-context.js` in your repo.
2. Click the pencil icon.
3. Find `const WRITER_URL = '';` (section **1e**, near the bottom).
4. Put your Worker URL inside the quotes:
   ```js
   const WRITER_URL = 'https://mfb-writer.something.workers.dev';
   ```
5. Commit.

The build Action rebuilds `index.html` and the site is live about a minute later. That single line is the on/off switch for the entire feature — emptying it again turns everything off, including the consent screen and every mention of AI on the page.

---

## Step 6 — Check it, properly

Open the site on your phone. Run the questionnaire. Type a real idea — a weirdly specific one is the better test.

**What should happen:**

- After the last question you get a screen headed *"Two ways to build your playbook."*
- Choose **Write it for my idea**. The build animation runs about five seconds longer than usual.
- The result screen leads with a sentence describing *your* business, not a category.
- The PDF is 17–19 pages instead of 15, and page 7 is headed **"What nobody tells you about this one"** — real costs, the licence that applies, the physical constraints.

**Then test the other branch.** Redo it and pick **Build it on this device**. You should get the 15-page document you have now, instantly, with no request leaving your phone.

**Then test the failure.** In the Cloudflare dashboard (Settings → Variables and Secrets), delete the `GEMINI_API_KEY` secret temporarily and run the questionnaire again choosing the AI branch. You should get a complete playbook plus an honest note saying the writer didn't answer. Put the secret back afterwards.

If all three behave, you're done.

---

## What it actually costs to run

| | |
|---|---|
| Cloudflare Workers free plan | 100,000 requests/day |
| Gemini free tier | Roughly 1,000+ playbooks/day, and it errors rather than bills |
| Per playbook | Around 3,000 tokens in, 2,000 out — free tier absorbs it |
| Your cost | **$0** |

If you ever outgrow the free tier, that is a genuinely good problem and the answer at that point is a paid tier with a hard spend cap — not before.

---

## What changed on the site, and why

**The privacy claim moved rather than disappeared.** It used to say *"Your answers never leave your device."* With the writer on, it says *"You choose whether anything leaves your device"* — and that is now literally true, because there is a real button for each.

This matters more than it looks. Your original differentiator against every other free business guide was that this one takes nothing. That is intact: the offline path still sends zero bytes, and the consent screen lists exactly what the other path sends. What you have now is a stronger position than either — most tools with an AI feature can't offer the no-network version at all, because they have no engine underneath. You do.

**The landing page rewrites itself.** The HTML ships with the old wording, which is the true wording when the writer is off. The moment `WRITER_URL` has a value, three bits of copy update themselves and an extra FAQ appears. You can't accidentally leave the page promising something it no longer does.

**The recommendation never changed.** The scoring engine still decides which model, deterministically, before the request goes out. Same answers, same verdict, whether the writer runs or not. The AI only rewrites prose inside a decision that was already made — which is why turning it off doesn't change what the site recommends to anybody.
