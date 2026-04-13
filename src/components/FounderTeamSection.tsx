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

  const hasFounder = founder?.founderImage || founder?.founderDescriptionEn
  if (!hasFounder && team.length === 0) return null

  return (
    <section data-navbar-dark className="flex flex-col lg:flex-row" style={{ minHeight: '420px' }}>

      {/* ── LEFT: Founder ─────────────────────────────────── */}
      <div className="lg:w-[42%] shrink-0 relative flex bg-[#ECEAE6] overflow-hidden">

        {/* Portrait — fills full height on the left */}
        {founder?.founderImage && (
          <div className="relative shrink-0" style={{ width: '200px' }}>
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

        {/* Text — anchored to the bottom-left of the remaining space */}
        <div className="flex flex-col justify-end px-8 pb-10 pt-10 lg:px-10 lg:pb-12">
          <h2
            className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-[1.15] mb-4"
            style={{ fontSize: 'clamp(22px, 2.2vw, 30px)' }}
          >
            {founder?.founderSectionTitleEn || 'Our Founder and CEO'}
          </h2>

          {founder?.founderDescriptionEn && (
            <p
              className="font-[var(--font-libre-franklin)] text-[#5A5855] leading-relaxed"
              style={{ fontSize: 'clamp(12px, 1vw, 14px)', maxWidth: '280px' }}
            >
              {founder.founderDescriptionEn}
            </p>
          )}

          {founder?.founderNameEn && (
            <div className="mt-5 flex items-center gap-3">
              <div className="w-5 h-px bg-[#B1A490]" />
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

      {/* ── RIGHT: Team ────────────────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10 lg:px-14 lg:py-12">

        <h2
          className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-[1.2] mb-8"
          style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}
        >
          {founder?.teamSectionTitleEn || 'Modern Creative Team Showcase'}
        </h2>

        {team.length > 0 ? (
          <div className="flex items-center gap-2">

            {/* Prev arrow */}
            <button
              onClick={prev}
              disabled={idx === 0}
              className="shrink-0 w-8 h-8 rounded-full border border-[#CCCAC6] flex items-center justify-center text-[#181C23] hover:bg-[#181C23] hover:border-[#181C23] hover:text-white disabled:opacity-20 transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
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
                    className="shrink-0 flex flex-col items-center text-center px-2"
                    style={{ width: cardW > 0 ? `${cardW}px` : `${100 / CARDS_VISIBLE}%` }}
                  >
                    {/* Photo — portrait rectangle matching the design */}
                    <div
                      className="relative w-full overflow-hidden bg-[#E8E5E0] mb-3"
                      style={{ aspectRatio: '3/4', maxWidth: '120px' }}
                    >
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.nameEn}
                          fill
                          sizes="120px"
                          className="object-cover object-top"
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
                    <p
                      className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-tight"
                      style={{ fontSize: 'clamp(11px, 0.9vw, 13px)' }}
                    >
                      {member.nameEn}
                    </p>

                    {/* Role */}
                    <p
                      className="font-[var(--font-libre-franklin)] text-[#9A9A94] mt-1 leading-snug"
                      style={{ fontSize: 'clamp(9px, 0.75vw, 11px)' }}
                    >
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
