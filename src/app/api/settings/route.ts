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

    // Fetch enriched showcase projects
    const showcaseIds = [
      settings.showcaseProject1Id,
      settings.showcaseProject2Id,
      settings.showcaseProject3Id,
      settings.showcaseProject4Id,
      settings.showcaseProject5Id,
    ].filter(Boolean) as string[]

    let showcaseProjects: object[] = []
    if (showcaseIds.length > 0) {
      const projects = await prisma.project.findMany({
        where: { id: { in: showcaseIds } },
        select: {
          id: true,
          slug: true,
          titleEn: true,
          category: true,
          location: true,
          yearCompleted: true,
          clientName: true,
          images: { orderBy: { order: 'asc' }, take: 2, select: { url: true, alt: true } },
        },
      })
      // Preserve order set by admin
      showcaseProjects = showcaseIds
        .map(id => projects.find(p => p.id === id))
        .filter(Boolean) as object[]
    }

    return NextResponse.json({ ...settings, showcaseProjects })
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
        heroVideo: data.heroVideo || null,
        philosophyImage: data.philosophyImage || null,
        philosophyCultureImage: data.philosophyCultureImage || null,
        philosophyNatureImage: data.philosophyNatureImage || null,
        philosophyArtImage: data.philosophyArtImage || null,
        seoTitleEn: data.seoTitleEn || null,
        seoTitleAr: data.seoTitleAr || null,
        seoDescriptionEn: data.seoDescriptionEn || null,
        seoDescriptionAr: data.seoDescriptionAr || null,
        // CEO Banner
        ceoNameEn: data.ceoNameEn || null,
        ceoNameAr: data.ceoNameAr || null,
        ceoTitleEn: data.ceoTitleEn || null,
        ceoTitleAr: data.ceoTitleAr || null,
        ceoImage: data.ceoImage || null,
        ceoBgImage: data.ceoBgImage || null,
        ceoStat1Number: data.ceoStat1Number || null,
        ceoStat1LabelEn: data.ceoStat1LabelEn || null,
        ceoStat1LabelAr: data.ceoStat1LabelAr || null,
        ceoStat1DescEn: data.ceoStat1DescEn || null,
        ceoStat1DescAr: data.ceoStat1DescAr || null,
        ceoStat2Number: data.ceoStat2Number || null,
        ceoStat2LabelEn: data.ceoStat2LabelEn || null,
        ceoStat2LabelAr: data.ceoStat2LabelAr || null,
        ceoStat3Number: data.ceoStat3Number || null,
        ceoStat3LabelEn: data.ceoStat3LabelEn || null,
        ceoStat3LabelAr: data.ceoStat3LabelAr || null,
        ceoStat4Number: data.ceoStat4Number || null,
        ceoStat4LabelEn: data.ceoStat4LabelEn || null,
        ceoStat4LabelAr: data.ceoStat4LabelAr || null,
        ceoLogo1: data.ceoLogo1 || null,
        ceoLogo2: data.ceoLogo2 || null,
        ceoLogo3: data.ceoLogo3 || null,
        ceoLogo4: data.ceoLogo4 || null,
        ceoLogo5: data.ceoLogo5 || null,
        ceoBtnTextEn: data.ceoBtnTextEn || null,
        ceoBtnTextAr: data.ceoBtnTextAr || null,
        ceoBtnLink: data.ceoBtnLink || null,
        // Showcase projects
        showcaseProject1Id: data.showcaseProject1Id || null,
        showcaseProject2Id: data.showcaseProject2Id || null,
        showcaseProject3Id: data.showcaseProject3Id || null,
        showcaseProject4Id: data.showcaseProject4Id || null,
        showcaseProject5Id: data.showcaseProject5Id || null,
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
        heroVideo: data.heroVideo || null,
        philosophyImage: data.philosophyImage || null,
        philosophyCultureImage: data.philosophyCultureImage || null,
        philosophyNatureImage: data.philosophyNatureImage || null,
        philosophyArtImage: data.philosophyArtImage || null,
        seoTitleEn: data.seoTitleEn || null,
        seoTitleAr: data.seoTitleAr || null,
        seoDescriptionEn: data.seoDescriptionEn || null,
        seoDescriptionAr: data.seoDescriptionAr || null,
        // CEO Banner
        ceoNameEn: data.ceoNameEn || null,
        ceoNameAr: data.ceoNameAr || null,
        ceoTitleEn: data.ceoTitleEn || null,
        ceoTitleAr: data.ceoTitleAr || null,
        ceoImage: data.ceoImage || null,
        ceoBgImage: data.ceoBgImage || null,
        ceoStat1Number: data.ceoStat1Number || null,
        ceoStat1LabelEn: data.ceoStat1LabelEn || null,
        ceoStat1LabelAr: data.ceoStat1LabelAr || null,
        ceoStat1DescEn: data.ceoStat1DescEn || null,
        ceoStat1DescAr: data.ceoStat1DescAr || null,
        ceoStat2Number: data.ceoStat2Number || null,
        ceoStat2LabelEn: data.ceoStat2LabelEn || null,
        ceoStat2LabelAr: data.ceoStat2LabelAr || null,
        ceoStat3Number: data.ceoStat3Number || null,
        ceoStat3LabelEn: data.ceoStat3LabelEn || null,
        ceoStat3LabelAr: data.ceoStat3LabelAr || null,
        ceoStat4Number: data.ceoStat4Number || null,
        ceoStat4LabelEn: data.ceoStat4LabelEn || null,
        ceoStat4LabelAr: data.ceoStat4LabelAr || null,
        ceoLogo1: data.ceoLogo1 || null,
        ceoLogo2: data.ceoLogo2 || null,
        ceoLogo3: data.ceoLogo3 || null,
        ceoLogo4: data.ceoLogo4 || null,
        ceoLogo5: data.ceoLogo5 || null,
        ceoBtnTextEn: data.ceoBtnTextEn || null,
        ceoBtnTextAr: data.ceoBtnTextAr || null,
        ceoBtnLink: data.ceoBtnLink || null,
        // Showcase projects
        showcaseProject1Id: data.showcaseProject1Id || null,
        showcaseProject2Id: data.showcaseProject2Id || null,
        showcaseProject3Id: data.showcaseProject3Id || null,
        showcaseProject4Id: data.showcaseProject4Id || null,
        showcaseProject5Id: data.showcaseProject5Id || null,
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
