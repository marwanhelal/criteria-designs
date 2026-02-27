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
function AwardsHeader({ count, loading }: { count: number; loading: boolean }) {
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
        <div className="px-4 md:px-12 lg:px-16 h-[72px] md:h-[90px] flex items-center justify-between border-b border-[#e8e8e8]">
          <Link href="/" className="group flex items-center gap-4 md:gap-5 outline-none">
            {settings?.logo && (
              <Image
                src={settings.logo}
                alt={settings.companyNameEn || 'Criteria Design Group'}
                width={100}
                height={100}
                className="h-[52px] md:h-[72px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            )}
            <div className="flex flex-col gap-[2px]">
              <span className="font-[var(--font-merriweather)] text-[22px] md:text-[28px] font-normal leading-[1.1] tracking-[0.5px] text-[#181C23] transition-colors duration-300 group-hover:text-[#8a7a66]">
                Criteria
              </span>
              <div className="flex items-center gap-2">
                <span className="block w-[22px] md:w-[30px] h-[1px] bg-[#B1A490]/80" />
                <span className="font-[var(--font-libre-franklin)] text-[10px] md:text-[12px] font-light uppercase tracking-[4px] md:tracking-[5px] text-[#666] group-hover:text-[#444] transition-colors duration-300">
                  Designs
                </span>
              </div>
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

        {/* Row 2: Title + Count */}
        <div className="px-6 lg:px-[52px] py-5 flex items-baseline justify-between border-b border-[#e8e8e8]">
          <h1 className="font-[var(--font-playfair)] text-[#111] text-[26px] lg:text-[30px] font-normal tracking-[-0.01em]">
            Awards
          </h1>
          {!loading && (
            <p className="font-[var(--font-open-sans)] text-[#747779] text-[14px] lg:text-[15px]">
              {count} {count === 1 ? 'Award' : 'Awards'}
            </p>
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

// ── Award Row ─────────────────────────────────────────────────────────────────
function AwardRow({ award, index }: { award: Award; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="h-px bg-[#E0E0DC]" />
      <div className="group -mx-6 lg:-mx-[52px] px-6 lg:px-[52px] py-7 md:py-9 flex items-center gap-6 md:gap-12 hover:bg-[#faf9f7] transition-colors duration-200">

        {/* Index */}
        <span className="hidden lg:block font-[var(--font-libre-franklin)] text-[11px] text-[#C8C8C2] tracking-[0.15em] shrink-0 w-6 text-right select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Year */}
        <span className="font-[var(--font-playfair)] text-[32px] md:text-[42px] leading-none text-[#C0BDB8] shrink-0 select-none w-[80px] md:w-[110px]">
          {award.year}
        </span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-[var(--font-libre-franklin)] text-[16px] md:text-[20px] font-semibold text-[#1A1A1A] leading-[1.3] group-hover:text-[#3a3a3a] transition-colors duration-200">
            {award.titleEn}
          </h3>
          {award.subtitleEn && (
            <p className="font-[var(--font-libre-franklin)] text-[12px] md:text-[13px] text-[#B1A490] tracking-[0.04em] mt-1">
              {award.subtitleEn}
            </p>
          )}
        </div>

        {/* Image (desktop only) */}
        {award.image && (
          <div className="shrink-0 hidden md:block">
            <div className="relative w-[130px] h-[96px] rounded-[4px] overflow-hidden bg-[#f4f3f1] border border-[#eceae6]">
              <Image
                src={award.image}
                alt={award.titleEn}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/awards?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setAwards(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <AwardsHeader count={awards.length} loading={loading} />

      <div className="min-h-screen bg-white">
        {/* Spacer: logo row + title row */}
        <div className="h-[140px] md:h-[158px]" />

        <div className="px-6 lg:px-[52px] pt-10 pb-20">

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

          {/* Empty */}
          {!loading && awards.length === 0 && (
            <div className="text-center py-24">
              <p className="font-[var(--font-open-sans)] text-[#bbb] text-[14px]">No awards to display yet.</p>
            </div>
          )}

          {/* List */}
          {!loading && awards.length > 0 && (
            <div>
              {awards.map((award, i) => (
                <AwardRow key={award.id} award={award} index={i} />
              ))}
              <div className="h-px bg-[#E0E0DC]" />
            </div>
          )}

        </div>

        <Footer />
      </div>
    </>
  )
}
