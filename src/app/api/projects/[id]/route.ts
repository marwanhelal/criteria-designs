import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    let project
    try {
      project = await prisma.project.findUnique({
        where: { id },
        include: {
          images: { orderBy: { order: 'asc' } },
          timeline: { orderBy: { order: 'asc' } }
        }
      })
    } catch {
      project = await prisma.project.findUnique({
        where: { id },
        include: { images: { orderBy: { order: 'asc' } } }
      })
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// UPDATE project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Delete existing images if new ones provided
    if (data.images) {
      await prisma.projectImage.deleteMany({
        where: { projectId: id }
      })
    }

    // Try to delete timeline entries (table may not exist)
    if (data.timeline) {
      try {
        await prisma.projectTimeline.deleteMany({
          where: { projectId: id }
        })
      } catch {
        // timeline table may not exist yet
      }
    }

    const baseData = {
      slug: data.slug,
      titleEn: data.titleEn,
      titleAr: data.titleAr,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      category: data.category,
      yearCompleted: data.yearCompleted ? parseInt(data.yearCompleted) : null,
      location: data.location || null,
      clientName: data.clientName || null,
      featured: data.featured || false,
      status: data.status || 'DRAFT',
      images: data.images?.length ? {
        create: data.images.map((img: { url: string; alt?: string }, index: number) => ({
          url: img.url,
          alt: img.alt || null,
          order: index
        }))
      } : undefined,
    }

    let project
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullData: any = {
        ...baseData,
        clientLogo: data.clientLogo || null,
        finalRevealTitleEn: data.finalRevealTitleEn || null,
        finalRevealTitleAr: data.finalRevealTitleAr || null,
        finalRevealSubtitleEn: data.finalRevealSubtitleEn || null,
        finalRevealSubtitleAr: data.finalRevealSubtitleAr || null,
      }
      if (data.timeline?.length) {
        fullData.timeline = {
          create: data.timeline.map((entry: { titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string; image?: string }, index: number) => ({
            titleEn: entry.titleEn,
            titleAr: entry.titleAr,
            descriptionEn: entry.descriptionEn,
            descriptionAr: entry.descriptionAr,
            image: entry.image || null,
            order: index
          }))
        }
      }
      project = await prisma.project.update({
        where: { id },
        data: fullData,
        include: { images: true, timeline: { orderBy: { order: 'asc' } } }
      })
    } catch {
      project = await prisma.project.update({
        where: { id },
        data: baseData,
        include: { images: true }
      })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
