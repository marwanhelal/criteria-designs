'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, useInView } from 'framer-motion'

interface PhilosophyData {
  heroTitle: string
  heroSubtitle: string
  introText: string
  introImage: string | null
  humanTitle: string
  humanDescription: string
  humanImage: string | null
  envTitle: string
  envDescription: string
  envImage: string | null
  cultureTitle: string
  cultureDescription: string
  cultureImage: string | null
  diagramImage: string | null
}

const DEFAULTS: PhilosophyData = {
  heroTitle: 'Our Philosophy',
  heroSubtitle: 'what we believe in',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment leading to being the most effective element to human efficiency.',
  introImage: null,
  humanTitle: 'HUMAN',
  humanDescription: 'human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'as well as environmental measures such as weather, geography and energy.',
  envImage: null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'and finally cultural values such as social and economic ones.',
  cultureImage: null,
  diagramImage: null,
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease } }),
}

export default function PhilosophyPage() {
  const [data, setData] = useState<PhilosophyData>(DEFAULTS)

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : DEFAULTS)
      .then((d: Partial<PhilosophyData>) => setData({ ...DEFAULTS, ...d }))
      .catch(() => {})
  }, [])

  const sec1Ref = useRef(null)
  const sec2Ref = useRef(null)
  const sec3Ref = useRef(null)
  const sec1In  = useInView(sec1Ref, { once: true, margin: '-60px' })
  const sec2In  = useInView(sec2Ref, { once: true, margin: '-60px' })
  const sec3In  = useInView(sec3Ref, { once: true, margin: '-60px' })

  return (
    <div className="bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — Our Philosophy / Intro + Diagram Image
      ═══════════════════════════════════════════════════ */}
      <section ref={sec1Ref} className="pt-[var(--nav-h)] border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-14 grid md:grid-cols-[1fr_auto] gap-12 items-start">

          {/* Left: text */}
          <div>
            <motion.h1
              variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={0}
              className="font-[var(--font-franklin-gothic)] text-5xl md:text-6xl font-bold text-[#181C23] leading-tight mb-2"
            >
              {data.heroTitle}
            </motion.h1>

            <motion.p
              variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={1}
              className="text-[#4A7A4A] font-[var(--font-open-sans)] text-lg font-semibold italic mb-8"
            >
              {data.heroSubtitle}
            </motion.p>

            <motion.p
              variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={2}
              className="text-[#333] font-[var(--font-open-sans)] text-sm leading-relaxed text-justify max-w-lg"
            >
              {data.introText}
            </motion.p>
          </div>

          {/* Right: uploaded diagram image */}
          {data.introImage && (
            <motion.div
              variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={3}
              className="w-56 flex-shrink-0 pt-2"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={data.introImage}
                  alt="Philosophy diagram"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — Three Foundations
      ═══════════════════════════════════════════════════ */}
      <section ref={sec2Ref} className="bg-[#F2F0EB] border-t-4 border-b-4 border-[#5B8A5B]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-3 divide-x divide-[#D5D0C8]">

            {/* Column 1 — Human */}
            <motion.div
              variants={fadeUp} initial="hidden" animate={sec2In ? 'show' : 'hidden'} custom={0}
              className="flex flex-col items-center text-center px-8"
            >
              {data.humanImage && (
                <div className="mb-6 h-28 flex items-end justify-center">
                  <div className="relative w-24 h-24">
                    <Image src={data.humanImage} alt={data.humanTitle} fill className="object-contain" />
                  </div>
                </div>
              )}
              <h3 className="font-[var(--font-franklin-gothic)] text-xl font-bold text-[#181C23] tracking-wider mb-3">
                {data.humanTitle}
              </h3>
              <p className="text-[#555] text-sm leading-relaxed font-[var(--font-open-sans)]">
                {data.humanDescription}
              </p>
            </motion.div>

            {/* Ampersand + Column 2 — Environmental */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={sec2In ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.25, ease }}
                className="absolute -left-6 top-8 z-10 text-4xl font-light text-[#5B8A5B] select-none leading-none"
              >
                &amp;
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" animate={sec2In ? 'show' : 'hidden'} custom={1}
                className="flex flex-col items-center text-center px-8"
              >
                {data.envImage && (
                  <div className="mb-6 h-28 flex items-end justify-center">
                    <div className="relative w-24 h-24">
                      <Image src={data.envImage} alt={data.envTitle} fill className="object-contain" />
                    </div>
                  </div>
                )}
                <h3 className="font-[var(--font-franklin-gothic)] text-xl font-bold text-[#181C23] tracking-wider mb-3">
                  {data.envTitle}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed font-[var(--font-open-sans)]">
                  {data.envDescription}
                </p>
              </motion.div>
            </div>

            {/* Ampersand + Column 3 — Culture */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={sec2In ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.45, ease }}
                className="absolute -left-6 top-8 z-10 text-4xl font-light text-[#5B8A5B] select-none leading-none"
              >
                &amp;
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" animate={sec2In ? 'show' : 'hidden'} custom={2}
                className="flex flex-col items-center text-center px-8"
              >
                {data.cultureImage && (
                  <div className="mb-6 h-28 flex items-end justify-center">
                    <div className="relative w-24 h-24">
                      <Image src={data.cultureImage} alt={data.cultureTitle} fill className="object-contain" />
                    </div>
                  </div>
                )}
                <h3 className="font-[var(--font-franklin-gothic)] text-xl font-bold text-[#181C23] tracking-wider mb-3">
                  {data.cultureTitle}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed font-[var(--font-open-sans)]">
                  {data.cultureDescription}
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — Design Flow Diagram Image
      ═══════════════════════════════════════════════════ */}
      {data.diagramImage && (
        <section ref={sec3Ref} className="border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sec3In ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
              className="relative w-full"
            >
              <Image
                src={data.diagramImage}
                alt="Design flow diagram"
                width={900}
                height={400}
                className="w-full h-auto object-contain"
              />
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
