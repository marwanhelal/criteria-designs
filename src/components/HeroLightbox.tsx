'use client'

import { useState, useEffect, useCallback } from 'react'

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
      {/* Hero thumbnail — fills right edge on desktop */}
      <div
        className="flex-1 relative h-[280px] lg:h-[474px] overflow-hidden bg-[#1a1a1a] mx-8 lg:mx-0 cursor-zoom-in"
        onClick={() => setOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white text-4xl leading-none z-10"
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
