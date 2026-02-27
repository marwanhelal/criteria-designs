import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all awards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const awards = await prisma.award.findMany({
      where: status ? { status: status as 'DRAFT' | 'PUBLISHED' } : undefined,
      orderBy: [{ year: 'desc' }, { order: 'asc' }]
    })

    return NextResponse.json(awards)
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch awards', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// CREATE new award
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const award = await prisma.award.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        year: parseInt(data.year),
        subtitleEn: data.subtitleEn || null,
        subtitleAr: data.subtitleAr || null,
        image: data.image || null,
        order: data.order || 0,
        status: data.status || 'DRAFT'
      }
    })

    return NextResponse.json(award, { status: 201 })
  } catch (error) {
    console.error('Error creating award:', error)
    return NextResponse.json(
      { error: 'Failed to create award' },
      { status: 500 }
    )
  }
}
