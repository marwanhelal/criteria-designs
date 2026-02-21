'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface GalleryImage {
  id: string
  url: string
  alt?: string
}

interface Props {
  images: GalleryImage[]
  projectTitle: string
}

// Shared variants — curtain wipes off to the right, image zooms out
const curtainV = {
  hidden: { scaleX: 1 },
  visible: { scaleX: 0, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const } },
}
const imageV = {
  hidden: { scale: 1.15 },
  visible: { scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function GalleryGrid({ images, projectTitle }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const close = useCallback(() => setOpen(false), [])
  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  return (
    <>
      {/* Stagger container — each card reveals sequentially */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 gap-x-[13px] gap-y-[9px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {images.map((image, i) => (
          <motion.div
            key={image.id}
            // Empty variants: just a stagger-timing anchor for children
            variants={{ hidden: {}, visible: {} }}
            className="relative overflow-hidden cursor-zoom-in group"
            style={{ aspectRatio: '415/233' }}
            onClick={() => { setIndex(i); setOpen(true) }}
          >
            {/* Image zooms out as curtain reveals it */}
            <motion.div className="absolute inset-0" variants={imageV}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt || projectTitle}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
              />
            </motion.div>

            {/* Black curtain that wipes off to the right */}
            <motion.div
              className="absolute inset-0 bg-[#0a0a0a] z-10 origin-right"
              variants={curtainV}
            />

            {/* Hover overlay — expand icon */}
            <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-11 h-11 border border-white/80 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1.5 1.5H6.5M1.5 1.5V6.5M1.5 1.5L7.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 16.5H11.5M16.5 16.5V11.5M16.5 16.5L10.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white text-4xl leading-none z-10 transition-colors"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index].url}
              alt={images[index].alt || projectTitle}
              className="max-w-[95vw] max-h-[90vh] object-contain"
              style={{ display: 'block' }}
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-5xl leading-none z-10 px-2 transition-colors"
                onClick={e => { e.stopPropagation(); prev() }}
                aria-label="Previous"
              >‹</button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-5xl leading-none z-10 px-2 transition-colors"
                onClick={e => { e.stopPropagation(); next() }}
                aria-label="Next"
              >›</button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-widest">
                {index + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
