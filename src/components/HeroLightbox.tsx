'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Props {
  heroImage: string
  title: string
}

export default function HeroLightbox({ heroImage, title }: Props) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <>
      {/* Cinematic curtain reveal — hero fills right edge on desktop */}
      <motion.div
        className="flex-1 relative h-[280px] lg:h-[474px] overflow-hidden bg-[#0a0a0a] mx-8 lg:mx-0 cursor-zoom-in group"
        initial="hidden"
        animate="visible"
        onClick={() => setOpen(true)}
      >
        {/* Image zooms out as curtain reveals */}
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { scale: 1.1 },
            visible: { scale: 1, transition: { duration: 1.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const } },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </motion.div>

        {/* Curtain wipes off to the right */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0a] z-10 origin-right"
          variants={{
            hidden: { scaleX: 1 },
            visible: { scaleX: 0, transition: { duration: 0.9, delay: 0.1, ease: [0.76, 0, 0.24, 1] as const } },
          }}
        />

        {/* Hover overlay — subtle gradient + expand icon */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-5 right-5 w-12 h-12 border border-white/70 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2H8M2 2V8M2 2L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 18H12M18 18V12M18 18L11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/96 flex items-center justify-center"
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
              src={heroImage}
              alt={title}
              className="max-w-[95vw] max-h-[90vh] object-contain"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
