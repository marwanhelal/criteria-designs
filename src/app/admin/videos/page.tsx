'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, Youtube, GripVertical, ExternalLink } from 'lucide-react'

interface Video {
  id: string
  titleEn: string
  youtubeUrl: string
  description: string | null
  order: number
}

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return watchMatch[1]
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]
  const embedMatch = url.match(/embed\/([^?&]+)/)
  if (embedMatch) return embedMatch[1]
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim()
  return null
}

const EMPTY_FORM = { titleEn: '', youtubeUrl: '', description: '', order: 0 }

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Video>>({})

  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.ok ? r.json() : [])
      .then(setVideos)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.titleEn.trim() || !addForm.youtubeUrl.trim()) return
    setAdding(true)
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addForm, order: videos.length }),
      })
      if (res.ok) {
        const created = await res.json()
        setVideos(prev => [...prev, created])
        setAddForm(EMPTY_FORM)
        setShowAdd(false)
      } else {
        alert('Failed to add video')
      }
    } catch {
      alert('Failed to add video')
    } finally {
      setAdding(false)
    }
  }

  const handleEdit = async (id: string) => {
    setSaving(id)
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        const updated = await res.json()
        setVideos(prev => prev.map(v => v.id === id ? updated : v))
        setEditId(null)
      } else {
        alert('Failed to save')
      }
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
      if (res.ok) setVideos(prev => prev.filter(v => v.id !== id))
      else alert('Failed to delete')
    } catch {
      alert('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const startEdit = (video: Video) => {
    setEditId(video.id)
    setEditForm({ titleEn: video.titleEn, youtubeUrl: video.youtubeUrl, description: video.description || '', order: video.order })
  }

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">YouTube Videos</h1>
          <p className="text-sm text-gray-500 mt-1">Videos are embedded on the Founder &amp; Team page. Paste any YouTube URL.</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditId(null) }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Add Video
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">New Video</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={addForm.titleEn}
                onChange={e => setAddForm(p => ({ ...p, titleEn: e.target.value }))}
                placeholder="e.g. Luxor Island Project Overview"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL *</label>
              <input
                type="text"
                value={addForm.youtubeUrl}
                onChange={e => setAddForm(p => ({ ...p, youtubeUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              {addForm.youtubeUrl && !getYouTubeId(addForm.youtubeUrl) && (
                <p className="text-xs text-red-500 mt-1">Could not detect a valid YouTube video ID.</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              value={addForm.description}
              onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))}
              rows={2}
              placeholder="Short description shown below the video…"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Preview */}
          {addForm.youtubeUrl && getYouTubeId(addForm.youtubeUrl) && (
            <div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9', maxWidth: 480 }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(addForm.youtubeUrl)}`}
                title={addForm.titleEn || 'Preview'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={adding} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <Save size={16} /> {adding ? 'Adding…' : 'Add Video'}
            </button>
            <button type="button" onClick={() => { setShowAdd(false); setAddForm(EMPTY_FORM) }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Video list */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Youtube size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No videos yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Video" to add your first YouTube video.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video, i) => {
            const ytId = getYouTubeId(video.youtubeUrl)
            const isEditing = editId === video.id
            return (
              <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                {isEditing ? (
                  <div className="p-5 space-y-4">
                    <h3 className="font-medium text-gray-800">Editing video</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" value={editForm.titleEn || ''} onChange={e => setEditForm(p => ({ ...p, titleEn: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                        <input type="text" value={editForm.youtubeUrl || ''} onChange={e => setEditForm(p => ({ ...p, youtubeUrl: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input type="number" value={editForm.order ?? 0} onChange={e => setEditForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(video.id)} disabled={saving === video.id} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        <Save size={16} /> {saving === video.id ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={() => setEditId(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 p-4">
                    <div className="flex items-center text-gray-300 pt-1 shrink-0">
                      <GripVertical size={18} />
                    </div>
                    {/* Thumbnail */}
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-black shrink-0">
                      {ytId ? (
                        <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={video.titleEn} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Youtube size={24} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 truncate">{video.titleEn}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{video.youtubeUrl}</p>
                          {video.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>}
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">#{i + 1}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ytId && (
                        <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Open on YouTube">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button onClick={() => startEdit(video)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">Edit</button>
                      <button onClick={() => handleDelete(video.id)} disabled={deleting === video.id} className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
