'use client'

interface Client {
  id: string
  nameEn: string
  logo?: string | null
  bgColor?: string | null
}

// Each card is 150px + 1px gap = 151px per item
const CARD_W = 151

function Row({ clients, direction }: { clients: Client[]; direction: 'ltr' | 'rtl' }) {
  const minItems = Math.ceil(5760 / (clients.length * CARD_W)) + 1
  const repeats = Math.max(10, minItems)
  const items = Array(repeats).fill(clients).flat() as Client[]
  const pct = (1 / repeats) * 100
  const duration = Math.max(35, clients.length * 8)

  return (
    <div className="overflow-hidden border-b border-[#181C23]/[0.07]">
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
        }}
      >
        {items.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="w-[150px] h-[110px] shrink-0 flex items-center justify-center p-5 bg-white border-r border-[#181C23]/[0.07] group cursor-default"
          >
            {client.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logo}
                alt={client.nameEn}
                className="max-w-[110px] max-h-[70px] w-auto h-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            ) : (
              <span className="font-[var(--font-open-sans)] text-[11px] font-semibold text-[#181C23]/30 group-hover:text-[#181C23]/70 text-center leading-tight uppercase tracking-wider px-1 transition-colors duration-300">
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
    <section className="bg-white overflow-hidden border-t border-b border-[#181C23]/[0.07]">
      {/* Header */}
      <div className="px-8 lg:px-16 py-8 flex items-center gap-6 border-b border-[#181C23]/[0.07]">
        <div className="w-8 h-px bg-[#B1A490]" />
        <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#181C23]/40 uppercase tracking-[5px]">
          Our Clients
        </span>
        <div className="flex-1 h-px bg-[#181C23]/[0.07]" />
      </div>

      {/* Two rows */}
      <Row clients={r1} direction="ltr" />
      <Row clients={r2} direction="rtl" />
    </section>
  )
}
