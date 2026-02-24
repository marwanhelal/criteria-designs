'use client'

interface Client {
  id: string
  nameEn: string
  logo?: string | null
  bgColor?: string | null
}

function Row({ clients, direction }: { clients: Client[]; direction: 'ltr' | 'rtl' }) {
  // Triple the array for a perfectly seamless loop
  const items = [...clients, ...clients, ...clients]
  const duration = Math.max(25, clients.length * 5)

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-2 w-max"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
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
              <span className="font-[var(--font-open-sans)] text-[12px] font-semibold text-center leading-tight"
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

  // Split into two rows (odd indices → row 2, even → row 1)
  const row1 = clients.filter((_, i) => i % 2 === 0)
  const row2 = clients.filter((_, i) => i % 2 === 1)

  // If only one row worth of logos, use all in both rows
  const r1 = row1.length > 0 ? row1 : clients
  const r2 = row2.length > 0 ? row2 : clients

  return (
    <>
      <style>{`
        @keyframes marquee-rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-ltr {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <section className="bg-[#F5F0EB] py-16 overflow-hidden">
        <div className="px-8 lg:px-16 mb-10">
          <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
            Our Clients
          </span>
        </div>

        <div className="space-y-2">
          {/* Row 1 — left to right */}
          <Row clients={r1} direction="ltr" />
          {/* Row 2 — right to left */}
          <Row clients={r2} direction="rtl" />
        </div>
      </section>
    </>
  )
}
