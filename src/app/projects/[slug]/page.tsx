import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

      {/* ===== PROJECT HEADER ===== */}
      {/* data-navbar-dark tells the navbar it's over a light section → use dark text */}
      <section data-navbar-dark className="pt-[120px] pb-[40px] px-8 lg:px-[83px] bg-white">
        <div className="max-w-[1290px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left panel */}
            <div className="lg:w-[382px] shrink-0 flex flex-col justify-between py-4">
              <div>
                <h1
                  style={{ fontFamily: ff }}
                  className="text-[36px] lg:text-[40px] text-[#111111] font-normal leading-none"
                >
                  {project.titleEn}
                </h1>

                {project.yearCompleted && (
                  <p
                    style={{ fontFamily: ff }}
                    className="text-[19px] text-[#888888] mt-3 tracking-[0.95px]"
                  >
                    {project.yearCompleted}
                  </p>
                )}

                <p
                  style={{ fontFamily: ff }}
                  className="text-[17px] lg:text-[19px] text-[#555555] mt-6 leading-[1.6] tracking-[0.3px]"
                >
                  {project.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 300)}
                  {project.descriptionEn.replace(/<[^>]*>/g, '').length > 300 ? '...' : ''}
                </p>
              </div>

              {project.clientName && (
                <div className="mt-10 pt-6 border-t border-[#E5E5E5]">
                  <span
                    style={{ fontFamily: ff }}
                    className="text-[11px] text-[#999999] uppercase tracking-[3px]"
                  >
                    Developer
                  </span>
                  <div className="mt-4">
                    {project.clientLogo ? (
                      <div className="inline-block border border-[#DDDDDD] p-3 bg-white">
                        <Image
                          src={project.clientLogo}
                          alt={project.clientName}
                          width={120}
                          height={44}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <p style={{ fontFamily: ff }} className="text-[18px] text-[#111111]">
                        {project.clientName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right — Hero Image: 844×474 per Figma */}
            <div className="flex-1 relative h-[340px] lg:h-[474px] overflow-hidden bg-gray-100">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={project.titleEn}
                  fill
                  sizes="(max-width: 1024px) 100vw, 844px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-300 text-sm">No image</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ===== GALLERY GRID: 414×233 per Figma ===== */}
      {galleryImages.length > 0 && (
        <section data-navbar-dark className="px-8 lg:px-[83px] pb-[80px] bg-white">
          <div className="max-w-[1290px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-[5px]">
              {galleryImages.map((image: { id: string; url: string; alt?: string }) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden bg-gray-100"
                  style={{ aspectRatio: '199/112' }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || project.titleEn}
                    fill
                    sizes="(max-width: 1024px) 50vw, 414px"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PROJECT TIMELINE ===== */}
      {project.timeline.length > 0 && (
        <section data-navbar-dark className="py-[80px] px-8 lg:px-[83px] bg-white border-t border-[#E8E8E8]">
          <div className="max-w-[1290px] mx-auto">

            <h2
              style={{ fontFamily: ff }}
              className="text-[42px] lg:text-[64px] text-[#111111] font-normal leading-none tracking-[3.2px] mb-[80px]"
            >
              Project time-line
            </h2>

            {/* Timeline entries with centered vertical line on desktop */}
            <div className="relative">

              {/* Vertical black line running through all entries */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#111111] -translate-x-1/2 z-0" />

              <div className="space-y-[80px] lg:space-y-[100px]">
                {project.timeline.map((entry: {
                  id: string
                  titleEn: string
                  descriptionEn: string
                  image?: string
                }, idx: number) => {
                  const isTextLeft = idx % 2 === 0
                  return (
                    <div
                      key={entry.id}
                      className={`relative flex flex-col lg:flex-row gap-8 lg:gap-0 ${!isTextLeft ? 'lg:flex-row-reverse' : ''}`}
                    >
                      {/* Text side */}
                      <div className={`flex-1 relative z-10 ${isTextLeft ? 'lg:pr-16' : 'lg:pl-16'}`}>
                        <h3
                          style={{ fontFamily: ff }}
                          className="text-[28px] lg:text-[48px] text-[#111111] font-normal leading-none tracking-[2px] mb-5"
                        >
                          {entry.titleEn}
                        </h3>
                        <p
                          style={{ fontFamily: ff }}
                          className="text-[15px] lg:text-[18px] text-[#555555] leading-[1.7] tracking-[0.3px] max-w-[440px]"
                        >
                          {entry.descriptionEn}
                        </p>
                      </div>

                      {/* Image side */}
                      <div className={`flex-1 relative z-10 ${!isTextLeft ? 'lg:pr-16' : 'lg:pl-16'}`}>
                        {entry.image ? (
                          <div
                            className="relative w-full overflow-hidden bg-gray-100"
                            style={{ aspectRatio: '199/112' }}
                          >
                            <Image
                              src={entry.image}
                              alt={entry.titleEn}
                              fill
                              sizes="(max-width: 1024px) 100vw, 602px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-full bg-[#F5F5F5]" style={{ aspectRatio: '199/112' }} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL DESIGN REVEAL ===== */}
      {(project.finalRevealTitleEn || project.finalRevealSubtitleEn || showcaseImages.length > 0) && (
        <section data-navbar-dark className="bg-white border-t border-[#E8E8E8]">

          {/* Heading + subtitle — padded */}
          {(project.finalRevealTitleEn || project.finalRevealSubtitleEn) && (
            <div className="pt-[80px] pb-[60px] px-8 lg:px-[83px]">
              <div className="max-w-[1290px] mx-auto">
                {project.finalRevealTitleEn && (
                  <h2
                    style={{ fontFamily: ff }}
                    className="text-[42px] lg:text-[64px] text-[#111111] font-normal leading-none tracking-[3.2px] mb-6"
                  >
                    {project.finalRevealTitleEn}
                  </h2>
                )}
                {project.finalRevealSubtitleEn && (
                  <p
                    style={{ fontFamily: ff }}
                    className="text-[18px] lg:text-[32px] text-[#555555] font-normal leading-[1.3] tracking-[0.5px] max-w-[900px]"
                  >
                    {project.finalRevealSubtitleEn}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Showcase images — full viewport width, 1272×716 per Figma */}
          {showcaseImages.length > 0 && (
            <div className={`space-y-[3px] ${!(project.finalRevealTitleEn || project.finalRevealSubtitleEn) ? 'pt-[80px]' : ''} pb-[80px]`}>
              {showcaseImages.map((image: { id: string; url: string; alt?: string }) => (
                <div
                  key={image.id}
                  className="relative w-full overflow-hidden bg-gray-100"
                  style={{ aspectRatio: '151/85' }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || project.titleEn}
                    fill
                    sizes="100vw"
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
        <section className="bg-[#F5F0EB] py-[80px] px-8 lg:px-[83px]">
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
