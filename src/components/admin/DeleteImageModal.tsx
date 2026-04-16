'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// DELETE IMAGE — hook + modal
// ─────────────────────────────────────────────────────────────────────────────

interface PendingDelete {
  url: string
  onConfirmed: () => void
}

export function useDeleteImage() {
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const confirmDeleteImage = (url: string, onConfirmed: () => void) => {
    if (!url) { onConfirmed(); return }
    setDeleteError(null)
    setPendingDelete({ url, onConfirmed })
  }

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pendingDelete.url }),
      })
      if (!res.ok) throw new Error('Server returned an error')
      pendingDelete.onConfirmed()
      setPendingDelete(null)
    } catch {
      setDeleteError('Failed to delete the image. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    setPendingDelete(null)
    setDeleteError(null)
  }

  return { confirmDeleteImage, pendingDelete, deleting, deleteError, handleDeleteConfirmed, handleCancel }
}

export function DeleteImageModal({
  open,
  onConfirm,
  onCancel,
  deleting,
  error,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
  error?: string | null
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
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}
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

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM RECORD DELETE — hook + modal (for deleting entire records)
// ─────────────────────────────────────────────────────────────────────────────

interface PendingConfirm {
  message: string
  onConfirmed: () => Promise<void>
}

export function useConfirmDelete() {
  const [pending, setPending] = useState<PendingConfirm | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  const confirmDelete = (message: string, onConfirmed: () => Promise<void>) => {
    setConfirmError(null)
    setPending({ message, onConfirmed })
  }

  const handleConfirmed = async () => {
    if (!pending) return
    setConfirming(true)
    setConfirmError(null)
    try {
      await pending.onConfirmed()
      setPending(null)
    } catch {
      setConfirmError('Something went wrong. Please try again.')
    } finally {
      setConfirming(false)
    }
  }

  const handleCancel = () => {
    setPending(null)
    setConfirmError(null)
  }

  return { confirmDelete, pending, confirming, confirmError, handleConfirmed, handleCancel }
}

export function ConfirmDeleteModal({
  open,
  message,
  onConfirm,
  onCancel,
  confirming,
  error,
}: {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirming: boolean
  error?: string | null
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
            <h3 className="font-semibold text-gray-900">Are you sure?</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {confirming ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
