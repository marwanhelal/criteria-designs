'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react'
import { useConfirmDelete, ConfirmDeleteModal } from '@/components/admin/DeleteImageModal'

interface Project {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  category: string
  featured: boolean
  status: string
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { confirmDelete, pending, confirming, confirmError, handleConfirmed, handleCancel } = useConfirmDelete()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (Array.isArray(data)) {
        setProjects(data)
      } else {
        console.error('API returned unexpected data:', data)
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string, title: string) => {
    confirmDelete(
      `"${title}" will be permanently deleted along with all its images. This cannot be undone.`,
      async () => {
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete')
        setProjects(prev => prev.filter(p => p.id !== id))
      }
    )
  }

  const categoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      URBAN: 'Urban',
      LANDSCAPE: 'Landscape',
      MIXED_USE: 'Mixed Use',
      COMMERCIAL: 'Commercial',
      RESIDENTIAL: 'Residential',
      EDUCATIONAL: 'Educational',
      HOSPITALITY: 'Hospitality',
      RENOVATION: 'Renovation',
      INTERIOR_COMMERCIAL: 'Interior – Commercial',
      INTERIOR_RESIDENTIAL: 'Interior – Residential',
      INTERIOR: 'Interior Design',
    }
    return labels[category] || category
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <ConfirmDeleteModal open={!!pending} message={pending?.message ?? ''} onConfirm={handleConfirmed} onCancel={handleCancel} confirming={confirming} error={confirmError} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="text-blue-600 hover:underline"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Featured</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{project.titleEn}</p>
                      <p className="text-sm text-gray-500 dir-rtl">{project.titleAr}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {categoryLabel(project.category)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured && (
                      <Star className="text-yellow-500 fill-yellow-500" size={18} />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.titleEn)}
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
