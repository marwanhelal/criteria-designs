'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const pillars = [
  {
    key: 'culture',
    num: '01',
    title: 'Culture',
    quote:
      'Every space we design begins with a deep understanding of the people who will inhabit it. We believe architecture must honor local heritage, celebrate identity, and foster meaningful human connection.',
  },
  {
    key: 'nature',
    num: '02',
    title: 'Nature',
    quote:
      'Sustainability is the foundation, not an afterthought. We engineer environments that breathe with the natural world, integrating eco-conscious materials and biophilic principles into every project.',
  },
  {
    key: 'art',
    num: '03',
    title: 'Art',
    quote:
      'Architecture is functional sculpture at human scale. We blend structural precision with aesthetic expression to create buildings that inspire awe and stand as testaments to visionary design.',
  },
]

interface PhilosophyData {
  philosophyCultureImage: string | null
  philosophyNatureImage: string | null
  philosophyArtImage: string | null
}

function PillarBlock({
  pillar,
  image,
  index,
}: {
  pillar: (typeof pillars)[0]
  image: string | null
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={`flex flex-col lg:flex-row ${!isLeft ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Image */}
      <div className="relative w-full lg:w-[62%] h-[350px] md:h-[450px] lg:h-[520px] overflow-hidden group">
        {image && (
          <Image
            src={image}
            alt={pillar.title}
            fill
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
            unoptimized
          />
        )}
        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent">
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-white/50 tracking-[3px] uppercase">
            {pillar.num}
          </span>
          <h3 className="font-[var(--font-playfair)] text-[26px] md:text-[32px] text-white tracking-[1px] mt-1">
            {pillar.title}
          </h3>
        </div>
      </div>

      {/* Quote panel */}
      <div className="w-full lg:w-[38%] bg-[#F2F1EE] flex items-center">
        <div className="p-8 md:p-10 lg:p-14">
          {/* Decorative quote mark */}
          <span className="font-[var(--font-playfair)] text-[60px] md:text-[72px] text-[#B1A490]/20 leading-none block -mb-6">
            &ldquo;
          </span>
          <p className="font-[var(--font-playfair)] text-[16px] md:text-[18px] lg:text-[20px] text-[#333] leading-[1.75] italic">
            {pillar.quote}
          </p>
          {/* Attribution */}
          <div className="flex items-center gap-3 mt-8">
            <span className="w-[24px] h-[1px] bg-[#B1A490]" />
            <span className="font-[var(--font-libre-franklin)] text-[11px] md:text-[12px] text-[#B1A490] tracking-[3px] uppercase">
              Criteria Designs
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MarqueeStrip() {
  const content = 'DESIGN THAT ADDS VALUE \u2014 CRITERIA DESIGNS \u2014 '
  const repeated = Array(6).fill(content).join('')

  return (
    <div className="w-full overflow-hidden py-10 md:py-14">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        <span
          className="font-[var(--font-playfair)] text-[48px] md:text-[64px] lg:text-[80px] text-[#181C23]/[0.07] font-black tracking-[2px] select-none uppercase shrink-0"
        >
          {repeated}
        </span>
        <span
          className="font-[var(--font-playfair)] text-[48px] md:text-[64px] lg:text-[80px] text-[#181C23]/[0.07] font-black tracking-[2px] select-none uppercase shrink-0"
        >
          {repeated}
        </span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
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
    <section ref={sectionRef} data-navbar-dark className="relative w-full bg-[#F8F7F4] overflow-hidden">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-[80px] md:pt-[120px] pb-[50px] md:pb-[70px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-[40px] h-[1px] bg-[#B1A490] mx-auto origin-center mb-6"
          />
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
            What Drives Us
          </span>
          <h2 className="font-[var(--font-playfair)] text-[38px] md:text-[52px] lg:text-[64px] text-[#181C23] leading-[1.1] mt-4 italic">
            Our Philosophy
          </h2>
          <p className="font-[var(--font-open-sans)] text-[14px] md:text-[16px] text-[#181C23]/40 mt-5 max-w-[520px] mx-auto leading-[1.8]">
            Three pillars that define who we are and how we create.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-[40px] h-[1px] bg-[#B1A490] mx-auto origin-center mt-6"
          />
        </motion.div>
      </div>

      {/* Zigzag pillar blocks */}
      <div className="flex flex-col gap-8 md:gap-12 pb-[60px] md:pb-[80px]">
        {pillars.map((pillar, i) => (
          <PillarBlock key={pillar.key} pillar={pillar} image={images[i]} index={i} />
        ))}
      </div>

      {/* Scrolling marquee strip */}
      <MarqueeStrip />
    </section>
  )
}
