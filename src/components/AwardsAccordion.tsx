'use client'

import { useState, useRef, useEffect } from 'react'
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
  'linear-gradient(160deg,#1c1408 0%,#0d0a04 100%)',
  'linear-gradient(160deg,#081018 0%,#050a12 100%)',
  'linear-gradient(160deg,#1a0e08 0%,#100806 100%)',
  'linear-gradient(160deg,#0a1018 0%,#060c14 100%)',
  'linear-gradient(160deg,#141008 0%,#0c0a04 100%)',
]

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 1600
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
  const items = awards.slice(0, 5)

  if (items.length === 0) return null

  const countriesNum = parseInt(countries?.replace(/\D/g, '') || '12')
  const sinceStr = since || '2001'

  return (
    <section className="w-full bg-[#0C0C0C] relative overflow-hidden">

      {/* Header */}
      <div className="px-8 md:px-16 lg:px-24 pt-20 pb-0">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 pb-10 border-b border-white/[0.07]">

          {/* Left: title block */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[6px] mb-6"
            >
              Recognition &amp; Excellence
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="flex items-baseline gap-5"
            >
              <Link href="/awards" className="group relative inline-block">
                <h2
                  className="font-[var(--font-playfair)] italic font-normal text-white group-hover:text-[#B1A490] leading-[0.88] tracking-[-0.03em] transition-colors duration-500 cursor-pointer"
                  style={{ fontSize: 'clamp(64px, 8vw, 108px)' }}
                >
                  Awards
                </h2>
                <span className="absolute bottom-0 left-0 h-[2px] bg-[#B1A490] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </Link>
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/20 uppercase tracking-[3px] mb-1">
                {sinceStr} — Present
              </span>
            </motion.div>
          </div>

          {/* Right: stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="flex items-end gap-10 lg:gap-16 pb-1"
          >
            <div>
              <p className="font-[var(--font-playfair)] text-[#B1A490] leading-none tabular-nums"
                style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
                <AnimatedNumber target={totalCount} suffix="+" />
              </p>
              <p className="font-[var(--font-libre-franklin)] text-[10px] text-white/30 uppercase tracking-[3px] mt-2">
                Awards Won
              </p>
            </div>
            <div className="w-px h-10 bg-white/[0.08] self-center" />
            <div>
              <p className="font-[var(--font-playfair)] text-[#B1A490] leading-none tabular-nums"
                style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
                <AnimatedNumber target={countriesNum} suffix="+" />
              </p>
              <p className="font-[var(--font-libre-franklin)] text-[10px] text-white/30 uppercase tracking-[3px] mt-2">
                Countries
              </p>
            </div>
            <div className="w-px h-10 bg-white/[0.08] self-center" />
            <div>
              <p className="font-[var(--font-playfair)] text-[#B1A490] leading-none"
                style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
                {sinceStr}
              </p>
              <p className="font-[var(--font-libre-franklin)] text-[10px] text-white/30 uppercase tracking-[3px] mt-2">
                Est. Year
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Accordion panels */}
      <div className="px-8 md:px-16 lg:px-24 pt-6 pb-8">
        <div
          className="flex w-full overflow-hidden"
          style={{ height: 'clamp(480px, 68vh, 820px)' }}
        >
          {items.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: i * 0.07 }}
              className="relative overflow-hidden cursor-pointer"
              style={{
                flex: i === active ? 8 : 1,
                transition: 'flex 0.85s cubic-bezier(0.76, 0, 0.24, 1)',
                minWidth: 0,
                marginRight: i < items.length - 1 ? '2px' : 0,
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
                    transform: i === active ? 'scale(1.03)' : 'scale(1.1)',
                    filter: i === active
                      ? 'grayscale(0%) brightness(0.82)'
                      : 'grayscale(100%) brightness(0.25)',
                    transition: 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), filter 0.85s ease',
                  }}
                  unoptimized
                  priority={i === 0}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
                    filter: i === active ? 'brightness(1.6)' : 'brightness(1)',
                    transition: 'filter 0.85s ease',
                  }}
                />
              )}

              {/* Bottom gradient (active only) */}
              <div
                className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
                  opacity: i === active ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />

              {/* Dark veil on inactive */}
              <div
                className="absolute inset-0 bg-[#0C0C0C] pointer-events-none"
                style={{
                  opacity: i === active ? 0 : 0.55,
                  transition: 'opacity 0.85s ease',
                }}
              />

              {/* Gold top border */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] bg-[#B1A490] origin-left pointer-events-none"
                style={{
                  transform: i === active ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />

              {/* Collapsed: vertical label */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: i === active ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <span
                    className="font-[var(--font-playfair)] text-[#B1A490]"
                    style={{
                      fontSize: 'clamp(12px, 1.4vw, 17px)',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {award.year}
                  </span>
                  <span className="block w-px h-8 bg-white/15" />
                  <span
                    className="font-[var(--font-libre-franklin)] text-white/35 uppercase whitespace-nowrap"
                    style={{
                      fontSize: 'clamp(7px, 0.75vw, 9px)',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      letterSpacing: '0.22em',
                    }}
                  >
                    {award.titleEn.length > 22 ? award.titleEn.slice(0, 22) + '…' : award.titleEn}
                  </span>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {i === active && (
                  <motion.div
                    key={`content-${award.id}`}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12"
                  >
                    {/* Index line */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="font-[var(--font-libre-franklin)] text-[9px] text-white/25 tracking-[0.3em]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="block w-12 h-px bg-white/15" />
                    </div>

                    {/* Year pill */}
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.22 }}
                      className="inline-block font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[4px] border border-[#B1A490]/30 rounded-full px-3 py-1 mb-4"
                    >
                      {award.year}
                    </motion.span>

                    {/* Title */}
                    <h3
                      className="font-[var(--font-playfair)] text-white leading-[1.1] mb-3"
                      style={{ fontSize: 'clamp(22px, 2.8vw, 42px)', maxWidth: 540 }}
                    >
                      {award.titleEn}
                    </h3>

                    {/* Subtitle */}
                    {award.subtitleEn && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.28 }}
                        className="font-[var(--font-libre-franklin)] text-[13px] text-white/45 leading-relaxed max-w-[420px]"
                      >
                        {award.subtitleEn}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-5 mt-1 border-t border-white/[0.07]">

          {/* Dots */}
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Award ${i + 1}`}
                className="py-2 px-0.5"
              >
                <span
                  className="block rounded-full transition-all duration-400"
                  style={{
                    width: i === active ? 30 : 5,
                    height: 2,
                    background: i === active ? '#B1A490' : 'rgba(255,255,255,0.18)',
                  }}
                />
              </button>
            ))}
          </div>

          {/* View All */}
          <Link
            href="/awards"
            className="group inline-flex items-center gap-3 font-[var(--font-libre-franklin)] text-[11px] text-white/40 hover:text-white uppercase tracking-[3px] transition-colors duration-300"
          >
            View All Awards
            <span className="w-6 h-px bg-white/20 group-hover:w-10 group-hover:bg-[#B1A490] transition-all duration-350" />
          </Link>
        </div>
      </div>

    </section>
  )
}
