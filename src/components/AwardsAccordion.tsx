'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface AwardImage { url: string; alt?: string }

interface Award {
  id: string
  titleEn: string
  year: number
  subtitleEn: string | null
  image: string | null
  images?: AwardImage[]
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

function getImageList(award: Award): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  if (award.image) { seen.add(award.image); result.push(award.image) }
  for (const img of award.images ?? []) {
    if (!seen.has(img.url)) { seen.add(img.url); result.push(img.url) }
  }
  return result
}

export default function AwardsAccordion({ awards }: Props) {
  const [active, setActive] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)

  const items = awards.slice(0, 5)
  const activeImages = items.length > 0
    ? getImageList(items[Math.min(active, items.length - 1)])
    : []

  // All hooks must come before any early return (Rules of Hooks)
  useEffect(() => {
    setImgIdx(0)
  }, [active])

  useEffect(() => {
    if (activeImages.length <= 1) return
    const interval = setInterval(() => {
      setImgIdx(prev => (prev + 1) % activeImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [active, activeImages.length])

  if (items.length === 0) return null

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
              className="flex items-center gap-4 mb-4"
            >
              <span className="flex items-center gap-[7px] font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[2px]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#B1A490] shrink-0" />
                Award
              </span>
              <span className="w-px h-3 bg-[#D8D4CE]" />
              <span className="flex items-center gap-[7px] font-[var(--font-libre-franklin)] text-[10px] text-[#9A9A94] uppercase tracking-[2px]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#C8C4BE] shrink-0" />
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
          className="flex w-full gap-[6px]"
          style={{ height: 'clamp(440px, 62vh, 760px)' }}
        >
          {items.map((award, i) => {
            const allImages = getImageList(award)
            const isActive = i === active
            const displayUrl = isActive
              ? (allImages[imgIdx] ?? allImages[0] ?? null)
              : (allImages[0] ?? null)

            return (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: i * 0.07 }}
                className="relative overflow-hidden cursor-pointer rounded-2xl"
                style={{
                  flex: isActive ? 8 : 1,
                  transition: 'flex 0.85s cubic-bezier(0.76, 0, 0.24, 1)',
                  minWidth: 0,
                }}
                onMouseEnter={() => setActive(i)}
              >
                {/* Background — AnimatePresence crossfade between images */}
                {displayUrl ? (
                  <AnimatePresence mode="sync" initial={false}>
                    <motion.div
                      key={displayUrl}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="absolute inset-0"
                      style={{ zIndex: 1 }}
                    >
                      <Image
                        src={displayUrl}
                        alt={award.titleEn}
                        fill
                        sizes="(max-width: 768px) 100vw, 70vw"
                        className="object-cover"
                        style={{
                          transform: isActive ? 'scale(1.03)' : 'scale(1.1)',
                          filter: isActive
                            ? 'none'
                            : 'grayscale(100%) brightness(0.3)',
                          transition: 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), filter 0.85s ease',
                        }}
                        unoptimized
                        priority={i === 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
                      filter: isActive ? 'brightness(1.4)' : 'brightness(1)',
                      transition: 'filter 0.85s ease',
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Subtle gradient only on inactive panels for depth */}
                {!isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                      zIndex: 5,
                    }}
                  />
                )}
                {/* Veil on inactive */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'rgba(247,245,241,0.15)',
                    opacity: isActive ? 0 : 1,
                    transition: 'opacity 0.85s ease',
                    zIndex: 5,
                  }}
                />
                {/* Gold top border */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] bg-[#B1A490] origin-left pointer-events-none"
                  style={{
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                    zIndex: 10,
                  }}
                />

                {/* Dot indicator (active panel, multiple images) */}
                {isActive && allImages.length > 1 && (
                  <div
                    className="absolute top-4 right-4 flex gap-[5px] pointer-events-none"
                    style={{ zIndex: 20 }}
                  >
                    {allImages.map((_, di) => (
                      <span
                        key={di}
                        className="block rounded-full transition-all duration-500"
                        style={{
                          width: di === imgIdx ? 16 : 5,
                          height: 5,
                          background: di === imgIdx ? '#B1A490' : 'rgba(255,255,255,0.35)',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Collapsed: vertical label */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    opacity: isActive ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                    zIndex: 15,
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
                  {isActive && (
                    <motion.div
                      key={`content-${award.id}`}
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12"
                      style={{ zIndex: 20, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="flex items-center gap-3 mb-5"
                      >
                        <span className="font-[var(--font-libre-franklin)] text-[9px] text-white/35 tracking-[0.28em]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="block w-8 h-px bg-white/20" />
                        <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] tracking-[0.28em]">
                          {award.year}
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-10 h-[2px] bg-[#B1A490] mb-5 origin-left"
                      />

                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.26 }}
                        className="font-[var(--font-playfair)] italic font-normal text-white leading-[1.15] mb-3"
                        style={{ fontSize: 'clamp(20px, 2.6vw, 40px)', maxWidth: 520 }}
                      >
                        {award.titleEn}
                      </motion.h3>

                      {award.subtitleEn && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.32 }}
                          className="font-[var(--font-libre-franklin)] text-[11px] md:text-[12px] text-white/40 tracking-[0.06em] uppercase max-w-[380px]"
                        >
                          {award.subtitleEn}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center pt-8 mt-1 border-t border-black/[0.08]">
          <Link href="/awards" className="group relative inline-block">
            <span
              className="font-[var(--font-playfair)] italic font-normal text-[#1A1A1A]/20 group-hover:text-[#B1A490] transition-colors duration-500"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-0.02em' }}
            >
              View Recognitions
            </span>
            <span className="absolute bottom-0 left-0 h-[1.5px] bg-[#B1A490] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </Link>
        </div>
      </div>

    </section>
  )
}
