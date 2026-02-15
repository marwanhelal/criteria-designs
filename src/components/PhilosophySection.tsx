'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const pillars = [
  { title: 'CULTURE', description: 'Heritage & Human Connection' },
  { title: 'NATURE', description: 'Sustainable & Eco-Conscious' },
  { title: 'ART', description: 'Precision & Aesthetic Vision' },
]

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.philosophyImage) setPhilosophyImage(data.philosophyImage)
      })
      .catch(() => {})
  }, [])

  if (!philosophyImage) return <section ref={sectionRef} />

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '600px', maxHeight: '900px' }}
    >
      {/* Full-screen background image */}
      <Image
        src={philosophyImage}
        alt="Our Philosophy"
        fill
        sizes="100vw"
        className="object-cover"
        unoptimized
        priority
      />

      {/* Gradient overlay: dark from left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#181C23]/80 via-[#181C23]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#181C23]/50 via-transparent to-[#181C23]/20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-[1290px] mx-auto px-8 md:px-12 lg:px-16">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:mb-8"
        >
          <span className="font-[var(--font-libre-franklin)] text-[11px] md:text-[12px] text-[#B1A490] uppercase tracking-[4px]">
            What drives us
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-[40px] h-[1px] bg-[#B1A490] mt-3 origin-left"
          />
        </motion.div>

        {/* Large stacked titles */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
              className="group/word flex items-baseline gap-4 md:gap-6 cursor-default"
            >
              {/* Large title */}
              <h2
                className="font-[var(--font-merriweather)] text-white font-bold leading-none transition-all duration-500 group-hover/word:text-[#B1A490] group-hover/word:translate-x-3"
                style={{ fontSize: 'clamp(36px, 7vw, 90px)', letterSpacing: '0.08em' }}
              >
                {pillar.title}
              </h2>

              {/* Separator dot + description — reveals on hover */}
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="w-[4px] h-[4px] rounded-full bg-[#B1A490] shrink-0 opacity-0 transition-opacity duration-500 group-hover/word:opacity-100" />
                <p className="font-[var(--font-libre-franklin)] text-[10px] md:text-[12px] text-white/0 uppercase tracking-[3px] whitespace-nowrap transition-all duration-500 group-hover/word:text-white/50">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom corner accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-[40px] h-[40px] border-b border-r border-white/15 hidden md:block"
        />
      </div>
    </section>
  )
}
