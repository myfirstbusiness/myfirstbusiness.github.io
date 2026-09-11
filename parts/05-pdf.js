
/* ---------------------------------------------------------------------------
   5. THE BLOCKER RESPONSES
   Whatever the user said is stopping them gets answered directly, by name,
   inside their own document. Section 11 of every playbook.
   ------------------------------------------------------------------------ */
const BLOCKERS = {
  noidea:{ t:'"I don\'t know what to do."',
    p:['You were never going to think your way to the answer, because the answer isn\'t upstream of action — it\'s downstream of it. Ideas are not found by sitting still and considering options; they are found by making contact with reality and noticing what people complain about.',
       'The trap is that "no idea" feels like a knowledge problem, so you try to solve it by consuming more information. It is actually a contact problem. You do not have enough contact with people who have problems. Twenty conversations will generate more usable ideas than two hundred hours of videos, because a business idea is just a problem that somebody described to you out loud.',
       'This is precisely why your recommended model does not require you to have an idea. It requires you to pick a specific type of person and do a specific useful thing for them. The idea arrives on its own once money has changed hands once.'],
    do:'This week: have five conversations with people in the group your model targets. Ask one question — "what part of this eats the most time and you hate the most?" Write down every answer verbatim. Your idea is in there.' },
  nomoney:{ t:'"I have no money."',
    p:['This is the most solvable of all the blockers, and also the most commonly used as a reason not to start — which is why it deserves a direct answer rather than sympathy.',
       'Capital buys two things: speed and inventory. Every model recommended by this site is chosen specifically because it needs neither. You are selling either your time, your knowledge, or your ability to physically show up — none of which require you to buy anything first. The people who need capital are the ones who chose a model that requires it, usually because it looked more like a "real business".',
       'The real constraint hiding behind "no money" is almost always time or nerve. Be honest with yourself about which one it actually is, because the fix is completely different.'],
    do:'This week: write down every cost in your plan. If the total is above $50, your plan is wrong for your situation — cut it until it isn\'t. Then spend zero and get your first customer anyway.' },
  noskill:{ t:'"I don\'t think I\'m good enough."',
    p:['The bar is not "expert". The bar is "more useful than the alternative the customer currently has", and the alternative is usually nothing at all, or themselves at 11pm on a Sunday doing it badly.',
       'You are comparing your inside — every doubt, every gap — to other people\'s outside, which is their marketing. Everybody who is now good was, at some point, charging money while being mediocre. That is not a scandal, it is the only way anyone gets good. Competence is built on paid reps, not before them.',
       'There is a completely legitimate way to handle this that costs you nothing: do the first two jobs free or cheap, over-deliver, and take the testimonial. Now you have proof, and the doubt has been replaced with evidence rather than argument.'],
    do:'This week: do one piece of work for free, to a standard that slightly embarrasses you with how much effort you put in. Get one sentence in writing about the result. That sentence is now your qualification.' },
  fear:{ t:'"I\'m afraid of failing publicly."',
    p:['Reasonable. Also worth examining precisely, because the fear is usually pointing at something much smaller than it feels.',
       'Almost nobody is watching. That sounds harsh and it is actually the good news — the audience you are imagining, the one that will notice and judge, does not exist. Everyone is busy with their own situation. The handful of people who do notice will forget within a week. The asymmetry is severe: the downside of visible failure is a few days of discomfort, and the upside is a business.',
       'The other half of the fix is structural. Make the bet small and reversible. A first customer is a reversible decision — if it goes badly you have lost a few hours and gained information. Reversible decisions should be made fast. Only irreversible ones deserve the deliberation you are currently applying to everything.'],
    do:'This week: make one offer to one person you do not know well. Just one. Notice how completely the world fails to end. Then do it nineteen more times.' },
  notime:{ t:'"I have no time."',
    p:['Sometimes true. More often it means the available time is fragmented rather than absent, and fragmented time feels like no time because you cannot do deep work in it.',
       'Your plan has been scaled to the hours you actually reported, not to an idealised week. If you said five hours, the plan assumes five hours and does not secretly require twenty. That matters, because plans that quietly assume more time than you have are how people conclude they are lazy when they were simply given the wrong plan.',
       'The leverage is in ruthless narrowing rather than in finding more hours. One offer, one channel, one type of customer. Most people burn their limited time on variety — three ideas, three platforms, three audiences — and get nowhere on all three. Five focused hours a week for twelve weeks is sixty hours, and sixty hours is more than enough to reach a first paying customer in every model here.'],
    do:'This week: block two fixed appointments in your calendar with yourself. Same days, same times, every week. Protect them like a job. Do not add a third thing until the first is producing.' },
  nostart:{ t:'"I don\'t know what step one is."',
    p:['This is the most honest answer on the list, and the easiest for a document to actually solve, which is more or less why this site exists.',
       'Paralysis at step one is almost never about the step. It is about the fact that step one has never been separated from steps two through fifty. When all fifty are in your head at once, the whole thing is unliftable. Separate them and each one is trivial.',
       'The 90-day plan in this document is built as a sequence for exactly this reason. You do not need to believe in the whole plan or even understand it. You need to do the first block and then look at the second. That is all.'],
    do:'This week: do only the first line of the Days 1–7 block. Nothing else. Then come back and read the second line. Sequence beats motivation.' }
};

/* ---------------------------------------------------------------------------
   6. PDF BUILDER (pdfmake)
   Cover page is dark and branded; body pages are light so the document is
   actually printable — which matters, because people mark these up.
   ------------------------------------------------------------------------ */
const INK = '#0A0E16', INK2 = '#3C4657', VOLT = '#C8FF3C', VOLTINK = '#4F7A00', RULE = '#DDE3EC';
const NUM = {1:'One',2:'Two',3:'Three',4:'Four',5:'Five',6:'Six'};

function pdfRule(){ return {canvas:[{type:'rect',x:0,y:0,w:515,h:1,color:RULE}],margin:[0,4,0,14]}; }
function pdfH2(t){ return {stack:[
  {canvas:[{type:'rect',x:0,y:0,w:46,h:4,color:VOLT}],margin:[0,0,0,10]},
  {text:t, style:'h2'}
], margin:[0,0,0,12]}; }
function pdfKicker(t){ return {text:t, style:'kicker'}; }
function pdfP(t,m){ return {text:t, style:'p', margin:m||[0,0,0,10]}; }
function pdfBullets(arr){ return {ul:arr, style:'p', margin:[0,2,0,12]}; }
/* The ruled callout box used throughout. It existed inline in a dozen places
   before the writer landed; factoring it out keeps the new sections readable. */
function pdfBox(label, body, m, size, pad){
  const y = pad || 14;
  return {table:{widths:['*'],body:[[{stack:[
    {text:label, color:VOLTINK, fontSize:8.5, bold:true, characterSpacing:1.6, margin:[0,0,0,7]},
    {text:body, fontSize:size||11.5, color:INK, lineHeight:1.45}
  ], margin:[16,y,16,y]}]]},
  layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE},
  margin:m||[0,4,0,14]};
}
/* Title + paragraph pairs, used for the writer's `specifics` and `risks`.

   These were `{stack:[...], unbreakable:true}` first, which reads better and
   silently DELETED content: when an unbreakable block did not fit the
   remaining space, pdfmake dropped it rather than pushing it to the next page,
   and a run of six specifics came out as four with no error anywhere. Flat
   nodes paginate honestly. The heading carries a bottom margin small enough
   that an orphaned one still reads as attached to the text below it. */
function pdfPairs(pairs){
  const out = [];
  pairs.forEach(x=>{
    out.push({text:x[0], style:'h3', margin:[0,0,0,5]});
    out.push({text:x[1], style:'p', margin:[0,0,0,13]});
  });
  return out;
}

/* `ai` is the optional enrichment from the Worker (see 1e in 03b-context.js).
   Every read of it goes through A(), which returns null for anything missing,
   so the document degrades field by field rather than all at once.

   Called with no third argument \u2014 which is what happens whenever the writer is
   off, declined, slow, rate-capped or down \u2014 this produces exactly the document
   the site produced before the writer existed. That path is not a fallback in
   the apologetic sense; it is still the product. */
function buildPdf(a, ranked, ai){
  const A  = k => (ai && ai[k]) ? ai[k] : null;
  const AI = !!ai;
  const top = ranked[0], m = top.m;
  const alts = ranked.slice(1,3);
  const bl = BLOCKERS[a.blocker];
  const ind = INDUSTRIES[a.industry] || INDUSTRIES.notsure;
  const car = CAREERS[a.career] || CAREERS.none;
  const hasIdea = !!a.idea;
  const today = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});

  const content = [];

  /* ---------- COVER ---------- */
  content.push(
    {text:'MYFIRSTBUSINESS.COM', color:VOLT, fontSize:9, characterSpacing:3, bold:true, margin:[0,150,0,0]},
    {text:'Your First\nBusiness Plan', color:'#FFFFFF', fontSize:44, bold:true, lineHeight:1.02, margin:[0,22,0,0]},
    {canvas:[{type:'rect',x:0,y:0,w:70,h:5,color:VOLT}], margin:[0,26,0,26]},
    {text:m.name.toUpperCase(), color:VOLT, fontSize:13, bold:true, characterSpacing:1.5},
    {text:m.line, color:'#98A4B8', fontSize:11.5, margin:[0,10,0,0], lineHeight:1.4, width:400},
    hasIdea
      ? {text:'\u201C'+a.idea+'\u201D', color:'#FFFFFF', fontSize:13, italics:true, margin:[0,22,0,0], lineHeight:1.35}
      : {text:'', margin:[0,0,0,0]},
    {text:'Generated '+today+'  ·  '+(AI ? 'written for your idea' : 'built for '+ind.name.toLowerCase())+'  ·  free, and yours to keep', color:'#616D80', fontSize:9, margin:[0,120,0,0]},
    {text:'Educational content only. Not financial, legal or tax advice.'
       + (AI ? ' Parts of this document were written by AI from your answers — check any figure or rule before you rely on it.' : ''),
     color:'#6B7688', fontSize:8, margin:[0,6,0,0], pageBreak:'after'}
  );

  /* ---------- 01 SITUATION ---------- */
  content.push(pdfKicker('SECTION 01'), pdfH2('Your situation, stated honestly'),
    pdfP('A plan that ignores your constraints is fiction. Here is what you told us, written back to you as the boundary conditions everything else in this document had to fit inside.'),
    {table:{widths:[150,'*'], body:[
      ['Where you are', LABEL.stage[a.stage]],
      ['What you have in mind', hasIdea ? '\u201C'+a.idea+'\u201D' : 'nothing specific yet'],
      ['The field', LABEL.industry[a.industry]],
      ['What you have done for work', a.career==='none' ? 'nothing yet' : LABEL.career[a.career]+' \u2014 '+YEARS_LABEL[a.years]],
      ['Capital you can risk', capLabel(a.capital)],
      ['Time you can protect', timeLabel(a.time)],
      ['Financial pressure', LABEL.urgency[a.urgency]],
      ['Skills you already have', list(a.skills, LABEL.skills)],
      ['Where your customers are', LABEL.reach[a.reach]],
      ['How you want to work', LABEL.style[a.style]],
      ['Asking for money', LABEL.sales[a.sales]],
      ['If you lost the money', LABEL.risk[a.risk]],
      ['Winning in 12 months', LABEL.goal[a.goal]],
      ['What has stopped you', LABEL.blocker[a.blocker]]
    ]}, layout:'lightHorizontalLines', style:'tbl', margin:[0,6,0,16]},
    pdfP('Two of these matter more than the rest. Your capital sets which models are even available to you, and your available time sets how fast any of them can move. Everything that follows was filtered through those two numbers first — which is why this plan will look different from advice written for someone with money and a free calendar.'),
    {text:'', pageBreak:'after'}
  );

  /* ---------- 02 VERDICT ---------- */
  content.push(pdfKicker('SECTION 02'), pdfH2('The business you should start'),
    {table:{widths:['*'], body:[[{
      stack:[
        {text:'YOUR MATCH · '+top.score+'/100', color:VOLTINK, fontSize:8.5, bold:true, characterSpacing:1.6, margin:[0,0,0,8]},
        {text:m.name, fontSize:26, bold:true, color:INK, margin:[0,0,0,8]},
        {text:m.line, fontSize:11.5, color:INK2, lineHeight:1.4}
      ], margin:[14,14,14,14]
    }]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,0,0,14]},
    pdfP(m.what),
    {table:{widths:['*'],body:[[{stack:[
      {text:'IN ONE LINE', color:VOLTINK, fontSize:8, bold:true, characterSpacing:1.6, margin:[0,0,0,6]},
      {text:sharpen(a, m), fontSize:12.5, bold:true, color:INK, lineHeight:1.35}
    ], margin:[14,12,14,12]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,4,0,14]},
    {columns:[
      {width:'*', stack:[{text:'STARTING CAPITAL', style:'micro'},{text:m.capital, style:'stat'}]},
      {width:'*', stack:[{text:'FIRST DOLLAR IN', style:'micro'},{text:m.firstDollar, style:'stat'}]},
      {width:'*', stack:[{text:'REALISTIC CEILING', style:'micro'},{text:m.ceiling, style:'statSm'}]}
    ], columnGap:16, margin:[0,6,0,14]},
    {text:'Why this one, for you specifically', style:'h3', margin:[0,2,0,6]},
    pdfBullets(whyThis(a, m).map(s=>s.charAt(0).toUpperCase()+s.slice(1)+'.')),
    {text:'What it looks like in practice', style:'h3', margin:[0,4,0,6]},
    pdfBullets(m.examples),
    {text:'Your two alternates', style:'h3', margin:[0,6,0,6]},
    pdfP('Take one of these if the primary does not appeal after a week — but not a fourth option. The cost of switching is the ninety days you keep restarting.', [0,0,0,8]),
    {table:{widths:[38,'*'], body: alts.map((r,i)=>[
      {text:'0'+(i+2), color:VOLTINK, bold:true, fontSize:10},
      {stack:[
        {text:r.m.name+'  ·  '+r.score+'/100', bold:true, fontSize:11, color:INK, margin:[0,0,0,3]},
        {text:r.m.line, fontSize:9.5, color:INK2, margin:[0,0,0,3]},
        {text:altWhyNot(a,r,top.score), fontSize:9, color:VOLTINK, italics:true}
      ]}
    ])}, layout:'lightHorizontalLines', margin:[0,0,0,26]}
  );

  /* ---------- 03 THE SPECIFIC BUSINESS ----------
     The industry layer. Without this, two people with identical constraints
     get an identical document even though one wants a bakery and the other
     wants to detail cars. */
  content.push({text:'', pageBreak:'before'},
    pdfKicker('SECTION 03'), pdfH2(hasIdea ? 'Your idea, made specific' : 'Where your customers actually are'),
    hasIdea
      ? pdfBox('WHAT YOU TOLD US', '\u201C'+a.idea+'\u201D', [0,0,0,16], 15)
      : pdfP('You said you have nothing specific in mind yet, which is the honest answer and not a problem. What follows is the shape of the opportunity in '+ind.name.toLowerCase()+' \u2014 read it as a starting position, not a verdict.'),

    /* The writer's reading of their idea. This is the sentence that decides
       whether the rest of the document feels written or assembled, so it goes
       high and it goes in a box. */
    AI && A('read')
      ? pdfBox(hasIdea ? 'WHAT THAT MEANS, CONCRETELY' : 'THE BUSINESS THIS PLAN IS FOR', A('read'), [0,0,0,14], 12)
      : (hasIdea
          ? pdfP('That is the thing to build. Everything below is what it takes to make it real in '+ind.name.toLowerCase()+' \u2014 not business advice in general, but the specifics of this field.')
          : {text:'', margin:[0,0,0,0]}),

    ...(AI && A('viable') ? [
      {text:'The honest case, both ways', style:'h3', margin:[0,4,0,5]},
      pdfP(A('viable'), [0,0,0,10])
    ] : []),

    {text:'Who actually pays in this field', style:'h3', margin:[0,6,0,5]},
    pdfP(ind.customer, [0,0,0,8]),

    {text:'Where you find them', style:'h3', margin:[0,4,0,5]},
    pdfP((AI && A('where')) || ind.where, [0,0,0,8]),

    /* First week. The writer gives five ordered actions sized to the hours
       they said they have; without it, the industry default stands. */
    AI && A('week1')
      ? {table:{widths:['*'],body:[[{stack:[
          {text:'YOUR FIRST WEEK, CONCRETELY', color:VOLTINK, fontSize:8.5, bold:true, characterSpacing:1.6, margin:[0,0,0,9]},
          {ol:A('week1'), fontSize:10.5, color:INK, lineHeight:1.45}
        ], margin:[16,14,16,14]}]]},
        layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,6,0,14]}
      : pdfBox('YOUR FIRST WEEK, CONCRETELY', ind.first, [0,6,0,14], null, 13),

    {text:'What proof looks like here', style:'h3', margin:[0,0,0,5]},
    pdfP(ind.proof, [0,0,0,8]),

    {text:'The trap specific to this field', style:'h3', margin:[0,4,0,5]},
    pdfP(ind.trap, [0,0,0,8]),

    {text:'Before you take money \u2014 check this', style:'h3', margin:[0,4,0,5]},
    pdfP(ind.reg + ' Realistic cost to start here: ' + ind.cost, [0,0,0,0])
  );

  /* ---------- 03 CONTINUED: THE THINGS ONLY THIS BUSINESS HAS ----------
     The reason the writer exists. Everything above is true of a category;
     this page is true of one business and nothing else \u2014 the licence that
     actually applies, the cost nobody mentions, the physical constraint, the
     month the demand disappears. It is the page a reader would have paid for,
     and it does not exist at all without the writer. */
  if(AI && A('specifics')){
    /* Only claim a fresh page if there is enough to fill one. A short answer
       used to open a page for three short paragraphs and leave two thirds of
       it white, which reads as a printing fault rather than as a section. */
    const roomy = A('specifics').length >= 4 || !!A('risks');
    content.push(
      roomy ? {text:'', pageBreak:'before'} : {canvas:[{type:'rect',x:0,y:0,w:515,h:1,color:RULE}],margin:[0,20,0,16]},
      roomy ? pdfKicker('SECTION 03 \u00b7 CONTINUED') : {text:'', margin:[0,0,0,0]},
      roomy ? pdfH2('What nobody tells you about this one')
            : {text:'What nobody tells you about this one', style:'h3', margin:[0,0,0,6]},
      pdfP('Not general business advice. These are the things about this specific business that people normally find out by losing money on them first.', [0,0,0,14]),
      ...pdfPairs(A('specifics'))
    );
    if(A('risks')){
      content.push(
        {canvas:[{type:'rect',x:0,y:0,w:515,h:1,color:RULE}],margin:[0,6,0,16]},
        {text:'Three things that could sink this', style:'h3', margin:[0,0,0,6]},
        pdfP('Read these before you spend anything. At least one of them is legal or financial rather than practical, and that is the kind people skip.', [0,0,0,12]),
        ...pdfPairs(A('risks'))
      );
    }
  }

  /* ---------- 04 WHAT YOUR WORK HISTORY GIVES YOU ---------- */
  content.push({text:'', pageBreak:'before'},
    pdfKicker('SECTION 04'), pdfH2(a.career==='none' ? 'Starting with a clean sheet' : 'What your work already gave you'),
    a.career==='none'
      ? pdfP('You said you have not worked yet. Worth stating plainly rather than treating as a gap, because it comes with two real advantages and one real cost, and knowing which is which changes what you do first.')
      : pdfP('You spent '+YEARS_LABEL[a.years]+' in '+LABEL.career[a.career]+'. Almost everyone discounts this completely when they start something \u2014 they treat their work history as the thing they are escaping rather than the thing they are building on. That is a mistake, and here is the specific reason why.'),

    {text:'What you already have', style:'h3', margin:[0,10,0,6]},
    pdfBullets(car.assets),

    {text:'How it converts', style:'h3', margin:[0,6,0,6]},
    pdfP(car.transfer),

    {table:{widths:['*'],body:[[{stack:[
      {text:'YOUR UNFAIR ADVANTAGE', color:VOLTINK, fontSize:8, bold:true, characterSpacing:1.6, margin:[0,0,0,7]},
      {text:car.edge, fontSize:15, bold:true, color:INK, lineHeight:1.35}
    ], margin:[16,16,16,16]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,10,0,16]},

    pdfP(a.career==='none'
      ? 'Write that sentence down somewhere you will see it. When you are three weeks in and it feels like everyone else knows something you do not, the honest answer is that most of them are carrying assumptions you get to skip.'
      : 'Use that sentence in your outreach. Not as a boast \u2014 as a reason to trust you. "I spent '+YEARS_LABEL[a.years]+' in '+LABEL.career[a.career]+', so I know exactly what goes wrong here" is a stronger opening than anything a beginner can claim.')
  );

  /* ---------- 05 OFFER ---------- */
  content.push({text:'', pageBreak:'before'}, pdfKicker('SECTION 05'), pdfH2('Your offer'),
    pdfP('Hormozi\'s Value Equation is the most practically useful formula in modern business, and it is the whole of offer design:'),
    {table:{widths:['*'],body:[[{text:'Value  =  ( Dream Outcome  ×  Perceived Likelihood of Achievement )  ÷  ( Time Delay  ×  Effort and Sacrifice )', alignment:'center', fontSize:10.5, bold:true, color:INK, margin:[10,12,10,12]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,4,0,16]},
    pdfP('You raise value by increasing the top two and decreasing the bottom two. That is the entire game, and it is why "lower my price" is almost never the right lever — price is not even in the equation.'),
    {text:'The dream outcome you are selling', style:'h3', margin:[0,8,0,6]},
    pdfP(m.dream),

    /* The writer turns the model's generic offer into one specific enough to
       put at the top of a page. The exclusion line matters as much as the
       inclusions: saying no to the wrong first job is what keeps a beginner
       from working three weeks for nothing. */
    ...(AI && A('headline') ? [
      pdfBox('YOUR OFFER, IN ONE LINE', A('headline'), [0,10,0,12], 13)
    ] : []),
    ...(AI && A('includes') ? [
      {text:'What they actually get', style:'h3', margin:[0,2,0,6]},
      pdfBullets(A('includes'))
    ] : []),
    ...(AI && A('excludes') ? [
      {text:'What to refuse, at least at first', style:'h3', margin:[0,2,0,6]},
      pdfP(A('excludes'), [0,0,0,12])
    ] : []),

    {text:'Their obstacles, converted into your solutions', style:'h3', margin:[0,10,0,6]},
    pdfP('Every objection is an obstacle you failed to remove in advance. Pre-handle them inside the offer instead of fighting them on the call.', [0,0,0,10]),
    {table:{widths:['45%','55%'], headerRows:1, body:[
      [{text:'THEIR OBSTACLE', style:'th'},{text:'YOUR BUILT-IN SOLUTION', style:'th'}],
      ...m.obstacles.map(o=>[{text:o[0], style:'td'},{text:o[1], style:'td'}])
    ]}, layout:'lightHorizontalLines', margin:[0,0,0,16]},
    {text:'Your risk reversal', style:'h3', margin:[0,4,0,6]},
    pdfP(m.pricing.guarantee),
    {text:'', pageBreak:'after'}
  );

  /* ---------- 04 PRICING ---------- */
  content.push(pdfKicker('SECTION 06'), pdfH2('What to charge on day one'),
    pdfP('Law 7: price is a strategic decision, not an arithmetic one. It signals quality, filters your customers, and funds your acquisition. A 1% price increase produces a bigger profit change than a 1% volume increase or a 1% cost cut, because it flows straight to the bottom line.'),
    pdfP(m.pricing.model, [0,0,0,14]),
    /* Real prices for the real thing where the writer supplied them. A generic
       ladder is the single most skipped page in the old document, because
       nobody believes a price that was not quoted for their own product. */
    {table:{widths:['22%','48%','30%'], headerRows:1, body:[
      [{text:'TIER', style:'th'},{text:'WHAT THEY GET', style:'th'},{text:'STARTING PRICE', style:'th'}],
      ...((AI && A('tiers')) || m.pricing.tiers).map(t=>[{text:t[0], style:'td', bold:true},{text:t[1], style:'td'},{text:t[2], style:'td', bold:true, color:VOLTINK}])
    ]}, layout:'lightHorizontalLines', margin:[0,0,0,14]},
    pdfP((AI && A('pricingNote')) || m.pricing.note),
    {text:'What this field specifically supports', style:'h3', margin:[0,6,0,6]},
    pdfP(ind.price),
    pdfP('Why three tiers and not one: price discrimination. Different customers have different willingness to pay, and a single price captures only one slice of the demand curve. The top tier does most of its work by making the middle tier look reasonable — most people buy the middle, which is the point.'),
    {text:'', pageBreak:'after'}
  );

  /* ---------- 05 CHANNEL ---------- */
  content.push(pdfKicker('SECTION 07'), pdfH2('How you get customers'),
    pdfP('Every lead on earth comes from one of four places: warm outreach (people who know you), cold outreach (people who don\'t), warm content (an audience you built), or cold content (paid advertising). Everything else is a variation. Choosing more than one at the start is the most common way beginners get nowhere on all of them.'),
    {table:{widths:['*'],body:[[{stack:[
      {text:'YOUR CHANNEL', color:VOLTINK, fontSize:8.5, bold:true, characterSpacing:1.6, margin:[0,0,0,6]},
      {text:m.channel.core, fontSize:17, bold:true, color:INK, margin:[0,0,0,8]},
      {text:m.channel.why, fontSize:10, color:INK2, lineHeight:1.4}
    ], margin:[16,14,16,14]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,4,0,16]},
    {text:'Where your people are, in this field', style:'h3', margin:[0,0,0,6]},
    pdfP((AI && A('where')) || ind.where),
    {text:'Your required volume', style:'h3', margin:[0,6,0,6]},
    pdfP((AI && A('volume')) || m.channel.volume),
    pdfP('Law 5: volume negates luck. One attempt tells you nothing; a hundred tells you everything. Track every attempt in a spreadsheet from day one — contacts, replies, calls, closes. Without those four numbers you are guessing.', [0,0,0,12]),
    {text:'Use this, word for word, until you have your own data', style:'h3', margin:[0,0,0,8]},
    {table:{widths:['*'],body:[[{text:(AI && A('script')) || m.channel.script, fontSize:10, color:INK, lineHeight:1.5, margin:[14,14,14,14]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,0,0,12]},
    pdfP('Do not "improve" this before you have sent it fifty times. Rewriting the script is the most popular way to avoid sending it.'),
    {text:'', pageBreak:'after'}
  );

  /* ---------- 06 TIMELINE ---------- */
  content.push(pdfKicker('SECTION 08'), pdfH2('Your 90-day plan'),
    pdfP('Scaled to the '+timeLabel(a.time)+' you said you can protect. It ends with money in your account, not with a finished logo. If you fall behind, do not restart — carry on from where you are.', [0,0,0,12]),
    pdfP('Week one is the box in Section 03 — do that first, before anything below it.', [0,0,0,12]),
    ...m.weeks.map(w=>({
      stack:[
        {columns:[
          {width:74, text:w[0], color:VOLTINK, bold:true, fontSize:9.5},
          {width:'*', text:w[1], bold:true, fontSize:12, color:INK}
        ], margin:[0,0,0,5]},
        {text:w[2], fontSize:10, color:INK2, lineHeight:1.45, margin:[74,0,0,0]},
        {canvas:[{type:'rect',x:0,y:0,w:515,h:0.6,color:RULE}],margin:[0,11,0,11]}
      ]
    })),
    pdfP('The accountability loop that makes this work: every Saturday, three questions. What did I commit to last week? Did I do it — yes or no, no explanations? What is the one adjustment? Ten minutes. It is the difference between a plan and a habit.', [0,6,0,0]),
    {text:'', pageBreak:'after'}
  );

  /* ---------- 07 NUMBERS ---------- */
  content.push(pdfKicker('SECTION 09'), pdfH2('The numbers you must know cold'),
    pdfP('Law 2: businesses die from lack of cash, not lack of profit. Law 8: if unit economics are broken, growing just makes you fail faster. Compute this before you spend a dollar on growth.'),
    {text:(AI && A('econLines')) ? 'Your numbers, for this exact business' : 'For your model specifically', style:'h3', margin:[0,10,0,8]},
    pdfBullets((AI && A('econLines')) || m.econ.lines),
    {table:{widths:['*'],body:[[{stack:[
      {text:'THE ONE TO WATCH', color:VOLTINK, fontSize:8.5, bold:true, characterSpacing:1.6, margin:[0,0,0,6]},
      {text:(AI && A('econWatch')) || m.econ.watch, fontSize:10.5, color:INK, lineHeight:1.45}
    ], margin:[14,14,14,14]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,4,0,18]},
    {text:'The universal formulas', style:'h3', margin:[0,0,0,6]},
    pdfP('These apply to every business that has ever existed. Learn them from memory and you are ahead of most people who have read fifty business books.', [0,0,0,8]),
    {table:{widths:['48%','52%'], headerRows:1, body:[
      [{text:'METRIC', style:'th'},{text:'FORMULA', style:'th'}],
      [{text:'Gross margin', style:'td'},{text:'(Revenue − COGS) ÷ Revenue', style:'tdm'}],
      [{text:'Contribution margin', style:'td'},{text:'Price − variable cost per unit', style:'tdm'}],
      [{text:'Break-even units', style:'td'},{text:'Fixed costs ÷ contribution margin per unit', style:'tdm'}],
      [{text:'Customer acquisition cost', style:'td'},{text:'Total sales & marketing spend ÷ new customers', style:'tdm'}],
      [{text:'Lifetime value', style:'td'},{text:'AOV × gross margin % × frequency × lifespan', style:'tdm'}],
      [{text:'LTV : CAC', style:'td'},{text:'Target ≥ 3:1. Below 3 is weak, above 5 you are underspending', style:'tdm'}],
      [{text:'Churn rate', style:'td'},{text:'Customers lost in period ÷ customers at start', style:'tdm'}],
      [{text:'Runway', style:'td'},{text:'Cash on hand ÷ monthly net burn', style:'tdm'}]
    ]}, layout:'lightHorizontalLines', margin:[0,0,0,14]},
    {text:'', pageBreak:'after'}
  );

  /* ---------- 08 FIRST TEN + TRAPS ---------- */
  content.push(pdfKicker('SECTION 10'), pdfH2('Your first ten customers'),
    pdfP('Not a strategy. A list of physical actions in order. Do them in this sequence.', [0,0,0,12]),
    {ol:(AI && A('firstTen')) || m.firstTen, style:'p', margin:[0,0,0,18]},
    {text:'The three traps that kill this model', style:'h3', margin:[0,4,0,8]},
    pdfP('These are not hypothetical. They are the specific, documented ways people fail at this exact business, and you will feel the pull of at least one of them.', [0,0,0,10]),
    pdfBullets(m.traps),
    {text:'And the trap specific to '+ind.name.toLowerCase(), style:'h3', margin:[0,6,0,6]},
    pdfP(ind.trap),
    {text:'Invert, always invert', style:'h3', margin:[0,8,0,6]},
    pdfP('Munger\'s tool, and the most reliable one in this document. When you are stuck, do not ask "how do I succeed at this?" Ask "what would guarantee that this fails?" — then refuse to do those things. The answer is almost always: stop sending messages, change the plan every week, and never ask anyone for money.'),
    {text:'', pageBreak:'after'}
  );

  /* ---------- 09 BLOCKER ---------- */
  content.push(pdfKicker('SECTION 11'), pdfH2('The thing that stopped you'),
    {text:bl.t, fontSize:19, bold:true, color:INK, margin:[0,0,0,14]},
    ...bl.p.map(x=>pdfP(x)),
    {table:{widths:['*'],body:[[{stack:[
      {text:'THIS WEEK', color:VOLTINK, fontSize:8.5, bold:true, characterSpacing:1.6, margin:[0,0,0,6]},
      {text:bl.do, fontSize:11, color:INK, lineHeight:1.45}
    ], margin:[14,14,14,14]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,8,0,0]},
    {text:'', pageBreak:'after'}
  );

  /* ---------- 10 RESOURCES ---------- */
  content.push(pdfKicker('SECTION 12'), pdfH2('What to read, what to use'),
    {text:'Your reading path — in this order', style:'h3', margin:[0,0,0,6]},
    pdfP('Not a library. '+NUM[m.books.length]+' books, sequenced for your model. Read one at a time, and after each one write a single page: three concepts, one application to a real business you can observe, one thing you disagree with. If you cannot write the page, you did not read the book.', [0,0,0,10]),
    pdfBullets(m.books),
    pdfP('Do not read them all before starting. Read the first one this week and begin the Days 1–7 block at the same time. Reading without reps is studying swim technique on a whiteboard.', [0,0,0,16]),
    {text:'Free tools that are genuinely enough', style:'h3', margin:[0,0,0,8]},
    pdfBullets(m.tools),
    {text:'Free learning worth the time', style:'h3', margin:[0,10,0,8]},
    pdfBullets([
      'Alex Hormozi\'s YouTube channel — largely the same material as the books, free',
      'Y Combinator Startup Library — dense, free, no fluff',
      'Acquired (podcast) — long-form histories of how real companies were actually built',
      'Aswath Damodaran (NYU) — full valuation and corporate finance courses, free',
      'Berkshire Hathaway shareholder letters, 1977 onward — the best business writing at any price',
      'SEC EDGAR — read three 10-Ks in your target industry and you will know more about its economics than most people working in it'
    ]),
    {text:'', pageBreak:'after'}
  );

  /* ---------- 11 TRACKER ---------- */
  content.push(pdfKicker('SECTION 13'), pdfH2('The only number that predicts anything'),
    pdfP('Not books read. Not notes taken. Not plans made — including this one.'),
    {table:{widths:['*'],body:[[{stack:[
      {text:'TRACK THIS', color:VOLTINK, fontSize:8.5, bold:true, characterSpacing:1.6, margin:[0,0,0,8]},
      {text:'The number of times you have made an offer to a real human being and asked for money.', fontSize:15, bold:true, color:INK, lineHeight:1.3}
    ], margin:[16,16,16,16]}]]}, layout:{hLineWidth:()=>1,vLineWidth:()=>1,hLineColor:()=>RULE,vLineColor:()=>RULE}, margin:[0,8,0,18]},
    pdfP('The only leading indicator that predicts whether any of this becomes a business. Print this page and mark a box every time you ask. Below fifty in ninety days means you were reading, not building.'),
    {text:'Ninety days. Fill these in.', style:'h3', margin:[0,14,0,10]},
    ...[0,1,2,3,4,5].map(r=>({
      canvas:[
        ...Array.from({length:10},(_,i)=>({type:'rect',x:i*52,y:0,w:44,h:26,lineWidth:1,lineColor:RULE}))
      ], margin:[0,0,0,8]
    })),
    pdfP('Sixty boxes. If you fill them, the business follows. That is arithmetic rather than motivation — the person who takes ten times the shots gets ten times the lottery tickets.', [0,14,0,0]),
    {canvas:[{type:'rect',x:0,y:0,w:515,h:1,color:RULE}],margin:[0,20,0,12]},
    ...(FEEDBACK_URL ? [
      {text:'One favour', style:'h3', margin:[0,0,0,6]},
      pdfP('This site tracks nothing and never asked for your email, which means nobody finds out whether any of it worked. If you do something with this — or if it turned out to be useless — say so here: '+FEEDBACK_URL+'. Two minutes, and it is the only way the next person gets a better version.', [0,0,0,14])
    ] : []),
    {text:'Redo the questionnaire any time your situation changes — after your first customer your answers on capital, skills and selling comfort will all be different. Free, no account, nothing to cancel.', fontSize:9, color:INK2, italics:true}
  );

  const doc = {
    pageSize:'A4', pageMargins:[40,52,40,54],
    info:{ title:'Your First Business Plan — '+m.name, author:'myfirstbusiness.com', subject:'Personalised business playbook' },
    background: cp => cp===1 ? {canvas:[{type:'rect',x:0,y:0,w:595.28,h:841.89,color:'#05070C'}]} : null,
    footer: (cp,pc) => cp===1 ? null : ({columns:[
      {text:'myfirstbusiness.com  ·  '+m.name, fontSize:8, color:'#7C8A9E', margin:[40,0,0,0]},
      {text:cp+' / '+pc, fontSize:8, color:'#7C8A9E', alignment:'right', margin:[0,0,40,0]}
    ], margin:[0,18,0,0]}),
    content,
    defaultStyle:{ font:'Roboto', fontSize:10, color:INK2, lineHeight:1.4 },
    styles:{
      kicker:{fontSize:8.5, bold:true, color:VOLTINK, characterSpacing:2, margin:[0,0,0,10]},
      h2:{fontSize:21, bold:true, color:INK, lineHeight:1.08, margin:[0,0,0,4]},
      h3:{fontSize:12.5, bold:true, color:INK},
      p:{fontSize:10, color:INK2, lineHeight:1.45},
      micro:{fontSize:7.5, bold:true, color:'#8A96A8', characterSpacing:1.4, margin:[0,0,0,4]},
      stat:{fontSize:15, bold:true, color:INK},
      statSm:{fontSize:10, bold:true, color:INK, lineHeight:1.25},
      th:{fontSize:7.8, bold:true, color:'#8A96A8', characterSpacing:1.2, margin:[0,6,0,6]},
      td:{fontSize:9.4, color:INK2, margin:[0,5,0,5], lineHeight:1.35},
      tdm:{fontSize:9.2, color:INK, margin:[0,5,0,5], lineHeight:1.35},
      tbl:{fontSize:10}
    }
  };
  return pdfMake.createPdf(doc);
}
