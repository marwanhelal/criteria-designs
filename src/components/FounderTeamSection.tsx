'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FounderData {
  founderSectionTitleEn: string | null
  founderNameEn: string | null
  founderTitleEn: string | null
  founderDescriptionEn: string | null
  founderImage: string | null
  teamSectionTitleEn: string | null
}

interface TeamMember {
  id: string
  nameEn: string
  roleEn: string
  photo: string | null
}

const STEP = 1
const CARD_W = 210
const CARD_H = 290
const CARD_GAP = 20

export default function FounderTeamSection() {
  const [founder, setFounder] = useState<FounderData | null>(null)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setFounder(d) })
      .catch(() => {})

    fetch('/api/team')
      .then(r => r.ok ? r.json() : [])
      .then(setTeam)
      .catch(() => {})
  }, [])

  const visibleCount = 3
  const maxIdx = Math.max(0, team.length - visibleCount)
  const prev = () => setIdx(i => Math.max(0, i - STEP))
  const next = () => setIdx(i => Math.min(maxIdx, i + STEP))

  const hasContent = founder?.founderImage || founder?.founderDescriptionEn || team.length > 0
  if (!hasContent) return null

  const offset = idx * (CARD_W + CARD_GAP)

  return (
    <section data-navbar-dark className="bg-white py-16 lg:py-24 px-6 lg:px-14">
      <div
        className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.10)' }}
      >
        <div className="flex flex-col lg:flex-row p-12 lg:p-20 gap-14 lg:gap-20">

          {/* ══ LEFT: Founder Spotlight ══ */}
          <section className="lg:w-2/5 flex flex-col relative z-10">

            {/* Portrait area */}
            <div className="relative mb-10">
              {/* Decorative background rectangle */}
              <div
                className="absolute -z-10 left-0 bg-[#E4E1DC] rounded-2xl opacity-60"
                style={{ top: '48px', width: '300px', height: '210px' }}
              />

              {/* Portrait — breaks out upward into the top padding */}
              <div
                className="relative"
                style={{ marginTop: '-48px', width: '260px', height: '350px' }}
              >
                {founder?.founderImage ? (
                  <img
                    src={founder.founderImage}
                    alt={founder.founderNameEn || 'Founder'}
                    className="w-full h-full object-cover object-top rounded-2xl"
                    style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
                  />
                ) : (
                  <div
                    className="w-full h-full bg-[#D5D1CC] rounded-2xl flex items-center justify-center"
                    style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.10))' }}
                  >
                    <span className="font-[var(--font-merriweather)] text-white font-bold" style={{ fontSize: '40px' }}>
                      {founder?.founderNameEn?.charAt(0) || 'F'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Text — below the portrait */}
            <div style={{ maxWidth: '420px' }}>
              <h2
                className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-[1.1] mb-5"
                style={{ fontSize: 'clamp(28px, 3vw, 46px)' }}
              >
                {founder?.founderSectionTitleEn || 'Our Founder and CEO'}
              </h2>

              {founder?.founderDescriptionEn && (
                <p
                  className="font-[var(--font-libre-franklin)] text-[#5A5855] leading-relaxed mb-5"
                  style={{ fontSize: '15px', maxWidth: '360px' }}
                >
                  {founder.founderDescriptionEn}
                </p>
              )}

              {founder?.founderNameEn && (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-[#B1A490]" />
                  <span
                    className="font-[var(--font-libre-franklin)] text-[#B1A490] uppercase tracking-[2.5px]"
                    style={{ fontSize: '10px' }}
                  >
                    {founder.founderNameEn}
                    {founder.founderTitleEn && ` · ${founder.founderTitleEn}`}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* ══ RIGHT: Team Showcase ══ */}
          <section className="lg:w-3/5 flex flex-col">

            <h3
              className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-tight mb-10"
              style={{ fontSize: 'clamp(22px, 2.4vw, 38px)', maxWidth: '320px' }}
            >
              {founder?.teamSectionTitleEn || 'Modern Creative Team Showcase'}
            </h3>

            {team.length > 0 ? (
              <div className="relative px-6">

                {/* ← Prev */}
                <button
                  onClick={prev}
                  disabled={idx === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md z-20 text-[#181C23]/40 hover:text-[#181C23] disabled:opacity-20 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Cards viewport */}
                <div className="overflow-hidden">
                  <div
                    className="flex"
                    style={{
                      gap: `${CARD_GAP}px`,
                      transform: `translateX(-${offset}px)`,
                      transition: 'transform 0.4s cubic-bezier(0.25,0.4,0.25,1)',
                    }}
                  >
                    {team.map((member) => (
                      <div
                        key={member.id}
                        className="flex-none rounded-2xl overflow-hidden bg-white border border-black/5"
                        style={{
                          width: `${CARD_W}px`,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                        }}
                      >
                        {/* Portrait photo */}
                        <div style={{ height: `${CARD_H}px` }} className="overflow-hidden">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.nameEn}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#C5C0B8] flex items-center justify-center">
                              <span className="font-[var(--font-merriweather)] text-white font-bold" style={{ fontSize: '28px' }}>
                                {member.nameEn.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info panel */}
                        <div className="p-5 bg-white">
                          <p className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-tight" style={{ fontSize: '14px' }}>
                            {member.nameEn}
                          </p>
                          <p
                            className="font-[var(--font-libre-franklin)] text-[#9A9A94] mt-1 leading-snug"
                            style={{ fontSize: '11px' }}
                          >
                            {member.roleEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* → Next */}
                <button
                  onClick={next}
                  disabled={idx >= maxIdx}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md z-20 text-[#181C23]/40 hover:text-[#181C23] disabled:opacity-20 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : (
              <p className="font-[var(--font-libre-franklin)] text-[13px] text-[#9A9A94]">
                No team members yet. Add them from the Team section.
              </p>
            )}

          </section>
        </div>
      </div>
    </section>
  )
}
