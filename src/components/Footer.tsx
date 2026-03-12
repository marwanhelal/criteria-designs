'use client'

import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter, ArrowUp } from 'lucide-react'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Twitter, label: 'Twitter' },
]

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-[#161616] text-white">
      <div className="max-w-[1290px] mx-auto px-8">

        {/* Row 1: Logo | Socials + Back to Top */}
        <div className="flex items-center justify-between py-6 border-b border-white/10">
          {/* Logo */}
          <Link
            href="/"
            className="font-[var(--font-libre-franklin)] text-[22px] font-bold tracking-wide"
          >
            Criteria Designs
          </Link>

          {/* Socials + Back to Top */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-[#B1A490] hover:border-[#B1A490] transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}

            <button
              onClick={scrollToTop}
              className="ml-4 flex items-center gap-2 font-[var(--font-open-sans)] text-[13px] tracking-wide hover:text-[#B1A490] transition-colors whitespace-nowrap"
            >
              Back To Top <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Row 2: Nav Links | Legal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-5 gap-4">
          {/* Nav */}
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-[var(--font-open-sans)] text-[13px] text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <p className="font-[var(--font-open-sans)] text-[13px] text-white/50 whitespace-nowrap">
            <Link href="/privacy" className="hover:text-white/80 transition-colors">Legal and policies</Link>
            &nbsp;&nbsp;&copy; {new Date().getFullYear()} Criteria Designs. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
