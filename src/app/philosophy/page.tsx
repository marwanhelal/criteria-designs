'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, useInView } from 'framer-motion'

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
  diagramImage: string | null
}

const DEFAULTS: PhilosophyData = {
  heroTitle: 'Our Philosophy',
  heroSubtitle: 'what we believe in',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment leading to being the most effective element to human efficiency.',
  introImage: null,
  humanTitle: 'HUMAN',
  humanDescription: 'human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'as well as environmental measures such as weather, geography and energy.',
  envImage: null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'and finally cultural values such as social and economic ones.',
  cultureImage: null,
  diagramImage: null,
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function PhilosophyPage() {
  const [data, setData] = useState<PhilosophyData>(DEFAULTS)

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : DEFAULTS)
      .then((d: Partial<PhilosophyData>) => setData({ ...DEFAULTS, ...d }))
      .catch(() => {})
  }, [])

  const sec2Ref   = useRef<HTMLElement>(null)
  const sec3Ref   = useRef<HTMLElement>(null)
  const sec2In    = useInView(sec2Ref, { once: true, amount: 0.1 })
  const sec3In    = useInView(sec3Ref, { once: true, amount: 0.1 })

  const foundations = [
    { num: '01', title: data.humanTitle,   desc: data.humanDescription,   img: data.humanImage,   color: '#C9A24D', glow: 'rgba(201,162,77,0.35)' },
    { num: '02', title: data.envTitle,     desc: data.envDescription,     img: data.envImage,     color: '#5B8A5B', glow: 'rgba(91,138,91,0.35)'  },
    { num: '03', title: data.cultureTitle, desc: data.cultureDescription, img: data.cultureImage, color: '#B1A490', glow: 'rgba(177,164,144,0.35)' },
  ]

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HERO INTRO
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative pt-[var(--nav-h)] min-h-[88vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(177,164,144,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(177,164,144,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      >
        {/* Left green accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#5B8A5B] to-transparent opacity-60" />

        {/* Soft radial glow top-left */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,138,91,0.07) 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl mx-auto px-10 md:px-16 py-24 w-full grid md:grid-cols-[1fr_380px] gap-16 items-center">

          {/* Left */}
          <div>
            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <motion.div
                className="h-px bg-[#5B8A5B]"
                initial={{ width: 0 }} animate={{ width: 32 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              />
              <span className="text-[#5B8A5B] text-xs tracking-[0.35em] uppercase font-semibold font-[var(--font-open-sans)]">
                {data.heroSubtitle}
              </span>
            </motion.div>

            {/* Main title */}
            <div className="overflow-hidden mb-10">
              <motion.h1
                className="font-[var(--font-franklin-gothic)] font-bold text-[#181C23] leading-[0.9] tracking-tight"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
              >
                {data.heroTitle.split(' ').map((word, i) => (
                  <span key={i} className={i === data.heroTitle.split(' ').length - 1 ? 'relative inline-block' : 'block'}>
                    {word}
                    {i === data.heroTitle.split(' ').length - 1 && (
                      <motion.span
                        className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full"
                        style={{ background: '#5B8A5B', boxShadow: '0 0 14px rgba(91,138,91,0.9), 0 0 28px rgba(91,138,91,0.5)' }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.7, ease }}
                      />
                    )}
                  </span>
                ))}
              </motion.h1>
            </div>

            {/* Body text */}
            <motion.p
              className="text-[#555] font-[var(--font-open-sans)] text-base md:text-lg leading-[1.9] max-w-[520px]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease }}
            >
              {data.introText}
            </motion.p>

            {/* Scroll hint */}
            <motion.div
              className="flex items-center gap-3 mt-12"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <motion.div
                className="w-px h-12 bg-gradient-to-b from-[#5B8A5B] to-transparent"
                animate={{ scaleY: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
              <span className="text-[10px] tracking-[0.3em] text-[#B1A490] uppercase">Scroll to explore</span>
            </motion.div>
          </div>

          {/* Right: intro image */}
          {data.introImage && (
            <motion.div
              className="hidden md:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease }}
            >
              <div
                className="relative w-72 h-72"
                style={{ filter: 'drop-shadow(0 0 24px rgba(91,138,91,0.25))' }}
              >
                <Image src={data.introImage} alt="Philosophy diagram" fill className="object-contain" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B1A490]/40 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — THREE FOUNDATIONS  (dark premium)
      ══════════════════════════════════════════════════════════ */}
      <section ref={sec2Ref} className="relative overflow-hidden" style={{ background: '#0D1117' }}>

        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,138,91,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,162,77,0.06) 0%, transparent 70%)' }} />

        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #5B8A5B, #C9A24D, #5B8A5B, transparent)' }}
          initial={{ scaleX: 0 }} animate={sec2In ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease }}
        />

        <div className="max-w-6xl mx-auto px-10 md:px-16 py-24">

          {/* Section header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 24 }} animate={sec2In ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-[#5B8A5B] text-xs tracking-[0.4em] uppercase font-semibold mb-4 font-[var(--font-open-sans)]">
              The Three Foundations
            </p>
            <h2 className="font-[var(--font-franklin-gothic)] text-white text-3xl md:text-4xl font-bold">
              Every great design begins with understanding.
            </h2>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 relative">

            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[calc(33.3%+1rem)] right-[calc(33.3%+1rem)] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(91,138,91,0.3), rgba(201,162,77,0.3))' }} />

            {foundations.map((f, i) => (
              <motion.div
                key={f.num}
                className="relative rounded-2xl p-8 flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={sec2In ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease }}
                whileHover={{
                  borderColor: f.glow.replace('0.35', '0.5'),
                  boxShadow: `0 0 32px ${f.glow}, inset 0 0 32px ${f.glow.replace('0.35', '0.03')}`,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Number badge */}
                <span className="text-xs font-bold tracking-widest mb-6 font-[var(--font-open-sans)]"
                  style={{ color: f.color, opacity: 0.7 }}>
                  {f.num}
                </span>

                {/* Icon */}
                {f.img && (
                  <motion.div
                    className="mb-6 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `rgba(255,255,255,0.04)`,
                      border: `1px solid ${f.glow}`,
                    }}
                    animate={sec2In ? {
                      boxShadow: [
                        `0 0 10px ${f.glow}`,
                        `0 0 22px ${f.glow.replace('0.35', '0.5')}`,
                        `0 0 10px ${f.glow}`,
                      ],
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.5, ease: 'easeInOut' }}
                  >
                    <div className="relative w-12 h-12">
                      <Image src={f.img} alt={f.title} fill className="object-contain" />
                    </div>
                  </motion.div>
                )}

                {/* Title */}
                <h3 className="font-[var(--font-franklin-gothic)] text-white text-2xl font-bold tracking-wider mb-3"
                  style={{ textShadow: `0 0 20px ${f.glow}` }}>
                  {f.title}
                </h3>

                {/* Divider */}
                <div className="w-8 h-[2px] mb-4 rounded-full" style={{ background: f.color }} />

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed font-[var(--font-open-sans)]">
                  {f.desc}
                </p>

                {/* Bottom glow dot */}
                <div className="absolute bottom-6 right-6 w-1.5 h-1.5 rounded-full"
                  style={{ background: f.color, boxShadow: `0 0 8px ${f.glow}` }} />
              </motion.div>
            ))}
          </div>

          {/* & connectors row (decorative) */}
          <motion.div
            className="flex justify-center items-center gap-16 mt-16"
            initial={{ opacity: 0 }} animate={sec2In ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7, ease }}
          >
            {['HUMAN', '&', 'ENVIRONMENTAL', '&', 'CULTURE'].map((w, i) => (
              <span key={i} className={
                w === '&'
                  ? 'text-2xl font-light text-[#5B8A5B]'
                  : 'text-[10px] tracking-[0.3em] text-gray-600 uppercase font-[var(--font-open-sans)]'
              }>
                {w}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A24D, #5B8A5B, #C9A24D, transparent)' }}
          initial={{ scaleX: 0 }} animate={sec2In ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — DESIGN FLOW DIAGRAM
      ══════════════════════════════════════════════════════════ */}
      {data.diagramImage && (
        <section ref={sec3Ref} className="relative bg-[#F8F7F4] overflow-hidden">

          {/* Subtle background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ background: 'radial-gradient(ellipse at center, rgba(91,138,91,0.05) 0%, transparent 65%)' }}
              className="w-full h-full absolute" />
          </div>

          <div className="relative max-w-5xl mx-auto px-10 md:px-16 py-24">

            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }} animate={sec3In ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
            >
              <p className="text-[#5B8A5B] text-xs tracking-[0.4em] uppercase font-semibold mb-3 font-[var(--font-open-sans)]">
                Design Flow
              </p>
              <h2 className="font-[var(--font-franklin-gothic)] text-[#181C23] text-3xl md:text-4xl font-bold mb-4">
                From insight to outcome.
              </h2>
              <div className="w-12 h-[2px] bg-[#5B8A5B] mx-auto rounded-full"
                style={{ boxShadow: '0 0 10px rgba(91,138,91,0.6)' }} />
            </motion.div>

            {/* Diagram */}
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'white',
                boxShadow: '0 4px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(177,164,144,0.15)',
              }}
              initial={{ opacity: 0, y: 24 }} animate={sec3In ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <img
                src={data.diagramImage}
                alt="Design flow diagram"
                className="w-full h-auto object-contain p-8 md:p-12"
              />
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
