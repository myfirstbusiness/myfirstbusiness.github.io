<script>
/* ============================================================================
   MYFIRSTBUSINESS — DIAGNOSTIC + RECOMMENDATION ENGINE
   Everything runs client-side. No network calls, no storage, no tracking.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1. THE QUESTIONNAIRE
   12 questions, one per screen. Research basis for the format:
   - Lead-capture completion falls ~28% going from 3 to 10 questions, so every
     question here has to earn its place by changing the output.
   - One-question-per-screen + auto-advance keeps perceived effort low
     (Value Equation: minimise Time Delay and Effort & Sacrifice).
   - No email gate: the single biggest drop-off point in any lead magnet.
   ------------------------------------------------------------------------ */
const QUESTIONS = [
  { id:'stage', kicker:'WHERE YOU ARE', title:'Where are you right now?',
    help:'Be honest. This changes what page one of your playbook says.',
    opts:[
      {v:'noidea',  t:'I want to start something',  d:'I have no idea what it should be'},
      {v:'vague',   t:'I have a vague idea',        d:'Nothing concrete, nothing tested'},
      {v:'specific',t:'I have a specific idea',     d:'I believe in it, I just haven\'t moved'},
      {v:'started', t:'I already started',          d:'It isn\'t working yet'}
    ]},

  { id:'capital', kicker:'MONEY', title:'How much can you put in and genuinely afford to lose?',
    help:'Not what you have. What you could lose without it hurting your life.',
    opts:[
      {v:0,    t:'$0',              d:'Nothing. Not a dollar.'},
      {v:50,   t:'Under $100',      d:'Enough for a domain and a coffee'},
      {v:300,  t:'$100 – $500',     d:'Enough for real tools or first inventory'},
      {v:1000, t:'$500 – $2,000',   d:'Enough to test paid acquisition'},
      {v:3000, t:'More than $2,000',d:'Enough to make expensive mistakes'}
    ]},

  { id:'time', kicker:'TIME', title:'How many hours a week can you actually protect?',
    help:'Not your best week. Your average week, including the bad ones.',
    opts:[
      {v:5,  t:'Under 5 hours',  d:'Scraps of evenings and weekends'},
      {v:10, t:'5 – 10 hours',   d:'An hour or two most days'},
      {v:20, t:'10 – 20 hours',  d:'A serious part-time commitment'},
      {v:35, t:'20 – 40 hours',  d:'Most of my waking free time'},
      {v:45, t:'40+ hours',      d:'This is what I do all day'}
    ]},

  { id:'urgency', kicker:'PRESSURE', title:'How fast does this need to make money?',
    help:'Financial pressure isn\'t a weakness — it\'s a constraint, and constraints pick the model.',
    opts:[
      {v:'now',     t:'I need income within 30 days', d:'This is not optional for me'},
      {v:'soon',    t:'Within 3 – 6 months',          d:'It would change my situation'},
      {v:'patient', t:'No real pressure',             d:'I can build slowly and compound'}
    ]},

  { id:'skills', kicker:'WHAT YOU CAN DO', title:'What can you already do at a decent level?',
    help:'Pick everything that applies. "Decent" means someone has told you you\'re good at it.',
    multi:true, two:true,
    opts:[
      {v:'write',   t:'Writing',           d:'Words, emails, explaining things clearly'},
      {v:'design',  t:'Design',            d:'Visuals, layout, taste'},
      {v:'video',   t:'Video & photo',     d:'Filming, editing, being on camera'},
      {v:'code',    t:'Code & tech',       d:'Building, scripting, automating, AI tools'},
      {v:'talk',    t:'Talking to people', d:'Persuading, negotiating, not freezing up'},
      {v:'hands',   t:'Practical work',    d:'Fixing, building, cleaning, physical craft'},
      {v:'teach',   t:'Teaching',          d:'Making a hard thing click for someone'},
      {v:'organize',t:'Organising',        d:'Systems, logistics, admin, making order'},
      {v:'numbers', t:'Numbers',           d:'Spreadsheets, analysis, money math'},
      {v:'none',    t:'Nothing yet',       d:'Genuinely starting from zero'}
    ]},

  { id:'interests', kicker:'WHAT YOU CARE ABOUT', title:'What subjects do you actually care about?',
    help:'Pick up to four. Passion isn\'t a business model, but it is fuel — and fuel matters over 90 days.',
    multi:true, two:true, max:4,
    opts:[
      {v:'tech',    t:'Tech & AI',            d:'Software, gadgets, automation'},
      {v:'health',  t:'Health & fitness',     d:'Training, food, mental health'},
      {v:'style',   t:'Fashion & beauty',     d:'Clothing, skincare, self-presentation'},
      {v:'food',    t:'Food & drink',         d:'Cooking, baking, cafés, nutrition'},
      {v:'gaming',  t:'Gaming & esports',     d:'Games, streaming, communities'},
      {v:'creative',t:'Music, art & design',  d:'Making things people look at or hear'},
      {v:'edu',     t:'Education',            d:'Courses, tutoring, exams, languages'},
      {v:'home',    t:'Homes & local life',   d:'Property, cars, repairs, neighbourhoods'},
      {v:'pets',    t:'Animals & pets',       d:'Dogs, cats, care, training'},
      {v:'money',   t:'Money & business',     d:'Investing, finance, entrepreneurship'},
      {v:'sport',   t:'Sport & outdoors',     d:'Teams, travel, adventure'},
      {v:'people',  t:'People & relationships',d:'Events, community, coaching, dating'}
    ]},

  { id:'reach', kicker:'YOUR MARKET', title:'Where do you want your customers to be?',
    help:'This single choice eliminates half the business models on the board.',
    opts:[
      {v:'online', t:'Anywhere online',         d:'I want to sell to the internet'},
      {v:'local',  t:'Near me, in person',      d:'My town, my city, people I can drive to'},
      {v:'both',   t:'Either — whatever works', d:'I have no preference'}
    ]},

  { id:'style', kicker:'HOW YOU WORK', title:'Which working day sounds least like torture?',
    help:'The model you can tolerate for 90 days beats the model with the bigger ceiling.',
    opts:[
      {v:'screen', t:'Alone at a screen',    d:'Deep work, headphones on, nobody talking to me'},
      {v:'people', t:'Talking to people',    d:'Calls, meetings, negotiating, closing'},
      {v:'hands',  t:'Moving and building',  d:'On my feet, doing physical work'},
      {v:'create', t:'Making things',        d:'Content, video, design, publishing'}
    ]},

  { id:'sales', kicker:'THE HARD PART', title:'How do you feel about asking a stranger for money?',
    help:'Everyone says "nervous". The answer changes which channel you get, so pick truthfully.',
    opts:[
      {v:'hate',    t:'I hate it',        d:'The thought makes me physically avoid it'},
      {v:'nervous', t:'Nervous, but I\'ll do it', d:'Uncomfortable, not impossible'},
      {v:'fine',    t:'I\'m fine with it', d:'I\'ve done it, or I know I can'}
    ]},

  { id:'risk', kicker:'DOWNSIDE', title:'If you lost every dollar you put in, what happens?',
    help:'Law 2: businesses die from lack of cash. Your plan is built around this answer.',
    opts:[
      {v:'none',  t:'I\'d be in real trouble', d:'I cannot afford to lose anything'},
      {v:'small', t:'Annoyed, but fine',       d:'It would sting and pass'},
      {v:'ok',    t:'It\'s tuition',           d:'I\'d write it off and go again'}
    ]},

  { id:'goal', kicker:'THE TARGET', title:'What does winning look like in 12 months?',
    help:'Ambition changes which model is correct — not how hard you should work.',
    opts:[
      {v:'side',    t:'An extra $500 – $1,000 a month', d:'Breathing room, not a new life'},
      {v:'replace', t:'Enough to not need a job',       d:'Full replacement income'},
      {v:'big',     t:'The start of something big',     d:'I want a real company eventually'},
      {v:'learn',   t:'Proof that I can do it',         d:'Money second, capability first'}
    ]},

  { id:'blocker', kicker:'THE TRUTH', title:'What has actually stopped you until now?',
    help:'Your playbook will answer this directly, before it stops you again in week three.',
    opts:[
      {v:'noidea',  t:'I don\'t know what to do',       d:'No idea feels good enough'},
      {v:'nomoney', t:'I have no money',                d:'Everything seems to need capital'},
      {v:'noskill', t:'I don\'t think I\'m good enough',d:'Other people know more than me'},
      {v:'fear',    t:'Fear of failing publicly',       d:'People would see me fail'},
      {v:'notime',  t:'I have no time',                 d:'Life is already full'},
      {v:'nostart', t:'I don\'t know what step one is', d:'I freeze before I begin'}
    ]}
];

/* ---------------------------------------------------------------------------
   2. THE MODELS
   Ten business models that can be started with $0–$300 and reach a first
   paying customer inside 90 days. Each carries its own playbook content.
   ------------------------------------------------------------------------ */
const MODELS = [
{
  id:'service', name:'The Skill Service', short:'Freelance service business',
  line:'Sell one specific skill, done for one specific type of customer, for money, this month.',
  capital:'$0', firstDollar:'7 – 21 days', ceiling:'$3k–$15k/mo solo, more with a team',
  what:'You do a defined piece of work for someone who needs it done and doesn\'t want to do it themselves. No inventory, no audience, no product to build. The oldest and most reliable path from zero to a first paying customer, and the one almost every successful operator started on.',
  examples:['Editing short-form video for coaches who post daily','Writing product descriptions for small online stores','Setting up and cleaning up spreadsheets for local businesses'],
  dream:'The customer gets a job off their plate, done properly, without hiring anyone.',
  obstacles:[
    ['They don\'t know you and have no reason to trust you','Do the first two jobs at a steep discount in exchange for a specific written testimonial and permission to show the work'],
    ['They can\'t tell good from bad before they buy','Show a finished example. Not a portfolio site — one real artefact, sent in the message'],
    ['They\'re worried you\'ll vanish halfway','Offer a fixed scope, a fixed date, and payment split 50% up front / 50% on delivery']
  ],
  pricing:{ model:'Fixed price per outcome, never hourly. Hourly punishes you for getting faster.',
    tiers:[['Starter','One deliverable, one revision, 5-day turnaround','$150'],['Standard','Three deliverables a month, priority turnaround','$450 / mo'],['Partner','Weekly volume, you own the whole function, direct line to you','$1,200 / mo']],
    note:'Those numbers are a starting anchor for a service you can deliver in 2–4 hours. Raise them the moment two people in a row say yes without hesitating — that\'s the market telling you you\'re cheap.',
    guarantee:'"If the first deliverable isn\'t what you wanted, you don\'t pay and you keep it." You will lose this bet less than once in twenty times, and it removes the only real objection a stranger has.'},
  channel:{ core:'Warm outreach, then cold outreach', why:'Services have effectively infinite margin on your own time, which means you can afford to spend hours per customer to land one. That makes direct outreach the correct channel and paid ads the wrong one at your stage.',
    volume:'20 personal messages a day, five days a week. 100 a week. Track every one.',
    script:'Hi [name] — I watched your last three videos and noticed the captions cut off on mobile. I edited your most recent one properly, here\'s the file: [link]. Keep it either way, no strings. If you want me doing this every week I charge $150 a video, and the first one is free so you can see if I\'m any good.'},
  weeks:[
    ['Days 1–7','Pick the one thing you sell','Write one sentence: "I do [X] for [specific type of person] so they can [outcome]." Kill every other option. Make a list of 100 real people or businesses who fit that description — names, not categories.'],
    ['Days 8–21','Make one thing worth showing','Build one finished example, for free, for someone who fits your target. Do it to an embarrassing standard of quality. This artefact replaces a portfolio, a website, and a pitch.'],
    ['Days 22–45','Outreach at volume','20 personalised messages a day. Log contacts, replies, calls and closes in a spreadsheet. Expect 2–5% to convert. That is normal. 100 messages is one to five customers.'],
    ['Days 46–65','Deliver like a professional','Fixed scope, fixed date, over-deliver on the first job. Ask for a written testimonial the day you deliver, while they\'re happy. Ask who else needs this.'],
    ['Days 66–80','Raise the price','New customers pay 30–50% more than your first two. Your first prices were tuition, not policy.'],
    ['Days 81–90','Turn it into a retainer','Convert one-off buyers to monthly. Recurring revenue is the difference between a hustle and a business.']
  ],
  econ:{ lines:['Revenue = number of customers × price per job × jobs per month','Your only real cost is your hours, so gross margin is ~100% and break-even is one customer','Capacity ceiling = your weekly hours ÷ hours per job'],
    watch:'Watch capacity, not cash. Services die from being full, not from being broke. When you hit 70% of your hours booked, either raise price or hire.'},
  firstTen:['Write the list of 100 target names before you send anything','Send 20 messages a day for 5 days — no exceptions, no editing the script after 3 sends','Do the first job free, publicly, for someone with an audience','Ask every single buyer: "who else do you know with this problem?"','Post the finished work where your customers already hang out'],
  traps:['Building a website before you have a customer. Nobody has ever bought because of a freelancer\'s website.','Offering "anything you need". Specific beats broad, always. "Video editor" loses to "video editor for fitness coaches".','Going quiet after 30 messages because nobody replied. 30 is noise. 100 is data.'],
  books:['$100M Offers — Alex Hormozi','$100M Leads — Alex Hormozi','The Win Without Pitching Manifesto — Blair Enns'],
  tools:['Google Docs / Sheets — proposals, tracker','Canva free — anything visual','Wave or Stripe — invoicing, free to start','Calendly free — booking calls']
},
{
  id:'local', name:'The Local Operation', short:'Hands-on local service',
  line:'A physical service, sold to people who live near you, paid in cash or card the same day.',
  capital:'$0 – $150', firstDollar:'3 – 14 days', ceiling:'$4k–$20k/mo, scales by adding people and vans',
  what:'You show up and do something physical that people don\'t want to do themselves. It is the fastest documented path from zero to a first paying customer, because the sale can be closed on a doorstep and the competition is mostly people who don\'t answer their phone.',
  examples:['Car detailing that comes to the customer\'s driveway','Pressure washing driveways, patios and fences','Dog walking, pet sitting, or garden maintenance for a fixed route of houses'],
  dream:'Their problem is physically gone by tonight and they didn\'t have to think about it.',
  obstacles:[
    ['They don\'t know if you\'ll show up','Confirm by text the night before and the morning of. Reliability is the entire product in local services'],
    ['They can\'t judge quality in advance','Before-and-after photos of your own work. Two photos beat any advertisement'],
    ['They think it\'s expensive','Quote a fixed price per job with no surprises. "Ninety dollars, done in two hours, done properly."']
  ],
  pricing:{ model:'Fixed price per job, quoted before you start, paid on completion. Never quote hourly to a residential customer.',
    tiers:[['Basic','The single core job, done well','$60 – $90'],['Full','Core job plus the two adjacent things they were going to nag about','$140 – $180'],['Monthly','Same job on a schedule, priority slot, ~15% off per visit','$200+ / mo']],
    note:'Check three local competitors, then price at or slightly above the middle one. Cheapest in a local market attracts the worst customers and no margin.',
    guarantee:'"If you\'re not happy when I finish, I redo it or you don\'t pay." Local reputation is your only marketing asset — protect it aggressively.'},
  channel:{ core:'Warm outreach and physical local presence', why:'Your market is measured in square miles, not clicks. Door-to-door, local groups, and the people you already know will out-perform any online strategy at this scale, at zero cost.',
    volume:'30 doors or 30 local messages a day, plus 1 post in every local group you can join.',
    script:'Hi — I\'m [name], I live over on [street]. I\'m starting a [service] business and I\'m doing the first five houses on this road at half price so I\'ve got photos to show people. Takes about two hours, I bring everything, it\'d be $[X] instead of $[Y]. Any interest?'},
  weeks:[
    ['Days 1–7','Pick the job and the streets','Choose one service and a specific 2-mile radius. Check three competitors\' prices. Buy only what you need to do job one — nothing else.'],
    ['Days 8–14','Get the first five jobs at half price','Do them for photos and reviews, not profit. Take before-and-after shots of every single one from the same angle.'],
    ['Days 15–35','Saturate the area','Doors, local Facebook groups, neighbourhood apps, a sign on your car. Ask every finished customer for one neighbour\'s name.'],
    ['Days 36–60','Build the route','Cluster jobs geographically to cut travel time. Travel time is your biggest hidden cost and nobody pays you for it.'],
    ['Days 61–80','Convert to recurring','Offer the monthly version to every happy one-off customer. A route of 20 monthly customers is a real income.'],
    ['Days 81–90','Systematise','Write down exactly how you do the job, in order, as a checklist. That checklist is what lets someone else do it later.']
  ],
  econ:{ lines:['Contribution per job = price − materials − fuel','Break-even jobs per month = fixed costs ÷ contribution per job','Jobs per day = usable hours ÷ (job time + travel time)'],
    watch:'Track travel time as a real cost. Two jobs on the same street beats three jobs across town, every time.'},
  firstTen:['Choose one service, one radius, one price. Today.','Do five jobs at half price this week for photos','Post before-and-afters in every local group you can join','Leave a card or note at the four houses either side of every job you do','Text every past customer 30 days later: "due again?"'],
  traps:['Buying equipment before the first customer. Rent, borrow, or start with the cheap version.','Undercharging to win the job. Local customers who choose on price complain the most and refer the least.','Driving all over the city for single jobs. Density is the whole business.'],
  books:['The E-Myth Revisited — Michael Gerber','$100M Offers — Alex Hormozi','The Checklist Manifesto — Atul Gawande'],
  tools:['Google Business Profile — free, and the single highest-ROI local listing','Canva free — before/after posts','Square or SumUp — card payments, free to start','Google Maps — route planning']
},
{
  id:'productized', name:'The Productized Service', short:'A repeatable service sold to businesses',
  line:'One clearly defined service, one fixed price, sold to businesses on a monthly basis.',
  capital:'$0 – $100', firstDollar:'14 – 45 days', ceiling:'$10k–$50k/mo, genuinely sellable as an asset',
  what:'You take one service, remove every option, and sell it like a product: same scope, same price, same turnaround, every time. Businesses buy it because the decision is easy and the invoice is predictable. You like it because it is the only version of a service business that can be delegated.',
  examples:['"Unlimited design requests, one at a time, $995/month"','"We answer your inbound emails within 2 hours, $1,200/month"','"Two edited videos a week, delivered every Monday, $800/month"'],
  dream:'A recurring business problem stops being their problem, permanently, for a predictable monthly number.',
  obstacles:[
    ['Businesses are sceptical of unknown suppliers','Start with a paid pilot month at a reduced rate rather than asking for a long contract'],
    ['They\'ve been burned by agencies before','Publish your scope, your turnaround and your price openly. Radical clarity is the differentiator in a category built on vagueness'],
    ['Switching feels expensive','Do the migration yourself, for free, in the first week']
  ],
  pricing:{ model:'Flat monthly subscription. This is what makes it productized rather than freelance.',
    tiers:[['Solo','One active request at a time, 3-day turnaround','$495 / mo'],['Growth','Two active requests, 48-hour turnaround, monthly call','$995 / mo'],['Scale','Unlimited queue, 24-hour turnaround, direct Slack access','$1,995 / mo']],
    note:'B2B buyers spend company money, not their own. They care about outcome and reliability far more than price. Charging too little actively signals that you are not serious.',
    guarantee:'"Cancel any time, no notice, no contract." Removes the entire risk of the decision, and if your delivery is good it costs you almost nothing.'},
  channel:{ core:'Cold outreach, targeted', why:'A $995/month customer is worth ~$12,000 a year. That economics justifies hours of research per prospect, which makes precise cold outreach the highest-return channel available to you.',
    volume:'15 deeply researched emails or DMs a day. Quality of targeting beats volume here — but only after volume has taught you what converts.',
    script:'Subject: your [specific thing] — [company]\n\nHi [name], I looked at [specific evidence you actually looked]. [One specific observation about a gap.] We fix exactly this for [industry] companies — [scope] for a flat $[price] a month, cancel any time. I\'ve already done a sample for you: [link]. If it\'s useful, keep it. If you want the rest, reply and we start Monday.'},
  weeks:[
    ['Days 1–10','Define the product, not the service','Write the scope, the price and the turnaround on one page. If a customer can ask "how much would it be for…" you haven\'t productized it yet.'],
    ['Days 11–25','Build the delivery system before the first sale','Write the SOP for delivering one unit. Time yourself doing it once. If it takes more than 4 hours, narrow the scope.'],
    ['Days 26–55','Cold outreach with a sample attached','Do free sample work for the top 20 prospects. This converts several times better than any pitch, because it proves quality instead of claiming it.'],
    ['Days 56–75','Land two pilot customers','A paid one-month pilot at 50% is a much easier yes than a subscription, and it converts to full price at a high rate if you deliver.'],
    ['Days 76–85','Deliver ruthlessly on time','On-time delivery is the whole moat in this category. Most competitors are late. Being boringly reliable is a competitive advantage.'],
    ['Days 86–90','Delegate the first step','Hand off one part of the SOP — even a two-hour-a-week piece. That is the exact moment this stops being a job you own.']
  ],
  econ:{ lines:['MRR = customers × monthly price','Gross margin = (price − delivery cost) ÷ price. Target 60%+ once you\'re paying someone else to deliver','LTV = monthly price × gross margin × average months retained','Target LTV:CAC ≥ 3:1 before you spend money on acquisition'],
    watch:'Churn is the silent killer. Ten customers at 10% monthly churn is a treadmill; at 3% it is a compounding business.'},
  firstTen:['Write the one-page scope-price-turnaround document','Pick a single industry. "Businesses" is not a market','Do free sample work for 20 named companies','Offer a paid pilot month, not a contract','Ask every pilot customer for one referral in the same industry'],
  traps:['Saying yes to custom work. One exception and you are a freelancer again.','Targeting "small businesses" generically. Pick one industry so your samples and language compound.','Hiring before your SOP exists. You cannot delegate a process that only lives in your head.'],
  books:['$100M Offers — Alex Hormozi','Built to Sell — John Warrillow','The E-Myth Revisited — Michael Gerber','Predictable Revenue — Aaron Ross'],
  tools:['Notion free — SOPs and client portal','Loom free — sample work and async updates','Stripe — subscription billing','Google Sheets — pipeline tracker']
},
{
  id:'creator', name:'The Audience Engine', short:'Content first, money second',
  line:'Build attention around one specific topic, then sell the audience something they already asked for.',
  capital:'$0', firstDollar:'60 – 180 days', ceiling:'Effectively uncapped, but slow and heavy-tailed',
  what:'You publish consistently on one narrow topic until a group of people trust you, then you sell them the thing they keep asking about. It is the highest-ceiling zero-capital model and by far the slowest to first dollar. Choose it with your eyes open: most people who quit, quit in month three.',
  examples:['Short-form video teaching one skill you already have','A newsletter for one specific profession','A YouTube channel documenting a build in public'],
  dream:'They learn something that changes how they do a thing, from someone who feels like a real person rather than a brand.',
  obstacles:[
    ['Nobody watches the first fifty posts','Expected, and non-negotiable. The first fifty are your training reps, not your marketing'],
    ['You run out of ideas','Answer one real question per post. Your comments, Reddit and Google autocomplete are an infinite supply'],
    ['Attention doesn\'t equal money','Decide what you\'ll sell in month one, and mention it from day one, even to nobody']
  ],
  pricing:{ model:'Free content, paid depth. Monetise with a digital product, a service, or sponsorship — in that order of reliability.',
    tiers:[['Free','The content itself. Builds trust and mental availability','$0'],['Product','A template, guide or short course answering your most-asked question','$27 – $97'],['Service or cohort','Doing it with them or for them','$300 – $2,000']],
    note:'Do not wait for a big audience to sell. A thousand engaged people in a specific niche outperforms a hundred thousand random viewers, every time.',
    guarantee:'30-day no-questions refund on anything digital. Refund rates on genuinely useful products run low, and the guarantee lifts conversion far more than refunds cost.'},
  channel:{ core:'Warm content, at volume', why:'Content is an asset with increasing returns and a long lag. It compounds if you survive the lag. Everything about this model is a bet on your ability to keep publishing when nothing is happening.',
    volume:'One post a day, or three a week minimum, for 90 days. Non-negotiable. Consistency beats quality early because it is how you find out what quality means here.',
    script:'Post structure that works on every platform:\n1. Hook — the specific problem, in the first three seconds or first line\n2. Stakes — why it costs them something\n3. The actual answer — give it away completely, do not tease\n4. One next step — follow, or the link\n\nGive away your best material. The people who take it for free were never buyers; the people who buy are buying speed and depth, not secrets.'},
  weeks:[
    ['Days 1–7','Pick one topic and one platform','One. Not three. Narrow enough that you could name ten specific people who\'d follow it. Write down what you intend to sell eventually.'],
    ['Days 8–30','Publish 20 pieces','Volume over polish. You are calibrating, not broadcasting. Nobody is watching yet and that is a gift — use it to get bad in private.'],
    ['Days 31–60','Find the pattern and repeat it','Look at your top three posts. What do they have in common? Do more of exactly that. This is the entire optimisation loop.'],
    ['Days 61–75','Build the list','Move people off the platform you don\'t own. Email is the only audience nobody can take from you. Offer one genuinely useful free thing.'],
    ['Days 76–90','Sell something small','Take the question you get asked most and turn it into a $27 product. Small and real beats big and hypothetical.']
  ],
  econ:{ lines:['Revenue = audience × conversion rate × price','A 1–3% conversion on an engaged list is a normal, healthy number','1,000 engaged subscribers × 2% × $50 = $1,000 per launch'],
    watch:'Track the follower-to-email conversion and the email-to-buyer conversion separately. Most creators track neither and then guess about why nothing works.'},
  firstTen:['Choose one topic and commit for 90 days in writing','Publish 20 pieces before you judge anything','Reply to every single comment for the first 90 days','Put one free useful thing behind an email signup','Sell one small thing before you feel ready'],
  traps:['Chasing views instead of a specific viewer. Broad content builds a worthless audience.','Waiting to monetise until you "have enough people". Sell at 100 followers.','Switching topics in month two because it feels slow. It is slow. That is the entry barrier, and it is why it works.'],
  books:['$100M Leads — Alex Hormozi','How Brands Grow — Byron Sharp','Influence — Robert Cialdini','The Almanack of Naval Ravikant — Eric Jorgenson'],
  tools:['CapCut free — video editing','Canva free — thumbnails and graphics','Beehiiv or MailerLite free tier — email list','Notion free — content calendar']
},
{
  id:'digital', name:'The Digital Product', short:'Make it once, sell it many times',
  line:'Package something you know into a file, and sell the same file repeatedly at ~100% margin.',
  capital:'$0', firstDollar:'21 – 60 days', ceiling:'$1k–$30k/mo depending entirely on distribution',
  what:'A template, guide, notion system, preset pack, or short course. The economics are perfect — build once, sell infinitely, no delivery cost. The catch is brutal and universally underestimated: making it is 10% of the work, distribution is the other 90%, and everyone gets this backwards.',
  examples:['A spreadsheet system for a specific job role','A set of templates for a specific tool','A short, practical course on one narrow skill'],
  dream:'They skip the hundred hours you already spent figuring this out.',
  obstacles:[
    ['They can\'t tell if it\'s any good before buying','Give away a real, usable slice of it publicly. The free slice is your advertisement'],
    ['They\'ve bought useless digital products before','Guarantee it unconditionally and make the promise narrow enough to be obviously deliverable'],
    ['They can find something free on YouTube','True. You are selling organisation, sequence and time saved — not information. Price and position on that basis']
  ],
  pricing:{ model:'Value-based with a Good/Better/Best ladder. The middle tier is what most people buy; the top tier exists to make the middle look sensible.',
    tiers:[['The thing','The core product on its own','$27'],['Thing + support','Product plus templates, examples and a walkthrough','$67'],['Thing + you','Product plus a live session or a review of their work','$197']],
    note:'Under $50 sells on impulse and needs volume. Over $200 needs trust, which means you need an audience or a strong guarantee first. There is very little in between that works.',
    guarantee:'Unconditional 30-day refund, stated loudly. Risk reversal is the cheapest conversion lever that exists and digital goods cost you nothing to refund.'},
  channel:{ core:'Warm content first, then cold content', why:'Digital products have ~100% gross margin, which is the one thing that eventually makes paid ads viable. But not at the start — build organic distribution first, and only pay for traffic once you know your conversion rate.',
    volume:'Publish 3–5 times a week on one platform for the whole 90 days, every piece pointing at the free slice.',
    script:'The launch sequence that works:\n1. Publish free content on the exact problem for 30 days\n2. Say "I\'m building the full version of this" — publicly, before it exists\n3. Ask what should be in it. People who answer are your first buyers\n4. Presell it at half price to that group before you build it\n5. Build it. Ship it. Raise the price.'},
  weeks:[
    ['Days 1–10','Find the question, don\'t invent the product','What do people repeatedly ask you, or ask in the forums where your people are? Build the answer to that, not the thing you find interesting.'],
    ['Days 11–25','Presell before you build','Ten people paying $15 up front is a validated product. Zero people is a saved month. This step is the entire risk management of this model.'],
    ['Days 26–50','Build the smallest complete version','It has to solve the whole problem, not all problems. Complete and small beats comprehensive and unfinished.'],
    ['Days 51–70','Distribution, not features','Every hour after launch goes to getting it in front of people, not to improving it. This is the step everyone skips.'],
    ['Days 71–85','Collect proof','Ask every buyer for one specific sentence about what changed for them. Social proof compounds faster than any feature.'],
    ['Days 86–90','Raise the price and add a tier','Add the "with support" version. Same product, more margin, more value for the people who want it.']
  ],
  econ:{ lines:['Revenue = traffic × conversion rate × price','2% conversion on a sales page is a normal, healthy result','Gross margin ≈ 97% after payment processing','Break-even is essentially the first sale — all the risk is your time'],
    watch:'Traffic is the constraint, not the product. If you\'re not selling, you almost certainly have a distribution problem, not a quality problem.'},
  firstTen:['Find the question that gets asked repeatedly','Presell to ten people before building anything','Build the smallest version that fully solves it','Give away 20% of it publicly, forever','Ask every buyer for one sentence of proof'],
  traps:['Building for three months before showing anyone. The single most common way this model fails.','Making it comprehensive. Narrow and complete sells; broad and shallow doesn\'t.','Assuming it will sell itself. Nothing sells itself. Ever.'],
  books:['$100M Offers — Alex Hormozi','$100M Leads — Alex Hormozi','Breakthrough Advertising — Eugene Schwartz','Obviously Awesome — April Dunford'],
  tools:['Gumroad or Payhip — free to start, they take a cut','Google Docs / Sheets / Canva — to build the thing','Notion free — if it\'s a system or template','Carrd free — a one-page sales page']
},
{
  id:'ecom', name:'The Product Store', short:'Print-on-demand & niche e-commerce',
  line:'Sell a physical product to a specific group of people who already identify as something.',
  capital:'$50 – $500', firstDollar:'30 – 90 days', ceiling:'$2k–$100k/mo, but margin-constrained',
  what:'Print-on-demand means no inventory and no upfront cost — the supplier prints and ships when someone orders. The design is easy. The hard part, and the part that kills 95% of stores, is that customer acquisition costs real money and your margin has to cover it.',
  examples:['Apparel for a specific hobby community with in-group language on it','Products for a specific profession that only insiders would get','A single well-designed physical product for a niche you belong to'],
  dream:'They own something that signals who they are to people who understand it.',
  obstacles:[
    ['They don\'t trust an unknown store','Real photos, a real about page, visible reviews, a clear returns policy'],
    ['Shipping takes too long','Say the delivery window up front. Broken expectations cause chargebacks, not slow shipping'],
    ['They can buy something similar cheaper','Then you have no business. The design and the in-group identity must be the product, not the t-shirt']
  ],
  pricing:{ model:'Cost-plus is the trap here. You must price on what the identity is worth, and your margin must be able to absorb acquisition cost.',
    tiers:[['Entry','Sticker, mug, or low-ticket item — an easy first purchase','$12 – $18'],['Core','The main apparel or product piece','$32 – $48'],['Bundle','Two or three pieces at a slight discount to lift order value','$65 – $90']],
    note:'Non-negotiable rule: gross margin must be at least 60%. On a $35 shirt costing you $14, that\'s $21 to cover ads, returns and profit. If ads cost $25 to get a sale, you are paying people to take your product.',
    guarantee:'Free returns within 30 days. Expensive, and the single biggest conversion lever in apparel. Build the cost into the price.'},
  channel:{ core:'Cold content — organic first, paid only once the math works', why:'Physical products have thin margin, which makes expensive acquisition fatal. Build organic short-form traction first and only switch on paid spend when you know your conversion rate and AOV.',
    volume:'One organic short-form video a day showing the product in real use, for 90 days.',
    script:'Organic content that sells product:\n1. Show the product being used by a real person in a real place\n2. Lead with the in-joke or identity, not the product features\n3. Never say "link in bio" for the first 30 posts — build the community feeling first\n4. Only run paid ads once an organic post has already proven it converts'},
  weeks:[
    ['Days 1–14','Pick the group, not the product','Which community do you already belong to and understand from the inside? You cannot fake in-group language, and in-group language is the entire product.'],
    ['Days 15–30','Design three things and validate free','Post the designs as content before you build a store. If nobody says "where can I buy this", the design is wrong and you\'ve saved yourself a month.'],
    ['Days 31–45','Set up the store properly','A free storefront plus a print-on-demand supplier. Order one sample yourself. Photograph it in real life, not on a mockup generator.'],
    ['Days 46–70','Organic content daily','Every post shows the product in real use. Build the audience and the store simultaneously.'],
    ['Days 71–85','Compute your real unit economics','Product cost, shipping, fees, returns, ad spend. Know your actual contribution margin per order before you scale anything.'],
    ['Days 86–90','Scale or kill','If contribution margin covers acquisition with room left, spend more. If it doesn\'t, stop. Scaling broken unit economics just makes you fail faster.']
  ],
  econ:{ lines:['Contribution margin = price − product cost − shipping − payment fees','Break-even ad spend per order = contribution margin','Target: acquisition cost under 30% of revenue','AOV × margin % must comfortably exceed cost to acquire a customer'],
    watch:'This is the one model on this list where you can be busy, popular and losing money at the same time. Compute the margin before you spend a dollar on ads.'},
  firstTen:['Pick a community you are genuinely part of','Post the designs before you build the store','Order a sample and photograph it in real life','Post daily organic content for 30 days before spending on ads','Compute contribution margin per order in a spreadsheet'],
  traps:['Generic designs anyone could sell. If it isn\'t an in-group signal, it\'s a commodity.','Spending on ads before organic proves the product converts.','Ignoring returns and fees in the margin math. They are 10–20% of revenue.'],
  books:['$100M Offers — Alex Hormozi','How Brands Grow — Byron Sharp','DotCom Secrets — Russell Brunson','Financial Intelligence for Entrepreneurs — Berman & Knight'],
  tools:['Printful / Printify — print-on-demand, no upfront cost','Shopify trial or Payhip free — storefront','CapCut free — product video','Canva free — designs and mockups']
},
{
  id:'flip', name:'The Flip', short:'Buy low, sell high, repeat',
  line:'Buy underpriced things, sell them at market, and learn the entire business loop in a week.',
  capital:'$20 – $300', firstDollar:'3 – 14 days', ceiling:'$1k–$10k/mo — a fast teacher, not a long-term home',
  what:'Buy items that are mispriced because of where they are, then sell them where they\'re worth more. It is the fastest complete business education available: sourcing, pricing, margin, negotiation and customer service, all inside seven days, for under a hundred dollars.',
  examples:['Thrift store clothing resold on a fashion resale app','Furniture bought free from local listings, cleaned, resold','Retail clearance resold on a marketplace at normal price'],
  dream:'They get the thing they wanted at a price that feels like a win, without hunting for it themselves.',
  obstacles:[
    ['They don\'t trust a private seller','Photograph everything honestly, including flaws. Honest flaw photos increase conversion, they don\'t reduce it'],
    ['They want to haggle','Price 15% above your floor and let them win the negotiation'],
    ['They don\'t want to travel','Meet halfway, or ship. Convenience is worth more than the last five dollars']
  ],
  pricing:{ model:'Market-based, informed by sold listings — never asking prices. Asking prices are fantasy; sold prices are data.',
    tiers:[['Quick flip','Priced to move in under 7 days','Cost × 2'],['Patient flip','Priced at full market, may sit for a month','Cost × 3+'],['Bundle','Several related items sold together','Higher total, faster clearance']],
    note:'The rule: never buy anything you cannot sell for at least 3× what you paid. That multiple is what absorbs the items that don\'t sell, and some won\'t.',
    guarantee:'Accurate description with honest flaw photos. In resale, your rating is your entire business — protect it above any individual sale.'},
  channel:{ core:'Warm and cold content on marketplaces', why:'The marketplaces already have all the buyers. You don\'t need marketing, you need supply and good listings. That is why this is the fastest model to first money.',
    volume:'List 5 items a day. Sourcing 3 hours a week. The constraint is almost always listings, not buyers.',
    script:'A listing that sells:\n1. Title = exactly what a buyer would type into search, brand and model included\n2. First photo in natural light on a plain background\n3. Photograph every flaw and say so in the description\n4. Include measurements — the number one question and the number one cause of returns\n5. Price from sold listings, not from what other people are asking'},
  weeks:[
    ['Days 1–7','Learn the prices before you buy anything','Pick one category. Spend a week looking only at sold listings. You are building price knowledge, which is the actual asset here.'],
    ['Days 8–14','Buy five items, sell five items','Small budget, fast loop. The goal is completing the cycle, not profit.'],
    ['Days 15–35','Systematise sourcing','Which sources, which days, which categories. Track cost, sale price, days-to-sell and profit per item in a spreadsheet.'],
    ['Days 36–60','Narrow to your best category','Whatever has the highest profit per hour, do only that. Specialists beat generalists in resale because price knowledge is category-specific.'],
    ['Days 61–80','Increase volume','Same process, more items. This is where you feel Law 5 — volume negates luck — in your hands.'],
    ['Days 81–90','Decide what it taught you','Flipping is a superb teacher and a hard business to scale. Use the cash and the lessons to fund the next thing, or specialise deeply.']
  ],
  econ:{ lines:['Profit per item = sale price − cost − fees − shipping','Return on capital = profit ÷ cost, per cycle','Cash cycle = days from buying to being paid. This is your real constraint','Profit per hour = total profit ÷ (sourcing + listing + shipping hours)'],
    watch:'Track profit per hour, not profit per item. A $40 profit on an item that took four hours is a bad job, not a good business.'},
  firstTen:['Pick one category and study sold prices for a week','Buy five items with a strict $100 total budget','List within 24 hours of buying — inventory sitting is dead cash','Track every item: cost, price, days to sell, profit','Reinvest 100% of profit for the first 60 days'],
  traps:['Buying things you personally like instead of things that sell.','Not counting your own time. Profit per hour is the only honest metric here.','Letting inventory sit unlisted. Unlisted stock is money you\'ve set on fire slowly.'],
  books:['The Goal — Eliyahu Goldratt','Financial Intelligence for Entrepreneurs — Berman & Knight','$100M Offers — Alex Hormozi'],
  tools:['eBay sold-listings filter — free price data','Vinted / Depop / Facebook Marketplace — free listing','Google Sheets — inventory and profit tracker','Your phone camera + a white sheet — product photos']
},
{
  id:'software', name:'The Small Software', short:'Micro-SaaS & AI automation',
  line:'Build a narrow tool that solves one annoying problem for one specific kind of business.',
  capital:'$0 – $100', firstDollar:'45 – 120 days', ceiling:'$5k–$100k/mo, the best margins in business',
  what:'A small tool, an automation, or an AI workflow that removes a specific manual task. Modern no-code and AI tooling means you no longer need to be a strong engineer to ship something people will pay for. You do need patience and a genuine willingness to talk to customers.',
  examples:['An automation that turns a business\'s messy inbox into a clean task list','A single-purpose tool for a niche profession that Excel handles badly','An AI workflow that does a repetitive back-office job'],
  dream:'A task that ate four hours a week now takes four minutes and doesn\'t need thinking about.',
  obstacles:[
    ['They doubt a small tool from an unknown developer','Do the job manually for the first three customers before automating it. Sell the outcome, deliver by hand, then build'],
    ['Switching costs','Import their existing data yourself, personally, for free'],
    ['"We could build this internally"','They won\'t. Price low enough that building it internally is obviously not worth their engineering time']
  ],
  pricing:{ model:'Monthly subscription, per seat or per usage. Land low, expand as usage grows.',
    tiers:[['Solo','One user, core function','$19 / mo'],['Team','Up to five users, integrations, support','$79 / mo'],['Business','Unlimited users, priority support, onboarding','$249 / mo']],
    note:'B2B software is chronically underpriced by first-time founders. If nobody has complained about your price, it\'s too low. Test doubling it on new signups only.',
    guarantee:'Free 14-day trial with no card required, plus you do the setup yourself. Removes both the money risk and the effort risk at once.'},
  channel:{ core:'Cold outreach, then warm content', why:'Software has near-100% gross margin, which means you can afford almost any acquisition cost — eventually. At the start you have no proof, so direct outreach to a narrow niche is the only channel that works.',
    volume:'10 highly targeted messages a day plus one build-in-public post. Your first ten customers come from conversations, not from marketing.',
    script:'Hi [name] — I build small tools for [industry]. I noticed [specific manual process] usually eats a few hours a week at companies your size. I\'ve built something that does it automatically. I\'ll set it up on your data myself, free, and if it doesn\'t save you time you never hear from me again. Worth 15 minutes?'},
  weeks:[
    ['Days 1–15','Find the pain by talking, not building','Interview 15 people in one industry. Ask what they do manually every week and hate. Do not describe an idea. Listen for a repeated complaint.'],
    ['Days 16–30','Sell it before it exists','Describe the solution to five of them. Ask for a pre-order or a signed intent. Anyone who says "sounds cool" is a no.'],
    ['Days 31–50','Deliver manually first','Do the job by hand for the first three customers. You will learn what to build and get paid while learning it.'],
    ['Days 51–75','Automate the manual work','Now build the tool — but only the parts you actually did by hand. Everything else is speculation.'],
    ['Days 76–85','Onboard by hand, every time','Personally set up every customer. This is how you find the real friction and keep churn near zero.'],
    ['Days 86–90','Measure retention','Are people still using it after 30 days? Retention is the only honest signal in software. Everything else is vanity.']
  ],
  econ:{ lines:['MRR = customers × average revenue per account','Gross margin ≈ 85–95% after hosting','LTV = ARPA × gross margin ÷ monthly churn rate','CAC payback should be under 12 months, ideally under 6'],
    watch:'Churn above 5% monthly means the product isn\'t solving the problem. Fix retention before you touch acquisition — a leaky bucket cannot be filled faster than it drains.'},
  firstTen:['Interview 15 people in one industry before writing any code','Get five to commit before building','Do the work manually for the first three','Personally onboard every early customer','Track 30-day retention from customer one'],
  traps:['Building for six months in silence. The classic and fatal error.','Building for "everyone". Ten customers in one industry beats a hundred scattered.','Adding features instead of fixing retention.'],
  books:['The Lean Startup — Eric Ries','The SaaS Playbook — Rob Walling','$100M Offers — Alex Hormozi','Obviously Awesome — April Dunford'],
  tools:['AI coding assistants — free tiers, genuinely capable now','Make / Zapier / n8n free tiers — automation without code','Supabase or Airtable free tier — database','Vercel or Netlify free tier — hosting']
},
{
  id:'coach', name:'The Teaching Business', short:'Tutoring, coaching & instruction',
  line:'Get paid for what you already know, one person or one small group at a time.',
  capital:'$0', firstDollar:'7 – 30 days', ceiling:'$2k–$15k/mo solo, more via groups and products',
  what:'You know something someone else wants to learn. Tutoring, skill coaching, language practice, instrument lessons, exam prep, fitness. It requires no capital and no product, and the bar is not "expert" — the bar is being two steps ahead of the person you\'re teaching.',
  examples:['Exam or subject tutoring for a specific year group','Teaching a software or creative skill you use daily','Language conversation practice with a specific profession']
  ,dream:'They get to the thing they want faster, with someone who won\'t let them quit.',
  obstacles:[
    ['They doubt your credentials','Offer a free first session. Results in one session beat any certificate'],
    ['They\'ve tried and failed before','Sell the structure and the accountability, not the information. The information is free and they know it'],
    ['Price feels high per hour','Sell a package of six sessions with an outcome attached, not loose hours. Outcomes justify prices that loose hours never can']
  ],
  pricing:{ model:'Package pricing tied to an outcome. Never sell single hours — single hours make you a commodity and guarantee churn.',
    tiers:[['Single session','One-off, mostly for trials','$30 – $60'],['Six-session package','A defined outcome over six weeks','$250 – $450'],['Group program','Six to ten people, same outcome, weekly','$150 per person']],
    note:'The group version is the leverage. Same hour of your time, six times the revenue, and peer accountability makes the results better rather than worse.',
    guarantee:'"If you don\'t feel the first session was worth it, it\'s free." Costs you almost nothing and removes the entire barrier to trying you.'},
  channel:{ core:'Warm outreach, then referrals', why:'Teaching is a trust purchase, and trust travels by recommendation. Your existing network and your first students\' networks will out-perform any advertising you could buy.',
    volume:'20 personal messages in week one, then one referral request per satisfied student, every month.',
    script:'Hi [name] — I\'m tutoring [subject] for [specific group] and I\'m taking on three students this month. First session is free so you can see if it clicks. If it does, it\'s $[X] for six weeks and we work toward [specific outcome]. Know anyone it might suit — or is that you?'},
  weeks:[
    ['Days 1–7','Define the outcome, not the subject','"Maths tutoring" is a commodity. "Get from a C to an A in GCSE maths in one term" is a product with a price.'],
    ['Days 8–20','Get three free students','Family, friends of friends, local groups. Free students give you reps, testimonials and referrals — three things you cannot buy.'],
    ['Days 21–40','Convert to paid packages','Six sessions with a defined outcome. Everyone who got value from free will consider paid, if you ask directly.'],
    ['Days 41–60','Build the referral loop','Every satisfied student is asked for one name. This is the whole growth engine and it costs nothing.'],
    ['Days 61–80','Run one group','Take your best six students and run them together. Test that your time can serve more than one person at once.'],
    ['Days 81–90','Package the repeated part','Whatever you explain in every single session becomes a video or a worksheet. That is the seed of a digital product.']
  ],
  econ:{ lines:['Revenue = students × package price × packages per year','Capacity = teachable hours per week ÷ hours per student','Group revenue per hour = participants × price per participant ÷ total hours','Gross margin ≈ 100%; your constraint is hours, not money'],
    watch:'Hours are your inventory and they don\'t restock. Once you\'re at 70% booked, the only ways up are price and groups.'},
  firstTen:['Define one measurable outcome you can deliver','Teach three people free, this month','Ask each for one written sentence about the result','Convert free students to six-session packages','Ask every student for one referral name'],
  traps:['Charging hourly. It caps you and attracts people who count minutes.','Teaching anything to anyone. Specialists command double.','Waiting until you feel "qualified". Two steps ahead is enough, and always was.'],
  books:['$100M Offers — Alex Hormozi','Influence — Robert Cialdini','SPIN Selling — Neil Rackham'],
  tools:['Google Meet or Zoom free — sessions','Calendly free — booking','Google Slides / Docs — materials','Stripe payment links — packages upfront']
},
{
  id:'community', name:'The Community & Events', short:'Bring the right people together',
  line:'Gather a specific group of people repeatedly, and monetise the gathering itself.',
  capital:'$0 – $200', firstDollar:'30 – 90 days', ceiling:'$1k–$20k/mo, unusually durable once established',
  what:'A recurring meetup, a run club, a professional dinner, a paid online group, a local class night. You create the thing people show up to. It is slow to monetise and unusually defensible once it exists, because a community cannot be copied — only rebuilt.',
  examples:['A monthly meetup for one profession in your city','A weekend club around a hobby, with paid membership','A paid online group with a weekly call and a real curriculum'],
  dream:'They stop feeling alone in the thing they care about, and they meet people who make it better.',
  obstacles:[
    ['Nobody comes to a new event','Personally invite 30 people for your first one. Never rely on a public post for event one'],
    ['They won\'t pay for something social','Charge for the format and the curation, not the socialising. Or monetise via sponsors and vendors instead'],
    ['It dies after three months','Fixed schedule, same day every month, no exceptions. Reliability is what turns an event into an institution']
  ],
  pricing:{ model:'Free at first to build density, then paid membership, ticketed events, or sponsorship once people show up reliably.',
    tiers:[['Free','Open meetup — builds the base','$0'],['Membership','Monthly access, priority, extra content','$15 – $40 / mo'],['Premium event','Workshop, dinner, or intensive with a speaker','$40 – $150 per ticket']],
    note:'Sponsors pay for access to a defined audience. Twenty reliable attendees from one profession is genuinely sellable to a company that wants to reach them.',
    guarantee:'"Come to your first one free. If it wasn\'t worth your evening, don\'t come back." Zero risk to attend is how you solve the cold-start problem.'},
  channel:{ core:'Warm outreach, then warm content', why:'Communities are cold-start problems. Nobody joins an empty room, so the first thirty people have to be personally invited by you. There is no shortcut and no channel that replaces this.',
    volume:'30 personal invitations for event one. Then document every event publicly — the photos are what sell event two.',
    script:'Hi [name] — I\'m starting a monthly meetup for [specific group] in [city]. First one is [date] at [place], about 15 of us, free, just drinks and conversation with people doing the same thing. I thought of you specifically because [genuine reason]. Come?'},
  weeks:[
    ['Days 1–14','Define who it is emphatically not for','Specific communities thrive; general ones die. "People in tech" fails. "Junior developers in their first job in this city" works.'],
    ['Days 15–30','Personally invite 30 people','Not a post. Thirty individual messages. Expect 12 to say yes and 8 to actually come. That is a successful first event.'],
    ['Days 31–45','Run event one and document it','Photos, a group chat set up on the night, and the next date announced before anyone leaves.'],
    ['Days 46–70','Same day, every month','Reliability is the product. Third Thursday, every month, forever. Attendance compounds only if people can predict it.'],
    ['Days 71–85','Introduce money carefully','Membership, ticketed premium events, or a sponsor. Never make the core gathering feel like a sales channel.'],
    ['Days 86–90','Hand out roles','Give regulars jobs — greeter, photographer, host. Ownership is what turns attendees into a community.']
  ],
  econ:{ lines:['Revenue = members × membership fee + tickets × price + sponsorship','Cost per event = venue + food + materials (often $0 with the right venue)','Contribution per event = revenue − direct cost','Retention: what percentage come back next month? Under 40% means the format is wrong'],
    watch:'Attendance retention is the health metric. Growing an event that nobody returns to is just churn wearing a costume.'},
  firstTen:['Define the group narrowly enough to exclude most people','Personally invite 30 named humans','Set the next date before the first event ends','Start a group chat on the night','Find a venue that hosts you free for the footfall'],
  traps:['Posting publicly and hoping. Event one is always personal invitations.','Irregular scheduling. Predictability is the entire value.','Monetising too early. Density first, money second.'],
  books:['Influence — Robert Cialdini','How Brands Grow — Byron Sharp','$100M Leads — Alex Hormozi'],
  tools:['WhatsApp or Discord — free community infrastructure','Luma or Eventbrite free tier — event pages and RSVPs','Canva free — event graphics','Google Forms — feedback after every event']
}
];
