'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

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
      className="relative w-full overflow-hidden bg-[#181C23]"
    >
      {/* CMS background image with parallax (if uploaded) */}
      {data.ceoBgImage && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={data.ceoBgImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.35]"
            unoptimized
          />
        </div>
      )}

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-12 py-[70px] lg:py-[90px]">
        {/* Mobile label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-0 lg:text-left lg:hidden"
        >
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[4px]">
            Our Founder
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* Portrait with animated ring */}
          {data.ceoImage && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              className="shrink-0"
            >
              <div className="group relative">
                <AnimatedRing inView={isInView} />
                <div className="absolute inset-[-20px] rounded-full bg-[#B1A490]/0 group-hover:bg-[#B1A490]/5 transition-all duration-700 blur-2xl" />
                <div className="relative w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden group-hover:shadow-2xl transition-shadow duration-500">
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
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:inline-block font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[4px] mb-4 cursor-default"
            >
              Our Founder
            </motion.span>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-[var(--font-merriweather)] text-[32px] lg:text-[48px] text-white leading-[1.1] font-bold uppercase tracking-[2px]"
            >
              {data.ceoNameEn}
            </motion.h2>

            {/* Title */}
            {data.ceoTitleEn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-3 mt-3"
              >
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 40 } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-[1px] bg-[#B1A490] hidden lg:block"
                />
                <p className="font-[var(--font-libre-franklin)] text-[14px] lg:text-[17px] text-white/60 uppercase tracking-[3px]">
                  {data.ceoTitleEn}
                </p>
              </motion.div>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left mb-8"
                />
                <div className="flex flex-wrap justify-center lg:justify-start gap-0">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 25 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
                      className={`group/stat flex flex-col px-5 lg:px-8 py-3 cursor-default rounded-md transition-colors duration-300 hover:bg-white/[0.05] ${
                        i > 0 ? 'border-l border-white/10' : ''
                      }`}
                    >
                      <span className="font-[var(--font-merriweather)] text-[30px] lg:text-[40px] text-white leading-none font-bold transition-colors duration-300 group-hover/stat:text-[#B1A490]">
                        <CountUpStat raw={stat.number!} inView={isInView} />
                      </span>
                      <span className="font-[var(--font-libre-franklin)] text-[10px] lg:text-[12px] text-white/50 uppercase tracking-[2px] mt-2 transition-colors duration-300 group-hover/stat:text-white/70">
                        {stat.label}
                      </span>
                      {'desc' in stat && stat.desc && (
                        <span className="font-[var(--font-open-sans)] text-[11px] text-white/40 mt-1 max-w-[160px] italic leading-[1.4]">
                          {stat.desc}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Button + Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col lg:flex-row items-center gap-8 mt-10"
            >
              {data.ceoBtnTextEn && data.ceoBtnLink && (
                <Link
                  href={data.ceoBtnLink}
                  className="group/btn relative inline-flex items-center font-[var(--font-libre-franklin)] text-[12px] text-white uppercase tracking-[3px] border border-white/25 px-[36px] py-[14px] overflow-hidden transition-all duration-500 hover:text-[#181C23] hover:border-white"
                >
                  <span className="absolute inset-0 bg-white -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                  <span className="relative">{data.ceoBtnTextEn}</span>
                </Link>
              )}

              {logos.length > 0 && (
                <div className="flex items-center gap-5 lg:gap-6 lg:ml-4">
                  <span className="hidden lg:block w-[1px] h-[30px] bg-white/10" />
                  {logos.map((logo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
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
