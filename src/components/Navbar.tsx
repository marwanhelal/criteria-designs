'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#181C23]/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-8 lg:px-[128px] h-[120px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-[var(--font-libre-franklin)] text-[28px] text-white leading-[28px]">
          Criteria
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-[40px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] leading-[24px] hover:text-[#B1A490] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-6">
          <button className="text-white hover:text-[#B1A490] transition-colors">
            <Search size={24} />
          </button>
          <Link
            href="/contact"
            className="font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] leading-[24px] bg-white/10 px-[40px] py-[18px] rounded-[30px] hover:bg-white/20 transition-colors"
          >
            Let&apos;s chat
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#181C23]/95 backdrop-blur-sm px-8 pb-8">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-[var(--font-libre-franklin)] text-[16px] text-white uppercase tracking-[0.56px] py-2 hover:text-[#B1A490] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] bg-white/10 px-[40px] py-[18px] rounded-[30px] text-center hover:bg-white/20 transition-colors mt-4"
            >
              Let&apos;s chat
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
