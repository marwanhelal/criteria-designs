import { unlink } from 'fs/promises'
import { join } from 'path'
import { prisma } from './db'

/**
 * Delete an uploaded file from disk and remove its Media record.
 * Safe to call with null/undefined — silently does nothing.
 */
export async function deleteFile(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith('/api/uploads/')) return

  const filename = url.replace('/api/uploads/', '')
  const filepath = join(process.cwd(), 'public', 'uploads', filename)

  // Delete physical file (ignore if already gone)
  try { await unlink(filepath) } catch {}

  // Remove Media record (ignore if not found)
  try { await prisma.media.deleteMany({ where: { url } }) } catch {}
}

/**
 * Delete multiple files in parallel.
 */
export async function deleteFiles(urls: (string | null | undefined)[]): Promise<void> {
  await Promise.all(urls.map(deleteFile))
}
