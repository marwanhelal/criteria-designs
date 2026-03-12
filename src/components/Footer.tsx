'use client'

import Link from 'next/link'
import { LucideFacebook, LucideInstagram, LucideLinkedin, LucideTwitter, LucideYoutube, ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
]

const socialDefs = [
  { key: 'instagram', icon: LucideInstagram, label: 'Instagram' },
  { key: 'linkedin',  icon: LucideLinkedin,  label: 'LinkedIn'  },
  { key: 'facebook',  icon: LucideFacebook,  label: 'Facebook'  },
  { key: 'twitter',   icon: LucideTwitter,   label: 'Twitter'   },
  { key: 'youtube',   icon: LucideYoutube,   label: 'YouTube'   },
] as const

type SocialKey = 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'youtube'
type Socials = Partial<Record<SocialKey, string | null>>

export default function Footer() {
  const [socials, setSocials] = useState<Socials>({})

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Socials) =>
        setSocials({
          instagram: data.instagram,
          linkedin:  data.linkedin,
          facebook:  data.facebook,
          twitter:   data.twitter,
          youtube:   data.youtube,
        })
      )
      .catch(() => {})
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-white text-[#181C23] border-t border-[#181C23]/10">
      <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16">

        {/* Row 1: Logo | Socials + Back to Top */}
        <div className="flex items-center justify-between py-6 border-b border-[#181C23]/10">
          {/* Logo */}
          <Link
            href="/"
            className="font-[var(--font-libre-franklin)] text-[22px] font-bold tracking-wide"
          >
            Criteria Designs
          </Link>

          {/* Socials + Back to Top */}
          <div className="flex items-center gap-3">
            {socialDefs.map(({ key, icon: Icon, label }) => {
              const url = socials[key]
              if (!url) return null
              return (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-[#181C23]/8 border border-[#181C23]/15 flex items-center justify-center hover:bg-[#B1A490] hover:border-[#B1A490] hover:text-white transition-colors"
                >
                  <Icon size={15} />
                </a>
              )
            })}

            <button
              onClick={scrollToTop}
              className="ml-4 flex items-center gap-2 font-[var(--font-open-sans)] text-[13px] tracking-wide text-[#181C23]/60 hover:text-[#B1A490] transition-colors whitespace-nowrap"
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
                className="font-[var(--font-open-sans)] text-[13px] text-[#181C23]/60 hover:text-[#181C23] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <p className="font-[var(--font-open-sans)] text-[13px] text-[#181C23]/40 whitespace-nowrap">
            <Link href="/privacy" className="hover:text-[#181C23]/70 transition-colors">Legal and policies</Link>
            &nbsp;&nbsp;&copy; {new Date().getFullYear()} Criteria Designs. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
