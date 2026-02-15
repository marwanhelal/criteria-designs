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
      <style>{`
        .phi-title {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.7);
          color: transparent;
          transition: all 0.6s cubic-bezier(0.23,1,0.32,1);
        }
        .group\\/word:hover .phi-title {
          -webkit-text-stroke: 2px rgba(255,255,255,0.9);
          color: rgba(255,255,255,0.15);
          text-shadow: 0 0 40px rgba(177,164,144,0.3);
        }
        @media (max-width: 768px) {
          .phi-title {
            -webkit-text-stroke: 1px rgba(255,255,255,0.7);
          }
          .group\\/word:hover .phi-title {
            -webkit-text-stroke: 1.5px rgba(255,255,255,0.9);
          }
        }
      `}</style>

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

      {/* Full-width image with creative text overlay */}
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

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25 pointer-events-none" />

        {/* Creative text overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-end gap-8 md:gap-16 lg:gap-24">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
                className="pointer-events-auto group/word flex flex-col items-center cursor-default relative"
              >
                {/* Large ghost number behind */}
                <span
                  className="absolute -top-[50px] md:-top-[80px] lg:-top-[100px] font-[var(--font-merriweather)] font-bold text-white/[0.06] leading-none select-none transition-all duration-700 group-hover/word:text-white/[0.12]"
                  style={{ fontSize: 'clamp(80px, 14vw, 180px)' }}
                >
                  {pillar.num}
                </span>

                {/* Outlined title */}
                <h3
                  className="phi-title font-[var(--font-merriweather)] font-bold tracking-[6px] md:tracking-[8px] lg:tracking-[10px] leading-none relative z-[1]"
                  style={{ fontSize: 'clamp(28px, 5vw, 64px)' }}
                >
                  {pillar.title}
                </h3>

                {/* Thin accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + i * 0.2 }}
                  className="w-[40px] md:w-[60px] h-[1px] bg-white/30 mt-3 md:mt-4 origin-center transition-all duration-500 group-hover/word:w-[80px] md:group-hover/word:w-[100px] group-hover/word:bg-[#B1A490]"
                />

                {/* Subtle description — appears softly on hover */}
                <p className="font-[var(--font-libre-franklin)] text-[9px] md:text-[11px] lg:text-[12px] text-white/0 uppercase tracking-[2px] md:tracking-[3px] mt-2 transition-all duration-600 group-hover/word:text-white/50 group-hover/word:mt-3 whitespace-nowrap">
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
          className="absolute top-6 left-6 w-[40px] h-[40px] border-t border-l border-white/20 pointer-events-none hidden md:block"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 right-6 w-[40px] h-[40px] border-b border-r border-white/20 pointer-events-none hidden md:block"
        />
      </motion.div>

      {/* Bottom padding */}
      <div className="h-[40px] md:h-[60px]" />
    </section>
  )
}
