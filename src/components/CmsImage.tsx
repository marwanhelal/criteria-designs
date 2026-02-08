'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CmsImageProps {
  src: string | null | undefined
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

/**
 * CmsImage: A wrapper around Next.js Image that handles CMS-uploaded images.
 * - Maintains exact design aspect ratios via width/height or fill mode
 * - Uses object-fit: cover so any uploaded image fills the container perfectly
 * - Handles loading state with a shimmer placeholder
 * - Falls back gracefully if no image URL
 */
export default function CmsImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
}: CmsImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    )
  }

  // Determine if external URL or local
  const isExternal = src.startsWith('http://') || src.startsWith('https://')

  return (
    <div className={`relative overflow-hidden ${className}`} style={!fill ? { width, height } : undefined}>
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          className={`object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          {...(!isExternal ? {} : { unoptimized: true })}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          {...(!isExternal ? {} : { unoptimized: true })}
        />
      )}
    </div>
  )
}
