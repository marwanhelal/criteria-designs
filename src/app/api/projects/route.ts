import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (category) where.category = category
    if (featured === 'true') where.featured = true

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// CREATE new project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const project = await prisma.project.create({
      data: {
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
        } : undefined
      },
      include: {
        images: true
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
