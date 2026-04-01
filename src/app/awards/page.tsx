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
          <span className="font-[var(--font-playfair)] italic leading-none text-white/[0.025]" style={{ fontSize: 'clamp(140px,22vw,380px)' }}>Menu</span>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center pl-[clamp(2.5rem,7vw,10rem)]">
          <nav className="flex flex-col">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className={`group flex items-baseline gap-4 md:gap-6 py-[clamp(6px,1vw,12px)] border-b border-white/[0.05] last:border-0 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: menuOpen ? `${120 + index * 65}ms` : '0ms' }}>
                  <span className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3px] shrink-0 w-7 transition-colors duration-300"
                    style={{ color: isActive ? '#B1A490' : 'rgba(177,164,144,0.35)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-[var(--font-playfair)] italic leading-[1.15] transition-all duration-300 group-hover:translate-x-2 ${isActive ? 'text-[#B1A490]' : 'text-white/70 group-hover:text-white'}`}
                    style={{ fontSize: 'clamp(30px,4.5vw,68px)' }}>
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-14 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        onClick={e => e.stopPropagation()}
      >
        {award.image && (
          <div className="relative w-full bg-[#0a0a0a]" style={{ aspectRatio: '4/3' }}>
            <Image src={award.image} alt={award.titleEn} fill className="object-contain" unoptimized />
          </div>
        )}
        <div className="bg-[#0f0f0f] border-t border-white/[0.06] px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] text-[#B1A490]">{award.year}</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[2px] text-white/30">
                {award.type === 'PAPER' ? 'Published Paper' : 'Award'}
              </span>
            </div>
            <h2 className="font-[var(--font-playfair)] italic text-white text-[18px] md:text-[22px] leading-[1.25]">{award.titleEn}</h2>
            {award.subtitleEn && (
              <p className="font-[var(--font-libre-franklin)] text-[11px] text-white/40 mt-2 leading-relaxed">{award.subtitleEn}</p>
            )}
          </div>
          <button onClick={onClose}
            className="shrink-0 mt-1 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors duration-200">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────
function RecognitionRow({ award, index, showType, onImageClick }: {
  award: Award; index: number; showType?: boolean; onImageClick: (a: Award) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-5 md:gap-8 py-5 md:py-6 border-b border-[#ECEAE6] hover:border-[#B1A490]/30 transition-colors duration-300"
    >
      {/* Thumbnail — click to open lightbox */}
      <div
        className="shrink-0 w-[56px] h-[56px] md:w-[68px] md:h-[68px] rounded-xl overflow-hidden bg-[#F2EFE9] border border-[#E8E5DF] flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_4px_20px_rgba(177,164,144,0.2)]"
        onClick={() => award.image && onImageClick(award)}
        style={{ cursor: award.image ? 'zoom-in' : 'default' }}
      >
        {award.image ? (
          <div className="relative w-full h-full">
            <Image src={award.image} alt={award.titleEn} fill className="object-contain p-2" unoptimized />
            {/* hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                <path d="M8 1h5v5M14 0L8 6M6 13H1V8M0 14l6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ) : (
          <span className="font-[var(--font-playfair)] italic text-[#D4C9BA] text-[13px]">{award.year}</span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-[5px]">
          <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] tracking-[0.1em]">{award.year}</span>
          {showType && (
            <>
              <span className="w-px h-3 bg-[#DEDAD4]" />
              <span className={`font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[2.5px] ${award.type === 'PAPER' ? 'text-[#9A9A94]' : 'text-[#B1A490]'}`}>
                {award.type === 'PAPER' ? 'Paper' : 'Award'}
              </span>
            </>
          )}
        </div>
        <h3 className="font-[var(--font-playfair)] italic text-[#111] leading-[1.25] group-hover:text-[#B1A490] transition-colors duration-300 truncate"
          style={{ fontSize: 'clamp(14px, 1.4vw, 18px)' }}>
          {award.titleEn}
        </h3>
        {award.subtitleEn && (
          <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#AEABA5] mt-1 tracking-[0.02em] truncate">
            {award.subtitleEn}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="shrink-0 w-7 h-7 rounded-full border border-[#E0DDD8] flex items-center justify-center group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-300">
        <svg width="10" height="10" viewBox="0 0 14 14" fill="none"
          className="text-[#C0BCB5] group-hover:text-white transition-colors duration-300" style={{ rotate: '-45deg' }}>
          <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between pt-12 pb-1">
      <div className="flex items-center gap-3">
        <div className="w-4 h-px bg-[#B1A490]" />
        <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[4px] text-[#B1A490]">{label}</span>
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

  const renderList = (list: Award[], showType = false) => {
    if (list.length === 0) return (
      <div className="py-24 flex flex-col items-center gap-3">
        <div className="w-8 h-px bg-[#DDD]" />
        <p className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[4px] text-[#CCC]">No entries on record</p>
      </div>
    )
    return list.map((a, i) => (
      <RecognitionRow key={a.id} award={a} index={i} showType={showType} onImageClick={openLightbox} />
    ))
  }

  return (
    <>
      <AwardsHeader />
      <div className="min-h-screen bg-white">
        <div style={{ height: 'clamp(68px,6vw,100px)' }} />

        {/* ── Page heading ── */}
        <div className="px-[clamp(1rem,4vw,7rem)] pt-12 pb-10 border-b border-[#ECEAE6]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[5px] text-[#B1A490] mb-3">
              Criteria Designs
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h1 className="font-[var(--font-playfair)] italic text-[#111] leading-[1.1]"
                style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>
                Recognitions
              </h1>
              {!loading && (
                <div className="flex items-center gap-6 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-[var(--font-playfair)] text-[22px] text-[#111] leading-none">{awards.length}</span>
                    <span className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[2.5px] text-[#B1A490]">Awards</span>
                  </div>
                  <div className="w-px h-6 bg-[#ECEAE6]" />
                  <div className="flex items-center gap-2">
                    <span className="font-[var(--font-playfair)] text-[22px] text-[#111] leading-none">{papers.length}</span>
                    <span className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[2.5px] text-[#9A9A94]">Papers</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Tabs ── */}
        <div className="sticky top-[clamp(68px,6vw,100px)] z-40 bg-white/95 backdrop-blur-md border-b border-[#ECEAE6] px-[clamp(1rem,4vw,7rem)] flex items-center">
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
        <div className="px-[clamp(1rem,4vw,7rem)] pb-24">
          {loading && (
            <div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-6 py-5 border-b border-[#ECEAE6]">
                  <div className="w-[68px] h-[68px] rounded-xl bg-[#F2EFE9] animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#F2EFE9] animate-pulse rounded w-1/2" />
                    <div className="h-3 bg-[#F2EFE9] animate-pulse rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!loading && tab === 'awards' && (
              <motion.div key="awards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderList(awards)}
              </motion.div>
            )}
            {!loading && tab === 'papers' && (
              <motion.div key="papers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {renderList(papers)}
              </motion.div>
            )}
            {!loading && tab === 'all' && (
              <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {all.length === 0 ? (
                  <div className="py-24 flex flex-col items-center gap-3">
                    <div className="w-8 h-px bg-[#DDD]" />
                    <p className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[4px] text-[#CCC]">No entries on record</p>
                  </div>
                ) : (
                  <>
                    {awards.length > 0 && (
                      <>
                        <SectionLabel label="Awards" count={awards.length} />
                        {renderList(awards)}
                      </>
                    )}
                    {papers.length > 0 && (
                      <>
                        <SectionLabel label="Published Papers" count={papers.length} />
                        {renderList(papers, true)}
                      </>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Footer />
      </div>

      <AnimatePresence>
        {lightboxAward && <Lightbox award={lightboxAward} onClose={closeLightbox} />}
      </AnimatePresence>
    </>
  )
}
