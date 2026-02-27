'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface PhilosophyData {
  philosophyImage: string | null
  philosophyCultureImage: string | null
  philosophyNatureImage: string | null
  philosophyArtImage: string | null
}

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

const EASE = [0.25, 0.4, 0.25, 1] as [number, number, number, number]
const EL   = 175
const LOGO = 240

// ── Element image during animation ─────────────────────────────────
function ElementImg({ src, label, color }: { src: string | null; label: string; color: string }) {
  return src ? (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <Image src={src} alt={label} fill className="object-cover" unoptimized />
    </div>
  ) : (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center"
      style={{ background: `${color}18`, border: `1.5px solid ${color}40` }}
    >
      <span className="font-[var(--font-merriweather)] text-[44px] font-bold" style={{ color }}>
        {label[0]}
      </span>
    </div>
  )
}

// ── Minimal line-arrow navigation button ────────────────────────────
function ArrowBtn({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 text-white/25 hover:text-[#B1A490] transition-colors duration-300"
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
    >
      {dir === 'left' && (
        <>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"
            className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1">
            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="block h-px bg-current transition-all duration-300 w-10 group-hover:w-16" />
        </>
      )}
      {dir === 'right' && (
        <>
          <span className="block h-px bg-current transition-all duration-300 w-10 group-hover:w-16" />
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"
            className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">
            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      )}
    </button>
  )
}

// ── Three-card carousel — images only, no text overlay ──────────────
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
            animate={{
              scale: isActive ? 1 : 0.82,
              opacity: isActive ? 1 : 0.45,
              zIndex: isActive ? 10 : 5,
            }}
            transition={{ duration: 0.42, ease: EASE }}
            className="relative rounded-2xl overflow-hidden flex-shrink-0"
            style={{
              width: isActive ? 280 : 210,
              height: isActive ? 400 : 310,
              cursor: isActive ? 'default' : 'pointer',
            }}
            onClick={() => { if (!isActive) goCard(idx) }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {cardImages[idx] ? (
                  <Image
                    src={cardImages[idx]!}
                    alt={pillar.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `${pillar.accent}18`, border: `1px solid ${pillar.accent}30` }}
                  >
                    <span
                      className="font-[var(--font-playfair)] text-[70px] font-black"
                      style={{ color: `${pillar.accent}30` }}
                    >
                      {pillar.num}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom vignette — always present so label is readable */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 -90px 60px -10px rgba(24,28,35,0.85)' }} />

            {/* Pillar label — always visible at bottom of every card */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex flex-col gap-0.5">
              <span
                className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px]"
                style={{ color: `${pillar.accent}bb` }}
              >
                {pillar.num}
              </span>
              <span
                className="font-[var(--font-playfair)] italic leading-none transition-all duration-400"
                style={{
                  fontSize: isActive ? 22 : 15,
                  color: isActive ? '#ffffff' : `${pillar.accent}88`,
                }}
              >
                {pillar.label}
              </span>
            </div>

            {/* "explore" hint on inactive cards */}
            {!isActive && (
              <div className="absolute top-3 right-3">
                <span
                  className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[2px]"
                  style={{ color: `${pillar.accent}55` }}
                >
                  explore
                </span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Main Section ────────────────────────────────────────────────────
export default function PhilosophySection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const canvasRef   = useRef<HTMLDivElement>(null)
  const isInView    = useInView(sectionRef,  { once: true, amount: 0.15 })
  const isCanvasInView = useInView(canvasRef, { once: true, amount: 0.25 })

  const [phase,      setPhase]      = useState(0)
  const [activeCard, setActiveCard] = useState(0)
  const [viewedSet,  setViewedSet]  = useState<Set<number>>(new Set([0]))
  const [showFinale, setShowFinale] = useState(false)
  const [data,       setData]       = useState<PhilosophyData | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isCanvasInView) return
    const t = [
      setTimeout(() => setPhase(1), 150),   // elements appear at screen edges
      setTimeout(() => setPhase(2), 1500),   // elements converge to center
      setTimeout(() => setPhase(3), 2600),   // combined logo materialises
      setTimeout(() => setPhase(4), 3400),   // canvas logo fades; carousel slides in
      setTimeout(() => setPhase(5), 4300),   // carousel fully interactive
    ]
    return () => t.forEach(clearTimeout)
  }, [isCanvasInView])

  const handleGoCard = useCallback((idx: number) => {
    if (showFinale) return
    setActiveCard(idx)
    setViewedSet(prev => {
      const next = new Set(prev)
      next.add(idx)
      if (next.size === 3) {
        setTimeout(() => setShowFinale(true), 2800)
      }
      return next
    })
  }, [showFinale])

  const prev = useCallback(() => handleGoCard((activeCard - 1 + 3) % 3), [activeCard, handleGoCard])
  const next = useCallback(() => handleGoCard((activeCard + 1) % 3), [activeCard, handleGoCard])

  // Keyboard navigation ← →
  useEffect(() => {
    if (phase < 5 || showFinale) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, showFinale, prev, next])

  // Auto-advance every 8 seconds
  useEffect(() => {
    if (phase < 5 || showFinale) return
    const id = setTimeout(() => next(), 8000)
    return () => clearTimeout(id)
  }, [phase, showFinale, activeCard, next])

  const cardImages = [data?.philosophyCultureImage, data?.philosophyNatureImage, data?.philosophyArtImage]

  const LogoEl = ({ size }: { size: number }) =>
    data?.philosophyImage ? (
      <div className="relative" style={{ width: size, height: size }}>
        <Image src={data.philosophyImage} alt="Criteria Designs" fill className="object-contain" unoptimized />
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

  const glowColors = ['rgba(196,168,122,0.07)', 'rgba(61,139,90,0.07)', 'rgba(212,168,44,0.07)']

  return (
    <section ref={sectionRef} className="relative bg-[#181C23] w-full overflow-hidden">

      {/* Ambient chapter glow — shifts color with active pillar */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${glowColors[activeCard]} 0%, transparent 70%)`,
        }}
      />

      {/* ── Section Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center pt-20 md:pt-28 pb-12 px-8"
      >
        <div className="flex items-center justify-center gap-4 mb-5">
          <motion.div
            initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-10 h-px bg-[#B1A490] origin-right"
          />
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[6px]">
            Our Story
          </span>
          <motion.div
            initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-10 h-px bg-[#B1A490] origin-left"
          />
        </div>
        <h2 className="font-[var(--font-playfair)] text-[38px] md:text-[52px] lg:text-[64px] text-white italic leading-[1.1]">
          Our Philosophy
        </h2>
        <p className="font-[var(--font-playfair)] text-[16px] md:text-[18px] text-white/35 mt-4 max-w-[500px] mx-auto leading-[1.8] italic">
          Three chapters. One vision. The story of how Criteria Designs was built.
        </p>
      </motion.div>

      {/* ── Animation Canvas ──────────────────────────────────────── */}
      <motion.div
        ref={canvasRef}
        className="relative w-full overflow-hidden"
        animate={{ height: showFinale ? 330 : 460 }}
        transition={{ duration: 0.9, ease: EASE, delay: showFinale ? 0.15 : 0 }}
        style={{ height: 460 }}
      >

        {/* Orbit rings (phases 1–3) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: phase >= 1 && phase < 4 ? 0.07 : 0, transition: 'opacity 0.8s' }}
        >
          <ellipse cx="50%" cy="50%" rx="32%" ry="42%" stroke="#B1A490" strokeWidth="0.8" strokeDasharray="8 14" fill="none" />
          <ellipse cx="50%" cy="50%" rx="19%" ry="25%" stroke="#B1A490" strokeWidth="0.4" strokeDasharray="3 8" fill="none" />
        </svg>

        <div className="absolute inset-0">

          {/* CULTURE — enters from left screen edge */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL / 2}px)`, top: `calc(50% - ${EL / 2}px)` }}
            initial={{ x: -1200, y: 0, opacity: 0, scale: 0.8 }}
            animate={
              phase === 0 ? { x: -1200, y: 0, opacity: 0,  scale: 0.8 }
              : phase === 1 ? { x: -650,  y: 0, opacity: 1,  scale: 1   }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 1.0, ease: EASE }}
          >
            <ElementImg src={data?.philosophyCultureImage ?? null} label="CULTURE" color="#C4A87A" />
            <motion.span
              animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] text-[#C4A87A] tracking-[4px] uppercase whitespace-nowrap"
            >
              Culture
            </motion.span>
          </motion.div>

          {/* NATURE — enters from top screen edge */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL / 2}px)`, top: `calc(50% - ${EL / 2}px)` }}
            initial={{ x: 0, y: -800, opacity: 0, scale: 0.8 }}
            animate={
              phase === 0 ? { x: 0, y: -800, opacity: 0,  scale: 0.8 }
              : phase === 1 ? { x: 0, y: -170, opacity: 1,  scale: 1   }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 1.05, delay: 0.05, ease: EASE }}
          >
            <ElementImg src={data?.philosophyNatureImage ?? null} label="NATURE" color="#3D8B5A" />
            <motion.span
              animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] text-[#3D8B5A] tracking-[4px] uppercase whitespace-nowrap"
            >
              Nature
            </motion.span>
          </motion.div>

          {/* ART — enters from right screen edge */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL / 2}px)`, top: `calc(50% - ${EL / 2}px)` }}
            initial={{ x: 1200, y: 0, opacity: 0, scale: 0.8 }}
            animate={
              phase === 0 ? { x: 1200, y: 0, opacity: 0,  scale: 0.8 }
              : phase === 1 ? { x: 650,  y: 0, opacity: 1,  scale: 1   }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 1.05, delay: 0.1, ease: EASE }}
          >
            <ElementImg src={data?.philosophyArtImage ?? null} label="ART" color="#D4A82C" />
            <motion.span
              animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] text-[#D4A82C] tracking-[4px] uppercase whitespace-nowrap"
            >
              Art
            </motion.span>
          </motion.div>

          {/* Radial flash on convergence */}
          {phase >= 2 && phase <= 3 && (
            <motion.div
              key="flash"
              initial={{ scale: 0.1, opacity: 0.65 }}
              animate={{ scale: 12, opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
              className="absolute w-12 h-12 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #B1A490 0%, transparent 70%)',
                left: 'calc(50% - 24px)',
                top:  'calc(50% - 24px)',
              }}
            />
          )}

          {/* Gold glow ring (phase 3) */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width:  LOGO + 40, height: LOGO + 40,
              left: `calc(50% - ${(LOGO + 40) / 2}px)`,
              top:  `calc(50% - ${(LOGO + 40) / 2}px)`,
              border: '1.5px solid #B1A490',
              boxShadow: '0 0 35px 8px rgba(177,164,144,0.18)',
            }}
            animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : 0.4 }}
            transition={{ duration: 0.65 }}
          />

          {/* Combined logo — visible during phase 3 flash only */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: LOGO, height: LOGO, left: `calc(50% - ${LOGO / 2}px)`, top: `calc(50% - ${LOGO / 2}px)` }}
            animate={{
              opacity: phase === 3 ? 1 : 0,
              scale:   phase === 3 ? 1 : phase < 3 ? 0.25 : 0.6,
            }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <LogoEl size={LOGO} />
          </motion.div>

        </div>

        {/* ── Carousel (phase 4+, before finale) ── images only, no text ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={phase >= 4 && !showFinale ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ pointerEvents: phase >= 5 && !showFinale ? 'auto' : 'none' }}
        >
          <ThreeCardCarousel
            activeCard={activeCard}
            cardImages={cardImages}
            goCard={handleGoCard}
          />
        </motion.div>

        {/* ── Finale logo — rises up after all three pillars are viewed ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          initial={{ opacity: 0, y: 50 }}
          animate={showFinale ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="rounded-[22px] overflow-hidden flex items-center justify-center"
            style={{
              width: 160, height: 160,
              background: 'rgba(177,164,144,0.05)',
              border: '1px solid rgba(177,164,144,0.18)',
            }}
          >
            <LogoEl size={138} />
          </div>
          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="w-10 h-px bg-[#B1A490]/35" />
            <p className="font-[var(--font-playfair)] text-[22px] text-white italic leading-none">
              Criteria Designs
            </p>
          </div>
        </motion.div>

      </motion.div>{/* /canvas */}

      {/* ── Content below canvas ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="pb-20 md:pb-24 pt-3 px-8 max-w-[860px] mx-auto"
      >
        <AnimatePresence mode="wait">

          {/* Interactive: logo left + nav/text right */}
          {!showFinale && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
            >

              {/* Logo — left side, exits upward on finale */}
              <motion.div
                exit={{ opacity: 0, y: -50, transition: { duration: 0.7, ease: EASE } }}
                className="flex-shrink-0 flex flex-col items-center gap-3"
              >
                <div
                  className="rounded-[20px] overflow-hidden flex items-center justify-center"
                  style={{
                    width: 110, height: 110,
                    background: 'rgba(177,164,144,0.05)',
                    border: '1px solid rgba(177,164,144,0.18)',
                  }}
                >
                  <LogoEl size={94} />
                </div>
                <p className="font-[var(--font-playfair)] text-[17px] text-white italic leading-none">
                  Criteria Designs
                </p>
              </motion.div>

              {/* Thin vertical divider */}
              <div className="hidden md:block w-px self-stretch" style={{ background: 'rgba(255,255,255,0.07)' }} />

              {/* Navigation + pillar text — right side */}
              <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">

                {/* Chapter label + title */}
                <div className="flex items-center gap-6 mb-4">
                  <ArrowBtn dir="left" onClick={prev} />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCard}
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -7 }}
                      transition={{ duration: 0.22 }}
                    >
                      <p
                        className="font-[var(--font-libre-franklin)] text-[10px] tracking-[5px] uppercase mb-2"
                        style={{ color: pillars[activeCard].accent }}
                      >
                        Chapter {pillars[activeCard].num}
                      </p>
                      <p className="font-[var(--font-playfair)] text-[36px] md:text-[46px] text-white italic leading-none">
                        {pillars[activeCard].label}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  <ArrowBtn dir="right" onClick={next} />
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-3 mb-6">
                  {pillars.map((p, i) => (
                    <button key={i} onClick={() => handleGoCard(i)} aria-label={`Go to ${p.label}`} className="relative flex flex-col items-center gap-1">
                      <motion.div
                        animate={{
                          backgroundColor: i === activeCard ? p.accent : viewedSet.has(i) ? `${p.accent}55` : 'transparent',
                          borderColor: i === activeCard ? p.accent : viewedSet.has(i) ? `${p.accent}70` : 'rgba(255,255,255,0.18)',
                          scale: i === activeCard ? 1.4 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-[7px] h-[7px] rounded-full border"
                      />
                      {/* Auto-advance progress bar under active dot */}
                      {i === activeCard && (
                        <div className="absolute top-full mt-[3px] w-6 h-px overflow-hidden rounded-full bg-white/10">
                          <div
                            key={`bar-${activeCard}`}
                            className="h-full rounded-full"
                            style={{
                              background: p.accent,
                              animation: 'chapter-progress 8s linear forwards',
                            }}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                  {viewedSet.size < 3 && (
                    <span className="font-[var(--font-libre-franklin)] text-[9px] text-white/20 uppercase tracking-[2px] ml-2">
                      read all chapters
                    </span>
                  )}
                  {viewedSet.size === 3 && !showFinale && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[2px] ml-2"
                      style={{ color: '#B1A490' }}
                    >
                      ✦ story complete
                    </motion.span>
                  )}
                </div>

                {/* Keyboard hint — desktop only */}
                <p className="hidden md:block font-[var(--font-libre-franklin)] text-[9px] text-white/15 tracking-[1px] mb-4 text-left">
                  use ← → keys to navigate
                </p>

                {/* Story hook line */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`hook-${activeCard}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="font-[var(--font-playfair)] text-[15px] md:text-[17px] italic mb-3 text-center md:text-left"
                    style={{ color: pillars[activeCard].accent }}
                  >
                    {PILLAR_HOOKS[activeCard]}
                  </motion.p>
                </AnimatePresence>

                {/* Chapter body */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`body-${activeCard}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.38, delay: 0.06, ease: EASE }}
                    className="font-[var(--font-open-sans)] text-white/70 text-[15px] md:text-[17px] leading-[1.95] text-center md:text-left font-light"
                  >
                    {PILLAR_TEXTS[activeCard]}
                  </motion.p>
                </AnimatePresence>

              </div>
            </motion.div>
          )}

          {/* Epilogue */}
          {showFinale && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.6 }}
              className="text-center max-w-[640px] mx-auto pt-2"
            >
              <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[6px] mb-3">
                Epilogue
              </p>
              <p className="font-[var(--font-playfair)] text-[18px] md:text-[22px] text-white italic leading-[1.5] mb-5">
                Three chapters. One story.
              </p>
              <div className="w-8 h-px bg-[#B1A490]/40 mx-auto mb-5" />
              <p className="font-[var(--font-open-sans)] text-white/70 text-[15px] md:text-[17px] leading-[1.95] font-light">
                {PHILOSOPHY_TEXT}
              </p>

              {/* Epilogue CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.6, ease: EASE }}
                className="mt-10 flex justify-center"
              >
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[4px] text-[#B1A490] border border-[#B1A490]/30 px-8 py-4 hover:border-[#B1A490] hover:bg-[#B1A490]/08 transition-all duration-300"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">Discover Our Projects</span>
                  <span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                </Link>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* ── Dual scrolling marquee ── */}
      <div
        className="relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(177,164,144,0.10)' }}
      >
        {/* Left + right edge fade */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to right, #181C23 0%, transparent 8%, transparent 92%, #181C23 100%)',
          }}
        />

        {/* Row 1 — moves LEFT, outlined brand phrases */}
        <div
          className="flex whitespace-nowrap pt-7 pb-3"
          style={{ animation: 'marquee-left 52s linear infinite', width: 'max-content' }}
        >
          {Array(6).fill(null).map((_, i) => (
            <span
              key={i}
              className="font-[var(--font-playfair)] italic inline-flex items-center select-none"
              style={{
                fontSize: 'clamp(40px, 5vw, 76px)',
                WebkitTextStroke: i % 2 === 0 ? '1.5px rgba(177,164,144,0.9)' : '0px',
                color: i % 2 === 0 ? 'transparent' : 'rgba(177,164,144,0.13)',
                paddingRight: '5rem',
                letterSpacing: '0.02em',
              }}
            >
              Criteria Designs
              <span style={{ WebkitTextStroke: '0px', color: 'rgba(177,164,144,0.45)', fontSize: '0.28em', margin: '0 2.5rem', verticalAlign: 'middle' }}>◆</span>
              Design That Adds Value
              <span style={{ WebkitTextStroke: '0px', color: 'rgba(177,164,144,0.45)', fontSize: '0.28em', margin: '0 2.5rem', verticalAlign: 'middle' }}>◆</span>
              Culture · Nature · Art
            </span>
          ))}
        </div>

        {/* Thin separator line */}
        <div className="mx-auto w-full h-px" style={{ background: 'rgba(177,164,144,0.06)' }} />

        {/* Row 2 — moves RIGHT, story phrases, smaller + ghost */}
        <div
          className="flex whitespace-nowrap pt-3 pb-7"
          style={{ animation: 'marquee-right 68s linear infinite', width: 'max-content' }}
        >
          {Array(6).fill(null).map((_, i) => (
            <span
              key={i}
              className="font-[var(--font-playfair)] italic inline-flex items-center select-none"
              style={{
                fontSize: 'clamp(28px, 3.2vw, 52px)',
                WebkitTextStroke: i % 2 === 0 ? '0px' : '1px rgba(177,164,144,0.55)',
                color: i % 2 === 0 ? 'rgba(177,164,144,0.18)' : 'transparent',
                paddingRight: '5rem',
                letterSpacing: '0.04em',
              }}
            >
              Every Space Tells A Story
              <span style={{ WebkitTextStroke: '0px', color: 'rgba(177,164,144,0.35)', fontSize: '0.35em', margin: '0 2.5rem', verticalAlign: 'middle' }}>◆</span>
              Architecture That Endures
              <span style={{ WebkitTextStroke: '0px', color: 'rgba(177,164,144,0.35)', fontSize: '0.35em', margin: '0 2.5rem', verticalAlign: 'middle' }}>◆</span>
              Beautifully, Unmistakably Human
            </span>
          ))}
        </div>

        <style>{`
          @keyframes marquee-left {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0%   { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          @keyframes chapter-progress {
            0%   { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>

    </section>
  )
}
