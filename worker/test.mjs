/* Exercises the Worker without a Gemini key, by stubbing the upstream.
   Covers the paths that would otherwise only be discovered in production:
   origin locking, the rate limiter, the model fallback chain, quota versus
   outage, and the shaping that decides whether a thin answer is worth
   returning at all. */
import worker from './src/index.js';

const ORIGIN = 'https://myfirstbusiness.github.io';
const BODY = {
  idea: 'candles exporting', industry: 'Products & retail', model: 'The Flip',
  modelLine: 'Buy underpriced, sell at market.', career: 'retail, one to three years',
  capital: '$300', time: '20 hours a week', urgency: 'soon', sales: 'nervous',
  skills: 'practical work, organising', reach: 'both', goal: 'side income',
  blocker: 'never started'
};

const FULL = {
  read: 'You make soy candles and sell them wholesale to shops.',
  viable: 'Doable on $300, but export shipping will eat the margin early.',
  offer: { headline: 'Case packs of 12 soy candles', includes: ['12 per case', 'Four-week restock', 'Free breakage replacement'], excludes: 'Refuse custom scents at first.' },
  pricing: { tiers: [{ name: 'Trial', what: 'One case', price: '$96-$120' }, { name: 'Standing', what: 'Three cases', price: '$255-$310' }, { name: 'Own-label', what: 'Six cases', price: '$620-$760' }], note: 'Wholesale, not shelf price.' },
  channel: { where: 'Independent gift shops and florists.', script: 'Hi [name] - I make soy candles nearby.', volume: 'Twenty shops a week.' },
  specifics: [{ title: 'Wax melts in transit', body: 'Soy softens near 120F.' }, { title: 'Labelling law', body: 'CLP labelling is required in the EU.' }, { title: 'Customs per shipment', body: 'HS heading 3406, $15-$40 brokerage.' }],
  firstTen: ['Pour three batches', 'Photograph one', 'Get insurance', 'Print labels', 'List forty shops', 'Walk into five', 'Leave samples', 'Return in seven days', 'Take a first order', 'Ask for referrals'],
  numbers: { lines: ['Cost per candle $3.90-$5.20', 'Wholesale $8-$10', 'Case contributes $48', 'Break-even six cases'], watch: 'Reorder rate.' },
  week1: ['Pour three batches.', 'Price one honestly.', 'Quote insurance.', 'List forty shops.', 'Visit five.'],
  risks: [{ title: 'Labelling law', body: 'Not optional.' }, { title: 'Capital in one batch', body: 'Pour small.' }, { title: 'Export too early', body: 'Prove domestic first.' }]
};

function upstream(status, payload, opts = {}) {
  const seen = [];
  globalThis.fetch = async (url) => {
    seen.push(String(url));
    if (opts.notFoundUntil && seen.length <= opts.notFoundUntil) {
      return new Response('{}', { status: 404 });
    }
    if (status !== 200) return new Response('{}', { status });
    return new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  return seen;
}

const env = { GEMINI_API_KEY: 'test-key' };
const req = (origin = ORIGIN, body = BODY, method = 'POST') =>
  new Request('https://w.dev/', {
    method,
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '1.2.3.4' },
    body: method === 'POST' ? JSON.stringify(body) : undefined
  });

let pass = 0, fail = 0;
async function check(name, fn) {
  try { await fn(); console.log('  pass  ' + name); pass++; }
  catch (e) { console.log('  FAIL  ' + name + '  -> ' + e.message); fail++; }
}
const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); };

console.log('worker');

await check('rejects an unknown origin', async () => {
  upstream(200, FULL);
  const r = await worker.fetch(req('https://evil.example'), env);
  eq(r.status, 403, 'status');
});

await check('answers CORS preflight', async () => {
  const r = await worker.fetch(req(ORIGIN, BODY, 'OPTIONS'), env);
  eq(r.status, 204, 'status');
  eq(r.headers.get('Access-Control-Allow-Origin'), ORIGIN, 'allow-origin');
});

await check('refuses to run with no API key', async () => {
  const r = await worker.fetch(req(), {});
  eq(r.status, 503, 'status');
  eq((await r.json()).error, 'unconfigured', 'error');
});

await check('honours the rate limiter', async () => {
  upstream(200, FULL);
  const r = await worker.fetch(req(), { ...env, MFB_LIMIT: { limit: async () => ({ success: false }) } });
  eq(r.status, 429, 'status');
  eq((await r.json()).error, 'rate', 'error');
});

await check('returns a shaped payload on success', async () => {
  upstream(200, FULL);
  const r = await worker.fetch(req(), env);
  eq(r.status, 200, 'status');
  const d = await r.json();
  eq(d.ok, true, 'ok');
  eq(d.ai.tiers.length, 3, 'tiers');
  eq(Array.isArray(d.ai.tiers[0]), true, 'tier is a triple');
  eq(d.ai.firstTen.length, 10, 'firstTen');
  eq(d.ai.specifics.length, 3, 'specifics');
  eq(d.ai.headline, 'Case packs of 12 soy candles', 'headline lifted out of offer');
  eq(d.ai.econWatch, 'Reorder rate.', 'econWatch lifted out of numbers');
});

await check('falls through a retired model name', async () => {
  const seen = upstream(200, FULL, { notFoundUntil: 1 });
  const r = await worker.fetch(req(), env);
  eq(r.status, 200, 'status');
  eq(seen.length, 2, 'attempts');
  eq(seen[1].includes('gemini-2.5-flash:'), true, 'second model tried');
});

await check('reports quota separately from an outage', async () => {
  upstream(429, null);
  eq((await (await worker.fetch(req(), env)).json()).error, 'quota', 'quota');
  upstream(500, null);
  eq((await (await worker.fetch(req(), env)).json()).error, 'upstream', 'outage');
});

await check('rejects a near-empty answer instead of shipping holes', async () => {
  upstream(200, { read: 'hi', viable: '', offer: {}, pricing: {}, channel: {}, specifics: [], firstTen: [], numbers: {}, week1: [], risks: [] });
  const r = await worker.fetch(req(), env);
  eq(r.status, 503, 'status');
  eq((await r.json()).error, 'thin', 'error');
});

await check('drops a short tier list rather than printing two of three', async () => {
  const short = JSON.parse(JSON.stringify(FULL));
  short.pricing.tiers = short.pricing.tiers.slice(0, 2);
  upstream(200, short);
  const d = await (await worker.fetch(req(), env)).json();
  eq(d.ai.tiers, null, 'tiers nulled');
  eq(d.ai.firstTen.length, 10, 'other fields survive');
});

await check('strips control characters and angle brackets from the idea', async () => {
  let promptSeen = '';
  globalThis.fetch = async (u, o) => {
    promptSeen = JSON.parse(o.body).contents[0].parts[0].text;
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(FULL) }] } }] }), { status: 200 });
  };
  await worker.fetch(req(ORIGIN, { ...BODY, idea: '<script>alert(1)</script> candles exporting' }), env);
  eq(promptSeen.includes('<script>'), false, 'no raw tags reach the prompt');
  eq(promptSeen.includes('scriptalert(1)/script candles exporting'), true, 'text survives, markup does not');
});

await check('survives a non-JSON upstream body', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text: 'not json at all' }] } }]
  }), { status: 200 });
  const r = await worker.fetch(req(), env);
  eq(r.status, 503, 'status');
  eq((await r.json()).error, 'parse', 'error');
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
