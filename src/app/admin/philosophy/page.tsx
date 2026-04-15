'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Upload, X } from 'lucide-react'
import { useDeleteImage, DeleteImageModal } from '@/components/admin/DeleteImageModal'

interface FormState {
  heroTitle: string
  heroSubtitle: string
  introText: string
  introImage: string
  humanTitle: string
  humanDescription: string
  humanImage: string
  envTitle: string
  envDescription: string
  envImage: string
  cultureTitle: string
  cultureDescription: string
  cultureImage: string
  diagramImage: string
}

const DEFAULTS: FormState = {
  heroTitle: 'Our Philosophy',
  heroSubtitle: 'what we believe in',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment leading to being the most effective element to human efficiency.',
  introImage: '',
  humanTitle: 'HUMAN',
  humanDescription: 'human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: '',
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'as well as environmental measures such as weather, geography and energy.',
  envImage: '',
  cultureTitle: 'CULTURE',
  cultureDescription: 'and finally cultural values such as social and economic ones.',
  cultureImage: '',
  diagramImage: '',
}

type UploadField = 'introImage' | 'humanImage' | 'envImage' | 'cultureImage' | 'diagramImage'

export default function AdminPhilosophyPage() {
  const [form, setForm] = useState<FormState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<UploadField | null>(null)
  const { confirmDeleteImage, pendingDelete, deleting, handleDeleteConfirmed, handleCancel } = useDeleteImage()

  const introRef   = useRef<HTMLInputElement>(null)
  const humanRef   = useRef<HTMLInputElement>(null)
  const envRef     = useRef<HTMLInputElement>(null)
  const cultRef    = useRef<HTMLInputElement>(null)
  const diagramRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : {})
      .then((d: Partial<FormState>) => {
        setForm(prev => ({
          ...prev,
          ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v ?? ''])),
        }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (field: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleUpload = async (field: UploadField, file: File) => {
    setUploading(field)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) set(field, data.url)
    } catch { alert('Upload failed') }
    finally { setUploading(null) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/philosophy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { alert('Save failed') }
    finally { setSaving(false) }
  }

  function ImgField({
    label, field, fileRef, hint,
  }: {
    label: string
    field: UploadField
    fileRef: React.RefObject<HTMLInputElement | null>
    hint?: string
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {hint && <span className="ml-1 text-gray-400 font-normal text-xs">{hint}</span>}
        </label>
        {form[field] ? (
          <div className="relative inline-block">
            <img src={form[field]} alt={label} className="h-28 w-auto rounded-lg border object-contain bg-gray-50" />
            <button
              onClick={() => confirmDeleteImage(form[field], () => set(field, ''))}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading === field}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <Upload size={15} />
            {uploading === field ? 'Uploading…' : 'Upload Image'}
          </button>
        )}
        <input
          ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && handleUpload(field, e.target.files[0])}
        />
      </div>
    )
  }

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <DeleteImageModal open={!!pendingDelete} onConfirm={handleDeleteConfirmed} onCancel={handleCancel} deleting={deleting} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Philosophy Page</h1>
          <p className="text-sm text-gray-500 mt-1">Our Philosophy — what we believe in</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
          <Save size={16} />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* ── Section 1 ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Section 1 — Header, Intro Text & Diagram Image</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input value={form.heroTitle} onChange={e => set('heroTitle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (green italic line)</label>
            <input value={form.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intro Paragraph</label>
          <textarea rows={4} value={form.introText} onChange={e => set('introText', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>

        <ImgField
          label="Section 1 — Right Side Image"
          hint="(the triangle diagram shown on the right)"
          field="introImage"
          fileRef={introRef}
        />
      </section>

      {/* ── Section 2 ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Section 2 — Three Foundations</h2>

        {/* Human */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600">Foundation 1 — Human</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.humanTitle} onChange={e => set('humanTitle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.humanDescription} onChange={e => set('humanDescription', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <ImgField label="Human Icon Image" field="humanImage" fileRef={humanRef} />
        </div>

        {/* Environmental */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-xs font-bold uppercase tracking-widest text-green-700">Foundation 2 — Environmental</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.envTitle} onChange={e => set('envTitle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.envDescription} onChange={e => set('envDescription', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <ImgField label="Environmental Icon Image" field="envImage" fileRef={envRef} />
        </div>

        {/* Culture */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#B1A490' }}>Foundation 3 — Culture</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.cultureTitle} onChange={e => set('cultureTitle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.cultureDescription} onChange={e => set('cultureDescription', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <ImgField label="Culture Icon Image" field="cultureImage" fileRef={cultRef} />
        </div>
      </section>

      {/* ── Section 3 ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Section 3 — Design Flow Diagram Image</h2>
        <p className="text-xs text-gray-500">Upload the full diagram image (Nature → Design → Solutions → Outcomes).</p>
        <ImgField
          label="Diagram Image"
          field="diagramImage"
          fileRef={diagramRef}
        />
      </section>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
          <Save size={16} />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
