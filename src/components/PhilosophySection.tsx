'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)
  const [cultureLit, setCultureLit] = useState(false)
  const [natureLit, setNatureLit] = useState(false)
  const [artLit, setArtLit] = useState(false)
  const [iconLit, setIconLit] = useState(false)

  const cultureRef = useRef<HTMLDivElement>(null)
  const natureRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)

  // Intersection observers — once triggered, stay lit forever
  useEffect(() => {
    const options = { threshold: 0.3 }

    const cultureObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCultureLit(true)
        cultureObs.disconnect()
      }
    }, options)

    const natureObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNatureLit(true)
        natureObs.disconnect()
      }
    }, options)

    const artObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setArtLit(true)
        artObs.disconnect()
      }
    }, options)

    if (cultureRef.current) cultureObs.observe(cultureRef.current)
    if (natureRef.current) natureObs.observe(natureRef.current)
    if (artRef.current) artObs.observe(artRef.current)

    return () => {
      cultureObs.disconnect()
      natureObs.disconnect()
      artObs.disconnect()
    }
  }, [philosophyImage])

  // Once all 3 are lit, light up the icon after a short delay
  useEffect(() => {
    if (cultureLit && natureLit && artLit) {
      const timer = setTimeout(() => setIconLit(true), 400)
      return () => clearTimeout(timer)
    }
  }, [cultureLit, natureLit, artLit])

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
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
          {[
            { label: 'Culture', lit: cultureLit },
            { label: 'Nature', lit: natureLit },
            { label: 'Art', lit: artLit },
          ].map(({ label, lit }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <span
                className={`font-[var(--font-libre-franklin)] text-[11px] md:text-[13px] uppercase tracking-[3px] md:tracking-[4px] transition-all duration-1000 ${
                  lit ? 'text-[#B1A490]' : 'text-white/15'
                }`}
              >
                {label}
              </span>
              <span
                className={`block h-[2px] rounded-full transition-all duration-1000 ${
                  lit ? 'w-8 bg-[#B1A490]' : 'w-0 bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image container */}
      <div className="relative w-full">
        <Image
          src={philosophyImage}
          alt="Our Philosophy - Culture, Nature, Art"
          width={1920}
          height={1080}
          className="w-full h-auto block"
          unoptimized
          priority
        />

        {/* Culture dark overlay (top ~33%) — fades away when lit */}
        <div
          ref={cultureRef}
          className={`absolute top-0 left-0 w-full h-[34%] pointer-events-none transition-opacity duration-[1500ms] ease-out ${
            cultureLit ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ background: 'linear-gradient(to bottom, #0D0F13 70%, transparent)' }}
        />

        {/* Nature dark overlay (middle ~33%) */}
        <div
          ref={natureRef}
          className={`absolute top-[32%] left-0 w-full h-[36%] pointer-events-none transition-opacity duration-[1500ms] ease-out ${
            natureLit ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ background: 'linear-gradient(to bottom, transparent, #0D0F13 15%, #0D0F13 85%, transparent)' }}
        />

        {/* Art dark overlay (bottom ~33%) */}
        <div
          ref={artRef}
          className={`absolute top-[66%] left-0 w-full h-[34%] pointer-events-none transition-opacity duration-[1500ms] ease-out ${
            artLit ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ background: 'linear-gradient(to bottom, transparent, #0D0F13 30%)' }}
        />

        {/* Golden glow flash when Culture lights up */}
        <div
          className={`absolute top-0 left-0 w-full h-[34%] pointer-events-none transition-opacity duration-[2000ms] ${
            cultureLit ? 'opacity-0' : 'opacity-0'
          }`}
        >
          <div
            className={`absolute inset-0 bg-[#B1A490]/10 transition-opacity duration-500 ${
              cultureLit ? 'animate-[flash_1s_ease-out]' : 'opacity-0'
            }`}
          />
        </div>

        {/* Left icon glow — lights up after all 3 sections are revealed */}
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
