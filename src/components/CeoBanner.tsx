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
      data-navbar-dark
      className="relative w-full overflow-hidden bg-[#F8F7F4]"
    >
      {/* Background architectural drawing */}
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

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-12 py-[60px] lg:py-[80px]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Portrait — LEFT side */}
          {data.ceoImage && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              className="shrink-0"
            >
              <div className="relative">
                {/* Gray circle background behind portrait */}
                <div className="absolute inset-[-25px] lg:inset-[-35px] rounded-full bg-[#D5D5D5]/30" />
                <div className="relative w-[260px] h-[260px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden">
                  <Image
                    src={data.ceoImage}
                    alt={data.ceoNameEn || 'CEO'}
                    fill
                    sizes="380px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Content — RIGHT side */}
          <div className="flex-1 text-center lg:text-left">
            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[58px] text-[#181C23] leading-[1.05] font-bold uppercase tracking-[2px]"
            >
              {data.ceoNameEn}
            </motion.h2>

            {/* Title */}
            {data.ceoTitleEn && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="font-[var(--font-libre-franklin)] text-[18px] md:text-[22px] lg:text-[28px] text-[#444] uppercase tracking-[3px] mt-2 lg:mt-3 font-medium"
              >
                {data.ceoTitleEn}
              </motion.p>
            )}

            {/* Separator line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-[2px] bg-[#181C23]/15 mt-8 mb-8 origin-left max-w-[600px] mx-auto lg:mx-0"
            />

            {/* Stats row */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex flex-wrap justify-center lg:justify-start">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                      className={`flex flex-col px-5 lg:px-7 py-2 ${
                        i > 0 ? 'border-l-2 border-[#181C23]/15' : ''
                      }`}
                    >
                      <span className="font-[var(--font-merriweather)] text-[32px] lg:text-[44px] text-[#181C23] leading-none font-bold">
                        <CountUpStat raw={stat.number!} inView={isInView} />
                      </span>
                      <span className="font-[var(--font-libre-franklin)] text-[10px] lg:text-[13px] text-[#666] uppercase tracking-[2px] mt-2">
                        {stat.label}
                      </span>
                      {'desc' in stat && stat.desc && (
                        <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#999] mt-1 italic leading-[1.4]">
                          {stat.desc}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SEE MORE button — right-aligned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-10 flex justify-center lg:justify-end"
            >
              <Link
                href={data.ceoBtnLink || '#'}
                className="inline-flex items-center font-[var(--font-libre-franklin)] text-[13px] text-[#181C23] uppercase tracking-[3px] border-2 border-[#181C23]/30 px-[40px] py-[14px] transition-all duration-400 hover:bg-[#181C23] hover:text-white hover:border-[#181C23]"
              >
                {data.ceoBtnTextEn || 'SEE MORE'}
              </Link>
            </motion.div>

            {/* Logos — right-aligned */}
            {logos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-10 flex items-center justify-center lg:justify-end gap-8 lg:gap-10"
              >
                {logos.map((logo, i) => (
                  <div
                    key={i}
                    className="relative w-[80px] h-[45px] lg:w-[110px] lg:h-[55px]"
                  >
                    <Image
                      src={logo}
                      alt={`Partner ${i + 1}`}
                      fill
                      sizes="110px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
