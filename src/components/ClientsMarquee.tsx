'use client'

interface Client {
  id: string
  nameEn: string
  logo?: string | null
  bgColor?: string | null
}

// Each card is 180px wide + 8px gap = 188px per item
const CARD_W = 188

function Row({ clients, direction }: { clients: Client[]; direction: 'ltr' | 'rtl' }) {
  // Repeat enough times so total width >> viewport (guarantee seamless at any count)
  // We repeat by N copies where N * clients.length * CARD_W > 3 * 1920 = 5760px
  const minItems = Math.ceil(5760 / (clients.length * CARD_W)) + 1
  const repeats = Math.max(10, minItems)
  const items = Array(repeats).fill(clients).flat() as Client[]

  // One "set" = (1 / repeats) of total, so translate = -(1/repeats * 100)%
  const pct = (1 / repeats) * 100
  const duration = Math.max(20, clients.length * 6)

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
        className="flex w-max"
        style={{
          gap: '8px',
          animation: `scroll-${direction === 'rtl' ? 'rtl' : 'ltr'}-${clients.length} ${duration}s linear infinite`,
        }}
      >
        {items.map((client, i) => (
          <div
            key={`${client.id}-${i}`}
            className="w-[180px] h-[100px] shrink-0 flex items-center justify-center px-5 py-4 rounded-xl overflow-hidden"
            style={{ backgroundColor: client.bgColor || '#FFFFFF' }}
          >
            {client.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logo}
                alt={client.nameEn}
                className="max-h-[62px] max-w-full object-contain"
              />
            ) : (
              <span
                className="font-[var(--font-open-sans)] text-[12px] font-semibold text-center leading-tight"
                style={{ color: client.bgColor && client.bgColor !== '#FFFFFF' ? 'rgba(255,255,255,0.7)' : 'rgba(24,28,35,0.4)' }}
              >
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

  // Split into two rows
  const row1 = clients.filter((_, i) => i % 2 === 0)
  const row2 = clients.filter((_, i) => i % 2 === 1)

  const r1 = row1.length > 0 ? row1 : clients
  const r2 = row2.length > 0 ? row2 : clients

  return (
    <section className="bg-[#F5F0EB] py-16 overflow-hidden">
      <div className="px-8 lg:px-16 mb-10">
        <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
          Our Clients
        </span>
      </div>

      <div className="space-y-2">
        <Row clients={r1} direction="ltr" />
        <Row clients={r2} direction="rtl" />
      </div>
    </section>
  )
}
