
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
    industry:{food:2,fitness:3,beauty:1,fashion:3,tech:6,creative:15,edu:4,home:2,auto:1,pets:1,events:5,prof:9,retail:1,notsure:4},
    career:{none:-6,retail:6,hospitality:2,trades:0,logistics:0,office:7,sales:10,care:2,tech:8,edu:5,creative:12}, capMin:0, timeMin:5
  },
  local:{
    style:{screen:-10,people:8,hands:15,create:-4}, sales:{hate:-2,nervous:6,fine:9},
    urgency:{now:14,soon:8,patient:-2}, risk:{none:11,small:6,ok:2},
    reach:{local:16,online:-22,both:7}, goal:{side:11,replace:9,big:2,learn:6},
    skills:{hands:13,talk:6,organize:5,none:4,code:-3,write:-2},
    industry:{food:14,fitness:5,beauty:12,fashion:-4,tech:-8,creative:-4,edu:2,home:16,auto:14,pets:14,events:6,prof:0,retail:0,notsure:5},
    career:{none:8,retail:5,hospitality:8,trades:16,logistics:10,office:-2,sales:5,care:7,tech:-6,edu:0,creative:-4}, capMin:0, timeMin:5
  },
  productized:{
    style:{screen:11,people:9,hands:-6,create:4}, sales:{hate:-10,nervous:5,fine:14},
    urgency:{now:-2,soon:14,patient:9}, risk:{none:6,small:8,ok:6},
    reach:{local:0,online:13,both:8}, goal:{side:-2,replace:14,big:22,learn:2},
    skills:{organize:10,write:8,design:8,video:7,code:8,talk:7,numbers:7,none:-12},
    industry:{food:0,fitness:1,beauty:0,fashion:1,tech:10,creative:9,edu:2,home:4,auto:1,pets:0,events:2,prof:19,retail:0,notsure:2},
    career:{none:-10,retail:3,hospitality:1,trades:-2,logistics:0,office:14,sales:14,care:1,tech:11,edu:4,creative:9}, capMin:0, timeMin:10
  },
  creator:{
    style:{screen:4,people:2,hands:-5,create:20}, sales:{hate:9,nervous:6,fine:2},
    urgency:{now:-22,soon:-5,patient:19}, risk:{none:9,small:7,ok:4},
    reach:{local:-10,online:15,both:6}, goal:{side:0,replace:7,big:17,learn:9},
    skills:{video:12,write:9,design:7,teach:7,talk:5,none:0},
    industry:{food:6,fitness:11,beauty:8,fashion:9,tech:7,creative:16,edu:8,home:3,auto:6,pets:6,events:6,prof:3,retail:4,notsure:3},
    career:{none:6,retail:3,hospitality:3,trades:2,logistics:2,office:0,sales:2,care:3,tech:5,edu:9,creative:16}, capMin:0, timeMin:10
  },
  digital:{
    style:{screen:12,people:-5,hands:-7,create:11}, sales:{hate:7,nervous:5,fine:3},
    urgency:{now:-15,soon:6,patient:12}, risk:{none:10,small:6,ok:3},
    reach:{local:-12,online:13,both:5}, goal:{side:10,replace:8,big:9,learn:6},
    skills:{write:11,design:9,organize:9,numbers:8,teach:10,code:7,video:6,none:-10},
    industry:{food:3,fitness:8,beauty:2,fashion:2,tech:9,creative:8,edu:14,home:2,auto:2,pets:3,events:2,prof:10,retail:1,notsure:2},
    career:{none:-2,retail:2,hospitality:0,trades:0,logistics:0,office:11,sales:4,care:3,tech:9,edu:15,creative:9}, capMin:0, timeMin:5
  },
  ecom:{
    style:{screen:6,people:-4,hands:3,create:15}, sales:{hate:9,nervous:5,fine:2},
    urgency:{now:-12,soon:4,patient:12}, risk:{none:-12,small:4,ok:13},
    reach:{local:-8,online:15,both:6}, goal:{side:7,replace:7,big:12,learn:2},
    skills:{design:15,video:10,numbers:6,organize:5,none:-4},
    industry:{food:5,fitness:4,beauty:6,fashion:18,tech:2,creative:8,edu:0,home:3,auto:4,pets:7,events:2,prof:-2,retail:14,notsure:1},
    career:{none:2,retail:9,hospitality:0,trades:2,logistics:5,office:3,sales:4,care:0,tech:3,edu:0,creative:12}, capMin:100, timeMin:10
  },
  flip:{
    style:{screen:2,people:6,hands:12,create:-3}, sales:{hate:1,nervous:8,fine:8},
    urgency:{now:13,soon:7,patient:-4}, risk:{none:-10,small:8,ok:10},
    reach:{local:12,online:8,both:12}, goal:{side:11,replace:3,big:-8,learn:11},
    skills:{hands:6,numbers:7,organize:7,talk:5,design:3,none:5},
    industry:{food:0,fitness:2,beauty:1,fashion:12,tech:5,creative:3,edu:0,home:6,auto:11,pets:2,events:2,prof:0,retail:18,notsure:5},
    career:{none:10,retail:10,hospitality:2,trades:6,logistics:9,office:5,sales:6,care:1,tech:3,edu:0,creative:3}, capMin:30, timeMin:5
  },
  software:{
    style:{screen:19,people:4,hands:-10,create:0}, sales:{hate:-5,nervous:6,fine:11},
    urgency:{now:-18,soon:0,patient:18}, risk:{none:7,small:8,ok:7},
    reach:{local:-6,online:15,both:7}, goal:{side:-6,replace:9,big:22,learn:5},
    skills:{code:24,numbers:9,organize:7,write:5,talk:5,none:-18},
    industry:{food:-2,fitness:2,beauty:-2,fashion:0,tech:23,creative:3,edu:6,home:2,auto:1,pets:0,events:2,prof:12,retail:1,notsure:0},
    career:{none:-12,retail:-2,hospitality:-3,trades:-2,logistics:-2,office:6,sales:5,care:-1,tech:22,edu:4,creative:3}, capMin:0, timeMin:15
  },
  coach:{
    style:{screen:5,people:15,hands:0,create:5}, sales:{hate:-7,nervous:8,fine:12},
    urgency:{now:12,soon:12,patient:4}, risk:{none:12,small:7,ok:2},
    reach:{local:11,online:11,both:12}, goal:{side:11,replace:11,big:2,learn:10},
    skills:{teach:17,talk:10,write:5,organize:5,numbers:5,none:-8},
    industry:{food:2,fitness:16,beauty:3,fashion:3,tech:5,creative:6,edu:18,home:1,auto:2,pets:6,events:2,prof:8,retail:0,notsure:3},
    career:{none:0,retail:6,hospitality:4,trades:5,logistics:1,office:4,sales:9,care:12,tech:5,edu:18,creative:5}, capMin:0, timeMin:5
  },
  community:{
    style:{screen:-6,people:18,hands:3,create:7}, sales:{hate:3,nervous:7,fine:9},
    urgency:{now:-16,soon:4,patient:17}, risk:{none:7,small:7,ok:7},
    reach:{local:15,online:3,both:11}, goal:{side:3,replace:3,big:12,learn:15},
    skills:{talk:12,organize:14,teach:7,design:4,none:2},
    industry:{food:7,fitness:9,beauty:3,fashion:5,tech:6,creative:8,edu:7,home:2,auto:7,pets:8,events:19,prof:6,retail:2,notsure:4},
    career:{none:5,retail:7,hospitality:11,trades:3,logistics:3,office:6,sales:8,care:9,tech:3,edu:9,creative:8}, capMin:0, timeMin:8
  }
};

const SKILL_CAP = 18, NUDGE_CAP = 10, CAP_PEN = 30, TIME_PEN = 18;
const DIMS = ['style','sales','urgency','risk','reach','goal'];

/* Longer in a field means the career signal is more real. Someone with seven
   years in trades has a genuinely different starting position from someone
   who did three months of it, and the recommendation should reflect that. */
const YEAR_FACTOR = {1:0.65, 2:1.0, 5:1.25, 10:1.45};
const INDUSTRY_GAIN = 1.6;

/* Raw fit for one model: the sum of every weight this person's answers
   triggered, with a cap on skills so that a maximalist selector cannot swamp
   the constraint dimensions. */
function rawFit(a, id){
  const w = W[id]; let s = 0, n = 0; const notes = [];

  DIMS.forEach(d=>{ s += (w[d][a[d]] || 0); });

  let sk = 0; (a.skills||[]).forEach(k=>{ sk += (w.skills[k]||0); });
  s += Math.max(-SKILL_CAP, Math.min(SKILL_CAP, sk));

  // Industry: single choice, and the strongest single signal in the model —
  // it drives the entire content layer, so it earns a gain over the other
  // dimensions rather than being one vote among many.
  s += (w.industry[a.industry] || 0) * INDUSTRY_GAIN;

  // Career, scaled by how long they did it
  const cw = w.career[a.career] || 0;
  s += cw * (a.career === 'none' ? 1 : (YEAR_FACTOR[a.years] || 1));

  // Hard constraints — you cannot start what you cannot fund or staff
  if(a.capital < w.capMin){ s -= CAP_PEN; notes.push('needs roughly $'+w.capMin+' to start, which is more than you said you can risk'); }
  if(a.time < w.timeMin){ s -= TIME_PEN; notes.push('realistically needs '+w.timeMin+'+ hours a week'); }

  // Stage nudges
  if(a.stage==='noidea' && (id==='digital'||id==='software')) n -= 6;
  if(a.stage==='noidea' && (id==='service'||id==='local'||id==='flip'||id==='coach')) n += 6;
  if(a.stage==='started' && (id==='service'||id==='productized')) n += 4;
  if(a.stage==='specific' && (id==='digital'||id==='software'||id==='ecom')) n += 4;
  // Someone who typed a concrete idea is ready to execute, not to explore
  if(a.idea && (id==='service'||id==='local'||id==='productized'||id==='coach')) n += 3;

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
   (mean and standard deviation precomputed by Monte Carlo over 150,000 simulated profiles — see
   BRAND-AND-STRATEGY.md). The result answers the right question: "how
   unusually well does this person fit this model, compared to everyone else?"
   That is what makes the recommendation responsive to distinctive answers
   instead of to arbitrary weight magnitudes. */
const NORM = {
  service:[55.22,16.34], local:[49.99,26.40], productized:[53.75,23.80], creator:[44.43,26.03],
  digital:[48.52,22.09], ecom:[27.06,27.95], flip:[50.62,22.33], software:[29.64,30.53],
  coach:[72.43,17.79], community:[58.61,21.76]
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
  industry:{food:'food and drink',fitness:'fitness and health',beauty:'beauty and personal care',fashion:'clothing and fashion',tech:'tech, software and AI',creative:'design, media and content',edu:'education and tutoring',home:'home and property',auto:'cars and vehicles',pets:'pets and animals',events:'events and entertainment',prof:'business services',retail:'products and retail',notsure:'not decided yet'},
  career:{none:'no work history yet',retail:'retail and customer service',hospitality:'hospitality and food service',trades:'trades and manual work',logistics:'driving and delivery',office:'office and admin',sales:'sales and accounts',care:'healthcare and caring',tech:'tech and engineering',edu:'teaching and training',creative:'creative and media'}
};
const capLabel = c => c===0?'$0':c===50?'under $100':c===300?'$100–$500':c===1000?'$500–$2,000':'over $2,000';
const timeLabel = t => t===5?'under 5 hours a week':t===10?'5–10 hours a week':t===20?'10–20 hours a week':t===35?'20–40 hours a week':'40+ hours a week';
const list = (arr,map) => arr && arr.length ? arr.map(k=>map[k]).filter(Boolean).join(', ') : 'nothing specified';

function whyThis(a, m){
  const bits = [];
  if(a.capital===0) bits.push('you have no capital, and this model needs none');
  else bits.push('it fits inside the '+capLabel(a.capital)+' you said you could risk');
  if(a.industry && a.industry!=='notsure')
    bits.push('it is the shape that works in '+LABEL.industry[a.industry]+', where the money comes from '+(INDUSTRIES[a.industry]?INDUSTRIES[a.industry].noun:'this field')+' customers who buy repeatedly');
  if(a.career && a.career!=='none')
    bits.push('your '+YEARS_LABEL[a.years]+' in '+LABEL.career[a.career]+' transfers directly into it, and that is an advantage most beginners do not have');
  if(a.urgency==='now') bits.push('you need money inside 30 days, and this is one of the few models that can produce a paying customer that fast');
  else if(a.urgency==='patient') bits.push('you have no immediate financial pressure, which is what makes a slower-compounding model rational for you');
  else bits.push('your 3–6 month window is enough time for this to reach real revenue');
  bits.push('it matches your preference for working '+LABEL.style[a.style]);
  if(a.sales==='hate') bits.push('and it does not require you to cold-call strangers before you have any proof');
  else if(a.sales==='fine') bits.push('and it rewards the fact that you are already comfortable asking for money');
  if(a.time<=10) bits.push('it can be run inside '+timeLabel(a.time));
  return bits;
}

/* One line that fuses their own words, their industry and the chosen model.
   This is the sentence people screenshot, so it has to be concrete. */
function sharpen(a, m){
  const ind = INDUSTRIES[a.industry] || INDUSTRIES.notsure;
  if(a.idea) return '"' + a.idea + '" — run as ' + m.name.replace(/^The /,'a ').toLowerCase() + ' in ' + ind.name.toLowerCase() + '.';
  if(a.industry && a.industry !== 'notsure') return m.name.replace(/^The /,'A ') + ' in ' + ind.name.toLowerCase() + ', aimed at the one customer described below.';
  return m.name.replace(/^The /,'A ') + ', pointed at the first specific person you can find who has the problem.';
}

function altWhyNot(a, r, topScore){
  if(r.notes.length) return 'Held back because it '+r.notes[0]+'.';
  const d = (topScore||100) - r.score;
  if(d <= 3)  return 'Effectively tied — pick whichever you would enjoy more.';
  if(d <= 8)  return 'A strong second option if the primary does not appeal.';
  if(d <= 16) return 'Workable, but slower for your constraints than the primary.';
  return 'Worth revisiting once you have capital, proof or time you lack today.';
}
