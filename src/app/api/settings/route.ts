import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFiles } from '@/lib/deleteFile'

// Image fields on SiteSettings that should be cleaned up when replaced
const IMAGE_FIELDS = [
  'logo', 'favicon', 'heroImage', 'heroVideo',
  'philosophyImage', 'philosophyCultureImage', 'philosophyNatureImage', 'philosophyArtImage',
  'founderImage', 'aboutImage',
] as const

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

    // Detect which image fields are being replaced so we can delete the old files
    const current = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
    const urlsToDelete: (string | null | undefined)[] = []
    if (current) {
      for (const field of IMAGE_FIELDS) {
        const oldVal = current[field] as string | null
        const newVal = data[field] || null
        if (oldVal && oldVal !== newVal) {
          urlsToDelete.push(oldVal)
        }
      }
    }

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
        youtube: data.youtube || null,
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
        // Founder & Team Section
        founderSectionTitleEn: data.founderSectionTitleEn || null,
        founderNameEn: data.founderNameEn || null,
        founderTitleEn: data.founderTitleEn || null,
        founderDescriptionEn: data.founderDescriptionEn || null,
        founderImage: data.founderImage || null,
        teamSectionTitleEn: data.teamSectionTitleEn || null,
        // Showcase projects
        showcaseProject1Id: data.showcaseProject1Id || null,
        showcaseProject2Id: data.showcaseProject2Id || null,
        showcaseProject3Id: data.showcaseProject3Id || null,
        showcaseProject4Id: data.showcaseProject4Id || null,
        showcaseProject5Id: data.showcaseProject5Id || null,
        // Awards stats
        awardsCountries: data.awardsCountries || null,
        awardsSince: data.awardsSince || null,
        // Homepage accordion award slots
        homepageAward1Id: data.homepageAward1Id || null,
        homepageAward2Id: data.homepageAward2Id || null,
        homepageAward3Id: data.homepageAward3Id || null,
        homepageAward4Id: data.homepageAward4Id || null,
        homepageAward5Id: data.homepageAward5Id || null,
        // About Us
        aboutIntroText: data.aboutIntroText || null,
        aboutCol1Text: data.aboutCol1Text || null,
        aboutCol2Text: data.aboutCol2Text || null,
        aboutCol2Text2: data.aboutCol2Text2 || null,
        aboutImage: data.aboutImage || null,
        aboutImageCaption: data.aboutImageCaption || null,
        aboutMissionText: data.aboutMissionText || null,
        aboutVisionText: data.aboutVisionText || null,
        aboutStat1Number: data.aboutStat1Number || null,
        aboutStat1Label: data.aboutStat1Label || null,
        aboutStat2Number: data.aboutStat2Number || null,
        aboutStat2Label: data.aboutStat2Label || null,
        aboutStat3Number: data.aboutStat3Number || null,
        aboutStat3Label: data.aboutStat3Label || null,
        aboutStat4Number: data.aboutStat4Number || null,
        aboutStat4Label: data.aboutStat4Label || null,
        aboutServicesText: data.aboutServicesText || null,
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
        youtube: data.youtube || null,
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
        // Founder & Team Section
        founderSectionTitleEn: data.founderSectionTitleEn || null,
        founderNameEn: data.founderNameEn || null,
        founderTitleEn: data.founderTitleEn || null,
        founderDescriptionEn: data.founderDescriptionEn || null,
        founderImage: data.founderImage || null,
        teamSectionTitleEn: data.teamSectionTitleEn || null,
        // Showcase projects
        showcaseProject1Id: data.showcaseProject1Id || null,
        showcaseProject2Id: data.showcaseProject2Id || null,
        showcaseProject3Id: data.showcaseProject3Id || null,
        showcaseProject4Id: data.showcaseProject4Id || null,
        showcaseProject5Id: data.showcaseProject5Id || null,
        // Awards stats
        awardsCountries: data.awardsCountries || null,
        awardsSince: data.awardsSince || null,
        // Homepage accordion award slots
        homepageAward1Id: data.homepageAward1Id || null,
        homepageAward2Id: data.homepageAward2Id || null,
        homepageAward3Id: data.homepageAward3Id || null,
        homepageAward4Id: data.homepageAward4Id || null,
        homepageAward5Id: data.homepageAward5Id || null,
        // About Us
        aboutIntroText: data.aboutIntroText || null,
        aboutCol1Text: data.aboutCol1Text || null,
        aboutCol2Text: data.aboutCol2Text || null,
        aboutCol2Text2: data.aboutCol2Text2 || null,
        aboutImage: data.aboutImage || null,
        aboutImageCaption: data.aboutImageCaption || null,
        aboutMissionText: data.aboutMissionText || null,
        aboutVisionText: data.aboutVisionText || null,
        aboutStat1Number: data.aboutStat1Number || null,
        aboutStat1Label: data.aboutStat1Label || null,
        aboutStat2Number: data.aboutStat2Number || null,
        aboutStat2Label: data.aboutStat2Label || null,
        aboutStat3Number: data.aboutStat3Number || null,
        aboutStat3Label: data.aboutStat3Label || null,
        aboutStat4Number: data.aboutStat4Number || null,
        aboutStat4Label: data.aboutStat4Label || null,
      }
    })

    // Delete replaced image files after the DB update succeeds
    await deleteFiles(urlsToDelete)

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
