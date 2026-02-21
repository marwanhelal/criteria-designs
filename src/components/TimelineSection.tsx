'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ff = '"Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", var(--font-libre-franklin), Arial, sans-serif'

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
    <div className="relative">

      {/* Animated center line — draws from top as it enters viewport */}
      <motion.div
        className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-[#d9d9d9] rounded-[1px] -translate-x-1/2 z-0 origin-top"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="space-y-[80px] lg:space-y-[100px]">
        {entries.map((entry, idx) => {
          const isTextLeft = idx % 2 === 0

          return (
            <div
              key={entry.id}
              className={`relative flex flex-col lg:flex-row gap-8 lg:gap-0 ${!isTextLeft ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Text side — slides in from left or right */}
              <motion.div
                className={`flex-1 relative z-10 ${isTextLeft ? 'lg:pr-16' : 'lg:pl-16'}`}
                initial={{ opacity: 0, x: isTextLeft ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3
                  style={{ fontFamily: ff }}
                  className="text-[32px] lg:text-[64px] text-white font-normal leading-none tracking-[3.2px] mb-5"
                >
                  {entry.titleEn}
                </h3>
                <p
                  style={{ fontFamily: ff }}
                  className="text-[16px] lg:text-[19px] text-[rgba(255,255,255,0.8)] leading-[1.5] tracking-[0.95px] max-w-[440px]"
                >
                  {entry.descriptionEn}
                </p>
              </motion.div>

              {/* Image side — slides in from opposite direction */}
              <motion.div
                className={`flex-1 relative z-10 ${!isTextLeft ? 'lg:pr-16' : 'lg:pl-16'}`}
                initial={{ opacity: 0, x: isTextLeft ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {entry.image ? (
                  <div
                    className="relative w-full overflow-hidden bg-[#1a1a1a]"
                    style={{ aspectRatio: '415/233' }}
                  >
                    <Image
                      src={entry.image}
                      alt={entry.titleEn}
                      fill
                      sizes="(max-width: 1024px) 100vw, 602px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full bg-[#1a1a1a]" style={{ aspectRatio: '415/233' }} />
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
