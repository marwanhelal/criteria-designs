import { NextRequest, NextResponse } from 'next/server'
import { stat, open } from 'fs/promises'
import { createReadStream } from 'fs'
import { resolve } from 'path'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov'])

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const filename = pathSegments.join('/')

    // Prevent directory traversal
    const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
    const filepath = resolve(uploadsDir, filename)

    if (!filepath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // Check file exists and get size
    let fileStat
    try {
      fileStat = await stat(filepath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const ext = '.' + filename.split('.').pop()?.toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    const fileSize = fileStat.size
    const isVideo = VIDEO_EXTENSIONS.has(ext)

    // Handle Range requests (critical for video playback)
    const range = request.headers.get('range')

    if (range) {
      const match = range.match(/bytes=(\d+)-(\d*)/)
      if (match) {
        const start = parseInt(match[1])
        const end = match[2] ? parseInt(match[2]) : Math.min(start + 2 * 1024 * 1024 - 1, fileSize - 1)
        const chunkSize = end - start + 1

        const stream = createReadStream(filepath, { start, end })
        const readable = new ReadableStream({
          start(controller) {
            stream.on('data', (chunk: unknown) => {
              controller.enqueue(new Uint8Array(chunk as ArrayBuffer))
            })
            stream.on('end', () => {
              controller.close()
            })
            stream.on('error', (err) => {
              controller.error(err)
            })
          },
          cancel() {
            stream.destroy()
          },
        })

        return new NextResponse(readable, {
          status: 206,
          headers: {
            'Content-Type': contentType,
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': String(chunkSize),
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }
    }

    // For videos without range header, return headers to encourage range requests
    if (isVideo) {
      // Send first 2MB chunk and indicate range support so browser switches to range requests
      const end = Math.min(2 * 1024 * 1024 - 1, fileSize - 1)
      const chunkSize = end + 1

      const stream = createReadStream(filepath, { start: 0, end })
      const readable = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk: unknown) => {
            controller.enqueue(new Uint8Array(chunk as ArrayBuffer))
          })
          stream.on('end', () => {
            controller.close()
          })
          stream.on('error', (err) => {
            controller.error(err)
          })
        },
        cancel() {
          stream.destroy()
        },
      })

      return new NextResponse(readable, {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Range': `bytes 0-${end}/${fileSize}`,
          'Content-Length': String(chunkSize),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Full file response for non-video files (images, small files) — use streaming too
    const stream = createReadStream(filepath)
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk: unknown) => {
          controller.enqueue(new Uint8Array(chunk as ArrayBuffer))
        })
        stream.on('end', () => {
          controller.close()
        })
        stream.on('error', (err) => {
          controller.error(err)
        })
      },
      cancel() {
        stream.destroy()
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving upload:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
