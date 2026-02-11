'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const sections = [
  {
    title: 'CULTURE',
    description:
      'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
    // Left side of top third
    position: 'top-[3%] left-[2%] w-[30%] h-[30%]',
  },
  {
    title: 'NATURE',
    description:
      'Engineering sustainable, eco-conscious exteriors that harmonize with and protect the natural environment.',
    // Left side of middle third
    position: 'top-[36%] left-[2%] w-[30%] h-[30%]',
  },
  {
    title: 'ART',
    description:
      'Sculpting functional masterpieces that blend structural precision with visionary aesthetic expression.',
    // Left side of bottom third
    position: 'top-[69%] left-[2%] w-[30%] h-[28%]',
  },
]

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [cultureLit, setCultureLit] = useState(false)
  const [natureLit, setNatureLit] = useState(false)
  const [artLit, setArtLit] = useState(false)

  const litStates = [cultureLit, natureLit, artLit]

  const cultureRef = useRef<HTMLDivElement>(null)
  const natureRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const sectionRefs = [cultureRef, natureRef, artRef]

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

        <div className="flex justify-center gap-8 md:gap-14 mb-8 md:mb-12">
          {sections.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center gap-1.5">
              <span
                className={`font-[var(--font-libre-franklin)] text-[11px] md:text-[13px] uppercase tracking-[3px] md:tracking-[4px] transition-all duration-1000 ${
                  litStates[i] ? 'text-[#B1A490]' : 'text-white/15'
                }`}
              >
                {s.title}
              </span>
              <span
                className={`block h-[2px] rounded-full transition-all duration-1000 ${
                  litStates[i] ? 'w-8 bg-[#B1A490]' : 'w-0 bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

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

        {/* Text overlays — left-aligned, no backdrop, on dark areas */}
        {sections.map((s, i) => (
          <div key={s.title}>
            <div
              ref={sectionRefs[i]}
              className={`absolute ${s.position} pointer-events-none`}
            />

            <div
              className={`absolute ${s.position} pointer-events-none flex flex-col justify-center text-left pl-[2%] transition-all duration-[1200ms] ease-out ${
                litStates[i]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: litStates[i] ? '200ms' : '0ms' }}
            >
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
