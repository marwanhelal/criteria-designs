import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFiles } from '@/lib/deleteFile'

const PHILOSOPHY_IMAGE_FIELDS = [
  'introImage', 'humanImage', 'envImage', 'cultureImage', 'diagramImage',
] as const

const DEFAULTS = {
  heroTitle: 'Our Philosophy',
  heroSubtitle: 'what we believe in',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment leading to being the most effective element to human efficiency.',
  introImage: null as string | null,
  humanTitle: 'HUMAN',
  humanDescription: 'human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null as string | null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'as well as environmental measures such as weather, geography and energy.',
  envImage: null as string | null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'and finally cultural values such as social and economic ones.',
  cultureImage: null as string | null,
  diagramImage: null as string | null,
}

export async function GET() {
  try {
    let page = await prisma.philosophyPage.findUnique({ where: { id: 'main' } })
    if (!page) {
      page = await prisma.philosophyPage.create({ data: { id: 'main', updatedAt: new Date() } })
    }
    const result: Record<string, unknown> = { ...DEFAULTS }
    for (const [k, v] of Object.entries(page)) {
      if (v !== null && v !== undefined) result[k] = v
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching philosophy page:', error)
    return NextResponse.json(DEFAULTS)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Collect replaced image URLs before overwriting
    const current = await prisma.philosophyPage.findUnique({ where: { id: 'main' } })
    const urlsToDelete: (string | null | undefined)[] = []
    if (current) {
      for (const field of PHILOSOPHY_IMAGE_FIELDS) {
        const oldVal = current[field] as string | null
        const newVal = data[field] || null
        if (oldVal && oldVal !== newVal) urlsToDelete.push(oldVal)
      }
    }

    const page = await prisma.philosophyPage.upsert({
      where: { id: 'main' },
      update: {
        heroTitle:          data.heroTitle          || DEFAULTS.heroTitle,
        heroSubtitle:       data.heroSubtitle       || DEFAULTS.heroSubtitle,
        introText:          data.introText          || null,
        introImage:         data.introImage         || null,
        humanTitle:         data.humanTitle         || DEFAULTS.humanTitle,
        humanDescription:   data.humanDescription   || null,
        humanImage:         data.humanImage         || null,
        envTitle:           data.envTitle           || DEFAULTS.envTitle,
        envDescription:     data.envDescription     || null,
        envImage:           data.envImage           || null,
        cultureTitle:       data.cultureTitle       || DEFAULTS.cultureTitle,
        cultureDescription: data.cultureDescription || null,
        cultureImage:       data.cultureImage       || null,
        diagramImage:       data.diagramImage       || null,
      },
      create: {
        id: 'main',
        heroTitle:          data.heroTitle          || DEFAULTS.heroTitle,
        heroSubtitle:       data.heroSubtitle       || DEFAULTS.heroSubtitle,
        introText:          data.introText          || null,
        introImage:         data.introImage         || null,
        humanTitle:         data.humanTitle         || DEFAULTS.humanTitle,
        humanDescription:   data.humanDescription   || null,
        humanImage:         data.humanImage         || null,
        envTitle:           data.envTitle           || DEFAULTS.envTitle,
        envDescription:     data.envDescription     || null,
        envImage:           data.envImage           || null,
        cultureTitle:       data.cultureTitle       || DEFAULTS.cultureTitle,
        cultureDescription: data.cultureDescription || null,
        cultureImage:       data.cultureImage       || null,
        diagramImage:       data.diagramImage       || null,
      },
    })
    await deleteFiles(urlsToDelete)
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating philosophy page:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
