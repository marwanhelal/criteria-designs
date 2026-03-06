'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, GripVertical, Save } from 'lucide-react'

interface Award {
  id: string
  titleEn: string
  titleAr: string
  year: number
  subtitleEn: string | null
  image: string | null
  status: string
  order: number
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  const [countries, setCountries] = useState('')
  const [since, setSince] = useState('')
  const [slots, setSlots] = useState(['', '', '', '', ''])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAwards()
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setCountries(d.awardsCountries || '')
          setSince(d.awardsSince || '')
          setSlots([
            d.homepageAward1Id || '',
            d.homepageAward2Id || '',
            d.homepageAward3Id || '',
            d.homepageAward4Id || '',
            d.homepageAward5Id || '',
          ])
        }
      })
      .catch(() => {})
  }, [])

  const fetchAwards = async () => {
    try {
      const res = await fetch('/api/awards')
      const data = await res.json()
      setAwards(data)
    } catch (error) {
      console.error('Error fetching awards:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          awardsCountries: countries,
          awardsSince: since,
          homepageAward1Id: slots[0] || null,
          homepageAward2Id: slots[1] || null,
          homepageAward3Id: slots[2] || null,
          homepageAward4Id: slots[3] || null,
          homepageAward5Id: slots[4] || null,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this award?')) return
    try {
      await fetch(`/api/awards/${id}`, { method: 'DELETE' })
      setAwards(awards.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting award:', error)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  const publishedAwards = awards.filter(a => a.status === 'PUBLISHED')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Awards</h1>
        <Link
          href="/admin/awards/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Award
        </Link>
      </div>

      {/* ── Homepage Section Settings ── */}
      <div className="bg-white rounded-lg shadow p-5 space-y-5">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 className="font-semibold text-base mb-1">Homepage Awards Section</h2>
            <p className="text-xs text-gray-400">Choose exactly which 5 awards appear in the homepage accordion, and set the stats strip values.</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm shrink-0"
          >
            <Save size={16} />
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Accordion Slots */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Accordion Panels (Slots 1–5)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.map((val, i) => (
              <div key={i}>
                <label className="block text-xs text-gray-500 mb-1">Slot {i + 1}</label>
                <select
                  value={val}
                  onChange={e => {
                    const next = [...slots]
                    next[i] = e.target.value
                    setSlots(next)
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="">— None —</option>
                  {publishedAwards.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.year} · {a.titleEn}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Stats Strip</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Countries (e.g. 12+)</label>
              <input
                type="text"
                value={countries}
                onChange={e => setCountries(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="12+"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Since Year (e.g. 2001)</label>
              <input
                type="text"
                value={since}
                onChange={e => setSince(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="2001"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Awards List ── */}
      {awards.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No awards yet</p>
          <Link href="/admin/awards/new" className="text-blue-600 hover:underline">Add your first award</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-10 px-4" />
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Image</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Year</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {awards.map((award) => (
                <tr key={award.id} className="hover:bg-gray-50">
                  <td className="px-4"><GripVertical className="text-gray-400 cursor-move" size={18} /></td>
                  <td className="px-6 py-4">
                    {award.image ? (
                      <img src={award.image} alt={award.titleEn} className="w-16 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No image</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{award.titleEn}</p>
                    <p className="text-sm text-gray-500" dir="rtl">{award.titleAr}</p>
                    {award.subtitleEn && <p className="text-xs text-gray-400 mt-1">{award.subtitleEn}</p>}
                  </td>
                  <td className="px-6 py-4"><span className="font-medium">{award.year}</span></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      award.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{award.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/awards/${award.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(award.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
