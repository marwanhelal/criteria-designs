'use client'

import { useState, useEffect } from 'react'
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
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Fixed nav bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#ECEAE6]"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}
      >
        <div className="px-[clamp(1rem,4vw,7rem)] h-[clamp(68px,6vw,100px)] flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4 md:gap-5 outline-none">
            {settings?.logo && (
              <Image
                src={settings.logo}
                alt={settings.companyNameEn || 'Criteria Design Group'}
                width={100}
                height={100}
                className="h-[clamp(44px,5vw,80px)] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            )}
            <div className="flex flex-col gap-0">
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(18px,2vw,30px)] font-bold leading-[1.1] tracking-[0.5px] text-[#181C23] group-hover:text-[#8a7a66] transition-colors duration-300">
                Criteria
              </span>
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(8px,0.8vw,12px)] font-light uppercase tracking-[6px] text-[#888] group-hover:text-[#555] transition-colors duration-300">
                Designs
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] w-[clamp(38px,3.5vw,54px)] h-[clamp(38px,3.5vw,54px)] flex flex-col items-center justify-center gap-[5px] rounded-full bg-[#181C23] hover:bg-[#2a2f3a] transition-colors duration-300"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Menu overlay — matches Navbar.tsx design */}
      <div className={`fixed inset-0 z-[55] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#070707]" />

        {/* Vertical gold accent line */}
        <div
          className={`absolute left-[clamp(1rem,4vw,7rem)] top-[15%] bottom-[15%] w-px transition-all duration-700 delay-200 ${menuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(177,164,144,0.35) 30%, rgba(177,164,144,0.35) 70%, transparent)',
            transformOrigin: 'top',
          }}
        />

        {/* Decorative faint word */}
        <div className="absolute right-0 inset-y-0 flex items-center overflow-hidden pointer-events-none select-none pr-[clamp(1rem,4vw,7rem)]">
          <span className="font-[var(--font-playfair)] italic leading-none text-white/[0.025]" style={{ fontSize: 'clamp(140px, 22vw, 380px)' }}>
            Menu
          </span>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center pl-[clamp(2.5rem,7vw,10rem)]">
          <nav className="flex flex-col">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-baseline gap-4 md:gap-6 py-[clamp(6px,1vw,12px)] border-b border-white/[0.05] last:border-0 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: menuOpen ? `${120 + index * 65}ms` : '0ms' }}
                >
                  <span className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3px] shrink-0 transition-colors duration-300 w-7"
                    style={{ color: isActive ? '#B1A490' : 'rgba(177,164,144,0.35)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-[var(--font-playfair)] italic leading-[1.15] transition-all duration-300 group-hover:translate-x-2 ${isActive ? 'text-[#B1A490]' : 'text-white/70 group-hover:text-white'}`}
                    style={{ fontSize: 'clamp(30px, 4.5vw, 68px)' }}
                  >
                    {link.label}
                  </span>
                  {isActive && <span className="ml-2 w-[6px] h-[6px] rounded-full bg-[#B1A490] shrink-0 self-center" />}
                </Link>
              )
            })}
          </nav>

          <div
            className={`mt-10 flex items-center justify-between pr-[clamp(2rem,8vw,14rem)] transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: menuOpen ? '580ms' : '0ms' }}
          >
            <p className="font-[var(--font-libre-franklin)] text-[10px] tracking-[2.5px] uppercase text-white/20">
              &copy; {new Date().getFullYear()} Criteria Designs
            </p>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-3 font-[var(--font-libre-franklin)] text-[10px] tracking-[3px] uppercase text-[#B1A490] hover:text-white transition-colors duration-300"
            >
              Get in touch
              <span className="block w-7 h-px bg-[#B1A490] group-hover:w-12 transition-all duration-400" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Table row ─────────────────────────────────────────────────────────────────
function RecognitionRow({ award, index, showType }: { award: Award; index: number; showType?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative grid grid-cols-[clamp(40px,6vw,80px)_1fr_auto] md:grid-cols-[clamp(52px,7vw,90px)_1fr_auto_auto] items-center gap-x-6 md:gap-x-10 py-7 md:py-8 border-b border-[#ECEAE6] group-hover:border-[#B1A490]/40 transition-colors duration-400">

        {/* Year — left column */}
        <div className="flex flex-col items-start">
          <span
            className="font-[var(--font-libre-franklin)] font-light text-[#B1A490] leading-none tracking-[0.5px] transition-colors duration-300"
            style={{ fontSize: 'clamp(18px, 2.2vw, 28px)' }}
          >
            {award.year}
          </span>
        </div>

        {/* Title + subtitle — main column */}
        <div className="min-w-0">
          <h3
            className="font-[var(--font-playfair)] italic text-[#111] leading-[1.25] transition-colors duration-300 group-hover:text-[#B1A490]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 22px)' }}
          >
            {award.titleEn}
          </h3>
          {award.subtitleEn && (
            <p className="font-[var(--font-libre-franklin)] text-[11px] md:text-[12px] text-[#AEABA5] tracking-[0.04em] mt-[5px] leading-relaxed">
              {award.subtitleEn}
            </p>
          )}
        </div>

        {/* Type label — hidden on mobile */}
        {showType && (
          <div className="hidden md:flex items-center justify-end">
            <span
              className={`font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] px-3 py-[4px] rounded-full border ${
                award.type === 'PAPER'
                  ? 'text-[#9A9A94] border-[#9A9A94]/25 bg-[#f9f9f8]'
                  : 'text-[#B1A490] border-[#B1A490]/35 bg-[#faf9f7]'
              }`}
            >
              {award.type === 'PAPER' ? 'Paper' : 'Award'}
            </span>
          </div>
        )}

        {/* Arrow */}
        <div className="flex items-center justify-end">
          <div className="w-7 h-7 rounded-full border border-[#DEDAD4] flex items-center justify-center group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-300">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="text-[#C0BCB5] group-hover:text-white transition-colors duration-300" style={{ rotate: '-45deg' }}>
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Left gold reveal bar on hover */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#B1A490] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>
    </motion.div>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between pt-16 pb-5 first:pt-0 border-b border-[#111] mb-0">
      <span className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[4px] text-[#111]">
        {label}
      </span>
      <span className="font-[var(--font-libre-franklin)] text-[10px] uppercase tracking-[2px] text-[#AEABA5]">
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

  useEffect(() => {
    fetch('/api/awards?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setAll(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const awards = all.filter(a => a.type !== 'PAPER')
  const papers = all.filter(a => a.type === 'PAPER')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'awards', label: 'Awards' },
    { key: 'papers', label: 'Published Papers' },
    { key: 'all', label: 'All' },
  ]

  return (
    <>
      <AwardsHeader />

      <div className="min-h-screen bg-white">
        {/* Spacer for fixed nav */}
        <div style={{ height: 'clamp(68px,6vw,100px)' }} />

        {/* ── Page hero section ── */}
        <div className="px-[clamp(1rem,4vw,7rem)] pt-16 pb-12 border-b border-[#ECEAE6]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Label */}
            <p className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[5px] text-[#B1A490] mb-5">
              Criteria Designs — Recognition Record
            </p>

            {/* Heading */}
            <h1
              className="font-[var(--font-playfair)] italic text-[#111] leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(40px, 6vw, 86px)' }}
            >
              Recognitions
            </h1>

            {/* Description + counts */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <p className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#9A9A94] tracking-[0.03em] leading-relaxed max-w-[480px]">
                A growing record of design excellence, international recognition,
                and academic achievement across architecture and interior design.
              </p>
              {!loading && (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-[var(--font-playfair)] text-[28px] text-[#111] leading-none">{awards.length}</p>
                    <p className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] text-[#B1A490] mt-1">Awards</p>
                  </div>
                  <div className="w-px h-10 bg-[#ECEAE6]" />
                  <div className="text-center">
                    <p className="font-[var(--font-playfair)] text-[28px] text-[#111] leading-none">{papers.length}</p>
                    <p className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] text-[#9A9A94] mt-1">Papers</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Tab switcher ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-[clamp(1rem,4vw,7rem)] border-b border-[#ECEAE6] flex items-center gap-0"
        >
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] px-5 py-4 transition-colors duration-200 ${
                tab === t.key ? 'text-[#111]' : 'text-[#AEABA5] hover:text-[#555]'
              }`}
            >
              {t.label}
              {tab === t.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111]"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Content ── */}
        <div className="px-[clamp(1rem,4vw,7rem)] pb-28">

          {/* Table header */}
          {!loading && (
            <div className="grid grid-cols-[clamp(40px,6vw,80px)_1fr_auto] md:grid-cols-[clamp(52px,7vw,90px)_1fr_auto_auto] gap-x-6 md:gap-x-10 pt-6 pb-3">
              <span className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] text-[#CECBC5]">Year</span>
              <span className="font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] text-[#CECBC5]">Title</span>
              <span className="hidden md:block font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] text-[#CECBC5] text-right">Type</span>
              <span />
            </div>
          )}

          {/* Skeleton */}
          {loading && (
            <div className="pt-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="grid grid-cols-[80px_1fr] gap-10 py-8 border-b border-[#ECEAE6]">
                  <div className="h-6 bg-[#F4F2EF] animate-pulse rounded w-14" />
                  <div className="space-y-2 pt-1">
                    <div className="h-5 bg-[#F4F2EF] animate-pulse rounded w-2/3" />
                    <div className="h-3 bg-[#F4F2EF] animate-pulse rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Awards tab */}
            {!loading && tab === 'awards' && (
              <motion.div key="awards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {awards.length === 0 ? (
                  <div className="py-28 text-center border-t border-[#ECEAE6]">
                    <p className="font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[3px] text-[#CCC]">No awards on record yet</p>
                  </div>
                ) : (
                  awards.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} />)
                )}
              </motion.div>
            )}

            {/* Papers tab */}
            {!loading && tab === 'papers' && (
              <motion.div key="papers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {papers.length === 0 ? (
                  <div className="py-28 text-center border-t border-[#ECEAE6]">
                    <p className="font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[3px] text-[#CCC]">No published papers on record yet</p>
                  </div>
                ) : (
                  papers.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} />)
                )}
              </motion.div>
            )}

            {/* All tab */}
            {!loading && tab === 'all' && (
              <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {all.length === 0 ? (
                  <div className="py-28 text-center border-t border-[#ECEAE6]">
                    <p className="font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[3px] text-[#CCC]">No recognitions on record yet</p>
                  </div>
                ) : (
                  <>
                    {awards.length > 0 && (
                      <>
                        <SectionLabel label="Awards" count={awards.length} />
                        {awards.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} />)}
                      </>
                    )}
                    {papers.length > 0 && (
                      <>
                        <SectionLabel label="Published Papers" count={papers.length} />
                        {papers.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} showType />)}
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
    </>
  )
}
