import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await prisma.blogPost.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// UPDATE blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Get current post to check status change
    const currentPost = await prisma.blogPost.findUnique({ where: { id } })

    const post = await prisma.blogPost.update({
      where: { id },
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
        publishedAt: data.status === 'PUBLISHED' && currentPost?.status !== 'PUBLISHED'
          ? new Date()
          : currentPost?.publishedAt,
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

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
