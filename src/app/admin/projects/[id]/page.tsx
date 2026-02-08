'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react'

const categories = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'INTERIOR', label: 'Interior' },
  { value: 'URBAN', label: 'Urban' },
  { value: 'LANDSCAPE', label: 'Landscape' },
  { value: 'RENOVATION', label: 'Renovation' }
]

interface ProjectImage {
  id?: string
  url: string
  alt?: string
}

interface TimelineEntry {
  id?: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  image: string
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<ProjectImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [uploadingTimeline, setUploadingTimeline] = useState<number | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const [form, setForm] = useState({
    titleEn: '',
    titleAr: '',
    slug: '',
    descriptionEn: '',
    descriptionAr: '',
    category: 'RESIDENTIAL',
    yearCompleted: '',
    location: '',
    clientName: '',
    clientLogo: '',
    featured: false,
    status: 'DRAFT'
  })

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`)
      if (res.ok) {
        const project = await res.json()
        setForm({
          titleEn: project.titleEn,
          titleAr: project.titleAr,
          slug: project.slug,
          descriptionEn: project.descriptionEn,
          descriptionAr: project.descriptionAr,
          category: project.category,
          yearCompleted: project.yearCompleted?.toString() || '',
          location: project.location || '',
          clientName: project.clientName || '',
          clientLogo: project.clientLogo || '',
          featured: project.featured,
          status: project.status
        })
        setImages(project.images || [])
        setTimeline(
          (project.timeline || []).map((t: TimelineEntry) => ({
            id: t.id,
            titleEn: t.titleEn,
            titleAr: t.titleAr,
            descriptionEn: t.descriptionEn,
            descriptionAr: t.descriptionAr,
            image: t.image || ''
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (res.ok) {
          const media = await res.json()
          setImages(prev => [...prev, { url: media.url, alt: '' }])
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', files[0])
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const media = await res.json()
        setForm({ ...form, clientLogo: media.url })
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
    } finally {
      setUploadingLogo(false)
    }
  }

  const addTimelineEntry = () => {
    setTimeline([...timeline, { titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', image: '' }])
  }

  const updateTimeline = (index: number, field: keyof TimelineEntry, value: string) => {
    const updated = [...timeline]
    updated[index] = { ...updated[index], [field]: value }
    setTimeline(updated)
  }

  const removeTimelineEntry = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index))
  }

  const handleTimelineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files
    if (!files?.length) return

    setUploadingTimeline(index)
    try {
      const formData = new FormData()
      formData.append('file', files[0])
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const media = await res.json()
        updateTimeline(index, 'image', media.url)
      }
    } catch (error) {
      console.error('Error uploading timeline image:', error)
    } finally {
      setUploadingTimeline(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          images: images.map(img => ({ url: img.url, alt: img.alt })),
          timeline: timeline.filter(t => t.titleEn.trim()).map(t => ({
            titleEn: t.titleEn,
            titleAr: t.titleAr,
            descriptionEn: t.descriptionEn,
            descriptionAr: t.descriptionAr,
            image: t.image
          }))
        })
      })

      if (res.ok) {
        router.push('/admin/projects')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/projects" className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (English) *
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (Arabic) *
              </label>
              <input
                type="text"
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (English) *
              </label>
              <textarea
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Arabic) *
              </label>
              <textarea
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={5}
                dir="rtl"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Project Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Completed
              </label>
              <input
                type="number"
                value={form.yearCompleted}
                onChange={(e) => setForm({ ...form, yearCompleted: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1900"
                max="2100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Logo
            </label>
            <div className="flex items-center gap-4">
              {form.clientLogo && (
                <div className="relative">
                  <img src={form.clientLogo} alt="Client logo" className="h-12 object-contain" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, clientLogo: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploadingLogo}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Images</h2>
          <p className="text-sm text-gray-500">First image = hero. Images 2-7 = gallery thumbnails. Remaining = showcase.</p>

          <div className="flex flex-wrap gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index === 0 ? 'Hero' : index <= 6 ? `Gallery ${index}` : `Showcase ${index - 6}`}
                </span>
              </div>
            ))}

            <label className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500 mt-1">
                {uploading ? 'Uploading...' : 'Upload'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="font-semibold text-lg">Project Timeline</h2>
            <button
              type="button"
              onClick={addTimelineEntry}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus size={16} />
              Add Entry
            </button>
          </div>

          {timeline.length === 0 && (
            <p className="text-sm text-gray-500">No timeline entries yet. Click &ldquo;Add Entry&rdquo; to create one.</p>
          )}

          {timeline.map((entry, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Entry {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeTimelineEntry(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={entry.titleEn}
                    onChange={(e) => updateTimeline(index, 'titleEn', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="e.g. Concept Sketching"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title (Arabic)</label>
                  <input
                    type="text"
                    value={entry.titleAr}
                    onChange={(e) => updateTimeline(index, 'titleAr', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description (English)</label>
                  <textarea
                    value={entry.descriptionEn}
                    onChange={(e) => updateTimeline(index, 'descriptionEn', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description (Arabic)</label>
                  <textarea
                    value={entry.descriptionAr}
                    onChange={(e) => updateTimeline(index, 'descriptionAr', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                <div className="flex items-center gap-3">
                  {entry.image && (
                    <img src={entry.image} alt="" className="w-20 h-20 object-cover rounded" />
                  )}
                  <label className="px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                    {uploadingTimeline === index ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleTimelineImageUpload(e, index)}
                      className="hidden"
                      disabled={uploadingTimeline === index}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Publishing</h2>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Featured Project</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/projects"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
