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
      {/* Hero image — fills right side of the header */}
      <motion.div
        className="flex-1 relative overflow-hidden bg-[#0a0a0a] mx-4 lg:mx-0 cursor-zoom-in group rounded-2xl lg:rounded-none"
        style={{ minHeight: 'clamp(220px, 42vw, 700px)' }}
        initial="hidden"
        animate="visible"
        onClick={() => setOpen(true)}
      >
        {/* Image — zooms out as curtain reveals */}
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { scale: 1.12 },
            visible: { scale: 1, transition: { duration: 1.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const } },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </motion.div>

        {/* Curtain wipes right */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0a] z-10 origin-right"
          variants={{
            hidden: { scaleX: 1 },
            visible: { scaleX: 0, transition: { duration: 1.0, delay: 0.1, ease: [0.76, 0, 0.24, 1] as const } },
          }}
        />

        {/* Left-edge blend — seamlessly merges with the info panel */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />

        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-20" />

        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent pointer-events-none z-20" />

        {/* Gold bottom rim */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#B1A490]/25 to-transparent z-30" />

        {/* Hover overlay */}
        <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Expand icon — bottom right */}
        <motion.div
          className="absolute bottom-6 right-6 z-40 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-400"
          initial={false}
        >
          <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] text-white/60">
            View Full
          </span>
          <div className="w-10 h-10 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2 2H8M2 2V8M2 2L9 9" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 18H12M18 18V12M18 18L11 11" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>

        {/* Subtle gold corner accent — top right */}
        <div className="absolute top-5 right-5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-5 h-5 border-t border-r border-[#B1A490]/50" />
        </div>
        <div className="absolute bottom-5 left-5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-5 h-5 border-b border-l border-[#B1A490]/50" />
        </div>
      </motion.div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/97 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-5 right-5 text-white/50 hover:text-white text-4xl leading-none z-10 transition-colors"
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
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-xl"
              style={{ display: 'block', boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
