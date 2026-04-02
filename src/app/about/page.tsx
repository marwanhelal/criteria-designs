'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, useInView } from 'framer-motion'
import { Eye, Target, Layers } from 'lucide-react'

interface Settings {
  companyNameEn?: string
  phone?: string | null
  aboutIntroText?: string | null
  aboutCol1Text?: string | null
  aboutCol2Text?: string | null
  aboutCol2Text2?: string | null
  aboutImage?: string | null
  aboutImageCaption?: string | null
  aboutMissionText?: string | null
  aboutVisionText?: string | null
  aboutServicesText?: string | null
  aboutStat1Number?: string | null
  aboutStat1Label?: string | null
  aboutStat2Number?: string | null
  aboutStat2Label?: string | null
  aboutStat3Number?: string | null
  aboutStat3Label?: string | null
  aboutStat4Number?: string | null
  aboutStat4Label?: string | null
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
}

// Animated counter for stats
function AnimatedCounter({ target, inView }: { target: string; inView: boolean }) {
  const match = target.match(/^(\d+)(.*)$/)
  const num = match ? parseInt(match[1]) : 0
  const suffix = match ? match[2] : ''
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || num === 0) return
    let frame: number
    const start = performance.now()
    const duration = 1800
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * num))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, num])

  return <>{count}{suffix}</>
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings>({})
  const statsRef = useRef<HTMLElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : {})
      .then(data => { if (data && typeof data === 'object') setSettings(data) })
      .catch(() => {})
  }, [])

  const featureImage = settings.aboutImage
  const introText = settings.aboutIntroText || 'Criteria Design Group – CDG – is a multidisciplinary architecture, interior designing, landscaping and urban planning company. The company was first founded in 2007 under the name ICE – International Consultancy Engineering – and then was relaunched in 2013 with its new identity holding a uniquely new concept as reflected in its present name, Criteria Design Group.'
  const col1Text = settings.aboutCol1Text || 'We mainly operate from Egypt having our Head office located in Maadi, Cairo. CDG Experts have been in the field for more than fifteen years, working in different architectural and design projects to private and governmental entities on various scopes and sizes. From the humble beginnings of Criteria Design Group, we have had the vision to push boundaries and seek new solutions.'
  const col2Text = settings.aboutCol2Text || 'We believe that we have a great duty towards our customers as we know that we can contribute an integral part of everyone\'s life as we build their everyday territories, whether they are residential, corporate, or even their getaways.'
  const col2Text2 = settings.aboutCol2Text2 || 'A very important aspect that constitutes the main pillar of our work is the surrounding environment and its effect on the design and the convenience of the project; represented in the climate, location, and cultural cores. At CDG, we align our resources in which we merge our expertise and technical knowledge into creative experimentation to come up with our inventive and customised design solutions.'
  const imageCaption = settings.aboutImageCaption || 'Designs That Add Value'
  const missionText = settings.aboutMissionText || 'To create innovative, sustainable, and aesthetically compelling architectural solutions that enhance the quality of life for our clients and communities.'
  const visionText = settings.aboutVisionText || 'To be the most trusted and respected architecture firm in the region, known for transforming spaces into extraordinary experiences.'
  const servicesText = settings.aboutServicesText || 'CDG is a multifaceted company that delivers all types of designs such as residential, hospitality, corporates, educational institutes, and leisure and entertainment constructions. We are committed to delivering the best-desired results using the latest tools in the market. Our associates regularly attend technical conferences and workshops for continuous education and updates for a better service to our clients.'

  const stats = [
    { n: settings.aboutStat1Number || '15+', l: settings.aboutStat1Label || 'Years of Experience' },
    { n: settings.aboutStat2Number || '500+', l: settings.aboutStat2Label || 'Projects Completed' },
    { n: settings.aboutStat3Number || '12+', l: settings.aboutStat3Label || 'Countries' },
    { n: settings.aboutStat4Number || '150+', l: settings.aboutStat4Label || 'Team Members' },
  ]

  return (
    <>
      <Navbar />

      {/* ── spacer for fixed navbar ── */}
      <div style={{ height: 'clamp(68px,6vw,100px)' }} />

      <main className="bg-white" data-navbar-dark>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Page heading
        ═══════════════════════════════════════════════ */}
        <section className="relative px-[clamp(1.5rem,6vw,9rem)] pt-12 pb-0 border-b border-[#DEDAD4] overflow-hidden">

          {/* Architectural grid decoration — top-right corner */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.045] pointer-events-none select-none">
            <svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
              {[0,32,64,96,128,160,192].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="192" stroke="#111" strokeWidth="0.6"/>
              ))}
              {[0,32,64,96,128,160,192].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="192" y2={y} stroke="#111" strokeWidth="0.6"/>
              ))}
              {/* Diagonal accent */}
              <line x1="0" y1="0" x2="192" y2="192" stroke="#B1A490" strokeWidth="0.5"/>
            </svg>
          </div>

          <motion.div variants={fadeUp} initial="hidden" animate="show"
            className="flex items-start justify-between gap-6 pb-8">
            {/* Title */}
            <div>
              <p className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[5px] text-[#B1A490] mb-3">
                Company Profile
              </p>
              <h1 className="font-[family-name:var(--font-franklin-gothic)] font-bold text-[#111] leading-[1.0]"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
                About CDG
              </h1>
              {/* Decorative accent line under heading */}
              <div className="flex items-center gap-3 mt-5">
                <div className="w-10 h-px bg-[#B1A490]" />
                <span className="text-[#B1A490]/60 text-[10px] tracking-[4px] font-[var(--font-libre-franklin)]">✦</span>
                <div className="w-4 h-px bg-[#B1A490]/40" />
              </div>
            </div>
            {/* Website URL — top right */}
            <p className="font-[var(--font-libre-franklin)] text-[10px] tracking-[1px] text-[#AEABA5] mt-2 hidden sm:block shrink-0">
              www.criteriadesigns.com
            </p>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Full-width intro paragraph
        ═══════════════════════════════════════════════ */}
        <section className="relative px-[clamp(1.5rem,6vw,9rem)] py-10 border-b border-[#DEDAD4]">
          {/* Large decorative opening quote mark */}
          <span
            className="absolute pointer-events-none select-none font-[family-name:var(--font-playfair)] italic text-[#B1A490]"
            style={{
              fontSize: 'clamp(80px, 10vw, 140px)',
              lineHeight: 1,
              top: 'clamp(-16px, -1.2vw, -24px)',
              left: 'clamp(0.5rem, 4vw, 7rem)',
              opacity: 0.12,
            }}
          >
            &ldquo;
          </span>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative font-[var(--font-libre-franklin)] text-[#333] leading-[1.9] text-justify"
            style={{ fontSize: 'clamp(13px, 1.1vw, 15px)' }}
          >
            {introText}
          </motion.p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Two-column editorial text
        ═══════════════════════════════════════════════ */}
        <section className="px-[clamp(1.5rem,6vw,9rem)] py-12 border-b border-[#DEDAD4]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10">

            {/* Left column */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="md:pr-[clamp(2rem,4vw,6rem)] md:border-r md:border-[#E8E4DE]">
              <p className="font-[var(--font-libre-franklin)] text-[#333] leading-[2] text-justify"
                style={{ fontSize: 'clamp(12.5px, 1vw, 14px)' }}>
                {col1Text}
              </p>
            </motion.div>

            {/* Right column */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
              className="md:pl-[clamp(2rem,4vw,6rem)]">
              <p className="font-[var(--font-libre-franklin)] text-[#333] leading-[2] text-justify"
                style={{ fontSize: 'clamp(12.5px, 1vw, 14px)' }}>
                {col2Text}
              </p>
              {col2Text2 && (
                <p className="font-[var(--font-libre-franklin)] text-[#333] leading-[2] text-justify mt-5"
                  style={{ fontSize: 'clamp(12.5px, 1vw, 14px)' }}>
                  {col2Text2}
                </p>
              )}
            </motion.div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Full-width feature image
        ═══════════════════════════════════════════════ */}
        <section className="border-b border-[#DEDAD4]">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {/* Image */}
            <div className="relative w-full overflow-hidden bg-[#1C1A17]"
              style={{ aspectRatio: '16/7' }}>
              {featureImage ? (
                <Image src={featureImage} alt="Criteria Design Group" fill
                  className="object-cover" unoptimized />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C1A17] via-[#2a2520] to-[#111] flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-franklin-gothic)] font-bold text-white/[0.06] leading-none select-none"
                      style={{ fontSize: 'clamp(60px, 10vw, 140px)' }}>
                      Criteria Designs
                    </p>
                  </div>
                </div>
              )}
              {/* Subtle bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>

            {/* Caption row */}
            <div className="px-[clamp(1.5rem,6vw,9rem)] py-4 flex items-center justify-between bg-[#FAFAF8]">
              <p className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[4px] text-[#B1A490]">
                {imageCaption}
              </p>
              <p className="font-[var(--font-libre-franklin)] text-[10px] tracking-[1px] text-[#CECBC5]">
                Criteria Design Group — Cairo, Egypt
              </p>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Stats row with animated counters
        ═══════════════════════════════════════════════ */}
        <section
          ref={statsRef}
          className="relative px-[clamp(1.5rem,6vw,9rem)] py-14 border-b border-[#DEDAD4] overflow-hidden"
        >
          {/* Subtle dot-grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#B1A490 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              opacity: 0.07,
            }}
          />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show"
                custom={i * 0.5} viewport={{ once: true }}
                className="flex flex-col gap-2 border-l-2 border-[#B1A490]/30 pl-5">
                <span className="font-[family-name:var(--font-franklin-gothic)] font-bold text-[#111] leading-none"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 46px)' }}>
                  <AnimatedCounter target={s.n} inView={statsInView} />
                </span>
                <span className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[3px] text-[#9A9A94]">
                  {s.l}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Vision, Mission, Our Services
        ═══════════════════════════════════════════════ */}
        <section className="px-[clamp(1.5rem,6vw,9rem)] py-0 bg-white">

          {/* Vision */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="py-12 border-b border-[#DEDAD4]"
          >
            <div className="flex items-center gap-4 mb-6">
              {/* Section accent label */}
              <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[4px] text-[#B1A490] hidden sm:block shrink-0 mt-1">
                01
              </span>
              <h2 className="font-[family-name:var(--font-franklin-gothic)] font-bold text-[#111] leading-none"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
                Vision
              </h2>
              <Eye size={22} className="text-[#B1A490] shrink-0 mt-1" />
            </div>
            <p className="font-[var(--font-libre-franklin)] text-[#444] leading-[2] text-justify max-w-[720px] ml-[clamp(1rem,4vw,5rem)]"
              style={{ fontSize: 'clamp(12.5px, 1vw, 14px)' }}>
              {visionText}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="py-12 border-b border-[#DEDAD4]"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[4px] text-[#B1A490] hidden sm:block shrink-0 mt-1">
                02
              </span>
              <h2 className="font-[family-name:var(--font-franklin-gothic)] font-bold text-[#111] leading-none"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
                Mission
              </h2>
              <Target size={22} className="text-[#B1A490] shrink-0 mt-1" />
            </div>
            <p className="font-[var(--font-libre-franklin)] text-[#444] leading-[2] text-justify max-w-[720px] ml-[clamp(1rem,4vw,5rem)]"
              style={{ fontSize: 'clamp(12.5px, 1vw, 14px)' }}>
              {missionText}
            </p>
          </motion.div>

          {/* Our Services */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="py-12 border-b border-[#DEDAD4]"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[4px] text-[#B1A490] hidden sm:block shrink-0 mt-1">
                03
              </span>
              <h2 className="font-[family-name:var(--font-franklin-gothic)] font-bold text-[#111] leading-none"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
                Our Services
              </h2>
              <Layers size={22} className="text-[#B1A490] shrink-0 mt-1" />
            </div>
            <p className="font-[var(--font-libre-franklin)] text-[#444] leading-[2] text-justify max-w-[720px] ml-[clamp(1rem,4vw,5rem)]"
              style={{ fontSize: 'clamp(12.5px, 1vw, 14px)' }}>
              {servicesText}
            </p>
          </motion.div>

        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7 — Contact / CTA row
        ═══════════════════════════════════════════════ */}
        <section className="px-[clamp(1.5rem,6vw,9rem)] py-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            <div>
              <p className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[5px] text-[#B1A490] mb-3">
                Work With Us
              </p>
              <h2 className="font-[var(--font-playfair)] italic text-[#111] leading-[1.2]"
                style={{ fontSize: 'clamp(20px, 2.5vw, 32px)' }}>
                Ready to start your next project?
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 shrink-0">
              {settings.phone && (
                <a href={`tel:${settings.phone}`}
                  className="font-[var(--font-libre-franklin)] text-[11px] tracking-[1px] text-[#555] hover:text-[#111] transition-colors duration-200">
                  {settings.phone}
                </a>
              )}
              <Link href="/contact"
                className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[3px] px-7 py-3 bg-[#111] text-white hover:bg-[#B1A490] transition-colors duration-300">
                Get in Touch
              </Link>
            </div>

          </motion.div>
        </section>

      </main>

      <Footer />
    </>
  )
}
