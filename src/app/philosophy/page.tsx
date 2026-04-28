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
    <div className="bg-white overflow-x-hidden" data-navbar-dark>
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
              <div className="relative w-[120%]" style={{ aspectRatio: '1 / 1', filter: 'drop-shadow(0 0 40px rgba(91,138,91,0.25))' }}>
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
          SECTION 1B — CDG PHILOSOPHY TWO-COLUMN TEXT
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#181C23] overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(177,164,144,1) 1px, transparent 1px), linear-gradient(90deg, rgba(177,164,144,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

        <div className="relative max-w-6xl mx-auto px-10 md:px-20 py-20 md:py-28">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-[#5B8A5B]" />
            <span className="text-[#5B8A5B] text-[11px] tracking-[0.35em] uppercase font-semibold font-[var(--font-open-sans)]">
              CDG Philosophy
            </span>
          </div>

          {/* Two-column text */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <motion.p
              className="text-white/70 font-[var(--font-open-sans)] text-[0.97rem] md:text-[1.05rem] leading-[2] border-l-2 border-[#5B8A5B] pl-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease }}
            >
              CDG Philosophy proceeds from our awareness that we contribute to an integral aspect of life, which is design, resulting into an urban and architectural output. Knowing the fact that architectural design is not the same as the rest of arts, having the effect of touching everyone around and not just the interested ones, we developed our passion to our philosophy. We believe that constructional and architectural products constitute the borders to all human activities as well as being one of the main effective optical components to the surrounding environment. This results in being the most effective element to human efficiency and the source of sensing the environment identity and its beauty.
            </motion.p>

            <motion.p
              className="text-white/70 font-[var(--font-open-sans)] text-[0.97rem] md:text-[1.05rem] leading-[2] border-l-2 border-[#C9A24D] pl-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              Concluding the robust bond between the human being and architecture, our philosophy is reflected in what we call the <span className="text-[#C9A24D] font-semibold">Values Trilogy</span> — forming a strong correlation between human basic spiritual and materialistic needs starting by artistic values such as arty and practical ones, as well as environmental values such as weather, geography and energy, and finally cultural values such as social and economic ones. Our theory summed up in our trilogy forms an innovative outcome that mirrors upon a happier life with increased loyalty to our habitation.
            </motion.p>
          </div>

          {/* Values Trilogy label */}
          <motion.div
            className="mt-14 flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[#C9A24D] text-[11px] tracking-[0.4em] uppercase font-[var(--font-open-sans)] font-semibold">
              Values Trilogy
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </motion.div>

          {/* Three values inline */}
          <motion.div
            className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
          >
            {[
              { label: 'Artistic Values', color: '#C9A24D' },
              { label: 'Environmental Values', color: '#5B8A5B' },
              { label: 'Cultural Values', color: '#B1A490' },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                <span className="font-[var(--font-open-sans)] text-[11px] uppercase tracking-[0.2em] font-semibold" style={{ color: v.color }}>
                  {v.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — THREE FOUNDATIONS  (clean light)
      ══════════════════════════════════════════════════════════ */}
      <section ref={sec2Ref} className="relative bg-white overflow-hidden">

        {/* Top green border line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, #5B8A5B 60%, #C9A24D 100%)' }} />

        <div className="max-w-6xl mx-auto px-10 md:px-20 py-20 md:py-28">

          {/* Three columns with & separators */}
          <div className="grid md:grid-cols-[1fr_80px_1fr_80px_1fr] items-start gap-0">
            {foundations.map((f, i) => (
              <>
                {/* Foundation column */}
                <motion.div key={f.num}
                  className="flex flex-col items-center text-center px-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={sec2In ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15, ease }}
                >
                  {/* Icon */}
                  <div className="mb-8 w-28 h-28 flex items-center justify-center">
                    {f.img
                      ? <img src={f.img} alt={f.title} className="w-full h-full object-contain" />
                      : <div className="w-20 h-20 rounded-full border-2 border-dashed" style={{ borderColor: f.color + '44' }} />
                    }
                  </div>

                  {/* Title */}
                  <h3 className="font-[var(--font-franklin-gothic)] text-[#181C23] text-2xl md:text-3xl font-bold tracking-wider mb-4">
                    {f.title}
                  </h3>

                  {/* Vertical divider under title */}
                  <div className="w-px h-6 mb-4" style={{ background: f.color }} />

                  {/* Description */}
                  <p className="text-[#4A4A4A] text-sm md:text-[0.95rem] leading-[1.8] font-[var(--font-open-sans)] max-w-[220px]">
                    {f.desc}
                  </p>
                </motion.div>

                {/* & separator — only between columns */}
                {i < 2 && (
                  <motion.div
                    key={`sep-${i}`}
                    className="flex items-start justify-center pt-10"
                    initial={{ opacity: 0 }}
                    animate={sec2In ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4, ease }}
                  >
                    <span className="font-[var(--font-franklin-gothic)] text-[#5B8A5B] font-light select-none"
                      style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
                      &amp;
                    </span>
                  </motion.div>
                )}
              </>
            ))}
          </div>
        </div>

        {/* Bottom green border line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, #5B8A5B 60%, #C9A24D 100%)' }} />
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — DESIGN FLOW DIAGRAM  (clean light)
      ══════════════════════════════════════════════════════════ */}
      {data.diagramImage && (
        <section className="relative bg-white overflow-hidden">

          <div className="max-w-5xl mx-auto px-10 md:px-16 py-20 md:py-28">

            {/* Header */}
            <div className="text-center mb-14">
              <p className="text-[#5B8A5B] text-[11px] tracking-[0.4em] uppercase font-semibold mb-4 font-[var(--font-open-sans)]">
                Design Flow
              </p>
              <h2 className="font-[var(--font-franklin-gothic)] text-[#181C23] font-bold mb-5"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                From insight to outcome.
              </h2>
              <div className="w-10 h-[3px] mx-auto rounded-full" style={{ background: '#5B8A5B' }} />
            </div>

            {/* Diagram — full width, clean white card */}
            <div className="bg-white rounded-xl overflow-hidden"
              style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(177,164,144,0.18)' }}>
              <img
                src={data.diagramImage}
                alt="Design flow diagram"
                className="w-full h-auto object-contain p-8 md:p-14"
              />
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — VISION & MISSION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#FAFAF8] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, #5B8A5B 60%, #C9A24D 100%)' }} />

        <div className="max-w-6xl mx-auto px-10 md:px-20 py-20 md:py-28">

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-14"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="w-8 h-px bg-[#5B8A5B]" />
            <span className="text-[#5B8A5B] text-[11px] tracking-[0.35em] uppercase font-semibold font-[var(--font-open-sans)]">
              Who We Are
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">

            {/* Vision */}
            <motion.div
              className="relative bg-white rounded-2xl p-10 md:p-12 overflow-hidden"
              style={{ boxShadow: '0 4px 40px rgba(91,138,91,0.08), 0 0 0 1px rgba(91,138,91,0.12)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease }}
            >
              {/* Accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-[#5B8A5B]" />

              {/* Icon */}
              <div className="mb-6 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(91,138,91,0.08)', border: '1.5px solid rgba(91,138,91,0.2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B8A5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                </svg>
              </div>

              <h3 className="font-[var(--font-franklin-gothic)] text-[#181C23] font-bold text-3xl md:text-4xl mb-5 tracking-tight">
                Vision
              </h3>
              <div className="w-8 h-[2px] bg-[#5B8A5B] mb-6" />
              <p className="text-[#4A4A4A] font-[var(--font-open-sans)] text-[0.97rem] leading-[1.95]">
                As we move towards our goal of becoming a world class Architect &amp; Design pioneer, our aim is to provide people with ultimate creative design solutions that lead to a happier life which reflects the identity and promotes loyalty.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              className="relative bg-[#181C23] rounded-2xl p-10 md:p-12 overflow-hidden"
              style={{ boxShadow: '0 4px 40px rgba(201,162,77,0.10)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              {/* Accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-[#C9A24D]" />

              {/* Icon */}
              <div className="mb-6 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(201,162,77,0.1)', border: '1.5px solid rgba(201,162,77,0.25)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>

              <h3 className="font-[var(--font-franklin-gothic)] text-white font-bold text-3xl md:text-4xl mb-5 tracking-tight">
                Mission
              </h3>
              <div className="w-8 h-[2px] bg-[#C9A24D] mb-6" />
              <p className="text-white/65 font-[var(--font-open-sans)] text-[0.97rem] leading-[1.95]">
                We will invest and develop our resources to promote innovation and creativity while rendering personal needs as well as artistic, cultural and environmental values to our customers. Presenting what exceeds expectations through providing inventive architect and design solutions with excellent quality and optimum convenience.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
