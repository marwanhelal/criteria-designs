import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (category) where.category = category

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// CREATE new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const post = await prisma.blogPost.create({
      data: {
        slug: data.slug,
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        contentEn: data.contentEn,
        contentAr: data.contentAr,
        excerptEn: data.excerptEn || null,
        excerptAr: data.excerptAr || null,
        featuredImage: data.featuredImage || null,
        authorId: data.authorId,
        category: data.category,
        tags: data.tags || [],
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        status: data.status || 'DRAFT'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
