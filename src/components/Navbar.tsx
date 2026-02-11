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
  const lineColor = isDark ? 'bg-[#B1A490]/80' : 'bg-[#B1A490]/60'
  const hamburgerBg = isDark ? 'bg-white hover:bg-gray-100' : 'bg-[#181C23] hover:bg-[#2a2f3a]'
  const hamburgerLine = isDark ? 'bg-[#181C23]' : 'bg-white'
  const logoFilter = '' // logo image stays unchanged

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 h-[90px] md:h-[110px] flex items-center justify-between">
          {/* Logo - CMS driven: image + text */}
          <Link href="/" className="group relative z-[60] flex items-center gap-4 md:gap-5 outline-none">
            {settings?.logo && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-[-8px] bg-[#B1A490]/15 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Image
                  src={settings.logo}
                  alt={settings.companyNameEn || 'Criteria Design Group'}
                  width={80}
                  height={80}
                  className={`relative h-[56px] md:h-[74px] w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-105 ${logoFilter}`}
                  unoptimized
                />
              </div>
            )}
            <div className="flex flex-col gap-[2px]">
              <span className={`font-[var(--font-merriweather)] text-[20px] md:text-[26px] font-normal leading-[1.1] tracking-[0.5px] transition-colors duration-500 ${logoTextColor} ${logoHoverColor}`}>
                Criteria
              </span>
              <div className="flex items-center gap-2">
                <span className={`block w-[18px] md:w-[24px] h-[1px] transition-colors duration-500 ${lineColor}`} />
                <span className={`font-[var(--font-libre-franklin)] text-[9px] md:text-[11px] font-light uppercase tracking-[3px] md:tracking-[4px] transition-colors duration-500 ${subtitleColor} ${subtitleHover}`}>
                  Designs
                </span>
              </div>
            </div>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative z-[60] w-[42px] h-[42px] md:w-[48px] md:h-[48px] flex flex-col items-center justify-center gap-[5px] md:gap-[6px] rounded-full transition-colors duration-500 ${hamburgerBg}`}
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
        className={`fixed inset-0 z-[55] transition-all duration-500 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#181C23]" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center">
          {/* Nav Links */}
          <div className="flex flex-col items-center gap-1 md:gap-2">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group relative overflow-hidden transition-all duration-500 ${
                    menuOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${index * 80}ms` : '0ms' }}
                >
                  <span className={`font-[var(--font-merriweather)] text-[32px] md:text-[56px] lg:text-[64px] leading-[1.3] transition-colors duration-300 ${
                    isActive
                      ? 'text-[#B1A490]'
                      : 'text-white/80 group-hover:text-white'
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

          {/* Bottom info */}
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
