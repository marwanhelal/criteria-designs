import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/db'
import { transcodeAndUpdate } from '@/lib/transcode'
import { deleteFile } from '@/lib/deleteFile'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    const allowedTypes = [...imageTypes, ...videoTypes]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG, MP4, WebM, MOV' },
        { status: 400 }
      )
    }

    // Validate file size (images: 50MB, videos: 150MB)
    const isVideo = videoTypes.includes(file.type)
    const maxSize = isVideo ? 150 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${isVideo ? '150MB' : '50MB'}` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Save to database
    const validFolders = ['homepage', 'projects', 'awards', 'team', 'clients', 'other']
    const requestedFolder = formData.get('folder') as string || 'other'
    const folder = validFolders.includes(requestedFolder) ? requestedFolder : 'other'

    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url: `/api/uploads/${filename}`,
        mimeType: file.type,
        size: file.size,
        alt: formData.get('alt') as string || null,
        folder,
      }
    })

    // Background transcoding for videos (fire-and-forget, updates DB when done)
    if (isVideo) {
      transcodeAndUpdate(filepath, media.id).catch(err =>
        console.error('[transcode] Background error:', err)
      )
    }

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload — immediately delete a file by URL
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })
    await deleteFile(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
