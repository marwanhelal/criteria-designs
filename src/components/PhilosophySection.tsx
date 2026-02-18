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
  {
    key: 'culture',
    num: '01',
    label: 'CULTURE',
    accent: '#C4A87A',
    description:
      'We believe architecture must begin with a deep respect for cultural heritage — celebrating local identity and connecting communities to their shared history and values.',
  },
  {
    key: 'nature',
    num: '02',
    label: 'NATURE',
    accent: '#3D8B5A',
    description:
      'Every project integrates the rhythms of the natural world — incorporating biophilic principles and eco-conscious materials into a living, breathing architecture.',
  },
  {
    key: 'art',
    num: '03',
    label: 'ART',
    accent: '#D4A82C',
    description:
      'Architecture is visual language — a statement about who we are. We sculpt functional beauty that stands as a testament to vision, precision, and craftsmanship.',
  },
]

const EASE = [0.25, 0.4, 0.25, 1] as [number, number, number, number]
const EL = 175  // element image size during animation
const LOGO = 250 // combined logo size after settling

// ── Helpers ────────────────────────────────────────────────────────
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

function LogoImg({ src }: { src: string | null }) {
  return src ? (
    <div className="relative w-full h-full">
      <Image src={src} alt="Criteria Designs" fill className="object-contain" unoptimized />
    </div>
  ) : (
    <div className="w-full h-full rounded-full border border-[#B1A490]/25 flex items-center justify-center">
      <span className="font-[var(--font-merriweather)] text-[36px] font-bold text-[#B1A490]">CD</span>
    </div>
  )
}

// ── Main Section ───────────────────────────────────────────────────
export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const [phase, setPhase] = useState(0)
  const [activeCard, setActiveCard] = useState(0)
  const [dir, setDir] = useState(1)
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
      setTimeout(() => setPhase(3), 2500),   // combined logo appears — elements fade
      setTimeout(() => setPhase(4), 3400),   // canvas logo fades; content slides in
      setTimeout(() => setPhase(5), 4300),   // carousel appears
    ]
    return () => t.forEach(clearTimeout)
  }, [isInView])

  const cardImages = [
    data?.philosophyCultureImage,
    data?.philosophyNatureImage,
    data?.philosophyArtImage,
  ]

  const goCard = (i: number) => {
    setDir(i > activeCard ? 1 : -1)
    setActiveCard(i)
  }

  return (
    <section ref={sectionRef} className="relative bg-[#181C23] w-full overflow-hidden">

      {/* ── Section Header ──────────────────────────────── */}
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

      {/* ── Animation Canvas ──────────────────────────────── */}
      <div className="relative w-full" style={{ height: 440 }}>

        {/* Dashed ellipse orbits */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: phase >= 1 && phase < 4 ? 0.07 : 0, transition: 'opacity 0.8s' }}
        >
          <ellipse cx="50%" cy="50%" rx="32%" ry="42%" stroke="#B1A490" strokeWidth="0.8" strokeDasharray="8 14" fill="none" />
          <ellipse cx="50%" cy="50%" rx="19%" ry="25%" stroke="#B1A490" strokeWidth="0.4" strokeDasharray="3 8" fill="none" />
        </svg>

        {/* All elements anchor from canvas center */}
        <div className="absolute inset-0 flex items-center justify-center">

          {/* ── CULTURE — from top ─────────────────── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: -EL / 2, top: -EL / 2 }}
            animate={
              phase === 0 ? { x: 0, y: -215, opacity: 0, scale: 0.65 }
              : phase === 1 ? { x: 0, y: -185, opacity: 1, scale: 1 }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 0.9, ease: EASE }}
          >
            <ElementImg src={data?.philosophyCultureImage ?? null} label="CULTURE" color="#C4A87A" />
            <motion.span
              animate={{ opacity: phase <= 1 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-[var(--font-libre-franklin)] text-[10px] text-[#C4A87A] tracking-[4px] uppercase whitespace-nowrap"
            >
              Culture
            </motion.span>
          </motion.div>

          {/* ── NATURE — from left ─────────────────── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: -EL / 2, top: -EL / 2 }}
            animate={
              phase === 0 ? { x: -225, y: 25, opacity: 0, scale: 0.65 }
              : phase === 1 ? { x: -195, y: 25, opacity: 1, scale: 1 }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 0.95, delay: 0.08, ease: EASE }}
          >
            <ElementImg src={data?.philosophyNatureImage ?? null} label="NATURE" color="#3D8B5A" />
            <motion.span
              animate={{ opacity: phase <= 1 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute right-full top-1/2 -translate-y-1/2 mr-3 font-[var(--font-libre-franklin)] text-[10px] text-[#3D8B5A] tracking-[4px] uppercase whitespace-nowrap"
            >
              Nature
            </motion.span>
          </motion.div>

          {/* ── ART — from right ───────────────────── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: EL, height: EL, left: -EL / 2, top: -EL / 2 }}
            animate={
              phase === 0 ? { x: 225, y: 25, opacity: 0, scale: 0.65 }
              : phase === 1 ? { x: 195, y: 25, opacity: 1, scale: 1 }
              : { x: 0, y: 0, opacity: phase >= 3 ? 0 : 1, scale: phase >= 3 ? 0.35 : 1 }
            }
            transition={{ duration: 0.95, delay: 0.16, ease: EASE }}
          >
            <ElementImg src={data?.philosophyArtImage ?? null} label="ART" color="#D4A82C" />
            <motion.span
              animate={{ opacity: phase <= 1 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 font-[var(--font-libre-franklin)] text-[10px] text-[#D4A82C] tracking-[4px] uppercase whitespace-nowrap"
            >
              Art
            </motion.span>
          </motion.div>

          {/* ── Radial flash ────────────────────────── */}
          {phase >= 2 && phase <= 3 && (
            <motion.div
              key="flash"
              initial={{ scale: 0.1, opacity: 0.65 }}
              animate={{ scale: 10, opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
              className="absolute w-12 h-12 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, #B1A490 0%, transparent 70%)' }}
            />
          )}

          {/* ── Gold glow ring (phase 3) ────────────── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: LOGO + 40, height: LOGO + 40,
              left: -(LOGO + 40) / 2, top: -(LOGO + 40) / 2,
              border: '1.5px solid #B1A490',
              boxShadow: '0 0 35px 8px rgba(177,164,144,0.18)',
            }}
            animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : 0.4 }}
            transition={{ duration: 0.65 }}
          />

          {/* ── COMBINED LOGO in canvas (phases 3 only — fades in then out) ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ width: LOGO, height: LOGO, left: -LOGO / 2, top: -LOGO / 2 }}
            animate={{
              opacity: phase === 3 ? 1 : 0,
              scale: phase === 3 ? 1 : phase < 3 ? 0.25 : 0.6,
            }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <LogoImg src={data?.philosophyImage ?? null} />
          </motion.div>

        </div>
      </div>

      {/* ── Content: Logo (left) + Carousel (right) ──── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-[1400px] mx-auto px-8 md:px-14 pb-24 md:pb-36"
      >
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-0">

          {/* ── Logo settled at bottom-left ─────────── */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-center gap-4 lg:pr-14 lg:border-r lg:border-white/[0.08]">
            <div className="relative" style={{ width: LOGO, height: LOGO }}>
              <LogoImg src={data?.philosophyImage ?? null} />
            </div>
            <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490]/50 tracking-[3px] uppercase">
              Criteria Designs
            </span>
          </div>

          {/* ── Card Carousel ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={phase >= 5 ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex-1 min-w-0 lg:pl-14"
          >
            {/* Pillar tab nav */}
            <div className="flex gap-8 mb-10 border-b border-white/[0.07] pb-4">
              {pillars.map((p, i) => (
                <button
                  key={p.key}
                  onClick={() => goCard(i)}
                  className="relative font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[4px] pb-4 transition-colors"
                  style={{ color: i === activeCard ? p.accent : 'rgba(255,255,255,0.25)' }}
                >
                  {p.label}
                  {i === activeCard && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: p.accent }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Card */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -dir * 60 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex flex-col md:flex-row gap-10 items-start"
              >
                {/* Card image */}
                <div
                  className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{ width: 300, height: 400 }}
                >
                  {cardImages[activeCard] ? (
                    <Image
                      src={cardImages[activeCard]!}
                      alt={pillars[activeCard].label}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `${pillars[activeCard].accent}12` }}
                    >
                      <span
                        className="font-[var(--font-playfair)] text-[90px] font-black"
                        style={{ color: `${pillars[activeCard].accent}25` }}
                      >
                        {pillars[activeCard].num}
                      </span>
                    </div>
                  )}
                  {/* Number badge */}
                  <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/70 tracking-[3px]">
                      {pillars[activeCard].num}
                    </span>
                  </div>
                </div>

                {/* Card text */}
                <div className="flex-1 flex flex-col justify-between min-h-[400px]">
                  <div>
                    <h3
                      className="font-[var(--font-merriweather)] text-[36px] md:text-[46px] font-bold uppercase tracking-[2px] leading-[1.1] mb-6"
                      style={{ color: pillars[activeCard].accent }}
                    >
                      {pillars[activeCard].label}
                    </h3>
                    <p className="font-[var(--font-open-sans)] text-[15px] md:text-[16px] text-white/55 leading-[1.95] max-w-[420px]">
                      {pillars[activeCard].description}
                    </p>
                  </div>

                  {/* Arrow nav */}
                  <div className="flex items-center gap-4 mt-10">
                    <button
                      onClick={() => goCard((activeCard - 1 + 3) % 3)}
                      className="w-12 h-12 border border-white/15 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-200"
                    >
                      ←
                    </button>
                    {/* Dot indicators */}
                    <div className="flex items-center gap-2">
                      {pillars.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => goCard(i)}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === activeCard ? 28 : 7,
                            height: 7,
                            background: i === activeCard ? p.accent : 'rgba(255,255,255,0.18)',
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => goCard((activeCard + 1) % 3)}
                      className="w-12 h-12 border border-white/15 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-200"
                    >
                      →
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </motion.div>

    </section>
  )
}
