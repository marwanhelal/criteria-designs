'use client'

import { useState, useEffect } from 'react'
import { Save, Upload } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

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
    seoTitleEn: '',
    seoTitleAr: '',
    seoDescriptionEn: '',
    seoDescriptionAr: ''
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
          seoTitleEn: settings.seoTitleEn || '',
          seoTitleAr: settings.seoTitleAr || '',
          seoDescriptionEn: settings.seoDescriptionEn || '',
          seoDescriptionAr: settings.seoDescriptionAr || ''
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
    const file = e.target.files?.[0]
    if (!file) return

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
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(null)
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-16 bg-gray-100 rounded flex items-center justify-center">
                  {form.logo ? (
                    <img src={form.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-sm">No logo</span>
                  )}
                </div>
                <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                  {uploading === 'logo' ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    disabled={uploading === 'logo'}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  {form.favicon ? (
                    <img src={form.favicon} alt="Favicon" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-xs">No icon</span>
                  )}
                </div>
                <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
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
          <h2 className="font-semibold text-lg border-b pb-2">Social Media</h2>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
