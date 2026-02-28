'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Client {
  id: string
  nameEn: string
  logo?: string | null
  bgColor?: string | null
}

const CARD_W = 151

function Row({ clients, direction }: { clients: Client[]; direction: 'ltr' | 'rtl' }) {
  const [paused, setPaused] = useState(false)
  const minItems = Math.ceil(5760 / (clients.length * CARD_W)) + 1
  const repeats = Math.max(10, minItems)
  const items = Array(repeats).fill(clients).flat() as Client[]
  const pct = (1 / repeats) * 100
  const duration = Math.max(35, clients.length * 8)

  return (
    <div
      className="relative overflow-hidden border-b border-[#181C23]/[0.06]"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @keyframes scroll-rtl-${clients.length} {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${pct.toFixed(4)}%); }
        }
        @keyframes scroll-ltr-${clients.length} {
          0%   { transform: translateX(-${pct.toFixed(4)}%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div
        className="flex items-center w-max"
        style={{
          gap: '1px',
          animation: `scroll-${direction === 'rtl' ? 'rtl' : 'ltr'}-${clients.length} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {items.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="relative w-[150px] h-[130px] shrink-0 flex items-center justify-center p-5 bg-[#FAFAF8] hover:bg-white border-r border-[#181C23]/[0.06] transition-colors duration-300 cursor-default group overflow-hidden"
          >
            {client.logo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.nameEn}
                  className="max-w-[110px] max-h-[64px] w-auto h-auto object-contain group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300"
                />
                {/* Name fades in at bottom on hover */}
                <span className="absolute bottom-[10px] left-0 right-0 text-center font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[2px] text-[#9A9A94] opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 truncate">
                  {client.nameEn}
                </span>
              </>
            ) : (
              <span className="font-[var(--font-open-sans)] text-[11px] font-semibold text-[#181C23]/40 group-hover:text-[#181C23]/70 text-center leading-tight uppercase tracking-wider px-1 transition-colors duration-300">
                {client.nameEn}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ClientsMarquee({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null

  const row1 = clients.filter((_, i) => i % 2 === 0)
  const row2 = clients.filter((_, i) => i % 2 === 1)
  const r1 = row1.length > 0 ? row1 : clients
  const r2 = row2.length > 0 ? row2 : clients

  return (
    <section className="bg-[#FAFAF8] overflow-hidden border-t border-b border-[#181C23]/[0.07]">

      {/* Editorial header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="px-8 lg:px-16 pt-12 pb-10 border-b border-[#181C23]/[0.07]"
      >
        {/* Label */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-8 h-px bg-[#B1A490]" />
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#181C23]/40 uppercase tracking-[5px]">
            Our Clients
          </span>
        </div>

        {/* Statement + stat chips */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <h2 className="font-[var(--font-playfair)] text-[28px] md:text-[36px] lg:text-[42px] text-[#181C23] leading-[1.15] max-w-[440px]">
            The names that<br />trusted our vision.
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-baseline gap-[6px] font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[2px] text-[#9A9A94] border border-[#E0E0DC] rounded-full px-4 py-[7px]">
              <span className="font-[var(--font-playfair)] text-[20px] text-[#181C23] leading-none">{clients.length}</span>
              Partners
            </span>
            <span className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[2px] text-[#9A9A94] border border-[#E0E0DC] rounded-full px-4 py-[7px]">
              International
            </span>
            <span className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[2px] text-[#9A9A94] border border-[#E0E0DC] rounded-full px-4 py-[7px]">
              Since 2018
            </span>
          </div>
        </div>
      </motion.div>

      {/* Two scrolling rows */}
      <Row clients={r1} direction="ltr" />
      <Row clients={r2} direction="rtl" />

    </section>
  )
}
