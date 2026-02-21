'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LightboxImage {
  url: string
  alt?: string
}

interface Props {
  images: LightboxImage[]
  initialIndex?: number
  trigger: (openAt: (index: number) => void) => React.ReactNode
}

export default function ImageLightbox({ images, initialIndex = 0, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(initialIndex)

  const openAt = useCallback((i: number) => {
    setIndex(i)
    setOpen(true)
  }, [])

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
      {trigger(openAt)}

      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close button */}
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white text-4xl leading-none z-10"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>

          {/* Image */}
          <div
            className="relative max-w-[95vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative" style={{ maxWidth: '95vw', maxHeight: '90vh' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[index].url}
                alt={images[index].alt || ''}
                className="max-w-[95vw] max-h-[90vh] object-contain"
                style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Navigation — only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl leading-none z-10 px-2"
                onClick={e => { e.stopPropagation(); prev() }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl leading-none z-10 px-2"
                onClick={e => { e.stopPropagation(); next() }}
                aria-label="Next"
              >
                ›
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                {index + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
