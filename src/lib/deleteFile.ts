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
  try {
    await unlink(filepath)
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code
    if (code !== 'ENOENT') {
      console.warn(`[deleteFile] Could not unlink ${filepath}:`, err)
    }
  }

  // Remove Media record (ignore if not found)
  try {
    await prisma.media.deleteMany({ where: { url } })
  } catch (err) {
    console.warn(`[deleteFile] Could not remove Media record for ${url}:`, err)
  }
}

/**
 * Delete multiple files in parallel.
 */
export async function deleteFiles(urls: (string | null | undefined)[]): Promise<void> {
  await Promise.all(urls.map(deleteFile))
}
