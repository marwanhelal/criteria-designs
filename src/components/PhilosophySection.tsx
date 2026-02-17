'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'

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
  const imgRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const isEven = index % 2 === 0
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMousePos({ x, y })
  }

  return (
    <div ref={ref} className="relative max-w-[1290px] mx-auto px-6 md:px-8">
      <div
        className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16 py-12 lg:py-24`}
      >
        {/* Image with 3D tilt */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative w-full lg:w-[58%] overflow-hidden cursor-pointer"
          style={{ perspective: 800 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }) }}
          onMouseMove={handleMouseMove}
        >
          <motion.div
            className="relative w-full aspect-[4/3] lg:aspect-[3/2] overflow-hidden"
            animate={{
              rotateY: isHovered ? mousePos.x * 3 : 0,
              rotateX: isHovered ? -mousePos.y * 3 : 0,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          >
            {image && (
              <motion.div className="absolute inset-0" style={{ y: imgY }}>
                <Image
                  src={image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            )}

            {/* Hover overlay with number */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-[#181C23]/20 flex items-center justify-center"
                >
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-[var(--font-merriweather)] text-[80px] md:text-[120px] text-white/20 font-bold select-none"
                  >
                    {pillar.num}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className={`w-full lg:w-[42%] ${isEven ? 'lg:pl-4' : 'lg:pr-4'}`}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] tracking-[4px] uppercase">
              {pillar.num} — {pillar.subtitle}
            </span>

            <h3 className="font-[var(--font-merriweather)] text-[34px] md:text-[40px] lg:text-[48px] text-[#181C23] font-bold mt-3 leading-[1.05] tracking-[2px]">
              {pillar.title}
            </h3>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-[32px] h-[2px] bg-[#B1A490] mt-5 mb-5 origin-left"
            />

            <p className="font-[var(--font-open-sans)] text-[14px] md:text-[15px] text-[#666] leading-[1.9] max-w-[400px]">
              {pillar.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Divider between rows */}
      {index < 2 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#181C23]/10 to-transparent origin-center"
        />
      )}
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
    <section ref={sectionRef} data-navbar-dark className="relative w-full bg-[#F7F6F3] overflow-hidden">
      {/* Section header */}
      <div className="pt-[80px] md:pt-[110px] pb-[30px] md:pb-[50px]">
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
          <p className="font-[var(--font-open-sans)] text-[14px] md:text-[15px] text-[#999] mt-6 max-w-[480px] mx-auto leading-[1.8]">
            Every project we undertake is guided by three pillars that define who we are and how we create.
          </p>
        </motion.div>
      </div>

      {/* Pillar blocks */}
      {pillars.map((pillar, i) => (
        <PillarBlock key={pillar.key} pillar={pillar} image={images[i]} index={i} />
      ))}

      <div className="h-[60px] md:h-[80px]" />
    </section>
  )
}
