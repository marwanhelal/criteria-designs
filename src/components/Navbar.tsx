'use client'

import { useState, useEffect } from 'react'
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

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 h-[80px] flex items-center justify-between">
          {/* Logo - CMS driven: image + text side by side */}
          <Link href="/" className="relative z-[60] flex items-center gap-3">
            {settings?.logo && (
              <Image
                src={settings.logo}
                alt={settings.companyNameEn || 'Criteria Design Group'}
                width={48}
                height={48}
                className="h-[48px] w-auto object-contain"
                unoptimized
              />
            )}
            <span className="font-[var(--font-libre-franklin)] text-[20px] font-normal leading-[18px] text-white max-w-[92px]">
              {settings?.companyNameEn || 'Criteria Design Group'}
            </span>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] w-[48px] h-[48px] flex flex-col items-center justify-center gap-[6px] rounded-full bg-[#181C23] hover:bg-[#2a2f3a] transition-colors"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-[22px] h-[2px] bg-white rounded-full transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-[8px]' : ''
            }`} />
            <span className={`block w-[22px] h-[2px] bg-white rounded-full transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`} />
            <span className={`block w-[22px] h-[2px] bg-white rounded-full transition-all duration-300 ${
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
          <div className="flex flex-col items-center gap-2">
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
                  <span className={`font-[var(--font-merriweather)] text-[42px] md:text-[56px] lg:text-[64px] leading-[1.2] transition-colors duration-300 ${
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
