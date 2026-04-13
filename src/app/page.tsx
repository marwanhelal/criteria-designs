'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhilosophySection from '@/components/PhilosophySection'
import FounderTeamSection from '@/components/FounderTeamSection'
import ShowcaseSection from '@/components/ShowcaseSection'
import ClientsMarquee from '@/components/ClientsMarquee'
import AwardsAccordion from '@/components/AwardsAccordion'

interface Project {
  id: string
  slug: string
  titleEn: string
  descriptionEn: string
  category: string
  location: string | null
  yearCompleted: number | null
  images: { id: string; url: string; alt: string | null }[]
}

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

interface Settings {
  companyNameEn: string
  seoDescriptionEn: string | null
  logo: string | null
  heroImage: string | null
  heroVideo: string | null
  showcaseProject1Id: string | null
  showcaseProjects: ShowcaseProject[]
  awardsCountries: string | null
  awardsSince: string | null
  homepageAward1Id: string | null
  homepageAward2Id: string | null
  homepageAward3Id: string | null
  homepageAward4Id: string | null
  homepageAward5Id: string | null
}

const CATEGORY_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  INTERIOR: 'Interior',
  URBAN: 'Urban Planning',
  LANDSCAPE: 'Landscape',
  RENOVATION: 'Renovation',
}

interface PortfolioItem {
  id: string
  slug: string
  titleEn: string
  category: string
  location: string | null
  yearCompleted: number | null
  images: { url: string; alt: string | null }[]
}

function PortfolioCard({ project, index }: { project: PortfolioItem; index: number }) {
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  const updateCursor = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect && cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX - rect.left}px`
      cursorRef.current.style.top = `${e.clientY - rect.top}px`
    }
  }

  const catLabel = CATEGORY_LABELS[project.category] || project.category
  const meta = [project.yearCompleted, project.location].filter(Boolean).join(' · ')

  return (
    <div>
      <Link href={`/projects/${project.slug}`} className="group block">

        {/* Image — curtain reveal (clip-path left→right) */}
        <motion.div
          ref={containerRef}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
          className="relative overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.16)] transition-shadow duration-500"
          style={{ aspectRatio: '16/9' }}
          onMouseMove={updateCursor}
          onMouseEnter={(e) => { updateCursor(e); setHovered(true) }}
          onMouseLeave={() => setHovered(false)}
        >
          {project.images?.[0] ? (
            <Image
              src={project.images[0].url}
              alt={project.images[0].alt || project.titleEn}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-[#f0ede8]" />
          )}

          {/* Subtle top vignette */}
          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {/* Bottom "Explore →" overlay — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 py-5 px-8 bg-gradient-to-t from-black/75 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-[380ms] ease-out">
            <span className="font-[var(--font-libre-franklin)] text-[11px] text-white uppercase tracking-[3px]">
              Explore Project &rarr;
            </span>
          </div>

          {/* Large faint editorial index number */}
          <span className="absolute bottom-3 right-5 font-[var(--font-playfair)] text-[72px] lg:text-[108px] leading-none text-white/10 select-none pointer-events-none group-hover:text-white/20 transition-opacity duration-500">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Gold top-left accent line on hover */}
          <div className="absolute top-0 left-0 h-[3px] bg-[#B1A490] w-0 group-hover:w-1/3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

          {/* Cursor circle */}
          <div
            ref={cursorRef}
            className={`absolute pointer-events-none transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-[96px] h-[96px] rounded-full bg-[#181C23]/80 backdrop-blur-sm flex items-center justify-center">
              <span className="font-[var(--font-libre-franklin)] text-[11px] text-white uppercase tracking-[2px]">View</span>
            </div>
          </div>
        </motion.div>

        {/* Info — fade up after image reveals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="px-2 pt-5 pb-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">

              {/* Category · Meta row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-[var(--font-libre-franklin)] text-[9px] uppercase tracking-[3.5px] text-[#B1A490] font-semibold">
                  {catLabel}
                </span>
                {meta && (
                  <>
                    <span className="w-[3px] h-[3px] rounded-full bg-[#D4C9BA] shrink-0" />
                    <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#AEABA5] tracking-[0.02em]">
                      {meta}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h3 className="font-[var(--font-merriweather)] text-[22px] lg:text-[28px] font-bold text-[#181C23] leading-[1.2] group-hover:text-[#B1A490] transition-colors duration-300">
                {project.titleEn}
              </h3>
            </div>

            {/* Arrow button */}
            <div className="shrink-0 mt-1 w-9 h-9 rounded-full border border-[#E0DDD8] flex items-center justify-center group-hover:bg-[#181C23] group-hover:border-[#181C23] transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#9A9A94] group-hover:text-white transition-colors duration-300" style={{ rotate: '-45deg' }}>
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Animated gold underline */}
          <div className="mt-4 h-px bg-[#ECEAE6] relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-[#B1A490] w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </div>
        </motion.div>

      </Link>
    </div>
  )
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [clients, setClients] = useState<{ id: string; nameEn: string; logo?: string | null }[]>([])
  const [awards, setAwards] = useState<{ id: string; titleEn: string; year: number; subtitleEn: string | null; image: string | null }[]>([])

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.ok ? res.json() : [])
      .then(data => setClients(data))
      .catch(() => {})

    fetch('/api/projects?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => setProjects(data.slice(0, 6)))
      .catch(() => {})

    fetch('/api/awards?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAwards(data))
      .catch(() => {})

    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const displayProjects = projects.length > 0 ? projects : []
  const showcaseAll = settings?.showcaseProjects ?? []
  // Slot 1 → full-screen hero only if actually set (not "None")
  const hasHeroSlot = !!settings?.showcaseProject1Id
  const showcaseHero = hasHeroSlot ? showcaseAll.slice(0, 1) : []
  // Slots 2-5 → portfolio cards (if slot 1 is set); all slots if slot 1 is None
  const portfolioProjects = hasHeroSlot && showcaseAll.length > 1
    ? showcaseAll.slice(1)
    : !hasHeroSlot && showcaseAll.length > 0
    ? showcaseAll
    : displayProjects
  const heroImage = settings?.heroImage || null
  // Always use /api/uploads/ route — guaranteed to work in Docker standalone
  const heroVideo = settings?.heroVideo || null
  const heroVideoMime = heroVideo?.endsWith('.webm') ? 'video/webm'
    : heroVideo?.endsWith('.mov') ? 'video/quicktime'
    : 'video/mp4'

  return (
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
        {/* Dark gradient at top — ensures white navbar text is always readable */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0">
          {heroVideo ? (
            <>
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                poster={heroImage || undefined}
                className="absolute inset-0 w-full h-full object-contain"
              >
                <source src={heroVideo} type={heroVideoMime} />
              </video>
              {/* Fallback poster image (shows while video loads) */}
              {heroImage && (
                <Image
                  src={heroImage}
                  alt="Hero"
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                  unoptimized
                  style={{ zIndex: -1 }}
                />
              )}
            </>
          ) : heroImage ? (
            <Image
              src={heroImage}
              alt="Hero"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-[#181C23]" />
          )}
        </div>
      </section>

      <PhilosophySection />
      <ShowcaseSection projects={showcaseHero} />

      {/* ===== PORTFOLIO SECTION — YBA style ===== */}
      <section data-navbar-dark className="bg-white">
        <div className="flex flex-col lg:flex-row">

          {/* Sticky left panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:w-[34%] shrink-0 px-8 lg:pl-16 lg:pr-10 py-16 lg:py-20 lg:sticky lg:top-[90px] lg:self-start"
          >
            <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
              Portfolio
            </span>
            <h2 className="font-[family-name:var(--font-franklin-gothic)] font-bold text-[38px] lg:text-[54px] text-[#181C23] leading-[1.1] mt-5">
              Design that adds value
            </h2>
            <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#747779] leading-relaxed mt-5 max-w-[280px]">
              Each project is a collaboration between vision and craft — built to endure, designed to inspire.
            </p>

            {/* Project count */}
            {portfolioProjects.length > 0 && (
              <div className="mt-8 flex items-baseline gap-3 border-t border-[#E8E8E4] pt-6">
                <span className="font-[var(--font-playfair)] text-[42px] leading-none text-[#181C23]">
                  {String(portfolioProjects.length).padStart(2, '0')}
                </span>
                <span className="font-[var(--font-libre-franklin)] text-[11px] uppercase tracking-[3px] text-[#9A9A94]">
                  Projects
                </span>
              </div>
            )}

            <Link
              href="/projects"
              className="inline-flex items-center gap-3 mt-10 bg-[#181C23] hover:bg-[#B1A490] text-white px-7 py-4 rounded-full transition-colors duration-300"
            >
              <span className="block w-5 h-px bg-white/60" />
              <span className="font-[var(--font-libre-franklin)] text-[12px] uppercase tracking-[3px]">
                View All Projects
              </span>
            </Link>
          </motion.div>

          {/* Scrolling right */}
          <div className="flex-1 pt-16 lg:pt-20 pb-16 lg:pb-24 space-y-14 lg:space-y-20">
            {portfolioProjects.length === 0 ? (
              <p className="font-[var(--font-open-sans)] text-[15px] text-[#181C23]/30 py-20 px-8">
                No projects yet. Add projects from the CMS.
              </p>
            ) : (
              portfolioProjects.map((project, i) => (
                <PortfolioCard key={project.id} project={project} index={i} />
              ))
            )}
          </div>

        </div>
      </section>

      {/* Minimal section divider */}
      <div className="bg-white px-8 lg:px-16">
        <div className="max-w-[1290px] mx-auto">
          <div className="h-px bg-[#E8E8E4]" />
        </div>
      </div>

      <FounderTeamSection />

      <AwardsAccordion
        awards={(() => {
          const slotIds = [
            settings?.homepageAward1Id,
            settings?.homepageAward2Id,
            settings?.homepageAward3Id,
            settings?.homepageAward4Id,
            settings?.homepageAward5Id,
          ].filter(Boolean) as string[]
          if (slotIds.length > 0) {
            return slotIds
              .map(id => awards.find(a => a.id === id))
              .filter(Boolean) as typeof awards
          }
          return awards.slice(0, 5)
        })()}
        totalCount={awards.length}
        countries={settings?.awardsCountries || '12+'}
        since={settings?.awardsSince || '2001'}
      />

      <ClientsMarquee clients={clients} />

      <Footer />
    </>
  )
}
