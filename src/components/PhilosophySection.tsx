'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function PhilosophySection() {
  const [philosophyImage, setPhilosophyImage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.philosophyImage) setPhilosophyImage(data.philosophyImage)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-[#181C23] py-[100px] md:py-[140px] px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[3px]">
            What drives us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[36px] md:text-[48px] lg:text-[56px] text-white leading-[1.15] mt-4">
            Our Philosophy
          </h2>
        </motion.div>

        {/* Philosophy Image */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          className="group relative rounded-[12px] overflow-hidden"
        >
          {philosophyImage ? (
            <Image
              src={philosophyImage}
              alt="Our Philosophy - Culture, Nature, Art"
              width={1400}
              height={800}
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              unoptimized
            />
          ) : (
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#2C3E2D]/40 via-[#4A7C59]/20 to-[#1E222B] flex items-center justify-center">
              <p className="font-[var(--font-open-sans)] text-[16px] text-white/30">
                Upload philosophy image in Settings
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
