'use client'

import { useState, useRef } from 'react'
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

const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg,#1c1a16 0%,#0e0e0e 100%)',
  'linear-gradient(160deg,#141c1f 0%,#0e0e0e 100%)',
  'linear-gradient(160deg,#1a1616 0%,#0e0e0e 100%)',
  'linear-gradient(160deg,#141420 0%,#0e0e0e 100%)',
  'linear-gradient(160deg,#1a1c14 0%,#0e0e0e 100%)',
]

export default function AwardsAccordion({ awards }: { awards: Award[] }) {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const items = awards.slice(0, 5)

  if (items.length === 0) return null

  return (
    <section className="bg-[#0d0d0d] py-20 md:py-28 lg:py-32 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">

        {/* Header */}
        <div ref={ref} className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[5px] mb-4"
            >
              Recognition &amp; Excellence
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '105%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="font-[var(--font-playfair)] text-[44px] md:text-[60px] lg:text-[72px] font-normal text-white leading-[1] tracking-[-0.02em]"
              >
                Awards
              </motion.h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/awards"
              className="font-[var(--font-libre-franklin)] text-[11px] text-white/30 uppercase tracking-[3px] hover:text-[#B1A490] transition-colors duration-300"
            >
              View All →
            </Link>
          </motion.div>
        </div>

        {/* Accordion panels */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-[2px] rounded-[2px] overflow-hidden"
          style={{ height: 'clamp(420px, 60vh, 680px)' }}
        >
          {items.map((award, i) => (
            <div
              key={award.id}
              className="relative overflow-hidden cursor-pointer"
              style={{
                flex: i === active ? 5 : 1,
                transition: 'flex 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
                minWidth: 0,
              }}
              onMouseEnter={() => setActive(i)}
            >
              {/* Background image */}
              {award.image ? (
                <Image
                  src={award.image}
                  alt={award.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  style={{
                    transform: i === active ? 'scale(1)' : 'scale(1.1)',
                    transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
                  }}
                  unoptimized
                  priority={i === 0}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}
                />
              )}

              {/* Gradient overlay — heavier at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20 transition-opacity duration-500" />
              {/* Extra left-side vignette for active */}
              {i === active && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              )}

              {/* ── COLLAPSED: vertical label ── */}
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
                    className="font-[var(--font-libre-franklin)] text-[9px] text-white/40 uppercase tracking-[0.3em] whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {award.titleEn}
                  </span>
                  <span className="block w-px h-6 bg-[#B1A490]/30" />
                  <span
                    className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490]/50 uppercase tracking-[0.3em]"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {award.year}
                  </span>
                </div>
              </div>

              {/* ── Index badge ── */}
              <div className="absolute top-5 left-5">
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/30 tracking-[0.1em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* ── EXPANDED: bottom content ── */}
              <AnimatePresence>
                {i === active && (
                  <motion.div
                    key={`content-${award.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10"
                  >
                    {/* Year · Award */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[0.22em]">
                        {award.year}
                      </span>
                      <span className="w-[3px] h-[3px] rounded-full bg-[#B1A490]/50" />
                      <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/35 uppercase tracking-[0.22em]">
                        Award
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-[var(--font-playfair)] text-[20px] md:text-[26px] lg:text-[30px] text-white leading-[1.2] mb-2 max-w-[480px]">
                      {award.titleEn}
                    </h3>

                    {/* Subtitle */}
                    {award.subtitleEn && (
                      <p className="font-[var(--font-libre-franklin)] text-[12px] text-white/50 leading-relaxed max-w-[380px] mt-2">
                        {award.subtitleEn}
                      </p>
                    )}

                    {/* Gold accent line */}
                    <div className="mt-5 flex items-center gap-3">
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="block h-px bg-[#B1A490]/60 w-10 origin-left"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Panel count dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300"
              aria-label={`Award ${i + 1}`}
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 20 : 6,
                  height: 4,
                  background: i === active ? '#B1A490' : 'rgba(255,255,255,0.15)',
                }}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
