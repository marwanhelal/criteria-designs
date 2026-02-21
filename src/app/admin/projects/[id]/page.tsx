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
  section?: string
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

  // Separate image states per section
  const [heroImage, setHeroImage] = useState('')
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([])
  const [finalRevealImages, setFinalRevealImages] = useState<ProjectImage[]>([])

  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadingReveal, setUploadingReveal] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [uploadingTimeline, setUploadingTimeline] = useState<number | null>(null)

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
    finalRevealTitleEn: '',
    finalRevealTitleAr: '',
    finalRevealSubtitleEn: '',
    finalRevealSubtitleAr: '',
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
          finalRevealTitleEn: project.finalRevealTitleEn || '',
          finalRevealTitleAr: project.finalRevealTitleAr || '',
          finalRevealSubtitleEn: project.finalRevealSubtitleEn || '',
          finalRevealSubtitleAr: project.finalRevealSubtitleAr || '',
          featured: project.featured,
          status: project.status
        })

        const imgs: ProjectImage[] = project.images || []
        // Split images by section (fallback: order-based for old data)
        const hero = imgs.find(img => img.section === 'hero') || (imgs[0]?.section === undefined ? imgs[0] : null)
        const gallery = imgs.filter(img =>
          img.section === 'gallery' ||
          (img.section === undefined && imgs.indexOf(img) > 0 && imgs.indexOf(img) <= 6)
        )
        const reveal = imgs.filter(img =>
          img.section === 'final_reveal' ||
          (img.section === undefined && imgs.indexOf(img) >= 7)
        )

        setHeroImage(hero?.url || '')
        setGalleryImages(gallery.map(img => ({ url: img.url, alt: img.alt || '' })))
        setFinalRevealImages(reveal.map(img => ({ url: img.url, alt: img.alt || '' })))

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

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const media = await res.json()
      return media.url
    }
    return null
  }

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHero(true)
    try {
      const url = await uploadFile(file)
      if (url) setHeroImage(url)
    } catch (err) { console.error(err) } finally { setUploadingHero(false) }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploadingGallery(true)
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file)
        if (url) setGalleryImages(prev => [...prev, { url, alt: '' }])
      }
    } catch (err) { console.error(err) } finally { setUploadingGallery(false) }
  }

  const handleRevealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploadingReveal(true)
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file)
        if (url) setFinalRevealImages(prev => [...prev, { url, alt: '' }])
      }
    } catch (err) { console.error(err) } finally { setUploadingReveal(false) }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const url = await uploadFile(file)
      if (url) setForm(f => ({ ...f, clientLogo: url }))
    } catch (err) { console.error(err) } finally { setUploadingLogo(false) }
  }

  const defaultTitles = [
    'Rooted in Our Vision',
    'Concept Sketching',
    'Cairo Concept Study',
    'Natural Integration',
    'Final Design Reveal',
  ]

  const addTimelineEntry = () => {
    const defaultTitle = defaultTitles[timeline.length] || ''
    setTimeline([...timeline, { titleEn: defaultTitle, titleAr: '', descriptionEn: '', descriptionAr: '', image: '' }])
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
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingTimeline(index)
    try {
      const url = await uploadFile(file)
      if (url) updateTimeline(index, 'image', url)
    } catch (err) { console.error(err) } finally { setUploadingTimeline(null) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Combine all images with their section tags
    const allImages = [
      ...(heroImage ? [{ url: heroImage, alt: '', section: 'hero' }] : []),
      ...galleryImages.map(img => ({ url: img.url, alt: img.alt || '', section: 'gallery' })),
      ...finalRevealImages.map(img => ({ url: img.url, alt: img.alt || '', section: 'final_reveal' })),
    ]

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          images: allImages,
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
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
              <input type="text" value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Arabic) *</label>
              <input type="text" value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" dir="rtl" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input type="text" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English) *</label>
              <textarea value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={5} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabic) *</label>
              <textarea value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={5} dir="rtl" required />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Project Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Completed</label>
              <input type="number" value={form.yearCompleted}
                onChange={(e) => setForm({ ...form, yearCompleted: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" min="1900" max="2100" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client / Developer Name</label>
              <input type="text" value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Developer Logo</label>
            <div className="flex items-center gap-4">
              {form.clientLogo && (
                <div className="relative">
                  <img src={form.clientLogo} alt="Client logo" className="h-12 object-contain" />
                  <button type="button" onClick={() => setForm({ ...form, clientLogo: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
              </label>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Hero Image</h2>
          <p className="text-sm text-gray-500">The main large image shown at the top of the project page.</p>
          <div className="flex items-start gap-4">
            {heroImage && (
              <div className="relative">
                <img src={heroImage} alt="Hero" className="w-48 h-32 object-cover rounded-lg" />
                <button type="button" onClick={() => setHeroImage('')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                  <X size={16} />
                </button>
              </div>
            )}
            <label className={`${heroImage ? 'w-32 h-32' : 'w-48 h-32'} border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}>
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500 mt-1 text-center px-2">
                {uploadingHero ? 'Uploading...' : heroImage ? 'Replace' : 'Upload Hero'}
              </span>
              <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" disabled={uploadingHero} />
            </label>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Gallery Images</h2>
          <p className="text-sm text-gray-500">Additional photos shown in the thumbnail grid below the hero image.</p>
          <div className="flex flex-wrap gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={img.url} alt={img.alt || ''} className="w-32 h-32 object-cover rounded-lg" />
                <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                  <X size={16} />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
              </div>
            ))}
            <label className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500 mt-1">{uploadingGallery ? 'Uploading...' : 'Add Photos'}</span>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploadingGallery} />
            </label>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="font-semibold text-lg">Project Timeline</h2>
              <p className="text-sm text-gray-500 mt-0.5">Each entry has its own title, description, and image.</p>
            </div>
            <button type="button" onClick={addTimelineEntry}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
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
                <span className="text-sm font-medium text-gray-700">Phase {index + 1}</span>
                <button type="button" onClick={() => removeTimelineEntry(index)}
                  className="text-red-500 hover:text-red-600"><Trash2 size={16} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title (English)</label>
                  <input type="text" value={entry.titleEn}
                    onChange={(e) => updateTimeline(index, 'titleEn', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="e.g. Rooted in Our Vision" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title (Arabic)</label>
                  <input type="text" value={entry.titleAr}
                    onChange={(e) => updateTimeline(index, 'titleAr', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm" dir="rtl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description (English)</label>
                  <textarea value={entry.descriptionEn}
                    onChange={(e) => updateTimeline(index, 'descriptionEn', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm" rows={4} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description (Arabic)</label>
                  <textarea value={entry.descriptionAr}
                    onChange={(e) => updateTimeline(index, 'descriptionAr', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm" rows={4} dir="rtl" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phase Image</label>
                <div className="flex items-center gap-3">
                  {entry.image && (
                    <div className="relative">
                      <img src={entry.image} alt="" className="w-24 h-24 object-cover rounded" />
                      <button type="button" onClick={() => updateTimeline(index, 'image', '')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <label className="px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                    {uploadingTimeline === index ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*"
                      onChange={(e) => handleTimelineImageUpload(e, index)}
                      className="hidden" disabled={uploadingTimeline === index} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Design Reveal */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Final Design Reveal</h2>
          <p className="text-sm text-gray-500">The closing section of the project page — a heading, subtitle, and full-width showcase images of the completed design.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
              <input type="text" value={form.finalRevealTitleEn}
                onChange={(e) => setForm({ ...form, finalRevealTitleEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Final Design Reveal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Arabic)</label>
              <input type="text" value={form.finalRevealTitleAr}
                onChange={(e) => setForm({ ...form, finalRevealTitleAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" dir="rtl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (English)</label>
              <textarea value={form.finalRevealSubtitleEn}
                onChange={(e) => setForm({ ...form, finalRevealSubtitleEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={4}
                placeholder="e.g. High-end renderings captured the completed vision..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Arabic)</label>
              <textarea value={form.finalRevealSubtitleAr}
                onChange={(e) => setForm({ ...form, finalRevealSubtitleAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={4} dir="rtl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Final Reveal Images</label>
            <p className="text-xs text-gray-400 mb-3">Full-width showcase images. High resolution supported (up to 50 MB each).</p>
            <div className="flex flex-wrap gap-4">
              {finalRevealImages.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img.url} alt={img.alt || ''} className="w-32 h-32 object-cover rounded-lg" />
                  <button type="button" onClick={() => setFinalRevealImages(finalRevealImages.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X size={16} />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
              <label className="w-32 h-32 border-2 border-dashed border-amber-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50">
                <Upload size={24} className="text-amber-400" />
                <span className="text-sm text-amber-500 mt-1 text-center px-1">{uploadingReveal ? 'Uploading...' : 'Add Renders'}</span>
                <input type="file" accept="image/*" multiple onChange={handleRevealUpload} className="hidden" disabled={uploadingReveal} />
              </label>
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Publishing</h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
              <span className="text-sm">Featured Project</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="px-3 py-1 border rounded-lg">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/projects" className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
