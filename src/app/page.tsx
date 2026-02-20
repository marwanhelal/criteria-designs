'use client'

import { useState, useEffect } from 'react'
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
  const featuredProject = displayProjects.length > 0 ? displayProjects[0] : null
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

      {/* ===== PROJECTS SECTION ===== */}
      <section className="bg-[#181C23] py-[80px] lg:py-[120px] px-8">
        <div className="max-w-[1290px] mx-auto">

          {/* Header row: big text left + featured project right */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            {/* Left: label + large headline + CTA */}
            <AnimatedSection direction="left" className="lg:w-[400px] shrink-0 lg:pt-6">
              <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[5px]">
                Portfolio
              </span>
              <h2 className="font-[var(--font-merriweather)] text-[40px] lg:text-[58px] text-white leading-[1.1] mt-5 font-bold">
                Designing spaces that inspire.
              </h2>
              <Link
                href="/projects"
                className="inline-flex items-center gap-4 font-[var(--font-libre-franklin)] text-[13px] text-white uppercase tracking-[3px] mt-10 group"
              >
                <span className="block w-8 h-px bg-[#B1A490] group-hover:w-14 transition-all duration-300" />
                View All Projects
              </Link>
            </AnimatedSection>

            {/* Right: featured project */}
            {featuredProject ? (
              <AnimatedSection direction="right" className="flex-1 w-full">
                <Link href={`/projects/${featuredProject.slug}`} className="group block">
                  <div className="relative h-[380px] lg:h-[500px] overflow-hidden rounded-lg">
                    {featuredProject.images?.[0] ? (
                      <Image
                        src={featuredProject.images[0].url}
                        alt={featuredProject.titleEn}
                        fill
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1E2330]" />
                    )}
                    {/* Circular View button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-24 h-24 rounded-full bg-[#B1A490] flex items-center justify-center">
                        <span className="font-[var(--font-libre-franklin)] text-[12px] text-white uppercase tracking-[2px]">View</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-5">
                    <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[4px]">
                      {featuredProject.category}
                    </p>
                    <h3 className="font-[var(--font-merriweather)] text-[22px] text-white mt-2 group-hover:text-[#B1A490] transition-colors duration-300 border-b border-white/10 pb-4">
                      {featuredProject.titleEn}
                    </h3>
                  </div>
                </Link>
              </AnimatedSection>
            ) : (
              <div className="flex-1 flex items-center justify-center py-20">
                <p className="font-[var(--font-open-sans)] text-[16px] text-white/40">
                  No projects yet. Add projects from the CMS.
                </p>
              </div>
            )}
          </div>

          {/* 3 more projects below in a grid */}
          {displayProjects.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
              {displayProjects.slice(1, 4).map((project, idx) => (
                <AnimatedSection key={project.id} direction="up" delay={idx * 0.12}>
                  <Link href={`/projects/${project.slug}`} className="group block">
                    <div className="relative h-[260px] overflow-hidden rounded-lg">
                      {project.images?.[0] ? (
                        <Image
                          src={project.images[0].url}
                          alt={project.titleEn}
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1E2330]" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-[#B1A490] flex items-center justify-center">
                          <span className="font-[var(--font-libre-franklin)] text-[10px] text-white uppercase tracking-[1px]">View</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="font-[var(--font-libre-franklin)] text-[11px] text-[#B1A490] uppercase tracking-[4px]">
                        {project.category}
                      </p>
                      <h3 className="font-[var(--font-merriweather)] text-[18px] text-white mt-1 group-hover:text-[#B1A490] transition-colors duration-300 border-b border-white/10 pb-3">
                        {project.titleEn}
                      </h3>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-14 pt-12 border-t border-white/10">
            {[
              { number: '+500', label: 'Complete projects' },
              { number: '57', label: 'Projects under construction' },
              { number: '42', label: 'Projects underway' },
              { number: '25', label: 'Years of experience' },
            ].map((stat, idx) => (
              <StaggerItem key={idx}>
                <div className="flex items-center gap-4">
                  <span className="font-[var(--font-merriweather)] text-[36px] lg:text-[48px] text-white leading-[58px]">
                    {stat.number}
                  </span>
                  <span className="font-[var(--font-open-sans)] text-[14px] text-white/60 leading-[24px] max-w-[100px]">
                    {stat.label}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Large Featured Image - Fixed 1290x800 aspect ratio */}
          {heroImage && (
            <AnimatedSection delay={0.2} className="mt-14">
              <div className="relative h-[350px] lg:h-[560px] rounded-lg overflow-hidden">
                <Image
                  src={heroImage}
                  alt="Featured project"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1290px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </AnimatedSection>
          )}
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
