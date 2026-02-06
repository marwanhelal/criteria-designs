import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      timeline: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!project || project.status !== 'PUBLISHED') {
    notFound()
  }

  // Fetch more projects for the "More projects" section
  const moreProjects = await prisma.project.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: project.id }
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1
      }
    },
    take: 2,
    orderBy: { createdAt: 'desc' }
  })

  const heroImage = project.images.length > 0 ? project.images[0].url : null
  const galleryImages = project.images.slice(1, 7) // Up to 6 gallery thumbnails
  const showcaseImages = project.images.slice(7) // Remaining large images

  return (
    <>
      <Navbar />

      {/* ===== VERTICAL TIMELINE BAR (Left Side) ===== */}
      <div className="hidden lg:block fixed left-[83px] top-0 w-[7px] h-full bg-[#B1A490]/10 z-40" />

      {/* ===== PROJECT HEADER ===== */}
      <section className="pt-[120px] px-8 lg:px-[83px]">
        <div className="max-w-[1290px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left - Project Info */}
            <div className="lg:w-[382px] shrink-0 flex flex-col justify-between py-4">
              <div>
                <h1 className="font-[var(--font-merriweather)] text-[36px] lg:text-[48px] text-[#181C23] leading-[46px] lg:leading-[60px]">
                  {project.titleEn}
                </h1>
                {project.yearCompleted && (
                  <p className="font-[var(--font-libre-franklin)] text-[18px] text-[#B1A490] mt-2">
                    {project.yearCompleted}
                  </p>
                )}
                <p className="font-[var(--font-open-sans)] text-[14px] text-[#666] leading-[24px] mt-6">
                  {project.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 300)}
                  {project.descriptionEn.replace(/<[^>]*>/g, '').length > 300 ? '...' : ''}
                </p>
              </div>

              {/* Developer / Client */}
              {project.clientName && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[0.56px]">
                    Developer
                  </span>
                  <div className="mt-3 flex items-center gap-3">
                    {project.clientLogo ? (
                      <div
                        className="w-[120px] h-[40px] bg-contain bg-no-repeat bg-left"
                        style={{ backgroundImage: `url('${project.clientLogo}')` }}
                      />
                    ) : (
                      <p className="font-[var(--font-merriweather)] text-[18px] text-[#181C23]">
                        {project.clientName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Main Image */}
            <div className="flex-1 overflow-hidden rounded-lg">
              {heroImage ? (
                <div
                  className="w-full h-[340px] lg:h-[474px] bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url('${heroImage}')` }}
                />
              ) : (
                <div className="w-full h-[340px] lg:h-[474px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMAGE GALLERY GRID ===== */}
      {galleryImages.length > 0 && (
        <section className="pt-[40px] px-8 lg:px-[83px]">
          <div className="max-w-[1290px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image: { id: string; url: string; alt: string | null }) => (
                <div
                  key={image.id}
                  className="h-[180px] lg:h-[233px] rounded-lg overflow-hidden"
                >
                  <div
                    className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${image.url}')` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PROJECT TIMELINE ===== */}
      {project.timeline.length > 0 && (
        <section className="py-[100px] px-8 lg:px-[83px]">
          <div className="max-w-[1290px] mx-auto">
            {/* Section Title */}
            <h2 className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] mb-16">
              project time-line
            </h2>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-[#B1A490]/20 -translate-x-1/2 hidden lg:block" />

              <div className="space-y-20">
                {project.timeline.map((entry: { id: string; titleEn: string; descriptionEn: string; image: string | null }, idx: number) => {
                  const isLeft = idx % 2 === 0

                  return (
                    <div key={entry.id} className="relative">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute left-1/2 top-6 w-[14px] h-[14px] bg-[#B1A490] rounded-full -translate-x-1/2 z-10" />

                      <div className={`flex flex-col lg:flex-row items-start gap-8 lg:gap-16 ${
                        isLeft ? '' : 'lg:flex-row-reverse'
                      }`}>
                        {/* Content Side */}
                        <div className={`flex-1 ${isLeft ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'}`}>
                          <h3 className="font-[var(--font-merriweather)] text-[24px] lg:text-[28px] text-[#181C23] leading-[36px]">
                            {entry.titleEn}
                          </h3>
                          <p className="font-[var(--font-open-sans)] text-[14px] text-[#666] leading-[24px] mt-4 max-w-[400px] inline-block">
                            {entry.descriptionEn}
                          </p>
                        </div>

                        {/* Image Side */}
                        <div className="flex-1">
                          {entry.image && (
                            <div
                              className="w-full h-[220px] lg:h-[319px] bg-cover bg-center rounded-lg"
                              style={{ backgroundImage: `url('${entry.image}')` }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== SHOWCASE IMAGES ===== */}
      {showcaseImages.length > 0 && (
        <section className="px-8 lg:px-[83px] pb-[80px]">
          <div className="max-w-[1290px] mx-auto space-y-6">
            {showcaseImages.map((image: { id: string; url: string; alt: string | null }) => (
              <div
                key={image.id}
                className="w-full h-[400px] lg:h-[716px] rounded-lg overflow-hidden"
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${image.url}')` }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== FULL DESCRIPTION (if longer content) ===== */}
      {project.descriptionEn.length > 300 && (
        <section className="px-8 lg:px-[83px] pb-[80px]">
          <div className="max-w-[860px] mx-auto">
            <div
              className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] prose prose-lg max-w-none prose-headings:font-[var(--font-merriweather)] prose-headings:text-[#181C23] prose-a:text-[#B1A490]"
              dangerouslySetInnerHTML={{ __html: project.descriptionEn }}
            />
          </div>
        </section>
      )}

      {/* ===== MORE PROJECTS ===== */}
      {moreProjects.length > 0 && (
        <section className="bg-[#F5F0EB] py-[80px] px-8 lg:px-[83px]">
          <div className="max-w-[1290px] mx-auto">
            <h2 className="font-[var(--font-merriweather)] text-[32px] text-[#181C23] leading-[48px] text-center mb-12">
              More projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {moreProjects.map((p) => {
                const thumb = p.images.length > 0 ? p.images[0].url : null
                return (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="group"
                  >
                    <div className="rounded-lg overflow-hidden bg-gray-200">
                      <div className="h-[280px] lg:h-[373px] overflow-hidden">
                        {thumb ? (
                          <div
                            className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                            style={{ backgroundImage: `url('${thumb}')` }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-[#181C23] p-8">
                        <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px]">
                          {p.location || p.category}
                        </p>
                        <h3 className="font-[var(--font-merriweather)] text-[24px] text-white leading-[34px] mt-2">
                          {p.titleEn}
                        </h3>
                        {p.yearCompleted && (
                          <p className="font-[var(--font-libre-franklin)] text-[16px] text-white/60 mt-4">
                            {p.yearCompleted}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors"
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
