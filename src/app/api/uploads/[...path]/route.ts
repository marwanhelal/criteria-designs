import { NextRequest, NextResponse } from 'next/server'
import { stat } from 'fs/promises'
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

function streamFile(filepath: string, start: number, end: number) {
  const stream = createReadStream(filepath, { start, end })
  return new ReadableStream({
    start(controller) {
      stream.on('data', (chunk: unknown) => {
        controller.enqueue(new Uint8Array(chunk as ArrayBuffer))
      })
      stream.on('end', () => controller.close())
      stream.on('error', (err) => controller.error(err))
    },
    cancel() {
      stream.destroy()
    },
  })
}

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

    let fileStat
    try {
      fileStat = await stat(filepath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const ext = ('.' + filename.split('.').pop()?.toLowerCase()) as string
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    const fileSize = fileStat.size
    const isVideo = VIDEO_EXTENSIONS.has(ext)

    const baseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    }

    const range = request.headers.get('range')

    if (isVideo && range) {
      const match = range.match(/bytes=(\d+)-(\d*)/)
      if (match) {
        const start = parseInt(match[1])
        const end = match[2] ? parseInt(match[2]) : fileSize - 1

        if (start >= fileSize || end >= fileSize || start > end) {
          return new NextResponse(null, {
            status: 416,
            headers: { 'Content-Range': `bytes */${fileSize}` },
          })
        }

        return new NextResponse(streamFile(filepath, start, end), {
          status: 206,
          headers: {
            ...baseHeaders,
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': String(end - start + 1),
          },
        })
      }
    }

    // Full file stream
    return new NextResponse(streamFile(filepath, 0, fileSize - 1), {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': String(fileSize),
      },
    })
  } catch (error) {
    console.error('Error serving upload:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
