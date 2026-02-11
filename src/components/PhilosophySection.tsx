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
  const [cultureLit, setCultureLit] = useState(false)
  const [natureLit, setNatureLit] = useState(false)
  const [artLit, setArtLit] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isMouseInside, setIsMouseInside] = useState(false)

  const litStates = [cultureLit, natureLit, artLit]

  const cultureRef = useRef<HTMLDivElement>(null)
  const natureRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = [cultureRef, natureRef, artRef]

  // Intersection observers for light-up
  useEffect(() => {
    const setters = [setCultureLit, setNatureLit, setArtLit]
    const observers: IntersectionObserver[] = []

    sectionRefs.forEach((ref, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setters[i](true)
            obs.disconnect()
          }
        },
        { threshold: 0.3 }
      )
      if (ref.current) obs.observe(ref.current)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [philosophyImage])

  // Mouse tracking for spotlight
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })

    // Detect which third the mouse is in
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

        {/* Labels — highlight on hover too */}
        <div className="flex justify-center gap-8 md:gap-14 mb-8 md:mb-12">
          {sections.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center gap-1.5">
              <span
                className={`font-[var(--font-libre-franklin)] text-[11px] md:text-[13px] uppercase tracking-[3px] md:tracking-[4px] transition-all duration-500 ${
                  hoveredSection === i
                    ? 'text-white scale-110'
                    : litStates[i]
                      ? 'text-[#B1A490]'
                      : 'text-white/15'
                }`}
              >
                {s.title}
              </span>
              <span
                className={`block h-[2px] rounded-full transition-all duration-500 ${
                  hoveredSection === i
                    ? 'w-10 bg-white'
                    : litStates[i]
                      ? 'w-8 bg-[#B1A490]'
                      : 'w-0 bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image with interactive overlays */}
      <div
        ref={imageContainerRef}
        className="relative w-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsMouseInside(true)}
        onMouseLeave={() => {
          setIsMouseInside(false)
          setHoveredSection(null)
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

        {/* Cursor-following spotlight glow */}
        <div
          className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(177,164,144,0.12) 0%, rgba(177,164,144,0.04) 40%, transparent 70%)',
            opacity: isMouseInside ? 1 : 0,
          }}
        />

        {/* Three interactive hover zones */}
        {sections.map((s, i) => {
          const topPercent = i === 0 ? '0%' : i === 1 ? '33.33%' : '66.66%'
          return (
            <div
              key={`zone-${s.title}`}
              className="absolute left-0 w-full h-[33.34%] pointer-events-none"
              style={{ top: topPercent }}
            >
              {/* Dim overlay on non-hovered sections */}
              <div
                className="absolute inset-0 bg-black/30 transition-opacity duration-500 pointer-events-none"
                style={{
                  opacity:
                    isMouseInside && hoveredSection !== null && hoveredSection !== i
                      ? 1
                      : 0,
                }}
              />
              {/* Bright border line at bottom of hovered section */}
              {i < 2 && (
                <div
                  className="absolute bottom-0 left-[5%] w-[90%] h-[1px] transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(177,164,144,0.4), transparent)',
                    opacity: isMouseInside && hoveredSection === i ? 1 : 0,
                  }}
                />
              )}
            </div>
          )
        })}

        {/* Text overlays */}
        {sections.map((s, i) => (
          <div key={s.title}>
            <div
              ref={sectionRefs[i]}
              className={`absolute ${s.position} pointer-events-none`}
            />

            <div
              className={`absolute ${s.position} pointer-events-none flex flex-col justify-center text-left pl-[2%] transition-all ease-out ${
                litStates[i]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionDuration: litStates[i] ? '1200ms' : '300ms',
                transitionDelay: litStates[i] ? '200ms' : '0ms',
              }}
            >
              <h3
                className={`font-[var(--font-merriweather)] font-bold leading-[1.05] tracking-[1px] transition-all duration-500 ${
                  hoveredSection === i
                    ? 'text-[#B1A490] translate-x-2'
                    : 'text-white translate-x-0'
                }`}
                style={{ fontSize: 'clamp(24px, 5vw, 72px)' }}
              >
                {s.title}
              </h3>
              <p
                className={`font-[var(--font-open-sans)] leading-[1.5] mt-[clamp(6px,1vw,16px)] transition-all duration-500 ${
                  hoveredSection === i
                    ? 'text-white/90 translate-x-2'
                    : 'text-white/70 translate-x-0'
                }`}
                style={{ fontSize: 'clamp(8px, 1.1vw, 15px)' }}
              >
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
