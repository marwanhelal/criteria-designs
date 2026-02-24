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
      initial={{ opacity: 0, x: align === 'left' ? -28 : 28 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <p
        className="font-[var(--font-libre-franklin)] text-[10px] uppercase mb-4"
        style={{ letterSpacing: '5px', color: '#B1A490' }}
      >
        {String(idx + 1).padStart(2, '0')}
      </p>

      <h3
        className="font-[var(--font-merriweather)] text-white font-light leading-[1.1] mb-5"
        style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}
      >
        {entry.titleEn}
      </h3>

      {/* Accent line — aligned with text direction */}
      <div
        className={`mb-5 ${align === 'right' ? 'ml-auto' : ''}`}
        style={{ width: 32, height: 1, backgroundColor: 'rgba(177,164,144,0.5)' }}
      />

      <p
        className="font-[var(--font-open-sans)] leading-[1.95]"
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.48)',
          maxWidth: 320,
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
      className={align === 'right' ? 'ml-auto' : ''}
      style={{ maxWidth: 460, width: '100%' }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Architectural frame */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '4/3',
          border: '1px solid rgba(255,255,255,0.14)',
          outline: '6px solid rgba(255,255,255,0.03)',
        }}
      >
        {/* Curtain reveal */}
        <motion.div
          className="absolute inset-0 z-10 origin-right"
          style={{ backgroundColor: '#080808' }}
          initial={{ scaleX: 1 }}
          animate={isInView ? { scaleX: 0 } : {}}
          transition={{ duration: 0.95, delay: 0.32, ease: [0.76, 0, 0.24, 1] }}
        />

        <Image
          src={entry.image}
          alt={entry.titleEn}
          fill
          sizes="460px"
          className="object-cover"
          unoptimized
        />

        {/* Corner marks — architectural drawing convention */}
        <div className="absolute top-[10px] left-[10px] w-[14px] h-[14px] border-t border-l" style={{ borderColor: 'rgba(255,255,255,0.35)' }} />
        <div className="absolute top-[10px] right-[10px] w-[14px] h-[14px] border-t border-r" style={{ borderColor: 'rgba(255,255,255,0.35)' }} />
        <div className="absolute bottom-[10px] left-[10px] w-[14px] h-[14px] border-b border-l" style={{ borderColor: 'rgba(255,255,255,0.35)' }} />
        <div className="absolute bottom-[10px] right-[10px] w-[14px] h-[14px] border-b border-r" style={{ borderColor: 'rgba(255,255,255,0.35)' }} />
      </div>

      {/* Fig. label */}
      <p
        className="font-[var(--font-libre-franklin)] mt-[6px]"
        style={{
          fontSize: 9,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
          textAlign: align === 'right' ? 'right' : 'left',
        }}
      >
        Fig.&nbsp;{String(idx + 1).padStart(2, '0')}
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
    <div ref={ref} className="mb-20 lg:mb-28">

      {/* ── Desktop: 3-column grid (text | dot | image) ── */}
      <div
        className="hidden lg:grid items-center"
        style={{ gridTemplateColumns: '1fr 56px 1fr', gap: '0 0' }}
      >
        {/* Left slot */}
        <div className="pr-10 flex items-center justify-end">
          {isTextLeft
            ? <TextBlock entry={entry} idx={idx} isInView={isInView} align="right" />
            : <ImageBlock entry={entry} idx={idx} isInView={isInView} align="right" />
          }
        </div>

        {/* Center: dot only — the line is a sibling in the parent */}
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: '#080808',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#B1A490' }} />
          </motion.div>
        </div>

        {/* Right slot */}
        <div className="pl-10 flex items-center">
          {isTextLeft
            ? <ImageBlock entry={entry} idx={idx} isInView={isInView} align="left" />
            : <TextBlock entry={entry} idx={idx} isInView={isInView} align="left" />
          }
        </div>
      </div>

      {/* ── Mobile: stacked layout with left line ── */}
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
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: '#080808',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 4,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B1A490' }} />
          </motion.div>
          <div style={{ flex: 1, width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 8 }} />
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

      {/* CENTER vertical white line — desktop only */}
      <div
        className="hidden lg:block absolute"
        style={{
          left: '50%',
          top: 0,
          bottom: 0,
          width: 1,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,255,255,0.14)',
          zIndex: 0,
        }}
      />

      {entries.map((entry, idx) => (
        <TimelineItem key={entry.id} entry={entry} idx={idx} />
      ))}

    </div>
  )
}
