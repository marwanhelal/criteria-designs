'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const pillars = [
  {
    key: 'culture',
    num: '01',
    title: 'Culture',
    subtitle: 'Rooted in Heritage',
    description:
      'Every space we design begins with a deep understanding of the people who will inhabit it — honoring heritage, celebrating identity, and fostering human connection.',
  },
  {
    key: 'nature',
    num: '02',
    title: 'Nature',
    subtitle: 'In Harmony with Earth',
    description:
      'Sustainability is the foundation, not an afterthought. We engineer environments that breathe with the natural world, integrating eco-conscious materials and biophilic design.',
  },
  {
    key: 'art',
    num: '03',
    title: 'Art',
    subtitle: 'Sculpted with Vision',
    description:
      'Architecture is functional sculpture at human scale. We blend structural precision with aesthetic expression to create buildings that inspire and endure.',
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
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const isEven = index % 2 === 0

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40])

  // Mouse follow
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16
    setOffset({ x, y })
  }
  const handleMouseLeave = () => setOffset({ x: 0, y: 0 })

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[100vh]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch min-h-[inherit]`}
      >
        {/* Full-bleed image side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative w-full lg:w-[60%] h-[400px] md:h-[500px] lg:h-auto overflow-hidden"
        >
          {image && (
            <motion.div
              className="absolute inset-[-40px]"
              style={{ y: imgY }}
              animate={{ x: offset.x, y: offset.y }}
              transition={{ type: 'spring', stiffness: 120, damping: 25 }}
            >
              <Image
                src={image}
                alt={pillar.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                unoptimized
              />
            </motion.div>
          )}

          {/* Edge gradient blending into text panel */}
          <div
            className={`absolute inset-y-0 w-[160px] pointer-events-none hidden lg:block ${
              isEven
                ? 'right-0 bg-gradient-to-l from-[#181C23] to-transparent'
                : 'left-0 bg-gradient-to-r from-[#181C23] to-transparent'
            }`}
          />
          <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-[#181C23] to-transparent lg:hidden" />
        </motion.div>

        {/* Text side */}
        <div className="w-full lg:w-[40%] bg-[#181C23] flex items-center relative">
          <div className={`px-8 md:px-12 lg:px-16 py-14 lg:py-0 ${isEven ? '' : 'lg:text-right'}`}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-[var(--font-merriweather)] text-[72px] md:text-[96px] text-white/[0.04] font-bold leading-none select-none block"
            >
              {pillar.num}
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="-mt-10 lg:-mt-14"
            >
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] tracking-[4px] uppercase">
                {pillar.subtitle}
              </span>

              <h3 className="font-[var(--font-merriweather)] text-[34px] md:text-[40px] lg:text-[48px] text-white font-bold mt-3 leading-[1.05] tracking-[2px]">
                {pillar.title}
              </h3>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={`w-[32px] h-[2px] bg-[#B1A490] mt-6 mb-6 ${isEven ? 'origin-left' : 'origin-right lg:ml-auto'}`}
              />

              <p className="font-[var(--font-open-sans)] text-[13px] md:text-[15px] text-white/40 leading-[1.9] max-w-[380px]">
                {pillar.description}
              </p>
            </motion.div>
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
    <section ref={sectionRef} className="relative w-full bg-[#181C23] overflow-hidden">
      {/* Section header */}
      <div className="py-[70px] md:py-[100px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-[1290px] mx-auto px-6 md:px-8 text-center"
        >
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.1] mt-5">
            Our Philosophy
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-[40px] h-[2px] bg-[#B1A490] mx-auto mt-6 origin-center"
          />
        </motion.div>
      </div>

      {/* Pillar blocks */}
      {pillars.map((pillar, i) => (
        <PillarBlock key={pillar.key} pillar={pillar} image={images[i]} index={i} />
      ))}
    </section>
  )
}
