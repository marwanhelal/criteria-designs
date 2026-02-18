'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

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

const PILLAR_TEXTS = [
  'Architecture as cultural memory — each space we design carries the weight of heritage, the richness of tradition, and the identity of the people who inhabit it. We honor the past while building boldly for the future.',
  'Informed by organic form and ecological wisdom — we weave natural light, living materials, and landscape into every structure we create, crafting spaces that breathe, evolve, and belong to their environment.',
  'Every line is intentional, every surface a composition — we elevate the built environment into art, designing spaces that inspire the eye, challenge perception, and endure long beyond their time.',
]

const PHILOSOPHY_TEXT =
  'Our trilogy — Culture, Nature, and Art — forms a unified philosophy that shapes every project we create. Together, these three pillars define an architecture that is meaningful, sustainable, and beautifully human.'

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

        return (
          <motion.div
            key={offset}
            animate={{
              scale: isActive ? 1 : 0.82,
              opacity: isActive ? 1 : 0.4,
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
                    alt={pillars[idx].label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `${pillars[idx].accent}18`, border: `1px solid ${pillars[idx].accent}30` }}
                  >
                    <span
                      className="font-[var(--font-playfair)] text-[70px] font-black"
                      style={{ color: `${pillars[idx].accent}30` }}
                    >
                      {pillars[idx].num}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Subtle vignette on active card only */}
            {isActive && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: 'inset 0 -60px 60px -20px rgba(24,28,35,0.5)' }} />
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

  const handleGoCard = (idx: number) => {
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
  }

  const prev = () => handleGoCard((activeCard - 1 + 3) % 3)
  const next = () => handleGoCard((activeCard + 1) % 3)

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

  return (
    <section ref={sectionRef} className="relative bg-[#181C23] w-full overflow-hidden">

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
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
            What Drives Us
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
        <p className="font-[var(--font-open-sans)] text-[14px] md:text-[16px] text-white/40 mt-4 max-w-[460px] mx-auto leading-[1.8]">
          Three pillars converge into one unified vision.
        </p>
      </motion.div>

      {/* ── Animation Canvas ──────────────────────────────────────── */}
      <div ref={canvasRef} className="relative w-full" style={{ height: 460 }}>

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
            className="rounded-[28px] overflow-hidden flex items-center justify-center"
            style={{
              width: 200, height: 200,
              background: 'rgba(177,164,144,0.05)',
              border: '1px solid rgba(177,164,144,0.18)',
            }}
          >
            <LogoEl size={176} />
          </div>
          <p className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] tracking-[6px] uppercase">
            Criteria Designs
          </p>
        </motion.div>

      </div>{/* /canvas */}

      {/* ── Content below canvas ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="pb-24 md:pb-32 pt-6 px-8 max-w-[860px] mx-auto"
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
                <p className="font-[var(--font-libre-franklin)] text-[8px] text-[#B1A490] tracking-[5px] uppercase">
                  Criteria Designs
                </p>
              </motion.div>

              {/* Thin vertical divider */}
              <div className="hidden md:block w-px self-stretch" style={{ background: 'rgba(255,255,255,0.07)' }} />

              {/* Navigation + pillar text — right side */}
              <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">

                {/* Navigation row: ← [num · label] → */}
                <div className="flex items-center gap-6 mb-5">
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
                        className="font-[var(--font-libre-franklin)] text-[9px] tracking-[5px] uppercase mb-1.5"
                        style={{ color: pillars[activeCard].accent }}
                      >
                        {pillars[activeCard].num}
                      </p>
                      <p className="font-[var(--font-playfair)] text-[30px] md:text-[36px] text-white italic leading-none">
                        {pillars[activeCard].label}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  <ArrowBtn dir="right" onClick={next} />
                </div>

                {/* Pillar description */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeCard}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.38, ease: EASE }}
                    className="font-[var(--font-open-sans)] text-white/60 text-[15px] md:text-[17px] leading-[2.1] text-center md:text-left"
                  >
                    {PILLAR_TEXTS[activeCard]}
                  </motion.p>
                </AnimatePresence>

              </div>
            </motion.div>
          )}

          {/* Finale: philosophy text (logo is now in canvas above) */}
          {showFinale && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.6 }}
              className="text-center max-w-[640px] mx-auto pt-8"
            >
              <p className="font-[var(--font-playfair)] text-[15px] text-[#B1A490] italic tracking-wide mb-6">
                Culture · Nature · Art
              </p>
              <p className="font-[var(--font-open-sans)] text-white/65 text-[16px] md:text-[18px] leading-[2.1]">
                {PHILOSOPHY_TEXT}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

    </section>
  )
}
