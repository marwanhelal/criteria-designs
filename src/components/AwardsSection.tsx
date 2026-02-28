'use client'

import { useState, useEffect, useRef } from 'react'
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

/* ── Animated count-up number ──────────────────────────────────────── */
function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let frame: number
    const start = performance.now()
    const duration = 1100
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * target))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target])
  return <>{String(count).padStart(2, '0')}</>
}

/* ── Architectural corner mark ─────────────────────────────────────── */
function CornerMark({ className = '' }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className}>
      <path d="M0 10 L0 0 L10 0" stroke="#C8C8C2" strokeWidth="0.8" />
    </svg>
  )
}

/* ── Word-by-word title reveal ─────────────────────────────────────── */
function RevealTitle({ text, delay = 0, className = '' }: {
  text: string; delay?: number; className?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden leading-[inherit]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.52, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

/* ── Architectural section divider ─────────────────────────────────── */
function ArchDivider() {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="w-[6px] h-[6px] border border-[#C8C8C2] rotate-45 shrink-0" />
      <div className="flex-1 h-px bg-[#E8E8E4]" />
      <div className="w-[6px] h-[6px] border border-[#C8C8C2] rotate-45 shrink-0" />
    </div>
  )
}

/* ── Featured hero award ───────────────────────────────────────────── */
function HeroCard({ award }: { award: Award }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group relative cursor-default mb-10"
    >
      {/* Top border with gold fill on hover */}
      <div className="h-px bg-[#E0E0DC] group-hover:bg-[#B1A490]/50 transition-colors duration-500" />

      <div className="flex items-center gap-6 md:gap-14 py-8 md:py-10">
        {/* Large faint year — decorative */}
        <span className="font-[var(--font-playfair)] text-[52px] md:text-[80px] leading-none text-[#EBEBEA] shrink-0 select-none w-[90px] md:w-[140px] group-hover:text-[#B1A490]/25 transition-colors duration-500">
          {award.year}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[5px] text-[#B1A490] mb-2 block">
            Featured Recognition
          </span>
          <h3 className="font-[var(--font-playfair)] text-[20px] md:text-[28px] italic text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-300 leading-[1.25] relative pb-1">
            <RevealTitle text={award.titleEn} delay={0.1} />
            <span className="absolute bottom-0 left-0 h-[1.5px] bg-[#B1A490] w-0 group-hover:w-full transition-all duration-500 ease-out" />
          </h3>
          {award.subtitleEn && (
            <p className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#9A9A94] tracking-[0.04em] mt-2">
              {award.subtitleEn}
            </p>
          )}
        </div>

        {/* Image */}
        {award.image && (
          <div className="shrink-0 hidden md:block">
            <div className="relative w-[150px] h-[110px] rounded-[5px] overflow-hidden bg-white border border-[#eceae6] shadow-[0_2px_12px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow duration-300">
              <Image src={award.image} alt={award.titleEn} fill className="object-contain p-3" unoptimized />
            </div>
          </div>
        )}
      </div>

      {/* Bottom border */}
      <div className="h-px bg-[#E0E0DC] group-hover:bg-[#B1A490]/50 transition-colors duration-500" />
    </motion.div>
  )
}

/* ── Large award card ──────────────────────────────────────────────── */
function LargeCard({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-default group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#B1A490] origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
      <CornerMark className="absolute -top-[1px] -left-[1px] opacity-70" />

      <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] uppercase tracking-[0.18em] mb-3 pt-3 pl-3">
        {award.year}
      </p>
      <h3 className="font-[var(--font-libre-franklin)] text-[17px] lg:text-[19px] font-semibold text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-300 leading-[1.35] pl-3 pr-36 relative pb-1">
        <RevealTitle text={award.titleEn} />
        <span className="absolute bottom-0 left-3 right-0 h-[1.5px] bg-[#B1A490] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      </h3>
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[12px] text-[#9A9A94] tracking-[0.06em] mt-1.5 pl-3">
          {award.subtitleEn}
        </p>
      )}
      <div className="h-px bg-[#E0E0DC] group-hover:bg-[#B1A490]/40 transition-colors duration-300 mt-5 ml-3" />

      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            exit={{ opacity: 0, y: 10, rotate: 0 }}
            transition={{ duration: 0.26, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-2 z-20 pointer-events-none"
          >
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-[#ececec] bg-white" style={{ width: 130, height: 98 }}>
              <Image src={award.image} alt={award.titleEn} fill className="object-contain p-2" unoptimized />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Small award card ──────────────────────────────────────────────── */
function SmallCard({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-default text-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#B1A490] origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
      <CornerMark className="absolute -top-[1px] -left-[1px] opacity-40" />

      <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] uppercase tracking-[0.18em] mb-2.5 pt-3">
        {award.year}
      </p>
      <h3 className="font-[var(--font-libre-franklin)] text-[13px] lg:text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-300 leading-[1.4] px-2 relative pb-1">
        <RevealTitle text={award.titleEn} />
        <span className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-[#B1A490] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      </h3>
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] tracking-[0.06em] mt-1 px-2">
          {award.subtitleEn}
        </p>
      )}
      <div className="h-px bg-[#E0E0DC] group-hover:bg-[#B1A490]/40 transition-colors duration-300 mt-4 mx-2" />

      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 8, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            exit={{ opacity: 0, y: 8, rotate: 0 }}
            transition={{ duration: 0.26, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-0 z-20 pointer-events-none"
          >
            <div className="relative rounded-[4px] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.10)] border border-[#ececec] bg-white" style={{ width: 88, height: 66 }}>
              <Image src={award.image} alt={award.titleEn} fill className="object-contain p-1.5" unoptimized />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main section ──────────────────────────────────────────────────── */
export default function AwardsSection({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null

  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })

  const items = awards.slice(0, 13)
  const hero = items[0]
  const rest = items.slice(1)
  const rowA1 = rest.slice(0, 2)
  const rowB1 = rest.slice(2, 6)
  const rowA2 = rest.slice(6, 8)
  const rowB2 = rest.slice(8, 12)

  const minYear = Math.min(...items.map(a => a.year))
  const maxYear = Math.max(...items.map(a => a.year))

  const stats = [
    `${items.length} Recognitions`,
    minYear !== maxYear ? `${minYear} – ${maxYear}` : `${minYear}`,
    'International',
  ]

  return (
    <section data-navbar-dark className="bg-white pt-16 pb-24 lg:pt-20 lg:pb-32 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">

        {/* Header row */}
        <div ref={headerRef} className="flex items-end justify-between mb-4 lg:mb-5">
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-playfair)] text-[60px] md:text-[80px] lg:text-[96px] text-[#1A1A1A] leading-[1] tracking-[-0.03em] font-normal"
          >
            Awards
          </motion.h2>

          {/* Architectural index — top right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="hidden lg:flex flex-col items-end gap-1.5 pb-3"
          >
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#9A9A94] uppercase tracking-[0.2em]">
              Recognition
            </span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-[#C8C8C2]" />
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#C8C8C2] tracking-[0.1em]">
                <CountUp target={items.length} inView={headerInView} />
              </span>
            </div>
            {minYear !== maxYear && (
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#C8C8C2]/60 tracking-[0.06em]">
                {minYear} – {maxYear}
              </span>
            )}
          </motion.div>
        </div>

        {/* Animated gold underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="h-[2px] w-20 bg-[#B1A490] mb-5"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="font-[var(--font-libre-franklin)] text-[13px] text-[#9A9A94] tracking-[0.04em] leading-relaxed max-w-[420px] mb-6"
        >
          A growing record of international recognition across architecture and interior design.
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex flex-wrap gap-2 mb-14 lg:mb-16"
        >
          {stats.map((stat, i) => (
            <span
              key={i}
              className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[0.12em] text-[#9A9A94] border border-[#E8E8E4] px-3 py-1.5 rounded-full"
            >
              {stat}
            </span>
          ))}
        </motion.div>

        {/* Featured hero award */}
        {hero && <HeroCard award={hero} />}

        {/* Row A1: 2 large */}
        {rowA1.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {rowA1.map((a, i) => <LargeCard key={a.id} award={a} index={i} />)}
              {rowA1.length === 1 && <div />}
            </div>
            {(rowB1.length > 0 || rowA2.length > 0) && <ArchDivider />}
          </>
        )}

        {/* Row B1: 4 small */}
        {rowB1.length > 0 && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
              {rowB1.map((a, i) => <SmallCard key={a.id} award={a} index={i} />)}
            </div>
            {rowA2.length > 0 && <ArchDivider />}
          </>
        )}

        {/* Row A2: 2 large */}
        {rowA2.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {rowA2.map((a, i) => <LargeCard key={a.id} award={a} index={i} />)}
              {rowA2.length === 1 && <div />}
            </div>
            {rowB2.length > 0 && <ArchDivider />}
          </>
        )}

        {/* Row B2: 4 small */}
        {rowB2.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {rowB2.map((a, i) => <SmallCard key={a.id} award={a} index={i} />)}
          </div>
        )}

        {/* Bottom: tick marks + button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-3 w-full max-w-[360px]">
            <div className="flex-1 h-px bg-[#E8E8E4]" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-px h-3 bg-[#C8C8C2]" />
              ))}
            </div>
            <div className="flex-1 h-px bg-[#E8E8E4]" />
          </div>

          <Link
            href="/awards"
            className="group/btn inline-flex items-center gap-0 font-[var(--font-libre-franklin)] text-[11px] text-[#1A1A1A] uppercase tracking-[4px] border border-[#1A1A1A]/15 px-10 py-4 hover:border-[#B1A490] hover:text-[#B1A490] transition-all duration-300 overflow-hidden"
          >
            <span className="transition-transform duration-300 group-hover/btn:-translate-x-1">
              View All Awards
            </span>
            <span className="opacity-0 max-w-0 group-hover/btn:opacity-100 group-hover/btn:max-w-[20px] group-hover/btn:ml-2 transition-all duration-300 text-[13px]">
              →
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
