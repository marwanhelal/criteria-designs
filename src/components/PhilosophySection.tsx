'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const pillars = [
  {
    key: 'culture',
    title: 'CULTURE',
    description: 'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
  },
  {
    key: 'nature',
    title: 'NATURE',
    description: 'Engineering sustainable, eco-conscious environments that harmonize with and protect the natural world.',
  },
  {
    key: 'art',
    title: 'ART',
    description: 'Sculpting functional masterpieces that blend structural precision with visionary aesthetic expression.',
  },
]

interface PhilosophyData {
  philosophyCultureImage: string | null
  philosophyNatureImage: string | null
  philosophyArtImage: string | null
}

export default function PhilosophySection() {
  const [data, setData] = useState<PhilosophyData | null>(null)
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.philosophyCultureImage || d?.philosophyNatureImage || d?.philosophyArtImage) {
          setData(d)
        }
      })
      .catch(() => {})
  }, [])

  const images = data ? [
    data.philosophyCultureImage,
    data.philosophyNatureImage,
    data.philosophyArtImage,
  ] : []

  if (!data) return <section ref={sectionRef} />

  return (
    <section
      ref={sectionRef}
      data-navbar-dark
      className="relative w-full bg-white overflow-hidden py-[60px] md:py-[90px]"
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

        {/* Main content: image + tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-0"
        >
          {/* Image showcase */}
          <div className="relative flex-1 aspect-[4/3] lg:aspect-auto lg:min-h-[500px] rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none overflow-hidden bg-[#F0EDE8]">
            <AnimatePresence mode="wait">
              {images[active] && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[active]!}
                    alt={pillars[active].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overlay with active title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-6 left-6 md:bottom-10 md:left-10 pointer-events-none"
              >
                <span className="font-[var(--font-libre-franklin)] text-[10px] md:text-[11px] text-white/50 uppercase tracking-[3px]">
                  0{active + 1} / 03
                </span>
                <h3
                  className="font-[var(--font-merriweather)] text-white font-bold leading-none mt-2"
                  style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '0.06em' }}
                >
                  {pillars[active].title}
                </h3>
              </motion.div>
            </AnimatePresence>

            {/* Corner accent */}
            <div className="absolute top-5 right-5 w-[30px] h-[30px] border-t border-r border-white/20 pointer-events-none hidden md:block" />
          </div>

          {/* Right: pillar tabs */}
          <div className="flex flex-row lg:flex-col lg:w-[340px] bg-[#181C23] rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none">
            {pillars.map((pillar, i) => (
              <button
                key={pillar.key}
                onClick={() => setActive(i)}
                className={`group/tab flex-1 lg:flex-none relative flex flex-col justify-center px-5 md:px-8 py-6 lg:py-0 lg:h-1/3 text-left transition-all duration-500 cursor-pointer ${
                  i < 2 ? 'border-b lg:border-b border-white/[0.06]' : ''
                } ${active === i ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
              >
                {/* Active indicator */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#B1A490] origin-top hidden lg:block"
                  initial={false}
                  animate={{ scaleY: active === i ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
                {/* Mobile active indicator */}
                <motion.div
                  className="absolute left-0 right-0 bottom-0 h-[3px] bg-[#B1A490] origin-left lg:hidden"
                  initial={false}
                  animate={{ scaleX: active === i ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />

                <span className={`font-[var(--font-libre-franklin)] text-[10px] tracking-[2px] transition-colors duration-300 ${
                  active === i ? 'text-[#B1A490]' : 'text-white/25'
                }`}>
                  0{i + 1}
                </span>
                <h4 className={`font-[var(--font-merriweather)] text-[16px] md:text-[20px] lg:text-[24px] font-bold tracking-[2px] md:tracking-[3px] leading-none mt-2 transition-all duration-400 ${
                  active === i ? 'text-white' : 'text-white/40 group-hover/tab:text-white/60'
                }`}>
                  {pillar.title}
                </h4>
                <p className={`font-[var(--font-open-sans)] text-[11px] md:text-[12px] leading-[1.5] mt-2 transition-all duration-500 hidden md:block ${
                  active === i ? 'text-white/50 max-h-[60px]' : 'text-white/0 max-h-0'
                } overflow-hidden`}>
                  {pillar.description}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
