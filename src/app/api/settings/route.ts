import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'main',
          companyNameEn: 'Criteria Designs',
          companyNameAr: 'كرايتيريا للتصميم'
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// UPDATE site settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: {
        companyNameEn: data.companyNameEn,
        companyNameAr: data.companyNameAr,
        addressEn: data.addressEn || null,
        addressAr: data.addressAr || null,
        phone: data.phone || null,
        email: data.email || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        logo: data.logo || null,
        favicon: data.favicon || null,
        heroImage: data.heroImage || null,
        seoTitleEn: data.seoTitleEn || null,
        seoTitleAr: data.seoTitleAr || null,
        seoDescriptionEn: data.seoDescriptionEn || null,
        seoDescriptionAr: data.seoDescriptionAr || null
      },
      create: {
        id: 'main',
        companyNameEn: data.companyNameEn || 'Criteria Designs',
        companyNameAr: data.companyNameAr || 'كرايتيريا للتصميم',
        addressEn: data.addressEn || null,
        addressAr: data.addressAr || null,
        phone: data.phone || null,
        email: data.email || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        logo: data.logo || null,
        favicon: data.favicon || null,
        heroImage: data.heroImage || null,
        seoTitleEn: data.seoTitleEn || null,
        seoTitleAr: data.seoTitleAr || null,
        seoDescriptionEn: data.seoDescriptionEn || null,
        seoDescriptionAr: data.seoDescriptionAr || null
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
