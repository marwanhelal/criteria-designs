import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFile } from '@/lib/deleteFile'

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

    // Delete file from disk + remove Media record via shared utility
    await deleteFile(url)

    // Clear all references to this URL across every table that stores image URLs
    await Promise.all([
      // SiteSettings — all image/video fields
      prisma.siteSettings.updateMany({ where: { logo: url }, data: { logo: null } }),
      prisma.siteSettings.updateMany({ where: { favicon: url }, data: { favicon: null } }),
      prisma.siteSettings.updateMany({ where: { heroImage: url }, data: { heroImage: null } }),
      prisma.siteSettings.updateMany({ where: { heroVideo: url }, data: { heroVideo: null } }),
      prisma.siteSettings.updateMany({ where: { philosophyImage: url }, data: { philosophyImage: null } }),
      prisma.siteSettings.updateMany({ where: { philosophyCultureImage: url }, data: { philosophyCultureImage: null } }),
      prisma.siteSettings.updateMany({ where: { philosophyNatureImage: url }, data: { philosophyNatureImage: null } }),
      prisma.siteSettings.updateMany({ where: { philosophyArtImage: url }, data: { philosophyArtImage: null } }),
      prisma.siteSettings.updateMany({ where: { founderImage: url }, data: { founderImage: null } }),
      prisma.siteSettings.updateMany({ where: { aboutImage: url }, data: { aboutImage: null } }),
      // PhilosophyPage — all image fields
      prisma.philosophyPage.updateMany({ where: { introImage: url }, data: { introImage: null } }),
      prisma.philosophyPage.updateMany({ where: { humanImage: url }, data: { humanImage: null } }),
      prisma.philosophyPage.updateMany({ where: { envImage: url }, data: { envImage: null } }),
      prisma.philosophyPage.updateMany({ where: { cultureImage: url }, data: { cultureImage: null } }),
      prisma.philosophyPage.updateMany({ where: { diagramImage: url }, data: { diagramImage: null } }),
      // ProjectImage: delete records referencing this URL
      prisma.projectImage.deleteMany({ where: { url } }),
      // ProjectTimeline: nullify image
      prisma.projectTimeline.updateMany({ where: { image: url }, data: { image: null } }),
      // Project: nullify clientLogo
      prisma.project.updateMany({ where: { clientLogo: url }, data: { clientLogo: null } }),
      // TeamMember: nullify photo
      prisma.teamMember.updateMany({ where: { photo: url }, data: { photo: null } }),
      // Award: nullify image
      prisma.award.updateMany({ where: { image: url }, data: { image: null } }),
      // Client: nullify logo
      prisma.client.updateMany({ where: { logo: url }, data: { logo: null } }),
      // Service: nullify image
      prisma.service.updateMany({ where: { image: url }, data: { image: null } }),
      // BlogPost: nullify featuredImage
      prisma.blogPost.updateMany({ where: { featuredImage: url }, data: { featuredImage: null } }),
      // User: nullify image
      prisma.user.updateMany({ where: { image: url }, data: { image: null } }),
    ])

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

    const validFolders = ['homepage', 'projects', 'awards', 'team', 'clients', 'other']
    const updateData: { alt?: string | null; folder?: string } = {
      alt: data.alt || null
    }
    if (data.folder && validFolders.includes(data.folder)) {
      updateData.folder = data.folder
    }

    const media = await prisma.media.update({
      where: { id },
      data: updateData
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
