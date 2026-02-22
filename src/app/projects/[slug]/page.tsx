import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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

      {/* ===== PROJECT HEADER — dark bg, white text (Figma exact) ===== */}
      <section className="pt-[120px] pb-0 bg-black">
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-[49px]">

          {/* Left panel — w-382 h-474 per Figma, padded only on left */}
          <div className="px-8 lg:pl-[84px] lg:pr-0 lg:w-[382px] shrink-0 flex flex-col justify-between pb-8 lg:pb-0 lg:h-[474px]">

            {/* Top: title + year + description */}
            <div className="flex flex-col gap-[22px]">
              <div>
                <h1
                  style={{ fontFamily: ff }}
                  className="text-[36px] lg:text-[40px] text-white font-normal leading-none"
                >
                  {project.titleEn}
                </h1>
                {project.yearCompleted && (
                  <p
                    style={{ fontFamily: ff }}
                    className="text-[19px] text-white mt-[6px] tracking-[0.95px]"
                  >
                    {project.yearCompleted}
                  </p>
                )}
              </div>
              <p
                style={{ fontFamily: ff }}
                className="text-[17px] lg:text-[19px] text-white tracking-[0.95px] leading-[1.15]"
              >
                {project.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 300)}
                {project.descriptionEn.replace(/<[^>]*>/g, '').length > 300 ? '...' : ''}
              </p>
            </div>

            {/* Bottom: developer — Figma: gap-12, size-91 rounded-8 */}
            {project.clientName && (
              <div className="flex flex-col gap-[12px] mt-8 lg:mt-0">
                <span
                  style={{ fontFamily: ff }}
                  className="text-[19px] text-white tracking-[0.95px] uppercase"
                >
                  Developer
                </span>
                <div className="w-[91px] h-[91px] rounded-[8px] overflow-hidden shrink-0">
                  {project.clientLogo ? (
                    <Image
                      src={project.clientLogo}
                      alt={project.clientName}
                      width={91}
                      height={91}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-[#333] flex items-center justify-center">
                      <span style={{ fontFamily: ff }} className="text-[12px] text-white text-center px-2">
                        {project.clientName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right — Hero Image extends to right viewport edge */}
          {heroImage ? (
            <HeroLightbox heroImage={heroImage} title={project.titleEn} />
          ) : (
            <div className="flex-1 relative h-[280px] lg:h-[474px] bg-[#1a1a1a] mx-8 lg:mx-0 flex items-center justify-center">
              <span className="text-[#555] text-sm">No image</span>
            </div>
          )}

        </div>
      </section>

      {/* ===== GALLERY GRID — dark bg, 414×233 per Figma, click-to-zoom ===== */}
      {galleryImages.length > 0 && (
        <section className="px-8 lg:px-[84px] pt-6 pb-[80px] bg-black">
          <GalleryGrid images={galleryImages} projectTitle={project.titleEn} />
        </section>
      )}

      {/* ===== PROJECT TIMELINE — animated, dark bg ===== */}
      {project.timeline.length > 0 && (
        <section className="py-[80px] px-8 lg:px-[84px] bg-black">
          <h2
            style={{ fontFamily: ff }}
            className="text-[42px] lg:text-[64px] text-white font-normal leading-none tracking-[3.2px] mb-[80px]"
          >
            project time-line
          </h2>
          <TimelineSection entries={project.timeline} />
        </section>
      )}

      {/* ===== FINAL DESIGN REVEAL — dark bg, full-width images ===== */}
      {(project.finalRevealTitleEn || project.finalRevealSubtitleEn || showcaseImages.length > 0) && (
        <section className="bg-black border-t border-[rgba(255,255,255,0.1)]">

          {(project.finalRevealTitleEn || project.finalRevealSubtitleEn) && (
            <div className="pt-[80px] pb-[60px] px-8 lg:px-[84px]">
              {project.finalRevealTitleEn && (
                <h2
                  style={{ fontFamily: ff }}
                  className="text-[42px] lg:text-[64px] text-white font-normal leading-none tracking-[3.2px] mb-6"
                >
                  {project.finalRevealTitleEn}
                </h2>
              )}
              {project.finalRevealSubtitleEn && (
                <p
                  style={{ fontFamily: ff }}
                  className="text-[18px] lg:text-[32px] text-[rgba(255,255,255,0.75)] font-normal leading-[1.3] tracking-[0.5px] max-w-[900px]"
                >
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
