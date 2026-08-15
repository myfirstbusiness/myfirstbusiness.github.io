
/* ---------------------------------------------------------------------------
   1b. THE INDUSTRY LAYER
   The business model says HOW you make money. The industry says WHO buys,
   WHERE they are, and WHAT they'll pay. Without this layer two people with
   identical constraints get an identical document even though one wants to
   run a bakery and the other wants to detail cars. This is the layer that
   makes the playbook feel written for one person.
   ------------------------------------------------------------------------ */
const INDUSTRIES = {
  food:{ name:'Food & drink', noun:'food business', adj:'food',
    customer:'Busy people who want something better than they can make themselves, and small businesses that need feeding on a schedule — office lunches, event catering, market stalls, weekly meal drops.',
    where:'Local Facebook groups and neighbourhood apps first, then a market stall or a pop-up outside somewhere with existing footfall. Offices within a mile of you are the most underrated buyer in this industry: they order repeatedly and pay on invoice.',
    price:'Aim for food cost under 30% of your price. A $12 lunch box should cost you under $4 in ingredients. Catering is priced per head — $15–$40 is normal depending on the format. Cakes and bakes price at roughly 3–4× ingredient cost, minimum $35 for anything custom.',
    first:'Cook one thing, extremely well, for ten people this week. Photograph it properly in daylight. One dish done outstandingly beats a menu of eight done adequately, and a menu is the most common way beginners in this industry stall for months.',
    proof:'Photos of real food you actually made, plus names of real people who ate it and said something specific.',
    trap:'Building a menu before you have a customer. Every hour spent designing a menu is an hour not spent finding the ten people who will buy the one dish you already make best.',
    reg:'Food is the most regulated industry on this list. Before you sell anything, look up your local food hygiene registration and home-kitchen rules — in most countries registration is free or near-free but legally required, and allergen labelling is not optional. This is the one place where "just start" is bad advice.',
    cost:'$0–$60 for ingredients for a first batch. You do not need equipment yet.' },

  fitness:{ name:'Fitness & health', noun:'fitness business', adj:'fitness',
    customer:'People with a specific, dated goal — a wedding, a first 10k, coming back after an injury, getting through a desk job without back pain. Generic "get fit" customers churn fastest; specific-goal customers pay more and stay.',
    where:'The gym you already train at, local running and sports clubs, and short-form video where you demonstrate one fix for one problem. Physiotherapists and sports shops will refer to you if you make it easy for them.',
    price:'1-to-1 sessions $30–$70 depending on your market. Never sell single sessions — sell a six- or eight-week block with a named outcome, $250–$500. Small group of 4–6 at $15–$25 each is the same hour of your time at triple the revenue.',
    first:'Take one person through a six-week block for free, in exchange for before/after photos and a written sentence about what changed. That single case study is worth more than any certificate.',
    proof:'A named person with a measurable change over a stated timeframe. Numbers and dates, not vibes.',
    trap:'Waiting for a certification before you take anyone. Get one, eventually, because it matters for insurance and credibility — but a documented result on one real person will win you clients that a certificate never will.',
    reg:'Check whether personal training insurance is required or expected in your country, and be careful about giving nutrition or medical advice you are not qualified to give. Refer anything clinical to a professional and say so plainly.',
    cost:'$0. Bodyweight programming and a phone is a complete starting toolkit.' },

  beauty:{ name:'Beauty & personal care', noun:'beauty business', adj:'beauty',
    customer:'People with a recurring appointment need — nails every three weeks, a cut every four, lashes every two. The whole economics of this industry is rebooking, not first bookings.',
    where:'Instagram and TikTok are where this industry lives, and the content is straightforward: before/after, close-up, good lighting. Beyond that, mobile service to people\'s homes removes the biggest barrier your competitors have.',
    price:'Price at or slightly above the middle of your three nearest competitors. Cheapest in beauty attracts customers who cancel, haggle and never rebook. Mobile service justifies a 15–25% premium because you are selling their time back to them.',
    first:'Do five heads or five sets free this week, on people who will actually be seen in public, in exchange for photos and permission to tag them. Your portfolio is the entire product in this industry.',
    proof:'A grid of consistent before/after photos in the same lighting. Consistency reads as professionalism more than any single spectacular result.',
    trap:'Not rebooking on the spot. Book the next appointment before they leave the chair, every single time. That one habit is the difference between a hobby and an income here.',
    reg:'Many beauty services are licensed — lashes, needling, chemical treatments and sometimes barbering. Check your local licensing and insurance requirements before you take money. Skin-patch testing is a legal requirement for several treatments.',
    cost:'$40–$200 for a starter kit in most sub-niches. This is one of the few here that genuinely needs a little capital.' },

  fashion:{ name:'Clothing & fashion', noun:'clothing business', adj:'clothing',
    customer:'People buying identity, not fabric. They are paying to signal something to a group they belong to — a sport, a scene, a profession, an in-joke. If an outsider understands your design instantly, it is probably too generic to sell.',
    where:'Short-form video showing the item worn by a real person in a real place, and the online communities of whatever group you are designing for. Resale apps if you are flipping rather than making.',
    price:'Gross margin must clear 60%. A $35 shirt costing $14 leaves $21 for ads, returns and profit. If your acquisition cost is $25, you are paying people to take your product — that is the arithmetic that kills most stores in this industry.',
    first:'Post the design as content before you build any store. If nobody comments asking where to buy it, the design is wrong and you have just saved yourself a month and the cost of inventory.',
    proof:'Real people wearing it in real photographs. Mockup generators are visible from space and read as dropshipping.',
    trap:'Designing for everyone. In-group language and specificity are the entire product; without them you are selling a commodity t-shirt against companies with better supply chains than you.',
    reg:'Straightforward, but check that you are not using trademarked names, logos, club crests or lyrics. This is the single most common way small clothing brands get shut down.',
    cost:'$0 with print-on-demand, $50–$300 to order samples worth photographing.' },

  tech:{ name:'Tech, software & AI', noun:'tech business', adj:'tech',
    customer:'Small businesses doing something manual and repetitive every week that they hate — re-typing orders, chasing invoices, sorting an inbox, moving data between two systems that do not talk.',
    where:'Direct outreach to a single industry. Pick one — dentists, gyms, letting agents, plumbers — and learn its workflow properly. Ten customers in one industry beats a hundred scattered, because your language and your samples compound.',
    price:'Monthly subscription: $19 solo, $79 small team, $249 business. First-time founders chronically underprice here. Businesses buy on outcome and reliability, not price, and charging too little actively signals you are not serious.',
    first:'Interview fifteen people in one industry before you write a single line of code. Ask what they do manually every week and hate. Do not describe an idea — listen for the same complaint three times.',
    proof:'A working thing doing a real job on their real data, set up by you personally.',
    trap:'Building for six months in silence. Do the job manually for your first three customers — you get paid while learning exactly what to build, and you will build a quarter of what you imagined.',
    reg:'If you touch customer data you inherit data-protection obligations. Do not store anything you do not need, and be straight about what you keep.',
    cost:'$0. Free tiers on hosting, databases and AI tooling cover far more than you need at this stage.' },

  creative:{ name:'Design, media & content', noun:'creative business', adj:'creative',
    customer:'People who already publish and are constrained by production, not ideas — coaches posting daily, local businesses with terrible photos, small brands with no in-house designer. They have money and no time.',
    where:'Do the work uninvited. Find someone whose output is worse than it should be, fix one piece of it for free, and send it to them. This converts several times better than any pitch in any creative field.',
    price:'Per outcome, never per hour — hourly punishes you for getting faster, which you will. $75–$200 per edited video, $300–$800 for a brand identity, $150–$400 for a photo session. Convert to monthly retainers as fast as you can.',
    first:'Pick one target, produce one finished piece of work for them for free this week, and send it with no strings. Do it to a standard that slightly embarrasses you with how much effort you put in.',
    proof:'One finished artefact, sent directly. Not a portfolio site — a single real thing in the message.',
    trap:'Offering "anything creative". A video editor for fitness coaches beats a general video editor at three times the rate, because specificity is what lets you charge.',
    reg:'Get music, font and stock-image licensing right. Using unlicensed audio in client work is the fastest way to lose a client and a reputation simultaneously.',
    cost:'$0. Free editing and design tools are genuinely professional-grade now.' },

  edu:{ name:'Education & tutoring', noun:'teaching business', adj:'teaching',
    customer:'Parents with a dated deadline — an exam, an entrance test, a failing report card — and adults who need one specific skill for one specific reason. Deadlines are what make people pay properly.',
    where:'School-gate parent groups, local community boards, and the parents of students you already have. Referral is overwhelmingly the dominant channel in this industry and it costs nothing.',
    price:'Sell outcomes in blocks, never loose hours. Six sessions with a named result, $250–$450. Group of six at $150 each is the same hour at six times the revenue and the peer accountability makes results better, not worse.',
    first:'Define one measurable outcome you can actually deliver — "from a C to an A in one term", not "maths help". Then teach three people free this month and get one written sentence about the result from each.',
    proof:'A grade that moved, a test that was passed, a named student and a date.',
    trap:'Charging hourly. It caps your income and attracts people who count minutes. Outcomes justify prices that hours never can.',
    reg:'Working with minors usually requires a background check and, in many places, safeguarding rules about being alone with a child. Look this up before your first session — it protects you as much as them.',
    cost:'$0. A video call and a shared document is the whole infrastructure.' },

  home:{ name:'Home & property', noun:'home services business', adj:'home services',
    customer:'Homeowners and landlords who have the money to fix something and no desire to do it themselves. Landlords and letting agents are the best customers in this industry because they own many properties and buy repeatedly.',
    where:'Doors on the streets you can walk to, local Facebook groups, and a sign on your car. Density beats reach here — two jobs on one street is worth more than three across the city once you count travel.',
    price:'Fixed price per job, quoted before you start, never hourly to a homeowner. $60–$90 basic, $140–$180 for the job plus the two adjacent things they were going to nag about. Monthly recurring at roughly 15% off per visit.',
    first:'Do five jobs at half price this week, on your own street, purely for before-and-after photos. Shoot every one from the same angle. Those ten photos are your entire marketing for the next year.',
    proof:'Before-and-after pairs, same angle, same lighting. Nothing in this industry sells harder.',
    trap:'Driving across the city for single jobs. Cluster geographically or travel time quietly eats your entire margin.',
    reg:'Anything involving gas, electrics or structural work is licensed almost everywhere and dangerous to fake. Public liability insurance is inexpensive and worth having before you set foot in someone\'s house.',
    cost:'$0–$150. Borrow or rent equipment for the first jobs; buy only once a customer has paid for it.' },

  auto:{ name:'Cars & vehicles', noun:'vehicle business', adj:'vehicle',
    customer:'People who care about their car more than average — enthusiasts, people selling one soon, and anyone with a company or lease vehicle they have to hand back in good condition. Small fleets and dealers buy in volume.',
    where:'Car enthusiast groups locally and online, dealer forecourts, and office car parks where you can work on several vehicles in one visit. Turning up to them is the whole differentiator.',
    price:'Fixed per vehicle. $60–$100 basic detail, $180–$350 full, $400+ for correction work. Mobile service is worth a real premium because you are selling their Saturday back to them.',
    first:'Detail five cars this week at half price, purely for photos. Shoot before and after in the same spot in the same light — the transformation shot is the entire sales pitch in this industry.',
    proof:'Before-and-after in identical framing. Paint correction and interior shots convert best.',
    trap:'Buying $600 of equipment before the first customer. Start with the cheap version, take the money, upgrade from revenue.',
    reg:'Check local rules on water runoff and chemical disposal if you work on driveways or streets — some areas restrict it, and a complaint from one neighbour can end a round.',
    cost:'$50–$150 for a genuinely adequate starter kit.' },

  pets:{ name:'Pets & animals', noun:'pet business', adj:'pet',
    customer:'Owners who work full-time and feel guilty about it. This is a trust purchase above all others — people hand you a key to their home and a member of their family, and they pay for reliability, not skill.',
    where:'Local dog-walking routes, parks at the same time every day, vet noticeboards, groomers, and neighbourhood apps. Vets and groomers will refer if you introduce yourself in person once.',
    price:'$15–$25 per walk, $30–$50 per day of sitting, $25–$60 for grooming depending on size. The money is in a fixed weekly route of regulars, not one-off bookings.',
    first:'Walk three dogs free this week for neighbours, take photos, and ask each owner for one sentence and one neighbour\'s name. Build a route on one set of streets rather than scattered bookings.',
    proof:'Happy animals, photographed, plus owners saying you turned up when you said you would.',
    trap:'Taking bookings scattered across the city. Route density is the entire economics of this industry.',
    reg:'Pet-sitting and boarding are licensed in many countries and insurance is expected. Check the rules for your area, and be clear in writing about vet costs if something goes wrong.',
    cost:'$0–$50. Leads, poo bags, and turning up on time.' },

  events:{ name:'Events & entertainment', noun:'events business', adj:'events',
    customer:'People planning something with a fixed date they cannot move — a wedding, a birthday, a corporate event. The immovable date is why they pay properly and why reliability matters more than talent.',
    where:'Other suppliers are your best channel: venues, photographers, caterers and planners all refer work to people they trust. One good relationship with a venue can fill a calendar.',
    price:'Package pricing, never hourly. $150–$400 for a small party, $600–$1,500 for a wedding-scale booking. Deposits are non-negotiable — take 30–50% up front, always.',
    first:'Work one event free for a friend, shoot it properly, and use that footage to approach two local venues. Venues are the door into this whole industry.',
    proof:'Footage and photos of a real event with real people enjoying themselves.',
    trap:'Working without a deposit and a written scope. Cancellations and scope creep are the two things that make this industry unprofitable for beginners.',
    reg:'Public liability insurance is usually required by venues before they let you work. Music licensing applies at public events in most countries. Both are cheap and both are checked.',
    cost:'$0–$200 depending on what you already own.' },

  prof:{ name:'Business services', noun:'business services company', adj:'business services',
    customer:'Small business owners drowning in admin they never wanted to do — invoicing, inbox, bookkeeping, scheduling, social posting. They know exactly what it costs them in hours and they are relieved to hand it over.',
    where:'Cold outreach to one industry at a time, and local business networking, which is unfashionable and still works. Accountants and bookkeepers are an excellent referral source because they see the mess first.',
    price:'Flat monthly retainer, not hourly. $495 solo, $995 growth, $1,995 scale. B2B buyers spend company money and care about outcome and reliability far more than price.',
    first:'Write one page: exact scope, exact price, exact turnaround. If a prospect can ask "how much would it be for…", you have not productized it yet and you are about to become a freelancer instead.',
    proof:'A named business, the specific thing you took off their plate, and how many hours a week it gave them back.',
    trap:'Saying yes to custom work. One exception and you are back to trading hours, which is the thing this model exists to escape.',
    reg:'If you handle books or payroll, understand where your responsibility ends and a qualified accountant\'s begins — and say so in writing.',
    cost:'$0. Free tiers cover documents, scheduling and invoicing entirely.' },

  retail:{ name:'Products & retail', noun:'product business', adj:'product',
    customer:'People buying for a specific occasion or a specific identity — a gift, a hobby, a collection, a room they are decorating. Occasion-driven buying is more reliable than taste-driven buying.',
    where:'Marketplaces already contain all the buyers, so your constraint is supply and listing quality, not marketing. Local markets and fairs are the fastest way to test whether people will actually pay.',
    price:'Never buy anything you cannot sell for at least 3× what you paid. That multiple is what absorbs the items that do not sell — and some will not. Price from completed sales, never from what others are asking.',
    first:'Spend a week studying sold prices in one category before you buy anything. Then buy five items with a strict $100 budget and list all five within 24 hours.',
    proof:'A tracked spreadsheet: cost, sale price, days to sell, profit per item. In this industry the data is the skill.',
    trap:'Buying things you personally like instead of things that demonstrably sell. Also: not counting your own time. Profit per hour is the only honest metric here.',
    reg:'Check what you are not allowed to resell — branded goods, electricals without safety marks, and anything counterfeit will get an account permanently closed.',
    cost:'$30–$300 for first stock. This is one of the few here with a genuine floor.' },

  notsure:{ name:'Not decided yet', noun:'business', adj:'',
    customer:'You do not know yet, and that is the correct answer right now rather than a problem to be embarrassed about.',
    where:'The fastest route to knowing is contact, not thought. Twenty conversations will generate more usable ideas than two hundred hours of watching videos.',
    price:'Do not set prices for a business you have not defined. Price is a decision that comes after you know who the customer is.',
    first:'Have five conversations this week with people in any group you already belong to. Ask one question: "what part of this eats the most time and you hate the most?" Write down every answer word for word. Your idea is in there.',
    proof:'A written list of real complaints from real people, in their words.',
    trap:'Believing that more research will produce the idea. Ideas are downstream of contact with reality, not upstream of it.',
    reg:'Nothing yet. Once you pick a field, check its licensing before you take money.',
    cost:'$0.' }
};

/* ---------------------------------------------------------------------------
   1c. THE CAREER LAYER
   Whatever they did for work is an asset they almost certainly discount.
   This converts it into a stated advantage in their own document.
   ------------------------------------------------------------------------ */
const CAREERS = {
  none:{ name:'No work history yet', short:'no job yet',
    assets:['Time, which is the one input most people trying to start a business genuinely do not have','No expensive habits to protect and no salary to risk','No ingrained assumptions about how an industry "has to" work'],
    transfer:'You are starting without the two things that actually stop most people: sunk costs and a mortgage. The trade is that you have no credibility yet, so your entire early strategy is to manufacture proof fast — do the first jobs free, over-deliver visibly, and collect evidence. Three documented results and nobody will ask you about experience again.',
    edge:'Nothing to unlearn, and nothing to lose.' },
  retail:{ name:'Retail & customer service', short:'retail',
    assets:['You have talked to hundreds of strangers without freezing — the single hardest skill for most beginners','You can read whether someone is actually going to buy','You have handled complaints without taking them personally'],
    transfer:'Retail is quietly the best sales training there is, because you did it live, at volume, with no script. The outreach numbers in this plan will feel far less frightening to you than they do to most people, and objection handling is something you have already done a thousand times.',
    edge:'You already know how to ask for money out loud.' },
  hospitality:{ name:'Hospitality & food service', short:'hospitality',
    assets:['You work fast under pressure with a queue building','You understand service standards and what "good" actually looks like','You have coordinated with a team mid-rush without instructions'],
    transfer:'Hospitality builds two things almost nobody else has: genuine speed under pressure, and an instinct for service quality. Delivery is where most first businesses quietly fail, and you already know how to deliver consistently when it is hard. Use that as the promise — reliability is a real differentiator.',
    edge:'You deliver on time when it is chaotic. Most people cannot.' },
  trades:{ name:'Trades & manual work', short:'trades',
    assets:['A skill people will pay for immediately, today, without you needing to learn anything new','You can quote a job and estimate time accurately','You know what "finished properly" means'],
    transfer:'You are the closest of anyone here to money, because your skill converts to income the moment someone knows you exist. Your gap is not capability — it is that nobody knows about you. Almost all your effort should go into being findable and being reliable, not into getting better at the work.',
    edge:'You can charge from week one. Most people need months to get there.' },
  logistics:{ name:'Driving & delivery', short:'driving and logistics',
    assets:['You know your area better than almost anyone','You understand routing and how much time travel really eats','You have worked unsupervised to a schedule'],
    transfer:'Route knowledge is worth more than it sounds. Local service businesses live or die on job density, and you already think in terms of travel time and clustering — the exact thing that quietly destroys other people\'s margins. You also know which neighbourhoods have money.',
    edge:'You know the map and you show up on time.' },
  office:{ name:'Office & admin', short:'office and admin',
    assets:['You can make a process repeatable and write it down','You are comfortable with spreadsheets, invoices and systems','You know how businesses actually run day to day'],
    transfer:'Most first-time founders fail at the boring half — tracking, invoicing, following up, keeping records. That is exactly your strength, and it means you can skip straight to systematising while others are still losing track of who they contacted. Build the tracker in week one; you already know how.',
    edge:'You will not lose track of your own funnel.' },
  sales:{ name:'Sales & accounts', short:'sales',
    assets:['You can ask for money without flinching','You know how to follow up without being annoying','You understand that most revenue lives in follow-up 3 through 12'],
    transfer:'You have the rarest and most valuable skill on this entire list. Almost every other person taking this questionnaire is bottlenecked by an unwillingness to make offers — you are not. That means your plan should be front-loaded with volume: more conversations, faster, earlier, because that is where your unfair advantage compounds.',
    edge:'The part that stops everyone else does not stop you.' },
  care:{ name:'Healthcare & caring', short:'care work',
    assets:['People trust you quickly, which is the hardest thing to manufacture','You are reliable in situations where reliability genuinely matters','You have handled difficult conversations with distressed people'],
    transfer:'Trust is the scarcest commodity in early business and you accumulate it faster than almost anyone. That points you toward work where the customer has to trust you personally — in their home, with their family, with their body, with their money. Lead with reliability, because you can actually deliver it.',
    edge:'People believe you, and that is not a small thing.' },
  tech:{ name:'Tech & engineering', short:'tech',
    assets:['You can build or automate things that would cost other people money','You debug systematically instead of guessing','You are comfortable learning tools quickly'],
    transfer:'You can build what others have to buy, which lowers your costs to near zero and raises your ceiling considerably. The risk specific to your background is the opposite of everyone else\'s: you will over-build and under-sell. Force yourself to talk to fifteen people before you write anything, and to sell before you build.',
    edge:'Your costs are near zero and your ceiling is high — if you talk to people.' },
  edu:{ name:'Teaching & training', short:'teaching',
    assets:['You can make a hard thing click for someone who is stuck','You can structure a curriculum and sequence a syllabus','You are used to holding attention'],
    transfer:'Explaining clearly is the underlying skill in content, in sales and in delivery — you are effectively pre-trained for all three. Content should come easily to you, and if you build an audience the path to a digital product is short, because you already know how to sequence learning.',
    edge:'You can teach, which means you can market and sell.' },
  creative:{ name:'Creative & media', short:'creative work',
    assets:['You can make something that looks and sounds professional','You have taste, and taste is not quick to acquire','You have taken feedback on your own work without collapsing'],
    transfer:'Your work looks credible from day one, which shortens the trust gap most beginners spend months closing. The trap specific to you is polishing instead of selling. Cap the time you spend on any asset and spend the surplus on outreach — your worst-looking outreach will still look better than most.',
    edge:'You look established before you are.' }
};

const YEARS_LABEL = {1:'under a year', 2:'one to three years', 5:'three to seven years', 10:'more than seven years'};

/* Two-stage handling of the free-text idea.

   cleanIdea() strips only angle brackets and control characters and caps the
   length. It deliberately KEEPS apostrophes and quotes, because "people's
   houses" and "kids' parties" are exactly how people describe their idea and
   mangling them makes the document read like a machine wrote it.

   esc() is the safety net: anything going into innerHTML gets escaped at the
   point of insertion. The PDF takes the raw string, since pdfmake renders
   text as text and there is no markup to inject into. */
function cleanIdea(t){
  if(!t) return '';
  return String(t)
    .replace(/[<>]/g,'')
    .replace(/[\u0000-\u001F\u007F]/g,' ')
    .replace(/\s+/g,' ')
    .trim()
    .slice(0,120);
}
function esc(t){
  return String(t == null ? '' : t)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
