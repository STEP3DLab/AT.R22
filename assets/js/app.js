import { benefits, audience, modules, lead, gallery, COURSE_START } from './data.js';

const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
const formatShortDateRu = (d) => new Intl.DateTimeFormat('ru-RU',{ day:'2-digit', month:'short'}).format(d).replace('.', '');
function parseHours(str){
  try{
    if (typeof str !== 'string') return 0;
    const lower = str.toLowerCase();
    const pos = lower.indexOf('ч');
    if (pos === -1) return 0;
    let num = '';
    for (let i = pos - 1; i >= 0; i--) {
      const ch = lower[i];
      if ((ch >= '0' && ch <= '9') || ch === ',' || ch === '.') num = ch + num;
      else if (num) break;
    }
    const val = parseFloat(num.replace(',', '.'));
    return Number.isFinite(val) ? Math.round(val * 10) / 10 : 0;
  } catch { return 0 }
}
function activityTypeFromTitle(t=''){
  const s = String(t).toLowerCase();
  if (s.startsWith('лекция')) return 'lecture';
  if (s.startsWith('прак')) return 'practice';
  if (s.startsWith('экзамен')) return 'exam';
  if (s.startsWith('мастер')) return 'workshop';
  return 'lecture';
}
function getBlocksSummary(blocks){
  const typeCounts = { lecture:0, practice:0, workshop:0, exam:0 };
  let hours = 0;
  for (const b of blocks || []){
    const t = activityTypeFromTitle(b?.title || '');
    typeCounts[t]++;
    hours += parseHours(b?.hours || '');
  }
  return { hours: Math.round(hours*10)/10, typeCounts };
}
function createPill(text, tone='neutral'){
  const tones = {
    neutral: 'border-black/10 bg-white/60 text-current',
    lecture: 'border-sky-300/40 bg-sky-50 text-sky-900',
    practice: 'border-emerald-300/40 bg-emerald-50 text-emerald-900',
    workshop: 'border-amber-300/40 bg-amber-50 text-amber-900',
    exam: 'border-rose-300/40 bg-rose-50 text-rose-900',
  };
  const span = document.createElement('span');
  span.className = `inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm backdrop-blur ${tones[tone] || tones.neutral}`;
  span.textContent = text;
  return span;
}
function renderBenefits(){ const root = $('#benefits'); benefits.forEach(b => root.appendChild(createPill(b))); }
function renderIcon(name){
  switch(name){
    case 'clock': return '<svg viewBox="0 0 24 24" class="h-full w-full"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v6l4 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    case 'group': return '<svg viewBox="0 0 24 24" class="h-full w-full"><circle cx="8" cy="10" r="3" stroke="currentColor" fill="none" stroke-width="1.5"/><circle cx="16" cy="10" r="3" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M2 18c1.5-3 4-4 6-4s4.5 1 6 4" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>';
    case 'workshop': return '<svg viewBox="0 0 24 24" class="h-full w-full"><rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="14" r="1.5" fill="currentColor"/><circle cx="12" cy="14" r="1.5" fill="currentColor"/><circle cx="16" cy="14" r="1.5" fill="currentColor"/></svg>';
    case 'scan3d': return '<svg viewBox="0 0 24 24" class="h-full w-full"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M5 9h14" stroke="currentColor" stroke-width="1.5"/><path d="M5 15h14" stroke="currentColor" stroke-width="1.5"/></svg>';
    case 'engineer': return '<svg viewBox="0 0 24 24" class="h-full w-full"><circle cx="12" cy="7" r="3" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M5 20c1-4 5-5 7-5s6 1 7 5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M9 7h6" stroke="currentColor" stroke-width="1.5"/></svg>';
    case 'cnc': return '<svg viewBox="0 0 24 24" class="h-full w-full"><rect x="4" y="4" width="16" height="10" rx="2" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M8 18h8" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4" stroke="currentColor" stroke-width="1.5"/></svg>';
    case 'student': return '<svg viewBox="0 0 24 24" class="h-full w-full"><path d="M12 4l8 4-8 4-8-4 8-4z" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M6 12v3c2 2 10 2 12 0v-3" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>';
    case 'designer': return '<svg viewBox="0 0 24 24" class="h-full w-full"><path d="M4 20l6-2 10-10-4-4L6 14l-2 6z" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>';
    case 'lecture': return '<svg viewBox="0 0 24 24" class="h-full w-full"><rect x="3" y="5" width="18" height="12" rx="2" ry="2" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M7 9h10M7 12h6" stroke="currentColor" stroke-width="1.5"/></svg>';
    case 'practice': return '<svg viewBox="0 0 24 24" class="h-full w-full"><path d="M4 18h16" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="6" width="12" height="8" rx="1.5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M9 14v4M15 14v4" stroke="currentColor" stroke-width="1.5"/></svg>';
    case 'exam': return '<svg viewBox="0 0 24 24" class="h-full w-full"><rect x="4" y="4" width="12" height="16" rx="2" ry="2" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M20 7l-5 5-3-3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
    default: return '';
  }
}
function renderStats(){
  const stats = [
    { k: '48 ч', v: 'интенсив', icon: 'clock' },
    { k: '6–12', v: 'в группе', icon: 'group' },
    { k: '4', v: 'мастер-класса', icon: 'workshop' },
    { k: '3D', v: 'скан/реверс/печать', icon: 'scan3d' },
  ];
  const root = $('#stats');
  stats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'group relative overflow-hidden rounded-2xl border border-black/10 p-4 text-center hover:shadow-md';
    card.innerHTML = `
      <div class="mx-auto h-7 w-7 text-black/80">${renderIcon(s.icon)}</div>
      <div class="mt-2 text-2xl font-semibold tracking-tight">${s.k}</div>
      <div class="text-[10px] uppercase tracking-[.15em] text-black/50">${s.v}</div>
      <span aria-hidden class="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full border border-black/10"></span>
    `;
    root.appendChild(card);
  });
}
function initCarousel(){
  const root = $('#carousel');
  let idx = 0, zoom = 1, origin = '50% 50%', touchStartX = null;
  const img = document.createElement('img');
  img.draggable = false;
  img.className = 'absolute inset-0 h-full w-full object-cover transition-opacity duration-300';
  root.appendChild(img);
  const prevBtn = document.createElement('button');
  prevBtn.setAttribute('aria-label','Предыдущее фото');
  prevBtn.className = 'pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/70 text-black shadow transition hover:bg-white absolute left-2 top-1/2 -translate-y-1/2';
  prevBtn.textContent = '‹';
  const nextBtn = document.createElement('button');
  nextBtn.setAttribute('aria-label','Следующее фото');
  nextBtn.className = 'pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/70 text-black shadow transition hover:bg-white absolute right-2 top-1/2 -translate-y-1/2';
  nextBtn.textContent = '›';
  root.appendChild(prevBtn); root.appendChild(nextBtn);
  const dots = document.createElement('div');
  dots.className = 'pointer-events-none absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2';
  root.appendChild(dots);
  function render(){
    const item = gallery[idx];
    img.style.opacity = 0;
    setTimeout(()=>{
      img.src = item.src; img.alt = item.alt || ''; img.style.opacity = 1;
      img.style.transform = `scale(${zoom})`;
      img.style.transformOrigin = origin;
    }, 100);
    dots.innerHTML = '';
    gallery.forEach((_, i)=>{
      const b = document.createElement('button');
      b.className = 'pointer-events-auto dot ' + (i===idx ? 'w-6 bg-black' : 'w-3 bg-black/40');
      b.setAttribute('aria-label', `Слайд ${i+1}`);
      b.onclick = ()=>{ idx=i; zoom=1; render(); };
      dots.appendChild(b);
    });
  }
  function go(d){ idx = (idx + d + gallery.length) % gallery.length; zoom=1; render(); }
  prevBtn.onclick = ()=> go(-1);
  nextBtn.onclick = ()=> go(1);
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
  root.addEventListener('dblclick', (e)=>{
    const rect = root.getBoundingClientRect();
    const x = ((e.clientX ?? rect.width/2) - rect.left) / rect.width * 100;
    const y = ((e.clientY ?? rect.height/2) - rect.top) / rect.height * 100;
    origin = `${x}% ${y}%`;
    zoom = zoom > 1 ? 1 : 1.6;
    render();
  });
  root.addEventListener('touchstart', (e)=>{ touchStartX = e.touches[0].clientX; });
  root.addEventListener('touchend', (e)=>{
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) go(dx > 0 ? -1 : 1);
    touchStartX = null;
  });
  render();
}
function renderAudience(){
  const root = $('#audienceGrid');
  const icons = ['engineer','cnc','student','designer'];
  audience.forEach((a,i)=>{
    const card = document.createElement('div');
    card.className = 'group h-full rounded-2xl border border-black/10 p-5 hover:shadow-md';
    card.innerHTML = `
      <div class="flex h-full items-start gap-3">
        <span aria-hidden class="mt-0.5 h-6 w-6 text-black/80 md:h-7 md:w-7">${renderIcon(icons[i % 4])}</span>
        <div class="flex-1">
          <div class="text-[10px] uppercase tracking-[.15em] text-black/50">Аудитория</div>
          <div class="mt-0.5 text-[15px] font-medium leading-snug md:text-base line-clamp-2" title="${a}">${a}</div>
        </div>
      </div>`;
    root.appendChild(card);
  });
}
function renderStartCalendar(){
  const days = 6;
  const labels = ['Пн','Вт','Ср','Чт','Пт','Сб'];
  const arr = new Array(days).fill(0).map((_,i)=> new Date(COURSE_START.getTime()+i*86400000));
  const root = $('#startCalendar');
  const head = `<div class="grid grid-cols-6 bg-white/60 text-xs">${labels.map(l=>`<div class="px-3 py-2 text-center font-medium text-black/60">${l}</div>`).join('')}</div>`;
  const body = `<div class="grid grid-cols-6 bg-white/30 text-sm">${arr.map(d=>`<div class="px-3 py-3 text-center"><div class="inline-flex min-w-[3rem] items-center justify-center rounded-full border border-black/10 px-3 py-1">${formatShortDateRu(d)}</div></div>`).join('')}</div>`;
  root.innerHTML = head + body;
}
function renderProgram(){
  const root = $('#programRoot');
  let view = 'full';
  let openDay = '01 (Пн)';
  const railTone = (t)=> ({ lecture: 'from-sky-400/40', practice: 'from-emerald-400/40', workshop: 'from-amber-400/50', exam: 'from-rose-400/40', }[t] || 'from-black/20');
  const head = document.createElement('div');
  head.className = 'flex items中心 justify-between gap-3 border-b border-black/10 p-3'.replace('центр','center');
  head.innerHTML = `
    <div class="text-sm opacity-60">Режим просмотра</div>
    <div class="flex items-center gap-2">
      <button data-view="full" class="rounded-lg px-3 py-1 text-sm bg-black text-white">подробно</button>
      <button data-view="compact" class="rounded-lg px-3 py-1 text-sm border border-black/10 hover:bg-neutral-50">кратко</button>
    </div>`;
  root.appendChild(head);
  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'sticky top-16 z-20 border-b border-black/10 bg-white/80 backdrop-blur';
  tabsWrap.innerHTML = '<div class="overflow-x-auto px-3 py-2"><div class="flex items-center gap-2" id="dayTabs"></div></div>';
  root.appendChild(tabsWrap);
  const body = document.createElement('div'); body.id = 'programDays'; root.appendChild(body);
  function renderTabs(){
    const tabs = $('#dayTabs'); tabs.innerHTML = '';
    modules.forEach((m,i)=>{
      const isActive = openDay === m.day;
      const d = new Date(COURSE_START.getTime()+i*86400000);
      const s = getBlocksSummary(m.blocks);
      const btn = document.createElement('button');
      btn.className = 'relative rounded-full px-3 py-1.5 text-sm transition ' + (isActive ? 'bg-black text-white' : 'border border-black/10 bg-white hover:bg-neutral-50');
      btn.innerHTML = `
        <span class="font-medium">${String(i+1).padStart(2,'0')}</span>
        <span class="mx-1 opacity-60">·</span>
        <span class="opacity-80">${formatShortDateRu(d)}</span>
        ${s.hours>0 ? `<span class="ml-2 rounded-full bg-black/10 px-2 text-xs">${s.hours} ч</span>` : ''}
        <span class="ml-2 inline-flex gap-1 align-middle">
          ${s.typeCounts.lecture>0 ? '<span title="Лекции" class="h-2 w-2 rounded-full bg-sky-400/70"></span>' : ''}
          ${s.typeCounts.practice>0 ? '<span title="Практика" class="h-2 w-2 rounded-full bg-emerald-400/70"></span>' : ''}
          ${s.typeCounts.workshop>0 ? '<span title="Мастер-класс" class="h-2 w-2 rounded-full bg-amber-400/80"></span>' : ''}
          ${s.typeCounts.exam>0 ? '<span title="Экзамен" class="h-2 w-2 rounded-full bg-rose-400/70"></span>' : ''}
        </span>`;
      btn.onclick = ()=>{ openDay = m.day; renderTabs(); renderDays(); };
      tabs.appendChild(btn);
    });
  }
  function renderDays(){
    body.innerHTML = '';
    modules.forEach((m,i)=>{
      const panel = document.createElement('div');
      panel.className = 'relative z-10 border-b border-black/10';
      const summary = getBlocksSummary(m.blocks);
      const expanded = openDay === m.day;
      panel.innerHTML = `
        <button class="group flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-neutral-50" aria-expanded="${expanded}">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-xs">${String(i+1).padStart(2,'0')}</span>
            <span class="font-medium">${m.day} · ${formatShortDateRu(new Date(COURSE_START.getTime() + i*86400000))}</span>
          </div>
          <div class="hidden items-center gap-2 md:flex">
            ${summary.hours>0 ? `<span class="rounded-full border border-black/10 px-2 py-0.5 text-xs">⏱ ${summary.hours} ч</span>` : ''}
            ${summary.typeCounts.lecture>0 ? `<span class="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-800">Л ${summary.typeCounts.lecture}</span>` : ''}
            ${summary.typeCounts.practice>0 ? `<span class="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">П ${summary.typeCounts.practice}</span>` : ''}
            ${summary.typeCounts.workshop>0 ? `<span class="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">М ${summary.typeCounts.workshop}</span>` : ''}
            ${summary.typeCounts.exam>0 ? `<span class="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs text-rose-800">Э ${summary.typeCounts.exam}</span>` : ''}
          </div>
          <span class="text-xs opacity-60">${expanded ? '⌃' : '⌄'}</span>
        </button>
        <div class="overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out" style="grid-template-rows: ${expanded ? '1fr' : '0fr'};">
          <div class="grid min-h-0 ${view==='full' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 p-4">
            ${m.blocks.length === 0 ? '<div class="rounded-xl border border-black/10 p-4 text-sm opacity-60">Зарезервировано под защиту проектов/экскурсию/подведение итогов.</div>' : ''}
            ${m.blocks.map((b,idx)=>{
              const t = activityTypeFromTitle(b.title);
              const icon = t === 'lecture' ? 'lecture' : t === 'practice' ? 'practice' : t === 'exam' ? 'exam' : 'workshop';
              return `
                <div class="relative overflow-hidden rounded-xl border border-black/10 p-4 shadow-sm hover:shadow-md hover-shimmer">
                  <span aria-hidden class="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b ${railTone(t)} to-transparent"></span>
                  <div class="flex items-start gap-3">
                    <div class="grid h-8 w-8 place-items-center rounded-lg border border-black/10 bg-white">
                      <span class="h-5 w-5 text-black/80">${renderIcon(icon)}</span>
                    </div>
                    <div class="flex-1">
                      <div class="font-medium leading-snug ${view==='compact' ? 'line-clamp-2' : ''}">${b.title}</div>
                      <div class="mt-2 flex flex-wrap items-center gap-2 text-xs opacity-70">
                        ${b.hours !== '—' ? createPill('⏱ ' + b.hours).outerHTML : ''}
                        ${b.control !== '—' ? createPill('✔ ' + b.control).outerHTML : ''}
                        ${createPill('Тип: ' + ({lecture:'Лекция',practice:'Практика',workshop:'Мастер-класс',exam:'Экзамен'})[t], t).outerHTML}
                      </div>
                    </div>
                  </div>
                </div>`
            }).join('')}
          </div>
        </div>`;
      const btn = panel.querySelector('button');
      btn.addEventListener('click', ()=>{ openDay = (openDay === m.day ? '' : m.day); renderDays(); });
      body.appendChild(panel);
    });
  }
  head.querySelectorAll('button[data-view]').forEach(b=>{
    b.addEventListener('click', ()=>{
      view = b.getAttribute('data-view');
      head.querySelectorAll('button[data-view]').forEach(x=>{
        if (x === b) { x.classList.add('bg-black','text-white'); x.classList.remove('border','border-black/10','hover:bg-neutral-50'); }
        else { x.classList.remove('bg-black','text-white'); x.classList.add('border','border-black/10'); }
      });
      renderDays();
    });
  });
  renderTabs();
  renderDays();
}
function initCountdown(){
  const el = document.getElementById('countdown');
  function tick(){
    const now = Date.now();
    const t = COURSE_START.getTime();
    const diff = Math.max(0, t - now);
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = `${d}д ${h}ч ${m}м ${s}с`;
  }
  tick(); setInterval(tick, 1000);
}
function initForm(){
  const form = document.getElementById('applyForm');
  const submitBtn = document.getElementById('submitBtn');
  const storageKey = 'applyForm';
  try{
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      ['name','email','comment','agree'].forEach(k=>{
        if (k in parsed && form.elements[k]) {
          if (k==='agree') form.elements[k].checked = !!parsed[k];
          else form.elements[k].value = parsed[k];
        }
      });
    }
  } catch {}
  function showError(name, msg){
    const err = form.querySelector(`[data-err="${name}"]`);
    if (!err) return;
    if (msg){ err.textContent = msg; err.classList.remove('hidden'); }
    else { err.textContent = ''; err.classList.add('hidden'); }
    const input = form.elements[name];
    if (input){
      if (msg) input.classList.add('border-red-400');
      else input.classList.remove('border-red-400');
    }
  }
  function validate(silent=false){
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const agree = form.elements.agree.checked;
    let ok = true;
    if (name.split(/\s+/).length < 2){ ok=false; if(!silent) showError('name','Укажите имя и фамилию'); } else if(!silent) showError('name', '');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ ok=false; if(!silent) showError('email','Проверьте формат e-mail'); } else if(!silent) showError('email','');
    if (!agree){ ok=false; if(!silent) showError('agree','Нужно согласие на обработку данных'); } else if(!silent) showError('agree','');
    submitBtn.disabled = !ok;
    submitBtn.className = 'rounded-xl px-4 py-2 text-white outline-none transition focus-visible:ring-2 focus-visible:ring-black/30 ' + (ok ? 'bg-black hover:opacity-90' : 'bg-black/30 cursor-not-allowed');
    return ok;
  }
  form.addEventListener('input', ()=>{
    const state = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      comment: form.elements.comment.value,
      agree: form.elements.agree.checked
    };
    try{ localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
    validate(true);
  });
  form.addEventListener('blur', (e)=>{ if (e.target && e.target.name) validate(false); }, true);
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!validate(false)) return;
    alert('Заявка отправлена! Мы свяжемся с вами.');
    form.reset();
    try{ localStorage.removeItem(storageKey); } catch {}
    validate(true);
  });
  validate(true);
}
function initObservers(){
  const links = Array.from(document.querySelectorAll('#navLinks a'));
  const ids = ['top','about','program','team','apply'];
  const sections = ids.map(id=>document.getElementById(id)).filter(Boolean);
  const cta = document.getElementById('stickyCta');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        const id = entry.target.id;
        links.forEach(a=>{
          a.classList.toggle('text-black', a.dataset.nav===id);
          a.classList.toggle('opacity-70', a.dataset.nav!==id);
        });
        if (id === 'apply'){ cta.style.opacity = '0'; cta.style.pointerEvents = 'none'; }
        else { cta.style.opacity = '1'; cta.style.pointerEvents = 'auto'; }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, .2, .5, 1] });
  sections.forEach(s=> io.observe(s));
  const reveal = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting){ e.target.classList.add('revealed'); reveal.unobserve(e.target); } });
  }, { threshold: 0.15 });
  Array.from(document.querySelectorAll('.reveal')).forEach(el=> reveal.observe(el));
}
function initScrollBar(){
  const bar = document.getElementById('scrollbar');
  function onScroll(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / ((h.scrollHeight - h.clientHeight) || 1);
    bar.style.transform = `scaleX(${Math.max(0, Math.min(1, scrolled))})`;
  }
  onScroll();
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
function renderLead(){
  document.getElementById('leadPrice').textContent = lead.price;
  document.getElementById('leadDuration').textContent = lead.duration;
  document.getElementById('leadSeats').textContent = lead.seats;
  document.getElementById('leadPriceInline').textContent = lead.price;
  document.getElementById('leadPriceMobile').textContent = lead.price;
}
function setYear(){ document.getElementById('year').textContent = new Date().getFullYear(); }
renderBenefits();
renderStats();
initCarousel();
renderAudience();
renderStartCalendar();
renderProgram();
initCountdown();
initForm();
initObservers();
initScrollBar();
renderLead();
setYear();
