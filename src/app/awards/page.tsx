'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

interface Award {
  id: string
  titleEn: string
  year: number
  subtitleEn: string | null
  image: string | null
  type: string
}

interface Settings {
  logo: string | null
  companyNameEn: string
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/awards', label: 'Recognitions' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

// ── Header ────────────────────────────────────────────────────────────────────
function AwardsHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/settings').then(r => r.ok ? r.json() : null).then(setSettings).catch(() => {})
  }, [])
  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ECEAE6]">
        <div className="px-[clamp(1rem,4vw,7rem)] h-[clamp(68px,6vw,100px)] flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4 md:gap-5 outline-none">
            {settings?.logo && (
              <Image src={settings.logo} alt={settings.companyNameEn || 'Criteria'} width={100} height={100}
                className="h-[clamp(44px,5vw,80px)] w-auto object-contain transition-transform duration-500 group-hover:scale-105" unoptimized />
            )}
            <div className="flex flex-col gap-0">
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(18px,2vw,30px)] font-bold leading-[1.1] tracking-[0.5px] text-[#181C23] group-hover:text-[#8a7a66] transition-colors duration-300">Criteria</span>
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(8px,0.8vw,12px)] font-light uppercase tracking-[6px] text-[#888] group-hover:text-[#555] transition-colors duration-300">Designs</span>
            </div>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] w-[clamp(38px,3.5vw,54px)] h-[clamp(38px,3.5vw,54px)] flex flex-col items-center justify-center gap-[5px] rounded-full bg-[#181C23] hover:bg-[#2a2f3a] transition-colors duration-300"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Menu overlay */}
      <div className={`fixed inset-0 z-[55] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#070707]" />
        <div className={`absolute left-[clamp(1rem,4vw,7rem)] top-[15%] bottom-[15%] w-px transition-all duration-700 delay-200 ${menuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(177,164,144,0.35) 30%, rgba(177,164,144,0.35) 70%, transparent)', transformOrigin: 'top' }} />
        <div className="absolute right-0 inset-y-0 flex items-center overflow-hidden pointer-events-none select-none pr-[clamp(1rem,4vw,7rem)]">
          <span className="font-[var(--font-playfair)] italic leading-none text-white/[0.025]" style={{ fontSize: 'clamp(140px, 22vw, 380px)' }}>Menu</span>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center pl-[clamp(2.5rem,7vw,10rem)]">
          <nav className="flex flex-col">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className={`group flex items-baseline gap-4 md:gap-6 py-[clamp(6px,1vw,12px)] border-b border-white/[0.05] last:border-0 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: menuOpen ? `${120 + index * 65}ms` : '0ms' }}>
                  <span className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3px] shrink-0 transition-colors duration-300 w-7"
                    style={{ color: isActive ? '#B1A490' : 'rgba(177,164,144,0.35)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-[var(--font-playfair)] italic leading-[1.15] transition-all duration-300 group-hover:translate-x-2 ${isActive ? 'text-[#B1A490]' : 'text-white/70 group-hover:text-white'}`}
                    style={{ fontSize: 'clamp(30px, 4.5vw, 68px)' }}>
                    {link.label}
                  </span>
                  {isActive && <span className="ml-2 w-[6px] h-[6px] rounded-full bg-[#B1A490] shrink-0 self-center" />}
                </Link>
              )
            })}
          </nav>
          <div className={`mt-10 flex items-center justify-between pr-[clamp(2rem,8vw,14rem)] transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: menuOpen ? '580ms' : '0ms' }}>
            <p className="font-[var(--font-libre-franklin)] text-[10px] tracking-[2.5px] uppercase text-white/20">&copy; {new Date().getFullYear()} Criteria Designs</p>
            <Link href="/contact" onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-3 font-[var(--font-libre-franklin)] text-[10px] tracking-[3px] uppercase text-[#B1A490] hover:text-white transition-colors duration-300">
              Get in touch
              <span className="block w-7 h-px bg-[#B1A490] group-hover:w-12 transition-all duration-400" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ award, onClose }: { award: Award; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        {award.image && (
          <div className="relative w-full bg-[#0a0a0a]" style={{ aspectRatio: '4/3' }}>
            <Image src={award.image} alt={award.titleEn} fill className="object-contain" unoptimized />
          </div>
        )}

        {/* Info bar */}
        <div className="bg-[#0f0f0f] border-t border-white/[0.06] px-7 py-5 flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] text-[#B1A490]">
                {award.year}
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[2px] text-white/30">
                {award.type === 'PAPER' ? 'Published Paper' : 'Award'}
              </span>
            </div>
            <h2 className="font-[var(--font-playfair)] italic text-white leading-[1.25]"
              style={{ fontSize: 'clamp(16px, 2vw, 24px)' }}>
              {award.titleEn}
            </h2>
            {award.subtitleEn && (
              <p className="font-[var(--font-libre-franklin)] text-[11px] text-white/40 mt-2 leading-relaxed">
                {award.subtitleEn}
              </p>
            )}
          </div>
          <button onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors duration-200">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Award card ────────────────────────────────────────────────────────────────
function AwardCard({ award, index, featured, showType, onImageClick }: {
  award: Award; index: number; featured?: boolean; showType?: boolean; onImageClick: (a: Award) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-[#111] ${featured ? 'col-span-full' : ''}`}
      style={{ aspectRatio: featured ? '21/8' : '4/3' }}
      onClick={() => onImageClick(award)}
    >
      {/* Image or placeholder */}
      {award.image ? (
        <Image src={award.image} alt={award.titleEn} fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          unoptimized />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1A17] to-[#0e0d0b] flex items-end justify-end p-8">
          <span className="font-[var(--font-playfair)] italic text-white/[0.06] leading-none select-none"
            style={{ fontSize: 'clamp(80px, 12vw, 180px)' }}>
            {award.year}
          </span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-opacity duration-500" />

      {/* Top: type badge */}
      {showType && (
        <div className="absolute top-4 left-4">
          <span className={`font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] px-3 py-[5px] rounded-full backdrop-blur-sm ${
            award.type === 'PAPER'
              ? 'bg-white/10 text-white/60 border border-white/15'
              : 'bg-[#B1A490]/20 text-[#B1A490] border border-[#B1A490]/30'
          }`}>
            {award.type === 'PAPER' ? 'Paper' : 'Award'}
          </span>
        </div>
      )}

      {/* Top right: expand icon on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="text-white">
            <path d="M8 1h5v5M14 0L8 6M6 13H1V8M0 14l6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Bottom: info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
        {/* Year + separator */}
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] text-[#B1A490]">
            {award.year}
          </span>
          <span className="w-4 h-px bg-[#B1A490]/40" />
        </div>

        {/* Title */}
        <h3 className="font-[var(--font-playfair)] italic text-white leading-[1.2]"
          style={{ fontSize: featured ? 'clamp(18px,2.8vw,38px)' : 'clamp(14px,1.4vw,20px)' }}>
          {award.titleEn}
        </h3>

        {/* Subtitle */}
        {award.subtitleEn && (
          <p className={`font-[var(--font-libre-franklin)] text-white/50 mt-2 leading-relaxed line-clamp-2 ${featured ? 'text-[12px] md:text-[13px]' : 'text-[11px]'}`}>
            {award.subtitleEn}
          </p>
        )}
      </div>

      {/* Gold rim on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-[#B1A490]/0 group-hover:ring-[#B1A490]/30 transition-all duration-500 pointer-events-none" />
    </motion.div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between pt-16 pb-6">
      <div className="flex items-center gap-4">
        <div className="w-5 h-px bg-[#B1A490]" />
        <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[4px] text-[#B1A490]">
          {label}
        </span>
      </div>
      <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[2px] text-[#AEABA5]">
        {count} {count === 1 ? 'Entry' : 'Entries'}
      </span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
type Tab = 'awards' | 'papers' | 'all'

export default function AwardsPage() {
  const [all, setAll] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('awards')
  const [lightboxAward, setLightboxAward] = useState<Award | null>(null)

  useEffect(() => {
    fetch('/api/awards?status=PUBLISHED')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setAll(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const openLightbox = useCallback((award: Award) => {
    if (award.image) setLightboxAward(award)
  }, [])
  const closeLightbox = useCallback(() => setLightboxAward(null), [])

  const awards = all.filter(a => a.type !== 'PAPER')
  const papers = all.filter(a => a.type === 'PAPER')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'awards', label: 'Awards' },
    { key: 'papers', label: 'Published Papers' },
    { key: 'all', label: 'All' },
  ]

  const renderGrid = (list: Award[], showType = false) => {
    if (list.length === 0) return (
      <div className="py-32 flex flex-col items-center gap-3">
        <div className="w-10 h-px bg-[#DDD]" />
        <p className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[4px] text-[#CCC]">No entries on record</p>
      </div>
    )
    const [first, ...rest] = list
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Featured first card — full width */}
        <AwardCard award={first} index={0} featured showType={showType} onImageClick={openLightbox} />
        {/* Remaining cards */}
        {rest.map((a, i) => (
          <AwardCard key={a.id} award={a} index={i + 1} showType={showType} onImageClick={openLightbox} />
        ))}
      </div>
    )
  }

  return (
    <>
      <AwardsHeader />
      <div className="min-h-screen bg-[#F8F7F5]">
        {/* Nav spacer */}
        <div style={{ height: 'clamp(68px,6vw,100px)' }} />

        {/* ── Hero ── */}
        <div className="px-[clamp(1rem,4vw,7rem)] pt-14 pb-12 bg-white border-b border-[#ECEAE6]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[5px] text-[#B1A490] mb-4">
              Criteria Designs — Recognition Record
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h1 className="font-[var(--font-playfair)] italic text-[#111] leading-[1.05]"
                style={{ fontSize: 'clamp(42px, 7vw, 96px)' }}>
                Recognitions
              </h1>
              {!loading && (
                <div className="flex items-center gap-8 mb-2">
                  <div>
                    <p className="font-[var(--font-playfair)] text-[32px] md:text-[40px] text-[#111] leading-none">{awards.length}</p>
                    <p className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] text-[#B1A490] mt-1">Awards</p>
                  </div>
                  <div className="w-px h-12 bg-[#ECEAE6]" />
                  <div>
                    <p className="font-[var(--font-playfair)] text-[32px] md:text-[40px] text-[#111] leading-none">{papers.length}</p>
                    <p className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] text-[#9A9A94] mt-1">Papers</p>
                  </div>
                </div>
              )}
            </div>
            <p className="font-[var(--font-libre-franklin)] text-[12px] text-[#9A9A94] tracking-[0.03em] leading-relaxed max-w-[460px] mt-5">
              A growing record of design excellence, international recognition, and academic achievement.
            </p>
          </motion.div>
        </div>

        {/* ── Tabs ── */}
        <div className="sticky top-[clamp(68px,6vw,100px)] z-40 bg-white/95 backdrop-blur-md border-b border-[#ECEAE6] px-[clamp(1rem,4vw,7rem)] flex items-center gap-0">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] px-5 py-4 transition-colors duration-200 ${tab === t.key ? 'text-[#111]' : 'text-[#AEABA5] hover:text-[#555]'}`}>
              {t.label}
              {tab === t.key && (
                <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111]"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
              )}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="px-[clamp(1rem,4vw,7rem)] py-10">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`rounded-2xl bg-[#E8E5E0] animate-pulse ${i === 1 ? 'col-span-full' : ''}`}
                  style={{ aspectRatio: i === 1 ? '21/8' : '4/3' }} />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!loading && tab === 'awards' && (
              <motion.div key="awards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderGrid(awards)}
              </motion.div>
            )}
            {!loading && tab === 'papers' && (
              <motion.div key="papers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderGrid(papers)}
              </motion.div>
            )}
            {!loading && tab === 'all' && (
              <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {awards.length > 0 && (
                  <>
                    <SectionLabel label="Awards" count={awards.length} />
                    {renderGrid(awards)}
                  </>
                )}
                {papers.length > 0 && (
                  <>
                    <SectionLabel label="Published Papers" count={papers.length} />
                    {renderGrid(papers, true)}
                  </>
                )}
                {all.length === 0 && (
                  <div className="py-32 flex flex-col items-center gap-3">
                    <div className="w-10 h-px bg-[#DDD]" />
                    <p className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[4px] text-[#CCC]">No entries on record</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Footer />
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxAward && <Lightbox award={lightboxAward} onClose={closeLightbox} />}
      </AnimatePresence>
    </>
  )
}
