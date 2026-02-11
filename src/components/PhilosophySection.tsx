'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const sections = [
  {
    title: 'CULTURE',
    description:
      'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
    position: 'top-[3%] left-[2%] w-[30%] h-[30%]',
    zoneTop: '0%',
  },
  {
    title: 'NATURE',
    description:
      'Engineering sustainable, eco-conscious exteriors that harmonize with and protect the natural environment.',
    position: 'top-[36%] left-[2%] w-[30%] h-[30%]',
    zoneTop: '33.33%',
  },
  {
    title: 'ART',
    description:
      'Sculpting functional masterpieces that blend structural precision with visionary aesthetic expression.',
    position: 'top-[69%] left-[2%] w-[30%] h-[28%]',
    zoneTop: '66.66%',
  },
]

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [revealed, setRevealed] = useState([false, false, false])
  const spotlightRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleHover = (index: number) => {
    setRevealed((prev) => {
      if (prev[index]) return prev
      const next = [...prev]
      next[index] = true
      return next
    })
  }

  // Move spotlight via DOM directly — no React state, no re-renders
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!spotlightRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    spotlightRef.current.style.left = `${x}px`
    spotlightRef.current.style.top = `${y}px`
    spotlightRef.current.style.opacity = '1'
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0'
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.philosophyImage) setPhilosophyImage(data.philosophyImage)
      })
      .catch(() => {})
  }, [])

  if (!philosophyImage) return null

  return (
    <section className="bg-[#0D0F13] pt-[80px] md:pt-[120px] pb-0 overflow-hidden">
      <style>{`
        .phi-zone { position: absolute; left: 0; width: 100%; height: 33.34%; z-index: 2; }
        .phi-zone .phi-dim { position: absolute; inset: 0; background: rgba(0,0,0,0.35); opacity: 0; transition: opacity 0.5s; pointer-events: none; }
        .phi-zone .phi-line { position: absolute; bottom: 0; left: 5%; width: 90%; height: 1px; opacity: 0; transition: opacity 0.5s; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(177,164,144,0.5), transparent); }

        /* When ANY zone is hovered, dim ALL zones */
        .phi-container:hover .phi-zone .phi-dim { opacity: 1; }
        /* But un-dim the hovered zone */
        .phi-container:hover .phi-zone:hover .phi-dim { opacity: 0; }
        /* Show line on hovered zone */
        .phi-zone:hover .phi-line { opacity: 1; }

        /* Text color change on hover — warm gold */
        .phi-container:has(.phi-zone-0:hover) .phi-text-0 h3,
        .phi-container:has(.phi-zone-1:hover) .phi-text-1 h3,
        .phi-container:has(.phi-zone-2:hover) .phi-text-2 h3 { color: #B1A490; }
        .phi-container:has(.phi-zone-0:hover) .phi-text-0 p,
        .phi-container:has(.phi-zone-1:hover) .phi-text-1 p,
        .phi-container:has(.phi-zone-2:hover) .phi-text-2 p { color: rgba(177,164,144,0.85); }
        .phi-text h3, .phi-text p { transition: color 0.4s; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-20">
          <span className="font-[var(--font-libre-franklin)] text-[13px] md:text-[14px] text-[#B1A490] uppercase tracking-[3px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.15] mt-4">
            Our Philosophy
          </h2>
        </div>

        <div className="flex justify-center gap-8 md:gap-14 mb-8 md:mb-12">
          {sections.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center gap-1.5">
              <span
                className={`font-[var(--font-libre-franklin)] text-[11px] md:text-[13px] uppercase tracking-[3px] md:tracking-[4px] transition-all duration-700 ${
                  revealed[i] ? 'text-[#B1A490]' : 'text-white/20'
                }`}
              >
                {s.title}
              </span>
              <span
                className={`block h-[2px] rounded-full transition-all duration-700 ${
                  revealed[i] ? 'w-8 bg-[#B1A490]' : 'w-0 bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>

        <p
          className={`text-center font-[var(--font-open-sans)] text-[12px] text-white/25 mb-4 transition-opacity duration-700 ${
            revealed[0] ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Hover to explore
        </p>
      </div>

      {/* Image with interactions */}
      <div ref={containerRef} className="phi-container relative w-full overflow-hidden">
        <Image
          src={philosophyImage}
          alt="Our Philosophy"
          width={1920}
          height={1080}
          className="w-full h-auto block"
          unoptimized
          priority
        />

        {/* Bright spotlight — moved via DOM, not React state */}
        <div
          ref={spotlightRef}
          className="absolute w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-full pointer-events-none z-[1]"
          style={{
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(177,164,144,0.10) 25%, rgba(177,164,144,0.04) 50%, transparent 70%)',
            opacity: 0,
            transition: 'opacity 0.3s',
            willChange: 'left, top',
          }}
        />

        {/* CSS-powered hover zones — no React state for hover */}
        {sections.map((s, i) => (
          <div
            key={`zone-${s.title}`}
            className={`phi-zone phi-zone-${i}`}
            style={{ top: s.zoneTop }}
            onMouseEnter={() => handleHover(i)}
          >
            <div className="phi-dim" />
            {i < 2 && <div className="phi-line" />}
          </div>
        ))}

        {/* Text — revealed permanently on first hover */}
        {sections.map((s, i) => (
          <div
            key={s.title}
            className={`phi-text phi-text-${i} absolute ${s.position} pointer-events-none flex flex-col justify-center text-left pl-[2%] z-[3] transition-all duration-700 ease-out ${
              revealed[i]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <div
              className={`h-[2px] bg-[#B1A490] mb-[clamp(6px,1vw,14px)] transition-all duration-700 delay-100 ${
                revealed[i] ? 'w-[40px] md:w-[60px]' : 'w-0'
              }`}
            />
            <h3
              className="font-[var(--font-merriweather)] font-bold text-white leading-[1.05] tracking-[1px]"
              style={{ fontSize: 'clamp(24px, 5vw, 72px)' }}
            >
              {s.title}
            </h3>
            <p
              className="font-[var(--font-open-sans)] text-white/70 leading-[1.5] mt-[clamp(6px,1vw,16px)]"
              style={{ fontSize: 'clamp(8px, 1.1vw, 15px)' }}
            >
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
