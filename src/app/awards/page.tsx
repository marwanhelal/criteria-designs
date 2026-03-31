'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

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
  { href: '/awards', label: 'Awards' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

// ── Self-contained fixed header ───────────────────────────────────────────────
function AwardsHeader({ awardsCount, papersCount, loading }: { awardsCount: number; papersCount: number; loading: boolean }) {
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
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {/* Row 1: Logo + Hamburger */}
        <div className="px-[clamp(1rem,4vw,7rem)] h-[clamp(68px,6vw,100px)] flex items-center justify-between border-b border-[#e8e8e8]">
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
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(18px,2vw,30px)] font-bold leading-[1.1] tracking-[0.5px] text-[#181C23] transition-colors duration-300 group-hover:text-[#8a7a66]">
                Criteria
              </span>
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(8px,0.8vw,12px)] font-light uppercase tracking-[6px] text-[#666] group-hover:text-[#444] transition-colors duration-300">
                Designs
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] w-[42px] h-[42px] md:w-[48px] md:h-[48px] flex flex-col items-center justify-center gap-[5px] md:gap-[6px] rounded-full bg-white hover:bg-gray-100 transition-colors duration-300"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-[22px] h-[2px] rounded-full bg-[#181C23] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-[#181C23] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-[#181C23] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>

        {/* Row 2: Title + Counts */}
        <div className="px-[clamp(1rem,4vw,7rem)] py-5 flex items-baseline justify-between border-b border-[#e8e8e8]">
          <h1 className="font-[var(--font-playfair)] text-[#111] text-[clamp(20px,2.5vw,32px)] font-normal tracking-[-0.01em]">
            Recognitions
          </h1>
          {!loading && (
            <div className="flex items-center gap-4">
              <span className="font-[var(--font-open-sans)] text-[#747779] text-[13px] lg:text-[14px]">
                <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] uppercase tracking-[3px] border border-[#B1A490]/40 rounded-full px-2 py-[2px] mr-2">Award</span>
                {awardsCount}
              </span>
              <span className="w-px h-3 bg-[#ddd]" />
              <span className="font-[var(--font-open-sans)] text-[#747779] text-[13px] lg:text-[14px]">
                <span className="font-[var(--font-libre-franklin)] text-[9px] text-[#9A9A94] uppercase tracking-[3px] border border-[#9A9A94]/30 rounded-full px-2 py-[2px] mr-2">Paper</span>
                {papersCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[55] transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-[#181C23]" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center">
          <div className="flex flex-col items-center gap-1 md:gap-2">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group relative overflow-hidden transition-all duration-500 ${
                    menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${index * 80}ms` : '0ms' }}
                >
                  <span className={`font-[var(--font-merriweather)] text-[32px] md:text-[56px] lg:text-[64px] leading-[1.3] transition-colors duration-300 ${
                    isActive ? 'text-[#B1A490]' : 'text-white/80 group-hover:text-white'
                  }`}>
                    {link.label}
                  </span>
                  <span className={`block h-[2px] bg-[#B1A490] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            })}
          </div>
          <div className={`absolute bottom-12 left-0 right-0 px-6 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-500 delay-500 ${
            menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <p className="font-[var(--font-open-sans)] text-[14px] text-white/40">
              &copy; {new Date().getFullYear()} Criteria Design Group
            </p>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[1px] hover:text-white transition-colors"
            >
              Get in touch &rarr;
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Row component ─────────────────────────────────────────────────────────────
function RecognitionRow({ award, index, showType }: { award: Award; index: number; showType?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="h-px bg-[#E0E0DC]" />
      <div className="group relative -mx-6 lg:-mx-[52px] px-6 lg:px-[52px] py-7 md:py-9 flex items-center gap-6 md:gap-12 hover:bg-[#faf9f7] transition-colors duration-250">

        {/* Left accent bar */}
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#B1A490] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

        {/* Index */}
        <span className="hidden lg:block font-[var(--font-libre-franklin)] text-[11px] text-[#C8C8C2] tracking-[0.15em] shrink-0 w-6 text-right select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Year */}
        <span className="font-[var(--font-playfair)] text-[28px] md:text-[38px] leading-none text-[#C0BDB8] shrink-0 select-none w-[72px] md:w-[100px]">
          {award.year}
        </span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {showType && (
            <span className={`inline-block font-[var(--font-libre-franklin)] text-[8px] uppercase tracking-[3px] rounded-full px-2 py-[2px] mb-2 ${
              award.type === 'PAPER'
                ? 'text-[#9A9A94] border border-[#9A9A94]/30'
                : 'text-[#B1A490] border border-[#B1A490]/40'
            }`}>
              {award.type === 'PAPER' ? 'Published Paper' : 'Award'}
            </span>
          )}
          <h3 className="font-[var(--font-libre-franklin)] text-[15px] md:text-[19px] font-semibold text-[#1A1A1A] leading-[1.3] group-hover:text-[#B1A490] transition-colors duration-300">
            {award.titleEn}
          </h3>
          {award.subtitleEn && (
            <p className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#9A9A94] tracking-[0.04em] mt-1">
              {award.subtitleEn}
            </p>
          )}
        </div>

        {/* Image */}
        {award.image && (
          <div className="shrink-0">
            <div className="relative w-[72px] h-[54px] md:w-[130px] md:h-[96px] rounded-[4px] overflow-hidden bg-white border border-[#eceae6]">
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                className="object-contain p-1 md:p-2"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ label, count, pill, pillColor }: { label: string; count: number; pill: string; pillColor: 'gold' | 'gray' }) {
  return (
    <div className="flex items-baseline justify-between mb-2 mt-14 first:mt-0">
      <div className="flex items-center gap-3">
        <span className={`font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3px] rounded-full px-3 py-1 border ${
          pillColor === 'gold'
            ? 'text-[#B1A490] border-[#B1A490]/40'
            : 'text-[#9A9A94] border-[#9A9A94]/30'
        }`}>
          {pill}
        </span>
        <h2 className="font-[var(--font-playfair)] text-[clamp(18px,2vw,26px)] text-[#1A1A1A] font-normal tracking-[-0.01em]">
          {label}
        </h2>
      </div>
      <span className="font-[var(--font-libre-franklin)] text-[13px] text-[#9A9A94]">
        {count} {count === 1 ? 'entry' : 'entries'}
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
      <AwardsHeader awardsCount={awards.length} papersCount={papers.length} loading={loading} />

      <div className="min-h-screen bg-white">
        {/* Spacer: logo row + title row */}
        <div className="h-[140px] md:h-[158px]" />

        <div className="px-6 lg:px-[52px] pt-10 pb-20">

          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-libre-franklin)] text-[13px] md:text-[14px] text-[#9A9A94] tracking-[0.04em] leading-relaxed max-w-[520px] mb-8"
          >
            A growing record of design excellence, international recognition, and academic achievement across architecture and interior design.
          </motion.p>

          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-1 mb-10 border-b border-[#E0E0DC]"
          >
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[2.5px] px-4 py-3 border-b-2 -mb-px transition-all duration-200 ${
                  tab === t.key
                    ? 'border-[#B1A490] text-[#B1A490]'
                    : 'border-transparent text-[#9A9A94] hover:text-[#555]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Skeleton */}
          {loading && (
            <div>
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-px bg-[#E0E0DC]" />
                  <div className="py-8 md:py-10 flex items-start gap-6 md:gap-14">
                    <div className="w-[64px] md:w-[88px] h-[52px] md:h-[72px] bg-gray-100 animate-pulse rounded shrink-0" />
                    <div className="flex-1 pt-3 space-y-2">
                      <div className="h-5 bg-gray-100 animate-pulse rounded w-1/2" />
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-px bg-[#E0E0DC]" />
            </div>
          )}

          {/* ── Awards tab ── */}
          {!loading && tab === 'awards' && (
            <>
              {awards.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-[var(--font-open-sans)] text-[#bbb] text-[14px]">No awards to display yet.</p>
                </div>
              ) : (
                <div>
                  {awards.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} />)}
                  <div className="h-px bg-[#E0E0DC]" />
                </div>
              )}
            </>
          )}

          {/* ── Published Papers tab ── */}
          {!loading && tab === 'papers' && (
            <>
              {papers.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-[var(--font-open-sans)] text-[#bbb] text-[14px]">No published papers to display yet.</p>
                </div>
              ) : (
                <div>
                  {papers.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} />)}
                  <div className="h-px bg-[#E0E0DC]" />
                </div>
              )}
            </>
          )}

          {/* ── All tab ── */}
          {!loading && tab === 'all' && (
            <>
              {all.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-[var(--font-open-sans)] text-[#bbb] text-[14px]">No recognitions to display yet.</p>
                </div>
              ) : (
                <div>
                  {awards.length > 0 && (
                    <>
                      <SectionHeading label="Awards" count={awards.length} pill="Award" pillColor="gold" />
                      {awards.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} />)}
                      <div className="h-px bg-[#E0E0DC]" />
                    </>
                  )}
                  {papers.length > 0 && (
                    <>
                      <SectionHeading label="Published Papers" count={papers.length} pill="Published Paper" pillColor="gray" />
                      {papers.map((a, i) => <RecognitionRow key={a.id} award={a} index={i} />)}
                      <div className="h-px bg-[#E0E0DC]" />
                    </>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        <Footer />
      </div>
    </>
  )
}
