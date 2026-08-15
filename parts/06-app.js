
/* ---------------------------------------------------------------------------
   7. UI
   ------------------------------------------------------------------------ */
const $ = s => document.querySelector(s);
const answers = {};
let idx = 0, ranked = null, currentPdf = null;

const stage=$('#quizStage'), quiz=$('#quiz'), body=$('#quizBody'), foot=$('#qFoot');
const bar=$('#progBar'), count=$('#qCount'), next=$('#qNext'), back=$('#qBack');

document.getElementById('yr').textContent = new Date().getFullYear();

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove('show'),2600); }

/* ---------- lazy PDF engine ----------
   Loaded when the questionnaire opens, so it is ready long before anyone
   finishes 12 questions, but never downloaded by someone who just reads the
   landing page. Falls back to a CDN only if the local copy is missing. */
let pdfReady = null;
function loadScript(src){
  return new Promise((res,rej)=>{
    const s=document.createElement('script'); s.src=src; s.async=true;
    s.onload=res; s.onerror=()=>rej(new Error('failed: '+src));
    document.head.appendChild(s);
  });
}
function ensurePdfEngine(){
  if(pdfReady) return pdfReady;
  const CDN='https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/';
  pdfReady = loadScript('vendor/pdfmake.min.js')
    .then(()=>loadScript('vendor/vfs_fonts.js'))
    .catch(()=>loadScript(CDN+'pdfmake.min.js').then(()=>loadScript(CDN+'vfs_fonts.js')));
  return pdfReady;
}

/* ---------- open / close ---------- */
function openQuiz(){
  ensurePdfEngine();
  idx=0; ranked=null; currentPdf=null;
  Object.keys(answers).forEach(k=>delete answers[k]);
  quiz.classList.add('open'); document.body.classList.add('locked');
  foot.style.display=''; render();
}
function closeQuiz(){ quiz.classList.remove('open'); document.body.classList.remove('locked'); }
document.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',openQuiz));
$('#qClose').addEventListener('click',()=>{
  if(ranked || !Object.keys(answers).length || confirm('Leave now and your answers are gone. Close anyway?')) closeQuiz();
});

/* ---------- render a question ---------- */
function render(){
  const q = QUESTIONS[idx];
  const pct = (idx/QUESTIONS.length)*100;
  bar.style.width = pct+'%';
  count.textContent = String(idx+1).padStart(2,'0')+' / '+QUESTIONS.length;
  back.style.visibility = idx===0 ? 'hidden' : 'visible';

  const cur = answers[q.id];
  const isSel = v => q.multi ? (cur||[]).includes(v) : cur===v;

  stage.innerHTML = '<div class="q-card">'
    + '<div class="q-kicker">'+q.kicker+'</div>'
    + '<h2 class="q-title">'+q.title+'</h2>'
    + '<p class="q-help">'+q.help+(q.multi?'<br><span class="dim3">Select all that apply'+(q.max?', up to '+q.max:'')+'.</span>':'')+'</p>'
    + '<div class="opts'+(q.two?' two':'')+'" role="group">'
    + q.opts.map((o,i)=>'<button class="opt'+(isSel(o.v)?' sel':'')+'" data-v="'+o.v+'" type="button">'
        + '<span class="opt-key">'+(i<9?(i+1):'·')+'</span>'
        + '<span class="opt-txt"><strong>'+o.t+'</strong><span>'+o.d+'</span></span></button>').join('')
    + '</div></div>';

  stage.querySelectorAll('.opt').forEach(btn=>btn.addEventListener('click',()=>pick(q, btn.dataset.v)));
  // On single-select the answer auto-advances, so a permanently greyed-out
  // Continue button is just visual noise. Show it only where it does work.
  const last = idx===QUESTIONS.length-1;
  next.style.display = q.multi ? '' : 'none';
  next.disabled = q.multi ? !(cur && cur.length) : false;
  next.childNodes[0].nodeValue = last ? 'Build my playbook ' : 'Continue ';
  next.querySelector('span').textContent = last ? '↑' : '→';
  $('#qStep').textContent = (idx+1)+' of '+QUESTIONS.length;
  $('#qHint').innerHTML = q.multi
    ? 'Press <kbd>1</kbd>–<kbd>9</kbd> to toggle · <kbd>Enter</kbd> to continue'
    : 'Press <kbd>1</kbd>–<kbd>9</kbd> to choose, or just click';
  body.scrollTop = 0;
}

function pick(q, raw){
  const v = isNaN(raw) || raw==='' ? raw : Number(raw);
  if(q.multi){
    let a = answers[q.id] || [];
    if(a.includes(v)) a = a.filter(x=>x!==v);
    else {
      if(q.id==='skills' && v==='none') a=[];
      else if(q.id==='skills') a = a.filter(x=>x!=='none');
      if(q.max && a.length>=q.max){ toast('Pick up to '+q.max+'. Deselect one first.'); return; }
      a = a.concat([v]);
    }
    answers[q.id]=a; render();
  } else {
    answers[q.id]=v;
    render();
    setTimeout(advance, 190);   // auto-advance keeps perceived effort low
  }
}

function advance(){
  const q = QUESTIONS[idx];
  if(q.multi ? !(answers[q.id]||[]).length : answers[q.id]===undefined) return;
  if(idx < QUESTIONS.length-1){ idx++; render(); }
  else finish();
}
next.addEventListener('click', advance);
back.addEventListener('click', ()=>{ if(idx>0){ idx--; render(); } });

document.addEventListener('keydown', e=>{
  if(!quiz.classList.contains('open') || ranked) return;
  if(e.key==='Escape'){ closeQuiz(); return; }
  if(e.key==='Enter'){ e.preventDefault(); advance(); return; }
  const n = parseInt(e.key,10);
  if(n>=1 && n<=9){
    const q=QUESTIONS[idx];
    if(q.opts[n-1]){ e.preventDefault(); pick(q, q.opts[n-1].v); }
  }
});

/* ---------- build ---------- */
const BUILD_STEPS = [
  'Reading your constraints',
  'Scoring 10 business models against your profile',
  'Selecting your acquisition channel',
  'Calculating your pricing ladder',
  'Writing your 90-day plan',
  'Answering what has been stopping you',
  'Assembling your PDF'
];

function finish(){
  bar.style.width='100%';
  foot.style.display='none';
  count.textContent = 'BUILDING';
  ranked = scoreModels(answers);
  stage.innerHTML = '<div class="building"><div class="build-ring"></div>'
    + '<h2 class="h-md">Building your playbook</h2>'
    + '<p class="dim" style="margin-top:10px">Twelve answers, ten models, one document.</p>'
    + '<div class="build-log">'+BUILD_STEPS.map(s=>'<div>'+s+'</div>').join('')+'</div></div>';
  const logs = stage.querySelectorAll('.build-log div');
  logs.forEach((el,i)=>setTimeout(()=>el.classList.add('on'), 260 + i*330));
  setTimeout(showResults, 260 + logs.length*330 + 500);
}

/* ---------- results ---------- */
function showResults(){
  const top = ranked[0], m = top.m, alts = ranked.slice(1,3);
  count.textContent = 'YOUR RESULT';
  stage.innerHTML = '<div class="results">'
  + '<div class="res-hero">'
    + '<div class="res-label">YOUR RECOMMENDED MODEL</div>'
    + '<div class="res-name">'+m.name+'</div>'
    + '<p class="res-why">'+m.line+'</p>'
    + '<div class="res-fit"><span class="dim">Match score</span> <b>'+top.score+'/100</b> <span class="dim3">·</span> <span class="dim">'+m.capital+' to start</span> <span class="dim3">·</span> <span class="dim">first dollar in '+m.firstDollar+'</span></div>'
  + '</div>'
  + '<div class="res-grid">'
    + '<div class="res-box"><span class="mono">WHY THIS ONE, FOR YOU</span><ul>'
      + whyThis(answers,m).slice(0,4).map(s=>'<li>'+s.charAt(0).toUpperCase()+s.slice(1)+'.</li>').join('')
    + '</ul></div>'
    + '<div class="res-box"><span class="mono">WHAT IT LOOKS LIKE</span><ul>'
      + m.examples.map(s=>'<li>'+s+'</li>').join('')
    + '</ul></div>'
    + '<div class="res-box"><span class="mono">YOUR CHANNEL</span><ul><li>'+m.channel.core+'</li><li>'+m.channel.volume+'</li></ul></div>'
    + '<div class="res-box"><span class="mono">YOUR FIRST WEEK</span><ul><li>'+m.weeks[0][0]+' — '+m.weeks[0][1]+'</li><li>'+m.firstTen[0]+'</li></ul></div>'
  + '</div>'
  + '<div class="res-dl">'
    + '<h3>Your playbook is ready</h3>'
    + '<p>Around 20 pages: your offer, your prices, your outreach script, a 90-day plan scaled to your hours, your unit economics, and a direct answer to the thing that has been stopping you.</p>'
    + '<button class="btn btn-primary btn-lg" id="dl">Download the PDF <span class="btn-arrow">↓</span></button>'
    + '<p style="margin-top:16px;font-size:.85rem;color:var(--text-3)">No email. Nothing was uploaded. Download it now — it isn\'t saved anywhere.</p>'
  + '</div>'
  + '<div class="res-alt"><span class="mono dim3">IF THIS ONE DOESN\'T APPEAL</span>'
    + alts.map((r,i)=>'<div class="alt-item"><b>0'+(i+2)+'</b><div><strong>'+r.m.name+' · '+r.score+'/100</strong><span>'+altWhyNot(answers,r,top.score)+'</span></div></div>').join('')
  + '</div>'
  + '<div class="res-actions">'
    + '<button class="btn btn-ghost" id="redo">Redo the questionnaire</button>'
    + '<button class="btn btn-ghost" id="done">Back to the site</button>'
  + '</div></div>';

  $('#dl').addEventListener('click', download);
  $('#redo').addEventListener('click', openQuiz);
  $('#done').addEventListener('click', closeQuiz);
}

async function download(){
  const btn = $('#dl');
  btn.disabled = true; btn.childNodes[0].nodeValue = 'Generating ';
  try{
    await ensurePdfEngine();
    if(typeof pdfMake === 'undefined') throw new Error('pdfmake unavailable');
    const pdf = buildPdf(answers, ranked);
    pdf.download('My-First-Business-Plan.pdf', ()=>{
      btn.disabled=false; btn.childNodes[0].nodeValue='Download again ';
      toast('Downloaded. Now do the Days 1–7 block.');
    });
  }catch(err){
    console.error(err);
    btn.disabled=false; btn.childNodes[0].nodeValue='Try again ';
    toast('Could not build the PDF. Check your connection and try again.');
  }
}

/* ---------- site chrome ---------- */
const nav = $('#nav');
addEventListener('scroll', ()=>nav.classList.toggle('stuck', scrollY>8), {passive:true});

const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }}), {threshold:.08, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
</script>
</body>
</html>
