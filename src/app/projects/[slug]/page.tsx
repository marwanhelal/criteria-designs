import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react'

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
      }
    }
  })

  if (!project || project.status !== 'PUBLISHED') {
    notFound()
  }

  const heroImage = project.images.length > 0 ? project.images[0].url : null

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gray-300"
            style={{
              backgroundImage: heroImage
                ? `url('${heroImage}')`
                : undefined
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(24, 28, 35, 0) 0%, rgba(24, 28, 35, 0.8) 100%)',
            }}
          />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8 lg:px-[315px]">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] mb-6 hover:text-[#B1A490] transition-colors w-fit"
          >
            <ArrowLeft size={16} />
            Back to projects
          </Link>
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
            {project.category}
          </span>
          <h1 className="font-[var(--font-merriweather)] text-[40px] lg:text-[56px] text-white leading-[52px] lg:leading-[68px] mt-4 max-w-[800px]">
            {project.titleEn}
          </h1>
        </div>
      </section>

      {/* ===== PROJECT INFO ===== */}
      <section className="py-[80px] px-8 border-b border-gray-100">
        <div className="max-w-[1290px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {project.location && (
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#B1A490] shrink-0 mt-1" />
                <div>
                  <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[0.56px] block">
                    Location
                  </span>
                  <span className="font-[var(--font-open-sans)] text-[16px] text-[#181C23] mt-1 block">
                    {project.location}
                  </span>
                </div>
              </div>
            )}
            {project.yearCompleted && (
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-[#B1A490] shrink-0 mt-1" />
                <div>
                  <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[0.56px] block">
                    Year
                  </span>
                  <span className="font-[var(--font-open-sans)] text-[16px] text-[#181C23] mt-1 block">
                    {project.yearCompleted}
                  </span>
                </div>
              </div>
            )}
            {project.clientName && (
              <div className="flex items-start gap-3">
                <User size={20} className="text-[#B1A490] shrink-0 mt-1" />
                <div>
                  <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[0.56px] block">
                    Client
                  </span>
                  <span className="font-[var(--font-open-sans)] text-[16px] text-[#181C23] mt-1 block">
                    {project.clientName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== DESCRIPTION ===== */}
      <section className="py-[100px] px-8">
        <div className="max-w-[860px] mx-auto">
          <div
            className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: project.descriptionEn }}
          />
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      {project.images.length > 1 && (
        <section className="pb-[100px] px-8">
          <div className="max-w-[1290px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.slice(1).map((image: { id: string; url: string; alt: string | null }, idx: number) => (
                <div
                  key={image.id}
                  className={`rounded-lg overflow-hidden bg-gray-200 ${
                    idx === 0 ? 'md:col-span-2 h-[500px]' : 'h-[400px]'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${image.url}')` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== NEXT PROJECT ===== */}
      <section className="bg-[#F5F0EB] py-[80px] px-8">
        <div className="max-w-[1290px] mx-auto text-center">
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
            Want to see more?
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[32px] text-[#181C23] leading-[48px] mt-4">
            Explore all projects
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors mt-8"
          >
            All Projects
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
