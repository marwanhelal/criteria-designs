'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/awards', label: 'Recognitions' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

interface Settings {
  logo: string | null
  companyNameEn: string
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Detect light/dark sections behind navbar
  const checkBackground = useCallback(() => {
    if (menuOpen) return // menu is dark, always white
    const navMidY = 55 // roughly center of navbar
    const sections = document.querySelectorAll('[data-navbar-dark]')
    let onLight = false
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect()
      if (rect.top <= navMidY && rect.bottom >= navMidY) onLight = true
    })
    setIsDark(onLight)
  }, [menuOpen])

  useEffect(() => {
    checkBackground()
    window.addEventListener('scroll', checkBackground, { passive: true })
    window.addEventListener('resize', checkBackground, { passive: true })
    return () => {
      window.removeEventListener('scroll', checkBackground)
      window.removeEventListener('resize', checkBackground)
    }
  }, [checkBackground])

  // When menu opens, force light (white) text; recheck on close
  useEffect(() => {
    if (menuOpen) {
      setIsDark(false)
    } else {
      checkBackground()
    }
  }, [menuOpen, checkBackground])

  // Colors based on background
  const logoTextColor = isDark ? 'text-[#181C23]' : 'text-white'
  const logoHoverColor = isDark ? 'group-hover:text-[#8a7a66]' : 'group-hover:text-[#B1A490]'
  const subtitleColor = isDark ? 'text-[#666]' : 'text-white/50'
  const subtitleHover = isDark ? 'group-hover:text-[#444]' : 'group-hover:text-white/70'
  const hamburgerBg = isDark ? 'bg-white hover:bg-gray-100' : 'bg-[#181C23] hover:bg-[#2a2f3a]'
  const hamburgerLine = isDark ? 'bg-[#181C23]' : 'bg-white'
  const logoFilter = '' // logo image stays unchanged

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent transition-colors duration-300">
        <div className="w-full px-[clamp(1rem,4vw,7rem)] h-[clamp(68px,6vw,100px)] flex items-center justify-between">
          {/* Logo - CMS driven: image + text */}
          <Link href="/" className="group relative z-[60] flex items-center gap-4 md:gap-5 outline-none">
            {settings?.logo && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-[-8px] bg-[#B1A490]/15 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Image
                  src={settings.logo}
                  alt={settings.companyNameEn || 'Criteria Design Group'}
                  width={100}
                  height={100}
                  className={`relative h-[clamp(44px,5vw,80px)] w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-105 ${logoFilter}`}
                  unoptimized
                />
              </div>
            )}
            <div className="flex flex-col gap-0">
              <span className={`font-[family-name:var(--font-franklin-gothic)] text-[clamp(18px,2vw,30px)] font-bold leading-[1.1] tracking-[0.5px] transition-colors duration-500 ${logoTextColor} ${logoHoverColor}`}>
                Criteria
              </span>
              <span className={`font-[family-name:var(--font-franklin-gothic)] text-[clamp(8px,0.8vw,12px)] font-light uppercase tracking-[6px] transition-colors duration-500 ${subtitleColor} ${subtitleHover}`}>
                Designs
              </span>
            </div>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative z-[60] w-[clamp(38px,3.5vw,54px)] h-[clamp(38px,3.5vw,54px)] flex flex-col items-center justify-center gap-[5px] rounded-full transition-colors duration-500 ${hamburgerBg}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-[22px] h-[2px] rounded-full transition-all duration-300 ${hamburgerLine} ${
              menuOpen ? 'rotate-45 translate-y-[8px]' : ''
            }`} />
            <span className={`block w-[22px] h-[2px] rounded-full transition-all duration-300 ${hamburgerLine} ${
              menuOpen ? 'opacity-0' : ''
            }`} />
            <span className={`block w-[22px] h-[2px] rounded-full transition-all duration-300 ${hamburgerLine} ${
              menuOpen ? '-rotate-45 -translate-y-[8px]' : ''
            }`} />
          </button>
        </div>
      </nav>

      {/* Full-screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[55] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Near-black background */}
        <div className="absolute inset-0 bg-[#070707]" />

        {/* Vertical gold accent line — far left */}
        <div
          className={`absolute left-[clamp(1rem,4vw,7rem)] top-[15%] bottom-[15%] w-px transition-all duration-700 delay-200 ${
            menuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
          }`}
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(177,164,144,0.35) 30%, rgba(177,164,144,0.35) 70%, transparent)',
            transformOrigin: 'top',
          }}
        />

        {/* Giant decorative faint word */}
        <div className="absolute right-0 inset-y-0 flex items-center overflow-hidden pointer-events-none select-none pr-[clamp(1rem,4vw,7rem)]">
          <span
            className="font-[var(--font-playfair)] italic leading-none text-white/[0.025]"
            style={{ fontSize: 'clamp(140px, 22vw, 380px)' }}
          >
            Menu
          </span>
        </div>

        {/* Content — left-aligned */}
        <div className="relative z-10 h-full flex flex-col justify-center pl-[clamp(2.5rem,7vw,10rem)]">

          {/* Nav Links */}
          <nav className="flex flex-col">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-baseline gap-4 md:gap-6 py-[clamp(6px,1vw,12px)] border-b border-white/[0.05] last:border-0 transition-all duration-500 ${
                    menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${120 + index * 65}ms` : '0ms' }}
                >
                  {/* Index */}
                  <span
                    className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3px] shrink-0 transition-colors duration-300 w-7"
                    style={{ color: isActive ? '#B1A490' : 'rgba(177,164,144,0.35)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Label */}
                  <span
                    className={`font-[var(--font-playfair)] italic leading-[1.15] transition-all duration-400 group-hover:translate-x-2 ${
                      isActive ? 'text-[#B1A490]' : 'text-white/70 group-hover:text-white'
                    }`}
                    style={{ fontSize: 'clamp(30px, 4.5vw, 68px)' }}
                  >
                    {link.label}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <span className="ml-2 w-[6px] h-[6px] rounded-full bg-[#B1A490] shrink-0 self-center" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom bar */}
          <div
            className={`mt-10 flex items-center justify-between pr-[clamp(2rem,8vw,14rem)] transition-all duration-500 ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
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
