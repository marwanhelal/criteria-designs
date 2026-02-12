import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/db'

// DELETE media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get media record
    const media = await prisma.media.findUnique({ where: { id } })
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    const url = media.url

    // Delete file from disk
    // URL is stored as /api/uploads/filename, actual file is at public/uploads/filename
    try {
      const filename = url.replace(/^\/api\/uploads\//, '')
      const filepath = join(process.cwd(), 'public', 'uploads', filename)
      await unlink(filepath)
    } catch {
      // File may not exist, continue with database deletion
    }

    // Clear all references to this media URL across all tables
    await Promise.all([
      // SiteSettings: nullify any field matching this URL
      prisma.siteSettings.updateMany({
        where: { logo: url },
        data: { logo: null }
      }),
      prisma.siteSettings.updateMany({
        where: { favicon: url },
        data: { favicon: null }
      }),
      prisma.siteSettings.updateMany({
        where: { heroImage: url },
        data: { heroImage: null }
      }),
      prisma.siteSettings.updateMany({
        where: { heroVideo: url },
        data: { heroVideo: null }
      }),
      prisma.siteSettings.updateMany({
        where: { philosophyImage: url },
        data: { philosophyImage: null }
      }),
      // ProjectImage: delete records referencing this URL
      prisma.projectImage.deleteMany({
        where: { url }
      }),
      // ProjectTimeline: nullify image
      prisma.projectTimeline.updateMany({
        where: { image: url },
        data: { image: null }
      }),
      // Project: nullify clientLogo
      prisma.project.updateMany({
        where: { clientLogo: url },
        data: { clientLogo: null }
      }),
      // TeamMember: nullify photo
      prisma.teamMember.updateMany({
        where: { photo: url },
        data: { photo: null }
      }),
      // Service: nullify image
      prisma.service.updateMany({
        where: { image: url },
        data: { image: null }
      }),
      // BlogPost: nullify featuredImage
      prisma.blogPost.updateMany({
        where: { featuredImage: url },
        data: { featuredImage: null }
      }),
      // User: nullify image
      prisma.user.updateMany({
        where: { image: url },
        data: { image: null }
      }),
      // CEO Banner: nullify image fields
      prisma.siteSettings.updateMany({
        where: { ceoImage: url },
        data: { ceoImage: null }
      }),
      prisma.siteSettings.updateMany({
        where: { ceoBgImage: url },
        data: { ceoBgImage: null }
      }),
      prisma.siteSettings.updateMany({
        where: { ceoLogo1: url },
        data: { ceoLogo1: null }
      }),
      prisma.siteSettings.updateMany({
        where: { ceoLogo2: url },
        data: { ceoLogo2: null }
      }),
      prisma.siteSettings.updateMany({
        where: { ceoLogo3: url },
        data: { ceoLogo3: null }
      }),
      prisma.siteSettings.updateMany({
        where: { ceoLogo4: url },
        data: { ceoLogo4: null }
      }),
      prisma.siteSettings.updateMany({
        where: { ceoLogo5: url },
        data: { ceoLogo5: null }
      }),
    ])

    // Delete from media table
    await prisma.media.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}

// UPDATE media (alt text)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const media = await prisma.media.update({
      where: { id },
      data: {
        alt: data.alt || null
      }
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}
