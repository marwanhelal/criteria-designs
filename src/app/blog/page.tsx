'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  slug: string
  titleEn: string
  excerptEn: string | null
  featuredImage: string | null
  category: string
  publishedAt: string | null
  author: {
    name: string
    image: string | null
  }
}

const categories = [
  { value: 'ALL', label: 'All' },
  { value: 'NEWS', label: 'News' },
  { value: 'INSIGHTS', label: 'Insights' },
  { value: 'PROJECTS', label: 'Projects' },
  { value: 'AWARDS', label: 'Awards' },
  { value: 'EVENTS', label: 'Events' },
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog?status=PUBLISHED')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = activeCategory === 'ALL'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
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
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/blog-hero.jpg')" }}
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
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
            Latest updates
          </span>
          <h1 className="font-[var(--font-merriweather)] text-[40px] lg:text-[56px] text-white leading-[52px] lg:leading-[68px] mt-4 max-w-[700px]">
            Our Blog
          </h1>
        </div>
      </section>

      {/* ===== FILTER & POSTS ===== */}
      <section className="py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-16 justify-center">
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
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666]">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666]">No posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-[280px] overflow-hidden bg-gray-200">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: post.featuredImage
                            ? `url('${post.featuredImage}')`
                            : "url('/images/blog-placeholder.jpg')"
                        }}
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-[var(--font-libre-franklin)] text-[12px] text-[#B1A490] uppercase tracking-[0.56px] bg-[#F5F0EB] px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        {post.publishedAt && (
                          <span className="font-[var(--font-open-sans)] text-[13px] text-[#666]">
                            {formatDate(post.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-[var(--font-merriweather)] text-[20px] text-[#181C23] leading-[30px] group-hover:text-[#B1A490] transition-colors">
                        {post.titleEn}
                      </h3>
                      {post.excerptEn && (
                        <p className="font-[var(--font-open-sans)] text-[15px] text-[#666] leading-[26px] mt-3 line-clamp-2">
                          {post.excerptEn}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                        <div className="w-[36px] h-[36px] rounded-full bg-[#B1A490]/20 flex items-center justify-center">
                          <span className="font-[var(--font-merriweather)] text-[14px] text-[#B1A490]">
                            {post.author?.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <span className="font-[var(--font-open-sans)] text-[14px] text-[#666]">
                          {post.author?.name || 'Admin'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
