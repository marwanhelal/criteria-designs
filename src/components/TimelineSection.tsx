'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

interface TimelineEntry {
  id: string
  titleEn: string
  descriptionEn: string
  image?: string | null
}

interface Props {
  entries: TimelineEntry[]
}

// ── Text block ───────────────────────────────────────────────────────────────
function TextBlock({
  entry,
  idx,
  isInView,
  align,
}: {
  entry: TimelineEntry
  idx: number
  isInView: boolean
  align: 'left' | 'right'
}) {
  return (
    <motion.div
      className={align === 'right' ? 'text-right' : 'text-left'}
      initial={{ opacity: 0, x: align === 'left' ? -32 : 32 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Large decorative step number */}
      <p
        className="font-[var(--font-playfair)] leading-none select-none mb-3"
        style={{
          fontSize: 'clamp(64px, 8vw, 110px)',
          color: 'rgba(177,164,144,0.08)',
          fontStyle: 'italic',
          textAlign: align === 'right' ? 'right' : 'left',
        }}
      >
        {String(idx + 1).padStart(2, '0')}
      </p>

      {/* Step label */}
      <p
        className="font-[var(--font-libre-franklin)] text-[9px] uppercase mb-4"
        style={{ letterSpacing: '4px', color: '#B1A490' }}
      >
        Step {String(idx + 1).padStart(2, '0')}
      </p>

      <h3
        className="font-[var(--font-playfair)] italic text-white font-normal leading-[1.15] mb-5"
        style={{ fontSize: 'clamp(22px, 2.6vw, 36px)' }}
      >
        {entry.titleEn}
      </h3>

      {/* Accent line */}
      <div
        className={`mb-5 ${align === 'right' ? 'ml-auto' : ''}`}
        style={{
          width: 36,
          height: 2,
          background: align === 'right'
            ? 'linear-gradient(to left, #B1A490, transparent)'
            : 'linear-gradient(to right, #B1A490, transparent)',
        }}
      />

      <p
        className="font-[var(--font-libre-franklin)] leading-[2] tracking-[0.02em]"
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          maxWidth: 300,
          marginLeft: align === 'right' ? 'auto' : undefined,
          textAlign: 'left',
        }}
      >
        {entry.descriptionEn}
      </p>
    </motion.div>
  )
}

// ── Image block ──────────────────────────────────────────────────────────────
function ImageBlock({
  entry,
  idx,
  isInView,
  align,
}: {
  entry: TimelineEntry
  idx: number
  isInView: boolean
  align: 'left' | 'right'
}) {
  if (!entry.image) return <div />

  return (
    <motion.div
      className={`group ${align === 'right' ? 'ml-auto' : ''}`}
      style={{ maxWidth: 480, width: '100%' }}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image card */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          aspectRatio: '16/10',
          boxShadow: '0 0 0 1px rgba(177,164,144,0.1), 0 24px 64px rgba(0,0,0,0.65), 0 0 40px rgba(177,164,144,0.05)',
        }}
      >
        {/* Curtain reveal */}
        <motion.div
          className="absolute inset-0 z-20 origin-right"
          style={{ backgroundColor: '#080808' }}
          initial={{ scaleX: 1 }}
          animate={isInView ? { scaleX: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Image with subtle zoom-out on reveal */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={entry.image}
            alt={entry.titleEn}
            fill
            sizes="480px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            unoptimized
          />
        </motion.div>

        {/* Bottom gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none z-10" />

        {/* Gold bottom rim */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#B1A490]/35 to-transparent z-10" />

        {/* Step badge — bottom left */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <span
            className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] text-white/60 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full"
          >
            Step {String(idx + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Caption */}
      <p
        className="font-[var(--font-playfair)] italic mt-3"
        style={{
          fontSize: 12,
          color: 'rgba(177,164,144,0.45)',
          textAlign: align === 'right' ? 'right' : 'left',
        }}
      >
        {entry.titleEn}
      </p>
    </motion.div>
  )
}

// ── Single timeline entry ────────────────────────────────────────────────────
function TimelineItem({ entry, idx }: { entry: TimelineEntry; idx: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const isTextLeft = idx % 2 === 0

  return (
    <div ref={ref} className="mb-20 lg:mb-32">

      {/* ── Desktop: 3-column grid ── */}
      <div
        className="hidden lg:grid items-center"
        style={{ gridTemplateColumns: '1fr 56px 1fr', gap: '0 0' }}
      >
        {/* Left slot */}
        <div className="pr-12 flex items-center justify-end">
          {isTextLeft
            ? <TextBlock entry={entry} idx={idx} isInView={isInView} align="right" />
            : <ImageBlock entry={entry} idx={idx} isInView={isInView} align="right" />
          }
        </div>

        {/* Center: dot */}
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: '1px solid rgba(177,164,144,0.4)',
              backgroundColor: '#080808',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(177,164,144,0.15)',
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#B1A490' }} />
          </motion.div>
        </div>

        {/* Right slot */}
        <div className="pl-12 flex items-center">
          {isTextLeft
            ? <ImageBlock entry={entry} idx={idx} isInView={isInView} align="left" />
            : <TextBlock entry={entry} idx={idx} isInView={isInView} align="left" />
          }
        </div>
      </div>

      {/* ── Mobile: stacked ── */}
      <div className="lg:hidden flex gap-6">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '1px solid rgba(177,164,144,0.4)',
              backgroundColor: '#080808',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 4,
              boxShadow: '0 0 10px rgba(177,164,144,0.12)',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B1A490' }} />
          </motion.div>
          <div style={{ flex: 1, width: 1, backgroundColor: 'rgba(177,164,144,0.15)', marginTop: 8 }} />
        </div>

        <div className="flex-1 pb-4 space-y-6">
          <TextBlock entry={entry} idx={idx} isInView={isInView} align="left" />
          <ImageBlock entry={entry} idx={idx} isInView={isInView} align="left" />
        </div>
      </div>

    </div>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────
export default function TimelineSection({ entries }: Props) {
  return (
    <div className="relative">

      {/* Center vertical line — desktop only */}
      <div
        className="hidden lg:block absolute"
        style={{
          left: '50%',
          top: 0,
          bottom: 0,
          width: 1,
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to bottom, transparent, rgba(177,164,144,0.2) 10%, rgba(177,164,144,0.2) 90%, transparent)',
          zIndex: 0,
        }}
      />

      {entries.map((entry, idx) => (
        <TimelineItem key={entry.id} entry={entry} idx={idx} />
      ))}

    </div>
  )
}
