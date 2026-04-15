import { NextResponse } from 'next/server'
import { readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

/** Collect every /api/uploads/... URL currently referenced in the DB */
async function getReferencedUrls(): Promise<Set<string>> {
  const urls = new Set<string>()

  const add = (v: string | null | undefined) => { if (v && v.startsWith('/api/uploads/')) urls.add(v) }

  // ProjectImage
  const projectImages = await prisma.projectImage.findMany({ select: { url: true } })
  projectImages.forEach(r => add(r.url))

  // ProjectTimeline
  const timelines = await prisma.projectTimeline.findMany({ select: { image: true } })
  timelines.forEach(r => add(r.image))

  // Project clientLogo
  const projects = await prisma.project.findMany({ select: { clientLogo: true } })
  projects.forEach(r => add(r.clientLogo))

  // TeamMember
  const team = await prisma.teamMember.findMany({ select: { photo: true } })
  team.forEach(r => add(r.photo))

  // Service
  const services = await prisma.service.findMany({ select: { image: true } })
  services.forEach(r => add(r.image))

  // BlogPost
  const posts = await prisma.blogPost.findMany({ select: { featuredImage: true } })
  posts.forEach(r => add(r.featuredImage))

  // Award
  const awards = await prisma.award.findMany({ select: { image: true } })
  awards.forEach(r => add(r.image))

  // Client
  const clients = await prisma.client.findMany({ select: { logo: true } })
  clients.forEach(r => add(r.logo))

  // SiteSettings
  const settings = await prisma.siteSettings.findFirst()
  if (settings) {
    ;[
      settings.logo, settings.favicon, settings.heroImage, settings.heroVideo,
      settings.philosophyImage, settings.philosophyCultureImage,
      settings.philosophyNatureImage, settings.philosophyArtImage,
      settings.founderImage, settings.aboutImage,
    ].forEach(add)
  }

  // PhilosophyPage
  const philosophy = await prisma.philosophyPage.findFirst()
  if (philosophy) {
    ;[
      philosophy.introImage, philosophy.humanImage, philosophy.envImage,
      philosophy.cultureImage, philosophy.diagramImage,
    ].forEach(add)
  }

  // User avatars
  const users = await prisma.user.findMany({ select: { image: true } })
  users.forEach(r => add(r.image))

  return urls
}

/** GET — scan and return list of orphaned files (no deletion) */
export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const referenced = await getReferencedUrls()

    let files: string[]
    try {
      files = await readdir(uploadsDir)
    } catch {
      return NextResponse.json({ orphans: [], count: 0, totalSize: 0 })
    }

    const orphans: { url: string; size: number }[] = []
    for (const filename of files) {
      const url = `/api/uploads/${filename}`
      if (!referenced.has(url)) {
        const filePath = join(uploadsDir, filename)
        const info = await stat(filePath).catch(() => null)
        orphans.push({ url, size: info?.size ?? 0 })
      }
    }

    const totalSize = orphans.reduce((sum, f) => sum + f.size, 0)
    return NextResponse.json({ orphans, count: orphans.length, totalSize })
  } catch (error) {
    console.error('[cleanup-orphans] GET error:', error)
    return NextResponse.json({ error: 'Failed to scan uploads' }, { status: 500 })
  }
}

/** POST — permanently delete all orphaned files from disk and Media table */
export async function POST() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const referenced = await getReferencedUrls()

    let files: string[]
    try {
      files = await readdir(uploadsDir)
    } catch {
      return NextResponse.json({ deleted: 0, totalSize: 0 })
    }

    let deleted = 0
    let totalSize = 0

    for (const filename of files) {
      const url = `/api/uploads/${filename}`
      if (!referenced.has(url)) {
        const filePath = join(uploadsDir, filename)
        const info = await stat(filePath).catch(() => null)
        totalSize += info?.size ?? 0

        // Delete from disk
        await unlink(filePath).catch(err => {
          if (err.code !== 'ENOENT') console.warn(`[cleanup] Could not delete ${filename}:`, err)
        })

        // Delete Media record
        await prisma.media.deleteMany({ where: { url } }).catch(() => {})

        deleted++
      }
    }

    return NextResponse.json({ deleted, totalSize })
  } catch (error) {
    console.error('[cleanup-orphans] POST error:', error)
    return NextResponse.json({ error: 'Failed to clean up orphans' }, { status: 500 })
  }
}
