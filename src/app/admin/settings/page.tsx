'use client'

import { useState, useEffect } from 'react'
import { Save, Upload } from 'lucide-react'
import { useDeleteImage, DeleteImageModal } from '@/components/admin/DeleteImageModal'

const CHUNK_SIZE = 512 * 1024 // 512 KB — safely below any reverse-proxy body-size limit

interface ProjectOption { id: string; titleEn: string; category: string }

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const { confirmDeleteImage, pendingDelete, deleting, handleDeleteConfirmed, handleCancel } = useDeleteImage()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [unsavedVideo, setUnsavedVideo] = useState(false)
  const [projects, setProjects] = useState<ProjectOption[]>([])

  const [form, setForm] = useState({
    companyNameEn: '',
    companyNameAr: '',
    addressEn: '',
    addressAr: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    logo: '',
    favicon: '',
    heroImage: '',
    heroVideo: '',
    philosophyImage: '',
    philosophyCultureImage: '',
    philosophyNatureImage: '',
    philosophyArtImage: '',
    seoTitleEn: '',
    seoTitleAr: '',
    seoDescriptionEn: '',
    seoDescriptionAr: '',
    // Showcase projects
    showcaseProject1Id: '',
    awardsCountries: '',
    awardsSince: '',
    showcaseProject2Id: '',
    showcaseProject3Id: '',
    showcaseProject4Id: '',
    showcaseProject5Id: '',
  })

  useEffect(() => {
    fetchSettings()
    fetch('/api/projects?status=PUBLISHED')
      .then(r => r.ok ? r.json() : [])
      .then((data: ProjectOption[]) => setProjects(data))
      .catch(() => {})
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const settings = await res.json()
        setForm({
          companyNameEn: settings.companyNameEn || '',
          companyNameAr: settings.companyNameAr || '',
          addressEn: settings.addressEn || '',
          addressAr: settings.addressAr || '',
          phone: settings.phone || '',
          email: settings.email || '',
          facebook: settings.facebook || '',
          instagram: settings.instagram || '',
          linkedin: settings.linkedin || '',
          twitter: settings.twitter || '',
          youtube: settings.youtube || '',
          logo: settings.logo || '',
          favicon: settings.favicon || '',
          heroImage: settings.heroImage || '',
          heroVideo: settings.heroVideo || '',
          philosophyImage: settings.philosophyImage || '',
          philosophyCultureImage: settings.philosophyCultureImage || '',
          philosophyNatureImage: settings.philosophyNatureImage || '',
          philosophyArtImage: settings.philosophyArtImage || '',
          seoTitleEn: settings.seoTitleEn || '',
          seoTitleAr: settings.seoTitleAr || '',
          seoDescriptionEn: settings.seoDescriptionEn || '',
          seoDescriptionAr: settings.seoDescriptionAr || '',
          // Showcase projects
          showcaseProject1Id: settings.showcaseProject1Id || '',
          showcaseProject2Id: settings.showcaseProject2Id || '',
          showcaseProject3Id: settings.showcaseProject3Id || '',
          showcaseProject4Id: settings.showcaseProject4Id || '',
          showcaseProject5Id: settings.showcaseProject5Id || '',
          awardsCountries: settings.awardsCountries || '',
          awardsSince: settings.awardsSince || '',
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon' | 'heroImage' | 'heroVideo' | 'philosophyImage' | 'philosophyCultureImage' | 'philosophyNatureImage' | 'philosophyArtImage') => {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so same file can be re-selected
    e.target.value = ''

    // Use chunked upload for videos (files > 2MB)
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (videoTypes.includes(file.type) && file.size > CHUNK_SIZE) {
      return handleChunkedUpload(file, field)
    }

    setUploading(field)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const media = await res.json()
        setForm(prev => ({ ...prev, [field]: media.url }))
      } else {
        const err = await res.json()
        alert(err.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const handleChunkedUpload = async (file: File, field: string) => {
    setUploading(field)
    setUploadProgress(1)

    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

    try {
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)

        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('uploadId', uploadId)
        formData.append('chunkIndex', String(i))
        formData.append('totalChunks', String(totalChunks))
        formData.append('fileName', file.name)
        formData.append('fileType', file.type)
        formData.append('fileSize', String(file.size))

          // Retry up to 3 times on transient errors (502, 503, 504)
        let res!: Response
        for (let attempt = 0; attempt < 3; attempt++) {
          res = await fetch('/api/upload/chunk', { method: 'POST', body: formData })
          if (res.ok || (res.status < 500 && res.status !== 408)) break
          if (attempt < 2) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
        }

        if (!res.ok) {
          let errMsg = 'Chunk upload failed'
          try { errMsg = (await res.json()).error || errMsg } catch { /* plain-text body */ }
          throw new Error(errMsg)
        }

        const result = await res.json()
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100))

        if (result.assembled && result.media) {
          setForm(prev => ({ ...prev, [field]: result.media.url }))
          setUnsavedVideo(true)
        }
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      alert(error instanceof Error ? error.message : 'Video upload failed. Please try again.')
    } finally {
      setUploading(null)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setUnsavedVideo(false)
        alert('Settings saved successfully!')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <DeleteImageModal open={!!pendingDelete} onConfirm={handleDeleteConfirmed} onCancel={handleCancel} deleting={deleting} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Company Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name (English)
              </label>
              <input
                type="text"
                value={form.companyNameEn}
                onChange={(e) => setForm({ ...form, companyNameEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name (Arabic)
              </label>
              <input
                type="text"
                value={form.companyNameAr}
                onChange={(e) => setForm({ ...form, companyNameAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (English)
              </label>
              <textarea
                value={form.addressEn}
                onChange={(e) => setForm({ ...form, addressEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (Arabic)
              </label>
              <textarea
                value={form.addressAr}
                onChange={(e) => setForm({ ...form, addressAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+20 123 456 7890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="info@criteriadesigns.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Branding</h2>

          {/* Navbar Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Navbar Preview
            </label>
            <div className="bg-gray-800 rounded-lg px-6 py-4 flex items-center gap-3">
              {form.logo && (
                <img src={form.logo} alt="Logo" className="h-[48px] w-auto object-contain" />
              )}
              <span className="text-white text-[20px]" style={{ fontFamily: 'var(--font-libre-franklin), sans-serif' }}>
                {form.companyNameEn || 'Criteria Design Group'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">This is how your logo + name appears in the navbar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Icon
              </label>
              <p className="text-xs text-gray-500 mb-2">Appears before the company name in the navbar</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  {form.logo ? (
                    <img src={form.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-sm">No logo</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm text-center">
                    {uploading === 'logo' ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                      disabled={uploading === 'logo'}
                    />
                  </label>
                  {form.logo && (
                    <button
                      type="button"
                      onClick={() => confirmDeleteImage(form.logo, () => setForm(prev => ({ ...prev, logo: '' })))}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <p className="text-xs text-gray-500 mb-2">Browser tab icon</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  {form.favicon ? (
                    <img src={form.favicon} alt="Favicon" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-xs">No icon</span>
                  )}
                </div>
                <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                  {uploading === 'favicon' ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'favicon')}
                    className="hidden"
                    disabled={uploading === 'favicon'}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Homepage Hero</h2>
          <p className="text-sm text-gray-500">Upload an image and/or video for the homepage hero section. If a video is set, it plays as the background with the image as a fallback/poster.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hero Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image (Fallback / Poster)</label>
              <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-3">
                {form.heroImage ? (
                  <img src={form.heroImage} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No image set
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 text-sm">
                  {uploading === 'heroImage' ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroImage')}
                    className="hidden"
                    disabled={uploading === 'heroImage'}
                  />
                </label>
                {form.heroImage && (
                  <button
                    type="button"
                    onClick={() => confirmDeleteImage(form.heroImage, () => setForm(prev => ({ ...prev, heroImage: '' })))}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Hero Video */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Video (Background)</label>
              <div className="relative w-full h-40 bg-gray-900 rounded-lg overflow-hidden mb-3">
                {form.heroVideo ? (
                  <video src={form.heroVideo} className="w-full h-full object-cover" muted playsInline loop autoPlay />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No video set
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 text-sm">
                  {uploading === 'heroVideo' ? `Uploading ${uploadProgress}%` : 'Upload Video'}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={(e) => handleImageUpload(e, 'heroVideo')}
                    className="hidden"
                    disabled={uploading === 'heroVideo'}
                  />
                </label>
                {form.heroVideo && (
                  <button
                    type="button"
                    onClick={() => confirmDeleteImage(form.heroVideo, () => setForm(prev => ({ ...prev, heroVideo: '' })))}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              {uploading === 'heroVideo' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">MP4, WebM, or MOV. Max 150MB. Plays muted and looped.</p>
              {unsavedVideo && (
                <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 mt-2">
                  Video uploaded — click <strong>Save Settings</strong> below to apply it to the site.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Philosophy Section Images</h2>
          <p className="text-sm text-gray-500">Upload the combined logo and 3 card images for Culture, Nature, and Art. These appear in the &quot;Our Philosophy&quot; section.</p>

          {/* Combined logo — shown at center when the three elements merge, then settles bottom-left */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Combined Logo <span className="text-gray-400 font-normal">(appears when Culture + Nature + Art merge)</span>
            </label>
            <div className="flex items-start gap-4">
              <div className="relative w-36 h-36 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {form.philosophyImage ? (
                  <img src={form.philosophyImage} alt="Combined Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm text-center px-2">No image</div>
                )}
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <label className="px-3 py-1.5 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm inline-block">
                  {uploading === 'philosophyImage' ? 'Uploading...' : 'Upload Combined Logo'}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'philosophyImage')} className="hidden" disabled={uploading === 'philosophyImage'} />
                </label>
                {form.philosophyImage && (
                  <button type="button" onClick={() => confirmDeleteImage(form.philosophyImage, () => setForm(prev => ({ ...prev, philosophyImage: '' })))} className="text-xs text-red-500 hover:text-red-600 text-left">Remove</button>
                )}
                <p className="text-xs text-gray-400 max-w-[260px]">Upload the final Criteria Designs logo (PNG with transparent background recommended).</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
            {([
              { field: 'philosophyCultureImage' as const, label: 'Culture Card Image' },
              { field: 'philosophyNatureImage' as const, label: 'Nature Card Image' },
              { field: 'philosophyArtImage' as const, label: 'Art Card Image' },
            ]).map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <div className="relative w-full h-36 bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {form[field] ? (
                    <img src={form[field]} alt={label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No image</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm">
                    {uploading === field ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field)} className="hidden" disabled={uploading === field} />
                  </label>
                  {form[field] && (
                    <button type="button" onClick={() => confirmDeleteImage(form[field], () => setForm(prev => ({ ...prev, [field]: '' })))} className="text-xs text-red-500 hover:text-red-600">Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Social Media</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter/X
              </label>
              <input
                type="url"
                value={form.twitter}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube
              </label>
              <input
                type="url"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/@..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">SEO Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title (English)
              </label>
              <input
                type="text"
                value={form.seoTitleEn}
                onChange={(e) => setForm({ ...form, seoTitleEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Criteria Designs | Architecture & Interior Design"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title (Arabic)
              </label>
              <input
                type="text"
                value={form.seoTitleAr}
                onChange={(e) => setForm({ ...form, seoTitleAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description (English)
              </label>
              <textarea
                value={form.seoDescriptionEn}
                onChange={(e) => setForm({ ...form, seoDescriptionEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Leading architecture and interior design firm..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description (Arabic)
              </label>
              <textarea
                value={form.seoDescriptionAr}
                onChange={(e) => setForm({ ...form, seoDescriptionAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* ── Showcase Projects ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Homepage Showcase Projects</h2>
          <p className="text-xs text-gray-500">
            <strong>Slot 1</strong> — full-screen featured project (shown above the portfolio section). Leave as None to skip it.<br />
            <strong>Slots 2–5</strong> — displayed as portfolio cards in the scroll section below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              ['showcaseProject1Id', 'Slot 1'],
              ['showcaseProject2Id', 'Slot 2'],
              ['showcaseProject3Id', 'Slot 3'],
              ['showcaseProject4Id', 'Slot 4'],
              ['showcaseProject5Id', 'Slot 5'],
            ] as [keyof typeof form, string][]).map(([field, label]) => (
              <div key={field}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <select
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="">— None —</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.titleEn} ({p.category})</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* ── Awards Section Stats ── */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Awards Section Stats</h2>
          <p className="text-xs text-gray-500">Shown in the stats strip above the accordion panels on the homepage.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Countries (e.g. 12+)</label>
              <input type="text" value={form.awardsCountries} onChange={(e) => setForm({ ...form, awardsCountries: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="12+" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Founded / Since Year (e.g. 2001)</label>
              <input type="text" value={form.awardsSince} onChange={(e) => setForm({ ...form, awardsSince: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="2001" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
