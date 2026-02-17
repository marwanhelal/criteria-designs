'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const pillars = [
  {
    key: 'culture',
    title: 'Culture',
    quote:
      'Every space we design begins with a deep understanding of the people who will inhabit it. We believe architecture must honor local heritage, celebrate identity, and foster meaningful human connection.',
  },
  {
    key: 'nature',
    title: 'Nature',
    quote:
      'Sustainability is the foundation, not an afterthought. We engineer environments that breathe with the natural world, integrating eco-conscious materials and biophilic principles into every project.',
  },
  {
    key: 'art',
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
}: {
  pillar: (typeof pillars)[0]
  image: string | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="relative w-full lg:w-[65%] h-[350px] md:h-[450px] lg:h-[520px] overflow-hidden group">
          {image && (
            <Image
              src={image}
              alt={pillar.title}
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
              unoptimized
            />
          )}
          {/* Title label at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/50 to-transparent">
            <span className="font-[var(--font-merriweather)] text-[15px] md:text-[17px] text-white/90 tracking-[1px]">
              {pillar.title}
            </span>
          </div>
        </div>

        {/* Quote panel */}
        <div className="w-full lg:w-[35%] bg-[#222] flex items-center">
          <div className="p-8 md:p-10 lg:p-14">
            <p className="font-[var(--font-open-sans)] text-[15px] md:text-[17px] lg:text-[18px] text-white/70 leading-[1.8] italic">
              &ldquo;{pillar.quote}&rdquo;
            </p>
            <span className="block mt-6 font-[var(--font-libre-franklin)] text-[11px] text-white/40 tracking-[3px] uppercase">
              Criteria Designs
            </span>
          </div>
        </div>
      </div>
    </motion.div>
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
    <section ref={sectionRef} className="relative w-full bg-[#111] overflow-hidden">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-[80px] md:pt-[100px] pb-[50px] md:pb-[60px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[var(--font-merriweather)] text-[32px] md:text-[42px] lg:text-[48px] text-white leading-[1.15]">
            Our Philosophy
          </h2>
          <p className="font-[var(--font-open-sans)] text-[14px] md:text-[16px] text-white/35 mt-4 max-w-[500px] leading-[1.7]">
            Three pillars that define who we are and how we create.
          </p>
        </motion.div>
      </div>

      {/* Pillar blocks */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 pb-[80px] md:pb-[100px] flex flex-col gap-10 md:gap-14">
        {pillars.map((pillar, i) => (
          <PillarBlock key={pillar.key} pillar={pillar} image={images[i]} />
        ))}
      </div>
    </section>
  )
}
