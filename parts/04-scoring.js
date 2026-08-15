
/* ---------------------------------------------------------------------------
   3. SCORING
   Every model carries a weight table. Each answer moves that model's raw fit
   up or down; the raw fit is then standardised against the model's own
   distribution so models are comparable. Deliberately transparent rather than
   clever: the same inputs always produce the same output, and every point of
   the score can be traced back to a specific answer.
   ------------------------------------------------------------------------ */
const W = {
  service:{
    style:{screen:6,people:10,hands:-2,create:5}, sales:{hate:-8,nervous:6,fine:12},
    urgency:{now:12,soon:9,patient:0}, risk:{none:9,small:5,ok:1},
    reach:{local:1,online:9,both:8}, goal:{side:8,replace:11,big:3,learn:6},
    skills:{write:6,design:6,video:6,code:5,talk:5,organize:4,numbers:4,teach:3,hands:1,none:-10},
    interests:{tech:2,money:2,creative:2,edu:2,style:2,health:2}, capMin:0, timeMin:5
  },
  local:{
    style:{screen:-10,people:8,hands:15,create:-4}, sales:{hate:-2,nervous:6,fine:9},
    urgency:{now:14,soon:8,patient:-2}, risk:{none:11,small:6,ok:2},
    reach:{local:16,online:-22,both:7}, goal:{side:11,replace:9,big:2,learn:6},
    skills:{hands:13,talk:6,organize:5,none:4,code:-3,write:-2},
    interests:{home:8,pets:7,health:3,food:3,sport:2}, capMin:0, timeMin:5
  },
  productized:{
    style:{screen:11,people:9,hands:-6,create:4}, sales:{hate:-10,nervous:5,fine:14},
    urgency:{now:-2,soon:14,patient:9}, risk:{none:6,small:8,ok:6},
    reach:{local:0,online:13,both:8}, goal:{side:-2,replace:14,big:22,learn:2},
    skills:{organize:10,write:8,design:8,video:7,code:8,talk:7,numbers:7,none:-12},
    interests:{money:7,tech:6,edu:3}, capMin:0, timeMin:10
  },
  creator:{
    style:{screen:4,people:2,hands:-5,create:20}, sales:{hate:9,nervous:6,fine:2},
    urgency:{now:-22,soon:-5,patient:19}, risk:{none:9,small:7,ok:4},
    reach:{local:-10,online:15,both:6}, goal:{side:0,replace:7,big:17,learn:9},
    skills:{video:12,write:9,design:7,teach:7,talk:5,none:0},
    interests:{gaming:7,creative:7,health:6,style:6,tech:5,food:5,money:5,sport:4,pets:4,people:4,edu:4,home:3}, capMin:0, timeMin:10
  },
  digital:{
    style:{screen:12,people:-5,hands:-7,create:11}, sales:{hate:7,nervous:5,fine:3},
    urgency:{now:-15,soon:6,patient:12}, risk:{none:10,small:6,ok:3},
    reach:{local:-12,online:13,both:5}, goal:{side:10,replace:8,big:9,learn:6},
    skills:{write:11,design:9,organize:9,numbers:8,teach:10,code:7,video:6,none:-10},
    interests:{edu:8,money:7,tech:7,creative:6,style:5,health:5}, capMin:0, timeMin:5
  },
  ecom:{
    style:{screen:6,people:-4,hands:3,create:15}, sales:{hate:9,nervous:5,fine:2},
    urgency:{now:-12,soon:4,patient:12}, risk:{none:-12,small:4,ok:13},
    reach:{local:-8,online:15,both:6}, goal:{side:7,replace:7,big:12,learn:2},
    skills:{design:15,video:10,numbers:6,organize:5,none:-4},
    interests:{style:11,gaming:9,creative:9,sport:7,pets:7,health:6,home:3}, capMin:100, timeMin:10
  },
  flip:{
    style:{screen:2,people:6,hands:12,create:-3}, sales:{hate:1,nervous:8,fine:8},
    urgency:{now:13,soon:7,patient:-4}, risk:{none:-10,small:8,ok:10},
    reach:{local:12,online:8,both:12}, goal:{side:11,replace:3,big:-8,learn:11},
    skills:{hands:6,numbers:7,organize:7,talk:5,design:3,none:5},
    interests:{style:7,home:6,gaming:5,tech:4,sport:3}, capMin:30, timeMin:5
  },
  software:{
    style:{screen:19,people:4,hands:-10,create:0}, sales:{hate:-5,nervous:6,fine:11},
    urgency:{now:-18,soon:0,patient:18}, risk:{none:7,small:8,ok:7},
    reach:{local:-6,online:15,both:7}, goal:{side:-6,replace:9,big:22,learn:5},
    skills:{code:24,numbers:9,organize:7,write:5,talk:5,none:-18},
    interests:{tech:15,money:7,edu:4}, capMin:0, timeMin:15
  },
  coach:{
    style:{screen:5,people:15,hands:0,create:5}, sales:{hate:-7,nervous:8,fine:12},
    urgency:{now:12,soon:12,patient:4}, risk:{none:12,small:7,ok:2},
    reach:{local:11,online:11,both:12}, goal:{side:11,replace:11,big:2,learn:10},
    skills:{teach:17,talk:10,write:5,organize:5,numbers:5,none:-8},
    interests:{edu:12,health:9,money:7,creative:6,people:6,sport:6,gaming:4,tech:4}, capMin:0, timeMin:5
  },
  community:{
    style:{screen:-6,people:18,hands:3,create:7}, sales:{hate:3,nervous:7,fine:9},
    urgency:{now:-16,soon:4,patient:17}, risk:{none:7,small:7,ok:7},
    reach:{local:15,online:3,both:11}, goal:{side:3,replace:3,big:12,learn:15},
    skills:{talk:12,organize:14,teach:7,design:4,none:2},
    interests:{people:14,sport:7,gaming:7,health:6,creative:6,food:6,money:5,tech:5}, capMin:0, timeMin:8
  }
};

const SKILL_CAP = 18, INT_CAP = 14, NUDGE_CAP = 10, CAP_PEN = 30, TIME_PEN = 18;
const DIMS = ['style','sales','urgency','risk','reach','goal'];

/* Raw fit for one model: the sum of every weight this person's answers
   triggered, with caps so that selecting many skills or many interests
   cannot swamp the constraint dimensions. */
function rawFit(a, id){
  const w = W[id]; let s = 0, n = 0; const notes = [];

  DIMS.forEach(d=>{ s += (w[d][a[d]] || 0); });

  let sk = 0; (a.skills||[]).forEach(k=>{ sk += (w.skills[k]||0); });
  s += Math.max(-SKILL_CAP, Math.min(SKILL_CAP, sk));

  let iv = 0; (a.interests||[]).forEach(k=>{ iv += (w.interests[k]||0); });
  s += Math.max(0, Math.min(INT_CAP, iv));

  // Hard constraints — you cannot start what you cannot fund or staff
  if(a.capital < w.capMin){ s -= CAP_PEN; notes.push('needs roughly $'+w.capMin+' to start, which is more than you said you can risk'); }
  if(a.time < w.timeMin){ s -= TIME_PEN; notes.push('realistically needs '+w.timeMin+'+ hours a week'); }

  // Stage nudges
  if(a.stage==='noidea' && (id==='digital'||id==='software')) n -= 6;
  if(a.stage==='noidea' && (id==='service'||id==='local'||id==='flip'||id==='coach')) n += 6;
  if(a.stage==='started' && (id==='service'||id==='productized')) n += 4;
  if(a.stage==='specific' && (id==='digital'||id==='software'||id==='ecom')) n += 4;

  // Blocker nudges — the recommended plan should attack the stated blocker
  if(a.blocker==='nomoney' && id==='ecom') n -= 8;
  if(a.blocker==='nomoney' && (id==='service'||id==='local'||id==='coach')) n += 6;
  if(a.blocker==='noskill' && (id==='local'||id==='flip')) n += 8;
  if(a.blocker==='noskill' && (id==='software'||id==='productized')) n -= 6;
  if(a.blocker==='fear' && id==='creator') n -= 8;
  if(a.blocker==='fear' && (id==='flip'||id==='digital'||id==='local')) n += 5;
  if(a.blocker==='notime' && (id==='creator'||id==='software'||id==='community')) n -= 8;
  if(a.blocker==='notime' && (id==='flip'||id==='digital')) n += 5;
  s += Math.max(-NUDGE_CAP, Math.min(NUDGE_CAP, n));

  return {s, notes};
}

/* Raw sums are not comparable across models: a model with big weights would
   always win on magnitude rather than on fit. So each model's raw score is
   standardised against its own distribution over the whole answer space
   (mean and standard deviation precomputed by Monte Carlo — see
   BRAND-AND-STRATEGY.md). The result answers the right question: "how
   unusually well does this person fit this model, compared to everyone else?"
   That is what makes the recommendation responsive to distinctive answers
   instead of to arbitrary weight magnitudes. */
const NORM = {
  service:[44.49,14.20], local:[39.79,22.70], productized:[44.19,21.13], creator:[37.70,25.34],
  digital:[41.61,20.83], ecom:[22.43,26.76], flip:[41.90,20.72], software:[26.11,27.96],
  coach:[63.39,15.28], community:[49.06,21.04]
};

function scoreModels(a){
  return MODELS.map(m=>{
    const {s, notes} = rawFit(a, m.id);
    const nz = NORM[m.id];
    const z = (s - nz[0]) / nz[1];
    const score = Math.max(24, Math.min(97, Math.round(74 + 8 * z)));
    return { m, score, z, notes };
  }).sort((x,y)=> y.z - x.z);
}

/* ---------------------------------------------------------------------------
   4. PERSONALISED REASONING
   Turns the winning score into sentences that reference the user's own
   answers. This is what makes the document feel written for one person.
   ------------------------------------------------------------------------ */
const LABEL = {
  stage:{noidea:'no idea yet',vague:'a vague idea',specific:'a specific idea',started:'already started'},
  urgency:{now:'income needed within 30 days',soon:'income wanted within 3–6 months',patient:'no financial pressure'},
  reach:{online:'online, anywhere',local:'local and in person',both:'no preference'},
  style:{screen:'alone at a screen',people:'talking to people',hands:'moving and building',create:'making things'},
  sales:{hate:'hates asking for money',nervous:'nervous but willing',fine:'comfortable selling'},
  risk:{none:'cannot afford to lose anything',small:'small losses survivable',ok:'treats losses as tuition'},
  goal:{side:'$500–$1,000 a month on the side',replace:'replace a full income',big:'build something big',learn:'prove capability'},
  blocker:{noidea:'not knowing what to do',nomoney:'having no money',noskill:'not feeling good enough',fear:'fear of failing publicly',notime:'having no time',nostart:'not knowing what step one is'},
  skills:{write:'writing',design:'design',video:'video and photo',code:'code and tech',talk:'talking to people',hands:'practical work',teach:'teaching',organize:'organising',numbers:'numbers',none:'no defined skill yet'},
  interests:{tech:'tech and AI',health:'health and fitness',style:'fashion and beauty',food:'food and drink',gaming:'gaming',creative:'music, art and design',edu:'education',home:'homes and local life',pets:'animals and pets',money:'money and business',sport:'sport and outdoors',people:'people and relationships'}
};
const capLabel = c => c===0?'$0':c===50?'under $100':c===300?'$100–$500':c===1000?'$500–$2,000':'over $2,000';
const timeLabel = t => t===5?'under 5 hours a week':t===10?'5–10 hours a week':t===20?'10–20 hours a week':t===35?'20–40 hours a week':'40+ hours a week';
const list = (arr,map) => arr && arr.length ? arr.map(k=>map[k]).filter(Boolean).join(', ') : 'nothing specified';

function whyThis(a, m){
  const bits = [];
  if(a.capital===0) bits.push('you have no capital, and this model needs none');
  else bits.push('it fits inside the '+capLabel(a.capital)+' you said you could risk');
  if(a.urgency==='now') bits.push('you need money inside 30 days, and this is one of the few models that can produce a paying customer that fast');
  else if(a.urgency==='patient') bits.push('you have no immediate financial pressure, which is what makes a slower-compounding model rational for you');
  else bits.push('your 3–6 month window is enough time for this to reach real revenue');
  bits.push('it matches your preference for working '+LABEL.style[a.style]);
  if(a.sales==='hate') bits.push('and it does not require you to cold-call strangers before you have any proof');
  else if(a.sales==='fine') bits.push('and it rewards the fact that you are already comfortable asking for money');
  if(a.time<=10) bits.push('it can be run inside '+timeLabel(a.time));
  return bits;
}

function altWhyNot(a, r, topScore){
  if(r.notes.length) return 'Held back because it '+r.notes[0]+'.';
  const d = (topScore||100) - r.score;
  if(d <= 3)  return 'Effectively tied — pick whichever you would enjoy more.';
  if(d <= 8)  return 'A strong second option if the primary does not appeal.';
  if(d <= 16) return 'Workable, but slower for your constraints than the primary.';
  return 'Worth revisiting once you have capital, proof or time you lack today.';
}
