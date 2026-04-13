'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
const CARD_W = 135        // px — card width
const CARD_H = 200        // px — photo height (ratio ~1.5, matches design)
const CARD_GAP = 18       // px — gap between cards

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

  const visibleCount = 4
  const maxIdx = Math.max(0, team.length - visibleCount)
  const prev = () => setIdx(i => Math.max(0, i - STEP))
  const next = () => setIdx(i => Math.min(maxIdx, i + STEP))

  const hasContent = founder?.founderImage || founder?.founderDescriptionEn || team.length > 0
  if (!hasContent) return null

  const offset = idx * (CARD_W + CARD_GAP)

  return (
    <section data-navbar-dark className="flex flex-col lg:flex-row" style={{ minHeight: '520px' }}>

      {/* ══ LEFT: Founder ══════════════════════════════════════ */}
      <div className="lg:w-[43%] shrink-0 flex bg-[#ECEAE6] overflow-hidden">

        {/* Portrait — fills full height */}
        {founder?.founderImage && (
          <div className="relative shrink-0 self-stretch" style={{ width: '220px', minHeight: '520px' }}>
            <Image
              src={founder.founderImage}
              alt={founder.founderNameEn || 'Founder'}
              fill
              sizes="200px"
              className="object-cover object-top"
              unoptimized
            />
          </div>
        )}

        {/* Text — bottom-aligned */}
        <div className="flex flex-col justify-end px-8 pb-12 pt-8 lg:px-10 lg:pb-14">
          <h2
            className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-[1.15] mb-3"
            style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}
          >
            {founder?.founderSectionTitleEn || 'Our Founder and CEO'}
          </h2>

          {founder?.founderDescriptionEn && (
            <p
              className="font-[var(--font-libre-franklin)] text-[#5A5855] leading-relaxed mb-5"
              style={{ fontSize: '13px', maxWidth: '290px' }}
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
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px bg-[#D5D1CC] shrink-0" />

      {/* ══ RIGHT: Team ════════════════════════════════════════ */}
      <div className="flex-1 bg-white flex flex-col justify-start px-10 pt-12 pb-12 lg:px-14 lg:pt-14 overflow-hidden">

        <h2
          className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-[1.2] mb-10"
          style={{ fontSize: 'clamp(18px, 1.8vw, 24px)' }}
        >
          {founder?.teamSectionTitleEn || 'Modern Creative Team Showcase'}
        </h2>

        {team.length > 0 ? (
          <div className="flex items-center gap-4">

            {/* ← Prev */}
            <button
              onClick={prev}
              disabled={idx === 0}
              className="shrink-0 w-8 h-8 rounded-full border border-[#CCCAC6] flex items-center justify-center text-[#181C23] hover:bg-[#181C23] hover:border-[#181C23] hover:text-white disabled:opacity-20 transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Cards viewport */}
            <div className="flex-1 overflow-hidden">
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
                    className="shrink-0 flex flex-col items-center text-center"
                    style={{ width: `${CARD_W}px` }}
                  >
                    {/* Portrait photo — rectangle, no border-radius */}
                    <div
                      className="overflow-hidden bg-[#E4E1DC] mb-3"
                      style={{ width: `${CARD_W}px`, height: `${CARD_H}px` }}
                    >
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.nameEn}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#C5C0B8]">
                          <span className="font-[var(--font-merriweather)] text-white text-[28px] font-bold">
                            {member.nameEn.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <p
                      className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-tight"
                      style={{ fontSize: '13px' }}
                    >
                      {member.nameEn}
                    </p>

                    {/* Role */}
                    <p
                      className="font-[var(--font-libre-franklin)] text-[#9A9A94] mt-1 leading-snug"
                      style={{ fontSize: '11px' }}
                    >
                      {member.roleEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* → Next */}
            <button
              onClick={next}
              disabled={idx >= maxIdx}
              className="shrink-0 w-8 h-8 rounded-full border border-[#CCCAC6] flex items-center justify-center text-[#181C23] hover:bg-[#181C23] hover:border-[#181C23] hover:text-white disabled:opacity-20 transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <p className="font-[var(--font-libre-franklin)] text-[13px] text-[#9A9A94]">
            No team members yet. Add them from the Team section.
          </p>
        )}
      </div>

    </section>
  )
}
