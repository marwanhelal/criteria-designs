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

    // 4. Add philosophyImage column to SiteSettings table if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "philosophyImage" TEXT;
      `)
      results.push('✓ philosophyImage column ensured on SiteSettings table')
    } catch (e) {
      results.push(`✗ philosophyImage: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 5. Add heroVideo column to SiteSettings table if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroVideo" TEXT;
      `)
      results.push('✓ heroVideo column ensured on SiteSettings table')
    } catch (e) {
      results.push(`✗ heroVideo: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 6. Create index on ProjectTimeline.projectId if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "ProjectTimeline_projectId_idx" ON "ProjectTimeline"("projectId");
      `)
      results.push('✓ ProjectTimeline index ensured')
    } catch (e) {
      results.push(`✗ ProjectTimeline index: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 7. CEO Banner columns on SiteSettings
    const ceoColumns = [
      'ceoNameEn', 'ceoNameAr', 'ceoTitleEn', 'ceoTitleAr',
      'ceoImage', 'ceoBgImage',
      'ceoStat1Number', 'ceoStat1LabelEn', 'ceoStat1LabelAr', 'ceoStat1DescEn', 'ceoStat1DescAr',
      'ceoStat2Number', 'ceoStat2LabelEn', 'ceoStat2LabelAr',
      'ceoStat3Number', 'ceoStat3LabelEn', 'ceoStat3LabelAr',
      'ceoStat4Number', 'ceoStat4LabelEn', 'ceoStat4LabelAr',
      'ceoLogo1', 'ceoLogo2', 'ceoLogo3', 'ceoLogo4', 'ceoLogo5',
      'ceoBtnTextEn', 'ceoBtnTextAr', 'ceoBtnLink',
    ]
    for (const col of ceoColumns) {
      try {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "${col}" TEXT;`
        )
        results.push(`✓ ${col} column ensured on SiteSettings`)
      } catch (e) {
        results.push(`✗ ${col}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    // 8. Showcase project columns on SiteSettings
    const showcaseColumns = [
      'showcaseProject1Id', 'showcaseProject2Id', 'showcaseProject3Id',
      'showcaseProject4Id', 'showcaseProject5Id',
    ]
    for (const col of showcaseColumns) {
      try {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "${col}" TEXT;`
        )
        results.push(`✓ ${col} column ensured on SiteSettings`)
      } catch (e) {
        results.push(`✗ ${col}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    // 9. Final Reveal columns on Project
    const finalRevealColumns = [
      'finalRevealTitleEn', 'finalRevealTitleAr',
      'finalRevealSubtitleEn', 'finalRevealSubtitleAr',
    ]
    for (const col of finalRevealColumns) {
      try {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "${col}" TEXT;`
        )
        results.push(`✓ ${col} column ensured on Project`)
      } catch (e) {
        results.push(`✗ ${col}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    // 10. Add section column to ProjectImage
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "ProjectImage" ADD COLUMN IF NOT EXISTS "section" TEXT DEFAULT 'gallery';
      `)
      results.push('✓ section column ensured on ProjectImage table')
    } catch (e) {
      results.push(`✗ section: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 11. Migrate existing images: order=0 → 'hero', order>=7 → 'final_reveal'
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE "ProjectImage" SET "section" = 'hero'
        WHERE "order" = 0 AND "section" = 'gallery';
      `)
      await prisma.$executeRawUnsafe(`
        UPDATE "ProjectImage" SET "section" = 'final_reveal'
        WHERE "order" >= 7 AND "section" = 'gallery';
      `)
      results.push('✓ Migrated existing images to section values')
    } catch (e) {
      results.push(`✗ image section migration: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 12. Create Client table
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Client" (
          "id" TEXT NOT NULL,
          "nameEn" TEXT NOT NULL,
          "logo" TEXT,
          "bgColor" TEXT NOT NULL DEFAULT '#FFFFFF',
          "order" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
        );
      `)
      results.push('✓ Client table ensured')
    } catch (e) {
      results.push(`✗ Client table: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 13. Add bgColor column to Client table (for existing tables)
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "bgColor" TEXT NOT NULL DEFAULT '#FFFFFF';
      `)
      results.push('✓ bgColor column ensured on Client table')
    } catch (e) {
      results.push(`✗ bgColor: ${e instanceof Error ? e.message : String(e)}`)
    }

    // 14. Create Award table
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Award" (
          "id" TEXT NOT NULL,
          "titleEn" TEXT NOT NULL,
          "titleAr" TEXT NOT NULL,
          "year" INTEGER NOT NULL,
          "subtitleEn" TEXT,
          "subtitleAr" TEXT,
          "image" TEXT,
          "order" INTEGER NOT NULL DEFAULT 0,
          "status" TEXT NOT NULL DEFAULT 'DRAFT',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
        );
      `)
      results.push('✓ Award table ensured')
    } catch (e) {
      results.push(`✗ Award table: ${e instanceof Error ? e.message : String(e)}`)
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

    // Check CEO banner columns
    try {
      await prisma.$queryRawUnsafe(`SELECT "ceoNameEn" FROM "SiteSettings" LIMIT 1`)
      status.ceoBanner = 'exists'
    } catch {
      status.ceoBanner = 'missing'
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
