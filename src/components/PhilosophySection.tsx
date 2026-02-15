'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const pillars = [
  {
    num: '01',
    title: 'CULTURE',
    description:
      'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
  },
  {
    num: '02',
    title: 'NATURE',
    description:
      'Engineering sustainable, eco-conscious exteriors that harmonize with and protect the natural environment.',
  },
  {
    num: '03',
    title: 'ART',
    description:
      'Sculpting functional masterpieces that blend structural precision with visionary aesthetic expression.',
  },
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
      data-navbar-dark
      className="relative w-full bg-white overflow-hidden"
    >
      {/* Section header */}
      <div className="max-w-[1290px] mx-auto px-6 md:px-8 pt-[60px] md:pt-[80px] pb-8 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#B1A490] uppercase tracking-[4px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-[#181C23] leading-[1.1] mt-4">
            Our Philosophy
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-[60px] h-[2px] bg-[#B1A490] mx-auto mt-5 origin-center"
          />
        </motion.div>
      </div>

      {/* Full-width image with overlay text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative w-full"
        style={{ height: 'clamp(400px, 56vw, 700px)' }}
      >
        <Image
          src={philosophyImage}
          alt="Our Philosophy"
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
          priority
        />

        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Pillar words overlaid on image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-6 md:gap-12 lg:gap-20">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.2 }}
                className="pointer-events-auto group/word flex flex-col items-center cursor-default"
              >
                <span className="font-[var(--font-libre-franklin)] text-[10px] md:text-[11px] text-white/40 tracking-[3px] mb-2 transition-colors duration-300 group-hover/word:text-[#B1A490]/70">
                  {pillar.num}
                </span>
                <h3 className="font-[var(--font-merriweather)] text-[24px] md:text-[40px] lg:text-[56px] text-white font-bold tracking-[4px] md:tracking-[6px] lg:tracking-[8px] leading-none transition-all duration-500 group-hover/word:tracking-[10px] md:group-hover/word:tracking-[14px] lg:group-hover/word:tracking-[18px] group-hover/word:text-white">
                  {pillar.title}
                </h3>
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '100%' } : { width: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.2 }}
                  className="h-[1px] bg-white/30 mt-3 transition-colors duration-300 group-hover/word:bg-[#B1A490]"
                />
                <p className="font-[var(--font-open-sans)] text-[0px] md:text-[12px] lg:text-[13px] text-white/0 leading-[1.6] mt-0 max-w-[200px] text-center transition-all duration-500 group-hover/word:text-white/70 group-hover/word:mt-3">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative corner accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-6 left-6 w-[40px] h-[40px] border-t border-l border-white/25 pointer-events-none hidden md:block"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 right-6 w-[40px] h-[40px] border-b border-r border-white/25 pointer-events-none hidden md:block"
        />
      </motion.div>

      {/* Bottom padding */}
      <div className="h-[40px] md:h-[60px]" />
    </section>
  )
}
