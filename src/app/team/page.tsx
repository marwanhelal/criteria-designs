'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Linkedin, Mail, ExternalLink, Play } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface FounderData {
  founderNameEn: string | null
  founderTitleEn: string | null
  founderDescriptionEn: string | null
  founderImage: string | null
  founderYearsExp: string | null
  founderProjectsCount: string | null
  founderCountriesCount: string | null
  founderPapersCount: string | null
  founderBioCol1En: string | null
  founderBioCol2En: string | null
  founderCertTextEn: string | null
  founderCert1Image: string | null
  founderCert2Image: string | null
  founderCert3Image: string | null
}

interface TeamMember {
  id: string
  nameEn: string
  roleEn: string
  bioEn: string | null
  photo: string | null
  email: string | null
  linkedin: string | null
}

interface Video {
  id: string
  titleEn: string
  youtubeUrl: string
  description: string | null
  order: number
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
  if (!url) return null
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return watchMatch[1]
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]
  const embedMatch = url.match(/embed\/([^?&]+)/)
  if (embedMatch) return embedMatch[1]
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim()
  return null
}

// ── Stat counter component ────────────────────────────────────────────────
function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-start gap-1">
      <motion.span
        className="font-[var(--font-playfair)] italic text-white leading-none"
        style={{ fontSize: 'clamp(32px, 3.5vw, 54px)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {value}
      </motion.span>
      <motion.span
        className="font-[var(--font-libre-franklin)] text-white/40 uppercase"
        style={{ fontSize: '10px', letterSpacing: '2.5px' }}
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {label}
      </motion.span>
    </div>
  )
}

// ── Video card with facade lazy-load ─────────────────────────────────────
function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false)
  const ytId = getYouTubeId(video.youtubeUrl)

  if (!ytId) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65 }}
      className="flex flex-col gap-4"
    >
      {/* Player */}
      <div
        className="relative rounded-2xl overflow-hidden bg-black cursor-pointer group"
        style={{ aspectRatio: '16/9' }}
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title={video.titleEn}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              alt={video.titleEn}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              >
                <Play size={22} className="text-white ml-1" fill="white" />
              </div>
            </div>
            {/* Gold top border on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] bg-[#B1A490] origin-left"
              style={{ transform: 'scaleX(0)', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
            />
          </>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className="font-[var(--font-playfair)] italic text-white leading-snug"
            style={{ fontSize: 'clamp(15px, 1.3vw, 20px)' }}
          >
            {video.titleEn}
          </h3>
          {video.description && (
            <p className="font-[var(--font-libre-franklin)] text-white/35 text-[12px] mt-1 leading-relaxed line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${ytId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 shrink-0 font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[2px] hover:text-white transition-colors mt-1"
        >
          <ExternalLink size={11} />
          YouTube
        </a>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [founder, setFounder] = useState<FounderData | null>(null)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings').then(r => r.ok ? r.json() : null).then(d => { if (d) setFounder(d) }).catch(() => {})
    fetch('/api/team').then(r => r.ok ? r.json() : []).then(setTeam).catch(() => {})
    fetch('/api/videos').then(r => r.ok ? r.json() : []).then(setVideos).catch(() => {})
  }, [])

  const stats = [
    { value: founder?.founderYearsExp || '+25', label: 'Years of Experience' },
    { value: founder?.founderProjectsCount || '+500', label: 'Completed Projects' },
    { value: founder?.founderCountriesCount || '6', label: 'Countries' },
    { value: founder?.founderPapersCount || '6', label: 'Published Papers' },
  ]

  const certLogos = [founder?.founderCert1Image, founder?.founderCert2Image, founder?.founderCert3Image].filter(Boolean) as string[]

  return (
    <>
      <Navbar />

      {/* ══════════════ FOUNDER BIOGRAPHY — CINEMATIC SPLIT ══════════════ */}
      <section className="w-full overflow-hidden" style={{ background: '#0E1118' }}>
        <div className="flex flex-col lg:flex-row" style={{ minHeight: 'clamp(600px, 90vh, 1000px)' }}>

          {/* ── LEFT: Full-bleed portrait ── */}
          <motion.div
            className="relative lg:w-[45%] shrink-0 overflow-hidden"
            style={{ minHeight: 'clamp(380px, 55vw, 700px)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1 }}
          >
            {founder?.founderImage ? (
              <motion.img
                src={founder.founderImage}
                alt={founder?.founderNameEn || 'Founder'}
                className="absolute inset-0 w-full h-full object-cover object-top"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(160deg,#1e2530,#141820)' }}>
                <span className="font-[var(--font-playfair)] italic text-[#B1A490]/20" style={{ fontSize: '160px' }}>H</span>
              </div>
            )}

            {/* Right-edge fade into dark bg */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, transparent 60%, #0E1118 100%)' }} />
            {/* Bottom fade on mobile */}
            <div className="absolute inset-0 pointer-events-none lg:hidden" style={{ background: 'linear-gradient(to bottom, transparent 50%, #0E1118 100%)' }} />

            {/* Floating index label */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/20 uppercase tracking-[3px]">01</span>
              <span className="block w-6 h-px bg-[#B1A490]/40" />
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490]/60 uppercase tracking-[3px]">Founder</span>
            </div>
          </motion.div>

          {/* ── RIGHT: Content ── */}
          <div className="lg:w-[55%] flex flex-col justify-center px-[clamp(2rem,5vw,7rem)] py-[clamp(3rem,5vw,7rem)] bg-white" data-navbar-dark>

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-7 h-px bg-[#B1A490]" />
              <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">Founder Biography</span>
            </motion.div>

            {/* "Arch." prefix */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-[var(--font-libre-franklin)] text-[#9A9A94] uppercase mb-1"
              style={{ fontSize: 'clamp(11px, 0.9vw, 14px)', letterSpacing: '4px' }}
            >
              Arch.
            </motion.p>

            {/* Name — two lines, HUGE Playfair 900 */}
            <div className="mb-4" style={{ lineHeight: 0.92 }}>
              {(() => {
                const fullName = founder?.founderNameEn || 'Hesham Helal'
                const cleaned = fullName.replace(/^Arch\.\s*/i, '')
                const parts = cleaned.trim().split(' ')
                const first = parts.slice(0, -1).join(' ') || parts[0]
                const last = parts.length > 1 ? parts[parts.length - 1] : ''
                return (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span
                        className="block font-[var(--font-playfair)] text-[#181C23]"
                        style={{ fontSize: 'clamp(56px, 7.5vw, 118px)', fontWeight: 900, fontStyle: 'italic' }}
                      >
                        {first}
                      </span>
                    </motion.div>
                    {last && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span
                          className="block font-[var(--font-playfair)]"
                          style={{ fontSize: 'clamp(56px, 7.5vw, 118px)', fontWeight: 900, fontStyle: 'italic', color: '#B1A490' }}
                        >
                          {last}
                        </span>
                      </motion.div>
                    )}
                  </>
                )
              })()}
            </div>

            {/* Gold rule + Title */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                className="h-px bg-[#B1A490]"
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <span
                className="font-[family-name:var(--font-franklin-gothic)] text-[#888] uppercase"
                style={{ fontSize: 'clamp(11px, 0.85vw, 13px)', letterSpacing: '3.5px', fontWeight: 700 }}
              >
                {founder?.founderTitleEn || 'CEO & Founder, M.Sc'}
              </span>
            </motion.div>

            {/* Stats — 2×2 grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.38 }}
              className="grid grid-cols-2 gap-x-8 gap-y-6 mb-10 pb-10"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
            >
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span
                    className="font-[var(--font-playfair)] text-[#181C23] leading-none"
                    style={{ fontSize: 'clamp(36px, 3.8vw, 58px)', fontWeight: 900, fontStyle: 'italic' }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="font-[var(--font-libre-franklin)] text-[#9A9A94] uppercase"
                    style={{ fontSize: '10px', letterSpacing: '2.5px' }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Bio columns */}
            {(founder?.founderBioCol1En || founder?.founderBioCol2En) ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.44 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
              >
                {founder?.founderBioCol1En && (
                  <p className="font-[var(--font-merriweather)] text-[#4A4845] leading-[1.95] whitespace-pre-line" style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', fontWeight: 300 }}>
                    {founder.founderBioCol1En}
                  </p>
                )}
                {founder?.founderBioCol2En && (
                  <p className="font-[var(--font-merriweather)] text-[#4A4845] leading-[1.95] whitespace-pre-line" style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', fontWeight: 300 }}>
                    {founder.founderBioCol2En}
                  </p>
                )}
              </motion.div>
            ) : founder?.founderDescriptionEn ? (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.44 }}
                className="font-[var(--font-merriweather)] text-[#4A4845] leading-[1.95] mb-10"
                style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', fontWeight: 300 }}
              >
                {founder.founderDescriptionEn}
              </motion.p>
            ) : null}

            {/* Certifications */}
            {(founder?.founderCertTextEn || certLogos.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {founder?.founderCertTextEn && (
                  <p
                    className="font-[var(--font-libre-franklin)] text-[#181C23] mb-5"
                    style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px' }}
                  >
                    {founder.founderCertTextEn}
                  </p>
                )}
                {certLogos.length > 0 && (
                  <div className="flex flex-wrap items-center gap-6">
                    {certLogos.map((src, i) => (
                      <div key={i} className="h-10 flex items-center">
                        <img
                          src={src}
                          alt={`Certification ${i + 1}`}
                          className="h-full w-auto object-contain"
                          style={{ filter: 'grayscale(15%) opacity(0.85)' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* ══════════════ VIDEOS ══════════════ */}
      {videos.length > 0 && (
        <section className="w-full overflow-hidden" style={{ background: '#181C23' }}>
          <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,7vw,10rem)]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-[clamp(2.5rem,4vw,5rem)]">
              <div>
                <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-px bg-[#B1A490]" />
                  <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">Our Work</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="font-[var(--font-playfair)] italic font-normal text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(26px, 3vw, 46px)' }}
                >
                  In Motion
                </motion.h2>
              </div>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="font-[var(--font-libre-franklin)] text-[12px] text-white/25 leading-relaxed max-w-[240px] md:text-right pb-1">
                Watch our projects come to life. Click to play directly on the site.
              </motion.p>
            </div>

            {/* Grid */}
            <div className={`grid gap-[clamp(24px,3vw,40px)] ${videos.length === 1 ? 'grid-cols-1 max-w-2xl' : 'grid-cols-1 md:grid-cols-2'}`}>
              {videos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ══════════════ TEAM GRID ══════════════ */}
      {team.length > 0 && (
        <section data-navbar-dark className="w-full overflow-hidden bg-[#FAFAF8]">
          <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,7vw,10rem)]">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-[clamp(2.5rem,4vw,5rem)]">
              <div>
                <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-px bg-[#B1A490]" />
                  <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">The CDG Family</span>
                  <span className="w-px h-3 bg-[#B1A490]/20" />
                  <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#9A9A94] uppercase tracking-[3px]">{String(team.length).padStart(2, '0')} Members</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="font-[var(--font-playfair)] italic font-normal text-[#181C23] leading-[1.1]"
                  style={{ fontSize: 'clamp(26px, 3vw, 46px)' }}
                >
                  The People Behind<br />Every Project
                </motion.h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[clamp(12px,1.5vw,20px)]">
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.07 }}
                  className="group cursor-default"
                  onMouseEnter={() => setHovered(member.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                    {/* Gold top border */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] bg-[#B1A490] origin-left z-10 pointer-events-none"
                      style={{
                        transform: hovered === member.id ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                      }}
                    />
                    {/* Portrait */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: '360px' }}>
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.nameEn}
                          className="w-full h-full object-cover object-top"
                          style={{
                            transform: hovered === member.id ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(160deg,#e8e4de,#d5d0c9)' }}>
                          <span className="font-[var(--font-playfair)] italic text-white/60" style={{ fontSize: '56px' }}>{member.nameEn.charAt(0)}</span>
                        </div>
                      )}

                      {/* Hover overlay with bio + socials */}
                      <AnimatePresence>
                        {hovered === member.id && (member.bioEn || member.linkedin || member.email) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 flex flex-col justify-end p-5"
                            style={{ background: 'linear-gradient(to top, rgba(24,28,35,0.93) 0%, rgba(24,28,35,0.4) 55%, transparent 100%)' }}
                          >
                            {member.bioEn && (
                              <motion.p
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="font-[var(--font-libre-franklin)] text-[11px] text-white/60 leading-[1.7] mb-3 line-clamp-4"
                              >
                                {member.bioEn}
                              </motion.p>
                            )}
                            {(member.linkedin || member.email) && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex gap-2"
                              >
                                {member.linkedin && (
                                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#B1A490]/40 flex items-center justify-center hover:bg-[#B1A490] hover:border-[#B1A490] transition-colors">
                                    <Linkedin size={13} className="text-[#B1A490]" />
                                  </a>
                                )}
                                {member.email && (
                                  <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full border border-[#B1A490]/40 flex items-center justify-center hover:bg-[#B1A490] hover:border-[#B1A490] transition-colors">
                                    <Mail size={13} className="text-[#B1A490]" />
                                  </a>
                                )}
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Info */}
                    <div className="px-4 py-4">
                      <p className="font-[var(--font-playfair)] italic text-[#181C23]" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)' }}>
                        {member.nameEn}
                      </p>
                      <p className="font-[var(--font-libre-franklin)] text-[#B1A490] uppercase mt-1" style={{ fontSize: '10px', letterSpacing: '1.8px' }}>
                        {member.roleEn}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ══════════════ JOIN CTA ══════════════ */}
      <section data-navbar-dark className="w-full overflow-hidden" style={{ background: '#F5F0EB' }}>
        <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,8vw,11rem)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-px bg-[#B1A490]" />
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">Careers</span>
              </div>
              <h2
                className="font-[var(--font-playfair)] italic font-normal text-[#181C23] leading-[1.1]"
                style={{ fontSize: 'clamp(28px, 3.8vw, 56px)', maxWidth: '520px' }}
              >
                Join the Team Behind CDG
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="lg:max-w-[360px]">
              <p className="font-[var(--font-libre-franklin)] text-[#5A5855] leading-[1.85] mb-8" style={{ fontSize: '14px' }}>
                We are always seeking passionate, driven individuals who share our commitment to design excellence and architectural innovation.
              </p>
              <Link href="/contact" className="group inline-flex items-center gap-4">
                <span className="inline-flex items-center justify-center border border-[#181C23] px-8 py-4 rounded-full font-[var(--font-libre-franklin)] text-[11px] text-[#181C23] uppercase tracking-[2.5px] group-hover:bg-[#181C23] group-hover:text-white transition-all duration-300">
                  Get in Touch
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
