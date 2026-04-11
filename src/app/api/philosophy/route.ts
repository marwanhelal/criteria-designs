import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEFAULTS = {
  heroTitle: 'Our Philosophy',
  heroSubtitle: 'what we believe in',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment leading to being the most effective element to human efficiency.',
  humanTitle: 'HUMAN',
  humanDescription: 'human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null as string | null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'as well as environmental measures such as weather, geography and energy.',
  envImage: null as string | null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'and finally cultural values such as social and economic ones.',
  cultureImage: null as string | null,
  diagramNature: 'Nature',
  diagramHumanValues: 'Human Values',
  diagramArts: 'Arts',
  diagramDesign: 'Design',
  diagramInnovative: 'Innovative Solutions',
  solution1: 'Sustainability',
  solution2: 'Creativity',
  solution3: 'Uniqueness',
  outcome1: 'Happiness',
  outcome2: 'Resilience',
}

export async function GET() {
  try {
    let page = await prisma.philosophyPage.findUnique({ where: { id: 'main' } })
    if (!page) {
      page = await prisma.philosophyPage.create({ data: { id: 'main', updatedAt: new Date() } })
    }
    // Merge defaults for any null fields
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
    const page = await prisma.philosophyPage.upsert({
      where: { id: 'main' },
      update: {
        heroTitle:          data.heroTitle          || DEFAULTS.heroTitle,
        heroSubtitle:       data.heroSubtitle       || DEFAULTS.heroSubtitle,
        introText:          data.introText          || null,
        humanTitle:         data.humanTitle         || DEFAULTS.humanTitle,
        humanDescription:   data.humanDescription   || null,
        humanImage:         data.humanImage         || null,
        envTitle:           data.envTitle           || DEFAULTS.envTitle,
        envDescription:     data.envDescription     || null,
        envImage:           data.envImage           || null,
        cultureTitle:       data.cultureTitle       || DEFAULTS.cultureTitle,
        cultureDescription: data.cultureDescription || null,
        cultureImage:       data.cultureImage       || null,
        diagramNature:      data.diagramNature      || DEFAULTS.diagramNature,
        diagramHumanValues: data.diagramHumanValues || DEFAULTS.diagramHumanValues,
        diagramArts:        data.diagramArts        || DEFAULTS.diagramArts,
        diagramDesign:      data.diagramDesign      || DEFAULTS.diagramDesign,
        diagramInnovative:  data.diagramInnovative  || DEFAULTS.diagramInnovative,
        solution1:          data.solution1          || DEFAULTS.solution1,
        solution2:          data.solution2          || DEFAULTS.solution2,
        solution3:          data.solution3          || DEFAULTS.solution3,
        outcome1:           data.outcome1           || DEFAULTS.outcome1,
        outcome2:           data.outcome2           || DEFAULTS.outcome2,
      },
      create: {
        id: 'main',
        heroTitle:          data.heroTitle          || DEFAULTS.heroTitle,
        heroSubtitle:       data.heroSubtitle       || DEFAULTS.heroSubtitle,
        introText:          data.introText          || null,
        humanTitle:         data.humanTitle         || DEFAULTS.humanTitle,
        humanDescription:   data.humanDescription   || null,
        humanImage:         data.humanImage         || null,
        envTitle:           data.envTitle           || DEFAULTS.envTitle,
        envDescription:     data.envDescription     || null,
        envImage:           data.envImage           || null,
        cultureTitle:       data.cultureTitle       || DEFAULTS.cultureTitle,
        cultureDescription: data.cultureDescription || null,
        cultureImage:       data.cultureImage       || null,
        diagramNature:      data.diagramNature      || DEFAULTS.diagramNature,
        diagramHumanValues: data.diagramHumanValues || DEFAULTS.diagramHumanValues,
        diagramArts:        data.diagramArts        || DEFAULTS.diagramArts,
        diagramDesign:      data.diagramDesign      || DEFAULTS.diagramDesign,
        diagramInnovative:  data.diagramInnovative  || DEFAULTS.diagramInnovative,
        solution1:          data.solution1          || DEFAULTS.solution1,
        solution2:          data.solution2          || DEFAULTS.solution2,
        solution3:          data.solution3          || DEFAULTS.solution3,
        outcome1:           data.outcome1           || DEFAULTS.outcome1,
        outcome2:           data.outcome2           || DEFAULTS.outcome2,
      },
    })
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating philosophy page:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
