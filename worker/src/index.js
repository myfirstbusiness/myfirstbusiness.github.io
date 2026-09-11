/* =========================================================================
   myfirstbusiness.com — the writer
   -------------------------------------------------------------------------
   A single Cloudflare Worker. It is the only server this project has, and it
   exists for exactly one reason: an API key cannot live in a public HTML file.

   What it does
     - accepts the 15 answers plus the typed idea
     - asks Gemini to write the parts of the playbook that should be about
       THIS person's idea rather than about their category
     - returns strict JSON, or an error

   What it deliberately does not do
     - store anything (no KV, no D1, no logs of user text)
     - accept requests from anywhere except the site
     - cost money: the Gemini free tier returns 429 instead of billing, and
       there is no card on the account. The failure mode is "no AI today",
       never "a bill".

   If any of this breaks, the site falls back to the deterministic playbook
   and the user still gets their document. That is the whole safety design.
   ====================================================================== */

const ALLOWED = [
  'https://myfirstbusiness.github.io',
  'https://myfirstbusiness.com',
  'https://www.myfirstbusiness.com'
];

/* Model names change faster than this project will be redeployed. The Worker
   tries these in order and uses the first one the API recognises, so a model
   being renamed or retired degrades to the next entry instead of taking the
   feature down. Override the whole chain with the MFB_MODELS variable
   (comma-separated) without touching this file. */
const DEFAULT_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-flash-latest'
];
const UPSTREAM_TIMEOUT_MS = 14000;
const MAX_IDEA = 160;

/* ---------- CORS ---------------------------------------------------- */
function corsHeaders(origin) {
  const ok = ALLOWED.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin || '');
  return {
    'Access-Control-Allow-Origin': ok ? origin : ALLOWED[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
  });
}

/* ---------- input hygiene -------------------------------------------
   Everything from the browser is treated as hostile. The idea field is the
   only free text in the product, so it is the only injection surface, and
   it gets stripped, capped, and fenced inside the prompt below.            */
function clean(s, max) {
  return String(s == null ? '' : s)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')   // control characters
    .replace(/[<>]/g, '')                       // keeps the prompt fence intact
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/* ---------- the schema Gemini must fill ------------------------------
   Structured output, not free prose. The client merges these fields into a
   document that already exists, so a missing field degrades one section
   rather than breaking the PDF.                                            */
const SCHEMA = {
  type: 'object',
  properties: {
    read: { type: 'string' },
    viable: { type: 'string' },
    offer: {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        includes: { type: 'array', items: { type: 'string' } },
        excludes: { type: 'string' }
      },
      required: ['headline', 'includes', 'excludes']
    },
    pricing: {
      type: 'object',
      properties: {
        tiers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              what: { type: 'string' },
              price: { type: 'string' }
            },
            required: ['name', 'what', 'price']
          }
        },
        note: { type: 'string' }
      },
      required: ['tiers', 'note']
    },
    channel: {
      type: 'object',
      properties: {
        where: { type: 'string' },
        script: { type: 'string' },
        volume: { type: 'string' }
      },
      required: ['where', 'script', 'volume']
    },
    specifics: {
      type: 'array',
      items: {
        type: 'object',
        properties: { title: { type: 'string' }, body: { type: 'string' } },
        required: ['title', 'body']
      }
    },
    firstTen: { type: 'array', items: { type: 'string' } },
    numbers: {
      type: 'object',
      properties: {
        lines: { type: 'array', items: { type: 'string' } },
        watch: { type: 'string' }
      },
      required: ['lines', 'watch']
    },
    week1: { type: 'array', items: { type: 'string' } },
    risks: {
      type: 'array',
      items: {
        type: 'object',
        properties: { title: { type: 'string' }, body: { type: 'string' } },
        required: ['title', 'body']
      }
    }
  },
  required: ['read', 'viable', 'offer', 'pricing', 'channel', 'specifics', 'firstTen', 'numbers', 'week1', 'risks']
};

/* ---------- the prompt -----------------------------------------------
   The entire value of this Worker is in here. The deterministic engine
   already writes good advice about a CATEGORY. This has one job: write
   advice that could only have been written about THIS idea. Every
   instruction below is aimed at that, and the negative examples matter more
   than the positive ones.                                                  */
function buildPrompt(p) {
  return `You are writing sections of a business playbook for one specific person. It will be delivered as a PDF they keep. Write for a smart 19-year-old with no business background: plain words, short sentences, no jargon, no hype, no motivational filler.

THE PERSON
Their idea, in their own words: <<<${p.idea || '(they said they have nothing specific in mind yet)'}>>>
Field they picked: ${p.industry}
Recommended business model, chosen by the scoring engine: ${p.model} — ${p.modelLine}
Work history: ${p.career}
Money they can afford to lose: ${p.capital}
Hours per week they can protect: ${p.time}
Financial pressure: ${p.urgency}
Comfort asking for money: ${p.sales}
Skills they claim: ${p.skills}
Customers reachable: ${p.reach}
Goal in 12 months: ${p.goal}
What has stopped them before: ${p.blocker}

THE ONE RULE
A reader must be unable to swap their idea for a different one and have your text still make sense. If a sentence would be equally true for a lawn-care business and a candle business, delete it and write a real one.

Concretely that means:
- Name the actual things. Real materials, real equipment, real unit costs, real job titles of the people who buy, real places those people are found.
- Use numbers. Prices in USD with a range and a reason. Costs per unit. Time per job. If you are estimating, say roughly, but still give the number — a wrong number they can correct beats no number.
- Surface what only someone in this specific business would know: the licence or registration that applies, the thing that goes wrong on the first job, the hidden cost, the seasonality, the part that does not scale.

BANNED — these make the document worthless:
"provide value", "build your brand", "leverage social media", "identify your target audience", "the sky is the limit", "passion", "hustle", "game-changer", "in today's market", any sentence that begins "Remember,".
Do not invent statistics, studies, or named companies. Do not promise income.

THE MODEL VERSUS THE IDEA
The recommended model is the shape the engine thinks fits their constraints, and it is usually right. Use it. But what they typed is what they want to build, and that wins on substance: write about their actual business, run the way that model suggests.
If the two genuinely conflict - the model says resell and they clearly want to make the thing themselves - write about the business they described, and spend one sentence of the "viable" field saying plainly what the recommended model would change and why the engine leaned that way. Never quietly write about a different business than the one they typed, and never tell them the recommendation is wrong.

If their idea is vague, one word, or contradicts the field they picked, do not complain and do not ask questions. Pick the most reasonable concrete reading of it, say what you assumed in the "read" field in one sentence, and write the rest as if that reading is correct.
If they gave no idea at all, invent one specific, sensible starter business that fits every constraint above, state it plainly in "read", and write everything else about that one business.

WHAT EACH FIELD IS
read: 2-3 sentences. What you understood their business to be, made concrete — what exactly gets sold, to exactly whom. If you had to assume something, say so here.
viable: 2-3 sentences. The honest case for and against this idea given their money, hours and pressure. Say the real risk out loud. Do not soften it and do not talk them out of it.
offer.headline: one sentence they could put at the top of a page and someone would understand what they are buying.
offer.includes: 3-5 items, each a concrete deliverable, not a benefit.
offer.excludes: one sentence on what they should refuse to do at the start, and why refusing it protects them.
pricing.tiers: exactly 3, cheapest first, each with a name a customer would understand, what is in it, and a starting price in USD as a range.
pricing.note: one paragraph on why these numbers and what specifically justifies charging more later.
channel.where: where these exact customers physically or digitally are. Name the kinds of places.
channel.script: the actual message they send, 40-80 words, ready to copy. Their words, not corporate ones. No placeholders except [name].
channel.volume: how many of these to send per week to expect a first customer, and roughly what reply rate is normal here.
specifics: 4-6 items. THIS IS THE MOST IMPORTANT FIELD. Each is a fact about this exact business someone would otherwise learn the hard way — regulation, a real cost, a physical constraint, a shipping or storage problem, a seasonal pattern, a supplier trap. Title is 2-5 words. Body is 2-4 sentences with numbers where possible.
firstTen: exactly 10 items. Physical actions in order to get the first ten customers, specific to this business — named types of places to walk into, exact people to message, the order to do it in. Not strategy. Actions.
numbers.lines: 4-6 lines of unit economics for this exact business, each with real figures. e.g. "Wax and wick for one 8oz candle: roughly $2.40-$3.10, so a $18 retail price leaves about $15 gross before packaging."
numbers.watch: the single number that will tell them first if this is working or not, and what value is bad.
week1: exactly 5 actions for their first seven days, doable inside the hours they said they have. Each starts with a verb.
risks: exactly 3. Title plus 2-3 sentences. At least one must be a legal, licensing, insurance, tax or customs issue that genuinely applies to this specific business — if none applies, say plainly that none does and name the one that would if they grew.

Return only the JSON object.`;
}

/* ---------- output hygiene -------------------------------------------
   The model is well behaved, but this document gets printed with the user's
   name on it. Trim to sane lengths and drop anything empty so the client can
   fall back per-field rather than per-document.                            */
function sane(s, max) {
  const t = clean(s, max);
  return t.length ? t : null;
}
function saneList(arr, n, max) {
  if (!Array.isArray(arr)) return null;
  const out = arr.map(x => sane(x, max)).filter(Boolean).slice(0, n);
  return out.length ? out : null;
}
function shape(d) {
  if (!d || typeof d !== 'object') return null;
  const out = {
    read: sane(d.read, 600),
    viable: sane(d.viable, 700),
    excludes: sane(d.offer && d.offer.excludes, 400),
    headline: sane(d.offer && d.offer.headline, 240),
    includes: saneList(d.offer && d.offer.includes, 5, 220),
    tiers: Array.isArray(d.pricing && d.pricing.tiers)
      ? d.pricing.tiers.slice(0, 3)
          .map(t => [sane(t.name, 60), sane(t.what, 260), sane(t.price, 60)])
          .filter(t => t[0] && t[1] && t[2])
      : null,
    pricingNote: sane(d.pricing && d.pricing.note, 700),
    where: sane(d.channel && d.channel.where, 600),
    script: sane(d.channel && d.channel.script, 900),
    volume: sane(d.channel && d.channel.volume, 400),
    specifics: Array.isArray(d.specifics)
      ? d.specifics.slice(0, 6)
          .map(s => [sane(s.title, 70), sane(s.body, 600)])
          .filter(s => s[0] && s[1])
      : null,
    firstTen: saneList(d.firstTen, 10, 260),
    econLines: saneList(d.numbers && d.numbers.lines, 6, 300),
    econWatch: sane(d.numbers && d.numbers.watch, 400),
    week1: saneList(d.week1, 5, 260),
    risks: Array.isArray(d.risks)
      ? d.risks.slice(0, 3)
          .map(r => [sane(r.title, 70), sane(r.body, 600)])
          .filter(r => r[0] && r[1])
      : null
  };
  if (!out.tiers || out.tiers.length < 3) out.tiers = null;
  if (!out.specifics || out.specifics.length < 3) out.specifics = null;
  if (!out.risks || out.risks.length < 2) out.risks = null;
  // If the model gave us almost nothing, say so rather than shipping a
  // half-empty document that looks broken.
  const filled = Object.values(out).filter(Boolean).length;
  return filled >= 8 ? out : null;
}

/* ---------- handler --------------------------------------------------- */
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'method' }, 405, origin);
    }
    // Locked to the site. A public endpoint with a key behind it is someone
    // else's free API within a week.
    if (!ALLOWED.includes(origin) && !/^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return json({ error: 'origin' }, 403, origin);
    }
    if (!env.GEMINI_API_KEY) {
      return json({ error: 'unconfigured' }, 503, origin);
    }

    // Burst protection per IP. The daily ceiling is Gemini's own free-tier
    // limit, which errors rather than charges — so the worst case here is
    // that the site quietly goes back to deterministic playbooks.
    if (env.MFB_LIMIT) {
      const ip = request.headers.get('CF-Connecting-IP') || 'anon';
      const { success } = await env.MFB_LIMIT.limit({ key: ip });
      if (!success) return json({ error: 'rate' }, 429, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'body' }, 400, origin);
    }

    const p = {
      idea: clean(body.idea, MAX_IDEA),
      industry: clean(body.industry, 60),
      model: clean(body.model, 60),
      modelLine: clean(body.modelLine, 200),
      career: clean(body.career, 90),
      capital: clean(body.capital, 60),
      time: clean(body.time, 60),
      urgency: clean(body.urgency, 90),
      sales: clean(body.sales, 90),
      skills: clean(body.skills, 240),
      reach: clean(body.reach, 90),
      goal: clean(body.goal, 90),
      blocker: clean(body.blocker, 90)
    };
    if (!p.model || !p.industry) return json({ error: 'body' }, 400, origin);

    const models = (env.MFB_MODELS ? String(env.MFB_MODELS).split(',') : DEFAULT_MODELS)
      .map(s => s.trim()).filter(Boolean);

    const payload = JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: buildPrompt(p) }] }],
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
        responseSchema: SCHEMA
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
      ]
    });

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), UPSTREAM_TIMEOUT_MS);

    try {
      let r = null;
      for (const name of models) {
        r = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/' + name + ':generateContent',
          {
            method: 'POST',
            signal: ctl.signal,
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': env.GEMINI_API_KEY
            },
            body: payload
          }
        );
        // 404 means that model name no longer exists — try the next one.
        // Anything else (including 429) is a real answer; stop here.
        if (r.status !== 404) break;
      }

      if (!r || !r.ok) {
        // 429 here is the free-tier daily cap. It is not an outage and it is
        // not a bill — it is the budget doing its job.
        return json({ error: r && r.status === 429 ? 'quota' : 'upstream' }, 503, origin);
      }

      const data = await r.json();
      const text = data && data.candidates && data.candidates[0]
        && data.candidates[0].content && data.candidates[0].content.parts
        && data.candidates[0].content.parts[0]
        && data.candidates[0].content.parts[0].text;
      if (!text) return json({ error: 'empty' }, 503, origin);

      let parsed;
      try { parsed = JSON.parse(text); }
      catch { return json({ error: 'parse' }, 503, origin); }

      const out = shape(parsed);
      if (!out) return json({ error: 'thin' }, 503, origin);

      return json({ ok: true, ai: out }, 200, origin);

    } catch (e) {
      return json({ error: e.name === 'AbortError' ? 'timeout' : 'net' }, 503, origin);
    } finally {
      clearTimeout(timer);
    }
  }
};
