'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react'

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
  transformationText: string
  solution1: string
  solution2: string
  solution3: string
  solution4: string
  outcome1: string
  outcome2: string
  finalMessage: string
}

const DEFAULTS: FormState = {
  heroTitle: 'The Soul of Our Design',
  heroSubtitle: 'Every project begins with understanding what truly matters.',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment — leading to being the most effective element to human efficiency.',
  introImage: '',
  humanTitle: 'HUMAN',
  humanDescription: 'Human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: '',
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'Environmental measures such as weather, geography and energy.',
  envImage: '',
  cultureTitle: 'CULTURE',
  cultureDescription: 'Cultural values such as social and economic ones.',
  cultureImage: '',
  transformationText: 'Where insights become design.',
  solution1: 'Innovation',
  solution2: 'Sustainability',
  solution3: 'Creativity',
  solution4: 'Uniqueness',
  outcome1: 'Happiness',
  outcome2: 'Resilience',
  finalMessage: "We don't just design buildings.\nWe design outcomes that last.",
}

type UploadField = 'introImage' | 'humanImage' | 'envImage' | 'cultureImage'

export default function AdminPhilosophyPage() {
  const [form, setForm] = useState<FormState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<UploadField | null>(null)
  const introRef = useRef<HTMLInputElement>(null)
  const humanRef = useRef<HTMLInputElement>(null)
  const envRef = useRef<HTMLInputElement>(null)
  const cultureRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : {})
      .then((data: Partial<FormState>) => {
        setForm({
          heroTitle: data.heroTitle || DEFAULTS.heroTitle,
          heroSubtitle: data.heroSubtitle || DEFAULTS.heroSubtitle,
          introText: data.introText || DEFAULTS.introText,
          introImage: data.introImage || '',
          humanTitle: data.humanTitle || DEFAULTS.humanTitle,
          humanDescription: data.humanDescription || DEFAULTS.humanDescription,
          humanImage: data.humanImage || '',
          envTitle: data.envTitle || DEFAULTS.envTitle,
          envDescription: data.envDescription || DEFAULTS.envDescription,
          envImage: data.envImage || '',
          cultureTitle: data.cultureTitle || DEFAULTS.cultureTitle,
          cultureDescription: data.cultureDescription || DEFAULTS.cultureDescription,
          cultureImage: data.cultureImage || '',
          transformationText: data.transformationText || DEFAULTS.transformationText,
          solution1: data.solution1 || DEFAULTS.solution1,
          solution2: data.solution2 || DEFAULTS.solution2,
          solution3: data.solution3 || DEFAULTS.solution3,
          solution4: data.solution4 || DEFAULTS.solution4,
          outcome1: data.outcome1 || DEFAULTS.outcome1,
          outcome2: data.outcome2 || DEFAULTS.outcome2,
          finalMessage: data.finalMessage || DEFAULTS.finalMessage,
        })
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
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(null)
    }
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
    } catch {
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const ImageField = ({
    label, field, fileRef,
  }: {
    label: string
    field: UploadField
    fileRef: React.RefObject<HTMLInputElement | null>
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {form[field] ? (
        <div className="relative inline-block">
          <img src={form[field]} alt={label} className="h-24 w-auto rounded border object-cover" />
          <button
            onClick={() => set(field, '')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading === field}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-gray-400"
        >
          {uploading === field ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Upload size={14} />
          )}
          {uploading === field ? 'Uploading…' : 'Upload Image'}
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleUpload(field, e.target.files[0])}
      />
    </div>
  )

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Philosophy Page</h1>
          <p className="text-sm text-gray-500 mt-1">The Soul of Our Design — scroll experience</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          <Save size={16} />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base border-b pb-2">Hero Section</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
          <input
            value={form.heroTitle}
            onChange={e => set('heroTitle', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input
            value={form.heroSubtitle}
            onChange={e => set('heroSubtitle', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base border-b pb-2">Intro — What We Believe In</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intro Paragraph</label>
          <textarea
            rows={4}
            value={form.introText}
            onChange={e => set('introText', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <ImageField label="Intro Image (optional, shown beside text)" field="introImage" fileRef={introRef} />
      </section>

      {/* ── Three Foundations ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="font-semibold text-gray-800 text-base border-b pb-2">Three Foundations</h2>

        {/* Human */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Foundation 1 — Human</h3>
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
          <ImageField label="Custom Icon / Image" field="humanImage" fileRef={humanRef} />
        </div>

        {/* Environmental */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">Foundation 2 — Environmental</h3>
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
          <ImageField label="Custom Icon / Image" field="envImage" fileRef={envRef} />
        </div>

        {/* Culture */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold text-brand uppercase tracking-wide" style={{ color: '#B1A490' }}>Foundation 3 — Culture</h3>
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
          <ImageField label="Custom Icon / Image" field="cultureImage" fileRef={cultureRef} />
        </div>
      </section>

      {/* ── Transformation ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base border-b pb-2">Transformation Moment</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text (shown when foundations converge)</label>
          <input value={form.transformationText} onChange={e => set('transformationText', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
        </div>
      </section>

      {/* ── Solutions ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base border-b pb-2">Design Flow — Solution Nodes</h2>
        <div className="grid grid-cols-2 gap-3">
          {(['solution1', 'solution2', 'solution3', 'solution4'] as const).map((k, i) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Node {i + 1}</label>
              <input value={form[k]} onChange={e => set(k, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Final Impact ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base border-b pb-2">Final Impact</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Outcome 1</label>
            <input value={form.outcome1} onChange={e => set('outcome1', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Outcome 2</label>
            <input value={form.outcome2} onChange={e => set('outcome2', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Final Message</label>
          <textarea rows={3} value={form.finalMessage} onChange={e => set('finalMessage', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
          <p className="text-xs text-gray-400 mt-1">Use a new line for a line break.</p>
        </div>
      </section>

      {/* Save button (bottom) */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          <Save size={16} />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
