'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const sections = [
  {
    title: 'CULTURE',
    description:
      'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
    // Positioned over the dark center panel in the top third
    position: 'top-[4%] left-[30%] w-[35%] h-[30%]',
  },
  {
    title: 'NATURE',
    description:
      'Engineering sustainable, eco-conscious exteriors that harmonize with and protect the natural environment.',
    // Positioned over the dark area in the middle third
    position: 'top-[36%] left-[28%] w-[35%] h-[30%]',
  },
  {
    title: 'ART',
    description:
      'Crafting architectural expressions that transform structures into timeless works of art.',
    // Positioned over the dark area in the bottom third
    position: 'top-[70%] left-[28%] w-[35%] h-[28%]',
  },
]

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [cultureLit, setCultureLit] = useState(false)
  const [natureLit, setNatureLit] = useState(false)
  const [artLit, setArtLit] = useState(false)
  const [iconLit, setIconLit] = useState(false)

  const litStates = [cultureLit, natureLit, artLit]

  const cultureRef = useRef<HTMLDivElement>(null)
  const natureRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const sectionRefs = [cultureRef, natureRef, artRef]

  // Intersection observers — once triggered, stay lit forever
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

  // Once all 3 are lit, light up the icon
  useEffect(() => {
    if (cultureLit && natureLit && artLit) {
      const timer = setTimeout(() => setIconLit(true), 500)
      return () => clearTimeout(timer)
    }
  }, [cultureLit, natureLit, artLit])

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
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="font-[var(--font-libre-franklin)] text-[13px] md:text-[14px] text-[#B1A490] uppercase tracking-[3px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.15] mt-4">
            Our Philosophy
          </h2>
        </div>

        {/* Labels that light up */}
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

      {/* Image with text overlays */}
      <div className="relative w-full">
        {/* Background image */}
        <Image
          src={philosophyImage}
          alt="Our Philosophy"
          width={1920}
          height={1080}
          className="w-full h-auto block"
          unoptimized
          priority
        />

        {/* Dark overlays that fade when lit + text that fades in */}
        {sections.map((s, i) => (
          <div key={s.title}>
            {/* Dark cover overlay */}
            <div
              ref={sectionRefs[i]}
              className={`absolute ${s.position} pointer-events-none transition-opacity duration-[1500ms] ease-out ${
                litStates[i] ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="w-full h-full bg-[#0D0F13]/80" />
            </div>

            {/* Text overlay — fades in when lit */}
            <div
              className={`absolute ${s.position} pointer-events-none flex flex-col items-center justify-center text-center px-[4%] transition-all duration-[1200ms] ease-out ${
                litStates[i]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: litStates[i] ? '300ms' : '0ms' }}
            >
              <h3 className="font-[var(--font-merriweather)] text-[clamp(20px,4vw,64px)] font-normal text-white/90 leading-[1.1] tracking-[2px]">
                {s.title}
              </h3>
              <p className="font-[var(--font-open-sans)] text-[clamp(8px,1.3vw,18px)] text-white/60 leading-[1.6] mt-[clamp(6px,1.2vw,20px)] max-w-[90%]">
                {s.description}
              </p>
            </div>
          </div>
        ))}

        {/* Left icon glow — after all 3 are lit */}
        <div
          className={`absolute top-[3%] left-[1%] w-[120px] h-[120px] md:w-[180px] md:h-[180px] pointer-events-none transition-all duration-[2000ms] ease-out ${
            iconLit ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="w-full h-full rounded-full bg-[#B1A490]/35 blur-3xl" />
        </div>

        {/* Icon ring glow */}
        <div
          className={`absolute top-[5%] left-[2.5%] w-[60px] h-[60px] md:w-[90px] md:h-[90px] pointer-events-none transition-all duration-[2000ms] delay-300 ease-out ${
            iconLit ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-full h-full rounded-full border border-[#B1A490]/40 shadow-[0_0_30px_8px_rgba(177,164,144,0.3)]" />
        </div>
      </div>
    </section>
  )
}
