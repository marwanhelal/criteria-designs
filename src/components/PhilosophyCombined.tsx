'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────
interface PhilosophyData {
  philosophyImage: string | null
  philosophyCultureImage: string | null
  philosophyNatureImage: string | null
  philosophyArtImage: string | null
}

// ─── Constants ────────────────────────────────────────────────────
const EASE = [0.25, 0.4, 0.25, 1] as [number, number, number, number]
const EL   = 175
const LOGO = 240

const pillars = [
  { key: 'culture', num: '01', label: 'Culture', accent: '#C4A87A' },
  { key: 'nature',  num: '02', label: 'Nature',  accent: '#3D8B5A' },
  { key: 'art',     num: '03', label: 'Art',      accent: '#D4A82C' },
]

const PILLAR_HOOKS = [
  'Every great space begins with a question: whose story does this place carry?',
  'Then we step outside — and listen to the land.',
  'Finally, we reach for something beyond function.',
]

const PILLAR_TEXTS = [
  'Before a single line is drawn, we walk through history. We ask: what heritage lives here? What identity shaped these streets? For us, architecture is cultural memory made visible — each space we design carries the weight of tradition, the richness of a people, and the courage to honor the past while building boldly for the future.',
  'We feel the wind. We trace the arc of sunlight across a wall. We follow the natural path of water through a site. Nature is not decoration — it is the skeleton beneath everything we create. We weave organic light, living materials, and the wisdom of landscape into every structure, crafting spaces that breathe, evolve, and truly belong to their place on earth.',
  'Every line we draw is a decision. Every surface, a composition. Every shadow, intentional. Architecture, at its highest form, transcends utility and becomes art — spaces that stop you in your tracks, that make you feel something you cannot name, and that endure in memory long after you have left them.',
]

const PHILOSOPHY_TEXT =
  'Three chapters. One story. Culture gave us our roots. Nature gave us our framework. Art gave us our voice. Together — these three forces converge into a philosophy that shapes every project Criteria Designs creates: architecture that is meaningful, alive, and beautifully, unmistakably human.'

const chapters = [
  {
    num: '01',
    act: 'The Reach',
    subtitle: 'Architecture touches everyone — not just those who seek it. Unlike a painting in a gallery, the built environment is an experience no one can opt out of.',
    image: '/images/philosophy/diagram-01.jpg',
  },
  {
    num: '02',
    act: 'The Space',
    subtitle: 'More than 90% of our lives unfold inside buildings. Architecture directs the rhythm of cities and shapes psychological well-being for everyone.',
    image: '/images/philosophy/diagram-02.jpg',
  },
  {
    num: '03',
    act: 'The Mind',
    subtitle: 'The built environment and nature converge to form the lens through which we perceive the world. Architecture is not backdrop — it is cause.',
    image: '/images/philosophy/diagram-03.jpg',
  },
  {
    num: '04',
    act: 'The Bond',
    subtitle: 'Our Values Trilogy: human spiritual and material needs, environmental measures, and cultural identity — three forces united in every project we create.',
    image: '/images/philosophy/diagram-04.jpg',
  },
  {
    num: '05',
    act: 'The Solution',
    subtitle: 'Nature, Human Values, and Art converge through design into innovative outcomes: Sustainability, Creativity, Uniqueness, and Resilience.',
    image: '/images/philosophy/diagram-05.jpg',
  },
]

// ─── Sub-components ───────────────────────────────────────────────

function LogoEl({ src, size }: { src: string | null | undefined; size: number }) {
  return src ? (
    <div className="relative" style={{ width: size, height: size }}>
      <Image src={src} alt="Criteria Designs" fill className="object-contain" unoptimized />
    </div>
  ) : (
    <div
      className="rounded-full border border-[#B1A490]/25 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="font-[var(--font-merriweather)] font-bold text-[#B1A490]" style={{ fontSize: size * 0.22 }}>
        CD
      </span>
    </div>
  )
}

function ElementImg({ src, label, color }: { src: string | null; label: string; color: string }) {
  return src ? (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <Image src={src} alt={label} fill className="object-cover" unoptimized />
    </div>
  ) : (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center"
      style={{ background: `${color}15`, border: `1.5px solid ${color}35` }}
    >
      <span className="font-[var(--font-merriweather)] text-[44px] font-bold" style={{ color }}>
        {label[0]}
      </span>
    </div>
  )
}

function ArrowBtn({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 text-[#181C23]/25 hover:text-[#B1A490] transition-colors duration-300"
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
    >
      {dir === 'left' && (
        <>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"
            className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1">
            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="block h-px bg-current transition-all duration-300 w-10 group-hover:w-16" />
        </>
      )}
      {dir === 'right' && (
        <>
          <span className="block h-px bg-current transition-all duration-300 w-10 group-hover:w-16" />
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"
            className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">
            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      )}
    </button>
  )
}

function ThreeCardCarousel({
  activeCard,
  cardImages,
  goCard,
}: {
  activeCard: number
  cardImages: (string | null | undefined)[]
  goCard: (i: number) => void
}) {
  return (
    <div className="flex items-end justify-center gap-4 md:gap-6">
      {([-1, 0, 1] as const).map((offset) => {
        const idx = (activeCard + offset + 3) % 3
        const isActive = offset === 0
        const pillar = pillars[idx]
        return (
          <motion.div
            key={offset}
            animate={{ scale: isActive ? 1 : 0.82, opacity: isActive ? 1 : 0.45, zIndex: isActive ? 10 : 5 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="relative rounded-2xl overflow-hidden flex-shrink-0"
            style={{ width: isActive ? 280 : 210, height: isActive ? 400 : 310, cursor: isActive ? 'default' : 'pointer' }}
            onClick={() => { if (!isActive) goCard(idx) }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                {cardImages[idx] ? (
                  <Image src={cardImages[idx]!} alt={pillar.label} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `${pillar.accent}18`, border: `1px solid ${pillar.accent}30` }}>
                    <span className="font-[var(--font-playfair)] text-[70px] font-black" style={{ color: `${pillar.accent}30` }}>{pillar.num}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: 'inset 0 -90px 60px -10px rgba(24,28,35,0.75)' }} />
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex flex-col gap-0.5">
              <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px]" style={{ color: `${pillar.accent}bb` }}>{pillar.num}</span>
              <span className="font-[var(--font-playfair)] italic leading-none transition-all duration-400" style={{ fontSize: isActive ? 22 : 15, color: isActive ? '#ffffff' : `${pillar.accent}88` }}>
                {pillar.label}
              </span>
            </div>
            {!isActive && (
              <div className="absolute top-3 right-3">
                <span className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[2px]" style={{ color: `${pillar.accent}55` }}>explore</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function ChapterPanel({
  chapter,
  isActive,
}: {
  chapter: (typeof chapters)[number]
  index: number
  isActive: boolean
}) {
  return (
    <div style={{ width: '100vw', height: '100%', flexShrink: 0, display: 'flex', alignItems: 'stretch', position: 'relative', overflow: 'hidden' }}>
      {/* Watermark */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-1%', bottom: '-8%',
        fontFamily: 'var(--font-playfair)', fontSize: 'clamp(14rem, 26vw, 24rem)',
        fontWeight: 900, color: 'rgba(177,164,144,0.07)', lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}>{chapter.num}</div>

      {/* Left — text */}
      <motion.div
        animate={{ x: isActive ? 0 : 28, opacity: isActive ? 1 : 0.35 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{ width: '38%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 3% 0 6%', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 22, height: 1, background: '#B1A490', opacity: 0.65 }} />
          <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 10, color: '#B1A490', letterSpacing: '5px', textTransform: 'uppercase' }}>
            Chapter {chapter.num}
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 3.2vw, 3.4rem)', fontStyle: 'italic', fontWeight: 700, color: '#181C23', lineHeight: 1.08, marginBottom: '1rem' }}>
          {chapter.act}
        </h3>
        <div style={{ width: 40, height: 2, background: 'linear-gradient(to right, #B1A490, transparent)', marginBottom: '1.2rem' }} />
        <p style={{ fontFamily: 'var(--font-merriweather)', fontSize: 'clamp(0.82rem, 1.1vw, 0.96rem)', color: 'rgba(24,28,35,0.55)', lineHeight: 1.95, maxWidth: 380 }}>
          {chapter.subtitle}
        </p>
      </motion.div>

      {/* Vertical divider */}
      <div style={{ width: 1, flexShrink: 0, background: 'linear-gradient(to bottom, transparent, rgba(24,28,35,0.07) 25%, rgba(24,28,35,0.07) 75%, transparent)', zIndex: 1 }} />

      {/* Right — diagram card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4% 5% 4% 4%', position: 'relative', zIndex: 1 }}>
        <motion.div
          animate={{ scale: isActive ? 1.0 : 0.88 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(177,164,144,0.18)', position: 'relative', width: '100%', maxWidth: 860 }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #B1A490 20%, #B1A490 80%, transparent)', zIndex: 10 }} />
          <div style={{ background: '#ffffff', padding: 'clamp(1.2rem, 3vw, 2.5rem)' }}>
            <Image src={chapter.image} alt={chapter.act} width={1100} height={750} style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} unoptimized />
          </div>
          <div style={{ background: '#0D1018', padding: '0.6rem 1.6rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 16, height: 1, background: 'rgba(177,164,144,0.5)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 9, color: 'rgba(177,164,144,0.6)', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Criteria Designs · {chapter.act}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function MobileChapterBlock({ chapter }: { chapter: (typeof chapters)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <div ref={ref} style={{ padding: '0 1.25rem 4rem' }}>
      <motion.div initial={{ opacity: 0, x: -16 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 18, height: 1, background: '#B1A490', opacity: 0.65 }} />
        <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 10, color: '#B1A490', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Chapter {chapter.num}
        </span>
      </motion.div>
      <motion.h3 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
        style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.9rem, 7vw, 2.6rem)', fontStyle: 'italic', fontWeight: 700, color: '#181C23', lineHeight: 1.1, marginBottom: '0.9rem' }}>
        {chapter.act}
      </motion.h3>
      <motion.p initial={{ opacity: 0, y: 14 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
        style={{ fontFamily: 'var(--font-merriweather)', fontSize: '0.88rem', color: 'rgba(24,28,35,0.55)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
        {chapter.subtitle}
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.22, ease: EASE }}
        style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 0 0 1px rgba(177,164,144,0.15)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #B1A490 25%, #B1A490 75%, transparent)', zIndex: 10 }} />
        <div style={{ background: '#ffffff', padding: '1.2rem' }}>
          <Image src={chapter.image} alt={chapter.act} width={1100} height={750} style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} unoptimized />
        </div>
        <div style={{ background: '#0D1018', padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 1, background: 'rgba(177,164,144,0.5)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 9, color: 'rgba(177,164,144,0.6)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>{chapter.act}</span>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────
export default function PhilosophyCombined() {
  // Act 1
  const sectionRef     = useRef<HTMLElement>(null)
  const canvasRef      = useRef<HTMLDivElement>(null)
  const isInView       = useInView(sectionRef,  { once: true, amount: 0.1 })
  const isCanvasInView = useInView(canvasRef,   { once: true, amount: 0.2 })

  const [phase,      setPhase]      = useState(0)
  const [activeCard, setActiveCard] = useState(0)
  const [viewedSet,  setViewedSet]  = useState<Set<number>>(new Set([0]))
  const [showFinale, setShowFinale] = useState(false)
  const [data,       setData]       = useState<PhilosophyData | null>(null)

  // Act 2
  const scrollRef  = useRef<HTMLDivElement>(null)
  const reduce     = useReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)
  const { scrollYProgress } = useScroll({ target: scrollRef })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-80%'])

  // ─── Effects ─────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isCanvasInView) return
    const t = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3400),
      setTimeout(() => setPhase(5), 4300),
    ]
    return () => t.forEach(clearTimeout)
  }, [isCanvasInView])

  const handleGoCard = useCallback((idx: number) => {
    if (showFinale) return
    setActiveCard(idx)
    setViewedSet(prev => { const n = new Set(prev); n.add(idx); return n })
  }, [showFinale])

  useEffect(() => {
    if (viewedSet.size === 3 && !showFinale) {
      const id = setTimeout(() => setShowFinale(true), 2800)
      return () => clearTimeout(id)
    }
  }, [viewedSet.size, showFinale])

  const prev = useCallback(() => handleGoCard((activeCard - 1 + 3) % 3), [activeCard, handleGoCard])
  const next = useCallback(() => handleGoCard((activeCard + 1) % 3), [activeCard, handleGoCard])

  useEffect(() => {
    if (phase < 5 || showFinale) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, showFinale, prev, next])

  useEffect(() => {
    if (phase < 5 || showFinale) return
    const id = setTimeout(() => next(), 8000)
    return () => clearTimeout(id)
  }, [phase, showFinale, activeCard, next])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const thresholds = [0.15, 0.35, 0.55, 0.75]
    let idx = 0
    for (const t of thresholds) { if (v >= t) idx++ }
    setActiveIdx(idx)
  })

  const cardImages = [data?.philosophyCultureImage, data?.philosophyNatureImage, data?.philosophyArtImage]
  const logoSrc    = data?.philosophyImage ?? null

  return (
    <section ref={sectionRef} style={{ background: '#FAFAF8', width: '100%', overflow: 'hidden' }}>

      {/* ════════════════════════════════════════════ */}
      {/* ACT 1 — OUR PHILOSOPHY                      */}
      {/* ════════════════════════════════════════════ */}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center pt-20 md:pt-28 pb-12 px-8"
      >
        <div className="flex items-center justify-center gap-4 mb-5">
          <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="w-10 h-px bg-[#B1A490] origin-right" />
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[6px]">Our Story</span>
          <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="w-10 h-px bg-[#B1A490] origin-left" />
        </div>
        <h2 className="font-[var(--font-playfair)] italic leading-[1.05]" style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', fontWeight: 700, color: '#181C23' }}>
          Our Philosophy
        </h2>
        <p className="font-[var(--font-playfair)] text-[16px] md:text-[18px] mt-4 max-w-[500px] mx-auto leading-[1.8] italic" style={{ color: 'rgba(24,28,35,0.45)' }}>
          Three chapters. One vision. The story of how Criteria Designs was built.
        </p>
      </motion.div>

      {/* Animation canvas */}
      <motion.div
        ref={canvasRef}
        className="relative w-full overflow-hidden"
        animate={{ height: showFinale ? 330 : 460 }}
        transition={{ duration: 0.9, ease: EASE, delay: showFinale ? 0.15 : 0 }}
        style={{ height: 460 }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: phase >= 1 && phase < 4 ? 0.18 : 0, transition: 'opacity 0.8s' }}>
          <ellipse cx="50%" cy="50%" rx="32%" ry="42%" stroke="#B1A490" strokeWidth="0.8" strokeDasharray="8 14" fill="none" />
          <ellipse cx="50%" cy="50%" rx="19%" ry="25%" stroke="#B1A490" strokeWidth="0.4" strokeDasharray="3 8" fill="none" />
        </svg>

        <div className="absolute inset-0">
          {/* CULTURE */}
          <motion.div className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL/2}px)`, top: `calc(50% - ${EL/2}px)` }}
            initial={{ x: -1200, y: 0, opacity: 0, scale: 0.8 }}
            animate={phase === 0 ? { x: -1200, y: 0, opacity: 0, scale: 0.8 } : phase === 1 ? { x: -650, y: 0, opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }}
            transition={{ duration: 1.0, ease: EASE }}
          >
            <ElementImg src={data?.philosophyCultureImage ?? null} label="CULTURE" color="#C4A87A" />
            <motion.span animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] tracking-[4px] uppercase whitespace-nowrap"
              style={{ color: '#C4A87A' }}>Culture</motion.span>
          </motion.div>

          {/* NATURE */}
          <motion.div className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL/2}px)`, top: `calc(50% - ${EL/2}px)` }}
            initial={{ x: 0, y: -800, opacity: 0, scale: 0.8 }}
            animate={phase === 0 ? { x: 0, y: -800, opacity: 0, scale: 0.8 } : phase === 1 ? { x: 0, y: -170, opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }}
            transition={{ duration: 1.05, delay: 0.05, ease: EASE }}
          >
            <ElementImg src={data?.philosophyNatureImage ?? null} label="NATURE" color="#3D8B5A" />
            <motion.span animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] tracking-[4px] uppercase whitespace-nowrap"
              style={{ color: '#3D8B5A' }}>Nature</motion.span>
          </motion.div>

          {/* ART */}
          <motion.div className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL/2}px)`, top: `calc(50% - ${EL/2}px)` }}
            initial={{ x: 1200, y: 0, opacity: 0, scale: 0.8 }}
            animate={phase === 0 ? { x: 1200, y: 0, opacity: 0, scale: 0.8 } : phase === 1 ? { x: 650, y: 0, opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }}
            transition={{ duration: 1.05, delay: 0.1, ease: EASE }}
          >
            <ElementImg src={data?.philosophyArtImage ?? null} label="ART" color="#D4A82C" />
            <motion.span animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] tracking-[4px] uppercase whitespace-nowrap"
              style={{ color: '#D4A82C' }}>Art</motion.span>
          </motion.div>

          {/* Convergence flash */}
          {phase >= 2 && phase <= 3 && (
            <motion.div key="flash"
              initial={{ scale: 0.1, opacity: 0.45 }} animate={{ scale: 12, opacity: 0 }} transition={{ duration: 1.3, ease: 'easeOut' }}
              className="absolute w-12 h-12 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, #B1A490 0%, transparent 70%)', left: 'calc(50% - 24px)', top: 'calc(50% - 24px)' }} />
          )}

          {/* Gold glow ring */}
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: LOGO+40, height: LOGO+40, left: `calc(50% - ${(LOGO+40)/2}px)`, top: `calc(50% - ${(LOGO+40)/2}px)`, border: '1.5px solid #B1A490', boxShadow: '0 0 35px 8px rgba(177,164,144,0.12)' }}
            animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : 0.4 }}
            transition={{ duration: 0.65 }} />

          {/* Combined logo */}
          <motion.div className="absolute pointer-events-none"
            style={{ width: LOGO, height: LOGO, left: `calc(50% - ${LOGO/2}px)`, top: `calc(50% - ${LOGO/2}px)` }}
            animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : phase < 3 ? 0.25 : 0.6 }}
            transition={{ duration: 0.7, ease: EASE }}>
            <LogoEl src={logoSrc} size={LOGO} />
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={phase >= 4 && !showFinale ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ pointerEvents: phase >= 5 && !showFinale ? 'auto' : 'none' }}>
          <ThreeCardCarousel activeCard={activeCard} cardImages={cardImages} goCard={handleGoCard} />
        </motion.div>

        {/* Finale logo */}
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          initial={{ opacity: 0, y: 50 }}
          animate={showFinale ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ pointerEvents: 'none' }}>
          <div className="rounded-[22px] overflow-hidden flex items-center justify-center"
            style={{ width: 160, height: 160, background: 'rgba(177,164,144,0.06)', border: '1px solid rgba(177,164,144,0.2)' }}>
            <LogoEl src={logoSrc} size={138} />
          </div>
          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="w-10 h-px" style={{ background: 'rgba(177,164,144,0.35)' }} />
            <p className="font-[var(--font-playfair)] text-[22px] italic leading-none" style={{ color: '#181C23' }}>Criteria Designs</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Below canvas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="pb-16 md:pb-20 pt-3 px-8 max-w-[860px] mx-auto"
      >
        <AnimatePresence mode="wait">
          {!showFinale && (
            <motion.div key="interactive"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              {/* Logo left */}
              <motion.div exit={{ opacity: 0, y: -50, transition: { duration: 0.7, ease: EASE } }} className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="rounded-[20px] overflow-hidden flex items-center justify-center"
                  style={{ width: 110, height: 110, background: 'rgba(177,164,144,0.06)', border: '1px solid rgba(177,164,144,0.2)' }}>
                  <LogoEl src={logoSrc} size={94} />
                </div>
                <p className="font-[var(--font-playfair)] text-[17px] italic leading-none" style={{ color: '#181C23' }}>Criteria Designs</p>
              </motion.div>

              <div className="hidden md:block w-px self-stretch" style={{ background: 'rgba(24,28,35,0.07)' }} />

              <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-6 mb-4">
                  <ArrowBtn dir="left" onClick={prev} />
                  <AnimatePresence mode="wait">
                    <motion.div key={activeCard} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: 0.22 }}>
                      <p className="font-[var(--font-libre-franklin)] text-[10px] tracking-[5px] uppercase mb-2" style={{ color: pillars[activeCard].accent }}>
                        Chapter {pillars[activeCard].num}
                      </p>
                      <p className="font-[var(--font-playfair)] text-[42px] md:text-[56px] italic leading-none" style={{ color: '#181C23' }}>
                        {pillars[activeCard].label}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  <ArrowBtn dir="right" onClick={next} />
                </div>

                <div className="flex items-center gap-3 mb-6">
                  {pillars.map((p, i) => (
                    <button key={i} onClick={() => handleGoCard(i)} aria-label={`Go to ${p.label}`} className="relative flex flex-col items-center gap-1 cursor-pointer">
                      <motion.div
                        animate={{ backgroundColor: i === activeCard ? p.accent : viewedSet.has(i) ? `${p.accent}55` : 'transparent', borderColor: i === activeCard ? p.accent : viewedSet.has(i) ? `${p.accent}70` : 'rgba(24,28,35,0.2)', scale: i === activeCard ? 1.4 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-[7px] h-[7px] rounded-full border"
                      />
                      {i === activeCard && (
                        <div className="absolute top-full mt-[3px] w-6 h-px overflow-hidden rounded-full" style={{ background: 'rgba(24,28,35,0.1)' }}>
                          <div key={`bar-${activeCard}`} className="chapter-bar h-full rounded-full" style={{ background: p.accent, animation: 'chapter-progress 8s linear forwards' }} />
                        </div>
                      )}
                    </button>
                  ))}
                  {viewedSet.size < 3 && <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[2px] ml-2" style={{ color: 'rgba(24,28,35,0.2)' }}>read all chapters</span>}
                  {viewedSet.size === 3 && !showFinale && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[2px] ml-2 flex items-center gap-1" style={{ color: '#B1A490' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true"><polygon points="4,0 5.5,2.5 8,3 6,5.5 6.5,8 4,6.5 1.5,8 2,5.5 0,3 2.5,2.5" /></svg>
                      story complete
                    </motion.span>
                  )}
                </div>

                <p className="hidden md:block font-[var(--font-libre-franklin)] text-[9px] tracking-[1px] mb-4 text-left" style={{ color: 'rgba(24,28,35,0.15)' }}>use ← → keys to navigate</p>

                <AnimatePresence mode="wait">
                  <motion.p key={`hook-${activeCard}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}
                    className="font-[var(--font-playfair)] text-[15px] md:text-[17px] italic mb-3 text-center md:text-left"
                    style={{ color: pillars[activeCard].accent }}>{PILLAR_HOOKS[activeCard]}</motion.p>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p key={`body-${activeCard}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.38, delay: 0.06, ease: EASE }}
                    className="font-[var(--font-merriweather)] text-[15px] md:text-[17px] leading-[1.95] text-center md:text-left font-light"
                    style={{ color: 'rgba(24,28,35,0.65)' }}>{PILLAR_TEXTS[activeCard]}</motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {showFinale && (
            <motion.div key="finale"
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.6 }}
              className="text-center max-w-[640px] mx-auto pt-2">
              <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[6px] mb-3">Epilogue</p>
              <p className="font-[var(--font-playfair)] text-[18px] md:text-[22px] italic leading-[1.5] mb-5" style={{ color: '#181C23' }}>Three chapters. One story.</p>
              <div className="w-8 h-px mx-auto mb-5" style={{ background: 'rgba(177,164,144,0.4)' }} />
              <p className="font-[var(--font-merriweather)] text-[15px] md:text-[17px] leading-[1.95] font-light" style={{ color: 'rgba(24,28,35,0.65)' }}>{PHILOSOPHY_TEXT}</p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.6, ease: EASE }} className="mt-10 flex justify-center">
                <Link href="/philosophy"
                  className="group inline-flex items-center gap-3 cursor-pointer font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[4px] text-[#B1A490] border border-[#B1A490]/30 px-8 py-4 hover:border-[#B1A490] hover:bg-[#B1A490]/[0.06] transition-all duration-300">
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">Explore Our Philosophy</span>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" aria-hidden="true">
                    <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ════════════════════════════════════════════ */}
      {/* BRIDGE — Act 1 → Act 2                      */}
      {/* ════════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid rgba(24,28,35,0.06)', borderBottom: '1px solid rgba(24,28,35,0.06)', padding: '5rem 2rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 30, height: 1, background: 'rgba(177,164,144,0.45)' }} />
          <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 10, color: '#B1A490', letterSpacing: '6px', textTransform: 'uppercase' }}>
            Why Architecture Matters
          </span>
          <div style={{ width: 30, height: 1, background: 'rgba(177,164,144,0.45)' }} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', fontStyle: 'italic', fontWeight: 700, color: '#181C23', maxWidth: 580, lineHeight: 1.15, margin: 0 }}>
          The evidence behind our conviction.
        </h3>
        <p style={{ fontFamily: 'var(--font-merriweather)', fontSize: '0.95rem', color: 'rgba(24,28,35,0.5)', maxWidth: 460, lineHeight: 1.85, margin: 0 }}>
          Five diagrams. Five chapters. The research that shapes every decision we make.
        </p>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* ACT 2 — DESKTOP: sticky horizontal scroll   */}
      {/* ════════════════════════════════════════════ */}
      <div ref={scrollRef} className="hidden md:block" style={{ height: '500vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#FAFAF8' }}>
          <motion.div style={{ x: reduce ? 0 : x, display: 'flex', width: '500vw', height: '100%', willChange: 'transform' }}>
            {chapters.map((chapter, i) => (
              <ChapterPanel key={chapter.num} chapter={chapter} index={i} isActive={activeIdx === i} />
            ))}
          </motion.div>

          {/* Progress dots */}
          <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 20 }}>
            {chapters.map((_, i) => (
              <motion.div key={i}
                animate={{ backgroundColor: i === activeIdx ? '#B1A490' : 'transparent', borderColor: i === activeIdx ? '#B1A490' : 'rgba(24,28,35,0.2)', scale: i === activeIdx ? 1.4 : 1 }}
                transition={{ duration: 0.35 }}
                style={{ width: 7, height: 7, borderRadius: '50%', border: '1px solid rgba(24,28,35,0.2)' }} />
            ))}
          </div>

          {/* Scroll hint */}
          <motion.div animate={{ opacity: activeIdx >= 4 ? 0 : 0.6 }} transition={{ duration: 0.5 }}
            style={{ position: 'absolute', bottom: 28, right: 44, zIndex: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 9, color: '#B1A490', letterSpacing: '3px', textTransform: 'uppercase' }}>scroll</span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
              <path d="M5 1v12M1 9l4 4 4-4" stroke="#B1A490" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* ACT 2 — MOBILE: vertical stack              */}
      {/* ════════════════════════════════════════════ */}
      <div className="md:hidden" style={{ paddingTop: '3.5rem' }}>
        {chapters.map((chapter) => <MobileChapterBlock key={chapter.num} chapter={chapter} />)}
        <div style={{ height: '2rem' }} />
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* MARQUEE                                      */}
      {/* ════════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(24,28,35,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, #FAFAF8 0%, transparent 8%, transparent 92%, #FAFAF8 100%)' }} />
        <div className="marquee-track flex whitespace-nowrap py-4" style={{ animation: 'marquee-left 52s linear infinite', width: 'max-content' }}>
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="font-[family-name:var(--font-merriweather)] inline-flex items-center select-none"
              style={{ fontSize: 'clamp(60px, 8vw, 120px)', WebkitTextStroke: '1px rgba(177,164,144,0.5)', color: 'transparent', paddingRight: '4rem', letterSpacing: '0.06em', fontWeight: 300 }}>
              Criteria Designs
              <span style={{ WebkitTextStroke: '0px', color: 'rgba(177,164,144,0.4)', fontSize: '0.22em', margin: '0 2rem', verticalAlign: 'middle' }}>◆</span>
              Design That Adds Value
              <span style={{ WebkitTextStroke: '0px', color: 'rgba(177,164,144,0.4)', fontSize: '0.22em', margin: '0 2rem', verticalAlign: 'middle' }}>◆</span>
              Culture · Nature · Art
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes chapter-progress { 0% { width: 0%; } 100% { width: 100%; } }
          @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation-play-state: paused !important; }
            .chapter-bar { animation: none !important; width: 100% !important; }
          }
        `}</style>
      </div>

    </section>
  )
}
