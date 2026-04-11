import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEFAULTS = {
  id: 'main',
  heroTitle: 'The Soul of Our Design',
  heroSubtitle: 'Every project begins with understanding what truly matters.',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment — leading to being the most effective element to human efficiency.',
  introImage: null,
  humanTitle: 'HUMAN',
  humanDescription: 'Human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'Environmental measures such as weather, geography and energy.',
  envImage: null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'Cultural values such as social and economic ones.',
  cultureImage: null,
  transformationText: 'Where insights become design.',
  solution1: 'Innovation',
  solution2: 'Sustainability',
  solution3: 'Creativity',
  solution4: 'Uniqueness',
  outcome1: 'Happiness',
  outcome2: 'Resilience',
  finalMessage: "We don't just design buildings.\nWe design outcomes that last.",
}

export async function GET() {
  try {
    let page = await prisma.philosophyPage.findUnique({ where: { id: 'main' } })
    if (!page) {
      page = await prisma.philosophyPage.create({ data: { id: 'main', updatedAt: new Date() } })
    }
    return NextResponse.json({ ...DEFAULTS, ...Object.fromEntries(Object.entries(page).filter(([, v]) => v !== null)) })
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
        heroTitle: data.heroTitle || DEFAULTS.heroTitle,
        heroSubtitle: data.heroSubtitle || null,
        introText: data.introText || null,
        introImage: data.introImage || null,
        humanTitle: data.humanTitle || DEFAULTS.humanTitle,
        humanDescription: data.humanDescription || null,
        humanImage: data.humanImage || null,
        envTitle: data.envTitle || DEFAULTS.envTitle,
        envDescription: data.envDescription || null,
        envImage: data.envImage || null,
        cultureTitle: data.cultureTitle || DEFAULTS.cultureTitle,
        cultureDescription: data.cultureDescription || null,
        cultureImage: data.cultureImage || null,
        transformationText: data.transformationText || null,
        solution1: data.solution1 || DEFAULTS.solution1,
        solution2: data.solution2 || DEFAULTS.solution2,
        solution3: data.solution3 || DEFAULTS.solution3,
        solution4: data.solution4 || DEFAULTS.solution4,
        outcome1: data.outcome1 || DEFAULTS.outcome1,
        outcome2: data.outcome2 || DEFAULTS.outcome2,
        finalMessage: data.finalMessage || null,
      },
      create: {
        id: 'main',
        heroTitle: data.heroTitle || DEFAULTS.heroTitle,
        heroSubtitle: data.heroSubtitle || null,
        introText: data.introText || null,
        introImage: data.introImage || null,
        humanTitle: data.humanTitle || DEFAULTS.humanTitle,
        humanDescription: data.humanDescription || null,
        humanImage: data.humanImage || null,
        envTitle: data.envTitle || DEFAULTS.envTitle,
        envDescription: data.envDescription || null,
        envImage: data.envImage || null,
        cultureTitle: data.cultureTitle || DEFAULTS.cultureTitle,
        cultureDescription: data.cultureDescription || null,
        cultureImage: data.cultureImage || null,
        transformationText: data.transformationText || null,
        solution1: data.solution1 || DEFAULTS.solution1,
        solution2: data.solution2 || DEFAULTS.solution2,
        solution3: data.solution3 || DEFAULTS.solution3,
        solution4: data.solution4 || DEFAULTS.solution4,
        outcome1: data.outcome1 || DEFAULTS.outcome1,
        outcome2: data.outcome2 || DEFAULTS.outcome2,
        finalMessage: data.finalMessage || null,
      },
    })
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating philosophy page:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
