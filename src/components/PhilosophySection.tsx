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
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20])

  // Mouse follow for image
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12
    setOffset({ x, y })
  }
  const handleMouseLeave = () => setOffset({ x: 0, y: 0 })

  return (
    <div
      ref={ref}
      className="relative max-w-[1290px] mx-auto px-6 md:px-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-4 lg:gap-0 py-10 lg:py-20`}
      >
        {/* Artistic image — displayed with contain so organic edges show */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative w-full lg:w-[60%]"
          style={{ y: imgY }}
        >
          {image && (
            <motion.div
              animate={{ x: offset.x, y: offset.y }}
              transition={{ type: 'spring', stiffness: 150, damping: 25 }}
              className="relative w-full"
              style={{ aspectRatio: '4/3' }}
            >
              <Image
                src={image}
                alt={pillar.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain"
                unoptimized
              />
            </motion.div>
          )}
        </motion.div>

        {/* Text — overlapping slightly on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ y: textY }}
          className={`relative w-full lg:w-[45%] z-10 ${
            isEven ? 'lg:-ml-[5%]' : 'lg:-mr-[5%]'
          }`}
        >
          <div className={`bg-white/80 backdrop-blur-sm p-8 md:p-10 lg:p-12 ${isEven ? 'lg:text-left' : 'lg:text-right'}`}>
            {/* Number */}
            <span className="font-[var(--font-merriweather)] text-[48px] md:text-[60px] text-[#181C23]/[0.06] font-bold leading-none block">
              {pillar.num}
            </span>

            <div className="-mt-6">
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] tracking-[4px] uppercase">
                {pillar.subtitle}
              </span>

              <h3 className="font-[var(--font-merriweather)] text-[30px] md:text-[36px] lg:text-[42px] text-[#181C23] font-bold mt-2 leading-[1.1] tracking-[1px]">
                {pillar.title}
              </h3>

              <div className={`w-[28px] h-[2px] bg-[#B1A490] mt-5 mb-5 ${isEven ? '' : 'lg:ml-auto'}`} />

              <p className="font-[var(--font-open-sans)] text-[13px] md:text-[14px] text-[#777] leading-[1.9] max-w-[360px] lg:max-w-none">
                {pillar.description}
              </p>
            </div>
          </div>
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
    <section ref={sectionRef} data-navbar-dark className="relative w-full bg-white overflow-hidden">
      {/* Section header */}
      <div className="pt-[80px] md:pt-[120px] pb-[20px] md:pb-[40px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-[1290px] mx-auto px-6 md:px-8 text-center"
        >
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-[#181C23] leading-[1.1] mt-5">
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

      <div className="h-[40px] md:h-[60px]" />
    </section>
  )
}
