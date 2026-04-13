'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORY_LABELS: Record<string, string> = {
  URBAN:               'Urban Design',
  LANDSCAPE:           'Landscape Design',
  MIXED_USE:           'Mixed Use',
  COMMERCIAL:          'Commercial',
  RESIDENTIAL:         'Residential',
  EDUCATIONAL:         'Educational',
  HOSPITALITY:         'Hospitality',
  RENOVATION:          'Renovation',
  INTERIOR_COMMERCIAL: 'Commercial & Administrative',
  INTERIOR_RESIDENTIAL:'Residential',
  INTERIOR:            'Interior Design',
}

// How categories map to the 3 top-level display groups
const GROUP_DEFS = [
  {
    key: 'URBAN_LANDSCAPE',
    label: 'Urban & Landscape Design',
    categories: ['URBAN', 'LANDSCAPE'],
    accentColor: '#5B8A5B',
  },
  {
    key: 'ARCHITECTURE',
    label: 'Architecture',
    categories: ['MIXED_USE', 'COMMERCIAL', 'RESIDENTIAL', 'EDUCATIONAL', 'HOSPITALITY', 'RENOVATION'],
    accentColor: '#C9A24D',
    subLabels: {
      MIXED_USE:   'Mixed Use',
      COMMERCIAL:  'Commercial',
      RESIDENTIAL: 'Residential',
      EDUCATIONAL: 'Educational',
      HOSPITALITY: 'Hospitality',
      RENOVATION:  'Renovation',
    },
  },
  {
    key: 'INTERIOR',
    label: 'Interior Design',
    categories: ['INTERIOR_COMMERCIAL', 'INTERIOR_RESIDENTIAL', 'INTERIOR'],
    accentColor: '#B1A490',
    subLabels: {
      INTERIOR_COMMERCIAL:  'Commercial & Administrative',
      INTERIOR_RESIDENTIAL: 'Residential',
      INTERIOR:             'Other',
    },
  },
] as const

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

const filterTabs = [
  { value: 'ALL',          label: 'All' },
  { value: 'URBAN_LANDSCAPE', label: 'Urban & Landscape' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'INTERIOR',     label: 'Interior Design' },
]

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/projects', label: 'Projects' },
  { href: '/awards', label: 'Recognitions' },
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
        <div className="px-[clamp(1rem,4vw,7rem)] h-[clamp(68px,6vw,100px)] flex items-center justify-between border-b border-[#e8e8e8]">
          <Link href="/" className="group flex items-center gap-4 md:gap-5 outline-none">
            {settings?.logo && (
              <Image
                src={settings.logo}
                alt={settings.companyNameEn || 'Criteria Design Group'}
                width={100}
                height={100}
                className="h-[clamp(44px,5vw,80px)] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            )}
            <div className="flex flex-col gap-0">
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(18px,2vw,30px)] font-bold leading-[1.1] tracking-[0.5px] text-[#181C23] transition-colors duration-300 group-hover:text-[#8a7a66]">
                Criteria
              </span>
              <span className="font-[family-name:var(--font-franklin-gothic)] text-[clamp(8px,0.8vw,12px)] font-light uppercase tracking-[6px] text-[#666] group-hover:text-[#444] transition-colors duration-300">
                Designs
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] w-[clamp(38px,3.5vw,54px)] h-[clamp(38px,3.5vw,54px)] flex flex-col items-center justify-center gap-[5px] rounded-full bg-[#181C23] hover:bg-[#2a2f3a] transition-colors duration-300"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[22px] h-[2px] rounded-full bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>

        {/* Row 2: Title + Count */}
        <div className="px-6 lg:px-[52px] py-4 flex items-center justify-between border-b border-[#e8e8e8]">
          <div className="flex items-center gap-4">
            {/* Gold accent bar */}
            <span className="hidden sm:block w-[3px] h-[clamp(28px,3vw,40px)] bg-gradient-to-b from-[#C9A96E] to-[#B1A490] rounded-full" />
            <div>
              <p className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] uppercase tracking-[4px] mb-[3px]">
                Our Work
              </p>
              <h1
                className="font-[var(--font-playfair)] italic font-normal leading-none text-[#111]"
                style={{ fontSize: 'clamp(22px, 2.8vw, 38px)' }}
              >
                Projects
              </h1>
            </div>
          </div>
          {!loading && (
            <p className="font-[var(--font-libre-franklin)] text-[#9A9A94] text-[12px] tracking-[0.05em]">
              {String(filteredCount).padStart(2, '0')} {filteredCount === 1 ? 'Project' : 'Projects'}
            </p>
          )}
        </div>

        {/* Row 3: Category Filters */}
        <div className="px-6 lg:px-[52px] py-4 flex flex-wrap gap-x-8 gap-y-3">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => onCategoryChange(tab.value)}
              className={`font-[var(--font-open-sans)] text-[13px] transition-all duration-200 pb-px ${
                activeCategory === tab.value
                  ? 'text-[#111] border-b border-[#111]'
                  : 'text-[#aaa] hover:text-[#333]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full-screen Menu Overlay */}
      <div className={`fixed inset-0 z-[55] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#070707]" />
        <div
          className={`absolute left-[clamp(1rem,4vw,7rem)] top-[15%] bottom-[15%] w-px transition-all duration-700 delay-200 ${menuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(177,164,144,0.35) 30%, rgba(177,164,144,0.35) 70%, transparent)', transformOrigin: 'top' }}
        />
        <div className="absolute right-0 inset-y-0 flex items-center overflow-hidden pointer-events-none select-none pr-[clamp(1rem,4vw,7rem)]">
          <span className="font-[var(--font-playfair)] italic leading-none text-white/[0.025]" style={{ fontSize: 'clamp(140px,22vw,380px)' }}>Menu</span>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center pl-[clamp(2.5rem,7vw,10rem)]">
          <nav className="flex flex-col">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-baseline gap-4 md:gap-6 py-[clamp(6px,1vw,12px)] border-b border-white/[0.05] last:border-0 transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: menuOpen ? `${120 + index * 65}ms` : '0ms' }}
                >
                  <span className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3px] shrink-0 w-7 transition-colors duration-300"
                    style={{ color: isActive ? '#B1A490' : 'rgba(177,164,144,0.35)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-[var(--font-playfair)] italic leading-[1.15] transition-all duration-300 group-hover:translate-x-2 ${isActive ? 'text-[#B1A490]' : 'text-white/70 group-hover:text-white'}`}
                    style={{ fontSize: 'clamp(30px,4.5vw,68px)' }}
                  >
                    {link.label}
                  </span>
                  {isActive && <span className="ml-2 w-[6px] h-[6px] rounded-full bg-[#B1A490] shrink-0 self-center" />}
                </Link>
              )
            })}
          </nav>
          <div
            className={`mt-10 flex items-center justify-between pr-[clamp(2rem,8vw,14rem)] transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: menuOpen ? '580ms' : '0ms' }}
          >
            <p className="font-[var(--font-libre-franklin)] text-[10px] tracking-[2.5px] uppercase text-white/20">&copy; {new Date().getFullYear()} Criteria Designs</p>
            <Link href="/contact" onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-3 font-[var(--font-libre-franklin)] text-[10px] tracking-[3px] uppercase text-[#B1A490] hover:text-white transition-colors duration-300">
              Get in touch
              <span className="block w-7 h-px bg-[#B1A490] group-hover:w-12 transition-all duration-400" />
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

// ── Grouped section renderer ──────────────────────────────────────────────────
function GroupedSection({
  group,
  projects,
}: {
  group: typeof GROUP_DEFS[number]
  projects: Project[]
}) {
  if (projects.length === 0) return null

  // Does this group have subgroup labels?
  const subLabels = 'subLabels' in group ? group.subLabels as Record<string, string> : null

  // Build sub-sections if subLabels exist
  const subSections = subLabels
    ? group.categories
        .map(cat => ({
          cat,
          label: subLabels[cat as keyof typeof subLabels] ?? CATEGORY_LABELS[cat] ?? cat,
          items: projects.filter(p => p.category === cat),
        }))
        .filter(s => s.items.length > 0)
    : null

  return (
    <div className="mb-16">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-10 rounded-full" style={{ background: group.accentColor }} />
        <div>
          <h2 className="font-[var(--font-franklin-gothic)] text-[#181C23] font-bold"
            style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>
            {group.label}
          </h2>
          <p className="font-[var(--font-open-sans)] text-[#aaa] text-[12px] mt-0.5">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <div className="flex-1 h-px ml-4" style={{ background: `linear-gradient(to right, ${group.accentColor}33, transparent)` }} />
      </div>

      {subSections ? (
        subSections.map(sub => (
          <div key={sub.cat} className="mb-10">
            {/* Sub-section label */}
            <div className="flex items-center gap-3 mb-5">
              <span className="font-[var(--font-open-sans)] text-[11px] uppercase tracking-[0.3em] font-semibold"
                style={{ color: group.accentColor }}>
                {sub.label}
              </span>
              <div className="flex-1 h-px" style={{ background: `${group.accentColor}22` }} />
              <span className="font-[var(--font-open-sans)] text-[11px] text-[#ccc]">{sub.items.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8">
              {sub.items.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ALL')

  useEffect(() => {
    fetch('/api/projects?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => setProjects(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Resolve which projects belong to each tab
  const visibleGroups = GROUP_DEFS.map(g => ({
    ...g,
    projects: projects.filter(p => (g.categories as readonly string[]).includes(p.category)),
  })).filter(g =>
    activeTab === 'ALL' || g.key === activeTab
  )

  const totalVisible = visibleGroups.reduce((n, g) => n + g.projects.length, 0)

  return (
    <>
      <ProjectsHeader
        filteredCount={totalVisible}
        loading={loading}
        activeCategory={activeTab}
        onCategoryChange={setActiveTab}
      />

      <div className="min-h-screen bg-white">
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
          {!loading && totalVisible === 0 && (
            <div className="text-center py-24">
              <p className="font-[var(--font-open-sans)] text-[#bbb] text-[14px]">No projects found.</p>
            </div>
          )}

          {/* Grouped sections */}
          {!loading && totalVisible > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {visibleGroups.map(g => (
                  <GroupedSection key={g.key} group={g} projects={g.projects} />
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
