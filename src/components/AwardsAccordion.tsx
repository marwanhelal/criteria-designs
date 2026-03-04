'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Award {
  id: string
  titleEn: string
  year: number
  subtitleEn: string | null
  image: string | null
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg,#1a1208 0%,#0d0a05 100%)',
  'linear-gradient(160deg,#0a1020 0%,#060810 100%)',
  'linear-gradient(160deg,#1a100a 0%,#0d0806 100%)',
  'linear-gradient(160deg,#0a1018 0%,#060810 100%)',
  'linear-gradient(160deg,#141008 0%,#0a0804 100%)',
]

export default function AwardsAccordion({ awards }: { awards: Award[] }) {
  const [active, setActive] = useState(0)
  const items = awards.slice(0, 5)

  if (items.length === 0) return null

  return (
    <section className="relative w-full bg-black" style={{ height: 'clamp(560px, 80vh, 900px)' }}>

      {/* Accordion panels — fully fills the section */}
      <div className="flex w-full h-full gap-[1px]">
        {items.map((award, i) => (
          <div
            key={award.id}
            className="relative overflow-hidden cursor-pointer"
            style={{
              flex: i === active ? 6 : 1,
              transition: 'flex 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
              minWidth: 0,
            }}
            onMouseEnter={() => setActive(i)}
          >
            {/* Background image — full original color, no darkening */}
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
              <div
                className="absolute inset-0"
                style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}
              >
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: 'linear-gradient(#B1A490 1px, transparent 1px), linear-gradient(90deg, #B1A490 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full border border-[#B1A490]"
                    style={{ width: 96, height: 96, opacity: i === active ? 0.25 : 0.08, transition: 'opacity 0.6s ease' }}
                  />
                </div>
              </div>
            )}

            {/* Very subtle bottom gradient — only for text readability, not image darkening */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

            {/* ── COLLAPSED: vertical label ── */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: i === active ? 0 : 1,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <span
                  className="font-[var(--font-libre-franklin)] text-[9px] text-white/60 uppercase tracking-[0.35em] whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {award.titleEn}
                </span>
                <span className="block w-px h-8 bg-[#B1A490]/40" />
                <span
                  className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490]/70 uppercase tracking-[0.35em]"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {award.year}
                </span>
              </div>
            </div>

            {/* ── Index badge ── */}
            <div className="absolute top-5 left-5">
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/40 tracking-[0.15em]">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* ── EXPANDED: bottom content ── */}
            <AnimatePresence>
              {i === active && (
                <motion.div
                  key={`content-${award.id}`}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-14"
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="block h-[1px] bg-[#B1A490] w-12 origin-left mb-4"
                  />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[0.3em]">
                      {award.year}
                    </span>
                    <span className="w-[3px] h-[3px] rounded-full bg-[#B1A490]/40" />
                    <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/40 uppercase tracking-[0.3em]">
                      Award
                    </span>
                  </div>
                  <h3 className="font-[var(--font-playfair)] text-[22px] md:text-[30px] lg:text-[38px] text-white leading-[1.15] max-w-[560px]">
                    {award.titleEn}
                  </h3>
                  {award.subtitleEn && (
                    <p className="font-[var(--font-libre-franklin)] text-[12px] text-white/50 leading-relaxed max-w-[420px] mt-3">
                      {award.subtitleEn}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Header overlay — top-left corner over the panels */}
      <div className="absolute top-0 left-0 right-0 px-8 lg:px-14 pt-10 flex items-start justify-between pointer-events-none z-10">
        <div>
          <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[5px] mb-3">
            Recognition &amp; Excellence
          </p>
          <h2 className="font-[var(--font-playfair)] text-[44px] md:text-[60px] lg:text-[80px] font-normal text-white leading-[1] tracking-[-0.02em]">
            Awards
          </h2>
        </div>
        <Link
          href="/awards"
          className="font-[var(--font-libre-franklin)] text-[11px] text-white/50 uppercase tracking-[3px] hover:text-[#B1A490] transition-colors duration-300 pointer-events-auto mt-4"
        >
          View All →
        </Link>
      </div>

      {/* Navigation dots — bottom center */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 z-10">
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
                width: i === active ? 24 : 6,
                height: 3,
                background: i === active ? '#B1A490' : 'rgba(255,255,255,0.25)',
              }}
            />
          </button>
        ))}
      </div>

    </section>
  )
}
