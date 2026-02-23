'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORY_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  INTERIOR: 'Interior',
  URBAN: 'Urban Planning',
  LANDSCAPE: 'Landscape',
  RENOVATION: 'Renovation',
}

interface Project {
  id: string
  slug: string
  titleEn: string
  category: string
  yearCompleted: number | null
  location: string | null
  images: { id: string; url: string; alt: string | null }[]
}

interface Settings {
  logo: string | null
  companyNameEn: string
}

const categories = [
  { value: 'ALL', label: 'All' },
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'INTERIOR', label: 'Interior' },
  { value: 'URBAN', label: 'Urban Planning' },
  { value: 'LANDSCAPE', label: 'Landscape' },
]

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

// ── Self-contained fixed header (replaces Navbar + info bar) ─────────────────
function ProjectsHeader({
  filteredCount,
  loading,
  activeCategory,
  onCategoryChange,
}: {
  filteredCount: number
  loading: boolean
  activeCategory: string
  onCategoryChange: (cat: string) => void
}) {
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
      {/* ONE fixed element at top:0 — inline style cannot be overridden by any CSS */}
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
          <h1 className="font-[var(--font-open-sans)] text-[#111] text-[19px] lg:text-[21px] font-normal">
            Projects
          </h1>
          {!loading && (
            <p className="font-[var(--font-open-sans)] text-[#747779] text-[19px] lg:text-[21px]">
              {filteredCount} {filteredCount === 1 ? 'Project' : 'Projects'}
            </p>
          )}
        </div>

        {/* Row 3: Category Filters */}
        <div className="px-6 lg:px-[52px] py-4 flex flex-wrap gap-x-8 gap-y-3">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`font-[var(--font-open-sans)] text-[13px] transition-all duration-200 pb-px ${
                activeCategory === cat.value
                  ? 'text-[#111] border-b border-[#111]'
                  : 'text-[#aaa] hover:text-[#333]'
              }`}
            >
              {cat.label}
            </button>
          ))}
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

// ── Card ─────────────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const thumb = project.images?.[0]?.url ?? null
  const catLabel = CATEGORY_LABELS[project.category] || project.category
  const meta = [project.yearCompleted, project.location || catLabel]
    .filter(Boolean)
    .join(' - ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.09)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.14)] transition-shadow duration-300"
      >
        <div className="relative overflow-hidden bg-[#e0e0e0]" style={{ aspectRatio: '4/3' }}>
          {thumb ? (
            <Image
              src={thumb}
              alt={project.titleEn}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#d0d0d0]" />
          )}
        </div>
        <div className="bg-[#f5f5f5] px-5 pt-[14px] pb-[18px] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-[var(--font-open-sans)] text-[#1a1a1a] text-[15px] lg:text-[17px] font-medium leading-snug transition-colors duration-300 group-hover:text-[#444]">
              {project.titleEn}
            </h3>
            {meta && (
              <p className="font-[var(--font-open-sans)] text-[#747779] text-[12px] lg:text-[13px] mt-[5px]">
                {meta}
              </p>
            )}
          </div>
          <div className="shrink-0 mt-[2px] w-8 h-8 rounded-full border border-[#c8c8c8] flex items-center justify-center transition-all duration-300 group-hover:bg-[#1a1a1a] group-hover:border-[#1a1a1a] text-[#666] group-hover:text-white">
            <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')

  useEffect(() => {
    fetch('/api/projects?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => setProjects(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <>
      <ProjectsHeader
        filteredCount={filteredProjects.length}
        loading={loading}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="min-h-screen bg-white">
        {/* Spacer: nav row (72/90) + title row + filter row */}
        <div className="h-[190px] md:h-[210px]" />

        <div className="px-6 lg:px-[52px] pt-10 pb-20">

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.09)]">
                  <div className="w-full bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }} />
                  <div className="bg-[#f5f5f5] px-5 pt-[14px] pb-[18px] flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-[15px] bg-gray-200 animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p className="font-[var(--font-open-sans)] text-[#bbb] text-[14px]">No projects found.</p>
            </div>
          )}

          {/* Cards */}
          {!loading && filteredProjects.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

        </div>

        <Footer />
      </div>
    </>
  )
}
