'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface PendingDelete {
  url: string
  onConfirmed: () => void
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useDeleteImage() {
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDeleteImage = (url: string, onConfirmed: () => void) => {
    if (!url) { onConfirmed(); return }
    setPendingDelete({ url, onConfirmed })
  }

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pendingDelete.url }),
      })
      pendingDelete.onConfirmed()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  const handleCancel = () => setPendingDelete(null)

  return { confirmDeleteImage, pendingDelete, deleting, handleDeleteConfirmed, handleCancel }
}

// ── Modal UI ──────────────────────────────────────────────────────────────────
export function DeleteImageModal({
  open,
  onConfirm,
  onCancel,
  deleting,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-start gap-3 mb-5">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Delete Image?</h3>
            <p className="text-sm text-gray-500 mt-1">
              This image will be permanently deleted from the server and cannot be recovered.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
