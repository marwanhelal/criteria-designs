'use client'

import { useState } from 'react'

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
            className="w-[150px] h-[130px] shrink-0 flex items-center justify-center p-5 bg-[#FAFAF8] hover:bg-white border-r border-[#181C23]/[0.06] transition-colors duration-300 cursor-default group"
          >
            {client.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logo}
                alt={client.nameEn}
                className="max-w-[110px] max-h-[72px] w-auto h-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
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

      {/* Header row */}
      <div className="px-8 lg:px-16 py-7 flex items-center justify-between gap-6 border-b border-[#181C23]/[0.07]">
        <div className="flex items-center gap-5">
          <div className="w-8 h-px bg-[#B1A490]" />
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#181C23]/40 uppercase tracking-[5px]">
            Our Clients
          </span>
        </div>
        <div className="hidden md:flex items-baseline gap-2">
          <span className="font-[var(--font-playfair)] text-[24px] text-[#181C23]">
            {clients.length}
          </span>
          <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#9A9A94] uppercase tracking-[3px]">
            Trusted Partners
          </span>
        </div>
      </div>

      {/* Intro line */}
      <div className="px-8 lg:px-16 py-4 border-b border-[#181C23]/[0.07]">
        <p className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#9A9A94] tracking-[0.03em]">
          Trusted by industry leaders across architecture, real estate, and urban development.
        </p>
      </div>

      {/* Two scrolling rows */}
      <Row clients={r1} direction="ltr" />
      <Row clients={r2} direction="rtl" />

    </section>
  )
}
