import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft, Calendar, User } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true },
  })

  if (!post || post.status !== 'PUBLISHED') {
    notFound()
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.titleEn}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <Image
              src="/images/blog-placeholder.jpg"
              alt={post.titleEn}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(24, 28, 35, 0) 0%, rgba(24, 28, 35, 0.9) 100%)',
            }}
          />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-8 lg:px-[315px]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] mb-6 hover:text-[#B1A490] transition-colors w-fit"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>
          <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[0.56px] bg-white/10 px-4 py-1 rounded-full w-fit">
            {post.category}
          </span>
          <h1 className="font-[var(--font-merriweather)] text-[32px] lg:text-[48px] text-white leading-[42px] lg:leading-[60px] mt-4 max-w-[800px]">
            {post.titleEn}
          </h1>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#B1A490]" />
              <span className="font-[var(--font-open-sans)] text-[14px] text-white/70">
                {post.author.name}
              </span>
            </div>
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#B1A490]" />
                <span className="font-[var(--font-open-sans)] text-[14px] text-white/70">
                  {formatDate(post.publishedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-[80px] px-8">
        <div className="max-w-[860px] mx-auto">
          {post.excerptEn && (
            <p className="font-[var(--font-open-sans)] text-[18px] text-[#181C23] leading-[32px] font-medium mb-10 pb-10 border-b border-gray-100">
              {post.excerptEn}
            </p>
          )}
          <div
            className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] prose prose-lg max-w-none prose-headings:font-[var(--font-merriweather)] prose-headings:text-[#181C23] prose-a:text-[#B1A490]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contentEn) }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
              {post.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="font-[var(--font-libre-franklin)] text-[13px] text-[#666] bg-[#F5F0EB] px-4 py-2 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== MORE POSTS ===== */}
      <section className="bg-[#F5F0EB] py-[80px] px-8">
        <div className="max-w-[1290px] mx-auto text-center">
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
            Keep reading
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[32px] text-[#181C23] leading-[48px] mt-4">
            Explore more articles
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors mt-8"
          >
            All Articles
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
