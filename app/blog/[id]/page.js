'use client'
import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { blogService } from '../../services/blog'
import Navbar from '../../components/Navbar'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

function BlogDetailContent() {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      fetchBlog()
    }
  }, [id])

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlog(id)
      setBlog(response.blog)
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isAuthor = user && user.id === blog.author._id

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Blog Image */}
          {blog.image && (
            <img 
              src={blog.imageUrl || `URL_WEB/uploads/${blog.image}`}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
          
          {/* Blog Content */}
          <div className="p-6 md:p-8">
            {/* Blog Header */}
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <span className="font-medium">By {blog.authorName}</span>
                  <span>•</span>
                  <time dateTime={blog.createdAt}>
                    {formatDate(blog.createdAt)}
                  </time>
                  {blog.updatedAt !== blog.createdAt && (
                    <>
                      <span>•</span>
                      <span className="text-gray-500">
                        Updated {formatDate(blog.updatedAt)}
                      </span>
                    </>
                  )}
                </div>
                
                {isAuthor && (
                  <div className="flex space-x-2">
                    <Link
                      href={`/edit/${blog._id}`}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </header>

            {/* Blog Body */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {blog.content}
              </div>
            </div>
          </div>
        </article>

        {/* Back to Home */}
        <div className="mt-6">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to all blogs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BlogDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    }>
      <BlogDetailContent />
    </Suspense>
  )
}