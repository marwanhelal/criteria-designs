'use client'

import { motion } from 'framer-motion'
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

export default function TimelineSection({ entries }: Props) {
  return (
    <div className="space-y-[72px] lg:space-y-[96px]">
      {entries.map((entry, idx) => {
        const isTextLeft = idx % 2 === 0

        return (
          <div
            key={entry.id}
            className={`flex flex-col lg:flex-row gap-10 lg:gap-20 lg:items-center ${!isTextLeft ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* ── Text side ── */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: isTextLeft ? -36 : 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Step number */}
              <p className="font-[var(--font-open-sans)] text-[10px] tracking-[3px] uppercase text-[#B1A490] mb-4">
                {String(idx + 1).padStart(2, '0')}
              </p>

              {/* Title */}
              <h3 className="font-[var(--font-open-sans)] text-[22px] lg:text-[28px] text-white font-light leading-snug mb-4">
                {entry.titleEn}
              </h3>

              {/* Accent line */}
              <div className="w-6 h-px bg-[#B1A490]/50 mb-5" />

              {/* Description */}
              <p className="font-[var(--font-open-sans)] text-[13px] lg:text-[14px] text-[rgba(255,255,255,0.6)] leading-[1.9]">
                {entry.descriptionEn}
              </p>
            </motion.div>

            {/* ── Image side ── */}
            <motion.div
              className="flex-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{ visible: { transition: { delay: 0.12 } } }}
            >
              {entry.image ? (
                <div
                  className="relative w-full overflow-hidden bg-[#111]"
                  style={{ aspectRatio: '4/3' }}
                >
                  <motion.div
                    className="absolute inset-0"
                    variants={{
                      hidden: { scale: 1.1 },
                      visible: { scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } },
                    }}
                  >
                    <Image
                      src={entry.image}
                      alt={entry.titleEn}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-[#0a0a0a] z-10 origin-right"
                    variants={{
                      hidden: { scaleX: 1 },
                      visible: { scaleX: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
