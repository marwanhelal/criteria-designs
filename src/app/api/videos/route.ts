import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    if (!data.titleEn?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!data.youtubeUrl?.trim()) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
    }
    const video = await prisma.video.create({
      data: {
        titleEn: data.titleEn.trim(),
        youtubeUrl: data.youtubeUrl.trim(),
        description: data.description || null,
        order: data.order ?? 0,
      },
    })
    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}
