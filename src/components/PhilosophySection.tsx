'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

interface PhilosophyData {
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
      'Every space begins with a deep understanding of the people within it — honoring heritage, celebrating identity, and fostering meaningful human connection.',
  },
  {
    key: 'nature',
    num: '02',
    label: 'NATURE',
    accent: '#3D8B5A',
    description:
      'Sustainability is the foundation, not an afterthought — integrating eco-conscious materials and biophilic principles into every project we create.',
  },
  {
    key: 'art',
    num: '03',
    label: 'ART',
    accent: '#D4A82C',
    description:
      'Architecture is functional sculpture at human scale — blending structural precision with aesthetic expression to create spaces that inspire awe.',
  },
]

const EASE = [0.25, 0.4, 0.25, 1] as [number, number, number, number]
const IMG = 160 // px — size of each element in the animation

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const [phase, setPhase] = useState(0)
  const [canvasW, setCanvasW] = useState(800)
  const [canvasH] = useState(480)
  const [data, setData] = useState<PhilosophyData | null>(null)

  // Measure canvas width for bottom-left target calculation
  useEffect(() => {
    const measure = () => {
      if (canvasRef.current) setCanvasW(canvasRef.current.offsetWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Fetch CMS images
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d) })
      .catch(() => {})
  }, [])

  // Animation sequence
  useEffect(() => {
    if (!isInView) return
    const t = [
      setTimeout(() => setPhase(1), 300),   // elements appear at outer positions
      setTimeout(() => setPhase(2), 1400),   // elements converge to center
      setTimeout(() => setPhase(3), 2500),   // all combined at center — glow
      setTimeout(() => setPhase(4), 3300),   // group scales down + moves to bottom-left
      setTimeout(() => setPhase(5), 4200),   // cards reveal
    ]
    return () => t.forEach(clearTimeout)
  }, [isInView])

  // Bottom-left corner of the canvas (relative to canvas center)
  const targetX = -(canvasW / 2 - 90)
  const targetY = canvasH / 2 - 110

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#181C23] w-full overflow-hidden pt-20 md:pt-32 pb-24 md:pb-36"
    >
      {/* ── Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-16 px-8"
      >
        <div className="flex items-center justify-center gap-4 mb-5">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-10 h-px bg-[#B1A490] origin-right"
          />
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
            What Drives Us
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-10 h-px bg-[#B1A490] origin-left"
          />
        </div>
        <h2 className="font-[var(--font-playfair)] text-[38px] md:text-[52px] lg:text-[64px] text-white italic leading-[1.1]">
          Our Philosophy
        </h2>
        <p className="font-[var(--font-open-sans)] text-[14px] md:text-[16px] text-white/40 mt-4 max-w-[480px] mx-auto leading-[1.8]">
          Three pillars converge into one unified vision.
        </p>
      </motion.div>

      {/* ── Animation Canvas ────────────────────────────── */}
      <div
        ref={canvasRef}
        className="relative w-full"
        style={{ height: canvasH }}
      >
        {/* Dashed orbit rings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: phase >= 1 && phase < 4 ? 0.08 : 0, transition: 'opacity 0.8s' }}
        >
          <ellipse
            cx="50%" cy="50%"
            rx="30%" ry="38%"
            stroke="#B1A490" strokeWidth="0.8"
            strokeDasharray="8 14" fill="none"
          />
          <ellipse
            cx="50%" cy="50%"
            rx="20%" ry="26%"
            stroke="#B1A490" strokeWidth="0.5"
            strokeDasharray="3 9" fill="none"
          />
        </svg>

        {/* Center anchor — everything is positioned from here */}
        <div className="absolute inset-0 flex items-center justify-center">

          {/* ── WRAPPER: holds all three images, moves as a unit ── */}
          <motion.div
            className="absolute"
            animate={
              phase < 4
                ? { x: 0, y: 0, scale: 1 }
                : { x: targetX, y: targetY, scale: 0.44 }
            }
            transition={{ duration: 1.1, ease: EASE }}
          >
            {/* ── CULTURE — drops from top ─────────── */}
            <motion.div
              className="absolute"
              style={{
                width: IMG, height: IMG,
                left: -IMG / 2, top: -IMG / 2,
              }}
              animate={
                phase === 0
                  ? { x: 0, y: -190, opacity: 0, scale: 0.7 }
                  : phase === 1
                  ? { x: 0, y: -165, opacity: 1, scale: 1 }
                  : { x: 0, y: 0, opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.9, ease: EASE }}
            >
              {data?.philosophyCultureImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={data.philosophyCultureImage}
                    alt="Culture"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <PlaceholderIcon color="#C4A87A" label="C" />
              )}
              {/* Label */}
              <motion.div
                animate={{ opacity: phase <= 1 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
              >
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#C4A87A] tracking-[4px] uppercase">
                  Culture
                </span>
              </motion.div>
            </motion.div>

            {/* ── NATURE — slides from left ─────────── */}
            <motion.div
              className="absolute"
              style={{
                width: IMG, height: IMG,
                left: -IMG / 2, top: -IMG / 2,
              }}
              animate={
                phase === 0
                  ? { x: -210, y: 30, opacity: 0, scale: 0.7 }
                  : phase === 1
                  ? { x: -180, y: 30, opacity: 1, scale: 1 }
                  : { x: 0, y: 0, opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.95, delay: 0.07, ease: EASE }}
            >
              {data?.philosophyNatureImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={data.philosophyNatureImage}
                    alt="Nature"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <PlaceholderIcon color="#3D8B5A" label="N" />
              )}
              {/* Label */}
              <motion.div
                animate={{ opacity: phase <= 1 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap"
              >
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#3D8B5A] tracking-[4px] uppercase">
                  Nature
                </span>
              </motion.div>
            </motion.div>

            {/* ── ART — slides from right ───────────── */}
            <motion.div
              className="absolute"
              style={{
                width: IMG, height: IMG,
                left: -IMG / 2, top: -IMG / 2,
              }}
              animate={
                phase === 0
                  ? { x: 210, y: 30, opacity: 0, scale: 0.7 }
                  : phase === 1
                  ? { x: 180, y: 30, opacity: 1, scale: 1 }
                  : { x: 0, y: 0, opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.95, delay: 0.14, ease: EASE }}
            >
              {data?.philosophyArtImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={data.philosophyArtImage}
                    alt="Art"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <PlaceholderIcon color="#D4A82C" label="A" />
              )}
              {/* Label */}
              <motion.div
                animate={{ opacity: phase <= 1 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap"
              >
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#D4A82C] tracking-[4px] uppercase">
                  Art
                </span>
              </motion.div>
            </motion.div>

            {/* ── "Criteria Designs" label under settled logo ── */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
              style={{ top: IMG / 2 + 8 }}
              animate={{ opacity: phase >= 4 ? 0.55 : 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] tracking-[3px] uppercase">
                Criteria Designs
              </span>
            </motion.div>
          </motion.div>

          {/* ── Radial flash on convergence ──────────── */}
          {phase >= 2 && phase <= 3 && (
            <motion.div
              key="flash"
              initial={{ scale: 0.1, opacity: 0.7 }}
              animate={{ scale: 9, opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
              className="absolute w-12 h-12 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, #B1A490 0%, transparent 70%)' }}
            />
          )}

          {/* ── Gold glow ring at center (phase 3) ───── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: IMG + 30,
              height: IMG + 30,
              left: '50%',
              top: '50%',
              marginLeft: -(IMG + 30) / 2,
              marginTop: -(IMG + 30) / 2,
              border: '1.5px solid #B1A490',
              boxShadow: '0 0 30px 6px rgba(177,164,144,0.22)',
            }}
            animate={{ opacity: phase === 3 ? 1 : 0, scale: phase === 3 ? 1 : 0.5 }}
            transition={{ duration: 0.6 }}
          />

        </div>
      </div>

      {/* ── Pillar Cards ─────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/[0.07] pt-14"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {pillars.map((p, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 28 }}
                animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.1 + i * 0.14 }}
              >
                <div className="flex items-start gap-4">
                  <span className="font-[var(--font-libre-franklin)] text-[11px] tracking-[3px] mt-1 text-white/25 shrink-0">
                    {p.num}
                  </span>
                  <div className="flex-1">
                    <h3
                      className="font-[var(--font-merriweather)] text-[18px] md:text-[20px] font-bold tracking-[2px] uppercase mb-3"
                      style={{ color: p.accent }}
                    >
                      {p.label}
                    </h3>
                    <p className="font-[var(--font-open-sans)] text-[14px] text-white/50 leading-[1.9]">
                      {p.description}
                    </p>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={phase >= 5 ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.14 }}
                      className="mt-6 h-px origin-left"
                      style={{
                        background: `linear-gradient(to right, ${p.accent}66, transparent)`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Marquee ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 5 ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.8 }}
        className="w-full overflow-hidden mt-16 py-10 border-t border-white/[0.05]"
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'phil-marquee 14s linear infinite' }}
        >
          {[0, 1].map((n) => (
            <span
              key={n}
              className="font-[var(--font-playfair)] text-[52px] md:text-[72px] font-black tracking-[2px] select-none uppercase shrink-0 pr-8"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.2px rgba(255,255,255,0.07)',
              }}
            >
              {'CULTURE · NATURE · ART · CRITERIA DESIGNS · '}
            </span>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `@keyframes phil-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`
        }} />
      </motion.div>
    </section>
  )
}

// Fallback placeholder while images load / not yet set in CMS
function PlaceholderIcon({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center"
      style={{ background: `${color}22`, border: `2px solid ${color}44` }}
    >
      <span
        className="font-[var(--font-merriweather)] text-[48px] font-bold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  )
}
