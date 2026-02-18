import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, readFile, appendFile, unlink, rmdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { prisma } from '@/lib/db'
import { transcodeAndUpdate } from '@/lib/transcode'

export const runtime = 'nodejs'
export const maxDuration = 300

// POST: receive a single chunk
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const chunk      = formData.get('chunk')      as File   | null
    const uploadId   = formData.get('uploadId')   as string | null
    const chunkIndex = formData.get('chunkIndex') as string | null
    const totalChunks = formData.get('totalChunks') as string | null
    const fileName   = formData.get('fileName')   as string | null
    const fileType   = formData.get('fileType')   as string | null
    const fileSize   = formData.get('fileSize')   as string | null

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
    const isVideo   = videoTypes.includes(fileType)
    const maxSize   = isVideo ? 150 * 1024 * 1024 : 10 * 1024 * 1024
    if (totalSize > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${isVideo ? '150MB' : '10MB'}` },
        { status: 400 }
      )
    }

    // Save chunk to OS temp directory
    const chunksDir = join(tmpdir(), 'upload-chunks', uploadId)
    await mkdir(chunksDir, { recursive: true })

    const bytes  = await chunk.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(chunksDir, `chunk-${chunkIndex.padStart(6, '0')}`), buffer)

    const idx   = parseInt(chunkIndex)
    const total = parseInt(totalChunks)

    // If this is the last chunk, assemble the file
    if (idx === total - 1) {
      const files      = await readdir(chunksDir)
      const chunkFiles = files.filter(f => f.startsWith('chunk-')).sort()

      if (chunkFiles.length !== total) {
        return NextResponse.json({
          received: idx + 1,
          total,
          assembled: false,
          message: `Waiting for all chunks (${chunkFiles.length}/${total})`,
        })
      }

      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })

      const timestamp = Date.now()
      const extension = fileName.split('.').pop()
      const filename  = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
      const filepath  = join(uploadsDir, filename)

      // ── Stream-based assembly ─────────────────────────────────────────
      // Write chunks one-by-one with appendFile to avoid loading the entire
      // video into memory (avoids OOM crash on large files).
      await writeFile(filepath, Buffer.alloc(0)) // create empty file
      for (const chunkFile of chunkFiles) {
        const data = await readFile_safe(join(chunksDir, chunkFile))
        await appendFile(filepath, data)
      }

      // Clean up temp chunks
      for (const chunkFile of chunkFiles) {
        await unlink(join(chunksDir, chunkFile)).catch(() => {})
      }
      await rmdir(chunksDir).catch(() => {})

      // Save to database
      const media = await prisma.media.create({
        data: {
          filename: fileName,
          url:      `/api/uploads/${filename}`,
          mimeType: fileType,
          size:     totalSize,
          alt:      null,
        },
      })

      // ── Background video transcoding ──────────────────────────────────
      // Fire-and-forget: converts to optimised H.264 MP4, then updates the DB.
      // The upload response is returned immediately — no timeout risk.
      if (isVideo) {
        transcodeAndUpdate(filepath, media.id).catch(err =>
          console.error('[transcode] Background error:', err)
        )
      }

      return NextResponse.json({ received: idx + 1, total, assembled: true, media })
    }

    return NextResponse.json({ received: idx + 1, total, assembled: false })
  } catch (error) {
    console.error('Error handling chunk upload:', error)
    return NextResponse.json({ error: 'Failed to process chunk' }, { status: 500 })
  }
}

// Helper: read a chunk file into a Buffer
async function readFile_safe(path: string): Promise<Buffer> {
  return readFile(path)
}
