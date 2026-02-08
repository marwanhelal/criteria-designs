import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/migrate - Run database migrations manually
export async function POST() {
  const results: string[] = []

  try {
    // 1. Add clientLogo column to Project table if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "clientLogo" TEXT;
      `)
      results.push('✓ clientLogo column ensured on Project table')
    } catch (e) {
      results.push(`✗ clientLogo: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 2. Create ProjectTimeline table if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ProjectTimeline" (
          "id" TEXT NOT NULL,
          "titleEn" TEXT NOT NULL,
          "titleAr" TEXT NOT NULL,
          "descriptionEn" TEXT NOT NULL,
          "descriptionAr" TEXT NOT NULL,
          "image" TEXT,
          "order" INTEGER NOT NULL DEFAULT 0,
          "projectId" TEXT NOT NULL,
          CONSTRAINT "ProjectTimeline_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "ProjectTimeline_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `)
      results.push('✓ ProjectTimeline table ensured')
    } catch (e) {
      results.push(`✗ ProjectTimeline: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 3. Add heroImage column to SiteSettings table if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroImage" TEXT;
      `)
      results.push('✓ heroImage column ensured on SiteSettings table')
    } catch (e) {
      results.push(`✗ heroImage: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 4. Create index on ProjectTimeline.projectId if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "ProjectTimeline_projectId_idx" ON "ProjectTimeline"("projectId");
      `)
      results.push('✓ ProjectTimeline index ensured')
    } catch (e) {
      results.push(`✗ ProjectTimeline index: ${e instanceof Error ? e.message : String(e)}`)
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { success: false, error: 'Migration failed', results },
      { status: 500 }
    )
  }
}

// GET /api/migrate - Check current schema status
export async function GET() {
  const status: Record<string, unknown> = {}

  try {
    // Check if clientLogo column exists
    try {
      await prisma.$queryRawUnsafe(`SELECT "clientLogo" FROM "Project" LIMIT 1`)
      status.clientLogo = 'exists'
    } catch {
      status.clientLogo = 'missing'
    }

    // Check if heroImage column exists on SiteSettings
    try {
      await prisma.$queryRawUnsafe(`SELECT "heroImage" FROM "SiteSettings" LIMIT 1`)
      status.heroImage = 'exists'
    } catch {
      status.heroImage = 'missing'
    }

    // Check if ProjectTimeline table exists
    try {
      await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM "ProjectTimeline"`)
      status.projectTimeline = 'exists'
    } catch {
      status.projectTimeline = 'missing'
    }

    return NextResponse.json({ status })
  } catch (error) {
    console.error('Schema check error:', error)
    return NextResponse.json(
      { error: 'Failed to check schema' },
      { status: 500 }
    )
  }
}
