'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface ShowcaseProject {
  id: string
  slug: string
  titleEn: string
  category: string
  location: string | null
  yearCompleted: number | null
  clientName: string | null
  images: { url: string; alt: string | null }[]
}

const CATEGORY_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  INTERIOR: 'Interior Design',
  URBAN: 'Urban Planning',
  LANDSCAPE: 'Landscape',
  RENOVATION: 'Renovation',
}

function ShowcaseItem({
  project,
  index,
  total,
}: {
  project: ShowcaseProject
  index: number
  total: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.4 })
  const [hovered, setHovered] = useState(false)

  const primaryImage = project.images[0]?.url
  const hoverImage = project.images[1]?.url || project.images[0]?.url
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height: '100vh', minHeight: 600 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block w-full h-full relative overflow-hidden group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Primary image */}
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={project.titleEn}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index === 0}
            unoptimized
          />
        )}

        {/* Hover image (second image) */}
        {hoverImage && hoverImage !== primaryImage && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={hoverImage}
              alt={project.titleEn}
              fill
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
          </motion.div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Left content */}
        <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">
          <div className="max-w-[520px]">

            {/* Slogan — always visible */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[6px] mb-6"
            >
              Design That Adds Value
            </motion.p>

            {/* Project number */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-[var(--font-libre-franklin)] text-[13px] text-white/40 tracking-[4px] mb-3"
            >
              {num} / {String(total).padStart(2, '0')}
            </motion.p>

            {/* Project title */}
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="font-[var(--font-merriweather)] text-[36px] md:text-[52px] lg:text-[64px] text-white leading-[1.05] font-bold mb-6"
            >
              {project.titleEn}
            </motion.h2>

            {/* Details — slide in on hover */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              <div>
                <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px] mb-1">Category</p>
                <p className="font-[var(--font-open-sans)] text-[14px] text-white font-light">{CATEGORY_LABELS[project.category] || project.category}</p>
              </div>
              {project.location && (
                <div>
                  <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px] mb-1">Location</p>
                  <p className="font-[var(--font-open-sans)] text-[14px] text-white font-light">{project.location}</p>
                </div>
              )}
              {project.yearCompleted && (
                <div>
                  <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px] mb-1">Year</p>
                  <p className="font-[var(--font-open-sans)] text-[14px] text-white font-light">{project.yearCompleted}</p>
                </div>
              )}
              {project.clientName && (
                <div>
                  <p className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px] mb-1">Client</p>
                  <p className="font-[var(--font-open-sans)] text-[14px] text-white font-light">{project.clientName}</p>
                </div>
              )}
            </motion.div>

            {/* View arrow */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -12 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 mt-8"
            >
              <span className="block w-10 h-px bg-[#B1A490]" />
              <span className="font-[var(--font-libre-franklin)] text-[12px] text-white uppercase tracking-[3px]">View Project</span>
            </motion.div>

          </div>
        </div>

        {/* Bottom right: counter line */}
        <div className="absolute bottom-8 right-8 md:right-16">
          <div className="flex items-center gap-3">
            <div className="w-16 h-px bg-white/20 relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#B1A490]"
                animate={{ width: isInView ? '100%' : '0%' }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
            <span className="font-[var(--font-libre-franklin)] text-[11px] text-white/40 tracking-[3px]">{num}</span>
          </div>
        </div>

      </Link>
    </div>
  )
}

export default function ShowcaseSection({ projects }: { projects: ShowcaseProject[] }) {
  if (!projects || projects.length === 0) return null

  return (
    <section className="w-full bg-[#0e1117]">
      {/* Section label */}
      <div className="px-8 md:px-16 lg:px-24 py-16 flex items-center gap-6">
        <div className="w-12 h-px bg-[#B1A490]/40" />
        <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490]/60 uppercase tracking-[6px]">
          Selected Works
        </span>
        <div className="flex-1 h-px bg-white/5" />
        <Link
          href="/projects"
          className="font-[var(--font-libre-franklin)] text-[11px] text-white/40 uppercase tracking-[3px] hover:text-[#B1A490] transition-colors duration-300"
        >
          All Projects →
        </Link>
      </div>

      {projects.map((project, i) => (
        <ShowcaseItem
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
        />
      ))}
    </section>
  )
}
