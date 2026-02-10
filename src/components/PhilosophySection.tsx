'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const strips = [
  { label: 'Culture', position: 'center 10%', fromX: -100 },
  { label: 'Nature', position: 'center 50%', fromX: 100 },
  { label: 'Art', position: 'center 90%', fromX: -100 },
]

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.philosophyImage) setPhilosophyImage(data.philosophyImage)
      })
      .catch(() => {})
  }, [])

  if (!philosophyImage) return null

  return (
    <section className="bg-[#181C23] py-[100px] md:py-[140px] px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[3px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.15] mt-4">
            Our Philosophy
          </h2>
        </motion.div>

        {/* Three animated image strips */}
        <div className="flex flex-col gap-3 md:gap-4">
          {strips.map((strip, index) => (
            <motion.div
              key={strip.label}
              initial={{ opacity: 0, x: strip.fromX, scale: 0.92 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 1,
                delay: index * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="group relative overflow-hidden rounded-[10px] cursor-pointer h-[180px] md:h-[250px] lg:h-[300px]"
            >
              {/* Image strip - shows a portion of the full image */}
              <Image
                src={philosophyImage}
                alt={`Our Philosophy - ${strip.label}`}
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover group-hover:scale-110 transition-transform duration-[900ms] ease-out"
                style={{ objectPosition: strip.position }}
                unoptimized
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#181C23]/60 via-transparent to-transparent" />

              {/* Hover brightening */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500" />

              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B1A490] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
