import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFile } from '@/lib/deleteFile'

// PUT /api/clients/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const old = await prisma.client.findUnique({ where: { id } })

    const client = await prisma.client.update({
      where: { id },
      data: {
        nameEn: body.nameEn,
        logo: body.logo ?? null,
        bgColor: body.bgColor ?? '#FFFFFF',
        order: body.order ?? 0,
      },
    })

    // Delete old logo if it was replaced or removed
    if (old?.logo && old.logo !== (body.logo ?? null)) {
      await deleteFile(old.logo)
    }

    return NextResponse.json(client)
  } catch {
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

// DELETE /api/clients/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const client = await prisma.client.findUnique({ where: { id } })
    await prisma.client.delete({ where: { id } })

    // Delete logo from disk + media table
    await deleteFile(client?.logo)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}
