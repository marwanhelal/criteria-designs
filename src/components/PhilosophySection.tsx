'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const pillars = [
  {
    num: '01',
    title: 'CULTURE',
    description: 'Heritage & Human Connection',
  },
  {
    num: '02',
    title: 'NATURE',
    description: 'Sustainable & Eco-Conscious',
  },
  {
    num: '03',
    title: 'ART',
    description: 'Precision & Aesthetic Vision',
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

      {/* Full-width image with vertical text overlay */}
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

        {/* Vertical text on the left side */}
        <div className="absolute left-4 md:left-8 lg:left-12 top-0 bottom-0 flex flex-col justify-center gap-8 md:gap-12 lg:gap-16 pointer-events-none z-[2]">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.2 }}
              className="pointer-events-auto group/word flex items-center gap-3 md:gap-5 cursor-default"
            >
              {/* Number */}
              <span className="font-[var(--font-libre-franklin)] text-[10px] md:text-[12px] text-[#181C23]/30 tracking-[2px] transition-colors duration-400 group-hover/word:text-[#B1A490]">
                {pillar.num}
              </span>

              {/* Vertical accent line */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                className="w-[1px] h-[30px] md:h-[40px] bg-[#181C23]/15 origin-top transition-all duration-500 group-hover/word:h-[50px] md:group-hover/word:h-[60px] group-hover/word:bg-[#B1A490]"
              />

              {/* Title + description */}
              <div className="flex flex-col">
                <h3 className="font-[var(--font-merriweather)] text-[20px] md:text-[32px] lg:text-[42px] text-[#181C23]/80 font-bold tracking-[3px] md:tracking-[5px] lg:tracking-[6px] leading-none transition-all duration-500 group-hover/word:text-[#181C23] group-hover/word:tracking-[5px] md:group-hover/word:tracking-[8px] lg:group-hover/word:tracking-[10px]">
                  {pillar.title}
                </h3>
                <p className="font-[var(--font-libre-franklin)] text-[8px] md:text-[10px] lg:text-[11px] text-[#181C23]/0 uppercase tracking-[2px] md:tracking-[3px] mt-0 transition-all duration-500 group-hover/word:text-[#181C23]/40 group-hover/word:mt-2">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative corner accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-6 right-6 w-[40px] h-[40px] border-t border-r border-[#181C23]/10 pointer-events-none hidden md:block"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 left-6 w-[40px] h-[40px] border-b border-l border-[#181C23]/10 pointer-events-none hidden md:block"
        />
      </motion.div>

      {/* Bottom padding */}
      <div className="h-[40px] md:h-[60px]" />
    </section>
  )
}
