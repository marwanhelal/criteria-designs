import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
    if (!settings) return NextResponse.json({})
    return NextResponse.json({
      aboutIntroText: settings.aboutIntroText,
      aboutCol1Text: settings.aboutCol1Text,
      aboutCol2Text: settings.aboutCol2Text,
      aboutCol2Text2: settings.aboutCol2Text2,
      aboutImage: settings.aboutImage,
      aboutImageCaption: settings.aboutImageCaption,
      aboutMissionText: settings.aboutMissionText,
      aboutVisionText: settings.aboutVisionText,
      aboutStat1Number: settings.aboutStat1Number,
      aboutStat1Label: settings.aboutStat1Label,
      aboutStat2Number: settings.aboutStat2Number,
      aboutStat2Label: settings.aboutStat2Label,
      aboutStat3Number: settings.aboutStat3Number,
      aboutStat3Label: settings.aboutStat3Label,
      aboutStat4Number: settings.aboutStat4Number,
      aboutStat4Label: settings.aboutStat4Label,
      aboutServicesText: settings.aboutServicesText,
    })
  } catch (error) {
    console.error('Error fetching about settings:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: {
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
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating about settings:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
