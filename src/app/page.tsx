'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CeoBanner from '@/components/CeoBanner'
import PhilosophySection from '@/components/PhilosophySection'
import ShowcaseSection from '@/components/ShowcaseSection'
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection'
import { Building, Leaf, Headset, Users, Armchair, Shield, Quote } from 'lucide-react'

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

interface Service {
  id: string
  titleEn: string
  descriptionEn: string
  icon: string | null
  image: string | null
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
  showcaseProjects: ShowcaseProject[]
}

const iconMap: Record<string, typeof Building> = {
  Building, Leaf, Headset, Users, Armchair, Shield
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
  images: { url: string; alt: string | null }[]
}

function PortfolioCard({ project }: { project: PortfolioItem }) {
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Update cursor position directly on DOM — no React re-render, no lag
  const updateCursor = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect && cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX - rect.left}px`
      cursorRef.current.style.top = `${e.clientY - rect.top}px`
    }
  }

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      {/* Image — wide 21:9 cinematic ratio */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ aspectRatio: '21/9' }}
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
        {/* Cursor circle — position updated via ref (no re-renders) */}
        <div
          ref={cursorRef}
          className={`absolute pointer-events-none transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-[96px] h-[96px] rounded-full bg-[#181C23] flex items-center justify-center">
            <span className="font-[var(--font-libre-franklin)] text-[11px] text-white uppercase tracking-[2px]">View</span>
          </div>
        </div>
      </div>

      {/* Info below image */}
      <div className="px-8 lg:pr-16 pt-5 pb-5 border-b border-[#181C23]/10">
        <p className="font-[var(--font-open-sans)] text-[13px] text-[#666]">
          {CATEGORY_LABELS[project.category] || project.category}
        </p>
        <h3 className="font-[var(--font-merriweather)] text-[22px] lg:text-[28px] font-bold text-[#181C23] mt-2 inline-block border-b-2 border-transparent group-hover:border-[#B1A490] group-hover:text-[#B1A490] transition-colors duration-300">
          {project.titleEn}
        </h3>
      </div>
    </Link>
  )
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    fetch('/api/projects?status=PUBLISHED')
      .then(res => res.ok ? res.json() : [])
      .then(data => setProjects(data.slice(0, 6)))
      .catch(() => {})

    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => setServices(data.slice(0, 6)))
      .catch(() => {})

    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const displayProjects = projects.length > 0 ? projects : []
  const displayServices = services.length > 0 ? services : []
  // CMS-controlled portfolio list: use showcaseProjects if set, else all published
  const portfolioProjects = (settings?.showcaseProjects && settings.showcaseProjects.length > 0)
    ? settings.showcaseProjects
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
      <section className="relative w-full h-screen min-h-[500px]">
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
                className="absolute inset-0 w-full h-full object-cover"
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

      {/* ===== CEO BANNER ===== */}
      <PhilosophySection />
      <CeoBanner />
      <ShowcaseSection projects={settings?.showcaseProjects ?? []} />

      {/* ===== PORTFOLIO SECTION — YBA style ===== */}
      <section data-navbar-dark className="bg-white">
        <div className="flex flex-col lg:flex-row">

          {/* Sticky left panel */}
          <div className="lg:w-[34%] shrink-0 px-8 lg:pl-16 lg:pr-10 py-16 lg:py-20 lg:sticky lg:top-[90px] lg:self-start">
            <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[5px]">
              Portfolio
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[38px] lg:text-[54px] text-[#181C23] leading-[1.1] mt-5">
              Design that adds value
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 mt-10 bg-[#181C23] hover:bg-[#B1A490] text-white px-7 py-4 rounded-full transition-colors duration-300"
            >
              <span className="block w-5 h-px bg-white/60" />
              <span className="font-[var(--font-libre-franklin)] text-[12px] uppercase tracking-[3px]">
                View All Projects
              </span>
            </Link>
          </div>

          {/* Scrolling right */}
          <div className="flex-1 pt-16 lg:pt-20 pb-16 lg:pb-24 space-y-14 lg:space-y-20">
            {portfolioProjects.length === 0 ? (
              <p className="font-[var(--font-open-sans)] text-[15px] text-[#181C23]/30 py-20 px-8">
                No projects yet. Add projects from the CMS.
              </p>
            ) : (
              portfolioProjects.map((project) => (
                <PortfolioCard key={project.id} project={project} />
              ))
            )}
          </div>

        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="bg-[#181C23] py-[80px] lg:py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <AnimatedSection>
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              why choose us
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[28px] lg:text-[36px] text-white leading-[40px] lg:leading-[48px] mt-4 max-w-[524px]">
              Making living spaces affordable
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 mt-14" staggerDelay={0.15}>
            {displayServices.length > 0 ? (
              displayServices.map((service) => {
                const IconComponent = service.icon && iconMap[service.icon]
                  ? iconMap[service.icon]
                  : Building
                return (
                  <StaggerItem key={service.id}>
                    <div className="flex flex-col">
                      <div className="w-[90px] h-[90px] rounded-full bg-white/10 flex items-center justify-center">
                        <IconComponent size={36} className="text-[#B1A490]" />
                      </div>
                      <h3 className="font-[var(--font-merriweather)] text-[20px] text-white leading-[28px] mt-8">
                        {service.titleEn}
                      </h3>
                      <p className="font-[var(--font-open-sans)] text-[16px] text-white/60 leading-[30px] mt-4 max-w-[366px]">
                        {service.descriptionEn}
                      </p>
                    </div>
                  </StaggerItem>
                )
              })
            ) : (
              [
                { icon: Building, title: 'High Quality Products', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
                { icon: Leaf, title: 'Natural Environment', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
                { icon: Headset, title: 'Professional Services', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
                { icon: Users, title: 'Humanitarian Community', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
                { icon: Armchair, title: 'Comprehensive Amenities', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
                { icon: Shield, title: 'Absolute Security', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
              ].map((service, idx) => (
                <StaggerItem key={idx}>
                  <div className="flex flex-col">
                    <div className="w-[90px] h-[90px] rounded-full bg-white/10 flex items-center justify-center">
                      <service.icon size={36} className="text-[#B1A490]" />
                    </div>
                    <h3 className="font-[var(--font-merriweather)] text-[20px] text-white leading-[28px] mt-8">
                      {service.title}
                    </h3>
                    <p className="font-[var(--font-open-sans)] text-[16px] text-white/60 leading-[30px] mt-4 max-w-[366px]">
                      {service.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="bg-[#1E2330] py-[70px] lg:py-[80px] px-8">
        <AnimatedSection>
          <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="relative shrink-0">
              <div className="relative w-[140px] h-[140px] lg:w-[170px] lg:h-[170px] rounded-full bg-gradient-to-br from-[#B1A490]/30 to-white/10 overflow-hidden flex items-center justify-center">
                <Users size={48} className="text-[#B1A490]/40" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-[48px] h-[48px] rounded-full bg-[#B1A490] flex items-center justify-center">
                <Quote size={20} className="text-white" />
              </div>
            </div>

            <div>
              <p className="font-[var(--font-merriweather)] text-[20px] lg:text-[24px] text-white leading-[36px] lg:leading-[46px] italic">
                &ldquo;Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut&rdquo;
              </p>
              <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] mt-8">
                Hesham helal / Ceo &amp; founder
              </p>
              <div className="flex gap-2 mt-8">
                <div className="w-[16px] h-[4px] rounded-full bg-[#B1A490]" />
                <div className="w-[16px] h-[4px] rounded-full bg-[#B1A490]/30" />
                <div className="w-[16px] h-[4px] rounded-full bg-[#B1A490]/30" />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ===== CAREER / JOIN US SECTION ===== */}
      <section className="bg-[#181C23] py-[80px] lg:py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row gap-12">
          <AnimatedSection direction="left" className="w-full lg:w-[520px] shrink-0">
            <div className="relative w-full h-[350px] lg:h-[460px] rounded-lg overflow-hidden bg-gradient-to-br from-[#B1A490]/20 via-[#B1A490]/10 to-white/5 flex items-center justify-center">
              <Users size={80} className="text-[#B1A490]/30" />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2} className="flex flex-col justify-center">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Join with Us
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[28px] lg:text-[36px] text-white leading-[40px] lg:leading-[48px] mt-4 max-w-[547px]">
              Expand career and make your move to housale
            </h2>
            <p className="font-[var(--font-open-sans)] text-[16px] text-white/60 leading-[30px] mt-8 max-w-[526px]">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/20 transition-colors w-fit mt-10"
            >
              Get Started
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
