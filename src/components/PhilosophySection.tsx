'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0) // 0=none, 1=culture, 2=nature, 3=art
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  // Map scroll progress to section reveals
  // 0-0.2: nothing revealed, 0.2-0.4: culture, 0.4-0.6: nature, 0.6-0.8: art, 0.8+: all revealed
  const cultureOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0])
  const natureOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0])
  const artOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0])
  const iconGlow = useTransform(scrollYProgress, [0.05, 0.25], [0, 1])
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%'])
  const sweepTop = useTransform(scrollYProgress, [0, 1], ['0%', '80%'])
  const sweepOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 0.4, 0.4, 0])

  // Track active section for label highlights
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.15) setActiveSection(0)
    else if (v < 0.35) setActiveSection(1)
    else if (v < 0.55) setActiveSection(2)
    else setActiveSection(3)
  })

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
    <section ref={sectionRef} className="bg-[#0D0F13] pt-[80px] md:pt-[120px] pb-0 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="font-[var(--font-libre-franklin)] text-[13px] md:text-[14px] text-[#B1A490] uppercase tracking-[3px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.15] mt-4">
            Our Philosophy
          </h2>
        </motion.div>

        {/* Scroll indicator labels */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-6 md:gap-12 mb-8 md:mb-12"
        >
          {['Culture', 'Nature', 'Art'].map((label, i) => (
            <span
              key={label}
              className={`font-[var(--font-libre-franklin)] text-[11px] md:text-[13px] uppercase tracking-[2px] md:tracking-[3px] transition-all duration-700 ${
                activeSection >= i + 1
                  ? 'text-[#B1A490] scale-105'
                  : 'text-white/20'
              }`}
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Image with scroll-reveal overlays */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative w-full overflow-hidden"
      >
        {/* Parallax image container */}
        <motion.div style={{ y: imageY }} className="relative">
          <Image
            src={philosophyImage}
            alt="Our Philosophy - Culture, Nature, Art"
            width={1920}
            height={1080}
            className="w-full h-auto block"
            unoptimized
            priority
          />

          {/* Dark overlay for Culture section (top ~33%) */}
          <motion.div
            style={{ opacity: cultureOpacity }}
            className="absolute top-0 left-0 w-full h-[36%] bg-[#0D0F13] pointer-events-none"
          >
            <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gradient-to-t from-transparent to-[#0D0F13]" />
          </motion.div>

          {/* Dark overlay for Nature section (middle ~33%) */}
          <motion.div
            style={{ opacity: natureOpacity }}
            className="absolute top-[33%] left-0 w-full h-[36%] bg-[#0D0F13] pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-full h-[30px] bg-gradient-to-b from-transparent to-[#0D0F13]" />
            <div className="absolute bottom-0 left-0 w-full h-[30px] bg-gradient-to-t from-transparent to-[#0D0F13]" />
          </motion.div>

          {/* Dark overlay for Art section (bottom ~33%) */}
          <motion.div
            style={{ opacity: artOpacity }}
            className="absolute top-[66%] left-0 w-full h-[34%] bg-[#0D0F13] pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-full h-[30px] bg-gradient-to-b from-transparent to-[#0D0F13]" />
          </motion.div>

          {/* Left icon glow effect */}
          <motion.div
            style={{ opacity: iconGlow }}
            className="absolute top-[5%] left-[2%] w-[80px] h-[80px] md:w-[120px] md:h-[120px] pointer-events-none"
          >
            <div className="w-full h-full rounded-full bg-[#B1A490]/25 blur-2xl animate-pulse" />
          </motion.div>

          {/* Ambient light sweep that follows scroll */}
          <motion.div
            style={{ top: sweepTop, opacity: sweepOpacity }}
            className="absolute left-0 w-full h-[25%] pointer-events-none bg-gradient-to-b from-[#B1A490]/8 via-[#B1A490]/4 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
