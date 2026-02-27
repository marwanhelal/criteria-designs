'use client'

import { useState, useRef } from 'react'
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

export default function AwardsSection({ awards }: { awards: Award[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  if (awards.length === 0) return null

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (imageRef.current) {
      imageRef.current.style.left = `${mousePos.current.x + 20}px`
      imageRef.current.style.top = `${mousePos.current.y - 80}px`
    }
  }

  return (
    <section data-navbar-dark className="bg-[#F5F0EB] py-20 lg:py-28 px-8 lg:px-16">
      <div className="max-w-[1290px] mx-auto">
        {/* Heading */}
        <h2 className="font-[var(--font-merriweather)] text-[42px] md:text-[54px] lg:text-[68px] text-[#181C23] leading-[1.05] tracking-[-0.02em]">
          Awards
        </h2>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-0 mt-14">
          {awards.slice(0, 12).map((award) => (
            <div
              key={award.id}
              className="relative group py-6"
              onMouseEnter={() => setHoveredId(award.id)}
              onMouseLeave={() => setHoveredId(null)}
              onMouseMove={handleMouseMove}
            >
              {/* Year */}
              <p className="font-[var(--font-libre-franklin)] text-[13px] text-[#181C23]/45 tracking-[1px]">
                {award.year}
              </p>

              {/* Award name */}
              <h3 className="font-[var(--font-merriweather)] text-[17px] lg:text-[19px] text-[#181C23] font-bold leading-[1.35] mt-1.5">
                {award.titleEn}
              </h3>

              {/* Subtitle */}
              {award.subtitleEn && (
                <p className="font-[var(--font-open-sans)] text-[13px] text-[#181C23]/50 mt-1">
                  {award.subtitleEn}
                </p>
              )}

              {/* Gold underline separator */}
              <div className="w-full h-px bg-[#B1A490]/40 mt-5" />

              {/* Hover image — floating near cursor */}
              <AnimatePresence>
                {hoveredId === award.id && award.image && (
                  <motion.div
                    ref={imageRef}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                    className="fixed z-50 pointer-events-none w-[220px] h-[160px] rounded-lg overflow-hidden shadow-2xl"
                    style={{
                      left: mousePos.current.x + 20,
                      top: mousePos.current.y - 80,
                    }}
                  >
                    <Image
                      src={award.image}
                      alt={award.titleEn}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* View All Awards button */}
        <div className="flex justify-center mt-14">
          <Link
            href="/awards"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[12px] text-[#181C23] uppercase tracking-[4px] border border-[#B1A490] px-10 py-4 hover:bg-[#B1A490]/10 transition-colors duration-300"
          >
            View All Awards
          </Link>
        </div>
      </div>
    </section>
  )
}
