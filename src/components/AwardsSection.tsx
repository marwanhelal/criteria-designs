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

/* ── Architectural corner mark ─────────────────────────────────────── */
function CornerMark({ className = '' }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className}>
      <path d="M0 10 L0 0 L10 0" stroke="#C8C8C2" strokeWidth="0.8" />
    </svg>
  )
}

/* ── Architectural section divider ─────────────────────────────────── */
function ArchDivider() {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="w-[6px] h-[6px] border border-[#C8C8C2] rotate-45 shrink-0" />
      <div className="flex-1 h-px bg-[#E8E8E4]" />
      <div className="w-[6px] h-[6px] border border-[#C8C8C2] rotate-45 shrink-0" />
    </div>
  )
}

/* ── Large award card ──────────────────────────────────────────────── */
function LargeCard({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-default group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CornerMark className="absolute -top-[1px] -left-[1px] opacity-70" />

      {/* Year */}
      <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] uppercase tracking-[0.18em] mb-3 pt-3 pl-3">
        {award.year}
      </p>

      {/* Award name */}
      <h3 className="font-[var(--font-libre-franklin)] text-[17px] lg:text-[19px] font-semibold text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-300 leading-[1.35] pl-3 pr-36">
        {award.titleEn}
      </h3>

      {/* Subtitle */}
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[12px] text-[#9A9A94] tracking-[0.06em] mt-1.5 pl-3">
          {award.subtitleEn}
        </p>
      )}

      {/* Bottom divider */}
      <div className="h-px bg-[#E0E0DC] group-hover:bg-[#B1A490]/40 transition-colors duration-300 mt-5 ml-3" />

      {/* Hover image */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 10, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            exit={{ opacity: 0, y: 10, rotate: 0 }}
            transition={{ duration: 0.26, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-2 z-20 pointer-events-none"
          >
            <div
              className="relative rounded-[5px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-[#ececec] bg-white"
              style={{ width: 130, height: 98 }}
            >
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Small award card ──────────────────────────────────────────────── */
function SmallCard({ award, index }: { award: Award; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-default text-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CornerMark className="absolute -top-[1px] -left-[1px] opacity-40" />

      {/* Year */}
      <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] uppercase tracking-[0.18em] mb-2.5 pt-3">
        {award.year}
      </p>

      {/* Award name */}
      <h3 className="font-[var(--font-libre-franklin)] text-[13px] lg:text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#B1A490] transition-colors duration-300 leading-[1.4] px-2">
        {award.titleEn}
      </h3>

      {/* Subtitle */}
      {award.subtitleEn && (
        <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#9A9A94] tracking-[0.06em] mt-1 px-2">
          {award.subtitleEn}
        </p>
      )}

      {/* Bottom divider */}
      <div className="h-px bg-[#E0E0DC] group-hover:bg-[#B1A490]/40 transition-colors duration-300 mt-4 mx-2" />

      {/* Hover image */}
      <AnimatePresence>
        {hovered && award.image && (
          <motion.div
            initial={{ opacity: 0, y: 8, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            exit={{ opacity: 0, y: 8, rotate: 0 }}
            transition={{ duration: 0.26, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute right-0 top-0 z-20 pointer-events-none"
          >
            <div
              className="relative rounded-[4px] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.10)] border border-[#ececec] bg-white"
              style={{ width: 88, height: 66 }}
            >
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                className="object-contain p-1.5"
                unoptimized
              />
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

  const items = awards.slice(0, 12)
  const rowA1 = items.slice(0, 2)
  const rowB1 = items.slice(2, 6)
  const rowA2 = items.slice(6, 8)
  const rowB2 = items.slice(8, 12)

  return (
    <section data-navbar-dark className="bg-white pt-16 pb-24 lg:pt-20 lg:pb-32 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">

        {/* Header row */}
        <div className="flex items-end justify-between mb-5 lg:mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-playfair)] text-[60px] md:text-[80px] lg:text-[96px] text-[#1A1A1A] leading-[1] tracking-[-0.03em] font-normal"
          >
            Awards
          </motion.h2>

          {/* Architectural index — top right */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="hidden lg:flex flex-col items-end gap-1.5 pb-3"
          >
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#9A9A94] uppercase tracking-[0.2em]">
              Recognition
            </span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-[#C8C8C2]" />
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#C8C8C2] tracking-[0.1em]">
                {String(items.length).padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="font-[var(--font-libre-franklin)] text-[13px] text-[#9A9A94] tracking-[0.04em] leading-relaxed max-w-[420px] mb-16 lg:mb-20"
        >
          A growing record of international recognition across architecture and interior design.
        </motion.p>

        {/* Row A1: 2 large */}
        {rowA1.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {rowA1.map((a, i) => <LargeCard key={a.id} award={a} index={i} />)}
              {rowA1.length === 1 && <div />}
            </div>
            {(rowB1.length > 0 || rowA2.length > 0) && <ArchDivider />}
          </>
        )}

        {/* Row B1: 4 small */}
        {rowB1.length > 0 && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
              {rowB1.map((a, i) => <SmallCard key={a.id} award={a} index={i} />)}
            </div>
            {rowA2.length > 0 && <ArchDivider />}
          </>
        )}

        {/* Row A2: 2 large */}
        {rowA2.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {rowA2.map((a, i) => <LargeCard key={a.id} award={a} index={i} />)}
              {rowA2.length === 1 && <div />}
            </div>
            {rowB2.length > 0 && <ArchDivider />}
          </>
        )}

        {/* Row B2: 4 small */}
        {rowB2.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {rowB2.map((a, i) => <SmallCard key={a.id} award={a} index={i} />)}
          </div>
        )}

        {/* Bottom: tick marks + button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-3 w-full max-w-[360px]">
            <div className="flex-1 h-px bg-[#E8E8E4]" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-px h-3 bg-[#C8C8C2]" />
              ))}
            </div>
            <div className="flex-1 h-px bg-[#E8E8E4]" />
          </div>

          <Link
            href="/awards"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[11px] text-[#1A1A1A] uppercase tracking-[4px] border border-[#1A1A1A]/15 px-10 py-4 hover:border-[#B1A490] hover:text-[#B1A490] transition-all duration-300"
          >
            View All Awards
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
