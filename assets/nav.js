/* ══════════════════════════════════════════════════════════
   Shared book navigation + section renderers
   Pages: set window.BOOK_SUBNAV (optional), build content,
          then call mountBook() as the last step.
══════════════════════════════════════════════════════════ */

const AGENT_BADGES = {
  builder: `<span class="agent-badge builder-badge" title="Builder"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" class="badge-bg"/><path d="M8 7 L3 12 L8 17 M16 7 L21 12 L16 17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" class="badge-icon"/></svg></span>`,
  reviewer: `<span class="agent-badge reviewer-badge" title="Reviewer"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" class="badge-bg"/><circle cx="6" cy="6" r="2.5" class="badge-icon" fill="none" stroke-width="1.8"/><circle cx="6" cy="18" r="2.5" class="badge-icon" fill="none" stroke-width="1.8"/><circle cx="18" cy="18" r="2.5" class="badge-icon" fill="none" stroke-width="1.8"/><path d="M6 8.5 L6 15.5 M18 15.5 L18 12 A2.5 2.5 0 0 0 15.5 9.5 L8.5 9.5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" class="badge-icon"/></svg></span>`,
  tester: `<span class="agent-badge tester-badge" title="Tester"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" class="badge-bg"/><rect x="8" y="7" width="8" height="10" rx="4" stroke-width="1.8" fill="none" class="badge-icon"/><path d="M9 7 A3 3 0 0 1 15 7" stroke-width="1.8" fill="none" class="badge-icon"/><path d="M5 9 L8 10 M5 12 L8 12 M5 15 L8 14 M19 9 L16 10 M19 12 L16 12 M19 15 L16 14" stroke-width="1.8" stroke-linecap="round" class="badge-icon"/><path d="M10 5 C9 3, 8 3, 8 3 M14 5 C15 3, 16 3, 16 3" stroke-width="1.5" stroke-linecap="round" class="badge-icon"/></svg></span>`,
  shipper: `<span class="agent-badge shipper-badge" title="Shipper"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" class="badge-bg"/><path d="M12 3 C15 6, 17 10, 17 14 C17 17, 15 19, 12 19 C9 19, 7 17, 7 14 C7 10, 9 6, 12 3 Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" class="badge-icon"/><path d="M7 14 L4 17 L4 19 L7 18 M17 14 L20 17 L20 19 L17 18" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" class="badge-icon"/><circle cx="12" cy="11" r="1.5" stroke-width="1.8" fill="none" class="badge-icon"/><path d="M10 19 L12 22 L14 19" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" class="badge-icon"/></svg></span>`,
  maintainer: `<span class="agent-badge maintainer-badge" title="Maintainer"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" class="badge-bg"/><path d="M18.4 5.6 a4.3 4.3 0 0 0 -6.1 0 c-1.1 1.1 -1.4 2.7 -0.9 4 L4 17.1 a1.5 1.5 0 0 0 2.1 2.1 l7.5 -7.5 c1.3 0.5 2.9 0.2 4 -0.9 a4.3 4.3 0 0 0 0 -6.1 Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" class="badge-icon"/><path d="M15 8 L18 5" stroke-width="1.8" stroke-linecap="round" class="badge-icon"/></svg></span>`,
  infosec: `<span class="agent-badge infosec-badge" title="InfoSec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" class="badge-bg"/><path d="M12 21.5 C12 21.5, 19 18, 19 12 L19 5.5 L12 2.5 L5 5.5 L5 12 C5 18, 12 21.5, 12 21.5 Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" class="badge-icon"/><rect x="10" y="11" width="4" height="3" rx="1" stroke-width="1.5" fill="none" class="badge-icon"/><path d="M11 11 L11 9 A1 1 0 0 1 13 9 L13 11" stroke-width="1.5" fill="none" class="badge-icon"/></svg></span>`,
  fixer: `<span class="agent-badge fixer-badge" title="Fixer"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" class="badge-bg"/><rect x="3" y="7" width="18" height="13" rx="2.5" stroke-width="1.8" fill="none" class="badge-icon"/><path d="M9 7 V5.5 A1.5 1.5 0 0 1 10.5 4 L13.5 4 A1.5 1.5 0 0 1 15 5.5 V7" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" class="badge-icon"/><path d="M12 10.5 V16.5 M9 13.5 H15" stroke-width="1.8" stroke-linecap="round" class="badge-icon"/></svg></span>`
};

function getAgentBadge(id, size = 48) {
  const badgeHtml = AGENT_BADGES[id];
  if (!badgeHtml) return '';
  return badgeHtml.replace('<span ', `<span style="width:${size}px;height:${size}px;" `);
}

/* ── Visitor counter (GoatCounter) ──
   Sign up at https://www.goatcounter.com (free), pick a code, then:
   1. set GOATCOUNTER_CODE below to that code (the subdomain), and
   2. in GoatCounter → Settings → "Allow using the visitor counter",
      tick it so the public count endpoint works.
   Until a real code is set, nothing is loaded or shown. */
const GOATCOUNTER_CODE = 'aayushus';

function initVisitorCounter(){
  if(!GOATCOUNTER_CODE || GOATCOUNTER_CODE === 'YOURCODE') return;
  const base = `https://${GOATCOUNTER_CODE}.goatcounter.com`;
  if(!document.querySelector('script[data-goatcounter]')){
    const s = document.createElement('script');
    s.async = true;
    s.src = '//gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', `${base}/count`);
    document.body.appendChild(s);
  }
  fetch(`${base}/counter/TOTAL.json`)
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(d => {
      const n = d.count || d.count_unique;
      const el = document.getElementById('bnv-count');
      if(el && n){ el.textContent = n; }
    })
    .catch(()=>{});
}

const CHAPTERS = [
  { id:'overview', href:'index.html',    num:'01', name:'Overview' },
  { id:'pipeline', href:'pipeline.html', num:'02', name:'The Pipeline' },
  { id:'workflow', href:'workflow.html', num:'03', name:'The Workflow' },
  { id:'devin',    href:'devin.html',    num:'04', name:'Devin Playbook' },
  { id:'agents',   href:'agents.html',   num:'05', name:'Agent Roster' },
  { id:'sop',      href:'sop.html',      num:'06', name:'Operating Procedure' },
  { id:'setup',    href:'setup.html',    num:'07', name:'Setup Guide' },
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
  html += '<div class="bn-visitors" id="bn-visitors"><span class="bnv-count" id="bnv-count">0</span> visitors</div>';
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
        <div class="agent-badge-wrap">${getAgentBadge(ag.id, 48)}</div>
        <div class="agent-head-info">
          <div class="agent-eyebrow">Named Agent · ${ag.trigger}</div>
          <div class="agent-name">${ag.name}</div>
          <div class="agent-role">${ag.role}</div>
          <div class="agent-meta">
            <div class="agent-meta-item"><span class="meta-label">Schedule</span><span class="meta-val">${ag.schedule}</span></div>
            <div class="agent-meta-item"><span class="meta-label">Playbook</span><span class="meta-val">${ag.playbook}</span></div>
            <div class="agent-meta-item"><span class="meta-label">Reports to</span><span class="meta-val teams">${ag.channel}</span></div>
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
  initVisitorCounter();
}
