'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Pillar descriptions ────────────────────────────────────────────
const pillars = [
  {
    key: 'culture',
    num: '01',
    label: 'CULTURE',
    description:
      'Every space begins with a deep understanding of the people within it — honoring heritage, celebrating identity, and fostering meaningful human connection.',
    accent: '#C4A87A',
  },
  {
    key: 'nature',
    num: '02',
    label: 'NATURE',
    description:
      'Sustainability is the foundation, not an afterthought — integrating eco-conscious materials and biophilic principles into every project we create.',
    accent: '#3D8B5A',
  },
  {
    key: 'art',
    num: '03',
    label: 'ART',
    description:
      'Architecture is functional sculpture at human scale — blending structural precision with aesthetic expression to create spaces that inspire awe.',
    accent: '#D4A82C',
  },
]

// ── SVG Icons ──────────────────────────────────────────────────────

function NatureSVG({ size = 60 }: { size?: number }) {
  const h = Math.round(size * 1.55)
  return (
    <svg width={size} height={h} viewBox="0 0 60 93" fill="none">
      <line x1="30" y1="91" x2="30" y2="4" stroke="#3D8B5A" strokeWidth="2.2" strokeLinecap="round" />
      {/* Leaf pairs bottom → top */}
      <path d="M30,78 C22,69 7,69 3,75 C8,65 22,63 30,71Z" fill="#3D8B5A" />
      <path d="M30,78 C38,69 53,69 57,75 C52,65 38,63 30,71Z" fill="#4FA36A" />
      <path d="M30,61 C21,52 5,52 1,58 C7,48 21,47 30,54Z" fill="#3D8B5A" />
      <path d="M30,61 C39,52 55,52 59,58 C53,48 39,47 30,54Z" fill="#4FA36A" />
      <path d="M30,44 C23,37 10,37 6,42 C12,33 24,32 30,38Z" fill="#3D8B5A" />
      <path d="M30,44 C37,37 50,37 54,42 C48,33 36,32 30,38Z" fill="#4FA36A" />
      <path d="M30,28 C24,22 14,22 11,27 C16,19 26,18 30,23Z" fill="#3D8B5A" />
      <path d="M30,28 C36,22 46,22 49,27 C44,19 34,18 30,23Z" fill="#4FA36A" />
      <ellipse cx="30" cy="9" rx="5" ry="7" fill="#3D8B5A" />
    </svg>
  )
}

function CultureSVG({ size = 78 }: { size?: number }) {
  const h = Math.round(size * 0.85)
  return (
    <svg width={size} height={h} viewBox="0 0 84 72" fill="none">
      {/* Architectural bracket / capital shape */}
      <path
        d="M3,70 L3,57 Q3,49 12,44 L24,38 Q33,33 33,24 L33,13 Q33,2 42,1 Q51,2 51,13 L51,24 Q51,33 60,38 L72,44 Q81,49 81,57 L81,70 Z"
        fill="#C4A87A"
      />
      <rect x="31" y="0" width="22" height="3" rx="1.5" fill="#D4B88A" />
      <rect x="1" y="70" width="82" height="2" rx="1" fill="#A89060" />
    </svg>
  )
}

function ArtSVG({ size = 52 }: { size?: number }) {
  const h = Math.round(size * 1.6)
  return (
    <svg width={size} height={h} viewBox="0 0 54 86" fill="none">
      {/* Head profile silhouette */}
      <path
        d="M27,3 Q46,2 51,20 Q56,40 47,54 Q53,59 51,66 Q49,72 42,70 Q38,78 30,82 Q20,86 12,80 Q4,73 3,63 L2,49 Q0,35 5,22 Q3,12 8,7 Q15,1 27,3Z"
        fill="#D4A82C"
      />
    </svg>
  )
}

function CombinedLogoSVG({ size = 150 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none">
      {/* Culture bracket — background */}
      <g transform="translate(20,12) scale(0.88)">
        <path
          d="M3,70 L3,57 Q3,49 12,44 L24,38 Q33,33 33,24 L33,13 Q33,2 42,1 Q51,2 51,13 L51,24 Q51,33 60,38 L72,44 Q81,49 81,57 L81,70 Z"
          fill="#C4A87A"
          opacity="0.92"
        />
        <rect x="31" y="0" width="22" height="3" rx="1.5" fill="#D4B88A" opacity="0.92" />
      </g>
      {/* Art head — middle layer */}
      <g transform="translate(44,30) scale(0.56)">
        <path
          d="M27,3 Q46,2 51,20 Q56,40 47,54 Q53,59 51,66 Q49,72 42,70 Q38,78 30,82 Q20,86 12,80 Q4,73 3,63 L2,49 Q0,35 5,22 Q3,12 8,7 Q15,1 27,3Z"
          fill="#D4A82C"
          opacity="0.88"
        />
      </g>
      {/* Nature plant — foreground */}
      <g transform="translate(55,26) scale(0.44)">
        <line x1="30" y1="91" x2="30" y2="4" stroke="#3D8B5A" strokeWidth="3.8" strokeLinecap="round" />
        <path d="M30,78 C22,69 7,69 3,75 C8,65 22,63 30,71Z" fill="#3D8B5A" />
        <path d="M30,78 C38,69 53,69 57,75 C52,65 38,63 30,71Z" fill="#4FA36A" />
        <path d="M30,61 C21,52 5,52 1,58 C7,48 21,47 30,54Z" fill="#3D8B5A" />
        <path d="M30,61 C39,52 55,52 59,58 C53,48 39,47 30,54Z" fill="#4FA36A" />
        <path d="M30,44 C23,37 10,37 6,42 C12,33 24,32 30,38Z" fill="#3D8B5A" />
        <path d="M30,44 C37,37 50,37 54,42 C48,33 36,32 30,38Z" fill="#4FA36A" />
        <ellipse cx="30" cy="9" rx="5" ry="7" fill="#3D8B5A" />
      </g>
    </svg>
  )
}

// ── Arrow connector (decorative) ───────────────────────────────────
function ArrowRight({ color }: { color: string }) {
  return (
    <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
      <line x1="0" y1="6" x2="22" y2="6" stroke={color} strokeWidth="1.5" />
      <path d="M20,2 L27,6 L20,10" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

// ── Main Section ───────────────────────────────────────────────────
export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 })
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const timers = [
      setTimeout(() => setPhase(1), 400),   // elements appear at outer positions
      setTimeout(() => setPhase(2), 1600),   // elements converge toward center
      setTimeout(() => setPhase(3), 2700),   // combined logo materialises
      setTimeout(() => setPhase(4), 3500),   // logo shrinks to corner
      setTimeout(() => setPhase(5), 4400),   // pillar cards reveal
    ]
    return () => timers.forEach(clearTimeout)
  }, [isInView])

  const ease = [0.25, 0.4, 0.25, 1] as [number, number, number, number]

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#181C23] w-full overflow-hidden py-20 md:py-32"
    >
      {/* ── Section Header ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-14 px-8"
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

      {/* ── Animation Canvas + Cards ───────────────────── */}
      <div className="flex flex-col items-center gap-0 max-w-[1200px] mx-auto px-8">

        {/* Canvas — 360×360 */}
        <div className="relative flex-shrink-0" style={{ width: 360, height: 360, maxWidth: '100%' }}>

          {/* Dashed orbit rings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: phase >= 1 ? 0.1 : 0, transition: 'opacity 1s' }}
          >
            <circle cx="180" cy="180" r="160" stroke="#B1A490" strokeWidth="0.8" strokeDasharray="6 12" fill="none" />
            <circle cx="180" cy="180" r="112" stroke="#B1A490" strokeWidth="0.5" strokeDasharray="3 8" fill="none" />
          </svg>

          {/* All elements share this center-anchor */}
          <div className="absolute inset-0 flex items-center justify-center">

            {/* ── CULTURE — drops from top ─────────────── */}
            <motion.div
              className="absolute flex flex-col items-center gap-2 pointer-events-none"
              initial={{ opacity: 0, x: 0, y: -150, scale: 0.6 }}
              animate={
                phase === 0
                  ? { opacity: 0, x: 0, y: -150, scale: 0.6 }
                  : phase === 1
                  ? { opacity: 1, x: 0, y: -125, scale: 1 }
                  : { opacity: 0, x: 0, y: -20, scale: 0.25 }
              }
              transition={{ duration: 0.9, ease }}
            >
              <CultureSVG size={78} />
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: phase <= 1 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ArrowRight color="#C4A87A" />
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#C4A87A] tracking-[4px] uppercase">
                  Culture
                </span>
              </motion.div>
            </motion.div>

            {/* ── NATURE — slides from left ────────────── */}
            <motion.div
              className="absolute flex items-center gap-3 pointer-events-none"
              initial={{ opacity: 0, x: -180, y: 25, scale: 0.6 }}
              animate={
                phase === 0
                  ? { opacity: 0, x: -180, y: 25, scale: 0.6 }
                  : phase === 1
                  ? { opacity: 1, x: -148, y: 25, scale: 1 }
                  : { opacity: 0, x: -20, y: -5, scale: 0.25 }
              }
              transition={{ duration: 0.95, delay: 0.08, ease }}
            >
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: phase <= 1 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#3D8B5A] tracking-[4px] uppercase">
                  Nature
                </span>
                <ArrowRight color="#3D8B5A" />
              </motion.div>
              <NatureSVG size={56} />
            </motion.div>

            {/* ── ART — slides from right ──────────────── */}
            <motion.div
              className="absolute flex items-center gap-3 pointer-events-none"
              initial={{ opacity: 0, x: 180, y: 25, scale: 0.6 }}
              animate={
                phase === 0
                  ? { opacity: 0, x: 180, y: 25, scale: 0.6 }
                  : phase === 1
                  ? { opacity: 1, x: 148, y: 25, scale: 1 }
                  : { opacity: 0, x: 20, y: -5, scale: 0.25 }
              }
              transition={{ duration: 0.95, delay: 0.16, ease }}
            >
              <ArtSVG size={52} />
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: phase <= 1 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ArrowRight color="#D4A82C" />
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#D4A82C] tracking-[4px] uppercase">
                  Art
                </span>
              </motion.div>
            </motion.div>

            {/* ── Convergence radial flash ─────────────── */}
            {phase >= 2 && (
              <motion.div
                key="flash"
                initial={{ scale: 0.1, opacity: 0.6 }}
                animate={{ scale: 7, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute w-14 h-14 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, #B1A490 0%, transparent 70%)' }}
              />
            )}

            {/* ── COMBINED LOGO — forms at center, then moves to corner ── */}
            <motion.div
              className="absolute pointer-events-none"
              initial={{ opacity: 0, scale: 0.2, x: 0, y: -15 }}
              animate={
                phase < 3
                  ? { opacity: 0, scale: 0.2, x: 0, y: -15 }
                  : phase === 3
                  ? { opacity: 1, scale: 1.08, x: 0, y: -15 }
                  : { opacity: 1, scale: 0.5, x: -125, y: -118 }
              }
              transition={{
                duration: phase >= 4 ? 1.1 : 0.65,
                ease,
                opacity: { duration: 0.5 },
              }}
            >
              <CombinedLogoSVG size={155} />
            </motion.div>

            {/* ── Gold glow ring around combined logo ─── */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={
                  phase === 3
                    ? { opacity: 1, scale: 1.1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.6 }}
                className="absolute w-[170px] h-[170px] rounded-full pointer-events-none"
                style={{
                  border: '1px solid #B1A490',
                  boxShadow: '0 0 24px 4px rgba(177,164,144,0.18)',
                  marginTop: -30,
                }}
              />
            )}

            {/* ── Corner label (after logo moves) ─────── */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ x: -145, y: -42 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 4 ? 0.5 : 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] tracking-[3px] uppercase whitespace-nowrap">
                Criteria Designs
              </span>
            </motion.div>

          </div>
        </div>

        {/* ── Pillar Cards ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 0.9 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/[0.07] pt-14 mt-4"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 28 }}
              animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.14 }}
              className="group"
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
                  {/* Accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={phase >= 5 ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.14 }}
                    className="mt-7 h-px origin-left"
                    style={{ background: `linear-gradient(to right, ${p.accent}55, transparent)` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Marquee strip ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full overflow-hidden mt-16 py-10 border-t border-white/[0.05]"
        >
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'philosophy-marquee 14s linear infinite' }}
          >
            {[0, 1].map((n) => (
              <span
                key={n}
                className="font-[var(--font-playfair)] text-[52px] md:text-[72px] font-black tracking-[2px] select-none uppercase shrink-0 pr-8"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.2px rgba(255,255,255,0.08)',
                }}
              >
                {'CULTURE · NATURE · ART · CRITERIA DESIGNS · '}
              </span>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `@keyframes philosophy-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`
          }} />
        </motion.div>

      </div>
    </section>
  )
}
