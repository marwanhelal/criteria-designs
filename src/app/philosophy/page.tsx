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
  humanDescription: 'Human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'Environmental measures such as weather, geography and energy.',
  envImage: null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'Cultural values such as social and economic ones.',
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

  const sec2Ref = useRef<HTMLElement>(null)
  const sec2In  = useInView(sec2Ref, { once: true, amount: 0.1 })

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
        className="relative pt-[var(--nav-h)] min-h-[88vh] flex items-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(177,164,144,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(177,164,144,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          backgroundColor: '#FAFAF8',
        }}
      >
        {/* Left green accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: 'linear-gradient(to bottom, transparent, #5B8A5B 30%, #5B8A5B 70%, transparent)' }} />

        {/* Top-left ambient glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,138,91,0.06) 0%, transparent 65%)' }} />

        <div className="max-w-6xl mx-auto px-10 md:px-20 py-24 w-full grid md:grid-cols-[1fr_340px] gap-20 items-center">

          {/* Left — text */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-[#5B8A5B]" />
              <span className="text-[#5B8A5B] text-[11px] tracking-[0.35em] uppercase font-semibold font-[var(--font-open-sans)]">
                {data.heroSubtitle}
              </span>
            </div>

            {/* Title — NO animation wrapper, always visible */}
            <h1
              className="font-[var(--font-franklin-gothic)] font-bold text-[#181C23] leading-[0.92] tracking-tight mb-10"
              style={{ fontSize: 'clamp(3.8rem, 7.5vw, 7rem)' }}
            >
              {data.heroTitle.split(' ').map((word, i, arr) => (
                <span key={i} className="block">
                  {word}
                  {i === arr.length - 1 && (
                    <motion.span
                      className="block h-[3px] mt-3 rounded-full origin-left"
                      style={{ background: '#5B8A5B', boxShadow: '0 0 14px rgba(91,138,91,0.9), 0 0 28px rgba(91,138,91,0.4)', width: '60%' }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.9, delay: 0.3, ease }}
                    />
                  )}
                </span>
              ))}
            </h1>

            {/* Body text */}
            <p className="text-[#4A4A4A] font-[var(--font-open-sans)] text-base md:text-[1.05rem] leading-[1.95] max-w-[520px]">
              {data.introText}
            </p>

            {/* Scroll hint */}
            <div className="flex items-center gap-3 mt-12">
              <motion.div
                className="w-px h-10 bg-gradient-to-b from-[#5B8A5B] to-transparent"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
              <span className="text-[10px] tracking-[0.3em] text-[#B1A490] uppercase font-[var(--font-open-sans)]">
                Scroll to explore
              </span>
            </div>
          </div>

          {/* Right — intro image */}
          {data.introImage && (
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-72 h-72"
                style={{ filter: 'drop-shadow(0 0 30px rgba(91,138,91,0.2))' }}>
                <Image src={data.introImage} alt="Philosophy diagram" fill className="object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(177,164,144,0.4), transparent)' }} />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — THREE FOUNDATIONS  (dark premium)
      ══════════════════════════════════════════════════════════ */}
      <section ref={sec2Ref} className="relative overflow-hidden" style={{ background: '#0D1117' }}>

        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,138,91,0.07) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,162,77,0.05) 0%, transparent 65%)' }} />

        {/* Top accent line */}
        <motion.div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #5B8A5B, #C9A24D, #5B8A5B, transparent)' }}
          initial={{ scaleX: 0 }} animate={sec2In ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease }} />

        <div className="max-w-6xl mx-auto px-10 md:px-16 py-24">

          {/* Header */}
          <motion.div className="text-center mb-20"
            initial={{ opacity: 0, y: 24 }} animate={sec2In ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}>
            <p className="text-[#5B8A5B] text-[11px] tracking-[0.4em] uppercase font-semibold mb-5 font-[var(--font-open-sans)]">
              The Three Foundations
            </p>
            <h2 className="font-[var(--font-franklin-gothic)] text-white text-3xl md:text-4xl font-bold">
              Every great design begins with understanding.
            </h2>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {foundations.map((f, i) => (
              <motion.div key={f.num}
                className="relative rounded-2xl p-8 flex flex-col cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                initial={{ opacity: 0, y: 40 }}
                animate={sec2In ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease }}
                whileHover={{
                  borderColor: f.color + '55',
                  boxShadow: `0 0 36px ${f.glow}`,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Number */}
                <span className="text-xs font-bold tracking-widest mb-6 font-[var(--font-open-sans)]"
                  style={{ color: f.color, opacity: 0.6 }}>{f.num}</span>

                {/* Icon */}
                {f.img && (
                  <motion.div className="mb-6 w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${f.glow}` }}
                    animate={sec2In ? {
                      boxShadow: [`0 0 10px ${f.glow}`, `0 0 24px ${f.glow.replace('0.35','0.55')}`, `0 0 10px ${f.glow}`],
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.5, ease: 'easeInOut' }}>
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
                <p className="text-gray-400 text-sm leading-relaxed font-[var(--font-open-sans)]">{f.desc}</p>

                {/* Glow dot */}
                <div className="absolute bottom-6 right-6 w-1.5 h-1.5 rounded-full"
                  style={{ background: f.color, boxShadow: `0 0 8px ${f.glow}` }} />
              </motion.div>
            ))}
          </div>

          {/* & row */}
          <motion.div className="flex justify-center items-center gap-14 mt-16"
            initial={{ opacity: 0 }} animate={sec2In ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7, ease }}>
            {['HUMAN', '&', 'ENVIRONMENTAL', '&', 'CULTURE'].map((w, i) => (
              <span key={i} className={w === '&'
                ? 'text-2xl font-light text-[#5B8A5B]'
                : 'text-[10px] tracking-[0.3em] text-gray-600 uppercase font-[var(--font-open-sans)]'}>
                {w}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A24D, #5B8A5B, #C9A24D, transparent)' }}
          initial={{ scaleX: 0 }} animate={sec2In ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease }} />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — DESIGN FLOW DIAGRAM
          Note: animate always to visible — no sec3In dependency
      ══════════════════════════════════════════════════════════ */}
      {data.diagramImage && (
        <section className="relative bg-[#F8F7F4] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(91,138,91,0.05) 0%, transparent 65%)' }} />

          <div className="relative max-w-5xl mx-auto px-10 md:px-16 py-24">

            {/* Header */}
            <div className="text-center mb-16">
              <p className="text-[#5B8A5B] text-[11px] tracking-[0.4em] uppercase font-semibold mb-3 font-[var(--font-open-sans)]">
                Design Flow
              </p>
              <h2 className="font-[var(--font-franklin-gothic)] text-[#181C23] text-3xl md:text-4xl font-bold mb-5">
                From insight to outcome.
              </h2>
              <div className="w-12 h-[2px] bg-[#5B8A5B] mx-auto rounded-full"
                style={{ boxShadow: '0 0 10px rgba(91,138,91,0.6)' }} />
            </div>

            {/* Diagram — always visible, no inView dependency */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'white', boxShadow: '0 4px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(177,164,144,0.15)' }}>
              <img
                src={data.diagramImage}
                alt="Design flow diagram"
                className="w-full h-auto object-contain p-8 md:p-12"
              />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
