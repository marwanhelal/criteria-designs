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
  { key: 'culture', num: '01', label: 'CULTURE', accent: '#C4A87A' },
  { key: 'nature',  num: '02', label: 'NATURE',  accent: '#3D8B5A' },
  { key: 'art',     num: '03', label: 'ART',      accent: '#D4A82C' },
]

const PHILOSOPHY_TEXT =
  'Our trilogy — Culture, Nature, and Art — forms a unified philosophy that shapes every project we create. Together, these three pillars define an architecture that is meaningful, sustainable, and beautifully human.'

const EASE = [0.25, 0.4, 0.25, 1] as [number, number, number, number]
const EL   = 175  // element image size during animation
const LOGO = 240  // combined logo size during flash

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

// ── Three-card carousel ─────────────────────────────────────────────
// Positions: -1=left, 0=center, +1=right
// key on outer div = position (stays fixed), key on inner = card idx (fades on change)
function ThreeCardCarousel({
  activeCard,
  cardImages,
  goCard,
}: {
  activeCard: number
  cardImages: (string | null | undefined)[]
  goCard: (i: number) => void
}) {
  const prev = () => goCard((activeCard - 1 + 3) % 3)
  const next = () => goCard((activeCard + 1) % 3)

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
              opacity: isActive ? 1 : 0.55,
              zIndex: isActive ? 10 : 5,
            }}
            transition={{ duration: 0.42, ease: EASE }}
            className="relative rounded-2xl overflow-hidden flex-shrink-0"
            style={{
              width: isActive ? 280 : 210,
              height: isActive ? 390 : 310,
              cursor: isActive ? 'default' : 'pointer',
            }}
            onClick={() => { if (!isActive) goCard(idx) }}
          >
            {/* Card content — fades in/out when the card changes */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
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

            {/* Label + arrows — always on the center position */}
            {isActive && (
              <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
                <div className="bg-gradient-to-t from-black/75 via-black/20 to-transparent px-5 py-5 flex items-center justify-between pointer-events-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); prev() }}
                    className="text-white/70 hover:text-white text-lg transition-colors w-8 flex items-center justify-center"
                  >
                    ←
                  </button>
                  <span className="font-[var(--font-libre-franklin)] text-[11px] text-white tracking-[5px] uppercase">
                    {pillars[idx].label}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); next() }}
                    className="text-white/70 hover:text-white text-lg transition-colors w-8 flex items-center justify-center"
                  >
                    →
                  </button>
                </div>
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
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const [phase, setPhase] = useState(0)
  const [activeCard, setActiveCard] = useState(0)
  const [data, setData] = useState<PhilosophyData | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isInView) return
    const t = [
      setTimeout(() => setPhase(1), 300),   // elements appear at outer positions
      setTimeout(() => setPhase(2), 1400),   // elements converge to center
      setTimeout(() => setPhase(3), 2500),   // combined logo materialises
      setTimeout(() => setPhase(4), 3300),   // canvas logo fades; content slides in
      setTimeout(() => setPhase(5), 4200),   // carousel fully interactive
    ]
    return () => t.forEach(clearTimeout)
  }, [isInView])

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

      {/* ── Section Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center pt-20 md:pt-28 pb-12 px-8"
      >
        <div className="flex items-center justify-center gap-4 mb-5">
          <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="w-10 h-px bg-[#B1A490] origin-right" />
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">What Drives Us</span>
          <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="w-10 h-px bg-[#B1A490] origin-left" />
        </div>
        <h2 className="font-[var(--font-playfair)] text-[38px] md:text-[52px] lg:text-[64px] text-white italic leading-[1.1]">
          Our Philosophy
        </h2>
        <p className="font-[var(--font-open-sans)] text-[14px] md:text-[16px] text-white/40 mt-4 max-w-[460px] mx-auto leading-[1.8]">
          Three pillars converge into one unified vision.
        </p>
      </motion.div>

      {/* ── Animation Canvas ────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: 440 }}>
        {/* Orbit rings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: phase >= 1 && phase < 4 ? 0.07 : 0, transition: 'opacity 0.8s' }}
        >
          <ellipse cx="50%" cy="50%" rx="32%" ry="42%" stroke="#B1A490" strokeWidth="0.8" strokeDasharray="8 14" fill="none" />
          <ellipse cx="50%" cy="50%" rx="19%" ry="25%" stroke="#B1A490" strokeWidth="0.4" strokeDasharray="3 8" fill="none" />
        </svg>

        <div className="absolute inset-0">

          {/* CULTURE — from left */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL / 2}px)`, top: `calc(50% - ${EL / 2}px)` }}
            animate={
              phase === 0 ? { x: -900, y: 0, opacity: 0, scale: 0.7 }
              : phase === 1 ? { x: -240, y: 0, opacity: 1, scale: 1 }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 0.9, ease: EASE }}
          >
            <ElementImg src={data?.philosophyCultureImage ?? null} label="CULTURE" color="#C4A87A" />
            <motion.span animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] text-[#C4A87A] tracking-[4px] uppercase whitespace-nowrap">
              Culture
            </motion.span>
          </motion.div>

          {/* NATURE — from top */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL / 2}px)`, top: `calc(50% - ${EL / 2}px)` }}
            animate={
              phase === 0 ? { x: 0, y: -600, opacity: 0, scale: 0.7 }
              : phase === 1 ? { x: 0, y: -155, opacity: 1, scale: 1 }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 0.95, delay: 0.08, ease: EASE }}
          >
            <ElementImg src={data?.philosophyNatureImage ?? null} label="NATURE" color="#3D8B5A" />
            <motion.span animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] text-[#3D8B5A] tracking-[4px] uppercase whitespace-nowrap">
              Nature
            </motion.span>
          </motion.div>

          {/* ART — from right */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: `calc(50% - ${EL / 2}px)`, top: `calc(50% - ${EL / 2}px)` }}
            animate={
              phase === 0 ? { x: 900, y: 0, opacity: 0, scale: 0.7 }
              : phase === 1 ? { x: 240, y: 0, opacity: 1, scale: 1 }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 0.95, delay: 0.16, ease: EASE }}
          >
            <ElementImg src={data?.philosophyArtImage ?? null} label="ART" color="#D4A82C" />
            <motion.span animate={{ opacity: phase <= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] text-[#D4A82C] tracking-[4px] uppercase whitespace-nowrap">
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
                top: 'calc(50% - 24px)',
              }}
            />
          )}

          {/* Gold glow ring (phase 3) */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: LOGO + 40, height: LOGO + 40,
              left: `calc(50% - ${(LOGO + 40) / 2}px)`,
              top: `calc(50% - ${(LOGO + 40) / 2}px)`,
              border: '1.5px solid #B1A490',
              boxShadow: '0 0 35px 8px rgba(177,164,144,0.18)',
            }}
            animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : 0.4 }}
            transition={{ duration: 0.65 }}
          />

          {/* Combined logo at canvas center — phase 3 only */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: LOGO, height: LOGO, left: `calc(50% - ${LOGO / 2}px)`, top: `calc(50% - ${LOGO / 2}px)` }}
            animate={{
              opacity: phase === 3 ? 1 : 0,
              scale: phase === 3 ? 1 : phase < 3 ? 0.25 : 0.6,
            }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <LogoEl size={LOGO} />
          </motion.div>

        </div>
      </div>

      {/* ── Post-animation: three-card carousel + bottom bar ──── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="pb-20 md:pb-28"
      >
        {/* Three-card carousel */}
        <div className="flex items-center justify-center px-4 md:px-8 pt-4 pb-10">
          <ThreeCardCarousel
            activeCard={activeCard}
            cardImages={cardImages}
            goCard={setActiveCard}
          />
        </div>

        {/* Bottom bar: logo + separator + description text */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 px-12 md:px-20 max-w-[1100px] mx-auto">
          <LogoEl size={130} />
          <div className="hidden md:block w-px self-stretch bg-white/10" />
          <p className="font-[var(--font-open-sans)] text-white/80 text-[15px] md:text-[16px] leading-[1.9] font-medium text-center md:text-left">
            {PHILOSOPHY_TEXT}
          </p>
        </div>
      </motion.div>

    </section>
  )
}
