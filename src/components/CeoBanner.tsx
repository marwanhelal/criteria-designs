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
  if (!match) return { prefix: '', value: 0, suffix: '' }
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

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  )
}

export default function CeoBanner() {
  const [data, setData] = useState<CeoData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.ceoNameEn) setData(d)
      })
      .catch(() => {})
  }, [])

  if (!data) return null

  const stats = [
    { number: data.ceoStat1Number, label: data.ceoStat1LabelEn, desc: data.ceoStat1DescEn },
    { number: data.ceoStat2Number, label: data.ceoStat2LabelEn },
    { number: data.ceoStat3Number, label: data.ceoStat3LabelEn },
    { number: data.ceoStat4Number, label: data.ceoStat4LabelEn },
  ].filter((s) => s.number)

  const logos = [data.ceoLogo1, data.ceoLogo2, data.ceoLogo3, data.ceoLogo4, data.ceoLogo5].filter(
    Boolean
  ) as string[]

  return (
    <section
      ref={sectionRef}
      data-navbar-dark
      className="relative w-full overflow-hidden bg-[#F8F8F8]"
    >
      {/* Background image with parallax */}
      {data.ceoBgImage && (
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src={data.ceoBgImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            unoptimized
          />
        </motion.div>
      )}

      <div className="relative z-10 max-w-[1290px] mx-auto px-8 py-[60px] lg:py-[80px]">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Portrait with hover glow */}
          {data.ceoImage && (
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="shrink-0"
            >
              <div className="group relative">
                {/* Glow ring behind portrait */}
                <div className="absolute inset-[-12px] rounded-full bg-[#B1A490]/0 group-hover:bg-[#B1A490]/15 transition-all duration-500 blur-xl" />
                <div className="relative w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] rounded-full overflow-hidden ring-2 ring-[#B1A490]/30 ring-offset-4 ring-offset-[#F8F8F8] group-hover:ring-[#B1A490]/60 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                  <Image
                    src={data.ceoImage}
                    alt={data.ceoNameEn || 'CEO'}
                    fill
                    sizes="280px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Name & title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-[var(--font-merriweather)] text-[28px] lg:text-[40px] text-[#181C23] leading-[1.2] font-bold uppercase tracking-[1px]"
            >
              {data.ceoNameEn}
            </motion.h2>
            {data.ceoTitleEn && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-[var(--font-libre-franklin)] text-[14px] lg:text-[16px] text-[#666] uppercase tracking-[3px] mt-2"
              >
                {data.ceoTitleEn}
              </motion.p>
            )}

            {/* Stats with counting animation */}
            {stats.length > 0 && (
              <div className="flex flex-wrap justify-center lg:justify-start gap-0 mt-8 border-t border-[#181C23]/10 pt-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className={`flex flex-col px-4 lg:px-6 py-2 ${
                      i > 0 ? 'border-l border-[#181C23]/15' : ''
                    }`}
                  >
                    <span className="font-[var(--font-merriweather)] text-[28px] lg:text-[36px] text-[#181C23] leading-none font-bold">
                      <CountUpStat raw={stat.number!} inView={isInView} />
                    </span>
                    <span className="font-[var(--font-libre-franklin)] text-[10px] lg:text-[12px] text-[#666] uppercase tracking-[2px] mt-2">
                      {stat.label}
                    </span>
                    {'desc' in stat && stat.desc && (
                      <span className="font-[var(--font-open-sans)] text-[11px] text-[#999] mt-1 max-w-[140px] italic">
                        {stat.desc}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Button + Logos row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col lg:flex-row items-center gap-8 mt-8"
            >
              {data.ceoBtnTextEn && data.ceoBtnLink && (
                <Link
                  href={data.ceoBtnLink}
                  className="inline-flex items-center font-[var(--font-libre-franklin)] text-[13px] text-[#181C23] uppercase tracking-[2px] border border-[#181C23]/30 px-[32px] py-[14px] rounded-[30px] hover:bg-[#181C23] hover:text-white transition-all duration-300"
                >
                  {data.ceoBtnTextEn}
                </Link>
              )}

              {logos.length > 0 && (
                <div className="flex items-center gap-6">
                  {logos.map((logo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, delay: 1.0 + i * 0.1 }}
                      className="relative w-[60px] h-[40px] lg:w-[80px] lg:h-[50px] opacity-50 hover:opacity-100 transition-opacity duration-300"
                    >
                      <Image
                        src={logo}
                        alt={`Logo ${i + 1}`}
                        fill
                        sizes="80px"
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
