import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, readFile, unlink, rmdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 60

// POST: receive a single chunk
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const chunk = formData.get('chunk') as File | null
    const uploadId = formData.get('uploadId') as string | null
    const chunkIndex = formData.get('chunkIndex') as string | null
    const totalChunks = formData.get('totalChunks') as string | null
    const fileName = formData.get('fileName') as string | null
    const fileType = formData.get('fileType') as string | null
    const fileSize = formData.get('fileSize') as string | null

    if (!chunk || !uploadId || chunkIndex === null || !totalChunks || !fileName || !fileType || !fileSize) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate file type
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const allowedTypes = [...imageTypes, ...videoTypes]
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate total file size
    const totalSize = parseInt(fileSize)
    const isVideo = videoTypes.includes(fileType)
    const maxSize = isVideo ? 150 * 1024 * 1024 : 5 * 1024 * 1024
    if (totalSize > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${isVideo ? '100MB' : '5MB'}` },
        { status: 400 }
      )
    }

    // Save chunk to OS temp directory (always writable in Docker)
    const chunksDir = join(tmpdir(), 'upload-chunks', uploadId)
    await mkdir(chunksDir, { recursive: true })

    const bytes = await chunk.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(chunksDir, `chunk-${chunkIndex.padStart(6, '0')}`), buffer)

    const idx = parseInt(chunkIndex)
    const total = parseInt(totalChunks)

    // If this is the last chunk, assemble the file
    if (idx === total - 1) {
      // Wait briefly for filesystem to sync
      const files = await readdir(chunksDir)
      const chunkFiles = files.filter(f => f.startsWith('chunk-')).sort()

      if (chunkFiles.length !== total) {
        return NextResponse.json({
          received: idx + 1,
          total,
          assembled: false,
          message: `Waiting for all chunks (${chunkFiles.length}/${total})`
        })
      }

      // Assemble chunks
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })

      const timestamp = Date.now()
      const extension = fileName.split('.').pop()
      const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      const filepath = join(uploadsDir, filename)

      // Read and concatenate all chunks
      const chunks: Buffer[] = []
      for (const chunkFile of chunkFiles) {
        const data = await readFile(join(chunksDir, chunkFile))
        chunks.push(data)
      }
      const assembled = Buffer.concat(chunks)
      await writeFile(filepath, assembled)

      // Clean up temp chunks
      for (const chunkFile of chunkFiles) {
        await unlink(join(chunksDir, chunkFile)).catch(() => {})
      }
      await rmdir(chunksDir).catch(() => {})

      // Save to database
      const media = await prisma.media.create({
        data: {
          filename: fileName,
          url: `/api/uploads/${filename}`,
          mimeType: fileType,
          size: totalSize,
          alt: null
        }
      })

      return NextResponse.json({
        received: idx + 1,
        total,
        assembled: true,
        media
      })
    }

    return NextResponse.json({
      received: idx + 1,
      total,
      assembled: false
    })
  } catch (error) {
    console.error('Error handling chunk upload:', error)
    return NextResponse.json(
      { error: 'Failed to process chunk' },
      { status: 500 }
    )
  }
}
