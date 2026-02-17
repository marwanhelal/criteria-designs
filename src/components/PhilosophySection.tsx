'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

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
  const isInView = useInView(rowRef, { once: true, amount: 0.2 })
  const isReversed = index % 2 !== 0

  // Parallax for image
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  return (
    <div ref={rowRef} className="relative">
      <div
        className={`flex flex-col ${
          isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } min-h-[450px] md:min-h-[520px] lg:min-h-[600px]`}
      >
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, clipPath: isReversed ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }}
          animate={isInView ? { opacity: 1, clipPath: 'inset(0 0 0 0)' } : {}}
          transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative w-full lg:w-[60%] overflow-hidden"
        >
          {image && (
            <motion.div
              className="relative w-full h-[320px] md:h-[420px] lg:h-full lg:absolute lg:inset-[-30px] lg:right-0 lg:bottom-0 group/img"
              style={{ y: imgY }}
            >
              <Image
                src={image}
                alt={pillar.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover/img:scale-[1.08]"
                unoptimized
              />
            </motion.div>
          )}

          {/* Gradient blend toward text */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              isReversed
                ? 'bg-gradient-to-l from-[#141619] via-[#141619]/20 to-transparent'
                : 'bg-gradient-to-r from-[#141619] via-[#141619]/20 to-transparent'
            } hidden lg:block`}
          />
          {/* Bottom gradient for mobile */}
          <div className="absolute inset-x-0 bottom-0 h-[80px] bg-gradient-to-t from-[#141619] to-transparent lg:hidden" />

          {/* Large ghost number watermark */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
            className={`absolute bottom-6 font-[var(--font-merriweather)] font-bold text-white/[0.07] leading-none pointer-events-none select-none ${
              isReversed ? 'left-6 lg:left-10' : 'right-6 lg:right-10'
            }`}
            style={{ fontSize: 'clamp(100px, 15vw, 200px)' }}
          >
            {pillar.num}
          </motion.span>
        </motion.div>

        {/* Text side */}
        <div className="w-full lg:w-[40%] bg-[#141619] flex flex-col justify-center relative">
          {/* Decorative vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className={`absolute top-[15%] bottom-[15%] w-[1px] bg-[#B1A490]/15 origin-top hidden lg:block ${
              isReversed ? 'right-0' : 'left-0'
            }`}
          />

          <div className="px-8 md:px-12 lg:px-14 py-12 lg:py-0">
            {/* Number badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] tracking-[3px] border border-[#B1A490]/20 px-3 py-1.5 rounded-sm">
                {pillar.num}
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-[1px] flex-1 bg-gradient-to-r from-[#B1A490]/30 to-transparent origin-left"
              />
            </motion.div>

            {/* Title — very large */}
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-[var(--font-merriweather)] text-white font-bold leading-[0.95] tracking-[4px] md:tracking-[6px] lg:tracking-[8px]"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              {pillar.title}
            </motion.h3>

            {/* Headline — gold italic */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-[var(--font-merriweather)] text-[#B1A490] text-[15px] md:text-[17px] italic mt-4 leading-[1.4]"
            >
              — {pillar.headline}
            </motion.p>

            {/* Animated divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-[1px] w-full max-w-[280px] bg-gradient-to-r from-[#B1A490]/25 via-white/5 to-transparent mt-7 mb-7 origin-left"
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="font-[var(--font-open-sans)] text-[13px] md:text-[15px] text-white/55 leading-[1.9] max-w-[420px]"
            >
              {pillar.description}
            </motion.p>

            {/* Decorative corner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
              className={`absolute bottom-8 w-[30px] h-[30px] border-b border-[#B1A490]/15 hidden lg:block ${
                isReversed ? 'right-8 border-r' : 'left-8 border-l'
              }`}
            />
          </div>
        </div>
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
      <div className="bg-[#141619] py-[70px] md:py-[100px] relative">
        {/* Decorative background text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[var(--font-merriweather)] font-bold text-white/[0.02] leading-none pointer-events-none select-none whitespace-nowrap"
          style={{ fontSize: 'clamp(100px, 18vw, 280px)' }}
        >
          PHILOSOPHY
        </motion.span>

        <div className="max-w-[1290px] mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="font-[var(--font-libre-franklin)] text-[11px] md:text-[12px] text-[#B1A490] uppercase tracking-[5px]">
              What drives us
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[38px] md:text-[52px] lg:text-[64px] text-white leading-[1.05] mt-5 tracking-[1px]">
              Our Philosophy
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-[50px] h-[2px] bg-[#B1A490] mx-auto mt-7 origin-center"
            />
            <p className="font-[var(--font-open-sans)] text-[14px] md:text-[16px] text-white/35 mt-7 max-w-[560px] mx-auto leading-[1.8]">
              Every project we undertake is guided by three pillars that define who we are and how we create.
            </p>
          </motion.div>

          {/* Pillar indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center gap-10 md:gap-16 mt-10"
          >
            {pillars.map((p) => (
              <div key={p.key} className="flex flex-col items-center gap-2">
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/20 tracking-[2px]">
                  {p.num}
                </span>
                <span className="font-[var(--font-merriweather)] text-[13px] md:text-[15px] text-white/50 tracking-[3px] font-bold">
                  {p.title}
                </span>
              </div>
            ))}
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
