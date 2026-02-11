'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Tighter reveal ranges so animation happens in a shorter scroll distance
  // Culture: fades from dark to bright between 15%-30%
  // Nature: 30%-45%
  // Art: 45%-60%
  const cultureOverlay = useTransform(scrollYProgress, [0.15, 0.28], [0.88, 0])
  const natureOverlay = useTransform(scrollYProgress, [0.28, 0.42], [0.88, 0])
  const artOverlay = useTransform(scrollYProgress, [0.42, 0.56], [0.88, 0])

  // Golden glow line at reveal edge — peaks briefly during each reveal
  const cultureGlow = useTransform(scrollYProgress, [0.15, 0.22, 0.28], [0, 1, 0])
  const natureGlow = useTransform(scrollYProgress, [0.28, 0.35, 0.42], [0, 1, 0])
  const artGlow = useTransform(scrollYProgress, [0.42, 0.49, 0.56], [0, 1, 0])

  // Icon glow
  const iconGlow = useTransform(scrollYProgress, [0.12, 0.25], [0, 1])

  // Parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%'])

  // Track active section for label highlights
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.2) setActiveSection(0)
    else if (v < 0.35) setActiveSection(1)
    else if (v < 0.48) setActiveSection(2)
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
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className={`font-[var(--font-libre-franklin)] text-[11px] md:text-[13px] uppercase tracking-[2px] md:tracking-[3px] transition-all duration-700 ${
                  activeSection >= i + 1
                    ? 'text-[#B1A490]'
                    : 'text-white/20'
                }`}
              >
                {label}
              </span>
              <span
                className={`block h-[2px] rounded-full transition-all duration-700 ${
                  activeSection >= i + 1
                    ? 'w-6 bg-[#B1A490]'
                    : 'w-0 bg-transparent'
                }`}
              />
            </div>
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
        <motion.div style={{ y: imageY }} className="relative">
          {/* Base image — always visible */}
          <Image
            src={philosophyImage}
            alt="Our Philosophy - Culture, Nature, Art"
            width={1920}
            height={1080}
            className="w-full h-auto block"
            unoptimized
            priority
          />

          {/* Culture overlay — semi-transparent dark, fades to reveal */}
          <motion.div
            style={{ opacity: cultureOverlay }}
            className="absolute top-0 left-0 w-full h-[35%] bg-black/90 pointer-events-none"
          />
          {/* Culture reveal glow line */}
          <motion.div
            style={{ opacity: cultureGlow }}
            className="absolute top-[33%] left-0 w-full h-[4px] pointer-events-none"
          >
            <div className="w-full h-full bg-[#B1A490] shadow-[0_0_20px_4px_rgba(177,164,144,0.6)]" />
          </motion.div>

          {/* Nature overlay */}
          <motion.div
            style={{ opacity: natureOverlay }}
            className="absolute top-[33%] left-0 w-full h-[35%] bg-black/90 pointer-events-none"
          />
          {/* Nature reveal glow line */}
          <motion.div
            style={{ opacity: natureGlow }}
            className="absolute top-[66%] left-0 w-full h-[4px] pointer-events-none"
          >
            <div className="w-full h-full bg-[#B1A490] shadow-[0_0_20px_4px_rgba(177,164,144,0.6)]" />
          </motion.div>

          {/* Art overlay */}
          <motion.div
            style={{ opacity: artOverlay }}
            className="absolute top-[66%] left-0 w-full h-[34%] bg-black/90 pointer-events-none"
          />
          {/* Art reveal glow line */}
          <motion.div
            style={{ opacity: artGlow }}
            className="absolute top-[96%] left-0 w-full h-[4px] pointer-events-none"
          >
            <div className="w-full h-full bg-[#B1A490] shadow-[0_0_20px_4px_rgba(177,164,144,0.6)]" />
          </motion.div>

          {/* Left icon glow effect */}
          <motion.div
            style={{ opacity: iconGlow }}
            className="absolute top-[4%] left-[1%] w-[100px] h-[100px] md:w-[160px] md:h-[160px] pointer-events-none"
          >
            <div className="w-full h-full rounded-full bg-[#B1A490]/30 blur-3xl" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
