import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  services: [
    { href: '/services', label: 'Architectural Design' },
    { href: '/services', label: 'Interior Design' },
    { href: '/services', label: 'Urban Planning' },
    { href: '/services', label: 'Landscape Design' },
    { href: '/services', label: 'Renovation' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#181C23] text-white">
      <div className="max-w-[1290px] mx-auto px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="font-[var(--font-libre-franklin)] text-[28px] leading-[28px]">
              Criteria
            </Link>
            <p className="font-[var(--font-open-sans)] text-[16px] text-gray-400 leading-[30px] mt-6">
              We build quality real estate projects since 1978. Creating spaces that inspire.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B1A490] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B1A490] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B1A490] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B1A490] transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-[var(--font-libre-franklin)] text-[14px] uppercase tracking-[0.56px] text-[#B1A490] mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-[var(--font-open-sans)] text-[16px] text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-[var(--font-libre-franklin)] text-[14px] uppercase tracking-[0.56px] text-[#B1A490] mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-[var(--font-open-sans)] text-[16px] text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-[var(--font-libre-franklin)] text-[14px] uppercase tracking-[0.56px] text-[#B1A490] mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#B1A490] shrink-0 mt-1" />
                <span className="font-[var(--font-open-sans)] text-[16px] text-gray-400">
                  Cairo, Egypt
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#B1A490] shrink-0" />
                <a href="tel:+201151724527" className="font-[var(--font-open-sans)] text-[16px] text-gray-400 hover:text-white transition-colors">
                  +20 115 172 4527
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#B1A490] shrink-0" />
                <a href="mailto:info@criteriadesigns.com" className="font-[var(--font-open-sans)] text-[16px] text-gray-400 hover:text-white transition-colors">
                  info@criteriadesigns.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-[var(--font-open-sans)] text-[14px] text-gray-500">
            &copy; {new Date().getFullYear()} Criteria Designs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-[var(--font-open-sans)] text-[14px] text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-[var(--font-open-sans)] text-[14px] text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
