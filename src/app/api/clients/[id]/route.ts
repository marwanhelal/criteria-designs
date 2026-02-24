import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// PUT /api/clients/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const client = await prisma.client.update({
      where: { id },
      data: {
        nameEn: body.nameEn,
        logo: body.logo ?? null,
        bgColor: body.bgColor ?? '#FFFFFF',
        order: body.order ?? 0,
      },
    })
    return NextResponse.json(client)
  } catch {
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

// DELETE /api/clients/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.client.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}
