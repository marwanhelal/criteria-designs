'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, Trash2, Copy, Check, Download, FolderOpen, Move } from 'lucide-react'

interface Media {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  alt: string | null
  folder: string
  createdAt: string
}

const FOLDERS = [
  { key: 'all',      label: 'All Files',  color: 'bg-gray-500' },
  { key: 'homepage', label: 'Homepage',   color: 'bg-blue-500' },
  { key: 'projects', label: 'Projects',   color: 'bg-green-500' },
  { key: 'awards',   label: 'Awards',     color: 'bg-yellow-500' },
  { key: 'team',     label: 'Team',       color: 'bg-purple-500' },
  { key: 'clients',  label: 'Clients',    color: 'bg-pink-500' },
  { key: 'other',    label: 'Other',      color: 'bg-gray-400' },
]

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeFolder, setActiveFolder] = useState('all')
  const [copied, setCopied] = useState<string | null>(null)
  const [movingId, setMovingId] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})

  const fetchMedia = useCallback(async (folder: string) => {
    setLoading(true)
    try {
      const url = folder === 'all' ? '/api/media' : `/api/media?folder=${folder}`
      const res = await fetch(url)
      const data = await res.json()
      setMedia(data)
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/media')
      const all: Media[] = await res.json()
      const c: Record<string, number> = { all: all.length }
      for (const f of FOLDERS.slice(1)) {
        c[f.key] = all.filter(m => m.folder === f.key).length
      }
      setCounts(c)
    } catch {}
  }, [])

  useEffect(() => {
    fetchMedia(activeFolder)
    fetchCounts()
  }, [activeFolder, fetchMedia, fetchCounts])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', activeFolder === 'all' ? 'other' : activeFolder)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (res.ok) {
          const newMedia = await res.json()
          setMedia(prev => [newMedia, ...prev])
        }
      }
      fetchCounts()
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file permanently? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== id))
        fetchCounts()
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const handleMove = async (id: string, newFolder: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: newFolder })
      })
      if (res.ok) {
        if (activeFolder !== 'all') {
          setMedia(prev => prev.filter(m => m.id !== id))
        } else {
          setMedia(prev => prev.map(m => m.id === id ? { ...m, folder: newFolder } : m))
        }
        fetchCounts()
      }
    } catch (error) {
      console.error('Error moving media:', error)
    } finally {
      setMovingId(null)
    }
  }

  const copyUrl = (url: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
    } else {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  const activeFolderInfo = FOLDERS.find(f => f.key === activeFolder)

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar */}
      <div className="w-48 shrink-0">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Folders</h2>
        <div className="space-y-1">
          {FOLDERS.map(folder => (
            <button
              key={folder.key}
              onClick={() => setActiveFolder(folder.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                activeFolder === folder.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${folder.color}`} />
                {folder.label}
              </div>
              {counts[folder.key] !== undefined && (
                <span className={`text-xs rounded-full px-1.5 ${
                  activeFolder === folder.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {counts[folder.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Media Library</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeFolderInfo?.label} — {counts[activeFolder] ?? 0} files
            </p>
          </div>
          <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload size={20} />
            {uploading ? 'Uploading...' : 'Upload Files'}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : media.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No files in {activeFolderInfo?.label}</p>
            <label className="text-blue-600 hover:underline cursor-pointer text-sm">
              Upload files here
              <input type="file" accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group relative">
                <div className="aspect-square relative">
                  {item.mimeType.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                        const parent = (e.target as HTMLImageElement).parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-400 text-xs p-2 text-center"><span>⚠</span><span>File missing</span></div>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-xs uppercase">{item.mimeType.split('/')[1]}</span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button onClick={() => copyUrl(item.url)} className="p-1.5 bg-white rounded-full hover:bg-gray-100" title="Copy URL">
                      {copied === item.url ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                    <button onClick={() => handleDownload(item.url, item.filename)} className="p-1.5 bg-white rounded-full hover:bg-gray-100 text-blue-600" title="Download">
                      <Download size={14} />
                    </button>
                    <button onClick={() => setMovingId(movingId === item.id ? null : item.id)} className="p-1.5 bg-white rounded-full hover:bg-gray-100 text-orange-500" title="Move to folder">
                      <Move size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white rounded-full hover:bg-gray-100 text-red-600" title="Delete permanently">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Folder badge */}
                  {activeFolder === 'all' && (
                    <div className={`absolute top-1 left-1 text-white text-[10px] px-1.5 py-0.5 rounded-full ${FOLDERS.find(f => f.key === item.folder)?.color ?? 'bg-gray-400'}`}>
                      {FOLDERS.find(f => f.key === item.folder)?.label ?? item.folder}
                    </div>
                  )}
                </div>

                {/* Move dropdown */}
                {movingId === item.id && (
                  <div className="absolute top-0 left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1.5 px-1">Move to folder:</p>
                    {FOLDERS.slice(1).map(f => (
                      <button
                        key={f.key}
                        onClick={() => handleMove(item.id, f.key)}
                        disabled={item.folder === f.key}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left transition-colors ${
                          item.folder === f.key
                            ? 'text-gray-300 cursor-default'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${f.color}`} />
                        {f.label}
                        {item.folder === f.key && ' ✓'}
                      </button>
                    ))}
                    <button onClick={() => setMovingId(null)} className="w-full text-xs text-gray-400 hover:text-gray-600 mt-1 pt-1 border-t">
                      Cancel
                    </button>
                  </div>
                )}

                <div className="p-2">
                  <p className="text-xs text-gray-700 truncate" title={item.filename}>{item.filename}</p>
                  <p className="text-xs text-gray-400">{formatSize(item.size)} · {formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
