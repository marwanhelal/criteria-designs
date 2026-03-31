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
      <section className="pt-[clamp(68px,6vw,100px)] bg-black">
        <div className="flex flex-col lg:flex-row">

          {/* Left info panel */}
          <div className="px-[clamp(1rem,4vw,7rem)] lg:w-[clamp(300px,28vw,450px)] shrink-0 flex flex-col gap-6 py-10 lg:py-14">

            {/* Category badge */}
            {project.category && (
              <div className="flex items-center gap-[10px] self-start">
                <span className="w-[5px] h-[5px] rounded-full bg-[#B1A490] shrink-0" />
                <span className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3.5px] uppercase text-[#B1A490]">
                  {CATEGORY_LABELS[project.category] || project.category}
                </span>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="font-[var(--font-playfair)] italic font-normal text-[clamp(28px,4vw,54px)] text-white leading-[1.1] tracking-[-0.01em]">
                {project.titleEn}
              </h1>
              {(project.yearCompleted || project.location) && (
                <p className="font-[var(--font-libre-franklin)] text-[10px] text-white/30 tracking-[2px] uppercase mt-3 flex items-center gap-2">
                  {project.yearCompleted && <span>{project.yearCompleted}</span>}
                  {project.yearCompleted && project.location && <span className="w-3 h-px bg-white/20 shrink-0" />}
                  {project.location && <span>{project.location}</span>}
                </p>
              )}
            </div>

            {/* Accent line */}
            <div className="w-8 h-[2px] bg-gradient-to-r from-[#B1A490] to-transparent" />

            {/* Description */}
            <p className="font-[var(--font-libre-franklin)] text-[13px] lg:text-[14px] text-white/50 leading-[2] tracking-[0.02em]">
              {project.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 300)}
              {project.descriptionEn.replace(/<[^>]*>/g, '').length > 300 ? '…' : ''}
            </p>

            {/* Developer */}
            {project.clientName && (
              <div className="pt-5 mt-2 border-t border-white/[0.06]">
                <p className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3px] uppercase text-white/25 mb-4">
                  Developer
                </p>
                <div className="flex items-center gap-4">
                  {project.clientLogo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.clientLogo}
                      alt={project.clientName}
                      className="h-[36px] w-auto max-w-[68px] object-contain shrink-0 opacity-80"
                    />
                  )}
                  {project.clientLogo && (
                    <div className="w-px h-6 bg-white/10 shrink-0" />
                  )}
                  <p className="font-[var(--font-libre-franklin)] text-[12px] text-white/50 tracking-[0.5px]">
                    {project.clientName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hero image — fills remaining width */}
          {heroImage ? (
            <HeroLightbox heroImage={heroImage} title={project.titleEn} />
          ) : (
            <div className="flex-1 h-[280px] lg:min-h-[474px] bg-[#1a1a1a] mx-8 lg:mx-0 flex items-center justify-center">
              <span className="text-[#555] text-sm">No image</span>
            </div>
          )}

        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {galleryImages.length > 0 && (
        <section className="px-[clamp(1rem,4vw,7rem)] pt-14 pb-[clamp(2.5rem,5vw,6rem)] bg-black border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-5 mb-10">
            <span className="font-[var(--font-playfair)] italic text-[17px] text-[#B1A490]">Gallery</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="font-[var(--font-libre-franklin)] text-[9px] tracking-[3px] uppercase text-white/20">{galleryImages.length} images</span>
          </div>
          <GalleryGrid images={galleryImages} projectTitle={project.titleEn} />
        </section>
      )}

      {/* ===== TIMELINE ===== */}
      {project.timeline.length > 0 && (
        <section className="py-[clamp(2.5rem,5vw,6rem)] px-[clamp(1rem,4vw,7rem)] bg-black border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-5 mb-16">
            <span className="font-[var(--font-playfair)] italic text-[17px] text-[#B1A490]">Design Process</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <TimelineSection entries={project.timeline} />
        </section>
      )}

      {/* ===== FINAL REVEAL ===== */}
      {(project.finalRevealTitleEn || project.finalRevealSubtitleEn || showcaseImages.length > 0) && (
        <section className="bg-black border-t border-[rgba(255,255,255,0.06)]">

          {(project.finalRevealTitleEn || project.finalRevealSubtitleEn) && (
            <div className="pt-[clamp(2.5rem,5vw,6rem)] pb-[60px] px-[clamp(1rem,4vw,7rem)]">
              <div className="flex items-center gap-5 mb-10">
                <span className="font-[var(--font-playfair)] italic text-[17px] text-[#B1A490]">Final Design</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              {project.finalRevealTitleEn && (
                <h2 className="font-[var(--font-playfair)] italic font-normal text-[clamp(26px,3.8vw,54px)] text-white leading-[1.12] tracking-[-0.01em] mb-5">
                  {project.finalRevealTitleEn}
                </h2>
              )}
              {project.finalRevealSubtitleEn && (
                <p className="font-[var(--font-libre-franklin)] text-[13px] lg:text-[15px] text-white/45 leading-[2] tracking-[0.02em] max-w-[580px]">
                  {project.finalRevealSubtitleEn}
                </p>
              )}
            </div>
          )}

          {/* Showcase images — parallax + curtain reveal */}
          {showcaseImages.length > 0 && (
            <div className={`px-[clamp(1rem,4vw,7rem)] ${!(project.finalRevealTitleEn || project.finalRevealSubtitleEn) ? 'pt-[clamp(2.5rem,5vw,6rem)]' : ''} pb-[clamp(2.5rem,5vw,6rem)]`}>
              <FinalRevealSection images={showcaseImages} projectTitle={project.titleEn} />
            </div>
          )}

        </section>
      )}

      <Footer dark />
    </>
  )
}
