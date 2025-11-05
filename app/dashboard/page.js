'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { blogService } from '../services/blog'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { useToast } from '../components/CustomToastProvider'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const { success, error } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchDashboardData()
  }, [isAuthenticated, router])

  const fetchDashboardData = async () => {
    try {
      const data = await blogService.getDashboard()
      setDashboardData(data)
    } catch (error) {
      error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      await blogService.deleteBlog(blogId)
      success('Blog deleted successfully')
      fetchDashboardData() // Refresh data
    } catch (error) {
      error('Failed to delete blog')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your blog posts and track your activity.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Total Blogs</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {dashboardData?.stats.totalBlogs || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {dashboardData?.stats.recentActivity || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <Link 
              href="/create"
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Create New Blog
            </Link>
          </div>
        </div>

        {/* My Blogs Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Blogs</h2>
          </div>
          
          <div className="p-6">
            {dashboardData?.blogs && dashboardData.blogs.length > 0 ? (
              <div className="space-y-6">
                {dashboardData.blogs.map((blog) => (
                  <div key={blog._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {blog.content}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <span>Created: {formatDate(blog.createdAt)}</span>
                          {blog.updatedAt !== blog.createdAt && (
                            <span className="ml-4">
                              Updated: {formatDate(blog.updatedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Link
                          href={`/blog/${blog._id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          View
                        </Link>
                        <Link
                          href={`/edit/${blog._id}`}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">No blogs yet</h3>
                <p className="text-gray-500 mt-2">
                  Start sharing your thoughts with the world!
                </p>
                <Link
                  href="/create"
                  className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Create Your First Blog
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}