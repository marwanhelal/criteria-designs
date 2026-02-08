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

    // Delete file from disk
    // URL is stored as /api/uploads/filename, actual file is at public/uploads/filename
    try {
      const filename = media.url.replace(/^\/api\/uploads\//, '')
      const filepath = join(process.cwd(), 'public', 'uploads', filename)
      await unlink(filepath)
    } catch {
      // File may not exist, continue with database deletion
    }

    // Delete from database
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
