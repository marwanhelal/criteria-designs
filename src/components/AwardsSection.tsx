'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'

interface Award {
  id: string
  titleEn: string
  year: number
  subtitleEn: string | null
  image: string | null
}

/* ── Large card (2-col rows) ───────────────────────────────────────── */
function LargeCard({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative group cursor-default py-10 md:py-14"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] uppercase tracking-[0.18em] mb-3">
        {award.year}
      </p>

      {/* Title */}
      <h3 className="font-[var(--font-playfair)] text-[22px] md:text-[28px] text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-400 leading-[1.25] relative pb-0 pr-40">
        {award.titleEn}
      </h3>

      {/* Subtitle */}
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[12px] text-[#9A9A94] tracking-[0.04em] mt-2">
          {award.subtitleEn}
        </p>
      )}

      {/* Divider — gold fill on hover */}
      <div className="relative mt-6 h-px bg-[#E0E0DC] overflow-hidden">
        <span className="absolute inset-0 bg-[#B1A490] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>

      {/* Hover image */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            exit={{ opacity: 0, y: 10, rotate: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div
              className="relative rounded-[4px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-[#eceae6] bg-white"
              style={{ width: 140, height: 105 }}
            >
              <Image src={award.image} alt={award.titleEn} fill className="object-contain p-2" unoptimized />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Small card (4-col rows) ───────────────────────────────────────── */
function SmallCard({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative group cursor-default py-7 md:py-9"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#9A9A94] uppercase tracking-[0.15em] mb-2">
        {award.year}
      </p>

      {/* Title */}
      <h3 className="font-[var(--font-libre-franklin)] text-[13px] md:text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-300 leading-[1.45] pr-20">
        {award.titleEn}
      </h3>

      {/* Subtitle */}
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] tracking-[0.04em] mt-1.5">
          {award.subtitleEn}
        </p>
      )}

      {/* Divider */}
      <div className="relative mt-5 h-px bg-[#E0E0DC] overflow-hidden">
        <span className="absolute inset-0 bg-[#B1A490] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>

      {/* Hover image */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 6, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            exit={{ opacity: 0, y: 6, rotate: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-6 z-20 pointer-events-none"
          >
            <div
              className="relative rounded-[3px] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.10)] border border-[#eceae6] bg-white"
              style={{ width: 88, height: 66 }}
            >
              <Image src={award.image} alt={award.titleEn} fill className="object-contain p-1.5" unoptimized />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main section ──────────────────────────────────────────────────── */
export default function AwardsSection({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null

  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  const items = awards.slice(0, 12)
  const rowA1 = items.slice(0, 2)
  const rowB1 = items.slice(2, 6)
  const rowA2 = items.slice(6, 8)
  const rowB2 = items.slice(8, 12)

  return (
    <section className="bg-white pt-14 pb-24 lg:pt-16 lg:pb-32 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">

        {/* Heading */}
        <div ref={headerRef}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-playfair)] text-[80px] md:text-[120px] lg:text-[150px] font-normal text-[#1A1A1A] leading-[1] tracking-[-0.02em] mb-12 md:mb-16 lg:mb-20"
          >
            Awards
          </motion.h2>
        </div>

        {/* Row A1 — 2 large */}
        {rowA1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 lg:gap-x-20">
            {rowA1.map((a, i) => <LargeCard key={a.id} award={a} index={i} />)}
            {rowA1.length === 1 && <div />}
          </div>
        )}

        {/* Row B1 — 4 small */}
        {rowB1.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-10">
            {rowB1.map((a, i) => <SmallCard key={a.id} award={a} index={i} />)}
          </div>
        )}

        {/* Row A2 — 2 large */}
        {rowA2.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 lg:gap-x-20">
            {rowA2.map((a, i) => <LargeCard key={a.id} award={a} index={i} />)}
            {rowA2.length === 1 && <div />}
          </div>
        )}

        {/* Row B2 — 4 small */}
        {rowB2.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-10">
            {rowB2.map((a, i) => <SmallCard key={a.id} award={a} index={i} />)}
          </div>
        )}

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 md:mt-16 flex justify-center"
        >
          <Link
            href="/awards"
            className="font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[4px] text-[#1A1A1A] border border-[#1A1A1A]/20 px-12 py-4 hover:border-[#B1A490] hover:text-[#B1A490] transition-all duration-300"
          >
            View All Awards
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
