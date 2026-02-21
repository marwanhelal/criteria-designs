'use client'

import { useState, useEffect, useCallback } from 'react'

interface GalleryImage {
  id: string
  url: string
  alt?: string
}

interface Props {
  images: GalleryImage[]
  projectTitle: string
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
      {/* Gallery grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-[13px] gap-y-[9px]">
        {images.map((image, i) => (
          <div
            key={image.id}
            className="relative overflow-hidden bg-[#1a1a1a] cursor-zoom-in"
            style={{ aspectRatio: '415/233' }}
            onClick={() => { setIndex(i); setOpen(true) }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt || projectTitle}
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
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
              src={images[index].url}
              alt={images[index].alt || projectTitle}
              className="max-w-[95vw] max-h-[90vh] object-contain"
              style={{ display: 'block' }}
            />
          </div>

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
