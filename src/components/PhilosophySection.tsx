'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const sections = [
  {
    title: 'CULTURE',
    description:
      'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
    position: 'top-[3%] left-[2%] w-[30%] h-[30%]',
  },
  {
    title: 'NATURE',
    description:
      'Engineering sustainable, eco-conscious exteriors that harmonize with and protect the natural environment.',
    position: 'top-[36%] left-[2%] w-[30%] h-[30%]',
  },
  {
    title: 'ART',
    description:
      'Sculpting functional masterpieces that blend structural precision with visionary aesthetic expression.',
    position: 'top-[69%] left-[2%] w-[30%] h-[28%]',
  },
]

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isMouseInside, setIsMouseInside] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })

    const yPercent = (e.clientY - rect.top) / rect.height
    if (yPercent < 0.33) setHoveredSection(0)
    else if (yPercent < 0.66) setHoveredSection(1)
    else setHoveredSection(2)
  }, [])

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.philosophyImage) setPhilosophyImage(data.philosophyImage)
      })
      .catch(() => {})
  }, [])

  if (!philosophyImage) return null

  // Subtle 3D tilt based on mouse position
  const tiltX = isMouseInside ? (mousePos.y - 50) * 0.04 : 0
  const tiltY = isMouseInside ? (mousePos.x - 50) * -0.04 : 0

  return (
    <section className="bg-[#0D0F13] pt-[80px] md:pt-[120px] pb-0 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-20">
          <span className="font-[var(--font-libre-franklin)] text-[13px] md:text-[14px] text-[#B1A490] uppercase tracking-[3px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.15] mt-4">
            Our Philosophy
          </h2>
        </div>

        {/* Labels — react to hover */}
        <div className="flex justify-center gap-8 md:gap-14 mb-8 md:mb-12">
          {sections.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center gap-1.5">
              <span
                className={`font-[var(--font-libre-franklin)] text-[11px] md:text-[13px] uppercase tracking-[3px] md:tracking-[4px] transition-all duration-500 ${
                  hoveredSection === i
                    ? 'text-white scale-110'
                    : 'text-white/20'
                }`}
              >
                {s.title}
              </span>
              <span
                className={`block h-[2px] rounded-full transition-all duration-500 ${
                  hoveredSection === i
                    ? 'w-10 bg-[#B1A490]'
                    : 'w-0 bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Hint text */}
        <p
          className={`text-center font-[var(--font-open-sans)] text-[12px] text-white/25 mb-4 transition-opacity duration-700 ${
            isMouseInside ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Hover to explore
        </p>
      </div>

      {/* Image with interactions */}
      <div
        ref={imageContainerRef}
        className="relative w-full cursor-none overflow-hidden"
        style={{ perspective: '1200px' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsMouseInside(true)}
        onMouseLeave={() => {
          setIsMouseInside(false)
          setHoveredSection(null)
        }}
      >
        {/* 3D tilt wrapper */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          }}
        >
          <Image
            src={philosophyImage}
            alt="Our Philosophy"
            width={1920}
            height={1080}
            className="w-full h-auto block"
            unoptimized
            priority
          />

          {/* Custom cursor dot */}
          <div
            className="absolute w-3 h-3 rounded-full border-2 border-[#B1A490] pointer-events-none transition-all duration-100 z-20"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: isMouseInside ? 1 : 0,
            }}
          />

          {/* Custom cursor outer ring */}
          <div
            className="absolute w-10 h-10 rounded-full border border-[#B1A490]/30 pointer-events-none transition-all duration-300 z-20"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              transform: `translate(-50%, -50%) scale(${hoveredSection !== null ? 1.5 : 1})`,
              opacity: isMouseInside ? 1 : 0,
            }}
          />

          {/* Spotlight glow */}
          <div
            className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none transition-opacity duration-300 z-10"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(circle, rgba(177,164,144,0.10) 0%, rgba(177,164,144,0.03) 40%, transparent 65%)',
              opacity: isMouseInside ? 1 : 0,
            }}
          />

          {/* Section hover zones + dim/highlight */}
          {sections.map((s, i) => {
            const topPercent = i === 0 ? '0%' : i === 1 ? '33.33%' : '66.66%'
            return (
              <div
                key={`zone-${s.title}`}
                className="absolute left-0 w-full h-[33.34%] pointer-events-none"
                style={{ top: topPercent }}
              >
                {/* Dim non-hovered */}
                <div
                  className="absolute inset-0 bg-black/40 transition-opacity duration-500"
                  style={{
                    opacity:
                      isMouseInside && hoveredSection !== null && hoveredSection !== i
                        ? 1
                        : 0,
                  }}
                />
                {/* Gold separator line */}
                {i < 2 && (
                  <div
                    className="absolute bottom-0 left-[5%] w-[90%] h-[1px] transition-opacity duration-500"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(177,164,144,0.5), transparent)',
                      opacity: isMouseInside && hoveredSection === i ? 1 : 0,
                    }}
                  />
                )}
              </div>
            )
          })}

          {/* Text — ONLY visible on hover */}
          {sections.map((s, i) => (
            <div
              key={s.title}
              className={`absolute ${s.position} pointer-events-none flex flex-col justify-center text-left pl-[2%] z-10 transition-all duration-500 ease-out ${
                hoveredSection === i
                  ? 'opacity-100 translate-y-0 translate-x-0'
                  : 'opacity-0 translate-y-4 -translate-x-2'
              }`}
            >
              {/* Gold accent line before title */}
              <div
                className={`h-[2px] bg-[#B1A490] mb-[clamp(6px,1vw,14px)] transition-all duration-500 ${
                  hoveredSection === i ? 'w-[40px] md:w-[60px]' : 'w-0'
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

          {/* Side progress indicator */}
          <div
            className={`absolute right-[2%] top-[10%] h-[80%] w-[2px] pointer-events-none transition-opacity duration-500 ${
              isMouseInside ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full h-full bg-white/10 rounded-full">
              {/* Active indicator dot */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#B1A490] transition-all duration-500 shadow-[0_0_10px_rgba(177,164,144,0.6)]"
                style={{
                  top:
                    hoveredSection === 0
                      ? '15%'
                      : hoveredSection === 1
                        ? '48%'
                        : hoveredSection === 2
                          ? '82%'
                          : '48%',
                }}
              />
              {/* Track marks */}
              {[15, 48, 82].map((pos) => (
                <div
                  key={pos}
                  className="absolute left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-white/20"
                  style={{ top: `${pos}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
