'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const ff = '"Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", var(--font-libre-franklin), Arial, sans-serif'

const CATEGORY_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  INTERIOR: 'Interior Design',
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

// ── Project card ────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const thumb = project.images?.[0]?.url ?? null
  const subtitle = project.location || CATEGORY_LABELS[project.category] || project.category

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      // Slight column-aware stagger: col 0=0ms, col 1=80ms, col 2=160ms
      transition={{ delay: (index % 3) * 0.08 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        {/* Card — dark bg so it works before image loads */}
        <div className="relative overflow-hidden bg-[#111]">

          {/* Image area */}
          <div className="relative h-[340px] lg:h-[380px] overflow-hidden">

            {/* Image zooms out during curtain reveal */}
            <motion.div
              className="absolute inset-0"
              variants={{
                hidden: { scale: 1.12 },
                visible: { scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } },
              }}
            >
              {thumb ? (
                <Image
                  src={thumb}
                  alt={project.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a]" />
              )}
            </motion.div>

            {/* Gradient — info always readable, deepens on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/40" />

            {/* Card info — always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-7">
              <p
                style={{ fontFamily: ff }}
                className="text-[#B1A490] text-[11px] uppercase tracking-[3px] mb-2"
              >
                {subtitle}
              </p>
              <h3
                style={{ fontFamily: ff }}
                className="text-white text-[21px] lg:text-[23px] font-normal leading-snug"
              >
                {project.titleEn}
              </h3>
              {project.yearCompleted && (
                <p
                  style={{ fontFamily: ff }}
                  className="text-white/40 text-[13px] mt-1 tracking-[1px]"
                >
                  {project.yearCompleted}
                </p>
              )}

              {/* "View Project" — slides up on hover */}
              <div className="mt-4 flex items-center gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span className="block w-8 h-px bg-[#B1A490] shrink-0" />
                <span
                  style={{ fontFamily: ff }}
                  className="text-white/60 text-[11px] uppercase tracking-[3px]"
                >
                  View Project
                </span>
              </div>
            </div>

            {/* Curtain that wipes off to the right */}
            <motion.div
              className="absolute inset-0 bg-[#0a0a0a] z-10 origin-right"
              variants={{
                hidden: { scaleX: 1 },
                visible: { scaleX: 0, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const } },
              }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
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

      {/* ── Hero — black, matches project detail page ── */}
      <section className="bg-black pt-[130px] pb-16 px-8 lg:px-[84px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{ fontFamily: ff }}
            className="text-[#B1A490] text-[12px] uppercase tracking-[4px] mb-5"
          >
            What We Create
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1
              style={{ fontFamily: ff }}
              className="text-[48px] lg:text-[80px] text-white font-normal leading-none tracking-[2px]"
            >
              Our Projects
            </h1>
            {!loading && (
              <p
                style={{ fontFamily: ff }}
                className="hidden lg:block text-[#444] text-[13px] tracking-[2px] shrink-0 mb-2"
              >
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </p>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Filters + Grid ── */}
      <section data-navbar-dark className="bg-white pt-[56px] pb-[100px] px-8 lg:px-[84px]">
        <div className="max-w-[1440px] mx-auto">

          {/* Category filter pills */}
          <motion.div
            className="flex flex-wrap gap-3 mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                style={{ fontFamily: ff }}
                className={`text-[12px] uppercase tracking-[3px] px-6 py-[10px] border transition-all duration-300 ${
                  activeCategory === cat.value
                    ? 'bg-black border-black text-white'
                    : 'bg-transparent border-[#ccc] text-[#888] hover:border-[#111] hover:text-[#111]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[380px] bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p style={{ fontFamily: ff }} className="text-[#999] tracking-[2px] text-[14px]">
                No projects found.
              </p>
            </div>
          )}

          {/* Project grid — AnimatePresence for filter switch */}
          {!loading && filteredProjects.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {filteredProjects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </section>

      <Footer />
    </>
  )
}
