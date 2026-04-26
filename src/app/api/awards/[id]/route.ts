import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFile, deleteFiles } from '@/lib/deleteFile'

// GET single award
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const award = await prisma.award.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    })
    if (!award) return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    return NextResponse.json(award)
  } catch (error) {
    console.error('Error fetching award:', error)
    return NextResponse.json({ error: 'Failed to fetch award' }, { status: 500 })
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

    const old = await prisma.award.findUnique({
      where: { id },
      include: { images: true },
    })

    // Determine which gallery images were removed
    const newImageUrls = new Set(
      (data.images as { url: string }[] | undefined ?? []).map(img => img.url)
    )
    const removedGalleryUrls = (old?.images ?? [])
      .map(img => img.url)
      .filter(url => !newImageUrls.has(url))

    // Replace gallery images
    await prisma.awardImage.deleteMany({ where: { awardId: id } })

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
        status: data.status || 'DRAFT',
        images: data.images?.length ? {
          create: (data.images as { url: string; alt?: string }[]).map((img, idx) => ({
            url: img.url,
            alt: img.alt || null,
            order: idx,
          }))
        } : undefined,
      },
      include: { images: { orderBy: { order: 'asc' } } },
    })

    // Delete old main image if replaced
    if (old?.image && old.image !== (data.image || null)) {
      await deleteFile(old.image)
    }
    // Delete removed gallery images
    await deleteFiles(removedGalleryUrls)

    return NextResponse.json(award)
  } catch (error) {
    console.error('Error updating award:', error)
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 })
  }
}

// DELETE award
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const award = await prisma.award.findUnique({
      where: { id },
      include: { images: true },
    })

    await prisma.award.delete({ where: { id } })

    // Delete main image + all gallery images
    await deleteFiles([
      award?.image,
      ...(award?.images ?? []).map(img => img.url),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting award:', error)
    return NextResponse.json({ error: 'Failed to delete award' }, { status: 500 })
  }
}
