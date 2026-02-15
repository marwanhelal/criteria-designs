'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface CeoData {
  ceoNameEn: string | null
  ceoTitleEn: string | null
  ceoImage: string | null
  ceoBgImage: string | null
  ceoStat1Number: string | null
  ceoStat1LabelEn: string | null
  ceoStat1DescEn: string | null
  ceoStat2Number: string | null
  ceoStat2LabelEn: string | null
  ceoStat3Number: string | null
  ceoStat3LabelEn: string | null
  ceoStat4Number: string | null
  ceoStat4LabelEn: string | null
  ceoLogo1: string | null
  ceoLogo2: string | null
  ceoLogo3: string | null
  ceoLogo4: string | null
  ceoLogo5: string | null
  ceoBtnTextEn: string | null
  ceoBtnLink: string | null
}

function parseStatNumber(raw: string): { prefix: string; value: number; suffix: string } {
  const match = raw.match(/^([^\d]*)(\d+)(.*)$/)
  if (!match) return { prefix: '', value: 0, suffix: raw }
  return { prefix: match[1], value: parseInt(match[2], 10), suffix: match[3] }
}

function CountUpStat({ raw, inView }: { raw: string; inView: boolean }) {
  const { prefix, value, suffix } = parseStatNumber(raw)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || value === 0) return
    let start = 0
    const duration = 2000
    const stepTime = 16
    const steps = duration / stepTime
    const increment = value / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [inView, value])

  if (value === 0) return <span>{raw}</span>

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  )
}

// Animated SVG ring that draws itself around the portrait
function AnimatedRing({ inView }: { inView: boolean }) {
  return (
    <svg
      className="absolute inset-[-14px] lg:inset-[-18px] w-[calc(100%+28px)] h-[calc(100%+28px)] lg:w-[calc(100%+36px)] lg:h-[calc(100%+36px)]"
      viewBox="0 0 100 100"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#B1A490"
        strokeWidth="0.5"
        strokeDasharray="301.6"
        initial={{ strokeDashoffset: 301.6 }}
        animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 301.6 }}
        transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="#B1A490"
        strokeWidth="0.3"
        strokeDasharray="289"
        opacity={0.4}
        initial={{ strokeDashoffset: -289 }}
        animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: -289 }}
        transition={{ duration: 2.5, delay: 0.8, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function CeoBanner() {
  const [data, setData] = useState<CeoData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05])

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.ceoNameEn) setData(d)
      })
      .catch(() => {})
  }, [])

  const stats = data ? [
    { number: data.ceoStat1Number, label: data.ceoStat1LabelEn, desc: data.ceoStat1DescEn },
    { number: data.ceoStat2Number, label: data.ceoStat2LabelEn },
    { number: data.ceoStat3Number, label: data.ceoStat3LabelEn },
    { number: data.ceoStat4Number, label: data.ceoStat4LabelEn },
  ].filter((s) => s.number) : []

  const logos = data ? [data.ceoLogo1, data.ceoLogo2, data.ceoLogo3, data.ceoLogo4, data.ceoLogo5].filter(
    Boolean
  ) as string[] : []

  if (!data) return <section ref={sectionRef} />

  return (
    <section
      ref={sectionRef}
      data-navbar-dark
      className="relative w-full overflow-hidden bg-[#F8F8F8]"
    >
      {/* Architectural blueprint background pattern with parallax */}
      <motion.div
        className="absolute inset-[-40px] pointer-events-none"
        style={{ y: bgY, scale: bgScale }}
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 800"
        >
          <defs>
            {/* Fine grid pattern */}
            <pattern id="bp-grid-sm" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#B1A490" strokeWidth="0.15" opacity="0.25" />
            </pattern>
            {/* Medium grid */}
            <pattern id="bp-grid-md" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#bp-grid-sm)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#B1A490" strokeWidth="0.3" opacity="0.3" />
            </pattern>
          </defs>

          {/* Base grid */}
          <rect width="1200" height="800" fill="url(#bp-grid-md)" />

          {/* Floor plan - main rooms */}
          <g stroke="#9A8B78" fill="none" opacity="0.12" strokeWidth="0.8">
            {/* Large room left */}
            <rect x="60" y="120" width="280" height="220" />
            <line x1="60" y1="240" x2="340" y2="240" />
            {/* Door opening */}
            <path d="M 200 340 L 200 310" />
            <path d="M 240 340 L 240 310" strokeDasharray="2,3" />
            {/* Room subdivisions */}
            <line x1="180" y1="120" x2="180" y2="240" />
            <rect x="70" y="130" width="100" height="100" strokeDasharray="4,4" strokeWidth="0.4" />

            {/* Central corridor */}
            <rect x="340" y="160" width="120" height="320" strokeWidth="0.5" />
            <line x1="340" y1="320" x2="460" y2="320" strokeDasharray="3,3" strokeWidth="0.4" />

            {/* Right wing rooms */}
            <rect x="460" y="100" width="320" height="180" />
            <line x1="620" y1="100" x2="620" y2="280" />
            <rect x="470" y="110" width="140" height="80" strokeDasharray="4,4" strokeWidth="0.4" />
            <rect x="630" y="110" width="140" height="80" strokeDasharray="4,4" strokeWidth="0.4" />

            {/* Bottom rooms */}
            <rect x="460" y="340" width="200" height="160" />
            <line x1="560" y1="340" x2="560" y2="500" />
            <rect x="700" y="340" width="160" height="160" />

            {/* Staircase symbol */}
            <g transform="translate(370, 180)">
              <line x1="0" y1="0" x2="60" y2="0" />
              <line x1="0" y1="10" x2="60" y2="10" />
              <line x1="0" y1="20" x2="60" y2="20" />
              <line x1="0" y1="30" x2="60" y2="30" />
              <line x1="0" y1="40" x2="60" y2="40" />
              <line x1="0" y1="50" x2="60" y2="50" />
              <line x1="30" y1="0" x2="30" y2="50" strokeWidth="0.3" />
            </g>

            {/* Additional room top-right */}
            <rect x="820" y="100" width="200" height="140" />
            <line x1="920" y1="100" x2="920" y2="240" strokeWidth="0.5" />
            <rect x="830" y="250" width="190" height="120" strokeWidth="0.5" />
          </g>

          {/* Building perspective / elevation lines */}
          <g stroke="#8A7A66" fill="none" opacity="0.06" strokeWidth="0.6">
            {/* Perspective building outline */}
            <path d="M 900 600 L 900 380 L 1050 320 L 1050 560 Z" />
            <line x1="900" y1="420" x2="1050" y2="360" />
            <line x1="900" y1="460" x2="1050" y2="400" />
            <line x1="900" y1="500" x2="1050" y2="440" />
            <line x1="900" y1="540" x2="1050" y2="480" />
            {/* Windows */}
            <rect x="915" y="395" width="25" height="35" />
            <rect x="950" y="395" width="25" height="35" />
            <rect x="915" y="445" width="25" height="35" />
            <rect x="950" y="445" width="25" height="35" />
            <rect x="915" y="495" width="25" height="35" />
            <rect x="950" y="495" width="25" height="35" />
            {/* Second face */}
            <path d="M 1050 320 L 1160 370 L 1160 610 L 1050 560" />
            <line x1="1050" y1="360" x2="1160" y2="410" />
            <line x1="1050" y1="400" x2="1160" y2="450" />
            <line x1="1050" y1="440" x2="1160" y2="490" />
            <line x1="1050" y1="480" x2="1160" y2="530" />
          </g>

          {/* Diagonal construction/projection lines */}
          <g stroke="#B1A490" opacity="0.04" strokeWidth="0.4">
            <line x1="0" y1="0" x2="600" y2="400" />
            <line x1="1200" y1="0" x2="600" y2="400" />
            <line x1="0" y1="800" x2="600" y2="400" />
            <line x1="1200" y1="800" x2="600" y2="400" />
          </g>

          {/* Dimension lines & annotations */}
          <g stroke="#9A8B78" fill="none" opacity="0.08" strokeWidth="0.4">
            {/* Horizontal dimension */}
            <line x1="60" y1="370" x2="340" y2="370" />
            <line x1="60" y1="365" x2="60" y2="375" />
            <line x1="340" y1="365" x2="340" y2="375" />
            {/* Vertical dimension */}
            <line x1="30" y1="120" x2="30" y2="340" />
            <line x1="25" y1="120" x2="35" y2="120" />
            <line x1="25" y1="340" x2="35" y2="340" />
            {/* Right side dimension */}
            <line x1="810" y1="90" x2="810" y2="280" />
            <line x1="805" y1="90" x2="815" y2="90" />
            <line x1="805" y1="280" x2="815" y2="280" />
          </g>

          {/* Circle markers (column points) */}
          <g fill="none" stroke="#B1A490" strokeWidth="0.4" opacity="0.1">
            <circle cx="60" cy="120" r="4" />
            <circle cx="340" cy="120" r="4" />
            <circle cx="60" cy="340" r="4" />
            <circle cx="340" cy="340" r="4" />
            <circle cx="460" cy="100" r="4" />
            <circle cx="780" cy="100" r="4" />
            <circle cx="460" cy="280" r="4" />
            <circle cx="780" cy="280" r="4" />
            <circle cx="460" cy="500" r="4" />
            <circle cx="660" cy="500" r="4" />
            <circle cx="860" cy="500" r="4" />
          </g>

          {/* Compass rose bottom-left */}
          <g transform="translate(100, 650)" stroke="#B1A490" fill="none" opacity="0.08" strokeWidth="0.5">
            <circle cx="0" cy="0" r="25" />
            <line x1="0" y1="-30" x2="0" y2="30" />
            <line x1="-30" y1="0" x2="30" y2="0" />
            <path d="M 0 -25 L 4 -8 L 0 -12 L -4 -8 Z" fill="#B1A490" opacity="0.15" />
          </g>

          {/* Scattered small annotations - door arcs */}
          <g stroke="#9A8B78" fill="none" opacity="0.08" strokeWidth="0.3">
            <path d="M 200 340 A 40 40 0 0 1 240 340" />
            <path d="M 620 280 A 30 30 0 0 0 650 280" />
          </g>
        </svg>
      </motion.div>

      {/* Decorative corner accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute top-8 right-8 w-[60px] h-[60px] border-t border-r border-[#B1A490]/20 hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-8 w-[60px] h-[60px] border-b border-l border-[#B1A490]/20 hidden lg:block"
      />

      <div className="relative z-10 max-w-[1290px] mx-auto px-8 py-[70px] lg:py-[90px]">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-0 lg:text-left lg:hidden"
        >
          <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[4px]">
            Our Founder
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* Portrait with animated ring */}
          {data.ceoImage && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              className="shrink-0"
            >
              <div className="group relative">
                {/* Animated SVG ring */}
                <AnimatedRing inView={isInView} />
                {/* Glow on hover */}
                <div className="absolute inset-[-20px] rounded-full bg-[#B1A490]/0 group-hover:bg-[#B1A490]/10 transition-all duration-700 blur-2xl" />
                {/* Portrait image */}
                <div className="relative w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                  <Image
                    src={data.ceoImage}
                    alt={data.ceoNameEn || 'CEO'}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Desktop label */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:inline-block font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[4px] mb-4"
            >
              Our Founder
            </motion.span>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-[var(--font-merriweather)] text-[32px] lg:text-[48px] text-[#181C23] leading-[1.1] font-bold uppercase tracking-[2px]"
            >
              {data.ceoNameEn}
            </motion.h2>

            {/* Title with animated line */}
            {data.ceoTitleEn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-3 mt-3"
              >
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 40 } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-[1px] bg-[#B1A490] hidden lg:block"
                />
                <p className="font-[var(--font-libre-franklin)] text-[14px] lg:text-[17px] text-[#555] uppercase tracking-[3px]">
                  {data.ceoTitleEn}
                </p>
              </motion.div>
            )}

            {/* Stats with counting animation */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10"
              >
                {/* Animated divider line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-[#B1A490]/40 to-transparent origin-left mb-8"
                />
                <div className="flex flex-wrap justify-center lg:justify-start gap-0">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 25 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
                      className={`flex flex-col px-5 lg:px-8 py-2 ${
                        i > 0 ? 'border-l border-[#181C23]/10' : ''
                      }`}
                    >
                      <span className="font-[var(--font-merriweather)] text-[30px] lg:text-[40px] text-[#181C23] leading-none font-bold">
                        <CountUpStat raw={stat.number!} inView={isInView} />
                      </span>
                      <span className="font-[var(--font-libre-franklin)] text-[10px] lg:text-[12px] text-[#888] uppercase tracking-[2px] mt-2">
                        {stat.label}
                      </span>
                      {'desc' in stat && stat.desc && (
                        <span className="font-[var(--font-open-sans)] text-[11px] text-[#aaa] mt-1 max-w-[160px] italic leading-[1.4]">
                          {stat.desc}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Button + Logos row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col lg:flex-row items-center gap-8 mt-10"
            >
              {data.ceoBtnTextEn && data.ceoBtnLink && (
                <Link
                  href={data.ceoBtnLink}
                  className="group/btn relative inline-flex items-center font-[var(--font-libre-franklin)] text-[12px] text-[#181C23] uppercase tracking-[3px] border border-[#181C23]/25 px-[36px] py-[14px] overflow-hidden transition-all duration-500 hover:text-white hover:border-[#181C23]"
                >
                  <span className="absolute inset-0 bg-[#181C23] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                  <span className="relative">{data.ceoBtnTextEn}</span>
                </Link>
              )}

              {logos.length > 0 && (
                <div className="flex items-center gap-5 lg:gap-6 lg:ml-4">
                  <span className="hidden lg:block w-[1px] h-[30px] bg-[#181C23]/10" />
                  {logos.map((logo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
                      className="relative w-[50px] h-[35px] lg:w-[70px] lg:h-[45px] opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      <Image
                        src={logo}
                        alt={`Partner ${i + 1}`}
                        fill
                        sizes="70px"
                        className="object-contain"
                        unoptimized
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
