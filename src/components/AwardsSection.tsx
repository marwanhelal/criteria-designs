'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'

interface Award {
  id: string
  titleEn: string
  year: number
  subtitleEn: string | null
  image: string | null
}

/* ── Animated number counter ───────────────────────────────────────── */
function AnimatedCounter({ target, trigger }: { target: number; trigger: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let raf: number
    const duration = 1400
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target])

  return <>{String(count).padStart(2, '0')}</>
}

/* ── Single award row ──────────────────────────────────────────────── */
function AwardRow({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rowRef, { once: true, margin: '-40px' })

  return (
    <div ref={rowRef}>
      {/* Divider — scales in from left on scroll entry */}
      <motion.div
        className="h-px bg-[#E5E2DC] origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: index * 0.06 + 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative group cursor-default flex items-center gap-5 md:gap-8 py-6 md:py-8"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Index number */}
        <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#C8C4BC] tracking-[0.12em] w-7 shrink-0 select-none tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Year badge */}
        <span className="hidden sm:flex font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[0.2em] border border-[#B1A490]/30 px-2.5 py-1 rounded-full shrink-0 group-hover:border-[#B1A490]/70 transition-colors duration-300">
          {award.year}
        </span>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Mobile year */}
          <span className="sm:hidden font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[0.18em] mb-1 block">
            {award.year}
          </span>
          <h3 className="font-[var(--font-playfair)] text-[17px] md:text-[20px] lg:text-[22px] text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-300 leading-[1.3]">
            {award.titleEn}
          </h3>
          {award.subtitleEn && (
            <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] tracking-[0.04em] mt-1">
              {award.subtitleEn}
            </p>
          )}
        </div>

        {/* Gold dash — slides in on hover */}
        <motion.span
          animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
          transition={{ duration: 0.18 }}
          className="text-[#B1A490] text-[13px] shrink-0 select-none hidden md:block"
        >
          &#8212;
        </motion.span>

        {/* Hover image preview */}
        <AnimatePresence>
          {hovered && award.image && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.94, rotate: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 2 }}
              exit={{ opacity: 0, y: 8, scale: 0.94, rotate: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
              className="absolute right-10 md:right-16 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div
                className="relative rounded-[4px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.14)] border border-[#eceae6] bg-white"
                style={{ width: 120, height: 90 }}
              >
                <Image src={award.image} alt={award.titleEn} fill className="object-contain p-2" unoptimized />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ── Main section ──────────────────────────────────────────────────── */
export default function AwardsSection({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null

  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const items = awards.slice(0, 12)

  return (
    <section className="bg-[#FAFAF8] py-20 md:py-28 lg:py-36 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">

        {/* ── Header ── */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20 lg:mb-24">

          {/* Left: label + title */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[5px] mb-5"
            >
              Recognition &amp; Excellence
            </motion.p>

            {/* Title with clip-path wipe-up reveal */}
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '105%' }}
                animate={headerInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-[var(--font-playfair)] text-[52px] md:text-[68px] lg:text-[88px] font-normal text-[#1A1A1A] leading-[1] tracking-[-0.02em]"
              >
                Awards
              </motion.h2>
            </div>
          </div>

          {/* Right: animated count stat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end gap-4 pb-1"
          >
            <span className="font-[var(--font-playfair)] text-[60px] md:text-[72px] leading-none text-[#B1A490] tabular-nums">
              <AnimatedCounter target={awards.length} trigger={headerInView} />
            </span>
            <div className="flex flex-col gap-[6px] mb-2">
              <span className="block w-7 h-px bg-[#B1A490]/50" />
              <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] text-[#9A9A94] leading-[1.6]">
                Awards &amp;<br />Recognitions
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Award rows ── */}
        <div>
          {items.map((award, i) => (
            <AwardRow key={award.id} award={award} index={i} />
          ))}

          {/* Closing line */}
          <motion.div
            className="h-px bg-[#E5E2DC] origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 md:mt-16 flex justify-center"
        >
          <Link
            href="/awards"
            className="group inline-flex items-center gap-5 font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[4px] text-[#1A1A1A] hover:text-[#B1A490] transition-colors duration-300"
          >
            <span className="block h-px bg-[#B1A490]/50 w-8 group-hover:w-14 transition-all duration-400" />
            View All Awards
            <span className="block h-px bg-[#B1A490]/50 w-8 group-hover:w-14 transition-all duration-400" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
