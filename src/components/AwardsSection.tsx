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

/* ── Animated counter ──────────────────────────────────────────────── */
function AnimatedCounter({ target, trigger }: { target: number; trigger: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let raf: number
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target])
  return <>{String(count).padStart(2, '0')}</>
}

/* ── Zigzag positions ──────────────────────────────────────────────── */
const STAGGER = [
  { ml: '0%',   mw: '52%' },
  { ml: '42%',  mw: '52%' },
  { ml: '12%',  mw: '54%' },
  { ml: '38%',  mw: '54%' },
  { ml: '4%',   mw: '52%' },
  { ml: '46%',  mw: '50%' },
  { ml: '0%',   mw: '56%' },
  { ml: '40%',  mw: '52%' },
  { ml: '16%',  mw: '52%' },
  { ml: '44%',  mw: '52%' },
  { ml: '6%',   mw: '54%' },
  { ml: '38%',  mw: '54%' },
]

/* ── Single award (desktop zigzag) ────────────────────────────────── */
function AwardItem({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const s = STAGGER[index % STAGGER.length]
  const tilt = index % 2 === 0 ? 2 : -2

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative group cursor-default py-7 lg:py-9"
      style={{ marginLeft: s.ml }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
    >
      {/* Decorative large faint index — visual anchor */}
      <span
        className="absolute -top-4 -left-5 font-[var(--font-playfair)] leading-none select-none pointer-events-none"
        style={{ fontSize: '100px', color: 'rgba(177,164,144,0.08)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div style={{ maxWidth: s.mw }}>
        {/* Index + year row */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#C8C4BC] tracking-[0.12em] tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[0.2em] border border-[#B1A490]/35 px-2.5 py-[3px] rounded-full">
            {award.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-[var(--font-playfair)] text-[22px] md:text-[27px] lg:text-[33px] text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-350 leading-[1.2]">
          {award.titleEn}
        </h3>

        {/* Subtitle */}
        {award.subtitleEn && (
          <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] tracking-[0.04em] mt-2 leading-relaxed">
            {award.subtitleEn}
          </p>
        )}

        {/* Divider — scales in from left */}
        <motion.div
          className="h-px bg-[#E5E2DC] mt-5 origin-left"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.65, delay: index * 0.06 + 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Cursor-following image */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.86, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: tilt }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed pointer-events-none z-[999]"
            style={{ left: cursor.x + 20, top: cursor.y - 90 }}
          >
            <div
              className="relative rounded-[6px] overflow-hidden shadow-[0_20px_56px_rgba(0,0,0,0.16)] border border-[#E8E4DE] bg-white"
              style={{ width: 156, height: 116 }}
            >
              <Image src={award.image} alt={award.titleEn} fill className="object-contain p-2" unoptimized />
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
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const items = awards.slice(0, 12)

  return (
    <section className="bg-white py-20 md:py-28 lg:py-36 px-8 lg:px-16 overflow-hidden">
      <div className="max-w-[1290px] mx-auto">

        {/* ── Header ── */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20 lg:mb-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[5px] mb-5"
            >
              Recognition &amp; Excellence
            </motion.p>
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

          {/* Count stat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
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

        {/* ── Desktop: zigzag layout ── */}
        <div className="hidden md:block">
          {items.map((award, i) => (
            <AwardItem key={award.id} award={award} index={i} />
          ))}
        </div>

        {/* ── Mobile: stacked list ── */}
        <div className="md:hidden divide-y divide-[#E5E2DC]">
          {items.map((award, i) => (
            <div key={award.id} className="py-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#C8C4BC] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] border border-[#B1A490]/30 px-2 py-0.5 rounded-full">
                  {award.year}
                </span>
              </div>
              <h3 className="font-[var(--font-playfair)] text-[20px] text-[#1A1A1A]">{award.titleEn}</h3>
              {award.subtitleEn && (
                <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] mt-1">{award.subtitleEn}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 md:mt-20 flex justify-center"
        >
          <Link
            href="/awards"
            className="group inline-flex items-center gap-5 font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[4px] text-[#1A1A1A] hover:text-[#B1A490] transition-colors duration-300"
          >
            <span className="block h-px bg-[#B1A490]/50 w-8 group-hover:w-14 transition-all duration-500" />
            View All Awards
            <span className="block h-px bg-[#B1A490]/50 w-8 group-hover:w-14 transition-all duration-500" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
