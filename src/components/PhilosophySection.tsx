'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const pillars = [
  {
    key: 'culture',
    num: '01',
    title: 'CULTURE',
    headline: 'Rooted in Heritage',
    description:
      'Every space we design begins with a deep understanding of the people who will inhabit it. We believe architecture must honor local heritage, celebrate identity, and foster meaningful human connection within the urban fabric.',
  },
  {
    key: 'nature',
    num: '02',
    title: 'NATURE',
    headline: 'In Harmony with Earth',
    description:
      'Sustainability is not an afterthought — it is the foundation. We engineer environments that breathe with the natural world, integrating eco-conscious materials and biophilic design to protect the planet we build upon.',
  },
  {
    key: 'art',
    num: '03',
    title: 'ART',
    headline: 'Sculpted with Vision',
    description:
      'Architecture is the ultimate art form — functional sculpture at human scale. We blend structural precision with aesthetic expression to create buildings that inspire awe and stand as testaments to visionary design.',
  },
]

interface PhilosophyData {
  philosophyCultureImage: string | null
  philosophyNatureImage: string | null
  philosophyArtImage: string | null
}

function PillarRow({
  pillar,
  image,
  index,
}: {
  pillar: (typeof pillars)[0]
  image: string | null
  index: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rowRef, { once: true, amount: 0.25 })
  const isReversed = index % 2 !== 0

  return (
    <div ref={rowRef} className="relative">
      <div
        className={`flex flex-col ${
          isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } min-h-[400px] md:min-h-[500px] lg:min-h-[560px]`}
      >
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isReversed ? 40 : -40 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative w-full lg:w-[58%] overflow-hidden"
        >
          {image && (
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-full lg:absolute lg:inset-0 group/img">
              <Image
                src={image}
                alt={pillar.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover/img:scale-105"
                unoptimized
              />
              {/* Subtle gradient toward text side */}
              <div
                className={`absolute inset-0 pointer-events-none hidden lg:block ${
                  isReversed
                    ? 'bg-gradient-to-l from-[#181C23]/30 to-transparent'
                    : 'bg-gradient-to-r from-[#181C23]/30 to-transparent'
                }`}
                style={{ [isReversed ? 'right' : 'left']: 'auto' }}
              />
            </div>
          )}

          {/* Large ghost number on the image */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-4 right-6 lg:bottom-8 lg:right-10 font-[var(--font-merriweather)] font-bold text-white/10 leading-none pointer-events-none select-none"
            style={{ fontSize: 'clamp(80px, 12vw, 160px)' }}
          >
            {pillar.num}
          </motion.span>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isReversed ? -40 : 40 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-full lg:w-[42%] bg-[#181C23] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 lg:py-16"
        >
          {/* Number + line */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] tracking-[3px]">
              {pillar.num}
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-[1px] w-[40px] bg-[#B1A490]/40 origin-left"
            />
          </div>

          {/* Title */}
          <h3
            className="font-[var(--font-merriweather)] text-white font-bold leading-none tracking-[4px] md:tracking-[6px]"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            {pillar.title}
          </h3>

          {/* Headline */}
          <p className="font-[var(--font-merriweather)] text-[#B1A490] text-[14px] md:text-[16px] italic mt-3 leading-[1.4]">
            {pillar.headline}
          </p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent mt-6 mb-6 origin-left"
          />

          {/* Description */}
          <p className="font-[var(--font-open-sans)] text-[13px] md:text-[15px] text-white/60 leading-[1.8] max-w-[440px]">
            {pillar.description}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function PhilosophySection() {
  const [data, setData] = useState<PhilosophyData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 })

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

  const images = data
    ? [data.philosophyCultureImage, data.philosophyNatureImage, data.philosophyArtImage]
    : []

  if (!data) return <section ref={sectionRef} />

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      {/* Section header */}
      <div className="bg-[#181C23] py-[60px] md:py-[80px]">
        <div className="max-w-[1290px] mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#B1A490] uppercase tracking-[4px]">
              What drives us
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[60px] text-white leading-[1.1] mt-4">
              Our Philosophy
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-[60px] h-[2px] bg-[#B1A490] mx-auto mt-6 origin-center"
            />
            <p className="font-[var(--font-open-sans)] text-[14px] md:text-[16px] text-white/40 mt-6 max-w-[600px] mx-auto leading-[1.7]">
              Every project we undertake is guided by three pillars that define who we are and how we create.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Three pillar rows */}
      {pillars.map((pillar, i) => (
        <PillarRow key={pillar.key} pillar={pillar} image={images[i]} index={i} />
      ))}
    </section>
  )
}
