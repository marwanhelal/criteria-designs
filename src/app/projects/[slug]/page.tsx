import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroLightbox from '@/components/HeroLightbox'
import GalleryGrid from '@/components/GalleryGrid'
import TimelineSection from '@/components/TimelineSection'
import FinalRevealSection from '@/components/FinalRevealSection'

interface Props {
  params: Promise<{ slug: string }>
}

const ff = '"Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", var(--font-libre-franklin), Arial, sans-serif'

const CATEGORY_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'Commercial',
  INTERIOR: 'Interior',
  URBAN: 'Urban Planning',
  LANDSCAPE: 'Landscape',
  RENOVATION: 'Renovation',
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project: any = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      timeline: { orderBy: { order: 'asc' } }
    }
  })

  if (!project || project.status !== 'PUBLISHED') {
    notFound()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heroImage = (project.images.find((img: any) => img.section === 'hero') ?? project.images[0])?.url ?? null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const galleryImages = project.images.filter((img: any) => img.section === 'gallery')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showcaseImages = project.images.filter((img: any) => img.section === 'final_reveal')

  return (
    <>
      <Navbar />

      {/* ===== PROJECT HEADER ===== */}
      <section className="pt-[90px] bg-black">
        <div className="flex flex-col lg:flex-row">

          {/* Left info panel */}
          <div className="px-8 lg:pl-[84px] lg:pr-10 lg:w-[400px] shrink-0 flex flex-col justify-between py-10 lg:py-14 lg:h-[474px]">

            <div className="flex flex-col gap-6">
              {/* Category badge */}
              {project.category && (
                <span className="font-[var(--font-open-sans)] self-start text-[10px] tracking-[2px] uppercase text-[#B1A490] border border-[#B1A490]/40 px-3 py-[5px] rounded-full">
                  {CATEGORY_LABELS[project.category] || project.category}
                </span>
              )}

              {/* Title */}
              <div>
                <h1
                  style={{ fontFamily: ff }}
                  className="text-[40px] lg:text-[48px] text-white font-normal leading-none"
                >
                  {project.titleEn}
                </h1>
                {(project.yearCompleted || project.location) && (
                  <p className="font-[var(--font-open-sans)] text-[11px] text-[rgba(255,255,255,0.38)] tracking-[1.5px] uppercase mt-3">
                    {[project.yearCompleted, project.location].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>

              {/* Accent line */}
              <div className="w-6 h-px bg-[#B1A490]/40" />

              {/* Description */}
              <p className="font-[var(--font-open-sans)] text-[14px] lg:text-[15px] text-[rgba(255,255,255,0.62)] leading-[1.85]">
                {project.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 300)}
                {project.descriptionEn.replace(/<[^>]*>/g, '').length > 300 ? '…' : ''}
              </p>
            </div>

            {/* Developer */}
            {project.clientName && (
              <div className="pt-6 mt-8 border-t border-[rgba(255,255,255,0.07)]">
                <p className="font-[var(--font-open-sans)] text-[10px] tracking-[2.5px] uppercase text-[rgba(255,255,255,0.3)] mb-4">
                  Developer
                </p>
                <div className="flex items-center gap-3">
                  {project.clientLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.clientLogo}
                      alt={project.clientName}
                      className="max-h-[52px] w-auto object-contain shrink-0"
                    />
                  ) : (
                    <span className="font-[var(--font-open-sans)] text-[12px] text-[rgba(255,255,255,0.5)]">
                      {project.clientName}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hero image — fills remaining width */}
          {heroImage ? (
            <HeroLightbox heroImage={heroImage} title={project.titleEn} />
          ) : (
            <div className="flex-1 h-[280px] lg:h-[474px] bg-[#1a1a1a] mx-8 lg:mx-0 flex items-center justify-center">
              <span className="text-[#555] text-sm">No image</span>
            </div>
          )}

        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {galleryImages.length > 0 && (
        <section className="px-8 lg:px-[84px] pt-14 pb-[80px] bg-black border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-5 mb-10">
            <span className="font-[var(--font-open-sans)] text-[11px] tracking-[2.5px] uppercase text-[#B1A490]">Gallery</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
          </div>
          <GalleryGrid images={galleryImages} projectTitle={project.titleEn} />
        </section>
      )}

      {/* ===== TIMELINE ===== */}
      {project.timeline.length > 0 && (
        <section className="py-[80px] px-8 lg:px-[84px] bg-black border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-5 mb-16">
            <span className="font-[var(--font-open-sans)] text-[11px] tracking-[2.5px] uppercase text-[#B1A490]">Design Process</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
          </div>
          <TimelineSection entries={project.timeline} />
        </section>
      )}

      {/* ===== FINAL REVEAL ===== */}
      {(project.finalRevealTitleEn || project.finalRevealSubtitleEn || showcaseImages.length > 0) && (
        <section className="bg-black border-t border-[rgba(255,255,255,0.06)]">

          {(project.finalRevealTitleEn || project.finalRevealSubtitleEn) && (
            <div className="pt-[80px] pb-[60px] px-8 lg:px-[84px]">
              <div className="flex items-center gap-5 mb-10">
                <span className="font-[var(--font-open-sans)] text-[11px] tracking-[2.5px] uppercase text-[#B1A490]">Final Design</span>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
              </div>
              {project.finalRevealTitleEn && (
                <h2
                  style={{ fontFamily: ff }}
                  className="text-[36px] lg:text-[52px] text-white font-normal leading-none tracking-[1px] mb-5"
                >
                  {project.finalRevealTitleEn}
                </h2>
              )}
              {project.finalRevealSubtitleEn && (
                <p className="font-[var(--font-open-sans)] text-[14px] lg:text-[16px] text-[rgba(255,255,255,0.55)] leading-[1.9] max-w-[640px]">
                  {project.finalRevealSubtitleEn}
                </p>
              )}
            </div>
          )}

          {/* Showcase images — parallax + curtain reveal */}
          {showcaseImages.length > 0 && (
            <div className={`px-8 lg:px-[84px] ${!(project.finalRevealTitleEn || project.finalRevealSubtitleEn) ? 'pt-[80px]' : ''} pb-[80px]`}>
              <FinalRevealSection images={showcaseImages} projectTitle={project.titleEn} />
            </div>
          )}

        </section>
      )}

      <Footer />
    </>
  )
}
