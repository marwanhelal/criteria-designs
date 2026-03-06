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
  'linear-gradient(160deg,#2a1f10 0%,#1a1208 100%)',
  'linear-gradient(160deg,#0f1825 0%,#0a1018 100%)',
  'linear-gradient(160deg,#251510 0%,#180e08 100%)',
  'linear-gradient(160deg,#0f1520 0%,#0a1018 100%)',
  'linear-gradient(160deg,#1e1a10 0%,#141008 100%)',
]

function Counter({ target }: { target: number }) {
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

  return <span ref={ref}>{count}</span>
}

export default function AwardsAccordion({ awards, totalCount, countries, since }: Props) {
  const [active, setActive] = useState(0)
  const items = awards.slice(0, 5)

  if (items.length === 0) return null

  return (
    <section className="w-full bg-white">

      {/* ── Header ── */}
      <div className="px-8 md:px-16 lg:px-24 pt-16 pb-6">
        <div className="flex items-end justify-between">

          {/* Left: label + title */}
          <div>
            <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px] mb-4">
              Recognition &amp; Excellence
            </p>
            <div className="flex items-center gap-3">
              <span className="block w-[3px] bg-[#1A1A1A]" style={{ height: 48 }} />
              <h2 className="font-[var(--font-playfair)] text-[34px] md:text-[42px] lg:text-[50px] font-normal text-[#1A1A1A] leading-[1] tracking-[-0.02em]">
                Awards
              </h2>
            </div>
          </div>


        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-8 mt-8 pt-6 border-t border-[#E8E8E4]">
          {[
            { value: `${totalCount}+`, label: 'Awards Won' },
            { value: countries || '12+', label: 'Countries' },
            { value: since || '2001', label: 'Est.' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-8">
              {i > 0 && <span className="w-px h-6 bg-[#1A1A1A]/10" />}
              <div>
                <p className="font-[var(--font-playfair)] text-[22px] md:text-[28px] text-[#1A1A1A] leading-none">
                  {stat.value}
                </p>
                <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#888] uppercase tracking-[3px] mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accordion panels — with side padding like Nawy ── */}
      <div className="px-8 md:px-16 lg:px-24 pb-6">
        <div
          className="flex w-full rounded-sm overflow-hidden"
          style={{ height: 'clamp(460px, 65vh, 780px)' }}
        >
          {items.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="relative overflow-hidden cursor-pointer"
              style={{
                flex: i === active ? 7 : 1,
                transition: 'flex 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
                minWidth: 0,
                marginRight: i < items.length - 1 ? '3px' : 0,
              }}
              onMouseEnter={() => setActive(i)}
            >
              {/* Background image */}
              {award.image ? (
                <Image
                  src={award.image}
                  alt={award.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="object-cover"
                  style={{
                    transform: i === active ? 'scale(1.03)' : 'scale(1.08)',
                    filter: i === active ? 'grayscale(0%) brightness(1)' : 'grayscale(80%) brightness(0.7)',
                    transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1), filter 0.75s ease',
                  }}
                  unoptimized
                  priority={i === 0}
                />
              ) : (
                <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }} />
              )}

              {/* Gold top-border on active */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] bg-[#B1A490] origin-left"
                style={{
                  transform: i === active ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />

              {/* Bottom gradient — only on active for text */}
              {i === active && (
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              )}

              {/* Large faint index number — collapsed only */}
              {i !== active && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span
                    className="font-[var(--font-playfair)] text-white/20"
                    style={{ fontSize: 'clamp(48px, 6vw, 90px)', lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Collapsed: vertical label */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: i === active ? 0 : 1,
                  transition: 'opacity 0.35s ease',
                  pointerEvents: 'none',
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <span
                    className="font-[var(--font-libre-franklin)] text-[10px] font-medium text-white uppercase tracking-[0.3em] whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {award.titleEn}
                  </span>
                  <span className="block w-px h-6 bg-white/40" />
                  <span
                    className="font-[var(--font-playfair)] text-[15px] text-white/90 whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {award.year}
                  </span>
                </div>
              </div>

              {/* Index badge top-left */}
              <div className="absolute top-5 left-5">
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/50 tracking-[0.15em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Expanded: bottom content */}
              <AnimatePresence>
                {i === active && (
                  <motion.div
                    key={`content-${award.id}`}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 right-0 p-8 md:p-10"
                  >
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.45, delay: 0.2 }}
                      className="block h-[2px] bg-[#B1A490] w-10 origin-left mb-4"
                    />

                    {/* Year */}
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-[var(--font-playfair)] text-[38px] md:text-[50px] text-[#B1A490] leading-none">
                        {award.year}
                      </span>
                      <span className="font-[var(--font-libre-franklin)] text-[11px] text-white/50 uppercase tracking-[0.3em]">
                        Award
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-[var(--font-playfair)] text-[24px] md:text-[32px] lg:text-[38px] text-white leading-[1.15] max-w-[560px] mb-3">
                      {award.titleEn}
                    </h3>

                    {/* Subtitle */}
                    {award.subtitleEn && (
                      <p className="font-[var(--font-libre-franklin)] text-[13px] text-white/60 leading-relaxed max-w-[440px]">
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
        <div className="flex items-center justify-center gap-2 pt-5">
          {items.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Award ${i + 1}`}>
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 28 : 6,
                  height: 3,
                  background: i === active ? '#1A1A1A' : 'rgba(0,0,0,0.15)',
                }}
              />
            </button>
          ))}
        </div>

        {/* View All Awards — below panels */}
        <div className="flex items-center justify-between pt-8 border-t border-[#E8E8E4] mt-6">
          <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#888] uppercase tracking-[4px]">
            {totalCount}+ International Awards
          </p>
          <Link
            href="/awards"
            className="group inline-flex items-center gap-3 font-[var(--font-libre-franklin)] text-[12px] text-[#1A1A1A] uppercase tracking-[3px]"
          >
            <span className="relative">
              View All Awards
              <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-[#B1A490] transition-all duration-400 ease-out" />
            </span>
            <span className="w-6 h-px bg-[#1A1A1A] group-hover:w-10 transition-all duration-300" />
          </Link>
        </div>
      </div>

    </section>
  )
}
