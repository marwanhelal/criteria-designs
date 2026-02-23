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

function TimelineItem({ entry, idx }: { entry: TimelineEntry; idx: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const isTextLeft = idx % 2 === 0

  return (
    <div ref={ref} className="flex gap-6 lg:gap-10 items-start">

      {/* Dot marker — always on the left, aligned with the vertical line */}
      <div className="shrink-0 w-6 flex justify-center pt-[6px]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-[22px] h-[22px] rounded-full border border-white/25 flex items-center justify-center"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          <div className="w-[7px] h-[7px] rounded-full bg-[#B1A490]" />
        </motion.div>
      </div>

      {/* Content: text + image, alternating direction */}
      <div className={`flex-1 pb-4 flex flex-col lg:flex-row gap-8 lg:gap-14 lg:items-start ${!isTextLeft ? 'lg:flex-row-reverse' : ''}`}>

        {/* Text block */}
        <motion.div
          className="flex-1 min-w-0"
          style={{ maxWidth: 420 }}
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-[var(--font-libre-franklin)] text-[10px] tracking-[4px] uppercase text-[#B1A490] mb-5">
            {String(idx + 1).padStart(2, '0')}
          </p>
          <h3 className="font-[var(--font-merriweather)] text-[22px] lg:text-[28px] text-white font-light leading-snug mb-4">
            {entry.titleEn}
          </h3>
          <div className="w-5 h-px mb-5" style={{ backgroundColor: 'rgba(177,164,144,0.45)' }} />
          <p className="font-[var(--font-open-sans)] text-[13px] lg:text-[14px] leading-[1.95]" style={{ color: 'rgba(255,255,255,0.52)' }}>
            {entry.descriptionEn}
          </p>
        </motion.div>

        {/* Image — smaller, architectural frame */}
        {entry.image ? (
          <motion.div
            className="shrink-0 w-full lg:w-[44%]"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Outer architectural frame */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: '4/3',
                border: '1px solid rgba(255,255,255,0.12)',
                outline: '5px solid rgba(255,255,255,0.03)',
              }}
            >
              {/* Reveal curtain */}
              <motion.div
                className="absolute inset-0 z-10 origin-right"
                style={{ backgroundColor: '#0a0a0a' }}
                initial={{ scaleX: 1 }}
                animate={isInView ? { scaleX: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.28, ease: [0.76, 0, 0.24, 1] }}
              />

              <Image
                src={entry.image}
                alt={entry.titleEn}
                fill
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="object-cover"
                unoptimized
              />

              {/* Architectural corner marks */}
              <div className="absolute top-[10px] left-[10px] w-4 h-4 border-t border-l" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
              <div className="absolute top-[10px] right-[10px] w-4 h-4 border-t border-r" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
              <div className="absolute bottom-[10px] left-[10px] w-4 h-4 border-b border-l" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
              <div className="absolute bottom-[10px] right-[10px] w-4 h-4 border-b border-r" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            </div>

            {/* Fig. label */}
            <p
              className="font-[var(--font-libre-franklin)] text-right mt-2"
              style={{ fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}
            >
              Fig. {String(idx + 1).padStart(2, '0')}
            </p>
          </motion.div>
        ) : (
          <div className="shrink-0 lg:w-[44%]" />
        )}

      </div>
    </div>
  )
}

export default function TimelineSection({ entries }: Props) {
  return (
    <div className="relative">
      {/* Single continuous vertical white line */}
      <div
        style={{
          position: 'absolute',
          left: 11,
          top: 8,
          bottom: 8,
          width: 1,
          backgroundColor: 'rgba(255,255,255,0.15)',
        }}
      />

      <div className="space-y-16 lg:space-y-24">
        {entries.map((entry, idx) => (
          <TimelineItem key={entry.id} entry={entry} idx={idx} />
        ))}
      </div>
    </div>
  )
}
