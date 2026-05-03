'use client'

import { useEffect, useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, useScroll, useTransform } from 'framer-motion'

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
  humanTitle: 'Human',
  humanDescription: 'Human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null,
  envTitle: 'Environmental',
  envDescription: 'Environmental measures such as weather, geography and energy.',
  envImage: null,
  cultureTitle: 'Culture',
  cultureDescription: 'Cultural values such as social and economic ones.',
  cultureImage: null,
  diagramImage: null,
}

const ease = [0.22, 1, 0.36, 1] as const

export default function PhilosophyPage() {
  const [data, setData] = useState<PhilosophyData>(DEFAULTS)
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const decorativeY  = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const contentY     = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const heroOpacity  = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : DEFAULTS)
      .then((d: Partial<PhilosophyData>) => setData({ ...DEFAULTS, ...d }))
      .catch(() => {})
  }, [])

  const foundations = [
    { num: 'I',   title: data.humanTitle,   desc: data.humanDescription,   img: data.humanImage },
    { num: 'II',  title: data.envTitle,     desc: data.envDescription,     img: data.envImage },
    { num: 'III', title: data.cultureTitle, desc: data.cultureDescription, img: data.cultureImage },
  ]

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0E1118' }}>

        {/* Faint decorative word — moves fastest (floats away) */}
        <motion.div
          style={{ y: decorativeY }}
          className="absolute right-0 inset-y-0 flex items-center overflow-hidden pointer-events-none select-none pr-[clamp(1rem,4vw,6rem)]"
        >
          <span
            className="font-[var(--font-playfair)] italic leading-none text-white/[0.025]"
            style={{ fontSize: 'clamp(100px, 18vw, 300px)' }}
          >
            {data.heroTitle.split(' ').pop()}
          </span>
        </motion.div>

        {/* Vertical accent line */}
        <div
          className="absolute left-[clamp(1rem,4vw,7rem)] top-[15%] bottom-[15%] w-px pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(177,164,144,0.2) 30%, rgba(177,164,144,0.2) 70%, transparent)' }}
        />

        {/* Content — moves slower, fades out */}
        <motion.div
          style={{ y: contentY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-[1380px] mx-auto px-[clamp(2.5rem,7vw,10rem)] py-[clamp(7rem,12vw,14rem)]"
        >

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="w-7 h-px bg-[#B1A490]" />
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">
              {data.heroSubtitle}
            </span>
          </motion.div>

          {/* Title */}
          <div style={{ lineHeight: 0.9 }} className="mb-10">
            {data.heroTitle.split(' ').map((word, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.1 + i * 0.12, ease }}
              >
                <span
                  className="block font-[var(--font-playfair)] italic text-white"
                  style={{ fontSize: 'clamp(64px, 10vw, 148px)', fontWeight: 900 }}
                >
                  {word}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Intro text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-[var(--font-merriweather)] text-white/50 leading-[1.95] max-w-[520px]"
            style={{ fontSize: 'clamp(13px, 1vw, 15px)', fontWeight: 300 }}
          >
            {data.introText}
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-3 mt-12"
          >
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-[#B1A490] to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <span className="font-[var(--font-libre-franklin)] text-[10px] tracking-[3px] text-[#B1A490]/50 uppercase">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(177,164,144,0.2), transparent)' }} />
      </section>

      {/* ══ PHILOSOPHY STATEMENT ══════════════════════════════════════════════ */}
      <section data-navbar-dark className="w-full bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,8vw,11rem)]">

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-3 mb-14"
          >
            <span className="w-7 h-px bg-[#B1A490]" />
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">CDG Philosophy</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-[clamp(2rem,6vw,8rem)] gap-y-10">
            <motion.p
              className="font-[var(--font-merriweather)] text-[#4A4845] leading-[2]"
              style={{ fontSize: 'clamp(13px, 1vw, 15px)', fontWeight: 300, borderLeft: '2px solid #B1A490', paddingLeft: '1.5rem' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease }}
            >
              CDG Philosophy proceeds from our awareness that we contribute to an integral aspect of life, which is design, resulting into an urban and architectural output. Knowing the fact that architectural design is not the same as the rest of arts, having the effect of touching everyone around and not just the interested ones, we developed our passion to our philosophy.
            </motion.p>

            <motion.p
              className="font-[var(--font-merriweather)] text-[#4A4845] leading-[2]"
              style={{ fontSize: 'clamp(13px, 1vw, 15px)', fontWeight: 300, borderLeft: '2px solid rgba(177,164,144,0.25)', paddingLeft: '1.5rem' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              We believe that constructional and architectural products constitute the borders to all human activities. Our philosophy is reflected in what we call the{' '}
              <span className="text-[#B1A490]">Values Trilogy</span>
              {' '}— forming a strong correlation between artistic, environmental and cultural values, creating an innovative outcome that mirrors upon a happier life with increased loyalty to our habitation.
            </motion.p>
          </div>

          {/* Values Trilogy */}
          <motion.div
            className="mt-16 flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.07)' }} />
            <span className="font-[var(--font-libre-franklin)] text-[10px] tracking-[4px] uppercase text-[#B1A490]">Values Trilogy</span>
            <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.07)' }} />
          </motion.div>

          <motion.div
            className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto text-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {['Artistic', 'Environmental', 'Cultural'].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B1A490]" />
                <span className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[2px] text-[#9A9A94]">{v}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ THREE PILLARS ═════════════════════════════════════════════════════ */}
      <section className="w-full overflow-hidden" style={{ background: '#181C23' }}>
        <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,8vw,11rem)]">

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-3 mb-[clamp(3rem,5vw,7rem)]"
          >
            <span className="w-7 h-px bg-[#B1A490]" />
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">The Three Pillars</span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
            {foundations.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
                className="flex flex-col p-[clamp(2rem,4vw,5rem)]"
                style={{ background: '#181C23' }}
              >
                {/* Roman numeral */}
                <span
                  className="font-[var(--font-playfair)] italic text-[#B1A490]/15 leading-none mb-8 block"
                  style={{ fontSize: 'clamp(72px, 8vw, 110px)', fontWeight: 900 }}
                >
                  {f.num}
                </span>

                <div className="w-8 h-px bg-[#B1A490] mb-8" />

                {f.img && (
                  <div className="w-12 h-12 mb-6 flex-shrink-0">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="w-full h-full object-contain"
                      style={{ filter: 'brightness(0) invert(1) opacity(0.5)' }}
                    />
                  </div>
                )}

                <h3
                  className="font-[var(--font-playfair)] italic text-white mb-5"
                  style={{ fontSize: 'clamp(22px, 2.2vw, 32px)' }}
                >
                  {f.title}
                </h3>

                <p
                  className="font-[var(--font-merriweather)] text-white/50 leading-[1.95]"
                  style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', fontWeight: 300 }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DIAGRAM ═══════════════════════════════════════════════════════════ */}
      {data.diagramImage && (
        <section data-navbar-dark className="w-full bg-white overflow-hidden">
          <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,8vw,11rem)]">

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3 mb-14"
            >
              <span className="w-7 h-px bg-[#B1A490]" />
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">Design Flow</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(177,164,144,0.12)' }}
            >
              <img src={data.diagramImage} alt="Design flow diagram" className="w-full h-auto object-contain" />
            </motion.div>
          </div>
        </section>
      )}

      {/* ══ VISION & MISSION ══════════════════════════════════════════════════ */}
      <section data-navbar-dark className="w-full overflow-hidden bg-[#FAFAF8]">
        <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,8vw,11rem)]">

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-3 mb-[clamp(3rem,5vw,6rem)]"
          >
            <span className="w-7 h-px bg-[#B1A490]" />
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">Who We Are</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-[clamp(1rem,2vw,3rem)]">

            {/* Vision */}
            <motion.div
              className="relative bg-white rounded-2xl p-[clamp(2rem,4vw,5rem)] overflow-hidden"
              style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(177,164,144,0.12)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-[#B1A490]" />

              <div className="flex items-center gap-3 mb-8">
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">01</span>
                <span className="w-6 h-px bg-[#B1A490]/30" />
              </div>

              <h3
                className="font-[var(--font-playfair)] italic text-[#181C23] mb-6"
                style={{ fontSize: 'clamp(32px, 3.5vw, 48px)' }}
              >
                Vision
              </h3>
              <div className="w-8 h-px bg-[#B1A490] mb-8" />
              <p
                className="font-[var(--font-merriweather)] text-[#4A4845] leading-[1.95]"
                style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', fontWeight: 300 }}
              >
                As we move towards our goal of becoming a world class Architect &amp; Design pioneer, our aim is to provide people with ultimate creative design solutions that lead to a happier life which reflects the identity and promotes loyalty.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              className="relative rounded-2xl p-[clamp(2rem,4vw,5rem)] overflow-hidden"
              style={{ background: '#181C23', boxShadow: '0 4px 40px rgba(0,0,0,0.15)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-[#B1A490]" />

              <div className="flex items-center gap-3 mb-8">
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">02</span>
                <span className="w-6 h-px bg-[#B1A490]/30" />
              </div>

              <h3
                className="font-[var(--font-playfair)] italic text-white mb-6"
                style={{ fontSize: 'clamp(32px, 3.5vw, 48px)' }}
              >
                Mission
              </h3>
              <div className="w-8 h-px bg-[#B1A490] mb-8" />
              <p
                className="font-[var(--font-merriweather)] text-white/60 leading-[1.95]"
                style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', fontWeight: 300 }}
              >
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
