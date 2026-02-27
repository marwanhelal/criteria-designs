'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

interface Award {
  id: string
  titleEn: string
  titleAr: string
  year: number
  subtitleEn: string | null
  subtitleAr: string | null
  image: string | null
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/awards?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setAwards(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Group awards by year
  const grouped = awards.reduce<Record<number, Award[]>>((acc, award) => {
    if (!acc[award.year]) acc[award.year] = []
    acc[award.year].push(award)
    return acc
  }, {})
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-[#181C23] pt-[140px] pb-20 px-8 lg:px-16">
        <div className="max-w-[1290px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px] mb-4">
              Our Recognition
            </p>
            <h1 className="font-[var(--font-merriweather)] text-[42px] md:text-[56px] lg:text-[72px] text-white leading-[1.05] tracking-[-0.02em]">
              Awards
            </h1>
            <div className="w-16 h-px bg-[#B1A490] mt-6" />
          </motion.div>
        </div>
      </section>

      {/* Awards List */}
      <section data-navbar-dark className="bg-[#F5F0EB] py-20 lg:py-28 px-8 lg:px-16">
        <div className="max-w-[1290px] mx-auto">
          {loading ? (
            <div className="text-center py-20 text-[#181C23]/40">Loading awards...</div>
          ) : awards.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#181C23]/40 font-[var(--font-open-sans)]">No awards to display yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {years.map((year, yi) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: yi * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  {/* Year header */}
                  <div className="flex items-center gap-6 mb-8">
                    <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-none">
                      {year}
                    </h2>
                    <div className="flex-1 h-px bg-[#181C23]/10" />
                  </div>

                  {/* Awards grid for this year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grouped[year].map((award, ai) => (
                      <motion.div
                        key={award.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: ai * 0.08 }}
                        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        {award.image && (
                          <div className="relative w-full h-[200px]">
                            <Image
                              src={award.image}
                              alt={award.titleEn}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="font-[var(--font-merriweather)] text-[18px] text-[#181C23] font-bold leading-[1.3]">
                            {award.titleEn}
                          </h3>
                          {award.subtitleEn && (
                            <p className="font-[var(--font-open-sans)] text-[14px] text-[#181C23]/50 mt-1">
                              {award.subtitleEn}
                            </p>
                          )}
                          <div className="w-8 h-px bg-[#B1A490] mt-4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
