'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Upload, X } from 'lucide-react'

interface FormState {
  heroTitle: string
  heroSubtitle: string
  introText: string
  humanTitle: string
  humanDescription: string
  humanImage: string
  envTitle: string
  envDescription: string
  envImage: string
  cultureTitle: string
  cultureDescription: string
  cultureImage: string
  diagramNature: string
  diagramHumanValues: string
  diagramArts: string
  diagramDesign: string
  diagramInnovative: string
  solution1: string
  solution2: string
  solution3: string
  outcome1: string
  outcome2: string
}

const DEFAULTS: FormState = {
  heroTitle: 'Our Philosophy',
  heroSubtitle: 'what we believe in',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment leading to being the most effective element to human efficiency.',
  humanTitle: 'HUMAN',
  humanDescription: 'human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: '',
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'as well as environmental measures such as weather, geography and energy.',
  envImage: '',
  cultureTitle: 'CULTURE',
  cultureDescription: 'and finally cultural values such as social and economic ones.',
  cultureImage: '',
  diagramNature: 'Nature',
  diagramHumanValues: 'Human Values',
  diagramArts: 'Arts',
  diagramDesign: 'Design',
  diagramInnovative: 'Innovative Solutions',
  solution1: 'Sustainability',
  solution2: 'Creativity',
  solution3: 'Uniqueness',
  outcome1: 'Happiness',
  outcome2: 'Resilience',
}

type ImageField = 'humanImage' | 'envImage' | 'cultureImage'

export default function AdminPhilosophyPage() {
  const [form, setForm] = useState<FormState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<ImageField | null>(null)
  const humanRef = useRef<HTMLInputElement>(null)
  const envRef   = useRef<HTMLInputElement>(null)
  const cultRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : {})
      .then((d: Partial<FormState>) => {
        setForm(prev => ({ ...prev, ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v ?? ''])) }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (field: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleUpload = async (field: ImageField, file: File) => {
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

  const ImageField = ({ label, field, fileRef }: {
    label: string
    field: ImageField
    fileRef: React.RefObject<HTMLInputElement | null>
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-gray-400 font-normal">(optional custom icon)</span></label>
      {form[field] ? (
        <div className="relative inline-block">
          <img src={form[field]} alt={label} className="h-20 w-auto rounded border object-cover" />
          <button onClick={() => set(field, '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading === field}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-gray-400"
        >
          <Upload size={14} />
          {uploading === field ? 'Uploading…' : 'Upload Icon Image'}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleUpload(field, e.target.files[0])} />
    </div>
  )

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
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

      {/* ── Section 1: Header & Intro ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Section 1 — Header & Intro</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input value={form.heroTitle} onChange={e => set('heroTitle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (green line below title)</label>
            <input value={form.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intro Paragraph</label>
          <textarea rows={4} value={form.introText} onChange={e => set('introText', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>
      </section>

      {/* ── Section 2: Three Foundations ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Section 2 — Three Foundations</h2>

        {/* Human */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-600">Foundation 1 — Human</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={form.humanTitle} onChange={e => set('humanTitle', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.humanDescription} onChange={e => set('humanDescription', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <ImageField label="Icon" field="humanImage" fileRef={humanRef} />
        </div>

        {/* Environmental */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-green-700">Foundation 2 — Environmental</h3>
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
          <ImageField label="Icon" field="envImage" fileRef={envRef} />
        </div>

        {/* Culture */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#B1A490' }}>Foundation 3 — Culture</h3>
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
          <ImageField label="Icon" field="cultureImage" fileRef={cultRef} />
        </div>
      </section>

      {/* ── Section 3: Node Diagram Labels ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Section 3 — Design Flow Diagram (labels only)</h2>
        <p className="text-xs text-gray-500">The diagram is drawn automatically — you can only edit the text labels below.</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Left node label</label>
            <input value={form.diagramNature} onChange={e => set('diagramNature', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Center node label</label>
            <input value={form.diagramDesign} onChange={e => set('diagramDesign', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Above center label</label>
            <input value={form.diagramHumanValues} onChange={e => set('diagramHumanValues', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Below center label</label>
            <input value={form.diagramArts} onChange={e => set('diagramArts', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Middle connector label</label>
            <input value={form.diagramInnovative} onChange={e => set('diagramInnovative', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Right side labels</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top</label>
              <input value={form.solution1} onChange={e => set('solution1', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Middle</label>
              <input value={form.solution2} onChange={e => set('solution2', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bottom</label>
              <input value={form.solution3} onChange={e => set('solution3', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Far right outcome labels</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top outcome</label>
              <input value={form.outcome1} onChange={e => set('outcome1', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bottom outcome</label>
              <input value={form.outcome2} onChange={e => set('outcome2', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          </div>
        </div>
      </section>

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
