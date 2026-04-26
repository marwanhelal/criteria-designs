'use client'

import { Plus, X } from 'lucide-react'

interface GalleryImage { url: string; alt?: string }

interface Props {
  images: GalleryImage[]
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (url: string) => void
}

export default function AwardGallerySection({ images, uploading, onUpload, onRemove }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-lg border-b pb-2">Gallery Photos</h2>
        <p className="text-sm text-gray-500 mt-2">
          Add multiple photos for this award. When expanded on the homepage, images will automatically
          cycle through in a slideshow. The primary image above is shown first.
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={img.url} className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt || `Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(img.url)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X size={11} className="text-white" />
            </button>
            <span className="absolute bottom-1 left-1 text-[9px] text-white/60 font-mono">{i + 1}</span>
          </div>
        ))}

        {/* Upload button */}
        <label className={`w-32 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 ${uploading ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/40'}`}>
          {uploading ? (
            <span className="text-xs text-gray-400">Uploading…</span>
          ) : (
            <>
              <Plus size={18} className="text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Add Photo</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {images.length === 0 && (
        <p className="text-xs text-gray-400">No gallery photos yet. Click "Add Photo" to upload.</p>
      )}
    </div>
  )
}
