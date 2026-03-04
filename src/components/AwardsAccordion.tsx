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
  'linear-gradient(160deg,#1a1208 0%,#0d0a05 100%)',
  'linear-gradient(160deg,#0a1020 0%,#060810 100%)',
  'linear-gradient(160deg,#1a100a 0%,#0d0806 100%)',
  'linear-gradient(160deg,#0a1018 0%,#060810 100%)',
  'linear-gradient(160deg,#141008 0%,#0a0804 100%)',
]

export default function AwardsAccordion({ awards }: { awards: Award[] }) {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = awards.slice(0, 5)

  if (items.length === 0) return null

  return (
    <section className="bg-[#0a0a0a]">

      {/* Header — padded */}
      <div ref={ref} className="px-8 lg:px-16 pt-20 md:pt-28 lg:pt-32 pb-10 md:pb-12">
        <div className="max-w-[1290px] mx-auto flex items-end justify-between">
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
                className="font-[var(--font-playfair)] text-[44px] md:text-[60px] lg:text-[80px] font-normal text-white leading-[1] tracking-[-0.02em]"
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
      </div>

      {/* Accordion panels — full bleed */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex gap-[1px] w-full"
        style={{ height: 'clamp(520px, 75vh, 860px)' }}
      >
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
            {/* Background */}
            {award.image ? (
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover"
                style={{
                  transform: i === active ? 'scale(1.02)' : 'scale(1.12)',
                  transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
                  filter: i === active ? 'brightness(0.75)' : 'brightness(0.45)',
                }}
                unoptimized
                priority={i === 0}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}
              >
                {/* Subtle gold grid lines decoration */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: 'linear-gradient(#B1A490 1px, transparent 1px), linear-gradient(90deg, #B1A490 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full border border-[#B1A490]"
                    style={{
                      width: 96, height: 96,
                      opacity: i === active ? 0.25 : 0.08,
                      transition: 'opacity 0.6s ease'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bottom gradient — only bottom third, lighter */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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
                  className="font-[var(--font-libre-franklin)] text-[9px] text-white/50 uppercase tracking-[0.35em] whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {award.titleEn}
                </span>
                <span className="block w-px h-8 bg-[#B1A490]/25" />
                <span
                  className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490]/60 uppercase tracking-[0.35em]"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {award.year}
                </span>
              </div>
            </div>

            {/* ── Index badge ── */}
            <div className="absolute top-6 left-6">
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/25 tracking-[0.15em]">
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
                  {/* Gold accent line — animates in */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="block h-[1px] bg-[#B1A490] w-12 origin-left mb-5"
                  />

                  {/* Year · Award */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[0.3em]">
                      {award.year}
                    </span>
                    <span className="w-[3px] h-[3px] rounded-full bg-[#B1A490]/40" />
                    <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/30 uppercase tracking-[0.3em]">
                      Award
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-[var(--font-playfair)] text-[22px] md:text-[30px] lg:text-[38px] text-white leading-[1.15] max-w-[560px]">
                    {award.titleEn}
                  </h3>

                  {/* Subtitle */}
                  {award.subtitleEn && (
                    <p className="font-[var(--font-libre-franklin)] text-[12px] text-white/45 leading-relaxed max-w-[420px] mt-3">
                      {award.subtitleEn}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2 py-6">
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
                background: i === active ? '#B1A490' : 'rgba(255,255,255,0.12)',
              }}
            />
          </button>
        ))}
      </div>

    </section>
  )
}
