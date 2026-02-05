import { prisma } from '@/lib/db'
import { FolderKanban, Users, Briefcase, FileText } from 'lucide-react'

async function getStats() {
  const [projects, team, services, posts] = await Promise.all([
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.service.count(),
    prisma.blogPost.count(),
  ])

  return { projects, team, services, posts }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { name: 'Projects', count: stats.projects, icon: FolderKanban, color: 'bg-blue-500' },
    { name: 'Team Members', count: stats.team, icon: Users, color: 'bg-green-500' },
    { name: 'Services', count: stats.services, icon: Briefcase, color: 'bg-purple-500' },
    { name: 'Blog Posts', count: stats.posts, icon: FileText, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{card.name}</p>
                  <p className="text-2xl font-bold">{card.count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/admin/projects/new" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              + Add New Project
            </a>
            <a href="/admin/blog/new" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              + Create Blog Post
            </a>
            <a href="/admin/team/new" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              + Add Team Member
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
          <ul className="space-y-2 text-gray-600">
            <li>1. Add your company information in Settings</li>
            <li>2. Upload your team members</li>
            <li>3. Add your services</li>
            <li>4. Showcase your projects</li>
            <li>5. Start writing blog posts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
