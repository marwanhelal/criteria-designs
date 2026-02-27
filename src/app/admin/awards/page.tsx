'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'

interface Award {
  id: string
  titleEn: string
  titleAr: string
  year: number
  subtitleEn: string | null
  image: string | null
  status: string
  order: number
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAwards()
  }, [])

  const fetchAwards = async () => {
    try {
      const res = await fetch('/api/awards')
      const data = await res.json()
      setAwards(data)
    } catch (error) {
      console.error('Error fetching awards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this award?')) return

    try {
      await fetch(`/api/awards/${id}`, { method: 'DELETE' })
      setAwards(awards.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting award:', error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Awards</h1>
        <Link
          href="/admin/awards/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Award
        </Link>
      </div>

      {awards.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No awards yet</p>
          <Link
            href="/admin/awards/new"
            className="text-blue-600 hover:underline"
          >
            Add your first award
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-10 px-4"></th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Image</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Year</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {awards.map((award) => (
                <tr key={award.id} className="hover:bg-gray-50">
                  <td className="px-4">
                    <GripVertical className="text-gray-400 cursor-move" size={18} />
                  </td>
                  <td className="px-6 py-4">
                    {award.image ? (
                      <img
                        src={award.image}
                        alt={award.titleEn}
                        className="w-16 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{award.titleEn}</p>
                      <p className="text-sm text-gray-500" dir="rtl">{award.titleAr}</p>
                      {award.subtitleEn && (
                        <p className="text-xs text-gray-400 mt-1">{award.subtitleEn}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{award.year}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      award.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {award.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/awards/${award.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(award.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
