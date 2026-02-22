'use client'

import { useState, useEffect } from 'react'
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 3) * 0.07 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">

        {/* Image — white curtain reveal */}
        <div className="relative overflow-hidden bg-[#e5e5e5]" style={{ aspectRatio: '16/10' }}>
          <motion.div
            className="absolute inset-0"
            variants={{
              hidden: { scale: 1.1 },
              visible: { scale: 1, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            {thumb ? (
              <Image
                src={thumb}
                alt={project.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-[#d8d8d8]" />
            )}
          </motion.div>

          {/* White curtain wipes off to the right */}
          <motion.div
            className="absolute inset-0 bg-white z-10 origin-right"
            variants={{
              hidden: { scaleX: 1 },
              visible: { scaleX: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const } },
            }}
          />
        </div>

        {/* Info — white background, Open Sans, F+P proportions */}
        <div className="bg-white pt-4 pb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-[var(--font-open-sans)] text-[#111] text-[16px] lg:text-[18px] font-semibold leading-snug transition-colors duration-300 group-hover:text-[#444]">
              {project.titleEn}
            </h3>
            {meta && (
              <p className="font-[var(--font-open-sans)] text-[#747779] text-[13px] mt-[5px]">
                {meta}
              </p>
            )}
          </div>

          {/* → right arrow circle */}
          <div className="shrink-0 mt-[2px] w-8 h-8 rounded-full border border-[#ccc] flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:border-black text-[#666] group-hover:text-white">
            <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
              <path
                d="M1 5H13M13 5L9 1M13 5L9 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
      <Navbar />

      <div data-navbar-dark className="bg-white min-h-screen">

        {/* Spacer — pushes content below fixed navbar */}
        <div className="h-[72px] md:h-[90px]" />

        {/* ── Sticky header + filter — stays at top while grid scrolls ── */}
        <div className="sticky top-[72px] md:top-[90px] bg-white z-40">

          {/* Header row: "Projects" left + count right */}
          <div className="px-8 lg:px-[84px] py-5 flex items-baseline justify-between border-b border-[#e8e8e8]">
            <h1 className="font-[var(--font-open-sans)] text-[#111] text-[19px] lg:text-[21px] font-normal">
              Projects
            </h1>
            {!loading && (
              <p className="font-[var(--font-open-sans)] text-[#747779] text-[19px] lg:text-[21px]">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </p>
            )}
          </div>

          {/* Category filter — text links, underline active */}
          <div className="px-8 lg:px-[84px] py-4 flex flex-wrap gap-x-8 gap-y-3 border-b border-[#e8e8e8]">
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

        {/* ── Grid ── */}
        <div className="px-8 lg:px-[84px] pt-10 pb-20">

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i}>
                  <div className="w-full bg-gray-100 animate-pulse" style={{ aspectRatio: '16/10' }} />
                  <div className="pt-4 pb-5 flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-[17px] bg-gray-100 animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p className="font-[var(--font-open-sans)] text-[#bbb] text-[14px]">
                No projects found.
              </p>
            </div>
          )}

          {/* Cards with filter transition */}
          {!loading && filteredProjects.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
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
      </div>

      <Footer />
    </>
  )
}
