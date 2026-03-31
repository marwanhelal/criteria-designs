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

interface Props {
  awards: Award[]
  totalCount: number
  countries: string
  since: string
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg,#2a2420 0%,#1a1410 100%)',
  'linear-gradient(160deg,#1e2228 0%,#141820 100%)',
  'linear-gradient(160deg,#261c14 0%,#1a1410 100%)',
  'linear-gradient(160deg,#1a2028 0%,#121820 100%)',
  'linear-gradient(160deg,#221e14 0%,#18160c 100%)',
]

export default function AwardsAccordion({ awards, totalCount, countries, since }: Props) {
  const [active, setActive] = useState(0)
  const items = awards.slice(0, 5)

  if (items.length === 0) return null

  const sinceStr = since || '2001'

  return (
    <section data-navbar-dark className="w-full bg-white relative overflow-hidden">

      {/* Header */}
      <div className="px-[clamp(1rem,6vw,8rem)] pt-12 pb-0">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-black/[0.08]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] uppercase tracking-[4px] border border-[#B1A490]/40 rounded-full px-3 py-1">
                Award
              </span>
              <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#9A9A94] uppercase tracking-[4px] border border-[#9A9A94]/30 rounded-full px-3 py-1">
                Published Paper
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="font-[var(--font-playfair)] italic font-normal text-[#1A1A1A] leading-[1] tracking-[-0.01em]"
              style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}
            >
              Recognitions
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[var(--font-open-sans)] text-[13px] text-[#888] leading-relaxed max-w-[320px] md:text-right pb-1"
          >
            A legacy of international recognition in architecture.
          </motion.p>
        </div>
      </div>

      {/* Accordion panels */}
      <div className="px-[clamp(1rem,6vw,8rem)] pt-8 pb-8">
        <div
          className="flex w-full overflow-hidden"
          style={{ height: 'clamp(440px, 62vh, 760px)' }}
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
                marginRight: i < items.length - 1 ? '3px' : 0,
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
                      ? 'grayscale(0%) brightness(0.78)'
                      : 'grayscale(100%) brightness(0.3)',
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
                    filter: i === active ? 'brightness(1.4)' : 'brightness(1)',
                    transition: 'filter 0.85s ease',
                  }}
                />
              )}

              {/* Bottom gradient (active only) */}
              <div
                className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                  opacity: i === active ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />

              {/* Veil on inactive */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'rgba(247,245,241,0.15)',
                  opacity: i === active ? 0 : 1,
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
                  <span className="block w-px h-8 bg-white/20" />
                  <span
                    className="font-[var(--font-libre-franklin)] text-white/40 uppercase whitespace-nowrap"
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
                      <span className="font-[var(--font-libre-franklin)] text-[9px] text-white/30 tracking-[0.3em]">
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
        <div className="flex items-center justify-center pt-8 mt-1 border-t border-black/[0.08]">
          <Link href="/awards" className="group relative inline-block">
            <span
              className="font-[var(--font-playfair)] italic font-normal text-[#1A1A1A]/20 group-hover:text-[#B1A490] transition-colors duration-500"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-0.02em' }}
            >
              View All Awards
            </span>
            <span className="absolute bottom-0 left-0 h-[1.5px] bg-[#B1A490] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </Link>
        </div>
      </div>

    </section>
  )
}
