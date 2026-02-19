import { execFile } from 'child_process'
import { promisify } from 'util'
import { unlink, stat, rename } from 'fs/promises'
import { basename } from 'path'
import { prisma } from './db'

const execFileAsync = promisify(execFile)

/**
 * Transcodes a video file to web-optimised H.264 MP4 **in-place**.
 * The optimised content overwrites the original file so the URL never changes.
 * Runs in the background (fire-and-forget) — does NOT block the upload response.
 *
 * ffmpeg flags:
 *   -c:v libx264        → H.264, universally supported by all browsers
 *   -crf 28             → Quality-based encoding (~28 = good quality, much smaller file)
 *   -preset medium      → Balance between speed and compression
 *   -movflags +faststart → Moves moov atom to front — video starts playing immediately
 *   -vf scale=...       → Cap at 1920px wide, maintain aspect ratio
 *   -an                 → Remove audio (background/hero videos)
 */
export async function transcodeAndUpdate(
  inputPath: string,
  mediaId: string
): Promise<void> {
  // Write to a temp file first; on success, rename over the original.
  // This keeps the URL identical so any saved settings remain valid.
  const tmpPath = `${inputPath}.transcoding.tmp`

  try {
    console.log(`[transcode] Starting: ${basename(inputPath)}`)

    await execFileAsync('ffmpeg', [
      '-i',        inputPath,
      '-c:v',      'libx264',
      '-crf',      '32',           // More aggressive: ~5-12MB for a 60s background clip
      '-preset',   'fast',         // Faster encode, still good compression
      '-movflags', '+faststart',   // moov atom at front → plays instantly, no full download
      '-vf',       "scale='min(1280,iw):-2'", // 1280px max — plenty for a full-screen background
      '-an',                       // No audio (hero background video)
      '-y',
      tmpPath,
    ], { maxBuffer: 10 * 1024 * 1024 }) // 10 MB buffer for ffmpeg stderr logs

    const { size } = await stat(tmpPath)

    // Replace the original with the optimised version (same path → same URL)
    await unlink(inputPath).catch(() => {})
    await rename(tmpPath, inputPath)

    // Update only size and mimeType — URL stays the same
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        mimeType: 'video/mp4',
        size,
      },
    })

    console.log(`[transcode] Done: ${basename(inputPath)} (${Math.round(size / 1024 / 1024)} MB)`)
  } catch (err) {
    console.error('[transcode] Failed:', err)
    // Clean up the temp file; leave the original intact so the video still works
    await unlink(tmpPath).catch(() => {})
  }
}
