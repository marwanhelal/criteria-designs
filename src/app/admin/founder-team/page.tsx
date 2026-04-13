'use client'

import { useState, useEffect } from 'react'
import { Save, Users } from 'lucide-react'
import Link from 'next/link'

export default function FounderTeamAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    founderSectionTitleEn: '',
    founderNameEn: '',
    founderTitleEn: '',
    founderDescriptionEn: '',
    founderImage: '',
    teamSectionTitleEn: '',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setForm({
          founderSectionTitleEn: d.founderSectionTitleEn || '',
          founderNameEn: d.founderNameEn || '',
          founderTitleEn: d.founderTitleEn || '',
          founderDescriptionEn: d.founderDescriptionEn || '',
          founderImage: d.founderImage || '',
          teamSectionTitleEn: d.teamSectionTitleEn || '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const media = await res.json()
        setForm(prev => ({ ...prev, founderImage: media.url }))
      } else {
        alert('Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Fetch full existing settings first so we don't overwrite other fields
      const existing = await fetch('/api/settings').then(r => r.json())
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...existing, ...form }),
      })
      if (res.ok) {
        alert('Saved successfully!')
      } else {
        alert('Failed to save')
      }
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Founder &amp; Team Section</h1>
        <button
          form="founder-team-form"
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <form id="founder-team-form" onSubmit={handleSubmit} className="space-y-6">

        {/* ── Founder / CEO ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Founder / CEO</h2>
          <p className="text-sm text-gray-500">
            Displayed on the left side of the Founder &amp; Team section on the homepage.
          </p>

          {/* Section heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={form.founderSectionTitleEn}
              onChange={e => setForm({ ...form, founderSectionTitleEn: e.target.value })}
              placeholder="Our Founder and CEO"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Name + Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.founderNameEn}
                onChange={e => setForm({ ...form, founderNameEn: e.target.value })}
                placeholder="e.g. Hesham A. Helal"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title / Role
              </label>
              <input
                type="text"
                value={form.founderTitleEn}
                onChange={e => setForm({ ...form, founderTitleEn: e.target.value })}
                placeholder="e.g. CEO & Founder, M.Sc"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.founderDescriptionEn}
              onChange={e => setForm({ ...form, founderDescriptionEn: e.target.value })}
              rows={4}
              placeholder="Visionary leader and founder, [Name] has shaped the organization with innovation and integrity..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Portrait Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portrait Photo
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Displayed as a full-height portrait on the left side of the founder panel.
            </p>
            <div className="flex items-start gap-5">
              {/* Preview */}
              <div className="w-28 h-36 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                {form.founderImage ? (
                  <img src={form.founderImage} alt="Founder" className="w-full h-full object-cover object-top" />
                ) : (
                  <span className="text-gray-400 text-xs text-center px-2">No photo</span>
                )}
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm text-center">
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.founderImage && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, founderImage: '' }))}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Team Showcase ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Team Showcase</h2>
          <p className="text-sm text-gray-500">
            Displayed on the right side — team members are pulled automatically from the Team section.
          </p>

          {/* Team section heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={form.teamSectionTitleEn}
              onChange={e => setForm({ ...form, teamSectionTitleEn: e.target.value })}
              placeholder="Modern Creative Team Showcase"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Link to team management */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Users size={18} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-sm text-gray-600">
                Team members (photos, names, roles) are managed in the{' '}
                <Link href="/admin/team" className="text-blue-600 hover:underline font-medium">
                  Team section
                </Link>
                . Add or edit team members there and they will appear here automatically.
              </p>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}
