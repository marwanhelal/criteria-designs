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

/* ── Large award card (2-col row) ──────────────────────────────────── */
function LargeCard({ award }: { award: Award }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#1A1A1A] tracking-[0.1em] mb-2">
        {award.year}
      </p>

      {/* Title row + hover image inline */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-[var(--font-libre-franklin)] text-[18px] md:text-[20px] font-semibold text-[#1A1A1A] leading-[1.3]">
            {award.titleEn}
          </h3>
          {award.subtitleEn && (
            <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#1A1A1A]/40 tracking-[0.05em] mt-1">
              {award.subtitleEn}
            </p>
          )}
        </div>

        {/* Hover image — appears inline, right of text */}
        <AnimatePresence>
          {hovered && award.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              exit={{ opacity: 0, scale: 0.88, rotate: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="shrink-0 pointer-events-none"
              style={{ width: 130, height: 98 }}
            >
              <div className="relative w-full h-full rounded-[6px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.13)] border border-[#efefef]">
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

      {/* Divider */}
      <div className="w-full h-px bg-[#E0E0E0] mt-5" />
    </div>
  )
}

/* ── Small award card (4-col row) ──────────────────────────────────── */
function SmallCard({ award }: { award: Award }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="cursor-default text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <p className="font-[var(--font-libre-franklin)] text-[13px] text-[#1A1A1A] tracking-[0.1em] mb-2">
        {award.year}
      </p>

      {/* Title row + hover image inline */}
      <div className="flex items-start justify-center gap-3">
        <div className="min-w-0">
          <h3 className="font-[var(--font-libre-franklin)] text-[15px] font-semibold text-[#1A1A1A] leading-[1.35]">
            {award.titleEn}
          </h3>
          {award.subtitleEn && (
            <p className="font-[var(--font-libre-franklin)] text-[12px] text-[#1A1A1A]/40 tracking-[0.05em] mt-1">
              {award.subtitleEn}
            </p>
          )}
        </div>

        {/* Hover image */}
        <AnimatePresence>
          {hovered && award.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              exit={{ opacity: 0, scale: 0.88, rotate: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="shrink-0 pointer-events-none"
              style={{ width: 90, height: 68 }}
            >
              <div className="relative w-full h-full rounded-[5px] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-[#efefef]">
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

      {/* Divider */}
      <div className="w-full h-px bg-[#E0E0E0] mt-4" />
    </div>
  )
}

/* ── Main section ──────────────────────────────────────────────────── */
export default function AwardsSection({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null

  const items = awards.slice(0, 12)

  // Staggered layout: Row A (2 large) → Row B (4 small) → Row A → Row B
  const rowA1 = items.slice(0, 2)
  const rowB1 = items.slice(2, 6)
  const rowA2 = items.slice(6, 8)
  const rowB2 = items.slice(8, 12)

  return (
    <section data-navbar-dark className="bg-white py-20 lg:py-28 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">

        {/* Heading */}
        <h2 className="font-[var(--font-playfair)] text-[64px] md:text-[80px] lg:text-[96px] text-[#1A1A1A] leading-[1] tracking-[-0.03em] font-normal mb-16 lg:mb-20">
          Awards
        </h2>

        {/* Row A1: 2 large */}
        {rowA1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 mb-10">
            {rowA1.map((a) => <LargeCard key={a.id} award={a} />)}
          </div>
        )}

        {/* Row B1: 4 small */}
        {rowB1.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10">
            {rowB1.map((a) => <SmallCard key={a.id} award={a} />)}
          </div>
        )}

        {/* Row A2: 2 large */}
        {rowA2.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 mb-10">
            {rowA2.map((a) => <LargeCard key={a.id} award={a} />)}
          </div>
        )}

        {/* Row B2: 4 small */}
        {rowB2.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 mb-10">
            {rowB2.map((a) => <SmallCard key={a.id} award={a} />)}
          </div>
        )}

        {/* Button */}
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
