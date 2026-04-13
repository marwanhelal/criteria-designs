'use client'

import { useState, useEffect, useRef } from 'react'
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

const CARDS_VISIBLE = 4

export default function FounderTeamSection() {
  const [founder, setFounder] = useState<FounderData | null>(null)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(0)

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

  // Measure a single card width (track width / CARDS_VISIBLE)
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setCardW(trackRef.current.offsetWidth / CARDS_VISIBLE)
      }
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [team])

  const maxIdx = Math.max(0, team.length - CARDS_VISIBLE)
  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(maxIdx, i + 1))

  // Hide section if no founder image AND no description AND no team
  const hasFounder = founder?.founderImage || founder?.founderDescriptionEn
  if (!hasFounder && team.length === 0) return null

  return (
    <section data-navbar-dark className="flex flex-col lg:flex-row min-h-[320px]">

      {/* ── LEFT: Founder ─────────────────────────────────── */}
      <div className="lg:w-[44%] shrink-0 flex bg-[#ECEAE6]">

        {/* Portrait */}
        {founder?.founderImage && (
          <div className="relative w-[180px] lg:w-[210px] shrink-0 self-stretch">
            <Image
              src={founder.founderImage}
              alt={founder.founderNameEn || 'Founder'}
              fill
              sizes="210px"
              className="object-cover object-top"
              unoptimized
            />
          </div>
        )}

        {/* Text */}
        <div className="flex flex-col justify-end px-8 py-10 lg:px-10 lg:py-12">
          <h2
            className="font-[var(--font-merriweather)] text-[22px] lg:text-[28px] font-bold text-[#181C23] leading-[1.2] mb-4"
          >
            {founder?.founderSectionTitleEn || 'Our Founder and CEO'}
          </h2>
          {founder?.founderDescriptionEn && (
            <p className="font-[var(--font-libre-franklin)] text-[13px] lg:text-[14px] text-[#5A5A58] leading-relaxed max-w-[320px]">
              {founder.founderDescriptionEn}
            </p>
          )}
          {founder?.founderNameEn && (
            <div className="mt-5 flex items-center gap-3">
              <div className="w-6 h-px bg-[#B1A490]" />
              <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[3px]">
                {founder.founderNameEn}
                {founder.founderTitleEn && ` — ${founder.founderTitleEn}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px bg-[#D8D4CE] shrink-0" />

      {/* ── RIGHT: Team ────────────────────────────────────── */}
      <div className="flex-1 bg-white px-8 py-10 lg:px-12 lg:py-12">

        <h2 className="font-[var(--font-merriweather)] text-[20px] lg:text-[26px] font-bold text-[#181C23] leading-[1.2] mb-8">
          {founder?.teamSectionTitleEn || 'Modern Creative Team Showcase'}
        </h2>

        {team.length > 0 ? (
          <div className="flex items-center gap-3">

            {/* Prev arrow */}
            <button
              onClick={prev}
              disabled={idx === 0}
              className="shrink-0 w-9 h-9 rounded-full border border-[#D0CCC8] flex items-center justify-center text-[#181C23] hover:bg-[#181C23] hover:border-[#181C23] hover:text-white disabled:opacity-25 transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Cards track */}
            <div ref={trackRef} className="flex-1 overflow-hidden">
              <div
                className="flex transition-transform duration-400 ease-[cubic-bezier(0.25,0.4,0.25,1)]"
                style={{ transform: `translateX(-${idx * cardW}px)` }}
              >
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="shrink-0 flex flex-col items-center text-center px-3"
                    style={{ width: cardW || `${100 / CARDS_VISIBLE}%` }}
                  >
                    {/* Photo */}
                    <div className="relative w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] rounded-full overflow-hidden bg-[#E8E5E0] mb-3 shadow-sm">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.nameEn}
                          fill
                          sizes="110px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#C9C4BC]">
                          <span className="font-[var(--font-merriweather)] text-white text-[22px] font-bold">
                            {member.nameEn.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <p className="font-[var(--font-merriweather)] text-[13px] lg:text-[14px] font-bold text-[#181C23] leading-tight">
                      {member.nameEn}
                    </p>

                    {/* Role */}
                    <p className="font-[var(--font-libre-franklin)] text-[10px] lg:text-[11px] text-[#9A9A94] tracking-[0.5px] mt-1 leading-snug">
                      {member.roleEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next arrow */}
            <button
              onClick={next}
              disabled={idx >= maxIdx}
              className="shrink-0 w-9 h-9 rounded-full border border-[#D0CCC8] flex items-center justify-center text-[#181C23] hover:bg-[#181C23] hover:border-[#181C23] hover:text-white disabled:opacity-25 transition-all duration-200"
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
      </div>
    </section>
  )
}
