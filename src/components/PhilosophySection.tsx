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
      className="relative w-full bg-[#F8F8F8] overflow-hidden py-[60px] md:py-[90px]"
    >
      <div className="max-w-[1290px] mx-auto px-6 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
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

        {/* Two-column layout: pillars left, image right */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Philosophy pillars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-10 md:gap-12 lg:shrink-0 lg:w-[340px]"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                className="group/item flex items-start gap-5 cursor-default"
              >
                {/* Number + line */}
                <div className="flex flex-col items-center pt-1">
                  <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] tracking-[2px] transition-colors duration-300 group-hover/item:text-[#181C23]">
                    {pillar.num}
                  </span>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                    className="w-[1px] h-[40px] bg-[#B1A490]/30 mt-2 origin-top transition-all duration-500 group-hover/item:h-[55px] group-hover/item:bg-[#B1A490]"
                  />
                </div>

                {/* Title + description */}
                <div className="flex flex-col">
                  <h3 className="font-[var(--font-merriweather)] text-[24px] md:text-[30px] lg:text-[36px] text-[#181C23] font-bold tracking-[3px] md:tracking-[4px] leading-none transition-all duration-500 group-hover/item:tracking-[6px] md:group-hover/item:tracking-[8px] group-hover/item:text-[#B1A490]">
                    {pillar.title}
                  </h3>
                  <p className="font-[var(--font-libre-franklin)] text-[10px] md:text-[11px] text-[#999] uppercase tracking-[2px] mt-3 transition-all duration-500 group-hover/item:text-[#666] group-hover/item:tracking-[3px]">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Contained image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex-1 w-full lg:w-auto"
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[3/4] w-full max-w-[600px] mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={philosophyImage}
                alt="Our Philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                unoptimized
                priority
              />
            </div>

            {/* Decorative corner accents on image */}
            <div className="absolute -top-3 -left-3 w-[40px] h-[40px] border-t border-l border-[#B1A490]/30 hidden lg:block" />
            <div className="absolute -bottom-3 -right-3 w-[40px] h-[40px] border-b border-r border-[#B1A490]/30 hidden lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
