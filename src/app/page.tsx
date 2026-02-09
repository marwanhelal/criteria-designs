'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection'
import { ChevronLeft, ChevronRight, Building, Leaf, Headset, Users, Armchair, Shield, Quote } from 'lucide-react'

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

interface Settings {
  companyNameEn: string
  seoDescriptionEn: string | null
  logo: string | null
  heroImage: string | null
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
  const heroImage = settings?.heroImage || featuredProject?.images?.[0]?.url || null

  const scrollProjects = (dir: 'left' | 'right') => {
    const container = document.getElementById('project-scroll')
    if (container) {
      container.scrollBy({ left: dir === 'right' ? 440 : -440, behavior: 'smooth' })
    }
  }

  return (
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="pt-[80px] px-[10px]">
        <div className="relative h-[500px] md:h-[700px] lg:h-[806px] overflow-hidden rounded-[10px]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Hero"
              fill
              sizes="(max-width: 768px) 100vw, calc(100vw - 20px)"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-[#D9D9D9]" />
          )}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row gap-16">
          <AnimatedSection direction="left" className="w-full lg:w-[633px] shrink-0">
            <div className="relative w-full h-[400px] lg:h-[630px] rounded-lg overflow-hidden bg-gradient-to-br from-[#B1A490]/20 via-[#B1A490]/10 to-[#181C23]/10 flex items-center justify-center">
              <Building size={120} className="text-[#B1A490]/30" />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2} className="flex flex-col justify-center">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Who we are
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[547px]">
              We build quality real estate projects since 1978
            </h2>
            <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-8 max-w-[526px]">
              {settings?.seoDescriptionEn || 'Criteria Designs is a leading architecture and interior design firm dedicated to creating spaces that inspire. With decades of experience, we deliver exceptional quality in every project.'}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors w-fit mt-10"
            >
              more About us
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section className="bg-[#181C23] py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            <AnimatedSection direction="left" className="lg:w-[400px] shrink-0">
              <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
                What we create
              </span>
              <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-white leading-[48px] lg:leading-[56px] mt-4">
                Explore latest projects
              </h2>
              <Link
                href="/projects"
                className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/20 transition-colors w-fit mt-10"
              >
                all projects
              </Link>
            </AnimatedSection>

            {/* Dynamic Project Cards - Fixed 414x380 aspect ratio */}
            <div id="project-scroll" className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {displayProjects.length > 0 ? (
                displayProjects.map((project, idx) => (
                  <AnimatedSection key={project.id} direction="right" delay={idx * 0.1}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="min-w-[300px] lg:min-w-[414px] bg-[#1E2330] rounded-lg overflow-hidden group cursor-pointer shrink-0 block"
                    >
                      <div className="relative h-[380px] overflow-hidden">
                        {project.images?.length > 0 ? (
                          <Image
                            src={project.images[0].url}
                            alt={project.titleEn}
                            fill
                            sizes="414px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-8">
                        <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px]">
                          {project.location || project.category}
                        </p>
                        <h3 className="font-[var(--font-merriweather)] text-[24px] text-white leading-[34px] mt-2">
                          {project.titleEn}
                        </h3>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))
              ) : (
                <div className="flex items-center justify-center w-full py-20">
                  <p className="font-[var(--font-open-sans)] text-[16px] text-white/40">
                    No projects yet. Add projects from the CMS.
                  </p>
                </div>
              )}
            </div>
          </div>

          {displayProjects.length > 2 && (
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => scrollProjects('left')}
                className="w-[60px] h-[60px] rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scrollProjects('right')}
                className="w-[60px] h-[60px] rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/10">
            {[
              { number: '+500', label: 'Complete projects' },
              { number: '57', label: 'Projects under construction' },
              { number: '42', label: 'Projects underway' },
              { number: '25', label: 'Years of experience' },
            ].map((stat, idx) => (
              <StaggerItem key={idx}>
                <div className="flex items-center gap-4">
                  <span className="font-[var(--font-merriweather)] text-[48px] lg:text-[64px] text-white leading-[78px]">
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
            <AnimatedSection delay={0.2} className="mt-20">
              <div className="relative h-[400px] lg:h-[800px] rounded-lg overflow-hidden">
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
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <AnimatedSection>
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              why choose us
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[524px]">
              Making living spaces affordable
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mt-16" staggerDelay={0.15}>
            {displayServices.length > 0 ? (
              displayServices.map((service) => {
                const IconComponent = service.icon && iconMap[service.icon]
                  ? iconMap[service.icon]
                  : Building
                return (
                  <StaggerItem key={service.id}>
                    <div className="flex flex-col">
                      <div className="w-[120px] h-[120px] rounded-full bg-[#F5F0EB] flex items-center justify-center">
                        <IconComponent size={50} className="text-[#B1A490]" />
                      </div>
                      <h3 className="font-[var(--font-merriweather)] text-[20px] text-[#181C23] leading-[28px] mt-8">
                        {service.titleEn}
                      </h3>
                      <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4 max-w-[366px]">
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
                    <div className="w-[120px] h-[120px] rounded-full bg-[#F5F0EB] flex items-center justify-center">
                      <service.icon size={50} className="text-[#B1A490]" />
                    </div>
                    <h3 className="font-[var(--font-merriweather)] text-[20px] text-[#181C23] leading-[28px] mt-8">
                      {service.title}
                    </h3>
                    <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4 max-w-[366px]">
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
      <section className="bg-[#F5F0EB] py-[100px] px-8">
        <AnimatedSection>
          <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="relative shrink-0">
              <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] rounded-full bg-gradient-to-br from-[#B1A490]/30 to-[#181C23]/20 overflow-hidden flex items-center justify-center">
                <Users size={64} className="text-[#B1A490]/40" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-[48px] h-[48px] rounded-full bg-[#B1A490] flex items-center justify-center">
                <Quote size={20} className="text-white" />
              </div>
            </div>

            <div>
              <p className="font-[var(--font-merriweather)] text-[20px] lg:text-[24px] text-[#181C23] leading-[36px] lg:leading-[46px] italic">
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
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row gap-16">
          <AnimatedSection direction="left" className="w-full lg:w-[633px] shrink-0">
            <div className="relative w-full h-[400px] lg:h-[630px] rounded-lg overflow-hidden bg-gradient-to-br from-[#B1A490]/20 via-[#B1A490]/10 to-[#181C23]/10 flex items-center justify-center">
              <Users size={120} className="text-[#B1A490]/30" />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2} className="flex flex-col justify-center">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Join with Us
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[547px]">
              Expand career and make your move to housale
            </h2>
            <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-8 max-w-[526px]">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors w-fit mt-10"
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
