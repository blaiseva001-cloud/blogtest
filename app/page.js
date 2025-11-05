'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from './components/Navbar'
import { blogService } from './services/blog'

export default function Home() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true)
      const response = await blogService.getAllBlogs(page)
      setBlogs(response.blogs)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
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
      
      {/* Hero Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Welcome to BlogApp
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover amazing stories and share your own experiences with the world.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {blog.image && (
                <img 
                  src={blog.imageUrl || `http://localhost:8080/uploads/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {blog.authorName}</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <Link 
                  href={`/blog/${blog._id}`}
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchBlogs(page)}
                className={`px-4 py-2 rounded-md ${
                  pagination.current === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No blogs yet</h3>
            <p className="text-gray-500 mt-2">Be the first to create a blog post!</p>
          </div>
        )}
      </div>
    </div>
  )
}