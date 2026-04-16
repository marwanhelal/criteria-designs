import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFile } from '@/lib/deleteFile'

// GET single award
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const award = await prisma.award.findUnique({ where: { id } })

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

    if (!data.titleEn?.trim() || !data.titleAr?.trim()) {
      return NextResponse.json({ error: 'Title (English and Arabic) is required' }, { status: 400 })
    }
    const year = parseInt(data.year)
    if (isNaN(year) || year < 1900 || year > 2100) {
      return NextResponse.json({ error: 'A valid year is required' }, { status: 400 })
    }

    const old = await prisma.award.findUnique({ where: { id } })

    const award = await prisma.award.update({
      where: { id },
      data: {
        titleEn: data.titleEn.trim(),
        titleAr: data.titleAr.trim(),
        year,
        subtitleEn: data.subtitleEn || null,
        subtitleAr: data.subtitleAr || null,
        image: data.image || null,
        type: data.type || 'AWARD',
        order: data.order || 0,
        status: data.status || 'DRAFT'
      }
    })

    // Delete old image if it was replaced or removed
    if (old?.image && old.image !== (data.image || null)) {
      await deleteFile(old.image)
    }

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

    const award = await prisma.award.findUnique({ where: { id } })
    await prisma.award.delete({ where: { id } })

    // Delete image from disk + media table
    await deleteFile(award?.image)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting award:', error)
    return NextResponse.json(
      { error: 'Failed to delete award' },
      { status: 500 }
    )
  }
}
