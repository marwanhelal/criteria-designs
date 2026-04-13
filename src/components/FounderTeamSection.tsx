'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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

const CARD_W = 152
const CARD_H = 215
const CARD_GAP = 14
const SPEED = 0.45 // px per frame — slow, calm drift

export default function FounderTeamSection() {
  const [founder, setFounder] = useState<FounderData | null>(null)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [activeCard, setActiveCard] = useState(1)

  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const frameCountRef = useRef(0)

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

  // Auto-scroll loop
  useEffect(() => {
    if (team.length === 0) return
    const totalWidth = team.length * (CARD_W + CARD_GAP)

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED
        if (posRef.current >= totalWidth) posRef.current -= totalWidth
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`
        }
        // Update counter every ~18 frames (~0.3s at 60fps)
        frameCountRef.current++
        if (frameCountRef.current % 18 === 0) {
          setActiveCard(Math.floor(posRef.current / (CARD_W + CARD_GAP)) % team.length + 1)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [team])

  const hasContent = founder?.founderImage || founder?.founderDescriptionEn || team.length > 0
  if (!hasContent) return null

  // Triple cards for seamless loop — when pos resets, visuals are identical
  const loopCards = team.length > 0 ? [...team, ...team, ...team] : []

  return (
    <section data-navbar-dark className="bg-white py-16 lg:py-24 px-6 lg:px-14">
      <div
        className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.10)' }}
      >
        <div className="flex flex-col lg:flex-row p-12 lg:p-20 gap-14 lg:gap-20">

          {/* ══ LEFT: Founder ══ */}
          <motion.section
            className="lg:w-2/5 flex flex-col relative z-10"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Portrait + decorative rectangle */}
            <div className="relative mb-10" style={{ alignSelf: 'flex-start' }}>
              <div
                className="absolute -z-10 left-0 bg-[#E4E1DC] rounded-2xl opacity-60"
                style={{ top: '48px', width: '300px', height: '210px' }}
              />

              {/* #4 — Cinematic scale entrance: settles from 1.06 → 1.0 */}
              <motion.div
                className="relative"
                style={{ marginTop: '-48px', width: '260px', height: '350px' }}
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
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
                    <span
                      className="font-[var(--font-merriweather)] text-white font-bold"
                      style={{ fontSize: '48px' }}
                    >
                      {founder?.founderNameEn?.charAt(0) || 'F'}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* #2 — Staggered text reveal: heading → description → name */}
            <motion.div
              style={{ maxWidth: '420px' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.22, delayChildren: 0.25 } },
              }}
            >
              <motion.h2
                className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-[1.1] mb-5"
                style={{ fontSize: 'clamp(28px, 3vw, 46px)' }}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {founder?.founderSectionTitleEn || 'Our Founder and CEO'}
              </motion.h2>

              {founder?.founderDescriptionEn && (
                <motion.p
                  className="font-[var(--font-libre-franklin)] text-[#5A5855] leading-relaxed mb-6"
                  style={{ fontSize: '15px', maxWidth: '360px' }}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {founder.founderDescriptionEn}
                </motion.p>
              )}

              {founder?.founderNameEn && (
                <motion.div
                  className="flex items-center gap-3"
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {/* #3 — Gold line draws from 0 → full width */}
                  <motion.div
                    className="h-px bg-[#B1A490]"
                    initial={{ width: 0 }}
                    whileInView={{ width: 28 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
                  />
                  <span
                    className="font-[var(--font-libre-franklin)] text-[#B1A490] uppercase tracking-[2.5px]"
                    style={{ fontSize: '10px' }}
                  >
                    {founder.founderNameEn}
                    {founder.founderTitleEn && ` · ${founder.founderTitleEn}`}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </motion.section>

          {/* ══ RIGHT: Team — slides in from right on scroll ══ */}
          <motion.section
            className="lg:w-3/5 flex flex-col"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <h3
              className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-tight mb-10"
              style={{ fontSize: 'clamp(22px, 2.4vw, 38px)', maxWidth: '320px' }}
            >
              {founder?.teamSectionTitleEn || 'Modern Creative Team Showcase'}
            </h3>

            {team.length > 0 ? (
              <>
                {/* Auto-scroll track — pauses on hover */}
                <div
                  className="overflow-hidden py-3"
                  onMouseEnter={() => { pausedRef.current = true }}
                  onMouseLeave={() => { pausedRef.current = false }}
                >
                  <div
                    ref={trackRef}
                    className="flex"
                    style={{ gap: `${CARD_GAP}px` }}
                  >
                    {loopCards.map((member, i) => (
                      <div
                        key={i}
                        className="flex-none rounded-2xl overflow-hidden bg-white border border-black/5 cursor-default"
                        style={{
                          width: `${CARD_W}px`,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.transform = 'translateY(-6px)'
                          el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.13)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.transform = 'translateY(0)'
                          el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'
                        }}
                      >
                        {/* Portrait */}
                        <div style={{ height: `${CARD_H}px` }} className="overflow-hidden">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.nameEn}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#C5C0B8] flex items-center justify-center">
                              <span
                                className="font-[var(--font-merriweather)] text-white font-bold"
                                style={{ fontSize: '28px' }}
                              >
                                {member.nameEn.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4 bg-white">
                          <p
                            className="font-[var(--font-merriweather)] font-bold text-[#181C23] leading-tight"
                            style={{ fontSize: '13px' }}
                          >
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

                {/* Progress bar + counter */}
                <div className="mt-6 flex items-center gap-4">
                  <span
                    className="font-[var(--font-libre-franklin)] font-semibold text-[#181C23] tabular-nums"
                    style={{ fontSize: '12px', minWidth: '22px' }}
                  >
                    {String(activeCard).padStart(2, '0')}
                  </span>
                  <div className="flex-1 h-px bg-[#E8E4DF] relative rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#B1A490] rounded-full"
                      style={{
                        width: `${(activeCard / team.length) * 100}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <span
                    className="font-[var(--font-libre-franklin)] text-[#AEABA5] tabular-nums"
                    style={{ fontSize: '12px', minWidth: '22px' }}
                  >
                    {String(team.length).padStart(2, '0')}
                  </span>
                </div>
              </>
            ) : (
              <p className="font-[var(--font-libre-franklin)] text-[13px] text-[#9A9A94]">
                No team members yet. Add them from the Team section.
              </p>
            )}
          </motion.section>

        </div>
      </div>
    </section>
  )
}
