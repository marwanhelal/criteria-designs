'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react'
import { useDeleteImage, DeleteImageModal } from '@/components/admin/DeleteImageModal'

interface FormState {
  aboutIntroText: string
  aboutCol1Text: string
  aboutCol2Text: string
  aboutCol2Text2: string
  aboutImage: string
  aboutImageCaption: string
  aboutMissionText: string
  aboutVisionText: string
  aboutStat1Number: string
  aboutStat1Label: string
  aboutStat2Number: string
  aboutStat2Label: string
  aboutStat3Number: string
  aboutStat3Label: string
  aboutStat4Number: string
  aboutStat4Label: string
  aboutServicesText: string
}

const DEFAULTS: FormState = {
  aboutIntroText: 'Criteria Design Group – CDG – is a multidisciplinary architecture, interior designing, landscaping and urban planning company. The company was first founded in 2007 under the name ICE – International Consultancy Engineering – and then was relaunched in 2013 with its new identity holding a uniquely new concept as reflected in its present name, Criteria Design Group.',
  aboutCol1Text: 'We mainly operate from Egypt having our Head office located in Maadi, Cairo. CDG Experts have been in the field for more than fifteen years, working in different architectural and design projects to private and governmental entities on various scopes and sizes. From the humble beginnings of Criteria Design Group, we have had the vision to push boundaries and seek new solutions.',
  aboutCol2Text: 'We believe that we have a great duty towards our customers as we know that we can contribute an integral part of everyone\'s life as we build their everyday territories, whether they are residential, corporate, or even their getaways.',
  aboutCol2Text2: 'A very important aspect that constitutes the main pillar of our work is the surrounding environment and its effect on the design and the convenience of the project; represented in the climate, location, and cultural cores. At CDG, we align our resources in which we merge our expertise and technical knowledge into creative experimentation to come up with our inventive and customised design solutions.',
  aboutImage: '',
  aboutImageCaption: 'Designs That Add Value',
  aboutMissionText: 'To create innovative, sustainable, and aesthetically compelling architectural solutions that enhance the quality of life for our clients and communities. We are committed to excellence in design, construction, and client service.',
  aboutVisionText: 'To be the most trusted and respected architecture firm in the region, known for transforming spaces into extraordinary experiences. We envision a future where every structure we design stands as a testament to innovation and timeless beauty.',
  aboutStat1Number: '15+',
  aboutStat1Label: 'Years of Experience',
  aboutStat2Number: '500+',
  aboutStat2Label: 'Projects Completed',
  aboutStat3Number: '12+',
  aboutStat3Label: 'Countries',
  aboutStat4Number: '150+',
  aboutStat4Label: 'Team Members',
  aboutServicesText: 'CDG is a multifaceted company that delivers all types of designs such as residential, hospitality, corporates, educational institutes, and leisure and entertainment constructions. We are committed to delivering the best-desired results using the latest tools in the market. Our associates regularly attend technical conferences and workshops for continuous education and updates for a better service to our clients. As a team, we guarantee sustainable quality in our work and services.',
}

export default function AdminAboutPage() {
  const [form, setForm] = useState<FormState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { confirmDeleteImage, pendingDelete, deleting, handleDeleteConfirmed, handleCancel } = useDeleteImage()

  useEffect(() => {
    fetch('/api/about-settings')
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, string | null | undefined>) => {
        setForm({
          aboutIntroText: data.aboutIntroText || DEFAULTS.aboutIntroText,
          aboutCol1Text: data.aboutCol1Text || DEFAULTS.aboutCol1Text,
          aboutCol2Text: data.aboutCol2Text || DEFAULTS.aboutCol2Text,
          aboutCol2Text2: data.aboutCol2Text2 || DEFAULTS.aboutCol2Text2,
          aboutImage: data.aboutImage || '',
          aboutImageCaption: data.aboutImageCaption || DEFAULTS.aboutImageCaption,
          aboutMissionText: data.aboutMissionText || DEFAULTS.aboutMissionText,
          aboutVisionText: data.aboutVisionText || DEFAULTS.aboutVisionText,
          aboutStat1Number: data.aboutStat1Number || DEFAULTS.aboutStat1Number,
          aboutStat1Label: data.aboutStat1Label || DEFAULTS.aboutStat1Label,
          aboutStat2Number: data.aboutStat2Number || DEFAULTS.aboutStat2Number,
          aboutStat2Label: data.aboutStat2Label || DEFAULTS.aboutStat2Label,
          aboutStat3Number: data.aboutStat3Number || DEFAULTS.aboutStat3Number,
          aboutStat3Label: data.aboutStat3Label || DEFAULTS.aboutStat3Label,
          aboutStat4Number: data.aboutStat4Number || DEFAULTS.aboutStat4Number,
          aboutStat4Label: data.aboutStat4Label || DEFAULTS.aboutStat4Label,
          aboutServicesText: data.aboutServicesText || DEFAULTS.aboutServicesText,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (key: keyof FormState, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  async function uploadImage(file: File) {
    setUploading(true)
    setUploadProgress(0)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'other')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || 'Upload failed')
      }
      const data = await res.json()
      if (data.url) set('aboutImage', data.url)
      setUploadProgress(100)
    } catch (err) {
      alert('Image upload failed: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/about-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-gray-400">Loading…</div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <DeleteImageModal open={!!pendingDelete} onConfirm={handleDeleteConfirmed} onCancel={handleCancel} deleting={deleting} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
          <p className="text-sm text-gray-500 mt-1">Edit the content shown on the About page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          <Save size={16} />
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Intro paragraph */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b pb-3">Introduction Paragraph</h2>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full-width intro text (shown below heading)</label>
          <textarea
            rows={4}
            value={form.aboutIntroText}
            onChange={e => set('aboutIntroText', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          />
        </div>
      </section>

      {/* Two columns */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800 border-b pb-3">Two-Column Body Text</h2>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Left Column — Operations & Background</label>
          <textarea
            rows={5}
            value={form.aboutCol1Text}
            onChange={e => set('aboutCol1Text', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Right Column — Paragraph 1 (Duty to customers)</label>
          <textarea
            rows={4}
            value={form.aboutCol2Text}
            onChange={e => set('aboutCol2Text', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Right Column — Paragraph 2 (Approach & solutions)</label>
          <textarea
            rows={5}
            value={form.aboutCol2Text2}
            onChange={e => set('aboutCol2Text2', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          />
        </div>
      </section>

      {/* Feature image */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b pb-3">Feature Image</h2>

        {/* Preview */}
        {form.aboutImage ? (
          <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '16/5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.aboutImage} alt="About feature" className="w-full h-full object-cover" />
            <button
              onClick={() => confirmDeleteImage(form.aboutImage, () => set('aboutImage', ''))}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 py-10">
            <ImageIcon size={32} className="text-gray-300" />
            <p className="text-sm text-gray-400">No image uploaded</p>
          </div>
        )}

        {/* Upload */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            <Upload size={15} />
            {uploading ? `Uploading… ${uploadProgress}%` : 'Upload Image'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = '' }}
          />
          <div className="flex-1">
            <input
              type="text"
              value={form.aboutImage}
              onChange={e => set('aboutImage', e.target.value)}
              placeholder="Or paste image URL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Image Caption</label>
          <input
            type="text"
            value={form.aboutImageCaption}
            onChange={e => set('aboutImageCaption', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b pb-3">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          {([1, 2, 3, 4] as const).map(n => (
            <div key={n} className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Stat {n} — Number</label>
                <input
                  type="text"
                  value={form[`aboutStat${n}Number` as keyof FormState]}
                  onChange={e => set(`aboutStat${n}Number` as keyof FormState, e.target.value)}
                  placeholder="e.g. 500+"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Stat {n} — Label</label>
                <input
                  type="text"
                  value={form[`aboutStat${n}Label` as keyof FormState]}
                  onChange={e => set(`aboutStat${n}Label` as keyof FormState, e.target.value)}
                  placeholder="e.g. Projects Completed"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800 border-b pb-3">Mission & Vision</h2>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mission Text</label>
          <textarea
            rows={4}
            value={form.aboutMissionText}
            onChange={e => set('aboutMissionText', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Vision Text</label>
          <textarea
            rows={4}
            value={form.aboutVisionText}
            onChange={e => set('aboutVisionText', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          />
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b pb-3">Our Services</h2>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Services description paragraph</label>
          <textarea
            rows={5}
            value={form.aboutServicesText}
            onChange={e => set('aboutServicesText', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          />
        </div>
      </section>

      {/* Save bottom */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          <Save size={16} />
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

    </div>
  )
}
