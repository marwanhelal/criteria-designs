'use client'

import { useState, useEffect } from 'react'
import { Save, Upload } from 'lucide-react'

const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB chunks

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

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
    logo: '',
    favicon: '',
    heroImage: '',
    heroVideo: '',
    philosophyImage: '',
    seoTitleEn: '',
    seoTitleAr: '',
    seoDescriptionEn: '',
    seoDescriptionAr: '',
    // CEO Banner
    ceoNameEn: '',
    ceoNameAr: '',
    ceoTitleEn: '',
    ceoTitleAr: '',
    ceoImage: '',
    ceoBgImage: '',
    ceoStat1Number: '',
    ceoStat1LabelEn: '',
    ceoStat1LabelAr: '',
    ceoStat1DescEn: '',
    ceoStat1DescAr: '',
    ceoStat2Number: '',
    ceoStat2LabelEn: '',
    ceoStat2LabelAr: '',
    ceoStat3Number: '',
    ceoStat3LabelEn: '',
    ceoStat3LabelAr: '',
    ceoStat4Number: '',
    ceoStat4LabelEn: '',
    ceoStat4LabelAr: '',
    ceoLogo1: '',
    ceoLogo2: '',
    ceoLogo3: '',
    ceoLogo4: '',
    ceoLogo5: '',
    ceoBtnTextEn: '',
    ceoBtnTextAr: '',
    ceoBtnLink: '',
  })

  useEffect(() => {
    fetchSettings()
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
          logo: settings.logo || '',
          favicon: settings.favicon || '',
          heroImage: settings.heroImage || '',
          heroVideo: settings.heroVideo || '',
          philosophyImage: settings.philosophyImage || '',
          seoTitleEn: settings.seoTitleEn || '',
          seoTitleAr: settings.seoTitleAr || '',
          seoDescriptionEn: settings.seoDescriptionEn || '',
          seoDescriptionAr: settings.seoDescriptionAr || '',
          // CEO Banner
          ceoNameEn: settings.ceoNameEn || '',
          ceoNameAr: settings.ceoNameAr || '',
          ceoTitleEn: settings.ceoTitleEn || '',
          ceoTitleAr: settings.ceoTitleAr || '',
          ceoImage: settings.ceoImage || '',
          ceoBgImage: settings.ceoBgImage || '',
          ceoStat1Number: settings.ceoStat1Number || '',
          ceoStat1LabelEn: settings.ceoStat1LabelEn || '',
          ceoStat1LabelAr: settings.ceoStat1LabelAr || '',
          ceoStat1DescEn: settings.ceoStat1DescEn || '',
          ceoStat1DescAr: settings.ceoStat1DescAr || '',
          ceoStat2Number: settings.ceoStat2Number || '',
          ceoStat2LabelEn: settings.ceoStat2LabelEn || '',
          ceoStat2LabelAr: settings.ceoStat2LabelAr || '',
          ceoStat3Number: settings.ceoStat3Number || '',
          ceoStat3LabelEn: settings.ceoStat3LabelEn || '',
          ceoStat3LabelAr: settings.ceoStat3LabelAr || '',
          ceoStat4Number: settings.ceoStat4Number || '',
          ceoStat4LabelEn: settings.ceoStat4LabelEn || '',
          ceoStat4LabelAr: settings.ceoStat4LabelAr || '',
          ceoLogo1: settings.ceoLogo1 || '',
          ceoLogo2: settings.ceoLogo2 || '',
          ceoLogo3: settings.ceoLogo3 || '',
          ceoLogo4: settings.ceoLogo4 || '',
          ceoLogo5: settings.ceoLogo5 || '',
          ceoBtnTextEn: settings.ceoBtnTextEn || '',
          ceoBtnTextAr: settings.ceoBtnTextAr || '',
          ceoBtnLink: settings.ceoBtnLink || '',
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon' | 'heroImage' | 'heroVideo' | 'philosophyImage' | 'ceoImage' | 'ceoBgImage' | 'ceoLogo1' | 'ceoLogo2' | 'ceoLogo3' | 'ceoLogo4' | 'ceoLogo5') => {
    const file = e.target.files?.[0]
    if (!file) return

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

        const res = await fetch('/api/upload/chunk', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Chunk upload failed')
        }

        const result = await res.json()
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100))

        if (result.assembled && result.media) {
          setForm(prev => ({ ...prev, [field]: result.media.url }))
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
                      onClick={() => setForm(prev => ({ ...prev, logo: '' }))}
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
                    onClick={() => setForm(prev => ({ ...prev, heroImage: '' }))}
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
                    onClick={() => setForm(prev => ({ ...prev, heroVideo: '' }))}
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
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Philosophy Section Image</h2>
          <p className="text-sm text-gray-500">This image appears in the &quot;Our Philosophy&quot; section on the homepage (Culture, Nature, Art).</p>
          <div>
            <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden mb-4">
              {form.philosophyImage ? (
                <img src={form.philosophyImage} alt="Philosophy" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No philosophy image set
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                {uploading === 'philosophyImage' ? 'Uploading...' : 'Upload Philosophy Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'philosophyImage')}
                  className="hidden"
                  disabled={uploading === 'philosophyImage'}
                />
              </label>
              {form.philosophyImage && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, philosophyImage: '' }))}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
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

        {/* CEO / Founder Banner */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">CEO / Founder Banner</h2>
          <p className="text-sm text-gray-500">This banner appears on the homepage after the Philosophy section. Leave the name empty to hide the section.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
              <input type="text" value={form.ceoNameEn} onChange={(e) => setForm({ ...form, ceoNameEn: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="HESHAM A. HELAL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
              <input type="text" value={form.ceoNameAr} onChange={(e) => setForm({ ...form, ceoNameAr: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" dir="rtl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
              <input type="text" value={form.ceoTitleEn} onChange={(e) => setForm({ ...form, ceoTitleEn: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="CEO & FOUNDER, M.Sc" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Arabic)</label>
              <input type="text" value={form.ceoTitleAr} onChange={(e) => setForm({ ...form, ceoTitleAr: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" dir="rtl" />
            </div>
          </div>

          {/* Portrait + Background Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portrait Photo</label>
              <p className="text-xs text-gray-500 mb-2">Displayed in a circle on the left side of the banner</p>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {form.ceoImage ? (
                    <img src={form.ceoImage} alt="CEO" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs">No photo</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm text-center">
                    {uploading === 'ceoImage' ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ceoImage')} className="hidden" disabled={uploading === 'ceoImage'} />
                  </label>
                  {form.ceoImage && (
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, ceoImage: '' }))} className="text-xs text-red-500 hover:text-red-600">Remove</button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
              <p className="text-xs text-gray-500 mb-2">Architectural image shown behind the banner</p>
              <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden mb-2">
                {form.ceoBgImage ? (
                  <img src={form.ceoBgImage} alt="BG" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">No background</div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                  {uploading === 'ceoBgImage' ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ceoBgImage')} className="hidden" disabled={uploading === 'ceoBgImage'} />
                </label>
                {form.ceoBgImage && (
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, ceoBgImage: '' }))} className="text-xs text-red-500 hover:text-red-600">Remove</button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <h3 className="font-medium text-sm text-gray-700 border-t pt-4 mt-4">Stats (4 items)</h3>
          {[1, 2, 3, 4].map((n) => {
            const numKey = `ceoStat${n}Number` as keyof typeof form
            const labelEnKey = `ceoStat${n}LabelEn` as keyof typeof form
            const labelArKey = `ceoStat${n}LabelAr` as keyof typeof form
            return (
              <div key={n} className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stat {n} Number</label>
                  <input type="text" value={form[numKey]} onChange={(e) => setForm({ ...form, [numKey]: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={n === 1 ? '+25' : n === 2 ? '+500' : n === 3 ? '6' : '5'} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Label (EN)</label>
                  <input type="text" value={form[labelEnKey]} onChange={(e) => setForm({ ...form, [labelEnKey]: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder={n === 1 ? 'YEARS' : n === 2 ? 'COMPLETED PROJECTS' : n === 3 ? 'PUBLISHED PAPERS' : 'COUNTRIES'} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Label (AR)</label>
                  <input type="text" value={form[labelArKey]} onChange={(e) => setForm({ ...form, [labelArKey]: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" dir="rtl" />
                </div>
              </div>
            )
          })}
          {/* Stat 1 description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Stat 1 Description (EN)</label>
              <input type="text" value={form.ceoStat1DescEn} onChange={(e) => setForm({ ...form, ceoStat1DescEn: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="merging creativity with functionality" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Stat 1 Description (AR)</label>
              <input type="text" value={form.ceoStat1DescAr} onChange={(e) => setForm({ ...form, ceoStat1DescAr: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" dir="rtl" />
            </div>
          </div>

          {/* Logos */}
          <h3 className="font-medium text-sm text-gray-700 border-t pt-4 mt-4">Conference / Certification Logos (up to 5)</h3>
          <div className="flex flex-wrap gap-4">
            {(['ceoLogo1', 'ceoLogo2', 'ceoLogo3', 'ceoLogo4', 'ceoLogo5'] as const).map((logoKey, i) => (
              <div key={logoKey} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {form[logoKey] ? (
                    <img src={form[logoKey]} alt={`Logo ${i + 1}`} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-300 text-xs">{i + 1}</span>
                  )}
                </div>
                <label className="px-3 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-xs">
                  {uploading === logoKey ? '...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, logoKey)} className="hidden" disabled={uploading === logoKey} />
                </label>
                {form[logoKey] && (
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, [logoKey]: '' }))} className="text-xs text-red-500">Remove</button>
                )}
              </div>
            ))}
          </div>

          {/* Button */}
          <h3 className="font-medium text-sm text-gray-700 border-t pt-4 mt-4">Button</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Button Text (EN)</label>
              <input type="text" value={form.ceoBtnTextEn} onChange={(e) => setForm({ ...form, ceoBtnTextEn: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="SEE MORE" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Button Text (AR)</label>
              <input type="text" value={form.ceoBtnTextAr} onChange={(e) => setForm({ ...form, ceoBtnTextAr: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" dir="rtl" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Button Link</label>
              <input type="text" value={form.ceoBtnLink} onChange={(e) => setForm({ ...form, ceoBtnLink: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="/about" />
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
