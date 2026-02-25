'use client'

interface Client {
  id: string
  nameEn: string
  logo?: string | null
  bgColor?: string | null
}

// Each square card is 160px + 4px gap = 164px per item
const CARD_W = 164

function Row({ clients, direction }: { clients: Client[]; direction: 'ltr' | 'rtl' }) {
  const minItems = Math.ceil(5760 / (clients.length * CARD_W)) + 1
  const repeats = Math.max(10, minItems)
  const items = Array(repeats).fill(clients).flat() as Client[]
  const pct = (1 / repeats) * 100
  const duration = Math.max(30, clients.length * 7)

  return (
    <div className="overflow-hidden">
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
          gap: '4px',
          animation: `scroll-${direction === 'rtl' ? 'rtl' : 'ltr'}-${clients.length} ${duration}s linear infinite`,
        }}
      >
        {items.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="w-[160px] h-[160px] shrink-0 flex items-center justify-center p-4 bg-white/[0.05]"
          >
            {client.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logo}
                alt={client.nameEn}
                className="max-w-[130px] max-h-[130px] w-auto h-auto object-contain"
              />
            ) : (
              <span className="font-[var(--font-open-sans)] text-[11px] font-semibold text-white/50 text-center leading-tight uppercase tracking-wider px-2">
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
    <section className="bg-[#181C23] py-16 overflow-hidden border-t border-white/[0.06]">
      <div className="px-6 lg:px-14 mb-12">
        <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
          Our Clients
        </span>
      </div>

      <div className="space-y-1">
        <Row clients={r1} direction="ltr" />
        <Row clients={r2} direction="rtl" />
      </div>
    </section>
  )
}
