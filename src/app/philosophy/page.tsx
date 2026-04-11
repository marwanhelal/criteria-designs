'use client'

import { useEffect, useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface PhilosophyData {
  heroTitle: string
  heroSubtitle: string
  introText: string
  introImage: string | null
  humanTitle: string
  humanDescription: string
  humanImage: string | null
  envTitle: string
  envDescription: string
  envImage: string | null
  cultureTitle: string
  cultureDescription: string
  cultureImage: string | null
  transformationText: string
  solution1: string
  solution2: string
  solution3: string
  solution4: string
  outcome1: string
  outcome2: string
  finalMessage: string
}

const DEFAULTS: PhilosophyData = {
  heroTitle: 'The Soul of Our Design',
  heroSubtitle: 'Every project begins with understanding what truly matters.',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment — leading to being the most effective element to human efficiency.',
  introImage: null,
  humanTitle: 'HUMAN',
  humanDescription: 'Human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'Environmental measures such as weather, geography and energy.',
  envImage: null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'Cultural values such as social and economic ones.',
  cultureImage: null,
  transformationText: 'Where insights become design.',
  solution1: 'Innovation',
  solution2: 'Sustainability',
  solution3: 'Creativity',
  solution4: 'Uniqueness',
  outcome1: 'Happiness',
  outcome2: 'Resilience',
  finalMessage: "We don't just design buildings.\nWe design outcomes that last.",
}

// Easing
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease } }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: i * 0.1, ease } }),
}

// ── Human Icon ────────────────────────────────────────────────────────────────
function HumanIcon({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
      <motion.circle
        cx="40" cy="22" r="12"
        stroke="#C9A24D" strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease }}
      />
      <motion.path
        d="M18 68 C18 52 62 52 62 68"
        stroke="#C9A24D" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease }}
      />
      <motion.path
        d="M32 58 L40 50 L48 58"
        stroke="#C9A24D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5, ease }}
      />
    </svg>
  )
}

// ── Environmental Icon ────────────────────────────────────────────────────────
function EnvIcon({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
      <motion.path
        d="M40 70 L40 30"
        stroke="#5B8C5A" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
      />
      <motion.path
        d="M40 42 C40 42 24 36 24 20 C24 12 32 8 40 14 C48 8 56 12 56 20 C56 36 40 42 40 42Z"
        stroke="#5B8C5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.2, ease }}
      />
      <motion.path
        d="M28 68 L52 68"
        stroke="#5B8C5A" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6, ease }}
      />
    </svg>
  )
}

// ── Culture Icon ──────────────────────────────────────────────────────────────
function CultureIcon({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
      <motion.rect
        x="22" y="30" width="36" height="38" rx="1"
        stroke="#B1A490" strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease }}
      />
      <motion.path
        d="M14 32 L40 12 L66 32"
        stroke="#B1A490" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3, ease }}
      />
      <motion.rect
        x="34" y="50" width="12" height="18" rx="1"
        stroke="#B1A490" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6, ease }}
      />
      <motion.rect
        x="26" y="36" width="8" height="8" rx="0.5"
        stroke="#B1A490" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.8, ease }}
      />
      <motion.rect
        x="46" y="36" width="8" height="8" rx="0.5"
        stroke="#B1A490" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.9, ease }}
      />
    </svg>
  )
}

// ── Architectural grid background ─────────────────────────────────────────────
function GridBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full" aria-hidden>
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-300" />
    </svg>
  )
}

// ── Node component ────────────────────────────────────────────────────────────
function Node({
  label, color, delay, inView, size = 'md',
}: {
  label: string; color: string; delay: number; inView: boolean; size?: 'sm' | 'md' | 'lg'
}) {
  const sz = size === 'lg' ? 'w-20 h-20' : size === 'sm' ? 'w-12 h-12' : 'w-16 h-16'
  const txt = size === 'lg' ? 'text-sm' : 'text-xs'
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease }}
    >
      <div
        className={`${sz} rounded-full border-2 flex items-center justify-center`}
        style={{ borderColor: color, backgroundColor: `${color}18` }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <span className={`${txt} font-medium tracking-wide text-center`} style={{ color }}>
        {label}
      </span>
    </motion.div>
  )
}

// ── Connecting SVG line ───────────────────────────────────────────────────────
function AnimatedLine({ inView, delay = 0, className = '' }: { inView: boolean; delay?: number; className?: string }) {
  return (
    <svg className={`absolute ${className}`} viewBox="0 0 200 2" preserveAspectRatio="none">
      <motion.line
        x1="0" y1="1" x2="200" y2="1"
        stroke="#B1A490" strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay, ease }}
      />
    </svg>
  )
}

export default function PhilosophyPage() {
  const [data, setData] = useState<PhilosophyData>(DEFAULTS)

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : DEFAULTS)
      .then((d: PhilosophyData) => setData({ ...DEFAULTS, ...d }))
      .catch(() => {})
  }, [])

  // Section refs for inView
  const heroRef = useRef(null)
  const introRef = useRef(null)
  const foundationsRef = useRef(null)
  const transformRef = useRef(null)
  const solutionsRef = useRef(null)
  const finalRef = useRef(null)

  const introInView = useInView(introRef, { once: true, margin: '-80px' })
  const foundationsInView = useInView(foundationsRef, { once: true, margin: '-60px' })
  const transformInView = useInView(transformRef, { once: true, margin: '-60px' })
  const solutionsInView = useInView(solutionsRef, { once: true, margin: '-60px' })
  const finalInView = useInView(finalRef, { once: true, margin: '-60px' })

  // Parallax on hero title
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const solutions = [data.solution1, data.solution2, data.solution3, data.solution4]
  const solutionColors = ['#C9A24D', '#5B8C5A', '#B1A490', '#181C23']

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F8F7F4]"
      >
        <GridBackground />

        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-[#B1A490]/30" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#B1A490]/30" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeIn} initial="hidden" animate="show" custom={0}
            className="text-xs font-semibold tracking-[0.3em] text-[#B1A490] uppercase mb-6"
          >
            Our Philosophy
          </motion.p>

          {/* Main title */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-[var(--font-merriweather)] text-5xl md:text-7xl font-bold text-[#181C23] leading-tight mb-8"
          >
            {data.heroTitle}
          </motion.h1>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="w-16 h-0.5 bg-[#B1A490] mx-auto mb-8 origin-left"
          />

          {/* Subtitle */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="text-lg md:text-xl text-[#666] font-[var(--font-open-sans)] max-w-xl mx-auto leading-relaxed"
          >
            {data.heroSubtitle}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.25em] text-[#B1A490] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-[#B1A490] to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. WHAT WE BELIEVE IN — INTRO
      ═══════════════════════════════════════════════════════════ */}
      <section ref={introRef} className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              variants={fadeIn} initial="hidden" animate={introInView ? 'show' : 'hidden'} custom={0}
              className="text-xs font-semibold tracking-[0.3em] text-[#B1A490] uppercase mb-4"
            >
              What We Believe In
            </motion.p>
            <motion.h2
              variants={fadeUp} initial="hidden" animate={introInView ? 'show' : 'hidden'} custom={1}
              className="font-[var(--font-merriweather)] text-3xl md:text-4xl font-bold text-[#181C23] mb-8 leading-tight"
            >
              Design rooted in purpose,<br />not just aesthetics.
            </motion.h2>
            <motion.p
              variants={fadeUp} initial="hidden" animate={introInView ? 'show' : 'hidden'} custom={2}
              className="text-[#666] leading-relaxed text-base md:text-lg font-[var(--font-open-sans)]"
            >
              {data.introText}
            </motion.p>
          </div>

          {/* Visual — diagram or image */}
          <motion.div
            variants={fadeUp} initial="hidden" animate={introInView ? 'show' : 'hidden'} custom={3}
            className="flex items-center justify-center"
          >
            {data.introImage ? (
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden">
                <Image src={data.introImage} alt="Philosophy diagram" fill className="object-contain" />
              </div>
            ) : (
              /* Default architectural diagram */
              <svg viewBox="0 0 300 300" className="w-64 h-64 opacity-60">
                <circle cx="150" cy="80" r="32" stroke="#C9A24D" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <circle cx="80" cy="220" r="32" stroke="#5B8C5A" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <circle cx="220" cy="220" r="32" stroke="#B1A490" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <line x1="150" y1="112" x2="100" y2="190" stroke="#B1A490" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="150" y1="112" x2="200" y2="190" stroke="#B1A490" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="112" y1="220" x2="188" y2="220" stroke="#B1A490" strokeWidth="1" strokeDasharray="3 3" />
                <text x="150" y="84" textAnchor="middle" fontSize="9" fill="#C9A24D" fontFamily="serif">Human</text>
                <text x="80" y="224" textAnchor="middle" fontSize="9" fill="#5B8C5A" fontFamily="serif">Nature</text>
                <text x="220" y="224" textAnchor="middle" fontSize="9" fill="#B1A490" fontFamily="serif">Culture</text>
              </svg>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. THREE FOUNDATIONS
      ═══════════════════════════════════════════════════════════ */}
      <section ref={foundationsRef} className="py-24 bg-[#F5F4F1] px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.p
            variants={fadeIn} initial="hidden" animate={foundationsInView ? 'show' : 'hidden'}
            className="text-xs font-semibold tracking-[0.3em] text-[#B1A490] uppercase mb-4 text-center"
          >
            The Three Foundations
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" animate={foundationsInView ? 'show' : 'hidden'} custom={1}
            className="font-[var(--font-merriweather)] text-3xl md:text-4xl font-bold text-[#181C23] text-center mb-20"
          >
            Every project is shaped by three forces.
          </motion.h2>

          {/* Foundation cards */}
          <div className="relative grid md:grid-cols-3 gap-0">

            {/* Card 1 — Human */}
            <motion.div
              variants={fadeUp} initial="hidden" animate={foundationsInView ? 'show' : 'hidden'} custom={0}
              className="flex flex-col items-center text-center px-10 py-12 relative"
            >
              <div className="mb-6">
                <HumanIcon animated={foundationsInView} />
              </div>
              <h3 className="font-[var(--font-merriweather)] text-xl font-bold text-[#181C23] mb-4 tracking-wide">
                {data.humanTitle}
              </h3>
              <p className="text-[#666] text-sm leading-relaxed font-[var(--font-open-sans)]">
                {data.humanDescription}
              </p>
            </motion.div>

            {/* Separator & */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={foundationsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              className="hidden md:flex items-center justify-center absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            >
              <span className="text-4xl font-light text-[#5B8C5A] select-none">&amp;</span>
            </motion.div>

            {/* Card 2 — Environmental */}
            <motion.div
              variants={fadeUp} initial="hidden" animate={foundationsInView ? 'show' : 'hidden'} custom={1}
              className="flex flex-col items-center text-center px-10 py-12 relative border-t md:border-t-0 md:border-x border-[#E0DDD8]"
            >
              <div className="mb-6">
                <EnvIcon animated={foundationsInView} />
              </div>
              <h3 className="font-[var(--font-merriweather)] text-xl font-bold text-[#181C23] mb-4 tracking-wide">
                {data.envTitle}
              </h3>
              <p className="text-[#666] text-sm leading-relaxed font-[var(--font-open-sans)]">
                {data.envDescription}
              </p>
            </motion.div>

            {/* Separator & */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={foundationsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6, ease }}
              className="hidden md:flex items-center justify-center absolute left-2/3 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            >
              <span className="text-4xl font-light text-[#5B8C5A] select-none">&amp;</span>
            </motion.div>

            {/* Card 3 — Culture */}
            <motion.div
              variants={fadeUp} initial="hidden" animate={foundationsInView ? 'show' : 'hidden'} custom={2}
              className="flex flex-col items-center text-center px-10 py-12 border-t md:border-t-0"
            >
              <div className="mb-6">
                <CultureIcon animated={foundationsInView} />
              </div>
              <h3 className="font-[var(--font-merriweather)] text-xl font-bold text-[#181C23] mb-4 tracking-wide">
                {data.cultureTitle}
              </h3>
              <p className="text-[#666] text-sm leading-relaxed font-[var(--font-open-sans)]">
                {data.cultureDescription}
              </p>
            </motion.div>
          </div>

          {/* Connecting line */}
          <div className="relative h-px mt-4 hidden md:block">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#C9A24D] via-[#5B8C5A] to-[#B1A490]"
              initial={{ scaleX: 0, originX: 0 }}
              animate={foundationsInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.8, ease }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. TRANSFORMATION MOMENT
      ═══════════════════════════════════════════════════════════ */}
      <section ref={transformRef} className="py-32 bg-[#181C23] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={transformInView ? { opacity: 0.15, scale: 1 } : {}}
            transition={{ duration: 1.5, ease }}
            className="w-96 h-96 rounded-full bg-[#B1A490] blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Three dots converging */}
          <div className="flex items-center justify-center gap-8 mb-16">
            {[
              { color: '#C9A24D', delay: 0, x: -60 },
              { color: '#5B8C5A', delay: 0.15, x: 0 },
              { color: '#B1A490', delay: 0.3, x: 60 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dot.color }}
                initial={{ opacity: 0, x: dot.x }}
                animate={transformInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: dot.delay, ease }}
              />
            ))}
          </div>

          {/* Central design node */}
          <motion.div
            className="relative inline-flex items-center justify-center mb-12"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={transformInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <motion.div
              className="w-24 h-24 rounded-full border-2 border-[#B1A490]/40 absolute"
              animate={transformInView ? { scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] } : {}}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            <motion.div
              className="w-20 h-20 rounded-full border-2 border-[#B1A490]/60 absolute"
              animate={transformInView ? { scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] } : {}}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.3, ease: 'easeInOut' }}
            />
            <div className="w-14 h-14 rounded-full bg-[#B1A490]/20 border border-[#B1A490] flex items-center justify-center relative z-10">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[#B1A490]" fill="none" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>

          {/* Transformation text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={transformInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            className="text-xs font-semibold tracking-[0.3em] text-[#B1A490]/70 uppercase mb-4"
          >
            The Convergence
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={transformInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1, ease }}
            className="font-[var(--font-merriweather)] text-3xl md:text-5xl font-bold text-white leading-tight"
          >
            {data.transformationText}
          </motion.h2>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. DESIGN FLOW — SOLUTIONS
      ═══════════════════════════════════════════════════════════ */}
      <section ref={solutionsRef} className="py-28 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p
            variants={fadeIn} initial="hidden" animate={solutionsInView ? 'show' : 'hidden'}
            className="text-xs font-semibold tracking-[0.3em] text-[#B1A490] uppercase mb-4 text-center"
          >
            Design Flow
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" animate={solutionsInView ? 'show' : 'hidden'} custom={1}
            className="font-[var(--font-merriweather)] text-3xl md:text-4xl font-bold text-[#181C23] text-center mb-20"
          >
            From insight, solutions emerge.
          </motion.h2>

          {/* Node diagram */}
          <div className="flex flex-col items-center gap-8">
            {/* Central Design Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={solutionsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, ease }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-20 h-20 rounded-full border-2 border-[#181C23] bg-[#181C23]/5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-[#181C23]" fill="none" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-widest text-[#181C23] uppercase">Design</span>
            </motion.div>

            {/* Arrow down */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={solutionsInView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3, ease }}
              className="flex flex-col items-center gap-1 origin-top"
            >
              <div className="w-px h-8 bg-[#B1A490]" />
              <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-[#B1A490] -mt-2" />
            </motion.div>

            {/* Innovative Solutions label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5, ease }}
              className="px-6 py-2 border border-[#B1A490]/40 rounded-full"
            >
              <span className="text-xs tracking-[0.2em] text-[#B1A490] uppercase font-medium">Innovative Solutions</span>
            </motion.div>

            {/* Arrow down */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={solutionsInView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.7, ease }}
              className="flex flex-col items-center gap-1 origin-top"
            >
              <div className="w-px h-8 bg-[#B1A490]" />
              <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-[#B1A490] -mt-2" />
            </motion.div>

            {/* 4 solution nodes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-2xl">
              {solutions.map((s, i) => (
                <Node
                  key={i}
                  label={s}
                  color={solutionColors[i]}
                  delay={0.8 + i * 0.12}
                  inView={solutionsInView}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. FINAL IMPACT
      ═══════════════════════════════════════════════════════════ */}
      <section ref={finalRef} className="py-32 bg-[#F5F4F1] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            variants={fadeIn} initial="hidden" animate={finalInView ? 'show' : 'hidden'}
            className="text-xs font-semibold tracking-[0.3em] text-[#B1A490] uppercase mb-4"
          >
            The Outcome
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" animate={finalInView ? 'show' : 'hidden'} custom={1}
            className="font-[var(--font-merriweather)] text-3xl md:text-4xl font-bold text-[#181C23] mb-16"
          >
            Every decision leads to lasting impact.
          </motion.h2>

          {/* Outcome nodes */}
          <div className="flex items-center justify-center gap-16 mb-20">
            <Node label={data.outcome1} color="#C9A24D" delay={0.3} inView={finalInView} size="lg" />

            {/* Connecting line */}
            <motion.div
              className="flex-1 max-w-32 h-px bg-gradient-to-r from-[#C9A24D] to-[#5B8C5A]"
              initial={{ scaleX: 0, originX: 0 }}
              animate={finalInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease }}
            />

            <Node label={data.outcome2} color="#5B8C5A" delay={0.5} inView={finalInView} size="lg" />
          </div>

          {/* Final message */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={finalInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.8, ease }}
          >
            <div className="w-12 h-0.5 bg-[#B1A490] mx-auto mb-8" />
            {data.finalMessage.split('\n').map((line, i) => (
              <p
                key={i}
                className={`font-[var(--font-merriweather)] ${i === 0
                  ? 'text-2xl md:text-3xl font-bold text-[#181C23]'
                  : 'text-2xl md:text-3xl font-bold text-[#B1A490]'
                  } leading-snug`}
              >
                {line}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
