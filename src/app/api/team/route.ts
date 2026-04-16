import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all team members
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// CREATE new team member
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.nameEn?.trim() || !data.nameAr?.trim()) {
      return NextResponse.json({ error: 'Name (English and Arabic) is required' }, { status: 400 })
    }
    if (!data.roleEn?.trim() || !data.roleAr?.trim()) {
      return NextResponse.json({ error: 'Role (English and Arabic) is required' }, { status: 400 })
    }

    const member = await prisma.teamMember.create({
      data: {
        nameEn: data.nameEn.trim(),
        nameAr: data.nameAr.trim(),
        roleEn: data.roleEn.trim(),
        roleAr: data.roleAr.trim(),
        bioEn: data.bioEn || null,
        bioAr: data.bioAr || null,
        photo: data.photo || null,
        email: data.email || null,
        linkedin: data.linkedin || null,
        order: data.order || 0
      }
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
