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

/* ── Large award card (2-col row) — left-aligned ───────────────────── */
function LargeCard({ award }: { award: Award }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <p
        className="font-[var(--font-libre-franklin)] text-[14px] text-[#1A1A1A] tracking-[0.12em] mb-2"
      >
        {award.year}
      </p>

      {/* Award name — sans-serif semi-bold, large */}
      <h3 className="font-[var(--font-libre-franklin)] text-[18px] md:text-[20px] font-semibold text-[#1A1A1A] leading-[1.3]">
        {award.titleEn}
      </h3>

      {/* Subtitle */}
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#1A1A1A]/50 tracking-[0.06em] mt-1">
          {award.subtitleEn}
        </p>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-[#E0E0E0] mt-5" />

      {/* Hover image — grayscale, rotated, positioned top-right */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 12, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            exit={{ opacity: 0, y: 12, rotate: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-[-8px] z-20 pointer-events-none"
          >
            <div
              className="relative rounded-[6px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-[#f0f0f0]"
              style={{ width: 140, height: 105 }}
            >
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                className="object-cover grayscale"
                unoptimized
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Small award card (4-col row) — centered ───────────────────────── */
function SmallCard({ award }: { award: Award }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative cursor-default text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <p className="font-[var(--font-libre-franklin)] text-[13px] text-[#1A1A1A] tracking-[0.12em] mb-2">
        {award.year}
      </p>

      {/* Award name */}
      <h3 className="font-[var(--font-libre-franklin)] text-[15px] md:text-[16px] font-semibold text-[#1A1A1A] leading-[1.35]">
        {award.titleEn}
      </h3>

      {/* Subtitle */}
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[13px] text-[#1A1A1A]/50 tracking-[0.06em] mt-1">
          {award.subtitleEn}
        </p>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-[#E0E0E0] mt-4" />

      {/* Hover image */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            exit={{ opacity: 0, y: 10, rotate: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-[-6px] z-20 pointer-events-none"
          >
            <div
              className="relative rounded-[6px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-[#f0f0f0]"
              style={{ width: 100, height: 75 }}
            >
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                className="object-cover grayscale"
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

  // Staggered layout pattern matching reference:
  // Row A (2 large, left-aligned, col 1 & 3 of 4)
  // Row B (4 small, centered, all 4 cols)
  // Row A repeat, Row B repeat...
  const rowA1 = items.slice(0, 2)
  const rowB1 = items.slice(2, 6)
  const rowA2 = items.slice(6, 8)
  const rowB2 = items.slice(8, 12)

  return (
    <section data-navbar-dark className="bg-white py-20 lg:py-28 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">

        {/* Heading — large serif, regular weight, editorial */}
        <h2 className="font-[var(--font-playfair)] text-[64px] md:text-[80px] lg:text-[96px] text-[#1A1A1A] leading-[1] tracking-[-0.03em] font-normal mb-16 lg:mb-20">
          Awards
        </h2>

        {/* Row A1: 2 large awards — spans half width each */}
        {rowA1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 mb-10">
            {rowA1.map((award) => (
              <LargeCard key={award.id} award={award} />
            ))}
            {/* Fill empty cols if only 1 item */}
            {rowA1.length === 1 && <div />}
          </div>
        )}

        {/* Row B1: 4 small awards — all 4 cols, centered */}
        {rowB1.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10 pl-0 lg:pl-0">
            {rowB1.map((award) => (
              <SmallCard key={award.id} award={award} />
            ))}
          </div>
        )}

        {/* Row A2: 2 large awards */}
        {rowA2.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 mb-10">
            {rowA2.map((award) => (
              <LargeCard key={award.id} award={award} />
            ))}
            {rowA2.length === 1 && <div />}
          </div>
        )}

        {/* Row B2: 4 small awards */}
        {rowB2.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10">
            {rowB2.map((award) => (
              <SmallCard key={award.id} award={award} />
            ))}
          </div>
        )}

        {/* View All Awards button */}
        <div className="flex justify-center mt-14">
          <Link
            href="/awards"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[11px] text-[#1A1A1A] uppercase tracking-[4px] border border-[#1A1A1A]/20 px-10 py-4 hover:bg-[#1A1A1A]/[0.03] transition-colors duration-300"
          >
            View All Awards
          </Link>
        </div>
      </div>
    </section>
  )
}
