'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useTransform, useScroll } from 'framer-motion'

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

/* Animated SVG ring that draws in on scroll, then slowly rotates */
function AnimatedRing({ inView }: { inView: boolean }) {
  return (
    <motion.svg
      className="absolute inset-[-20px] lg:inset-[-30px] w-[calc(100%+40px)] h-[calc(100%+40px)] lg:w-[calc(100%+60px)] lg:h-[calc(100%+60px)]"
      viewBox="0 0 100 100"
      animate={inView ? { rotate: 360 } : {}}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear', delay: 2.5 }}
    >
      {/* Outer ring — draws in */}
      <motion.circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#B1A490"
        strokeWidth="0.4"
        strokeDasharray="301.6"
        initial={{ strokeDashoffset: 301.6 }}
        animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 301.6 }}
        transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
      />
      {/* Inner ring — dashed, draws in reverse */}
      <motion.circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="#B1A490"
        strokeWidth="0.25"
        strokeDasharray="4 8"
        opacity={0.4}
        initial={{ strokeDashoffset: -289 }}
        animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: -289 }}
        transition={{ duration: 2.5, delay: 0.6, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

/* Floating geometric accent shapes */
function FloatingAccents({ inView }: { inView: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top-right diamond */}
      <motion.div
        className="absolute top-[15%] right-[8%] w-3 h-3 border border-[#B1A490]/20 rotate-45"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.5 }}
      />
      <motion.div
        className="absolute top-[15%] right-[8%] w-3 h-3 border border-[#B1A490]/10 rotate-45"
        animate={inView ? { scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] } : {}}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      />
      {/* Bottom-left plus */}
      <motion.div
        className="absolute bottom-[20%] left-[5%] text-[#B1A490]/15 text-2xl font-thin select-none"
        initial={{ opacity: 0, rotate: -90 }}
        animate={inView ? { opacity: 1, rotate: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        +
      </motion.div>
      {/* Mid-right line */}
      <motion.div
        className="absolute top-[45%] right-[3%] w-[60px] h-[1px] bg-gradient-to-r from-[#B1A490]/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 2 }}
        style={{ originX: 1 }}
      />
    </div>
  )
}

export default function CeoBanner() {
  const [data, setData] = useState<CeoData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })


  // Scroll parallax for background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])


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

  /* Text reveal variant — characters slide up from below */
  const nameText = data.ceoNameEn || ''
  const nameWords = nameText.split(' ')

  return (
    <section
      ref={sectionRef}
      data-navbar-dark
      className="relative w-full overflow-hidden bg-[#F8F7F4]"
    >
      {/* Background architectural drawing with scroll parallax */}
      {data.ceoBgImage && (
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
          <Image
            src={data.ceoBgImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.35] scale-110"
            unoptimized
          />
        </motion.div>
      )}

      {/* Floating accent shapes */}
      <FloatingAccents inView={isInView} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-20 py-[60px] lg:py-[80px]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Portrait — LEFT side with 3D tilt + gentle float */}
          {data.ceoImage && (
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              animate={isInView ? {
                opacity: 1,
                x: 0,
                scale: 1,
                y: [0, -8, 0],
              } : {}}
              transition={{
                opacity: { duration: 1 },
                x: { duration: 1, ease: [0.25, 0.4, 0.25, 1] },
                scale: { duration: 1 },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
              }}
              className="shrink-0"
            >
              <div ref={portraitRef} className="relative">
                {/* Gray circle background */}
                <div className="absolute inset-[-25px] lg:inset-[-35px] rounded-full bg-[#D5D5D5]/25" />
                {/* Animated SVG rings */}
                <AnimatedRing inView={isInView} />
                {/* Portrait image */}
                <motion.div
                  className="relative w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={data.ceoImage}
                    alt={data.ceoNameEn || 'CEO'}
                    fill
                    sizes="380px"
                    className="object-cover"
                    unoptimized
                  />
                  {/* Subtle shimmer overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Content — RIGHT side */}
          <div className="flex-1 text-center lg:text-left">
            {/* Name — word-by-word reveal */}
            <h2 className="font-[var(--font-merriweather)] text-[28px] md:text-[36px] lg:text-[44px] text-[#181C23] leading-[1.05] font-bold uppercase tracking-[2px] overflow-hidden">
              {nameWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + i * 0.12,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>

            {/* Title with line draw-in */}
            {data.ceoTitleEn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-3 mt-2 lg:mt-3"
              >
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 40 } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="h-[1.5px] bg-[#B1A490] hidden lg:block"
                />
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="font-[var(--font-libre-franklin)] text-[14px] md:text-[17px] lg:text-[21px] text-[#444] uppercase tracking-[3px] font-medium"
                >
                  {data.ceoTitleEn}
                </motion.p>
              </motion.div>
            )}

            {/* Separator line — animated draw with shimmer */}
            <div className="relative mt-8 mb-8 max-w-[600px] mx-auto lg:mx-0">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                className="h-[2px] bg-[#181C23]/15 origin-left"
              />
              <motion.div
                className="absolute top-0 left-0 h-[2px] w-[60px] bg-gradient-to-r from-transparent via-[#B1A490]/60 to-transparent"
                initial={{ x: '-60px' }}
                animate={isInView ? { x: '600px' } : {}}
                transition={{ duration: 2, delay: 1.7, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
              />
            </div>

            {/* Stats row — staggered slide-up */}
            {stats.length > 0 && (
              <div className="flex flex-wrap justify-center lg:justify-start">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + i * 0.15,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                    className={`group/stat relative flex flex-col px-5 lg:px-7 py-2 cursor-default ${
                      i > 0 ? 'border-l-2 border-[#181C23]/15' : ''
                    }`}
                  >
                    <span className="font-[var(--font-merriweather)] text-[26px] lg:text-[36px] text-[#181C23] leading-none font-bold transition-colors duration-300 group-hover/stat:text-[#B1A490]">
                      <CountUpStat raw={stat.number!} inView={isInView} />
                    </span>
                    <span className="font-[var(--font-libre-franklin)] text-[10px] lg:text-[13px] text-[#666] uppercase tracking-[2px] mt-2 transition-colors duration-300 group-hover/stat:text-[#444]">
                      {stat.label}
                    </span>
                    {'desc' in stat && stat.desc && (
                      <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#999] mt-1 italic leading-[1.4]">
                        {stat.desc}
                      </span>
                    )}
                    {/* Gold underline that slides in on hover */}
                    <span className="absolute bottom-0 left-[20px] right-[20px] h-[2px] bg-[#B1A490] origin-left scale-x-0 group-hover/stat:scale-x-100 transition-transform duration-400" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* SEE MORE button — magnetic hover effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-10 flex justify-center lg:justify-end"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={data.ceoBtnLink || '#'}
                  className="group/btn relative inline-flex items-center font-[var(--font-libre-franklin)] text-[13px] text-[#181C23] uppercase tracking-[3px] border-2 border-[#181C23]/30 px-[40px] py-[14px] overflow-hidden transition-all duration-500 hover:border-[#181C23] hover:text-white"
                >
                  <span className="absolute inset-0 bg-[#181C23] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.4,0.25,1)]" />
                  <span className="relative flex items-center gap-2">
                    {data.ceoBtnTextEn || 'SEE MORE'}
                    <motion.span
                      className="inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      &rarr;
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Logos — staggered fade with pop hover */}
            {logos.length > 0 && (
              <div className="mt-10 flex items-center justify-center lg:justify-end gap-8 lg:gap-10">
                {logos.map((logo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 1.5 + i * 0.12,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.15,
                      transition: { duration: 0.2, ease: 'easeOut' },
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-[80px] h-[45px] lg:w-[110px] lg:h-[55px] cursor-pointer drop-shadow-sm hover:drop-shadow-lg"
                  >
                    <Image
                      src={logo}
                      alt={`Partner ${i + 1}`}
                      fill
                      sizes="110px"
                      className="object-contain"
                      unoptimized
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
