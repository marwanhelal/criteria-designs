'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
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

const categories = [
  { value: 'ALL', label: 'All' },
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'INTERIOR', label: 'Interior' },
  { value: 'URBAN', label: 'Urban Planning' },
  { value: 'LANDSCAPE', label: 'Landscape' },
]

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

  // Measure info bar height dynamically so content is never hidden under it
  const infoBarRef = useRef<HTMLDivElement>(null)
  const [paddingTop, setPaddingTop] = useState(220) // safe default

  useEffect(() => {
    const update = () => {
      const navH = window.innerWidth >= 768 ? 90 : 72
      const barH = infoBarRef.current ? infoBarRef.current.offsetHeight : 130
      setPaddingTop(navH + barH)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

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
      <Navbar />

      {/*
        ── FIXED INFO BAR ──────────────────────────────────────────────────────
        Placed at the React fragment root — same level as <Navbar />.
        This guarantees no parent element can create a containing block that
        would break position:fixed (no transforms, overflow, or filter ancestors).
        Uses Tailwind's responsive top to sit flush under the fixed navbar.
      */}
      <div
        ref={infoBarRef}
        className="fixed top-[72px] md:top-[90px] left-0 right-0 z-40 bg-white"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        {/* "Projects" left + count right */}
        <div className="px-6 lg:px-[52px] py-5 flex items-baseline justify-between border-b border-[#e8e8e8]">
          <h1 className="font-[var(--font-open-sans)] text-[#111] text-[19px] lg:text-[21px] font-normal">
            Projects
          </h1>
          {!loading && (
            <p className="font-[var(--font-open-sans)] text-[#747779] text-[19px] lg:text-[21px]">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </p>
          )}
        </div>

        {/* Category filters */}
        <div className="px-6 lg:px-[52px] py-4 flex flex-wrap gap-x-8 gap-y-3 border-b border-[#e8e8e8]">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
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

      {/*
        ── PAGE CONTENT ────────────────────────────────────────────────────────
        paddingTop pushes content below both fixed bars (navbar + info bar).
        Measured dynamically; safe default of 220px prevents content hiding on
        first render.
      */}
      <div
        data-navbar-dark
        className="min-h-screen bg-white"
        style={{ paddingTop }}
      >
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
