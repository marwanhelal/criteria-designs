import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFile } from '@/lib/deleteFile'

// GET single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const member = await prisma.teamMember.findUnique({ where: { id } })

    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// UPDATE team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const old = await prisma.teamMember.findUnique({ where: { id } })

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        roleEn: data.roleEn,
        roleAr: data.roleAr,
        bioEn: data.bioEn || null,
        bioAr: data.bioAr || null,
        photo: data.photo || null,
        email: data.email || null,
        linkedin: data.linkedin || null,
        order: data.order || 0
      }
    })

    // Delete old photo if it was replaced or removed
    if (old?.photo && old.photo !== (data.photo || null)) {
      await deleteFile(old.photo)
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const member = await prisma.teamMember.findUnique({ where: { id } })
    await prisma.teamMember.delete({ where: { id } })

    // Delete photo from disk + media table
    await deleteFile(member?.photo)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
