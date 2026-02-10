'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const philosophyItems = [
  {
    title: 'CULTURE',
    description: 'Designing spaces that honor local heritage and foster human connection within the urban fabric.',
    image: '/api/uploads/philosophy-culture.jpg',
    fallbackGradient: 'from-[#8B7355]/30 via-[#6B8E5A]/20 to-[#2C3E2D]/40',
  },
  {
    title: 'NATURE',
    description: 'Engineering sustainable, eco-conscious exteriors that harmonize with and protect the natural environment.',
    image: '/api/uploads/philosophy-nature.jpg',
    fallbackGradient: 'from-[#4A7C59]/30 via-[#6B8E5A]/20 to-[#2C3E2D]/40',
  },
  {
    title: 'ART',
    description: 'Sculpting functional masterpieces that blend structural precision with visionary aesthetic expression.',
    image: '/api/uploads/philosophy-art.jpg',
    fallbackGradient: 'from-[#8B8B8B]/30 via-[#6B6B6B]/20 to-[#2C2C2C]/40',
  },
]

export default function PhilosophySection() {
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

        {/* Philosophy Cards */}
        <div className="flex flex-col gap-6 md:gap-8">
          {philosophyItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.9,
                delay: index * 0.15,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="group relative grid grid-cols-1 lg:grid-cols-2 min-h-[300px] md:min-h-[380px] rounded-[12px] overflow-hidden cursor-pointer"
            >
              {/* Text Panel */}
              <div className="relative z-10 bg-[#1E222B] p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1 group-hover:bg-[#232830] transition-colors duration-500">
                {/* Decorative line */}
                <motion.div
                  className="w-[40px] h-[2px] bg-[#B1A490] mb-8 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                />

                <h3 className="font-[var(--font-merriweather)] text-[48px] md:text-[64px] lg:text-[80px] text-white leading-[1] tracking-[2px] group-hover:tracking-[6px] transition-all duration-700">
                  {item.title}
                </h3>

                <p className="font-[var(--font-open-sans)] text-[16px] md:text-[18px] text-white/60 leading-[1.7] mt-6 max-w-[420px] group-hover:text-white/80 transition-colors duration-500">
                  {item.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-8 flex items-center gap-3 opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <span className="font-[var(--font-libre-franklin)] text-[13px] text-[#B1A490] uppercase tracking-[2px]">
                    Discover more
                  </span>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-[#B1A490]">
                    <path d="M14 1L19 6M19 6L14 11M19 6H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Image Panel */}
              <div className="relative h-[250px] md:h-[300px] lg:h-auto order-1 lg:order-2 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  unoptimized
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E222B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block" />
                {/* Fallback gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.fallbackGradient} -z-10`} />
              </div>

              {/* Bottom edge glow on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B1A490] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
