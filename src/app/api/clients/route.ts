import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(clients)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

// POST /api/clients
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const client = await prisma.client.create({
      data: {
        nameEn: body.nameEn || '',
        logo: body.logo || null,
        bgColor: body.bgColor || '#FFFFFF',
        order: body.order ?? 0,
      },
    })
    return NextResponse.json(client, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
