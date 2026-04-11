'use client'

import Link from 'next/link'
import { LucideFacebook, LucideInstagram, LucideLinkedin, LucideTwitter, LucideYoutube, ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/philosophy', label: 'Philosophy' },
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

export default function Footer({ dark = false }: { dark?: boolean }) {
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
    <footer className={dark ? 'bg-black text-white border-t border-white/[0.06]' : 'bg-white text-[#181C23] border-t border-[#181C23]/10'}>
      <div className="w-full px-[clamp(1rem,4vw,7rem)]">

        {/* Row 1: Logo | Socials + Back to Top */}
        <div className={`flex items-center justify-between py-9 border-b ${dark ? 'border-white/10' : 'border-[#181C23]/10'}`}>
          {/* Logo */}
          <Link
            href="/"
            className={`font-[family-name:var(--font-franklin-gothic)] text-[22px] font-bold leading-[32px] tracking-[0.02em] ${dark ? 'text-white' : 'text-[#181C23]'}`}
          >
            Criteria Designs
          </Link>

          {/* Socials + Back to Top */}
          <div className="flex items-center gap-4">
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
                  className={`w-11 h-11 rounded-full border flex items-center justify-center hover:bg-[#B1A490] hover:border-[#B1A490] hover:text-white transition-colors ${dark ? 'bg-white/8 border-white/15 text-white/70' : 'bg-[#181C23]/8 border-[#181C23]/15 text-[#181C23]'}`}
                >
                  <Icon size={18} />
                </a>
              )
            })}

            <button
              onClick={scrollToTop}
              className={`ml-4 flex items-center gap-2 font-[family-name:var(--font-open-sans)] text-[14px] tracking-wide hover:text-[#B1A490] transition-colors whitespace-nowrap ${dark ? 'text-white/50' : 'text-[#181C23]/60'}`}
            >
              Back To Top <ArrowUp size={15} />
            </button>
          </div>
        </div>

        {/* Row 2: Nav Links | Legal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-7 gap-4">
          {/* Nav */}
          <nav className="flex flex-wrap gap-x-9 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-[family-name:var(--font-open-sans)] text-[14px] transition-colors ${dark ? 'text-white/50 hover:text-white' : 'text-[#181C23]/60 hover:text-[#181C23]'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <p className={`font-[family-name:var(--font-open-sans)] text-[14px] whitespace-nowrap ${dark ? 'text-white/30' : 'text-[#181C23]/40'}`}>
            <Link href="/privacy" className={`transition-colors ${dark ? 'hover:text-white/60' : 'hover:text-[#181C23]/70'}`}>Legal and policies</Link>
            &nbsp;&nbsp;&copy; {new Date().getFullYear()} Criteria Designs. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
