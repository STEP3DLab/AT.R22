'use client'

import React, { useEffect, useMemo, useState, useCallback, useId } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'

/************************************
 * v14.0 — Production polish
 * - A11y: keyboard focus, skip‑link, aria‑labels, aria‑live for errors
 * - Mobile: компактное меню и липкий CTA доработан
 * - Perf: prefers‑reduced‑motion, memo, lazy изображения, light DOM
 * - SEO: document.title, JSON‑LD (FAQ, Course), microcopy
 * - UX: улучшенная навигация, счётчик, компакт/подробно, бренды
 ************************************/

/**************** DATA ****************/
const benefits = [
  'Разработка КД и 3D‑моделей по существующим деталям',
  'Оперативный ремонт и изготовление запчастей на АТ',
  'Снижение издержек с помощью собственной оснастки',
]

const audience = [
  'Инженеры‑конструкторы и технологи',
  'Операторы ЧПУ',
  'Студенты техвузов, молодые учёные, преподаватели',
  'Промышленные дизайнеры',
]

const externalLinks = {
  technopark: 'https://rgsu.net',
  telegramPortfolio: 'https://web.telegram.org/k/#@STEP_3D_Lab',
  telegramContact: 'https://t.me/step_3d_mngr',
}

const modules = [
  { day: '01 (Пн)', blocks: [
      { title: 'Лекция: Реверсивный инжиниринг и аддитивные технологии в производстве. ОТ и ТБ. Кейсы РГСУ (Hi‑Tech, Ростех, Северсталь, СИБУР, ЕВРАЗ)', hours: '2 ч (1 лк + 0,5 сем + 0,5 кт)', control: 'Устный опрос' },
      { title: 'Мастер‑класс #1: CAD/CAM‑моделирование мастер‑моделей и метаформ (T‑FLEX CAD)', hours: '—', control: 'Зачёт' },
      { title: 'Прак‑работа #1: Выбор средства оцифровки и оснастки. Калибровка сканера (RangeVision Spectrum)', hours: '2 ч', control: '—' },
      { title: 'Прак‑работа #2: 3D‑сканирование на стационарном сканере', hours: '4 ч', control: '—' },
    ] },
  { day: '02 (Вт)', blocks: [
      { title: 'Прак‑работа #3: Реверс в Geomagic Design X (базовые функции)', hours: '4 ч', control: '—' },
      { title: 'Мастер‑класс #2: Основы 3D‑печати (FDM, PICASO 3D). От индустриального партнёра', hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)', control: '—' },
      { title: 'Прак‑работа #4: Подготовка моделей к FDM/DLP/SLA. Запуск печати', hours: '2 ч', control: '—' },
    ] },
  { day: '03 (Ср)', blocks: [
      { title: 'Мастер‑класс #3: 3D‑сканирование ручным оптическим сканером (Artec Eva)', hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)', control: 'Устный опрос' },
      { title: 'Прак‑работа #5: Geomagic Design X (продвинутые функции)', hours: '6 ч (1 лк + 5 пр)', control: 'Зачёт' },
    ] },
  { day: '04 (Чт)', blocks: [
      { title: 'Мастер‑класс #4: Основы DLP/SLA‑печати. От индустриального партнёра', hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)', control: 'Устный опрос' },
      { title: 'Прак‑работа #6: Подготовка к FDM/DLP/SLA. Запуск печати', hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)', control: 'Зачёт' },
      { title: 'Отработка навыков (сканирование/реверс/печать) — свободный формат', hours: '4 ч', control: '—' },
    ] },
  { day: '05 (Пт)', blocks: [
      { title: 'Экзамен (ДЭ): задание в формате International High‑Tech Competition (компетенция «Реверсивный инжиниринг»)', hours: '16 ч (2 лк + 12 пр + 2 кт)', control: 'Экзамен (ДЭ)' },
    ] },
  { day: '06 (Сб)', blocks: [] },
]

const lead = {
  price: '68\u202f000 ₽',
  duration: '48 часов (1 неделя, пн‑сб 09:00—18:00)',
  seats: '6–12 человек в группе',
  venue: 'Москва, ул. Вильгельма Пика, д. 4, к. 8 (технопарк РГСУ)',
}

const gallery = [
  { id: 1, alt: '3D‑сканирование — стационарный стенд', src: 'https://images.unsplash.com/photo-1581091014534-7b8c6e7d0f5b?q=80&w=1400&auto=format&fit=crop' },
  { id: 2, alt: 'Реверсивный инжиниринг — CAD‑модель', src: 'https://images.unsplash.com/photo-1581091215367-59ab6b77aa5f?q=80&w=1400&auto=format&fit=crop' },
  { id: 3, alt: '3D‑печать — послойное построение', src: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1400&auto=format&fit=crop' },
]

const COURSE_START = new Date('2025-10-20T09:00:00+03:00')

/************** UTILS **************/
const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setPrefers(m.matches)
    on(); m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return prefers
}

function formatShortDateRu(d){
  try{ return new Intl.DateTimeFormat('ru-RU', { day:'2-digit', month:'short' }).format(d).replace('.', '') }catch{ return '' }
}

function useCountdown(target){
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const t = target?.getTime?.() ?? 0
  const diff = Math.max(0, t - now)
  const d = Math.floor(diff/86400000)
  const h = Math.floor(diff%86400000/3600000)
  const m = Math.floor(diff%3600000/60000)
  const s = Math.floor(diff%60000/1000)
  return { d, h, m, s, ended: diff===0 }
}

/************** UI PRIMITIVES **************/
function Pill({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'border-black/10 bg-white/60 text-current',
    lecture: 'border-sky-300/40 bg-sky-50 text-sky-900',
    practice: 'border-emerald-300/40 bg-emerald-50 text-emerald-900',
    workshop: 'border-amber-300/40 bg-amber-50 text-amber-900',
    exam: 'border-rose-300/40 bg-rose-50 text-rose-900',
  }
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm backdrop-blur ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  )
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 max-w-3xl text-black/60">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

const Divider = React.memo(function Divider(){
  return <div className="mx-auto my-8 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-black/10 to-transparent" />
})

/************** ICONS & LOGOS **************/
function Icon({ name }) {
  const common = 'h-full w-full'
  switch (name) {
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v6l4 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'group':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="8" cy="10" r="3" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <circle cx="16" cy="10" r="3" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M2 18c1.5-3 4-4 6-4s4.5 1 6 4" stroke="currentColor" fill="none" strokeWidth="1.5" />
        </svg>
      )
    case 'workshop':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <rect x="3" y="6" width="18" height="12" rx="2" ry="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="14" r="1.5" fill="currentColor" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          <circle cx="16" cy="14" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'scan3d':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M5 9h14" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 15h14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'engineer':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="12" cy="7" r="3" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M5 20c1-4 5-5 7-5s6 1 7 5" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M9 7h6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'cnc':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <rect x="4" y="4" width="16" height="10" rx="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M8 18h8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'student':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M12 4l8 4-8 4-8-4 8-4z" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M6 12v3c2 2 10 2 12 0v-3" stroke="currentColor" fill="none" strokeWidth="1.5" />
        </svg>
      )
    case 'designer':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M4 20l6-2 10-10-4-4L6 14l-2 6z" stroke="currentColor" fill="none" strokeWidth="1.5" />
        </svg>
      )
    case 'lecture':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <rect x="3" y="5" width="18" height="12" rx="2" ry="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M7 9h10M7 12h6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'practice':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M4 18h16" stroke="currentColor" strokeWidth="1.5" />
          <rect x="6" y="6" width="12" height="8" rx="1.5" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M9 14v4M15 14v4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'exam':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <rect x="4" y="4" width="12" height="16" rx="2" ry="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
          <path d="M20 7l-5 5-3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )
    default:
      return null
  }
}

const Brand = React.memo(function Brand({ name }) {
  const map = { rostec: 'Ростех', roscosmos: 'РОСКОСМОС', severstal: 'Северсталь', sibur: 'СИБУР' }
  return (
    <div className="group relative grid h-16 place-items-center rounded-xl border border-black/10 bg-white px-4">
      <span className="text-sm font-semibold tracking-wide text-black/80">{map[name]}</span>
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 opacity-0 transition group-hover:opacity-100" />
    </div>
  )
})

const BrandsGrid = React.memo(function BrandsGrid(){
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Brand name="rostec" />
      <Brand name="roscosmos" />
      <Brand name="severstal" />
      <Brand name="sibur" />
    </div>
  )
})

function LinkButtons() {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <a href={externalLinks.technopark} target="_blank" rel="noreferrer" className="rounded-xl border border-black/10 px-4 py-2 hover:bg-black hover:text-white">Сайт технопарка РГСУ</a>
      <a href={externalLinks.telegramPortfolio} target="_blank" rel="noreferrer" className="rounded-xl border border-black/10 px-4 py-2 hover:bg-black hover:text-white">Портфолио и новости (Telegram)</a>
      <a href={externalLinks.telegramContact} target="_blank" rel="noreferrer" className="rounded-xl border border-black/10 px-4 py-2 hover:bg-black hover:text-white">Контакт в Telegram: @step_3d_mngr</a>
    </div>
  )
}

/************** CAROUSEL **************/
const PhotoCarousel = React.memo(function PhotoCarousel({ items }) {
  const [idx, setIdx] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' })
  const [touchStart, setTouchStart] = useState(null)

  const go = useCallback((d) => setIdx((i) => (i + d + items.length) % items.length), [items.length])
  const select = useCallback((i) => setIdx(i), [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [go])

  const onDouble = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX ?? (e.touches?.[0]?.clientX || rect.width/2)) - rect.left) / rect.width * 100
    const y = ((e.clientY ?? (e.touches?.[0]?.clientY || rect.height/2)) - rect.top) / rect.height * 100
    setOrigin({ x: `${x}%`, y: `${y}%` })
    setZoom((z) => z > 1 ? 1 : 1.6)
  }, [])

  const onTouchStart = (e) => { setTouchStart(e.touches[0].clientX) }
  const onTouchEnd = (e) => {
    if (touchStart == null) return
    const dx = e.changedTouches[0].clientX - touchStart
    if (Math.abs(dx) > 40) go(dx > 0 ? -1 : 1)
    setTouchStart(null)
  }

  return (
    <div
      role="region"
      aria-roledescription="карусель фото"
      aria-label="Галерея курса"
      className="relative h-full w-full overflow-hidden rounded-2xl"
      onDoubleClick={onDouble}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={items[idx]?.id}
          src={items[idx]?.src}
          alt={items[idx]?.alt || ''}
          loading={idx === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full select-none object-cover"
          style={{ transform: `scale(${zoom})`, transformOrigin: `${origin.x} ${origin.y}` }}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2">
        <button aria-label="Предыдущее фото" onClick={() => go(-1)} className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/70 text-black shadow hover:bg-white">‹</button>
        <button aria-label="Следующее фото" onClick={() => go(1)} className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/70 text-black shadow hover:bg-white">›</button>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button key={i} aria-label={`Слайд ${i + 1}`} onClick={() => select(i)} className={`pointer-events-auto h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-black' : 'w-3 bg-black/40'}`} />
        ))}
      </div>
    </div>
  )
})

/************** MAIN PAGE **************/
export default function Page() {
  const [openDay, setOpenDay] = useState('01 (Пн)')
  const [active, setActive] = useState('top')
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReduced = usePrefersReducedMotion()
  const { d:cd, h:ch, m:cm, s:cs } = useCountdown(COURSE_START)

  useEffect(() => {
    document.title = 'Реверсивный инжиниринг и АТ — интенсив 48 ч (РГСУ)'
  }, [])

  // Progress bar
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 })

  // Active section
  useEffect(() => {
    const ids = ['top','about','program','team','trust','apply','faq']
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] })
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // JSON‑LD (FAQ + Course)
  useEffect(() => {
    const faq = {
      '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
        { '@type': 'Question', name: 'Нужен ли свой ноутбук?', acceptedAnswer: { '@type': 'Answer', text: 'Желателен. Мы рекомендуем Windows‑ноутбук с 16 ГБ ОЗУ и дискретной графикой.' } },
        { '@type': 'Question', name: 'Будет ли сертификат?', acceptedAnswer: { '@type': 'Answer', text: 'Да, удостоверение о повышении квалификации РГСУ (48 ч).' } }
      ]
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(faq)
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  const stats = useMemo(() => [
    { k: '48 ч', v: 'интенсив', icon: 'clock' },
    { k: '6–12', v: 'в группе', icon: 'group' },
    { k: '4', v: 'мастер‑класса', icon: 'workshop' },
    { k: '3D', v: 'скан/реверс/печать', icon: 'scan3d' },
  ], [])

  return (
    <div className="min-h-dvh bg-white text-neutral-900 selection:bg-black selection:text-white">
      {/* Skip link */}
      <a href="#top" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-black focus:px-3 focus:py-1.5 focus:text-white">К содержанию</a>

      {/* Progress bar */}
      <motion.div style={{ scaleX: prefersReduced ? undefined : scaleX }} className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-black/80" />

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="font-semibold tracking-tight" aria-label="На начало">4I.R22.01</a>
          <nav className="hidden gap-6 text-sm md:flex" aria-label="Навигация по секциям">
            {['about','program','team','apply'].map((id) => (
              <a key={id} href={`#${id}`} className={`transition ${active===id? 'text-black' : 'opacity-70 hover:opacity-100'}`}>{({about:'О курсе',program:'Программа',team:'Команда',apply:'Запись'})[id]}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="md:hidden rounded-xl border border-black/10 px-3 py-1.5 text-sm" aria-expanded={menuOpen} aria-controls="mobileMenu" onClick={()=>setMenuOpen((v)=>!v)}>{menuOpen?'Закрыть':'Меню'}</button>
            <a href="#apply" className="rounded-xl border border-black/10 px-3 py-1.5 text-sm hover:bg-black hover:text-white transition">Поступить</a>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>{menuOpen && (
          <motion.nav id="mobileMenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-black/10">
            <ul className="mx-auto max-w-6xl px-4 py-2 text-sm">
              {['about','program','team','trust','apply','faq'].map((id)=> (
                <li key={id}><a onClick={()=>setMenuOpen(false)} className="block rounded-lg px-2 py-2 hover:bg-neutral-50" href={`#${id}`}>{({about:'О курсе',program:'Программа',team:'Команда',trust:'Партнёры',apply:'Запись',faq:'FAQ'})[id]}</a></li>
              ))}
            </ul>
          </motion.nav>
        )}</AnimatePresence>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Реверсивный инжиниринг<br />и аддитивное производство
            </h1>
            <p className="mt-4 text-black/70">Практический интенсив на базе РГСУ: 3D‑сканирование → реверс в CAD → печать оснастки и мастер‑моделей. От кейсов к результату.</p>
            <div className="mt-6 flex flex-wrap gap-3">{benefits.map((b) => (<Pill key={b}>{b}</Pill>))}</div>
            <div className="mt-6 flex items-center gap-6">
              <a href="#apply" className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90">Записаться</a>
              <a href="#program" className="rounded-xl border border-black/10 px-4 py-2 hover:bg-black hover:text-white">Смотреть программу</a>
            </div>

            {/* Countdown */}
            <div className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-2 backdrop-blur">
              <span className="text-sm">Старт: <span className="font-semibold">20 октября 2025</span></span>
              <span className="text-sm opacity-70">Осталось: <span className="font-medium">{cd}д {ch}ч {cm}м {cs}с</span></span>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.k} className="group relative overflow-hidden rounded-2xl border border-black/10 p-4 text-center">
                  <div className="mx-auto h-7 w-7"><Icon name={s.icon} /></div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-[.15em] text-black/50">{s.v}</div>
                  <span aria-hidden className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full border border-black/10" />
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="relative aspect-square rounded-3xl border border-black/10 bg-gradient-to-b from-neutral-50 to-neutral-100 p-2">
            <PhotoCarousel items={gallery} />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
          </div>
        </div>
      </section>

      <Divider />

      {/* ABOUT */}
      <Section id="about" title="Для кого" subtitle="Курс рассчитан на специалистов, которым нужен прикладной навык — от оцифровки до готовой детали.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {audience.map((a, i) => (
            <div key={a} className="group h-full rounded-2xl border border-black/10 p-5">
              <div className="flex h-full items-start gap-3">
                <span aria-hidden className="mt-0.5 h-6 w-6 text-black/80 md:h-7 md:w-7">
                  <Icon name={['engineer','cnc','student','designer'][i % 4]} />
                </span>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[.15em] text-black/50">Аудитория</div>
                  <div className="mt-0.5 text-[15px] font-medium leading-snug md:text-base" title={a}>{a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-black/60">Не нашли себя? <a href="#apply" className="underline underline-offset-2">Напишите нам</a> — подскажем, подойдёт ли программа под ваши задачи.</p>
        <div className="mt-4 rounded-2xl border border-black/10 bg-amber-50/40 p-4 text-sm">
          <div className="font-medium">Предварительные требования</div>
          <p className="mt-1 text-black/70">Слушатели должны владеть базовыми навыками CAD‑проектирования и быть знакомыми с основами теории машиностроения.</p>
        </div>
      </Section>

      <Divider />

      {/* PROGRAM */}
      <Section id="program" title="Календарно‑тематический план" subtitle="48 часов. Теория ровно столько, сколько нужно для практики.">
        <StartCalendar start={COURSE_START} days={6} />
        <Program openDay={openDay} setOpenDay={setOpenDay} startDate={COURSE_START} />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-4"><div className="text-sm opacity-60">Стоимость</div><div className="mt-1 text-2xl font-semibold">{lead.price}</div></div>
          <div className="rounded-2xl border border-black/10 p-4"><div className="text-sm opacity-60">Сроки и режим</div><div className="mt-1 font-medium">{lead.duration}</div></div>
          <div className="rounded-2xl border border-black/10 p-4"><div className="text-sm opacity-60">Группа</div><div className="mt-1 font-medium">{lead.seats}</div></div>
        </div>
        <p className="mt-4 text-xs opacity-70">Индустриальный партнёр курса — <span className="font-medium">STEP_3D</span>.</p>
      </Section>

      <Divider />

      {/* TEAM */}
      <Section id="team" title="Команда" subtitle="РГСУ — один из ведущих центров компетенций по реверсивному инжинирингу. Среди преподавателей — чемпионы и эксперты WorldSkills/BRICS.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-sm opacity-60">Куратор</div>
            <div className="mt-1 font-medium">Рекут Алексей Валерьевич</div>
            <p className="mt-2 text-sm opacity-70">Один из разработчиков первого ФГОС по аддитивным технологиям. Главный эксперт и тренер сборной России (WorldSkills, 2017–2022) по компетенции «Реверсивный инжиниринг».</p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-sm opacity-60">Преподаватель</div>
            <div className="mt-1 font-medium">Ганьшин Владимир Константинович</div>
            <p className="mt-2 text-sm opacity-70">Практик STEP_3D, автор учебных программ и кейсов обратного инжиниринга.</p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-sm opacity-60">Преподаватель</div>
            <div className="mt-1 font-medium">Понкратова Христина</div>
            <p className="mt-2 text-sm opacity-70">Специалист по 3D‑сканированию и аддитивному производству. Ведёт практикумы и наставничество.</p>
          </div>
        </div>
      </Section>

      <Divider />

      {/* TRUST */}
      <Section id="trust" title="Нам доверяют" subtitle="Мы работаем с крупными индустриальными партнёрами.">
        <BrandsGrid />
      </Section>

      <Divider />

      {/* APPLY */}
      <Section id="apply" title="Поступить на курс" subtitle="Оставьте заявку — менеджер свяжется с вами и уточнит детали (наличие мест, график, документы).">
        <ApplyForm />
        <div className="mt-4 space-y-2 text-xs opacity-70">
          <p>Нажимая кнопку «Отправить заявку», вы даёте <span className="underline">согласие на обработку персональных данных</span> и подтверждаете ознакомление с политикой конфиденциальности.</p>
          <p>Индустриальный партнёр курса — <span className="font-medium">STEP_3D</span>. По всем вопросам можно писать в Telegram: <a className="underline" href={externalLinks.telegramContact} target="_blank" rel="noreferrer">@step_3d_mngr</a>.</p>
          <p>По предварительной договорённости (<span className="font-medium">от 6 человек</span>) мы можем согласовать и утвердить удобные для вашей команды даты старта и расписания.</p>
        </div>
        <div className="mt-6">
          <div className="text-sm opacity-60">Полезные ссылки</div>
          <LinkButtons />
        </div>
      </Section>

      <Divider />

      {/* FAQ */}
      <Section id="faq" title="Частые вопросы" subtitle="Коротко и по делу. Наведите курсор на пункты — появятся подсказки.">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            { q: 'Нужен ли свой ноутбук?', a: 'Желателен. Мы рекомендуем Windows‑ноутбук с 16 ГБ ОЗУ и дискретной графикой.' },
            { q: 'Можно ли привести свой сканер/принтер?', a: 'Да, по согласованию — выделим время и площадку.' },
            { q: 'Будет ли сертификат?', a: 'Да, удостоверение о повышении квалификации РГСУ (48 ч).' },
            { q: 'Есть ли рассрочка?', a: 'Возможна корпоративная оплата — уточняйте при записи.' },
          ].map((item) => (
            <li key={item.q} className="group rounded-2xl border border-black/10 p-4">
              <div className="font-medium">{item.q}</div>
              <div className="mt-1 text-sm opacity-70">{item.a}</div>
              <div className="mt-3 hidden text-xs opacity-60 group-hover:block">Подсказка: наведите на элементы программы выше — строки разворачиваются, чтобы увидеть часы и форму контроля.</div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Sticky CTA (mobile) */}
      <div className={`fixed inset-x-0 bottom-3 z-[55] px-3 sm:hidden transition ${active==='apply' ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-black/10 bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
          <span className="text-sm">Стоимость: <span className="font-semibold">{lead.price}</span></span>
          <a href="#apply" className="rounded-xl bg-black px-3 py-1.5 text-white">Записаться</a>
        </div>
      </div>

      <footer className="border-t border-black/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm opacity-70">© {new Date().getFullYear()} РГСУ · Курс «Реверсивный инжиниринг и АТ». Все права защищены.</div>
      </footer>
    </div>
  )
}

/************** PROGRAM / CALENDAR **************/
function StartCalendar({ start, days=6 }){
  const labels = ['Пн','Вт','Ср','Чт','Пт','Сб']
  const arr = new Array(days).fill(0).map((_,i)=> new Date(start.getTime()+i*86400000))
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-black/10">
      <div className="grid grid-cols-6 bg-white/60 text-xs">
        {labels.map((l)=> (<div key={l} className="px-3 py-2 text-center font-medium text-black/60">{l}</div>))}
      </div>
      <div className="grid grid-cols-6 bg-white/30 text-sm">
        {arr.map((d,i)=> (
          <div key={i} className="px-3 py-3 text-center">
            <div className="inline-flex min-w-[3rem] items-center justify-center rounded-full border border-black/10 px-3 py-1">
              {formatShortDateRu(d)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function activityTypeFromTitle(t=''){
  const s = String(t).toLowerCase()
  if (s.startsWith('лекция')) return 'lecture'
  if (s.startsWith('прак') || s.startsWith('практи')) return 'practice'
  if (s.startsWith('экзамен')) return 'exam'
  if (s.startsWith('мастер')) return 'workshop'
  return 'lecture'
}
function parseHours(str){
  try{
    if (typeof str !== 'string') return 0
    const lower = str.toLowerCase()
    const pos = lower.indexOf('ч')
    if (pos === -1) return 0
    let num = ''
    for (let i = pos - 1; i >= 0; i--) {
      const ch = lower[i]
      if ((ch >= '0' && ch <= '9') || ch === ',' || ch === '.') num = ch + num
      else if (num) break
    }
    const val = parseFloat(num.replace(',', '.'))
    return Number.isFinite(val) ? Math.round(val * 10) / 10 : 0
  }catch{ return 0 }
}
function getBlocksSummary(blocks){
  const typeCounts = { lecture:0, practice:0, workshop:0, exam:0 }
  let hours = 0
  for (const b of blocks || []){
    const t = activityTypeFromTitle(b?.title || '')
    typeCounts[t]++
    hours += parseHours(b?.hours || '')
  }
  return { hours: Math.round(hours*10)/10, typeCounts }
}

function Program({ openDay, setOpenDay, startDate }) {
  const [view, setView] = useState('full')

  const railTone = (t) => ({
    lecture: 'from-sky-400/40',
    practice: 'from-emerald-400/40',
    workshop: 'from-amber-400/50',
    exam: 'from-rose-400/40',
  }[t] || 'from-black/20')

  return (
    <div className="relative rounded-2xl border border-black/10">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 p-3">
        <div className="text-sm opacity-60">Режим просмотра</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('full')} className={`rounded-lg px-3 py-1 text-sm ${view==='full'?'bg-black text-white':'border border-black/10 hover:bg-neutral-50'}`}>подробно</button>
          <button onClick={() => setView('compact')} className={`rounded-lg px-3 py-1 text-sm ${view==='compact'?'bg-black text-white':'border border-black/10 hover:bg-neutral-50'}`}>кратко</button>
        </div>
      </div>

      {/* Sticky day tabs */}
      <div className="sticky top-16 z-20 border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="overflow-x-auto px-3 py-2">
          <div className="flex items-center gap-2">
            {modules.map((m, i) => {
              const isActive = openDay === m.day
              const d = new Date(startDate.getTime() + i*86400000)
              const s = getBlocksSummary(m.blocks)
              return (
                <button
                  key={m.day}
                  onClick={() => setOpenDay(m.day)}
                  className={`relative rounded-full px-3 py-1.5 text-sm transition ${isActive ? 'bg-black text-white' : 'border border-black/10 bg-white hover:bg-neutral-50'}`}
                  aria-pressed={isActive}
                >
                  <span className="font-medium">{String(i+1).padStart(2,'0')}</span>
                  <span className="mx-1 opacity-60">·</span>
                  <span className="opacity-80">{formatShortDateRu(d)}</span>
                  {s.hours>0 && <span className="ml-2 rounded-full bg-black/10 px-2 text-xs">{s.hours} ч</span>}
                  <span className="ml-2 inline-flex gap-1 align-middle">
                    {s.typeCounts.lecture>0 && <span title="Лекции" className="h-2 w-2 rounded-full bg-sky-400/70" />}
                    {s.typeCounts.practice>0 && <span title="Практика" className="h-2 w-2 rounded-full bg-emerald-400/70" />}
                    {s.typeCounts.workshop>0 && <span title="Мастер‑класс" className="h-2 w-2 rounded-full bg-amber-400/80" />}
                    {s.typeCounts.exam>0 && <span title="Экзамен" className="h-2 w-2 rounded-full bg-rose-400/70" />}
                  </span>
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-[2px] block h-[2px] rounded-full bg-white/70" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Days content */}
      {modules.map((m, i) => {
        const summary = getBlocksSummary(m.blocks)
        return (
          <div key={m.day} className="relative z-10 border-b border-black/10">
            <button
              onClick={() => setOpenDay(openDay === m.day ? null : m.day)}
              className="group flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-neutral-50"
              aria-expanded={openDay===m.day}
              aria-controls={`panel-${i}`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-xs">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-medium">{m.day} · {formatShortDateRu(new Date(startDate.getTime() + i*86400000))}</span>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {summary.hours>0 && <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs">⏱ {summary.hours} ч</span>}
                {summary.typeCounts.lecture>0 && <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-800">Л {summary.typeCounts.lecture}</span>}
                {summary.typeCounts.practice>0 && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">П {summary.typeCounts.practice}</span>}
                {summary.typeCounts.workshop>0 && <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">М {summary.typeCounts.workshop}</span>}
                {summary.typeCounts.exam>0 && <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs text-rose-800">Э {summary.typeCounts.exam}</span>}
              </div>
              <span className="text-xs opacity-60">⌃</span>
            </button>

            <div id={`panel-${i}`} className={`${openDay === m.day ? '' : 'hidden'}`}>
              <div className={`grid gap-4 p-4 ${view==='full' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {m.blocks.length === 0 && (
                  <div className="rounded-xl border border-black/10 p-4 text-sm opacity-60">Зарезервировано под защиту проектов/экскурсию/подведение итогов.</div>
                )}
                {m.blocks.map((b, idx) => {
                  const t = activityTypeFromTitle(b.title)
                  const icon = t === 'lecture' ? 'lecture' : t === 'practice' ? 'practice' : t === 'exam' ? 'exam' : 'workshop'
                  return (
                    <div key={idx} className="relative overflow-hidden rounded-xl border border-black/10 p-4 shadow-sm hover:shadow-md">
                      <span aria-hidden className={`absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b ${railTone(t)} to-transparent`} />
                      <div className="flex items-start gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 bg-white">
                          <span className="h-5 w-5 text-black/80"><Icon name={icon} /></span>
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium leading-snug ${view==='compact' ? 'line-clamp-2' : ''}`}>{b.title}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs opacity-70">
                            {b.hours !== '—' && <Pill>⏱ {b.hours}</Pill>}
                            {b.control !== '—' && <Pill>✔ {b.control}</Pill>}
                            <Pill tone={t}>Тип: {({lecture:'Лекция',practice:'Практика',workshop:'Мастер‑класс',exam:'Экзамен'})[t]}</Pill>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/************** APPLY FORM **************/
function ApplyForm() {
  const [form, setForm] = useState({ name: '', email: '', comment: '', agree: false, honey: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const nameId = useId(); const emailId = useId(); const commId = useId(); const agreeId = useId(); const honeyId = useId()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('applyForm')
      if (raw) setForm((s) => ({ ...s, ...JSON.parse(raw) }))
    } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem('applyForm', JSON.stringify(form)) } catch {}
  }, [form])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'name' || name === 'email' || name === 'agree') validate({ ...form, [name]: type === 'checkbox' ? checked : value }, true)
  }

  const validate = (state = form, silent = false) => {
    const errs = {}
    if (state.name.trim().split(/\s+/).length < 2) errs.name = 'Укажите имя и фамилию'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email.trim())) errs.email = 'Проверьте формат e‑mail'
    if (!state.agree) errs.agree = 'Нужно согласие на обработку данных'
    if (state.honey) errs.global = 'Ошибка: спам‑поле заполнено'
    if (!silent) setErrors(errs)
    return { ok: Object.keys(errs).length === 0, errs }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const { ok, errs } = validate()
    if (!ok) { setErrors(errs); return }
    try {
      // Fallback: mailto если нет бекенда
      const subject = encodeURIComponent('Заявка на курс (РГСУ) — 4I.R22.01')
      const body = encodeURIComponent(`Имя: ${form.name}\nEmail: ${form.email}\nКомментарий: ${form.comment}`)
      window.open(`mailto:projects.step3d@gmail.com?subject=${subject}&body=${body}`, '_blank')
      setSent(true)
      setForm({ name: '', email: '', comment: '', agree: false, honey: '' })
      setErrors({})
      try { localStorage.removeItem('applyForm') } catch {}
    } catch (err) {
      setErrors({ global: 'Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram.' })
    }
  }

  const { ok } = validate(form, true)

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-black/10 p-4" noValidate aria-describedby={sent? 'form-success' : undefined}>
      {errors.global && <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{errors.global}</div>}
      {sent && <div id="form-success" role="status" className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">Заявка сформирована. Проверьте почтовый клиент или напишите нам в Telegram.</div>}
      {/* Honeypot */}
      <label htmlFor={honeyId} className="sr-only">Оставьте пустым</label>
      <input id={honeyId} name="honey" value={form.honey} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm" htmlFor={nameId}>
          Имя и фамилия
          <input
            id={nameId}
            name="name"
            value={form.name}
            onChange={onChange}
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            placeholder="Иван Иванов"
            className={`rounded-xl border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${errors.name ? 'border-red-400' : 'border-black/10'}`}
          />
          {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm" htmlFor={emailId}>
          Электронная почта
          <input
            id={emailId}
            name="email"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
            required
            type="email"
            aria-invalid={!!errors.email}
            placeholder="name@example.com"
            className={`rounded-xl border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${errors.email ? 'border-red-400' : 'border-black/10'}`}
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm md:col-span-2" htmlFor={commId}>
          Комментарий
          <textarea
            id={commId}
            name="comment"
            value={form.comment}
            onChange={onChange}
            rows={4}
            placeholder="Кратко о целях и опыте"
            className="rounded-xl border border-black/10 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          />
        </label>
        <label className="md:col-span-2 flex items-start gap-2 text-sm" htmlFor={agreeId}>
          <input
            id={agreeId}
            name="agree"
            type="checkbox"
            checked={form.agree}
            onChange={onChange}
            aria-invalid={!!errors.agree}
            className="mt-1 h-4 w-4 rounded border-black/20 outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          />
          <span>Согласен(а) на обработку персональных данных и условия политики конфиденциальности.</span>
        </label>
        {errors.agree && <span className="md:col-span-2 text-xs text-red-600">{errors.agree}</span>}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={!ok} className={`rounded-xl px-4 py-2 text-white outline-none transition focus-visible:ring-2 focus-visible:ring-black/30 ${ok ? 'bg-black hover:opacity-90' : 'bg-black/30 cursor-not-allowed'}`}>Отправить заявку</button>
        <Pill>Стоимость: {lead.price}</Pill>
        <Pill>Адрес: {lead.venue}</Pill>
      </div>
    </form>
  )
}

// Tailwind is assumed to be available globally.
