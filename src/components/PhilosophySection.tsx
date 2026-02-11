'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const sections = [
  {
    title: 'CULTURE',
    description:
      'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
    // Center dark panel, top third
    position: 'top-[2%] left-[32%] w-[32%] h-[32%]',
  },
  {
    title: 'NATURE',
    description:
      'Engineering sustainable, eco-conscious exteriors that harmonize with and protect the natural environment.',
    // Center dark panel, middle third
    position: 'top-[35%] left-[32%] w-[32%] h-[32%]',
  },
  {
    title: 'ART',
    description:
      'Sculpting functional masterpieces that blend structural precision with visionary aesthetic expression.',
    // Center dark panel, bottom third
    position: 'top-[68%] left-[32%] w-[32%] h-[30%]',
  },
]

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [cultureLit, setCultureLit] = useState(false)
  const [natureLit, setNatureLit] = useState(false)
  const [artLit, setArtLit] = useState(false)
  const [logoLit, setLogoLit] = useState(false)

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

  // Once all 3 are lit, light up the logo
  useEffect(() => {
    if (cultureLit && natureLit && artLit) {
      const timer = setTimeout(() => setLogoLit(true), 500)
      return () => clearTimeout(timer)
    }
  }, [cultureLit, natureLit, artLit])

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.philosophyImage) setPhilosophyImage(data.philosophyImage)
        if (data?.logo) setLogo(data.logo)
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

        {/* Text overlays for each section */}
        {sections.map((s, i) => (
          <div key={s.title}>
            {/* Trigger element for intersection observer */}
            <div
              ref={sectionRefs[i]}
              className={`absolute ${s.position} pointer-events-none`}
            />

            {/* Text — fades in + slides up when lit, stays forever */}
            <div
              className={`absolute ${s.position} pointer-events-none flex flex-col items-center justify-center text-center px-[3%] transition-all duration-[1200ms] ease-out ${
                litStates[i]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: litStates[i] ? '200ms' : '0ms' }}
            >
              <h3 className="font-[var(--font-merriweather)] text-[clamp(18px,3.8vw,60px)] font-normal text-white leading-[1.1] tracking-[2px]">
                {s.title}
              </h3>
              <p className="font-[var(--font-open-sans)] text-[clamp(7px,1.2vw,16px)] text-white/60 leading-[1.6] mt-[clamp(6px,1vw,18px)] max-w-[95%]">
                {s.description}
              </p>
            </div>
          </div>
        ))}

        {/* Criteria Designs logo on the left dark area */}
        {logo && (
          <div
            className={`absolute top-[30%] left-[3%] w-[22%] pointer-events-none flex flex-col items-center gap-[clamp(4px,0.8vw,12px)] transition-all duration-[2000ms] ease-out ${
              logoLit ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            {/* Logo glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-[60%] h-[60%] rounded-full bg-[#B1A490]/20 blur-3xl transition-opacity duration-[2000ms] ${
                  logoLit ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            {/* Logo image */}
            <Image
              src={logo}
              alt="Criteria Designs"
              width={160}
              height={160}
              className="relative w-[clamp(40px,8vw,130px)] h-auto object-contain drop-shadow-[0_4px_20px_rgba(177,164,144,0.4)]"
              unoptimized
            />
            {/* Brand text under logo */}
            <div className="relative text-center">
              <span className="font-[var(--font-merriweather)] text-[clamp(10px,1.8vw,26px)] text-white/80 leading-[1.1] block">
                Criteria
              </span>
              <span className="font-[var(--font-libre-franklin)] text-[clamp(6px,0.8vw,12px)] text-white/40 uppercase tracking-[3px] block mt-[2px]">
                Designs
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
