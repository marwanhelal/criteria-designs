'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'

interface Award {
  id: string
  titleEn: string
  year: number
  subtitleEn: string | null
  image: string | null
}

interface Props {
  awards: Award[]
  totalCount: number
  countries: string
  since: string
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg,#1a1208 0%,#0d0a05 100%)',
  'linear-gradient(160deg,#0a1020 0%,#060810 100%)',
  'linear-gradient(160deg,#1a100a 0%,#0d0806 100%)',
  'linear-gradient(160deg,#0a1018 0%,#060810 100%)',
  'linear-gradient(160deg,#141008 0%,#0a0804 100%)',
]

// Animated number counter
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 1400
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function AwardsAccordion({ awards, totalCount, countries, since }: Props) {
  const [active, setActive] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false })
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })
  const items = awards.slice(0, 5)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY, visible: true })
  }, [])
  const handleMouseLeave = useCallback(() => {
    setCursor(c => ({ ...c, visible: false }))
  }, [])

  if (items.length === 0) return null

  return (
    <section ref={sectionRef} className="w-full bg-white">

      {/* ── Cursor dot ── */}
      <div
        className="fixed pointer-events-none z-50 w-3 h-3 rounded-full bg-[#B1A490] mix-blend-multiply"
        style={{
          left: cursor.x - 6,
          top: cursor.y - 6,
          opacity: cursor.visible ? 1 : 0,
          transition: 'opacity 0.2s ease, left 0.06s linear, top 0.06s linear',
        }}
      />

      {/* ── Header ── */}
      <div ref={headerRef} className="px-8 lg:px-16 pt-16 pb-6 flex items-end justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px] mb-4"
          >
            Recognition &amp; Excellence
          </motion.p>
          <div className="flex items-center gap-5">
            <motion.span
              initial={{ scaleY: 0 }}
              animate={headerInView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block w-[3px] origin-top bg-[#B1A490]"
              style={{ height: 72 }}
            />
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '110%' }}
                animate={headerInView ? { y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="font-[var(--font-playfair)] text-[52px] md:text-[68px] lg:text-[88px] font-normal text-[#1A1A1A] leading-[1] tracking-[-0.02em]"
              >
                Awards
              </motion.h2>
            </div>
          </div>
        </div>

        {/* Animated total count */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-right mb-2"
        >
          <div className="font-[var(--font-playfair)] text-[56px] md:text-[72px] text-[#1A1A1A] leading-none">
            <Counter target={totalCount} suffix="+" />
          </div>
          <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[4px] mt-1">
            International Awards
          </p>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={headerInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="px-8 lg:px-16 pb-8 flex items-center gap-8 md:gap-12"
      >
        {[
          { value: `${totalCount}+`, label: 'Awards Won' },
          { value: countries, label: 'Countries' },
          { value: `Since ${since}`, label: 'Est.' },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-8 md:gap-12">
            {i > 0 && <span className="w-px h-6 bg-[#1A1A1A]/10" />}
            <div>
              <p className="font-[var(--font-playfair)] text-[22px] md:text-[28px] text-[#1A1A1A] leading-none">
                {stat.value}
              </p>
              <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#1A1A1A]/40 uppercase tracking-[3px] mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}

        <div className="ml-auto">
          <Link
            href="/awards"
            className="font-[var(--font-libre-franklin)] text-[11px] text-[#1A1A1A]/40 uppercase tracking-[3px] hover:text-[#B1A490] transition-colors duration-300 border-b border-[#1A1A1A]/15 hover:border-[#B1A490] pb-0.5"
          >
            View All →
          </Link>
        </div>
      </motion.div>

      {/* ── Accordion panels ── */}
      <div
        className="flex w-full"
        style={{ height: 'clamp(480px, 70vh, 820px)' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((award, i) => (
          <motion.div
            key={award.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden cursor-none"
            style={{
              flex: i === active ? 6 : 1,
              transition: 'flex 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
              minWidth: 0,
              borderRight: i < items.length - 1 ? '1px solid rgba(177,164,144,0.22)' : 'none',
            }}
            onMouseEnter={() => setActive(i)}
          >
            {/* Background */}
            {award.image ? (
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover"
                style={{
                  transform: i === active ? 'scale(1.02)' : 'scale(1.1)',
                  transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
                }}
                unoptimized
                priority={i === 0}
              />
            ) : (
              <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }} />
            )}

            {/* Gold top-border on active panel */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] bg-[#B1A490] origin-left"
              style={{
                transform: i === active ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />

            {/* Bottom gradient for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Large decorative index number behind collapsed label */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ opacity: i === active ? 0 : 0.06, transition: 'opacity 0.4s ease' }}
            >
              <span
                className="font-[var(--font-playfair)] text-white select-none"
                style={{ fontSize: 'clamp(80px, 12vw, 160px)', lineHeight: 1 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* ── COLLAPSED: vertical label ── */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: i === active ? 0 : 1, transition: 'opacity 0.35s ease', pointerEvents: 'none' }}
            >
              <div className="flex flex-col items-center gap-4">
                <span
                  className="font-[var(--font-libre-franklin)] text-[11px] font-medium text-white/80 uppercase tracking-[0.3em] whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {award.titleEn}
                </span>
                <span className="block w-px h-8 bg-[#B1A490]/50" />
                <span
                  className="font-[var(--font-playfair)] text-[16px] text-[#B1A490] whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {award.year}
                </span>
              </div>
            </div>

            {/* ── Index badge top-left ── */}
            <div className="absolute top-5 left-5">
              <span className="font-[var(--font-libre-franklin)] text-[11px] font-medium text-white/40 tracking-[0.15em]">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* ── EXPANDED: bottom content ── */}
            <AnimatePresence>
              {i === active && (
                <motion.div
                  key={`content-${award.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12"
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="block h-[2px] bg-[#B1A490] w-14 origin-left mb-5"
                  />

                  {/* Year — large and clear */}
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-[var(--font-playfair)] text-[40px] md:text-[52px] text-[#B1A490] leading-none">
                      {award.year}
                    </span>
                    <span className="font-[var(--font-libre-franklin)] text-[12px] text-white/50 uppercase tracking-[0.3em]">
                      Award
                    </span>
                  </div>

                  {/* Title — big and clear */}
                  <h3 className="font-[var(--font-playfair)] text-[24px] md:text-[32px] lg:text-[40px] text-white leading-[1.1] max-w-[580px] mb-3">
                    {award.titleEn}
                  </h3>

                  {/* Subtitle */}
                  {award.subtitleEn && (
                    <p className="font-[var(--font-libre-franklin)] text-[14px] text-white/60 leading-relaxed max-w-[460px]">
                      {award.subtitleEn}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2 py-5 bg-white">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Award ${i + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 6,
                height: 3,
                background: i === active ? '#B1A490' : 'rgba(0,0,0,0.15)',
              }}
            />
          </button>
        ))}
      </div>

    </section>
  )
}
