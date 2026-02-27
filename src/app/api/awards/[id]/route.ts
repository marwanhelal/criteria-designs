import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single award
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const award = await prisma.award.findUnique({
      where: { id }
    })

    if (!award) {
      return NextResponse.json(
        { error: 'Award not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(award)
  } catch (error) {
    console.error('Error fetching award:', error)
    return NextResponse.json(
      { error: 'Failed to fetch award' },
      { status: 500 }
    )
  }
}

// UPDATE award
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const award = await prisma.award.update({
      where: { id },
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

    return NextResponse.json(award)
  } catch (error) {
    console.error('Error updating award:', error)
    return NextResponse.json(
      { error: 'Failed to update award' },
      { status: 500 }
    )
  }
}

// DELETE award
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.award.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting award:', error)
    return NextResponse.json(
      { error: 'Failed to delete award' },
      { status: 500 }
    )
  }
}
