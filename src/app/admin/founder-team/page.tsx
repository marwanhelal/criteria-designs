'use client'

import { useState, useEffect } from 'react'
import { Save, Users, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { useDeleteImage, DeleteImageModal } from '@/components/admin/DeleteImageModal'

interface FormState {
  founderSectionTitleEn: string
  founderNameEn: string
  founderTitleEn: string
  founderDescriptionEn: string
  founderImage: string
  teamSectionTitleEn: string
  founderYearsExp: string
  founderProjectsCount: string
  founderCountriesCount: string
  founderPapersCount: string
  founderBioCol1En: string
  founderBioCol2En: string
  founderCertTextEn: string
  founderCert1Image: string
  founderCert2Image: string
  founderCert3Image: string
}

const EMPTY: FormState = {
  founderSectionTitleEn: '',
  founderNameEn: '',
  founderTitleEn: '',
  founderDescriptionEn: '',
  founderImage: '',
  teamSectionTitleEn: '',
  founderYearsExp: '',
  founderProjectsCount: '',
  founderCountriesCount: '',
  founderPapersCount: '',
  founderBioCol1En: '',
  founderBioCol2En: '',
  founderCertTextEn: '',
  founderCert1Image: '',
  founderCert2Image: '',
  founderCert3Image: '',
}

function ImageUploadField({
  label,
  hint,
  value,
  previewClass,
  uploading,
  onUpload,
  onRemove,
}: {
  label: string
  hint?: string
  value: string
  previewClass?: string
  uploading: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
      <div className="flex items-start gap-4">
        <div className={`bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${previewClass || 'w-24 h-24'}`}>
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-gray-400 text-xs text-center px-2">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
            <Upload size={14} />
            {uploading ? 'Uploading…' : 'Upload'}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={uploading} />
          </label>
          {value && (
            <button type="button" onClick={onRemove} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600">
              <X size={12} /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FounderTeamAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const { confirmDeleteImage, pendingDelete, deleting, deleteError, handleDeleteConfirmed, handleCancel } = useDeleteImage()
  const [form, setForm] = useState<FormState>(EMPTY)

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
          founderYearsExp: d.founderYearsExp || '',
          founderProjectsCount: d.founderProjectsCount || '',
          founderCountriesCount: d.founderCountriesCount || '',
          founderPapersCount: d.founderPapersCount || '',
          founderBioCol1En: d.founderBioCol1En || '',
          founderBioCol2En: d.founderBioCol2En || '',
          founderCertTextEn: d.founderCertTextEn || '',
          founderCert1Image: d.founderCert1Image || '',
          founderCert2Image: d.founderCert2Image || '',
          founderCert3Image: d.founderCert3Image || '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormState) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploadingField(field)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const media = await res.json()
        setForm(prev => ({ ...prev, [field]: media.url }))
      } else {
        alert('Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploadingField(null)
    }
  }

  const removeImage = (field: keyof FormState) => {
    const val = form[field]
    if (val) {
      confirmDeleteImage(val, () => setForm(prev => ({ ...prev, [field]: '' })))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const existing = await fetch('/api/settings').then(r => r.json())
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...existing, ...form }),
      })
      if (res.ok) alert('Saved successfully!')
      else alert('Failed to save')
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div>
      <DeleteImageModal open={!!pendingDelete} onConfirm={handleDeleteConfirmed} onCancel={handleCancel} deleting={deleting} error={deleteError} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Founder Biography &amp; Team</h1>
        <button
          form="founder-team-form"
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <form id="founder-team-form" onSubmit={handleSubmit} className="space-y-6">

        {/* ── Identity ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Identity</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.founderNameEn} onChange={set('founderNameEn')} placeholder="Arch. Hesham Helal" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role</label>
              <input type="text" value={form.founderTitleEn} onChange={set('founderTitleEn')} placeholder="CEO & Founder, M.Sc" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading (homepage panel)</label>
            <input type="text" value={form.founderSectionTitleEn} onChange={set('founderSectionTitleEn')} placeholder="Our Founder and CEO" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (homepage panel)</label>
            <textarea value={form.founderDescriptionEn} onChange={set('founderDescriptionEn')} rows={3} placeholder="Short intro shown on the homepage founder panel…" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {/* Portrait */}
          <ImageUploadField
            label="Portrait Photo"
            hint="Full portrait shown on the founder page and homepage panel."
            value={form.founderImage}
            previewClass="w-24 h-32"
            uploading={uploadingField === 'founderImage'}
            onUpload={e => uploadImage(e, 'founderImage')}
            onRemove={() => removeImage('founderImage')}
          />
        </div>

        {/* ── Stats ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Stats Bar</h2>
          <p className="text-sm text-gray-500">Displayed as large figures on the founder biography page. Use "+25" or "25+" format as preferred.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years Experience</label>
              <input type="text" value={form.founderYearsExp} onChange={set('founderYearsExp')} placeholder="+25" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">e.g. +25 years</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completed Projects</label>
              <input type="text" value={form.founderProjectsCount} onChange={set('founderProjectsCount')} placeholder="+500" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">e.g. +500</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Countries</label>
              <input type="text" value={form.founderCountriesCount} onChange={set('founderCountriesCount')} placeholder="6" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published Papers</label>
              <input type="text" value={form.founderPapersCount} onChange={set('founderPapersCount')} placeholder="6" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* ── Biography ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Biography (Two Columns)</h2>
          <p className="text-sm text-gray-500">The full biography is displayed in two columns on the founder page. Each column can hold multiple paragraphs.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Left Column</label>
              <textarea value={form.founderBioCol1En} onChange={set('founderBioCol1En')} rows={10} placeholder="His designs are based on specific criteria and philosophy…" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-y text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Right Column</label>
              <textarea value={form.founderBioCol2En} onChange={set('founderBioCol2En')} rows={10} placeholder="And Art aspect about function and beauty…" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-y text-sm" />
            </div>
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Certifications</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certification Text</label>
            <input type="text" value={form.founderCertTextEn} onChange={set('founderCertTextEn')} placeholder="Arch. Hesham is certified observer by United Nations at COP28 & COP29" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUploadField label="Certification Logo 1" hint="e.g. BIG5 Construct Saudi" value={form.founderCert1Image} previewClass="w-24 h-16" uploading={uploadingField === 'founderCert1Image'} onUpload={e => uploadImage(e, 'founderCert1Image')} onRemove={() => removeImage('founderCert1Image')} />
            <ImageUploadField label="Certification Logo 2" hint="e.g. COP29 Baku Azerbaijan" value={form.founderCert2Image} previewClass="w-24 h-16" uploading={uploadingField === 'founderCert2Image'} onUpload={e => uploadImage(e, 'founderCert2Image')} onRemove={() => removeImage('founderCert2Image')} />
            <ImageUploadField label="Certification Logo 3" hint="e.g. COP28 UAE" value={form.founderCert3Image} previewClass="w-24 h-16" uploading={uploadingField === 'founderCert3Image'} onUpload={e => uploadImage(e, 'founderCert3Image')} onRemove={() => removeImage('founderCert3Image')} />
          </div>
        </div>

        {/* ── Team ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Team Section</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Section Heading</label>
            <input type="text" value={form.teamSectionTitleEn} onChange={set('teamSectionTitleEn')} placeholder="The CDG Family" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Users size={18} className="text-gray-400 shrink-0" />
            <p className="text-sm text-gray-600">
              Team members are managed in the{' '}
              <Link href="/admin/team" className="text-blue-600 hover:underline font-medium">Team section</Link>.
              Add or edit members there and they appear on the page automatically.
            </p>
          </div>
        </div>

      </form>
    </div>
  )
}
