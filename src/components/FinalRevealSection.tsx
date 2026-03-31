'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface RevealImage {
  id: string
  url: string
  alt?: string
}

interface Props {
  images: RevealImage[]
  projectTitle: string
}

function RevealImage({ url, alt, index }: { url: string; alt: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-3xl"
      style={{
        minHeight: 'clamp(280px, 55vw, 820px)',
        boxShadow: '0 0 0 1px rgba(177,164,144,0.08), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(177,164,144,0.06)',
      }}
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-[-8%]"
        style={{ y }}
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      </motion.div>

      {/* Curtain wipe reveal */}
      <motion.div
        className="absolute inset-0 bg-black z-10 origin-right"
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Bottom vignette + glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-20" />

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-20" />

      {/* Subtle gold rim at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#B1A490]/30 to-transparent z-30" />
    </motion.div>
  )
}

export default function FinalRevealSection({ images, projectTitle }: Props) {
  return (
    <div className="space-y-5">
      {images.map((image, i) => (
        <RevealImage
          key={image.id}
          url={image.url}
          alt={image.alt || projectTitle}
          index={i}
        />
      ))}
    </div>
  )
}
