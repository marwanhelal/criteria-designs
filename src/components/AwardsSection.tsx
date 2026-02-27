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

/* ── Single award card ─────────────────────────────────────────────── */
function AwardCard({
  award,
  size,
}: {
  award: Award
  size: 'large' | 'small'
}) {
  const [hovered, setHovered] = useState(false)

  const isLarge = size === 'large'

  return (
    <div
      className="relative group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <p className="font-[var(--font-open-sans)] text-[13px] text-[#181C23]/40 mb-2">
        {award.year}
      </p>

      {/* Award name — large serif for featured, smaller for regular */}
      <h3
        className={`font-[var(--font-playfair)] text-[#181C23] leading-[1.2] ${
          isLarge
            ? 'text-[22px] md:text-[26px] lg:text-[30px] font-normal'
            : 'text-[15px] md:text-[16px] font-semibold'
        }`}
      >
        {award.titleEn}
      </h3>

      {/* Subtitle */}
      {award.subtitleEn && (
        <p
          className={`font-[var(--font-open-sans)] text-[#181C23]/45 mt-1 ${
            isLarge ? 'text-[14px]' : 'text-[12px]'
          }`}
        >
          {award.subtitleEn}
        </p>
      )}

      {/* Separator line */}
      <div className={`w-full h-px bg-[#181C23]/12 ${isLarge ? 'mt-5' : 'mt-4'}`} />

      {/* Hover image — positioned inside the card, top-right area */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 8, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            exit={{ opacity: 0, y: 8, rotate: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-0 z-20 pointer-events-none"
            style={{
              width: isLarge ? 160 : 120,
              height: isLarge ? 120 : 90,
            }}
          >
            <div className="w-full h-full rounded-md overflow-hidden shadow-lg border border-white/60">
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Main section ──────────────────────────────────────────────────── */
export default function AwardsSection({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null

  const items = awards.slice(0, 12)

  // Split into rows matching the reference layout:
  // Row 1: 2 large cards
  // Row 2: 4 small cards
  // Row 3: 1 large + 3 small (or just fill remaining)
  const row1 = items.slice(0, 2)
  const row2 = items.slice(2, 6)
  const row3Large = items.slice(6, 7)
  const row3Small = items.slice(7, 10)
  const remaining = items.slice(10)

  return (
    <section data-navbar-dark className="bg-white py-20 lg:py-28 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">
        {/* Heading — elegant italic serif */}
        <h2 className="font-[var(--font-playfair)] italic text-[48px] md:text-[64px] lg:text-[80px] text-[#181C23] leading-[1] tracking-[-0.02em] mb-14 lg:mb-20">
          Awards
        </h2>

        {/* Row 1: 2 large featured awards */}
        {row1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-10">
            {row1.map((award) => (
              <AwardCard key={award.id} award={award} size="large" />
            ))}
          </div>
        )}

        {/* Row 2: 4 smaller awards */}
        {row2.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10">
            {row2.map((award) => (
              <AwardCard key={award.id} award={award} size="small" />
            ))}
          </div>
        )}

        {/* Row 3: 1 large + 3 small */}
        {row3Large.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10">
            <div className="lg:col-span-1">
              {row3Large.map((award) => (
                <AwardCard key={award.id} award={award} size="large" />
              ))}
            </div>
            {row3Small.length > 0 && row3Small.map((award) => (
              <AwardCard key={award.id} award={award} size="small" />
            ))}
          </div>
        )}

        {/* Remaining awards */}
        {remaining.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10">
            {remaining.map((award) => (
              <AwardCard key={award.id} award={award} size="small" />
            ))}
          </div>
        )}

        {/* View All Awards button */}
        <div className="flex justify-center mt-14">
          <Link
            href="/awards"
            className="inline-flex items-center font-[var(--font-open-sans)] text-[12px] text-[#181C23] uppercase tracking-[4px] border border-[#181C23]/20 px-10 py-4 hover:bg-[#181C23]/[0.03] transition-colors duration-300"
          >
            View All Awards
          </Link>
        </div>
      </div>
    </section>
  )
}
