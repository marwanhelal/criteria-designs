'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Client {
  id: string
  nameEn: string
  logo: string | null
  bgColor: string
  order: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLogo, setNewLogo] = useState('')
  const [newBgColor, setNewBgColor] = useState('#FFFFFF')
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      setClients(await res.json())
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameEn: newName.trim(), logo: newLogo || null, bgColor: newBgColor, order: clients.length }),
      })
      const created = await res.json()
      setClients(prev => [...prev, created])
      setNewName('')
      setNewLogo('')
      setNewBgColor('#FFFFFF')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    setClients(prev => prev.filter(c => c.id !== id))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      setNewLogo(data.url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
      </div>

      {/* Add new client */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Add Client</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Client name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Logo URL (or upload below)"
              value={newLogo}
              onChange={e => setNewLogo(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
              {uploading ? 'Uploading...' : 'Upload logo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>

          {/* Background color */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 whitespace-nowrap">Card background:</label>
            <input
              type="color"
              value={newBgColor}
              onChange={e => setNewBgColor(e.target.value)}
              className="w-9 h-9 rounded cursor-pointer border border-gray-200"
            />
            <input
              type="text"
              value={newBgColor}
              onChange={e => setNewBgColor(e.target.value)}
              className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 font-mono"
              placeholder="#FFFFFF"
            />
            <div
              className="w-8 h-8 rounded border border-gray-200 shrink-0"
              style={{ backgroundColor: newBgColor }}
            />
          </div>

          {newLogo && (
            <div className="flex items-center gap-3">
              <div className="h-12 w-24 flex items-center justify-center rounded border" style={{ backgroundColor: newBgColor }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={newLogo} alt="preview" className="max-h-10 max-w-full object-contain" />
              </div>
              <span className="text-xs text-gray-400">Preview with background</span>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={saving || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 w-fit"
          >
            <Plus size={14} />
            {saving ? 'Adding...' : 'Add Client'}
          </button>
        </div>
      </div>

      {/* Client list */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : clients.length === 0 ? (
        <p className="text-sm text-gray-400">No clients yet. Add your first client above.</p>
      ) : (
        <div className="space-y-2">
          {clients.map(client => (
            <div key={client.id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3">
              <GripVertical size={16} className="text-gray-300 shrink-0" />
              <div
                className="h-9 w-16 flex items-center justify-center rounded shrink-0"
                style={{ backgroundColor: client.bgColor || '#FFFFFF' }}
              >
                {client.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={client.logo} alt={client.nameEn} className="max-h-7 max-w-full object-contain" />
                ) : null}
              </div>
              <span className="flex-1 text-sm text-gray-800">{client.nameEn}</span>
              <div className="w-5 h-5 rounded border border-gray-200 shrink-0" style={{ backgroundColor: client.bgColor || '#FFFFFF' }} title={client.bgColor} />
              <button
                onClick={() => handleDelete(client.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
