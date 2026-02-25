'use client'

interface Client {
  id: string
  nameEn: string
  logo?: string | null
  bgColor?: string | null
}

// Each slot is 220px wide + 48px gap = 268px per item
const CARD_W = 268

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
          gap: '48px',
          animation: `scroll-${direction === 'rtl' ? 'rtl' : 'ltr'}-${clients.length} ${duration}s linear infinite`,
        }}
      >
        {items.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="w-[220px] h-[72px] shrink-0 flex items-center justify-center"
          >
            {client.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logo}
                alt={client.nameEn}
                className="max-h-[52px] max-w-[200px] w-auto object-contain opacity-50 hover:opacity-90 transition-opacity duration-300"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            ) : (
              <span className="font-[var(--font-open-sans)] text-[13px] font-semibold text-white/40 text-center leading-tight uppercase tracking-wider">
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
      <div className="px-8 lg:px-16 mb-12">
        <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
          Our Clients
        </span>
      </div>

      <div className="space-y-8">
        <Row clients={r1} direction="ltr" />
        <Row clients={r2} direction="rtl" />
      </div>
    </section>
  )
}
