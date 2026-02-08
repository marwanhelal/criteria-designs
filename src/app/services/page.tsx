'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection'
import { Building, Leaf, Headset, Users, Armchair, Shield } from 'lucide-react'

interface Service {
  id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  image: string | null
  icon: string | null
}

const defaultIcons: Record<string, typeof Building> = {
  Building, Leaf, Headset, Users, Armchair, Shield
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => setServices(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />

      {/* ===== HERO BANNER ===== */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#181C23] via-[#2a2f3a] to-[#181C23]">
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
              Why choose us
            </span>
            <h1 className="font-[var(--font-merriweather)] text-[40px] lg:text-[56px] text-white leading-[52px] lg:leading-[68px] mt-4 max-w-[700px]">
              Our Services
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              What we offer
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[524px] mx-auto">
              Making living spaces affordable
            </h2>
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666]">Loading services...</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16" staggerDelay={0.15}>
              {(services.length > 0 ? services : [
                { id: '1', titleEn: 'Architectural Design', descriptionEn: 'Creating innovative and functional building designs that blend aesthetics with practicality for residential and commercial spaces.', icon: 'Building', image: null, titleAr: '' },
                { id: '2', titleEn: 'Interior Design', descriptionEn: 'Transforming interior spaces with thoughtful design that reflects your style while maximizing comfort and functionality.', icon: 'Leaf', image: null, titleAr: '' },
                { id: '3', titleEn: 'Urban Planning', descriptionEn: 'Developing comprehensive urban plans that create sustainable, livable communities with smart infrastructure.', icon: 'Headset', image: null, titleAr: '' },
                { id: '4', titleEn: 'Landscape Design', descriptionEn: 'Designing outdoor spaces that complement architecture and create harmonious connections between buildings and nature.', icon: 'Users', image: null, titleAr: '' },
                { id: '5', titleEn: 'Renovation', descriptionEn: 'Breathing new life into existing structures through thoughtful renovation that preserves character while adding modern functionality.', icon: 'Armchair', image: null, titleAr: '' },
                { id: '6', titleEn: 'Project Management', descriptionEn: 'End-to-end project management ensuring your vision is realized on time and within budget with the highest quality standards.', icon: 'Shield', image: null, titleAr: '' },
              ]).map((service) => {
                const IconComponent = service.icon && defaultIcons[service.icon]
                  ? defaultIcons[service.icon]
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
              })}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section className="bg-[#181C23] py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              How we work
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-white leading-[48px] lg:leading-[56px] mt-4">
              Our Process
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.15}>
            {[
              { step: '01', title: 'Consultation', desc: 'We start by understanding your vision, requirements, and goals through detailed discussions.' },
              { step: '02', title: 'Design', desc: 'Our team develops creative concepts and detailed designs that bring your vision to life.' },
              { step: '03', title: 'Development', desc: 'We execute the approved designs with precision, using premium materials and techniques.' },
              { step: '04', title: 'Delivery', desc: 'Final delivery with thorough quality checks ensuring everything meets our high standards.' },
            ].map((item, idx) => (
              <StaggerItem key={idx}>
                <div className="text-center">
                  <span className="font-[var(--font-merriweather)] text-[64px] text-[#B1A490]/30 leading-[64px] block">
                    {item.step}
                  </span>
                  <h3 className="font-[var(--font-merriweather)] text-[20px] text-white leading-[28px] mt-6">
                    {item.title}
                  </h3>
                  <p className="font-[var(--font-open-sans)] text-[16px] text-white/60 leading-[30px] mt-4">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-[140px] px-8">
        <AnimatedSection className="max-w-[1290px] mx-auto text-center">
          <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] max-w-[600px] mx-auto">
            Let&apos;s build something amazing together
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors mt-10"
          >
            Start a Project
          </Link>
        </AnimatedSection>
      </section>

      <Footer />
    </>
  )
}
