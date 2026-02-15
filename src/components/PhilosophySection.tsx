'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1, margin: '0px 0px -50px 0px' })

  // 3D tilt state — via DOM for performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!imageRef.current) return
    imageRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
  }, [])

  useEffect(() => {
    const el = imageRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

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
      className="bg-[#0D0F13] py-[60px] md:py-[90px] overflow-hidden"
    >
      <div className="max-w-[1290px] mx-auto px-6 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#B1A490] uppercase tracking-[4px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.1] mt-4">
            Our Philosophy
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-[60px] h-[2px] bg-[#B1A490] mx-auto mt-5 origin-center"
          />
        </motion.div>

        {/* Interactive image with 3D tilt */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mb-12 md:mb-16"
        >
          <div
            ref={imageRef}
            className="relative w-full overflow-hidden rounded-lg cursor-default"
            style={{
              transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              transformStyle: 'preserve-3d',
              maxHeight: '600px',
            }}
          >
            <Image
              src={philosophyImage}
              alt="Our Philosophy"
              width={1920}
              height={1080}
              className="w-full h-auto block object-cover"
              style={{ maxHeight: '600px' }}
              unoptimized
              priority
            />
            {/* Bottom gradient fade into dark background */}
            <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-[#0D0F13] via-[#0D0F13]/50 to-transparent pointer-events-none" />
            {/* Subtle warm overlay on hover */}
            <div className="absolute inset-0 bg-[#B1A490]/0 hover:bg-[#B1A490]/[0.04] transition-colors duration-700 pointer-events-none" />
          </div>

          {/* Decorative corner accents on the image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute top-4 left-4 w-[40px] h-[40px] border-t border-l border-[#B1A490]/30 pointer-events-none hidden md:block"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-4 right-4 w-[40px] h-[40px] border-b border-r border-[#B1A490]/30 pointer-events-none hidden md:block"
          />
        </motion.div>

        {/* Philosophy pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group/card relative flex flex-col px-6 lg:px-10 py-8 cursor-default transition-colors duration-300 hover:bg-white/[0.03] rounded-md ${
                i > 0 ? 'md:border-l md:border-white/[0.08]' : ''
              } ${i < 2 ? 'border-b md:border-b-0 border-white/[0.08]' : ''}`}
            >
              {/* Number */}
              <span className="font-[var(--font-libre-franklin)] text-[11px] text-white/20 tracking-[3px] transition-colors duration-300 group-hover/card:text-[#B1A490]/40">
                {pillar.num}
              </span>

              {/* Accent line */}
              <div className="w-[30px] h-[2px] bg-white/10 mt-4 mb-4 transition-all duration-500 group-hover/card:w-[50px] group-hover/card:bg-[#B1A490]" />

              {/* Title */}
              <h3 className="font-[var(--font-merriweather)] text-[22px] lg:text-[28px] text-white font-bold tracking-[2px] leading-[1.1] transition-colors duration-300 group-hover/card:text-[#B1A490]">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="font-[var(--font-open-sans)] text-[13px] lg:text-[14px] text-white/50 leading-[1.7] mt-3 transition-colors duration-300 group-hover/card:text-white/70">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
