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

// Each full-width image has a parallax scroll + curtain reveal
function RevealImage({ url, alt }: { url: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Image drifts 10% opposite to scroll direction → depth / parallax feel
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <motion.div
      ref={ref}
      className="relative w-full overflow-hidden bg-[#0a0a0a]"
      style={{ aspectRatio: '1272/716' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Parallax + zoom-out */}
      <motion.div
        className="absolute inset-[-9%]"
        style={{ y }}
        variants={{
          hidden: { scale: 1.08 },
          visible: { scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const } },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      </motion.div>

      {/* Curtain wipes off to the right */}
      <motion.div
        className="absolute inset-0 bg-[#0a0a0a] z-10 origin-right"
        variants={{
          hidden: { scaleX: 1 },
          visible: { scaleX: 0, transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] as const } },
        }}
      />
    </motion.div>
  )
}

export default function FinalRevealSection({ images, projectTitle }: Props) {
  return (
    <div className="space-y-[3px]">
      {images.map(image => (
        <RevealImage
          key={image.id}
          url={image.url}
          alt={image.alt || projectTitle}
        />
      ))}
    </div>
  )
}
