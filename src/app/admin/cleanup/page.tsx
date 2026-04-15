'use client'

import { useState } from 'react'
import { Trash2, ScanSearch, AlertTriangle, CheckCircle } from 'lucide-react'

interface OrphanFile {
  url: string
  size: number
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function CleanupPage() {
  const [scanning, setScanning] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [orphans, setOrphans] = useState<OrphanFile[] | null>(null)
  const [result, setResult] = useState<{ deleted: number; totalSize: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async () => {
    setScanning(true)
    setOrphans(null)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/cleanup-orphans')
      if (!res.ok) throw new Error('Scan failed')
      const data = await res.json()
      setOrphans(data.orphans)
    } catch (err) {
      setError('Failed to scan. Please try again.')
      console.error(err)
    } finally {
      setScanning(false)
    }
  }

  const handleDelete = async () => {
    if (!orphans || orphans.length === 0) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/cleanup-orphans', { method: 'POST' })
      if (!res.ok) throw new Error('Deletion failed')
      const data = await res.json()
      setResult(data)
      setOrphans([])
    } catch (err) {
      setError('Failed to delete files. Please try again.')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const totalSize = orphans?.reduce((sum, f) => sum + f.size, 0) ?? 0

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Storage Cleanup</h1>
        <p className="mt-1 text-sm text-gray-500">
          Scan for uploaded files that are no longer used anywhere in the CMS and permanently delete them.
        </p>
      </div>

      {/* Action card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <ScanSearch size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Scan Unused Files</h2>
            <p className="text-sm text-gray-500 mt-1">
              Checks every uploaded file against all CMS records (projects, team, awards, clients, settings, philosophy, blog, services).
              Any file not referenced anywhere will be listed below.
            </p>
            <button
              onClick={handleScan}
              disabled={scanning || deleting}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              <ScanSearch size={16} />
              {scanning ? 'Scanning…' : 'Scan Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-sm text-red-700">
          <AlertTriangle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Success result */}
      {result && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6 text-sm text-green-700">
          <CheckCircle size={16} className="shrink-0" />
          Deleted <strong>{result.deleted}</strong> file{result.deleted !== 1 ? 's' : ''} and freed <strong>{formatBytes(result.totalSize)}</strong> of storage.
        </div>
      )}

      {/* Scan results */}
      {orphans !== null && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <span className="font-semibold text-gray-900">
                {orphans.length === 0 ? 'No orphaned files found' : `${orphans.length} orphaned file${orphans.length !== 1 ? 's' : ''} found`}
              </span>
              {orphans.length > 0 && (
                <span className="ml-2 text-sm text-gray-400">({formatBytes(totalSize)} total)</span>
              )}
            </div>
            {orphans.length > 0 && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={15} />
                {deleting ? 'Deleting…' : `Delete All ${orphans.length} File${orphans.length !== 1 ? 's' : ''}`}
              </button>
            )}
          </div>

          {orphans.length > 0 ? (
            <ul className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {orphans.map(file => (
                <li key={file.url} className="flex items-center justify-between px-6 py-3 text-sm">
                  <span className="text-gray-600 font-mono truncate max-w-sm">{file.url.replace('/api/uploads/', '')}</span>
                  <span className="text-gray-400 shrink-0 ml-4">{formatBytes(file.size)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              All uploaded files are in use. Nothing to clean up.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
