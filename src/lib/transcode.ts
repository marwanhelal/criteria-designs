import { execFile } from 'child_process'
import { promisify } from 'util'
import { unlink, stat } from 'fs/promises'
import { join, dirname, basename, extname } from 'path'
import { prisma } from './db'

const execFileAsync = promisify(execFile)

/**
 * Transcodes a video file to web-optimised H.264 MP4.
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
  const dir = dirname(inputPath)
  const base = basename(inputPath, extname(inputPath))
  const outputFilename = `${base}-opt.mp4`
  const outputPath = join(dir, outputFilename)

  try {
    console.log(`[transcode] Starting: ${basename(inputPath)}`)

    await execFileAsync('ffmpeg', [
      '-i',        inputPath,
      '-c:v',      'libx264',
      '-crf',      '28',
      '-preset',   'medium',
      '-movflags', '+faststart',
      '-vf',       "scale='min(1920,iw):-2'",
      '-an',
      '-y',
      outputPath,
    ], { maxBuffer: 10 * 1024 * 1024 }) // 10 MB buffer for ffmpeg stderr logs

    const { size } = await stat(outputPath)

    // Remove the original raw upload
    await unlink(inputPath).catch(() => {})

    // Update the DB record to point to the optimised file
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        url:      `/api/uploads/${outputFilename}`,
        mimeType: 'video/mp4',
        size,
      },
    })

    console.log(`[transcode] Done: ${outputFilename} (${Math.round(size / 1024 / 1024)} MB)`)
  } catch (err) {
    console.error('[transcode] Failed:', err)
    // Leave the original file intact so the video still works (just unoptimised)
    await unlink(outputPath).catch(() => {})
  }
}
