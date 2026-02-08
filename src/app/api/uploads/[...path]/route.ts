import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { resolve } from 'path'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    const filename = pathSegments.join('/')

    // Prevent directory traversal - resolve to absolute and verify it stays within uploads
    const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
    const filepath = resolve(uploadsDir, filename)

    if (!filepath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // Check file exists
    try {
      await stat(filepath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const file = await readFile(filepath)
    const ext = '.' + filename.split('.').pop()?.toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving upload:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
