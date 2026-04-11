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

        <div className="max-w-6xl mx-auto px-10 md:px-20 py-24 w-full grid md:grid-cols-[1fr_480px] gap-16 items-center">

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
              <div className="relative w-full" style={{ aspectRatio: '1 / 1', filter: 'drop-shadow(0 0 40px rgba(91,138,91,0.25))' }}>
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
          SECTION 3 — DESIGN FLOW DIAGRAM  (dark premium)
      ══════════════════════════════════════════════════════════ */}
      {data.diagramImage && (
        <section className="relative overflow-hidden" style={{ background: '#080C10' }}>

          {/* Top gradient bridge from section 2 */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #0D1117, transparent)' }} />

          {/* Ambient glow — left gold */}
          <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,162,77,0.07) 0%, transparent 60%)' }} />

          {/* Ambient glow — right green */}
          <div className="absolute bottom-1/3 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(91,138,91,0.08) 0%, transparent 60%)' }} />

          {/* Subtle dot-grid texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A24D 30%, #5B8A5B 70%, transparent)' }} />

          <div className="relative max-w-6xl mx-auto px-10 md:px-16 py-28">

            {/* Header */}
            <div className="text-center mb-20">
              {/* Eyebrow row */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #C9A24D)' }} />
                <p className="text-[#C9A24D] text-[10px] tracking-[0.45em] uppercase font-semibold font-[var(--font-open-sans)]">
                  Design Flow
                </p>
                <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #C9A24D)' }} />
              </div>

              <h2 className="font-[var(--font-franklin-gothic)] text-white font-bold mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', textShadow: '0 0 60px rgba(91,138,91,0.3)' }}>
                From insight to outcome.
              </h2>

              <p className="text-gray-500 text-sm font-[var(--font-open-sans)] max-w-md mx-auto leading-relaxed">
                Every design decision traces a deliberate path — from nature and humanity to resilient, meaningful outcomes.
              </p>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="h-px w-24" style={{ background: 'linear-gradient(to right, transparent, rgba(91,138,91,0.5))' }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5B8A5B', boxShadow: '0 0 8px rgba(91,138,91,0.8)' }} />
                <div className="h-px w-24" style={{ background: 'linear-gradient(to left, transparent, rgba(91,138,91,0.5))' }} />
              </div>
            </div>

            {/* Diagram frame */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-[1px] rounded-3xl pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(201,162,77,0.3), rgba(91,138,91,0.2), rgba(201,162,77,0.1))', filter: 'blur(1px)' }} />

              {/* Corner accents */}
              <div className="absolute -top-[1px] -left-[1px] w-8 h-8 rounded-tl-3xl border-t-2 border-l-2 border-[#C9A24D]" />
              <div className="absolute -top-[1px] -right-[1px] w-8 h-8 rounded-tr-3xl border-t-2 border-r-2 border-[#5B8A5B]" />
              <div className="absolute -bottom-[1px] -left-[1px] w-8 h-8 rounded-bl-3xl border-b-2 border-l-2 border-[#5B8A5B]" />
              <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 rounded-br-3xl border-b-2 border-r-2 border-[#C9A24D]" />

              {/* Inner card */}
              <div className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 0 80px rgba(91,138,91,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>

                {/* Top inner bar */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C9A24D', boxShadow: '0 0 6px rgba(201,162,77,0.6)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#5B8A5B', boxShadow: '0 0 6px rgba(91,138,91,0.6)' }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10 rounded-full" />
                  <span className="ml-3 text-[10px] tracking-[0.3em] text-white/20 uppercase font-[var(--font-open-sans)]">
                    criteria design flow
                  </span>
                </div>

                {/* Diagram image */}
                <div className="relative px-10 py-12 md:px-16 md:py-16"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)' }}>
                  <img
                    src={data.diagramImage}
                    alt="Design flow diagram"
                    className="w-full h-auto object-contain"
                    style={{ filter: 'drop-shadow(0 0 40px rgba(91,138,91,0.15)) brightness(1.05) contrast(1.02)' }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom label row */}
            <div className="flex justify-center gap-10 mt-12">
              {['Nature', 'Innovation', 'Sustainability', 'Resilience'].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full"
                    style={{ background: i % 2 === 0 ? '#5B8A5B' : '#C9A24D', boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(91,138,91,0.7)' : 'rgba(201,162,77,0.7)'}` }} />
                  <span className="text-[10px] tracking-[0.25em] text-gray-600 uppercase font-[var(--font-open-sans)]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, #5B8A5B 40%, #C9A24D 60%, transparent)' }} />
        </section>
      )}

      <Footer />
    </div>
  )
}
