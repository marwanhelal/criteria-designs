'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection'

interface Project {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  descriptionEn: string
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

      {/* ===== HERO BANNER ===== */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/projects-hero.jpg"
            alt="Our Projects"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(24, 28, 35, 0.7) 0%, rgba(24, 28, 35, 0.5) 100%)',
            }}
          />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8">
          <AnimatedSection>
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              What we create
            </span>
            <h1 className="font-[var(--font-merriweather)] text-[40px] lg:text-[56px] text-white leading-[52px] lg:leading-[68px] mt-4 max-w-[700px]">
              Our Projects
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FILTER & PROJECTS ===== */}
      <section className="py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <AnimatedSection className="flex flex-wrap gap-4 mb-16 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`font-[var(--font-libre-franklin)] text-[14px] uppercase tracking-[0.56px] leading-[24px] px-[30px] py-[12px] rounded-[30px] border-2 transition-colors ${
                  activeCategory === cat.value
                    ? 'border-[#B1A490] bg-[#B1A490] text-white'
                    : 'border-[#B1A490] text-[#181C23] hover:bg-[#B1A490]/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666]">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666]">No projects found.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {filteredProjects.map((project) => (
                <StaggerItem key={project.id}>
                  <Link href={`/projects/${project.slug}`} className="group block">
                    <div className="rounded-lg overflow-hidden bg-gray-200">
                      {/* Fixed 380px image height */}
                      <div className="relative h-[380px] overflow-hidden">
                        {project.images?.length > 0 ? (
                          <Image
                            src={project.images[0].url}
                            alt={project.titleEn}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-[#181C23] p-8">
                        <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px]">
                          {project.location || project.category}
                        </p>
                        <h3 className="font-[var(--font-merriweather)] text-[24px] text-white leading-[34px] mt-2">
                          {project.titleEn}
                        </h3>
                        {project.yearCompleted && (
                          <p className="font-[var(--font-libre-franklin)] text-[16px] text-white/60 mt-4">
                            {project.yearCompleted}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
