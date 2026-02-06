import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// CREATE new service
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const service = await prisma.service.create({
      data: {
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        icon: data.icon || null,
        image: data.image || null,
        order: data.order || 0
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
