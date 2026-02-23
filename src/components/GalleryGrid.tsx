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

function ExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1.5 1.5H6.5M1.5 1.5V6.5M1.5 1.5L7.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 16.5H11.5M16.5 16.5V11.5M16.5 16.5L10.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Tile({
  image,
  projectTitle,
  index,
  onClick,
  style,
}: {
  image: GalleryImage
  projectTitle: string
  index: number
  onClick: () => void
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: (index % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl cursor-zoom-in group"
      style={style}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alt || projectTitle}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-11 h-11 border border-white/70 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
          <ExpandIcon />
        </div>
      </div>
    </motion.div>
  )
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

  if (images.length === 0) return null

  const openImg = (i: number) => { setIndex(i); setOpen(true) }

  // Build rows: alternate between left-wide and right-wide bento groups of 3
  // Leftover 1 or 2 images get their own simple row
  const rows: React.ReactNode[] = []
  let i = 0
  let groupIdx = 0

  while (i < images.length) {
    const remaining = images.length - i

    if (remaining >= 3) {
      const g = images.slice(i, i + 3)
      const base = i
      const leftWide = groupIdx % 2 === 0

      rows.push(
        <div
          key={`bento-${i}`}
          style={{
            display: 'grid',
            gridTemplateColumns: leftWide ? '2fr 1fr' : '1fr 2fr',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: '10px',
            aspectRatio: '3 / 1',
          }}
        >
          {leftWide ? (
            <>
              {/* Wide left */}
              <Tile
                image={g[0]} projectTitle={projectTitle} index={base}
                onClick={() => openImg(base)}
                style={{ gridColumn: '1', gridRow: '1 / 3' }}
              />
              {/* Stacked right */}
              <Tile image={g[1]} projectTitle={projectTitle} index={base + 1} onClick={() => openImg(base + 1)} style={{ gridColumn: '2', gridRow: '1' }} />
              <Tile image={g[2]} projectTitle={projectTitle} index={base + 2} onClick={() => openImg(base + 2)} style={{ gridColumn: '2', gridRow: '2' }} />
            </>
          ) : (
            <>
              {/* Stacked left */}
              <Tile image={g[0]} projectTitle={projectTitle} index={base} onClick={() => openImg(base)} style={{ gridColumn: '1', gridRow: '1' }} />
              <Tile image={g[1]} projectTitle={projectTitle} index={base + 1} onClick={() => openImg(base + 1)} style={{ gridColumn: '1', gridRow: '2' }} />
              {/* Wide right */}
              <Tile
                image={g[2]} projectTitle={projectTitle} index={base + 2}
                onClick={() => openImg(base + 2)}
                style={{ gridColumn: '2', gridRow: '1 / 3' }}
              />
            </>
          )}
        </div>
      )
      i += 3
      groupIdx++
    } else if (remaining === 2) {
      const g = images.slice(i, i + 2)
      const base = i
      rows.push(
        <div key={`pair-${i}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Tile image={g[0]} projectTitle={projectTitle} index={base} onClick={() => openImg(base)} style={{ aspectRatio: '16/9' }} />
          <Tile image={g[1]} projectTitle={projectTitle} index={base + 1} onClick={() => openImg(base + 1)} style={{ aspectRatio: '16/9' }} />
        </div>
      )
      i += 2
    } else {
      const base = i
      rows.push(
        <Tile
          key={`solo-${i}`} image={images[i]} projectTitle={projectTitle} index={base}
          onClick={() => openImg(base)}
          style={{ aspectRatio: '21/9' }}
        />
      )
      i += 1
    }
  }

  return (
    <>
      <div className="space-y-[10px]">
        {rows}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/96 flex items-center justify-center"
          onClick={close}
        >
          <button
            className="absolute top-5 right-5 text-white/50 hover:text-white text-4xl leading-none z-10 transition-colors"
            onClick={close}
            aria-label="Close"
          >×</button>
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl leading-none z-10 px-2 transition-colors"
                onClick={e => { e.stopPropagation(); prev() }}
                aria-label="Previous"
              >‹</button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl leading-none z-10 px-2 transition-colors"
                onClick={e => { e.stopPropagation(); next() }}
                aria-label="Next"
              >›</button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[3px]">
                {index + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
