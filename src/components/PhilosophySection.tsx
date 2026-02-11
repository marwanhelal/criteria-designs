'use client'

import { useState, useEffect, useRef } from 'react'
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
  const zoneRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  // Reveal on hover — once revealed, stays forever
  const handleHover = (index: number) => {
    setRevealed((prev) => {
      if (prev[index]) return prev
      const next = [...prev]
      next[index] = true
      return next
    })
  }

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

        {/* Labels */}
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

        {/* Hint */}
        <p
          className={`text-center font-[var(--font-open-sans)] text-[12px] text-white/25 mb-4 transition-opacity duration-700 ${
            revealed[0] ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Hover to explore
        </p>
      </div>

      {/* Image */}
      <div className="relative w-full">
        <Image
          src={philosophyImage}
          alt="Our Philosophy"
          width={1920}
          height={1080}
          className="w-full h-auto block"
          unoptimized
          priority
        />

        {/* Hover zones + text */}
        {sections.map((s, i) => (
          <div key={s.title}>
            {/* Invisible hover trigger zone */}
            <div
              ref={zoneRefs[i]}
              className="absolute left-0 w-full h-[33.34%]"
              style={{ top: s.zoneTop }}
              onMouseEnter={() => handleHover(i)}
            />

            {/* Text — appears on first hover, stays forever */}
            <div
              className={`absolute ${s.position} pointer-events-none flex flex-col justify-center text-left pl-[2%] transition-all duration-700 ease-out ${
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
          </div>
        ))}
      </div>
    </section>
  )
}
