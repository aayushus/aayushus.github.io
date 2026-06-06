/* ══════════════════════════════════════════════════════════
   Shared book navigation + section renderers
   Pages: set window.BOOK_SUBNAV (optional), build content,
          then call mountBook() as the last step.
══════════════════════════════════════════════════════════ */

const CHAPTERS = [
  { id:'overview', href:'index.html',    num:'01', name:'Overview' },
  { id:'workflow', href:'workflow.html', num:'02', name:'The Workflow' },
  { id:'devin',    href:'devin.html',    num:'03', name:'Devin Playbook' },
  { id:'agents',   href:'agents.html',   num:'04', name:'Agent Roster' },
  { id:'sop',      href:'sop.html',      num:'05', name:'Operating Procedure' },
  { id:'setup',    href:'setup.html',    num:'06', name:'Setup Guide' },
];

/* ── Sidebar ── */
function renderBookNav(){
  const cur = document.body.dataset.chapter;
  const subnav = window.BOOK_SUBNAV || [];
  let html = '<a class="bn-head" href="index.html" style="text-decoration:none;display:block">'
           + '<div class="bn-eyebrow">AI-First SDLC</div><div class="bn-title">Developer Playbook</div></a>';
  CHAPTERS.forEach(c=>{
    const active = c.id === cur;
    html += `<a class="bn-chapter${active?' active':''}" href="${c.href}"><span class="bn-num">${c.num}</span><span class="bn-name">${c.name}</span></a>`;
    if(active && subnav.length){
      html += '<div class="bn-sub">' + subnav.map(s=>
        `<a class="bn-subitem" href="#${s.id}" data-sub="${s.id}"><span class="bn-sub-dot"></span>${s.label}</a>`
      ).join('') + '</div>';
    }
  });
  const el = document.getElementById('booknav');
  if(el) el.innerHTML = html;
}

/* ── Prev / Next ── */
function renderPrevNext(){
  const cur = document.body.dataset.chapter;
  const i = CHAPTERS.findIndex(c=>c.id===cur);
  const prev = CHAPTERS[i-1], next = CHAPTERS[i+1];
  const el = document.getElementById('prevnext');
  if(!el) return;
  const prevHtml = prev
    ? `<a class="pn-link prev" href="${prev.href}"><span class="pn-dir">← Previous</span><span class="pn-name">${prev.name}</span></a>`
    : `<span class="pn-link prev disabled"><span class="pn-dir">← Previous</span><span class="pn-name">Start of book</span></span>`;
  const nextHtml = next
    ? `<a class="pn-link next" href="${next.href}"><span class="pn-dir">Next →</span><span class="pn-name">${next.name}</span></a>`
    : `<span class="pn-link next disabled"><span class="pn-dir">Next →</span><span class="pn-name">End of book</span></span>`;
  el.innerHTML = prevHtml + nextHtml;
}

/* ── Scroll-spy for sub-items ── */
function initScrollSpy(){
  const subs = [...document.querySelectorAll('.bn-subitem')];
  if(!subs.length) return;
  const map = {}; subs.forEach(s=>map[s.dataset.sub]=s);
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        subs.forEach(x=>x.classList.remove('active'));
        const a = map[e.target.id];
        if(a) a.classList.add('active');
      }
    });
  }, { threshold:0.01, rootMargin:'-70px 0px -60% 0px' });
  document.querySelectorAll('[data-spy]').forEach(el=>obs.observe(el));
}

/* ── Shared: copy buttons ── */
function copyCode(btn){
  const block = btn.nextElementSibling;
  const text = block.innerText;
  navigator.clipboard.writeText(text).then(()=>{
    btn.textContent='copied!'; btn.classList.add('copied');
    setTimeout(()=>{ btn.textContent='copy'; btn.classList.remove('copied'); },2000);
  }).catch(()=>{ btn.textContent='error'; });
}

/* ── Shared: SOP checklist persistence ── */
const SOP_LS = 'sdlc-sop-checklist-v1';
function loadSop(){ try{ return JSON.parse(localStorage.getItem(SOP_LS))||{}; }catch(e){ return {}; } }
function saveSop(s){ try{ localStorage.setItem(SOP_LS, JSON.stringify(s)); }catch(e){} }
function restoreSopChecks(){
  const s = loadSop();
  Object.keys(s).forEach(id=>{
    const cb=document.getElementById('cb-'+id), row=document.getElementById('ci-'+id);
    if(cb&&row&&s[id]){ cb.checked=true; row.classList.add('checked'); }
  });
}
function toggleCheck(id){
  const cb=document.getElementById('cb-'+id), row=document.getElementById('ci-'+id);
  if(!cb||!row) return;
  cb.checked=!cb.checked;
  row.classList.toggle('checked', cb.checked);
  const s=loadSop(); s[id]=cb.checked; saveSop(s);
}

/* ══════════════════════════════════════
   SECTION BUILDERS (return HTML strings)
══════════════════════════════════════ */
function _label(text){
  return `<div class="bs-label"><div class="bs-label-line"></div><div class="bs-label-text">${text}</div><div class="bs-label-line"></div></div>`;
}

/* Workflow: Today (current) + AI-first, per phase */
function buildWorkflowSection(p){
  const c=p.current, a=p.ai;
  const tools = arr => arr.map(t=>`<div class="tool-item"><div class="tool-pip pip-${t.cls}"></div>${t.name}</div>`).join('');
  const ruled = (arr,pip,cls='') => arr.map(x=>`<div class="ruled-item"><div class="item-pip ${pip}"></div><span class="${cls}">${x}</span></div>`).join('');
  const gains = a.gains.map(g=>`<span class="gain-tag">${g}</span>`).join('');
  const badge = a.mode==='agent' ? 'badge-agent' : 'badge-collab';
  return `<section class="book-section" id="${p.id}" data-spy>
    ${_label(`Phase ${p.num} · ${p.name}`)}
    <div class="detail-panel" style="margin-bottom:14px">
      <div class="detail-head">
        <div><div class="detail-phase-eyebrow">Today · Manual</div><div class="detail-phase-sub" style="margin-top:4px;font-size:13px">${c.sub}</div></div>
        <div class="mode-badge badge-manual"><span class="badge-pip"></span>Manual</div>
      </div>
      <div class="detail-cols">
        <div class="detail-col"><div class="col-head">Tools</div><div class="tool-list">${tools(c.tools)}</div></div>
        <div class="detail-col"><div class="col-head">Key Activities</div><div class="ruled-list">${ruled(c.activities,'pip-neutral')}</div></div>
        <div class="detail-col"><div class="col-head">Pain Points</div><div class="ruled-list">${ruled(c.pains,'pip-pain','pain-text')}</div></div>
      </div>
    </div>
    <div class="detail-panel">
      <div class="detail-head">
        <div><div class="detail-phase-eyebrow">AI-first · ${a.modeLabel}</div><div class="detail-phase-sub" style="margin-top:4px;font-size:13px">${a.sub}</div></div>
        <div class="mode-badge ${badge}"><span class="badge-pip"></span>${a.modeLabel}</div>
      </div>
      <div class="gains-row">${gains}</div>
      <div class="detail-cols">
        <div class="detail-col"><div class="col-head">Tools</div><div class="tool-list">${tools(a.tools)}</div></div>
        <div class="detail-col"><div class="col-head">Agent does</div><div class="ruled-list">${ruled(a.agentDoes,'pip-agent')}</div></div>
        <div class="detail-col"><div class="col-head">Human focuses on</div><div class="ruled-list">${ruled(a.humanFocuses,'pip-human')}</div></div>
      </div>
    </div>
  </section>`;
}

/* Devin features per phase */
function buildDevinSection(p){
  const cards = p.devin.map(f=>`<div class="feature-card">
      <div class="feature-card-head"><div class="feature-name">${f.name}</div><span class="feature-type-badge type-${f.type}">${f.typeLabel}</span></div>
      <a class="feature-doc-link" href="${f.link}" target="_blank" rel="noopener">docs.devin.ai →</a>
      <div class="feature-section-label">How to activate</div>
      <div class="setup-steps">${f.setup.map((s,i)=>`<div class="setup-step"><span class="step-num">${i+1}</span><span>${s}</span></div>`).join('')}</div>
      <div class="feature-section-label">Example</div>
      <div class="example-block">${f.example}</div>
    </div>`).join('');
  return `<section class="book-section" id="${p.id}" data-spy>
    ${_label(`Phase ${p.num} · ${p.name}`)}
    <div class="detail-panel">
      <div class="detail-head">
        <div><div class="detail-phase-eyebrow">Devin Playbook</div><div class="detail-phase-name">${p.name}</div><div class="detail-phase-sub">${p.devin.length} features available — click any doc link to set up</div></div>
        <div class="mode-badge" style="background:var(--teal-bg);color:var(--teal);border-color:var(--teal-border)"><span class="badge-pip" style="background:var(--teal)"></span>Devin Desktop</div>
      </div>
      <div class="feature-grid">${cards}</div>
    </div>
  </section>`;
}

/* Agent roster panel */
function buildAgentPanel(ag){
  const jobs = ag.jobDesc.map(j=>`<div class="job-item"><div class="job-pip"></div><span>${j}</span></div>`).join('');
  const setup = ag.setupSteps.map((s,i)=>`<div class="setup-step-agent"><span class="step-num-lg">${i+1}</span><span style="white-space:pre-line;font-size:12px;line-height:1.6">${s}</span></div>`).join('');
  const statusCls = ag.status==='active' ? 'status-active' : 'status-configure';
  const statusTxt = ag.status==='active' ? '● Active' : '○ Setup needed';
  return `<section class="book-section" id="${ag.id}" data-spy>
    <div class="agent-panel">
      <div class="agent-head">
        <div class="agent-emoji-wrap">${ag.emoji}</div>
        <div class="agent-head-info">
          <div class="agent-eyebrow">Named Agent · ${ag.trigger}</div>
          <div class="agent-name">${ag.name}</div>
          <div class="agent-role">${ag.role}</div>
          <div class="agent-meta">
            <div class="agent-meta-item"><span class="meta-label">Schedule</span><span class="meta-val">${ag.schedule}</span></div>
            <div class="agent-meta-item"><span class="meta-label">Playbook</span><span class="meta-val">${ag.playbook}</span></div>
            <div class="agent-meta-item"><span class="meta-label">Reports to</span><span class="meta-val slack">${ag.slack}</span></div>
            <div class="agent-meta-item"><span class="meta-label">Phase</span><span class="meta-val phase">${ag.phase}</span></div>
          </div>
        </div>
        <div class="agent-status-badge ${statusCls}">${statusTxt}</div>
      </div>
      <div class="agent-body">
        <div class="agent-col">
          <div class="agent-col-head">What ${ag.name} does</div>
          <p style="font-size:13px;color:var(--text-2);line-height:1.65;margin-bottom:14px">${ag.what}</p>
          <div class="agent-col-head" style="margin-top:4px">Each run</div>${jobs}
        </div>
        <div class="agent-col"><div class="agent-col-head">How to create in Devin</div>${setup}</div>
        <div class="agent-col"><div class="agent-col-head">Playbook sample</div><div class="pb-title">macro: ${ag.playbook}</div><div class="playbook-block">${ag.playbookSample}</div></div>
      </div>
    </div>
  </section>`;
}

/* Stats strip (optional) */
function buildStats(key){
  const data = (typeof statsData!=='undefined' && statsData[key]) ? statsData[key] : null;
  if(!data) return '';
  return `<div class="stats-strip">` + data.map(s=>
    `<div class="stat-cell${s.hi?' hi':''}" ${s.hi&&s.c?`style="--hi-color:${s.c}"`:''}>
       <div class="stat-num" ${s.hi&&s.c?`style="--s-color:${s.c}"`:''}>${s.num}</div>
       <div class="stat-lbl">${s.lbl}</div>
     </div>`).join('') + `</div>`;
}

/* ── Mount: call this last on every page ── */
function mountBook(){
  renderBookNav();
  renderPrevNext();
  initScrollSpy();
  restoreSopChecks();
}
