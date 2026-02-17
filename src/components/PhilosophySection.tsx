'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const pillars = [
  {
    key: 'culture',
    num: '01',
    title: 'Culture',
    description:
      'Every space we design begins with a deep understanding of the people who will inhabit it — honoring heritage, celebrating identity, and fostering human connection.',
  },
  {
    key: 'nature',
    num: '02',
    title: 'Nature',
    description:
      'Sustainability is the foundation, not an afterthought. We engineer environments that breathe with the natural world, integrating eco-conscious materials and biophilic design.',
  },
  {
    key: 'art',
    num: '03',
    title: 'Art',
    description:
      'Architecture is functional sculpture at human scale. We blend structural precision with aesthetic expression to create buildings that inspire and endure.',
  },
]

interface PhilosophyData {
  philosophyCultureImage: string | null
  philosophyNatureImage: string | null
  philosophyArtImage: string | null
}

export default function PhilosophySection() {
  const [data, setData] = useState<PhilosophyData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

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
    <section ref={sectionRef} className="relative w-full bg-[#181C23] py-[80px] md:py-[120px] overflow-hidden">
      <div className="max-w-[1290px] mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
            Our Philosophy
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.1] mt-5 tracking-[1px]">
            Three Pillars
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-[40px] h-[2px] bg-[#B1A490] mx-auto mt-6 origin-center"
          />
        </motion.div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.key}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
              className="group"
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                {images[i] && (
                  <Image
                    src={images[i]!}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized
                  />
                )}
              </div>

              {/* Text */}
              <div className="pt-7">
                <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490]/60 tracking-[2px]">
                  {pillar.num}
                </span>
                <h3 className="font-[var(--font-merriweather)] text-[24px] md:text-[28px] text-white mt-2 tracking-[2px]">
                  {pillar.title}
                </h3>
                <div className="w-[24px] h-[1px] bg-[#B1A490]/40 mt-4 mb-4 transition-all duration-500 group-hover:w-[48px] group-hover:bg-[#B1A490]" />
                <p className="font-[var(--font-open-sans)] text-[13px] md:text-[14px] text-white/40 leading-[1.85]">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
