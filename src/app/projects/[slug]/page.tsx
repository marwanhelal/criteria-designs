import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroLightbox from '@/components/HeroLightbox'
import GalleryGrid from '@/components/GalleryGrid'
import TimelineSection from '@/components/TimelineSection'

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

  const moreProjects = await prisma.project.findMany({
    where: { status: 'PUBLISHED', id: { not: project.id } },
    include: { images: { orderBy: { order: 'asc' } } },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

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
        <section className="px-8 lg:px-[84px] pt-[9px] pb-[80px] bg-black">
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

          {/* Showcase images — 1272×716 per Figma, padded to match content margins */}
          {showcaseImages.length > 0 && (
            <div className={`space-y-[3px] px-8 lg:px-[84px] ${!(project.finalRevealTitleEn || project.finalRevealSubtitleEn) ? 'pt-[80px]' : ''} pb-[80px]`}>
              {showcaseImages.map((image: { id: string; url: string; alt?: string }) => (
                <div
                  key={image.id}
                  className="relative w-full overflow-hidden bg-[#1a1a1a]"
                  style={{ aspectRatio: '1272/716' }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || project.titleEn}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1272px"
                    className="object-cover"
                    unoptimized
                    quality={100}
                  />
                </div>
              ))}
            </div>
          )}

        </section>
      )}

      {/* ===== MORE PROJECTS ===== */}
      {moreProjects.length > 0 && (
        <section data-navbar-dark className="bg-[#F5F0EB] py-[80px] px-8 lg:px-[83px]">
          <div className="max-w-[1290px] mx-auto">

            <h2
              style={{ fontFamily: ff }}
              className="text-[28px] lg:text-[36px] text-[#111111] font-normal leading-none tracking-[3px] text-center mb-14"
            >
              More Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreProjects.map((p) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const thumb = (p.images.find((img: any) => img.section === 'hero') ?? p.images[0])?.url ?? null
                return (
                  <Link key={p.id} href={`/projects/${p.slug}`} className="group block">
                    <div className="overflow-hidden bg-gray-200">
                      <div className="relative h-[280px] overflow-hidden">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={p.titleEn}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300" />
                        )}
                      </div>
                      <div className="pt-4 pb-2 px-1">
                        <p
                          style={{ fontFamily: ff }}
                          className="text-[11px] text-[#B1A490] uppercase tracking-[2.5px]"
                        >
                          {p.location || p.category}
                        </p>
                        <h3
                          style={{ fontFamily: ff }}
                          className="text-[22px] text-[#111111] font-normal leading-tight tracking-[1px] mt-1"
                        >
                          {p.titleEn}
                        </h3>
                        {p.yearCompleted && (
                          <p
                            style={{ fontFamily: ff }}
                            className="text-[15px] text-[#888888] mt-2 tracking-[0.5px]"
                          >
                            {p.yearCompleted}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="text-center mt-14">
              <Link
                href="/projects"
                style={{ fontFamily: ff }}
                className="inline-flex items-center text-[13px] text-[#111111] uppercase tracking-[3px] border border-[#111111] px-[44px] py-[16px] hover:bg-[#111111] hover:text-white transition-colors duration-300"
              >
                All Projects
              </Link>
            </div>

          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
